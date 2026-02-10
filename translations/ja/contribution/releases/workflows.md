---
post_title: Release Workflows
sidebar_label: Workflows
sidebar_position: 9
---

# Release Workflows

WooCommerce のリリースプロセスは GitHub Actions ワークフローによってサポートされており、繰り返しタスクの自動化、プロセスのガードレール化、通知の送信などを行います。このページでは、リリースに関連するすべてのワークフローを、どのようにトリガーされるかによって整理しています。

すべてのワークフローは[`.github/workflows/`](https://github.com/woocommerce/woocommerce/tree/trunk/.github/workflows)ディレクトリで定義されます。

## スケジュールされたワークフロー

これらのワークフローは、毎日のスケジュールで自動的に実行される。

| ワークフロー｜スケジュール｜何をする｜いつ行動する｜？
| -------- | -------- | ------------ | ------------ |
| [リリース: アサイン](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-assignment.yml) | 毎日18:00 UTC｜[リリースカレンダー](https://developer.woocommerce.com/release-calendar/)をチェックし、リリースのリードをアサインし、サイクル内の各リリースのサブ課題を持つ親追跡課題を作成します。各サブ課題に対して*トラッキング課題の作成*を呼び出します。| フィーチャー・フリーズの8週間前|
| [リリース: フィーチャーフリーズの実施](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-code-freeze.yml) | 毎日18:00 UTC | [リリースカレンダー](https://developer.woocommerce.com/release-calendar/) をチェックし、`trunk`からリリースブランチを作成し、`trunk`を次の開発バージョンにバンプし、開発リリースを発行し、古いマイルストーンをクリーンアップし、Slack通知を送信します。Bumpバージョン番号*と*Build ZIPファイル*を呼び出します。|機能のフリーズ日に。|
| [リリース: フィーチャーハイライト通知](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-feature-highlights-notification.yml) | 毎日09:00 UTC | [リリースカレンダー](https://developer.woocommerce.com/release-calendar/)をチェックし、フィーチャーフリーズの期限についてSlackリマインダーをチームに送信します。| フィーチャーフリーズの1週間前。|
| [リリース: オープンイシュー警告](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-open-issue-warning.yml) | 毎日18:00 UTCに[リリースカレンダー](https://developer.woocommerce.com/release-calendar/)をチェックし、リリースのマイルストーンでオープンなアイテムを探し、アサイン先とともにSlackで通知を送る。| リリース日から72時間以内|
| [ナイトリービルド](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/nightly-builds.yml) | 毎日UTC 00:00に`trunk`からナイトリーZIPをビルドし、GitHubリリースにアップロードします。リリースカレンダーとは関係なく、毎日実行されます。| 毎日。|

## イベント駆動型ワークフロー

これらのワークフローは、プルリクエストのマージ、リリースの公開、課題のラベル付けといったGitHubのイベントによって自動的にトリガーされる。

### チェリーピックとバックポート

| ワークフロー｜トリガー｜何をするのか？
| -------- | ------- | ------------ |
| [マイルストーン付きPRをリリースブランチにチェリーピックする](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/cherry-pick-milestoned-prs.yml) | `trunk`でPRがクローズまたはマイルストーン付きになった場合、`trunk`からPRのマイルストーンに一致する`release/x.y`ブランチにチェリーピックする。コアロジックには[`shared-cherry-pick`](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/shared-cherry-pick.yml)を使用。|
| [凍結リリースへのチェリーピック](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/cherry-pick-to-frozen.yml) | `cherry pick to frozen release`ラベルを持つ`release/x.y`ブランチにマージされたPR | `release/x.y`ブランチから次の(凍結された)`release/x.y`ブランチへのチェリーピック。コアロジックには[`shared-cherry-pick`](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/shared-cherry-pick.yml)を使用します。|
| PRは`release/x.y`ブランチにマージされ、`cherry pick to trunk`ラベルが付けられます｜`release/x.y`ブランチから`trunk`にチェリーピックされます。コアロジックには[`shared-cherry-pick`](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/shared-cherry-pick.yml)を使用。|
| `cherry-pick-*` ブランチのPRイベント｜`cherry pick has conflicts`ラベルが存在する場合、CIに失敗する。|

### マイルストーン

| ワークフロー｜トリガー｜何をするのか？
| -------- | ------- | ------------ |
| [リリースPRにマイルストーンを自動追加](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/auto-milestone-release-prs.yml) | PRが`release/x.y`ブランチでオープンまたは再開された場合、一致するマイルストーンをリリースブランチを対象としたPRに割り当てます。|
| [マージ時にマイルストーンを自動で割り当てる](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/pr-auto-milestone-on-merge.yml) | `trunk` で PR がクローズされた場合、`trunk` にマージされた PR のうち、まだマイルストーンを持たないものにマイルストーンを割り当てます。|

### リリースイベントと検証

| ワークフロー｜トリガー｜何をするのか？
| -------- | ------- | ------------ |
| [Release: リリースイベントプロキシ](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-release-events-proxy.yml) | リリースの公開またはプレリリース | [`release-new-release-published`](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-new-release-published.yml) にリリース後のアクションを委譲する: Slack通知の送信、安定版リリースのグローバル変更ログの更新、ベータ版リリースの *Generate Number of Commits and Contributors* の呼び出し。|
| [リリースチェックの実行](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/tests-on-release.yml) | 公開または編集されたリリース | 公開されたリリースに対して CI テストスイートを実行します。また、スケジュールで毎晩実行されます。|
|~~[Release: CFE and PRR issue validation](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-cfe-prr-issue-validation.yml)~~｜`code freeze exception`, `point release request`, `Approved`, または `Rejected` でラベル付けされた課題｜~~Code Freeze ExceptionとPoint Release Requestの課題を検証し、関連するPRにラベルとマイルストーンを適用し、Slack通知を送信します。|

## 手動ワークフロー

これらのワークフローは、リリースプロセス中にリリースリードによってトリガーされます。これらは、[ビルドとパブリッシングガイド](/docs/contribution/releases/building-and-publishing)とリリーストラッキングの問題で参照されているワークフローです。

### 建設と出版

| ワークフロー
| -------- | ------------ |
| [Release: バンプバージョン番号](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-bump-version.yml) | プラグインファイル全体のバージョン番号を更新し、リリースブランチに対してPRを作成します。|
| [Release: Compile changelog](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-compile-changelog.yml) | 変更履歴をコンパイルし、`trunk`とリリースブランチの両方に対してPRを作成します。|
| [Release: Build ZIP file](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-build-zip-file.yml) | リリースZIPをビルドし、オプションでGitHubリリースのドラフトを作成します。|
| [Release: Upload release to WordPress.org](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-upload-to-wporg.yml) | リリースZIPをWordPress.org SVNにアップロードします。|
| [Release: 安定版タグを更新](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-update-stable-tag.yml) | WordPress.orgの安定版タグを更新し、リポジトリに同期するPRを作成します。|

### 追跡と分析

[| ワークフロー
| -------- | ------------ |
| リリース追跡課題の作成](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-create-tracking-issue.yml) `.linear/`にあるテンプレートを使用して、特定のリリース・バージョンのリニア追跡課題を作成します。|
| [Release: コミット数と貢献者の生成](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-commits-and-contributors.yml) | リリースの統計情報(コミット数、貢献者リスト)を生成し、Slackに通知します。|
| [Release: analyze trends (CFEs and PRRs)](https://github.com/woocommerce/woocommerce/blob/trunk/.github/workflows/release-trends-analysis.yml) | マイルストーンのコード凍結例外とポイントリリース要求のAI分析を依頼するGitHub課題を作成します。|
