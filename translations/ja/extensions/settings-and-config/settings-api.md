---
post_title: Settings API
---

# Settings API

WooCommerce Settings API は設定を表示、保存、ロードするためにエクステンションによって使用されます。あなたのエクステンションでAPIを利用する最善の方法は`WC_Settings_API`クラスを継承したクラスを作成することです：

```php
class My_Extension_Settings extends WC_Settings_API {
	//
}
```

## フォームフィールドの定義

クラスのコンストラクタで`init_form_fields`というメソッドを使ってフィールドを定義することができます：

```php
$this->init_form_fields();
```

設定をロードする前に、設定を定義しておく必要があります。設定定義は `form_fields` 配列に格納されます：

```php
/**
 * Initialise gateway settings form fields.
 */
function init_form_fields() {
	$this->form_fields = array(
		'title'       => array(
			'title'       => __( 'Title', 'your-text-domain' ),
			'type'        => 'text',
			'description' => __( 'This controls the title which the user sees during checkout.', 'your-text-domain' ),
			'default'     => __( 'PayPal', 'your-text-domain' )
		),
		'description' => array(
			'title'       => __( 'Description', 'your-text-domain' ),
			'type'        => 'textarea',
			'description' => __( 'This controls the description which the user sees during checkout.', 'your-text-domain' ),
			'default'     => __( "Pay via PayPal; you can pay with your credit card if you don't have a PayPal account", 'your-text-domain' )
		)
	);
} // End init_form_fields()
```

(PHP8.2+で "Creation of dynamic property "エラーがスローされないように、クラスが`form_fields`プロパティを初期化していることを確認してください)

上記の例では、TitleとDescriptionの2つの設定を定義しています。Titleはテキストボックスで、Descriptionはテキストエリアです。設定自体のデフォルト値と説明を定義できることに注目してください。

セッティングの定義には以下の書式を使用する：

```php
'setting_name' => array(
	'title'       => 'Title for your setting shown on the settings page',
	'description' => 'Description for your setting shown on the settings page',
	'type'        => 'text|password|textarea|checkbox|select|multiselect',
	'default'     => 'Default value for the setting',
	'class'       => 'Class for the input element',
	'css'         => 'CSS rules added inline on the input element',
	'label'       => 'Label', // For checkbox inputs only.
	'options'     => array( // Array of options for select/multiselect inputs only.
		'key' => 'value'
	),
)
```

## 設定の表示

以下の内容を含む`admin_options`というメソッドを作成する：

```php
function admin_options() {
	?>
	<h2><?php esc_html_e( 'Your plugin name', 'your-text-domain' ); ?></h2>
	<table class="form-table">
		<?php $this->generate_settings_html(); ?>
	</table>
	<?php
}
```

これで設定が正しい形式で出力される。

## 設定の保存

設定を保存するには、クラスの`process_admin_options`メソッドを適切な`_update_options_`フックに追加します。例えば、決済ゲートウェイは決済ゲートウェイフックを使用します：

```php
add_action( 'woocommerce_update_options_payment_gateways', array( $this, 'process_admin_options' ) );
```

他のタイプのプラグインにも同様のフックがある：

```php
add_action( 'woocommerce_update_options_shipping_methods', array( $this, 'process_admin_options' ) );
```

## 設定の読み込み

コンストラクタでは、以前に定義した設定を読み込むことができます：

```php
// Load the settings.
$this->init_settings();
```

その後、settings APIから設定をロードすることができます。上記の`init_settings`メソッドは、settings変数に値を代入してくれる：

```php
// Define user set variables
$this->title       = $this->settings['title'];
$this->description = $this->settings['description'];
```
