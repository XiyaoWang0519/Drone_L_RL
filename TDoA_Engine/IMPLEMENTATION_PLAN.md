# Indoor UWB Localization — Refined Implementation Plan (Grounded in DWM3001CDK/DW3110)

**Course:** ECE496 (Univ. of Toronto)
**Team:** Xiyao Wang (王熹尧), Zequan Li, Zichao Sun

- Target: Indoor UWB TDoA localization with ≤ 10 cm RMS at ≥ 50 Hz, packaged as an offline desktop app.
- This plan merges and refines the previous build and simulation plans using the actual firmware and board details present in this repository.

---

## Table of Contents

1. Architecture at a glance
2. Ground truth from firmware and board (what we have today)
3. Data contracts (I/O interfaces)
4. Firmware ↔ Engine integration (transport, parser, bridging)
5. Engine: startup, auto‑calibration, and persistence
6. Engine: TDoA solver & EKF
7. Engine service (Python): modules & endpoints
8. Simulator (reference) and scenarios
9. Web UI (React/Vite) & Tauri packaging
10. Build/run scripts & repo layout
11. Tests, acceptance criteria, and telemetry
12. Risks & mitigations
13. Appendices (code snippets)

---

## 1) Architecture at a glance

```
[DWM3001CDK anchors (Zephyr C)]
        │  per‑epoch RX timestamps (USB CDC serial)
        ▼
[Local engine/bridge • Python]
  - parser (binary packets → epoch bundle)
  - auto‑calibration (anchors, clocks)
  - TDoA solver + EKF (10–50 Hz)
  - WebSocket: /stream (pose)
  - REST: /set_anchors, /start_log, /stop_log, /replay, /healthz
        │  JSON pose stream (WebSocket)
        ▼
[Web UI • React/Vite]
  - 2D map & anchors, position dot/trail, quality HUD
        │ (optional packaging)
        ▼
[Tauri .app]
  - bundles UI and launches engine as sidecar
```

Why this split:
- Keep embedded code minimal and timing‑safe; iterate math/UX in Python/JS.
- Stable I/O contract enables parallel work.

---

## 2) Ground truth from firmware and board

What is already implemented in this repo for DWM3001CDK (nRF52833 + DW3110):

- USB CDC console over J20; Zephyr `cdc_acm_uart0` is the console and shell:

```
/ {
    chosen {
        zephyr,console = &cdc_acm_uart0;
        zephyr,shell-uart = &cdc_acm_uart0;
    };
};

/* USB CDC */
&usbd { status = "okay"; };
&zephyr_udc0 {
    cdc_acm_uart0: cdc_acm_uart0 {
        compatible = "zephyr,cdc-acm-uart";
        label = "CDC_ACM_0";
    };
};
```

- DW3110 (DW3000 family) wired on SPIM3 with specific pins, CS/IRQ/RESET:

```
/* --- DW3110 on SPI --- */
/* 1) Enable the SPI controller actually wired to the DW3110 (DWM3001CDK uses SPIM3) */
&spi3 {
    status = "okay";
    /* Use pinctrl (required by nrf-spim binding) */
    pinctrl-0 = <&spi3_dwm_default>;
    pinctrl-1 = <&spi3_dwm_sleep>;
    pinctrl-names = "default", "sleep";
    /* DW3110 uses a GPIO-based CS line */
    cs-gpios = <&gpio1 6 GPIO_ACTIVE_LOW>;
};

/* 2) Create a child node describing the DW3110 on that SPI bus */
&spi3 {
    dwm3001c_uwb: dwm3001c_uwb@0 {
        compatible = "qorvo,dw3000";
        reg = <0>;
        spi-max-frequency = <8000000>; /* start slow, you can raise after probe */

        /* From DWM3001CDK board header/schematic */
        irq-gpios  = <&gpio1 2 GPIO_ACTIVE_HIGH>;  /* DW3110 IRQ → P1.02 */
        reset-gpios= <&gpio0 25 GPIO_ACTIVE_LOW>;  /* DW3110 RSTn → P0.25 */
    };
};

/* Custom pinctrl groups for SPIM3 wired to DW3110 on DWM3001CDK */
&pinctrl {
    spi3_dwm_default: spi3_dwm_default {
        group1 {
            psels = <NRF_PSEL(SPIM_SCK, 0, 3)>,
                    <NRF_PSEL(SPIM_MOSI, 0, 8)>,
                    <NRF_PSEL(SPIM_MISO, 0, 29)>;
        };
    };

    spi3_dwm_sleep: spi3_dwm_sleep {
        group1 {
            psels = <NRF_PSEL(SPIM_SCK, 0, 3)>,
                    <NRF_PSEL(SPIM_MOSI, 0, 8)>,
                    <NRF_PSEL(SPIM_MISO, 0, 29)>;
            low-power-enable;
        };
    };
};
```

