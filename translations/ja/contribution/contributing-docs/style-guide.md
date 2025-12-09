---
post_title: Technical documentation style guide
sidebar_label: Style guide
---

# Technical Documentation Style Guide

このスタイルガイドは、WooCommerce技術文書のための効果的でユーザーフレンドリーなチュートリアルとハウツーガイドを作成するためのガイドラインを提供することを目的としています。

## Writing style

### Language style

- わかりやすく、簡潔な言葉を使うことが大切です。アクティブボイスを使用し、ユーザーにとって馴染みのない専門用語の使用は避けましょう。友好的で親しみやすく、ユーザーの行動を促すようなトーンにする。

- 記事は三人称で書かれる。
  例「あなたのページに埋め込みブロックを追加してください。

- スペルや句読点のスタイルにはアメリカ英語を使うか、他の英語圏で異なるスペルを持たない別の単語を使うことを検討しましょう。

- 文書のタイトルや小見出しには（タイトルケースではなく）センテンスケースを使用してください。
  例"打ち上げ体験の紹介 "ではなく、"打ち上げ体験の紹介"。

- When referring to files or directories, the text formatting eliminates the need to include articles such as "the" and clarifying nouns such as "file" or "directory".
  Example: "files stored in ~~the~~ `/wp-content/uploads/` ~~directory~~" or "edit ~~the~~ `/config/config.yml` ~~file~~ with"

### Writing tips

- 対象となる読者には、さまざまな役割や能力があります。チュートリアルやハウツーガイドを作成する際には、対象読者を考慮することが重要です。初心者なのか上級者なのか？技術的な背景は？読者を理解することは、ガイドで使用する詳細なレベルや言語の選択の指針になります。

- 専門知識のない読者や英語が母国語でない読者にも理解できる言葉を使う。

- 読者が初めて見るWooCommerceのドキュメントページかもしれません。Google検索や他のウェブサイトを経由してここにたどり着いたかもしれません。読者にトピックに関する十分な文脈を与え、単語やフレーズを他の関連するDocs記事にできるだけ頻繁にリンクしてください。

- 読者に関連するような文脈でトピックを展開するために、洞察、ヒント、注意情報を提供する注釈やセクションを考慮する。

- 具体的な指示、ベストプラクティス、または要件を提供する場合は、提供されたガイダンスに従わない場合の潜在的な結果や影響についての説明を含めることをお勧めします。これは、文書に検索キーワードを追加し、文書へのリンクをサポートする際に、より良い文脈を提供するのに役立ちます。

- 常に、トピックに対する概念的でハイレベルなイントロダクションを、H2の小見出しの上に最初に書く。

### Tutorials

チュートリアルは包括的で、新しいスキルやコンセプトを教えるためにデザインされています。

