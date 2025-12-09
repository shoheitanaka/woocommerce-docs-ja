---
post_title: WooCommerce Payment Token API
sidebar_label: Payment Token API
---

# WooCommerce Payment Token API

WooCommerce 2.6では、ゲートウェイ用の支払いトークンを保存および管理するためのAPIが導入されました。ユーザーはアカウント設定からこれらのトークンを管理し、チェックアウト時に保存された支払いトークンから選択することもできます。

このガイドでは、新しいAPIを使用するためのいくつかの便利なチュートリアルと、利用可能なすべての様々な方法を提供しています。

## Tutorials

### Adding Payment Token API Support To Your Gateway

これらの例では、Simplify Commerceゲートウェイを使用します。

#### Step 0: Extending The Correct Gateway Base

WooCommerce ships with two base classes for gateways. These classes were introduced along with the Token API in 2.6. They  are `WC_Payment_Gateway_CC` (for credit card based tokens) and `WC_Payment_Gateway_eCheck` (for eCheck based tokens). They contain some useful code for generating payment forms on checkout and should hopefully cover most cases.

You can also implement your own gateway base by extending the abstract `WC_Payment_Gateway` class, if neither of those classes work for you.

シンプリファイではクレジットカードを扱っているため、クレジットカードのゲートウェイを拡張しています。

`class WC_Gateway_Simplify_Commerce extends WC_Payment_Gateway_CC`

#### Step 1: 'Supports' Array

We need to tell WooCommerce our gateway supports tokenization. Like other gateways features, this is defined in a gateway's `__construct` in an array called `supports`.

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

Add `tokenization` to this array.

#### Step 2: Define A Method For Adding/Saving New Payment Methods From "My Account"

The form handler that is run when adding a new payment method from the "my accounts" section will call your gateway's `add_payment_method` method.

Your `add_payment_method` is expected to return an array with two keys, a `result` string and a `redirect` url:

```php
array(
   'result'   => 'success', // or 'failure'
   'redirect' => wc_get_endpoint_url( 'payment-methods' ),
);
```

After any validation (i.e. making sure the token and data you need is present from the payment provider), you can start building a new token by creating an instance of one of the following classes: `WC_Payment_Token_CC` or `WC_Payment_Token_eCheck`. Like gateways, you can also extend the abstract `WC_Payment_Token` class and define your own token type type if necessary. For more information on all three of these classes and their methods, see further down below in this doc.

Simplifyはクレジットカードを使うので、クレジットカードクラスを使います。

`$token = new WC_Payment_Token_CC();`

We will use various `set_` methods to pass in information about our token. To start with we will pass the token string and the gateway ID so the token can be associated with Simplify.

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

`$token->set_user_id( get_current_user_id() );`

最後に、トークン・オブジェクトが構築されたら、トークンをデータベースに保存します。

`$token->save();`

Save will return `true` if the token was successfully saved, and `false` if an error occurred (like a missing field).

#### Step 3: Save Methods On Checkout

WooCommerce also allows customers to save a new payment token during the checkout process in addition to "my account". You'll need to add some code to your gateways `process_payment` function to make this work correctly.

To figure out if you need to save a new payment method you can check the following POST field which should return `true` if the "Save to Account" checkbox was selected.

`wc-{$gateway_id}-new-payment-method`

If you have previously saved tokens being offered to the user, you can also look at `wc-{$gateway_id}-payment-token` for the value `new` to make sure the "Use a new card" / "Use new payment method" radio button was selected.

Once you have found out that a token should be saved you can save a token in the same way you did in Step 2, using the `set_` and `save` methods.

#### Step 4: Retrieve The Token When Processing Payments

You will need to retrieve a saved token when processing a payment in your gateway if a user selects one. This should also be done in your `process_payment` method.

以下のような条件を使って、既存のトークンを使うべきかどうかをチェックできる：

