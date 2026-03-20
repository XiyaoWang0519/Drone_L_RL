#ifndef UWB_BLINK_H
#define UWB_BLINK_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#include <zephyr/sys/byteorder.h>

#define UWB_FRAME_TYPE_BLINK 0xB0
#define UWB_FRAME_TYPE_SYNC  0xA0
#define UWB_FRAME_TYPE_CAL   0xC0

#define UWB_BROADCAST_ID 0xFF

enum uwb_cal_msg_type {
    UWB_CAL_MSG_DISCOVERY_REQ = 0x01,
    UWB_CAL_MSG_HELLO = 0x02,
    UWB_CAL_MSG_TWR_POLL = 0x03,
    UWB_CAL_MSG_TWR_RESP = 0x04,
    UWB_CAL_MSG_TWR_FINAL = 0x05,
    UWB_CAL_MSG_TWR_REPORT = 0x06,
    UWB_CAL_MSG_STATUS_REQ = 0x07,
    UWB_CAL_MSG_STATUS = 0x08,
    UWB_CAL_MSG_NETWORK = 0x09,
};

enum uwb_anchor_state_code {
    UWB_ANCHOR_STATE_BOOT = 0,
    UWB_ANCHOR_STATE_DISCOVERY = 1,
    UWB_ANCHOR_STATE_TWR_GRAPH = 2,
    UWB_ANCHOR_STATE_CLOCK_CAL = 3,
    UWB_ANCHOR_STATE_SELF_READY = 4,
    UWB_ANCHOR_STATE_NETWORK_READY = 5,
    UWB_ANCHOR_STATE_LOCALIZE = 6,
    UWB_ANCHOR_STATE_DEGRADED = 7,
    UWB_ANCHOR_STATE_FAULT = 8,
};

enum uwb_network_signal_code {
    UWB_NETWORK_SIGNAL_READY = 1,
    UWB_NETWORK_SIGNAL_DEGRADED = 2,
    UWB_NETWORK_SIGNAL_FAULT = 3,
};

#define UWB_BLINK_FRAME_LEN 6
#define UWB_SYNC_FRAME_LEN  9
#define UWB_CAL_FRAME_LEN   25

struct uwb_blink_frame {
    uint8_t frame_type;
    uint8_t beacon_id;
    uint16_t superframe_seq;
    uint8_t slot_id;
    uint8_t flags;
};

struct uwb_sync_frame {
    uint8_t frame_type;
    uint8_t master_id;
    uint16_t sync_seq;
    uint64_t t1_master;
};

struct uwb_cal_frame {
    uint8_t frame_type;
    uint8_t msg_type;
    uint8_t src_id;
    uint8_t dst_id;
    uint16_t seq;
    uint8_t slot_id;
    uint8_t flags;
    uint16_t value16;
    uint64_t ts_a;
    uint64_t ts_b;
    uint64_t ts_c;
};

static inline void uwb_put_u40_le(uint8_t *buf, uint64_t value)
{
    buf[0] = (uint8_t)(value & 0xFFU);
    buf[1] = (uint8_t)((value >> 8) & 0xFFU);
    buf[2] = (uint8_t)((value >> 16) & 0xFFU);
    buf[3] = (uint8_t)((value >> 24) & 0xFFU);
    buf[4] = (uint8_t)((value >> 32) & 0xFFU);
}

static inline uint64_t uwb_get_u40_le(const uint8_t *buf)
{
    return ((uint64_t)buf[4] << 32) | ((uint64_t)buf[3] << 24) |
           ((uint64_t)buf[2] << 16) | ((uint64_t)buf[1] << 8) |
           (uint64_t)buf[0];
}

static inline void uwb_blink_pack(uint8_t *buf, const struct uwb_blink_frame *frame)
{
    buf[0] = frame->frame_type;
    buf[1] = frame->beacon_id;
    sys_put_le16(frame->superframe_seq, &buf[2]);
    buf[4] = frame->slot_id;
    buf[5] = frame->flags;
}

static inline bool uwb_blink_unpack(const uint8_t *buf, size_t len,
                                    struct uwb_blink_frame *frame)
{
    if (!buf || !frame || len < UWB_BLINK_FRAME_LEN) {
        return false;
    }

    if (buf[0] != UWB_FRAME_TYPE_BLINK) {
        return false;
    }

    frame->frame_type = buf[0];
    frame->beacon_id = buf[1];
    frame->superframe_seq = sys_get_le16(&buf[2]);
    frame->slot_id = buf[4];
    frame->flags = buf[5];
    return true;
}

static inline void uwb_sync_pack(uint8_t *buf, const struct uwb_sync_frame *frame)
{
    buf[0] = frame->frame_type;
    buf[1] = frame->master_id;
    sys_put_le16(frame->sync_seq, &buf[2]);
    uwb_put_u40_le(&buf[4], frame->t1_master);
}

static inline bool uwb_sync_unpack(const uint8_t *buf, size_t len,
                                   struct uwb_sync_frame *frame)
{
    if (!buf || !frame || len < UWB_SYNC_FRAME_LEN) {
        return false;
    }

    if (buf[0] != UWB_FRAME_TYPE_SYNC) {
        return false;
    }

    frame->frame_type = buf[0];
    frame->master_id = buf[1];
    frame->sync_seq = sys_get_le16(&buf[2]);
    frame->t1_master = uwb_get_u40_le(&buf[4]);
    return true;
}

static inline void uwb_cal_pack(uint8_t *buf, const struct uwb_cal_frame *frame)
{
    buf[0] = frame->frame_type;
    buf[1] = frame->msg_type;
    buf[2] = frame->src_id;
    buf[3] = frame->dst_id;
    sys_put_le16(frame->seq, &buf[4]);
    buf[6] = frame->slot_id;
    buf[7] = frame->flags;
    sys_put_le16(frame->value16, &buf[8]);
    uwb_put_u40_le(&buf[10], frame->ts_a);
    uwb_put_u40_le(&buf[15], frame->ts_b);
    uwb_put_u40_le(&buf[20], frame->ts_c);
}

static inline bool uwb_cal_unpack(const uint8_t *buf, size_t len,
                                  struct uwb_cal_frame *frame)
{
    if (!buf || !frame || len < UWB_CAL_FRAME_LEN) {
        return false;
    }

    if (buf[0] != UWB_FRAME_TYPE_CAL) {
        return false;
    }

    frame->frame_type = buf[0];
    frame->msg_type = buf[1];
    frame->src_id = buf[2];
    frame->dst_id = buf[3];
    frame->seq = sys_get_le16(&buf[4]);
    frame->slot_id = buf[6];
    frame->flags = buf[7];
    frame->value16 = sys_get_le16(&buf[8]);
    frame->ts_a = uwb_get_u40_le(&buf[10]);
    frame->ts_b = uwb_get_u40_le(&buf[15]);
    frame->ts_c = uwb_get_u40_le(&buf[20]);
    return true;
}

#endif
