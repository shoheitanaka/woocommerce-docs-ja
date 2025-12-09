---
post_title: Email preview integration
sidebar_label: Email preview integration
---

# Email Preview Integration

<!-- markdownlint-disable MD024 -->

## Overview

WooCommerceのメールプレビュー機能では、ダミーデータ（データベースからの実際のデータを使用しない）を使用してメールテンプレートをプレビューすることができます。つまり、新しいEメールタイプを登録するエクステンションは、Eメールプレビューシステムと統合する必要があります。 

## Integration Hooks

以下のフックを使用すると、拡張機能でメールのプレビューを完全に制御できます：

### Style and Content Settings

これらのフックにより、拡張機能が新しいスタイルやコンテンツ設定を追加し、メールプレビューがその変更をリッスンし、変更が加えられたときにプレビューを更新することができます。

#### `woocommerce_email_preview_email_style_setting_ids`

メールプレビューが変更を確認する新しいメールスタイル設定を追加。

```php
add_filter( 'woocommerce_email_preview_email_style_setting_ids', function( $setting_ids ) {
    $setting_ids[] = 'my_extension_email_style';
    return $setting_ids;
} );
```

#### `woocommerce_email_preview_email_content_setting_ids`

メールプレビューが変更を確認する新しいメールコンテンツ設定を追加します。

```php
add_filter( 'woocommerce_email_preview_email_content_setting_ids', function( $setting_ids ) {
    $setting_ids[] = 'my_extension_email_content';
    return $setting_ids;
} );
```

### Dummy Data Modification

#### `woocommerce_email_preview_dummy_order`

Modify the dummy `WC_Order` object used in preview.

```php
add_filter( 'woocommerce_email_preview_dummy_order', function( $order ) {
    // Modify the dummy order object
    $order->set_currency( 'EUR' );
    return $order;
} );
```

#### `woocommerce_email_preview_dummy_product`

プレビューで使用したダミー製品を修正する。

```php
add_filter( 'woocommerce_email_preview_dummy_product', function( $product ) {
    // Modify the dummy product object
    $product->set_name( 'My Product' );
    return $product;
} );
```

#### `woocommerce_email_preview_dummy_product_variation`

プレビューで使用するダミー商品のバリエーションを変更する。

```php
add_filter( 'woocommerce_email_preview_dummy_product_variation', function( $variation ) {
    // Modify the dummy variation object
    $variation->set_name( 'My Variation' );
    return $variation;
} );
```

#### `woocommerce_email_preview_dummy_address`

プレビューで使用するダミーアドレスを変更する。

```php
add_filter( 'woocommerce_email_preview_dummy_address', function( $address ) {
    // Modify the dummy address array
    $address['first_name'] = 'Preview';
    $address['last_name'] = 'Customer';
    return $address;
} );
```

### Placeholders and Email Object

#### `woocommerce_email_preview_placeholders`

メール内で置換するプレースホルダーを修正する。

```php
add_filter( 'woocommerce_email_preview_placeholders', function( $placeholders ) {
    // Add custom placeholders
    $placeholders['{custom_placeholder}'] = 'Custom Value';
    return $placeholders;
} );
```

#### `woocommerce_prepare_email_for_preview`

Modify the `WC_Email` object used in preview.

```php
add_filter( 'woocommerce_prepare_email_for_preview', function( $email ) {
    // Modify the email object, e.g. to replace WC_Order
    $email->set_object( $custom_object );
    return $email;
} );
```

## Best Practices

メールプレビューと統合する場合：

1. **Use Appropriate Object Types**
   - Use the correct object type for your extension (e.g., `WC_Subscription` instead of `WC_Order` for WooCommerce Subscriptions)
   - Ensure all required properties are set on dummy objects

2. **プレースホルダを扱う
   - 拡張機能が使用するすべてのカスタムプレースホルダを追加する
   - プレースホルダに現実的なプレビュー値を提供する

3. **スタイルとコンテンツの設定
   - メールの外観や内容に影響を与えるすべてのカスタム設定を登録します。

4. **テスト
   - 異なるメールタイプでプレビューをテストする
   - すべてのカスタムコンテンツが正しく表示されることを確認する
   - レスポンシブデザインの確認

## Troubleshooting

よくある問題と解決策

1. **I see "There was an error rendering an email preview." error**
   - There is a PHP error in your code that is causing the email preview to fail. Check your error log for more details.
   - Alternatively, you can modify [`class-wc-admin.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/admin/class-wc-admin.php) and remove [`try/catch` block](https://github.com/woocommerce/woocommerce/blob/f5310a33fbb160a73ea2de95efe4759c3aa791ea/plugins/woocommerce/includes/admin/class-wc-admin.php#L212-L218) around rendering the email preview to see the error message.

2. **Style or Content Settings Changes Not Reflecting**
   - Ensure the style settings are registered using the `woocommerce_email_preview_email_style_setting_ids` filter
   - Ensure the content settings are registered using the `woocommerce_email_preview_email_content_setting_ids` filter
3. **I don't see my extension's emails**
   - Ensure the email is registered using the `woocommerce_email_classes` filter
