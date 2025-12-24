---
post_title: Uninstall and remove all WooCommerce Data
sidebar_label: Uninstalling and removing data
current wccom url: >-
  https://woocommerce.com/document/installing-uninstalling-woocommerce/#uninstalling-woocommerce
---

# すべてのWooCommerceデータをアンインストールして削除する

WooCommerceプラグインは、他のWordPressプラグインと同様にアンインストールすることができます。デフォルトでは、WooCommerceのデータはそのまま残ります。 

If you need to remove *all* WooCommerce data as well, including products, order data, coupons, etc., you need to to modify the site's `wp-config.php` *before* deactivating and deleting the WooCommerce plugin.

このアクションは破壊的かつ永続的であるため、情報はそのまま提供されます。WooCommerceサポートはこのプロセスやその結果発生することについてはサポートできません。 

To fully remove all WooCommerce data from your WordPress site, open `wp-config.php`, scroll down to the bottom of the file, and add the following constant on its own line above `/* That's all, stop editing. */`.

```php
define( 'WC_REMOVE_ALL_DATA', true );

/* That's all, stop editing! Happy publishing. */ 
```

そして、変更がファイルに保存された後、WooCommerceを無効化して削除すると、すべてのデータがWordPressサイトのデータベースから削除されます。

![Uninstall WooCommerce WPConfig](https://woocommerce.com/wp-content/uploads/2020/03/uninstall_wocommerce_plugin_wpconfig.png)
