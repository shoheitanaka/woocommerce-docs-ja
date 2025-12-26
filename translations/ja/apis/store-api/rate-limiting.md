---
sidebar_label: Rate Limiting
sidebar_position: 4
---

# ストアAPIエンドポイントのレート制限 

[レート制限](https://github.com/woocommerce/woocommerce-blocks/pull/5962)は、ストアAPIエンドポイントで使用できます。これはオプションで、デフォルトでは無効になっています。以下の手順](#rate-limiting-options-filter)に従って有効にすることができます。

主な目的は、過剰な呼び出しによるエンドポイントの不正使用と、ストアを実行しているマシンのパフォーマンス低下を防ぐことである。

レートリミットのトラッキングは、`USER ID` (ログイン中)、`IP ADDRESS` (認証されていないリクエスト)、またはフィンガープリントとグループ化するために定義されたフィルタロジックのいずれかによって制御されます。

また、プロキシやロードバランサーなどの背後で実行するための標準サポートも提供している。これもオプションで、デフォルトでは無効になっている。

## UIコントロール

現在のところ、この機能は`woocommerce_store_api_rate_limit_options`フィルターを通してのみ制御できます。UIで制御するには、以下のコミュニティプラグインをご利用ください：[Rate [Limiting UI for WooCommerce](https://wordpress.org/plugins/rate-limiting-ui-for-woocommerce/).

#チェックアウト率制限

WooCommerce -&gt; Settings -&gt; Advanced -&gt; Featuresで「Rate limiting Checkout block and Store API」を有効にすることで、UIからCheckout place orderと`POST /checkout`エンドポイントのみレート制限を有効にすることができます。

UIで有効にすると、レート制限は`POST /checkout`およびチェックアウトブロックの注文フローにのみ適用されます。制限は60秒あたり最大3リクエストまでです。

## リミット情報

デフォルトでは、10秒間に最大25リクエストが可能である。これらは[options filter](#rate-limiting-options-filter)で変更できます。

## レート制限によって制限されるメソッド

`POST`リクエストだけがレート制限される。`X-HTTP-Method-Override`ヘッダーを使用したリクエスト(`PUT`や `wp.apiFetch`経由で送られた`PATCH`リクエストなど)はレート制限の対象外となります。

## レート制限オプションフィルター

レート制限のオプションを設定するためのフィルターが用意されている：

```php
add_filter( 'woocommerce_store_api_rate_limit_options', function() {
	return [
		'enabled' => false, // enables/disables Rate Limiting. Default: false
		'proxy_support' => false, // enables/disables Proxy support. Default: false
		'limit' => 25, // limit of request per timeframe. Default: 25
		'seconds' => 10, // timeframe in seconds. Default: 10
	];
} );
```

## プロキシ標準サポート

ストアがプロキシ、ロードバランサー、キャッシュサービス、CDNなどの後ろで動作している場合、IPによるキーイング制限は、標準的なIPフォワーディングヘッダーによってサポートされます：

* `X_REAL_IP`|`CLIENT_IP` _リクエストの発信元IPの取得を簡略化する、一般的なカスタム実装__ `X_FORWARDED_FOR` _発信元IPを特定するための事実上の標準ヘッダー、 [Document](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)
* __INLINE_CODE_2__ _発信元IPを特定するためのデファクトスタンダードヘッダー、 [ドキュメント](__URL_0__)_
* `X_FORWARDED` _[ドキュメント](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)、[RFC [7239](https://datatracker.ietf.org/doc/html/rfc7239)__。

デフォルトでは無効になっている。

## フィンガープリントのリクエストによるレート制限を有効にする

より高度なユースケースのために、カスタムフィンガープリントによるレート制限を有効にすることができます。
これにより、ログインしているユーザーIDやIPアドレスに依存せずにリクエストをグループ化するカスタム実装が可能になります。

### User-AgentとAccept-Languageの組み合わせでリクエストをグループ化するカスタム基本例

```php
add_filter( 'woocommerce_store_api_rate_limit_id', function() {
    $accept_language = isset( $_SERVER['HTTP_ACCEPT_LANGUAGE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_ACCEPT_LANGUAGE'] ) ) : '';
    
    return md5( wc_get_user_agent() . $accept_language );
} );
```

## 利用情報の観測可能性を制限する

現在のリミット情報は、カスタム・レスポンス・ヘッダで確認することができる：

* `RateLimit-Limit`_時間枠ごとの最大リクエスト数。
* `RateLimit-Remaining`現在のタイムフレームで利用可能なリクエスト数 _
* `RateLimit-Reset` _次のタイムフレームリセットのユニックスタイムスタンプ _
* `RateLimit-Retry-After` _リクエストが再びブロックされなくなるまでの秒数。制限に達した場合のみ表示されます。

### レスポンス・ヘッダの例

```http
RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 1654880642
RateLimit-Retry-After: 28
```

## トラッキング制限の乱用

これは、与えられたリクエストウィンドウのリクエストカウントを追跡するために、 追加の残りカラムを持つ修正されたwc_rate_limitテーブルを使用します。
カスタムアクション `woocommerce_store_api_rate_limit_exceeded` は、そのような不正を追跡するための拡張性のために実装されました。

### カスタムトラッキングの使用例

```php
add_action(
    'woocommerce_store_api_rate_limit_exceeded',
    function ( $offending_ip, $action_id ) { /* Custom tracking implementation */ }
);
```
