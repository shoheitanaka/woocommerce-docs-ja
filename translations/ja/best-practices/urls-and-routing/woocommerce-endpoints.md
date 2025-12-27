---
post_title: Understanding WooCommerce endpoints
sidebar_label: WooCommerce endpoints
---
# WooCommerceのエンドポイントを理解する

エンドポイントとは、ウェブサイトのURLに含まれる余分な部分のことで、存在する場合に異なるコンテンツを表示するために検出される。

例えばURL **yoursite.com/my-account**に表示される'my account'ページがあるかもしれません。このURLにエンドポイント'edit-account'が追加され、'**yoursite.com/my-account/edit-account**'となった場合、**マイアカウントページ**の代わりに**アカウント編集ページ**が表示されます。

これにより、複数のページやショートコードを用意することなく、さまざまなコンテンツを表示することができ、設置するコンテンツの量を減らすことができる。

エンドポイントは**WooCommerce > Settings > Advanced**にあります。

## チェックアウトのエンドポイント

以下のエンドポイントはチェックアウト関連の機能に使用され、/checkoutページのURLに付加されます：

-   支払いページ - `/order-pay/{ORDER_ID}`
-   注文を受け取りました（ありがとうございます） - `/order-received/`
-   支払い方法の追加 - `/add-payment-method/`
-   支払い方法の削除 - `/delete-payment-method/`
-   デフォルトの支払い方法を設定する - `/set-default-payment-method/`

## アカウントエンドポイント

以下のエンドポイントはアカウント関連の機能に使用され、/my-accountページのURLに付加される：

-   オーダー - `/orders/`
-   注文を見る - `/view-order/{ORDER_ID}`
-   ダウンロード - `/downloads/`
-   アカウントの編集（およびパスワードの変更） - `/edit-account/`
-   住所 - `/edit-address/`
-   支払い方法 - `/payment-methods/`
-   パスワードの紛失 - `/lost-password/`
-   ログアウト - `/customer-logout/`

## もっと詳しく

- [エンドポイントURLのカスタマイズ](./customizing-endpoint-urls.md)
