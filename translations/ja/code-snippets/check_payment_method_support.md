---
post_title: 'Check if a payment method support refunds, subscriptions or pre-orders'
sidebar_label: 'Payment method support for refunds, subscriptions, pre-orders'
current wccom url: >-
  https://woocommerce.com/document/check-if-payment-gateway-supports-refunds-subscriptions-preorders/
---

# Check if a Payment Method Support Refunds, Subscriptions or Pre-orders

ペイメントメソッドのドキュメントにサポートされている機能の概要が明確に記載されていない場合、ペイメントメソッドのコードを見れば、どの機能がサポートされているかがわかることが多い。

支払い方法は、WooCommerceとその拡張機能の特定の機能のサポートを追加することができます。例えば、支払い方法は返金、定期購入、予約注文機能をサポートすることができます。

## #簡素化されたコマースの例

Simplify Commerceの支払い方法を例にとると、お気に入りのエディタでプラグインファイルを開き、`$this->supports`を検索します。サポートされている機能が見つかります：

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

プラグインファイルの中に`$this->supports`が見つからない場合、支払い方法が払い戻し、予約注文のサポートを正しく宣言していない可能性があります。
