---
post_title: WooCommerce Release Schedule
sidebar_label: Release Schedule
sidebar_position: 6
---

# WooCommerce Release Schedule

WooCommerceは予測可能なリリーススケジュールで運営されており、およそ5週間ごとに新機能、機能強化、バグ修正のアップデートを提供しています。
このページでは、機能の凍結、ベータ版とリリース候補の期間、最終版とパッチリリースのタイミングなど、リリースプロセスの主な段階についてまとめています。

モノレポ内でのリリースサイクルの詳細については、[Git Flow docs](/docs/contribution/contributing/woocommerce-git-flow) を参照してください。

:::tip

To view the actual schedule for current and upcoming releases, see our [release calendar](https://developer.woocommerce.com/release-calendar/).

:::

リリース・サイクル・フローチャート](/img/doc_images/release-cycle.png)

## Milestones

### Feature Freeze & `-dev` release (day 1)

機能凍結の自動化の結果、いくつかのことが起こる：

- A dedicated release branch is created (`release/x.y`), where the future release undergoes testing and stabilization. No new features are included on this branch, only bug fixes.
- A `-dev` release is built and made available on GitHub.
- Development of new features continues on `trunk`.
- A pre-release post is published on our developer website ([example](https://developer.woocommerce.com/2025/05/12/woocommerce-9-9-pre-release-updates/)).

### Beta 1 (+1 week)

この段階で、さまざまなテスト工程が行われる：

- (内部) Wooがメンテナンスしている拡張機能でのリグレッションテスト、複数の環境でのリグレッションテスト、(貢献チームによるものを含む)探索的テスト。
- (コミュニティ）プレリリースが発表され、コミュニティが[テストを開始](/docs/contribution/testing/beta-testing/)できるようになります。

Any issues found during the beta period are addressed either directly against the release branch or by backporting fixes from `trunk` (preferred). Refer to the [backporting guide](/docs/contribution/releases/backporting) for more details.

`release/x.y` remains the source of truth for anything going into the upcoming release.

### Beta 2 (+1 week)

At this stage, we release regression fixes discovered in `-beta.1` as part of release stabilization. The pre-release announcement continues to be updated.

### RC 1 (+1 week)

最終リリース前の（社内）最終チェック。

If anything is found at this stage, a fix is merged into the release branch (`release/x.y`) as in the beta phase.

### Final Release (+1 day)

We make the stable release version available to everyone.
At this point, the Developer Advocacy team publishes release highlights that are prepared in advance ([example](https://developer.woocommerce.com/2025/06/09/woocommerce-9-9-its-fast-period/)).

### Point/Patch Releases

Patch releases are used to ship important bug fixes to our users, which were  detected after the final release. They are versioned `x.y.z` where `z` is non-zero.

私たちは、ベータ版やRC版の段階と同じ慣例に従って、あらゆる修正をマージします：

- Bugs that are only present on the release branch are fixed against the release branch `release/x.y`.
- Bugs that have a working fix on `trunk` are [backported](/docs/contribution/releases/backporting).


## Delays

ビジネス上の必要性やテスト中に発見された重大なバグにより、リリース日が変更される場合があります。

We do not take this decision lightly and only do so to guarantee the stability of a release. When this happens, we will always communicate the situation ([example](https://developer.woocommerce.com/2025/06/02/woocommerce-9-9-release-is-delayed/)) and update the release calendar.

遅延の管理方法の詳細については、[リリースのトラブルシューティングガイド](/docs/contribution/releases/troubleshooting#release-delay)を参照してください。
