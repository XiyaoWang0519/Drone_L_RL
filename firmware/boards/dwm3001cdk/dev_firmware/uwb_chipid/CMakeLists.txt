cmake_minimum_required(VERSION 3.20.0)
find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})
project(uwb_chipid)

# App
target_sources(app PRIVATE src/main.c src/dw3000_port.c src/deca_probe_interface_zephyr.c src/deca_rsl_stub.c)

# Add local dts bindings directory so custom compatible can be resolved
set(DTC_OVERLAY_FILE ${CMAKE_CURRENT_SOURCE_DIR}/app.overlay)
set(DTS_ROOT ${CMAKE_CURRENT_SOURCE_DIR})

# Qorvo DW3000 driver from SDK
set(QORVO_DWT_PATH ${CMAKE_CURRENT_SOURCE_DIR}/../../DW3_QM33_SDK_1/Drivers/API/Shared/dwt_uwb_driver)
target_include_directories(app PRIVATE ${QORVO_DWT_PATH})

# Minimal set of driver sources to read DEV_ID
target_sources(app PRIVATE
    ${QORVO_DWT_PATH}/deca_interface.c
    ${QORVO_DWT_PATH}/deca_compat.c
    ${QORVO_DWT_PATH}/dw3000/dw3000_device.c
)
