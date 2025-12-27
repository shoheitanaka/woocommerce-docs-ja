---
sidebar_label: Checkout Store
---
# チェックアウトストア (`wc/store/checkout`) 

> カートストアとレジストアの違いは何ですか？
>
> カートストア (`wc/store/cart`)** は、アイテム、顧客データ、クーポンなどのインタラクションを含む、ショッピングカートに関するデータを管理および取得します。
>
> チェックアウトストア (`wc/store/checkout`)** は、チェックアウトプロセス、顧客ID、注文ID、チェックアウトステータスに関連するデータを管理および取得します。

## 概要

チェックアウトストアは、チェックアウトプロセス中のデータにアクセスし、管理するためのセレクタのコレクションを提供します。これらのセレクタにより、開発者は顧客情報、注文状況、その他のチェックアウト関連データなどの主要な詳細を取得することができます。

## Usage

このストアを利用するには、`checkoutStore` `StoreDescriptor` を参照するモジュールでインポートします。`@woocommerce/block-data`が`wc.wcBlocksData`を指す外部として登録されていると仮定すると、`StoreDescriptor`をインポートすることができます：

```js
const { checkoutStore } = '@woocommerce/block-data'
```

そうでない場合は、インポートすることができる：

```js
const { checkoutStore } = window.wc.wcBlocksData
```

## セレクタ

### 顧客ID

Checkoutブロックが現在注文を処理している顧客のWordPressユーザーIDを返します。

#### を返す。<!-- omit in toc -->

-   `number`：顧客のWordPressユーザーID。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const customerId = store.getCustomerId();
```

### getOrderId

チェックアウトブロックで現在処理中の注文のWooCommerce注文IDを返します。

#### を返す。<!-- omit in toc -->

-   `number`：WooCommerce の注文 ID。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const orderId = store.getOrderId();
```

### 注文書

注文書を返します。

#### を返す。<!-- omit in toc -->

-   `string`：注文時の注意事項。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const orderNotes = store.getOrderNotes();
```

### getRedirectUrl

チェックアウト完了後にリダイレクトするURLを返します。

#### を返す。<!-- omit in toc -->

-   `string`：リダイレクト先のURL。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const redirectUrl = store.getRedirectUrl();
```

### getExtensionData

エクステンションによって登録された追加データを返します。

#### を返す。<!-- omit in toc -->

-   `object`：エクステンションによって登録された追加データ。

```js
{
    [ extensionNamespace ]: {
        [ key ]: value,
    },
}
```

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const extensionData = store.getExtensionData();
```

### getCheckoutStatus

チェックアウトプロセスの現在のステータスを返します。

#### を返す。<!-- omit in toc -->

-   `string`：チェックアウトプロセスの現在のステータス。とりうる値：`pristine`、`before-processing`、_inline_code_3__、_inline_code_4__、_inline_code_5__、_inline_code_6__。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const checkoutStatus = store.getCheckoutStatus();
```

### getShouldCreateAccount

買い物客が注文時にアカウントを作成することを選択した場合、true を返します。

#### を返す。<!-- omit in toc -->

-   `boolean`：買い物客が注文時にアカウントを作成することを選択した場合は真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const shouldCreateAccount = store.getShouldCreateAccount();
```

### 配送を請求に使用する

買い物客が配送先住所を請求先住所として使用することを選択した場合、true を返します。

#### を返す。<!-- omit in toc -->

-   `boolean`：配送先住所を請求先住所として使用する場合は true。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const useShippingAsBilling = store.getUseShippingAsBilling();
```

### 請求先アドレスの編集

請求先住所が編集されている場合は true を返します。

#### を返す。<!-- omit in toc -->

-   `boolean`：請求先住所が編集されている場合は真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const editingBillingAddress = store.getEditingBillingAddress();
```

### 配送先住所の編集

配送先住所が編集中の場合はtrueを返します。

#### を返す。<!-- omit in toc -->

-   `boolean`：配送先住所が編集中の場合は真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const editingShippingAddress = store.getEditingShippingAddress();
```

### hasError

エラーが発生した場合はtrueを返し、そうでない場合はfalseを返します。

#### を返す。<!-- omit in toc -->

-   `boolean`：エラーが発生した場合は真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const hasError = store.hasError();
```

### hasOrder

ドラフト注文が作成されていればtrueを返し、そうでなければfalseを返す。

#### を返す。<!-- omit in toc -->

-   `boolean`：ドラフトオーダーが作成されていれば真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const hasOrder = store.hasOrder();
```

### isIdle

チェックアウトのステータスが`IDLE`の場合、このフラグはtrueになります。ブロックがロードされた後にチェックアウトのステータスが変更されると、チェックアウトはこのステータスになります。また、エラー処理後に購入を再試行できる場合もこのステータスになります。

#### を返す。<!-- omit in toc -->

-   `boolean`：チェックアウトが何らかのアクティビティを持ち、現在ユーザの入力を待っている場合、trueを返します。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const isIdle = store.isIdle();
```

### isBeforeProcessing

チェックアウトステータスが`BEFORE_PROCESSING`の場合、このフラグはtrueになります。ユーザが処理のためにチェックアウトを送信すると、チェックアウトはこのステータスになります。

#### を返す。<!-- omit in toc -->

-   `boolean`：注文が処理されようとしている場合に真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const isBeforeProcessing = store.isBeforeProcessing();
```

### isProcessing

チェックアウトのステータスが`PROCESSING`の場合、このフラグはtrueになります。`BEFORE_PROCESSING`ステータスのイベントに対するすべてのオブザーバがエラーなしで完了すると、チェックアウトはこのステータスになります。このステータスの間、ブロックは注文を処理するためにチェックアウトエンドポイントのサーバーにリクエストを送信します。

