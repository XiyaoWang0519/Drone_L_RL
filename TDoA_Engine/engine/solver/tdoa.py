from typing import Tuple, Dict, Any, Optional
import numpy as np

def huber_weights(r: np.ndarray, delta: float = 0.2) -> np.ndarray:
    a = np.abs(r)
    w = np.ones_like(r)
    mask = a > delta
    w[mask] = delta / a[mask]
    return w

def residuals_and_jacobian(x: np.ndarray, anchors: np.ndarray, drho: np.ndarray, a_ref: int = 0) -> Tuple[np.ndarray, np.ndarray]:
    """Compute residual vector and Jacobian for TDoA range differences.

    anchors: MxD array, x: D vector, drho: (M-1,) vector of range diffs vs ref.
    """
    M, D = anchors.shape
    assert M >= 2 and drho.shape[0] == M - 1
    a1 = anchors[a_ref]
    J = np.zeros((M - 1, D), dtype=float)
    f = np.zeros((M - 1,), dtype=float)
    idx = 0
    for i in range(M):
        if i == a_ref:
            continue
        ai = anchors[i]
        vi = x - ai
        v1 = x - a1
        di = np.linalg.norm(vi) + 1e-9
        d1 = np.linalg.norm(v1) + 1e-9
        pred = di - d1
        f[idx] = drho[idx] - pred
        J[idx, :] = (vi / di) - (v1 / d1)
        idx += 1
    return f, J

def solve_tdoa(
    anchors: np.ndarray,
    drho: np.ndarray,
    x0: np.ndarray,
    max_iter: int = 10,
    huber_delta: float = 0.2,
    weights: Optional[np.ndarray] = None,
) -> Dict[str, Any]:
    """Gauss-Newton TDoA position solver with optional measurement weights."""
    x = x0.copy()
    used = anchors.shape[0]
    base_w = None
    if weights is not None:
        base_w = np.asarray(weights, dtype=float)
        if base_w.shape[0] != drho.shape[0]:
            raise ValueError("weights dimension mismatch")
    for _ in range(max_iter):
        f, J = residuals_and_jacobian(x, anchors, drho, a_ref=0)
        w = huber_weights(f, delta=huber_delta)
        if base_w is not None:
            diag = w * base_w
        else:
            diag = w
        W = np.diag(diag)
        H = J.T @ W @ J
        g = J.T @ W @ f
        try:
            dx = np.linalg.solve(H, g)
        except np.linalg.LinAlgError:
            break
        x = x + dx
        if np.linalg.norm(dx) < 1e-5:
            break
    f, J = residuals_and_jacobian(x, anchors, drho, a_ref=0)
    w = huber_weights(f, delta=huber_delta)
    if base_w is not None:
        diag = w * base_w
    else:
        diag = w
    W = np.diag(diag)
    H = J.T @ W @ J
    cov = None
    try:
        cov = np.linalg.inv(H)
    except np.linalg.LinAlgError:
        pass
    rms = float(np.sqrt(np.mean(f ** 2))) if f.size else 0.0
    return {"x": x, "residuals": f, "rms": rms, "H": H, "cov": cov, "used": used}
