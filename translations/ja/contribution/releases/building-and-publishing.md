---
post_title: Building and Publishing a Release
sidebar_label: Building and Publishing
sidebar_position: 1
---

# Building and Publishing a Release

リリースの過程で何らかの問題が発生した場合は、[リリースのトラブルシューティングとリカバリーガイド](/docs/contribution/releases/troubleshooting)を参照して、一般的な問題のステップバイステップの解決策とリカバリーの手順を確認してください。

## 前提条件

- コミットを承認するには、WooCommerceプラグインのコミッターアクセスを持つWordPress.orgアカウントが必要です。

## プレチェック

1. **公開されるリリースと一致するマイルストーンに対して、未解決の [Pull Requests](https://github.com/woocommerce/woocommerce/pulls?q=is%3Aopen+is%3Apr) または [Issues](https://github.com/woocommerce/woocommerce/issues) がないことを確認してください。
   - 他のリリースブランチやトランクにマージする必要があるかもしれない[backported pull requests](/docs/contribution/releases/backporting)を含め、リリースのマイルストーンに関連するすべてのプルリクエストをクローズしなければなりません。
2. **未解決の "cherry pick failed "[プルリクエスト](https://github.com/woocommerce/woocommerce/pulls?q=is:pr+label:%22cherry+pick+failed%22).**がないかチェックしてください。
   - そのようなPRがあれば、別のPRで解決されることを期待するか、手動で解決するようにしてください。
3. **`readme.txt`のStableタグが[WordPress.orgのtrunk](https://plugins.trac.wordpress.org/browser/woocommerce/trunk/readme.txt#L7)と一致することを確認する。
   - この値は、ビルド中のバージョンではなく、現在の安定バージョンと一致する必要があります。
4. **GitHub [サービス](https://www.githubstatus.com/) が完全に動作していることを確認してください。

## WooCommerceの構築

1. *** ["Release: Bump version number "ワークフロー](https://github.com/woocommerce/woocommerce/actions/workflows/release-bump-version.yml).** を実行します。
   - `trunk`から実行します。
   - リリースするバージョンの種類（`beta`、`rc`、`stable`）を選択します。
   - リリースするブランチを _Release branch_ と入力します (例: `release/10.0`).
   - 作成されたPRをレビューし、マージする。
2. **["Release: Compile changelog" ワークフロー](https://github.com/woocommerce/woocommerce/actions/workflows/release-compile-changelog.yml).** を実行します。
   - `trunk`から実行し、メジャーバージョン番号とリリース予定日を入力する。
   - 作成された2つのPR (1つはトランク用、もう1つはリリースブランチ用) をレビューしてマージします。
   - 変更履歴の日付が正しいことを確認してください。
3. **リリースZIPファイルを["Release: Build ZIP file "ワークフロー](https://github.com/woocommerce/woocommerce/actions/workflows/release-build-zip-file.yml).**を使ってビルドします。
   - `trunk`から実行し、引数にリリースブランチを入力します。
   - Create GitHub release "を`true`に設定します。
   - ワークフローは、`woocommerce.zip`ファイルを添付した[ドラフトリリースタグ](https://github.com/woocommerce/woocommerce/releases)を作成します。

## リリースの発表

### ステップ1：WordPress.orgにリリースをアップロードする

- releaseタグを使用して、`trunk`から["Release: Upload release to WordPress.org "ワークフロー](https://github.com/woocommerce/woocommerce/actions/workflows/release-upload-to-wporg.yml)を実行する。
- これにより新しいSVNタグが作成され、リリースがtrunkより新しい場合はtrunkが上書きされます。
- 最初のベータ版をリリースする場合、処理時間が長くなることが予想されます。

### ステップ2：リリースを承認する

- ユーザー `woocommerce` として [WordPress.org plugin releases](https://wordpress.org/plugins/developers/releases/) にアクセスし、リリースを承認する。
- WordPress.orgが新しいバージョンをビルドするまで数分待ちます。

### ステップ3：リリースの可用性を確認する

- 新しいリリースが表示されることを確認してください：
    - [https://plugins.svn.wordpress.org/woocommerce/tags/](https://plugins.svn.wordpress.org/woocommerce/tags/)
    - 詳細オプション画面](https://wordpress.org/plugins/woocommerce/advanced/)の「以前のバージョン」ドロップダウン。

### ステップ4：リリースのテストと検証

- **条件:** 安定版および RC 版リリース (`-rc.x` または `.x`) に対してのみ、このステップを実行してください。
- **安定性と機能性を確保するために、リリースの徹底的なテストと検証を実施してください。このバージョンを実行しているサイトに重大な影響を与える可能性のある問題がないか慎重に監視してください。

### ステップ5：安定タグの更新

- **条件:** 以下の場合のみ、このステップを実行してください：
    - リリースが安定版リリース(`.x`)であること。
    - テストと検証(ステップ4)で大きな問題が見つからなかった。
- **アクション:** `trunk` から ["Release: Update stable tag" workflow](https://github.com/woocommerce/woocommerce/actions/workflows/release-update-stable-tag.yml) を実行し、バージョンを設定し、ワークフロー入力の一部として stable タグを更新するオプションを選択します。
    - リリースブランチとトランクの両方のプルリクエストを確認し、マージします。

### ステップ6：GitHubリリースタグの発行

- **アクション:** [以前に作成したGitHubドラフトリリースタグ](https://github.com/woocommerce/woocommerce/releases)を公開します。
- **リリースステータスを設定する場合:**
    - 開発版、ベータ版、RC版をリリースする場合は、"Set as a pre-release" をチェックしてください。
    - ステップ 5 で安定版としてマークされたバージョンの場合は、 "Set as the latest release" をチェックしてください。
    - ステップ5で安定版としてマークされていない場合は、最新リリースとして設定しないでください。

## 決定表

| ステップ｜実行する条件｜条件が満たされない場合のアクション
|--------|--------------------------------------------------------------------------------|-------------------------------------|
| ステップ4: **または** リリース候補(RC)ではない場合: ステップ4をスキップしてください。
| ステップ5: **安定版リリースではない、かつ** ステップ4で重大な問題がない場合、ステップ5をスキップしてください。
| ステップ6: 5で安定版とマークされた場合のみ "最新版 "とマークする。
