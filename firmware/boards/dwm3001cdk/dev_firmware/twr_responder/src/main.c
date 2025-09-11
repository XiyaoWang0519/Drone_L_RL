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
    uint64_t t_tx_final; /* include for responder-side range */
};

/* Conversion: UWB microsecond (uus) to device time units (DTU) */
#define UUS_TO_DWT_TIME 63898U

/* Practical constants */
#define RESP_DELAY_UUS 300U            /* ~300 us after POLL RX */
#define RX_TIMEOUT_UUS 10000U          /* 10 ms */

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

    /* Ensure device ready */
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

static void print_times_resp(uint8_t seq,
                             uint64_t t_rx_poll,
                             uint64_t t_tx_resp,
                             uint64_t t_rx_final,
                             double range_m)
{
    /* rssi/snr placeholders (requires full RSL impl; stubbed here) */
    int rssi_q8 = 0, snr_q8 = 0;
    printk("RESP: seq=%u rxP=%llu txR=%llu rxF=%llu range=%.2f rssiQ8=%d snrQ8=%d\n",
           seq, t_rx_poll, t_tx_resp, t_rx_final, range_m, rssi_q8, snr_q8);
}

void main(void)
{
    usb_ready_wait();
    printk("\n[DWM3001CDK] TWR Responder start\n");

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

    uint16_t rx_to = RX_TIMEOUT_UUS; /* in UUS units expected by dwt_setrxtimeout */
    uint16_t tx_ant = dwt_gettxantennadelay();
    uint8_t seq_last = 0;

    uint32_t idle_counter = 0;
    while (1) {
        /* --- Listen for POLL --- */
        dwt_setrxtimeout(rx_to);
        dwt_rxenable(DWT_START_RX_IMMEDIATE);

        int got = 0;
        /* Wait for RX done/timeout/error */
        if (k_sem_take(&sem_rx_done, K_MSEC(20)) == 0) {
            got = 1;
        } else {
            /* Drain timeout/error sems if set */
            (void)k_sem_take(&sem_rx_to, K_NO_WAIT);
            (void)k_sem_take(&sem_rx_err, K_NO_WAIT);
        }
        if (!got) {
            /* Rate-limited heartbeat to show we're alive */
            if ((idle_counter++ % 10u) == 0u) {
                printk("RESP: listening...\n");
            }
            continue; /* back to listen */
        }

        if (rx_len < sizeof(struct uwb_msg)) {
            continue;
        }
        struct uwb_msg *m = (struct uwb_msg *)rx_buf;
        if (m->type != MSG_POLL) {
            continue;
        }
        uint8_t seq = m->seq;
        uint64_t t_rx_poll = last_rx_ts;

        /* --- Prepare RESP --- */
        uint32_t resp_tx_time32 = (uint32_t)((t_rx_poll + ((uint64_t)RESP_DELAY_UUS * UUS_TO_DWT_TIME)) >> 8);
        dwt_setdelayedtrxtime(resp_tx_time32);
        /* Scheduled TX RMARKER (with antenna delay) */
        uint64_t t_tx_resp = (((uint64_t)(resp_tx_time32 & 0xFFFFFFFEUL)) << 8) + tx_ant;

        uint8_t tx_frame[sizeof(struct uwb_msg) + sizeof(uint64_t)] = {0};
        struct uwb_msg *r = (struct uwb_msg *)tx_frame;
        r->type = MSG_RESP;
        r->seq = seq;
        r->tag_id = 0x00;
        r->rsv = 0x00;
        memcpy(tx_frame + sizeof(struct uwb_msg), &t_tx_resp, sizeof(uint64_t));

        dwt_writetxdata(sizeof(tx_frame), tx_frame, 0);
        dwt_writetxfctrl(sizeof(tx_frame), 0, 1);

        /* After TX, keep RX on to catch FINAL */
        dwt_setrxaftertxdelay(0); /* immediate */
        dwt_setrxtimeout(15 * 1000U / 1U); /* ~15ms (UUS units expected) */
        if (dwt_starttx(DWT_START_TX_DELAYED | DWT_RESPONSE_EXPECTED) == DWT_ERROR) {
            /* Likely late, continue */
            continue;
        }
        (void)k_sem_take(&sem_tx_done, K_MSEC(5));

        /* --- Wait FINAL --- */
        uint64_t t_rx_final = 0;
        struct final_payload fp = {0};
        int have_final = 0;
        if (k_sem_take(&sem_rx_done, K_MSEC(20)) == 0) {
            if (rx_len >= sizeof(struct uwb_msg) + sizeof(struct final_payload)) {
                struct uwb_msg *mf = (struct uwb_msg *)rx_buf;
                if (mf->type == MSG_FINAL && mf->seq == seq) {
                    memcpy(&fp, rx_buf + sizeof(struct uwb_msg), sizeof(fp));
                    t_rx_final = last_rx_ts;
                    have_final = 1;
                }
            }
        } else {
            (void)k_sem_take(&sem_rx_to, K_NO_WAIT);
            (void)k_sem_take(&sem_rx_err, K_NO_WAIT);
        }

        double range_m = -1.0;
        if (have_final) {
            /* DS‑TWR asymmetric formula on responder side */
            /* Tround1 = t_rx_resp(i) - t_tx_poll(i)  [from initiator payload] */
            /* Tround2 = t_rx_final(r) - t_tx_resp(r) [local] */
            /* Treply1 = t_tx_resp(r) - t_rx_poll(r) [local scheduled] */
            /* Treply2 = t_tx_final(i) - t_rx_resp(i) [from initiator payload] */
            uint64_t Tround1 = (fp.t_rx_resp - fp.t_tx_poll);
            uint64_t Tround2 = (t_rx_final - t_tx_resp);
            uint64_t Treply1 = (t_tx_resp - t_rx_poll);
            uint64_t Treply2 = (fp.t_tx_final - fp.t_rx_resp);

            /* Compute Tprop in DTU, then meters. Avoid __int128 (not available on ARM). */
            /* With typical DS-TWR delays (<~1e9 DTU), 64-bit double products are safe enough. */
            double num = (double)Tround1 * (double)Tround2 - (double)Treply1 * (double)Treply2;
            double den = (double)Tround1 + (double)Tround2 + (double)Treply1 + (double)Treply2;
            double Tprop_dtu = num / den;
            range_m = Tprop_dtu * DWT_TIME_UNITS * 299702547.0; /* c from SDK shared_defines.h */
        }

        print_times_resp(seq, t_rx_poll, t_tx_resp, t_rx_final, range_m);

        /* Limit log rate */
        if (seq != seq_last) {
            k_msleep(100);
        }
        seq_last = seq;
    }
}
