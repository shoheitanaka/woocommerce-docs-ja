---
sidebar_label: Schema Store
---
# スキーマストア (`wc/store/schema`) 

## 概要

スキーマストアは WooCommerce ブロックに関連するルートを管理し、与えられた名前空間のルートデータの効率的な取得と更新を可能にします。このストアはリソースルートとのやりとりを効率化し、モジュールが必要に応じてエンドポイントパスに簡単にアクセスできるようにします。

このストアを利用するには、`SCHEMA_STORE_KEY`を参照するモジュールで__INLINE_CODE_0__をインポートします。`@woocommerce/block-data`が`wc.wcBlocksData`を指す外部として登録されていると仮定すると、__INLINE_CODE_2__を介してキーをインポートすることができます: 

```js
const { SCHEMA_STORE_KEY } = window.wc.wcBlocksData;
```

> ⚠️ これらのアクションは、リゾルバによって内部的に使用されることがほとんどなので、直接使用する必要はほとんどないはずです。

### receiveRoutes( routes, namespace)

提供されたリソースルートのリストでストアを更新するために使用されるアクションオブジェクトを返します。

#### _Parameters_ 

- _routes_ `array`: 指定された名前空間にアタッチされたルートの配列。例: `[ '/wc/blocks/products', '/wc/blocks/products/attributes/(?P<id>[\d]+)' ]`。
- _namespace_ `string`: ルートが属する名前空間。例: `/wc/blocks`。

#### _Returns_

- `object`: 以下のキーを持つリソースルートのリストでストアを更新するために使用するアクションオブジェクト。
    - _type_ `string`: アクションタイプ。
    - _routes_ `object`: ルート名をキーとするルートオブジェクト。
    - _namespace_ `string`: ルートが属する名前空間（例: `/wc/blocks`）。

## セレクタ

### getRoute( state, namespace, resourceName, ids = [] )

これは、指定された名前空間、リソース名、および (必要であれば) ID のルートを取得するために使用されます。

#### _Parameters_ 

- _state_ `object`: 元の状態。
- _namespace_ `string`: ルートの名前空間（例: `/wc/blocks`）
- _resourceName_ `string`: リクエストされるリソース（例: `products/attributes/terms`）
- _ids_ `array`: ルートにIDのプレースホルダーがある場合にのみ必要です。

#### _Returns_

-   `string`: 利用可能であればルート。

#### _例_ 

もし、`wc/blocks`名前空間上の単一製品のルートを探しているのであれば、`[ 20 ]`をidとして持つことになります: 

```js
// '/wc/blocks/products/20'
wp.data.select( SCHEMA_STORE_KEY ).getRoute( '/wc/blocks', 'products', [ 20 ] );
```

### getRoutes( state, namespace )

これは指定された名前空間に登録されたすべてのルートをフラット配列として返します。

#### _Parameters_ 

- _state_ `object`: 現在の状態。
- namespace `string`: ルートを返す名前空間。

#### _Returns_

-   `array`: 与えられた名前空間のすべてのルートの配列。

### getRouteFromResourceEntries

これは、ルート状態の指定されたスライスからルートを返します。

#### _Parameters_ 

-   _stateSlice_ `object`:与えられた名前空間とリソース名のルート状態のスライス。
-   _ids_ `array` (default: `[]`): ルートプレースホルダーで置き換える id 参照の配列。

#### _Returns_

-   `string`: 指定されたリソースエントリーのルート。ルートが見つからない場合は空文字列。

#### _例_ 

```js
const store = select( SCHEMA_STORE_KEY );
const route = store.getRouteFromResourceEntries( stateSlice, ids );
```

### プレースホルダを持つアセンブルルート

これはプレースホルダを含む組み立てられたルートを返します。

#### _Parameters_ 

- _route_ `string`: 組み立てるルート。
- _routePlaceholders_ `array`: ルートプレースホルダーの配列。
- _ids_ `array`: ルートプレースホルダー内で置換されるID参照の配列。

#### _Returns_

-   `string`: プレースホルダを実際の値に置き換えた、組み立てられたルート。

#### _例_ 

```js
const store = select( SCHEMA_STORE_KEY );
const route = store.assembleRouteWithPlaceholders( route, routePlaceholders, ids );
```
