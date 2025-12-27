---
post_title: Totals footer item
sidebar_label: Totals footer item
---
# フッターの合計項目

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
-   __extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   cart_ `object` - [カートオブジェクト](#cart-object)を参照してください。

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
|！[合計ラベルフィルター適用前](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/5b2fb8ab-db84-4ed0-a676-d5203edc84d2) |！[合計ラベルフィルター適用後](https://github.com/woocommerce/woocommerce-blocks/assets/3323310/07955eea-cb17-48e9-9cb5-6548dd6a3b24) |｜...

## `totalValue`

フィルターには以下のオブジェクトが使用される：

-   [カートオブジェクト](#cart-object)

### 説明

`totalValue`フィルターは、カートブロックとチェックアウトブロックのフッターで合計金額をフォーマットすることができます。

### パラメーター

-   _defaultValue_ `string` (デフォルト: `Total`) - ラベルの合計。
-   __extensions_ `object` (default: `{}`) - 拡張オブジェクト。
-   args_ `object` - 以下のキーを持つ引数オブジェクト：
    -   cart_ `object` - [カートオブジェクト](#cart-object)を参照ください。
-   validation_ `boolean` - 返り値が部分文字列 `<price/>` を含むかどうかをチェックします。

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
|！[合計値フィルター適用前](https://github.com/woocommerce/woocommerce/assets/3323310/4b788bdd-6fbd-406c-a9ad-4fb13f901c23) |！[合計値フィルター適用後](https://github.com/woocommerce/woocommerce/assets/3323310/1b1b5f72-7f2f-4ee5-b2a4-1d8eb2208deb) |｜...

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
    -   _total_discount_tax_ `string` - 割引税額の合計。
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
    -   __currency_thousand_separator_ `string` - 通貨の千の区切り文字。
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
