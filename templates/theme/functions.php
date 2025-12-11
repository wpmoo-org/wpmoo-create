<?php
/**
 * Theme functions and definitions.
 *
 * @package PROJECT_NAMESPACE
 */

namespace PROJECT_NAMESPACE;

use WPMoo\Core\App;

/**
 * Loads the WPMoo framework for theme.
 */
class MainTheme {

	/**
	 * Initialize the theme.
	 */
	public function run() {
		// Initialize theme setup
		require_once get_template_directory() . '/inc/ThemeSetup.php';
		\PROJECT_NAMESPACE\Inc\ThemeSetup::init();
	}
}

// Bootstrap the theme
add_action( 'after_setup_theme', function() {
	$theme = new MainTheme();
	$theme->run();
} );

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

// Initialize the theme
\WPMoo\WordPress\Bootstrap::initialize( __FILE__, 'PROJECT_TEXT_DOMAIN', '0.1.0' );

// If this theme instance is the "winner" chosen by the loader, boot the framework.
// Note: This check ensures that WPMoo is only booted once, by the theme
// that has the highest WPMoo version requirement.
if ( defined( 'WPMOO_IS_LOADING_WINNER' ) ) {
	\WPMoo\WordPress\Bootstrap::instance()->boot( __FILE__, 'PROJECT_TEXT_DOMAIN' );
}
