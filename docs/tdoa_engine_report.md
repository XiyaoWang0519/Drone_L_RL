# TDoA Engine Integration Report

**Audience:** firmware and systems teammates integrating the indoor UWB TDoA engine with the DWM3001CDK anchors.

## Overview
The localization stack pairs embedded anchors with a Python-based solver and a React UI. Anchors record DW3110 receive timestamps for each tag broadcast, stream those measurements to the host, and the engine converts them into poses that downstream services consume via WebSocket or logs.

```
[DWM3001CDK anchors + coordinator (Zephyr C)]
   └─ per-epoch binary frames over USB CDC (optional host UDP bridge)
        ↓
[Python engine • TDoA_Engine/engine]
   ├─ io_parser → epoch dicts
   ├─ solver.tdoa → Gauss–Newton solver
   ├─ solver.ekf → constant-velocity EKF
   ├─ service.http_api → REST control
   └─ service.ws_stream → WebSocket pose feed
        ↓
[UI • TDoA_Engine/ui] + logs + replay tools
```

## End-to-End Data Flow
1. **Tag transmit & RX capture** – Firmware schedules a tag blink. Each anchor latches the DW3110 RX timestamp (`t_rx_ticks`) and any quality metrics (SNR, NLOS score, variance estimate).
2. **Epoch framing** – A coordinator MCU (one anchor or an external hub) assembles `epoch_hdr_t` + `anc_rx_t[]` into a packed little-endian frame. Every frame is self-contained with its own sequence number and anchor list.
3. **Transport** – Frames leave the MCU via USB CDC (`cdc_acm_uart0`). Optionally, a host-side bridge forwards the raw bytes to UDP port 9000; otherwise the engine reads serial directly.
4. **Parsing** – `engine/io_parser.py` validates `magic=0x01D3`, checks the embedded length, unpacks anchors, and yields:
   ```python
   {
     "tag_tx_seq": int,
     "t_tx_tag": float,
     "anchors": [
       {"id": "A1", "t_rx_anc": float, "q": float,
        "cir_snr_db": float, "nlos_score": float}
     ],
     "clock": {"tick_hz": 63_897_600_000.0, "mode": "wireless_sync"}
   }
   ```
5. **Ingestion & weighting** – `service/http_api.py` filters anchors without calibration, converts ticks to seconds via `EngineState.convert_anchor_time`, derives measurement variances from `q_ns2` and quality hints, and discards epochs with too few anchors for the current dimension.
6. **TDoA solving** – `solver/tdoa.py` builds range differences against the reference anchor (defaults to `A1`), runs a robust Gauss–Newton iteration with Huber down-weighting, and returns position, residuals, and an approximate covariance.
7. **Temporal smoothing** – The constant-velocity EKF in `solver/ekf.py` fuses successive solver outputs using adaptive process noise (`q_acc`), producing smoothed pose and velocity estimates.
8. **Publishing & logging** – Finalized poses plus diagnostics (anchors used, GDOP, residual RMS, outlier count) flow to:
   - WebSocket `/stream` (`service/ws_stream.py`)
   - CSV + binary logs via `service/log_manager.py`
   - Optional replay pipeline (`POST /replay`) for offline evaluation.

## Engine Components
- **Configuration & state** – `EngineState` stores anchor positions, clock corrections, solver dimension, EKF instance, and references to broadcast/log managers. Defaults fall back to a 4-anchor rectangular layout if `/set_anchors` was never called.
- **Clock handling** – `convert_anchor_time` applies per-anchor offset/drift: `t_sec = (ticks / tick_hz - offset_ns) / (1 + drift_ppm·1e-6)`. Missing entries default to zero offset/drift, so keeping the calibration JSON updated is critical.
- **Quality weighting** – Measurement variance `q_ns2` (ns²) converts to meters, then scales by CIR SNR and NLOS score. Invalid or negative variances revert to `(0.15 ns)²`.
- **Outlier gating** – Residuals that exceed a configurable sigma (`GATING_SIGMA = 3.0`) trigger anchor drops for that epoch. If the entire solve degenerates, the EKF prediction stands without an update.
- **APIs** –
  - `POST /set_anchors` loads anchor geometry and clock parameters and persists them under `engine/logs/calibration.json`.
  - `POST /start_log` / `POST /stop_log` manage raw epoch + pose recordings.
  - `POST /replay?file=...` replays captures, feeding the solver as if they were live.
  - `GET /healthz` responds once the FastAPI app is running.

