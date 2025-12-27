---
post_title: WooCommerce Payment Token API
sidebar_label: Payment Token API
---
# WooCommerce Payment Token API

WooCommerce 2.6では、ゲートウェイ用の支払いトークンを保存および管理するためのAPIが導入されました。ユーザーはアカウント設定からこれらのトークンを管理し、チェックアウト時に保存された支払いトークンから選択することもできます。

このガイドでは、新しいAPIを使用するためのいくつかの便利なチュートリアルと、利用可能なすべての様々な方法を提供しています。

## チュートリアル

### ゲートウェイにペイメントトークンAPIサポートを追加する

これらの例では、Simplify Commerceゲートウェイを使用します。

#### ステップ0：正しいゲートウェイベースの拡張

WooCommerceにはゲートウェイ用の2つの基本クラスが同梱されています。これらのクラスは2.6でトークンAPIと共に導入されました。これらは`WC_Payment_Gateway_CC`（クレジットカードベースのトークン用）と`WC_Payment_Gateway_eCheck`（eCheckベースのトークン用）です。これらは、チェックアウト時に支払いフォームを生成するための便利なコードを含んでおり、うまくいけばほとんどのケースをカバーできるはずです。

これらのクラスがどちらも使えない場合は、`WC_Payment_Gateway` クラスを継承して独自のゲートウェイ・ベースを実装することもできます。

シンプリファイではクレジットカードを扱っているため、クレジットカードのゲートウェイを拡張しています。

`class WC_Gateway_Simplify_Commerce extends WC_Payment_Gateway_CC`。

#### ステップ1：「サポート」配列

ゲートウェイがトークン化をサポートしていることをWooCommerceに伝える必要があります。他のゲートウェイの機能のように、これはゲートウェイの`__construct`で`supports`と呼ばれる配列で定義されます。

これがシンプリファイ配列だ：

```php
$this->supports = array(
    'subscriptions',
    'products',
    ...
    'refunds',
    'pre-orders',
);
```

この配列に`tokenization`を追加する。

#### ステップ2：「マイアカウント」から新しい支払い方法を追加・保存する方法を定義する

my accounts "セクションから新しい支払い方法を追加する際に実行されるフォームハンドラは、ゲートウェイの`add_payment_method`メソッドを呼び出します。

`add_payment_method`は、`result`文字列と`redirect`URLの2つのキーを持つ配列を返すことが期待されています：

```php
array(
   'result'   => 'success', // or 'failure'
   'redirect' => wc_get_endpoint_url( 'payment-methods' ),
);
```

検証（必要なトークンとデータが決済プロバイダから提供されていることを確認すること）が完了したら、以下のクラスのインスタンスを作成して新しいトークンの作成を開始できます：`WC_Payment_Token_CC`または`WC_Payment_Token_eCheck`です。ゲートウェイと同様に、必要に応じて抽象クラスである`WC_Payment_Token`を拡張し、独自のトークン型を定義することもできます。これら3つのクラスとそのメソッドの詳細については、このドキュメントのさらに下を参照してください。

Simplifyはクレジットカードを使うので、クレジットカードクラスを使います。

`$token = new WC_Payment_Token_CC();`。

トークンに関する情報を渡すために、さまざまな`set_`メソッドを使用します。まず最初に、トークンの文字列とゲートウェイIDを渡して、トークンをSimplifyに関連付けることができるようにします。

```php
$token->set_token( $token_string );
$token->set_gateway_id( $this->id ); // `$this->id` references the gateway ID set in `__construct`
```

この時点で、トークンと一緒に保存したいその他の必要な情報を設定できる。クレジットカードには、カードの種類（ビザ、マスターカードなど）、カード番号の下4桁、有効期限月、有効期限年が必要です。

```php
$token->set_card_type( 'visa' );
$token->set_last4( '1234' );
$token->set_expiry_month( '12' );
$token->set_expiry_year( '2018' );
```

ほとんどの場合、トークンを特定のユーザーに関連付けることもできます：

`$token->set_user_id( get_current_user_id() );`。

最後に、トークン・オブジェクトが構築されたら、トークンをデータベースに保存します。

`$token->save();`。

Saveは、トークンが正常に保存された場合は`true`を返し、（フィールドが見つからないなどの）エラーが発生した場合は`false`を返します。

#### ステップ3：チェックアウト時に方法を保存する

