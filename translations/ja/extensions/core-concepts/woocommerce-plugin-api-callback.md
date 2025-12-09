---
post_title: WooCommerce Plugin API callbacks
sidebar_label: Plugin API callbacks
---

# WooCommerce Plugin API callbacks

## Overview

このドキュメントでは、WooCommerce プラグイン API を使用してプラグインのアクション、特にデフォルトでは初期化されていないゲートウェイやクラスのコールバックを開始する方法について説明します。

## Callback URL Structure

WooCommerce 2.0以前は、こちらをご利用ください：

`https://example.com/?wc-api=CALLBACK`

WooCommerce 2.0以降では、エンドポイントを使用してください：

`https://example.com/wc-api/CALLBACK/`

## Behavior

コールバックURLにアクセスすると、WooCommerceは次のようになります：

- Initialize the `CALLBACK` class, if available
- Trigger the `woocommerce_api_callback` action
- Exit WordPress

## Hooking into the API Callback

コールバックにフックするには、プラグインにアクションを追加します：

```php
add_action( 'woocommerce_api_callback', 'your_callback_handler_function' );
```

## Redirecting After Callback

カスタムハンドラ関数を使用して、アクション実行後にユーザーをリダイレクトすることが可能です。
