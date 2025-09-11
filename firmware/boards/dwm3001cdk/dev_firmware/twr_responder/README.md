# DWM3001CDK TWR Responder (Zephyr)

Responder side of a simple Two-Way Ranging (TWR) demo using DW3000 on DWM3001CDK.

## Prerequisites
- Zephyr SDK, `west`, Python ≥ 3.10
- SEGGER J-Link tools (for flashing)
- Export once per shell: `export WEST_PYTHON=$(which python)`

## Build & Flash
- Build: `west build -b nrf52833dk/nrf52833 /Users/xiyaowang/Documents/Projects/ECE496/Drone_L_RL/firmware/boards/dwm3001cdk/dev_firmware/twr_responder -d build/twr_responder -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"`
- Flash: `west flash -r jlink -d build/twr_responder`

## Run
- Pair with an initiator flashed on a second board (see `../twr_initiator/`).
- Open the USB CDC console at 115200 8N1 to observe logs. The app now waits for the host to open the port (DTR) before printing the banner, so you won't miss early output.
- If the port drops on reset (re-enumeration), use an auto-reconnect wrapper to reopen quickly:
  - macOS: `while true; do python -m serial.tools.miniterm /dev/tty.usbmodem* 115200; echo 'reconnect in 1s'; sleep 1; done`
  - Linux: `while true; do picocom -b 115200 /dev/ttyACM0; echo 'reconnect in 1s'; sleep 1; done`

## Notes
- USB CDC is configured as the console (`CDC_ACM_0`).
- For bring-up issues, validate `uwb_chipid` first to confirm SPI/IRQ/RESET wiring.
