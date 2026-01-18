---
post_title: Checkout and place order button
sidebar_label: Checkout and place order button
---

# チェックアウトと注文ボタン

以下のチェックアウトおよび注文ボタンフィルターが利用可能です：

-   `proceedToCheckoutButtonLabel`
-   `proceedToCheckoutButtonLink`
-   `placeOrderButtonLabel`

以下のオブジェクトはフィルター間で共有される：

-   カートオブジェクト
-   カートアイテムオブジェクト

## `proceedToCheckoutButtonLabel`

### 説明 

`proceedToCheckoutButtonLabel`　フィルタは、「チェックアウトに進む」ボタンのラベルを変更することができます。

### パラメーター 

-   _defaultValue_ `string` (デフォルト: `Proceed to Checkout`) - "チェックアウトに進む "ボタンのラベル。
-   _extensions_ `object` (default: `{}`) - 拡張機能オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   _cart_ `object` - [カートオブジェクト](#cart-object)を参照してください。

### リターン 

-   `string` - "チェックアウトに進む "ボタンのラベル。

### コード例 

#### 基本例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyProceedToCheckoutButtonLabel = (
	defaultValue,
	extensions,
	args
) => {
	if ( ! args?.cart.items ) {
		return defaultValue;
	}

	return 'Go to checkout';
};

registerCheckoutFilters( 'example-extension', {
	proceedToCheckoutButtonLabel: modifyProceedToCheckoutButtonLabel,
} );
```

#### 高度な例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyProceedToCheckoutButtonLabel = (
	defaultValue,
	extensions,
	args
) => {
	if ( ! args?.cart.items ) {
		return defaultValue;
	}

	const isSunglassesInCart = args?.cart.items.some(
		( item ) => item.name === 'Sunglasses'
	);

	if ( isSunglassesInCart ) {
		return '😎 Proceed to checkout 😎';
	}

	return defaultValue;
};

registerCheckoutFilters( 'example-extension', {
	proceedToCheckoutButtonLabel: modifyProceedToCheckoutButtonLabel,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット 

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![レジに進むボタンのラベルフィルターを適用する前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/fb0216c1-a091-4d58-b443-f49ccff98ed8) |![商品名フィルターを適用した後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/ef15b6df-fbd7-43e7-a359-b4adfbba961a) |｜...

## `proceedToCheckoutButtonLink`

### 説明 

`proceedToCheckoutButtonLink`フィルタは、「チェックアウトに進む」ボタンのリンクを変更することができます。

### パラメーター 

-   _defaultValue_ `string` (デフォルト: `/checkout`) - "チェックアウトに進む "ボタンのリンク。
-   _extensions_ `object` (default: `{}`) - 拡張機能オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   [カートオブジェクト](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### リターン 

-   `string` - 「チェックアウトに進む」ボタンのリンク。

### コード例 

#### 基本例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyProceedToCheckoutButtonLink = (
	defaultValue,
	extensions,
	args
) => {
	if ( ! args?.cart.items ) {
		return defaultValue;
	}

	return '/custom-checkout';
};

registerCheckoutFilters( 'example-extension', {
	proceedToCheckoutButtonLink: modifyProceedToCheckoutButtonLink,
} );
```

#### 高度な例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyProceedToCheckoutButtonLink = (
	defaultValue,
	extensions,
	args
) => {
	if ( ! args?.cart.items ) {
		return defaultValue;
	}

	const isSunglassesInCart = args?.cart.items.some(
		( item ) => item.name === 'Sunglasses'
	);

	if ( isSunglassesInCart ) {
		return '/custom-checkout';
	}

	return defaultValue;
};