- DW3110 node label is `dwm3001c_uwb` (used by drivers and ISR wiring).
- Radio profile in current samples: Channel 9, 6.8 Mbps, PRF 64M, preamble 128, IEEE 4A SFD, STS off:

```
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
```

- DW time‑stamp characteristics: the driver exposes 5‑byte TX/RX time‑stamps; for engine purposes we will standardize on a tick rate `tick_hz = 499_200_000.0` (≈ 2.0032 ns/tick) when converting to seconds.
- Current firmware samples include USB bring‑up (`usb_hello`), DW3000 probe/ID (`uwb_chipid`), and a DS‑TWR initiator/responder pair. A TDoA epoch streamer is not yet implemented on device; the engine will be developed against the defined packet contract and the simulator in the interim.

Build/flash (Zephyr):
- One‑time per shell: `export WEST_PYTHON=$(which python)`
- Example: `west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/uwb_chipid -d build/uwb_chipid -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"`
- Flash via J‑Link: `west flash -r jlink -d build/uwb_chipid`

---

## 3) Data contracts (I/O interfaces)

### 3.1 Static calibration input (loaded once at engine start)

```json
{
  "anchors": [
    {"id": "A1", "pos": {"x": 0.00, "y": 0.00, "z": 2.40}},
    {"id": "A2", "pos": {"x": 8.00, "y": 0.00, "z": 2.40}},
    {"id": "A3", "pos": {"x": 8.00, "y": 6.00, "z": 2.40}},
    {"id": "A4", "pos": {"x": 0.00, "y": 6.00, "z": 2.40}}
  ],
  "frame": "ENU",
  "map_id": "floor1_v1",
  "radio": { "channel": 9, "br": "6M8", "prf": "64M", "preamble": 128 }
}
```

### 3.2 Per‑epoch measurement bundle (solver input)

Minimal bundle (wireless‑sync anchors):

```json
{
  "tag_tx_seq": 102345,
  "t_tx_tag": 1736723456.420,
  "anchors": [
    {"id":"A1","t_rx_anc":76453219812.0,"q":0.25},
    {"id":"A2","t_rx_anc":76453219836.5,"q":0.25},
    {"id":"A3","t_rx_anc":76453219819.7,"q":0.25},
    {"id":"A4","t_rx_anc":76453219828.8,"q":0.25}
  ],
  "clock": { "tick_hz": 499200000.0, "mode": "wireless_sync" }
}
```

If anchors are not perfectly synchronized (recommended once available):

```json
{
  "anchor_clocks": [
    {"id":"A1","offset_ns":0.0,"drift_ppm":0.0,"valid":true},
    {"id":"A2","offset_ns":-3.2,"drift_ppm":0.5,"valid":true},
    {"id":"A3","offset_ns":1.1,"drift_ppm":-0.2,"valid":true},
    {"id":"A4","offset_ns":0.7,"drift_ppm":0.1,"valid":true}
  ]
}
```

Quality hints (for outlier rejection weighting):

```json
{
  "anchors": [
    {"id":"A2","t_rx_anc":..., "q":0.30, "cir_snr_db":18.5, "first_path_amp":1200, "nlos_score":0.1}
  ]
}
```

Alternate short‑path (if firmware computes TDoAs onboard):

```json
{
  "tag_tx_seq": 102345,
  "ref_anchor": "A1",
  "tdoa_ns": [
    {"pair":["A2","A1"],"dt_ns":24.5,"q":0.30},
    {"pair":["A3","A1"],"dt_ns":7.7,"q":0.25},
    {"pair":["A4","A1"],"dt_ns":16.8,"q":0.28}
  ]
}
```

