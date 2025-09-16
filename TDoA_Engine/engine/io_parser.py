import struct
from typing import List, Dict, Any

# Binary framing as per IMPLEMENTATION_PLAN.md
MAGIC = 0x01D3
HDR_FMT = "<HHI d B"           # magic, len, seq, t_tx_tag_s, n_anc
ANC_FMT = "<B Q f f f"         # anchor_id, t_rx_ticks, q_ns2, snr, nlos

def parse_packet(buf: bytes) -> Dict[str, Any]:
    """Parse a single binary epoch packet into a Python dict.

    Returns keys: tag_tx_seq, t_tx_tag, anchors[], clock{}
    Anchor entries: {id, t_rx_anc, q, cir_snr_db, nlos_score}
    """
    if len(buf) < struct.calcsize(HDR_FMT):
        raise ValueError("packet too short")
    magic, ln, seq, t_tx, n = struct.unpack_from(HDR_FMT, buf, 0)
    if magic != MAGIC:
        raise ValueError("bad magic")
    if ln != len(buf) - 4:
        raise ValueError("bad length field")
    off = struct.calcsize(HDR_FMT)
    anchors: List[Dict[str, Any]] = []
    anc_sz = struct.calcsize(ANC_FMT)
    for _ in range(n):
        if off + anc_sz > len(buf):
            raise ValueError("truncated anchor entry")
        a = struct.unpack_from(ANC_FMT, buf, off)
        anchors.append({
            "id": f"A{a[0]}",
            "t_rx_anc": float(a[1]),
            "q": float(a[2]),
            "cir_snr_db": float(a[3]),
            "nlos_score": float(a[4]),
        })
        off += anc_sz
    return {
        "tag_tx_seq": int(seq),
        "t_tx_tag": float(t_tx),
        "anchors": anchors,
        "clock": {"tick_hz": 499_200_000.0, "mode": "wireless_sync"},
    }
