import asyncio
import json
import math
import os
import time
from typing import Any, Dict, List, Optional, Set

import numpy as np

try:
    from fastapi import Body, FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
    from fastapi.middleware.cors import CORSMiddleware

    _FASTAPI_AVAILABLE = True
except ModuleNotFoundError:  # pragma: no cover
    _FASTAPI_AVAILABLE = False

    def Body(*_args, **_kwargs):
        return None

    def Query(*_args, **_kwargs):
        return None

    class HTTPException(Exception):
        def __init__(self, status_code: int = 500, detail: str = "") -> None:
            super().__init__(detail)
            self.status_code = status_code
            self.detail = detail

    class WebSocket:  # pragma: no cover
        pass

    class WebSocketDisconnect(Exception):  # pragma: no cover
        pass

    class CORSMiddleware:  # pragma: no cover
        pass

    class FastAPI:  # pragma: no cover
        def add_middleware(self, *_args, **_kwargs):
            return None

        def on_event(self, *_args, **_kwargs):
            def decorator(fn):
                return fn

            return decorator

        def get(self, *_args, **_kwargs):
            def decorator(fn):
                return fn

            return decorator

        def post(self, *_args, **_kwargs):
            def decorator(fn):
                return fn

            return decorator

        def websocket(self, *_args, **_kwargs):
            def decorator(fn):
                return fn

            return decorator

try:  # pragma: no cover - optional dependency in tests
    import serial
except ModuleNotFoundError:  # pragma: no cover
    serial = None

from .. import config
from ..autocal import estimate_layout_from_twr, validate_layout_against_authoritative_positions
from ..ingest import (
    DEFAULT_Q_NS2,
    DRONE_CLOCK_MODE,
    OBS_KIND_TOA,
    apply_radio_schedule_defaults,
    default_radio_schedule,
    iter_logged_epochs,
    parse_packet,
    DroneSerialEpochAssembler,
)
from ..solver.ekf import CVEKF
from ..solver.tdoa import solve_tdoa
from .log_manager import LogManager
from .ws_stream import BroadcastManager

C_AIR = 299_702_547.0
DW3XXX_TICK_HZ = 63_897_600_000.0
GATING_SIGMA = 3.0
AUTO_LAYOUT_RMS_GATE_M = getattr(config, "AUTO_LAYOUT_RMS_GATE_M", 0.25)
AUTO_LAYOUT_MAX_ABS_GATE_M = getattr(config, "AUTO_LAYOUT_MAX_ABS_GATE_M", 0.45)
AUTO_LAYOUT_MIN_SAMPLES_PER_EDGE = getattr(config, "AUTO_LAYOUT_MIN_EDGE_REPORTS", 1)

BASE_PACKAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_CALIB_PATH = os.path.join(BASE_PACKAGE_DIR, "engine", "logs", "calibration.json")
DEFAULT_LOG_ROOT = os.path.join(BASE_PACKAGE_DIR, "engine", "logs")


def _resolve_path(path: str, default: Optional[str] = None) -> str:
    base = path or default or ""
    if os.path.isabs(base):
        return base
    return os.path.join(BASE_PACKAGE_DIR, base)


app = FastAPI()

if _FASTAPI_AVAILABLE:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


