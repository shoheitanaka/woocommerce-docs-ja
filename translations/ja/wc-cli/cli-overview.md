---
sidebar_label: WooCommerce CLI
category_slug: wc-cli
post_title: WooCommerce CLI Overview
sidebar_position: 1
---

# WooCommerce CLI Overview

## Introduction to WooCommerce CLI

WooCommerce CLI (WC-CLI)はコマンドライン経由でWooCommerce (WC)ストアを管理する効率的な方法を提供します。このツールはバージョン3.0.0以降のWCの一部であり、WC REST APIの機能を活用しています。つまり、REST APIで実現可能なほとんどのタスクはコマンドラインでも実行可能です。

For documentation on WC versions 2.5 and 2.6's CLI, visit [Legacy CLI commands](https://github.com/woocommerce/woocommerce/wiki/Legacy-CLI-commands-(v2.6-and-below)).

## About WP-CLI

WP-CLI is a powerful set of command-line tools for managing WordPress installations. You can update plugins, configure multisite installations, and much more, all without using a web browser. For more information, visit the [official WP-CLI website](http://wp-cli.org/).

## Getting Started with WooCommerce CLI

To begin using WC-CLI, ensure that you have WP-CLI installed and that you are running WooCommerce 3.0.0 or later. The CLI commands are accessed through the `wp wc` command. For a full list of available commands, type `wp wc` in your command-line interface.

コマンドとその使用方法の詳細については、コマンドリファレンス セクションを参照してください。ハウツーガイドは、WC-CLIを初めて使用する方や、迅速な解決策をお探しの方に最適な、一般的なタスクに対する実践的なアプローチを提供します。

## Additional Resources

さらに詳しく知りたい方は、以下の資料が参考になるだろう：

- [WC REST API Documentation](https://developer.woocommerce.com/docs/category/rest-api/)
- [Testing files for our CLI tests](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/cli/features)
