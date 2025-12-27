# データを公開する

## 問題

ミニカート、カート、チェックアウトブロックを拡張したいが、ストアAPIやコンテキストでは利用できないカスタムデータを使用したい。独自のエンドポイントやAjaxアクションを作成したくない。既存のStoreAPIコールをピギーバックしたい。

## 解決策

ExtendSchemaは、`wc/store/cart`や`wc/store/cart/items`エンドポイントのようなStore APIエンドポイントに、コンテキストのカスタムデータを追加する可能性を提供します。このデータはあなたのプラグインの名前空間となり、他のプラグインによって誤動作しないように保護されます。データはすべてのフロントエンドのフィルタとスロットフィルで利用可能です。

## 基本的な使い方

ExtendSchemaを使用するには、`schema_callback`と`data_callback`の2つの関数を特定のエンドポイント・ネームスペースに登録します。ExtendSchemaは実行時にこれらの関数を呼び出し、関連するデータも渡します。

以下の例では、Cart エンドポイントを使用しています。[渡されたパラメータを参照](./available-endpoints-to-extend.md)

**注：以下の「考慮すべき点」を必ずお読みください。

```php
use Automattic\WooCommerce\StoreApi\Schemas\V1\CartSchema;

add_action('woocommerce_blocks_loaded', function() {
 woocommerce_store_api_register_endpoint_data(
	array(
		'endpoint' => CartSchema::IDENTIFIER,
		'namespace' => 'plugin_namespace',
		'data_callback' => 'my_data_callback',
		'schema_callback' => 'my_schema_callback',
		'schema_type' => ARRAY_A,
		)
	);
});


function my_data_callback() {
	return [
		'custom-key' => 'custom-value',
	];
}

function my_schema_callback() {
	return [
		'custom-key' => [
			'description' => __( 'My custom data', 'plugin-namespace' ),
			'type' => 'string',
			'readonly' => true,
		]
	];
}
```

データ・コールバックとスキーマ・コールバックはパラメーターを受け取ることもできる：

```php

function my_cart_item_callback( $cart_item ) {
$product = $cart_item['data'];
	if ( is_my_custom_product_type( $product ) ) {
		$custom_value = get_custom_value( $product );
		return [
			'custom-key' => $custom_value,
		];
	}
}

```

## ♪考慮すべきこと

### ExtendSchema は共有インスタンスである。

ExtendSchemaはAPIとコンシューマー（サードパーティの開発者）の間で共有インスタンスとして保存されます。そのため、`new ExtendSchema`を使用して自分でクラスを開始することはできません。代わりに、StoreApi依存性注入コンテナから共有インスタンスを次のように常に使用する必要があります。

```php
$extend = StoreApi::container()->get( ExtendSchema::class );
```

また、依存性注入コンテナは`woocommerce_blocks_loaded`アクションが実行された後でないと利用できないので、そのアクションをファイルにフックする必要がある：

```php
use Automattic\WooCommerce\StoreApi\StoreApi;
use Automattic\WooCommerce\StoreApi\Schemas\ExtendSchema;

add_action( 'woocommerce_blocks_loaded', function() {
	$extend = StoreApi::container()->get( ExtendSchema::class );
	// my logic.
});
```

あるいは、グローバルヘルパー関数を使う：

-   `woocommerce_store_api_register_endpoint_data( $args )`
-   `woocommerce_store_api_register_update_callback( $args )`
-   `woocommerce_store_api_register_payment_requirements( $args )`
-   `woocommerce_store_api_get_formatter( $name )`

### エラーと致命的なエラーは管理者以外には表示されない。

コールバック関数`data_callback`と`schema_callback`が例外やエラーをスローした場合、または`register_endpoint_data`に間違ったタイプのパラメータを渡した場合、そのエラーはキャッチされ、WooCommerceのエラーログに記録されます。現在のユーザがショップマネージャまたは管理者であり、WP_DEBUGを有効にしている場合、エラーはフロントエンドに表示されます。

### コールバックは常に配列を返すべきである

