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

現在、連絡先情報セクションはフォームの一番上に表示されます。`email` フィールドとその他のフィールドが含まれます。

![連絡先情報セクションに、メールアドレスと追加のチェックアウトフィールド（オプション）の 2 つのフィールドを表示しています。](https://github.com/woocommerce/woocommerce/assets/5656702/097c2596-c629-4eab-9604-577ee7a14cfe)

ここでレンダリングされたフィールドは買い物客のアカウントに保存されます。これらのフィールドは買い物客の "アカウント詳細 "セクションに表示され、編集可能です。

### 住所

住所」セクションには現在、配送先住所と請求先住所のフォームがあります。これらのフォームに表示されるように、追加のチェックアウトフィールドを登録することができます。

![配送先住所フォームの下部に追加のチェックアウトフィールドが表示されている](https://github.com/woocommerce/woocommerce/assets/5656702/746d280f-3354-4d37-a78a-a2518eb0e5de)

ここで登録されたフィールドは、顧客と注文の両方に保存されます。

フィールドが `address` に登録されている場合、配送先住所と請求先住所の両方に表示されます。どちらか一方の住所にのみフィールドを登録することはできません。

また、このフィールドには出荷用と請求用の2つの値を収集することになります。

### 注文情報

チェックアウトフィールドの追加機能の一環として、チェックアウトブロックに「注文情報ブロック」と呼ばれる新しいインナーブロックが追加されました。

このブロックは、連絡先情報や住所情報の一部ではないフィールドをレンダリングするために使用されます。例えば、「どのようにして当サイトをお知りになりましたか」フィールドや「ギフトメッセージ」フィールドなどです。

ここでレンダリングされたフィールドは注文に保存されます。これらは顧客の保存された住所やアカウント情報の一部にはなりません。新しい注文には、以前に使用された値は入力されません。

![追加のチェックアウトフィールドを含む注文情報セクション](https://github.com/woocommerce/woocommerce/assets/5656702/295b3048-a22a-4225-96b0-6b0371a7cd5f)

デフォルトでは、このブロックはチェックアウトフォームの最後のステップとしてレンダリングされますが、エディタのGutenbergブロックコントロールを使って移動させることができます。

![投稿エディタの注文情報ブロック](https://github.com/woocommerce/woocommerce/assets/5656702/05a3d7d9-b3af-4445-9318-443ae2c4d7d8)

## 値へのアクセス

追加フィールドは、顧客メタと注文メタの両方で個別のメタキーに保存されます。ヘルパーメソッドを使うか、メタキーを直接使ってアクセスすることができます。

住所フィールドには、配送先と請求先の2つの値が保存されます。顧客が「請求先に同じ住所を使用する」を選択した場合、値は同じになりますが、それぞれ独立して保存されます。

連絡先フィールドと注文フィールドの場合、フィールドごとに 1 つの値のみが保存されます。

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

#### ログインした顧客

ログイン済みの顧客の場合、値は注文確定後にのみ保持されます。注文確定ライフサイクル中にログイン済みの顧客オブジェクトにアクセスすると、null または古いデータが返されます。

注文フックを配置している場合、これを実行すると、以前のデータ（現在挿入されているデータではない）が返されます:

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

これはすべての値の配列を返します。これには現在登録されているフィールドのみが含まれます。登録されていないフィールドを含める場合は、3 番目の `true` パラメータを渡すことができます。

```php

$order = wc_get_order( 1234 );
$checkout_fields = Package::container()->get( CheckoutFields::class );
$order_additional_billing_fields = $checkout_fields->get_all_fields_from_object( $order, 'billing' ); // array( 'my-plugin-namespace/my-field' => 'my-value' );

$order_additional_billing_fields = $checkout_fields->get_all_fields_from_object( $order, 'billing', true  ); // array( 'my-plugin-namespace/my-field' => 'my-value', 'old-namespace/old-key' => 'old-value' );
```

### 値に直接アクセスする

推奨はされませんが、直接メタキーを使用して特定の値にアクセスすることができます。これは、メタ値へのアクセスのみを提供する外部エンジンやページ/メールビルダーに役立ちます。

値は定義済みのプレフィックスの下に保存されます。これは、フィールドがどの ID で登録されているかを知らなくてもフィールドをクエリできるようにするために必要です。キー `'my-plugin-namespace/my-field'` を持つフィールドの場合、アドレス フィールドであればメタ キーは次のようになります:

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
## Supported field types

次のフィールド タイプがサポートされています:

- `select`
- `text`
- `checkbox`

このリストを拡張する予定ですが、現時点ではこれらのタイプが利用可能です。

## API　の使用

追加のチェックアウトフィールドを登録するには、`woocommerce_register_additional_checkout_field` 関数を使用する必要があります。

この関数は、`woocommerce_init` アクションの後に実行することをお勧めします。

登録関数は、フィールドを記述するオプションの配列を受け取ります。一部のフィールドタイプでは、追加のオプションを受け取ることができます。

### オプション

#### 一般オプション

これらのオプションは、すべてのフィールド タイプに適用されます (インラインで示されているいくつかの状況を除く)。

| オプション名         | 説明                                                                                                                         | 必須? | 例                                      | 初期値 値                                                                                                                                                                                                                                                                                  |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`                | フィールドのID。これはフィールド固有の識別子である必要があります。名前空間とフィールド名を `/` で区切って指定します。 | はい       | `plugin-namespace/how-did-you-hear`          | デフォルトはありません。これは必ず指定する必要があります。                                                                                                                                                                                                                                                            |
| `label`             | フィールドに表示されるラベル。これもプレースホルダーとして使用されます。                                                                    | Yes       | `私たちのことをどうやって知りましたか?`                 | デフォルトはありません。これは必ず指定する必要があります。                                                                                                                                                                                                                                                            |
| `optionalLabel`     | 入力欄がオプションの場合に表示されるラベル。これもプレースホルダーとして機能します。                                                  | No        | `私たちのことをどうやって知りましたか? (Optional)`      | デフォルト値は、`label` の値に `(optional)` が追加された値になります。                                                                                                                                                                                                                     |
| `location`          | フィールドをレンダリングする場所。                                                                                                  | はい。       | `contact`, `address`, or `order`        | デフォルトはありません。これは必ず指定する必要があります。                                                                                                                                                                                                                                                            |
| `type`              | レンダリングするフィールドのタイプ。デフォルトは `text` で、サポートされているフィールドタイプのいずれかと一致する必要があります。                          | いいえ        | `text`, `select`, or `checkbox`              | `text`                                                                                                                                                                                                                                                                                         |
| `attributes`        | フィールドの入力要素にレンダリングする追加属性の配列。これは `select` フィールドではサポートされていません。              | いいえ        | `[	'data-custom-data' => 'my-custom-data' ]` | `[]`                                                                                                                                                                                                                                                                                           |
| `required`          | ブール値または JSON スキーマ配列を指定できます。ブール値かつ「true」の場合、買い物客はチェックアウト時にこのフィールドに値を入力する必要があります。チェックボックスフィールドの場合、買い物客は注文を確定するためにチェックボックスをオンにする必要があります。JSON スキーマ配列の場合、スキーマの条件に基づいてフィールドが必須になります。 [JSON スキーマによる条件付き可視性と検証](#conditional-visibility-and-validation-via-json-schema) を参照してください。 | No | `true` or `["type" => "object", "properties" => [...]]` | `false` |
| `hidden`            | ブール値または JSON スキーマ配列を指定できます。ブール値として使用する場合は「false」を指定する必要があります。JSON スキーマ配列の場合、フィールドはスキーマ条件に基づいて非表示になります。 [JSON スキーマによる条件付き可視性と検証](#conditional-visibility-and-validation-via-json-schema)を参照してください。 | いいえ | `false` or `["type" => "object", "properties" => [...]]` | `false` |
| `validation`        | フィールドの検証ルールを定義する JSON スキーマ オブジェクトの配列。 [JSON スキーマによる条件付き可視性と検証](#conditional-visibility-and-validation-via-json-schema)を参照してください。 | いいえ | `[{"type": "object", "properties": {...}}]` | `[]` |
| `sanitize_callback` | 投稿時に顧客が提供した値をサニタイズするために呼び出される関数。                                                              | いいえ        | 下記の例をご覧ください                            | デフォルトでは、フィールドの値は変更されずに返されます。                                                                                                                                                                                                                          |
| `validate_callback` | 顧客が投稿時に入力した値を検証するために呼び出される関数。これはサニタイズ処理の後に実行されます。                              | いいえ        | 下記の例をご覧ください                            | デフォルトの検証関数は、フィールドが必須で値がない場合に応答にエラーを追加します。 [デフォルトの検証機能を参照してください。](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Blocks/Domain/Services/CheckoutFields.php#L270-L281) |

##### `sanitize_callback` の例。この関数は値からスペースを削除します。 <!-- omit from toc -->

```php
'sanitize_callback' => function( $field_value ) {
	return str_replace( ' ', '', $field_value );
},
```

##### `validate_callback`の例。この関数は値がメールアドレスかどうかを確認します <!-- omit from toc -->

```php
'validate_callback' => function( $field_value ) {
	if ( ! is_email( $field_value ) ) {
		return new WP_Error( 'invalid_alt_email', 'Please ensure your alternative email matches the correct format.' );
	}
},
```

#### `text` フィールドのオプション

テキスト フィールドには、上記の一般的なオプション以外に追加のオプションはありません。

#### `select` フィールドのオプション

上記のオプションに加えて、選択フィールドも `options` オプションで登録する必要があります。これは、買い物客が選択できるオプションを指定するために使用されます。

選択フィールドはデフォルトで値が未選択の状態でマウントされます。フィールドが必須の場合、ユーザーは値を選択する必要があります。

フィールドを登録する際に `placeholder` 値を渡すことで、選択フィールドに表示されるプレースホルダを設定できます。これは選択フィールドの最初のオプションとなり、フィールドが必須の場合は選択できません。

| オプション名 | 説明 | 必須? | 例 | デフォルト値 |
|-----|-----|-----|----------------|--------------|
| `options` | 選択入力欄に表示するオプションの配列です。各オプションは、`label` プロパティと `value` プロパティを含む配列である必要があります。各エントリには一意の `value` が必要です。重複するオプションは削除されます。`value` はチェックアウト時にサーバーに送信され、`label` はこの値をユーザーフレンドリーに表現したものです。サーバーに送信されることはありません。 | はい | 以下を参照してください | デフォルトはありません - 必ず指定してください。 |
| `placeholder` | この値が設定されている場合、買い物客は選択時にこのオプションが表示されます。選択が必須の場合、買い物客はこのオプションを選択できません。 | いいえ | `Select a role` | $label を選択 |

##### `options` 値の例

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
| `error_message` | ボックスがチェックされていない場合に表示されるカスタム メッセージ。                            | いいえ | `ご注文の前に、18 歳以上であることを確認する必要があります。` | `続行する場合はこのボックスにチェックを入れてください。` |

### 属性

チェックボックスとテキストフィールドへの属性追加はサポートされています。選択フィールドへの属性追加は**現時点では**できません。

これらの属性は、`input` 要素の HTML 属性と 1:1 でマッピングされます（チェックボックスの `pattern` 属性を除く）。

サポートされている属性は次のとおりです。

- `data-*` 属性
- `aria-*` 属性
- `autocomplete`
- `autocapitalize`
- `pattern` (チェックボックスフィールドではサポートされていません)
- `title`
- `maxLength` (`maxlength` HTML 属性と同等)
- `readOnly` (`readonly` HTML 属性と同等)

`maxLength` と `readOnly` は camelCase になっています。これは、属性がこの形式で受け取る必要がある React 要素でレンダリングされるためです。

`autofocus` と `disabled` といった一部の属性は、意図的にフィールドに渡されません。有効なユースケースが提示された場合は、フィードバックをお待ちしており、この動作を調整いたします。

## 使用例

### テキストフィールドのレンダリング

この例は、住所セクションにテキストフィールドをレンダリングする方法を示しています:

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

これにより、次の住所形式が作成されます (請求書形式も同じになります)。:

![政府IDフィールドが下部に表示された配送先住所フォーム](https://github.com/woocommerce/woocommerce/assets/5656702/f6eb3c6f-9178-4978-8e74-e6b2ea353192)

レンダリングされたマークアップは次のようになります:

```html
	<input type="text" id="shipping-namespace-gov-id" autocapitalize="off"
       autocomplete="government-id" aria-label="custom aria label"
       aria-describedby="some-element" required="" aria-invalid="true"
       title="Title to show on hover" pattern="[A-Z0-9]{5}"
       data-custom="custom data" value="">
```

### チェックボックスフィールドのレンダリング

この例は、連絡先情報セクションのチェックボックスフィールドのレンダリングを示しています。:

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

これにより、連絡先情報セクションは次のようになります。:

![ニュースレター購読チェックボックスが表示された連絡先情報セクション](https://github.com/woocommerce/woocommerce/assets/5656702/7444e41a-97cc-451d-b2c9-4eedfbe05724)

`optionalLabel` が指定されていないため、ラベルに文字列 `(optional)` が追加されていることに注意してください。これを削除するには、`optionalLabel` プロパティを指定して上書きする必要があります。

### 選択フィールドのレンダリング

この例では、注文情報セクションの選択フィールドのレンダリングを示します。:

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

これにより、注文情報セクションは次のようにレンダリングされます。

### フォーカスされる前の選択入力

![フォーカスされる前の選択入力](https://github.com/woocommerce/woocommerce/assets/5656702/bbe17ad0-7c7d-419a-951d-315f56f8898a)

### フォーカス時の選択入力

![フォーカス時の選択入力](https://github.com/woocommerce/woocommerce/assets/5656702/bd943906-621b-404f-aa84-b951323e25d3)

買い物客に値の選択を強制したくない場合は、`required` オプションを `false` に設定して、選択項目を任意としてマークしてください。

## バリデーションとサニタイズ

WordPress アクションフックを使用して、追加のチェックアウトフィールドにカスタムバリデーションとサニタイズを追加できます。

これらのアクションは、次の 2 つの場所で実行されます。

1. チェックアウトプロセス中のフォームの更新と送信、および
2. 「マイアカウント」エリアの住所/連絡先情報の更新。

### サニタイズ

サニタイズは、フィールドの値が特定の形式であることを確認するために使用されます。例えば、政府発行の身分証明書を取得する場合、すべての文字を大文字にし、スペースを含まないようにフォーマットする必要があります。この時点では、値の _妥当性_ チェックは**行いません**。これは後で行います。この手順は、フィールドを検証用に設定することのみを目的としています。

#### `woocommerce_sanitize_additional_field` フィルターの使用

フィールドに対してカスタムサニタイズ関数を実行するには、登録時に `sanitize_callback` 関数を使用するか、`woocommerce_sanitize_additional_field` フィルターを使用します。

| Argument     | タイプ              | 説明                                                             |
|--------------|-------------------|-------------------------------------------------------------------------|
| `$field_value` | `boolean\|string` | フィールドの値。                                                 |
| `$field_key`   | `string` | フィールドのID。これは、フィールドが登録されたIDと同じです。 |

##### サニタイズの例

この例は、上記で追加したサンプルの政府IDフィールド内の空白を削除し、すべての文字を大文字にする方法を示しています。

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

### 検証(バリデーション)

追加のチェックアウトフィールドシステムには、2つの検証フェーズがあります。1つ目は、キーと値に基づいて単一のフィールドを検証することです。

#### 単一フィールドの検証

##### `woocommerce_validate_additional_field` アクションの使用

`woocommerce_validate_additional_field` アクションが実行される際、コールバックはフィールドのキー、値、および `WP_Error` オブジェクトを受け取ります。

レスポンスに検証エラーを追加するには、[`WP_Error::add`](https://developer.wordpress.org/reference/classes/wp_error/add/) メソッドを使用します。

| Argument     | タイプ              | 説明                                                                                                                                                                           |
|--------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `$errors`      | `WP_Error`        | リクエスト処理中に既に発生したエラーを含むエラーオブジェクト。まだエラーが追加されていない場合は、`WP_Error` オブジェクトのままですが、内容は空になります。 |
| `$field_key`   | `string`          | フィールドの ID。これは、フィールドが登録された ID です。                                                                                                                    |
| `$field_value` | `boolean\|string` | フィールドの値                                                                                                                                                                |

###### `WP_Error` オブジェクト

`WP_Error` オブジェクトにエラーを追加する際は、固有のエラーコードを使用する必要があります。エラーコードの先頭にプラグインの名前空間を付けることにより、衝突の可能性を減らすことができます。他のプラグインで既に使用されているコードを使用すると、エラーメッセージが上書きされたり、別の場所に表示される可能性があります。

###### 単一フィールド検証の例

以下の例は、上記の `namespace/gov-id` テキストフィールドにカスタム検証を適用する方法を示しています。このコードは、フィールドが5文字（大文字または数字）で構成されていることを確認します。上記の例のサニタイズ関数は、すべての空白文字を削除し、すべての文字を大文字にすることを保証しているため、このチェックは入力がパターンに一致することを確認するための追加の安全策となります。

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

このアクションは、受け取った `WP_Error` オブジェクトにエラーを _追加_ する必要があることに注意してください。新しい `WP_Error` オブジェクトやその他の値を返すと、エラーは表示されません。

検証エラーが発生していない場合、この関数は void を返すだけで済みます。

#### 複数フィールドの検証

あるフィールドの有効性が別のフィールドの値に依存する場合があります。例えば、購入者の居住国に基づいて政府発行の ID の形式を検証する場合などです。このような場合、上記のように単一のフィールドのみを検証するだけでは不十分です。`woocommerce_validate_additional_field` アクションの実行時に国が不明な場合があるためです。

この問題を解決するには、レンダリングされる場所のコンテキストでフィールドを検証することができます。その場所にある他のフィールドは、このアクションに渡されます。

##### `woocommerce_blocks_validate_location_{location}_fields` アクションの使用

このアクションは、追加フィールドがレンダリング可能な各ロケーション（`address`、`contact`、`order`）に対して実行されます。`address` の場合、請求先住所と配送先住所に対してそれぞれ1回ずつ、計2回実行されます。

コールバックは、同じロケーションにある他の追加フィールドのキーと値を受け取ります。

他のロケーションでレンダリングされるフィールドはこのアクションには渡されないことに注意してください。ただし、顧客オブジェクトまたは注文オブジェクトにアクセスすることでそれらの値を取得できる可能性があります。ただし、これはサポートされておらず、将来のバージョンでの下位互換性は保証されません。

| Argument | タイプ                        | 説明                                                                                                                                                                           |
|----------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `$errors`  | `WP_Error`                  | リクエスト処理中に既に発生したエラーを含むエラーオブジェクト。まだエラーが追加されていない場合は、`WP_Error` オブジェクトのままですが、内容は空になります。 |
| `$fields`  | `array`                     | この場所でレンダリングされるフィールド。                                                                                                                                                |
| `$group`   | `'billing'\|'shipping'\|'other'` | アクションが住所の場所に関するものである場合、ここで住所の種類を設定します。連絡先または注文に関するものである場合は、`other` になります。                                   |

これらのフックは複数の場所で実行されます。

- Checkout ブロックまたは Store API を使用してチェックアウトする場合
    - `woocommerce_blocks_validate_location_address_fields` (x2)
    - `woocommerce_blocks_validate_location_contact_fields`
    - `woocommerce_blocks_validate_location_other_fields`
- 「マイアカウント」エリアで住所を更新する場合
     - `woocommerce_blocks_validate_location_address_fields` (**x1** - 編集対象の住所のみ)
- 「マイアカウント」エリアの「アカウント詳細」セクションを更新する場合
    - `woocommerce_blocks_validate_location_contact_fields`

##### 位置検証(バリデーション)の例

この例では、`namespace/gov-id` と並んで `namespace/confirm-gov-id` という別のフィールドが登録されていると仮定します。このフィールドは、Government ID フィールドの確認用となります。

以下の例は、確認フィールドの値がメインフィールドの値と一致することを検証する方法を示しています。

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

これらのフィールドが「contact」の場所にレンダリングされた場合、使用されるフックが `woocommerce_blocks_validate_location_contact_fields` であることを除いて、コードは同じになります。

## JSON スキーマによる条件付き表示と検証

`required`、`hidden`、`validation` プロパティは、[JSON スキーマ](https://json-schema.org/understanding-json-schema/about) の `array` を受け入れ、フィールドの条件付きロジックを作成します。これにより、他のフィールドの値に基づいて、フィールドの表示、必須ステータス、検証ルールを動的に制御できます。

スキーマはフロントエンドでリアルタイムに評価され、バックエンドでは更新時に評価されます。これにより、高速で応答性の高いUIと、クライアントとサーバー間で一貫した結果が保証されます。

### JSONスキーマ構造

配列内の各スキーマは、プロパティを適用する条件を定義する有効な JSON スキーマオブジェクトである必要があります。スキーマは、すべてのフィールド値と各種オプション（支払い、配送、顧客）を含む、現在のカートとチェックアウトの状態に対して評価されます。

JSON スキーマオブジェクトの基本構造：

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

JSON Schema に馴染みがない場合は、[公式ウェブサイト](https://json-schema.org/understanding-json-schema/basics)、または [AJV](https://ajv.js.org/json-schema.html) や [OPIS](https://opis.io/json-schema/2.x/examples.html) などのライブラリから簡単な概要を入手できます。Checkout は、これら 2 つのライブラリを基盤として抽象化を構築します。

### Document オブジェクト

ルールを記述する際は、Document オブジェクトの部分的なスキーマを記述することになります。これは、フィールドを必須または非表示にする理想的な状態を記述することになります。

**重要:** Document オブジェクト内のすべてのプロパティは、CamelCase ではなく Snake_case の命名規則 (例: `total_price`、`shipping_rates`、`customer_note`) を使用します。

Document オブジェクトの例を以下に示します。:

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


完全なスキーマは次のとおりです。:
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

#### 必須かつ表示されるフィールド

この例では、ローカルピックアップを使用する場合にのみ、フィールドを必須かつ表示するように設定しています。

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

非表示の場合、フィールドの反転が行われることに注意してください。つまり、このフィールドは `prefers_collection` が false の場合にのみ非表示になります。これは、選択されている場合を除いて、ほとんどの場合に当てはまります。上記の例では、[キーワード `const`](https://ajv.js.org/json-schema.html#const) を使用しました。

#### 検証スキーマの例

検証は、条件付きの可視性や要件とは少し異なります。検証では、スキーマのサブセット（フィールドにのみ適用可能）を渡します。その役割は、フィールドを検証し、エラーがあれば表示することです。

この例では、VAT が国コードと 8～12 桁の数字で構成されていることを確認します。

```php
'validation' => [
	"type" => "string",
	"pattern" => "^[A-Z]{2}[0-9]{8,12}$",
	"errorMessage" => "Please enter a valid VAT code with 2 letters for country code and 8-12 numbers."
]
```

検証は他のフィールドに対して行うこともできます。たとえば、現在の電子メールと一致しない代替の電子メール フィールドなどです。:

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

上記の例では、[format キーワード](https://github.com/ajv-validator/ajv-formats) と `$data` を使用して、[JSON ポインタ](https://ajv.js.org/guide/combining-schemas.html#data-reference) 経由で現在のフィールド値を参照しています。また、`errorMessage` プロパティを使用してカスタムエラーメッセージを提供しています。

#### `$data` キーワードと JSON ポインタ

`$data` キーワードは、JSON スキーマで別のフィールドの値を参照する方法です。上記の例では、このキーワードを使用して、[JSON ポインタ](https://ajv.js.org/guide/combining-schemas.html#data-reference) 経由で請求メールを参照しています。

JSON ポインタを扱う際には、いくつか留意すべき点があります。

- スラッシュ `/` は JSON オブジェクト内を移動するために使用します。そのため、追加フィールドの場合、`my-plugin-namespace/my-field` という名前のフィールドは `my-plugin-namespace~1my-field` として参照する必要があります。
- JSON ポインタ内のナビゲーションは、現在のフィールドから後方、またはルートから行うことができます。住所フィールドがあり、例えば電話番号フィールドを検証する場合、配送用と請求用の 2 つの値を検証することになります。そのため、電話番号フィールドを参照する方法は 2 つあります。
    - `0/customer/address/phone` は、ルートナビゲーション（`0/` プレフィックス経由）を使用し、動的な `address` グループを使用します。このグループは、請求値と配送値のどちらを検証するかによって変化します。
    - `1/phone` は、相対ポインタを使用して後方に移動します。この場合、兄弟フィールドである `phone` フィールドにアクセスします。さらに前に戻るには数字を増やします。たとえば、`2/id` は顧客 ID にアクセスします。

### 仕様にないキーワードと値

[JSON Schema Draft-07](https://json-schema.org/draft-07) をサポートしています。これはシンプルで、最新の仕様にあるすべてのキーワードと値をサポートしているわけではありませんが、ほとんどのユースケースをカバーできると考えています。さらに、仕様にはない非標準のキーワードと値もいくつか導入しました。これらの実装は Opis と AJV（または将来の実装）で異なる場合があります。以下に、そのようなキーワードと値の一覧を示します。

- `errorMessage`: 検証用のカスタムエラーメッセージ。AJV では `errorMessage`、Opis では `$error` です。Opis では `errorMessage` のみをサポートし、内部的にマッピングしています。また、現時点では `errorMessage` のテンプレートはサポートしていません。
- `$data`: [JSON ポインター](https://ajv.js.org/guide/combining-schemas.html#data-reference) を介して現在のフィールド値を参照します。Opis と AJV はどちらも同じ実装を使用します。

### 評価ロジック

- `required` の場合: 配列内のスキーマが現在のチェックアウト状態と一致する場合、フィールドは必須になります。
- `hidden` の場合: 配列内のスキーマが現在のチェックアウト状態と一致する場合、フィールドは非表示になります。
- `validation` の場合: フィールドの値は、指定された部分的なスキーマに対して評価され、一致しない場合はエラーが表示されます。

### パフォーマンスに関する考慮事項

複雑な JSON スキーマ条件は、チェックアウトのパフォーマンスに影響を与える可能性があります。スキーマは可能な限りシンプルに保ち、条件の数はユースケースに必要な数に制限してください。

## 後方互換性

技術的な理由により、フィールドにプレフィックスを付けて管理する必要があるため、現時点ではフィールドにメタキーを指定することはできません。ショートコード Checkout に既存のフィールドを持つプラグインは互換性があり、フックを使用してフィールドの読み取りと保存に反応します。

アドレス ステップに `my-plugin-namespace/address-field` という名前のフィールドがあり、注文ステップに `my-plugin-namespace/my-other-field` という名前の 2 つのフィールドがあると仮定すると、次の操作を実行できます。:

### フィールドの保存に反応する

`woocommerce_set_additional_field_value` アクションをフックすることで、保存されたフィールドに対して反応することができます。

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

これにより、既存のシステムと連携が引き続き機能することを保証できます。ただし、理想的には、既存のデータとシステムを新しいメタフィールドを使用するように移行する必要があります。

### フィールドの読み取りへの対応

`woocommerce_get_default_value_for_{$key}` フィルターを使用して、異なるデフォルト値（例えば、別のメタフィールドから取得した値）を指定できます。:

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
