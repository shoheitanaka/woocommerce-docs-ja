---
post_title: Resources for debugging
sidebar_label: Debugging
sidebar_position: 7
---
# デバッグ用リソース

## ワードプレス

手始めに、WordPress自体に組み込まれているデバッグ・ツールから始めるのがよいだろう：

[Debugging in WordPress c](https://wordpress.org/documentation/article/debugging-in-wordpress/)のドキュメントには、WordPressのコアデバッグツールを有効にするために設定できる環境変数が多数紹介されています。

### クエリーモニター

WordPress開発者に人気のプラグインは、WordPress用の開発者ツールである[Query Monitor](https://wordpress.org/plugins/query-monitor/)です。Query Monitorは、データベースクエリ、PHPエラー、AJAX/Restリクエスト、フックとアクション、ブロックエディタブロック、エンキューされたスクリプトとスタイルシート、HTTP APIコールなどのデバッグを可能にします。

### 電子メールのデバッグ

ローカルのWooCommerce環境で作業する場合、MailpitやMailhogのようなツールを有効にして、すべてのトランザクションメールを送信するのではなく、ログにリダイレクトすることをお勧めします。

あるいは、Stop Emailsのようなプラグインを使って、誤ってメールがトリガーされないようにすることもできます。

## ウーコマース

### ロギング

WooCommerceにはログシステムがあり、サイトのエラーを見つけたり追跡したりするのにとても役立ちます：

* [WooCommerceにおけるロギング](/docs/best-practices/data-management/logging)

### もうすぐモード

WooCommerceの "coming soon "モードでは、作業中に一時的にサイトを見えなくすることができます。

* [近日モードとの統合](/docs/extensions/extension-onboarding/integrating-coming-soon-mode)

## PHP/JavaScriptデバッグ

### Xdebug

`wp-env`を使用してローカル開発環境を実行している場合（これはWooCommerceモノレポで推奨されている方法です）、Xdebugを有効にして、VS CodeやPhpStormのようなIDEを使用してブレークポイントを設定し、コードを実行しながらステップスルーすることができます：

* [Xdebugを使う](https://github.com/WordPress/gutenberg/tree/trunk/packages/env#using-xdebug)
