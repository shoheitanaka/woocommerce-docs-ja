---
post_title: How to check if WooCommerce is active
sidebar_label: Check if WooCommerce is active
---

# How to check if WooCommerce is active

WooCommerceの開発を行う場合、コードを実行する前にWooCommerceがインストールされ、有効になっていることを確認することが重要です。これにより、WooCommerceの関数やクラスが見つからないことによるエラーを防ぐことができます。

There are a few methods to achieve this. The first is to execute your code on the `woocommerce_loaded` action. This approach guarantees that WooCommerce and its functionalities are fully loaded and available for use. This is fired around the same time as the core `plugins_loaded` action. 

```php
add_action( 'woocommerce_loaded', 'prefix_woocommerce_loaded' );

function prefix_woocommerce_loaded() {
	// Custom code here. WooCommerce is active and all plugins have been loaded...
}
```

**注意**：この段階では、WordPressはまだ現在のユーザーデータを初期化していません。

Another method is to execute your code on the `woocommerce_init` action. This is executed right _after_ WooCommerce is active and initialized. This action (and the `before_woocommerce_init` action) fires in the context of the WordPress `init` action so at this point current user data has been initialized.

```php
add_action( 'woocommerce_init', 'prefix_woocommerce_init' );

function prefix_woocommerce_init() {
	// Custom code here. WooCommerce is active and initialized...
}
```

**Note**: The `before_woocommerce_init` hook is also an option, running just _before_ WooCommerce's initialization

上記のフックを使用することで、WooCommerce関数へのアクセスが許可され、さらなる条件チェックが可能になります。例えば、あなたのコードとの互換性を確保するためにWooCommerceのバージョンを確認したいかもしれません：

```php
add_action( 'woocommerce_init', 'prefix_woocommerce_init' );

function prefix_woocommerce_init() {
	// Only continue if we have access to version 8.7.0 or higher.
	if ( version_compare( wc()->version, '8.7.0', '<' ) ) {
		return;
	}

	// Custom code here. WooCommerce is active and initialized...
}
```

開発ニーズに基づいて適切なフックを選択することで、WooCommerce拡張機能やカスタマイズがシームレスかつ効率的に動作するようになります。
