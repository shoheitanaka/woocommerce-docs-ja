---
post_title: Order summary items
sidebar_label: Order summary items
---
# オーダー概要

以下のオーダーサマリーアイテムフィルターが利用可能です：

-   `cartItemClass`
-   `cartItemPrice`
-   `cartItemScreenReaderPrice`
-   `itemName`
-   インラインコード4

以下のオブジェクトはフィルター間で共有される：

-   カートオブジェクト
-   カートアイテムオブジェクト

以下のスクリーンショットは、個々のフィルターがどの部分に影響するかを示しています：

![注文概要項目](https://woocommerce.com/wp-content/uploads/2023/10/Screenshot-2023-10-26-at-16.29.45.png)

## `cartItemClass`

### 説明

`cartItemClass`フィルタは、オーダー要約項目のクラスを変更することができます。

### パラメーター

-   _defaultValue_ `string` (デフォルト: `''`) - デフォルトの注文要約項目クラスです。
-   extensions_ `object` (default: `{}`) - extensions オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   cart_ `object` - [カートオブジェクト](#cart-object)を参照してください。
    -   _cartItem_ `object` - `wc/store/cart` の注文概要項目オブジェクト。[注文概要項目オブジェクト](#cart-item-object) を参照ください。
    -   __context_ `string` (指定可能な値: `cart` または `summary`) - アイテムのコンテキスト。

### リターン

-   `string` - 変更された注文要約項目クラス、または空の文字列。

### コード例

#### 基本例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCartItemClass = ( defaultValue, extensions, args ) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	return 'my-custom-class';
};

registerCheckoutFilters( 'example-extension', {
	cartItemClass: modifyCartItemClass,
} );
```

#### 高度な例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCartItemClass = ( defaultValue, extensions, args ) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	if ( args?.cartItem?.name === 'Beanie with Logo' ) {
		return 'cool-class';
	}

	if ( args?.cartItem?.name === 'Sunglasses' ) {
		return 'hot-class';
	}

	return 'my-custom-class';
};

registerCheckoutFilters( 'example-extension', {
	cartItemClass: modifyCartItemClass,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット

| 前 | 後 |
|:----------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------:|
| ![カートアイテムクラスフィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/ff555a84-8d07-4889-97e1-8f7d50d47350) | ![カートアイテムクラスフィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/183809d8-03dc-466d-a415-d8d2062d880f) |

## `cartItemPrice`

### 説明

`cartItemPrice` フィルタを使用すると、注文概要の項目価格をフォーマットすることができます。

### パラメーター

-   _defaultValue_ `string` (デフォルト: `<price/>`) - デフォルトの注文概要項目の価格です。
-   __extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   cart_ `object` - [カートオブジェクト](#cart-object)を参照してください。
    -   _cartItem_ `object` - `wc/store/cart` の注文概要項目オブジェクト。[注文概要項目オブジェクト](#cart-item-object) を参照ください。
    -   _context_ `string` (指定可能な値: `cart` または `summary`) - 項目のコンテキスト。
-   validation_ `boolean` - 返り値が部分文字列 `<price/>` を含んでいるかどうかを調べます。

### リターン

-   `string` - 部分文字列`<price/>`を含む必要がある、注文サマリー項目の価格の変更フォーマット、または元の価格フォーマット。

### コード例

#### 基本例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCartItemPrice = ( defaultValue, extensions, args, validation ) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	return '<price/> for all items';
};

registerCheckoutFilters( 'example-extension', {
	cartItemPrice: modifyCartItemPrice,
} );
```

#### 高度な例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCartItemPrice = ( defaultValue, extensions, args, validation ) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	if ( args?.cartItem?.name === 'Beanie with Logo' ) {
		return '<price/> to keep you ☀️';
	}

	if ( args?.cartItem?.name === 'Sunglasses' ) {
		return '<price/> to keep you ❄️';
	}

	return '<price/> for all items';
};

