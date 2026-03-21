#include <zephyr/device.h>
#include <zephyr/devicetree.h>
#include <zephyr/drivers/flash.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/drivers/uart.h>
#include <zephyr/fs/nvs.h>
#include <zephyr/kernel.h>
#include <zephyr/storage/flash_map.h>
#include <zephyr/sys/atomic.h>
#include <zephyr/sys/printk.h>
#include <zephyr/sys/util.h>
#include <zephyr/usb/usb_device.h>

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
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
#define C_AIR_M_PER_S   299702547.0

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

#define CAL_DISCOVERY_ROUNDS          CONFIG_UWB_CAL_DISCOVERY_ROUNDS
#define CAL_EXPECTED_SLAVES           CONFIG_UWB_CAL_EXPECTED_SLAVES
#define CAL_TWR_SAMPLES               CONFIG_UWB_CAL_TWR_SAMPLES
#define CAL_SYNC_SAMPLES              CONFIG_UWB_CAL_SYNC_SAMPLES
#define CAL_GEOMETRY_TARGET_SAMPLES   CONFIG_UWB_CAL_GEOMETRY_TARGET_SAMPLES
#define CAL_GEOMETRY_SETTLE_MS        CONFIG_UWB_CAL_GEOMETRY_SETTLE_MS
#define CAL_READY_MIN_TIMEOUT_MS      CONFIG_UWB_CAL_READY_MIN_TIMEOUT_MS
#define CAL_WAIT_MS                   CONFIG_UWB_CAL_WAIT_MS
#define CAL_DISCOVERY_RESP_BASE_UUS   CONFIG_UWB_CAL_DISCOVERY_RESP_BASE_UUS
#define CAL_DISCOVERY_RESP_SLOT_UUS   CONFIG_UWB_CAL_DISCOVERY_RESP_SLOT_UUS
#define CAL_STATUS_RESP_BASE_UUS      CONFIG_UWB_CAL_STATUS_RESP_BASE_UUS
#define CAL_STATUS_RESP_SLOT_UUS      CONFIG_UWB_CAL_STATUS_RESP_SLOT_UUS
#define CAL_POLL_RX_TO_RESP_TX_DLY_UUS CONFIG_UWB_CAL_POLL_RX_TO_RESP_TX_DLY_UUS
#define CAL_RESP_RX_TO_FINAL_TX_DLY_UUS CONFIG_UWB_CAL_RESP_RX_TO_FINAL_TX_DLY_UUS
#define CAL_RX_TIMEOUT_UUS            CONFIG_UWB_CAL_RX_TIMEOUT_UUS
#define CAL_NETWORK_BROADCASTS        CONFIG_UWB_CAL_NETWORK_BROADCASTS
#define CAL_FIXED_TX_BIAS_TICKS       CONFIG_UWB_CAL_FIXED_TX_BIAS_TICKS
#define TX_ANT_DLY                    CONFIG_UWB_TX_ANT_DLY
#define RX_ANT_DLY                    CONFIG_UWB_RX_ANT_DLY
#define CAL_CONTROL_TX_DELAY_UUS      4000U
#define CAL_TWR_MIN_VALID_SAMPLES     2U
#define CAL_TWR_ATTEMPTS              MAX(CAL_TWR_SAMPLES, 8U)
#define CAL_SYNC_BROADCASTS           MAX(CAL_SYNC_SAMPLES + 2U, 8U)
#define CAL_READY_SYNC_BURST          MAX(4U, ((CAL_SYNC_SAMPLES + 1U) / 2U))
#define CAL_GEOMETRY_REPLAY_COUNT     4U
#define CAL_GEOM_DONE_BROADCASTS      3U

#define BEACON_ID      CONFIG_UWB_BEACON_ID
#define BEACON_SLOT_ID CONFIG_UWB_BEACON_SLOT_ID
#define BEACON_FLAGS   CONFIG_UWB_BEACON_FLAGS

#define CAL_STORAGE_MAGIC   0x43414C31UL
#define CAL_STORAGE_VERSION 1U
#define CAL_STORAGE_ID      1U

#define MAX_DISCOVERED_SLAVES 8
#define MAX_TWR_SAMPLE_STORAGE 16
#define MAX_GEOMETRY_EDGES (((MAX_DISCOVERED_SLAVES + 1U) * MAX_DISCOVERED_SLAVES) / 2U)
#define LED_THREAD_STACK_SIZE 768
#define LED_THREAD_PRIORITY 7
#define UWB_ISR_STACK_SIZE 1536
#define UWB_ISR_PRIORITY   0

#if CAL_TWR_SAMPLES > MAX_TWR_SAMPLE_STORAGE
#error "Increase MAX_TWR_SAMPLE_STORAGE for CONFIG_UWB_CAL_TWR_SAMPLES"
#endif

#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);

#define LED_NODE DT_ALIAS(led0)
#if DT_NODE_HAS_STATUS(LED_NODE, okay)
#define HAVE_STATUS_LED 1
static const struct gpio_dt_spec status_led = GPIO_DT_SPEC_GET(LED_NODE, gpios);
#else
#define HAVE_STATUS_LED 0
#endif

enum led_mode {
    LED_MODE_OFF = 0,
    LED_MODE_FAST_BLINK = 1,
    LED_MODE_HEARTBEAT = 2,
    LED_MODE_DOUBLE_PULSE = 3,
    LED_MODE_SOLID = 4,
    LED_MODE_DEGRADED = 5,
    LED_MODE_FAULT = 6,
};

enum rx_wait_result {
    RX_WAIT_OK = 0,
    RX_WAIT_TIMEOUT = 1,
    RX_WAIT_ERROR = 2,
};

struct persisted_calibration {
    uint32_t magic;
    uint16_t version;
    uint8_t role;
    uint8_t beacon_id;
    uint8_t master_id;
    uint8_t slot_id;
    uint16_t reserved0;
    uint32_t schedule_hash;
    uint32_t roster_hash;
    int32_t sync_a_ppb;
    int64_t sync_b_rx_ticks;
    int64_t path_delay_ticks;
    int64_t fixed_tx_bias_ticks;
    uint32_t distance_mm;
    uint16_t range_samples;
    uint16_t sync_samples;
    uint16_t state_code;
    uint16_t reserved1;
};

struct sync_model {
    bool valid;
    bool have_origin;
    bool master_have_prev;
    bool local_have_prev;
    uint64_t master_prev_raw;
    uint64_t local_prev_raw;
    int64_t master_acc;
    int64_t local_acc;
    int64_t origin_master_ticks;
    int64_t origin_local_ticks;
    int64_t last_master_ticks;
    int64_t last_local_ticks;
    int64_t last_x_rel;
    uint32_t sample_count;
    double sum_x;
    double sum_y;
    double sum_xx;
    double sum_xy;
    double alpha;
    double beta_rx;
};

struct timing_calibration {
    bool path_delay_valid;
    bool cached_valid;
    int64_t path_delay_ticks;
    int64_t fixed_tx_bias_ticks;
    uint32_t distance_mm;
    uint32_t range_samples;
    uint32_t schedule_hash;
    uint32_t roster_hash;
    uint8_t master_id;
};

struct twr_samples {
    int64_t path_delay_ticks[MAX_TWR_SAMPLE_STORAGE];
    uint16_t distance_mm[MAX_TWR_SAMPLE_STORAGE];
    size_t count;
};

struct discovered_slave {
    uint8_t beacon_id;
    uint8_t slot_id;
    uint8_t last_state;
    uint16_t sync_samples;
    bool hello_seen;
    bool self_ready;
    bool delay_valid;
    int64_t path_delay_ticks;
    uint32_t distance_mm;
};

struct geometry_edge {
    uint8_t a_id;
    uint8_t b_id;
    struct twr_samples twr;
    bool valid;
    int64_t path_delay_ticks;
    uint32_t distance_mm;
};

struct slave_runtime {
    uint8_t state;
    struct sync_model sync;
    struct timing_calibration timing;
    struct twr_samples twr;
    uint8_t master_id;
    uint32_t roster_hash;
};

static struct k_sem sem_tx_done;
static uint64_t last_tx_ts;

static struct k_sem sem_rx_done;
static struct k_sem sem_rx_to;
static struct k_sem sem_rx_err;
static uint8_t rx_buf[128];
static uint16_t rx_len;
static uint64_t last_rx_ts;
static atomic_t rx_term_latched;
static atomic_t rx_term_drop_count;
static volatile uint32_t rx_term_status;

static const struct device *cdc_dev;
static volatile bool running = true;

static struct gpio_callback irq_cb;
static struct k_sem uwb_isr_sem;
static struct k_thread uwb_isr_thread;
K_THREAD_STACK_DEFINE(uwb_isr_stack, UWB_ISR_STACK_SIZE);
static atomic_t uwb_ready;

static atomic_t led_mode_atomic;
static struct k_thread led_thread;
K_THREAD_STACK_DEFINE(led_stack, LED_THREAD_STACK_SIZE);

static struct nvs_fs cal_fs;
static bool cal_store_ready;
static struct slave_runtime slave_runtime;
static struct geometry_edge geometry_edges_scratch[MAX_GEOMETRY_EDGES];

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

    *acc += (int64_t)((masked - *prev_raw) & TS40_MASK);
    *prev_raw = masked;
    return *acc;
}

