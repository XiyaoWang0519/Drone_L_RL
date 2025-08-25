# Repository Guidelines

## Project Structure & Module Organization
- `firmware/`: Embedded code and board assets. Subfolders: `boards/dwm3001cdk/dev_firmware/{led_bringup,usb_hello,uwb_chipid}`, plus placeholders `src/`, `include/`, `tests/`.
- `docs/`: Design notes, plans, and vendor PDFs.
- `config/`: Environment-specific configs (development/testing/production).
- `.env.example`: Copy to `.env` and adjust for your setup.

## Build, Test, and Development Commands
Prerequisites: Zephyr SDK, Python 3.10+, and `west` installed. See `firmware/boards/dwm3001cdk/dev_firmware/led_bringup/README.md` for detailed setup.

- Initialize environment once: `export WEST_PYTHON=$(which python)`
- Build LED example: `west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/led_bringup -d build/led_bringup -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"`
- Flash via J-Link: `west flash -r jlink -d build/led_bringup`
- Configure local env: `cp .env.example .env` then customize ports, flags, and paths.

## Coding Style & Naming Conventions
- C/CMake (Zephyr): 4‑space indent, 100‑char line limit, K&R braces. Filenames `snake_case.c/.h`; macros `UPPER_SNAKE_CASE`; functions `lower_snake_case`.
- Zephyr app layout: `CMakeLists.txt`, `prj.conf`, optional `app.overlay`, sources in `src/`.
- DeviceTree overlays: keep minimal, comment pin mappings; example: see `dev_firmware/led_bringup/app.overlay`.

## Testing Guidelines
- Location: `firmware/tests/` for unit/HLT scaffolding and per‑board samples under `dev_firmware/`.
- Conventions: test files `test_*.c` or board samples with clear assertions/`printk` logs.
- Running: prefer small Zephyr sample apps (build + flash). If adding Zephyr tests, integrate with Twister (`west twister`) in follow‑up PRs.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits used in history (e.g., `feat:`, `docs:`, `chore:`). Keep subject ≤ 72 chars; use imperative mood.
- PRs must include: purpose summary, affected paths (e.g., `firmware/boards/dwm3001cdk/...`), test/flash evidence (logs or short clip), and any hardware assumptions (board, pins, runners).
- Link issues and include before/after screenshots or serial logs for firmware changes.

## Security & Configuration Tips
- Never commit secrets. `.env` is ignored; use `.env.example` for new variables.
- Large vendor SDK blobs are ignored via `.gitignore`; keep board‑specific firmware under `dev_firmware/` and commit only source/config.
- When in doubt, prefer reproducible scripts and document exact commands used.

