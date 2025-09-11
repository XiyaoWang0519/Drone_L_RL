#!/usr/bin/env bash
set -euo pipefail

# macOS Zephyr environment bootstrap (Apple Silicon)
# - Installs Zephyr project, Python venv, west, deps, and Zephyr SDK
# - Targets: Zephyr SDK v0.17.4 (macOS aarch64)

ZEPHYR_SDK_VERSION="0.17.4"
ZEPHYR_SDK_TARBALL="zephyr-sdk-${ZEPHYR_SDK_VERSION}_macos-aarch64.tar.xz"
ZEPHYR_SDK_URL="https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v${ZEPHYR_SDK_VERSION}/${ZEPHYR_SDK_TARBALL}"
ZEPHYR_SDK_DIR="$HOME/zephyr-sdk-${ZEPHYR_SDK_VERSION}"

ZEPHYR_PROJECT_DIR="$HOME/zephyrproject"
VENV_DIR="$HOME/.venvs/zephyr"

echo "[1/9] Checking OS and architecture..."
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This script is intended for macOS." >&2
  exit 1
fi
if [[ "$(uname -m)" != "arm64" ]]; then
  echo "This script targets Apple Silicon (arm64)." >&2
  exit 1
fi

echo "[2/9] Ensuring prerequisites (Homebrew, Python3, CMake, Ninja, DTC, etc.)..."
if command -v brew >/dev/null 2>&1; then
  # Avoid full brew update to keep it fast; install only if missing
  for pkg in cmake ninja gperf ccache dfu-util dtc wget python@3; do
    if ! brew list --formula | grep -q "^${pkg}$"; then
      brew install "$pkg"
    fi
  done
else
  echo "Homebrew not found. Ensure the following are installed and on PATH: cmake, ninja, gperf, ccache, dtc, wget, python3" >&2
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required but not found." >&2
  exit 1
fi

echo "[3/9] Creating Python virtual environment at ${VENV_DIR}..."
mkdir -p "$(dirname "$VENV_DIR")"
if [[ ! -d "$VENV_DIR" ]]; then
  python3 -m venv "$VENV_DIR"
fi
source "$VENV_DIR/bin/activate"
python -m pip install --upgrade pip

echo "[4/9] Installing west and Python deps..."
python -m pip install --upgrade west

mkdir -p "$ZEPHYR_PROJECT_DIR"
cd "$ZEPHYR_PROJECT_DIR"
if [[ ! -d "$ZEPHYR_PROJECT_DIR/zephyr" ]]; then
  echo "Initializing Zephyr project (main branch)..."
  west init -m https://github.com/zephyrproject-rtos/zephyr.git --mr main "$ZEPHYR_PROJECT_DIR"
fi
west update
west zephyr-export

if [[ -f "$ZEPHYR_PROJECT_DIR/zephyr/scripts/requirements.txt" ]]; then
  python -m pip install -r "$ZEPHYR_PROJECT_DIR/zephyr/scripts/requirements.txt"
fi
# Runner and utility deps used in this repo
python -m pip install pylink-square intelhex pyserial pyelftools

echo "[5/9] Downloading Zephyr SDK ${ZEPHYR_SDK_VERSION} if needed..."
cd "$HOME"
if [[ ! -d "$ZEPHYR_SDK_DIR" ]]; then
  if [[ ! -f "$ZEPHYR_SDK_TARBALL" ]]; then
    curl -L --fail --retry 3 -o "$ZEPHYR_SDK_TARBALL" "$ZEPHYR_SDK_URL"
  fi
  echo "Extracting SDK (this may take a moment)..."
  tar -xvf "$ZEPHYR_SDK_TARBALL"
fi

echo "[6/9] Running Zephyr SDK setup..."
cd "$ZEPHYR_SDK_DIR"
# Attempt non-interactive setup with toolchain selection; fall back gracefully
if [[ -x ./setup.sh ]]; then
  ./setup.sh -c -t arm-zephyr-eabi || ./setup.sh -c || ./setup.sh
fi

echo "[7/9] Verifying J-Link availability (optional for flashing)..."
if ! command -v JLinkExe >/dev/null 2>&1; then
  echo "Warning: SEGGER J-Link not found (JLinkExe). Install from https://www.segger.com/downloads/jlink/ to use 'west flash -r jlink'." >&2
fi

echo "[8/9] Creating repo-local env activator reference..."
ACTIVATOR="/Users/xiyaowang/Documents/Projects/ECE496/Drone_L_RL/scripts/activate_zephyr_env.sh"
if [[ -f "$ACTIVATOR" ]]; then
  echo "Activator script present at $ACTIVATOR"
else
  echo "Note: activator script not found at $ACTIVATOR (it will be added by the repo)." >&2
fi

echo "[9/9] Done. Next steps:"
cat <<EOF

To start a build session for this repo:
  1) source $ACTIVATOR
  2) cd ~/zephyrproject
  3) west build -b nrf52833dk/nrf52833 /Users/xiyaowang/Documents/Projects/ECE496/Drone_L_RL/firmware/boards/dwm3001cdk/dev_firmware/led_bringup -d build/led_bringup -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"
  4) west flash -r jlink -d build/led_bringup

You can add 'source $ACTIVATOR' to your shell profile for convenience.
EOF

echo "Bootstrap complete."


