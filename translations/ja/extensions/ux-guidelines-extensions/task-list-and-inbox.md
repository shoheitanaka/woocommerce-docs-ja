---
post_title: Task list and inbox
sidebar_label: Task list and inbox
---

# Task List and Inbox

プラグインは、以下のガイドラインに基づいて、タスクノートと受信トレイノートのどちらを実装するかを選択する必要があります。同じメッセージにタスクと受信トレイノートの両方を実装することは避けてください。

Use the Task List and Inbox sparingly. Messages should be clear, concise, and maintain a consistent tone. Follow the [Grammar, Punctuation, and Capitalization guide](https://woocommerce.com/document/grammar-punctuation-style-guide/).

## Task List

![an example of a task in the task list](https://developer.woocommerce.com/wp-content/uploads/2023/12/task-list1.png)

行動が**必要**なものは、タスクリストに入れるべきである。

- *やることタスクリストに表示されるもの：*。

    - 拡張機能の有効化、接続、設定を行うタスク。
    - 支払いの獲得や紛争への対応など、ビジネスにとって重要なタスク。

- *やることタスクリストに表示されないもの：*。

    - 店舗の機能に影響を与えたり、機能を停止させるような重要な更新は、WordPressの標準コンポーネントを使用してトップレベルの通知として表示されます。
    - 機能のお知らせやプラグインの使い方のヒントなどの情報通知は、クリティカルではなく、アクションを必要としないため、受信トレイに表示されるべきです。
    - ユーザーアクティビティからの通知は、定期的なフィードバック通知（成功、情報、エラー、警告）として表示されます。

Examples:

![three tasks in the task list under the heading "Things to do next" with the option to expand at the bottom to "show 3 more tasks" ](https://developer.woocommerce.com/wp-content/uploads/2023/12/task-list-example.png)

## Inbox

受信トレイは、ユーザーに情報、有用、補足的なコンテンツを提供し、一方、重要な通知やセットアップ・タスクは、それぞれ独立した適切な場所に置かれる。

![an example of an inbox notification](https://developer.woocommerce.com/wp-content/uploads/2023/12/inbox1.png)

- *受信箱*に表示されるもの：
    - 重要でないリマインダーなどの情報通知。
    - プラグインのレビューやフィードバックのリクエスト。
    - プラグインの使い方や機能の紹介。
    - 感動的なメッセージやマイルストーンなどのインサイト。

- *受信箱*に表示されないもの：

    - アクションが必要な通知、延長設定タスク、または定期的なフィードバック通知。

Examples:

![an example of two inbox notifications listed under the "Inbox" section of the admin](https://developer.woocommerce.com/wp-content/uploads/2023/12/inbox-examples.png)
