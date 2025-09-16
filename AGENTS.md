# Repository Guidelines

## Project Structure & Module Organization
Firmware lives in `firmware/` with Zephyr board samples under `boards/dwm3001cdk/dev_firmware/`; shared headers belong in `include/` and reusable sources in `src/`. The indoor positioning stack sits in `TDoA_Engine/`: `engine/` hosts the Python service, `tools/sim/` contains the UDP simulator, and `ui/` houses the Vite/React dashboard. Environment helpers live in `scripts/`, while project plans and vendor notes are under `docs/`.

## Build, Test, and Development Commands
Export your Python path once (`export WEST_PYTHON=$(which python)`) and build firmware with `west build -b nrf52833dk/nrf52833 firmware/boards/dwm3001cdk/dev_firmware/led_bringup -d build/led_bringup -p always`. Flash via `west flash -r jlink -d build/led_bringup`. The simulator stack expects `python -m pip install -r TDoA_Engine/requirements.txt`, then start the service with `uvicorn TDoA_Engine.engine.service.http_api:app --host 127.0.0.1 --port 8000`, feed data through `python TDoA_Engine/tools/sim/sim_uwb.py --cfg .../example_circle.yaml`, and launch the UI using `npm run dev` inside `TDoA_Engine/ui/`. Run a production build with `npm run build` to trigger `tsc --noEmit` plus Vite bundling.

## Coding Style & Naming Conventions
Zephyr modules follow 4-space indentation, K&R braces, and 100-character lines; keep filenames in `snake_case.c` or `.h`, macros in `UPPER_SNAKE_CASE`, and functions in `lower_snake_case`. Python engine code favors type-annotated, black-compatible formatting with modules and functions in `snake_case`. TypeScript/React files rely on Vite defaults: 2-space indent, PascalCase components, and `camelCase` hooks/utilities.

## Testing Guidelines
Firmware additions should ship with minimal Zephyr samples or `west twister` suites placed under `firmware/tests/`. Validate the localization logic with `python -m unittest discover -s TDoA_Engine/engine/tests`. For the UI, let `npm run build` surface type errors; add Vitest coverage if a feature warrants it. Document expected logs or captures when manual verification is unavoidable.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `docs:`) with subjects ≤72 characters. Reference hardware or simulator context in the body, e.g., "Tested on DWM3001 + LED bring-up". Pull requests should summarize scope, list touched subsystems, attach command output (build, flash, or simulator logs), and link any tracking issues. Include screenshots or short clips when UI behavior changes.

## Security & Configuration Tips
Never commit `.env` contents; duplicate `.env.example` instead. Keep vendor SDK archives and large binaries ignored. Prefer checked-in scripts such as `scripts/activate_zephyr_env.sh` to describe environment tweaks, and record any non-default port usage in the PR notes.

## Firmware ↔ Engine Data Contract (Shareable)
**Purpose:** give the DWM3001 firmware crew a snapshot of what the Python engine consumes so we can wire the stream without digging through the repo.

- **Static calibration (load once per boot).** Provide a JSON blob over `POST /set_anchors` (or drop it in `engine/logs/calibration.json`) with `anchors[]` entries like `{ "id": "A1", "pos": { "x": 0.0, "y": 0.0, "z": 2.4 } }`, plus optional `frame`, `map_id`, and initial `anchor_clocks[]` `{ "id": "A2", "offset_ns": -3.2, "drift_ppm": 0.5 }`. The engine keeps whatever you last posted and broadcasts it to the UI.
- **Per-tag epoch feed (stream at runtime).** Each tag transmission should result in one binary frame on USB CDC using the structs below. The engine parses this into `{tag_tx_seq, t_tx_tag, anchors[], clock}` and pushes it into the TDoA solver.

  ```c
  typedef struct __attribute__((packed)) {
    uint8_t  anchor_id;     // 1 → "A1", 2 → "A2", etc.
    uint64_t t_rx_ticks;    // raw DW3110 RX timestamp (ticks)
    float    q_ns2;         // variance estimate in ns^2 (use (0.15f * 0.15f) as default)
    float    cir_snr_db;    // optional quality hint (set 0 if unknown)
    float    nlos_score;    // optional; higher → worse
  } anc_rx_t;

  typedef struct __attribute__((packed)) {
    uint16_t magic;         // 0x01D3 framing tag
    uint16_t len;           // bytes after this field (anchors payload)
    uint32_t tag_tx_seq;    // monotonically increasing per tag TX
    double   t_tx_tag_s;    // host seconds when the tag fired (optional, set 0.0 if unavailable)
    uint8_t  n_anc;         // number of anc_rx_t records appended
    // anc_rx_t[n_anc] follows immediately
  } epoch_hdr_t;
  ```

  - The engine assumes DW3xxx tick rate `63_897_600_000.0` (≈15.65 ps); keep your `t_rx_ticks` in raw counter units so it can apply clock corrections.
  - If you have only coarse quality metrics, store them in `q_ns2` (variance of timing error). The solver falls back to 0.15 ns RMS if you send `0` or negative.
  - Always include the anchor that transmitted the sync pulse as `anchor_id = 1` first if possible; the parser will re-order but keeping A1 first avoids shuffling.
  - Target 50–100 Hz per tag; drop frames entirely when you have < (dimension+1) anchors instead of padding dummy values.
- **Clock maintenance (optional but recommended).** When you derive better offsets/drifts, post JSON `{ "anchor_clocks": [{ "id": "A1", "offset_ns": 0.0, "drift_ppm": 0.1 }] }` to `/set_anchors` or include it in the calibration payload. The engine stores these and compensates each anchor’s `t_rx_ticks` before solving.
- **Transport reminders.** Right now we expect USB CDC (Zephyr `cdc_acm_uart0`, 115200+ works) into a host bridge. If you prefer UDP, run a small host script to read CDC and forward the exact binary frames to `udp://127.0.0.1:9000`; the Python stack already listens there.

Ping the engine team if you want hooks for onboard TDoA (pairwise deltas instead of raw timestamps); the solver path exists but the parser needs a flag to accept it. For a full architecture walk-through, see `docs/tdoa_engine_report.md`.
