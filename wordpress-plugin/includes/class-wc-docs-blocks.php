<?php
/**
 * WC Docs Blocks for FSE Theme Support
 *
 * @package WooCommerce_Docs_JA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class WC_Docs_Blocks
 *
 * Provides shortcodes and block rendering for FSE themes.
 */
class WC_Docs_Blocks {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_shortcode( 'wc_docs_category_nav', array( $this, 'render_category_nav' ) );
		add_shortcode( 'wc_docs_toc', array( $this, 'render_toc' ) );
		add_shortcode( 'wc_docs_breadcrumb', array( $this, 'render_breadcrumb' ) );
	}

	/**
	 * Render category navigation
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_category_nav( $atts ) {
		$atts = shortcode_atts(
			array(
				'post_id' => get_the_ID(),
			),
			$atts
		);

		$post_id = intval( $atts['post_id'] );

		// Get all categories hierarchically.
		$categories = get_terms(
			array(
				'taxonomy'   => 'wc_docs_category',
				'hide_empty' => false,
				'parent'     => 0,
				'orderby'    => 'term_order',
				'order'      => 'ASC',
			)
		);

		if ( empty( $categories ) || is_wp_error( $categories ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="wc-docs-sidebar wc-docs-sidebar-left">
			<div class="wc-docs-sidebar-inner">
				<h3 class="wc-docs-sidebar-title"><?php esc_html_e( 'Documentation', 'woocommerce-docs-ja' ); ?></h3>
				<nav class="wc-docs-category-nav">
					<?php echo $this->render_category_tree( $categories, $post_id, 0 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</nav>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render category tree recursively
	 *
	 * @param array $categories Array of category terms.
	 * @param int   $current_post_id Current post ID.
	 * @param int   $level Depth level.
	 * @return string HTML output.
	 */
	private function render_category_tree( $categories, $current_post_id, $level = 0 ) {
		if ( empty( $categories ) ) {
			return '';
		}

		$output = '<ul class="wc-docs-category-list wc-docs-category-level-' . esc_attr( $level ) . '">';

		foreach ( $categories as $category ) {
			$has_children = false;
			$children     = get_terms(
				array(
					'taxonomy'   => 'wc_docs_category',
					'hide_empty' => false,
					'parent'     => $category->term_id,
					'orderby'    => 'term_order',
					'order'      => 'ASC',
				)
			);

			if ( ! empty( $children ) && ! is_wp_error( $children ) ) {
				$has_children = true;
			}

			$item_class = 'wc-docs-category-item';
			if ( $has_children ) {
				$item_class .= ' has-children';
			}

			// Check if current post belongs to this category.
			$current_categories = wp_get_post_terms( $current_post_id, 'wc_docs_category', array( 'fields' => 'ids' ) );
			$is_current         = in_array( $category->term_id, $current_categories, true );

			$output .= '<li class="' . esc_attr( $item_class ) . '">';

			if ( $has_children ) {
				$output .= '<button class="wc-docs-category-toggle" aria-expanded="false">';
				$output .= '<span class="wc-docs-category-icon"></span>';
				$output .= '</button>';
			}

			$link_class = 'wc-docs-category-link';
			if ( $is_current ) {
				$link_class .= ' current';
			}

			$output .= '<a href="' . esc_url( get_term_link( $category ) ) . '" class="' . esc_attr( $link_class ) . '">';
			$output .= esc_html( $category->name );
			$output .= '<span class="wc-docs-category-count">(' . intval( $category->count ) . ')</span>';
			$output .= '</a>';

			// Get posts in this category.
			$posts = get_posts(
				array(
					'post_type'      => 'wc_docs',
					'posts_per_page' => -1,
					'tax_query'      => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
						array(
							'taxonomy' => 'wc_docs_category',
							'field'    => 'term_id',
							'terms'    => $category->term_id,
						),
					),
					'orderby'        => 'menu_order',
					'order'          => 'ASC',
				)
			);

			if ( ! empty( $posts ) ) {
				$output .= '<ul class="wc-docs-post-list">';
				foreach ( $posts as $post ) {
					$post_class = 'wc-docs-post-item';
					if ( $post->ID === $current_post_id ) {
						$post_class .= ' current-post';
					}
					$output .= '<li class="' . esc_attr( $post_class ) . '">';
					$output .= '<a href="' . esc_url( get_permalink( $post->ID ) ) . '">' . esc_html( $post->post_title ) . '</a>';
					$output .= '</li>';
				}
				$output .= '</ul>';
			}

			// Render child categories.
			if ( $has_children ) {
				$output .= $this->render_category_tree( $children, $current_post_id, $level + 1 );
			}

			$output .= '</li>';
		}

		$output .= '</ul>';

		return $output;
	}

	/**
	 * Render table of contents
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_toc( $atts ) {
		$atts = shortcode_atts(
			array(
				'post_id' => get_the_ID(),
			),
			$atts
		);

		$post_id = intval( $atts['post_id'] );
		$post    = get_post( $post_id );

		if ( ! $post ) {
			return '';
		}

		ob_start();
		?>
		<div class="wc-docs-sidebar wc-docs-sidebar-right">
			<div class="wc-docs-sidebar-inner wc-docs-toc-wrapper">
				<h3 class="wc-docs-sidebar-title"><?php esc_html_e( 'On this page', 'woocommerce-docs-ja' ); ?></h3>
				<div id="wc-docs-toc" class="wc-docs-toc">
					<!-- TOC will be generated by JavaScript -->
				</div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render breadcrumb
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_breadcrumb( $atts ) {
		$atts = shortcode_atts(
			array(
				'post_id' => get_the_ID(),
			),
			$atts
		);

		$post_id = intval( $atts['post_id'] );

		$categories = wp_get_post_terms( $post_id, 'wc_docs_category' );

		if ( empty( $categories ) || is_wp_error( $categories ) ) {
			return '';
		}

		// Use the first category for breadcrumb.
		$category   = $categories[0];
		$breadcrumb = array();

		// Build breadcrumb trail.
		while ( $category ) {
			array_unshift(
				$breadcrumb,
				array(
					'name' => $category->name,
					'url'  => get_term_link( $category ),
				)
			);

			if ( $category->parent ) {
				$category = get_term( $category->parent, 'wc_docs_category' );
			} else {
				break;
			}
		}

		ob_start();
		?>
		<div class="wc-docs-breadcrumb">
			<a href="<?php echo esc_url( get_post_type_archive_link( 'wc_docs' ) ); ?>">
				<?php esc_html_e( 'Documentation', 'woocommerce-docs-ja' ); ?>
			</a>
			<?php foreach ( $breadcrumb as $crumb ) : ?>
				<span class="separator"> / </span>
				<a href="<?php echo esc_url( $crumb['url'] ); ?>">
					<?php echo esc_html( $crumb['name'] ); ?>
				</a>
			<?php endforeach; ?>
		</div>
		<?php
		return ob_get_clean();
	}
}

new WC_Docs_Blocks();
