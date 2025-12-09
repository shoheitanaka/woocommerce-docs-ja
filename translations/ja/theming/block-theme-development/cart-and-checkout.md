---
post_title: Cart and Checkout blocks theming
sidebar_label: Cart and Checkout blocks theming
---

# Cart and checkout blocks theming 

&gt; 重要
&gt; 私たちは、既存のブロック・クラス名に基づいてCSSコードを記述することを強く禁じ、可能な限りグローバル・スタイルを使用することを優先します。特に、特定のブロックが別のブロックの子孫であることに依存する CSS セレクタを記述することはお勧めしません。ユーザーがブロックを自由に移動できるため、壊れやすいからです。WordPress 自体と同様に、コンポーネント、ブロック、ブロックテンプレート内の HTML 構造は「プライベート」であり、将来さらに変更される可能性があると考えています。したがって、CSS を使用してブロックやブロックテンプレートの内部をターゲットにすることは推奨されませんし、サポートされません。


## Buttons

WC Blocks introduces the button component, it differs from a generic `button` in that it has some default styles to make it correctly fit in the Blocks design.

![Button screenshot](https://user-images.githubusercontent.com/3616980/86381945-e6fd6c00-bc8d-11ea-8811-7e546bea69b9.png)

テーマは、以下のように、テーマの色やスタイルにマッチするようにスタイルを設定することができる：

```css
.wc-block-components-button {
	background-color: #d5502f;
	color: #fff;
	/* More rules can be added to modify the border, shadow, etc. */
}
/* It might be needed to modify the hover, focus, active and disabled states too */
```

![Button screenshot with custom styles](https://user-images.githubusercontent.com/3616980/86381505-b6b5cd80-bc8d-11ea-8ceb-cfbe84b411d4.png)

Notice the button component doesn't have the `.button` class name. So themes that wrote some styles for buttons might want to apply some (or all) of those styles to the button component as well.

## Mobile submit container

小さなビューポートでは、カートブロックは画面下部に固定されたコンテナ内に_Proceed to Checkout_ボタンを表示します。

![Submit container screenshot](https://user-images.githubusercontent.com/3616980/86382876-393e8d00-bc8e-11ea-8d0b-e4e347ea4773.png)

デフォルトでは、コンテナの背景は白なので、ボタンコンポーネントのデフォルトカラーとうまく調和します。ページの他の部分と同じ背景色を適用したいテーマは、次のコード・スニペットでそれを行うことができます：

```css
.wc-block-cart__submit-container {
	background-color: #f9f4ee;
}
```

Take into consideration the container has a top box shadow that might not play well with some dark background colors. If needed, it can be modified directly setting the `color` property (internally, shadow color uses `currentColor`, so it honors the `color` property):

```css
.wc-block-cart__submit-container::before {
	color: rgba( 214, 209, 203, 0.5 );
}
```

Alternatively, themes can override the `box-shadow` property completely:

```css
.wc-block-cart__submit-container::before {
	box-shadow: 0 -10px 20px 10px rgba( 214, 209, 203, 0.5 );
}
```

![Submit container screenshot with custom styles](https://user-images.githubusercontent.com/3616980/86382693-27f58080-bc8e-11ea-894e-de378af3e2bb.png)

## Item quantity badge

商品の数量バッジは、_Checkout_ブロックのサイドバーの_Order summary_セクションの画像の横に表示される数字です。

![Order summary screenshot](https://user-images.githubusercontent.com/3616980/83862844-c8559500-a722-11ea-9653-2fc8bcd544d2.png)

デフォルトでは、黒と白のボーダーとシャドウの組み合わせを使っているので、背景が明るいテーマや暗いテーマと十分なコントラストがあります。テーマは、1つのCSSセレクタと4つのプロパティを使って、独自のパレットで色を変更できます。例えば

```css
.wc-block-components-order-summary-item__quantity {
	background-color: #f9f4ee;
	border-color: #4b3918;
	box-shadow: 0 0 0 2px #f9f4ee;
	color: #4b3918;
}
```

![Order summary screenshot with custom styles for the item quantity badge](https://user-images.githubusercontent.com/3616980/83863109-2e421c80-a723-11ea-9bf7-2033a96cf5b2.png)



