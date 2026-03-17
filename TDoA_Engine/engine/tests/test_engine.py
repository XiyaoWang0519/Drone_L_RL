import asyncio
import json
import math
import os
import struct
import tempfile
import unittest

import numpy as np

from TDoA_Engine.engine import config as engine_config
from TDoA_Engine.engine.autocal import estimate_clock_params, estimate_layout_from_twr
from TDoA_Engine.engine.ingest import (
    DEFAULT_SLOT_START_UUS,
    DEFAULT_SLOT_UUS,
    DRONE_CLOCK_MODE,
    LEGACY_ANC_FMT,
    LEGACY_HDR_FMT,
    LEGACY_MAGIC,
    OBS_KIND_TOA,
    TS40_MASK,
    DroneSerialEpochAssembler,
    TimestampUnwrapper,
    default_radio_schedule,
    iter_logged_epochs,
    parse_packet,
    parse_drone_console_line,
    serialize_epoch_record,
)
from TDoA_Engine.engine.service import http_api
from TDoA_Engine.engine.solver.tdoa import solve_tdoa

C_AIR = 299_702_547.0


def make_legacy_packet(seq: int, t_tx: float, anchors: list[dict]) -> bytes:
    payload = struct.pack(LEGACY_HDR_FMT, LEGACY_MAGIC, 0, seq, t_tx, len(anchors))
    for anchor in anchors:
        payload += struct.pack(
            LEGACY_ANC_FMT,
            anchor["aid"],
            anchor["ticks"],
            anchor.get("q_ns2", 0.15 ** 2),
            anchor.get("snr_db", 20.0),
            anchor.get("nlos_score", 0.0),
        )
    total = len(payload)
    return struct.pack("<H", LEGACY_MAGIC) + struct.pack("<H", total - 4) + payload[4:]


class TestSolver(unittest.TestCase):
    def test_solve_tdoa_recovers_position(self):
        anchors = np.array(
            [
                [0.0, 0.0, 2.40],
                [8.0, 0.0, 2.65],
                [8.0, 6.0, 2.20],
                [0.0, 6.0, 2.55],
            ],
            dtype=float,
        )
        tag = np.array([3.2, 2.6, 1.3], dtype=float)
        d_ref = np.linalg.norm(tag - anchors[0])
        drho = np.array([np.linalg.norm(tag - anchor) - d_ref for anchor in anchors[1:]], dtype=float)
        x0 = np.mean(anchors, axis=0)
        res = solve_tdoa(anchors, drho, x0, max_iter=16, huber_delta=0.2)
        self.assertTrue(np.allclose(res["x"], tag, atol=1e-2))


class TestAutocal(unittest.TestCase):
    def test_layout_from_edges(self):
        edges = [
            {"a": "A1", "b": "A2", "dist_m": 8.0},
            {"a": "A2", "b": "A3", "dist_m": 6.0},
            {"a": "A3", "b": "A4", "dist_m": 8.0},
            {"a": "A4", "b": "A1", "dist_m": 6.0},
            {"a": "A1", "b": "A3", "dist_m": math.hypot(8.0, 6.0)},
            {"a": "A2", "b": "A4", "dist_m": math.hypot(8.0, 6.0)},
        ]
        result = estimate_layout_from_twr(edges, dims=3)
        anchors = {anchor["id"]: anchor["pos"] for anchor in result["anchors"]}
        self.assertEqual(result["quality"]["status"], "ok")
        self.assertAlmostEqual(anchors["A1"]["x"], 0.0, places=2)
        self.assertAlmostEqual(anchors["A1"]["y"], 0.0, places=2)
        self.assertAlmostEqual(anchors["A2"]["y"], 0.0, places=2)
        self.assertAlmostEqual(anchors["A2"]["x"], 8.0, places=1)
        self.assertAlmostEqual(anchors["A3"]["x"], 8.0, places=1)
        self.assertAlmostEqual(anchors["A3"]["y"], 6.0, places=1)

    def test_clock_estimation(self):
        t_ref = np.linspace(0.0, 0.2, 20)
        alpha = 1.0 + 0.35e-6
        beta = 25e-9
        measurements = [{"id": "A1", "t_ref": float(tr), "t_anchor": float(alpha * tr + beta)} for tr in t_ref]
        result = estimate_clock_params(measurements)
        clock = result["clocks"][0]
        self.assertAlmostEqual(clock["drift_ppm"], 0.35, places=2)
        self.assertAlmostEqual(clock["offset_ns"], 25.0, places=1)


