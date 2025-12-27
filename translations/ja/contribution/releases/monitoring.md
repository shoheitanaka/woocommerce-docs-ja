---
post_title: WooCommerce Release Monitoring
sidebar_label: Release Monitoring
sidebar_position: 7
---

# WooCommerce Release Monitoring

リリース後、リリースリーダーは、最新バージョンに直接関連するバグがないか、以下の監視を継続する必要があります。  メジャーリリースの場合は3日間、ポイントリリースの場合は1日間、監視を続ける必要があります。

特定の問題が新しいポイントリリース修正を作成するほど重大かどうか疑問がある場合は、WooCommerce Slack [#core-development](https://woocommercecommunity.slack.com/archives/C4TNYTR28) でディスカッションを開始してください。

## WordPress.org Forums

[WordPress.org Forums](https://wordpress.org/support/plugin/woocommerce/) に新しく作成されたスレッドで、最新のアップデートが原因と思われる問題がないか確認してください。

## WooCommerce GitHub リポジトリの問題

[新しく作成されたissue](https://github.com/woocommerce/woocommerce/issues?q=is%3Aissue%20state%3Aopen%20sort%3Acreated-desc)を見て、クリティカルなものがないことを確認する。

## 重大問題の処理ポイント解放要求

モニタリングの結果、次のリリース予定まで**待てない**バグが発見された場合は、**ポイント・リリース・リクエスト(PRR)**を開始してください。  
PRRワークフローにより、リリースリードは修正を現在のメンテナンスブランチに素早く取り込み、必要であれば自動的にトランクや次の凍結ブランチにチェリーピックすることができます。

[ポイント・リリースの全ガイドを読む](/docs/contribution/releases/point-releases)。

PRRを開設する前に、問題を確認してください：

1. **店舗のコア機能**（例：チェックアウト、注文、税金）に影響を与えます。
2. **多くのサイト**に影響を与えている、または広く使用されている拡張機能やテーマに起因している。
3. **マーチャント自身が適用できる合理的な回避策**がない。

これらの条件が満たされている場合、PRRガイドに従ってリクエストを作成し、必要な正当な理由を記載し、承認とマージのためにリリースリーダーに通知します。
