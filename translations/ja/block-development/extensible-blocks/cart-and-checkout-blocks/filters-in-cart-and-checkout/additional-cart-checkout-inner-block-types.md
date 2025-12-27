---
post_title: Inner block types
sidebar_label: Inner block types
---

# Inner block types

以下の追加カートおよびチェックアウト内部ブロックタイプフィルタが利用可能です：

-   `additionalCartCheckoutInnerBlockTypes`。

## `additionalCartCheckoutInnerBlockTypes`

### 説明

カート・ブロックとレジ・ブロックは内部ブロックで構成されています。これらの内部ブロック・エリアでは、特定のブロック・タイプを子として追加することができます。デフォルトでは、`core/paragraph`、`core/image`、`core/separator`のみが追加可能です。

`additionalCartCheckoutInnerBlockTypes`フィルタを使うことで、この配列に項目を追加し、エディタが内部ブロックに書き込める内容を制御することができる。

このフィルターは各内部ブロック領域に対して1回ずつ呼び出されるため、どのブロックをどこに追加するかを非常に細かく決定することができる。

### パラメーター

-   defaultValue_ `array` (default: `[]`) - フィルタのデフォルト値。
-   __extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   block_ `string` - 内部ブロック領域のブロック名。
-   validation_ `boolean` または `Error` - 返された値が文字列の配列であるかどうかをチェックします。エラーが発生した場合はスローされます。

### リターン

-   `array` - 対応する内部ブロック領域で許可されるブロックタイプを表す修正された配列。

### コード例

エディターがカートとチェックアウトブロックの特定の場所にブロックを追加できるようにしたいとします。

1.カートブロックとチェックアウトブロックの各ブロック領域に`core/quote`を挿入できるようにする。
2.チェックアウトの配送先ブロックに`core/table`を挿入できるようにする。

私たちのエクステンションでは、この2つの条件を満たすフィルタを次のように登録することができる：

```tsx
document.addEventListener( 'DOMContentLoaded', function () {
	const { registerCheckoutFilters } = window.wc.blocksCheckout;

	const modifyAdditionalInnerBlockTypes = (
		defaultValue,
		extensions,
		args,
		validation
	) => {
		defaultValue.push( 'core/quote' );

		if ( args?.block === 'woocommerce/checkout-shipping-address-block' ) {
			defaultValue.push( 'core/table' );
		}

		return defaultValue;
	};

	registerCheckoutFilters( 'example-extension', {
		additionalCartCheckoutInnerBlockTypes: modifyAdditionalInnerBlockTypes,
	} );
} );
```

エディター内でこのフィルターを呼び出すには、フィルター登録を`DOMContentLoaded`イベントリスナーでラップし、コードが管理パネルで実行されるようにします。

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![追加カートとチェックアウトのインナーブロックタイプフィルターを適用する前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/0d4560c8-c2b1-4ed8-8aee-469b248ccb08) |![追加カートとチェックアウトのインナーブロックタイプフィルターを適用した後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/d38cd568-6c8c-4158-9269-d8dffdf66988) |｜｜｜[追加カートとチェックアウトのインナーブロックタイプフィルターを適用した後](__URL_1__)
