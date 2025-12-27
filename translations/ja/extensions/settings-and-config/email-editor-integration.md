---
post_title: Email editor integration
sidebar_label: Email editor integration
---
# WooCommerceメールエディター統合ガイド

このガイドでは、WooCommerce Email Editorと統合してカスタムメール通知を追加する方法を説明します。  
**注意:** WooCommerce Email Editorは現在アルファ版です。これを有効にするには、**WooCommerce > Settings > Advanced > Features** に行き、**Block Email Editor (alpha)**を有効にしてください。

## クイックスタート

1. **Extend `WC_Email`** - WooCommerceのコアEメールクラスを拡張して、通知用のカスタムEメールクラスを作成します。
2. **INLINE_CODE_1__**で登録する - 新しいメールクラスをWooCommerceに追加し、管理画面のメール設定に表示されるようにします。
3. **ブロックエディターに登録する** - `woocommerce_transactional_emails_for_block_editor`フィルターにメールIDを登録し、ブロックエディターのサポートを有効にします。
4. **ブロックテンプレートを作成する** - WooCommerceメールエディターとシームレスに動作するようにブロックベースのテンプレートをデザインします。
5. **トリガーの設定** - いつ、どのような条件でカスタムメールを送信するかを定義します。

## 1.メールクラスの作成

`WC_Email`を拡張し、必要なメソッドを実装する：

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

## 2.メール登録

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

## 3.ブロックエディターにメールを登録する

サードパーティのエクステンションは、明示的にブロックエディターのサポートを選択する必要があります。これは`woocommerce_transactional_emails_for_block_editor`フィルターにメールIDを登録することで行います：

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

**注意:** サードパーティの拡張機能の場合、`woocommerce_transactional_emails_for_block_editor`フィルタを使用してオプトインしない限り、WooCommerceはメール投稿を作成しません。

**開発のヒント:** WooCommerceはトランジェントでEメールのポスト生成をキャッシュします。テストや開発時には、トランジェント`wc_email_editor_initial_templates_generated`を削除して、強制的にポストジェネレーションするようにしてください。

### メールテンプレート投稿生成のカスタマイズ

`woocommerce_email_content_post_data`フィルタを使用すると、メールテンプレートの投稿データを作成前に変更することができます。これにより、テンプレート生成時に投稿タイトル、コンテンツ、メタ、その他の投稿データをカスタマイズすることができます。

**フィルター詳細

| プロパティ
| ---------- | ----------------------------------------------------------------------- |
| フック名｜ `woocommerce_email_content_post_data`
| 10.5.0以降
| パラメータ｜`$post_data` (array), `$email_type` (string), `$email_data` ( \WC_Email)
| 戻り値｜配列

**パラメーター

-   `$post_data` _(array)_ - `wp_insert_post()` に渡されるポストデータの配列。`post_type`, `post_status`, `post_title`, `post_content`, `post_excerpt`, `post_name`, `meta_input` のようなキーを含みます。
-   `$email_type` _(string)_ - Eメールタイプの識別子(例えば'customer_processing_order')。
-   `$email_data` _(\WC_Email)_ - WooCommerce emailオブジェクト。

**戻り値:**。

変更した投稿データの配列を返します。この配列は、メールテンプレートの投稿を作成する際に使用されます。

#### 例メールテンプレートの投稿データの変更

```php
/**
 * Customize email template post data during generation.
 *
 * @param array     $post_data  The post data array.
 * @param string    $email_type The email type identifier.
 * @param \WC_Email $email_data The WooCommerce email object.
 * @return array Modified post data.
 */
function your_plugin_customize_email_template_post( $post_data, $email_type, $email_data ) {
    // Modify the post title for specific email types.
    if ( 'customer_processing_order' === $email_type ) {
        $post_data['post_title'] = __( 'Custom Processing Order Email', 'your-plugin' );
    }

    // Modify the post content (block template HTML).
    $post_data['post_content'] = str_replace(
        'default content',
        'custom content',
        $post_data['post_content']
    );

    // Add custom meta data.
    $post_data['meta_input']['custom_meta_key'] = 'custom_value';

    return $post_data;
}
add_filter( 'woocommerce_email_content_post_data', 'your_plugin_customize_email_template_post', 10, 3 );
```

**重要な注意事項

