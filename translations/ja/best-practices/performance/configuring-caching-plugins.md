---
post_title: How to configure caching plugins for WooCommerce
sidebar_label: Configure caching plugins
---
# WooCommerceのキャッシュプラグインの設定方法

## キャッシュからページを除外する

キャッシュプラグインを使用している場合、これらのページはすでに除外されていることがよくあります。そうでない場合は、キャッシュシステムの各設定で、以下のページをキャッシュから除外してください。

- カート
- マイアカウント
- チェックアウト

これらのページは、現在の顧客とそのカートに固有の情報を表示するため、常に動的である必要があります。

## WooCommerceセッションをキャッシュから除外する

使用しているキャッシュ・システムがデータベース・キャッシュを提供している場合、`_wc_session_`をキャッシュから除外すると便利です。これはプラグインやホストのキャッシュに依存するので、そのシステムの説明書やドキュメントを参照してください。

## キャッシュからWooCommerceクッキーを除外する

WooCommerceのクッキーは、顧客のカート内の商品を追跡し、顧客がサイトを離れてもカートをデータベースに保持し、最近見たウィジェットを動かすのに役立ちます。以下は、WooCommerceがこのために使用するクッキーのリストです。

| クッキー名｜期間｜目的
| --- | --- | --- |
| woocommerce_cart_hash | session | WooCommerceがカートの中身やデータがいつ変更されたかを判断するのに役立ちます。|
| woocommerce_items_in_cart | session | WooCommerceがカートの中身やデータがいつ変更されたかを判断するのに役立ちます。|
| wp_woocommerce_session_ | 2 days | 顧客ごとにユニークなコードが含まれています。|
| woocommerce_recently_viewed | session | 最近見た商品ウィジェットをパワーアップします。|
| store_notice[notice id] | session｜顧客がストア通知を解除できるようにします。|

すべてのオプションをカバーすることはできませんが、人気のあるキャッシュプラグインのヒントを追加しました。より具体的なサポートについては、キャッシュ統合を担当するサポートチームにお問い合わせください。

### W3トータルキャッシュのminify設定

Minify設定の'Ignored comment stems'オプションに'mfunc'を追加してください。

### WP-Rocket

WooCommerceはWP-Rocketと完全に互換性があります。プラグインの設定で以下のページ（カート、チェックアウト、マイアカウント）をキャッシュしないようにしてください。

JavaScriptファイルの最小化は避けることをお勧めします。

### WP スーパーキャッシュ

WooCommerceはWP Super Cacheとネイティブ互換性があります。WooCommerceはデフォルトでカート、チェックアウト、マイアカウントのページをキャッシュしないようにWP Super Cacheに情報を送信します。

### ワニス

```varnish
if (req.url ~ "^/(cart|my-account|checkout|addons)") {
  return (pass);
}
if ( req.url ~ "\\?add-to-cart=" ) {
  return (pass);
}
```

## トラブルシューティング

### WooCommerceでVarnishの設定が機能しないのはなぜですか？

以下のWordPress.orgサポートフォーラムの投稿[ クッキーがvarnishコーディングにどのような影響を与えているか](https://wordpress.org/support/topic/varnish-configuration-not-working-in-woocommerce)をご覧ください。

```text
Add this to vcl_recv above "if (req.http.cookie) {":

# Unset Cookies except for WordPress admin and WooCommerce pages 
if (!(req.url ~ "(wp-login|wp-admin|cart|my-account/*|wc-api*|checkout|addons|logout|lost-password|product/*)")) { 
unset req.http.cookie; 
} 
# Pass through the WooCommerce dynamic pages 
if (req.url ~ "^/(cart|my-account/*|checkout|wc-api/*|addons|logout|lost-password|product/*)") { 
return (pass); 
} 
# Pass through the WooCommerce add to cart 
if (req.url ~ "\?add-to-cart=" ) { 
return (pass); 
} 
# Pass through the WooCommerce API
if (req.url ~ "\?wc-api=" ) { 
return (pass); 
} 
# Block access to php admin pages via website 
if (req.url ~ "^/phpmyadmin/.*$" || req.url ~ "^/phppgadmin/.*$" || req.url ~ "^/server-status.*$") { 
error 403 "For security reasons, this URL is only accessible using localhost (127.0.0.1) as the hostname"; 
} 

Add this to vcl_fetch:

# Unset Cookies except for WordPress admin and WooCommerce pages 
if ( (!(req.url ~ "(wp-(login|admin)|login|cart|my-account/*|wc-api*|checkout|addons|logout|lost-password|product/*)")) || (req.request == "GET") ) { 
unset beresp.http.set-cookie; 
} 
```

### パスワードリセットがループしてしまうのはなぜですか？

これは、マイアカウント・ページがキャッシュされるためです。サーバー側でキャッシュを行うホストによっては、my-account.phpがキャッシュされるのを防いでいません。

パスワードをリセットできず、ログイン画面に戻され続ける場合は、このページがキャッシュから除外されていることを確認するため、ホストに相談してください。
