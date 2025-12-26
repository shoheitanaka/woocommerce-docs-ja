# カートアイテム API

## カートアイテム一覧

```http
GET /cart/items
```

このエンドポイントを使用するために必要な追加パラメータはありません。

```sh
curl "https://example-store.com/wp-json/wc/store/v1/cart/items"
```

**回答例

```json
[
	{
		"key": "c74d97b01eae257e44aa9d5bade97baf",
		"id": 16,
		"quantity": 1,
		"type": "simple",
		"quantity_limits": {
			"minimum": 1,
			"maximum": 1,
			"multiple_of": 1,
			"editable": false
		},
		"name": "Beanie",
		"short_description": "<p>This is a simple product.</p>",
		"description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>",
		"sku": "woo-beanie",
		"low_stock_remaining": null,
		"backorders_allowed": false,
		"show_backorder_badge": false,
		"sold_individually": true,
		"permalink": "https://store.local/product/beanie/",
		"images": [
			{
				"id": 45,
				"src": "https://store.local/wp-content/uploads/2023/01/beanie-2.jpg",
				"thumbnail": "https://store.local/wp-content/uploads/2023/01/beanie-2-450x450.jpg",
				"srcset": "https://store.local/wp-content/uploads/2023/01/beanie-2.jpg 801w, https://store.local/wp-content/uploads/2023/01/beanie-2-450x450.jpg 450w, https://store.local/wp-content/uploads/2023/01/beanie-2-100x100.jpg 100w, https://store.local/wp-content/uploads/2023/01/beanie-2-600x600.jpg 600w, https://store.local/wp-content/uploads/2023/01/beanie-2-300x300.jpg 300w, https://store.local/wp-content/uploads/2023/01/beanie-2-150x150.jpg 150w, https://store.local/wp-content/uploads/2023/01/beanie-2-768x768.jpg 768w",
				"sizes": "(max-width: 801px) 100vw, 801px",
				"name": "beanie-2.jpg",
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
			"line_subtotal_tax": "360",
			"line_total": "1800",
			"line_total_tax": "360",
			"currency_code": "USD",
			"currency_symbol": "$",
			"currency_minor_unit": 2,
			"currency_decimal_separator": ".",
			"currency_thousand_separator": ",",
			"currency_prefix": "$",
			"currency_suffix": ""
		},
		"catalog_visibility": "visible",
		"extensions": {},
		"_links": {
			"self": [
				{
					"href": "https://store.local/wp-json/wc/store/v1/cart/items/c74d97b01eae257e44aa9d5bade97baf"
				}
			],
			"collection": [
				{
					"href": "https://store.local/wp-json/wc/store/v1/cart/items"
				}
			]
		}
	},
	{
		"key": "e03e407f41901484125496b5ec69a76f",
		"id": 29,
		"quantity": 1,
		"type": "variation",
		"quantity_limits": {
			"minimum": 1,
			"maximum": 9999,
			"multiple_of": 1,
			"editable": true
		},
		"name": "Hoodie",
		"short_description": "",
		"description": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sagittis orci ac odio dictum tincidunt. Donec ut metus leo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed luctus, dui eu sagittis sodales, nulla nibh sagittis augue, vel porttitor diam enim non metus. Vestibulum aliquam augue neque. Phasellus tincidunt odio eget ullamcorper efficitur. Cras placerat ut turpis pellentesque vulputate. Nam sed consequat tortor. Curabitur finibus sapien dolor. Ut eleifend tellus nec erat pulvinar dignissim. Nam non arcu purus. Vivamus et massa massa.</p>",
		"sku": "woo-hoodie-red",
		"low_stock_remaining": null,
		"backorders_allowed": false,
		"show_backorder_badge": false,
		"sold_individually": false,
		"permalink": "https://store.local/product/hoodie/?attribute_pa_color=red&attribute_logo=No",
		"images": [
			{
				"id": 40,
				"src": "https://store.local/wp-content/uploads/2023/01/hoodie-2.jpg",
				"thumbnail": "https://store.local/wp-content/uploads/2023/01/hoodie-2-450x450.jpg",
				"srcset": "https://store.local/wp-content/uploads/2023/01/hoodie-2.jpg 801w, https://store.local/wp-content/uploads/2023/01/hoodie-2-450x450.jpg 450w, https://store.local/wp-content/uploads/2023/01/hoodie-2-100x100.jpg 100w, https://store.local/wp-content/uploads/2023/01/hoodie-2-600x600.jpg 600w, https://store.local/wp-content/uploads/2023/01/hoodie-2-300x300.jpg 300w, https://store.local/wp-content/uploads/2023/01/hoodie-2-150x150.jpg 150w, https://store.local/wp-content/uploads/2023/01/hoodie-2-768x768.jpg 768w",
				"sizes": "(max-width: 801px) 100vw, 801px",
				"name": "hoodie-2.jpg",
				"alt": ""
			}
		],
		"variation": [
			{
				"raw_attribute": "attribute_pa_color",
				"attribute": "Color",
				"value": "Red"
			},
			{
				"raw_attribute": "attribute_logo",
				"attribute": "Logo",
				"value": "No"
			}
		],
		"item_data": [],
		"prices": {
			"price": "4200",
			"regular_price": "4500",
			"sale_price": "4200",
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
				"price": "42000000",
				"regular_price": "45000000",
				"sale_price": "42000000"
			}
		},
		"totals": {
			"line_subtotal": "4200",
			"line_subtotal_tax": "840",
			"line_total": "4200",
			"line_total_tax": "840",
			"currency_code": "USD",
			"currency_symbol": "$",
			"currency_minor_unit": 2,
			"currency_decimal_separator": ".",
			"currency_thousand_separator": ",",
			"currency_prefix": "$",
			"currency_suffix": ""
		},
		"catalog_visibility": "visible",
		"extensions": {},
		"_links": {
			"self": [
				{
					"href": "https://store.local/wp-json/wc/store/v1/cart/items/e03e407f41901484125496b5ec69a76f"
				}
			],
			"collection": [
				{
					"href": "https://store.local/wp-json/wc/store/v1/cart/items"
				}
			]
		}
	}
]
```

