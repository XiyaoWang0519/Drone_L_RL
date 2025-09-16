# Dev Notes — Engine Bring-Up and Simulator Integration

Date: 2025-09-14 (updated)

## Summary
- Added per-anchor clock compensation, robust TDoA weighting/gating, UDP ingest logging, and log replay support to the Python engine.
- Implemented auto-calibration helpers (`estimate_layout_from_twr`, `estimate_clock_params`) using metric MDS + linear clock fits.
- Expanded FastAPI service with `/start_log`, `/stop_log`, `/replay` plus richer `/healthz` diagnostics.
- Hardened solver performance with Huber weighting and anchor-quality heuristics (SNR/NLOS aware), feeding a constant-velocity EKF now running in full 3D.
- Created regression tests for solver, auto-calibration, and end-to-end pose computation; validated via the reference simulator.

## Implemented Files
- Parser: `TDoA_Engine/engine/io_parser.py`
- Solver (TDoA, GN + Huber): `TDoA_Engine/engine/solver/tdoa.py`
- EKF (constant-velocity, 2D baseline): `TDoA_Engine/engine/solver/ekf.py`
- Auto-cal helpers: `TDoA_Engine/engine/autocal.py`
- Service (FastAPI + WS + UDP ingest + logging/replay): `TDoA_Engine/engine/service/http_api.py`
- WS broadcast helper: `TDoA_Engine/engine/service/ws_stream.py`
- Log manager: `TDoA_Engine/engine/service/log_manager.py`
- Simulator (reference) + example config:
  - `TDoA_Engine/tools/sim/sim_uwb.py`
  - `TDoA_Engine/tools/sim/example_circle.yaml`
- Tests: `TDoA_Engine/engine/tests/test_engine.py`

## How to Run (Dev)
1. Create venv and install deps (FastAPI, uvicorn, numpy, pyyaml, websockets).
2. Start engine: `uvicorn TDoA_Engine.engine.service.http_api:app --host 127.0.0.1 --port 8000`
3. Kick off simulator (feeds UDP + optionally writes CSV/BIN logs):
   - `python TDoA_Engine/tools/sim/sim_uwb.py --cfg TDoA_Engine/tools/sim/example_circle.yaml`
4. APIs:
   - `GET /healthz` → engine status + anchor/clock info
   - `POST /set_anchors` with `{anchors:[...], anchor_clocks:[...]}` updates calibration and persists to `engine/logs/calibration.json`
   - `POST /start_log` (optional `{"label":"walk"}`) → starts raw+pose logging to `engine/logs/*`
   - `POST /stop_log` → closes log files
   - `POST /replay?file=<run>.bin` (also accepts `speed=` or `stop`) → replays captured epochs through solver/WS
   - WebSocket `/stream` delivers filtered pose stream (≈50 Hz)
5. Tests: `python -m unittest discover TDoA_Engine/engine/tests`

## Validation Results
- Unit tests (`python -m unittest discover TDoA_Engine/engine/tests`) cover solver accuracy, auto-calibration reconstruction, and clock-compensated pose solve.
- Simulator-driven end-to-end run (`uvicorn … & python tools/sim/sim_uwb.py …`) produces stable 3D pose updates with residual RMS ~1.5 ns and anchors_used=4 under biased clocks.
- Log files (`engine/logs/*.bin`, `*_poses.csv`) contain replayable epochs; `/replay` streams them back to clients at recorded cadence.

## Notes & Rationale
- Measurement weighting blends variance hints (`q`), CIR SNR, and NLOS scores before Huber down-weighting and 3σ gating; at least four anchors are required for the 3D solve.
- Clock correction solves `(t_anchor = alpha * t_ref + beta)`; offsets (ns) and drift (ppm) persist alongside anchors.
- Auto-cal layout uses classical MDS, aligns A1 to origin and A2 to +X, then enforces right-handed orientation to avoid mirror ambiguity.
- Logging writes binary packets with `<I` length prefix to simplify replay pacing.
- Replay cancels any in-flight session and resets the EKF before streaming.

## Outstanding Work / Next Steps
- Tune EKF process/measurement noise for full 3D trajectories and surface the Z covariance in telemetry.
- Integrate auto-calibration routines into a service endpoint that ingests stored TWR graphs and clock sync captures.
- Surface more telemetry (e.g., p50/p95 compute times) via `/healthz` and structured logs.
- Build lightweight CLI around `/start_log` + `/replay` for scripted runs, and connect the React UI to `/stream`.

## Troubleshooting
- Port conflicts: `lsof -nP -iUDP:9000`; `kill -9 <pid>` if needed.
- Replay paths: pass the filename returned by `/start_log` (`*.bin`). Use `file=stop` to end a replay loop.
- Expect slight warm-up during the first few epochs while the EKF converges (initial covariance = large).
- For new anchor layouts, update `engine/logs/calibration.json` via `/set_anchors` or replace with auto-cal output.

## Environment Assumptions
- Python 3.10+; validated on Python 3.11.6.
- Simulator defaults now include realistic clock offsets/drifts; engine compensates via stored calibration or `/set_anchors` payloads.
- No firmware changes required for this milestone; simulator mirrors the binary packet contract for drop-in firmware replacement.

