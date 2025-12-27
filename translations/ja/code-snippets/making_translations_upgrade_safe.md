---
post_title: Making your translation upgrade safe
sidebar_label: Translation upgrade safety
current wccom url: >-
  https://woocommerce.com/document/woocommerce-localization/#making-your-translation-upgrade-safe
---

# Making your translation upgrade safe

他のプラグインと同様に、WooCommerceは翻訳を`wp-content/languages/plugins`に保持します。 

しかし、カスタム翻訳を含めたい場合は、`wp-content/languages/woocommerce`に追加するか、スニペットを使って別の場所に保存されているカスタム翻訳を読み込むことができます：

```php
// Code to be placed in functions.php of your theme or a custom plugin file.
add_filter( 'load_textdomain_mofile', 'load_custom_plugin_translation_file', 10, 2 );

/*
 * Replace 'textdomain' with your plugin's textdomain. e.g. 'woocommerce'. 
 * File to be named, for example, yourtranslationfile-en_GB.mo
 * File to be placed, for example, wp-content/lanaguages/textdomain/yourtranslationfile-en_GB.mo
 */
function load_custom_plugin_translation_file( $mofile, $domain ) {
  if ( 'textdomain' === $domain ) {
    $mofile = WP_LANG_DIR . '/textdomain/yourtranslationfile-' . get_locale() . '.mo';
  }
  return $mofile;
}
```
