---
sidebar_label: Store Notices Store
---
# ストア通知ストア (`wc/store/store-notices`) 

## 概要

お知らせストアでは、お知らせ用のコンテナを登録したり解除したりできます。これはカスタムブロックのような特定の場所にお知らせを表示するのに便利です。

## Usage

このストアを利用するには、`storeNoticesStore` `StoreDescriptor` を参照するモジュールでインポートします。`@woocommerce/block-data`が`wc.wcBlocksData`を指す外部として登録されていると仮定すると、`StoreDescriptor`をインポートすることができます：

```js
import { storeNoticesStore } from '@woocommerce/block-data';
```

そうでない場合は、このようにウィンドウからアクセスする：

```js
const { storeNoticesStore } = window.wc.wcBlocksData;
```

## Example

以下のコード・スニペットは、通知用コンテナの登録方法を示している。

```js
import { store as noticesStore } from '@wordpress/notices';

export default function Block( attributes ) {
	const context = 'your-namespace/custom-form-step';

	dispatch( noticesStore ).createNotice(
		'error',
		'This is an example of an error notice.',
		{ context }
	);

	return (
		<>
			<StoreNoticesContainer context={ context } />
			{ /* Your custom block code here */ }
		</>
	);
}
```

> 内部的には、`StoreNoticesContainer`コンポーネントが`registerContainer`アクションをディスパッチします。

これは単純な例であることに注意してください。実際には、フォームを送信するなどのユーザーアクションに応じて`createNotice`アクションをトリガーしたいでしょう。

## Actions

### 登録コンテナ( containerContext )

このアクションは新しいコンテナを登録する。

#### パラメーター 

-   __containerContext_ `string`：登録するコンテナのコンテキストまたは識別子。

#### を返す。 

-   `object`：以下のプロパティを持つアクションオブジェクト：
    -   type_ `string`：アクションのタイプ。
    -   _containerContext`string`：渡された_containerContext_。

#### 例 

```javascript
import { storeNoticesStore } from '@woocommerce/block-data';

dispatch( storeNoticesStore ).registerContainer( 'someContainerContext' );
```

### unregisterContainer( containerContext )

このアクションは、既存のコンテナの登録を解除する。

#### パラメーター 

-   コンテナコンテキスト `string`：登録を解除するコンテナのコンテキストまたは識別子。

#### を返す。 

-   `object`：以下のプロパティを持つアクションオブジェクト：
    -   type_ `string`：アクションのタイプ。
    -   _containerContext`string`：渡された_containerContext_。

#### 例 

```js
import { storeNoticesStore } from '@woocommerce/block-data';

dispatch( storeNoticesStore ).unregisterContainer( 'someContainerContext' );
```

## セレクタ

### getRegisteredContainers

州から現在登録されているコンテナのリストを返す。

#### を返す。 

-   `string[]`：登録されているコンテナコンテキストを表す文字列の配列。

#### 例 

```js
import { storeNoticesStore } from '@woocommerce/block-data';

const store = select( storeNoticesStore );
const registeredContainers = store.getRegisteredContainers();
```
