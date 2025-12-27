---
post_title: HPOS order querying APIs
---
# HPOSオーダー照会API

HPOSの導入に伴い、WCのクエリー機能を強化しました。現在、よく知られている[既存のAPI](/docs/extensions/core-concepts/wc-get-orders)に加えて、注文やそのプロパティに関する複雑なクエリを簡単に作成できるように、カスタム注文のメタデータをクエリする機能など、いくつかの機能を追加しています。

新しいクエリタイプはすべて、`wc_get_orders()`に渡すことができる追加のクエリ引数として実装されており、WordPressの`WP_Query`にある同様の機能に大きくインスパイアされています。通常のクエリ引数として、他の引数と組み合わせることで、これまではカスタムコードやSQLを書く必要があった複雑なクエリを作成することができます。

## 新しいクエリータイプ

### メタデータクエリ (`meta_query`)

HPOSの導入により、以前はポスト・メタデータとして保存されていたオーダー・フィールドは、独自のテーブルに移動されましたが、残りのメタデータ（カスタムまたは他の拡張機能からのもの）は、`meta_query `引数を通してクエリできるようになりました。

その中核となる`meta_query`は配列で、キーを持つ1つ以上の配列を含むことができる：
`key`（メタ・キー名）、
`value` (メタ値)
`compare` (オプション) LIKE、RLIKE、NOT BETWEEN、BETWEENなどの比較に使用する演算子。
メタ値をクエリの特定のSQL型にキャストする`type`。

より複雑なクエリを生成するために、`relation`（'AND'または'OR'値を認める）を使用して異なる配列を組み合わせることもできます。この新しい引数の構文は、WP_Queryの`meta_query`と全く同じです。詳細については、[`meta_query` docs](https://developer.wordpress.org/reference/classes/wp_query/#custom-field-post-meta-parameters) を参照してください。

```php
// Example: obtain all orders which have metadata with the "color" key (any value) and have metadata
// with key "size" containing "small" (so it'd match "extra-small" as well as "small", for example).
$orders = wc_get_orders(
    array(
        'meta_query' => array(
            array(
                'key' => 'color',
            ),
            array(
                'key'        => 'size',
                'value'      => 'small',
                'compare'    => 'LIKE'
            ),
        ),
    )
);
```

### オーダーフィールドクエリー (`field_query`)

このクエリー・タイプは、メタ・クエリー（`meta_query`）に似た構文を持っていますが、`key`の代わりに、異なる節の中で`field`を使用します。ここで、`field`は、通常通りクエリ引数のトップレベル・キーとしてアクセス可能なオーダー・プロパティ（`billing_first_name`、`total`、`order_key`など）を指します。これらのプロパティを直接クエリするのと、`field_query`を使用するのとの違いは、比較演算子を実装し、組み合わせや入れ子を行うことで、より複雑なクエリを作成できることです。

```php
// Example. For a simple query, you'd be better off by using the order properties directly, even though there's a `field_query` equivalent.
$orders = wc_get_orders(
    array(
        'billing_first_name' => 'Lauren',
        'order_key'          => 'my_order_key',
    )
);

$orders = wc_get_orders(
    array(
        'field_query' => array(
            array(
                'field' => 'billing_first_name',
                'value' => 'Lauren'
            ),
            array(
                'field' => 'order_key',
                'value' => 'my_order_key',
            )
        )
    )
);
```

`field_query`の真の威力が発揮されるのは、これまで不可能だったような、より興味深いクエリーを実行したい場合だ...。

```php
// Example. Obtain all orders where either the total or shipping total is less than 5.0.

$orders = wc_get_orders(
    array(
        'field_query' => array(
            'relation' => 'OR',
            array(
                'field'   => 'total',
                'value'   => '5.0',
                'compare' => '<',
            ),
            array(
                'field'   => 'shipping_total',
                'value'   => '5.0',
                'compare' => '<',
            ),
        )
    )
);
```

### 日付クエリ (`date_query`)

日付クエリでは、関連する日付(`date_completed`, `date_created`, `date_updated`, `date_paid`)を様々な方法でクエリして注文を取得することができます。
`date_query`の構文は、`WP_Query`の`date_query`と完全に互換性があります。そのため、WP codexの[`meta_query`docs](https://developer.wordpress.org/reference/classes/wp_query/#date-parameters)が例と詳細の良い情報源となります。

```php
// Example. Obtain all orders paid in the last month that were created before noon (on any date).

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

## 高度な例

```php
// Obtain orders either "on-hold" or "pending" that have metadata `weight` >= 50 and metadata `color` or `size` is set.

$query_args = array(
    'status' => array( 'pending', 'on-hold' ),
    'meta_query' => array(
        array(
            'key'     => 'weight',
            'value'   => '50',
            'compare' => '>=',
        ),
        array(
            'relation' => 'OR',
            array(
                'key'     => 'color',
                'compare' => 'EXISTS',
            ),
            array(
                'key'     => 'size',
                'compare' => 'EXISTS',
            )
        ),
    )
);

$orders = wc_get_orders( $query_args );
```

```php
// Obtain orders where the first name in the billing details contains "laur" (so it'd both match "lauren" and "laura", for example), and where the order's total is less than 10.0 and the total discount is >= 5.0.

$orders = wc_get_orders(
    array(
        'field_query' => array(
            array(
                'field'   => 'billing_first_name',
                'value'   => 'laur',
                'compare' => 'LIKE',
            ),
            array(
                'relation' => 'AND',
                array(
                    'field'   => 'total',
                    'value'   => '10.0',
                    'compare' => '<',
                    'type'    => 'NUMERIC',
                ),
                array(
                    'field'   => 'discount_total',
                    'value'   => '5.0',
                    'compare' => '>=',
                    'type'    => 'NUMERIC',
                )
            )
        ),
    )
);
```