クライアントコードを壊してしまったり、間違った型を渡してしまったりする可能性を減らし、また一貫したREST APIレスポンスを維持するために、`data_callback`や`schema_callback`のようなコールバックは、たとえそれが空だったとしても、常に配列を返すべきです。

## API定義

-   `ExtendSchema::register_endpoint_data`：カスタムエンドポイントにデータを登録するために使用される。引数の配列を受け取ります：

| 属性 | タイプ | 必須 | 説明 |
| :---------------- | :------- | :----------------------:| :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | Yes | 拡張しようとしているエンドポイント。タイプミスを避けるために、route Schemaクラスで利用可能な`::IDENTIFIER`を使用することが推奨されます。            |
| プラグインの名前空間。StoreAPIのレスポンスで、この名前空間の下でデータが利用可能になります。                                                     |
| コールバック｜はい｜データを配列で返すコールバックです。                                                                                                     |
| `schema_callback` | callback | Yes | データの形状を返すコールバック。                                                                                                      |
| `schema_type` | string | No (default: `ARRAY_A` ) | データの型。オブジェクト（キー => 値）を追加する場合は、`ARRAY_A`でなければなりません。アイテムのリストを追加する場合は、`ARRAY_N`でなければなりません。|

## ♪まとめよう

これは、WooCommerce購読データを各カートアイテムにコンテキスト登録する方法を示す完全な例です(簡略化)。この例では[Formatters](./extend-store-api-formatters.md)というユーティリティクラスを使用しています。

