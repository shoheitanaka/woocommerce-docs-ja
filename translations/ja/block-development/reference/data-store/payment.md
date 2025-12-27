---
sidebar_label: Payment Store
---
# 決済ストア (`wc/store/payment`) 

## 概要

支払データストアは、支払方法データと支払処理情報を保存するために使用されます。支払いステータスが変更されると、データストアに反映されます。

**⚠️ 現在、すべてのアクションは内部専用です。どのアクションがエクステンションのインタラクションとして有用かを判断している間です。私たちは、拡張機能がこのデータストアにアクションをディスパッチすることをまだ推奨していません。

ペイメントデータストアに保持されるデータの例を以下に示す。この例では、複数のペイメントゲートウェイがアクティブで、トークンが保存されている状態を示しています。

```js
{
    status: 'idle',
    activePaymentMethod: 'stripe',
    activeSavedToken: '1',
    availablePaymentMethods: {
      bacs: {
        name: 'bacs'
      },
      cheque: {
        name: 'cheque'
      },
      cod: {
        name: 'cod'
      },
      stripe: {
        name: 'stripe'
      }
    },
     availableExpressPaymentMethods: {
      payment_request: {
        name: 'payment_request'
      }
    },
    savedPaymentMethods: {
      cc: [
        {
          method: {
            gateway: 'stripe',
            last4: '4242',
            brand: 'Visa'
          },
          expires: '12/32',
          is_default: true,
          actions: {
            'delete': {
              url: 'https://store.local/checkout/delete-payment-method/1/?_wpnonce=123456',
              name: 'Delete'
            }
          },
          tokenId: 1
        }
      ]
    },
    paymentMethodData: {
      token: '1',
      payment_method: 'stripe',
      'wc-stripe-payment-token': '1',
      isSavedToken: true
    },
    paymentResult: null,
    paymentMethodsInitialized: true,
    expressPaymentMethodsInitialized: true,
    shouldSavePaymentMethod: false
}
```

## Usage

このストアを利用するには、`paymentStore` `StoreDescriptor` を参照するモジュールでインポートします。`@woocommerce/block-data`が`wc.wcBlocksData`を指す外部として登録されていると仮定すると、このキーをインポートすることができます：

```js
const { paymentStore } = window.wc.wcBlocksData;
```

## セレクタ

### 状態

ペイメントストアの現在の状態を返します。

> 🚨 このセレクタを使う代わりに、フォーカスされたセレクタを使うべきです。このセレクタは、ユニットテストでセレクタをモックするためだけに使うべきです。

#### を返す。 

-   `object`：以下のプロパティを持つ決済ストアの現在の状態：
   	-  status_ `string`：決済プロセスの現在の状態。取り得る値は以下のとおり：`idle`、`started`、_inline_code_4__、_inline_code_5__、_inline_code_6__、_inline_code_7__、_inline_code_8__。
   	-  _activePaymentMethod_`string`：アクティブな支払い方法のID。
   	-  _activeSavedToken`string`：アクティブなセーブドトークンのID。
   	-  _availablePaymentMethods_ `object`: 利用可能な支払い方法：利用可能な支払い方法。これは現在、支払い方法IDをキーとするオブジェクトです。各メンバーには、ペイメントメソッドIDを値とする`name`エントリーが含まれます。
   	-  _availableExpressPaymentMethods_`object`：利用可能なエクスプレス決済方法。これは現在、支払方法IDをキーとするオブジェクトです。各メンバーには、支払い方法IDを値とする`name`エントリが含まれます。
   	-  savedPaymentMethods_`object`：現在の顧客の保存された支払い方法。これはオブジェクトで、各支払方法に固有です。例として、Stripeの保存されたトークンは次のように返されます：
   	- paymentMethodData`object`：現在の支払い方法のデータ。paymentMethodData`object`：現在の支払い方法データ。これは各支払い方法に固有なので、ここでは詳細を説明できません。
   	- _paymentResult_ `object`:以下のプロパティを持つオブジェクト：
      		- message`string`：決済ゲートウェイから返されたメッセージ：ペイメントゲートウェイから返されるメッセージ。
      		- _paymentStatus_ `string`:支払いのステータス。とりうる値は以下のとおり：`success`、`failure`、`pending`、`error`、`not set`。
      		- _paymentDetails`object`：ペイメントゲートウェイから返される支払いの詳細。
      		- _redirectUrl_ `string`:チェックアウト完了後にリダイレクトするURL。
   	- __paymentMethodsInitialized_ `boolean`：支払い方法が初期化されていれば true、そうでなければ false。
   	- expressPaymentMethodsInitialized`boolean`：express の支払い方法が初期化されていれば true、そうでなければ false。
   	- _shouldSavePaymentMethod_`boolean`：支払い方法を保存する必要がある場合は true、そうでない場合は false。

