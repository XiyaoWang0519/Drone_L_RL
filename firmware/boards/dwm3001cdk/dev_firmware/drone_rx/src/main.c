#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/drivers/uart.h>
#include <zephyr/sys/atomic.h>
#include <zephyr/sys/byteorder.h>
#include <zephyr/sys/printk.h>
#include <zephyr/sys/util.h>
#include <zephyr/usb/usb_device.h>

#include <stdbool.h>
#include <stdint.h>
#include <string.h>

#include "deca_device_api.h"
#include "deca_probe_interface.h"
#include "uwb_blink.h"

int dw_port_init(void);
void dw_port_reset_assert(void);
void dw_port_reset_deassert(void);

#define TS40_MASK   ((1ULL << 40) - 1ULL)
#define DWT_TICK_HZ 63897600000.0

#define EPOCH_MAGIC         0x01D3U
#define EPOCH_MAX_ANCHORS   4U
#define EPOCH_BUCKET_COUNT  8U
#define EPOCH_PKT_HDR_LEN   17U
#define EPOCH_PKT_ANCH_LEN  21U

#define DRONE_RX_WAIT_MS      CONFIG_UWB_DRONE_RX_WAIT_MS
#define DRONE_IDLE_LOG_PERIOD CONFIG_UWB_DRONE_IDLE_LOG_PERIOD
#define EPOCH_TIMEOUT_MS      CONFIG_UWB_DRONE_EPOCH_TIMEOUT_MS
#define DEFAULT_Q_NS2         ((float)CONFIG_UWB_DRONE_DEFAULT_Q_NS2_X10000 / 10000.0f)

#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);
static const uint8_t tracked_anchor_ids[EPOCH_MAX_ANCHORS] = {
    CONFIG_UWB_DRONE_ANCHOR_ID_1,
    CONFIG_UWB_DRONE_ANCHOR_ID_2,
    CONFIG_UWB_DRONE_ANCHOR_ID_3,
    CONFIG_UWB_DRONE_ANCHOR_ID_4,
};

static struct k_sem sem_rx_done;
static struct k_sem sem_rx_to;
static struct k_sem sem_rx_err;

static uint8_t rx_buf[128];
static uint16_t rx_len;
static uint64_t last_rx_ts;

struct epoch_bucket {
    bool used;
    uint16_t seq;
    uint32_t first_seen_ms;
    uint32_t last_seen_ms;
    uint8_t present_mask;
    uint64_t rx_ts[EPOCH_MAX_ANCHORS];
};

struct epoch_anchor_sample {
    uint8_t id;
    uint64_t t_rx_ticks;
};

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

static uint32_t now_ms(void)
{
    return k_uptime_get_32();
}

static uint8_t mask_count(uint8_t mask)
{
    uint8_t count = 0;

    for (uint8_t i = 0; i < EPOCH_MAX_ANCHORS; ++i) {
        if (mask & (uint8_t)BIT(i)) {
            count++;
        }
    }

    return count;
}

static int anchor_slot_for_id(uint8_t anchor_id)
{
    for (int i = 0; i < (int)EPOCH_MAX_ANCHORS; ++i) {
        if (tracked_anchor_ids[i] == anchor_id) {
            return i;
        }
    }

    return -1;
}

static void epoch_bucket_init(struct epoch_bucket *bucket, uint16_t seq, uint32_t timestamp_ms)
{
    memset(bucket, 0, sizeof(*bucket));
    bucket->used = true;
    bucket->seq = seq;
    bucket->first_seen_ms = timestamp_ms;
    bucket->last_seen_ms = timestamp_ms;
}

static void epoch_bucket_clear(struct epoch_bucket *bucket)
{
    memset(bucket, 0, sizeof(*bucket));
}

static void put_le_float(uint8_t *dst, float value)
{
    uint32_t raw = 0;
    memcpy(&raw, &value, sizeof(raw));
    sys_put_le32(raw, dst);
}

static void put_le_double(uint8_t *dst, double value)
{
    uint64_t raw = 0;
    memcpy(&raw, &value, sizeof(raw));
    sys_put_le64(raw, dst);
}

