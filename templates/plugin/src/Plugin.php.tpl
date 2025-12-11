<?php

namespace {{NAMESPACE}};

use WPMoo\Core\App;
use WPMoo\Core\View;

/**
 * Plugin Name: {{PROJECT_NAME}}
 * Description: {{PROJECT_DESCRIPTION}}
 * Version: 1.0.0
 * Author: {{AUTHOR_NAME}}
 * Author URI: {{AUTHOR_EMAIL}}
 * License: GPL-2.0-or-later
 * Text Domain: {{TEXT_DOMAIN}}
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
        add_shortcode('{{PROJECT_SLUG}}_hello', [$this, 'helloWorldShortcode']);

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
        return 'Hello from {{PROJECT_NAME}}!';
    }

    /**
     * Displays an admin notice regarding samples.
     */
    public function samplesAdminNotice()
    {
        // In a real scenario, this would check a setting to see if samples are active.
        // For now, it's just a placeholder notice.
        $screen = get_current_screen();
        if (strpos($screen->id, '{{PROJECT_SLUG}}') !== false) { // Check if we are on our plugin's admin page
            $view = new View();
            echo $view->render('@WPMoo-samples/samples-notice', [
                'plugin_name' => '{{PROJECT_NAME}}',
                'samples_status' => 'disabled', // Placeholder, would come from settings
                'activation_url' => '#' // Placeholder for actual activation URL
            ]);
        }
    }
}

// Bootstrap the plugin
function {{PROJECT_FUNCTION_NAME}}_run() {
    return Plugin::instance();
}
add_action('plugins_loaded', '{{PROJECT_FUNCTION_NAME}}_run');