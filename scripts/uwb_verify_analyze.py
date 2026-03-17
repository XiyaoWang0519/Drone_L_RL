#!/usr/bin/env python3
"""Analyze UWB verification captures and static-tag logs."""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import math
import pathlib
import statistics
from dataclasses import dataclass
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

import yaml


SYNC_FIELDS = [
    "anchor",
    "role",
    "duration_s",
    "sync_rx_count",
    "sync_err_count",
    "sync_err_rms_ns",
    "sync_err_jitter_ns",
    "rx_error_count",
    "rx_timeout_count",
    "rx_error_rate_hz",
    "missed_sync_total",
    "max_consecutive_missed_sync",
    "blink_alignment_window_ms",
    "blink_aligned_error_count",
    "blink_alignment_ratio",
    "suspected_schedule_guard_issue",
    "overall_status",
]

DROPOUT_FIELDS = [
    "anchor",
    "event",
    "ts_ms",
    "seq",
    "expected_seq",
    "from_seq",
    "to_seq",
    "missed_count",
    "details",
]

STATIC_FIELDS = [
    "samples",
    "duration_s",
    "warmup_s",
    "reference_mode",
    "ref_x",
    "ref_y",
    "ref_z",
    "rms_3d_m",
    "rms_xy_m",
    "p95_3d_m",
    "std_x_m",
    "std_y_m",
    "std_z_m",
    "overall_status",
]


@dataclass
class CheckResult:
    name: str
    status: str
    metric: Optional[float]
    threshold: Optional[float]
    op: str


def parse_int(value: str) -> Optional[int]:
    if value is None:
        return None
    value = str(value).strip()
    if not value:
        return None
    try:
        return int(value)
    except ValueError:
        return None


def parse_float(value: str) -> Optional[float]:
    if value is None:
        return None
    value = str(value).strip()
    if not value:
        return None
    try:
        return float(value)
    except ValueError:
        return None


def load_yaml(path: Optional[pathlib.Path]) -> Dict[str, object]:
    if path is None:
        return {}
    with path.open("r", encoding="utf-8") as fp:
        data = yaml.safe_load(fp) or {}
    if not isinstance(data, dict):
        raise ValueError(f"YAML root must be mapping: {path}")
    return data


def mean(values: Sequence[float]) -> Optional[float]:
    return (sum(values) / len(values)) if values else None


def rms(values: Sequence[float]) -> Optional[float]:
    if not values:
        return None
    return math.sqrt(sum(v * v for v in values) / len(values))


def stddev(values: Sequence[float]) -> Optional[float]:
    if not values:
        return None
    if len(values) == 1:
        return 0.0
    return statistics.pstdev(values)


def percentile(values: Sequence[float], p: float) -> Optional[float]:
    if not values:
        return None
    if p <= 0:
        return min(values)
    if p >= 100:
        return max(values)

    ordered = sorted(values)
    rank = (len(ordered) - 1) * (p / 100.0)
    lo = int(math.floor(rank))
    hi = int(math.ceil(rank))
    if lo == hi:
        return ordered[lo]
    frac = rank - lo
    return ordered[lo] * (1.0 - frac) + ordered[hi] * frac


def seq_gap_metrics(sync_rows: Sequence[Dict[str, str]]) -> Tuple[int, int, List[Dict[str, object]]]:
    rows = []
    for row in sync_rows:
        ts = parse_int(row.get("ts_ms", ""))
        seq = parse_int(row.get("seq", ""))
        if ts is None or seq is None:
            continue
        rows.append((ts, seq))

    rows.sort(key=lambda item: item[0])
    if len(rows) < 2:
        return 0, 0, []

    missed_total = 0
    current_consecutive = 0
    max_consecutive = 0
    gap_events: List[Dict[str, object]] = []

    prev_seq = rows[0][1]
    for ts, seq in rows[1:]:
        delta = (seq - prev_seq) & 0xFFFF
        if delta == 0:
            continue
        if delta == 1:
            current_consecutive = 0
            prev_seq = seq
            continue

        missed = delta - 1
        missed_total += missed
        current_consecutive += missed
        max_consecutive = max(max_consecutive, current_consecutive)

        gap_events.append(
            {
                "event": "MISSED_SYNC_GAP",
                "ts_ms": ts,
                "from_seq": (prev_seq + 1) & 0xFFFF,
                "to_seq": (seq - 1) & 0xFFFF,
                "missed_count": missed,
                "seq": seq,
            }
        )
        prev_seq = seq

    return missed_total, max_consecutive, gap_events


