# Docker Development Environment Guide

This guide provides comprehensive instructions for setting up and using the Docker-based development environment for the ECE496 drone project.

## Overview

The Docker environment provides:
- **Consistent development environment** across all team members
- **Pre-configured ROS2 Humble** with all necessary packages
- **Cross-compilation toolchains** for STM32 and ESP32
- **Simulation environment** with Gazebo
- **Testing infrastructure** with automated test execution
- **Development tools** including debuggers and code formatters

## Quick Start

### Prerequisites

1. **Install Docker Desktop**
   - **Windows/macOS**: Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - **Linux**: Install via package manager
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install docker.io docker-compose
   
   # Add user to docker group
   sudo usermod -aG docker $USER
   # Log out and back in for group changes to take effect
   ```

2. **Verify Installation**
   ```bash
   docker --version
   docker-compose --version
   docker info
   ```

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Drone_L_RL
   ```

2. **Run the setup script**
   ```bash
   ./scripts/docker/setup_dev_env.sh
   ```

3. **Start development environment**
   ```bash
   ./scripts/docker/start_dev.sh
   # Or manually:
   docker-compose up -d dev
   ```

4. **Access the container**
   ```bash
   docker-compose exec dev bash
   ```

## Container Services

### Development Container (`dev`)
**Purpose**: Main development environment with all tools
```bash
# Start development container
docker-compose up -d dev

# Access interactive shell
docker-compose exec dev bash

# Run specific commands
docker-compose exec dev ros2 topic list
```

### Simulation Container (`simulation`)
**Purpose**: Gazebo simulation environment
```bash
# Start simulation (requires GUI support)
docker-compose up simulation

# Run headless simulation
docker-compose run --rm simulation gazebo --verbose --headless
```

### Hardware Interface Container (`hardware`)
**Purpose**: Hardware-in-the-loop testing
```bash
# Start hardware interface (requires device access)
docker-compose up hardware

# Flash firmware to connected device
docker-compose exec hardware arduino-cli upload -p /dev/ttyUSB0
```

### Testing Container (`test`)
**Purpose**: Automated testing environment
```bash
# Run all tests
docker-compose run --rm test

# Run specific test category
docker-compose run --rm test pytest tests/unit/ -v
```

## Development Workflow

### 1. Container-based Development

**Daily workflow:**
```bash
# Start your development session
docker-compose up -d dev
docker-compose exec dev bash

# Your code is mounted at /workspace
cd /workspace

# Set up ROS2 environment
source /opt/ros/humble/setup.bash
cd ros2_ws && source install/setup.bash

# Build and test
colcon build
colcon test
```

### 2. VS Code Integration

**Using Dev Containers extension:**
1. Install "Dev Containers" extension in VS Code
2. Open project folder in VS Code
3. Press `F1` → "Dev Containers: Reopen in Container"
4. VS Code will automatically build and connect to the container

**Manual setup:**
1. Start container: `docker-compose up -d dev`
2. Install "Remote - Containers" extension
3. Connect to running container

### 3. Building ROS2 Packages

```bash
# Inside the container
cd /workspace/ros2_ws

# Install dependencies
rosdep install --from-paths src --ignore-src -r -y

# Build all packages
colcon build

# Build specific package
colcon build --packages-select package_name

# Source the workspace
source install/setup.bash
```

### 4. Firmware Development

```bash
# Access firmware development tools
docker-compose exec dev bash

# ESP32 development
source $IDF_PATH/export.sh
cd /workspace/firmware/esp32
idf.py build

# STM32 development (example)
cd /workspace/firmware/stm32
arm-none-eabi-gcc -o firmware.elf src/*.c
```

## GUI Applications

### Linux
```bash
# Enable X11 forwarding (run on host)
xhost +local:docker

# Start container with GUI support
docker-compose up simulation
```

### macOS
```bash
# Install XQuartz
brew install --cask xquartz

# Start XQuartz
open -a XQuartz

# In XQuartz preferences, enable "Allow connections from network clients"
# Restart XQuartz, then start containers
```

### Windows
```bash
# Install VcXsrv or similar X11 server
# Configure display variable in docker-compose.yml
# Start X11 server before running containers
```

## Data Persistence

### Persistent Volumes
- **Source code**: Mounted from host at `/workspace`
- **ROS2 packages**: Built in container, can be committed
- **Database**: PostgreSQL data persisted in named volume
- **Configuration**: Environment-specific configs preserved

### Backup and Restore
```bash
# Backup container data
docker-compose exec dev tar -czf /workspace/backup.tar.gz /workspace/ros2_ws/install

# Restore from backup
docker-compose exec dev tar -xzf /workspace/backup.tar.gz -C /
```

## Networking

