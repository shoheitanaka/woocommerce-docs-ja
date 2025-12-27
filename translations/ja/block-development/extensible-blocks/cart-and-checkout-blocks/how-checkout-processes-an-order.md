---
post_title: How the checkout block processes an order
sidebar_label: Processing an order
sidebar_position: 1
---
# チェックアウトブロックがどのように注文を処理するか

このドキュメントでは、チェックアウトフローの内部構造について説明します。具体的には、ユーザーが "注文する "ボタンを押した後に何が起こるかについてです。

## 構造

以下の領域は、ユーザーのチェックアウト処理に関連しています。

### 決済レジストリ [(ファイル)](https://href.li/?https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/blocks-registry/payment-methods/registry.ts#L1)

支払いレジストリは、各支払い方法のすべての設定情報を保存します。`registerPaymentMethod`関数と`registerExpressPaymentMethod `関数で新しい支払い方法を登録することができます。

### データストア

データストアは、アクティブな支払い方法、チェックアウトのエラーの有無など、ユーザーのセッション中に変更される可能性のあるデータを追跡するために使用されます。これらのデータストアを関心のある領域ごとに分割し、チェックアウトに関連する2つのデータストアがあります：`wc/store/checkout` [(file)](https://href.li/?https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/checkout/index.ts#L1) と `wc/store/payment` [(file)](https://href.li/?https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/payment-methods/index.ts#L1) 。データストアは`assets/js/data`フォルダにあります。

### コンテキスト

コンテキストは、チェックアウト・ブロックがデータを利用できるようにするために使用されます。これらのコンテキストはそれぞれ、フックを使用して、特定の領域に関連するデータと関数を提供します。例えば、`onPaymentSetup`ハンドラを`PaymentEventsContext`コンテキストから使いたい場合は、次のようにします：

```js
const { onPaymentSetup } = usePaymentEventsContext();
```

コンテキストのもう1つの仕事は、チェックアウト・ブロックの副作用を実行することです。通常は、`CheckoutEvents`と`PaymentEvents`がチェックアウトと支払いのデータストアの変更をリッスンし、いくつかのロジックに基づいてこれらのストアにアクションをディスパッチします。

例えば、`CheckoutEvents`コンテキストでは、チェックアウトのステータスが`before_processing`のときに`emitValidateEvent`アクションをディスパッチします。これら2つのストアからのステータスや他のステートデータの変更に反応する多くの類似したロジックがあります。

チェックアウトのコンテキストは以下の通り：

| コンテキスト
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [CheckoutEvents](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/base/context/providers/cart-checkout/checkout-events/index.tsx#L4) | いくつかのチェックアウト関連のイベントハンドラを提供します。
| [ PaymentEvents ](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/base/context/providers/cart-checkout/payment-methods/payment-method-events-context.tsx#L3) | 支払いに関連するイベントハンドラを提供します。
| [ CustomerData ](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/base/context/providers/cart-checkout/customer/index.tsx#L1) | 現在の顧客に関連するデータを提供します。
| [ ShippingData ](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/base/context/providers/cart-checkout/shipping/index.js#L1) | 配送エラーに関するデータとアクションを提供します。

### チェックアウト・プロセッサー（checkout-processor.js）

チェックアウト処理コンポーネントは、チェックアウトまたは支払いデータストアの変更を購読し、このデータの一部をパッケージ化し、条件が整ったときにStoreApi `/checkout`エンドポイントを呼び出します。

## チェックアウト・プロバイダー

[チェックアウト・プロバイダー](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/assets/js/base/context/providers/cart-checkout/checkout-provider.js)は、上記のすべてのコンテキストを`CheckoutProcessor`コンポーネントにラップします。

---

## チェックアウト・ユーザーフロー

以下はチェックアウトの流れです。

### 1\.注文する」ボタンをクリックしてください。

チェックアウトのプロセスは、ユーザーがボタンをクリックしたときに開始されます。

### 2\.チェックアウトステータスが`before_processing`に設定されました[(ファイル)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/base/context/providers/cart-checkout/checkout-events/index.tsx#L167)

ユーザーが "注文する "ボタンをクリックするとすぐに、チェックアウトステータスを_"処理前"_に変更します。ここでチェックアウト情報のバリデーションを行います。

### 3\.INLINE_CODE_0__イベントを出す [(file)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/base/context/providers/cart-checkout/checkout-events/index.tsx#L113)

ここではWooCommerce Blocksプラグインや他のプラグインがバリデーションに対応するためのイベントリスナーを登録することができます。このイベントのイベントリスナーが実行され、エラーがあればチェックアウトステータスを`idle`に設定し、ユーザーにエラーを表示します。

エラーがなければ、次のステップ4に進む。

### 4\.チェックアウトステータスが`processing`に設定されました[(ファイル)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/checkout/thunks.ts#L76)

処理ステータスは、以下のステップ5で支払いステータスを変更するために使用されます。

### 5\.支払いステータスは `processing` [(ファイル)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/base/context/providers/cart-checkout/payment-methods/payment-method-events-context.tsx#L94) に設定されています。

すべてのチェックアウト処理が完了し、エラーがなければ、支払い処理が開始されます。

### 6\.INLINE_CODE_0__イベントを出す [(file)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/payment-methods/thunks.ts#L42)

`payment_processing`イベントが発生する。他のプラグインはこのイベントのイベントリスナーを登録し、独自のコードを実行することができます。

例えば、Stripeプラグインはここで住所と支払いの詳細をチェックし、Stripe APIを使用してStripe内で顧客と支払いの参照を作成します。

**重要：実際の支払いはここでは行われません**。 **これは、実際の支払いが試みられる前に、支払いプラグインのコードを実行するための前払いフックのように動作します。

### 7\.INLINE_CODE_0__イベントリスナーを実行し、支払いとチェックアウトの状態を設定する [(file)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/payment-methods/thunks.ts#L54-L132)

登録されたイベント・リスナーがエラーを返した場合、それをユーザーに表示します。

イベントリスナーが成功したとみなされた場合、チェックアウトのアドレスを支払いアドレスと同期させ、`paymentMethodData`を支払いストアに保存し、支払いステータスのプロパティ`{ isProcessing: true }`を設定します。

### 8\.INLINE_CODE_0__へのPOST [(ファイル)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/base/context/providers/cart-checkout/checkout-processor.js#L234)

支払いエラーがなければ、`/checkout` StoreApiエンドポイントが呼び出されます。これは、最終的な顧客の住所と選択された支払い方法、そして追加の支払いデータを受け取り、支払いを試みて結果を返します。

**重要：支払いはStoreApiを通じて行われ、クライアントから送信される`payment_processing`イベントを通じて行われるのではありません**。

### 9\.INLINE_CODE_0__アクションはチェックアウトストア[(ファイル)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/checkout/thunks.ts#L33)でトリガーされます。

StoreApi `/checkout` エンドポイントへのフェッチがレスポンスを返すと、これを `checkout` データストアの `processCheckoutResponse` アクションに渡す。

次のようなアクションを実行する：

-   注文完了後にリダイレクトするURLを設定します。
-   決済結果を`checkout`データストアに保存します。
-   チェックアウトステータスを`after_processing`に変更します (ステップ10)

### 10\.チェックアウトステータスが`after_processing`に設定されました[(ファイル)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/checkout/thunks.ts#L42)

`after_processing`ステータスは、メインのチェックアウト処理ステップが終了したことを示します。このステップでは、クリーンアップアクションを実行し、最後のステップで発生したエラーを表示します。

### 11\.INLINE_CODE_0__イベントを出す [(file)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/checkout/thunks.ts#L118-L128)

エラーがなければ、`checkout_after_processing_with_success`イベントが発生します。ここで、チェックアウトが成功した後に他のプラグインがコードを実行することができます。

`checkout_after_processing_with_success`イベントに登録されたイベント・リスナーが実行される。イベント・リスナーからのエラーがなければ、`checkout`データ・ストアで`setComplete`アクションが呼び出され、ステータスが`complete`に設定されます（ステップ13）。イベント・リスナーはここでエラーを返すこともでき、ユーザーに表示されます。

### 12\.INLINE_CODE_0__イベントを発行する [(file)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/checkout/thunks.ts#L104-L116)

ステップ5でエラーが発生した場合、`checkout_after_processing_with_error`イベントが発生します。他のプラグインは、ユーザーにエラーを表示するために、ここで実行するイベントリスナーを登録することができます。イベント・リスナーは処理され、ユーザーにエラーを表示します。

### 13\.チェックアウトステータスを`complete`に設定する [(ファイル)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/checkout/utils.ts#L146)

エラーがなければ、チェックアウト・データ・ストアの`status`プロパティは`complete`に変更されます。これはチェックアウト処理が完了したことを示します。

### 14\.リダイレクト [(ファイル)](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/base/context/providers/cart-checkout/checkout-processor.js#L193-L197)

チェックアウトステータスが`complete`に設定されると、チェックアウトデータストアに`redirectUrl`がある場合、ユーザーをURLにリダイレクトします。

## その他特筆すべきこと

### 支払い方法の確認

支払い方法は[設定オブジェクト](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/types/type-defs/payments.ts#L60-L83)に登録されます。これは`canMakePayment`という名前の関数を含んでいなければなりません。この関数は、支払い方法が現在のカートの支払いに使用できる場合、trueを返す必要があります。現在のカート(アイテム、住所、配送方法など)はこの関数に渡され、各支払い方法が使用可能かどうかを報告する責任を負います。

`checkPaymentMethodsCanPay()` [関数](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/payment-methods/check-payment-methods.ts#L26)は、登録されているすべての支払い方法を調べ、支払いが可能かどうかをチェックし、可能な場合は支払いデータストアの`availablePaymentMethods`プロパティに追加します。

`checkPaymentMethodsCanPay()`[function](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/payment-methods/check-payment-methods.ts#L26)は、実行可能なオプションとしてユーザーに表示される前に、支払い方法を検証するために、いくつかの場所で呼び出されなければなりません。

-   [カートが読み込まれたら](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/cart/index.ts#L46-L57)、支払い方法を表示できるようにしたいので、最初にそれらを検証する必要があります。
-   [カートが変更されたら](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/cart/index.ts#L42-L43)、特定の支払い方法を有効/無効にします。
-   [チェックアウトがロードされたら](https://github.com/woocommerce/woocommerce-blocks/blob/4af2c0916a936369be8a4f0044683b90b3af4f0d/assets/js/data/checkout/index.ts#L44-L49)、登録されているすべての支払い方法を検証したい
