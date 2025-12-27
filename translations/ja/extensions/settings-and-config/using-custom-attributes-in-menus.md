---
post_title: Managing custom attributes in WooCommerce menus and taxonomy archives
sidebar_label: Custom attributes in menus
---
# WooCommerceのメニューとタクソノミーアーカイブでカスタム属性を管理する

レイヤーナビに使用できる属性はカスタムタクソノミーであり、メニューに表示したり、属性別に商品を表示したりすることができます。これにはいくつかの作業が必要で、アーカイブを有効にする必要があります。

## メニューのタクソノミーを登録する

カスタム属性にタクソノミーを登録する際、WooCommerceは以下のフックを呼び出します：

```php
$show_in_nav_menus = apply_filters('woocommerce_attribute_show_in_nav_menus', false, $name);
```

例えば、あなたの属性スラッグが`size`だった場合、メニュー用に登録するには次のようにします：

```php
add_filter('woocommerce_attribute_show_in_nav_menus', 'wc_reg_for_menus', 1, 2);

function wc_reg_for_menus( $register, $name = '' ) {
if ( $name == 'pa_size' ) $register = true;
return $register;
}
```

カスタム属性のスラッグは`pa_`で始まるので、`size`という属性は`pa_size`となります。

次に、**Appearance > Menus**であなたの属性を使用してください。ただし、タクソノミータームへのリンクをクリックすると、デフォルトのブログスタイルになることにお気づきでしょう。

## テンプレートを作成する

商品を思い通りに表示するには、属性をテーマ化する必要があります。そのためには

1.  `woocommerce/templates/taxonomy-product_cat.php`をテーマフォルダにコピーする。
2.  あなたの属性を反映させるためにテンプレート名を変更する - この例では`taxonomy-pa_size.php`を使用します。

これで、カスタム属性のタクソノミー用語を表示するときに、このテンプレートが表示されるようになります。