class EngineState:
    def __init__(self) -> None:
        self.anchors: Dict[str, np.ndarray] = {}
        self.manual_anchors: Dict[str, np.ndarray] = {}
        self.auto_anchors: Dict[str, np.ndarray] = {}
        self.active_layout_source = "manual"
        self.auto_layout_quality: Dict[str, Any] = {}
        self.auto_layout_status: Dict[str, Any] = {}
        self.auto_layout_session: Dict[str, Any] = {}
        self.dim = 3
        self.ekf = CVEKF(dim=self.dim, q_acc=0.5)
        self.last_t: Optional[float] = None
        self.ws = BroadcastManager()
        self.running = True
        self.tick_hz = getattr(config, "TICK_HZ", DW3XXX_TICK_HZ)
        self.stats: Dict[str, Any] = {}
        self.clock_params: Dict[str, Dict[str, float]] = {}
        self.radio_schedule: Dict[str, Any] = default_radio_schedule()
        self.layout_validation: Dict[str, Any] = {}
        self.source_mode = getattr(config, "INGEST_MODE", "legacy_udp")
        self.serial_assembler = DroneSerialEpochAssembler(radio_schedule=self.radio_schedule)
        self.log_manager = LogManager(root=_resolve_path(getattr(config, "LOG_ROOT", "engine/logs"), DEFAULT_LOG_ROOT))
        self.replay_task: Optional[asyncio.Task] = None
        self.replay_lock = asyncio.Lock()
        self.ingest_status: Dict[str, Any] = {
            "source_mode": self.source_mode,
            "udp": {
                "host": getattr(config, "UDP_HOST", "127.0.0.1"),
                "port": int(getattr(config, "UDP_PORT", 9000)),
                "listening": False,
                "last_error": None,
            },
            "serial": {
                "port": getattr(config, "SERIAL_PORT", ""),
                "baudrate": int(getattr(config, "SERIAL_BAUDRATE", 115200)),
                "connected": False,
                "last_error": None,
            },
        }

    def anchors_array(self, ids: List[str]) -> np.ndarray:
        arr = []
        for anchor_id in ids:
            arr.append(self.anchors[anchor_id])
        return np.array(arr)

    def reset_filter(self) -> None:
        self.ekf = CVEKF(dim=self.dim, q_acc=0.5)
        self.last_t = None

    def set_dim(self, dim: int) -> None:
        dim_int = max(2, min(3, int(dim)))
        if dim_int == self.dim:
            return
        self.dim = dim_int
        self.reset_filter()

    def _copy_anchor_map(self, anchors: Dict[str, np.ndarray]) -> Dict[str, np.ndarray]:
        return {anchor_id: np.array(pos, dtype=float) for anchor_id, pos in anchors.items()}

    def _activate_layout(self) -> None:
        if self.auto_anchors:
            self.anchors = self._copy_anchor_map(self.auto_anchors)
            self.active_layout_source = "auto"
        elif self.manual_anchors:
            self.anchors = self._copy_anchor_map(self.manual_anchors)
            self.active_layout_source = "manual"
        else:
            self.anchors = {}
            self.active_layout_source = "none"
        self.update_dimension_from_anchors()

    def set_manual_anchors(self, anchors: Dict[str, np.ndarray]) -> None:
        self.manual_anchors = self._copy_anchor_map(anchors)
        self._activate_layout()

    def set_auto_layout(self, anchors: Dict[str, np.ndarray], quality: Dict[str, Any],
                        status: Dict[str, Any], session: Dict[str, Any]) -> None:
        self.auto_anchors = self._copy_anchor_map(anchors)
        self.auto_layout_quality = dict(quality)
        self.auto_layout_status = dict(status)
        self.auto_layout_session = dict(session)
        self._activate_layout()

    def clear_auto_layout(self, status: Optional[Dict[str, Any]] = None,
                          quality: Optional[Dict[str, Any]] = None,
                          session: Optional[Dict[str, Any]] = None) -> None:
        self.auto_anchors = {}
        self.auto_layout_status = dict(status or {})
        self.auto_layout_quality = dict(quality or {})
        self.auto_layout_session = dict(session or {})
        self._activate_layout()

    def infer_dimension(self) -> int:
        if not self.anchors:
            return self.dim
        coords = np.array(list(self.anchors.values()), dtype=float)
        if coords.size == 0:
            return self.dim
        if coords.shape[1] < 3:
            return 2
        span_z = float(np.max(coords[:, 2]) - np.min(coords[:, 2]))
        if span_z > 0.05:
            return 3
        return 2

    def update_dimension_from_anchors(self) -> None:
        self.set_dim(self.infer_dimension())

    def convert_anchor_time(self, anchor_id: str, ticks: float, tick_hz: float) -> float:
        t_sec = float(ticks) / float(tick_hz)
        params = self.clock_params.get(anchor_id)
        if params and bool(params.get("valid", True)):
            offset = params.get("offset_ns", 0.0) * 1e-9
            drift = params.get("drift_ppm", 0.0) * 1e-6
            denom = 1.0 + drift
            if abs(denom) < 1e-9:
                denom = 1e-9
            t_sec = (t_sec - offset) / denom
        return t_sec

    def update_clock_params(self, entries: List[Dict[str, Any]]) -> None:
        clocks: Dict[str, Dict[str, float]] = {}
        for entry in entries:
            anchor_id = entry.get("id")
            if not anchor_id:
                continue
            clocks[anchor_id] = {
                "offset_ns": float(entry.get("offset_ns", 0.0)),
                "drift_ppm": float(entry.get("drift_ppm", 0.0)),
                "valid": bool(entry.get("valid", True)),
            }
        self.clock_params = clocks

    def update_radio_schedule(self, payload: Optional[Dict[str, Any]]) -> None:
        self.radio_schedule = apply_radio_schedule_defaults(payload)
        self.tick_hz = float(self.radio_schedule.get("tick_hz", self.tick_hz))
        self.serial_assembler.update_schedule(self.radio_schedule)
        self.serial_assembler.reset()

    def set_source_mode(self, mode: Optional[str]) -> None:
        candidate = (mode or "legacy_udp").strip().lower()
        if candidate not in {"legacy_udp", "drone_serial"}:
            candidate = "legacy_udp"
        self.source_mode = candidate
        self.ingest_status["source_mode"] = candidate

    def health_ingest_snapshot(self) -> Dict[str, Any]:
        serial_status = dict(self.ingest_status.get("serial", {}))
        serial_status["sync"] = self.serial_assembler.snapshot()
        return {
            "source_mode": self.source_mode,
            "udp": dict(self.ingest_status.get("udp", {})),
            "serial": serial_status,
        }

    def anchor_payload(self, anchors: Optional[Dict[str, np.ndarray]] = None) -> List[Dict[str, Any]]:
        selected = anchors if anchors is not None else self.anchors
        return [
            {
                "id": key,
                "pos": {"x": float(val[0]), "y": float(val[1]), "z": float(val[2])},
            }
            for key, val in sorted(selected.items())
        ]


