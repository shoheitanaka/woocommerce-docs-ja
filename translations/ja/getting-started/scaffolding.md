---
post_title: Scaffolding and sample store data
sidebar_label: Scaffolding and sample data
sidebar_position: 4
---
# スカフォールドとサンプルストアのデータ

WooCommerceは、あなたが構築しようとしているものに応じて、多くのスターターキットや足場を提供しています。

## スターターテーマ

WooCommerceストアをデザインする場合、テーマ開発には2つの選択肢があります：クラシックテーマとブロックテーマです。

-   クラシックテーマは、PHPテンプレートを使用して、商品ページ、商品アーカイブ、ショッピングカート、チェックアウトページなど、ストアの主要ページのデザインを上書きします。クラシックテーマを使用しているサイトはWordPressブロックエディタを使用できますが、テンプレートの多くはエディタ自体で編集できません。
-   ブロックテーマはWordPressサイトエディタを使って、ヘッダーやフッター、商品ページ、アーカイブ、カートページやチェックアウトページなど、WordPressサイトのあらゆる面を生成します。サイトエディターで作成したデザインはフラットHTMLファイルにエクスポートできますが、ファイル自体は通常WordPressエディターで編集します。

### ストアフロントテーマ（クラシック）

StorefrontはWooの代表的なクラシックテーマで、[WordPress Theme Directory](https://wordpress.org/themes/)にあります。テーマ自体をリネームして変更することも、子テーマを使って特定の部分を上書きすることもできます。

クラシックなWooCommerceテーマの作成に関する詳細は、クラシックテーマ開発ハンドブックをお読みください。子ブロックテーマの作成とクラシックテーマとブロックテーマの違いを理解するための包括的なガイドについては、[WooCommerceブロックテーマ開発](/docs/theming/block-theme-development/theming-woo-blocks) と [WordPressブロック子テーマ開発](https://learn.wordpress.org/lesson-plan/create-a-basic-child-theme-for-block-themes/) を参照してください。

### ブロック・スターター・テーマ

ブロックテーマ開発の全くの初心者の方は、[Develop Your First Low-Code Block Theme](https://learn.wordpress.org/course/develop-your-first-low-code-block-theme/) でブロックテーマ開発について学び、新しいテーマを作成する準備ができたら、[Create Block Theme plugin](https://wordpress.org/plugins/create-block-theme/) ツールをお試しください。

詳しくは[ブロックテーマ開発ハンドブック](/docs/theming/block-theme-development/theming-woo-blocks)をご覧ください。

## エクステンション足場

### @woocommerce/create-woo-extension

[Create Woo Extension](https://github.com/woocommerce/woocommerce/tree/trunk/packages/js/create-woo-extension/)はNPXコマンドで、WooCommerceエクステンション全体をあなたのストアのために雛形化します。生成されたエクステンションはWooCommerce Adminと統合するReactベースの設定ページを追加します。また、PHPとJavascriptのユニットテスト、リンティング、WooCommerceとWordPressのPrettier IDE設定も含まれています。

[create-woo-extensionパッケージ](/docs/extensions/getting-started-extensions/building-your-first-extension)を使用したチュートリアルをお読みください。

### @woocommerce/extend-cart-checkout-block

これは`@wordpress/create-block`と一緒に使用するテンプレートで、WooCommerce Blocksエクステンションのスタートポイントを作成します。インストールして使用するには、[`@woocommerce/extend-cart-checkout-block`](https://github.com/woocommerce/woocommerce/tree/trunk/packages/js/extend-cart-checkout-block/)の指示に従ってください。この例には、インナーブロックだけでなく、他の複数の拡張性の例が含まれていることに注意してください。

### WooCommerce admin 拡張機能の例

WooCommerceプラグインの内部には、WooCommerceのコア機能を変更するためのさまざまな使用例を紹介する一連の拡張機能があります。例えば、カスタムレポートの追加、カスタム支払いゲートウェイ、WooCommerceダッシュボードの変更などです。

[WooCommerceの分析レポートを拡張する方法](/docs/features/analytics/extending-woocommerce-admin-reports)を紹介するチュートリアルをお読みください。

## 関連するワードプレスの足場

### デフォルトのWordPressテーマ

デフォルトのWordPressテーマ（この記事を書いている時点ではTwenty-Twenty Five）は、WordPressブロックテーマのベストプラクティスと標準的な規約を見るのに最適な場所です。Create Block Themeツールを使えば、サイトエディターからテーマのデザインを変更し、新しいデザインをカスタム子テーマにエクスポートすることができます。

### Wordpress/create-block

WordPressにコンテンツやデザイン要素を追加する場合、カスタムブロックを作成することは理にかなっているかもしれません。WordPressのブロックエディタパッケージライブラリには、WordPress Create Blockという足場ツールが含まれており、任意のページやテンプレートに挿入できるカスタムブロックを作成するのに役立ちます。

[`wordpress/create-block`パッケージ](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/)についてもっと読む。

## サンプル店舗データ

### コアプラグインサンプルデータ

ローカルストアにサンプルデータを読み込むと便利です。WooCommerceコアプラグインには、WordPress管理画面またはWC-CLI経由でWooCommerceに直接インポートできるCSVファイルとXMLファイルがあります。サンプルデータは[`/plugins/woocommerce/sample-data/`](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/sample-data)にあります。

### スムース・ジェネレーター

より高度なテストには、サンプル顧客と注文データが必要かもしれません。[Smooth Generator](https://github.com/woocommerce/wc-smooth-generator)は、テスト用のWooCommerce関連データを生成するのに役立つプラグインです。基本的な操作にはWP Adminインターフェイスを使用し、より高度な機能にはCLIツールを使用します。[リリースページ](https://github.com/woocommerce/wc-smooth-generator/releases)から最新版をダウンロードしてインストールし、リポジトリのドキュメントを参照してください。