class TestDroneConsoleParser(unittest.TestCase):
    def test_parse_sync_line(self):
        parsed = parse_drone_console_line("DRONE: SYNC master=1 seq=7 t1=12345 ts=12456 ok=8")
        self.assertEqual(parsed["type"], "sync")
        event = parsed["event"]
        self.assertEqual(event.master_id, 1)
        self.assertEqual(event.seq, 7)
        self.assertEqual(event.t1_master_raw, 12345)
        self.assertEqual(event.t2_drone_raw, 12456)

    def test_parse_blink_line(self):
        parsed = parse_drone_console_line("DRONE: BLINK id=3 seq=9 slot=2 flags=1 ts=22222 ok=4")
        self.assertEqual(parsed["type"], "blink")
        event = parsed["event"]
        self.assertEqual(event.beacon_id, 3)
        self.assertEqual(event.seq, 9)
        self.assertEqual(event.slot_id, 2)
        self.assertEqual(event.flags, 1)
        self.assertEqual(event.rx_ts_raw, 22222)

    def test_ignore_diagnostic_lines(self):
        parsed = parse_drone_console_line("DRONE: SYNC_ERR seq=7 err_ns=1.20")
        self.assertEqual(parsed["type"], "ignored")

    def test_unknown_line(self):
        parsed = parse_drone_console_line("hello from elsewhere")
        self.assertEqual(parsed["type"], "unknown")


class TestTimestampUnwrapper(unittest.TestCase):
    def test_unwraps_rollover(self):
        unwrapper = TimestampUnwrapper()
        seq = [TS40_MASK - 4, TS40_MASK - 1, 5]
        values = [unwrapper.unwrap(value) for value in seq]
        self.assertEqual(values[0], TS40_MASK - 4)
        self.assertEqual(values[1], TS40_MASK - 1)
        self.assertEqual(values[2], TS40_MASK + 6)


