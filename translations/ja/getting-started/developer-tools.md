---
post_title: WooCommerce developer tools
sidebar_label: Developer tools
sidebar_position: 5
---

# 開発ツール

このガイドでは、WooCommerceの開発に不可欠なツールとライブラリの概要を説明します。WooCommerceプロジェクトを効率的に強化したい開発者を対象としています。

## 生産性向上ツール

これらのリソースを使用して、WooCommerceの開発ワークフローを強化しましょう。

### 開発

#### [wp-cli](https://wp-cli.org/)

This is the command-line interface for [WordPress](https://wordpress.org/). You can update plugins, configure multisite installations and much more, without using a web browser.

#### [wc-cli](/docs/wc-cli/cli-overview)

WooCommerceがWordPressインストール上で動作している場合、WP-CLIはストアデータを管理するための追加機能で拡張されます。

#### [wp-env](https://www.npmjs.com/package/@wordpress/env)

このコマンドラインツールを使うと、プラグインやテーマのビルドとテストのために、ローカルのWordPress Docker環境を簡単にセットアップできます。インストールは簡単で、設定も不要です。

#### [woocommerce/eslint-plugin](https://www.npmjs.com/package/@woocommerce/eslint-plugin)

This is an [ESLint](https://eslint.org/) plugin including configurations and custom rules for WooCommerce development.

#### [WordPress Scripts](https://www.npmjs.com/package/@wordpress/scripts)

wordpress/scriptsパッケージは、WordPressプロジェクトの開発プロセス、特にブロック開発とカスタムGutenberg統合を合理化するために設計されたツールとスクリプトのセットです。このパッケージには、Webpack のビルドプロセスと、リンティング、スタイリング、テストなどのタスクの設定が含まれています。

It also includes the [Dependency Extraction Webpack Plugin](https://www.npmjs.com/package/@wordpress/dependency-extraction-webpack-plugin), which allows JavaScript bundles produced by webpack to leverage WordPress style dependency sharing without an error-prone process of manually maintaining a dependency list.

### テスト

#### [Smooth Generator](https://github.com/woocommerce/wc-smooth-generator)

A plugin to help you generate WooCommerce-related data for testing. Use the WP Admin interface for basic operations, or the CLI tool for more advanced features. Download and install the latest version from the [Releases page](https://github.com/woocommerce/wc-smooth-generator/releases) and review the [documentation on GitHub](https://github.com/woocommerce/wc-smooth-generator).

#### [WooCommerce Dummy Payments Gateway](https://github.com/woocommerce/woocommerce-gateway-dummy)

サブスクリプションとブロックベースのチェックアウトをサポートした、WooCommerce開発のためのダミー決済ゲートウェイです。

#### [QIT](https://qit.woo.com/)

QITは、マネージドテスト、E2Eテスト、使い捨てのローカルテスト環境を備えたWooCommerceプラグインとテーマのためのテストプラットフォームです。

## ライブラリー

これらのリソースを使用することで、データの取得や変換、UI 要素の作成などの手間を省くことができます。

### APIクライアント

#### [WooCommerce REST API - JavaScript](https://www.npmjs.com/package/@woocommerce/woocommerce-rest-api)

WooCommerce REST APIを使用するための公式JavaScriptライブラリです。

#### [WooCommerce Store API](https://developer.woocommerce.com/docs/category/store-api/)

Store API は、顧客向けのカート、チェックアウト、商品機能を開発するためのパブリックな Rest API エンドポイントを提供します。WordPress REST API で使用されているパターンの多くに従っています。

WooCommerce REST APIとは対照的に、Store APIは認証されておらず、機密性の高い店舗データやその他の顧客情報へのアクセスを提供しません。

#### [wordpress/api-fetch](https://www.npmjs.com/package/@wordpress/api-fetch)

The `@wordpress/api-fetch` package is a utility that simplifies AJAX requests to the WordPress REST API. It's a wrapper around `window.fetch` that provides a consistent interface for handling authentication, settings, and errors, allowing developers to easily interact with WordPress backend services.

### コンポーネント

#### [WooCommerce Components](https://www.npmjs.com/package/@woocommerce/components)

This package includes a library of React components that can be used to create pages in the WooCommerce admin area. To preview these components, review the [Woo Storybook](https://woocommerce.github.io/woocommerce/).

#### [WordPress Components](https://www.npmjs.com/package/@wordpress/components)

This package includes a library of generic WordPress components that can be used for creating common UI elements shared between screens and features of the WordPress dashboard. To preview these components, review the [Gutenberg Storybook](https://wordpress.github.io/gutenberg/).

### JavaScriptユーティリティ・パッケージ

#### [CSV Export](https://www.npmjs.com/package/@woocommerce/csv-export)

データをCSV値に変換し、CSVデータのブラウザダウンロードを可能にする関数群。

#### [Currency](https://www.npmjs.com/package/@woocommerce/currency)

通貨値を表示したり操作したりするためのユーティリティ集。

#### [Data](https://www.npmjs.com/package/@woocommerce/data)

WooCommerce Adminデータストアを管理するユーティリティです。

#### [Date](https://www.npmjs.com/package/@woocommerce/date)

日付の値を表示したり操作したりするためのユーティリティ集。

#### [Navigation](https://www.npmjs.com/package/@woocommerce/navigation)

クエリパラメータオブジェクトの処理、クエリパラメータのシリアライズ、クエリパラメータの更新、パス変更のトリガを行うナビゲーション関連関数のコレクション。

#### [Number](https://www.npmjs.com/package/@woocommerce/number)

WooCommerceで数値を適切にローカライズするためのユーティリティ集です。
