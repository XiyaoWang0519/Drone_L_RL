# Testing Framework

This directory contains comprehensive testing infrastructure for all project components.

## Structure

- `unit/` - Unit tests for individual components and functions
- `integration/` - Integration tests for system components
- `simulation/` - Simulation-based testing scenarios
- `hardware/` - Hardware-in-the-loop (HIL) testing

## Testing Strategy

### Unit Testing
- Test individual functions and classes
- Mock external dependencies
- Achieve >80% code coverage
- Automated execution in CI/CD pipeline

### Integration Testing
- Test component interactions
- ROS2 node communication testing
- Sensor data processing pipelines
- End-to-end system functionality

### Simulation Testing
- Algorithm validation in virtual environments
- Safety scenario testing
- Performance benchmarking
- Regression testing for updates

### Hardware Testing
- Real hardware validation
- Sensor calibration and accuracy
- Communication range and reliability
- Flight performance validation

## Test Execution

```bash
# Run all tests
./scripts/run_tests.sh

# Run specific test categories
./scripts/run_tests.sh --unit
./scripts/run_tests.sh --integration
./scripts/run_tests.sh --simulation
```

## Safety Testing Requirements

All safety-critical components must pass:
- Fault injection testing
- Emergency procedure validation
- Communication failure scenarios
- Hardware failure simulation