## Data Contracts
### Per-epoch Binary Frame
```c
typedef struct __attribute__((packed)) {
  uint8_t  anchor_id;    // 1 → "A1", 2 → "A2", ...
  uint64_t t_rx_ticks;   // raw DW3110 timestamp
  float    q_ns2;        // variance of timing error in ns^2 (default: (0.15f)^2)
  float    cir_snr_db;   // optional, set 0 if unknown
  float    nlos_score;   // optional, higher is worse
} anc_rx_t;

typedef struct __attribute__((packed)) {
  uint16_t magic;        // 0x01D3
  uint16_t len;          // bytes that follow (anchors payload)
  uint32_t tag_tx_seq;   // monotonically increasing per tag TX
  double   t_tx_tag_s;   // host seconds when the tag fired (0.0 if unavailable)
  uint8_t  n_anc;        // number of anc_rx_t entries
  // anc_rx_t[n_anc] immediately follows
} epoch_hdr_t;
```

### Calibration & Clock JSON
```json
{
  "anchors": [
    {"id": "A1", "pos": {"x": 0.0, "y": 0.0, "z": 2.4}},
    {"id": "A2", "pos": {"x": 8.0, "y": 0.0, "z": 2.4}}
  ],
  "frame": "ENU",
  "map_id": "floor1_v1",
  "anchor_clocks": [
    {"id": "A2", "offset_ns": -3.2, "drift_ppm": 0.5, "valid": true}
  ]
}
```
Send via `POST /set_anchors` or drop under `engine/logs/calibration.json` before streaming data.

## Firmware Deliverables
1. **Timestamp capture + aggregation** – Ensure every anchor captures `t_rx_ticks` for each tag transmission and forwards it to the coordinator MCU instance responsible for USB streaming.
2. **USB CDC streaming task** – Implement a Zephyr task that emits the packed frames at ≥50 Hz. Use little-endian packing, include the 0x01D3 magic word, and omit anchors entirely if you miss a measurement (do not send zeros).
3. **Clock estimation** – Periodically compute `offset_ns`/`drift_ppm` from your synchronization routine and POST updates to `/set_anchors`. Even coarse offsets help the engine’s `convert_anchor_time` stay within the solver’s capture range.
4. **Quality metrics** – Populate `q_ns2` based on CIR variance or heuristic ranges, then fold in available SNR/NLOS indicators. These drive weighting and robustness inside the solver.
5. **Resilience & scheduling** – Handle bursty conditions: throttle to desired update rate, debounce USB back-pressure, and recover gracefully from missed sync pulses (simply skip those anchors for that frame).
6. **(Optional) Onboard preprocessing** – If MCU-side pairwise TDoA calculations become necessary, align output with the `tdoa_ns` schema from `IMPLEMENTATION_PLAN.md` and notify the engine team so the parser can branch accordingly.

## Validation & Tooling
- **Simulator** – `python TDoA_Engine/tools/sim/sim_uwb.py --cfg .../example_circle.yaml` emits identical frames with configurable noise; use it to validate the host ingestion path before real hardware streams.
- **Unit tests** – Run `python -m unittest discover -s TDoA_Engine/engine/tests` to regress solver logic.
- **UI** – `npm run dev` in `TDoA_Engine/ui` visualizes the live pose and solver diagnostics; useful for spotting anchor dropouts or clock skew.
- **Logs & replay** – `POST /start_log` capture sessions, then `POST /replay?file=...` to reproduce issues offline. Logs include both raw frames (`*.bin`) and solver summaries (`*_poses.csv`).

## Open Items / Questions for Firmware
- Expected maximum anchor separation and installation variance (informs solver tuning for GDOP and default priors).
- Realistic clock drift/offset ranges after your planned synchronization routine; needed to size EKF gating thresholds.
- Availability of CIR-based quality metrics on-device or whether we should derive them host-side from additional telemetry.
- Target throughput per tag and number of concurrent tags the firmware will support (impacts sequencing logic in the engine).

Coordinate with the engine maintainers once the first CDC frames are ready so we can run joint bring-up and adjust solver thresholds if necessary.
