/**
 * @file dw3000_port.c
 * @brief Minimal Port Layer for DW3000 UWB Transceiver
 *
 * This file provides a thin abstraction layer between the Qorvo DW3000 driver
 * and Zephyr's hardware abstraction layer. It handles GPIO control for reset
 * and interrupt pins, SPI communication, and basic timing functions.
 */

#include <zephyr/kernel.h>          /* Kernel APIs: k_msleep() */
#include <zephyr/device.h>          /* Device management APIs */
#include <zephyr/drivers/gpio.h>    /* GPIO driver APIs */
#include <zephyr/drivers/spi.h>     /* SPI driver APIs */
#include <zephyr/usb/usb_device.h>  /* USB device stack APIs (unused in this file) */
#include <zephyr/sys/printk.h>      /* Print kernel logging APIs (unused in this file) */

/**
 * @brief Device tree node reference for the DW3000 UWB device
 *
 * This references the DW3000 device defined in the device tree overlay.
 * The node label "dwm3001c_uwb" corresponds to the device tree node
 * that describes the DW3110 on the DWM3001CDK board.
 */
#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)

/**
 * @brief Compile-time assertion for device tree configuration
 *
 * Ensures the UWB device tree node exists and is enabled. If this fails,
 * the build will stop with a clear error message indicating the overlay
 * configuration is missing or incorrect.
 */
BUILD_ASSERT(DT_NODE_HAS_STATUS(UWB_NODE, okay), "UWB node missing or disabled");

/**
 * @brief SPI device specification for DW3000 communication
 *
 * This structure contains all SPI configuration needed to communicate with
 * the DW3000: SPI bus reference, chip select pin, and communication parameters.
 * The SPI_WORD_SET(8) specifies 8-bit word size for SPI transactions.
 */
static const struct spi_dt_spec uwb_spi = SPI_DT_SPEC_GET(UWB_NODE, SPI_WORD_SET(8), 0);

/**
 * @brief GPIO specification for DW3000 interrupt pin
 *
 * The DW3000 uses this pin to signal events to the host microcontroller.
 * It's configured as an input pin that the DW3000 can drive high when
 * it has data ready or needs attention.
 */
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);

/**
 * @brief GPIO specification for DW3000 reset pin
 *
 * This is an active-low reset pin. When driven low, it resets the DW3000
 * to a known state. When high (inactive), the DW3000 operates normally.
 */
static const struct gpio_dt_spec uwb_reset = GPIO_DT_SPEC_GET(UWB_NODE, reset_gpios);

/**
 * @brief Initialize the DW3000 port layer
 *
 * This function verifies that all required hardware interfaces (SPI bus,
 * GPIO pins) are available and configures them appropriately.
 *
 * @return 0 on success, negative errno on failure
 */
int dw_port_init(void)
{
    /* Verify SPI bus is ready for communication */
    if (!device_is_ready(uwb_spi.bus)) {
        printk("dw_port: SPI bus not ready\n");
        return -ENODEV;  /* SPI bus not available */
    }

    /* Verify interrupt GPIO pin is accessible */
    if (!device_is_ready(uwb_irq.port)) {
        printk("dw_port: IRQ GPIO port not ready\n");
        return -ENODEV;  /* IRQ GPIO port not available */
    }

    /* Verify reset GPIO pin is accessible */
    if (!device_is_ready(uwb_reset.port)) {
        printk("dw_port: Reset GPIO port not ready\n");
        return -ENODEV;  /* Reset GPIO port not available */
    }

    /* Keep reset released as high-Z input (vendor reference behavior). */
    int ret = gpio_pin_configure_dt(&uwb_reset, GPIO_INPUT);
    if (ret) {
        printk("dw_port: Failed to configure reset pin (%d)\n", ret);
        return ret;
    }
    printk("dw_port: Reset pin configured\n");

    /* Configure interrupt pin as input (DW3000 will drive this pin) */
    ret = gpio_pin_configure_dt(&uwb_irq, GPIO_INPUT);
    if (ret) {
        printk("dw_port: Failed to configure IRQ pin (%d)\n", ret);
        return ret;
    }
    printk("dw_port: IRQ pin configured\n");

    printk("dw_port: init complete\n");
    return 0;  /* All hardware interfaces successfully initialized */
}

/**
 * @brief Delay function for DW3000 driver
 *
 * Provides millisecond-precision delays as required by the DW3000 driver.
 * This is a simple wrapper around Zephyr's k_msleep() function.
 *
 * @param ms Number of milliseconds to delay
 */
void dw_port_delay_ms(uint32_t ms) {
    k_msleep(ms);
}

/**
 * @brief Assert DW3000 reset (drive reset pin low)
 *
 * This function drives the reset pin low, putting the DW3000 into reset state.
 * The reset pin is active-low, so low = reset asserted.
 */
void dw_port_reset_assert(void) {
    /* Drive reset active (physical low for GPIO_ACTIVE_LOW). */
    int ret = gpio_pin_configure_dt(&uwb_reset, GPIO_OUTPUT_ACTIVE);
    if (ret) {
        printk("dw_port: Reset assert failed (%d)\n", ret);
        return;
    }
    printk("dw_port: Reset asserted\n");
}

/**
 * @brief Deassert DW3000 reset (release reset pin)
 *
 * This function releases the reset pin, allowing the DW3000 to operate normally.
 * With GPIO_ACTIVE_LOW, setting the logical value to 0 drives the physical
 * pin high, which deasserts the active-low reset.
 */
void dw_port_reset_deassert(void) {
    /* Release reset line to input; do not actively drive high. */
    int ret = gpio_pin_configure_dt(&uwb_reset, GPIO_INPUT);
    if (ret) {
        printk("dw_port: Reset deassert failed (%d)\n", ret);
    } else {
        printk("dw_port: Reset deasserted\n");
    }
}

/**
 * @brief SPI write/read transaction for DW3000 communication
 *
 * This function performs SPI transactions with the DW3000. It can handle
 * write-only, read-only, or simultaneous write-read operations.
 *
 * @param tx Pointer to transmit buffer (can be NULL for read-only)
 * @param txlen Length of transmit data in bytes
 * @param rx Pointer to receive buffer (can be NULL for write-only)
 * @param rxlen Length of expected receive data in bytes
 * @return 0 on success, negative errno on failure
 */
int dw_port_spi_write_read(const uint8_t *tx, size_t txlen, uint8_t *rx, size_t rxlen)
{
    /* Set up transmit buffer if we have data to send */
    struct spi_buf txb = {
        .buf = (void*)tx,    /* Cast away const for SPI API */
        .len = txlen
    };

    /* Set up receive buffer if we expect to receive data */
    struct spi_buf rxb = {
        .buf = rx,
        .len = rxlen
    };

    /* Configure SPI buffer sets for transmit and receive */
    struct spi_buf_set tx_set = {
        .buffers = &txb,
        .count = tx ? 1 : 0  /* Only include tx buffer if tx data provided */
    };
    struct spi_buf_set rx_set = {
        .buffers = &rxb,
        .count = rx ? 1 : 0  /* Only include rx buffer if rx buffer provided */
    };

    /* Perform the SPI transaction */
    return spi_transceive_dt(&uwb_spi,
                           tx ? &tx_set : NULL,  /* Transmit set (or NULL) */
                           rx ? &rx_set : NULL); /* Receive set (or NULL) */
}