static uint32_t get_sys_time_u32(void)
{
    uint8_t ts[4] = {0};
    dwt_readsystime(ts);
    return ((uint32_t)ts[3] << 24) | ((uint32_t)ts[2] << 16) |
           ((uint32_t)ts[1] << 8) | (uint32_t)ts[0];
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

static void sync_model_reset(struct sync_model *model)
{
    memset(model, 0, sizeof(*model));
    model->alpha = 1.0;
}

static bool sync_model_add_sample(struct sync_model *model, uint64_t master_raw, uint64_t local_raw)
{
    int64_t master_ticks = unwrap_ts40(master_raw, &model->master_prev_raw,
                                       &model->master_have_prev, &model->master_acc);
    int64_t local_ticks = unwrap_ts40(local_raw, &model->local_prev_raw,
                                      &model->local_have_prev, &model->local_acc);

    if (!model->have_origin) {
        model->have_origin = true;
        model->origin_master_ticks = master_ticks;
        model->origin_local_ticks = local_ticks;
        model->last_master_ticks = master_ticks;
        model->last_local_ticks = local_ticks;
        model->last_x_rel = 0;
        model->sample_count = 1;
        return false;
    }

    int64_t x_rel = master_ticks - model->origin_master_ticks;
    int64_t y_rel = local_ticks - model->origin_local_ticks;
    model->last_master_ticks = master_ticks;
    model->last_local_ticks = local_ticks;

    if (x_rel == model->last_x_rel) {
        return model->valid;
    }

    model->last_x_rel = x_rel;
    model->sample_count++;
    model->sum_x += (double)x_rel;
    model->sum_y += (double)y_rel;
    model->sum_xx += (double)x_rel * (double)x_rel;
    model->sum_xy += (double)x_rel * (double)y_rel;

    if (model->sample_count >= 2U) {
        double n = (double)model->sample_count;
        double denom = (n * model->sum_xx) - (model->sum_x * model->sum_x);
        if (denom != 0.0) {
            double alpha = ((n * model->sum_xy) - (model->sum_x * model->sum_y)) / denom;
            double beta_rel = (model->sum_y - (alpha * model->sum_x)) / n;
            model->alpha = alpha;
            model->beta_rx = (double)model->origin_local_ticks + beta_rel -
                             (alpha * (double)model->origin_master_ticks);
            model->valid = true;
        }
    }

    return model->valid;
}

static bool sync_model_predict_rx(const struct sync_model *model, uint64_t master_ticks,
                                  uint64_t *predicted_ticks)
{
    if (!model->valid) {
        return false;
    }

    double predicted = (model->alpha * (double)master_ticks) + model->beta_rx;
    if (predicted <= 0.0) {
        return false;
    }

    *predicted_ticks = (uint64_t)predicted;
    return true;
}

static bool sync_model_predict_tx(const struct sync_model *model, uint64_t master_ticks,
                                  const struct timing_calibration *timing,
                                  uint64_t *predicted_ticks)
{
    if (!model->valid || !timing->path_delay_valid) {
        return false;
    }

    double beta_tx = model->beta_rx - (double)timing->path_delay_ticks -
                     (double)timing->fixed_tx_bias_ticks;
    double predicted = (model->alpha * (double)master_ticks) + beta_tx;
    if (predicted <= 0.0) {
        return false;
    }

    *predicted_ticks = (uint64_t)predicted;
    return true;
}

static int32_t sync_model_alpha_ppb(const struct sync_model *model)
{
    double delta = (model->alpha - 1.0) * 1e9;
    if (delta > 2147483647.0) {
        delta = 2147483647.0;
    }
    if (delta < -2147483648.0) {
        delta = -2147483648.0;
    }
    return (int32_t)delta;
}

static void sample_sort_i64(int64_t *values, size_t count)
{
    for (size_t i = 1; i < count; ++i) {
        int64_t v = values[i];
        size_t j = i;
        while (j > 0 && values[j - 1] > v) {
            values[j] = values[j - 1];
            --j;
        }
        values[j] = v;
    }
}

static void sample_sort_u16(uint16_t *values, size_t count)
{
    for (size_t i = 1; i < count; ++i) {
        uint16_t v = values[i];
        size_t j = i;
        while (j > 0 && values[j - 1] > v) {
            values[j] = values[j - 1];
            --j;
        }
        values[j] = v;
    }
}

static int64_t median_i64(const int64_t *values, size_t count)
{
    int64_t scratch[MAX_TWR_SAMPLE_STORAGE];

    if (count == 0U) {
        return 0;
    }

    memcpy(scratch, values, count * sizeof(scratch[0]));
    sample_sort_i64(scratch, count);
    return scratch[count / 2U];
}

static uint16_t median_u16(const uint16_t *values, size_t count)
{
    uint16_t scratch[MAX_TWR_SAMPLE_STORAGE];

    if (count == 0U) {
        return 0U;
    }

    memcpy(scratch, values, count * sizeof(scratch[0]));
    sample_sort_u16(scratch, count);
    return scratch[count / 2U];
}

static struct geometry_edge *find_or_add_geometry_edge(struct geometry_edge *edges,
                                                       size_t *count,
                                                       uint8_t a_id, uint8_t b_id)
{
    uint8_t lo = MIN(a_id, b_id);
    uint8_t hi = MAX(a_id, b_id);

    for (size_t i = 0; i < *count; ++i) {
        if (edges[i].a_id == lo && edges[i].b_id == hi) {
            return &edges[i];
        }
    }

    if (*count >= MAX_GEOMETRY_EDGES) {
        return NULL;
    }

    struct geometry_edge *edge = &edges[*count];
    memset(edge, 0, sizeof(*edge));
    edge->a_id = lo;
    edge->b_id = hi;
    (*count)++;
    return edge;
}

static const struct geometry_edge *find_geometry_edge(const struct geometry_edge *edges,
                                                      size_t count,
                                                      uint8_t a_id, uint8_t b_id)
{
    uint8_t lo = MIN(a_id, b_id);
    uint8_t hi = MAX(a_id, b_id);

    for (size_t i = 0; i < count; ++i) {
        if (edges[i].a_id == lo && edges[i].b_id == hi) {
            return &edges[i];
        }
    }

    return NULL;
}

static void geometry_edge_append_sample(struct geometry_edge *edge,
                                        int64_t path_delay_ticks,
                                        uint16_t distance_mm)
{
    if (edge->twr.count < ARRAY_SIZE(edge->twr.path_delay_ticks)) {
        edge->twr.path_delay_ticks[edge->twr.count] = path_delay_ticks;
        edge->twr.distance_mm[edge->twr.count] = distance_mm;
        edge->twr.count++;
    } else {
        memmove(&edge->twr.path_delay_ticks[0], &edge->twr.path_delay_ticks[1],
                (ARRAY_SIZE(edge->twr.path_delay_ticks) - 1U) * sizeof(edge->twr.path_delay_ticks[0]));
        memmove(&edge->twr.distance_mm[0], &edge->twr.distance_mm[1],
                (ARRAY_SIZE(edge->twr.distance_mm) - 1U) * sizeof(edge->twr.distance_mm[0]));
        edge->twr.path_delay_ticks[ARRAY_SIZE(edge->twr.path_delay_ticks) - 1U] = path_delay_ticks;
        edge->twr.distance_mm[ARRAY_SIZE(edge->twr.distance_mm) - 1U] = distance_mm;
    }
    edge->path_delay_ticks = median_i64(edge->twr.path_delay_ticks, edge->twr.count);
    edge->distance_mm = median_u16(edge->twr.distance_mm, edge->twr.count);
    edge->valid = edge->twr.count >= CAL_TWR_MIN_VALID_SAMPLES;
}

static size_t geometry_expected_edge_count(size_t anchor_count)
{
    if (anchor_count < 2U) {
        return 0U;
    }
    return (anchor_count * (anchor_count - 1U)) / 2U;
}

static size_t geometry_count_valid_edges(const struct geometry_edge *edges, size_t count)
{
    size_t valid = 0U;

    for (size_t i = 0; i < count; ++i) {
        if (edges[i].valid) {
            valid++;
        }
    }

    return valid;
}

static size_t geometry_pair_sample_count(const struct geometry_edge *edges, size_t count,
                                         uint8_t a_id, uint8_t b_id)
{
    const struct geometry_edge *edge = find_geometry_edge(edges, count, a_id, b_id);

    return edge ? edge->twr.count : 0U;
}

static bool geometry_pair_needs_samples(const struct geometry_edge *edges, size_t count,
                                        uint8_t a_id, uint8_t b_id)
{
    return geometry_pair_sample_count(edges, count, a_id, b_id) < CAL_GEOMETRY_TARGET_SAMPLES;
}

static bool geometry_graph_needs_samples(const struct geometry_edge *edges, size_t count,
                                         const uint8_t *roster_ids, size_t roster_count)
{
    for (size_t i = 0; i < roster_count; ++i) {
        for (size_t j = i + 1U; j < roster_count; ++j) {
            if (geometry_pair_needs_samples(edges, count, roster_ids[i], roster_ids[j])) {
                return true;
            }
        }
    }

    return false;
}

static uint8_t geometry_status_from_edges(size_t anchor_count, size_t valid_edges)
{
    size_t expected = geometry_expected_edge_count(anchor_count);

    if (expected == 0U) {
        return UWB_GEOM_STATUS_FAILED;
    }
    if (valid_edges >= expected) {
        return UWB_GEOM_STATUS_OK;
    }
    if (valid_edges > 0U) {
        return UWB_GEOM_STATUS_PARTIAL;
    }
    return UWB_GEOM_STATUS_FAILED;
}

static void geometry_log_missing_pairs(const struct geometry_edge *edges, size_t count,
                                       const uint8_t *roster_ids, size_t roster_count)
{
    for (size_t i = 0; i < roster_count; ++i) {
        for (size_t j = i + 1U; j < roster_count; ++j) {
            const struct geometry_edge *edge =
                find_geometry_edge(edges, count, roster_ids[i], roster_ids[j]);
            size_t samples = edge ? edge->twr.count : 0U;

            if (samples < CAL_TWR_MIN_VALID_SAMPLES) {
                printk("CAL: geometry missing a=%u b=%u samples=%u target=%u\n",
                       roster_ids[i], roster_ids[j],
                       (unsigned int)samples,
                       (unsigned int)CAL_GEOMETRY_TARGET_SAMPLES);
            }
        }
    }
}

static uint32_t ticks_to_distance_mm(int64_t ticks)
{
    if (ticks <= 0) {
        return 0U;
    }

    double distance_mm = ((double)ticks * C_AIR_M_PER_S * 1000.0) / DWT_TICK_HZ;
    if (distance_mm < 0.0) {
        distance_mm = 0.0;
    }
    if (distance_mm > 65535.0) {
        distance_mm = 65535.0;
    }
    return (uint32_t)distance_mm;
}

static uint32_t fnv1a32_update(uint32_t hash, const void *data, size_t len)
{
    const uint8_t *bytes = (const uint8_t *)data;
    for (size_t i = 0; i < len; ++i) {
        hash ^= bytes[i];
        hash *= 16777619U;
    }
    return hash;
}

static uint32_t compute_schedule_hash(void)
{
    uint32_t hash = 2166136261U;
    uint32_t values[] = {
        SUPERFRAME_UUS,
        SLOT_START_UUS,
        SLOT_UUS,
        TX_GUARD_UUS,
        TX_START_DELAY_UUS,
        (uint32_t)BEACON_SLOT_ID,
    };

    hash = fnv1a32_update(hash, values, sizeof(values));
    return hash;
}

static uint32_t compute_roster_hash(const uint8_t *ids, size_t count)
{
    uint8_t scratch[MAX_DISCOVERED_SLAVES + 1];

    if (count > ARRAY_SIZE(scratch)) {
        count = ARRAY_SIZE(scratch);
    }

    memcpy(scratch, ids, count);
    for (size_t i = 1; i < count; ++i) {
        uint8_t v = scratch[i];
        size_t j = i;
        while (j > 0 && scratch[j - 1] > v) {
            scratch[j] = scratch[j - 1];
            --j;
        }
        scratch[j] = v;
    }

    return fnv1a32_update(2166136261U, scratch, count);
}

static bool cal_store_init(void)
{
#if !IS_ENABLED(CONFIG_UWB_CAL_PERSISTENCE)
    printk("NVS: persistence disabled\n");
    return false;
#else
    struct flash_pages_info info;

    printk("NVS: init start\n");
    cal_fs.flash_device = FIXED_PARTITION_DEVICE(storage_partition);
    if (!device_is_ready(cal_fs.flash_device)) {
        printk("NVS: flash device not ready\n");
        return false;
    }

    cal_fs.offset = FIXED_PARTITION_OFFSET(storage_partition);
    if (flash_get_page_info_by_offs(cal_fs.flash_device, cal_fs.offset, &info) != 0) {
        printk("NVS: page info failed\n");
        return false;
    }

    cal_fs.sector_size = info.size;
    cal_fs.sector_count = 3U;

    if (nvs_mount(&cal_fs) != 0) {
        printk("NVS: mount failed\n");
        return false;
    }

    cal_store_ready = true;
    printk("NVS: init ok\n");
    return true;
#endif
}

static bool load_persisted_calibration(struct persisted_calibration *blob)
{
    if (!cal_store_ready) {
        return false;
    }

    int rc = nvs_read(&cal_fs, CAL_STORAGE_ID, blob, sizeof(*blob));
    if (rc != (int)sizeof(*blob)) {
        return false;
    }

    if (blob->magic != CAL_STORAGE_MAGIC || blob->version != CAL_STORAGE_VERSION) {
        return false;
    }

    return true;
}

static void save_persisted_calibration(const struct persisted_calibration *blob)
{
    if (!cal_store_ready) {
        return;
    }

    (void)nvs_write(&cal_fs, CAL_STORAGE_ID, blob, sizeof(*blob));
}

static struct persisted_calibration make_persisted_blob(const struct slave_runtime *runtime,
                                                        uint8_t state_code)
{
    struct persisted_calibration blob = {0};

    blob.magic = CAL_STORAGE_MAGIC;
    blob.version = CAL_STORAGE_VERSION;
    blob.role =
#if defined(CONFIG_ROLE_MASTER_ANCHOR)
        1U;
#else
        2U;
#endif
    blob.beacon_id = BEACON_ID;
    blob.master_id = runtime->timing.master_id;
    blob.slot_id = BEACON_SLOT_ID;
    blob.schedule_hash = runtime->timing.schedule_hash;
    blob.roster_hash = runtime->timing.roster_hash;
    blob.sync_a_ppb = sync_model_alpha_ppb(&runtime->sync);
    blob.sync_b_rx_ticks = (int64_t)runtime->sync.beta_rx;
    blob.path_delay_ticks = runtime->timing.path_delay_ticks;
    blob.fixed_tx_bias_ticks = runtime->timing.fixed_tx_bias_ticks;
    blob.distance_mm = runtime->timing.distance_mm;
    blob.range_samples = (uint16_t)runtime->timing.range_samples;
    blob.sync_samples = (uint16_t)runtime->sync.sample_count;
    blob.state_code = state_code;
    return blob;
}

static void persist_runtime_calibration(const struct slave_runtime *runtime, uint8_t state_code)
{
    struct persisted_calibration blob = make_persisted_blob(runtime, state_code);
    save_persisted_calibration(&blob);
}

static void apply_cached_timing_if_valid(struct slave_runtime *runtime)
{
    struct persisted_calibration blob;

    if (!load_persisted_calibration(&blob)) {
        return;
    }

    if (blob.beacon_id != BEACON_ID || blob.slot_id != BEACON_SLOT_ID) {
        return;
    }

    if (blob.schedule_hash != compute_schedule_hash()) {
        return;
    }

    runtime->timing.cached_valid = true;
    runtime->timing.path_delay_valid = true;
    runtime->timing.path_delay_ticks = blob.path_delay_ticks;
    runtime->timing.fixed_tx_bias_ticks = blob.fixed_tx_bias_ticks;
    runtime->timing.distance_mm = blob.distance_mm;
    runtime->timing.range_samples = blob.range_samples;
    runtime->timing.schedule_hash = blob.schedule_hash;
    runtime->timing.roster_hash = blob.roster_hash;
    runtime->timing.master_id = blob.master_id;
}

static void led_write(bool on)
{
#if HAVE_STATUS_LED
    (void)gpio_pin_set_dt(&status_led, on ? 1 : 0);
#else
    ARG_UNUSED(on);
#endif
}

static void led_thread_fn(void *arg1, void *arg2, void *arg3)
{
    ARG_UNUSED(arg1);
    ARG_UNUSED(arg2);
    ARG_UNUSED(arg3);

    while (1) {
        bool on = false;
        uint32_t phase = (uint32_t)(k_uptime_get() % 2000LL);
        int mode = atomic_get(&led_mode_atomic);

        switch (mode) {
        case LED_MODE_FAST_BLINK:
            on = ((phase / 120U) % 2U) == 0U;
            break;
        case LED_MODE_HEARTBEAT:
            on = phase < 160U;
            break;
        case LED_MODE_DOUBLE_PULSE:
            on = (phase < 120U) || (phase >= 240U && phase < 360U);
            break;
        case LED_MODE_SOLID:
            on = true;
            break;
        case LED_MODE_DEGRADED:
            on = phase < 600U;
            break;
        case LED_MODE_FAULT:
            on = (phase < 100U) ||
                 (phase >= 180U && phase < 280U) ||
                 (phase >= 360U && phase < 460U) ||
                 (phase >= 540U && phase < 640U);
            break;
        default:
            on = false;
            break;
        }

        led_write(on);
        k_msleep(50);
    }
}

static void set_led_mode(uint8_t state_code)
{
    int led_mode = LED_MODE_OFF;

    switch (state_code) {
    case UWB_ANCHOR_STATE_BOOT:
    case UWB_ANCHOR_STATE_DISCOVERY:
        led_mode = LED_MODE_FAST_BLINK;
        break;
    case UWB_ANCHOR_STATE_TWR_GRAPH:
    case UWB_ANCHOR_STATE_CLOCK_CAL:
        led_mode = LED_MODE_HEARTBEAT;
        break;
    case UWB_ANCHOR_STATE_SELF_READY:
        led_mode = LED_MODE_DOUBLE_PULSE;
        break;
    case UWB_ANCHOR_STATE_NETWORK_READY:
    case UWB_ANCHOR_STATE_LOCALIZE:
        led_mode = LED_MODE_SOLID;
        break;
    case UWB_ANCHOR_STATE_DEGRADED:
        led_mode = LED_MODE_DEGRADED;
        break;
    case UWB_ANCHOR_STATE_FAULT:
        led_mode = LED_MODE_FAULT;
        break;
    default:
        led_mode = LED_MODE_OFF;
        break;
    }

    atomic_set(&led_mode_atomic, led_mode);
}

static void init_status_led(void)
{
#if HAVE_STATUS_LED
    if (device_is_ready(status_led.port)) {
        (void)gpio_pin_configure_dt(&status_led, GPIO_OUTPUT_INACTIVE);
    }
#endif

    atomic_set(&led_mode_atomic, LED_MODE_OFF);
    k_thread_create(&led_thread, led_stack, LED_THREAD_STACK_SIZE,
                    led_thread_fn, NULL, NULL, NULL,
                    LED_THREAD_PRIORITY, 0, K_NO_WAIT);
}

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
                printk("[console] start\n");
            }
        } else if (c == 'p' || c == 'P') {
            if (running) {
                running = false;
                printk("[console] pause\n");
            }
        }
    }
}

