---
post_title: Resources for debugging
sidebar_label: Debugging
sidebar_position: 7
---

# デバッグ用リソース

## ワードプレス

手始めに、WordPress自体に組み込まれているデバッグ・ツールから始めるのがよいだろう：

The documentation for [Debugging in WordPress c](https://wordpress.org/documentation/article/debugging-in-wordpress/)overs a number of environment variables you can set to enable WordPress’s core debugging tools.

### クエリーモニター

A popular plugin for WordPress developers is [Query Monitor](https://wordpress.org/plugins/query-monitor/), the developer tools for WordPress. Query Monitor enables debugging of database queries, PHP errors, AJAX/Rest requests, hooks and actions, block editor blocks, enqueued scripts and stylesheets, HTTP API calls, and more.

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

If you're using `wp-env` to run a local development environment (this is the recommended method for the WooCommerce monorepo), you can activate Xdebug and then use an IDE like VS Code or PhpStorm to set breakpoints and step through the code as it executes:

* [Using Xdebug](https://github.com/WordPress/gutenberg/tree/trunk/packages/env#using-xdebug)