class TestDroneSerialAssembler(unittest.TestCase):
    def setUp(self):
        self.schedule = {
            "tick_hz": 63_897_600_000.0,
            "superframe_uus": 20_000,
            "slot_start_uus": DEFAULT_SLOT_START_UUS,
            "slot_uus": DEFAULT_SLOT_UUS,
            "master_beacon_id": 1,
        }
        self.assembler = DroneSerialEpochAssembler(radio_schedule=self.schedule, min_emit_anchors=3)
        self.base_ticks = int(round(self.schedule["tick_hz"] / 1e6))
        self.superframe_ticks = self.schedule["superframe_uus"] * self.base_ticks

    def _slot_offset(self, slot_id: int) -> int:
        return (self.schedule["slot_start_uus"] + slot_id * self.schedule["slot_uus"]) * self.base_ticks

    def test_emits_epoch_after_second_sync(self):
        sync_seq = 40
        t1_sync = 2_000_000_000
        beta = 250
        t2_sync = t1_sync + beta
        next_t1 = t1_sync + self.superframe_ticks
        next_t2 = next_t1 + beta

        outputs = self.assembler.ingest_line(f"DRONE: SYNC master=1 seq={sync_seq} t1={t1_sync} ts={t2_sync} ok=1")
        self.assertEqual(outputs, [])

        toa_ticks = {1: 900.0, 2: 1100.0, 3: 1300.0}
        for beacon_id, slot_id in ((1, 0), (2, 1), (3, 2)):
            rx_ts = t1_sync + self._slot_offset(slot_id) + beta + toa_ticks[beacon_id]
            self.assembler.ingest_line(
                f"DRONE: BLINK id={beacon_id} seq={sync_seq} slot={slot_id} flags=0 ts={int(rx_ts)} ok=1"
            )

        outputs = self.assembler.ingest_line(f"DRONE: SYNC master=1 seq={sync_seq + 1} t1={next_t1} ts={next_t2} ok=2")
        self.assertEqual(len(outputs), 1)
        epoch = outputs[0]
        self.assertEqual(epoch["observation_kind"], OBS_KIND_TOA)
        self.assertEqual(epoch["clock"]["mode"], DRONE_CLOCK_MODE)
        obs = {anchor["id"]: anchor["t_obs_ticks"] for anchor in epoch["anchors"]}
        self.assertAlmostEqual(obs["A1"], toa_ticks[1], places=3)
        self.assertAlmostEqual(obs["A2"], toa_ticks[2], places=3)
        self.assertAlmostEqual(obs["A3"], toa_ticks[3], places=3)
        self.assertTrue(self.assembler.snapshot()["sync_locked"])

    def test_partial_epoch_is_tracked(self):
        sync_seq = 12
        t1_sync = 5_000_000_000
        beta = 100
        outputs = self.assembler.ingest_line(f"DRONE: SYNC master=1 seq={sync_seq} t1={t1_sync} ts={t1_sync + beta} ok=1")
        self.assertEqual(outputs, [])
        for beacon_id, slot_id in ((1, 0), (2, 1)):
            rx_ts = t1_sync + self._slot_offset(slot_id) + beta + 1000
            self.assembler.ingest_line(
                f"DRONE: BLINK id={beacon_id} seq={sync_seq} slot={slot_id} flags=0 ts={int(rx_ts)} ok=1"
            )
        outputs = self.assembler.ingest_line(
            f"DRONE: SYNC master=1 seq={sync_seq + 1} t1={t1_sync + self.superframe_ticks} ts={t1_sync + self.superframe_ticks + beta} ok=2"
        )
        self.assertEqual(outputs, [])
        self.assertEqual(self.assembler.snapshot()["partial_epochs"], 1)

    def test_out_of_order_sync_is_ignored(self):
        self.assembler.ingest_line("DRONE: SYNC master=1 seq=5 t1=100 ts=120 ok=1")
        outputs = self.assembler.ingest_line("DRONE: SYNC master=1 seq=4 t1=50 ts=70 ok=1")
        self.assertEqual(outputs, [])
        self.assertEqual(self.assembler.snapshot()["out_of_order_lines"], 1)

    def test_sequence_wraparound_continues_ingest(self):
        sync_seq = 0xFFFF
        t1_sync = 2_000_000_000
        beta = 250
        t2_sync = t1_sync + beta
        next_t1 = t1_sync + self.superframe_ticks
        next_t2 = next_t1 + beta
        after_wrap_t1 = next_t1 + self.superframe_ticks
        after_wrap_t2 = after_wrap_t1 + beta

        self.assertEqual(
            self.assembler.ingest_line(f"DRONE: SYNC master=1 seq={sync_seq} t1={t1_sync} ts={t2_sync} ok=1"),
            [],
        )
        for beacon_id, slot_id in ((1, 0), (2, 1), (3, 2)):
            rx_ts = t1_sync + self._slot_offset(slot_id) + beta + 1000 + beacon_id
            self.assembler.ingest_line(
                f"DRONE: BLINK id={beacon_id} seq={sync_seq} slot={slot_id} flags=0 ts={int(rx_ts)} ok=1"
            )

        outputs = self.assembler.ingest_line("DRONE: SYNC master=1 seq=0 t1=%d ts=%d ok=2" % (next_t1, next_t2))
        self.assertEqual(len(outputs), 1)
        self.assertEqual(outputs[0]["tag_tx_seq"], sync_seq)
        self.assertEqual(self.assembler.snapshot()["out_of_order_lines"], 0)

        for beacon_id, slot_id in ((1, 0), (2, 1), (3, 2)):
            rx_ts = next_t1 + self._slot_offset(slot_id) + beta + 2000 + beacon_id
            self.assembler.ingest_line(
                f"DRONE: BLINK id={beacon_id} seq=0 slot={slot_id} flags=0 ts={int(rx_ts)} ok=2"
            )

        outputs = self.assembler.ingest_line(
            "DRONE: SYNC master=1 seq=1 t1=%d ts=%d ok=3" % (after_wrap_t1, after_wrap_t2)
        )
        self.assertEqual(len(outputs), 1)
        self.assertEqual(outputs[0]["tag_tx_seq"], 0)

    def test_reset_clears_stale_sync_state(self):
        self.assembler.ingest_line("DRONE: SYNC master=1 seq=200 t1=1000 ts=1100 ok=1")
        self.assembler.ingest_line("DRONE: SYNC master=1 seq=5 t1=1200 ts=1300 ok=2")
        self.assertEqual(self.assembler.snapshot()["out_of_order_lines"], 1)

        self.assembler.reset()

        self.assembler.ingest_line("DRONE: SYNC master=1 seq=5 t1=1200 ts=1300 ok=3")
        snapshot = self.assembler.snapshot()
        self.assertEqual(snapshot["out_of_order_lines"], 0)
        self.assertEqual(snapshot["last_superframe_seq"], 5)



