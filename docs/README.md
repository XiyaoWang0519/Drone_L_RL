# Documentation Index

Start here to find your way around the project's docs. The repository root
[`README.md`](../README.md) is the entry point; the table below indexes
everything else.

## Orientation

| Doc | What it covers |
|-----|----------------|
| [`../README.md`](../README.md) | Project overview, status table, both quick starts |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | System data flow, ingest modes, **packet & serial contracts**, engine config, pose output |
| [`GLOSSARY.md`](GLOSSARY.md) | UWB/localization terminology (TDoA, TWR, EKF, GDOP, NLOS, anchor/tag/blink, ppm, …) |
| [`../AGENTS.md`](../AGENTS.md) | Repository guidelines: structure, build/test commands, coding style, commit/PR conventions |

## Component docs

| Doc | What it covers |
|-----|----------------|
| [`../TDoA_Engine/README.md`](../TDoA_Engine/README.md) | Running the engine + simulator + UI; **engine REST/WS API reference** |
| [`../TDoA_Engine/DEV_NOTES.md`](../TDoA_Engine/DEV_NOTES.md) | Engine implementation log, rationale, validation results, next steps |
| [`../TDoA_Engine/IMPLEMENTATION_PLAN.md`](../TDoA_Engine/IMPLEMENTATION_PLAN.md) | Engine build-out plan |
| [`../firmware/README.md`](../firmware/README.md) | Firmware layout, build/flash workflow, Zephyr sample list |

## Planning & process

| Doc | What it covers |
|-----|----------------|
| [`indoor_drone_final_project_plan.md`](indoor_drone_final_project_plan.md) | Goals, requirements (R1–R6), technical approach, timeline, team roles |
| [`uwb_verification_workflow.md`](uwb_verification_workflow.md) | Reproducible 5-minute sync/dropout & static-tag verification runs |
| [`tdoa_engine_report.md`](tdoa_engine_report.md) | TDoA engine report |

## Reference material

| File | What it is |
|------|------------|
| `DWM3001CDK Product Brief.pdf` | Vendor brief for the DWM3001CDK board |
| `past_teams_reports/` | Prior-team final report & proposal (context for design decisions) |

## Suggested reading order

1. **New to the project?** [`../README.md`](../README.md) → [`ARCHITECTURE.md`](ARCHITECTURE.md) → [`GLOSSARY.md`](GLOSSARY.md).
2. **Working on the engine/UI?** [`../TDoA_Engine/README.md`](../TDoA_Engine/README.md) → [`../TDoA_Engine/DEV_NOTES.md`](../TDoA_Engine/DEV_NOTES.md).
3. **Working on firmware?** [`../firmware/README.md`](../firmware/README.md) → [`ARCHITECTURE.md`](ARCHITECTURE.md) §4–5 (wire contracts).
4. **Bringing up hardware / verifying?** [`uwb_verification_workflow.md`](uwb_verification_workflow.md).
