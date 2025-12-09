---
post_title: Classic theme development handbook
sidebar_label: Classic theme development
---

# Classic theme development handbook

---

**注意:** このドキュメントはクラシックテーマの開発を対象としています。ブロックテーマの開発](../block-theme-development/theming-woo-blocks.md)については別のドキュメントを確認してください。

---

WooCommerceは、バージョン3.3以降のすべてのWordPressテーマと相性が良く、たとえWooCommerce専用テーマでなく、正式にサポートを表明していないテーマであっても、見栄えが良くなります。テンプレートはコンテンツ内部でレンダリングされるため、サイト上ですべてを自然に見せることができます。

WooCommerce以外のテーマもデフォルトで含まれています：

- ズーム機能が有効 - 商品画像を拡大・縮小することができます。
- ライトボックス機能が有効 - 商品ギャラリーの画像をポップアップ表示し、より近くで見ることができます。
- レビューではなく、コメントを有効に - 訪問者/購入者は、製品の評価やレビューとは対照的に、コメントを残すことができます。

WooCommerceの要素のレイアウトをよりコントロールしたい場合や、レビューの完全なサポートをご希望の場合は、テーマをWooCommerceと統合する必要があります。これにはいくつかの方法があり、以下に概要を示します。

## Theme Integration

WooCommerceをテーマと統合するには3つの方法があります。WooCommerce 3.2以下（**強くお勧めしません**）を使用している場合、WooCommerceショップと商品ページがテーマで正しくレンダリングされるように、これらの方法のいずれかを使用する必要があります。WooCommerce 3.3またはそれ以上のバージョンを使用している場合、自動統合がニーズに合わない場合のみテーマ統合を行う必要があります。

### Using `woocommerce_content()`

このソリューションでは、**すべてのWooCommerceタクソノミーと投稿タイプの表示**に使用される新しいテンプレートページをテーマ内に作成することができます。簡単にキャッチオールできるソリューションですが、このテンプレートは**すべてのWooCommerceタクソノミ**（商品カテゴリなど）と**ポストタイプ**（商品アーカイブ、単一商品ページ）に使用されるという欠点があります。開発者は代わりにフックを使用することをお勧めします（下記参照）。

このテンプレートページを設定するには

