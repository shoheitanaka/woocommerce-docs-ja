# データストア

このドキュメントでは、さまざまなブロックで使用するために`wp.data`で登録されたデータストアの概要を示します。ストアの説明は`wc.wcBlocksData`エクスポートの定数としてエクスポートされます（外部では`@woocommerce/block-data`として登録され、ハンドル`wc-blocks-data-store`を介してエンキューされます）。ストアを使用するブロックでは、依存関係が正しく抽出されるように、リファレンスを直接使用するのではなく、ストアの説明をインポートすることを推奨します。読者が`wp.data` APIにある程度精通していることを前提としている。これについては[@wordpress/dataリファレンスガイド](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/)を参照してください。

## [カートストア (wc/store/cart)](cart.md)

[カートストア(wc/store/cart)](cart.md)** は、カート関連のデータと操作を処理します。定数を使ってこのストアにアクセスするには

```ts
const { cartStore } = window.wc.wcBlocksData;
```

## [チェックアウト・ストア (wc/store/checkout)](checkout.md)

[チェックアウトストア (wc/store/checkout)](checkout.md)**は、チェックアウトプロセスを管理し、ユーザにシームレスな体験を保証します。定数を使ってこのストアにアクセスするには

```ts
const { checkoutStore } = window.wc.wcBlocksData;
```

## [コレクションストア (wc/store/collections)](collections.md)

[コレクションストア (wc/store/collections)](collections.md)**は、名前空間、モデル名、クエリ文字列によってインデックス化されたデータを保持します。定数を使用してこのストアにアクセスするには、次のようにします：

```ts
const { COLLECTIONS_STORE_KEY } = window.wc.wcBlocksData;
```

## [決済ストア (wc/store/payment)](payment.md)

[支払いストア (wc/store/payment)](payment.md)**は、すべての支払い関連のデータとトランザクションを扱う。定数を使用してこのストアにアクセスするには、次のようにします：

```ts
const { paymentStore } = window.wc.wcBlocksData;
```

## [クエリストア (wc/store/query-state)](query-state.md)

[クエリ状態ストア (wc/store/query-state)](query-state.md)**は、コンテキストとキーによってインデックス付けされた任意の値を保持します。これは、与えられたコンテキストに対する問い合わせオブジェクトの状態を追跡するためによく使用されます。定数を使用してこのストアにアクセスするには、次のようにします：

```ts
const { QUERY_STATE_STORE_KEY } = window.wc.wcBlocksData;
```

## [スキーマストア (wc/store/schema)](schema.md)

[スキーマストア (wc/store/schema)](schema.md)**は、主にルートにアクセスするために使われ、より内部的な使い方があります。定数を使用してこのストアにアクセスするには、次のようにします：

```ts
const { SCHEMA_STORE_KEY } = window.wc.wcBlocksData;
```

## [ストア通知ストア (wc/ストア/ストア通知)](ストア通知.md)

[ストア通知ストア(wc/store/store-notices)](store-notices.md)**は、様々なストア通知やアラートを扱う専用ストアです。定数を使用してこのストアにアクセスするには、次のようにします：

```ts
const { storeNoticesStore } = window.wc.wcBlocksData;
```

この`StoreDescriptor`は、`useSelect`の`mapSelect`関数と`useDispatch`で渡すことができる。

## [バリデーションストア (wc/store/validation)](validation.md)

[バリデーションストア(wc/store/validation)](validation.md)**は、バリデーションエラーに関連するデータを保持し、無効なデータが存在する間にチェックアウトが続行されないことを保証するために、主にカートとチェックアウトフローで使用されます。定数を使用してこのストアにアクセスするには、次のようにします：

```ts
const { validationStore } = window.wc.wcBlocksData;
```