registerCheckoutFilters( 'example-extension', {
	cartItemPrice: modifyCartItemPrice,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット

| 前 | 後 |
|:----------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------:|
| ![カート商品価格フィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/58137fc4-884d-4783-9275-5f78abec1473) | ![カート商品価格フィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/fb502b74-6447-49a8-8d35-241e738f089d)

## `cartItemScreenReaderPrice`

### 説明

`cartItemScreenReaderPrice`フィルタを使用すると、スクリーンリーダーや支援技術を使用するユーザーに発表される注文概要アイテムの価格をフォーマットすることができます。画面上の視覚的な変更はありません。コードの変更は、カート内の各アイテムに含まれる`<span class="screen-reader-text">`で確認できます。

### パラメーター

-   デフォルト値 `string` （デフォルト：1つの商品の購入の場合は`Total price for <quantity/> <productName/> item: <price/>`、複数の商品の購入の場合は`Total price for <quantity/> <productName/> items: <price/>`） - デフォルトの注文サマリーのスクリーンリーダーのテキスト。
-   __extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   cart_ `object` - [カートオブジェクト](#cart-object)を参照してください。
    -   _cartItem_ `object` - `wc/store/cart` の注文概要項目オブジェクト。[注文概要項目オブジェクト](#cart-item-object) を参照ください。
    -   コンテクスト_ `string` (`summary`) - ミニカート概要の他のフィルターのコンテクストと一致するように固定されたアイテムのコンテクスト。
-   validation_ `boolean` - 返り値が部分文字列 `<quantity/>`、 `<productName/>`、 `<price/>` を含むかどうかをチェックします。

### リターン

-   これは、`<quantity/>`、_`<productName/>`および`<price/>`の部分文字列を含む必要があります。

### コード例

#### 基本例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;
const { _n } = window.wp.i18n;

const modifyCartItemScreenReaderPrice = ( defaultValue, extensions, args, validation ) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	return _n(
		'<quantity/> <productName/> item will cost <price/>',
		'<quantity/> <productName/> items will cost <price/>',
		args?.cartItem?.quantity ?? 1,
		'example-extension'
	);
};

registerCheckoutFilters( 'example-extension', {
	cartItemScreenReaderPrice: modifyCartItemScreenReaderPrice,
} );
```

#### 高度な例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;
const { _n } = window.wp.i18n;

const modifyCartItemScreenReaderPrice = ( defaultValue, extensions, args, validation ) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	if ( args?.cartItem?.name === 'Beanie with Logo' ) {
		return _n(
			'Total price for <quantity/> <productName/> item: <price/> to keep you warm',
			'Total price for <quantity/> <productName/> items: <price/> to keep you warm',
			args?.cartItem?.quantity ?? 1,
			'example-extension'
		);
	}

	if ( args?.cartItem?.name === 'Sunglasses' ) {
		return _n(
			'Total price for <quantity/> <productName/> item: <price/> to keep you cool',
			'Total price for <quantity/> <productName/> items: <price/> to keep you cool',
			args?.cartItem?.quantity ?? 1,
			'example-extension'
		);
	}

	return defaultValue;
};

registerCheckoutFilters( 'example-extension', {
	cartItemScreenReaderPrice: modifyCartItemScreenReaderPrice,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

## `itemName`

### 説明

`itemName`フィルタは、注文概要の項目名を変更することができます。

### パラメーター

-   _defaultValue_ `string` - デフォルトの注文概要項目名。
-   extensions_ `object` (default: `{}`) - extensions オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   cart_ `object` - [カートオブジェクト](#cart-object)を参照してください。
    -   _cartItem_ `object` - `wc/store/cart` の注文概要項目オブジェクト。[注文概要項目オブジェクト](#cart-item-object) を参照ください。
    -   __context_ `string` (指定可能な値: `cart` または `summary`) - アイテムのコンテキスト。

### リターン

-   `string` - 変更前または変更後の注文サマリー項目名。

### コード例

#### 基本例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyItemName = ( defaultValue, extensions, args ) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	return `🪴 ${ defaultValue } 🪴`;
};

registerCheckoutFilters( 'example-extension', {
	itemName: modifyItemName,
} );
```

#### 高度な例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyItemName = ( defaultValue, extensions, args ) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	if ( args?.cartItem?.name === 'Beanie with Logo' ) {
		return `⛷️ ${ defaultValue } ⛷️`;
	}

	if ( args?.cartItem?.name === 'Sunglasses' ) {
		return `🏄‍♂️ ${ defaultValue } 🏄‍♂️`;
	}

	return `🪴 ${ defaultValue } 🪴`;
};

registerCheckoutFilters( 'example-extension', {
	itemName: modifyItemName,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット

| Before                                                                                                                                         | After                                                                                                                                         |
|:----------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
| ![項目名フィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/3dc0bda7-fccf-4f35-a2e2-aa04e616563a) | ![項目名フィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/c96b8394-03a7-45f6-813b-5335f4bf83b5)

## `subtotalPriceFormat`

### 説明

`subtotalPriceFormat`フィルタは、注文サマリー項目の小計価格をフォーマットすることができます。

### パラメーター

-   _defaultValue_ `string` (デフォルト: `<price/>`) - デフォルトの注文サマリー項目の小計価格です。
-   __extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   cart_ `object` - [カートオブジェクト](#cart-object)を参照してください。
    -   _cartItem_ `object` - `wc/store/cart` の注文概要項目オブジェクト。[注文概要項目オブジェクト](#cart-item-object) を参照ください。
    -   _context_ `string` (指定可能な値: `cart` または `summary`) - 項目のコンテキスト。
-   validation_ `boolean` - 返り値が部分文字列 `<price/>` を含んでいるかどうかを調べます。

### リターン

-   `string` - 部分文字列`<price/>`を含む、注文サマリー項目の小計価格の変更フォーマット、または元の価格フォーマット。

### コード例

#### 基本例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifySubtotalPriceFormat = (
	defaultValue,
	extensions,
	args,
	validation
) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	return '<price/> per item';
};

registerCheckoutFilters( 'example-extension', {
	subtotalPriceFormat: modifySubtotalPriceFormat,
} );
```

#### 高度な例

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifySubtotalPriceFormat = (
	defaultValue,
	extensions,
	args,
	validation
) => {
	const isOrderSummaryContext = args?.context === 'summary';

	if ( ! isOrderSummaryContext ) {
		return defaultValue;
	}

	if ( args?.cartItem?.name === 'Beanie with Logo' ) {
		return '<price/> per warm beanie';
	}

	if ( args?.cartItem?.name === 'Sunglasses' ) {
		return '<price/> per cool sunglasses';
	}

	return '<price/> per item';
};

registerCheckoutFilters( 'example-extension', {
	subtotalPriceFormat: modifySubtotalPriceFormat,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット

| Before                                                                                                                                                     | After                                                                                                                                                     |
|:----------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|
| ![小計価格フォーマットフィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/3574e7ae-9857-4651-ac9e-e6b597e3a589) | ![小計価格フォーマットフィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/94e18439-6d6b-44a4-ade1-8302c5984641) |

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
-   ~~_billingData_~~ `object` - `billingAddress` オブジェクトと同じキーを持つ請求データオブジェクト。
-   __cartCoupons_ `array` - カートクーポンの配列。
-   __cartErrors_ `array` - カートのエラー配列。
-   _cartFees_ `array` - カート料金の配列。
-   __cartHasCalculatedShipping_ `boolean` - カートが送料を計算しているかどうか。
-   __cartIsLoading_ `boolean` - カートが読み込まれているかどうか。
-   __cartItemErrors_ `array` - カート項目のエラー配列。
-   カートアイテムオブジェクト](#cart-item-object) を参照ください。
-   _cartItemsCount_ `number` - カートアイテムの数。
-   _cartItemsWeight_ `number` - カートアイテムの重さ。
-   _cartNeedsPayment_ `boolean` - カートに支払いが必要かどうか。
-   _cartNeedsShipping_ `boolean` - カートに配送が必要かどうか。
-   _cartTotals_ `object` - 以下のキーを持つカート合計オブジェクト：
    -   _currency_code_ `string` - 通貨コード。
    -   __currency_decimal_separator_ `string` - 通貨の小数点セパレータ。
    -   __currency_minor_unit_ `number` - 通貨の小単位。
    -   __currency_prefix_ `string` - 通貨のプレフィックス。
    -   __currency_suffix_ `string` - 通貨のサフィックス。
    -   __currency_symbol_ `string` - 通貨記号。
    -   __currency_thousand_separator_ `string` - 通貨の千の区切り文字。
    -   tax_lines_ `array` - 以下のキーを持つ税目オブジェクトを含む税目配列：
        -   name_ `string` - タックスラインの名前。
        -   price_ `number` - タックスラインの価格。
        -   rate_ `string` - タックス・ラインの税率ID。
    -   total_discount_ `string` - 割引総額。
    -   _total_discount_tax_ `string` - 割引税の合計。
    -   _total_fees_ `string` - 料金合計。
    -   _total_fees_tax_ `string` - 料金にかかる税金の合計。
    -   total_items_ `string` - 合計アイテム。
    -   __total_items_tax_ `string` - 合計商品税。
    -   total_price_ `string` - 合計価格。
    -   _total_shipping_ `string` - 送料の合計。
    -   _total_shipping_tax_ `string` - 配送にかかる税金の合計。
    -   _total_tax_ `string` - 合計税金。
-   _crossSellsProducts_ `array` - クロスセル商品オブジェクトを含むクロスセル商品配列。
-   extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _isLoadingRates_ `boolean` - カートが配送料金を読み込んでいるかどうか。
-   _paymentRequirements_ `array` - 支払い条件の配列。
-   shippingAddress_ `object` - `billingAddress` オブジェクトと同じキーを持つ配送先住所オブジェクト。
-   shippingRates_ `array` - 配送料金の配列。

## カートアイテムオブジェクト

上記のフィルターのCart Itemオブジェクトは以下のキーを持ちます：

-   backorders_allowed_ `boolean` - バックオーダーを許可するかどうか。
-   catalog_visibility_ `string` - カタログの表示。
-   decsription_ `string` - カートアイテムの説明。
-   extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   id_ `number` - アイテムID。
-   images_ `array` - アイテムの画像配列。
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
-   _show_backorder_badge_ `boolean` - バックオーダーのバッジを表示するかどうか。
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
