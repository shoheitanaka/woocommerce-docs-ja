---
post_title: Available slots
sidebar_label: Available slots
sidebar_position: 2
---
# 利用可能なスロット

このドキュメントでは、カスタムコンテンツ（フィル）を追加するために使用できるスロットのリストを示します。

新しいSlotFillコンポーネントを追加したい場合は、[Checkout - Slot Fill document](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/packages/checkout/slot/README.md)をチェックしてください。スロットとフィルについての詳細は、[スロットとフィルのドキュメント](/docs/block-development/reference/slot-fills/)をご覧ください。

**ネーミングについての注意事項： ** `Experimental`がプレフィックスとして付いているスロットは実験的なものであり、変更または削除される可能性があります。実験的な段階から卒業すると、ネーミングが変更され、`Experimental`の接頭辞は削除されます。詳しくは[Feature Gating document](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/internal-developers/blocks/feature-flags-and-experimental-interfaces.md)をご覧ください。

## ExperimentalOrderMeta

このスロットはチェックアウトのサマリーセクションの下、カートの「チェックアウトに進む」ボタンの上に表示されます。

```ts
const { __ } = window.wp.i18n;
const { registerPlugin } = window.wp.plugins;
const { ExperimentalOrderMeta } = window.wc.blocksCheckout;

const render = () => {
	return (
		<ExperimentalOrderMeta>
			<div class="wc-block-components-totals-wrapper">
				{ __( 'Yearly recurring total ...', 'YOUR-TEXTDOMAIN' ) }
			</div>
		</ExperimentalOrderMeta>
	);
};

registerPlugin( 'slot-and-fill-examples', {
	render,
	scope: 'woocommerce-checkout',
} );
```

Cart:

