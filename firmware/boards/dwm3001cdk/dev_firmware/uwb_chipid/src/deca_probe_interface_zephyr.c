/**
 * @file deca_probe_interface_zephyr.c
 * @brief Zephyr-Specific Probe Interface for Qorvo DW3000 Driver
 *
 * This file implements the probe interface that allows the Qorvo DW3000 driver
 * to work with Zephyr's hardware abstraction layer. It provides SPI communication
 * functions, GPIO control, and system services (mutexes, delays) that the
 * DW3000 driver expects.
 *
 * The DW3000 driver is designed to be portable across different platforms,
 * so it uses function pointers for all hardware interactions. This file
 * provides Zephyr-specific implementations of those functions.
 */

#include <zephyr/kernel.h>          /* Kernel APIs: k_msleep(), k_busy_wait() */
#include <zephyr/device.h>          /* Device management APIs */
#include <zephyr/drivers/spi.h>     /* SPI driver APIs */
#include <zephyr/drivers/gpio.h>    /* GPIO driver APIs */
#include <zephyr/irq.h>             /* Interrupt management APIs */
#include <string.h>                 /* Memory functions: memcpy(), memset() */
#include <stdbool.h>                /* Boolean helpers */

#include "deca_device_api.h"        /* DW3000 driver APIs and types */
#include "deca_interface.h"         /* DW3000 interface definitions */
#include "deca_probe_interface.h"   /* Probe interface structure */

#define DW3000_PORT_LOG_MUTEX 0
#if DW3000_PORT_LOG_MUTEX
#define DW3000_PORT_PRINTK(...) printk(__VA_ARGS__)
#else
#define DW3000_PORT_PRINTK(...) do { } while (0)
#endif

/**
 * @brief Device tree node reference for the DW3000 UWB device
 *
 * This references the DW3110 device defined in the device tree overlay.
 * Used to get SPI and GPIO specifications for communication.
 */
#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)

/**
 * @brief Compile-time assertion for device tree configuration
 *
 * Ensures the UWB device tree node exists and is enabled. This prevents
 * runtime failures by catching configuration issues at compile time.
 */
BUILD_ASSERT(DT_NODE_HAS_STATUS(UWB_NODE, okay), "UWB node missing or disabled");

/**
 * @brief SPI device specification for DW3000 communication
 *
 * Contains SPI bus reference, chip select configuration, and communication
 * parameters needed for DW3000 SPI transactions.
 */
static const struct spi_dt_spec uwb_spi = SPI_DT_SPEC_GET(UWB_NODE, SPI_WORD_SET(8), 0);

/**
 * @brief GPIO specification for DW3000 reset pin
 *
 * Used for the wakeup device function. The reset pin is toggled briefly
 * to ensure the DW3000 is awake and responsive before communication.
 */
static const struct gpio_dt_spec uwb_reset = GPIO_DT_SPEC_GET(UWB_NODE, reset_gpios);
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);

#define DW3000_WAKEUP_CS_PULSE_US 600U

/* Forward declarations for functions defined in dw3000_port.c */
void dw_port_reset_assert(void);    /* Assert DW3000 reset */
void dw_port_reset_deassert(void);  /* Deassert DW3000 reset */

/* ============================================================================
 * System Service Functions for Qorvo DW3000 Driver
 * ============================================================================
 * These functions provide the system services that the DW3000 driver expects:
 * - Mutex operations for thread safety
 * - Sleep/delay functions for timing
 * ============================================================================ */

#define DECA_IRQ_KEY_FLAG BIT(31)

static K_MUTEX_DEFINE(dw_mutex);
static k_tid_t dw_mutex_owner;
static uint32_t dw_mutex_depth;
static bool dw_irq_suspended;

static void dw3000_irq_suspend(void)
{
    if (!device_is_ready(uwb_irq.port)) {
        return;
    }

    int ret = gpio_pin_interrupt_configure_dt(&uwb_irq, GPIO_INT_DISABLE);
    if (ret == 0) {
        dw_irq_suspended = true;
    } else {
        DW3000_PORT_PRINTK("dw3000 irq suspend failed: %d\n", ret);
    }
}

static void dw3000_irq_resume(void)
{
    if (!dw_irq_suspended || !device_is_ready(uwb_irq.port)) {
        return;
    }

    int ret = gpio_pin_interrupt_configure_dt(&uwb_irq, GPIO_INT_EDGE_TO_ACTIVE);
    if (ret == 0) {
        dw_irq_suspended = false;
    } else {
        DW3000_PORT_PRINTK("dw3000 irq resume failed: %d\n", ret);
    }
}

