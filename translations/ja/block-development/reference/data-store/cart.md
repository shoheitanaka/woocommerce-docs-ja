---
sidebar_label: Cart store
---
# カートストア (`wc/store/cart`) 

> カートストアとレジストアの違いは何ですか？
>
> カートストア (`wc/store/cart`)** は、アイテム、顧客データ、クーポンなどのインタラクションを含む、ショッピングカートに関するデータを管理および取得します。
>
> チェックアウトストア (`wc/store/checkout`)** は、チェックアウトプロセス、顧客ID、注文ID、チェックアウトステータスに関連するデータを管理および取得します。

## 概要

カートストアは、WooCommerce ブロックのカート関連データを管理・取得するためのセレクタとメソッドのコレクションを提供します。カートの詳細情報の取得から、クーポンの適用や配送情報の更新といった顧客とのやり取りを管理する機能まで提供します。

## Usage

このストアを利用するには、`cartStore` `StoreDescriptor` を参照するモジュールでインポートします。`@woocommerce/block-data`が`wc.wcBlocksData`を指す外部として登録されていると仮定すると、`StoreDescriptor`をインポートすることができます：

```js
const { cartStore } = window.wc.wcBlocksData;
```

## Actions

### setCartData

このアクションは、ストアにカートデータを設定するために使用されます。

#### パラメーター 

-   __cartData_ `object`：以下のキーを持つ現在のカートデータ：
    -   _coupons_ `array`：カート内のクーポンアイテム。
    -   _shippingRates_`array`：カート内のクーポンアイテム：カートの配送料金(`getShippingRates`セレクタを参照)。
    -   配送先住所 `object`：配送先住所 (`getCustomerData` セレクタを参照ください)。
    -   請求先住所 (`object` セレクタを参照ください)：請求先住所 (`getCustomerData` セレクタを参照ください)。
    -   _items`array`：カートアイテム。
    -   _itemsCount_ `number`:カート内のアイテムの総数
    -   _itemsWeight_ `number`:カート内のアイテムの総重量。
    -   _crossSells_ `array`:クロスセルのアイテム。
    -   _needsPayment_ `boolean`:カートに支払いが必要な場合。
    -   _needsShipping_ `boolean`:カートに配送が必要な場合。
    -   _hasCalculatedShipping_`boolean`：カートに送料が計算されている場合。
    -   _fees`array`：カートの料金。
    -   合計 `object`: カートの合計金額：カートの合計 (`getCartTotals` セレクタを参照ください)。
    -   エラー `array`：カートのエラー (`getCartErrors` セレクタを参照ください)。
    -   _paymentRequirements`object`：カートの支払い条件。
    -   _extensions_ `object`:拡張機能のデータ。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setCartData( newCartData ) );
```

### setErrorData

このアクションは、ストアにエラーデータを設定するために使用される。

#### パラメーター 

-   _errorData_ `object`：ストアに設定する必要があるエラーデータ。
    -   code_ `string`: エラーコード：エラーコード。
    -   メッセージ `string`: エラーメッセージ：エラーメッセージ。
    -   data_ `object`: エラーメッセージ：追加のエラーデータ。これは、以下のキーを持つオプションのオブジェクトです：
        -   status_ `number`: エラーステータス：エラーステータス。
        -   params_ `string`: エラーパラメーター：エラーのパラメータ。
        -   _message_ `string`: エラーメッセージ：エラーメッセージ。
        -   cart_ `object`: カートデータ：カートデータ。これは以下のキーを持つオプションのオブジェクトです：
            -   _coupons_ `array`：カート内のクーポンアイテム。
            -   _shippingRates_`array`：カート内のクーポンアイテム：カートの配送料金(`getShippingRates`セレクタを参照)。
            -   配送先住所 (`object` セレクタを参照ください)：配送先住所 (`getCustomerData` セレクタを参照ください)。
            -   請求先住所 (`object` セレクタを参照ください)：請求先住所 (`getCustomerData` セレクタを参照ください)。
            -   _items__`array`：カートアイテム。
            -   _itemsCount_ `number`:カート内のアイテムの総数
            -   _itemsWeight_ `number`:カート内のアイテムの総重量。
            -   _crossSells_ `array`:クロスセルのアイテム。
            -   _needsPayment_ `boolean`:カートに支払いが必要な場合。
            -   _needsShipping_ `boolean`:カートに配送が必要な場合。
            -   _hasCalculatedShipping_`boolean`：カートに送料が計算されている場合。
            -   _fees`array`：カートの料金。
            -   合計 `object`: カートの合計金額：カート合計 (`getCartTotals` セレクタを参照ください)。
            -   エラー `array`：カートのエラー (`getCartErrors` セレクタを参照ください)。
            -   _paymentRequirements`object`：カートの支払い条件。
            -   _extensions_ `object`:拡張機能のデータ。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setErrorData( newErrorData ) );
```

