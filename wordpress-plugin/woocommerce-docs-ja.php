<?php
/**
 * Plugin Name: WooCommerce Docs Japanese
 * Plugin URI: https://github.com/shoheitanaka/woocommerce-docs-ja
 * Description: Display translated WooCommerce documentation on your WordPress site with version control
 * Version: 1.0.0
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Author: Shohei Tanaka
 * Author URI: https://github.com/shoheitanaka
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: woocommerce-docs-ja
 * Domain Path: /languages
 *
 * @package WooCommerce_Docs_JA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Plugin constants.
define( 'WC_DOCS_JA_VERSION', '1.0.0' );
define( 'WC_DOCS_JA_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'WC_DOCS_JA_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'WC_DOCS_JA_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * メインプラグインクラス
 */
class WooCommerce_Docs_JA {

	/**
	 * Singleton instance.
	 *
	 * @since 1.0.0
	 * @var WooCommerce_Docs_JA|null
	 */
	private static $instance = null;

	/**
	 * インスタンスの取得
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * コンストラクタ
	 */
	private function __construct() {
		$this->init_hooks();
		$this->load_dependencies();
	}

	/**
	 * フックの初期化
	 */
	private function init_hooks() {
		add_action( 'init', array( $this, 'register_post_type' ) );
		add_action( 'init', array( $this, 'register_taxonomy' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_filter( 'the_content', array( $this, 'filter_content' ) );
		add_shortcode( 'wc_docs', array( $this, 'docs_shortcode' ) );
	}

	/**
	 * 依存関係の読み込み
	 */
	private function load_dependencies() {
		require_once WC_DOCS_JA_PLUGIN_DIR . 'includes/class-version-manager.php';
		require_once WC_DOCS_JA_PLUGIN_DIR . 'includes/class-shortcodes.php';
		require_once WC_DOCS_JA_PLUGIN_DIR . 'includes/class-api-handler.php';
	}

	/**
	 * Register custom post type.
	 *
	 * @since 1.0.0
	 */
	public function register_post_type() {
		$args = array(
			'label'           => __( 'WooCommerce Docs', 'woocommerce-docs-ja' ),
			'public'          => true,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'capability_type' => 'page',
			'hierarchical'    => true,
			'supports'        => array( 'title', 'editor', 'page-attributes', 'custom-fields' ),
			'has_archive'     => true,
			'rewrite'         => array( 'slug' => 'wc-docs' ),
			'show_in_rest'    => true,
			'menu_icon'       => 'dashicons-book-alt',
		);

		register_post_type( 'wc_docs', $args );
	}

	/**
	 * Register taxonomy.
	 *
	 * @since 1.0.0
	 */
	public function register_taxonomy() {
		$args = array(
			'label'        => __( 'Documentation Version', 'woocommerce-docs-ja' ),
			'hierarchical' => true,
			'public'       => true,
			'show_ui'      => true,
			'show_in_rest' => true,
			'rewrite'      => array( 'slug' => 'docs-version' ),
		);

		register_taxonomy( 'docs_version', array( 'page', 'wc_docs' ), $args );
	}   /**
		 * Enqueue assets.
		 *
		 * @since 1.0.0
		 */
	public function enqueue_assets() {
		if ( is_singular( 'wc_docs' ) || is_page() ) {
			wp_enqueue_style(
				'wc-docs-ja-style',
				WC_DOCS_JA_PLUGIN_URL . 'style.css',
				array(),
				WC_DOCS_JA_VERSION
			);

			wp_enqueue_script(
				'wc-docs-ja-script',
				WC_DOCS_JA_PLUGIN_URL . 'script.js',
				array( 'jquery' ),
				WC_DOCS_JA_VERSION,
				true
			);

			wp_localize_script(
				'wc-docs-ja-script',
				'wcDocsJa',
				array(
					'ajaxUrl'        => admin_url( 'admin-ajax.php' ),
					'nonce'          => wp_create_nonce( 'wc-docs-ja-nonce' ),
					'currentVersion' => $this->get_current_version(),
				)
			);
		}
	}   /**
		 * Add admin menu.
		 *
		 * @since 1.0.0
		 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'WC Docs Settings', 'woocommerce-docs-ja' ),
			__( 'WC Docs JA', 'woocommerce-docs-ja' ),
			'manage_options',
			'wc-docs-ja-settings',
			array( $this, 'render_settings_page' ),
			'dashicons-book-alt',
			30
		);
	}

	/**
	 * Render settings page.
	 *
	 * @since 1.0.0
	 */
	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<p><?php esc_html_e( 'WooCommerce Documentation Japanese Translation Settings', 'woocommerce-docs-ja' ); ?></p>
		</div>
		<?php
	}   /**
		 * Filter content.
		 *
		 * @since 1.0.0
		 * @param string $content Post content.
		 * @return string Modified content.
		 */
	public function filter_content( $content ) {
		if ( ! is_singular( 'wc_docs' ) && ! is_page() ) {
			return $content;
		}

		global $post;

		// Display version information.
		$version = get_post_meta( $post->ID, '_wc_docs_version', true );
		if ( $version ) {
			$version_notice = sprintf(
				'<div class="wc-docs-version-notice">%s: %s</div>',
				esc_html__( 'Version', 'woocommerce-docs-ja' ),
				esc_html( $version )
			);
			$content        = $version_notice . $content;
		}

		// Auto-generate table of contents.
		if ( get_option( 'wc_docs_ja_auto_toc', true ) ) {
			$toc = $this->generate_table_of_contents( $content );
			if ( $toc ) {
				$content = $toc . $content;
			}
		}

		return $content;
	}   /**
		 * Generate table of contents.
		 *
		 * @since 1.0.0
		 * @param string $content Post content.
		 * @return string Table of contents HTML.
		 */
	private function generate_table_of_contents( &$content ) {
		preg_match_all( '/<h([2-3]).*?>(.*?)<\/h[2-3]>/i', $content, $matches );

		if ( empty( $matches[0] ) ) {
			return '';
		}

		$toc  = '<div class="wc-docs-toc">';
		$toc .= '<h2>' . esc_html__( 'Table of Contents', 'woocommerce-docs-ja' ) . '</h2>';
		$toc .= '<ul class="toc-list">';

		foreach ( $matches[0] as $index => $heading ) {
			$level  = $matches[1][ $index ];
			$title  = wp_strip_all_tags( $matches[2][ $index ] );
			$anchor = sanitize_title( $title );

			// Add anchor link.
			$content = str_replace(
				$heading,
				preg_replace(
					'/(<h[2-3].*?>)/i',
					'$1<a id="' . esc_attr( $anchor ) . '"></a>',
					$heading
				),
				$content
			);

			$class = 'toc-level-' . absint( $level );
			$toc  .= sprintf(
				'<li class="%s"><a href="#%s">%s</a></li>',
				esc_attr( $class ),
				esc_attr( $anchor ),
				esc_html( $title )
			);
		}

		$toc .= '</ul></div>';

		return $toc;
	}

	/**
	 * Docs shortcode.
	 *
	 * @since 1.0.0
	 * @param array $atts Shortcode attributes.
	 * @return string Shortcode output.
	 */
	public function docs_shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'slug'     => '',
				'version'  => 'latest',
				'show_toc' => true,
			),
			$atts
		);

		// Get page.
		$page = get_page_by_path( sanitize_text_field( $atts['slug'] ), OBJECT, 'page' );

		if ( ! $page ) {
			return '<p>' . esc_html__( 'Documentation not found.', 'woocommerce-docs-ja' ) . '</p>';
		}

		// Return content.
		$content = apply_filters( 'the_content', $page->post_content );

		return '<div class="wc-docs-embed">' . $content . '</div>';
	}

	/**
	 * Get current version.
	 *
	 * @since 1.0.0
	 * @return string Current version.
	 */
	private function get_current_version() {
		return get_option( 'wc_docs_ja_current_version', 'latest' );
	}
}

/**
 * Initialize plugin.
 *
 * @since 1.0.0
 * @return WooCommerce_Docs_JA
 */
function wc_docs_ja_init() {
	return WooCommerce_Docs_JA::get_instance();
}

/**
 * Plugin activation hook.
 *
 * @since 1.0.0
 */
function wc_docs_ja_activate() {
	// Set default options.
	add_option( 'wc_docs_ja_auto_toc', true );
	add_option( 'wc_docs_ja_current_version', 'latest' );

	// Flush rewrite rules.
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'wc_docs_ja_activate' );

/**
 * Plugin deactivation hook.
 *
 * @since 1.0.0
 */
function wc_docs_ja_deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'wc_docs_ja_deactivate' );

// Initialize plugin.
add_action( 'plugins_loaded', 'wc_docs_ja_init' );
