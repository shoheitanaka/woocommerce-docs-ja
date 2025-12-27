---
post_title: Theming for Woo blocks
sidebar_label: Theming for Woo blocks
---
# ウー・ブロックのテーマ

---

**注意:** ブロックテーマ開発に関する予備知識とWordPressのコンセプトがあることを前提としています。ブロックテーマ開発の全くの初心者の方は、[Develop Your First Low-Code Block Theme](https://learn.wordpress.org/course/develop-your-first-low-code-block-theme/)
をご覧ください。
新しいテーマを作成する準備ができたら、[Create Block Theme plugin](https://wordpress.org/plugins/create-block-theme/) ツールをお試しください。

---

## 一般概念

### ブロックテンプレート

WooCommerceにはデフォルトでいくつかの[ブロックテンプレート](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/templates/templates/blockified)が用意されています。それらは

- 単一製品 (`single-product.html`)
- 製品カタログ (`archive-product.html`)
    - カテゴリー別商品 (`taxonomy-product_cat.html`)
    - タグ別商品 (`taxonomy-product_tag.html`)
    - 属性別商品 (`taxonomy-product_attribute.html`)
- 製品検索結果 (`product-search-results.html`)
- ページ近日公開予定 (`page-coming-soon.html`)
- ページ (`page-coming-soon.html`)カート (`page-cart.html`)
- ページ：カート (`page-cart.html`)チェックアウト (`page-checkout.html`)
- 注文確認 (`order-confirmation.html`)

ブロックテーマはこれらのテンプレートを以下の方法でカスタマイズできる：

- `/templates`フォルダの下に同じファイル名のファイルを作成することで、テンプレートを上書きすることができます。例えば、ブロックテーマに`wp-content/themes/yourtheme/templates/single-product.html`テンプレートが含まれている場合、WooCommerceデフォルトのSingle Productテンプレートよりも優先されます。
- Product by Category、Products by Tag、Products by AttributeテンプレートはProduct Catalogテンプレートにフォールバックします。言い換えると、テーマが`archive-product.html`テンプレートを提供し、`taxonomy-product_cat.html`テンプレートを提供しない場合、Products by Categoryテンプレートは`archive-product.html`テンプレートを使用します。タグ別商品テンプレートと属性別商品テンプレートも同様です。
- 特定の商品やタクソノミ用のテンプレートを作成することも可能です。たとえば、テーマが`single-product-cap.html`というファイル名のテンプレートを提供する場合、`cap`というスラッグの商品をレンダリングするときにそのテンプレートが使用されます。同様に、テーマは特定のタクソノミー・テンプレートを提供できます：`taxonomy-product_cat-clothing.html`はスラッグ`clothing`の商品カテゴリーで使用されます。
- ユーザーはサイトエディターを使ってテーマが提供するテンプレートを変更できることを常に念頭に置いてください。

### ブロックテンプレート部品

WooCommerceには2つの特定の[ブロックテンプレート部品](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/templates/parts)も付属しています：

- ミニカート (`mini-cart.html`)：ミニカートブロックドロワー内で使用されます。
- チェックアウトヘッダー (`checkout-header.html`)：チェックアウトテンプレートのヘッダーとして使用されます。

テンプレートと同様に、`/parts`フォルダの下に同じファイル名のファイルを追加することで、テーマで上書きすることができます。

### グローバルスタイル

WooCommerceブロックは[グローバルスタイル](https://developer.wordpress.org/themes/global-settings-and-styles/styles/)に依存します。グローバルスタイルはテーマによって`theme.json`で定義されるか、ユーザによって外観 > エディタ > スタイルで定義されます：

- 必要なCSSだけがページに印刷されるため、ページをレンダリングするためのバンドルサイズが小さくなり、パフォーマンスが向上します。
- ユーザーがUIから簡単にカスタマイズできる。
- プラグインやテーマ間のコンフリクトを優雅に処理します。
- 個々のブロックやコンポーネントへのマークアップやクラス名の更新の影響を受けません。
- ブロックの特定の入れ子順序に依存しない。スタイルが崩れることなく、ユーザーが自由にブロックを移動できる。

#### 例

例えば、テーマを作成していて、商品価格ブロックのスタイルをカスタマイズしたいとします：

```JSON
"styles": {
	"blocks": {
		"woocommerce/product-price": {
			"color": {
				"background": "#00cc00",
				"text": "#fff"
			},
			"typography": {
				"fontStyle": "italic",
				"fontWeight": "700"
			}
		}
		...
	}
	...
}
```

ビフォア｜アフター
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img src="https://github.com/woocommerce/woocommerce/assets/3616980/fbc11b83-f47b-4b25-bdeb-df798b251cce" width="210" alt="Product Collection block showing the Product Price block with default styles" /> | <img src="https://github.com/woocommerce/woocommerce/assets/3616980/c9730445-b9df-4e96-8204-a10896ac2c5a" width="210" alt="Product Collection block showing the Product Price styled with background and text colors and italic and bold typography" /> <!-- markdownlint-disable-line no-inline-html -->

developer.wordpress.orgに[グローバルスタイルのドキュメント](https://developer.wordpress.org/themes/global-settings-and-styles/styles/)があります。また、[ドキュメント内のWooCommerceブロックとその名前のリスト](/docs/block-development/reference/block-references)もあります。
