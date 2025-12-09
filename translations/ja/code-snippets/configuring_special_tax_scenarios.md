---
post_title: Code snippets for configuring special tax scenarios
sidebar_label: Configuring special tax scenarios
current wccom url: >-
  https://woocommerce.com/document/setting-up-taxes-in-woocommerce/configuring-specific-tax-setups-in-woocommerce/#configuring-special-tax-setups
---

# Code snippets for configuring special tax scenarios

## Scenario A: Charge the same price regardless of location and taxes

If a store enters product prices including taxes, but levies various location-based tax rates, the prices will appear to change depending on which tax rate is applied. In reality, the base price remains the same, but the taxes influence the total. [Follow this link for a detailed explanation](https://woocommerce.com/document/how-taxes-work-in-woocommerce/#cross-border-taxes).

一部のマーチャントでは、税金の変更を考慮して商品の基本価格を動的に変更し、税率に関係なく合計価格を一定に保つことを好みます。子テーマのfunctions.phpファイルまたはコードスニペットプラグインに以下のスニペットを追加して、この機能を有効にしてください。

```php
<?php

add_filter( 'woocommerce_adjust_non_base_location_prices', '__return_false' );
```

## Scenario B: Charge tax based on the subtotal amount

以下のスニペットは、ストアが小計が指定された最小値に達したときにのみ税金を広告する場合に便利です。以下のコードスニペットでは、その最小値はストアの通貨の110です。スニペットは、あなたの要件に応じて調整してください。 

```php
<?php

add_filter( 'woocommerce_product_get_tax_class', 'big_apple_get_tax_class', 1, 2 );

function big_apple_get_tax_class( $tax_class, $product ) {
	if ( WC()->cart->subtotal <= 110 )
		$tax_class = 'Zero Rate';

	return $tax_class;
}
```

## Scenario C: Apply different tax rates based on the customer role

加盟店によっては、卸売のステータスや免税に対応するために、顧客の役割に応じて異なる税率を適用する必要がある場合があります。

この機能を有効にするには、子テーマのfunctions.phpファイルまたはコードスニペットプラグインに以下のスニペットを追加してください。このスニペットでは、「管理者」権限を持つユーザーに**ゼロ税率税クラス**が割り当てられます。要件に応じて調整してください。

```php
<?php
/**
 * Apply a different tax rate based on the user role.
 */
function wc_diff_rate_for_user( $tax_class, $product ) {
	if ( is_user_logged_in() && current_user_can( 'administrator' ) ) {
		$tax_class = 'Zero Rate';
	}

	return $tax_class;
}
add_filter( 'woocommerce_product_get_tax_class', 'wc_diff_rate_for_user', 1, 2 );
add_filter( 'woocommerce_product_variation_get_tax_class', 'wc_diff_rate_for_user', 1, 2 );
```

## Scenario D: Show 0 value taxes

値が0である税金は、デフォルトで非表示になります。それらに関係なく表示するには、テーマのfunctions.phpファイルまたはコードスニペットプラグインに以下のスニペットを追加してください： 

```php
add_filter( 'woocommerce_order_hide_zero_taxes', '__return_false' );
```

## Scenario E: Suffixes on the main variable product

WooCommerceの税金設定の1つは、商品価格に追加情報を追加するための接尾辞の使用を可能にします。これは可変商品のバリエーションで使用できますが、バリエーションが多い場合、ウェブサイトのパフォーマンスに影響を与える可能性があるため、メインのバリエーションレベルでは無効になっています。 

関連する価格出力を担当するメソッドは、可変商品のために必要であれば、フィルターフックを介してカスタマイズすることができます。そのためには、このフィルターで実装できるカスタマイズが必要です：

```php
add_filter( 'woocommerce_show_variation_price', '__return_true' );
```


