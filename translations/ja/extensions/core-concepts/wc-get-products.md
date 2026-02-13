---
post_title: wc_get_products and product queries
sidebar_label: Product Querying
---
# `wc_get_products` と商品クエリー

`wc_get_products`と`WC_Product_Query`は、安全に使用でき、将来のWooCommerceバージョンでデータベースが変更されても壊れない、標準的な商品検索方法を提供します。カスタムのWP_Queriesやデータベースクエリを作成することは、将来のWooCommerceバージョンでコードが壊れる可能性があります。これはプラグインやテーマの開発者が複数の商品を取得するためのベストプラクティスの方法です。`wc_get_products`と`WC_Product_Query`はWordPressの[`get_posts`と`WP_Query`](https://developer.wordpress.org/reference/classes/wp_query/)に似ています。これらと同様に、検索条件を定義する引数の配列を渡します。

## 基本的な使い方

### 例

いくつか例を挙げよう：

```php
// Get downloadable products created in the year 2016.
$products = wc_get_products( array(
    'downloadable' => true,
    'date_created' => '2016-01-01...2016-12-31',
) );
```

```php
// Get 10 most recent product IDs in date descending order.
$query = new WC_Product_Query( array(
    'limit' => 10,
    'orderby' => 'date',
    'order' => 'DESC',
    'return' => 'ids',
) );
$products = $query->get_products();
```

```php
// Get products containing a specific SKU.
// Does partial matching, so this will get products with SKUs "PRDCT-1", "PRDCT-2", etc.
$query = new WC_Product_Query();
$query->set( 'sku', 'PRDCT' );
$products = $query->get_products();
```

`wc_get_products()`は`WC_Product_Query::get_products()`へのショートカットである。

## APIリファレンス

| メソッド
| ------ | ----------- |
| `wc_get_products( $args )`｜クエリ`$args`にマッチする商品を取得します。|
| クエリオブジェクトに現在設定されているクエリ変数の配列を取得します。|
| クエリ変数が設定されていない場合、クエリ変数の値またはデフォルト値を取得します。|
| `WC_Product_Query::set( string $key, mixed $value )` | クエリ変数に値を設定します。|
| `WC_Product_Query::get_products()` | 現在のクエリ変数にマッチするすべての商品を取得します。|

これらの関数で使用できるクエリ・パラメータ／引数を以下に示す。

## クエリパラメータの参照

### 一般

[| パラメータ
| --------- | ----------- |
| `'draft'`, `'pending'`, `'private'`, `'publish'`, またはカスタムステータスの1つ以上を指定します。ProductStatus 定数クラス](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Enums/ProductStatus.php) を参照。|
| `'external'`, `'grouped'`, `'simple'`, `'variable'` あるいはカスタムタイプのいずれか1つ以上を指定します。[ProductType定数クラス](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Enums/ProductType.php)を参照。|
| **include** | 整数の配列を受け取ります。|
| **exclude** | 整数の配列を受け取ります: 配列にIDを持つ商品を除外します。|
| **parent** | 整数で指定: 親となる商品のポスト ID。|
| **parent_exclude** | 整数の配列を受け取ります: 親のIDが配列にある商品を除外します。|
| **order** | 文字列を指定します：`'DESC'`または`'ASC'`を指定します。`'orderby'`と一緒に使います。デフォルト：`'DESC'`。|
| orderby** | 文字列を受け取ります：文字列: `'none'`, `'ID'`, `'name'`, `'type'`, `'rand'`, `'date'`, `'modified'` を受け付ける。デフォルト：`'date'`。|
| return**｜ 戻り値の型。文字列を受け付ける：`'ids'`または`'objects'`。デフォルト：`'objects'`。|

#### 例

```php
// Get draft products.
$products = wc_get_products( array( 'status' => 'draft' ) );
```

```php
// Using constant class for status.
$products = wc_get_products( array( 'status' => \Automattic\WooCommerce\Enums\ProductStatus::DRAFT ) );
```

```php
// Get external products.
$products = wc_get_products( array( 'type' => 'external' ) );
```

```php
// Get external products limited to specific IDs.
$args = array(
    'type' => 'external',
    'include' => array( 134, 200, 210, 340 ),
);
$products = wc_get_products( $args );
```

```php
// Get products that aren't the current product.
$products = wc_get_products( array( 'exclude' => array( $product->get_id() ) ) );
```

```php
// Get products with a specific parent.
$products = wc_get_products( array( 'parent' => 20 ) );
```

```php
// Get most recently modified products.
$args = array(
    'orderby' => 'modified',
    'order' => 'DESC',
);
$products = wc_get_products( $args );
```

```php
// Get some random products.
$products = wc_get_products( array( 'orderby' => 'rand' ) );
```

```php
// Return only product IDs.
$products = wc_get_products( array( 'return' => 'ids' ) );
```

### ページネーション

| パラメータ
| --------- | ----------- |
| **limit** | 整数を指定します: 検索結果の最大数、または無制限の場合は `-1` を指定します。デフォルト：サイト `posts_per_page` 設定。|
| **page** | 整数値: 結果を取得するページ。`'offset'`が使われている場合は何もしません。|
| **offset** | 整数で指定: 結果をオフセットする量。|
| **paginate** | booleanを指定します: ページ分割を行う場合はtrue、行わない場合はfalseを指定します。デフォルト：inline_code_3__。有効にすると、フィールドを持つオブジェクトを返すように結果を変更します：`products` (見つかった商品の配列)、 `total` (見つかった商品の数)、 `max_num_pages` (総ページ数)。|

#### 例

```php
// Get latest 3 products.
$products = wc_get_products( array( 'limit' => 3 ) );
```

```php
// First 3 products.
$args = array(
    'limit' => 3,
    'page'  => 1,
);
$page_1_products = wc_get_products( $args );

// Second 3 products.
$args = array(
    'limit' => 3,
    'page'  => 2,
);
$page_2_products = wc_get_products( $args );
```

```php
// Get products with extra info about the results.
$results = wc_get_products( array( 'paginate' => true ) );
echo $results->total . " products found\n";
echo 'Page 1 of ' . $results->max_num_pages . "\n";
if ( count( $results->products ) > 0 ) {
    echo 'First product id is: ' . $results->products[0]->get_id() . "\n";
}
```

```php
// Get second to fifth most-recent products.
$args = array(
    'limit' => 4,
    'offset' => 1,
);
$products = wc_get_products( $args );
```

### 製品検索

| パラメータ
| --------- | ----------- |
| **sku** | マッチする商品のSKUを文字列で指定します。SKUの部分一致を行います。|
| **name** | マッチする商品名（タイトル）を文字列で指定します。大文字と小文字の区別はWordPressの投稿テーブルの照合順序に依存します。|
| タグ: スラッグによって特定のタグに割り当てられた商品に結果を限定します。|
| **product_tag_id** | 整数または整数の配列を受け付けます。|
| **category** | 配列を受け付けます: スラッグによって特定のカテゴリーに割り当てられた製品に結果を制限します。|
| **product_category_id** | 整数または整数の配列を受け入れます: IDによって特定のカテゴリーに割り当てられた製品に結果を制限します。|

#### 例

```php
// Get products with "PRDCT" in their SKU (e.g. PRDCT-1 and PRDCT-2).
$products = wc_get_products( array( 'sku' => 'PRDCT' ) );
```

```php
// Get a product named "Test Product".
$products = wc_get_products( array( 'name' => 'Test Product' ) );
```

```php
// Get products with the "Excellent" or "Modern" tags.
$products = wc_get_products( array( 'tag' => array( 'excellent', 'modern' ) ) );
```

```php
// Get products by tag IDs.
$products = wc_get_products( array( 'product_tag_id' => array( 17, 23 ) ) );
```

```php
// Get shirts.
$products = wc_get_products( array( 'category' => array( 'shirts' ) ) );
```

```php
// Get products by category IDs.
$products = wc_get_products( array( 'product_category_id' => array( 17, 23 ) ) );
```

### 寸法と価格

| パラメータ
| --------- | ----------- |
| **weight** | 浮動小数点: マッチする重さを指定します。|
| **length** | floatを受け付けます。|
| **width** | floatを受け付けます。|
| **height** | floatを受け付けます。|
| **price** | floatを受け取ります。|
| **regular_price** | floatを受け取ります: マッチする通常価格。|
| **sale_price** | 浮動小数点: 一致するセール価格。|
| **total_sales** | 整数を受け取ります。|

#### 例

```php
// Get products 5.5 units wide and 10 units long.
$args = array(
    'width' => 5.5,
    'length' => 10,
);
$products = wc_get_products( $args );
```

```php
// Get products that currently cost 9.99.
$products = wc_get_products( array( 'price' => 9.99 ) );
```

```php
// Get products that have never been purchased.
$products = wc_get_products( array( 'total_sales' => 0 ) );
```

### 製品設定

[| パラメータ
| --------- | ----------- |
| 仮想製品に制限する。|
| ダウンロード可能な商品に制限をかけます。|
| **featured**｜ ブーリアンを受け付けます。|
| **sold_individually**｜ ブーリアンを受け付けます。|
| ブール値で指定：在庫管理が有効な商品に限定する。|
| **reviews_allowed** | booleanを受け付けます: レビューを許可する商品に限定します。|
| **backorders** | 文字列を指定します：`'yes'`、`'no'`、`'notify'`のいずれかを指定します。|
| 文字列： `wc_get_products` または `wc_get_products` または `WC_Product_Query`：`'visible'`、 `'catalog'`、 `'search'`、 `'hidden'`のいずれか。CatalogVisibility定数クラス](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Enums/CatalogVisibility.php)を参照してください。|
| **download_limit** | 整数を受け取ります: ダウンロードの上限、または無制限の場合は `-1` です。|
| **download_expiry** | ダウンロードの有効期限(日)を整数で指定するか、無制限の場合は `-1` を指定します。|

#### 例

```php
// Get downloadable products that don't allow reviews.
$args = array(
    'downloadable' => true,
    'reviews_allowed' => false,
);
$products = wc_get_products( $args );
```

```php
// Get products that allow backorders.
$products = wc_get_products( array( 'backorders' => 'yes' ) );
```

```php
// Get products that show in the catalog.
$products = wc_get_products( array( 'visibility' => 'catalog' ) );
```

```php
// Using constant class for visibility.
$products = wc_get_products( array( 'visibility' => \Automattic\WooCommerce\Enums\CatalogVisibility::CATALOG ) );
```

```php
// Get products with unlimited downloads.
$products = wc_get_products( array( 'download_limit' => -1 ) );
```

### 在庫と棚卸資産

[| パラメータ
| --------- | ----------- |
| 商品の在庫数を整数で指定します。|
| 文字列を指定します：`'outofstock'`、`'instock'`、または `'onbackorder'`。ProductStockStatus定数クラス](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Enums/ProductStockStatus.php)を参照してください。|

#### 例

```php
// Get products that only have one left in stock.
$products = wc_get_products( array( 'stock_quantity' => 1 ) );
```

```php
// Get out of stock products.
$products = wc_get_products( array( 'stock_status' => 'outofstock' ) );
```

```php
// Using constant class for stock status.
$products = wc_get_products( array( 'stock_status' => \Automattic\WooCommerce\Enums\ProductStockStatus::OUT_OF_STOCK ) );
```

### 税金と送料

[| パラメータ
| --------- | ----------- |
| 文字列を受け取ります：`'taxable'`、`'shipping'`、または `'none'`。ProductTaxStatus定数クラス](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Enums/ProductTaxStatus.php)を参照してください。|
| tax_class**｜文字列を受け入れます：タックスクラススラッグ。|
| **shipping_class** | 文字列または文字列の配列を受け入れます。|

#### 例

```php
// Get taxable products.
$products = wc_get_products( array( 'tax_status' => 'taxable' ) );
```

```php
// Using constant class for tax status.
$products = wc_get_products( array( 'tax_status' => \Automattic\WooCommerce\Enums\ProductTaxStatus::TAXABLE ) );
```

```php
// Get products in the "Reduced Rate" tax class.
$products = wc_get_products( array( 'tax_class' => 'reduced-rate' ) );
```

```php
// Get products in the "Bulky" shipping class.
$products = wc_get_products( array( 'shipping_class' => 'bulky' ) );
```

### レビュー＆評価

| パラメータ
| --------- | ----------- |
| **average_rating** | 浮動小数点数: 平均レーティング。|
| **review_count** | 整数で指定: レビューの数。|

#### 例

```php
// Get products with all 5-star ratings.
$products = wc_get_products( array( 'average_rating' => 5.0 ) );
```

```php
// Get products with 1 review.
$products = wc_get_products( array( 'review_count' => 1 ) );
```

### Date

日付の引数は、以下に説明する標準的な書式に従って値を受け取るので、より柔軟なクエリが可能になる。

| パラメータ
| --------- | ----------- |
| 商品の作成日にマッチします。標準形式の文字列を受け付けます。|
| **date_modified** | 製品の変更日にマッチします。標準書式の文字列を指定します。|
| 販売開始日にマッチします。標準書式の文字列を指定します。|
| 販売終了日。標準書式の文字列を指定します。|

#### 標準フォーマット

- `YYYY-MM-DD` - サイトのタイムゾーンでその日中の商品にマッチします。
- `>YYYY-MM-DD` - サイトのタイムゾーンでその日以降の商品にマッチします。
- `>=YYYY-MM-DD` - サイトのタイムゾーンでその日中またはその日以降の商品にマッチします。
- `<YYYY-MM-DD` - サイトのタイムゾーンでその日以前の商品にマッチします。
- `<=YYYY-MM-DD` - サイトのタイムゾーンでその日またはその前の商品にマッチします。
- `YYYY-MM-DD...YYYY-MM-DD` - サイトのタイムゾーンでその日またはその間の商品にマッチします。
- `TIMESTAMP` - UTCタイムゾーンでその1秒間の商品にマッチします。
- `>TIMESTAMP` - UTCタイムゾーンでその1秒後の商品にマッチします。
- `>=TIMESTAMP` - UTCタイムゾーンのその1秒後以降の商品にマッチします。
- `<TIMESTAMP` - UTCタイムゾーンのその1秒より前の商品にマッチします。
- `<=TIMESTAMP` - UTC タイムゾーンのその 1 秒前またはその 1 秒前の商品にマッチします。
- `TIMESTAMP...TIMESTAMP` - UTCタイムゾーンでその秒の間、またはその間の商品にマッチします。

#### 例

```php
// Get downloadable products created in the year 2016.
$products = wc_get_products( array(
    'downloadable' => true,
    'date_created' => '2016-01-01...2016-12-31',
) );
```

## カスタムパラメーターへの対応

`wc_get_products()`または`WC_Product_Query`のカスタム・パラメータのサポートを追加することは可能です。これを行うには、生成されるクエリをフィルタリングする必要があります。

```php
/**
 * Handle a custom 'customvar' query var to get products with the 'customvar' meta.
 * @param array $query - Args for WP_Query.
 * @param array $query_vars - Query vars from WC_Product_Query.
 * @return array modified $query
 */
function handle_custom_query_var( $query, $query_vars ) {
	if ( ! empty( $query_vars['customvar'] ) ) {
		if ( ! isset( $query['meta_query'] ) ) {
			$query['meta_query'] = array();
		}
		$query['meta_query'][] = array(
			'key'   => 'customvar',
			'value' => sanitize_text_field( $query_vars['customvar'] ),
		);
	}

	return $query;
}
add_filter( 'woocommerce_product_data_store_cpt_get_products_query', 'handle_custom_query_var', 10, 2 );
```

Usage:

```php
$products = wc_get_products( array( 'customvar' => 'somevalue' ) );
```
