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
    coords = coords - coords[0]
    if coords.shape[1] >= 2 and n >= 2:
        v = coords[1, :2]
        theta = math.atan2(v[1], v[0])
        rot = np.array(
            [[math.cos(-theta), -math.sin(-theta)], [math.sin(-theta), math.cos(-theta)]]
        )
        coords[:, :2] = coords[:, :2] @ rot.T
        if coords[1, 0] < 0:
            coords[:, 0] *= -1
        if n >= 3:
            v1 = coords[1, :2]
            v2 = coords[2, :2]
            cross = v1[0] * v2[1] - v1[1] * v2[0]
            if cross < 0:
                coords[:, 1] *= -1
    if coords.shape[1] < 3:
        coords = np.concatenate([coords, np.zeros((n, 3 - coords.shape[1]))], axis=1)
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
        grouped[str(anchor_id)].append((float(t_ref), float(t_anchor)))
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
                "valid": True,
            }
        )
    residuals_arr = np.array(residuals, dtype=float)
    rms_ns = float(np.sqrt(np.mean((residuals_arr * 1e9) ** 2))) if residuals_arr.size else 0.0
    return {
        "clocks": clocks_out,
        "quality": {"status": "ok", "rms_ns": rms_ns, "count": len(clocks_out)},
    }

