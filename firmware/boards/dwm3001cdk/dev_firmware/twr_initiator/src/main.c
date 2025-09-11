#include <zephyr/kernel.h>
#include <zephyr/sys/printk.h>
#include <zephyr/usb/usb_device.h>
#include <zephyr/drivers/uart.h>
#include <string.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>

/* Qorvo DW3000 driver headers */
#include "deca_device_api.h"
#include "deca_probe_interface.h"

/* Port helpers from uwb_chipid demo */
int dw_port_init(void);
void dw_port_reset_assert(void);
void dw_port_reset_deassert(void);

/* === Simple shared message header === */
enum { MSG_POLL = 0x01, MSG_RESP = 0x02, MSG_FINAL = 0x03 };
struct __attribute__((packed)) uwb_msg {
    uint8_t type;
    uint8_t seq;
    uint8_t tag_id; /* optional */
    uint8_t rsv;
};

struct __attribute__((packed)) final_payload {
    uint64_t t_tx_poll;
    uint64_t t_rx_resp;
    uint64_t t_tx_final; /* include to help responder compute */
};

/* Conversion: UWB microsecond (uus) to device time units (DTU) */
#define UUS_TO_DWT_TIME 63898U

/* Practical constants */
#define RESP_EXPECT_DLY_UUS 300U      /* RX after POLL TX delay to expect RESP */
#define FINAL_DELAY_UUS     300U      /* delay from RESP RX to FINAL TX */
#define RX_TIMEOUT_UUS      15000U    /* 15 ms safety */

/* IRQ from DT (same node as uwb_chipid) */
#define UWB_NODE DT_NODELABEL(dwm3001c_uwb)
static const struct gpio_dt_spec uwb_irq = GPIO_DT_SPEC_GET(UWB_NODE, irq_gpios);

/* ISR -> callbacks -> semaphores */
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
    uint64_t v = ((uint64_t)ts[4] << 32) | ((uint64_t)ts[3] << 24) |
                 ((uint64_t)ts[2] << 16) | ((uint64_t)ts[1] << 8) | (uint64_t)ts[0];
    return v;
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

/* DWT IRQ -> run driver ISR */
static struct gpio_callback irq_cb;
static void uwb_irq_handler(const struct device *dev, struct gpio_callback *cb, uint32_t pins)
{
    ARG_UNUSED(dev); ARG_UNUSED(cb); ARG_UNUSED(pins);
    dwt_isr();
}

/* DWT event callbacks */
static void on_tx_done(const dwt_cb_data_t *cb)
{
    ARG_UNUSED(cb);
    last_tx_ts = get_tx_timestamp_u64();
    k_sem_give(&sem_tx_done);
}

