---
post_title: Useful core functions
---

# Useful core functions

WooCommerceのコア関数はフロントエンドと管理画面の両方で利用できます。これらは`includes/wc-core-functions.php`にあり、プラグインのテーマで使用することができます。

## 条件付き関数

WooCommerceの条件付き関数は、現在のクエリ/ページを決定するのに役立ちます。

### is_woocommerce

WooCommerceテンプレートを使用するページの場合、trueを返します（カートとチェックアウトはショートコード付きの標準ページなので、含まれません）。

```php
is_woocommerce()
```

### ショップ

商品タイプアーカイブ(ショップ)を表示するときにtrueを返します。

```php
is_shop()
```

### is_product

単一の製品を表示するときにtrueを返す。

```php
is_product()
```

## クーポン機能

### wc_get_coupon_code_by_id

クーポンIDでクーポンコードを取得

```php
wc_get_coupon_code_by_id( $id )
```

引数`$id`はクーポンIDである。

### wc_get_coupon_id_by_code

コードでクーポンIDを取得します。

```php
wc_get_coupon_id_by_code( $code, $exclude = 0 )
```

`$code`はクーポンコード、`$exclude`は存在チェックの場合、チェックからIDを除外する。

## ユーザー機能

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

`$user_id`は顧客のユーザーIDである。

### wc_get_customer_order_count

顧客の合計注文数を取得します。

```php
wc_get_customer_order_count( $user_id )
```

`$user_id`は顧客のユーザーIDである。

## 書式設定関数

### wc_get_dimension

WooCommerceの寸法単位で測定された`$dimension`を取得し、ターゲット単位`$to_unit`に変換します。

```php
wc_get_dimension( $dimension, $to_unit, $from_unit = '' )
```

使用例：

```php
wc_get_dimension( 55, 'in' );
wc_get_dimension( 55, 'in', 'm' );
```

### wc_get_weight

WooCommerceの重量単位で計量された重量`$weight`を受け取り、対象の重量単位`$to_unit`に変換します。

```php
wc_get_weight( $weight, $to_unit, $from_unit = '' )
```

使用例：

```php
wc_get_weight( 55, 'kg' );
wc_get_weight( 55, 'kg', 'lbs' );
```

### wc_clean

`sanitize_text_field` を使って変数をクリーンアップする。配列は再帰的にクリーンアップされる。スカラー以外の値は無視される。

```php
wc_clean( $var )
```

### wc_price

渡された価格を、正しい小数点以下の桁数と通貨記号で整形する。

```php
wc_price( $price, $args = array() )
```

` $args`配列には` ex_tax_label`というオプションがあり、もしtrueなら`excluding tax`メッセージが追加される。

## オーダー関数

### wc_get_orders

この関数は、特定のパラメータに基づいて注文を検索する標準的な方法である。この関数は、注文の検索に使用されるべきもので、カスタムテーブルに移行した際にも、関数は機能します。

```php
wc_get_orders( $args )
```

[引数と使い方](https://github.com/woocommerce/woocommerce/wiki/wc_get_orders-and-WC_Order_Query)

### wc_get_order

`WC_Order_Factory`クラスを使用します。

```php
wc_get_order( $the_order = false )
```

`the_order`パラメータには、ポストオブジェクトまたはオーダーのポストIDを指定します。

### wc_orders_count

特定の注文ステータスの注文数を返します。

```php
wc_orders_count( $status, string $type = '' )
```

### wc_order_search

与えられた`$term`に基づいて注文を検索します。

```php
wc_order_search( $term )
```

## ページ機能

### wc_get_page_id

WooCommerceページIDを名前（例：thankyou）で取得します。

```php
wc_get_page_id( $page )
```

### wc_get_endpoint_url

パーマリンクの設定によって異なる`$endpoint`のURLを取得する。

```php
wc_get_endpoint_url( $endpoint, $value = '', $permalink = '' )
```

## 製品機能

### wc_get_products

この関数は、特定のパラメーターに基づいて商品を検索する標準的な方法である。

```php
wc_get_products( $args )
```

[引数と使い方](https://github.com/woocommerce/woocommerce/wiki/wc_get_products-and-WC_Product_Query)

### wc_get_product

これは商品を返すためのメイン関数です。`WC_Product_Factory`クラスを使用しています。

```php
wc_get_product( $the_product = false )
```

引数`$the_product`には、商品のポストオブジェクトまたはポストIDを指定します。

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

## アカウント機能

### wc_get_account_endpoint_url

アカウントのエンドポイント URL を取得します。

```php
wc_get_account_endpoint_url( $endpoint )
```

## 属性関数

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

## REST 関数

### wc_rest_prepare_date_response

ISO8601/RFC3339 用に日付を解析し、フォーマットします。

```php
wc_rest_prepare_date_response( $date, $utc = true )
```

ローカル/オフセット時刻を取得するには、`$utc`を`false`として渡す。

### wc_rest_upload_image_from_url

指定したURLから画像をアップロードします。

```php
wc_rest_upload_image_from_url( $image_url )
```

### wc_rest_urlencode_rfc3986

RFC 3986に従って `$value` をエンコードする。

```php
wc_rest_urlencode_rfc3986( $value )
```

### wc_rest_check_post_permissions

REST API で投稿のパーミッションをチェックする。

```php
wc_rest_check_post_permissions( $post_type, $context = 'read', $object_id = 0 )
```

リクエストコンテキストである `$context` で使用可能な値は、 `read`、 `create`、 `edit`、 `delete`、 `batch`である。