STATE = EngineState()


def _anchors_from_payload(anchors_payload: List[Dict[str, Any]]) -> Dict[str, np.ndarray]:
    anchors: Dict[str, np.ndarray] = {}
    for anchor in anchors_payload:
        anchor_id = anchor.get("id")
        if not anchor_id:
            continue
        pos = anchor.get("pos", {})
        anchors[str(anchor_id)] = np.array(
            [
                float(pos.get("x", 0.0)),
                float(pos.get("y", 0.0)),
                float(pos.get("z", 0.0)),
            ],
            dtype=float,
        )
    return anchors


def _serialize_clock_params() -> List[Dict[str, Any]]:
    return [
        {
            "id": key,
            "offset_ns": float(val.get("offset_ns", 0.0)),
            "drift_ppm": float(val.get("drift_ppm", 0.0)),
            "valid": bool(val.get("valid", True)),
        }
        for key, val in STATE.clock_params.items()
    ]


def _persist_current_calibration() -> None:
    active_anchors = STATE.anchor_payload()
    auto_anchors = STATE.anchor_payload(STATE.auto_anchors)
    save_calibration(
        {
            "anchors": active_anchors,
            "manual_anchors": STATE.anchor_payload(STATE.manual_anchors),
            "auto_layout": {
                "anchors": auto_anchors,
                "quality": STATE.auto_layout_quality,
                "status": STATE.auto_layout_status,
                "session": STATE.auto_layout_session,
            },
            "active_layout_source": STATE.active_layout_source,
            "anchor_clocks": _serialize_clock_params(),
            "radio_schedule": dict(STATE.radio_schedule),
            "layout_validation": STATE.layout_validation,
        }
    )


def _summarize_geometry_session(session: Dict[str, Any]) -> Dict[str, Any]:
    raw_edges = session.get("edges") or []
    grouped: Dict[tuple[str, str], Dict[str, Any]] = {}
    anchor_ids: Set[str] = set()
    for edge in raw_edges:
        a = str(edge.get("a") or "")
        b = str(edge.get("b") or "")
        if not a or not b or a == b:
            continue
        key = tuple(sorted((a, b)))
        grouped.setdefault(key, {"a": key[0], "b": key[1], "samples": [], "raw_samples": 0})
        grouped[key]["raw_samples"] += 1
        if bool(edge.get("valid", False)):
            grouped[key]["samples"].append(float(edge.get("dist_m", 0.0)))
        anchor_ids.update(key)
    sorted_anchor_ids = sorted(anchor_ids)
    expected_pairs = [
        (sorted_anchor_ids[i], sorted_anchor_ids[j])
        for i in range(len(sorted_anchor_ids))
        for j in range(i + 1, len(sorted_anchor_ids))
    ]
    missing_edges = [
        {"a": a, "b": b}
        for a, b in expected_pairs
        if (a, b) not in grouped
    ]
    weak_edges = [
        {
            "a": item["a"],
            "b": item["b"],
            "samples": len(item["samples"]),
            "required_samples": AUTO_LAYOUT_MIN_SAMPLES_PER_EDGE,
        }
        for item in grouped.values()
        if len(item["samples"]) < AUTO_LAYOUT_MIN_SAMPLES_PER_EDGE
    ]
    expected_edges = (len(anchor_ids) * (len(anchor_ids) - 1)) // 2 if len(anchor_ids) >= 2 else 0
    min_samples_ok = not weak_edges
    complete_graph = len(grouped) == expected_edges and expected_edges > 0
    return {
        "anchors": sorted_anchor_ids,
        "edges": list(grouped.values()),
        "edge_count": len(grouped),
        "expected_edges": expected_edges,
        "min_samples_ok": min_samples_ok,
        "complete_graph": complete_graph,
        "connected": complete_graph,
        "missing_edges": missing_edges,
        "weak_edges": weak_edges,
    }


