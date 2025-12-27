---
post_title: Critical flows within the WooCommerce Core API
sidebar_label: API critical flows
---

# Critical flows within the WooCommerce Core API

私たちのドキュメントでは、WooCommerce Core API内の重要なユーザーフローを特定しました。これらのフローは
私たちのテストイニシアチブの羅針盤となり、最も重要なところに私たちの努力を集中させる助けとなります。また
修正の影響を評価し、問題の優先順位を決定するための貴重な洞察を提供します。

重要なのは、これらのフローがダイナミックであり続け、プラットフォームと歩調を合わせて進化していることだ。定期的に
更新、追加、再優先順位付けが行われ、システムの進化するニーズと一致します。

## 製品

| ルート|フロー名|エンドポイント|テストファイル
|----------|----------------------------|--------------------------------|-------------------------------------------------------------|
| 商品｜全商品を見ることができる｜`/wp-json/wc/v3/products`｜`tests/api-core-tests/tests/products/product-list.test.js`｜｜商品｜検索できる
| 商品｜商品を検索できる｜`/wp-json/wc/v3/products`｜`tests/api-core-tests/tests/products/product-list.test.js`｜｜｜｜｜｜商品｜商品を簡易追加できる
| `/wp-json/wc/v3/products`｜`tests/api-core-tests/tests/products/products-crud.test.js`｜商品｜シンプルな商品を追加できる
| 商品｜可変商品を追加できる｜`/wp-json/wc/v3/products`｜`tests/api-core-tests/tests/products/products-crud.test.js`｜｜商品｜バーチャル商品を追加できる
| 商品｜バーチャル商品を追加できる｜`/wp-json/wc/v3/products`｜`tests/api-core-tests/tests/products/products-crud.test.js`｜｜商品｜単一商品を表示できる
| `tests/api-core-tests/tests/products/products-crud.test.js`｜商品｜商品を1つだけ表示できる
| Products | Can update a product       | `/wp-json/wc/v3/products/{id}` | `tests/api-core-tests/tests/products/products-crud.test.js` |
| 商品｜商品を削除できる｜`/wp-json/wc/v3/products/{id}`｜`tests/api-core-tests/tests/products/products-crud.test.js` |

| ルート│フロー名│エンドポイント│テストファイル
|--------|------------------------------------------------------------------|------------------------------|-----------------------------------------------------------|
| Orders | Can create an order                                              | `/wp-json/wc/v3/orders`      | `tests/api-core-tests/tests/orders/orders-crud.test.js`   |
| 注文｜注文を1件表示できる｜`/wp-json/wc/v3/orders/{id}`｜`tests/api-core-tests/tests/orders/orders-crud.test.js`｜｜注文｜注文を更新できる
| 注文｜注文を更新できる｜`/wp-json/wc/v3/orders/{id}`｜`tests/api-core-tests/tests/orders/orders-crud.test.js`｜｜注文｜注文を削除できる。
| 注文｜注文を削除できる｜`/wp-json/wc/v3/orders/{id}`｜`tests/api-core-tests/tests/orders/orders-crud.test.js`｜注文｜すべての注文を表示できる
| 注文｜すべての注文を表示する｜`/wp-json/wc/v3/orders`｜`tests/api-core-tests/tests/orders/orders.test.js`｜｜注文｜注文を検索することができます。
| Orders | Can search orders                                                | `/wp-json/wc/v3/orders`      | `tests/api-core-tests/tests/orders/order-search.test.js`  |
| 注文｜複数の商品タイプや税クラスを複合した新しい注文を追加できる｜ `/wp-json/wc/v3/orders` | `tests/api-core-tests/tests/orders/order-complex.test.js` |

| ルート│フロー名│エンドポイント│テストファイル
|---------|---------------------|--------------------------------------|-----------------------------------------------------|
| Refunds | Can refund an order | `/wp-json/wc/v3/orders/{id}/refunds` | `tests/api-core-tests/tests/refunds/refund.test.js` |

| ルート│フロー名│エンドポイント│テストファイル
|---------|---------------------------|--------------------------------------|------------------------------------------------------|
| Coupons | Can create a coupon       | `/wp-json/wc/v3/coupons`             | `tests/api-core-tests/tests/coupons/coupons.test.js` |
| Coupons | Can update a coupon       | `/wp-json/wc/v3/coupons/{id}`        | `tests/api-core-tests/tests/coupons/coupons.test.js` |
| クーポン｜クーポンを削除できる｜`/wp-json/wc/v3/coupons/{id}`｜`tests/api-core-tests/tests/coupons/coupons.test.js` |
| クーポン｜注文にクーポンを追加できる | `/wp-json/wc/v3/orders/{id}/coupons` | `tests/api-core-tests/tests/coupons/coupons.test.js` |

## 送料

| ルート│フロー名│エンドポイント│テストファイル
|------------------|-----------------------------------------------|----------------------------------------------|--------------------------------------------------------------|
| 配送ゾーン｜配送ゾーンを作成できる｜`/wp-json/wc/v3/shipping/zones`｜`tests/api-core-tests/tests/shipping/shipping-zones.test.js`｜｜配送方法｜配送ゾーンに配送方法を作成できる
| 配送方法｜配送ゾーンへの配送方法を作成できます。
| 配送クラス｜商品の配送クラスを作成できます。

