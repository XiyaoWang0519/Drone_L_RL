# Firmware Directory

This directory contains the embedded firmware for the drone's flight control and sensor systems.

## Structure

- `src/` - Source code files
- `include/` - Header files and libraries
- `tests/` - Unit tests for firmware components
- `boards/` - Board-specific configurations
  - `stm32/` - STM32 microcontroller code
  - `esp32/` - ESP32 wireless communication code

## Development Environment

- **Framework**: Zephyr RTOS / Arduino Framework
- **Toolchain**: ARM GCC / Espressif IDF
- **Target Boards**: STM32F4 series, ESP32-S3

## Build Instructions

See project root documentation for Docker-based build instructions.

## Safety Notes

- Always test firmware changes in simulation first
- Follow emergency shutdown procedures during testing
- Verify RF compliance for wireless components