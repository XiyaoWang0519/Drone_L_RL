# TDoA Engine UI + Simulator Loop

This folder now contains three pieces that let you develop against the indoor UWB localization engine without hardware:

1. **Python engine** (`engine/`) that exposes REST + WebSocket endpoints.
2. **Reference simulator** (`tools/sim/sim_uwb.py`) which generates realistic anchor measurements and feeds them to the engine over UDP.
3. **Vite/React UI** (`ui/`) for visualizing live pose solutions and controlling logging/replay.

The sections below stitch them together.

## Prerequisites

- Python 3.10+ with `pip`
- Node.js 18+ (Vite supports 18 LTS and 20+)

Install the Python dependencies once:

```bash
python -m pip install -r TDoA_Engine/requirements.txt
```

Install the UI dependencies once:

```bash
cd TDoA_Engine/ui
npm install
```

## Running the full simulation stack

Open three terminals in the repo root (`Drone_L_RL`).

### 1. Engine service

```bash
uvicorn TDoA_Engine.engine.service.http_api:app --host 127.0.0.1 --port 8000
```

This exposes REST endpoints on `http://127.0.0.1:8000` and the pose stream at `ws://127.0.0.1:8000/stream`.

### 2. Reference simulator

```bash
python TDoA_Engine/tools/sim/sim_uwb.py --cfg TDoA_Engine/tools/sim/example_circle.yaml
```

The simulator sends per-epoch packets to the engine (UDP port `9000`) at 50 Hz for 5 seconds, and also drops a replayable log under `TDoA_Engine/engine/logs/`.

You can tweak the YAML for other trajectories, durations, or noise levels.

### 3. React UI

```bash
cd TDoA_Engine/ui
npm run dev
```

Vite serves the UI on <http://127.0.0.1:5173>. The UI connects to the engine stream automatically (defaults match the commands above).

## What the UI provides

- **Map view** of anchors (from `/anchors`) and the tag trail with a highlighted current pose.
- **HUD** with solver metrics: FPS, WS latency, anchors used, GDOP, residual RMS, outliers, and EKF pose/velocity.
- **Controls** for connecting/disconnecting, clearing the trail, starting/stopping logs, and replaying `.bin` captures.
- **Anchor + clock editors** for pushing updated anchor layouts and per-anchor clock calibrations (`offset_ns`, `drift_ppm`) to `/set_anchors`.
- Toast notifications surface success/error states for engine interactions.

## Configuration tips

- Override endpoints by exporting `VITE_ENGINE_HTTP_URL` and `VITE_ENGINE_WS_URL` before `npm run dev`/`build`.
- The simulator writes `sim_epochs.{csv,bin}` into `engine/logs/`; use the replay control with `sim_epochs.bin` to loop the run in the UI.
- `npm run build` emits a static bundle under `ui/dist/` suitable for later Tauri packaging.
- For the reference simulator, mirror the YAML under **Anchors JSON** and **Anchor Clock Calibration** before starting the run so the engine compensates for the planted offsets/drift. Example clock entry:

  ```json
  [
    {"id": "A1", "offset_ns": 0.0, "drift_ppm": 0.0},
    {"id": "A2", "offset_ns": 2.5, "drift_ppm": 0.35},
    {"id": "A3", "offset_ns": -1.8, "drift_ppm": -0.20},
    {"id": "A4", "offset_ns": 0.0, "drift_ppm": 0.10}
  ]
  ```

## Troubleshooting

- If the UI shows "offline", confirm the engine is running and CORS headers allow your origin (default config allows `*`).
- UDP port busy? `lsof -nP -iUDP:9000` reveals conflicting processes.
- Restart the engine (or hit the replay stop button) to cancel an in-flight log replay.

## Testing clock-sync (time) error

- Quick intuition: a sync error of `Δt` seconds becomes a range-difference error of `c·Δt` meters (so `1 ns ≈ 0.30 m`).
- Unit test (shows localization degrades when clock offsets are not compensated): `python -m unittest discover -s TDoA_Engine/engine/tests`.
- End-to-end sim: run the stack with `example_circle.yaml`, then intentionally upload incorrect `anchor_clocks` (e.g., all zeros) in the UI and watch `residual_rms_ns` and pose error spike.
