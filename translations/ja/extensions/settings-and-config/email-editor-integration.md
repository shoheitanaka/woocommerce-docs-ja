---
post_title: Email editor integration
sidebar_label: Email editor integration
---

# WooCommerce email editor integration guide

このガイドでは、WooCommerce Email Editorと統合してカスタムメール通知を追加する方法を説明します。  
**注意:** WooCommerce Email Editorは現在アルファ版です。これを有効にするには、**WooCommerce &gt; Settings &gt; Advanced &gt; Features** に行き、**Block Email Editor (alpha)**を有効にしてください。

## Quick start

1. **Extend `WC_Email`** – Create a custom email class for your notification by extending the core WooCommerce email class.
2. **Register with `woocommerce_email_classes`** – Add your new email class to WooCommerce so it appears in the admin email settings.
3. **Register the email with the block editor** – Register your email ID with the `woocommerce_transactional_emails_for_block_editor` filter to enable block editor support.
4. **Create a block template** – Design a block-based template to ensure your email works seamlessly with the WooCommerce Email Editor.
5. **Set up triggers** – Define when and under what conditions your custom email should be sent (for example, after a specific user action or event).

## 1. Create email class

Extend `WC_Email` and implement the required methods:

```php
class YourPlugin_Custom_Email extends WC_Email {

    public function __construct() {
        $this->id             = 'your_plugin_custom_email';
        $this->title          = __( 'Custom Email', 'your-plugin' );
        $this->customer_email = true;
        $this->email_group    = 'your-plugin';

        $this->template_html  = 'emails/your-custom-email.php';
        $this->template_plain = 'emails/plain/your-custom-email.php';
        $this->template_base  = plugin_dir_path( __FILE__ ) . 'templates/';

        parent::__construct();
    }

    public function get_default_subject() {
        return __( 'Your custom email subject', 'your-plugin' );
    }

    public function get_default_heading() {
        return __( 'Your custom email heading', 'your-plugin' );
    }

    public function trigger( $order_id ) {
        $this->setup_locale();

        if ( $order_id ) {
            $order = wc_get_order( $order_id );
            $this->object = $order;
            $this->recipient = $order->get_billing_email();
        }

        if ( $this->is_enabled() && $this->get_recipient() ) {
            $this->send( $this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments() );
        }

        $this->restore_locale();
    }

    public function get_content_html() {
        return wc_get_template_html( $this->template_html, array(
            'order'         => $this->object,
            'email_heading' => $this->get_heading(),
            'sent_to_admin' => false,
            'plain_text'    => false,
            'email'         => $this,
        ) );
    }

    public function get_content_plain() {
        return wc_get_template_html( $this->template_plain, array(
            'order'         => $this->object,
            'email_heading' => $this->get_heading(),
            'sent_to_admin' => false,
            'plain_text'    => true,
            'email'         => $this,
        ) );
    }
}
```

## 2. Register email

WooCommerceにEメールを追加します：

```php
// Add the custom email class to the WooCommerce Emails.
function your_plugin_add_email_class( $email_classes ) {
    $email_classes['YourPlugin_Custom_Email'] = new YourPlugin_Custom_Email();
    return $email_classes;
}
add_filter( 'woocommerce_email_classes', 'your_plugin_add_email_class' );

// Add the custom email group. This is only necessary if email_group is not set on the WC_Email class.
function your_plugin_add_email_group( $email_groups ) {
    $email_groups['your-plugin'] = __( 'Your Plugin', 'your-plugin' );
    return $email_groups;
}
add_filter( 'woocommerce_email_groups', 'your_plugin_add_email_group' );
```

## 3. Register the email with the block editor

Third-party extensions need to explicitly opt their emails into block editor support. This is done by registering your email ID with the `woocommerce_transactional_emails_for_block_editor` filter:

```php
/**
 * Register custom transactional emails for the block editor.
 *
 * @param array $emails Array of email IDs.
 * @return array Modified array of email IDs.
 */
function your_plugin_register_transactional_emails_for_block_editor( $emails ) {
    $emails[] = 'your_plugin_custom_email';
    return $emails;
}
add_filter( 'woocommerce_transactional_emails_for_block_editor', 'your_plugin_register_transactional_emails_for_block_editor' );
```

**重要:** このステップを行わないと、あなたのEメールはEメールリストに表示されるかもしれませんが、サードパーティの開発者から明示的なオプトインが必要なため、Eメールエディタは使用されません。

**Note:** For third-party extensions, WooCommerce will not create an email post unless you opt-in using the `woocommerce_transactional_emails_for_block_editor` filter.

**Development tip:** WooCommerce caches email post-generation with a transient. When testing or developing, delete the transient `wc_email_editor_initial_templates_generated` to force post-generation.

