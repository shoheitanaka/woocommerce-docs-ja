---
sidebar_position: 1
---

# ノンス・トークン 

Noncesは、セキュリティの目的でリクエストの発信元と意図を確認するために使用される生成番号です。Nonces については [WordPress codex](https://developer.wordpress.org/apis/security/nonces/) を参照してください。

## Noncesを必要とするAPIエンドポイントを保存する

`/cart` エンドポイントへの POST リクエストと `/checkout` エンドポイントへのすべてのリクエストは、nonce が必要です。代わりに[Cart Tokens](/docs/apis/store-api/cart-tokens)を使用していない限り、有効なnonceを提供しないとエラー応答が返されます。

## ノンス・トークンをリクエストとともに送信する

Nonceトークンはリクエストヘッダに含まれる。`Nonce`というリクエストヘッダを作成する。これはAPIによって検証される。

**例

```sh
curl --header "Nonce: 12345" --request GET https://example-store.com/wp-json/wc/store/v1/checkout
```

リクエストに成功すると、更新された`Nonce`ヘッダーが 送り返される。

## WordPressからセキュリティNoncesを生成する

Nonceは、[`wp_create_nonce`関数](https://developer.wordpress.org/reference/functions/wp_create_nonce/)を使用して、`wc_store_api`をキーとして作成する必要があります。

```php
wp_create_nonce( 'wc_store_api' )
```

それ以外には、noncesを作成するメカニズムはない。

## 開発のためにNoncesを無効にする

nonceを提供せずにRESTエンドポイントをテストしたい場合は、以下のフィルタを使うことができる：

```php
add_filter( 'woocommerce_store_api_disable_nonce_check', '__return_true' );
```

`woocommerce_store_api_disable_nonce_check`が`true`と評価される場合、Nonceチェックはバイパスされる。

注意：これは、セキュリティが重要でない開発サイトでのみ行ってください。本番環境では有効にしないでください。
