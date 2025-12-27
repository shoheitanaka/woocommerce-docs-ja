---
post_title: Coupons
sidebar_label: Coupons
---
# Coupons

以下のクーポンフィルターが利用可能です：

-   `coupons`
-   `showApplyCouponNotice`
-   `showRemoveCouponNotice`

## `coupons`

### 説明 

現在の機能では、クーポンコードはカートとチェックアウトのサイドバーに表示されます。これは、ユーザーフレンドリーでないクーポンコードを動的に生成する場合、望ましくない可能性があります。したがって、このコードの表示方法を変更することが望ましいかもしれません。これを実現するために、`coupons`フィルタが存在します。このフィルターはクーポンの表示・非表示にも使用できます。このフィルタは、クーポンの値/合計を変更するために使用してはいけません。これはカートの合計には反映されません。

### パラメーター 

-   _coupons_ `object` - 以下のキーを持つクーポン・オブジェクト：
    -   code_ `string` - クーポンコード。
    -   discount_type_ `string` - 割引の種類。`percent`または`fixed_cart`です。
    -   totals_ `object` - 以下のキーを持つ合計オブジェクト：
        -   currency_code_ `string` - 通貨コード。
        -   currency_decimal_separator_ `string` - 通貨の小数点セパレータ。
        -   __currency_minor_unit_ `number` - 通貨の小単位。
        -   __currency_prefix_ `string` - 通貨のプレフィックス。
        -   __currency_suffix_ `string` - 通貨のサフィックス。
        -   __currency_symbol_ `string` - 通貨記号。
        -   __currency_thousand_separator_ `string` - 通貨の千の区切り文字。
        -   total_discount_ `string` - 割引総額。
        -   __total_discount_tax_ `string` - 割引税額の合計。
-   extensions_ `object` (default: `{}`) - extensions オブジェクト。
-   args_ `object` - 引数オブジェクト：
    -   context_ `string` (default: `summary`) - アイテムのコンテキスト。

### リターン 

-   `array` - 上記と同じキーを持つオブジェクトのクーポン配列。

### コード例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCoupons = ( coupons, extensions, args ) => {
	return coupons.map( ( coupon ) => {
		if ( ! coupon.label.match( /autocoupon(?:_\d+)+/ ) ) {
			return coupon;
		}

		return {
			...coupon,
			label: 'Automatic coupon',
		};
	} );
};

registerCheckoutFilters( 'example-extension', {
	coupons: modifyCoupons,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット 

[| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|クーポン・フィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/6cab1aff-e4b9-4909-b81c-5726c6a20c40) |![クーポン・フィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/a5cc2572-16e7-4781-a5ab-5d6cdced2ff6) |｜...

## `showApplyCouponNotice`

### 説明 

### パラメーター 

-   value_ `boolean` (デフォルト: `true`) - クーポン適用通知を表示するかどうか。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   context_ `string` (指定可能な値: `wc/cart` および `wc/checkout`) - クーポン通知のコンテキスト。
    -   _couponCode_ `string` - クーポンコード。

### リターン 

-   `boolean` - クーポン適用通知を表示するかどうか。

### コード例 

#### 基本例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyShowApplyCouponNotice = ( defaultValue, extensions, args ) => {
	return false;
};

registerCheckoutFilters( 'example-extension', {
	showApplyCouponNotice: modifyShowApplyCouponNotice,
} );
```

#### 高度な例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyShowApplyCouponNotice = ( defaultValue, extensions, args ) => {
	if ( args?.couponCode === '10off' ) {
		return false;
	}

	return defaultValue;
};

registerCheckoutFilters( 'example-extension', {
	showApplyCouponNotice: modifyShowApplyCouponNotice,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット 

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![Show Apply Coupon Notice フィルタ適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/374d4899-61f3-49b2-ae04-5541d4c130c2) |![Show Apply Coupon Notice フィルタ適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/c35dbd9b-eee4-4afe-9a29-9c554d467729) |｜...

## `showRemoveCouponNotice`

### 説明 

### パラメーター 

-   value_ `boolean` (デフォルト: `true`) - クーポン削除通知を表示するかどうか。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   context_ `string` (指定可能な値: `wc/cart` および `wc/checkout`) - クーポン通知のコンテキスト。
    -   _couponCode_ `string` - クーポンコード。

### リターン 

-   `boolean` - クーポン削除の通知を表示するかどうか。

### コード例 

#### 基本例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyShowRemoveCouponNotice = ( defaultValue, extensions, args ) => {
	return false;
};

registerCheckoutFilters( 'example-extension', {
	showRemoveCouponNotice: modifyShowRemoveCouponNotice,
} );
```

#### 高度な例 

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyShowRemoveCouponNotice = ( defaultValue, extensions, args ) => {
	if ( args?.couponCode === '10off' ) {
		return false;
	}

	return defaultValue;
};

registerCheckoutFilters( 'example-extension', {
	showRemoveCouponNotice: modifyShowRemoveCouponNotice,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット 

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![Show Remove Coupon Notice フィルタ適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/9d8607fa-ab20-4181-b70b-7954e7aa49cb) |![Show Remove Coupon Notice フィルタ適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/83d5f65f-c4f3-4707-a250-077952514931) |｜...
