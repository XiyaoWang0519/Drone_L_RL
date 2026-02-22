#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEEP=0

if [[ "${1:-}" == "--deep" ]]; then
  DEEP=1
elif [[ "${1:-}" != "" ]]; then
  echo "Usage: scripts/clean_project.sh [--deep]" >&2
  exit 1
fi

cd "$ROOT_DIR"

echo "Cleaning local generated artifacts (safe mode)..."

find . -type f -name '.DS_Store' -delete
find . -type d -name '__pycache__' -prune -exec rm -rf {} +

rm -rf TDoA_Engine/ui/.vite
rm -rf TDoA_Engine/ui/dist

if [[ "$DEEP" -eq 1 ]]; then
  echo "Deep cleanup enabled. Removing build/runtime dependencies and outputs..."
  rm -rf build
  rm -rf logs
  rm -rf tmp
  rm -rf TDoA_Engine/ui/node_modules
fi

echo "Cleanup complete."
