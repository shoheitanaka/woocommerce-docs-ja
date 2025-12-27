---
post_title: Classic theme development handbook
sidebar_label: Classic theme development
---
# クラシックテーマ開発ハンドブック

---

[**注意:** このドキュメントはクラシックテーマの開発を対象としています。ブロックテーマの開発](../block-theme-development/theming-woo-blocks.md)については別のドキュメントを確認してください。

---

WooCommerceは、バージョン3.3以降のすべてのWordPressテーマと相性が良く、たとえWooCommerce専用テーマでなく、正式にサポートを表明していないテーマであっても、見栄えが良くなります。テンプレートはコンテンツ内部でレンダリングされるため、サイト上ですべてを自然に見せることができます。

WooCommerce以外のテーマもデフォルトで含まれています：

- ズーム機能が有効 - 商品画像を拡大・縮小することができます。
- ライトボックス機能が有効 - 商品ギャラリーの画像をポップアップ表示し、より近くで確認することができます。
- レビューではなく、コメントを有効に - 訪問者/購入者は、製品の評価やレビューとは対照的に、コメントを残すことができます。

WooCommerceの要素のレイアウトをよりコントロールしたい場合や、レビューの完全なサポートをご希望の場合は、テーマをWooCommerceと統合する必要があります。これにはいくつかの方法があり、以下に概要を示します。

## テーマの統合

WooCommerceをテーマと統合するには3つの方法があります。WooCommerce 3.2以下（**強くお勧めしません**）を使用している場合、WooCommerceショップと商品ページがテーマで正しくレンダリングされるように、これらの方法のいずれかを使用する必要があります。WooCommerce 3.3またはそれ以上のバージョンを使用している場合、自動的なものがあなたのニーズを満たさない場合にのみテーマ統合を行う必要があります。

### `woocommerce_content()`の使用

このソリューションでは、**すべてのWooCommerceタクソノミーと投稿タイプの表示**に使用される新しいテンプレートページをテーマ内に作成することができます。簡単にキャッチオールできるソリューションですが、このテンプレートは**すべてのWooCommerceタクソノミ**（商品カテゴリなど）と**ポストタイプ**（商品アーカイブ、単一商品ページ）に使用されるという欠点があります。開発者は代わりにフックを使用することをお勧めします（下記参照）。

このテンプレートページを設定するには