### レシーブカートコンテンツ

このアクションは、提供されたカートでストアを更新する際に使用されるアクションオブジェクトを返します。顧客のアドレスは省略されるので、カートの項目と合計の更新だけが受け取られます。

#### パラメーター 

-   __cartContents_ `object`：カートコンテンツ API レスポンス。
    -   クーポン_ `array`：カート内のクーポンアイテム。
    -   配送料金 `array`: カートの配送料金 (`wc/store/checkout` を参照ください)：カートの配送料金(`getShippingRates`セレクタを参照)。
    -   配送先住所 `object`：配送先住所 (`getCustomerData` セレクタを参照ください)。
    -   請求先住所 (`object` セレクタを参照ください)：請求先住所 (`getCustomerData` セレクタを参照ください)。
    -   _items`array`：カートアイテム。
    -   _itemsCount_ `number`:カート内のアイテムの総数
    -   _itemsWeight_ `number`:カート内のアイテムの総重量。
    -   _crossSells_ `array`:クロスセルのアイテム。
    -   _needsPayment_ `boolean`:カートに支払いが必要な場合。
    -   _needsShipping_ `boolean`:カートに配送が必要な場合。
    -   _hasCalculatedShipping_`boolean`：カートに送料が計算されている場合。
    -   _fees`array`：カートの料金。
    -   合計 `object`: カートの合計金額：カートの合計 (`getCartTotals` セレクタを参照ください)。
    -   エラー `array`：カートのエラー (`getCartErrors` セレクタを参照ください)。
    -   _paymentRequirements`object`：カートの支払い条件。
    -   _extensions_ `object`:拡張機能のデータ。

#### を返す。 

-   `object`：以下のキーを持つアクションオブジェクト：
    -   _type_`string`：アクションタイプ。
    -   _cartContents`object`：次のキーを持つカートの中身：
        -   _coupons`array`：カートの中身：カート内のクーポンアイテム。
        -   _shippingRates_`array`：カートの配送料金 (`getShippingRates` セレクタを参照)。
        -   _items`array`：カートアイテム。
        -   _itemsCount_ `number`:カート内のアイテムの総数。
        -   _itemsWeight_ `number`:カート内のアイテムの総重量。
        -   _crossSells_ `array`:クロスセルのアイテム。
        -   _needsPayment_ `boolean`:カートに支払いが必要な場合。
        -   _needsShipping_ `boolean`:カートに配送が必要な場合。
        -   _hasCalculatedShipping_`boolean`：カートに送料が計算されている場合。
        -   _fees`array`：カートの料金。
        -   合計 `object`: カートの合計金額：カートの合計 (`getCartTotals` セレクタを参照ください)。
        -   エラー `array`：カートのエラー (`getCartErrors` セレクタを参照ください)。
        -   _paymentRequirements`object`：カートの支払い条件。
        -   _extensions_ `object`:拡張機能のデータ。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( receiveCartContents( newCartContents ) );