WooCommerceはまた、顧客が「マイアカウント」に加えてチェックアウトプロセス中に新しい支払いトークンを保存することができます。これを正しく動作させるには、ゲートウェイの`process_payment`関数にコードを追加する必要があります。

口座に保存」チェックボックスが選択されている場合、`true`を返すはずです。

`wc-{$gateway_id}-new-payment-method`。

ユーザーに提供されるトークンを以前に保存している場合、`wc-{$gateway_id}-payment-token`の値`new`を見て、「新しいカードを使用する」/「新しい支払い方法を使用する」ラジオボタンが選択されていることを確認することもできます。

トークンを保存すべきことがわかったら、ステップ2と同じように`set_`メソッドと`save`メソッドを使ってトークンを保存することができます。

#### ステップ4：支払い処理時にトークンを取得する

ユーザーがトークンを選択した場合、ゲートウェイで支払いを処理する際に保存されたトークンを取得する必要があります。これも `process_payment` メソッドで行う必要があります。

以下のような条件を使って、既存のトークンを使うべきかどうかをチェックできる：

`if ( isset( $_POST['wc-simplify_commerce-payment-token'] ) && 'new' !== $_POST['wc-simplify_commerce-payment-token'] ) {`。

`wc-{$gateway_id}}-payment-token`は選択されたトークンのIDを返します。

その後、ta IDからトークンをロードすることができます（このdocの後の方でWC_Payment_Tokensクラスについて詳しく説明します）：

```php
$token_id = wc_clean( $_POST['wc-simplify_commerce-payment-token'] );
$token    = WC_Payment_Tokens::get( $token_id );
```

これは、ロードされたトークンが現在のユーザに属しているかどうかをチェックするものではありません。単純なチェックで可能です：

```php
// Token user ID does not match the current user... bail out of payment processing.
if ( $token->get_user_id() !== get_current_user_id() ) {
    // Optionally display a notice with `wc_add_notice`
    return;
}
```

トークンをロードし、必要なチェックを行ったら、次のようにして実際のトークン文字列を取得します。
`$token->get_token()`を使用します。

### 新しいトークン・タイプの作成

抽象的な WC_Payment_Token クラスを拡張し、新しいトークン・タイプを作成することができます。この場合、いくつか含める必要があるものがあります。

#### ステップ 0: WC_Payment_Token を拡張し、タイプに名前を付ける

WC_Payment_Tokenを拡張し、新しいタイプの名前を指定することから始めましょう。eCheckトークンクラスはWooCommerceのコアに搭載されている最も基本的なトークンタイプなので、どのように構築されるかを見ていきます。

素のトークン・ファイルは次のようなものだ：

```php
class WC_Payment_Token_eCheck extends WC_Payment_Token {

    /** @protected string Token Type String */
    protected $type = 'eCheck';

}
```

このトークン・タイプの名前は「eCheck」です。`$type`で指定される値は、クラス名と一致する必要があります(例: `WC_Payment_Token_$type`)。

#### ステップ1：検証メソッドの提供

トークンがデータベースに保存される前に、いくつかの基本的なバリデーションが実行されます。`WC_Payment_Token`は、上で定義した`$type`と同様に、実際のトークン値が設定されていることを確認します。その他のデータ（例えばeチェックでは下4桁の数字が必要です）や長さ（有効期限月は2文字です）を検証したい場合は、独自の`validate()`メソッドを用意してください。

Validateは、何も問題がなければ`true`を返し、何も問題がなければfalseを返すべきである。

独自のロジックを追加する前に、必ず`WC_Payment_Token`のvalidateメソッドを呼び出してください。

```php
public function validate() {
    if ( false === parent::validate() ) {
	       return false;
	}
```

これで、「下4桁」にロジックを加えることができる。

```php
if ( ! $this->get_last4() ) {
    return false;
}
```

最後に、`validate()`メソッドの終わりまで到達したらtrueを返す。

```php
    return true;
}
```

#### ステップ2：追加データ用に`get_`と`set_`メソッドを用意する

公開したいデータごとに独自のメソッドを追加できるようになった。便利な関数が用意されているので、データの保存や取り出しが簡単にできる。すべてのデータはメタ・テーブルに保存されるので、独自のテーブルを作成したり、既存のテーブルに新しいフィールドを追加したりする必要はありません。

取り込みたいデータごとに`get_`と`set_`メソッドを用意してください。eチェックの場合、これは小切手の下4桁を表す "last4 "です。

