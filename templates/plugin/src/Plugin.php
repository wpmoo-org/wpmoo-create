<?php

namespace PROJECT_NAMESPACE;

use PROJECT_NAMESPACE\Admin\AdminSettings;

if ( ! defined( 'ABSPATH' ) ) {
    wp_die(); // Exit if accessed directly
}

class Plugin
{
    /**
     * Singleton instance of the plugin.
     */
    private static $instance = null;

    /**
     * Creates or gets the singleton instance of the plugin.
     *
     * @return Plugin
     */
    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Initializes the plugin.
     */
    public function __construct()
    {
        $this->load_hooks();
    }

    /**
     * Runs the plugin.
     */
    public function run()
    {
        // Add any initialization logic that should run when the plugin starts
        do_action('PROJECT_FUNCTION_PREFIX_loaded', self::$instance);
    }


    /**
     * Loads WordPress hooks.
     */
    protected function load_hooks()
    {
        // Example: Add a shortcode
        add_shortcode('PROJECT_FUNCTION_PREFIX_hello_world_shortcode', [$this, 'hello_world_shortcode']);

        // Example: Admin notice for samples
        add_action('admin_notices', [$this, 'admin_notice']);

        // Initialize admin settings page
        if (is_admin()) {
            new AdminSettings();
        }
    }

    /**
     * Renders a "Hello World" message.
     *
     * @return string
     */
    public function hello_world_shortcode(): string
    {
        return 'Hello from PROJECT_NAME!';
    }

    /**
     * Displays an admin notice regarding samples.
     */
    public function admin_notice()
    {
        // In a real scenario, this would check a setting to see if samples are active.
        // For now, it's just a placeholder notice.
        $screen = get_current_screen();
        if (strpos($screen->id, 'PROJECT_FUNCTION_PREFIX_screen_id') !== false) { // Check if we are on our plugin's admin page
            // Display a simple admin notice using standard WordPress approach
            echo '<div class="notice notice-info is-dismissible">';
            echo '<p><strong>' . esc_html__('PROJECT_NAME', 'PROJECT_TEXT_DOMAIN') . '</strong> ' . esc_html__('notice text.', 'my-test-plugin') . '</p>';
            echo '</div>';
        }
    }
}
