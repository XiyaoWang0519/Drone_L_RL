from typing import Optional
import numpy as np

class CVEKF:
    """Constant-Velocity EKF for 2D/3D position smoothing."""

    def __init__(self, dim: int = 2, q_acc: float = 1.0):
        assert dim in (2, 3)
        self.dim = dim
        n = 2 * dim
        self.x = np.zeros((n,), dtype=float)
        self.P = np.eye(n) * 1e3  # large initial uncertainty
        self.q_acc = q_acc

    def F(self, dt: float) -> np.ndarray:
        d = self.dim
        F = np.eye(2 * d)
        for i in range(d):
            F[i, d + i] = dt
        return F

    def Q(self, dt: float) -> np.ndarray:
        d = self.dim
        q = self.q_acc
        Q = np.zeros((2 * d, 2 * d))
        for i in range(d):
            Q[i, i] = 0.25 * dt ** 4 * q
            Q[i, d + i] = 0.5 * dt ** 3 * q
            Q[d + i, i] = 0.5 * dt ** 3 * q
            Q[d + i, d + i] = dt ** 2 * q
        return Q

    def predict(self, dt: float) -> None:
        F = self.F(dt)
        Q = self.Q(dt)
        self.x = F @ self.x
        self.P = F @ self.P @ F.T + Q

    def update(self, z: np.ndarray, R: Optional[np.ndarray] = None) -> None:
        d = self.dim
        H = np.zeros((d, 2 * d))
        for i in range(d):
            H[i, i] = 1.0
        if R is None:
            R = np.eye(d) * 0.05
        y = z - (H @ self.x)
        S = H @ self.P @ H.T + R
        K = self.P @ H.T @ np.linalg.inv(S)
        self.x = self.x + K @ y
        I = np.eye(2 * d)
        self.P = (I - K @ H) @ self.P

    def state(self):
        return self.x.copy(), self.P.copy()
