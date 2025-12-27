---
post_title: Conditional tags in WooCommerce
sidebar_label: Conditional tags
---
# WooCommerceの条件タグ

## 「条件付きタグ」とは？

WooCommerceとWordPressの条件タグをテンプレートファイルで使用することで、ページがどのような*条件*にマッチするかによって表示されるコンテンツを変更することができます。例えば、ショップページの上にテキストのスニペットを表示したいとします。`is_shop()`条件タグを使用すると、次のことができます。

WooCommerceはカスタム投稿タイプを使用するため、WordPressの条件付きタグの多くも使用できます。WordPressに含まれているタグの一覧は[codex.wordpress.org/Conditional_Tags](https://codex.wordpress.org/Conditional_Tags)を参照してください。

**注意**：WordPressでは、`posts_selection` [アクションフック](https://codex.wordpress.org/Plugin_API/Action_Reference#Actions_Run_During_a_Typical_Request)の後にしか条件付きクエリタグを使用できません（`wp`アクションフックは、これらの条件付きクエリを使用できる最初のアクションフックです）。テーマの場合、functions.phpの本文で条件タグを使用すると、条件タグが正しく動作しないことを意味します。

## 利用可能な条件タグ

すべての条件タグは、条件が満たされたかどうかをテストし、`TRUE`または`FALSE`を返します。 **タグが`TRUE`を出力する条件は、条件タグの下に記載されています**。

以下のリストは主な条件タグです。すべての条件タグを見るには、[WooCommerce API Docs](https://woocommerce.com/wc-apidocs/) をご覧ください。

### WooCommerceページ

- `is_woocommerce()`  
  WooCommerceテンプレートを使うページであればtrueを返します(カートとチェックアウトはショートコードを使う標準ページなので含まれません)。

### メインショップページ

- `is_shop()`  
  商品アーカイブページ(shop)の時にtrueを返します。

### 商品カテゴリーページ

- `is_product_category()`  
  商品カテゴリのアーカイブを表示している場合に true を返します。
- `is_product_category( 'shirts' )`  
  シャツ'カテゴリーの商品カテゴリーページが表示されているとき。
- `is_product_category( array( 'shirts', 'games' ) )`  
  shirts' または 'games' カテゴリの商品カテゴリページを表示しているとき。

### 商品タグページ

- `is_product_tag()`  
  商品タグのアーカイブを表示する際に true を返します。
- `is_product_tag( 'shirts' )`  
  shirts'タグの商品タグページが表示されている時
- `is_product_tag( array( 'shirts', 'games' ) )`  
  shirts'タグまたは'games'タグの商品タグページを表示しているとき。

### 単一商品ページ

- `is_product()`  
  単一の商品ページで真を返す。is_singularのラッパー。

### カートページ

- `is_cart()`  
  カートページで true を返します。

### チェックアウトページ

- `is_checkout()`  
  チェックアウトページでtrueを返します。

### 顧客アカウントのページ

- `is_account_page()`  
  顧客のアカウントページでtrueを返します。

### エンドポイント

- `is_wc_endpoint_url()`  
  WooCommerce のエンドポイントを表示する際に true を返す
- `is_wc_endpoint_url( 'order-pay' )`  
  注文支払い用のエンドポイントページが表示されているとき。
- 他のエンドポイントも同様...

### Ajaxリクエスト

- `is_ajax()`  
  ページがajax経由でロードされた場合にtrueを返します。

## 動作例

この例では、カテゴリーごとに異なるコンテンツを表示する方法を説明しています。

```php
if ( is_product_category() ) {

  if ( is_product_category( 'shirts' ) ) {
    echo 'Hi! Take a look at our sweet t-shirts below.';
  } elseif ( is_product_category( 'games' ) ) {
    echo 'Hi! Hungry for some gaming?';
  } else {
    echo 'Hi! Check out our products below.';
  }

}
```
