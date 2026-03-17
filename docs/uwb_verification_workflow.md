# UWB Verification Workflow (5+ Minute Runs)

This workflow turns anchor serial logs into reproducible PASS/FAIL evidence for sync/dropout and static-tag tests.

## 1. Build and Flash Verify Firmware

### Master verify firmware
```bash
west build -b nrf52833dk/nrf52833 \
  firmware/boards/dwm3001cdk/dev_firmware/gps_beacon_master_verify \
  -d build/gps_beacon_master_verify -p always \
  -- -DPython3_EXECUTABLE="$WEST_PYTHON"

west flash -r jlink -d build/gps_beacon_master_verify
```

### Slave verify firmware
```bash
west build -b nrf52833dk/nrf52833 \
  firmware/boards/dwm3001cdk/dev_firmware/gps_beacon_slave_verify \
  -d build/gps_beacon_slave_verify -p always \
  -- -DPython3_EXECUTABLE="$WEST_PYTHON"

west flash -r jlink -d build/gps_beacon_slave_verify
```

Configure each board identity in `prj.conf` before build if needed:
- `CONFIG_UWB_BEACON_ID`
- `CONFIG_UWB_BEACON_SLOT_ID`

## 2. Prepare Host Configs

Copy and edit examples:
```bash
cp config/uwb_verify_ports.example.yaml config/uwb_verify_ports.yaml
cp config/uwb_verify_thresholds.example.yaml config/uwb_verify_thresholds.yaml
```

Set all connected anchors in `config/uwb_verify_ports.yaml`.

## 3. Run 5-Minute Sync/Dropout Capture

Connect master + all slave anchors to the laptop, then run:
```bash
python scripts/uwb_verify_capture.py \
  --ports-config config/uwb_verify_ports.yaml \
  --duration-s 300 \
  --label r1a_sync_baseline
```

Output folder is created under `logs/uwb_verify/<timestamp>_r1a_sync_baseline/`.

## 4. Analyze Sync/Dropout Verification

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
- `blink_alignment_ratio` measures how often RX errors happen close to this anchor's own `BLINK_TX` times.
- `suspected_schedule_guard_issue=1` means alignment ratio exceeded threshold, indicating likely scheduling/guard-time pressure instead of pure RF coverage.

## 6. Static Tag Test

If you have engine pose logs (`*_poses.csv`):
```bash
python scripts/uwb_verify_analyze.py static \
  --pose-csv TDoA_Engine/engine/logs/<run>_poses.csv \
  --thresholds config/uwb_verify_thresholds.yaml \
  --out-dir logs/uwb_verify/static_<run>
```

Optional known truth point:
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

## 7. Machine-Parseable Firmware Events

Verify firmware prints structured lines prefixed with `VER`.
Examples:
- `event=SYNC_TX`
- `event=SYNC_RX`
- `event=SYNC_ERR`
- `event=BLINK_TX`
- `event=RX_ERROR`
- `event=RX_TIMEOUT`
- `event=MISSED_SYNC`
- `event=SUMMARY`

The capture tool parses these lines only; other console output is still saved in raw logs.