static bool build_epoch_packet(const struct epoch_bucket *bucket, uint8_t *out_buf,
                               size_t out_buf_len, size_t *out_len)
{
    struct epoch_anchor_sample anc[EPOCH_MAX_ANCHORS];
    uint8_t n_anc = 0;

    for (uint8_t slot = 0; slot < EPOCH_MAX_ANCHORS; ++slot) {
        if (!(bucket->present_mask & (uint8_t)BIT(slot))) {
            continue;
        }

        anc[n_anc].id = tracked_anchor_ids[slot];
        anc[n_anc].t_rx_ticks = bucket->rx_ts[slot];
        n_anc++;
    }

    if (n_anc == 0) {
        return false;
    }

    for (uint8_t i = 0; i < n_anc; ++i) {
        for (uint8_t j = i + 1; j < n_anc; ++j) {
            if (anc[j].id < anc[i].id) {
                struct epoch_anchor_sample tmp = anc[i];
                anc[i] = anc[j];
                anc[j] = tmp;
            }
        }
    }

    const size_t needed = EPOCH_PKT_HDR_LEN + ((size_t)n_anc * EPOCH_PKT_ANCH_LEN);
    if (out_buf_len < needed) {
        return false;
    }

    size_t off = 0;
    sys_put_le16(EPOCH_MAGIC, &out_buf[off]);
    off += 2;
    sys_put_le16((uint16_t)(needed - 4U), &out_buf[off]);
    off += 2;
    sys_put_le32((uint32_t)bucket->seq, &out_buf[off]);
    off += 4;
    put_le_double(&out_buf[off], (double)k_uptime_get() / 1000.0);
    off += 8;
    out_buf[off++] = n_anc;

    for (uint8_t i = 0; i < n_anc; ++i) {
        out_buf[off++] = anc[i].id;
        sys_put_le64(anc[i].t_rx_ticks, &out_buf[off]);
        off += 8;
        put_le_float(&out_buf[off], DEFAULT_Q_NS2);
        off += 4;
        put_le_float(&out_buf[off], 0.0f); /* cir_snr_db */
        off += 4;
        put_le_float(&out_buf[off], 0.0f); /* nlos_score */
        off += 4;
    }

    *out_len = off;
    return true;
}

static void emit_epoch_text(const struct epoch_bucket *bucket, bool timed_out)
{
#if CONFIG_UWB_DRONE_EMIT_EPOCH_LOG
    printk("DRONE: EPOCH seq=%u n=%u/4 timeout=%u mask=0x%02x A1=%llu A2=%llu A3=%llu A4=%llu\n",
           bucket->seq,
           mask_count(bucket->present_mask),
           timed_out ? 1U : 0U,
           bucket->present_mask,
           (unsigned long long)bucket->rx_ts[0],
           (unsigned long long)bucket->rx_ts[1],
           (unsigned long long)bucket->rx_ts[2],
           (unsigned long long)bucket->rx_ts[3]);
#else
    ARG_UNUSED(bucket);
    ARG_UNUSED(timed_out);
#endif
}

static void emit_bin_hex(const uint8_t *buf, size_t len)
{
#if CONFIG_UWB_DRONE_EMIT_BIN_HEX
    printk("BIN:");
    for (size_t i = 0; i < len; ++i) {
        printk("%02X", buf[i]);
    }
    printk("\n");
#else
    ARG_UNUSED(buf);
    ARG_UNUSED(len);
#endif
}

static void emit_epoch_payload(const struct epoch_bucket *bucket, bool timed_out,
                               uint32_t *epoch_emitted, uint32_t *epoch_full,
                               uint32_t *epoch_partial)
{
    uint8_t present = mask_count(bucket->present_mask);
    if (present == 0U) {
        return;
    }

    emit_epoch_text(bucket, timed_out);

#if CONFIG_UWB_DRONE_EMIT_BIN_HEX
    uint8_t packet[EPOCH_PKT_HDR_LEN + (EPOCH_MAX_ANCHORS * EPOCH_PKT_ANCH_LEN)];
    size_t packet_len = 0;
    if (build_epoch_packet(bucket, packet, sizeof(packet), &packet_len)) {
        emit_bin_hex(packet, packet_len);
    } else {
        printk("DRONE: EPOCH packet build error seq=%u mask=0x%02x\n",
               bucket->seq, bucket->present_mask);
    }
#endif

    (*epoch_emitted)++;
    if (present >= EPOCH_MAX_ANCHORS) {
        (*epoch_full)++;
    } else {
        (*epoch_partial)++;
    }
}

static void flush_bucket(struct epoch_bucket *buckets, int index, bool timed_out,
                         uint32_t *epoch_emitted, uint32_t *epoch_full,
                         uint32_t *epoch_partial)
{
    emit_epoch_payload(&buckets[index], timed_out, epoch_emitted, epoch_full, epoch_partial);
    epoch_bucket_clear(&buckets[index]);
}

static int find_bucket_for_seq(struct epoch_bucket *buckets, uint16_t seq)
{
    for (int i = 0; i < EPOCH_BUCKET_COUNT; ++i) {
        if (buckets[i].used && buckets[i].seq == seq) {
            return i;
        }
    }

    return -1;
}

