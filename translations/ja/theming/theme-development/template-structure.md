---
post_title: Template structure & Overriding templates via a theme
---
# テンプレートの構造とテーマによるテンプレートの上書き

---

**注意** このドキュメントはPHPテンプレートを使用するクラシックテーマについて言及しています。HTMLテンプレートを使うブロックテーマに取り組んでいる場合、[ブロックテーマ用のThemingドキュメントを確認してください](../block-theme-development/theming-woo-blocks.md)。
概要

---

## 概要

WooCommerceテンプレートファイルには、あなたのストアのフロントエンドとHTMLメールのマークアップとテンプレート構造が含まれています。

## テンプレートリスト

WooCommerceサイトの様々なテンプレートファイルは、FTPクライアントまたはhostsファイルマネージャ経由で`/wp-content/plugins/woocommerce/templates/`にあります。または、[GitHubのリポジトリにあるテンプレートファイル](https://github.com/woocommerce/woocommerce/blob/trunk/docs/theme-development/template-structure.md)を見つけることができます。

注：旧バージョンのテンプレートファイルをお探しの場合は、これらのパスにあります：

-   バージョン 6.0.0 以降：`https://github.com/woocommerce/woocommerce/tree/[VERSION_NUMBER]/plugins/woocommerce/templates`
    -   例えば、WooCommerce 9.4.0のテンプレートファイルを見つけるには、[https://github.com/woocommerce/woocommerce/tree/9.4.0/plugins/woocommerce/templates](https://github.com/woocommerce/woocommerce/tree/9.4.0/plugins/woocommerce/templates]に移動します。
-   6.0.0より前のバージョン: `https://github.com/woocommerce/woocommerce/tree/[VERSION_NUMBER]/templates`
    -   例えば、WooCommerce 5.9.0のテンプレートファイルを見つけるには、[https://github.com/woocommerce/woocommerce/tree/5.9.0/templates](https://github.com/woocommerce/woocommerce/tree/5.9.0/templates]に移動します。

## フックによるテンプレートの変更

テンプレート・ファイルを開くと、テンプレート・ファイルそのものを編集することなくコンテンツの追加や移動ができる「フック」が含まれていることに気づくでしょう。フックとは、あるコード片が、あらかじめ定義された特定の場所で、別のコード片と相互作用したり変更したりするための方法です。この方法によって、テーマの特定の場所に「フック」するコード・スニペットを実装することができます。テンプレートファイルにはまったく手を加えず、子テーマを設定する必要もないので、アップグレードの問題を避けることができます。

[/wp-content/plugins/woocommerce/templates/emails/admin-new-order.php](https://github.com/woocommerce/woocommerce/blob/8.9.0/plugins/woocommerce/templates/emails/admin-new-order.php)を見て、フックがどのように見えるか見てみましょう。30行目から始まる以下のコードは、新規注文メールの注文詳細セクションを生成する役割を担っています。

```php
/*
 * @hooked WC_Emails::order_details() Shows the order details table.
 * @hooked WC_Structured_Data::generate_order_data() Generates structured data.
 * @hooked WC_Structured_Data::output_structured_data() Outputs structured data.
 * @since 2.5.0
 */
do_action( 'woocommerce_email_order_details', $order, $sent_to_admin, $plain_text, $email );
```

上のコードは、下の画像で赤くハイライトされているブロックを出力します。これは、ショップマネージャーが、サイト上で注文が成功した後に受け取る新規注文メールです：

![画像](https://woocommerce.com/wp-content/uploads/2020/05/templating-using-hooks.webp)

以下のコードは、希望する機能を構築するための出発点として使用することができます。このコードをコード・スニペット・プラグインに追加することで、テンプレート自体を編集することなく、テンプレートの特定の場所で出力を変更することができます。他のフックについても同様です。

```php
add_action( 'woocommerce_email_order_details', 'my_custom_woo_function');
function my_custom_woo_function() {
    /* Your code goes here */
}
```

## ファイルを編集してテンプレートを変更する

プラグインや親テーマのファイルを直接編集すると、サイトを停止させるようなエラーを引き起こす危険性があります。さらに重要なのは、この方法で加えられた変更は、プラグインやテーマがアップデートされると消えてしまうということです。

その代わりに、[子テーマをセットアップする](https://developer.woocommerce.com/docs/how-to-set-up-and-use-a-child-theme/)ことをお勧めします。

この例では、子テーマを`storefront-child`と呼ぶことにします。`storefront-child`を設置した状態で、オーバーライドを使用することにより、アップグレードしても安全な方法で編集を行うことができます。子テーマの`/storefront-child/woocommerce/`というディレクトリにテンプレートをコピーして、同じファイル構造を保ちますが、`/templates/`サブディレクトリを削除します。

この例で管理者オーダー通知をオーバーライドするには、`wp-content/plugins/woocommerce/templates/emails/admin-new-order.php`を`wp-content/themes/storefront-child/woocommerce/emails/admin-new-order.php`にコピーします。

コピーされたファイルはWooCommerceのデフォルトテンプレートファイルを上書きするので、コピーされたファイルに好きな変更を加えることができ、結果の出力に反映されるのを見ることができます。

---

**注意** テンプレートがアップグレードセーフであることの（望ましい）副作用として、WooCommerceコアテンプレートは更新されますが、カスタムオーバーライドは更新されません。システムステータスレポートに「バージョン3.5.0は古いです。コアバージョンは3.7.0です。このような場合は、古いWooCommerceテンプレートを修正するガイドに従ってください。

---

## カスタムテンプレートのテーマサポートを宣言する

テーマ開発者またはカスタムテンプレートを持つテーマを使用している場合、`add_theme_support`関数を使用してWooCommerceテーマのサポートを宣言する必要があります。GitHub の [Declaring WooCommerce Support in Themes](https://github.com/woocommerce/woocommerce/wiki/Declaring-WooCommerce-support-in-themes) を参照してください。

お使いのテーマに`woocommerce.php`がある場合、`woocommerce.php`が他のテンプレートファイルよりも優先されるため、`woocommerce/archive-product.php`を上書きすることはできません。これは表示の問題を防ぐためです。

---

Wooストアの編集でサポートが必要ですか？WooExpert代理店がお手伝いします。高度にカスタマイズされた拡張性の高いオンラインストアを構築してきた実績のある信頼できる代理店です。
[エキスパートを雇う](https://woocommerce.com/customizations/).
