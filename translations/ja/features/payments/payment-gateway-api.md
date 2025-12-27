---
post_title: WooCommerce Payment Gateway API
sidebar_label: Payment Gateway API
---
# WooCommerce Payment Gateway API

WooCommerceの決済ゲートウェイはクラスベースで、従来のプラグインを通して追加することができます。このガイドではゲートウェイ開発の入門を提供します。

## 決済ゲートウェイの種類

ペイメントゲートウェイにはいくつかの種類がある：

1.  **フォームベース** - これは、ユーザーがフォーム上のボタンをクリックする必要があり、その後、ゲートウェイ自身のウェブサイト上の支払いプロセッサにリダイレクトされます。例PayPalスタンダード、Authorize.net DPM
2.  **iFrameベース** - これは、ゲートウェイの決済システムがあなたのストアのiframe内にロードされる場合です。例SagePayフォーム、PayPalアドバンスド
3.  **ダイレクト** - これは、支払いフィールドがチェックアウトページに直接表示され、'注文する'が押されたときに支払いが行われる場合です。例PayPal Pro、Authorize.net AIM
4.  **オフライン** - オンライン決済は行われません。例小切手、銀行振込

フォームとiFrameベースのゲートウェイは、データをオフサイトにポストするため、考えるべきセキュリティの問題が少なくなります。しかし、ダイレクト・ゲートウェイは、サーバー・セキュリティ（[SSL証明書](https://woocommerce.com/document/ssl-and-https/)など）を実装する必要があり、また、[PCIコンプライアンス](https://woocommerce.com/document/pci-dss-compliance-and-woocommerce/)のレベルが必要になる場合もあります。

## 基本的な決済ゲートウェイの作成

**注意:** 以下の説明はデフォルトのチェックアウトページのためのものです。新しいチェックアウトブロックにカスタム支払い方法を追加したい場合は、[支払い方法統合ドキュメント](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/checkout-payment-methods/payment-method-integration)をチェックしてください。

ペイメントゲートウェイはWooCommerceにフックする追加プラグインとして作成する必要があります。プラグインの内部では、プラグインがロードされた後にクラスを作成する必要があります。例

```php
add_action( 'plugins_loaded', 'init_your_gateway_class' );
```

ゲートウェイクラスがWooCommerceのベースゲートウェイクラスを継承していることも重要で、重要なメソッドや[設定API](https://developer.woocommerce.com/docs/settings-api/)にアクセスできるようになります：

```php
function init_your_gateway_class() {
    class WC_Gateway_Your_Gateway extends WC_Payment_Gateway {}
}
```

APIドキュメントの[WC_Payment_Gatewayクラス](https://woocommerce.github.io/code-reference/classes/WC-Payment-Gateway.html)を参照してください。

クラスを定義するだけでなく、WooCommerce (WC) にその存在を知らせる必要があります。これは_woocommerce_payment_gateways_をフィルタリングすることで行います：

```php
function add_your_gateway_class( $methods ) {
    $methods[] = 'WC_Gateway_Your_Gateway';
    return $methods;
}
```

```php
add_filter( 'woocommerce_payment_gateways', 'add_your_gateway_class' );
```

### 必須メソッド

ほとんどのメソッドは WC_Payment_Gateway クラスから継承されていますが、いくつかはカスタムゲートウェイで必要です。

#### __construct()

コンストラクター内で、以下の変数を定義する：

- `$this->id` - あなたのゲートウェイのユニークID、例えば'your_gateway'
- `$this->icon` - フロントエンドでゲートウェイの名前の横に画像を表示したい場合は、画像のURLを入力します。
- `$this->has_fields` - ブール値。チェックアウト時に支払いフィールドを表示したい場合、trueを設定します（直接統合する場合）。
- `$this->method_title` - 管理ページに表示される支払い方法のタイトル。
- `$this->method_description` - 管理ページに表示される支払い方法の説明。

コンストラクタは、設定フィールドも定義してロードする必要があります：

```php
$this->init_form_fields();
$this->init_settings();
```

`init_form_fields()`については後で説明するが、これは基本的に、`init_settings()`でロードされる設定を定義するものである。

`init_settings()`が呼ばれた後、設定を取得して変数にロードすることができる：

```php
$this->title = $this->get_option( 'title' );
```

最後に、設定の保存フックを追加する必要があります：

```php
add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
```

#### init_form_fields()

このメソッドを使用して、`$this->form_fields`を設定します - これらはゲートウェイ設定ページの管理画面に表示されるオプションで、[WC Settings API](https://developer.woocommerce.com/docs/settings-api/)を使用します。

ゲートウェイの基本的な設定は、_enabled_、_title_、_description_で構成されます：

```php
$this->form_fields = array(
    'enabled' => array(
        'title' => __( 'Enable/Disable', 'woocommerce' ),
        'type' => 'checkbox',
        'label' => __( 'Enable Cheque Payment', 'woocommerce' ),
        'default' => 'yes'
    ),
    'title' => array(
        'title' => __( 'Title', 'woocommerce' ),
        'type' => 'text',
        'description' => __( 'This controls the title which the user sees during checkout.', 'woocommerce' ),
        'default' => __( 'Cheque Payment', 'woocommerce' ),
        'desc_tip' => true,
    ),
    'description' => array(
        'title' => __( 'Customer Message', 'woocommerce' ),
        'type' => 'textarea',
        'default' => ''
    )
);
```

#### process_payment( $order_id )

さて、ゲートウェイの最も重要な部分である支払いの処理と注文の処理です。process_paymentはWCにユーザーをどこにリダイレクトするかも伝えます。

以下は、小切手ゲートウェイの process_payment 関数の例です：

```php
function process_payment( $order_id ) {
global $woocommerce;
$order = new WC_Order( $order_id );

    // Mark as on-hold (we're awaiting the cheque)
    $order->update_status('on-hold', __( 'Awaiting cheque payment', 'woocommerce' ));

    // Remove cart
    $woocommerce->cart->empty_cart();

    // Return thankyou redirect
    return array(
        'result' => 'success',
        'redirect' => $this->get_return_url( $order )
    );

}
```

おわかりのように、その仕事は次のようなものだ：

- 処理中の注文を取得して更新する
- 成功とリダイレクトURL（この場合はサンクスページ）を返す

小切手では、支払いが自動的に確認できないため、注文は保留状態になります。しかし、ダイレクトゲートウェイを構築している場合は、代わりにここで注文を完了させることができます。注文の支払いが完了したら、update_statusを使うのではなく、payment_completeを使うべきです：

```php
$order->payment_complete();
```

これにより、在庫削減が確実に行われ、ステータスが正しい値に変更される。

支払いに失敗した場合は、エラーをスローし、失敗ステータスを配列で返す：

```php
wc_add_notice( __('Payment error:', 'woothemes') . $error_message, 'error' );
return array(
    'result'   => 'failure'
);
```

WooCommerceはこのエラーをキャッチし、チェックアウトページに表示します。

在庫レベルはアクション（`woocommerce_payment_complete`および注文ステータス間の遷移）を介して更新されるため、支払い処理中に在庫レベルを下げるメソッドを手動で呼び出す必要はなくなりました。

### 注文ステータスの更新とメモの追加

注文ステータスの更新は、注文クラスの関数を使用して行うことができます。これは、注文ステータスが処理中でない場合にのみ行う必要があります (その場合は、payment_complete() を使用します)。カスタムステータスに更新する例は次のようになります：

```php
$order = new WC_Order( $order_id );
$order->update_status('on-hold', __('Awaiting cheque payment', 'woothemes'));
```

上記の例では、ステータスを保留に更新し、所有者に小切手待ちであることを知らせるメモを追加しています。注文ステータスを更新することなくメモを追加することができます; これはデバッグメッセージを追加するために使用されます：

```php
$order->add_order_note( __('IPN payment completed', 'woothemes') );
```

### 注文状況のベストプラクティス

- 注文は完了したが、管理者が手動で支払いを確認する必要がある場合は、**On-Hold**を使用します。
- 注文が失敗し、すでに作成されている場合、**Failed**に設定します。
- 支払いが完了した場合、ステータスはWooCommerceに任せ、`$order->payment_complete()`を使用します。WooCommerceは**Completed**または**Processing**ステータスを使用し、在庫を処理します。

## ダイレクトゲートウェイに関する注意事項

高度なダイレクトゲートウェイ（実際のチェックアウトページで支払いを受けるもの）を作成する場合、追加のステップが必要です。まず、ゲートウェイのコンストラクタで has_fields を true に設定する必要があります：

```php
$this->has_fields = true;
```

これは、次に定義する直接支払いフォームを含む'payment_box'を出力するようにチェックアウトに指示します。

`payment_fields()`というメソッドを作成する。

次に追加するオプションのメソッドは `validate_fields()` です。フォームのバリデーションに合格した場合はtrueを返し、不合格の場合はfalseを返します。エラーを追加してユーザーに表示したい場合は、 `wc_add_notice()` 関数を使用します。

最後に、`process_payment( $order_id )`メソッド内に支払いコードを追加する必要があります。これは投稿されたフォームデータを受け取り、支払いプロバイダーを通して直接支払いを試みます。

支払いに失敗した場合は、エラーを出力して失敗の配列を返す：

```php
wc_add_notice( __('Payment error:', 'woothemes') . $error_message, 'error' );
return array(
    'result'   => 'failure',
);
```

支払いが成功した場合は、注文を支払い済みとして設定し、成功の配列を返します：

```php
// Payment complete
$order->payment_complete();
```

```php
// Return thank you page redirect
return array(
    'result' => 'success',
    'redirect' => $this->get_return_url( $order )
);
```

## PayPal IPNのような決済ゲートウェイコールバックの処理

注文のステータスを伝えるためにストアにコールバックを行うゲートウェイを構築している場合、ゲートウェイ内でこれを処理するコードを追加する必要があります。

コールバックとコールバックハンドラを追加する最善の方法は、WC-APIフックを使用することです。例えば、PayPal Standardが行っているような方法です。コールバック/IPN URLを次のように設定します：

```php
str_replace( 'https:', 'http:', add_query_arg( 'wc-api', 'WC_Gateway_Paypal', home_url( '/' ) ) );
```

そして、そのハンドラーをフックにフックする：

```php
add_action( 'woocommerce_api_wc_gateway_paypal', array( $this, 'check_ipn_response' ) );
```

WooCommerceはあなたのゲートウェイを呼び出し、URLが呼び出されたときにアクションを実行します。

詳細は[WC_API - WooCommerce APIコールバック](https://woocommerce.com/document/wc_api-the-woocommerce-api-callback/)をご覧ください。

## ゲートウェイのフック

ゲートウェイクラス内にフックを追加してもトリガーされない可能性があることに注意することが重要です。ゲートウェイはチェックアウト時や管理画面の設定ページなど、必要なときにのみ読み込まれます。

クラスからWordPressのイベントにフックする必要がある場合は、フックをクラスの外に置くか、WC-APIを使用する必要があります。
