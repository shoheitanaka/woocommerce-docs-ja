---
post_title: Checkout flow and events
sidebar_label: Checkout flow and events
---
# チェックアウトの流れとイベント

このドキュメントでは、WooCommerceチェックアウトブロックにおけるチェックアウトのフローの概要と、一般的なアーキテクチャの概要を説明します。

チェックアウト・ブロックのアーキテクチャーは、以下の原則に基づいている：

-   チェックアウトフロー内のデータのための単一の真実のソース。
-   拡張機能の統合（例：支払い方法）に一貫したインターフェイスを提供します。このインターフェイスはチェックアウトプロセスの整合性を保護し、拡張ロジックをチェックアウトロジックから分離します。チェックアウトブロックは注文を処理するためのサーバとの全ての通信を処理します。エクステンションは提供されたインターフェイスを介してチェックアウトブロックに反応し、通信することができます。
-   チェックアウトフローの状態はチェックアウトステータスによって追跡されます。
-   エクステンションは発行されたイベントを購読することでチェックアウトフローと対話することができます。

以下は、その流れの概略である：

![チェックアウトの流れ](https://user-images.githubusercontent.com/1628454/113739726-f8c9df00-96f7-11eb-80f1-78e25ccc88cb.png)

## 一般概念

### フロー・スルー・ステータスの追跡

チェックアウトライフサイクルのどの時点においても、コンポーネントはチェックアウトフローの状態を正確に検出できなければなりません。これには以下のようなものが含まれます：

-   ローディング中？何がロードされていますか？
-   エラーはありますか？エラーは何ですか？
-   チェックアウトは合計を計算していますか？

単純なブーリアンを使用することは、場合によっては問題ありませんが、複雑な条件分岐やバグを起こしやすいコード（特に、さまざまなフロー状態に反応するロジック動作）につながることもあります。

フロー状態を表面化するために、ブロックはさまざまなコンテキストで追跡されるステータスを使用する。これらのステータスは、さまざまなアクションに反応して内部的に設定されるため、子コンポーネントに実装する必要はない（コンポーネントはステータスを設定するのではなく、ステータスを消費するだけでよい）。

チェックアウトには以下のステータスがあります。

#### チェックアウト・データ・ストア・ステータス

チェックアウトのデータストアには、セレクタを介して公開されるさまざまなステータスがあります。すべてのセレクタの詳細は、下記および[Checkout API docs](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/internal-developers/block-client-apis/checkout/checkout-api.md)に記載されています。

コンポーネント内で次のように使用できます。

```jsx
const { useSelect } = window.wp.data;
const { checkoutStore } = window.wc.wcBlocksData;

const MyComponent = ( props ) => {
	const isComplete = useSelect( ( select ) =>
		select( checkoutStore ).isComplete()
	);
	// do something with isComplete
};
```

ステータスに関連する以下のブーリアン・フラグが利用可能である：

**isIdle**：チェックアウトのステータスが`IDLE`の場合、このフラグはtrueになります。ブロックがロードされた後にチェックアウトのステータスが変更されると、チェックアウトはこのステータスになります。また、処理中にエラーが発生し、購入の再試行が可能な場合もこのステータスになります。

**isBeforeProcessing**：チェックアウトステータスが`BEFORE_PROCESSING`の場合、このフラグはtrueになります。ユーザが処理のためにチェックアウトを送信すると、チェックアウトはこのステータスになります。

**isProcessing**：チェックアウトのステータスが`PROCESSING`の場合、このフラグはtrueになります。`BEFORE_PROCESSING`ステータスのイベントに対するすべてのオブザーバがエラーなく完了すると、チェックアウトはこのステータスになります。このステータスの間、ブロックは注文を処理するためにチェックアウトエンドポイントのサーバーにリクエストを送信します。 **注意:** このステータスの間にも、チェックアウトの支払いステータスが変更されることがあります (`PaymentProvider` 公開ステータスのセクションで説明します)。

**isAfterProcessing**：チェックアウトのステータスが`AFTER_PROCESSING`の場合、このフラグはtrueになります。チェックアウトのステータスは、ブロックがサーバー側の処理リクエストからのレスポンスを受信した後にこのステータスになります。

**isComplete**：チェックアウトのステータスが`COMPLETE`の場合、このフラグはtrueになります。チェックアウトがこのステータスになるのは、`AFTER_PROCESSING`ステータスの間に発生したイベントのオブザーバがすべて正常に完了した後です。チェックアウトがこのステータスの場合、ショッパーのブラウザはその時点で`redirectUrl`の値(通常は`order-received`ルート)にリダイレクトされます。

#### 特別州

以下のブーリアンはチェックアウトプロバイダを通して公開されます。これらは互いに独立しており、チェックアウトステータスからも独立していますが、チェックアウトの様々なステータスに対応するために組み合わせて使用することができます。

##### **isCalculating**

`isCalculating`がtrueになるのは、注文の合計が再計算されるとき、またはプラグインが`disableCheckoutFor`アクションを使って意図的にチェックアウトを無効にするときです(次のセクションで説明します)。

クーポンが追加されたり削除されたり、送料が更新されたり、送料が選択されたりなど、合計の再計算をトリガーする可能性のあるものは数多くあります。これらの個々の状態をチェックする代わりに、このブール値がtrue（計算中）かfalse（計算中でない）かを確実にチェックすることができます。

`isCalculating`が影響するもの：

- チェックアウトブロックの「注文する」ボタンを無効にする
- カートブロックの「チェックアウトに進む」ボタンを無効にする
- 計算が保留されている間、エクスプレス決済メソッドのロード状態を表示する

###### `disableCheckoutFor` で `isCalculating` を制御する

`isCalculating`は、`disableCheckoutFor`サンクを使ってプログラムで制御できる：

```jsx
const { dispatch } = window.wp.data;
const { checkoutStore } = window.wc.wcBlocksData;

// Example: Disable checkout while performing an async operation
dispatch( checkoutStore ).disableCheckoutFor( async () => {
	// Your async operation here, e.g. validating data with an API
	await myAsyncOperation();
	// No need to return anything - we only care about the promise resolving
} );
```

thunkは内部状態を制御し、提供されたプロミスが解決するまで、それが成功しても失敗しても、クライアントがフローを完了しようとできないことを保証する。

##### **hasError**

`hasError`は、チェックアウト時にエラー状態が発生した場合にtrueになります。これは、バリデーションエラー、リクエストエラー、クーポンアプリケーションエラー、支払い処理エラーなどです。

### `ShippingProvider` 公開ステータス

配送コンテキストプロバイダはチェックアウトの配送に関連するすべてを公開します。この中には、配送コンテキストがどのようなエラー状態にあるのかを知らせるエラーステータスのセットが含まれており、エラー状態は住所の変更、料金の検索、選択に関するサーバーへのリクエストによって影響を受けます。

現在のところ、エラー・ステータスは`NONE`、_`INVALID_ADDRESS`、`UNKNOWN`のいずれかである（将来的に変更される可能性があることに注意）。

ステータスは、`useShippingDataContext`フックが提供する`currentErrorStatus`オブジェクトに公開される。このオブジェクトには以下のプロパティがある：

-   `isPristine`と`isValid`である：これらのブーリアンは両方とも同じエラー・ステータスに関連している。ステータスが`NONE`の場合、これらのブーリアンの値は`true`になります。これは基本的に出荷エラーがないことを意味する。
-   `hasInvalidAddress`：配送のために提供された住所が無効な場合、これは真になります。
-   `hasError`：配送のエラーステータスが`UNKNOWN`または`hasInvalidAddress`の場合、`true`となります。

### 支払方法 データストア状況

支払ステータスは支払データストアに保存されます。以下のセレクタでステータスを照会できます：

```jsx
const { select } = window.wp.data;
const { paymentStore } = window.wc.wcBlocksData;

const MyComponent = ( props ) => {
	const isPaymentIdle = select( paymentStore ).isPaymentIdle();
	const isExpressPaymentStarted =
		select( paymentStore ).isExpressPaymentStarted();
	const isPaymentProcessing = select( paymentStore ).isPaymentProcessing();
	const isPaymentReady = select( paymentStore ).isPaymentReady();
	const hasPaymentError = select( paymentStore ).hasPaymentError();

	// do something with the boolean values
};
```

ここでのステータスは、支払いに関する_client side_処理の現在の状態を通知するのに役立ち、チェックアウト処理サイクル中のさまざまな時点でストアアクションを介して更新されます。クライアントサイドとは、チェックアウトフォームが登録されたクライアントサイドコンポーネントを介して送信されたときに、登録されアクティブな支払い方法による支払いを処理する状態を意味します。ペイメントメソッドが注文処理中にサーバー側で追加処理を行う可能性はありますが、これらのステータスには反映されません（詳しくは[ペイメントメソッド統合doc](./payment-method-integration.md)をご覧ください）。

設定可能な内部ステータスは以下の通り：

-   `IDLE`：これはチェックアウトが初期化され、何もしていない支払いメソッドがある場合のステータスです。このステータスはチェックアウトのステータスが`IDLE`に変更されるたびに設定されます。
-   `EXPRESS_STARTED`： **Express Payment Methods Only** - このステータスは、ユーザーがエクスプレスペイメントメソッドのボタンをクリックすることによって、エクスプレスペイメントメソッドがトリガーされた場合に使用されます。このフローは処理の前に発生し、通常はモーダルウィンドウで表示されます。
-   `PROCESSING`：このステータスは、チェックアウトステータスが`PROCESSING`の場合、チェックアウト`hasError`がfalseの場合、チェックアウトが計算中でない場合、現在の支払いステータスが`FINISHED`でない場合に設定されます。このステータスが設定されると、支払い処理イベントエミッターがトリガーされます。
-   `READY`：このステータスは、支払い処理イベントにフックされたすべてのオブザーバーが正常に完了した後に設定される。`CheckoutProcessor`コンポーネントは、チェックアウト`PROCESSING`ステータスと一緒にこのステータスを使用し、注文を処理するためのデータをサーバーに送信し、支払いを受ける準備ができたことを知らせます。
-   `ERROR`：このステータスは、支払い処理イベントにフックされたオブザーバーがエラー応答を返した後に設定されます。これにより、チェックアウト`hasError`フラグがtrueに設定されます。

### 発光イベント

拡張性においてもう1つ厄介なことは、フロー内の特定のイベントに対して拡張機能が動作し、反応するための、意見を持ちながらも柔軟なインターフェースを提供することです。安定性のためには、コアとなるチェックアウトフローが、チェックアウト/オーダー処理に特化したサーバとのすべての通信を制御し、拡張機能固有の要件は拡張機能に任せることが重要です。これにより、拡張機能はチェックアウトフローにフックしている他の拡張機能に影響を与えることなく、必要に応じてチェックアウトデータやフローと予測可能なやりとりを行うことができます。

この種の拡張性を実装する最も確実な方法のひとつは、イベントシステムの使用である。このように、さまざまなコンテキスト・プロバイダーがある：

-   サブスクライバAPIを公開することで、エクステンションは自分が反応したいイベントに_オブザーバ_を登録することができます。
-   チェックアウトフローの特定のポイントでイベントを発行し、登録されたオブザーバにデータを送り、場合によっては、オブザーバからのレスポンスに応じて反応します。

このシステムでイベント・エミッターに登録されたオブザーバーに関しては、非常に重要なルール***がある。特定のコンポーネントにローカルな状態を更新することは問題ないが、コンテキストやグローバルな状態を更新することはできない。その理由は、オブザーバーのコールバックは特定のポイントで順次実行されるため、同じイベントに登録された後続のオブザーバーは、先に実行されたオブザーバーのグローバル/コンテキストステートの変更に反応しないからです。

```jsx
const unsubscribe = emitter( myCallback );
```

`emitter`関数に登録するエミッターを置き換えることができます。例えば、`onCheckoutValidation`イベント・エミッターを登録する場合、次のようになります：

```jsx
const unsubscribe = onCheckoutValidation( myCallback );
```

また、オブザーバーを実行する優先順位を指定することもできます。優先順位の低い方が優先順位の高い方より先に実行されるので、エミッタに登録されているオブザーバのスタックの中で、あなたのオブザーバが実行されるタイミングに影響を与えることができます。優先順位は第2引数の数字で指定します：

```jsx
const unsubscribe = onCheckoutValidation( myCallback, 10 );
```

この例では、`myCallback` がサブスクライバ関数です。サブスクライバ関数は、イベントエミッタからデータを受け取ることができ(下記のエミッタの詳細で説明)、特定の形のレスポンスを返すことが期待されます(これも特定のエミッタの詳細で説明)。サブスクライバ関数は `Promise` とすることができ、イベントエミッタが登録されたオブザーバを循環するとき、登録された Promise が解決するのを待ちます。

最後に、emitter 関数の呼び出しの戻り値は、unsubscribe 関数で、observer の登録を解除するために使用できます。これは、Reactコンポーネントのコンテキストで、コンポーネントのアンマウント時にオブザーバの登録を解除する必要がある場合に特に便利です。例えば、`useEffect` フックでの使用例です：

```jsx
const MyComponent = ( { onCheckoutValidation } ) => {
	useEffect( () => {
		const unsubscribe = onCheckoutValidation( () => true );
		return unsubscribe;
	}, [ onCheckoutValidation ] );
	return null;
};
```

*`Event Emitter Utilities`***。

イベントに関連して使用できるユーティリティ・メソッドがたくさんある。これらは`assets/js/base/context/event-emit/utils.ts`で利用可能で、以下のようにインポートできる：

```jsx
import {
	noticeContexts,
	responseTypes,
	shouldRetry,
} from '@woocommerce/base-context';
import {
	isSuccessResponse,
	isErrorResponse,
	isFailResponse,
} from '@woocommerce/types';
```

ヘルパー関数については後述する：

-   `isSuccessResponse`、`isErrorResponse`、`isFailResponse`：これらは、値を受け取り、そのオブジェクトが期待されるレスポンスのタイプであるかどうかをブール値で報告するヘルパー関数です。登録されたオブザーバーからレスポンスを受け取るイベントエミッターの場合、オブザーバーから返されたオブジェクトの `type` プロパティは、それがどのタイプのレスポンスであるかを示し、イベントエミッターはそのタイプに従って反応します。例えば、オブザーバーが`{ type: 'success' }`を返した場合、エミッターはそれを`isSuccessResponse`に送り、`true`を返します。これを実装した例を、[支払い処理イベントのエミットはこちら](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/34e17c3622637dbe8b02fac47b5c9b9ebf9e3596/assets/js/base/context/cart-checkout/payment-methods/payment-method-data-context.js#L281-L307)で見ることができます。
-   `noticeContexts`：これは、チェックアウトで通知をターゲットにできる領域を参照するプロパティを含むオブジェクトです。このオブジェクトには以下のプロパティがあります：
    -   `PAYMENTS`：inline_code_8__：支払い方法ステップの通知エリアへの参照です。
    -   `EXPRESS_PAYMENTS`：inline_code_9__：エクスプレス支払い方法ステップの通知エリアへの参照です。
-   `responseTypes`：これは、いくつかのイベントエミッターのオブザーバーが返すことができる様々なレスポンスタイプを参照するプロパティを含むオブジェクトです。これにより、型のオートコンプリートが容易になり、ヒューマンエラーによるタイプミスを避けることができます。型は `SUCCESS`, `FAIL`, `ERROR` です。これらのタイプの値は、[サーバからのチェックアウトエンドポイントレスポンス](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/34e17c3622637dbe8b02fac47b5c9b9ebf9e3596/src/RestApi/StoreApi/Schemas/CheckoutSchema.php#L103-L113)の[支払いステータスのタイプ](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/34e17c3622637dbe8b02fac47b5c9b9ebf9e3596/src/Payments/PaymentResult.php#L21)にも対応しています。
-   `shouldRetry`：これは、チェックアウトフローが、前回の支払いが失敗した後、ユーザーに支払いの再試行を許可すべきかどうかのロジックを含む関数です。`response`オブジェクトを受け取り、デフォルトでは`retry`プロパティがtrue/undefinedかfalseかをチェックします。詳細は[`onCheckoutSuccess`](#oncheckoutsuccess)のドキュメントを参照してください。

注: `noticeContexts`と`responseTypes`は、そのコンポーネントに与えられた`emitResponse`プロップを通して支払いメソッドに公開されます：

```jsx
const MyPaymentMethodComponent = ( { emitResponse } ) => {
	const { noticeContexts, responseTypes } = emitResponse;
	// other logic for payment method...
};
```

以下のイベントエミッタは、エクステンションがオブザーバを登録できる：

### `onCheckoutValidation`。

このイベントエミッターに登録されたオブザーバーは、引数として何も受け取りません。また、全てのオブザーバはチェックアウトがエミッタからのレスポンスを処理する前に実行されます。このエミッタに登録されたオブザーバは、チェックアウトに何も伝えることがない場合は`true`を返し、チェックアウトが`IDLE`の状態に戻ることを望む場合は`false`を返します：

-   `errorMessage`：これはチェックアウトコンテキストにエラー通知として追加されます。
-   `validationErrors`：これはチェックアウトフィールドのインラインバリデーションエラーとして設定されます。オブザーバーがバリデーションエラーをトリガーしたい場合、エラーに次のシェイプを使うことができます：
    -   これはオブジェクトで、キーは検証エラーの対象となるプロパティ名 (チェックアウトフィールドに対応します。例 `country` や `coupon`) で、値は検証の問題を説明するエラーメッセージです。

このイベントは、チェックアウトのステータスが`BEFORE_PROCESSING`であるときに発行されます(これは、チェックアウトフォームの送信がユーザーによってトリガーされた後、またはエクスプレス決済メソッドによってトリガーされた後のバリデーション時に発生します)。

すべてのオブザーバーがこのイベントに対して`true`を返した場合、チェックアウトのステータスは`PROCESSING`に変更されます。

このイベントエミッタサブスクライバは、`useCheckoutContext`フックを使用してチェックアウトコンテキストから取得するか、登録されたコンポーネントのpropとして支払いメソッドエクステンションに渡すことができます：

"内部開発のために:_

```jsx
import { useCheckoutContext } from '@woocommerce/base-contexts';
import { useEffect } from '@wordpress/element';

const Component = () => {
	const { onCheckoutValidation } = useCheckoutContext();
	useEffect( () => {
		const unsubscribe = onCheckoutValidation( () => true );
		return unsubscribe;
	}, [ onCheckoutValidation ] );
	return null;
};
```

_登録された支払い方法の構成要素について

```jsx
const { useEffect } = window.wp.element;

const PaymentMethodComponent = ( { eventRegistration } ) => {
	const { onCheckoutValidation } = eventRegistration;
	useEffect( () => {
		const unsubscribe = onCheckoutValidation( () => true );
		return unsubscribe;
	}, [ onCheckoutValidation ] );
};
```

"他のことについては

```jsx
const { onCheckoutValidation } = wc.blocksCheckoutEvents;

useEffect( () => {
	const unsubscribe = onCheckoutValidation( () => true );
	return unsubscribe;
}, [ onCheckoutValidation ] );
```

### ~~`onPaymentProcessing`~~。

これは非推奨となり、`onPaymentSetup` イベント・エミッターに置き換えられました。

### `onPaymentSetup`。

このイベントエミッターは、支払い方法のコンテキストステータスが`PROCESSING`であり、チェックアウトステータスが`PROCESSING`、チェックアウト`hasError`がfalse、チェックアウトが計算中でなく、現在の支払いステータスが`FINISHED`でない場合に、このステータスが設定されると発生しました。

このイベントエミッターは、登録されたオブザーバーを（引数として何も渡さずに）オブザーバーが真実ではない値を返すまで実行する。

ペイメントメソッドが真実ではない値を返したとき、有効なレスポンスタイプを返した場合、イベントエミッターはレスポンスに応じて様々な内部ステータスを更新します。以下は、エミッタによって処理される可能性のあるレスポンスタイプです：

#### 成功

ユーザーの入力したデータが正しく、支払いチェックが成功した場合、成功応答が与えられるべきである。レスポンスは、少なくともこの形状を持つオブジェクトであれば成功とみなされる：

```js
const successResponse = { type: 'success' };
```

成功応答が返されると、支払方法のコンテキストステータスは `SUCCESS` に変更される。さらに、追加プロパティのいずれかを含めると、追加のアクションが発生します：

-   `paymentMethodData`：このオブジェクトの内容は、チェックアウトが注文を処理するためにチェックアウトエンドポイントにリクエストを送信する際に、`payment_data`の値として含まれます。これは、支払い方法がサーバー側で追加処理を行う場合に便利です。
-   `billingAddress`：これにより、支払いメソッドはチェックアウトの請求データ情報(通常Express支払いメソッドで使用される)を更新し、サーバへのチェックアウト処理リクエストに含めることができます。このデータは[ここに概説されている形](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/assets/js/settings/shared/default-fields.ts)でなければなりません。
-   `shippingAddress`：これは、支払い方法が注文の配送データ情報を更新することを可能にします（通常、エクスプレス支払い方法によって使用されます）。このデータは[https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/assets/js/settings/shared/default-fields.ts]に記述します。

`billingAddress`または`shippingAddress`プロパティがレスポンスオブジェクトにない場合、データの状態はそのままになります。

#### Fail

決済処理にエラーが発生した場合、フェイル・レスポンスが返されます。レスポンスがこの形状のオブジェクトである場合、フェイル・レスポンスとみなされます：

```js
const failResponse = { type: 'failure' };
```

オブザーバーから fail レスポンスが返されると、支払方法のコンテキストステータスは `FAIL` に変更されます。さらに、以下のプロパティのいずれかを含めると、余分なアクションが発生します：

-   `message`：ここで指定した文字列がチェックアウト時のエラーメッセージとして設定されます。
-   `messageContext`：指定された場合、指定された領域をエラー通知の対象とします（ここで前述の`noticeContexts`が登場します）。そうでない場合は、 `noticeContexts.PAYMENTS` の領域に追加されます。
-   `paymentMethodData`：（成功応答の場合と同じです）。
-   `billingAddress`：（成功応答の場合と同じ）。

#### Error

チェックアウトフォームのユーザー入力にエラーがある場合、エラーレスポンスが返されます。レスポンスがこの形状のオブジェクトである場合、エラーレスポンスとみなされます：

```js
const errorResponse = { type: 'error' };
```

オブザーバーからエラー応答が返されると、支払方法のコンテキストステータスは `ERROR` に変更されます。さらに、以下のプロパティのいずれかを含めると、余分なアクションが発生します：

-   `message`：ここで指定された文字列がエラー通知として設定される。
-   `messageContext`：もし指定された場合、指定された領域をエラー通知の対象とする（ここで前述の`noticeContexts`が登場する）。そうでない場合は、 `noticeContexts.PAYMENTS` の領域に追加されます。
-   `validationErrors`：これはチェックアウトフィールドのインラインバリデーションエラーとして設定されます。オブザーバーがバリデーションエラーをトリガーしたい場合、エラーに以下のシェイプを使用することができます：
    -   これはオブジェクトで、キーは検証エラーの対象となるプロパティ名(チェックアウトフィールドに対応するもの、例えば`country`や`coupon`)、値は検証の問題を説明するエラーメッセージです。

レスポンスオブジェクトが上記の条件のいずれにも一致しない場合、フォールバックとして、支払いステータスを`SUCCESS`に設定する。

支払いステータスが`SUCCESS`に設定され、チェックアウトステータスが`PROCESSING`の場合、`CheckoutProcessor`コンポーネントが注文を処理するためにサーバーへのリクエストをトリガーします。

このイベントエミッタサブスクライバは、`usePaymentEventsContext`フックを使用してチェックアウトコンテキストから取得するか、登録されたコンポーネントのpropとして支払いメソッドエクステンションから取得することができます：

"内部開発のために:_

```jsx
import { usePaymentEventsContext } from '@woocommerce/base-contexts';
import { useEffect } from '@wordpress/element';

const Component = () => {
	const { onPaymentSetup } = usePaymentEventsContext();
	useEffect( () => {
		const unsubscribe = onPaymentSetup( () => true );
		return unsubscribe;
	}, [ onPaymentSetup ] );
	return null;
};
```

_登録された支払い方法の構成要素について

```jsx
const { useEffect } = window.wp.element;

const PaymentMethodComponent = ( { eventRegistration } ) => {
	const { onPaymentSetup } = eventRegistration;
	useEffect( () => {
		const unsubscribe = onPaymentSetup( () => true );
		return unsubscribe;
	}, [ onPaymentSetup ] );
};
```

### `onCheckoutSuccess`。

このイベントエミッタは、チェックアウトステータスが`AFTER_PROCESSING`で、チェックアウト`hasError`ステータスがfalseの場合に発生します。`AFTER_PROCESSING`ステータスは、チェックアウト処理リクエストに対するサーバからのレスポンスを受信した後、`CheckoutProcessor`コンポーネントによって設定されます。

このイベントエミッターに登録されたオブザーバーは、以下のオブジェクトを引数として受け取る：

```js
const onCheckoutProcessingData = {
	redirectUrl,
	orderId,
	customerId,
	orderNotes,
	paymentResult,
};
```

物件は以下の通り：

-   `redirectUrl`：これはサーバーの処理によって返される、チェックアウトのリダイレクト先URLの文字列です。
-   `orderId`：処理中のオーダーIDです。
-   `customerId`：購入する顧客のIDです（注文に添付されます）。
-   `orderNotes`：顧客が注文に残したカスタムメモです。
-   `paymentResult`：これは[/checkout StoreApiレスポンスの`payment_result`](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/34e17c3622637dbe8b02fac47b5c9b9ebf9e3596/src/RestApi/StoreApi/Schemas/CheckoutSchema.php#L103-L138)の値です。このオブジェクトで公開されるデータは（オブジェクトのプロパティを通じて）です：
    -   `paymentStatus`です：サーバー側で処理された後の、支払いのステータスが何であれ。`success`、`failure`、`pending`、`error`のいずれかとなります。
    -   `paymentDetails`：これは、ペイメントメソッド処理サーバーサイドがチェックアウト処理レスポンスでクライアントに送り返すデータを含む任意のオブジェクトになります。ペイメントメソッドは、処理サーバ側でフックし、このデータを返すように設定することができます。

このイベント・エミッターは、登録されたオブザーバーからのレスポンスが `true` と等しくなくなるまで、登録されたオブザーバーを呼び出します。その時点で、呼び出されていない残りのオブザーバーはスキップされ、アボートのトリガーとなったオブザーバーからの応答が処理されます。

このエミッターはチェックアウトステータスを`COMPLETE`に設定することで、`success`レスポンスタイプ(`{ type: success }`)を処理します。レスポンスに`redirectUrl`が含まれる場合、チェックアウトは指定されたアドレスにリダイレクトされます。

このエミッターは、`failure`レスポンス・タイプまたは`error`レスポンス・タイプも処理し、有効なタイプが検出されなければ、それを`error`レスポンス・タイプとして扱います。

いずれの場合も、レスポンスに以下のプロパティがあれば、追加のアクションが発生する：

-   `message`：この文字列はエラー通知として追加される。
-   `messageContext`：もし存在すれば、通知は指定された通知エリアに表示されるように設定されます(そうでなければ、チェックアウトブロックの一般的な通知となります)。
-   `retry`：これが`true`であるか、定義されていない場合、チェックアウトステータスは`IDLE`に設定されます。これは基本的にエラーが回復可能であることを意味します(例えば、別の支払い方法を試すなど)。これが`false`の場合、チェックアウトステータスは`COMPLETE`に設定され、チェックアウトは現在`redirectUrl`に設定されているものにリダイレクトされます。
-   `redirectUrl`：これが存在する場合、ステータスが`COMPLETE`の場合、チェックアウトはこのURLにリダイレクトします。

すべてのオブザーバーが`true`を返した場合、チェックアウトのステータスは`COMPLETE`に設定されます。

このイベントエミッタサブスクライバは、`useCheckoutContext`フックを使用してチェックアウトコンテキストから取得するか、登録されたコンポーネントのpropとして支払いメソッドエクステンションから取得することができます：

"内部開発のために:_

```jsx
import { useCheckoutContext } from '@woocommerce/base-contexts';
import { useEffect } from '@wordpress/element';

const Component = () => {
	const { onCheckoutSuccess } = useCheckoutContext();
	useEffect( () => {
		const unsubscribe = onCheckoutSuccess( () => true );
		return unsubscribe;
	}, [ onCheckoutSuccess ] );
	return null;
};
```

_登録された支払い方法の構成要素について

```jsx
const { useEffect } = window.wp.element;

const PaymentMethodComponent = ( { eventRegistration } ) => {
	const { onCheckoutSuccess } = eventRegistration;
	useEffect( () => {
		const unsubscribe = onCheckoutSuccess( () => true );
		return unsubscribe;
	}, [ onCheckoutSuccess ] );
};
```

"他のことについては

```jsx
const { onCheckoutSuccess } = wc.blocksCheckoutEvents;

useEffect( () => {
	const unsubscribe = onCheckoutSuccess( () => true );
	return unsubscribe;
}, [ onCheckoutSuccess ] );
```

### `onCheckoutFail`。

このイベントエミッタは、チェックアウトステータスが`AFTER_PROCESSING`で、チェックアウト`hasError`ステータスが`true`の場合に発生します。`AFTER_PROCESSING`ステータスは、チェックアウト処理リクエストに対するサーバからのレスポンスを受信した後、`CheckoutProcessor`コンポーネントによって設定されます。

このエミッターに登録されたオブザーバーは、`onCheckoutSuccess`に登録されたものと同じデータパッケージを受け取ります。

`===`が真でない値を返す最初のオブザーバーからのレスポンスは、`onCheckoutSuccess`と同様に処理されますが、型が`error`または`failure`の場合のみ処理されます。

すべてのオブザーバが`true`を返した場合、チェックアウトステータスは`IDLE`に設定され、デフォルトのエラー通知がチェックアウトコンテキストに表示されます。

このイベントエミッタサブスクライバは、`useCheckoutContext`フックを使用してチェックアウトコンテキストから取得するか、登録されたコンポーネントのpropとして支払いメソッドエクステンションから取得することができます：

"内部開発のために:_

```jsx
import { useCheckoutContext } from '@woocommerce/base-contexts';
import { useEffect } from '@wordpress/element';

const Component = () => {
	const { onCheckoutFail } = useCheckoutContext();
	useEffect( () => {
		const unsubscribe = onCheckoutFail( () => true );
		return unsubscribe;
	}, [ onCheckoutFail ] );
	return null;
};
```

_登録された支払い方法の構成要素について

```jsx
const { useEffect } = window.wp.element;

const PaymentMethodComponent = ( { eventRegistration } ) => {
	const { onCheckoutFail } = eventRegistration;
	useEffect( () => {
		const unsubscribe = onCheckoutFail( () => true );
		return unsubscribe;
	}, [ onCheckoutFail ] );
};
```

"他のことについては

```jsx
const { onCheckoutFail } = wc.blocksCheckoutEvents;

useEffect( () => {
	const unsubscribe = onCheckoutFail( () => true );
	return unsubscribe;
}, [ onCheckoutFail ] );
```

### `onShippingRateSuccess`。

このイベント・エミッターは、配送料金がロードされておらず、配送データ・コンテキストのエラー状態が`NONE`で、利用可能な配送料金がある場合に発生します。

このイベントエミッターは、登録されたオブザーバーのレスポンスは気にせず、サーバーから取得した現在の配送料金を渡すだけで、すべての登録されたオブザーバーを実行します。

### `onShippingRateFail`。

このイベント・エミッターは、配送料金がロードされず、配送データ・コンテキストのエラー状態が`UNKNOWN`または`INVALID_ADDRESS`の場合に発生します。

このイベントエミッターは、登録されたオブザーバーのレスポンスは気にせず、単純に登録されたオブザーバーをすべて実行し、コンテキストの現在のエラーステータスを渡します。

### `onShippingRateSelectSuccess`。

このイベント・エミッターは、配送料金の選択がサーバーに永続化されておらず、選択可能な料金があり、コンテキストの現在のエラー・ステータスが`NONE`である場合に発生します。

このイベントエミッターは、登録されたオブザーバーのレスポンスは気にせず、単に現在の選択されたレートを渡して登録されたオブザーバーをすべて実行する。

### `onShippingRateSelectFail`。

このイベント・エミッターは、配送料金の選択がサーバーに永続化されておらず、配送データ・コンテキストのエラー状態が`UNKNOWN`または`INVALID_ADDRESS`である場合に発生します。

このイベントエミッターは、登録されたオブザーバーのレスポンスは気にせず、単純に登録されたオブザーバーをすべて実行し、コンテキストの現在のエラーステータスを渡します。
