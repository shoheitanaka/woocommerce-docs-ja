---
post_title: Integrating with coming soon mode
---
# カミングスーンモードとの統合

このガイドでは、サードパーティの開発者やホスティングプロバイダー向けに、WooCommerceのcoming soonモードとシステムを統合する方法を例示しています。詳細は[開発者ブログ記事](https://developer.woocommerce.com/2024/06/18/introducing-coming-soon-mode/)をお読みください。サイトの表示設定については、[管理者向けドキュメント](https://woocommerce.com/document/configuring-woocommerce-settings/coming-soon-mode/) を参照してください。

## はじめに

WooCommerceのカミングスーンモードでは、作業中に一時的にサイトを見えなくすることができます。このガイドでは、この機能をシステムに統合する方法、サイトの可視性設定が変更されたときにサーバーキャッシュをクリアする方法、coming soon modeを他のプラグインと同期させる方法を紹介します。

## 前提条件

-   PHPおよびWordPressの開発に精通していること。

## ステップバイステップ

### サイトの可視性設定変更時にサーバーのキャッシュをクリアする

サイトの可視性設定が変更された場合、変更を適用して顧客向けページを再キャッシュするために、サーバーキャッシュをクリアする必要があるかもしれません。そのためには、[`update_option`](https://developer.wordpress.org/reference/hooks/update_option/) フックを使用します。

```php
add_action( 'update_option_woocommerce_coming_soon', 'clear_server_cache', 10, 3 );
add_action( 'update_option_woocommerce_store_pages_only', 'clear_server_cache', 10, 3 );

function clear_server_cache( $old_value, $new_value, $option ) {
    // Implement your logic to clear the server cache.
    if ( function_exists( 'your_cache_clear_function' ) ) {
        your_cache_clear_function();
    }
}
```

### テンプレートの変更時にサーバーのキャッシュをクリアする

デフォルトでは、Coming-soonページには`Cache-Control: max-age=60`ヘッダーが設定されています。この設定により、CDNやその他のキャッシュ・メカニズムが60秒間ページをキャッシュし、効率的なパフォーマンスと妥当な更新時間の必要性のバランスをとることができます。

ユーザがcoming soonテンプレートを変更した場合、クライアント側のキャッシュが期限切れになったときに変更が即座に反映されるように、キャッシュをすべてパージすることをお勧めします。

`save_post_wp_template`、`save_post_wp_template_part`、`save_post_wp_global_styles`フックを使用して、テンプレートが更新されたことを検知し、キャッシュパージをトリガーすることができます。

```php
add_action( 'save_post_wp_template', 'purge_cache_on_template_change', 10, 3 );
add_action( 'save_post_wp_template_part', 'purge_cache_on_template_change', 10, 3 );
add_action( 'save_post_wp_global_styles', 'purge_cache_on_template_change', 10, 3 );

function purge_cache_on_template_change( $post_id, $post, $update ) {
    // Check if the template is associated with the coming soon mode.
    if ( 'coming-soon' === $post->post_name ) {
        // Implement your logic to clear the server cache.
        if ( function_exists( 'your_cache_clear_function' ) ) {
            your_cache_clear_function();
        }
    }
}
```

### 他のプラグインとの同期モードがまもなく登場

近日公開モードは、プラグインやアプリケーションからプログラムで同期させることができます。以下は使用例です：

-   メンテナンスモード・プラグインとの統合
-   ホスティングプロバイダーのcoming soonモードとの統合。

#### WooCommerceからのトリガー

coming soon modeオプションが更新されたときにプラグインのステータスを設定するようなコードを実行するには、次の例を使用できます：

```php
add_action( 'update_option_woocommerce_coming_soon', 'sync_coming_soon_to_other_plugins', 10, 3 );

function sync_coming_soon_to_other_plugins( $old_value, $new_value, $option ) {
    $is_enabled = $new_value === 'yes';

    // Implement your logic to sync coming soon status.
    if ( function_exists( 'your_plugin_set_coming_soon' ) ) {
        your_plugin_set_coming_soon( $is_enabled );
    }
}
```

#### 他のプラグインからのトリガー

次の例を使用して、`woocommerce_coming_soon`オプションを直接更新することで、他のプラグインからWooCommerce coming soonモードを有効または無効にすることができます：

```php
function sync_coming_soon_from_other_plugins( $is_enabled ) {
    // Check user capability.
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'You do not have sufficient permissions to access this page.' );
    }

    // Set coming soon mode.
    if ( isset( $is_enabled ) ) {
        update_option( 'woocommerce_coming_soon', $is_enabled ? 'yes' : 'no' );
    }
}
```

#### プラグインとの2ウェイ同期

双方向同期が必要な場合は、`update_option`が`sync_coming_soon_from_other_plugins`を再帰的に呼び出さない以下の例を使用する：

```php
add_action( 'update_option_woocommerce_coming_soon', 'sync_coming_soon_to_other_plugins', 10, 3 );

function sync_coming_soon_to_other_plugins( $old_value, $new_value, $option ) {
    $is_enabled = $new_value === 'yes';

    // Implement your logic to sync coming soon status.
    if ( function_exists( 'your_plugin_set_coming_soon' ) ) {
        your_plugin_set_coming_soon( $is_enabled );
    }
}

function sync_coming_soon_from_other_plugins( $is_enabled ) {
    // Check user capability.
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'You do not have sufficient permissions to access this page.' );
    }

    if ( isset( $is_enabled ) ) {
        // Temporarily remove the action to prevent a recursive call.
        remove_action( 'update_option_woocommerce_coming_soon', 'sync_coming_soon_to_other_plugins', 10, 3 );

        // Set coming soon mode.
        update_option( 'woocommerce_coming_soon', $is_enabled ? 'yes' : 'no' );

        // Re-add the action.
        add_action( 'update_option_woocommerce_coming_soon', 'sync_coming_soon_to_other_plugins', 10, 3 );
    }
}
```

#### オプションのオーバーライドによる一方向バインディング

`woocommerce_coming_soon`オプションをオーバーライドすることで、他のプラグインからcoming soonオプションをプログラムでバインドすることもできる。これは、状態管理を単純化し、同期しない可能性のある問題を防げるので有利です。

次の例では、`woocommerce_coming_soon`オプションをオーバーライドして、別のプラグインからcoming soonオプションをバインドしています。

```php
add_filter( 'pre_option_woocommerce_coming_soon', 'override_option_woocommerce_coming_soon' );

function override_option_woocommerce_coming_soon( $current_value ) {
    // Implement your logic to sync coming soon status.
    if ( function_exists( 'your_plugin_is_coming_soon' ) ) {
        return your_plugin_is_coming_soon() ? 'yes' : 'no';
    }
    return $current_value;
}

add_filter( 'pre_update_option_woocommerce_coming_soon', 'override_update_woocommerce_coming_soon', 10, 2 );

function override_update_woocommerce_coming_soon( $new_value, $old_value ) {
    // Check user capability.
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'You do not have sufficient permissions to access this page.' );
    }

    // Implement your logic to sync coming soon status.
    if ( function_exists( 'your_plugin_set_coming_soon' ) ) {
        your_plugin_set_coming_soon( $new_value === 'yes' );
    }
}
```

### カスタム除外フィルター

開発者は、近日公開の保護をバイパスするカスタム除外を追加することが可能です。これは、特定のIPアドレスの画面を常に回避したり、特定のランディングページを利用可能にするような除外に便利です。

#### すべてのページで近日公開を無効にする

WooCommerceのcoming soonモードと似たような動作をする他の機能がある場合、意図しないコンフリクトを引き起こす可能性があります。すべての顧客向けページを除外することで、カミングスーンモードを無効にすることができます。以下はその例です：

```php
add_filter( 'woocommerce_coming_soon_exclude', function() {
    return true;
}, 10 );
```

#### 特定のページ以外は近日公開を無効にする

ページのIDに基づいて特定のページを除外するには、次の例を使用してください。`<page-id>`をページ識別子で置き換えてください：

```php
add_filter( 'woocommerce_coming_soon_exclude', function( $is_excluded ) {
    if ( get_the_ID() === <page-id> ) {
        return true;
    }
    return $is_excluded;
}, 10 );
```

#### カスタム共有リンク

次の例は、カスタム共有コードと統合する方法を示しています。クッキーやその他のストレージを使用して、ユーザーがサイト内を移動する際のアクセスを永続化することをお勧めします：

```php
add_filter( 'woocommerce_coming_soon_exclude', function( $exclude ) {
    // Implement your logic to get and validate share code.
    if ( function_exists( 'your_plugin_get_share_code' ) && function_exists( 'your_plugin_is_valid_share_code' ) ) {
        $share_code = your_plugin_get_share_code();
        if ( your_plugin_is_valid_share_code( $share_code ) ) {
            return true;
        }
    }

    return $exclude;
} );
```

### 店舗ページのみに適用」設定の拡張

`Apply to store pages only`設定を使用する場合、coming soonモードで制限されるストアページのリストにカスタムページを追加したい場合があります。以下の例でカスタムページを追加できます：

```php
add_filter( 'woocommerce_store_pages', function( $pages ) {
    $page = get_page_by_path( 'your-page-slug' );
    if ( $page ) {
        $pages[] = $page->ID;
    }
    return $pages;
} );
```
