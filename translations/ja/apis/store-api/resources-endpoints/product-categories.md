# 商品カテゴリーAPI 

## 商品カテゴリー一覧

```http
GET /products/categories
```

このエンドポイントに必要なパラメータはない。

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