/**
 * @brief Acquire mutex for DW3000 driver thread safety
 *
 * The vendor driver expects this to guard SPI register sequences against
 * pre-emption. Using a Zephyr mutex (instead of disabling interrupts) keeps
 * the critical section serialized without tripping kernel assertions when
 * the driver performs blocking calls.
 *
 * @return Dummy value kept for API compatibility.
 */
decaIrqStatus_t decamutexon(void)
{
    if (k_is_in_isr()) {
        unsigned int key = irq_lock();
        DW3000_PORT_PRINTK("decamutexon: ISR lock key=0x%x\n", key);
        return (decaIrqStatus_t)(key | DECA_IRQ_KEY_FLAG);
    }

    k_tid_t self = k_current_get();
    if (dw_mutex_owner == self) {
        dw_mutex_depth++;
        return 0;
    }

    DW3000_PORT_PRINTK("decamutexon: thread %p taking mutex\n", self);
    k_mutex_lock(&dw_mutex, K_FOREVER);
    DW3000_PORT_PRINTK("decamutexon: thread %p got mutex\n", self);
    dw_mutex_owner = self;
    dw_mutex_depth = 1;
    dw3000_irq_suspend();
    return 0;
}

/**
 * @brief Release mutex for DW3000 driver thread safety
 *
 * @param s Unused (retained for API compatibility)
 */
void decamutexoff(decaIrqStatus_t s)
{
    if ((s & DECA_IRQ_KEY_FLAG) != 0U) {
        unsigned int key = (unsigned int)(s & ~DECA_IRQ_KEY_FLAG);
        DW3000_PORT_PRINTK("decamutexoff: ISR unlock key=0x%x\n", key);
        irq_unlock(key);
        return;
    }

    k_tid_t self = k_current_get();
    if (dw_mutex_owner == self && dw_mutex_depth > 0U) {
        dw_mutex_depth--;
        if (dw_mutex_depth == 0U) {
            dw_mutex_owner = NULL;
            DW3000_PORT_PRINTK("decamutexoff: thread %p releasing mutex\n", self);
            dw3000_irq_resume();
            k_mutex_unlock(&dw_mutex);
        }
    }
}

/**
 * @brief Millisecond sleep function for DW3000 driver
 *
 * Provides millisecond-precision delays as required by the DW3000 driver.
 * This is typically used for timing-critical operations during device
 * initialization and configuration.
 *
 * @param time_ms Number of milliseconds to sleep
 */
void deca_sleep(unsigned int time_ms)
{
    /* Use Zephyr's kernel sleep function for millisecond delays.
     * This allows other threads to run while we wait. */
    k_msleep((int32_t)time_ms);
}

/**
 * @brief Microsecond busy-wait function for DW3000 driver
 *
 * Provides microsecond-precision delays using busy-waiting. This is
 * used when precise timing is required and we can't yield to other threads.
 *
 * @param time_us Number of microseconds to busy-wait
 */
void deca_usleep(unsigned long time_us)
{
    /* Use Zephyr's busy-wait function for microsecond delays.
     * This provides precise timing without yielding the CPU. */
    k_busy_wait((uint32_t)time_us);
}

/* ============================================================================
 * Device Wakeup Function for DW3000 Driver
 * ============================================================================ */

/**
 * @brief Wake up the DW3000 device before communication
 *
 * This function is called by the DW3000 driver's probe function to ensure
 * the device is awake and responsive. It does this by briefly toggling
 * the reset pin, which wakes the DW3000 from any low-power state.
 *
 * The DW3000 can enter low-power modes, and this function ensures it's
 * ready to communicate before the driver attempts SPI transactions.
 */
static void wakeup_device_with_io(void)
{
    const struct spi_cs_control *cs_ctrl = &uwb_spi.config.cs;

    /* Vendor-recommended wake path: keep CS active for >500 us. */
    if ((cs_ctrl->gpio.port != NULL) && device_is_ready(cs_ctrl->gpio.port)) {
        (void)gpio_pin_configure_dt(&cs_ctrl->gpio, GPIO_OUTPUT_INACTIVE);
        (void)gpio_pin_set_dt(&cs_ctrl->gpio, 1);
        k_busy_wait(DW3000_WAKEUP_CS_PULSE_US);
        (void)gpio_pin_set_dt(&cs_ctrl->gpio, 0);
        k_busy_wait(200);
        return;
    }

    if (device_is_ready(uwb_reset.port)) {
        dw_port_reset_assert();
        k_msleep(2);
        dw_port_reset_deassert();
        k_msleep(2);
        return;
    }

    k_busy_wait(2000);
}

/* ============================================================================
 * SPI Communication Functions for DW3000 Driver
 * ============================================================================
 * These functions implement the DW3000's specific SPI protocol requirements.
 * The DW3000 uses a header + data SPI transaction format that requires
 * careful buffer management.
 * ============================================================================ */

