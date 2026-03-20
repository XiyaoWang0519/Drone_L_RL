#!/usr/bin/env python3
"""Capture raw serial logs for a fixed duration."""

from __future__ import annotations

import argparse
import datetime as dt
import pathlib
import sys
import time

try:
    import serial
    from serial import SerialException
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "pyserial is required. Install with `python -m pip install pyserial`."
    ) from exc


def utc_now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="milliseconds")


def default_output_path(port: str) -> pathlib.Path:
    stamp = dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_port = port.replace("/", "_").strip("_")
    return pathlib.Path.cwd() / f"serial_capture_{safe_port}_{stamp}.log"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", required=True, help="Serial port, e.g. /dev/cu.usbmodem1101")
    parser.add_argument("--baud", type=int, default=115200, help="Baud rate")
    parser.add_argument(
        "--duration",
        type=float,
        default=10.0,
        help="Capture duration in seconds",
    )
    parser.add_argument(
        "--output",
        type=pathlib.Path,
        help="Output log path (default: timestamped file in current directory)",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Do not echo captured lines to stdout",
    )
    parser.add_argument(
        "--wait-for-port",
        type=float,
        default=0.0,
        help="Wait up to this many seconds for the serial port to appear",
    )
    return parser.parse_args()


def open_serial_when_available(port: str, baud: int, wait_for_port: float) -> serial.Serial:
    deadline = time.monotonic() + max(wait_for_port, 0.0)
    last_error: Exception | None = None

    while True:
        try:
            return serial.Serial(port, baud, timeout=0.2)
        except SerialException as exc:
            last_error = exc

        if time.monotonic() >= deadline:
            break
        time.sleep(0.2)

    if last_error is None:
        raise SerialException(f"timed out waiting for {port}")
    raise last_error


def main() -> int:
    args = parse_args()
    output_path = args.output or default_output_path(args.port)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        if args.wait_for_port > 0:
            print(f"waiting for {args.port} for up to {args.wait_for_port:.1f}s")
        ser = open_serial_when_available(args.port, args.baud, args.wait_for_port)
    except SerialException as exc:
        print(f"serial open failed: {exc}", file=sys.stderr)
        return 1

    deadline = time.monotonic() + max(args.duration, 0.0)
    line_count = 0

    print(f"capturing {args.port} for {args.duration:.1f}s -> {output_path}")
    with ser, output_path.open("w", encoding="utf-8") as fp:
        while time.monotonic() < deadline:
            try:
                line_bytes = ser.readline()
            except SerialException as exc:
                print(f"serial read failed: {exc}", file=sys.stderr)
                return 1

            if not line_bytes:
                continue

            line = line_bytes.decode("utf-8", errors="replace").rstrip("\r\n")
            stamped = f"{utc_now_iso()} {line}"
            fp.write(stamped + "\n")
            fp.flush()
            line_count += 1

            if not args.quiet:
                print(stamped)

    print(f"captured {line_count} line(s) -> {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
