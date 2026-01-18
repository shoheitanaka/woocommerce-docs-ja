---
sidebar_label: Cart store
---

# カートストア (`wc/store/cart`) 

> カートストアとレジストアの違いは何ですか？
>
> **カートストア (`wc/store/cart`)** は、アイテム、顧客データ、クーポンなどのインタラクションを含む、ショッピングカートに関するデータを管理および取得します。
>
> **チェックアウトストア (`wc/store/checkout`)** は、チェックアウトプロセス、顧客ID、注文ID、チェックアウトステータスに関連するデータを管理および取得します。

## 概要

カートストアは、WooCommerce ブロックのカート関連データを管理・取得するためのセレクタとメソッドのコレクションを提供します。カートの詳細情報の取得から、クーポンの適用や配送情報の更新といった顧客とのやり取りを管理する機能まで提供します。

このストアを利用するには、`cartStore` `StoreDescriptor` を参照するモジュールでインポートします。`@woocommerce/block-data` が `wc.wcBlocksData` を指す外部として登録されていると仮定すると、`StoreDescriptor` をインポートすることができます: 

```js
const { cartStore } = window.wc.wcBlocksData;
```

### setCartData

このアクションは、ストアにカートデータを設定するために使用されます。

#### _Parameters_

-   _cartData_ `object`: 以下のキーを持つ現在のカートデータ: 
    -   _coupons_ `array`: カート内のクーポンアイテム。
    -   _shippingRates_`array`: カート内のクーポンアイテム: カートの配送料金(`getShippingRates`セレクタを参照)。
    -   _shippingAddress_ `object`: 配送先住所 (`getCustomerData` セレクタを参照ください)。
    -   _billingAddress_ (`object` セレクタを参照ください): 請求先住所 (`getCustomerData` セレクタを参照ください)。
    -   _items_ `array`: カートアイテム。
    -   _itemsCount_ `number`:カート内のアイテムの総数
    -   _itemsWeight_ `number`:カート内のアイテムの総重量。
    -   _crossSells_ `array`:クロスセルのアイテム。
    -   _needsPayment_ `boolean`:カートに支払いが必要な場合。
    -   _needsShipping_ `boolean`:カートに配送が必要な場合。
    -   _hasCalculatedShipping_`boolean`: カートに送料が計算されている場合。
    -   _fees_`array`: カートの料金。
    -   _totals_ `object`: カートの合計金額: カートの合計 (`getCartTotals` セレクタを参照ください)。
    -   _errors_ `array`: カートのエラー (`getCartErrors` セレクタを参照ください)。
    -   _paymentRequirements_ `object`: カートの支払い条件。
    -   _extensions_ `object`:拡張機能のデータ。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setCartData( newCartData ) );
```

### setErrorData

このアクションは、ストアにエラーデータを設定するために使用される。

#### _Parameters_

-   _errorData_ `object`: ストアに設定する必要があるエラーデータ。
    -   _code_ `string`: エラーコード: エラーコード。
    -   _message_ `string`: エラーメッセージ: エラーメッセージ。
    -   _data_ `object`: エラーメッセージ: 追加のエラーデータ。これは、以下のキーを持つオプションのオブジェクトです: 
        -   _status_ `number`: エラーステータス: エラーステータス。
        -   _params_ `string`: エラーパラメーター: エラーのパラメータ。
        -   _message_ `string`: エラーメッセージ: エラーメッセージ。
        -   _cart_ `object`: カートデータ: カートデータ。これは以下のキーを持つオプションのオブジェクトです: 
            -   _coupons_ `array`: カート内のクーポンアイテム。
            -   _shippingRates_`array`: カート内のクーポンアイテム: カートの配送料金(`getShippingRates`セレクタを参照)。
            -   _shippingAddress_ `object`: 配送先住所 (`getCustomerData` セレクタを参照ください)。
            -   _billingAddress_ `object` : 請求先住所 (`getCustomerData` セレクタを参照ください)。
            -   _items_ `array`: カートアイテム。
            -   _itemsCount_ `number`:カート内のアイテムの総数
            -   _itemsWeight_ `number`:カート内のアイテムの総重量。
            -   _crossSells_ `array`:クロスセルのアイテム。
            -   _needsPayment_ `boolean`:カートに支払いが必要な場合。
            -   _needsShipping_ `boolean`:カートに配送が必要な場合。
            -   _hasCalculatedShipping_`boolean`: カートに送料が計算されている場合。
            -   _fees_ `array`: カートの料金。
            -   _totals_ `object`: カートの合計金額: カート合計 (`getCartTotals` セレクタを参照ください)。
            -   _errors_ `array`: カートのエラー (`getCartErrors` セレクタを参照ください)。
            -   _paymentRequirements_ `object`: カートの支払い条件。
            -   _extensions_ `object`:拡張機能のデータ。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setErrorData( newErrorData ) );
```