1. **Duplicate page.php:** テーマの`page.php`ファイルを複製し、`woocommerce.php`と名付けます。ファイルへのパスは次のパターンに従ってください：`wp-content/themes/YOURTHEME/woocommerce.php`。
2. **あなたのページ（woocommerce.php）を編集してください：新しく作成した`woocommerce.php`をテキストエディタで開きます。
3. **ループを置き換える：** 次にループを見つける必要があります（[The_Loop](https://codex.wordpress.org/The_Loop)を参照）。ループは通常、次のようなコードで始まります：

```php
<?php if ( have_posts() ) :
```

大抵はこれで終わる：

```php
<?php endif; ?>
```

これはテーマによって異なります。見つけたら、**削除**してください。その代わりに

```php
<?php woocommerce_content(); ?>
```

これは**WooCommerceのループを代わりに使用します**。ファイルを保存してください。これで完了です。

**注意:** `woocommerce.php`をテーマのフォルダに作成する場合、`woocommerce.php`が`archive-product.php`より優先されるため、`woocommerce/archive-product.php`カスタム・テンプレートを上書きすることはできません。これは表示の問題を防ぐためです。

### フックの使用

フック方式はより複雑だが、柔軟性も高い。これは、私たちがテーマを作成するときに使う方法に似ています。また、WordPressのデフォルトテーマとうまく統合するために使用する方法でもあります。

テーマの`functions.php`ファイルに数行を挿入する。

まずWooCommerceラッパーを外します：

```php
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
```

そして、テーマが必要とするラッパーを表示するために、独自の関数をフックする：

```php
add_action('woocommerce_before_main_content', 'my_theme_wrapper_start', 10);
add_action('woocommerce_after_main_content', 'my_theme_wrapper_end', 10);

function my_theme_wrapper_start() {
    echo '<section id="main">';
}

function my_theme_wrapper_end() {
    echo '</section>';
}
```

マークアップがテーマのものと一致していることを確認してください。どのクラスやIDを使うべきかわからない場合は、テーマの`page.php`を参考にしてください。

**可能な限り、コンテンツの追加や削除にはフックを使ってください。テンプレートをオーバーライドした場合、ファイルが変更されるたびにテンプレートを更新しなければなりません。テンプレートをオーバーライドした場合は、ファイルが変更されるたびにテンプレートを更新しなければなりません。フックを使用する場合は、フックが変更されたときだけ更新すればよく、その頻度ははるかに低くなります。

### テンプレートのオーバーライドを使用する

WooCommerceテンプレートを独自のカスタムテンプレートでオーバーライドする方法については、以下の**テンプレート構造**セクションをお読みください。この方法はフックベースの方法よりもメンテナンスが必要で、テンプレートはWooCommerceのコアテンプレートと最新の状態に保つ必要があります。

## WooCommerceサポート宣言

テーマでカスタムWooCommerceテンプレートオーバーライドを使用する場合、`add_theme_support`関数を使用してWooCommerceサポートを宣言する必要があります。WooCommerceテンプレートオーバーライドはWooCommerceサポートを宣言したテーマでのみ有効になります。テーマでWooCommerceサポートを宣言しない場合、WooCommerceはテーマがWooCommerce互換のために設計されていないとみなし、ショップを表示するためにショートコードベースの未サポートテーマレンダリングを使用します。

WooCommerceサポートの宣言は簡単で、テーマの`functions.php`ファイルに関数を1つ追加するだけです。

### 基本的な使い方

```php
function mytheme_add_woocommerce_support() {
    add_theme_support( 'woocommerce' );
}

add_action( 'after_setup_theme', 'mytheme_add_woocommerce_support' );
```

`init`フックではなく、`after_setup_theme`フックを使用していることを確認してください。これについては[`add_theme_support`のドキュメント](https://developer.wordpress.org/reference/functions/add_theme_support/)を参照してください。

### 設定による使用法

```php
function mytheme_add_woocommerce_support() {
    add_theme_support( 'woocommerce', array(
        'thumbnail_image_width' => 150,
        'single_image_width'    => 300,

        'product_grid'          => array(
            'default_rows'    => 3,
            'min_rows'        => 2,
            'max_rows'        => 8,
            'default_columns' => 4,
            'min_columns'     => 2,
            'max_columns'     => 5,
        ),
    ) );
}

add_action( 'after_setup_theme', 'mytheme_add_woocommerce_support' );
```

これらは、WooCommerceのサポートを宣言する際に設定できるオプションのテーマ設定です。

`thumbnail_image_width`と`single_image_width`はショップの画像サイズを設定します。テーマサポートを追加する際にこれらが宣言されていない場合、ユーザーはカスタマイザーの **WooCommerce > Product Images** セクションで画像サイズを設定することができます。

`product_grid`設定により、テーマ開発者はショップのデフォルト、最小、最大の列と行の設定を行うことができます。ユーザーはカスタマイザーの**WooCommerce > Product Catalog**セクションで行と列を設定できます。

### 商品ギャラリー機能（ズーム、スワイプ、ライトボックス）

3.0.0([詳しくはこちら](https://developer.woocommerce.com/2016/10/19/new-product-gallery-merged-in-to-core-for-2-7/))で導入された製品ギャラリーでは、Flexslider、Photoswipe、jQuery Zoomプラグインを使用して、スワイプ、ライトボックス、その他のすてきな機能を提供しています。

バージョン`3.0`、`3.1`、`3.2`では、新しいギャラリーはデフォルトでオフになっており、スニペット（下記）を使用するか、互換性のあるテーマを使用して有効にする必要があります。これはWooCommerceギャラリーを無効にし、独自のスクリプトで置き換えるテーマがよくあるためです。

バージョン`3.3+`では、WooCommerce対応テーマがサポートを宣言しない限り、ギャラリーはデフォルトでオフになっています（下記）。WooCommerceをサポートしていないサードパーティのテーマはデフォルトでギャラリーが有効になっています。

テーマでギャラリーを有効にするには、次のようにサポートを宣言します：

```php
add_theme_support( 'wc-product-gallery-zoom' );
add_theme_support( 'wc-product-gallery-lightbox' );
add_theme_support( 'wc-product-gallery-slider' );
```

ギャラリーの3つの部分すべてをサポートする必要はありません。機能が有効でない場合、スクリプトはロードされず、ギャラリーコードは商品ページで実行されません。

ギャラリー機能が有効になっている場合（例えば、有効になっているテーマを使用している、またはWooCommerceと互換性のないテーマを使用している）、`remove_theme_support`で無効にすることができます：

```php
remove_theme_support( 'wc-product-gallery-zoom' );
remove_theme_support( 'wc-product-gallery-lightbox' );
remove_theme_support( 'wc-product-gallery-slider' );
```

すべての機能を無効にする必要はありません。

## テンプレートの構造

WooCommerceのテンプレートファイルには、あなたのストアの**フロントエンドとHTMLメール**のための**マークアップ**と**テンプレート構造**が含まれています。HTMLの構造的な変更が必要な場合は、テンプレートをオーバーライドする必要があります。

これらのファイルを開くと、テンプレートファイルそのものを編集することなくコンテンツの追加や移動ができる**フック**が含まれていることに気づくでしょう。この方法は、テンプレートファイルを完全にそのままにしておくことができるので、アップグレードの問題から保護されます。

テンプレート・ファイルは`**/woocommerce/templates/**`ディレクトリにあります。

### ファイルの編集方法

overrides*を使用して、**アップグレードしても安全な方法**でファイルを編集します。同じファイル構造を保ちながら、`/templates/`サブディレクトリを削除して、`/woocommerce`という名前のテーマ内のディレクトリにコピーしてください。

例管理者オーダー通知を上書きするには、`wp-content/plugins/woocommerce/templates/emails/admin-new-order.php`を`wp-content/themes/yourtheme/woocommerce/emails/admin-new-order.php`にコピーします。

コピーされたファイルはWooCommerceのデフォルトテンプレートファイルを上書きします。

**Warning:** テンプレートをオーバーライドする際、WooCommerceフックを削除しないでください。これはプラグインがコンテンツを追加するためにフックするのを防ぐためです。

**警告:** これらのファイルはアップグレード中に上書きされ、カスタマイズした内容は失われるので、コアプラグイン内で編集しないでください。

## CSS構造

`assets/css/`ディレクトリの中に、デフォルトのWooCommerceレイアウトスタイルを担当するスタイルシートがあります。

探すべきファイルは`woocommerce.scss`と`woocommerce.css`である。

- `woocommerce.css`は最小化されたスタイルシートで、スペースやインデントなどのないCSSです。これによりファイルの読み込みが非常に速くなります。このファイルはプラグインによって参照され、すべてのWooCommerceスタイルを宣言します。
- `woocommerce.scss`はプラグインによって直接使用されるのではなく、WooCommerceの開発チームによって使用されます。最初のファイルのCSSを生成するために、このファイルで[SASS](http://sass-lang.com/)を使用しています。

CSSは、すべてのレイアウトスタイルにパーセンテージベースの幅を使用することで、デフォルトのレイアウトができるだけ多くのテーマと互換性を持つように記述されています。しかし、あなた自身で調整したいと思うかもしれません。

### 修正

アップグレードの問題を避けるため、これらのファイルは編集せず、参照用として使用することをお勧めします。

単に変更したい場合は、テーマスタイルシートにオーバーライドスタイルを追加することをお勧めします。例えば、WooCommerceのボタンをデフォルトの色ではなく黒にするために、テーマスタイルシートに以下を追加します：

```css
a.button, 
button.button, 
input.button, 
#review_form #submit {
    background:black; 
}
```

WooCommerceはまた、テーマ名（さらに、どのタイプのページが表示されているかなど、その他の有用な情報）をbodyタグのクラスとして出力します。

### WooCommerce のスタイルを無効にする

大きな変更を行う予定がある場合、またはゼロからテーマを作成する場合は、テーマがWooCommerceスタイルシートを全く参照しない方が良いかもしれません。テーマの`functions.php`ファイルに以下のコードを追加することで、デフォルトの`woocommerce.css`を使用しないようにWooCommerceに指示できます：

```php
add_filter( 'woocommerce_enqueue_styles', '__return_false' );
```

この定義により、あなたのテーマはWooCommerceスタイルシートを使用しなくなり、空白のキャンバスに独自のレイアウトとスタイルを構築できるようになります。

初めてWooCommerceテーマをゼロからスタイリングするのは簡単な作業ではありません。スタイリングが必要なページや要素はたくさんあり、WooCommerceに慣れていない場合は、おそらくそれらの多くに慣れていないでしょう。スタイルを設定するWooCommerce要素の非網羅的なリストは、この[WooCommerceテーマテストチェックリスト](https://developer.files.wordpress.com/2017/12/woocommerce-theme-testing-checklist.pdf)にあります。