```

### クーポンを受け取る

このアクションは、クーポンが適用されるタイミングを追跡するために使用されるアクションオブジェクトを返します。

#### パラメーター 

-   _couponCode_ `string`:適用されるクーポンのコード。

#### を返す。 

-   `object`：以下のキーを持つアクションオブジェクト：
    -   _type_`string`：アクションタイプ。
    -   _couponCode_ `string`:適用されるクーポンのコード。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( receiveApplyingCoupon( couponCode ) );
```

### クーポンを受け取る

このアクションは、クーポンがいつ削除されたかを追跡するために使用されるアクションオブジェクトを返します。

#### パラメーター 

-   _couponCode_ `string`:削除されるクーポンのコード。

#### を返す。 

-   `object`：以下のキーを持つアクションオブジェクト：
    -   _type_`string`：アクションタイプ。
    -   _couponCode_ `string`:削除されるクーポンのコード。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( receiveRemovingCoupon( couponCode ) );
```

### レシーブカートアイテム

このアクションは、カート内の特定のアイテムを更新するために使用されます。

#### パラメーター 

-   _cartResponseItem`object`：以下のキーを持つカート・レスポンス・オブジェクト：
    -   __cartItem_ `object`：カートアイテム(`getCartItem`セレクタを参照)。

#### を返す。 

-   `object`：以下のキーを持つアクションオブジェクト：
    -   _type_`string`：アクションタイプ。
    -   _cartItem`object`：カートアイテム：カートアイテム(`getCartItem`セレクタを参照)。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( receiveCartItem( CartResponseItem ) );
```

### itemIsPendingQuantity

このアクションは、指定されたカートアイテムの数量が更新されているかどうかを示すアクションオブジェクトを返します。

#### パラメーター 

-   _cartItemKey_ `string`:カートアイテムのキー。
-   _isPending_ `boolean` (デフォルト: `true`)：カートアイテムの数量が更新中かどうか。

#### を返す。 

-   `object`：以下のキーを持つアクションオブジェクト：
    -   _type_`string`：アクションタイプ。
    -   _cartItemKey_ `string`:カートアイテムのキー。
    -   _isPending_`boolean`：カートアイテムの数量が更新中かどうか。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( itemIsPendingQuantity( cartItemKey, isPending ) );
```

### itemIsPendingDelete

このアクションは、指定されたカートアイテムが削除されているかどうかを示すアクションオブジェクトを返します。

#### パラメーター 

-   _cartItemKey_ `string`:カートアイテムのキー。
-   _isPending_ `boolean` (デフォルト: `true`)：カートアイテムが削除されるかどうか。

#### を返す。 

-   `object`：以下のキーを持つアクションオブジェクト：
    -   _type_`string`：アクションタイプ。
    -   _cartItemKey_ `string`:カートアイテムのキー。
    -   _isPending_`boolean`：カートアイテムのキー：カートアイテムが削除されるかどうか。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( itemIsPendingDelete( cartItemKey, isPending ) );
```

### setIsCartDataStale

このアクションは、カートデータが古くなっているかどうかを示すアクションオブジェクトを返します。

#### パラメーター 

-   __isCartDataStale_ `boolean` (デフォルト: `true`)：もし `lastCartUpdate` のタイムスタンプが wcSettings 内のものより新しい場合は true。

#### を返す。 

-   `object`：以下のキーを持つアクションオブジェクト：
    -   _type_`string`：アクションタイプ。
    -   _isCartDataStale_`boolean`：もし `lastCartUpdate` のタイムスタンプが wcSettings 内のものより新しい場合は true。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setIsCartDataStale( isCartDataStale ) );
```

### 顧客データの更新

このアクションは、顧客データ(請求先住所および/または配送先住所)が更新されているかどうかを示すアクションオブジェクトを返します。

#### パラメーター 

-   _isResolving_ `boolean`:顧客データが更新されているかどうか。

#### を返す。 

-   `object`：以下のキーを持つアクションオブジェクト：
    -   _type_`string`：アクションタイプ。
    -   _isResolving_ `boolean`:顧客データが更新されているかどうか。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( updatingCustomerData( isResolving ) );
```

