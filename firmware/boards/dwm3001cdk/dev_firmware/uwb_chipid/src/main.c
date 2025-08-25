#include <zephyr/kernel.h>
#include <zephyr/sys/printk.h>
#include <zephyr/usb/usb_device.h>

/* Qorvo DW3000 driver headers from SDK */
#include "deca_device_api.h"   /* provides dwt_probe(), dwt_readdevid(), etc. */

/* Our Zephyr probe interface for the driver */
#include "deca_probe_interface.h"

/* Our tiny port layer */
int dw_port_init(void);

/* Optional: bring USB up and wait briefly for DTR so early prints aren’t lost */
static void usb_ready_wait(void) {
    (void)usb_enable(NULL);
    k_msleep(500);
}

void main(void)
{
    usb_ready_wait();
    printk("\n[DWM3001CDK] uwb_chipid starting...\n");

    if (dw_port_init()) {
        printk("Port init failed (SPI/GPIO not ready). Check overlay pins.\n");
        return;
    }

    /* Hardware reset sequence */
    extern void dw_port_reset_assert(void);
    extern void dw_port_reset_deassert(void);
    dw_port_reset_assert();
    k_msleep(2);
    dw_port_reset_deassert();
    k_msleep(5);

    /* Probe/select correct DW3000 device driver then read DEV_ID */
    int ret = dwt_probe((struct dwt_probe_s *)&dw3000_probe_interf);
    if (ret < 0) {
        printk("dwt_probe() failed: %d\n", ret);
    }

    uint32_t dev_id = dwt_readdevid();
    printk("DW3xxx DEV_ID = 0x%08x\n", dev_id);
    printk("Expected for DW3110: 0xDECA0302\n");

    /* Known values: DW3110 → 0xDECA0302, DW3120 → 0xDECA0312 (per driver + forum). */
    /* (DW3000 family encodes 0xDECA | model 0x03 | variant/rev nibbles.) */

    while (1) {
        k_msleep(1000);
    }
}