static int alloc_bucket_for_seq(struct epoch_bucket *buckets, uint16_t seq, uint32_t timestamp_ms,
                                uint32_t *epoch_emitted, uint32_t *epoch_full,
                                uint32_t *epoch_partial)
{
    for (int i = 0; i < EPOCH_BUCKET_COUNT; ++i) {
        if (!buckets[i].used) {
            epoch_bucket_init(&buckets[i], seq, timestamp_ms);
            return i;
        }
    }

    int oldest_idx = 0;
    uint32_t oldest_age = 0;
    bool have_oldest = false;
    for (int i = 0; i < EPOCH_BUCKET_COUNT; ++i) {
        uint32_t age = timestamp_ms - buckets[i].last_seen_ms;
        if (!have_oldest || age > oldest_age) {
            oldest_age = age;
            oldest_idx = i;
            have_oldest = true;
        }
    }

    flush_bucket(buckets, oldest_idx, true, epoch_emitted, epoch_full, epoch_partial);
    epoch_bucket_init(&buckets[oldest_idx], seq, timestamp_ms);
    return oldest_idx;
}

static void flush_timed_out_buckets(struct epoch_bucket *buckets, uint32_t timestamp_ms,
                                    uint32_t *epoch_emitted, uint32_t *epoch_full,
                                    uint32_t *epoch_partial)
{
    for (int i = 0; i < EPOCH_BUCKET_COUNT; ++i) {
        if (!buckets[i].used) {
            continue;
        }
        if ((timestamp_ms - buckets[i].last_seen_ms) >= (uint32_t)EPOCH_TIMEOUT_MS) {
            flush_bucket(buckets, i, true, epoch_emitted, epoch_full, epoch_partial);
        }
    }
}

static void flush_all_buckets(struct epoch_bucket *buckets, uint32_t *epoch_emitted,
                              uint32_t *epoch_full, uint32_t *epoch_partial)
{
    for (int i = 0; i < EPOCH_BUCKET_COUNT; ++i) {
        if (!buckets[i].used) {
            continue;
        }
        flush_bucket(buckets, i, true, epoch_emitted, epoch_full, epoch_partial);
    }
}

