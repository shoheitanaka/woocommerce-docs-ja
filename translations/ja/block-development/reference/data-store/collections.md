---
sidebar_label: Collections Store
---
# コレクションストア (`wc/store/collections`) 

## 概要

コレクションストアはWooCommerceブロック内の商品関連コレクションを取得することができます。

## Usage

このストアを利用するには、それを参照するモジュールでCOLLECTIONS_STORE_KEYをインポートします。`@woocommerce/block-data`が`wc.wcBlocksData`を指す外部として登録されていると仮定すると、このキーをインポートできます：

```js
const { COLLECTIONS_STORE_KEY } = window.wc.wcBlocksData;
```

## Actions

### receiveCollection( namespace, resourceName, queryString,ids = [], items = [], replace = false )

これは、コレクション結果をストアにディスパッチする際に使用される、与えられた引数のアクションオブジェクトを返します。

> ⚠️ このアクションは`getCollection`セレクタのリゾルバによって使用されるため、直接ディスパッチする必要はほとんどないはずだ。

#### パラメーター 

-   名前空間_ `string`：コレクションのルート名前空間、例 `/wc/blocks`.
-   リソース名 `string`：コレクションのリソース名 (例 `products/attributes`)。
-   _queryString_ `string`:コレクションへのリクエストに追加するクエリー文字列。コレクションはクエリー文字列によってキャッシュされることに注意。
-   ids_ `array`：コレクションルートにidsのプレースホルダがある場合、この引数でidsを指定します。
-   レスポンス `Object`：レスポンスのコレクションアイテム (配列) を含む `items` プロパティと、 レスポンスのヘッダーを含む `window.Headers` インターフェイスにマッチする `headers` プロパティを含むオブジェクト。
-   `boolean`：与えられたインデックス (namespace、resourceName、queryString) に対して、ストアに既に値がある場合に、既存の項目を置き換えるかどうか。

#### 例 

```js
const { dispatch } = useDispatch( COLLECTIONS_STORE_KEY );
dispatch( receiveCollection( namespace, resourceName, queryString, ids, response ) );
```

### レシーブ・コレクション・エラー

これは、ストアにエラーをディスパッチする際に使用される、与えられた引数のアクションオブジェクトを返します。

#### パラメーター 

-   名前空間_ `string`：コレクションのルート名前空間、例 `/wc/blocks`.
-   リソース名 `string`：コレクションのリソース名、例 `products/attributes`。
-   _queryString_ `string`:コレクションへのリクエストに追加するクエリー文字列。コレクションはクエリ文字列によってキャッシュされることに注意してください。
-   ids_ `array`：コレクションルートにidsのプレースホルダがある場合は、この引数でidsを指定します。
-   error_ `object`：以下のキーを持つエラーオブジェクト：
   	-   code_ `string`: エラーコード：エラーコード。
   	-   message_ `string`: エラーメッセージ：エラーメッセージ。
   	-   data_ `object`: エラーメッセージ：以下のキーを持つエラーデータ：
      		-   status_ `number`: HTTPステータスコード：HTTPステータスコード。
      		-   params`object`：エラーのパラメータ：エラーのパラメータ。
      		-   ヘッダー `object`: エラーのヘッダー：エラーのヘッダー。

#### 例 

```js
const { dispatch } = useDispatch( COLLECTIONS_STORE_KEY );
dispatch( receiveCollectionError( namespace, resourceName, queryString, ids, error ) );
```

### receiveLastModified

これは、指定された引数に対応するアクションオブジェクトを返します。

#### パラメーター 

-   タイムスタンプ `number`：最終更新日のタイムスタンプ。

#### 例 

```js
const { dispatch } = useDispatch( COLLECTIONS_STORE_KEY );
dispatch( receiveLastModified( timestamp ) );
```

## セレクタ

### ゲットフロムステート

このセレクタは、コレクションストアから状態を返します。

#### を返す。 

-   `object`：以下のプロパティを持つコレクションストアの状態：
   	- nameespace_ `string`：例えば、 `/wc/blocks` です。
    - _resourceName_ `string`：コレクションのリソース名、例 `products/attributes`。
    - query_ `object`: コレクションのクエリ引数：コレクションのクエリ引数。
    - ids_ `array`：コレクションルートにidsのプレースホルダがある場合は、この配列にプレースホルダの値を指定します (順番に)。
   	- type_ `string`: コレクションのタイプ `items`.

or

- `array` | `null` | `undefined`：指定された引数にマッチするヘッダがコレクションにない場合に、フォールバック値 (パラメータとして指定) を返します。

#### 例 

```js
const store = select( COLLECTIONS_STORE_KEY );
const state = store.getFromState( state, namespace, resourceName, queryString, ids, type, fallback );
```

### getCollection

このセレクタは、与えられた引数のコレクションを返します。兄弟リゾルバを持つので、セレクタが解決されたことがない場合、リゾルバはコレクションをサーバにリクエストし、結果をストアにディスパッチします。

#### を返す。 

-   `object`：  `getFromState`オブジェクトを返します ([`getFromState`](#getfromstate) を参照ください)。

### コレクションヘッダー

このセレクタは、与えられた引数を使ってコレクションレスポンスからヘッダを返します。このセレクタには兄弟リゾルバがあり、`getCollection` が解決されなかった場合に、引数を使用して解決します。

#### を返す。 

-   `undefined`を返します：コレクションにヘッダがあるが、与えられた `header` 引数にマッチするヘッダがない場合、 `undefined` が返されます。

or

-   `null`を返します：コレクションが与えられた引数にマッチするヘッダを持っていない場合、 `null` が返されます。

or

-   `object`：コレクションが与えられた引数にマッチするヘッダーを持つ場合、以下のプロパティを持つオブジェクトが返される：
    -   nameespace_ `string`：コレクションのルート名前空間、例： `/wc/blocks`.
    -   _resourceName_ `string`：コレクションのリソース名、例 `products/attributes`。
    -   _header`string`：ヘッダーのヘッダーキー。
    -   query_ `Object`: コレクションのクエリ引数：コレクションのクエリー引数。
    -   ids_ `Array`：コレクションルートにidsのプレースホルダがある場合は、この配列にプレースホルダの値を指定します (順番に)。

### getCollectionHeaders

このセレクタはコレクションのヘッダを返します。

#### を返す。 

-   `object`：  `getFromState`オブジェクトを返します ([`getFromState`](#getfromstate) を参照ください)。

#### 例 

```js
const store = select( COLLECTIONS_STORE_KEY );
const headers = store.getCollectionHeaders( state, namespace, resourceName, queryString );
```

### コレクションエラー

このセレクタは、コレクションの取得中に発生したエラーを返します。

#### を返す。 

-   `object`：  `getFromState`オブジェクトを返します ([`getFromState`](#getfromstate) を参照ください)。

#### 例 

```js
const store = select( COLLECTIONS_STORE_KEY );
const error = store.getCollectionError( state, namespace, resourceName, queryString );
```

### getCollectionLastModified

このセレクタは、コレクションの最終更新日を返します。

#### を返す。 

-   `number`：コレクションの最終更新日。最終更新日がない場合は`0`。

#### 例 

```js
const store = select( COLLECTIONS_STORE_KEY );
const lastModified = store.getCollectionLastModified( state, namespace, resourceName, queryString );
```