### レシーブカートコンテンツ

このアクションは、提供されたカートでストアを更新する際に使用されるアクションオブジェクトを返します。顧客のアドレスは省略されるので、カートの項目と合計の更新だけが受け取られます。

#### _Parameters_ 

- _cartContents_ `object`: カートコンテンツ API レスポンス。
    - _coupons_ `array`: カート内のクーポン商品。
    - _shippingRates_ `array`: カートの配送料（`getShippingRates` セレクターを参照）。
    - _shippingAddress_ `object`: 配送先住所（`getCustomerData` セレクターを参照）。
    - _billingAddress_ `object`: 請求先住所（`getCustomerData` セレクターを参照）。
    - _items_ `array`: カート内の商品。
    - _itemsCount_ `number`: カート内の商品の合計数。
    - _itemsWeight_ `number`: カート内の商品の合計重量。
    - _crossSells_ `array`: クロスセル商品。
    - _needsPayment_ `boolean`: カートで支払いが必要かどうか。
    - _needsShipping_ `boolean`: カートに配送料が必要かどうか。
    - _hasCalculatedShipping_ `boolean`: カートに配送料が計算されているかどうか。
    - _fees_ `array`: カートの手数料。
    - _totals_ `object`: カートの合計金額（`getCartTotals` セレクターを参照）。
    - _errors_ `array`: カートのエラー（`getCartErrors` セレクターを参照）。
    - _paymentRequirements_ `object`: カートの支払い要件。
    - _extensions_ `object`: 拡張機能データ。

#### _Returns_ 

- `object`: 以下のキーを持つアクションオブジェクト:
    - _type_ `string`: アクションタイプ
    - _cartContents_ `object`: 以下のキーを持つカートの内容:
        - _coupons_ `array`: カート内のクーポン商品
        - _shippingRates_ `array`: カートの送料（`getShippingRates` セレクターを参照）
        - _items_ `array`: カート内の商品
        - _itemsCount_ `number`: カート内の商品の合計数
        - _itemsWeight_ `number`: カート内の商品の合計重量
        - _crossSells_ `array`: クロスセル商品
        - _needsPayment_ `boolean`: カートで支払いが必要かどうか
        - _needsShipping_ `boolean`: カートで配送が必要かどうか
        - _hasCalculatedShipping_ `boolean`: カートに送料計算機能があるかどうか。
        - _fees_ `array`: カート手数料。
        - _totals_ `object`: カートの合計金額（`getCartTotals` セレクターを参照）。
        - _errors_ `array`: カートエラー（`getCartErrors` セレクターを参照）。
        - _paymentRequirements_ `object`: カートの支払い要件。
        - _extensions_ `object`: 拡張機能データ。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( receiveCartContents( newCartContents ) );
