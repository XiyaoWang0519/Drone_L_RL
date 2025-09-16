import csv
import datetime as _dt
import os
import struct
from typing import Any, Dict, Optional

class LogManager:
    """Manage raw epoch and pose logging for the engine."""

    def __init__(self, root: str = "engine/logs") -> None:
        self.root = root
        self.active = False
        self._raw_fp: Optional[Any] = None
        self._pose_fp: Optional[Any] = None
        self._pose_writer: Optional[csv.writer] = None
        self._base_path: Optional[str] = None

    def start(self, label: Optional[str] = None) -> Dict[str, str]:
        if self.active:
            self.stop()
        ts = _dt.datetime.now().strftime("%Y%m%dT%H%M%S")
        slug = "".join(ch for ch in (label or "run") if ch.isalnum() or ch in ("-", "_"))
        if not slug:
            slug = "run"
        base_name = f"{ts}_{slug}"
        os.makedirs(self.root, exist_ok=True)
        raw_path = os.path.join(self.root, f"{base_name}.bin")
        pose_path = os.path.join(self.root, f"{base_name}_poses.csv")
        self._raw_fp = open(raw_path, "wb")
        self._pose_fp = open(pose_path, "w", newline="")
        self._pose_writer = csv.writer(self._pose_fp)
        self._pose_writer.writerow([
            "seq",
            "t_tx",
            "x",
            "y",
            "z",
            "vx",
            "vy",
            "vz",
            "anchors_used",
            "residual_rms_ns",
            "gdop",
            "outliers",
        ])
        self.active = True
        self._base_path = base_name
        return {"raw_path": raw_path, "pose_path": pose_path, "base": base_name}

    def log(self, raw: bytes, pose: Dict[str, Any]) -> None:
        if not self.active or self._raw_fp is None:
            return
        self._raw_fp.write(struct.pack("<I", len(raw)))
        self._raw_fp.write(raw)
        if self._pose_writer is not None:
            pos = pose.get("pose", {})
            vel = pose.get("vel", {})
            status = pose.get("status", {})
            self._pose_writer.writerow([
                pose.get("tag_tx_seq", -1),
                pose.get("t", 0.0),
                pos.get("x", 0.0),
                pos.get("y", 0.0),
                pos.get("z", 0.0),
                vel.get("x", 0.0),
                vel.get("y", 0.0),
                vel.get("z", 0.0),
                status.get("anchors_used", 0),
                status.get("residual_rms_ns", 0.0),
                status.get("gdop", 0.0),
                status.get("outliers", 0),
            ])
            if self._pose_fp is not None:
                self._pose_fp.flush()
        self._raw_fp.flush()

    def stop(self) -> Dict[str, Optional[str]]:
        info = {"raw_path": None, "pose_path": None, "base": self._base_path}
        if self._raw_fp is not None:
            info["raw_path"] = self._raw_fp.name
            self._raw_fp.close()
        if self._pose_fp is not None:
            info["pose_path"] = self._pose_fp.name
            self._pose_fp.close()
        self._raw_fp = None
        self._pose_fp = None
        self._pose_writer = None
        self._base_path = None
        self.active = False
        return info

    def resolve(self, name: str) -> str:
        if os.path.isabs(name):
            return name
        return os.path.join(self.root, name)

    def is_active(self) -> bool:
        return self.active

    def current_paths(self) -> Dict[str, Optional[str]]:
        if not self.active or self._raw_fp is None or self._pose_fp is None:
            return {"raw_path": None, "pose_path": None, "base": self._base_path}
        return {
            "raw_path": self._raw_fp.name,
            "pose_path": self._pose_fp.name,
            "base": self._base_path,
        }
