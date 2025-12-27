# 商品カテゴリーAPI 

## 商品カテゴリー一覧

```http
GET /products/categories
```

| 属性 | タイプ | 必須 | 説明 |
| :----------- | :------ | :------:| :-------------------------------------------------------------------------------------------------------------------- |
| `context` | string | No | リクエストが行われるスコープ。                                         |
| `page` | integer | No | コレクションの現在のページ。デフォルトは `1` です。                                                                      |
| `per_page` | integer | No | 結果セットで返すアイテムの最大数。デフォルトは制限なし。`0` から `100` までの値が使用可能です。|
| `search` | string | No | 結果を文字列にマッチするものに限定する。                                                                             |
| `exclude` | array | No | 結果セットが特定のIDを除外するようにする。                                                                              |
| `include` | array | No | 結果を特定のIDに限定する。                                                                                     |
| `order`｜文字列｜いいえ｜昇順または降順に並べ替えます。許容される値：`asc`, `desc`.デフォルトは `asc` です。                                       |
| 指定可能な値： `orderby` | string | いいえ。許可される値：`name`、`slug`、`count`。デフォルトは`name`です。                                   |
| `hide_empty` | boolean | No | trueの場合、空の用語は返されません。デフォルトは`true`です。                                                        |
| `parent`｜整数｜いいえ｜結果を特定の親IDを持つものに限定します。                                                                     |

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/categories"
```

回答例

```json
[
	{
		"id": 16,
		"name": "Clothing",
		"slug": "clothing",
		"description": "This is the clothing category.",
		"parent": 0,
		"count": 11,
		"image": {
			"id": 55,
			"src": "https://store.local/wp-content/uploads/2021/11/t-shirt-with-logo-1.jpg",
			"thumbnail": "https://store.local/wp-content/uploads/2021/11/t-shirt-with-logo-1-324x324.jpg",
			"srcset": "https://store.local/wp-content/uploads/2021/11/t-shirt-with-logo-1.jpg 800w, https://store.local/wp-content/uploads/2021/11/t-shirt-with-logo-1-324x324.jpg 324w, https://store.local/wp-content/uploads/2021/11/t-shirt-with-logo-1-100x100.jpg 100w, https://store.local/wp-content/uploads/2021/11/t-shirt-with-logo-1-416x416.jpg 416w, https://store.local/wp-content/uploads/2021/11/t-shirt-with-logo-1-300x300.jpg 300w, https://store.local/wp-content/uploads/2021/11/t-shirt-with-logo-1-150x150.jpg 150w, https://store.local/wp-content/uploads/2021/11/t-shirt-with-logo-1-768x768.jpg 768w",
			"sizes": "(max-width: 800px) 100vw, 800px",
			"name": "t-shirt-with-logo-1.jpg",
			"alt": ""
		},
		"review_count": 2,
		"permalink": "https://store.local/product-category/clothing/"
	},
	{
		"id": 21,
		"name": "Decor",
		"slug": "decor",
		"description": "",
		"parent": 0,
		"count": 1,
		"image": null,
		"review_count": 1,
		"permalink": "https://store.local/product-category/decor/"
	}
]
```

## 単一製品カテゴリー

単一のカテゴリーを取得する。

```http
GET /products/categories/:id
```

| カテゴリー｜タイプ｜必須｜説明
| :------- | :------ | :------:| :---------------------------------- |
| `id` | integer | Yes | 検索するカテゴリのID。|

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/categories/1"
```

**回答例

```json
{
	"id": 1,
	"name": "Decor",
	"slug": "decor",
	"description": "",
	"parent": 0,
	"count": 1,
	"image": null,
	"review_count": 1,
	"permalink": "https://store.local/product-category/decor/"
}
```
