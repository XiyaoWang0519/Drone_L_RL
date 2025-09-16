# tools/sim/sim_uwb.py
import math, random, socket, struct, time, csv, json
from dataclasses import dataclass
from typing import List, Tuple

TICK_HZ = 499_200_000.0
MAGIC = 0x01D3
HDR_FMT = "<HHI d B"           # magic, len, seq, t_tx_tag_s, n_anc
ANC_FMT = "<B Q f f f"         # anchor_id, t_rx_ticks, q_ns2, snr, nlos
C_AIR = 299_702_547.0          # m/s

@dataclass
class Anchor:
  id: str; x: float; y: float; z: float; offset_ns: float; drift_ppm: float

def world2tof(x:Tuple[float,float,float], a:Anchor, t_true:float)->float:
  """Return anchor-reported RX time in seconds, incl. clock offset/drift."""
  dx, dy, dz = x[0]-a.x, x[1]-a.y, x[2]-a.z
  tof = math.sqrt(dx*dx+dy*dy+dz*dz) / C_AIR
  t_rx_true = t_true + tof
  # Anchor clock
  eps = a.drift_ppm * 1e-6
  theta = a.offset_ns * 1e-9
  t_rx_anc = (1.0 + eps) * t_rx_true + theta
  return t_rx_anc

def traj_point(kind:str, t:float, center, R, v)->Tuple[float,float,float]:
  cx, cy, cz = center["x"], center["y"], center["z"]
  if kind == "static":
    return (cx, cy, cz)
  if kind == "line":
    return (cx + v*t, cy, cz)
  if kind == "circle":
    w = v / (R if R>0 else 1.0)
    return (cx + R*math.cos(w*t), cy + R*math.sin(w*t), cz)
  if kind == "figure8":
    w = v / (R if R>0 else 1.0)
    return (cx + R*math.sin(w*t), cy + R*math.sin(2*w*t)/2.0, cz)
  raise ValueError("bad trajectory kind")

def pack_epoch(seq:int, t_tx:float, meas:list)->bytes:
  n = len(meas)
  payload = struct.pack(HDR_FMT, MAGIC, 0, seq, t_tx, n)
  for m in meas:
    payload += struct.pack(ANC_FMT, m["aid"], m["ticks"], m["q_ns2"], m["snr_db"], m["nlos_score"])
  # fill len field (bytes after magic+len)
  total = len(payload)
  payload = struct.pack("<H", MAGIC) + struct.pack("<H", total-4) + payload[4:]
  return payload

def run_sim(cfg):
  rnd = random.Random(cfg["seed"])
  anchors = [Anchor(a["id"], a["pos"]["x"], a["pos"]["y"], a["pos"]["z"],
                    a.get("offset_ns",0.0), a.get("drift_ppm",0.0)) for a in cfg["anchors"]]
  # UDP socket
  sock = None
  if cfg["transport"]["mode"] == "udp":
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    dst = (cfg["transport"]["udp_host"], cfg["transport"]["udp_port"])
  # CSV
  csvw = None
  if cfg["transport"].get("out_csv"):
    csvw = csv.writer(open(cfg["transport"]["out_csv"], "w", newline=""))
    csvw.writerow(["seq","t_tx","anchor","t_rx_ticks","q_ns2","snr_db","nlos_score"])
  # BIN
  binf = None
  if cfg["transport"].get("out_bin"):
    binf = open(cfg["transport"]["out_bin"], "wb")

  rate = cfg["rate_hz"]; dt = 1.0/rate
  t0 = time.time()
  base = float(cfg.get("epoch_base_s", 1.0))
  for k in range(int(cfg["duration_s"] * rate)):
    t_true = base + k*dt
    x = traj_point(cfg["trajectory"]["kind"], t_true,
                   cfg["trajectory"]["center"], cfg["trajectory"]["radius_m"], cfg["trajectory"]["speed_mps"])
    meas = []
    for a in anchors:
      # ToA in anchor clock
      t_rx = world2tof(x, a, t_true)
      # Noise
      eta = rnd.gauss(0.0, cfg["noise"]["toa_sigma_ns"]) * 1e-9
      nlos = (1 if rnd.random() < cfg["noise"]["nlos_prob"] else 0)
      bias = rnd.expovariate(1.0/cfg["noise"]["nlos_bias_ns_exp_mean"])*1e-9 if nlos else 0.0
      drop = (rnd.random() < cfg["noise"]["dropout_prob"])
      if not drop:
        t_meas = t_rx + eta + bias
        ticks = int(round(t_meas * TICK_HZ))
        q_ns2 = (cfg["noise"]["toa_sigma_ns"] ** 2)
        snr = 20.0 + rnd.gauss(0, 3.0) - (bias*1e9)/2.0  # worse SNR when biased
        meas.append({"aid": int(a.id[1:]), "ticks": ticks, "q_ns2": q_ns2,
                     "snr_db": float(snr), "nlos_score": 1.0 if nlos else 0.0})
        if csvw:
          csvw.writerow([k, t_true, a.id, ticks, q_ns2, snr, 1.0 if nlos else 0.0])
    if len(meas) >= 3:  # need at least 3 anchors for 2D TDoA
      pkt = pack_epoch(k, t_true, meas)
      if sock: sock.sendto(pkt, dst)
      if binf: binf.write(pkt)
    # pace in real time (optional)
    if cfg["transport"]["mode"] == "udp":
      # align to wall-clock for a realistic engine load
      tgt = t0 + k*dt
      to_sleep = tgt - time.time()
      if to_sleep > 0: time.sleep(to_sleep)

if __name__ == "__main__":
  import argparse, yaml, os
  p = argparse.ArgumentParser()
  p.add_argument("--cfg", required=True)
  args = p.parse_args()
  cfg = yaml.safe_load(open(args.cfg))
  os.makedirs(os.path.dirname(cfg["transport"]["out_csv"]), exist_ok=True)
  run_sim(cfg)