/**
 * @brief Read data from DW3000 via SPI with header
 *
 * This function implements the DW3000's SPI read protocol. The DW3000 SPI
 * protocol works as follows:
 * 1. Send a header (register address, command, etc.)
 * 2. Send dummy bytes while reading the response
 * 3. The DW3000 responds with the requested data during the dummy byte period
 *
 * @param headerLength Length of the SPI header in bytes
 * @param headerBuffer Buffer containing the SPI header/command
 * @param readlength Number of bytes to read from the device
 * @param readBuffer Buffer to store the received data
 * @return DWT_SUCCESS (0) on success, DWT_ERROR (-1) on failure
 */
static int32_t readfromspi(uint16_t headerLength, uint8_t *headerBuffer,
                           uint16_t readlength, uint8_t *readBuffer)
{
    /* Verify SPI bus is available before attempting communication */
    if (!device_is_ready(uwb_spi.bus)) {
        return DWT_ERROR;  /* SPI bus not ready */
    }

    /* Set up transmit buffers: header + dummy bytes for reading.
     * The DW3000 SPI protocol requires sending dummy bytes to clock
     * out the response data. */
    struct spi_buf tx_bufs[2];

    /* First buffer: the header/command */
    tx_bufs[0].buf = headerBuffer;
    tx_bufs[0].len = headerLength;

    /* Second buffer: dummy bytes to clock out the response.
     * We allocate and zero-fill dummy bytes. */
    uint8_t *dummy = NULL;
    if (readlength > 0U) {
        /* Allocate dummy bytes - all zeros is fine */
        dummy = k_calloc(readlength, 1);
        if (!dummy) {
            return DWT_ERROR;  /* Memory allocation failed */
        }
    }

    /* Second transmit buffer: dummy bytes */
    tx_bufs[1].buf = dummy;
    tx_bufs[1].len = readlength;

    /* Set up receive buffer to capture both header echo and response data.
     * The DW3000 echoes the header followed by the actual response data. */
    const size_t rx_len = (size_t)headerLength + (size_t)readlength;
    uint8_t *rx_tmp = k_malloc(rx_len);
    if (!rx_tmp) {
        k_free(dummy);  /* Clean up on allocation failure */
        return DWT_ERROR;  /* Memory allocation failed */
    }

    /* Set up SPI buffer sets for the transaction */
    struct spi_buf rx_buf = { .buf = rx_tmp, .len = rx_len };
    struct spi_buf_set tx_set = { .buffers = tx_bufs, .count = (readlength ? 2U : 1U) };
    struct spi_buf_set rx_set = { .buffers = &rx_buf, .count = 1U };

    /* Perform the SPI transaction */
    int ret = spi_transceive_dt(&uwb_spi, &tx_set, &rx_set);
    if (ret == 0) {
        /* Transaction successful - extract the response data.
         * Skip the header echo (first headerLength bytes) and copy
         * the actual response data to the caller's buffer. */
        if (readlength > 0U) {
            memcpy(readBuffer, rx_tmp + headerLength, readlength);
        }
        ret = DWT_SUCCESS;
    } else {
        /* SPI transaction failed */
        ret = DWT_ERROR;
    }

    /* Clean up allocated buffers */
    k_free(rx_tmp);
    k_free(dummy);

    return (int32_t)ret;
}

/**
 * @brief Write data to DW3000 via SPI with header
 *
 * This function implements the DW3000's SPI write protocol. It sends
 * a header followed by the data payload in a single SPI transaction.
 *
 * @param headerLength Length of the SPI header in bytes
 * @param headerBuffer Buffer containing the SPI header/command
 * @param bodyLength Length of the data payload in bytes
 * @param bodyBuffer Buffer containing the data to write
 * @return DWT_SUCCESS (0) on success, DWT_ERROR (-1) on failure
 */
static int32_t writetospi(uint16_t headerLength, const uint8_t *headerBuffer,
                           uint16_t bodyLength, const uint8_t *bodyBuffer)
{
    /* Verify SPI bus is available before attempting communication */
    if (!device_is_ready(uwb_spi.bus)) {
        return DWT_ERROR;  /* SPI bus not ready */
    }

    /* Set up transmit buffers: header + data payload */
    struct spi_buf tx_bufs[2];

    /* First buffer: the header/command */
    tx_bufs[0].buf = (void *)headerBuffer;  /* Cast away const for SPI API */
    tx_bufs[0].len = headerLength;

    /* Second buffer: the data payload */
    tx_bufs[1].buf = (void *)bodyBuffer;    /* Cast away const for SPI API */
    tx_bufs[1].len = bodyLength;

    /* Configure SPI buffer set for transmit-only transaction */
    struct spi_buf_set tx_set = {
        .buffers = tx_bufs,
        .count = (bodyLength ? 2U : 1U)  /* Include body buffer only if data */
    };

    /* Perform the SPI transaction (transmit only, no receive) */
    int ret = spi_transceive_dt(&uwb_spi, &tx_set, NULL);
    return (ret == 0) ? (int32_t)DWT_SUCCESS : (int32_t)DWT_ERROR;
}

