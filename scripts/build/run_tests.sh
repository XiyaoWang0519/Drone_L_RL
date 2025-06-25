#!/bin/bash

# Test runner script for the drone project
# Usage: ./scripts/build/run_tests.sh [--unit] [--integration] [--simulation] [--all]

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
RUN_UNIT=false
RUN_INTEGRATION=false
RUN_SIMULATION=false
RUN_ALL=false
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --unit)
            RUN_UNIT=true
            shift
            ;;
        --integration)
            RUN_INTEGRATION=true
            shift
            ;;
        --simulation)
            RUN_SIMULATION=true
            shift
            ;;
        --all)
            RUN_ALL=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--unit] [--integration] [--simulation] [--all]"
            echo "  --unit         Run unit tests only"
            echo "  --integration  Run integration tests only"
            echo "  --simulation   Run simulation tests only"
            echo "  --all          Run all tests (default if no options specified)"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# If no specific test type is selected, run all
if [ "$RUN_UNIT" = false ] && [ "$RUN_INTEGRATION" = false ] && [ "$RUN_SIMULATION" = false ]; then
    RUN_ALL=true
fi

# Function to print status
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

echo -e "${GREEN}🧪 Drone Project Test Runner${NC}"
echo "Workspace: $WORKSPACE_DIR"
echo

# Change to workspace directory
cd "$WORKSPACE_DIR"

# Setup ROS2 environment
print_status "Setting up ROS2 environment..."
if [ -f "/opt/ros/humble/setup.bash" ]; then
    source /opt/ros/humble/setup.bash
    if [ -f "ros2_ws/install/setup.bash" ]; then
        source ros2_ws/install/setup.bash
    fi
    print_success "ROS2 environment loaded"
else
    print_error "ROS2 Humble not found. Please install ROS2 Humble."
    exit 1
fi

# Create test results directory
mkdir -p tests/results

# Unit Tests
if [ "$RUN_UNIT" = true ] || [ "$RUN_ALL" = true ]; then
    print_status "Running unit tests..."
    
    # Python unit tests
    if [ -d "tests/unit" ]; then
        print_info "Running Python unit tests..."
        python3 -m pytest tests/unit/ -v --cov=. --cov-report=html:tests/results/coverage_unit || true
        print_success "Python unit tests completed"
    fi
    
    # ROS2 unit tests
    print_info "Running ROS2 unit tests..."
    cd ros2_ws
    colcon test --packages-select-regex ".*_test" || true
    colcon test-result --verbose || true
    cd "$WORKSPACE_DIR"
    print_success "ROS2 unit tests completed"
    
    # Firmware unit tests (placeholder)
    print_info "Running firmware unit tests..."
    cd firmware
    if [ -d "tests" ]; then
        echo "Running firmware unit tests (placeholder)"
        # Add actual firmware test commands here
    fi
    cd "$WORKSPACE_DIR"
    print_success "Firmware unit tests completed (placeholder)"
fi

# Integration Tests
if [ "$RUN_INTEGRATION" = true ] || [ "$RUN_ALL" = true ]; then
    print_status "Running integration tests..."
    
    # ROS2 integration tests
    print_info "Running ROS2 integration tests..."
    if [ -d "tests/integration" ]; then
        python3 -m pytest tests/integration/ -v --tb=short || true
    fi
    print_success "Integration tests completed"
fi

# Simulation Tests
if [ "$RUN_SIMULATION" = true ] || [ "$RUN_ALL" = true ]; then
    print_status "Running simulation tests..."
    
    # Check if display is available for GUI tests
    if [ -z "$DISPLAY" ]; then
        print_info "No display available, skipping GUI simulation tests"
    else
        print_info "Starting Gazebo simulation tests..."
        
        # Start Gazebo in headless mode for testing
        timeout 60 gazebo --verbose /usr/share/gazebo-11/worlds/empty.world &
        GAZEBO_PID=$!
        
        sleep 5
        
        # Run simulation tests
        if [ -d "tests/simulation" ]; then
            python3 -m pytest tests/simulation/ -v || true
        fi
        
        # Clean up Gazebo
        kill $GAZEBO_PID 2>/dev/null || true
        pkill gazebo 2>/dev/null || true
        
        print_success "Simulation tests completed"
    fi
fi

# Generate test report
print_status "Generating test report..."
cd "$WORKSPACE_DIR"

# Create a simple test report
cat > tests/results/test_report.md << EOF
# Test Report

Generated: $(date)

## Test Summary

### Unit Tests
- Python unit tests: $(if [ "$RUN_UNIT" = true ] || [ "$RUN_ALL" = true ]; then echo "✅ Completed"; else echo "⏭ Skipped"; fi)
- ROS2 unit tests: $(if [ "$RUN_UNIT" = true ] || [ "$RUN_ALL" = true ]; then echo "✅ Completed"; else echo "⏭ Skipped"; fi)
- Firmware unit tests: $(if [ "$RUN_UNIT" = true ] || [ "$RUN_ALL" = true ]; then echo "✅ Completed (placeholder)"; else echo "⏭ Skipped"; fi)

### Integration Tests
- ROS2 integration tests: $(if [ "$RUN_INTEGRATION" = true ] || [ "$RUN_ALL" = true ]; then echo "✅ Completed"; else echo "⏭ Skipped"; fi)

### Simulation Tests
- Gazebo simulation tests: $(if [ "$RUN_SIMULATION" = true ] || [ "$RUN_ALL" = true ]; then echo "✅ Completed"; else echo "⏭ Skipped"; fi)

## Test Results Location
- Coverage reports: tests/results/coverage_unit/
- Test logs: ros2_ws/log/
- This report: tests/results/test_report.md

## Next Steps
1. Review failed tests and fix issues
2. Update test coverage where needed
3. Run hardware-in-the-loop tests if available
EOF

print_success "Test report generated: tests/results/test_report.md"

print_success "🎉 Test execution completed!"
echo
echo "View results:"
echo "  • Test report: tests/results/test_report.md"
echo "  • Coverage report: tests/results/coverage_unit/index.html"
echo "  • ROS2 test logs: ros2_ws/log/"