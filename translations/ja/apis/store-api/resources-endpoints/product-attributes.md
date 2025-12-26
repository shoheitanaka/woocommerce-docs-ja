# 商品属性API 

## 商品属性一覧

```http
GET /products/attributes
```

このエンドポイントに必要なパラメータはない。

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/attributes"
```

回答例

```json
[
	{
		"id": 1,
		"name": "Color",
		"taxonomy": "pa_color",
		"type": "select",
		"order": "menu_order",
		"has_archives": false
	},
	{
		"id": 2,
		"name": "Size",
		"taxonomy": "pa_size",
		"type": "select",
		"order": "menu_order",
		"has_archives": false
	}
]
```

## 単一製品属性

単一属性のタクソノミーを取得します。

```http
GET /products/attributes/:id
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :------ | :------:| :----------------------------------- |
| `id`｜ integer｜ Yes｜ 取得する属性の ID。|

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/attributes/1"
```

**回答例

```json
{
	"id": 1,
	"name": "Color",
	"taxonomy": "pa_color",
	"type": "select",
	"order": "menu_order",
	"has_archives": false
}
```
