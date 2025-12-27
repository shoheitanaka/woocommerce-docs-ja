---
post_title: How to use WooCommerce CLI
sidebar_label: Using WooCommerce CLI
sidebar_position: 2
---
# WooCommerce CLIの使い方

## はじめに

このガイドは、コマンドライン経由でWooCommerceストアを管理するためにWooCommerce CLI（WC-CLI）を使用する初心者を支援することを目的としています。

## ♪ はじめに

- WP-CLIがインストールされ、WooCommerceのバージョンが3.0.0以上であることを確認してください。
- WC-CLIの可用性を確認するには：

```bash
wp wc --info
```

### 一般的な指揮系統

WC-CLIコマンドの一般的な構文は以下の通り：

```bash
wp wc [command] [options]
```

特定のコマンドの詳細なヘルプを見るには、これを使う：

```bash
wp wc [command] --help
```

## 基本的な仕事

### 1.掲載商品

WooCommerceストアの全商品をリストアップします：

```bash
wp wc product list
```

### 2.新製品の作成

新しい製品を作る：

```bash
wp wc product create --name="New Product" --type="simple" --regular_price="19.99"
```

### 3.製品の更新

既存の製品（例：製品ID 123）を更新する場合：

```bash
wp wc product update 123 --regular_price="24.99"
```

### 4.製品の削除

商品を削除するには（例：商品ID 123）：

```bash
wp wc product delete 123 --force
```

WC-CLIコマンドの完全なリストについては、[WC-CLIコマンド](./wc-cli-commands.md)ドキュメントをチェックしてください。
