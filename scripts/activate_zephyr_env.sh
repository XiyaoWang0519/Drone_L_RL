#!/usr/bin/env bash
set -euo pipefail

# Activate Zephyr development environment for this repo on macOS.
# - Uses the shared venv at ~/.venvs/zephyr
# - Exports WEST_PYTHON for CMake integration as used in this repo
# - Exports Zephyr SDK variables

VENV_DIR="$HOME/.venvs/zephyr"

if [[ ! -d "$VENV_DIR" ]]; then
  echo "Virtualenv not found at $VENV_DIR. Run scripts/setup_zephyr_macos.sh first." >&2
  return 1 2>/dev/null || exit 1
fi

source "$VENV_DIR/bin/activate"

export WEST_PYTHON="$(which python)"
export ZEPHYR_TOOLCHAIN_VARIANT=zephyr

# Auto-detect the newest zephyr-sdk-* directory under $HOME if not explicitly set
if [[ -z "${ZEPHYR_SDK_INSTALL_DIR:-}" ]]; then
  # shellcheck disable=SC2012
  SDK_DIR=$(ls -d "$HOME"/zephyr-sdk-* 2>/dev/null | sort -V | tail -n 1 || true)
  if [[ -z "$SDK_DIR" ]]; then
    echo "Zephyr SDK not found (~/zephyr-sdk-*/). Install via scripts/setup_zephyr_macos.sh." >&2
    return 1 2>/dev/null || exit 1
  fi
  export ZEPHYR_SDK_INSTALL_DIR="$SDK_DIR"
fi

# Optional: ensure arm toolchain is present on PATH for convenience
if [[ -d "$ZEPHYR_SDK_INSTALL_DIR/arm-zephyr-eabi/bin" ]]; then
  case ":$PATH:" in
    *":$ZEPHYR_SDK_INSTALL_DIR/arm-zephyr-eabi/bin:"*) ;;
    *) export PATH="$ZEPHYR_SDK_INSTALL_DIR/arm-zephyr-eabi/bin:$PATH" ;;
  esac
fi

echo "Environment activated:"
echo "  VENV      : $VENV_DIR"
echo "  WEST_PY   : $WEST_PYTHON"
echo "  SDK DIR   : $ZEPHYR_SDK_INSTALL_DIR"
echo "  Toolchain : $(command -v arm-zephyr-eabi-gcc || echo 'not on PATH')"


