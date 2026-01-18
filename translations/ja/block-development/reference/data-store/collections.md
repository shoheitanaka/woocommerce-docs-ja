---
sidebar_label: Collections Store
---

# コレクションストア (`wc/store/collections`) 

## 概要

コレクションストアはWooCommerceブロック内の商品関連コレクションを取得することができます。

このストアを利用するには、それを参照するモジュールでCOLLECTIONS_STORE_KEYをインポートします。`@woocommerce/block-data`が`wc.wcBlocksData`を指す外部として登録されていると仮定すると、このキーをインポートできます: 

```js
const { COLLECTIONS_STORE_KEY } = window.wc.wcBlocksData;
```

### receiveCollection( namespace, resourceName, queryString,ids = [], items = [], replace = false )

これは、コレクション結果をストアにディスパッチする際に使用される、与えられた引数のアクションオブジェクトを返します。

> ⚠️ このアクションは`getCollection`セレクタのリゾルバによって使用されるため、直接ディスパッチする必要はほとんどないはずだ。

#### _Parameters_ 

- _namespace_ `string`: コレクションのルート名前空間 (例: `/wc/blocks`)。
- _resourceName_ `string`: コレクションのリソース名 (例: `products/attributes`)。
- _queryString_ `string`: コレクションのリクエストに追加するクエリ文字列。コレクションはクエリ文字列によってキャッシュされることに注意してください (例: `?order=ASC`)。
- _ids_ `array`: コレクションルートに ID のプレースホルダーがある場合は、この引数を使用して、ルート内でのプレースホルダーの出現順序で指定します。
- _response_ `Object`: レスポンス (配列) のコレクションアイテムを含む `items` プロパティと、レスポンスのヘッダーを含む `window.Headers` インターフェースに一致する `headers` プロパティを含むオブジェクト。
- _replace_ `boolean`: ストア内に既に値がある場合、指定されたインデックス (namespace、resourceName、queryString) のストア内の既存のアイテムを置き換えるかどうか。

#### _例_ 

```js
const { dispatch } = useDispatch( COLLECTIONS_STORE_KEY );
dispatch( receiveCollection( namespace, resourceName, queryString, ids, response ) );
```

### レシーブ・コレクション・エラー

これは、ストアにエラーをディスパッチする際に使用される、与えられた引数のアクションオブジェクトを返します。

#### _Parameters_ 

- _namespace_ `string`: コレクションのルート名前空間（例: `/wc/blocks`）。
- _resourceName_ `string`: コレクションのリソース名（例: `products/attributes`）。
- _queryString_ `string`: コレクションのリクエストに追加するクエリ文字列。コレクションはクエリ文字列によってキャッシュされることに注意してください（例: `?order=ASC`）。
- _ids_ `array`: コレクションのルートにIDのプレースホルダーがある場合は、この引数で、ルート内でのプレースホルダーの出現順序に従って指定します。
- _error_ `object`: 以下のキーを持つエラーオブジェクト。
    - _code_ `string`: エラーコード。
    - _message_ `string`: エラーメッセージ。
    - _data_ `object`: 以下のキーを持つエラーデータ:
        - _status_ `number`: HTTP ステータスコード。
        - _params_ `object`: エラーのパラメーター。
        - _headers_ `object`: エラーのヘッダー。

#### _例_ 

```js
const { dispatch } = useDispatch( COLLECTIONS_STORE_KEY );
dispatch( receiveCollectionError( namespace, resourceName, queryString, ids, error ) );
```

### receiveLastModified

これは、指定された引数に対応するアクションオブジェクトを返します。

#### _Parameters_ 

-   _timestamp_  `number`: 最終更新日のタイムスタンプ。

#### _例_ 

```js
const { dispatch } = useDispatch( COLLECTIONS_STORE_KEY );
dispatch( receiveLastModified( timestamp ) );
```

## セレクタ

### ゲットフロムステート

このセレクタは、コレクションストアから状態を返します。

#### _Returns_ 

- `object`: コレクションストアから取得された状態。以下のプロパティを持ちます。
    - _namespace_ `string`: コレクションのルート名前空間。例: `/wc/blocks`
    - _resourceName_ `string`: コレクションのリソース名。例: `products/attributes`
    - _query_ `object`: コレクションのクエリ引数。例: `{ order: 'ASC', sortBy: Price }`
    - _ids_ `array`: コレクションルートにIDのプレースホルダーがある場合は、この配列にそれらのプレースホルダーの値を（順番に）指定します。
    - _type_ `string`: コレクションのタイプ。例: `items`

もしくは

- `array` | `null` | `undefined`: 指定された引数にマッチするヘッダがコレクションにない場合に、フォールバック値 (パラメータとして指定) を返します。

#### _例_ 

```js
const store = select( COLLECTIONS_STORE_KEY );
const state = store.getFromState( state, namespace, resourceName, queryString, ids, type, fallback );
```

### getCollection

このセレクタは、与えられた引数のコレクションを返します。兄弟リゾルバを持つので、セレクタが解決されたことがない場合、リゾルバはコレクションをサーバにリクエストし、結果をストアにディスパッチします。

#### _Returns_ 

-   `object`:   `getFromState`オブジェクトを返します ([`getFromState`](#getfromstate) を参照ください)。

### コレクションヘッダー

このセレクタは、与えられた引数を使ってコレクションレスポンスからヘッダを返します。このセレクタには兄弟リゾルバがあり、`getCollection` が解決されなかった場合に、引数を使用して解決します。

#### _Returns_ 

-   `undefined`を返します: コレクションにヘッダがあるが、与えられた `header` 引数にマッチするヘッダがない場合、 `undefined` が返されます。

-   `null`を返します: コレクションが与えられた引数にマッチするヘッダを持っていない場合、 `null` が返されます。

-   `object`: コレクションが与えられた引数にマッチするヘッダーを持つ場合、以下のプロパティを持つオブジェクトが返される: 
    -   _nameespace_ `string`: コレクションのルート名前空間、例:  `/wc/blocks`.
    -   _resourceName_ `string`: コレクションのリソース名、例 `products/attributes`。
    -   _header_ `string`: ヘッダーのヘッダーキー。
    -   query_ `Object`: コレクションのクエリ引数: コレクションのクエリー引数。
    -   ids_ `Array`: コレクションルートにidsのプレースホルダがある場合は、この配列にプレースホルダの値を指定します (順番に)。

### getCollectionHeaders

このセレクタはコレクションのヘッダを返します。

#### _Returns_ 

-   `object`:   `getFromState`オブジェクトを返します ([`getFromState`](#getfromstate) を参照ください)。

#### _例_ 

```js
const store = select( COLLECTIONS_STORE_KEY );
const headers = store.getCollectionHeaders( state, namespace, resourceName, queryString );
```

### コレクションエラー

このセレクタは、コレクションの取得中に発生したエラーを返します。

#### _Returns_ 

-   `object`:   `getFromState`オブジェクトを返します ([`getFromState`](#getfromstate) を参照ください)。

#### _例_ 

```js
const store = select( COLLECTIONS_STORE_KEY );
const error = store.getCollectionError( state, namespace, resourceName, queryString );
```

### getCollectionLastModified

このセレクタは、コレクションの最終更新日を返します。

#### _Returns_ 

-   `number`: コレクションの最終更新日。最終更新日がない場合は`0`。

#### _例_ 

```js
const store = select( COLLECTIONS_STORE_KEY );
const lastModified = store.getCollectionLastModified( state, namespace, resourceName, queryString );
```
