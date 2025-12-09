---
post_title: Add or modify states
---

# Add or modify states

WooCommerceに独自の配送方法を追加したり、変更したりできます。

&gt; 注：XXの両方のインスタンスをあなたの国コードに置き換える必要があります。つまり、配列内の各州の ID は、その州に割り当てる番号の前に、2 文字の国コードを指定する必要があります。

```php
if ( ! function_exists( 'YOUR_PREFIX_add_or_modify_states' ) ) {
  /**
   * Add or modify States
   * 
   * @param array $states Existing country states.
   * @return array $states Modified country states.
   */
  function YOUR_PREFIX_add_or_modify_states( $states ) {
    $states['XX'] = array(
      'XX1' => __( 'State 1', 'YOUR-TEXTDOMAIN' ),
      'XX2' => __( 'State 2', 'YOUR-TEXTDOMAIN' ),
    );

    return $states;
  }
  add_filter( 'woocommerce_states', 'YOUR_PREFIX_add_or_modify_states' );
}
```
