---
post_title: Setting up your development environment
sidebar_label: Local Development
sidebar_position: 2
---

# Setting up your development environment

## 推奨ソフトウェア

WooCommerceエクステンションを開発する際に考慮する必要がある特定のソフトウェア要件がいくつかあります。必要なソフトウェアは以下の通りです：

* ソースコードのバージョン管理には [Git](https://git-scm.com/)  
* [Node.js](https://nodejs.org/)と[nvm](https://github.com/nvm-sh/nvm/blob/master/README.md)はノードベースのスクリプトとビルドプロセスを管理します。  
* [Pnpm](https://pnpm.io/)は、リポジトリからWooCommerceをビルドする場合に必要なnpmの代替です。  
* [Composer](https://getcomposer.org/)はPHPベースの開発のためのオプションの依存関係管理ツールです。  
* [WP-CLI](http://wp-cli.org/) はWordPressのコマンドラインインターフェイスです。

ほとんどのWordPressホスティング環境には、デフォルトでNodeとComposer*が含まれていないため、エクステンションやテーマを配布する場合は、ビルドされたすべてのアセットを含めることが重要です。

注：POSIX準拠のオペレーティングシステム（Linux、macOSなど）を前提としています。Windowsマシンで作業している場合は、[WSL](https://learn.microsoft.com/en-us/windows/wsl/install) (Windows 10以降で利用可能)を使用することを推奨します。

## 再利用可能なWordPress開発環境のセットアップ

上記で紹介したソフトウェアに加えて、ローカルの開発サーバースタックをセットアップするための何らかの方法も用意したい。これにはさまざまなツールがあり、それぞれに機能や制限があります。以下の選択肢の中から、お好みのワークフローに最も適したものを選ぶことをお勧めする。

### ワードプレススタジオ - 推奨アプローチ

簡単なローカル開発環境としては、[WordPress.com](https://developer.wordpress.com) チームがサポートするローカル開発環境である [WordPress [Studio](https://developer.wordpress.com/studio/) をお勧めします。Studioには、複数のローカルウェブサイト環境を管理する機能や、コードエディタやターミナルとの統合機能が含まれています。Studioには、WordPress専用のAIアシスタント、WordPressのバックアップからの簡単なインポート、ブループリントのサポート、無料の公開プレビューサイト、WordPress.comまたはPressableでホストされているサイトとの双方向同期などの機能もあります。

[wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/)はWordPressコミュニティによって管理されているコマンドラインユーティリティで、[Docker](https://www.docker.com/)とJSONマニフェストを使用してカスタムWordPress環境をセットアップして実行することができます。このリポジトリには、WooCommerceコアに貢献するための`.wp-env.json`ファイルが含まれています。

### 一般的なPHPベースのウェブスタックツール

以下は、WordPressに特化したものではない、環境管理に役立つツールのコレクションです。

* [MAMP](https://www.mamp.info/en/mac/) - MacやWindowsにインストールできるローカルサーバー環境。  
* [WAMP](https://www.wampserver.com/en/) - Apache2、PHP、MySQLでアプリケーションを作成できるWindowsのウェブ開発環境。  
* [XAMPP](https://www.apachefriends.org/index.html) - インストールが簡単なApacheディストリビューションで、MariaDB、PHP、Perlが含まれています。Windows、Linux、OS Xで利用可能です。  
* [Laravel [Herd / Valet](https://herd.laravel.com/) - macOS (Valet) と Windows (Herd) 用のミニマリストで高速な開発環境で、Laravel やその他の PHP アプリケーション用に最適化されています。
* [Lando](https://lando.dev/) - 様々な言語やフレームワークのローカル開発サービスを定義・管理するための、Dockerベースの強力なツールです。
* [DDEV](https://ddev.com/) - DrupalやWordPressのような多くのCMSやフレームワークをサポートする、合理化されたローカルWeb開発のためのオープンソースのDockerベースのツールです。
* [vvv](https://varyingvagrantvagrants.org/) は、VirtualBoxとVagrantを利用した、高度に設定可能で、クロスプラットフォームな、堅牢な環境管理ツールです。 

### 最低サーバー要件

開発環境を管理するために選択したツールにかかわらず、WooCommerceのための[推奨サーバー](https://woocommerce.com/document/server-requirements/?utm_source=wooextdevguide)と[WordPressを実行するための要件](https://wordpress.org/about/requirements/)を満たしていることを確認する必要があります。

## WooCommerce Coreを環境に追加する

WooCommerceを開発する場合、WooCommerce Coreの開発版をインストールするのが便利です。

### オプション1：WooCommerceベータテスター

従来のWordPressダッシュボードからWooCommerceをインストールする場合、[WooCommerce Beta Tester](/docs/contribution/testing/beta-testing)エクステンションをインストールすることで、今後のベータ版やリリース候補版へのアクセスを含め、バージョンを変更することもできます。WooCommerce Beta testerは[Woo [Marketplace](https://woocommerce.com/marketplace)から入手できます。 

### オプション 2: WooCommerce Core リポジトリをクローンする

また、`trunk`またはWooCommerce Coreの次期リリースブランチに対して、開発環境で直接作業することもできます：

1.WooCommerce Coreリポジトリのクローン。  
2.必要なNodeバージョンとPNPMのインストールと有効化。  
3.WooCommerceの依存関係をインストールします。  
4.WooCommerceを構築する。  
5.INLINE_CODE_0__ディレクトリを`wp-content/plugins`ディレクトリにシンボリックリンクする。

#### WooCommerce Coreリポジトリをクローンする

以下のCLIコマンドを使ってWooCommerce Coreリポジトリをローカルにクローンできます：

```shell
cd /your/server/wp-content/plugins
git clone https://github.com/woocommerce/woocommerce.git
cd woocommerce
```

#### ノードのインストールと有効化

Node [Version Manager](https://github.com/nvm-sh/nvm) (または nvm) を使用して Node をインストールし、アクティベートすることをお勧めします。nvmは以下のCLIコマンドでインストールできます：

```shell
nvm install
```

nvmのインストール方法と利用方法については、[nvm [GitHubリポジトリ](https://github.com/nvm-sh/nvm?tab=readme-ov-file#intro)を参照してください。

#### 依存関係のインストール

WooCommerceの依存関係をインストールするには、以下のCLIコマンドを使用します：

```shell
pnpm install --frozen-lockfile
```

#### WooCommerceの構築

以下のCLIコマンドを使用して、WooCommerceの動作に必要なJavaScriptとCSSをコンパイルします：

```shell
pnpm build
```

注意: コンパイルされたアセットを生成せずにサーバ上でWooCommerceを実行しようとすると、エラーやその他の望ましくない副作用が発生する可能性があります。

#### WooCommerce プラグインをシムリンクする 

WooCommerceプラグインをローカルの開発環境にロードするには、クローンしたリポジトリにあるWooCommerceプラグインからローカルのWordPress開発環境にシンボリックリンクを作成します。

```shell
ln -s woocommerce/plugins/woocommerce /path-to-local/wp-content/plugins
```

#### `woocommerce.zip`アセットの生成

あるいは、以下のコマンドで`woocommerce.zip`ファイルを生成することもできる：

```shell
pnpm build:zip
```

`woocommerce.zip`ファイルはWooCommerceの修正版を別のテスト環境にアップロードしたい場合に役立ちます。