```php
public function get_last4() {
    return $this->get_meta( 'last4' );
}

public function set_last4( $last4 ) {
    $this->add_meta_data( 'last4', $last4, true );
}
```

以上である！これらのメタ関数は[WC_Data](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/abstracts/abstract-wc-data.php)によって提供されています。

#### ステップ3：新しいトークン・タイプを使用する

新しいトークン・タイプは、新しいトークンを構築する際に直接使用することができます。

```php
`$token = new WC_Payment_Token_eCheck();`
// set token properties
$token->save()
```

または、`WC_Payment_Tokens::get( $token_id )`を使用した場合に返される。

## Classes

### WC_Payment_Tokens

このクラスは、ペイメントトークンとやりとりするための一連の便利なメソッドを提供します。すべてのメソッドは静的で、クラスのインスタンスを作成せずに呼び出すことができます。

#### get_customer_tokens( $customer_id, $gateway_id = '' )

`$customer_id`で指定された顧客のトークン・オブジェクトの配列を返します。ゲートウェイIDを指定することで、ゲートウェイでフィルタリングすることもできます。

```php
// Get all tokens for the current user
$tokens = WC_Payment_Tokens::get_customer_tokens( get_current_user_id() );
// Get all tokens for user 42
$tokens = WC_Payment_Tokens::get_customer_tokens( 42 );
// Get all Simplify tokens for the current user
$tokens = WC_Payment_Tokens::get_customer_tokens( get_current_user_id(), 'simplify_commerce' );
```

#### get_customer_default_token( $customer_id )

default'（チェックアウト時に自動的に選択されるトークン）としてマークされたトークンのトークンオブジェクトを返します。ユーザがデフォルトトークンを持たない場合、この関数は null を返します。

```php
// Get default token for the current user
$token = WC_Payment_Tokens::get_customer_default_token( get_current_user_id() );
// Get default token for user 520
$token = WC_Payment_Tokens::get_customer_default_token( 520 );
```

#### get_order_tokens( $order_id )

注文には、支払いトークンを関連付けることができます（定期購入商品や更新時などに便利です）。この関数でトークンの一覧を取得できます。別の方法として、`WC_Order` の '`get_payment_tokens()` 関数を使用して同じ結果を得ることもできます。

```php
// Get tokens associated with order 25
$tokens = WC_Payment_Tokens::get_order_tokens( 25 );
// Get tokens associated with order 25, via WC_Order
$order = wc_get_order( 25 );
$tokens =  $order->get_payment_tokens();
```

#### get( $token_id )

指定された `$token_id` に対応する単一の支払いトークン・オブジェクトを返します。

```php
// Get payment token 52
$token = WC_Payment_Tokens::get( 52 );
```

#### delete( $token_id )

指定されたトークンを削除します。

```php
// Delete payment token 52
WC_Payment_Tokens::delete( 52 );
```

#### set_users_default( $user_id, $token_id )

指定されたトークン(`$token_id`)を指定されたユーザー(`$user_id`)のデフォルト・トークンにします。現在デフォルトに設定されているトークンが削除され、新しいトークンが設定されることを確認します。

```php
// Set user 17's default token to token 82
WC_Payment_Tokens::set_users_default( 17, 82 );
```

#### get_token_type_by_id( $token_id )

トークンのIDは持っているが、そのトークンの種類（クレジットカード、eチェック、...）がわからない場合に、この関数を使用することができます。

```php
// Find out that payment token 23 is a cc/credit card token
$type = WC_Payment_Tokens::get_token_type_by_id( 23 );
```

### WC_Payment_Token_CC

`set_`メソッドはデータベース内のトークンを更新しません。`save()`、`create()`（新しいトークンのみ）、`update()`（既存のトークンのみ）を呼び出す必要があります。

#### validate()

クレジットカード・トークンの下4桁、有効期限年（YYYY形式）、有効期限月（MM形式）、カード・タイプ、実際のトークンが保存されていることを確認する。

```php
$token = new WC_Payment_Token_CC();
$token->set_token( 'token here' );
$token->set_last4( '4124' );
$token->set_expiry_year( '2017' );
$token->set_expiry_month( '1' ); // incorrect length
$token->set_card_type( 'visa' );
var_dump( $token->validate() ); // bool(false)
$token->set_expiry_month( '01' );
var_dump( $token->validate() ); // bool(true)
```