class TestLogFormats(unittest.TestCase):
    def test_iter_logged_epochs_reads_normalized_records(self):
        epoch = {
            "tag_tx_seq": 3,
            "t_tx_tag": 1.23,
            "anchors": [{"id": "A1", "t_obs_ticks": 1000.0, "q": 0.15 ** 2}],
            "clock": {"tick_hz": 63_897_600_000.0, "mode": "drone_sync"},
            "observation_kind": "toa",
            "source": "drone_serial",
        }
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(serialize_epoch_record(epoch))
            path = tmp.name
        try:
            loaded = list(iter_logged_epochs(path))
            self.assertEqual(len(loaded), 1)
            self.assertEqual(loaded[0]["tag_tx_seq"], epoch["tag_tx_seq"])
            self.assertEqual(loaded[0]["anchors"][0]["id"], "A1")
        finally:
            os.unlink(path)

    def test_iter_logged_epochs_reads_legacy_raw_stream(self):
        packet_a = make_legacy_packet(
            seq=1,
            t_tx=1.0,
            anchors=[{"aid": 1, "ticks": 123456}, {"aid": 2, "ticks": 123999}],
        )
        packet_b = make_legacy_packet(
            seq=2,
            t_tx=1.02,
            anchors=[{"aid": 1, "ticks": 223456}, {"aid": 2, "ticks": 223999}],
        )
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(packet_a)
            tmp.write(packet_b)
            path = tmp.name
        try:
            loaded = list(iter_logged_epochs(path))
            self.assertEqual([epoch["tag_tx_seq"] for epoch in loaded], [1, 2])
            self.assertEqual(loaded[0]["anchors"][0]["id"], "A1")
        finally:
            os.unlink(path)


class TestIngestConfiguration(unittest.TestCase):
    def setUp(self):
        self.prev_tick_hz = engine_config.TICK_HZ

    def tearDown(self):
        engine_config.TICK_HZ = self.prev_tick_hz

    def test_default_radio_schedule_uses_configured_tick_hz(self):
        engine_config.TICK_HZ = 123.0
        self.assertEqual(default_radio_schedule()["tick_hz"], 123.0)

    def test_parse_packet_uses_configured_tick_hz(self):
        engine_config.TICK_HZ = 123.0
        packet = make_legacy_packet(seq=1, t_tx=1.0, anchors=[{"aid": 1, "ticks": 123456}])
        parsed = parse_packet(packet)
        self.assertEqual(parsed["clock"]["tick_hz"], 123.0)


