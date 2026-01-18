---
post_title: Cart line items
sidebar_label: Cart Line Items
---

# カートの項目

<!-- markdownlint-disable MD024 -->

以下のカート項目フィルターが利用可能です：

-   `cartItemClass`
-   `cartItemPrice`
-   `itemName`
-   `saleBadgePriceFormat`
-   `showRemoveItemLink`
-   `subtotalPriceFormat`

以下のオブジェクトはフィルター間で共有される：

-   カートオブジェクト
-   カートアイテムオブジェクト

以下のスクリーンショットは、個々のフィルターがどの部分に影響するかを示しています：

![Cart Line Items](https://woocommerce.com/wp-content/uploads/2023/10/Screenshot-2023-10-26-at-13.12.33.png)

## `cartItemClass`

### 説明<!-- omit in toc -->

`cartItemClass` フィルタはカートアイテムのクラスを変更することができます。

### パラメーター<!-- omit in toc -->

-   _defaultValue_ `object` (デフォルト: `''`) - デフォルトのカートアイテムクラス。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   _cart_ `object` - `wc/store/cart` のカートオブジェクト。
    -   _cartItem_ `object` - `wc/store/cart` のカート・アイテム・オブジェクト。
    -   _context_ `string` (指定可能な値: `cart` または `summary`) - アイテムのコンテキスト。

### リターン<!-- omit in toc -->

-   `string` - 変更されたカートアイテムのクラス、または空の文字列。

### コード例<!-- omit in toc -->

#### 基本例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCartItemClass = ( defaultValue, extensions, args ) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
		return defaultValue;
	}

	return 'my-custom-class';
};

registerCheckoutFilters( 'example-extension', {
	cartItemClass: modifyCartItemClass,
} );
```

#### 高度な例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCartItemClass = ( defaultValue, extensions, args ) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
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

### スクリーンショット<!-- omit in toc -->

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![カート項目クラスフィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/a587a6ce-d051-4ed0-bba5-815b5d72179d) |![カート項目クラスフィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/9b25eeae-6d81-4e28-b177-32f942e1d0c2) |｜...

## `cartItemPrice`

### 説明<!-- omit in toc -->

`cartItemPrice`フィルタはカートアイテムの価格をフォーマットすることができます。

### パラメーター<!-- omit in toc -->

-   _defaultValue_ `string` (デフォルト: `<price/>`) - デフォルトのカートアイテムの価格。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   _cart_ `object` - `wc/store/cart` のカートオブジェクト。
    -   _cartItem_ `object` - `wc/store/cart` のカート・アイテム・オブジェクト。
    -   _context_ `string` (指定可能な値: `cart` または `summary`) - アイテムのコンテキスト。
-   _validation_ `boolean` - 返り値が部分文字列 `<price/>` を含むかどうかを調べます。

### リターン<!-- omit in toc -->

-   `string` - 部分文字列`<price/>`を含む必要がある、カートアイテムの価格の変更フォーマット、または元の価格フォーマット。

### コード例<!-- omit in toc -->

#### 基本例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCartItemPrice = ( defaultValue, extensions, args, validation ) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
		return defaultValue;
	}

	return '<price/> for all items';
};

registerCheckoutFilters( 'example-extension', {
	cartItemPrice: modifyCartItemPrice,
} );
```

#### 高度な例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCartItemPrice = ( defaultValue, extensions, args, validation ) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
		return defaultValue;
	}

	if ( args?.cartItem?.name === 'Beanie with Logo' ) {
		return '<price/> to keep you warm';
	}

	if ( args?.cartItem?.name === 'Sunglasses' ) {
		return '<price/> to keep you cool';
	}

	return '<price/> for all items';
};

registerCheckoutFilters( 'example-extension', {
	cartItemPrice: modifyCartItemPrice,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット<!-- omit in toc -->

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![カート商品価格フィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/bbaeb68a-492e-41e7-87b7-4b8b05ca3709) |![カート商品価格フィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/bbaeb68a-492e-41e7-87b7-4b8b05ca3709) |｜...

## `itemName`

### 説明<!-- omit in toc -->

`itemName`フィルタはカートアイテム名を変更することができます。

### パラメーター<!-- omit in toc -->

-   _defaultValue_ `string` - デフォルトのカートアイテム名。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   _cart_ `object` - `wc/store/cart` のカートオブジェクト。
    -   _cartItem_ `object` - `wc/store/cart` のカート・アイテム・オブジェクト。
    -   _context_ `string` (指定可能な値: `cart` または `summary`) - アイテムのコンテキスト。

### リターン<!-- omit in toc -->

-   `string` - 変更前または変更後のカートアイテム名。

### コード例<!-- omit in toc -->

#### 基本例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyItemName = ( defaultValue, extensions, args ) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
		return defaultValue;
	}

	return `🪴 ${ defaultValue } 🪴`;
};

