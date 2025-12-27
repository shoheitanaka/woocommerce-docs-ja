---
sidebar_label: Integrating Protection with the Checkout Block
sidebar_position: 6
---
# チェックアウトブロックとプロテクションの統合

もしあなたがCaptchaや詐欺防止プラグインの開発者なら、あなたのソリューションが[Store API](/docs/apis/store-api/)にフックし、チェックアウトブロックと統合していることを確認してください。このチュートリアルでは、WooCommerceチェックアウトブロックに保護メカニズムを追加する手順を説明します。

## 概要

WooCommerceチェックアウトブロックは注文を処理するために[Store API](/docs/apis/store-api/)を使用します。CAPTCHAや詐欺検出のような保護メカニズムを統合するには、次のことが必要です：

1. **WordPressのブロックフィルタを使用して、チェックアウトブロックに保護要素**をレンダリングします。
2. **チェックアウトデータストアを使用して、クライアントサイドのバリデーション**を処理します。
3. **ストアAPI認証フックを使用して、サーバー側でバリデーションを行います。

## ステップ1：プロテクション・エレメントのレンダリング

最初のステップは、チェックアウトブロックにCAPTCHAまたは保護要素をレンダリングすることです。`render_block`フィルタを使用して、特定のチェックアウトブロックの前後にHTMLを挿入することができます。

### render_block フィルタの使用

`render_block`フィルタを使うと、WordPressブロックの出力を変更することができます。チェックアウトブロックの場合は、「注文する」ボタンを含む`woocommerce/checkout-actions-block`をターゲットにします。

```php
add_filter(
    'render_block_woocommerce/checkout-actions-block',
    function( $block_content ) {
        ob_start();
        ?>
        <div class="my-captcha-element" data-sitekey="<?php echo esc_attr( get_option( 'plugin_captcha_sitekey' ) ); ?>">
        </div>
        <?php
        echo $block_content;
        $block_content = ob_get_contents();
        ob_end_clean();
        return $block_content;
    },
    999,
    1
);
```

**このコードに関する重要なポイント:**。

-   フィルタの対象は`woocommerce/checkout-actions-block`で、これは注文ボタンを含むブロックです。
-   優先順位は `999` で、他の修正よりも後にコンテンツが追加されるようにしています。
-   `data-sitekey`属性はCAPTCHAの設定を保存しますが、プラグインによって異なる場合があります。
-   元のブロック・コンテンツの後に保護要素を追加します。

## ステップ2：クライアント側の統合

保護要素がレンダリングされたら、チェックアウトデータストアと統合して、バリデーショントークンを取得し、サーバーに渡す必要があります。

### チェックアウト・データ・ストアの使用

チェックアウト・ブロックはデータ・ストアを使用して状態を管理します。`setExtensionData`メソッドを使用して、保護トークンをサーバーに渡すことができます。

```js
/* Woo Checkout Block */
document.addEventListener( 'DOMContentLoaded', function () {
	if ( wp && wp.data ) {
		var unsubscribe = wp.data.subscribe( function () {
			const turnstileItem = document.querySelector(
				'.my-captcha-element'
			);

			if ( turnstile && turnstileItem ) {
				turnstile.render( turnstileItem, {
					sitekey: turnstileItem.dataset.sitekey,
					callback: function ( data ) {
						wp.data
							.dispatch( 'wc/store/checkout' )
							.setExtensionData( 'plugin-namespace-turnstile', {
								token: data,
							} );
					},
				} );

				unsubscribe();
			}
		}, 'wc/store/cart' );
	}
} );
```

**このJavaScriptについてのキーポイント：**。

-   カートのデータストアにサブスクライブして、チェックアウトの準備ができたことを検出します。
-   `turnstile.render()`メソッドはCAPTCHAを初期化します。
-   `setExtensionData()` はトークンをチェックアウトデータストアに保存します。
-   名前空間はあなたのプラグインに固有のものにしてください (例: `my-plugin-turnstile`)

### データストアの統合

チェックアウトデータストアと利用可能なメソッドの詳細については、[チェックアウトデータストアのドキュメント](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/data-store/checkout.md)を参照してください。

## ステップ3：サーバーサイドの検証

最も重要なステップは、サーバ側で保護トークンを検証することである。これは、不正なチェックアウトの試みを防ぐために、認証プロセスの早い段階で行う必要があります。

### コアの`rest_authentication_errors`フィルターを使う

[`rest_authentication_errors`](https://developer.wordpress.org/reference/hooks/rest_authentication_errors/)フィルタは、チェックアウト処理が始まる前に実行されるため、プロテクトトークンを検証するのに理想的な場所です。

```php
add_filter( 'rest_authentication_errors', 'plugin_check_turnstile_token' );

function plugin_check_turnstile_token( $result ) {
    // Skip if this is not a POST request.
    if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] !== 'POST' ) {
        // Always return the result or an error, never a boolean. This ensures other checks aren't thrown away like rate limiting or authentication.
        return $result;
    }

    // Skip if this is not the checkout endpoint.
    if ( ! preg_match( '#/wc/store(?:/v\d+)?/checkout#', $GLOBALS['wp']->query_vars['rest_route'] ) ) {
        return $result;
    }

    // get request body
    $request_body = json_decode( \WP_REST_Server::get_raw_data(), true );

    if ( isset( $request_body['payment_method'] ) ) {
        $chosen_payment_method = sanitize_text_field(  $request_body['payment_method'] );

        // Provide ability to short circuit the check to allow express payments or hosted checkouts to bypass the check.
        $selected_payment_methods = apply_filters(  'plugin_payment_methods_to_skip', array('woocommerce_payments' ) );
        if( is_array( $selected_payment_methods ) ) {
            if ( in_array( $chosen_payment_method, $selected_payment_methods, true ) ) {
                return $result;
            }
        }
    }

    $extensions = $request_body['extensions'];
    if ( empty( $extensions ) || ! isset( $extensions['plugin-namespace-turnstile'] ) ) {
        return new WP_Error( 'challenge_failed', 'Captcha challenge failed' );
    }
    $token = sanitize_text_field( $extensions['plugin-namespace-turnstile']['token'] );

    /**
     * Note: The function `my_token_check_function` would be
     * implemented in your plugin to handle token validation.
     **/
    $check = my_token_check_function( $token );
    $success = $check['success'];

    if( $success !== true ) {
        return new WP_Error( 'challenge_failed', 'Captcha challenge failed' );
    }

    return $result;
}
```

**サーバーサイド・バリデーションに関する重要なポイント:**.

-   チェックアウトエンドポイントへの POST リクエストを特にチェックします。
-   保護トークンは`$request_body['extensions']['your-namespace']`でアクセスされます。
-   他の認証チェックと干渉しないように、常に`$result`パラメータを返す
-   認証に失敗した場合は `WP_Error` オブジェクトを返す
-   特定の支払い方法でプロテクションをバイパスできるようにする（例：エクスプレスペイメント）。

## 重要なお知らせ

### セキュリティに関する考察

1. **常にサーバー側で検証する** - クライアント側の検証はバイパスできる
2. **保護トークンは安全に送信されるべきである。
3. **レート制限** - 保護エンドポイントに[レート制限](/docs/apis/store-api/rate-limiting/)を実装することを検討してください。
4. **トークンの有効期限** - 保護トークンに適切な有効期限があることを確認してください。

### 統合のテスト

プロテクションの統合をテストする場合：

1.チェックアウトブロックを有効にしてテスト
2.トークンが提供されない場合にバリデーションが失敗することを確認する
3.異なる支払い方法でテストする
4.保護機能が正当なチェックアウトのフローを妨げないことを確認する。
