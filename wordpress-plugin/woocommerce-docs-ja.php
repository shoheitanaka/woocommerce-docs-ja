<?php
/**
 * Plugin Name: WooCommerce Docs Japanese
 * Plugin URI: https://github.com/shoheitanaka/woocommerce-docs-ja
 * Description: Display translated WooCommerce documentation on your WordPress site with version control
 * Version: 1.0.1
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
define( 'WC_DOCS_JA_VERSION', '1.0.1' );
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
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_filter( 'the_content', array( $this, 'filter_content' ) );
		add_filter( 'template_include', array( $this, 'load_custom_template' ) );
		add_action( 'after_setup_theme', array( $this, 'add_theme_support' ) );
		add_shortcode( 'wc_docs', array( $this, 'docs_shortcode' ) );
	}

	/**
	 * 依存関係の読み込み
	 */
	private function load_dependencies() {
		require_once WC_DOCS_JA_PLUGIN_DIR . 'includes/class-wc-docs-ja-version-manager.php';
		require_once WC_DOCS_JA_PLUGIN_DIR . 'includes/class-wc-docs-ja-shortcodes.php';
		require_once WC_DOCS_JA_PLUGIN_DIR . 'includes/class-wc-docs-ja-api-handler.php';
		require_once WC_DOCS_JA_PLUGIN_DIR . 'includes/class-wc-docs-blocks.php';
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
		// Documentation Category (hierarchical structure).
		$cat_args = array(
			'label'             => __( 'Documentation Category', 'woocommerce-docs-ja' ),
			'labels'            => array(
				'name'              => __( 'Documentation Categories', 'woocommerce-docs-ja' ),
				'singular_name'     => __( 'Documentation Category', 'woocommerce-docs-ja' ),
				'search_items'      => __( 'Search Categories', 'woocommerce-docs-ja' ),
				'all_items'         => __( 'All Categories', 'woocommerce-docs-ja' ),
				'parent_item'       => __( 'Parent Category', 'woocommerce-docs-ja' ),
				'parent_item_colon' => __( 'Parent Category:', 'woocommerce-docs-ja' ),
				'edit_item'         => __( 'Edit Category', 'woocommerce-docs-ja' ),
				'update_item'       => __( 'Update Category', 'woocommerce-docs-ja' ),
				'add_new_item'      => __( 'Add New Category', 'woocommerce-docs-ja' ),
				'new_item_name'     => __( 'New Category Name', 'woocommerce-docs-ja' ),
				'menu_name'         => __( 'Categories', 'woocommerce-docs-ja' ),
			),
			'hierarchical'      => true,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_rest'      => true,
			'rest_base'         => 'wc_docs_category',
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'wc-docs-category' ),
		);

		register_taxonomy( 'wc_docs_category', array( 'wc_docs' ), $cat_args );

		// Documentation Version.
		$ver_args = array(
			'label'        => __( 'Documentation Version', 'woocommerce-docs-ja' ),
			'hierarchical' => true,
			'public'       => true,
			'show_ui'      => true,
			'show_in_rest' => true,
			'rewrite'      => array( 'slug' => 'docs-version' ),
		);

		register_taxonomy( 'docs_version', array( 'wc_docs' ), $ver_args );
	}

	/**
	 * Register settings.
	 *
	 * @since 1.0.0
	 */
	public function register_settings() {
		register_setting(
			'wc_docs_ja_settings',
			'wc_docs_ja_auto_toc',
			array(
				'type'              => 'boolean',
				'sanitize_callback' => 'rest_sanitize_boolean',
				'default'           => true,
			)
		);
	}

	/**
	 * Enqueue assets.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_assets() {
		// Enqueue template styles and scripts for wc_docs post type.
		if ( is_singular( 'wc_docs' ) || is_post_type_archive( 'wc_docs' ) || is_tax( 'wc_docs_category' ) ) {
			wp_enqueue_style(
				'wc-docs-ja-template-style',
				WC_DOCS_JA_PLUGIN_URL . 'aseets/css/docs-template.css',
				array(),
				WC_DOCS_JA_VERSION
			);

			wp_enqueue_script(
				'wc-docs-ja-template-script',
				WC_DOCS_JA_PLUGIN_URL . 'aseets/js/docs-template.js',
				array(),
				WC_DOCS_JA_VERSION,
				true
			);
		}

		// Enqueue general styles for all pages.
		if ( is_singular( 'wc_docs' ) || is_page() ) {
			wp_enqueue_style(
				'wc-docs-ja-style',
				WC_DOCS_JA_PLUGIN_URL . 'aseets/css/style.css',
				array(),
				WC_DOCS_JA_VERSION
			);

			wp_enqueue_script(
				'wc-docs-ja-script',
				WC_DOCS_JA_PLUGIN_URL . 'aseets/js/script.js',
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
	}

	/**
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

		// Get WooCommerce Docs pages (deployed documentation).
		$docs_pages = get_posts(
			array(
				'post_type'      => 'page',
				'posts_per_page' => -1,
				'meta_query'     => array(
					array(
						'key'     => 'source_file',
						'compare' => 'EXISTS',
					),
				),
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		);

		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<p><?php esc_html_e( 'WooCommerce Documentation Japanese Translation', 'woocommerce-docs-ja' ); ?></p>

			<h2><?php esc_html_e( 'Deployed Documentation', 'woocommerce-docs-ja' ); ?></h2>
			
			<?php if ( empty( $docs_pages ) ) : ?>
				<p><?php esc_html_e( 'No documentation pages found. Please deploy documentation using the deployment script.', 'woocommerce-docs-ja' ); ?></p>
			<?php else : ?>
				<table class="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Title', 'woocommerce-docs-ja' ); ?></th>
							<th><?php esc_html_e( 'Source File', 'woocommerce-docs-ja' ); ?></th>
							<th><?php esc_html_e( 'Last Updated', 'woocommerce-docs-ja' ); ?></th>
							<th><?php esc_html_e( 'Version', 'woocommerce-docs-ja' ); ?></th>
							<th><?php esc_html_e( 'Actions', 'woocommerce-docs-ja' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $docs_pages as $doc ) : ?>
							<?php
							$source_file  = get_post_meta( $doc->ID, 'source_file', true );
							$last_updated = get_post_meta( $doc->ID, 'last_updated', true );
							$version      = get_post_meta( $doc->ID, 'version', true );
							?>
							<tr>
								<td>
									<strong>
										<a href="<?php echo esc_url( get_edit_post_link( $doc->ID ) ); ?>">
											<?php echo esc_html( $doc->post_title ); ?>
										</a>
									</strong>
								</td>
								<td><?php echo esc_html( $source_file ); ?></td>
								<td>
									<?php
									if ( $last_updated ) {
										echo esc_html( date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), strtotime( $last_updated ) ) );
									} else {
										echo esc_html( get_the_modified_date( '', $doc->ID ) );
									}
									?>
								</td>
								<td><?php echo esc_html( $version ? $version : 'latest' ); ?></td>
								<td>
									<a href="<?php echo esc_url( get_permalink( $doc->ID ) ); ?>" target="_blank" class="button button-small">
										<?php esc_html_e( 'View', 'woocommerce-docs-ja' ); ?>
									</a>
									<a href="<?php echo esc_url( get_edit_post_link( $doc->ID ) ); ?>" class="button button-small">
										<?php esc_html_e( 'Edit', 'woocommerce-docs-ja' ); ?>
									</a>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
				<p class="description">
					<?php
					printf(
						/* translators: %d: number of documentation pages */
						esc_html__( 'Total: %d documentation pages', 'woocommerce-docs-ja' ),
						count( $docs_pages )
					);
					?>
				</p>
			<?php endif; ?>

			<h2><?php esc_html_e( 'Settings', 'woocommerce-docs-ja' ); ?></h2>
			<form method="post" action="options.php">
				<?php settings_fields( 'wc_docs_ja_settings' ); ?>
				<table class="form-table">
					<tr>
						<th scope="row">
							<label for="wc_docs_ja_auto_toc">
								<?php esc_html_e( 'Auto-generate Table of Contents', 'woocommerce-docs-ja' ); ?>
							</label>
						</th>
						<td>
							<input type="checkbox" id="wc_docs_ja_auto_toc" name="wc_docs_ja_auto_toc" value="1" 
								<?php checked( get_option( 'wc_docs_ja_auto_toc', true ) ); ?> />
							<p class="description">
								<?php esc_html_e( 'Automatically generate a table of contents for documentation pages.', 'woocommerce-docs-ja' ); ?>
							</p>
						</td>
					</tr>
				</table>
		<?php submit_button(); ?>
	</form>
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
	}

	/**
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

	/**
	 * Load custom template.
	 *
	 * @since 1.0.0
	 * @param string $template Template path.
	 * @return string Modified template path.
	 */
	public function load_custom_template( $template ) {
		// Skip if using FSE theme (block templates are handled differently).
		if ( $this->is_fse_theme() ) {
			return $template;
		}

		// Check if this is a wc_docs single post.
		if ( is_singular( 'wc_docs' ) ) {
			$custom_template = WC_DOCS_JA_PLUGIN_DIR . 'templates/single-wc_docs.php';
			if ( file_exists( $custom_template ) ) {
				return $custom_template;
			}
		}

		// Check if this is a wc_docs archive or category.
		if ( is_post_type_archive( 'wc_docs' ) || is_tax( 'wc_docs_category' ) ) {
			$custom_template = WC_DOCS_JA_PLUGIN_DIR . 'templates/archive-wc_docs.php';
			if ( file_exists( $custom_template ) ) {
				return $custom_template;
			}
		}

		return $template;
	}

	/**
	 * Add theme support for block templates.
	 *
	 * @since 1.0.0
	 */
	public function add_theme_support() {
		// Register block template directory.
		if ( $this->is_fse_theme() ) {
			add_filter( 'get_block_templates', array( $this, 'inject_block_templates' ), 10, 3 );
		}
	}

	/**
	 * Check if current theme is an FSE theme.
	 *
	 * @since 1.0.0
	 * @return bool True if FSE theme.
	 */
	private function is_fse_theme() {
		if ( function_exists( 'wp_is_block_theme' ) ) {
			return wp_is_block_theme();
		}
		return false;
	}

	/**
	 * Inject custom block templates.
	 *
	 * @since 1.0.0
	 * @param array  $query_result Array of found block templates.
	 * @param array  $query Arguments to retrieve templates.
	 * @param string $template_type Template type: 'wp_template' or 'wp_template_part'.
	 * @return array Modified templates array.
	 */
	public function inject_block_templates( $query_result, $query, $template_type ) {
		if ( 'wp_template' !== $template_type ) {
			return $query_result;
		}

		$templates_dir = WC_DOCS_JA_PLUGIN_DIR . 'templates/';

		// Define our custom templates.
		$custom_templates = array(
			'single-wc_docs'  => array(
				'title'       => __( 'Single WC Docs', 'woocommerce-docs-ja' ),
				'description' => __( 'Template for single WC Docs posts', 'woocommerce-docs-ja' ),
				'post_types'  => array( 'wc_docs' ),
			),
			'archive-wc_docs' => array(
				'title'       => __( 'Archive WC Docs', 'woocommerce-docs-ja' ),
				'description' => __( 'Template for WC Docs archive and categories', 'woocommerce-docs-ja' ),
				'post_types'  => array( 'wc_docs' ),
			),
		);

		foreach ( $custom_templates as $slug => $template_data ) {
			$template_file = $templates_dir . $slug . '.html';

			if ( ! file_exists( $template_file ) ) {
				continue;
			}

			// Check if we should add this template.
			$should_add = false;

			if ( isset( $query['slug__in'] ) && in_array( $slug, $query['slug__in'], true ) ) {
				$should_add = true;
			} elseif ( ! isset( $query['slug__in'] ) ) {
				$should_add = true;
			}

			if ( ! $should_add ) {
				continue;
			}

			// Check if template already exists in results.
			$template_exists = false;
			foreach ( $query_result as $existing_template ) {
				if ( $existing_template->slug === $slug ) {
					$template_exists = true;
					break;
				}
			}

			if ( $template_exists ) {
				continue;
			}

			// Create template object.
			$template_content = file_get_contents( $template_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

			$template                 = new WP_Block_Template();
			$template->id             = 'woocommerce-docs-ja//' . $slug;
			$template->theme          = 'woocommerce-docs-ja';
			$template->slug           = $slug;
			$template->source         = 'plugin';
			$template->type           = 'wp_template';
			$template->title          = $template_data['title'];
			$template->description    = $template_data['description'];
			$template->content        = $template_content;
			$template->status         = 'publish';
			$template->has_theme_file = true;
			$template->is_custom      = true;
			$template->post_types     = $template_data['post_types'];

			$query_result[] = $template;
		}

		return $query_result;
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
