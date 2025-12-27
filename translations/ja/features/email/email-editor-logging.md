---
post_title: Email editor logging
sidebar_label: Email editor logging
---
# メールエディターログ

メールエディタのログは、通常操作時のノイズを減らすために重要度のしきい値を使用します。デフォルトでは、警告以上のログのみが記録されます。ロギングレベルを変更するには、`woocommerce_email_editor_logging_threshold`フィルタを使用してください：

```php
add_filter( 'woocommerce_email_editor_logging_threshold', function() {
    return WC_Log_Levels::DEBUG;
} );
```

これにより、メールエディタの初期化、パーソナライズタグの登録など、すべてのメールエディタ操作のロギングが有効になります。

利用可能なログレベルとその優先順位については、[WooCommerceにおけるログ](/docs/best-practices/data-management/logging/#level) ドキュメントを参照してください。
