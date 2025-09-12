/**
 * @file main.c
 * @brief USB CDC-ACM Hello World Application for DWM3001CDK
 *
 * This application demonstrates USB communication by printing messages
 * to a USB CDC-ACM (serial over USB) virtual serial port. It serves as
 * a validation test for USB connectivity and console output.
 */

#include <zephyr/kernel.h>          /* Kernel APIs: k_msleep() */
#include <zephyr/device.h>          /* Device management APIs */
#include <zephyr/drivers/uart.h>    /* UART driver APIs */
#include <zephyr/usb/usb_device.h>  /* USB device stack APIs */
#include <zephyr/sys/printk.h>      /* Print kernel logging APIs */

/**
 * @brief Wait for USB terminal connection before proceeding
 *
 * This function ensures that a USB terminal application (like screen, minicom,
 * or a serial monitor) has opened the virtual serial port before we start
 * printing messages. This prevents the loss of initial debug output.
 */
static void wait_for_dtr(void) {
    /* Get a reference to our USB CDC-ACM UART device defined in the overlay */
    const struct device *const dev = DEVICE_DT_GET(DT_NODELABEL(cdc_acm_uart0));

    /* If the device isn't ready, skip waiting (device might not be configured) */
    if (!device_is_ready(dev)) {
        return;
    }

    uint32_t dtr = 0;  /* Data Terminal Ready flag */

    /* Enable the USB device stack. Ignore errors if already enabled.
     * This brings up the USB peripheral and makes the CDC device visible
     * to the host computer. */
    (void)usb_enable(NULL);

    /* Poll the DTR (Data Terminal Ready) signal for up to 5 seconds.
     * DTR is set by terminal applications when they open the serial port.
     * We check every 500ms for a maximum of 10 attempts. */
    for (int i = 0; i < 10; ++i) {
        /* Query the current DTR state from the UART device */
        uart_line_ctrl_get(dev, UART_LINE_CTRL_DTR, &dtr);

        /* If DTR is set (terminal connected), we can proceed */
        if (dtr) {
            return;
        }

        /* Wait 500ms before checking again */
        k_msleep(500);
    }

    /* If we reach here, no terminal connected within 5 seconds.
     * We'll proceed anyway, but initial prints might be lost. */
}

/**
 * @brief Main application entry point
 *
 * Initializes USB communication, prints welcome messages, and enters
 * a heartbeat loop that periodically prints status messages.
 */
void main(void) {
    /* Initialize USB and wait for a terminal to connect.
     * This ensures our initial debug messages aren't lost. */
    wait_for_dtr();

    /* Print welcome banner with application information */
    printk("\n\n=== DWM3001CDK usb_hello ===\n");
    printk("Board up. Zephyr says hi from USB CDC (J20)!\n");

    /* Print build timestamp for version tracking */
    printk("Build: %s %s\n", __DATE__, __TIME__);

    /* Main application loop - print periodic heartbeat messages.
     * This loop runs forever and provides ongoing proof that the
     * application is running and USB communication is working. */
    while (1) {
        /* Print a simple heartbeat message */
        printk("tick\n");

        /* Sleep for 1 second before next heartbeat.
         * This creates a 1 Hz heartbeat pattern. */
        k_msleep(1000);
    }
}
