---
post_title: How to Add Additional Fields
sidebar_label: How to add additional fields in checkout
---
# WooCommerceチェックアウトブロックに追加フィールドを追加する方法

この機能にはWooCommerce 8.9.0以上が必要です。

WooCommerceチェックアウトブロックは、チェックアウトプロセス中に顧客から情報を収集するためのフィールドを追加するための強力なAPIを開発者に提供します。特別な配送指示、ビジネスの詳細、またはマーケティングのプリファレンスを収集する必要があるかどうかにかかわらず、追加のチェックアウトフィールドは、あなたのストアの機能を簡単に拡張することができます。

このガイドでは、チェックアウトフォームに独自の追加フィールドを追加する手順を説明し、すぐに実装できる実践的な例を紹介します。

## ♪ はじめに

追加のチェックアウトフィールドを追加するには、`woocommerce_register_additional_checkout_field()`関数を使用します。これは`woocommerce_init`アクションの後に呼び出され、WooCommerceが完全にロードされていることを確認します。

基本的な構成はこうだ：

```php
add_action( 'woocommerce_init', function() {
    if ( ! function_exists( 'woocommerce_register_additional_checkout_field' ) ) {
        return;
    }
    
    woocommerce_register_additional_checkout_field(
        array(
            'id'       => 'your-namespace/field-name',
            'label'    => __( 'Your Field Label', 'your-text-domain'),
            'location' => 'contact', // or 'address' or 'order'
            'type'     => 'text',    // or 'select' or 'checkbox'
            'required' => false,
        )
    );
});
```

## フィールドの位置フィールドの表示位置

追加フィールドは、3つの異なる場所に配置することができます：

![連絡先の追加フィールド](/img/doc_images/woo-local-checkout.png)

### 連絡先情報 (`contact`)

ここのフィールドはチェックアウトフォームの上部にEメールフィールドと並んで表示されます。ここに保存されたデータはお客様のアカウントの一部となり、お客様の「アカウント詳細」セクションに表示されます。

Example:

```php
woocommerce_register_additional_checkout_field(
    array(
        'id'       => 'my-plugin/marketing-opt-in',
        'label'    => __('Subscribe to our newsletter?', 'your-text-domain'),
        'location' => 'contact',
        'type'     => 'checkbox',
    )
);
```

![コンタクト用追加フィールド](/img/doc_images/additional-field-contact.png)

### アドレス (`address`)

これらのフィールドは、配送先と請求先の両方のフォームに表示されます。これらのフィールドは、顧客と注文の両方に保存されるため、リピーターが再入力する必要はありません。

Example:

```php
woocommerce_register_additional_checkout_field(
    array(
        'id'       => 'my-plugin/delivery-instructions',
        'label'    => __('Special delivery instructions', 'your-text-domain'),
        'location' => 'address',
        'type'     => 'text',
    )
);
```

![住所欄の追加](/img/doc_images/additional-field-address.png)

### 注文情報 (`order`)

この場所のフィールドは、別の「注文情報」ブロックに表示され、顧客のアカウントではなく、注文にのみ保存されます。将来の購入のために覚えておく必要のない注文固有の詳細には最適です。

Example:

```php
woocommerce_register_additional_checkout_field(
    array(
        'id'       => 'my-plugin/gift-message',
        'label'    => __('Gift message', 'your-text-domain'),
        'location' => 'order',
        'type'     => 'text',
    )
);
```

![注文の追加フィールド](/img/doc_images/additional-field-order.png)

## サポートされるフィールドタイプ

APIは3つのフィールドタイプをサポートしている：

### テキストフィールド

短いテキスト入力の収集に最適：

```php
woocommerce_register_additional_checkout_field(
    array(
        'id'       => 'my-plugin/company-vat',
        'label'    => __('VAT Number', 'your-text-domain'),
        'location' => 'address',
        'type'     => 'text',
        'required' => true,
    )
);
```

### ドロップダウンの選択

事前定義されたオプションに最適：

```php
woocommerce_register_additional_checkout_field(
    array(
        'id'       => 'my-plugin/preferred-delivery-time',
        'label'    => __('Preferred delivery time', 'your-text-domain'),
        'location' => 'order',
        'type'     => 'select',
        'options'  => array(
            array(
                'value' => 'morning',
                'label' => __('Morning (9AM - 12PM)', 'your-text-domain')
            ),
            array(
                'value' => 'afternoon',
                'label' => __('Afternoon (12PM - 5PM)', 'your-text-domain')
            ),
            array(
                'value' => 'evening',
                'label' => __('Evening (5PM - 8PM)', 'your-text-domain')
            ),
        ),
    )
);
```

### チェックボックス

イエス/ノーの質問やオプトインに最適です：

