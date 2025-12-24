---
post_title: Displaying custom fields in your theme or site
sidebar_label: Displaying custom fields in theme
current wccom url: 'https://woocommerce.com/document/custom-product-fields/'
---

# テーマやサイトにカスタムフィールドを表示する

商品に追加したカスタムフィールドのメタデータを使って、追加した情報をテーマやサイト内に表示することができます。

各商品のカスタムフィールドを表示するには、テーマのファイルを編集する必要があります。以下は、短い説明文の後にカスタムフィールドを単品ページ内に表示する方法の例です：

![画像](./_media/カスタムフィールド値.png)

```php
<?php

// Display a product custom field within single product pages after the short description 

function woocommerce_custom_field_example() {

    if ( ! is_product() ) {
        return;
    }
   
    global $product;

    if ( ! is_object( $product ) ) {
        $product = wc_get_product( get_the_ID() );
    }

    $custom_field_value = get_post_meta( $product->get_id(), 'woo_custom_field', true );
    
    if ( ! empty( $custom_field_value ) ) {
       echo '<div class="custom-field">' . esc_html( $custom_field_value ) . '</div>';
    }
}

add_action( 'woocommerce_before_add_to_cart_form', 'woocommerce_custom_field_example', 10 );
```
