<?php
/**
 * Plugin Name: PROJECT_NAME
 * Description: PROJECT_DESCRIPTION
 * Version: 0.1.0
 * Author: PROJECT_AUTHOR_NAME
 * Text Domain: PROJECT_TEXT_DOMAIN
 * License: GPL-2.0-or-later
 *
 * @package PROJECT_NAMESPACE
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	wp_die();
}

use \WPMoo\WordPress\Bootstrap;
use \PROJECT_NAMESPACE\Setup\Activator;
use \PROJECT_NAMESPACE\Setup\Deactivator;
use \PROJECT_NAMESPACE\Plugin;


/**
 * Load the WPMoo framework bootstrap.
 *
 * This file is responsible for setting up constants, autoloading,
 * and initializing the framework.
 */
require_once __DIR__ . '/vendor/autoload.php';

// Initialize and boot the WPMoo framework for this plugin.
Bootstrap::instance()->boot( __FILE__, 'PROJECT_TEXT_DOMAIN' );

/**
 * The code that runs during plugin activation.
 */
function PROJECT_ACTIVATE_FUNCTION_NAME() {
	Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function PROJECT_DEACTIVATE_FUNCTION_NAME() {
	Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'PROJECT_ACTIVATE_FUNCTION_NAME' );
register_deactivation_hook( __FILE__, 'PROJECT_DEACTIVATE_FUNCTION_NAME' );

// Start the plugin logic
$plugin = new Plugin();
$plugin->run();