`if ( isset( $_POST['wc-simplify_commerce-payment-token'] ) && 'new' !== $_POST['wc-simplify_commerce-payment-token'] ) {`

`wc-{$gateway_id}}-payment-token` will return the ID of the selected token.

その後、ta IDからトークンをロードすることができます（このdocの後の方でWC_Payment_Tokensクラスについて詳しく説明します）：

```php
$token_id = wc_clean( $_POST['wc-simplify_commerce-payment-token'] );
$token    = WC_Payment_Tokens::get( $token_id );
```

これは、ロードされたトークンが現在のユーザに属しているかどうかをチェックする ***ものではありません。単純なチェックで可能です：

```php
// Token user ID does not match the current user... bail out of payment processing.
if ( $token->get_user_id() !== get_current_user_id() ) {
    // Optionally display a notice with `wc_add_notice`
    return;
}
```

Once you have loaded the token and done any necessary checks, you can get the actual token string (to pass to your payment provider) by using
`$token->get_token()`.

### Creating A New Token Type

抽象的な WC_Payment_Token クラスを拡張し、新しいトークン・タイプを作成することができます。この場合、いくつか含める必要があるものがあります。

#### Step 0: Extend WC_Payment_Token And Name Your Type

WC_Payment_Tokenを拡張し、新しいタイプの名前を指定することから始めましょう。eCheckトークンクラスはWooCommerceのコアに搭載されている最も基本的なトークンタイプなので、どのように構築されるかを見ていきます。

素のトークン・ファイルは次のようなものだ：

```php
class WC_Payment_Token_eCheck extends WC_Payment_Token {

    /** @protected string Token Type String */
    protected $type = 'eCheck';

}
```

The name for this token type is 'eCheck'. The value provided in `$type` needs to match the class name (i.e: `WC_Payment_Token_$type`).

#### Step 1: Provide A Validate Method

Some basic validation is performed on a token before it is saved to the database. `WC_Payment_Token` checks to make sure the actual token value is set, as well as the `$type` defined above. If you want to validate the existence of other data (eChecks require the last 4 digits for example) or length (an expiry month should be 2 characters), you can provide your own `validate()` method.

Validate should return `true` if everything looks OK, and false if something doesn't.

Always make sure to call `WC_Payment_Token`'s validate method before adding in your own logic.

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

Finally, return true if we make it to the end of the `validate()` method.

```php
    return true;
}
```

#### Step 2: Provide `get_` And `set_` Methods For Extra Data

公開したいデータごとに独自のメソッドを追加できるようになった。データの保存と取得を簡単にする便利な関数が用意されている。すべてのデータはメタ・テーブルに保存されるので、独自のテーブルを作成したり、既存のテーブルに新しいフィールドを追加したりする必要はありません。

Provide a `get_` and `set_` method for each piece of data you want to capture. For eChecks, this is "last4" for the last 4 digits of a check.

```php
public function get_last4() {
    return $this->get_meta( 'last4' );
}

public function set_last4( $last4 ) {
    $this->add_meta_data( 'last4', $last4, true );
}
```

That's it! These meta functions are provided by [WC_Data](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/abstracts/abstract-wc-data.php).

#### Step 3: Use Your New Token Type

新しいトークン・タイプは、新しいトークンを構築する際に直接使用することができます。

```php
`$token = new WC_Payment_Token_eCheck();`
// set token properties
$token->save()
```

or it will be returned when using `WC_Payment_Tokens::get( $token_id )`.

## Classes

### WC_Payment_Tokens

このクラスは、ペイメントトークンとやりとりするための一連の便利なメソッドを提供します。すべてのメソッドは静的で、クラスのインスタンスを作成せずに呼び出すことができます。

#### get_customer_tokens( $customer_id, $gateway_id = '' )

Returns an array of token objects for the customer specified in `$customer_id`. You can filter by gateway by providing a gateway ID as well.