def _apply_geometry_session(session: Dict[str, Any]) -> None:
    summary = _summarize_geometry_session(session)
    session_status = dict(session)
    session_status["anchors"] = summary["anchors"]
    quality: Dict[str, Any] = {
        "status": "rejected",
        "reason": "anchors_unavailable",
    }

    if int(session.get("anchor_count", 0) or 0) < 4 or len(summary["anchors"]) < 4:
        quality = {"status": "rejected", "reason": "insufficient_anchors"}
        STATE.clear_auto_layout(status={"status": "rejected", "reason": "insufficient_anchors"}, quality=quality, session=session_status)
        STATE.reset_filter()
        _persist_current_calibration()
        return

    if not summary["complete_graph"]:
        quality = {
            "status": "rejected",
            "reason": "disconnected_graph",
            "edge_count": summary["edge_count"],
            "expected_edges": summary["expected_edges"],
            "missing_edges": summary["missing_edges"],
        }
        STATE.clear_auto_layout(status=quality, quality=quality, session=session_status)
        STATE.reset_filter()
        _persist_current_calibration()
        return

    if not summary["min_samples_ok"]:
        quality = {
            "status": "rejected",
            "reason": "insufficient_edge_samples",
            "weak_edges": summary["weak_edges"],
        }
        STATE.clear_auto_layout(status=quality, quality=quality, session=session_status)
        STATE.reset_filter()
        _persist_current_calibration()
        return

    layout = estimate_layout_from_twr(summary["edges"], dims=3)
    layout_quality = dict(layout.get("quality", {}))
    rms_m = float(layout_quality.get("rms_m", float("inf")))
    max_abs_m = float(layout_quality.get("max_abs_m", float("inf")))
    if (
        layout_quality.get("status") != "ok"
        or rms_m > AUTO_LAYOUT_RMS_GATE_M
        or max_abs_m > AUTO_LAYOUT_MAX_ABS_GATE_M
    ):
        quality = {
            **layout_quality,
            "status": "rejected",
            "reason": "quality_gate_failed",
            "rms_gate_m": AUTO_LAYOUT_RMS_GATE_M,
            "max_abs_gate_m": AUTO_LAYOUT_MAX_ABS_GATE_M,
        }
        STATE.clear_auto_layout(status=quality, quality=quality, session=session_status)
        STATE.reset_filter()
        _persist_current_calibration()
        return

    auto_anchors = _anchors_from_payload(layout.get("anchors", []))
    if len(auto_anchors) < 4:
        quality = {"status": "rejected", "reason": "insufficient_anchors"}
        STATE.clear_auto_layout(status=quality, quality=quality, session=session_status)
        STATE.reset_filter()
        _persist_current_calibration()
        return

    quality = {
        **layout_quality,
        "status": "ok",
        "rms_gate_m": AUTO_LAYOUT_RMS_GATE_M,
        "max_abs_gate_m": AUTO_LAYOUT_MAX_ABS_GATE_M,
        "source": "boot_autogeometry",
    }
    STATE.set_auto_layout(
        auto_anchors,
        quality=quality,
        status={
            "status": "ok",
            "roster_hash": session.get("roster_hash"),
            "graph_seq": session.get("graph_seq"),
            "anchor_count": session.get("anchor_count"),
            "edge_count": summary["edge_count"],
        },
        session=session_status,
    )
    STATE.reset_filter()
    _persist_current_calibration()


def load_calibration() -> None:
    path = _resolve_path(getattr(config, "CALIBRATION_FILE", "engine/logs/calibration.json"), DEFAULT_CALIB_PATH)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as fh:
                data = json.load(fh)
            manual_payload = data.get("manual_anchors") or data.get("anchors", [])
            manual_anchors = _anchors_from_payload(manual_payload)
            auto_payload = data.get("auto_layout") or {}
            auto_anchors = _anchors_from_payload(auto_payload.get("anchors", []))
            STATE.manual_anchors = manual_anchors
            STATE.auto_anchors = auto_anchors
            STATE.auto_layout_quality = dict(auto_payload.get("quality") or {})
            STATE.auto_layout_status = dict(auto_payload.get("status") or {})
            STATE.auto_layout_session = dict(auto_payload.get("session") or {})
            active_source = str(data.get("active_layout_source") or "manual").lower()
            if active_source == "auto" and auto_anchors:
                STATE.anchors = STATE._copy_anchor_map(auto_anchors)
                STATE.active_layout_source = "auto"
            else:
                STATE.anchors = STATE._copy_anchor_map(manual_anchors)
                STATE.active_layout_source = "manual" if manual_anchors else "none"
            STATE.update_dimension_from_anchors()
            clocks = data.get("anchor_clocks") or data.get("clocks")
            if isinstance(clocks, list):
                STATE.update_clock_params(clocks)
            STATE.update_radio_schedule(data.get("radio_schedule"))
            if isinstance(data.get("layout_validation"), dict):
                STATE.layout_validation = data["layout_validation"]
            return
        except Exception:
            pass
    STATE.manual_anchors = {}
    STATE.auto_anchors = {}
    STATE.auto_layout_quality = {}
    STATE.auto_layout_status = {}
    STATE.auto_layout_session = {}
    STATE.anchors = {}
    STATE.active_layout_source = "none"
    STATE.clock_params = {}
    STATE.update_radio_schedule(None)
    STATE.update_dimension_from_anchors()
    STATE.layout_validation = {}


