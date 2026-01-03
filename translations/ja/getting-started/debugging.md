---
post_title: Resources for debugging
sidebar_label: Debugging
sidebar_position: 7
---

# デバッグのためのリソース

## WordPress

手始めに、WordPress 自体に組み込まれているデバッグ・ツールから始めるのがよいだろう：

[Debugging in WordPress](https://wordpress.org/documentation/article/debugging-in-wordpress/)のドキュメントには、WordPress のコアデバッグツールを有効にするために設定できる環境変数が多数紹介されています。

### クエリーモニター

WordPress 開発者に人気のプラグインは、WordPress 用の開発者ツールである[Query Monitor](https://wordpress.org/plugins/query-monitor/)です。Query Monitor は、データベースクエリ、PHPエラー、AJAX/Rest リクエスト、フックとアクション、ブロックエディタブロック、エンキューされたスクリプトとスタイルシート、HTTP API コールなどのデバッグを可能にします。

### メールのデバッグ

ローカルの WooCommerce 環境で作業する場合、Mailpit や Mailhog のようなツールを有効にして、すべてのトランザクションメールを送信するのではなく、ログにリダイレクトすることをお勧めします。

あるいは、Stop Emails のようなプラグインを使って、誤ってメールがトリガーされないようにすることもできます。

## ウーコマース

### ロギング

WooCommerce にはログシステムがあり、サイトのエラーを見つけたり追跡したりするのにとても役立ちます：

* [WooCommerce におけるロギング](/docs/best-practices/data-management/logging)

### もうすぐモード

WooCommerce の "coming soon "モードでは、作業中に一時的にサイトを見えなくすることができます。

* [Coming soon モードとの統合](/docs/extensions/extension-onboarding/integrating-coming-soon-mode)

## PHP/JavaScript デバッグ

`wp-env`を使用してローカル開発環境を実行している場合（これは WooCommerce モノレポで推奨されている方法です）、Xdebug を有効にして、VS Code や PhpStorm のような IDE を使用してブレークポイントを設定し、コードを実行しながらステップスルーすることができます：

* [Xdebug を使う](https://github.com/WordPress/gutenberg/tree/trunk/packages/env#using-xdebug)
