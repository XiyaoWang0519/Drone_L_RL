/**
 * @file main.c
 * @brief DW3000 UWB Chip ID Reader for DWM3001CDK
 *
 * This application initializes the DW3000 UWB transceiver on the DWM3001CDK
 * board and reads its device ID to validate SPI communication and hardware
 * connectivity. It serves as a basic bring-up test for the UWB subsystem.
 */

#include <zephyr/kernel.h>          /* Kernel APIs: k_msleep() */
#include <zephyr/sys/printk.h>      /* Print kernel logging APIs */
#include <zephyr/usb/usb_device.h>  /* USB device stack APIs */

/* Qorvo DW3000 driver headers from SDK */
#include "deca_device_api.h"        /* DW3000 driver APIs: dwt_probe(), dwt_readdevid() */

/* Our Zephyr-specific probe interface for the Qorvo driver */
#include "deca_probe_interface.h"   /* Zephyr probe interface definition */

/* Our minimal port layer for GPIO/SPI control */
int dw_port_init(void);             /* Port initialization function */

/**
 * @brief Initialize USB and wait for device enumeration
 *
 * This function brings up the USB device stack and waits briefly to ensure
 * the USB CDC device is ready. This helps prevent loss of early debug output.
 */
static void usb_ready_wait(void) {
    /* Enable USB device stack. This makes the CDC device visible to the host.
     * We ignore any errors if USB is already enabled. */
    (void)usb_enable(NULL);

    /* Wait 500ms for USB enumeration to complete before proceeding.
     * This ensures the virtual serial port is ready for output. */
    k_msleep(500);
}

/**
 * @brief Main application entry point
 *
 * Initializes the UWB hardware, probes for the DW3000 device, reads its
 * device ID, and prints the results. This validates the entire UWB bring-up
 * sequence from SPI communication to device identification.
 */
void main(void)
{
    /* Initialize USB and wait for enumeration to ensure console output works */
    usb_ready_wait();
    printk("\n[DWM3001CDK] uwb_chipid starting...\n");

    /* Initialize our port layer (SPI + GPIO pins for DW3000 control) */
    if (dw_port_init()) {
        /* Port initialization failed - likely SPI or GPIO configuration issue */
        printk("Port init failed (SPI/GPIO not ready). Check overlay pins.\n");
        return;  /* Cannot continue without proper hardware initialization */
    }

    /* Perform hardware reset sequence on the DW3000.
     * The Qorvo driver requires a specific reset sequence to ensure
     * the device is in a known state before communication. */
    extern void dw_port_reset_assert(void);   /* Drive reset pin low */
    extern void dw_port_reset_deassert(void); /* Release reset pin (high) */

    /* Assert reset (drive RSTn low) for 2ms */
    dw_port_reset_assert();
    k_msleep(2);

    /* Deassert reset (drive RSTn high) and wait 5ms for device to stabilize */
    dw_port_reset_deassert();
    k_msleep(5);

    /* Probe for the DW3000 device and initialize the appropriate driver.
     * This function detects the specific DW3000 variant (DW3110, DW3120, etc.)
     * and sets up the driver accordingly. */
    int ret = dwt_probe((struct dwt_probe_s *)&dw3000_probe_interf);
    if (ret < 0) {
        /* Probe failed - could be SPI communication issues, wrong pins,
         * power problems, or incorrect device tree configuration */
        printk("dwt_probe() failed: %d\n", ret);
        /* Continue anyway to show what we can read */
    }

    /* Read the device ID register from the DW3000.
     * This is a key validation step - if SPI communication is working,
     * we should get a valid device ID response. */
    uint32_t dev_id = dwt_readdevid();
    printk("DW3xxx DEV_ID = 0x%08x\n", dev_id);
    printk("Expected for DW3110: 0xDECA0302\n");

    /* Device ID format for DW3000 family:
     * - Bits 31:16 = 0xDECA (Qorvo identifier)
     * - Bits 15:8 = Model (0x03 for DW3110/DW3120)
     * - Bits 7:4 = Variant/Sub-model
     * - Bits 3:0 = Revision
     *
     * Known values:
     * - DW3110: 0xDECA0302
     * - DW3120: 0xDECA0312
     */

    /* Enter idle loop - application has completed its validation task.
     * In a real application, this would be replaced with actual UWB operations. */
    while (1) {
        k_msleep(1000);  /* Sleep forever - no periodic tasks needed */
    }
}
