#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/spi.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/irq.h>
#include <string.h>

#include "deca_device_api.h"
#include "deca_interface.h"
#include "deca_probe_interface.h"

/* DT handles for the DW3110 node */
#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)
BUILD_ASSERT(DT_NODE_HAS_STATUS(UWB_NODE, okay), "UWB node missing or disabled");

static const struct spi_dt_spec uwb_spi = SPI_DT_SPEC_GET(UWB_NODE, SPI_WORD_SET(8), 0);
static const struct gpio_dt_spec uwb_reset = GPIO_DT_SPEC_GET(UWB_NODE, reset_gpios);

/* Reset helpers from our port (declared in dw3000_port.c) */
void dw_port_reset_assert(void);
void dw_port_reset_deassert(void);

/* --- deca_mutex + sleep hooks expected by Qorvo driver --- */
decaIrqStatus_t decamutexon(void)
{
    return (decaIrqStatus_t)irq_lock();
}

void decamutexoff(decaIrqStatus_t s)
{
    irq_unlock((unsigned int)s);
}

void deca_sleep(unsigned int time_ms)
{
    k_msleep((int32_t)time_ms);
}

void deca_usleep(unsigned long time_us)
{
    k_busy_wait((uint32_t)time_us);
}

/* --- Wakeup hook used by dwt_probe() --- */
static void wakeup_device_with_io(void)
{
    /* If reset-gpios is wired, toggle it briefly to ensure device is awake */
    if (device_is_ready(uwb_reset.port)) {
        dw_port_reset_assert();
        k_msleep(1);
        dw_port_reset_deassert();
        k_msleep(2);
    } else {
        /* Fallback: small delay only */
        k_msleep(2);
    }
}

/* --- SPI helpers wired into dwt_spi_s --- */
static int32_t readfromspi(uint16_t headerLength, uint8_t *headerBuffer,
                           uint16_t readlength, uint8_t *readBuffer)
{
    if (!device_is_ready(uwb_spi.bus)) {
        return DWT_ERROR;
    }

    /* Build a 2-part TX: header then dummy bytes; and a single RX to collect both */
    struct spi_buf tx_bufs[2];
    tx_bufs[0].buf = headerBuffer;
    tx_bufs[0].len = headerLength;

    uint8_t *dummy = NULL;
    if (readlength > 0U) {
        dummy = k_calloc(readlength, 1);
        if (!dummy) {
            return DWT_ERROR;
        }
    }
    tx_bufs[1].buf = dummy;
    tx_bufs[1].len = readlength;

    const size_t rx_len = (size_t)headerLength + (size_t)readlength;
    uint8_t *rx_tmp = k_malloc(rx_len);
    if (!rx_tmp) {
        k_free(dummy);
        return DWT_ERROR;
    }

    struct spi_buf_set tx_set = { .buffers = tx_bufs, .count = (readlength ? 2U : 1U) };
    struct spi_buf rx_buf = { .buf = rx_tmp, .len = rx_len };
    struct spi_buf_set rx_set = { .buffers = &rx_buf, .count = 1U };

    int ret = spi_transceive_dt(&uwb_spi, &tx_set, &rx_set);
    if (ret == 0) {
        if (readlength > 0U) {
            memcpy(readBuffer, rx_tmp + headerLength, readlength);
        }
        ret = DWT_SUCCESS;
    } else {
        ret = DWT_ERROR;
    }

    k_free(rx_tmp);
    k_free(dummy);
    return (int32_t)ret;
}

static int32_t writetospi(uint16_t headerLength, const uint8_t *headerBuffer,
                           uint16_t bodyLength, const uint8_t *bodyBuffer)
{
    if (!device_is_ready(uwb_spi.bus)) {
        return DWT_ERROR;
    }

    struct spi_buf tx_bufs[2];
    tx_bufs[0].buf = (void *)headerBuffer;
    tx_bufs[0].len = headerLength;
    tx_bufs[1].buf = (void *)bodyBuffer;
    tx_bufs[1].len = bodyLength;

    struct spi_buf_set tx_set = { .buffers = tx_bufs, .count = (bodyLength ? 2U : 1U) };
    int ret = spi_transceive_dt(&uwb_spi, &tx_set, NULL);
    return (ret == 0) ? (int32_t)DWT_SUCCESS : (int32_t)DWT_ERROR;
}

static int32_t writetospiwithcrc(uint16_t headerLength, const uint8_t *headerBuffer,
                                  uint16_t bodyLength, const uint8_t *bodyBuffer, uint8_t crc8)
{
    ARG_UNUSED(crc8);
    return writetospi(headerLength, headerBuffer, bodyLength, bodyBuffer);
}

static void port_set_dw_ic_spi_slowrate(void)
{
    /* No-op: use DT spi-max-frequency to control bus rate */
}

static void port_set_dw_ic_spi_fastrate(void)
{
    /* No-op: use DT spi-max-frequency to control bus rate */
}

static const struct dwt_spi_s dw3000_spi_fct = {
    .readfromspi = readfromspi,
    .writetospi = writetospi,
    .writetospiwithcrc = writetospiwithcrc,
    .setslowrate = port_set_dw_ic_spi_slowrate,
    .setfastrate = port_set_dw_ic_spi_fastrate,
};

extern const struct dwt_driver_s dw3000_driver;
static const struct dwt_driver_s* tmp_ptr[] = { &dw3000_driver };

const struct dwt_probe_s dw3000_probe_interf = {
    .dw = NULL,
    .spi = (void*)&dw3000_spi_fct,
    .wakeup_device_with_io = wakeup_device_with_io,
    .driver_list = (struct dwt_driver_s **)tmp_ptr,
    .dw_driver_num = 1,
};
