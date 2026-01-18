---
post_title: Totals footer item
sidebar_label: Totals footer item
---

# 合計フッター項目

以下の合計フッター項目フィルターが利用可能です：

-   `totalLabel`
-   `totalValue`。

## `totalLabel`

フィルターには以下のオブジェクトが使用される：

-   [カートオブジェクト](#cart-object)

### 説明

`totalLabel`フィルターは、カートブロックとチェックアウトブロックのフッターで合計項目のラベルを変更することができます。

### パラメーター

-   _defaultValue_ `string` (デフォルト: `Total`) - ラベルの合計。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   _cart_ `object` - [カートオブジェクト](#cart-object)を参照してください。

### リターン

-   `string` - 更新された合計ラベル。

### コード例

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyTotalLabel = ( defaultValue, extensions, args ) => {
	return 'Deposit due today';
};

registerCheckoutFilters( 'example-extension', {
	totalLabel: modifyTotalLabel,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![合計ラベルフィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/5b2fb8ab-db84-4ed0-a676-d5203edc84d2) |![合計ラベルフィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/07955eea-cb17-48e9-9cb5-6548dd6a3b24) |｜...

## `totalValue`

フィルターには以下のオブジェクトが使用される：

-   [カートオブジェクト](#cart-object)

### 説明

`totalValue`フィルターは、カートブロックとチェックアウトブロックのフッターで合計金額をフォーマットすることができます。

### パラメーター

-   _defaultValue_ `string` (デフォルト: `Total`) - ラベルの合計。
-   _extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   _args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   _cart_ `object` - [カートオブジェクト](#cart-object)を参照ください。
-   _validation_ `boolean` - 返り値が部分文字列 `<price/>` を含むかどうかをチェックします。

### リターン

-   `string` - 修正された合計価格のフォーマットで、`<price/>`の部分文字列、または元の価格のフォーマットを含む必要があります。

### コード例

```ts
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyTotalsPrice = ( defaultValue, extensions, args, validation ) => {
	return 'Pay <price/> now';
};

registerCheckoutFilters( 'my-extension', {
	totalValue: modifyTotalsPrice,
} );
```

> フィルターは組み合わせることもできます。例として[Combined filters](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)を参照してください。

### スクリーンショット

| 前
|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
|![合計値フィルター適用前](https://github.com/woocommerce/woocommerce/assets/3323310/4b788bdd-6fbd-406c-a9ad-4fb13f901c23) |![合計値フィルター適用後](https://github.com/woocommerce/woocommerce/assets/3323310/1b1b5f72-7f2f-4ee5-b2a4-1d8eb2208deb) |｜...

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
-   [カートアイテムオブジェクト](#cart-item-object) を参照ください。
-   _cartItemsCount_ `number` - カートアイテムの数。
-   _cartItemsWeight_ `number` - カートアイテムの重さ。
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
