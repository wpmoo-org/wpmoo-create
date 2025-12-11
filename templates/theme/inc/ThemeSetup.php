<?php
/**
 * Theme setup and configuration.
 *
 * @package __NAMESPACE__
 */

namespace __NAMESPACE__\Inc;

/**
 * Theme setup class.
 */
class ThemeSetup {

	/**
	 * Initialize theme setup.
	 */
	public static function init() {
		add_action( 'after_setup_theme', [ self::class, 'setup_theme' ] );
		add_action( 'wp_enqueue_scripts', [ self::class, 'enqueue_scripts' ] );
	}

	/**
	 * Setup theme support features.
	 */
	public static function setup_theme() {
		// Add theme support for various features
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);

		// Register navigation menus
		register_nav_menus(
			array(
				'primary' => 'Primary Menu',
			)
		);
	}

	/**
	 * Enqueue scripts and styles.
	 */
	public static function enqueue_scripts() {
		// Enqueue theme stylesheet
		wp_enqueue_style( '__TEXT_DOMAIN__-style', get_stylesheet_directory_uri() . '/style.css', array(), '0.1.0' );
	}
}