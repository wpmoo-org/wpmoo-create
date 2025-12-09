<?php
/**
 * Define the internationalization functionality.
 *
 * @package {{NAMESPACE}}\Setup
 */

namespace {{NAMESPACE}}\Setup;

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 */
class I18n {

	/**
	 * Load the plugin text domain for translation.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			'{{TEXT_DOMAIN}}',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);
	}
}
