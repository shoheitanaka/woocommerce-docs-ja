---
post_title: DOM events
sidebar_label: DOM Events
sidebar_position: 3
---

# DOM events

いくつかのブロックは、最新のデータを表示したり、特定の方法で動作するために、特定のイベントに反応する必要があります。例えば、カートの中身を更新するために'add to cart'イベントをリッスンする必要があるCartブロックや、商品がカートに追加されるたびに開かれるMini-Cartブロックがそうです。

## WooCommerceコアイベント in WooCommerceブロック

WooCommerceのコアは、商品がカートに追加された時やカートから削除された時など、特定のイベントをトリガーしたりリッスンするためにjQueryイベントを使用しています。WooCommerce BlocksではjQueryを使用しませんが、これらのイベントをリッスンする必要があります。これを実現するために、[`translatejQueryEventToNative()`](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/3f7c3e517d7bf13008a22d0c2eb89434a9c35ae7/assets/js/base/utils/legacy-events.ts#L79-L106)というユーティリティを用意し、jQueryイベントをリッスンし、イベントがトリガーされるたびに、関連するDOMネイティブイベント(`wc-blocks_`プレフィックス付き)をトリガーします。

## WooCommerce ブロックイベント

### `wc-blocks_adding_to_cart`。

このイベントはWooCommerceコアでトリガーされるjQueryイベント`adding_to_cart`に相当します。これは商品をカートに追加するプロセスがサーバーに送信されたことを示しますが、商品が正常に追加されたかどうかはまだ表示されません。

WCブロックでの使用例:_ Mini-Cart ブロックは、このイベントをリッスンして依存関係を追加します。

### `wc-blocks_added_to_cart`。

このイベントはWooCommerceコアでトリガーされるjQueryイベント`added_to_cart`に相当します。これは商品をカートに追加するプロセスが成功裏に終了したことを示します。

WCブロックでの使用例:_ CartブロックとMini-Cartブロック(`useStoreCart()`フック経由)は、コンテンツを更新する必要があるかどうかを知るために、このイベントをリッスンします。

#### `detail` パラメータ

| Parameter          | Type    | Default value | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preserveCartData` | boolean | `false` | ストア内のカート・データを保存するかどうか。デフォルトでは`false`なので、`wc-blocks_added_to_cart`イベントが発生するとカートデータは無効になり、このイベントをリッスンしているブロックはカートデータを再取得します。しかし、イベントをトリガーするコードがすでにストアを更新している場合（例えば、All Productsブロック）、`preserveCartData: true`を設定することで、他のブロックがデータを再取得するのを避けることができます。|

### `wc-blocks_removed_from_cart`。

このイベントはWooCommerceコアでトリガーされるjQueryイベント`removed_from_cart`に相当します。カートから商品が削除されたことを示します。

WCブロックでの使用例:_ CartブロックとMini-Cartブロック(`useStoreCart()`フック経由)は、コンテンツを更新する必要があるかどうかを知るために、このイベントをリッスンします。
