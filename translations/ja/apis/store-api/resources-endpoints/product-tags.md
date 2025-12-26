# 商品タグAPI 

## 商品タグ一覧

```http
GET /products/tags
```

このエンドポイントに必要なパラメータはない。

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/tags"
```

回答例

```json
[
	{
		"id": 1,
		"name": "Test Tag",
		"slug": "test-tag",
		"description": "",
		"parent": 0,
		"count": 1
	},
	{
		"id": 2,
		"name": "Another Tag",
		"slug": "another-tag",
		"description": "",
		"parent": 0,
		"count": 1
	}
]
```
