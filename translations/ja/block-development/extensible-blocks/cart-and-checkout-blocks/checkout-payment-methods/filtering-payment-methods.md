---
post_title: Filtering payment methods in the Checkout block
sidebar_label: Filtering payment methods
---
# チェックアウトブロックにおける支払い方法のフィルタリング

## 問題

あなたはエクステンションの開発者で、あなたのエクステンションはチェックアウトのステップで支払いゲートウェイを条件付きで非表示にしています。フロントエンドの拡張性ポイントを使用して、チェックアウトブロックで支払いゲートウェイを非表示にできるようにする必要があります。

### 解決策

WooCommerce Blocksは`registerPaymentMethodExtensionCallbacks`という関数を提供し、エクステンションが特定の支払い方法に対するコールバックを登録し、支払いが可能かどうかを判断できるようにしています。

### インポート

#### エイリアス輸入

```js
import { registerPaymentMethodExtensionCallbacks } from '@woocommerce/blocks-registry';
```

#### `wc global`

```js
const { registerPaymentMethodExtensionCallbacks } = window.wc.wcBlocksRegistry;
```

### 署名

| パラメータ
| ----------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `namespace` | 拡張機能を識別するためのユニークな文字列です。他の拡張機能との名前の衝突を避けるものを選んでください。| `string`
| `callbacks`｜異なる支払い方法のために登録されたコールバックを含むオブジェクト｜< string, CanMakePaymentExtensionCallback > ｜レコード。

[コールバック](#callbacks-registered-for-payment-methods)については以下をお読みください。

#### 拡張名前空間の衝突

すでに`registerPaymentMethodExtensionCallbacks`で使用されている拡張ネームスペースの下にコールバックを登録しようとすると、登録は中止され、一意のネームスペースを使用していないことが通知されます。これはJavaScriptコンソールに表示されます。

### 使用例

```js
registerPaymentMethodExtensionCallbacks( 'my-hypothetical-extension', {
	cod: ( arg ) => {
		return arg.shippingAddress.city === 'Berlin';
	},
	cheque: ( arg ) => {
		return false;
	},
} );
```

### 支払方法に登録されたコールバック

エクステンションは、1つの支払い方法につき1つのコールバックしか登録できません：

```text
payment_method_name: ( arg ) => {...}
```

`payment_method_name`は、支払い方法がWooCommerce Blocksに登録されたときに使用された[nameプロパティ](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/checkout-payment-methods/payment-method-integration)の値です。

登録されたコールバックは、対応する支払い方法がショッパーのオプションとして利用可能かどうかを決定するために使用されます。この関数には、現在の注文に関するデータを含むオブジェクトが渡されます。

```ts
type CanMakePaymentExtensionCallback = (
	cartData: CanMakePaymentArgument
) => boolean;
```

各コールバックは以下の情報にアクセスできる。

```ts
interface CanMakePaymentArgument {
	cart: Cart;
	cartTotals: CartTotals;
	cartNeedsShipping: boolean;
	billingAddress: CartResponseBillingAddress;
	shippingAddress: CartResponseShippingAddress;
	selectedShippingMethods: Record< string, unknown >;
	paymentRequirements: Array< string >;
}
```

コールバックが受け取るパラメータで利用できないデータが必要な場合は、[Store APIでデータを公開する](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-add-data.md)ことを検討することができます。

## 要件による支払い方法のフィルタリング

### 問題

あなたのエクステンションは、特定の商品を含む注文を特定の支払ゲートウェイでのみ処理できるように、ストアに機能を追加しました。

`Bookings`の例で説明すると、買い物客が`Bookable`の商品、例えばホテルへの宿泊をカートに追加し、マーチャントであるあなたが支払いを行う前にすべての予約を確認したいとします。その時点では、顧客のチェックアウト情報を取得する必要はありますが、支払い方法を取得する必要はありません。

### 解決策

買い物客が支払いの詳細を入力せずにチェックアウトできるようにするために、他のチェックアウトの詳細を入力する必要がありますが、`Bookable`アイテムを含むカートを処理する新しい支払い方法を作成することができます。

支払い方法の`supports`設定を使用すると、他の支払い方法（クレジットカード、PayPalなど）がチェックアウトに使用されるのを防ぎ、エクステンションが追加した支払い方法のみがチェックアウトブロックに表示されるようにすることができます。

WooCommerce Blocksに支払い方法を登録する方法の詳細については、[支払い方法の統合](./payment-method-integration.md)ドキュメントを参照してください。

### 基本的な使い方

上記にリンクされている支払い方法の登録に関するドキュメントに従って、一意の`supports`機能、例えば`booking_availability`で支払い方法を登録する必要があります。これは、そのメソッドを分離し、他のメソッドが表示されないようにするために使用されます。

まず、カートの特定の支払い要件を決定するために、カートのチェックを実行する関数を作成する必要があります。以下は、`Bookable`の商品に対してこれを行う例です。

そして、`ExtendSchema`クラスで`register_payment_requirements`を使い、チェックアウト・ブロックにコールバックを実行させ、要件をチェックするように指示する必要があります。

### まとめ

このコード例では、`Pseudo_Booking_Class`というクラスがあり、`cart_contains_bookable_product`メソッドが利用可能であると仮定しています。このメソッドの実装はここでは関係ありません。

```php
/**
 * Check the content of the cart and add required payment methods.
 *
 *
 * @return array list of features required by cart items.
 */
function inject_payment_feature_requirements_for_cart_api() {
  // Cart contains a bookable product, so return an array containing our requirement of booking_availability.
  if ( Pseudo_Booking_Class::cart_contains_bookable_product() ) {
    return array( 'booking_availability' );
  }

  // No bookable products in the cart, no need to add anything.
  return array();
}
```

カートに予約可能な商品がある場合、この関数は`booking_availability`を含む配列を返し、そうでない場合は空の配列を返します。

次のステップでは、`ExtendSchema`クラスに、どの支払い方法を表示するかをチェックするときにこのコールバックを実行するように指示します。

そのためには、次のようなコードを使うことができる：

```php
add_action('woocommerce_blocks_loaded', function() {
  woocommerce_store_api_register_payment_requirements(
    array(
      'data_callback' => 'inject_payment_feature_requirements_for_cart_api',
    )
  );
});
```

このコード・ブロックのコメントに注意することが重要で、独自の`ExtendSchema`をインスタンス化してはならない。

正しい`supports`の値で支払い方法を正しく追加した場合、`Bookable`の商品をカートに入れた状態でチェックアウトのページに到達すると、`booking_availability`の要件を`supports`がサポートしていない方法は表示されず、`string`の要件を`namespace`がサポートしている方法は表示されます。