![カートブロック内のExperimentalOrderMetaの例](https://user-images.githubusercontent.com/1628454/154517779-117bb4e4-568e-413c-904c-855fc3450dfa.png)

Checkout:

![チェックアウト・ブロック内のExperimentalOrderMetaの例](https://user-images.githubusercontent.com/1628454/154697224-de245182-6783-4914-81ba-1dbcf77292eb.png)

### パラメーター

-   `cart`：`wc/store/cart`のデータが、`snake_case`ではなく`camelCase`になっている。[オブジェクトの内訳](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/c00da597efe4c16fcf5481c213d8052ec5df3766/assets/js/type-defs/cart.ts#L172-L188)
-   `extensions`：サードパーティの開発者が`ExtendSchema`を使用して登録した外部データ。もしあなたが`wc/store/cart`で`ExtendSchema`を使用した場合、あなたのネームスペースの下にあるデータはここにあります。
-   `context`は、塗りつぶしがレンダリングされるブロックの名前に等しい：`woocommerce/cart`または`woocommerce/checkout`。

## 実験的注文出荷パッケージ

このスロットはチェックアウトの配送ステップ内とカートの配送オプション内に表示されます。

```ts
const { __ } = window.wp.i18n;
const { registerPlugin } = window.wp.plugins;
const { ExperimentalOrderShippingPackages } = window.wc.blocksCheckout;

const render = () => {
	return (
		<ExperimentalOrderShippingPackages>
			<div>{ __( 'Express Shipping', 'YOUR-TEXTDOMAIN' ) }</div>
		</ExperimentalOrderShippingPackages>
	);
};

registerPlugin( 'slot-and-fill-examples', {
	render,
	scope: 'woocommerce-checkout',
} );
```

Cart:

![カートブロック内のExperimentalOrderShippingPackagesの例](https://user-images.githubusercontent.com/6165348/118399054-2b4dec80-b653-11eb-94a0-989e2e6e362a.png)

Checkout:

![チェックアウト・ブロック内のExperimentalOrderShippingPackagesの例](https://user-images.githubusercontent.com/6165348/118399133-90094700-b653-11eb-8ff0-c917947c199f.png)

### パラメーター

-   `collapsible`：`Boolean|undefined` 配送パッケージパネルが折りたたみ可能かどうか、これはCheckoutではfalse、Cartでは未定義です。
-   `collapse`：`Boolean` パネルをデフォルトで折りたたむかどうか。
-   これは、パネルが折りたたみ可能な場合に真となります：`Boolean|undefined` 各パッケージの内容を表示するかどうか。これはCartとCheckoutでは未定義で、実際のパッケージロジックに任されています。
-   `noResultsMessage`：配送オプションがない場合にレンダリングするReact要素。
-   `renderOption`: 料金オブジェクトを受け取り、レンダーオプションを返すレンダー関数。
-   `cart`：`wc/store/cart`のデータですが、`snake_case`の代わりに`camelCase`です。[オブジェクトの内訳](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/c00da597efe4c16fcf5481c213d8052ec5df3766/assets/js/type-defs/cart.ts#L172-L188)
-   `extensions`：サードパーティの開発者が`ExtendSchema`を使用して登録した外部データで、`wc/store/cart`で`ExtendSchema`を使用した場合は、ここにある名前空間の下にデータがあります。
-   `components`: 独自の配送料金をレンダリングするために使用できるコンポーネントを含むオブジェクトで、`ShippingRatesControlPackage`が含まれています。
-   `context`: 塗りつぶしがレンダリングされるブロックの名前です：`woocommerce/cart`または`woocommerce/checkout`。

## ExperimentalOrderLocalPickupPackages

このスロットはチェックアウトブロック内のチェックアウトピックアップオプションブロック内でレンダリングされます。カートブロックではレンダリングされません。

```ts
const { __ } = window.wp.i18n;
const { registerPlugin } = window.wp.plugins;
const { ExperimentalOrderLocalPickupPackages } = window.wc.blocksCheckout;

const render = () => {
	return (
		<ExperimentalOrderLocalPickupPackages>
			<div>
				{ __(
					'By using our convenient local pickup option, you can come to our store and pick up your order. We will send you and email when your order is ready for pickup.',
					'YOUR-TEXTDOMAIN'
				) }
			</div>
		</ExperimentalOrderLocalPickupPackages>
	);
};

registerPlugin( 'slot-and-fill-examples', {
	render,
	scope: 'woocommerce-checkout',
} );
```

Checkout:

![チェックアウト・ブロック内のExperimentalOrderLocalPickupPackagesの例](https://user-images.githubusercontent.com/5656702/222814945-a449d016-0621-4a70-b0f4-2ae1ce6487f1.png)

### パラメーター

-   `renderPickupLocation`: 現地ピックアップオプションの住所の詳細をレンダリングするレンダー関数。
-   `cart`：`wc/store/cart`のデータですが、`snake_case`の代わりに`camelCase`です。[オブジェクトの内訳](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/c00da597efe4c16fcf5481c213d8052ec5df3766/assets/js/type-defs/cart.ts#L172-L188)
-   `extensions`：サードパーティの開発者が`ExtendSchema`を使用して登録した外部データで、`wc/store/cart`で`ExtendSchema`を使用した場合は、ここに名前空間のデータがあります。
-   `components`：独自のピックアップ・レートをレンダリングするために使用できるコンポーネントを含むオブジェクトで、`ShippingRatesControlPackage`と`RadioControl`が含まれます。

## ExperimentalDiscountsMeta

このスロットは`CouponCode`入力の下にレンダリングされる。

```ts
const { __ } = window.wp.i18n;
const { registerPlugin } = window.wp.plugins;
const { ExperimentalDiscountsMeta } = window.wc.blocksCheckout;

const render = () => {
	return (
		<ExperimentalDiscountsMeta>
			<div class="wc-block-components-totals-wrapper">
				{ __( 'You have 98683 coins to spend ...', 'YOUR-TEXTDOMAIN' ) }
			</div>
		</ExperimentalDiscountsMeta>
	);
};

registerPlugin( 'slot-and-fill-examples', {
	render,
	scope: 'woocommerce-checkout',
} );
```

Cart:

![ExperimentalDiscountsMetaロケーションを表示するカート](https://user-images.githubusercontent.com/5656702/122774218-ea27a880-d2a0-11eb-9450-11f119567f26.png)

Checkout:

![ExperimentalDiscountsMetaロケーションを表示するチェックアウト](https://user-images.githubusercontent.com/5656702/122779606-efd3bd00-d2a5-11eb-8c84-6525eca5d704.png)

### パラメーター

-   `cart`：`wc/store/cart`のデータが、`snake_case`ではなく`camelCase`になっている。[オブジェクトの内訳](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/c00da597efe4c16fcf5481c213d8052ec5df3766/assets/js/type-defs/cart.ts#L172-L188)
-   `extensions`：サードパーティの開発者が`ExtendSchema`を使用して登録した外部データで、`wc/store/cart`で`ExtendSchema`を使用した場合は、ここに名前空間のデータがあります。
-   `context`、塗りつぶしがレンダリングされるブロックの名前に等しい：`woocommerce/cart`または`woocommerce/checkout`。
