# Scripts Directory Guide

Operational scripts for environment setup, firmware flashing, verification capture/analysis, and workspace cleanup.

## Environment Setup

### `setup_zephyr_macos.sh`
Bootstraps a Zephyr development environment on Apple Silicon macOS.

What it does:
- Installs required Homebrew packages (if missing)
- Creates `~/.venvs/zephyr`
- Initializes/updates `~/zephyrproject`
- Installs Zephyr Python requirements and runner deps
- Downloads and sets up Zephyr SDK

Run:

```bash
scripts/setup_zephyr_macos.sh
```

### `activate_zephyr_env.sh`
Activates the shared Zephyr virtualenv and exports:
- `WEST_PYTHON`
- `ZEPHYR_TOOLCHAIN_VARIANT`
- `ZEPHYR_SDK_INSTALL_DIR`

Run per shell:

```bash
source scripts/activate_zephyr_env.sh
```

## Firmware Flash Helpers

### `flash_tof_initiator.sh`
Builds/flashes `tof_initiator` from `~/zephyrproject` workspace.

### `flash_tof_responder.sh`
Builds/flashes `tof_responder` from `~/zephyrproject` workspace.

Important:
- These helper scripts assume corresponding app paths exist under your Zephyr workspace.
- If your app names/locations differ, edit these scripts or use direct `west build/flash` commands.

## UWB Verification Tooling

### `uwb_verify_capture.py`
Captures serial logs from multiple anchors and writes parsed CSV events.

Main options:
- `--ports-config` (required): YAML config path
- `--duration-s`: capture duration (default `300`)
- `--out`: base output dir (default `logs/uwb_verify`)
- `--label`: run label suffix for output folder

Example:

```bash
python scripts/uwb_verify_capture.py \
  --ports-config config/uwb_verify_ports.yaml \
  --duration-s 300 \
  --label r1_sync
```

Output structure:
- `<run>/raw/*.log`
- `<run>/parsed/*_events.csv`
- `<run>/reports/`
- `<run>/run_manifest.json`

### `uwb_verify_analyze.py`
Analyzes verification runs in two modes.

#### Sync mode
Uses parsed event CSVs to compute sync/dropout metrics and pass/fail status.

```bash
python scripts/uwb_verify_analyze.py sync \
  --run-dir logs/uwb_verify/<run_name> \
  --thresholds config/uwb_verify_thresholds.yaml
```

#### Static mode
Analyzes static tag pose CSV (`t,x,y,z` columns expected).

```bash
python scripts/uwb_verify_analyze.py static \
  --pose-csv TDoA_Engine/engine/logs/<run>_poses.csv \
  --thresholds config/uwb_verify_thresholds.yaml \
  --out-dir logs/uwb_verify/static_<run>
```

Optional truth point:
- `--truth-x --truth-y --truth-z`

## Cleanup

### `clean_project.sh`
Removes generated local artifacts.

Default mode removes:
- `.DS_Store`
- `__pycache__`
- `TDoA_Engine/ui/.vite`
- `TDoA_Engine/ui/dist`

Deep mode additionally removes:
- `build/`
- `logs/`
- `tmp/`
- `TDoA_Engine/ui/node_modules`

Run:

```bash
scripts/clean_project.sh
scripts/clean_project.sh --deep
```

Use deep mode only when you intentionally want to reset local build/runtime state.
