# 商品属性条件API

```http
GET /products/attributes/:id/terms
GET /products/attributes/:id/terms?orderby=slug
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :------ | :------:|:--------------------------------------------------------------------------------------------------------------|
|`id` | integer | Yes | 条件を検索する属性のID。                                                                |
| `order`｜文字列｜いいえ｜昇順または降順。許可される値：`asc`、`desc`。
| `orderby` | string | no | オブジェクトの属性でコレクションをソートします。許可される値：`id`, `name`, `name_num`, `slug`, `count`, `menu_order`.|

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/attributes/1/terms"
```

**回答例

```json
[
	{
		"id": 22,
		"name": "Blue",
		"slug": "blue",
		"count": 5
	},
	{
		"id": 48,
		"name": "Burgundy",
		"slug": "burgundy",
		"count": 1
	}
]
```
