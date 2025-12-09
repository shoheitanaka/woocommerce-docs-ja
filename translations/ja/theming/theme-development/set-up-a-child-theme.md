---
post_title: How to set up and use a child theme
sidebar_label: Set up and use a child theme
---

# How to set up and use a child theme

**Note:** This document is intended for creating and using classic child themes. For a comprehensive guide on creating a child block theme and understanding the differences between a classic and block theme, please refer to [WooCommerce block theme development](../block-theme-development/theming-woo-blocks.md) and [WordPress block child theme development](https://learn.wordpress.org/lesson-plan/create-a-basic-child-theme-for-block-themes/).


時には、テーマやWooCommerceをオプションで設定できる範囲を超えてカスタマイズする必要があるかもしれません。このガイドラインでは、子テーマを使用してサイトをカスタマイズする方法の基本について説明します。

## What is a child theme?

始める前に、子テーマとは何かを理解しておくことが重要です。要するに、子テーマとは親テーマの上に置くレイヤーのことで、ゼロから新しいテーマを開発することなく変更を加えることができます。子テーマを使う主な理由は2つあります：

- Theme developers can use child themes as a way to offer variations on a theme, similar to what we do with the [Storefront child themes](https://woocommerce.com/products/storefront/)
- Developers can use child themes to host customizations of the parent theme or any plugin on the site since the child theme will get priority over the plugins and parent theme

Read [this guide from the WordPress Codex](https://developer.wordpress.org/themes/advanced-topics/child-themes/).

## Make a backup

Before customizing a website, you should always ensure that you have a backup of your site in case anything goes wrong. More info at: [Backing up WordPress content](https://woocommerce.com/document/backup-wordpress-content/).

## Getting started

手始めに、子テーマを用意する必要がある。

### Making the child theme

First, we need to create a new stylesheet for our child theme. Create a new file called `style.css` and put this code in it:

```css
/*
Theme Name: Child Theme
Version: 1.0
Description: Child theme for Woo.
Author: Woo
Author URI: https://woocommerce.com
Template: themedir
*/
```

Next, we need to change the **Template** field to point to our installed WooTheme. In this example, we'll use the Storefront theme, which is installed under `wp-content/themes/storefront/`. The result will look like this:

```css
/*
Theme Name: Storefront Child
Version: 1.0
Description: Child theme for Storefront.
Author: Woo
Author URI: https://woocommerce.com
Template: storefront
*/

/* --------------- Theme customization starts here ----------------- */
```

**Note:** With Storefront, you do not need to enqueue any of the parent theme style files with PHP from the theme's `functions.php` file or `@import` these into the child themes `style.css` file as the main parent Storefront theme does this for you.

With Storefront, a child theme only requires a blank `functions.php` file and a `style.css` file to get up and running.

## Uploading and activating

子テーマをアップロードするには、FTPクライアントを使用するか、WordPressの新規テーマ追加オプションを使用します。

- **FTPを使用する場合、ウェブサイトのフォルダに直接アクセスすることになります。つまり、新しい子テーマをアップロードするためには、ホストに**FTPアクセス**が必要です。もしこれがない場合は、ホストに相談してFTPログインの詳細を教えてもらい、ファイルをアップロードするためのFTPプログラムをダウンロードしてください。
- **WPダッシュボードを通して。**あなたの子テーマフォルダの.zipファイルを作成した場合は、単に**WordPress &gt;外観&gt;テーマ&gt;新規追加**セクションからあなたのサイトにそれをアップロードすることができます。

Once you've done that, your child theme will be uploaded to a new folder in `wp-content/themes/`, for example, `wp-content/themes/storefront-child/`. Once uploaded, we can go to our **WP Dashboard > Appearance > Themes** and activate the child theme.

## Customizing design and functionality

これで、子テーマを変更する準備が整いました。親テーマに触れずに子テーマをカスタマイズする方法の例をいくつか見てみましょう。

### Design customization

Let's do an example together where we change the color of the site title. Add this to your `/storefront-child/style.css`:

```css
.site-branding h1 a {
    color: red;
}
```

ファイルを保存してブラウザをリフレッシュすると、サイトタイトルの色が変わっているのがわかります！

### Template changes

**Note:** This doesn't apply to Storefront child themes. Any customizations to a Storefront child theme's files will be lost when updating. Instead of customizing the Storefront child theme's files directly, we recommended that you add code snippets to a customization plugin. We've created one to do just this. Download [Theme Customizations](https://github.com/woocommerce/theme-customisations) for free.

But wait, there's more! You can do the same with the template files (`*.php`) in the theme folder. For example if w, wanted to modify some code in the header, we need to copy header.php from our parent theme folder `wp-content/themes/storefront/header.php` to our child theme folder `wp-content/themes/storefront-child/header.php`. Once we have copied it to our child theme, we edit `header.php` and customize any code we want. The `header.php` in the child theme will be used instead of the parent theme's `header.php`.

The same goes for WooCommerce templates. If you create a new folder in your child theme called "WooCommerce", you can make changes to the WooCommerce templates there to make it more in line with the overall design of your website. More on WooCommerce's template structure [can be found here](https://woocommerce.com/document/template-structure/).

### Functionality changes

**注意**：子テーマのfunctions.phpは**空**にして、親テーマのfunctions.phpのものを含めないようにしてください。

The `functions.php` in your child theme is loaded **before** the parent theme's `functions.php`. If a function in the parent theme is **pluggable**, it allows you to copy a function from the parent theme into the child theme's `functions.php` and have it replace the one in your parent theme. The only requirement is that the parent theme's function is **pluggable**, which basically means it is wrapped in a conditional if statement e.g:

```php
if ( ! function_exists( "parent_function_name" ) ) {
    parent_function_name() {
        ...
    }
}
```

If the parent theme function is **pluggable**, you can copy it to the child theme `functions.php` and modify the function to your liking.

## Template directory vs stylesheet directory

WordPress has a few things that it handles differently in child themes. If you have a template file in your child theme, you have to modify how WordPress includes files. `get_template_directory()` will reference the parent theme. To make it use the file in the child theme, you need to change use `get_stylesheet_directory();`.

[More info on this from the WP Codex](https://developer.wordpress.org/themes/advanced-topics/child-themes/#referencing-or-including-other-files)

## Child theme support

Although we do offer basic child theme support that can easily be answered, it still falls under theme customization, so please refer to our [support policy](https://woocommerce.com/support-policy/) to see the extent of support we give. We highly advise anybody confused with child themes to use the [WordPress forums](https://wordpress.org/support/forums/) for help.

## Sample child theme

この記事の一番上にあるサンプルの子テーマをダウンロードして始めましょう。子テーマを親テーマと一緒に**wp-content/themes/**フォルダに置きます。
