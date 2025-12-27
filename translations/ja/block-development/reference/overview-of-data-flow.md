---
post_title: Overview of data flow between client and server
sidebar_label: Data flow overview
---
# クライアントとサーバー間のデータフローの概要

WooCommerceのカートとチェックアウトブロックでは、サーバーは重要なトランザクションと永続的なデータの真実のソースです。これには以下が含まれます：

[-   カートアイテムの詳細（アイテム、数量、価格）
-   カート合計（税金、手数料、小計など）
-   顧客情報（配送先住所、請求先住所、その他の顧客データ）
    -   Additional Checkout Fields API](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/additional-checkout-fields/)を使用して追加されたフィールドもサーバーサイドに永続化されます。
-   配送方法と料金
-   適用されたクーポンなど、その他のカートの詳細

このようなデータは、異なるユーザー・セッションやデバイス間で正確性、一貫性、信頼性を保証するために、サーバー側に永続化されなければなりません。
一時的なバリデーション状態や、展開/折りたたみセクションのようなUI特有のインタラクションのような、一時的なUI状態は、クライアントサイドのままであるべきで、ページのロードに渡って特定の状態を維持する必要があるか、ユーザーのチェックアウトプロセスにとって重要でない限り、サーバーに自動的に永続化されるべきではありません。

サーバからクライアントにデータを取得したい場合もあれば、その逆もあるでしょう。このドキュメントでは、カート/チェックアウト・ブロックにおける一般的な概念とデータの流れを概説し、一般的な使用例に関するリンクやガイダンスを提供します。

## データはどこに保存されるのか？

カート、顧客、注文に関連するすべてのデータは、データベースまたは顧客のセッションのいずれかで、サーバーに保存されます。クライアントに送信されると、[`@wordpress/data`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/)データストアに保存されます。

## どうすればサーバーサイド(PHP)のデータをクライアント(JavaScript)に取り込めますか？

サーバーは真実の源であるため、クライアントからのすべてのデータは、オーダーとともに永続化される必要がある場合、最終的にサーバーに到達するはずである。

また、WooCommerceの設定ダッシュボードで設定された設定オプションや、外部サービス（宅配便の料金や支払いAPIなど）からのデータなど、クライアントがサーバーサイドでしか取得できないデータを必要としている場合もあります。

### サーバー（PHP）からクライアント（JavaScript）へ

データをサーバーからクライアントに送るには、静的か動的かによって2つの方法がある。

#### 静的データ

静的なデータは、例えばWooCommerceの設定ダッシュボードからのオプションのように、買い物客が取るアクションに基づいて変更される可能性はありません。このデータをクライアントに渡すには、`AssetDataRegistry`を使用することをお勧めします。

ここにデータが追加されると、ページロード時にシリアライズされてクライアントに送信されます。例えば、カートに商品を追加したり、住所を変更したりといった、買い物客のアクションによってデータが変更されることはありません。

キーと値のペアは、レジストリに次のように追加できる：

```php
add_action(
    'woocommerce_blocks_loaded',
    function() {
      $asset_data_registry = \Automattic\WooCommerce\Blocks\Package::container()->get( \Automattic\WooCommerce\Blocks\Assets\AssetDataRegistry::class );
      $asset_data_registry->add( 'namespace/value', 'this is a custom value' );
    }
);
```

重複キーが存在する場合、上書きされることはありません。一意な識別子を使用することは重要であり、推奨は `namespace/value` である。

クライアントでこのデータを取得するには、`wc.wcSettings.getSetting`を次のように使う：

```js
const myCustomValue = wc.wcSettings.getSetting(
	'namespace/value',
	'Fallback value.'
);
```

#### 動的データ

動的データとは、買い物客の行動に応じて変化する可能性のあるデータのことで、例えば、場所やカート内のアイテムの変更などです。この場合、カートAPIのレスポンスにこれを追加する必要がある。カートレスポンスは、買い物客の移動中に多くのルートで送信され、カート/チェックアウトブロックによってトリガーされるほとんどすべてのAPIレスポンスで送信されます。

[ここにデータを追加するには、APIレスポンスを拡張する必要があります。ストアAPIでデータを公開する](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-add-data.md)を参照してください。

### クライアント(JavaScript)からサーバー(PHP)へ

クライアントからサーバーへのデータ取得は、3つの異なる方法で行うことができる：

#### チェックアウトフィールドの更新

