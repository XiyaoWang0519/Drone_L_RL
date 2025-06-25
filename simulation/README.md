# Simulation Environment

This directory contains simulation environments for testing drone behavior before hardware deployment.

## Structure

- `gazebo/` - Gazebo Classic simulation files
- `airsim/` - Microsoft AirSim configuration and scenarios
- `models/` - 3D models for drones and environment objects
- `worlds/` - Simulation world definitions and scenarios

## Simulation Platforms

### Gazebo Classic
- Physics simulation with realistic drone dynamics
- Sensor simulation (cameras, IMU, GPS)
- Custom world environments

### Microsoft AirSim
- High-fidelity visual simulation
- Computer vision and deep learning integration
- Unreal Engine-based environments

## Usage

1. Launch simulation environment
2. Deploy ROS2 nodes for testing
3. Run automated test scenarios
4. Validate algorithms before hardware testing

## Safety Testing

All flight algorithms must pass simulation testing before hardware deployment. Test scenarios include:
- Emergency landing procedures
- Obstacle avoidance scenarios
- Communication loss handling
- Battery failure simulation