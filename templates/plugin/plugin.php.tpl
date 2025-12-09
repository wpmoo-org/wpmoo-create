<?php
/**
 * Plugin Name: {{PROJECT_NAME}}
 * Description: {{PROJECT_DESCRIPTION}}
 * Version: 0.1.0
 * Author: {{AUTHOR_NAME}}
 * Text Domain: {{TEXT_DOMAIN}}
 * License: GPL-2.0-or-later
 *
 * @package {{NAMESPACE}}
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	wp_die();
}

/**
 * Load the WPMoo framework bootstrap.
 *
 * This file is responsible for setting up constants, autoloading,
 * and initializing the framework.
 */
require_once __DIR__ . '/vendor/autoload.php';

// Initialize and boot the WPMoo framework for this plugin.
\WPMoo\WordPress\Bootstrap::instance()->boot( __FILE__, '{{TEXT_DOMAIN}}' );

/**
 * The code that runs during plugin activation.
 */
function activate_{{PROJECT_FUNCTION_NAME}}() {
	\{{NAMESPACE}}\Setup\Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_{{PROJECT_FUNCTION_NAME}}() {
	\{{NAMESPACE}}\Setup\Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_{{PROJECT_FUNCTION_NAME}}' );
register_deactivation_hook( __FILE__, 'deactivate_{{PROJECT_FUNCTION_NAME}}' );

// Start the plugin logic
$plugin = new \{{NAMESPACE}}\Plugin();
$plugin->run();
