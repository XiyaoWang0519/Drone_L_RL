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
#define TS40_MASK       ((1ULL << 40) - 1ULL)
#define DWT_TICK_HZ     63897600000.0

#define SUPERFRAME_UUS        CONFIG_UWB_SUPERFRAME_UUS
#define SLOT_START_UUS        CONFIG_UWB_SLOT_START_UUS
#define SLOT_UUS              CONFIG_UWB_SLOT_UUS
#define TX_GUARD_UUS          CONFIG_UWB_TX_GUARD_UUS
#define TX_START_DELAY_UUS    CONFIG_UWB_TX_START_DELAY_UUS
#define TX_TIMEOUT_MS         CONFIG_UWB_TX_TIMEOUT_MS
#define SLAVE_RX_WAIT_MS      CONFIG_UWB_SLAVE_RX_WAIT_MS
#define SLAVE_IDLE_LOG_PERIOD CONFIG_UWB_SLAVE_IDLE_LOG_PERIOD
#define ENABLE_BLINK_TX       CONFIG_UWB_ENABLE_BLINK_TX
#define SLAVE_RX_WINDOWED     CONFIG_UWB_SLAVE_RX_WINDOWED
#define SLAVE_RX_EARLY_UUS    CONFIG_UWB_SLAVE_RX_EARLY_UUS
#define SLAVE_RX_WINDOW_UUS   CONFIG_UWB_SLAVE_RX_WINDOW_UUS
#define SLAVE_RX_WINDOW_PERSIST_MISSES CONFIG_UWB_SLAVE_RX_WINDOW_PERSIST_MISSES
#define SLAVE_RX_MIN_ARM_UUS            CONFIG_UWB_SLAVE_RX_MIN_ARM_UUS
#define SLAVE_RX_WINDOW_IMMEDIATE_FALLBACK CONFIG_UWB_SLAVE_RX_WINDOW_IMMEDIATE_FALLBACK
#define SLAVE_RX_WINDOW_LATE_MARGIN_UUS 2000U

#define BEACON_ID             CONFIG_UWB_BEACON_ID
#define BEACON_SLOT_ID        CONFIG_UWB_BEACON_SLOT_ID
#define BEACON_FLAGS          CONFIG_UWB_BEACON_FLAGS

#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);

static struct k_sem sem_tx_done;
static uint64_t last_tx_ts;

#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
static struct k_sem sem_rx_done;
static struct k_sem sem_rx_to;
static struct k_sem sem_rx_err;
static uint8_t rx_buf[128];
static uint16_t rx_len;
static uint64_t last_rx_ts;
static atomic_t rx_term_latched;
static atomic_t rx_term_drop_count;
static volatile uint32_t rx_term_status;
#endif

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

#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
static uint64_t get_rx_timestamp_u64(void)
{
    uint8_t ts[5] = {0};
    dwt_readrxtimestamp(ts, DWT_COMPAT_NONE);
    return ts5_to_u64(ts);
}
#endif

static int64_t unwrap_ts40(uint64_t raw, uint64_t *prev_raw, bool *have_prev, int64_t *acc)
{
    uint64_t masked = raw & TS40_MASK;
    if (!*have_prev) {
        *have_prev = true;
        *prev_raw = masked;
        *acc = (int64_t)masked;
        return *acc;
    }
    uint64_t dt = (masked - *prev_raw) & TS40_MASK;
    *acc += (int64_t)dt;
    *prev_raw = masked;
    return *acc;
}

static double ticks_to_ns(double ticks)
{
    return ticks * 1e9 / DWT_TICK_HZ;
}

static uint32_t get_sys_time_u32(void)
{
    uint8_t ts[4] = {0};
    dwt_readsystime(ts);
    return ((uint32_t)ts[3] << 24) | ((uint32_t)ts[2] << 16) |
           ((uint32_t)ts[1] << 8) | (uint32_t)ts[0];
}

static const struct device *cdc_dev;
static volatile bool running = true;
static bool running_auto_paused = false;

static bool usb_console_dtr_asserted(void)
{
    if (!cdc_dev || !device_is_ready(cdc_dev)) {
        return false;
    }

    uint32_t dtr = 0;
    if (uart_line_ctrl_get(cdc_dev, UART_LINE_CTRL_DTR, &dtr) != 0) {
        return false;
    }

    return dtr != 0U;
}

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
            if (!running) {
                running = true;
                running_auto_paused = false;
                printk("[console] start\n");
            }
        } else if (c == 'p' || c == 'P') {
            if (running) {
                running = false;
                running_auto_paused = false;
                printk("[console] pause\n");
            }
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
    gpio_add_callback(uwb_irq.port, &irq_cb);
    return 0;
}

