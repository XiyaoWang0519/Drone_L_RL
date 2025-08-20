## 1. Executive Summary

Build a **TDoA‑based indoor UWB localisation system** (≤ 10 cm RMS, ≥ 50 Hz) and layer a **simulation‑to‑real RL obstacle‑avoidance policy** on a sub‑250 g quad‑rotor. The project spans **two academic terms (Sept 2025 – Mar 2026)** and culminates in a live Design‑Fair demo.  Team of three ECE under‑graduates:

| Role                     | Member       | Term‑wide ownership                              |
| ------------------------ | ------------ | ------------------------------------------------ |
| **RF & Algorithms Lead** | *Xiyao Wang* | Anchor sync firmware → RL pipeline integration   |
| **Firmware & ROS Lead**  | *Jonathan*   | nRF52840/Zephyr stacks, `uwb_bridge`, EKF        |
| **Hardware & Test Lead** | *Zequan*     | Holybro build, power & mounting, field logistics |

---

## 2. Goals & Requirements

| #  | Requirement           | Target                                             |
| -- | --------------------- | -------------------------------------------------- |
| R1 | 3‑D position accuracy | **≤ 10 cm RMS** static & dynamic (5 m × 5 m × 3 m) |
| R2 | Update rate / latency | ≥ 50 Hz stream, end‑to‑end control loop ≤ 200 ms   |
| R3 | Safety                | ≥ 0.5 m clearance, emergency DISARM ≤ 200 ms       |
| R4 | Payload               | Drone (with tag & sensors) < 250 g                 |
| R6 | Compliance            | RSS‑220 UWB, on‑campus micro‑drone rules           |

Past team #2023694 hit 15 cm with a single drone but broke down when scaling to three due to anchor coverage and TDMA latency .  We address that by **wireless‑sync TDoA** (no tag polling), an extra anchor for geometry, and onboard fusion.

---

## 3. Technical Approach

### 3.1 UWB Localisation Layer

* **Hardware** – 5 × DWM3001CDK in hand (4 anchors, 1 tag).  Purchase one spare board (+CA \$120) to allow 5‑anchor geometry for redundancy.
* **Sync** – Master‑slaved wireless sync beacons every 100 ms; slaves compute clock offset via propagation‑delay correction .
* **TDoA firmware** – Zephyr RTOS tasks: *(a)* continuous‑RX listener on anchors, *(b)* periodic 20 Hz tag “blink” packet (ID + seq#) .
* **Solver** – Chan least‑squares initialisation then Nelder‑Mead refinement; 6‑state CV‑model Kalman Filter for smoothing .

### 3.2 On‑board Compute & Fusion

* **Compute** – Jetson Orin Nano (Ubuntu 22.04, ROS 2 Humble).
* **Sensors** – IMU (ICM‑42688‑P), Intel RealSense D435i for front depth, optional RPLiDAR A1 for 360° plane (budget permitting).
* **Fusion** – `robot_localization` EKF node fuses UWB pose + IMU + baro (from FC) at 100 Hz.

### 3.3 Flight Stack

* **Drone** – Holybro Kakute H743 + 3‑inch carbon frame, 2‑cell Lipo.
* **PX4 v1.15** as low‑level controller, MAVROS bridge.
* **Safety** – RC failsafe → DISARM, software geofence, prop‑guards; RF output verified on Keysight N6705B .

### 3.4 Simulation & RL

* **Sim** – Ignition Fortress with custom UWB noise plug‑in (Gaussian 0‑mean, σ = 0.05 m).
* **Env** – `gym‑gazebo2`; actions = body‑frame velocity set‑points.
* **Algorithm** – start with PPO (Stable‑Baselines3) but framework‑agnostic.
* **Domain randomisation** – anchor drift, link dropouts, dynamic obstacle speed.
* **Fallback** – ORCA reactive layer if RL confidence < 0.6 .

---

## 4. Work Breakdown Structure & Timeline

| Phase                                | Calendar     | Lead     | Key outputs                                   |
| ------------------------------------ | ------------ | -------- | --------------------------------------------- |
| **0 Kick‑off & Orders**              | Sept 2025 (Weeks 1‑2) | All      | Safety plan, repo skeleton, hardware prep       |
| **1 5‑Anchor TDoA Bring‑Up**         | Sept‑Oct 2025 | Xiyao    | Wireless‑sync firmware, ≤20 cm RMS demo       |
| **2 Jetson EKF Hover**               | Nov‑Dec 2025 | Zequan   | Stable hover ≤ 10 cm RMS (motion‑capture validated) |
| **3 Obstacle Avoidance (if feasible)**| Jan‑Feb 2026 | Xiyao    | ORCA baseline in sim; PPO training with domain randomisation |
| **4 Sim‑to‑Real Transfer (stretch)** | Feb 2026 | Jonathan | Real‑flight avoidance test (if time permits) |
| **5 Design‑Fair Demo**               | Mar 2026 | All      | Live demo of localization (and avoidance if ready) |
|  