# ROS2 Workspace

This directory contains the ROS2 Humble workspace for drone control, localization, and obstacle avoidance.

## Structure

- `src/` - ROS2 packages source code
- `install/` - Built packages (auto-generated)
- `build/` - Build artifacts (auto-generated)
- `log/` - Build and runtime logs (auto-generated)

## Key Packages

- **drone_control** - Flight control and navigation
- **uwb_localization** - UWB-based positioning system
- **obstacle_avoidance** - RL-based obstacle avoidance
- **sensor_fusion** - Multi-sensor data fusion
- **safety_monitor** - Safety systems and emergency procedures

## Build Instructions

```bash
cd ros2_ws
colcon build --packages-select <package_name>
source install/setup.bash
```

## Development Notes

- Follow ROS2 coding standards
- All packages must include unit tests
- Use consistent naming conventions
- Document all public interfaces