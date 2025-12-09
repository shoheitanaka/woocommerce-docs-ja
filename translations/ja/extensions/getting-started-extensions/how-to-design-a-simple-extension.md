---
post_title: How to design a simple extension
sidebar_label: Design a simple extension
sidebar_position: 1
---

# How to design a simple extension

## Introduction

マーチャントと買い物客にファーストクラスのエクスペリエンスを提供するWooCommerceエクステンションを構築するには、PHPとモダンなJavaScriptを組み合わせたハイブリッドな開発アプローチが必要です。PHPは拡張機能のライフサイクルとサーバーサイドのオペレーションを処理し、モダンなJavaScriptはユーザーインターフェイスの外観と動作を形成します。

## The main plugin file

拡張機能のメインの PHP ファイルはブートストラップファイルです。このファイルには拡張機能に関する重要なメタデータが含まれており、WordPress と WooCommerce がエコシステムの統合処理で使用します。このファイルの名前には特に決まりはありませんが、プラグイン名のハイフンを使うのが一般的なベストプラクティスです。(例: my-extension.php)

## Declaring extension metadata

Your extension's main plugin file should have a header comment that includes a number of important pieces of metadata about your extension. WordPress has a list of [header requirements](https://developer.wordpress.org/plugins/plugin-basics/header-requirements/) to which all plugins must adhere, but there are additional considerations for WooCommerce extensions:

- The `Author` and `Developer` fields are required and should be set to  
  either your name or your company name.

- The `Developer URI` field should be your official webpage URL.

- The `Plugin URI` field should contain the URL of the extension's product page in the WooCommerce Marketplace or the extension's official landing page on your website.

- The `Requires Plugins` field should list the slugs of any required plugins, separated by commas. WooCommerce extensions should require WooCommerce to activate. 

- The `Woo` field is used for extensions listed in the WooCommerce Marketplace. This code is automatically added upon deployment for products sold on WooCommerce.com to facilitate updates. Please don't add it manually, and refrain from adding it to products offered outside of the WooCommerce Marketplace. Including this header in other versions will prevent updates from working.

下記はWooCommerce Marketplaceに掲載されているエクステンションのヘッダーコンテンツの例です。

```php
/**
 * Plugin Name: My Great Extension for WooCommerce
 * Plugin URI: https://woocommerce.com/products/my-extension-name/
 * Description: Your extension's description text.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: http://yourdomain.com/
 * Developer: Your Name
 * Developer URI: http://yourdomain.com/
 * Text Domain: my-extension-name
 * Domain Path: /languages
 * Requires Plugins: woocommerce
 *
 * Woo: 12345:342928dfsfhsf8429842374wdf4234sfd
 *
 * License: GNU General Public License v3.0
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 */
```

## Preventing data leaks

ベストプラクティスとして、拡張モジュールのPHPファイルの先頭に、WordPressのABSPATH定数をチェックする条件文を記述してください。この定数が定義されていない場合、スクリプトは終了します。

`defined( 'ABSPATH' ) || exit;`

このチェックは、PHPファイルがブラウザから直接実行されるのを防ぎ、代わりにWordPressのアプリケーション環境からのみ実行できるようにします。

## Managing extension lifecycle

メインの PHP ファイルは、拡張モジュールと WordPress の間の主要な結合点なので、 拡張モジュールのライフサイクルを管理するためのハブとして使用する必要があります。非常に基本的なレベルでは、これは処理を意味します：

- アクティベーション
- 実行
- 無効化

これら3つの大まかなライフサイクル領域から始めて、エクステンションの機能をさらに細分化することで、懸念事項を適切に分離することができます。

## Handling activation and deactivation

WooCommerceの拡張機能でよくあるパターンは、メインPHPファイル内に有効化と無効化のフックとなる専用の関数を作成することです。そして、該当する登録関数を使用してWordPressにこれらのフックを登録します。これにより、プラグインが有効化または無効化されたときに関数を呼び出すようにWordPressに指示します。次の例を見てください：

```php
function my_extension_activate() {
    // Your activation logic goes here.
}
register_activation_hook( __FILE__, 'my_extension_activate' );
```

