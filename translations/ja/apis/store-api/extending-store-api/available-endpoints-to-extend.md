# 利用可能な拡張可能エンドポイント

Store APIのいくつかのエンドポイントは、`ExtendSchema`というクラスによって拡張可能です。これにより、Store APIから返されるデータ（スキーマを含む）をカスタマイズして、アプリケーションやプラグインで利用できるようにすることができます。

ストアAPIの拡張については、以下もご参照ください：

-   [`ExtendSchema`を使用してStore APIにデータを追加する方法](./extend-store-api-add-data.md)
-   [新しいエンドポイントを追加する方法](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/internal-developers/rest-api/extend-rest-api-new-endpoint.md)

以下は、`ExtendSchema`を使用して拡張できるエンドポイントのリストと使用例です。

## 製品

メインの`wc/store/products`エンドポイントは、ExtendSchemaによって拡張可能です。データは、レスポンス配列の各 `product` の `extensions` キーで取得できます。

このエンドポイントは、`ProductSchema::IDENTIFIER`キーを使って拡張することができます。このエンドポイントでは、`data_callback`コールバック関数に`$product`がパラメータとして渡されます。`schema_callback`関数には、追加のパラメータは渡されません。

### 使用例

このエンドポイントは、個々の商品に関する追加データを追加するのに便利です。これは、メタデータ、追加価格、または商品ページのカスタムブロックやコンポーネントをサポートするためのものです。

### 例

```php
woocommerce_store_api_register_endpoint_data(
	array(
		'endpoint'        => ProductSchema::IDENTIFIER,
		'namespace'       => 'my_plugin_namespace',
		'data_callback'   => function( $product ) {
			return array(
				'my_meta_data' => get_post_meta( $product->get_id(), 'my_meta_data', true ),
			);
		},
		'schema_callback' => function() {
			return array(
				'properties' => array(
					'my_meta_data' => array(
						'type' => 'string',
					),
				),
			);
		},
		'schema_type'     => ARRAY_A,
	)
);
```

## Cart

メインの`wc/store/cart`エンドポイントは、ExtendSchemaによって拡張可能です。データはレスポンスの `extensions` キーで利用できます。

このエンドポイントは、`CartSchema::IDENTIFIER` キーを使って拡張することができます。このエンドポイントでは、`data_callback`関数と`schema_callback`関数に追加のパラメータは渡されません。

### 使用例

このエンドポイントは、カートページに追加データを追加するのに便利です。例えば、カートアイテムに関する追加データや、カートページに表示されるカスタムブロックをサポートするために必要なものなどです。

### 例

```php
woocommerce_store_api_register_endpoint_data(
	array(
		'endpoint'        => CartSchema::IDENTIFIER,
		'namespace'       => 'my_plugin_namespace',
		'data_callback'   => function() {
			return array(
				'foo' => 'bar',
			);
		},
		'schema_callback' => function() {
			return array(
				'properties' => array(
					'foo' => array(
						'type' => 'string',
					),
				),
			);
		},
		'schema_type'     => ARRAY_A,
	)
);
```

## カートアイテム

`wc/store/cart/items`エンドポイントは、`items`キー内の`wc/store/cart`でも利用可能です。データは`items`配列の各アイテムの中で利用できる。

このエンドポイントは、`CartItemSchema::IDENTIFIER`キーを使って拡張することができます。このエンドポイントでは、`data_callback`コールバック関数にパラメータとして`$cart_item`が渡されます。すべてのカートアイテムは同じスキーマを共有する必要があります。

### 使用例

このエンドポイントは、個々のカートアイテムに関する追加データを追加するのに便利です。これは、メタデータ、追加価格、またはカートページのカスタムブロックやコンポーネントをサポートするための他の何かである可能性があります。

### 例

```php
woocommerce_store_api_register_endpoint_data(
	array(
		'endpoint'        => CartItemSchema::IDENTIFIER,
		'namespace'       => 'my_plugin_namespace',
		'data_callback'   => function( $cart_item ) {
			$product = $cart_item['data'];
			return array(
				'my_meta_data' => get_post_meta( $product->get_id(), 'my_meta_data', true ),
			);
		},
		'schema_callback' => function() {
			return array(
				'properties' => array(
					'my_meta_data' => array(
						'type' => 'string',
					),
				),
			);
		},
		'schema_type'     => ARRAY_A,
	)
);
```

## チェックアウト

`wc/store/checkout`エンドポイントはExtendSchemaによって拡張可能です。追加のデータは、レスポンスの `extensions` キーで取得できます。

このエンドポイントは、`CheckoutSchema::IDENTIFIER` キーを使って拡張することができます。このエンドポイントでは、`data_callback`関数と`schema_callback`関数に追加のパラメータは渡されません。

### 使用例

このエンドポイントは、ユーザーまたはサーバーから収集する追加データを必要とするカスタム支払い方法など、チェックアウトページに追加データを追加する場合に便利です。

重要：重要: このエンドポイントは一般に公開されているため、機密データを公開しないでください。これには決済サービスの秘密鍵も含まれます。

### 例

```php
woocommerce_store_api_register_endpoint_data(
	array(
		'endpoint'        => CheckoutSchema::IDENTIFIER,
		'namespace'       => 'my_plugin_namespace',
		'data_callback'   => function() {
			return array(
				'foo' => 'bar',
			);
		},
		'schema_callback' => function() {
			return array(
				'properties' => array(
					'foo' => array(
						'type' => 'string',
					),
				),
			);
		},
		'schema_type'     => ARRAY_A,
	)
);
```
