"""Anchor layout and clock auto-calibration helpers."""

from __future__ import annotations

import math
from collections import defaultdict
from typing import Dict, Any, List, Tuple

import numpy as np

C_AIR = 299_702_547.0


def _extract_anchor_pair(edge: Dict[str, Any]) -> Tuple[str, str]:
    a = edge.get("a") or edge.get("anchor_a") or edge.get("from")
    b = edge.get("b") or edge.get("anchor_b") or edge.get("to")
    if not a or not b:
        raise ValueError("edge missing anchor identifiers")
    return str(a), str(b)


def _edge_distance(edge: Dict[str, Any]) -> float:
    if "samples" in edge and edge["samples"]:
        vals = np.array([float(s) for s in edge["samples"] if s is not None], dtype=float)
        if vals.size == 0:
            raise ValueError("edge samples empty")
        return float(np.median(vals))
    for key in ("dist_m", "distance_m", "distance"):
        if key in edge:
            return float(edge[key])
    raise ValueError("edge missing distance field")


def _skew(v: np.ndarray) -> np.ndarray:
    return np.array(
        [
            [0.0, -float(v[2]), float(v[1])],
            [float(v[2]), 0.0, -float(v[0])],
            [-float(v[1]), float(v[0]), 0.0],
        ],
        dtype=float,
    )


def _rotation_matrix_from_vectors(source: np.ndarray, target: np.ndarray) -> np.ndarray:
    src = np.array(source, dtype=float)
    dst = np.array(target, dtype=float)
    src_norm = np.linalg.norm(src)
    dst_norm = np.linalg.norm(dst)
    if src_norm < 1e-12 or dst_norm < 1e-12:
        return np.eye(3, dtype=float)
    src = src / src_norm
    dst = dst / dst_norm
    cross = np.cross(src, dst)
    dot = float(np.clip(np.dot(src, dst), -1.0, 1.0))
    if np.linalg.norm(cross) < 1e-12:
        if dot > 0.0:
            return np.eye(3, dtype=float)
        # 180 degree rotation around any axis orthogonal to src.
        axis = np.array([1.0, 0.0, 0.0], dtype=float)
        if abs(src[0]) > 0.9:
            axis = np.array([0.0, 1.0, 0.0], dtype=float)
        axis = axis - np.dot(axis, src) * src
        axis = axis / max(np.linalg.norm(axis), 1e-12)
        K = _skew(axis)
        return np.eye(3, dtype=float) + 2.0 * (K @ K)
    K = _skew(cross)
    s = float(np.linalg.norm(cross))
    return np.eye(3, dtype=float) + K + (K @ K) * ((1.0 - dot) / (s**2))


def _canonicalize_layout(coords: np.ndarray) -> np.ndarray:
    canonical = np.array(coords, dtype=float, copy=True)
    if canonical.shape[1] < 3:
        canonical = np.concatenate(
            [canonical, np.zeros((canonical.shape[0], 3 - canonical.shape[1]), dtype=float)],
            axis=1,
        )
    canonical = canonical[:, :3]
    canonical = canonical - canonical[0]

    if canonical.shape[0] >= 2:
        rot = _rotation_matrix_from_vectors(canonical[1], np.array([1.0, 0.0, 0.0], dtype=float))
        canonical = canonical @ rot.T
        if canonical[1, 0] < 0.0:
            canonical[:, 0] *= -1.0

    if canonical.shape[0] >= 3:
        y = float(canonical[2, 1])
        z = float(canonical[2, 2])
        theta = math.atan2(z, y)
        rot_x = np.array(
            [
                [1.0, 0.0, 0.0],
                [0.0, math.cos(-theta), -math.sin(-theta)],
                [0.0, math.sin(-theta), math.cos(-theta)],
            ],
            dtype=float,
        )
        canonical = canonical @ rot_x.T
        if canonical[2, 1] < 0.0:
            canonical[:, 1] *= -1.0
            canonical[:, 2] *= -1.0

    if canonical.shape[0] >= 4 and canonical[3, 2] < 0.0:
        canonical[:, 2] *= -1.0

    canonical[np.abs(canonical) < 1e-12] = 0.0
    return canonical


