---
post_title: Developing using WooCommerce CRUD objects
sidebar_label: Using CRUD objects
---

# Developing using WooCommerce CRUD objects

CRUDとは、データベースやリソースに対して行うことができる4つの基本的な操作（Create、Read、Update、Delete）の略語です。

[WooCommerce 3.0では、WooCommerceのデータを扱うためにCRUDオブジェクト](https://woocommerce.wordpress.com/2016/10/27/the-new-crud-classes-in-woocommerce-2-7/)が導入されました。 **可能な限り、メタデータを直接更新したりWordPressの投稿オブジェクトを使用する代わりに、これらのオブジェクトをコードで使用する必要があります。

これらのオブジェクトはそれぞれ、制御するデータ（プロパティ）のスキーマ、各プロパティのゲッターとセッター、データストアとやり取りする保存/削除メソッドを含んでいる。データストアは、データベースからの実際の保存／読み込みを処理する。オブジェクト自身は、データがどこに保存されているかを意識する必要はない。

## CRUD の利点

* 構造 - 各オブジェクトは事前に定義された構造を持ち、それ自身のデータを有効に保ちます。
* コントロール - データの流れをコントロールし、必要な検証を行うことで、いつ変更が発生したかを知ることができます。
* 開発の容易性 - 開発者として、扱うデータの内部を知る必要はなく、名前だけを知ることができます。
* 抽象化 - 既存のコードに影響を与えることなく、カスタム・テーブルなど別の場所にデータを移動できる。
* 統一 - REST APIやCLIで行っているのと同じように、管理画面でも同じコードを使って更新できる。すべてが統一されています。
* コードの簡素化 - オブジェクトを更新するための手続き的なコードが少なくなり、誤動作の可能性が減り、単体テストのカバレッジが増えます。

## CRUD オブジェクトの構造

[`WC_Data`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/abstracts/abstract-wc-data.php)クラスはCRUDオブジェクトの基本的な実装であり、すべてのCRUDオブジェクトはこれを継承しています。最も重要なプロパティは`$data`で、これは各オブジェクトでサポートされているプロップの配列であり、`$id`はオブジェクトのIDです。

[クーポン・オブジェクト・クラス](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/class-wc-coupon.php)は、`WC_Data`を拡張し、すべてのプロパティにCRUD関数を追加した良い例です。

`$data`はプロパティ名とデフォルト値を格納する：

```php
/**
 * Data array, with defaults.
 * @since 3.0.0
 * @var array
 */
protected $data = array(
	'code'                        => '',
	'amount'                      => 0,
	'date_created'                => '',
	'date_modified'               => '',
	'discount_type'               => 'fixed_cart',
	'description'                 => '',
	'date_expires'                => '',
	'usage_count'                 => 0,
	'individual_use'              => false,
	'product_ids'                 => array(),
	'excluded_product_ids'        => array(),
	'usage_limit'                 => 0,
	'usage_limit_per_user'        => 0,
	'limit_usage_to_x_items'      => 0,
	'free_shipping'               => false,
	'product_categories'          => array(),
	'excluded_product_categories' => array(),
	'exclude_sale_items'          => false,
	'minimum_amount'              => '',
	'maximum_amount'              => '',
	'email_restrictions'          => array(),
	'used_by'                     => array(),
);
```

### ゲッターとセッター

この配列（プロパティ）の各キーにはゲッターとセッターがあり、例えば`set_used_by()`や`get_used_by()`がある。`$data`自体はプライベートなので、ゲッターとセッターを使ってデータにアクセスしなければなりません。

ゲッターの例：

```php
/**
 * Get records of all users who have used the current coupon.
 * @since  3.0.0
 * @param  string $context
 * @return array
 */
public function get_used_by( $context = 'view' ) {
	return $this->get_prop( 'used_by', $context );
}
```

セッターの例：

```php
/**
 * Set which users have used this coupon.
 * @since 3.0.0
 * @param array $used_by
 * @throws WC_Data_Exception
 */
public function set_used_by( $used_by ) {
	$this->set_prop( 'used_by', array_filter( $used_by ) );
}
```

`set_prop`と`get_prop`は`WC_Data`の一部です。これらは（コンテキストに基づく）さまざまなフィルタを適用し、変更を処理するので、すべてのプロップではなく、変更されたプロップのみを効率的に保存することができます。

`$context`に関する注意: フロントエンドやディスプレイで使用するデータを取得する場合、`view`コンテキストが使用されます。これはデータにフィルタを適用し、拡張機能が動的に値を変更できるようにします。`edit`コンテキストは、バックエンドで編集する値を表示するときやデータベースに保存するときに使用します。`edit` コンテキストを使用すると、データにフィルタを適用しません。

### コンストラクタ

CRUDオブジェクトのコンストラクタは、データベースからの読み込みを容易にします。実際の読み込みはCRUDクラスではなく、そのデータストアが行います。

```php
/**
 * Coupon constructor. Loads coupon data.
 * @param mixed $data Coupon data, object, ID or code.
 */
public function __construct( $data = '' ) {
	parent::__construct( $data );

	if ( $data instanceof WC_Coupon ) {
		$this->set_id( absint( $data->get_id() ) );
	} elseif ( is_numeric( $data ) && 'shop_coupon' === get_post_type( $data ) ) {
		$this->set_id( $data );
	} elseif ( ! empty( $data ) ) {
		$this->set_id( wc_get_coupon_id_by_code( $data ) );
		$this->set_code( $data );
	} else {
		$this->set_object_read( true );
	}

	$this->data_store = WC_Data_Store::load( 'coupon' );
	if ( $this->get_id() > 0 ) {
		$this->data_store->read( $this );
	}
}
```

オブジェクトに渡されたデータに基づいてIDを設定し、データベースからデータを取得するためにデータストアを呼び出すことに注意してください。データ・ストア経由でデータが読み込まれると、あるいはIDが設定されていない場合は、`$this->set_object_read( true );`が設定され、データ・ストアとCRUDオブジェクトは読み込まれたことを認識します。これが設定されると、変更が追跡されます。

### 保存と削除

親クラスの`WC_Data`で処理できるため、CRUD子クラスでは保存と削除のメソッドはオプションです。`save`が呼び出されると、データ・ストアを使用してデータベースにデータを保存します。Deleteはデータベースからオブジェクトを削除します。`save`が呼び出されないと、変更は永続化されず、破棄されます。

`WC_Data`のセーブ・メソッドは次のようになる：

```php
/**
 * Save should create or update based on object existence.
 *
 * @since  2.6.0
 * @return int
 */
public function save() {
	if ( $this->data_store ) {
		// Trigger action before saving to the DB. Allows you to adjust object props before save.
		do_action( 'woocommerce_before_' . $this->object_type . '_object_save', $this, $this->data_store );

		if ( $this->get_id() ) {
			$this->data_store->update( $this );
		} else {
			$this->data_store->create( $this );
		}
		return $this->get_id();
	}
}
```

Update/createは、オブジェクトがまだIDを持っているかどうかによって使い分けられる。IDは作成後に設定されます。

削除方法はこうだ：

```php
/**
 * Delete an object, set the ID to 0, and return result.
 *
 * @since  2.6.0
 * @param  bool $force_delete
 * @return bool result
 */
public function delete( $force_delete = false ) {
	if ( $this->data_store ) {
		$this->data_store->delete( $this, array( 'force_delete' => $force_delete ) );
		$this->set_id( 0 );
		return true;
	}
	return false;
}
```

## CRUD の使用例

### 新しいシンプルな商品を作る

```php
$product = new WC_Product_Simple();
$product->set_name( 'My Product' );
$product->set_slug( 'myproduct' );
$product->set_description( 'A new simple product' );
$product->set_regular_price( '9.50' );
$product->save();

$product_id = $product->get_id();
```

### 既存のクーポンの更新

```php
$coupon = new WC_Coupon( $coupon_id );
$coupon->set_discount_type( 'percent' );
$coupon->set_amount( 25.00 );
$coupon->save();
```

### 顧客の検索

```php
$customer = new WC_Customer( $user_id );
$email    = $customer->get_email();
$address  = $customer->get_billing_address();
$name     = $customer->get_first_name() . ' ' . $customer->get_last_name();
```
