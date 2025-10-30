# TOF Initiator (Single-Sided TWR)

This Zephyr sample drives a DWM3001CDK board as the initiator of a
single-sided two-way ranging (SSTWR) exchange. It periodically transmits a
`POLL`, listens for the responder's `RESP`, and computes the one-way time of
flight based on a known reply delay. Distances are reported to both the USB CDC
console and RTT.

## Features

- DW3000 radio configuration aligned with the responder sample (channel 9,
  6.8 Mbps, PRF 64, 64-symbol preamble)
- Programmable response expectation delay, RX timeout, and poll period via
  Kconfig options
- USB CDC ACM console (J20) and RTT logging for scripts that prefer SEGGER RTT
- Per-range logs showing timestamps, computed distance, and timeout statistics

## Build & Flash

```sh
west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/tof_initiator \
    -d build/tof_initiator -p always
west flash -r jlink -d build/tof_initiator
```

After flashing, connect the J20 USB port and open a terminal (or monitor RTT)
to view range logs.

## Runtime behaviour

- Emits a POLL every `CONFIG_TOF_RANGING_PERIOD_MS`
- Waits for a RESP and computes range = `((T_round - T_reply) / 2) * c`
- Logs results to USB (`printk`) and RTT (`LOG_INF`)
- Tracks success/timeout counters for quick health checks

## Configuration knobs

The app exposes several Kconfig options (see `Kconfig`):

| Option | Default | Description |
| --- | --- | --- |
| `CONFIG_TOF_RESP_EXPECT_DELAY_UUS` | 250 | Expected responder delay (UWB µs) |
| `CONFIG_TOF_RESP_RX_TIMEOUT_UUS` | 1000 | Receive timeout for RESP (UWB µs) |
| `CONFIG_TOF_RANGING_PERIOD_MS` | 200 | Period between POLLs |

Use the same delay value as the responder (`CONFIG_TOF_RESP_DELAY_UUS`) for
accurate ranging.

## Expected USB output

```
[DWM3001CDK] SSTWR initiator starting
INIT: seq=17 range=1.23 m (Tr=15974500 DTU)
INIT: seq=18 range=1.22 m (Tr=15974500 DTU)
```

RTT output mirrors these entries, making it easy to capture on the host via
J-Link RTT tools.