static void on_tx_done(const dwt_cb_data_t *cb)
{
    ARG_UNUSED(cb);
    last_tx_ts = get_tx_timestamp_u64();
    k_sem_give(&sem_tx_done);
}

#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
static inline void rx_term_arm(void)
{
    atomic_set(&rx_term_latched, 0);
    rx_term_status = 0U;
}

static bool rx_term_capture(uint32_t status)
{
    if (!atomic_cas(&rx_term_latched, 0, 1)) {
        atomic_inc(&rx_term_drop_count);
        return false;
    }
    rx_term_status = status;
    return true;
}

static void on_rx_ok(const dwt_cb_data_t *cb)
{
    uint32_t status = cb ? cb->status : 0U;
    if (!rx_term_capture(status)) {
        return;
    }
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
    uint32_t status = cb ? cb->status : 0U;
    if (!rx_term_capture(status)) {
        return;
    }
    k_sem_give(&sem_rx_to);
}

static void on_rx_err(const dwt_cb_data_t *cb)
{
    uint32_t status = cb ? cb->status : 0U;
    if (!rx_term_capture(status)) {
        return;
    }
    k_sem_give(&sem_rx_err);
}
#endif

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

    uint32_t int_mask = DWT_INT_TXFRS_BIT_MASK;
#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
    int_mask |= DWT_INT_RXFCG_BIT_MASK | SYS_STATUS_ALL_RX_ERR | SYS_STATUS_ALL_RX_TO;
#endif
    dwt_setinterrupt(int_mask, 0, DWT_ENABLE_INT);

    dwt_callbacks_s cbs = {0};
    cbs.cbTxDone = on_tx_done;
#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
    cbs.cbRxOk = on_rx_ok;
    cbs.cbRxTo = on_rx_to;
    cbs.cbRxErr = on_rx_err;
#endif
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

#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
static uint32_t dtu_to_uus_ceil(uint32_t dtu)
{
    return (uint32_t)((((uint64_t)dtu << 8) + UUS_TO_DWT_TIME - 1U) / UUS_TO_DWT_TIME);
}

static uint32_t ticks_to_uus_ceil(uint64_t ticks)
{
    return (uint32_t)((ticks + UUS_TO_DWT_TIME - 1U) / UUS_TO_DWT_TIME);
}

static void drain_sem_nonblocking(struct k_sem *sem)
{
    while (k_sem_take(sem, K_NO_WAIT) == 0) {
    }
}

static void drain_opposite_rx_error_sem(bool handled_timeout)
{
    if (handled_timeout) {
        drain_sem_nonblocking(&sem_rx_err);
    } else {
        drain_sem_nonblocking(&sem_rx_to);
    }
}

