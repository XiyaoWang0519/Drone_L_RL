/**
 * @file deca_probe_interface.h
 * @brief Header for Zephyr DW3000 Probe Interface
 *
 * This header file declares the probe interface structure that allows
 * the Qorvo DW3000 driver to work with Zephyr's hardware abstraction layer.
 * The probe interface provides a standardized way for the DW3000 driver
 * to discover and initialize different DW3000 device variants.
 */

#pragma once

/* Include DW3000 driver API headers for type definitions */
#include "deca_device_api.h"

/**
 * @brief External declaration of DW3000 probe interface
 *
 * This is the main probe interface structure that applications should
 * pass to the dwt_probe() function. It contains function pointers for
 * SPI communication, device wakeup, and driver selection that allow
 * the DW3000 driver to work with Zephyr's hardware abstraction layer.
 *
 * The structure is defined in deca_probe_interface_zephyr.c and contains:
 * - SPI function pointers for device communication
 * - Wakeup function to ensure device is responsive
 * - List of available DW3000 drivers for auto-detection
 *
 * Usage example:
 *   int ret = dwt_probe((struct dwt_probe_s *)&dw3000_probe_interf);
 */
extern const struct dwt_probe_s dw3000_probe_interf;