### 選択されている配送料金

このアクションは、送料が選択されているかどうかを示すアクションオブジェクトを返します。

#### パラメーター 

-   _isResolving_ `boolean`:配送料金が選択されていれば真。

#### を返す。 

-   `object`：以下のキーを持つアクションオブジェクト：
    -   _type_`string`：アクションタイプ。
    -   _isResolving_ `boolean`:配送料金が選択されている場合は真。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( shippingRatesBeingSelected( isResolving ) );
```

### applyExtensionCartUpdate

このアクションは、/cart/extensions エンドポイントに拡張機能から提供されたデータを POST リクエストとして送信するために使用されます。

#### パラメーター 

-   __args_ `object`：以下のキーを持つリクエストの引数：
    -   _extensionId_ `string`:エクステンションID。
    -   data_ `object`: エンドポイントに送信するデータ：エンドポイントに送信するデータ：
        -   key_ `string`: 拡張機能のキー：拡張機能のキー。
        -   __value_ `string`: 拡張機能のキー：拡張機能の値。
    -   overwriteDirtyCustomerData`boolean`：クライアント内の顧客データを、ダーティ(まだサーバーにプッシュされていない)であってもサーバーから返されたデータで上書きするかどうか。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( applyExtensionCartUpdate( args ) );
```

### クーポン適用

このアクションは、カートにクーポンを適用するために使用されます。

#### パラメーター 

-   _couponCode_ `string`:適用するクーポンのコード。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( applyCoupon( couponCode ) );
```

### クーポンの削除

このアクションは、カートからクーポンを削除するために使用されます。

#### パラメーター 

-   _couponCode_ `string`:削除するクーポンのコード。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( removeCoupon( couponCode ) );
```

### カートに入れる

このアクションはカートに商品を追加するために使用されます。

#### パラメーター 

-   _productId_`number`：カートに入れる商品ID。
-   数量_ `number` (デフォルト: `1`)：追加する商品の数量。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( addItemToCart( productId, quantity ) );
```

### RemoveItemFromCart

このアクションは、カートから商品を削除するために使用されます。

#### パラメーター 

-   _cartItemKey_ `string`:カート項目が更新されました。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( removeItemFromCart( cartItemKey ) );
```

### ChangeCartItemQuantity

このアクションはカート内の商品の数量を変更するために使用されます。

#### パラメーター 

-   _cartItemKey_ `string`:更新中のカートアイテムです。
-   _quantity`number`：アイテムの数量。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( changeCartItemQuantity( cartItemKey, quantity ) );
```

### セレクト送料

このアクションは、カートの配送料金を選択するために使用されます。

#### パラメーター 

-   _rateId_ `string`：選択する配送料金のID。
-   _packageId_ `number | string` (デフォルト: `null`)：配送料金内で選択されるパッケージのキー。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( selectShippingRate( rateId, packageId ) );
```

### SetBillingAddress

このアクションは、カートの請求先住所をサーバーに送信するupdateCustomerDataとは対照的に、ローカルに設定するために使用されます。

#### パラメーター 

-   _billingAddress`object`：設定が必要な請求先住所。キーは以下の通り：
    -   _first_name_ `string`:姓。
    -   姓 `string`: 姓：姓。
    -   company_ `string`: 会社名：会社名。
    -   住所_1_ `string`：住所1行目。
    -   住所2_ `string`：住所2行目。
    -   city_ `string`: 都市名：都市名。
    -   state_ `string`: 都道府県名：州名。
    -   postcode_ `string`: 郵便番号：郵便番号。
    -   国名 `string`: 国名：国名。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setBillingAddress( billingAddress ) );