class TestComputePose(unittest.TestCase):
    def setUp(self):
        self.prev_anchors = http_api.STATE.anchors.copy()
        self.prev_clocks = http_api.STATE.clock_params.copy()
        self.prev_dim = http_api.STATE.dim
        self.prev_schedule = dict(http_api.STATE.radio_schedule)
        http_api.STATE.anchors = {
            "A1": np.array([0.0, 0.0, 2.40]),
            "A2": np.array([8.0, 0.0, 2.65]),
            "A3": np.array([8.0, 6.0, 2.20]),
            "A4": np.array([0.0, 6.0, 2.55]),
        }
        http_api.STATE.update_dimension_from_anchors()
        http_api.STATE.update_clock_params(
            [
                {"id": "A1", "offset_ns": 0.0, "drift_ppm": 0.0},
                {"id": "A2", "offset_ns": 2.5, "drift_ppm": 0.35},
                {"id": "A3", "offset_ns": -1.8, "drift_ppm": -0.20},
                {"id": "A4", "offset_ns": 0.0, "drift_ppm": 0.10},
            ]
        )
        http_api.STATE.update_radio_schedule({"tick_hz": 63_897_600_000.0})
        http_api.STATE.reset_filter()

    def tearDown(self):
        http_api.STATE.anchors = self.prev_anchors
        http_api.STATE.clock_params = self.prev_clocks
        http_api.STATE.update_radio_schedule(self.prev_schedule)
        http_api.STATE.update_dimension_from_anchors()
        http_api.STATE.set_dim(self.prev_dim)
        http_api.STATE.reset_filter()

    def test_compute_pose_with_clock_compensation(self):
        tag_pos = np.array([3.2, 2.6, 1.3], dtype=float)
        t_tx = 1.0
        tick_hz = http_api.STATE.tick_hz
        epoch = {"tag_tx_seq": 1, "t_tx_tag": t_tx, "anchors": [], "clock": {"tick_hz": tick_hz}}
        for anchor_id, pos in http_api.STATE.anchors.items():
            dist = np.linalg.norm(tag_pos - pos)
            t_true = t_tx + dist / C_AIR
            params = http_api.STATE.clock_params.get(anchor_id, {"offset_ns": 0.0, "drift_ppm": 0.0})
            offset = params.get("offset_ns", 0.0) * 1e-9
            drift = params.get("drift_ppm", 0.0) * 1e-6
            t_anchor = (1.0 + drift) * t_true + offset
            epoch["anchors"].append(
                {
                    "id": anchor_id,
                    "t_rx_anc": t_anchor * tick_hz,
                    "q": 0.15 ** 2,
                    "cir_snr_db": 20.0,
                    "nlos_score": 0.0,
                }
            )
        result = http_api.compute_pose(epoch)
        self.assertTrue(result["ok"])
        self.assertAlmostEqual(result["pose"]["x"], tag_pos[0], places=2)
        self.assertAlmostEqual(result["pose"]["y"], tag_pos[1], places=2)
        self.assertAlmostEqual(result["pose"]["z"], tag_pos[2], places=2)

    def test_compute_pose_degrades_without_clock_compensation(self):
        tag_pos = np.array([3.2, 2.6, 1.3], dtype=float)
        t_tx = 1.0
        tick_hz = http_api.STATE.tick_hz
        epoch = {"tag_tx_seq": 1, "t_tx_tag": t_tx, "anchors": [], "clock": {"tick_hz": tick_hz}}
        true_clocks = {
            "A1": {"offset_ns": 0.0, "drift_ppm": 0.0},
            "A2": {"offset_ns": 2.5, "drift_ppm": 0.0},
            "A3": {"offset_ns": -1.8, "drift_ppm": 0.0},
            "A4": {"offset_ns": 0.0, "drift_ppm": 0.0},
        }
        for anchor_id, pos in http_api.STATE.anchors.items():
            dist = np.linalg.norm(tag_pos - pos)
            t_true = t_tx + dist / C_AIR
            params = true_clocks.get(anchor_id, {"offset_ns": 0.0, "drift_ppm": 0.0})
            offset = params.get("offset_ns", 0.0) * 1e-9
            drift = params.get("drift_ppm", 0.0) * 1e-6
            t_anchor = (1.0 + drift) * t_true + offset
            epoch["anchors"].append(
                {
                    "id": anchor_id,
                    "t_rx_anc": t_anchor * tick_hz,
                    "q": 0.15 ** 2,
                    "cir_snr_db": 20.0,
                    "nlos_score": 0.0,
                }
            )
        http_api.STATE.update_clock_params([{"id": anchor_id, "offset_ns": 0.0, "drift_ppm": 0.0} for anchor_id in true_clocks])
        http_api.STATE.reset_filter()
        result = http_api.compute_pose(epoch)
        self.assertTrue(result["ok"])
        est = np.array([result["pose"]["x"], result["pose"]["y"], result["pose"]["z"]], dtype=float)
        self.assertGreater(float(np.linalg.norm(est - tag_pos)), 0.25)

    def test_compute_pose_from_drone_toa_epoch(self):
        http_api.STATE.anchors = {
            "A1": np.array([0.0, 0.0, 0.0]),
            "A2": np.array([5.0, 0.0, 0.0]),
            "A3": np.array([0.0, 5.0, 0.0]),
        }
        http_api.STATE.update_dimension_from_anchors()
        http_api.STATE.reset_filter()
        tag_pos = np.array([1.2, 1.4, 0.0], dtype=float)
        tick_hz = http_api.STATE.tick_hz
        epoch = {
            "tag_tx_seq": 8,
            "t_tx_tag": 5.0,
            "clock": {"tick_hz": tick_hz, "mode": DRONE_CLOCK_MODE},
            "observation_kind": OBS_KIND_TOA,
            "anchors": [],
        }
        for anchor_id, pos in http_api.STATE.anchors.items():
            dist = np.linalg.norm(tag_pos - pos)
            epoch["anchors"].append({"id": anchor_id, "t_obs_ticks": dist / C_AIR * tick_hz, "q": 0.05 ** 2})
        result = http_api.compute_pose(epoch)
        self.assertTrue(result["ok"])
        self.assertAlmostEqual(result["pose"]["x"], tag_pos[0], places=2)
        self.assertAlmostEqual(result["pose"]["y"], tag_pos[1], places=2)
        self.assertAlmostEqual(result["pose"]["z"], 0.0, places=2)

    def test_dimension_detection_from_anchor_layout(self):
        http_api.STATE.anchors = {
            "A1": np.array([0.0, 0.0, 0.0]),
            "A2": np.array([5.0, 0.0, 0.0]),
            "A3": np.array([0.0, 5.0, 0.0]),
            "A4": np.array([5.0, 5.0, 0.0]),
        }
        http_api.STATE.update_dimension_from_anchors()
        self.assertEqual(http_api.STATE.dim, 2)
        http_api.STATE.anchors = {
            "A1": np.array([0.0, 0.0, 0.0]),
            "A2": np.array([5.0, 0.0, 0.0]),
            "A3": np.array([0.0, 5.0, 1.2]),
            "A4": np.array([5.0, 5.0, 2.0]),
        }
        http_api.STATE.update_dimension_from_anchors()
        self.assertEqual(http_api.STATE.dim, 3)


