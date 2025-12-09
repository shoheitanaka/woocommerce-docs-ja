---
post_title: CSS styling for themes
sidebar_label: CSS styling for themes
---

# CSS styling for themes

## Block and component class names

&gt; 重要
&gt; 私たちは、既存のブロック・クラス名に基づいてCSSコードを記述することを強く禁じ、可能な限りグローバル・スタイルを使用することを優先します。特に、特定のブロックが別のブロックの子孫であることに依存する CSS セレクタを記述することはお勧めしません。ユーザーがブロックを自由に移動できるため、壊れやすいからです。WordPress 自体と同様に、コンポーネント、ブロック、ブロックテンプレート内の HTML 構造は「プライベート」であり、将来さらに変更される可能性があると考えています。したがって、CSS を使用してブロックやブロックテンプレートの内部をターゲットにすることは推奨されませんし、サポートされません。

WooCommerce Blocks follows BEM for class names, as [stated in our coding guidelines](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/contributors/coding-guidelines.md). All classes start with one of these two prefixes:

-   `.wc-block-`: class names specific to a single block.
-   `.wc-block-components-`: class names specific to a component. The component might be reused by different blocks.

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

**Note:** for backwards compatibility, some components might have class names with both prefixes (ie: `wc-block-sort-select` and `wc-block-components-sort-select`). In those cases, the class name with `.wc-block-` prefix is deprecated and shouldn't be used in new code. It will be removed in future versions. If an element has both classes always style the one with `.wc-block-components-` prefix.

## Container query class names

私たちのコンポーネントの中には、コンテナの幅に応じたレスポンシブ・クラスを持っているものがあります。CSSメディアクエリの代わりにこれらのクラスを使用する理由は、ブロックが追加されたコンテナに適応するためです（CSSメディアクエリはビューポートサイズにしか対応できません）。

そのクラスとは

| Container width | Class name  |
| --------------- | ----------- |
| \>700px         | `is-large`  |
| 521px-700px     | `is-medium` |
| 401px-520px     | `is-small`  |
| \<=400px        | `is-mobile` |

例として、コンテナの幅が521px以上のときに、チェックアウトのフォントサイズを10％大きくしたい場合、次のコードで実現できる：

```css
.wc-block-checkout.is-medium,
.wc-block-checkout.is-large {
	font-size: 1.1em;
}
```

### CSS Container Queries for Cart and Checkout blocks

WooCommerce defines the top-level wrappers of Cart and Checkout blocks as CSS containers. These containers use `container-type: inline-size`:

```css
.wp-block-woocommerce-checkout {
	container-type: inline-size;
}
```

Developers can use CSS Container Queries (`@container`) to style child components based on parent width, eliminating the need for JS-added classes such as `.is-large` which are considered legacy. Legacy classes remain in place for backwards compatibility, but we recommend using the container approach for cleaner styling and fewer layout shifts.

**注意:** コンテナ・クエリは、チェックアウト・ブロックのラッパーとスタイリングされる要素の間に別のコンテナがない限り動作します。テーマやプラグインで追加の CSS コンテナを定義している場合、コンテナクエリの動作に干渉する可能性があります。

There are SCSS mixins available as convenient helpers for targeting the same width breakpoints previously defined by classes like `.is-large`, `.is-medium`, `.is-small` and `.is-mobile`. These mixins make it easier to style inner content within the Cart and Checkout blocks based on the container width.

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

## WC Blocks _vs._ theme style conflicts for semantic elements

WooCommerce Blocks uses HTML elements according to their semantic meaning, not their default layout. That means that some times blocks might use an anchor link (`<a>`) but display it as a button. Or the other way around, a `<button>` might be displayed as a text link. Similarly, headings might be displayed as regular text.

In these cases, Blocks include some CSS resets to undo most default styles introduced by themes. A `<button>` that is displayed as a text link will probably have resets for the background, border, etc. That will solve most conflicts out-of-the-box but in some occasions those CSS resets might not have effect if the theme has a specific CSS selector with higher specificity. When that happens, we really encourage theme developers to decrease their selectors specificity so Blocks styles have preference, if that's not possible, themes can write CSS resets on top.

## Hidden elements

WC Blocks use the [`hidden` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) to hide some elements from the UI so they are not displayed in screens neither read by assistive technologies. If your theme has some generic styles that tweak the CSS display property of blocks elements (ie: `div { display: block; }`), make sure you correctly handle the hidden attribute: `div[hidden] { display: none; }`.

## Legacy classes from WooCommerce (.price, .star-rating, .button...)

WooCommerce Blocksでは、レガシーな接頭辞なしクラスの使用をできるだけ避けています。しかし、後方互換性のために追加されたものもあるかもしれません。他のプラグインやエディタなどとの衝突を避けるためです。
