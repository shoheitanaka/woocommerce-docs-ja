---
post_title: Change number of related products displayed
---

# Change number of related products displayed

子テーマのfunctions.phpファイルにコードを追加するか、[Code snippets](https://wordpress.org/plugins/code-snippets/)プラグインのようなカスタム関数を追加できるプラグインを使用します。親テーマの `functions.php` ファイルに直接カスタムコードを追加することは避けてください。

なお、テーマのコード化により、すべてのテーマで動作するわけではありません。

```php
if ( ! function_exists( 'YOUR_PREFIX_related_products_args' ) ) {
	/**
	 * Change number of related products output.
	 *
	 * @param  array $args The related products args.
	 * @return array The modified related products args.
	 */
	function YOUR_PREFIX_related_products_args( $args ) {
		if ( ! is_array( $args ) ) {
			$args = array();
		}

		$args['posts_per_page'] = 4; // 4 related products.
		$args['columns']        = 2; // Arranged in 2 columns.

		return $args;
	}
}
add_filter( 'woocommerce_output_related_products_args', 'YOUR_PREFIX_related_products_args', 20 );
```
