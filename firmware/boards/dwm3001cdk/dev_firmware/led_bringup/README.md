# DWM3001CDK LED Bring-up (Zephyr)

## 1. Prerequisites

- macOS (tested on Apple Silicon)
- SEGGER J-Link software installed (JLinkExe in $PATH)
- Zephyr SDK v0.17.4
- Python ≥ 3.10 (we use pyenv + venv)
- West installed (pip install west)

Quick version sanity checks:
```bash
which west && west --version
which python
which JLinkExe
```

## 2. Environment Setup
1. Clone and initialize Zephyr:
```bash
mkdir ~/zephyrproject && cd ~/zephyrproject
west init -m https://github.com/zephyrproject-rtos/zephyr.git --mr main
west update
west zephyr-export
```

2. Create a virtual environment and install dependencies:
```bash
python3 -m venv ~/.venvs/zephyr
source ~/.venvs/zephyr/bin/activate
pip install --upgrade pip
pip install -r zephyr/scripts/requirements.txt
```

3. Install runner deps (needed for west flash with J-Link):
```bash
pip install pylink-square intelhex pyserial
```

4. Export path to python for CMake:
```bash
export WEST_PYTHON=$(which python)
```

## 3. Application Structure

App location:

`firmware/boards/dwm3001cdk/dev_firmware/led_bringup/`

### app.overlay

Defines LED D12 (mapped to `P0.14`, active-low):

```dts
/ {
    leds {
        compatible = "gpio-leds";
        d12_led: led0 {
            gpios = <&gpio0 14 GPIO_ACTIVE_LOW>;
            label = "DWM3001CDK D12";
        };
    };
    aliases { led0 = &d12_led; };
};
```

### src/main.c

Minimal blink loop:

```c
#include <zephyr/kernel.h>
#include <zephyr/drivers/gpio.h>

#define LED_NODE DT_ALIAS(led0)
#if !DT_NODE_HAS_STATUS(LED_NODE, okay)
#error "led0 alias missing (overlay not applied?)"
#endif

static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(LED_NODE, gpios);

void main(void) {
    if (!device_is_ready(led.port)) return;
    gpio_pin_configure_dt(&led, GPIO_OUTPUT_INACTIVE);
    while (1) {
        gpio_pin_toggle_dt(&led);
        k_msleep(250);
    }
}
```

## 4. Build & Flash

### Clean build

```bash
cd ~/zephyrproject
rm -rf build/led_bringup
west build -b nrf52833dk/nrf52833 /Users/xiyaowang/Documents/Projects/ECE496/Drone_L_RL/firmware/boards/dwm3001cdk/dev_firmware/led_bringup -d build/led_bringup -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"
```

Or, if you’re running from this repo and want a relative path (same build flags):

```bash
west build -b nrf52833dk/nrf52833 /Users/xiyaowang/Documents/Projects/ECE496/Drone_L_RL/firmware/boards/dwm3001cdk/dev_firmware/led_bringup -d build/led_bringup -p always -- -DPython3_EXECUTABLE="$WEST_PYTHON"
```

### Flash via J-Link (connect to J20, not J9!)

```bash
west flash -r jlink -d build/led_bringup
```

## 5. Verify

During build you should see a line like:

```text
-- Found devicetree overlay: .../app.overlay
```

After flashing, LED D12 should blink at ~2 Hz.

- If the LED is stuck ON, flip `GPIO_ACTIVE_LOW` ↔ `GPIO_ACTIVE_HIGH` in `app.overlay`.
- To confirm which pin is compiled, inspect:
  `build/led_bringup/zephyr/include/generated/zephyr/devicetree_generated.h`

## 6. Troubleshooting

- __No module named elftools__: install in venv: `pip install pyelftools`.
- __Overlay parse error__: check braces `{}` and semicolons `;`, remove smart quotes.
- __Nothing blinks__: try neighbouring pins (13, 15, 16, 28). Use a sweep tester app to discover mapping.

For repository-wide conventions and common commands, see the project root `README.md`.
