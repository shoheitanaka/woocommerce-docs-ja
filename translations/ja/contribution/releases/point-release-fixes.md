---
post_title: Point Release Requests in WooCommerce
sidebar_label: Point Release Requests
sidebar_position: 4
---

# Point Release Requests in WooCommerce

ポイントリリースは既に出荷されたWooCommerceのバージョンで発見された重大な問題に対処します。これらはパッチリリース（例：9.9.0 → 9.9.1）で、本番環境に必要な修正のみが含まれています。

このプロセスは、顧客の本番環境にある ALREADY-RELEASED VERSION にのみ適用されることに注意してください。

## Point Release Lifecycle

ポイント・リリースは、通常のリリースとは異なるライフサイクルをたどります：

- **通常リリース後に発見された重大な問題**がトリガーとなる。
- **限定された範囲** - 重要なバグ修正とセキュリティパッチのみ
- **タイムラインの短縮** - レビューとリリースのサイクルを短縮。
- **後方互換性** - 変更を許さない

## Qualifying Changes for Point Releases

変更がポイント・リリースの対象となるのは、以下の場合のみである：

- データ損失、セキュリティ脆弱性、または重大な機能障害を引き起こす**重大なバグ修正**。
- 特定された脆弱性に対処する**セキュリティパッチ**。
- 深刻なパフォーマンス低下に対する**パフォーマンス修正**。
- **規制または法令遵守のために必要な修正

**ポイントリリースの対象外:**。

- 新機能または機能強化
- 重要でないバグの修正
- コードのリファクタリングやクリーンアップ
- ドキュメントの更新

## Point Release Request Process

### Standard Process: Critical Bug Fixes

**使用時期：** ほとんどのポイント・リリース・シナリオ

1. **Create a pull request** against the appropriate release branch (e.g., `release/9.9` for a fix targeting 9.9.x releases)

2. **Create a point release request issue** using the [point release template](https://github.com/woocommerce/woocommerce/issues/new?template=new-prr-template.yml) in the main repository

3. **以下の事項を含む、詳細な正当性**を提示すること：
    - 影響評価（影響を受ける顧客の数）
    - ビジネスへの影響（収益、コンプライアンス、セキュリティへの影響）
    - 修正案のリスク評価
    - 証拠と再現手順

4. **リリース・リードの承認を待つ** - リリース・リードがリクエストを承認する。

5. **Adjust branch targeting** by modifying the automatically-added labels to specify which additional branches need the fix:
    - Keep `cherry pick to trunk` if the fix should go to trunk
    - Keep `cherry pick to frozen release` if the fix should go to the current frozen release
    - Remove labels for branches that don't need the fix

6. **プルリクエストをレビューし、テストし、対象のリリースブランチにマージする。

7. **元のPRに貼られたラベルに基づいて、他のブランチへのチェリーピックPR**を自動作成する。

8. **チェリーピック PR**をできるだけ早くレビューし、マージして、次のリリースを遅らせないようにしてください。これらのチェリーピック PR は元のクリティカルな修正と同じマイルストーンで追跡され、ポイントリリースが発行される前にマージされなければなりません。
