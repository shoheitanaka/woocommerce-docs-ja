---
sidebar_label: Hook alternatives
---

# Hook alternatives

これらはカート/チェックアウトのショートコードとブロックをロードするときに実行されるフックです。いくつかは一般的なWooCommerceライフサイクルフックであり、いくつかはカートとチェックアウトページに特化したものです。これらは`do_action`と`apply_filters`への各呼び出しをログし、古い[WooCommerce Blocksリポジトリ](https://github.com/woocommerce/woocommerce-blocks/)の「フック」と「フィルタ(複数可)」について言及している問題を確認することで生成されました。

| アイコン | 説明 |
| --- | --- |
| 完全にサポートされている。
| 部分的にサポートされている。
| サポートされていない。
| 不明

フックがUnknown❓(不明)とマークされている場合は、何らかの理由でそのフックがサポートされているかどうかを検証できなかったことを意味します。時間が経てば経つほど、これらのフックの検証を試みることになるだろう。目標は、どのテーブルにもUnknown❓のステータスのフックが残らないようにすることです。

### WooCommerceのライフサイクル_アクション

これらのフックはWooのページがロードされるたびに実行され、ブロックに影響を与えるもの、与えないもの、部分的にしか影響を与えないものがある。

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

### WooCommerce ライフサイクルフィルター

| Old hook | Works in blocks? | Notes |
| --- | --- | --- |
| `woocommerce_notice_types` | Unknown ❓ | WC Blocks does not handle additional notice types outside of the core ones. Non-supported notices would be displayed as "info" notices. |
| `woocommerce_kses_notice_allowed_tags` | Unknown ❓ | |
| `woocommerce_product_get_stock_status` | Fully supported ✅ | |
| `woocommerce_product_is_in_stock` | Fully supported ✅ | |
| `woocommerce_product_get_manage_stock` | Unknown ❓ | |
| `woocommerce_product_get_tax_class` | Fully supported ✅ | |
| `woocommerce_product_get_tax_status` | Unknown ❓ | |
| `woocommerce_prices_include_tax` | Unknown ❓ | |
| `woocommerce_apply_base_tax_for_local_pickup` | Unknown ❓ | |
| `woocommerce_local_pickup_methods` | Not supported ❌ | Does not affect the blocks-based local pickup methods |
| `woocommerce_customer_get_shipping_postcode` | Fully supported ✅ | |
| `woocommerce_customer_get_shipping_city` | Fully supported ✅ | |
| `woocommerce_customer_taxable_address` | Unknown ❓ | |
| `woocommerce_shipping_methods` | Fully supported ✅ | |
| `woocommerce_format_localized_price` | Unknown ❓ | |
| `woocommerce_shipping_local_pickup_option` | Not supported ❌ | Does not affect the blocks-based local pickup methods |
| `woocommerce_shipping_pickup_location_option` | Unknown ❓ | Unsure if changing this changes the way local pickup shows in the Cart/Checkout |
| `woocommerce_shipping_method_supports` | Fully supported ✅ | |
| `woocommerce_get_tax_location` | Unknown ❓ | |
| `woocommerce_format_postcode` | Unknown ❓ | |
| `woocommerce_matched_tax_rates` | Unknown ❓ | |
| `woocommerce_find_rates` | Unknown ❓ | |
| `woocommerce_matched_rates` | Unknown ❓ | |
| `woocommerce_cart_totals_get_item_tax_rates` | Fully supported ✅ | |
| `woocommerce_adjust_non_base_location_prices` | Unknown ❓ | |
| `woocommerce_product_is_taxable` | Fully supported ✅ | |
| `woocommerce_price_ex_tax_amount` | Fully supported ✅ | |
| `woocommerce_tax_round` | Fully supported ✅ | |
| `woocommerce_calc_tax` | Fully supported ✅ | |
| `woocommerce_calculate_item_totals_taxes` | Fully supported ✅ | |
| `woocommerce_cart_ready_to_calc_shipping` | Fully supported ✅ | |
| `woocommerce_product_get_virtual` | Fully supported ✅ | |
| `woocommerce_is_virtual` | Fully supported ✅ | |
| `woocommerce_product_needs_shipping` | Fully supported ✅ | |
| `woocommerce_cart_needs_shipping` | Fully supported ✅ | |
| `woocommerce_customer_get_shipping_address_1` | Fully supported ✅ | |
| `woocommerce_customer_get_shipping_address_2` | Fully supported ✅ | |
| `woocommerce_cart_display_prices_including_tax` | Fully supported ✅ | |
| `woocommerce_cart_get_subtotal` | Fully supported ✅ | |
| `woocommerce_cart_shipping_packages` | Fully supported ✅ | |
| `woocommerce_product_get_shipping_class_id` | Fully supported ✅ | |
| `woocommerce_countries_shipping_countries` | Fully supported ✅ | |
| `woocommerce_get_zone_criteria` | Fully supported ✅ | |
| `woocommerce_shipping_zone_shipping_methods` | Fully supported ✅ | |
| `woocommerce_shipping_free_shipping_is_available` | Unknown ❓ | |
| `woocommerce_product_get_name` | Fully supported ✅ | |
| `woocommerce_shipping_method_add_rate` | Fully supported ✅ | |
| `woocommerce_shipping_flat_rate_is_available` | Fully supported ✅ | |
| `woocommerce_evaluate_shipping_cost_args` | Fully supported ✅ | |
| `woocommerce_calc_shipping_tax` | Fully supported ✅ | |
| `woocommerce_localisation_address_formats` | Fully supported ✅ | |
| `woocommerce_countries_base_country` | Unknown ❓ | |
| `woocommerce_formatted_address_force_country_display` | Unknown ❓ | |
| `woocommerce_states` | Fully supported ✅ | |
| `woocommerce_formatted_address_replacements` | Unknown ❓ | |
| `woocommerce_package_rates` | Fully supported ✅ | |
| `woocommerce_shipping_packages` | Fully supported ✅ | |
| `woocommerce_shipping_rate_method_id` | Fully supported ✅ | |
| `woocommerce_shipping_rate_taxes` | Fully supported ✅ | |
| `woocommerce_shipping_rate_cost` | Fully supported ✅ | |
| `woocommerce_cart_totals_get_fees_from_cart_taxes` | Fully supported ✅ | |
| `woocommerce_calculated_total` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_cart_get_discount_total` | Fully supported ✅ | |
| `woocommerce_cart_get_cart_contents_total` | Fully supported ✅ | |
| `woocommerce_get_price_excluding_tax` | Not supported ❌ | This does not seem to have any effect |
| `raw_woocommerce_price` | Not supported ❌ | This does not seem to have any effect |
| `formatted_woocommerce_price` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_price_trim_zeros` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_get_cart_page_permalink` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_get_cart_url` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_checkout_registration_enabled` | Fully supported ✅ | This does not seem to have any effect |
| `woocommerce_get_checkout_page_permalink` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_get_checkout_url` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_checkout_get_value` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_default_address_fields` | Not supported ❌ | This does not seem to have any effect |
| `default_checkout_billing_country` | Not supported ❌ | This does not seem to have any effect |
| `default_checkout_shipping_country` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_get_country_locale` | Fully supported ✅ | |
| `woocommerce_get_country_locale_default` | Unknown ❓ | |
| `woocommerce_get_country_locale_base` | Unknown ❓ | |
| `woocommerce_billing_fields` | Partially supported 🔶 | Editing core fields is not supported, but adding them is via Additional Checkout Fields API |
| `woocommerce_shipping_fields` | Partially supported 🔶 | Editing core fields is not supported, but adding them is via Additional Checkout Fields API |
| `woocommerce_checkout_fields` | Partially supported 🔶 | Editing core fields is not supported, but adding them is via Additional Checkout Fields API |
| `woocommerce_cart_item_product` | Not supported ❌ | Modifying individual cart items is not possible |
| `woocommerce_payment_gateway_supports` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_first_name` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_last_name` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_company` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_address_1` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_address_2` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_city` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_postcode` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_phone` | Fully supported ✅ | |
| `woocommerce_customer_get_shipping_first_name` | Fully supported ✅ | |
| `woocommerce_customer_get_shipping_last_name` | Fully supported ✅ | |
| `woocommerce_customer_get_shipping_company` | Fully supported ✅ | |
| `woocommerce_get_item_data` | Partially supported 🔶 | Checkout blocks strip most HTML from metadata, allowing only a, b, em, i, strong, br, abbr, and span. |
| `woocommerce_cart_get_subtotal_tax` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_shipping_package_name` | Fully supported ✅ | |
| `woocommerce_shipping_rate_id` | Unknown ❓ | |
| `woocommerce_shipping_rate_label` | Fully supported ✅ | |
| `woocommerce_cart_get_shipping_taxes` | Fully supported ✅ | |
| `woocommerce_cart_get_fee_taxes` | Fully supported ✅ | |
| `woocommerce_cart_get_taxes` | Fully supported ✅ | |
| `woocommerce_rate_code` | Unknown ❓ | |
| `woocommerce_rate_compound` | Unknown ❓ | |
| `woocommerce_rate_label` | Fully supported ✅ | |
| `woocommerce_cart_hide_zero_taxes` | Unknown ❓ | |
| `woocommerce_cart_tax_totals` | Fully supported ✅ | |
| `woocommerce_cart_needs_payment` | Fully supported ✅ | |
| `woocommerce_order_class` | Fully supported ✅ | |
| `woocommerce_checkout_registration_required` | Unknown ❓ | |
| `woocommerce_privacy_policy_page_id` | Fully supported ✅ | |
| `woocommerce_get_terms_page_id` | Unknown ❓ | |
| `woocommerce_terms_and_conditions_page_id` | Unknown ❓ | |
| `woocommerce_cart_contents_count` | Unknown ❓ | |
| `woocommerce_country_locale_field_selectors` | Not supported ❌ | |
| `woocommerce_get_return_url` | Fully supported ✅ | |
| `woocommerce_cart_hash` | Fully supported ✅ | |
| `woocommerce_cart_get_fee_tax` | Fully supported ✅ | |
| `woocommerce_customer_default_location_array` | Fully supported ✅ | |
| `woocommerce_countries` | Fully supported ✅ | |
| `woocommerce_sort_countries` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_countries_allowed_countries` | Fully supported ✅ | |
| `woocommerce_customer_default_location_array` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_country` | Fully supported ✅ | |
| `woocommerce_customer_get_shipping_country` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_state` | Fully supported ✅ | |
| `woocommerce_customer_get_shipping_state` | Fully supported ✅ | |
| `woocommerce_customer_get_billing_email` | Fully supported ✅ | |
| `woocommerce_cart_session_initialize` | Fully supported ✅ | |
| `woocommerce_get_checkout_page_id` | Fully supported ✅ | |
| `woocommerce_get_cart_page_id` | Fully supported ✅ | |
| `woocommerce_is_checkout` | Fully supported ✅ | |
| `woocommerce_currency` | Fully supported ✅ | |
| `woocommerce_currency_symbols` | Fully supported ✅ | |
| `woocommerce_currency_symbol` | Fully supported ✅ | |
| `woocommerce_price_format` | Fully supported ✅ | |
| `woocommerce_coupons_enabled` | Fully supported ✅ | |
| `woocommerce_get_shop_page_id` | Fully supported ✅ | |
| `current_theme_supports-woocommerce` | Fully supported ✅ | |
| `woocommerce_payment_gateways` | Partially supported 🔶 | Integration with WC Blocks is still required, beyond unsetting gateways, manipulating the payment gateways here may not work in the Cart and Checkout blocks |
| `woocommerce_get_base_location` | Fully supported ✅ | |
| `woocommerce_gateway_icon` | Not supported ❌ | This hook has no effect since icons are not displayed. |
| `woocommerce_get_image_size_thumbnail` | Fully supported ✅ | |
| `woocommerce_get_image_size_single` | Fully supported ✅ | |
| `woocommerce_product_stock_status_options` | Fully supported ✅ | |
| `woocommerce_cart_item_name` | Not supported ❌ | Use the [`itemName` checkout filter](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#2-itemname). |
| `woocommerce_product_get_status` | Fully supported ✅ | |
| `woocommerce_product_get_price` | Fully supported ✅ | |
| `woocommerce_is_purchasable` | Fully supported ✅ | |
| `woocommerce_cart_item_is_purchasable` | Fully supported ✅ | |
| `woocommerce_cart_item_data_to_validate` | Fully supported ✅ | |
| `woocommerce_get_cart_item_from_session` | Fully supported ✅ | |
| `woocommerce_cart_contents_changed` | Fully supported ✅ | |
| `woocommerce_get_cart_contents` | Fully supported ✅ | |
| `woocommerce_stock_amount` | Fully supported ✅ | |
| `woocommerce_cart_item_remove_link` | Not supported ❌ | Use the [`showRemoveItemLink` checkout filter](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#4-showremoveitemlink). |
| `woocommerce_cart_item_quantity` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_product_get_image` | Not supported ❌ | Use `woocommerce_store_api_cart_item_images` ([PR Link](https://github.com/woocommerce/woocommerce/pull/52310) with example.) |
| `woocommerce_cart_no_shipping_available_html` | Not supported ❌ | This is not editable |
| `woocommerce_available_payment_gateways` | Partially supported 🔶 | Integration with WC Blocks is still required, beyond unsetting gateways, manipulating the payment gateways here may not work in the Cart and Checkout blocks |
| `woocommerce_cart_get_total` | Fully supported ✅ | |
| `woocommerce_cart_get_fee_tax` | Fully supported ✅ | |
| `woocommerce_cart_get_cart_contents_tax` | Fully supported ✅ | |
| `woocommerce_cart_get_shipping_tax` | Fully supported ✅ | |
| `woocommerce_cart_get_shipping_total` | Fully supported ✅ | |

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

### カート・フィルター

| Old hook | Works in blocks? | Notes |
| --- | --- | --- |
| `woocommerce_cart_item_product_id` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_cart_item_visible` | Not supported ❌ | This does not seem to have any effect |
| `woocommerce_get_remove_url` | Not supported ❌ | The removal of items is handled async in the Cart block. |
| `woocommerce_cart_item_remove_link` | Not supported ❌ | The removal of items is handled async in the Cart block. |
| `woocommerce_cart_item_thumbnail` | Not supported ❌ | Changing the thumbnail this way is not supported. See `woocommerce_store_api_cart_item_images` ([PR Link](https://github.com/woocommerce/woocommerce/pull/52310) with example.) |
| `woocommerce_cart_product_price` | Not supported ❌ | |
| `woocommerce_cart_item_price` | Not supported ❌ | |
| `woocommerce_quantity_input_classes` | Not supported ❌ | |
| `woocommerce_quantity_input_max` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_quantity_input_min` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_quantity_input_step` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_quantity_input_pattern` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_quantity_input_inputmode` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_quantity_input_placeholder` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_quantity_input_autocomplete` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_quantity_input_args` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_quantity_input_type` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_cart_item_quantity` | Not supported ❌ | This is possible by modifying the quantity_limits property of the cart item in the `woocommerce_store_api_product_quantity_{$value_type}` filter. |
| `woocommerce_cart_product_subtotal` | Not supported ❌ | |
| `woocommerce_cart_item_subtotal` | Not supported ❌ | |
| `woocommerce_cross_sells_columns` | Not supported ❌ | The cross sells are rendered as an inner block. |
| `woocommerce_cross_sells_orderby` | Not supported ❌ | The cross sells are rendered as an inner block. |
| `woocommerce_cross_sells_order` | Not supported ❌ | The cross sells are rendered as an inner block. |
| `woocommerce_cross_sells_total` | Not supported ❌ | The cross sells are rendered as an inner block. |
| `woocommerce_product_cross_sells_products_heading` | Not supported ❌ | This can be modified in the editor. |
| `woocommerce_is_downloadable` | Not supported ❌ | Does not seem to have any effect in Cart/Checkout blocks. |
| `woocommerce_loop_product_link` | Not supported ❌ | Changing the product links is not supported in the Cart block. |
| `woocommerce_product_loop_title_classes` | Not supported ❌ | Changing classes to product titles is not supported in the Cart block. |
| `woocommerce_product_add_to_cart_aria_describedby` | Not supported ❌ | Changing `aria-describedby` on products is not supported in the Cart block. |
| `woocommerce_sale_flash` | Not supported ❌ | This can be modified with the [`saleBadgePriceFormat` checkout filter](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#3-salebadgepriceformat). |
| `woocommerce_cart_subtotal` | Not supported ❌ | Modifying the cart subtotal display is not supported in the Cart/Checkout blocks |
| `oocommerce_shipping_package_details_array` | Not supported ❌ | This hook is not fired during Cart block rendering |
| `woocommerce_shipping_show_shipping_calculator` | Not supported ❌ | This is only used when rendering cart templates, which does not happen in the blocks. |
| `woocommerce_cart_shipping_method_full_label` | Not supported ❌ | This hook has no effect in the Cart/Checkout blocks. |
| `woocommerce_get_shipping_tax` | Not supported ❌ | This filter is not used in the Cart/Checkout blocks. |
| `woocommerce_shipping_calculator_enable_country` | Not supported ❌ | This filter is not used in the Cart/Checkout blocks. |
| `woocommerce_shipping_calculator_enable_state` | Not supported ❌ | This filter is not used in the Cart/Checkout blocks. |
| `woocommerce_shipping_calculator_enable_city` | Not supported ❌ | This filter is not used in the Cart/Checkout blocks. |
| `woocommerce_shipping_calculator_enable_postcode` | Not supported ❌ | This filter is not used in the Cart/Checkout blocks. |
| `woocommerce_cart_totals_fee_html` | Not supported ❌ | Modifying the fees display is not supported in the Cart/Checkout blocks |
| `woocommerce_countries_estimated_for_prefix` | Not supported ❌ | |
| `woocommerce_cart_total` | Not supported ❌ | Modifying the cart total using this hook is not supported in the Cart/Checkout blocks |
| `woocommerce_cart_totals_order_total_html` | Not supported ❌ | Modifying the cart total using this hook is not supported in the Cart/Checkout blocks |

### チェックアウト_アクション

| Old hook | Works in blocks? | Notes |
| --- | --- | --- |
| `woocommerce_before_checkout_form_cart_notices` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_before_checkout_form` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_before_customer_details` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_billing` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_before_checkout_billing_form` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_after_checkout_billing_form` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_shipping` | Not supported ❌ | Not directly equivalent due to positioning, but [ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages) could work - so could adding an inner block to the shipping block |
| `woocommerce_before_checkout_shipping_form` | Not supported ❌ | Not directly equivalent due to positioning, but [ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages) could work - so could adding an inner block to the shipping block |
| `woocommerce_after_checkout_shipping_form` | Not supported ❌ | Not directly equivalent due to positioning, but [ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages) could work - so could adding an inner block to the shipping block |
| `woocommerce_before_order_notes` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_after_order_notes` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_after_customer_details` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_before_order_review_heading` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_before_order_review` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_order_review` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_before_cart_contents` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_after_cart_contents` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_before_shipping` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_after_shipping_rate` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_after_shipping` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_before_order_total` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_after_order_total` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_before_payment` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block or Payment block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_before_terms_and_conditions` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_terms_and_conditions` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_after_terms_and_conditions` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_before_submit` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_after_submit` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_review_order_after_payment` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block or Payment block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_after_order_review` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Order Summary" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_after_checkout_form` | Not supported ❌ | No specific equivalent and no Slot/fill for this area. Maybe adding an inner block to the "Checkout Fields" block could work, but it would have to be positioned manually by the merchant. |
| `woocommerce_checkout_update_order_review` | Not supported ❌ | These type of AJAX events do not occur when using the Cart/Checkout blocks |

### チェックアウト_フィルター

| Old hook | Works in blocks? | Notes |
| --- | --- | --- |
| `woocommerce_add_notice` | Partially supported 🔶 | These notices are only added on page load of the Cart/Checkout blocks. Any that happen during API requests are stored and output on the next full page load. |
| `woocommerce_checkout_coupon_message` | Not supported ❌ | The coupon message cannot be customised using this filter. |
| `woocommerce_form_field_args` | Not supported ❌ | Modifying core form fields is not supported yet in the Cart/Checkout blocks. |
| `woocommerce_form_field_text` | Not supported ❌ | Modifying core form fields is not supported yet in the Cart/Checkout blocks. |
| `woocommerce_form_field` | Not supported ❌ | Modifying core form fields is not supported yet in the Cart/Checkout blocks. |
| `woocommerce_form_field_country` | Not supported ❌ | Modifying core form fields is not supported yet in the Cart/Checkout blocks. |
| `woocommerce_form_field_state` | Not supported ❌ | Modifying core form fields is not supported yet in the Cart/Checkout blocks. |
| `woocommerce_form_field_tel` | Not supported ❌ | Modifying core form fields is not supported yet in the Cart/Checkout blocks. |
| `woocommerce_form_field_email` | Not supported ❌ | Modifying core form fields is not supported yet in the Cart/Checkout blocks. |
| `woocommerce_cart_needs_shipping_address` | Not supported ❌ | The [`wc/store/cart` data store](../data-store/cart.md) should be used to control this. |
| `woocommerce_ship_to_different_address_checked` | Not supported ❌ | The [`wc/store/checkout` data store](../data-store/checkout.md) should be used to check if this checkbox is checked. |
| `woocommerce_enable_order_notes_field` | Not supported ❌ | This block must be removed in the editor, this filter will not affect its presence in the Checkout block |
| `woocommerce_form_field_textarea` | Not supported ❌ | Modifying core form fields is not supported yet in the Cart/Checkout blocks. |
| `woocommerce_checkout_cart_item_visible` | Not supported ❌ | It is not possible to filter cart items from the order summary in the Cart/Checkout blocks. |
| `woocommerce_cart_item_class` | Not supported ❌ | It is not possible to add classes to specific cart items in the order summary in the Cart/Checkout blocks. |
| `woocommerce_checkout_cart_item_quantity` | Not supported ❌ | It is not possible to modify the quantity display of cart items in the order summary in the Cart/Checkout blocks. |
| `woocommerce_cart_product_subtotal` | Not supported ❌ | Modifying the product subtotal display is not supported in the Cart/Checkout blocks |
| `woocommerce_cart_item_subtotal` | Not supported ❌ | Modifying the product subtotal display is not supported in the Cart/Checkout blocks |
| `woocommerce_cart_subtotal` | Not supported ❌ | Modifying the cart subtotal display is not supported in the Cart/Checkout blocks |
| `woocommerce_cart_shipping_method_full_label` | Not supported ❌ | Modifying the shipping method display is not supported in the Cart/Checkout blocks |
| `woocommerce_get_shipping_tax` | Not supported ❌ | This filter is not used in the Cart/Checkout blocks. |
| `woocommerce_cart_totals_fee_html` | Not supported ❌ | Modifying the fees display is not supported in the Cart/Checkout blocks |
| `woocommerce_cart_total` | Not supported ❌ | Modifying the cart total using this hook is not supported in the Cart/Checkout blocks |
| `woocommerce_cart_totals_order_total_html` | Not supported ❌ | Modifying the order total html using this hook is not supported in the Cart/Checkout blocks - edit it using the editor. |
| `woocommerce_order_button_text` | Not supported ❌ | Modifying the order button html using this hook is not supported in the Cart/Checkout blocks - edit it using the editor. |
| `woocommerce_gateway_title` | Not supported ❌ | These can be included in the "Content" rendered by gateways registered with the Cart/Checkout block but it is not possible to control this via PHP filters. |
| `woocommerce_gateway_icon` | Not supported ❌ | Gateway icons are not shown. They can be included in the "Content" rendered by gateways registered with the Cart/Checkout block but it is not possible to control this via PHP filters. |
| `woocommerce_gateway_description` | Not supported ❌ | Changing gateways this way is not possible, gateways need to register with the Cart/Checkout blocks using JavaScript and third party extensions can't modify these front-end details. |
| `woocommerce_checkout_show_terms` | Not supported ❌ | This is not controllable via this filter. The block can be removed in the editor. |
| `woocommerce_get_privacy_policy_text` | Not supported ❌ | Modifying the privacy policy text using this filter is not supported. It can be modified in the editor. |
| `woocommerce_order_button_html` | Not supported ❌ | Modifying the order button html using this hook is not supported in the Cart/Checkout blocks - edit it using the editor. |
| `woocommerce_update_order_review_fragments` | Not supported ❌ | Fragments are not used on the Cart/Checkout blocks. |

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
- WCライフサイクルイベント中の顧客情報の更新、例えば`woocommerce_init`の場合、顧客の住所を更新するとカート/チェックアウトブロックに反映されます。
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

- フォームへの値の事前入力 (一部のマーチャントでは、`woocommerce_checkout_get_value`を使用して値をオーバーライドすることでこれを実現しています)
    - これは、カートをロードする際にカート/カスタマーオブジェクトに設定されたものを尊重する限りにおいてサポートされます。`woocommerce_checkout_get_value`はチェックアウトブロックではサポートされていませんが、これはこのフックだけの使用例です。

#### 部分的に支持される、または代替アプローチによって支持される

- 新しいチェックアウトフィールドの追加（一般的には`woocommerce_checkout_fields`フックで実現します）
    - Additional Checkout Fields APIでサポートされていますが、現在すべてのフィールドタイプがサポートされているわけではありません。
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

- 既存のコア・フィールドの変更（一般的には`woocommerce_checkout_fields`フックを使用します）
- 請求先/配送先住所の削除 (上記の方法を使用)
- 注文が確定する直前にアクションを実行する (`woocommerce_checkout_create_order`)

### カートブロック

#### 修正不要で完全サポート

- 両ブロック」セクションですでにカバーされていないものはない。

#### 部分的に支持される、または代替アプローチによって支持される

- カートアイテムの数量選択を制限できるようになりました。これまでは`woocommerce_quantity_input_step`のようなフィルタを使用していました。
    - これは、`woocommerce_store_api_product_quantity_{`$value_type`}`フィルタのカートアイテムのquantity_limitsプロパティを変更することで可能になります。

#### 全くサポートされていない

- テンプレートファイルを変更してレイアウトを変更する（ブロックテーマとカスタムテンプレートを使用している場合を除く）
