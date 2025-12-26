# 商品収集データAPI

このエンドポイントを使うと、商品のコレクションから集計データを取得できます。例えば、商品のコレクションにおける最低価格と最高価格などです（ページネーションは無視します）。これは商品フィルタリングウィジェットのブロックで使用されます。

```http
GET /products/collection-data
GET /products/collection-data?calculate_price_range=true
GET /products/collection-data?calculate_attribute_counts[0][query_type]=or&calculate_attribute_counts[0][taxonomy]=pa_color
GET /products/collection-data?calculate_rating_counts=true
GET /products/collection-data?calculate_taxonomy_counts=product_cat
```

| 属性 | タイプ | 必須 | 説明 |
| :------------------------------ | :----- | :------:| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calculate_price_range` | bool | No | 商品コレクションの最低価格と最高価格を返します。falseの場合、`null`のみが返されます。                                                                                                          |
| `calculate_attribute_counts`｜object｜いいえ｜このパラメータで渡した属性タクソノミーのリストの属性カウントを返します。それぞれ、"taxonomy "と "query_type "をキーとするオブジェクトとして指定する必要があります。空の場合、`null`が返されます。|
|`calculate_rating_counts` | bool | No | 1〜5の平均評価を持つ商品の数を返します。falseの場合、`null`のみが返されます。                                                                                                 |
| `calculate_stock_status_counts`｜bool｜No｜ 各在庫ステータス（在庫あり、在庫切れ、バックオーダー中）の商品数を返します。falseの場合、`null`のみが返されます。                                                                         |
| `calculate_taxonomy_counts`｜ array｜ No｜このパラメータで渡したタクソノミーのリストに対するタクソノミーの数を返します。それぞれタクソノミー名の文字列で指定する必要があります。空の場合は`null`が返されます。                                 |

**上記の属性**に加え、すべての商品リスト属性がサポートされています。これにより、商品の特定のサブセットのデータを取得することができます。全リストは[products API list productsセクション](/docs/apis/store-api/resources-endpoints/products#list-products)を参照してください。

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/collection-data?calculate_price_range=true&calculate_attribute_counts=pa_size,pa_color&calculate_rating_counts=true&calculate_taxonomy_counts=product_cat,product_tag"
```

**回答例

```json
{
	"price_range": [
		"currency_minor_unit": 2,
		"min_price": "0",
		"max_price": "9000",
		"currency_code": "USD",
		"currency_decimal_separator": ".",
		"currency_minor_unit": 2,
		"currency_prefix": "$",
		"currency_suffix": "",
		"currency_symbol": "$",
		"currency_thousand_separator": ",",
	],
	"attribute_counts": [
		{
			"term": 22,
			"count": 4
		},
		{
			"term": 23,
			"count": 3
		},
		{
			"term": 24,
			"count": 4
		}
	],
	"rating_counts": [
		{
			"rating": 3,
			"count": 1
		},
		{
			"rating": 4,
			"count": 1
		}
	],
	"taxonomy_counts": [
		{
			"term": 25,
			"count": 8
		},
		{
			"term": 26,
			"count": 6
		},
		{
			"term": 27,
			"count": 2
		}
	]
}
```
