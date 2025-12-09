---
post_title: Useful core functions
---

# Useful core functions

WooCommerce core functions are available on both front-end and admin. They can be found in `includes/wc-core-functions.php` and can be used by themes in plugins.

## Conditional Functions

WooCommerceの条件付き関数は、現在のクエリ/ページを決定するのに役立ちます。

### is_woocommerce

WooCommerceテンプレートを使用するページの場合、trueを返します（カートとチェックアウトはショートコード付きの標準ページなので、含まれません）。

```php
is_woocommerce()
```

### is_shop

商品タイプアーカイブ(ショップ)を表示するときにtrueを返します。

```php
is_shop()
```

### is_product

単一の製品を表示するときにtrueを返す。

```php
is_product()
```

## Coupon Functions

### wc_get_coupon_code_by_id

クーポンIDでクーポンコードを取得

```php
wc_get_coupon_code_by_id( $id )
```

The argument `$id` is the coupon ID.

### wc_get_coupon_id_by_code

コードでクーポンIDを取得します。

```php
wc_get_coupon_id_by_code( $code, $exclude = 0 )
```

`$code` is the coupon code and `$exclude` is to exclude an ID from the check if you're checking existence.

## User Functions

### wc_customer_bought_product

顧客が商品を購入したかどうかをチェックします。チェックはEメールかユーザーID、またはその両方で行うことができます。

```php
wc_customer_bought_product( $customer_email, $user_id, $product_id )
```

### wc_get_customer_total_spent

顧客の合計金額を取得します。

```php
wc_get_customer_total_spent( $user_id )
```

`$user_id` is the user ID of the customer.

### wc_get_customer_order_count

顧客の合計注文数を取得します。

```php
wc_get_customer_order_count( $user_id )
```

`$user_id` is the user ID of the customer.

## Formatting Functions

### wc_get_dimension

Takes a measurement `$dimension` measured in WooCommerce's dimension unit and converts it to the target unit `$to_unit`.

```php
wc_get_dimension( $dimension, $to_unit, $from_unit = '' )
```

使用例：

```php
wc_get_dimension( 55, 'in' );
wc_get_dimension( 55, 'in', 'm' );
```

### wc_get_weight

Takes a weight `$weight` weighed in WooCommerce's weight unit and converts it to the target weight unit `$to_unit`.

```php
wc_get_weight( $weight, $to_unit, $from_unit = '' )
```

使用例：

```php
wc_get_weight( 55, 'kg' );
wc_get_weight( 55, 'kg', 'lbs' );
```

### wc_clean

Clean variables using `sanitize_text_field`. Arrays are cleaned recursively. Non-scalar values are ignored.

```php
wc_clean( $var )
```

### wc_price

渡された価格を、正しい小数点以下の桁数と通貨記号で整形する。

```php
wc_price( $price, $args = array() )
```

The ` $args` array has an option called ` ex_tax_label` - if true then an `excluding tax` message will be appended.

## Order Functions

### wc_get_orders

この関数は、特定のパラメータに基づいて注文を検索する標準的な方法である。この関数は、注文の検索に使用されるべきもので、カスタムテーブルに移行した際にも関数が機能するようにします。

```php
wc_get_orders( $args )
```

[Arguments and usage](https://github.com/woocommerce/woocommerce/wiki/wc_get_orders-and-WC_Order_Query)

### wc_get_order

This is the main function for returning orders, uses the `WC_Order_Factory` class.

```php
wc_get_order( $the_order = false )
```

The `the_order` parameter can be a post object or post ID of the order.

### wc_orders_count

特定の注文ステータスの注文数を返します。

```php
wc_orders_count( $status, string $type = '' )
```

### wc_order_search

Searches orders based on the given `$term`.

```php
wc_order_search( $term )
```

## Page Functions

### wc_get_page_id

WooCommerceページIDを名前（例：thankyou）で取得します。

```php
wc_get_page_id( $page )
```

### wc_get_endpoint_url

Gets the URL for an `$endpoint`, which varies depending on permalink settings.

```php
wc_get_endpoint_url( $endpoint, $value = '', $permalink = '' )
```

## Product Functions

### wc_get_products

この関数は、特定のパラメータに基づいて製品を検索する標準的な方法です。

```php
wc_get_products( $args )
```

[Arguments and usage](https://github.com/woocommerce/woocommerce/wiki/wc_get_products-and-WC_Product_Query)

### wc_get_product

This is the main function for returning products. It uses the `WC_Product_Factory` class.

```php
wc_get_product( $the_product = false )
```

The argument `$the_product` can be a post object or post ID of the product.

### wc_get_product_ids_on_sale

セール中の商品の ID を含む配列を返します。

```php
wc_get_product_ids_on_sale()
```

### wc_get_featured_product_ids

注目商品の ID を含む配列を返します。

```php
wc_get_featured_product_ids()
```

### wc_get_related_products

商品のカテゴリーとタグに基づいて、商品の関連商品を取得します。

```php
wc_get_related_products( $product_id, $limit = 5, $exclude_ids = array() )
```

## Account Functions

### wc_get_account_endpoint_url

アカウントのエンドポイント URL を取得します。

```php
wc_get_account_endpoint_url( $endpoint )
```

## Attribute Functions

### wc_get_attribute_taxonomies

商品属性のタクソノミーを取得します。

```php
wc_get_attribute_taxonomies()
```

### wc_attribute_taxonomy_name

指定された商品属性のタクソノミー名を取得します。

```php
wc_attribute_taxonomy_name( $attribute_name )
```

### wc_attribute_taxonomy_id_by_name

商品属性IDを名前で取得します。

```php
wc_attribute_taxonomy_id_by_name( $name )
```

## REST Functions

### wc_rest_prepare_date_response

ISO8601/RFC3339 用に日付を解析し、フォーマットします。

```php
wc_rest_prepare_date_response( $date, $utc = true )
```

Pass `$utc` as `false` to get local/offset time.

### wc_rest_upload_image_from_url

指定したURLから画像をアップロードします。

```php
wc_rest_upload_image_from_url( $image_url )
```

### wc_rest_urlencode_rfc3986

Encodes a `$value` according to RFC 3986.

```php
wc_rest_urlencode_rfc3986( $value )
```

### wc_rest_check_post_permissions

REST API で投稿のパーミッションをチェックする。

```php
wc_rest_check_post_permissions( $post_type, $context = 'read', $object_id = 0 )
```

The available values for `$context` which is the request context are `read`, `create`, `edit`, `delete` and `batch`.
