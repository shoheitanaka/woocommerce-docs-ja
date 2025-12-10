<?php
/**
 * API Handler Class
 *
 * Provides REST API endpoints for WooCommerce Docs Japanese.
 *
 * @package WooCommerce_Docs_JA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC_Docs_JA_API_Handler class.
 *
 * @since 1.0.0
 */
class WC_Docs_JA_API_Handler {

	/**
	 * API namespace.
	 */
	const NAMESPACE = 'wc-docs-ja/v1';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API routes.
	 */
	public function register_routes() {

		// Get document list.
		register_rest_route(
			self::NAMESPACE,
			'/docs',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_docs' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'version'  => array(
						'default'           => 'latest',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'category' => array(
						'default'           => '',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'per_page' => array(
						'default'           => 10,
						'sanitize_callback' => 'absint',
					),
					'page'     => array(
						'default'           => 1,
						'sanitize_callback' => 'absint',
					),
				),
			)
		);

		// Get single document.
		register_rest_route(
			self::NAMESPACE,
			'/docs/(?P<id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_doc' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'id' => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
				),
			)
		);

		// Get document by slug.
		register_rest_route(
			self::NAMESPACE,
			'/docs/slug/(?P<slug>[a-z0-9-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_doc_by_slug' ),
				'permission_callback' => '__return_true',
			)
		);

		// Search documents.
		register_rest_route(
			self::NAMESPACE,
			'/docs/search',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'search_docs' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					's'        => array(
						'required'          => true,
						'sanitize_callback' => 'sanitize_text_field',
					),
					'per_page' => array(
						'default'           => 10,
						'sanitize_callback' => 'absint',
					),
				),
			)
		);

		// Get version list.
		register_rest_route(
			self::NAMESPACE,
			'/versions',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_versions' ),
				'permission_callback' => '__return_true',
			)
		);

		// Create document (authentication required).
		register_rest_route(
			self::NAMESPACE,
			'/docs',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_doc' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'title'   => array(
						'required'          => true,
						'sanitize_callback' => 'sanitize_text_field',
					),
					'content' => array(
						'required'          => true,
						'sanitize_callback' => 'wp_kses_post',
					),
					'slug'    => array(
						'sanitize_callback' => 'sanitize_title',
					),
					'version' => array(
						'default'           => 'latest',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'status'  => array(
						'default'           => 'publish',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Update document (authentication required).
		register_rest_route(
			self::NAMESPACE,
			'/docs/(?P<id>\d+)',
			array(
				'methods'             => 'PUT',
				'callback'            => array( $this, 'update_doc' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'id'      => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
					'title'   => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
					'content' => array(
						'sanitize_callback' => 'wp_kses_post',
					),
					'version' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Delete document (authentication required).
		register_rest_route(
			self::NAMESPACE,
			'/docs/(?P<id>\d+)',
			array(
				'methods'             => 'DELETE',
				'callback'            => array( $this, 'delete_doc' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'id' => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
				),
			)
		);

		// Get statistics.
		register_rest_route(
			self::NAMESPACE,
			'/stats',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_stats' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Get document list.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function get_docs( $request ) {
		$params = $request->get_params();

		$args = array(
			'post_type'      => array( 'page', 'wc_docs' ),
			'posts_per_page' => $params['per_page'],
			'paged'          => $params['page'],
			'orderby'        => 'title',
			'order'          => 'ASC',
			'meta_query'     => array(),
		);

		// Version filter.
		if ( ! empty( $params['version'] ) && 'latest' !== $params['version'] ) {
			$args['meta_query'][] = array(
				'key'     => '_wc_docs_version',
				'value'   => $params['version'],
				'compare' => '=',
			);
		}

		// Category filter.
		if ( ! empty( $params['category'] ) ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'category',
					'field'    => 'slug',
					'terms'    => $params['category'],
				),
			);
		}

		$query = new WP_Query( $args );
		$docs  = array();

		foreach ( $query->posts as $post ) {
			$docs[] = $this->format_doc_response( $post );
		}

		return new WP_REST_Response(
			array(
				'docs'  => $docs,
				'total' => $query->found_posts,
				'pages' => $query->max_num_pages,
			),
			200
		);
	}

	/**
	 * Get single document.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function get_doc( $request ) {
		$post = get_post( $request['id'] );

		if ( ! $post || ! in_array( $post->post_type, array( 'page', 'wc_docs' ) ) ) {
			return new WP_Error( 'not_found', __( 'Document not found', 'woocommerce-docs-ja' ), array( 'status' => 404 ) );
		}

		return new WP_REST_Response( $this->format_doc_response( $post ), 200 );
	}

	/**
	 * Get document by slug.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function get_doc_by_slug( $request ) {
		$post = get_page_by_path( $request['slug'], OBJECT, array( 'page', 'wc_docs' ) );

		if ( ! $post ) {
			return new WP_Error( 'not_found', __( 'Document not found', 'woocommerce-docs-ja' ), array( 'status' => 404 ) );
		}

		return new WP_REST_Response( $this->format_doc_response( $post ), 200 );
	}

	/**
	 * Search documents.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function search_docs( $request ) {
		$params = $request->get_params();

		$args = array(
			'post_type'      => array( 'page', 'wc_docs' ),
			's'              => $params['s'],
			'posts_per_page' => $params['per_page'],
		);

		$query = new WP_Query( $args );
		$docs  = array();

		foreach ( $query->posts as $post ) {
			$docs[] = $this->format_doc_response( $post );
		}

		return new WP_REST_Response(
			array(
				'results' => $docs,
				'total'   => $query->found_posts,
			),
			200
		);
	}

	/**
	 * Get version list.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function get_versions( $request ) {
		if ( ! class_exists( 'WC_Docs_JA_Version_Manager' ) ) {
			return new WP_REST_Response( array( 'versions' => array() ), 200 );
		}

		$versions = WC_Docs_JA_Version_Manager::get_available_versions();

		return new WP_REST_Response(
			array(
				'versions' => $versions,
				'current'  => WC_Docs_JA_Version_Manager::get_current_version(),
			),
			200
		);
	}

	/**
	 * Create document.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function create_doc( $request ) {
		$params = $request->get_params();

		$post_data = array(
			'post_title'   => $params['title'],
			'post_content' => $params['content'],
			'post_status'  => $params['status'],
			'post_type'    => 'page',
		);

		if ( ! empty( $params['slug'] ) ) {
			$post_data['post_name'] = $params['slug'];
		}

		$post_id = wp_insert_post( $post_data );

		if ( is_wp_error( $post_id ) ) {
			return new WP_Error( 'create_failed', $post_id->get_error_message(), array( 'status' => 500 ) );
		}

		// Version meta.
		if ( ! empty( $params['version'] ) ) {
			update_post_meta( $post_id, '_wc_docs_version', $params['version'] );
		}

		// Timestamp.
		update_post_meta( $post_id, 'last_updated', current_time( 'mysql' ) );
		$post = get_post( $post_id );

		return new WP_REST_Response( $this->format_doc_response( $post ), 201 );
	}

	/**
	 * Update document.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function update_doc( $request ) {
		$post = get_post( $request['id'] );

		if ( ! $post ) {
			return new WP_Error( 'not_found', __( 'Document not found', 'woocommerce-docs-ja' ), array( 'status' => 404 ) );
		}

		$params    = $request->get_params();
		$post_data = array( 'ID' => $request['id'] );

		if ( isset( $params['title'] ) ) {
			$post_data['post_title'] = $params['title'];
		}

		if ( isset( $params['content'] ) ) {
			$post_data['post_content'] = $params['content'];
		}

		$result = wp_update_post( $post_data );

		if ( is_wp_error( $result ) ) {
			return new WP_Error( 'update_failed', $result->get_error_message(), array( 'status' => 500 ) );
		}

		// Update version meta.
		if ( isset( $params['version'] ) ) {
			update_post_meta( $request['id'], '_wc_docs_version', $params['version'] );
		}

		// Update timestamp.
		update_post_meta( $request['id'], 'last_updated', current_time( 'mysql' ) );
		$updated_post = get_post( $request['id'] );

		return new WP_REST_Response( $this->format_doc_response( $updated_post ), 200 );
	}

	/**
	 * Delete document.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object or error.
	 */
	public function delete_doc( $request ) {
		$post = get_post( $request['id'] );

		if ( ! $post ) {
			return new WP_Error( 'not_found', __( 'Document not found', 'woocommerce-docs-ja' ), array( 'status' => 404 ) );
		}

		$result = wp_delete_post( $request['id'], true );

		if ( ! $result ) {
			return new WP_Error( 'delete_failed', __( 'Failed to delete document', 'woocommerce-docs-ja' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response(
			array(
				'deleted' => true,
				'id'      => $request['id'],
			),
			200
		);
	}

	/**
	 * Get statistics.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function get_stats( $request ) {
		$stats = array(
			'total_docs'     => wp_count_posts( 'page' )->publish + wp_count_posts( 'wc_docs' )->publish,
			'total_versions' => 0,
			'last_updated'   => '',
		);

		// Quantity of versions.
		if ( class_exists( 'WC_Docs_JA_Version_Manager' ) ) {
			$versions                = WC_Docs_JA_Version_Manager::get_available_versions();
			$stats['total_versions'] = count( $versions );
		}

		// Last updated document.
		$latest = get_posts(
			array(
				'post_type'      => array( 'page', 'wc_docs' ),
				'posts_per_page' => 1,
				'orderby'        => 'modified',
				'order'          => 'DESC',
			)
		);

		if ( ! empty( $latest ) ) {
			$stats['last_updated'] = $latest[0]->post_modified;
		}

		return new WP_REST_Response( $stats, 200 );
	}

	/**
	 * Check permission.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return bool True if user has permission.
	 */
	public function check_permission( $request ) {
		return current_user_can( 'edit_pages' );
	}

	/**
	 * Format response.
	 *
	 * @param WP_Post $post Post object.
	 * @return array Formatted response data.
	 */
	private function format_doc_response( $post ) {
		$version = get_post_meta( $post->ID, '_wc_docs_version', true );
		$updated = get_post_meta( $post->ID, 'last_updated', true );

		return array(
			'id'           => $post->ID,
			'title'        => $post->post_title,
			'slug'         => $post->post_name,
			'content'      => apply_filters( 'the_content', $post->post_content ),
			'excerpt'      => get_the_excerpt( $post ),
			'version'      => $version ? $version : 'latest',
			'status'       => $post->post_status,
			'url'          => get_permalink( $post->ID ),
			'modified'     => $post->post_modified,
			'last_updated' => $updated ? $updated : $post->post_modified,
		);
	}
}

// Initialize the API handler.
new WC_Docs_JA_API_Handler();
