---
post_title: Contributing technical documentation
sidebar_label: Contributing docs
---

# Contributing technical documentation

WooCommerceの開発者向けドキュメントの改善にご協力いただきありがとうございます。私たちのドキュメントはDocusaurusを利用しており、monorepoの[`woocommerce/docs/`](https://github.com/woocommerce/woocommerce/tree/trunk/docs)フォルダ内にあります。

このガイドでは、効果的に貢献するための仕組み、ツール、プロセスについて説明します。

## ♪ はじめに 

> このガイドでは、基本的な Git と GitHub の機能に慣れていること、GitHub アカウントにサインインしていること、ローカルに Git がセットアップされていることを前提としています。GitHub を初めて使う場合は、始める前に [quickstart](https://docs.github.com/en/get-started/quickstart/hello-world) と [working with forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) のガイドを読むことをおすすめします。

### 初期設定

1.GitHubの[WooCommerce monorepo](https://github.com/woocommerce/woocommerce)をフォークしてください。と聞かれたら、`copy the trunk branch only`オプションをチェックすると安全です。
2.[作成したフォークをクローンする](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)。これでローカルで編集できるようになります。

### 変更を加える

1.変更を加える前に、あなたの`trunk`ブランチがmonorepoの`trunk`と[同期して]最新であることを確認してください(https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)。
2.変更を加えるたびに、`trunk`から`docs/`で始まる新しいブランチを作成します。例えば、エクステンションのパフォーマンス向上に関するドキュメントを追加する場合、ブランチを`docs/improve-extension-performance`と呼ぶことができます。
3.INLINE_CODE_5__の下にある適切なフォルダで、マークダウンファイルを作成または編集します。
4.必要に応じて、フォルダの`_category_.json`（サイドバーのラベル/位置）を更新してください。
5.ビルドを実行して変更を確認し、サイトマップとllms-txtファイルが更新されていることを確認し、マークダウンのリンティングエラーとリンク切れを検出します（リンクチェックはビルド時のみ行われます）：

    ```bash
    npm run build
    ```

### プルリクエストを開く

1.変更をコミットしてフォークにプッシュする。
2.[プルリクエストを開く](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) to woocommerce/woocommerce, target the trunk branch.
3.説明的なタイトルをつけ、PR テンプレートに記入してください。を含めてください：
    * 新しいファイルやカテゴリの根拠
    * サイドバーや構造の変更についてのメモ
4.WooCommerce Developer Advocacy チームがあなたの変更を確認し、マージします。

## # Docs フォルダー解剖学

### ツールおよび構成

* **サポート・ツールとコンフィグ**はここにある：
    * [`woocommerce/docs/_docu-tools/`](https://github.com/woocommerce/woocommerce/blob/trunk/docs/_docu-tools/)
* **トップレベルのサイドバーとナバー**は[`sidebars.ts`](https://github.com/woocommerce/woocommerce/blob/trunk/docs/_docu-tools/sidebars.ts)に設定されています：
    * [__INLINE_CODE_1__](__URL_1__)
    * [`docusaurus.config.ts`](https://github.com/woocommerce/woocommerce/blob/trunk/docs/_docu-tools/docusaurus.config.ts)

### ドキュメントファイル

* **ドキュメントの場所**：すべてのドキュメントは[`woocommerce/docs/`](https://github.com/woocommerce/woocommerce/blob/trunk/docs/)の中にあります。
* **各フォルダーはサイドバーまたはトップナビのカテゴリーです：例えば、`getting-started`、`code-snippets`など。
* 各カテゴリーの**サイドバー設定**は、各カテゴリーフォルダー内の`_category_.json`ファイルを使用して管理されます：

    ```json
    {
        "position": 7,
        "label": "Code snippets"
    }
    ```

## 画像の追加

ドキュメントの画像はすべて

```bash
docs/_docu-tools/static/img/doc_images/
```

マークダウン・ファイルに画像を含めるには、次のように参照する：

```markdown
![Alt text](/img/doc_images/your-image-name.png)
```

## 新しいカテゴリーを作る

新しいカテゴリーを作成する前に、本当に必要かどうかを検討する必要があります。可能であれば、既存のカテゴリーでコンテンツを作成することをデフォルトにすべきです。新しいカテゴリーを作成する必要がある場合は、以下の手順に従ってください：

1.INLINE_CODE_0__フォルダーの中に、わかりやすい名前のサブフォルダーを作成します。例えば、`Checkout design guidelines`セクションを作成したい場合は、`/docs/checkout-design-guidelines`というフォルダを作成します。

2.各カテゴリーフォルダー内に`_category_.json`ファイルを作成し、サイドバー内の位置とラベルを指定します：

    ```json
    {
        "position": 10,
        "label": "Checkout design guidelines"
    }
    ```

新しいカテゴリーを作成する際は、プルリクエストの説明文にカテゴリーを作成した理由についての根拠を含めてください。

## 執筆ガイドラインと参考文献

* ファイル名はURLと同じ短いものを使用する（大文字と小文字を区別し、スペースは使用しない）。
* Google Docsのようなリッチテキストエディタからの貼り付けは避けてください。
* 詳しい書き方のガイドラインは[docs style guide](style-guide)を参照してください。
* [ドキュソー文書](https://docusaurus.io/docs)を参照してください。

