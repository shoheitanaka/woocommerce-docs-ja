---
post_title: 'Check if a payment method support refunds, subscriptions or pre-orders'
sidebar_label: 'Payment method support for refunds, subscriptions, pre-orders'
current wccom url: >-
  https://woocommerce.com/document/check-if-payment-gateway-supports-refunds-subscriptions-preorders/
---

# Check if a Payment Method Support Refunds, Subscriptions or Pre-orders

ペイメントメソッドのドキュメントにサポートされている機能の概要が明確に記載されていない場合、ペイメントメソッドのコードを見れば、どの機能がサポートされているかがわかることが多い。

支払い方法は、WooCommerceとその拡張機能の特定の機能のサポートを追加することができます。例えば、支払い方法は返金、定期購入、予約注文機能をサポートすることができます。

## Simplify Commerce example

Taking the Simplify Commerce payment method as an example, open the plugin files in your favorite editor and search for `$this->supports`. You'll find the supported features:

```php
class WC_Gateway_Simplify_Commerce extends WC_Payment_Gateway {    

/**      * Constructor   */
    public function __construct() {
        $this->id
                 = 'simplify_commerce';
        $this->method_title
       = __( 'Simplify Commerce', 'woocommerce' );
        $this->method_description = __( 'Take payments via Simplify Commerce - uses simplify.js to create card tokens and the Simplify Commerce SDK. Requires SSL when sandbox is disabled.', 'woocommerce' );
        $this->has_fields         = true;
        $this->supports           = array(
            'subscriptions',
            'products',
            'subscription_cancellation',
            'subscription_reactivation',
            'subscription_suspension',
            'subscription_amount_changes',
            'subscription_payment_method_change',
            'subscription_date_changes',
            'default_credit_card_form',
            'refunds',
            'pre-orders'
        );    
```

If you don't find `$this->supports` in the plugin files, that may mean that the payment method isn't correctly declaring support for refunds, subscripts or pre-orders.
