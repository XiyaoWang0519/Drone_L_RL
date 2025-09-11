cmake_minimum_required(VERSION 3.20.0)

# Configure Devicetree inputs before locating Zephyr
# - Use this app's overlay
set(DTC_OVERLAY_FILE ${CMAKE_CURRENT_SOURCE_DIR}/app.overlay)
# - Add uwb_chipid to DTS_ROOT so the custom DW3000 binding is found
set(DTS_ROOT
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/../uwb_chipid
)

find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})
project(twr_responder)

# Qorvo DW3000 driver from SDK
set(QORVO_DWT_PATH ${CMAKE_CURRENT_SOURCE_DIR}/../../DW3_QM33_SDK_1/Drivers/API/Shared/dwt_uwb_driver)
target_include_directories(app PRIVATE
  ${QORVO_DWT_PATH}
  # For deca_probe_interface.h reused from uwb_chipid
  ${CMAKE_CURRENT_SOURCE_DIR}/../uwb_chipid/src
)

# App sources
target_sources(app PRIVATE
  src/main.c
  # Reuse the tiny Zephyr port and probe interface from uwb_chipid demo
  ${CMAKE_CURRENT_SOURCE_DIR}/../uwb_chipid/src/dw3000_port.c
  ${CMAKE_CURRENT_SOURCE_DIR}/../uwb_chipid/src/deca_probe_interface_zephyr.c
  ${CMAKE_CURRENT_SOURCE_DIR}/../uwb_chipid/src/deca_rsl_stub.c
)

# Minimal set of driver sources (TX/RX + timestamps)
target_sources(app PRIVATE
    ${QORVO_DWT_PATH}/deca_interface.c
    ${QORVO_DWT_PATH}/deca_compat.c
    ${QORVO_DWT_PATH}/dw3000/dw3000_device.c
)
