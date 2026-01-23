---
sidebar_label: On-Sale Badge block
category_slug: product-sale-badge
post_title: On-Sale Badge block
---

# On-Sale Badge block

セール中バッジブロックは、セール中の商品に「セール」バッジを表示します。

> このブロックは`woocommerce/product-sale-badge`というスラッグを使用しています。

## `woocommerce_sale_badge_text`

### 説明<!-- omit in toc -->

`woocommerce_sale_badge_text`フィルタは、商品のコンテキストに基づいてセールバッジのテキストをカスタマイズすることができます。

### パラメーター<!-- omit in toc -->

-   _$sale_text_ `string` (デフォルト: `'Sale'`) - セールバッジのテキスト。
-   _$product_ `WC_Product` - 商品オブジェクト。

### リターン<!-- omit in toc -->

-   `string` - フィルタリングされたセールバッジのテキスト。

### コード例<!-- omit in toc -->

#### 基本例<!-- omit in toc -->

```php
add_filter( 'woocommerce_sale_badge_text', 'custom_sale_badge_text', 10, 2 );

function custom_sale_badge_text( $sale_text, $product ) {
	return __( 'On Sale', 'your-textdomain' );
}
```

#### 製品固有のカスタマイズ<!-- omit in toc -->

```php
add_filter( 'woocommerce_sale_badge_text', 'custom_sale_badge_by_product_type', 10, 2 );

function custom_sale_badge_by_product_type( $sale_text, $product ) {
	if ( $product->is_type( 'variable' ) ) {
		return __( 'Save Now', 'your-textdomain' );
	}

	if ( $product->is_type( 'simple' ) ) {
		return __( 'Limited Offer', 'your-textdomain' );
	}

	return $sale_text;
}
```

#### 割引率<!-- omit in toc -->

```php
add_filter( 'woocommerce_sale_badge_text', 'show_discount_percentage_badge', 10, 2 );

function show_discount_percentage_badge( $sale_text, $product ) {
	if ( $product->is_type( 'simple' ) || $product->is_type( 'external' ) ) {
		$regular_price = (float) $product->get_regular_price();
		$sale_price    = (float) $product->get_sale_price();

		if ( $regular_price > 0 ) {
			$percentage = round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 );
			return sprintf( __( '-%s%%', 'your-textdomain' ), $percentage );
		}
	}

	return $sale_text;
}
```

## `woocommerce_sale_flash` との違い

| アスペクト | `woocommerce_sale_badge_text` | `woocommerce_sale_flash` |
| --- | --- | --- |
| コンテキスト**｜セール・バッジ・ブロック｜クラシック・テンプレート (`loop/sale-flash.php`, `single-product/sale-flash.php`)
| 出力** | プレインテキスト | HTMLマークアップ
| パラメータ** | `$sale_text`, `$product` | `$html`, `$post`, `$product` |
| **デフォルト** | `'Sale'` | `'<span class="onsale">Sale!</span>'`
| WooCommerce 10.0.0｜WooCommerce 2.x｜**Since**｜WooCommerce 10.0.0｜WooCommerce 2.x

### 出力処理

ブロックフィルターはプレーンテキストのみを受け付けます。HTMLタグはエスケープされ、テキストとして表示されます。

```php
// Correct - plain text
add_filter( 'woocommerce_sale_badge_text', function( $text, $product ) {
	return 'Hot Deal';
}, 10, 2 );

// Incorrect - HTML will be escaped
add_filter( 'woocommerce_sale_badge_text', function( $text, $product ) {
	return '<strong>Hot Deal</strong>'; // Displays as "&lt;strong&gt;Hot Deal&lt;/strong&gt;"
}, 10, 2 );
```

クラシックフィルターはHTMLマークアップを期待する：

```php
add_filter( 'woocommerce_sale_flash', function( $html, $post, $product ) {
	return '<span class="onsale">Hot Deal</span>';
}, 10, 3 );
```

### 両方をサポート

ブロックテーマとクラシックテーマの両方をサポートするには、両方のフィルタを実装します：

```php
// Block filter
add_filter( 'woocommerce_sale_badge_text', 'my_custom_sale_badge', 10, 2 );

function my_custom_sale_badge( $sale_text, $product ) {
	return __( 'Special Offer', 'your-textdomain' );
}

// Classic filter
add_filter( 'woocommerce_sale_flash', 'my_classic_sale_flash', 10, 3 );

function my_classic_sale_flash( $html, $post, $product ) {
	return '<span class="onsale">' . __( 'Special Offer', 'your-textdomain' ) . '</span>';
}
```

-   セールバッジは、`$product->is_on_sale()`が`true`を返したときのみ表示されます。
-   フィルター出力はブロックによって`esc_html()`でエスケープされます。
-   カートブロックとチェックアウトブロックでは、代わりに[`saleBadgePriceFormat` filter](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/cart-line-items/#salebadgepriceformat)を使用してください。
