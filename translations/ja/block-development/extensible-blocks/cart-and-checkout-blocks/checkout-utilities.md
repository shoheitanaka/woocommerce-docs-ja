---
post_title: Checkout Utilities
sidebar_label: Checkout Utilities
---

# チェックアウトユーティリティ

`@woocommerce/blocks-checkout` から利用可能な、チェックアウト機能のためのユーティリティ関数とReactフック。

## `useValidateCheckout`

チェックアウトフォームのバリデーションを行い、最初のバリデーションエラーが見つかった場合は自動的にスクロールするフック。

このフックは主に `PlaceOrderButton` コンポーネントによって内部的に使用され、カスタム注文ボタンコンポーネントに `validate` プロップを提供します。しかし、必要に応じて直接使用することもできます。

```jsx
// Aliased import
import { useValidateCheckout } from '@woocommerce/blocks-checkout';

// Global import
// const { useValidateCheckout } = wc.blocksCheckout;

const MyComponent = () => {
    const validateCheckout = useValidateCheckout();

    const handleClick = async () => {
        const { hasError } = await validateCheckout();

        if ( hasError ) {
            // Validation failed - errors are automatically shown and
            // the page scrolls to the first error
            return;
        }

        // Validation passed - proceed with your logic
    };

    return <button onClick={ handleClick }>Validate</button>;
};
```

### 戻り値

このフックは、呼び出されたときに関数を返す：

1. `CHECKOUT_VALIDATION` イベントを発行し、登録されているすべての検証コールバックを実行する。
2. フィールドレベルのバリデーションエラーがないかバリデーションストアをチェックする
3. エラーが見つかった場合
    - すべての検証エラーを表示します。
    - スクロールして最初のエラー要素にフォーカスを当てる
4. `{ hasError: boolean }`に解決するプロミスを返します。

| プロパティ｜タイプ｜説明
|:-----------|:----------|:-------------------------------------------------|
| 検証失敗の場合は `hasError` | `boolean` | `true` 、合格の場合は `false` 。  |