```

### 配送先住所

このアクションは、カートの配送先住所をサーバーに送信するupdateCustomerDataとは対照的に、カートの配送先住所をローカルに設定するために使用されます。

#### パラメーター 

-   shippingAddress`object`：設定が必要な配送先住所。キーは以下の通り：
    -   _first_name_ `string`:姓。
    -   姓 `string`: 姓：姓。
    -   company_ `string`: 会社名：会社名。
    -   住所_1_ `string`：住所1行目。
    -   住所2_ `string`：住所2行目。
    -   city_ `string`: 都市名：都市名。
    -   state_ `string`: 都道府県名：州名。
    -   postcode_ `string`: 郵便番号：郵便番号。
    -   国名 `string`: 国名：国名。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( setShippingAddress( shippingAddress ) );
```

### 顧客データの更新

このアクションは、顧客の配送先住所や請求先住所を更新し、更新されたカートを返すために使用されます。

#### パラメーター 

-   _customerData`object`：顧客の請求先住所と配送先住所。キーは以下の通りです：
    -   shippingAddress`object`：以下のキーを持つ配送先住所：
        -   _first_name_ `string`:姓。
        -   姓 `string`: 姓：姓。
        -   company_ `string`: 会社名：会社名。
        -   住所_1_ `string`：住所1行目。
        -   住所2_ `string`：住所2行目。
        -   city_ `string`: 都市名：都市名。
        -   state_ `string`: 都道府県名：州名。
        -   postcode_ `string`: 郵便番号：郵便番号。
        -   国名 `string`: 国名：国名。
    -   billingAddress`object`：請求先住所 (配送先住所と同じキー)。
-   `editing: boolean` (デフォルト: `true`)：住所が編集されている場合は、レスポンスからストアの顧客データを更新しません。

#### 例 

```js
const { dispatch } = useDispatch( cartStore );
dispatch( updateCustomerData( customerData, editing ) );
```

## セレクタ

### getCartData

状態の Cart データを返します。

#### を返す。 

-   `object`：以下のキーを持つ現在のカートデータ：
    -   _coupons_`array`：カート内のクーポンアイテム。
    -   _shippingRates_`array`：カート内のクーポンアイテム：カートの配送料金(`getShippingRates`セレクタを参照)。
    -   配送先住所 `object`：配送先住所 (`getCustomerData` セレクタを参照ください)。
    -   billingAddress`object`：請求先住所。
    -   _items`array`：カートアイテム。
    -   _itemsCount_ `number`:カート内のアイテムの総数
    -   _itemsWeight_ `number`:カート内のアイテムの総重量。
    -   _crossSells_ `array`:クロスセルのアイテム。
    -   _needsPayment_ `boolean`:カートに支払いが必要な場合。
    -   _needsShipping_ `boolean`:カートに配送が必要な場合。
    -   _hasCalculatedShipping_`boolean`：カートに送料が計算されている場合。
    -   _fees`array`：カートの料金。
    -   合計 `object`: カートの合計金額：カートの合計 (`getCartTotals` セレクタを参照ください)。
    -   エラー `array`：カートのエラー (`getCartErrors` セレクタを参照ください)。
    -   _paymentRequirements`object`：カートの支払い条件。
    -   _extensions_ `object`:拡張機能のデータ。

#### 例 

```js
const store = select( cartStore );
const cartData = store.getCartData();
```

### 顧客データ

配送先住所と請求先住所を州から返します。

#### を返す。 

-   `object`：現在の配送先住所と請求先住所：
    -   __shippingAddress_`object`：次のキーを持つ配送先住所：
        -   _first_name_ `string`:姓。
        -   姓 `string`: 姓：姓。
        -   company_ `string`: 会社名：会社名。
        -   住所_1_ `string`：住所1行目。
        -   住所2_ `string`：住所2行目。
        -   city_ `string`: 都市名：都市名。
        -   state_ `string`: 都道府県名：州名。
        -   postcode_ `string`: 郵便番号：郵便番号。
        -   国名 `string`: 国名：国名。
    -   billingAddress`object`：請求先住所 (配送先住所と同じキー)。