```php
// Get all tokens for the current user
$tokens = WC_Payment_Tokens::get_customer_tokens( get_current_user_id() );
// Get all tokens for user 42
$tokens = WC_Payment_Tokens::get_customer_tokens( 42 );
// Get all Simplify tokens for the current user
$tokens = WC_Payment_Tokens::get_customer_tokens( get_current_user_id(), 'simplify_commerce' );
```

#### get_customer_default_token( $customer_id )

default'としてマークされたトークン（チェックアウト時に自動的に選択されるトークン）のトークンオブジェクトを返します。ユーザがデフォルトトークンを持たない場合、この関数は null を返します。

```php
// Get default token for the current user
$token = WC_Payment_Tokens::get_customer_default_token( get_current_user_id() );
// Get default token for user 520
$token = WC_Payment_Tokens::get_customer_default_token( 520 );
```

#### get_order_tokens( $order_id )

Orders can have payment tokens associated with them (useful for subscription products and renewing, for example). You can get a list of tokens associated with this function. Alternatively you can use `WC_Order`'s '`get_payment_tokens()` function to get the same result.

```php
// Get tokens associated with order 25
$tokens = WC_Payment_Tokens::get_order_tokens( 25 );
// Get tokens associated with order 25, via WC_Order
$order = wc_get_order( 25 );
$tokens =  $order->get_payment_tokens();
```

#### get( $token_id )

Returns a single payment token object for the provided `$token_id`.

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

Makes the provided token (`$token_id`) the provided user (`$user_id`)'s default token. It makes sure that whatever token is currently set is default is removed and sets the new one.

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

`set_` methods **do not** update the token in the database. You must call `save()`, `create()` (new tokens only), or `update()` (existing tokens only).

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

Set the credit card type. This is a freeform text field, but the following values can be used and WooCommerce will show a formatted label New labels can be added with the `woocommerce_credit_card_type_labels` filter.

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

`set_` methods **do not** update the token in the database. You must call `save()`, `create()` (new tokens only), or `update()` (existing tokens only).

#### validate()

eチェック・トークンは、実際のトークンと同様に下4桁が保存されていることを確認します。

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

You should not use `WC_Payment_Token` directly. Use one of the bundled token classes (`WC_Payment_Token_CC` for credit cards and `WC_Payment_Token_eCheck`). You can extend this class if neither of those work for you. All the methods defined in this section are available to those classes.

`set_` methods **do not** update the token in the database. You must call `save()`, `create()` (new tokens only), or `update()` (existing tokens only).

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

#### get_gateway_id

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

Toggle a tokens 'default' flag. Pass true to set it as default, false if its just another token. This **does not** unset any other tokens that may be set as default. You can use `WC_Payment_Tokens::set_users_default()` to handle that instead.

```php
$token = WC_Payment_Tokens::get( 42 ); // Token 42 is a default token for user 3
var_dump( $token->is_default() ); // returns true
$token->set_default( false );
var_dump( $token->is_default() ); // returns false
```

#### validate()

Does a check to make sure both the token and token type (CC, eCheck, ...) are present. See `WC_Payment_Token_CC::validate()` or `WC_Payment_Token_eCheck::validate()` for usage.

#### read( $token_id )

Load an existing token object from the database. See `WC_Payment_Tokens::get()` which is an alias of this function.

```php
// Load a credit card toke, ID 55, user ID 5
$token = WC_Payment_Token_CC();
$token->read( 55 );
echo $token->get_id(); // returns 55
echo $token->get_user_id(); // returns 5
```

#### update()

Update an existing token. This will take any changed fields (`set_` functions) and actually save them to the database. Returns true or false depending on success.

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

`save()` can be used in place of `update()` and `create()`. If you are working with an existing token, `save()` will call `update()`. A new token will call `create()`. Returns true or false depending on success.

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

#### delete()

データベースからトークンを削除します。

```php
$token = WC_Payment_Tokens::get( 42 );
$token->delete();
```
