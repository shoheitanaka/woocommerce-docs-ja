---
post_title: Add a message above the login / register form
---

# Add a message above the login / register form

このコードは、ユーザーのmy-accountページのログイン/登録フォームの上にカスタムメッセージを追加します。

```php
if ( ! function_exists( 'YOUR_PREFIX_login_message' ) ) {
    /**
     * Add a message above the login / register form on my-account page
     */
    function YOUR_PREFIX_login_message() {
        if ( get_option( 'woocommerce_enable_myaccount_registration' ) == 'yes' ) {
            ?>
            <div class="woocommerce-info">
            <p><?php _e( 'Returning customers login. New users register for next time so you can:', 'YOUR-TEXTDOMAIN' ); ?></p>
            <ul>
                <li><?php _e( 'View your order history', 'YOUR-TEXTDOMAIN' ); ?></li>
                <li><?php _e( 'Check on your orders', 'YOUR-TEXTDOMAIN' ); ?></li>
                <li><?php _e( 'Edit your addresses', 'YOUR-TEXTDOMAIN' ); ?></li>
                <li><?php _e( 'Change your password', 'YOUR-TEXTDOMAIN' ); ?></li>
            </ul>
            </div>
            <?php
        }
    }
    add_action( 'woocommerce_before_customer_login_form', 'YOUR_PREFIX_login_message' );
}
```

このコードが機能するためには、WooCommerceの「アカウントとプライバシー」設定で以下のオプションがチェックされている必要があることに注意してください：

-   チェックアウト時にお客様がアカウントを作成できるようにする。
-   マイアカウント」ページでアカウントを作成できるようにする。