#### 例 

```js
const store = select( cartStore );
const customerData = store.getCustomerData();
```

### 配送料金の取得

州からの送料を返します。

#### を返す。 

-   `array`：送料。キーは以下の通り：
    -   ID_ `string`：配送料金のID。
    -   label_ `string`：配送料金ラベル。
    -   _cost`string`：配送料金のコスト。
    -   _package_id_ `number`:配送料金パッケージID。
    -   メタデータ `array`: 配送料金のメタデータ：配送料金のメタデータ。キーは以下の通り：
        -   id`number`：配送料金メタデータのID。
        -   _key_ `string`：配送料金メタデータのキー。
        -   value`string`：配送料金メタデータの値。
    -   _taxes`array`：配送料金の税金。

#### 例 

```js
const store = select( cartStore );
const shippingRates = store.getShippingRates();
```

### 発送

カートに配送が必要かどうかを問い合わせます。

#### を返す。 

-   `boolean`：カートに配送が必要な場合は真。

#### 例 

```js
const store = select( cartStore );
const needsShipping = store.getNeedsShipping();
```

### 送料を計算する

カートの送料が計算されているかどうかを問い合わせます。

#### を返す。 

-   `boolean`：送料が計算されていれば真。

#### 例 

```js
const store = select( cartStore );
const hasCalculatedShipping = store.getHasCalculatedShipping();
```

### カート集計

状態からカートの合計を返します。

#### を返す。 

-   `object`：現在のカートの合計：
    -   _total_items_ `string`:割引、税金、送料を除いたカート内の商品の合計。
    -   _total_items_tax_ `string`:割引前の全商品の税金合計。
    -   _total_fees_ `string`:取引手数料の合計。
    -   _total_fees_tax_ `string`:取引手数料の合計に対する税金。
    -   _total_discount_ `string`:カートに適用された割引の合計。
    -   _total_discount_tax_ `string`:割引総額に適用される税金。
    -   _total_shipping_ `string`:合計送料。
    -   _total_shipping_tax_ `string`:合計送料に適用される税金。
    -   _total_tax`string`：カートに適用される合計税金。
    -   _total_price_ `string`:割引、税金、送料を含むカートの合計価格。
    -   オブジェクトの__tax_lines_ `array`：税金の行数：オブジェクトの `name`, `price`, `rate`: タックスライン。
    -   _currency_code_ `string`:カートの通貨コード。
    -   _currency_symbol_ `string`:カートの通貨記号。
    -   _currency_minor_unit_ `integer`:カートの通貨単位。
    -   _currency_decimal_separator`string`：カートの通貨小区切り文字。
    -   _currency_thousand_separator`string`：カートの通貨の 1000 の区切り文字。
    -   _currency_prefix_ `string`:カートの通貨プレフィックス。
    -   _currency_suffix_ `string`:カートの通貨サフィックス。

#### 例 

```js
const store = select( cartStore );
const cartTotals = store.getCartTotals();
```

### カートメタ

カートのメタデータを状態から返します。

#### を返す。 

-   `object`：以下のキーを持つ現在のカートメタ：
    -   _updatingCustomerData_`boolean`：顧客データ(請求先および/または配送先住所)が更新されている場合。
    -   _updatingSelectedRate_`boolean`：選択されたレートが更新されている場合。
    -   _isCartDataStale_`boolean`：カートデータが古い場合。
    -   _applyingCoupon_`string`：適用中のクーポンコード。
    -   _removingCoupon_`string`：削除されるクーポンコード。

#### 例 

```js
const store = select( cartStore );
const cartMeta = store.getCartMeta();
```

### カートエラー

カートがAPIからカスタマーフェイシングエラーを受け取った場合、状態からカートエラーを返します。

#### を返す。 