```

### クーポンを受け取る

このアクションは、クーポンが適用されるタイミングを追跡するために使用されるアクションオブジェクトを返します。

#### _Parameters_

-   _couponCode_ `string`:適用されるクーポンのコード。

#### _Returns_ 

-   `object`: 以下のキーを持つアクションオブジェクト: 
    -   _type_`string`: アクションタイプ。
    -   _couponCode_ `string`:適用されるクーポンのコード。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( receiveApplyingCoupon( couponCode ) );
```

### クーポンを受け取る

このアクションは、クーポンがいつ削除されたかを追跡するために使用されるアクションオブジェクトを返します。

#### _Parameters_

-   _couponCode_ `string`:削除されるクーポンのコード。

#### _Returns_ 

-   `object`: 以下のキーを持つアクションオブジェクト: 
    -   _type_`string`: アクションタイプ。
    -   _couponCode_ `string`:削除されるクーポンのコード。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( receiveRemovingCoupon( couponCode ) );
```

### レシーブカートアイテム

このアクションは、カート内の特定のアイテムを更新するために使用されます。

#### _Parameters_

-   _cartResponseItem_ `object`: 以下のキーを持つカート・レスポンス・オブジェクト: 
    -   __cartItem_ `object`: カートアイテム(`getCartItem`セレクタを参照)。

#### _Returns_ 

-   `object`: 以下のキーを持つアクションオブジェクト: 
    -   _type_`string`: アクションタイプ。
    -   _cartItem`object`: カートアイテム: カートアイテム(`getCartItem`セレクタを参照)。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( receiveCartItem( CartResponseItem ) );
```

### itemIsPendingQuantity

このアクションは、指定されたカートアイテムの数量が更新されているかどうかを示すアクションオブジェクトを返します。

#### _Parameters_

-   _cartItemKey_ `string`:カートアイテムのキー。
-   _isPending_ `boolean` (デフォルト: `true`): カートアイテムの数量が更新中かどうか。

#### _Returns_ 

-   `object`: 以下のキーを持つアクションオブジェクト: 
    -   _type_`string`: アクションタイプ。
    -   _cartItemKey_ `string`:カートアイテムのキー。
    -   _isPending_`boolean`: カートアイテムの数量が更新中かどうか。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( itemIsPendingQuantity( cartItemKey, isPending ) );
```

### itemIsPendingDelete

このアクションは、指定されたカートアイテムが削除されているかどうかを示すアクションオブジェクトを返します。

#### _Parameters_

-   _cartItemKey_ `string`:カートアイテムのキー。
-   _isPending_ `boolean` (デフォルト: `true`): カートアイテムが削除されるかどうか。

#### _Returns_ 

-   `object`: 以下のキーを持つアクションオブジェクト: 
    -   _type_`string`: アクションタイプ。
    -   _cartItemKey_ `string`:カートアイテムのキー。
    -   _isPending_`boolean`: カートアイテムのキー: カートアイテムが削除されるかどうか。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( itemIsPendingDelete( cartItemKey, isPending ) );
```

### setIsCartDataStale

このアクションは、カートデータが古くなっているかどうかを示すアクションオブジェクトを返します。

#### _Parameters_

-   _isCartDataStale_ `boolean` (デフォルト: `true`): もし `lastCartUpdate` のタイムスタンプが wcSettings 内のものより新しい場合は true。

#### _Returns_ 

-   `object`: 以下のキーを持つアクションオブジェクト: 
    -   _type_`string`: アクションタイプ。
    -   _isCartDataStale_`boolean`: もし `lastCartUpdate` のタイムスタンプが wcSettings 内のものより新しい場合は true。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setIsCartDataStale( isCartDataStale ) );
```

### 顧客データの更新

このアクションは、顧客データ(請求先住所および/または配送先住所)が更新されているかどうかを示すアクションオブジェクトを返します。

#### _Parameters_

-   _isResolving_ `boolean`:顧客データが更新されているかどうか。

#### _Returns_ 

-   `object`: 以下のキーを持つアクションオブジェクト: 
    -   _type_`string`: アクションタイプ。
    -   _isResolving_ `boolean`:顧客データが更新されているかどうか。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( updatingCustomerData( isResolving ) );
```

