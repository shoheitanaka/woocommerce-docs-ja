# Cart API 

カートAPIは、現在のセッションまたはログインしているユーザーのカートの現在の状態を返します。

すべてのPOSTエンドポイントは[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)を必要とし、完了すると完全なカートの更新された状態を返します。

## カートをゲット

```http
GET /cart
```

このエンドポイントに必要なパラメータはない。

```sh
curl "https://example-store.com/wp-json/wc/store/v1/cart"
```

カートオブジェクトの完全なレスポンスを返します ([カートレスポンス](#cart-response) を参照ください)。

## レスポンス

`/cart`（このドキュメントに記載されています）の下にあるすべてのエンドポイントは、同じ形式のレスポンスを返します。カートオブジェクトには、カートアイテム、適用されたクーポン、配送先住所と料金、および機密性のない顧客データが含まれます。

### カートの反応

```json
{
	"items": [
		{
			"key": "a5771bce93e200c36f7cd9dfd0e5deaa",
			"id": 38,
			"quantity": 1,
			"quantity_limits": {
				"minimum": 1,
				"maximum": 9999,
				"multiple_of": 1,
				"editable": true
			},
			"name": "Beanie with Logo",
			"short_description": "<p>This is a simple product.</p>",
			"description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>",
			"sku": "Woo-beanie-logo",
			"low_stock_remaining": null,
			"backorders_allowed": false,
			"show_backorder_badge": false,
			"sold_individually": false,
			"permalink": "https://local.wordpress.test/product/beanie-with-logo/",
			"images": [
				{
					"id": 61,
					"src": "https://local.wordpress.test/wp-content/uploads/2023/03/beanie-with-logo-1.jpg",
					"thumbnail": "https://local.wordpress.test/wp-content/uploads/2023/03/beanie-with-logo-1-450x450.jpg",
					"srcset": "https://local.wordpress.test/wp-content/uploads/2023/03/beanie-with-logo-1.jpg 800w, https://local.wordpress.test/wp-content/uploads/2023/03/beanie-with-logo-1-450x450.jpg 450w, https://local.wordpress.test/wp-content/uploads/2023/03/beanie-with-logo-1-100x100.jpg 100w, https://local.wordpress.test/wp-content/uploads/2023/03/beanie-with-logo-1-600x600.jpg 600w, https://local.wordpress.test/wp-content/uploads/2023/03/beanie-with-logo-1-300x300.jpg 300w, https://local.wordpress.test/wp-content/uploads/2023/03/beanie-with-logo-1-150x150.jpg 150w, https://local.wordpress.test/wp-content/uploads/2023/03/beanie-with-logo-1-768x768.jpg 768w",
					"sizes": "(max-width: 800px) 100vw, 800px",
					"name": "beanie-with-logo-1.jpg",
					"alt": ""
				}
			],
			"variation": [],
			"item_data": [],
			"prices": {
				"price": "1800",
				"regular_price": "2000",
				"sale_price": "1800",
				"price_range": null,
				"currency_code": "USD",
				"currency_symbol": "$",
				"currency_minor_unit": 2,
				"currency_decimal_separator": ".",
				"currency_thousand_separator": ",",
				"currency_prefix": "$",
				"currency_suffix": "",
				"raw_prices": {
					"precision": 6,
					"price": "18000000",
					"regular_price": "20000000",
					"sale_price": "18000000"
				}
			},
			"totals": {
				"line_subtotal": "1800",
				"line_subtotal_tax": "180",
				"line_total": "1530",
				"line_total_tax": "153",
				"currency_code": "USD",
				"currency_symbol": "$",
				"currency_minor_unit": 2,
				"currency_decimal_separator": ".",
				"currency_thousand_separator": ",",
				"currency_prefix": "$",
				"currency_suffix": ""
			},
			"catalog_visibility": "visible",
			"extensions": {}
		},
		{
			"key": "b6d767d2f8ed5d21a44b0e5886680cb9",
			"id": 22,
			"quantity": 1,
			"quantity_limits": {
				"minimum": 1,
				"maximum": 9999,
				"multiple_of": 1,
				"editable": true
			},
			"name": "Belt",
			"short_description": "<p>This is a simple product.</p>",
			"description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>",
			"sku": "woo-belt",
			"low_stock_remaining": null,
			"backorders_allowed": false,
			"show_backorder_badge": false,
			"sold_individually": false,
			"permalink": "https://local.wordpress.test/product/belt/",
			"images": [
				{
					"id": 51,
					"src": "https://local.wordpress.test/wp-content/uploads/2023/03/belt-2.jpg",
					"thumbnail": "https://local.wordpress.test/wp-content/uploads/2023/03/belt-2-450x450.jpg",
					"srcset": "https://local.wordpress.test/wp-content/uploads/2023/03/belt-2.jpg 801w, https://local.wordpress.test/wp-content/uploads/2023/03/belt-2-450x450.jpg 450w, https://local.wordpress.test/wp-content/uploads/2023/03/belt-2-100x100.jpg 100w, https://local.wordpress.test/wp-content/uploads/2023/03/belt-2-600x600.jpg 600w, https://local.wordpress.test/wp-content/uploads/2023/03/belt-2-300x300.jpg 300w, https://local.wordpress.test/wp-content/uploads/2023/03/belt-2-150x150.jpg 150w, https://local.wordpress.test/wp-content/uploads/2023/03/belt-2-768x768.jpg 768w",
					"sizes": "(max-width: 801px) 100vw, 801px",
					"name": "belt-2.jpg",
					"alt": ""
				}
			],
			"variation": [],
			"item_data": [],
			"prices": {
				"price": "5500",
				"regular_price": "6500",
				"sale_price": "5500",
				"price_range": null,
				"currency_code": "USD",
				"currency_symbol": "$",
				"currency_minor_unit": 2,
				"currency_decimal_separator": ".",
				"currency_thousand_separator": ",",
				"currency_prefix": "$",
				"currency_suffix": "",
				"raw_prices": {
					"precision": 6,
					"price": "55000000",
					"regular_price": "65000000",
					"sale_price": "55000000"
				}
			},
			"totals": {
				"line_subtotal": "5500",
				"line_subtotal_tax": "550",
				"line_total": "4675",
				"line_total_tax": "468",
				"currency_code": "USD",
				"currency_symbol": "$",
				"currency_minor_unit": 2,
				"currency_decimal_separator": ".",
				"currency_thousand_separator": ",",
				"currency_prefix": "$",
				"currency_suffix": ""
			},
			"catalog_visibility": "visible",
			"extensions": {}
		}
	],
	"coupons": [
		{
			"code": "test",
			"discount_type": "percent",
			"totals": {
				"total_discount": "1095",
				"total_discount_tax": "109",
				"currency_code": "USD",
				"currency_symbol": "$",
				"currency_minor_unit": 2,
				"currency_decimal_separator": ".",
				"currency_thousand_separator": ",",
				"currency_prefix": "$",
				"currency_suffix": ""
			}
		}
	],
	"fees": [],
	"totals": {
		"total_items": "7300",
		"total_items_tax": "730",
		"total_fees": "0",
		"total_fees_tax": "0",
		"total_discount": "1095",
		"total_discount_tax": "110",
		"total_shipping": "1300",
		"total_shipping_tax": "130",
		"total_price": "8256",
		"total_tax": "751",
		"tax_lines": [
			{
				"name": "Tax",
				"price": "751",
				"rate": "10%"
			}
		],
		"currency_code": "USD",
		"currency_symbol": "$",
		"currency_minor_unit": 2,
		"currency_decimal_separator": ".",
		"currency_thousand_separator": ",",
		"currency_prefix": "$",
		"currency_suffix": ""
	},
	"shipping_address": {
		"first_name": "John",
		"last_name": "Doe",
		"company": "",
		"address_1": "Hello street",
		"address_2": "",
		"city": "beverly hills",
		"state": "CA",
		"postcode": "90211",
		"country": "US",
		"phone": "123456778"
	},
	"billing_address": {
		"first_name": "John",
		"last_name": "Doe",
		"company": "",
		"address_1": "Hello street",
		"address_2": "",
		"city": "beverly hills",
		"state": "CA",
		"postcode": "90211",
		"country": "US",
		"email": "checkout@templates.com",
		"phone": "123456778"
	},
	"needs_payment": true,
	"needs_shipping": true,
	"payment_requirements": [ "products" ],
	"has_calculated_shipping": true,
	"shipping_rates": [
		{
			"package_id": 0,
			"name": "Shipment 1",
			"destination": {
				"address_1": "Hello street",
				"address_2": "",
				"city": "beverly hills",
				"state": "CA",
				"postcode": "90211",
				"country": "US"
			},
			"items": [
				{
					"key": "a5771bce93e200c36f7cd9dfd0e5deaa",
					"name": "Beanie with Logo",
					"quantity": 1
				},
				{
					"key": "b6d767d2f8ed5d21a44b0e5886680cb9",
					"name": "Belt",
					"quantity": 1
				}
			],
			"shipping_rates": [
				{
					"rate_id": "flat_rate:10",
					"name": "Flat rate",
					"description": "",
					"delivery_time": "",
					"price": "1300",
					"taxes": "130",
					"instance_id": 10,
					"method_id": "flat_rate",
					"meta_data": [
						{
							"key": "Items",
							"value": "Beanie with Logo &times; 1, Belt &times; 1"
						}
					],
					"selected": true,
					"currency_code": "USD",
					"currency_symbol": "$",
					"currency_minor_unit": 2,
					"currency_decimal_separator": ".",
					"currency_thousand_separator": ",",
					"currency_prefix": "$",
					"currency_suffix": ""
				},
				{
					"rate_id": "free_shipping:12",
					"name": "Free shipping",
					"description": "",
					"delivery_time": "",
					"price": "0",
					"taxes": "0",
					"instance_id": 12,
					"method_id": "free_shipping",
					"meta_data": [
						{
							"key": "Items",
							"value": "Beanie with Logo &times; 1, Belt &times; 1"
						}
					],
					"selected": false,
					"currency_code": "USD",
					"currency_symbol": "$",
					"currency_minor_unit": 2,
					"currency_decimal_separator": ".",
					"currency_thousand_separator": ",",
					"currency_prefix": "$",
					"currency_suffix": ""
				},
				{
					"rate_id": "local_pickup:13",
					"name": "Local pickup",
					"description": "",
					"delivery_time": "",
					"price": "0",
					"taxes": "0",
					"instance_id": 13,
					"method_id": "local_pickup",
					"meta_data": [
						{
							"key": "Items",
							"value": "Beanie with Logo &times; 1, Belt &times; 1"
						}
					],
					"selected": false,
					"currency_code": "USD",
					"currency_symbol": "$",
					"currency_minor_unit": 2,
					"currency_decimal_separator": ".",
					"currency_thousand_separator": ",",
					"currency_prefix": "$",
					"currency_suffix": ""
				}
			]
		}
	],
	"items_count": 2,
	"items_weight": 0,
	"cross_sells": [],
	"errors": [],
	"payment_methods": [ "bacs", "cod" ],
	"extensions": {}
}
```

### エラー・レスポンス

カートのアクションが実行できない場合、エラー・レスポンスが返されます。これには理由コードとエラーメッセージが含まれます：

```json
{
	"code": "woocommerce_rest_cart_invalid_product",
	"message": "This product cannot be added to the cart.",
	"data": {
		"status": 400
	}
}
```

エラーレスポンスの中には、アイテムが見つからない場合やクーポンが適用されなくなった場合など、コンフリクト（エラー409）を示すものもあります。このタイプのレスポンスが返された場合、サーバーからのカートの現在の状態もエラーデータの一部として返されます：

```json
{
  "code": "woocommerce_rest_cart_invalid_key",
  "message": "Cart item no longer exists or is invalid.",
  "data": {
    "status": 409,
    "cart": { ... }
  }
}
```

これにより、カートが変更されたり古くなったりした場合でも、クライアントは追加リクエストなしでカートデータと同期を保つことができます。

## アイテムを追加

カートに商品を追加し、カートの全レスポンス、またはエラーを返す。

有効な[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)が提供されない限り、このエンドポイントはエラーを返します。

```http
POST /cart/add-item
```

| 属性｜タイプ｜必須｜説明
| :---------- | :------ | :------:| :---------------------------------------------------------------------------------------------------------------------------------------- |
| `id` | integer | Yes | カートアイテムの商品IDまたはバリエーションID。                                                                                                    |
| `quantity` | integer | Yes | カート内のこのアイテムの数量。                                                                                                        |
| `variation` | 配列 | はい | `attribute` および `value` をキーとするオブジェクトの配列を含む選択属性 (バリエーション用)。以下の属性名の付け方についての注意を参照のこと。|

```sh
curl --header "Nonce: 12345" --request POST https://example-store.com/wp-json/wc/store/v1/cart/add-item?id=100&quantity=1
```

成功した場合は完全な[カートレスポンス](#cart-response)を、失敗した場合は[エラーレスポンス](#error-response)を返します。

`CartController::add_to_cart`に渡される前にカートアイテムのデータを追加したい場合は、[`woocommerce_store_api_add_to_cart_data`](https://github.com/woocommerce/woocommerce-blocks/blob/4d1c295a2bace9a4f6397cfd5469db31083d477a/docs/third-party-developers/extensibility/hooks/filters.md#woocommerce_store_api_add_to_cart_data)フィルタを使用します。例えば

```php
add_filter( 'woocommerce_store_api_add_to_cart_data', function( $add_to_cart_data, \WP_REST_Request $request ) {
	if ( ! empty( $request['custom-request-param'] ) ) {
		$add_to_cart_data['cart_item_data']['custom-request-data'] = sanitize_text_field( $request['custom-request-param'] );
	}
	return $add_to_cart_data;
}, 10, 2 );
```

*変動属性の命名：***。

バリエーションをカートに追加する場合、属性の名前は重要です。

グローバル属性の場合、APIに投稿される属性は属性のスラッグでなければなりません。これは`pa_`という接頭辞を持つ必要があります。例えば、`Color`という名前の属性がある場合、スラッグは`pa_color`となります。

製品固有の属性の場合、APIに投稿される属性は以下のいずれかになります：

- は属性の名前です。例えば、`Size`という属性の場合、`Size`となります。これは大文字と小文字を区別します。
- 属性のスラッグ。例えば、`Autograph ✏️`という属性の場合、`attribute_autograph-%e2%9c%8f%ef%b8%8f`となります。これは大文字と小文字を区別します。このスラッグは、商品ページの関連する`select`から取得できます。

**POSTボディの例:**。

```json
{
	"id": 13,
	"quantity": 1,
	"variation": [
		{
			"attribute": "pa_color",
			"value": "blue"
		},
		{
			"attribute": "attribute_autograph-%e2%9c%8f%ef%b8%8f",
			"value": "Yes"
		},
		{
			"attribute": "Logo",
			"value": "Yes"
		}
	]
}
```

上記の例では、サイズと色の属性を持つ商品のバリエーションをカートに追加しています。

**バッチ処理

一度に複数のアイテムを追加したい場合は、バッチエンドポイントを使用する必要があります：

```http
POST /wc/store/v1/batch
```

複数のアイテムをカートに追加するためのJSONペイロードは次のようになります：

```json
{
	"requests": [
		{
			"path": "/wc/store/v1/cart/add-item",
			"method": "POST",
			"cache": "no-store",
			"body": {
				"id": 26,
				"quantity": 1
			},
			"headers": {
				"Nonce": "1db1d13784"
			}
		},
		{
			"path": "/wc/store/v1/cart/add-item",
			"method": "POST",
			"cache": "no-store",
			"body": {
				"id": 27,
				"quantity": 1
			},
			"headers": {
				"Nonce": "1db1d13784"
			}
		}
	]
}
```

## アイテムを削除

カートから商品を取り除き、カートの全レスポンス、またはエラーを返す。

有効な[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)が提供されない限り、このエンドポイントはエラーを返します。

```http
POST /cart/remove-item
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :----- | :------:| :-------------------------------- |
| 編集するカートアイテムのキー。|

```sh
curl --header "Nonce: 12345" --request POST https://example-store.com/wp-json/wc/store/v1/cart/remove-item?key=e369853df766fa44e1ed0ff613f563bd
```

成功した場合は完全な[カートレスポンス](#cart-response)を、失敗した場合は[エラーレスポンス](#error-response)を返します。

## アイテム更新

カート内の商品を更新し、カートの全レスポンス、またはエラーを返します。

有効な[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)が提供されない限り、このエンドポイントはエラーを返します。

```http
POST /cart/update-item
```

| 属性 | タイプ | 必須 | 説明 |
| :--------- | :------ | :------:| :--------------------------------- |
| 編集するカートアイテムのキー。  |
| `quantity`｜整数｜はい｜カート内のこのアイテムの数量。|

```sh
curl --header "Nonce: 12345" --request POST https://example-store.com/wp-json/wc/store/v1/cart/update-item?key=e369853df766fa44e1ed0ff613f563bd&quantity=10
```

成功した場合は完全な[カートレスポンス](#cart-response)を、失敗した場合は[エラーレスポンス](#error-response)を返します。

## クーポン適用

カートにクーポンを適用し、カートの全レスポンス、またはエラーを返す。

有効な[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)が提供されない限り、このエンドポイントはエラーを返します。

```http
POST /cart/apply-coupon/
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :----- | :------:| :--------------------------------------------- |
| カートに適用したいクーポンコード。|

```sh
curl --header "Nonce: 12345" --request POST https://example-store.com/wp-json/wc/store/v1/cart/apply-coupon?code=20off
```

成功した場合は完全な[カートレスポンス](#cart-response)を、失敗した場合は[エラーレスポンス](#error-response)を返します。

## クーポンの削除

カートからクーポンを削除し、カートの全レスポンス、またはエラーを返します。

有効な[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)が提供されない限り、このエンドポイントはエラーを返します。

```http
POST /cart/remove-coupon/
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :----- | :------:| :------------------------------------------------ |
| カートから削除したいクーポンコード。|

```sh
curl --header "Nonce: 12345" --request POST https://example-store.com/wp-json/wc/store/v1/cart/remove-coupon?code=20off
```

成功した場合は完全な[カートレスポンス](#cart-response)を、失敗した場合は[エラーレスポンス](#error-response)を返します。

## 顧客を更新

顧客データを更新し、カートの全レスポンス、またはエラーを返します。

有効な[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)が提供されない限り、このエンドポイントはエラーを返します。

```http
POST /cart/update-customer
```

| 属性 | タイプ | 必須 | 説明 |
| :---------------------------- | :----- | :------:| :--------------------------------------------------------------------------------------- |
|`billing_address` | object | no｜顧客の請求先住所。                                                                |
| 顧客のファーストネーム。                                                                     |
| `billing_address.last_name` | string | no | 顧客の姓。                                                                      |
| `billing_address.address_1` | string | no | 発送先住所の1行目。                                              |
| `billing_address.address_2` | string | no | 発送先の住所の2行目。                                             |
| `billing_address.city` | string | no | 発送先の市町村名。                                                    |
| `billing_address.state`       | string |    no    | ISO code, or name, for the state, province, or district of the address being shipped to.|
| 配送先住所の郵便番号または郵便番号。                                         |
| 配送先の国のISOコード。                                |
| `billing_address.email` | string | no | 顧客のEメール。                                                                  |
| `billing_address.phone` | string | no | お客様の電話番号。                                                            |
| 顧客の配送先住所。                                                               |
| 顧客のファーストネーム。                                                                     |
| `shipping_address.last_name` | string | no | 顧客姓名。                                                                      |
| `shipping_address.address_1` | string | no | 発送先住所の一行目。                                              |
| `shipping_address.address_2` | string | no | 発送先の住所の2行目。                                             |
| `shipping_address.city` | string | no | 発送先の市町村名。                                                    |
| 配送先住所の州、県、または地区のISOコード、またはその名前。|
| 配送先住所の郵便番号または郵便番号。                                         |
| 配送先の国のISOコード。                                |

成功した場合は完全な[カートレスポンス](#cart-response)を、失敗した場合は[エラーレスポンス](#error-response)を返します。

## 送料を選択してください

荷物に利用可能な配送料金を選択し、カートの全レスポンス、またはエラーを返します。

有効な[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)が提供されない限り、このエンドポイントはエラーを返します。

```http
POST /cart/select-shipping-rate
```

| 属性 | タイプ | 必須 | 説明 |
| :----------- | :------ | :------:| :---------------------------------------------- |
| `package_id` | integer | yes | カート内の配送パッケージのID。|
| `rate_id` | string | yes | パッケージの選択された料金ID。             |

```sh
curl --header "Nonce: 12345" --request POST /cart/select-shipping-rate?package_id=1&rate_id=flat_rate:1
```

成功した場合は完全な[カートレスポンス](#cart-response)を、失敗した場合は[エラーレスポンス](#error-response)を返します。
