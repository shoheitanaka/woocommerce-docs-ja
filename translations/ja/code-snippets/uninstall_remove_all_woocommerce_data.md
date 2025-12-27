---
post_title: Uninstall and remove all WooCommerce Data
sidebar_label: Uninstalling and removing data
current wccom url: >-
  https://woocommerce.com/document/installing-uninstalling-woocommerce/#uninstalling-woocommerce
---
# すべてのWooCommerceデータをアンインストールして削除する

WooCommerceプラグインは、他のWordPressプラグインと同様にアンインストールすることができます。デフォルトでは、WooCommerceのデータはそのまま残ります。 

商品、注文データ、クーポンなど、WooCommerceのデータをすべて削除する必要がある場合は、WooCommerceプラグインを無効にして削除する前に、サイトの`wp-config.php`を修正する必要があります。

このアクションは破壊的かつ永続的であるため、情報はそのまま提供されます。WooCommerceサポートはこのプロセスやその結果発生することについてはサポートできません。 

WordPressサイトからすべてのWooCommerceデータを完全に削除するには、`wp-config.php`を開き、ファイルの一番下までスクロールダウンし、`/* That's all, stop editing. */`の上に以下の定数を追加します。

```php
define( 'WC_REMOVE_ALL_DATA', true );

/* That's all, stop editing! Happy publishing. */ 
```

そして、変更がファイルに保存された後、WooCommerceを無効化して削除すると、すべてのデータがWordPressサイトのデータベースから削除されます。

![WooCommerceのWPConfigをアンインストール](https://woocommerce.com/wp-content/uploads/2020/03/uninstall_wocommerce_plugin_wpconfig.png)
