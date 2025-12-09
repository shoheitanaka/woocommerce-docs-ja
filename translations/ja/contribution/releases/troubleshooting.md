---
post_title: Release Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 7
---

# Release Troubleshooting & Recovery

このページでは、WooCommerceのリリースプロセス中に発生する可能性のある問題のトラブルシューティングとリカバリに関するガイダンスを提供します。一般的なシナリオ、推奨されるアクション、ベストプラクティスをカバーし、リリースがスムーズに処理され、問題が効率的に解決されるように支援します。


## Scenarios / FAQ

### A workflow failed while building the release

1. **GitHubの**Actions**タブでワークフロー実行の詳細**を開き、失敗が発生した場所と原因を確認してください。ほとんどの場合、ワークフローには明確なエラーメッセージが表示されます。
2. **エラーメッセージを注意深く読んでください。** 時には、ワークフロー設定の欠落やステップのスキップといった単純な問題であることもあります。
3. **エラーの意味や進め方がわからない場合、**遠慮せずにリリースのSlackチャンネルで助けを求めてください。推測するよりも、セカンドオピニオンを得る方が良いでしょう。

⚠️ _失敗の原因を理解するまで、ワークフローを再実行しないでください。 _根本的な問題を解決せずに再実行すると、事態をより複雑にする可能性があります。


### Something looks wrong in the final release ZIP. Can I start over? {#can-i-start-over-id}

生成されたアーティファクトをダウンロードして解凍した後、何かがおかしい（ファイルがない、変更履歴が正しくない、バージョンが一致しないなど）と感じたら、それは通常、次のことを意味する：

- 必要なワークフローが実行されなかったか、失敗した（たとえば、変更ログステップがスキップされた）。
- ワークフローから自動生成された PR が、ZIP をビルドする前にリリースブランチにマージされなかった。

**バージョンを再度ビルドしようとする前に、**。

1. Delete any GitHub draft release or tag for the incorrect release:
   - Go to **Code > Releases** and delete the draft release.
   - In **Code > Tags**, delete the tag for the incorrect version. _If you skip this, the final release may point to the wrong commit in history._
2. Check the status of the `release/X.Y` branch (either in the GitHub UI or locally after pulling the latest changes).
3. Figure out which step failed. For example, if the plugin header version is correct but the changelog is missing, only the changelog step needs to be re-run.
4. Review any [auto-generated PRs](https://github.com/woocommerce/woocommerce/pulls?q=is%3Aopen+is%3Apr+author%3Aapp%2Fgithub-actions+label%3ARelease): if there are open PRs that weren't merged and are no longer needed, close them and delete their branches.

**どのステップが失敗したかがわかったら、** [ビルド＆パブリッシングガイド](/docs/contribution/releases/building-and-publishing)に記載されているように、そのステップだけを再実行してください。スキップしたワークフローを正しい順序で実行し、すべての設定（バージョン番号、リリースタイプなど）を再確認してから次に進んでください。


### A serious bug was detected during internal checks / monitoring

リリースがWordPress.orgで安定版とマークされる**前に、内部チェックやモニタリングで重大なバグを見つけた場合：

- リリースプロセスを直ちに一時停止する。
- 関連するエンジニアリングチームと調整し、修正プログラムを開発する。修正パッチは後続のパッチリリースで出荷してください。
- このバージョンのドラフト GitHub リリースは公開しないでください。
- スキップしたバージョンをどうするかについての詳細は、[以下のセクション](#version-skipped-id)を参照してください。


### A version was skipped due to a bug. {#version-skipped-id}

WordPress.orgで安定版としてマークするのをスキップしなければならないバグがある場合：

- 関連するエンジニアリングチームに通知する。
- デブ・アドボカシー**にループを回し、広報を手伝ってもらう。
- 月曜日にバグが発見され、火曜日までに修正が間に合わない場合は、Dev Advocacyと協力して遅延を発表してください。以下の遅延について](#release-delay)を読んでください。

リリースのメカニックの面では：

- 自動生成された PR のうちマージすべきものは、そのリリースが安定版 (stable) とマークされた場合と同じようにマージしてください。
- 問題のあるバージョンの GitHub リリース草案やタグは削除しないでください。
- 修正されたリリースがデプロイされ、安定版としてマークされた後：
    - スキップしたバージョンの GitHub リリースを順番にすべて公開します。
    - 実際に有効なリリースだけを「最新リリース」としてマークする。

### A critical bug surfaced after the release was marked stable on WordPress.org

深刻なリグレッションやバグが発見された場合（チェックアウトの失敗や回復不可能なデータ損失など）：

1. Immediately notify the relevant engineering team(s).
2. Prepare to do a [Point Release](/docs/contribution/releases/point-releases).
3. Temporarily move the stable tag on WordPress.org back to the previous known-good version:
   - Identify the correct previous version and note its exact number.
   - Use the [`Release: Update stable tag`](https://github.com/woocommerce/woocommerce/actions/workflows/release-update-stable-tag.yml) workflow, making sure to check the _Revert_ option to allow downgrading.
   - Merge any auto-generated PRs right away.

### The release needs to be delayed. What should we do? {#release-delay}

1. Create an internal Slack thread to communicate with the engineering teams as well as Dev Advocacy. This also provides an opportunity for teams to share any additional context and verify or challenge schedule changes.
2. Ask Dev Advocacy to communicate the delay publicly.
3. If there's a clear ETA on the patch release with a fix, [update the release calendar](https://developer.woocommerce.com/release-calendar/) with the new dates.

パッチリリースを[週末に近すぎないように](#release-delay-weekend-id)計画することを忘れないでください。

### The release was delayed. Can we still release after Tuesday? {#release-delay-weekend-id}

一般的に、火曜日以降のリリース、特に週末に近いリリースは避ける。

パッチの準備が整い、問題が修正されたように見えても、他に隠れた問題がないかを確認するのは難しいし、週の後半に急いでリリースするということは、チームのほとんどが問題を監視したり対応したりすることができなくなるということだ。

経験則として、疑わしい場合は、信頼性を高めるためにリリースを1週間遅らせることを考慮する。
