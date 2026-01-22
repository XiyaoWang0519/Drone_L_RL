#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/drivers/uart.h>
#include <zephyr/sys/atomic.h>
#include <zephyr/sys/printk.h>
#include <zephyr/usb/usb_device.h>

#include <stdbool.h>
#include <string.h>

#include "deca_device_api.h"
#include "deca_probe_interface.h"
#include "uwb_blink.h"

int dw_port_init(void);
void dw_port_reset_assert(void);
void dw_port_reset_deassert(void);

#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);

static struct k_sem sem_rx_done;
static struct k_sem sem_rx_to;
static struct k_sem sem_rx_err;

static uint8_t rx_buf[128];
static uint16_t rx_len;
static uint64_t last_rx_ts;

static inline uint64_t ts5_to_u64(const uint8_t ts[5])
{
    return ((uint64_t)ts[4] << 32) | ((uint64_t)ts[3] << 24) |
           ((uint64_t)ts[2] << 16) | ((uint64_t)ts[1] << 8) | (uint64_t)ts[0];
}

static uint64_t get_rx_timestamp_u64(void)
{
    uint8_t ts[5] = {0};
    dwt_readrxtimestamp(ts, DWT_COMPAT_NONE);
    return ts5_to_u64(ts);
}

static const struct device *cdc_dev;
static volatile bool running = true;

static void poll_console_keys(void)
{
    if (!cdc_dev || !device_is_ready(cdc_dev)) {
        return;
    }

    unsigned char c;
    while (uart_poll_in(cdc_dev, &c) == 0) {
        if (c == 's' || c == 'S') {
            running = !running;
            printk("[console] %s\n", running ? "start" : "pause");
        }
    }
}

static void usb_ready_wait(void)
{
    (void)usb_enable(NULL);

    cdc_dev = DEVICE_DT_GET(DT_NODELABEL(cdc_acm_uart0));
    for (int i = 0; i < 20 && !device_is_ready(cdc_dev); ++i) {
        k_msleep(100);
    }

    if (!cdc_dev || !device_is_ready(cdc_dev)) {
        return;
    }

    uint32_t dtr = 0;
    while (true) {
        (void)uart_line_ctrl_get(cdc_dev, UART_LINE_CTRL_DTR, &dtr);
        if (dtr) {
            break;
        }
        k_msleep(50);
    }
    k_msleep(50);
}

static struct gpio_callback irq_cb;
#define UWB_ISR_STACK_SIZE 1536
#define UWB_ISR_PRIORITY   0

static struct k_sem uwb_isr_sem;
static struct k_thread uwb_isr_thread;
K_THREAD_STACK_DEFINE(uwb_isr_stack, UWB_ISR_STACK_SIZE);
static atomic_t uwb_ready;

static void uwb_isr_thread_fn(void *arg1, void *arg2, void *arg3)
{
    ARG_UNUSED(arg1);
    ARG_UNUSED(arg2);
    ARG_UNUSED(arg3);

    while (1) {
        k_sem_take(&uwb_isr_sem, K_FOREVER);
        if (!atomic_get(&uwb_ready)) {
            continue;
        }
        while (dwt_checkirq()) {
            dwt_isr();
        }
    }
}

static void uwb_irq_handler(const struct device *dev, struct gpio_callback *cb, uint32_t pins)
{
    ARG_UNUSED(dev);
    ARG_UNUSED(cb);
    ARG_UNUSED(pins);
    if (atomic_get(&uwb_ready)) {
        k_sem_give(&uwb_isr_sem);
    }
}

static int irq_setup(void)
{
    if (!device_is_ready(uwb_irq.port)) {
        return -ENODEV;
    }
    int ret = gpio_pin_configure_dt(&uwb_irq, GPIO_INPUT);
    if (ret) {
        return ret;
    }
    ret = gpio_pin_interrupt_configure_dt(&uwb_irq, GPIO_INT_EDGE_TO_ACTIVE);
    if (ret) {
        return ret;
    }
    gpio_init_callback(&irq_cb, uwb_irq_handler, BIT(uwb_irq.pin));
    ret = gpio_add_callback(uwb_irq.port, &irq_cb);
    if (ret) {
        return ret;
    }
    return 0;
}

static void on_rx_ok(const dwt_cb_data_t *cb)
{
    rx_len = cb->datalength;
    if (rx_len > sizeof(rx_buf)) {
        rx_len = sizeof(rx_buf);
    }
    dwt_readrxdata(rx_buf, rx_len, 0);
    last_rx_ts = get_rx_timestamp_u64();
    k_sem_give(&sem_rx_done);
}

static void on_rx_to(const dwt_cb_data_t *cb)
{
    ARG_UNUSED(cb);
    k_sem_give(&sem_rx_to);
}

static void on_rx_err(const dwt_cb_data_t *cb)
{
    ARG_UNUSED(cb);
    k_sem_give(&sem_rx_err);
}

