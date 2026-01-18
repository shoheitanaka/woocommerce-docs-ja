---
sidebar_label: Query State Store
---

# Query State Store (`wc/store/query-state`) 

## 概要

クエリステートストアは、個々のブロックなどの特定のコンテキスト内でクエリ関連データを処理・操作するためのアクションを提供します。これにより、クエリ状態の値の動的な更新と取得が容易になり、WooCommerce Blocks 内での正確でコンテキストに特化したデータ管理が保証されます。

このストアを利用するには、これを参照するすべてのモジュールに `QUERY_STATE_STORE_KEY` をインポートする必要があります。`@woocommerce/block-data` が `wc.wcBlocksData` を指す外部参照として登録されている場合、以下のコマンドでキーをインポートできます。:

```js
const { QUERY_STATE_STORE_KEY } = window.wc.wcBlocksData;
```

> ⚠️ 新しい値は、ストア内の既存のエントリーを常に上書きする。

### setQueryValue( context, queryKey, value )

これは、指定されたコンテキストの単一のクエリー状態値を設定します。

#### _Parameters_ 

- _context_ `string`: 保存されるクエリ状態のコンテキスト。例: ブロック名。これにより、ブロックごとにクエリ状態を固有に保つことができます。
- _queryKey_ `string`: 保存される値への参照。
- _value_ `mixed`: クエリ状態として保存される実際の値。

### setValueForQueryContext( context ,value )

これは、与えられたコンテキストのクエリー状態を設定します。通常、これは `setQueryValue` を使用してコンテキストの個々のキーを設定/置換するのではなく、与えられたコンテキストのクエリ状態全体を設定/置換するために使用されます。

#### _Parameters_ 

- _context_ `string`: 保存されるクエリ状態のコンテキスト。例: ブロック名。これにより、ブロックごとにクエリ状態を固有に保つことができます。
- _value_ `object`: コンテキストにアタッチされるクエリ状態のキー/値ペアのオブジェクト。

