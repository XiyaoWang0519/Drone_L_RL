#include <stdint.h>
#include <stdbool.h>
#include "deca_rsl.h"

/* Minimal stubs to satisfy link for DEV_ID read demo. */
int16_t rsl_calculate_signal_power(
    int32_t channel_impulse_response,
    uint8_t quantization_factor,
    uint16_t preamble_accumulation_count,
    uint8_t dgc_decision,
    uint8_t rx_pcode,
    bool is_sts)
{
    (void)channel_impulse_response;
    (void)quantization_factor;
    (void)preamble_accumulation_count;
    (void)dgc_decision;
    (void)rx_pcode;
    (void)is_sts;
    return 0; /* 0 dBm (q8.8) placeholder */
}

int16_t rsl_calculate_first_path_power(
    uint32_t F1,
    uint32_t F2,
    uint32_t F3,
    uint16_t preamble_accumulation_count,
    uint8_t dgc_decision,
    uint8_t rx_pcode,
    bool is_sts)
{
    (void)F1;
    (void)F2;
    (void)F3;
    (void)preamble_accumulation_count;
    (void)dgc_decision;
    (void)rx_pcode;
    (void)is_sts;
    return 0; /* 0 dBm (q8.8) placeholder */
}


