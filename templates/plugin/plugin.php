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

// Initialize the plugin
\WPMoo\WordPress\Bootstrap::initialize( __FILE__, '{{TEXT_DOMAIN}}', '0.1.0' );

// If this plugin instance is the "winner" chosen by the loader, boot the framework.
// Note: This check ensures that WPMoo is only booted once, by the plugin
// that has the highest WPMoo version requirement.
if ( defined( 'WPMOO_IS_LOADING_WINNER' ) ) {
	\WPMoo\WordPress\Bootstrap::instance()->boot( __FILE__, '{{TEXT_DOMAIN}}' );
}

// Optionally, you can include your custom classes here if they are not autoloaded.
// For example, if you have custom code in `src/`.
// require_once __DIR__ . '/src/SomeCustomClass.php';
