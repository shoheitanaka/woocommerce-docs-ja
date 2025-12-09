---
sidebar_label: Extension guidelines
category_slug: user-experience-extensions
post_title: Extension guidelines
---

# Extension Guidelines

このセクションでは、使いやすさ、シームレスな統合、および強力な採用のために、製品エクスペリエンスをWooCommerceと一致させるために従うべき一般的なガイドラインとベストプラクティスについて説明します。

We strongly recommend you review the current [WooCommerce setup experience](https://woocommerce.com/documentation/plugins/woocommerce/getting-started/) to get familiar with the user experience and taxonomy.

We also recommend you review the [WordPress core guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/) to ensure your product isn't breaking any rules, and review [this helpful resource](https://woocommerce.com/document/grammar-punctuation-style-guide/) on content style.

## General

既存のWordPress/WooCommerce UI、組み込みコンポーネント（テキストフィールド、チェックボックスなど）、および既存のメニュー構造を使用します。

WordPressのコアデザインの美しさを利用したプラグインは、WordPressが進化し続けるにつれて、将来的にこのデザインの更新の恩恵を受けることになります。あなたの製品に例外を設ける必要がある場合は、有効なユースケースを提示できるように準備してください。

-   [WordPress Components library](https://wordpress.github.io/gutenberg/?path=/story/docs-introduction--page)
-   [Figma for WordPress](https://make.wordpress.org/design/2018/11/19/figma-for-wordpress/) | ([WordPress Design Library Figma](https://www.figma.com/file/e4tLacmlPuZV47l7901FEs/WordPress-Design-Library))
-   [WooCommerce Component Library](https://woocommerce.github.io/woocommerce/)

## Component Library - Storybook

&gt; Storybookは、ReactやReact NativeなどのUIコンポーネントを分離して開発するためのオープンソースツールです。魅力的なUIを組織的かつ効率的に構築できます。

The WooCommerce repository also includes [Storybook](https://storybook.js.org/) integration that allows testing and developing in a WooCommerce-agnostic context. This is very helpful for developing reusable components and trying generic JavaScript modules without any backend dependency.

You can launch Storybook by running `pnpm --filter=@woocommerce/storybook watch:build` locally. It will open in your browser automatically.

You can also test Storybook for the current `trunk` branch on GitHub Pages: [https://woocommerce.github.io/woocommerce](https://woocommerce.github.io/woocommerce)