## 4. Create the initial block template

Create `templates/emails/block/your-custom-email.php`:

**Template base property:** Make sure to set the `$template_base` property in your email class constructor to point to your plugin's template directory. This allows WooCommerce to properly locate and load your block template files. The block template filename is expected to match the plain template, but using the `block` directory instead of `plain`.

```php
<?php
use Automattic\WooCommerce\Internal\EmailEditor\BlockEmailRenderer;
defined( 'ABSPATH' ) || exit;
?>

<!-- wp:heading -->
<h2 class="wp-block-heading"><?php printf( esc_html__( 'Hello %s!', 'your-plugin' ), '<!--[woocommerce/customer-first-name]-->' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php printf( esc_html__( 'Thank you for your order #%s.', 'your-plugin' ), '<!--[woocommerce/order-number]-->' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:woocommerce/email-content {"lock":{"move":false,"remove":true}} -->
<div class="wp-block-woocommerce-email-content"><?php echo esc_html( BlockEmailRenderer::WOO_EMAIL_CONTENT_PLACEHOLDER ); ?></div>
<!-- /wp:woocommerce/email-content -->
```

Pro tip: If you use a custom path for your email templates, set the block template path using the `template_block` property on the email class.

**電子メール・コンテンツ・プレースホルダー

The `BlockEmailRenderer::WOO_EMAIL_CONTENT_PLACEHOLDER` is a special placeholder that gets replaced with the main email content when the email is rendered. This placeholder is essential for integrating with WooCommerce's email system and allows the email editor to inject the core email content (like order details, customer information, etc.) into your custom template.

By default, WooCommerce uses the [general block email template](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/templates/emails/block/general-block-email.php) to generate the content that replaces this placeholder. When WooCommerce processes your email template, it replaces this placeholder with the appropriate email content based on the email type and context.

Eメールに異なるコンテンツを使用する必要がある場合、2つの選択肢があります：

**カスタム・ブロック・コンテンツ・テンプレートを使用する。

1. **Set a custom template**: Set the `$template_block_content` property in your email class constructor to point to a custom template for the block content:

    ```php
    $this->template_block_content = 'emails/block/custom-content.php';
    ```

2. **Implement custom logic**: Implement the `get_block_editor_email_template_content` method in your email class to provide custom logic for generating the content:

    ```php
    public function get_block_editor_email_template_content() {
        return '<!-- wp:paragraph -->
    <p>Your custom block template content here</p>
    <!-- /wp:paragraph -->';
    }
    ```

**Using action hook:**
You can use the action hook `woocommerce_email_general_block_email` to execute additional actions within the content template. 

## 5. Set Up Triggers

**WordPressのアクションにフックすることで、メールを送信するタイミングを設定できます。WooCommerceのイベントや独自のカスタムアクションでメールをトリガーすることができます：

```php
function your_plugin_trigger_custom_email( $order_id ) {
    $emails = WC()->mailer()->get_emails();
    $email  = $emails['YourPlugin_Custom_Email'];

    $email->trigger( $order_id );
}

// Trigger on WooCommerce order completion
add_action( 'woocommerce_order_status_completed', 'your_plugin_trigger_custom_email' );

// Trigger on your custom plugin action
add_action( 'your_plugin_custom_action', 'your_plugin_trigger_custom_email' );
```

**使用できる一般的なWooCommerceフック:**。

-   `woocommerce_order_status_completed` - When order is completed
-   `woocommerce_order_status_processing` - When order is processing
-   `woocommerce_new_order` - When new order is created
-   `woocommerce_customer_created` - When new customer registers

## Personalization tags

**Personalization tags** allow you to insert dynamic content into your emails. They appear as `<!--[tag-name]-->` in your templates and get replaced with actual values when the email is sent.

### Built-in tags

WooCommerceには、カテゴリ別に整理された多くのパーソナライズタグが組み込まれています：

#### Customer tags

-   `<!--[woocommerce/customer-email]-->` - Customer's email address
-   `<!--[woocommerce/customer-first-name]-->` - Customer's first name
-   `<!--[woocommerce/customer-last-name]-->` - Customer's last name
-   `<!--[woocommerce/customer-full-name]-->` - Customer's full name
-   `<!--[woocommerce/customer-username]-->` - Customer's username
-   `<!--[woocommerce/customer-country]-->` - Customer's country

#### Order tags

