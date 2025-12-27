---
post_title: How to design a simple extension
sidebar_label: Design a simple extension
sidebar_position: 1
---
# シンプルなエクステンションの設計方法

## はじめに

マーチャントと買い物客にファーストクラスのエクスペリエンスを提供するWooCommerceエクステンションを構築するには、PHPとモダンなJavaScriptを組み合わせたハイブリッドな開発アプローチが必要です。PHPは拡張機能のライフサイクルとサーバーサイドのオペレーションを処理し、モダンなJavaScriptはユーザーインターフェイスの外観と動作を形成します。

## メインプラグインファイル

拡張機能のメインの PHP ファイルはブートストラップファイルです。このファイルには拡張機能に関する重要なメタデータが含まれており、WordPress と WooCommerce がエコシステムの統合処理で使用します。このファイルの名前には特に決まりはありませんが、プラグイン名のハイフンを使うのが一般的なベストプラクティスです。(例: my-extension.php)

## 拡張メタデータの宣言

拡張機能のメインプラグインファイルには、拡張機能に関する多くの重要なメタデータを含むヘッダーコメントが必要です。WordPressには、すべてのプラグインが遵守しなければならない[ヘッダー要件](https://developer.wordpress.org/plugins/plugin-basics/header-requirements/)のリストがありますが、WooCommerce拡張機能にはさらに考慮すべき点があります：

- `Author`と`Developer`は必須項目です。  
  は必須項目です。

- `Developer URI`フィールドには、あなたの公式ウェブページのURLを入力してください。

- `Plugin URI`フィールドには、WooCommerceマーケットプレイスの拡張機能の商品ページ、またはあなたのウェブサイトの拡張機能の公式ランディングページのURLを入力してください。

- `Requires Plugins`フィールドには、必要なプラグインのスラッグをカンマ区切りで列挙してください。WooCommerce拡張機能を有効にするにはWooCommerceが必要です。 

- `Woo`フィールドはWooCommerceマーケットプレイスに掲載されているエクステンションに使用されます。このコードはアップデートを容易にするため、WooCommerce.comで販売されている製品のデプロイ時に自動的に追加されます。手動で追加したり、WooCommerceマーケットプレイス以外で提供される製品に追加したりしないでください。他のバージョンにこのヘッダーを含めると、アップデートが機能しなくなります。

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

## データ漏洩の防止

ベストプラクティスとして、拡張モジュールのPHPファイルの先頭に、WordPressのABSPATH定数をチェックする条件文を記述してください。この定数が定義されていない場合、スクリプトは終了します。

`defined( 'ABSPATH' ) || exit;`。

このチェックは、PHPファイルがブラウザから直接実行されるのを防ぎ、代わりにWordPressのアプリケーション環境からのみ実行できるようにします。

## エクステンションのライフサイクルを管理する

メインの PHP ファイルは、拡張モジュールと WordPress の間の主要な結合点なので、 拡張モジュールのライフサイクルを管理するためのハブとして使用する必要があります。非常に基本的なレベルでは、これは処理を意味します：

- アクティベーション
- 実行
- 無効化

これら3つの大まかなライフサイクル領域から始めて、エクステンションの機能をさらに細分化することで、懸念事項の適切な分離を維持することができます。

## アクティブ化と非アクティブ化の処理

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

## 懸念事項の分離を維持する

拡張モジュールのコードを整理する方法は数多くあります。WordPress Plugin Developer Handbook にベストプラクティスの概要があります。どのような方法でコードを整理するにしても、WordPress の共有アプリケーション空間という性質上、相互運用性を意識して構築することが不可欠です。エクステンションを最適化し、他のエクステンションの良き隣人であることを保証するのに役立つ、いくつかの共通の原則があります：

- 他の拡張モジュールとの衝突を避けるために、名前空間と接頭辞を使用する。
- 拡張機能の機能をカプセル化するためにクラスを使用する。
- 既存の宣言、代入、実装をチェックする。

## コア拡張クラス

前述したように、クラスを使って拡張機能のさまざまな部分をカプセル化することは、相互運用性を高めるだけでなく、コードの保守やデバッグを容易にする重要な手段です。拡張モジュールにはさまざまなクラスがあり、それぞれが機能の一部を担っています。少なくとも、エクステンションの中心となるクラスを定義して、 そのクラス自身のインスタンスのセットアップや初期化、管理を行うようにしましょう。

## シングルトン・パターンの実装

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

上記のサンプル・クラスは、静的クラス・メソッド `instance()` を呼び出すことでインスタンス化されるように設計されていることに注意してください。不要なインスタンス化から完全に保護するためには、組み込みのマジック・メソッド `__clone()` と `__wakeup()` をオーバーライドする必要があります。ここで独自のエラーロギングを実装するか、エラーロギングを処理する `_doing_it_wrong()` などを使用します。WooCommerceのラッパー関数`wc_doing_it_wrong()`を使用することもできます。ただ、最初に関数が存在することをコードで確認してください。

## コンストラクタ

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

## 依存関係の読み込み

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

## 初期化

上記の `init()` 関数は、includes() メソッドでロードしたクラスのセットアップを処理する場所です。このステップでは、関連するアクションやフィルタの初期登録を行います。また、拡張モジュールのJavaScriptやスタイルシートを登録したりキューに入れたりする場所でもあります。

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

## 初期化を遅らせる

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

## 実行処理

エクステンションがアクティブになり、初期化されると、可能性は大きく広がります。ここがエクステンションでマジックが起こる場所であり、それを定義するのはあなた次第です。具体的な機能の実装はこのガイドの範囲外ですが、エクステンションの機能をどのように構築するか考える際に念頭に置いておくべきベストプラクティスがいくつかあります。

- イベントドリブンを意識しましょう。あなたのエクステンションを使用するマーチャントや買い物客はウェブリクエストを使用してWooCommerceとやり取りをします。

- ビジネス・ロジックとプレゼンテーション・ロジックを別々にする。これは、バックエンドの処理とフロントエンドのレンダリングを別々のクラスで管理するのと同じくらい簡単なことです。

- 可能であれば、肥大化したクラスや長い関数を作るのではなく、機能を小さなパーツに分割し、専用のクラスに責任を委譲する。

クラスとフックの詳細なドキュメントはWooCommerce Core Code Referenceに、REST APIエンドポイントの追加ドキュメントはWooCommerce REST API Documentationにあります。

## 不活性化の処理

メイン PHP ファイルで register_deactivation_hook() を使って設定した WordPress の無効化フックは、マーチャントが拡張機能を無効化したときに処理する必要のあるクリーンアップの機能を集約するのに最適な場所です。WordPress 関連の無効化タスクに加えて、WooCommerce 関連のクリーンアップも行う必要があります：

- スケジュールされたアクションの削除
- 管理者受信トレイのノートの削除
- 管理者タスクの削除

## アンインストール

マーチャントがエクステンションを無効化したときに、エクステンションが作成したすべてを完全に元に戻すことは確かに可能ですが、ほとんどの場合、それはお勧めできませんし、現実的ではありません。その代わりに、その動作はアンインストール時に行うのがベストです。

アンインストールの処理については、WordPressプラグインハンドブックのガイドラインに従うのが最善です。

## ♪まとめよう

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