### 選択されている配送料金

このアクションは、送料が選択されているかどうかを示すアクションオブジェクトを返します。

#### _Parameters_

-   _isResolving_ `boolean`:配送料金が選択されていれば真。

#### _Returns_ 

-   `object`: 以下のキーを持つアクションオブジェクト: 
    -   _type_`string`: アクションタイプ。
    -   _isResolving_ `boolean`:配送料金が選択されている場合は真。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( shippingRatesBeingSelected( isResolving ) );
```

### applyExtensionCartUpdate

このアクションは、/cart/extensions エンドポイントに拡張機能から提供されたデータを POST リクエストとして送信するために使用されます。

#### _Parameters_

-   _args_ `object`: 以下のキーを持つリクエストの引数: 
    -   _extensionId_ `string`:エクステンションID。
    -   data_ `object`: エンドポイントに送信するデータ: エンドポイントに送信するデータ: 
        -   key_ `string`: 拡張機能のキー: 拡張機能のキー。
        -   _value_ `string`: 拡張機能のキー: 拡張機能の値。
    -   _overwriteDirtyCustomerData_ `boolean`: クライアント内の顧客データを、ダーティ(まだサーバーにプッシュされていない)であってもサーバーから返されたデータで上書きするかどうか。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( applyExtensionCartUpdate( args ) );
```

### クーポン適用

このアクションは、カートにクーポンを適用するために使用されます。

#### _Parameters_

-   _couponCode_ `string`:適用するクーポンのコード。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( applyCoupon( couponCode ) );
```

### クーポンの削除

このアクションは、カートからクーポンを削除するために使用されます。

#### _Parameters_

-   _couponCode_ `string`:削除するクーポンのコード。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( removeCoupon( couponCode ) );
```

### カートに入れる

このアクションはカートに商品を追加するために使用されます。

#### _Parameters_

-   _productId_`number`: カートに入れる商品ID。
-   _quantity_ `number` (デフォルト: `1`): 追加する商品の数量。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( addItemToCart( productId, quantity ) );
```

### RemoveItemFromCart

このアクションは、カートから商品を削除するために使用されます。

#### _Parameters_

-   _cartItemKey_ `string`:カート項目が更新されました。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( removeItemFromCart( cartItemKey ) );
```

### ChangeCartItemQuantity

このアクションはカート内の商品の数量を変更するために使用されます。

#### _Parameters_

-   _cartItemKey_ `string`:更新中のカートアイテムです。
-   _quantity_ `number`: アイテムの数量。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( changeCartItemQuantity( cartItemKey, quantity ) );
```

### セレクト送料

このアクションは、カートの配送料金を選択するために使用されます。

#### _Parameters_

-   _rateId_ `string`: 選択する配送料金のID。
-   _packageId_ `number | string` (デフォルト: `null`): 配送料金内で選択されるパッケージのキー。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( selectShippingRate( rateId, packageId ) );
```

### SetBillingAddress

このアクションは、カートの請求先住所をサーバーに送信するupdateCustomerDataとは対照的に、ローカルに設定するために使用されます。

#### _Parameters_

- _billingAddress_ `object`: 設定が必要な請求先住所。キーは以下のとおりです。
    - _first_name_ `string`: 名。
    - _last_name_ `string`: 姓。
    - _company_ `string`: 会社名。
    - _address_1_ `string`: 住所1行目。
    - _address_2_ `string`: 住所2行目。
    - _city_ `string`: 市区町村名。
    - _state_ `string`: 州名。
    - _postcode_ `string`: 郵便番号。
    - _country_ `string`: 国名。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setBillingAddress( billingAddress ) );
