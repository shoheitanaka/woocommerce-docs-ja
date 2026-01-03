---
post_title: Scaffolding and sample store data
sidebar_label: Scaffolding and sample data
sidebar_position: 4
---

# スキャフォールディングとサンプルストアデータ

WooCommerce は、あなたが構築しようとしているものに応じて、多くのスターターキットや足場を提供しています。

## スターターテーマ

WooCommerce ストアをデザインする場合、テーマ開発には2つの選択肢があります：クラシックテーマとブロックテーマです。

-   クラシックテーマは、PHP テンプレートを使用して、商品ページ、商品アーカイブ、ショッピングカート、チェックアウトページなど、ストアの主要ページのデザインを上書きします。クラシックテーマを使用しているサイトは WordPress ブロックエディタを使用できますが、テンプレートの多くはエディタ自体で編集できません。
-   ブロックテーマは WordPress サイトエディタを使って、ヘッダーやフッター、商品ページ、アーカイブ、カートページやチェックアウトページなど、WordPress サイトのあらゆる面を生成します。サイトエディターで作成したデザインはフラット HTML ファイルにエクスポートできますが、ファイル自体は通常 WordPress エディターで編集します。

### ストアフロントテーマ（クラシック）

Storefront は Woo の代表的なクラシックテーマで、[WordPress Theme Directory](https://wordpress.org/themes/)にあります。テーマ自体をリネームして変更することも、子テーマを使って特定の部分を上書きすることもできます。

クラシックな WooCommerce テーマの作成に関する詳細は、クラシックテーマ開発ハンドブックをお読みください。子ブロックテーマの作成とクラシックテーマとブロックテーマの違いを理解するための包括的なガイドについては、[WooCommerce ブロックテーマ開発](/docs/theming/block-theme-development/theming-woo-blocks)と[WordPress ブロック子テーマ開発](https://learn.wordpress.org/lesson-plan/create-a-basic-child-theme-for-block-themes/)を参照してください。

### ブロック・スターター・テーマ

ブロックテーマ開発の全くの初心者の方は、[Develop Your First Low-Code Block Theme](https://learn.wordpress.org/course/develop-your-first-low-code-block-theme/) でブロックテーマ開発について学び、新しいテーマを作成する準備ができたら、[Create Block Theme plugin](https://wordpress.org/plugins/create-block-theme/) ツールをお試しください。

詳しくは[ブロックテーマ開発ハンドブック](/docs/theming/block-theme-development/theming-woo-blocks)をご覧ください。

## エクステンション足場

### @woocommerce/create-woo-extension

[Create Woo Extension](https://github.com/woocommerce/woocommerce/tree/trunk/packages/js/create-woo-extension/) は NPX コマンドで、WooCommerce エクステンション全体をあなたのストアのために雛形化します。生成されたエクステンションは WooCommerce Admin と統合するReactベースの設定ページを追加します。また、PHP と Javascript のユニットテスト、リンティング、WooCommerce と WordPress の Prettier IDE 設定も含まれています。

[create-woo-extension パッケージ](/docs/extensions/getting-started-extensions/building-your-first-extension)を使用したチュートリアルをお読みください。

### @woocommerce/extend-cart-checkout-block

これは`@wordpress/create-block`と一緒に使用するテンプレートで、WooCommerce Blocks エクステンションのスタートポイントを作成します。インストールして使用するには、[`@woocommerce/extend-cart-checkout-block`](https://github.com/woocommerce/woocommerce/tree/trunk/packages/js/extend-cart-checkout-block/)の指示に従ってください。この例には、インナーブロックだけでなく、他の複数の拡張性の例が含まれていることに注意してください。

### WooCommerce admin 拡張機能の例

WooCommerce プラグインの内部には、WooCommerce のコア機能を変更するためのさまざまな使用例を紹介する一連の拡張機能があります。例えば、カスタムレポートの追加、カスタム支払いゲートウェイ、WooCommerce ダッシュボードの変更などです。

[WooCommerce の分析レポートを拡張する方法](/docs/features/analytics/extending-woocommerce-admin-reports)を紹介するチュートリアルをお読みください。

## 関連する WordPress の足場

### デフォルトの WordPress テーマ

デフォルトの WordPress テーマ（この記事を書いている時点では Twenty-Twenty Five）は、WordPress ブロックテーマのベストプラクティスと標準的な規約を見るのに最適な場所です。Create Block Theme ツールを使えば、サイトエディターからテーマのデザインを変更し、新しいデザインをカスタム子テーマにエクスポートすることができます。

### Wordpress/create-block

WordPress にコンテンツやデザイン要素を追加する場合、カスタムブロックを作成することは理にかなっているかもしれません。WordPress のブロックエディタパッケージライブラリには、WordPress Create Block という足場ツールが含まれており、任意のページやテンプレートに挿入できるカスタムブロックを作成するのに役立ちます。

[`wordpress/create-block` パッケージ](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/)についてもっと読む。

## サンプル店舗データ

### コアプラグインサンプルデータ

ローカルストアにサンプルデータを読み込むと便利です。WooCommerce コアプラグインには、WordPress 管理画面またはWC-CLI 経由で WooCommerce に直接インポートできる CSV ファイルと XML ファイルがあります。サンプルデータは [`/plugins/woocommerce/sample-data/`](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/sample-data) にあります。

### スムース・ジェネレーター

より高度なテストには、サンプル顧客と注文データが必要かもしれません。[Smooth Generator](https://github.com/woocommerce/wc-smooth-generator) は、テスト用の WooCommerce 関連データを生成するのに役立つプラグインです。基本的な操作には WP Admin インターフェイスを使用し、より高度な機能には CLI ツールを使用します。[リリースページ](https://github.com/woocommerce/wc-smooth-generator/releases)から最新版をダウンロードしてインストールし、リポジトリのドキュメントを参照してください。
