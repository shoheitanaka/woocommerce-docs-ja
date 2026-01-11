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

これにより、次の連絡先情報セクションが表示されます:

![ニュースレター購読のチェックボックスがレンダリングされた連絡先情報セクション](https://github.com/woocommerce/woocommerce/assets/5656702/7444e41a-97cc-451d-b2c9-4eedfbe05724)

`optionalLabel`が提供されていないため、文字列`(optional)`がラベルに追加されることに注意してください。これを削除するには、これを上書きするために `optionalLabel` プロパティを指定する必要があります。

### 選択フィールドのレンダリング

次の例は、注文情報セクションで選択フィールドのレンダリングを示しています:

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

これにより、注文情報セクションが次のようにレンダリングされます:

### フォーカスする前に入力を選択する

![フォーカスする前に入力を選択する](https://github.com/woocommerce/woocommerce/assets/5656702/bbe17ad0-7c7d-419a-951d-315f56f8898a)

### フォーカス時の選択入力

![フォーカス時の選択入力](https://github.com/woocommerce/woocommerce/assets/5656702/bd943906-621b-404f-aa84-b951323e25d3)

買い物客に値を強制的に選択させるのが望ましくない場合は、`required`オプションを`false`に設定して、選択をオプションとしてマークします。

## 検証とサニタイズ

WordPressアクションフックを使用して、追加のチェックアウトフィールドにカスタム検証とサニタイズを追加できます。

これらのアクションは2つの場所で行われます。

1. チェックアウトプロセス中にフォームを更新して送信し、
2. 「マイアカウント」エリアの住所/連絡先情報を更新します。

### サニタイズ

サニタイズは、フィールドの値が特定の形式であることを確認するために使用されます。たとえば、政府発行の身分証明書を取る場合、すべての文字が大文字でスペースがないようにフォーマットする必要があります。この時点で、値は_validity_の**not**をチェックする必要があります。それは後で来ます。この手順は、検証のためにフィールドを設定することのみを目的としています。

#### `woocommerce_sanitize_additional_field`フィルタの使用

フィールドのカスタムサニタイズ関数を実行するには、登録時に `sanitize_callback` 関数、または `woocommerce_sanitize_additional_field` フィルターを使用します。

| Argument     | Type              | Description                                                             |
|--------------|-------------------|-------------------------------------------------------------------------|
| `$field_value` | `boolean\|string` | フィールドの値。                                                 |
| `$field_key`   | `string` | フィールドの ID。これはフィールドが登録されたのと同じ ID です。 |

##### サニタイズの例

この例は、上で追加した政府IDフィールドの例で、空白を削除し、すべての文字を大文字にする方法を示しています。

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

### バリデーション

追加のチェックアウトフィールドシステムには、検証には2つのフェーズがあります。1つ目は、キーと値に基づいて単一のフィールドを検証することです。

#### 単一フィールド検証

##### `woocommerce_validate_additional_field`アクションの使用

`woocommerce_validate_additional_field`アクションが起動されると、コールバックはフィールドのキー、フィールドの値、および`WP_Error`オブジェクトを受け取ります。

応答に検証エラーを追加するには、[`WP_Error::add`](https://developer.wordpress.org/reference/classes/wp_error/add/)メソッドを使用します。

| Argument     | Type              | Description                                                                                                                                                                           |
|--------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `$errors`      | `WP_Error`        | 要求の処理中にすでに発生したエラーを含むエラーオブジェクト。エラーがまだ追加されていない場合、`WP_Error`オブジェクトのままですが、空になります。 |
| `$field_key`   | `string`          | フィールドの ID。これはフィールドが登録された ID です。                                                                                                                    |
| `$field_value` | `boolean\|string` | フィールドの値                                                                                                                                                                |

###### `WP_Error`オブジェクト

`WP_Error` オブジェクトにエラーを追加する場合、一意のエラーコードが必要です。衝突の可能性を減らすために、エラーコードの前にプラグインの名前空間を付けたい場合があります。他のプラグインですでに使用されているコードを使用すると、エラーメッセージが上書きされたり、別の場所に表示されたりする可能性があります。

###### 単一フィールド検証の例

以下の例は、上記の `namespace/gov-id` テキストフィールドにカスタム検証を適用する方法を示しています。ここのコードは、フィールドが大文字または数字の5文字で構成されていることを保証します。上記の例のサニタイズ機能は、すべての空白が削除され、すべての文字が大文字になるようにします。したがって、このチェックは、入力がパターンに一致することを確認するための追加のセーフティネットです。

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

このアクションは、受信した `WP_Error` オブジェクトにエラーを _add_ しなければならないことに注意することが重要です。新しい `WP_Error` オブジェクトまたは他の値を返すと、エラーが表示されません。

検証エラーが発生しない場合、関数は無効を返すだけです。

#### 複数のフィールドの検証

フィールドの有効性が別のフィールドの値に依存する場合があります。たとえば、買い物客がいる国に基づいて政府 ID の形式を検証します。この場合、単一のフィールド（上記のように）のみを検証するだけでは、`woocommerce_validate_additional_field`アクション中に国が不明な場合があるため、十分ではありません。

これを解決するために、フィールドがレンダリングされる場所のコンテキストでフィールドを検証することができます。その場所の他のフィールドは、このアクションに渡されます。

##### `woocommerce_blocks_validate_location_{location}_fields`アクションの使用

このアクションは、追加のフィールドがレンダリングできる場所（`address`、`contact`、および`order`）ごとにトリガーされます。`address` の場合、請求先住所と配送先住所の 2 回発生します。

コールバックは、同じ場所にある他の追加フィールドのキーと値を受け取ります。

他の場所でレンダリングされたフィールドは、このアクションに渡されませんが、顧客または注文オブジェクトにアクセスしてこれらの値を取得することは可能かもしれませんが、これはサポートされていませんし、将来のバージョンでの下位互換性に関する保証はありません。

| Argument | Type                        | Description                                                                                                                                                                           |
|----------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `$errors`  | `WP_Error`                  | 要求の処理中にすでに発生したエラーを含むエラーオブジェクト。エラーがまだ追加されていない場合、`WP_Error`オブジェクトのままですが、空になります。 |
| `$fields`  | `array`                     | この場所でレンダリングされたフィールド。                                                                                                                                                |
| `$group`   | `'billing'\|'shipping'\|'other'` | アクションが住所の場所の場合、住所のタイプはここで設定されます。連絡または注文の場合、これは「その他」になります。                                   |

これらのフックが発射される場所はいくつかあります。

- チェックアウトブロックまたはストアAPIを使用してチェックアウトするとき。

- `woocommerce_blocks_validate_location_address_fields` (x2)
- `woocommerce_blocks_validate_location_contact_fields`
- `woocommerce_blocks_validate_location_other_fields`

- 「マイアカウント」エリアで住所を更新するとき

- `woocommerce_blocks_validate_location_address_fields` (**x1** - 編集中のアドレスのみ)

- 「マイアカウント」エリアの「アカウントの詳細」セクションを更新するとき

- `woocommerce_blocks_validate_location_contact_fields`

##### 場所の確認の例

この例では、`namespace/gov-id`の横に`namespace/confirm-gov-id`という別のフィールドが登録されていると仮定します。このフィールドは、政府IDフィールドの確認になります。

以下の例は、確認フィールドの値がメインフィールドの値と一致することを確認する方法を示しています。

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

これらのフィールドが代わりに「連絡先」の場所にレンダリングされた場合、コードは同じですが、使用されるフックは`woocommerce_blocks_validate_location_contact_fields`になります。

## Conditional visibility and validation via JSON Schema

`required`、`hidden`、および`validation`プロパティは、フィールドの条件付きロジックを作成するために、[JSON Schema]（https://json-schema.org/understanding-json-schema/about）の`array`を受け入れます。これにより、他のフィールドの値に基づいて、フィールドの可視性、要件のステータス、および検証ルールを動的に制御できます。

スキーマはフロントエンドでリアルタイムで評価され、バックエンドでは更新時に評価されます。これにより、高速で応答性の高い UI と、クライアントとサーバー間の一貫した結果が保証されます。

### JSONスキーマ構造

配列内の各スキーマは、プロパティを適用する条件を定義する有効なJSONスキーマオブジェクトである必要があります。スキーマは、すべてのフィールド値とさまざまなオプション（支払い、配送、顧客）を含む現在のカートとチェックアウトの状態に対して評価されます。

JSONスキーマオブジェクトの基本構造：

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

JSON スキーマに慣れていない場合は、[公式 Web サイト] (https://json-schema.org/understanding-json-schema/basics)、または [AJV など] (https://ajv.js.org/json-schema.html) または [OPIS.](https://opis.io/json-schema/2.x/examples.html) から簡単に紹介することができます。チェックアウトは、両方の上に抽象化を構築します。

### ドキュメントオブジェクト

ルールを書くときは、ドキュメントオブジェクトの部分的なスキーマを書き、基本的にフィールドを必須または非表示にしたい理想的な状態を記述します。

**重要：**ドキュメントオブジェクトのすべてのプロパティは、camelCaseではなく、snake_caseの命名規則（例：`total_price`、`shipping_rates`、`customer_note`）を使用します。

ドキュメントオブジェクトの例は次のようになります。

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


完全なスキーマはこれです:
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

### 例

#### 必須フィールドと表示フィールド

この例では、ローカルピックアップが使用されている場合にのみ、フィールドを必須で表示します。

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

非表示の場合、フィールドは逆になります。つまり、このフィールドは `prefers_collection` が false の場合のみ非表示にする必要があります。これは、選択されている場合を除き、ほとんどすべてのケースです。上記の例では、[キーワード `const`](https://ajv.js.org/json-schema.html#const) を使用しました。


#### 検証スキーマの例

検証は、条件付きの可視性と要件とは少し異なります。検証では、スキーマのサブセット（フィールドにのみ適用可能）を渡します。その役割は、フィールドを検証し、エラーがある場合は表示することです。

この例では、VAT が国番号と 8 ～ 12 桁で構成されていることを確認します:

```php
'validation' => [
	"type" => "string",
	"pattern" => "^[A-Z]{2}[0-9]{8,12}$",
	"errorMessage" => "Please enter a valid VAT code with 2 letters for country code and 8-12 numbers."
]
```

検証は、現在のメールと一致しない別のメールフィールドなど、他のフィールドに対して行うこともできます:

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

上記の例では、[formatキーワード](https://github.com/ajv-validator/ajv-formats)と`$data`を使用して、[JSONポインタ](https://ajv.js.org/guide/combining-schemas.html#data-reference)を介して現在のフィールド値を参照しました。また、カスタムエラーメッセージを提供するために、`errorMessage`プロパティも使用しました。

#### `$data`キーワードとJSONポインタ

`$data` キーワードは、JSON スキーマで別のフィールドの値を参照する方法です。上記の例では、[JSONポインタ]（https://ajv.js.org/guide/combining-schemas.html#data-reference）を介して請求メールを参照するために使用します。

JSONポインタを扱う場合、心に留めておくべきことがいくつかあります。

- スラッシュ `/` は JSON オブジェクトをナビゲートするために使用されるため、追加のフィールドの場合は、`my-plugin-namespace/my-field` という名前のフィールドを `my-plugin-namespace~1my-field` として参照する必要があります。
- JSONポインタでのナビゲーションは、現在のフィールドから後方に、またはルートから移動できます。住所フィールドがあり、電話フィールドを検証したい場合、これは2つの値を検証することを意味します。1つは配送用、もう1つは請求用です。そのため、電話フィールドは2つの方法で参照できます。
  - `0/customer/address/phone` はルートナビゲーション (`0/`) プレフィックスを介して) を使用し、動的 `address` グループを使用します。これは、請求または出荷値の検証のかどうかに応じて変化します。
  - `1/phone` は相対ポインタを使用して後退します。この場合、兄弟フィールドである `phone` フィールドにアクセスします。数を増やしてさらに後退します。たとえば、`2/id`は顧客IDにアクセスします。

### 仕様にないキーワードと値

[JSON Schema Draft-07](https://json-schema.org/draft-07) をサポートしています。これはシンプルで、最新の仕様にあるすべてのキーワードと値をサポートしていませんが、ほとんどのユースケースをカバーしているように感じます。その上、仕様にない非標準的なキーワードと値をいくつか導入しました。その実装は、OpisとAJV（または将来の実装）間で異なる可能性があります。これは、そのようなキーワードと値のリストです。

- `errorMessage`：検証用のカスタムエラーメッセージ、AJVでは、これは`errorMessage`、Opisでは、これは`$error`です。`errorMessage`のみをサポートし、Opis用に内部的にマッピングします。また、現在、`errorMessage`のテンプレートはサポートしていません。
- `$data`：[JSONポインタ]（https://ajv.js.org/guide/combining-schemas.html#data-reference）を介して現在のフィールド値を参照し、OpisとAJVの両方が同じ実装を使用します。

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
