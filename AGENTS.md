# Repository Guidelines

## Project Structure & Module Organization
- `firmware/`: Zephyr RTOS apps and board assets for DWM3001CDK; samples live under `firmware/boards/dwm3001cdk/dev_firmware/`.
- `TDoA_Engine/`: Python localization engine (`engine/`), simulator tools (`tools/sim/`), and React UI (`ui/`).
- `docs/`: design notes, reports, and vendor PDFs.
- `config/`: environment-specific configuration files.
- `scripts/`: helper scripts for Zephyr setup and flashing.

## Build, Test, and Development Commands
- Zephyr environment: `scripts/setup_zephyr_macos.sh` (one-time) and `scripts/activate_zephyr_env.sh` (per-shell).
- Firmware build example: `west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/led_bringup -d build/led_bringup -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"`.
- Firmware flash example: `west flash -r jlink -d build/led_bringup`.
- Engine service: `uvicorn TDoA_Engine.engine.service.http_api:app --host 127.0.0.1 --port 8000`.
- Simulator: `python TDoA_Engine/tools/sim/sim_uwb.py --cfg TDoA_Engine/tools/sim/example_circle.yaml`.
- UI dev server: `cd TDoA_Engine/ui && npm run dev`; build/typecheck: `npm run build`.

## Coding Style & Naming Conventions
- C/CMake (Zephyr): 4-space indent, 100-char lines, K&R braces; filenames `snake_case.c/.h`, macros `UPPER_SNAKE_CASE`, functions `lower_snake_case`.
- Python: 4-space indent, `snake_case` symbols, constants in `UPPER_SNAKE_CASE` (see `TDoA_Engine/engine/config.py`).
- TypeScript/React: 2-space indent; components in `PascalCase` under `TDoA_Engine/ui/src/components/`.
- No enforced formatter/linter; keep existing style consistent with neighboring files.

## Testing Guidelines
- Python unit tests live in `TDoA_Engine/engine/tests/` and follow `test_*.py` naming.
- Run engine tests: `python -m unittest discover TDoA_Engine/engine/tests`.
- Firmware testing is currently sample-driven; consider Zephyr Twister (`west twister`) when adding structured tests.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat:`, `fix:`, `docs:`) with subject lines ≤ 72 characters.
- PRs should include a short summary, affected paths, and evidence of validation (console logs or flash output). Note hardware assumptions (board, pins, runners).

## Security & Configuration Tips
- Never commit secrets; use `.env` based on `.env.example` and keep local overrides private.
- Engine logs and calibration files live under `TDoA_Engine/engine/logs/`; treat them as local artifacts unless explicitly needed.
