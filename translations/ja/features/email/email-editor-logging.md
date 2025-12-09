---
post_title: Email editor logging
sidebar_label: Email editor logging
---

# Email Editor Logging

Email editor logging uses a severity threshold to reduce noise during normal operation. By default, only warnings and above are logged. To change the logging level, use the `woocommerce_email_editor_logging_threshold` filter:

```php
add_filter( 'woocommerce_email_editor_logging_threshold', function() {
    return WC_Log_Levels::DEBUG;
} );
```

これにより、メールエディタの初期化、パーソナライズタグの登録など、すべてのメールエディタ操作のロギングが有効になります。

利用可能なログレベルとその優先順位については、[WooCommerceにおけるログ](/docs/best-practices/data-management/logging/#level) ドキュメントを参照してください。