### Container Communication
- **Internal network**: `172.20.0.0/16`
- **Service discovery**: Containers can reach each other by service name
- **ROS2 domain**: `ROS_DOMAIN_ID=42` (configurable)

### Port Mapping
| Service | Container Port | Host Port | Purpose |
|---------|----------------|-----------|---------|
| dev | 8080 | 8080 | Web interface |
| dev | 3000 | 3000 | Development server |
| docs | 8000 | 8000 | Documentation |
| monitoring | 3000 | 3001 | Grafana dashboard |
| database | 5432 | 5432 | PostgreSQL |

## Troubleshooting

### Common Issues

**1. Permission Denied**
```bash
# Fix file permissions
docker-compose exec dev sudo chown -R developer:developer /workspace
```

**2. Container Won't Start**
```bash
# Check logs
docker-compose logs dev

# Rebuild image
docker-compose build dev
```

**3. GUI Applications Don't Work**
```bash
# Linux: Check X11 forwarding
echo $DISPLAY
xhost +local:docker

# macOS: Ensure XQuartz is running
ps aux | grep XQuartz
```

**4. ROS2 Communication Issues**
```bash
# Check ROS2 domain
echo $ROS_DOMAIN_ID

# Test ROS2 communication
ros2 topic list
ros2 node list
```

**5. Build Failures**
```bash
# Clean build
cd /workspace/ros2_ws
rm -rf build install log
colcon build

# Check dependencies
rosdep check --from-paths src --ignore-src
```

### Performance Optimization

**1. Build Cache**
```bash
# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker-compose build
```

**2. Resource Limits**
```yaml
# In docker-compose.yml
services:
  dev:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
```

**3. Volume Optimization**
```bash
# Use named volumes for better performance on Windows/macOS
volumes:
  ros2_ws_install:
  ros2_ws_build:
```

## Advanced Usage

### Custom Images

**Building custom development image:**
```dockerfile
FROM drone-dev:latest
RUN apt-get update && apt-get install -y your-package
COPY your-config /etc/your-config
```

### Multi-stage Development

**Different development stages:**
```bash
# Frontend development
docker-compose -f docker-compose.yml -f docker-compose.frontend.yml up

# Backend development
docker-compose -f docker-compose.yml -f docker-compose.backend.yml up

# Full system integration
docker-compose -f docker-compose.yml -f docker-compose.integration.yml up
```

### Production Deployment

**Production configuration:**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build:
      target: production
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## Maintenance

### Regular Maintenance Tasks

**Weekly:**
```bash
# Update base images
docker-compose pull
docker-compose build --pull

# Clean up unused containers/images
docker system prune -f
```

**Monthly:**
```bash
# Update package lists in containers
docker-compose exec dev apt update && apt upgrade -y

# Rebuild from scratch
docker-compose build --no-cache
```

### Monitoring

**Container health:**
```bash
# Check container status
docker-compose ps

# Monitor resource usage
docker stats

# View logs
docker-compose logs -f dev
```

**System monitoring:**
```bash
# Access Grafana dashboard
open http://localhost:3001
# Login: admin/admin
```

## Security Considerations

### Container Security
- Containers run as non-root user (`developer`)
- No privileged access unless required for hardware
- Network isolation between services
- Secrets managed via environment variables

### Host Security
- Docker daemon secured with TLS
- Regular security updates for base images
- Minimal attack surface in production images

## Support and Resources

### Documentation
- **Docker Official Docs**: https://docs.docker.com/
- **ROS2 Docker Guide**: https://docs.ros.org/en/humble/How-To-Guides/Run-2-nodes-in-single-or-separate-docker-containers.html
- **VS Code Dev Containers**: https://code.visualstudio.com/docs/remote/containers

### Getting Help
1. Check container logs: `docker-compose logs service-name`
2. Review this documentation
3. Check GitHub issues for similar problems
4. Contact team members or supervisors
5. Create new issue with detailed error information

### Useful Commands Reference

```bash
# Container management
docker-compose up -d                    # Start all services
docker-compose down                     # Stop all services
docker-compose restart service-name     # Restart specific service
docker-compose exec service-name bash   # Access container shell

# Image management
docker-compose build                    # Build all images
docker-compose build service-name       # Build specific image
docker-compose pull                     # Pull latest base images

# Debugging
docker-compose logs service-name        # View service logs
docker-compose ps                       # Show running services
docker system df                        # Show Docker disk usage
docker system prune                     # Clean up unused resources

# Development
docker-compose run --rm test            # Run tests
docker-compose exec dev colcon build    # Build ROS2 packages
docker-compose exec dev bash            # Interactive development
```

---

This Docker environment is designed to provide a consistent, reproducible development experience for all team members. If you encounter issues or have suggestions for improvements, please update this documentation or contact the development team.