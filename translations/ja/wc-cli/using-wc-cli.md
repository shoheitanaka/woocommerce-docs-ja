---
post_title: How to use WooCommerce CLI
sidebar_label: Using WooCommerce CLI
sidebar_position: 2
---

# How to Use WooCommerce CLI

## Introduction

このガイドは、コマンドライン経由でWooCommerceストアを管理するためにWooCommerce CLI（WC-CLI）を使用する初心者を支援することを目的としています。

## Getting Started

- WP-CLIがインストールされ、WooCommerceのバージョンが3.0.0以上であることを確認してください。
- WC-CLIの可用性を確認するには：

```bash
wp wc --info
```

### General Command Structure

WC-CLIコマンドの一般的な構文は以下の通り：

```bash
wp wc [command] [options]
```

特定のコマンドの詳細なヘルプを見るには、これを使う：

```bash
wp wc [command] --help
```

## Basic Tasks

### 1. Listing Products

WooCommerceストアの全商品をリストアップします：

```bash
wp wc product list
```

### 2. Creating a New Product

新しい製品を作る：

```bash
wp wc product create --name="New Product" --type="simple" --regular_price="19.99"
```

### 3. Updating a Product

既存の製品（例：製品ID 123）を更新する場合：

```bash
wp wc product update 123 --regular_price="24.99"
```

### 4. Deleting a Product

商品を削除するには（例：商品ID 123）：

```bash
wp wc product delete 123 --force
```

WC-CLIコマンドの完全なリストについては、[WC-CLIコマンド](./wc-cli-commands.md)ドキュメントをチェックしてください。
