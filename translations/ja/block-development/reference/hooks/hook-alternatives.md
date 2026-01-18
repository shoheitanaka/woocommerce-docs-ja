---
sidebar_label: Hook alternatives
---

# フックの代替

これらは、カート/チェックアウトのショートコードとブロックを読み込む際に実行されるフックです。WooCommerce のライフサイクル全般に関わるフックもあれば、カートページとチェックアウトページに固有のフックもあります。これらのフックは、`do_action` と `apply_filters` の各呼び出しをログに記録し、以前の [WooCommerce ブロックリポジトリ](https://github.com/woocommerce/woocommerce-blocks/) で「フック」と「フィルター」に関する問題を確認することによって生成されました。

## 凡例

| アイコン | 説明 |
| --- | --- |
| ✅ | 完全にサポートされています |
| 🔶 | 部分的にサポートされています |
| ❌ | サポートされていません |
| ❓ | 不明 |

フックが不明 ❓(不明) とマークされている場合、何らかの理由でそのフックがサポートされているかどうかを確認できなかったことを意味します。今後、これらのフックの検証をさらに進めていきます。目標は、どのテーブルにも不明 ❓ ステータスのフックが残らないようにすることです。

### WooCommerce のライフサイクル　_actions_

これらのフックは　Woo　のページがロードされるたびに実行され、ブロックに影響を与えるもの、与えないもの、部分的にしか影響を与えないものがある。

| 古いフック｜ブロックで動く？| 注意事項
| --- | --- | --- |
| `woocommerce_load_cart_from_session` | 完全にサポートされています。
| `woocommerce_cart_loaded_from_session` | 完全にサポートされています。
| 完全にサポートされています。
| `woocommerce_shipping_zone_loaded`｜完全にサポートされています。
| 完全対応 ✅｜`woocommerce_store_api_validate_cart_item` を使う方が良いかもしれない。
| `woocommerce_before_calculate_totals` | 完全にサポートされています。
| `woocommerce_shipping_init` | 完全にサポートされています。
| | `woocommerce_load_shipping_methods` | 完全対応
| | `woocommerce_cart_calculate_fees` | 完全にサポートされています。
| | `woocommerce_calculate_totals` | 完全にサポートされています。
| `woocommerce_after_calculate_totals` | 完全にサポートされています。
| `woocommerce_cart_updated`｜完全にサポートされています。
| `woocommerce_before_get_rates_for_package` | 完全にサポートされています。
| `woocommerce_after_get_rates_for_package` | 完全にサポートされています。
| `woocommerce_checkout_init` | 完全にサポートされています。
| 完全対応 ✅ | | `woocommerce_customer_loaded` | 完全対応

### WooCommerce ライフサイクル _filters_

| 古いフック | ブロックで動作しますか? | 注記 |
| --- | --- | --- |
| `woocommerce_notice_types` | 不明 ❓ | WC Blocks は、コアのもの以外の追加の通知タイプを処理しません。サポートされていない通知は、「情報」通知として表示されます。 |
| `woocommerce_kses_notice_allowed_tags` | 不明 ❓ | |
| `woocommerce_product_get_stock_status` | 完全にサポートされています ✅ | |
| `woocommerce_product_is_in_stock` | 完全にサポートされています ✅ | |
| `woocommerce_product_get_manage_stock` | 不明 ❓ | |
| `woocommerce_product_get_tax_class` | 完全にサポートされています ✅ | |
| `woocommerce_product_get_tax_status` | 不明 ❓ | |
| `woocommerce_prices_include_tax` | 不明 ❓ | |
| `woocommerce_apply_base_tax_for_local_pickup` | 不明 ❓ | |
| `woocommerce_local_pickup_methods` | サポートされていません ❌ | ブロックベースのローカルピックアップ方法には影響しません |
| `woocommerce_customer_get_shipping_postcode` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_shipping_city` | 完全にサポートされています ✅ | |
| `woocommerce_customer_taxable_address` | 不明 ❓ | |
| `woocommerce_shipping_methods` | 完全にサポートされています ✅ | |
| `woocommerce_format_localized_price` | 不明 ❓ | |
| `woocommerce_shipping_local_pickup_option` |サポートされていません ❌ | ブロックベースのローカルピックアップ方法には影響しません |
| `woocommerce_shipping_pickup_location_option` | 不明 ❓ | これを変更することで、カート/チェックアウトでのローカルピックアップの表示方法が変わるかどうかは不明です |
| `woocommerce_shipping_method_supports` | 完全にサポートされています ✅ | |
| `woocommerce_get_tax_location` | 不明 ❓ | |
| `woocommerce_format_postcode` | 不明 ❓ | |
| `woocommerce_matched_tax_rates` | 不明 ❓ | |
| `woocommerce_find_rates` | 不明 ❓ | |
| `woocommerce_matched_rates` | 不明 ❓ | |
| `woocommerce_cart_totals_get_item_tax_rates` | 完全にサポートされています ✅ | |
| `woocommerce_adjust_non_base_location_prices` | 不明 ❓ | |
| `woocommerce_product_is_taxable` | 完全にサポートされています ✅ | |
| `woocommerce_price_ex_tax_amount` | 完全にサポートされています ✅ | |
| `woocommerce_tax_round` | 完全にサポートされています ✅ | |
| `woocommerce_calc_tax` | 完全にサポートされています ✅ | |
| `woocommerce_calculate_item_totals_taxes` | 完全にサポートされています ✅ | |
| `woocommerce_cart_ready_to_calc_shipping` | 完全にサポートされています ✅ | |
| `woocommerce_product_get_virtual` | 完全にサポートされています ✅ | |
| `woocommerce_is_virtual` | 完全にサポートされています ✅ | |
| `woocommerce_product_needs_shipping` | 完全にサポートされています ✅ | |
| `woocommerce_cart_needs_shipping` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_shipping_address_1` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_shipping_address_2` | 完全にサポートされています ✅ | |
| `woocommerce_cart_display_prices_including_tax` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_subtotal` | 完全にサポートされています ✅ | |
| `woocommerce_cart_shipping_packages` | 完全にサポートされています ✅ | |
| `woocommerce_product_get_shipping_class_id` | 完全にサポートされています ✅ | |
| `woocommerce_countries_shipping_countries` | 完全にサポートされています ✅ | |
| `woocommerce_get_zone_criteria` | 完全にサポートされています ✅ | |
| `woocommerce_shipping_zone_shipping_methods` | 完全にサポートされています ✅ | |
| `woocommerce_shipping_free_shipping_is_available` | 不明 ❓ | |
| `woocommerce_product_get_name` | 完全にサポートされています ✅ | |
| `woocommerce_shipping_method_add_rate` | 完全にサポートされています ✅ | |
| `woocommerce_shipping_flat_rate_is_available` | 完全にサポートされています ✅ | |
| `woocommerce_evaluate_shipping_cost_args` | 完全にサポートされています ✅ | |
| `woocommerce_calc_shipping_tax` | 完全にサポートされています ✅ | |
| `woocommerce_localisation_address_formats` | 完全にサポートされています ✅ | |
| `woocommerce_countries_base_country` | 不明 ❓ | |
| `woocommerce_formatted_address_force_country_display` | 不明 ❓ | |
| `woocommerce_states` | 完全にサポートされています ✅ | |
| `woocommerce_formatted_address_replacements` | 不明 ❓ | |
| `woocommerce_package_rates` | 完全にサポートされています ✅ | |
| `woocommerce_shipping_packages` | 完全にサポートされています ✅ | |
| `woocommerce_shipping_rate_method_id` | 完全にサポートされています ✅ | |
| `woocommerce_shipping_rate_taxes` | 完全にサポートされています ✅ | |
| `woocommerce_shipping_rate_cost` | 完全にサポートされています ✅ | |
| `woocommerce_cart_totals_get_fees_from_cart_taxes` | 完全にサポートされています ✅ | |
| `woocommerce_calculated_total` | サポートされていません ❌ | これは効果がないようです |
| `woocommerce_cart_get_discount_total` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_cart_contents_total` | 完全にサポートされています ✅ | |
| `woocommerce_get_price_including_tax` | サポートされていません ❌ | これは効果がないようです |
| `raw_woocommerce_price` | サポートされていません ❌ | これは効果がないようです |
| `formatted_woocommerce_price` | サポートされていません ❌ | これは効果がないようです |
| `woocommerce_price_trim_zeros` | サポートされていません ❌ |これは効果がないようです |
| `woocommerce_get_cart_page_permalink` | サポートされていません ❌ | これは効果がないようです |
| `woocommerce_get_cart_url` | サポートされていません ❌ | これは効果がないようです |
| `woocommerce_checkout_registration_enabled` | 完全にサポートされています ✅ | これは効果がないようです |
| `woocommerce_get_checkout_page_permalink` | サポートされていません ❌ | これは効果がないようです |
| `woocommerce_get_checkout_url` | サポートされていません ❌ | これは効果がないようです |
| `woocommerce_checkout_get_value` | サポートされていません ❌ | これは効果がないようです |
| `woocommerce_default_address_fields` | サポートされていません ❌ | これは効果がないようです |
| `default_checkout_billing_country` | サポートされていません ❌ | これは効果がないようです |
| `default_checkout_shipping_country` | サポートされていません ❌ | これは効果がないようです |
| `woocommerce_get_country_locale` | 完全にサポートされています ✅ | |
| `woocommerce_get_country_locale_default` |不明 ❓ | |
| `woocommerce_get_country_locale_base` | 不明 ❓ | |
| `woocommerce_billing_fields` | 部分的にサポート 🔶 | コアフィールドの編集はサポートされていませんが、追加は追加のチェックアウトフィールド API を介して行われます |
| `woocommerce_shipping_fields` | 部分的にサポート 🔶 | コアフィールドの編集はサポートされていませんが、追加は追加のチェックアウトフィールド API を介して行われます |
| `woocommerce_checkout_fields` | 部分的にサポート 🔶 | コアフィールドの編集はサポートされていませんが、追加は追加のチェックアウトフィールド API を介して行われます |
| `woocommerce_cart_item_product` | サポートされていません ❌ | 個々のカートアイテムを変更することはできません |
| `woocommerce_payment_gateway_supports` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_first_name` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_last_name` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_company` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_address_1` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_address_2` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_city` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_postcode` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_phone` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_shipping_first_name` |完全にサポートされています ✅ | |
| `woocommerce_customer_get_shipping_last_name` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_shipping_company` | 完全にサポートされています ✅ | |
| `woocommerce_get_item_data` | 部分的にサポートされています 🔶 | チェックアウト ブロックはメタデータからほとんどの HTML を削除し、a、b、em、i、strong、br、abbr、span のみを許可します。 |
| `woocommerce_cart_get_subtotal_tax` | サポートされていません ❌ | これは効果がないようです |
| `woocommerce_shipping_package_name` | 完全にサポートされています ✅ | |
| `woocommerce_shipping_rate_id` | 不明 ❓ | |
| `woocommerce_shipping_rate_label` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_shipping_taxes` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_fee_taxes` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_taxes` | 完全にサポートされています ✅ | |
| `woocommerce_rate_code` | 不明 ❓ | |
| `woocommerce_rate_compound` | 不明 ❓ | |
| `woocommerce_rate_label` | 完全にサポートされています ✅ | |
| `woocommerce_cart_hide_zero_taxes` | 不明 ❓ | |
| `woocommerce_cart_tax_totals` | 完全にサポートされています ✅ | |
| `woocommerce_cart_needs_payment` | 完全にサポートされています ✅ | |
| `woocommerce_order_class` | 完全にサポートされています ✅ | |
| `woocommerce_checkout_registration_required` | 不明 ❓ | |
| `woocommerce_privacy_policy_page_id` | 完全にサポートされています ✅ | |
| `woocommerce_get_terms_page_id` | 不明 ❓ | |
| `woocommerce_terms_and_conditions_page_id` | 不明 ❓ | |
| `woocommerce_cart_contents_count` | 不明 ❓ | |
| `woocommerce_country_locale_field_selectors` | サポートされていません ❌ | |
| `woocommerce_get_return_url` | 完全にサポートされています ✅ | |
| `woocommerce_cart_hash` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_fee_tax` | 完全にサポートされています ✅ | |
| `woocommerce_customer_default_location_array` | 完全にサポートされています ✅ | |
| `woocommerce_countries` | 完全にサポートされています ✅ | |
| `woocommerce_sort_countries` | サポートされていません ❌ | 効果がないようです |
| `woocommerce_countries_allowed_countries` | 完全にサポートされています ✅ | |
| `woocommerce_customer_default_location_array` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_country` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_shipping_country` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_state` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_shipping_state` | 完全にサポートされています ✅ | |
| `woocommerce_customer_get_billing_email` | 完全にサポートされています ✅ | |
| `woocommerce_cart_session_initialize` | 完全にサポートされています ✅ | |
| `woocommerce_get_checkout_page_id` | 完全にサポートされています ✅ | |
| `woocommerce_get_cart_page_id` | 完全にサポートされています ✅ | |
| `woocommerce_is_checkout` | 完全にサポートされています ✅ | |
| `woocommerce_currency` | 完全にサポートされています ✅ | |
| `woocommerce_currency_symbols` | 完全にサポートされています ✅ | |
| `woocommerce_currency_symbol` | 完全にサポートされています ✅ | |
| `woocommerce_price_format` | 完全にサポートされています ✅ | |
| `woocommerce_coupons_enabled` | 完全にサポートされています ✅ | |
| `woocommerce_get_shop_page_id` | 完全にサポートされています ✅ | |
| `current_theme_supports-woocommerce` | 完全にサポートされています ✅ | |
| `woocommerce_payment_gateways` | 部分的にサポートされています対応済み 🔶 | WC ブロックとの統合は引き続き必要です。ゲートウェイの設定解除以外に、ここでの支払いゲートウェイの操作は、Cart ブロックと Checkout ブロックでは機能しない可能性があります。 |
| `woocommerce_get_base_location` | 完全にサポートされています ✅ | |
| `woocommerce_gateway_icon` | サポートされていません ❌ | アイコンが表示されないため、このフックは効果がありません。 |
| `woocommerce_get_image_size_thumbnail` | 完全にサポートされています ✅ | |
| `woocommerce_get_image_size_single` | 完全にサポートされています ✅ | |
| `woocommerce_product_stock_status_options` | 完全にサポートされています ✅ | |
| `woocommerce_cart_item_name` | サポートされていません ❌ | [`itemName` チェックアウト フィルター](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#2-itemname) を使用します。 |
| `woocommerce_product_get_status` | 完全にサポートされています ✅ | |
| `woocommerce_product_get_price` | 完全にサポートされています ✅ | |
| `woocommerce_is_purchasable` | 完全にサポートされています ✅ | |
| `woocommerce_cart_item_is_purchasable` | 完全にサポートされています ✅ | |
| `woocommerce_cart_item_data_to_validate` | 完全にサポートされています ✅ | |
| `woocommerce_get_cart_item_from_session` | 完全にサポートされています ✅ | |
| `woocommerce_cart_contents_changed` | 完全にサポートされています ✅ | |
| `woocommerce_get_cart_contents` | 完全にサポートされています ✅ | |
| `woocommerce_stock_amount` | 完全にサポートされています ✅ | |
| `woocommerce_cart_item_remove_link` | サポートされていません ❌ | [`showRemoveItemLink` チェックアウト フィルター](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#4-showremoveitemlink) を使用してください。 |
| `woocommerce_cart_item_quantity` | サポートされていません ❌ | これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能です。 |
| `woocommerce_product_get_image` | サポートされていません ❌ | `woocommerce_store_api_cart_item_images` を使用してください ([PR リンク](https://github.com/woocommerce/woocommerce/pull/52310) に例があります。) |
| `woocommerce_cart_no_shipping_available_html` | サポートされていません ❌ | 編集できません |
| `woocommerce_available_payment_gateways` | 部分的にサポートされています 🔶 | WC ブロックとの統合は引き続き必要です。ゲートウェイの設定解除以外に、ここでの支払いゲートウェイの操作は、カート ブロックとチェックアウト ブロックでは機能しない可能性があります |
| `woocommerce_cart_get_total` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_fee_tax` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_cart_contents_tax` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_shipping_tax` | 完全にサポートされています ✅ | |
| `woocommerce_cart_get_shipping_total` | 完全にサポートされています ✅ | |

### カート・アクション

| 古いフック｜ブロックで動く？| 注意事項
| --- | --- | --- |
| `woocommerce_before_cart` | サポートされていません。カートアイテム "ブロックにインナーブロックを追加することは可能かもしれませんが、マーチャントが手動で配置する必要があります。また、[`render_block_{$name}`](https://developer.wordpress.org/reference/hooks/render_block_this-name/) フィルタを使用して、PHP を使用してブロックの前後にレンダリングすることも可能です。|
| `woocommerce_before_cart_table` | サポートされていません ❌｜この領域に相当するものはなく、Slot/fillもありません。カートアイテム "ブロックにインナーブロックを追加すればうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_before_cart_contents` | サポートされていません ❌｜この領域に相当するものはなく、Slot/fillもありません。多分、"Cart items "ブロックにインナーブロックを追加すればうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_after_cart_item_name`｜ サポートされていません ↪So_274｜ [`itemName` チェックアウトフィルター](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#2-itemname)を使用してください。|
| `woocommerce_before_quantity_input_field` | サポートされていません ❌ | 現在、同等のものはありません。|
| `woocommerce_after_quantity_input_field` | サポートされていません。|
| `woocommerce_cart_contents` | サポートされていません ❌ | 特定の等価物はなく、このエリアのスロット/フィルもありません。多分、"Cart items "ブロックにインナーブロックを追加すればうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| [`ExperimentalDiscountsMeta` slot/fill](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#3-experimentaldiscountsmeta) | サポートされていません。
| [`woocommerce_cart_actions` スロット/フィル](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#0-experimentalordermeta) | サポートされていません。
| `woocommerce_after_cart_contents` | サポートされていません ❌｜この領域には、特に相当するものはなく、Slot/fillもありません。多分、"Cart items "ブロックにインナーブロックを追加すればうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_after_cart_table` | サポートされていません。多分、"Cart items "ブロックにインナーブロックを追加すればうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_before_cart_collaterals` | サポートされていません。多分、"Cart items "ブロックにインナーブロックを追加すればうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_cart_collaterals` | サポートされていません ❌｜この領域に相当するものはなく、Slot/fillもありません。多分、"Cart items "ブロックにインナーブロックを追加すればうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| [`ExperimentalOrderMeta` slot/fill](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#0-experimentalordermeta) | サポートされていません。
| [`woocommerce_cart_totals_before_shipping` スロット/フィル](__URL_4__) | サポートされていません。
| [ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages) | サポートされていません。
| `woocommerce_before_shipping_calculator` | サポートされていません ❌ | 特に同等のものはありません。最も近いのはExperimentalOrderShippingPackagesです。
| `woocommerce_after_shipping_calculator` | サポートされていません。最も近いものはExperimentalOrderShippingPackagesです。
| `woocommerce_cart_totals_after_shipping` | サポートされていません。最も近いものはExperimentalOrderShippingPackagesです。
|`woocommerce_cart_totals_before_order_total` | サポートされていません ❌ | 特に同等のものはありませんが、合計フッターの項目フィルターがあります。
| `woocommerce_cart_totals_after_order_total` | サポートされていません ❌ | 特に同等のものはありませんが、合計フッター項目フィルターがあります。
| `woocommerce_proceed_to_checkout` | サポートされていません ❌ | 特に相当するものはありませんが、チェックアウトとプレースオーダーボタンのフィルターは機能する可能性があります。
| `woocommerce_after_cart_totals` | サポートされていません ❌ | [`ExperimentalOrderMeta` slot/fill](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#0-experimentalordermeta)|。
| `woocommerce_after_cart` | サポートされていません ❌ | このエリアには、特に相当するものはなく、Slot/fillもありません。多分、"Cart items "ブロックにインナーブロックを追加すればうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|

### カート _filters_

| 古いフック | ブロックで動作しますか? | 注記 |
| --- | --- | --- |
| `woocommerce_before_cart` | サポートされていません ❌ | この領域には、同等のフックや Slot/fill はありません。「カートアイテム」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。また、[`render_block_{$name}`](https://developer.wordpress.org/reference/hooks/render_block_this-name/) フィルターを使用して、PHP でブロックの前後をレンダリングすることもできます。 |
| `woocommerce_before_cart_table` | サポートされていません ❌ | この領域には、同等のフックや Slot/fill はありません。「カートアイテム」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_before_cart_contents` | サポートされていません ❌ |この領域には、対応するスロット/フィルがありません。「カートアイテム」ブロックに内部ブロックを追加することで解決できるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_after_cart_item_name` | サポートされていません ❌ | [`itemName` チェックアウトフィルター](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#2-itemname)を使用してください。 |
| `woocommerce_before_quantity_input_field` | サポートされていません ❌ | 現在、対応するスロット/フィルはありません。 |
| `woocommerce_after_quantity_input_field` | サポートされていません ❌ | 現在、対応するスロット/フィルはありません。 |
| `woocommerce_cart_contents` | サポートされていません ❌ | この領域には、対応するスロット/フィルがありません。 「カートアイテム」ブロックに内部ブロックを追加することで解決できるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_cart_coupon` | サポートされていません ❌ | [`ExperimentalDiscountsMeta` slot/fill](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#3-experimentaldiscountsmeta) |
| `woocommerce_cart_actions` | サポートされていません ❌ | [`ExperimentalOrderMeta` slot/fill](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#0-experimentalordermeta) |
| `woocommerce_after_cart_contents` | サポートされていません ❌ | この領域には同等の要素や Slot/fill がありません。 「カートアイテム」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_after_cart_table` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルはありません。「カートアイテム」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_before_cart_collat​​erals` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルはありません。「カートアイテム」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_cart_collat​​erals` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルはありません。「カートアイテム」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_before_cart_totals` | サポートされていません ❌ | [`ExperimentalOrderMeta` slot/fill](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#0-experimentalordermeta) |
| `woocommerce_cart_totals_before_shipping` | サポートされていません ❌ | [ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages) |
| `woocommerce_after_shipping_rate` | サポートされていません ❌ | [ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages) |
| `woocommerce_before_shipping_calculator` | サポートされていません ❌ | 同等のものは特にありません。最も近いものは ExperimentalOrderShippingPackages です |
| `woocommerce_after_shipping_calculator` | サポートされていません ❌ | 同等のものは特にありません。最も近いものは ExperimentalOrderShippingPackages です |
| `woocommerce_cart_totals_after_shipping` | サポートされていません ❌ | 同等のものは特にありません。最も近いものは ExperimentalOrderShippingPackages です |
| `woocommerce_cart_totals_before_order_total` | サポートされていません ❌ |同等のものは特にありませんが、合計フッター項目フィルターはあります |
| `woocommerce_cart_totals_after_order_total` | サポートされていません ❌ | 同等のものは特にありませんが、合計フッター項目フィルターはあります |
| `woocommerce_proceed_to_checkout` | サポートされていません ❌ | 同等のものは特にありませんが、チェックアウトおよび注文ボタンフィルターは機能する可能性があります |
| `woocommerce_after_cart_totals` | サポートされていません ❌ | [`ExperimentalOrderMeta` slot/fill](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#0-experimentalordermeta) |
| `woocommerce_after_cart` | サポートされていません ❌ | この領域には同等のものは特になく、Slot/fill もありません。 「カートアイテム」ブロックに内部ブロックを追加すればうまくいくかもしれませんが、販売者が手動で配置する必要があります。|

### Cart _filters_

| 古いフック | ブロック内で動作しますか？ | 注記 |
| --- | --- | --- |
| `woocommerce_cart_item_product_id` | サポートされていません ❌ | 効果がないようです |
| `woocommerce_cart_item_visible` | サポートされていません ❌ | 効果がないようです効果はありません |
| `woocommerce_get_remove_url` | サポートされていません ❌ | アイテムの削除は、Cart ブロックで非同期に処理されます。 |
| `woocommerce_cart_item_remove_link` | サポートされていません ❌ | アイテムの削除は、Cart ブロックで非同期に処理されます。 |
| `woocommerce_cart_item_thumbnail` | サポートされていません ❌ | この方法でサムネイルを変更することはサポートされていません。`woocommerce_store_api_cart_item_images` ([PR リンク](https://github.com/woocommerce/woocommerce/pull/52310) の例を参照してください。) を参照してください。 |
| `woocommerce_cart_product_price` | サポートされていません ❌ | |
| `woocommerce_cart_item_price` | サポートされていません ❌ | |
| `woocommerce_quantity_input_classes` | サポートされていません ❌ | |
| `woocommerce_quantity_input_max` | サポートされていません ❌ | これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能です。 |
| `woocommerce_quantity_input_min` | サポートされていません ❌ | これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能です。 |
| `woocommerce_quantity_input_step` | サポートされていません ❌ | これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能です。 |
| `woocommerce_quantity_input_pattern` | サポートされていません ❌ | これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能になります。 |
| `woocommerce_quantity_input_inputmode` | サポートされていません ❌ | これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能になります。 |
| `woocommerce_quantity_input_placeholder` | サポートされていません ❌ | これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能になります。 |
| `woocommerce_quantity_input_autocomplete` | サポートされていません ❌ |これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能です。|
| `woocommerce_quantity_input_args` | サポートされていません ❌ | これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能です。|
| `woocommerce_quantity_input_type` | サポートされていません ❌ | これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターでカート項目の quantity_limits プロパティを変更することで可能です。|
| `woocommerce_cart_item_quantity` | サポートされていません ❌ |これは、`woocommerce_store_api_product_quantity_{$value_type}` フィルターのカートアイテムの quantity_limits プロパティを変更することで可能です。 |
| `woocommerce_cart_product_subtotal` | サポートされていません ❌ | |
| `woocommerce_cart_item_subtotal` | サポートされていません ❌ | |
| `woocommerce_cross_sells_columns` | サポートされていません ❌ | クロスセルは内部ブロックとしてレンダリングされます。 |
| `woocommerce_cross_sells_orderby` | サポートされていません ❌ | クロスセルは内部ブロックとしてレンダリングされます。 |
| `woocommerce_cross_sells_order` | サポートされていません ❌ | クロスセルは内部ブロックとしてレンダリングされます。 |
| `woocommerce_cross_sells_total` | サポートされていません ❌ |クロスセルは内部ブロックとしてレンダリングされます。 |
| `woocommerce_product_cross_sells_products_heading` | サポートされていません ❌ | これはエディターで変更できます。 |
| `woocommerce_is_downloadable` | サポートされていません ❌ | カート/チェックアウト ブロックには影響しないようです。 |
| `woocommerce_loop_product_link` | サポートされていません ❌ | カート ブロックでは、商品リンクの変更はサポートされていません。 |
| `woocommerce_product_loop_title_classes` | サポートされていません ❌ | カート ブロックでは、クラスを商品タイトルに変更することはサポートされていません。 |
| `woocommerce_product_add_to_cart_aria_describeby` | サポートされていません ❌ | カート ブロックでは、商品の `aria-scribeby` の変更はサポートされていません。 |
| `woocommerce_sale_flash` | サポートされていません ❌ |これは、[`saleBadgePriceFormat` チェックアウト フィルター](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#3-salebadgepriceformat) で変更できます。 |
| `woocommerce_cart_subtotal` | サポートされていません ❌ | カート/チェックアウト ブロックでは、カートの小計表示の変更はサポートされていません |
| `oocommerce_shipping_package_details_array` | サポートされていません ❌ | このフックは、カート ブロックのレンダリング中には実行されません |
| `woocommerce_shipping_show_shipping_calculator` | サポートされていません ❌ | これは、ブロック内では実行されない、カート テンプレートのレンダリング時にのみ使用されます。 |
| `woocommerce_cart_shipping_method_full_label` | サポートされていません ❌ | このフックは、カート/チェックアウト ブロックでは効果がありません。 |
| `woocommerce_get_shipping_tax` | サポートされていません ❌ | このフィルターは、Cart/Checkout ブロックでは使用されません。 |
| `woocommerce_shipping_calculator_enable_country` | サポートされていません ❌ | このフィルターは、Cart/Checkout ブロックでは使用されません。 |
| `woocommerce_shipping_calculator_enable_state` | サポートされていません ❌ | このフィルターは、Cart/Checkout ブロックでは使用されません。 |
| `woocommerce_shipping_calculator_enable_city` | サポートされていません ❌ | このフィルターは、カート/チェックアウト ブロックでは使用されません。 |
| `woocommerce_shipping_calculator_enable_postcode` | サポートされていません ❌ | このフィルターは、カート/チェックアウト ブロックでは使用されません。 |
| `woocommerce_cart_totals_fee_html` | サポートされていません ❌ | カート/チェックアウト ブロックでは、手数料の表示の変更はサポートされていません。 |
| `woocommerce_countries_estimated_for_prefix` | サポートされていません ❌ | |
| `woocommerce_cart_total` | サポートされていません ❌ | このフックを使用してカートの合計を変更することは、カート/チェックアウト ブロックではサポートされていません。 |
| `woocommerce_cart_totals_order_total_html` | サポートされていません ❌ |このフックを使用したカート合計の変更は、Cart/Checkout ブロックではサポートされていません |

### チェックアウト _actions_

| 古いフック | ブロックで動作しますか? | 注記 |
| --- | --- | --- |
| `woocommerce_before_checkout_form_cart_notices` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィル要素がありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_before_checkout_form` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィル要素がありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_before_customer_details` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィル要素がありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_billing` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルがありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_before_checkout_billing_form` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルがありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_after_checkout_billing_form` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルがありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_shipping` | サポートされていません ❌ |位置の問題で直接同等ではありませんが、[ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages) は機能する可能性があります。そのため、配送ブロックに内部ブロックを追加することもできます。 |
| `woocommerce_before_checkout_shipping_form` | サポートされていません ❌ | 位置の問題で直接同等ではありませんが、[ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages) は機能する可能性があります。そのため、配送ブロックに内部ブロックを追加することもできます。 |
| `woocommerce_after_checkout_shipping_form` | サポートされていません ❌ |配置の関係で直接同等ではありませんが、[ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages) が機能する可能性があります。また、配送ブロックに内部ブロックを追加することもできます。 |
| `woocommerce_before_order_notes` | サポートされていません ❌ | この領域には同等のものはなく、スロット/フィルもありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_after_order_notes` | サポートされていません ❌ | この領域には同等のものはなく、スロット/フィルもありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_after_customer_details` | サポートされていません ❌ |このエリアには、対応する要素がなく、スロット/フィルもありません。「チェックアウトフィールド」ブロックに内部ブロックを追加することで解決できるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_before_order_review_heading` | サポートされていません ❌ | このエリアには、対応する要素がなく、スロット/フィルもありません。「チェックアウト注文概要」ブロックに内部ブロックを追加することで解決できるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_before_order_review` | サポートされていません ❌ | このエリアには、対応する要素がなく、スロット/フィルもありません。「チェックアウト注文概要」ブロックに内部ブロックを追加することで解決できるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_order_review` | サポートされていません ❌ | このエリアには、対応する要素がなく、スロット/フィルもありません。 「チェックアウト注文概要」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_before_cart_contents` | サポートされていません ❌ | この領域には同等の要素がなく、スロット/フィルもありません。「チェックアウト注文概要」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_after_cart_contents` | サポートされていません ❌ | この領域には同等の要素がなく、スロット/フィルもありません。「チェックアウト注文概要」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_before_shipping` | サポートされていません ❌ | この領域には同等の要素がなく、スロット/フィルもありません。「チェックアウト注文概要」ブロックに内部ブロックを追加することはできるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_after_shipping_rate` | サポートされていません ❌ | この領域には対応するスロットやフィルがありません。内側のbを追加する必要があるかもしれません。「チェックアウト注文概要」ブロックへのロックは機能しますが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_after_shipping` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルはありません。「チェックアウト注文概要」ブロックに内部ブロックを追加することは機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_before_order_total` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルはありません。「チェックアウト注文概要」ブロックに内部ブロックを追加することは機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_after_order_total` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルはありません。「チェックアウト注文概要」ブロックに内部ブロックを追加することは機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_before_payment` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルがありません。「チェックアウト フィールド」ブロックまたは支払いブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_before_terms_and_conditions` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルがありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_terms_and_conditions` | サポートされていません ❌ | この領域には、同等の要素やスロット/フィルがありません。「チェックアウト フィールド」ブロックに内部ブロックを追加することで機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_after_terms_and_conditions` | サポートされていません ❌ |このエリアには、同等の要素やスロット/フィルがありません。「チェックアウトフィールド」ブロックに内部ブロックを追加することで解決できるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_before_submit` | サポートされていません ❌ | このエリアには、同等の要素やスロット/フィルがありません。「チェックアウトフィールド」ブロックに内部ブロックを追加することで解決できるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_after_submit` | サポートされていません ❌ | このエリアには、同等の要素やスロット/フィルがありません。「チェックアウトフィールド」ブロックに内部ブロックを追加することで解決できるかもしれませんが、販売者が手動で配置する必要があります。 |
| `woocommerce_review_order_after_payment` | サポートされていません ❌ | このエリアには、同等の要素やスロット/フィルがありません。 「チェックアウト フィールド」ブロックまたは支払いブロックに内部ブロックを追加すると機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_after_order_review` | サポートされていません ❌ | この領域には同等の要素がなく、スロット/フィルもありません。「チェックアウト 注文概要」ブロックに内部ブロックを追加すると機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_after_checkout_form` | サポートされていません ❌ | この領域には同等の要素がなく、スロット/フィルもありません。「チェックアウト フィールド」ブロックに内部ブロックを追加すると機能する可能性がありますが、販売者が手動で配置する必要があります。 |
| `woocommerce_checkout_update_order_review` | サポートされていません ❌ | これらのタイプの AJAX イベントは、カート/チェックアウト ブロックの使用時には発生しません。 |

### チェックアウト _filters_

| 古いフック | ブロックで動作しますか? | 注記 |
| --- | --- | --- |
| `woocommerce_add_notice` | 部分的にサポートされています 🔶 | これらの通知は、Cart/Checkout ブロックのページ読み込み時にのみ追加されます。API リクエスト中に発生した通知はすべて保存され、次のページ全体の読み込み時に出力されます。 |
| `woocommerce_checkout_coupon_message` | サポートされていません ❌ | このフィルターを使用してクーポンメッセージをカスタマイズすることはできません。 |
| `woocommerce_form_field_args` | サポートされていません ❌ | Cart/Checkout ブロックでは、コアフォームフィールドの変更はまだサポートされていません。 |
| `woocommerce_form_field_text` | サポートされていません ❌ | Cart/Checkout ブロックでは、コアフォームフィールドの変更はまだサポートされていません。 |
| `woocommerce_form_field` | サポートされていません ❌ | Cart/Checkout ブロックでは、コアフォームフィールドの変更はまだサポートされていません。 |
| `woocommerce_form_field_country` | サポートされていません ❌ | カート/チェックアウト ブロックでは、コア フォーム フィールドの変更はまだサポートされていません。 |
| `woocommerce_form_field_state` | サポートされていません ❌ | カート/チェックアウト ブロックでは、コア フォーム フィールドの変更はまだサポートされていません。 |
| `woocommerce_form_field_tel` | サポートされていません ❌ | カート/チェックアウト ブロックでは、コア フォーム フィールドの変更はまだサポートされていません。 |
| `woocommerce_form_field_email` | サポートされていません ❌ | カート/チェックアウト ブロックでは、コア フォーム フィールドの変更はまだサポートされていません。 |
| `woocommerce_cart_needs_shipping_address` | サポートされていません ❌ | これを制御するには、[`wc/store/cart` データ ストア](../data-store/cart.md) を使用する必要があります。 |
| `woocommerce_ship_to_different_address_checked` | サポートされていません ❌ | このチェックボックスがオンになっているかどうかを確認するには、[`wc/store/checkout` データストア](../data-store/checkout.md) を使用する必要があります。 |
| `woocommerce_enable_order_notes_field` | サポートされていません ❌ | このブロックはエディターで削除する必要があります。このフィルターは Checkout ブロックでの存在には影響しません。 |
| `woocommerce_form_field_textarea` | サポートされていません ❌ | Cart/Checkout ブロックでは、コアフォームフィールドの変更はまだサポートされていません。 |
| `woocommerce_checkout_cart_item_visible` | サポートされていません ❌ | Cart/Checkout ブロックの注文概要からカートアイテムをフィルターすることはできません。 |
| `woocommerce_cart_item_class` | サポートされていません ❌ |カート/チェックアウト ブロックの注文概要で、特定のカート項目にクラスを追加することはできません。 |
| `woocommerce_checkout_cart_item_quantity` | サポートされていません ❌ | カート/チェックアウト ブロックの注文概要で、カート項目の数量表示を変更することはできません。 |
| `woocommerce_cart_product_subtotal` | サポートされていません ❌ | カート/チェックアウト ブロックでは、商品の小計表示の変更はサポートされていません |
| `woocommerce_cart_item_subtotal` | サポートされていません ❌ | カート/チェックアウト ブロックでは、商品の小計表示の変更はサポートされていません |
| `woocommerce_cart_subtotal` | サポートされていません ❌ | カート/チェックアウト ブロックでは、カートの小計表示の変更はサポートされていません |
| `woocommerce_cart_shipping_method_full_label` | サポートされていません ❌ |配送方法の表示の変更は、カート/チェックアウト ブロックではサポートされていません |
| `woocommerce_get_shipping_tax` | サポートされていません ❌ | このフィルターは、カート/チェックアウト ブロックでは使用されません。 |
| `woocommerce_cart_totals_fee_html` | サポートされていません ❌ | 手数料の表示の変更は、カート/チェックアウト ブロックではサポートされていません |
| `woocommerce_cart_total` | サポートされていません ❌ | このフックを使用してカートの合計を変更することは、カート/チェックアウト ブロックではサポートされていません |
| `woocommerce_cart_totals_order_total_html` | サポートされていません ❌ | このフックを使用して注文合計の HTML を変更することは、カート/チェックアウト ブロックではサポートされていません。エディターを使用して編集してください。 |
| `woocommerce_order_button_text` | サポートされていません ❌ |このフックを使用して注文ボタンの HTML を変更することは、Cart/Checkout ブロックではサポートされていません。エディターを使用して編集してください。 |
| `woocommerce_gateway_title` | サポートされていません ❌ | これらは、Cart/Checkout ブロックに登録されたゲートウェイによってレンダリングされる「コンテンツ」に含めることができますが、PHP フィルター経由でこれを制御することはできません。 |
| `woocommerce_gateway_icon` | サポートされていません ❌ | ゲートウェイ アイコンは表示されません。これらは、Cart/Checkout ブロックに登録されたゲートウェイによってレンダリングされる「コンテンツ」に含めることができますが、PHP フィルター経由でこれを制御することはできません。 |
| `woocommerce_gateway_description` | サポートされていません ❌ | この方法でゲートウェイを変更することはできません。ゲートウェイは、JavaScript を使用して Cart/Checkout ブロックに登録する必要があり、サードパーティの拡張機能はこれらのフロントエンドの詳細を変更できません。 |
| `woocommerce_checkout_show_terms` | サポートされていません ❌ |これはこのフィルターでは制御できません。ブロックはエディターで削除できます。 |
| `woocommerce_get_privacy_policy_text` | サポートされていません ❌ | このフィルターを使用してプライバシーポリシーのテキストを変更することはできません。エディターで変更できます。 |
| `woocommerce_order_button_html` | サポートされていません ❌ | このフックを使用して注文ボタンの HTML を変更することは、Cart/Checkout ブロックではサポートされていません。エディターを使用して編集してください。 |
| `woocommerce_update_order_review_fragments` | サポートされていません ❌ | Fragments は Cart/Checkout ブロックでは使用されません。 |

### 注文を出す_アクション

このセクションは進行中である。

### フィルタの発注

このセクションは進行中である。

### オーダー概要_アクション

このセクションは進行中である。

### 注文概要 _filters_

このセクションは進行中である。

## 共通の拡張パス

### カートとチェックアウトのブロック

#### 修正不要で完全サポート

- カート上の料金やその他の価格の変更 (`woocommerce_cart_calculate_fees`)
- WC ライフサイクルイベント中の顧客情報の更新、例えば`woocommerce_init`の場合、顧客の住所を更新するとカート/チェックアウトブロックに反映されます。
- 配送方法の追加
- woocommerce_product_get_name を使った商品名の変更

#### 部分的に支持される、または代替アプローチによって支持される

- レイアウトの変更。例えば、発送、支払い、請求/発送先住所などの特定のセクションの前後にコンテンツを挿入します。例としては以下のようなものがあります：例えば、カートの中身が印刷される前(`woocommerce_cart_contents`)や送料の前(`woocommerce_before_shipping_rate`)などです：
    - これは、Slot/Fillの使用と、表示したいブロックの子としてインナーブロックを登録することでサポートされます。
- 支払い方法の追加
    - 支払い方法を追加するだけでは十分ではありません。開発者は、支払いブロックに表示するReactコンポーネントも登録する必要があります。
- ローカルピックアップのための配送方法の追加
    - 通常通り動作しますが、メソッドがcollectableをサポートする必要があります。
- カート内の商品名の変更
    - PHPフィルタではなくJSフィルタを使用する必要がある。

#### 全くサポートされていない

- カートの各項目を変更し、コンテンツの追加や変更、HTMLの変更を行う（チェックアウトフィルタで提供されるもの以外）。

### チェックアウト・ブロック

#### 修正不要で完全サポート

- フォームへの値の事前入力 (一部のマーチャントでは、`woocommerce_checkout_get_value` を使用して値をオーバーライドすることでこれを実現しています)
    - これは、カートをロードする際にカート/カスタマーオブジェクトに設定されたものを尊重する限りにおいてサポートされます。`woocommerce_checkout_get_value` はチェックアウトブロックではサポートされていませんが、これはこのフックだけの使用例です。

#### 部分的に支持される、または代替アプローチによって支持される

- 新しいチェックアウトフィールドの追加（一般的には `woocommerce_checkout_fields` フックで実現します）
    - Additional Checkout Fields API でサポートされていますが、現在すべてのフィールドタイプがサポートされているわけではありません。
- woocommerce_checkout_process などのフックを使ったカスタムフィールドバリデーション
    - 支払い処理イベントにフックすることでサポートされます - "Place order "を押した時点でのバリデーション。他のエクステンションはボタンが押される前にデータストアにバリデーションエラーを追加し、チェックアウトを防ぐことができますが、特にバリデーションチェックが高価な場合、良い解決策ではありません。
- 注文前/注文中/注文後のフックによる注文/顧客の更新
    - チェックアウト中に実行されるフックがいくつかあります：
        - `woocommerce_store_api_checkout_order_processed` - 注文が発注されたときに発行されます。
        - `woocommerce_store_api_checkout_update_customer_from_request` - チェックアウトリクエストのデータで顧客が更新されるときに発行されます。
        - `woocommerce_store_api_checkout_update_order_meta` - オーダーのメタデータがリクエストのデータで更新されたときに発行されます。
    - ショートコード処理で発火するその他のWCフック (例: `woocommerce_checkout_order_processed` は、ブロックからのストアAPIリクエストでは発火しません)
- `woocommerce_order_button_text`を使用した注文ボタンのテキストのカスタマイズ
    - フックではサポートされていませんが、エディターでは可能です。現在のところ、これを実現するプログラム的な方法はありません。

#### 全くサポートされていない

- 既存のコア・フィールドの変更（一般的には `woocommerce_checkout_fields` フックを使用します）
- 請求先/配送先住所の削除 (上記の方法を使用)
- 注文が確定する直前にアクションを実行する (`woocommerce_checkout_create_order`)

### カートブロック

#### 修正不要で完全サポート

- 両ブロック」セクションですでにカバーされていないものはない。

#### 部分的に支持される、または代替アプローチによって支持される

- カートアイテムの数量選択を制限できるようになりました。これまでは`woocommerce_quantity_input_step` のようなフィルタを使用していました。
    - これは、`woocommerce_store_api_product_quantity_{`$value_type`}` フィルタのカートアイテムのquantity_limitsプロパティを変更することで可能になります。

#### 全くサポートされていない

- テンプレートファイルを変更してレイアウトを変更する（ブロックテーマとカスタムテンプレートを使用している場合を除く）