static void usb_ready_wait(void)
{
    const int dtr_poll_count = 60;

    (void)usb_enable(NULL);

    cdc_dev = DEVICE_DT_GET(DT_NODELABEL(cdc_acm_uart0));
    for (int i = 0; i < 20 && !device_is_ready(cdc_dev); ++i) {
        k_msleep(100);
    }

    if (!cdc_dev || !device_is_ready(cdc_dev)) {
        return;
    }

    /*
     * The headless beacon should not block forever on a host terminal, but
     * rushing straight into DW3000 init can prevent CDC ACM from finishing
     * enumeration on macOS. Wait briefly for DTR; if no host opens the port,
     * continue in headless mode after the timeout.
     */
    for (int i = 0; i < dtr_poll_count; ++i) {
        if (usb_console_dtr_asserted()) {
            k_msleep(50);
            return;
        }
        k_msleep(50);
    }

    k_msleep(200);
}

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

static int dw3110_radio_init(void)
{
    bool idle_rc_ready = false;

    dw_port_reset_assert();
    k_msleep(2);
    dw_port_reset_deassert();
    k_msleep(5);

    printk("DW init: probing\n");
    if (dwt_probe((struct dwt_probe_s *)&dw3000_probe_interf) < 0) {
        printk("DW init: probe failed\n");
        return -EIO;
    }

    printk("DW init: probe ok, waiting for IDLE_RC\n");
    for (int i = 0; i < 20000; ++i) {
        if (dwt_checkidlerc()) {
            idle_rc_ready = true;
            break;
        }
        k_busy_wait(50);
    }
    if (!idle_rc_ready) {
        printk("DW init: IDLE_RC timeout\n");
        return -ETIMEDOUT;
    }

    printk("DW init: IDLE_RC ok, initializing\n");
    if (dwt_initialise(DWT_READ_OTP_ALL) != DWT_SUCCESS) {
        printk("DW init: initialise failed\n");
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
        printk("DW init: configure failed\n");
        return -EIO;
    }

    dwt_setrxantennadelay((uint16_t)RX_ANT_DLY);
    dwt_settxantennadelay((uint16_t)TX_ANT_DLY);
    dwt_configureframefilter(DWT_FF_DISABLE, 0);
    dwt_setlnapamode(DWT_LNA_ENABLE | DWT_PA_ENABLE);

    uint32_t int_mask = DWT_INT_TXFRS_BIT_MASK |
                        DWT_INT_RXFCG_BIT_MASK |
                        SYS_STATUS_ALL_RX_ERR |
                        SYS_STATUS_ALL_RX_TO;
    dwt_setinterrupt(int_mask, 0, DWT_ENABLE_INT);

    dwt_callbacks_s cbs = {0};
    cbs.cbTxDone = on_tx_done;
    cbs.cbRxOk = on_rx_ok;
    cbs.cbRxTo = on_rx_to;
    cbs.cbRxErr = on_rx_err;
    dwt_setcallbacks(&cbs);
    atomic_set(&uwb_ready, 1);
    dwt_isr();
    printk("DW init: ready\n");
    return 0;
}

static void drain_sem_nonblocking(struct k_sem *sem)
{
    while (k_sem_take(sem, K_NO_WAIT) == 0) {
    }
}

static void drain_all_rx_sems(void)
{
    drain_sem_nonblocking(&sem_rx_done);
    drain_sem_nonblocking(&sem_rx_err);
    drain_sem_nonblocking(&sem_rx_to);
}

static bool arm_immediate_rx(uint32_t timeout_uus)
{
    drain_all_rx_sems();
    dwt_setpreambledetecttimeout(0);
    dwt_setrxtimeout(timeout_uus);
    rx_term_arm();
    if (dwt_rxenable(DWT_START_RX_IMMEDIATE) != DWT_SUCCESS) {
        dwt_forcetrxoff();
        return false;
    }
    return true;
}

static enum rx_wait_result wait_for_rx_event(uint32_t timeout_ms, uint32_t *status_out)
{
    struct k_poll_event rx_events[3];

    k_poll_event_init(&rx_events[0], K_POLL_TYPE_SEM_AVAILABLE,
                      K_POLL_MODE_NOTIFY_ONLY, &sem_rx_done);
    k_poll_event_init(&rx_events[1], K_POLL_TYPE_SEM_AVAILABLE,
                      K_POLL_MODE_NOTIFY_ONLY, &sem_rx_err);
    k_poll_event_init(&rx_events[2], K_POLL_TYPE_SEM_AVAILABLE,
                      K_POLL_MODE_NOTIFY_ONLY, &sem_rx_to);

    (void)k_poll(rx_events, 3, K_MSEC(timeout_ms));

    if (k_sem_take(&sem_rx_done, K_NO_WAIT) == 0) {
        if (status_out) {
            *status_out = rx_term_status;
        }
        return RX_WAIT_OK;
    }

    if (k_sem_take(&sem_rx_err, K_NO_WAIT) == 0) {
        if (status_out) {
            *status_out = rx_term_status;
        }
        return RX_WAIT_ERROR;
    }

    if (k_sem_take(&sem_rx_to, K_NO_WAIT) == 0) {
        if (status_out) {
            *status_out = rx_term_status;
        }
        return RX_WAIT_TIMEOUT;
    }

    if (status_out) {
        *status_out = 0U;
    }
    return RX_WAIT_TIMEOUT;
}

static bool wait_for_matching_cal_frame(uint8_t msg_type, uint8_t src_id, uint8_t dst_id,
                                        uint16_t seq, uint32_t timeout_ms,
                                        struct uwb_cal_frame *matched,
                                        uint64_t *matched_rx_ts)
{
    int64_t deadline = k_uptime_get() + timeout_ms;

    while (k_uptime_get() < deadline) {
        uint32_t status = 0U;
        enum rx_wait_result result = wait_for_rx_event((uint32_t)MAX(1LL, deadline - k_uptime_get()),
                                                       &status);
        if (result != RX_WAIT_OK) {
            dwt_forcetrxoff();
            if (result == RX_WAIT_TIMEOUT) {
                return false;
            }
            if (k_uptime_get() < deadline && !arm_immediate_rx(CAL_RX_TIMEOUT_UUS)) {
                return false;
            }
            continue;
        }

        struct uwb_cal_frame frame;
        if (!uwb_cal_unpack(rx_buf, rx_len, &frame)) {
            dwt_forcetrxoff();
            if (k_uptime_get() < deadline && !arm_immediate_rx(CAL_RX_TIMEOUT_UUS)) {
                return false;
            }
            continue;
        }

        if (frame.msg_type != msg_type || frame.seq != seq) {
            dwt_forcetrxoff();
            if (k_uptime_get() < deadline && !arm_immediate_rx(CAL_RX_TIMEOUT_UUS)) {
                return false;
            }
            continue;
        }
        if (src_id != UWB_BROADCAST_ID && frame.src_id != src_id) {
            dwt_forcetrxoff();
            if (k_uptime_get() < deadline && !arm_immediate_rx(CAL_RX_TIMEOUT_UUS)) {
                return false;
            }
            continue;
        }
        if (dst_id != UWB_BROADCAST_ID && frame.dst_id != dst_id) {
            dwt_forcetrxoff();
            if (k_uptime_get() < deadline && !arm_immediate_rx(CAL_RX_TIMEOUT_UUS)) {
                return false;
            }
            continue;
        }

        if (matched) {
            *matched = frame;
        }
        if (matched_rx_ts) {
            *matched_rx_ts = last_rx_ts;
        }
        dwt_forcetrxoff();
        return true;
    }

    dwt_forcetrxoff();
    return false;
}

static bool receive_matching_cal_frame(uint8_t msg_type, uint8_t src_id, uint8_t dst_id,
                                       uint16_t seq, uint32_t timeout_ms,
                                       struct uwb_cal_frame *matched,
                                       uint64_t *matched_rx_ts)
{
    if (!arm_immediate_rx(CAL_RX_TIMEOUT_UUS)) {
        return false;
    }
    return wait_for_matching_cal_frame(msg_type, src_id, dst_id, seq,
                                       timeout_ms, matched, matched_rx_ts);
}

static bool start_delayed_tx(const uint8_t *tx_buf, size_t len, uint32_t dx_time,
                             const char *tag, uint16_t seq,
                             uint32_t *tx_ok, uint32_t *tx_late, uint32_t *tx_timeout,
                             uint8_t tx_mode, uint32_t rx_after_tx_delay_uus,
                             uint32_t rx_after_tx_timeout_uus);

static bool send_cal_frame_after_uus(const struct uwb_cal_frame *frame, uint32_t delay_uus,
                                     const char *tag, uint32_t *tx_ok,
                                     uint32_t *tx_late, uint32_t *tx_timeout,
                                     uint8_t tx_mode,
                                     uint32_t rx_after_tx_delay_uus,
                                     uint32_t rx_after_tx_timeout_uus);

static bool run_geometry_pair_initiator(uint8_t initiator_id, uint8_t responder_id,
                                        uint8_t initiator_slot_id,
                                        uint16_t seq, uint8_t sample_idx,
                                        uint32_t roster_hash,
                                        uint32_t *tx_ok, uint32_t *tx_late,
                                        uint32_t *tx_timeout,
                                        struct uwb_cal_frame *matched_report)
{
    struct uwb_cal_frame poll = {
        .frame_type = UWB_FRAME_TYPE_CAL,
        .msg_type = UWB_CAL_MSG_TWR_POLL,
        .src_id = initiator_id,
        .dst_id = responder_id,
        .seq = seq,
        .slot_id = sample_idx,
        .flags = UWB_CAL_FLAG_GEOMETRY,
        .value16 = initiator_slot_id,
        .ts_a = roster_hash,
        .ts_b = 0U,
        .ts_c = 0U,
    };

