---
post_title: Classes in WooCommerce
sidebar_label: Classes
sidebar_position: 1
---
# WooCommerceのクラス

## WooCommerceのクラス一覧

WooCommerceのクラス一覧は[WooCommerceコードリファレンス](https://woocommerce.github.io/code-reference/packages/WooCommerce-Classes.html)をご覧ください。

## 共通クラス

### WooCommerce

メインクラスは`woocommerce`で、`$woocommerce`変数を通してグローバルに利用可能です。これはWooCommerceとinitの他のクラスの主な機能を処理し、サイト全体の変数を保存し、エラー/成功メッセージを処理します。woocommerceクラスは構築時に以下のクラスを初期化します：

-   `WC_Query` - `$woocommerce->query` に格納されています。
-   `WC_Customer` - `$woocommerce->customer`に格納されています。
-   `WC_Shipping` - `$woocommerce->shipping` に格納される。
-   `WC_Payment_Gateways` - `$woocommerce->payment_gateways` に格納される。
-   `WC_Countries` - `$woocommerce->countries` に格納される。

その他のクラスはオンデマンドで自動ロードされる。

このクラスに含まれるメソッドの全リストは[WooCommerceクラスコードリファレンス](https://woocommerce.github.io/code-reference/classes/WooCommerce.html)をご覧ください。

### WC_Product

WooCommerceには商品データのロードと出力を担当するいくつかの商品クラスがあります。これは

`$product = wc_get_product( $post->ID );`。

なぜなら、`the_post()`を呼び出すと、投稿が商品である場合、グローバル変数`$product`に自動的に入力されるからです。

このクラスに含まれるメソッドの完全なリストについては、[WC_Product Code Reference](https://woocommerce.github.io/code-reference/classes/WC-Product.html) を参照してください。

### WC_Customer

customerクラスは、例えば現在の顧客に関するデータを取得することができます：

```php
global $woocommerce;
$customer_country = $woocommerce->customer->get_country();
```

このクラスに含まれるメソッドの完全なリストについては、[WC_Customer Code Reference](https://woocommerce.github.io/code-reference/classes/WC-Customer.html) を参照してください。

### WC_Cart

カートクラスは、ユーザーのカートデータをロードし、セッションに保存します。たとえば、カートの小計を取得するには、次のようにします：

```php
global $woocommerce;
$cart_subtotal = $woocommerce->cart->get_cart_subtotal();
```

このクラスに含まれるメソッドの完全なリストについては、[WC_Cart コードリファレンス](https://woocommerce.github.io/code-reference/classes/WC-Cart.html) を参照してください。
