<?php
/**
 * Plugin Name: __PROJECT_NAME__
 * Description: __PROJECT_DESCRIPTION__
 * Version: 0.1.0
 * Author: __AUTHOR_NAME__
 * Text Domain: __TEXT_DOMAIN__
 * License: GPL-2.0-or-later
 *
 * @package __NAMESPACE__
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
\WPMoo\WordPress\Bootstrap::instance()->boot( __FILE__, '__TEXT_DOMAIN__' );

/**
 * The code that runs during plugin activation.
 */
function __ACTIVATE_FUNCTION_NAME__() {
	\__NAMESPACE__\Setup\Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function __DEACTIVATE_FUNCTION_NAME__() {
	\__NAMESPACE__\Setup\Deactivator::deactivate();
}

register_activation_hook( __FILE__, '__ACTIVATE_FUNCTION_NAME__' );
register_deactivation_hook( __FILE__, '__DEACTIVATE_FUNCTION_NAME__' );

// Start the plugin logic
$plugin = new \__NAMESPACE__\Plugin();
$plugin->run();