def estimate_layout_from_twr(edges: List[Dict[str, Any]], dims: int = 3) -> Dict[str, Any]:
    """Estimate anchor positions from TWR edge measurements."""
    if not edges:
        return {"anchors": [], "quality": {"status": "no_edges"}}
    dims = max(2, min(3, int(dims)))
    grouped: Dict[Tuple[str, str], List[float]] = defaultdict(list)
    for edge in edges:
        try:
            a, b = _extract_anchor_pair(edge)
            if a == b:
                continue
            dist = _edge_distance(edge)
            key = tuple(sorted((a, b)))
            grouped[key].append(dist)
        except ValueError:
            continue
    if not grouped:
        return {"anchors": [], "quality": {"status": "invalid_edges"}}
    anchor_ids = sorted({aid for pair in grouped.keys() for aid in pair})
    n = len(anchor_ids)
    if n < 2:
        return {"anchors": [], "quality": {"status": "insufficient_anchors"}}
    index = {aid: idx for idx, aid in enumerate(anchor_ids)}
    D = np.full((n, n), np.inf, dtype=float)
    np.fill_diagonal(D, 0.0)
    edge_stats: Dict[Tuple[str, str], Dict[str, float]] = {}
    for key, samples in grouped.items():
        vals = np.array(samples, dtype=float)
        median = float(np.median(vals))
        mad = float(np.median(np.abs(vals - median))) if vals.size > 1 else 0.0
        edge_stats[key] = {"dist": median, "mad": mad}
        i, j = index[key[0]], index[key[1]]
        D[i, j] = D[j, i] = median
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if D[i, k] + D[k, j] < D[i, j]:
                    D[i, j] = D[i, k] + D[k, j]
    if np.any(np.isinf(D)):
        return {
            "anchors": [],
            "quality": {"status": "disconnected_graph", "anchors": anchor_ids},
        }
    J = np.eye(n) - np.ones((n, n)) / n
    B = -0.5 * J @ (D ** 2) @ J
    eigvals, eigvecs = np.linalg.eigh(B)
    order = np.argsort(eigvals)[::-1]
    eigvals = eigvals[order]
    eigvecs = eigvecs[:, order]
    pos_indices = [idx for idx, val in enumerate(eigvals) if val > 1e-9]
    if not pos_indices:
        return {"anchors": [], "quality": {"status": "degenerate_embedding"}}
    take = min(dims, len(pos_indices))
    L = np.diag(np.sqrt(eigvals[:take]))
    V = eigvecs[:, :take]
    coords = V @ L
    coords = _canonicalize_layout(coords)
    residuals = []
    for (a, b), stats in edge_stats.items():
        i, j = index[a], index[b]
        pred = float(np.linalg.norm(coords[i] - coords[j]))
        residuals.append(pred - stats["dist"])
    residuals = np.array(residuals, dtype=float)
    rms = float(np.sqrt(np.mean(residuals ** 2))) if residuals.size else 0.0
    max_abs = float(np.max(np.abs(residuals))) if residuals.size else 0.0
    anchors_out = [
        {
            "id": aid,
            "pos": {
                "x": float(coords[index[aid], 0]),
                "y": float(coords[index[aid], 1]),
                "z": float(coords[index[aid], 2]),
            },
        }
        for aid in anchor_ids
    ]
    quality = {
        "status": "ok",
        "rms_m": rms,
        "max_abs_m": max_abs,
        "edges_used": len(edge_stats),
        "anchors": anchor_ids,
        "dims": take,
    }
    return {"anchors": anchors_out, "quality": quality}