#### get_card_type()

カードの種類（ビザ、マスターカードなど）を確認する。

```php
$token = WC_Payment_Tokens::get( 42 );
echo $token->get_card_type();
```

#### set_card_type( $type )

クレジットカードタイプを設定します。これはフリーフォームのテキストフィールドですが、以下の値を使用することができ、WooCommerceはフォーマットされたラベルを表示します。 新しいラベルは`woocommerce_credit_card_type_labels`フィルタを使用して追加することができます。

```php
$token = WC_Payment_Tokens::get( 42 );
$token->set_last4( 'visa' );
echo $token->get_card_type(); // returns visa
```

対応タイプ／ラベル：

```php
array(
	'mastercard'       => __( 'MasterCard', 'woocommerce' ),
	'visa'             => __( 'Visa', 'woocommerce' ),
	'discover'         => __( 'Discover', 'woocommerce' ),
	'american express' => __( 'American Express', 'woocommerce' ),
	'diners'           => __( 'Diners', 'woocommerce' ),
	'jcb'              => __( 'JCB', 'woocommerce' ),
) );
```

#### get_expiry_year()

カードの有効期限を確認する。

```php
$token = WC_Payment_Tokens::get( 42 );
echo $token->get_expiry_year;
```

#### set_expiry_year( $year )

カードの有効期限を設定する。YYYY形式。

```php
$token = WC_Payment_Tokens::get( 42 );
$token->set_expiry_year( '2018' );
echo $token->get_expiry_year(); // returns 2018
```

#### get_expiry_month()

カードの有効期限を確認する。

```php
$token = WC_Payment_Tokens::get( 42 );
echo $token->get_expiry_month();
```

#### set_expiry_month( $month )

カードの有効期限月を設定する。MM形式。

```php
$token = WC_Payment_Tokens::get( 42 );
$token->set_expiry_year( '12' );
echo $token->get_expiry_month(); // returns 12
```

#### get_last4()

保存されているクレジットカード番号の下4桁を取得する。

```php
$token = WC_Payment_Tokens::get( 42 );
echo $token->get_last4();
```

#### set_last4( $last4 )

保存されているクレジットカード番号の下4桁を設定します。

```php
$token = WC_Payment_Tokens::get( 42 );
$token->set_last4( '2929' );
echo $token->get_last4(); // returns 2929
```

### WC_Payment_Token_eCheck

`set_`メソッドはデータベース内のトークンを更新しません。`save()`、`create()`（新しいトークンのみ）、`update()`（既存のトークンのみ）を呼び出す必要があります。

#### validate()

eCheckトークンには、実際のトークンと同様に下4桁が保存されていることを確認します。

```php
$token = new WC_Payment_Token_eCheck();
$token->set_token( 'token here' );
var_dump( $token->validate() ); // bool(false)
$token->set_last4( '4123' );
var_dump( $token->validate() ); // bool(true)
```

#### get_last4()

保存されている口座番号の下4桁を取得する。

```php
$token = WC_Payment_Tokens::get( 42 );
echo $token->get_last4();
```

#### set_last4( $last4 )

保存されているクレジットカード番号の下4桁を設定します。

```php
$token = WC_Payment_Tokens::get( 42 );
$token->set_last4( '2929' );
echo $token->get_last4(); // returns 2929
```

### WC_Payment_Token

`WC_Payment_Token`を直接使うべきではありません。バンドルされているトークン・クラス（クレジットカード用の`WC_Payment_Token_CC`と`WC_Payment_Token_eCheck`）のいずれかを使用してください。どちらも使えない場合は、このクラスを拡張することができます。このセクションで定義されているすべてのメソッドは、これらのクラスで使用できます。

`set_`メソッドはデータベース内のトークンを更新しません。`save()`、`create()`（新しいトークンのみ）、`update()`（既存のトークンのみ）を呼び出す必要があります。

#### get_id()

トークンのIDを取得する。

```php
// Get the token ID for user ID 26's default token
$token = WC_Payment_Tokens::get_customer_default_token( 26 );
echo $token->get_id();
```

#### get_token()

実際のトークン文字列を取得します (支払いプロセッサーとの通信に使用されます)。

```php
$token = WC_Payment_Tokens::get( 49 );
echo $token->get_token();
```

#### set_token( $token )

トークン文字列を設定します。