-   `array`：カートは以下のキーでエラー：
    -   コード_ `string`：エラーコード。
    -   メッセージ `string`: エラーメッセージ：エラーメッセージ。
    -   data_ `object`: APIレスポンスのデータ：API レスポンスのデータ。

#### 例 

```js
const store = select( cartStore );
const cartErrors = store.getCartErrors();
```

### IsApplyingCoupon

クーポンが適用されているかどうかを問い合わせる。

#### を返す。 

-   `boolean`：クーポンが適用されている場合は真。

#### 例 

```js
const store = select( cartStore );
const isApplyingCoupon = store.isApplyingCoupon();
```

### isCartDataStale

カートデータが古いかどうかを問い合わせる。

#### を返す。 

-   `boolean`：カートデータが古ければ真。

#### 例 

```js
const store = select( cartStore );
const isCartDataStale = store.isCartDataStale();
```

### 適用されるクーポン

適用されているクーポンコードを返します。

#### を返す。 

-   `string`：適用されるクーポンコード。

#### 例 

```js
const store = select( cartStore );
const couponBeingApplied = store.getCouponBeingApplied();
```

### IsRemovingCoupon

クーポンが削除されたかどうかを問い合わせる。

#### を返す。 

-   `boolean`：クーポンが削除される場合は真。

#### 例 

```js
const store = select( cartStore );
const isRemovingCoupon = store.isRemovingCoupon();
```

### 削除されるクーポン

削除されたクーポンコードを返します。

#### を返す。 

-   `string`：削除されるクーポンコード。

#### 例 

```js
const store = select( cartStore );
const couponBeingRemoved = store.getCouponBeingRemoved();
```

### カートアイテム( cartItemKey )

状態からカートアイテムを返します。

#### パラメーター 

-   _cartItemKey_ `string`:カートアイテムのキー。

#### を返す。 

-   `object`：以下のキーを持つカートアイテム：
    -   _key_`string`：カートアイテムのキー。
    -   _id_ `number`: カートアイテムのキー：カートアイテムのID。
    -   _catalog_visibility`string`：カタログの可視性。
    -   _quantity_limits`object`：数量制限。
    -   name_ `string`: カートアイテム名：カートアイテムの名前。
    -   概要 `string`: カートアイテムの概要：カートアイテムの概要。
    -   _short_description`string`：カートアイテムの短い説明。
    -   _description_ `string`:カートアイテムの説明。
    -   カートアイテムの説明：カートアイテムのsku。
    -   _low_stock_remaining_`null`または`number`：残りの在庫数。
    -   バックオーダーが許可されているかどうかを示す __backorders_allowed_ `boolean` 。
    -   バックオーダーのバッジを表示するかどうかを示す __show_backorder_badge_ `boolean` 。
    -   商品が個別に販売されているかどうかを示す __sold_individually_ `boolean` 。
    -   _permalink_ `string`:カートアイテムのパーマリンク。
    -   _images`array`：カートアイテムの画像。
    -   _variation_ `array`:カートアイテムのバリエーション。
    -   価格 `object`: カートアイテムの価格：カートアイテムの価格：
        -   _currency_code_ `string`:通貨コード。
        -   _currency_symbol_ `string`:通貨記号。
        -   _currency_minor_unit_ `number`:通貨の小単位。
        -   通貨小単位 __currency_decimal_separator_ `string`：通貨の小数点以下の区切り文字。
        -   通貨の千単位区切り文字：通貨の 1000 の区切り文字。
        -   _currency_prefix_ `string`:通貨のプレフィックス。
        -   _currency_suffix_ `string`:通貨のサフィックス。
        -   価格 `string`：カートアイテムの価格。
        -   _regular_price_ `string`:カート項目の通常価格。
        -   _sale_price_ `string`:カートアイテムのセール価格。
        -   _price_range_ `string`:カートアイテムの価格帯。
    -   合計 `object`: カートアイテムの合計：以下のキーを持つカートアイテムの合計：
        -   _currency_code_ `string`:通貨コード。
        -   _currency_symbol_ `string`:通貨記号。
        -   _currency_minor_unit_ `number`:通貨の小単位。
        -   通貨小単位 __currency_decimal_separator_ `string`: 通貨の十進区切り文字：通貨の小数の区切り文字。
        -   通貨の千単位区切り文字：通貨の 1000 の区切り文字。
        -   _currency_prefix_ `string`:通貨のプレフィックス。
        -   _currency_suffix_ `string`:通貨のサフィックス。
        -   _line_subtotal_ `string`:カートアイテムの行小計。
        -   _line_subtotal_tax_ `string`:カート項目行の小計税。
        -   _line_total_ `string`:カート項目行の合計。
        -   _line_total_tax_ `string`:カート項目行の合計税額。

