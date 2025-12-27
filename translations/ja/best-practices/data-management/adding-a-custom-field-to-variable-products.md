---
post_title: How to add a custom field to simple and variable products
sidebar_label: Add custom fields to products
---

# How to add a custom field to simple and variable products

このチュートリアルでは、商品のカスタムフィールドを作成してストアに表示する方法を学びます。一緒にスケルトンプラグインをセットアップし、WPの命名規則とWooCommerceフックについて学びましょう。最終的には、カスタムフィールドを追加するためのプラグインが機能するようになります。

[完全なプラグインコード](https://github.com/EdithAllison/woo-product-custom-fields)はWordPress 6.2とWooCommerce 7.6.0に基づいて書かれています。

## 前提条件

このチュートリアルを行うには、WooCommerceプラグインが有効化されたWordPressがインストールされている必要があり、少なくとも1つの[シンプルな商品セットアップ](https://woocommerce.com/document/managing-products/)が必要です。

## プラグインの設定

まずは、[スケルトンプラグインを作成する](https://github.com/woocommerce/woocommerce/tree/trunk/packages/js/create-woo-extension)手順を実行しましょう。

まず、wp-content/pluginsフォルダに移動し、実行します：

```sh
npx @wordpress/create-block -t @woocommerce/create-woo-extension woo-product-fields
```

そして新しいフォルダに移動し、インストールとビルドを実行する：

```sh
cd woo-product-fields
npm install # Install dependencies
npm run build # Build the javascript
```

WordPressには独自のクラスファイル命名規則があり、PSR-4ではそのままでは動作しません。命名規則については、[WPハンドブック](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/#naming-conventions)を参照してください。ここでは、標準的なフォーマットである「class-my-classname.php」フォーマットを使用することにします：

```json
"autoload": {
   	 "classmap": ["includes/", "includes/admin/"]
    },
```

保存後、ターミナルで dump-autoload を実行してクラスマップを生成します：

```sh
composer dump-autoload -o
```

これにより、/includes/と/includes/admin/フォルダにあるすべてのクラスのリストを含む新しいvendor/composer/autoload_classmap.phpファイルが生成される。クラス・ファイルを追加、削除、移動するときには、このコマンドを繰り返す必要がある。

## WooCommerceフック

私たちの目的はWooCommerce商品に新しいカスタムテキストフィールドを作成し、新しい在庫情報を保存してストアに表示することです。これを行うには、管理エリアのWooデータの在庫情報を保持するセクションを変更する必要があります。

WooCommerceでは、[hooks](https://developer.wordpress.org/plugins/hooks/)を使ってこれらのセクションにコードを追加することができます。インベントリ」セクションでは、以下のアクションフックを利用できます：

Wooエクステンションでは、フィールドの最後に`woocommerce_product_options_inventory_product_data`を追加します。

## クラスの作成

さっそく、フィールドのコードを格納する新しいクラスを作りましょう。`class-product-fields.php`という名前で新しいファイルを`/includes/admin/`フォルダに追加します。クラス内に、名前空間、ファイルを直接呼び出そうとした場合のアボート、`hooks()`メソッドを呼び出す`__construct`メソッドを追加します：

```php
<?php

namespace WooProductField\Admin;

defined( 'ABSPATH' ) || exit;

class ProductFields {

    public function __construct() {
		$this->hooks();
    }

    private function hooks() {}
}
```

次にターミナルで`composer dump-autoload -o`を実行してクラス・マップを再生成する。これが終わったら、`setup.php` `__construct()` 関数にクラスを追加する：

```php
class Setup {
    public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'register_scripts' ) );

		new ProductFields();
    }
}
```

## カスタムフィールドの追加

クラスがセットアップされ、呼び出されるようになったので、カスタムフィールドを追加する関数を作成できます。WooCommerceには独自の`woocommerce_wp_text_input( $args )`関数があり、ここで使用できます。`$args`はテキスト入力データを設定するための配列で、保存されているメタデータにアクセスするためにグローバルな$product_objectを使用します。

```php
public function add_field() {
	global $product_object;
	?>
	<div class="inventory_new_stock_information options_group show_if_simple show_if_variable">
		<?php woocommerce_wp_text_input(
			array(
				'id'      	=> '_new_stock_information',
				'label'   	=> __( 'New Stock', 'woo_product_field' ),
				'description' => __( 'Information shown in store', 'woo_product_field' ),
				'desc_tip'	=> true,
				'value' => $product_object->get_meta( '_new_stock_information' )
			)
		); ?>
	</div>
	<?php
}
```

配列の引数を見てみよう。IDはデータベースのmeta_keyとして使用されます。LabelとDescriptionはデータセクションに表示され、desc_tipをtrueに設定することで、情報アイコンの上にカーソルを置いたときに表示されます。最後の引数の値は、値がすでに保存されている場合に、それが表示されることを保証します。

divクラスでは、`show_if_simple`と`show_if_variable`というクラス名が、セクションを表示するタイミングを制御します。これは、セクションを動的に非表示/表示するJSコードとリンクしています。例えば、可変商品のセクションを非表示にしたい場合は、`show_if_variable`を削除すればよい。

フィールドができたので、それを保存する必要があります。このためには、`$post_id` と `$post` の2つの引数を取る woocommerce_process_product_meta にフックします：

```php
public function save_field( $post_id, $post ) {
	if ( isset( $_POST['_new_stock_information'] ) ) {
		$product = wc_get_product( intval( $post_id ) );
		$product->update_meta_data( '_new_stock_information', sanitize_text_field( $_POST['_new_stock_information'] ) );
		$product->save_meta_data();
	}
}
```

この関数は、新しいフィールドが POST 配列にあるかどうかをチェックします。Yesの場合、商品オブジェクトを作成し、メタデータを更新し、メタデータを保存します。`update_meta_data`関数は、既存のメタフィールドを更新するか、新しいメタフィールドを追加します。そして、データベースに挿入するので、[フィールドの値をサニタイズする](https://developer.wordpress.org/apis/security/sanitizing/)必要があります。

そして、すべてをうまく機能させるために、フックを加える：

```php
private function hooks() {
	add_action( 'woocommerce_product_options_inventory_product_data', array( $this, 'add_field' ) );
	add_action( 'woocommerce_process_product_meta', array( $this, 'save_field' ), 10, 2 );
}
```

商品画面を更新すると、新しいフィールドが表示されます。

データを追加して商品を保存すると、新しいメタデータがデータベースに挿入される。

この時点で、商品のカスタムフィールドを商品メタとして保存するエクステンションが動作しています。
ストアにフィールドを表示する
新しいフィールドをストアに表示したい場合、Woo商品クラスの`get_meta()`メソッドを使います：`$product->get_meta( '_new_stock_information' )`メソッドを使います。

新しいファイル/includes/class-product.phpを作成して始めましょう。これは`/admin/`フォルダの外にあることにお気づきかもしれません。クラスをセットアップするときに、名前空間もそれに合わせて調整します：

```php
<?php

namespace WooProductField;

defined( 'ABSPATH' ) || exit;

class Product {
    public function __construct() {
		$this->hooks();
    }

    private function hooks() { }
}
```

再び`composer dump-autoload -o`を実行してクラス・マップを更新する。

拡張機能のセットアップをご覧になった方は、`/admin/setup.php`がWP Admin内にいるときだけ呼び出されることにお気づきかもしれません。そこで、新しいクラスを呼び出すために、`/woo-product-field.php`に直接追加します：

```php
public function __construct() {
	if ( is_admin() ) {
		new Setup();
	}
	new WooProductField\Product();
}
```

フィールドをフロントに追加するために、いくつかのオプションがあります。テーマテンプレートを作成することもできますが、WooCommerce互換のテーマを使っていて、他の変更を加える必要がないのであれば、フックを使うのが手っ取り早い方法です。`/woocommerce/includes/wc-template-hooks.php`を調べると、商品ページ上部のセクションを制御する`woocommerce_single_product_summary`のすべての既存のアクションを見ることができます：

この拡張機能では、21を優先順位として、抜粋の後に新しい株式情報を追加しよう：

```php
private function hooks() {
	add_action( 'woocommerce_single_product_summary', array( $this, 'add_stock_info' ), 21 );
}
```

私たちの関数では、株価情報を[適切なエスケープ関数](https://developer.wordpress.org/apis/security/escaping/)で出力していますが、この場合は`esc_html()`を使ってプレーンテキストにすることを提案します。

```php
public function add_stock_info() {
	global $product;
	?>
	<p><?php echo esc_html( $product->get_meta( '_new_stock_information' ) ); ?> </p>
	<?php

    }
```

商品ページを更新すると、在庫情報が抜粋のすぐ下に表示されます：

素晴らしい！あなたはこのチュートリアルを完了し、新しいカスタムフィールドを追加してストアに表示するWooCommerceエクステンションを動作させています！フックを使ってWooCommerceを拡張し、あなたやあなたのクライアントのショップの要件に合わせてカスタマイズすることがいかに簡単であるかがお分かりいただけたと思います！

以下は、可変商品に興味のある方のためのボーナス・タスクです。後日、自由に戻ってくることができる。

## How to handle variable products?

上記の例はシンプルな商品で行いました。しかし、例えば複数のサイズのTシャツのようなバリエーションがあり、それぞれのバリエーションに対して異なる在庫情報を保存したい場合はどうすればいいでしょうか？WooCommerceは[可変商品タイプ](https://woocommerce.com/document/variable-product/)を使ってそれを可能にします。

可変商品タイプは、その子としてバリエーションを持ちます。バリエーションにカスタムフィールドを追加するには、`woocommerce_variation_options_inventory`フックを使用し、`woocommerce_save_product_variation`を保存します：

```php
private function hooks() {
	add_action( 'woocommerce_product_options_inventory_product_data', array( $this, 'add_field' ) );
	add_action( 'woocommerce_process_product_meta', array( $this, 'save_field' ), 10, 2 );

	add_action( 'woocommerce_variation_options_inventory', array( $this, 'add_variation_field' ), 10, 3 );
	add_action( 'woocommerce_save_product_variation', array( $this, 'save_variation_field' ), 10, 2 );
}
```

主な違いは、バリエーションを区別するために$loop idを使用する必要があることと、全幅のテキスト入力として表示するために`wrapper_class`を使用することです：

```php
public function add_variation_field( $loop, $variation_data, $variation ) {
	$variation_product = wc_get_product( $variation->ID );

	woocommerce_wp_text_input(
		array(
			'id' => '_new_stock_information' . '[' . $loop . ']',
			'label' => __( 'New Stock Information', 'woo_product_field' ),
			'wrapper_class' => 'form-row form-row-full',
			'value' => $variation_product->get_meta( '_new_stock_information' )
		)
	);
}
```

節約するために私たちは使う：

```php
public function save_variation_field( $variation_id, $i  ) {
	if ( isset( $_POST['_new_stock_information'][$i] ) ) {
		$variation_product = wc_get_product( $variation_id );
		$variation_product->update_meta_data( '_new_stock_information', sanitize_text_field( $_POST['_new_stock_information'][$i] ) );
		$variation_product->save_meta_data();
	}
}
```

そして、新しい在庫情報を保存する新しいバリエーションフィールドができました。新しいフィールドが表示されない場合は、バリエーション詳細のチェックボックスをオンにして、そのバリエーションの「在庫管理」を有効にしてください。

フロントストアのバリエーション表示は、顧客が選択したときにページ上の一部のコンテンツのみが更新されるため、可変商品の場合は少し異なる動作をします。これはこのチュートリアルの範囲を超えていますが、もし興味があれば、`/woocommerce/assets/js/frontend/add-to-cart-variation.js`でWooCommerceがどのようにしているのかご覧ください。

## フックの見つけ方

人それぞれ好みの方法があるでしょうが、私の場合はWooCommerceプラグインのコードを見るのが一番手っ取り早い方法です。各データセクションのコードは`/woocommerce/includes/admin/meta-boxes/views`にあります。在庫セクションがどのように処理されるかは`html-product-data-inventory.php`ファイルを、バリエーションは`html-variation-admin.php`をご覧ください。
