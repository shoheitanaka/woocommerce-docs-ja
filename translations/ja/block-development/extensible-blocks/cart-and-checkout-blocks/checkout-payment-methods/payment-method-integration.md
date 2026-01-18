---
post_title: Payment method integration
sidebar_label: Payment method integration
---

# 支払い方法の統合

## クライアント側の統合

クライアント側の統合は、 _regular_ と _express_ の両方の支払い方法を登録するための API で構成されています。

どちらの場合も、クライアント側の統合は`blocks-registry` API で公開されている登録メソッドを使用して行われます。WooCommerce 環境(`wc.wcBlocksRegistry`)では、`wc` グローバル経由でアクセスできます。

[> 注：ビルド・プロセスでは、この API を `@woocommerce/blocks-registry` の外部 API としてエイリアスする](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/e089ae17043fa525e8397d605f0f470959f2ae95/bin/webpack-helpers.js#L16-L35)ブロック・レポジトリで行われていることと同じようなことができます。

## エクスプレス・ペイメント

エクスプレス決済とは、Stripe、ApplePay、GooglePay など、買い物客がワンボタンで決済を開始できる決済方法である。

![Express Payment Area](https://user-images.githubusercontent.com/1429108/79565636-17fed500-807f-11ea-8e5d-9af32e43b71d.png)

### 登録

エクスプレス支払い方法を登録するには、ブロックレジストリの`registerExpressPaymentMethod`関数を使用します。 

```js
const { registerExpressPaymentMethod } = window.wc.wcBlocksRegistry;
```

`@woocommerce/blocks-registry`のエイリアス・インポートを使っている場合は、このように関数をインポートできる：

```js
import { registerExpressPaymentMethod } from '@woocommerce/blocks-registry';
```

レジストリ関数は、支払い方法に固有のオプションを持つ JavaScript オブジェクトを期待します：

```js
registerExpressPaymentMethod( options );
```

コンフィギュレーション・インスタンスに与えるオプションは、この形のオブジェクトでなければなりません（`ExpressPaymentMethodConfiguration` typedef参照）：

```js
const options = {
	name: 'my_payment_method',
	title: 'My Mayment Method',
	description: 'A setence or two about your payment method',
	gatewayId: 'gateway-id',
	label: <ReactNode />,
	content: <ReactNode />,
	edit: <ReactNode />,
	canMakePayment: () => true,
	paymentMethodId: 'my_payment_method',
	supports: {
		features: [],
		style: [],
	},
};
```

#### `ExpressPaymentMethodConfiguration`

| オプション｜タイプ｜説明｜必須
| --- | --- | --- | --- |
| `name`｜文字列｜ゲートウェイ・クライアント側の一意な識別子。| はい。
| `title`｜文字列｜支払い方法の可読性名前。エディタでマーチャントに表示されます。| いいえ。
| `description`｜文字列｜決済ゲートウェイを説明する1～2文。エディタでマーチャントに表示されます。| いいえ
| `gatewayId`｜文字列｜サーバー側に登録されているペイメントゲートウェイのID。エディタ内でマーチャントを正しい設定ページに誘導するために使用されます。これが指定されていない場合、マーチャントは一般的なWoo支払い設定ページにリダイレクトされます。| いいえ
| `content` | ReactNode｜フロントエンドでブロックがレンダリングされたときに、express支払い方法エリアに出力されるReactノード。チェックアウト支払い方法のインターフェイスからpropsを受け取る。| はい
| `edit`｜ReactNode｜ エディタでブロックがレンダリングされるときに、エクスプレス支払い方法エリアに出力されるReactノード。支払い方法インターフェースからチェックアウトへのプロップを受け取ります(プレビューデータ付き)。| はい
| `canMakePayment` | 関数｜支払い方法が買い物客にとって利用可能であるべきかを決定するコールバック。| はい
| はい｜`paymentMethodId`｜文字列｜サーバへのチェックアウト処理リクエストに付随する識別子。支払いを処理するための支払い方法ゲートウェイクラスを識別するために使用される。| いいえ
| ゲートウェイがサポートする支払い機能の配列。支払い方法がカートのコンテンツに使用できるかどうかをクロスチェックするために使用されます。値が提供されない場合、デフォルトは `['products']` です。| いいえ
| これは、express の支払い方法でサポートされるスタイルのバリエーションの配列です。これらはすべてのアクティブなエクスプレス決済ボタンに適用されるスタイルで、エディターのエクスプレス決済ブロックから制御できます。これらのサポートされる値は`['height', 'borderRadius']`のいずれかです。| いいえ

#### `canMakePayment` オプション

`canMakePayment` は、買い物客のオプションとして支払い方法が利用可能かどうかを決定するコールバックです。この関数には、現在の注文に関するデータを含むオブジェクトが渡されます。

```ts
canMakePayment( {
	cart: Cart,
	cartTotals: CartTotals,
	cartNeedsShipping: boolean,
	shippingAddress: CartShippingAddress,
	billingAddress: CartBillingAddress,
	selectedShippingMethods: Record<string,unknown>,
	paymentRequirements: string[],
} )
```

`canMakePayment`はブール値を返します。ゲートウェイが可用性を決定するために非同期の初期化を実行する必要がある場合、（booleanに解決する）プロミスを返すことができます。これにより、カートに物理的/発送可能な商品がある場合など、カートに基づいて支払い方法を非表示にすることができます (例: [`Cash on delivery`](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/e089ae17043fa525e8397d605f0f470959f2ae95/assets/js/payment-method-extensions/payment-methods/cod/index.js#L48-L70)); または、他の条件によって利用可能かどうかを制御する支払い方法。

`canMakePayment`はストアのフロントエンドでのみ実行されます。エディタコンテキストでは、`canMakePayment`を使用する代わりに、エディタは支払い方法が利用可能（true）であるとみなし、定義された`edit`コンポーネントがマーチャントに表示されます。

**この関数はチェックアウトのライフサイクルの中で複数回呼び出される可能性があるため、このプロパティで提供されるコールバック内の高価なロジックはすべてメモ化されるべきであることに留意してください。

### エクスプレス決済のボタン属性

この API は、一貫したショッパーエクスペリエンスのために、エクスプレスペイメントボタンのルックアンドフィールを同期する方法を提供します。エクスプレス・ペイメント・メソッドは、`buttonAttributes`で指定された値を優先し、カートまたはチェックアウト・ブロック以外の場所にボタンが表示される場合は、バックアップとして独自のコンフィギュレーション設定を使用する必要があります。

例えば、ボタン・コンポーネントでは次のようにする：

```js
// Get your extension specific settings and set defaults if not available
let {
	borderRadius = '4',
	height = '48',
} = getButtonSettingsFromConfig();

// In a cart & checkout block context, we receive `buttonAttributes` as a prop which overwrite the extension specific settings
if ( typeof buttonAttributes !== 'undefined' ) {
	height = buttonAttributes.height;
	borderRadius = buttonAttributes.borderRadius;
}
...

return <button style={height: `${height}px`, borderRadius: `${borderRadius}px`} />
```

## 支払方法

支払い方法は、チェックアウトブロックに表示される支払い方法のオプションです。例としては、_cheque_、PayPal Standard、Stripe Credit Cardなどがあります。

![Image 2021-02-24 at 4 24 05 PM](https://user-images.githubusercontent.com/1429108/109067640-c7073680-76bc-11eb-98e5-f04d35ddef99.jpg)

### 登録

支払い方法を登録するには、ブロック・レジストリの `registerPaymentMethod` 関数を使用する。 

```js
const { registerPaymentMethod } = window.wc.wcBlocksRegistry;
```

`@woocommerce/blocks-registry`のエイリアス・インポートを使っている場合は、このように関数をインポートできる：

```js
import { registerPaymentMethod } from '@woocommerce/blocks-registry';
```

レジストリ関数は、支払い方法に固有のオプションを持つ JavaScript オブジェクトを期待します：

```js
registerPaymentMethod( options );
```

コンフィギュレーション・インスタンスに与えるオプションは、この形のオブジェクトでなければなりません（`PaymentMethodRegistrationOptions` typedef参照）。コンフィギュレーション・インスタンスに与えるオプションは、エクスプレス・ペイメント・メソッドのものと同じですが、以下のものが追加されます：

| プロパティ｜タイプ｜説明
| --- | --- | --- |
| `savedTokenComponent` | ReactNode｜保存された支払い方法を処理するためのロジックを含むReactノード。この支払い方法のために顧客の保存されたトークンが選択されたときにレンダリングされます。|
| `label` | ReactNode｜支払い方法オプションのラベルを出力するためのReactノード。テキストでも画像でもかまいません。|
| `ariaLabel` | string｜支払い方法が選択されたときにスクリーンリーダーによって読み取られるラベル。|
| `placeOrderButtonLabel` | string | この支払い方法が選択されたときに、デフォルトの "注文する "ボタンのテキストを変更するオプションのラベル。`placeOrderButton`と排他的です。|
| `placeOrderButton` | Reactコンポーネント｜この支払い方法が選択されたときに、デフォルトの「注文する」ボタンを置き換えるReactコンポーネントを指定します。`placeOrderButtonLabel`と排他的です。このコンポーネントは `PaymentMethodInterface` プロップを受け取ります。|
| `supports`｜オブジェクト｜サポートされる機能に関する情報を含みます：|
| `supports.showSavedCards`｜boolean｜この支払い方法で保存されたカードが顧客に表示されるかどうかを決定します。|
| `supports.showSaveOption`｜boolean｜将来の使用のために支払い方法を保存するチェックボックスを表示するかどうかを制御します。|

### カスタム発注ボタンの使用

`placeOrderButton`プロパティを使用すると、デフォルトの「注文する」ボタンをカスタムコンポーネントで置き換えることができます。これは、カスタムボタンのスタイルを必要とする支払い方法（Google Pay や Apple Pay など）や、注文を送信する前に支払い UI を表示する必要がある場合に便利です。あなたの支払い方法に適用されない場合は、このプロパティを省略し、デフォルトのボタンを使用することをお勧めします。

カスタムボタンコンポーネントは、`PaymentMethodInterface`を介して、支払いメソッド`content`コンポーネントと同じプロップをすべて受け取り、さらにボタン固有のプロップも受け取ります：

- `waitingForProcessing` - チェックアウト処理中かどうか。
- `waitingForRedirect` - チェックアウトが成功した後にリダイレクトされるのを待っているかどうか。
- `disabled` - ボタンを無効にするかどうか
- `isEditor` - ブロックエディタでボタンがレンダリングされているかどうか
- `isPreview` - ボタンがプレビューモードでレンダリングされるかどうか

簡単な例を挙げよう：

```js
const CustomButton = ( props ) => {
	const { validate, onSubmit, disabled, isEditor, isPreview, eventRegistration: { onPaymentSetup }, emitResponse } = props;

	const [
		isShowingInternalPaymentSheet,
		setIsShowingInternalPaymentSheet,
	] = React.useState( false );
  
  const paymentResultRef = React.useRef( false );

	const handleClick = async () => {
		// 1. Validate the checkout form
		const validationResult = await validate();

		if ( validationResult.hasError ) {
			return; // WooCommerce automatically displays validation errors
		}

		// 2. Show your payment UI (e.g., Google Pay sheet, Apple Pay sheet)
		// setIsShowingInternalPaymentSheet( true );
		// const paymentResult = await showPaymentSheet( billing.cartTotal.value );
    // paymentResultRef.current = paymentResult.success;
		// if ( ! paymentResult.success ) {
		//     setIsShowingInternalPaymentSheet( false );
		//     return;
		// }

		// 3. Submit the checkout to the server once all payment information has been collected.
		onSubmit();
	};

  React.useEffect(
    () =>
      onPaymentSetup( () => {
        return ({
          type: paymentResultRef.current ? emitResponse.responseTypes.SUCCESS : emitResponse.responseTypes.ERROR,
          meta: {
            paymentMethodData: {
              payment_method: 'your-payment-method',
            },
          },
        });
      } ),
    [ onPaymentSetup, emitResponse.responseTypes.SUCCESS, emitResponse.responseTypes.ERROR ]
  );

	// In editor/preview mode, show a placeholder or preview version
	if ( isEditor || isPreview ) {
		return (
			<button type="button" disabled>
				Pay with Custom Method (Preview)
			</button>
		);
	}

	return (
		<button
		  type="button"
			onClick={ handleClick }
			disabled={ disabled || isShowingInternalPaymentSheet }
		>
			{ disabled || isShowingInternalPaymentSheet
				? 'Processing...'
				: 'Pay with Custom Method' }
		</button>
	);
};

registerPaymentMethod( {
	name: 'my-custom-payment',
	label: <div>My Custom Payment</div>,
	content: <div>Payment method description</div>,
	edit: <div>Payment method description</div>,
	placeOrderButton: CustomButton,
	canMakePayment: () => true,
	supports: {
		features: [ 'products' ],
	},
} );
```

** カスタムボタンは、支払い方法がリストから選択された場合にのみ表示されます。保存された支払いトークンが選択された場合、代わりにデフォルトの「注文する」ボタンが使用されます。

## 支払い方法ノードへの小道具の提供

ペイメントメソッド統合の大部分は、提供されたノードがクローンされ、ブロックマウント上でレンダリングされるときに、ペイメントメソッドがpropsを介して使用するために公開されるインタフェースです。すべてのpropsは以下にリストされていますが、[このファイルに記述されているtypedefs](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce-blocks/assets/js/types/type-defs/payment-method-interface.ts)を介して、propsが参照するもの、それらの型などの詳細を見つけることができます。

| プロパティ | タイプ | 説明 |
| --- | --- | --- |
| `activePaymentMethod` | String | チェックアウトにおける現在アクティブな支払い方法のスラッグ。 |
| `billing` | Object with billingAddress, cartTotal, currency, cartTotalItems, displayPricesIncludingTax, appliedCoupons, customerId properties | 請求に関連するすべてのものが含まれます。 |
| `cartData` | Object with cartItems, cartFees, extensions properties | カートから公開されるデータには、商品、手数料、登録済みの拡張機能データなどが含まれます。これらのデータは不変（変更不可）として扱う必要があります。変更/改変すると、アプリケーションでエラーが発生します。 |
| `checkoutStatus` | Object with isCalculating, isComplete, isIdle, isProcessing properties | さまざまなブール状態として公開される現在のチェックアウト ステータス。 |
| `components` | Object with ValidationInputError, PaymentMethodLabel, PaymentMethodIcons, LoadingMask properties | 支払い方法で使用されるさまざまな共通インターフェース要素に対して、支払い方法で実装できる React コンポーネントを公開します。 |
| `emitResponse` | Object with noticeContexts and responseTypes properties | イベントエミッターの使用時に役立つ定数がいくつか含まれています。詳細については、 _[イベントの発行](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/e267cd96a4329a4eeef816b2ef627e113ebb72a5/docs/extensibility/checkout-flow-and-events.md# emitting-events)_ セクションをご覧ください。 |
| `eventRegistration` | Object with onCheckoutValidation, onCheckoutSuccess, onCheckoutFail, onPaymentSetup, onShippingRateSuccess, onShippingRateFail, onShippingRateSelectSuccess, onShippingRateSelectFail properties | チェックアウトイベントエミッター登録関数をすべて含みます。これらの関数は、決済メソッドがチェックアウトフローの様々なポイントとやり取りするためにオブザーバーを登録できるものです（詳細については[このドキュメント](./checkout-flow-and-events.md)をご覧ください）。 |
| `onClick` | Function | **支払い方法を指定するために提供** 支払い方法ボタンがクリックされたときにトリガーされる必要があります (これにより、支払い方法が支払い処理を引き継いだことがチェックアウトに通知されます) |
| `onClose` | Function | **エクスプレス支払い方法に提供されます**。エクスプレス支払い方法モーダルが閉じられ、制御がチェックアウトに戻ったときにトリガーされる必要があります。 |
| `onSubmit` | Function | チェックアウトを送信し、処理を開始します |
| `validate` | Function | チェックアウトフォームを送信せずに検証する非同期関数です。`{ hasError: boolean }` に解決されるPromiseを返します。支払いシートを表示する前に検証が必要な場合に便利です。 |
| `buttonAttributes` | Object with height, borderRadius properties | すべてのエクスプレス支払いボタンで尊重されるべき、販売者が設定したスタイル |
| `paymentStatus` | Object | 様々な決済ステータスヘルパー。決済方法ではクライアント側でこのステータスを設定する必要はありません。Checkoutは、[チェックアウトイベントエミッター](./checkout-flow-and-events.md)に登録されたオブザーバーから決済方法に返されるレスポンスを介してこのステータスを処理します。 |
| `paymentStatus.isPristine` | Boolean | これは、現在の支払いステータスが`PRISTINE`の場合に当てはまります。 |
| `paymentStatus.isStarted` | Boolean | これは、現在の支払いステータスが`EXPRESS_STARTED`の場合に当てはまります。 |
| `paymentStatus.isProcessing` | Boolean | これは、現在の支払いステータスが`PROCESSING`の場合に当てはまります。 |
| `paymentStatus.isFinished` | Boolean | これは、現在の支払いステータスが `ERROR`、`FAILED`、または `SUCCESS` のいずれかの場合に当てはまります。 |
| `paymentStatus.hasError` | Boolean | 現在の支払いステータスが `ERROR` の場合、これは当てはまります。 |
| `paymentStatus.hasFailed` | Boolean | 現在の支払いステータスが `FAILED` の場合、これは当てはまります。 |
| `paymentStatus.isSuccessful` | Boolean | 現在の支払いステータスが `SUCCESS` の場合、これは当てはまります。 |
| `setExpressPaymentError` | Function | 文字列を受け取り、エクスプレス決済方法が必要に応じてエクスプレス決済エリアにエラー通知を設定できるようにします。エクスプレス決済方法の処理の中には、チェックアウトイベントの外で実行されるものもあるため、この機能が必要になる場合があります。 |
| `shippingData` | Object with shippingRates, shippingRatesLoading, selectedRates, setSelectedRates, isSelectingRate, shippingAddress, setShippingAddress, needsShipping properties | 配送に関連するすべてのデータ（配送状況以外）が含まれます。 |
| `shippingStatus` | Object with shippingErrorStatus, shippingErrorTypes properties | さまざまな配送状況ヘルパー。 |
| `shouldSavePayment` | Boolean | 買い物客が支払い方法の詳細を保存することを選択したかどうかを示します（保存支払いをサポートする支払い方法の場合）。選択した場合はtrue、そうでない場合はfalseです。デフォルトは false です。 |

登録された `savedTokenComponent` ノードは `token` プロップも受け取ります。しかし、これはあくまでデータベース内のトークンを表す id (およびショッパーがチェックしたラジオ入力の値) であり、実際の顧客の支払いトークンではないことに注意してください (通常、トークンを使用した処理はセキュリティのためにサーバで行われるため)。

## サーバーサイドの統合

サーバー側の統合には、`Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType`クラスを継承したクラスを作成する必要があります。 

このクラスは、支払い方法をサーバーサイドで表現します。このクラスは、Store APIとCheckoutブロックへの支払い方法アセットの登録を適切なタイミングで処理するために使用されます。決済処理のために別途実装する必要がある[Payment Gateway API](/features/payments/payment-gateway-api.md)とは異なります。

### 支払方法統合クラスの例

```php
<?php
namespace MyPlugin\MyPaymentMethod;

use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

final class MyPaymentMethodType extends AbstractPaymentMethodType {
	/**
	 * This property is a string used to reference your payment method. It is important to use the same name as in your
	 * client-side JavaScript payment method registration.
	 *
	 * @var string
	 */
	protected $name = 'my_payment_method';

	/**
	 * Initializes the payment method.
	 * 
	 * This function will get called during the server side initialization process and is a good place to put any settings
	 * population etc. Basically anything you need to do to initialize your gateway. 
	 * 
	 * Note, this will be called on every request so don't put anything expensive here.
	 */
	public function initialize() {
		$this->settings = get_option( 'woocommerce_my_payment_method_settings', [] );
	}

	/**
	 * This should return whether the payment method is active or not. 
	 * 
	 * If false, the scripts will not be enqueued.
	 *
	 * @return boolean
	 */
	public function is_active() {
		return filter_var( $this->get_setting( 'enabled', false ), FILTER_VALIDATE_BOOLEAN );
	}

	/**
	 * Returns an array of scripts/handles to be registered for this payment method.
	 * 
	 * In this function you should register your payment method scripts (using `wp_register_script`) and then return the 
	 * script handles you registered with. This will be used to add your payment method as a dependency of the checkout script 
	 * and thus take sure of loading it correctly. 
	 * 
	 * Note that you should still make sure any other asset dependencies your script has are registered properly here, if 
	 * you're using Webpack to build your assets, you may want to use the WooCommerce Webpack Dependency Extraction Plugin
	 * (https://www.npmjs.com/package/@woocommerce/dependency-extraction-webpack-plugin) to make this easier for you.
	 *
	 * @return array
	 */
	public function get_payment_method_script_handles() {
		wp_register_script(
			'my-payment-method',
			'path/to/your/script/my-payment-method.js',
			[],
			'1.0.0',
			true
		);
		return [ 'my-payment-method' ];
	}

	/**
	 * Returns an array of script handles to be enqueued for the admin.
	 * 
	 * Include this if your payment method has a script you _only_ want to load in the editor context for the checkout block. 
	 * Include here any script from `get_payment_method_script_handles` that is also needed in the admin.
	 */
	public function get_payment_method_script_handles_for_admin() {
		return $this->get_payment_method_script_handles();
	}

	/**
	 * Returns an array of key=>value pairs of data made available to the payment methods script client side.
	 * 
	 * This data will be available client side via `wc.wcSettings.getSetting`. So for instance if you assigned `stripe` as the 
	 * value of the `name` property for this class, client side you can access any data via: 
	 * `wc.wcSettings.getSetting( 'stripe_data' )`. That would return an object matching the shape of the associative array 
	 * you returned from this function.
	 *
	 * @return array
	 */
	public function get_payment_method_data() {
		return [
			'title'       => $this->get_setting( 'title' ),
			'description' => $this->get_setting( 'description' ),
			'supports'    => $this->get_supported_features(),
		];
	}
}
```

### 支払方法の統合登録

`Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType`を継承したクラスを作成したら、サーバー側で処理する支払いメソッドに登録する必要があります。 

これは、`PaymentMethodRegistry` クラスの `register` メソッドを使うことで可能です。 

```php
use MyPlugin\MyPaymentMethod\MyPaymentMethodType;
use Automattic\WooCommerce\Blocks\Payments\PaymentMethodRegistry;

add_action(
	'woocommerce_blocks_payment_method_type_registration',
	function( PaymentMethodRegistry $payment_method_registry ) {
		$payment_method_registry->register( new MyPaymentMethodType() );
	}
);
```

## 支払処理（レガシーサポート）

支払いは引き続き[Payment Gateway API](/features/payments/payment-gateway-api.md)を介して処理されます。これは、上記の支払い方法の統合に使用されるものとは別のAPIです。

チェックアウトブロックは、クライアントサイドスクリプトによって提供された `payment_data` を `$_POST` に変換し、ペイメントゲートウェイの `process_payment` メソッドを呼び出します。

もしあなたが既に WooCommerce Payment method extension をショートコードのチェックアウトフローに統合している場合、レガシーハンドリングがサーバーサイドであなたの代わりに支払いを処理します。

## ストアAPIによる支払い処理

前述したレガシーな支払い処理が、既存の支払い方法との統合で機能しないような、より高度なケースも考えられます。このような場合、Store API に特化した、より多くのコンテキストを提供する、注文のサーバー側処理を処理するために使用できるアクションフックもあります。

このフックは、支払い処理をフックする場所として推奨されます：

```php
do_action_ref_array( 'woocommerce_rest_checkout_process_payment_with_context', [ $context, &$result ] );
```

> 注：このフックにコールバックを登録するのに適した場所は、先に作成した支払い方法タイプクラスの `initialize` メソッド内である。

このフックのコールバックが受け取る：

- 選択された `payment_method`（支払い方法の登録時に定義された `paymentMethodId` と同じです）、設置される `order`、および支払い方法のクライアントが提供する追加の `payment_data` を含む `PaymentContext` オブジェクト。
- `PaymentResult` オブジェクトを使用して、ステータス、リダイレクトURL、追加の支払い詳細をStore API経由でクライアントに返します。

提供された `PaymentResult` オブジェクトにステータスを設定すると、レガシーな支払い処理は無視されます。エラーが発生した場合、コールバックはStore APIによって処理される例外を投げることができます。

以下はコールバックの例である：

```php
add_action(
	'woocommerce_rest_checkout_process_payment_with_context',
	function( $context, $result ) {
		if ( $context->payment_method === 'my_payment_method' ) {
			// Order processing would happen here!
			// $context->order contains the order object if needed
			// ...

			// If the logic above was successful, we can set the status to success.
			$result->set_status( 'success' );
			$result->set_payment_details(
				array_merge(
					$result->payment_details,
					[
						'custom-data' => '12345',
					]
				)
			);
			$result->set_redirect_url( 'some/url/to/redirect/to' );
		}
	},
  10,
  2
);
```

## クライアントからサーバー側の支払い処理に値を渡す

この例では、BACS 支払い方法からサーバーにデータを渡します。BACS の登録は次のようになります：

```js
// Get our settings that were provided when the payment method was registered
const settings = window.wc.wcSettings.getSetting( 'bacs_data' );

// This is a component that would be rendered in the checkout block when the BACS payment method is selected
const Content = () => {
	return decodeEntities( settings?.description || '' );
};

// This is the label for the payment method
const Label = ( props ) => {
	const { PaymentMethodLabel } = props.components;
	return <PaymentMethodLabel text={ decodeEntities( settings?.title || 'BACS' ) } />;
};

// Register the payment method
const bankTransferPaymentMethod = {
	name: 'BACS',
	label: <Label />,
	content: <Content />,
	edit: <Content />,
	canMakePayment: () => true,
	supports: {
		features: settings?.supports ?? [],
	},
};
```

支払い方法ノードは、[usePaymentMethodInterface フック](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/docs/internal-developers/block-client-apis/checkout/checkout-api.md#usepaymentmethodinterface)からすべてを渡されます。そのため、`<Content />`コンポーネントでは、次のようにこれを使用することができます：

```js
const Content = ( props ) => {
	const { eventRegistration, emitResponse } = props;
	const { onPaymentProcessing } = eventRegistration;
	useEffect( () => {
		const unsubscribe = onPaymentProcessing( async () => {
			// Here we can do any processing we need, and then emit a response.
			// For example, we might validate a custom field, or perform an AJAX request, and then emit a response indicating it is valid or not.
			const myGatewayCustomData = '12345';
			const customDataIsValid = !! myGatewayCustomData.length;

			if ( customDataIsValid ) {
				return {
					type: emitResponse.responseTypes.SUCCESS,
					meta: {
						paymentMethodData: {
							myGatewayCustomData,
						},
					},
				};
			}

			return {
				type: emitResponse.responseTypes.ERROR,
				message: 'There was an error',
			};
		} );
		// Unsubscribes when this component is unmounted.
		return () => {
			unsubscribe();
		};
	}, [
		emitResponse.responseTypes.ERROR,
		emitResponse.responseTypes.SUCCESS,
		onPaymentProcessing,
	] );
	return decodeEntities( settings.description || '' );
};
```

注文が発注されたとき、API リクエストのペイロードを見ると、以下の JSON を見ることができる：

```json
{
	"shipping_address": {},
	"billing_address": {},
	"customer_note": "",
	"create_account": false,
	"payment_method": "bacs",
	"payment_data": [
		{
			"key": "myGatewayCustomData",
			"value": "12345"
		}
	],
	"extensions": {}
}
```

その後、`woocommerce_rest_checkout_process_payment_with_context` のコールバックがこのデータにアクセスし、支払い処理に使用することができる。

```php
add_action( 'woocommerce_rest_checkout_process_payment_with_context', function( $context, $result ) { )
  if ( $context->payment_method === 'bacs' ) { { $myGatewayCustoms
    myGatewayCustomData = $context->payment_data['myGatewayCustomData']；
    // ここでは、$myGatewayCustomData を使用して支払いを処理します。
```
