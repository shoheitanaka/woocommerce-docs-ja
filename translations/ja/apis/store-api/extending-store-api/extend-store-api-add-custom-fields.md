# フィールドを追加して値を渡す

このドキュメントでは、開発者がチェックアウトブロックに入力フィールドを挿入し、その値をストアAPIに渡して、チェックアウト処理時に利用できるようにする方法について説明します。

## 概要

開発者はチェックアウトブロックを拡張して、新しいインナーブロックを追加したり、チェックアウトのPOSTリクエストを通して追加データを処理することができます。これにはGutenbergとWooCommerce Blocksが提供する拡張性インターフェースを活用します。詳しくはチュートリアルをご覧ください：[チュートリアル：WooCommerceチェックアウトブロックの拡張
](https://developer.woocommerce.com/2023/08/07/extending-the-woocommerce-checkout-block-to-add-custom-shipping-options/)を参照してください。

## 前提条件

- ReactとGutenbergブロックエディタの基本的な理解。
- WooCommerce Blocksの拡張性インターフェイスとStore APIに精通していること。

## ステップ・バイ・ステップ・ガイド

### 1.開発環境のセットアップ

プロジェクトに以下のファイルがあることを確認してください：

- `index.js`：Webpackのエントリーポイント、インポート、ブロックタイプの登録。
- `edit.js`: エディターインターフェイスでブロックのレンダリングを処理します。
- `block.json`：ブロックのメタデータと設定を提供します。
- `block.js`：ブロックの状態とユーザーインタラクションを管理します。
- `frontend.js`：チェックアウトブロックコンポーネントをフロントエンドに登録します。

チェックアウトブロックにカスタム配送オプションを追加する例については、[このチュートリアル](https://developer.woocommerce.com/2023/08/07/extending-the-woocommerce-checkout-block-to-add-custom-shipping-options/)を参照してください。

### 2.チェックアウトブロックに新しいフィールドブロックを追加します。

チェックアウト・ブロックにフィールド・ブロックを追加するには、ブロックの`block.json`ファイルに以下の項目を追加する必要があります：

```json
"parent": [ "woocommerce/checkout-shipping-methods-block" ],
"attributes": {
	"lock": {
		"type": "object",
		"default": {
			"remove": true,
			"move": true
		}
	}
}
```

- lock属性](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-templates/#individual-block-locking)は、ブロックを削除または移動できるかどうかを制御するオブジェクトです。デフォルトでは、ロック属性はブロックの削除と移動を許可するように設定されています。しかし、lock属性を変更することで、ブロックを「強制的に」取り外し不可にすることができます。例えば、remove属性とmove属性の両方をfalseに設定することで、ブロックの削除や移動を禁止することができます。
- parent属性](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#parent)は、このブロックが入れ子になる親ブロックを指定します。この属性は、ブロックがレンダリングされる場所を決定します。この例では、ブロックは`woocommerce/checkout-shipping-methods-block`の子です。つまり、このブロックは`woocommerce/checkout-shipping-methods-block`内にレンダリングされます。配送方法ブロックが不要な場合、ブロックはレンダリングされません。

### 3.カスタムチェックアウトデータの設定

関数`setExtensionData`を使用して注文を処理する際に、追加されたフィールドデータを`wc/store/checkout`エンドポイントに送信するように設定できます：

```JavaScript
setExtensionData(
	'namespace-of-your-block',
	'key-of-your-data',
	value
);
```

#### パラメーター

- namespace `string` - ブロックの名前空間。
- key `string` - データのキー。
- value `any` - データの値。

#### 仕組み

 1.INLINE_CODE_0__はpropsを介して内部ブロックに渡される。
 2.INLINE_CODE_2__データストアの`extensionData`キーを更新します。
 3.このキーはチェックアウトエンドポイントへのPOST時にリクエストボディの一部として渡されます。

#### コード例

```JavaScript
// block.js
export const Block = ( { checkoutExtensionData, extensions } ) => {
/**
	 * setExtensionData will update the wc/store/checkout data store with the values supplied. It
	 * can be used to pass data from the client to the server when submitting the checkout form.
	 */
	const { setExtensionData } = checkoutExtensionData;
}

// ... Some code here

useEffect( () => {
/**
	* This code should use `setExtensionData` to update the `key-of-your-data` key
	* in the `namespace-of-your-block` namespace of the checkout data store.
*/
setExtensionData(
	'namespace-of-your-block',
	'key-of-your-data',
	value
);
}, [ setExtensionData, value ] );
```

#### スクリーンショット

setExtensionData呼び出し前後のデータストアを示すRedux Devツールのスクリーンショット：

| 前 | 後 |
| ------ | ----- |
| ![setExtensionData呼び出し前のRedux [Devツール](https://github.com/woocommerce/woocommerce-blocks/assets/14235870/948581f5-fdc2-4df1-963f-9aeb4b18b042) | ![setExtensionData呼び出し後のRedux [Devツール](https://github.com/woocommerce/woocommerce-blocks/assets/14235870/ddc7dbe7-3fad-44cd-bd19-ce78bc49b951) |

### 4.チェックアウト POST リクエストの処理

追加されたフィールドデータを処理するには、Store APIを拡張して、追加データを期待するように指示する必要があります。詳細は[Store [APIでデータを公開する](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/docs/third-party-developers/extensibility/rest-api/extend-store-api-add-data.md)を参照してください。

#### コード例

この例では、以下のPHPファイルを使用します：

- `custom-inner-block-blocks-integration.php`ファイル：チェックアウト・ブロックが使用されているときに、フロントエンドでスクリプト、スタイル、データをエンキューします。詳細は[IntegrationInterface](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/docs/third-party-developers/extensibility/checkout-block/integration-interface.md)のドキュメントを参照してください。

```php
use Automattic\WooCommerce\Blocks\Integrations\IntegrationInterface;

/**
 * Class for integrating with WooCommerce Blocks
 */
class Custom_Inner_Block_Blocks_Integration implements IntegrationInterface {

	/**
	 * The name of the integration.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'new-field-block';
	}

	/**
	 * When called invokes any initialization/setup for the integration.
	 */
	public function initialize() {
		// ... Some code here: (e.g. init functions that registers scripts and styles, and other instructions)
	}

	// ... Other functions here
}
```

- `custom-inner-block-extend-store-endpoint.php`ファイル: [Store [API](https://github.com/woocommerce/woocommerce-blocks/tree/trunk/src/StoreApi) を拡張し、新しいフィールド・ブロック命令を保存および表示するフックを追加します。これはデフォルトではカスタム・ブロックからのデータをどこにも保存しませんが、データをデータベースに保存する独自のロジックを追加することができます。

```php
use Automattic\WooCommerce\Blocks\Package;
use Automattic\WooCommerce\Blocks\StoreApi\Schemas\CartSchema;
use Automattic\WooCommerce\Blocks\StoreApi\Schemas\CheckoutSchema;

/**
 * Your New Field Block Extend Store API.
 */
class Custom_Inner_Block_Extend_Store_Endpoint {
	/**
	 * Stores Rest Extending instance.
	 *
	 * @var ExtendRestApi
	 */
	private static $extend;

	/**
	 * Plugin Identifier, unique to each plugin.
	 *
	 * @var string
	 */
	const IDENTIFIER = 'new-field-block';

	/**
	 * Bootstraps the class and hooks required data.
	 *
	 */
	public static function init() {
		self::$extend = Automattic\WooCommerce\StoreApi\StoreApi::container()->get( Automattic\WooCommerce\StoreApi\Schemas\ExtendSchema::class );
		self::extend_store();
	}

	/**
	 * Registers the actual data into each endpoint.
	 */
	public static function extend_store() {
		if ( is_callable( [ self::$extend, 'register_endpoint_data' ] ) ) {
			self::$extend->register_endpoint_data(
				[
					'endpoint'        => CheckoutSchema::IDENTIFIER,
					'namespace'       => self::IDENTIFIER,
					'schema_callback' => [ 'Custom_Inner_Block_Extend_Store_Endpoint', 'extend_checkout_schema' ],
					'schema_type'     => ARRAY_A,
				]
			);
		}
	}

	/**
	 * Register the new field block schema into the Checkout endpoint.
	 *
	 * @return array Registered schema.
	 *
	 */
	public static function extend_checkout_schema() {
		return [
            'Value_1'   => [
                'description' => 'A description of the field',
                'type'        => 'string', // ... type of the field, this should be a string
                'context'     => [ 'view', 'edit' ], // ... context of the field, this should be an array containing 'view' and 'edit'
                'readonly'    => true, // ... whether the field is readonly or not, this should be a boolean
                'optional'    => true, // ... whether the field is optional or not, this should be a boolean
            ],
			// ... other values
        ];
	}
}
```

- `new-field-block.php`ファイル： `custom-inner-block-blocks-integration.php`と`custom-inner-block-extend-store-endpoint.php`ファイルをロードするメイン・プラグイン・ファイル。

```php
<?php
/**
 * Plugin Name:     New Field Block
 * Version:         1.0
 * Author:          Your Name Here
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     new-field-block
 *
 * @package         create-block
 */

// ... Some code here

/**
 * Include the dependencies needed to instantiate the block.
 */
add_action(
	'woocommerce_blocks_loaded',
	function() {
		require_once __DIR__ . '/custom-inner-block-blocks-integration.php';

		// Initialize our store endpoint extension when WC Blocks is loaded.
		Custom_Inner_Block_Extend_Store_Endpoint::init();

		add_action(
			'woocommerce_blocks_checkout_block_registration',
			function( $integration_registry ) {
				$integration_registry->register( new Custom_Inner_Block_Blocks_Integration() );
			}
		);
	}
);

// ... Some code here
```

チュートリアル](https://developer.woocommerce.com/2023/08/07/extending-the-woocommerce-checkout-block-to-add-custom-shipping-options/)から、チェックアウト処理中にこのカスタムフィールドのデータを取得する方法の例を示します。この例は`shipping-workshop-blocks-integration.php`ファイルのものです。完全なコードはこの[GitHubリポジトリ](https://github.com/woocommerce/wceu23-shipping-workshop-final/blob/main/shipping-workshop-blocks-integration.php#L42-L83)にあります。

```php
private function save_shipping_instructions() {
	/**
	 * We write a hook, using the `woocommerce_store_api_checkout_update_order_from_request` action
	 * that will update the order metadata with the shipping-workshop alternate shipping instruction.
	 *
	 * The documentation for this hook is at: https://github.com/woocommerce/woocommerce-blocks/blob/b73fbcacb68cabfafd7c3e7557cf962483451dc1/docs/third-party-developers/extensibility/hooks/actions.md#woocommerce_store_api_checkout_update_order_from_request
	 */
	add_action(
		'woocommerce_store_api_checkout_update_order_from_request',
		function( \WC_Order $order, \WP_REST_Request $request ) {
			$shipping_workshop_request_data = $request['extensions'][$this->get_name()];
			$alternate_shipping_instruction = $shipping_workshop_request_data['alternateShippingInstruction'];
			$other_shipping_value           = $shipping_workshop_request_data['otherShippingValue'];
			$order->update_meta_data( 'shipping_workshop_alternate_shipping_instruction', $alternate_shipping_instruction );
			$order->save();
		},
		10,
		2
	);
}
```

## 結論

上記のステップに従うことで、WooCommerceチェックアウトブロックに新しいフィールドブロックを追加して処理することができます。完全な実装と追加の例については、提供されている[チュートリアル](https://developer.woocommerce.com/2023/08/07/extending-the-woocommerce-checkout-block-to-add-custom-shipping-options/)と対応する[GitHubリポジトリ](https://github.com/woocommerce/wceu23-shipping-workshop-final/)を参照してください。
