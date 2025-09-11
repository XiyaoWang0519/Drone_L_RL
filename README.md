# Drone_L_RL

Indoor UWB localization + RL-driven obstacle avoidance on a sub-250 g quadrotor. Firmware targets Nordic/DWM3001CDK (DW3000 UWB) with Zephyr RTOS; planning and design notes live under `docs/`.

## Project Structure
- `firmware/`: Embedded code and board assets
  - `boards/dwm3001cdk/dev_firmware/`: Board samples (LED, USB, UWB, TWR)
  - `src/`, `include/`, `tests/`: Placeholders for shared modules
- `docs/`: Design notes, plans, vendor PDFs
- `config/`: Environment-specific configs
- `.env.example`: Template for local configuration

## Prerequisites
- Zephyr SDK installed and `west` available
- Python 3.10+
- SEGGER J-Link tools for flashing (macOS supported)

See `firmware/boards/dwm3001cdk/dev_firmware/led_bringup/README.md` for full Zephyr setup if you’re new to Zephyr.

## Quick Start (LED Bring-up)
- Initialize environment once: `export WEST_PYTHON=$(which python)`
- Build: `west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/led_bringup -d build/led_bringup -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"`
- Flash via J-Link: `west flash -r jlink -d build/led_bringup`

## Local Environment
- Copy and edit: `cp .env.example .env`
- Adjust ports, flags, and paths for your setup

## Coding Style
- C/CMake (Zephyr): 4-space indent, 100-char line limit, K&R braces
- Filenames `snake_case.c/.h`; macros `UPPER_SNAKE_CASE`; functions `lower_snake_case`
- App layout: `CMakeLists.txt`, `prj.conf`, optional `app.overlay`, sources in `src/`
- DeviceTree overlays: keep minimal, comment pin mappings (see LED sample `app.overlay`)

## Testing
- Prefer small Zephyr sample apps under `firmware/boards/.../dev_firmware/`
- Place unit/HLT scaffolding in `firmware/tests/`
- If adding Zephyr tests, integrate with Twister (`west twister`) in a follow-up PR

## Commits & PRs
- Conventional Commits (e.g., `feat:`, `docs:`, `chore:`); subject ≤ 72 chars
- PRs: summary, affected paths, logs/clip of test/flash, hardware assumptions (board, pins, runners)

## Security & Config
- Never commit secrets; `.env` is ignored
- Large vendor SDK blobs are ignored via `.gitignore`
- Prefer reproducible scripts and document exact commands used

## Links
- Design plan: `docs/indoor_drone_final_project_plan.md`
- Firmware overview: `firmware/README.md`