def save_calibration(payload: Dict[str, Any]) -> None:
    path = _resolve_path(getattr(config, "CALIBRATION_FILE", "engine/logs/calibration.json"), DEFAULT_CALIB_PATH)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    snapshot = {
        "anchors": payload.get("anchors", []),
        "manual_anchors": payload.get("manual_anchors", payload.get("anchors", [])),
        "auto_layout": payload.get("auto_layout", {}),
        "active_layout_source": payload.get("active_layout_source", "manual"),
        "anchor_clocks": payload.get("anchor_clocks", []),
        "radio_schedule": apply_radio_schedule_defaults(payload.get("radio_schedule")),
        "layout_validation": payload.get("layout_validation"),
        "frame": payload.get("frame"),
        "map_id": payload.get("map_id"),
        "updated_at": time.time(),
    }
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(snapshot, fh, indent=2)


def _quality_weight(entry: Dict[str, Any]) -> float:
    weight = 1.0
    snr = entry.get("cir_snr_db")
    if snr is not None:
        factor = (float(snr) - 5.0) / 15.0
        factor = max(0.2, min(2.5, factor))
        weight *= factor
    nlos = entry.get("nlos_score")
    if nlos is not None:
        weight *= 1.0 / (1.0 + 2.0 * max(0.0, float(nlos)))
    return weight


def compute_pose(epoch: Dict[str, Any]) -> Dict[str, Any]:
    entries: List[Dict[str, Any]] = []
    tick_hz = float(epoch.get("clock", {}).get("tick_hz", STATE.tick_hz))
    clock_mode = epoch.get("clock", {}).get("mode")
    observation_kind = epoch.get("observation_kind", "absolute_rx")
    min_required = STATE.dim + 1

    if not STATE.anchors:
        return {"ok": False, "reason": "anchors_unavailable"}

    for anchor in epoch.get("anchors", []):
        anchor_id = anchor.get("id")
        if anchor_id not in STATE.anchors:
            continue
        ticks = float(anchor.get("t_obs_ticks", anchor.get("t_rx_anc", 0.0)))
        if observation_kind == OBS_KIND_TOA or clock_mode == DRONE_CLOCK_MODE:
            t_corr = ticks / tick_hz
        else:
            t_corr = STATE.convert_anchor_time(anchor_id, ticks, tick_hz)
        q = float(anchor.get("q", DEFAULT_Q_NS2))
        if q <= 0.0:
            q = DEFAULT_Q_NS2
        sigma_ns = math.sqrt(q)
        sigma_m = max(sigma_ns * 1e-9 * C_AIR, 1e-6)
        base_weight = (1.0 / (sigma_m ** 2)) * _quality_weight(anchor)
        entries.append(
            {
                "id": anchor_id,
                "t": t_corr,
                "sigma_m": sigma_m,
                "weight": base_weight,
                "raw": anchor,
            }
        )

    if len(entries) < min_required:
        return {"ok": False, "reason": "insufficient_anchors"}

    entries.sort(key=lambda item: item["id"])
    for idx, item in enumerate(entries):
        if item["id"] == "A1":
            if idx != 0:
                entries.insert(0, entries.pop(idx))
            break

    initial_ids = [entry["id"] for entry in entries]
    active = entries[:]
    dropped: List[str] = []
    solved = None

    for _ in range(3):
        if len(active) < min_required:
            return {"ok": False, "reason": "insufficient_anchors"}
        ids = [entry["id"] for entry in active]
        ref = active[0]
        ref_id = ref["id"]
        t0 = ref["t"]
        dt = np.array([entry["t"] - t0 for entry in active[1:]], dtype=float)
        drho = C_AIR * dt
        weights = np.array([entry["weight"] for entry in active[1:]], dtype=float)
        anchors_xyz = STATE.anchors_array(ids)[:, : STATE.dim]
        x0 = np.mean(anchors_xyz, axis=0)
        solved = solve_tdoa(
            anchors_xyz,
            drho,
            x0,
            max_iter=16,
            huber_delta=getattr(config, "HUBER_DELTA", 0.2),
            weights=weights,
        )
        residuals = solved.get("residuals", np.zeros((len(active) - 1,)))
        bias = 0.0
        if len(residuals):
            if np.sum(weights) > 0.0:
                bias = float(np.sum(weights * residuals) / np.sum(weights))
            else:
                bias = float(np.mean(residuals))
        gating_ids: List[str] = []
        sigma_ref = max(ref["sigma_m"], 1e-3)
        if abs(bias) > GATING_SIGMA * sigma_ref:
            gating_ids.append(ref_id)
        seen: Set[str] = set(gating_ids)
        for ridx, entry in enumerate(active[1:]):
            sigma = max(entry["sigma_m"], 1e-3)
            if abs(residuals[ridx] - bias) > GATING_SIGMA * sigma and entry["id"] not in seen:
                gating_ids.append(entry["id"])
                seen.add(entry["id"])
        if gating_ids and len(active) - len(gating_ids) >= min_required:
            active = [entry for entry in active if entry["id"] not in gating_ids]
            dropped.extend(gating_ids)
            continue
        break

    if solved is None:
        return {"ok": False, "reason": "solver_failed"}

    ids = [entry["id"] for entry in active]
    ref_id = ids[0]
    solved["used"] = len(active)
    residual_rms_ns = float(solved.get("rms", 0.0)) / C_AIR * 1e9
    gdop = None
    if solved.get("cov") is not None:
        try:
            gdop = float(math.sqrt(np.trace(solved["cov"])))
        except Exception:
            gdop = None

    max_residual_rms_ns = float(getattr(config, "MAX_RESIDUAL_RMS_NS", 500.0))
    max_gdop = float(getattr(config, "MAX_GDOP", 50.0))
    if residual_rms_ns > max_residual_rms_ns:
        return {
            "ok": False,
            "reason": "quality_gate_failed",
            "metric": "residual_rms_ns",
            "value": residual_rms_ns,
            "threshold": max_residual_rms_ns,
        }
    if gdop is not None and gdop > max_gdop:
        return {
            "ok": False,
            "reason": "quality_gate_failed",
            "metric": "gdop",
            "value": gdop,
            "threshold": max_gdop,
        }

    if STATE.last_t is None:
        dt_ekf = 1.0 / 50.0
    else:
        t_meas = epoch.get("t_tx_tag")
        if t_meas is None:
            dt_ekf = 1.0 / 50.0
        else:
            dt_ekf = max(1e-3, float(t_meas) - float(STATE.last_t))
    STATE.ekf.predict(dt_ekf)
    z = solved["x"]
    cov = solved.get("cov")
    R = cov if cov is not None else np.eye(STATE.dim) * 0.05
    try:
        STATE.ekf.update(z, R)
    except np.linalg.LinAlgError:
        STATE.reset_filter()
        STATE.ekf.update(z, np.eye(STATE.dim) * 0.05)
    STATE.last_t = epoch.get("t_tx_tag", (STATE.last_t or 0.0) + dt_ekf)
    xkf, P = STATE.ekf.state()
    pos = xkf[: STATE.dim]
    vel = xkf[STATE.dim : 2 * STATE.dim]
    pose_vec = np.array([float(pos[i]) for i in range(STATE.dim)])
    vel_vec = np.array([float(vel[i]) for i in range(STATE.dim)])
    pos_cov = P[: STATE.dim, : STATE.dim]

    result = {
        "ok": True,
        "t": float(STATE.last_t),
        "tag_tx_seq": int(epoch.get("tag_tx_seq", -1)),
        "pose": {"x": pose_vec[0], "y": pose_vec[1], "z": pose_vec[2] if STATE.dim >= 3 else 0.0},
        "vel": {"x": vel_vec[0], "y": vel_vec[1], "z": vel_vec[2] if STATE.dim >= 3 else 0.0},
        "cov": pos_cov.tolist(),
        "status": {
            "anchors_used": int(solved.get("used", len(active))),
            "residual_rms_ns": residual_rms_ns,
            "gdop": gdop,
            "outliers": len(dropped),
            "ref_anchor": ref_id,
            "anchor_order": ids,
            "layout_source": STATE.active_layout_source,
        },
    }
    STATE.stats = {
        "last_seq": result["tag_tx_seq"],
        "anchors_seen": initial_ids,
        "anchors_used": ids,
        "outliers": dropped,
        "residual_rms_ns": residual_rms_ns,
        "source": epoch.get("source"),
        "layout_source": STATE.active_layout_source,
    }
    return result


