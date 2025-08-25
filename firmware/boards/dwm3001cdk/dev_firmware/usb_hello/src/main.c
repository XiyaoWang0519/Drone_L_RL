#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/uart.h>
#include <zephyr/usb/usb_device.h>
#include <zephyr/sys/printk.h>

static void wait_for_dtr(void) {
    /* Wait until a terminal opens the port (prevents lost first prints) */
    const struct device *const dev = DEVICE_DT_GET(DT_NODELABEL(cdc_acm_uart0));
    if (!device_is_ready(dev)) return;

    uint32_t dtr = 0;
    /* Start USB now; ignore error if already enabled */
    (void)usb_enable(NULL);

    /* Poll DTR for ~5 seconds max (10 * 500 ms) */
    for (int i = 0; i < 10; ++i) {
        uart_line_ctrl_get(dev, UART_LINE_CTRL_DTR, &dtr);
        if (dtr) return;
        k_msleep(500);
    }
}

void main(void) {
    /* Bring up USB CDC and wait briefly for a terminal */
    wait_for_dtr();

    printk("\n\n=== DWM3001CDK usb_hello ===\n");
    printk("Board up. Zephyr says hi from USB CDC (J20)!\n");
    printk("Build: %s %s\n", __DATE__, __TIME__);

    /* Heartbeat so you can see it's alive even without a terminal */
    while (1) {
        printk("tick\n");
        k_msleep(1000);
    }
}
