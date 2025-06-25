#!/bin/bash

# Docker Development Environment Setup Script
# Sets up the complete development environment for the drone project

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Functions
print_status() {
    echo -e "${YELLOW}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    # Check Docker daemon
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    
    print_success "System requirements satisfied"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment configuration..."
    
    cd "$PROJECT_ROOT"
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_info "Created .env file from .env.example"
        else
            cat > .env << EOF
# ROS2 Configuration
ROS_DOMAIN_ID=42
ROS_DISTRO=humble

# Development Configuration
DISPLAY=${DISPLAY:-:0}
WORKSPACE_DIR=/workspace

# Gazebo Configuration
GAZEBO_MODEL_PATH=/workspace/simulation/models

# Hardware Configuration
DRONE_HARDWARE_INTERFACE=simulation

# Logging
LOG_LEVEL=INFO
EOF
            print_info "Created default .env file"
        fi
    else
        print_info ".env file already exists"
    fi
    
    print_success "Environment configuration completed"
}

# Build Docker images
build_images() {
    print_status "Building Docker images..."
    
    cd "$PROJECT_ROOT"
    
    # Build development image
    print_info "Building development image (this may take 10-15 minutes)..."
    docker build --target development -t drone-dev:latest . || {
        print_error "Failed to build development image"
        exit 1
    }
    
    # Build firmware development image
    print_info "Building firmware development image..."
    docker build --target firmware-dev -t drone-firmware:latest . || {
        print_error "Failed to build firmware image"
        exit 1
    }
    
    print_success "Docker images built successfully"
}

# Setup X11 forwarding (for Linux/macOS)
setup_x11() {
    print_status "Setting up GUI support..."
    
    case "$(uname -s)" in
        Linux*)
            # Linux X11 setup
            xhost +local:docker || {
                print_error "Failed to setup X11 forwarding. GUI applications may not work."
            }
            print_success "X11 forwarding configured for Linux"
            ;;
        Darwin*)
            # macOS X11 setup
            print_info "For macOS GUI support, install XQuartz and run:"
            print_info "  brew install --cask xquartz"
            print_info "  open -a XQuartz"
            print_info "Then restart this script"
            ;;
        *)
            print_info "GUI setup not configured for this platform"
            ;;
    esac
}

# Create development directories
create_directories() {
    print_status "Creating development directories..."
    
    cd "$PROJECT_ROOT"
    
    # Create development-specific directories
    mkdir -p {
        .devcontainer,
        scripts/docker,
        config/docker,
        tests/docker
    }
    
    print_success "Development directories created"
}

# Generate development scripts
generate_scripts() {
    print_status "Generating helper scripts..."
    
    # Create development start script
    cat > "$PROJECT_ROOT/scripts/docker/start_dev.sh" << 'EOF'
#!/bin/bash
# Quick start script for development environment

echo "🚁 Starting Drone Development Environment..."
cd "$(dirname "$0")/../.."
docker-compose up -d dev
echo "✅ Development environment started"
echo "Access with: docker-compose exec dev bash"
EOF
    
    # Create testing script
    cat > "$PROJECT_ROOT/scripts/docker/run_tests.sh" << 'EOF'
#!/bin/bash
# Run tests in Docker environment

echo "🧪 Running tests in Docker environment..."
cd "$(dirname "$0")/../.."
docker-compose run --rm test
echo "✅ Tests completed"
EOF
    
    # Create cleanup script
    cat > "$PROJECT_ROOT/scripts/docker/cleanup.sh" << 'EOF'
#!/bin/bash
# Cleanup Docker environment

echo "🧹 Cleaning up Docker environment..."
cd "$(dirname "$0")/../.."
docker-compose down
docker system prune -f
echo "✅ Cleanup completed"
EOF
    
    # Make scripts executable
    chmod +x "$PROJECT_ROOT"/scripts/docker/*.sh
    
    print_success "Helper scripts generated"
}

# Create VS Code devcontainer config
create_devcontainer() {
    print_status "Creating VS Code devcontainer configuration..."
    
    cat > "$PROJECT_ROOT/.devcontainer/devcontainer.json" << 'EOF'
{
    "name": "Drone Development",
    "dockerComposeFile": "../docker-compose.yml",
    "service": "dev",
    "workspaceFolder": "/workspace",
    "shutdownAction": "stopCompose",
    
    "customizations": {
        "vscode": {
            "extensions": [
                "ms-python.python",
                "ms-python.black-formatter",
                "ms-vscode.cpptools",
                "ms-vscode.cmake-tools",
                "ms-iot.vscode-ros",
                "redhat.vscode-yaml",
                "ms-vscode.vscode-json",
                "GitHub.copilot"
            ],
            "settings": {
                "python.defaultInterpreterPath": "/usr/bin/python3",
                "python.formatting.provider": "black",
                "cmake.configureOnOpen": false,
                "ros.rosSetupScript": "/opt/ros/humble/setup.bash"
            }
        }
    },
    
    "forwardPorts": [8080, 3000, 11311, 11345],
    "postCreateCommand": "sudo chown -R developer:developer /workspace",
    
    "remoteUser": "developer",
    "features": {
        "ghcr.io/devcontainers/features/git:1": {},
        "ghcr.io/devcontainers/features/github-cli:1": {}
    }
}
EOF
    
    print_success "VS Code devcontainer configuration created"
}

# Test the setup
test_setup() {
    print_status "Testing Docker setup..."
    
    cd "$PROJECT_ROOT"
    
    # Test basic container startup
    print_info "Testing container startup..."
    docker-compose run --rm dev echo "Container startup test successful" || {
        print_error "Container startup test failed"
        return 1
    }
    
    # Test ROS2 installation
    print_info "Testing ROS2 installation..."
    docker-compose run --rm dev bash -c "source /opt/ros/humble/setup.bash && ros2 --version" || {
        print_error "ROS2 test failed"
        return 1
    }
    
    print_success "Docker setup test completed successfully"
}

# Main setup function
main() {
    echo -e "${GREEN}🚁 Drone Project Docker Setup${NC}"
    echo "Setting up development environment..."
    echo
    
    check_requirements
    setup_environment
    create_directories
    setup_x11
    build_images
    generate_scripts
    create_devcontainer
    test_setup
    
    echo
    print_success "🎉 Docker development environment setup completed!"
    echo
    echo "Quick start commands:"
    echo "  • Start development: ./scripts/docker/start_dev.sh"
    echo "  • Access container: docker-compose exec dev bash"
    echo "  • Run tests: ./scripts/docker/run_tests.sh"
    echo "  • Open VS Code: code . (with Dev Containers extension)"
    echo "  • Cleanup: ./scripts/docker/cleanup.sh"
    echo
    echo "Documentation:"
    echo "  • Docker guide: docs/DOCKER_GUIDE.md"
    echo "  • Development workflow: docs/DEVELOPMENT.md"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Docker Development Environment Setup"
        echo
        echo "Usage: $0 [OPTIONS]"
        echo
        echo "Options:"
        echo "  --help, -h    Show this help message"
        echo "  --no-build    Skip building Docker images"
        echo "  --test-only   Only run tests"
        exit 0
        ;;
    --no-build)
        echo "Skipping Docker image build..."
        build_images() { print_info "Skipping image build"; }
        ;;
    --test-only)
        test_setup
        exit $?
        ;;
esac

# Run main setup
main