async def _process_epoch(epoch: Dict[str, Any]) -> None:
    out = compute_pose(epoch)
    STATE.log_manager.log(epoch, out if out.get("ok") else None)
    if out.get("ok"):
        await STATE.ws.publish(out)
    else:
        STATE.stats = {
            "last_seq": int(epoch.get("tag_tx_seq", -1)),
            "anchors_seen": [anchor.get("id") for anchor in epoch.get("anchors", [])],
            "reason": out.get("reason"),
            "metric": out.get("metric"),
            "value": out.get("value"),
            "threshold": out.get("threshold"),
            "source": epoch.get("source"),
            "layout_source": STATE.active_layout_source,
        }


async def udp_ingest_task(host: str = "127.0.0.1", port: int = 9000) -> None:
    loop = asyncio.get_running_loop()

    class Proto(asyncio.DatagramProtocol):
        def datagram_received(self, data: bytes, addr):
            try:
                epoch = parse_packet(data)
                asyncio.create_task(_process_epoch(epoch))
            except Exception as exc:
                STATE.ingest_status["udp"]["last_error"] = str(exc)

    transport = None
    try:
        transport, _ = await loop.create_datagram_endpoint(lambda: Proto(), local_addr=(host, port))
        STATE.ingest_status["udp"]["listening"] = True
        STATE.ingest_status["udp"]["last_error"] = None
        while STATE.running:
            await asyncio.sleep(0.1)
    except Exception as exc:
        STATE.ingest_status["udp"]["last_error"] = str(exc)
    finally:
        STATE.ingest_status["udp"]["listening"] = False
        if transport is not None:
            transport.close()


