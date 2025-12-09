---
post_title: HPOS extension recipe book
---

# HPOS extension recipe book

## What is High-Performance Order Storage (HPOS)?

つい最近まで、WooCommerceは注文関連のデータをWordPressのカスタム投稿タイプとしてデータベースの投稿テーブルとpostmetaテーブルに保存しており、エコシステムで働く誰もがWordPressのコアが提供する広範なAPIを活用して注文をカスタム投稿タイプとして管理することができました。

However, in early 2022, [we announced the plans to migrate to dedicated tables for orders](https://developer.woocommerce.com/2022/01/17/the-plan-for-the-woocommerce-custom-order-table/). Orders in their own tables will allow the shops to scale more easily, make the data storage simpler and increase reliability. For further details, please check out our [deep dive on the database structure on our dev blog](https://developer.woocommerce.com/2022/09/15/high-performance-order-storage-database-schema/).

一般的に、WooCommerceは旧バージョンとの完全な後方互換性を保とうとしてきましたが、このプロジェクトの結果、エクステンション開発者はHPOSを利用するためにプラグインにいくつかの変更を加える必要があります。これは根本的なデータ構造が変更されたためです。

More specifically, instead of using WordPress-provided APIs to access order data, developers will need to use WooCommerce-specific APIs. We [introduced these APIs in WooCommerce version 3.0](https://developer.woocommerce.com/2017/04/04/say-hello-to-woocommerce-3-0-bionic-butterfly/) to make the transition to HPOS easier.

このガイドでは、拡張機能やカスタムコードの断片をHPOSと互換性を持たせるために必要な変更に焦点を当てます。

For details on how to take enable or disable HPOS, as well as details on how orders are synced between datastores please refer to the [HPOS documentation](https://woocommerce.com/document/high-performance-order-storage/).

## Backward compatibility

To make the transition easier for shops and developers alike, we have tried to be as backward compatible as possible. One of the major compatibility issues with this project is that since the underlying data structure was `wp_posts` and `wp_postmeta` tables, circumventing the WC-specific CRUD classes and accessing the data directly using WordPress APIs worked fine.

この変更により、WordPressのテーブルから直接注文を読み込むと、古い注文を読み込むことになり、テーブルに直接書き込むと、読み込まれない注文を更新することになります。これはかなり重大な問題であるため、暫定的にいくつかの緩和策を追加しました。

### Switching data source

さらに、新しいテーブルで問題が発生した場合、HPOSの使用から手動でテーブルの投稿に切り替えることができます。元に戻すには、WC &gt; 設定 &gt; 詳細 &gt; 機能の「注文データの保存」設定を変更してください。

## Supporting High-Performance Order Storage in your extension

後方互換性ポリシーは、加盟店にとってはプロジェクトの利用を容易にするが、拡張機能開発者にとっては、しばらくの間、PostsとHPOSの両方をサポートしなければならないことを意味する。

これを支援するために、拡張機能開発者が従うべきガイドラインをいくつか用意しました。

**Note:** We recommend you use the development version of WooCommerce while working on your extension, in order to get all of the latest HPOS fixes and APIs. Refer to our [development guide](https://github.com/woocommerce/woocommerce/blob/trunk/DEVELOPMENT.md) to understand how the WooCommerce repo is structured and how to build the plugin from source.

### Detecting whether HPOS tables are being used in the store

WooCommerce CRUD API は投稿とカスタムテーブルの両方をサポートしますが、場合によっては（より良いパフォーマンスのためにSQLクエリを書くときなど）ストアがHPOSテーブルを使用しているかどうかを知りたいことがあります。この場合は、以下のパターンを使用します：

```php
use Automattic\WooCommerce\Utilities\OrderUtil;

if ( OrderUtil::custom_orders_table_usage_is_enabled() ) {
	// HPOS usage is enabled.
} else {
	// Traditional CPT-based orders are in use.
}
```

### Auditing the code base for direct DB access usage

HPOSテーブルをサポートするために、まず始めに、DBへの直接アクセスやWordPressのAPIを使用していないか監査するのがよいでしょう。この監査を行うには、以下の正規表現を使用して検索することができます：

```regexp
wpdb|get_post|get_post_field|get_post_status|get_post_type|get_post_type_object|get_posts|metadata_exists|get_post_meta|get_metadata|get_metadata_raw|get_metadata_default|get_metadata_by_mid|wp_insert_post|add_metadata|add_post_meta|wp_update_post|update_post_meta|update_metadata|update_metadata_by_mid|delete_metadata|delete_post_meta|delete_metadata_by_mid|delete_post_meta_by_key|wp_delete_post|wp_trash_post|wp_untrash_post|wp_transition_post_status|clean_post_cache|update_post_caches|update_postmeta_cache|post_exists|wp_count_post|shop_order
```

偽陽性がたくさん見つかるだろうが、この正規表現はかなり徹底しているので、ほとんどの真陽性を捕らえることができるはずであることに注意してほしい。

ソースコードから上記の正規表現を検索する：

1.一致した項目を一つずつ調べ、その項目が注文に関連しているかどうかをチェックします。ほとんどのマッチはおそらく誤検出、つまり注文に関連していないでしょう。
2.もしマッチした中に注文データに直接アクセスしたり変更したりするものがあれば、代わりにWooCommerceのCRUD APIを使用するように変更する必要があります。

### APIs for getting/setting posts and postmeta

Any code getting posts directly can be converted to a `wc_get_order` call instead:

```php
// Instead of
$post = get_post( $post_id ); // returns WP_Post object.
// use
$order = wc_get_order( $post_id ); // returns WC_Order object.
```

For interacting with metadata, use the `update_`/`add_`/`delete_metadata` methods on the order object, followed by a `save` call. WooCommerce will take care of figuring out which tables are active, and saving data in appropriate locations.

```php
// Instead of following update/add/delete methods, use:
update_post_meta( $post_id, $meta_key_1, $meta_value_1 );
add_post_meta( $post_id, $meta_key_2, $meta_value_2 );
delete_post_meta( $post_id, $meta_key_3, $meta_value_3 );

// use
$order = wc_get_order( $post_id );
$order->update_meta_data( $meta_key_1, $meta_value_1 );
$order->add_meta_data( $meta_key_2, $meta_value_2 );
$order->delete_meta_data( $meta_key_3, $meta_value_3 );
$order->save();
```

**Note:** Calling the `save()` method is a relatively expensive operation, so you may wish to avoid calling it more times than necessary (for example, if you know it will be called later in the same flow, you may wish to avoid additional earlier calls when operating on the same object).

When getting exact type of an order, or checking if given ID is an order, you can use methods from `OrderUtil` class.

```php
// Pattern to check when an ID is an order
'shop_order' === get_post_type( $post_id ); // or
in_array( get_post_type( $post_type ), wc_get_order_types() );

// replace with:
use Automattic\WooCommerce\Utilities\OrderUtil;
'shop_order' === OrderUtil::get_order_type( $post_id ); // or
OrderUtil::is_order( $post_id, wc_get_order_types() );
```

### Audit for order administration screen functions

WCはWordPressが提供する投稿一覧画面と投稿編集画面を使用できないため、注文管理用の新しい画面も追加しました。これらの画面は、現在WooCommerceの管理画面に表示されているものと非常によく似ています（HPOSテーブルを使用しているという事実を除いて）。この監査を実行するには、以下の正規表現を使用できます：

```regexp
post_updated_messages|do_meta_boxes|enter_title_here|edit_form_before_permalink|edit_form_after_title|edit_form_after_editor|submitpage_box|submitpost_box|edit_form_advanced|dbx_post_sidebar|manage_shop_order_posts_columns|manage_shop_order_posts_custom_column
```

ここでも多くの誤検出が見られるでしょう。しかし、もしこれらのメソッドが注文画面で呼び出されるような使い方に遭遇したら、HPOSにアップグレードするために、以下の変更を行う必要がある：

Instead of a `$post` object of the `WP_Post` class, you will need to use an `$order` object of the `WC_Order` class. If it's a filter or an action, then we will implement a similar filter in the new WooCommerce screen as well and instead of passing the post object, it will accept a WC_Order object instead.

以下のスニペットは、レガシー・オーダーが有効な場合はレガシー・オーダー・エディター画面にメタ・ボックスを追加し、そうでない場合はHPOSを搭載した新しいエディター画面にメタ・ボックスを追加する方法を示しています：

```php
use Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController;

add_action( 'add_meta_boxes', 'add_xyz_metabox' );

function add_xyz_metabox() {
	$screen = class_exists( '\Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController' ) && wc_get_container()->get( CustomOrdersTableController::class )->custom_orders_table_usage_is_enabled()
		? wc_get_page_screen_id( 'shop-order' )
		: 'shop_order';

	add_meta_box(
		'xyz',
		'Custom Meta Box',
		'render_xyz_metabox',
		$screen,
		'side',
		'high'
	);
}
```

上記により、メタボックスに渡されるパラメータもorderに変更される。そのため、メタボックスでは、渡される可能性のある投稿オブジェクトと注文オブジェクトの両方を考慮する必要があります。渡されたパラメータではなく、注文オブジェクトを取得し、それを完全に扱うことをお勧めします。

```php
function render_xyz_metabox( $post_or_order_object ) {
    $order = ( $post_or_order_object instanceof WP_Post ) ? wc_get_order( $post_or_order_object->ID ) : $post_or_order_object;

    // ... rest of the code. $post_or_order_object should not be used directly below this point.
}
```

### Declaring extension (in)compatibility

拡張機能のコードを調べたら、それがHPOSと互換性があるかどうかを宣言することができます。これを簡単に行うためのAPIを用意しました。拡張機能の互換性を宣言するには**、以下のコードを**メイン・プラグイン・ファイル**に記述してください：

```php
add_action( 'before_woocommerce_init', function() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
} );
```

もしあなたのコードがHPOSをサポートしていないことが分かっている場合は、以下の方法で**非互換性**を宣言してください。以下のコードを **メイン・プラグイン・ファイル** に記述してください：

```php
add_action( 'before_woocommerce_init', function() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, false );
	}
} );
```

If you prefer to include the compatibility declaration outside of your main plugin file, please pass 'my-plugin-slug/my-plugin.php' instead of the `__FILE__` parameter in the snippets above.

To prevent problems, WooCommerce will warn users if they try to enable HPOS while any of the incompatible plugins are active. It will also display a warning in the Plugins screen to make sure people would know if extension is incompatible.
As many WordPress extensions aren't WooCommerce related, WC will only display this information for extensions that declare `WC tested up to` in the header of the main plugin file.

### New order querying APIs

HPOS, through `WC_Order_Query`, introduces new query types that allow for more complex order queries involving dates, metadata and order fields. Head over to [HPOS: new order querying APIs](https://developer.woocommerce.com/docs/hpos-order-querying-apis/) for details and examples.
