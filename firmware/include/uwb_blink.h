#ifndef UWB_BLINK_H
#define UWB_BLINK_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#include <zephyr/sys/byteorder.h>

#define UWB_BLINK_FRAME_LEN 5

struct uwb_blink_frame {
    uint8_t beacon_id;
    uint16_t superframe_seq;
    uint8_t slot_id;
    uint8_t flags;
};

static inline void uwb_blink_pack(uint8_t *buf, const struct uwb_blink_frame *frame)
{
    buf[0] = frame->beacon_id;
    sys_put_le16(frame->superframe_seq, &buf[1]);
    buf[3] = frame->slot_id;
    buf[4] = frame->flags;
}

static inline bool uwb_blink_unpack(const uint8_t *buf, size_t len,
                                    struct uwb_blink_frame *frame)
{
    if (!buf || !frame || len < UWB_BLINK_FRAME_LEN) {
        return false;
    }

    frame->beacon_id = buf[0];
    frame->superframe_seq = sys_get_le16(&buf[1]);
    frame->slot_id = buf[3];
    frame->flags = buf[4];
    return true;
}

#endif
