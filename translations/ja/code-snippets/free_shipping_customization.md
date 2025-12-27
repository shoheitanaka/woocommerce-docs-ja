---
post_title: Free Shipping Customizations
sidebar_label: Free shipping customizations
current wccom url: >-
  https://woocommerce.com/document/free-shipping/#advanced-settings-customization
combined with: >-
  https://woocommerce.com/document/hide-other-shipping-methods-when-free-shipping-is-available/#use-a-plugin
---
# 送料無料カスタマイズ

## 送料無料詳細設定/カスタマイズ

### 概要

デフォルトでは、WooCommerceは顧客とカートの内容に一致するすべての配送方法を表示します。つまり、送料無料も定額料金やその他の配送方法と一緒に表示されます。 

他のすべての配送方法を非表示にし、「送料無料」のみを表示するには、カスタムPHPコードまたはプラグイン/エクステンションが必要です。

### コードの追加

スニペットを追加する前に、WooCommerceのキャッシュをクリアしてください。WooCommerce > System Status > Tools > WooCommerce Transients > Clear transientsにアクセスしてください。

## コードスニペット

### 送料無料と表示するには？

次のスニペットは、「送料無料」が利用可能な場合、他のすべての配送方法を非表示にします。

```php
/**
 * Hide other shipping rates when free shipping is available.
 *
 * @param array $rates Array of rates found for the package.
 *
 * @return array
 */
function fsc_hide_shipping_rates_when_free_is_available( $rates ) {
	// Go through each rate found.
	foreach ( $rates as $rate_id => $rate ) {
		// If Free Shipping is found, define it as the only rate and break out of the foreach.
		if ( 'free_shipping' === $rate->method_id ) {
			$rates = [ $rate_id => $rate ];
			break;
		}
	}
	return $rates;
}
add_filter( 'woocommerce_package_rates', 'fsc_hide_shipping_rates_when_free_is_available', 10, 1 );
```

### ローカルピックアップと送料無料のみを表示するにはどうすればよいですか？

次のスニペットは、「無料配送」と「現地受け取り」が利用可能な場合、「無料配送」と「現地受け取り」以外のすべての配送方法を非表示にします。

```php
/**
 * If Free Shipping is available hide other rates, excluding Local Pickup.
 *
 * @param array $rates Array of rates found for the package.
 *
 * @return array
 */
function fsc_hide_shipping_rates_when_free_is_available_excluding_local( $rates ) {
	// Define arrays to hold our Free Shipping and Local Pickup methods, if found.
	$free_shipping = [];
	$local_pickup  = [];

	// Go through each rate received.
	foreach ( $rates as $rate_id => $rate ) {
		// If either method is found, add them to their respective array.
		if ( 'free_shipping' === $rate->method_id ) {
			$free_shipping[ $rate_id ] = $rate;
			continue;
		}
		if ( 'pickup_location' === $rate->method_id ) {
			$local_pickup[ $rate_id ] = $rate;
		}
	}

	// If the free_shipping array contains a method, then merge the local_pickup into it, and overwrite the rates array.
	if ( ! empty( $free_shipping ) ) {
		$rates = array_merge( $free_shipping, $local_pickup );
	}

	return $rates;
}

add_filter( 'woocommerce_package_rates', 'fsc_hide_shipping_rates_when_free_is_available_excluding_local', 10, 1 );
```

### フックによる無料配送の有効化または無効化

送料無料が利用可能かどうかをプログラムで知りたい場合、これは可能です。WooCommerceは以下のようなフィルターを適用します：

```php
return apply_filters( 'woocommerce_shipping_' . $this->id . '_is_available', $is_available );
```

つまり、`woocommerce_shipping_free_shipping_is_available`で`add_filter()`を使用し、送料無料が有効であれば`true`または`false`を受け取ることができます。例えば、次のスニペットは送料無料が利用可能かどうかを記録します：

```php
/**
 * Log if Free Shipping is available or not.
 *
 * @param bool $is_available If Free Shipping is available, then `true`, `false` if not.
 *
 * @return bool
 */
function fsc_free_shipping_is_available( $is_available ) {
	if ( $is_available ) {
		error_log( 'Free shipping is available' );
	} else {
		error_log( 'Free shipping is NOT available' );
	}
	return $is_available;
}
add_filter( 'woocommerce_shipping_free_shipping_is_available', 'fsc_free_shipping_is_available', 10, 1 );
```

### クラスごと／商品ごとの配送方法、分割注文、その他のシナリオを有効にしますか？

[もっと柔軟性が必要ですか？プレミアム配送方法拡張機能](https://woocommerce.com/product-category/woocommerce-extensions/shipping-methods/)をご覧ください。