> You are the teacher, and you are responsible for what the student will do. Under your instruction, the student will execute a series of actions to achieve some end.
> 
> [Divio Framework on Tutorial Writing](https://documentation.divio.com/tutorials/)

### How-to guides

ハウツーガイドは、焦点を絞った具体的なもので、特定のタスクの達成方法や特定の問題の解決方法を説明するものである。

> How-to guides are wholly distinct from tutorials and must not be confused with them:
> 
> - A tutorial is what you decide a beginner needs to know.
> - A how-to guide is an answer to a question that only a user with some experience could even formulate.
> 
> [Divio Framework on How-to-Guide Writing](https://documentation.divio.com/how-to-guides/)

## Custom Linting Rules

At WooCommerce, we're dedicated to maintaining a consistent and high-quality standard for our technical documentation. Our documents primarily adhere to the linting rules provided by `markdownlint`. To assist our contributors, we've detailed our custom configurations and exceptions below.

Note: While we've outlined specific rules above, all other default linting rules from `markdownlint` apply unless otherwise stated. We've only highlighted custom configurations or exceptions here. For a complete list of `markdownlint` rules, you can refer to [this link](https://github.com/DavidAnson/markdownlint/blob/3561fc3f38b05b3c55f44e371c2cd9bda194598a/doc/Rules.md).

1. **Headings Style**: 
    - Use the ATX-style (`#`) for headers.

    ```markdown
      # This is an H1
      ## This is an H2
    ```

   [Reference: MD003](https://github.com/DavidAnson/markdownlint/blob/3561fc3f38b05b3c55f44e371c2cd9bda194598a/doc/Rules.md#md003---heading-style)

2. **リストのインデント**： 
    - リスト項目のインデントを空白 4 文字にします。

    ```markdown
      - Item 1
          - Subitem 1.1
    ```

   [Reference: MD007](https://github.com/DavidAnson/markdownlint/blob/3561fc3f38b05b3c55f44e371c2cd9bda194598a/doc/Rules.md#md007---unordered-list-indentation)

3. **Line Length**: 
    - No specific restriction on the line length, but keep paragraphs and sentences readable.
    
    [Reference: MD013](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md#md013---line-length)

4. **Multiple Headings with the Same Content**: 
    - Multiple headings with the same content are permissible as long as they are not siblings.
    
    [Reference: MD024](https://github.com/DavidAnson/markdownlint/blob/3561fc3f38b05b3c55f44e371c2cd9bda194598a/doc/Rules.md#md024---no-multiple-headings-with-the-same-content)

5. **Inline HTML**: 
    - Only the `video` element is allowed when using inline HTML.

    ```markdown
    <video src="path_to_video.mp4" controls></video>
    ```

   [Reference: MD033](https://github.com/DavidAnson/markdownlint/blob/3561fc3f38b05b3c55f44e371c2cd9bda194598a/doc/Rules.md#md033---inline-html)

6. **Tabs and Whitespace**: 
    - We're flexible with the use of hard tabs and trailing whitespace. However, for consistency, we recommend using spaces over tabs and avoiding trailing whitespaces.
    
    [Reference: no-hard-tabs & whitespace](https://github.com/DavidAnson/markdownlint/blob/3561fc3f38b05b3c55f44e371c2cd9bda194598a/doc/Rules.md)

## Formatting

### Visual style

- Use the H2 style for main headings to be programmatically listed in the articles table of contents.
- File names and directory paths should be stylized as code per the [HTML spec](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-code-element).
  Example: `/wp-content/uploads/`
- References to a single directory should have a trailing slash (eg. "/" appended) to the name.
  Example: "uploads/"
- References to repositories should appear without forward slashes and not be formatted in any way. The first appearance of a repository in article content should link to the URL of the repository source whenever possible.
  Example: "[woocommerce-blocks](https://github.com/woocommerce/woocommerce-blocks)" followed by "woocommerce-blocks"
- Inline references to functions and command line operations should be formatted as inline code.
  Example: "Use `dig` to retrieve DNS information."
- Functions should be styled with "Inline code" formatting and retain upper and lower case formatting as established from their source.
  Example: `WP_Query` (not WP_query)

### Visual aids

スクリーンショット、図、コード・スニペット、ビデオなどの視覚的補助は、ハウツー・ガイドで非常に役立ちます。視覚的なリファレンスを提供することで、ユーザーはより簡単に説明を理解することができます。ビジュアルエイドを掲載する場合は、必ずラベルを明記し、何が表示されているかを説明するキャプションや説明を付けてください。

### Acronyms

頭字語の形でよく知られているフレーズも使用できる。どのページでも、頭字語が初めて登場する場合は、完全な語句を記載し、その後に頭字語を括弧書きで記載しなければならない。

例ハイパフォーマンスオーダーストレージ（HPOS）の導入により、WooCommerceのクエリ機能を強化しました。

その後、その頭字語は残りのページで使うことができる。

用語が一般的かどうかを決定するとき、翻訳と将来の国際化(i18n)の取り組みへの影響を考慮してください。

## Patterning

### Article content

ハウツーガイドを作成する際には、一貫性のあるわかりやすいフォーマットを使うことが重要です。ここでは、ソフトウェアのハウツーガイドの推奨テンプレートをご紹介します：

**はじめに**：ガイドが扱うタスクや機能の概要を説明する。

**前提条件**：タスクを完了する、または機能を使用するために必要な前提条件をリストします。

**ステップバイステップの説明**：タスクを完了する、または機能を使用するための詳細なステップバイステップの指示を提供する。ステップに番号をつけ、適切な場合はスクリーンショットやその他の視覚的補助を含める。

**トラブルシューティング**：ユーザーが遭遇する可能性のある一般的な問題やエラーに対処するトラブルシューティングのセクションを含める。

**結論**：結論**：本ガイドで取り上げた重要なポイントを要約し、参考になりそうな追加資料や参考文献があれば提示する。

## Terminology

### Reference to components and features

- "**WordPress Admin dashboard**" should be presented in its complete form the first time it appears in an article, followed by its abbreviated form in parentheses ("WP Admin"). Thereafter the abbreviated form can be used for any reference to the WordPress Admin dashboard within the same article.
- When referring to the URL of the WordPress Admin dashboard, the shortened form `wp-admin` can be used.

## Testing

チュートリアルやガイドを公開する前に、その手順が正確でわかりやすいものであるかどうかを徹底的にテストすることが重要です。

## Structure

### Atomizing the docs

一箇所に多くのトピックを網羅しすぎた記事は、ユーザーが探している情報を見つけることを難しくします。ドキュメントを "アトマイズ "することは、広範な記事を小さな関連記事のグループに分割することを意味します。この記事グループには、多くの場合、記事グループのハイレベルな概要を示すメインの「ランディングページ」があり、説明的なテキストは、ユーザーが関連すると思われる関連記事へのリンクを提供します。このような記事グループは、より小さく、霧状化された記事によって形成された情報の「分子」と考えることができる。

より小さなコンテンツのかたまりをそれぞれの記事に分割することで、アンカータグを使ったより広範な記事へのリンクに頼るよりも、特定のトピックへのリンクが容易になります。このより具体的なリンクアプローチは、サポートチームにとって有用ですが、Docsサイト全体を通して記事を相互リンクする際にも役立ちます。
