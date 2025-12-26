---
post_title: Slot and fill
sidebar_label: Slot and fill
---
# スロットとフィル

## 問題

ストアAPI](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-add-data.md)にカスタムデータを追加しました。Checkout filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を使用して、いくつかの文字列を変更しました。ここで、カートとチェックアウトの特定の場所に独自のコンポーネントをレンダリングしたいとします。

## 解決策

SlotとFillは、カートとチェックアウトのあらかじめ定義された場所に独自のHTMLをレンダリングする可能性を追加するコンポーネントのペアです。あなたのコンポーネントはコンテキストデータにアクセスし、必要に応じて再レンダリングされます。

スロットとは、カートとチェックアウトの中にある、不特定多数の外部コンポーネントを表示できる場所のことです。

Fill_は、_Slot_の中にレンダリングするためにサードパーティの開発者によって提供されるコンポーネントです。

SlotとFillはWordPressのAPIを使用しており、その仕組みについては[SlotとFillのドキュメント](https://github.com/WordPress/gutenberg/tree/trunk/packages/components/src/slot-fill)をご覧ください。

## 基本的な使い方

`ExperimentalOrderMeta`は、カートブロックとチェックアウトブロックのオーダーサマリーセクションの下のスロットにレンダリングされるフィルです。
`ExperimentalOrderMeta`は自動的にトップレベルの子にpropsを渡します：

-   カートデータを格納する`cart`。
-   `wc/store/cart`エンドポイントに`ExtendSchema::class`で登録されたデータを含む`extensions`。
-   塗りつぶしがレンダリングされるブロックの名前に等しい `context`INLINE_CODE_5__または`woocommerce/checkout`です。

```jsx
const { registerPlugin } = wp.plugins;
const { ExperimentalOrderMeta } = wc.blocksCheckout;

const MyCustomComponent = ( { cart, extensions } ) => {
	return <div className="my-component">Hello WooCommerce</div>;
};

const render = () => {
	return (
		<ExperimentalOrderMeta>
			<MyCustomComponent />
		</ExperimentalOrderMeta>
	);
};

registerPlugin( 'my-plugin-namespace', {
	render,
	scope: 'woocommerce-checkout',
} );
```

## registerPlugin

上の例では、`registerPlugin`を使用しています。このプラグインはコンポーネントを受け取ってレンダリングしますが、それを表示することはできません。SlotFillの部分は、実際に正しい場所に表示させる役割を担っています。

`registerPlugin`を使用して、プラグインの名前空間、コンポーネントの`render`、そして`registerPlugin`のスコープを入力します。scopeの値は常に`woocommerce-checkout`でなければなりません。

## 必要条件

この機能を使用するには、カートとチェックアウトの後にスクリプトをキューに入れる必要があります。スクリプトをキューに入れる方法については、[IntegrationInterface](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/50f9b3e8d012f425d318908cc13d9c601d97bd68/docs/extensibility/integration-interface.md) のドキュメントを参照してください。