-   有効な `wp_insert_post()` パラメータ (`post_title`、 `post_content`、 `post_excerpt`、 `post_status`、 `post_name`、 `meta_input`など) なら何でも変更できます。
-   常に変更された `$post_data` 配列を返します。
-   `post_content`を変更する場合は、有効なブロックマークアップが維持されていることを確認してください。
-   フィルタはすべてのメールタイプに対して実行されます。特定のメールをターゲットにするには `$email_type` をチェックしてください。

## 4.初期ブロックテンプレートを作成する

`templates/emails/block/your-custom-email.php`を作成する：

**テンプレートベースプロパティ:** メールクラスのコンストラクタで`$template_base`プロパティを設定し、プラグインのテンプレートディレクトリを指すようにしてください。これにより、WooCommerceはブロックテンプレートファイルを適切に見つけ、読み込むことができます。ブロックテンプレートのファイル名はプレーンテンプレートと一致しますが、`plain`の代わりに`block`ディレクトリを使用します。

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

Pro tip: Eメール・テンプレートにカスタム・パスを使用する場合、Eメール・クラスの`template_block`プロパティを使用してブロック・テンプレート・パスを設定します。

**電子メール・コンテンツ・プレースホルダー

`BlockEmailRenderer::WOO_EMAIL_CONTENT_PLACEHOLDER`は特別なプレースホルダーで、メールがレンダリングされる際にメインのメールコンテンツに置き換えられます。このプレースホルダーはWooCommerceのメールシステムと統合するために不可欠であり、メールエディターがカスタムテンプレートにコアメールコンテンツ（注文詳細、顧客情報など）を注入できるようにします。

デフォルトでは、WooCommerceはこのプレースホルダーを置き換えるコンテンツを生成するために[一般ブロックメールテンプレート](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/templates/emails/block/general-block-email.php)を使用します。WooCommerceがEメールテンプレートを処理する際、Eメールの種類とコンテキストに基づいて、このプレースホルダーを適切なEメールコンテンツに置き換えます。

Eメールに異なるコンテンツを使用する必要がある場合、2つの選択肢があります：

**カスタム・ブロック・コンテンツ・テンプレートを使用する。

1. **カスタム・テンプレートを設定する**：メール・クラスのコンストラクタで`$template_block_content`プロパティを設定し、ブロック・コンテンツのカスタム・テンプレートを指定します：

    ```php
    $this->template_block_content = 'emails/block/custom-content.php';
    ```

2. **カスタム・ロジックを実装する**：メールクラスに`get_block_editor_email_template_content`メソッドを実装して、コンテンツを生成するためのカスタムロジックを提供してください：

    ```php
    public function get_block_editor_email_template_content() {
        return '<!-- wp:paragraph -->
    <p>Your custom block template content here</p>
    <!-- /wp:paragraph -->';
    }
    ```

**アクション・フックを使う
アクションフック`woocommerce_email_general_block_email`を使用すると、コンテンツテンプレート内で追加のアクションを実行できます。

## 5.トリガーの設定

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

-   `woocommerce_order_status_completed` - 注文が完了したとき
-   `woocommerce_order_status_processing` - 注文が処理中の場合
-   `woocommerce_new_order` - 新規注文が作成されたとき
-   `woocommerce_customer_created` - 新規顧客が登録されたとき

## 名入れタグ

**パーソナライズタグ**を使用すると、メールに動的なコンテンツを挿入することができます。タグはテンプレートでは`<!--[tag-name]-->`として表示され、メール送信時に実際の値に置き換えられます。

### 内蔵タグ

WooCommerceには、カテゴリ別に整理された多くのパーソナライズタグが組み込まれています：

#### カスタマー・タグ

-   `<!--[woocommerce/customer-email]-->` - お客様のEメールアドレス
-   `<!--[woocommerce/customer-first-name]-->` - お客様のファーストネーム
-   `<!--[woocommerce/customer-last-name]-->` - お客様の姓
-   `<!--[woocommerce/customer-full-name]-->` - お客様のフルネーム
-   `<!--[woocommerce/customer-username]-->` - お客様のユーザー名
-   `<!--[woocommerce/customer-country]-->` - 顧客の国名

#### オーダータグ