static bool arm_slave_rx(bool *rx_active, bool *rx_window_active,
                         bool rx_window_ready, bool sync_est_valid,
                         uint64_t next_sync_slave_ticks, uint64_t rx_early_ticks,
                         uint32_t rx_min_arm_dtu,
                         bool allow_window_immediate_fallback,
                         uint32_t rx_window_timeout_uus,
                         uint32_t rx_window_late_dtu,
                         bool *window_expired)
{
    bool armed = false;
    bool armed_window = false;

    if (window_expired) {
        *window_expired = false;
    }

#if !SLAVE_RX_WINDOWED
    ARG_UNUSED(rx_window_ready);
    ARG_UNUSED(sync_est_valid);
    ARG_UNUSED(next_sync_slave_ticks);
    ARG_UNUSED(rx_early_ticks);
    ARG_UNUSED(rx_min_arm_dtu);
    ARG_UNUSED(allow_window_immediate_fallback);
    ARG_UNUSED(rx_window_timeout_uus);
    ARG_UNUSED(rx_window_late_dtu);
    ARG_UNUSED(window_expired);
#endif

#if SLAVE_RX_WINDOWED
    if (rx_window_ready && sync_est_valid) {
        bool window_armed = false;
        uint32_t now = get_sys_time_u32();
        uint32_t expected_dtu = quantize_delayed_time((uint32_t)(next_sync_slave_ticks >> 8));
        uint32_t window_end_dtu = expected_dtu + rx_window_late_dtu;
        int32_t to_window_end_dtu = (int32_t)(window_end_dtu - now);

        if (to_window_end_dtu <= (int32_t)rx_min_arm_dtu) {
            if (window_expired) {
                *window_expired = true;
            }
            *rx_active = false;
            *rx_window_active = false;
            return false;
        }

        if (next_sync_slave_ticks > rx_early_ticks) {
            uint64_t rx_start_ticks = next_sync_slave_ticks - rx_early_ticks;
            uint32_t rx_start_dtu = quantize_delayed_time((uint32_t)(rx_start_ticks >> 8));
            int32_t delta = (int32_t)(rx_start_dtu - now);

            if (delta > (int32_t)rx_min_arm_dtu) {
                dwt_setrxtimeout(rx_window_timeout_uus);
                dwt_setdelayedtrxtime(rx_start_dtu);
                rx_term_arm();
                if (dwt_rxenable(DWT_START_RX_DELAYED | DWT_IDLE_ON_DLY_ERR) == DWT_SUCCESS) {
                    window_armed = true;
                } else {
                    dwt_forcetrxoff();
                }
            }

#if SLAVE_RX_WINDOW_IMMEDIATE_FALLBACK
            if (!window_armed && allow_window_immediate_fallback) {
                uint32_t timeout_uus = rx_window_timeout_uus;
                if (to_window_end_dtu > 0) {
                    uint32_t remaining_uus = dtu_to_uus_ceil((uint32_t)to_window_end_dtu);
                    if ((remaining_uus > 0U) && (remaining_uus < timeout_uus)) {
                        timeout_uus = remaining_uus;
                    }
                }
                if (timeout_uus == 0U) {
                    timeout_uus = 1U;
                }
                dwt_setrxtimeout(timeout_uus);
                rx_term_arm();
                if (dwt_rxenable(DWT_START_RX_IMMEDIATE) == DWT_SUCCESS) {
                    window_armed = true;
                } else {
                    dwt_forcetrxoff();
                }
            }
#endif
        }

        if (window_armed) {
            armed = true;
            armed_window = true;
        }
    }
#endif

    if (!armed) {
#if SLAVE_RX_WINDOWED
        if (rx_window_ready && sync_est_valid) {
            *rx_active = false;
            *rx_window_active = false;
            return false;
        }
#endif
        dwt_setrxtimeout(0);
        rx_term_arm();
        if (dwt_rxenable(DWT_START_RX_IMMEDIATE) == DWT_SUCCESS) {
            armed = true;
            armed_window = false;
        } else {
            dwt_forcetrxoff();
        }
    }

    *rx_active = armed;
    *rx_window_active = armed && armed_window;
    return armed;
}
#endif

static uint32_t guard_tx_time(uint32_t target_dtu, uint32_t now_dtu,
                              uint32_t guard_dtu, uint32_t slot_offset_dtu)
{
    uint32_t delta = target_dtu - now_dtu;
    if (delta <= guard_dtu) {
        return now_dtu + guard_dtu + slot_offset_dtu;
    }
    return target_dtu;
}

static bool start_delayed_tx(const uint8_t *tx_buf, size_t len, uint32_t dx_time,
                             const char *tag, uint16_t seq,
                             uint32_t *tx_ok, uint32_t *tx_late, uint32_t *tx_timeout,
                             uint8_t tx_mode, uint32_t rx_after_tx_delay_uus,
                             uint32_t rx_after_tx_timeout_uus)
{
    if (dwt_writetxdata(len, tx_buf, 0) != DWT_SUCCESS) {
        printk("%s: TX data write failed (seq=%u)\n", tag, seq);
        dwt_forcetrxoff();
        return false;
    }
    dwt_writetxfctrl(len + FCS_LEN, 0, 1);

    k_sem_reset(&sem_tx_done);
    dwt_writesysstatuslo(DWT_INT_TXFRS_BIT_MASK);
    dwt_setdelayedtrxtime(dx_time);

    if ((tx_mode & DWT_RESPONSE_EXPECTED) != 0U) {
        dwt_setrxaftertxdelay(rx_after_tx_delay_uus);
        dwt_setrxtimeout(rx_after_tx_timeout_uus);
    } else {
        dwt_setrxaftertxdelay(0U);
    }

    int tx_ret = dwt_starttx(tx_mode);
    if (tx_ret == DWT_ERROR) {
        (*tx_late)++;
        printk("%s: TX late (seq=%u late=%u)\n", tag, seq, *tx_late);
        dwt_forcetrxoff();
        return false;
    }

    if (k_sem_take(&sem_tx_done, K_MSEC(TX_TIMEOUT_MS)) != 0) {
        uint32_t status = dwt_readsysstatuslo();
        if (status & DWT_INT_TXFRS_BIT_MASK) {
            last_tx_ts = get_tx_timestamp_u64();
            dwt_writesysstatuslo(DWT_INT_TXFRS_BIT_MASK);
        } else {
            (*tx_timeout)++;
            printk("%s: TX timeout (seq=%u timeout=%u)\n",
                   tag, seq, *tx_timeout);
            dwt_forcetrxoff();
            return false;
        }
    }

    (*tx_ok)++;
    return true;
}