#### 例 

```js
const store = select( paymentStore );
const currentState = store.getState();
```

### isPaymentIdle

ステータスが `idle` かどうかを問い合わせる。

#### を返す。 

-   `boolean`：支払いステータスが`idle`の場合は真、そうでない場合は偽。

#### 例 

```js
const store = select( paymentStore );
const isPaymentIdle = store.isPaymentIdle();
```

### isExpressPaymentStarted（エクスプレス・ペイメント開始

エクスプレス支払い方法がクリックされたかどうかを照会します。

#### を返す。 

-   `boolean`：エクスプレス支払い方法のボタンがクリックされた場合はtrue、そうでない場合はfalse。

#### 例 

```js
const store = select( paymentStore );
const isExpressPaymentStarted = store.isExpressPaymentStarted();
```

### isPaymentProcessing

ステータスが `processing` かどうかを問い合わせる。

#### を返す。 

-   `boolean`：支払いステータスが`processing`の場合は真、そうでない場合は偽。

#### 例 

```js
const store = select( paymentStore );
const isPaymentProcessing = store.isPaymentProcessing();
```

### isPaymentReady

ステータスが `ready` かどうかを問い合わせる。

#### を返す。 

-   `boolean`：支払いステータスが`ready`の場合は真、そうでない場合は偽。

#### 例 

```js
const store = select( paymentStore );
const isPaymentReady = store.isPaymentReady();
```

### hasPaymentError

ステータスが `error` かどうかを問い合わせる。

#### を返す。 

-   `boolean`：支払いステータスが`error`の場合は真、そうでない場合は偽。

#### 例 

```js
const store = select( paymentStore );
const hasPaymentError = store.hasPaymentError();
```

### isExpressPaymentMethodActive

エクスプレスペイメントメソッドがアクティブかどうかを返します。これは、エクスプレスペイメントメソッドが開いていて、ユーザー入力を受け付けているときに真になります。Google Pay の場合はモーダルが開いているときですが、他の支払い方法では UI が異なる場合があります。

#### を返す。 

-   `boolean`：エクスプレス支払い方法が有効かどうか。

#### 例 

```js
const store = select( paymentStore );
const isExpressPaymentMethodActive = store.isExpressPaymentMethodActive();
```

### getActiveSavedToken

アクティブな保存済みトークンを返します。顧客がアカウントに保存した支払い方法には、トークンが関連付けられています。これらのいずれかが選択されている場合、このセレクタは現在アクティブなトークンを返します。選択されていない場合は、空の文字列が返されます。

#### を返す。 

-   `string`：アクティブなセーブドトークンのID。セーブドトークンが選択されていない場合は空文字列。

#### 例 

```js
const store = select( paymentStore );
const activeSavedToken = store.getActiveSavedToken();
```

### getActivePaymentMethod。

アクティブな支払方法のIDを返します。

#### を返す。 

-   `string`：アクティブな支払い方法のID。

#### 例 

```js
const store = select( paymentStore );
const activePaymentMethod = store.getActivePaymentMethod();
```

### 利用可能な支払い方法

利用可能な支払方法を返します。エクスプレス決済は含まれません。

#### を返す。 

-   `object`：利用可能な支払い方法。これは現在、支払方法IDをキーとするオブジェクトである。各メンバーは`name`エントリーを持ち、その値として支払い方法IDを持ちます。

#### 例 

```js
const store = select( paymentStore );
const availablePaymentMethods = store.getAvailablePaymentMethods();
```

