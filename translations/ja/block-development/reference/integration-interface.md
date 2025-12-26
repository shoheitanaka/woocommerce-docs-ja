---
post_title: 'Handling scripts, styles, and data'
sidebar_label: 'Script, styles, and data handling'
---
# スクリプト、スタイル、データを扱う

## 問題

あなたはエクステンションの開発者で、ユーザーがクライアントサイドでエクステンションとやりとりできるようにするために、CSS と JavaScript を書きました。JavaScriptはサーバーサイドのデータにも依存しており、スクリプトでこれを利用できるようにしたいと考えています。

## 解決策

`IntegrationRegistry`を使用して`IntegrationInterface`を登録することができ、これはスクリプト、スタイル、データのエンキューを処理するクラスになります。各ブロック (ミニカート、カート、チェックアウト) に異なる `IntegrationInterface` を使用することもできますし、同じものを使用することもできます。

フックを使うべきである：`woocommerce_blocks_mini-cart_block_registration`。`woocommerce_blocks_cart_block_registration`と`woocommerce_blocks_checkout_block_registration`です。これらのフックは[`IntegrationRegistry`](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/trunk/src/Integrations/IntegrationRegistry.php)のインスタンスをコールバックに渡します。

このオブジェクトの`register`メソッドを使用して、`IntegrationInterface`を登録することができます。

## `IntegrationInterface` メソッド

はじめに、統合クラスである `IntegrationInterface` を作成する必要があります。これは[`IntegrationInterface`](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/trunk/src/Integrations/IntegrationInterface.php)というWooCommerce Blocksのインターフェイスを実装したクラスになります。

このセクションでは、インターフェイスのメンバーを順を追って見ていき、それらが何に使われるのかを説明する。

### `get_name()`。

これは、`IntegrationInterface`があなたの統合を名前空間化する方法です。ここで指定する名前は、拡張モジュール固有のものでなければなりません。このメソッドは文字列を返します。

### `initialize()`。

ここには、統合のためのセットアップや初期設定を置く必要があります。たとえば、拡張モジュールに必要なスクリプトやスタイルをここに登録することができます。このメソッドは何も返してはいけません。

### `get_script_handles()`。

フロントエンドコンテキストのクライアント側でエンキューさせたいスクリプトのハンドルをここに置きます。このメソッドは文字列の配列を返します。

### `get_editor_script_handles()`。

エディタコンテキストのクライアントサイドでエンキューさせたいスクリプトのハンドルが置かれる場所です。このメソッドは文字列の配列を返す必要があります。

### `get_script_data()`。

ここで、フロントエンドのスクリプトで使用したい値を設定します。このメソッドは連想配列を返す必要があり、そのキーは JavaScript の関数 `getSetting` を使用してデータを取得するために使用されます。

この配列のキーと値はすべてシリアライズ可能でなければならない。

## 使用例

私たちが拡張機能の作者だとしよう：inline_code_0__とします。ミニカート、カート、チェックアウトブロックのいずれかが使用されているときに、フロントエンドでスクリプト、スタイル、データをエンキューしたい。

また、サーバーサイドの関数からのデータをフロントエンドのスクリプトで利用できるようにしたい。

