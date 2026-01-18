---
sidebar_label: Validation Store
---

# Validation Store (`wc/store/validation`) 

## 概要

バリデーションデータストアは、カートまたはチェックアウトブロックのフィールドのエラーを表示する方法を提供します。

ストアのデータは1つのオブジェクトであるべきで、そのキーは _error ID_ であり、値はそのエラー・メッセージに関連するデータである。オブジェクトの値には _message_ と _hidden_ が含まれていなければなりません。_message_ は表示するエラーメッセージで、_hidden_ はエラーを表示するかどうかを示すブール値です。

データの構造化の例: 

```js
{
    "error-id-1": {
        message: "This is an error message",
        hidden: false,
    },
    "error-id-2": {
        message: "This is another error message",
        hidden: true,
    },
}
```

チェックアウトプロセスが始まると、このデータストアにエントリーがあるかどうかをチェックし、もしあればチェックアウトプロセスの進行を止めます。また、非表示になっているエラーも表示されます。エラーを非表示に設定しても、データストアからそのエラーが消去されることはありません！

このストアを利用するには、`validationStore` `StoreDescriptor` を参照するモジュールでインポートします。`@woocommerce/block-data` が `wc.wcBlocksData` を指す外部として登録されていると仮定すると、`StoreDescriptor` をインポートすることができます: 

```js
const { validationStore } = window.wc.wcBlocksData;
```

バリデーションストアの理解を深めるために、利用規約の必須チェックボックスを例にしてみましょう。ページエディターにおいて、マーチャントはチェックボックスを必須にすることで、バイヤーが利用規約に同意しなければならないことを定義することができます。