ショッパーがチェックアウトフィールドを更新すると、データは即座にサーバに送信されます。追加フィールドの場合、`/checkout`エンドポイントへのPUTリクエストで送信されます。アドレスフィールドの場合は、`cart/update-customer`エンドポイントへのPOSTリクエストで送信されます（バッチ処理）。どちらも更新されたカートを返し、それがクライアントに適用され、合計が更新されます。

#### ストア API リクエストのピギーバック

[例えば、チェックアウトに新しいブロックを追加し、その中に注文と一緒に保存されるべきフォームフィールドが含まれている場合などです。このフォームフィールドが保存されるだけで、カートの他の値を更新する必要がない場合、データはチェックアウトリクエストと一緒に送信されるべきです。WooCommerce チェックアウトブロックにカスタムフィールドを含む新しいインナーブロックを追加する](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-add-custom-fields.md) ドキュメントでは、`setExtensionData`を使用する例と、既存のリクエストでデータを受信するためにStore APIを拡張する例を示しています。

#### `extensionCartUpdate`を使用したオンデマンドデータ送信

Store APIリクエストが行われるのを待たずに、すぐにデータをサーバーに送信したい場合があります。例えば、料金の追加、利用可能な配送方法の変更、税率の変更などです。

[Store APIによるカートのオンデマンド更新](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-update-cart.md) ドキュメントに、この方法の概要が記載されています。 

## Cart/Checkoutブロックではいつデータを送受信しますか？

### ページロード

ページロード時に、CartまたはCheckoutブロックが存在する場合、カートの状態は最初のリクエストと一緒に送信され、クライアント側の[`@wordpress/data`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/)データストアに格納されます。

ページロード時に、`wc/store/cart`と`wc/store/checkout`データストアはサーバーからのデータで満たされます。`wc/store/payment`データストアは、サーバーからのデータで部分的に満たされますが、すべての支払い方法がそこに登録される前に、クライアント側の処理が完了する必要があります。

### 顧客データをチェックアウトフォームに入力する

買い物客がフォームにデータを入力すると、データは直ちに`wc/store/cart`データストアに書き込まれ、[`pushChanges`](https://github.com/woocommerce/woocommerce/blob/4861ec250ef1789f814f4209755165e8abe7b838/plugins/woocommerce-blocks/assets/js/data/cart/push-changes.ts#L167)と呼ばれるデバウンスメソッドが呼び出されます。このメソッドは顧客データをサーバーに送信し、そこで顧客データが永続化されます。完全なカートがレスポンスとして送り返され、データストアがこれで更新されます。

なぜなら、顧客アドレスを変更するコードがサーバー上で実行されている場合、それがレスポンスに反映されるからである。

例えば、あるプラグインが住所データを修正し、すべての都市名が大文字になるようにした場合、買い物客が都市名に「london」と入力すると、データがクライアントに返されるときにテキストは「London」に変わり、入力フィールドは更新されます。

買い物客がフォームを操作している最中にフォームフィールドを変更することは、不快な体験となるため、ユーザーがフォームを操作している最中に変更するのではなく、サーバー上でチェックアウトアクションを処理している最中に変更することを検討しましょう。

### クーポンの追加

買い物客がクーポンフォームを展開すると、その状態はローカルに保存されます。このようなデータはサーバーに送信されません。クーポンを追加するリクエストは、ショッパーが適用ボタンを押したときに行われます。Store APIリクエストが行われ、新しいカートが返され、それが適用されます。

### 発送方法の変更

買い物客が配送方法を変更すると、Store APIリクエストが行われ、新しいカートが返され、それが適用される。

### 支払方法の変更

買い物客が支払い方法を変更しても、自動的にStore APIリクエストがサーバーに送信されるわけではありません。支払い方法が変更され、注文が行われる前にサーバーを更新する必要がある場合は、[`cartExtensionUpdate`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-update-cart.md)を使用するのが正しい方法です。

### オーダーノートの追加・編集

注文メモの追加や編集はクライアント上でローカルに保存され、これらのメモは買い物客がチェックアウトフォームを送信するまでサーバーには送信されません。

## Cart

上記のチェックアウトのセクションに記載されている項目は、カートブロックにも当てはまります（支払い方法を変更する以外に、買い物客はカートブロック上で支払い方法を選択することはできません。）

### 商品の数量変更、追加、削除

買い物客が商品の数量を更新したり、カートから商品を削除したり、商品を追加したりする際（例：カートのクロスセルブロックから）、Store APIリクエストが行われます。ローカルカートはレスポンスで更新されます。

### 送料計算機の使用

これはチェックアウトブロックの住所フォームと同じように動作しますが、配送計算機の住所は、郵便番号が有効で、すべての必須フィールドに値がある場合にのみサーバーに送信されます。