1. **Duplicate page.php:** Duplicate your theme's `page.php` file, and name it `woocommerce.php`. This path to the file should follow this pattern: `wp-content/themes/YOURTHEME/woocommerce.php`.
2. **Edit your page (woocommerce.php)**: Open up your newly created `woocommerce.php` in a text editor.
3. **Replace the loop:** Next you need to find the loop (see [The_Loop](https://codex.wordpress.org/The_Loop)). The loop usually starts with code like this:

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

**Note:** When creating `woocommerce.php` in your theme's folder, you will not be able to override the `woocommerce/archive-product.php` custom template as `woocommerce.php` has priority over `archive-product.php`. This is intended to prevent display issues.

### Using hooks

フック方式はより複雑だが、柔軟性も高い。これは、私たちがテーマを作成するときに使う方法に似ています。また、WordPressのデフォルトテーマとうまく統合するために使用する方法でもあります。

Insert a few lines in your theme's `functions.php` file.

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

Make sure that the markup matches that of your theme. If you're unsure of which classes or IDs to use, take a look at your theme's `page.php` for guidance.

**可能な限り、コンテンツの追加や削除にはフックを使ってください。テンプレートをオーバーライドした場合、ファイルが変更されるたびにテンプレートを更新しなければなりません。テンプレートをオーバーライドした場合は、ファイルが変更されるたびにテンプレートを更新しなければなりません。フックを使用する場合は、フックが変更されたときだけ更新すればよく、その頻度ははるかに低くなります。

### Using template overrides

WooCommerceテンプレートを独自のカスタムテンプレートでオーバーライドする方法については、以下の**テンプレート構造**セクションをお読みください。この方法はフックベースの方法よりもメンテナンスが必要で、テンプレートはWooCommerceのコアテンプレートと最新の状態に保つ必要があります。

## Declaring WooCommerce Support

If you are using custom WooCommerce template overrides in your theme you need to declare WooCommerce support using the `add_theme_support` function. WooCommerce template overrides are only enabled on themes that declare WooCommerce support. If you do not declare WooCommerce support in your theme, WooCommerce will assume the theme is not designed for WooCommerce compatibility and will use shortcode-based unsupported theme rendering to display the shop.

Declaring WooCommerce support is straightforward and involves adding one function in your theme's `functions.php` file.

### Basic Usage

```php
function mytheme_add_woocommerce_support() {
    add_theme_support( 'woocommerce' );
}

add_action( 'after_setup_theme', 'mytheme_add_woocommerce_support' );
```

Make sure you are using the `after_setup_theme` hook and not the `init` hook. Read more about this in [the documentation for `add_theme_support`](https://developer.wordpress.org/reference/functions/add_theme_support/).

### Usage with Settings

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

`thumbnail_image_width` and `single_image_width` will set the image sizes for the shop. If these are not declared when adding theme support, the user can set image sizes in the Customizer under the **WooCommerce > Product Images** section.

The `product_grid` settings let theme developers set default, minimum, and maximum column and row settings for the Shop. Users can set the rows and columns in the Customizer under the **WooCommerce > Product Catalog** section.

### Product gallery features (zoom, swipe, lightbox)

The product gallery introduced in 3.0.0 ([read here for more information](https://developer.woocommerce.com/2016/10/19/new-product-gallery-merged-in-to-core-for-2-7/)) uses Flexslider, Photoswipe, and the jQuery Zoom plugin to offer swiping, lightboxes, and other neat features.

In versions `3.0`, `3.1`, and `3.2`, the new gallery is off by default and needs to be enabled using a snippet (below) or by using a compatible theme. This is because it's common for themes to disable the WooCommerce gallery and replace it with their own scripts.

In versions `3.3+`, the gallery is off by default for WooCommerce compatible themes unless they declare support for it (below). 3rd party themes with no WooCommerce support will have the gallery enabled by default.

テーマでギャラリーを有効にするには、次のようにサポートを宣言します：

```php
add_theme_support( 'wc-product-gallery-zoom' );
add_theme_support( 'wc-product-gallery-lightbox' );
add_theme_support( 'wc-product-gallery-slider' );
```

ギャラリーの3つの部分すべてをサポートする必要はありません。機能が有効でない場合、スクリプトはロードされず、ギャラリーコードは商品ページで実行されません。

If gallery features are enabled (e.g., you have a theme that enabled them, or you are running a theme that is not compatible with WooCommerce), you can disable them with `remove_theme_support`:

```php
remove_theme_support( 'wc-product-gallery-zoom' );
remove_theme_support( 'wc-product-gallery-lightbox' );
remove_theme_support( 'wc-product-gallery-slider' );
```

すべての機能を無効にする必要はありません。

## Template Structure

WooCommerceのテンプレートファイルには、あなたのストアの**フロントエンドとHTMLメール**のための**マークアップ**と**テンプレート構造**が含まれています。HTMLの構造的な変更が必要な場合は、テンプレートをオーバーライドする必要があります。

これらのファイルを開くと、テンプレートファイルそのものを編集することなく、コンテンツの追加や移動を可能にする**フック**が含まれていることに気づくでしょう。この方法は、テンプレートファイルを完全にそのままにしておくことができるので、アップグレードの問題から保護されます。

Template files can be found within the `**/woocommerce/templates/**` directory.

### How to Edit Files

Edit files in an **upgrade-safe way** using *overrides*. Copy them into a directory within your theme named `/woocommerce`, keeping the same file structure but removing the `/templates/` subdirectory.

Example: To override the admin order notification, copy `wp-content/plugins/woocommerce/templates/emails/admin-new-order.php` to `wp-content/themes/yourtheme/woocommerce/emails/admin-new-order.php`.

コピーされたファイルはWooCommerceのデフォルトテンプレートファイルを上書きします。

**Warning:** テンプレートをオーバーライドする際、WooCommerceフックを削除しないでください。これはプラグインがコンテンツを追加するためにフックするのを防ぐためです。

**警告:** これらのファイルは、アップグレードの際に上書きされ、カスタマイズした内容が失われてしまうので、コアプラグインの中で編集しないでください。

## CSS Structure

Inside the `assets/css/` directory, you will find the stylesheets responsible for the default WooCommerce layout styles.

Files to look for are `woocommerce.scss` and `woocommerce.css`.

- `woocommerce.css` is the minified stylesheet - it's the CSS without any of the spaces, indents, etc. This makes the file very fast to load. This file is referenced by the plugin and declares all WooCommerce styles.
- `woocommerce.scss` is not directly used by the plugin, but by the team developing WooCommerce. We use [SASS](http://sass-lang.com/) in this file to generate the CSS in the first file.

CSSは、すべてのレイアウトスタイルにパーセンテージベースの幅を使用することで、デフォルトのレイアウトができるだけ多くのテーマと互換性を持つように記述されています。しかし、あなた自身で調整したいと思うかもしれません。

### Modifications

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

### Disabling WooCommerce styles

If you plan to make major changes, or create a theme from scratch, then you may prefer your theme not reference the WooCommerce stylesheet at all. You can tell WooCommerce to not use the default `woocommerce.css` by adding the following code to your theme's `functions.php` file:

```php
add_filter( 'woocommerce_enqueue_styles', '__return_false' );
```

この定義により、あなたのテーマはWooCommerceスタイルシートを使用しなくなり、空白のキャンバスに独自のレイアウトとスタイルを構築できるようになります。

Styling a WooCommerce theme from scratch for the first time is no easy task. There are many different pages and elements that need to be styled, and if you're new to WooCommerce, you are probably not familiar with many of them. A non-exhaustive list of WooCommerce elements to style can be found in this [WooCommerce Theme Testing Checklist](https://developer.files.wordpress.com/2017/12/woocommerce-theme-testing-checklist.pdf).
