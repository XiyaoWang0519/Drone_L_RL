# DWM3001CDK UWB Chip ID (Zephyr)

Reads the DW3000 device ID over SPI and prints it to the console to validate wiring and basic driver bring-up.

## Prerequisites
- Zephyr SDK, `west`, Python ≥ 3.10
- SEGGER J-Link tools (for flashing)
- Export once per shell: `export WEST_PYTHON=$(which python)`

## Build & Flash
- Build: `west build -b nrf52833dk/nrf52833 /Users/xiyaowang/Documents/Projects/ECE496/Drone_L_RL/firmware/boards/dwm3001cdk/dev_firmware/uwb_chipid -d build/uwb_chipid -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"`
- Flash: `west flash -r jlink -d build/uwb_chipid`

## Verify
- Connect to the USB CDC console (J20) at 115200 8N1.
- Expected output includes the detected DW3xxx ID, for example:
  `DW3000 CHIP ID: 0xDECA0130`

## Notes
- `app.overlay` wires DW3110 on SPIM3 with pins:
  - SCK P0.03, MOSI P0.08, MISO P0.29
  - CS P1.06, IRQ P1.02, RSTn P0.25
- If probe fails:
  - Confirm overlay was applied (build log shows `Found devicetree overlay`).
  - Check cabling/solder joints on the module headers.
  - Lower `spi-max-frequency` in the overlay.
