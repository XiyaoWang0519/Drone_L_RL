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

#define BEACON_ID             CONFIG_UWB_BEACON_ID
#define BEACON_SLOT_ID        CONFIG_UWB_BEACON_SLOT_ID
#define BEACON_FLAGS          CONFIG_UWB_BEACON_FLAGS

#define MASTER_SUMMARY_PERIOD 200U

#if defined(CONFIG_ROLE_MASTER_ANCHOR)
#define ROLE_NAME "master"
#elif defined(CONFIG_ROLE_SLAVE_ANCHOR)
#define ROLE_NAME "slave"
#else
#define ROLE_NAME "unknown"
#endif

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
#endif

static inline int64_t ver_uptime_ms(void)
{
    return k_uptime_get();
}

#define VER_LOG(fmt, ...) \
    printk("VER ts_ms=%lld role=%s anchor_id=%u slot_id=%u " fmt "\n", \
           (long long)ver_uptime_ms(), ROLE_NAME, \
           (unsigned int)BEACON_ID, (unsigned int)BEACON_SLOT_ID, ##__VA_ARGS__)

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
            VER_LOG("event=RUN_STATE running=%u", running ? 1U : 0U);
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
                             uint32_t *tx_ok, uint32_t *tx_late,
                             uint32_t *tx_timeout)
{
    if (dwt_writetxdata(len, tx_buf, 0) != DWT_SUCCESS) {
        printk("%s: TX data write failed (seq=%u)\n", tag, seq);
        VER_LOG("event=TX_WRITE_FAIL tag=%s seq=%u", tag, (unsigned int)seq);
        dwt_forcetrxoff();
        return false;
    }

    dwt_writetxfctrl(len + FCS_LEN, 0, 1);

    k_sem_reset(&sem_tx_done);
    dwt_writesysstatuslo(DWT_INT_TXFRS_BIT_MASK);
    dwt_setdelayedtrxtime(dx_time);

    int tx_ret = dwt_starttx(DWT_START_TX_DELAYED);
    if (tx_ret == DWT_ERROR) {
        (*tx_late)++;
        printk("%s: TX late (seq=%u late=%u)\n", tag, seq, *tx_late);
        VER_LOG("event=TX_LATE tag=%s seq=%u tx_late=%u",
                tag, (unsigned int)seq, (unsigned int)(*tx_late));
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
            printk("%s: TX timeout (seq=%u timeout=%u)\n", tag, seq, *tx_timeout);
            VER_LOG("event=TX_TIMEOUT tag=%s seq=%u tx_timeout=%u",
                    tag, (unsigned int)seq, (unsigned int)(*tx_timeout));
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

    printk("\n[DWM3001CDK] UWB beacon verify firmware starting\n");
    printk("Press 's' to toggle start/pause\n");

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

    VER_LOG("event=BOOT superframe_uus=%u slot_start_uus=%u slot_uus=%u tx_guard_uus=%u",
            (unsigned int)SUPERFRAME_UUS,
            (unsigned int)SLOT_START_UUS,
            (unsigned int)SLOT_UUS,
            (unsigned int)TX_GUARD_UUS);

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
    uint32_t rx_ok = 0;
    uint32_t rx_err = 0;
    uint32_t rx_idle = 0;
    uint32_t rx_timeout_cnt = 0;
    uint32_t tx_ok = 0;
    uint32_t tx_late = 0;
    uint32_t tx_timeout = 0;

    bool t1_have_prev = false;
    bool t2_have_prev = false;
    uint64_t t1_prev_raw = 0;
    uint64_t t2_prev_raw = 0;
    int64_t t1_acc = 0;
    int64_t t2_acc = 0;

    bool have_pair = false;
    bool sync_est_valid = false;
    double sync_a = 1.0;
    double sync_b = 0.0;
    int64_t prev_t1_u = 0;
    int64_t prev_t2_u = 0;

    bool have_sync_seq = false;
    uint16_t last_sync_seq = 0;
    uint16_t expected_seq = 0;
    uint32_t missed_total = 0;
    uint32_t missed_consecutive = 0;
    uint32_t missed_consecutive_max = 0;
#endif

    while (1) {
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
                              &tx_timeout)) {
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

        VER_LOG("event=SYNC_TX seq=%u t1_master=%llu tx_ts=%llu tx_ok=%u tx_late=%u tx_timeout=%u",
                (unsigned int)superframe_seq,
                (unsigned long long)t1_master,
                (unsigned long long)last_tx_ts,
                (unsigned int)tx_ok,
                (unsigned int)tx_late,
                (unsigned int)tx_timeout);

        uint64_t sync_tx_ts = last_tx_ts;
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
                              &tx_timeout)) {
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

        VER_LOG("event=BLINK_TX seq=%u tx_ts=%llu tx_ok=%u tx_late=%u tx_timeout=%u",
                (unsigned int)superframe_seq,
                (unsigned long long)last_tx_ts,
                (unsigned int)tx_ok,
                (unsigned int)tx_late,
                (unsigned int)tx_timeout);

        superframe_seq++;
        next_sync_dtu = (uint32_t)(sync_tx_ts >> 8) + superframe_dtu;

        if ((superframe_seq % MASTER_SUMMARY_PERIOD) == 0U) {
            VER_LOG("event=SUMMARY seq=%u tx_ok=%u tx_late=%u tx_timeout=%u",
                    (unsigned int)superframe_seq,
                    (unsigned int)tx_ok,
                    (unsigned int)tx_late,
                    (unsigned int)tx_timeout);
        }
#else
        if (!rx_active) {
            if (dwt_rxenable(DWT_START_RX_IMMEDIATE) != DWT_SUCCESS) {
                printk("SLAVE: RX enable failed\n");
                k_msleep(10);
                continue;
            }
            rx_active = true;
        }

        if (k_sem_take(&sem_rx_done, K_MSEC(SLAVE_RX_WAIT_MS)) == 0) {
            rx_active = false;
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

                VER_LOG("event=SYNC_RX seq=%u master_id=%u t1_master=%llu t2_slave=%llu rx_ok=%u",
                        (unsigned int)sync.sync_seq,
                        (unsigned int)sync.master_id,
                        (unsigned long long)sync.t1_master,
                        (unsigned long long)t2_slave,
                        (unsigned int)rx_ok);

                if (!have_sync_seq) {
                    have_sync_seq = true;
                    last_sync_seq = sync.sync_seq;
                    expected_seq = (uint16_t)(sync.sync_seq + 1U);
                    missed_consecutive = 0;
                } else {
                    uint16_t delta = (uint16_t)(sync.sync_seq - last_sync_seq);
                    if (delta == 0U) {
                        VER_LOG("event=SYNC_DUP seq=%u expected_seq=%u last_sync_seq=%u",
                                (unsigned int)sync.sync_seq,
                                (unsigned int)expected_seq,
                                (unsigned int)last_sync_seq);
                    } else {
                        if (delta > 1U) {
                            uint32_t missed = (uint32_t)delta - 1U;
                            uint16_t from_seq = (uint16_t)(last_sync_seq + 1U);
                            uint16_t to_seq = (uint16_t)(sync.sync_seq - 1U);

                            missed_total += missed;
                            missed_consecutive += missed;
                            if (missed_consecutive > missed_consecutive_max) {
                                missed_consecutive_max = missed_consecutive;
                            }

                            VER_LOG("event=MISSED_SYNC from_seq=%u to_seq=%u missed_count=%u missed_total=%u max_consecutive_missed=%u",
                                    (unsigned int)from_seq,
                                    (unsigned int)to_seq,
                                    (unsigned int)missed,
                                    (unsigned int)missed_total,
                                    (unsigned int)missed_consecutive_max);
                        } else {
                            missed_consecutive = 0;
                        }

                        last_sync_seq = sync.sync_seq;
                        expected_seq = (uint16_t)(sync.sync_seq + 1U);
                    }
                }

                int64_t t1_u = unwrap_ts40(sync.t1_master, &t1_prev_raw,
                                           &t1_have_prev, &t1_acc);
                int64_t t2_u = unwrap_ts40(t2_slave, &t2_prev_raw,
                                           &t2_have_prev, &t2_acc);

                if (sync_est_valid) {
                    double pred_t2 = sync_a * (double)t1_u + sync_b;
                    double err_ticks = (double)t2_u - pred_t2;
                    double err_ns = ticks_to_ns(err_ticks);
                    printk("SLAVE: SYNC_ERR seq=%u err_ns=%.2f\n", sync.sync_seq, err_ns);
                    VER_LOG("event=SYNC_ERR seq=%u err_ns=%.2f",
                            (unsigned int)sync.sync_seq,
                            err_ns);
                }

                if (have_pair) {
                    int64_t dt1 = t1_u - prev_t1_u;
                    int64_t dt2 = t2_u - prev_t2_u;
                    if (dt1 != 0) {
                        sync_a = (double)dt2 / (double)dt1;
                        sync_b = (double)t2_u - sync_a * (double)t1_u;
                        sync_est_valid = true;
                        printk("SLAVE: EST drift_ppm=%.3f\n", (sync_a - 1.0) * 1e6);
                        VER_LOG("event=EST drift_ppm=%.3f", (sync_a - 1.0) * 1e6);
                    }
                }

                prev_t1_u = t1_u;
                prev_t2_u = t2_u;
                have_pair = true;

                if (!sync_est_valid) {
                    continue;
                }

                uint64_t blink_master_ticks = (uint64_t)t1_u + slot_offset_ticks;
                uint64_t blink_slave_ticks =
                    (uint64_t)(sync_a * (double)blink_master_ticks + sync_b);

                uint32_t blink_target_dtu = (uint32_t)(blink_slave_ticks >> 8);
                uint32_t now = get_sys_time_u32();
                blink_target_dtu = guard_tx_time(blink_target_dtu, now, tx_guard_dtu,
                                                 slot_offset_dtu);
                uint32_t blink_dx_time = quantize_delayed_time(blink_target_dtu);

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
                if (!start_delayed_tx(tx_buf, sizeof(tx_buf), blink_dx_time,
                                      "BLINK", sync.sync_seq,
                                      &tx_ok, &tx_late, &tx_timeout)) {
                    continue;
                }

                printk("SLAVE: BLINK sched t_slave=%llu tx_ts=%llu ok=%u late=%u\n",
                       (unsigned long long)blink_slave_ticks,
                       (unsigned long long)last_tx_ts,
                       tx_ok,
                       tx_late);

                VER_LOG("event=BLINK_TX seq=%u t_slave=%llu tx_ts=%llu tx_ok=%u tx_late=%u tx_timeout=%u",
                        (unsigned int)sync.sync_seq,
                        (unsigned long long)blink_slave_ticks,
                        (unsigned long long)last_tx_ts,
                        (unsigned int)tx_ok,
                        (unsigned int)tx_late,
                        (unsigned int)tx_timeout);
            } else {
                rx_err++;
                printk("SLAVE: RX non-sync len=%u ts=%llu err=%u\n",
                       rx_len,
                       (unsigned long long)last_rx_ts,
                       rx_err);

                VER_LOG("event=RX_NON_SYNC len=%u ts=%llu rx_err=%u",
                        (unsigned int)rx_len,
                        (unsigned long long)last_rx_ts,
                        (unsigned int)rx_err);
            }
            continue;
        }

        if (k_sem_take(&sem_rx_err, K_NO_WAIT) == 0) {
            rx_active = false;
            rx_err++;
            printk("SLAVE: RX error err=%u\n", rx_err);

            VER_LOG("event=RX_ERROR expected_seq=%u rx_err=%u rx_timeout=%u last_sync_seq=%u",
                    (unsigned int)expected_seq,
                    (unsigned int)rx_err,
                    (unsigned int)rx_timeout_cnt,
                    (unsigned int)(have_sync_seq ? last_sync_seq : 0U));
            continue;
        }

        if (k_sem_take(&sem_rx_to, K_NO_WAIT) == 0) {
            rx_active = false;
            rx_err++;
            rx_timeout_cnt++;
            printk("SLAVE: RX timeout err=%u\n", rx_err);

            VER_LOG("event=RX_TIMEOUT expected_seq=%u rx_err=%u rx_timeout=%u last_sync_seq=%u",
                    (unsigned int)expected_seq,
                    (unsigned int)rx_err,
                    (unsigned int)rx_timeout_cnt,
                    (unsigned int)(have_sync_seq ? last_sync_seq : 0U));
            continue;
        }

        rx_idle++;
        if (rx_idle >= SLAVE_IDLE_LOG_PERIOD) {
            printk("SLAVE: listening ok=%u err=%u\n", rx_ok, rx_err);

            VER_LOG("event=SUMMARY rx_ok=%u rx_err=%u rx_timeout=%u tx_ok=%u tx_late=%u tx_timeout=%u missed_total=%u max_consecutive_missed=%u expected_seq=%u",
                    (unsigned int)rx_ok,
                    (unsigned int)rx_err,
                    (unsigned int)rx_timeout_cnt,
                    (unsigned int)tx_ok,
                    (unsigned int)tx_late,
                    (unsigned int)tx_timeout,
                    (unsigned int)missed_total,
                    (unsigned int)missed_consecutive_max,
                    (unsigned int)expected_seq);
            rx_idle = 0;
        }
#endif
    }
}
