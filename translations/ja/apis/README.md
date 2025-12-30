---
post_title: Getting Started with WooCommerce APIs
sidebar_label: Getting started
---

# Getting Started with WooCommerce APIs

WooCommerce は、WooCommerce ストアのデータとやり取りするためのプログラム API を多数提供しています。

## WC REST API

WC REST API は WooCommerce の強力な機能で、注文、商品、クーポン、顧客、配送ゾーンなど WooCommerce の様々なデータを読み書きできます。[WordPress REST API](https://developer.wordpress.org/rest-api/)に基づいています。

[WC REST API](./rest-api/README.md) ドキュメントを参照してください。

## ストア API

Store API は、顧客向けのカート、チェックアウト、商品機能を開発するためのパブリック REST API エンドポイントを提供します。WooCommerce REST API とは対照的に、Store API は認証されておらず、機密性の高い店舗データやその他の顧客情報へのアクセスを提供しません。

[Store API](./store-api/README.md) ドキュメントを参照してください。

## その他のリソース

強力な REST API だけでなく、WooCommerceは開発者がストアのコア機能を深く統合し、拡張するために設計された PHP ベースの API スイートを提供しています。これらの API は WooCommerce のクラスと直接やり取りすることができ、設定、支払いゲートウェイ、配送方法などのカスタムビヘイビアを可能にします。

### 設定API

Settings API は、設定の表示、保存、読み込みのためにエクステンションによって使用されます。

[Settings API](/docs/extensions/settings-and-config/settings-api) ドキュメントを参照してください。

### ペイメントゲートウェイ API

ペイメントゲートウェイ API は、エクステンションがペイメントゲートウェイとやり取りするために使用されます。

[Payment Gateway API](/docs/features/payments/payment-gateway-api/) ドキュメントを参照してください。

### 配送方法 API

Shipping Method API は、配送方法を拡張し、独自のレートを追加するために拡張機能によって使用されます。

[Shipping Method API](/docs/features/shipping/shipping-method-api/)のドキュメントを参照してください。

### Payment Token API

Payment Token API は、ゲートウェイ用の支払トークンの保管と管理に使用される。

[Payment Token API](/docs/features/payments/payment-token-api/) ドキュメントを参照してください。

### WooCommerce コードリファレンス

WooCommerce コードリファレンスは WooCommerce API の包括的なドキュメントです。開発者が WooCommerce API とその使用方法について学ぶための素晴らしいリソースです。

WooCommerce コードリファレンスは WooCommerce 内部のクラス、API、関数の包括的なドキュメントです。開発者が WooCommerce の機能とその拡張方法について学ぶための素晴らしいリソースです。

[WooCommerce コードリファレンス](https://developer.wordpress.org/reference/classes/woocommerce/) ドキュメントを参照してください。
