/**
 * @file main.c
 * @brief LED Bring-up Application for DWM3001CDK
 *
 * This application demonstrates basic GPIO control by blinking an LED.
 * It serves as a hardware validation test to ensure the development
 * board is properly connected and functioning.
 */

#include <zephyr/kernel.h>          /* Kernel APIs: k_msleep() */
#include <zephyr/drivers/gpio.h>    /* GPIO driver APIs */

/**
 * @brief Device tree node alias for our LED
 *
 * This references the LED defined in the device tree overlay (app.overlay).
 * The alias "led0" points to the d12_led node which maps to GPIO pin 14.
 */
#define LED_NODE DT_ALIAS(led0)

/**
 * @brief Compile-time check for device tree overlay
 *
 * Ensures the LED device tree node is properly defined and enabled.
 * If this fails, the build will stop with a clear error message indicating
 * the overlay wasn't applied correctly.
 */
#if !DT_NODE_HAS_STATUS(LED_NODE, okay)
#error "led0 alias missing (overlay not applied?)"
#endif

/**
 * @brief GPIO specification for the LED
 *
 * This structure contains all the information needed to control the LED:
 * - Which GPIO port (gpio0 on nRF52833)
 * - Which pin number (14 for D12 LED)
 * - Active level (low = LED on, based on overlay configuration)
 */
static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(LED_NODE, gpios);

/**
 * @brief Main application entry point
 *
 * Initializes the LED GPIO and enters an infinite blink loop.
 * The LED blinks at approximately 0.5 Hz (on for 1s, off for 1s).
 */
void main(void) {
    /* Verify the GPIO device is ready before proceeding */
    if (!device_is_ready(led.port)) {
        /* If GPIO isn't ready, we can't continue. In a production app,
         * you might want to log this error or retry initialization. */
        return;
    }

    /* Configure the GPIO pin as an output, initially inactive (LED off).
     * GPIO_OUTPUT_INACTIVE means the pin will be set to its inactive state,
     * which is high for active-low LEDs like our D12 LED. */
    gpio_pin_configure_dt(&led, GPIO_OUTPUT_INACTIVE);

    /* Main blink loop - runs forever */
    while (1) {
        /* Toggle the LED state (on->off or off->on) */
        gpio_pin_toggle_dt(&led);

        /* Sleep for 1000ms (1 second) before next toggle.
         * This creates a 50% duty cycle blink pattern. */
        k_msleep(1000);
    }
}