```php
// $api_token comes from an API request to a payment processor.
$token = WC_Payment_Tokens::get( 42 );
$token->set_token( $api_token );
echo $token->get_token(); // returns our token
```

#### get_type()

トークンの種類を取得します。CCまたはeチェック。新しく導入されたタイプも返されます。

```php
$token = WC_Payment_Tokens::get( 49 );
echo $token->get_type();
```

#### get_user_id()

トークンに関連付けられたユーザーIDを取得します。

```php
$token = WC_Payment_Tokens::get( 49 );
if ( $token->get_user_id() === get_current_user_id() ) {
    // This token belongs to the current user.
}
```

#### set_user_id( $user_id )

トークンをユーザーに関連付ける。

```php
$token = WC_Payment_Tokens::get( 42 );
$token->set_user_id( '21' ); // This token now belongs to user 21.
echo $token->get_last4(); // returns 2929
```

#### ゲートウェイID

トークンに関連付けられたゲートウェイを取得します。

```php
$token = WC_Payment_Tokens::get( 49 );
$token->get_gateway_id();
```

#### set_gateway_id( $gateway_id )

トークンに関連付けられたゲートウェイを設定します。これは、ゲートウェイで定義されている「ID」と一致する必要があります。例えば、'simplify_commerce' は core の Simplify 実装の ID です。

```php
$token->set_gateway_id( 'simplify_commerce' );
echo $token->get_gateway_id();
```

#### is_default()

トークンがユーザのデフォルトとしてマークされている場合、trueを返します。デフォルトトークンはチェックアウト時に自動選択されます。

```php
$token = WC_Payment_Tokens::get( 42 ); // Token 42 is a default token for user 3
var_dump( $token->is_default() ); // returns true
$token = WC_Payment_Tokens::get( 43 ); // Token 43 is user 3's token, but not default
var_dump( $token->is_default() ); // returns false
```

#### set_default( $is_default )

トークンの「デフォルト」フラグを切り替えます。trueを渡すとデフォルトに設定され、falseを渡すと別のトークンに設定されます。これは、デフォルトとして設定されている他のトークンをアンセットすることは **しません** 。代わりに `WC_Payment_Tokens::set_users_default()` を使ってそれを処理することができます。

```php
$token = WC_Payment_Tokens::get( 42 ); // Token 42 is a default token for user 3
var_dump( $token->is_default() ); // returns true
$token->set_default( false );
var_dump( $token->is_default() ); // returns false
```

#### validate()

トークンとトークン・タイプ（CC、eCheck、...）の両方が存在することを確認するチェックを行います。使い方は`WC_Payment_Token_CC::validate()`または`WC_Payment_Token_eCheck::validate()`を参照。

#### read( $token_id )

既存のトークン・オブジェクトをデータベースからロードします。この関数のエイリアスである `WC_Payment_Tokens::get()` を参照してください。

```php
// Load a credit card toke, ID 55, user ID 5
$token = WC_Payment_Token_CC();
$token->read( 55 );
echo $token->get_id(); // returns 55
echo $token->get_user_id(); // returns 5
```

#### update()

既存のトークンを更新します。これは変更されたフィールド(`set_`関数)を受け取り、実際にデータベースに保存します。成功に応じてtrueまたはfalseを返します。

```php
$token = WC_Payment_Tokens::get( 42 ); // credit card token
$token->set_expiry_year( '2020' );
$token->set_expiry_month( '06 ');
$token->update();
```

#### create()

これは、データベースに新しいトークンを作成します。つまり、一度ビルドすると、create() はその詳細を含む新しいトークンをデータベースに作成します。成功に応じて true または false を返します。

```php
$token = new WC_Payment_Token_CC();
// set last4, expiry year, month, and card type
$token->create(); // save to database
```

#### save()

`save()`は、`update()`と`create()`の代わりに使用できます。既存のトークンを使用している場合、`save()`は`update()`を呼び出します。新しいトークンは `create()` を呼び出します。成功に応じてtrueまたはfalseを返します。

```php
// calls update
$token = WC_Payment_Tokens::get( 42 ); // credit card token
$token->set_expiry_year( '2020' );
$token->set_expiry_month( '06 ');
$token->save();
// calls create
$token = new WC_Payment_Token_CC();
// set last4, expiry year, month, and card type
$token->save();
```

#### 削除()

データベースからトークンを削除します。

```php
$token = WC_Payment_Tokens::get( 42 );
$token->delete();
```
