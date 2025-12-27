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

`proceedToCheckoutButtonLabel`フィルタは、「チェックアウトに進む」ボタンのラベルを変更することができます。

### パラメーター 

-   _defaultValue_ `string` (デフォルト: `Proceed to Checkout`) - "チェックアウトに進む "ボタンのラベル。
-   __extensions_ `object` (default: `{}`) - 拡張機能オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   cart_ `object` - [カートオブジェクト](#cart-object)を参照してください。

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

[-   _defaultValue_ `string` (デフォルト: `/checkout`) - "チェックアウトに進む "ボタンのリンク。
-   __extensions_ `object` (default: `{}`) - 拡張機能オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   カートオブジェクト](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

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
-   extensions_ `object` (default: `{}`) - 拡張オブジェクト。

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
    -   address_1_ `string` - 住所の1行目。
    -   _address_2_ `string` - 住所の2行目。
    -   city_ `string` - 住所の都市。
    -   company_ `string` - 住所の会社。
    -   国 `string` - 住所の国。
    -   email_ `string` - 住所のEメール。
    -   first_name_ `string` - 住所の姓。
    -   last_name_ `string` - 住所の姓。
    -   phone_ `string` - 住所の電話番号。
    -   postcode_ `string` - 住所の郵便番号。
    -   state_ `string` - 住所の都道府県。
-   coupons_ `array` - クーポン配列。
-   _crossSells_ `array` - クロスセルアイテムの配列。
-   _errors_ `array` - エラー配列。
-   extensions_ `object` (default: `{}`) - extensions オブジェクト。
-   fee_ `array` - fee 配列。
-   _hasCalculatedShipping_ `boolean` - カートが送料を計算しているかどうか。
-   カートアイテムオブジェクト](#cart-item-object) を参照ください。
-   _itemsCount_ `number` - カート内のアイテム数。
-   _itemsWeight_ `number` - カートアイテムの総重量。
-   _needsPayment_ `boolean` - カートに支払いが必要かどうか。
-   _needsShipping_ `boolean` - カートに配送が必要かどうか。
-   _paymentMethods_ `array` - 支払い方法の配列。
-   _paymentRequirements_ `array` - 支払い条件の配列。
-   shippingAddress_ `object` - 請求先住所オブジェクトと同じキーを持つ配送先住所オブジェクト。
-   shippingRates_ `array` - 配送料金の配列。
-   totals_ `object` - 以下のキーを持つ合計オブジェクト：
    -   currency_code_ `string` - 通貨コード。
    -   currency_decimal_separator_ `string` - 通貨の小数点セパレータ。
    -   __currency_minor_unit_ `number` - 通貨の小単位。
    -   __currency_prefix_ `string` - 通貨のプレフィックス。
    -   __currency_suffix_ `string` - 通貨のサフィックス。
    -   __currency_symbol_ `string` - 通貨記号。
    -   __currency_thousand_separator_ `string` - 通貨の千の区切り文字。
    -   tax_lines_ `array` - 以下のキーを持つオブジェクトの配列：
        -   name_ `string` - 税金の名前。
        -   price_ `string` - 税金の価格。
        -   rate_ `string` - 税率。
    -   total_discount_ `string` - 割引総額。
    -   total_discount_tax_ `string` - 割引税額の合計。
    -   _total_fee_ `string` - 手数料の合計。
    -   __total_fee_tax_ `string` - 料金にかかる税金の合計。
    -   __total_items_ `string` - 項目の合計。
    -   _total_items_tax_ `string` - 合計商品税。
    -   total_price_ `string` - 合計価格。
    -   total_shipping_ `string` - 送料の合計。
    -   _total_shipping_tax_ `string` - 配送にかかる税金の合計。
    -   _total_tax_ `string` - 税金の合計。

## カートアイテムオブジェクト

上記のフィルターのCart Itemオブジェクトは以下のキーを持ちます：

-   backorders_allowed_ `boolean` - バックオーダーを許可するかどうか。
-   catalog_visibility_ `string` - カタログの表示。
-   decsription_ `string` - カートアイテムの説明。
-   extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   id_ `number` - アイテムID。
-   images_ `array` - アイテム画像の配列。
-   item_data_ `array` - アイテムデータの配列。
-   key_ `string` - アイテムのキー。
-   __low_stock_remaining_ `number` - 残りの在庫数。
-   name_ `string` - アイテム名。
-   permalink_ `string` - アイテムのパーマリンク。
-   prices_ `object` - 以下のキーを持つアイテム価格オブジェクト：
    -   currency_code_ `string` - 通貨コード。
    -   __currency_decimal_separator_ `string` - 通貨の小数点セパレータ。
    -   __currency_minor_unit_ `number` - 通貨の小単位。
    -   __currency_prefix_ `string` - 通貨のプレフィックス。
    -   __currency_suffix_ `string` - 通貨のサフィックス。
    -   __currency_symbol_ `string` - 通貨記号。
    -   currency_thousand_separator_ `string` - 通貨の千単位区切り文字。
    -   price_ `string` - 価格。
    -   price_range_ `string` - 価格帯。
    -   raw_prices_ `object` - 以下のキーを持つ生の価格オブジェクト：
        -   precision_ `number` - 精度。
        -   price_ `number` - 価格。
        -   regular_price_ `number` - 通常価格。
        -   sale_price_ `number` - セール価格。
    -   regular_price_ `string` - 通常価格。
    -   sale_price_ `string` - セール価格。
-   数量 `number` - 商品の数量。
-   __quantity_limits_ `object` - 以下のキーを持つ数量制限オブジェクトです：
    -   editable_ `boolean` - 数量を編集可能かどうか。
    -   maximum_ `number` - 最大数量。
    -   minimum_ `number` - 最小量。
    -   multiple_of_ `number` - 数量の倍数。
-   short_description_ `string` - 商品の短い説明。
-   show_backorder_badge_ `boolean` - バックオーダーのバッジを表示するかどうか。
-   sku_ `string` - 商品のSKU。
-   sold_individually_ `boolean` - アイテムが個別に販売されているかどうか。
-   totals_ `object` - 以下のキーを持つ項目の合計オブジェクトです：
    -   currency_code_ `string` - 通貨コード。
    -   currency_decimal_separator_ `string` - 通貨の小数点セパレータ。
    -   __currency_minor_unit_ `number` - 通貨の小単位。
    -   __currency_prefix_ `string` - 通貨のプレフィックス。
    -   __currency_suffix_ `string` - 通貨のサフィックス。
    -   __currency_symbol_ `string` - 通貨記号。
    -   __currency_thousand_separator_ `string` - 通貨の千の区切り文字。
    -   line_subtotal_ `string` - 行の小計。
    -   line_subtotal_tax_ `string` - 行の小計の税金。
    -   line_total_ `string` - 行の合計。
    -   line_total_tax_ `string` - 行の合計税額。
-   type_ `string` - 商品のタイプ。
-   variation_ `array` - 項目のバリエーション配列。
