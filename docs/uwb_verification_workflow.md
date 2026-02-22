# UWB Verification Workflow (5+ Minute Runs)

This workflow converts multi-anchor serial logs into reproducible PASS/FAIL evidence for:
- sync/dropout behavior
- static-tag localization stability

## Important Prerequisite: Structured Firmware Logs

`scripts/uwb_verify_capture.py` parses only lines that start with `VER ` and contain key-value tokens (for example `event=SYNC_RX seq=...`).

If your current firmware prints human-readable logs only (for example `SLAVE: ...`), the parser will still save raw logs but parsed metrics will be empty. In that case, use or add a verification logging mode that emits `VER` events.

## 1. Build and Flash Firmware

Use your verification-capable firmware targets. If you are using the current app set in this repo, start from `gps_beacon_master` and `gps_beacon_slave` and ensure they emit `VER` lines.

### Master example

```bash
west build -b nrf52833dk/nrf52833 \
  firmware/boards/dwm3001cdk/dev_firmware/gps_beacon_master \
  -d build/gps_beacon_master_verify -p always \
  -- -DPython3_EXECUTABLE="$WEST_PYTHON"

west flash -r jlink -d build/gps_beacon_master_verify
```

### Slave example

```bash
west build -b nrf52833dk/nrf52833 \
  firmware/boards/dwm3001cdk/dev_firmware/gps_beacon_slave \
  -d build/gps_beacon_slave_verify -p always \
  -- -DPython3_EXECUTABLE="$WEST_PYTHON"

west flash -r jlink -d build/gps_beacon_slave_verify
```

Configure board identity parameters in each app as needed (`prj.conf`/`Kconfig`), such as anchor ID and slot ID.

## 2. Prepare Host Config Files

```bash
cp config/uwb_verify_ports.example.yaml config/uwb_verify_ports.yaml
cp config/uwb_verify_thresholds.example.yaml config/uwb_verify_thresholds.yaml
```

Update `config/uwb_verify_ports.yaml` with connected serial ports and roles.

## 3. Run Sync/Dropout Capture (5 Minutes)

```bash
python scripts/uwb_verify_capture.py \
  --ports-config config/uwb_verify_ports.yaml \
  --duration-s 300 \
  --label r1a_sync_baseline
```

Expected output directory:
- `logs/uwb_verify/<timestamp>_r1a_sync_baseline/`

Contents:
- `raw/*.log`
- `parsed/*_events.csv`
- `run_manifest.json`
- `reports/` (created by analyzer)

## 4. Analyze Sync/Dropout Metrics

```bash
python scripts/uwb_verify_analyze.py sync \
  --run-dir logs/uwb_verify/<timestamp>_r1a_sync_baseline \
  --thresholds config/uwb_verify_thresholds.yaml
```

Generated artifacts:
- `reports/sync_metrics_per_anchor.csv`
- `reports/dropout_events.csv`
- `reports/verification_report.md`
- `reports/verification_summary.json`

## 5. Interpret Scheduling/Guard-Time Signal

In `sync_metrics_per_anchor.csv`:
- `blink_alignment_ratio`: fraction of RX errors occurring near that anchor's own `BLINK_TX` moments.
- `suspected_schedule_guard_issue=1`: alignment ratio exceeded threshold, suggesting schedule/guard-time pressure rather than pure RF coverage loss.

## 6. Static Tag Verification

When you have pose logs (`t,x,y,z` data):

```bash
python scripts/uwb_verify_analyze.py static \
  --pose-csv TDoA_Engine/engine/logs/<run>_poses.csv \
  --thresholds config/uwb_verify_thresholds.yaml \
  --out-dir logs/uwb_verify/static_<run>
```

Optional truth reference point:

```bash
python scripts/uwb_verify_analyze.py static \
  --pose-csv TDoA_Engine/engine/logs/<run>_poses.csv \
  --thresholds config/uwb_verify_thresholds.yaml \
  --truth-x 2.0 --truth-y 1.5 --truth-z 1.2
```

Outputs:
- `static_metrics.csv`
- `static_report.md`
- `static_summary.json`

## 7. Expected `VER` Events

The parser recognizes these event families when emitted as `VER` key-value lines:
- `SYNC_TX`
- `SYNC_RX`
- `SYNC_ERR`
- `BLINK_TX`
- `RX_ERROR`
- `RX_TIMEOUT`
- `MISSED_SYNC`
- `SUMMARY`

Non-`VER` lines are preserved in raw logs for manual debugging.
