import asyncio
import json
import math
import os
import struct
import time
from typing import Dict, Any, List, Optional, Set

import numpy as np
from fastapi import Body, FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .. import config
from ..io_parser import parse_packet
from ..solver.tdoa import solve_tdoa
from ..solver.ekf import CVEKF
from .log_manager import LogManager
from .ws_stream import BroadcastManager

C_AIR = 299_702_547.0
DW3XXX_TICK_HZ = 63_897_600_000.0  # ~15.65 ps timestamp resolution on DW3110
DEFAULT_Q_NS2 = 0.15 ** 2
GATING_SIGMA = 3.0

BASE_PACKAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_CALIB_PATH = os.path.join(BASE_PACKAGE_DIR, "engine", "logs", "calibration.json")
DEFAULT_LOG_ROOT = os.path.join(BASE_PACKAGE_DIR, "engine", "logs")


def _resolve_path(path: str, default: Optional[str] = None) -> str:
    base = path or default or ""
    if os.path.isabs(base):
        return base
    return os.path.join(BASE_PACKAGE_DIR, base)


app = FastAPI()

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
        self.dim = 3
        self.ekf = CVEKF(dim=self.dim, q_acc=0.5)
        self.last_t: Optional[float] = None
        self.ws = BroadcastManager()
        self.running = True
        self.tick_hz = getattr(config, "TICK_HZ", DW3XXX_TICK_HZ)
        self.stats: Dict[str, Any] = {}
        self.clock_params: Dict[str, Dict[str, float]] = {}
        self.log_manager = LogManager(root=_resolve_path(getattr(config, "LOG_ROOT", "engine/logs"), DEFAULT_LOG_ROOT))
        self.replay_task: Optional[asyncio.Task] = None
        self.replay_lock = asyncio.Lock()

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
            # Treat anchors with >5 cm vertical spread as observably 3D
            return 3
        return 2

    def update_dimension_from_anchors(self) -> None:
        dim = self.infer_dimension()
        self.set_dim(dim)

    def convert_anchor_time(self, anchor_id: str, ticks: float, tick_hz: float) -> float:
        """Return host-reference time for an anchor RX measurement."""
        t_sec = float(ticks) / float(tick_hz)
        params = self.clock_params.get(anchor_id)
        if params:
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
        if clocks:
            self.clock_params = clocks


STATE = EngineState()


def load_calibration() -> None:
    path = _resolve_path(getattr(config, "CALIBRATION_FILE", "engine/logs/calibration.json"), DEFAULT_CALIB_PATH)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as fh:
                data = json.load(fh)
            anchors = {}
            for a in data.get("anchors", []):
                pos = np.array([
                    float(a["pos"]["x"]),
                    float(a["pos"]["y"]),
                    float(a["pos"].get("z", 0.0)),
                ])
                anchors[a["id"]] = pos
            if anchors:
                STATE.anchors = anchors
                STATE.update_dimension_from_anchors()
            clocks = data.get("anchor_clocks") or data.get("clocks")
            if isinstance(clocks, list):
                STATE.update_clock_params(clocks)
            return
        except Exception:
            pass
    # default square layout if no calibration
    STATE.anchors = {
        "A1": np.array([0.0, 0.0, 2.40]),
        "A2": np.array([8.0, 0.0, 2.65]),
        "A3": np.array([8.0, 6.0, 2.20]),
        "A4": np.array([0.0, 6.0, 2.55]),
    }
    STATE.clock_params = {}
    STATE.update_dimension_from_anchors()


