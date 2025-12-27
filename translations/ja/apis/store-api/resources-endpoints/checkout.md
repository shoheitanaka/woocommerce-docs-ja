# チェックアウトAPI 

チェックアウトAPIは（現在のカートから）注文を作成し、支払い方法の支払いを処理することを容易にします。

全てのチェックアウトエンドポイントは[Nonce Token](/docs/apis/store-api/nonce-tokens)または[Cart Token](/docs/apis/store-api/cart-tokens)のどちらかを必要とします。そうでない場合、これらのエンドポイントはエラーを返します。

## チェックアウトデータを取得する

チェックアウトに必要なデータを返します。これには、下書き注文（現在のカートから作成）、顧客の請求先住所と配送先住所が含まれます。支払い情報は、POSTリクエストによって注文が更新されるとき（支払い処理の直前）にのみ永続化されるため、空になります。

```http
GET /wc/store/v1/checkout
```

このエンドポイントに必要なパラメータはない。

```sh
curl --header "Nonce: 12345" --request GET https://example-store.com/wp-json/wc/store/v1/checkout
```

### 回答例

```json
{
  "order_id": 146,
  "status": "checkout-draft",
  "order_key": "wc_order_VPffqyvgWVqWL",
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
    "country": "US"
  },
  "payment_method": "",
  "payment_result": {
    "payment_status": "",
    "payment_details": [],
    "redirect_url": ""
  }
}
```

## チェックアウトデータを更新する

このエンドポイントを使用すると、現在の注文のチェックアウトデータを更新することができます。これは、例えばチェックアウトフィールドを永続化するためにフロントエンドから呼び出すことができます。

```http
PUT /wc/store/v1/checkout?__experimental_calc_totals=true
```

`__experimental_calc_totals`パラメータに注意してください。これは、カート合計を再計算すべきかどうかを決定するために使用されます。カートの合計がPUTリクエストに応答して更新される場合はtrueに、そうでない場合はfalseに設定する必要があります。

| 属性 | タイプ | 必須 | 説明 |
| :------------------ | :----- | :------:| :-------------------------------------------------- |
|`additional_fields`｜ オブジェクト｜いいえ｜名前 => 更新する追加フィールドの値のペア。|
| `payment_method`｜文字列｜いいえ｜選択された支払い方法のID。              |
| `order_notes`｜文字列｜いいえ｜注文メモ。                                        |

```sh
curl --header "Nonce: 12345" --request PUT https://example-store.com/wp-json/wc/store/v1/checkout?additional_fields[plugin-namespace/leave-on-porch]=true&additional_fields[plugin-namespace/location-on-porch]=dsdd&payment_method=bacs&order_notes=Please%20leave%20package%20on%20back%20porch
```

### リクエスト例

```json
{
  "additional_fields": {
    "plugin-namespace/leave-on-porch": true,
    "plugin-namespace/location-on-porch": "dsdd"
  },
  "payment_method": "bacs",
  "order_notes": "Please leave package on back porch"
}
```

### 回答例

```json
{
    "order_id": 1486,
    "status": "checkout-draft",
    "order_key": "wc_order_KLpMaJ054PVlb",
    "order_number": "1486",
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
        "country": "US"
    },
    "payment_method": "bacs",
    "payment_result": null,
    "additional_fields": {
        "plugin-namespace/leave-on-porch": true,
        "plugin-namespace/location-on-porch": "dsdd"
    },
    "__experimentalCart": { ... },
    "extensions": {}
}
```

レスポンスの一部として返される`__experimentalCart`フィールドに注意してください。合計はPUTリクエストに続いてフロントエンドで更新されます。これにより、PUTリクエストによって永続化されたフィールドに応答してカートの合計を操作することが可能になります。

## 注文と支払いを処理する

最終的な顧客の住所、選択された支払い方法、および追加の支払いデータを受け入れ、支払いを試み、その結果を返す。
結果を返します。

```http
POST /wc/store/v1/checkout
```

| 属性 | タイプ | 必須 | 説明 |
| :------------------ | :----- | :------:| :------------------------------------------------------------------ |
| `billing_address` | object | はい｜更新された顧客の請求先住所データのオブジェクト。            |
| `shipping_address`｜オブジェクト｜はい｜顧客の更新された配送先住所データのオブジェクト。           |
| `customer_note` | 文字列 | いいえ | チェックアウト時に顧客が注文に追加したメモ。            |
| `payment_method` | string | Yes | 決済処理に使用される支払い方法のID。     |
| `payment_data` | 配列 | いいえ | 決済処理時に支払い方法に渡すデータ。|
| オプションとして、新しいアカウントのパスワードを定義します。                      |

```sh
curl --header "Nonce: 12345" --request POST https://example-store.com/wp-json/wc/store/v1/checkout?payment_method=paypal&payment_data[0][key]=test-key&payment_data[0][value]=test-value
```

### リクエスト例

```json
{
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
    "country": "US"
  },
  "customer_note": "Test notes on order.",
  "create_account": false,
  "payment_method": "cheque",
  "payment_data": [],
  "extensions": {
    "some-extension-name": {
      "some-data-key": "some data value"
    }
  }
}
```

### 回答例

```json
{
  "order_id": 146,
  "status": "on-hold",
  "order_key": "wc_order_VPffqyvgWVqWL",
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
    "country": "US"
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

[WooCommerce Stripe Payment Gateway](https://wordpress.org/plugins/woocommerce-gateway-stripe/)を使用する際にCheckoutエンドポイントに送信される支払いデータの例を以下に示します。

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
