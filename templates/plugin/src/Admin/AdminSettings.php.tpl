<?php
/**
 * Admin Settings Page.
 *
 * @package {{NAMESPACE}}\Admin
 */

namespace {{NAMESPACE}}\Admin;

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
	 */
	public function register_page() {
		// Create the main admin page.
		Moo::page( '{{TEXT_DOMAIN}}-settings', '{{PROJECT_NAME}}' )
			->menu_icon( 'dashicons-admin-generic' );

		// Create a default tab with a welcome message
		Moo::tabs( '{{TEXT_DOMAIN}}_main_tabs' )
			->parent( '{{TEXT_DOMAIN}}-settings' )
			->items(
				array(
					array(
						'id'      => 'general',
						'title'   => __( 'General', '{{TEXT_DOMAIN}}' ),
						'content' => array(
							Moo::field( 'message', 'welcome_message' )
								->label( __( 'Welcome', '{{TEXT_DOMAIN}}' ) )
								->default( 'Welcome to {{PROJECT_NAME}} Settings' )
								->description( __( 'This is a sample settings page created with WPMoo.', '{{TEXT_DOMAIN}}' ) ),
						),
					),
				)
			);
	}
}
