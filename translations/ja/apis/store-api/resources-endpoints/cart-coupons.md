# カートクーポン API 

## カートクーポン一覧

```http
GET /cart/coupons
```

このエンドポイントに必要なパラメータはない。

```sh
curl "https://example-store.com/wp-json/wc/store/v1/cart/coupons"
```

**回答例

```json
[
	{
		"code": "20off",
		"type": "fixed_cart",
		"totals": {
			"currency_code": "GBP",
			"currency_symbol": "£",
			"currency_minor_unit": 2,
			"currency_decimal_separator": ".",
			"currency_thousand_separator": ",",
			"currency_prefix": "£",
			"currency_suffix": "",
			"total_discount": "1667",
			"total_discount_tax": "333"
		},
		"_links": {
			"self": [
				{
					"href": "http://local.wordpress.test/wp-json/wc/store/v1/cart/coupons/20off"
				}
			],
			"collection": [
				{
					"href": "http://local.wordpress.test/wp-json/wc/store/v1/cart/coupons"
				}
			]
		}
	}
]
```

## シングルカートクーポン

カート1回分のクーポンを取得する。

```http
GET /cart/coupons/:code
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :----- | :------:| :---------------------------------------------- |
| `code` | string | yes | 取得するカートクーポンのクーポンコード。|

```sh
curl "https://example-store.com/wp-json/wc/store/v1/cart/coupons/20off"
```

**回答例

```json
{
	"code": "halfprice",
	"type": "percent",
	"totals": {
		"currency_code": "GBP",
		"currency_symbol": "£",
		"currency_minor_unit": 2,
		"currency_decimal_separator": ".",
		"currency_thousand_separator": ",",
		"currency_prefix": "£",
		"currency_suffix": "",
		"total_discount": "9950",
		"total_discount_tax": "0"
	}
}
```

## カートにクーポンを追加

カートにクーポンを適用する。適用された新しいクーポンオブジェクト、または適用されなかった場合はエラーを返します。

```http
POST /cart/coupons/
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :----- | :------:| :--------------------------------------------- |
| カートに適用したいクーポンコード。|

```sh
curl --request POST https://example-store.com/wp-json/wc/store/v1/cart/coupons?code=20off
```

**回答例

```json
{
	"code": "20off",
	"type": "percent",
	"totals": {
		"currency_code": "GBP",
		"currency_symbol": "£",
		"currency_minor_unit": 2,
		"currency_decimal_separator": ".",
		"currency_thousand_separator": ",",
		"currency_prefix": "£",
		"currency_suffix": "",
		"total_discount": "1667",
		"total_discount_tax": "333"
	}
}
```

## シングルカート・クーポンの削除

カートからクーポンを削除する。

```http
DELETE /cart/coupons/:code
```

| 属性 | タイプ | 必須 | 説明 |
| :-------- | :----- | :------:| :------------------------------------------------ |
| カートから削除したいクーポンコード。|

```sh
curl --request DELETE https://example-store.com/wp-json/wc/store/v1/cart/coupons/20off
```

## すべてのカートクーポンを削除

カートからすべてのクーポンを削除する。

```http
DELETE /cart/coupons/
```

このエンドポイントに必要なパラメータはない。

```sh
curl --request DELETE https://example-store.com/wp-json/wc/store/v1/cart/coupons
```

**回答例

```json
[]
```