```

### 配送先住所

このアクションは、カートの配送先住所をサーバーに送信する updateCustomerData とは対照的に、カートの配送先住所をローカルに設定するために使用されます。

#### _Parameters_

- _shippingAddress_ `object`: 設定する配送先住所。キーは以下のとおりです。
    - _first_name_ `string`: 名。
    - _last_name_ `string`: 姓。
    - _company_ `string`: 会社名。
    - _address_1_ `string`: 住所1行目。
    - _address_2_ `string`: 住所2行目。
    - _city_ `string`: 市区町村名。
    - _state_ `string`: 州名。
    - _postcode_ `string`: 郵便番号。
    - _country_ `string`: 国名。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setShippingAddress( shippingAddress ) );
```

### 顧客データの更新

このアクションは、顧客の配送先住所や請求先住所を更新し、更新されたカートを返すために使用されます。

#### _Parameters_

- _customerData_ `object`: 顧客の請求先住所と配送先住所。キーは以下のとおりです。
    - _shippingAddress_ `object`: 以下のキーを持つ配送先住所。
        - _first_name_ `string`: 名。
        - _last_name_ `string`: 姓。
        - _company_ `string`: 会社名。
        - _address_1_ `string`: 住所1行目。
        - _address_2_ `string`: 住所2行目。
        - _city_ `string`: 市区町村名。
        - _state_ `string`: 州名。
        - _postcode_ `string`: 郵便番号。
        - _country_ `string`: 国名。
    - _billingAddress_ `object`: 請求先住所（配送先住所と同じキー）。
- `editing: boolean` (デフォルト: `true`): 住所が編集中の場合、応答からストア内の顧客データは更新されません。

#### _例_

```js
const { dispatch } = useDispatch( cartStore );
dispatch( updateCustomerData( customerData, editing ) );
```

## セレクタ

### getCartData

状態の Cart データを返します。

#### _Returns_ 

- `object`: 以下のキーを持つ現在のカートデータ:
    - _coupons_ `array`: カート内のクーポン商品。
    - _shippingRates_ `array`: カートの配送料（`getShippingRates` セレクターを参照）。
    - _shippingAddress_ `object`: 配送先住所（`getCustomerData` セレクターを参照）。
    - _billingAddress_ `object`: 請求先住所。
    - _items_ `array`: カート内の商品。
    - _itemsCount_ `number`: カート内の商品の合計数。
    - _itemsWeight_ `number`: カート内の商品の合計重量。
    - _crossSells_ `array`: クロスセル商品。
    - _needsPayment_ `boolean`: カートで支払いが必要かどうか。
    - _needsShipping_ `boolean`: カートに配送料が必要かどうか。
    - _hasCalculatedShipping_ `boolean`: カートに配送料が計算されているかどうか。
    - _fees_ `array`: カートの手数料。
    - _totals_ `object`: カートの合計金額（`getCartTotals` セレクターを参照）。
    - _errors_ `array`: カートのエラー（`getCartErrors` セレクターを参照）。
    - _paymentRequirements_ `object`: カートの支払い要件。
    - _extensions_ `object`: 拡張機能データ。

#### _例_

```js
const store = select( cartStore );
const cartData = store.getCartData();
```

### 顧客データ

配送先住所と請求先住所を州から返します。

#### _Returns_ 

- `object`: 現在の配送先住所と請求先住所。以下のキーを持ちます。
    - _shippingAddress_ `object`: 配送先住所。以下のキーを持ちます。
        - _first_name_ `string`: 名。
        - _last_name_ `string`: 姓。
        - _company_ `string`: 会社名。
        - _address_1_ `string`: 住所 1 行目。
        - _address_2_ `string`: 住所 2 行目。
        - _city_ `string`: 市区町村名。
        - _state_ `string`: 州名。
        - _postcode_ `string`: 郵便番号。
        - _country_ `string`: 国名。
    - _billingAddress_ `object`: 請求先住所（配送先住所と同じキー）。

