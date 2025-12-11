<?php
/**
 * Admin Settings Page.
 *
 * @package PROJECT_NAMESPACE\Admin
 */

namespace PROJECT_NAMESPACE\Admin;

use WPMoo\Moo;

/**
 * Handles the admin settings page using WPMoo.
 */
class AdminSettings {

	/**
	 * Initialize the class and register hooks.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_page' ) );
	}

	/**
	 * Register the admin page.
	 */	public function register_page() {
		
		// Create the main admin page.
		Moo::page( 'PROJECT_FUNCTION_PREFIX-settings', __( 'WPMoo Settings', 'PROJECT_TEXT_DOMAIN' ) )
		->capability( 'manage_options' )
		->description( __( 'Configure WPMoo Framework settings', 'PROJECT_TEXT_DOMAIN' ) )
		->menu_slug( 'PROJECT_TEXT_DOMAIN' )
		->menu_position( 21 )
		->menu_icon( 'dashicons-admin-generic' );

		// Create tabs for the settings page
		Moo::tabs( 'PROJECT_FUNCTION_PREFIX_main_tabs' )
		->parent( 'PROJECT_TEXT_DOMAIN-settings' )  // Link to the settings page
		->items(
			[
				[
					'id' => 'general',
					'title' => __( 'General Settings', 'PROJECT_TEXT_DOMAIN' ),
					'content' => [
						Field::input( 'site_title' )
							->label( __( 'Site Title', 'PROJECT_TEXT_DOMAIN' ) )
							->placeholder( __( 'Enter your site title', 'PROJECT_TEXT_DOMAIN' ) ),
						Field::textarea( 'site_description' )
							->label( __( 'Site Description', 'PROJECT_TEXT_DOMAIN' ) )
							->placeholder( __( 'Enter site description', 'PROJECT_TEXT_DOMAIN' ) ),
						Field::toggle( 'enable_cache' )
							->label( __( 'Enable Caching', 'PROJECT_TEXT_DOMAIN' ) ),
					],
				],
				[
					'id' => 'advanced',
					'title' => __( 'Advanced Settings', 'PROJECT_TEXT_DOMAIN' ),
					'content' => [
						Field::input( 'cache_duration' )
							->label( __( 'Cache Duration (seconds)', 'PROJECT_TEXT_DOMAIN' ) )
							->placeholder( __( 'Enter cache duration', 'PROJECT_TEXT_DOMAIN' ) ),
						Field::toggle( 'enable_debug' )
							->label( __( 'Enable Debug Mode', 'PROJECT_TEXT_DOMAIN' ) ),
					],
				],
			]
		);
	}
}
