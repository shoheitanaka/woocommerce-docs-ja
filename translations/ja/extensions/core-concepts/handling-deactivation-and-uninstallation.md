---
post_title: Managing extension deactivation and uninstallation
sidebar_label: Deactivation and uninstallation
---

# Managing extension deactivation and uninstallation

## Introduction

マーチャントが拡張機能を無効化またはアンインストールする際に処理する必要があるクリーンアップタスクは数多くあります。このガイドでは、拡張機能の無効化およびアンインストールのロジックを定義する際に考慮すべきWooCommerce固有の項目について簡単に説明します。

## Removing Scheduled Actions

拡張機能がバックグラウンドジョブのキューにAction Schedulerを使用している場合、拡張機能がアンインストールまたは非アクティブ化されたら、これらのアクションのスケジュールを解除することが重要です。

`as_unschedule_all_actions( $hook, $args, $group );`

You can read more about using Action Scheduler for managing background processing in the [Action Scheduler API Reference](https://actionscheduler.org/api/).

## Removing Admin Notes

マーチャント用のノートを作成した場合は、エクステンションを停止するか、少なくともアンインストールしたときにノートを削除してください。

```php
function my_great_extension_deactivate() {
    ExampleNote::possibly_delete_note();
}
register_deactivation_hook( __FILE__, 'my_great_extension_deactivate' );

```

The example above assumes that you have followed the pattern this guide recommends for creating Notes as dedicated classes that include the `NoteTraits` trait included with WooCommerce Admin. This approach provides your Note with some baked in functionality that streamlines note operations such as creation and deletion.

## Removing Admin Tasks

エクステンションが停止またはアンインストールされたら、エクステンションがマーチャントのために作成したタスクの登録を解除するように注意してください。

```php
// Unregister task.
function my_extension_deactivate_task() {
    remove_filter( 'woocommerce_get_registered_extended_tasks', 'my_extension_register_the_task', 10, 1 );
}
 
register_deactivation_hook( __FILE__, 'my_extension_deactivate_task' );
```

マーチャントタスクはPHPとJavaScriptの両方を含むハイブリッドアプローチで管理されるため、クライアントサイドの登録は拡張機能のJavaScriptが実行されたときにのみ行われることを覚えておいてください。

## Unregistering navigation

拡張機能が無効化されアンインストールされると、WooCommerceナビゲーションで行った登録は自動的に処理されます。

## WordPress cleanup tasks

There are additional measures you may need to consider when your extension is deactivated or uninstalled, depending on the types of modifications it makes to the underlying WordPress environment when it activates and runs. You can read more about handling deactivation and uninstallation in the [WordPress Plugin Developer Handbook](https://developer.wordpress.org/plugins/intro/).
