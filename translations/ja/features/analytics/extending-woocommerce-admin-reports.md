---
post_title: How to extend WooCommerce analytics reports
sidebar_label: Extend analytics reports
sidebar_position: 1
---
# WooCommerceの分析レポートを拡張する方法

## はじめに

このドキュメントは、基本的なUIドロップダウン、追加されたクエリパラメータ、SQLクエリの変更、および結果のレポートデータを使用して、WC-Adminレポートを拡張するためのガイドです。この例では、特定の通貨に基づいて注文レポートを表示するための通貨セレクタを作成します。

## ♪ はじめに

`@woocommerce/create-woo-extension`を使用して、プラグイン用のモダンなWordPress JavaScript環境を構築します。このツールはWooCommerceと統合するための完全に機能的な開発環境を作成します。

この例では、`sql-modification`バリアントを使用して、基本的なレポート拡張を作成します。

`wp-content/plugins`ディレクトリで、以下のコマンドを実行して拡張機能を作成します：

```sh
npx @wordpress/create-block -t @woocommerce/create-woo-extension --variant=sql-modification my-extension-name
```

新しく作成したフォルダに移動し、開発を開始する：

```sh
cd my-extension-name
npm run start
```

WordPressのローカル環境では、`wp-env`を使用することもできます：

```sh
npm -g i @wordpress/env
wp-env start
```

`/wp-admin/plugins.php`にアクセスし、プラグインを有効化することをお忘れなく。

## テストデータの投入

次に、サンプルデータを持つためにいくつかの注文を設定します。WooCommerce > Settings > Currencyを使って、メキシコペソ、米ドル、ニュージーランドドルの3つのテスト注文を追加しました。

そうしたら、WC-Adminで`/wp-admin/admin.php?page=wc-admin&period=today&path=%2Fanalytics%2Forders&compare=previous_year`にアクセスして注文が表示されていることを確認してください。WooCommerceの設定で現在表示されている通貨はニュージーランドドルです。

![注文処理中のwp-adminのスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/screen-shot-2020-02-19-at-12.11.34-pm.png?w=851)

`wp_posts`テーブルで以下のクエリを実行し、`wp_postmeta`を結合して通貨メタ値を収集することで、各注文の通貨を確認できます。結果はNZD、USD、MXNでの注文を示しています。このクエリは、このガイドの後半で実装する、通貨値を収集して表示するクエリと似ています。

```sql
SELECT
    ID,
    post_name,
    post_type,
    currency_postmeta.meta_value AS currency
FROM `wp_posts`
JOIN wp_postmeta currency_postmeta ON wp_posts.ID = currency_postmeta.post_id
WHERE currency_postmeta.meta_key = '_order_currency'
ORDER BY wp_posts.post_date DESC
LIMIT 3
```

![クエリー結果のスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/screen-shot-2020-02-19-at-12.33.45-pm.png?w=756)

## UIドロップダウンを追加する

