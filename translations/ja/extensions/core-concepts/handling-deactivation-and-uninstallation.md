---
post_title: Managing extension deactivation and uninstallation
sidebar_label: Deactivation and uninstallation
---
# 拡張機能の無効化とアンインストールの管理

## はじめに

マーチャントが拡張機能を無効化またはアンインストールする際に処理する必要があるクリーンアップタスクは数多くあります。このガイドでは、拡張機能の無効化およびアンインストールのロジックを定義する際に考慮すべきWooCommerce固有の項目について簡単に説明します。

## スケジュールされたアクションの削除

拡張機能がバックグラウンドジョブのキューにAction Schedulerを使用している場合、拡張機能がアンインストールまたは非アクティブ化されたら、これらのアクションのスケジュールを解除することが重要です。

`as_unschedule_all_actions( $hook, $args, $group );`。

アクション・スケジューラを使ったバックグラウンド処理の管理については、[アクション・スケジューラAPIリファレンス](https://actionscheduler.org/api/)を参照してください。

## 管理者ノートの削除

マーチャント用のノートを作成している場合は、拡張機能を停止するか、少なくともアンインストールしたときにノートを削除してください。

```php
function my_great_extension_deactivate() {
    ExampleNote::possibly_delete_note();
}
register_deactivation_hook( __FILE__, 'my_great_extension_deactivate' );

```

上記の例では、WooCommerce Admin に含まれる `NoteTraits` trait を含む専用クラスとしてノートを作成する、本ガイドが推奨するパターンに従っていることを前提としています。このアプローチでは、ノートの作成と削除などの操作を合理化する機能をノートに提供します。

## 管理者タスクの削除

エクステンションが停止またはアンインストールされたら、エクステンションがマーチャントのために作成したタスクの登録を解除するように注意してください。

```php
// Unregister task.
function my_extension_deactivate_task() {
    remove_filter( 'woocommerce_get_registered_extended_tasks', 'my_extension_register_the_task', 10, 1 );
}
 
register_deactivation_hook( __FILE__, 'my_extension_deactivate_task' );
```

マーチャントタスクはPHPとJavaScriptの両方を含むハイブリッドアプローチで管理されるため、クライアントサイドの登録は拡張機能のJavaScriptが実行されたときにのみ行われることを覚えておいてください。

## ナビゲーションの登録解除

拡張機能が無効化されアンインストールされると、WooCommerceナビゲーションで行った登録は自動的に処理されます。

## WordPressクリーンアップタスク

拡張機能が有効化され実行されるときに、WordPress の基礎となる環境にどのような変更を加えるかによって、拡張機能が無効化またはアンインストールされるときに考慮する必要がある追加の対策があります。無効化やアンインストールの処理については、[WordPress プラグイン開発者ハンドブック](https://developer.wordpress.org/plugins/intro/) を参照してください。
