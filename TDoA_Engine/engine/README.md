# TDoA Engine

Python localization engine that ingests ranging/epoch data, estimates pose, and exposes data/services to the UI.

## Directory Map

- `service/http_api.py`
  - FastAPI entrypoint and REST/WebSocket surface.

- `service/ws_stream.py`
  - WebSocket streaming utilities for pose/metrics delivery.

- `service/log_manager.py`
  - Run logging/replay support.

- `solver/tdoa.py`
  - TDoA solver core.

- `solver/ekf.py`
  - EKF state estimation/smoothing.

- `io_parser.py`
  - Packet/IO normalization helpers.

- `autocal.py`
  - Automatic calibration utilities.

- `config.py`
  - Engine config defaults and shared constants.

- `tests/test_engine.py`
  - Unit/integration-style checks for core behavior.

- `logs/`
  - Generated runtime logs and replay captures (local artifacts).

## Run the Service

```bash
uvicorn TDoA_Engine.engine.service.http_api:app --host 127.0.0.1 --port 8000
```

Default interfaces:
- HTTP: `http://127.0.0.1:8000`
- Stream: `ws://127.0.0.1:8000/stream`

## Test

```bash
python -m unittest discover TDoA_Engine/engine/tests
```

## Data and Log Hygiene

- Treat `engine/logs/` as local runtime output.
- Keep large captures out of git unless explicitly needed for reproducible analysis.
- When sharing logs for debugging, include run metadata (input config, duration, firmware role mapping).
