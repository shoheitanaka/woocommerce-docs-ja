---
sidebar_label: Query State Store
---
# クエリ・ステート・ストア (`wc/store/query-state`) 

## 概要

クエリステートストアは、個々のブロックなどの特定のコンテキスト内でクエリ関連データを処理・操作するためのアクションを提供します。これにより、クエリ状態の値の動的な更新と取得が容易になり、WooCommerce Blocks内での正確でコンテキストに特化したデータ管理が保証されます。

## Usage

このストアを利用するには、`QUERY_STATE_STORE_KEY`を参照するモジュールで`wc/store/query-state`をインポートします。`@woocommerce/block-data`が`wc.wcBlocksData`を指す外部として登録されていると仮定すると、`@woocommerce/block-data`を介してキーをインポートすることができます：

```js
const { QUERY_STATE_STORE_KEY } = window.wc.wcBlocksData;
```

## Actions

> ⚠️ 新しい値は、ストア内の既存のエントリーを常に上書きする。

### setQueryValue( context, queryKey, value )

これは、指定されたコンテキストの単一のクエリー状態値を設定します。

#### パラメーター 

-   コンテクスト `string`：保存されるクエリ状態のコンテキスト。ブロック名など、ブロックごとにクエリ状態を特定できるようにします。
-   queryKey`string`：格納される値の参照。
-   value`mixed`：クエリ・ステートに対して実際に格納される値。

### setValueForQueryContext( context ,value )

これは、与えられたコンテキストのクエリー状態を設定します。通常、これは`setQueryValue`を使用してコンテキストの個々のキーを設定/置換するのではなく、与えられたコンテキストのクエリ状態全体を設定/置換するために使用されます。

#### パラメーター 

-   コンテクスト `string`：保存されるクエリ状態のコンテキスト、例えばブロック名。
-   value_ `object`：コンテキストにアタッチされるクエリ状態のキーと値のペアのオブジェクト。