#### _例_

```js
const store = select( cartStore );
const customerData = store.getCustomerData();
```

### 配送料金の取得

州(都道府県)からの送料を返します。

#### _Returns_ 

- `array`: 配送料。キーは以下のとおりです。
    - _id_ `string`: 配送料ID。
    - _label_ `string`: 配送料ラベル。
    - _cost_ `string`: 配送料。
    - _package_id_ `number`: 配送料パッケージID。
    - _meta_data_ `array`: 配送料メタデータ。キーは以下のとおりです。
        - _id_ `number`: 配送料メタデータID。
        - _key_ `string`: 配送料メタデータキー。
        - _value_ `string`: 配送料メタデータ値。
    - _taxes_ `array`: 配送料にかかる税金。

#### _例_

```js
const store = select( cartStore );
const shippingRates = store.getShippingRates();
```

### 発送

カートに配送が必要かどうかを問い合わせます。

#### _Returns_ 

-   `boolean`: カートに配送が必要な場合は真。

#### _例_

```js
const store = select( cartStore );
const needsShipping = store.getNeedsShipping();
```

### 送料を計算する

カートの送料が計算されているかどうかを問い合わせます。

#### _Returns_ 

-   `boolean`: 送料が計算されていれば真。

#### _例_

```js
const store = select( cartStore );
const hasCalculatedShipping = store.getHasCalculatedShipping();
```

### カート集計

状態からカートの合計を返します。

#### _Returns_ 

-   `object`: 現在のカートの合計: 
    -   _total_items_ `string`:割引、税金、送料を除いたカート内の商品の合計。
    -   _total_items_tax_ `string`:割引前の全商品の税金合計。
    -   _total_fees_ `string`:取引手数料の合計。
    -   _total_fees_tax_ `string`:取引手数料の合計に対する税金。
    -   _total_discount_ `string`:カートに適用された割引の合計。
    -   _total_discount_tax_ `string`:割引総額に適用される税金。
    -   _total_shipping_ `string`:合計送料。
    -   _total_shipping_tax_ `string`:合計送料に適用される税金。
    -   _total_tax_ `string`: カートに適用される合計税金。
    -   _total_price_ `string`:割引、税金、送料を含むカートの合計価格。
    -   _tax_lines_ `array`: 税金の行数: オブジェクトの `name`, `price`, `rate`: タックスライン。
    -   _currency_code_ `string`:カートの通貨コード。
    -   _currency_symbol_ `string`:カートの通貨記号。
    -   _currency_minor_unit_ `integer`:カートの通貨単位。
    -   _currency_decimal_separator_ `string`: カートの通貨小区切り文字。
    -   _currency_thousand_separator_ `string`: カートの通貨の 1000 の区切り文字。
    -   _currency_prefix_ `string`:カートの通貨プレフィックス。
    -   _currency_suffix_ `string`:カートの通貨サフィックス。

#### _例_

```js
const store = select( cartStore );
const cartTotals = store.getCartTotals();
```

### カートメタ

カートのメタデータを状態から返します。

#### _Returns_ 

-   `object`: 以下のキーを持つ現在のカートメタ: 
    -   _updatingCustomerData_ `boolean`: 顧客データ(請求先および/または配送先住所)が更新されている場合。
    -   _updatingSelectedRate_ `boolean`: 選択されたレートが更新されている場合。
    -   _isCartDataStale_ `boolean`: カートデータが古い場合。
    -   _applyingCoupon_ `string`: 適用中のクーポンコード。
    -   _removingCoupon_ `string`: 削除されるクーポンコード。

#### _例_

```js
const store = select( cartStore );
const cartMeta = store.getCartMeta();
```

### カートエラー

カートがAPIからカスタマーフェイシングエラーを受け取った場合、状態からカートエラーを返します。

#### _Returns_ 

