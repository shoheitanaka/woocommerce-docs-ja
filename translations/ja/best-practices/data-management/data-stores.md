---
post_title: How to manage WooCommerce Data Stores
sidebar_label: Manage data stores
---

# How to manage WooCommerce Data Stores

## はじめに

データストアクラスはWooCommerceのデータCRUDクラス(`WC_Product`、`WC_Order`、`WC_Customer`など)とデータベース層の橋渡しをします。データベースロジックをデータから分離することで、WooCommerceはより柔軟になります。WooCommerceコアに同梱されているデータストア（WordPressのカスタム投稿システムといくつかのカスタムテーブルを利用）は、別のデータベース構造やタイプに交換したり、外部APIを利用することもできます。

このガイドでは、データ・ストア・クラスの構造、新しいデータ・ストアの作成方法、コア・データ・ストアの置き換え方法、独自のコードからデータ・ストアを呼び出す方法について説明します。

このガイドの例では、[`WC_Coupon`](https://github.com/woocommerce/woocommerce/blob/dcecf0f22890f3cd92fbea13a98c11b2537df2a8/includes/class-wc-coupon.php#L19) CRUDデータクラスと、[`WC_Coupon_Data_Store_CPT`](https://github.com/woocommerce/woocommerce/blob/dcecf0f22890f3cd92fbea13a98c11b2537df2a8/includes/data-stores/class-wc-coupon-data-store-cpt.php) WordPressカスタム投稿タイプを使用したクーポンデータストアの実装を見ていきます。これは現在WooCommerceでクーポンが保存されている方法です。

`WC_Coupon`やその他のCRUDデータ・クラスでデータ・ストアを扱う際に知っておくべき重要なことは、それらがどのプロップ（プロパティ）を含んでいるかということです。これは、各クラスの [`data`](https://github.com/woocommerce/woocommerce/blob/dcecf0f22890f3cd92fbea13a98c11b2537df2a8/includes/class-wc-coupon.php#L26) 配列で定義されています。

## 構造

CRUDオブジェクトのすべてのデータストアは`WC_Object_Data_Store_Interface`インターフェイスを実装する必要があります。

`WC_Object_Data_Store_Interface`には以下のメソッドがある：

* `create`
* `read`
* `update`
* `delete`
* ラインコード
* インラインコード
* インラインコード
* インラインコード7

`create`、`read`、`update`、`delete`メソッドはプロップのCRUDロジックを処理します：

* `create`は、データベースに新しいエントリーを作成する。例クーポンを作成する。
* `read`は、データベースから1つのエントリをクエリし、そのレスポンスに基づいてプロパティを設定します。例クーポンを読み込む。
* `update`は、既存のエントリーに変更を加えます。例クーポンを更新または編集する。
* `delete`はデータベースからエントリを削除します。例クーポンを削除します。

すべてのデータストアは、これらのメソッドの処理を実装しなければならない。

小道具を扱うだけでなく、他のカスタム・データを渡すこともできます。これは `meta` とみなされます。例えば、クーポンはプラグインから提供されたカスタムデータを持つことができます。

`read_meta`、`delete_meta`、`add_meta`、`update_meta`メソッドは、メタが正しいソースから読み込まれ管理されるように定義されなければなりません。WooCommerceのコアクラスの場合、`WC_Data_Store_WP`で定義し、すべてのデータストアに同じコードを使用しています。これらはすべてWordPressのメタシステムを使用しています。metaが別のソースから来る必要がある場合は、これらを再定義することができます。

データストアは、直接クエリを置き換えるために他のメソッドを実装することもできます。例えば、クーポン・データ・ストアはpublic `get_usage_by_user_id`メソッドを持っています。データストアは、常に期待するメソッドのインターフェイスを定義して実装する必要があります。別の言い方をすると、`WC_Object_Data_Store_Interface`インターフェイスに加えて、`WC_Coupon_Data_Store_CPT`も`WC_Coupon_Data_Store_Interface`を実装しています。

## データストアを置き換える

`WC_Coupon_Data_Store_CPT`クラスを`WC_Coupon_Data_Store_Custom_Table`クラスに置き換える方法を見てみましょう。この例では、完全に動作するソリューションではなく、スタブ関数を提供します。以下のカラムを持つ`wc_coupons`というテーブルにクーポンを保存したいとします：

```text
id, code, amount, date_created, date_modified, discount_type, description, date_expires, usage_count,individual_use, product_ids, excluded_product_ids, usage_limit, usage_limit_per_user, limit_usage_to_x_items, free_shipping, product_categories, excluded_product_categories, exclude_sale_items, minimum_amount, maximum_amount, email_restrictions, used_by
```

これらのカラム名はプロップ名と1対1で一致する。

まず、ロジックを格納する新しいデータ・ストア・クラスを作成する必要がある：

```php
/**
 * WC Coupon Data Store: Custom Table.
 */
class WC_Coupon_Data_Store_Custom_Table extends WC_Data_Store_WP implements WC_Coupon_Data_Store_Interface, WC_Object_Data_Store_Interface {

}
```

メインの`WC_Object_Data_Store_Interface`インターフェースと` WC_Coupon_Data_Store_Interface`インターフェースを実装していることに注意してください。これらは、ロジックを提供するために必要なすべてのメソッドを表しています。

次に、これらのプロパティのCRUD処理を定義する：

```php
/**
 * Method to create a new coupon in the database.
 *
 * @param WC_Coupon
 */
public function create( &$coupon ) {
	$coupon->set_date_created( current_time( 'timestamp' ) );
	
	/**
	 * This is where code for inserting a new coupon would go.
	 * A query would be built using getters: $coupon->get_code(), $coupon->get_description(), etc.
	 * After the INSERT operation, we want to pass the new ID to the coupon object.
	 */
	$coupon->set_id( $coupon_id );
	
	// After creating or updating an entry, we need to also cause our 'meta' to save.
	$coupon->save_meta_data();
	
	// Apply changes let's the object know that the current object reflects the database and no "changes" exist between the two.
	$coupon->apply_changes();
	
	// It is helpful to provide the same hooks when an action is completed, so that plugins can interact with your data store.
	do_action( 'woocommerce_new_coupon', $coupon_id );
}

/**
 * Method to read a coupon.
 *
 * @param WC_Coupon
 */
public function read( &$coupon ) {
	$coupon->set_defaults();

	// Read should do a check to see if this is a valid coupon
	// and otherwise	throw an 'Invalid coupon.' exception.
	// For valid coupons, set $data to contain our database result.
	// All props should be set using set_props with output from the database. This "hydates" the CRUD data object.
	$coupon_id = $coupon->get_id();
	$coupon->set_props( array(
		'code'                        => $data->code,
		'description'                 => $data->description,
		// ..
	) );
	
	
	// We also need to read our meta data into the object.
	$coupon->read_meta_data();
	
	// This flag reports if an object has been hydrated or not. If this ends up false, the database hasn't correctly set the object.
	$coupon->set_object_read( true );
	do_action( 'woocommerce_coupon_loaded', $coupon );
}

/**
 * Updates a coupon in the database.
 *
 * @param WC_Coupon
 */
public function update( &$coupon ) {
	// Update coupon query, using the getters.
	
	$coupon->save_meta_data();
	$coupon->apply_changes();
	do_action( 'woocommerce_update_coupon', $coupon->get_id() );
}

/**
 * Deletes a coupon from the database.
 *
 * @param WC_Coupon
 * @param array $args Array of args to pass to the delete method.
 */
public function delete( &$coupon, $args = array() ) {
	// A lot of objects in WordPress and WooCommerce support
	// the concept of trashing. This usually is a flag to move the object
	// to a "recycling bin". Since coupons support trashing, your layer should too.
	// If an actual delete occurs, set the coupon ID to 0.
	
	$args = wp_parse_args( $args, array(
		'force_delete' => false,
	) );

	$id = $coupon->get_id();

	if ( $args['force_delete'] ) {
		// Delete Query
		$coupon->set_id( 0 );
		do_action( 'woocommerce_delete_coupon', $id );
	} else {
		// Trash Query
		do_action( 'woocommerce_trash_coupon', $id );
	}
}
```

私たちは`WC_Data_Store_WP`を拡張し、WordPressのメタシステムを引き続き使用できるようにしています。

構造のセクションで述べたように、我々は`WC_Coupon_Data_Store_Interface`で定義されたメソッドを実装する責任がある。各インターフェイスは、それが受け入れるメソッドとパラメーター、そしてあなたの関数が何をすべきかを記述しています。

クーポンの交換は以下のようになる：

```php
/**
 * Increase usage count for current coupon.
 * 
 * @param WC_Coupon
 * @param string $used_by Either user ID or billing email
 */
public function increase_usage_count( &$coupon, $used_by = '' ) {

}

/**
 * Decrease usage count for current coupon.
 * 
 * @param WC_Coupon
 * @param string $used_by Either user ID or billing email
 */
public function decrease_usage_count( &$coupon, $used_by = '' ) {

}

/**
 * Get the number of uses for a coupon by user ID.
 * 
 * @param WC_Coupon
 * @param id $user_id
 * @return int
 */
public function get_usage_by_user_id( &$coupon, $user_id ) {

}

/**
 * Return a coupon code for a specific ID.
 * @param int $id
 * @return string Coupon Code
 */
 public function get_code_by_id( $id ) {
 
 }

 /**
  * Return an array of IDs for for a specific coupon code.
  * Can return multiple to check for existence.
  * @param string $code
  * @return array Array of IDs.
  */
 public function get_ids_by_code( $code ) {
 
 }
```

全てのデータストアメソッドが定義され、ロジックが書かれたら、組み込みクラスの代わりに新しいクラスをロードするようにWooCommerceに指示する必要があります。これは `woocommerce_data_stores` フィルタを使って行います。データストアスラッグの配列はデフォルトのWooCommerceクラスにマップされます。例

```php
'coupon'              => 'WC_Coupon_Data_Store_CPT',
'customer'            => 'WC_Customer_Data_Store',
'customer-download'   => 'WC_Customer_Download_Data_Store',
'customer-session'    => 'WC_Customer_Data_Store_Session',
'order'               => 'WC_Order_Data_Store_CPT',
'order-refund'        => 'WC_Order_Refund_Data_Store_CPT',
'order-item'          => 'WC_Order_Item_Data_Store',
'order-item-coupon'   => 'WC_Order_Item_Coupon_Data_Store',
'order-item-fee'      => 'WC_Order_Item_Fee_Data_Store',
'order-item-product'  => 'WC_Order_Item_Product_Data_Store',
'order-item-shipping' => 'WC_Order_Item_Shipping_Data_Store',
'order-item-tax'      => 'WC_Order_Item_Tax_Data_Store',
'payment-token'       => 'WC_Payment_Token_Data_Store',
'product'             => 'WC_Product_Data_Store_CPT',
'product-grouped'     => 'WC_Product_Grouped_Data_Store_CPT',
'product-variable'    => 'WC_Product_Variable_Data_Store_CPT',
'product-variation'   => 'WC_Product_Variation_Data_Store_CPT',
'shipping-zone'       => 'WC_Shipping_Zone_Data_Store',
```

特にクーポン・データ・ストアをターゲットにしたいので、次のようにする：

```php
function myplugin_set_wc_coupon_data_store( $stores ) {
	$stores['coupon'] = 'WC_Coupon_Data_Store_Custom_Table';
	return $stores;
}

add_filter( 'woocommerce_data_stores', 'myplugin_set_wc_coupon_data_store' );
```

私たちのクラスは`WC_Coupon_Data_Store_CPT`の代わりにWooCommerceコアによってロードされます。

## 新しいデータストアの作成

### 新しい製品タイプの定義

エクステンションは新しい商品タイプを作成しますか？各商品タイプには、親商品データストアに加え、データストアがあります。親ストアは名前や説明のような共有プロパティを処理し、子ストアはより具体的なデータを処理します。

例えば、外部商品データストアは「ボタンテキスト」と「外部URL」を扱う。変数データストアは、親商品とそのバリエーション商品との関係を扱います。

このプロセスの詳細については、[このチュートリアル](https://developer.woocommerce.com/2017/02/06/wc-2-7-extension-compatibility-examples-3-bookings/)をチェックしてほしい。

### カスタムデータ用データストア

もしあなたの拡張機能が、新しいデータベーステーブル、新しいカスタム投稿タイプ、または商品や注文などとは関係のない新しい形式のデータを導入するのであれば、独自のデータストアを実装する必要があります。

データストアは`WC_Object_Data_Store_Interface`を実装し、通常のCRUD関数を提供する必要があります。データストアは、データとのやりとりのメイン・ポイントであるべきなので、 他のクエリや操作もメソッドを持つべきです。

[配送ゾーンのデータストア](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/data-stores/class-wc-shipping-zone-data-store.php)は、カスタムテーブルを使用した "シンプルな "データストアの良い例です。クーポンコードはカスタム投稿タイプを使用したデータストアの良い例です。

データストアを登録するために必要なのは、`woocommerce_data_stores`フィルターに追加することだけだ：

```php
function myplugin_set_my_custom_data_store( $stores ) {
	$stores['mycustomdata'] = 'WC_My_Custom_Data_Store';
	return $stores;
}

add_filter( 'woocommerce_data_stores', 'myplugin_set_my_custom_data_store' );
```

その後、他のWooCommerceデータストアと同様にデータストアをロードすることができます。

## データストアを呼び出す

データストアの呼び出しは、静的メソッド`WC_Data_Store::load()`を使うのと同じくらい簡単である：

```php
// Load the shipping zone data store.
$data_store = WC_Data_Store::load( 'shipping-zone' );
// Get the number of shipping methods for zone ID 4.
$num_of_methods = $data_store->get_method_count( 4 );
```

メソッドを連鎖させることもできる：

```php
// Get the number of shipping methods for zone ID 4.
$num_of_methods = WC_Data_Store::load( 'shipping-zone' )->get_method_count( 4 );
```

`::load()`メソッドは、`woocommerce_data_stores`に登録されているどのデータ・ストアでも動作するので、カスタム・データ・ストアをロードすることができる：

```php
$data_store = WC_Data_Store::load( 'mycustomdata' );
```

## データストアの制限と WP Admin

現在、WooCommerceのいくつかの画面は、オブジェクトをリストするためにWordPressに依存しています。クーポンや商品などがその例です。

データストアを介してデータを置き換えた場合、既存のUIの一部が失敗することがあります。この例として、`type`フィルタを使用したときのクーポンのリストがあります。このフィルタはメタデータを使用し、`WP_Query`クラスを使用してクエリを実行するWordPressに渡されます。これは通常のメタテーブル以外のデータを扱うことができません（Ref. #19937）。これを回避するには、`WP_Query`の使用を非推奨とし、カスタムのクエリクラスや関数に置き換える必要があります。
