# Drone_L_RL

Indoor UWB localization and drone-control research workspace combining:
- Zephyr firmware for DWM3001CDK/nRF52833 anchors and tag-side experiments
- A Python TDoA engine (REST + WebSocket)
- A React UI and simulator loop for offline/bench development

## What Lives Here

- `firmware/`: Zephyr firmware apps and board-specific assets for DWM3001CDK
- `TDoA_Engine/`: Localization engine, simulator tooling, and UI
- `docs/`: Plans, reports, verification workflow docs, and vendor references
- `config/`: Host-side YAML configuration templates (ports/thresholds)
- `scripts/`: Setup, flashing, verification capture, and cleanup scripts

## Quick Start

### 1. Zephyr environment (macOS)

```bash
scripts/setup_zephyr_macos.sh
source scripts/activate_zephyr_env.sh
```

### 2. Firmware bring-up (LED sample)

```bash
west build -b nrf52833dk/nrf52833 \
  firmware/boards/dwm3001cdk/dev_firmware/led_bringup \
  -d build/led_bringup -p always \
  -- -DPython3_EXECUTABLE="$WEST_PYTHON"

west flash -r jlink -d build/led_bringup
```

### 3. Engine + simulator + UI loop

```bash
# terminal 1
uvicorn TDoA_Engine.engine.service.http_api:app --host 127.0.0.1 --port 8000

# terminal 2
python TDoA_Engine/tools/sim/sim_uwb.py --cfg TDoA_Engine/tools/sim/example_circle.yaml

# terminal 3
cd TDoA_Engine/ui && npm run dev
```

## Core Workflows

### Firmware app build pattern

```bash
west build -b nrf52833dk/nrf52833 <app_path> -d <build_dir> -p always \
  -- -DPython3_EXECUTABLE="$WEST_PYTHON"
west flash -r jlink -d <build_dir>
```

### UWB verification capture + analysis

```bash
python scripts/uwb_verify_capture.py \
  --ports-config config/uwb_verify_ports.yaml \
  --duration-s 300 \
  --label r1_sync

python scripts/uwb_verify_analyze.py sync \
  --run-dir logs/uwb_verify/<timestamp>_r1_sync \
  --thresholds config/uwb_verify_thresholds.yaml
```

See `docs/uwb_verification_workflow.md` for full details and caveats.

## Testing

- Engine unit tests:

```bash
python -m unittest discover TDoA_Engine/engine/tests
```

- UI build/type-check:

```bash
cd TDoA_Engine/ui && npm run build
```

- Firmware validation is sample-driven (build + flash + serial logs); Twister can be introduced for structured firmware suites.

## Documentation Map

- Project docs index: `docs/README.md`
- Firmware area guide: `firmware/README.md`
- Firmware sample catalog: `firmware/boards/dwm3001cdk/dev_firmware/README.md`
- Engine/sim/UI guide: `TDoA_Engine/README.md`
- Engine internals: `TDoA_Engine/engine/README.md`
- Host config reference: `config/README.md`
- Script reference: `scripts/README.md`

## Cleanup

- Quick cleanup of generated local artifacts:

```bash
scripts/clean_project.sh
```

- Deeper cleanup (also removes `build/`, root `logs/`, `tmp/`, UI `node_modules`):

```bash
scripts/clean_project.sh --deep
```

## Security and Local State

- Copy `.env.example` to `.env` for local overrides.
- Do not commit secrets, serial-port machine mappings, or private logs.
- Treat `TDoA_Engine/engine/logs/`, root `logs/`, `build/`, and `tmp/` as local artifacts unless explicitly requested otherwise.