- `array`: 以下のキーを持つカートエラー:
    - _code_ `string`: エラーコード。
    - _message_ `string`: エラーメッセージ。
    - _data_ `object`: APIレスポンスデータ。

#### _例_

```js
const store = select( cartStore );
const cartErrors = store.getCartErrors();
```

### IsApplyingCoupon

クーポンが適用されているかどうかを問い合わせる。

#### _Returns_ 

-   `boolean`: クーポンが適用されている場合は真。

#### _例_

```js
const store = select( cartStore );
const isApplyingCoupon = store.isApplyingCoupon();
```

### isCartDataStale

カートデータが古いかどうかを問い合わせる。

#### _Returns_ 

-   `boolean`: カートデータが古ければ真。

#### _例_

```js
const store = select( cartStore );
const isCartDataStale = store.isCartDataStale();
```

### 適用されるクーポン

適用されているクーポンコードを返します。

#### _Returns_ 

-   `string`: 適用されるクーポンコード。

#### _例_

```js
const store = select( cartStore );
const couponBeingApplied = store.getCouponBeingApplied();
```

### IsRemovingCoupon

クーポンが削除されたかどうかを問い合わせる。

#### _Returns_ 

-   `boolean`: クーポンが削除される場合は真。

#### _例_

```js
const store = select( cartStore );
const isRemovingCoupon = store.isRemovingCoupon();
```

### 削除されるクーポン

削除されたクーポンコードを返します。

#### _Returns_ 

-   `string`: 削除されるクーポンコード。

#### _例_

```js
const store = select( cartStore );
const couponBeingRemoved = store.getCouponBeingRemoved();
```

### カートアイテム( cartItemKey )

状態からカートアイテムを返します。

#### _Parameters_

-   _cartItemKey_ `string`:カートアイテムのキー。

#### _Returns_ 

- `object`: 以下のキーを持つカートアイテム:
    - _key_ `string`: カートアイテムのキー。
    - _id_ `number`: カートアイテムのID。
    - _catalog_visibility_ `string`: カタログの表示設定。
    - _quantity_limits_ `object`: 数量制限。
    - _name_ `string`: カートアイテムの名前。
    - _summary_ `string`: カートアイテムの概要。
    - _short_description_ `string`: カートアイテムの短い説明。
    - _description_ `string`: カートアイテムの説明。
    - _sku_ `string`: カートアイテムのSKU。
    - _low_stock_remaining_ `null` または `number`: 在庫残量。
    - _backorders_allowed_ `boolean`: バックオーダーの可否を示す。
    - _show_backorder_badge_ `boolean` : バックオーダーバッジを表示するかどうかを示します。
    - _sold_individually_ `boolean` : 商品が個別販売されているかどうかを示します。
    - _permalink_ `string`: カート商品のパーマリンク。
    - _images_ `array`: カート商品の画像。
    - _variation_ `array`: カート商品のバリエーション。
    - _prices_ `object`: 以下のキーを持つカート商品の価格。
        - _currency_code_ `string`: 通貨コード。
        - _currency_symbol_ `string`: 通貨記号。
        - _currency_minor_unit_ `number`: 通貨の小数点。
        - _currency_decimal_separator_ `string`: 通貨の小数点区切り文字。
        - _currency_thousand_separator_ `文字列`: 通貨の千の位の区切り文字。
        - _currency_prefix_ `文字列`: 通貨の接頭辞。
        - _currency_suffix_ `文字列`: 通貨の接尾辞。
        - _price_ `文字列`: カート商品の価格。
        - _regular_price_ `文字列`: カート商品の通常価格。
        - _sale_price_ `文字列`: カート商品のセール価格。
        - _price_range_ `文字列`: カート商品の価格帯。
    - _totals_ `オブジェクト`: カート商品の合計金額。以下のキーが含まれます。
        - _currency_code_ `文字列`: 通貨コード。
        - _currency_symbol_ `文字列`: 通貨記号。
        - _currency_minor_unit_ `数値`: 通貨の小単位。
        - _currency_decimal_separator_ `string`: 通貨の小数点区切り文字。
        - _currency_thousand_separator_ `string`: 通貨の千の位区切り文字。
        - _currency_prefix_ `string`: 通貨の接頭辞。
        - _currency_suffix_ `string`: 通貨の接尾辞。
        - _line_subtotal_ `string`: カート商品の小計。
        - _line_subtotal_tax_ `string`: カート商品の小計税。
        - _line_total_ `string`: カート商品の合計税。
        - _line_total_tax_ `string`: カート商品の合計税。