void main(void)
{
    k_msleep(200);
    usb_ready_wait();
    k_msleep(200);
    printk("\n[DWM3001CDK] UWB beacon starting\n");
    printk("Press 's' to start, 'p' to pause\n");

    k_sem_init(&sem_tx_done, 0, 1);
#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
    k_sem_init(&sem_rx_done, 0, 1);
    k_sem_init(&sem_rx_to, 0, 1);
    k_sem_init(&sem_rx_err, 0, 1);
#endif
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

#if defined(CONFIG_ROLE_MASTER_ANCHOR)
    printk("[role] MASTER anchor\n");
#elif defined(CONFIG_ROLE_SLAVE_ANCHOR)
    printk("[role] SLAVE anchor\n");
#else
#error "Select ROLE_MASTER_ANCHOR or ROLE_SLAVE_ANCHOR"
#endif

#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
    dwt_setrxtimeout(0);
    dwt_setpreambledetecttimeout(0);
#endif

    const uint32_t superframe_dtu = uus_to_dx_time(SUPERFRAME_UUS);
    const uint32_t slot_start_dtu = uus_to_dx_time(SLOT_START_UUS);
    const uint32_t slot_offset_dtu =
        slot_start_dtu +
        (uint32_t)(((uint64_t)BEACON_SLOT_ID * SLOT_UUS * UUS_TO_DWT_TIME) >> 8);
    const uint32_t start_delay_dtu = uus_to_dx_time(TX_START_DELAY_UUS);
    const uint32_t tx_guard_dtu = uus_to_dx_time(TX_GUARD_UUS);
#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
    const uint64_t slot_offset_ticks =
        ((uint64_t)SLOT_START_UUS * UUS_TO_DWT_TIME) +
        ((uint64_t)BEACON_SLOT_ID * SLOT_UUS * UUS_TO_DWT_TIME);
    const uint64_t superframe_ticks = (uint64_t)SUPERFRAME_UUS * UUS_TO_DWT_TIME;
    const uint64_t rx_early_ticks = (uint64_t)SLAVE_RX_EARLY_UUS * UUS_TO_DWT_TIME;
    const uint32_t rx_window_late_base_uus =
        (SLAVE_RX_WINDOW_UUS > SLAVE_RX_EARLY_UUS) ?
        (SLAVE_RX_WINDOW_UUS - SLAVE_RX_EARLY_UUS) : 0U;
    const uint32_t rx_window_late_uus =
        rx_window_late_base_uus + SLAVE_RX_WINDOW_LATE_MARGIN_UUS;
    const uint32_t rx_window_timeout_uus =
        SLAVE_RX_EARLY_UUS + rx_window_late_uus;
    const uint32_t rx_window_late_dtu = uus_to_dx_time(rx_window_late_uus);
    const uint32_t rx_min_arm_dtu = uus_to_dx_time(SLAVE_RX_MIN_ARM_UUS);
#endif

#if defined(CONFIG_ROLE_MASTER_ANCHOR)
    uint16_t superframe_seq = 0;
    uint32_t next_sync_dtu = 0;
    bool scheduled = false;
    uint32_t tx_ok = 0;
    uint32_t tx_late = 0;
    uint32_t tx_timeout = 0;
#else
    bool rx_active = false;
    bool rx_window_active = false;
    bool rx_window_ready = false;
    bool rx_window_allow_immediate_fallback = true;
    uint64_t next_sync_slave_ticks = 0;
    uint32_t rx_ok = 0;
    uint32_t rx_err = 0;
    uint32_t rx_non_sync = 0;
    uint32_t rx_idle = 0;
    uint32_t tx_ok = 0;
    uint32_t tx_late = 0;
    uint32_t tx_timeout = 0;
    bool sync_est_valid = false;
    double sync_a = 1.0;
    double sync_b = 0.0;
    bool have_pair = false;
    int64_t prev_t1_u = 0;
    int64_t prev_t2_u = 0;
    bool t1_have_prev = false;
    uint64_t t1_prev_raw = 0;
    int64_t t1_acc = 0;
    bool t2_have_prev = false;
    uint64_t t2_prev_raw = 0;
    int64_t t2_acc = 0;
    uint32_t rx_window_miss_streak = 0;
    uint32_t rx_err_rxphe = 0;
    uint32_t rx_err_rxfce = 0;
    uint32_t rx_err_rxfsl = 0;
    uint32_t rx_err_rxsto = 0;
    uint32_t rx_err_arfe = 0;
    uint32_t rx_err_ciaerr = 0;
    uint32_t rx_err_cperr = 0;
    uint32_t rx_err_other = 0;
    uint32_t rx_to_rxfto = 0;
    uint32_t rx_to_rxpto = 0;
    uint32_t rx_to_cperr = 0;
    uint32_t rx_to_other = 0;
    uint32_t rx_err_window_advance = 0;
    uint32_t rx_window_expired_advance = 0;
    uint32_t rx_err_transient_retry = 0;
#endif

    while (1) {
        bool host_attached = usb_console_dtr_asserted();
        if (!host_attached && running) {
            running = false;
            running_auto_paused = true;
        } else if (host_attached && running_auto_paused && !running) {
            running = true;
            running_auto_paused = false;
            printk("[console] start (auto)\n");
        }

        poll_console_keys();
        if (!running) {
#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
            if (rx_active) {
                dwt_forcetrxoff();
                rx_active = false;
            }
#endif
            k_msleep(50);
            continue;
        }

#if defined(CONFIG_ROLE_MASTER_ANCHOR)
        uint32_t now = get_sys_time_u32();
        if (!scheduled) {
            next_sync_dtu = now + start_delay_dtu;
            scheduled = true;
        }
        next_sync_dtu = guard_tx_time(next_sync_dtu, now, tx_guard_dtu, 0);
        uint32_t sync_dx_time = quantize_delayed_time(next_sync_dtu);
        uint64_t t1_master = ((uint64_t)sync_dx_time) << 8;

        struct uwb_sync_frame sync = {
            .frame_type = UWB_FRAME_TYPE_SYNC,
            .master_id = BEACON_ID,
            .sync_seq = superframe_seq,
            .t1_master = t1_master,
        };
        uint8_t sync_buf[UWB_SYNC_FRAME_LEN];
        uwb_sync_pack(sync_buf, &sync);

        if (!start_delayed_tx(sync_buf, sizeof(sync_buf), sync_dx_time,
                              "SYNC", superframe_seq, &tx_ok, &tx_late,
                              &tx_timeout,
                              DWT_START_TX_DELAYED, 0U, 0U)) {
            scheduled = false;
            continue;
        }
        printk("SYNC: id=%u seq=%u t1_master=%llu tx_ts=%llu ok=%u late=%u\n",
               BEACON_ID,
               superframe_seq,
               (unsigned long long)t1_master,
               (unsigned long long)last_tx_ts,
               tx_ok,
               tx_late);

        uint64_t sync_tx_ts = last_tx_ts;
#if ENABLE_BLINK_TX
        uint32_t blink_target_dtu = sync_dx_time + slot_offset_dtu;
        now = get_sys_time_u32();
        blink_target_dtu = guard_tx_time(blink_target_dtu, now, tx_guard_dtu,
                                         slot_offset_dtu);
        uint32_t blink_dx_time = quantize_delayed_time(blink_target_dtu);
        struct uwb_blink_frame frame = {
            .frame_type = UWB_FRAME_TYPE_BLINK,
            .beacon_id = BEACON_ID,
            .superframe_seq = superframe_seq,
            .slot_id = BEACON_SLOT_ID,
            .flags = BEACON_FLAGS,
        };
        uint8_t tx_buf[UWB_BLINK_FRAME_LEN];
        uwb_blink_pack(tx_buf, &frame);

        if (!start_delayed_tx(tx_buf, sizeof(tx_buf), blink_dx_time,
                              "BLINK", superframe_seq, &tx_ok, &tx_late,
                              &tx_timeout,
                              DWT_START_TX_DELAYED, 0U, 0U)) {
            scheduled = false;
            continue;
        }
        printk("BLINK: id=%u seq=%u slot=%u tx_ts=%llu ok=%u late=%u\n",
               BEACON_ID,
               superframe_seq,
               BEACON_SLOT_ID,
               (unsigned long long)last_tx_ts,
               tx_ok,
               tx_late);
#endif

        superframe_seq++;
        next_sync_dtu = (uint32_t)(sync_tx_ts >> 8) + superframe_dtu;
#else
        if (!rx_active) {
            bool window_expired = false;
            if (!arm_slave_rx(&rx_active, &rx_window_active,
                rx_window_ready, sync_est_valid,
                              next_sync_slave_ticks, rx_early_ticks,
                              rx_min_arm_dtu,
                              rx_window_allow_immediate_fallback,
                              rx_window_timeout_uus,
                              rx_window_late_dtu,
                              &window_expired)) {
#if SLAVE_RX_WINDOWED
                if (rx_window_ready && sync_est_valid) {
                    if (window_expired) {
                        next_sync_slave_ticks += superframe_ticks;
                        rx_window_miss_streak++;
                        if (rx_window_miss_streak <= SLAVE_RX_WINDOW_PERSIST_MISSES) {
                            rx_window_ready = true;
                        } else {
                            rx_window_ready = false;
                        }
                        rx_window_allow_immediate_fallback = true;
                        rx_window_expired_advance++;
                        continue;
                    }
                    k_msleep(1);
                    continue;
                }
#endif
                printk("SLAVE: RX enable failed\n");
                k_msleep(10);
                continue;
            }
            rx_window_allow_immediate_fallback = true;
        }

        struct k_poll_event rx_events[3];
        k_poll_event_init(&rx_events[0], K_POLL_TYPE_SEM_AVAILABLE,
                          K_POLL_MODE_NOTIFY_ONLY, &sem_rx_done);
        k_poll_event_init(&rx_events[1], K_POLL_TYPE_SEM_AVAILABLE,
                          K_POLL_MODE_NOTIFY_ONLY, &sem_rx_err);
        k_poll_event_init(&rx_events[2], K_POLL_TYPE_SEM_AVAILABLE,
                          K_POLL_MODE_NOTIFY_ONLY, &sem_rx_to);
        int poll_ret = k_poll(rx_events, 3, K_MSEC(SLAVE_RX_WAIT_MS));

        if (k_sem_take(&sem_rx_done, K_NO_WAIT) == 0) {
            rx_active = false;
            rx_window_active = false;
            rx_idle = 0;

            struct uwb_sync_frame sync;
            if (uwb_sync_unpack(rx_buf, rx_len, &sync)) {
                rx_ok++;
                uint64_t t2_slave = last_rx_ts;
                printk("SLAVE: SYNC rx master=%u seq=%u t1=%llu t2=%llu ok=%u\n",
                       sync.master_id,
                       sync.sync_seq,
                       (unsigned long long)sync.t1_master,
                       (unsigned long long)t2_slave,
                       rx_ok);

                int64_t t1_u = unwrap_ts40(sync.t1_master, &t1_prev_raw, &t1_have_prev, &t1_acc);
                int64_t t2_u = unwrap_ts40(t2_slave, &t2_prev_raw, &t2_have_prev, &t2_acc);

                if (have_pair) {
                    int64_t dt1 = t1_u - prev_t1_u;
                    int64_t dt2 = t2_u - prev_t2_u;
                    if (dt1 != 0) {
                        sync_a = (double)dt2 / (double)dt1;
                        sync_b = (double)t2_u - sync_a * (double)t1_u;
                        sync_est_valid = true;
                    }
                }

                prev_t1_u = t1_u;
                prev_t2_u = t2_u;
                have_pair = true;
                rx_window_miss_streak = 0;
                rx_window_allow_immediate_fallback = true;

                if (!sync_est_valid) {
                    rx_window_ready = false;
                    continue;
                }

#if SLAVE_RX_WINDOWED
                uint64_t next_t1_master = (uint64_t)t1_u + superframe_ticks;
                double pred_next_t2 = sync_a * (double)next_t1_master + sync_b;
                if (pred_next_t2 > 0.0) {
                    next_sync_slave_ticks = (uint64_t)pred_next_t2;
                    rx_window_ready = true;
                } else {
                    rx_window_ready = false;
                }
#else
                rx_window_ready = false;
#endif

#if ENABLE_BLINK_TX
                uint64_t blink_master_ticks = (uint64_t)t1_u + slot_offset_ticks;
                uint64_t blink_slave_ticks = (uint64_t)(sync_a * (double)blink_master_ticks + sync_b);
                uint8_t blink_tx_mode = DWT_START_TX_DELAYED;
                uint32_t blink_rx_after_tx_delay_uus = 0U;
                uint32_t blink_rx_after_tx_timeout_uus = 0U;
                bool blink_rx_auto_armed = false;
                uint32_t blink_target_dtu = (uint32_t)(blink_slave_ticks >> 8);
                uint32_t now = get_sys_time_u32();
                blink_target_dtu = guard_tx_time(blink_target_dtu, now, tx_guard_dtu,
                                                 slot_offset_dtu);
                uint32_t blink_dx_time = quantize_delayed_time(blink_target_dtu);

#if SLAVE_RX_WINDOWED
                if (rx_window_ready && sync_est_valid && (next_sync_slave_ticks > blink_slave_ticks)) {
                    uint64_t to_next_sync_ticks = next_sync_slave_ticks - blink_slave_ticks;
                    if (to_next_sync_ticks > rx_early_ticks) {
                        uint64_t rx_after_tx_ticks = to_next_sync_ticks - rx_early_ticks;
                        uint32_t rx_after_tx_delay_uus = ticks_to_uus_ceil(rx_after_tx_ticks);
                        if (rx_after_tx_delay_uus > 0U) {
                            blink_tx_mode = (uint8_t)(DWT_START_TX_DELAYED | DWT_RESPONSE_EXPECTED);
                            blink_rx_after_tx_delay_uus = rx_after_tx_delay_uus;
                            blink_rx_after_tx_timeout_uus = rx_window_timeout_uus;
                            blink_rx_auto_armed = true;
                        }
                    }
                }
#endif

                struct uwb_blink_frame frame = {
                    .frame_type = UWB_FRAME_TYPE_BLINK,
                    .beacon_id = BEACON_ID,
                    .superframe_seq = sync.sync_seq,
                    .slot_id = BEACON_SLOT_ID,
                    .flags = BEACON_FLAGS,
                };
                uint8_t tx_buf[UWB_BLINK_FRAME_LEN];
                uwb_blink_pack(tx_buf, &frame);

                dwt_forcetrxoff();
                if (blink_rx_auto_armed) {
                    rx_term_arm();
                }
                if (!start_delayed_tx(tx_buf, sizeof(tx_buf), blink_dx_time,
                                      "BLINK", sync.sync_seq,
                                      &tx_ok, &tx_late, &tx_timeout,
                                      blink_tx_mode,
                                      blink_rx_after_tx_delay_uus,
                                      blink_rx_after_tx_timeout_uus)) {
                    continue;
                }
                if (blink_rx_auto_armed) {
                    rx_active = true;
                    rx_window_active = true;
                }
#endif
            } else {
                rx_non_sync++;
                printk("SLAVE: RX non-sync len=%u ts=%llu non_sync=%u\n",
                       rx_len,
                       (unsigned long long)last_rx_ts,
                       rx_non_sync);
            }
            continue;
        }

        if (k_sem_take(&sem_rx_err, K_NO_WAIT) == 0) {
            uint32_t rx_status = rx_term_status;
            bool window_advanced = false;
            bool count_rx_error = true;
#if SLAVE_RX_WINDOWED
            if (rx_window_active && sync_est_valid) {
                uint32_t decode_error_mask =
                    DWT_INT_RXPHE_BIT_MASK |
                    DWT_INT_RXFCE_BIT_MASK |
                    DWT_INT_RXFSL_BIT_MASK |
                    DWT_INT_RXSTO_BIT_MASK;
                uint32_t now = get_sys_time_u32();
                uint32_t expected_dtu =
                    quantize_delayed_time((uint32_t)(next_sync_slave_ticks >> 8));
                uint32_t window_end_dtu = expected_dtu + rx_window_late_dtu;
                int32_t to_window_end_dtu = (int32_t)(window_end_dtu - now);
                if (to_window_end_dtu > (int32_t)rx_min_arm_dtu) {
                    rx_window_ready = true;
                    if ((rx_status & decode_error_mask) != 0U) {
                        rx_window_allow_immediate_fallback = true;
                    } else {
                        rx_window_allow_immediate_fallback = false;
                    }
                    count_rx_error = false;
                    rx_err_transient_retry++;
                } else {
                    next_sync_slave_ticks += superframe_ticks;
                    rx_window_miss_streak++;
                    if (rx_window_miss_streak <= SLAVE_RX_WINDOW_PERSIST_MISSES) {
                        rx_window_ready = true;
                    } else {
                        rx_window_ready = false;
                    }
                    rx_window_allow_immediate_fallback = true;
                    window_advanced = true;
                    rx_err_window_advance++;
                }
            } else {
                rx_window_ready = false;
                rx_window_allow_immediate_fallback = true;
            }
#else
            rx_window_ready = false;
            rx_window_allow_immediate_fallback = true;
#endif
            rx_active = false;
            rx_window_active = false;
            dwt_forcetrxoff();
            drain_opposite_rx_error_sem(false);

            if (rx_status & DWT_INT_RXPHE_BIT_MASK) {
                rx_err_rxphe++;
            }
            if (rx_status & DWT_INT_RXFCE_BIT_MASK) {
                rx_err_rxfce++;
            }
            if (rx_status & DWT_INT_RXFSL_BIT_MASK) {
                rx_err_rxfsl++;
            }
            if (rx_status & DWT_INT_RXSTO_BIT_MASK) {
                rx_err_rxsto++;
            }
            if (rx_status & DWT_INT_ARFE_BIT_MASK) {
                rx_err_arfe++;
            }
            if (rx_status & DWT_INT_CIAERR_BIT_MASK) {
                rx_err_ciaerr++;
            }
            if (rx_status & DWT_INT_CPERR_BIT_MASK) {
                rx_err_cperr++;
            }
            if ((rx_status & SYS_STATUS_ALL_RX_ERR) == 0U) {
                rx_err_other++;
            }
            if (count_rx_error) {
                rx_err++;
                printk("SLAVE: RX error err=%u status=0x%08x advance=%u\n",
                       rx_err, rx_status, window_advanced ? 1U : 0U);
            }
            continue;
        }

        if (k_sem_take(&sem_rx_to, K_NO_WAIT) == 0) {
            uint32_t rx_status = rx_term_status;
#if SLAVE_RX_WINDOWED
            if (rx_window_active && sync_est_valid) {
                next_sync_slave_ticks += superframe_ticks;
                rx_window_miss_streak++;
                if (rx_window_miss_streak <= SLAVE_RX_WINDOW_PERSIST_MISSES) {
                    rx_window_ready = true;
                } else {
                    rx_window_ready = false;
                }
                rx_window_allow_immediate_fallback = true;
            } else {
                rx_window_ready = false;
                rx_window_allow_immediate_fallback = true;
            }
#else
            rx_window_ready = false;
            rx_window_allow_immediate_fallback = true;
#endif
            rx_active = false;
            rx_window_active = false;
            dwt_forcetrxoff();
            drain_opposite_rx_error_sem(true);

            rx_err++;
            if (rx_status & DWT_INT_RXFTO_BIT_MASK) {
                rx_to_rxfto++;
            }
            if (rx_status & DWT_INT_RXPTO_BIT_MASK) {
                rx_to_rxpto++;
            }
            if (rx_status & DWT_INT_CPERR_BIT_MASK) {
                rx_to_cperr++;
            }
            if ((rx_status & SYS_STATUS_ALL_RX_TO) == 0U) {
                rx_to_other++;
            }
            printk("SLAVE: RX timeout err=%u status=0x%08x\n", rx_err, rx_status);
            continue;
        }

        if (poll_ret < 0) {
            printk("SLAVE: RX poll error ret=%d\n", poll_ret);
        }

        rx_idle++;
        if (rx_idle >= SLAVE_IDLE_LOG_PERIOD) {
            printk("SLAVE: listening ok=%u err=%u non_sync=%u drop=%u "
                   "err_adv=%u exp_adv=%u retry=%u "
                   "err_bits[phe=%u fce=%u fsl=%u sto=%u arfe=%u cia=%u cperr=%u other=%u] "
                   "to_bits[fto=%u pto=%u cperr=%u other=%u]\n",
                   rx_ok, rx_err, rx_non_sync, (uint32_t)atomic_get(&rx_term_drop_count),
                   rx_err_window_advance, rx_window_expired_advance, rx_err_transient_retry,
                   rx_err_rxphe, rx_err_rxfce, rx_err_rxfsl, rx_err_rxsto,
                   rx_err_arfe, rx_err_ciaerr, rx_err_cperr, rx_err_other,
                   rx_to_rxfto, rx_to_rxpto, rx_to_cperr, rx_to_other);
            rx_idle = 0;
        }
#endif
    }
}