[異なる通貨でレポートを表示するには、フィルタまたはドロップダウンが必要です。Orders Report](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/admin/client/analytics/report/orders/config.js#L50-L62)のような構成オブジェクトを追加することで、基本的なフィルタをレポートに追加できます。

まず、ドロップダウンをレンダリングするためのデータをクライアントに入力する必要があります。これを行う最善の方法は、`wcSettings` グローバルにデータを追加することです。このグローバルは、静的な設定データを PHP からクライアントに転送するのに便利です。メインの PHP ファイルで、`window.wcSettings.multiCurrency` に通貨設定を追加します。

```php
function add_currency_settings() {
	$currencies = array(
		array(
			'label' => __( 'United States Dollar', 'dev-blog-example' ),
			'value' => 'USD',
		),
		array(
			'label' => __( 'New Zealand Dollar', 'dev-blog-example' ),
			'value' => 'NZD',
		),
		array(
			'label' => __( 'Mexican Peso', 'dev-blog-example' ),
			'value' => 'MXN',
		),
	);

	$data_registry = Automattic\WooCommerce\Blocks\Package::container()->get(
		Automattic\WooCommerce\Blocks\Assets\AssetDataRegistry::class
	);

	$data_registry->add( 'multiCurrency', $currencies );
}

add_action( 'init', 'add_currency_settings' );
```

コンソールでは、データが無事にクライアントに届いたことを確認できる。

![コンソールのスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/screen-shot-2020-02-19-at-1.11.50-pm.png?w=476)

`index.js`でカスタム通貨フィルターを作成し、注文レポートに追加します。

```js
import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";

const addCurrencyFilters = (filters) => {
  return [
    {
      label: __("Currency", "dev-blog-example"),
      staticParams: [],
      param: "currency",
      showFilters: () => true,
      defaultValue: "USD",
      filters: [...(wcSettings.multiCurrency || [])],
    },
    ...filters,
  ];
};

addFilter(
  "woocommerce_admin_orders_report_filters",
  "dev-blog-example",
  addCurrencyFilters
);
```

注文レポートをチェックアウトすると、新しいドロップダウンが表示されます。実際に操作してみると、通貨クエリパラメータがURLに追加されていることがわかります。Network]タブを確認すると、この値がレポートの入力に使用されるデータのリクエストに含まれていることもわかります。例えば、`/wp-json/wc-analytics/reports/orders/stats`という注文統計エンドポイントへのリクエストを見てください。次に、このクエリ・パラメータを使ってレポート結果を調整します。

![wp-adminのUIドロップダウンを示すスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/screen-shot-2020-02-19-at-1.16.44-pm.png?w=512)

## サーバー上で通貨パラメーターを処理する

`currency`クエリパラメータが追加されたので、まず最初にこのパラメータをOrders Data StoreとOrders Stats Data Storeにクエリ引数として追加します。これらのデータストアはキャッシュ目的でクエリ引数を使用するので、パラメータを追加することで、パラメータが変更されたときに新しいデータベースクエリが実行されるようになります。メイン PHP ファイルにクエリ引数を追加します。

```php
function apply_currency_arg( $args ) {
	$currency = 'USD';

	if ( isset( $_GET['currency'] ) ) {
		$currency = sanitize_text_field( wp_unslash( $_GET['currency'] ) );
	}

	$args['currency'] = $currency;

	return $args;
}

add_filter( 'woocommerce_analytics_orders_query_args', 'apply_currency_arg' );
add_filter( 'woocommerce_analytics_orders_stats_query_args', 'apply_currency_arg' );
```

これで、`currency`クエリーパラメーターの突然変異で新しいデータベースクエリーが実行されることが確認できたので、データを収集するクエリーにSQLステートメントを追加し始めることができる。

注文テーブル、注文統計、注文チャートのJOINを追加することから始めよう。

```php
function add_join_subquery( $clauses ) {
	global $wpdb;

	$clauses[] = "JOIN {$wpdb->postmeta} currency_postmeta ON {$wpdb->prefix}wc_order_stats.order_id = currency_postmeta.post_id";

	return $clauses;
}

add_filter( 'woocommerce_analytics_clauses_join_orders_subquery', 'add_join_subquery' );
add_filter( 'woocommerce_analytics_clauses_join_orders_stats_total', 'add_join_subquery' );
add_filter( 'woocommerce_analytics_clauses_join_orders_stats_interval', 'add_join_subquery' );
```

次に、WHERE句を追加する。

```php
function add_where_subquery( $clauses ) {
  global $wpdb;

	$currency = 'USD';

	if ( isset( $_GET['currency'] ) ) {
		$currency = sanitize_text_field( wp_unslash( $_GET['currency'] ) );
	}

  // Use $wpdb->prepare to safely escape the currency value for SQL.
  $prepared_clause = $wpdb->prepare(
      'AND currency_postmeta.meta_key = %s AND currency_postmeta.meta_value = %s',
      '_order_currency',
      $currency
  );
  
  $clauses[] = $prepared_clause;

	return $clauses;
}

add_filter( 'woocommerce_analytics_clauses_where_orders_subquery', 'add_where_subquery' );
add_filter( 'woocommerce_analytics_clauses_where_orders_stats_total', 'add_where_subquery' );
add_filter( 'woocommerce_analytics_clauses_where_orders_stats_interval', 'add_where_subquery' );
```