async def drone_serial_ingest_task() -> None:
    port = getattr(config, "SERIAL_PORT", "")
    baudrate = int(getattr(config, "SERIAL_BAUDRATE", 115200))
    timeout_s = float(getattr(config, "SERIAL_TIMEOUT_S", 1.0))
    STATE.ingest_status["serial"]["port"] = port
    STATE.ingest_status["serial"]["baudrate"] = baudrate
    if serial is None:
        STATE.ingest_status["serial"]["last_error"] = "pyserial_not_installed"
        return
    if not port:
        STATE.ingest_status["serial"]["last_error"] = "serial_port_not_configured"
        return
    while STATE.running:
        try:
            with serial.Serial(port, baudrate=baudrate, timeout=timeout_s) as ser:
                STATE.ingest_status["serial"]["connected"] = True
                STATE.ingest_status["serial"]["last_error"] = None
                STATE.serial_assembler.reset()
                while STATE.running:
                    raw = await asyncio.to_thread(ser.readline)
                    if not raw:
                        continue
                    line = raw.decode("utf-8", errors="ignore").strip()
                    if not line:
                        continue
                    epochs = STATE.serial_assembler.ingest_line(line, now_s=time.time())
                    for session in STATE.serial_assembler.drain_geometry_sessions():
                        _apply_geometry_session(session)
                    for epoch in epochs:
                        await _process_epoch(epoch)
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            STATE.ingest_status["serial"]["connected"] = False
            STATE.ingest_status["serial"]["last_error"] = str(exc)
            await asyncio.sleep(1.0)
        finally:
            STATE.ingest_status["serial"]["connected"] = False


async def stop_replay_task() -> None:
    task = STATE.replay_task
    if task is not None and not task.done():
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass
    STATE.replay_task = None


async def replay_log(path: str, speed: float = 1.0) -> None:
    try:
        prev_t: Optional[float] = None
        for epoch in iter_logged_epochs(path):
            out = compute_pose(epoch)
            if out.get("ok"):
                await STATE.ws.publish(out)
            t_tx = epoch.get("t_tx_tag")
            if t_tx is not None:
                if prev_t is None:
                    prev_t = float(t_tx)
                else:
                    dt = (float(t_tx) - prev_t) / max(speed, 1e-6)
                    prev_t = float(t_tx)
                    if dt > 0:
                        await asyncio.sleep(dt)
            else:
                await asyncio.sleep(max(0.0, 1.0 / 50.0 / max(speed, 1e-6)))
        await asyncio.sleep(0.01)
    except asyncio.CancelledError:
        raise
    except Exception as exc:
        print(f"replay error: {exc}")


@app.on_event("startup")
async def on_start() -> None:
    load_calibration()
    STATE.set_source_mode(getattr(config, "INGEST_MODE", "legacy_udp"))
    if STATE.source_mode == "drone_serial":
        asyncio.create_task(drone_serial_ingest_task())
    else:
        asyncio.create_task(udp_ingest_task(host=getattr(config, "UDP_HOST", "127.0.0.1"), port=int(getattr(config, "UDP_PORT", 9000))))


@app.get("/healthz")
async def healthz():
    return {
        "status": "ok",
        "anchors": list(STATE.anchors.keys()),
        "active_layout_source": STATE.active_layout_source,
        "manual_fallback_present": bool(STATE.manual_anchors),
        "auto_layout_quality": STATE.auto_layout_quality,
        "auto_layout_status": STATE.auto_layout_status,
        "clock": STATE.clock_params,
        "radio_schedule": STATE.radio_schedule,
        "layout_validation": STATE.layout_validation,
        "source_mode": STATE.source_mode,
        "ingest": STATE.health_ingest_snapshot(),
        "logging": STATE.log_manager.is_active(),
        "replay_running": STATE.replay_task is not None and not STATE.replay_task.done(),
        "stats": STATE.stats,
    }


@app.get("/anchors")
async def get_anchors():
    clocks = [
        {
            "id": key,
            "offset_ns": float(val.get("offset_ns", 0.0)),
            "drift_ppm": float(val.get("drift_ppm", 0.0)),
            "valid": bool(val.get("valid", True)),
        }
        for key, val in STATE.clock_params.items()
    ]
    return {
        "anchors": STATE.anchor_payload(),
        "manual_anchors": STATE.anchor_payload(STATE.manual_anchors),
        "auto_anchors": STATE.anchor_payload(STATE.auto_anchors),
        "active_layout_source": STATE.active_layout_source,
        "manual_fallback_present": bool(STATE.manual_anchors),
        "auto_layout_quality": STATE.auto_layout_quality,
        "auto_layout_status": STATE.auto_layout_status,
        "anchor_clocks": clocks,
        "radio_schedule": STATE.radio_schedule,
        "layout_validation": STATE.layout_validation,
    }