#### を返す。<!-- omit in toc -->

-   `boolean`：チェックアウトが処理中であれば真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const isProcessing = store.isProcessing();
```

### isAfterProcessing

チェックアウトのステータスが`AFTER_PROCESSING`の場合、このフラグはtrueになります。チェックアウトのステータスは、ブロックがサーバー側の処理リクエストからのレスポンスを受け取った後にこのステータスになります。

#### を返す。<!-- omit in toc -->

-   `boolean`：注文が処理されたばかりの場合に真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const isAfterProcessing = store.isAfterProcessing();
```

### isComplete

チェックアウトのステータスが`COMPLETE`の場合、このフラグはtrueになります。`AFTER_PROCESSING`ステータスの間に発生したイベントのオブザーバがすべて正常に完了した後、チェックアウトはこのステータスになります。チェックアウトがこのステータスの時、ショッパーのブラウザはその時点での`redirectUrl`の値(通常は`order-received`ルート)にリダイレクトされます。

#### を返す。<!-- omit in toc -->

-   `boolean`：注文が完了していれば真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const isComplete = store.isComplete();
```

### 計算中

これは、注文の合計が再計算される場合に当てはまります。クーポンの追加や削除、配送料金の更新、配送料金の選択などです。このフラグは、発生する可能性のあるすべてのアクティビティ（合計の計算に影響を与える可能性のあるサーバーへのリクエストを含む）を統合します。そのため、個々の状態をチェックする代わりに、このブール値がtrue(計算中)かfalse(計算中でない)かだけを確実にチェックすることができます。

#### を返す。<!-- omit in toc -->

-   `boolean`：値を更新するインフライトリクエストがあれば真。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const isCalculating = store.isCalculating();
```

### prefersCollection

顧客が注文の受け取りを希望する場合はtrueを返し、そうでない場合はfalseを返します。

#### を返す。<!-- omit in toc -->

-   _prefersCollection_ `boolean`：買い物客が注文の受け取りを希望する場合に true を返します。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const prefersCollection = store.prefersCollection();
```

### getRegisteredAutocompleteProviders

登録されている住所オートコンプリートプロバイダIDのリストを返します。

#### を返す。<!-- omit in toc -->

-   _addressAutocompleteProviders_ `string[]`：登録されている住所オートコンプリートプロバイダIDのリスト。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const addressAutocompleteProviders = store.getRegisteredAutocompleteProviders();
```

### getActiveAutocompleteProvider

指定されたアドレスタイプのアクティブなアドレスオートコンプリートプロバイダを返します。

#### パラメーター

-   type_ `'billing' | 'shipping'`：アドレスタイプ。

#### を返す。<!-- omit in toc -->

-   _activeAddressAutocompleteProvider`string`：渡された住所タイプの、現在アクティブな住所オートコンプリートプロバイダ。

#### 例<!-- omit in toc -->

```js
const store = select( checkoutStore );
const activeBillingProvider = store.getActiveAutocompleteProvider( 'billing' );
```

## Actions

### setPrefersCollection

`prefersCollection`フラグをtrueまたはfalseに設定する。

#### パラメーター<!-- omit in toc -->

-   _prefersCollection_ `boolean`：買い物客が注文の受け取りを希望する場合に true を返します。

#### 例<!-- omit in toc -->

```js
const store = dispatch( checkoutStore );
store.setPrefersCollection( true );
```

### 請求先アドレスの編集

請求先住所を編集状態または折りたたみ状態に設定します。住所に無効なフィールドがある場合、折りたたみ状態には設定されませんのでご注意ください。

#### パラメーター<!-- omit in toc -->

-   isEditing_ `boolean`：請求先住所を編集状態にするにはtrue、折りたたみ状態にするにはfalse。

#### 例<!-- omit in toc -->

```js
const store = dispatch( checkoutStore );
store.setEditingBillingAddress( true );
```

### 出荷先住所の編集

配送先住所を編集状態または折りたたみ状態に設定します。住所に無効なフィールドがある場合は、折りたたみ状態に設定されないことに注意してください。

#### パラメーター<!-- omit in toc -->

-   isEditing_ `boolean`：配送先住所を編集状態にする場合はtrue、折りたたみ状態にする場合はfalse。

#### 例<!-- omit in toc -->

```js
const store = dispatch( checkoutStore );
store.setEditingShippingAddress( true );
```

### addAddressAutocompleteProvider

住所オートコンプリート・プロバイダの追加 

#### パラメーター<!-- omit in toc -->

-   _providerId_ `string`:プロバイダー名。プロバイダーは`wc.addressAutocomplete.registerAddressAutocompleteProvider`で登録する必要があります。

#### 例<!-- omit in toc -->

```js
const store = dispatch( checkoutStore );
store.addAddressAutocompleteProvider( 'my-address-provider' );
```

### setActiveAddressAutocompleteProvider

住所オートコンプリート・プロバイダの追加 

#### パラメーター<!-- omit in toc -->

-   _providerId_ `string`:アクティブなオートコンプリート・プロバイダのIDを設定します。プロバイダーは `wc.addressAutocomplete.registerAddressAutocompleteProvider` で登録する必要があります。
-   _addressType_ `'billing' | 'shipping'`:このプロバイダがアクティブな住所タイプ。請求先と配送先が異なる場合があるため、国ごとに異なるプロバイダが存在する可能性があります。

#### 例<!-- omit in toc -->

```js
const store = dispatch( checkoutStore );
store.setActiveAddressAutocompleteProvider( 'my-address-provider', 'billing' );
```