### 3.3 Engine → UI pose stream (WebSocket `/stream`)

```json
{
  "t": 1736723456.430,
  "pose": {"x": 2.12, "y": -1.05, "z": 1.18, "yaw": null},
  "cov": [[0.04,0,0],[0,0.06,0],[0,0,0.09]],
  "status": {"anchors_used": 4, "residual_rms_ns": 1.6, "gdop": 1.8, "outliers": 1, "ref_anchor": "A1"},
  "tag_tx_seq": 102345,
  "map_id": "floor1_v1"
}
```

### 3.4 Control API (HTTP on the engine)

- `POST /set_anchors` → body = static calibration JSON
- `POST /start_log` → begin recording raw epochs & poses
- `POST /stop_log` → stop & flush to `logs/*.bin` + `*.csv`
- `POST /replay?file=...` → stream poses from a log (for UI dev)
- `GET  /healthz` → simple health probe

---

## 4) Firmware ↔ Engine integration

Transport in our environment:
- Preferred now: USB CDC serial from each anchor (`cdc_acm_uart0`), as implemented. The nRF52833 does not expose Ethernet/Wi‑Fi; direct UDP from device is not feasible. If UDP is desired for engine decoupling, run a small host bridge that reads CDC and forwards to UDP.

Binary packet format (to be implemented on firmware; simulator and engine already use it):

```c
// one anchor’s RX sample
typedef struct __attribute__((packed)) {
  uint8_t  anchor_id;       // 1..N (A1→1, A2→2, ...)
  uint64_t t_rx_ticks;      // DW3xxx RX time (ticks)
  float    q_ns2;           // variance hint (ns^2)
  float    cir_snr_db;      // optional
  float    nlos_score;      // optional
} anc_rx_t;

// per-tag TX epoch header
typedef struct __attribute__((packed)) {
  uint16_t magic;           // 0x01D3
  uint16_t len;             // bytes that follow (for framing)
  uint32_t tag_tx_seq;      // ++ per tag transmission
  double   t_tx_tag_s;      // optional system time (seconds)
  uint8_t  n_anc;           // count of anc entries that follow
  // anc_rx_t[n_anc] ...
} epoch_hdr_t;
```

Clock reports (periodic; optional initially): `{anchor_id, offset_ns, drift_ppm}` per anchor.

Python parser (serial or UDP):

```python
import struct
MAGIC = 0x01D3
HDR_FMT = "<HHI d B"          # magic, len, seq, t_tx_tag_s, n_anc
ANC_FMT = "<B Q f f f"        # anchor_id, t_rx_ticks, q_ns2, snr, nlos

def parse_packet(buf: bytes):
    magic, ln, seq, t_tx, n = struct.unpack_from(HDR_FMT, buf, 0)
    assert magic == MAGIC and ln == len(buf) - 4
    off = struct.calcsize(HDR_FMT)
    anc = []
    for _ in range(n):
        a = struct.unpack_from(ANC_FMT, buf, off)
        anc.append({"id": f"A{a[0]}", "t_rx_anc": float(a[1]), "q": a[2],
                    "cir_snr_db": a[3], "nlos_score": a[4]})
        off += struct.calcsize(ANC_FMT)
    return {"tag_tx_seq": seq, "t_tx_tag": t_tx,
            "anchors": anc, "clock": {"tick_hz": 499_200_000.0, "mode": "wireless_sync"}}
```

Bridge options on host:
- Direct: engine opens the CDC COM port and parses binary frames.
- CDC→UDP bridge: small Python script reads CDC and sends raw frames to `udp://127.0.0.1:9000`; engine listens on UDP.

---

## 5) Engine startup: auto‑calibration and persistence

Purpose: compute relative 3D anchor positions from inter‑anchor TWR, estimate clock offsets/drifts for TDoA, then align to the map.