    if (!send_cal_frame_after_uus(&poll, CAL_CONTROL_TX_DELAY_UUS, "CAL_PAIR_POLL",
                                  tx_ok, tx_late, tx_timeout,
                                  DWT_START_TX_DELAYED, 0U, 0U)) {
        return false;
    }

    struct uwb_cal_frame resp;
    uint64_t resp_rx_ts = 0U;
    if (!receive_matching_cal_frame(UWB_CAL_MSG_TWR_RESP, responder_id, initiator_id,
                                    seq, CAL_WAIT_MS, &resp, &resp_rx_ts)) {
        return false;
    }

    uint32_t final_tx_time =
        (uint32_t)((resp_rx_ts +
                   ((uint64_t)CAL_RESP_RX_TO_FINAL_TX_DLY_UUS * UUS_TO_DWT_TIME)) >> 8);
    final_tx_time = guard_tx_time(final_tx_time, get_sys_time_u32(),
                                  uus_to_dx_time(TX_GUARD_UUS), 0U);
    uint64_t final_tx_ts =
        (((uint64_t)(final_tx_time & 0xFFFFFFFEUL)) << 8) + (uint64_t)TX_ANT_DLY;
    struct uwb_cal_frame final = {
        .frame_type = UWB_FRAME_TYPE_CAL,
        .msg_type = UWB_CAL_MSG_TWR_FINAL,
        .src_id = initiator_id,
        .dst_id = responder_id,
        .seq = seq,
        .slot_id = sample_idx,
        .flags = UWB_CAL_FLAG_GEOMETRY,
        .value16 = initiator_slot_id,
        .ts_a = last_tx_ts,
        .ts_b = resp_rx_ts,
        .ts_c = final_tx_ts,
    };
    uint8_t final_buf[UWB_CAL_FRAME_LEN];
    uwb_cal_pack(final_buf, &final);

    if (!start_delayed_tx(final_buf, sizeof(final_buf),
                          quantize_delayed_time(final_tx_time),
                          "CAL_PAIR_FINAL", seq, tx_ok, tx_late, tx_timeout,
                          DWT_START_TX_DELAYED, 0U, 0U)) {
        return false;
    }

    return receive_matching_cal_frame(UWB_CAL_MSG_PAIR_REPORT, initiator_id, responder_id,
                                      seq, CAL_WAIT_MS * 2U, matched_report, NULL);
}

#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
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

static bool start_delayed_tx(const uint8_t *tx_buf, size_t len, uint32_t dx_time,
                             const char *tag, uint16_t seq,
                             uint32_t *tx_ok, uint32_t *tx_late, uint32_t *tx_timeout,
                             uint8_t tx_mode, uint32_t rx_after_tx_delay_uus,
                             uint32_t rx_after_tx_timeout_uus)
{
    if (dwt_writetxdata(len, (uint8_t *)tx_buf, 0) != DWT_SUCCESS) {
        printk("%s: TX data write failed (seq=%u)\n", tag, seq);
        dwt_forcetrxoff();
        return false;
    }
    dwt_writetxfctrl(len + FCS_LEN, 0, 1);

    k_sem_reset(&sem_tx_done);
    dwt_writesysstatuslo(DWT_INT_TXFRS_BIT_MASK);
    dwt_setdelayedtrxtime(dx_time);

    if ((tx_mode & DWT_RESPONSE_EXPECTED) != 0U) {
        drain_all_rx_sems();
        dwt_setrxaftertxdelay(rx_after_tx_delay_uus);
        dwt_setrxtimeout(rx_after_tx_timeout_uus);
    } else {
        dwt_setrxaftertxdelay(0U);
    }

    if (dwt_starttx(tx_mode) == DWT_ERROR) {
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
            printk("%s: TX timeout (seq=%u timeout=%u)\n", tag, seq, *tx_timeout);
            dwt_forcetrxoff();
            return false;
        }
    }

    (*tx_ok)++;
    return true;
}

static bool send_cal_frame_after_uus(const struct uwb_cal_frame *frame, uint32_t delay_uus,
                                     const char *tag, uint32_t *tx_ok,
                                     uint32_t *tx_late, uint32_t *tx_timeout,
                                     uint8_t tx_mode,
                                     uint32_t rx_after_tx_delay_uus,
                                     uint32_t rx_after_tx_timeout_uus)
{
    uint8_t tx_buf[UWB_CAL_FRAME_LEN];
    uint32_t now = get_sys_time_u32();
    uint32_t target_dtu = now + uus_to_dx_time(delay_uus);
    target_dtu = guard_tx_time(target_dtu, now, uus_to_dx_time(TX_GUARD_UUS), 0U);
    target_dtu = quantize_delayed_time(target_dtu);
    uwb_cal_pack(tx_buf, frame);
    return start_delayed_tx(tx_buf, sizeof(tx_buf), target_dtu, tag, frame->seq,
                            tx_ok, tx_late, tx_timeout, tx_mode,
                            rx_after_tx_delay_uus, rx_after_tx_timeout_uus);
}

static void on_state_change(uint8_t state_code)
{
    set_led_mode(state_code);
    printk("STATE: %u\n", state_code);
}

#if defined(CONFIG_ROLE_SLAVE_ANCHOR)
static bool compute_twr_tof_ticks(const struct uwb_cal_frame *final_frame,
                                  uint64_t poll_rx_ts, uint64_t resp_tx_ts,
                                  uint64_t final_rx_ts, int64_t *tof_ticks)
{
    uint32_t poll_tx_ts_32 = (uint32_t)final_frame->ts_a;
    uint32_t resp_rx_ts_32 = (uint32_t)final_frame->ts_b;
    uint32_t final_tx_ts_32 = (uint32_t)final_frame->ts_c;
    uint32_t poll_rx_ts_32 = (uint32_t)poll_rx_ts;
    uint32_t resp_tx_ts_32 = (uint32_t)resp_tx_ts;
    uint32_t final_rx_ts_32 = (uint32_t)final_rx_ts;

    double ra = (double)(resp_rx_ts_32 - poll_tx_ts_32);
    double rb = (double)(final_rx_ts_32 - resp_tx_ts_32);
    double da = (double)(final_tx_ts_32 - resp_rx_ts_32);
    double db = (double)(resp_tx_ts_32 - poll_rx_ts_32);
    double denom = ra + rb + da + db;

    if (denom <= 0.0) {
        return false;
    }

    double tof = ((ra * rb) - (da * db)) / denom;
    if (tof <= 0.0) {
        return false;
    }

    *tof_ticks = (int64_t)tof;
    return true;
}

static void twr_samples_append(struct twr_samples *samples, int64_t path_delay_ticks,
                               uint16_t distance_mm)
{
    if (samples->count < ARRAY_SIZE(samples->path_delay_ticks)) {
        samples->path_delay_ticks[samples->count] = path_delay_ticks;
        samples->distance_mm[samples->count] = distance_mm;
        samples->count++;
    } else {
        memmove(&samples->path_delay_ticks[0], &samples->path_delay_ticks[1],
                (ARRAY_SIZE(samples->path_delay_ticks) - 1U) * sizeof(samples->path_delay_ticks[0]));
        memmove(&samples->distance_mm[0], &samples->distance_mm[1],
                (ARRAY_SIZE(samples->distance_mm) - 1U) * sizeof(samples->distance_mm[0]));
        samples->path_delay_ticks[ARRAY_SIZE(samples->path_delay_ticks) - 1U] = path_delay_ticks;
        samples->distance_mm[ARRAY_SIZE(samples->distance_mm) - 1U] = distance_mm;
    }
}

static void refresh_timing_from_samples(struct slave_runtime *runtime)
{
    if (runtime->twr.count == 0U) {
        return;
    }

    runtime->timing.path_delay_ticks = median_i64(runtime->twr.path_delay_ticks, runtime->twr.count);
    runtime->timing.distance_mm = median_u16(runtime->twr.distance_mm, runtime->twr.count);
    runtime->timing.range_samples = (uint32_t)runtime->twr.count;
    runtime->timing.path_delay_valid = runtime->twr.count >= CAL_TWR_MIN_VALID_SAMPLES;
}

static void send_slave_hello(uint8_t master_id, uint16_t seq,
                             uint32_t *tx_ok, uint32_t *tx_late, uint32_t *tx_timeout)
{
    struct uwb_cal_frame hello = {
        .frame_type = UWB_FRAME_TYPE_CAL,
        .msg_type = UWB_CAL_MSG_HELLO,
        .src_id = BEACON_ID,
        .dst_id = master_id,
        .seq = seq,
        .slot_id = BEACON_SLOT_ID,
        .flags = 0U,
        .value16 = 0U,
        .ts_a = compute_schedule_hash(),
        .ts_b = 0U,
        .ts_c = 0U,
    };

    (void)send_cal_frame_after_uus(&hello,
                                   CAL_DISCOVERY_RESP_BASE_UUS +
                                   ((uint32_t)BEACON_SLOT_ID * CAL_DISCOVERY_RESP_SLOT_UUS),
                                   "CAL_HELLO", tx_ok, tx_late, tx_timeout,
                                   DWT_START_TX_DELAYED, 0U, 0U);
}

static void send_slave_status(const struct slave_runtime *runtime, uint8_t master_id, uint16_t seq,
                              uint32_t *tx_ok, uint32_t *tx_late, uint32_t *tx_timeout)
{
    struct uwb_cal_frame status = {
        .frame_type = UWB_FRAME_TYPE_CAL,
        .msg_type = UWB_CAL_MSG_STATUS,
        .src_id = BEACON_ID,
        .dst_id = master_id,
        .seq = seq,
        .slot_id = BEACON_SLOT_ID,
        .flags = runtime->state,
        .value16 = (uint16_t)MIN(runtime->sync.sample_count, 0xFFFFU),
        .ts_a = (uint64_t)runtime->timing.path_delay_ticks,
        .ts_b = runtime->timing.schedule_hash,
        .ts_c = runtime->timing.roster_hash,
    };

    (void)send_cal_frame_after_uus(&status,
                                   CAL_STATUS_RESP_BASE_UUS +
                                   ((uint32_t)BEACON_SLOT_ID * CAL_STATUS_RESP_SLOT_UUS),
                                   "CAL_STATUS", tx_ok, tx_late, tx_timeout,
                                   DWT_START_TX_DELAYED, 0U, 0U);
}

static void send_twr_report(const struct slave_runtime *runtime, uint8_t master_id, uint16_t seq,
                            uint32_t *tx_ok, uint32_t *tx_late, uint32_t *tx_timeout)
{
    struct uwb_cal_frame report = {
        .frame_type = UWB_FRAME_TYPE_CAL,
        .msg_type = UWB_CAL_MSG_TWR_REPORT,
        .src_id = BEACON_ID,
        .dst_id = master_id,
        .seq = seq,
        .slot_id = BEACON_SLOT_ID,
        .flags = runtime->timing.path_delay_valid ? 1U : 0U,
        .value16 = (uint16_t)MIN(runtime->timing.distance_mm, 65535U),
        .ts_a = (uint64_t)runtime->timing.path_delay_ticks,
        .ts_b = runtime->timing.range_samples,
        .ts_c = 0U,
    };

    (void)send_cal_frame_after_uus(&report, CAL_CONTROL_TX_DELAY_UUS, "CAL_TWR_REP",
                                   tx_ok, tx_late, tx_timeout,
                                   DWT_START_TX_DELAYED, 0U, 0U);
}

static void send_pair_report(uint8_t initiator_id, uint8_t responder_id,
                             uint16_t seq, uint8_t sample_idx,
                             uint32_t roster_hash, int64_t path_delay_ticks,
                             uint16_t distance_mm, bool valid,
                             uint32_t *tx_ok, uint32_t *tx_late, uint32_t *tx_timeout)
{
    struct uwb_cal_frame report = {
        .frame_type = UWB_FRAME_TYPE_CAL,
        .msg_type = UWB_CAL_MSG_PAIR_REPORT,
        .src_id = initiator_id,
        .dst_id = responder_id,
        .seq = seq,
        .slot_id = sample_idx,
        .flags = valid ? 1U : 0U,
        .value16 = distance_mm,
        .ts_a = (uint64_t)path_delay_ticks,
        .ts_b = roster_hash,
        .ts_c = 0U,
    };

    (void)send_cal_frame_after_uus(&report, CAL_CONTROL_TX_DELAY_UUS, "CAL_PAIR_REP",
                                   tx_ok, tx_late, tx_timeout,
                                   DWT_START_TX_DELAYED, 0U, 0U);
}

