---
post_title: Registering custom collections in product collection block
sidebar_label: Registering custom collections
---

# Registering custom collections in product collection block

`__experimentalRegisterProductCollection`関数は`@woocommerce/blocks-registry`パッケージの一部である。この関数を使用すると、サードパーティの開発者は新しいコレクションを登録できます。この関数は、[Block Variation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/#defining-a-block-variation) が受け付けるほとんどの引数を受け付けます。

**注意:** 実験的なものであり、今後変更される可能性があります。注意して使用してください。

**この機能を使うには2つの方法がある。

1.Webpackの設定で`@woocommerce/dependency-extraction-webpack-plugin`を使用します：これにより、パッケージから関数をインポートし、コードで使用できるようになります。例えば

	```tsx
	import { __experimentalRegisterProductCollection } from "@woocommerce/blocks-registry";
	```

2.グローバルな`wc`オブジェクトを使用する：これにより、インポートせずにグローバルJSオブジェクトを使用して関数を使用することができます。例えば

	```tsx
	wc.wcBlocksRegistry.__experimentalRegisterProductCollection({
	...
	});
	```

`wc`グローバルを使用する場合は、必ず`wc-blocks-registry`をスクリプトに追加してください。

  ```php
  function enqueue_my_custom_product_collection_script() {
      wp_enqueue_script(
          'my-custom-product-collection',
          plugins_url( '/dist/my-custom-product-collection.js', __FILE__ ),
          array( 'wc-blocks-registry' ),
          10
      );
  }
  add_action( 'enqueue_block_editor_assets', 'enqueue_my_custom_product_collection_script' );
  ```

**Tip:** Webpackを使用している場合は、最初の方法をお勧めします。

## コレクションの定義

ここでは、`__experimentalRegisterProductCollection`に渡すことができる重要な引数について説明する。その他の引数については、[Block Variation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/#defining-a-block-variation) のドキュメントを参照してください。

コレクションは、以下のフィールドを含むことができるオブジェクトによって定義されます：

- `name` (`string`型)：ユニークで機械可読なコレクション名。`<plugin-name>/product-collection/<collection-name>`の使用を推奨します。`<plugin-name>`と`<collection-name>`は、英数字とハイフンのみで構成される（例： `my-plugin/product-collection/my-collection`）。
- `title`（タイプ`string`）：ブロック・インサーターやコレクション・チューザーを含む様々な場所に表示されるコレクションのタイトル。
- `description` (オプション、`string`型)：人間が読めるコレクションの説明。
- `innerBlocks` (オプション、型 `Array[]`)：コレクションに追加される内部ブロックの配列。指定しない場合は、デフォルトの内部ブロックが使用されます。
- `isDefault`：すべてのコレクションで`false`に設定されます。サードパーティの開発者はこの引数を渡す必要はありません。
- `isActive`：これは私たちが管理します。サードパーティの開発者はこの引数を渡す必要はありません。
- `usesReference`（オプション、`Array[]`型）：コレクションに必要な参照を指定する文字列の配列。使用可能な値は `product`, `archive`, `cart`, `order` です。エディター側で必要なリファレンスが利用できないが、フロントエンドで利用できる場合は、プレビューラベルを表示します。
- `scope`（オプション、`Array[]`型）：コレクションが適用されるスコープのリスト。使用可能な値は `block`、 `inserter`、 `transform`です。デフォルトは`["block", "inserter"]`です。
   	- **注:** Product Collectionブロックの場合、`block`スコープはコレクションがコレクション・チューザーに表示され、"Choose Collection "ツールバーボタンが表示されることを意味します。その他のスコープについては、[Block Variation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/#defining-a-block-variation) のドキュメントを参照してください。

### 属性

属性は、コレクションの動作を定義するプロパティです。すべての属性は*オプション*です。以下は、`__experimentalRegisterProductCollection`に渡すことができる重要な属性です：

- `query` (`object`型)：コレクションのクエリを定義するクエリ・オブジェクト。以下のフィールドを含むことができます：
    - `offset` (`number` 型)：クエリをオフセットするアイテムの数。
    - `order` (`string` 型)：クエリの順番。使用可能な値は `asc` と `desc` です。
    - `orderBy` (`string` 型)：クエリーを並べ替えるフィールド。
    - `pages` (`number` 型)：クエリーするページ数。
    - `perPage` (`number` 型)：ページあたりの商品数。
    - `search` (`string` 型)：検索キーワード。
    - `taxQuery` (`object` 型)：クエリーをフィルタリングする税クエリー。例えば、`Clothing`と`Accessories`のカテゴリーと`Summer`のタグを持つ商品を取得したい場合、`taxQuery`を`{"product_cat":[20,17],"product_tag":[36]}`として渡すことができます。ここで、配列の値は用語IDである。
    - `featured` (`boolean`型)：特集項目を検索するかどうか。
    - `timeFrame` (`object` 型)：時間枠を指定する。
        - `operator` (`string` 型)：時間枠クエリに使用する演算子。使用可能な値は `in` および `not-in` です。
        - `value` (`string` 型)：クエリーする値。PHP の `strtotime` 関数がパースできる有効な日付文字列でなければなりません。
    - `woocommerceOnSale` (`boolean` 型)：セール中の商品を問い合わせるかどうか。
    - `woocommerceStockStatus` (`array` 型)：在庫状況を問い合わせる。指定可能な値は `instock`、 `outofstock`、 `onbackorder`です。
    - `woocommerceAttributes` (`array`型)：クエリーする属性。
        - 例えば、色 `blue` & `gray` およびサイズ `Large` の商品を取得したい場合は、 `woocommerceAttributes` を `[{"termId":23,"taxonomy":"pa_color"},{"termId":26,"taxonomy":"pa_size"},{"termId":29,"taxonomy":"pa_color"}]` として渡します。
    - `woocommerceHandPickedProducts`（タイプ `array`）：クエリーする厳選された商品。商品IDを含む。
    - `priceRange` (`object` 型)：価格帯。
        - `min` (`number` 型)：最低価格。
        - `max` (`number` 型)：最高価格。

- `displayLayout` (`object`型)：コレクションのレイアウトを定義するディスプレイ・レイアウト・オブジェクト。以下のフィールドを含むことができる：
    - `type` (`string`型)：レイアウトのタイプ。使用可能な値は`grid`、_`stack`、`carousel`です。
    - `columns` (`number` 型)：表示する列数。
    - `shrinkColumns` (`boolean` 型)：レイアウトをレスポンシブにするかどうか。

- `hideControls` (`array`型)：非表示にするコントロール。可能な値：
    - `order` - "Order by "設定。
    - `attributes` - "商品属性 "フィルター。
    - `created` - "作成済み "フィルター
    - `featured` - 「注目」フィルター
    - `hand-picked` - 「厳選商品」フィルター
    - `keyword` - 「キーワード」フィルター
    - `on-sale` - 「セール中」フィルター
    - `stock-status` - 「在庫状況」フィルター
    - `taxonomy` - "商品カテゴリ"、"商品タグ" およびカスタムタクソノミーフィルタ
    - `price-range` - 「価格帯」フィルター

#### プレビュー属性

`preview`属性はオプションで、コレクションのプレビュー状態を設定するために使用されます。以下のフィールドを含むことができます：

- `initialPreviewState`（`object`型）：コレクションの初期プレビュー状態。以下のフィールドを含むことができる：
    - `isPreview` (`boolean` 型)：コレクションがプレビューモードかどうか。
    - `previewMessage`（タイプ `string`）：ユーザーがプレビュー・ラベルの上にマウスを置いたときに、ツールチップに表示されるメッセージ。
- `setPreviewState`（オプション、`function`型）：コレクションのプレビュー状態を設定する関数です。以下の引数を受け取ります：
    - `setState` (`function` 型)：プレビュー状態を設定する関数。`isPreview`と`previewMessage`を含む新しいプレビュー状態をこの関数に渡すことができます。
    - `attributes` (`object`型)：コレクションの現在の属性。
    - `location` (`object` 型)：コレクションの場所。指定できる値は `product`, `archive`, `cart`, `order`, `site` です。

詳しくは、プレビュー機能が追加された[PR #46369](https://github.com/woocommerce/woocommerce/pull/46369)をご覧ください。

## 例

### 例 1：新しいコレクションの登録

```tsx
__experimentalRegisterProductCollection({
  name: "your-plugin-name/product-collection/my-custom-collection",
  title: "My Custom Collection",
  icon: "games",
  description: "This is a custom collection.",
  keywords: ["custom collection", "product collection"],
});
```

[上の例でわかるように、名前`woocommerce/product-collection/my-custom-collection`とタイトル`My Custom Collection`で新しいコレクションを登録しています。以下はそのスクリーンショットです：
画像](https://github.com/woocommerce/woocommerce/assets/16707866/7fddbc02-a6cd-494e-b2f4-13dd5ef9cf96)

### 例 2：新しいコレクションをプレビュー付きで登録する

以下のように、プレビューの初期状態を設定することができる。下の例では、`isPreview`と`previewMessage`を設定しています。

```tsx
__experimentalRegisterProductCollection({
  name: "your-plugin-name/product-collection/my-custom-collection-with-preview",
  title: "My Custom Collection with Preview",
  icon: "games",
  description: "This is a custom collection with preview.",
  keywords: ["My Custom Collection with Preview", "product collection"],
  preview: {
    initialPreviewState: {
      isPreview: true,
      previewMessage:
        "This is a preview message for my custom collection with preview.",
    },
  },
  attributes: {
    query: {
      perPage: 5,
      featured: true,
    },
    displayLayout: {
      type: "grid",
      columns: 3,
      shrinkColumns: true,
    },
	hideControls: [ "created", "stock-status" ]
  },
});
```

[以下のようになる：
画像](https://github.com/woocommerce/woocommerce/assets/16707866/5fc1aa20-552a-4e09-b811-08babab46665)

### 例3：プレビューの高度な使い方

以下のように、`setPreviewState`を使用してプレビュー状態を設定することも可能です。下の例では、`initialPreviewState`を設定し、`setPreviewState`を使って5秒後にプレビュー状態を変更しています。

**この例では

- プレビュー状態で現在の属性と位置にアクセスする方法
- 非同期操作の使い方
   	- ここでは、`setTimeout`を使って5秒後にプレビュー状態を変更している。APIからのデータ取得のような、任意の非同期操作を使ってプレビュー状態を決定することができる。
- クリーンアップ関数を戻り値として使用する方法
   	- コンポーネントがアンマウントされた後、タイムアウトをクリアするクリーンアップ関数を返します。これを使用して、`setPreviewState`で使用したリソースをクリーンアップすることができます。

```tsx
__experimentalRegisterProductCollection({
  name: "your-plugin-name/product-collection/my-custom-collection-with-advanced-preview",
  title: "My Custom Collection with Advanced Preview",
  icon: "games",
  description: "This is a custom collection with advanced preview.",
  keywords: [
    "My Custom Collection with Advanced Preview",
    "product collection",
  ],
  preview: {
    setPreviewState: ({
      setState,
      attributes: currentAttributes,
      location,
    }) => {
      // setPreviewState has access to the current attributes and location.
      // console.log( currentAttributes, location );

      const timeoutID = setTimeout(() => {
        setState({
          isPreview: false,
          previewMessage: "",
        });
      }, 5000);

      return () => clearTimeout(timeoutID);
    },
    initialPreviewState: {
      isPreview: true,
      previewMessage:
        "This is a preview message for my custom collection with advanced preview.",
    },
  },
});
```

### 例4：内部ブロックを持つコレクション

下記のように、コレクションの内部ブロックを定義することも可能です。下の例では、コレクションの内部ブロックを定義しています。

```tsx
__experimentalRegisterProductCollection({
  name: "your-plugin-name/product-collection/my-custom-collection-with-inner-blocks",
  title: "My Custom Collection with Inner Blocks",
  icon: "games",
  description: "This is a custom collection with inner blocks.",
  keywords: ["My Custom Collection with Inner Blocks", "product collection"],
  innerBlocks: [
    [
      "core/heading",
      {
        textAlign: "center",
        level: 2,
        content: "Title of the collection",
      },
    ],
    [
      "woocommerce/product-template",
      {},
      [
        ["woocommerce/product-image"],
        [
          "woocommerce/product-price",
          {
            textAlign: "center",
            fontSize: "small",
          },
        ],
      ],
    ],
  ],
});
```

これで、見出し、商品画像、商品価格を持つコレクションが作成されます。このようになります：

![image](https://github.com/woocommerce/woocommerce/assets/16707866/3d92c084-91e9-4872-a898-080b4b93afca)

**ヒント:** インナーブロック・テンプレートについては、[インナーブロック](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/#template)のドキュメントを参照してください。

### 例 5: `usesReference` 引数を持つコレクション

コレクションが正しく動作するために参照を必要とする場合、`usesReference` 引数を使用してそれを指定できます。以下の例では、`product`参照を必要とするコレクションを定義しています。

```tsx
__experimentalRegisterProductCollection({
  name: "your-plugin-name/product-collection/my-custom-collection",
  title: "My Custom Collection",
  icon: "games",
  description: "This is a custom collection.",
  keywords: ["custom collection", "product collection"],
  usesReference: ["product"],
});
```

これは`product`参照を必要とするコレクションを作成します。必要な参照がエディター側では利用できないが、フロントエンドでは利用できる場合、プレビューラベルを表示します。

コレクションが複数の参照のいずれかを必要とする場合、`usesReference` 引数を使用して指定できます。以下の例では、`product`または`order`参照を必要とするコレクションを定義しています。

```tsx
__experimentalRegisterProductCollection({
  name: "your-plugin-name/product-collection/my-custom-collection",
  title: "My Custom Collection",
  icon: "games",
  description: "This is a custom collection.",
  keywords: ["custom collection", "product collection"],
  usesReference: ["product", "order"],
});
```

### 例6：スコープ引数

引数`scope`を指定しない場合、デフォルト値は`["block", "inserter"]`となります。このデフォルトの動作は、[Block Variation API](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/#defining-a-block-variation) から継承されています。

商品コレクション・ブロックは、`block` スコープを使って制御する：

1.コレクション・チューザーでの可視性
2.コレクションの選択」ツールバーボタンの表示

#### コレクション・チューザーにコレクションを表示しない

コレクション・チューザーにコレクションを表示したくない場合は、`scope`引数に空の配列か、`block`値を含まない他の値を設定します。 

例えば、こうだ：

```tsx
__experimentalRegisterProductCollection({
  name: "your-plugin-name/product-collection/my-custom-collection",
  title: "My Custom Collection",
  icon: "games",
  description: "This is a custom collection.",
  keywords: ["custom collection", "product collection"],
  scope: [],
});
```

#### ブロックインサータにのみコレクションを表示する

コレクションをコレクション・チューザーではなく、ブロック・インサーターだけに表示したい場合は、`scope`引数を`["inserter"]`に設定します。これにより、ユーザーはブロック・インサータからカスタム・コレクションを直接追加することができ、コレクション・チューザー・インターフェイスからはコレクションを隠すことができます。

例えば、こうだ：

```tsx
__experimentalRegisterProductCollection({
  name: "your-plugin-name/product-collection/my-custom-collection",
  title: "My Custom Collection",
  description: "This is a custom collection.",
  keywords: ["custom collection", "product collection"],
  scope: ["inserter"],
});
```

**ヒント:** [plugins/woocommerce/client/blocks/assets/js/blocks/product-collection/collections](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/assets/js/blocks/product-collection/collections/)ディレクトリで、コアコレクションをどのように定義しているかを見ることもできます。コア・コレクションも時間の経過とともに進化していきます。
