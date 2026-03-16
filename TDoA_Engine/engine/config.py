import os

TICK_HZ = float(os.getenv("TDOA_TICK_HZ", "63897600000.0"))
HUBER_DELTA = 0.2  # For robust loss
WS_URL = os.getenv("TDOA_WS_URL", "ws://127.0.0.1:8000/stream")
HTTP_PORT = int(os.getenv("TDOA_HTTP_PORT", "8000"))
CALIBRATION_FILE = os.getenv("TDOA_CALIBRATION_FILE", "engine/logs/calibration.json")
LOG_ROOT = os.getenv("TDOA_LOG_ROOT", "engine/logs")
INGEST_MODE = os.getenv("TDOA_INGEST_MODE", "legacy_udp")
UDP_HOST = os.getenv("TDOA_UDP_HOST", "127.0.0.1")
UDP_PORT = int(os.getenv("TDOA_UDP_PORT", "9000"))
SERIAL_PORT = os.getenv("TDOA_SERIAL_PORT", "")
SERIAL_BAUDRATE = int(os.getenv("TDOA_SERIAL_BAUDRATE", "115200"))
SERIAL_TIMEOUT_S = float(os.getenv("TDOA_SERIAL_TIMEOUT_S", "1.0"))