static int dw3110_radio_init(void)
{
    dw_port_reset_assert();
    k_msleep(2);
    dw_port_reset_deassert();
    k_msleep(5);

    if (dwt_probe((struct dwt_probe_s *)&dw3000_probe_interf) < 0) {
        return -EIO;
    }
    while (!dwt_checkidlerc()) {
        k_busy_wait(50);
    }
    if (dwt_initialise(DWT_READ_OTP_ALL) != DWT_SUCCESS) {
        return -EIO;
    }

    dwt_config_t cfg = {
        .chan = 9,
        .txPreambLength = DWT_PLEN_64,
        .rxPAC = DWT_PAC8,
        .txCode = 9,
        .rxCode = 9,
        .sfdType = DWT_SFD_IEEE_4A,
        .dataRate = DWT_BR_6M8,
        .phrMode = DWT_PHRMODE_STD,
        .phrRate = DWT_PHRRATE_STD,
        .sfdTO = DWT_SFDTOC_DEF,
        .stsMode = DWT_STS_MODE_OFF,
        .stsLength = DWT_STS_LEN_32,
        .pdoaMode = DWT_PDOA_M0,
    };
    if (dwt_configure(&cfg) != DWT_SUCCESS) {
        return -EIO;
    }

    dwt_configureframefilter(DWT_FF_DISABLE, 0);
    dwt_setlnapamode(DWT_LNA_ENABLE | DWT_PA_ENABLE);

    dwt_setinterrupt(DWT_INT_RXFCG_BIT_MASK |
                         SYS_STATUS_ALL_RX_ERR |
                         SYS_STATUS_ALL_RX_TO,
                     0, DWT_ENABLE_INT);

    dwt_callbacks_s cbs = {0};
    cbs.cbRxOk = on_rx_ok;
    cbs.cbRxTo = on_rx_to;
    cbs.cbRxErr = on_rx_err;
    dwt_setcallbacks(&cbs);
    atomic_set(&uwb_ready, 1);

    return 0;
}

void main(void)
{
    k_msleep(200);
    usb_ready_wait();
    k_msleep(200);
    printk("\n[DWM3001CDK] UWB drone RX starting\n");
    printk("Press 's' to toggle start/pause\n");

    k_sem_init(&sem_rx_done, 0, 1);
    k_sem_init(&sem_rx_to, 0, 1);
    k_sem_init(&sem_rx_err, 0, 1);
    k_sem_init(&uwb_isr_sem, 0, 1);
    atomic_clear(&uwb_ready);
    k_thread_create(&uwb_isr_thread, uwb_isr_stack, UWB_ISR_STACK_SIZE,
                    uwb_isr_thread_fn, NULL, NULL, NULL,
                    UWB_ISR_PRIORITY, 0, K_NO_WAIT);

    if (dw_port_init()) {
        printk("DW port init failed\n");
        return;
    }
    if (irq_setup()) {
        printk("IRQ setup failed\n");
        return;
    }
    if (dw3110_radio_init()) {
        printk("DW3000 init failed\n");
        return;
    }

    dwt_setrxtimeout(0);
    dwt_setpreambledetecttimeout(0);

    bool rx_active = false;
    uint32_t rx_ok = 0;
    uint32_t rx_err = 0;
    uint32_t rx_idle = 0;

    while (1) {
        poll_console_keys();
        if (!running) {
            if (rx_active) {
                dwt_forcetrxoff();
                rx_active = false;
            }
            k_msleep(50);
            continue;
        }

        if (!rx_active) {
            if (dwt_rxenable(DWT_START_RX_IMMEDIATE) != DWT_SUCCESS) {
                printk("DRONE: RX enable failed\n");
                k_msleep(10);
                continue;
            }
            rx_active = true;
        }

        if (k_sem_take(&sem_rx_done, K_MSEC(CONFIG_UWB_DRONE_RX_WAIT_MS)) == 0) {
            rx_active = false;
            rx_idle = 0;

            struct uwb_blink_frame frame;
            if (uwb_blink_unpack(rx_buf, rx_len, &frame)) {
                rx_ok++;
                printk("DRONE: id=%u seq=%u slot=%u flags=%u ts=%llu ok=%u\n",
                       frame.beacon_id,
                       frame.superframe_seq,
                       frame.slot_id,
                       frame.flags,
                       (unsigned long long)last_rx_ts,
                       rx_ok);
            } else {
                rx_err++;
                printk("DRONE: short frame len=%u ts=%llu err=%u\n",
                       rx_len,
                       (unsigned long long)last_rx_ts,
                       rx_err);
            }
            continue;
        }

        if (k_sem_take(&sem_rx_err, K_NO_WAIT) == 0) {
            rx_active = false;
            rx_err++;
            printk("DRONE: RX error err=%u\n", rx_err);
            continue;
        }

        if (k_sem_take(&sem_rx_to, K_NO_WAIT) == 0) {
            rx_active = false;
            rx_err++;
            printk("DRONE: RX timeout err=%u\n", rx_err);
            continue;
        }

        rx_idle++;
        if (rx_idle >= CONFIG_UWB_DRONE_IDLE_LOG_PERIOD) {
            printk("DRONE: listening ok=%u err=%u\n", rx_ok, rx_err);
            rx_idle = 0;
        }
    }
}
