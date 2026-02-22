# Config Directory Guide

This folder stores host-side configuration files used by verification tooling and (optionally) environment-specific app configs.

## Files

- `uwb_verify_ports.example.yaml`
- `uwb_verify_ports.live.yaml`
- `uwb_verify_thresholds.example.yaml`

Subfolders (`development/`, `testing/`, `production/`) are reserved for future environment-specific config sets.

## UWB Verification Port Config

`uwb_verify_ports*.yaml` is consumed by `scripts/uwb_verify_capture.py`.

### Schema

```yaml
anchors:
  - name: master_a1
    role: master        # master | slave
    port: /dev/cu.usbmodem2101
    baud: 115200        # optional, default 115200
    expected_anchor_id: 1  # optional int
```

### Field Notes

- `name`: Human-readable source label. Also used in output filenames.
- `role`: Must be `master` or `slave`.
- `port`: Serial device path for that board.
- `baud`: Serial baud rate (default `115200`).
- `expected_anchor_id`: Optional numeric check metadata for reports/workflows.

### Recommended Usage

1. Copy the template:

```bash
cp config/uwb_verify_ports.example.yaml config/uwb_verify_ports.yaml
```

2. Edit serial ports for the current machine.
3. Keep `uwb_verify_ports.yaml` local (machine-specific).

## UWB Verification Threshold Config

`uwb_verify_thresholds.example.yaml` is used by `scripts/uwb_verify_analyze.py`.

### Sections

- `sync`: Thresholds for sync/dropout verification
- `static`: Thresholds for static-tag accuracy verification

### Current Keys

- `sync.min_duration_s`
- `sync.max_sync_err_rms_ns`
- `sync.max_sync_err_jitter_ns`
- `sync.max_rx_error_rate_hz`
- `sync.max_consecutive_missed_sync`
- `sync.alignment_window_ms`
- `sync.schedule_alignment_ratio_min`
- `static.min_duration_s`
- `static.warmup_s`
- `static.max_3d_rms_cm`
- `static.max_xy_rms_cm`
- `static.max_p95_cm`

Unset keys are treated as not configured for pass/fail checks.

## Security and Hygiene

- Keep machine-specific serial mappings private.
- Do not store credentials in this directory.
- Treat generated runtime logs and reports as local artifacts unless explicitly needed in version control.
