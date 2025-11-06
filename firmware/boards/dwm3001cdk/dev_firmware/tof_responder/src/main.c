#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/drivers/uart.h>
#include <zephyr/logging/log.h>
#include <zephyr/sys/printk.h>
#include <zephyr/usb/usb_device.h>

#include <stdbool.h>
#include <string.h>

/* Qorvo DW3000 driver headers */
#include "deca_device_api.h"
#include "deca_probe_interface.h"

/* Minimal Zephyr port helpers reused from uwb_chipid demo */
int dw_port_init(void);
void dw_port_reset_assert(void);
void dw_port_reset_deassert(void);

LOG_MODULE_REGISTER(tof_responder, LOG_LEVEL_INF);

/* -------------------------------------------------------------------------- */
/* Frame definitions shared with the initiator                                */
/* -------------------------------------------------------------------------- */

enum { TOF_MSG_POLL = 0x10, TOF_MSG_RESP = 0x11 };

struct __packed tof_msg_hdr {
    uint8_t type;
    uint8_t seq;
    uint8_t rsv0;
    uint8_t rsv1;
};

struct __packed tof_resp_payload {
    uint64_t resp_tx_ts;      /* 40-bit timestamp expanded to 64-bit */
    uint32_t reply_delay_dtu; /* echo the programmed delay for convenience */
};

/* -------------------------------------------------------------------------- */
/* Timing helpers                                                             */
/* -------------------------------------------------------------------------- */

#define SPEED_OF_LIGHT       299702547.0  /* m/s (from Qorvo shared_defines.h) */
#define DWT_TIME_UNITS       (1.0 / (499.2e6 * 128.0))
#define UUS_TO_DWT_TIME      63898U       /* 1 UUS (~1us) expressed in DTU */

#define RESP_DELAY_UUS       CONFIG_TOF_RESP_DELAY_UUS
#define RESP_DELAY_DTU       ((uint64_t)RESP_DELAY_UUS * UUS_TO_DWT_TIME)
#define POLL_RX_TIMEOUT_UUS  CONFIG_TOF_RESP_LISTEN_TIMEOUT_UUS

/* -------------------------------------------------------------------------- */
/* GPIO/IRQ wiring from the Devicetree overlay                                */
/* -------------------------------------------------------------------------- */

#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);

/* -------------------------------------------------------------------------- */
/* Driver event synchronisation                                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* USB helper                                                                 */
/* -------------------------------------------------------------------------- */

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
    /* Bring up the USB CDC ACM device */
    (void)usb_enable(NULL);

    cdc_dev = DEVICE_DT_GET(DT_NODELABEL(cdc_acm_uart0));
    for (int i = 0; i < 20 && !device_is_ready(cdc_dev); ++i) {
        k_msleep(100);
    }

    if (!cdc_dev || !device_is_ready(cdc_dev)) {
        return;
    }

    uint32_t dtr = 0;
    for (int i = 0; i < 40; ++i) {
        (void)uart_line_ctrl_get(cdc_dev, UART_LINE_CTRL_DTR, &dtr);
        if (dtr) {
            break;
        }
        k_msleep(50);
    }
    k_msleep(50);
}

/* -------------------------------------------------------------------------- */
/* IRQ plumbing                                                                */
/* -------------------------------------------------------------------------- */

static struct gpio_callback irq_cb;

static void uwb_irq_handler(const struct device *dev, struct gpio_callback *cb, uint32_t pins)
{
    ARG_UNUSED(dev);
    ARG_UNUSED(cb);
    ARG_UNUSED(pins);
    dwt_isr();
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

/* -------------------------------------------------------------------------- */
/* DW3000 driver callbacks                                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Radio bring-up                                                             */
/* -------------------------------------------------------------------------- */

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

    dwt_setinterrupt(DWT_INT_TXFRS_BIT_MASK |
                         DWT_INT_RXFCG_BIT_MASK |
                         DWT_INT_RXFTO_BIT_MASK |
                         DWT_INT_RXPTO_BIT_MASK,
                     0, DWT_ENABLE_INT);

    dwt_callbacks_s cbs = {0};
    cbs.cbTxDone = on_tx_done;
    cbs.cbRxOk = on_rx_ok;
    cbs.cbRxTo = on_rx_to;
    cbs.cbRxErr = on_rx_err;
    dwt_setcallbacks(&cbs);

    return 0;
}

