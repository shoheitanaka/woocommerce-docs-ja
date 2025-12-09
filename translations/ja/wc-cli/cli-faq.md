---
post_title: WooCommerce CLI frequently asked questions
sidebar_label: Frequently asked questions
sidebar_position: 5
---

# WooCommerce CLI Frequently Asked Questions

## General Questions

### What is WooCommerce CLI?

- WooCommerce CLI (WC-CLI)はWooCommerceの設定とデータを管理するためのコマンドラインインターフェイスです。WordPressの管理インターフェイスから手作業で行わなければならない多くのタスクを、高速かつ効率的に実行する方法を提供します。

### How do I install WooCommerce CLI?

- WooCommerce CLIはバージョン3.0.0以降WooCommerceの一部として含まれています。WooCommerce 3.0.0以降がインストールされていることを確認してください。

### Is WooCommerce CLI different from WP-CLI?

- WooCommerce CLIは、WooCommerceのために特別に設計されたWP-CLIの一部です。WP-CLIが一般的なWordPress管理を扱うのに対し、WC-CLIはWooCommerceに特化したタスクに焦点を当てています。

## Technical Questions

### How can I create a backup of my WooCommerce data?

- WC-CLIは直接バックアップを処理しません。しかし、他のWP-CLIコマンドを使用してWooCommerceデータをエクスポートするか、WordPressバックアッププラグインに依存することができます。

### Can I update WooCommerce settings using the CLI?

- はい、WC-CLIを使用して多くのWooCommerce設定を更新することができます。例えば、ストアのEメール設定を更新するには、wp wc setting update [options]のようなコマンドを使用します。

## Troubleshooting

### Why am I getting a "permission denied" error?

- このエラーは、ユーザー・ロールに必要な権限がない場合によく発生します。管理者権限のあるアカウントを使用していることを確認してください。

### What should I do if a command is not working as expected

- タイプミスをチェックし、--helpでコマンド構文を確認してください。問題が解決しない場合は、コマンドリファレンスを参照するか、WooCommerceコミュニティにサポートを求めてください。

### What do I do if I get 404 errors when using commands?

If you are getting a 401 error like `Error: Sorry, you cannot list resources. {"status":401}`, you are trying to use the command unauthenticated. The WooCommerce CLI as of 3.0 requires you to provide a proper user to run the action as. Pass in your user ID using the `--user` flag.

### I am trying to update a list of X, but it's not saving

いくつかの「リスト」は実際にはオブジェクトです。たとえば、商品にカテゴリを設定したい場合、REST API はオブジェクトの配列を期待します。

これを設定するには、次のようなJSONを使用する：

```bash
wp wc product create --name='Product Name' --categories='[ { "id" : 21 } ]' --user=admin
```

## Advanced Usage

### Can I use WooCommerce CLI for bulk product updates?

- はい、WC-CLIは一括操作に適しています。スクリプトを使用して製品リストをループし、更新を適用できます。

### How do I handle complex queries with WC-CLI?

- WC-CLIは、複雑なクエリを構築するために使用できるさまざまな引数やフィルタをサポートしています。これらをシェルスクリプトと組み合わせることで、強力な結果を得ることができる。