def count_aligned_events(error_ts: Sequence[int], blink_ts: Sequence[int], window_ms: float) -> int:
    if not error_ts or not blink_ts:
        return 0

    errors = sorted(error_ts)
    blinks = sorted(blink_ts)
    aligned = 0
    b_idx = 0

    for err in errors:
        while b_idx < len(blinks) and blinks[b_idx] < err - window_ms:
            b_idx += 1

        candidates = []
        if b_idx < len(blinks):
            candidates.append(blinks[b_idx])
        if b_idx > 0:
            candidates.append(blinks[b_idx - 1])

        if any(abs(err - blink) <= window_ms for blink in candidates):
            aligned += 1

    return aligned


def evaluate_check(
    name: str,
    metric: Optional[float],
    threshold: Optional[float],
    op: str,
) -> CheckResult:
    if threshold is None:
        return CheckResult(name=name, status="NOT_CONFIGURED", metric=metric, threshold=None, op=op)
    if metric is None:
        return CheckResult(name=name, status="FAIL", metric=None, threshold=threshold, op=op)

    if op == "<=":
        status = "PASS" if metric <= threshold else "FAIL"
    elif op == ">=":
        status = "PASS" if metric >= threshold else "FAIL"
    else:
        raise ValueError(f"unsupported op: {op}")

    return CheckResult(name=name, status=status, metric=metric, threshold=threshold, op=op)


def load_parsed_rows(run_dir: pathlib.Path) -> Dict[str, List[Dict[str, str]]]:
    parsed_dir = run_dir / "parsed"
    if not parsed_dir.exists():
        raise FileNotFoundError(f"missing parsed directory: {parsed_dir}")

    anchors: Dict[str, List[Dict[str, str]]] = {}
    for csv_path in sorted(parsed_dir.glob("*_events.csv")):
        with csv_path.open("r", encoding="utf-8") as fp:
            reader = csv.DictReader(fp)
            for row in reader:
                anchor = row.get("source_name", "").strip() or csv_path.stem
                anchors.setdefault(anchor, []).append(row)

    if not anchors:
        raise RuntimeError(f"no parsed event csv files found in {parsed_dir}")

    return anchors


