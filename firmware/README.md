# Firmware

Embedded code and board assets for DWM3001CDK (nRF52833 + DW3000 UWB) using Zephyr RTOS. Board-specific bring-up samples live under `boards/dwm3001cdk/dev_firmware/`.

## Layout
- `boards/dwm3001cdk/dev_firmware/`
  - `led_bringup/`: Blink LED via overlay alias `led0`
  - `usb_hello/`: USB CDC-ACM “hello” over serial
  - `uwb_chipid/`: Read DW3000 chip ID, basic SPI bring-up
  - `twr_initiator/` and `twr_responder/`: Two-way ranging pair (WIP)
- `src/`, `include/`, `tests/`: Shared modules and test scaffolding (placeholders)

## Prerequisites
- Zephyr SDK, Python 3.10+, and `west` available
- J-Link tools for flashing via the on-board debug interface

## Build & Flash (example: LED bring-up)
- Initialize env once: `export WEST_PYTHON=$(which python)`
- Build: `west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/led_bringup -d build/led_bringup -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"`
- Flash: `west flash -r jlink -d build/led_bringup`

Use the same pattern for other samples by substituting the app path and build dir.

## Coding Style
- 4-space indent, 100-char lines, K&R braces
- Filenames `snake_case.c/.h`; macros `UPPER_SNAKE_CASE`; functions `lower_snake_case`
- Zephyr app layout: `CMakeLists.txt`, `prj.conf`, optional `app.overlay`, sources in `src/`

## Testing
- Prefer small Zephyr sample apps (build + flash) with clear `printk` logs
- If adding Zephyr tests, integrate with Twister (`west twister`) in a follow-up PR

## Notes
- DeviceTree overlays should be minimal and document pin mappings (see `led_bringup/app.overlay`)