def estimate_clock_params(measurements: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Estimate per-anchor clock offset/drift from sync measurements."""
    return estimate_clock_params_with_delay(measurements, {})


def estimate_clock_params_with_delay(
    measurements: List[Dict[str, Any]], delay_by_anchor: Dict[str, float]
) -> Dict[str, Any]:
    """Estimate per-anchor clock offset/drift after subtracting path delay."""
    if not measurements:
        return {"clocks": [], "quality": {"status": "no_measurements"}}
    grouped: Dict[str, List[Tuple[float, float]]] = defaultdict(list)
    for meas in measurements:
        anchor_id = meas.get("id") or meas.get("anchor_id")
        if not anchor_id:
            continue
        t_anchor = meas.get("t_anchor") or meas.get("t_rx") or meas.get("t_local")
        t_ref = meas.get("t_ref") or meas.get("t_master") or meas.get("t_global")
        if t_anchor is None or t_ref is None:
            continue
        delay = float(delay_by_anchor.get(str(anchor_id), meas.get("path_delay", 0.0) or 0.0))
        grouped[str(anchor_id)].append((float(t_ref), float(t_anchor) - delay))
    if not grouped:
        return {"clocks": [], "quality": {"status": "insufficient_data"}}
    clocks_out: List[Dict[str, Any]] = []
    residuals = []
    for anchor_id, pairs in grouped.items():
        if len(pairs) < 2:
            clocks_out.append(
                {
                    "id": anchor_id,
                    "offset_ns": 0.0,
                    "drift_ppm": 0.0,
                    "valid": False,
                }
            )
            continue
        t_ref = np.array([p[0] for p in pairs], dtype=float)
        t_anchor = np.array([p[1] for p in pairs], dtype=float)
        A = np.vstack([t_ref, np.ones_like(t_ref)]).T
        sol, _, _, _ = np.linalg.lstsq(A, t_anchor, rcond=None)
        alpha, beta = sol[0], sol[1]
        eps = alpha - 1.0
        offset_ns = beta * 1e9
        drift_ppm = eps * 1e6
        pred = alpha * t_ref + beta
        res = t_anchor - pred
        residuals.extend(res.tolist())
        clocks_out.append(
            {
                "id": anchor_id,
                "offset_ns": float(offset_ns),
                "drift_ppm": float(drift_ppm),
                "path_delay_ns": float(delay_by_anchor.get(anchor_id, 0.0) * 1e9),
                "valid": True,
            }
        )
    residuals_arr = np.array(residuals, dtype=float)
    rms_ns = float(np.sqrt(np.mean((residuals_arr * 1e9) ** 2))) if residuals_arr.size else 0.0
    return {
        "clocks": clocks_out,
        "quality": {"status": "ok", "rms_ns": rms_ns, "count": len(clocks_out)},
    }


def estimate_ds_twr_path_delay(exchanges: List[Dict[str, Any]], tick_hz: float | None = None) -> Dict[str, Any]:
    """Estimate one-way path delay from DS-TWR exchanges.

    Timestamps may be in any consistent unit. If ``tick_hz`` is provided, the
    result also includes nanoseconds and distance in meters.
    """
    if not exchanges:
        return {"path_delay": None, "quality": {"status": "no_exchanges"}}

    delays = []
    for ex in exchanges:
        poll_tx = ex.get("poll_tx") or ex.get("t1")
        resp_rx = ex.get("resp_rx") or ex.get("t4")
        final_tx = ex.get("final_tx") or ex.get("t5")
        poll_rx = ex.get("poll_rx") or ex.get("t2")
        resp_tx = ex.get("resp_tx") or ex.get("t3")
        final_rx = ex.get("final_rx") or ex.get("t6")
        if None in (poll_tx, resp_rx, final_tx, poll_rx, resp_tx, final_rx):
            continue

        ra = float(resp_rx) - float(poll_tx)
        rb = float(final_rx) - float(resp_tx)
        da = float(final_tx) - float(resp_rx)
        db = float(resp_tx) - float(poll_rx)
        denom = ra + rb + da + db
        if denom <= 0.0:
            continue
        tof = (ra * rb - da * db) / denom
        if tof <= 0.0:
            continue
        delays.append(float(tof))

    if not delays:
        return {"path_delay": None, "quality": {"status": "invalid_exchanges"}}

    arr = np.array(delays, dtype=float)
    median = float(np.median(arr))
    mad = float(np.median(np.abs(arr - median))) if arr.size > 1 else 0.0
    result: Dict[str, Any] = {
        "path_delay": median,
        "quality": {"status": "ok", "samples": int(arr.size), "mad": mad},
    }
    if tick_hz:
        result["path_delay_ns"] = float(median * 1e9 / tick_hz)
        result["distance_m"] = float(median * C_AIR / tick_hz)
        result["quality"]["mad_ns"] = float(mad * 1e9 / tick_hz)
    return result


def validate_layout_against_authoritative_positions(
    edges: List[Dict[str, Any]], anchors: List[Dict[str, Any]] | Dict[str, Dict[str, float]], warn_threshold_m: float = 0.25
) -> Dict[str, Any]:
    """Compare measured TWR edges against authoritative anchor coordinates."""
    if isinstance(anchors, dict):
        anchor_map = {
            str(anchor_id): np.array(
                [float(pos["x"]), float(pos["y"]), float(pos.get("z", 0.0))], dtype=float
            )
            for anchor_id, pos in anchors.items()
        }
    else:
        anchor_map = {
            str(anchor["id"]): np.array(
                [
                    float(anchor["pos"]["x"]),
                    float(anchor["pos"]["y"]),
                    float(anchor["pos"].get("z", 0.0)),
                ],
                dtype=float,
            )
            for anchor in anchors
            if "id" in anchor and "pos" in anchor
        }
    if not anchor_map:
        return {"edges": [], "quality": {"status": "no_anchors"}}

    comparisons = []
    residuals = []
    for edge in edges:
        try:
            a, b = _extract_anchor_pair(edge)
            if a not in anchor_map or b not in anchor_map:
                continue
            measured = _edge_distance(edge)
        except ValueError:
            continue
        predicted = float(np.linalg.norm(anchor_map[a] - anchor_map[b]))
        residual = predicted - measured
        residuals.append(residual)
        comparisons.append(
            {
                "a": a,
                "b": b,
                "measured_m": float(measured),
                "predicted_m": predicted,
                "residual_m": float(residual),
            }
        )

    if not comparisons:
        return {"edges": [], "quality": {"status": "no_comparable_edges"}}

    residuals_arr = np.array(residuals, dtype=float)
    rms = float(np.sqrt(np.mean(residuals_arr**2)))
    max_abs = float(np.max(np.abs(residuals_arr)))
    return {
        "edges": comparisons,
        "quality": {
            "status": "mismatch" if max_abs > warn_threshold_m else "ok",
            "rms_m": rms,
            "max_abs_m": max_abs,
            "warn_threshold_m": float(warn_threshold_m),
            "count": len(comparisons),
        },
    }
