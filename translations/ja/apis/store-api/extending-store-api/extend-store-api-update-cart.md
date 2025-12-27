# カートのオンデマンド更新

## 問題

あなたはエクステンションの開発者です。あなたのエクステンションは、クライアントサイドの入力、つまり買い物客がカートのサイドバーの入力フィールドに入力し、ボタンを押した結果として、サーバーサイドの処理を行います。

このサーバー側の処理によってカートの状態が変更され、クライアント側のカートまたはチェックアウトブロックに表示されるデータを更新したいとします。

クライアントサイドのカートの状態を自分で更新することはできません。これは、誤動作するエクステンションが不注意に不正なデータや無効なデータで更新してしまい、ブロック全体が壊れてしまうのを防ぐために制限されています。

## 解決策

`ExtendSchema`は、クライアントサイドのCartまたはCheckoutから実行するように指示されたときに実行されるコールバック関数を登録する拡張機能を提供します。

WooCommerce Blocksは`extensionCartUpdate`というフロントエンド関数も提供しており、クライアントサイドのコードから呼び出すことができます。このエンドポイントがヒットすると、関連する（`extensionCartUpdate`に提供されたネームスペースに基づく）コールバックが実行され、最新のサーバー側カートデータが返され、この新しいデータでブロックが更新されます。

## 基本的な使い方

エクステンションのサーバーサイドの統合コードで

```php
add_action('woocommerce_blocks_loaded', function() {
  woocommerce_store_api_register_update_callback(
    [
      'namespace' => 'extension-unique-namespace',
      'callback'  => /* Add your callable here */
    ]
  );
} );
```

とクライアント側：

```ts
const { extensionCartUpdate } = wc.blocksCheckout;
const { processErrorResponse } = wc.wcBlocksData;

extensionCartUpdate( {
	namespace: 'extension-unique-namespace',
	data: {
		key: 'value',
		another_key: 100,
		third_key: {
			fourth_key: true,
		},
	},
} ).then( () => {
	// Cart has been updated.
} ).catch( ( error ) => {
	// Handle error.
	processErrorResponse(error);
} );
```

## 考慮すべきこと

### 拡張機能はクライアント側のカートの状態を自分で更新することはできません。

なぜカートを更新する拡張機能用のカスタムAJAXエンドポイントを作ることができないのか不思議に思うかもしれません。前述したように、拡張機能はクライアントサイドのカートの状態を更新することが許可されていません。その代わりに、`extensionCartUpdate`関数を使用してこれを行う必要があります。

### 指定された名前空間のコールバックは 1 つだけ登録できます。

このことを念頭に置いて、エクステンションに複数のクライアントサイドインタラクションがあり、その結果サーバーサイドで実行されるコードパスが異なる場合、`extensionCartUpdate`に追加のデータを渡すとよいでしょう。例えば、ユーザーができるアクションが2つあり、1つは割引を追加するアクション、もう1つは割引を削除するアクションです。そして、コールバックでこの値をチェックすることで、どのコードパスを実行すべきかを区別することができます。

```php
<?php
function add_discount() {
  /* Do some processing here */
}

function remove_discount() {
  /* Do some processing here */
}

add_action('woocommerce_blocks_loaded', function() {
  woocommerce_store_api_register_update_callback(
    [
      'namespace' => 'extension-unique-namespace',
      'callback'  => function( $data ) {
        if ( $data['action'] === 'add' ) {
          add_discount( );
        }
        if ( $data['action'] === 'remove' ) {
          remove_discount();
        }
      }
    ]
  );
} );
```

同じネームスペースで再度登録しようとすると、以前に登録したコールバックは上書きされる。

## API定義

`ExtendSchema::register_update_callback`：指定された名前空間で `cart/extensions` エンドポイントがヒットしたときに実行されるコールバックを登録するために使用します。引数の配列を受け取ります。

| 属性 | タイプ | 必須 | 説明 |
| ----------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `namespace` | `string` | はい｜ 拡張機能の名前空間です。これは、どの拡張機能のコールバックを実行するかを決定するために使用されます。                                                                                                                                                                                                                                                                                                                  |
| `callback` | `Callable` | Yes | `cart/extensions` エンドポイントに指定されたものと一致する `namespace` がヒットしたときに実行される関数/メソッド (または callable)。callableは引数を1つ取ります。この引数を介してコールバックに渡されるデータは、あなたがコールバックに渡すために選択した任意のデータを含む配列になります。callableは何も返す必要はありませんが、もし返す場合はその返り値は使用されません。|

