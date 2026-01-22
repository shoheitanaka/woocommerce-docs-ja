---
sidebar_label: Available Hooks and Filters
category_slug: cart-and-checkout-available-filters
post_title: Cart and Checkout - Available Filters
---

# Available Filters

このドキュメントでは、現在エクステンションで利用可能なフィルタの一覧と、それぞれのフィルタの使用法について説明します。フィルタの登録に関する情報は、[チェックアウト - フィルタ登録](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/packages/checkout/filter-registry/README.md) ページにあります。

## カートラインアイテムフィルター

以下の[Cart Line Items filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/cart-line-items/)が利用可能です：

-   `cartItemClass`
-   `cartItemPrice`
-   `itemName`
-   `saleBadgePriceFormat`
-   ラインコード
-   インラインコード5

以下のスクリーンショットは、個々のフィルターがどの部分に影響するかを示しています：

![Cart Line Items](https://woocommerce.com/wp-content/uploads/2023/10/Screenshot-2023-10-26-at-13.12.33.png)

## オーダー概要項目フィルター

以下の[オーダーサマリーアイテムフィルター](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/order-summary-items/)が利用可能です：

-   `cartItemClass`
-   `cartItemPrice`
-   `itemName`
-   `subtotalPriceFormat`

以下のスクリーンショットは、個々のフィルターがどの部分に影響するかを示しています：

![Order Summary Items](https://woocommerce.com/wp-content/uploads/2023/10/Screenshot-2023-10-26-at-16.29.45.png)

## フッターアイテムフィルター

以下の[Totals Footer Item filter](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/totals-footer-item/)が利用可能です：

-   `totalLabel`
-   `totalValue`。

## チェックアウトと注文ボタンのフィルター

以下の[レジ・注文ボタンフィルター](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/checkout-and-place-order-button/)が利用可能です：

-   `proceedToCheckoutButtonLabel`
-   `proceedToCheckoutButtonLink`
-   `placeOrderButtonLabel`

## クーポンフィルター

以下の[クーポンフィルター](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/coupons/)が利用可能です：

-   `coupons`
-   `showApplyCouponNotice`
-   `showRemoveCouponNotice`

## カートとチェックアウトの内部ブロックの追加タイプフィルター

以下の[追加カート・チェックアウトインナーブロックタイプフィルター](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/additional-cart-checkout-inner-block-types/)が利用可能です：

-   `additionalCartCheckoutInnerBlockTypes`。

## 複合フィルター

フィルターは組み合わせることもできる。次の例は、利用可能なフィルターのいくつかを組み合わせる方法を示しています。

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const isOrderSummaryContext = ( args ) => args?.context === 'summary';

const modifyCartItemClass = ( defaultValue, extensions, args ) => {
	if ( isOrderSummaryContext( args ) ) {
		return 'my-custom-class';
	}
	return defaultValue;
};

const modifyCartItemPrice = ( defaultValue, extensions, args ) => {
	if ( isOrderSummaryContext( args ) ) {
		return '<price/> for all items';
	}
	return defaultValue;
};

const modifyItemName = ( defaultValue, extensions, args ) => {
	if ( isOrderSummaryContext( args ) ) {
		return `${ defaultValue }`;
	}
	return defaultValue;
};

const modifySubtotalPriceFormat = ( defaultValue, extensions, args ) => {
	if ( isOrderSummaryContext( args ) ) {
		return '<price/> per item';
	}
	return defaultValue;
};

registerCheckoutFilters( 'example-extension', {
	cartItemClass: modifyCartItemClass,
	cartItemPrice: modifyCartItemPrice,
	itemName: modifyItemName,
	subtotalPriceFormat: modifySubtotalPriceFormat,
} );
```

## トラブルシューティング

管理者としてストアにログインしている場合、フィルターが正しく動作していないと、このようなエラーが表示されます。
エラーが表示されます。このエラーはコンソールにも表示されます。

![Troubleshooting](https://woocommerce.com/wp-content/uploads/2023/10/Screenshot-2023-10-30-at-10.52.53.png)
