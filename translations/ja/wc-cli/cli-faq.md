---
post_title: WooCommerce CLI frequently asked questions
sidebar_label: Frequently asked questions
sidebar_position: 5
---

# WooCommerce CLI Frequently Asked Questions

## 一般的な質問

### WooCommerce CLIとは何ですか？

- WooCommerce CLI (WC-CLI)はWooCommerceの設定とデータを管理するためのコマンドラインインターフェイスです。WordPressの管理インターフェイスから手作業で行わなければならない多くのタスクを、高速かつ効率的に実行する方法を提供します。

### WooCommerce CLIをインストールするには？

- WooCommerce CLIはバージョン3.0.0以降WooCommerceの一部として含まれています。WooCommerce 3.0.0以降がインストールされていることを確認してください。

### WooCommerce CLIはWP-CLIと違いますか？

- WooCommerce CLIは、WooCommerceのために特別に設計されたWP-CLIの一部です。WP-CLIが一般的なWordPress管理を扱うのに対し、WC-CLIはWooCommerceに特化したタスクに焦点を当てています。

## 技術的な質問

### WooCommerceデータのバックアップはどのように作成できますか？

- WC-CLIは直接バックアップを処理しません。しかし、他のWP-CLIコマンドを使用してWooCommerceデータをエクスポートするか、WordPressバックアッププラグインに依存することができます。

### CLIを使ってWooCommerceの設定を更新できますか？

- はい、WC-CLIを使用して多くのWooCommerce設定を更新することができます。例えば、ストアのEメール設定を更新するには、wp wc setting update [options]のようなコマンドを使用します。

## トラブルシューティング

### なぜ "permission denied "エラーが発生するのですか？

- このエラーは、ユーザー・ロールに必要な権限がない場合によく発生します。管理者権限のあるアカウントを使用していることを確認してください。

### コマンドが期待通りに動作しない場合はどうすればよいですか？

- タイプミスをチェックし、--helpでコマンド構文を確認してください。問題が解決しない場合は、コマンドリファレンスを参照するか、WooCommerceコミュニティにサポートを求めてください。

### コマンド使用時に404エラーが発生した場合はどうすればいいですか？

`Error: Sorry, you cannot list resources. {"status":401}`のような401エラーが表示される場合、認証されていない状態でコマンドを使用しようとしています。3.0以降のWooCommerce CLIでは、アクションを実行するユーザーを指定する必要があります。`--user`フラグを使ってユーザーIDを入力してください。

### Xのリストを更新しようとしているのですが、保存されません。

いくつかの「リスト」は実際にはオブジェクトです。たとえば、商品にカテゴリを設定したい場合、REST API はオブジェクトの配列を期待します。

これを設定するには、次のようなJSONを使用する：

```bash
wp wc product create --name='Product Name' --categories='[ { "id" : 21 } ]' --user=admin
```

## 高度な使用法

### 商品の一括更新にWooCommerce CLIを使用できますか？

- はい、WC-CLIは一括操作に適しています。スクリプトを使用して製品リストをループし、更新を適用できます。

### WC-CLIで複雑なクエリを処理するには？

- WC-CLIは、複雑なクエリを構築するために使用できるさまざまな引数やフィルタをサポートしています。これらをシェルスクリプトと組み合わせることで、強力な結果を得ることができる。
