---
post_title: Override loop template and show quantities next to add to cart buttons
---

# Override loop template and show quantities next to add to cart buttons

このコードを子テーマの`functions.php`ファイルに追加するか、[Code Snippets](https://wordpress.org/plugins/code-snippets/)プラグインのようなカスタム関数を追加できるプラグインを使用します。親テーマのfunctions.phpファイルに直接カスタムコードを追加することは避けてください。

```php
if ( ! function_exists( 'YOUR_PREFIX_quantity_inputs_for_woocommerce_loop_add_to_cart_link' ) ) {
  /**
   * Override loop template and show quantities next to add to cart buttons
   * @param  string $html    Default loop template.
   * @param  object $product Product data.
   * @return string          Modified loop template.
   */
	function YOUR_PREFIX_quantity_inputs_for_woocommerce_loop_add_to_cart_link( $html, $product ) {
		if ( $product && $product->is_type( 'simple' ) && $product->is_purchasable() && $product->is_in_stock() && ! $product->is_sold_individually() ) {
			$html  = '<form action="' . esc_url( $product->add_to_cart_url() ) . '" class="cart" method="post" enctype="multipart/form-data">';
			$html .= woocommerce_quantity_input( array(), $product, false );
			$html .= '<button type="submit" class="button alt">' . esc_html( $product->add_to_cart_text() ) . '</button>';
			$html .= '</form>';
		}

		return $html;
	}
	add_filter( 'woocommerce_loop_add_to_cart_link', 'YOUR_PREFIX_quantity_inputs_for_woocommerce_loop_add_to_cart_link', 10, 2 );
}
```