-   `<!--[woocommerce/order-number]-->` - 注文番号。
-   `<!--[woocommerce/order-date]-->` - 注文日 (format パラメータをサポートします)
-   `<!--[woocommerce/order-items]-->` - 注文項目のリスト
-   `<!--[woocommerce/order-subtotal]-->` - 注文の小計。
-   `<!--[woocommerce/order-tax]-->` - 注文の税額。
-   `<!--[woocommerce/order-discount]-->` - 注文の割引額
-   `<!--[woocommerce/order-shipping]-->` - 注文の送料。
-   `<!--[woocommerce/order-total]-->` - 注文の合計金額
-   `<!--[woocommerce/order-payment-method]-->` - 使用した支払い方法
-   `<!--[woocommerce/order-payment-url]-->` - 注文の支払い URL
-   `<!--[woocommerce/order-transaction-id]-->` - トランザクション ID
-   `<!--[woocommerce/order-shipping-method]-->` - 利用された配送方法
-   `<!--[woocommerce/order-shipping-address]-->` - フォーマットされた配送先住所
-   形式化された請求先住所 `<!--[woocommerce/order-billing-address]-->` - 形式化された請求先住所
-   `<!--[woocommerce/order-view-url]-->` - 顧客オーダー閲覧 URL
-   `<!--[woocommerce/order-admin-url]-->` - 管理者の注文編集 URL
-   `<!--[woocommerce/order-custom-field]-->` - カスタム注文フィールド (キーパラメーターが必要)

#### サイトタグ

-   `<!--[woocommerce/site-title]-->` - サイトタイトル
-   `<!--[woocommerce/site-homepage-url]-->` - ホームページのURL

#### 店舗タグ

-   `<!--[woocommerce/store-email]-->` - 電子メールアドレスを保存する
-   `<!--[woocommerce/store-url]-->` - ストアの URL
-   `<!--[woocommerce/store-name]-->` - 店舗名
-   店舗住所 `<!--[woocommerce/store-address]-->` - 店舗住所
-   `<!--[woocommerce/my-account-url]-->` - マイアカウント ページ URL
-   `<!--[woocommerce/admin-order-note]-->` - 管理者オーダーノート

### カスタムパーソナライズタグ

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

**ブロック・テンプレートで`<!--[your-plugin/custom-field]-->`を使用すると、コールバック関数が返す値に置き換えられます。