static void on_rx_ok(const dwt_cb_data_t *cb)
{
    rx_len = cb->datalength;
    if (rx_len > sizeof(rx_buf)) rx_len = sizeof(rx_buf);
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

static void usb_ready_wait(void)
{
    /* Bring up USB device stack */
    (void)usb_enable(NULL);
    /* Allow some time for enumeration to start */
    k_msleep(100);

    /* Wait for a host terminal to open (DTR asserted) on CDC ACM */
    const struct device *const uart_dev = DEVICE_DT_GET(DT_NODELABEL(cdc_acm_uart0));

    /* If the CDC ACM device is not yet ready, poll briefly */
    int tries = 50; /* ~5s max */
    while (!device_is_ready(uart_dev) && tries--) {
        k_msleep(100);
    }

    /* Block until the host asserts DTR so the banner is not lost. */
    uint32_t dtr = 0;
    while (1) {
        (void)uart_line_ctrl_get(uart_dev, UART_LINE_CTRL_DTR, &dtr);
        if (dtr) {
            break;
        }
        k_msleep(50);
    }
    /* Small settle to avoid cutting the first line */
    k_msleep(50);
}

static int dw3110_radio_init(void)
{
    /* Hardware reset */
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

    /* Load a sane profile: Ch 9, 6.8 Mbps, PRF64, preamble 128, 4A SFD */
    dwt_config_t cfg = {
        .chan = 9,
        .txPreambLength = DWT_PLEN_128,
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

    /* Disable frame filtering */
    dwt_configureframefilter(DWT_FF_DISABLE, 0);

    /* Enable interrupts: TX done, RX good, RX timeout, preamble timeout */
    dwt_setinterrupt(DWT_INT_TXFRS_BIT_MASK |
                         DWT_INT_RXFCG_BIT_MASK |
                         DWT_INT_RXFTO_BIT_MASK |
                         DWT_INT_RXPTO_BIT_MASK,
                     0, DWT_ENABLE_INT);

    /* Register callbacks */
    dwt_callbacks_s cbs = {0};
    cbs.cbTxDone = on_tx_done;
    cbs.cbRxOk = on_rx_ok;
    cbs.cbRxTo = on_rx_to;
    cbs.cbRxErr = on_rx_err;
    dwt_setcallbacks(&cbs);

    return 0;
}

static int irq_setup(void)
{
    if (!device_is_ready(uwb_irq.port)) return -ENODEV;
    int ret = gpio_pin_configure_dt(&uwb_irq, GPIO_INPUT);
    if (ret) return ret;
    ret = gpio_pin_interrupt_configure_dt(&uwb_irq, GPIO_INT_EDGE_TO_ACTIVE);
    if (ret) return ret;
    gpio_init_callback(&irq_cb, uwb_irq_handler, BIT(uwb_irq.pin));
    gpio_add_callback(uwb_irq.port, &irq_cb);
    return 0;
}

static void print_times_init(uint8_t seq,
                             uint64_t t_tx_poll,
                             uint64_t t_rx_resp,
                             uint64_t t_tx_resp_remote,
                             uint64_t t_tx_final)
{
    /* rssi/snr placeholders */
    int rssi_q8 = 0, snr_q8 = 0;
    printk("INIT: seq=%u txP=%llu rxR=%llu txRr=%llu txF=%llu rssiQ8=%d snrQ8=%d\n",
           seq, t_tx_poll, t_rx_resp, t_tx_resp_remote, t_tx_final, rssi_q8, snr_q8);
}

void main(void)
{
    usb_ready_wait();
    printk("\n[DWM3001CDK] TWR Initiator start\n");

    k_sem_init(&sem_tx_done, 0, 1);
    k_sem_init(&sem_rx_done, 0, 1);
    k_sem_init(&sem_rx_to, 0, 1);
    k_sem_init(&sem_rx_err, 0, 1);

    if (dw_port_init()) {
        printk("Port init failed. Check overlay pins.\n");
        return;
    }
    if (irq_setup()) {
        printk("IRQ setup failed.\n");
        return;
    }
    if (dw3110_radio_init()) {
        printk("DW3110 init failed.\n");
        return;
    }

    /* Configure expected RESP window */
    dwt_setrxaftertxdelay(RESP_EXPECT_DLY_UUS);
    dwt_setrxtimeout(300); /* ~300 UUS for response frame body */
    dwt_setpreambledetecttimeout(5);

    uint16_t tx_ant = dwt_gettxantennadelay();
    uint8_t seq = 0;

    uint32_t no_resp_counter = 0;
    while (1) {
        /* --- POLL --- */
        uint8_t tx_frame[sizeof(struct uwb_msg)] = {0};
        struct uwb_msg *p = (struct uwb_msg *)tx_frame;
        p->type = MSG_POLL;
        p->seq = seq;
        p->tag_id = 0x01;
        p->rsv = 0x00;

        dwt_writetxdata(sizeof(tx_frame), tx_frame, 0);
        dwt_writetxfctrl(sizeof(tx_frame), 0, 1);
        dwt_starttx(DWT_START_TX_IMMEDIATE | DWT_RESPONSE_EXPECTED);
        (void)k_sem_take(&sem_tx_done, K_MSEC(5));
        uint64_t t_tx_poll = last_tx_ts;

        /* --- wait RESP --- */
        uint64_t t_rx_resp = 0;
        uint64_t t_tx_resp_remote = 0;
        int got_resp = 0;
        if (k_sem_take(&sem_rx_done, K_MSEC(20)) == 0) {
            if (rx_len >= sizeof(struct uwb_msg)) {
                struct uwb_msg *m = (struct uwb_msg *)rx_buf;
                if (m->type == MSG_RESP && m->seq == seq) {
                    t_rx_resp = last_rx_ts;
                    if (rx_len >= sizeof(struct uwb_msg) + sizeof(uint64_t)) {
                        memcpy(&t_tx_resp_remote, rx_buf + sizeof(struct uwb_msg), sizeof(uint64_t));
                    }
                    got_resp = 1;
                }
            }
        } else {
            /* drain */
            (void)k_sem_take(&sem_rx_to, K_NO_WAIT);
            (void)k_sem_take(&sem_rx_err, K_NO_WAIT);
        }
        if (!got_resp) {
            /* Retry next loop; print a heartbeat once per ~1s */
            if ((no_resp_counter++ % 10u) == 0u) {
                printk("INIT: no response, seq=%u\n", seq);
            }
            seq++;
            k_msleep(100);
            continue;
        }

        /* --- FINAL (embed two timestamps + final TX time) --- */
        uint32_t final_tx_time32 = (uint32_t)((t_rx_resp + ((uint64_t)FINAL_DELAY_UUS * UUS_TO_DWT_TIME)) >> 8);
        dwt_setdelayedtrxtime(final_tx_time32);
        uint64_t t_tx_final = (((uint64_t)(final_tx_time32 & 0xFFFFFFFEUL)) << 8) + tx_ant;

        uint8_t final_frame[sizeof(struct uwb_msg) + sizeof(struct final_payload)] = {0};
        struct uwb_msg *f = (struct uwb_msg *)final_frame;
        f->type = MSG_FINAL;
        f->seq = seq;
        f->tag_id = 0x01;
        f->rsv = 0x00;
        struct final_payload fp = {.t_tx_poll = t_tx_poll, .t_rx_resp = t_rx_resp, .t_tx_final = t_tx_final};
        memcpy(final_frame + sizeof(struct uwb_msg), &fp, sizeof(fp));

        dwt_writetxdata(sizeof(final_frame), final_frame, 0);
        dwt_writetxfctrl(sizeof(final_frame), 0, 1);
        if (dwt_starttx(DWT_START_TX_DELAYED) == DWT_ERROR) {
            /* Late, just skip */
            seq++;
            k_msleep(100);
            continue;
        }
        (void)k_sem_take(&sem_tx_done, K_MSEC(5));

        /* Log; initiator side does not compute range (no t_rx_final). */
        print_times_init(seq, t_tx_poll, t_rx_resp, t_tx_resp_remote, t_tx_final);

        seq++;
        /* Pace to ~10 Hz */
        k_msleep(100);
    }
}