/* -------------------------------------------------------------------------- */
/* Main loop                                                                  */
/* -------------------------------------------------------------------------- */

void main(void)
{
    usb_ready_wait();
    printk("\n[DWM3001CDK] SSTWR responder starting\n");
    LOG_INF("Responder boot");
    if (cdc_dev && device_is_ready(cdc_dev)) {
        printk("Press 's' to toggle start/pause\n");
    }

    k_sem_init(&sem_tx_done, 0, 1);
    k_sem_init(&sem_rx_done, 0, 1);
    k_sem_init(&sem_rx_to, 0, 1);
    k_sem_init(&sem_rx_err, 0, 1);

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

    uint16_t rx_timeout = POLL_RX_TIMEOUT_UUS; /* units expected by dwt_setrxtimeout */
    uint16_t tx_ant_delay = dwt_gettxantennadelay();

    uint32_t poll_counter = 0;

    while (1) {
        poll_console_keys();
        if (!running) {
            k_msleep(50);
            continue;
        }
        dwt_setrxtimeout(rx_timeout);
        dwt_rxenable(DWT_START_RX_IMMEDIATE);

        int got_poll = 0;
        if (k_sem_take(&sem_rx_done, K_MSEC(15)) == 0) {
            got_poll = 1;
        } else {
            (void)k_sem_take(&sem_rx_to, K_NO_WAIT);
            (void)k_sem_take(&sem_rx_err, K_NO_WAIT);
        }

        if (!got_poll) {
            if ((poll_counter++ % 50u) == 0u) {
                printk("RESP: listening...\n");
                LOG_DBG("listening (no poll yet)");
            }
            continue;
        }

        if (rx_len < sizeof(struct tof_msg_hdr)) {
            continue;
        }
        struct tof_msg_hdr *hdr = (struct tof_msg_hdr *)rx_buf;
        if (hdr->type != TOF_MSG_POLL) {
            continue;
        }
        uint8_t seq = hdr->seq;
        uint64_t t_rx_poll = last_rx_ts;

        /* Schedule the response */
        uint32_t resp_tx_time32 = (uint32_t)((t_rx_poll + RESP_DELAY_DTU) >> 8);
        dwt_setdelayedtrxtime(resp_tx_time32);
        uint64_t scheduled_tx = (((uint64_t)(resp_tx_time32 & 0xFFFFFFFEUL)) << 8) + tx_ant_delay;

        uint8_t tx_frame[sizeof(struct tof_msg_hdr) + sizeof(struct tof_resp_payload)] = {0};
        struct tof_msg_hdr *resp_hdr = (struct tof_msg_hdr *)tx_frame;
        resp_hdr->type = TOF_MSG_RESP;
        resp_hdr->seq = seq;

        struct tof_resp_payload *payload = (struct tof_resp_payload *)(tx_frame + sizeof(struct tof_msg_hdr));
        payload->resp_tx_ts = scheduled_tx;
        payload->reply_delay_dtu = (uint32_t)RESP_DELAY_DTU;

        dwt_writetxdata(sizeof(tx_frame), tx_frame, 0);
        dwt_writetxfctrl(sizeof(tx_frame), 0, 1);

        dwt_setrxaftertxdelay(0);
        dwt_setrxtimeout(0);
        if (dwt_starttx(DWT_START_TX_DELAYED) == DWT_ERROR) {
            printk("RESP: TX late (seq=%u)\n", seq);
            LOG_WRN("TX late seq=%u", seq);
            continue;
        }
        
        int tx_success = (k_sem_take(&sem_tx_done, K_MSEC(5)) == 0);
        uint64_t t_tx_resp;
        if (tx_success) {
            t_tx_resp = last_tx_ts;
        } else {
            /* TX semaphore timed out, use scheduled timestamp as fallback */
            t_tx_resp = scheduled_tx;
            LOG_WRN("TX timeout seq=%u, using scheduled timestamp", seq);
        }

        printk("RESP: seq=%u poll_ts=%llu resp_ts=%llu delay_dtu=%u\n",
               seq, t_rx_poll, t_tx_resp, payload->reply_delay_dtu);
        LOG_INF("responded seq=%u poll_ts=%llu resp_ts=%llu", seq, t_rx_poll, t_tx_resp);
        poll_console_keys();
    }
}


