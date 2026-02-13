---
post_title: Building and Publishing a Release
sidebar_label: Building and Publishing
sidebar_position: 1
---
# リリースの構築と発表

::重要

このガイドは参考として使用することができますが、リリースサイクルの前に作成される[リリース追跡課題](https://github.com/woocommerce/woocommerce/issues?q=state%3Aopen%20label%3A%22Release%22%20author%3Aapp%2Flinear%20tracking)には、バージョン固有の指示が提供されており、そちらを優先すべきであることに留意してください。

:::

このページでは、リリースブランチからWooCommerceリリースをビルドするために必要なステップの概要を説明します。全体的なプロセスと決定表を理解するためにフローチャートを確認してください。ステップバイステップの手順を以下に示します。

## 概要

![リリースプロセスフローチャート](/img/doc_images/release-process.png)

## 指示

以下の手順を順番に実行してください。GitHubワークフローを実行する際は、`trunk`ブランチ（デフォルト）から実行し、リリースバージョンまたはブランチを指示に従って入力してください。

何か問題が発生したときのために、_[リリースのトラブルシューティングとリカバリー](/docs/contribution/releases/troubleshooting)_ガイドを手元に置いておいてください。

### Steps

#### 1.ビルド前のチェック

- [GitHub サービス](https://www.githubstatus.com/) が稼働していることを確認する。
- [リリースマイルストーン](https://github.com/woocommerce/woocommerce/milestones/)に対して未解決の課題やプルリクエストが存在しないことを確認する。必要に応じて作者にPingを送り、マージまたはクローズする。
- [ ] このリリースに該当するプルリクエスト[ラベルが「cherry pick failed」](https://github.com/woocommerce/woocommerce/pulls?q=is:pr+label:%22cherry+pick+failed%22)で、アクションされていないものがないことを確認する。
- [ ] リリースブランチの readme.txt の `Stable tag` の値が [WordPress.org の `trunk`](https://plugins.trac.wordpress.org/browser/woocommerce/trunk/readme.txt#L7) の値と一致することを確認する。

#### 2.リリースパッケージをビルドする

- [ ] ワークフローを実行する **[Release: Bump version number](https://github.com/woocommerce/woocommerce/actions/workflows/release-bump-version.yml)**: リリースのメインバージョン (`x.y`) を _Release branch_ として入力し、ドロップダウンからリリースタイプを選択します。
- [リリースブランチに対して生成されたPRをレビューし、マージします。
-  ] ワークフロー **[Release: Compile changelog](https://github.com/woocommerce/woocommerce/actions/workflows/release-compile-changelog.yml)** を実行します: _Version_ にリリースのメインバージョン (`x.y`) を入力し、_Release date_ は空のままにします。
- [ ] 生成された PR をレビューしてマージしてください: 一つは `trunk` に対して、もう一つはリリースブランチに対してです。どちらもリリースマイルストーンの下にあるはずです。
- [ ] ワークフロー **[Release: Build ZIP file](https://github.com/woocommerce/woocommerce/actions/workflows/release-build-zip-file.yml)** を実行し、アセットのビルドと GitHub リリースの作成を行います：_Release branch_ としてリリースのメインバージョン (`x.y`) を入力し、_Create GitHub release_ をチェックします。
- [ ] リポジトリにドラフトリリースが作成されたことを確認し、`woocommerce.zip` アセットを添付します。

#### 3.WordPress.orgにリリースをアップロードする。

- [ ] ワークフローを実行 **[Release: Upload release to WordPress.org](https://github.com/woocommerce/woocommerce/actions/workflows/release-upload-to-wporg.yml)**: _Release tag to upload_ にリリースバージョン (`x.y.z`) を入力し、確認ボックスにチェックを入れてください。
- [ ] SVNタグが[WordPress.org SVNに存在する](https://plugins.svn.wordpress.org/woocommerce/tags/)ことを確認します。
- [ ] シークレットストアの `WordPress.org "WooCommerce" user account` シークレットの認証情報を使って [WordPress.org](https://wordpress.org/plugins/developers/releases/) にログインし、リリースを承認します。
- [ ] 数分後、リリースパッケージが [ダウンロード可能](https://wordpress.org/plugins/woocommerce/advanced/) になっていることを確認します。

#### 4.ステージング環境にデプロイする

::注意
このステップは `rc` または安定版 (`x.y.0` 以降) にのみ適用されます。
:::

- [ ] [ステージング環境へのデプロイガイド](https://wp.me/PCYsg-18BQ) に従い、デプロイ後 4 時間 (RC) または 2 時間 (stable) 監視する。
- [ ] このリリースの監視と議論のために、releases Slack チャンネルにスレッドを作成してください。

##### 監視中に重大な問題が検出された場合

- [ステージング環境での差し戻しを要求する。
-  ] リリースプロセスを一時停止し、**この問題に関する手順を続行しないでください**。代わりに [トラブルシューティングガイド](https://developer.woocommerce.com/docs/contribution/releases/troubleshooting/#deploy-serious-bug) の手順に従ってください。

#### 5.リリースの発行

- [ ] **(安定版リリースの場合のみ)** ワークフロー **[Release: Update stable tag](https://github.com/woocommerce/woocommerce/actions/workflows/release-update-stable-tag.yml)** を実行します。
- [ ] 以前に作成した[リリースドラフト](https://github.com/woocommerce/woocommerce/releases)を公開します。 **最新のリリースとして設定する" が、** 安定版リリースのみ** チェックされていることを確認してください。

#### 6.リリース後のタスク

::注意
このステップは安定版 (`x.y.0` 以降) にのみ適用されます。
:::

- [リリースマイルストーン](https://github.com/woocommerce/woocommerce/milestones/)の下でフォローアップPRをマージしてください。
- [ ] リリースに関連するバグの監視を少なくとも3日間は続けてください。詳細については、[リリースモニタリングガイド](https://developer.woocommerce.com/docs/contribution/releases/monitoring/) を参照してください。
