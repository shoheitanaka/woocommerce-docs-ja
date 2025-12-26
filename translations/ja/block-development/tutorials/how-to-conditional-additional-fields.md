---
post_title: How to Add Conditional Additional Checkout Fields
sidebar_label: How to add additional conditional fields in checkout
---
# How to Make Your WooCommerce Additional Checkout Fields Conditionally Visible in Checkout Block

この機能にはWooCommerce 9.9.0以上が必要です。

条件付きの可視性により、必要なときだけ関連フィールドを表示するスマートで適応性のあるチェックアウトフォームを作成することができ、フォームの乱雑さを減らし、カスタマーエクスペリエンスを向上させます。

## なぜ条件付き可視性を使うのか？

条件付きフィールドはあなたを助ける：

* 無関係なフィールドを非表示にすることで、フォームの複雑さを軽減
* 顧客の選択に基づいたダイナミックなチェックアウトフローの作成
* 特定の商品や顧客タイプにのみ特化したフィールドを表示する
* フォームをよりすっきりとさせ、コンバージョン率を向上させる
* 特定の状況でのみ関連するコンテキスト情報を収集する

## コンディションのJSONスキーマを理解する

WooCommerceの追加チェックアウトフィールドは、JSONスキーマを使用して条件ロジックを定義します。JSON Schemaに慣れていなくても心配しないでください - あなたのニーズに合わせて実践的な例を説明します。

基本的な構造はこうだ：

```php
'required' => [
    // Define when to hide here
],
'hidden' => [
    // Define when to hide here
]
```

#よくある条件付きシナリオ

### 配送方法に基づくフィールドの表示

最も一般的な使用例の1つは、特定の配送方法が選択されている場合にのみフィールドを表示することです（例：Local Pickup）：

```php
woocommerce_register_additional_checkout_field(
	array(
		'id'       => 'my-plugin/delivery-instructions',
		'label'    => __('Special delivery instructions', 'your-text-domain'),
		'location' => 'order',
		'type'     => 'text',
		'required' => [
			'cart' => [
				'properties' => [
					'prefers_collection' => [
						'const' => true
					]
				]
			]
		],
		'hidden' => [
			'cart' => [
				'properties' => [
					'prefers_collection' => [
						'const' => false
					]
				]
			]
		]
	)
);
```

### カートの内容に基づいてフィールドを表示

特定の商品がカートに入っているときだけフィールドを表示する：

```php
woocommerce_register_additional_checkout_field(
	array(
		'id'       => 'my-plugin/fragile-handling',
		'label'    => __('This order contains fragile items - special handling required?','your-text-domain'),
		'location' => 'order',
		'type'     => 'checkbox',
		'required' => [
			'cart' => [
				'properties' => [
					'items' => [
						'contains' => [
							'enum' => [2766, 456, 789] // Product IDs for fragile items
						]
					]
				]
			]
		]
	)
);
```

### カートの値に基づいてフィールドを表示する

高額注文にのみプレミアムサービスオプションを表示する：

```php
woocommerce_register_additional_checkout_field(
	array(
		'id'       => 'my-plugin/white-glove-service',
		'label'    => __('Add white glove delivery service?', 'your-text-domain'),
		'location' => 'order',
		'type'     => 'checkbox',
		'hidden' => [
			'cart' => [
				'properties' => [
					'totals' => [
						'properties' => [
							'totalPrice' => [
								'maximum' => 50000 // Hide if cart total is less than $500 (in cents)
							]
						]
					]
				]
			]
		]
	)
);
```

### 顧客の所在地に基づくフィールドの表示

特定の国の顧客にのみフィールドを表示する：

```php
woocommerce_register_additional_checkout_field(
	array(
		'id'       => 'my-plugin/tax-exemption-number',
		'label'    => __('Tax exemption number', 'your-text-domain'),
		'location' => 'address',
		'type'     => 'text',
		'required' => [
			'customer' => [
				'properties' => [
					'address' => [
						'properties' => [
							'country' => [
								'enum' => ['US', 'CA'] // Required only for US and Canada
							]
						]
					]
				]
			]
		],
		'hidden' => [
			'customer' => [
				'properties' => [
					'address' => [
						'properties' => [
							'country' => [
								'not' => [
									'enum' => ['US', 'CA'] // Hide for countries other than US and Canada
								]
							]
						]
					]
				]
			]
		]
	)
);
```

### 他のフィールド値に基づくフィールドの表示

あるフィールドの可視性が別のフィールドの値に依存する従属フィールドを作成する：

