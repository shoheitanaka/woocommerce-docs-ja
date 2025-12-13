<?php
/**
 * Template for wc_docs archive
 *
 * @package WooCommerce_Docs_JA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<div class="wc-docs-wrapper wc-docs-archive">
	<div class="wc-docs-container">
		
		<!-- Left Sidebar: Category Navigation -->
		<aside class="wc-docs-sidebar wc-docs-sidebar-left">
			<div class="wc-docs-sidebar-inner">
				<h3 class="wc-docs-sidebar-title"><?php esc_html_e( 'Documentation', 'woocommerce-docs-ja' ); ?></h3>
				<?php
				$categories = get_terms(
					array(
						'taxonomy'   => 'wc_docs_category',
						'hide_empty' => false,
						'parent'     => 0,
					)
				);

				if ( ! empty( $categories ) && ! is_wp_error( $categories ) ) {
					echo '<nav class="wc-docs-category-nav">';
					wc_docs_render_archive_category_tree( $categories );
					echo '</nav>';
				}
				?>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="wc-docs-main-content wc-docs-archive-content">
			
			<header class="wc-docs-archive-header">
				<?php if ( is_tax( 'wc_docs_category' ) ) : ?>
					<h1 class="wc-docs-archive-title"><?php single_term_title(); ?></h1>
					<?php
					$term_description = term_description();
					if ( $term_description ) :
						?>
						<div class="wc-docs-archive-description"><?php echo wp_kses_post( $term_description ); ?></div>
					<?php endif; ?>
				<?php else : ?>
					<h1 class="wc-docs-archive-title"><?php esc_html_e( 'Documentation', 'woocommerce-docs-ja' ); ?></h1>
				<?php endif; ?>
			</header>

			<?php if ( have_posts() ) : ?>
				<div class="wc-docs-grid">
					<?php
					while ( have_posts() ) :
						the_post();
						?>
						<article class="wc-docs-card">
							<h2 class="wc-docs-card-title">
								<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
							</h2>
							
							<?php if ( has_excerpt() ) : ?>
								<div class="wc-docs-card-excerpt">
									<?php the_excerpt(); ?>
								</div>
							<?php endif; ?>
							
							<?php
							$categories = get_the_terms( get_the_ID(), 'wc_docs_category' );
							if ( $categories && ! is_wp_error( $categories ) ) :
								?>
								<div class="wc-docs-card-categories">
									<?php
									foreach ( $categories as $category ) {
										printf(
											'<a href="%s" class="wc-docs-card-category">%s</a>',
											esc_url( get_term_link( $category ) ),
											esc_html( $category->name )
										);
									}
									?>
								</div>
							<?php endif; ?>
						</article>
					<?php endwhile; ?>
				</div>

				<?php
				the_posts_pagination(
					array(
						'mid_size'  => 2,
						'prev_text' => __( '&larr; Previous', 'woocommerce-docs-ja' ),
						'next_text' => __( 'Next &rarr;', 'woocommerce-docs-ja' ),
					)
				);
				?>
			<?php else : ?>
				<p class="wc-docs-no-results"><?php esc_html_e( 'No documentation found.', 'woocommerce-docs-ja' ); ?></p>
			<?php endif; ?>

		</main>

	</div>
</div>

<?php
get_footer();

/**
 * Render category tree for archive.
 *
 * @param array $categories Categories to render.
 * @param int   $level Depth level.
 */
function wc_docs_render_archive_category_tree( $categories, $level = 0 ) {
	if ( empty( $categories ) ) {
		return;
	}

	echo '<ul class="wc-docs-category-list wc-docs-category-level-' . esc_attr( $level ) . '">';

	foreach ( $categories as $category ) {
		$child_categories = get_terms(
			array(
				'taxonomy'   => 'wc_docs_category',
				'hide_empty' => false,
				'parent'     => $category->term_id,
			)
		);

		$has_children = ! empty( $child_categories ) && ! is_wp_error( $child_categories );
		$is_current   = is_tax( 'wc_docs_category', $category->term_id );

		$class_names = array( 'wc-docs-category-item' );
		if ( $has_children ) {
			$class_names[] = 'has-children';
		}
		if ( $is_current ) {
			$class_names[] = 'current-category';
		}

		echo '<li class="' . esc_attr( implode( ' ', $class_names ) ) . '">';

		if ( $has_children ) {
			echo '<button class="wc-docs-category-toggle" aria-expanded="' . ( $is_current ? 'true' : 'false' ) . '">';
			echo '<span class="wc-docs-category-icon"></span>';
			echo '</button>';
		}

		printf(
			'<a href="%s" class="wc-docs-category-link%s">%s <span class="wc-docs-category-count">(%d)</span></a>',
			esc_url( get_term_link( $category ) ),
			$is_current ? ' current' : '',
			esc_html( $category->name ),
			$category->count
		);

		if ( $has_children ) {
			wc_docs_render_archive_category_tree( $child_categories, $level + 1 );
		}

		echo '</li>';
	}

	echo '</ul>';
}
