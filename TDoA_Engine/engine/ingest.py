import json
import re
import struct
from dataclasses import dataclass, field
from typing import Any, Dict, Iterator, List, Optional, Tuple

from . import config

LEGACY_MAGIC = 0x01D3
LEGACY_HDR_FMT = "<HHI d B"  # magic, len, seq, t_tx_tag_s, n_anc
LEGACY_ANC_FMT = "<B Q f f f"  # anchor_id, t_rx_ticks, q_ns2, snr, nlos
LOG_RECORD_VERSION = "normalized_epoch_v1"
OBS_KIND_ABSOLUTE_RX = "absolute_rx"
OBS_KIND_TOA = "toa"
DRONE_CLOCK_MODE = "drone_sync"
WIRELESS_CLOCK_MODE = "wireless_sync"
DEFAULT_Q_NS2 = 0.15 ** 2
DEFAULT_TICK_HZ = 63_897_600_000.0
DEFAULT_SUPERFRAME_UUS = 20_000
DEFAULT_SLOT_START_UUS = 10_000
DEFAULT_SLOT_UUS = 2_000
DEFAULT_MASTER_BEACON_ID = 1
TS40_MASK = (1 << 40) - 1
SEQ16_MASK = (1 << 16) - 1
SEQ16_HALF_RANGE = 1 << 15

_SYNC_RE = re.compile(
    r"DRONE:\s+SYNC\s+master=(?P<master>\d+)\s+seq=(?P<seq>\d+)\s+"
    r"t1=(?P<t1>\d+)\s+ts=(?P<ts>\d+)\b"
)
_BLINK_RE = re.compile(
    r"DRONE:\s+BLINK\s+id=(?P<beacon>\d+)\s+seq=(?P<seq>\d+)\s+slot=(?P<slot>\d+)\s+"
    r"flags=(?P<flags>\d+)\s+ts=(?P<ts>\d+)\b"
)
_CAL_EDGE_RE = re.compile(
    r"DRONE:\s+CAL_EDGE\s+a=(?P<a>A\d+)\s+b=(?P<b>A\d+)\s+sample=(?P<sample>\d+)\s+"
    r"dist_m=(?P<dist>[-+]?\d+(?:\.\d+)?)\s+valid=(?P<valid>\d+)\s+"
    r"path_ticks=(?P<path>-?\d+)\s+seq=(?P<seq>\d+)"
    r"(?:\s+roster_hash=(?P<roster>\d+))?\b"
)
_CAL_GRAPH_RE = re.compile(
    r"DRONE:\s+CAL_GRAPH\s+status=(?P<status>[A-Za-z_]+)\s+roster_hash=(?P<roster>\d+)\s+"
    r"edges=(?P<edges>\d+)\s+anchors=(?P<anchors>\d+)\s+seq=(?P<seq>\d+)\b"
)
_CAL_READY_RE = re.compile(
    r"DRONE:\s+CAL_READY\s+state=(?P<state>[A-Za-z_]+)"
    r"(?:\s+roster_hash=(?P<roster>\d+))?\s+seq=(?P<seq>\d+)\b"
)
_IGNORED_PREFIXES = (
    "DRONE: SYNC_ERR",
    "DRONE: EST ",
    "DRONE: listening",
    "DRONE: RX error",
    "DRONE: RX timeout",
    "DRONE: BLINK parse error",
    "DRONE: SYNC parse error",
    "DRONE: CAL parse error",
    "DRONE: unknown frame type",
    "[console]",
    "[DWM3001CDK]",
)


def configured_tick_hz() -> float:
    return float(getattr(config, "TICK_HZ", DEFAULT_TICK_HZ))


def default_radio_schedule() -> Dict[str, Any]:
    return {
        "tick_hz": configured_tick_hz(),
        "superframe_uus": DEFAULT_SUPERFRAME_UUS,
        "slot_start_uus": DEFAULT_SLOT_START_UUS,
        "slot_uus": DEFAULT_SLOT_UUS,
        "master_beacon_id": DEFAULT_MASTER_BEACON_ID,
    }