### JavaScript

`extensionCartUpdate`：登録したコールバックを実行させたいことを通知し、コールバックにデータを渡すために使用する。唯一の引数としてオブジェクトを受け取ります。

| 属性 | タイプ | 必須 | 説明 |
| ----------- |-----------|----------| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `namespace` | `string` | はい｜ 拡張機能の名前空間です。これは、どの拡張機能のコールバックを実行するかを決定するために使用されます。                                                       |
| `data` | `Object` | No | コールバックに渡すデータ。`data`のキーは、コールバックの最初の（そして唯一の）引数として連想配列で渡されます。|
| `overwriteDirtyCustomerData` | `boolean` | いいえ｜クライアント内の顧客データを、ダーティ(まだサーバーにプッシュされていない)であっても、サーバーから返されたデータで上書きするかどうか。|

## ♪まとめよう

あなたは、買い物客があなたのウェブサイトで獲得したポイントを注文の割引と交換できる拡張機能の作者です。買い物客が交換したいポイント数を入力するテキストフィールドと、交換を適用する送信ボタンがあります。

拡張機能では、[`DiscountsMeta`](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/available-slot-fills/)を使用して、カートブロックとチェックアウトブロックのサイドバーにこれらのUI要素を追加します。スロット

スロットの使い方の詳細については、[スロットと塗りつぶしに関するドキュメント](/docs/block-development/reference/slot-fills/)を参照してください。

実装されると、サイドバーにはこのようにコントロールが追加される：

![image](https://user-images.githubusercontent.com/5656702/125109827-bf7c8300-e0db-11eb-9e51-59921b38a0c2.png)

### 換金」ボタン

UIでは、Reactの`useState`変数を使用して、買い物客が`Enter amount`ボックスに入力した値をトラッキングしています。この例の変数は`pointsInputValue`と呼びます。

`Redeem`ボタンがクリックされると、買い物客がボックスに入力した内容に基づいて、買い物客のバスケットに適用するポイント数をサーバーに伝え、関連する割引を適用し、サーバー側のカートを更新し、更新された価格をクライアント側のサイドバーに表示します。

これを行うには、`extensionCartUpdate`を使用して、コールバックを実行したいことをサーバーに伝え、新しいカートの状態をUIに読み込ませる必要があります。ボタンの`onClick`ハンドラは以下のようになります：

```js
const { extensionCartUpdate } = window.wc.blocksCheckout;

const buttonClickHandler = () => {
	extensionCartUpdate( {
		namespace: 'super-coupons',
		data: {
			pointsInputValue,
		},
	} );
};
```

### `cart/extensions` エンドポイントがヒットしたときに実行するコールバックを登録する

今のところWooCommerce Blocksにコールバックを登録していないので、`extensionCartUpdate`によって`cart/extensions`エンドポイントがヒットしても何も起こりません。

Store APIにデータを追加するのと同じように([Store APIでデータを公開する](./extend-store-api-add-data.md)で詳しく説明しています)、WooCommerce Blocksの`ExtendSchema`クラスで`register_update_callback`メソッドを呼び出すことでコールバックを追加できます。

WooCommerceのカートに割引を適用する`redeem_points`という関数を書きました。この関数は何も返しません。この関数の実際の実装はこのドキュメントの焦点ではないので省略しました。重要なのはWooCommerceのカートを変更するということだけです。

```php
<?php
function redeem_points( $points ) {
  /* Do some processing here that applies a discount to the WC cart based on the value of $points */
}

add_action('woocommerce_blocks_loaded', function() {
  woocommerce_store_api_register_update_callback(
    [
      'namespace' => 'super-coupons',
      'callback'  => function( $data ) {
        redeem_points( $data['points'] );
      },
    ]
  );
} );
```

これで登録が完了し、ボタンが押されると`cart/extensions`エンドポイントがヒットし、`super-coupons`の`namespace`を持つ`redeem_points`関数が実行されます。この処理が終了すると、WooCommerce Blocksによってクライアントサイドのカートが更新されます。

