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

## Products

| Route    | Flow name                  | Endpoint                       | Test File                                                   |
|----------|----------------------------|--------------------------------|-------------------------------------------------------------|
| Products | Can view all products      | `/wp-json/wc/v3/products`      | `tests/api-core-tests/tests/products/product-list.test.js`  |
| Products | Can search products        | `/wp-json/wc/v3/products`      | `tests/api-core-tests/tests/products/product-list.test.js`  |
| Products | Can add a simple product   | `/wp-json/wc/v3/products`      | `tests/api-core-tests/tests/products/products-crud.test.js` |
| Products | Can add a variable product | `/wp-json/wc/v3/products`      | `tests/api-core-tests/tests/products/products-crud.test.js` |
| Products | Can add a virtual product  | `/wp-json/wc/v3/products`      | `tests/api-core-tests/tests/products/products-crud.test.js` |
| Products | Can view a single product  | `/wp-json/wc/v3/products/{id}` | `tests/api-core-tests/tests/products/products-crud.test.js` |
| Products | Can update a product       | `/wp-json/wc/v3/products/{id}` | `tests/api-core-tests/tests/products/products-crud.test.js` |
| Products | Can delete a product       | `/wp-json/wc/v3/products/{id}` | `tests/api-core-tests/tests/products/products-crud.test.js` |

## Orders

| Route  | Flow name                                                        | Endpoints                    | Test File                                                 |
|--------|------------------------------------------------------------------|------------------------------|-----------------------------------------------------------|
| Orders | Can create an order                                              | `/wp-json/wc/v3/orders`      | `tests/api-core-tests/tests/orders/orders-crud.test.js`   |
| Orders | Can view a single order                                          | `/wp-json/wc/v3/orders/{id}` | `tests/api-core-tests/tests/orders/orders-crud.test.js`   |
| Orders | Can update an order                                              | `/wp-json/wc/v3/orders/{id}` | `tests/api-core-tests/tests/orders/orders-crud.test.js`   |
| Orders | Can delete an order                                              | `/wp-json/wc/v3/orders/{id}` | `tests/api-core-tests/tests/orders/orders-crud.test.js`   |
| Orders | Can view all orders                                              | `/wp-json/wc/v3/orders`      | `tests/api-core-tests/tests/orders/orders.test.js`        |
| Orders | Can search orders                                                | `/wp-json/wc/v3/orders`      | `tests/api-core-tests/tests/orders/order-search.test.js`  |
| Orders | Can add new Order complex - multiple product types & tax classes | `/wp-json/wc/v3/orders`      | `tests/api-core-tests/tests/orders/order-complex.test.js` |

## Refunds

| Route   | Flow name           | Endpoints                            | Test File                                           |
|---------|---------------------|--------------------------------------|-----------------------------------------------------|
| Refunds | Can refund an order | `/wp-json/wc/v3/orders/{id}/refunds` | `tests/api-core-tests/tests/refunds/refund.test.js` |

## Coupons

| Route   | Flow name                 | Endpoints                            | Test File                                            |
|---------|---------------------------|--------------------------------------|------------------------------------------------------|
| Coupons | Can create a coupon       | `/wp-json/wc/v3/coupons`             | `tests/api-core-tests/tests/coupons/coupons.test.js` |
| Coupons | Can update a coupon       | `/wp-json/wc/v3/coupons/{id}`        | `tests/api-core-tests/tests/coupons/coupons.test.js` |
| Coupons | Can delete a coupon       | `/wp-json/wc/v3/coupons/{id}`        | `tests/api-core-tests/tests/coupons/coupons.test.js` |
| Coupons | Can add a coupon to order | `/wp-json/wc/v3/orders/{id}/coupons` | `tests/api-core-tests/tests/coupons/coupons.test.js` |

## Shipping

| Route            | Flow name                                     | Endpoints                                    | Test File                                                    |
|------------------|-----------------------------------------------|----------------------------------------------|--------------------------------------------------------------|
| Shipping zones   | Can create shipping zones                     | `/wp-json/wc/v3/shipping/zones`              | `tests/api-core-tests/tests/shipping/shipping-zones.test.js` |
| Shipping methods | Can create shipping method to a shipping zone | `/wp-json/wc/v3/shipping/zones/{id}/methods` | n/a                                                          |
| Shipping classes | Can create a product shipping class           | `/wp-json/wc/v3/products/shipping_classes`   | `tests/api-core-tests/tests/products/products-crud.test.js`  |

