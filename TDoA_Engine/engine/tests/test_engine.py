import math
import unittest

import numpy as np

from TDoA_Engine.engine.autocal import estimate_clock_params, estimate_layout_from_twr
from TDoA_Engine.engine.service import http_api
from TDoA_Engine.engine.solver.tdoa import solve_tdoa

C_AIR = 299_702_547.0


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
        drho = np.array([np.linalg.norm(tag - a) - d_ref for a in anchors[1:]], dtype=float)
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
        anchors = {a["id"]: a["pos"] for a in result["anchors"]}
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
        measurements = [
            {"id": "A1", "t_ref": float(tr), "t_anchor": float(alpha * tr + beta)}
            for tr in t_ref
        ]
        result = estimate_clock_params(measurements)
        clock = result["clocks"][0]
        self.assertAlmostEqual(clock["drift_ppm"], 0.35, places=2)
        self.assertAlmostEqual(clock["offset_ns"], 25.0, places=1)


class TestComputePose(unittest.TestCase):
    def setUp(self):
        self.prev_anchors = http_api.STATE.anchors.copy()
        self.prev_clocks = http_api.STATE.clock_params.copy()
        self.prev_dim = http_api.STATE.dim
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
        http_api.STATE.reset_filter()

    def tearDown(self):
        http_api.STATE.anchors = self.prev_anchors
        http_api.STATE.clock_params = self.prev_clocks
        http_api.STATE.update_dimension_from_anchors()
        http_api.STATE.set_dim(self.prev_dim)
        http_api.STATE.reset_filter()

    def test_compute_pose_with_clock_compensation(self):
        tag_pos = np.array([3.2, 2.6, 1.3], dtype=float)
        t_tx = 1.0
        tick_hz = http_api.STATE.tick_hz
        anchors = http_api.STATE.anchors
        epoch = {"tag_tx_seq": 1, "t_tx_tag": t_tx, "anchors": [], "clock": {"tick_hz": tick_hz}}
        for aid, pos in anchors.items():
            dist = np.linalg.norm(tag_pos - pos)
            t_true = t_tx + dist / C_AIR
            params = http_api.STATE.clock_params.get(aid, {"offset_ns": 0.0, "drift_ppm": 0.0})
            offset = params.get("offset_ns", 0.0) * 1e-9
            drift = params.get("drift_ppm", 0.0) * 1e-6
            t_anchor = (1.0 + drift) * t_true + offset
            ticks = t_anchor * tick_hz
            epoch["anchors"].append(
                {
                    "id": aid,
                    "t_rx_anc": ticks,
                    "q": 0.15 ** 2,
                    "cir_snr_db": 20.0,
                    "nlos_score": 0.0,
                }
            )
        result = http_api.compute_pose(epoch)
        self.assertTrue(result["ok"])
        pose = result["pose"]
        self.assertAlmostEqual(pose["x"], tag_pos[0], places=2)
        self.assertAlmostEqual(pose["y"], tag_pos[1], places=2)
        self.assertAlmostEqual(pose["z"], tag_pos[2], places=2)

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


if __name__ == "__main__":
    unittest.main()
