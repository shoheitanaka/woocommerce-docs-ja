---
post_title: Removing checkout fields
sidebar_label: Removing checkout fields
sidebar_position: 5
---

# Removing checkout fields

新しいチェックアウト・ブロックを拡張しようとしている場合、以前の`checkout_fields`が機能していないことに気づくかもしれません。これは意図的なものです。とはいえ、最もよくあるリクエストの1つは、特定の注文タイプでチェックアウトフィールドを無効にする方法です。これは私たちが推奨するものではありませんが、要望が多いため詳細を共有します。

## フィールドの削除を推奨しない理由

単純な理由は、チェックアウトが複雑で、多くのプラグインが異なるデータを必要とするからです。支払い方法は、詐欺検出やカードの検証を実行するために住所情報を必要とし、税金（コアを含む）は正しく税金を計算するために完全な住所を必要とします。私たちがこの解決策に取り組んでいる間、以下の文書はチェックアウトフィールドを削除するのに役立ちます。

## 単一国のフィールドを無効にする

チェックアウトのフィールドは依然としてその国のロケールを尊重しています。つまり、PHPを使ってその国のフィールドを変更することができます。次の請求フォームには10個のフィールドがあり、そのうち7個は必須です：

![Image](https://github.com/user-attachments/assets/63d83769-c20c-4c85-aebf-da8510d1d9ae)

例えば、アルジェリアでは郵便番号と都市名が冗長であることが分かっているので、それらを削除できるとしよう：

```php
add_filter('woocommerce_get_country_locale', function( $locale ) {

	$locale['DZ']['postcode']['required'] = false;
	$locale['DZ']['postcode']['hidden'] = true;

	$locale['DZ']['city']['required'] = false;
	$locale['DZ']['city']['hidden'] = true;

	 return $locale;
});
```

上記のコードでは、これらのフィールドはアルジェリアでは削除されるが、他の国では削除されない。

![Image](https://github.com/user-attachments/assets/96d45e1a-99f0-4b91-92d1-85ee742a9705)

これにより、配送と請求の両方のフィールドが削除されることに留意してください。私たちは、請求の形は配送の形と一致させるべきだと強く考えています。

## 国と名前以外のすべてのフィールドを削除する

私たちは、国以外のフィールドをすべて削除してフォローアップすることができます。どのフィールドを削除するかを知るために国が必要なため、国を削除すると注文が失敗します：

```php
add_filter('woocommerce_get_country_locale', function( $locale ) {

	$locale['DZ']['address_1'] = [
		'required' => false,
		'hidden'   => true,
	];

	$locale['DZ']['postcode'] = [
		'required' => false,
		'hidden'   => true,
	];

	$locale['DZ']['city'] = [
		'required' => false,
		'hidden'   => true,
	];

	$locale['DZ']['company'] = [
		'required' => false,
		'hidden'   => true,
	];
	
	$locale['DZ']['state'] = [
		'required' => false,
		'hidden'   => true,
	];
	
	$locale['DZ']['phone'] = [
		'required' => false,
		'hidden'   => true,
	];

	return $locale;
});
```

これがその結果だ：

![Image](https://github.com/user-attachments/assets/19c82877-3405-4762-82ce-e952746abe66)

アドレス行2が表示されていないことにお気づきだろうが、これはアドレス行1がスキップされると、常にスキップされるからである。

## 会社名と電話番号の削除

ウェブサイトにアクセスできるのであれば）簡単な方法のひとつは、エディターからフィールドをオフに切り替えることだ：

![Image](https://github.com/user-attachments/assets/53740d32-4ccd-4d5e-b08f-91a8b8b7d055)

これが結果だろう：

![Image](https://github.com/user-attachments/assets/3bb8dc23-22cc-4787-8577-648081e57644)

## コードによる会社と電話の削除

他のフィールドとは異なり、電話番号、会社名、住所2の状態は、オプションを介してデータベースに永続化されます：

- `woocommerce_checkout_phone_field`
- `woocommerce_checkout_company_field`
- `woocommerce_checkout_address_2_field`

これらのオプションの値は`required`、`optional`、`hidden`です。これらはフィールドのデフォルト状態を管理します。そのため、編集することはできますが、マーチャントが適切と思うように設定することができます。また、ロケール/国に基づいて編集することもできます。

デフォルト値を編集するには

```php
add_filter(
	'default_option_woocommerce_checkout_phone_field',
	function ( $default_value ) {
		return "required";
	},
	10,
	1
);
```

ロケールによって値を変えたい（その国のマーチャントの値を上書きしたい）場合は、上記の例を使うことができます。

現在までのところ、すべての変更はアルジェリアのみに適用されており、切り替えをされたお客様には、それぞれの国に適したフィールドが表示されます：

![Image](https://github.com/user-attachments/assets/3b8cb49a-1c95-4fab-8aaa-26b14ce22aad)

## 販売するすべての国に変更を適用する。

上記と同様に、これは、あなたが非常に管理された一連の国に販売し、それぞれの国でこれをテストしない限り、私たちがお勧めするものではありません。ペイメントゲートウェイによっては、テストモードではなくプロダクションモードでのみ不正検知を有効にするものもあり、テストモードを通過したフィールドがプロダクションモードでは失敗することもあります：

```php
add_filter('woocommerce_get_country_locale', function( $locale ) {
	foreach ( $locale as $key => $value ) {
		$locale[ $key ]['address_1'] = [
			'required' => false,
			'hidden'   => true,
		];

		$locale[ $key ]['postcode'] = [
			'required' => false,
			'hidden'   => true,
		];

		$locale[ $key ]['city'] = [
			'required' => false,
			'hidden'   => true,
		];

		$locale[ $key ]['state'] = [
			'required' => false,
			'hidden'   => true,
		];
	}

	return $locale;
});
```

上記のコードは、あなたが販売しているすべての郡をループし、そこのフィールドを無効にします。

## 変更をバーチャルカートだけに限定する

バーチャルカートのフィールドを削除することもできます：

```php
add_filter('woocommerce_get_country_locale', function( $locale ) {
	$cart = wc()->cart;

	// Only remove fields if we're operating on a cart.
	if ( ! $cart ) {
		return $locale;
	}

	// Only remove fields if we're dealing with a virtual cart.
	if ( $cart->needs_shipping() ) {
		return $locale;
	}
  // Perform the rest of the logic below...
```

## アドレスカードのテキストを編集する

今後の訪問のために、チェックアウトは保存された住所のためのアドレスカードを表示します：

![Image](https://github.com/user-attachments/assets/ab56c4ca-39ba-47ab-83d1-1ce6dfefc0c3)

`get_address_formats`関数の値は`woocommerce_localisation_address_formats`フィルタを通過するので、PHPを使って編集することができます。

次のコードが使える：

```php
add_filter( 'woocommerce_localisation_address_formats', function( $formats ) {
	foreach ( $formats as $key => $format ) {
		$formats[ $key ] = "{first_name} {last_name}\n{country}";
		// You can also use `{name}` instead of first name and last name.
	}

	return $formats;
} );
```

![Image](https://github.com/user-attachments/assets/2f87e168-896f-44b3-8c4f-63cc2e159d03)

そうしないと改行が認識されない。
