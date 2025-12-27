---
post_title: CSS styling for themes
sidebar_label: CSS styling for themes
---
# テーマのCSSスタイル

## ブロックとコンポーネントのクラス名

> 重要
> 私たちは、既存のブロック・クラス名に基づいてCSSコードを記述することを強く禁じ、可能な限りグローバル・スタイルを使用することを優先します。特に、特定のブロックが別のブロックの子孫であることに依存する CSS セレクタを記述することはお勧めしません。ユーザーがブロックを自由に移動できるため、壊れやすいからです。WordPress 自体と同様に、コンポーネント、ブロック、ブロックテンプレート内の HTML 構造は「プライベート」であり、将来さらに変更される可能性があると考えています。したがって、CSS を使用してブロックやブロックテンプレートの内部をターゲットにすることは推奨されませんし、サポートされません。

WooCommerce Blocksは[コーディングガイドラインに記載されている](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/contributors/coding-guidelines.md)ように、クラス名をBEMに従っています。すべてのクラスはこれら2つの接頭辞のいずれかで始まります：

-   `.wc-block-`：単一のブロックに固有のクラス名。
-   `.wc-block-components-`: コンポーネントに固有のクラス名。このコンポーネントは、異なるブロックで再利用されるかもしれない。

ブロッククラス名とコンポーネントクラス名の組み合わせにより、各コンポーネントをグローバルに、または特定のブロックでのみスタイル設定することができます。例として、すべての価格をイタリック体にするには、次のようにします：

```css
/* This will apply to all block prices */
.wc-block-components-formatted-money-amount {
	font-style: italic;
}
```

しかし、チェックアウト・ブロックの中でだけ斜体にしたいのであれば、ブロック・セレクタを追加すれば可能だ：

```css
/* This will apply to prices in the checkout block */
.wc-block-checkout .wc-block-components-formatted-money-amount {
	font-style: italic;
}
```

**注意:** 後方互換性のために、いくつかのコンポーネントは両方の接頭辞を持つクラス名を持つかもしれません (例: `wc-block-sort-select` と `wc-block-components-sort-select`) 。このような場合、`.wc-block-`接頭辞を持つクラス名は非推奨であり、新しいコードでは使用しないでください。将来のバージョンでは削除される予定です。要素が両方のクラスを持つ場合は、常に`.wc-block-components-`接頭辞を持つ方をスタイルしてください。

## コンテナクエリークラス名

私たちのコンポーネントの中には、コンテナの幅に応じたレスポンシブ・クラスを持っているものがあります。CSSメディアクエリの代わりにこれらのクラスを使用する理由は、ブロックが追加されたコンテナに適応するためです（CSSメディアクエリはビューポートサイズにしか対応できません）。

そのクラスとは

| コンテナ幅
| --------------- | ----------- |
| | 521px-700px | `is-large` |
| 521px-700px | `is-medium`
| 401px-520px | `is-small`
| | 401px-520px | `wc-block-sort-select`

例として、コンテナの幅が521px以上のときに、チェックアウトのフォントサイズを10％大きくしたい場合は、次のようなコードになります：

```css
.wc-block-checkout.is-medium,
.wc-block-checkout.is-large {
	font-size: 1.1em;
}
```

### カートブロックとチェックアウトブロックの CSS コンテナクエリ

WooCommerceはカートとチェックアウトブロックのトップレベルラッパーをCSSコンテナとして定義しています。これらのコンテナは`container-type: inline-size`を使用します：

```css
.wp-block-woocommerce-checkout {
	container-type: inline-size;
}
```

開発者は、CSS コンテナクエリ (`@container`) を使用して、親コンポーネントの幅に基づいて子コンポーネントのスタイルを設定できます。レガシー・クラスは後方互換性のためにそのまま残りますが、よりすっきりとしたスタイリングとレイアウトのずれを少なくするために、コンテナ・アプローチを使用することをお勧めします。

**注意:** コンテナ・クエリは、チェックアウト・ブロックのラッパーとスタイリングされる要素の間に別のコンテナがない限り動作します。テーマやプラグインで追加の CSS コンテナを定義している場合、コンテナクエリの動作に干渉する可能性があります。

以前、`.is-large`、`.is-medium`、`.is-small`、`.is-mobile`のようなクラスによって定義されたのと同じ幅のブレークポイントをターゲットにするための便利なヘルパーとして、SCSSミキシンが用意されています。これらのミキシンを使用することで、コンテナの幅に基づいて、カート・ブロックとチェックアウト・ブロック内のインナー・コンテンツのスタイルを簡単に設定できるようになります。

```scss
// Before, using JS generated CSS class
.is-large {
	.your-class {
		padding: 2rem;
	}
}

// After, using the container mixin
@include cart-checkout-large-container {
	.your-class {
		padding: 2rem;
	}
}

// After, using pure CSS
@container (min-width: 700px) {
	.your-class {
		padding: 2rem;
	}
}
```

## WC Blocks _vs._ テーマスタイルのセマンティック要素での衝突

WooCommerce BlocksはHTML要素をデフォルトのレイアウトではなく、セマンティックな意味に従って使用します。つまり、アンカーリンク(`<a>`)がボタンとして表示されることもあります。逆に、`<button>`がテキスト・リンクとして表示されることもあります。同様に、見出しは通常のテキストとして表示されるかもしれません。

このような場合、ブロックにはテーマによって導入されたデフォルトスタイルのほとんどを元に戻すためのCSSリセットが含まれています。テキストリンクとして表示される`<button>`は、おそらく背景や枠線などのリセットを持つでしょう。これでほとんどのコンフリクトはすぐに解決しますが、テーマがより高い特異性を持つ特定のCSSセレクタを持っている場合、これらのCSSリセットは効果を持たないことがあります。そのような場合、私たちはテーマ開発者に、ブロックスタイルが優先されるようにセレクタの特異性を下げることを強くお勧めします。

## 隠された要素

WCブロックは、[`hidden` HTML属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) を使用して、UIからいくつかの要素を非表示にします。テーマにブロック要素のCSS表示プロパティ（例： `div { display: block; }`）を調整する一般的なスタイルがある場合は、hidden属性を正しく処理してください：inline_code_2__。

## WooCommerceのレガシークラス (.price、.star-rating、.button...)

WooCommerce Blocksでは、レガシーな接頭辞なしクラスの使用をできるだけ避けています。しかし、後方互換性のために追加されたものもあるかもしれません。他のプラグインやエディタなどとの衝突を避けるためです。
