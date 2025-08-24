cmake_minimum_required(VERSION 3.20.0)

# Zephyr application to blink a GPIO every 250ms
find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})
project(led_bringup)

target_sources(app PRIVATE src/main.c)

