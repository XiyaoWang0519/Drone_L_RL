#!/usr/bin/env bash
set -euo pipefail

ZEPHYR_VENV="${ZEPHYR_VENV:-$HOME/.venvs/zephyr}"
ZEPHYR_PROJECT="${ZEPHYR_PROJECT:-$HOME/zephyrproject}"

source "${ZEPHYR_VENV}/bin/activate"
export WEST_PYTHON="$(which python)"

cd "${ZEPHYR_PROJECT}"
west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/tof_responder \
  -d build/tof_responder -p always
west flash -r jlink -d build/tof_responder