## シングルカート商品

カートの項目をキーで取得します。

```http
GET /cart/items/:key
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :----- | :------:| :------------------------------------ |
| `key` | string | はい | 検索するカートアイテムのキー。|

```sh
curl "https://example-store.com/wp-json/wc/store/v1/cart/items/c74d97b01eae257e44aa9d5bade97baf"
```

**回答例

```json
{
	"key": "c74d97b01eae257e44aa9d5bade97baf",
	"id": 16,
	"quantity": 1,
	"quantity_limits": {
		"minimum": 1,
		"maximum": 1,
		"multiple_of": 1,
		"editable": false
	},
	"name": "Beanie",
	"short_description": "<p>This is a simple product.</p>",
	"description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>",
	"sku": "woo-beanie",
	"low_stock_remaining": null,
	"backorders_allowed": false,
	"show_backorder_badge": false,
	"sold_individually": true,
	"permalink": "https://store.local/product/beanie/",
	"images": [
		{
			"id": 45,
			"src": "https://store.local/wp-content/uploads/2023/01/beanie-2.jpg",
			"thumbnail": "https://store.local/wp-content/uploads/2023/01/beanie-2-450x450.jpg",
			"srcset": "https://store.local/wp-content/uploads/2023/01/beanie-2.jpg 801w, https://store.local/wp-content/uploads/2023/01/beanie-2-450x450.jpg 450w, https://store.local/wp-content/uploads/2023/01/beanie-2-100x100.jpg 100w, https://store.local/wp-content/uploads/2023/01/beanie-2-600x600.jpg 600w, https://store.local/wp-content/uploads/2023/01/beanie-2-300x300.jpg 300w, https://store.local/wp-content/uploads/2023/01/beanie-2-150x150.jpg 150w, https://store.local/wp-content/uploads/2023/01/beanie-2-768x768.jpg 768w",
			"sizes": "(max-width: 801px) 100vw, 801px",
			"name": "beanie-2.jpg",
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
		"line_subtotal_tax": "360",
		"line_total": "1800",
		"line_total_tax": "360",
		"currency_code": "USD",
		"currency_symbol": "$",
		"currency_minor_unit": 2,
		"currency_decimal_separator": ".",
		"currency_thousand_separator": ",",
		"currency_prefix": "$",
		"currency_suffix": ""
	},
	"catalog_visibility": "visible",
	"extensions": {},
	"_links": {
		"self": [
			{
				"href": "https://store.local/wp-json/wc/store/v1/cart/items/(?P<key>[\\w-]{32})/c74d97b01eae257e44aa9d5bade97baf"
			}
		],
		"collection": [
			{
				"href": "https://store.local/wp-json/wc/store/v1/cart/items/(?P<key>[\\w-]{32})"
			}
		]
	}
}
```

## カートに入れる

カートに商品を追加する。追加された新しいカートアイテム、またはエラー応答を返します。

```http
POST /cart/items/
```

| 属性｜タイプ｜必須｜説明
| :---------- | :------ | :------:| :--------------------------------------------------------------------------------------------------- |
| `id` | integer | Yes | カートアイテムの商品IDまたはバリエーションID。                                                               |
| `quantity` | integer | Yes | カート内のこのアイテムの数量。                                                                   |
| `variation` | 配列 | はい | `attribute` および `value` をキーとするオブジェクトの配列を含む選択属性 (バリエーション用)。|

```sh
curl --request POST https://example-store.com/wp-json/wc/store/v1/cart/items?id=100&quantity=1
```

レスポンスの例については、[シングルカートアイテム](#single-cart-item)を参照してください。

一度に複数のアイテムをカートに追加したい場合は、[batching](/docs/apis/store-api/resources-endpoints/cart#add-item)をご覧ください。

## 単一カート商品の編集

カート内の商品を編集します。

```http
PUT /cart/items/:key
```

| 属性 | タイプ | 必須 | 説明 |
| :--------- | :------ | :------:| :--------------------------------- |
| 編集するカートアイテムのキー。  |
| `quantity`｜整数｜はい｜カート内のこのアイテムの数量。|

```sh
curl --request PUT https://example-store.com/wp-json/wc/store/v1/cart/items/e369853df766fa44e1ed0ff613f563bd?quantity=10
```

レスポンスの例については、[シングルカートアイテム](#single-cart-item)を参照してください。

## 単一カート商品の削除

カートから商品をキーで削除します。

```http
DELETE /cart/items/:key
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :----- | :------:| :-------------------------------- |
| 編集するカートアイテムのキー。|

```sh
curl --request DELETE https://example-store.com/wp-json/wc/store/v1/cart/items/e369853df766fa44e1ed0ff613f563bd
```

## すべてのカート商品を削除する

カートからすべての商品を一度に削除します。

```http
DELETE /cart/items/
```

このエンドポイントを使用するために必要な追加パラメータはありません。

```sh
curl --request DELETE https://example-store.com/wp-json/wc/store/v1/cart/items
```

**回答例

```json
[]
```
