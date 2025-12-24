---
post_title: AI
sidebar_label: AI
sidebar_position: 3
---

# AI

このガイドでは、AIツールの概要と、WooCommerce開発ワークフローを強化するためのAIツールの使用方法について説明します。

## MCP

WooCommerceはモデルコンテキストプロトコル(MCP)のネイティブサポートを含んでおり、AIアシスタントやツールが標準化されたプロトコルを介してWooCommerceストアと直接対話することを可能にします。詳しくは[MCPドキュメント](/docs/features/mcp/)をご覧ください。

## AIドキュメンテーションツール

### LLMS.txtファイル

WooCommerce Developer DocumentationをLLMまたはAIアシストIDEにフィードするには、2つのオプションがあります：

1. [`llms.txt`](https://developer.woocommerce.com/docs/llms.txt) - A table of contents that includes the title, URL, and description of each document in the developer docs.
2. [`llms-full.txt`](https://developer.woocommerce.com/docs/llms-full.txt) - A full Markdown-formatted export of the entire documentation in one file.

CursorやWindsurfのようなIDEを使用している場合は、必要に応じて参照できるように、これらのリンクをカスタム・ドキュメントとして追加することをお勧めします。

**Note** that these do not include the contents of the [WC REST API documentation](https://woocommerce.github.io/woocommerce-rest-api-docs/#introduction) or the [WooCommerce Code Reference](https://woocommerce.github.io/code-reference/).

### マークダウンにコピー

Developer Docsのどのページにも、右上にクリップボードのアイコンがあります。このアイコンを選択すると、現在のドキュメントがMarkdownフォーマットでコピーされ、LLMのチャットインターフェースに貼り付けることができます。

## AI開発ツール

### 投稿者用カーソル・ルール・ファイル

The `.cursor/rules/` directory contains configuration files that provide AI assistants with specific guidance for working with the WooCommerce codebase. These files help ensure consistent development practices and workflows:

-   **`generate-pr-description.mdc`** - Provides guidelines for creating pull request descriptions using the repository's PR template. It ensures proper markdown structure, changelog formatting, and automation compatibility.

-   **`git.mdc`** - Defines branching conventions and commit message standards for the WooCommerce repository, including naming patterns for different types of changes (fixes, features, refactors, etc.).

-   **`woo-build.mdc`** - Contains instructions for building the WooCommerce plugin, including dependency installation commands and development build processes using pnpm and nvm.

-   **`woo-phpunit.mdc`** - Provides guidance for running PHPUnit tests in the WooCommerce codebase, including the specific command structure and directory requirements.

これらのルールファイルは、AIアシスタントがプロジェクトの開発ワークフローを理解し、WooCommerceのコーディング標準とプラクティスとの一貫性を維持するのに役立ちます。
