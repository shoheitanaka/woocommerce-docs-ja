---
post_title: Add link to logged data
sidebar_label: Add link to logged data
---

# Add link to logged data

[ロギング](/docs/best-practices/data-management/logging)はWooCommerceエクステンションの重要な部分です。エラーを追跡し、問題をデバッグするのに役立ちます。一般的なパターンは、ユーザが問題を解決する必要があるときにログを有効にする設定をエクステンションに持つことです。次のコードスニペットは、[設定API](/docs/extensions/settings-and-config/settings-api)のコンテキストで、この設定とログビューアへのリンクを追加する方法の例を示しています。

```php
use Automattic\WooCommerce\Utilities\LoggingUtil;

// Define the label and description for the logging option
$label = __( 'Enable logging', 'your-textdomain-here' );
$description = __( 'Log events and errors to help with troubleshooting.', 'your-textdomain-here' );

// Check if WooCommerce's logging feature is enabled.
if ( LoggingUtil::logging_is_enabled() ) {
    // The source value you use for your extension's log entries. Could be the same as your text domain.
    $source = 'yourpluginslug';
    
    $logs_url = add_query_arg(
        'source',
        $source,
        LoggingUtil::get_logs_tab_url()
    );
    
    $label .= ' | ' . sprintf(
        __( '<a href="%s">View logs</a>', 'your-textdomain-here' ),
        $logs_url
    );
}

// Add the logging option to the form fields.
$form_fields['yourpluginslug_debug'] = array(
  'title'       => __( 'Debugging', 'your-textdomain-here' ),
  'label'       => $label,
  'description' => $description,
  'type'        => 'checkbox',
  'default'     => 'no'
);
```