registerCheckoutFilters( 'example-extension', {
	proceedToCheckoutButtonLink: modifyProceedToCheckoutButtonLink,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット 

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|[チェックアウトに進むボタン・リンク・フィルターを適用する前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/3f657e0f-4fcc-4746-a554-64221e071b2e) |![チェックアウトに進むボタン・リンク・フィルターを適用した後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/064df213-439e-4d8f-b29c-55962604cb97) |｜。

## `placeOrderButtonLabel`

### 説明 

`placeOrderButtonLabel`フィルタは、「注文する」ボタンのラベルを変更することができます。

### パラメーター 

-   _defaultValue_ (type: `string`、default: `Place order`) - 「注文する」ボタンのラベル。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。

### リターン 

-   `string` - 「注文する」ボタンのラベル。

### コード例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyPlaceOrderButtonLabel = ( defaultValue, extensions ) => {
	return '😎 Pay now 😎';
};

registerCheckoutFilters( 'example-extension', {
	placeOrderButtonLabel: modifyPlaceOrderButtonLabel,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット 

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![発注ボタンラベルフィルタ適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/aa6d9b65-4d56-45f7-8162-a6bbfe171250) |![発注ボタンラベルフィルタ適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/a5cc2572-16e7-4781-a5ab-5d6cdced2ff6) |｜...

<!-- FEEDBACK -->

## カートオブジェクト

上記のフィルターのCartオブジェクトは以下のキーを持つ：

[-   _billingAddress_ `object` - 以下のキーを持つ請求先住所オブジェクト：
    -   _address_1_ `string` - 住所の1行目。
    -   _address_2_ `string` - 住所の2行目。
    -   _city_ `string` - 住所の都市。
    -   _company_ `string` - 住所の会社。
    -   _country_ `string` - 住所の国。
    -   _email_ `string` - 住所のEメール。
    -   _first_name_ `string` - 住所の姓。
    -   _last_name_ `string` - 住所の姓。
    -   _phone_ `string` - 住所の電話番号。
    -   _postcode_ `string` - 住所の郵便番号。
    -   _state_ `string` - 住所の都道府県。
-   _coupons_ `array` - クーポン配列。
-   _crossSells_ `array` - クロスセルアイテムの配列。
-   _errors_ `array` - エラー配列。
-   _extensions_ `object` (default: `{}`) - extensions オブジェクト。
-   _fee_ `array` - fee 配列。
-   _hasCalculatedShipping_ `boolean` - カートが送料を計算しているかどうか。
-   [カートアイテムオブジェクト](#cart-item-object) を参照ください。
-   _itemsCount_ `number` - カート内のアイテム数。
-   _itemsWeight_ `number` - カートアイテムの総重量。
-   _needsPayment_ `boolean` - カートに支払いが必要かどうか。
-   _needsShipping_ `boolean` - カートに配送が必要かどうか。
-   _paymentMethods_ `array` - 支払い方法の配列。
-   _paymentRequirements_ `array` - 支払い条件の配列。
-   _shippingAddress_ `object` - 請求先住所オブジェクトと同じキーを持つ配送先住所オブジェクト。
-   _shippingRates_ `array` - 配送料金の配列。
-   _totals_ `object` - 以下のキーを持つ合計オブジェクト：
    -   _currency_code_ `string` - 通貨コード。
    -   _currency_decimal_separator_ `string` - 通貨の小数点セパレータ。
    -   _currency_minor_unit_ `number` - 通貨の小単位。
    -   _currency_prefix_ `string` - 通貨のプレフィックス。
    -   _currency_suffix_ `string` - 通貨のサフィックス。
    -   _currency_symbol_ `string` - 通貨記号。
    -   _currency_thousand_separator_ `string` - 通貨の千の区切り文字。
    -   _tax_lines_ `array` - 以下のキーを持つオブジェクトの配列：
        -   _name_ `string` - 税金の名前。
        -   _price_ `string` - 税金の価格。
        -   _rate_ `string` - 税率。
    -   _total_discount_ `string` - 割引総額。
    -   _total_discount_tax_ `string` - 割引税額の合計。
    -   _total_fee_ `string` - 手数料の合計。
    -   _total_fee_tax_ `string` - 料金にかかる税金の合計。
    -   _total_items_ `string` - 項目の合計。
    -   _total_items_tax_ `string` - 合計商品税。
    -   _total_price_ `string` - 合計価格。
    -   _total_shipping_ `string` - 送料の合計。
    -   _total_shipping_tax_ `string` - 配送にかかる税金の合計。
    -   _total_tax_ `string` - 税金の合計。

## カートアイテムオブジェクト

上記のフィルターの Cart Item オブジェクトは以下のキーを持ちます：

-   _backorders_allowed_ `boolean` - バックオーダーを許可するかどうか。
-   _catalog_visibility_ `string` - カタログの表示。
-   _decsription_ `string` - カートアイテムの説明。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _id_ `number` - アイテムID。
-   _images_ `array` - アイテムの画像配列。
-   _item_data_ `array` - アイテムデータの配列。
-   _key_ `string` - アイテムのキー。
-   _low_stock_remaining_ `number` - 残りの在庫数。
-   _name_ `string` - アイテム名。
-   _permalink_ `string` - アイテムのパーマリンク。
-   _prices_ `object` - 以下のキーを持つアイテム価格オブジェクト：
    -   _currency_code_ `string` - 通貨コード。
    -   _currency_decimal_separator_ `string` - 通貨の小数点セパレータ。
    -   _currency_minor_unit_ `number` - 通貨の小単位。
    -   _currency_prefix_ `string` - 通貨のプレフィックス。
    -   _currency_suffix_ `string` - 通貨のサフィックス。
    -   _currency_symbol_ `string` - 通貨記号。
    -   _currency_thousand_separator_ `string` - 通貨の千単位区切り文字。
    -   _price_ `string` - 価格。
    -   _price_range_ `string` - 価格帯。
    -   _raw_prices_ `object` - 以下のキーを持つ生の価格オブジェクト：
        -   _precision_ `number` - 精度。
        -   _price_ `number` - 価格。
        -   _regular_price_ `number` - 通常価格。
        -   _sale_price_ `number` - セール価格。
    -   _regular_price_ `string` - 通常価格。
    -   _sale_price_ `string` - セール価格。
-   _quantity_ `number` - 商品の数量。
-   _quantity_limits_ `object` - 以下のキーを持つ数量制限オブジェクトです：
    -   _editable_ `boolean` - 数量を編集可能かどうか。
    -   _maximum_ `number` - 最大数量。
    -   _minimum_ `number` - 最小量。
    -   _multiple_of_ `number` - 数量の倍数。
-   _short_description_ `string` - 商品の短い説明。
-   _show_backorder_badge_ `boolean` - バックオーダーのバッジを表示するかどうか。
-   _sku_ `string` - 商品のSKU。
-   _sold_individually_ `boolean` - アイテムが個別に販売されているかどうか。
-   _totals_ `object` - 以下のキーを持つ項目の合計オブジェクトです：
    -   _currency_code_ `string` - 通貨コード。
    -   _currency_decimal_separator_ `string` - 通貨の小数点セパレータ。
    -   _currency_minor_unit_ `number` - 通貨の小単位。
    -   _currency_prefix_ `string` - 通貨のプレフィックス。
    -   _currency_suffix_ `string` - 通貨のサフィックス。
    -   _currency_symbol_ `string` - 通貨記号。
    -   _currency_thousand_separator_ `string` - 通貨の千の区切り文字。
    -   _line_subtotal_ `string` - 行の小計。
    -   _line_subtotal_tax_ `string` - 行の小計の税金。
    -   _line_total_ `string` - 行の合計。
    -   _line_total_tax_ `string` - 行の合計税額。
-   _type_ `string` - 商品のタイプ。
-   _variation_ `array` - 項目のバリエーション配列。