```php
function my_extension_deactivate() {
    // Your deactivation logic goes here.
}
register_deactivation_hook( __FILE__, 'my_extension_deactivate' );
```

## Maintaining a separation of concerns

拡張モジュールのコードを整理する方法は数多くあります。WordPress Plugin Developer Handbook にベストプラクティスの概要があります。どのような方法でコードを整理するにしても、WordPress の共有アプリケーション空間という性質上、相互運用性を意識して構築することが不可欠です。エクステンションを最適化し、他のエクステンションの良き隣人であることを保証するのに役立つ、いくつかの共通原則があります：

- 他の拡張モジュールとの衝突を避けるために、名前空間と接頭辞を使用する。
- 拡張機能の機能をカプセル化するためにクラスを使用する。
- 既存の宣言、代入、実装をチェックする。

## The core extension class

前述したように、クラスを使って拡張機能のさまざまな部分をカプセル化することは、相互運用性を高めるだけでなく、コードの保守やデバッグを容易にする重要な手段です。拡張モジュールにはさまざまなクラスがあり、それぞれが機能の一部を担っています。少なくとも、エクステンションの中心となるクラスを定義して、 そのクラス自身のインスタンスのセットアップや初期化、管理を行うようにしましょう。

## Implementing a singleton pattern

拡張機能の実行時にメインクラスのインスタンスを複数作成する特別な理由がない限り、グローバルスコープには常に1つのインスタンスしか存在しないようにする必要があります。これを行う一般的な方法は、シングルトンパターンを使用することです。PHP のクラスでシングルトンを作成するには、いくつかの方法があります。以下はシングルトンの基本的な例で、 前述のベストプラクティスである名前空間や宣言前のチェックも実装しています：

```php
if ( ! class_exists( 'My_Extension' ) ) :
    /**
     * My Extension core class
     */
    class My_Extension {
        /**
         * The single instance of the class.
         */
        protected static $_instance = null;

        /**
         * Constructor.
         */
        protected function __construct() {
            // Instantiation logic will go here.
        }

        /**
         * Main Extension Instance.
         * Ensures only one instance of the extension is loaded or can be loaded.
         */
        public static function instance() {
            if ( is_null( self::$_instance ) ) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }

        /**
         * Cloning is forbidden.
         */
        public function __clone() {
            // Override this PHP function to prevent unwanted copies of your instance.
            //   Implement your own error or use `wc_doing_it_wrong()`
        }

        /**
         * Unserializing instances of this class is forbidden.
         */
        public function __wakeup() {
            // Override this PHP function to prevent unwanted copies of your instance.
            //   Implement your own error or use `wc_doing_it_wrong()`
        }
    }
endif;
```

Notice that the example class above is designed to be instantiated by calling the static class method `instance()`, which will either return an existing instance of the class or create one and return it. In order to fully protect against unwanted instantiation, it's also necessary to override the built-in magic methods `__clone()` and `__wakeup()`. You can implement your own error logging here or use something like `_doing_it_wrong()` which handles error logging for you. You can also use WooCommerce's wrapper function `wc_doing_it_wrong()` here. Just be sure your code checks that the function exists first.

## Constructor

上の例では、デモンストレーションのために空のコンストラクタを用意しています。しかし、実際のWooCommerceエクステンションでは、このコンストラクタはいくつかの重要なタスクを処理します：

- WooCommerceと他の兄弟依存関係のアクティブなインストールをチェックします。

- あなたのクラスが依存する他のファイルをロードするセットアップ・メソッドを呼び出します。
- 初期化メソッドを呼び出し、クラスとその依存関係を準備します。

上記の例を基にすると、次のようになる：

```php
protected function __construct() {
    $this->includes();
    $this->init();
    // You might also include post-setup steps such as showing activation notices here.
}
```

## Loading dependencies

