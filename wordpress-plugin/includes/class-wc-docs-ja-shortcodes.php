<?php
/**
 * Shortcode Manager Class
 *
 * Provides shortcode functionality for WooCommerce Docs Japanese.
 *
 * @package WooCommerce_Docs_JA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC_Docs_JA_Shortcodes class.
 *
 * @since 1.0.0
 */
class WC_Docs_JA_Shortcodes {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->register_shortcodes();
	}

	/**
	 * Register shortcodes.
	 */
	public function register_shortcodes() {
		add_shortcode( 'wc_docs', array( $this, 'render_docs_shortcode' ) );
		add_shortcode( 'wc_docs_list', array( $this, 'render_docs_list_shortcode' ) );
		add_shortcode( 'wc_docs_search', array( $this, 'render_search_shortcode' ) );
		add_shortcode( 'wc_docs_toc', array( $this, 'render_toc_shortcode' ) );
		add_shortcode( 'wc_docs_version', array( $this, 'render_version_shortcode' ) );
	}

	/**
	 * Document display shortcode.
	 *
	 * Usage example: [wc_docs slug="getting-started"]
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_docs_shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'slug'           => '',
				'id'             => '',
				'version'        => 'latest',
				'show_toc'       => 'true',
				'show_title'     => 'true',
				'show_meta'      => 'false',
				'excerpt_length' => 0,
			),
			$atts
		);

		// Get the page.
		$page = $this->get_page( $atts['slug'], $atts['id'] );      if ( ! $page ) {
			return '<p class="wc-docs-error">' .
					__( 'Documentation not found.', 'woocommerce-docs-ja' ) .
					'</p>';
		}

		// Check version.
		if ( 'latest' !== $atts['version'] ) {
			$page_version = get_post_meta( $page->ID, '_wc_docs_version', true );
			if ( $page_version && $page_version !== $atts['version'] ) {
				return '<p class="wc-docs-error">' .
				// translators: %s is the version.
						sprintf( __( 'This document is not available for version %s.', 'woocommerce-docs-ja' ), esc_html( $atts['version'] ) ) .
						'</p>';
			}
		}

		// Get the content.
		$content = apply_filters( 'the_content', $page->post_content ); // Excerpt mode.
		if ( $atts['excerpt_length'] > 0 ) {
			$content = wp_trim_words( $content, $atts['excerpt_length'] );
		}

		// Build output.
		ob_start();
		?>
	<div class="wc-docs-embed wc-docs-single" data-slug="<?php echo esc_attr( $atts['slug'] ); ?>">
		
		<?php if ( 'true' === $atts['show_title'] ) : ?>
			<h2 class="wc-docs-title">
				<a href="<?php echo esc_url( get_permalink( $page->ID ) ); ?>">
					<?php echo esc_html( $page->post_title ); ?>
				</a>
			</h2>
		<?php endif; ?>
		
		<?php if ( 'true' === $atts['show_meta'] ) : ?>
			<div class="wc-docs-meta">
				<?php
				$version = get_post_meta( $page->ID, '_wc_docs_version', true );
				$updated = get_post_meta( $page->ID, 'last_updated', true );
				?>
				<?php if ( $version ) : ?>
					<span class="wc-docs-version-badge">
						<?php echo esc_html( $version ); ?>
					</span>
				<?php endif; ?>
				<?php if ( $updated ) : ?>
					<span class="wc-docs-updated">
						<?php
						printf(
							// translators: %s is the update date.
							esc_html__( 'Updated: %s', 'woocommerce-docs-ja' ),
							esc_html( date_i18n( get_option( 'date_format' ), strtotime( $updated ) ) )
						);
						?>
					</span>
				<?php endif; ?>
			</div>
		<?php endif; ?>
		
		<?php if ( 'true' === $atts['show_toc'] && 0 === $atts['excerpt_length'] ) : ?>
			<?php echo wp_kses_post( $this->generate_toc( $content ) ); ?>
		<?php endif; ?>
		
		<div class="wc-docs-content">
			<?php echo wp_kses_post( $content ); ?>
		</div>
		
		<?php if ( $atts['excerpt_length'] > 0 ) : ?>
			<p class="wc-docs-read-more">
				<a href="<?php echo esc_url( get_permalink( $page->ID ) ); ?>" class="button">
					<?php esc_html_e( 'Read More', 'woocommerce-docs-ja' ); ?>
				</a>
			</p>
		<?php endif; ?>		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Document list shortcode.
	 *
	 * Usage example: [wc_docs_list category="api" limit="10"]
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_docs_list_shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'category'       => '',
				'version'        => 'latest',
				'limit'          => 10,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'show_excerpt'   => 'true',
				'excerpt_length' => 20,
				'layout'         => 'list', // list, grid, compact.
			),
			$atts
		);

		// Query arguments.
		$args = array(
			'post_type'      => array( 'page', 'wc_docs' ),
			'posts_per_page' => intval( $atts['limit'] ),
			'orderby'        => $atts['orderby'],
			'order'          => $atts['order'],
			'meta_query'     => array(),
		);

		// Category filter.
		if ( ! empty( $atts['category'] ) ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'category',
					'field'    => 'slug',
					'terms'    => $atts['category'],
				),
			);
		}

		// Version filter.
		if ( 'latest' !== $atts['version'] ) {
			$args['meta_query'][] = array(
				'key'     => '_wc_docs_version',
				'value'   => $atts['version'],
				'compare' => '=',
			);
		}

		$query = new WP_Query( $args );

		if ( ! $query->have_posts() ) {
			return '<p class="wc-docs-no-results">' .
					__( 'No documentation found.', 'woocommerce-docs-ja' ) .
					'</p>';
		}

		// Build output.
		ob_start();
		?>
		<div class="wc-docs-list wc-docs-layout-<?php echo esc_attr( $atts['layout'] ); ?>">
			
			<?php
			while ( $query->have_posts() ) :
				$query->the_post();
				?>
				
				<div class="wc-docs-list-item">
					<h3 class="wc-docs-list-title">
						<a href="<?php the_permalink(); ?>">
							<?php the_title(); ?>
						</a>
					</h3>
					
					<?php if ( 'true' === $atts['show_excerpt'] ) : ?>
						<div class="wc-docs-list-excerpt">
							<?php
							echo esc_html(
								wp_trim_words(
									get_the_excerpt(),
									intval( $atts['excerpt_length'] )
								)
							);
							?>
						</div>
					<?php endif; ?>
					
					<div class="wc-docs-list-meta">
						<?php
						$version = get_post_meta( get_the_ID(), '_wc_docs_version', true );
						if ( $version ) :
							?>
							<span class="wc-docs-version-badge"><?php echo esc_html( $version ); ?></span>
						<?php endif; ?>
					</div>
				</div>
				
			<?php endwhile; ?>
			
		</div>
		<?php
		wp_reset_postdata();
		return ob_get_clean();
	}

	/**
	 * Search box shortcode.
	 *
	 * Usage example: [wc_docs_search placeholder="Search documentation..."]
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_search_shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'placeholder' => __( 'Search documentation...', 'woocommerce-docs-ja' ),
				'button_text' => __( 'Search', 'woocommerce-docs-ja' ),
				'show_button' => 'true',
			),
			$atts
		);

		ob_start();
		?>
		<form class="wc-docs-search-form" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
			<input type="hidden" name="post_type" value="page">
			<div class="wc-docs-search-wrapper">
				<input 
					type="search" 
					name="s" 
					class="wc-docs-search-input"
					placeholder="<?php echo esc_attr( $atts['placeholder'] ); ?>"
					value="<?php echo get_search_query(); ?>"
				/>
				<?php if ( 'true' === $atts['show_button'] ) : ?>
					<button type="submit" class="wc-docs-search-button">
						<?php echo esc_html( $atts['button_text'] ); ?>
					</button>
				<?php endif; ?>
			</div>
		</form>
		<?php
		return ob_get_clean();
	}

	/**
	 * Table of contents shortcode.
	 *
	 * Usage example: [wc_docs_toc]
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_toc_shortcode( $atts ) {
		global $post;

		if ( ! $post ) {
			return '';
		}

		$atts = shortcode_atts(
			array(
				'depth' => 3,
				'title' => __( 'Table of Contents', 'woocommerce-docs-ja' ),
			),
			$atts
		);

		$content = apply_filters( 'the_content', $post->post_content );
		return $this->generate_toc( $content, $atts['depth'], $atts['title'] );
	}

	/**
	 * Version switcher shortcode.
	 *
	 * Usage example: [wc_docs_version]
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_version_shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'label'      => __( 'Version:', 'woocommerce-docs-ja' ),
				'show_label' => 'true',
			),
			$atts
		);

		if ( ! class_exists( 'WC_Docs_JA_Version_Manager' ) ) {
			return '';
		}

		return WC_Docs_JA_Version_Manager::render_version_switcher();
	}

	/**
	 * Get page.
	 *
	 * @param string $slug Page slug.
	 * @param int    $id Page ID.
	 * @return WP_Post|null
	 */
	private function get_page( $slug, $id ) {
		if ( ! empty( $id ) ) {
			return get_post( intval( $id ) );
		}

		if ( ! empty( $slug ) ) {
			return get_page_by_path( $slug, OBJECT, array( 'page', 'wc_docs' ) );
		}

		return null;
	}

	/**
	 * Generate table of contents.
	 *
	 * @param string $content Content.
	 * @param int    $depth Depth.
	 * @param string $title Title.
	 * @return string HTML output.
	 */
	private function generate_toc( $content, $depth = 3, $title = null ) {
		if ( null === $title ) {
			$title = __( 'Table of Contents', 'woocommerce-docs-ja' );
		}

		// Extract headings.
		preg_match_all( '/<h([2-' . $depth . ']).*?>(.*?)<\/h[2-' . $depth . ']>/i', $content, $matches );      if ( empty( $matches[0] ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="wc-docs-toc">
			<?php if ( $title ) : ?>
				<h2 class="wc-docs-toc-title"><?php echo esc_html( $title ); ?></h2>
			<?php endif; ?>
			<ul class="wc-docs-toc-list">
				<?php foreach ( $matches[0] as $index => $heading ) : ?>
					<?php
					$level  = $matches[1][ $index ];
					$text   = strip_tags( $matches[2][ $index ] );
					$anchor = sanitize_title( $text );
					?>
					<li class="wc-docs-toc-level-<?php echo esc_attr( $level ); ?>">
						<a href="#<?php echo esc_attr( $anchor ); ?>">
							<?php echo esc_html( $text ); ?>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php
		return ob_get_clean();
	}
}

// Initialize.
new WC_Docs_JA_Shortcodes();