#### _例_

```js
const store = select( cartStore );
const cartItem = store.getCartItem( cartItemKey );
```

### isItemPendingQuantity( cartItemKey )

カートの商品が数量保留中かどうかを問い合わせます。

#### _Parameters_

-   _cartItemKey_ `string`:カートアイテムのキー。

#### _Returns_ 

-   `boolean`: カートアイテムが保留中の数量であれば真。

#### _例_

```js
const store = select( cartStore );
const isItemPendingQuantity = store.isItemPendingQuantity( cartItemKey );
```

### isItemPendingDelete( cartItemKey )

カートアイテムが削除待ちかどうかを問い合わせます。

#### _Parameters_

-   _cartItemKey_ `string`:カートアイテムのキー。

#### _Returns_ 

-   `boolean`: カートアイテムが削除待ちの場合は true。

#### _例_

```js
const store = select( cartStore );
const isItemPendingDelete = store.isItemPendingDelete( cartItemKey );
```

### isCustomerDataUpdating

顧客データが更新されているかどうかを照会します。

#### _Returns_ 

-   `boolean`: 顧客データが更新されている場合は真。

#### _例_

```js
const store = select( cartStore );
const isCustomerDataUpdating = store.isCustomerDataUpdating();
```

### 配送料金の更新のための住所フィールドである。

配送料金に影響する配送先フィールドが更新されているかどうかを照会します。
デフォルトでは、Store APIは以下の配送先フィールドを配送料金の計算に必須であるとみなします: `state`、`country`、`postcode`、`city`。

#### _Returns_ 

-   `boolean`: 配送料金に影響する配送先フィールドが更新されている場合は真。

#### _例_

```js
const store = select( cartStore );
const isAddressFieldsForShippingRatesUpdating = store.isAddressFieldsForShippingRatesUpdating();
```

### hasPendingItemsOperations

保留中のカート操作 (項目の追加、数量の更新、削除) があるかどうかを問い合わせます。

#### _Returns_ 

-   `boolean`: 保留中のカート操作(商品の追加、数量の更新、商品の削除)がある場合は真。

#### _例_

```js
const store = select( cartStore );
const hasPendingItemsOperations = store.hasPendingItemsOperations();
```

### 選択されている送料

送料が選択されているかどうかを照会します。

#### _Returns_ 

-   `boolean`: 配送料金が選択されている場合は真。

#### _例_

```js
const store = select( cartStore );
const isShippingRateBeingSelected = store.isShippingRateBeingSelected();
```

### getItemsPendingQuantityUpdate

現在数量が更新されているアイテムのアイテムキーを取得します。

#### _Returns_ 

-   `string[]`: 現在数量が更新されているアイテムのアイテムキーを持つ配列。

#### _例_

```js
const store = select( cartStore );
const itemsPendingQuantityUpdate = store.getItemsPendingQuantityUpdate();
```

### 取得項目保留削除（getItemsPendingDelete

現在削除中のアイテムのアイテムキーを取得します。

#### _Returns_ 

-   `string[]`: 現在削除されているアイテムのキーを持つ配列。

#### _例_

```js
const store = select( cartStore );
const itemsPendingDelete = store.getItemsPendingDelete();
```
