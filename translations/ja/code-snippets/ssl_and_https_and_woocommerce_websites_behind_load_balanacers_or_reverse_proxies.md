---
post_title: SSL and HTTPS and WooCommerce
sidebar_label: SSL and HTTPS and WooCommerce
current wccom url: >-
  https://woocommerce.com/document/ssl-and-https/#websites-behind-load-balancers-or-reverse-proxies
---
# SSLとHTTPSとWooCommerce

## ロードバランサーやリバースプロキシの背後にあるウェブサイト

WooCommerceは、`is_ssl()` WordPress関数を使用して、ウェブサイトがSSLを使用しているかどうかを確認します。

`is_ssl()`は、接続がHTTPS経由かポート443経由かをチェックします。しかし、これはロードバランサーの背後にあるウェブサイト、特にNetwork Solutionsでホストされているウェブサイトでは動作しません。詳細については、[WordPress [is_ssl()関数リファレンスノート](https://codex.wordpress.org/Function_Reference/is_ssl#Notes)をお読みください。

`HTTP_X_FORWARDED_PROTO`をサポートしているロードバランサーやリバースプロキシーの背後にあるウェブサイトは、`wp-config.php`ファイルのrequire_once呼び出しの上に以下のコードを追加することで修正できます：

```php
if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && 'https' == $_SERVER['HTTP_X_FORWARDED_PROTO'] ) {
    $_SERVER['HTTPS'] = 'on';
}
```

**注意:** CloudFlareを使用する場合は、設定が必要です。彼らのドキュメントを確認してください。
