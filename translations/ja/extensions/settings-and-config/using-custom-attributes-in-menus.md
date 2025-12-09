---
post_title: Managing custom attributes in WooCommerce menus and taxonomy archives
sidebar_label: Custom attributes in menus
---

# Managing custom attributes in WooCommerce menus and taxonomy archives

レイヤーナビに使用できる属性はカスタムタクソノミーであり、メニューに表示したり、属性別に商品を表示したりすることができます。これにはいくつかの作業が必要で、アーカイブを有効にする必要があります。

## Register the taxonomy for menus

カスタム属性にタクソノミーを登録する際、WooCommerceは以下のフックを呼び出します：

```php
$show_in_nav_menus = apply_filters('woocommerce_attribute_show_in_nav_menus', false, $name);
```

So, for example, if your attribute slug was `size` you would do the following to register it for menus:

```php
add_filter('woocommerce_attribute_show_in_nav_menus', 'wc_reg_for_menus', 1, 2);

function wc_reg_for_menus( $register, $name = '' ) {
if ( $name == 'pa_size' ) $register = true;
return $register;
}
```

Custom attribute slugs are prefixed with `pa_`, so an attribute called `size` would be `pa_size`

では、**Appearance &gt; Menus**であなたの属性を使用してください。ただし、タクソノミータームへのリンクをクリックすると、デフォルトのブログスタイルになることにお気づきでしょう。

## Create a template

商品を思い通りに表示するには、属性をテーマ化する必要があります。そのためには

1.  Copy `woocommerce/templates/taxonomy-product_cat.php` into your theme folder
2.  Rename the template to reflect your attribute - in our example we'd use `taxonomy-pa_size.php`

これで、カスタム属性のタクソノミー用語を表示するときに、このテンプレートが表示されるようになります。