```php
// First field - service type selection
woocommerce_register_additional_checkout_field(
	array(
		'id'       => 'my-plugin/service-type',
		'label'    => __('Type of service needed', 'your-text-domain'),
		'location' => 'order',
		'type'     => 'select',
		'options'  => array(
			array( 'value' => 'standard', 'label' => 'Standard' ),
			array( 'value' => 'express', 'label' => 'Express' ),
			array( 'value' => 'custom', 'label' => 'Custom' ),
		),
	)
);

// Second field - only show when "custom" is selected
woocommerce_register_additional_checkout_field(
	array(
		'id'       => 'my-plugin/custom-requirements',
		'label'    => __('Describe your custom requirements', 'your-text-domain'),
		'location' => 'order',
		'type'     => 'text',
		'required' => [
			'checkout' => [
				'properties' => [
					'additional_fields' => [
						'properties' => [
							'my-plugin/service-type' => [
								'const' => 'custom'
							]
						]
					]
				]
			]
							],
		'hidden' => [
			'checkout' => [
				'properties' => [
					'additional_fields' => [
						'properties' => [
							'my-plugin/service-type' => [
								'not' => [
									'const' => 'custom'
								]
							]
						]
					]
				]
			]
		]
	)
);
```

## 実用完全例

ここでは、デジタル商品と物理的商品の両方を提供する店舗の包括的な例を示す：

```php
add_action( 'woocommerce_init', function() {
	if ( ! function_exists( 'woocommerce_register_additional_checkout_field' ) ) {
		return;
	}

	// Delivery preference - only for physical products
	woocommerce_register_additional_checkout_field(
		array(
			'id'       => 'my-store/delivery-preference',
			'label'    => __('Delivery preference', 'your-text-domain'),
			'location' => 'order',
			'type'     => 'select',
			'options'  => array(
				array( 'value' => 'doorstep', 'label' => __('Leave at doorstep', 'your-text-domain') ),
				array( 'value' => 'neighbor', 'label' => __('Leave with neighbor', 'your-text-domain') ),
				array( 'value' => 'pickup_point', 'label' => __('Delivery to pickup point', 'your-text-domain') ),
			),
			'required' => [
				'cart' => [
					'properties' => [
						'needs_shipping' => [
							'const' => true
						]
					]
				]
			],
			'hidden' => [
				'cart' => [
					'properties' => [
						'needs_shipping' => [
							'const' => false
						]
					]
				]
			]
		)
	);

	// Delivery instructions - only when 'doorstep' is selected
	woocommerce_register_additional_checkout_field(
		array(
			'id'       => 'my-store/doorstep-instructions',
			'label'    => __('Specific doorstep delivery instructions', 'your-text-domain'),
			'location' => 'order',
			'type'     => 'text',
			'required' => [
				'checkout' => [
					'properties' => [
						'additional_fields' => [
							'properties' => [
								'my-store/delivery-preference' => [
									'const' => 'doorstep'
								]
							]
						]
					]
				]
								],
			'hidden' => [
				'checkout' => [
					'properties' => [
						'additional_fields' => [
							'properties' => [
								'my-store/delivery-preference' => [
									'not' => [
										'const' => 'doorstep'
									]
								]
							]
						]
					]
				]
			]
		)
	);

	// Digital delivery email - only for digital products
	woocommerce_register_additional_checkout_field(
		array(
			'id'       => 'my-store/digital-delivery-email',
			'label'    => __('Alternative email for digital products', 'your-text-domain'),
			'location' => 'contact',
			'type'     => 'text',
			'required' => [
				'cart' => [
					'properties' => [
						'needs_shipping' => [
							'const' => false
						]
					]
				]
			],
			'hidden' => [
				'cart' => [
					'properties' => [
						'needs_shipping' => [
							'const' => true
						]
					]
				]
			],
			'sanitize_callback' => function ( $field_value ) {
				return sanitize_email( $field_value );
			},
			'validate_callback' => function ( $field_value ) {
				if ( ! is_email( $field_value ) ) {
					return new \WP_Error( 'invalid_alt_email', __('Please ensure your alternative email matches the correct format.', 'your-text-domain') );
				}
			},
		)
	);
});
```

## Available data for conditions

様々なチェックアウト・データに基づいて条件を作成することができます：

1.カート情報：合計金額、商品、送料、クーポン、重量
2.顧客データID、請求/発送先住所、Eメール
3.その他の追加フィールド他のカスタムフィールドからの参照値など

## 次のステップ

条件付きの可視性は、静的なチェックアウトフォームを、顧客のニーズに適応するダイナミックでインテリジェントなインターフェイスに変えます。前回の記事で紹介した基本的な追加フィールドと組み合わせることで、適切な情報を適切なタイミングで収集する洗練されたチェックアウト体験を作成できます。

簡単な条件から実験を始め、JSON スキーマ構文に慣れてきたら、徐々に複雑なロジックを構築してください。顧客は、よりクリーンで、より適切なチェックアウト体験を高く評価するでしょう！
