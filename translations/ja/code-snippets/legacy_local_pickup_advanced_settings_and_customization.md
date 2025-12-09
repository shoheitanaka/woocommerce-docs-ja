---
post_title: Advanced settings and customization for legacy Local Pickup
current wccom url: 'https://woocommerce.com/document/local-pickup/#advanced-settings-customization'
note: >-
  Docs links out to Skyverge's site for howto add a custom email - do we have
  our own alternative?
---

# Advanced settings and customization for legacy Local Pickup

## Disable local taxes when using local pickup

Local Pickup calculates taxes based on your store's location (address) by default, and not the customer's address. Add this snippet at the end of your theme's `functions.php` to use your standard tax configuration instead:

```php
add_filter( 'woocommerce_apply_base_tax_for_local_pickup', '__return_false' );
```

ローカルピックアップを選択した場合、店舗所在地ベースの税金ではなく、通常の税金が使用される。 

## Changing the location for local taxes

地域のピックアップ場所の郵便番号と都市に基づいて地方税を請求するには、このコード例を使用して、ショップのベースとなる都市と郵便番号を定義する必要があります：

```php
add_filter( 'woocommerce_countries_base_postcode', create_function( '', 'return "80903";' ) );
add_filter( 'woocommerce_countries_base_city', create_function( '', 'return "COLORADO SPRINGS";' ) );
```

Update `80903` to reflect your preferred postcode/zip, and `COLORADO SPRINGS` with your preferred town or city.

## Custom emails for local pickup

配送方法としてLocal Pickupを使用した場合、_Shipping Address_が管理者の注文メールに表示されない。

Since all core shipping options use the standard order flow, customers receive the same order confirmation email whether they select local pickup or any other shipping option. 
Use this guide to create custom emails for local pickup if you'd like to send a separate email for local pickup orders: [How to Add a Custom WooCommerce Email](https://www.skyverge.com/blog/how-to-add-a-custom-woocommerce-email/).

