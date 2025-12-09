<?php
/**
 * Main Plugin Class.
 *
 * @package {{NAMESPACE}}
 */

namespace {{NAMESPACE}};

use {{NAMESPACE}}\Setup\I18n;
use {{NAMESPACE}}\Admin\AdminSettings;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 */
class Plugin {

	/**
	 * Begins execution of the plugin.
	 *
	 * Since everything within the plugin is registered via hooks,
	 * then kicking off the plugin from this point in the file does
	 * not affect the page life cycle.
	 */
	public function run() {
		$this->set_locale();
		$this->define_admin_hooks();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the I18n class in order to set the domain and to register the hook
	 * with WordPress.
	 */
	private function set_locale() {
		$plugin_i18n = new I18n();
		add_action( 'plugins_loaded', array( $plugin_i18n, 'load_plugin_textdomain' ) );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 */
	private function define_admin_hooks() {
		// Initialize Admin Settings page using WPMoo.
		new AdminSettings();
	}
}
