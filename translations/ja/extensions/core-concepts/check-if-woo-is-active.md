---
post_title: How to check if WooCommerce is active
sidebar_label: Check if WooCommerce is active
---
# WooCommerceが有効かどうかを確認する方法

WooCommerceの開発を行う場合、コードを実行する前にWooCommerceがインストールされ、有効になっていることを確認することが重要です。これにより、WooCommerceの関数やクラスが見つからないことによるエラーを防ぐことができます。

これを実現するにはいくつかの方法がある。一つ目は`woocommerce_loaded`アクションでコードを実行することです。この方法はWooCommerceとその機能が完全にロードされ、使用可能であることを保証します。これはコアの`plugins_loaded`アクションと同時に実行されます。 

```php
add_action( 'woocommerce_loaded', 'prefix_woocommerce_loaded' );

function prefix_woocommerce_loaded() {
	// Custom code here. WooCommerce is active and all plugins have been loaded...
}
```

**注意**：この段階では、WordPressはまだ現在のユーザーデータを初期化していません。

もう一つの方法は`woocommerce_init`アクションでコードを実行することです。これはWooCommerceがアクティブになり初期化された直後に実行されます。このアクション（および`before_woocommerce_init`アクション）はWordPressの`init`アクションのコンテキストで実行されるため、この時点で現在のユーザーデータは初期化されています。

```php
add_action( 'woocommerce_init', 'prefix_woocommerce_init' );

function prefix_woocommerce_init() {
	// Custom code here. WooCommerce is active and initialized...
}
```

**注意**：`before_woocommerce_init`フックもオプションで、WooCommerceの初期化の直前に実行されます。

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