@app.post("/set_anchors")
async def set_anchors(payload: Dict[str, Any] = Body(...)):
    anchors_payload = payload.get("anchors", [])
    anchors = _anchors_from_payload(anchors_payload)
    if not anchors:
        raise HTTPException(status_code=400, detail="no anchors provided")
    STATE.set_manual_anchors(anchors)
    clock_payload_provided = "anchor_clocks" in payload or "clocks" in payload
    clock_payload = payload.get("anchor_clocks") if "anchor_clocks" in payload else payload.get("clocks")
    if clock_payload_provided and not isinstance(clock_payload, list):
        raise HTTPException(status_code=400, detail="anchor_clocks must be a list")
    if isinstance(clock_payload, list):
        STATE.update_clock_params(clock_payload)
    persisted_clocks = (
        clock_payload
        if isinstance(clock_payload, list)
        else [
            {
                "id": key,
                "offset_ns": float(val.get("offset_ns", 0.0)),
                "drift_ppm": float(val.get("drift_ppm", 0.0)),
                "valid": bool(val.get("valid", True)),
            }
            for key, val in STATE.clock_params.items()
        ]
    )
    radio_schedule_provided = "radio_schedule" in payload
    radio_schedule_payload = payload.get("radio_schedule") if radio_schedule_provided else dict(STATE.radio_schedule)
    if radio_schedule_provided:
        STATE.update_radio_schedule(radio_schedule_payload)
    layout_validation = dict(STATE.layout_validation)
    twr_edges = payload.get("twr_edges") or payload.get("edges")
    if twr_edges is not None:
        if not isinstance(twr_edges, list):
            raise HTTPException(status_code=400, detail="twr_edges must be a list")
        layout_validation = validate_layout_against_authoritative_positions(
            twr_edges,
            anchors_payload,
            warn_threshold_m=float(payload.get("warn_threshold_m", 0.25)),
        )
        STATE.layout_validation = layout_validation
    elif payload.get("clear_layout_validation"):
        layout_validation = {}
        STATE.layout_validation = {}
    STATE.reset_filter()
    save_calibration(
        {
            "anchors": STATE.anchor_payload(),
            "manual_anchors": anchors_payload,
            "auto_layout": {
                "anchors": STATE.anchor_payload(STATE.auto_anchors),
                "quality": STATE.auto_layout_quality,
                "status": STATE.auto_layout_status,
                "session": STATE.auto_layout_session,
            },
            "active_layout_source": STATE.active_layout_source,
            "anchor_clocks": persisted_clocks,
            "radio_schedule": radio_schedule_payload,
            "layout_validation": layout_validation,
            "frame": payload.get("frame"),
            "map_id": payload.get("map_id"),
        }
    )
    return {
        "ok": True,
        "count": len(anchors),
        "layout_validation": layout_validation,
        "active_layout_source": STATE.active_layout_source,
    }


@app.post("/validate_anchor_layout")
async def validate_anchor_layout(payload: Dict[str, Any] = Body(...)):
    twr_edges = payload.get("twr_edges") or payload.get("edges")
    if not isinstance(twr_edges, list) or not twr_edges:
        raise HTTPException(status_code=400, detail="twr_edges must be a non-empty list")
    anchor_source = STATE.manual_anchors or STATE.anchors
    if not anchor_source:
        raise HTTPException(status_code=400, detail="no authoritative anchors configured")
    anchors_payload = STATE.anchor_payload(anchor_source)
    validation = validate_layout_against_authoritative_positions(
        twr_edges,
        anchors_payload,
        warn_threshold_m=float(payload.get("warn_threshold_m", 0.25)),
    )
    STATE.layout_validation = validation
    return {"ok": True, "layout_validation": validation}


@app.post("/start_log")
async def start_log(payload: Optional[Dict[str, Any]] = Body(default=None)):
    label = None
    if payload:
        label = payload.get("label") or payload.get("name")
    info = STATE.log_manager.start(label)
    return {"ok": True, **info}


@app.post("/stop_log")
async def stop_log():
    info = STATE.log_manager.stop()
    return {"ok": True, **info}


@app.post("/replay")
async def replay(file: str = Query(..., description="Relative or absolute path to a replayable log"), speed: float = Query(1.0)):
    async with STATE.replay_lock:
        if file.lower() in {"stop", "none"}:
            await stop_replay_task()
            return {"ok": True, "stopped": True}
        path = STATE.log_manager.resolve(file)
        if not os.path.exists(path):
            raise HTTPException(status_code=404, detail="log not found")
        await stop_replay_task()
        STATE.reset_filter()
        STATE.replay_task = asyncio.create_task(replay_log(path, speed=speed))
    return {"ok": True, "path": path, "speed": speed}


@app.websocket("/stream")
async def stream(ws: WebSocket):
    await ws.accept()
    queue = await STATE.ws.add_client()
    try:
        while True:
            msg = await queue.get()
            await ws.send_text(msg)
    except WebSocketDisconnect:
        pass
    finally:
        await STATE.ws.remove_client(queue)
