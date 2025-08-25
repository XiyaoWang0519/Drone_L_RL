#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/drivers/spi.h>
#include <zephyr/usb/usb_device.h>
#include <zephyr/sys/printk.h>

/* Get DT handles */
#define UWB_NODE      DT_NODELABEL(dwm3001c_uwb)
BUILD_ASSERT(DT_NODE_HAS_STATUS(UWB_NODE, okay), "UWB node missing or disabled");

static const struct spi_dt_spec uwb_spi = SPI_DT_SPEC_GET(UWB_NODE, SPI_WORD_SET(8), 0);
static const struct gpio_dt_spec uwb_irq   = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);
static const struct gpio_dt_spec uwb_reset = GPIO_DT_SPEC_GET(UWB_NODE, reset_gpios);

int dw_port_init(void)
{
    if (!device_is_ready(uwb_spi.bus))   return -ENODEV;
    if (!device_is_ready(uwb_irq.port))  return -ENODEV;
    if (!device_is_ready(uwb_reset.port))return -ENODEV;

    /* Reset pin output (inactive = high because reset is active-low) */
    gpio_pin_configure_dt(&uwb_reset, GPIO_OUTPUT_INACTIVE);
    /* IRQ input */
    gpio_pin_configure_dt(&uwb_irq, GPIO_INPUT);
    return 0;
}

void dw_port_delay_ms(uint32_t ms)         { k_msleep(ms); }
void dw_port_reset_assert(void)            { gpio_pin_set_dt(&uwb_reset, 1); }
void dw_port_reset_deassert(void)          { gpio_pin_set_dt(&uwb_reset, 0); }

/* SPI helpers the driver can call */
int dw_port_spi_write_read(const uint8_t *tx, size_t txlen, uint8_t *rx, size_t rxlen)
{
    struct spi_buf txb = { .buf = (void*)tx, .len = txlen };
    struct spi_buf rxb = { .buf = rx,       .len = rxlen };
    struct spi_buf_set tx_set = { .buffers = &txb, .count = tx ? 1 : 0 };
    struct spi_buf_set rx_set = { .buffers = &rxb, .count = rx ? 1 : 0 };
    return spi_transceive_dt(&uwb_spi, tx ? &tx_set : NULL, rx ? &rx_set : NULL);
}

