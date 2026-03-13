# Firmware

Zephyr RTOS firmware for DWM3001CDK-oriented development (nRF52833 + DW3000 paths).

## Layout

- `boards/dwm3001cdk/dev_firmware/`
  - `led_bringup/`
  - `usb_hello/`
  - `uwb_chipid/`
  - `gps_beacon/`
  - `gps_beacon_master/`
  - `gps_beacon_slave/`
  - `drone_rx/`
- `include/`: shared headers
- `src/`: shared source scaffolding
- `tests/`: firmware test scaffolding

Sample-level details are documented in:
- `firmware/boards/dwm3001cdk/dev_firmware/README.md`

## Prerequisites

- Zephyr SDK + `west`
- Python 3.10+
- SEGGER J-Link tools for flashing

Recommended setup (macOS):

```bash
scripts/setup_zephyr_macos.sh
source scripts/activate_zephyr_env.sh
```

## Build and Flash Pattern

```bash
west build -b nrf52833dk/nrf52833 \
  firmware/boards/dwm3001cdk/dev_firmware/<app_name> \
  -d build/<app_name> -p always \
  -- -DPython3_EXECUTABLE="$WEST_PYTHON"

west flash -r jlink -d build/<app_name>
```

## Coding Style

- 4-space indentation
- 100-character line target
- K&R braces
- `snake_case.c/.h` files
- `UPPER_SNAKE_CASE` macros
- `lower_snake_case` functions

## Validation

Current validation is sample-driven:
- Build succeeds
- Flash succeeds
- Serial log behavior matches expected role/feature behavior

Twister-based structured firmware test suites can be added as the app set stabilizes.
