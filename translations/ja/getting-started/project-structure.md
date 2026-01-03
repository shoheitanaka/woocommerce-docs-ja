---
post_title: Project structure
sidebar_label: Project structure
sidebar_position: 1
---

# プロジェクト構造

## 前提条件

WooCommerce は WordPress のコード標準とガイドラインに準拠しているため、[WordPress 開発](https://learn.wordpress.org/tutorial/introduction-to-wordpress/)と[PHP](https://www.php.net/)に精通していることが最善です。現在、WooCommerce には PHP 7.4 以降が必要です。

[WooCommerce hooks and filters](https://woocommerce.com/document/introduction-to-hooks-actions-and-filters/?utm_source=wooextdevguide)の知識と理解を深めることで、コアファイルを編集することなくコードを追加・変更できるようになります。WordPressのフックとフィルターについては、[WordPress プラグイン開発ハンドブック](https://developer.wordpress.org/plugins/hooks/)で詳しく説明されています。

## 推薦図書

WooCommerce 拡張機能は、WordPress プラグインの特殊なタイプです。WordPress プラグイン開発の初心者の方は、[WordPress プラグイン開発者ハンドブック](https://developer.wordpress.org/plugins/)の記事のいくつかをご覧ください。

## WordPress 環境の解剖

開発環境はさまざまですが、WordPress 環境の基本的なファイル構造は一貫しているはずです。

WooCommerce のエクステンションを開発する場合、通常はローカルサーバーの`public_html/`ディレクトリ内でほとんどの作業を行います。

WordPress のインストールには3つのディレクトリがあります。`wp-admin`と`wp-includes`ディレクトリにはコア機能が含まれており、変更すべきではありません。3つ目の`wp-content`ディレクトリには、カスタム設定やユーザーが作成したメディアが保存されます。

時間をかけて、`wp-content`の中のいくつかの重要なパスに慣れ親しんでください：

* `wp-content/debug.log`は、WordPress がエラーやデバッグに役立つその他のメッセージなどの重要な出力を書き込むファイルです。  
* `wp-content/plugins`/は、WordPress のプラグインフォルダがあるサーバー上のディレクトリです。  
* `wp-content/themes/`は、WordPress のテーマフォルダがあるサーバー上のディレクトリです。テーマはテンプレートとスタイルの集まりで、WordPress はアクティブなテーマを1つだけ持つことができます。

最後に、WordPress インストールのルートには、`wp-config.php`という設定可能なファイルがあります。このファイルは`.env`ファイルと同様に機能し、重要なセキュリティ認証情報と環境設定を定義する変数を保存します。

## WooCommerce プラグインの構造 

WordPress のインストールに WooCommerce を追加する場合、WordPress のダッシュボードからプラグインをインストールするか、手動で`wp-content/plugins`ディレクトリにプラグインディレクトリをアップロードします。 

**重要:** WooCommerce リポジトリは複数のプラグインとパッケージを含む monorepo です。リポジトリから WooCommerce をインストールするには、単純にリポジトリ全体を`wp-content/plugins`にクローンすることはできません。WooCommerce プラグインは monorepo の`plugins/`ディレクトリ内にあるので、リポジトリから開発する場合は、ローカルの WordPress インストール外にクローンし、シンボリックリンクを使って`wp-content/plugins`に「配置」することをお勧めします。 

各プラグイン、パッケージ、ツールには、プロジェクト固有の依存関係とスクリプトを含む`package.json`ファイルがあります。ほとんどのプロジェクトでは、`README.md`ファイルにもプロジェクト固有のセットアップ手順やドキュメントが含まれています。

* [**Plugins**](http://github.com/woocommerce/woocommerce/tree/trunk/plugins):私たちのリポジトリには、WooCommerce に関連するプラグイン、またはWooCommerceの開発を支援するプラグインが含まれています。  
    * [**WooCommerce Core**](http://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce):WooCommerce のコアプラグインは plugins ディレクトリにあります。  
* [**Packages**](http://github.com/woocommerce/woocommerce/tree/trunk/packages):packagesディレクトリには、コミュニティのために提供されるすべての [PHP](http://github.com/woocommerce/woocommerce/tree/trunk/packages/php) と [JavaScript](http://github.com/woocommerce/woocommerce/tree/trunk/packages/js) が含まれています。これらのいくつかは内部依存であり、`internal-`プレフィックスでマークされています。  
* [**Tools**](http://github.com/woocommerce/woocommerce/tree/trunk/tools):私たちのリポジトリにはツールも増えています。これらの多くは monorepo で使用するユーティリティやスクリプトを意図したものですが、このディレクトリには外部のツールも含まれることがあります。

モノレポの仕組みについてもっと知りたい方は、[こちらのガイドをご覧ください](http://github.com/woocommerce/woocommerce/tree/trunk/tools/README.md)。

## テーマ設定と機能拡張

WooCommerce のコアに直接貢献しない限り、WordPress や WooCommerce のファイルを直接編集することはありません。すべての機能の変更はカスタム拡張機能を作成するか、アクティブなテーマの`functions.php`ファイルを変更することで行います。 

WooCommerce ストアのデザイン*を編集するには、カスタムテーマを修正または作成することをお勧めします。WooCommerce のテーマ作成については[テーマ開発ハンドブック](/docs/theming/theme-development/classic-theme-developer-handbook)をご覧ください。

WooCommerce ストアの*機能を編集するには、複数のオプションがあります。まず、[Woo マーケットプレイス](https://woocommerce.com/marketplace)を利用して、あなたのニーズに合った適切な既成の拡張機能を見つけることができます。簡単なカスタマイズについては、[コードスニペット](/docs/code-snippets/) をストアに追加する簡単な方法について詳しく知ることができます。より高度な開発が必要な場合は、カスタム拡張機能（WordPress プラグイン）を作成することをお勧めします。 
