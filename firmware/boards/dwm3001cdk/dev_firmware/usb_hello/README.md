# DWM3001CDK USB Hello (Zephyr)

Simple USB CDC-ACM console sample. Prints a greeting on the virtual serial port over USB (J20).

## Prerequisites
- Zephyr SDK, `west`, Python ≥ 3.10
- SEGGER J-Link tools (for flashing)
- Export once per shell: `export WEST_PYTHON=$(which python)`

## Build & Flash
- Build: `west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/usb_hello -d build/usb_hello -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"`
- Flash: `west flash -r jlink -d build/usb_hello`

## Verify
- Connect USB to J20; a CDC device appears (e.g., `/dev/tty.usbmodem*` on macOS).
- Open a serial terminal at 115200 8N1 (e.g., `screen /dev/tty.usbmodem* 115200`).
- You should see a periodic greeting or logs from `printk`.

## Notes
- `prj.conf` enables `CONFIG_USB_DEVICE_STACK` and `CONFIG_USB_CDC_ACM` so the console goes over USB.
- If no port appears, try a different cable/USB port, or power-cycle the board. Check `dmesg`/System Information for the CDC device.
