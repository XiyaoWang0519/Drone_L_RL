## 1. Executive Summary

Build a **TDoA‑based indoor UWB localisation system** (≤ 10 cm RMS, ≥ 50 Hz) and layer a **simulation‑to‑real RL obstacle‑avoidance policy** on a sub‑250 g quad‑rotor. The project spans **two academic terms (May 2025 – Apr 2026)** and culminates in a live Design‑Fair demo.  Team of three ECE under‑graduates:

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
| R5 | Budget                | ≤ CA \$2 850 hardware                              |
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
| **0 Kick‑off & Orders**              | May‑Jun 2025 | All      | Safety plan, BOM locked, repo skeleton        |
| **1 4‑Anchor TDoA MVP**              | Jun‑Jul 2025 | Jonathan | Sub‑20 cm log demo with wired PSU (table‑top) |
| **2 5‑Anchor wireless‑sync @ 50 Hz** | Aug‑Sep 2025 | Xiyao    | Clock‑sync firmware validated in lab          |
| **3 Jetson EKF flight**              | Oct 2025     | Zequan   | ≤ 10 cm RMS hover test in classroom           |
| **4 High‑fidelity sim arena**        | Nov 2025     | Jonathan | Ignition world + sensor models                |
| **5 ORCA baseline avoidance**        | Dec 2025     | Xiyao    | Non‑RL reactive avoidance passes course       |
| **6 PPO + Domain‑Rand training**     | Jan‑Feb 2026 | Xiyao    | > 95 % success in sim                         |
| **7 Sim‑to‑Real transfer**           | Mar 2026     | Zequan   | Real flight video, no collisions              |
| **8 Design‑Fair booth**              | Apr 2026     | All      | Live demo, poster, open‑source repo           |

Milestones mirror but refine the draft roadmap in the MD plan  while removing the earlier TWR step and aligning with your TDoA‑only decision.

---

## 5. Bill of Materials (revised)

| Item                                    | Qty             | \$CA / unit | Sub‑total                 |
| --------------------------------------- | --------------- | ----------- | ------------------------- |
| DWM3001‑CDK anchors                     | **5** (1 spare) |  120        | 600                       |
| DWM3001 tag module                      | 1 (tag)         | 90          | 90                        |
| Tripods + USB‑C PD banks                | 5               | 35          | 175                       |
| Holybro kit (frame + FC + ESC + motors) | 1               |  400        | 400                       |
| RealSense D435i                         | 1               |  250        | 250                       |
| RPLiDAR A1 (optional)                   | 1               |  110        | 110                       |
| Li‑ion packs & charger                  |  —              |  200        | 200                       |
| 3‑D prints, wiring, fasteners           |  —              |  150        | 150                       |
| Contingency 15 %                        |  —              |  300        | 300                       |
| **Total**                               |                 |             | **2 275** (< \$2 850)\*\* |

(You already own Jetson + two spare Orin modules, so they’re cost‑free).

---

## 6. Testing & Verification Plan

| Stage                 | Metric                  | Method                                               |
| --------------------- | ----------------------- | ---------------------------------------------------- |
| Anchor‑sync           | σ(clock offset) ≤ 2 ns  | Anchor pair latency logger (logic‑analyser)          |
| Static tag            | Pos. error ≤ 8 cm       | Laser‑measured ground‑truth grid                     |
| Hover                 | EKF XYZ σ ≤ 10 cm       | Motion‑capture cross‑check (borrow Caps Lab rig day) |
| Dynamic 8‑shape       | RMS ≤ 10 cm             | On‑board & mocap trajectory overlay                  |
| Obstacle course (sim) | 95 % success            | 100 runs, random layout                              |
| Real flight obstacle  | 3 × 5 min, 0 collisions | Classroom with soft foam pillars                     |

Past team’s accuracy test rigs (Fig. 2, p. 14) are reused for ground‑truth capture .

---

## 7. Risks & Mitigations

| Risk                  | Impact | Mitigation                                                    |
| --------------------- | ------ | ------------------------------------------------------------- |
| Multipath > 10 cm     | Medium | Anchor height diversity + extra anchor + IMU fusion           |
| Sync packet drop      | High   | 1 Hz resync watchdog; fall‑back to low‑rate TDMA              |
| Payload creep > 250 g | Medium | 3‑D‑printed mounts, 2‑cell battery, remove LiDAR if needed    |
| Sim‑to‑real gap       | High   | Domain randomisation, progressive real testing, ORCA fallback |

---

## 8. Deliverables

1. **PDR (Sep 2025)** – architecture, safety, budget.
2. **CDR (Nov 2025)** – firmware demo + EKF report.
3. **Mid‑Year Demo (Dec 2025)** – ORCA avoidance in sim.
4. **Final Demo (Apr 2026)** – Live obstacle course with GUI.
5. GitHub repo, annotated BOM, user manual, video, and IEEE‑style final paper.

---

### Closing Notes

*All* requirements are traceable to tasks and budget; phases are front‑loaded for high‑risk RF firmware.  This plan stays under budget, honours your TDoA‑only choice, and leans on proven practices (e.g. wireless sync protocol design in the DWM3001CDK doc) while avoiding pitfalls that tripped last year’s team.  Ready for sprint‑0 kick‑off!