そして最後にSELECT句。

```php
function add_select_subquery( $clauses ) {
	$clauses[] = ', currency_postmeta.meta_value AS currency';

	return $clauses;
}

add_filter( 'woocommerce_analytics_clauses_select_orders_subquery', 'add_select_subquery' );
add_filter( 'woocommerce_analytics_clauses_select_orders_stats_total', 'add_select_subquery' );
add_filter( 'woocommerce_analytics_clauses_select_orders_stats_interval', 'add_select_subquery' );
```

注文レポートに戻り、うまくいくか確認してみよう。ドロップダウンを操作して、関連する注文が表に反映されるのを確認できます。

wp-adminのWooCommerce Ordersタブのスクリーンショット。

## 仕上げ

受注テーブルをカスタマイズして、選択した通貨を反映させることができます。`index.js` に通貨を表示するカラムを追加します。引数 `reportTableData` は、ヘッダー、行、アイテムのオブジェクトで、データの配列です。新しいヘッダーを追加し、各行のデータ配列に通貨を追加する必要があります。

```js
const addTableColumn = (reportTableData) => {
  if ("orders" !== reportTableData.endpoint) {
    return reportTableData;
  }

  const newHeaders = [
    {
      label: "Currency",
      key: "currency",
    },
    ...reportTableData.headers,
  ];
  const newRows = reportTableData.rows.map((row, index) => {
    const item = reportTableData.items.data[index];
    const newRow = [
      {
        display: item.currency,
        value: item.currency,
      },
      ...row,
    ];
    return newRow;
  });

  reportTableData.headers = newHeaders;
  reportTableData.rows = newRows;

  return reportTableData;
};

addFilter("woocommerce_admin_report_table", "dev-blog-example", addTableColumn);
```

![カスタマイズされたテーブルのスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/screen-shot-2020-02-19-at-4.02.15-pm.png?w=861)

カラムを追加することは確かに便利だが、表やグラフの通貨数値は店舗の通貨しか反映しない。

![レポートのスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/screen-shot-2020-02-19-at-4.03.42-pm.png?w=865)

レポートの通貨と数値の書式を変更するには、`woocommerce_admin_report_currency` JSフックを使用します。ストアのデフォルトは`wcSettings.currency`でクライアントに送信されますが、クエリパラメータ`?currency=NZD`で指定された表示通貨に応じて変更する必要があります。

![通貨設定のスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/screen-shot-2020-04-03-at-11.18.42-am.png?w=238)

まず、index.jsにいくつかの設定を作る。

```js
const currencies = {
  MXN: {
    code: "MXN",
    symbol: "$MXN", // For the sake of the example.
    symbolPosition: "left",
    thousandSeparator: ",",
    decimalSeparator: ".",
    precision: 2,
  },
  NZD: {
    code: "NZD",
    symbol: "$NZ",
    symbolPosition: "left",
    thousandSeparator: ",",
    decimalSeparator: ".",
    precision: 2,
  },
};
```

最後に、通貨クエリパラメータに基づいて設定を適用する関数をフックに追加します。

```js
const updateReportCurrencies = (config, { currency }) => {
  if (currency && currencies[currency]) {
    return currencies[currency];
  }
  return config;
};

addFilter(
  "woocommerce_admin_report_currency",
  "dev-blog-example",
  updateReportCurrencies
);
```

🎉 オーダーレポートが表示され、レポート全体を通して通貨が金額に反映されているのを確認できるようになりました。

![カスタマイズ注文レポートのスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/screen-shot-2020-04-03-at-11.29.05-am.png?w=912)

## 結論

このガイドでは、サーバーに送信されるクエリ・パラメータを操作するためのUI要素を追加し、それらの値を使用してレポート・データを収集するSQLステートメントを変更します。そうすることで、WC-Adminレポートを高度にカスタマイズする方法を確立しました。この例が、ユーザーにパワフルな体験をもたらすために、拡張機能によってどのようにプラットフォームをカスタマイズできるかを示してくれることを願っています。
