---
post_title: WooCommerce Release Monitoring
sidebar_label: Release Monitoring
sidebar_position: 7
---

# WooCommerce Release Monitoring

リリース後、リリースリーダーは、最新バージョンに直接関連するバグがないか、以下の監視を継続する必要があります。  メジャーリリースの場合は3日間、ポイントリリースの場合は1日間、監視を続ける必要があります。

If there are questions whether a specific issue is critical enough to warrant creating a new Point Release Fix, please start a discussion WooCommerce Slack [#core-development](https://woocommercecommunity.slack.com/archives/C4TNYTR28).

## WordPress.org Forums

Check newly created threads on the [WordPress.org Forums](https://wordpress.org/support/plugin/woocommerce/) for any issues that appear to be caused by the latest update.

## WooCommerce GitHub Repository Issues

Watch the [Newest Created Issues](https://github.com/woocommerce/woocommerce/issues?q=is%3Aissue%20state%3Aopen%20sort%3Acreated-desc) and verify that none are critical.

## Handling Critical Issues: Point Release Requests

モニタリングの結果、次のリリース予定まで**待てない**バグが発見された場合は、**ポイント・リリース・リクエスト(PRR)**を開始してください。  
PRRワークフローにより、リリースリードは修正を現在のメンテナンスブランチに素早く取り込み、必要であれば自動的にトランクや次の凍結ブランチにチェリーピックすることができます。

[ポイント・リリースの全ガイドを読む](/docs/contribution/releases/point-releases)。

PRRを開設する前に、問題を確認してください：

1. **店舗のコア機能**（例：チェックアウト、注文、税金）に影響を与えます。
2. **多数のサイト**に影響がある、または広く使用されている拡張機能またはテーマに起因している。
3. **マーチャント自身が適用できる合理的な回避策**がない。

これらの条件が満たされている場合、PRRガイドに従ってリクエストを作成し、必要な正当な理由を記載し、承認とマージのためにリリースリーダーに通知します。
