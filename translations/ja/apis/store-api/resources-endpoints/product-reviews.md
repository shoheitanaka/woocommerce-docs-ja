# 製品レビューAPI 

## 商品レビュー一覧

このエンドポイントは、商品のレビュー（コメント）を返し、特定の商品や特定のカテゴリーの結果を表示することもできます。

```http
GET /products/reviews
GET /products/reviews?category_id=1,2,3
GET /products/reviews?product_id=1,2,3
GET /products/reviews?orderby=rating&order=desc
```

| 属性 | タイプ | 必須 | 説明 |
| :------------ | :------ | :------:| :-------------------------------------------------------------------------------------------------- |
| `page` | integer | no | コレクションの現在のページ。                                                                     |
| `per_page` | integer | no | 結果セットで返されるアイテムの最大数。空白の場合、デフォルトは無制限。           |
| `offset` | integer | no | 結果セットを特定のアイテム数だけオフセットします。                                                |
| `order` | string | no | ソート属性の昇順または降順。許可される値：指定可能な値: `asc`, `desc` | ソート・アトリビュートの昇順または降順。
| `orderby` | string | no | オブジェクト属性でコレクションをソートします。許可される値：`date`、 `date_gmt`、 `id`、 `rating`、 `product`｜。
| `category_id`｜文字列｜いいえ｜特定のカテゴリーIDのレビューに結果を限定します。                                             |
| `product_id` | string | no | 特定の商品IDのレビューに結果を限定する。                                              |

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/collection-data?calculate_price_range=true&calculate_attribute_counts=pa_size,pa_color&calculate_rating_counts=true"
```

**回答例

```json
[
	{
		"id": 83,
		"date_created": "2022-01-12T15:42:14",
		"formatted_date_created": "January 12, 2022",
		"date_created_gmt": "2022-01-12T15:42:14",
		"product_id": 33,
		"product_name": "Beanie with Logo",
		"product_permalink": "https://store.local/product/beanie-with-logo/",
		"product_image": {
			"id": 56,
			"src": "https://store.local/wp-content/uploads/2021/11/beanie-with-logo-1.jpg",
			"thumbnail": "https://store.local/wp-content/uploads/2021/11/beanie-with-logo-1-324x324.jpg",
			"srcset": "https://store.local/wp-content/uploads/2021/11/beanie-with-logo-1.jpg 800w, https://store.local/wp-content/uploads/2021/11/beanie-with-logo-1-324x324.jpg 324w, https://store.local/wp-content/uploads/2021/11/beanie-with-logo-1-100x100.jpg 100w, https://store.local/wp-content/uploads/2021/11/beanie-with-logo-1-416x416.jpg 416w, https://store.local/wp-content/uploads/2021/11/beanie-with-logo-1-300x300.jpg 300w, https://store.local/wp-content/uploads/2021/11/beanie-with-logo-1-150x150.jpg 150w, https://store.local/wp-content/uploads/2021/11/beanie-with-logo-1-768x768.jpg 768w",
			"sizes": "(max-width: 800px) 100vw, 800px",
			"name": "beanie-with-logo-1.jpg",
			"alt": ""
		},
		"reviewer": "reviewer-name",
		"review": "<p>This is a fantastic product.</p>\n",
		"rating": 5,
		"verified": true,
		"reviewer_avatar_urls": {
			"24": "https://secure.gravatar.com/avatar/12345?s=24&d=mm&r=g",
			"48": "https://secure.gravatar.com/avatar/12345?s=48&d=mm&r=g",
			"96": "https://secure.gravatar.com/avatar/12345?s=96&d=mm&r=g"
		}
	}
]
```
