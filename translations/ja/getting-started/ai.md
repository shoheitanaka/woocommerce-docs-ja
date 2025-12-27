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

### マークダウンにコピー

Developer Docsのどのページにも、右上にクリップボードのアイコンがあります。このアイコンを選択すると、現在のドキュメントがMarkdownフォーマットでコピーされ、LLMのチャットインターフェースに貼り付けることができます。

## AI開発ツール

### 投稿者用カーソル・ルール・ファイル

`.cursor/rules/`ディレクトリには、AIアシスタントにWooCommerceコードベースで作業するための特定のガイダンスを提供する設定ファイルが含まれています。これらのファイルは一貫した開発プラクティスとワークフローを保証するのに役立ちます：

-   **`generate-pr-description.mdc`** - リポジトリのPRテンプレートを使ってプルリクエストの説明を作成するためのガイドラインを提供します。適切なマークダウン構造、変更履歴の書式、自動化の互換性を保証します。

-   **`git.mdc`** - WooCommerce リポジトリのブランチ規則とコミットメッセージの標準を定義します。

-   **`woo-build.mdc`** - 依存関係のインストールコマンドとpnpmとnvmを使用した開発ビルドプロセスを含む、WooCommerceプラグインのビルド手順を含みます。

-   **`woo-phpunit.mdc`** - WooCommerce コードベースで PHPUnit テストを実行するためのガイダンスを提供します。

これらのルールファイルは、AIアシスタントがプロジェクトの開発ワークフローを理解し、WooCommerceのコーディング標準とプラクティスとの一貫性を維持するのに役立ちます。