def analyze_sync(run_dir: pathlib.Path, thresholds: Dict[str, object]) -> Dict[str, object]:
    sync_thresholds = thresholds.get("sync", {}) if isinstance(thresholds.get("sync"), dict) else {}
    min_duration_s = parse_float(sync_thresholds.get("min_duration_s", ""))
    max_rms_ns = parse_float(sync_thresholds.get("max_sync_err_rms_ns", ""))
    max_jitter_ns = parse_float(sync_thresholds.get("max_sync_err_jitter_ns", ""))
    max_rx_rate_hz = parse_float(sync_thresholds.get("max_rx_error_rate_hz", ""))
    max_consecutive_missed = parse_float(sync_thresholds.get("max_consecutive_missed_sync", ""))
    align_window_ms = parse_float(sync_thresholds.get("alignment_window_ms", ""))
    if align_window_ms is None:
        align_window_ms = 5.0
    align_ratio_min = parse_float(sync_thresholds.get("schedule_alignment_ratio_min", ""))
    if align_ratio_min is None:
        align_ratio_min = 0.6

    anchors_rows = load_parsed_rows(run_dir)
    reports_dir = run_dir / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)

    metrics_rows: List[Dict[str, object]] = []
    dropout_rows: List[Dict[str, object]] = []
    check_details: Dict[str, List[CheckResult]] = {}

    for anchor, rows in sorted(anchors_rows.items()):
        role = ""
        for row in rows:
            role = (row.get("role") or row.get("source_role") or "").strip().lower()
            if role:
                break
        if role != "slave":
            continue

        ts_values = [parse_int(r.get("ts_ms", "")) for r in rows]
        ts_values = [v for v in ts_values if v is not None]
        duration_s = 0.0
        if ts_values:
            duration_s = max(0.0, (max(ts_values) - min(ts_values)) / 1000.0)

        sync_rx_rows = [r for r in rows if r.get("event") == "SYNC_RX"]
        sync_err_vals = [
            parse_float(r.get("err_ns", ""))
            for r in rows
            if r.get("event") == "SYNC_ERR"
        ]
        sync_err_vals = [v for v in sync_err_vals if v is not None]

        sync_err_rms = rms(sync_err_vals)
        sync_err_jitter = stddev(sync_err_vals)

        rx_error_rows = [r for r in rows if r.get("event") in {"RX_ERROR", "RX_TIMEOUT"}]
        rx_timeout_rows = [r for r in rows if r.get("event") == "RX_TIMEOUT"]
        rx_error_count = len(rx_error_rows)
        rx_timeout_count = len(rx_timeout_rows)
        rx_error_rate = (rx_error_count / duration_s) if duration_s > 0 else None

        seq_missed_total, seq_max_consecutive, gap_events = seq_gap_metrics(sync_rx_rows)

        event_missed_total = sum(
            parse_int(r.get("missed_count", "")) or 0
            for r in rows
            if r.get("event") == "MISSED_SYNC"
        )
        event_max_consecutive = 0
        for r in rows:
            if r.get("event") not in {"MISSED_SYNC", "SUMMARY"}:
                continue
            value = parse_int(r.get("max_consecutive_missed", ""))
            if value is not None:
                event_max_consecutive = max(event_max_consecutive, value)

        summary_missed_total = 0
        for r in rows:
            if r.get("event") != "SUMMARY":
                continue
            value = parse_int(r.get("missed_total", ""))
            if value is not None:
                summary_missed_total = max(summary_missed_total, value)

        missed_total = max(seq_missed_total, event_missed_total, summary_missed_total)
        max_consecutive = max(seq_max_consecutive, event_max_consecutive)

        blink_ts = [
            parse_int(r.get("ts_ms", ""))
            for r in rows
            if r.get("event") == "BLINK_TX"
        ]
        blink_ts = [v for v in blink_ts if v is not None]
        error_ts = [parse_int(r.get("ts_ms", "")) for r in rx_error_rows]
        error_ts = [v for v in error_ts if v is not None]

        aligned_count = count_aligned_events(error_ts, blink_ts, align_window_ms)
        blink_alignment_ratio = (
            (aligned_count / len(error_ts)) if error_ts else 0.0
        )
        suspected_schedule_issue = bool(error_ts) and blink_alignment_ratio >= align_ratio_min

        checks = [
            evaluate_check("duration", duration_s, min_duration_s, ">="),
            evaluate_check("sync_err_rms_ns", sync_err_rms, max_rms_ns, "<="),
            evaluate_check("sync_err_jitter_ns", sync_err_jitter, max_jitter_ns, "<="),
            evaluate_check("rx_error_rate_hz", rx_error_rate, max_rx_rate_hz, "<="),
            evaluate_check(
                "max_consecutive_missed_sync",
                float(max_consecutive),
                max_consecutive_missed,
                "<=",
            ),
        ]
        check_details[anchor] = checks

        overall_status = "PASS"
        for check in checks:
            if check.status == "FAIL":
                overall_status = "FAIL"
                break

        metrics_rows.append(
            {
                "anchor": anchor,
                "role": role,
                "duration_s": round(duration_s, 3),
                "sync_rx_count": len(sync_rx_rows),
                "sync_err_count": len(sync_err_vals),
                "sync_err_rms_ns": "" if sync_err_rms is None else round(sync_err_rms, 3),
                "sync_err_jitter_ns": "" if sync_err_jitter is None else round(sync_err_jitter, 3),
                "rx_error_count": rx_error_count,
                "rx_timeout_count": rx_timeout_count,
                "rx_error_rate_hz": "" if rx_error_rate is None else round(rx_error_rate, 6),
                "missed_sync_total": missed_total,
                "max_consecutive_missed_sync": max_consecutive,
                "blink_alignment_window_ms": align_window_ms,
                "blink_aligned_error_count": aligned_count,
                "blink_alignment_ratio": round(blink_alignment_ratio, 4),
                "suspected_schedule_guard_issue": int(suspected_schedule_issue),
                "overall_status": overall_status,
            }
        )

        for gap in gap_events:
            dropout_rows.append(
                {
                    "anchor": anchor,
                    "event": gap["event"],
                    "ts_ms": gap["ts_ms"],
                    "seq": gap["seq"],
                    "expected_seq": "",
                    "from_seq": gap["from_seq"],
                    "to_seq": gap["to_seq"],
                    "missed_count": gap["missed_count"],
                    "details": "Derived from SYNC_RX sequence continuity",
                }
            )

        for row in rx_error_rows:
            dropout_rows.append(
                {
                    "anchor": anchor,
                    "event": row.get("event", ""),
                    "ts_ms": parse_int(row.get("ts_ms", "")) or "",
                    "seq": parse_int(row.get("seq", "")) or "",
                    "expected_seq": parse_int(row.get("expected_seq", "")) or "",
                    "from_seq": "",
                    "to_seq": "",
                    "missed_count": "",
                    "details": f"last_sync_seq={row.get('last_sync_seq', '')}",
                }
            )

    metrics_path = reports_dir / "sync_metrics_per_anchor.csv"
    with metrics_path.open("w", encoding="utf-8", newline="") as fp:
        writer = csv.DictWriter(fp, fieldnames=SYNC_FIELDS)
        writer.writeheader()
        for row in metrics_rows:
            writer.writerow(row)

    dropout_path = reports_dir / "dropout_events.csv"
    with dropout_path.open("w", encoding="utf-8", newline="") as fp:
        writer = csv.DictWriter(fp, fieldnames=DROPOUT_FIELDS)
        writer.writeheader()
        for row in dropout_rows:
            writer.writerow(row)

    overall_status = "PASS"
    if not metrics_rows:
        overall_status = "FAIL"
    elif any(row["overall_status"] == "FAIL" for row in metrics_rows):
        overall_status = "FAIL"

    report_path = reports_dir / "verification_report.md"
    now = dt.datetime.now().isoformat(timespec="seconds")
    with report_path.open("w", encoding="utf-8") as fp:
        fp.write("# UWB Sync Verification Report\n\n")
        fp.write(f"Generated: {now}\n\n")
        fp.write(f"Run dir: `{run_dir}`\n\n")
        fp.write(f"Overall status: **{overall_status}**\n\n")

        fp.write("## Per-Anchor Metrics\n\n")
        if not metrics_rows:
            fp.write("No slave anchor data found.\n\n")
        else:
            fp.write(
                "| Anchor | Duration (s) | RMS (ns) | Jitter (ns) | RX err rate (Hz) | "
                "Missed total | Max consec missed | Align ratio | Schedule issue | Status |\n"
            )
            fp.write("|---|---:|---:|---:|---:|---:|---:|---:|---:|---|\n")
            for row in metrics_rows:
                fp.write(
                    "| {anchor} | {duration_s} | {sync_err_rms_ns} | {sync_err_jitter_ns} "
                    "| {rx_error_rate_hz} | {missed_sync_total} | {max_consecutive_missed_sync} "
                    "| {blink_alignment_ratio} | {suspected_schedule_guard_issue} | "
                    "{overall_status} |\n".format(**row)
                )
            fp.write("\n")

        fp.write("## Check Results\n\n")
        for anchor, checks in check_details.items():
            fp.write(f"### {anchor}\n\n")
            fp.write("| Check | Metric | Rule | Status |\n")
            fp.write("|---|---:|---|---|\n")
            for check in checks:
                metric_text = "" if check.metric is None else f"{check.metric:.6f}"
                if check.threshold is None:
                    rule_text = "not configured"
                else:
                    rule_text = f"{check.op} {check.threshold}"
                fp.write(f"| {check.name} | {metric_text} | {rule_text} | {check.status} |\n")
            fp.write("\n")

        fp.write("## Interpretation\n\n")
        fp.write(
            "If `Schedule issue` is 1, RX errors are strongly time-aligned with this anchor's "
            "own BLINK transmit moments, which suggests scheduling/guard-time pressure rather "
            "than pure RF coverage loss.\n"
        )

    summary = {
        "mode": "sync",
        "run_dir": str(run_dir),
        "generated_at": now,
        "overall_status": overall_status,
        "metrics_csv": str(metrics_path),
        "dropout_csv": str(dropout_path),
        "report_md": str(report_path),
        "anchors": metrics_rows,
    }

    summary_path = reports_dir / "verification_summary.json"
    with summary_path.open("w", encoding="utf-8") as fp:
        json.dump(summary, fp, indent=2)

    print(f"Sync metrics: {metrics_path}")
    print(f"Dropout events: {dropout_path}")
    print(f"Report: {report_path}")
    print(f"Summary: {summary_path}")

    return summary