registerCheckoutFilters( 'example-extension', {
	itemName: modifyItemName,
} );
```

#### 高度な例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyItemName = ( defaultValue, extensions, args ) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
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

### スクリーンショット<!-- omit in toc -->

|![ 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|項目名フィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/97d0f501-138e-4448-93df-a4d865b524e6) |!

## `saleBadgePriceFormat`

### 説明<!-- omit in toc -->

`saleBadgePriceFormat` フィルタは、カートアイテムのセールバッジ価格をフォーマットすることができます。

### パラメーター<!-- omit in toc -->

-   _defaultValue_ `string` (デフォルト: `<price/>`) - デフォルトのカートアイテム販売バッジ価格。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   _cart_ `object` - `wc/store/cart` のカートオブジェクト。
    -   _cartItem_ `object` - `wc/store/cart` のカート・アイテム・オブジェクト。
    -   _context_ `string` (指定可能な値: `cart` または `summary`) - アイテムのコンテキスト。
-   _validation_ `boolean` - 返り値が部分文字列 `<price/>` を含むかどうかを調べます。

### リターン<!-- omit in toc -->

-   `string` - 部分文字列`<price/>`を含む必要がある、カートアイテムの販売バッジ価格の変更フォーマット、または元の価格フォーマット。

### コード例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifySaleBadgePriceFormat = (
	defaultValue,
	extensions,
	args,
	validation
) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
		return defaultValue;
	}

	return '<price/> per item';
};

registerCheckoutFilters( 'example-extension', {
	saleBadgePriceFormat: modifySaleBadgePriceFormat,
} );
```

#### 高度な例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifySaleBadgePriceFormat = (
	defaultValue,
	extensions,
	args,
	validation
) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
		return defaultValue;
	}

	if ( args?.cartItem?.name === 'Beanie with Logo' ) {
		return '<price/> per item while keeping warm';
	}

	if ( args?.cartItem?.name === 'Sunglasses' ) {
		return '<price/> per item while looking cool';
	}

	return '<price/> per item';
};

registerCheckoutFilters( 'example-extension', {
	saleBadgePriceFormat: modifySaleBadgePriceFormat,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット<!-- omit in toc -->

[| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|セール・バッジ価格形式フィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/d2aeb206-e620-44e0-93c1-31484cfcdca6) |![セール・バッジ価格形式フィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/6b929695-5d89-433b-8694-b9201a7c0519) |｜...

## `showRemoveItemLink`

### 説明<!-- omit in toc -->

`showRemoveItemLink` は、カートアイテム削除リンクの表示/非表示に使用します。

### パラメーター<!-- omit in toc -->

-   _defaultValue_ (type: `boolean`、 default: `true`) - 削除リンクのデフォルト値。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   _cart_ `object` - `wc/store/cart` のカートオブジェクト。
    -   _cartItem_ `object` - `wc/store/cart` のカート・アイテム・オブジェクト。
    -   _context_ `string` (指定可能な値: `cart` または `summary`) - アイテムのコンテキスト。

### リターン<!-- omit in toc -->

-   `boolean` - カートアイテムの削除リンクを表示する場合は `true` 、そうでない場合は `false` 。

### コード例<!-- omit in toc -->

#### 基本例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyShowRemoveItemLink = ( defaultValue, extensions, args ) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
		return defaultValue;
	}

	return false;
};

registerCheckoutFilters( 'example-extension', {
	showRemoveItemLink: modifyShowRemoveItemLink,
} );
```

#### 高度な例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyShowRemoveItemLink = ( defaultValue, extensions, args ) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
		return defaultValue;
	}

	if ( args?.cartItem?.name === 'Beanie with Logo' ) {
		return false;
	}

	if ( args?.cartItem?.name === 'Sunglasses' ) {
		return false;
	}

	return true;
};

registerCheckoutFilters( 'example-extension', {
	showRemoveItemLink: modifyShowRemoveItemLink,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット<!-- omit in toc -->

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![Show Remove Item Link フィルタ適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/a4254f3b-f056-47ad-b34a-d5f6d5500e56) |![Show Remove Item Link フィルタ適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/32c55dc7-ef65-4f35-ab90-9533bc79d362) |｜｜｜[Show Remove Item Link フィルタ適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/32c55dc7-ef65-4f35-ab90-9533bc79d362)

## `subtotalPriceFormat`

### 説明<!-- omit in toc -->

`subtotalPriceFormat`フィルタはカートアイテムの小計価格をフォーマットすることができます。

### パラメーター<!-- omit in toc -->

-   _defaultValue_ `string` (default: `<price/>`) - デフォルトのカートアイテムの小計価格。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   _cart_ `object` - `wc/store/cart` のカートオブジェクト。
    -   _cartItem_ `object` - `wc/store/cart` のカート・アイテム・オブジェクト。
    -   _context_ `string` (指定可能な値: `cart` または `summary`) - アイテムのコンテキスト。
-   _validation_ `boolean` - 返り値が部分文字列 `<price/>` を含むかどうかを調べます。

### リターン<!-- omit in toc -->

-   `string` - サブ文字列`<price/>`を含む必要がある、カートアイテムの小計価格の変更フォーマット、または元の価格フォーマット。

### コード例<!-- omit in toc -->

#### 基本例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifySubtotalPriceFormat = (
	defaultValue,
	extensions,
	args,
	validation
) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
		return defaultValue;
	}

	return '<price/> per item';
};

registerCheckoutFilters( 'example-extension', {
	subtotalPriceFormat: modifySubtotalPriceFormat,
} );
```

