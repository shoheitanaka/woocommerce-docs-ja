# 製品API 

ストア商品APIは、クライアント側でレンダリングできるように、公開商品データを提供する。

## 商品一覧

```http
GET /products
GET /products?search=product%20name
GET /products?slug=slug-1,slug-2
GET /products?after=2017-03-22&date_column=date
GET /products?before=2017-03-22&date_column=date
GET /products?exclude=10,44,33
GET /products?include=10,44,33
GET /products?offset=10
GET /products?order=asc&orderby=price
GET /products?parent=10
GET /products?parent_exclude=10
GET /products?type=simple
GET /products?sku=sku-1,sku-2
GET /products?featured=true
GET /products?category=22
GET /products?brand=adidas
GET /products?_unstable_tax_my-taxonomy=my-taxonomy-term-id
GET /products?tag=special-items
GET /products?attributes[0][attribute]=pa_color&attributes[0][slug]=red
GET /products?on_sale=true
GET /products?min_price=5000
GET /products?max_price=10000
GET /products?stock_status=['outofstock']
GET /products?catalog_visibility=search
GET /products?rating=4,5
GET /products?return_price_range=true
GET /products?return_attribute_counts=pa_size,pa_color
GET /products?return_rating_counts=true
```

| 属性 | タイプ | 必須 | 説明 |
| :------------------------------------------ | :------ | :------:| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `search` | string | no | 結果を文字列に一致するものに制限します。                                                                                                                                                                                             |
| `slug`｜文字列｜no｜特定のスラッグを持つ商品に結果を限定します。カンマで区切る。                                                                                                                                                           |
| `after` | string | no | ISO8601に準拠した日付以降に作成されたリソースに限定する。                                                                                                                                                             |
| `before`                                    | string  |    no    | Limit response to resources created before a given ISO8601 compliant date.                                                                                                                                                            |
| `date_column` | string | no | after/beforeを使用してレスポンスを制限する場合、どの日付カラムと比較するか。許可される値：指定可能な値： `date`, `date_gmt`, `modified`, `modified_gmt` |.
| `exclude` | array | no | 結果セットが特定のIDを除外することを確認する。                                                                                                                                                                                              |
| `include` | array | no | 結果セットを特定のIDに制限する。                                                                                                                                                                                                     |
| `offset` | integer | no | 結果セットを特定のアイテム数だけオフセットする。                                                                                                                                                                                  |
| `order` | string | no | ソート属性の昇順または降順。許容される値：指定可能な値： `asc`, `desc`
| `orderby` | string | no | オブジェクト属性でコレクションをソートします。許可される値：`date`、 `modified`、 `id`、 `include`、 `title`、 `slug`、 `price`、 `popularity`、 `rating`、 `menu_order`、 `comment_count`｜。

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products"
```

| `parent`｜配列｜なし｜結果セットを特定の親IDのものに限定する。                                                                                                                                                                                   |
| `parent_exclude`｜配列｜no｜特定の親IDを除くすべてのアイテムに結果を限定する。                                                                                                                                                                 |
| `type`｜文字列｜no｜特定のタイプを割り当てられた商品に結果を限定する。                                                                                                                                                                                |
| `sku`｜文字列｜no｜特定のSKUを持つ商品に結果を限定する。カンマで区切ってください。                                                                                                                                                            |
| `featured` | boolean | no | 結果を特集商品に限定する。                                                                                                                                                                                                |
| `category` | string | no | カンマで区切って、カテゴリーIDまたはスラッグに割り当てられた商品に結果を限定する。                                                                                                                                                |
| `category_operator`｜文字列｜no｜商品カテゴリー用語を比較する演算子。許可される値：`in`、`not_in`、`and`。
| カンマで区切られたブランドIDまたはスラッグに割り当てられた製品に結果セットを制限する。                                                                                                                                                    |
| `brand_operator`｜文字列｜no｜商品ブランド用語を比較する演算子。許可される値：`in`、`not_in`、`and`。
| `_unstable_tax_[product-taxonomy]` | string | no | カスタム商品タクソノミーの用語IDに割り当てられた商品に結果セットを制限する。`[product-taxonomy]`は登録されたカスタム商品タクソノミーのキーでなければなりません。                                                               |
| `_unstable_tax_[product-taxonomy]_operator`｜文字列｜no｜カスタム商品タクソノミーの用語を比較する演算子。許可される値：`in`、`not_in`、`and`。
| `tag` | string | no | 特定のタグIDが割り当てられた商品に結果を限定する。                                                                                                                                                                              |

```json
[
	{
		"id": 34,
		"name": "WordPress Pennant",
		"slug": "wordpress-pennant",
		"variation": "",
		"permalink": "https://local.wordpress.test/product/wordpress-pennant/",
		"sku": "wp-pennant",
		"summary": "<p>This is an external product.</p>",
		"short_description": "<p>This is an external product.</p>",
		"description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>",
		"on_sale": false,
		"prices": {
			"currency_code": "GBP",
			"currency_symbol": "£",
			"currency_minor_unit": 2,
			"currency_decimal_separator": ".",
			"currency_thousand_separator": ",",
			"currency_prefix": "£",
			"currency_suffix": "",
			"price": "1105",
			"regular_price": "1105",
			"sale_price": "1105",
			"price_range": null
		},
		"average_rating": "0",
		"review_count": 0,
		"images": [
			{
				"id": 57,
				"src": "https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1.jpg",
				"thumbnail": "https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-324x324.jpg",
				"srcset": "https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1.jpg 800w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-324x324.jpg 324w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-100x100.jpg 100w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-416x416.jpg 416w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-300x300.jpg 300w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-150x150.jpg 150w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-768x768.jpg 768w",
				"sizes": "(max-width: 800px) 100vw, 800px",
				"name": "pennant-1.jpg",
				"alt": ""
			}
		],
		"has_options": false,
		"is_purchasable": true,
		"is_in_stock": true,
		"low_stock_remaining": null,
		"add_to_cart": {
			"text": "Add to cart",
			"description": "Add &ldquo;WordPress Pennant&rdquo; to your cart"
		}
	}
]
```

| `tag_operator`｜文字列｜ no｜商品タグを比較する演算子。許可される値：`in`、`not_in`、`and`。
| `on_sale` | boolean | no | 結果をセール中の商品に限定する。                                                                                                                                                                                                 |
| `min_price` | string | no | 通貨の最小単位で指定された最低価格に基づく商品に結果を限定する。例：100.25 USDの場合は10025を、1025 JPYの場合は1025を指定します。|
|`max_price` | string | no | 通貨の最小単位を使用して提供される、最大価格に基づく製品に結果セットを制限します。例：100.25米ドルには10025を、1025円には1025を指定します。|
| `stock_status`｜配列｜no｜結果セットを指定された在庫ステータスの商品に限定する。instock'、'outofstock'または'onbackorder'を含む文字列の配列を期待します。                                                                                          |
| `attributes` | array | no | 結果を特定の属性に限定します。`attribute` (タクソノミー)、 `term_id` または `slug` を含むオブジェクトの配列、および比較のための `operator` を期待します。                                                             |
| `attribute_relation`                        | string  |    no    | The logical relationship between attributes when filtering across multiple at once.                                                                                                                                                   |
| `catalog_visibility` | string | no | 非表示または表示されるカタログ商品を決定します。許可される値：許可される値：`any`、`visible`、`catalog`、`search`、`hidden`。
| `rating` | array | no | 結果を特定の平均評価を持つ商品に限定する。許可される値：指定可能な値： `1`, `2`, `3`, `4`, `5`.                                                                                                                                  |

**回答例

```http
GET /products/:id
```

## ID別単品

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/34"
```

