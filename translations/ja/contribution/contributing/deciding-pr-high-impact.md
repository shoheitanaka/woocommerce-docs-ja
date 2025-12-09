---
post_title: How to assess the impact of a pull request
sidebar_label: Assessing PR impact
---

# How to assess the impact of a pull request

Pull RequestがHigh-Impactと宣言されるべきかどうかを決定するのは複雑な作業です。これを達成するためには、Pull Requestで導入された変更がWooCommerceに与える影響を評価し、見積もる必要があります。これは通常主観的な作業であり、WooCommerceの製品詳細、技術的な詳細、さらには顧客の問題履歴に関する膨大な知識が要求されるため、時には不正確なこともあります。

このページでは、プルリクエストの影響度を評価するためのガイドラインをご紹介します。

## You should mark a Pull Request as High-Impact if

- It adds a **new feature** to WooCommerce, except if it's behind a feature flag.
- Modifies **critical functionality** (see the [critical flows list](https://github.com/woocommerce/woocommerce/wiki/Critical-Flows)).
- It fixes a **high-priority bug** (this includes Blocks fix releases core version bumps).
- It contains a **security fix**.
- Updates **SQL queries**.
- Touches any of the **$_REQUEST** family of variables.
- Any kind of **data migration/update**.
- Changes to **emails** sent from WooCommerce.
- Changes to WooCommerce **hooks/actions/filters**.
- Changes to **REST API endpoints**.
- It's a **big PR** (i.e. adds several changes in many files).
- It has **i18n changes** (for example, any file from `woocommerce/i18n` is modified).

## You should not mark a Pull Request as High-Impact if

- 自動テスト、WooCommerceリリースパッケージに含まれていないインフラに関連するもの、リリースパッケージに含まれていないmonorepoの他のプロジェクトのみを更新します。
- Readmeや変更履歴の変更のみが含まれます。
- タイプミスなどの優先度の低いバグを修正します。
- 複数の環境で検証する必要はありません。
- 定期的に予定されている (修正リリースではない) Blocks パッケージのコアバージョンアップ (テストがすでに予定されているため)。
- まだ全体としてリリースされていない機能の一部である（つまり、現在進行中の機能フラグの後ろにある）。

## My PR is High-Impact. What's next?

If your PR is High-Impact, be sure to label it with `impact: high` and the WooCommerce Core team will keep special considerations for testing it.
