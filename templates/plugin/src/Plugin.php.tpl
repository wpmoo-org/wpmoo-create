<?php

namespace __NAMESPACE__;

use WPMoo\Core\App;
use WPMoo\Core\View;

/**
 * Plugin Name: __PROJECT_NAME__
 * Description: __PROJECT_DESCRIPTION__
 * Version: 1.0.0
 * Author: __AUTHOR_NAME__
 * Author URI: __AUTHOR_EMAIL__
 * License: GPL-2.0-or-later
 * Text Domain: __TEXT_DOMAIN__
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
        add_shortcode('__PROJECT_SLUG_HELLO_SHORTCODE__', [$this, 'helloWorldShortcode']);

        // Example: Admin notice for samples
        add_action('admin_notices', [$this, 'samplesAdminNotice']);
    }

    /**
     * Renders a "Hello World" message.
     *
     * @return string
     */
    public function helloWorldShortcode(): string
    {
        return 'Hello from __PROJECT_NAME__!';
    }

    /**
     * Displays an admin notice regarding samples.
     */
    public function samplesAdminNotice()
    {
        // In a real scenario, this would check a setting to see if samples are active.
        // For now, it's just a placeholder notice.
        $screen = get_current_screen();
        if (strpos($screen->id, '__PROJECT_SLUG_SCREEN_ID__') !== false) { // Check if we are on our plugin's admin page
            $view = new View();
            echo $view->render('@WPMoo-samples/samples-notice', [
                'plugin_name' => '__PROJECT_NAME__',
                'samples_status' => 'disabled', // Placeholder, would come from settings
                'activation_url' => '#' // Placeholder for actual activation URL
            ]);
        }
    }
}

// Bootstrap the plugin
function __PROJECT_FUNCTION_NAME_RUN__() {
    return Plugin::instance();
}
add_action('plugins_loaded', '__PROJECT_FUNCTION_NAME_RUN__');