以下の例では、`/build/index.asset.php` ファイルを参照しています。これは[`DependencyExtractionWebpackPlugin`](https://www.npmjs.com/package/@wordpress/dependency-extraction-webpack-plugin)によって作成され、クライアント側スクリプトの依存関係をマッピングしたPHPファイルを作成し、`wp_register_script`の`dependencies`配列に追加できるようにします。

`IntegrationInterface`を作成しよう。

```php
<?php
use Automattic\WooCommerce\Blocks\Integrations\IntegrationInterface;

/**
 * Class for integrating with WooCommerce Blocks
 */
class WooCommerce_Example_Plugin_Integration implements IntegrationInterface {
	/**
	 * The name of the integration.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'woocommerce-example-plugin';
	}

	/**
	 * When called invokes any initialization/setup for the integration.
	 */
	public function initialize() {
		$script_path = '/build/index.js';
		$style_path = '/build/style-index.css';

    /**
     * The assets linked below should be a path to a file, for the sake of brevity
     * we will assume \WooCommerce_Example_Plugin_Assets::$plugin_file is a valid file path
    */
		$script_url = plugins_url( $script_path, \WooCommerce_Example_Plugin_Assets::$plugin_file );
		$style_url = plugins_url( $style_path, \WooCommerce_Example_Plugin_Assets::$plugin_file );

		$script_asset_path = dirname( \WooCommerce_Example_Plugin_Assets::$plugin_file ) . '/build/index.asset.php';
		$script_asset      = file_exists( $script_asset_path )
			? require $script_asset_path
			: array(
				'dependencies' => array(),
				'version'      => $this->get_file_version( $script_path ),
			);

		wp_enqueue_style(
			'wc-blocks-integration',
			$style_url,
			[],
			$this->get_file_version( $style_path )
		);

		wp_register_script(
			'wc-blocks-integration',
			$script_url,
			$script_asset['dependencies'],
			$script_asset['version'],
			true
		);
		wp_set_script_translations(
			'wc-blocks-integration',
			'woocommerce-example-plugin',
			dirname( \WooCommerce_Example_Plugin_Assets::$plugin_file ) . '/languages'
		);
	}

	/**
	 * Returns an array of script handles to enqueue in the frontend context.
	 *
	 * @return string[]
	 */
	public function get_script_handles() {
		return array( 'wc-blocks-integration' );
	}

	/**
	 * Returns an array of script handles to enqueue in the editor context.
	 *
	 * @return string[]
	 */
	public function get_editor_script_handles() {
		return array( 'wc-blocks-integration' );
	}

	/**
	 * An array of key, value pairs of data made available to the block on the client side.
	 *
	 * @return array
	 */
	public function get_script_data() {
	    $woocommerce_example_plugin_data = some_expensive_serverside_function();
	    return [
	        'expensive_data_calculation' => $woocommerce_example_plugin_data
        ];
	}

	/**
	 * Get the file modified time as a cache buster if we're in dev mode.
	 *
	 * @param string $file Local path to the file.
	 * @return string The cache buster value to use for the given file.
	 */
	protected function get_file_version( $file ) {
		if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG && file_exists( $file ) ) {
			return filemtime( $file );
		}

		// As above, let's assume that WooCommerce_Example_Plugin_Assets::VERSION resolves to some versioning number our
		// extension uses.
		return \WooCommerce_Example_Plugin_Assets::VERSION;
	}
}
```

前述の通り、WooCommerce Blocksに`IntegrationInterface`を登録する必要があります。ミニカート、カート、チェックアウトのいずれかが使用されたときにスクリプトが含まれるようにしたいので、3つのアクションのコールバックを登録する必要があります。

```php
add_action(
    'woocommerce_blocks_mini-cart_block_registration',
    function( $integration_registry ) {
        $integration_registry->register( new WooCommerce_Example_Plugin_Integration() );
    }
);
add_action(
    'woocommerce_blocks_cart_block_registration',
    function( $integration_registry ) {
        $integration_registry->register( new WooCommerce_Example_Plugin_Integration() );
    }
);
add_action(
    'woocommerce_blocks_checkout_block_registration',
    function( $integration_registry ) {
        $integration_registry->register( new WooCommerce_Example_Plugin_Integration() );
    }
);
```

これで、どちらかのブロックを含むページをロードすると、`initialize`に登録したスクリプトがロードされるはずだ！

### `get_script_data` で追加されたデータの取得

インターフェイスの`get_script_data`メソッドで、拡張機能にデータを関連付けた！

`@woocommerce/settings`パッケージには、`getSetting`というインポート可能なメソッドがある。このメソッドは文字列を受け取ります。`get_script_data`で追加されたデータを含む設定の名前は、`_data`でサフィックスされたインテグレーション名（つまり`get_name`が返す値）になります。この例では`woocommerce-example-plugin_data`です。

ここで返される値は、`get_script_data`で返される配列のキーをキーとした、古いJavaScriptオブジェクトで、値はシリアライズされます。
