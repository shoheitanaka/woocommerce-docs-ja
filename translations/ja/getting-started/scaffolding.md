---
post_title: Scaffolding and sample store data
sidebar_label: Scaffolding and sample data
sidebar_position: 4
---

# Scaffolding and sample store data

WooCommerceは、あなたが構築しようとしているものに応じて、多くのスターターキットや足場を提供しています。

## Starter Themes

WooCommerceストアをデザインする場合、テーマ開発には2つの選択肢があります：クラシックテーマとブロックテーマです。

-   クラシックテーマは、PHPテンプレートを使用して、商品ページ、商品アーカイブ、ショッピングカート、チェックアウトページなど、ストアの主要ページのデザインを上書きします。クラシックテーマを使用しているサイトはWordPressブロックエディタを使用できますが、テンプレートの多くはエディタ自体で編集できません。
-   ブロックテーマはWordPressサイトエディタを使って、ヘッダーやフッター、商品ページ、アーカイブ、カートページやチェックアウトページなど、WordPressサイトのあらゆる面を生成します。サイトエディターで作成したデザインはフラットHTMLファイルにエクスポートできますが、ファイル自体は通常WordPressエディターで編集します。

### Storefront Theme (Classic)

Storefront is Woo’s flagship classic theme, available in the [WordPress Theme Directory](https://wordpress.org/themes/). You can either rename and modify the theme itself, or override specific aspects of it using a child theme.

For more information on building a classic WooCommerce theme, read our classic theme development handbook. For a comprehensive guide on creating a child block theme and understanding the differences between a classic and block theme, please refer to [WooCommerce block theme development](/docs/theming/block-theme-development/theming-woo-blocks) and [WordPress block child theme development](https://learn.wordpress.org/lesson-plan/create-a-basic-child-theme-for-block-themes/).

### Block Starter Themes

If you are completely new to block theme development, please check [Develop Your First Low-Code Block Theme](https://learn.wordpress.org/course/develop-your-first-low-code-block-theme/) to learn about block theme development, and explore the [Create Block Theme plugin](https://wordpress.org/plugins/create-block-theme/) tool when you're ready to create a new theme.

詳しくは[ブロックテーマ開発ハンドブック](/docs/theming/block-theme-development/theming-woo-blocks)をご覧ください。

## Extension Scaffolds

### @woocommerce/create-woo-extension

[Create Woo Extension](https://github.com/woocommerce/woocommerce/tree/trunk/packages/js/create-woo-extension/) is an NPX command that scaffolds an entire WooCommerce extension for your store. The generated extensions adds a React-based settings page integrating with WooCommerce Admin. Also included are PHP and Javascript unit testing, linting, and Prettier IDE configuration for WooCommerce and WordPress.

create-woo-extensionパッケージ](/docs/extensions/getting-started-extensions/building-your-first-extension)を使用した完全なチュートリアルをお読みください。

### @woocommerce/extend-cart-checkout-block

This is a template to be used with `@wordpress/create-block` to create a WooCommerce Blocks extension starting point. To install and use it, follow the instructions in [`@woocommerce/extend-cart-checkout-block`](https://github.com/woocommerce/woocommerce/tree/trunk/packages/js/extend-cart-checkout-block/). Please note that this example contains multiple other examples of extensibility, not just inner blocks.

### WooCommerce admin extension examples

WooCommerceプラグインの内部には、WooCommerceのコア機能を変更するためのさまざまな使用例を紹介する一連の拡張機能があります。例えば、カスタムレポートの追加、カスタム支払いゲートウェイ、WooCommerceダッシュボードの変更などです。

WooCommerceの分析レポートを拡張する方法](/docs/features/analytics/extending-woocommerce-admin-reports)を紹介するチュートリアルをお読みください。

## Relevant WordPress Scaffolds

### Default WordPress Theme

デフォルトのWordPressテーマ（この記事を書いている時点ではTwenty-Twenty Five）は、WordPressブロックテーマのベストプラクティスと標準的な規約を見るのに最適な場所です。Create Block Themeツールを使えば、サイトエディターからテーマのデザインを変更し、新しいデザインをカスタム子テーマにエクスポートすることができます。

### @wordpress/create-block

WordPressにコンテンツやデザイン要素を追加する場合、カスタムブロックを作成することは理にかなっているかもしれません。WordPressのブロックエディタパッケージライブラリには、WordPress Create Blockという足場ツールが含まれており、任意のページやテンプレートに挿入できるカスタムブロックを作成するのに役立ちます。

Read more about the [`wordpress/create-block` package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/).

## Sample Store Data

### Core Plugin Sample Data

It may be helpful to load your local store with sample data. In the WooCommerce core plugin, you can find CSV and XML files that can be imported directly into WooCommerce using the WordPress admin or via WC-CLI. The sample data is located in [`/plugins/woocommerce/sample-data/`](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/sample-data).

### Smooth Generator

For more advanced testing, you may want sample customers and order data. [Smooth Generator](https://github.com/woocommerce/wc-smooth-generator) is a plugin to help you generate WooCommerce-related data for testing. Use the WP Admin interface for basic operations, or the CLI tool for more advanced features. Download and install the latest version from the [Releases page](https://github.com/woocommerce/wc-smooth-generator/releases) and browse the repository for more documentation.
