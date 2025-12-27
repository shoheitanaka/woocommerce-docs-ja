---
post_title: Change a currency symbol
---

# Change a currency symbol

WooCommerceでは、各通貨はコードとシンボルに関連付けられています。例えば、オーストラリアドルは`AUD`というコードと`WooCommerceでは、各通貨はコードとシンボルに関連付けられています。例えば、オーストラリアドルは`AUD`というコードとというシンボルを持っています（もし興味があれば、[ソースコード](https://github.com/woocommerce/woocommerce/blob/9.6.1/plugins/woocommerce/includes/wc-core-functions.php#L682)でコードとシンボルの完全なリストを見ることができます）。 

しかし、シンボルを変更したい場合もあるでしょう。オーストラリアドルを例にとると、オーストラリアドルは他の多くのドル通貨と同じ記号を使用しているため、混乱を招きかねない状況では、`AUDしかし、シンボルを変更したい場合もあるでしょう。オーストラリアドルを例にとると、オーストラリアドルは他の多くのドル通貨と同じ記号を使用しているため、混乱を招きかねない状況では、に変更するのが便利かもしれません。次のスニペットは、この方法を説明したものです：

```php
if ( ! function_exists( 'YOUR_PREFIX_change_currency_symbol' ) ) {
  /**
   * Change a currency symbol
   * 
   * @param string $currency_symbol Existing currency symbols.
   * @param string $currency Currency code.
   * @return string $currency_symbol Updated currency symbol(s).
   */  
  function YOUR_PREFIX_change_currency_symbol( $currency_symbol, $currency ) {
    switch ( $currency ) {
      case 'AUD': $currency_symbol = 'AUD$'; break;
    }

    return $currency_symbol;       
  }
  add_filter( 'woocommerce_currency_symbol', 'YOUR_PREFIX_change_currency_symbol', 10, 2 );  
}
```

switch文の中にケースを追加すれば、他の通貨に対しても同じような変更を加えることができる。