上記のincludes()関数は、他のクラスの依存関係を読み込む場所であり、通常はincludeまたはrequireコンストラクトを使用します。外部依存関係を管理して読み込む一般的な方法は、Composerのオートロード機能を使うことですが、特定のファイルを個別に読み込むこともできます。外部依存関係をオートロードする方法については、Composerのドキュメントを参照してください。Composerと内部インクルージョンの両方を使用するセットアップ方法の基本的な例を以下に示します。

```php
public function includes() {
    $loader = include_once dirname( __FILE__ ) . '/' . 'vendor/autoload.php';

    if ( ! $loader ) {
        throw new Exception( 'vendor/autoload.php missing please run `composer install`' );
    }

    require_once dirname( __FILE__ ) . '/' . 'includes/my-extension-functions.php';
}
```

## Initialization

The `init()` function above is where you should handle any setup for the classes you loaded in the includes() method. This step is where you'll often perform any initial registration with relevant actions or filters. It's also where you can register and enqueue your extension's JavaScripts and stylesheets.

初期化メソッドの例を挙げよう：

```php
private function init() {
    // Set up cache management.
    new My_Extension_Cache();

    // Initialize REST API.
    new My_Extension_REST_API();

    // Set up email management.
    new My_Extension_Email_Manager();

    // Register with some-action hook
    add_action( 'some-action', 'my-extension-function' );
}
```

コアクラスの初期化メソッドには、拡張モジュールのアーキテクチャーによってさまざまなものがあります。ここで重要なのは、この関数は拡張モジュールがウェブリクエストに応答するために必要な初期登録やセットアップを行うための中心的な役割を果たすということです。

## Delaying initialization

上でregister_activation_hook()で設定したWordPressの有効化フックは、拡張機能のメインクラスをインスタンス化するのに最適な場所のように見えるかもしれません。しかし、プラグインのためのプラグインであることから、WooCommerce 拡張モジュールが正しく機能するためには WooCommerce がロードされている必要があります。

そのためには、拡張モジュールのアクティベーションフックにフックするのではなく、WordPress の plugins_loaded アクションを使用して拡張モジュールのコアクラスをインスタンス化し、そのシングルトンを $GLOBALS 配列に追加します。

```php
function my_extension_initialize() {
    // This is also a great place to check for the existence of the WooCommerce class
    if ( ! class_exists( 'WooCommerce' ) ) {
    // You can handle this situation in a variety of ways,
    //   but adding a WordPress admin notice is often a good tactic.
        return;
    }

    $GLOBALS['my_extension'] = My_Extension::instance();
}
add_action( 'plugins_loaded', 'my_extension_initialize', 10 );
```

上の例では、WordPress はすべてのプラグインがロードされるまで待ってから、コアクラスをインスタンス化しようとします。add_action()の3番目の引数は関数の優先度を表し、最終的にplugins_loadedアクションにフックする関数の実行順序を決定します。ここで10の値を使用することで、拡張機能がインスタンス化される前に他のWooCommerce関連機能が実行されるようになります。

## Handling execution

エクステンションがアクティブになり、初期化されると、可能性は大きく広がります。ここがエクステンションでマジックが起こる場所であり、それを定義するのはあなた次第です。具体的な機能の実装はこのガイドの範囲外ですが、エクステンションの機能をどのように構築するか考える際に念頭に置いておくべきベストプラクティスがいくつかあります。

- イベントドリブンを意識しましょう。あなたのエクステンションを使用するマーチャントや買い物客はウェブリクエストを使用してWooCommerceとやり取りをします。

- ビジネス・ロジックとプレゼンテーション・ロジックを別々にする。これは、バックエンドの処理とフロントエンドのレンダリングを別々のクラスで管理するのと同じくらい簡単なことです。

- 可能であれば、肥大化したクラスや長い関数を作るのではなく、機能を小さなパーツに分割し、専用のクラスに責任を委譲する。

クラスとフックの詳細なドキュメントはWooCommerce Core Code Referenceに、REST APIエンドポイントの追加ドキュメントはWooCommerce REST API Documentationにあります。

## Handling deactivation

先にメイン PHP ファイルで register_deactivation_hook() を使って設定した WordPress の無効化フックは、マーチャントが拡張機能を無効化したときに処理する必要のあるクリーンアップ機能を集約するのに最適な場所です。WordPress 関連の無効化タスクに加えて、WooCommerce 関連のクリーンアップも行う必要があります：

