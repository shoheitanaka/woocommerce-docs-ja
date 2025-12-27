---
post_title: Customizing checkout fields using actions and filters
---
# アクションとフィルターを使ったチェックアウトフィールドのカスタマイズ

コードや潜在的なコンフリクトの解決に不慣れな場合は、お役に立てるエクステンションがあります：[WooCommerce Checkout Field Editor](https://woocommerce.com/products/woocommerce-checkout-field-editor/).この拡張機能をインストールし、有効化することで、あなたが実装しようとした以下のコードが上書きされます。また、拡張機能が有効化されている場合、functions.phpファイルにカスタムチェックアウトフィールドのコードを記述することはできません。

カスタムコードは、子テーマの**functions.php**ファイルにコピーしてください。

## Note

チェックアウトブロックにフィールドを追加するには、[追加チェックアウトフィールドのドキュメント](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/additional-checkout-fields/)を参照してください。

## How Are Checkout Fields Loaded to WooCommerce?

チェックアウトの請求先フィールドと配送先フィールドは国クラス `class-wc-countries.php` と **`get_address_fields`** 関数から取得します。これにより、WooCommerceはユーザーのロケーションに基づいてフィールドを有効/無効にすることができます。

これらのフィールドを返す前に、WooCommerceはフィールドを_filter_に通します。これにより、サードパーティのプラグインやテーマ、独自のカスタムコードで編集できるようになります。

Billing:

```php
$address_fields = apply_filters( 'woocommerce_billing_fields', $address_fields );
```

Shipping:

```php
$address_fields = apply_filters( 'woocommerce_shipping_fields', $address_fields );
```

チェックアウト・クラスは、ロードされたフィールドを`checkout_fields`配列に追加し、"order notes "のような他のフィールドも追加します。

```php
$this->checkout_fields['billing']  = $woocommerce->countries->get_address_fields( $this->get_value( 'billing_country' ), 'billing_' );
$this->checkout_fields['shipping'] = $woocommerce->countries->get_address_fields( $this->get_value( 'shipping_country' ), 'shipping_' );
$this->checkout_fields['account']  = array(
    'account_username'   => array(
        'type'        => 'text',
        'label'       => __( 'Account username', 'woocommerce' ),
        'placeholder' => _x( 'Username', 'placeholder', 'woocommerce' ),
    ),
    'account_password'   => array(
        'type'        => 'password',
        'label'       => __( 'Account password', 'woocommerce' ),
        'placeholder' => _x( 'Password', 'placeholder', 'woocommerce' ),
        'class'       => array( 'form-row-first' )
    ),
    'account_password-2' => array(
        'type'        => 'password',
        'label'       => __( 'Account password', 'woocommerce' ),
        'placeholder' => _x( 'Password', 'placeholder', 'woocommerce' ),
        'class'       => array( 'form-row-last' ),
        'label_class' => array( 'hidden' )
    ),
);
$this->checkout_fields['order']   = array(
    'order_comments' => array(
        'type'        => 'textarea',
        'class'       => array( 'notes' ),
        'label'       => __( 'Order Notes', 'woocommerce' ),
        'placeholder' => _x( 'Notes about your order, e.g. special notes for delivery.', 'placeholder', 'woocommerce' )
    )
);
```

この配列もフィルターにかけられる：

```php
$this->checkout_fields = apply_filters( 'woocommerce_checkout_fields', $this->checkout_fields );
```

つまり、あなたはチェックアウトのフィールドを**フルコントロール**できるのです。

## コアフィールドのオーバーライド

`woocommerce_checkout_fields`**フィルタにフックすることで、任意のフィールドを上書きすることができます。例として、order_commentsフィールドのプレースホルダーを変更してみましょう。現在は

```php
_x( 'Notes about your order, e.g. special notes for delivery.', 'placeholder', 'woocommerce' );
```

テーマのfunctions.phpファイルに関数を追加することで、これを変更できる：

```php
// Hook in
add_filter( 'woocommerce_checkout_fields' , 'custom_override_checkout_fields' );

// Our hooked in function - $fields is passed via the filter!
function custom_override_checkout_fields( $fields ) {
    $fields['order']['order_comments']['placeholder'] = 'My new placeholder';
    return $fields;
}
```

ラベルなど、他の部分をオーバーライドすることができる：

```php
// Hook in
add_filter( 'woocommerce_checkout_fields' , 'custom_override_checkout_fields' );

// Our hooked in function - $fields is passed via the filter!
function custom_override_checkout_fields( $fields ) {
    $fields['order']['order_comments']['placeholder'] = 'My new placeholder';
    $fields['order']['order_comments']['label']       = 'My new label';
    return $fields;
}
```

またはフィールドを削除する：

```php
// Hook in
add_filter( 'woocommerce_checkout_fields' , 'custom_override_checkout_fields' );

// Our hooked in function - $fields is passed via the filter!
function custom_override_checkout_fields( $fields ) {
    unset( $fields['order']['order_comments'] );

    return $fields;
}
```

以下は、`woocommerce_checkout_fields`に渡された配列のフィールドの全リストである：

-   請求
    -   __`billing_first_name`
    -   __`billing_last_name`
    -   __`billing_company`
    -   __`billing_address_1`
    -   __`billing_address_2`
    -   インラインコード
    -   インラインコード
    -   インラインコード7
    -   インラインコード8
    -   インラインコード9
    -   インライン・コード10
-   送料
    -   __`shipping_first_name`
    -   発送 `shipping_last_name`
    -   発送 `shipping_company`
    -   発送 `billing_country`
    -   発送 `shipping_address_2`
    -   インラインコード
    -   `shipping_postcode`
    -   インラインコード
    -   インラインコード
-   アカウント
    -   口座番号 `account_username`
    -   口座番号 `account_password`
    -   口座 `account_password-2`
-   注文
    -   __`order_comments`

各フィールドはプロパティの配列を含む：

-   `type` - フィールドの種類 (テキスト、テキストエリア、パスワード、セレクト)。
-   `label` - 入力フィールドのラベル。
-   `placeholder` - 入力フィールドのプレースホルダ。
-   `class` - 入力クラス。
-   `required` - true あるいは false、フィールドが必須かどうか。
-   `clear` - true あるいは false で、フィールド/ラベルに明確な修正を適用します。
-   `label_class` - label 要素のクラス。
-   `options` - セレクトボックスのための、オプションの配列 (キー => 値のペア)

特定のケースでは、**`woocommerce_default_address_fields`**フィルタを使用する必要があります。このフィルタはすべての請求および配送のデフォルトフィールドに適用されます：

-   `country`
-   `first_name`
-   `last_name`
-   `company`
-   ラインコード
-   インラインコード
-   インラインコード
-   インラインコード7
-   インラインコード8

例えば、`address_1`フィールドをオプションにする：

```php
// Hook in
add_filter( 'woocommerce_default_address_fields' , 'custom_override_default_address_fields' );

// Our hooked in function - $address_fields is passed via the filter!
function custom_override_default_address_fields( $address_fields ) {
    $address_fields['address_1']['required'] = false;

    return $address_fields;
}
```

### セレクトオプションの定義

select'タイプのフィールドを追加する場合、上記のようにキーと値のペアを定義します。例えば

```php
$fields['billing']['your_field']['options'] = array(
    'option_1' => 'Option 1 text',
    'option_2' => 'Option 2 text'
);
```

## 優先順位

PHPコードに関する優先順位は、関数と呼ばれるコードがページのロードに関連して実行されるタイミングを確立するのに役立ちます。これは各関数の内部で設定され、カスタム表示のために既存のコードを上書きするときに便利です。

つまり、優先度20のコードは優先度10のコードの後に実行される。

priority引数は、どのフックに接続し、カスタム関数の名前を決めた後、[add_action](https://developer.wordpress.org/reference/functions/add_action/)関数の中で設定します。

下の例では、青い文字が修正するフックの名前、緑の文字がカスタム関数の名前、赤が設定した優先順位です。

![フック機能の優先順位設定](https://developer.woocommerce.com/wp-content/uploads/2023/12/priority-markup.png)

## 例

### ショップに戻るボタンのリダイレクトURLを変更する

この例では、カート内の「ショップに戻る」ボタンを、`http://example.url/category/specials/`で販売されている商品を掲載しているカテゴリーにリダイレクトするようにコードを設定しています。

```php
/**
 * Changes the redirect URL for the Return To Shop button in the cart.
 */
function wc_empty_cart_redirect_url() {
    return 'http://example.url/category/specials/';
}

add_filter( 'woocommerce_return_to_shop_redirect', 'wc_empty_cart_redirect_url', 10 );
```

優先順位が10に設定されていることがわかります。これはWooCommerceの関数とスクリプトの典型的なデフォルトなので、ボタンの機能を上書きするには十分ではないかもしれません。

その代わりに、優先順位を10以上の数字に変更することができる。11でもいいのだが、ベストプラクティスでは10刻みを使うことになっているので、20、30......といった具合だ。

```php
/**
 * Changes the redirect URL for the Return To Shop button in the cart.
 */
function wc_empty_cart_redirect_url() {
    return 'http://example.com/category/specials/';
}

add_filter( 'woocommerce_return_to_shop_redirect', 'wc_empty_cart_redirect_url', 20 );
```

優先順位を使用すると、同じフックで動作する2つの関数を持つことができます。通常、これは様々な問題を引き起こしますが、一方が他方より優先順位が高いことを確認したので、当サイトは適切な関数のみをロードし、以下のコードで意図したとおりにスペシャルページに移動します。

```php
/**
 * Changes the redirect URL for the Return To Shop button in the cart.
 * BECAUSE THIS FUNCTION HAS THE PRIORITY OF 20, IT WILL RUN AFTER THE FUNCTION BELOW (HIGHER NUMBERS RUN LATER)
 */
function wc_empty_cart_redirect_url() {
    return 'http://example.com/category/specials/';
}

add_filter( 'woocommerce_return_to_shop_redirect', 'wc_empty_cart_redirect_url', 20 );

/**
 * Changes the redirect URL for the Return To Shop button in the cart.
 * EVEN THOUGH THIS FUNCTION WOULD NORMALLY RUN LATER BECAUSE IT'S CODED AFTERWARDS, THE 10 PRIORITY IS LOWER THAN 20 ABOVE
 */
function wc_empty_cart_redirect_url() {
    return 'http://example.com/shop/';
}

add_filter( 'woocommerce_return_to_shop_redirect', 'wc_empty_cart_redirect_url', 10 );
```

### カスタム配送・請求フィールドの追加

フィールドの追加は、フィールドのオーバーライドと同様の方法で行います。例えば、シッピング・フィールドに新しいフィールド`shipping_phone`を追加してみましょう：

```php
// Hook in
add_filter( 'woocommerce_checkout_fields' , 'custom_override_checkout_fields' );

// Our hooked in function - $fields is passed via the filter!
function custom_override_checkout_fields( $fields ) {
     $fields['shipping']['shipping_phone'] = array(
        'label'       => __( 'Phone', 'woocommerce' ),
        'placeholder' => _x( 'Phone', 'placeholder', 'woocommerce' ),
        'required'    => false,
        'class'       => array( 'form-row-wide' ),
        'clear'       => true
     );

     return $fields;
}

/**
 * Display field value on the order edit page
 */
add_action( 'woocommerce_admin_order_data_after_shipping_address', 'my_custom_checkout_field_display_admin_order_meta', 10, 1 );

function my_custom_checkout_field_display_admin_order_meta($order){
    echo '<p><strong>'. esc_html__( 'Phone From Checkout Form' ) . ':</strong> ' . esc_html( $order->get_meta( '_shipping_phone', true ) ) . '</p>';
}
```

![カスタム明細と請求フィールドの追加](https://developer.woocommerce.com/wp-content/uploads/2023/12/Webp-to-PNG-Shipping-Field-Hook.png)

生きている！

新しいフィールドで何をするか？何もしません。`checkout_fields`配列でフィールドを定義したので、フィールドは自動的に処理され、注文の投稿メタ（この場合は`_shipping_phone`）に保存されます。バリデーションルールを追加したい場合は、チェックアウトクラスを参照してください。

### カスタム特殊フィールドの追加

カスタムフィールドの追加も同様です。次のようにフックして、注文メモの後に新しいフィールドをチェックアウトに追加してみましょう：

```php
/**
 * Add the field to the checkout
 */
add_action( 'woocommerce_after_order_notes', 'my_custom_checkout_field' );

function my_custom_checkout_field( $checkout ) {

    echo '<div id="my_custom_checkout_field"><h2>' . esc_html__( 'My Field' ) . '</h2>';

    woocommerce_form_field(
        'my_field_name',
        array(
            'type'        => 'text',
            'class'       => array( 'my-field-class form-row-wide' ),
            'label'       => __( 'Fill in this field' ),
            'placeholder' => __( 'Enter something' ),
        ),
        $checkout->get_value( 'my_field_name' )
    );

    echo '</div>';

}
```

これによって私たちは

![WooCommerce Codex - チェックアウトフィールドフック](https://developer.woocommerce.com/wp-content/uploads/2023/12/WooCommerce-Codex-Checkout-Field-Hook.png)

次に、チェックアウトフォームが投稿されたときにフィールドをバリデートする必要があります。この例では、フィールドに文字だけが含まれていることをチェックしましょう：

```php
/**
 * Process the checkout
 */
add_action( 'woocommerce_checkout_process', 'my_custom_checkout_field_process' );

function my_custom_checkout_field_process() {
    // Check if this field contains just letters.
    if ( ! preg_match( '/^[a-zA-Z]+$/', $_POST['my_field_name'] ) ) {
		wc_add_notice( esc_html__( 'Please enter only letters into this new shiny field.' ), 'error' );
	}
}
```

フィールドが空白の場合、チェックアウトエラーが表示されます：

![WooCommerce Codex - チェックアウトフィールドのお知らせ](https://developer.woocommerce.com/wp-content/uploads/2023/12/WooCommerce-Codex-Checkout-Field-Notice.png)

最後に、以下のコードを使って、新しいフィールドをカスタムフィールドの注文に保存しましょう：

```php
/**
 * Update the order meta with field value
 */
add_action( 'woocommerce_checkout_update_order_meta', 'my_custom_checkout_field_update_order_meta' );

function my_custom_checkout_field_update_order_meta( $order_id ) {
    if ( ! empty( $_POST['my_field_name'] ) ) {
        $order = wc_get_order( $order_id );
        $order->update_meta_data( 'My Field', sanitize_text_field( $_POST['my_field_name'] ) );
        $order->save_meta_data();
    }
}
```

フィールドがオーダーに保存されました。

カスタムフィールドの値を管理画面の注文編集ページに表示したい場合は、以下のコードを追加してください：

```php
/**
 * Display field value on the order edit page
 */
add_action( 'woocommerce_admin_order_data_after_billing_address', 'my_custom_checkout_field_display_admin_order_meta', 10, 1 );

function my_custom_checkout_field_display_admin_order_meta( $order ){
    echo '<p><strong>' . esc_html__( 'My Field' ) . ':</strong> ' . esc_html( $order->get_meta( 'My Field', true ) ) . '</p>';
}
```

これがその結果だ：

![checkout_field_custom_field_admin](https://developer.woocommerce.com/wp-content/uploads/2023/12/checkout_field_custom_field_admin.png)

### 電話番号は不要

```php
add_filter( 'woocommerce_billing_fields', 'wc_npr_filter_phone', 10, 1 );

function wc_npr_filter_phone( $address_fields ) {
	$address_fields['billing_phone']['required'] = false;
	return $address_fields;
}
```
