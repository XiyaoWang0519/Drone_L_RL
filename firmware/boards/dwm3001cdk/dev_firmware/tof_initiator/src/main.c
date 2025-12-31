#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/drivers/uart.h>
#include <zephyr/logging/log.h>
#include <zephyr/sys/printk.h>
#include <zephyr/sys/atomic.h>
#include <zephyr/usb/usb_device.h>

#include <stdbool.h>
#include <string.h>

#include "deca_device_api.h"
#include "deca_probe_interface.h"

int dw_port_init(void);
void dw_port_reset_assert(void);
void dw_port_reset_deassert(void);

LOG_MODULE_REGISTER(tof_initiator, LOG_LEVEL_INF);

enum { TOF_MSG_POLL = 0x10, TOF_MSG_RESP = 0x11 };

struct __packed tof_msg_hdr {
    uint8_t type;
    uint8_t seq;
    uint8_t rsv0;
    uint8_t rsv1;
};

struct __packed tof_resp_payload {
    uint64_t resp_tx_ts;
    uint32_t reply_delay_dtu;
};

#define SPEED_OF_LIGHT       299702547.0
#define DWT_TIME_UNITS       (1.0 / (499.2e6 * 128.0))
#define UUS_TO_DWT_TIME      63898U

#define RESP_EXPECT_DLY_UUS  CONFIG_TOF_RESP_EXPECT_DELAY_UUS
#define RESP_EXPECT_DLY_DTU  ((uint64_t)RESP_EXPECT_DLY_UUS * UUS_TO_DWT_TIME)
#define RESP_RX_TIMEOUT_UUS  CONFIG_TOF_RESP_RX_TIMEOUT_UUS
#define RANGING_PERIOD_MS    CONFIG_TOF_RANGING_PERIOD_MS

#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);

static struct k_sem sem_tx_done;
static struct k_sem sem_rx_done;
static struct k_sem sem_rx_to;
static struct k_sem sem_rx_err;

static uint8_t rx_buf[128];
static uint16_t rx_len;
static uint64_t last_rx_ts;
static uint64_t last_tx_ts;

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

static uint64_t get_tx_timestamp_u64(void)
{
    uint8_t ts[5] = {0};
    dwt_readtxtimestamp(ts);
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
        /* Keep USB alive while we wait for a host to open the port */
        k_msleep(50);
    }
    k_msleep(50);
}

static struct gpio_callback irq_cb;
static struct k_work uwb_isr_work;
static atomic_t uwb_isr_pending;

static void uwb_isr_work_handler(struct k_work *work)
{
    ARG_UNUSED(work);
    atomic_clear(&uwb_isr_pending);
    dwt_isr();
}

