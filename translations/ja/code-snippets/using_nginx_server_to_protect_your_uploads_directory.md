---
post_title: Using NGINX server to protect your upload directory
sidebar_label: NGINX server to protect upload directory
current wccom url: >-
  https://woocommerce.com/document/digital-downloadable-product-handling/#protecting-your-uploads-directory
---

# NGINXサーバーを使ってアップロードディレクトリを保護する

X-Accel-Redirect/X-Sendfile**または**Force Downloads**ダウンロードメソッドと共にNGINXサーバーを使用している場合、より良いセキュリティのためにこの設定を追加する必要があります：

```php
# Protect WooCommerce upload folder from being accessed directly.
# You may want to change this config if you are using "X-Accel-Redirect/X-Sendfile" or "Force Downloads" method for downloadable products.
# Place this config towards the end of "server" block in NGINX configuration.
location ~* /wp-content/uploads/woocommerce_uploads/ {
    if ( $upstream_http_x_accel_redirect = "" ) {
        return 403;
    }
    internal;
}
```

また、**リダイレクトのみ**のダウンロード方法を使用している場合の設定です：

```php
# Protect WooCommerce upload folder from being accessed directly.
# You may want to change this config if you are using "Redirect Only" method for downloadable products.
# Place this config towards the end of "server" block in NGINX configuration.
location ~* /wp-content/uploads/woocommerce_uploads/ {
    autoindex off;
}
```

お使いのウェブサーバーがわからない場合は、このサポートページへのリンクとともに、ホストにお問い合わせください。
