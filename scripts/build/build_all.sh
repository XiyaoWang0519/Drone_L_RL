#!/bin/bash

# Build script for the entire drone project
# Usage: ./scripts/build/build_all.sh [--clean] [--release]

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
CLEAN=false
BUILD_TYPE="Debug"
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --clean)
            CLEAN=true
            shift
            ;;
        --release)
            BUILD_TYPE="Release"
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--clean] [--release]"
            echo "  --clean    Clean build directories before building"
            echo "  --release  Build in Release mode (default: Debug)"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo -e "${GREEN}🚁 Drone Project Build Script${NC}"
echo "Workspace: $WORKSPACE_DIR"
echo "Build Type: $BUILD_TYPE"
echo "Clean Build: $CLEAN"
echo

# Function to print status
print_status() {
    echo -e "${YELLOW}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Change to workspace directory
cd "$WORKSPACE_DIR"

# Clean if requested
if [ "$CLEAN" = true ]; then
    print_status "Cleaning build directories..."
    rm -rf ros2_ws/build ros2_ws/install ros2_ws/log
    rm -rf firmware/build
    rm -rf docs/_build
    print_success "Clean completed"
fi

# Setup ROS2 environment
print_status "Setting up ROS2 environment..."
if [ -f "/opt/ros/humble/setup.bash" ]; then
    source /opt/ros/humble/setup.bash
    print_success "ROS2 Humble environment loaded"
else
    print_error "ROS2 Humble not found. Please install ROS2 Humble."
    exit 1
fi

# Build ROS2 workspace
print_status "Building ROS2 workspace..."
cd ros2_ws

# Install dependencies
print_status "Installing ROS2 dependencies..."
rosdep update || true
rosdep install --from-paths src --ignore-src -r -y || true

# Build packages
print_status "Building ROS2 packages..."
if [ "$BUILD_TYPE" = "Release" ]; then
    colcon build --cmake-args -DCMAKE_BUILD_TYPE=Release
else
    colcon build --cmake-args -DCMAKE_BUILD_TYPE=Debug
fi

if [ $? -eq 0 ]; then
    print_success "ROS2 build completed successfully"
else
    print_error "ROS2 build failed"
    exit 1
fi

# Source the built workspace
source install/setup.bash

# Return to workspace root
cd "$WORKSPACE_DIR"

# Build firmware (placeholder)
print_status "Building firmware..."
mkdir -p firmware/build

# STM32 firmware build (placeholder)
print_status "Building STM32 firmware..."
cd firmware
mkdir -p build/stm32
echo "// STM32 firmware placeholder" > build/stm32/main.c
touch build/stm32/firmware.bin
print_success "STM32 firmware build completed (placeholder)"

# ESP32 firmware build (placeholder)
print_status "Building ESP32 firmware..."
mkdir -p build/esp32
echo "// ESP32 firmware placeholder" > build/esp32/main.cpp
touch build/esp32/firmware.bin
print_success "ESP32 firmware build completed (placeholder)"

cd "$WORKSPACE_DIR"

# Run tests
print_status "Running tests..."
cd ros2_ws
colcon test || true
colcon test-result --verbose || true

cd "$WORKSPACE_DIR"

# Build documentation (placeholder)
print_status "Building documentation..."
mkdir -p docs/_build
echo "<h1>Drone Project Documentation</h1>" > docs/_build/index.html
print_success "Documentation build completed (placeholder)"

print_success "🎉 Build process completed successfully!"
echo
echo "Next steps:"
echo "  • Run tests: ./scripts/build/run_tests.sh"
echo "  • Start simulation: docker-compose up simulation"
echo "  • View documentation: open docs/_build/index.html"