`availablePaymentMethods`は次のようになる：

```js
{
    "cheque": {
        name: "cheque",
    },
    "cod": {
        name: "cod",
    },
    "bacs": {
        name: "bacs",
    },
}
```

### getAvailableExpressPaymentMethods（利用可能なエクスプレス支払方法

利用可能なエクスプレス支払方法を返します。

#### を返す。 

-   `object`：利用可能なエクスプレス支払方法。これは現在、支払方法IDをキーとするオブジェクトです。各メンバーには、`name`エントリーがあり、その値として支払い方法IDが含まれます。

#### 例 

```js
const store = select( paymentStore );
const availableExpressPaymentMethods =
	store.getAvailableExpressPaymentMethods();
```

`availableExpressPaymentMethods`は次のようになる：

```js
{
    "payment_request": {
        name: "payment_request",
    },
    "other_express_method": {
        name: "other_express_method",
    },
}
```

### getPaymentMethodData

現在の支払方法のデータを返します。これは、アクティブな支払方法が変更されるたびに変更され、支払方法ごとに永続化されません。たとえば、顧客がPayPalを選択している場合、支払い方法のデータはその支払い方法に固有のものになります。顧客がStripeに切り替えた場合、支払い方法のデータはStripeによって上書きされ、以前の値（PayPalが選択されていた場合）は使用できなくなります。

#### を返す。 

-   `object`：現在の支払方法データ。これは各支払方法に固有であるため、ここで詳細を提供することはできません。

#### 例 

```js
const store = select( paymentStore );
const paymentMethodData = store.getPaymentMethodData();
```

### getSavedPaymentMethods

現在の顧客について保存されているすべての支払方法を返します。

#### を返す。 

-   `object`：現在の顧客の保存された支払い方法。これはオブジェクトで、各支払い方法に固有です。例として、Stripeの保存されたトークンは次のように返されます：

```js
savedPaymentMethods: {
	cc: [
		{
			method: {
				gateway: 'stripe',
				last4: '4242',
				brand: 'Visa',
			},
			expires: '04/24',
			is_default: true,
			actions: {
				wcs_deletion_error: {
					url: '#choose_default',
					name: 'Delete',
				},
			},
			tokenId: 2,
		},
	];
}
```

#### 例 

```js
const store = select( paymentStore );
const savedPaymentMethods = store.getSavedPaymentMethods();
```

### getActiveSavedPaymentMethods

現在の顧客の保存された支払い方法のうち、有効なもの、つまり現在の注文の支払いに使用できるものを返します。

#### を返す。 

`object` - 現在の顧客に対して保存されている、有効な支払い方法。これはオブジェクトで、各支払方法に固有です。例として、Stripeの保存されたトークンは次のように返されます：

```js
activeSavedPaymentMethods: {
	cc: [
		{
			method: {
				gateway: 'stripe',
				last4: '4242',
				brand: 'Visa',
			},
			expires: '04/24',
			is_default: true,
			actions: {
				wcs_deletion_error: {
					url: '#choose_default',
					name: 'Delete',
				},
			},
			tokenId: 2,
		},
	];
}
```

#### 例 

```js
const store = select( paymentStore );
const activeSavedPaymentMethods = store.getActiveSavedPaymentMethods();
```

### getIncompatiblePaymentMethods（互換性のない支払い方法）。

Checkoutブロックと互換性のない支払い方法のリストを返します。

#### を返す。 

-   `object`：以下のプロパティを持つ互換性のない支払いメソッドのリスト、または支払いメソッドやエクスプレス支払いメソッドが初期化されていない場合は空のオブジェクト：
   	-  name_ `string`：支払方法の名前。

#### 例 

```js
const store = select( paymentStore );
const incompatiblePaymentMethods = store.getIncompatiblePaymentMethods();
```

### 支払方法を保存する。

支払い方法を顧客のアカウントに保存するかどうかを返します。

#### を返す。 

-   `boolean`：支払い方法を保存する場合はtrue、そうでない場合はfalse。

#### 例 