def apply_radio_schedule_defaults(payload: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    schedule = default_radio_schedule()
    if not isinstance(payload, dict):
        return schedule
    if "tick_hz" in payload:
        schedule["tick_hz"] = float(payload.get("tick_hz", DEFAULT_TICK_HZ))
    if "superframe_uus" in payload:
        schedule["superframe_uus"] = int(payload.get("superframe_uus", DEFAULT_SUPERFRAME_UUS))
    if "slot_start_uus" in payload:
        schedule["slot_start_uus"] = int(payload.get("slot_start_uus", DEFAULT_SLOT_START_UUS))
    if "slot_uus" in payload:
        schedule["slot_uus"] = int(payload.get("slot_uus", DEFAULT_SLOT_UUS))
    if "master_beacon_id" in payload and payload.get("master_beacon_id") is not None:
        schedule["master_beacon_id"] = int(payload.get("master_beacon_id"))
    return schedule


def serialize_epoch_record(epoch: Dict[str, Any]) -> bytes:
    record = {"kind": LOG_RECORD_VERSION, "epoch": epoch}
    payload = json.dumps(record, separators=(",", ":"), sort_keys=True).encode("utf-8")
    return struct.pack("<I", len(payload)) + payload


def decode_logged_record(payload: bytes) -> Dict[str, Any]:
    if payload.startswith(b"{"):
        data = json.loads(payload.decode("utf-8"))
        if isinstance(data, dict) and data.get("kind") == LOG_RECORD_VERSION:
            epoch = data.get("epoch", {})
        else:
            epoch = data
        if not isinstance(epoch, dict):
            raise ValueError("invalid epoch record")
        return epoch
    return parse_packet(payload)


def iter_logged_epochs(path: str) -> Iterator[Dict[str, Any]]:
    with open(path, "rb") as fh:
        head = fh.read(4)
        if not head:
            return
        fh.seek(0)
        magic = struct.unpack("<H", head[:2])[0]
        if magic == LEGACY_MAGIC:
            while True:
                hdr = fh.read(struct.calcsize(LEGACY_HDR_FMT))
                if not hdr:
                    break
                if len(hdr) < struct.calcsize(LEGACY_HDR_FMT):
                    break
                _, ln, _, _, n = struct.unpack(LEGACY_HDR_FMT, hdr)
                anc_sz = struct.calcsize(LEGACY_ANC_FMT) * n
                rest = fh.read(anc_sz)
                if len(rest) != anc_sz:
                    break
                yield parse_packet(hdr + rest)
            return

        while True:
            hdr = fh.read(4)
            if not hdr:
                break
            if len(hdr) < 4:
                break
            frame_len = struct.unpack("<I", hdr)[0]
            if frame_len <= 0:
                break
            payload = fh.read(frame_len)
            if len(payload) != frame_len:
                break
            yield decode_logged_record(payload)


def parse_packet(buf: bytes) -> Dict[str, Any]:
    """Parse the legacy binary packet into the normalized epoch format."""
    if len(buf) < struct.calcsize(LEGACY_HDR_FMT):
        raise ValueError("packet too short")
    magic, ln, seq, t_tx, n = struct.unpack_from(LEGACY_HDR_FMT, buf, 0)
    if magic != LEGACY_MAGIC:
        raise ValueError("bad magic")
    if ln != len(buf) - 4:
        raise ValueError("bad length field")
    off = struct.calcsize(LEGACY_HDR_FMT)
    anchors: List[Dict[str, Any]] = []
    anc_sz = struct.calcsize(LEGACY_ANC_FMT)
    for _ in range(n):
        if off + anc_sz > len(buf):
            raise ValueError("truncated anchor entry")
        anchor_id, ticks, q_ns2, snr_db, nlos = struct.unpack_from(LEGACY_ANC_FMT, buf, off)
        anchors.append(
            {
                "id": f"A{anchor_id}",
                "t_obs_ticks": float(ticks),
                "q": float(q_ns2),
                "cir_snr_db": float(snr_db),
                "nlos_score": float(nlos),
            }
        )
        off += anc_sz
    return {
        "tag_tx_seq": int(seq),
        "t_tx_tag": float(t_tx),
        "anchors": anchors,
        "clock": {"tick_hz": configured_tick_hz(), "mode": WIRELESS_CLOCK_MODE},
        "observation_kind": OBS_KIND_ABSOLUTE_RX,
        "source": "legacy_udp",
    }


@dataclass
class TimestampUnwrapper:
    prev_raw: Optional[int] = None
    acc: int = 0

    def unwrap(self, raw: int) -> int:
        masked = int(raw) & TS40_MASK
        if self.prev_raw is None:
            self.prev_raw = masked
            self.acc = masked
            return self.acc
        dt = (masked - self.prev_raw) & TS40_MASK
        self.acc += dt
        self.prev_raw = masked
        return self.acc


@dataclass
class DroneSyncEvent:
    master_id: int
    seq: int
    t1_master_raw: int
    t2_drone_raw: int
    text: str = ""
    t1_master: Optional[int] = None
    t2_drone: Optional[int] = None


@dataclass
class DroneBlinkEvent:
    beacon_id: int
    seq: int
    slot_id: int
    flags: int
    rx_ts_raw: int
    text: str = ""
    rx_ts: Optional[int] = None


@dataclass
class DroneCalEdgeEvent:
    anchor_a: str
    anchor_b: str
    sample_idx: int
    dist_m: float
    valid: bool
    path_ticks: int
    seq: int
    roster_hash: Optional[int] = None
    text: str = ""


@dataclass
class DroneCalGraphEvent:
    status: str
    roster_hash: int
    edge_count: int
    anchor_count: int
    seq: int
    text: str = ""


@dataclass
class DroneCalReadyEvent:
    state: str
    seq: int
    roster_hash: Optional[int] = None
    text: str = ""


def parse_drone_console_line(line: str) -> Optional[Dict[str, Any]]:
    text = (line or "").strip()
    if not text:
        return None
    for prefix in _IGNORED_PREFIXES:
        if text.startswith(prefix):
            return {"type": "ignored", "text": text}

    sync_match = _SYNC_RE.search(text)
    if sync_match:
        return {
            "type": "sync",
            "event": DroneSyncEvent(
                master_id=int(sync_match.group("master")),
                seq=int(sync_match.group("seq")),
                t1_master_raw=int(sync_match.group("t1")),
                t2_drone_raw=int(sync_match.group("ts")),
                text=text,
            ),
        }

    blink_match = _BLINK_RE.search(text)
    if blink_match:
        return {
            "type": "blink",
            "event": DroneBlinkEvent(
                beacon_id=int(blink_match.group("beacon")),
                seq=int(blink_match.group("seq")),
                slot_id=int(blink_match.group("slot")),
                flags=int(blink_match.group("flags")),
                rx_ts_raw=int(blink_match.group("ts")),
                text=text,
            ),
        }

    cal_edge_match = _CAL_EDGE_RE.search(text)
    if cal_edge_match:
        roster_hash = cal_edge_match.group("roster")
        return {
            "type": "cal_edge",
            "event": DroneCalEdgeEvent(
                anchor_a=str(cal_edge_match.group("a")),
                anchor_b=str(cal_edge_match.group("b")),
                sample_idx=int(cal_edge_match.group("sample")),
                dist_m=float(cal_edge_match.group("dist")),
                valid=bool(int(cal_edge_match.group("valid"))),
                path_ticks=int(cal_edge_match.group("path")),
                seq=int(cal_edge_match.group("seq")),
                roster_hash=int(roster_hash) if roster_hash is not None else None,
                text=text,
            ),
        }

    cal_graph_match = _CAL_GRAPH_RE.search(text)
    if cal_graph_match:
        return {
            "type": "cal_graph",
            "event": DroneCalGraphEvent(
                status=str(cal_graph_match.group("status")).lower(),
                roster_hash=int(cal_graph_match.group("roster")),
                edge_count=int(cal_graph_match.group("edges")),
                anchor_count=int(cal_graph_match.group("anchors")),
                seq=int(cal_graph_match.group("seq")),
                text=text,
            ),
        }

    cal_ready_match = _CAL_READY_RE.search(text)
    if cal_ready_match:
        roster_hash = cal_ready_match.group("roster")
        return {
            "type": "cal_ready",
            "event": DroneCalReadyEvent(
                state=str(cal_ready_match.group("state")).lower(),
                seq=int(cal_ready_match.group("seq")),
                roster_hash=int(roster_hash) if roster_hash is not None else None,
                text=text,
            ),
        }

    return {"type": "unknown", "text": text}


def seq16_delta(newer: int, older: int) -> int:
    return (int(newer) - int(older)) & SEQ16_MASK


def seq16_is_newer(candidate: int, reference: int) -> bool:
    delta = seq16_delta(candidate, reference)
    return 0 < delta < SEQ16_HALF_RANGE


@dataclass
class DroneSerialEpochAssembler:
    radio_schedule: Dict[str, Any] = field(default_factory=default_radio_schedule)
    min_emit_anchors: int = 3
    master_unwrapper: TimestampUnwrapper = field(default_factory=TimestampUnwrapper)
    drone_unwrapper: TimestampUnwrapper = field(default_factory=TimestampUnwrapper)
    last_sync: Optional[DroneSyncEvent] = None
    sync_alpha: float = 1.0
    sync_beta: float = 0.0
    sync_locked: bool = False
    pending_blinks: Dict[int, Dict[int, DroneBlinkEvent]] = field(default_factory=dict)
    pending_geometry_edges: List[Dict[str, Any]] = field(default_factory=list)
    completed_geometry_sessions: List[Dict[str, Any]] = field(default_factory=list)
    last_ready_state: Optional[str] = None
    diagnostics: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        self.radio_schedule = apply_radio_schedule_defaults(self.radio_schedule)
        self.diagnostics = {
            "lines_seen": 0,
            "lines_ignored": 0,
            "lines_unknown": 0,
            "sync_lines": 0,
            "blink_lines": 0,
            "sync_locked": False,
            "last_superframe_seq": None,
            "recent_anchors_seen": [],
            "partial_epochs": 0,
            "dropped_epochs": 0,
            "out_of_order_lines": 0,
            "invalid_measurements": 0,
            "cal_edge_lines": 0,
            "cal_graph_lines": 0,
            "cal_ready_lines": 0,
            "geometry_sessions": 0,
        }

    def reset(self) -> None:
        self.master_unwrapper = TimestampUnwrapper()
        self.drone_unwrapper = TimestampUnwrapper()
        self.last_sync = None
        self.sync_alpha = 1.0
        self.sync_beta = 0.0
        self.sync_locked = False
        self.pending_blinks = {}
        self.pending_geometry_edges = []
        self.completed_geometry_sessions = []
        self.last_ready_state = None
        self.diagnostics.update(
            {
                "sync_locked": False,
                "last_superframe_seq": None,
                "recent_anchors_seen": [],
                "partial_epochs": 0,
                "dropped_epochs": 0,
                "out_of_order_lines": 0,
                "invalid_measurements": 0,
                "geometry_sessions": 0,
            }
        )

    @property
    def tick_hz(self) -> float:
        return float(self.radio_schedule.get("tick_hz", DEFAULT_TICK_HZ))

    def update_schedule(self, radio_schedule: Optional[Dict[str, Any]]) -> None:
        self.radio_schedule = apply_radio_schedule_defaults(radio_schedule)

    def snapshot(self) -> Dict[str, Any]:
        recent = list(self.diagnostics.get("recent_anchors_seen", []))
        return {
            **self.diagnostics,
            "sync_locked": self.sync_locked,
            "last_superframe_seq": self.diagnostics.get("last_superframe_seq"),
            "recent_anchors_seen": recent[-8:],
            "pending_sequences": sorted(self.pending_blinks.keys()),
            "radio_schedule": dict(self.radio_schedule),
            "sync_alpha": self.sync_alpha,
            "sync_beta": self.sync_beta,
            "last_ready_state": self.last_ready_state,
        }

    def ingest_line(self, line: str, now_s: Optional[float] = None) -> List[Dict[str, Any]]:
        parsed = parse_drone_console_line(line)
        self.diagnostics["lines_seen"] += 1
        if parsed is None:
            return []
        event_type = parsed.get("type")
        if event_type == "ignored":
            self.diagnostics["lines_ignored"] += 1
            return []
        if event_type == "unknown":
            self.diagnostics["lines_unknown"] += 1
            return []
        if event_type == "sync":
            self.diagnostics["sync_lines"] += 1
            return self._ingest_sync(parsed["event"], now_s=now_s)
        if event_type == "blink":
            self.diagnostics["blink_lines"] += 1
            self._ingest_blink(parsed["event"])
            return []
        if event_type == "cal_edge":
            self.diagnostics["cal_edge_lines"] += 1
            self._ingest_cal_edge(parsed["event"])
            return []
        if event_type == "cal_graph":
            self.diagnostics["cal_graph_lines"] += 1
            self._ingest_cal_graph(parsed["event"])
            return []
        if event_type == "cal_ready":
            self.diagnostics["cal_ready_lines"] += 1
            self._ingest_cal_ready(parsed["event"])
        return []

    def drain_geometry_sessions(self) -> List[Dict[str, Any]]:
        sessions = list(self.completed_geometry_sessions)
        self.completed_geometry_sessions.clear()
        return sessions

    def _ingest_sync(self, event: DroneSyncEvent, now_s: Optional[float]) -> List[Dict[str, Any]]:
        outputs: List[Dict[str, Any]] = []
        if self.last_sync is not None and not seq16_is_newer(event.seq, self.last_sync.seq):
            self.diagnostics["out_of_order_lines"] += 1
            return outputs
        event.t1_master = self.master_unwrapper.unwrap(event.t1_master_raw)
        event.t2_drone = self.drone_unwrapper.unwrap(event.t2_drone_raw)
        self.diagnostics["last_superframe_seq"] = event.seq
        if self.last_sync is not None:
            dt1 = int(event.t1_master) - int(self.last_sync.t1_master)
            dt2 = int(event.t2_drone) - int(self.last_sync.t2_drone)
            if dt1 != 0:
                self.sync_alpha = float(dt2) / float(dt1)
                self.sync_beta = float(event.t2_drone) - self.sync_alpha * float(event.t1_master)
                self.sync_locked = True
                self.diagnostics["sync_locked"] = True
                previous = self.last_sync
                epoch = self._finalize_superframe(previous, now_s=now_s)
                if epoch is not None:
                    outputs.append(epoch)
        self.last_sync = event
        return outputs

    def _ingest_cal_edge(self, event: DroneCalEdgeEvent) -> None:
        self.pending_geometry_edges.append(
            {
                "a": event.anchor_a,
                "b": event.anchor_b,
                "sample_idx": event.sample_idx,
                "dist_m": event.dist_m,
                "valid": event.valid,
                "path_ticks": event.path_ticks,
                "seq": event.seq,
                "roster_hash": event.roster_hash,
            }
        )

    def _ingest_cal_graph(self, event: DroneCalGraphEvent) -> None:
        session = {
            "roster_hash": event.roster_hash,
            "graph_seq": event.seq,
            "status": event.status,
            "edge_count": event.edge_count,
            "anchor_count": event.anchor_count,
            "edges": list(self.pending_geometry_edges),
        }
        self.pending_geometry_edges.clear()
        self.completed_geometry_sessions.append(session)
        self.diagnostics["geometry_sessions"] = self.diagnostics.get("geometry_sessions", 0) + 1

    def _ingest_cal_ready(self, event: DroneCalReadyEvent) -> None:
        self.last_ready_state = event.state

    def _ingest_blink(self, event: DroneBlinkEvent) -> None:
        if self.last_sync is not None:
            age = seq16_delta(self.last_sync.seq, event.seq)
            if 1 < age < SEQ16_HALF_RANGE:
                self.diagnostics["out_of_order_lines"] += 1
                return
        event.rx_ts = self.drone_unwrapper.unwrap(event.rx_ts_raw)
        seq_store = self.pending_blinks.setdefault(event.seq, {})
        seq_store[event.beacon_id] = event
        recent = list(self.diagnostics.get("recent_anchors_seen", []))
        recent.append(self._anchor_id_for_beacon(event.beacon_id))
        self.diagnostics["recent_anchors_seen"] = recent[-8:]

    def _finalize_superframe(self, sync_event: DroneSyncEvent, now_s: Optional[float]) -> Optional[Dict[str, Any]]:
        blink_map = self.pending_blinks.pop(sync_event.seq, {})
        if not blink_map:
            self.diagnostics["dropped_epochs"] += 1
            return None

        measurements: List[Dict[str, Any]] = []
        for blink in sorted(blink_map.values(), key=lambda item: item.beacon_id):
            expected_master = float(sync_event.t1_master) + float(self._slot_offset_ticks(blink.slot_id))
            expected_drone = self.sync_alpha * expected_master + self.sync_beta
            toa_ticks = float(blink.rx_ts) - expected_drone
            measurements.append(
                {
                    "id": self._anchor_id_for_beacon(blink.beacon_id),
                    "t_obs_ticks": toa_ticks,
                    "q": DEFAULT_Q_NS2,
                    "slot_id": blink.slot_id,
                    "flags": blink.flags,
                }
            )

        if len(measurements) < self.min_emit_anchors:
            self.diagnostics["partial_epochs"] += 1
            return None

        epoch_time = float(now_s) if now_s is not None else float(self.sync_alpha * float(sync_event.t1_master) + self.sync_beta) / self.tick_hz
        return {
            "tag_tx_seq": int(sync_event.seq),
            "t_tx_tag": epoch_time,
            "anchors": measurements,
            "clock": {"tick_hz": self.tick_hz, "mode": DRONE_CLOCK_MODE},
            "observation_kind": OBS_KIND_TOA,
            "source": "drone_serial",
            "meta": {
                "master_beacon_id": int(sync_event.master_id),
                "sync_locked": True,
            },
        }

    def _anchor_id_for_beacon(self, beacon_id: int) -> str:
        return f"A{int(beacon_id)}"

    def _slot_offset_ticks(self, slot_id: int) -> int:
        base_ticks = int(round(self.tick_hz / 1e6))
        slot_start = int(self.radio_schedule.get("slot_start_uus", DEFAULT_SLOT_START_UUS))
        slot_uus = int(self.radio_schedule.get("slot_uus", DEFAULT_SLOT_UUS))
        return (slot_start + int(slot_id) * slot_uus) * base_ticks
