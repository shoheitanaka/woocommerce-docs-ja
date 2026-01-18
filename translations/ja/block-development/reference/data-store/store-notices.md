---
sidebar_label: Store Notices Store
---
# ストア通知ストア (`wc/store/store-notices`) 

## 概要

お知らせストアでは、お知らせ用のコンテナを登録したり解除したりできます。これはカスタムブロックのような特定の場所にお知らせを表示するのに便利です。

このストアを利用するには、`storeNoticesStore` `StoreDescriptor` を参照するモジュールでインポートします。`@woocommerce/block-data` が `wc.wcBlocksData` を指す外部として登録されていると仮定すると、`StoreDescriptor` をインポートすることができます: 

```js
import { storeNoticesStore } from '@woocommerce/block-data';
```

そうでない場合は、このようにウィンドウからアクセスする: 

```js
const { storeNoticesStore } = window.wc.wcBlocksData;
```

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

### 登録コンテナ( containerContext )

このアクションは新しいコンテナを登録する。

#### _Parameters_ 

-   _containerContext_ `string`: 登録するコンテナのコンテキストまたは識別子。

#### _Returns_ 

-   `object`: 以下のプロパティを持つアクションオブジェクト
    -   _type_ `string`: アクションのタイプ。
    -   _containerContext_ `string`: 渡された_containerContext_。

#### _例_ 

```javascript
import { storeNoticesStore } from '@woocommerce/block-data';

dispatch( storeNoticesStore ).registerContainer( 'someContainerContext' );
```

### unregisterContainer( containerContext )

このアクションは、既存のコンテナの登録を解除する。

#### _Parameters_ 

- _containerContext_ `string`: 登録解除するコンテナのコンテキストまたは識別子。

#### _Returns_ 

-   `object`: 以下のプロパティを持つアクションオブジェクト: 
    -   _type_ `string`: アクションのタイプ。
    -   _containerContext_ `string`: 渡された _containerContext_。

#### _例_ 

```js
import { storeNoticesStore } from '@woocommerce/block-data';

dispatch( storeNoticesStore ).unregisterContainer( 'someContainerContext' );
```

## セレクタ

### getRegisteredContainers

州から現在登録されているコンテナのリストを返す。

#### _Returns_ 

-   `string[]`: 登録されているコンテナコンテキストを表す文字列の配列。

#### _例_ 

```js
import { storeNoticesStore } from '@woocommerce/block-data';

const store = select( storeNoticesStore );
const registeredContainers = store.getRegisteredContainers();
```
