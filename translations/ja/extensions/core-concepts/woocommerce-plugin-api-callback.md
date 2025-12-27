---
post_title: WooCommerce Plugin API callbacks
sidebar_label: Plugin API callbacks
---

# WooCommerce Plugin API callbacks

## 概要

このドキュメントでは、WooCommerce プラグイン API を使用してプラグインのアクション、特にデフォルトでは初期化されていないゲートウェイやクラスのコールバックを開始する方法について説明します。

## コールバックURLの構造

WooCommerce 2.0以前は、こちらをご利用ください：

`https://example.com/?wc-api=CALLBACK`。

WooCommerce 2.0以降では、エンドポイントを使用してください：

`https://example.com/wc-api/CALLBACK/`。

## ビヘイビア

コールバックURLにアクセスすると、WooCommerceは次のようになります：

- もしあれば、`CALLBACK`クラスを初期化する。
- `woocommerce_api_callback`アクションのトリガー
- WordPressを終了する

## APIコールバックへのフック

コールバックにフックするには、プラグインにアクションを追加します：

```php
add_action( 'woocommerce_api_callback', 'your_callback_handler_function' );
```

## コールバック後のリダイレクト

カスタムハンドラ関数を使用して、アクション実行後にユーザーをリダイレクトすることが可能です。
