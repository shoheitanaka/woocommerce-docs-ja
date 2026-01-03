---
post_title: Setting up your development environment
sidebar_label: Local Development
sidebar_position: 2
---

# 開発環境の設定

## 推奨ソフトウェア

WooCommerce エクステンションを開発する際に考慮する必要がある特定のソフトウェア要件がいくつかあります。必要なソフトウェアは以下の通りです：

* ソースコードのバージョン管理には [Git](https://git-scm.com/)  
* [Node.js](https://nodejs.org/)と[nvm](https://github.com/nvm-sh/nvm/blob/master/README.md)はノードベースのスクリプトとビルドプロセスを管理します。  
* [Pnpm](https://pnpm.io/)は、リポジトリから WooCommerce をビルドする場合に必要な npm の代替です。  
* [Composer](https://getcomposer.org/)はPHPベースの開発のためのオプションの依存関係管理ツールです。  
* [WP-CLI](http://wp-cli.org/) は WordPress のコマンドラインインターフェイスです。

ほとんどの WordPress ホスティング環境には、デフォルトで *Node と Composer が含まれていない*ため、エクステンションやテーマを配布する場合は、ビルドされたすべてのアセットを含めることが重要です。

注：POSIX 準拠のオペレーティングシステム（Linux、macOS など）を前提としています。Windows マシンで作業している場合は、[WSL](https://learn.microsoft.com/en-us/windows/wsl/install) (Windows 10 以降で利用可能)を使用することを推奨します。

## 再利用可能な WordPress 開発環境のセットアップ

上記で紹介したソフトウェアに加えて、ローカルの開発サーバースタックをセットアップするための何らかの方法も用意したい。これにはさまざまなツールがあり、それぞれに機能や制限があります。以下の選択肢の中から、お好みのワークフローに最も適したものを選ぶことをお勧めする。

### WordPress Studio - 推奨アプローチ

簡単なローカル開発環境としては、[WordPress.com](https://developer.wordpress.com) チームがサポートするローカル開発環境である [WordPress Studio](https://developer.wordpress.com/studio/) をお勧めします。Studio には、複数のローカルウェブサイト環境を管理する機能や、コードエディタやターミナルとの統合機能が含まれています。Studio には、WordPress 専用の AI アシスタント、WordPress のバックアップからの簡単なインポート、ブループリントのサポート、無料の公開プレビューサイト、WordPress.com または Pressable でホストされているサイトとの双方向同期などの機能もあります。

[wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/)はWordPress コミュニティによって管理されているコマンドラインユーティリティで、[Docker](https://www.docker.com/)と JSON マニフェストを使用してカスタム WordPress 環境をセットアップして実行することができます。このリポジトリには、WooCommerce コアに貢献するための `.wp-env.json` ファイルが含まれています。

### 一般的な PHP ベースのウェブスタックツール

以下は、WordPress に特化したものではない、環境管理に役立つツールのコレクションです。

* [MAMP](https://www.mamp.info/en/mac/) - Mac や Windows にインストールできるローカルサーバー環境。  
* [WAMP](https://www.wampserver.com/en/) - Apache2、PHP、MySQL でアプリケーションを作成できるWindowsのウェブ開発環境。  
* [XAMPP](https://www.apachefriends.org/index.html) - インストールが簡単な Apache ディストリビューションで、MariaDB、PHP、Perl が含まれています。Windows、Linux、OS X で利用可能です。  
* [Laravel Herd / Valet](https://herd.laravel.com/) - macOS (Valet) と Windows (Herd) 用のミニマリストで高速な開発環境で、Laravel やその他の PHP アプリケーション用に最適化されています。
* [Lando](https://lando.dev/) - 様々な言語やフレームワークのローカル開発サービスを定義・管理するための、Docker ベースの強力なツールです。
* [DDEV](https://ddev.com/) - Drupal や WordPress のような多くの CMS やフレームワークをサポートする、合理化されたローカル Web 開発のためのオープンソースの Docker ベースのツールです。
* [vvv](https://varyingvagrantvagrants.org/) は、VirtualBox と Vagrant を利用した、高度に設定可能で、クロスプラットフォームな、堅牢な環境管理ツールです。 

### 最低サーバー要件

開発環境を管理するために選択したツールにかかわらず、WooCommerce のための[推奨サーバー](https://woocommerce.com/document/server-requirements/?utm_source=wooextdevguide)と[WordPressを実行するための要件](https://wordpress.org/about/requirements/)を満たしていることを確認する必要があります。

## WooCommerce Core を環境に追加する

WooCommerce を開発する場合、WooCommerce Core の開発版をインストールすると便利です。

### オプション1： WooCommerce ベータテスター

従来の WordPress ダッシュボードから WooCommerce をインストールする場合、[WooCommerce Beta Tester](/docs/contribution/testing/beta-testing)エクステンションをインストールすることで、今後のベータ版やリリース候補版へのアクセスを含め、バージョンを変更することもできます。WooCommerce Beta tester は[Woo Marketplace](https://woocommerce.com/marketplace)から入手できます。 

### オプション 2: WooCommerce Core リポジトリをクローンする

また、`trunk` または WooCommerce Core の次期リリースブランチに対して、開発環境で直接作業することもできます：

1.WooCommerce Core リポジトリのクローン。  
2.必要な Node バージョンと PNPM のインストールと有効化。  
3.WooCommerce の依存関係をインストールします。  
4.WooCommerce を構築する。  
5.`plugin/woocommerce` ディレクトリを`wp-content/plugins`ディレクトリにシンボリックリンクする。

#### WooCommerce Core リポジトリをクローンする

以下の CLI コマンドを使って WooCommerce Core リポジトリをローカルにクローンできます：

```shell
cd /your/server/wp-content/plugins
git clone https://github.com/woocommerce/woocommerce.git
cd woocommerce
```

#### ノードのインストールと有効化

[Node Version Manager](https://github.com/nvm-sh/nvm) (または nvm) を使用して Node をインストールし、アクティベートすることをお勧めします。nvm は以下の CLI コマンドでインストールできます：

```shell
nvm install
```

nvmのインストール方法と利用方法については、[nvm GitHub リポジトリ](https://github.com/nvm-sh/nvm?tab=readme-ov-file#intro)を参照してください。

#### 依存関係のインストール

WooCommerce の依存関係をインストールするには、以下の CLI コマンドを使用します：

```shell
pnpm install --frozen-lockfile
```

#### WooCommerceの構築

以下の CLI コマンドを使用して、WooCommerce の動作に必要な JavaScript と CSS をコンパイルします：

```shell
pnpm build
```

注意: コンパイルされたアセットを生成せずにサーバ上で WooCommerce を実行しようとすると、エラーやその他の望ましくない副作用が発生する可能性があります。

#### WooCommerce プラグインをシムリンクする 

WooCommerce プラグインをローカルの開発環境にロードするには、クローンしたリポジトリにある WooCommerce プラグインからローカルの WordPress 開発環境にシンボリックリンクを作成します。

```shell
ln -s woocommerce/plugins/woocommerce /path-to-local/wp-content/plugins
```

#### `woocommerce.zip`アセットの生成

あるいは、以下のコマンドで`woocommerce.zip`ファイルを生成することもできる：

```shell
pnpm build:zip
```

`woocommerce.zip`ファイルは WooCommerce の修正バージョンを別のテスト環境にアップロードしたい場合に役立ちます。
