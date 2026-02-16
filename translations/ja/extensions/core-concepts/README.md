# 核心概念

このセクションでは、堅牢で保守可能なWooCommerceエクステンションを開発するために必要な基本原則、ベストプラクティス、必須知識を説明します。

基本的なセットアップやアーキテクチャから高度な開発パターンまで、あらゆることを学びましょう。初めてWooCommerceエクステンションを構築する場合でも、既存のエクステンションを保守する場合でも、これらのガイドはベストプラクティスに従って高品質のコードを作成するのに役立ちます。

## ♪ はじめに

コードが実行される前にWooCommerceがインストールされ、アクティブであることを確認する適切な方法を学ぶには、[Check if WooCommerce is active](./check-if-woo-is-active.md) を参照してください。これによりエラーを防ぎ、エクステンションを確実に動作させることができます。また、メインの`WooCommerce`クラスから`WC_Product`、`WC_Customer`、`WC_Cart`まで、[WooCommerceのコアクラス](./class-reference.md)とその扱い方についても理解しておきましょう。

## 内部コード境界

WooCommerceはエクステンションの使用を目的としたパブリックAPIと内部インフラストラクチャのコードを含んでいます。 *WooCommerceリリース間の後方互換性は保証されないため、**拡張機能は内部コード**を使用しないでください：

- **内部名前空間**：`Automattic\WooCommerce\Internal`以下のクラスはすべて内部インフラストラクチャです。
- **内部アノテーション**：コード・エンティティ（クラス、メソッド、フック）は、docblock内で`@internal`のマークが付いています。

内部コードを使用すると、マーチャントがWooCommerceをアップデートしたときに拡張機能が壊れる可能性があります。詳しくは[拡張機能開発のベストプラクティス](../best-practices-extensions/extension-development-best-practices.md)と[内部名前空間のドキュメント](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/README.md)をご覧ください。

## 開発パターン

[アクションとフィルタの追加](./adding-actions-and-filters.md)では、フックを使ってWooCommerceを拡張する技術をマスターできます。WordPressとWooCommerceの標準に従って、アクションとフィルタを追加するタイミングと方法を学びます。長期的な成功のために、[保守可能なコードを書く](./maintainability.md) 戦略を発見し、拡張機能を最新かつ安全に保つ更新プロセスを確立しましょう。また、[無効化とアンインストールを管理する](./handling-deactivation-and-uninstallation.md) 必要があります。スケジュールされたアクション、管理者ノート、タスクなど、無効化またはアンインストール時にエクステンションが適切にクリーンアップされるようにします。

## プラグインの構造と標準

すべての必要なメタデータを含む、拡張機能のメインプラグインファイルのヘッダの [ヘッダプラグインコメントの例](./example-header-plugin-comment.md) フォーマットを参照してください。また、拡張機能の変更履歴ファイルに変更を記録するための標準の [変更履歴フォーマット](./changelog-txt.md) を学び、シームレスな機能のために WooCommerce のプラグイン API と適切に統合するための [WooCommerce プラグイン API コールバック](./woocommerce-plugin-api-callback.md) を理解しましょう。