static void process_blink_epoch(struct epoch_bucket *buckets, const struct uwb_blink_frame *frame,
                                uint64_t rx_ts, uint32_t timestamp_ms,
                                uint32_t *epoch_emitted, uint32_t *epoch_full,
                                uint32_t *epoch_partial, uint32_t *epoch_dup)
{
    int slot = anchor_slot_for_id(frame->beacon_id);
    if (slot < 0) {
        return;
    }

    int bucket_idx = find_bucket_for_seq(buckets, frame->superframe_seq);
    if (bucket_idx < 0) {
        bucket_idx = alloc_bucket_for_seq(buckets, frame->superframe_seq, timestamp_ms,
                                          epoch_emitted, epoch_full, epoch_partial);
    }

    struct epoch_bucket *bucket = &buckets[bucket_idx];
    const uint8_t bit = (uint8_t)BIT(slot);
    if (bucket->present_mask & bit) {
        (*epoch_dup)++;
    }

    bucket->present_mask |= bit;
    bucket->rx_ts[slot] = rx_ts;
    bucket->last_seen_ms = timestamp_ms;

    if (mask_count(bucket->present_mask) >= EPOCH_MAX_ANCHORS) {
        flush_bucket(buckets, bucket_idx, false, epoch_emitted, epoch_full, epoch_partial);
    }
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

    printk("DRONE: USB CDC ready, waiting for DTR...\n");
    uint32_t dtr = 0;
    while (true) {
        (void)uart_line_ctrl_get(cdc_dev, UART_LINE_CTRL_DTR, &dtr);
        if (dtr) {
            break;
        }
        k_msleep(50);
    }
    printk("DRONE: DTR asserted\n");
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
    uint32_t wait_us = 0U;

    dw_port_reset_assert();
    k_msleep(2);
    dw_port_reset_deassert();
    k_msleep(5);

    printk("DRONE: calling dwt_probe()\n");
    if (dwt_probe((struct dwt_probe_s *)&dw3000_probe_interf) < 0) {
        printk("DRONE: dwt_probe() failed\n");
        return -EIO;
    }
    printk("DRONE: dwt_probe() ok\n");

    printk("DRONE: waiting for IDLE_RC...\n");
    while (!dwt_checkidlerc()) {
        k_busy_wait(50);
        wait_us += 50U;
        if (wait_us >= 200000U) {
            printk("DRONE: IDLE_RC timeout after %u us\n", wait_us);
            return -EIO;
        }
    }
    printk("DRONE: IDLE_RC reached in %u us\n", wait_us);

    printk("DRONE: calling dwt_initialise()\n");
    if (dwt_initialise(DWT_READ_OTP_ALL) != DWT_SUCCESS) {
        printk("DRONE: dwt_initialise() failed\n");
        return -EIO;
    }
    printk("DRONE: dwt_initialise() ok\n");

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
    dwt_isr();

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
    struct epoch_bucket epoch_buckets[EPOCH_BUCKET_COUNT] = {0};
    uint32_t epoch_full = 0;
    uint32_t epoch_partial = 0;
    uint32_t epoch_dup = 0;
    uint32_t epoch_emitted = 0;

    while (1) {
        poll_console_keys();
        if (!running) {
            if (rx_active) {
                dwt_forcetrxoff();
                rx_active = false;
            }
            flush_all_buckets(epoch_buckets, &epoch_emitted, &epoch_full, &epoch_partial);
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

        if (k_sem_take(&sem_rx_done, K_MSEC(DRONE_RX_WAIT_MS)) == 0) {
            rx_active = false;
            rx_idle = 0;

            if (rx_len >= 1 && rx_buf[0] == UWB_FRAME_TYPE_BLINK) {
                struct uwb_blink_frame frame;
                if (uwb_blink_unpack(rx_buf, rx_len, &frame)) {
                    rx_ok++;
                    printk("DRONE: BLINK id=%u seq=%u slot=%u flags=%u ts=%llu ok=%u\n",
                           frame.beacon_id,
                           frame.superframe_seq,
                           frame.slot_id,
                           frame.flags,
                           (unsigned long long)last_rx_ts,
                           rx_ok);
                    process_blink_epoch(epoch_buckets, &frame, last_rx_ts, now_ms(),
                                        &epoch_emitted, &epoch_full,
                                        &epoch_partial, &epoch_dup);
                } else {
                    rx_err++;
                    printk("DRONE: BLINK parse error len=%u ts=%llu err=%u\n",
                           rx_len,
                           (unsigned long long)last_rx_ts,
                           rx_err);
                }
            } else if (rx_len >= 1 && rx_buf[0] == UWB_FRAME_TYPE_SYNC) {
                struct uwb_sync_frame sync;
                if (uwb_sync_unpack(rx_buf, rx_len, &sync)) {
                    rx_ok++;
                    uint64_t t2_drone = last_rx_ts;
                    int64_t t1_u = unwrap_ts40(sync.t1_master, &t1_prev_raw, &t1_have_prev, &t1_acc);
                    int64_t t2_u = unwrap_ts40(t2_drone, &t2_prev_raw, &t2_have_prev, &t2_acc);
                    printk("DRONE: SYNC master=%u seq=%u t1=%llu ts=%llu ok=%u\n",
                           sync.master_id,
                           sync.sync_seq,
                           (unsigned long long)sync.t1_master,
                           (unsigned long long)t2_drone,
                           rx_ok);

                    if (sync_est_valid) {
                        double pred_t2 = sync_a * (double)t1_u + sync_b;
                        double err_ticks = (double)t2_u - pred_t2;
                        printk("DRONE: SYNC_ERR seq=%u err_ns=%.2f\n",
                               sync.sync_seq,
                               ticks_to_ns(err_ticks));
                    }

                    if (have_pair) {
                        int64_t dt1 = t1_u - prev_t1_u;
                        int64_t dt2 = t2_u - prev_t2_u;
                        if (dt1 != 0) {
                            sync_a = (double)dt2 / (double)dt1;
                            sync_b = (double)t2_u - sync_a * (double)t1_u;
                            sync_est_valid = true;
                            printk("DRONE: EST drift_ppm=%.3f\n",
                                   (sync_a - 1.0) * 1e6);
                        }
                    }

                    prev_t1_u = t1_u;
                    prev_t2_u = t2_u;
                    have_pair = true;
                } else {
                    rx_err++;
                    printk("DRONE: SYNC parse error len=%u ts=%llu err=%u\n",
                           rx_len,
                           (unsigned long long)last_rx_ts,
                           rx_err);
                }
            } else {
                rx_err++;
                printk("DRONE: unknown frame type len=%u ts=%llu err=%u\n",
                       rx_len,
                       (unsigned long long)last_rx_ts,
                       rx_err);
            }
        } else if (k_sem_take(&sem_rx_err, K_NO_WAIT) == 0) {
            rx_active = false;
            rx_err++;
            printk("DRONE: RX error err=%u\n", rx_err);
        } else if (k_sem_take(&sem_rx_to, K_NO_WAIT) == 0) {
            rx_active = false;
            rx_err++;
            printk("DRONE: RX timeout err=%u\n", rx_err);
        } else {
            rx_idle++;
            if (rx_idle >= DRONE_IDLE_LOG_PERIOD) {
                printk("DRONE: listening ok=%u err=%u epoch=%u full=%u partial=%u dup=%u\n",
                       rx_ok, rx_err, epoch_emitted, epoch_full, epoch_partial, epoch_dup);
                rx_idle = 0;
            }
        }

        flush_timed_out_buckets(epoch_buckets, now_ms(), &epoch_emitted, &epoch_full, &epoch_partial);
    }
}