def save_calibration(payload: Dict[str, Any]) -> None:
    path = _resolve_path(getattr(config, "CALIBRATION_FILE", "engine/logs/calibration.json"), DEFAULT_CALIB_PATH)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    snapshot = {
        "anchors": payload.get("anchors", []),
        "anchor_clocks": payload.get("anchor_clocks", []),
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
    min_required = STATE.dim + 1
    for anchor in epoch.get("anchors", []):
        anchor_id = anchor.get("id")
        if anchor_id not in STATE.anchors:
            continue
        t_corr = STATE.convert_anchor_time(anchor_id, anchor.get("t_rx_anc", 0.0), tick_hz)
        q = float(anchor.get("q", DEFAULT_Q_NS2))
        if q <= 0.0:
            q = DEFAULT_Q_NS2
        sigma_ns = math.sqrt(q)
        sigma_m = sigma_ns * 1e-9 * C_AIR
        if sigma_m < 1e-6:
            sigma_m = 1e-6
        base_weight = 1.0 / (sigma_m ** 2)
        base_weight *= _quality_weight(anchor)
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
    entries.sort(key=lambda e: e["id"])
    for idx, item in enumerate(entries):
        if item["id"] == "A1":
            if idx != 0:
                entries.insert(0, entries.pop(idx))
            break
    initial_ids = [e["id"] for e in entries]
    active = entries[:]
    dropped: List[str] = []
    solved = None
    for _ in range(3):
        if len(active) < min_required:
            return {"ok": False, "reason": "insufficient_anchors"}
        ids = [e["id"] for e in active]
        ref = active[0]
        ref_id = ref["id"]
        t0 = ref["t"]
        dt = np.array([e["t"] - t0 for e in active[1:]], dtype=float)
        drho = C_AIR * dt
        weights = np.array([e["weight"] for e in active[1:]], dtype=float)
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
        # Estimate the common bias in residuals. A large bias usually indicates the
        # reference anchor is corrupted because every other anchor is measured
        # relative to it. Removing this shared offset before evaluating the other
        # anchors prevents falsely gating the good ones and lets us reject the
        # bad reference instead.
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
    ids = [e["id"] for e in active]
    ref_id = ids[0]
    solved["used"] = len(active)
    # EKF update
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
    if cov is not None:
        R = cov
    else:
        R = np.eye(STATE.dim) * 0.05
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
    cov_list = pos_cov.tolist()
    residual_rms_ns = float(solved.get("rms", 0.0)) / C_AIR * 1e9
    gdop = None
    if solved.get("cov") is not None:
        try:
            gdop = float(math.sqrt(np.trace(solved["cov"])))
        except Exception:
            gdop = None
    result = {
        "ok": True,
        "t": float(STATE.last_t),
        "tag_tx_seq": int(epoch.get("tag_tx_seq", -1)),
        "pose": {"x": pose_vec[0], "y": pose_vec[1], "z": pose_vec[2] if STATE.dim >= 3 else 0.0},
        "vel": {"x": vel_vec[0], "y": vel_vec[1], "z": vel_vec[2] if STATE.dim >= 3 else 0.0},
        "cov": cov_list,
        "status": {
            "anchors_used": int(solved.get("used", len(active))),
            "residual_rms_ns": residual_rms_ns,
            "gdop": gdop,
            "outliers": len(dropped),
            "ref_anchor": ref_id,
            "anchor_order": ids,
        },
    }
    STATE.stats = {
        "last_seq": result["tag_tx_seq"],
        "anchors_seen": initial_ids,
        "anchors_used": ids,
        "outliers": dropped,
        "residual_rms_ns": residual_rms_ns,
    }
    return result


async def udp_ingest_task(host: str = "127.0.0.1", port: int = 9000) -> None:
    loop = asyncio.get_running_loop()

    class Proto(asyncio.DatagramProtocol):
        def datagram_received(self, data: bytes, addr):
            try:
                epoch = parse_packet(data)
                out = compute_pose(epoch)
                if out.get("ok"):
                    asyncio.create_task(STATE.ws.publish(out))
                    STATE.log_manager.log(data, out)
            except Exception as exc:
                print(f"ingest error: {exc}")

    transport, _ = await loop.create_datagram_endpoint(lambda: Proto(), local_addr=(host, port))
    try:
        while STATE.running:
            await asyncio.sleep(0.1)
    finally:
        transport.close()


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
        with open(path, "rb") as fh:
            prev_t: Optional[float] = None
            while True:
                hdr = fh.read(4)
                if not hdr:
                    break
                frame_len = struct.unpack("<I", hdr)[0]
                payload = fh.read(frame_len)
                if len(payload) != frame_len:
                    break
                epoch = parse_packet(payload)
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
    asyncio.create_task(udp_ingest_task())


@app.get("/healthz")
async def healthz():
    return {
        "status": "ok",
        "anchors": list(STATE.anchors.keys()),
        "clock": STATE.clock_params,
        "logging": STATE.log_manager.is_active(),
        "replay_running": STATE.replay_task is not None and not STATE.replay_task.done(),
        "stats": STATE.stats,
    }


@app.get("/anchors")
async def get_anchors():
    anchors = [
        {
            "id": key,
            "pos": {
                "x": float(val[0]),
                "y": float(val[1]),
                "z": float(val[2]),
            },
        }
        for key, val in STATE.anchors.items()
    ]
    clocks = [
        {
            "id": key,
            "offset_ns": float(val.get("offset_ns", 0.0)),
            "drift_ppm": float(val.get("drift_ppm", 0.0)),
            "valid": bool(val.get("valid", True)),
        }
        for key, val in STATE.clock_params.items()
    ]
    return {"anchors": anchors, "anchor_clocks": clocks}


@app.post("/set_anchors")
async def set_anchors(payload: Dict[str, Any] = Body(...)):
    anchors_payload = payload.get("anchors", [])
    anchors: Dict[str, np.ndarray] = {}
    for anchor in anchors_payload:
        anchor_id = anchor.get("id")
        if not anchor_id:
            continue
        pos = anchor.get("pos", {})
        anchors[anchor_id] = np.array([
            float(pos.get("x", 0.0)),
            float(pos.get("y", 0.0)),
            float(pos.get("z", 0.0)),
        ])
    if not anchors:
        raise HTTPException(status_code=400, detail="no anchors provided")
    STATE.anchors = anchors
    STATE.update_dimension_from_anchors()
    clock_payload = payload.get("anchor_clocks") or payload.get("clocks") or []
    if isinstance(clock_payload, list):
        STATE.update_clock_params(clock_payload)
    STATE.reset_filter()
    save_calibration({
        "anchors": anchors_payload,
        "anchor_clocks": clock_payload,
        "frame": payload.get("frame"),
        "map_id": payload.get("map_id"),
    })
    return {"ok": True, "count": len(anchors)}


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
async def replay(file: str = Query(..., description="Relative or absolute path to .bin log"), speed: float = Query(1.0)):
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
    q = await STATE.ws.add_client()
    try:
        while True:
            msg = await q.get()
            await ws.send_text(msg)
    except WebSocketDisconnect:
        pass
    finally:
        await STATE.ws.remove_client(q)
