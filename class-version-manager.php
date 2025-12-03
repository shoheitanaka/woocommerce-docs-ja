<?php
/**
 * バージョン管理クラス
 */

if (!defined('ABSPATH')) {
    exit;
}

class WC_Docs_JA_Version_Manager {
    
    /**
     * 利用可能なバージョンを取得
     */
    public static function get_available_versions() {
        $versions = array();
        
        // タクソノミーから取得
        $terms = get_terms(array(
            'taxonomy' => 'docs_version',
            'hide_empty' => false
        ));
        
        if (!is_wp_error($terms)) {
            foreach ($terms as $term) {
                $versions[] = array(
                    'slug' => $term->slug,
                    'name' => $term->name,
                    'count' => $term->count
                );
            }
        }
        
        // メタデータから追加
        global $wpdb;
        $meta_versions = $wpdb->get_col(
            "SELECT DISTINCT meta_value 
             FROM {$wpdb->postmeta} 
             WHERE meta_key = '_wc_docs_version'"
        );
        
        foreach ($meta_versions as $version) {
            if (!in_array($version, array_column($versions, 'slug'))) {
                $versions[] = array(
                    'slug' => $version,
                    'name' => $version,
                    'count' => 0
                );
            }
        }
        
        return $versions;
    }
    
    /**
     * 現在のバージョンを取得
     */
    public static function get_current_version() {
        return get_option('wc_docs_ja_current_version', 'latest');
    }
    
    /**
     * 現在のバージョンを設定
     */
    public static function set_current_version($version) {
        return update_option('wc_docs_ja_current_version', $version);
    }
    
    /**
     * 特定バージョンのドキュメントを取得
     */
    public static function get_docs_by_version($version = 'latest') {
        $args = array(
            'post_type' => array('page', 'wc_docs'),
            'posts_per_page' => -1,
            'meta_query' => array(
                array(
                    'key' => '_wc_docs_version',
                    'value' => $version,
                    'compare' => '='
                )
            )
        );
        
        return get_posts($args);
    }
    
    /**
     * ページにバージョンを設定
     */
    public static function set_page_version($post_id, $version) {
        return update_post_meta($post_id, '_wc_docs_version', $version);
    }
    
    /**
     * ページのバージョンを取得
     */
    public static function get_page_version($post_id) {
        return get_post_meta($post_id, '_wc_docs_version', true);
    }
    
    /**
     * バージョン切り替えウィジェットのHTML
     */
    public static function render_version_switcher() {
        $versions = self::get_available_versions();
        $current = self::get_current_version();
        
        if (empty($versions)) {
            return '';
        }
        
        ob_start();
        ?>
        <div class="wc-docs-version-switcher">
            <label for="wc-docs-version-select">
                <?php _e('Version:', 'woocommerce-docs-ja'); ?>
            </label>
            <select id="wc-docs-version-select" class="wc-docs-version-select">
                <?php foreach ($versions as $version): ?>
                    <option value="<?php echo esc_attr($version['slug']); ?>" 
                            <?php selected($current, $version['slug']); ?>>
                        <?php echo esc_html($version['name']); ?>
                        <?php if ($version['count'] > 0): ?>
                            (<?php echo $version['count']; ?>)
                        <?php endif; ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * バージョン比較
     */
    public static function compare_versions($version1, $version2) {
        return version_compare($version1, $version2);
    }
    
    /**
     * 最新バージョンを取得
     */
    public static function get_latest_version() {
        $versions = self::get_available_versions();
        
        if (empty($versions)) {
            return 'latest';
        }
        
        // バージョン番号でソート
        usort($versions, function($a, $b) {
            return version_compare($b['slug'], $a['slug']);
        });
        
        return $versions[0]['slug'];
    }
}
