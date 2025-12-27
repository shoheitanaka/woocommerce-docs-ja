---
sidebar_label: Extension guidelines
category_slug: user-experience-extensions
post_title: Extension guidelines
---
# エクステンション・ガイドライン

このセクションでは、使いやすさ、シームレスな統合、および強力な採用のために、製品エクスペリエンスをWooCommerceと一致させるために従うべき一般的なガイドラインとベストプラクティスについて説明します。

ユーザーエクスペリエンスと分類学に慣れるために、現在の[WooCommerceセットアップ体験](https://woocommerce.com/documentation/plugins/woocommerce/getting-started/)を確認することを強くお勧めします。

また、[WordPressコアガイドライン](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/)を確認し、コンテンツスタイルに関する[参考資料](https://woocommerce.com/document/grammar-punctuation-style-guide/)を確認することをお勧めします。

## General

既存のWordPress/WooCommerce UI、組み込みコンポーネント（テキストフィールド、チェックボックスなど）、および既存のメニュー構造を使用します。

WordPressのコアデザインの美しさを利用したプラグインは、WordPressが進化し続けるにつれて、将来的にこのデザインの更新の恩恵を受けるでしょう。あなたの製品に例外を設ける必要がある場合は、有効なユースケースを提示できるように準備してください。

-   [WordPressコンポーネントライブラリ](https://wordpress.github.io/gutenberg/?path=/story/docs-introduction--page)
-   [Figma for WordPress](https://make.wordpress.org/design/2018/11/19/figma-for-wordpress/) | ([WordPress デザインライブラリ Figma](https://www.figma.com/file/e4tLacmlPuZV47l7901FEs/WordPress-Design-Library))
-   [WooCommerceコンポーネントライブラリ](https://woocommerce.github.io/woocommerce/)

## コンポーネントライブラリ - ストーリーブック

> Storybookは、ReactやReact NativeなどのUIコンポーネントを分離して開発するためのオープンソースツールです。魅力的なUIを組織的かつ効率的に構築できます。

WooCommerceリポジトリには[Storybook](https://storybook.js.org/)統合も含まれており、WooCommerceに依存しないコンテキストでのテストや開発が可能です。これは再利用可能なコンポーネントを開発したり、バックエンドに依存することなく一般的なJavaScriptモジュールを試すのにとても役立ちます。

ローカルで`pnpm --filter=@woocommerce/storybook watch:build`を実行することで、Storybookを起動できます。自動的にブラウザで開きます。

現在の`trunk`ブランチのStorybookをGitHub Pagesでテストすることもできます：[https://woocommerce.github.io/woocommerce](https://woocommerce.github.io/woocommerce)