パーソナライゼーション・タグの詳細については、`woocommerce/email-editor`パッケージの[パーソナライゼーション・タグのドキュメント](https://github.com/woocommerce/woocommerce/blob/trunk/packages/php/email-editor/docs/personalization-tags.md)を参照してください。

### パーソナライズタグにカスタムコンテキストを提供する

`woocommerce_email_editor_integration_personalizer_context_data` フィルタを使用して、パーソナライズタグにカスタムコンテキストデータを提供します。これは、パーソナライズタグのコールバックがアクセスできる追加データ (購読の詳細、ロイヤリティポイント、カスタムオーダーのメタデータなど) を拡張モジュールに渡す必要がある場合に便利です。

**フィルター詳細

| プロパティ
| ---------- | ---------------------------------------------------------------- |
| フック名｜ `woocommerce_email_editor_integration_personalizer_context_data`
| 10.5.0 以降
| パラメータ｜`$context` (array), `$email` ( \WC_Email)
| 戻り値 | 配列

**パラメーター

-   `$context` _(array)_ - 既存のコンテキストデータ配列。WooCommerceコアまたは他のエクステンションからのデータが既に含まれている可能性があります。
-   `$email` _(\WC_Email)_ - 処理中のWooCommerce emailオブジェクト。これを使用して、EメールID、受信者、Eメールに関連付けられたオブジェクト(注文や顧客など)にアクセスできます。

**戻り値:**。

Wooのコアコンテキストデータとカスタムコンテキストデータの配列を返します。この配列は`$context`パラメータを通してすべてのパーソナライズタグコールバックからアクセスできます。

#### 例コンテキストに購読データを追加する

```php
/**
 * Add subscription-related context data for personalization tags.
 *
 * @param array     $context The existing context data.
 * @param \WC_Email $email   The WooCommerce email object.
 * @return array Modified context data.
 */
function your_plugin_add_subscription_context( $context, $email ) {
    // Only add context for subscription-related emails.
    if ( strpos( $email->id, 'subscription' ) === false ) {
        return $context;
    }

    // Get the order from the email object.
    $order = $email->object instanceof WC_Order ? $email->object : null;

    if ( ! $order ) {
        return $context;
    }

    // Add your custom subscription data to context.
    $context['subscription_id']       = $order->get_meta( '_subscription_id' );
    $context['subscription_end_date'] = $order->get_meta( '_subscription_end_date' );
    $context['renewal_count']         = (int) $order->get_meta( '_renewal_count' );

    return $context;
}
add_filter( 'woocommerce_email_editor_integration_personalizer_context_data', 'your_plugin_add_subscription_context', 10, 2 );
```

#### 例パーソナライズタグのコールバックでカスタムコンテキストを使用する

カスタムデータをコンテキストに追加すると、パーソナライズタグのコールバックがそのデータにアクセスできるようになります：

```php
/**
 * Personalization tag callback that uses custom context data.
 *
 * @param array $context The context data (includes your custom data).
 * @param array $args    Optional attributes passed to the tag.
 * @return string The personalized value.
 */
function your_plugin_get_subscription_end_date( $context, $args = array() ) {
    // Access the custom context data you added via the filter.
    $end_date = $context['subscription_end_date'] ?? '';

    if ( empty( $end_date ) ) {
        return __( 'N/A', 'your-plugin' );
    }

    // Format the date according to site settings.
    return date_i18n( get_option( 'date_format' ), strtotime( $end_date ) );
}
```

**重要な注意事項

-   フィルタはメールのパーソナライズ中に呼び出されるため、パーソナライズタグが処理されるときにコンテキストデータを利用できます。
-   不要な処理を避けるために、コンテキストデータを追加する前に、メールのタイプが関連するかどうかを常にチェックしてください。
-   WooCommerceコアや他の拡張機能との衝突を防ぐために、コンテキストデータには一意のキーを使用してください。
-   通常`$email->object`プロパティには、メールに関連するメインオブジェクトが含まれます（例：注文メールには`WC_Order`、ユーザー関連メールには`WP_User`）。
-   パーソナライズタグでコンテキストデータを使用する場合は、出力コンテキストに基づいて適切にエスケープしてください（例：_`esc_html()`、_`esc_attr()`、`esc_url()`）。

## 完全な例

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

1. **Eメール登録**は、**WooCommerce > Settings > Emails**にあなたのEメールを表示します。
2. **Block editor registration** はあなたのEメールをWooCommerce Email Editorで使えるようにします。
3. **テンプレート登録**により、ブロックエディターで使用・編集するメールテンプレートを追加登録することができます。
4. **トリガー設定** 顧客がロイヤリティプログラムに参加した際に自動的にメールを送信します。

## ベストプラクティス

-   **Sanitize inputs and escape outputs:** セキュリティの問題や表示の問題を防ぐために、メールのロジックで使用されるデータ、テンプレートのエスケープ出力は常に検証し、サニタイズしてください。
-   **メールクライアント間のテスト:** メールのレイアウトは、さまざまなクライアントで異なって見えることがあります。LitmusやEmail on Acidのようなツールは、一般的なクライアント（Gmail、Outlook、Apple Mailなど）でメールをテストし、意図したとおりに表示されるか確認するのに役立ちます。
-   **Use efficient queries and cache data:** メールのデータを取得する際は、最適化されたクエリーを使用し、可能であれば結果をキャッシュして、サイトの速度を低下させないようにしましょう。
-   **Follow WordPress coding standards:** 読みやすさと互換性を高めるために、WordPressの標準に従ってコードを記述してください。
-   **Include proper error handling:** チェックとエラー処理を追加して、問題（データ不足や送信失敗など）をキャッチし、簡単にデバッグできるようにします。

## トラブルシューティング

-   **Eメールが管理画面にありません。
    メールクラスが`woocommerce_email_classes`フィルターに登録されているか、またクラス名が正しいか再確認してください。
-   **ブロックテンプレートまたはメールエディタを使用していない？
    メールIDが`woocommerce_transactional_emails_for_block_editor`フィルターに登録されているか確認してください。
-   **テンプレートが読み込まれません。
    テンプレートファイルのパスが正しいか、メールエディターに登録されているか確認してください。
-   **タグが動作しませんか？
    パーソナライズタグのコールバックが登録され、期待される値を返していることを確認してください。
-   **メールが送信されません。
    WooCommerceの設定でメールが有効になっているか、トリガーアクションが期待通りに起動しているか確認してください。

---

カスタムメールは**WooCommerce > Settings > Emails**に表示され、ブロックエディタを使って編集することができます。
