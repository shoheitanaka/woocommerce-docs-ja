---
post_title: Rename a country
---
# 国名の変更

国名リストの国名を変更します：

```php
if ( ! function_exists( 'YOUR_PREFIX_rename_country' ) ) {
  /**
   * Rename a country
   *
   * @param array $countries Existing country names
   * @return array $countries Updated country name(s)
   */
  function YOUR_PREFIX_rename_country( $countries ) {
     $countries['IE'] = __( 'Ireland (Changed)', 'YOUR-TEXTDOMAIN' );

     return $countries;
  }
  add_filter( 'woocommerce_countries', 'YOUR_PREFIX_rename_country' );
}
```