idで単一商品を取得する。

```json
{
	"id": 34,
	"name": "WordPress Pennant",
	"slug": "wordpress-pennant",
	"variation": "",
	"permalink": "https://local.wordpress.test/product/wordpress-pennant/",
	"sku": "wp-pennant",
	"summary": "<p>This is an external product.</p>",
	"short_description": "<p>This is an external product.</p>",
	"description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>",
	"on_sale": false,
	"prices": {
		"currency_code": "GBP",
		"currency_symbol": "£",
		"currency_minor_unit": 2,
		"currency_decimal_separator": ".",
		"currency_thousand_separator": ",",
		"currency_prefix": "£",
		"currency_suffix": "",
		"price": "1105",
		"regular_price": "1105",
		"sale_price": "1105",
		"price_range": null
	},
	"average_rating": "0",
	"review_count": 0,
	"images": [
		{
			"id": 57,
			"src": "https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1.jpg",
			"thumbnail": "https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-324x324.jpg",
			"srcset": "https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1.jpg 800w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-324x324.jpg 324w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-100x100.jpg 100w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-416x416.jpg 416w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-300x300.jpg 300w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-150x150.jpg 150w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-768x768.jpg 768w",
			"sizes": "(max-width: 800px) 100vw, 800px",
			"name": "pennant-1.jpg",
			"alt": ""
		}
	],
	"has_options": false,
	"is_purchasable": true,
	"is_in_stock": true,
	"low_stock_remaining": null,
	"add_to_cart": {
		"text": "Add to cart",
		"description": "Add &ldquo;WordPress Pennant&rdquo; to your cart"
	}
}
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :------ | :------:| :--------------------------------- |
| `id` | integer | Yes | 検索する商品のID。|

**回答例

```http
GET /products/:slug
```

## スラッグ別単品

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/wordpress-pennant"
```

単一製品をスラッグで取得する。

```json
{
	"id": 34,
	"name": "WordPress Pennant",
	"slug": "wordpress-pennant",
	"variation": "",
	"permalink": "https://local.wordpress.test/product/wordpress-pennant/",
	"sku": "wp-pennant",
	"summary": "<p>This is an external product.</p>",
	"short_description": "<p>This is an external product.</p>",
	"description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>",
	"on_sale": false,
	"prices": {
		"currency_code": "GBP",
		"currency_symbol": "£",
		"currency_minor_unit": 2,
		"currency_decimal_separator": ".",
		"currency_thousand_separator": ",",
		"currency_prefix": "£",
		"currency_suffix": "",
		"price": "1105",
		"regular_price": "1105",
		"sale_price": "1105",
		"price_range": null
	},
	"average_rating": "0",
	"review_count": 0,
	"images": [
		{
			"id": 57,
			"src": "https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1.jpg",
			"thumbnail": "https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-324x324.jpg",
			"srcset": "https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1.jpg 800w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-324x324.jpg 324w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-100x100.jpg 100w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-416x416.jpg 416w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-300x300.jpg 300w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-150x150.jpg 150w, https://local.wordpress.test/wp-content/uploads/2020/03/pennant-1-768x768.jpg 768w",
			"sizes": "(max-width: 800px) 100vw, 800px",
			"name": "pennant-1.jpg",
			"alt": ""
		}
	],
	"has_options": false,
	"is_purchasable": true,
	"is_in_stock": true,
	"low_stock_remaining": null,
	"add_to_cart": {
		"text": "Add to cart",
		"description": "Add &ldquo;WordPress Pennant&rdquo; to your cart"
	}
}
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :----- | :------:| :----------------------------------- |
| `slug` | string | はい | 検索する商品のスラッグ。|

**回答例

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products?type=variation"
```