static bool handle_slave_twr_poll(struct slave_runtime *runtime, const struct uwb_cal_frame *poll_frame,
                                  uint32_t *tx_ok, uint32_t *tx_late, uint32_t *tx_timeout)
{
    bool geometry_mode = (poll_frame->flags & UWB_CAL_FLAG_GEOMETRY) != 0U;

    if (poll_frame->dst_id != BEACON_ID) {
        return false;
    }

    runtime->state = UWB_ANCHOR_STATE_TWR_GRAPH;
    on_state_change(runtime->state);

    uint64_t poll_rx_ts = last_rx_ts;
    uint32_t resp_tx_time = (uint32_t)((poll_rx_ts +
                               ((uint64_t)CAL_POLL_RX_TO_RESP_TX_DLY_UUS * UUS_TO_DWT_TIME)) >> 8);
    resp_tx_time = guard_tx_time(resp_tx_time, get_sys_time_u32(),
                                 uus_to_dx_time(TX_GUARD_UUS), 0U);
    uint64_t expected_resp_tx_ts =
        (((uint64_t)(resp_tx_time & 0xFFFFFFFEUL)) << 8) + (uint64_t)TX_ANT_DLY;

    struct uwb_cal_frame resp = {
        .frame_type = UWB_FRAME_TYPE_CAL,
        .msg_type = UWB_CAL_MSG_TWR_RESP,
        .src_id = BEACON_ID,
        .dst_id = poll_frame->src_id,
        .seq = poll_frame->seq,
        .slot_id = BEACON_SLOT_ID,
        .flags = 0U,
        .value16 = 0U,
        .ts_a = poll_rx_ts,
        .ts_b = expected_resp_tx_ts,
        .ts_c = 0U,
    };
    uint8_t tx_buf[UWB_CAL_FRAME_LEN];
    uwb_cal_pack(tx_buf, &resp);

    if (!start_delayed_tx(tx_buf, sizeof(tx_buf), quantize_delayed_time(resp_tx_time),
                          "CAL_TWR_RESP", resp.seq, tx_ok, tx_late, tx_timeout,
                          DWT_START_TX_DELAYED, 0U, 0U)) {
        return false;
    }

    struct uwb_cal_frame final_frame;
    uint64_t final_rx_ts = 0U;
    if (!receive_matching_cal_frame(UWB_CAL_MSG_TWR_FINAL, poll_frame->src_id, BEACON_ID,
                                    poll_frame->seq, CAL_WAIT_MS, &final_frame, &final_rx_ts)) {
        printk("CAL: TWR final timeout seq=%u\n", poll_frame->seq);
        return false;
    }

    int64_t tof_ticks = 0;
    if (!compute_twr_tof_ticks(&final_frame, poll_rx_ts, last_tx_ts, final_rx_ts, &tof_ticks)) {
        return false;
    }

    if (geometry_mode) {
        send_pair_report(poll_frame->src_id, BEACON_ID, poll_frame->seq, poll_frame->slot_id,
                         (uint32_t)poll_frame->ts_a, tof_ticks,
                         (uint16_t)ticks_to_distance_mm(tof_ticks), true,
                         tx_ok, tx_late, tx_timeout);
        return true;
    }

    twr_samples_append(&runtime->twr, tof_ticks, (uint16_t)ticks_to_distance_mm(tof_ticks));
    refresh_timing_from_samples(runtime);
    runtime->timing.master_id = poll_frame->src_id;
    runtime->timing.schedule_hash = compute_schedule_hash();
    runtime->state = runtime->timing.path_delay_valid ?
                     UWB_ANCHOR_STATE_CLOCK_CAL : UWB_ANCHOR_STATE_TWR_GRAPH;
    on_state_change(runtime->state);
    send_twr_report(runtime, poll_frame->src_id, poll_frame->seq,
                    tx_ok, tx_late, tx_timeout);
    return true;
}

static bool handle_slave_pair_plan(struct slave_runtime *runtime, const struct uwb_cal_frame *plan_frame,
                                   uint32_t *tx_ok, uint32_t *tx_late, uint32_t *tx_timeout)
{
    struct uwb_cal_frame report;
    bool ok;

    if (plan_frame->src_id != BEACON_ID || plan_frame->dst_id == BEACON_ID) {
        return false;
    }

    runtime->state = UWB_ANCHOR_STATE_TWR_GRAPH;
    on_state_change(runtime->state);
    ok = run_geometry_pair_initiator(BEACON_ID, plan_frame->dst_id, BEACON_SLOT_ID,
                                     plan_frame->seq, plan_frame->slot_id,
                                     (uint32_t)plan_frame->ts_a,
                                     tx_ok, tx_late, tx_timeout, &report);
    if (ok) {
        printk("CAL: pair a=%u b=%u sample=%u path=%lld ticks dist=%u valid=%u\n",
               report.src_id,
               report.dst_id,
               report.slot_id,
               (long long)report.ts_a,
               report.value16,
               (report.flags & 0x01U) ? 1U : 0U);
    }
    return ok;
}