-   `<!--[woocommerce/order-number]-->` - Order number
-   `<!--[woocommerce/order-date]-->` - Order date (supports format parameter)
-   `<!--[woocommerce/order-items]-->` - List of order items
-   `<!--[woocommerce/order-subtotal]-->` - Order subtotal
-   `<!--[woocommerce/order-tax]-->` - Order tax amount
-   `<!--[woocommerce/order-discount]-->` - Order discount amount
-   `<!--[woocommerce/order-shipping]-->` - Order shipping cost
-   `<!--[woocommerce/order-total]-->` - Order total amount
-   `<!--[woocommerce/order-payment-method]-->` - Payment method used
-   `<!--[woocommerce/order-payment-url]-->` - Payment URL for order
-   `<!--[woocommerce/order-transaction-id]-->` - Transaction ID
-   `<!--[woocommerce/order-shipping-method]-->` - Shipping method used
-   `<!--[woocommerce/order-shipping-address]-->` - Formatted shipping address
-   `<!--[woocommerce/order-billing-address]-->` - Formatted billing address
-   `<!--[woocommerce/order-view-url]-->` - Customer order view URL
-   `<!--[woocommerce/order-admin-url]-->` - Admin order edit URL
-   `<!--[woocommerce/order-custom-field]-->` - Custom order field (requires key parameter)

#### Site tags

-   `<!--[woocommerce/site-title]-->` - Site title
-   `<!--[woocommerce/site-homepage-url]-->` - Homepage URL

#### Store tags

-   `<!--[woocommerce/store-email]-->` - Store email address
-   `<!--[woocommerce/store-url]-->` - Store URL
-   `<!--[woocommerce/store-name]-->` - Store name
-   `<!--[woocommerce/store-address]-->` - Store address
-   `<!--[woocommerce/my-account-url]-->` - My Account page URL
-   `<!--[woocommerce/admin-order-note]-->` - Admin order note

### Custom personalization tags

**適切なWooCommerceフックを使用して、プラグイン固有のデータのために独自のタグ**を作成します：

```php
/**
 * Register custom personalization tags for the email editor.
 *
 * @param \Automattic\WooCommerce\EmailEditor\Engine\PersonalizationTags\Personalization_Tags_Registry $registry The registry.
 * @return \Automattic\WooCommerce\EmailEditor\Engine\PersonalizationTags\Personalization_Tags_Registry
 */
function your_plugin_register_personalization_tags( $registry ) {
    // Register custom field tag
    $custom_field_tag = new \Automattic\WooCommerce\EmailEditor\Engine\PersonalizationTags\Personalization_Tag(
        // Display name in editor
        __( 'Custom Field', 'your-plugin' ),
        // Token (unique identifier)
        'your-plugin/custom-field',
        // Category for grouping
        __( 'Your Plugin Group', 'your-plugin' ),
        // Callback function
        'your_plugin_get_custom_field_value',
        // Attributes (optional)
        array(),
        // Value to insert (optional - defaults to token)
        null,
        // Post types this tag works with
        array( 'woo_email' )
    );
    $registry->register( $custom_field_tag );

    return $registry;
}

// Callback function that returns the custom field value
function your_plugin_get_custom_field_value( $context, $args = array() ) {
    $order_id = $context['order']->get_id() ?? 0;
    return get_post_meta( $order_id, '_custom_field', true );
}

// Register with the proper WooCommerce hook
add_filter( 'woocommerce_email_editor_register_personalization_tags', 'your_plugin_register_personalization_tags' );
```

**Usage in templates:** Use `<!--[your-plugin/custom-field]-->` in your block template, and it will be replaced with the value returned by your callback function.