Pipeline (5–10 s typical):
1. Ranging schedule: initiator orchestrates TWR on a connected graph. Take ≥ 10 samples per edge; keep median.
2. Outlier filtering: CIR/SNR gating → triangle inequality → RANSAC on distance graph.
3. Initial layout: metric MDS (2D/3D) to seed positions.
4. Refinement: robust bundle adjustment with Huber loss; optional planar constraints (z ≈ constant).
5. Gauge fix / map alignment: choose A1=(0,0,0), x‑axis through A2; or Procrustes fit to 2–3 surveyed points.
6. Clock model: from periodic sync blinks, fit per‑anchor `[offset_ns, drift_ppm]` with a small Kalman filter.
7. Persist: save `anchors[]`, `clock[]`, `map_align{R,t}`, timestamp; reuse on next boot unless residuals exceed threshold.

---

## 6) Engine: TDoA solver & EKF

Residual model (w.r.t. ref anchor A₁): compute `Δt_i = (t_rx,i − t_rx,1) + (offset_i − offset_1)`, convert to range difference `Δρ_i = c·Δt_i`, predict `\|x − a_i\| − \|x − a_1\|`, minimize robust cost with Huber.

Solver:
- Gauss–Newton or LM with analytic Jacobians; warm‑start from previous EKF; residual gating to drop outliers.

EKF (constant‑velocity):
- State `[x,y,(z), v_x,v_y,(v_z)]`; process = CV with small acceleration noise; measurement covariance from post‑fit JT·W·J inverse.

Performance: NumPy implementation typically < 0.2 ms/update for 6–8 anchors; JIT hot paths with Numba if needed.

---

## 7) Engine service (Python): modules & endpoints

Tech: Python 3.10+, FastAPI (HTTP), `websockets` for WS, `uvicorn`.

Module layout:
```
engine/
  __init__.py
  config.py                 # ports, WS_URL, tick_hz, Huber δ, etc.
  io_parser.py              # C packet → epoch bundle
  autocal.py                # TWR graph → anchors[], clock[]
  solver/
    tdoa.py                 # residuals, Jacobians, GN/LM
    ekf.py                  # CV-model EKF
  service/
    http_api.py             # /set_anchors, /start_log, /replay, /healthz
    ws_stream.py            # /stream publisher (10–50 Hz)
  logs/
  tests/
```

Run (dev):
```bash
uvicorn engine.service.http_api:app --host 127.0.0.1 --port 8000
```

CORS: allow `http://localhost:*` in dev. Config via `.env` or `engine/config.py`.

---

## 8) Simulator (reference) and scenarios

Purpose: feed the real parser/solver at ≥ 50 Hz with realistic timing noise/drift/dropouts; enables UI/engine development before firmware streaming is ready.

Inputs: YAML config with anchors, trajectory, noise, and transport (UDP/file). Outputs: live UDP or `logs/sim_epochs.{csv,bin}`.

Place the reference simulator under `tools/sim/sim_uwb.py` (see existing plan for concise working code). Default `tick_hz` matches engine (499.2 MHz) and radio params mirror the firmware (Channel 9, 6M8, PRF64, PLEN128).

Key scenarios:
- Static sanity (tag fixed), circle at center, figure‑8 near a wall, dropout storm, drift stress, NLOS burst.

---

## 9) Web UI (React + Vite) & Tauri packaging

UI (MVP): map panel + anchors, drone dot/trail, status HUD (fps, latency, anchors_used, residual_rms, gdop, outliers), controls (Connect/Record/Playback/Clear), settings (anchors JSON).

WS client:
```ts
export function connectWS(url: string, onPose: (p:any)=>void) {
  let ws = new WebSocket(url);
  ws.onmessage = (e) => onPose(JSON.parse(e.data));
  ws.onclose = () => setTimeout(() => connectWS(url, onPose), 1000);
  return ws;
}
```

Packaging with Tauri: UI as frontend; engine as sidecar started on app launch (`tauri::api::process::Command::new_sidecar`).

---

## 10) Build/run scripts & repo layout

Recommended structure as we implement:
```
/uwb-localization
  /docs
    implementation_guide.md
  /engine               # Python service
    /service /solver /tests ...
    pyproject.toml
  /ui                   # React/Vite
    package.json vite.config.ts
  /src-tauri            # Tauri wrapper
    tauri.conf.json src/main.rs
  /firmware             # Zephyr C (anchors/tag)
  /tools                # sim, log tools
```

