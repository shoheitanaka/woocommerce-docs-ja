---
post_title: Integrating admin pages into WooCommerce extensions
sidebar_label: Integrating admin pages
---
# WooCommerceエクステンションに管理ページを統合する

## はじめに

WooCommerceエクステンションの管理エリアページを管理する方法はいくつかあります。既存のPHPページを使用することもできますし、Reactを使用した新しいページを作成することもできます。どの方法を選択しても、ページにWooCommerce Adminヘッダーとアクティビティパネルを表示するには、ページを[`PageController`](https://woocommerce.github.io/code-reference/classes/Automattic-WooCommerce-Admin-PageController.html)に登録する必要があります。

## PHPで作られたページをWooCommerce Adminに接続する

既存のPHPによる管理ページを[`PageController`](https://woocommerce.github.io/code-reference/classes/Automattic-WooCommerce-Admin-PageController.html)で登録するには、[`wc_admin_connect_page()`](https://woocommerce.github.io/code-reference/namespaces/default.html#function_wc_admin_connect_page)関数を使用します。例えば

```php
wc_admin_connect_page(
    array(
        'id'        => 'woocommerce-settings',
        'screen_id' => 'woocommerce_page_wc-settings-general',
        'title'     => array( 'Settings', 'General' ),
        'path'      => add_query_arg( 'page', 'wc-settings', 'admin.php' ),
    )
);
```

[`wc_admin_connect_page()`](https://woocommerce.github.io/code-reference/namespaces/default.html#function_wc_admin_connect_page)関数は引数の配列を受け取り、そのうちの2つはオプションである：

-   `id` (**必須**) - コントローラのあるページを識別します。
-   `parent` (_optional_) - この値は、ページを親の子であることを示し(親のIDを使用します)、パンくずを生成するために使用されます。
-   `screen_id` (**必須**) - [`PageController::get_current_screen_id()`](https://woocommerce.github.io/code-reference/classes/Automattic-WooCommerce-Admin-PageController.html#method_get_current_screen_id) に対応します。現在のページを決定するために使用されます。(以下の注を参照)
-   `title` (**必須**) - これはページのタイトルに対応し、パンくずを作るために使われます。ここには文字列かパンくずの配列を指定します。
-   `path` (_optional_) - ページの相対パスです。このページが親である場合に、パンくずピースをリンクするために使用します。

上の例では、配列を使用して拡張機能のパンくずを作成する方法を見ることができます。WooCommerce はタイトル配列の最初の部分に `path` 値につながるリンクを付けます。それ以降の部分はすべてテキストとしてレンダリングされ、リンクされません。

### スクリーンIDの決定に関する注意

WooCommerce Adminは独自バージョンの[`get_current_screen()`](https://developer.wordpress.org/reference/functions/get_current_screen/)を使用して、様々なタブやサブセクションを持つ管理ページをより正確に識別できるようにしています。

このIDのフォーマットは、ページに存在する構造要素によって異なる。この関数が生成するフォーマットには次のようなものがあります：

-   `{$current_screen->action}-{$current_screen->action}-tab-section`
-   `{$current_screen->action}-{$current_screen->action}-tab`
-   タブがない場合は`{$current_screen->action}-{$current_screen->action}`。
-   アクションまたはタブが存在しない場合は `{$current_screen->action}`

拡張機能でタブやサブセクションのある新しいページを追加する場合、`wc_admin_pages_with_tabs`と`wc_admin_page_tab_sections`フィルタを使用して、WooCommerceに正確なスクリーンIDを生成させてください。

また、`wc_admin_current_screen_id`フィルタを使用して、スクリーンID生成動作に必要な変更を加えることもできる。

## Reactで動くページを登録する

Reactで動くページを登録するには、[`wc_admin_register_page()`](https://woocommerce.github.io/code-reference/namespaces/default.html#function_wc_admin_register_page)関数を使います。引数の配列を受け取ります：

-   `id` (**必須**) - コントローラのあるページを識別します。
-   `parent` (_optional_) - (親のIDを使用して)`parent`の子であることを示します。
-   `title` (**必須**) - ページのタイトルに対応し、パンくずの生成に使用されます。パンくずの断片を文字列か配列で指定することができます。
-   `path` (**必須**) - ページのパスです(`#wc-admin`からの相対パス)。このページを識別するためと、このページが親である場合にパンくずピースをリンクするために使用されます。
-   `capability` (_optional_) - このページにアクセスするために必要なユーザー能力。デフォルト値は`manage_options`です。
-   `icon` (_optional_) - Dashiconsヘルパークラスまたはbase64エンコードSVGを適用する場合に使用します。ダシコンクラス名全体、つまり `dashicons-*` を含めます。これはWooCommerce Admin Navigationには含まれないので注意。
-   `position` (_optional_) - 親ページのメニューアイテムの位置。参照してください：[`add_menu_page()`](https://developer.wordpress.org/reference/functions/add_menu_page/).

Reactで動くページの登録はPHPページの接続と似ていますが、いくつかの重要な違いがあります。ページを登録すると、`parent`の値に基づいた適切な階層で、自動的にWordPressのメニュー項目が作成されます。

### 例新しいWooCommerce管理ページの追加

```php
if ( ! function_exists( 'YOUR_PREFIX_add_extension_register_page' ) ) {
  function YOUR_PREFIX_add_extension_register_page() {
    if ( ! function_exists( 'wc_admin_register_page' ) ) {
        return;
    }

    wc_admin_register_page( array(
        'id'       => 'my-example-page',
        'title'    => __( 'My Example Page', 'YOUR-TEXTDOMAIN' ),
        'parent'   => 'woocommerce',
        'path'     => '/example',
    ) );
  }
}
add_action( 'admin_menu', 'YOUR_PREFIX_add_extension_register_page' );
```

上の例では、[`wc_admin_register_page()`](https://woocommerce.github.io/code-reference/namespaces/default.html#function_wc_admin_register_page) への呼び出しを関数にカプセル化し、 [`admin_menu`](https://developer.wordpress.org/reference/hooks/admin_menu/) アクションにフックしています。コントローラにページを登録したら、クライアント側でReactコンポーネントを作成します。

```js
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

const MyExamplePage = () => <h1>My Example Extension</h1>;

addFilter( 'woocommerce_admin_pages_list', 'my-namespace', ( pages ) => {
	pages.push( {
		container: MyExamplePage,
		path: '/example',
		breadcrumbs: [ __( 'My Example Page', 'YOUR-TEXTDOMAIN' ) ],
	} );

	return pages;
} );
```

上では、デモンストレーションのために単純な[機能的なReactコンポーネント](https://reactjs.org/docs/components-and-props.html#function-and-class-components)を作成していますが、実際のエクステンションでは、もっと複雑なコンポーネントの入れ子になる可能性があります。

## 続きを読む

WooCommerceコアコードリファレンスの[`PageController`](https://woocommerce.github.io/code-reference/classes/Automattic-WooCommerce-Admin-PageController.html)クラスをチェックすることで、ページ登録がどのように機能するかについてより詳しく知ることができます。

WooCommerce Coreの2つのページ登録方法の実例をご覧ください：

-   [WooCommerce Adminが既存のコアページを登録する方法](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/react-admin/connect-existing-pages.php) - PHPで動作するページを登録する
-   [WooCommerceがReactで動くAnalyticsレポートページを登録する方法](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/Admin/Analytics.php) - Reactで動くページを登録する
