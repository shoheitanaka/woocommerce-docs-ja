---
sidebar_label: Cart Tokens
sidebar_position: 3
---

# カート・トークン 

カートトークンは、カートとのヘッドレスインタラクションのために、クッキーベースのセッションの代わりに使用することができます。`Cart-Token`を使用する場合、[Nonce Token](/docs/apis/store-api/nonce-tokens)は必要ありません。

## カート・トークンの取得

`/cart`エンドポイントへのリクエストは、レスポンスと一緒に`Cart-Token`ヘッダーを返します。このヘッダにはトークンが含まれており、後にStore API CartエンドポイントとCheckoutエンドポイントにリクエストヘッダとして送信することで、カートを識別することができます。

カート・トークンを取得する最も手っ取り早い方法は、`/wp-json/wc/store/v1/cart`のGETリクエストを行い、レスポンス・ヘッダを観察することです。そこに`Cart-Token`ヘッダーがあるはずです。

## カート・トークンの使い方

`Cart-Token`を使用するには、リクエストにヘッダーとして含めます。レスポンスには、`Cart-Token`に関連付けられたセッションの現在のカートの状態が含まれます。

**例

```sh
curl --header "Cart-Token: 12345" --request GET https://example-store.com/wp-json/wc/store/v1/cart
```

同じ方法で、`/checkout`ルートで`Cart-Token`を使ってチェックアウトすることができます。
