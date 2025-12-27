---
sidebar_label: Order Querying
---
# `wc_get_orders()`と順序クエリ

`wc_get_orders()`と`WC_Order_Query`は、WordPressの[`get_posts()`と`WP_Query`](https://codex.wordpress.org/Class_Reference/WP_Query)と同様に、データベースから注文を取得する標準的な方法を提供します。

プラグインやテーマの開発者は、WordPressやWooCommerceのデータベースが変更されると破損する可能性があるため、WordPressのカスタムクエリや直接SQLを書くことをお勧めしません。これらのAPIは、WooCommerceで注文を取得するためのベストプラクティスと将来を保証する方法を提供します。

## 基本的な使い方

### 例

いくつか例を挙げよう：

```php
// Get orders from people named John paid in 2016.
$orders = wc_get_orders(
    array(
        'billing_first_name' => 'John',
        'date_paid'          => '2016-01-01...2016-12-31',
    )
);
```

```php
// Get 10 most recent order IDs.
$query = new WC_Order_Query(
    array(
        'limit'   => 10,
        'orderby' => 'date',
        'order'   => 'DESC',
        'return'  => 'ids',
    )
);
$orders = $query->get_orders();
```

```php
// Get orders from the customer with email 'woocommerce@woocommerce.com'.
$query = new WC_Order_Query();
$query->set( 'customer', 'woocommerce@woocommerce.com' );
$orders = $query->get_orders();
```

`wc_get_orders()`は`WC_Order_Query::get_orders()`へのショートカットである。

### ベストプラクティス

- 直接的なベースクエリは避け、代わりに`wc_get_orders()`に頼ること。
- あなたのコードがレガシーセットアップをサポートする必要がある場合、HPOSを有効にしたり無効にしたりして徹底的にテストしてください。
- 特定のパラメータを使用して結果を制限し、パフォーマンスを向上させる。
- `limit`と`offset`を使用して、大きな結果セットのページ分割を考慮する。
- 必要に応じて結果をキャッシュする。
- 複雑なフィルタリングが必要な場合は、HPOSを実行しているサイトで8.2から利用できるようになった新しいクエリ引数`meta_query`、`field_query`、`date_query`を活用してください。

## APIリファレンス

| 方法 | 説明 |
|-------------------------------------------|------------------------------------------|
| `wc_get_orders ( $args )`｜クエリ`$args`に一致する注文を取得します。|
| クエリオブジェクトに現在設定されているクエリ変数の配列を取得します。         |
| `WC_Order_Query::get( string $key, mixed $default = '' )`｜クエリ変数の値、またはクエリ変数が設定されていない場合はデフォルト値を取得します。            |
| `WC_Order_Query::set( string $key, mixed $value )` | クエリ変数を設定します。                     |
| `WC_Order_Query::get_orders()` | 現在のクエリ変数にマッチする全てのオーダーを取得します。  |

これらの関数で使用できるクエリ・パラメータ／引数を以下に示す。

## クエリパラメータの参照

### 一般

|パラメータ|ディスクリプション
|-|-|
|**status**|文字列の配列を受け取る: デフォルトでは`wc_get_order_statuses()`.|のキーに設定される。
|**type**|文字列を受け取ります：`'shop_order'`、`'shop_order_refund'`、またはカスタムオーダータイプ。
|**version**|文字列を指定します：注文が作成されたWooCommerceのバージョン番号。
|**created_via**|文字列: 'checkout'、'rest-api'、またはカスタム作成メソッドスラッグを受け入れます。
|**parent**|Accept an integer: 親となる注文の投稿ID。
|**parent_exclude**| 整数の配列を受け取ります：親IDが配列に含まれる注文を除外します。
|**exclude**|整数の配列を受け取る: そのIDを持つオーダーを除外する。
|**order**|文字列を指定: 'DESC'または'ASC'。orderby'と一緒に使う。デフォルト：'DESC'。
|**orderby**|文字列を指定します: 'none'、'ID'、'name'、'type'、'rand'、'date'、'modified'。デフォルト: 'date'.
|**return**|戻り値の型。文字列: 'ids'または'objects'。デフォルト：'objects'。

#### 例

```php
// Get most recently modified orders.
$args = array(
    'orderby' => 'modified',
    'order' => 'DESC',
);
$orders = wc_get_orders( $args );
```

```php
// Get some random orders.
$orders = wc_get_orders( array( 'orderby' => 'rand' ) );
```

```php
// Return only order ids.
$orders = wc_get_orders( array( 'return' => 'ids' ) );
```

```php
// Get orders processing and on-hold.
$args = array(
    'status' => array( 'wc-processing', 'wc-on-hold' ),
);
$orders = wc_get_orders( $args );
```

```php
// Get refunds in the last 24 hours.
$args = array(
    'type'         => 'shop_order_refund',
    'date_created' => '>' . ( time() - DAY_IN_SECONDS ),
);
$orders = wc_get_orders( $args );
```

```php
// Get orders created during WooCommerce 2.6.14 and through site checkout.
$args = array(
    'version'     => '2.6.14',
    'created_via' => 'checkout',
);
$orders = wc_get_orders( $args );
```

```php
// Get orders with post parent ID of 20 that aren't order 12.
$args = array(
    'parent'  => 20,
    'exclude' => array( 12 ),
);
$orders = wc_get_orders( $args );
```

### ページネーション

|パラメータ|ディスクリプション
|-|-|
|**limit**|整数を指定します：無制限の場合は `-1` となります。デフォルトはサイトの'posts_per_page'設定。
|**paged**|整数を指定します：取得する結果のページ。offset'が使われている場合は何もしない。
|**offset**|整数を指定します：結果をオフセットする量。
|**paginate**|ブール値を指定します：ページ分割を行う場合はtrueを、行わない場合はfalseを指定します（デフォルトはfalse）。有効にすると、フィールドを持つオブジェクトを返すように結果を変更します：`orders`(見つかった注文の配列)、`total`(見つかった注文の数)、`max_num_pages`(ページの総数)。

#### 例

```php
// Get latest 3 orders.
$orders = wc_get_orders( array( 'limit' => 3 ) );
```

```php
// First 3 orders.
$args = array(
    'limit' => 3,
    'paged' => 1,
);
$page_1_orders = wc_get_orders( $args );

// Second 3 orders.
$args = array(
    'limit' => 3,
    'paged' => 2,
);
$page_2_orders = wc_get_orders( $args );
```

```php
// Get orders with extra info about the results.
$results = wc_get_orders( array( 'paginate' => true ) );
echo $results->total . " orders found\n";
echo 'Page 1 of ' . $results->max_num_pages . "\n";
echo 'First order id is: ' . $results->orders[0]->get_id() . "\n";
```

### 支払いと金額

|パラメータ|ディスクリプション
|-|-|
通貨|**currency**|文字列を指定します：注文で使用する通貨。
|**prices_include_tax**|文字列: 'yes'または'no'を指定します。
|**支払い方法のスラッグ：使用される支払い方法のスラッグ。
|**payment_method_title**|文字列を指定します：使用される支払い方法の完全なタイトル。
|**discount_total**| 浮動小数点数で指定: 四捨五入されていない金額。
|**discount_tax**| 浮動小数点: 四捨五入されない金額を指定します。
|**shipping_total** |浮動小数点数で指定。
|**shipping_tax**| 浮動小数点: 四捨五入されない金額を指定します。
|**cart_tax**|浮動小数点(四捨五入なし)で指定。
|**合計(total)***|浮動小数点: 四捨五入されない金額を指定します。

#### 例

```php
// Get orders paid in USD.
$orders = wc_get_orders( array( 'currency' => 'USD' ) );
```

```php
// Get orders paid by check.
$orders = wc_get_orders( array( 'payment_method' => 'cheque' ) );
```

```php
// Get orders with 20.00 discount total.
$orders = wc_get_orders( array( 'discount_total' => 20.00 ) );
```

### お客様

|パラメータ|ディスクリプション
|-|-|
|**customer**|文字列または整数を指定します：注文の請求先メールアドレスまたは顧客ID。
|**customer_id**|整数を指定します：顧客ID。
|**customer_ip_address**|文字列を受け取ります：マッチする値。

#### 例

```php
// Get orders by customer with email 'woocommerce@woocommerce.com'.
$orders = wc_get_orders( array( 'customer' => 'woocommerce@woocommerce.com' ) );
```

```php
// Get orders by customer with ID 12.
$orders = wc_get_orders( array( 'customer_id' => 12 ) );
```

### 請求と発送

|パラメータ|ディスクリプション
|-|-|
|**姓｜***billing_first_name**｜文字列で指定。
姓|***名: 文字列で指定。
|**billing_company**| 文字列で指定します。
|**billing_address_1***| 文字列を指定します。
|**billing_address_2***| 文字列を指定します。
|**billing_city***| 文字列を指定します。
|**billing_state***| 文字列を指定します。
|**billing_postcode**| 文字列を指定します。
|**billing_country***| 文字列を指定します。
***billing_email**｜文字列を指定します。
|**billing_phone**| 文字列を指定します。
***shipping_first_name**｜文字列を指定します。
|**姓(名)**|文字列を指定します。
|**会社名**：文字列で指定。
|**発送先住所_1**｜文字列を指定します。
|**発送先住所2**：文字列で指定。
|**配送先市町村名**:文字列を指定します。
|**発送先郵便番号****｜*shipping_state***｜文字列を指定します。
|**配送先郵便番号**：文字列で指定。
|**配送先国名**｜*shipping_country**｜文字列で指定。

#### 例

```php
// Get orders from the US.
$orders = wc_get_orders( array( 'billing_country' => 'US' ) );
```

```php
// Get orders from people named Bill Evans.
$args = array(
    'billing_first_name' => 'Bill',
    'billing_last_name'  => 'Evans',
);
$orders = wc_get_orders( $args );
```

日付の引数は、以下に説明する標準的な書式に従って値を受け取るので、より柔軟なクエリが可能になる。

|パラメータ|ディスクリプション
|-|-|
|**date_created**注文の作成日にマッチします。標準形式の文字列を受け付けます。
|**date_modified**| 注文の変更日にマッチします。標準書式の文字列を指定します。
|**注文の完了日。標準書式の文字列を受け付けます。
|**date_paid**注文の支払日にマッチします。標準書式の文字列を受け付けます。

#### 標準フォーマット

- `YYYY-MM-DD` - サイトのタイムゾーンでその日の注文にマッチします。
- `>YYYY-MM-DD` - サイトのタイムゾーンでその日以降の注文にマッチします。
- `>=YYYY-MM-DD` - サイトのタイムゾーンでその日中またはその日以降の注文に一致します。
- `<YYYY-MM-DD` - サイトのタイムゾーンでその日以前の注文にマッチします。
- `<=YYYY-MM-DD` - サイトのタイムゾーンでその日中またはその前の注文に一致します。
- `YYYY-MM-DD...YYYY-MM-DD` - サイトのタイムゾーンでその日中またはその間の注文にマッチします。
- `TIMESTAMP` - UTC タイムゾーンでその 1 秒間の注文に一致します。
- `>TIMESTAMP` - UTCタイムゾーンでその1秒後の注文にマッチします。
- `>=TIMESTAMP` - UTCタイムゾーンのその1秒後以降の注文にマッチします。
- `<TIMESTAMP` - UTCタイムゾーンのその1秒より前の注文にマッチします。
- `<=TIMESTAMP` - UTC タイムゾーンでその 1 秒前までの注文にマッチします。
- `TIMESTAMP...TIMESTAMP` - UTCタイムゾーンの秒またはその間の注文にマッチします。

#### 例

```php
// Get orders paid February 12, 2016.
$orders = wc_get_orders( array( 'date_paid' => '2016-02-12' ) );
```

```php
// Get orders created before the last hour.
$args = array(
    'date_created' => '<' . ( time() - HOUR_IN_SECONDS ),
);
$orders = wc_get_orders( $args );
```

```php
// Get orders completed 16 May 2017 21:46:17 UTC to 17 May 2017 12:46:17 UTC.
$args = array(
    'date_completed' => '1494938777...1494971177',
);
$orders = wc_get_orders( $args );
```

### メタデータ

<!-- markdownlint-disable MD033 -->
|パラメータ|ディスクリプション
|-|-|
|**<br />。このパラメータは[WP_Queryの`meta_query`](https://developer.wordpress.org/reference/classes/wp_query/#custom-field-post-meta-parameters)に類似しており、様々な比較演算子やAND/OR関係で結合されたクエリのレベルをサポートします。
<!-- markdownlint-enable MD033 -->

詳細と例については、[HPOS order querying](/docs/features/high-performance-order-storage/wc-order-query-improvements#metadata-queries-meta_query) ガイドを参照してください。

`meta_query`のサポートはHPOSが注文データストレージとして設定されている場合のみ有効です。

使用する前に`OrderUtil::custom_orders_table_usage_is_enabled()`で有効になっているかチェックすること。
:::

#### 例

```php
// Orders with metadata 'custom_field' set to 'some_value' and metadata 'weight' higher than '50'.
$orders = wc_get_orders(
    array(
        'meta_query' => array(
            array(
                'key'     => 'custom_field',
                'value'   => 'some_value',
                'compare' => '='
            ),
            array(
                'key'     => 'weight',
                'value'   => '50',
                'compare' => '>='
            ),
            'relation' => 'AND'
        )
    )
);
```

### オーダーフィールド

<!-- markdownlint-disable MD033 -->
|パラメータ|ディスクリプション
|-|-|
|**<br />。このパラメータは前のセクションで説明した`meta_query`と類似しており、様々な比較演算子やAND/OR関係で結合されたクエリのレベルをサポートします。
<!-- markdownlint-enable MD033 -->

詳細と例については、[HPOS order querying](/docs/features/high-performance-order-storage/wc-order-query-improvements#order-field-queries-field_query) ガイドを参照してください。

`field_query`のサポートはHPOSが注文データストレージとして設定されている場合のみ有効です。

使用する前に`OrderUtil::custom_orders_table_usage_is_enabled()`で有効になっているかチェックすること。
:::

#### 例

```php
// Obtain orders with a total greater than 100 or from New York city.
$orders = wc_get_orders(
    array(
        'field_query' => array(
            array(
                'field' => 'total',
                'value' => 100,
                'compare' => '>'
            ),
            array(
                'field' => 'billing_city',
                'value' => 'New York',
                'compare' => '='
            ),
            'relation' => 'OR'
        )
    )
);
```

### 高度な日付クエリー

<!-- markdownlint-disable MD033 -->
|パラメータ|ディスクリプション
|-|-|
|**date_query**| キー `column` (注文日: `date_completed`, `date_created`, `date_updated` または `date_paid`, オプションで UTC 日付の場合は `_gmt` が続く)、 `value` およびオプションで `type` と `compare` を持つ 1 つ以上の配列。<br />このパラメータは[WP_Queryの`date_query`](https://developer.wordpress.org/reference/classes/wp_query/#date-parameters)に類似しており、様々な比較演算子とAND/OR関係で結合されたクエリのレベルをサポートします。
<!-- markdownlint-enable MD033 -->

詳細と例については、[HPOS order querying](/docs/features/high-performance-order-storage/wc-order-query-improvements#date-queries-date_query) ガイドを参照してください。

`date_query`のサポートはHPOSが注文データストレージとして設定されている場合のみ有効です。

使用する前に`OrderUtil::custom_orders_table_usage_is_enabled()`で有効になっているかチェックすること。
:::

#### 例

```php
// Example: Orders paid in the last month that were created before noon (on any date).

$orders = wc_get_orders(
    array(
        'date_query' => array(
            'relation' => 'AND',
            array(
                'column'  => 'date_created_gmt',
                'hour'    => 12,
                'compare' => '<'
            ),
            array(
                'column'  => 'date_paid_gmt',
                'after'   => '1 month ago',
            ),
        ),
    )
);
```

## カスタムパラメーターへの対応

開発者は、`wc_get_orders()`と`WC_Order_Query`の両方にカスタム・パラメータのサポートを追加するために生成されたクエリをフィルタリングすることによって、クエリ機能を拡張することができます。

WooCommerceは現在2つの注文保存メカニズムをサポートしています：HPOS(デフォルト)とレガシー(WordPressの投稿とメタデータを使用)です：

- (HPOS)`woocommerce_order_query_args`で既存のパラメータに変換し、`woocommerce_orders_table_query_clauses`で独自のSQLを書きます。
- (Legacy) `woocommerce_order_data_store_cpt_get_orders_query` でパラメータを`WP_Query`パラメータに変換します。

```php
/**
 * Example: Handle a custom 'customvar' query var to get orders with the 'customvar' meta.
 */
use Automattic\WooCommerce\Utilities\OrderUtil;

// HPOS version.
function handle_custom_query_var_hpos( $query_args ) {
    if ( ! empty( $query_args['customvar'] ) ) {
        if ( ! isset( $query_args['meta_query'] ) ) {
            $query_args['meta_query'] = array();
        }

		$query_args['meta_query'][] = array(
			'key'   => 'customvar',
			'value' => esc_attr( $query_args['customvar'] ),
		);

        unset( $query_args['customvar'] );
    }


    return $query_args;
}

// Legacy version.
function handle_custom_query_var_legacy( $query, $query_vars ) {
	if ( ! empty( $query_vars['customvar'] ) ) {
		$query['meta_query'][] = array(
			'key'   => 'customvar',
			'value' => esc_attr( $query_vars['customvar'] ),
		);
	}

	return $query;
}

if ( OrderUtil::custom_orders_table_usage_is_enabled() ) {
    // HPOS.
    add_filter(
        'woocommerce_order_query_args',
        'handle_custom_query_var_hpos'
    );
} else {
    // Legacy support.
    add_filter(
        'woocommerce_order_data_store_cpt_get_orders_query',
        'handle_custom_query_var_legacy',
        10,
        2
    );
}
```

```php
$orders = wc_get_orders( array( 'customvar' => 'somevalue' ) );
```
