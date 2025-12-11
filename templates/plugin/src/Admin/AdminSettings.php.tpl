<?php
/**
 * Admin Settings Page.
 *
 * @package __NAMESPACE__\Admin
 */

namespace __NAMESPACE__\Admin;

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
		Moo::page( '__TEXT_DOMAIN__-settings', '__PROJECT_NAME__' )
			->menu_icon( 'dashicons-admin-generic' );

		// Create a default tab with a welcome message
		Moo::tabs( '__TEXT_DOMAIN___main_tabs' )
			->parent( '__TEXT_DOMAIN__-settings' )
			->items(
				array(
					array(
						'id'      => 'general',
						'title'   => __( 'General', '__TEXT_DOMAIN__' ),
						'content' => array(
							Moo::field( 'message', 'welcome_message' )
								->label( __( 'Welcome', '__TEXT_DOMAIN__' ) )
								->default( 'Welcome to __PROJECT_NAME__ Settings' )
								->description( __( 'This is a sample settings page created with WPMoo.', '__TEXT_DOMAIN__' ) ),
						),
					),
				)
			);
	}
}
