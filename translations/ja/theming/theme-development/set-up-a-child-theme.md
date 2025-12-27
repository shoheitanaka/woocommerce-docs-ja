---
post_title: How to set up and use a child theme
sidebar_label: Set up and use a child theme
---

# How to set up and use a child theme

**注意:** このドキュメントはクラシックな子テーマの作成と使用を目的としています。子ブロックテーマの作成とクラシックテーマとブロックテーマの違いを理解するための包括的なガイドについては、[WooCommerce ブロックテーマ開発](../block-theme-development/theming-woo-blocks.md) および [WordPress ブロック子テーマ開発](https://learn.wordpress.org/lesson-plan/create-a-basic-child-theme-for-block-themes/) を参照してください。

時には、テーマやWooCommerceをオプションで設定できる範囲を超えてカスタマイズする必要があるかもしれません。このガイドラインでは、子テーマを使用してサイトをカスタマイズする方法の基本について説明します。

## 子テーマとは？

始める前に、子テーマとは何かを理解しておくことが重要です。要するに、子テーマとは親テーマの上に置くレイヤーのことで、ゼロから新しいテーマを開発することなく変更を加えることができます。子テーマを使う主な理由は2つあります：

- テーマ開発者は、[ストアフロントの子テーマ](https://woocommerce.com/products/storefront/) と同様に、テーマのバリエーションを提供する方法として子テーマを使用できます。
- 子テーマはプラグインや親テーマよりも優先されるので、開発者は子テーマを使って親テーマやサイトのプラグインのカスタマイズをホストすることができます。

[WordPress Codexのこのガイド](https://developer.wordpress.org/themes/advanced-topics/child-themes/)をお読みください。

## バックアップを取る

ウェブサイトをカスタマイズする前に、何か問題が発生した場合に備えて、必ずサイトのバックアップを取っておく必要があります。詳しくは[WordPressコンテンツのバックアップ](https://woocommerce.com/document/backup-wordpress-content/).

## ♪ はじめに

手始めに、子テーマを用意する必要がある。

### 子テーマの作成

まず、子テーマ用の新しいスタイルシートを作成する必要があります。`style.css`という新しいファイルを作成し、その中に次のコードを記述する：

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

次に、インストールしたWooThemeを指すように**Template**フィールドを変更する必要があります。この例では、`wp-content/themes/storefront/`にインストールされているStorefrontテーマを使用します。結果はこのようになります：

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

**注:** Storefrontでは、親テーマの`functions.php`ファイルや`@import`ファイルを子テーマの`style.css`ファイルにPHPでエンキューする必要はありません。

Storefrontでは、子テーマを作成するのに必要なのは空白の`functions.php`ファイルと`style.css`ファイルだけです。

## アップロードとアクティベーション

子テーマをアップロードするには、FTPクライアントを使用するか、WordPressの新規テーマ追加オプションを使用します。

- **FTPを使用する場合、ウェブサイトのフォルダに直接アクセスすることになります。つまり、新しい子テーマをアップロードするためには、ホストに**FTPアクセス**が必要です。もしこれがない場合は、ホストに相談してFTPログインの詳細を教えてもらい、ファイルをアップロードするためのFTPプログラムをダウンロードしてください。
- **WPダッシュボードを通して。**あなたの子テーマフォルダの.zipファイルを作成した場合は、単に**WordPress >外観>テーマ>新規追加**セクションからあなたのサイトにそれをアップロードすることができます。

そうすると、子テーマが`wp-content/themes/`の新しいフォルダ、例えば`wp-content/themes/storefront-child/`にアップロードされます。アップロードが完了したら、**WPダッシュボード > 外観 > テーマ**に移動し、子テーマを有効化します。

## デザインと機能のカスタマイズ

これで、子テーマを変更する準備が整いました。親テーマに触れずに子テーマをカスタマイズする方法の例をいくつか見てみましょう。

### デザインのカスタマイズ

サイトのタイトルの色を変える例を一緒にやってみよう。これを`/storefront-child/style.css`に追加してください：

```css
.site-branding h1 a {
    color: red;
}
```

ファイルを保存してブラウザをリフレッシュすると、サイトタイトルの色が変わっているのがわかります！

### テンプレートの変更

[**Storefrontの子テーマには適用されません。Storefrontの子テーマのファイルをカスタマイズした場合は、アップデート時に失われます。Storefront子テーマのファイルを直接カスタマイズする代わりに、カスタマイズプラグインにコードスニペットを追加することをお勧めします。そのためのプラグインを作成しました。Theme Customizations](https://github.com/woocommerce/theme-customisations)を無料でダウンロードしてください。

しかし、まだあります！テーマフォルダ内のテンプレートファイル（`*.php`）でも同じことができます。例えば、wがヘッダーのコードを変更したい場合、親テーマフォルダ`wp-content/themes/storefront/header.php`から子テーマフォルダ`wp-content/themes/storefront-child/header.php`にheader.phpをコピーする必要があります。子テーマにコピーしたら、`header.php`を編集し、好きなコードをカスタマイズします。子テーマの`header.php`は、親テーマの`header.php`の代わりに使用されます。

WooCommerceテンプレートも同様です。子テーマに「WooCommerce」という新しいフォルダを作成すれば、そこにあるWooCommerceテンプレートに変更を加えて、ウェブサイト全体のデザインに沿ったものにすることができます。WooCommerceのテンプレート構造についての詳細は[こちら](https://woocommerce.com/document/template-structure/)をご覧ください。

### 機能変更

**注意**：子テーマのfunctions.phpは**空**にして、親テーマのfunctions.phpのものを含めないようにしてください。

子テーマの`functions.php`は、親テーマの`functions.php`の **前に**ロードされます。親テーマの関数が **プラグイン可能** であれば、親テーマの関数を子テーマの `functions.php` にコピーして、親テーマの関数を置き換えることができます。唯一の条件は、親テーマの関数が **pluggable** であることです：

```php
if ( ! function_exists( "parent_function_name" ) ) {
    parent_function_name() {
        ...
    }
}
```

親テーマの関数が**プラグイン可能**であれば、それを子テーマの`functions.php`にコピーし、好みに応じて関数を変更することができます。

## テンプレートディレクトリ vs スタイルシートディレクトリ

WordPressには、子テーマで異なる処理をするものがいくつかあります。子テーマにテンプレートファイルがある場合、WordPressがファイルをインクルードする方法を変更する必要があります。`get_template_directory()`は親テーマを参照します。子テーマのファイルを使用するには、`get_stylesheet_directory();`を使用するように変更する必要があります。

[詳細はWP Codexから](https://developer.wordpress.org/themes/advanced-topics/child-themes/#referencing-or-including-other-files)

## 子テーマのサポート

基本的な子テーマのサポートは行っており、簡単に回答することができますが、テーマのカスタマイズに該当するため、どの程度のサポートを行っているかは[サポートポリシー](https://woocommerce.com/support-policy/)を参照してください。子テーマでお困りの方は、[WordPressフォーラム](https://wordpress.org/support/forums/) をご利用ください。

## サンプル子テーマ

この記事の一番上にあるサンプルの子テーマをダウンロードして始めましょう。子テーマを親テーマと一緒に**wp-content/themes/**フォルダに置きます。
