---
sidebar_label: Cart and Checkout blocks
category_slug: cart-and-checkout
post_title: Cart and Checkout blocks
---
# カートとチェックアウトの拡張性を始める

このドキュメントは、カートブロックとチェックアウトブロックを拡張するために必要な可動部の高レベルの概要です。

まずはWordPressの[ブロック開発環境](https://developer.wordpress.org/block-editor/getting-started/devenv/)のドキュメントを読み、[チュートリアル]に従うことをお勧めします：最初のブロックを作る
](https://developer.wordpress.org/block-editor/getting-started/tutorial/)を参照してください。

## ブロックテンプレート・パッケージの例

WooCommerceリポジトリにブロックテンプレートの例があります。このドキュメントを読みながらこのテンプレートをセットアップしておくと、説明されているコンセプトの一部を理解するのに役立つかもしれません。サンプルブロックのインストールと実行方法は[`@woocommerce/extend-cart-checkout-block`パッケージドキュメント](https://github.com/woocommerce/woocommerce/tree/trunk/packages/js/extend-cart-checkout-block/README.md)を参照してください。

(注意：上記のリンク先のリポジトリにあるコードは、それだけではあまり役に立ちません。そこにあるコードはテンプレートコードです。READMEの指示に従うと、通常のJSやPHPに変換されます)。

## フロントエンドの拡張性

ブロックのフロントエンドを拡張するには、JavaScriptを使用しなければなりません。JavaScriptファイルは、それらが効果を発揮する前にキューに入れられ、ページに読み込まれなければなりません。

### ビルドシステム

ある拡張モジュールはとてもシンプルで、JavaScriptファイルをひとつだけ含むかもしれないし、他の拡張モジュールは複雑で、コードが複数のファイルに分かれているかもしれない。いずれにせよ、ファイルはバンドルされ、単一の出力ファイルにミニファイされることが推奨されます。拡張モジュールが特定のページでのみ読み込まれるような複数の異なる部分を持つ場合は、バンドル分割を推奨しますが、このドキュメントの範囲外です。

ビルドシステムをセットアップするには、WordPressに合わせ、[`@wordpress/scripts`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)と呼ばれるJavaScriptパッケージを使用することをお勧めします。このパッケージには`build`というスクリプトが含まれています。デフォルトでは、`wp_enqueue_script`を使ってスクリプトを1つの出力ファイルにビルドし、それをキューに入れることができます。

`@wordpress/scripts`にある`build`スクリプトの基本設定は、プラグインのルートに`webpack.config.js`ファイルを作成することで上書きすることができます。例のブロックは、基本設定をどのように拡張できるかを示しています。

#### `WooCommerceDependencyExtractionWebpackPlugin`

[`WordPress Dependency Extraction Webpack Plugin`](https://github.com/WordPress/gutenberg/tree/trunk/packages/dependency-extraction-webpack-plugin)および 
[`WooCommerce Dependency Extraction Webpack Plugin`](https://github.com/woocommerce/woocommerce/tree/trunk/packages/js/dependency-extraction-webpack-plugin#dependency-extraction-webpack-plugin).

このWebpackプラグインは、以下の目的で使用されます：

- WordPressサイトの共有スクリプトやモジュールとして利用可能な依存関係を外部化します。
    - つまり、`@woocommerce/blocks-checkout`から何かをインポートすると、コードを変更しなくてもそのパスが`window.wc.wcBlocksCheckout`に解決されます。これによってコードが読みやすくなり、パッケージがページに一度だけ読み込まれるようになります。
- 各エントリーポイントにアセットファイルを追加し、エントリーポイントの WordPress スクリプトやモジュールの依存リストを含むオブジェクトを宣言します。アセットファイルには、現在のソースコードに対して計算された現在のバージョンも含まれます。

このプラグインが出力するPHPの「アセットファイル」には、依存関係やパスなど、スクリプトが自身を登録するために必要な情報が含まれています。

WooCommerce Dependency Extraction Webpack Plugin を使用して Webpack でビルドされるコードを記述した場合、各エントリーポイントにアセットファイルが出力されます。このアセットファイルはスクリプトに関する情報、特に依存関係やバージョンを含む PHP ファイルです：

```php
<?php
return array(
  'dependencies' => array(
    'react',
    'wc-settings',
    'wp-block-editor',
    'wp-blocks',
    'wp-components',
    'wp-element',
    'wp-i18n',
    'wp-primitives'
  ),
  'version' => '455da4f55e1ac73b6d34'
);
```

スクリプトをエンキューするときにこのアセットファイルを使用すると、依存関係が正しく読み込まれ、クライアントがスクリプトの最新バージョンを取得できるようになります (バージョンは、スクリプトがキャッシュからではなく、新鮮な状態で取得されるようにするために使用されます)。

```php
<?php
$script_path = '/build/index.js';
$script_url  = plugins_url( $script_path, __FILE__ );

$script_asset_path = dirname( __FILE__ ) . '/build/index.asset.php';
$script_asset      = file_exists( $script_asset_path )
  ? require $script_asset_path
  : [
    'dependencies' => [],
    'version'      => $this->get_file_version( $script_path ),
  ];

wp_register_script(
  'example-blocks-integration-handle',
  $script_url,
  $script_asset['dependencies'],
  $script_asset['version'],
  true
);
```

`IntegrationInterface`を使用してスクリプトを正しく登録する方法については、[カートとチェックアウト - スクリプト、スタイル、およびデータの処理](/docs/block-development/reference/integration-interface/) ドキュメントを参照してください。

### ブロックの作成

サンプルブロックの中には、「checkout-newsletter-subscription-block」ディレクトリがあり、Checkoutにインナーブロックを登録するために必要なファイルが含まれています。サンプルのブロックテンプレートは、単一のブロックをインポートしてビルドするように設定されているだけですが、Webpackの設定を変更することで、複数のブロックをビルドすることができます。このドキュメントはサポートしていませんので、代わりに [Webpack ドキュメント](https://webpack.js.org/concepts/) を参照してください。

チュートリアル]で扱われている原則：最初のブロックを作る
](https://developer.wordpress.org/block-editor/getting-started/tutorial/)で説明した原則がここにも当てはまります。

### フロントエンドで既存の値を変更する

たとえば、拡張機能がフィルターを通して既存のコンテンツを変更するだけの場合、拡張機能を思い通りに動作させるためにブロックを作成する必要はないかもしれません。

この場合、サンプルブロックからブロックフォルダを削除し、そのディレクトリから読み込まないようにWebpackの設定ファイルを修正し、エントリのJavaScriptファイルに必要なコードを含めることができます。

フィルタの使い方の詳細は、[Filter Registry](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/packages/checkout/filter-registry/README.md)と[Available Filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)のドキュメントを参照してください。

### WooCommerceコンポーネントをエクステンションにインポートする

コンポーネントは`@woocommerce/blocks-components`からインポートできます（`@woocommerce/dependency-extraction-webpack-plugin`によって`window.wc.blocksComponents`に外部化されます）。利用可能なコンポーネントのリストは[WooCommerce Storybook](https://woocommerce.github.io/woocommerce/?path=/docs/woocommerce-blocks_external-components-button--docs)の「WooCommerce Blocks -> External components」で確認できます。

`Button`コンポーネントのインポート例は以下の通り：

```js
import { Button } from '@woocommerce/blocks-components';

const MyComponent = () => {
  return <div class="my-wrapper">
    <Button type="button" />
  </div>;
}
```

### WooCommerce (React) フックのインポート

現在のところ、どのフックも外部で使用されるようには設計されていませんので、`useStoreCart`のようなフックをインポートしようとしてもサポートされていません。代わりに、[`wc/store/...`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/data-store/)データストアからデータを取得することが推奨されます。

## バックエンドの拡張性

### チェックアウトプロセス中の情報の変更

カートとチェックアウトブロックのサーバーサイド部分をPHPを使って変更することが可能です。ショートコードのカート/チェックアウト体験からいくつかのアクションやフィルターも動作しますが、すべてではありません。私たちは、どのフックがサポートされているか、また代替フックの概要をまとめたドキュメント（[フック代替ドキュメント](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/hooks/hook-alternatives.md) ）を用意しています。

### 店舗APIの拡張

Store APIの動作方法を変更したり、レスポンス内のデータを拡張したりする必要がある場合は、[Store APIの拡張](/docs/apis/store-api/extending-store-api/)を参照してください。
