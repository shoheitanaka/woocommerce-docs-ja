---
sidebar_label: Hook alternatives
---
# 代替フック

これらはカート/チェックアウトのショートコードとブロックをロードするときに実行されるフックです。いくつかは一般的なWooCommerceライフサイクルフックであり、いくつかはカートとチェックアウトページに特化したものです。これらは`do_action`と`apply_filters`への各呼び出しをログし、古い[WooCommerce Blocksリポジトリ](https://github.com/woocommerce/woocommerce-blocks/)の「フック」と「フィルタ(複数可)」について言及している問題を確認することで生成されました。

## Legend

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

| 古いフック｜ブロックで動く？| 注意事項
| --- | --- | --- |
| `woocommerce_notice_types` | Unknown ❓ | WC Blocksはコア通知以外の追加通知タイプを扱いません。サポートされていない通知は "info "通知として表示されます。|
| `woocommerce_kses_notice_allowed_tags` | 不明❓｜｜｜｜ WC Blocksはコア通知以外の追加通知を扱いません。
| `woocommerce_product_get_stock_status` | 完全にサポートされています。
| `woocommerce_product_is_in_stock` | 完全にサポートされています。
| `woocommerce_product_get_manage_stock` | Unknown ❓ | |
| `woocommerce_product_get_tax_class` | 完全にサポートされています。
| `woocommerce_product_get_tax_status` | Unknown ❓ | |
| `woocommerce_prices_include_tax` | Unknown ❓ | |
| `woocommerce_apply_base_tax_for_local_pickup` | Unknown ❓ | |
| `woocommerce_local_pickup_methods` | サポートされていません ❌ | ブロック・ベースのローカル・ピックアップ・メソッドには影響しません。
| `woocommerce_customer_get_shipping_postcode` | 完全にサポートされています。
| `woocommerce_customer_get_shipping_city` | 完全にサポートされています。
| `woocommerce_customer_taxable_address` | Unknown ❓ | |
| `woocommerce_shipping_methods` | 完全にサポートされています。
| `woocommerce_format_localized_price` | Unknown ❓ | |
| `woocommerce_shipping_local_pickup_option` | サポートされていません ❌ | ブロック・ベースのローカル・ピックアップ・メソッドには影響しません。
| `woocommerce_shipping_pickup_location_option` | 不明 ❓ | これを変更することで、ローカルピックアップがカート/チェックアウトに表示される方法が変わるかどうかは不明です。
| `woocommerce_shipping_method_supports` | 完全にサポートされています。
| `woocommerce_get_tax_location` | Unknown ❓ | |
| `woocommerce_format_postcode` | Unknown ❓ | |
| `woocommerce_matched_tax_rates` | Unknown ❓ | |
| `woocommerce_find_rates` | Unknown ❓ | |
| `woocommerce_matched_rates` | Unknown ❓ | |
| `woocommerce_cart_totals_get_item_tax_rates` | Fully supported ✅ | |
| `woocommerce_adjust_non_base_location_prices` | Unknown ❓ | |
| `woocommerce_product_is_taxable` | Fully supported ✅ | |
| `woocommerce_price_ex_tax_amount` | Fully supported ✅ | |
| `woocommerce_tax_round` | 完全にサポートされています。
| `woocommerce_calc_tax` | 完全にサポートされています。
| `woocommerce_calculate_item_totals_taxes`｜完全対応 ✅｜｜｜｜｜｜｜完全対応
| `woocommerce_cart_ready_to_calc_shipping`｜完全にサポートされています。
| `woocommerce_product_get_virtual`｜完全にサポートされています。
| | `woocommerce_is_virtual` | 完全にサポートされている ✅ | | | 。
| `woocommerce_product_needs_shipping` | Fully supported ✅ | |
| `woocommerce_cart_needs_shipping`｜完全対応 ✅｜｜｜｜｜｜｜｜完全対応
| `woocommerce_customer_get_shipping_address_1` | 完全にサポートされています。
| `woocommerce_customer_get_shipping_address_2` | 完全にサポートされています。
| `woocommerce_cart_display_prices_including_tax` | 完全にサポートされています。
| `woocommerce_cart_get_subtotal` | 完全にサポートされています。
| `woocommerce_cart_shipping_packages`｜完全にサポートされています。
| `woocommerce_product_get_shipping_class_id`｜完全にサポートされています。
| | `woocommerce_countries_shipping_countries` | 完全にサポートされている ✅ | | | 。
| `woocommerce_get_zone_criteria`｜完全にサポートされています。
| `woocommerce_shipping_zone_shipping_methods` | 完全にサポートされています。
| `woocommerce_shipping_free_shipping_is_available` | Unknown ❓ | |
| `woocommerce_product_get_name` | Fully supported ✅ | |
| `woocommerce_shipping_method_add_rate` | 完全にサポートされている ✅ | | | 。
| `woocommerce_shipping_flat_rate_is_available` | 完全にサポートされています。
| `woocommerce_evaluate_shipping_cost_args`｜完全にサポートされています。
| `woocommerce_calc_shipping_tax`｜完全にサポートされています。
| `woocommerce_localisation_address_formats`｜完全対応 ✅｜｜｜｜｜｜｜｜完全対応
| `woocommerce_countries_base_country` | Unknown ❓ | |
| `woocommerce_formatted_address_force_country_display` | Unknown ❓ | |
| `woocommerce_states` | Fully supported ✅ | |
| `woocommerce_formatted_address_replacements` | Unknown ❓ | |
| `woocommerce_package_rates` | 完全にサポートされている ✅｜｜｜｜｜｜｜ |`woocommerce_customer_get_shipping_address_1` | 不明
| `woocommerce_shipping_packages` | 完全にサポートされている ✅ | | 。
| `woocommerce_shipping_rate_method_id` | 完全にサポートされている ✅ | | | 。
| `woocommerce_shipping_rate_taxes`｜完全対応 ✅｜｜｜｜｜｜｜｜完全対応
| `woocommerce_shipping_rate_cost` | 完全にサポートされています。
| `woocommerce_cart_totals_get_fees_from_cart_taxes` | 完全にサポートされています。
| `woocommerce_calculated_total` | 非対応 ❌｜これは何の効果もないようだ。
| `woocommerce_cart_get_discount_total` | 完全にサポートされています。
| `woocommerce_cart_get_cart_contents_total` | 完全にサポートされています。
| `woocommerce_get_price_excluding_tax` | 非対応 ❌｜これは何の効果もないようだ。
| `raw_woocommerce_price` | サポートされていません ❌ | これは何の効果もないようです。
| `formatted_woocommerce_price` | サポートされていません ❌ | これは何の効果もないようです。
| `woocommerce_price_trim_zeros` | 非対応 ❌ | これは何の効果もないようだ。
| `woocommerce_get_cart_page_permalink` | サポートされていません ❌ | これは何の効果もないようです。
| `woocommerce_get_cart_url` | サポートされていません ❌ | これは何の効果もないようです。
| `woocommerce_checkout_registration_enabled` | 完全にサポートされています ✅ | これは何の効果もないようです。
| `woocommerce_get_checkout_page_permalink` | 非対応 ❌ | 効果はないようです。
| `woocommerce_get_checkout_url` | 非対応 ❌ | これは何の効果もないようだ。
| `woocommerce_checkout_get_value` | 非対応 ❌ | これは何の効果もないようだ。

| `woocommerce_default_address_fields` | サポートされていません ❌ | これは何の効果もないようです。
| `default_checkout_billing_country` | サポートされていません ↪So_274｜ これは何の効果もないようです。
| `default_checkout_shipping_country` | サポートされていません ❌ | これは何の効果もないようです。
| `woocommerce_get_country_locale` | 完全にサポートされています。
| `woocommerce_get_country_locale_default` | Unknown ❓ | |
| `woocommerce_get_country_locale_base` | Unknown ❓ | |
| `woocommerce_billing_fields` | 部分的にサポートされています 🔶 | コアフィールドの編集はサポートされていませんが、Additional Checkout Fields APIを介して追加することができます。
|`woocommerce_shipping_fields` | 部分的にサポートされています 🔶 | コアフィールドの編集はサポートされていません。
|`woocommerce_checkout_fields` | 部分的にサポートされています 🔶 | コアフィールドの編集はサポートされていません。
|`woocommerce_cart_item_product` | サポートされていません ❌ | 個々のカートアイテムの変更はできません。
| `woocommerce_payment_gateway_supports` | 完全にサポートされています。
| `woocommerce_customer_get_billing_first_name` | 完全にサポートされています。
| 完全にサポートされています。
| `woocommerce_customer_get_billing_company` | 完全にサポートされています。
| `woocommerce_customer_get_billing_address_1` | 完全にサポートされています。
| `woocommerce_customer_get_billing_address_2` | 完全にサポートされています。
| `woocommerce_customer_get_billing_city` | 完全にサポートされています。
| `woocommerce_customer_get_billing_postcode` | 完全にサポートされています。
| `woocommerce_customer_get_billing_phone` | 完全にサポートされています。
| `woocommerce_customer_get_shipping_first_name`｜完全対応
| `woocommerce_customer_get_shipping_last_name`｜完全対応 ✅｜｜｜｜｜｜｜｜完全対応
| `woocommerce_customer_get_shipping_company`｜完全にサポートされています。
| チェックアウト・ブロックは、メタデータからほとんどのHTMLを取り除き、a、b、em、i、strong、br、abbr、spanだけを許可します。|
| `woocommerce_cart_get_subtotal_tax` | サポートされていません ❌ | これは何の効果もないようです。
| `woocommerce_shipping_package_name` | 完全にサポートされています。
| `woocommerce_shipping_rate_id` | Unknown ❓ | |
| `woocommerce_shipping_rate_label` | Fully supported ✅ | |
| `woocommerce_cart_get_shipping_taxes` | Fully supported ✅ | |
| `woocommerce_cart_get_fee_taxes` | Fully supported ✅ | |
| `woocommerce_cart_get_taxes`｜完全対応 ✅｜｜｜｜｜｜｜完全対応
| `woocommerce_rate_code` | Unknown ❓ | |
| `woocommerce_rate_compound` | Unknown ❓ | |
| `woocommerce_rate_label` | Fully supported ✅ | |
| `woocommerce_cart_hide_zero_taxes` | Unknown ❓ | |
| `woocommerce_cart_tax_totals` | Fully supported ✅ | |
| `woocommerce_cart_needs_payment` | Fully supported ✅ | |
| `woocommerce_order_class` | 完全にサポートされている ✅ | | | 。
| `woocommerce_checkout_registration_required` | Unknown ❓ | |
| `woocommerce_privacy_policy_page_id` | 完全にサポートされています。
| `woocommerce_get_terms_page_id` | Unknown ❓ | |
| `woocommerce_terms_and_conditions_page_id` | Unknown ❓ | |
| `woocommerce_cart_contents_count` | Unknown ❓ | |
| `woocommerce_country_locale_field_selectors` | サポートされていません。
| `woocommerce_get_return_url` | 完全にサポートされている
| `woocommerce_cart_hash` | 完全にサポートされています。
| | `woocommerce_cart_get_fee_tax` | 完全にサポートされている ✅ | | | 。
| `woocommerce_customer_default_location_array`｜完全にサポートされています。
| `woocommerce_countries`｜完全にサポートされています。
| `woocommerce_sort_countries` | 非対応 ❌｜これは何の効果もないようだ。
| `woocommerce_countries_allowed_countries` | 完全にサポートされています。
| `woocommerce_customer_default_location_array` | 完全にサポートされています。
| `woocommerce_customer_get_billing_country` | 完全にサポートされています。
| `woocommerce_customer_get_shipping_country`｜完全対応 ✅｜｜｜｜｜｜｜完全対応
| `woocommerce_customer_get_billing_state` | Fully supported ✅ | |
| `woocommerce_customer_get_shipping_state`｜完全対応 ✅｜｜｜｜｜｜｜｜完全対応
| `woocommerce_customer_get_billing_email` | 完全にサポートされています。
| `woocommerce_cart_session_initialize` | 完全にサポートされています。
| `woocommerce_get_checkout_page_id` | 完全にサポートされています。
| `woocommerce_get_cart_page_id`｜完全対応 ✅｜｜｜｜｜｜｜｜完全対応
| `woocommerce_is_checkout` | 完全にサポートされています。
| `woocommerce_currency` | 完全にサポートされています。
| `woocommerce_currency_symbols` | 完全にサポートされています。
| `woocommerce_currency_symbol`｜完全にサポートされています。
| | `woocommerce_price_format` | 完全にサポートされている ✅ | | | 。
| `woocommerce_coupons_enabled`｜完全にサポートされています。
完全対応 ✅ | | `woocommerce_get_shop_page_id` | 完全対応 ✅ | | | `woocommerce_shipping_method_add_rate` | 完全対応
| `current_theme_supports-woocommerce` | 完全にサポートされています。
| |`woocommerce_payment_gateways` | 部分的にサポートされています 🔶 | WCブロックとの統合は、ゲートウェイの設定を解除する以上にまだ必要です。
| 完全にサポートされています。
| `woocommerce_gateway_icon` | サポートされていません ❌｜アイコンが表示されないので、このフックは効果がありません。|

| `woocommerce_get_image_size_thumbnail` | Fully supported ✅ | |
| `woocommerce_get_image_size_single` | 完全にサポートされています。
| `woocommerce_product_stock_status_options` | 完全にサポートされています。
| `woocommerce_cart_item_name` | 非対応 ❌ [`itemName` チェックアウトフィルター](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#2-itemname)を使用する。|
| `woocommerce_product_get_status` | 完全にサポートされています。
| `woocommerce_product_get_price` | 完全にサポートされています。
| `woocommerce_is_purchasable` | 完全にサポートされています。
| `woocommerce_cart_item_is_purchasable`｜完全対応 ✅｜｜｜｜｜｜完全対応
| | `woocommerce_cart_item_data_to_validate` | 完全にサポートされています。
| | `woocommerce_get_cart_item_from_session` | 完全にサポートされています。
| `woocommerce_cart_contents_changed` | 完全にサポートされています。
| `woocommerce_get_cart_contents`｜完全にサポートされています。
| 完全対応 ✅ | | `woocommerce_stock_amount` | 完全対応
| `woocommerce_cart_item_remove_link` | 非対応 ❌ | [`showRemoveItemLink` チェックアウトフィルター](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#4-showremoveitemlink)を使用してください。|
| `woocommerce_cart_item_quantity` | 未対応 ❌ `woocommerce_store_api_product_quantity_{$value_type}` フィルタでカートアイテムの quantity_limits プロパティを変更することで可能です。|
| `woocommerce_product_get_image` | サポートされていません ❌ | `woocommerce_store_api_cart_item_images` ([PRリンク](https://github.com/woocommerce/woocommerce/pull/52310))を使用してください。|
| `woocommerce_cart_no_shipping_available_html` | 非対応 ❌ | 編集できません。
| `woocommerce_available_payment_gateways` | 部分的にサポートされています 🔶 | WCブロックとの統合がまだ必要です。ゲートウェイの設定を解除する以上に、ここで決済ゲートウェイを操作しても、カートブロックとチェックアウトブロックでは動作しないかもしれません。
| 完全にサポートされています。
| `woocommerce_cart_get_fee_tax` | 完全にサポートされています。
| 完全にサポートされています。
| | `woocommerce_cart_get_shipping_tax` | 完全対応
| `woocommerce_cart_get_shipping_total` | 完全にサポートされている ✅ | | 。

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
| [`woocommerce_cart_totals_before_shipping` スロット/フィル](https://developer.wordpress.org/reference/hooks/render_block_this-name/) | サポートされていません。
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

| 古いフック｜ブロックで動く？| 注意事項
| --- | --- | --- |
| `woocommerce_cart_item_product_id` | サポートされていません。
| `woocommerce_cart_item_visible` | サポートされていません ❌ | 効果はないようです。
| `woocommerce_get_remove_url` | サポートされていません ❌ | アイテムの削除は Cart ブロックで非同期に処理されます。|
| `woocommerce_cart_item_remove_link` | 非対応 ❌｜アイテムの削除はCartブロック内で非同期に処理されます。|
| `woocommerce_cart_item_thumbnail` | 非対応 ❌｜この方法でのサムネイルの変更はサポートされていません。`woocommerce_store_api_cart_item_images` ([PRリンク](https://github.com/woocommerce/woocommerce/pull/52310))を参照してください。|
| `woocommerce_cart_product_price` | サポートされていません。
| `woocommerce_cart_item_price` | サポートされていません。
| `woocommerce_quantity_input_classes` | サポートされていません。
| これは、`woocommerce_store_api_product_quantity_{$value_type}`フィルタでカートアイテムのquantity_limitsプロパティを変更することで可能です。|
| `woocommerce_quantity_input_min` | 非対応 ❌ `woocommerce_store_api_product_quantity_{$value_type}` フィルタでカートアイテムの quantity_limits プロパティを変更することで可能です。|
| `woocommerce_quantity_input_step` | 非対応 ❌ `woocommerce_store_api_product_quantity_{$value_type}` フィルタでカートアイテムの quantity_limits プロパティを変更することで可能です。|
| `woocommerce_quantity_input_pattern` | 非対応 ❌｜これは`woocommerce_store_api_product_quantity_{$value_type}`フィルタのカートアイテムのquantity_limitsプロパティを変更することで可能です。|
| `woocommerce_quantity_input_inputmode` | 非対応 ❌ `woocommerce_store_api_product_quantity_{$value_type}` フィルタでカートアイテムの quantity_limits プロパティを変更することで可能です。|
| `woocommerce_quantity_input_placeholder` | 非対応 ❌｜これは`woocommerce_store_api_product_quantity_{$value_type}`フィルタのカートアイテムのquantity_limitsプロパティを変更することで可能です。|
| `woocommerce_quantity_input_autocomplete` | 非対応 ❌｜これは`woocommerce_store_api_product_quantity_{$value_type}`フィルタのカートアイテムのquantity_limitsプロパティを変更することで可能です。|
| `woocommerce_quantity_input_args` | 非対応 ❌｜これは`woocommerce_store_api_product_quantity_{$value_type}`フィルタのカートアイテムのquantity_limitsプロパティを変更することで可能です。|
| `woocommerce_quantity_input_type` | 未対応 ❌ `woocommerce_store_api_product_quantity_{$value_type}` フィルタでカートアイテムの quantity_limits プロパティを変更することで可能です。|
| `woocommerce_cart_item_quantity` | 非対応 ❌｜これは`woocommerce_store_api_product_quantity_{$value_type}`フィルタのカートアイテムのquantity_limitsプロパティを変更することで可能です。|
| `woocommerce_cart_product_subtotal` | サポートされていません。
| `woocommerce_cart_item_subtotal` | サポートされていません。
| `woocommerce_cross_sells_columns` | 非対応 ❌｜クロスセルはインナーブロックとしてレンダリングされる。|
| `woocommerce_cross_sells_orderby` | 非対応 ❌ | クロスセルはインナーブロックとしてレンダリングされる。|
| `woocommerce_cross_sells_order` | 非対応 ❌ | クロスセルはインナーブロックとしてレンダリングされる。|
| `woocommerce_cross_sells_total` | 非対応 ❌ | クロスセルはインナーブロックとしてレンダリングされる。|
| `woocommerce_product_cross_sells_products_heading` | 非対応 ❌ | エディターで変更可能です。|
| `woocommerce_is_downloadable` | Not supported ❌ | Cart/Checkoutブロックでは効果がないようです。|
| `woocommerce_loop_product_link` | サポートされていません ❌ | カートブロックでは、商品リンクの変更はサポートされていません。|
| `woocommerce_product_loop_title_classes` | Not supported ❌｜カートブロックでは、商品タイトルへのクラスの変更はサポートされていません。|
| `woocommerce_product_add_to_cart_aria_describedby` | 非対応 ❌｜商品の`aria-describedby`を変更することは、カートブロックではサポートされていません。|
| `woocommerce_sale_flash` | サポートされていません ❌｜これは[`saleBadgePriceFormat`チェックアウトフィルター](https://developer.woocommerce.com/docs/cart-and-checkout-filters-cart-line-items/#3-salebadgepriceformat)で変更できます。|
| `woocommerce_cart_subtotal` | サポートされていません ❌ | カート/チェックアウトブロックでは、カートの小計表示の変更はサポートされていません。
| `oocommerce_shipping_package_details_array` | サポートされていません ❌ | このフックはカートブロックのレンダリング中には発生しません。
| `woocommerce_shipping_show_shipping_calculator` | サポートされていません ❌ | カートテンプレートのレンダリング時にのみ使用されます。|
| `woocommerce_cart_shipping_method_full_label` | 非対応 ❌ | このフックはカート/チェックアウト・ブロックでは効果がありません。|
| `woocommerce_get_shipping_tax` | サポートされていません ❌ | このフィルターはカート/チェックアウト・ブロックでは使用されません。|

|`woocommerce_shipping_calculator_enable_country` | サポートされていません ❌｜このフィルターはカート/チェックアウト・ブロックでは使用されません。|
| `woocommerce_shipping_calculator_enable_state` | 未サポート ❌｜このフィルターはカート/レジブロックでは使用されません。|
| `woocommerce_shipping_calculator_enable_city` | 非対応 ❌｜このフィルターはカート/レジブロックでは使用されません。|
| `woocommerce_shipping_calculator_enable_postcode` | 非対応 ❌｜このフィルターはカート/レジブロックでは使用されません。|
| `woocommerce_cart_totals_fee_html` | サポートされていません ❌ | Cart/Checkoutブロックでは、料金表示の変更はサポートされていません。
| `woocommerce_countries_estimated_for_prefix` | サポートされていません。
| `woocommerce_cart_total` | 非対応 ❌ | カート/レジブロックでは、このフックを使用したカート合計の変更はサポートされていません。
| `woocommerce_cart_totals_order_total_html` | サポートされていません ❌ | このフックを使用したカート合計の変更はカート/レジブロックではサポートされていません。

### チェックアウト_アクション

| 古いフック｜ブロックで動く？| 注意事項
| --- | --- | --- |
| `woocommerce_before_checkout_form_cart_notices` | サポートされていません。多分、"Checkout Fields "ブロックにインナーブロックを追加すれば機能するかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_before_checkout_form`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_before_customer_details` | サポートされていません ❌｜この領域に相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_billing`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_before_checkout_billing_form` | サポートされていません ❌｜この領域に相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_after_checkout_billing_form` | サポートされていません ❌｜この領域に相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
|`woocommerce_checkout_shipping` | サポートされていません ❌ | 位置の関係で直接等価ではありませんが、[ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages)は動作する可能性があります。
| `woocommerce_before_checkout_shipping_form` | サポートされていません ❌ | 位置の関係で直接等価ではありませんが、[ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages)は動作する可能性があります。
| `woocommerce_after_checkout_shipping_form` | サポートされていません ❌ | 位置の関係で直接等価ではありませんが、[ExperimentalOrderShippingPackages](https://developer.woocommerce.com/docs/cart-and-checkout-available-slots/#1-experimentalordershippingpackages)は動作する可能性があります。
| `woocommerce_before_order_notes` | サポートされていません ❌ 特定の等価物はなく、この領域のSlot/fillもありません。多分、"Checkout Fields "ブロックにインナーブロックを追加することは可能ですが、マーチャントが手動で配置する必要があります。|
| `woocommerce_after_order_notes`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_after_customer_details` | サポートされていません ❌｜このエリアに相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_before_order_review_heading` | サポートされていません ❌｜このエリアに相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_before_order_review`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_order_review` | サポートされていません ❌｜このエリアに相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_review_order_before_cart_contents`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_review_order_after_cart_contents` | Not supported ❌｜このエリアに相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|

| `woocommerce_review_order_before_shipping`｜ サポートされていません ❌｜ この領域に相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_after_shipping_rate`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_review_order_after_shipping`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_review_order_before_order_total`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_review_order_after_order_total` | Not supported ❌｜このエリアに相当するものはなく、Slot/fillもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_review_order_before_payment` | サポートされていません ❌｜このエリアに相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックまたは "Payment "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_before_terms_and_conditions`｜ サポートされていません ❌｜ このエリアに相当するものはなく、スロット/フィルもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_terms_and_conditions` | サポートされていません ❌｜この領域に相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_after_terms_and_conditions` | サポートされていません ❌｜この領域に相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_review_order_before_submit` | サポートされていません ❌｜この領域に相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_review_order_after_submit`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_review_order_after_payment` | サポートされていません ❌｜このエリアに相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックまたは "Payment "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_checkout_after_order_review`｜ サポートされていません ❌｜ このエリアに相当するものはなく、スロット/フィルもありません。多分、"Checkout Order Summary "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
| `woocommerce_after_checkout_form`｜ サポートされていません ❌｜ このエリアに相当するものはなく、Slot/fillもありません。Checkout Fields "ブロックにインナーブロックを追加するとうまくいくかもしれませんが、マーチャントが手動で配置する必要があります。|
|`woocommerce_checkout_update_order_review` | サポートされていません ❌｜カート/チェックアウトブロックを使用している場合、これらのタイプのAJAXイベントは発生しません。

### チェックアウト_フィルター

[| 古いフック｜ブロックで動く？| 注意事項
| --- | --- | --- |
| `woocommerce_add_notice` | 部分的にサポートされています 🔶 これらの通知はカート/チェックアウトブロックのページロード時にのみ追加されます。APIリクエスト中に発生したものは保存され、次の全ページロード時に出力されます。|
| `woocommerce_checkout_coupon_message` | サポートされていません ❌｜クーポンメッセージは、このフィルターを使用してカスタマイズすることはできません。|
| `woocommerce_form_field_args` | サポートされていません ❌ | カート/チェックアウトブロックでは、コアフォームフィールドの変更はまだサポートされていません。|
| `woocommerce_form_field_text` ｜未サポート ❌｜カート/レジブロックでは、コアフォームフィールドの変更はまだサポートされていません。|
| `woocommerce_form_field` | 未サポート ❌｜カート/チェックアウトブロックでは、コアフォームフィールドの変更はまだサポートされていません。|
| `woocommerce_form_field_country` ｜未サポート ❌｜カート/チェックアウトブロックでは、コアフォームフィールドの変更はまだサポートされていません。|
| `woocommerce_form_field_state` | 未サポート ❌｜カート/チェックアウトブロックでは、コアフォームフィールドの変更はまだサポートされていません。|
| `woocommerce_form_field_tel` | 未サポート ❌｜カート/チェックアウトブロックでは、コアフォームフィールドの変更はまだサポートされていません。|
| `woocommerce_form_field_email` | 未サポート ❌｜カート/チェックアウトブロックでは、コアフォームフィールドの変更はまだサポートされていません。|
| データストア](../data-store/cart.md)を使用して制御してください。|
| `woocommerce_ship_to_different_address_checked` | サポートされていません ❌ [`wc/store/checkout` データストア](../data-store/checkout.md)を使用して、このチェックボックスがチェックされているかどうかを確認してください。|
|`woocommerce_enable_order_notes_field` | サポートされていません ❌ | このブロックはエディタで削除する必要があります。
| このフィルターはチェックアウトブロックでの存在には影響しません。｜`woocommerce_form_field_textarea`｜未サポート ❌｜カート/チェックアウトブロックでは、コアフォームフィールドの変更はまだサポートされていません。|
| `woocommerce_checkout_cart_item_visible` | サポートされていません ❌｜カート/チェックアウトブロックでは、注文サマリーからカートアイテムをフィルターすることはできません。|
| `woocommerce_cart_item_class` | 未サポート ❌｜カート/レジブロックの注文サマリーで、特定のカートアイテムにクラスを追加することはできません。|
| `woocommerce_checkout_cart_item_quantity` | サポートされていません ❌｜カート/レジブロックの注文サマリーで、カートアイテムの数量表示を変更することはできません。|
|`woocommerce_cart_product_subtotal` | 非対応 ❌｜カート/レジブロックでは、商品の小計表示を変更することはできません。
| `woocommerce_cart_item_subtotal` | サポートされていません ❌ | カート/レジブロックでは、商品小計表示の変更はサポートされていません。
| `woocommerce_cart_subtotal` | サポートされていません ❌ | カート/レジブロックでは、カート小計表示の変更はサポートされていません。
| `woocommerce_cart_shipping_method_full_label` | サポートされていません ❌ | カート/レジブロックでは配送方法表示の変更はサポートされていません。
| `woocommerce_get_shipping_tax` | サポートされていません ❌｜このフィルターはカート/レジブロックでは使用されません。|
|`woocommerce_cart_totals_fee_html` | サポートされていません ❌ | Cart/Checkoutブロックでは料金表示の変更はサポートされていません。
| `woocommerce_cart_total` | サポートされていません ❌ | カート/レジブロックでは、このフックを使用したカート合計の変更はサポートされていません。
| `woocommerce_cart_totals_order_total_html` | サポートされていません ❌ | このフックを使用した注文合計htmlの変更は、カート/チェックアウト・ブロックではサポートされていません。|
| `woocommerce_order_button_text` | 非対応 ❌｜このフックを使用した注文ボタンhtmlの変更はカート/チェックアウト・ブロックではサポートされていません - エディターを使って編集してください。|
|`woocommerce_gateway_title` | サポートされていません ❌｜これらはカート/チェックアウト・ブロックに登録されたゲートウェイによってレンダリングされる "コンテンツ "に含めることができますが、PHPフィルターを通してこれを制御することはできません。|
| ゲートウェイアイコンは表示されません。カート/チェックアウトブロックに登録されたゲートウェイによってレンダリングされる "コンテンツ "に含めることはできますが、PHPフィルターによってこれを制御することはできません。|

| ゲートウェイはJavaScriptを使用してCart/Checkoutブロックに登録する必要があり、サードパーティの拡張機能はこれらのフロントエンドの詳細を変更できません。|
| `woocommerce_checkout_show_terms`｜ サポートされていません ❌｜ このフィルターでは制御できません。このブロックはエディタで削除できます。|
| `woocommerce_get_privacy_policy_text` | 非対応 ❌｜このフィルターを使用したプライバシーポリシーテキストの変更はサポートされていません。エディターで変更できます。|
| `woocommerce_order_button_html` | 非対応 ❌ | このフックを使用したカート/チェックアウトブロックでの注文ボタンhtmlの変更はサポートされていません。|
|`woocommerce_update_order_review_fragments` | サポートされていません ❌ | Cart/Checkoutブロックではフラグメントは使用されません。|

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