#### 高度な例<!-- omit in toc -->

```tsx
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifySubtotalPriceFormat = (
	defaultValue,
	extensions,
	args,
	validation
) => {
	const isCartContext = args?.context === 'cart';

	if ( ! isCartContext ) {
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

### スクリーンショット<!-- omit in toc -->

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![小計価格フォーマットフィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/a392cb24-4c40-4e25-8396-bf4971830e22) |![小計価格フォーマットフィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/af69b26f-662a-4ef9-a288-3713b6e46373) |｜...

## カートオブジェクト

上記のフィルターのCartオブジェクトは以下のキーを持つ：

-   _billingAddress_ `object` - 以下のキーを持つ請求先住所オブジェクト：
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
-   ~~_billingData_~~ `object` - `billingAddress` オブジェクトと同じキーを持つ請求データオブジェクト。
-   _cartCoupons_ `array` - カートクーポンの配列。
-   _cartErrors_ `array` - カートのエラー配列。
-   _cartFees_ `array` - カート料金の配列。
-   _cartHasCalculatedShipping_ `boolean` - カートが送料を計算しているかどうか。
-   _cartIsLoading_ `boolean` - カートが読み込まれているかどうか。
-   _cartItemErrors_ `array` - カート項目のエラー配列。
-   _cartItems_ `array` - カートアイテムオブジェクトを含むカートアイテム配列。
-   _cartItemsCount_ `number` - カートアイテムの数。
-   _cartItemsWeight_ `number` - カートアイテムの重量。
-   _cartNeedsPayment_ `boolean` - カートに支払いが必要かどうか。
-   _cartNeedsShipping_ `boolean` - カートに配送が必要かどうか。
-   _cartTotals_ `object` - 以下のキーを持つカート合計オブジェクト：
    -   _currency_code_ `string` - 通貨コード。
    -   _currency_decimal_separator_ `string` - 通貨の小数点セパレータ。
    -   _currency_minor_unit_ `number` - 通貨の小単位。
    -   _currency_prefix_ `string` - 通貨のプレフィックス。
    -   _currency_suffix_ `string` - 通貨のサフィックス。
    -   _currency_symbol_ `string` - 通貨記号。
    -   _currency_thousand_separator_ `string` - 通貨の千の区切り文字。
    -   _tax_lines_ `array` - 以下のキーを持つ税目オブジェクトを含む税目配列：
        -   _name_ `string` - タックスラインの名前。
        -   _price_ `number` - タックスラインの価格。
        -   _rate_ `string` - タックス・ラインの税率ID。
    -   _total_discount_ `string` - 割引総額。
    -   _total_discount_tax_ `string` - 割引税の合計。
    -   _total_fees_ `string` - 料金合計。
    -   _total_fees_tax_ `string` - 料金にかかる税金の合計。
    -   _total_items_ `string` - 合計アイテム。
    -   _total_items_tax_ `string` - 合計商品税。
    -   _total_price_ `string` - 合計価格。
    -   _total_shipping_ `string` - 送料の合計。
    -   _total_shipping_tax_ `string` - 配送にかかる税金の合計。
    -   _total_tax_ `string` - 合計税金。
-   _crossSellsProducts_ `array` - クロスセル商品オブジェクトを含むクロスセル商品配列。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _isLoadingRates_ `boolean` - カートが配送料金を読み込んでいるかどうか。
-   _paymentRequirements_ `array` - 支払い条件の配列。
-   _shippingAddress_ `object` - `billingAddress` オブジェクトと同じキーを持つ配送先住所オブジェクト。
-   _shippingRates_ `array` - 配送料金の配列。

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
