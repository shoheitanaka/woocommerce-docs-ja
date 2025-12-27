---
post_title: HPOS extension recipe book
---
# HPOS拡張レシピブック

## 高性能オーダーストレージ（HPOS）とは？

つい最近まで、WooCommerceは注文関連のデータをWordPressのカスタム投稿タイプとしてデータベースの投稿テーブルとpostmetaテーブルに保存しており、エコシステムで働く誰もがWordPressのコアが提供する広範なAPIを活用して注文をカスタム投稿タイプとして管理することができました。

しかし、2022年初めには、[注文専用のテーブルに移行する計画を発表しました](https://developer.woocommerce.com/2022/01/17/the-plan-for-the-woocommerce-custom-order-table/)。注文を専用のテーブルにすることで、ショップはより簡単に拡張できるようになり、データの保存がよりシンプルになり、信頼性が高まります。詳細については、[開発者ブログのデータベース構造に関するディープダイブ](https://developer.woocommerce.com/2022/09/15/high-performance-order-storage-database-schema/)をご覧ください。

一般的に、WooCommerceは旧バージョンとの完全な後方互換性を保とうとしてきましたが、このプロジェクトの結果、エクステンション開発者はHPOSを利用するためにプラグインにいくつかの変更を加える必要があります。これは根本的なデータ構造が変更されたためです。

[具体的には、WordPressが提供するAPIを使用して注文データにアクセスする代わりに、開発者はWooCommerce固有のAPIを使用する必要があります。HPOSへの移行をより簡単にするために、WooCommerceバージョン3.0でこれらのAPIを導入しました](https://developer.woocommerce.com/2017/04/04/say-hello-to-woocommerce-3-0-bionic-butterfly/)。

このガイドでは、エクステンションやカスタムコードの断片をHPOSと互換性を持たせるために必要な変更に焦点を当てます。

HPOSの有効化・無効化の方法、データストア間のオーダーの同期方法については、[HPOSドキュメント](https://woocommerce.com/document/high-performance-order-storage/)を参照してください。

## 後方互換性

ショップと開発者が同じように移行しやすいように、私たちは可能な限り後方互換性を保つように努めました。このプロジェクトの大きな互換性の問題のひとつは、基礎となるデータ構造が`wp_posts`および`wp_postmeta`テーブルであったため、WC固有のCRUDクラスを回避し、WordPress APIを使用して直接データにアクセスしても問題なく動作したことです。

この変更により、WordPressのテーブルから直接注文を読み込むと、古い注文を読み込むことになり、テーブルに直接書き込むと、読み込まれない注文を更新することになります。これはかなり重大な問題であるため、暫定的にいくつかの緩和策を追加しました。

### データソースの切り替え

さらに、新しいテーブルで問題が発生した場合、HPOSの使用から手動でテーブルの投稿に切り替えることができます。元に戻すには、WC > 設定 > 詳細 > 機能の「注文データの保存」設定を変更してください。

## 拡張機能における高性能注文ストレージのサポート

後方互換性ポリシーは、加盟店にとってはプロジェクトの利用を容易にするが、拡張機能開発者にとっては、しばらくの間、PostsとHPOSの両方をサポートしなければならないことを意味する。

これを支援するために、拡張機能開発者が従うべきガイドラインをいくつか用意しました。

**Note:** 最新のHPOSの修正とAPIをすべて取得するために、拡張機能の作業中はWooCommerceの開発バージョンを使用することをお勧めします。WooCommerceのレポがどのように構成されているか、どのようにソースからプラグインをビルドするかについては、[開発ガイド](https://github.com/woocommerce/woocommerce/blob/trunk/DEVELOPMENT.md)を参照してください。

### 店舗でHPOSテーブルが使用されているかどうかを検出する。

WooCommerce CRUD API は投稿とカスタムテーブルの両方をサポートしますが、場合によっては（より良いパフォーマンスのためにSQLクエリを書くときなど）ストアがHPOSテーブルを使用しているかどうかを知りたいことがあります。この場合は、以下のパターンを使用します：

```php
use Automattic\WooCommerce\Utilities\OrderUtil;

if ( OrderUtil::custom_orders_table_usage_is_enabled() ) {
	// HPOS usage is enabled.
} else {
	// Traditional CPT-based orders are in use.
}
```

### DBへの直接アクセスの使用に関するコードベースの監査

HPOSテーブルをサポートするために、まず始めに、DBへの直接アクセスやWordPressのAPIを使用していないか監査するのがよいでしょう。この監査を行うには、以下の正規表現を使用して検索することができます：

```regexp
wpdb|get_post|get_post_field|get_post_status|get_post_type|get_post_type_object|get_posts|metadata_exists|get_post_meta|get_metadata|get_metadata_raw|get_metadata_default|get_metadata_by_mid|wp_insert_post|add_metadata|add_post_meta|wp_update_post|update_post_meta|update_metadata|update_metadata_by_mid|delete_metadata|delete_post_meta|delete_metadata_by_mid|delete_post_meta_by_key|wp_delete_post|wp_trash_post|wp_untrash_post|wp_transition_post_status|clean_post_cache|update_post_caches|update_postmeta_cache|post_exists|wp_count_post|shop_order
```

偽陽性がたくさん見つかるだろうが、この正規表現はかなり徹底しているので、ほとんどの真陽性を捕らえることができるはずであることに注意してほしい。

ソースコードから上記の正規表現を検索する：

1.一致した項目を一つずつ調べ、その項目が注文に関連しているかどうかをチェックします。ほとんどのマッチはおそらく誤検出、つまり注文に関連していないでしょう。
2.もしマッチした中に注文データに直接アクセスしたり変更したりするものがあれば、代わりにWooCommerceのCRUD APIを使用するように変更する必要があります。

### 投稿とpostmetaを取得／設定するためのAPI

投稿を直接取得するコードは、代わりに`wc_get_order`呼び出しに変換することができる：

```php
// Instead of
$post = get_post( $post_id ); // returns WP_Post object.
// use
$order = wc_get_order( $post_id ); // returns WC_Order object.
```

メタデータを操作するには、注文オブジェクトの`update_`/`add_`/`delete_metadata`メソッドを使用し、次に`save`を呼び出します。WooCommerceはどのテーブルがアクティブかを判断し、適切な場所にデータを保存します。

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

**注意:** `save()`メソッドの呼び出しは、比較的コストのかかる操作であるため、必要以上に何度も呼び出すことは避けたいだろう（例えば、同じフローの後半で呼び出されることが分かっている場合、同じオブジェクトを操作する際に、それ以前にさらに呼び出すことは避けたいだろう）。

注文の正確な型を取得したり、与えられたIDが注文であるかどうかをチェックしたりする場合は、`OrderUtil`クラスのメソッドを使用することができます。

```php
// Pattern to check when an ID is an order
'shop_order' === get_post_type( $post_id ); // or
in_array( get_post_type( $post_type ), wc_get_order_types() );

// replace with:
use Automattic\WooCommerce\Utilities\OrderUtil;
'shop_order' === OrderUtil::get_order_type( $post_id ); // or
OrderUtil::is_order( $post_id, wc_get_order_types() );
```

### 注文管理画面機能の監査

WCはWordPressが提供する投稿一覧画面と投稿編集画面を使用できないため、注文管理用の新しい画面も追加しました。これらの画面は、現在WooCommerceの管理画面に表示されているものと非常によく似ています（HPOSテーブルを使用しているという事実を除いて）。この監査を実行するには、以下の正規表現を使用できます：

```regexp
post_updated_messages|do_meta_boxes|enter_title_here|edit_form_before_permalink|edit_form_after_title|edit_form_after_editor|submitpage_box|submitpost_box|edit_form_advanced|dbx_post_sidebar|manage_shop_order_posts_columns|manage_shop_order_posts_custom_column
```

ここでも多くの誤検出が見られるでしょう。しかし、もしこれらのメソッドが注文画面で呼び出されるような使い方に遭遇したら、HPOSにアップグレードするために、以下の変更を行う必要があります：

`WP_Post`クラスの`$post`オブジェクトの代わりに、`WC_Order`クラスの`$order`オブジェクトを使用する必要があります。フィルタまたはアクションである場合、新しいWooCommerce画面にも同様のフィルタを実装し、postオブジェクトを渡す代わりにWC_Orderオブジェクトを受け取ります。

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

### 拡張機能の（中略）互換性の宣言

拡張機能のコードを調べたら、それがHPOSと互換性があるかどうかを宣言することができます。これを簡単に行うためのAPIを用意しました。拡張機能の互換性を宣言するには**、以下のコードを**メイン・プラグイン・ファイル**に記述してください：

```php
add_action( 'before_woocommerce_init', function() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
} );
```

もしあなたのコードがHPOSをサポートしていないことが分かっている場合は、以下の方法で**非互換性**を宣言してください。以下のコードを**メイン・プラグイン・ファイル**に記述してください：

```php
add_action( 'before_woocommerce_init', function() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, false );
	}
} );
```

互換性宣言をメインのプラグインファイルの外側にインクルードしたい場合は、上記のスニペットで`__FILE__`パラメータの代わりに'my-plugin-slug/my-plugin.php'を渡してください。

問題を防ぐために、WooCommerceは互換性のないプラグインが有効な状態でHPOSを有効にしようとすると警告を表示します。また、プラグイン画面に警告を表示し、拡張機能が互換性がないことをユーザーに知らせます。
多くのWordPress拡張機能はWooCommerceに関連していないため、WCはメインプラグインファイルのヘッダーで`WC tested up to`を宣言している拡張機能に対してのみこの情報を表示します。

### 新しい注文照会API

HPOSでは、`WC_Order_Query`を通じて、日付、メタデータ、注文フィールドを含む、より複雑な注文クエリを可能にする新しいクエリタイプを導入しています。詳細と例については、[HPOS: new order querying APIs](https://developer.woocommerce.com/docs/hpos-order-querying-apis/) をご覧ください。