![image](https://woocommerce.com/wp-content/uploads/2023/10/Screenshot-2023-10-24-at-17.22.45.png)

WooCommerce Blocks では、`useEffect` フックを使ってチェックボックスが必須かどうか、チェックされているかどうかをチェックしています。チェックボックスが必須でチェックされていない場合、ストアにバリデーションエラーを追加します。チェックボックスが必須でチェックされている場合は、ストアからバリデーションエラーをクリアします。

```ts
useEffect( () => {
	if ( ! checkbox ) {
		return;
	}
	if ( checked ) {
		clearValidationError( validationErrorId );
	} else {
		setValidationErrors( {
			[ validationErrorId ]: {
				message: __(
					'Please read and accept the terms and conditions.',
					'woo-gutenberg-products-block'
				),
				hidden: true,
			},
		} );
	}
	return () => {
		clearValidationError( validationErrorId );
	};
}, [
	checkbox,
	checked,
	validationErrorId,
	clearValidationError,
	setValidationErrors,
] );
```

デフォルトでは、バリデーションエラーは非表示です。これは、購入者がフォームを送信しようとするまでエラーメッセージを表示したくないからです。チェックアウトフォームを送信する前に、バリデーションメッセージはすでにバリデーションストアで見ることができます。

![image](https://woocommerce.com/wp-content/uploads/2023/10/Screenshot-2023-10-24-at-17.28.56.png)

購入者が利用規約チェックボックスをチェックせずにチェックアウトフォームを送信すると、`hidden: true` の項目が `hidden: false` に変更され、検証メッセージが表示されます。

![image](https://woocommerce.com/wp-content/uploads/2023/10/Screenshot-2023-10-24-at-17.33.01.png)

WooCommerce Blocksでは、以下のコードを使ってテキスト入力フィールドにバリデーションエラーがあるかどうかをチェックしています: 

```ts
const hasError = validationError?.message && ! validationError?.hidden;
```

> 💡 この例で覚えておくべき主なポイントは以下の通りです: 
>
> `hidden: true` はバリデーションエラーがあることを意味するが、ユーザーからは見えない。
> - `hidden: false` は、バリデーションエラーが積極的にユーザーに表示されていることを示します。

上の例では、`message` は非表示になり、テキストの色だけが赤に変わり、このフィールドにバリデーション・エラーがあることが強調されている。

場合によっては、ユーザーにバリデーションエラーメッセージを表示したいこともあります。例えば、購入者が必須項目を入力せずにチェックアウトフォームを送信しようとした場合です。例えば、姓、名、住所のフィールドを空のままにした場合です: 

![image](https://woocommerce.com/wp-content/uploads/2023/10/Screenshot-2023-10-25-at-18.28.30.png)

WooCommerce Blocks では、以下の関数がバリデーションエラーメッセージの表示ロジックを処理します: 

```ts
export const ValidationInputError = ( {
	errorMessage = '',
	propertyName = '',
	elementId = '',
}: ValidationInputErrorProps ): JSX.Element | null => {
	const { validationError, validationErrorId } = useSelect( ( select ) => {
		const store = select( validationStore );
		return {
			validationError: store.getValidationError( propertyName ),
			validationErrorId: store.getValidationErrorId( elementId ),
		};
	} );

	if ( ! errorMessage || typeof errorMessage !== 'string' ) {
		if ( validationError?.message && ! validationError?.hidden ) {
			errorMessage = validationError.message;
		} else {
			return null;
		}
	}

	return (
		<div className="wc-block-components-validation-error" role="alert">
			<p id={ validationErrorId }>{ errorMessage }</p>
		</div>
	);
};
```

上記のコード・スニペットを簡略化すると以下のようになる: 

```js
{
	validationError?.hidden === false && (
		<div className="wc-block-components-validation-error" role="alert">
			<p>{ validationError?.message }</p>
		</div>
	);
}
```

### ClearValidationError( errorId )

バリデーションエラーをクリアする。

#### _Parameters_ 

-   _errorId_ `string`: 検証エラーをクリアするためのエラー ID。

#### _例_ 

```js
const store = dispatch( validationStore );
store.clearValidationError( 'billing-first-name' );
```

### ClearValidationErrors( エラー )

複数のバリデーションエラーを一度にクリアする。エラー ID を省略した場合は、すべてのバリデーションエラーをクリアします。

#### _Parameters_ 

- _errors_ `string[]` または `undefined`: 検証エラーをクリアするエラーID。これは undefined にすることができ、その場合、すべての検証エラーがクリアされます。

#### _例_ 

1. これは、配列で渡されたバリデーションエラーだけをクリアします。

```js
const store = dispatch( validationStore );
store.clearValidationErrors( [
	'billing-first-name',
	'billing-last-name',
	'terms-and-conditions',
] );
```
<!-- markdownlint-disable MD029 -->
2. これはすべてのバリデーションエラーをクリアします。

```js
const store = dispatch( validationStore );
store.clearValidationErrors();
```

### setValidationErrors( エラー )

バリデーションエラーを設定します。errors_のエントリがバリデーションエラーのリストに_追加_されます。すでにリストに存在するエントリは、新しい値で _updated_ されます。

#### _Parameters_ 

- _errors_ `object`: 新しい検証エラー。オブジェクトのキーは検証エラー ID であり、値は _message_ `string` と _hidden_​​ `boolean` を含むオブジェクトである必要があります。

#### _例_ 

```js
const { dispatch } = wp.data;
const { setValidationErrors } = dispatch( validationStore );

setValidationErrors( {
	'billing-first-name': {
		message: 'First name is required.',
		hidden: false,
	},
	'billing-last-name': {
		message: 'Last name is required.',
		hidden: false,
	},
} );
```

### バリデーションエラーを隠す( errorId )

`hidden`プロパティを`true`に設定することで、 バリデーションエラーを隠します。これはデータストアからエラーを消去しません！

#### _Parameters_ 

-   _errorId_ `string`: 非表示にするエラー ID。

#### _例_ 

```js
const { dispatch } = wp.data;
const { hideValidationError } = dispatch( validationStore );

hideValidationError( 'billing-first-name' );
```

### showValidationError( errorId )

`hidden`プロパティを`false`に設定することで、バリデーションエラーを表示します。

#### _Parameters_ 

-   _errorId_ `string`: 表示するエラー ID。

#### _例_ 

```js
const { dispatch } = wp.data;
const { showValidationError } = dispatch( validationStore );

showValidationError( 'billing-first-name' );
```

### showAllValidationErrors

`hidden`プロパティを`false`に設定することで、すべての検証エラーを表示します。

#### _例_ 

```js
const { dispatch } = wp.data;
const { showAllValidationErrors } = dispatch( validationStore );

showAllValidationErrors();
```

### ClearAllValidationErrors

バリデーションエラーをすべてクリアし、ストアから削除します。

#### _例_ 

```js
const { clearAllValidationErrors } = dispatch( validationStore );
clearAllValidationErrors();
```

## セレクタ

### getValidationError( errorId )

バリデーションエラーを返します。

#### _Parameters_ 

-   _errorId_ `string`: 検証エラーを取得するためのエラー ID。

#### _Returns_

-   `object`: メッセージ `string` と _hidden_ `boolean` を含むオブジェクト。

#### _例_ 

```js
const store = select( validationStore );
const billingFirstNameError = store.getValidationError( 'billing-first-name' );
```

### getValidationErrorId( errorId )

HTML で使用するバリデーションエラー ID を取得します。 CSS セレクタとして使用したり、エラーメッセージを参照したりすることができます。ただし、バリデーションエラーに `hidden` が true に設定されているか、 バリデーションエラーがストアに存在しない場合はこの限りではありません。

#### _Parameters_ 

-   _errorId_ `string`: バリデーションエラーIDを取得するためのエラー ID。

#### _Returns_

-   `string`: HTML で使用するバリデーションエラー ID。

#### _例_ 

```js
const store = select( validationStore );
const billingFirstNameErrorId =
	store.getValidationErrorId( 'billing-first-name' );
```

### バリデーションエラー

ストア内のすべてのバリデーションエラーを返します。

#### _Returns_

-   `Record<string, FieldValidationStatus>`: キーがエラー ID で値が _message_ `string`と _hidden_ `boolean` を含む FieldValidationStatus オブジェクトであるすべての検証エラー。

#### _例_ 

```js
const store = select( validationStore );
const allValidationErrors = store.getValidationErrors();
```

### hasValidationErrors

バリデーションエラーが発生した場合はtrueを返し、そうでない場合は false を返します。

#### _Returns_

-   `boolean`: バリデーションエラーが発生したかどうか。

#### _例_ 

```js
const store = select( validationStore );
const hasValidationErrors = store.hasValidationErrors();
```
