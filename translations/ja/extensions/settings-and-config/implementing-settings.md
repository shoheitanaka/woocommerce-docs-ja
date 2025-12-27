---
post_title: Creating custom settings for WooCommerce extensions
sidebar_label: Creating custom settings
sidebar_position: 1
---
# WooCommerceエクステンションのカスタム設定の作成

WooCommerceをカスタマイズしたり、独自の機能を追加したりする場合、おそらく何らかの設定ページが必要になるでしょう。設定ページを作成する最も簡単な方法の1つは、[`WC_Integration` class](https://woocommerce.github.io/code-reference/classes/WC-Integration.html 'WC_Integration Class') を利用することです。Integrationクラスを使用すると、自動的に**WooCommerce > Settings > Integrations**の下に新しい設定ページが作成され、自動的にデータが保存され、サニタイズされます。このチュートリアルでは、新しいインテグレーションを作成する方法を説明します。

## 統合の設定

統合を作成するには少なくとも2つのファイルが必要なので、ディレクトリを作成する必要がある。

### メイン・プラグイン・ファイルの作成

メインプラグインファイルを作成し、`plugins_loaded`フックに[hook](https://developer.wordpress.org/reference/functions/add_action/ 'WordPress add_action()')し、`WC_Integration` [class exists](https://www.php.net/manual/en/language.oop5.basic.php#language.oop5.basic.extends 'PHP Class Exists')が存在するかチェックします。存在しない場合、ユーザーはWooCommerceを有効化していない可能性が高いです。その後、インテグレーションを登録する必要があります。統合ファイルを読み込みます。`woocommerce_integrations`フィルタを使用して、新しいインテグレーションを[array](http://php.net/manual/en/language.types.array.php 'PHP Array')に追加します。

### 統合クラスの作成

フレームワークのセットアップができたので、実際にこのIntegrationクラスを実装してみましょう。すでに`WC_Integration`クラスがあるので、[子クラス](https://www.php.net/manual/en/language.oop5.inheritance.php)を作りたい。こうすることで、既存のメソッドとデータをすべて継承します。統合のために、id、説明、タイトルを設定する必要があります。これらは統合ページに表示されます。を呼び出して設定を読み込む必要があります：また、`$this->init_form_fields();` と `$this->init_settings();` を呼び出して設定を読み込み、`woocommerce_update_options_integration_{your method id}` フックを呼び出してオプションを保存する必要があります。最後に、保存する設定を入力しなければならない！以下に2つのダミー・フィールドを載せましたが、フィールドについては次のセクションで詳しく説明します。

> `class-wc-integration-demo-integration.php`という名前のファイルに追加。

```php
<?php
/**
 * Integration Demo Integration.
 *
 * @package  WC_Integration_Demo_Integration
 * @category Integration
 * @author   Patrick Rauland
 */
if ( ! class_exists( 'WC_Integration_Demo_Integration' ) ) :
    /**
     * Demo Integration class.
     */
    class WC_Integration_Demo_Integration extends WC_Integration {
        /**
         * Init and hook in the integration.
         */
        public function __construct() {
            global $woocommerce;

            $this->id                 = 'integration-demo';
            $this->method_title       = __( 'Integration Demo', 'woocommerce-integration-demo' );
            $this->method_description = __( 'An integration demo to show you how easy it is to extend WooCommerce.', 'woocommerce-integration-demo' );

            // Load the settings.
            $this->init_form_fields();
            $this->init_settings();

            // Define user set variables.
            $this->api_key = $this->get_option( 'api_key' );
            $this->debug   = $this->get_option( 'debug' );

            // Actions.
            add_action( 'woocommerce_update_options_integration_' .  $this->id, array( $this, 'process_admin_options' ) );
        }

        /**
         * Initialize integration settings form fields.
         */
        public function init_form_fields() {
            $this->form_fields = array(
                'api_key' => array(
                    'title'       => __( 'API Key', 'woocommerce-integration-demo' ),
                    'type'        => 'text',
                    'description' => __( 'Enter with your API Key. You can find this in "User Profile" drop-down (top right corner) > API Keys.', 'woocommerce-integration-demo' ),
                    'desc_tip'    => true,
                    'default'     => '',
                ),
                'debug' => array(
                    'title'       => __( 'Debug Log', 'woocommerce-integration-demo' ),
                    'type'        => 'checkbox',
                    'label'       => __( 'Enable logging', 'woocommerce-integration-demo' ),
                    'default'     => 'no',
                    'description' => __( 'Log events such as API requests', 'woocommerce-integration-demo' ),
                ),
            );
        }
    }
endif;
```

> `wc-integration-demo.php`という名前のファイルに追加。

```php
<?php
/**
 * Plugin Name: WooCommerce Integration Demo
 * Plugin URI: https://gist.github.com/BFTrick/091d55feaaef0c5341d8
 * Description: A plugin demonstrating how to add a new WooCommerce integration.
 * Author: Patrick Rauland
 * Author URI: http://speakinginbytes.com/
 * Version: 1.0
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
if ( ! class_exists( 'WC_Integration_Demo' ) ) :
    /**
     * Integration demo class.
     */
    class WC_Integration_Demo {
        /**
         * Construct the plugin.
         */
        public function __construct() {
            add_action( 'plugins_loaded', array( $this, 'init' ) );
        }

        /**
         * Initialize the plugin.
         */
        public function init() {
            // Checks if WooCommerce is installed.
            if ( class_exists( 'WC_Integration' ) ) {
                // Include our integration class.
                include_once 'class-wc-integration-demo-integration.php';
                // Register the integration.
                add_filter( 'woocommerce_integrations', array( $this, 'add_integration' ) );
            } else {
                // throw an admin error if you like
            }
        }

        /**
         * Add a new integration to WooCommerce.
         *
         * @param array Array of integrations.
         */
        public function add_integration( $integrations ) {
            $integrations[] = 'WC_Integration_Demo_Integration';
            return $integrations;
        }
    }
endif;

$WC_Integration_Demo = new WC_Integration_Demo( __FILE__ );

```

## 設定の作成

最後のセクションを読んでいただければ、`init_form_fields()`メソッドを使って2つのダミー設定を追加したことがわかるだろう。

### 設定の種類

WooCommerceは8種類の設定をサポートしています。

-   テキスト
-   価格
-   10進数
-   パスワード
-   テキストエリア
-   チェックボックス
-   選択
-   マルチセレクト

これらの設定には、使用できる属性があります。これらの属性は、設定ページでの見え方や動作に影響を与えます。設定自体には影響しません。属性は、設定の種類によって若干異なります。例えば、プレースホルダーはチェックボックスでは機能しません。どのように動作するかは、[ソースコード](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/abstracts/abstract-wc-settings-api.php 'WC Settings API on GitHub') を参照してください。例

-   タイトル
-   クラス
-   css
-   プレースホルダー
-   説明
-   デフォルト
-   チップ

### 独自の設定を作成する

ビルトインの設定は素晴らしいですが、設定ページを作成するために追加のコントロールが必要な場合があります。そのため、いくつかの方法を用意しました。まず、`$this->form_fields`配列に追加して設定を定義し、`type`に必要なフォーム・コントロールの種類を入力します。HTMLマークアップを出力する `generate_{ type }_html` 形式のメソッドを作成することで、フォーム入力のデフォルトHTMLをオーバーライドできます。ボタンのレンダリング方法を指定するには、`generate_button_html`というメソッドを追加します。textareasの場合は、`generate_textarea_html`メソッドを追加します。(WooCommerceのソースコードで`WC_Settings_API`クラスの`generate_settings_html`メソッドをチェックし、WooCommerceがこれをどのように使用しているかを見てください)。以下の例ではWooCommerce.comにアクセスするボタンを作成しています。

```php
/**
 * Initialize integration settings form fields.
 *
 * @return void
 */
public function init_form_fields() {
	$this->form_fields = array(
		// don't forget to put your other settings here
		'customize_button' => array(
			'title'             => __( 'Customize!', 'woocommerce-integration-demo' ),
			'type'              => 'button',
			'custom_attributes' => array(
				'onclick' => "location.href='https://woocommerce.com'",
			),
			'description'       => __( 'Customize your settings by going to the integration site directly.', 'woocommerce-integration-demo' ),
			'desc_tip'          => true,
		)
	);
}


/**
 * Generate Button HTML.
 *
 * @access public
 * @param mixed $key
 * @param mixed $data
 * @since 1.0.0
 * @return string
 */
public function generate_button_html( $key, $data ) {
	$field    = $this->plugin_id . $this->id . '_' . $key;
	$defaults = array(
		'class'             => 'button-secondary',
		'css'               => '',
		'custom_attributes' => array(),
		'desc_tip'          => false,
		'description'       => '',
		'title'             => '',
	);

	$data = wp_parse_args( $data, $defaults );

	ob_start();
	?>
	<tr valign="top">
		<th scope="row" class="titledesc">
			<label for="<?php echo esc_attr( $field ); ?>"><?php echo wp_kses_post( $data['title'] ); ?></label>
			<?php echo $this->get_tooltip_html( $data ); ?>
		</th>
		<td class="forminp">
			<fieldset<
				<legend class="screen-reader-text"><span><?php echo wp_kses_post( $data['title'] ); ?></span></legend>
				<button class="<?php echo esc_attr( $data['class'] ); ?>" type="button" name="<?php echo esc_attr( $field ); ?>" id="<?php echo esc_attr( $field ); ?>" style="<?php echo esc_attr( $data['css'] ); ?>" <?php echo $this->get_custom_attribute_html( $data ); ?>><?php echo wp_kses_post( $data['title'] ); ?></button>
				<?php echo $this->get_description_html( $data ); ?>
			</fieldset>
		</td>
	</tr>
	<?php
	return ob_get_clean();
}
```

## データの検証とサニタイズ

最高のユーザーエクスペリエンスを実現するために、データを検証し、サニタイズしたいと思うかもしれません。統合クラスはすでに基本的なサニタイズを行っており、悪意のあるコードが存在しないようにしていますが、未使用のデータを削除することでさらにサニタイズを行うことができます。データをサニタイズする例としては、APIキーがすべて大文字のサードパーティ製サービスとの統合があります。APIキーを大文字に変換することで、ユーザーにとって少しわかりやすくなります。

### 消毒

データをサニタイズする方法を最初に説明する。しかし、覚えておいてほしいのは、サニタイズはバリデーションの後に行われるということだ。つまり、バリデーションが行われなければ、サニタイズのステップに進むことはできません。

```php
/**
 * Init and hook in the integration.
 */
public function __construct() {

    // do other constructor stuff first

	// Filters.
	add_filter( 'woocommerce_settings_api_sanitized_fields_' . $this->id, array( $this, 'sanitize_settings' ) );

}

/**
 * Sanitize our settings
 */
public function sanitize_settings( $settings ) {
	// We're just going to make the api key all upper case characters since that's how our imaginary API works
	if ( isset( $settings ) &&
	     isset( $settings['api_key'] ) ) {
		$settings['api_key'] = strtoupper( $settings['api_key'] );
	}
	return $settings;
}
```

### バリデーション

バリデーションは常に必要というわけではないが、やっておいて損はない。APIキーの長さが常に10文字であり、誰かが10文字でないものを入力した場合、エラーメッセージを表示することで、正しく入力したと思い込んでいたユーザーの頭痛の種を防ぐことができる。まず、検証したいフィールドごとに`validate_{setting key}_field`メソッドを設定します。例えば、`api_key`フィールドには`validate_api_key_field()`メソッドが必要です。

```php
public function validate_api_key_field( $key, $value ) {
    if ( isset( $value ) && 20 < strlen( $value ) ) {
        WC_Admin_Settings::add_error( esc_html__( 'Looks like you made a mistake with the API Key field. Make sure it isn&apos;t longer than 20 characters', 'woocommerce-integration-demo' ) );
    }

    return $value;
}
```

## 完全な例

もし、あなたがこのページについてきているのであれば、完全な統合の例があるはずです。何か問題があれば、私たちの[完全な統合デモ](https://github.com/woogists/woocommerce-integration-demo '統合デモ')を参照してください。
