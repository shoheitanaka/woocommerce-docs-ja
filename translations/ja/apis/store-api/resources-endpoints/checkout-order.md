# チェックアウト注文API 

チェックアウト注文APIは、既存の注文の処理と支払いの処理を容易にします。

すべてのチェックアウト注文エンドポイントは[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)を必要とし、そうでなければこれらのエンドポイントはエラーを返します。

## 注文と支払いを処理する

最終的に選択された支払い方法と追加の支払いデータを受け入れ、支払いを試み、その結果を返す。
結果を返します。

```http
POST /wc/store/v1/checkout/{ORDER_ID}
```

| 属性 | タイプ | 必須 | 説明 |
| :----------------- | :----- | :------:| :------------------------------------------------------------------ |
| `key` | string | はい｜注文検証のためのキー。                                 |
| `billing_email`｜文字列｜いいえ｜ゲスト注文の確認に使用されるEメールアドレス。                      |
| `billing_address`｜オブジェクト｜はい｜顧客の請求先住所データを更新したオブジェクト。            |
| `shipping_address`｜オブジェクト｜はい｜顧客の更新された配送先住所データのオブジェクト。           |
| 決済処理に使用される支払い方法の ID。     |
| `payment_data` | array | No | 決済処理時に支払いメソッドに渡すデータ。|

```sh
curl --header "Nonce: 12345" --request POST https://example-store.com/wp-json/wc/store/v1/checkout/{ORDER_ID} -d '{"key":"wc_order_oFmQYREzh9Tfv","billing_email":"admin@example.com","payment_method":"cheque","billing_address":{...},"shipping_address":{...}'
```

**リクエスト例

```json
{
	"key": "wc_order_oFmQYREzh9Tfv",
	"billing_email": "admin@example.com",
	"billing_address": {
		"first_name": "Peter",
		"last_name": "Venkman",
		"company": "",
		"address_1": "550 Central Park West",
		"address_2": "Corner Penthouse Spook Central",
		"city": "New York",
		"state": "NY",
		"postcode": "10023",
		"country": "US",
		"email": "admin@example.com",
		"phone": "555-2368"
	},
	"shipping_address": {
		"first_name": "Peter",
		"last_name": "Venkman",
		"company": "",
		"address_1": "550 Central Park West",
		"address_2": "Corner Penthouse Spook Central",
		"city": "New York",
		"state": "NY",
		"postcode": "10023",
		"country": "US",
		"phone": "555-2368"
	},
	"payment_method": "cheque",
	"payment_data": []
}
```

**回答例

```json
{
	"order_id": 146,
	"status": "on-hold",
	"order_key": "wc_order_oFmQYREzh9Tfv",
	"customer_note": "",
	"customer_id": 1,
	"billing_address": {
		"first_name": "Peter",
		"last_name": "Venkman",
		"company": "",
		"address_1": "550 Central Park West",
		"address_2": "Corner Penthouse Spook Central",
		"city": "New York",
		"state": "NY",
		"postcode": "10023",
		"country": "US",
		"email": "admin@example.com",
		"phone": "555-2368"
	},
	"shipping_address": {
		"first_name": "Peter",
		"last_name": "Venkman",
		"company": "",
		"address_1": "550 Central Park West",
		"address_2": "Corner Penthouse Spook Central",
		"city": "New York",
		"state": "NY",
		"postcode": "10023",
		"country": "US",
		"phone": "555-2368"
	},
	"payment_method": "cheque",
	"payment_result": {
		"payment_status": "success",
		"payment_details": [],
		"redirect_url": "https://local.wordpress.test/block-checkout/order-received/146/?key=wc_order_VPffqyvgWVqWL"
	}
}
```

## 支払データ

マーチャントが使用できる決済ゲートウェイは数多くあり、それぞれが異なる`payment_data`を要求します。すべてのペイメントゲートウェイに対して期待されるすべてのリクエストを包括的にリストアップすることはできませんので、ペイメントゲートウェイプラグインの作者に問い合わせることをお勧めします。

WooCommerce [Stripeペイメントゲートウェイ](https://wordpress.org/plugins/woocommerce-gateway-stripe/)を使用する際にチェックアウトオーダーエンドポイントに送信される支払いデータの例を以下に示します。

`stripe_source`の生成に関する詳細は、[Stripeのドキュメント](https://stripe.com/docs)を参照してください。

```json
{
	"payment_data": [
		{
			"key": "stripe_source",
			"value": "src_xxxxxxxxxxxxx"
		},
		{
			"key": "billing_email",
			"value": "myemail@email.com"
		},
		{
			"key": "billing_first_name",
			"value": "Jane"
		},
		{
			"key": "billing_last_name",
			"value": "Doe"
		},
		{
			"key": "paymentMethod",
			"value": "stripe"
		},
		{
			"key": "paymentRequestType",
			"value": "cc"
		},
		{
			"key": "wc-stripe-new-payment-method",
			"value": true
		}
	]
}
```
