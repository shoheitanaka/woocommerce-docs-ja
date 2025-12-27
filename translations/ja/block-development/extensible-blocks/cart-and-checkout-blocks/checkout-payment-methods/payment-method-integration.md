---
post_title: Payment method integration
sidebar_label: Payment method integration
---

# Payment method integration

## クライアント側の統合

クライアント側の統合は、_regular_と_express_の両方の支払い方法を登録するためのAPIで構成されています。

どちらの場合も、クライアント側の統合は`blocks-registry` APIで公開されている登録メソッドを使用して行われます。WooCommerce環境(`wc.wcBlocksRegistry`)では、`wc`グローバル経由でアクセスできます。

[> 注：ビルド・プロセスでは、このAPIを`@woocommerce/blocks-registry`の外部APIとしてエイリアスする](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/e089ae17043fa525e8397d605f0f470959f2ae95/bin/webpack-helpers.js#L16-L35)ブロック・レポジトリで行われていることと同じようなことができます。

## エクスプレス・ペイメント

エクスプレス決済とは、Stripe、ApplePay、GooglePayなど、買い物客がワンボタンで決済を開始できる決済方法である。

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

レジストリ関数は、支払い方法に固有のオプションを持つJavaScriptオブジェクトを期待します：

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

| Option                | Type       | Description                                                                                                                                                                                                                                                                                                                                                     | Required |
|-----------------------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `name`                | String     | Unique identifier for the gateway client side.                                                                                                                                            | Yes      |
| `title`               | String     | Human readable name of your payment method. Displayed to the merchant in the editor.                                                                                                                                                                                                                        | No       |
| `description`         | String     | One or two sentences describing your payment gateway. Displayed to the merchant in the editor.                                                                                                                                                                                                                                                                  | No       |
| `gatewayId`           | String     | ID of the Payment Gateway registered server side. Used to direct the merchant to the right settings page within the editor. If this is not provided, the merchant will be redirected to the general Woo payment settings page.                                                                                                                                   | No       |
| `content`             | ReactNode  | React node output in the express payment method area when the block is rendered in the frontend. Receives props from the checkout payment method interface.                                                                                                                                                                                                     | Yes      |
| `edit`                | ReactNode  | React node output in the express payment method area when the block is rendered in the editor. Receives props from the payment method interface to checkout (with preview data).                                                                                                                                                                                | Yes      |
| `canMakePayment`      | Function   | Callback to determine whether the payment method should be available for the shopper.                                                                                                                                                          | Yes      |
| `paymentMethodId`     | String     | Identifier accompanying the checkout processing request to the server. Used to identify the payment method gateway class for processing the payment.                                                                                                                                                                                                            | No       |
| `supports:features`   | Array      | Array of payment features supported by the gateway. Used to crosscheck if the payment method can be used for the cart content. Defaults to `['products']` if no value is provided.                                                                                                                                                                              | No       |
| `supports:style`      | Array      | This is an array of style variations supported by the express payment method. These are styles that are applied across all the active express payment buttons and can be controlled from the express payment block in the editor. Supported values for these are one of `['height', 'borderRadius']`.                                                                                                                                 | No       |

#### `canMakePayment` オプション

`canMakePayment` は、買い物客のオプションとして支払い方法が利用可能かどうかを判断するためのコールバックです。この関数には、現在の注文に関するデータを含むオブジェクトが渡されます。

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

`canMakePayment`はブール値を返します。ゲートウェイが可用性を決定するために非同期の初期化を実行する必要がある場合、（booleanに解決する）プロミスを返すことができます。これにより、カートに物理的/発送可能な商品がある場合など、カートに基づいて支払い方法を非表示にすることができます (例: [__INLINE_COD_0__])：例: [`Cash on delivery`](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/e089ae17043fa525e8397d605f0f470959f2ae95/assets/js/payment-method-extensions/payment-methods/cod/index.js#L48-L70)); または、他の条件によって利用可能かどうかを制御する支払い方法。

`canMakePayment`はストアのフロントエンドでのみ実行されます。エディタコンテキストでは、`canMakePayment`を使用する代わりに、エディタは支払い方法が利用可能（true）であるとみなし、定義された`edit`コンポーネントがマーチャントに表示されます。

**この関数はチェックアウトのライフサイクルの中で複数回呼び出される可能性があるため、このプロパティで提供されるコールバック内の高価なロジックはすべてメモ化する必要があることに留意してください。

### エクスプレス決済のボタン属性

このAPIは、一貫したショッパーエクスペリエンスのために、エクスプレスペイメントボタンのルックアンドフィールを同期する方法を提供します。エクスプレス・ペイメント・メソッドは、`buttonAttributes`で指定された値を優先し、カートまたはチェックアウト・ブロック以外の場所にボタンが表示される場合は、バックアップとして独自のコンフィギュレーション設定を使用する必要があります。

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

支払い方法を登録するには、ブロック・レジストリの`registerPaymentMethod`関数を使用する。 

```js
const { registerPaymentMethod } = window.wc.wcBlocksRegistry;
```

`@woocommerce/blocks-registry`のエイリアス・インポートを使っている場合は、このように関数をインポートできる：

```js
import { registerPaymentMethod } from '@woocommerce/blocks-registry';
```

レジストリ関数は、支払い方法に固有のオプションを持つJavaScriptオブジェクトを期待します：

```js
registerPaymentMethod( options );
```

コンフィギュレーション・インスタンスに与えるオプションは、この形のオブジェクトでなければなりません（`PaymentMethodRegistrationOptions` typedef参照）。コンフィギュレーション・インスタンスに与えるオプションは、エクスプレス・ペイメント・メソッドのものと同じですが、以下のものが追加されます：

| プロパティ｜タイプ｜説明
|----------|------|-------------|
| `savedTokenComponent` | ReactNode｜保存された支払い方法を処理するためのロジックを含むReactノード。この支払い方法に対する顧客の保存トークンが選択されたときにレンダリングされます。|
| `label` | ReactNode｜支払い方法オプションのラベルを出力するためのReactノード。テキストまたは画像を使用できます。|
| `ariaLabel` | string｜支払い方法が選択されたときにスクリーンリーダーによって読み取られるラベル。|
| `placeOrderButtonLabel` | string | この支払い方法が選択されたときに、デフォルトの「注文する」ボタンのテキストを変更するオプションのラベル。|
| `supports`｜オブジェクト｜サポートされている機能に関する情報が含まれています：|
| `supports.showSavedCards`｜boolean｜この支払い方法で保存されたカードが顧客に表示されるかどうかを決定します。|
| `supports.showSaveOption` | boolean｜ 将来の使用のために支払い方法を保存するチェックボックスを表示するかどうかを制御します。|

## 支払い方法ノードへの小道具の提供

ペイメントメソッド統合の大部分は、提供されたノードがクローンされ、ブロックマウント上でレンダリングされるときに、ペイメントメソッドがpropsを介して使用するために公開されるインタフェースです。すべてのpropsは以下にリストされていますが、[このファイルに記述されているtypedefs](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce-blocks/assets/js/types/type-defs/payment-method-interface.ts)を介して、propsが参照するもの、それらの型などの詳細を見つけることができます。

| Property                 | Type                                                                                                                                                                                                                                                                                                                                                                      | Description                                                                                                                                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `activePaymentMethod`    | String                                                                                                                                                                                                                                                                                                                                                                    | The slug of the current active payment method in the checkout.                                                                                                                                                                                                                                                     |
| `billing`                | Object with billingAddress, cartTotal, currency, cartTotalItems, displayPricesIncludingTax, appliedCoupons, customerId properties                                                                                                                                                                                                                                             | Contains everything related to billing.                                                                                                                                                                                                                                                                            |
| `cartData`               | Object with cartItems, cartFees, extensions properties                                                                                                                                                                                                                                                                                                                                 | Data exposed from the cart including items, fees, and any registered extension data. Note that this data should be treated as immutable (should not be modified/mutated) or it will result in errors in your application.                                                                                          |
| `checkoutStatus`         | Object with isCalculating, isComplete, isIdle, isProcessing properties                                                                                                                                                                                                                                                                                                               | The current checkout status exposed as various boolean state.                                                                                                                                                                                                                                                      |
| `components`             | Object with ValidationInputError, PaymentMethodLabel, PaymentMethodIcons, LoadingMask properties                                                                                                                                                                                                                                                                                      | It exposes React components that can be implemented by your payment method for various common interface elements used by payment methods.                                                                                                                                                                          |
| `emitResponse`           | Object with noticeContexts and responseTypes properties                                                                                                                                                                                                                                                                                                                      | Contains some constants that can be helpful when using the event emitter. Read the _[Emitting Events](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/e267cd96a4329a4eeef816b2ef627e113ebb72a5/docs/extensibility/checkout-flow-and-events.md#emitting-events)_ section for more details. |
| `eventRegistration`      | Object with onCheckoutValidation, onCheckoutSuccess, onCheckoutFail, onPaymentSetup, onShippingRateSuccess, onShippingRateFail, onShippingRateSelectSuccess, onShippingRateSelectFail properties                                                                                                                                                                            | Contains all the checkout event emitter registration functions. These are functions the payment method can register observers on to interact with various points in the checkout flow (see [this doc](./checkout-flow-and-events.md) for more info).                                                               |
| `onClick`                | Function                                                                                                                                                                                                                                                                                                                                                                   | **Provided to express payment methods** that should be triggered when the payment method button is clicked (which will signal to checkout the payment method has taken over payment processing)                                                                                                                    |
| `onClose`                | Function                                                                                                                                                                                                                                                                                                                                                                   | **Provided to express payment methods** that should be triggered when the express payment method modal closes and control is returned to checkout.                                                                                                                                                                 |
| `onSubmit`               | Function                                                                                                                                                                                                                                                                                                                                                                   | Submits the checkout and begins processing                                                                                                                                                                                                                                                                         |
| `buttonAttributes`       | Object with height, borderRadius properties                                                                                                                                                                                                                                                                                                                                              | Styles set by the merchant that should be respected by all express payment buttons                                                                                                                                                                                                                                 |
| `paymentStatus`          | Object                                                                                                                                                                                                                                                                       | Various payment status helpers. Note, your payment method does not have to handle setting this status client side. Checkout will handle this via the responses your payment method gives from observers registered to [checkout event emitters](./checkout-flow-and-events.md).                                    |
| `paymentStatus.isPristine`             | Boolean                                                                                                                                                                                                                                                                                                                                                                    | This is true when the current payment status is `PRISTINE`.                                                                                                                                                                                                                                                        |
| `paymentStatus.isStarted`              | Boolean                                                                                                                                                                                                                                                                                                                                                                    | This is true when the current payment status is `EXPRESS_STARTED`.                                                                                                                                                                                                                                                  |
| `paymentStatus.isProcessing`           | Boolean                                                                                                                                                                                                                                                                                                                                                                    | This is true when the current payment status is `PROCESSING`.                                                                                                                                                                                                                                                      |
| `paymentStatus.isFinished`             | Boolean                                                                                                                                                                                                                                                                                                                                                                    | This is true when the current payment status is one of `ERROR`, `FAILED`, or `SUCCESS`.                                                                                                                                                                                                                            |
| `paymentStatus.hasError`               | Boolean                                                                                                                                                                                                                                                                                                                                                                    | This is true when the current payment status is `ERROR`.                                                                                                                                                                                                                                                           |
| `paymentStatus.hasFailed`              | Boolean                                                                                                                                                                                                                                                                                                                                                                    | This is true when the current payment status is `FAILED`.                                                                                                                                                                                                                                                          |
| `paymentStatus.isSuccessful`           | Boolean                                                                                                                                                                                                                                                                                                                                                                    | This is true when the current payment status is `SUCCESS`.                                                                                                                                                                                                                                                         |
| `setExpressPaymentError` | Function                                                                                                                                                                                                                                                                                                                                                                   | Receives a string and allows express payment methods to set an error notice for the express payment area on demand. This can be necessary because some express payment method processing might happen outside of checkout events.                                                                                  |
| `shippingData`           | Object with shippingRates, shippingRatesLoading, selectedRates, setSelectedRates, isSelectingRate, shippingAddress, setShippingAddress, needsShipping properties                                                                                                                                                                                                             | Contains all shipping related data (outside of the shipping status).                                                                                                                                                                                                                                               |
| `shippingStatus`         | Object with shippingErrorStatus, shippingErrorTypes properties                                                                                                                                                                                                                                                                                                                            | Various shipping status helpers.                                                                                                                                                                                                                                                                                   |
| `shouldSavePayment`      | Boolean                                                                                                                                                                                                                                                                                                                                                                    | Indicates whether or not the shopper has selected to save their payment method details (for payment methods that support saved payments). True if selected, false otherwise. Defaults to false.                                                                                                                    |

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

これは、`PaymentMethodRegistry`クラスの`register`メソッドを使うことで可能です。 

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

チェックアウトブロックは、クライアントサイドスクリプトによって提供された`payment_data`を`$_POST`に変換し、ペイメントゲートウェイの`process_payment`メソッドを呼び出します。 

もしあなたが既にWooCommerce Payment method extensionをショートコードのチェックアウトフローに統合している場合、レガシーハンドリングがサーバーサイドであなたの代わりに支払いを処理します。

## ストアAPIによる支払い処理

前述したレガシーな支払い処理が、既存の支払い方法との統合で機能しないような、より高度なケースも考えられます。このような場合、Store APIに特化した、より多くのコンテキストを提供する、注文のサーバー側処理を処理するために使用できるアクションフックもあります。

このフックは、支払い処理をフックする場所として推奨されます：

```php
do_action_ref_array( 'woocommerce_rest_checkout_process_payment_with_context', [ $context, &$result ] );
```

> 注：このフックにコールバックを登録するのに適した場所は、先に作成した支払い方法タイプクラスの`initialize`メソッド内である。

このフックのコールバックが受け取る：

- 選択された`payment_method`（これは、支払い方法の登録時に定義された`paymentMethodId`と同じです）、設置される`order`、および支払い方法のクライアントが提供する追加の`payment_data`を含む`PaymentContext`オブジェクト。
- `PaymentResult`オブジェクトを使用して、ステータス、リダイレクトURL、追加の支払い詳細をStore API経由でクライアントに返します。

提供された`PaymentResult`オブジェクトにステータスを設定すると、レガシーな支払い処理は無視されます。エラーが発生した場合、コールバックはStore APIによって処理される例外を投げることができます。 

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

この例では、BACS支払い方法からサーバーにデータを渡します。BACSの登録は次のようになります：

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

支払い方法ノードは、[usePaymentMethodInterfaceフック](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/docs/internal-developers/block-client-apis/checkout/checkout-api.md#usepaymentmethodinterface)からすべてを渡されます。そのため、`<Content />`コンポーネントでは、次のようにこれを使用することができます：

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

注文が発注されたとき、APIリクエストのペイロードを見ると、以下のJSONを見ることができる：

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

その後、`woocommerce_rest_checkout_process_payment_with_context`のコールバックがこのデータにアクセスし、支払い処理に使用することができる。

php
add_action( 'woocommerce_rest_checkout_process_payment_with_context', function( $context, $result ) { )
  if ( $context->payment_method === 'bacs' ) { { $myGatewayCustoms
    myGatewayCustomData = $context->payment_data['myGatewayCustomData']；
    // ここでは、$myGatewayCustomData を使用して支払いを処理します。
