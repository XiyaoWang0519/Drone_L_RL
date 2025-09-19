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
    diag_base = None
    if weights is not None:
        diag_base = np.asarray(weights, dtype=float)
        if diag_base.shape[0] != drho.shape[0]:
            raise ValueError("weights dimension mismatch")
    else:
        diag_base = np.ones_like(drho, dtype=float)

    D = anchors.shape[1]
    I = np.eye(D)
    lam = 1e-3
    mins = anchors.min(axis=0)
    maxs = anchors.max(axis=0)
    span = maxs - mins
    margin = np.maximum(span, np.full_like(span, 3.0))
    lower_bound = mins - margin
    upper_bound = maxs + margin
    for _ in range(max_iter):
        f, J = residuals_and_jacobian(x, anchors, drho, a_ref=0)
        w = huber_weights(f, delta=huber_delta)
        diag = np.clip(w * diag_base, 1e-9, None)
        res_norm = float(np.dot(diag * f, f))
        H = J.T @ (diag[:, None] * J)
        g = J.T @ (diag * f)
        mu = lam
        success = False
        step_norm = 0.0
        for _ in range(8):
            try:
                dx = np.linalg.solve(H + mu * I, g)
            except np.linalg.LinAlgError:
                mu *= 10.0
                continue
            x_candidate = x + dx
            x_candidate = np.clip(x_candidate, lower_bound, upper_bound)
            dx = x_candidate - x
            f_candidate, _ = residuals_and_jacobian(x_candidate, anchors, drho, a_ref=0)
            w_candidate = huber_weights(f_candidate, delta=huber_delta)
            diag_candidate = np.clip(w_candidate * diag_base, 1e-9, None)
            res_candidate = float(np.dot(diag_candidate * f_candidate, f_candidate))
            step_norm = float(np.linalg.norm(dx))
            if res_candidate < res_norm or step_norm < 1e-7:
                x = x_candidate
                lam = max(mu * 0.25, 1e-6)
                success = True
                break
            mu *= 4.0
        if not success:
            lam *= 10.0
            if lam > 1e9:
                break
        if success and step_norm < 1e-5:
            break

    f, J = residuals_and_jacobian(x, anchors, drho, a_ref=0)
    w = huber_weights(f, delta=huber_delta)
    diag = np.clip(w * diag_base, 1e-9, None)
    H = J.T @ (diag[:, None] * J)
    cov = None
    try:
        cov = np.linalg.inv(H)
    except np.linalg.LinAlgError:
        pass
    rms = float(np.sqrt(np.mean(f ** 2))) if f.size else 0.0
    return {"x": x, "residuals": f, "rms": rms, "H": H, "cov": cov, "used": used}
