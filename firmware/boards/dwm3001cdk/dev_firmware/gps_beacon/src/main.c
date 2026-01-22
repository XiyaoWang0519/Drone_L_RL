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

#define UUS_TO_DWT_TIME 63898U

#define SUPERFRAME_UUS        CONFIG_UWB_SUPERFRAME_UUS
#define SLOT_UUS              CONFIG_UWB_SLOT_UUS
#define TX_GUARD_UUS          CONFIG_UWB_TX_GUARD_UUS
#define TX_START_DELAY_UUS    CONFIG_UWB_TX_START_DELAY_UUS
#define TX_TIMEOUT_MS         CONFIG_UWB_TX_TIMEOUT_MS

#define BEACON_ID             CONFIG_UWB_BEACON_ID
#define BEACON_SLOT_ID        CONFIG_UWB_BEACON_SLOT_ID
#define BEACON_FLAGS          CONFIG_UWB_BEACON_FLAGS

#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);

static struct k_sem sem_tx_done;
static uint64_t last_tx_ts;

static inline uint64_t ts5_to_u64(const uint8_t ts[5])
{
    return ((uint64_t)ts[4] << 32) | ((uint64_t)ts[3] << 24) |
           ((uint64_t)ts[2] << 16) | ((uint64_t)ts[1] << 8) | (uint64_t)ts[0];
}

static uint64_t get_tx_timestamp_u64(void)
{
    uint8_t ts[5] = {0};
    dwt_readtxtimestamp(ts);
    return ts5_to_u64(ts);
}

static uint32_t get_sys_time_u32(void)
{
    uint8_t ts[5] = {0};
    dwt_readsystime(ts);
    return ((uint32_t)ts[3] << 24) | ((uint32_t)ts[2] << 16) |
           ((uint32_t)ts[1] << 8) | (uint32_t)ts[0];
}

static const struct device *cdc_dev;
static volatile bool running = true;

static void poll_console_keys(void)
{
    if (!cdc_dev || !device_is_ready(cdc_dev)) {
        return;
    }

    unsigned char c;
    for (int i = 0; i < 8; ++i) {
        if (uart_poll_in(cdc_dev, &c) != 0) {
            break;
        }
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

static void on_tx_done(const dwt_cb_data_t *cb)
{
    ARG_UNUSED(cb);
    last_tx_ts = get_tx_timestamp_u64();
    k_sem_give(&sem_tx_done);
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

    dwt_setinterrupt(DWT_INT_TXFRS_BIT_MASK, 0, DWT_ENABLE_INT);

    dwt_callbacks_s cbs = {0};
    cbs.cbTxDone = on_tx_done;
    dwt_setcallbacks(&cbs);
    atomic_set(&uwb_ready, 1);
    dwt_isr();

    return 0;
}

static uint32_t uus_to_dx_time(uint32_t uus)
{
    return (uint32_t)(((uint64_t)uus * UUS_TO_DWT_TIME) >> 8);
}

static uint32_t quantize_delayed_time(uint32_t dx_time)
{
    return dx_time & 0xFFFFFFFEUL;
}

static uint32_t guard_tx_time(uint32_t target_dtu, uint32_t now_dtu,
                              uint32_t guard_dtu, uint32_t slot_offset_dtu)
{
    uint32_t delta = target_dtu - now_dtu;
    if (delta <= guard_dtu || delta > 0x80000000UL) {
        return now_dtu + guard_dtu + slot_offset_dtu;
    }
    return target_dtu;
}

void main(void)
{
    k_msleep(200);
    usb_ready_wait();
    k_msleep(200);
    printk("\n[DWM3001CDK] UWB beacon starting\n");
    printk("Press 's' to toggle start/pause\n");

    k_sem_init(&sem_tx_done, 0, 1);
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

    const uint32_t superframe_dtu = uus_to_dx_time(SUPERFRAME_UUS);
    const uint32_t slot_offset_dtu =
        (uint32_t)(((uint64_t)BEACON_SLOT_ID * SLOT_UUS * UUS_TO_DWT_TIME) >> 8);
    const uint32_t start_delay_dtu = uus_to_dx_time(TX_START_DELAY_UUS);
    const uint32_t tx_guard_dtu = uus_to_dx_time(TX_GUARD_UUS);

    uint16_t superframe_seq = 0;
    uint32_t next_tx_dtu = 0;
    bool scheduled = false;
    uint32_t tx_ok = 0;
    uint32_t tx_late = 0;
    uint32_t tx_timeout = 0;

    while (1) {
        poll_console_keys();
        if (!running) {
            k_msleep(50);
            continue;
        }

        uint32_t now = get_sys_time_u32();
        if (!scheduled) {
            next_tx_dtu = now + start_delay_dtu + slot_offset_dtu;
            scheduled = true;
        }
        next_tx_dtu = guard_tx_time(next_tx_dtu, now, tx_guard_dtu, slot_offset_dtu);

        struct uwb_blink_frame frame = {
            .beacon_id = BEACON_ID,
            .superframe_seq = superframe_seq,
            .slot_id = BEACON_SLOT_ID,
            .flags = BEACON_FLAGS,
        };
        uint8_t tx_buf[UWB_BLINK_FRAME_LEN];
        uwb_blink_pack(tx_buf, &frame);

        if (dwt_writetxdata(sizeof(tx_buf), tx_buf, 0) != DWT_SUCCESS) {
            printk("GPS: TX data write failed (seq=%u)\n", superframe_seq);
            dwt_forcetrxoff();
            scheduled = false;
            continue;
        }
        dwt_writetxfctrl(sizeof(tx_buf) + FCS_LEN, 0, 1);

        k_sem_reset(&sem_tx_done);
        dwt_writesysstatuslo(DWT_INT_TXFRS_BIT_MASK);
        uint32_t dx_time = quantize_delayed_time(next_tx_dtu);
        dwt_setdelayedtrxtime(dx_time);

        int tx_ret = dwt_starttx(DWT_START_TX_DELAYED);
        if (tx_ret == DWT_ERROR) {
            tx_late++;
            printk("GPS: TX late (seq=%u late=%u)\n", superframe_seq, tx_late);
            dwt_forcetrxoff();
            scheduled = false;
            continue;
        }

        if (k_sem_take(&sem_tx_done, K_MSEC(TX_TIMEOUT_MS)) != 0) {
            uint32_t status = dwt_readsysstatuslo();
            if (status & DWT_INT_TXFRS_BIT_MASK) {
                last_tx_ts = get_tx_timestamp_u64();
                dwt_writesysstatuslo(DWT_INT_TXFRS_BIT_MASK);
            } else {
                tx_timeout++;
                printk("GPS: TX timeout (seq=%u timeout=%u)\n", superframe_seq, tx_timeout);
                dwt_forcetrxoff();
                scheduled = false;
                continue;
            }
        }

        tx_ok++;
        printk("GPS: id=%u seq=%u slot=%u tx_ts=%llu ok=%u late=%u\n",
               BEACON_ID,
               superframe_seq,
               BEACON_SLOT_ID,
               (unsigned long long)last_tx_ts,
               tx_ok,
               tx_late);

        superframe_seq++;
        next_tx_dtu = (uint32_t)(last_tx_ts >> 8) + superframe_dtu;
    }
}
