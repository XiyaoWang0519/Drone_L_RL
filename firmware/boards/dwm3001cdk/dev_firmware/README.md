# DWM3001CDK Dev Firmware Catalog

This folder holds board-focused Zephyr applications used for bring-up and UWB protocol development on DWM3001CDK/nRF52833 targets.

## Apps

- `led_bringup/`
  - Minimal LED alias validation (`led0`) to verify basic board config and flash flow.

- `usb_hello/`
  - USB CDC-ACM console hello app for host serial verification.

- `uwb_chipid/`
  - DW3000 SPI bring-up and chip-id read path.

- `gps_beacon/`
  - UWB beacon experiment with sync/blink scheduling behavior.

- `gps_beacon_master/`
  - Master-role beacon variant.

- `gps_beacon_slave/`
  - Slave-role beacon variant.

- `drone_rx/`
  - Receiver-side firmware path used for drone integration experiments.

## Common App Layout

Each app follows standard Zephyr structure:
- `CMakeLists.txt`
- `prj.conf`
- optional `app.overlay`
- optional `Kconfig`
- `src/main.c`

## Build Template

From repo root, after `source scripts/activate_zephyr_env.sh`:

```bash
west build -b nrf52833dk/nrf52833 \
  firmware/boards/dwm3001cdk/dev_firmware/<app_name> \
  -d build/<app_name> -p always \
  -- -DPython3_EXECUTABLE="$WEST_PYTHON"
```

Flash:

```bash
west flash -r jlink -d build/<app_name>
```

## App Selection Guidance

- Start with `led_bringup` when setting up a new board.
- Use `usb_hello` when USB serial behavior is the immediate blocker.
- Use `uwb_chipid` to isolate DW3000/SPI integration issues.
- Use `gps_beacon_*` and `drone_rx` for synchronization/ranging and integration iterations.

## Notes

- Keep role/identity constants (`Kconfig`, `prj.conf`) consistent with your deployment mapping.
- Keep DeviceTree overlays minimal and document non-default pin usage in comments.
