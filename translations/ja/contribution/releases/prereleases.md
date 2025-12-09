---
post_title: WooCommerce Pre-releases
sidebar_label: WooCommerce Pre-releases
sidebar_position: 5
---

# WooCommerce Pre-releases

WooCommerceプレリリースは、開発者、テスター、およびコミュニティが将来のリリースに備えることができるように、今後の機能や改善点への早期アクセスを提供します。

この文書では、利用可能なさまざまな種類のプレリリースの概要、そのタイミング、およびそれらが全体的なリリース・サイクルにどのように適合するかについて説明します。

| Release Name      | Estimated Timing                                     |
|-------------------|------------------------------------------------------|
| `nightly`         | Every night                                          |
| `-dev`            | At feature freeze                                    |
| `-beta.1`         | 1 week after feature freeze                          |
| `-beta.2`, ...    | At least 1 more, as needed before `-rc.1`            |
| `-rc.1`           | Shortly (~1 day) before final release                |

## Nightlies

Regenerated every night based on the current contents of `trunk`. Found [under the `nightly` tag on GitHub](https://github.com/woocommerce/woocommerce/releases/tag/nightly).

これらはGitHubリポジトリでのみ公開されており、WordPress.orgにはアップロードされていません。

## Release cycle pre-releases

Once the feature freeze for the upcoming main version (`X.Y.0`) happens, a release-specific branch is created (named `release/x.y`) which is used for stabilization, fixing regressions, and building all the pre-releases tied to that release cycle.

These releases are tagged at various points in time as described below. As usual, the source of truth for any specific dates is [our release calendar](https://developer.woocommerce.com/release-calendar/).

### `-dev` release

This is an auto-generated tag that is created at the same time as the feature freeze happens for the current cycle. For example, when the feature freeze for `10.1.0` happened, `10.1.0-dev` was tagged.

これは内部開発用のタグで、GitHub リポジトリでのみ利用可能で、WordPress.org では利用できません。

### Beta

プラグイン作者やアーリーアダプターが次期バージョンの機能や特徴をテストするために使用します。最初のベータ版は通常、機能フリーズの1週間後にリリースされます。

Betas are versioned incrementally, starting with `-beta.1`, then `-beta.2`, and so on.

最終的な安定版リリースの前に、重要なバグ修正や機能の追加テストが必要な場合、または重要なアップデートが行われる場合は、それ以上のベータ版をリリースすることも可能です。

すべてのベータ版は、GitHubとWordPress.orgの両方で利用可能です。

WooCommerceのベータテストに参加し、貴重なフィードバックに貢献する方法については、[ベータテストに関するドキュメント](/docs/contribution/testing/beta-testing/)を参照してください。

### Release Candidate (RC)

これは、機能が完成し、最終テストに十分な安定性があるとみなされたプレリリース版です。RCは通常、最終リリースの少し前にリリースされ、最終的なテストとチェックのために社内で使用されます。

They are versioned incrementally as `-rc.1`, `-rc.2`, and so on.

最終リリースの前に少なくとも1回はRCをリリースすることを目標としており、これは公には発表されませんが、タグ付けされ、GitHubとWordPress.orgの両方でダウンロードできるようになります。
