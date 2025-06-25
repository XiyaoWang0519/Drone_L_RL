# Project Structure Overview

This document provides a comprehensive overview of the ECE496 Drone Localization and RL project structure.

## Root Directory Structure

```
Drone_L_RL/
├── .github/                    # GitHub workflows and templates
│   ├── workflows/             # CI/CD pipeline definitions
│   └── PULL_REQUEST_TEMPLATE/ # PR templates
├── .taskmaster/               # Task Master AI configuration
├── config/                    # Environment configurations
│   ├── development/           # Development environment settings
│   ├── production/           # Production deployment settings
│   └── testing/              # Testing environment configurations
├── docs/                      # Project documentation
│   ├── safety/               # Safety procedures and protocols
│   ├── technical/            # Technical documentation
│   ├── api/                  # API documentation
│   └── user/                 # User manuals and guides
├── firmware/                  # Embedded firmware
│   ├── src/                  # Source code
│   ├── include/              # Header files
│   ├── tests/                # Firmware unit tests
│   └── boards/               # Board-specific code
│       ├── stm32/           # STM32 flight controller
│       └── esp32/           # ESP32 communication module
├── hardware/                  # Hardware documentation
│   ├── schematics/           # Circuit schematics
│   ├── pcb/                  # PCB layouts
│   ├── cad/                  # 3D models
│   └── bom/                  # Bill of materials
├── ros2_ws/                   # ROS2 workspace
│   ├── src/                  # ROS2 packages
│   ├── install/              # Built packages
│   ├── build/                # Build artifacts
│   └── log/                  # Build logs
├── scripts/                   # Utility scripts
│   ├── build/                # Build automation
│   ├── deployment/           # Deployment scripts
│   └── utilities/            # General utilities
├── simulation/                # Simulation environments
│   ├── gazebo/               # Gazebo simulation
│   ├── airsim/               # AirSim configuration
│   ├── models/               # 3D models
│   └── worlds/               # Simulation worlds
└── tests/                     # Testing framework
    ├── unit/                 # Unit tests
    ├── integration/          # Integration tests
    ├── simulation/           # Simulation tests
    └── hardware/             # Hardware-in-the-loop tests
```

## Key Components

### 🚁 Drone System
- **Flight Controller**: STM32F4-based control unit
- **Localization**: DWM3001CDK UWB positioning system
- **Communication**: ESP32 wireless connectivity
- **Sensors**: IMU, barometer, cameras

### 🤖 Software Stack
- **Firmware**: Zephyr RTOS / Arduino framework
- **Middleware**: ROS2 Humble
- **Simulation**: Gazebo Classic, Microsoft AirSim
- **AI/ML**: Reinforcement Learning for obstacle avoidance

### 🛡️ Safety Systems
- Emergency shutdown procedures
- Failsafe mechanisms
- RF compliance validation
- Hardware fault detection

## Development Workflow

1. **Design**: Hardware schematics and software architecture
2. **Simulate**: Test algorithms in virtual environments
3. **Implement**: Develop firmware and ROS2 packages
4. **Test**: Unit, integration, and hardware testing
5. **Deploy**: Gradual rollout with safety validation

## Getting Started

1. Clone repository and checkout develop branch
2. Follow setup instructions in `docs/SETUP.md`
3. Build Docker development environment
4. Run simulation tests to verify setup
5. Begin feature development following branching strategy

## Safety First

⚠️ **IMPORTANT**: All development must prioritize safety. No code should be deployed to hardware without thorough simulation testing and safety review.

## Documentation Standards

- All code must be self-documenting or include comments
- API changes require documentation updates
- Safety procedures must be updated with system changes
- Maintain up-to-date technical specifications