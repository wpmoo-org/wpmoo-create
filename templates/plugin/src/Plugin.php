<?php

namespace PROJECT_NAMESPACE;

if ( ! defined( 'ABSPATH' ) ) {
    wp_die(); // Exit if accessed directly
}

class Plugin
{
    /**
     * Initializes the plugin.
     */
    public function __construct()
    {
        $this->load_hooks();
    }

    /**
     * Loads WordPress hooks.
     */
    protected function load_hooks()
    {
        // Example: Add a shortcode
        add_shortcode('PROJECT_SLUG_hello_shortcode', [$this, 'PROJECT_FUNCTION_PREFIX_hello_world_shortcode']);

        // Example: Admin notice for samples
        add_action('admin_notices', [$this, 'PROJECT_FUNCTION_PREFIX_admin_notice']);
    }

    /**
     * Renders a "Hello World" message.
     *
     * @return string
     */
    public function PROJECT_FUNCTION_PREFIX_hello_world_shortcode(): string
    {
        return 'Hello from PROJECT_NAME!';
    }

    /**
     * Displays an admin notice regarding samples.
     */
    public function PROJECT_FUNCTION_PREFIX_admin_notice()
    {
        // In a real scenario, this would check a setting to see if samples are active.
        // For now, it's just a placeholder notice.
        $screen = get_current_screen();
        if (strpos($screen->id, 'PROJECT_SLUG_screen_id') !== false) { // Check if we are on our plugin's admin page
            // Display a simple admin notice using standard WordPress approach
            echo '<div class="notice notice-info is-dismissible">';
            echo '<p><strong>' . esc_html__('PROJECT_NAME', 'PROJECT_TEXT_DOMAIN') . '</strong> ' . esc_html__('notice text.', 'PROJECT_TEXT_DOMAIN') . '</p>';
            echo '</div>';
        }
    }
}

// Bootstrap the plugin
function PROJECT_FUNCTION_PREFIX_run() {
    return Plugin::instance();
}
add_action('plugins_loaded', 'PROJECT_FUNCTION_PREFIX_run');