def analyze_static(
    pose_csv: pathlib.Path,
    out_dir: pathlib.Path,
    thresholds: Dict[str, object],
    truth: Optional[Tuple[float, float, float]],
    warmup_override_s: Optional[float],
) -> Dict[str, object]:
    static_thresholds = (
        thresholds.get("static", {}) if isinstance(thresholds.get("static"), dict) else {}
    )

    min_duration_s = parse_float(static_thresholds.get("min_duration_s", ""))
    max_rms_cm = parse_float(static_thresholds.get("max_3d_rms_cm", ""))
    max_xy_rms_cm = parse_float(static_thresholds.get("max_xy_rms_cm", ""))
    max_p95_cm = parse_float(static_thresholds.get("max_p95_cm", ""))
    default_warmup_s = parse_float(static_thresholds.get("warmup_s", "")) or 0.0
    warmup_s = warmup_override_s if warmup_override_s is not None else default_warmup_s

    rows = []
    with pose_csv.open("r", encoding="utf-8") as fp:
        reader = csv.DictReader(fp)
        for row in reader:
            t = parse_float(row.get("t", ""))
            x = parse_float(row.get("x", ""))
            y = parse_float(row.get("y", ""))
            z = parse_float(row.get("z", ""))
            if t is None or x is None or y is None or z is None:
                continue
            rows.append((t, x, y, z))

    if not rows:
        raise RuntimeError(f"no valid pose rows found in {pose_csv}")

    rows.sort(key=lambda item: item[0])
    t0 = rows[0][0]
    rows = [row for row in rows if row[0] >= t0 + warmup_s]
    if not rows:
        raise RuntimeError("all rows were removed by warmup filter")

    ts = [r[0] for r in rows]
    xs = [r[1] for r in rows]
    ys = [r[2] for r in rows]
    zs = [r[3] for r in rows]

    if truth is None:
        ref_x = statistics.mean(xs)
        ref_y = statistics.mean(ys)
        ref_z = statistics.mean(zs)
        reference_mode = "mean"
    else:
        ref_x, ref_y, ref_z = truth
        reference_mode = "truth"

    dx = [x - ref_x for x in xs]
    dy = [y - ref_y for y in ys]
    dz = [z - ref_z for z in zs]

    radial_3d = [math.sqrt((a * a) + (b * b) + (c * c)) for a, b, c in zip(dx, dy, dz)]
    radial_xy = [math.sqrt((a * a) + (b * b)) for a, b in zip(dx, dy)]

    rms_3d_m = rms(radial_3d) or 0.0
    rms_xy_m = rms(radial_xy) or 0.0
    p95_3d_m = percentile(radial_3d, 95.0) or 0.0
    std_x_m = stddev(dx) or 0.0
    std_y_m = stddev(dy) or 0.0
    std_z_m = stddev(dz) or 0.0
    duration_s = max(0.0, ts[-1] - ts[0])

    checks = [
        evaluate_check("duration", duration_s, min_duration_s, ">="),
        evaluate_check("rms_3d_cm", rms_3d_m * 100.0, max_rms_cm, "<="),
        evaluate_check("rms_xy_cm", rms_xy_m * 100.0, max_xy_rms_cm, "<="),
        evaluate_check("p95_3d_cm", p95_3d_m * 100.0, max_p95_cm, "<="),
    ]

    overall_status = "PASS"
    for check in checks:
        if check.status == "FAIL":
            overall_status = "FAIL"
            break

    out_dir.mkdir(parents=True, exist_ok=True)

    metrics_path = out_dir / "static_metrics.csv"
    metrics_row = {
        "samples": len(rows),
        "duration_s": round(duration_s, 3),
        "warmup_s": round(warmup_s, 3),
        "reference_mode": reference_mode,
        "ref_x": round(ref_x, 6),
        "ref_y": round(ref_y, 6),
        "ref_z": round(ref_z, 6),
        "rms_3d_m": round(rms_3d_m, 6),
        "rms_xy_m": round(rms_xy_m, 6),
        "p95_3d_m": round(p95_3d_m, 6),
        "std_x_m": round(std_x_m, 6),
        "std_y_m": round(std_y_m, 6),
        "std_z_m": round(std_z_m, 6),
        "overall_status": overall_status,
    }

    with metrics_path.open("w", encoding="utf-8", newline="") as fp:
        writer = csv.DictWriter(fp, fieldnames=STATIC_FIELDS)
        writer.writeheader()
        writer.writerow(metrics_row)

    report_path = out_dir / "static_report.md"
    now = dt.datetime.now().isoformat(timespec="seconds")
    with report_path.open("w", encoding="utf-8") as fp:
        fp.write("# UWB Static Tag Verification Report\n\n")
        fp.write(f"Generated: {now}\n\n")
        fp.write(f"Pose CSV: `{pose_csv}`\n\n")
        fp.write(f"Overall status: **{overall_status}**\n\n")

        fp.write("## Metrics\n\n")
        fp.write("| Metric | Value |\n")
        fp.write("|---|---:|\n")
        fp.write(f"| Samples | {len(rows)} |\n")
        fp.write(f"| Duration (s) | {duration_s:.3f} |\n")
        fp.write(f"| Warmup removed (s) | {warmup_s:.3f} |\n")
        fp.write(f"| 3D RMS (cm) | {rms_3d_m * 100.0:.3f} |\n")
        fp.write(f"| XY RMS (cm) | {rms_xy_m * 100.0:.3f} |\n")
        fp.write(f"| 95th percentile 3D error (cm) | {p95_3d_m * 100.0:.3f} |\n")
        fp.write(f"| Std X (cm) | {std_x_m * 100.0:.3f} |\n")
        fp.write(f"| Std Y (cm) | {std_y_m * 100.0:.3f} |\n")
        fp.write(f"| Std Z (cm) | {std_z_m * 100.0:.3f} |\n")

        fp.write("\n## Check Results\n\n")
        fp.write("| Check | Metric | Rule | Status |\n")
        fp.write("|---|---:|---|---|\n")
        for check in checks:
            metric_text = "" if check.metric is None else f"{check.metric:.6f}"
            rule_text = "not configured" if check.threshold is None else f"{check.op} {check.threshold}"
            fp.write(f"| {check.name} | {metric_text} | {rule_text} | {check.status} |\n")

    summary = {
        "mode": "static",
        "pose_csv": str(pose_csv),
        "generated_at": now,
        "overall_status": overall_status,
        "metrics_csv": str(metrics_path),
        "report_md": str(report_path),
        "metrics": metrics_row,
    }

    summary_path = out_dir / "static_summary.json"
    with summary_path.open("w", encoding="utf-8") as fp:
        json.dump(summary, fp, indent=2)

    print(f"Static metrics: {metrics_path}")
    print(f"Static report: {report_path}")
    print(f"Static summary: {summary_path}")

    return summary


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="mode", required=True)

    sync = sub.add_parser("sync", help="Analyze sync/dropout capture run")
    sync.add_argument("--run-dir", required=True, type=pathlib.Path)
    sync.add_argument(
        "--thresholds",
        type=pathlib.Path,
        default=None,
        help="YAML thresholds file",
    )

    static = sub.add_parser("static", help="Analyze static-tag pose logs")
    static.add_argument("--pose-csv", required=True, type=pathlib.Path)
    static.add_argument(
        "--out-dir",
        type=pathlib.Path,
        default=None,
        help="Directory for output artifacts (default: <pose dir>/reports)",
    )
    static.add_argument(
        "--thresholds",
        type=pathlib.Path,
        default=None,
        help="YAML thresholds file",
    )
    static.add_argument("--truth-x", type=float, default=None)
    static.add_argument("--truth-y", type=float, default=None)
    static.add_argument("--truth-z", type=float, default=None)
    static.add_argument(
        "--warmup-s",
        type=float,
        default=None,
        help="Override warmup duration before metric computation",
    )

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    thresholds = load_yaml(args.thresholds)

    if args.mode == "sync":
        analyze_sync(args.run_dir, thresholds)
        return 0

    if args.mode == "static":
        pose_csv: pathlib.Path = args.pose_csv
        out_dir = args.out_dir or (pose_csv.parent / "reports")

        truth = None
        provided_truth = [args.truth_x, args.truth_y, args.truth_z]
        if any(v is not None for v in provided_truth):
            if not all(v is not None for v in provided_truth):
                raise SystemExit("Provide all of --truth-x --truth-y --truth-z or none")
            truth = (args.truth_x, args.truth_y, args.truth_z)

        analyze_static(
            pose_csv=pose_csv,
            out_dir=out_dir,
            thresholds=thresholds,
            truth=truth,
            warmup_override_s=args.warmup_s,
        )
        return 0

    raise SystemExit(f"Unsupported mode: {args.mode}")


if __name__ == "__main__":
    raise SystemExit(main())