static void uwb_irq_handler(const struct device *dev, struct gpio_callback *cb, uint32_t pins)
{
    ARG_UNUSED(dev);
    ARG_UNUSED(cb);
    ARG_UNUSED(pins);
    if (atomic_cas(&uwb_isr_pending, 0, 1)) {
        k_work_submit(&uwb_isr_work);
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
    printk("dw3110_radio_init: assert reset\n");
    dw_port_reset_assert();
    k_msleep(2);
    printk("dw3110_radio_init: deassert reset\n");
    dw_port_reset_deassert();
    k_msleep(5);

    printk("dw3110_radio_init: dwt_probe\n");
    if (dwt_probe((struct dwt_probe_s *)&dw3000_probe_interf) < 0) {
        printk("dw3110_radio_init: dwt_probe failed\n");
        return -EIO;
    }
    printk("dw3110_radio_init: probe ok\n");
    while (!dwt_checkidlerc()) {
        printk("dw3110_radio_init: waiting for IDLE_RC\n");
        k_busy_wait(50);
    }
    printk("dw3110_radio_init: IDLE_RC ready\n");
    if (dwt_initialise(DWT_READ_OTP_ALL) != DWT_SUCCESS) {
        printk("dw3110_radio_init: dwt_initialise failed\n");
        return -EIO;
    }
    printk("dw3110_radio_init: dwt_initialise ok\n");

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
    printk("dw3110_radio_init: configuring radio\n");
    if (dwt_configure(&cfg) != DWT_SUCCESS) {
        printk("dw3110_radio_init: dwt_configure failed\n");
        return -EIO;
    }
    printk("dw3110_radio_init: configure ok\n");

    printk("dw3110_radio_init: disable frame filter\n");
    dwt_configureframefilter(DWT_FF_DISABLE, 0);
    printk("dw3110_radio_init: frame filter disabled\n");
    printk("dw3110_radio_init: enable LNA/PA\n");
    dwt_setlnapamode(DWT_LNA_ENABLE | DWT_PA_ENABLE);
    printk("dw3110_radio_init: LNA/PA enabled\n");

    printk("dw3110_radio_init: set interrupts\n");
    dwt_setinterrupt(DWT_INT_TXFRS_BIT_MASK |
                         DWT_INT_RXFCG_BIT_MASK |
                         DWT_INT_RXFTO_BIT_MASK |
                         DWT_INT_RXPTO_BIT_MASK,
                     0, DWT_ENABLE_INT);
    printk("dw3110_radio_init: interrupts configured\n");

    dwt_callbacks_s cbs = {0};
    cbs.cbTxDone = on_tx_done;
    cbs.cbRxOk = on_rx_ok;
    cbs.cbRxTo = on_rx_to;
    cbs.cbRxErr = on_rx_err;
    dwt_setcallbacks(&cbs);
    printk("dw3110_radio_init: callbacks registered\n");
    printk("dw3110_radio_init: callbacks registered\n");

    return 0;
}

static void publish_range(uint8_t seq, uint64_t t_tx_poll, uint64_t t_rx_resp,
                          uint64_t reply_delay_dtu, int32_t range_mm)
{
    int32_t mm = range_mm >= 0 ? range_mm : -1;
    if (mm >= 0) {
        int32_t whole = mm / 1000;
        int32_t frac = mm % 1000;
        printk("INIT: seq=%u range=%d.%03d m (Tr=%u DTU)\n",
               seq, whole, frac, (uint32_t)reply_delay_dtu);
        LOG_INF("seq=%u range=%d.%03d m (Tr=%u DTU)", seq, whole, frac, (uint32_t)reply_delay_dtu);
    } else {
        printk("INIT: seq=%u no range\n", seq);
        LOG_WRN("seq=%u no range", seq);
    }

    LOG_DBG("timestamps tx=%llu rx=%llu", t_tx_poll, t_rx_resp);
}

static int32_t compute_range_mm(uint64_t t_tx_poll, uint64_t t_rx_resp, uint64_t reply_delay_dtu)
{
    if (t_rx_resp <= t_tx_poll) {
        return -1;
    }
    double T_round = (double)(t_rx_resp - t_tx_poll);
    double T_reply = (double)reply_delay_dtu;
    double tof_dtu = (T_round - T_reply) * 0.5;
    if (tof_dtu <= 0.0) {
        return -1;
    }
    double tof_s = tof_dtu * DWT_TIME_UNITS;
    double range_m = tof_s * SPEED_OF_LIGHT;
    int32_t range_mm = (int32_t)(range_m * 1000.0 + 0.5);
    return range_mm;
}

void main(void)
{   
    k_msleep(3000);
    usb_ready_wait();
    k_msleep(3000);
    printk("\n[DWM3001CDK] SSTWR initiator starting\n");
    LOG_INF("Initiator boot");
    if (cdc_dev && device_is_ready(cdc_dev)) {
        printk("Press 's' to toggle start/pause\n");
    }

    k_sem_init(&sem_tx_done, 0, 1);
    k_sem_init(&sem_rx_done, 0, 1);
    k_sem_init(&sem_rx_to, 0, 1);
    k_sem_init(&sem_rx_err, 0, 1);
    k_work_init(&uwb_isr_work, uwb_isr_work_handler);
    atomic_clear(&uwb_isr_pending);

    if (dw_port_init()) {
        printk("DW port init failed\n");
        LOG_ERR("dw_port_init failed");
        return;
    }
    if (irq_setup()) {
        printk("IRQ setup failed\n");
        LOG_ERR("irq_setup failed");
        return;
    }
    if (dw3110_radio_init()) {
        printk("DW3000 init failed\n");
        LOG_ERR("dw3110_radio_init failed");
        return;
    }

    printk("After init\n");

    dwt_setrxaftertxdelay(RESP_EXPECT_DLY_UUS);
    dwt_setrxtimeout(RESP_RX_TIMEOUT_UUS);
    dwt_setpreambledetecttimeout(8);

    uint8_t seq = 0;
    uint32_t success = 0;
    uint32_t missed = 0;
    bool loop_started = false;
    bool trace_once = true;

    while (1) {
        if (!loop_started) {
            printk("INIT: loop running\n");
            loop_started = true;
        }
        poll_console_keys();
        if (!running) {
            k_msleep(50);
            continue;
        }
        struct tof_msg_hdr poll = {
            .type = TOF_MSG_POLL,
            .seq = seq,
        };
        if (trace_once) {
            printk("INIT: tx stage=write data\n");
        }
        int tx_data_ret = dwt_writetxdata(sizeof(poll), (uint8_t *)&poll, 0);
        if (trace_once) {
            printk("INIT: tx stage=write data ret=%d\n", tx_data_ret);
        }
        if (tx_data_ret != DWT_SUCCESS) {
            missed++;
            printk("INIT: seq=%u writetxdata failed (success=%u missed=%u)\n",
                   seq, success, missed);
            LOG_ERR("writetxdata failed seq=%u (succ=%u miss=%u)", seq, success, missed);
            dwt_forcetrxoff();
            seq++;
            k_msleep(RANGING_PERIOD_MS);
            continue;
        }

        if (trace_once) {
            printk("INIT: tx stage=write fctrl\n");
        }
        dwt_writetxfctrl(sizeof(poll), 0, 1);
        if (trace_once) {
            printk("INIT: tx stage=starttx\n");
        }
        int tx_ret = dwt_starttx(DWT_START_TX_IMMEDIATE | DWT_RESPONSE_EXPECTED);
        if (trace_once) {
            printk("INIT: tx stage=starttx ret=%d\n", tx_ret);
            trace_once = false;
        }
        if (tx_ret != DWT_SUCCESS) {
            missed++;
            printk("INIT: seq=%u starttx failed (success=%u missed=%u)\n", seq, success, missed);
            LOG_ERR("starttx failed seq=%u (succ=%u miss=%u)", seq, success, missed);
            dwt_forcetrxoff();
            seq++;
            k_msleep(RANGING_PERIOD_MS);
            continue;
        }
        
        int tx_success = (k_sem_take(&sem_tx_done, K_MSEC(5)) == 0);
        if (!tx_success) {
            missed++;
            printk("INIT: seq=%u TX timeout (success=%u missed=%u)\n", seq, success, missed);
            LOG_WRN("TX timeout seq=%u (succ=%u miss=%u)", seq, success, missed);
            seq++;
            k_msleep(RANGING_PERIOD_MS);
            continue;
        }
        uint64_t t_tx_poll = last_tx_ts;

        int got_resp = 0;
        struct tof_resp_payload payload = {0};
        uint64_t t_rx_resp = 0;

        if (k_sem_take(&sem_rx_done, K_MSEC(20)) == 0) {
            if (rx_len >= sizeof(struct tof_msg_hdr) + sizeof(struct tof_resp_payload)) {
                struct tof_msg_hdr *hdr = (struct tof_msg_hdr *)rx_buf;
                if (hdr->type == TOF_MSG_RESP && hdr->seq == seq) {
                    memcpy(&payload, rx_buf + sizeof(struct tof_msg_hdr), sizeof(payload));
                    t_rx_resp = last_rx_ts;
                    got_resp = 1;
                }
            }
        } else {
            (void)k_sem_take(&sem_rx_to, K_NO_WAIT);
            (void)k_sem_take(&sem_rx_err, K_NO_WAIT);
        }

        int32_t range_mm = -1;
        if (got_resp) {
            uint64_t reply_dtu = payload.reply_delay_dtu ? payload.reply_delay_dtu : RESP_EXPECT_DLY_DTU;
            range_mm = compute_range_mm(t_tx_poll, t_rx_resp, reply_dtu);
            publish_range(seq, t_tx_poll, t_rx_resp, reply_dtu, range_mm);
            success++;
        } else {
            missed++;
            printk("INIT: seq=%u timeout (success=%u missed=%u)\n", seq, success, missed);
            LOG_WRN("timeout seq=%u (succ=%u miss=%u)", seq, success, missed);
        }

        seq++;
        poll_console_keys();
        k_msleep(RANGING_PERIOD_MS);
    }
}
