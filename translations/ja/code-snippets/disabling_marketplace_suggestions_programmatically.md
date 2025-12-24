---
post_title: Disabling Marketplace Suggestions Programmatically
sidebar_label: Disabling marketplace suggestions
current wccom url: >-
  https://woocommerce.com/document/woocommerce-marketplace-suggestions-settings/#section-6
---

# マーケットプレイスの提案をプログラムで無効にする


For those who prefer to programmatically disable marketplace suggestions that are fetched from woocommerce.com, add the `woocommerce_allow_marketplace_suggestions` filter to your theme’s `functions.php` or a custom plugin. 

例えば、こうだ： 

```php
add_filter( 'woocommerce_allow_marketplace_suggestions', '__return_false' );
```

このフィルタは、WooCommerce管理画面からMarketplace Suggestionsを完全に削除します。