```js
const store = select( paymentStore );
const shouldSavePaymentMethod = store.getShouldSavePaymentMethod();
```

### paymentMethodsInitialized

支払い方法が初期化されているかどうかを返します。

#### を返す。 

-   `boolean`：支払い方法が初期化されていればtrue、そうでなければfalse。

#### 例 

```js
const store = select( paymentStore );
const paymentMethodsInitialized = store.paymentMethodsInitialized();
```

### expressPaymentMethodsInitialized

express の支払い方法が初期化されているかどうかを返します。

#### を返す。 

`boolean`：express の支払い方法が初期化されていれば true、そうでなければ false。

#### 例 

```js
const store = select( paymentStore );
const expressPaymentMethodsInitialized =
	store.expressPaymentMethodsInitialized();
```

### 支払結果

最後に支払いを試みた結果を返します。

#### を返す。 

-   `object`：以下のプロパティを持つオブジェクト：

```ts
{
	message: string;
	paymentStatus: 'success' | 'failure' | 'pending' | 'error' | 'not set';
	paymentDetails: Record< string, string > | Record< string, never >;
	redirectUrl: string;
}
```

#### 例 

```js
const store = select( paymentStore );
const paymentResult = store.getPaymentResult();
```

### (@非推奨) isPaymentPristine

ステータスが `pristine` かどうかを問い合わせる。

> ⚠️ このセレクタは非推奨であり、将来のリリースで削除される予定です。代わりに`isPaymentIdle`を使用してください。

#### を返す。 

-   `boolean`：支払いステータスが`pristine`の場合は真、そうでない場合は偽。

#### 例 

```js
const store = select( paymentStore );
const isPaymentPristine = store.isPaymentPristine();
```

### (@非推奨) isPaymentStarted

ステータスが `started` かどうかを問い合わせる。

> ⚠️ このセレクタは非推奨であり、将来のリリースで削除される予定です。代わりに`isExpressPaymentStarted`を使用してください。

#### を返す。 

-   `boolean`：支払いステータスが`started`の場合は真、そうでない場合は偽。

#### 例 

```js
const store = select( paymentStore );
const isPaymentStarted = store.isPaymentStarted();
```

### (@非推奨) isPaymentSuccess

ステータスが `success` かどうかを問い合わせる。

> ⚠️ このセレクタは非推奨であり、将来のリリースで削除される予定です。代わりに`isPaymentReady`を使用してください。

#### を返す。 

-   `boolean`：支払いステータスが`success`の場合は真、そうでない場合は偽。

#### 例 

```js
const store = select( paymentStore );
const isPaymentSuccess = store.isPaymentSuccess();
```

### (@非推奨) isPaymentFailed

ステータスが `failed` かどうかを問い合わせる。

> ⚠️ このセレクタは非推奨であり、将来のリリースで削除される予定です。代わりに`hasPaymentError`を使用してください。

#### を返す。 

-   `boolean`：支払いステータスが`failed`の場合は真、そうでない場合は偽。

#### 例 

```js
const store = select( paymentStore );
const isPaymentFailed = store.isPaymentFailed();
```

### (@非推奨) getCurrentStatus

支払いステータスを表すブール値を持つオブジェクトを返します。

> ⚠️ このセレクタは非推奨であり、将来のリリースで削除される予定です。上記のセレクタを使用してください。

#### を返す。 

-   `object`：現在の支払い状況：
    -   _isPristine_ `boolean`:isPristine`paymentStore`：支払い処理が開始されておらず、エラーもなく、終了していない場合は真。これは初期状態では真です。
    -   isStarted_ `boolean`：支払い処理が開始された場合、真。
    -   _isProcessing`boolean`：支払い処理中であれば真。
    -   hasError_ `boolean`: エラー：支払い処理でエラーが発生した場合は true。
    -   _hasFailed_`boolean`：支払い処理が失敗した場合に true。
    -   _isSuccessful_`boolean`：支払い処理が成功した場合に true。
    -   _isDoingExpressPayment_`boolean`：エクスプレス決済が有効な場合は true、そうでない場合は false。

#### 例 

```js
const store = select( paymentStore );
const currentStatus = store.getCurrentStatus();
```
