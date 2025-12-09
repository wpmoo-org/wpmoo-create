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
		$page = Moo::page( '{{TEXT_DOMAIN}}-settings', '{{PROJECT_NAME}}' )
			->menu_title( '{{PROJECT_NAME}}' )
			->icon( 'dashicons-admin-generic' );
			
		// Example: Add a tab and fields
		// $page->add_tab( ... );
		
		// For now, we can rely on WPMoo's auto-rendering or add custom fields here.
		// Since we want to use a view template, WPMoo supports custom view rendering for fields or sections,
		// but typically WPMoo manages the UI.
		
		// If you want to render a custom view file (from templates/) inside a WPMoo page,
		// you might need a custom field type or just use standard WPMoo fields.
		// For this boilerplate, let's add a simple welcome field.
		
		$page->add_field(
			Moo::field( 'message', 'welcome_message' )
				->label( 'Welcome' )
				->default( 'Welcome to {{PROJECT_NAME}} Settings' )
				->description( 'This is a sample settings page created with WPMoo.' )
		);
	}
}
