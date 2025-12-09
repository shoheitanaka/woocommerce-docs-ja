---
post_title: WooCommerce Point Releases
sidebar_label: Point Releases
sidebar_position: 2
---

# Point Releases

## What Are Point Releases?

ポイントリリースは、実質的な新機能を追加することなく、特定の問題に対処するパッチリリースです。ポイント・リリースには通常、以下のものが含まれます：

- **店舗機能やチェックアウトプロセスに影響を与える重要なバグ修正
- **緊急の脆弱性に対するセキュリティパッチ
- **WordPress、テーマ、プラグインの競合に関する互換性の修正

## Timing a Point Release

ポイント・リリースの正確な作成時期を検討する際には、未解決の問題の緊急度と重大性に基づいて、最善の判断を行ってください：

- 問題の緊急度がそれほど高くない場合は、3～4日待って、関連する問題が追加で報告されるかどうかを確認してから続行することを検討してください。これにより、修正を統合し、パッチリリースの回数を減らすことができます。
- 重要度の高い問題やクリティカルな問題については、ユーザーへの影響を最小限に抑えるため、できるだけ早くリリースすることを優先してください。
- セキュリティ上の問題については、セキュリティ修正を実施したチー ムと調整し、緊急性が明確でない場合はその判断に役立てる。
- 他の既知の問題についても、同じリリースに含めることができるような作業がすでに行われていないかどうかを検討する。

## The Point Release Requests (PRR) flow

ポイントリリースリクエスト(PRR)フロー**は、WooCommerceポイントリリースに含める必要のある重要な修正をリクエストし、管理するための構造化されたプロセスです。このプロセスにより、緊急のバグ修正が安全に現在の安定版リリースに組み込まれ、トランクと凍結ブランチに自動的にフォワードポートされ、コード品質が維持され、徹底的なレビューが実施され、リグレッションが防止されます。

**⚠️ Important:** Security Vulnerability reports must not go through the PRR flow. All potential security issues should be reported privately via Automattic’s HackerOne program: [https://hackerone.com/automattic/](https://hackerone.com/automattic/).

### Step-by-Step Process

#### 1a. Initial Issue Creation

次のポイントリリースに含まれる予定のすべての修正をリリースリーダーが確実に把握できるようにするためには、バグが発見され、パッチ修正として計画されたら、すぐにissueかPRを作成することが重要です。  そうすることで、パッチリリースの作成回数を減らすことができます。

If the initial PR may take more than a few hours to create, please create an issue and set the milestone of the issue to targeted release. E.g. use milestone `10.1.0` for a new point release request for `10.1.x`.

#### 1b. Initial Pull Request Creation

**Author Action**: Create a pull request against the release branch (`release/x.y`) instead of the trunk branch, following the standard PR creation process.

- The PR should target the specific release branch (e.g., `release/9.5` for an issue found on WooCommerce 9.5.x)
- Include a regular changelog file as you would for trunk PRs
- Ensure all standard PR requirements are met (description, testing, etc.)
- Ensure that the PR has a milestone set to the target release so it can be tracked by the release lead, e.g. use milestone `10.1.0` for a new point release request for `10.1.x`.

#### 2. Point Release Request Submission

**Author Action**: Submit a PRR using the [Point Release Request template](https://github.com/woocommerce/woocommerce/issues/new?template=new-prr-template.yml).

必要なPRRテンプレート情報を提供する：

**必須項目

- **PR URL**：リリースブランチに対するプルリクエストの URL
- **Justification**：この PR にポイントリリースが必要な理由
- **影響評価**：影響評価**: 修正が含まれていない場合の影響 (影響を受けるユーザー数とその方法)
- **コンティンジェンシープラン**：コンティンジェンシープラン**：ポイントリリース後に不具合が発見された場合の対処方法
- **コミュニケーション計画**：リリースのブログ記事でどのように変更を伝えるべきか
- **回避策**：利用可能な回避策とその伝え方
- **代替連絡先**：作者が不在の場合の連絡先

#### 3. Release-Lead Review

PRRがオープンされると、**リリース・リード**がそれを評価する。  
PRRを承認するかどうかを決定する際、リリースリードは以下を考慮する必要があります：

| 評価基準
| -------------------- | -------- |
| 影響範囲**｜すでに影響を受けている店舗数は？範囲が広ければ緊急性が増す。|
| エラーの共通性**｜問題は広く使われているコアフロー、プラグイン、またはテーマに起因していますか？一般的なコンポーネントの問題は通常、より迅速な対応につながります。|
| 回避策**｜ストアオーナーが適用できる、簡単で文書化された回避策（フィルタ、設定トグル、一時的な機能無効化など）はありますか？すぐに利用できる回避策があれば、ポイントリリースの必要性が低くなります。|
| バグは重要なコマース機能(チェックアウト、支払い、商品の可視性)をブロックしていますか?ビジネスクリティカルな障害ほど優先度は高くなります。|

#### 4. Approval or Rejection

| Outcome | Release-Lead Action | Workflow Triggered |
|---------|--------------------|--------------------|
| **Approve** | Apply the **`Approved`** label to the PRR issue and optionally leave a short rationale referencing the criteria above. | Labels are automatically added to the PR (“cherry pick to trunk”, “cherry pick to frozen release”); the issue milestone is set to the current release; the PRR is commented with an approval note. |
| **Reject** | Apply the **`Rejected`** label and briefly state the reason (e.g., limited impact, simple workaround available). | A workflow adds a comment, closes the PRR, and the author must retarget the PR to `trunk`, resolve conflicts, and merge through the normal path. |


#### 5. Merge to Release Branch (Release Lead / Core Contributor)

- **Verify cherry-pick requirements**
    - Check whether the fix is already included in `trunk` and/or the next frozen branch.
    - If the fix *should not* be forward-ported, remove the labels `cherry pick to trunk` and `cherry pick to frozen release`.

- **Merge the PR**
    - After reviewing the labels, merge the PR into the current `release/x.y` branch.
    - Confirm that the changelog entry and milestone are correct.

- **Resulting automation**
    - If either cherry-pick label remains, GitHub Actions opens follow-up PRs to `trunk` and/or the frozen release branch.
    - If both labels were removed, no cherry-pick workflows run.

#### 6. Review & Merge Follow-up PRs (Release Lead)

After the primary fix is merged into `release/x.y`, the labels that remain on the PR determine what happens next:

| Label present | Automation result | What the release lead must do |
|---------------|------------------|------------------------------|
| `cherry pick to trunk` | Action opens a new PR targeting `trunk` and adds the current milestone. | Review tests / CI and merge this PR. |
| `cherry pick to frozen release` | Action opens a new PR targeting the **next frozen branch** (e.g., `release/9.6`) and adds the milestone. | Review and merge this PR as well. |

両方のフォローアップPRは、ポイントリリース・タグがカットされる前にマージされなければならない**。  
どちらかのチェリーピックが不要な場合は、不要なPRが生成されないように、ステップ5でラベルが削除されたことを確認してください。

#### 7. Publish the Point Release (Release Lead)

必要なPRがすべてマージされたら：

- `release/x.y` (current maintenance branch)
- `trunk` (future feature branch)
- *optional* frozen branch (`release/x.y+1`)

リリース・リード**は、前回の出荷以降に承認されたすべてのPRRを含む新しいポイント・リリースを作成し、発行します。

確立された[WooCommerceリリースプロセス](/docs/contribution/releases/building-and-publishing)に従ってください。
