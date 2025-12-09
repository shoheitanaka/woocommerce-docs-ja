# Core concepts

このセクションでは、堅牢で保守可能なWooCommerceエクステンションを開発するために必要な基本原則、ベストプラクティス、必須知識を説明します。

基本的なセットアップやアーキテクチャから高度な開発パターンまで、あらゆることを学びましょう。初めてWooCommerceエクステンションを構築する場合でも、既存のエクステンションを保守する場合でも、これらのガイドはベストプラクティスに従って高品質のコードを作成するのに役立ちます。

## Getting started

[Check if WooCommerce is active](./check-if-woo-is-active.md) to learn the proper way to ensure WooCommerce is installed and active before your code runs. This prevents errors and ensures your extension works reliably. You'll also want to understand the [core WooCommerce classes](./class-reference.md) and how to work with them, from the main `WooCommerce` class to `WC_Product`, `WC_Customer`, and `WC_Cart`.

## Development patterns

[アクションとフィルタの追加](./adding-actions-and-filters.md)では、フックを使ってWooCommerceを拡張する技術をマスターできます。WordPressとWooCommerceの標準に従って、アクションとフィルタを追加するタイミングと方法を学びます。長期的な成功のために、[保守可能なコードを書く](./maintainability.md) 戦略を発見し、拡張機能を最新かつ安全に保つ更新プロセスを確立しましょう。また、[無効化とアンインストールを管理する](./handling-deactivation-and-uninstallation.md) 必要があります。スケジュールされたアクション、管理者ノート、タスクなど、無効化またはアンインストール時にエクステンションが適切にクリーンアップされるようにします。

## Plugin structure and standards

すべての必要なメタデータを含む、拡張機能のメインプラグインファイルのヘッダの [ヘッダプラグインコメントの例](./example-header-plugin-comment.md) フォーマットを参照してください。また、拡張機能の変更履歴ファイルに変更を記録するための標準の [変更履歴フォーマット](./changelog-txt.md) を学び、シームレスな機能のために WooCommerce のプラグイン API と適切に統合するための [WooCommerce プラグイン API コールバック](./woocommerce-plugin-api-callback.md) を理解しましょう。

