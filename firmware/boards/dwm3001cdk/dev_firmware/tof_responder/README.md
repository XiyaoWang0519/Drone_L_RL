# TOF Responder (Single-Sided TWR)

This Zephyr sample turns a DWM3001CDK board into the responder side of a
single-sided two-way ranging (SSTWR) link. It waits for a `POLL` frame from an
initiator, waits a programmable delay, and transmits a `RESP` frame containing
its transmit timestamp so the initiator can compute distance.

## Features

- DW3000 radio configured for channel 9, 6.8 Mbps, PRF 64, 64-symbol preamble
- Fixed responder reply delay configurable via `CONFIG_TOF_RESP_DELAY_UUS`
- USB CDC ACM console (J20) plus RTT logging (via J-Link on J9)
- Emits diagnostic lines for each response with timestamps and delay data

## Build & Flash

```sh
west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/tof_responder \
    -d build/tof_responder -p always
west flash -r jlink -d build/tof_responder
```

After flashing, connect the J20 USB port and open a terminal (or run
`west attach` for RTT) to view logs. The board prints `RESP:` lines whenever a
poll is processed.

## Runtime behaviour

- Listens continuously for POLL frames and replies after `CONFIG_TOF_RESP_DELAY_UUS`
- Logs reply timestamps to both USB (`printk`) and RTT (`LOG_INF`)
- Emits a heartbeat message (`RESP: listening...`) while idle

## Configuration knobs

The app exposes Kconfig options (see `Kconfig`):

| Option | Default | Description |
| --- | --- | --- |
| `CONFIG_TOF_RESP_DELAY_UUS` | 250 | Reply delay between POLL RX and RESP TX (UWB µs) |
| `CONFIG_TOF_RESP_LISTEN_TIMEOUT_UUS` | 10000 | Receive timeout while waiting for the POLL |

Ensure the initiator uses the same delay value to keep range estimates accurate.

## Expected USB output

```
[DWM3001CDK] SSTWR responder starting
RESP: listening...
RESP: seq=5 poll_ts=256307532 resp_ts=256312071 delay_dtu=15974500
```

RTT output mirrors the USB logs for host scripts that prefer SEGGER RTT.

