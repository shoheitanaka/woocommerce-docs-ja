---
post_title: WooCommerce payment gateway plugin base
---

# WooCommerce payment gateway plugin base

このコードは、WooCommerce用の独自のシンプルなカスタム決済ゲートウェイを作成するためのベースとして使用できます。カスタムプラグインで使用しない場合は、このコードを子テーマのfunctions.phpファイルに追加するか、[Code snippets](https://wordpress.org/plugins/code-snippets/) プラグインのようなカスタム関数を追加できるプラグインを使用する必要があります。親テーマのfunctions.phpファイルに直接カスタムコードを追加しないでください。

```php
<?php
/*
Plugin Name: WooCommerce <enter name> Gateway
Plugin URI: https://woothemes.com/woocommerce
Description: Extends WooCommerce with an <enter name> gateway.
Version: 1.0
Author: WooThemes
Author URI: https://woothemes.com/
	Copyright: © 2009-2011 WooThemes.
	License: GNU General Public License v3.0
	License URI: http://www.gnu.org/licenses/gpl-3.0.html
*/
add_action('plugins_loaded', 'woocommerce_gateway_name_init', 0);
function woocommerce_gateway_name_init() {
	if ( !class_exists( 'WC_Payment_Gateway' ) ) return;
	/**
 	 * Localisation
	 */
	load_plugin_textdomain('wc-gateway-name', false, dirname( plugin_basename( __FILE__ ) ) . '/languages');
    
	/**
 	 * Gateway class
 	 */
	class WC_Gateway_Name extends WC_Payment_Gateway {
	
		// Go wild in here
	}
	
	/**
 	* Add the Gateway to WooCommerce
 	**/
	function woocommerce_add_gateway_name_gateway($methods) {
		$methods[] = 'WC_Gateway_Name';
		return $methods;
	}
	
	add_filter('woocommerce_payment_gateways', 'woocommerce_add_gateway_name_gateway' );
}
```
