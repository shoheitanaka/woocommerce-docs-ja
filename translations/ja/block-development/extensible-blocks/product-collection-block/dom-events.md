---
post_title: DOM Events sent from product collection block
sidebar_label: DOM events
---
# 商品コレクションブロックから送信されるDOMイベント

## `wc-blocks_product_list_rendered`

このイベントは、商品コレクションブロックがレンダリングまたは再レンダリングされたときにトリガーされます（ページ変更など）。

### `detail` パラメータ

| Parameter          | Type    | Default value | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `collection` | string | `undefined` | コレクション・タイプ。タイプを指定しないので、"create your own "コレクションでは`undefined`です。他のCoreコレクションでは、`woocommerce/product-collection/best-sellers`となります：`undefined`, `woocommerce/product-collection/featured`, `woocommerce/product-collection/new-arrivals`, `woocommerce/product-collection/on-sale`, `woocommerce/product-collection/top-rated` のいずれかです。カスタム・コレクションの場合は、その名前が格納されます。|

### 使用例

```javascript
window.document.addEventListener(
  'wc-blocks_product_list_rendered',
  ( e ) => {
    const { collection } = e.detail;
    console.log( collection ) // -> collection name, e.g. woocommerce/product-collection/on-sale
  }
);
```

## イベントイベント： `wc-blocks_viewed_product`

このイベントは、商品を見るためにいくつかのブロックがクリックされたときにトリガーされます（商品ページにリダイレクトされます）。

### `detail` パラメータ

| Parameter          | Type    | Default value | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `collection` | string | `undefined` | コレクション・タイプ。タイプを指定しないので、"create your own "コレクションでは`undefined`です。他のCoreコレクションでは、`woocommerce/product-collection/best-sellers`となります：`undefined`, `woocommerce/product-collection/featured`, `woocommerce/product-collection/new-arrivals`, `woocommerce/product-collection/on-sale`, `woocommerce/product-collection/top-rated` のいずれかです。カスタム・コレクションの場合は、その名前が格納されます。|
| 番号｜商品ID｜`productId`。

### 使用例

```javascript
window.document.addEventListener(
  'wc-blocks_viewed_product',
  ( e ) => {
    const { collection, productId } = e.detail;
    console.log( collection ) // -> collection name, e.g. "woocommerce/product-collection/featured" or undefined for default one
    console.log( productId ) // -> product ID, e.g. 34
  }
);
```
