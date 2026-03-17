#!/usr/bin/env python3
"""Capture verification logs from multiple UWB anchors over USB CDC."""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import pathlib
import queue
import re
import threading
import time
from dataclasses import dataclass
from typing import Dict, List, Optional

import yaml

try:
    import serial
    from serial import SerialException
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "pyserial is required. Install with `python -m pip install pyserial`."
    ) from exc


CSV_FIELDS = [
    "host_ts_utc",
    "source_name",
    "source_role",
    "port",
    "ts_ms",
    "role",
    "anchor_id",
    "slot_id",
    "event",
    "seq",
    "master_id",
    "t1_master",
    "t2_slave",
    "err_ns",
    "tx_ts",
    "t_slave",
    "tx_ok",
    "tx_late",
    "tx_timeout",
    "rx_ok",
    "rx_err",
    "rx_timeout",
    "missed_total",
    "missed_count",
    "max_consecutive_missed",
    "expected_seq",
    "last_sync_seq",
    "from_seq",
    "to_seq",
    "tag",
    "raw_line",
    "extra_json",
]


@dataclass
class AnchorConfig:
    name: str
    role: str
    port: str
    baud: int = 115200
    expected_anchor_id: Optional[int] = None


def slugify(text: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9_-]+", "_", text.strip())
    slug = slug.strip("_")
    return slug or "run"


def utc_now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat()


def parse_ver_line(line: str) -> Optional[Dict[str, str]]:
    if not line.startswith("VER "):
        return None

    data: Dict[str, str] = {}
    for token in line.split()[1:]:
        if "=" not in token:
            continue
        key, value = token.split("=", 1)
        data[key] = value

    if "event" not in data:
        return None
    return data


def load_ports_config(path: pathlib.Path) -> Dict[str, object]:
    with path.open("r", encoding="utf-8") as fp:
        payload = yaml.safe_load(fp) or {}

    if not isinstance(payload, dict):
        raise ValueError("ports config must be a YAML mapping")

    anchors_raw = payload.get("anchors")
    if not isinstance(anchors_raw, list) or not anchors_raw:
        raise ValueError("ports config requires non-empty `anchors` list")

    anchors: List[AnchorConfig] = []
    for idx, item in enumerate(anchors_raw):
        if not isinstance(item, dict):
            raise ValueError(f"anchors[{idx}] must be a mapping")

        name = str(item.get("name", "")).strip()
        role = str(item.get("role", "")).strip().lower()
        port = str(item.get("port", "")).strip()
        if not name or not port:
            raise ValueError(f"anchors[{idx}] must define `name` and `port`")
        if role not in {"master", "slave"}:
            raise ValueError(f"anchors[{idx}] role must be `master` or `slave`")

        baud = int(item.get("baud", 115200))
        expected_anchor_id = item.get("expected_anchor_id")
        if expected_anchor_id is not None:
            expected_anchor_id = int(expected_anchor_id)

        anchors.append(
            AnchorConfig(
                name=name,
                role=role,
                port=port,
                baud=baud,
                expected_anchor_id=expected_anchor_id,
            )
        )

    payload["anchors"] = anchors
    return payload


def event_to_row(
    anchor: AnchorConfig,
    host_ts: str,
    raw_line: str,
    event: Dict[str, str],
) -> Dict[str, str]:
    row: Dict[str, str] = {key: "" for key in CSV_FIELDS}
    row["host_ts_utc"] = host_ts
    row["source_name"] = anchor.name
    row["source_role"] = anchor.role
    row["port"] = anchor.port
    row["raw_line"] = raw_line

    extras = {}
    known_event_keys = set(CSV_FIELDS) - {
        "host_ts_utc",
        "source_name",
        "source_role",
        "port",
        "raw_line",
        "extra_json",
    }

    for key, value in event.items():
        if key in row:
            row[key] = value
        elif key in known_event_keys:
            row[key] = value
        else:
            extras[key] = value

    if extras:
        row["extra_json"] = json.dumps(extras, sort_keys=True)

    return row


