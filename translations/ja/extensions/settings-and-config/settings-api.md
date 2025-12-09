---
post_title: Settings API
---

# Settings API

The WooCommerce Settings API is used by extensions to display, save, and load settings. The best way to make use of the API in your extension is to create a class that extends the `WC_Settings_API` class:

```php
class My_Extension_Settings extends WC_Settings_API {
	//
}
```

## Defining form fields

You can define your fields using a method called `init_form_fields` in your class constructor:

```php
$this->init_form_fields();
```

You must have your settings defined before you can load them. Setting definitions go in the `form_fields` array:

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

(Make sure your class initializes the `form_fields` property so that the "Creation of dynamic property" error is not thrown in PHP 8.2+)

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

## Displaying your settings

Create a method called `admin_options` containing the following:

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

## Saving your settings

To have your settings save, add your class's `process_admin_options` method to the appropriate `_update_options_` hook. For example, payment gateways should use the payment gateway hook:

```php
add_action( 'woocommerce_update_options_payment_gateways', array( $this, 'process_admin_options' ) );
```

他のタイプのプラグインにも同様のフックがある：

```php
add_action( 'woocommerce_update_options_shipping_methods', array( $this, 'process_admin_options' ) );
```

## Loading your settings

コンストラクターでは、以前に定義した設定を読み込むことができます：

```php
// Load the settings.
$this->init_settings();
```

After that you can load your settings from the settings API. The `init_settings` method above populates the settings variable for you:

```php
// Define user set variables
$this->title       = $this->settings['title'];
$this->description = $this->settings['description'];
```
