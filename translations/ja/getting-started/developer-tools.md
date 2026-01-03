---
post_title: WooCommerce developer tools
sidebar_label: Developer tools
sidebar_position: 5
---

# 開発者ツール

このガイドでは、WooCommerce の開発に不可欠なツールとライブラリの概要を説明します。WooCommerce プロジェクトを効率的に強化したい開発者を対象としています。

## 生産性向上ツール

これらのリソースを使用して、WooCommerce の開発ワークフローを強化しましょう。

### 開発

#### [wp-cli](https://wp-cli.org/)

[WordPress](https://wordpress.org/) のコマンドラインインターフェイスです。ウェブブラウザを使わずに、プラグインの更新やマルチサイトの設定などができます。

#### [wc-cli](/docs/wc-cli/cli-overview)

WooCommerce が WordPress インストール上で動作している場合、WP-CLI はストアデータを管理するための追加機能で拡張されます。

#### [wp-env](https://www.npmjs.com/package/@wordpress/env)

このコマンドラインツールを使えば、プラグインやテーマのビルドやテストのために、ローカルの WordPress Docker 環境を簡単にセットアップできます。インストールは簡単で、設定も不要です。

#### [woocommerce/eslint-plugin](https://www.npmjs.com/package/@woocommerce/eslint-plugin)

WooCommerce 開発のための設定とカスタムルールを含む[ESLint](https://eslint.org/) プラグインです。

#### [WordPress スクリプト](https://www.npmjs.com/package/@wordpress/scripts)

wordpress/scripts パッケージは、WordPress プロジェクトの開発プロセス、特にブロック開発とカスタム Gutenberg 統合を合理化するために設計されたツールとスクリプトのセットです。このパッケージには、Webpack のビルドプロセスと、リンティング、スタイリング、テストなどのタスクの設定が含まれています。

また、[Dependency Extraction Webpack Plugin](https://www.npmjs.com/package/@wordpress/dependency-extraction-webpack-plugin)も含まれており、webpack によって生成された JavaScript バンドルは、手動で依存性リストを管理するようなエラーが発生しやすいプロセスなしに、WordPress スタイルの依存性共有を活用することができます。

### テスト

#### [スムーズ・ジェネレーター](https://github.com/woocommerce/wc-smooth-generator)

[テスト用に WooCommerce 関連のデータを生成するのに役立つプラグインです。基本的な操作には WP Admin インターフェイスを使用し、より高度な機能には CLI ツールを使用します。リリースページ](https://github.com/woocommerce/wc-smooth-generator/releases)から最新版をダウンロードしてインストールし、[GitHub 上のドキュメント](https://github.com/woocommerce/wc-smooth-generator)を確認してください。

#### [WooCommerce ダミーペイメントゲートウェイ](https://github.com/woocommerce/woocommerce-gateway-dummy)

サブスクリプションとブロックベースのチェックアウトをサポートした、WooCommerce 開発のためのダミー決済ゲートウェイです。

#### [qit](https://qit.woo.com/)

QIT は、マネージドテスト、E2E テスト、使い捨てのローカルテスト環境を備えた WooCommerce プラグインとテーマのためのテストプラットフォームです。

## ライブラリー

これらのリソースを使用することで、データの取得や変換、UI 要素の作成などの手間を省くことができます。

### API クライアント

#### [WooCommerce REST API - JavaScript](https://www.npmjs.com/package/@woocommerce/woocommerce-rest-api)

WooCommerce REST API を使用するための公式 JavaScript ライブラリです。

#### [WooCommerce Store API](https://developer.woocommerce.com/docs/category/store-api/)

Store API は、顧客向けのカート、チェックアウト、商品機能を開発するためのパブリックな Rest API エンドポイントを提供します。WordPress REST API で使用されているパターンの多くに従っています。

WooCommerce REST APIとは対照的に、Store APIは認証されておらず、機密性の高い店舗データやその他の顧客情報へのアクセスを提供しません。

#### [wordpress/api-fetch](https://www.npmjs.com/package/@wordpress/api-fetch)

`@wordpress/api-fetch` パッケージは WordPress REST API への AJAX リクエストを簡素化するユーティリティです。これは `window.fetch` のラッパーで、認証、設定、エラーを処理するための一貫したインターフェイスを提供し、開発者がWordPressのバックエンドサービスと簡単にやりとりできるようにします。

### コンポーネント

#### [WooCommerce Components](https://www.npmjs.com/package/@woocommerce/components)

本パッケージには、WooCommerce 管理エリアでページを作成するために使用できる React コンポーネントのライブラリが含まれています。これらのコンポーネントをプレビューするには、[Woo Storybook](https://woocommerce.github.io/woocommerce/) をご覧ください。

#### [WordPress Components](https://www.npmjs.com/package/@wordpress/components)

本パッケージには、WordPress ダッシュボードの画面や機能間で共有される共通の UI 要素を作成するために使用できる、汎用的な WordPress コンポーネントのライブラリが含まれています。これらのコンポーネントをプレビューするには、[Gutenberg Storybook](https://wordpress.github.io/gutenberg/) をご覧ください。

### JavaScript ユーティリティ・パッケージ

#### [CSV エクスポート](https://www.npmjs.com/package/@woocommerce/csv-export)

データを CSV 値に変換し、CSV データのブラウザダウンロードを可能にする関数群。

#### [通貨](https://www.npmjs.com/package/@woocommerce/currency)

通貨値を表示したり操作したりするためのユーティリティ集。

#### [データ](https://www.npmjs.com/package/@woocommerce/data)

WooCommerce Admin データストアを管理するユーティリティです。

#### [日付](https://www.npmjs.com/package/@woocommerce/date)

日付の値を表示したり操作したりするためのユーティリティ集。

#### [ナビゲーション](https://www.npmjs.com/package/@woocommerce/navigation)

クエリパラメータオブジェクトの処理、クエリパラメータのシリアライズ、クエリパラメータの更新、パス変更のトリガを行うナビゲーション関連関数のコレクション。

#### [番号](https://www.npmjs.com/package/@woocommerce/number)

WooCommerce で数値を適切にローカライズするためのユーティリティ集です。