def capture_anchor(
    anchor: AnchorConfig,
    raw_path: pathlib.Path,
    parsed_path: pathlib.Path,
    stop_event: threading.Event,
    errors: "queue.Queue[str]",
) -> None:
    try:
        ser = serial.Serial(anchor.port, anchor.baud, timeout=0.2)
    except SerialException as exc:
        errors.put(f"[{anchor.name}] serial open failed: {exc}")
        return

    with ser, raw_path.open("w", encoding="utf-8") as raw_fp, parsed_path.open(
        "w", encoding="utf-8", newline=""
    ) as parsed_fp:
        writer = csv.DictWriter(parsed_fp, fieldnames=CSV_FIELDS)
        writer.writeheader()

        while not stop_event.is_set():
            try:
                line_bytes = ser.readline()
            except SerialException as exc:
                errors.put(f"[{anchor.name}] serial read failed: {exc}")
                break

            if not line_bytes:
                continue

            host_ts = utc_now_iso()
            line = line_bytes.decode("utf-8", errors="replace").rstrip("\r\n")
            raw_fp.write(f"{host_ts} {line}\n")

            parsed = parse_ver_line(line)
            if parsed:
                row = event_to_row(anchor, host_ts, line, parsed)
                writer.writerow(row)
                parsed_fp.flush()

            raw_fp.flush()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--ports-config",
        required=True,
        type=pathlib.Path,
        help="YAML file listing anchor serial ports",
    )
    parser.add_argument(
        "--duration-s",
        type=float,
        default=300.0,
        help="Capture duration in seconds (default: 300)",
    )
    parser.add_argument(
        "--out",
        type=pathlib.Path,
        default=pathlib.Path("logs/uwb_verify"),
        help="Base output directory",
    )
    parser.add_argument(
        "--label",
        default="sync_run",
        help="Run label used in output folder name",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if args.duration_s <= 0:
        raise SystemExit("--duration-s must be > 0")

    cfg = load_ports_config(args.ports_config)
    anchors: List[AnchorConfig] = cfg["anchors"]  # type: ignore[assignment]

    ts = dt.datetime.now().strftime("%Y%m%dT%H%M%S")
    run_name = f"{ts}_{slugify(args.label)}"
    run_dir = args.out / run_name
    raw_dir = run_dir / "raw"
    parsed_dir = run_dir / "parsed"
    reports_dir = run_dir / "reports"

    raw_dir.mkdir(parents=True, exist_ok=False)
    parsed_dir.mkdir(parents=True, exist_ok=False)
    reports_dir.mkdir(parents=True, exist_ok=False)

    stop_event = threading.Event()
    errors: "queue.Queue[str]" = queue.Queue()
    threads: List[threading.Thread] = []

    capture_start = utc_now_iso()
    monotonic_start = time.monotonic()

    for anchor in anchors:
        raw_path = raw_dir / f"{slugify(anchor.name)}.log"
        parsed_path = parsed_dir / f"{slugify(anchor.name)}_events.csv"
        thread = threading.Thread(
            target=capture_anchor,
            args=(anchor, raw_path, parsed_path, stop_event, errors),
            daemon=True,
            name=f"capture-{anchor.name}",
        )
        thread.start()
        threads.append(thread)

    deadline = monotonic_start + args.duration_s
    while time.monotonic() < deadline:
        if not errors.empty():
            break
        time.sleep(0.1)

    stop_event.set()
    for thread in threads:
        thread.join(timeout=3.0)

    capture_end = utc_now_iso()
    elapsed_s = time.monotonic() - monotonic_start

    run_manifest = {
        "run_name": run_name,
        "run_dir": str(run_dir),
        "capture_start_utc": capture_start,
        "capture_end_utc": capture_end,
        "requested_duration_s": args.duration_s,
        "actual_duration_s": round(elapsed_s, 3),
        "ports_config": str(args.ports_config),
        "anchors": [
            {
                "name": anchor.name,
                "role": anchor.role,
                "port": anchor.port,
                "baud": anchor.baud,
                "expected_anchor_id": anchor.expected_anchor_id,
            }
            for anchor in anchors
        ],
        "errors": [],
    }

    while not errors.empty():
        run_manifest["errors"].append(errors.get())

    manifest_path = run_dir / "run_manifest.json"
    with manifest_path.open("w", encoding="utf-8") as fp:
        json.dump(run_manifest, fp, indent=2, sort_keys=True)

    print(f"Run directory: {run_dir}")
    print(f"Capture duration: {elapsed_s:.2f}s")
    print(f"Manifest: {manifest_path}")

    if run_manifest["errors"]:
        print("Capture errors:")
        for err in run_manifest["errors"]:
            print(f"  - {err}")
        return 2

    print("Capture completed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