```php
woocommerce_register_additional_checkout_field(
    array(
        'id'           => 'my-plugin/age-verification',
        'label'        => __('I confirm I am over 18 years old', 'your-text-domain'),
        'location'     => 'contact',
        'type'         => 'checkbox',
        'required'     => true,
        'error_message' => __('You must be over 18 to place this order.', 'your-text-domain'),
    )
);
```

## フィールド属性の追加

より良いユーザーエクスペリエンスのために、HTML属性でフィールドを拡張することができます：
例

```php
woocommerce_register_additional_checkout_field(
    array(
        'id'         => 'my-plugin/phone-number',
        'label'      => __('Alternative phone number', 'your-text-domain'),
        'location'   => 'contact',
        'type'       => 'text',
        'attributes' => array(
            'autocomplete' => 'tel',
            'pattern'      => '[0-9]{10}',
            'title'        => __('Please enter a 10-digit phone number', 'your-text-domain'),
            'placeholder'  => '1234567890',
        ),
    )
);
```

## バリデーションとサニタイゼーション

カスタムフィールドに入力されたデータが有効で安全であることを確認するために、カスタムバリデーションとサニタイズ関数を追加することができます。

```php
add_action( 'woocommerce_init', function() {
    woocommerce_register_additional_checkout_field(
        array(
            'id'                => 'my-plugin/business-email',
            'label'             => __('Business Email', 'your-text-domain'),
            'location'          => 'contact',
            'type'              => 'text',
            'required'          => true,
            'sanitize_callback' => function( $value ) {
                return sanitize_email( $value );
            },
            'validate_callback' => function( $value ) {
                if ( ! is_email( $value ) ) {
                    return new WP_Error( 
                        'invalid_business_email', 
                        __('Please enter a valid business email address.', 'your-text-domain') 
                    );
                }
            },
        )
    );
});
```

### バリデーション

WordPressのアクションフックを使って検証することもできます：

```php
add_action( 'woocommerce_validate_additional_field', function( $errors, $field_key, $field_value ) {
    if ( 'my-plugin/business-email' === $field_key ) {
        if ( ! is_email( $field_value ) ) {
            $errors->add( 'invalid_business_email', __('Please enter a valid email address.', 'your-text-domain') );
        }
    }
}, 10, 3 );
```

## フィールド値へのアクセス

チェックアウト後、ヘルパーメソッドを使ってフィールドの値を取得することができます：

```php
use Automattic\WooCommerce\Blocks\Package;
use Automattic\WooCommerce\Blocks\Domain\Services\CheckoutFields;

$checkout_fields = Package::container()->get( CheckoutFields::class );
$order = wc_get_order( $order_id );

// Get a specific field value
$business_email = $checkout_fields->get_field_from_object( 
    'my-plugin/business-email', 
    $order, 
    'other' // Use 'billing' or 'shipping' for address fields
);

// Get all additional fields
$all_fields = $checkout_fields->get_all_fields_from_object( $order, 'other' );
```

### 完全な例

```php
add_action( 'woocommerce_init', function() {
    if ( ! function_exists( 'woocommerce_register_additional_checkout_field' ) ) {
        return;
    }

    // Company information
    woocommerce_register_additional_checkout_field(
        array(
            'id'       => 'my-business-store/company-size',
            'label'    => __('Company size', 'your-text-domain'),
            'location' => 'contact',
            'type'     => 'select',
            'required' => true,
            'options'  => array(
                array( 'value' => '1-10', 'label' => __('1-10 employees', 'your-text-domain') ),
                array( 'value' => '11-50', 'label' => __('11-50 employees', 'your-text-domain') ),
                array( 'value' => '51-200', 'label' => __('51-200 employees', 'your-text-domain') ),
                array( 'value' => '200+', 'label' => __('200+ employees', 'your-text-domain') ),
            ),
        )
    );

    // Delivery preferences
    woocommerce_register_additional_checkout_field(
        array(
            'id'       => 'my-business-store/requires-appointment',
            'label'    => __('Delivery requires appointment', 'your-text-domain'),
            'location' => 'address',
            'type'     => 'checkbox',
        )
    );

    // Order-specific notes
    woocommerce_register_additional_checkout_field(
        array(
            'id'       => 'my-business-store/po-number',
            'label'    => __('Purchase Order Number', 'your-text-domain'),
            'location' => 'order',
            'type'     => 'text',
        )
    );
});
```

## 次のステップ

これで、チェックアウトブロックを使用してWooCommerceストアにチェックアウトフィールドを追加するための基礎ができました。

追加チェックアウトフィールドAPIは、WooCommerceのブロックベースのチェックアウトシステムとの互換性を維持しながら、チェックアウトエクスペリエンスをカスタマイズするための堅牢な基盤を提供します。シンプルなフィールドから始め、ニーズの成長に合わせて徐々に高度なバリデーションや条件ロジックを追加していきましょう。