/**
 * @brief Write data to DW3000 via SPI with header and CRC
 *
 * This function is similar to writetospi() but includes CRC validation.
 * For this simple implementation, we ignore the CRC and delegate to
 * the regular write function.
 *
 * @param headerLength Length of the SPI header in bytes
 * @param headerBuffer Buffer containing the SPI header/command
 * @param bodyLength Length of the data payload in bytes
 * @param bodyBuffer Buffer containing the data to write
 * @param crc8 CRC-8 checksum (currently ignored)
 * @return DWT_SUCCESS (0) on success, DWT_ERROR (-1) on failure
 */
static int32_t writetospiwithcrc(uint16_t headerLength, const uint8_t *headerBuffer,
                                  uint16_t bodyLength, const uint8_t *bodyBuffer, uint8_t crc8)
{
    /* For this simple implementation, ignore CRC and use regular write */
    ARG_UNUSED(crc8);
    return writetospi(headerLength, headerBuffer, bodyLength, bodyBuffer);
}

/**
 * @brief Set DW3000 SPI to slow rate (no-op in this implementation)
 *
 * This function would typically reduce the SPI bus frequency for
 * compatibility with slower devices or during initialization.
 *
 * In this implementation, we use the device tree spi-max-frequency
 * setting to control the bus rate, so this is a no-op.
 */
static void port_set_dw_ic_spi_slowrate(void)
{
    /* No-op: SPI frequency is controlled by device tree spi-max-frequency */
}

/**
 * @brief Set DW3000 SPI to fast rate (no-op in this implementation)
 *
 * This function would typically increase the SPI bus frequency for
 * better performance after device initialization.
 *
 * In this implementation, we use the device tree spi-max-frequency
 * setting to control the bus rate, so this is a no-op.
 */
static void port_set_dw_ic_spi_fastrate(void)
{
    /* No-op: SPI frequency is controlled by device tree spi-max-frequency */
}

/* ============================================================================
 * DW3000 Driver Interface Structures
 * ============================================================================
 * These structures provide the interface between Zephyr and the Qorvo DW3000
 * driver. They contain function pointers and configuration data that the
 * driver uses to communicate with the hardware.
 * ============================================================================ */

/**
 * @brief SPI function table for DW3000 driver
 *
 * This structure contains function pointers for all SPI operations that
 * the DW3000 driver needs. It allows the driver to be platform-independent
 * by using these function pointers instead of direct hardware access.
 */
static const struct dwt_spi_s dw3000_spi_fct = {
    .readfromspi = readfromspi,              /* SPI read with header */
    .writetospi = writetospi,                /* SPI write with header */
    .writetospiwithcrc = writetospiwithcrc,  /* SPI write with CRC */
    .setslowrate = port_set_dw_ic_spi_slowrate,  /* Set slow SPI rate */
    .setfastrate = port_set_dw_ic_spi_fastrate,  /* Set fast SPI rate */
};

/* External reference to the DW3000 driver structure from Qorvo SDK */
extern const struct dwt_driver_s dw3000_driver;

/**
 * @brief Driver list for probe interface
 *
 * Array of pointers to available DW3000 drivers. For this implementation,
 * we only support the standard DW3000 driver, but the structure allows
 * for multiple drivers to be listed for auto-detection.
 */
static const struct dwt_driver_s* tmp_ptr[] = { &dw3000_driver };

/**
 * @brief Main probe interface structure for DW3000
 *
 * This is the primary interface structure that the application passes to
 * dwt_probe(). It contains all the information the DW3000 driver needs to:
 * - Communicate via SPI using our Zephyr-specific functions
 * - Wake up the device when needed
 * - Auto-detect the correct driver variant
 *
 * The driver uses this structure to perform device initialization and
 * to determine which DW3000 variant (DW3110, DW3120, etc.) is connected.
 */
const struct dwt_probe_s dw3000_probe_interf = {
    .dw = NULL,                              /* Device handle (filled by driver) */
    .spi = (void*)&dw3000_spi_fct,           /* SPI function table */
    .wakeup_device_with_io = wakeup_device_with_io,  /* Wakeup function */
    .driver_list = (struct dwt_driver_s **)tmp_ptr,   /* Available drivers */
    .dw_driver_num = 1,                      /* Number of drivers in list */
};