static void slave_run_localization(struct slave_runtime *runtime)
{
    bool rx_active = false;
    bool rx_window_active = false;
    bool rx_window_ready = false;
    bool rx_window_allow_immediate_fallback = true;
    uint64_t next_sync_slave_ticks = 0U;
    uint32_t rx_ok = 0U;
    uint32_t rx_err = 0U;
    uint32_t rx_non_sync = 0U;
    uint32_t rx_idle = 0U;
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;
    uint32_t rx_window_miss_streak = 0U;
    uint32_t rx_err_window_advance = 0U;
    uint32_t rx_window_expired_advance = 0U;
    uint32_t rx_err_transient_retry = 0U;
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
    const uint32_t tx_guard_dtu = uus_to_dx_time(TX_GUARD_UUS);
    const uint32_t slot_offset_dtu =
        uus_to_dx_time(SLOT_START_UUS) +
        (uint32_t)(((uint64_t)BEACON_SLOT_ID * SLOT_UUS * UUS_TO_DWT_TIME) >> 8);

    runtime->state = (runtime->state == UWB_ANCHOR_STATE_DEGRADED) ?
                     UWB_ANCHOR_STATE_DEGRADED : UWB_ANCHOR_STATE_LOCALIZE;
    on_state_change(runtime->state);

    if (runtime->sync.valid) {
        uint64_t next_master = (uint64_t)runtime->sync.last_master_ticks + superframe_ticks;
        rx_window_ready = sync_model_predict_rx(&runtime->sync, next_master, &next_sync_slave_ticks);
    }

    while (1) {
        poll_console_keys();
        if (!running) {
            if (rx_active) {
                dwt_forcetrxoff();
                rx_active = false;
                rx_window_active = false;
            }
            k_msleep(50);
            continue;
        }

        if (!rx_active) {
            bool window_expired = false;
            if (!arm_slave_rx(&rx_active, &rx_window_active,
                              rx_window_ready, runtime->sync.valid,
                              next_sync_slave_ticks, rx_early_ticks,
                              rx_min_arm_dtu,
                              rx_window_allow_immediate_fallback,
                              rx_window_timeout_uus,
                              rx_window_late_dtu,
                              &window_expired)) {
#if SLAVE_RX_WINDOWED
                if (rx_window_ready && runtime->sync.valid) {
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

        uint32_t rx_status = 0U;
        enum rx_wait_result result = wait_for_rx_event(SLAVE_RX_WAIT_MS, &rx_status);
        if (result == RX_WAIT_OK) {
            rx_active = false;
            rx_window_active = false;
            rx_idle = 0U;

            struct uwb_sync_frame sync;
            if (uwb_sync_unpack(rx_buf, rx_len, &sync)) {
                rx_ok++;
                if (sync_model_add_sample(&runtime->sync, sync.t1_master, last_rx_ts)) {
                    uint64_t next_t1_master = (uint64_t)runtime->sync.last_master_ticks + superframe_ticks;
                    rx_window_ready = sync_model_predict_rx(&runtime->sync, next_t1_master,
                                                            &next_sync_slave_ticks);
                } else {
                    rx_window_ready = false;
                }
                rx_window_miss_streak = 0U;
                rx_window_allow_immediate_fallback = true;

#if ENABLE_BLINK_TX
                uint64_t blink_master_ticks = (uint64_t)runtime->sync.last_master_ticks + slot_offset_ticks;
                uint64_t blink_slave_ticks = 0U;
                if (sync_model_predict_tx(&runtime->sync, blink_master_ticks,
                                          &runtime->timing, &blink_slave_ticks)) {
                    uint8_t blink_tx_mode = DWT_START_TX_DELAYED;
                    uint32_t blink_rx_after_tx_delay_uus = 0U;
                    uint32_t blink_rx_after_tx_timeout_uus = 0U;
                    bool blink_rx_auto_armed = false;
                    uint32_t blink_target_dtu = (uint32_t)(blink_slave_ticks >> 8);
                    uint32_t now = get_sys_time_u32();
                    blink_target_dtu = guard_tx_time(blink_target_dtu, now, tx_guard_dtu,
                                                     slot_offset_dtu);
                    blink_target_dtu = quantize_delayed_time(blink_target_dtu);

#if SLAVE_RX_WINDOWED
                    if (rx_window_ready && runtime->sync.valid && next_sync_slave_ticks > blink_slave_ticks) {
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
                    if (start_delayed_tx(tx_buf, sizeof(tx_buf), blink_target_dtu,
                                         "BLINK", sync.sync_seq,
                                         &tx_ok, &tx_late, &tx_timeout,
                                         blink_tx_mode,
                                         blink_rx_after_tx_delay_uus,
                                         blink_rx_after_tx_timeout_uus)) {
                        if (blink_rx_auto_armed) {
                            rx_active = true;
                            rx_window_active = true;
                        }
                    }
                }
#endif
                continue;
            }

            struct uwb_cal_frame cal;
            if (uwb_cal_unpack(rx_buf, rx_len, &cal)) {
                if (cal.msg_type == UWB_CAL_MSG_NETWORK &&
                    (cal.dst_id == UWB_BROADCAST_ID || cal.dst_id == BEACON_ID)) {
                    if (cal.flags == UWB_NETWORK_SIGNAL_READY) {
                        runtime->state = UWB_ANCHOR_STATE_LOCALIZE;
                        on_state_change(runtime->state);
                    } else if (cal.flags == UWB_NETWORK_SIGNAL_DEGRADED &&
                               runtime->timing.path_delay_valid) {
                        runtime->state = UWB_ANCHOR_STATE_DEGRADED;
                        on_state_change(runtime->state);
                    }
                }
                continue;
            }

            rx_non_sync++;
            continue;
        }

        rx_active = false;
        rx_window_active = false;
        dwt_forcetrxoff();

        if (result == RX_WAIT_ERROR) {
#if SLAVE_RX_WINDOWED
            if (rx_window_active && runtime->sync.valid) {
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
                    rx_window_allow_immediate_fallback =
                        (rx_status & decode_error_mask) != 0U;
                    rx_err_transient_retry++;
                } else {
                    next_sync_slave_ticks += superframe_ticks;
                    rx_window_miss_streak++;
                    rx_window_ready = rx_window_miss_streak <= SLAVE_RX_WINDOW_PERSIST_MISSES;
                    rx_window_allow_immediate_fallback = true;
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
            rx_err++;
            continue;
        }

        if (result == RX_WAIT_TIMEOUT) {
#if SLAVE_RX_WINDOWED
            if (rx_window_active && runtime->sync.valid) {
                next_sync_slave_ticks += superframe_ticks;
                rx_window_miss_streak++;
                rx_window_ready = rx_window_miss_streak <= SLAVE_RX_WINDOW_PERSIST_MISSES;
                rx_window_allow_immediate_fallback = true;
            } else {
                rx_window_ready = false;
                rx_window_allow_immediate_fallback = true;
            }
#else
            rx_window_ready = false;
            rx_window_allow_immediate_fallback = true;
#endif
            rx_err++;
        }

        rx_idle++;
        if (rx_idle >= SLAVE_IDLE_LOG_PERIOD) {
            printk("SLAVE: localize ok=%u err=%u non_sync=%u drop=%u adv=%u retry=%u\n",
                   rx_ok, rx_err, rx_non_sync,
                   (uint32_t)atomic_get(&rx_term_drop_count),
                   rx_err_window_advance + rx_window_expired_advance,
                   rx_err_transient_retry);
            rx_idle = 0U;
        }
    }
}

static void slave_wait_for_network(struct slave_runtime *runtime)
{
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;

    runtime->state = UWB_ANCHOR_STATE_DISCOVERY;
    on_state_change(runtime->state);
    runtime->timing.schedule_hash = compute_schedule_hash();
    runtime->timing.fixed_tx_bias_ticks = CAL_FIXED_TX_BIAS_TICKS;

    apply_cached_timing_if_valid(runtime);
    if (runtime->timing.cached_valid) {
        printk("SLAVE: cached path delay=%lld ticks\n",
               (long long)runtime->timing.path_delay_ticks);
    }

    while (1) {
        poll_console_keys();
        if (!running) {
            k_msleep(50);
            continue;
        }

        struct uwb_sync_frame sync;
        struct uwb_cal_frame cal;

        if (!arm_immediate_rx(CAL_RX_TIMEOUT_UUS)) {
            k_msleep(10);
            continue;
        }
        uint32_t status = 0U;
        enum rx_wait_result result = wait_for_rx_event(CAL_WAIT_MS, &status);
        dwt_forcetrxoff();
        if (result != RX_WAIT_OK) {
            continue;
        }

        if (uwb_sync_unpack(rx_buf, rx_len, &sync)) {
            if (sync.master_id == runtime->master_id || runtime->master_id == 0U) {
                runtime->master_id = sync.master_id;
                runtime->timing.master_id = sync.master_id;
                if (runtime->timing.path_delay_valid) {
                    runtime->state = UWB_ANCHOR_STATE_CLOCK_CAL;
                    on_state_change(runtime->state);
                }
                if (sync_model_add_sample(&runtime->sync, sync.t1_master, last_rx_ts) &&
                    runtime->timing.path_delay_valid &&
                    runtime->sync.sample_count >= CAL_SYNC_SAMPLES) {
                    runtime->state = UWB_ANCHOR_STATE_SELF_READY;
                    on_state_change(runtime->state);
                    persist_runtime_calibration(runtime, runtime->state);
                }
            }
            continue;
        }

        if (!uwb_cal_unpack(rx_buf, rx_len, &cal)) {
            continue;
        }

        if (cal.msg_type == UWB_CAL_MSG_PAIR_PLAN) {
            if (cal.src_id != BEACON_ID && cal.dst_id != BEACON_ID) {
                continue;
            }
        } else if (cal.dst_id != UWB_BROADCAST_ID && cal.dst_id != BEACON_ID) {
            continue;
        }

        switch (cal.msg_type) {
        case UWB_CAL_MSG_DISCOVERY_REQ:
            runtime->master_id = cal.src_id;
            runtime->timing.master_id = cal.src_id;
            runtime->state = UWB_ANCHOR_STATE_DISCOVERY;
            on_state_change(runtime->state);
            send_slave_hello(cal.src_id, cal.seq, &tx_ok, &tx_late, &tx_timeout);
            break;
        case UWB_CAL_MSG_TWR_POLL:
            runtime->master_id = cal.src_id;
            runtime->timing.master_id = cal.src_id;
            (void)handle_slave_twr_poll(runtime, &cal, &tx_ok, &tx_late, &tx_timeout);
            break;
        case UWB_CAL_MSG_PAIR_PLAN:
            (void)handle_slave_pair_plan(runtime, &cal, &tx_ok, &tx_late, &tx_timeout);
            break;
        case UWB_CAL_MSG_STATUS_REQ:
            if (runtime->timing.path_delay_valid && runtime->sync.sample_count >= CAL_SYNC_SAMPLES) {
                runtime->state = UWB_ANCHOR_STATE_SELF_READY;
            } else if (runtime->timing.cached_valid) {
                runtime->state = UWB_ANCHOR_STATE_DEGRADED;
            }
            on_state_change(runtime->state);
            send_slave_status(runtime, cal.src_id, cal.seq, &tx_ok, &tx_late, &tx_timeout);
            break;
        case UWB_CAL_MSG_NETWORK:
            runtime->timing.roster_hash = (uint32_t)cal.ts_a;
            runtime->roster_hash = (uint32_t)cal.ts_a;
            runtime->timing.schedule_hash = (uint32_t)cal.ts_b;
            if (cal.flags == UWB_NETWORK_SIGNAL_READY &&
                runtime->timing.path_delay_valid &&
                runtime->sync.sample_count >= CAL_SYNC_SAMPLES) {
                runtime->state = UWB_ANCHOR_STATE_NETWORK_READY;
                on_state_change(runtime->state);
                persist_runtime_calibration(runtime, runtime->state);
                slave_run_localization(runtime);
            } else if (cal.flags == UWB_NETWORK_SIGNAL_DEGRADED &&
                       runtime->timing.path_delay_valid) {
                runtime->state = UWB_ANCHOR_STATE_DEGRADED;
                on_state_change(runtime->state);
                persist_runtime_calibration(runtime, runtime->state);
                slave_run_localization(runtime);
            } else {
                runtime->state = UWB_ANCHOR_STATE_FAULT;
                on_state_change(runtime->state);
            }
            break;
        default:
            break;
        }
    }
}
#endif

#if defined(CONFIG_ROLE_MASTER_ANCHOR)
static struct discovered_slave *find_or_add_slave(struct discovered_slave *slaves,
                                                  size_t *count, uint8_t beacon_id)
{
    for (size_t i = 0; i < *count; ++i) {
        if (slaves[i].beacon_id == beacon_id) {
            return &slaves[i];
        }
    }

    if (*count >= MAX_DISCOVERED_SLAVES) {
        return NULL;
    }

    struct discovered_slave *entry = &slaves[*count];
    memset(entry, 0, sizeof(*entry));
    entry->beacon_id = beacon_id;
    (*count)++;
    return entry;
}

static void collect_hello_responses(struct discovered_slave *slaves, size_t *count, uint16_t seq)
{
    int64_t deadline = k_uptime_get() + CAL_WAIT_MS;
    while (k_uptime_get() < deadline) {
        struct uwb_cal_frame hello;
        uint64_t hello_rx_ts = 0U;
        if (!receive_matching_cal_frame(UWB_CAL_MSG_HELLO, UWB_BROADCAST_ID, BEACON_ID,
                                        seq, (uint32_t)MAX(1LL, deadline - k_uptime_get()),
                                        &hello, &hello_rx_ts)) {
            break;
        }
        ARG_UNUSED(hello_rx_ts);
        struct discovered_slave *entry = find_or_add_slave(slaves, count, hello.src_id);
        if (!entry) {
            continue;
        }
        entry->hello_seen = true;
        entry->slot_id = hello.slot_id;

        if (CAL_EXPECTED_SLAVES > 0U && *count >= CAL_EXPECTED_SLAVES) {
            break;
        }
    }
}

static size_t master_discover_slaves(struct discovered_slave *slaves, uint16_t *cal_seq)
{
    size_t count = 0U;
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;

    on_state_change(UWB_ANCHOR_STATE_DISCOVERY);
    for (uint32_t round = 0; round < CAL_DISCOVERY_ROUNDS; ++round) {
        uint16_t seq = ++(*cal_seq);
        struct uwb_cal_frame req = {
            .frame_type = UWB_FRAME_TYPE_CAL,
            .msg_type = UWB_CAL_MSG_DISCOVERY_REQ,
            .src_id = BEACON_ID,
            .dst_id = UWB_BROADCAST_ID,
            .seq = seq,
            .slot_id = BEACON_SLOT_ID,
            .flags = 0U,
            .value16 = 0U,
            .ts_a = compute_schedule_hash(),
            .ts_b = 0U,
            .ts_c = 0U,
        };

        if (!send_cal_frame_after_uus(&req, CAL_CONTROL_TX_DELAY_UUS, "CAL_DISC", &tx_ok, &tx_late,
                                      &tx_timeout, DWT_START_TX_DELAYED, 0U, 0U)) {
            continue;
        }

        collect_hello_responses(slaves, &count, seq);
        if (CAL_EXPECTED_SLAVES > 0U && count >= CAL_EXPECTED_SLAVES) {
            break;
        }
        k_msleep(10);
    }

    for (size_t i = 0; i < count; ++i) {
        printk("CAL: hello from slave=%u slot=%u\n", slaves[i].beacon_id, slaves[i].slot_id);
    }
    printk("CAL: discovered %u slave(s)\n", (unsigned int)count);
    return count;
}

static void master_broadcast_pair_plan(uint8_t initiator_id, uint8_t responder_id,
                                       uint8_t sample_idx, uint32_t roster_hash,
                                       uint16_t *cal_seq)
{
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;
    struct uwb_cal_frame plan = {
        .frame_type = UWB_FRAME_TYPE_CAL,
        .msg_type = UWB_CAL_MSG_PAIR_PLAN,
        .src_id = initiator_id,
        .dst_id = responder_id,
        .seq = ++(*cal_seq),
        .slot_id = sample_idx,
        .flags = 0U,
        .value16 = 0U,
        .ts_a = roster_hash,
        .ts_b = 0U,
        .ts_c = 0U,
    };

    (void)send_cal_frame_after_uus(&plan, CAL_CONTROL_TX_DELAY_UUS, "CAL_PAIR_PLAN",
                                   &tx_ok, &tx_late, &tx_timeout,
                                   DWT_START_TX_DELAYED, 0U, 0U);
}

static void master_broadcast_geom_done(uint8_t status_code, uint32_t roster_hash,
                                       uint16_t edge_count, uint8_t anchor_count,
                                       uint16_t *cal_seq)
{
    for (uint8_t i = 0U; i < CAL_GEOM_DONE_BROADCASTS; ++i) {
        uint32_t tx_ok = 0U;
        uint32_t tx_late = 0U;
        uint32_t tx_timeout = 0U;
        struct uwb_cal_frame done = {
            .frame_type = UWB_FRAME_TYPE_CAL,
            .msg_type = UWB_CAL_MSG_GEOM_DONE,
            .src_id = BEACON_ID,
            .dst_id = UWB_BROADCAST_ID,
            .seq = ++(*cal_seq),
            .slot_id = i,
            .flags = status_code,
            .value16 = edge_count,
            .ts_a = roster_hash,
            .ts_b = anchor_count,
            .ts_c = 0U,
        };

        (void)send_cal_frame_after_uus(&done, CAL_CONTROL_TX_DELAY_UUS, "CAL_GEOM_DONE",
                                       &tx_ok, &tx_late, &tx_timeout,
                                       DWT_START_TX_DELAYED, 0U, 0U);
        k_msleep(5);
    }
}

static struct discovered_slave *master_find_slave(struct discovered_slave *slaves, size_t count,
                                                  uint8_t beacon_id)
{
    for (size_t i = 0; i < count; ++i) {
        if (slaves[i].beacon_id == beacon_id) {
            return &slaves[i];
        }
    }
    return NULL;
}

static bool master_collect_geometry_edge(struct geometry_edge *edges, size_t *edge_count,
                                         const struct uwb_cal_frame *report)
{
    struct geometry_edge *edge;

    if ((report->flags & 0x01U) == 0U) {
        return false;
    }

    edge = find_or_add_geometry_edge(edges, edge_count, report->src_id, report->dst_id);
    if (!edge) {
        return false;
    }

    geometry_edge_append_sample(edge, (int64_t)report->ts_a, report->value16);
    printk("CAL: edge a=%u b=%u sample=%u path=%lld ticks dist=%u valid=%u samples=%u\n",
           report->src_id,
           report->dst_id,
           report->slot_id,
           (long long)report->ts_a,
           report->value16,
           edge->valid ? 1U : 0U,
           (unsigned int)edge->twr.count);
    return true;
}

static void master_replay_geometry_edges(const struct geometry_edge *edges, size_t edge_count,
                                         uint32_t roster_hash, uint16_t *cal_seq)
{
    for (size_t i = 0; i < edge_count; ++i) {
        const struct geometry_edge *edge = &edges[i];

        if (!edge->valid) {
            continue;
        }

        for (uint8_t replay = 0U; replay < CAL_GEOMETRY_REPLAY_COUNT; ++replay) {
            uint32_t tx_ok = 0U;
            uint32_t tx_late = 0U;
            uint32_t tx_timeout = 0U;
            struct uwb_cal_frame report = {
                .frame_type = UWB_FRAME_TYPE_CAL,
                .msg_type = UWB_CAL_MSG_PAIR_REPORT,
                .src_id = edge->a_id,
                .dst_id = edge->b_id,
                .seq = ++(*cal_seq),
                .slot_id = replay,
                .flags = 1U,
                .value16 = (uint16_t)MIN(edge->distance_mm, 65535U),
                .ts_a = (uint64_t)edge->path_delay_ticks,
                .ts_b = roster_hash,
                .ts_c = 0U,
            };

            (void)send_cal_frame_after_uus(&report, CAL_CONTROL_TX_DELAY_UUS, "CAL_PAIR_REP",
                                           &tx_ok, &tx_late, &tx_timeout,
                                           DWT_START_TX_DELAYED, 0U, 0U);
            k_msleep(8);
        }
    }
}

static bool master_geometry_pair_with_master(uint8_t responder_id, uint8_t sample_idx,
                                             uint32_t roster_hash,
                                             uint16_t *cal_seq,
                                             struct uwb_cal_frame *matched_report)
{
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;
    uint16_t seq;

    master_broadcast_pair_plan(BEACON_ID, responder_id, sample_idx, roster_hash, cal_seq);
    seq = *cal_seq;
    return run_geometry_pair_initiator(BEACON_ID, responder_id, BEACON_SLOT_ID,
                                       seq, sample_idx, roster_hash,
                                       &tx_ok, &tx_late, &tx_timeout, matched_report);
}

static bool master_geometry_pair_between_slaves(uint8_t initiator_id, uint8_t responder_id,
                                                uint8_t sample_idx, uint32_t roster_hash,
                                                uint16_t *cal_seq,
                                                struct uwb_cal_frame *matched_report)
{
    master_broadcast_pair_plan(initiator_id, responder_id, sample_idx, roster_hash, cal_seq);
    return receive_matching_cal_frame(UWB_CAL_MSG_PAIR_REPORT, initiator_id, responder_id,
                                      *cal_seq, CAL_WAIT_MS * 2U, matched_report, NULL);
}

static bool master_geometry_pair_between_slaves_bidirectional(uint8_t a_id, uint8_t b_id,
                                                              uint8_t sample_idx,
                                                              uint32_t roster_hash,
                                                              uint16_t *cal_seq,
                                                              struct uwb_cal_frame *matched_report)
{
    if (master_geometry_pair_between_slaves(a_id, b_id, sample_idx, roster_hash,
                                            cal_seq, matched_report)) {
        return true;
    }

    k_msleep(5);

    return master_geometry_pair_between_slaves(b_id, a_id, sample_idx, roster_hash,
                                               cal_seq, matched_report);
}

static void master_collect_geometry_graph(struct discovered_slave *slaves, size_t slave_count,
                                          uint32_t roster_hash, uint16_t *cal_seq)
{
    struct geometry_edge *edges = geometry_edges_scratch;
    size_t edge_count = 0U;
    uint8_t roster_ids[MAX_DISCOVERED_SLAVES + 1];
    size_t roster_count = slave_count + 1U;
    int64_t settle_deadline = k_uptime_get() + (int64_t)CAL_GEOMETRY_SETTLE_MS;

    memset(edges, 0, sizeof(geometry_edges_scratch));
    roster_ids[0] = BEACON_ID;
    for (size_t i = 0; i < slave_count; ++i) {
        roster_ids[i + 1U] = slaves[i].beacon_id;
    }

    on_state_change(UWB_ANCHOR_STATE_TWR_GRAPH);
    for (size_t i = 0; i < roster_count; ++i) {
        for (size_t j = i + 1U; j < roster_count; ++j) {
            uint8_t a_id = roster_ids[i];
            uint8_t b_id = roster_ids[j];

            for (uint8_t sample = 0U; sample < CAL_TWR_ATTEMPTS; ++sample) {
                struct uwb_cal_frame report;
                bool ok;

                if (a_id == BEACON_ID) {
                    struct discovered_slave *responder = master_find_slave(slaves, slave_count, b_id);
                    if (!responder) {
                        continue;
                    }
                    ARG_UNUSED(responder);
                    ok = master_geometry_pair_with_master(b_id, sample, roster_hash,
                                                          cal_seq, &report);
                } else {
                    ok = master_geometry_pair_between_slaves_bidirectional(a_id, b_id, sample,
                                                                           roster_hash, cal_seq,
                                                                           &report);
                }

                if (!ok) {
                    printk("CAL: pair timeout a=%u b=%u sample=%u seq=%u\n",
                           a_id, b_id, sample, *cal_seq);
                    continue;
                }

                (void)master_collect_geometry_edge(edges, &edge_count, &report);
                k_msleep(5);
            }
        }
    }

    if (CAL_GEOMETRY_SETTLE_MS > 0U &&
        geometry_graph_needs_samples(edges, edge_count, roster_ids, roster_count)) {
        printk("CAL: geometry extending retries target=%u window_ms=%u\n",
               (unsigned int)CAL_GEOMETRY_TARGET_SAMPLES,
               (unsigned int)CAL_GEOMETRY_SETTLE_MS);
    }

    while (CAL_GEOMETRY_SETTLE_MS > 0U &&
           k_uptime_get() < settle_deadline &&
           geometry_graph_needs_samples(edges, edge_count, roster_ids, roster_count)) {
        bool progress = false;

        for (size_t i = 0; i < roster_count; ++i) {
            for (size_t j = i + 1U; j < roster_count; ++j) {
                uint8_t a_id = roster_ids[i];
                uint8_t b_id = roster_ids[j];
                uint8_t sample_idx;
                struct uwb_cal_frame report;
                bool ok;

                if (k_uptime_get() >= settle_deadline) {
                    break;
                }
                if (!geometry_pair_needs_samples(edges, edge_count, a_id, b_id)) {
                    continue;
                }

                sample_idx = (uint8_t)MIN(geometry_pair_sample_count(edges, edge_count, a_id, b_id),
                                          UINT8_MAX);

                if (a_id == BEACON_ID) {
                    ok = master_geometry_pair_with_master(b_id, sample_idx, roster_hash,
                                                          cal_seq, &report);
                } else {
                    ok = master_geometry_pair_between_slaves_bidirectional(a_id, b_id, sample_idx,
                                                                           roster_hash, cal_seq,
                                                                           &report);
                }

                if (!ok) {
                    printk("CAL: pair retry timeout a=%u b=%u sample=%u seq=%u\n",
                           a_id, b_id, sample_idx, *cal_seq);
                    continue;
                }

                progress |= master_collect_geometry_edge(edges, &edge_count, &report);
                k_msleep(5);
            }
        }

        if (!progress) {
            k_msleep(10);
        }
    }

    size_t valid_edges = geometry_count_valid_edges(edges, edge_count);
    uint8_t status_code = geometry_status_from_edges(roster_count, valid_edges);
    if (valid_edges < geometry_expected_edge_count(roster_count)) {
        geometry_log_missing_pairs(edges, edge_count, roster_ids, roster_count);
    }
    printk("CAL: geometry edges=%u valid=%u expected=%u status=%u\n",
           (unsigned int)edge_count,
           (unsigned int)valid_edges,
           (unsigned int)geometry_expected_edge_count(roster_count),
           status_code);
    master_replay_geometry_edges(edges, edge_count, roster_hash, cal_seq);
    master_broadcast_geom_done(status_code, roster_hash, (uint16_t)valid_edges,
                               (uint8_t)roster_count, cal_seq);
}

static bool master_range_slave(struct discovered_slave *slave, uint16_t *cal_seq)
{
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;
    bool got_valid_report = false;

    on_state_change(UWB_ANCHOR_STATE_TWR_GRAPH);

    for (uint32_t sample = 0; sample < CAL_TWR_ATTEMPTS; ++sample) {
        uint16_t seq = ++(*cal_seq);
        struct uwb_cal_frame poll = {
            .frame_type = UWB_FRAME_TYPE_CAL,
            .msg_type = UWB_CAL_MSG_TWR_POLL,
            .src_id = BEACON_ID,
            .dst_id = slave->beacon_id,
            .seq = seq,
            .slot_id = BEACON_SLOT_ID,
            .flags = 0U,
            .value16 = (uint16_t)sample,
            .ts_a = 0U,
            .ts_b = 0U,
            .ts_c = 0U,
        };

        if (!send_cal_frame_after_uus(&poll, CAL_CONTROL_TX_DELAY_UUS, "CAL_TWR_POLL",
                                      &tx_ok, &tx_late, &tx_timeout,
                                      DWT_START_TX_DELAYED, 0U, 0U)) {
            continue;
        }

        struct uwb_cal_frame resp;
        uint64_t resp_rx_ts = 0U;
        if (!receive_matching_cal_frame(UWB_CAL_MSG_TWR_RESP, slave->beacon_id, BEACON_ID,
                                        seq, CAL_WAIT_MS, &resp, &resp_rx_ts)) {
            printk("CAL: TWR response timeout slave=%u sample=%u seq=%u\n",
                   slave->beacon_id, sample, seq);
            continue;
        }

        uint32_t final_tx_time =
            (uint32_t)((resp_rx_ts +
                       ((uint64_t)CAL_RESP_RX_TO_FINAL_TX_DLY_UUS * UUS_TO_DWT_TIME)) >> 8);
        final_tx_time = guard_tx_time(final_tx_time, get_sys_time_u32(),
                                      uus_to_dx_time(TX_GUARD_UUS), 0U);
        uint64_t final_tx_ts =
            (((uint64_t)(final_tx_time & 0xFFFFFFFEUL)) << 8) + (uint64_t)TX_ANT_DLY;
        struct uwb_cal_frame final = {
            .frame_type = UWB_FRAME_TYPE_CAL,
            .msg_type = UWB_CAL_MSG_TWR_FINAL,
            .src_id = BEACON_ID,
            .dst_id = slave->beacon_id,
            .seq = seq,
            .slot_id = BEACON_SLOT_ID,
            .flags = 0U,
            .value16 = 0U,
            .ts_a = last_tx_ts,
            .ts_b = resp_rx_ts,
            .ts_c = final_tx_ts,
        };
        uint8_t final_buf[UWB_CAL_FRAME_LEN];
        uwb_cal_pack(final_buf, &final);

        if (!start_delayed_tx(final_buf, sizeof(final_buf),
                              quantize_delayed_time(final_tx_time),
                              "CAL_TWR_FINAL", seq, &tx_ok, &tx_late, &tx_timeout,
                              DWT_START_TX_DELAYED, 0U, 0U)) {
            continue;
        }

        struct uwb_cal_frame report;
        if (!receive_matching_cal_frame(UWB_CAL_MSG_TWR_REPORT, slave->beacon_id, BEACON_ID,
                                        seq, CAL_WAIT_MS, &report, NULL)) {
            printk("CAL: TWR report timeout slave=%u sample=%u seq=%u\n",
                   slave->beacon_id, sample, seq);
            continue;
        }

        slave->path_delay_ticks = (int64_t)report.ts_a;
        slave->distance_mm = report.value16;
        slave->delay_valid = (report.flags & 0x01U) != 0U;
        got_valid_report = true;
        printk("CAL: TWR slave=%u sample=%u path=%lld ticks dist=%u valid=%u\n",
               slave->beacon_id, sample,
               (long long)slave->path_delay_ticks,
               slave->distance_mm,
               slave->delay_valid ? 1U : 0U);
        k_msleep(5);
    }

    return got_valid_report && slave->delay_valid;
}

static void master_send_clock_syncs(uint16_t *sync_seq, uint32_t burst_count)
{
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;
    uint32_t next_sync_dtu = get_sys_time_u32() + uus_to_dx_time(TX_START_DELAY_UUS);
    const uint32_t superframe_dtu = uus_to_dx_time(SUPERFRAME_UUS);
    const uint32_t tx_guard_dtu = uus_to_dx_time(TX_GUARD_UUS);

    for (uint32_t i = 0; i < burst_count; ++i) {
        uint32_t now = get_sys_time_u32();
        next_sync_dtu = guard_tx_time(next_sync_dtu, now, tx_guard_dtu, 0U);
        uint32_t sync_dx_time = quantize_delayed_time(next_sync_dtu);
        uint64_t t1_master = ((uint64_t)sync_dx_time) << 8;
        struct uwb_sync_frame sync = {
            .frame_type = UWB_FRAME_TYPE_SYNC,
            .master_id = BEACON_ID,
            .sync_seq = *sync_seq,
            .t1_master = t1_master,
        };
        uint8_t sync_buf[UWB_SYNC_FRAME_LEN];
        uwb_sync_pack(sync_buf, &sync);

        if (start_delayed_tx(sync_buf, sizeof(sync_buf), sync_dx_time,
                             "CAL_SYNC", *sync_seq, &tx_ok, &tx_late, &tx_timeout,
                             DWT_START_TX_DELAYED, 0U, 0U)) {
            printk("CAL: SYNC seq=%u t1=%llu\n",
                   *sync_seq, (unsigned long long)t1_master);
            next_sync_dtu = (uint32_t)(last_tx_ts >> 8) + superframe_dtu;
            (*sync_seq)++;
        } else {
            next_sync_dtu = get_sys_time_u32() + superframe_dtu;
        }
    }
}

static bool master_collect_status_for_slave(struct discovered_slave *slave, uint16_t *cal_seq)
{
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;
    uint16_t seq = ++(*cal_seq);
    struct uwb_cal_frame req = {
        .frame_type = UWB_FRAME_TYPE_CAL,
        .msg_type = UWB_CAL_MSG_STATUS_REQ,
        .src_id = BEACON_ID,
        .dst_id = slave->beacon_id,
        .seq = seq,
        .slot_id = BEACON_SLOT_ID,
        .flags = 0U,
        .value16 = 0U,
        .ts_a = 0U,
        .ts_b = 0U,
        .ts_c = 0U,
    };

    if (!send_cal_frame_after_uus(&req, CAL_CONTROL_TX_DELAY_UUS, "CAL_STAT_REQ",
                                  &tx_ok, &tx_late, &tx_timeout,
                                  DWT_START_TX_DELAYED, 0U, 0U)) {
        return false;
    }

    struct uwb_cal_frame status;
    if (!receive_matching_cal_frame(UWB_CAL_MSG_STATUS, slave->beacon_id, BEACON_ID, seq,
                                    CAL_WAIT_MS, &status, NULL)) {
        printk("CAL: status timeout slave=%u seq=%u\n", slave->beacon_id, seq);
        return false;
    }

    slave->last_state = status.flags;
    slave->sync_samples = status.value16;
    slave->path_delay_ticks = (int64_t)status.ts_a;
    slave->self_ready =
        (status.flags == UWB_ANCHOR_STATE_SELF_READY) ||
        (status.flags == UWB_ANCHOR_STATE_NETWORK_READY) ||
        (status.flags == UWB_ANCHOR_STATE_LOCALIZE);

    printk("CAL: status slave=%u state=%u samples=%u path=%llu ready=%u\n",
           status.src_id,
           status.flags,
           status.value16,
           (unsigned long long)status.ts_a,
           slave->self_ready ? 1U : 0U);
    return true;
}

static size_t count_ready_slaves(const struct discovered_slave *slaves, size_t count)
{
    size_t ready = 0U;

    for (size_t i = 0; i < count; ++i) {
        if (slaves[i].self_ready) {
            ready++;
        }
    }

    return ready;
}

static uint32_t ready_timeout_ms(size_t slave_count)
{
    uint32_t participants = (uint32_t)MAX(slave_count, (size_t)MAX(CAL_EXPECTED_SLAVES, 1U));
    uint32_t sync_budget_ms =
        (uint32_t)(((uint64_t)participants * MAX(CAL_SYNC_SAMPLES, 1U) * SUPERFRAME_UUS * 4U) / 1000U);

    return MAX(CAL_READY_MIN_TIMEOUT_MS, sync_budget_ms);
}

static size_t master_wait_for_slaves_ready(struct discovered_slave *slaves, size_t count,
                                           uint16_t *cal_seq, uint16_t *sync_seq)
{
    int64_t deadline = k_uptime_get() + ready_timeout_ms(count);
    size_t ready = 0U;

    if (count == 0U) {
        printk("CAL: 0 slave(s) reported self-ready\n");
        return 0U;
    }

    on_state_change(UWB_ANCHOR_STATE_CLOCK_CAL);
    master_send_clock_syncs(sync_seq, CAL_SYNC_BROADCASTS);

    while (k_uptime_get() < deadline) {
        size_t before = ready;

        for (size_t i = 0; i < count; ++i) {
            if (slaves[i].self_ready) {
                continue;
            }
            (void)master_collect_status_for_slave(&slaves[i], cal_seq);
        }

        ready = count_ready_slaves(slaves, count);
        if (ready == count) {
            break;
        }

        master_send_clock_syncs(sync_seq, CAL_READY_SYNC_BURST);

        if (ready == before) {
            k_msleep(5);
        }
    }

    ready = count_ready_slaves(slaves, count);
    printk("CAL: %u slave(s) reported self-ready\n", (unsigned int)ready);
    return ready;
}

static void master_broadcast_network(uint8_t signal, uint32_t roster_hash, uint16_t *cal_seq)
{
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;
    const uint32_t network_tx_delay_uus =
        CAL_CONTROL_TX_DELAY_UUS +
        CAL_STATUS_RESP_BASE_UUS +
        ((uint32_t)(MAX(CAL_EXPECTED_SLAVES, 1) + 1U) * CAL_STATUS_RESP_SLOT_UUS);

    for (uint32_t i = 0; i < CAL_NETWORK_BROADCASTS; ++i) {
        struct uwb_cal_frame network = {
            .frame_type = UWB_FRAME_TYPE_CAL,
            .msg_type = UWB_CAL_MSG_NETWORK,
            .src_id = BEACON_ID,
            .dst_id = UWB_BROADCAST_ID,
            .seq = ++(*cal_seq),
            .slot_id = BEACON_SLOT_ID,
            .flags = signal,
            .value16 = 0U,
            .ts_a = roster_hash,
            .ts_b = compute_schedule_hash(),
            .ts_c = 0U,
        };
        (void)send_cal_frame_after_uus(&network, network_tx_delay_uus, "CAL_NET",
                                       &tx_ok, &tx_late, &tx_timeout,
                                       DWT_START_TX_DELAYED, 0U, 0U);
        k_msleep(10);
    }
}

static uint8_t master_choose_network_signal(size_t slave_count, size_t ready_count)
{
    if (slave_count == 0U) {
        return (CAL_EXPECTED_SLAVES == 0U) ? UWB_NETWORK_SIGNAL_READY :
                                             UWB_NETWORK_SIGNAL_FAULT;
    }

    if (CAL_EXPECTED_SLAVES > 0U) {
        if (ready_count >= CAL_EXPECTED_SLAVES) {
            return UWB_NETWORK_SIGNAL_READY;
        }
        if (ready_count > 0U) {
            return UWB_NETWORK_SIGNAL_DEGRADED;
        }
        return UWB_NETWORK_SIGNAL_FAULT;
    }

    if (ready_count == slave_count) {
        return UWB_NETWORK_SIGNAL_READY;
    }
    if (ready_count > 0U) {
        return UWB_NETWORK_SIGNAL_DEGRADED;
    }
    return UWB_NETWORK_SIGNAL_FAULT;
}

static void master_localization_loop(uint8_t network_signal)
{
    const uint32_t superframe_dtu = uus_to_dx_time(SUPERFRAME_UUS);
    const uint32_t slot_start_dtu = uus_to_dx_time(SLOT_START_UUS);
    const uint32_t slot_offset_dtu =
        slot_start_dtu +
        (uint32_t)(((uint64_t)BEACON_SLOT_ID * SLOT_UUS * UUS_TO_DWT_TIME) >> 8);
    const uint32_t start_delay_dtu = uus_to_dx_time(TX_START_DELAY_UUS);
    const uint32_t initial_sync_delay_dtu = MAX(superframe_dtu, start_delay_dtu);
    const uint32_t tx_guard_dtu = uus_to_dx_time(TX_GUARD_UUS);
    uint16_t superframe_seq = 0U;
    uint32_t next_sync_dtu = 0U;
    bool scheduled = false;
    uint32_t tx_ok = 0U;
    uint32_t tx_late = 0U;
    uint32_t tx_timeout = 0U;

    on_state_change(network_signal == UWB_NETWORK_SIGNAL_DEGRADED ?
                    UWB_ANCHOR_STATE_DEGRADED : UWB_ANCHOR_STATE_LOCALIZE);

    while (1) {
        poll_console_keys();
        if (!running) {
            k_msleep(50);
            continue;
        }

        uint32_t now = get_sys_time_u32();
        if (!scheduled) {
            /* Leave one full superframe of margin after calibration traffic. */
            next_sync_dtu = now + initial_sync_delay_dtu;
            scheduled = true;
        }
        next_sync_dtu = guard_tx_time(next_sync_dtu, now, tx_guard_dtu, 0U);
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
                              &tx_timeout, DWT_START_TX_DELAYED, 0U, 0U)) {
            scheduled = false;
            continue;
        }

        printk("SYNC: id=%u seq=%u t1_master=%llu tx_ts=%llu ok=%u late=%u\n",
               BEACON_ID, superframe_seq,
               (unsigned long long)t1_master,
               (unsigned long long)last_tx_ts,
               tx_ok, tx_late);

#if ENABLE_BLINK_TX
        uint32_t blink_target_dtu = sync_dx_time + slot_offset_dtu;
        now = get_sys_time_u32();
        blink_target_dtu = guard_tx_time(blink_target_dtu, now, tx_guard_dtu, slot_offset_dtu);
        blink_target_dtu = quantize_delayed_time(blink_target_dtu);

        struct uwb_blink_frame frame = {
            .frame_type = UWB_FRAME_TYPE_BLINK,
            .beacon_id = BEACON_ID,
            .superframe_seq = superframe_seq,
            .slot_id = BEACON_SLOT_ID,
            .flags = BEACON_FLAGS,
        };
        uint8_t tx_buf[UWB_BLINK_FRAME_LEN];
        uwb_blink_pack(tx_buf, &frame);

        if (!start_delayed_tx(tx_buf, sizeof(tx_buf), blink_target_dtu,
                              "BLINK", superframe_seq, &tx_ok, &tx_late,
                              &tx_timeout, DWT_START_TX_DELAYED, 0U, 0U)) {
            scheduled = false;
            continue;
        }

        printk("BLINK: id=%u seq=%u slot=%u tx_ts=%llu ok=%u late=%u\n",
               BEACON_ID, superframe_seq, BEACON_SLOT_ID,
               (unsigned long long)last_tx_ts, tx_ok, tx_late);
#endif

        superframe_seq++;
        next_sync_dtu = (uint32_t)(last_tx_ts >> 8) + superframe_dtu;
    }
}

static void master_run(void)
{
    struct discovered_slave slaves[MAX_DISCOVERED_SLAVES];
    uint8_t roster_ids[MAX_DISCOVERED_SLAVES + 1];
    uint16_t cal_seq = 0U;
    uint16_t sync_seq = 0U;
    uint8_t signal;
    size_t slave_count;
    size_t ready_count;
    uint32_t roster_hash;

    memset(slaves, 0, sizeof(slaves));

    slave_count = master_discover_slaves(slaves, &cal_seq);
    roster_ids[0] = BEACON_ID;
    for (size_t i = 0; i < slave_count; ++i) {
        roster_ids[i + 1U] = slaves[i].beacon_id;
    }
    roster_hash = compute_roster_hash(roster_ids, slave_count + 1U);
    master_collect_geometry_graph(slaves, slave_count, roster_hash, &cal_seq);

    for (size_t i = 0; i < slave_count; ++i) {
        (void)master_range_slave(&slaves[i], &cal_seq);
    }
    ready_count = master_wait_for_slaves_ready(slaves, slave_count, &cal_seq, &sync_seq);
    signal = master_choose_network_signal(slave_count, ready_count);

    if (signal == UWB_NETWORK_SIGNAL_READY) {
        on_state_change(UWB_ANCHOR_STATE_NETWORK_READY);
    } else if (signal == UWB_NETWORK_SIGNAL_DEGRADED) {
        on_state_change(UWB_ANCHOR_STATE_DEGRADED);
    } else {
        on_state_change(UWB_ANCHOR_STATE_FAULT);
    }

    master_broadcast_network(signal, roster_hash, &cal_seq);
    if (signal == UWB_NETWORK_SIGNAL_FAULT) {
        while (1) {
            poll_console_keys();
            k_msleep(100);
        }
    }

    master_localization_loop(signal);
}
#endif

void main(void)
{
    k_msleep(200);
    usb_ready_wait();
    k_msleep(50);
    printk("\n[DWM3001CDK] UWB beacon starting\n");
    printk("Press 's' to start, 'p' to pause\n");

    k_sem_init(&sem_tx_done, 0, 1);
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
        set_led_mode(UWB_ANCHOR_STATE_FAULT);
        return;
    }
    if (irq_setup()) {
        printk("IRQ setup failed\n");
        set_led_mode(UWB_ANCHOR_STATE_FAULT);
        return;
    }
    if (dw3110_radio_init()) {
        printk("DW3000 init failed\n");
        init_status_led();
        set_led_mode(UWB_ANCHOR_STATE_FAULT);
        return;
    }
    init_status_led();
    set_led_mode(UWB_ANCHOR_STATE_BOOT);
    printk("main: before NVS init\n");
    (void)cal_store_init();
    printk("main: after NVS init\n");

#if defined(CONFIG_ROLE_MASTER_ANCHOR)
    printk("[role] MASTER anchor\n");
    master_run();
#elif defined(CONFIG_ROLE_SLAVE_ANCHOR)
    printk("[role] SLAVE anchor\n");
    sync_model_reset(&slave_runtime.sync);
    slave_runtime.state = UWB_ANCHOR_STATE_BOOT;
    slave_runtime.timing.fixed_tx_bias_ticks = CAL_FIXED_TX_BIAS_TICKS;
    slave_wait_for_network(&slave_runtime);
#else
#error "Select ROLE_MASTER_ANCHOR or ROLE_SLAVE_ANCHOR"
#endif
}
