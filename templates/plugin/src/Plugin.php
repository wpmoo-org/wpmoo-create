<?php

namespace PROJECT_NAMESPACE;

use WPMoo\Core\App;
use WPMoo\Core\View;

/**
 * Plugin Name: PROJECT_NAME
 * Description: PROJECT_DESCRIPTION
 * Version: 1.0.0
 * Author: PROJECT_AUTHOR_NAME
 * Author URI: PROJECT_AUTHOR_EMAIL
 * License: GPL-2.0-or-later
 * Text Domain: PROJECT_TEXT_DOMAIN
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

class Plugin extends App
{
    /**
     * Initializes the plugin.
     */
    public function __construct()
    {
        parent::__construct();
        $this->loadHooks();
    }

    /**
     * Loads WordPress hooks.
     */
    protected function loadHooks()
    {
        // Example: Add a shortcode
        add_shortcode('PROJECT_SLUG_hello_shortcode', [$this, 'PROJECT_FUNCTION_NAME_hello_world_shortcode']);

        // Example: Admin notice for samples
        add_action('admin_notices', [$this, 'PROJECT_FUNCTION_NAME_admin_notice']);
    }

    /**
     * Renders a "Hello World" message.
     *
     * @return string
     */
    public function PROJECT_FUNCTION_NAME_hello_world_shortcode(): string
    {
        return 'Hello from PROJECT_NAME!';
    }

    /**
     * Displays an admin notice regarding samples.
     */
    public function PROJECT_FUNCTION_NAME_admin_notice()
    {
        // In a real scenario, this would check a setting to see if samples are active.
        // For now, it's just a placeholder notice.
        $screen = get_current_screen();
        if (strpos($screen->id, 'PROJECT_SLUG_screen_id') !== false) { // Check if we are on our plugin's admin page
            $view = new View();
            echo $view->render('@WPMoo-samples/samples-notice', [
                'plugin_name' => 'PROJECT_NAME',
                'samples_status' => 'disabled', // Placeholder, would come from settings
                'activation_url' => '#' // Placeholder for actual activation URL
            ]);
        }
    }
}

// Bootstrap the plugin
function PROJECT_FUNCTION_NAME_run() {
    return Plugin::instance();
}
add_action('plugins_loaded', 'PROJECT_FUNCTION_NAME_run');