---
post_title: AI
sidebar_label: AI
sidebar_position: 3
---
このガイドでは、AIツールの概要と、WooCommerce開発ワークフローを強化するためのAIツールの使用方法について説明します。

WooCommerceはモデルコンテキストプロトコル(MCP)のネイティブサポートを含んでおり、AIアシスタントやツールが標準化されたプロトコルを介してWooCommerceストアと直接対話することを可能にします。詳しくは[MCPドキュメント](/docs/features/mcp/)をご覧ください。

## AIドキュメンテーションツール

### LLMS.txtファイル

WooCommerce Developer DocumentationをLLMまたはAIアシストIDEにフィードするには、2つのオプションがあります：

1.[`llms.txt`](https://developer.woocommerce.com/docs/llms.txt) - 開発者ドキュメントの各ドキュメントのタイトル、URL、説明を含む目次。
2.[`llms-full.txt`](https://developer.woocommerce.com/docs/llms-full.txt) - ドキュメント全体を1つのファイルにまとめたMarkdown形式のエクスポート。

CursorやWindsurfのようなIDEを使用している場合は、必要に応じて参照できるように、これらのリンクをカスタム・ドキュメントとして追加することをお勧めします。

[**WC REST API documentation](https://woocommerce.github.io/woocommerce-rest-api-docs/#introduction) や [WooCommerce Code Reference](https://woocommerce.github.io/code-reference/) の内容は含まれません。

### マークダウンとして提供

ドキュメントをMarkdownファイルとして見たい場合は、ドキュメントのURLの最後に`.md`を追加してください。例えば、このページをMarkdownとして見るには、次のようにアクセスします：   

```plain
https://developer.woocommerce.com/docs/getting-started/ai.md
``` 

### マークダウンにコピー

Developer Docsのどのページにも、右上にクリップボードのアイコンがあります。このアイコンを選択すると、現在のドキュメントがMarkdownフォーマットでコピーされ、LLMのチャットインターフェースに貼り付けることができます。

## AI開発ツール

### 貢献者のためのエージェント・スキル

WooCommerceモノレポには、一般的な開発タスクの手順ガイダンスをAIアシスタントに提供するエージェントスキルが含まれています。これらのスキルはリポジトリのルートにある `.ai/skills/` ディレクトリにあります。

各スキルには、`SKILL.md`ファイルが含まれており、次のようなタスクをステップごとに説明している：

- バックエンドPHPの開発とテストの慣例
- コードレビューの標準とベストプラクティス
- Git のワークフローとコミット規約
- ビルドとリンティングのプロセス
- UIコピーとドキュメンテーションのガイドライン

スキルはツールに依存しないように設計されており、さまざまなAIコーディングアシスタントで使用できます。利用可能なスキルを調べるには、リポジトリの [`.ai/skills/` ディレクトリ](https://github.com/woocommerce/woocommerce/tree/trunk/.ai/skills) を参照してください。

### 投稿者用カーソル・ルール・ファイル

`.cursor/rules/`ディレクトリには、AIアシスタントにWooCommerceコードベースで作業するための特定のガイダンスを提供する設定ファイルが含まれています。これらのファイルは一貫した開発プラクティスとワークフローを保証するのに役立ちます。
