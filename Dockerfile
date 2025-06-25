# Multi-stage Dockerfile for drone development environment
FROM ros:humble-ros-base-jammy as base

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV ROS_DISTRO=humble
ENV WORKSPACE=/workspace

# Install system dependencies
RUN apt-get update && apt-get install -y \
    # Build tools
    build-essential \
    cmake \
    git \
    curl \
    wget \
    vim \
    nano \
    # Python development
    python3-pip \
    python3-dev \
    python3-venv \
    # ROS2 development tools
    python3-colcon-common-extensions \
    python3-rosdep \
    python3-vcstool \
    # Gazebo simulation
    gazebo \
    libgazebo-dev \
    ros-humble-gazebo-ros-pkgs \
    # Additional ROS2 packages
    ros-humble-rqt* \
    ros-humble-rviz2 \
    # Development tools
    gdb \
    valgrind \
    clang-format \
    cppcheck \
    # Network tools
    net-tools \
    iputils-ping \
    # Clean up
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip3 install --no-cache-dir \
    pre-commit \
    black \
    flake8 \
    mypy \
    pytest \
    pytest-cov \
    sphinx \
    sphinx-rtd-theme

# ARM cross-compilation stage
FROM base as firmware-dev

RUN apt-get update && apt-get install -y \
    # ARM toolchain
    gcc-arm-none-eabi \
    gdb-arm-none-eabi \
    openocd \
    # ESP32 development
    python3-serial \
    && rm -rf /var/lib/apt/lists/*

# Install ESP-IDF
RUN git clone --recursive https://github.com/espressif/esp-idf.git /opt/esp-idf && \
    cd /opt/esp-idf && \
    git checkout v5.1 && \
    ./install.sh esp32,esp32s3

# Arduino CLI for ESP32
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh && \
    mv bin/arduino-cli /usr/local/bin/ && \
    arduino-cli core update-index && \
    arduino-cli core install esp32:esp32

# Development stage with all tools
FROM firmware-dev as development

# Set up workspace
WORKDIR $WORKSPACE

# Copy project files
COPY . .

# Initialize rosdep
RUN rosdep init || true && \
    rosdep update

# Install ROS dependencies
RUN cd ros2_ws && \
    rosdep install --from-paths src --ignore-src -r -y || true

# Set up ESP-IDF environment
ENV IDF_PATH=/opt/esp-idf
ENV PATH="$IDF_PATH/tools:$PATH"

# Create development user
RUN useradd -m -s /bin/bash developer && \
    echo "developer:developer" | chpasswd && \
    usermod -aG sudo developer && \
    chown -R developer:developer $WORKSPACE

USER developer

# Set up shell environment
RUN echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc && \
    echo "source $IDF_PATH/export.sh" >> ~/.bashrc && \
    echo "cd $WORKSPACE" >> ~/.bashrc

# Expose common ports
EXPOSE 11311 11345 8080 3000

# Default command
CMD ["/bin/bash"]

# Production stage (minimal runtime)
FROM base as production

WORKDIR $WORKSPACE

# Copy only built artifacts
COPY --from=development $WORKSPACE/ros2_ws/install ./ros2_ws/install
COPY --from=development $WORKSPACE/firmware/build ./firmware/build

# Set up runtime environment
RUN echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc && \
    echo "source ./ros2_ws/install/setup.bash" >> ~/.bashrc

CMD ["ros2", "launch", "drone_control", "main.launch.py"]