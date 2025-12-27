---
post_title: Disabling Marketplace Suggestions Programmatically
sidebar_label: Disabling marketplace suggestions
current wccom url: >-
  https://woocommerce.com/document/woocommerce-marketplace-suggestions-settings/#section-6
---

# Disabling Marketplace Suggestions Programmatically

woocommerce.comから取得したマーケットプレイスの提案をプログラムで無効にしたい場合は、`woocommerce_allow_marketplace_suggestions`フィルタをテーマの`functions.php`またはカスタムプラグインに追加してください。 

例えば、こうだ： 

```php
add_filter( 'woocommerce_allow_marketplace_suggestions', '__return_false' );
```

このフィルタは、WooCommerce管理画面からMarketplace Suggestionsを完全に削除します。