To learn more about personalization tags, please see the [personalization tags documentation](https://github.com/woocommerce/woocommerce/blob/trunk/packages/php/email-editor/docs/personalization-tags.md) in the `woocommerce/email-editor` package.

## Complete example

以下は、ロイヤルティプログラムのウェルカムメールの導入例です：

**Eメールクラス

```php
class YourPlugin_Loyalty_Welcome_Email extends WC_Email {
    public function __construct() {
        $this->id             = 'loyalty_welcome_email';
        $this->title          = __( 'Loyalty Welcome Email', 'your-plugin' );
        $this->customer_email = true;
        $this->email_group    = 'loyalty';

        $this->template_html  = 'emails/loyalty-welcome.php';
        $this->template_plain = 'emails/plain/loyalty-welcome.php';
        $this->template_block = 'emails/block/loyalty-welcome.php';
        $this->template_base  = plugin_dir_path( __FILE__ ) . 'templates/';

        parent::__construct();
    }

    public function get_default_subject() {
        return __( 'Welcome to our Loyalty Program!', 'your-plugin' );
    }

    public function trigger( $customer_id, $points_earned = 0 ) {
        $this->setup_locale();
        $customer = new WC_Customer( $customer_id );
        $this->object = $customer;
        $this->recipient = $customer->get_email();

        if ( $this->is_enabled() && $this->get_recipient() ) {
            $this->send( $this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments() );
        }
        $this->restore_locale();
    }

    public function get_content_html() {
        return wc_get_template_html( $this->template_html, array(
            'customer'       => $this->object,
            'email_heading'  => $this->get_heading(),
            'sent_to_admin'  => false,
            'plain_text'     => false,
            'email'          => $this,
        ) );
    }

    public function get_content_plain() {
        return wc_get_template_html( $this->template_plain, array(
            'customer'       => $this->object,
            'email_heading'  => $this->get_heading(),
            'sent_to_admin'  => false,
            'plain_text'     => true,
            'email'          => $this,
        ) );
    }
}
```

**電子メールのブロック

```php
<!-- wp:heading -->
<h2 class="wp-block-heading"><?php printf( esc_html__( 'Welcome %s!', 'your-plugin' ), '<!--[woocommerce/customer-first-name]-->' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Thank you for joining our loyalty program!', 'your-plugin' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:woocommerce/email-content {"lock":{"move":false,"remove":true}} -->
<div class="wp-block-woocommerce-email-content"><?php echo esc_html( BlockEmailRenderer::WOO_EMAIL_CONTENT_PLACEHOLDER ); ?></div>
<!-- /wp:woocommerce/email-content -->
```

**登録と設定:**。

このコードでは、メールクラス、テンプレート、トリガーを登録することで、すべてを結びつけます：

```php
// Add the custom email class to the WooCommerce Emails.
add_filter( 'woocommerce_email_classes', function( $classes ) {
    $classes['YourPlugin_Loyalty_Welcome_Email'] = new YourPlugin_Loyalty_Welcome_Email();
    return $classes;
} );

// Add the custom email group.
add_filter( 'woocommerce_email_groups', function( $email_groups ) {
    $email_groups['loyalty'] = __( 'Loyalty Program', 'your-plugin' );
    return $email_groups;
} );

// Register the email with the block editor.
add_filter( 'woocommerce_transactional_emails_for_block_editor', function( $emails ) {
    $emails[] = 'loyalty_welcome_email';
    return $emails;
} );

// Set up trigger - when to send the email
add_action( 'your_plugin_customer_joined_loyalty', function( $customer_id, $points_earned ) {
    $emails = WC()->mailer()->get_emails();
    $email  = $emails['YourPlugin_Loyalty_Welcome_Email'];

    $email->trigger( $customer_id, $points_earned );
}, 10, 2 );
```

**どのように機能するか:**

1. **Eメール登録**は、**WooCommerce &gt; 設定 &gt; Eメール**にあなたのEメールを表示します。
2. **Block editor registration** はあなたのEメールをWooCommerce Email Editorで使えるようにします。
3. **テンプレート登録**により、ブロックエディターで使用・編集するメールテンプレートを追加登録することができます。
4. **トリガー設定** 顧客がロイヤリティプログラムに参加した際に自動的にメールを送信します。

## Best practices

-   **Sanitize inputs and escape outputs:** セキュリティの問題や表示の問題を防ぐために、メールのロジックで使用されるデータ、テンプレートのエスケープ出力は常に検証し、サニタイズしてください。
-   **メールクライアント間のテスト:** メールのレイアウトは、さまざまなクライアントで異なって見えることがあります。LitmusやEmail on Acidのようなツールは、一般的なクライアント（Gmail、Outlook、Apple Mailなど）でメールをテストし、意図したとおりに表示されるか確認するのに役立ちます。
-   **Use efficient queries and cache data:** メールのデータを取得する際は、最適化されたクエリーを使用し、可能であれば結果をキャッシュして、サイトの速度を低下させないようにしましょう。
-   **Follow WordPress coding standards:** 読みやすさと互換性を高めるために、WordPressの標準に従ってコードを記述してください。
-   **Include proper error handling:** チェックとエラー処理を追加して、問題（データ不足や送信失敗など）をキャッチし、簡単にデバッグできるようにします。

## Troubleshooting

-   **Email not in admin?**
    Double-check that your email class is registered with the `woocommerce_email_classes` filter and that the class name is correct.
-   **Email not using the block template or email editor?**
    Ensure you have registered your email ID with the `woocommerce_transactional_emails_for_block_editor` filter.
-   **Template not loading?**
    Make sure the template file path is correct and that you have registered it with the email editor.
-   **Tags not working?**
    Confirm that your personalization tag callbacks are registered and returning the expected values.
-   **Email not sending?**
    Check that the email is enabled in WooCommerce settings and that your trigger action is firing as expected.

---

カスタムメールは**WooCommerce &gt; Settings &gt; Emails**に表示され、ブロックエディタを使って編集することができます。