Convenience scripts (root `package.json` via npm‑scripts or Make):
```json
{
  "scripts": {
    "ui:dev": "vite",
    "ui:build": "vite build && serve -s dist -l 3000",
    "engine:dev": "uvicorn engine.service.http_api:app --host 127.0.0.1 --port 8000",
    "dev:local": "concurrently \"npm:engine:dev\" \"npm:ui:dev\"",
    "app:build": "npm run -w ui build && tauri build"
  }
}
```

Zephyr build notes:
- Use the provided `firmware/boards/dwm3001cdk/dev_firmware/*` samples as templates.
- Keep K&R braces, 4‑space indent, 100‑char line limit (repo guideline).

---

## 11) Tests, acceptance criteria, telemetry

Unit tests (engine): Residual/Jacobian vs. finite differences; solver on synthetic anchors/TDoAs (median error < 5 cm 2D / < 8 cm 3D); EKF trajectory smoothing.

Integration: replay harness from `.csv/.bin` → engine → UI; Auto‑cal with planted outliers; latency budget p95 < 20 ms on a modern laptop.

Field: rectangle walk with taped markers; vary anchor geometry to stress GDOP.

Acceptance (MVP): RMS ≤ 0.15 m in 5×5×3 m volume; stream ≥ 50 Hz for 5 minutes; UI shows anchors_used ≥ 4, gdop < 2.5, residual_rms_ns stable; Tauri app launches engine offline.

Telemetry: engine logs p50/p95 compute times, inlier count, residual RMS; UI overlay: fps, WS latency, engine status; logs: raw epochs `.bin`, parsed `.csv`, poses `.csv`.

---

## 12) Risks & mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Anchor clocks drift | Periodic sync blinks; per‑anchor `[offset, drift]` Kalman model; re‑sync 100–200 ms. |
| NLOS reflections | Median across repeats; down‑weight low SNR/high `nlos_score`; Huber + gating. |
| Bad geometry (high GDOP) | ≥ 4 anchors in convex layout; UI GDOP indicators. |
| USB throughput/host jitter | Binary frames; modest payload sizes; CDC→UDP bridge if needed. |
| Packaging pitfalls | Tauri sidecar start on launch; codesign only when distributing. |

---

## 13) Appendices (code snippets)

### A) Minimal Gauss–Newton step (NumPy, 2D)

```python
import numpy as np

def huber_weights(r, delta=0.2):
  a = np.abs(r)
  w = np.ones_like(r)
  mask = a > delta
  w[mask] = delta / a[mask]
  return w

def solve_step(x, anchors_xyz, drho, a_ref=0, w=None):
  M = anchors_xyz.shape[0]; D = anchors_xyz.shape[1]
  a1 = anchors_xyz[a_ref]
  J = np.zeros((M-1, D)); f = np.zeros((M-1,))
  for i, ai in enumerate(anchors_xyz[1:], start=0):
    vi = x - ai; v1 = x - a1
    di = np.linalg.norm(vi) + 1e-9
    d1 = np.linalg.norm(v1) + 1e-9
    pred = di - d1
    f[i] = drho[i] - pred
    J[i,:] = (vi/di) - (v1/d1)
  if w is None: w = np.ones_like(f)
  W = np.diag(w)
  H = J.T @ W @ J
  g = J.T @ W @ f
  dx = np.linalg.solve(H, g)
  return x + dx, f
```

### B) Web UI — connect & HUD (TypeScript)

```ts
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000/stream";

export function Hud({status}:{status:any}){
  return (
    <div className="fixed top-2 right-2 text-xs bg-black/40 text-white px-2 py-1 rounded">
      <div>anchors_used: {status?.anchors_used ?? "-"}</div>
      <div>gdop: {status?.gdop?.toFixed?.(2) ?? "-"}</div>
      <div>residual_rms_ns: {status?.residual_rms_ns?.toFixed?.(2) ?? "-"}</div>
      <div>outliers: {status?.outliers ?? "-"}</div>
    </div>
  );
}
```

---

Notes specific to our hardware:
- Use `dwm3001c_uwb` node label for DW3110 access in Zephyr.
- Default radio profile aligns to Channel 9 / 6M8 / PRF64 / PLEN128 / IEEE 4A SFD (see snippet above). If the team changes PHY, update the calibration and simulator defaults accordingly.
- Transport is USB CDC; add a host bridge if the engine prefers UDP.