#### 例 

```js
const store = select( cartStore );
const cartItem = store.getCartItem( cartItemKey );
```

### isItemPendingQuantity( cartItemKey )

カートの商品が数量保留中かどうかを問い合わせます。

#### パラメーター 

-   _cartItemKey_ `string`:カートアイテムのキー。

#### を返す。 

-   `boolean`：カートアイテムが保留中の数量であれば真。

#### 例 

```js
const store = select( cartStore );
const isItemPendingQuantity = store.isItemPendingQuantity( cartItemKey );
```

### isItemPendingDelete( cartItemKey )

カートアイテムが削除待ちかどうかを問い合わせます。

#### パラメーター 

-   _cartItemKey_ `string`:カートアイテムのキー。

#### を返す。 

-   `boolean`：カートアイテムが削除待ちの場合は true。

#### 例 

```js
const store = select( cartStore );
const isItemPendingDelete = store.isItemPendingDelete( cartItemKey );
```

### isCustomerDataUpdating

顧客データが更新されているかどうかを照会します。

#### を返す。 

-   `boolean`：顧客データが更新されている場合は真。

#### 例 

```js
const store = select( cartStore );
const isCustomerDataUpdating = store.isCustomerDataUpdating();
```

### 配送料金の更新のための住所フィールドである。

配送料金に影響する配送先フィールドが更新されているかどうかを照会します。
デフォルトでは、Store APIは以下の配送先フィールドを配送料金の計算に必須であるとみなします：`state`、`country`、`postcode`、`city`。

#### を返す。 

-   `boolean`：配送料金に影響する配送先フィールドが更新されている場合は真。

#### 例 

```js
const store = select( cartStore );
const isAddressFieldsForShippingRatesUpdating = store.isAddressFieldsForShippingRatesUpdating();
```

### hasPendingItemsOperations

保留中のカート操作 (項目の追加、数量の更新、削除) があるかどうかを問い合わせます。

#### を返す。 

-   `boolean`：保留中のカート操作(商品の追加、数量の更新、商品の削除)がある場合は真。

#### 例 

```js
const store = select( cartStore );
const hasPendingItemsOperations = store.hasPendingItemsOperations();
```

### 選択されている送料

送料が選択されているかどうかを照会します。

#### を返す。 

-   `boolean`：配送料金が選択されている場合は真。

#### 例 

```js
const store = select( cartStore );
const isShippingRateBeingSelected = store.isShippingRateBeingSelected();
```

### getItemsPendingQuantityUpdate

現在数量が更新されているアイテムのアイテムキーを取得します。

#### を返す。 

-   `string[]`：現在数量が更新されているアイテムのアイテムキーを持つ配列。

#### 例 

```js
const store = select( cartStore );
const itemsPendingQuantityUpdate = store.getItemsPendingQuantityUpdate();
```

### 取得項目保留削除（getItemsPendingDelete

現在削除中のアイテムのアイテムキーを取得します。

#### を返す。 

-   `string[]`：現在削除されているアイテムのキーを持つ配列。

#### 例 

```js
const store = select( cartStore );
const itemsPendingDelete = store.getItemsPendingDelete();
```
