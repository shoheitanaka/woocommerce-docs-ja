---
post_title: Backporting in WooCommerce
sidebar_label: Backporting
sidebar_position: 3
---

# Backporting in WooCommerce

Backporting is the process of applying changes from `trunk` to a release branch. This ensures critical fixes reach customers in upcoming releases.  Note that these flows apply only to UPCOMING RELEASES  (not patches to already-released versions).

## Release Branch Lifecycle

When a release branch is created, it's copied from `trunk` at the time of feature freeze. After creation:

- The release branch no longer receives new feature updates
- Only critical changes are allowed
- Because we do not merge the release branches back into `trunk`, any fixes in a release branch must also be applied to `trunk`.

## Qualifying Changes for Backporting

変更がバックポートの対象となるのは、変更がバックポートの対象となる場合のみである：

- リリースに影響する**バグ修正**。
- WooCommerceの機能に影響を与える**パフォーマンスの改善**。
- ビジネスゴールに影響する**タイムセンシティブ機能**。
- WooCommerceのために**契約上必要な機能**。

## Backporting Process for Contributors

### Standard Workflow: Trunk to Release Branch

**使用する場合：** ほとんどのバックポートシナリオ

1. **Target `trunk`** as your base branch
2. **Add milestone** matching your target release (e.g., `9.8.0`)
3. **Get PR reviewed and merged** into `trunk`
4. **Automated workflow** creates a cherry-pick PR for the release branch
5. **The original contributor or merger** reviews and merges the backport PR

&gt; 注意:** リリース期限間近の緊急修正については、リリースリーダーに直接連絡してください。

### Alternative Workflow: Release Branch to Trunk

**使用する場合：** リリース・ブランチを直接対象としなければならないクリティカルな修正

1. **Target the release branch** as your base branch
2. **Add label** `cherry pick to trunk` if the change should also go to `trunk`
3. **Get PR reviewed and merged** into the release branch
4. **Automated workflow** creates a forward-port PR for `trunk`
5. **Merge the trunk PR** as soon as possible to avoid delays

## Important Notes

- 変更はバックポート資格を満たしていなければならない
- 凍結リリースでは、重要なバグ修正のみを受け入れること
- すべてのバックポートにはレビューとテストが必要です。
- トランクへのフォワードポートは、元のPRと同じマイルストーンで追跡されるので、速やかにマージしてください。
