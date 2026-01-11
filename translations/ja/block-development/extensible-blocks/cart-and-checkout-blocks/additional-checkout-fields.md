---
post_title: Additional checkout fields
sidebar_label: Additional checkout fields
sidebar_position: 4
---

# 追加のチェックアウトフィールド

開発者やマーチャントにとって一般的なユースケースは、顧客や注文に関する追加データを収集するために、チェックアウトフォームに新しいフィールドを追加することです。

このドキュメントでは、エクステンションがチェックアウトフィールドを追加登録するための手順を説明します。

## 利用可能なフィールドロケーション

追加のチェックアウトフィールドは、3つの異なる場所に登録することができます：

| タイトル
| ------------------------------------ | ---------- |
| 連絡先情報 | **`contact`** |
| 住所 (配送先および請求先) | **`address`** |
| ご注文情報｜ **`order`** |

フィールドは1つの場所にしか表示できません。同じ登録で、同じフィールドを複数の場所に表示することはできません。

### 連絡先

現在、連絡先情報セクションはフォームの一番上に表示されます。`email`フィールドとその他のフィールドが含まれます。

![連絡先情報セクションに、メールアドレスと追加のチェックアウトフィールド（オプション）の 2 つのフィールドを表示しています。](https://github.com/woocommerce/woocommerce/assets/5656702/097c2596-c629-4eab-9604-577ee7a14cfe)

ここでレンダリングされたフィールドは買い物客のアカウントに保存されます。これらのフィールドは買い物客の "アカウント詳細 "セクションに表示され、編集可能です。

### 住所

住所」セクションには現在、配送先住所と請求先住所のフォームがあります。これらのフォームに表示されるように、追加のチェックアウトフィールドを登録することができます。

![配送先住所フォームの下部に追加のチェックアウトフィールドが表示されている](https://github.com/woocommerce/woocommerce/assets/5656702/746d280f-3354-4d37-a78a-a2518eb0e5de)

ここで登録されたフィールドは、顧客と注文の両方に保存されます。

フィールドが`address`に登録されている場合、配送先住所と請求先住所の両方に表示されます。どちらか一方の住所にのみフィールドを登録することはできません。

また、このフィールドには出荷用と請求用の2つの値を収集することになります。

### 注文情報

チェックアウトフィールドの追加機能の一環として、チェックアウトブロックに「注文情報ブロック」と呼ばれる新しいインナーブロックが追加されました。

このブロックは、連絡先情報や住所情報の一部ではないフィールドをレンダリングするために使用されます。例えば、「どのようにして当サイトをお知りになりましたか」フィールドや「ギフトメッセージ」フィールドなどです。

ここでレンダリングされたフィールドは注文に保存されます。これらは顧客の保存された住所やアカウント情報の一部にはなりません。新しい注文には、以前に使用された値は入力されません。

![追加のチェックアウトフィールドを含む注文情報セクション](https://github.com/woocommerce/woocommerce/assets/5656702/295b3048-a22a-4225-96b0-6b0371a7cd5f)

デフォルトでは、このブロックはチェックアウトフォームの最後のステップとしてレンダリングされますが、エディタの Gutenberg ブロックコントロールを使って移動させることができます。

![投稿エディタの注文情報ブロック](https://github.com/woocommerce/woocommerce/assets/5656702/05a3d7d9-b3af-4445-9318-443ae2c4d7d8)

## 値へのアクセス

追加フィールドは、顧客メタと注文メタの両方で個別のメタキーに保存されます。ヘルパーメソッドを使うか、メタキーを直接使ってアクセスすることができます。

住所フィールドには、配送先と請求先の2つの値が保存されます。顧客が「請求先に同じ住所を使用する」を選択した場合、値は同じになりますが、それぞれ独立して保存されます。

連絡先フィールドと注文フィールドでは、フィールドごとに1つの値のみが保存されます。

### ヘルパーメソッド

`CheckoutFields` は、顧客と注文の両方から値にアクセスするための関数を提供します。これは `get_field_from_object` です。

顧客の請求額や配送額にアクセスするには:

```php
use Automattic\WooCommerce\Blocks\Package;
use Automattic\WooCommerce\Blocks\Domain\Services\CheckoutFields;

$field_id = 'my-plugin-namespace/my-field';
$customer = wc()->customer; // Or new WC_Customer( $id )
$checkout_fields = Package::container()->get( CheckoutFields::class );
$my_customer_billing_field = $checkout_fields->get_field_from_object( $field_id, $customer, 'billing' );
$my_customer_shipping_field = $checkout_fields->get_field_from_object( $field_id, $customer, 'shipping' );
```

注文フィールドにアクセスするには:

```php
use Automattic\WooCommerce\Blocks\Package;
use Automattic\WooCommerce\Blocks\Domain\Services\CheckoutFields;

$field_id = 'my-plugin-namespace/my-field';
$order = wc_get_order( 1234 );
$checkout_fields = Package::container()->get( CheckoutFields::class );
$my_order_billing_field = $checkout_fields->get_field_from_object( $field_id, $order, 'billing' );
$my_order_shipping_field = $checkout_fields->get_field_from_object( $field_id, $order, 'shipping' );
```

注文が確定すると、顧客に保存されたデータと注文に保存されたデータは同一になります。顧客は、今後の注文の値、またはマイアカウントページから値を変更できます。特定の時点（注文確定時など）の顧客値を確認したい場合は、注文オブジェクトからアクセスしてください。最新の値を確認したい場合は、顧客オブジェクトからアクセスしてください。

#### ゲスト顧客

ゲスト顧客が追加フィールドを含む注文を行うと、それらのフィールドはセッションに保存されるため、顧客の有効なセッションが継続している限り、値は常にそこに存在します。

#### ログイン顧客

ログイン済みの顧客の場合、値は注文が確定した時点でのみ保持されます。注文確定ライフサイクル中にログイン済みの顧客オブジェクトにアクセスすると、null または古いデータが返されます。

注文確定フックでこれを行うと、以前のデータ（現在挿入されているデータではありません）が返されます:

```php
$customer = new WC_Customer( $order->customer_id ); // Or new WC_Customer( 1234 )
$my_customer_billing_field = $checkout_fields->get_field_from_object( $field_id, $customer, 'billing' );
```

代わりに、追加の検証/データ移動を実行する場合は、常に最新のデータにアクセスします:

```php
$customer = wc()->customer // This will return the current customer with its session.
$my_customer_billing_field = $checkout_fields->get_field_from_object( $field_id, $customer, 'billing' );
```

#### すべてのフィールドへのアクセス

`get_all_fields_from_object` を使用すると、注文または顧客に保存されているすべての追加フィールドにアクセスできます。

```php
use Automattic\WooCommerce\Blocks\Package;
use Automattic\WooCommerce\Blocks\Domain\Services\CheckoutFields;

$order = wc_get_order( 1234 );
$checkout_fields = Package::container()->get( CheckoutFields::class );
$order_additional_billing_fields = $checkout_fields->get_all_fields_from_object( $order, 'billing' );
$order_additional_shipping_fields = $checkout_fields->get_all_fields_from_object( $order, 'shipping' );
$order_other_additional_fields = $checkout_fields->get_all_fields_from_object( $order, 'other' ); // Contact and Order are saved in the same place under the additional group.
```

これはすべての値の配列を返します。現在登録されているフィールドのみが含まれます。登録されていないフィールドを含める場合は、3 番目の `true` パラメータを渡すことができます。

```php
$order = wc_get_order( 1234 );
$checkout_fields = Package::container()->get( CheckoutFields::class );
$order_additional_billing_fields = $checkout_fields->get_all_fields_from_object( $order, 'billing' ); // array( 'my-plugin-namespace/my-field' => 'my-value' );

$order_additional_billing_fields = $checkout_fields->get_all_fields_from_object( $order, 'billing', true  ); // array( 'my-plugin-namespace/my-field' => 'my-value', 'old-namespace/old-key' => 'old-value' );
```

### 値に直接アクセスする

推奨はされませんが、特定の値にアクセスするために直接メタキーを使用することは可能です。これは、メタ値へのアクセスのみを提供する外部エンジンやページ/メールビルダーで役立ちます。

値は定義済みのプレフィックスで保存されます。これは、フィールドがどのIDで登録されているかを知らなくてもフィールドをクエリできるようにするために必要です。例えば、キーが「my-plugin-namespace/my-field」であるフィールドの場合、アドレスフィールドであればメタキーは次のようになります。

- `_wc_billing/my-plugin-namespace/my-field`
- `_wc_shipping/my-plugin-namespace/my-field`

または、連絡先/注文フィールドの場合は次のようになります: 

- `_wc_other/my-plugin-namespace/my-field`.

これらのプレフィックスは `CheckoutFields` クラスの一部であり、次の定数を使用してアクセスできます:

```php
echo ( CheckoutFields::BILLING_FIELDS_PREFIX ); // _wc_billing/
echo ( CheckoutFields::SHIPPING_FIELDS_PREFIX ); // _wc_shipping/
echo ( CheckoutFields::OTHER_FIELDS_PREFIX ); // _wc_other/
```

`CheckoutFields` は、グループ名またはキーをどちらかに基づいて取得するためのヘルパーをいくつか提供します:

```php
CheckoutFields::get_group_name( "_wc_billing" ); // "billing"
CheckoutFields::get_group_name( "_wc_billing/" ); // "billing"

CheckoutFields::get_group_key( "shipping" ); // "_wc_shipping/"
```

ここでの使用例は、メタに直接アクセスするためのキー名を構築することです:

```php
$key      = CheckoutFields::get_group_key( "other" ) . 'my-plugin/is-opt-in';
$opted_in = get_user_meta( 123, $key, true ) === "1" ? true : false;
```

#### チェックボックスの値

チェックボックスの値に直接アクセスすると、true の場合は `"1"`、false の場合は `"0"`、値が存在しない場合は `""` が返されます。提供されている関数のみがそれをブール値にサニタイズします。

## サポートされているフィールドタイプ

次のフィールド タイプがサポートされています。

- `select`
- `text`
- `checkbox`

このリストを拡張する予定ですが、現時点ではこれらのタイプが利用可能です。

## API の使用

追加のチェックアウトフィールドを登録するには、`woocommerce_register_additional_checkout_field` 関数を使用する必要があります。

この関数は、`woocommerce_init` アクションの後に実行することをお勧めします。

登録関数は、フィールドを記述するオプションの配列を受け取ります。一部のフィールドタイプでは、追加のオプションを受け取ることができます。

### オプション

#### 全般オプション

これらのオプションは、すべてのフィールド タイプに適用されます (インラインで示されているいくつかの状況を除く)。

| Option name         | Description                                                                                                                         | Required? | Example                                      | Default value                                                                                                                                                                                                                                                                                  |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`                | フィールドのID。これはフィールド固有の識別子である必要があります。名前空間とフィールド名を `/` で区切って指定します。| Yes       | `plugin-namespace/how-did-you-hear`          | デフォルトはありません。これは必ず指定する必要があります。                                                                                                                                                                                                                                                            |
| `label`             | フィールドに表示されるラベル。プレースホルダーとしても機能します。                                                                    | Yes       | `How did you hear about us?`                 | デフォルトはありません。これは必ず指定する必要があります。                                                                                                                                                                                                                                                            |
| `optionalLabel`     | 入力欄がオプションの場合に表示されるラベル。これもプレースホルダーとして機能します。                                                  | No        | `How did you hear about us? (Optional)`      | デフォルト値は、`label` の値に `(optional)` が追加された値になります。                                                                                                                                                                                                                    |
| `location`          | フィールドをレンダリングする場所。                                                                                                  | Yes       | `contact`, `address`, or `order`        | デフォルトはありません。これは必ず指定する必要があります。                                                                                                                                                                                                                                                            |
| `type`              | レンダリングするフィールドのタイプ。デフォルトは `text` で、サポートされているフィールドタイプのいずれかと一致する必要があります。                          | No        | `text`, `select`, or `checkbox`              | `text`                                                                                                                                                                                                                                                                                         |
| `attributes`        | フィールドの入力要素にレンダリングする追加属性の配列。これは `select` フィールドではサポートされていません。              | No        | `[	'data-custom-data' => 'my-custom-data' ]` | `[]`                                                                                                                                                                                                                                                                                           |
| `required`          | ブール値または　JSON　スキーマ配列を指定できます。ブール値かつ「true」の場合、買い物客はチェックアウト時にこのフィールドに値を入力する必要があります。チェックボックスフィールドの場合、買い物客は注文を確定するためにチェックボックスをオンにする必要があります。JSON　スキーマ配列の場合、スキーマの条件に基づいてフィールドが必須になります。 [Conditional visibility and validation via JSON Schema](#conditional-visibility-and-validation-via-json-schema)をご覧ください。 | No | `true` or `["type" => "object", "properties" => [...]]` | `false` |
| `hidden`            | ブール値または　JSON　スキーマ配列を指定できます。ブール値として使用する場合は「false」を指定する必要があります。JSON　スキーマ配列の場合、フィールドはスキーマ条件に基づいて非表示になります。  [Conditional visibility and validation via JSON Schema](#conditional-visibility-and-validation-via-json-schema)をご覧ください。 | No | `false` or `["type" => "object", "properties" => [...]]` | `false` |
| `validation`        | フィールドの検証ルールを定義する JSON スキーマ オブジェクトの配列。 [Conditional visibility and validation via JSON Schema](#conditional-visibility-and-validation-via-json-schema)をご覧ください。 | No | `[{"type": "object", "properties": {...}}]` | `[]` |
| `sanitize_callback` | 投稿時に顧客が提供した値をサニタイズするために呼び出される関数。                                                              | No        | See example below                            | デフォルトでは、フィールドの値は変更されずに返されます。                                                                                                                                                                                                                          |
| `validate_callback` | 顧客が投稿時に入力した値を検証するために呼び出される関数。これはサニタイズ処理の後に実行されます。                              | No        | See example below                            | デフォルトの検証関数は、フィールドが必須で値がない場合に応答にエラーを追加します。 [デフォルトの検証機能を参照してください。](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Blocks/Domain/Services/CheckoutFields.php#L270-L281) |

##### `sanitize_callback`　の例。この関数は値からスペースを削除します。 <!-- omit from toc -->

```php
'sanitize_callback' => function( $field_value ) {
	return str_replace( ' ', '', $field_value );
},
```

##### `validate_callback` の例。この関数は値がメールアドレスかどうかを確認します。 <!-- omit from toc -->

```php
'validate_callback' => function( $field_value ) {
	if ( ! is_email( $field_value ) ) {
		return new WP_Error( 'invalid_alt_email', 'Please ensure your alternative email matches the correct format.' );
	}
},
```

#### `text` フィールドのオプション

テキストフィールドには、上記の一般的なオプション以外に追加のオプションはありません。

#### `select` フィールドのオプション

上記のオプションに加えて、選択フィールドも `options` オプションで登録する必要があります。これは、買い物客が選択できるオプションを指定するために使用されます。

選択フィールドはデフォルトで値が未選択の状態でマウントされます。フィールドが必須の場合、ユーザーは値を選択する必要があります。

フィールドを登録する際に `placeholder` 値を渡すことで、選択フィールドに表示されるプレースホルダを設定できます。これは選択フィールドの最初のオプションとなり、フィールドが必須の場合は選択できません。

| Option name | Description | Required? | Example        | Default value |
|-----|-----|-----|----------------|--------------|
| `options` | 選択入力欄に表示するオプションの配列です。各オプションは、`label` プロパティと `value` プロパティを含む配列である必要があります。各エントリには一意の `value` が必要です。重複するオプションは削除されます。`value` はチェックアウト時にサーバーに送信され、`label` はこの値をユーザーフレンドリーに表現したものです。サーバーに送信されることはありません。 | Yes | see below | デフォルトはありません。これは必ず指定する必要があります。 |
| `placeholder` | この値が設定されている場合、買い物客は選択時にこのオプションが表示されます。選択が必須の場合、買い物客はこのオプションを選択できません。 | No | `Select a role` | Select a $label |

##### `options`値の例


```php
[

	[
		'value' => 'store_1',
		'label' => 'Our London Store'
	],
	[
		'value' => 'store_2',
		'label' => 'Our Paris Store'
	],
	[
		'value' => 'store_3',
		'label' => 'Our New York Store'
	]
]
```

#### `checkbox` フィールドのオプション

上記のオプションに加えて、チェックボックス フィールドでは、必須であるにもかかわらずチェックされていない場合にエラー メッセージを表示することがサポートされています。

| オプション名     | 説明                                                                  | 必須? | 例                                                      | 初期値 |
|-----------------|------------------------------------------------------------------------------|-----------|--------------------------------------------------------------|---|
| `error_message` | ボックスがチェックされていない場合に表示されるカスタムメッセージ。                            | No | 「注文する前に、18 歳以上であることを確認する必要があります。」 | 「続行する場合はこのボックスにチェックを入れてください。」 |

### 属性

チェックボックスとテキストフィールドへの属性追加はサポートされています。選択フィールドへの属性追加は**現時点では**できません。

これらの属性は、`input` 要素の HTML 属性と 1:1 でマッピングされます（チェックボックスの `pattern` を除く）。

サポートされている属性は次のとおりです。

- `data-*` attributes
- `aria-*` attributes
- `autocomplete`
- `autocapitalize`
- `pattern` (チェックボックスフィールドではサポートされません)
- `title`
- `maxLength` （`maxlength` HTML 属性に相当）
- `readOnly` (`readonly` HTML 属性に相当)

`maxLength` と `readOnly` はキャメルケース形式です。これは、これらの属性が React 要素上でレンダリングされ、この形式で受け取る必要があるためです。

`autofocus` と `disabled` といった一部の属性は、意図的にフィールドに渡されません。有効なユースケースが提示された場合は、フィードバックをお待ちしており、この動作を調整いたします。

## 使用例

### テキストフィールドのレンダリング

この例では、アドレスセクションにテキストフィールドをレンダリングする方法を示します。

```php
add_action(
	'woocommerce_init',
	function() {
		woocommerce_register_additional_checkout_field(
			array(
				'id'            => 'namespace/gov-id',
				'label'         => 'Government ID',
				'optionalLabel' => 'Government ID (optional)',
				'location'      => 'address',
				'required'      => true,
				'attributes'    => array(
					'autocomplete'     => 'government-id',
					'aria-describedby' => 'some-element',
					'aria-label'       => 'custom aria label',
					'pattern'          => '[A-Z0-9]{5}', // A 5-character string of capital letters and numbers.
					'title'            => 'Title to show on hover',
					'data-custom'      => 'custom data',
				),
			),
		);
	}
);
```

これにより、次の住所形式が作成されます (請求書形式も同じになります)。

![政府 ID フィールドが下部に表示された配送先住所フォーム](https://github.com/woocommerce/woocommerce/assets/5656702/f6eb3c6f-9178-4978-8e74-e6b2ea353192)

レンダリングされたマークアップは次のようになります。

```html
	<input type="text" id="shipping-namespace-gov-id" autocapitalize="off"
       autocomplete="government-id" aria-label="custom aria label"
       aria-describedby="some-element" required="" aria-invalid="true"
       title="Title to show on hover" pattern="[A-Z0-9]{5}"
       data-custom="custom data" value="">
```

### チェックボックスフィールドのレンダリング

この例では、連絡先情報セクションのチェックボックス フィールドのレンダリングを示します: 

```php
add_action(
	'woocommerce_init',
	function() {
		woocommerce_register_additional_checkout_field(
			array(
				'id'       => 'namespace/marketing-opt-in',
				'label'    => 'Do you want to subscribe to our newsletter?',
				'location' => 'contact',
				'type'     => 'checkbox',
			)
		);
	}
);
```

This results in the following contact information section:

![The contact information section with a newsletter subscription checkbox rendered inside it](https://github.com/woocommerce/woocommerce/assets/5656702/7444e41a-97cc-451d-b2c9-4eedfbe05724)

Note that because an `optionalLabel` was not supplied, the string `(optional)` is appended to the label. To remove that an `optionalLabel` property should be supplied to override this.

### Rendering a select field

This example demonstrates rendering a select field in the order information section:

```php
add_action(
	'woocommerce_init',
	function() {
		woocommerce_register_additional_checkout_field(
			array(
				'id'          => 'namespace/how-did-you-hear-about-us',
				'label'       => 'How did you hear about us?',
				'placeholder' => 'Select a source',
				'location'    => 'order',
				'type'        => 'select',
				'options'     => [
					[
						'value' => 'google',
						'label' => 'Google'
					],
					[
						'value' => 'facebook',
						'label' => 'Facebook'
					],
					[
						'value' => 'friend',
						'label' => 'From a friend'
					],
					[
						'value' => 'other',
						'label' => 'Other'
					],
				]
			)
		);
	}
);
```

This results in the order information section being rendered like so:

### The select input before being focused

![The select input before being focused](https://github.com/woocommerce/woocommerce/assets/5656702/bbe17ad0-7c7d-419a-951d-315f56f8898a)

### The select input when focused

![The select input when focused](https://github.com/woocommerce/woocommerce/assets/5656702/bd943906-621b-404f-aa84-b951323e25d3)

If it is undesirable to force the shopper to select a value, mark the select as optional by setting the `required` option to `false`.

## Validation and sanitization

It is possible to add custom validation and sanitization for additional checkout fields using WordPress action hooks.

These actions happen in two places:

1. Updating and submitting the form during the checkout process and,
2. Updating address/contact information in the "My account" area.

### Sanitization

Sanitization is used to ensure the value of a field is in a specific format. An example is when taking a government ID, you may want to format it so that all letters are capitalized and there are no spaces. At this point, the value should **not** be checked for _validity_. That will come later. This step is only intended to set the field up for validation.

#### Using the `woocommerce_sanitize_additional_field` filter

To run a custom sanitization function for a field you can use the `sanitize_callback` function on registration, or the `woocommerce_sanitize_additional_field` filter.

| Argument     | Type              | Description                                                             |
|--------------|-------------------|-------------------------------------------------------------------------|
| `$field_value` | `boolean\|string` | The value of the field.                                                 |
| `$field_key`   | `string` | The ID of the field. This is the same ID the field was registered with. |

##### Example of sanitization

This example shows how to remove whitespace and capitalize all letters in the example Government ID field we added above.

```php
add_action(
	'woocommerce_sanitize_additional_field',
	function ( $field_value, $field_key ) {
		if ( 'namespace/gov-id' === $field_key ) {
			$field_value = str_replace( ' ', '', $field_value );
			$field_value = strtoupper( $field_value );
		}
		return $field_value;
	},
	10,
	2
);
```

### Validation

There are two phases of validation in the additional checkout fields system. The first is validating a single field based on its key and value.

#### Single field validation

##### Using the `woocommerce_validate_additional_field` action

When the `woocommerce_validate_additional_field` action is fired  the callback receives the field's key, the field's value, and a `WP_Error` object.

To add validation errors to the response, use the [`WP_Error::add`](https://developer.wordpress.org/reference/classes/wp_error/add/) method.

| Argument     | Type              | Description                                                                                                                                                                           |
|--------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `$errors`      | `WP_Error`        | An error object containing errors that were already encountered while processing the request. If no errors were added yet, it will still be a `WP_Error` object but it will be empty. |
| `$field_key`   | `string`          | The id of the field. This is the ID the field was registered with.                                                                                                                    |
| `$field_value` | `boolean\|string` | The value of the field                                                                                                                                                                |

###### The `WP_Error` object

When adding your error to the `WP_Error` object, it should have a unique error code. You may want to prefix the error code with the plugin namespace to reduce the chance of collision. Using codes that are already in use across other plugins may result in the error message being overwritten or showing in a different location.

###### Example of single-field validation

The below example shows how to apply custom validation to the `namespace/gov-id` text field from above. The code here ensures the field is made up of 5 characters, either upper-case letters or numbers. The sanitization function from the example above ensures that all whitespace is removed and all letters are capitalized, so this check is an extra safety net to ensure the input matches the pattern.

```php
add_action(
	'woocommerce_validate_additional_field',
	function ( WP_Error $errors, $field_key, $field_value ) {
		if ( 'namespace/gov-id' === $field_key ) {
			$match = preg_match( '/[A-Z0-9]{5}/', $field_value );
			if ( 0 === $match || false === $match ) {
				$errors->add( 'invalid_gov_id', 'Please ensure your government ID matches the correct format.' );
			}
		}
	},
	10,
	3
);
```

It is important to note that this action must _add_ errors to the `WP_Error` object it receives. Returning a new `WP_Error` object or any other value will result in the errors not showing.

If no validation errors are encountered the function can just return void.

#### Multiple field validation

There are cases where the validity of a field depends on the value of another field, for example validating the format of a government ID based on what country the shopper is in. In this case, validating only single fields (as above) is not sufficient as the country may be unknown during the `woocommerce_validate_additional_field` action.

To solve this, it is possible to validate a field in the context of the location it renders in. The other fields in that location will be passed to this action.

##### Using the `woocommerce_blocks_validate_location_{location}_fields` action

This action will be fired for each location that additional fields can render in (`address`, `contact`, and `order`). For `address` it fires twice, once for the billing address and once for the shipping address.

The callback receives the keys and values of the other additional fields in the same location.

It is important to note that any fields rendered in other locations will not be passed to this action, however it might be possible to get those values by accessing the customer or order object, however this is not supported and there are no guarantees regarding backward compatibility in future versions.

| Argument | Type                        | Description                                                                                                                                                                           |
|----------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `$errors`  | `WP_Error`                  | An error object containing errors that were already encountered while processing the request. If no errors were added yet, it will still be a `WP_Error` object but it will be empty. |
| `$fields`  | `array`                     | The fields rendered in this locations.                                                                                                                                                |
| `$group`   | `'billing'\|'shipping'\|'other'` | If the action is for the address location, the type of address will be set here. If it is for contact or order, this will be 'other'.                                   |

There are several places where these hooks are fired.

- When checking out using the Checkout block or Store API.
    - `woocommerce_blocks_validate_location_address_fields` (x2)
    - `woocommerce_blocks_validate_location_contact_fields`
    - `woocommerce_blocks_validate_location_other_fields`
- When updating addresses in the "My account" area
    - `woocommerce_blocks_validate_location_address_fields` (**x1** - only the address being edited)
- When updating the "Account details" section in the "My account" area
    - `woocommerce_blocks_validate_location_contact_fields`

##### Example of location validation

In this example, assume there is another field registered alongside the `namespace/gov-id` called `namespace/confirm-gov-id`. This field will be a confirmation for the Government ID field.

The example below illustrates how to verify that the value of the confirmation field matches the value of the main field.

```php
add_action(
	'woocommerce_blocks_validate_location_address_fields',
	function ( \WP_Error $errors, $fields, $group ) {
		if ( $fields['namespace/gov-id'] !== $fields['namespace/confirm-gov-id'] ) {
			$errors->add( 'gov_id_mismatch', 'Please ensure your government ID matches the confirmation.' );
		}
	},
	10,
	3
);
```

If these fields were rendered in the "contact" location instead, the code would be the same except the hook used would be: `woocommerce_blocks_validate_location_contact_fields`.

## Conditional visibility and validation via JSON Schema

The `required`, `hidden`, and `validation` properties accept an `array` of [JSON Schema](https://json-schema.org/understanding-json-schema/about) to create conditional logic for fields. This allows you to dynamically control field visibility, requirement status, and validation rules based on the values of other fields.

Schema is evaluated in the frontend in real-time, and on the backend at any update. This ensures fast and responsive UI, and consistent results between the client and server.

### JSON Schema Structure

Each schema in the array should be a valid JSON Schema object that defines conditions for when the property should be applied. The schema is evaluated against the current cart and checkout state, which includes all field values and various options (payment, shipping, customer).

Basic structure of a JSON Schema object:

```json
{
  "type": "object",
  "properties": {
    "fieldId": {
      "enum": ["value1", "value2"]
    }
  },
  "required": ["fieldId"]
}
```

If you're not familiar with JSON Schema, you can get a quick introduction to it [from the official website](https://json-schema.org/understanding-json-schema/basics), or from one of the libraries used [like AJV](https://ajv.js.org/json-schema.html) or [OPIS.](https://opis.io/json-schema/2.x/examples.html) Checkout builds an abstraction on top of both of them.

### Document object

When you're writing your rules, you're writing a partial schema for the document object, essentially describing the ideal state you want for your field to be required or hidden. 

**Important:** All properties in the document object use snake_case naming convention (e.g., `total_price`, `shipping_rates`, `customer_note`), not camelCase.

An example of the document object looks like this:

<!-- markdownlint-disable MD033 -->
<details>
	<summary>Document object</summary>

```json
{
	"cart": {
		"coupons": [
			"my_coupon"
		],
		"shipping_rates": [
			"free_shipping:1"
		],
		"items": [
			27,
			27,
			68
		],
		"items_type": [
			"simple",
			"variation"
		],
		"items_count": 3,
		"items_weight": 0,
		"needs_shipping": true,
		"prefers_collection": false,
		"totals": {
			"total_price": 6600,
			"total_tax": 600
		},
		"extensions": {}
	},
	"checkout": {
		"create_account": false,
		"customer_note": "",
		"additional_fields": {
			"namespace/myorder-field": "myvalue"
		},
		"payment_method": "bacs"
	},
	"customer": {
		"id": 1,
		"billing_address": {
			"first_name": "First Name",
			"last_name": "Last Name",
			"company": "Company",
			"address_1": "Address 1",
			"address_2": "Address 2",
			"city": "City",
			"state": "State",
			"postcode": "08000",
			"country": "US",
			"email": "email@example.com",
			"phone": "1234567890",
			"namespace/myfield": "myvalue"
		},
		"shipping_address": {
			"first_name": "First Name",
			"last_name": "Last Name",
			"company": "Company",
			"address_1": "Address 1",
			"address_2": "Address 2",
			"city": "City",
			"state": "State",
			"postcode": "08000",
			"country": "US",
			"phone": "1234567890",
			"namespace/myfield": "myvalue"
		},
		"additional_fields": {
			"namespace/mycontact-field": "myvalue"
		},
		"address": {
			"first_name": "First Name",
			"last_name": "Last Name",
			"company": "Company",
			"address_1": "Address 1",
			"address_2": "Address 2",
			"city": "City",
			"state": "State",
			"postcode": "08000",
			"country": "US",
			"phone": "1234567890",
			"namespace/myfield": "myvalue"
		}
	}
}
```

</details>
<!-- markdownlint-enable MD033 -->


It's full schema is this one:
<!-- markdownlint-disable MD033 -->
<details>
	<summary>Document schema</summary>
	
```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"title": "Cart and Checkout Document Object Schema",
	"description": "Document object schema for cart, checkout, and customer information, to be used for conditional visibility, requirement, and validation of fields.",
	"type": "object",
	"properties": {
		"cart": {
			"type": "object",
			"description": "Information about the shopping cart",
			"properties": {
				"coupons": {
					"type": "array",
					"description": "List of coupon codes applied to the cart",
					"items": {
						"type": "string"
					}
				},
				"shipping_rates": {
					"type": "array",
					"description": "List of currently selected shipping rates",
					"items": {
						"type": "string",
						"description": "Shipping rate identifier using the full shipping rate ID so method_id:instance_id, for example: flat_rate:1"
					}
				},
				"items": {
					"type": "array",
					"description": "List of product IDs in the cart, IDs will be duplicated depending on the quantity of the product in the cart, so if you have 2 of product ID 1, the array will have 2 entries of product ID 1. This only supports integer quantities, not floats (which round up to the nearest integer).",
					"items": {
						"type": "integer"
					}
				},
				"items_type": {
					"type": "array",
					"description": "Types of items in the cart, for example: simple, variation, subscription, etc.",
					"items": {
						"type": "string"
					}
				},
				"items_count": {
					"type": "integer",
					"description": "Total number of items in the cart",
					"minimum": 0
				},
				"items_weight": {
					"type": "number",
					"description": "Total weight of items in the cart",
					"minimum": 0
				},
				"needs_shipping": {
					"type": "boolean",
					"description": "Whether the items in the cart require shipping"
				},
				"prefers_collection": {
					"type": "boolean",
					"description": "Whether the customer prefers using Local Pickup"
				},
				"totals": {
					"type": "object",
					"description": "Cart totals information",
					"properties": {
						"total_price": {
							"type": "integer",
							"description": "Total price of the cart in smallest currency unit (e.g., cents), after applying all discounts, shipping, and taxes"
						},
						"total_tax": {
							"type": "integer",
							"description": "Total tax amount in smallest currency unit (e.g., cents), after applying all discounts, shipping, and taxes"
						}
					},
					"additionalProperties": false
				},
				"extensions": {
					"type": "object",
					"description": "Additional cart extension data, this is similar to what's passed in Store API's extensions parameter"
				}
			},
			"additionalProperties": false
		},
		"checkout": {
			"type": "object",
			"description": "Checkout preferences and settings",
			"properties": {
				"create_account": {
					"type": "boolean",
					"description": "Whether the customer checked the create account checkbox, this will be false if the customer is logged in, cannot create an account, or forced to create an account."
				},
				"customer_note": {
					"type": "string",
					"description": "Customer's note or special instructions for the order, this will be empty if the customer didn't add a note."
				},
				"additional_fields": {
					"type": "object",
					"description": "Additional checkout fields with 'order' location. These fields are rendered in the order information section.",
					"additionalProperties": {
						"type": "string"
					},
					"patternProperties": {
						"^[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+$": {
							"type": "string",
							"description": "Custom fields with namespace identifiers"
						}
					}
				},
				"payment_method": {
					"type": "string",
					"description": "Selected payment method identifier, this will be the payment method ID regardless if the customer selected a saved payment method or new payment method"
				}
			},
			"additionalProperties": false
		},
		"customer": {
			"type": "object",
			"description": "Customer information",
			"properties": {
				"id": {
					"type": "integer",
					"description": "Customer ID, this will be 0 if the customer is not logged in"
				},
				"billing_address": {
					"$ref": "#/definitions/address",
					"description": "Customer's billing address"
				},
				"shipping_address": {
					"$ref": "#/definitions/address",
					"description": "Customer's shipping address"
				},
				"additional_fields": {
					"type": "object",
					"description": "Additional checkout fields with 'contact' location. These fields are rendered in the contact information section.",
					"additionalProperties": {
						"type": "string"
					},
					"patternProperties": {
						"^[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+$": {
							"type": "string",
							"description": "Custom fields with namespace identifiers"
						}
					}
				},
				"address": {
					"$ref": "#/definitions/address",
					"description": "This is a dynamic field that will be the billing or shipping address depending on the context of the field being evaluated."
				}
			},
			"additionalProperties": false
		}
	},
	"additionalProperties": false,
	"definitions": {
		"address": {
			"type": "object",
			"description": "Customer address information",
			"properties": {
				"first_name": {
					"type": "string",
					"description": "First name of the recipient"
				},
				"last_name": {
					"type": "string",
					"description": "Last name of the recipient"
				},
				"company": {
					"type": "string",
					"description": "Company name"
				},
				"address_1": {
					"type": "string",
					"description": "Primary address line"
				},
				"address_2": {
					"type": "string",
					"description": "Secondary address line"
				},
				"city": {
					"type": "string",
					"description": "City name"
				},
				"state": {
					"type": "string",
					"description": "State or province, this will be the state code if it's a predefined list, for example: CA, TX, NY, etc, or the field value if it's a freeform state, for example: London."
				},
				"postcode": {
					"type": "string",
					"description": "Postal or ZIP code"
				},
				"country": {
					"type": "string",
					"description": "Country code (e.g., US, UK)"
				},
				"email": {
					"type": "string",
					"format": "email",
					"description": "Email address"
				},
				"phone": {
					"type": "string",
					"description": "Phone number"
				}
			},
			"additionalProperties": {
				"type": "string",
				"description": "Additional fields with 'address' location appear here as properties within the address objects"
			},
			"patternProperties": {
				"^[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+$": {
					"type": "string",
					"description": "Additional fields with 'address' location using namespace identifiers (e.g., 'namespace/field-name')"
				}
			}
		}
	}
}
```

</details>
<!-- markdownlint-enable MD033 -->

### Examples

#### Required and visible field

In this example we make the field required and visible only if local pickup is being used.

```php
'required' => [
    "type" => "object",
	"properties" => [
		"cart" => [
			"properties" => [
				"prefers_collection" => [
					"const" => true
				]
			]
		]
	]
],
'hidden' => [
	"type" => "object",
	"properties" => [
		"cart" => [
			"properties" => [
				"prefers_collection" => [
					"const" => false
				]
			]
		]
	]
]
```

Notice that for hidden, we inverse the field, meaning, this field should only be hidden if `prefers_collection` is false, which is almost all cases except when it's selected. In the examples above, we used [the keyword `const`](https://ajv.js.org/json-schema.html#const).


#### Validation schema example

Validation is slightly different from conditional visibility and requirement. In validation, you will pass in a subset of schema (only applicable to your field), and its role is to validate the field and show any errors if there.

In this example, we ensure that VAT is made up of a country code and 8-12 numbers.

```php
'validation' => [
	"type" => "string",
	"pattern" => "^[A-Z]{2}[0-9]{8,12}$",
	"errorMessage" => "Please enter a valid VAT code with 2 letters for country code and 8-12 numbers."
]
```

Validation can also be against other fields, for example, an alternative email field that shouldn't match the current email:

```php
'validation' => [
	"type" => "string",
	"format" => "email",
	"not" => [
		"const" => [ '$data' => "/customer/billing_address/email" ]
	],
	"errorMessage" => "Please enter a valid alternative email."
]
```

In the example above, we used [format keyword](https://github.com/ajv-validator/ajv-formats) and `$data` to refer to the current field value via [JSON pointers](https://ajv.js.org/guide/combining-schemas.html#data-reference). We also used the `errorMessage` property to provide a custom error message.

#### `$data` keyword and JSON pointers

`$data` keyword is a way in JSON schema to reference another field's value. In the above example, we use it to refer to the billing email via [JSON pointers](https://ajv.js.org/guide/combining-schemas.html#data-reference).

When dealing with JSON pointers, there are some things to keep in mind:

- The forward slash `/` is used to navigate through the JSON object, so for additional fields, a field named `my-plugin-namespace/my-field` will need to be referenced as `my-plugin-namespace~1my-field`.
- Navigation in JSON pointers can be from the current field backward, or from the root. If you have an address field and want to validate say the phone field, this means you will validate 2 values, one for shipping, and one for billing, so you can reference the phone field in 2 ways:
    - `0/customer/address/phone` which uses root navigation (via the `0/`) prefix, and uses the dynamic `address` group, which will change depending if the billing or shipping value is being validated.
    - `1/phone` which uses relative pointers to step back, in this case, it will access its sibling field, the `phone` field. Increase the number to step back even further, for example, `2/id` will access the customer ID.

### Keywords and values that are not in spec

We support [JSON Schema Draft-07](https://json-schema.org/draft-07), which is simple and doesn't support all the keywords and values that are in the latest spec, but we feel like it covers most of the use cases. On top of that, we introduced some non-standard keywords and values that are not in the spec, their implementation might be different between Opis and AJV (or any future implementation), this is the list of such keywords and values:

- `errorMessage`: Custom error message for validation, in AJV, this is `errorMessage` and in Opis, this is `$error`, we only support `errorMessage` and maps that internally for Opis. We also don't support templates in `errorMessage` for now.
- `$data`: Refers to the current field value via [JSON pointers](https://ajv.js.org/guide/combining-schemas.html#data-reference), both Opis and AJV use the same implementation.


### Evaluation Logic

- For `required`: If any schema in the array matches the current checkout state, the field will be required.
- For `hidden`: If any schema in the array matches the current checkout state, the field will be hidden.
- For `validation`: The value of the field will be evaluated against the partial schema provided and an error will be shown if it didn't match.

### Performance Considerations

Complex JSON Schema conditions can impact checkout performance. Keep your schemas as simple as possible and limit the number of conditions to what's necessary for your use case.

## Backward compatibility

Due to technical reasons, it's not yet possible to specify the meta key for fields, as we want them to be prefixed and managed. Plugins with existing fields in shortcode Checkout can be compatible and react to reading and saving fields using hooks.

Assuming 2 fields, named `my-plugin-namespace/address-field` in the address step and `my-plugin-namespace/my-other-field` in the order step, you can:

### React to saving fields

You can react to those fields being saved by hooking into `woocommerce_set_additional_field_value` action.

```php
add_action(
	'woocommerce_set_additional_field_value',
	function ( $key, $value, $group, $wc_object ) {
		if ( 'my-plugin-namespace/address-field' !== $key ) {
			return;
		}

		if ( 'billing' === $group ) {
			$my_plugin_address_key = 'existing_billing_address_field_key';
		} else {
			$my_plugin_address_key = 'existing_shipping_address_field_key';
		}

		$wc_object->update_meta_data( $my_plugin_address_key, $value, true );
	},
	10,
	4
);

add_action(
	'woocommerce_set_additional_field_value',
	function ( $key, $value, $group, $wc_object ) {
		if ( 'my-plugin-namespace/my-other-field' !== $key ) {
			return;
		}

		$my_plugin_key = 'existing_order_field_key';

		$wc_object->update_meta_data( $my_plugin_key, $value, true );
	},
	10,
	4
);
```

This way, you can ensure existing systems will continue working and your integration will continue to work. However, ideally, you should migrate your existing data and systems to use the new meta fields.


### React to reading fields

You can use the `woocommerce_get_default_value_for_{$key}` filters to provide a different default value (a value coming from another meta field for example):

```php
add_filter(
	"woocommerce_get_default_value_for_my-plugin-namespace/address-field",
	function ( $value, $group, $wc_object ) {

		if ( 'billing' === $group ) {
			$my_plugin_key = 'existing_billing_address_field_key';
		} else {
			$my_plugin_key = 'existing_shipping_address_field_key';
		}

		return $wc_object->get_meta( $my_plugin_key );
	},
	10,
	3
);

add_filter(
	"woocommerce_get_default_value_for_my-plugin-namespace/my-other-field",
	function ( $value, $group, $wc_object ) {

		$my_plugin_key = 'existing_order_field_key';

		return $wc_object->get_meta( $my_plugin_key );
	},
	10,
	3
);
```

## 完全な例

この完全な例では、政府IDテキスト・フィールドを登録し、それが特定のパターンに適合していることを検証する。

この例は、上記で紹介した例を組み合わせたものに過ぎない。

```php
add_action(
	'woocommerce_init',
	function() {
		woocommerce_register_additional_checkout_field(
			array(
				'id'            => 'namespace/gov-id',
				'label'         => 'Government ID',
				'location'      => 'address',
				'required'      => true,
				'attributes'    => array(
					'autocomplete' => 'government-id',
					'pattern'      => '[A-Z0-9]{5}', // A 5-character string of capital letters and numbers.
					'title'        => 'Your 5-digit Government ID',
				),
			),
		);
		woocommerce_register_additional_checkout_field(
			array(
				'id'            => 'namespace/confirm-gov-id',
				'label'         => 'Confirm government ID',
				'location'      => 'address',
				'required'      => true,
				'attributes'    => array(
					'autocomplete' => 'government-id',
					'pattern'      => '[A-Z0-9]{5}', // A 5-character string of capital letters and numbers.
					'title'        => 'Confirm your 5-digit Government ID',
				),
			),
		);

		add_action(
			'woocommerce_sanitize_additional_field',
			function ( $field_value, $field_key ) {
				if ( 'namespace/gov-id' === $field_key || 'namespace/confirm-gov-id' === $field_key ) {
					$field_value = str_replace( ' ', '', $field_value );
					$field_value = strtoupper( $field_value );
				}
				return $field_value;
			},
			10,
			2
		);

		add_action(
		'woocommerce_validate_additional_field',
			function ( WP_Error $errors, $field_key, $field_value ) {
				if ( 'namespace/gov-id' === $field_key ) {
					$match = preg_match( '/[A-Z0-9]{5}/', $field_value );
					if ( 0 === $match || false === $match ) {
						$errors->add( 'invalid_gov_id', 'Please ensure your government ID matches the correct format.' );
					}
				}
				return $errors;
			},
			10,
			3
		);
	}
);

add_action(
	'woocommerce_blocks_validate_location_address_fields',
	function ( \WP_Error $errors, $fields, $group ) {
		if ( $fields['namespace/gov-id'] !== $fields['namespace/confirm-gov-id'] ) {
			$errors->add( 'gov_id_mismatch', 'Please ensure your government ID matches the confirmation.' );
		}
	},
	10,
	3
);
```
