# ============================================================================
# CMakeLists.txt for DWM3001CDK LED Bring-up Application
# ============================================================================
# This file configures the build system for a simple LED blinking demo.
# The application validates hardware connectivity by controlling an LED.

# Require CMake version 3.20.0 or higher (Zephyr minimum requirement)
cmake_minimum_required(VERSION 3.20.0)

# Locate the Zephyr build system and import its CMake functions/macros
# The HINTS path uses the ZEPHYR_BASE environment variable set by the SDK
find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})

# Define the project name - this will be the application name
project(led_bringup)

# Specify source files to compile into the application
# The 'app' target is provided by Zephyr and represents our application binary
# We only have one source file: src/main.c
target_sources(app PRIVATE src/main.c)

