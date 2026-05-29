# Glossary

Domain terms used across the firmware, engine, and docs. See
[`ARCHITECTURE.md`](ARCHITECTURE.md) for how these fit together.

## Roles & hardware

- **Anchor** — A fixed UWB radio at a known position. The system uses 4–5 anchors
  (DWM3001CDK boards) to bound the localization volume.
- **Tag** — The mobile UWB radio whose position is being solved (carried by the
  drone). In this project the tag *receives* anchor blinks; see `drone_rx`.
- **Master / slave beacon** — The master anchor is the timing reference that
  broadcasts wireless sync; slave anchors correct their clocks against it.
  Firmware: `gps_beacon_master`, `gps_beacon_slave`.
- **DWM3001CDK** — Nordic/Qorvo development board combining an nRF52833 MCU with
  a **DW3000** UWB transceiver. The board's UWB timestamp clock runs at
  ≈ **63.8976 GHz** (one "tick" ≈ 15.65 ps).
- **Blink** — A short UWB packet an anchor transmits periodically, carrying its
  ID and a sequence number. The tag timestamps each blink it hears.

## Localization math

- **UWB** — Ultra-Wideband. A radio technology giving sub-nanosecond timestamp
  resolution, enabling decimeter-level ranging.
- **ToA (Time of Arrival)** — The absolute timestamp at which a signal is
  received. (`observation_kind: "toa"`.)
- **TDoA (Time Difference of Arrival)** — Localization from the *differences*
  between arrival times at multiple anchors. Each pair defines a hyperbola
  (hyperboloid in 3-D); their intersection is the position. Avoids needing a
  synchronized tag clock — only the anchors must be synchronized.
- **TWR (Two-Way Ranging)** — A back-and-forth exchange that measures the
  distance between two radios directly. Used here between anchors to
  auto-estimate their layout (calibration), not for the live tag fix.
- **Range difference** — A time difference scaled by the speed of light:
  `Δρ = c · Δt`. Rule of thumb: **1 ns ≈ 0.30 m**, so clock-sync error maps
  directly into position error.
- **Epoch** — One solved instant: the set of per-anchor observations sharing a
  single sequence number, normalized into the engine's epoch dict.

## Solver & filtering

- **EKF (Extended Kalman Filter)** — Recursive estimator that fuses noisy
  per-epoch fixes over time. Here it uses a **constant-velocity (CV)** motion
  model and outputs position, velocity, and covariance. Runs in 2-D or 3-D,
  inferred from the anchor layout's vertical span.
- **Gauss-Newton** — The iterative least-squares method used to solve the TDoA
  equations for position.
- **Huber loss** — A robust loss that behaves quadratically for small residuals
  and linearly for large ones, reducing the influence of outlier measurements
  (`HUBER_DELTA = 0.2`).
- **Gating (3σ)** — Rejecting a measurement whose residual exceeds three standard
  deviations, so a bad anchor doesn't corrupt the fix.
- **GDOP (Geometric Dilution of Precision)** — How anchor geometry amplifies
  measurement noise into position error. Lower is better; poor geometry
  (anchors nearly collinear/coplanar) gives high GDOP. Solves above
  `MAX_GDOP` are rejected.
- **Residual RMS** — Root-mean-square of the solver residuals, reported in ns.
  A health/quality signal; solves above `MAX_RESIDUAL_RMS_NS` are rejected.
- **MDS (Multidimensional Scaling)** — Classical metric MDS reconstructs anchor
  coordinates from pairwise distances (used in auto-geometry from TWR).

## Signal quality

- **CIR (Channel Impulse Response)** — The multipath profile of a received UWB
  pulse. Its **SNR** (dB) indicates link quality and is used to weight an
  anchor's measurement.
- **NLOS (Non-Line-of-Sight)** — A path obstructed by obstacles, which biases
  range long. The `nlos_score` (0..1) down-weights suspect measurements.
- **LOS (Line-of-Sight)** — A clear direct path; the ideal measurement condition.

## Clock & timing

- **Wireless sync** — Periodically aligning anchor clocks over the air (no wires)
  so their timestamps share a common time base. (`clock.mode: "wireless_sync"`.)
- **Clock offset (`offset_ns`)** — A fixed timing bias between an anchor's clock
  and the reference, in nanoseconds.
- **Clock drift (`drift_ppm`)** — How fast an anchor's clock rate diverges from
  the reference, in parts per million. The engine corrects time as
  `t = (t_raw − offset) / (1 + drift)`.
- **ppm (parts per million)** — Unit for relative rate error: 1 ppm = 1 µs of
  drift per second.
- **Superframe / slot** — The TDMA schedule structure. A superframe is one full
  cycle; each anchor transmits in its assigned time **slot** (durations given in
  `uus`). Configured via the radio schedule (`slot_start_uus`, `slot_uus`, …).
- **uus (UWB microseconds)** — The DW3000 scheduling time unit used for slot
  timing in the radio schedule.

## Flight / future work

- **RL (Reinforcement Learning)** — Planned learned obstacle-avoidance policy
  (PPO baseline), trained in simulation with domain randomization. See the
  project plan.
- **ORCA** — Optimal Reciprocal Collision Avoidance; the reactive fallback layer
  planned for when RL confidence is low.
- **PX4 / MAVROS** — Flight controller firmware (PX4) and its ROS 2 bridge
  (MAVROS), part of the planned flight stack.
