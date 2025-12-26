---
post_title: Frequently asked questions
sidebar_label: Frequently asked questions
---
# よくある質問

このドキュメントは、WooCommerce Blocksを拡張する開発者からよく寄せられる質問にお答えすることを目的としています。

FAQは質問を受け次第、追加していく予定です。

ここにない質問は、[GitHub [Discussions](https://github.com/woocommerce/woocommerce/discussions) または [WooCommerce [Community Slack](https://woocommerce.com/community-slack/) でお尋ねください。

## 一般的な質問

### カートやチェックアウトの変更（配送方法の選択、住所の変更など）にはどのように対応すればよいですか？

カートブロックとチェックアウトブロックはすべてのデータを[`@wordpress/data`データストア](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/)から読み込みます。また、[WooCommerceブロックが使用するデータストアのドキュメント](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/data-store)もあります。

開発者は、カートやチェックアウトの変更に反応したいと思うのが普通です。例えば、ユーザーが配送方法を変更した場合や、住所の行を変更した場合などです。

これを行うには、コードの実行方法に応じて2つの方法がある。

#### コードがReactコンポーネントで実行されている場合

コンポーネントがカート/チェックアウトのインナーブロックである場合、または[スロット/フィル](/docs/block-development/reference/slot-fills/)でレンダリングされる場合、関連するデータストアから必要なデータを直接選択し、データが変更されたときに必要なアクションを実行できます。利用可能なセレクタの詳細については、[関連するデータストアのドキュメント](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/data-store)を参照してください。

```js
/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { cartStore } from '@woocommerce/block-data';
import { useEffect } from '@wordpress/element';

export const MyComponent = () => {
	const { shippingAddress } = useSelect(
		( select ) => select( cartStore ).getCartData(),
		[]
	);
	useEffect( () => {
		// Do something when shippingAddress changes
	}, [ shippingAddress ] );
};
```

#### コードが非反応コンテキストで実行されている場合

これは、ブロックをレンダリングしていない場合や、Reactコードを実行していない場合に当てはまります。つまり、Reactフックや`useSelect`のようなカスタムフックにアクセスできない。この場合、`useSelect`に代わる非フックの`select`を使用する必要があります。変更に反応する必要があるため、`select`を呼び出すだけでは十分ではありません。`subscribe`メソッドを使用して、興味のあるデータの変更を購読する必要があります。

```ts
/**
 * External dependencies
 */
import { select, subscribe } from '@wordpress/data';
import { cartStore } from '@woocommerce/block-data';

let previousCountry = '';
const unsubscribe = subscribe( () => {
  const { shippingAddress } = select( cartStore ).getCartData();
  if ( shippingAddress.country !== previousCountry ) {
    previousCountry = shippingAddress.country;
    // Do something when shipping country changes.
  }
  if ( /* some other condition that makes this subscription no longer needed */ ) {
    unsubscribe();
  }
}, cartStore );
```

`subscribe`コールバックは、データストアがアクションを受け取るたびに実行されるので、キャッシュを使用して、不要なときに処理を行わないようにする必要があります。例えば、国が変わったときだけ処理を行いたいのであれば、タスクを実行する前に以前の値をキャッシュし、現在の値と比較する必要があります。

変更に反応する必要がなくなった場合は、上の例のように、`subscribe`メソッドから返される`unsubscribe`メソッドを使用して、データストアからの登録を解除することができる。

## カートの改造

### クライアントからカートに動的に変更を加えるには？

クライアント側のアクションに基づいてサーバー上でアクションを実行するには、[`extensionCartUpdate`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-update-cart.md)を使う必要がある。

例として、あなたのサイトに「メーリングリストに登録すると10%オフ」チェックボックスを追加するには、`extensionCartUpdate`を使用して、自動的に10%クーポンをカートに適用することができます。

![Image](https://github.com/user-attachments/assets/e0d114b1-4e4c-4b34-9675-5571136b36d0)

Additional Checkout Fields APIを通じて、またはインナーブロックを作成することによって、チェックボックスをすでに追加したと仮定すると、次のステップは、チェックボックスがチェックされている場合はクーポンを適用し、チェックされていない場合はクーポンを削除するサーバー側のコードを登録することです。

```php
add_action('woocommerce_blocks_loaded', function() {
  woocommerce_store_api_register_update_callback(
    [
      'namespace' => 'extension-unique-namespace',
      'callback'  => function( $data ) {
        if ( isset( $data['checked'] ) && filter_var( $data['checked'], FILTER_VALIDATE_BOOLEAN ) === true ) {
          WC()->cart->apply_coupon( 'mailing-list-10-percent-coupon' );
        } else {
          WC()->cart->remove_coupon( 'mailing-list-10-percent-coupon' );
        }
      }
    ]
  );
} );
```

フロントエンドのチェックボックスのイベントリスナーのコードは次のようになる：

```js
const { extensionCartUpdate } = window.wc.blocksCheckout;

const onChange = ( checked ) => {
    extensionCartUpdate(
        {
            namespace: 'extension-unique-namespace',
            data: {
                checked
            }  
        } 
    )
}
```

このクーポンが注文サマリーのクーポンリストにどのように表示されるかを変更するには、`coupons`チェックアウトフィルターを次のように使用します：

```js
const { registerCheckoutFilters } = window.wc.blocksCheckout;

const modifyCoupons = ( coupons, extensions, args ) => {
	return coupons.map( ( coupon ) => {
		if ( ! coupon.label === 'mailing-list-10-percent-coupon' ) {
			return coupon;
		}

		return {
			...coupon,
			label: 'Mailing list discount',
		};
	} );
};

registerCheckoutFilters( 'extension-unique-namespace', {
	coupons: modifyCoupons,
} );
```

### 特定の支払い方法を選択した場合、カートに料金を追加するにはどうすればよいですか？

選択された支払い方法に基づいて、サーバーに料金を追加する必要があります。

これは、料金を追加するために必要なサーバー側のコードです：

```php
add_action(
	'woocommerce_cart_calculate_fees',
	function () {
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
			return;
		}

		$chosen_payment_method_id = WC()->session->get( 'chosen_payment_method' );
		$cart                     = WC()->cart;

		if ( 'your-payment-method-slug' === $chosen_payment_method_id ) {
			$percentage = 0.05;
			$surcharge  = ( $cart->cart_contents_total + $cart->shipping_total ) * $percentage;
			$cart->add_fee( 'Payment method fee', $surcharge );
		}
	}
);
```

### カートをサーバーから強制更新する方法

これは、[`extensionCartUpdate`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-update-cart.md)を使うのが望ましい方法ですが、有効なカートオブジェクトを持つ`wc/store/cart`データストアで`receiveCart`アクションを実行することによっても可能です：

```js
const { dispatch } = window.wp.data;

dispatch( 'wc/store/cart' ).receiveCart( cartObject )
```

Store API上のすべてのカートルートは、ここで使用できるカートオブジェクトを返します。ここに無効なカートオブジェクトを渡すと、ブロックでエラーが発生します。

使うこともできる：

```js
const { dispatch } = window.wp.data;

dispatch('wc/store/cart').invalidateResolutionForStore()
```

ただし、この場合、新しいカートが取得される間、空のカートが短時間点滅します。

### カートの各アイテムに何かをレンダリングするには？

この方法は現在 ** 公式にはサポートされていませんが、DOM 操作や React ポータルを使用してこの方法を実行している開発者の話を聞いたことがあります。この方法を選択した場合、将来 Cart ブロックが変更されたときに、統合が機能しなくなる可能性があることに注意してください。 

#チェックアウトの修正

### チェックアウトフィールドを削除するには？

WordPressとWooは様々なプラグインをサポートしているため、私たちはこれを推奨していません。これらの中にはチェックアウトフィールドに依存して機能するものもありますが、そのフィールドを削除しても問題ない場合は、[チェックアウトフィールドの削除](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/removing-checkout-fields/) をご覧ください。

### チェックアウト時に注文や顧客データを変更するにはどうすればよいですか？

チェックアウト時に送信された注文データや顧客データを修正したい場合は、`woocommerce_store_api_checkout_order_processed`アクションを使用することができます。

このアクションは支払いが処理される直前に実行されます。この時点で、WooCommerceのライフサイクルの他の時点と同じように注文を変更することができますが、変更を永続化するために`$order->save()`を呼び出す必要があります。

例として、ユーザーの姓と名が大文字であることを確認してみましょう：

```php
add_action(
  'woocommerce_store_api_checkout_order_processed',
  function( WC_Order $order ) {
    $order->set_shipping_first_name( ucfirst( $order->get_shipping_first_name() ) );
    $order->set_shipping_last_name( ucfirst( $order->get_shipping_last_name() ) );

    $order->set_billing_first_name( ucfirst( $order->get_billing_first_name() ) );
    $order->set_billing_last_name( ucfirst( $order->get_billing_last_name() ) );

    $order->save();
  }
);
```

### チェックアウトブロックで何かをレンダリングするには？

これは何をレンダリングしたいかによる。

#### フィールドのレンダリング

チェックアウト・ブロックのフィールドをレンダリングするための推奨アプローチは、[Additional Checkout Fields API](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/additional-checkout-fields/)を使用することです。

#### カスタムブロックのレンダリング

チェックアウト・ブロックにカスタム・ブロックをレンダリングするには、既存のチェックアウト・インナー・ブロックの1つの子ブロックを作成することをお勧めします。インナー・ブロックの設定と研究に使用できるテンプレートの例があります。これをインストールして使用するには、[`@woocommerce/extend-cart-checkout-block`](https://github.com/woocommerce/woocommerce/blob/trunk/packages/js/extend-cart-checkout-block/README.md)の指示に従ってください。この例には、インナー・ブロックだけでなく、他にも複数の拡張性の例が含まれていることに注意してください。
