---
post_title: Example WordPress plugin header comment for WooCommerce extensions
sidebar_label: Plugin header comments
---
# WooCommerce 拡張機能のための WordPress プラグインのヘッダーコメントの例

これはWordPressのプラグインヘッダーコメントです。WordPressにプラグインのメタデータを提供するために使用されます。 

```php
/**
* Plugin Name: WooCommerce Extension
* Plugin URI: https://woocommerce.com/products/woocommerce-extension/
* Description: Your extension's description text.
* Version: 1.0.0
* Author: Your Name
* Author URI: http://yourdomain.com/
* Developer: Your Name
* Developer URI: http://yourdomain.com/
* Text Domain: woocommerce-extension
* Domain Path: /languages
*
* WC requires at least: 8.0
* WC tested up to: 8.3
*
* License: GNU General Public License v3.0
* License URI: http://www.gnu.org/licenses/gpl-3.0.html
* Woo: 12345:342928dfsfhsf8429842374wdf4234sfd
*/
```

各行の内容は以下の通り：

* プラグイン名：プラグインの名前。
* プラグインURI：プラグインのホームページまたはWooCommerce.comの商品ページ。
* 説明プラグインの簡単な説明。
* バージョン：プラグインの現在のバージョン番号。
* 作者：プラグインの作者の名前。
* 作者のURI：作者のウェブサイトまたはプロフィールページ。
* 開発者：作者と異なる場合は開発者の名前。
* 開発者の URI：開発者のウェブサイトまたはプロフィールページ。
* テキストドメイン：テキストドメインは国際化のために使われます。
* ドメインパス：ドメインパスは、MOファイルがどこにあるかを示すために使用されます。
* WC requires at least：プラグインが動作するために必要なWooCommerceの最小バージョン。
* WC tested up to：プラグインがテストされたWooCommerceの最新バージョン。
* ライセンスプラグインのライセンス。
* ライセンスURI：ライセンスの詳細が説明されているURL。
* Woo: WooCommerce.comで販売されているプラグインのユニークな識別子。拡張機能を投稿する際、または新しいバージョンを追加する際、**メインファイルのヘッダーに自動的に追加されます**。手動で追加する必要はありませんが、アップロードする前に追加することもできます。 

このヘッダーコメントは、WordPressが読めるように、メインプラグインファイルの一番上に置かれます。