- スケジュールされたアクションの削除
- 管理者受信トレイのノートの削除
- 管理者タスクの削除

## Uninstallation

マーチャントがエクステンションを無効化したときに、エクステンションが作成したすべてを完全に元に戻すことは確かに可能ですが、ほとんどの場合、それはお勧めできませんし、現実的ではありません。その代わりに、その動作はアンインストール時に行うのがベストです。

アンインストールの処理については、WordPressプラグインハンドブックのガイドラインに従うのが最善です。

## Putting it all together

以下は、とてもシンプルな拡張機能のメインプラグインファイルの例です：

```php
/**
 * Plugin Name: My Great Extension for WooCommerce
 * Plugin URI: https://woocommerce.com/products/my-extension-name/
 * Description: Your extension's description text.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: http://yourdomain.com/
 * Developer: Your Name
 * Developer URI: http://yourdomain.com/
 * Text Domain: my-extension-name
 * Domain Path: /languages
 *
 * Woo: 12345:342928dfsfhsf8429842374wdf4234sfd
 *
 * License: GNU General Public License v3.0
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 */

defined( 'ABSPATH' ) || exit;

/**
 * Activation and deactivation hooks for WordPress
 */
function myPrefix_extension_activate() {
    // Your activation logic goes here.
}
register_activation_hook( __FILE__, 'myPrefix_extension_activate' );

function myPrefix_extension_deactivate() {
    // Your deactivation logic goes here.

    // Don't forget to:
    // Remove Scheduled Actions
    // Remove Notes in the Admin Inbox
    // Remove Admin Tasks
}
register_deactivation_hook( __FILE__, 'myPrefix_extension_deactivate' );


if ( ! class_exists( 'My_Extension' ) ) :
    /**
     * My Extension core class
     */
    class My_Extension {

        /**
         * The single instance of the class.
         */
        protected static $_instance = null;

        /**
         * Constructor.
         */
        protected function __construct() {
            $this->includes();
            $this->init();
        }

        /**
         * Main Extension Instance.
         */
        public static function instance() {
            if ( is_null( self::$_instance ) ) {
                self::$_instance = new self();
            }
            return self::$_instance;
        }

        /**
         * Cloning is forbidden.
         */
        public function __clone() {
            // Override this PHP function to prevent unwanted copies of your instance.
            //   Implement your own error or use `wc_doing_it_wrong()`
        }

        /**
         * Unserializing instances of this class is forbidden.
         */
        public function __wakeup() {
            // Override this PHP function to prevent unwanted copies of your instance.
            //   Implement your own error or use `wc_doing_it_wrong()`
        }

        /**
        * Function for loading dependencies.
        */
        private function includes() {
            $loader = include_once dirname( __FILE__ ) . '/' . 'vendor/autoload.php';

            if ( ! $loader ) {
                throw new Exception( 'vendor/autoload.php missing please run `composer install`' );
            }

            require_once dirname( __FILE__ ) . '/' . 'includes/my-extension-functions.php';
        }

        /**
         * Function for getting everything set up and ready to run.
         */
        private function init() {

            // Examples include:

            // Set up cache management.
            // new My_Extension_Cache();

            // Initialize REST API.
            // new My_Extension_REST_API();

            // Set up email management.
            // new My_Extension_Email_Manager();

            // Register with some-action hook
            // add_action('some-action', 'my-extension-function');
        }
    }
endif;

/**
 * Function for delaying initialization of the extension until after WooCommerce is loaded.
 */
function my_extension_initialize() {

    // This is also a great place to check for the existence of the WooCommerce class
    if ( ! class_exists( 'WooCommerce' ) ) {
    // You can handle this situation in a variety of ways,
    //   but adding a WordPress admin notice is often a good tactic.
        return;
    }

    $GLOBALS['my_extension'] = My_Extension::instance();
}

add_action( 'plugins_loaded', 'my_extension_initialize', 10 );
```
