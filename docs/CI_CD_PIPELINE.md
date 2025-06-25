# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment pipeline for the ECE496 Drone Localization and RL project.

## Pipeline Overview

The CI/CD pipeline consists of multiple workflows that ensure code quality, functionality, and safety:

### 1. Continuous Integration (`ci.yml`)
**Triggered on**: Push/PR to `main` or `develop` branches

**Jobs**:
- **Code Quality**: Linting, formatting, and security scanning
- **ROS2 Build and Test**: Build ROS2 packages and run tests
- **Firmware Build**: Cross-compile firmware for STM32 and ESP32
- **Simulation Testing**: Run tests in Gazebo simulation
- **Security Scanning**: Vulnerability detection with Trivy
- **Documentation**: Build project documentation

### 2. Release Pipeline (`release.yml`)
**Triggered on**: Git tags (`v*.*.*`) or published releases

**Jobs**:
- **Build and Test**: Full system build and validation
- **Firmware Release**: Build release firmware binaries
- **Create Release**: Generate GitHub releases with artifacts
- **Docker Images**: Build and publish container images

### 3. Hardware-in-the-Loop Testing (`hardware-test.yml`)
**Triggered on**: Manual workflow dispatch

**Test Suites**:
- **Basic**: Connectivity and functionality tests
- **Communication**: Range and reliability testing
- **Localization**: UWB positioning accuracy
- **Flight**: Controlled flight test procedures
- **Full**: Complete system validation

## Code Quality Standards

### Pre-commit Hooks
Automatically run on every commit via `.pre-commit-config.yaml`:
- Trailing whitespace removal
- File formatting (Python, C++, CMake)
- Linting (flake8, shellcheck, markdownlint)
- Security scanning (bandit, detect-secrets)

### Static Analysis
- **Trivy**: Container vulnerability scanning
- **Bandit**: Python security linting
- **Clang-format**: C++ code formatting
- **Black**: Python code formatting

## Build Process

### Local Development
```bash
# Build entire project
./scripts/build/build_all.sh --clean --release

# Run tests
./scripts/build/run_tests.sh --all

# Run pre-commit checks
pre-commit run --all-files
```

### Docker Development Environment
```bash
# Start development environment
docker-compose up dev

# Run tests in container
docker-compose run test

# Start simulation
docker-compose up simulation
```

## Testing Strategy

### Test Pyramid
1. **Unit Tests**: Individual component testing
   - Python unit tests with pytest
   - ROS2 package tests with colcon
   - Firmware component tests

2. **Integration Tests**: Component interaction testing
   - ROS2 node communication
   - Sensor data processing pipelines
   - Hardware interface testing

3. **Simulation Tests**: System-level validation
   - Gazebo physics simulation
   - Algorithm validation
   - Safety scenario testing

4. **Hardware Tests**: Real hardware validation
   - Manual dispatch only
   - Controlled environment required
   - Safety procedures mandatory

### Test Execution
- **Automatic**: Unit and integration tests run on every PR
- **Simulation**: Runs in CI for algorithm validation
- **Hardware**: Manual execution with safety oversight

## Safety Validation

### Automated Safety Checks
- Pre-flight system validation
- Emergency shutdown testing
- Communication failure scenarios
- RF compliance verification

### Manual Safety Reviews
- Hardware changes require safety team review
- Flight test procedures must be approved
- Emergency procedures must be validated

## Deployment Strategy

### Development Workflow
1. **Feature Branch**: Develop on feature branches
2. **Pull Request**: Create PR to `develop` branch
3. **CI Validation**: Automated testing and review
4. **Merge**: Merge to `develop` after approval
5. **Integration**: Test integration on `develop`
6. **Release**: Merge to `main` and tag release

### Release Process
1. **Release Branch**: Create from `develop`
2. **Final Testing**: Hardware validation
3. **Tag Release**: Create version tag
4. **Artifacts**: Build and publish binaries
5. **Documentation**: Update release notes

## Pipeline Configuration

### Environment Variables
Required secrets in GitHub repository settings:
- `GITHUB_TOKEN`: Automatic GitHub token
- Container registry credentials (if using external registry)

### Self-hosted Runners
Hardware-in-the-loop testing requires self-hosted runners with:
- Physical hardware access
- Safety shutdown capabilities
- Controlled test environment
- Network isolation for testing

### Branch Protection Rules
- `main` branch: Requires PR, status checks, up-to-date
- `develop` branch: Requires PR, status checks
- No direct pushes to protected branches

## Monitoring and Alerts

### Build Notifications
- Slack/email notifications for build failures
- PR status checks prevent merging broken code
- Daily build reports for main branches

### Performance Monitoring
- Build time tracking
- Test execution duration
- Resource usage monitoring

## Troubleshooting

### Common Issues
1. **Build Failures**: Check dependency versions
2. **Test Timeouts**: Increase timeout for hardware tests
3. **Container Issues**: Verify Docker setup and permissions
4. **Hardware Tests**: Ensure proper hardware connection

### Debug Commands
```bash
# Local build debugging
./scripts/build/build_all.sh --clean 2>&1 | tee build.log

# Container debugging
docker-compose logs dev

# Test debugging
./scripts/build/run_tests.sh --unit -v
```

## Future Improvements

### Planned Enhancements
- **Parallel Testing**: Speed up CI with parallel jobs
- **Advanced Security**: Add more security scanning tools
- **Performance Testing**: Automated benchmarking
- **Integration with Hardware**: More automated HIL testing

### Metrics to Track
- Build success rate
- Test coverage percentage
- Mean time to detection (MTTD)
- Mean time to recovery (MTTR)

---

For questions about the CI/CD pipeline, contact the development team or refer to the GitHub Actions documentation.