class TestCalibrationApi(unittest.TestCase):
    def setUp(self):
        self.prev_anchors = http_api.STATE.anchors.copy()
        self.prev_clocks = http_api.STATE.clock_params.copy()
        self.prev_dim = http_api.STATE.dim
        self.prev_schedule = dict(http_api.STATE.radio_schedule)
        self.prev_tick_hz = engine_config.TICK_HZ
        self.prev_calibration_file = engine_config.CALIBRATION_FILE
        self.prev_save_calibration = http_api.save_calibration
        self.saved_payloads = []
        http_api.save_calibration = lambda payload: self.saved_payloads.append(payload)

    def tearDown(self):
        http_api.STATE.anchors = self.prev_anchors
        http_api.STATE.clock_params = self.prev_clocks
        http_api.STATE.set_dim(self.prev_dim)
        http_api.STATE.update_radio_schedule(self.prev_schedule)
        http_api.STATE.reset_filter()
        engine_config.TICK_HZ = self.prev_tick_hz
        engine_config.CALIBRATION_FILE = self.prev_calibration_file
        http_api.save_calibration = self.prev_save_calibration

    def test_set_anchors_preserves_schedule_when_omitted(self):
        preserved_schedule = {
            "tick_hz": 63_897_600_000.0,
            "superframe_uus": 50_000,
            "slot_start_uus": 8_000,
            "slot_uus": 1_500,
            "master_beacon_id": 3,
        }
        http_api.STATE.update_radio_schedule(preserved_schedule)
        payload = {
            "anchors": [
                {"id": "A1", "pos": {"x": 0.0, "y": 0.0, "z": 0.0}},
                {"id": "A2", "pos": {"x": 5.0, "y": 0.0, "z": 0.0}},
                {"id": "A3", "pos": {"x": 0.0, "y": 5.0, "z": 0.0}},
            ]
        }

        result = asyncio.run(http_api.set_anchors(payload))

        self.assertTrue(result["ok"])
        self.assertEqual(http_api.STATE.radio_schedule, preserved_schedule)

    def test_set_anchors_preserves_clocks_when_omitted(self):
        preserved_clocks = [
            {"id": "A1", "offset_ns": 1.5, "drift_ppm": 0.25, "valid": True},
            {"id": "A2", "offset_ns": -2.0, "drift_ppm": -0.10, "valid": False},
        ]
        http_api.STATE.update_clock_params(preserved_clocks)
        payload = {
            "anchors": [
                {"id": "A1", "pos": {"x": 0.0, "y": 0.0, "z": 0.0}},
                {"id": "A2", "pos": {"x": 5.0, "y": 0.0, "z": 0.0}},
                {"id": "A3", "pos": {"x": 0.0, "y": 5.0, "z": 0.0}},
            ]
        }

        result = asyncio.run(http_api.set_anchors(payload))

        self.assertTrue(result["ok"])
        self.assertEqual(http_api.STATE.clock_params["A1"]["offset_ns"], 1.5)
        self.assertEqual(http_api.STATE.clock_params["A2"]["valid"], False)
        self.assertEqual(self.saved_payloads[-1]["anchor_clocks"], preserved_clocks)

    def test_load_calibration_uses_configured_tick_hz_without_radio_schedule(self):
        calibration = {
            "anchors": [
                {"id": "A1", "pos": {"x": 0.0, "y": 0.0, "z": 0.0}},
                {"id": "A2", "pos": {"x": 5.0, "y": 0.0, "z": 0.0}},
                {"id": "A3", "pos": {"x": 0.0, "y": 5.0, "z": 0.0}},
            ]
        }
        with tempfile.NamedTemporaryFile("w", delete=False, suffix=".json") as tmp:
            json.dump(calibration, tmp)
            path = tmp.name
        try:
            engine_config.TICK_HZ = 123.0
            engine_config.CALIBRATION_FILE = path

            http_api.load_calibration()

            self.assertEqual(http_api.STATE.tick_hz, 123.0)
            self.assertEqual(http_api.STATE.radio_schedule["tick_hz"], 123.0)
        finally:
            os.unlink(path)


if __name__ == "__main__":
    unittest.main()
