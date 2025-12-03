<?php
/**
 * Version Manager Class
 *
 * Handles version management for WooCommerce documentation.
 *
 * @package WooCommerce_Docs_JA
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * WC_Docs_JA_Version_Manager class.
 *
 * @since 1.0.0
 */
class WC_Docs_JA_Version_Manager {

	/**
	 * Get available versions.
	 *
	 * Retrieves all available documentation versions from taxonomy and post meta.
	 *
	 * @since 1.0.0
	 * @return array Array of version information.
	 */
	public static function get_available_versions() {
		$versions = array();

		// Get versions from taxonomy.
		$terms = get_terms(
			array(
				'taxonomy'   => 'docs_version',
				'hide_empty' => false,
			)
		);

		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$versions[] = array(
					'slug'  => $term->slug,
					'name'  => $term->name,
					'count' => $term->count,
				);
			}
		}       // Add versions from post meta.
		global $wpdb;
		$meta_versions = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT DISTINCT meta_value FROM {$wpdb->postmeta} WHERE meta_key = %s",
				'_wc_docs_version'
			)
		);

		foreach ( $meta_versions as $version ) {
			if ( ! in_array( $version, array_column( $versions, 'slug' ), true ) ) {
				$versions[] = array(
					'slug'  => $version,
					'name'  => $version,
					'count' => 0,
				);
			}
		}

		return $versions;
	}   /**
		 * Get current version.
		 *
		 * @since 1.0.0
		 * @return string Current version slug.
		 */
	public static function get_current_version() {
		return get_option( 'wc_docs_ja_current_version', 'latest' );
	}

	/**
	 * Set current version.
	 *
	 * @since 1.0.0
	 * @param string $version Version slug to set as current.
	 * @return bool True if option value has changed, false otherwise.
	 */
	public static function set_current_version( $version ) {
		return update_option( 'wc_docs_ja_current_version', sanitize_text_field( $version ) );
	}   /**
		 * Get documents by version.
		 *
		 * Retrieves all documentation posts for a specific version.
		 *
		 * @since 1.0.0
		 * @param string $version Version slug to retrieve documents for. Default 'latest'.
		 * @return WP_Post[] Array of post objects.
		 */
	public static function get_docs_by_version( $version = 'latest' ) {
		$args = array(
			'post_type'      => array( 'page', 'wc_docs' ),
			'posts_per_page' => -1,
			'meta_query'     => array(
				array(
					'key'     => '_wc_docs_version',
					'value'   => sanitize_text_field( $version ),
					'compare' => '=',
				),
			),
		);

		return get_posts( $args );
	}   /**
		 * Set page version.
		 *
		 * @since 1.0.0
		 * @param int    $post_id Post ID.
		 * @param string $version Version slug.
		 * @return int|bool Meta ID if the key didn't exist, true on successful update, false on failure.
		 */
	public static function set_page_version( $post_id, $version ) {
		return update_post_meta( absint( $post_id ), '_wc_docs_version', sanitize_text_field( $version ) );
	}

	/**
	 * Get page version.
	 *
	 * @since 1.0.0
	 * @param int $post_id Post ID.
	 * @return string Version slug.
	 */
	public static function get_page_version( $post_id ) {
		return get_post_meta( absint( $post_id ), '_wc_docs_version', true );
	}   /**
		 * Render version switcher widget.
		 *
		 * Outputs HTML for version switcher dropdown.
		 *
		 * @since 1.0.0
		 * @return string HTML output.
		 */
	public static function render_version_switcher() {
		$versions = self::get_available_versions();
		$current  = self::get_current_version();

		if ( empty( $versions ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="wc-docs-version-switcher">
			<label for="wc-docs-version-select">
				<?php esc_html_e( 'Version:', 'woocommerce-docs-ja' ); ?>
			</label>
			<select id="wc-docs-version-select" class="wc-docs-version-select">
				<?php foreach ( $versions as $version ) : ?>
					<option value="<?php echo esc_attr( $version['slug'] ); ?>" 
							<?php selected( $current, $version['slug'] ); ?>>
						<?php echo esc_html( $version['name'] ); ?>
						<?php if ( $version['count'] > 0 ) : ?>
							(<?php echo absint( $version['count'] ); ?>)
						<?php endif; ?>
					</option>
				<?php endforeach; ?>
			</select>
		</div>
		<?php
		return ob_get_clean();
	}   /**
		 * Compare versions.
		 *
		 * @since 1.0.0
		 * @param string $version1 First version string.
		 * @param string $version2 Second version string.
		 * @return int Returns -1 if first version is lower than second, 0 if equal, 1 if higher.
		 */
	public static function compare_versions( $version1, $version2 ) {
		return version_compare( $version1, $version2 );
	}

	/**
	 * Get latest version.
	 *
	 * Retrieves the latest version from available versions.
	 *
	 * @since 1.0.0
	 * @return string Latest version slug.
	 */
	public static function get_latest_version() {
		$versions = self::get_available_versions();

		if ( empty( $versions ) ) {
			return 'latest';
		}

		// Sort versions by version number.
		usort(
			$versions,
			function ( $a, $b ) {
				return version_compare( $b['slug'], $a['slug'] );
			}
		);

		return $versions[0]['slug'];
	}
}