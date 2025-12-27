---
sidebar_label: Schema Store
---
# スキーマストア (`wc/store/schema`) 

## 概要

スキーマストアは WooCommerce ブロックに関連するルートを管理し、与えられた名前空間のルートデータの効率的な取得と更新を可能にします。このストアはリソースルートとのやりとりを効率化し、モジュールが必要に応じてエンドポイントパスに簡単にアクセスできるようにします。

## Usage

このストアを利用するには、`SCHEMA_STORE_KEY`を参照するモジュールで`wc/store/schema`をインポートします。`@woocommerce/block-data`が`wc.wcBlocksData`を指す外部として登録されていると仮定すると、`@woocommerce/block-data`を介してキーをインポートすることができます：

```js
const { SCHEMA_STORE_KEY } = window.wc.wcBlocksData;
```

## Actions

> ⚠️ これらのアクションは、リゾルバによって内部的に使用されることがほとんどなので、直接使用する必要はほとんどないはずです。

### receiveRoutes( routes, namespace)

提供されたリソースルートのリストでストアを更新するために使用されるアクションオブジェクトを返します。

#### パラメーター 

-   __routes_ `array`：例えば、 `[ '/wc/blocks/products', '/wc/blocks/products/attributes/(?P<id>[\d]+)' ]` です。
-   nameespace_ `string`：ルートが属する名前空間、例 `/wc/blocks`。

#### を返す。 

-   `object`：以下のキーを持つリソースルートのリストでストアを更新するために使われるアクションオブジェクト：
    -   type_ `string`：アクションタイプ。
    -   _routes`object`：アクションタイプ：routes`@woocommerce/block-data`：ルート名をキーとするルートのオブジェクト。
    -   nameespace_ `string`: ルートが属する名前空間：ルートが属する名前空間、例 `/wc/blocks`.

## セレクタ

### getRoute( state, namespace, resourceName, ids = [] )

これは、指定された名前空間、リソース名、および (必要であれば) ID のルートを取得するために使用されます。

#### パラメーター 

-   状態_ `object`：元の状態。
-   名前空間_ `string`：ルートの名前空間 (例 `/wc/blocks`)、
-   リソース名 `string`：リクエストされるリソース、例 `products/attributes/terms`.
-   ids`array`：ルートがidsのプレースホルダを持っている場合にのみ必要です。

#### を返す。 

-   `string`：利用可能であればルート。

#### 例 

もし、`wc/blocks`名前空間上の単一製品のルートを探しているのであれば、`[ 20 ]`をidとして持つことになります：

```js
// '/wc/blocks/products/20'
wp.data.select( SCHEMA_STORE_KEY ).getRoute( '/wc/blocks', 'products', [ 20 ] );
```

### getRoutes( state, namespace )

これは指定された名前空間に登録されたすべてのルートをフラット配列として返します。

#### パラメーター 

-   状態 `object`：現在の状態。
-   namespace `string`: 現在の状態：ルートを返す名前空間。

#### を返す。 

-   `array`：与えられた名前空間のすべてのルートの配列。

### getRouteFromResourceEntries

これは、ルート状態の指定されたスライスからルートを返します。

#### パラメーター 

-   _stateSlice_ `object`:与えられた名前空間とリソース名のルート状態のスライス。
-   ids_ `array` (default: `[]`)：ルートプレースホルダーで置き換える id 参照の配列。

#### を返す。 

-   `string`：指定されたリソースエントリーのルート。ルートが見つからない場合は空文字列。

#### 例 

```js
const store = select( SCHEMA_STORE_KEY );
const route = store.getRouteFromResourceEntries( stateSlice, ids );
```

### プレースホルダを持つアセンブルルート

これはプレースホルダを含む組み立てられたルートを返します。

#### パラメーター 

-   ルート `string`：組み立てるルート。
-   _routePlaceholders_ `array`: 組み立てるルート：ルートプレースホルダの配列。
-   id`array`：ルートプレースホルダーで置き換える id 参照の配列。

#### を返す。 

-   `string`：プレースホルダを実際の値に置き換えた、組み立てられたルート。

#### 例 

```js
const store = select( SCHEMA_STORE_KEY );
const route = store.assembleRouteWithPlaceholders( route, routePlaceholders, ids );
```
