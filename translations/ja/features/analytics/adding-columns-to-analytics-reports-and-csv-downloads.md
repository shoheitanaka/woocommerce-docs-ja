---
post_title: How to add columns to analytics reports and CSV downloads
sidebar_label: Add columns to analytics reports
sidebar_position: 2
---

# How to add columns to analytics reports and CSV downloads

アナリティクスレポートにカラムを追加することは、WooCommerceに機能を追加する本当に面白い方法です。CSVを生成することで、ユーザーインターフェイスのテーブルビューや、ユーザーのお気に入りのスプレッドシートやサードパーティアプリケーションで新しいデータを消費することができます。

この説明はWooCommerce用のテストプラグインがインストールされ、有効化されていることを前提としています。extending-woocommerce-admin-reports.md）の["Getting started" instructions]に従ってテストプラグインをセットアップすることができます。この投稿には、高度な方法でデータを取得するために実行されるクエリをさらに修正する手順も含まれています - 単純なカラムを追加する必要はありません。

WooCommerceでは、アナリティクスのCSVは2つの異なる方法で生成されます：すでにダウンロードされたデータを使用してウェブブラウザで、または新しいクエリを使用してサーバー上で。もし結果が1ページ分以上ある場合、データをサーバー上に生成し、リンクをユーザーにメールします。もし結果が1ページに収まる場合、データはブラウザ上に生成され、すぐにダウンロードされます。

ブラウザに送られるデータもここで生成されるからだ。

この例では、ダウンロード分析レポートを拡張します。このレポートのデータを取得するには、ダウンロード期限付きのダウンロード可能な商品を作成し、その商品を購入する注文を作成し、その商品を数回ダウンロードします。テストでは、26回のダウンロードを作成しました。これは、1ページに25件の商品を表示する場合はレポートが2ページにまたがって表示され、1ページに50件の商品を表示する場合は1ページに表示されるのに十分な数です。これにより、サーバーとブラウザーの両方で生成されたCSVをテストすることができました。

プラグインのPHPに、3つのフィルター・ハンドラを追加する：

```php
// This adds the SELECT fragment to the report SQL
function add_access_expires_select( $report_columns, $context, $table_name ) {
	if ( $context !== 'downloads' ) {
		return $report_columns;
	}
	$report_columns['access_expires'] =
		'product_permissions.access_expires AS access_expires';
	return $report_columns;
}
add_filter( 'woocommerce_admin_report_columns', 'add_access_expires_select', 10, 3 );

// This adds the column header to the CSV
function add_column_header( $export_columns ) {
	$export_columns['access_expires'] = 'Access expires';
	return $export_columns;
}
add_filter( 'woocommerce_filter_downloads_export_columns', 'add_column_header' );

// This maps the queried item to the export item
function map_access_expires( $export_item, $item ) {
	$export_item['access_expires'] = $item['access_expires'];
	return $export_item;
}
add_filter( 'woocommerce_report_downloads_prepare_export_item', 'map_access_expires', 10, 2 );
```

これにより、ダウンロードテーブル/CSVにアクセス期限タイムスタンプが追加されます（サーバーでCSVが生成される場合）。

これら3つのフィルタを合わせて、データベースクエリに新しいカラムを追加し、CSVに新しいヘッダを追加し、データベースから返されたデータをCSVにマッピングします。最初のフィルタ `woocommerce_admin_report_columns` は、データクエリ用に生成された `SELECT` 文に SQL フラグメントを追加します。2番目のフィルター `woocommerce_filter_downloads_export_columns` は、サーバー上で生成されるCSVにカラムヘッダーを追加します。3番目のフィルタ `woocommerce_report_downloads_prepare_export_item` は、データベース・クエリ `$item` から返されたデータの値をCSVのエクスポート項目にマッピングします。

ブラウザで生成されたカラムのサポートを追加することでこれを終わらせるために、プラグインのJavaScriptに別のフィルタを追加する必要があります：

```js
import { addFilter } from "@wordpress/hooks";
function addAccessExpiresToDownloadsReport(reportTableData) {
  const { endpoint, items } = reportTableData;
  if ("downloads" !== endpoint) {
    return reportTableData;
  }

  reportTableData.headers = [
    ...reportTableData.headers,
    {
      label: "Access expires",
      key: "access_expires",
    },
  ];
  reportTableData.rows = reportTableData.rows.map((row, index) => {
    const item = items.data[index];
    const newRow = [
      ...row,
      {
        display: item.access_expires,
        value: item.access_expires,
      },
    ];
    return newRow;
  });

  return reportTableData;
}
addFilter(
  "woocommerce_admin_report_table",
  "dev-blog-example",
  addAccessExpiresToDownloadsReport
);
```

このフィルターはまずCSVにヘッダーを追加し、次にデータをマッピングする。

作成したプラグインで、アナリティクステーブル、サーバー上で生成されたCSV、ブラウザ上で生成されたCSVにデータを追加できるはずです。
