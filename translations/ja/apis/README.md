---
post_title: Getting Started with WooCommerce APIs
sidebar_label: Getting started
---

# Getting Started with WooCommerce APIs

WooCommerceは、WooCommerceストアデータとやり取りするための数多くのプログラム用APIを提供します。

## WC REST API

The WC REST API is a powerful part of WooCommerce which lets you read and write various parts of WooCommerce data such as orders, products, coupons, customers, and shipping zones. It based on the [WordPress REST API](https://developer.wordpress.org/rest-api/).

[WC REST API](./rest-api/README.md) のドキュメントをご覧ください。

## Store API

ストアAPIは、顧客向けのカート、チェックアウト、商品機能の開発向けに公開REST APIエンドポイントを提供します。WooCommerce REST APIとは異なり、ストアAPIは認証不要であり、機密性の高いストアデータやその他の顧客情報へのアクセスは提供しません。

[ストアAPI](./store-api/README.md) のドキュメントをご覧ください。

## Other Resources

強力なREST APIに加え、WooCommerceは開発者がストアのコア機能を深く統合・拡張できるよう設計されたPHPベースのAPIスイートを提供します。これらのAPIによりWooCommerceクラスとの直接的な連携が可能となり、設定、決済ゲートウェイ、配送方法などに対するカスタム動作を実現します。

### Settings API

設定 API は、拡張機能によって設定を表示、保存、および読み込むために使用されます。

[設定 API](/docs/extensions/settings-and-config/settings-api) のドキュメントをご覧ください。

### Payment Gateway API

ペイメントゲートウェイAPIは、拡張機能がペイメントゲートウェイと連携するために使用されます。

[Payment Gateway API](/docs/features/payments/payment-gateway-api/) のドキュメントをご覧ください。

### Shipping Method API

配送方法APIは、拡張機能によって配送方法を拡張し、独自の料金を追加するために使用されます。

[配送方法 API](/docs/features/shipping/shipping-method-api/) のドキュメントをご覧ください。

### Payment Token API

ペイメントトークンAPIは、ゲートウェイ向けのペイメントトークンの保存と管理に使用されます。

[Payment Token API](/docs/features/payments/payment-token-api/) のドキュメントをご覧ください。

### WooCommerce Code Reference

WooCommerceコードリファレンスは、WooCommerce APIの包括的なドキュメントです。開発者がWooCommerce APIについて学び、その使用方法を理解するための優れたリソースです。

WooCommerceコードリファレンスは、WooCommerceの内部クラス、API、関数に関する包括的なドキュメントです。開発者がWooCommerceの機能やその拡張方法を学ぶための優れたリソースです。

Explore the [WooCommerce Code Reference](https://developer.wordpress.org/reference/classes/woocommerce/) documentation.