```php
<?php
/**
 * WooCommerce Subscriptions Extend Store API.
 *
 * A class to extend the store public API with subscription related data
 * for each subscription item
 *
 * @package WooCommerce Subscriptions
 */
use Automattic\WooCommerce\StoreApi\StoreApi;
use Automattic\WooCommerce\StoreApi\Schemas\ExtendSchema;
use Automattic\WooCommerce\StoreApi\Schemas\V1\CartItemSchema;

add_action( 'woocommerce_blocks_loaded', function() {
	$extend = StoreApi::container()->get( ExtendSchema::class );
	WC_Subscriptions_Extend_Store_Endpoint::init( $extend );
});

class WC_Subscriptions_Extend_Store_Endpoint {
	/**
	 * Stores Rest Extending instance.
	 *
	 * @var ExtendSchema
	 */
	private static $extend;

	/**
	 * Plugin Identifier, unique to each plugin.
	 *
	 * @var string
	 */
	const IDENTIFIER = 'subscriptions';

	/**
	 * Bootstraps the class and hooks required data.
	 *
	 * @param ExtendSchema $extend_rest_api An instance of the ExtendSchema class.
	 *
	 * @since 3.1.0
	 */
	public static function init( ExtendSchema $extend_rest_api ) {
		self::$extend = $extend_rest_api;
		self::extend_store();
	}

	/**
	 * Registers the actual data into each endpoint.
	 */
	public static function extend_store() {

		// Register into `cart/items`
		self::$extend->register_endpoint_data(
			array(
				'endpoint'        => CartItemSchema::IDENTIFIER,
				'namespace'       => self::IDENTIFIER,
				'data_callback'   => array( 'WC_Subscriptions_Extend_Store_Endpoint', 'extend_cart_item_data' ),
				'schema_callback' => array( 'WC_Subscriptions_Extend_Store_Endpoint', 'extend_cart_item_schema' ),
				'schema_type'       => ARRAY_A,
			)
		);
	}

	/**
	 * Register subscription product data into cart/items endpoint.
	 *
	 * @param array $cart_item Current cart item data.
	 *
	 * @return array $item_data Registered data or empty array if condition is not satisfied.
	 */
	public static function extend_cart_item_data( $cart_item ) {
		$product   = $cart_item['data'];
		$item_data = array(
			'billing_period'      => null,
			'billing_interval'    => null,
			'subscription_length' => null,
			'trial_length'        => null,
			'trial_period'        => null,
			'sign_up_fees'        => null,
			'sign_up_fees_tax'    => null,

		);

		if ( in_array( $product->get_type(), array( 'subscription', 'subscription_variation' ), true ) ) {
			$item_data = array_merge(
				array(
					'billing_period'      => WC_Subscriptions_Product::get_period( $product ),
					'billing_interval'    => (int) WC_Subscriptions_Product::get_interval( $product ),
					'subscription_length' => (int) WC_Subscriptions_Product::get_length( $product ),
					'trial_length'        => (int) WC_Subscriptions_Product::get_trial_length( $product ),
					'trial_period'        => WC_Subscriptions_Product::get_trial_period( $product ),
				),
				self::format_sign_up_fees( $product )
			);
		}

		return $item_data;
	}

	/**
	 * Register subscription product schema into cart/items endpoint.
	 *
	 * @return array Registered schema.
	 */
	public static function extend_cart_item_schema() {
		return array(
			'billing_period'      => array(
				'description' => __( 'Billing period for the subscription.', 'woocommerce-subscriptions' ),
				'type'        => array( 'string', 'null' ),
				'enum'        => array_keys( wcs_get_subscription_period_strings() ),
				'context'     => array( 'view', 'edit' ),
				'readonly'    => true,
			),
			'billing_interval'    => array(
				'description' => __( 'The number of billing periods between subscription renewals.', 'woocommerce-subscriptions' ),
				'type'        => array( 'integer', 'null' ),
				'context'     => array( 'view', 'edit' ),
				'readonly'    => true,
			),
			'subscription_length' => array(
				'description' => __( 'Subscription Product length.', 'woocommerce-subscriptions' ),
				'type'        => array( 'integer', 'null' ),
				'context'     => array( 'view', 'edit' ),
				'readonly'    => true,
			),
			'trial_period'        => array(
				'description' => __( 'Subscription Product trial period.', 'woocommerce-subscriptions' ),
				'type'        => array( 'string', 'null' ),
				'enum'        => array_keys( wcs_get_subscription_period_strings() ),
				'context'     => array( 'view', 'edit' ),
				'readonly'    => true,
			),
			'trial_length'        => array(
				'description' => __( 'Subscription Product trial interval.', 'woocommerce-subscriptions' ),
				'type'        => array( 'integer', 'null' ),
				'context'     => array( 'view', 'edit' ),
				'readonly'    => true,
			),
			'sign_up_fees'        => array(
				'description' => __( 'Subscription Product signup fees.', 'woocommerce-subscriptions' ),
				'type'        => array( 'string', 'null' ),
				'context'     => array( 'view', 'edit' ),
				'readonly'    => true,
			),
			'sign_up_fees_tax'    => array(
				'description' => __( 'Subscription Product signup fees taxes.', 'woocommerce-subscriptions' ),
				'type'        => array( 'string', 'null' ),
				'context'     => array( 'view', 'edit' ),
				'readonly'    => true,
			),
		);
	}


	/**
	 * Format sign-up fees.
	 *
	 * @param \WC_Product $product current product.
	 * @return array
	 */
	private static function format_sign_up_fees( $product ) {
		$fees_excluding_tax = wcs_get_price_excluding_tax(
			$product,
			array(
				'qty'   => 1,
				'price' => WC_Subscriptions_Product::get_sign_up_fee( $product ),
			)
		);

		$fees_including_tax = wcs_get_price_including_tax(
			$product,
			array(
				'qty'   => 1,
				'price' => WC_Subscriptions_Product::get_sign_up_fee( $product ),
			)
		);

		$money_formatter = self::$extend->get_formatter( 'money' );

		return array(
			'sign_up_fees'     => $money_formatter->format(
				$fees_excluding_tax
			),
			'sign_up_fees_tax' => $money_formatter->format(
				$fees_including_tax
				- $fees_excluding_tax
			),

		);
	}
}
```

## データのフォーマット

データが正しい形式でStore APIに渡されるように、既存のフォーマッタを使用することもできます。フォーマッタの詳細については、[StoreApi Formatters documentation](./extend-store-api-formatters.md) を参照してください。
