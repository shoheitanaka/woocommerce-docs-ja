---
post_title: How to fix outdated WooCommerce templates
sidebar_label: Fix outdated templates
---

# How to fix outdated WooCommerce templates

## Template Updates and Changes

WooCommerceの新しいバージョンがリリースされると、デフォルトテンプレートを更新することがあります。これはメジャーリリース（WooCommerce 2.6、3.0、4.0）だけでなく、マイナーリリース（WooCommerce 3.8.0）にも適用されます。

WooCommerceバージョン3.3から、ほとんどのテーマがWooCommerceと相性が良くなりました。 

[Our developer-focused blog](https://developer.woocommerce.com/blog/) will list any template file changes with each release. You may need to update templates yourself or contact the theme author for an update if:

- 古いテンプレートまたは古いバージョンのWooCommerceを使用している場合。
- テンプレートを修正した、または子テーマを使用している。

ほとんどのテーマ作成者は、タイムリーにテーマを修正するので、テーマを更新するだけで更新されたテンプレートを入手できます。

または、すでに現在のWooCommerceテンプレートを使用している別のテーマを選択して使用することもできます。

## How to Update Outdated Templates

更新するテンプレートを決定し、古いテンプレートのバックアップを作成し、カスタマイズを復元する必要があります。

1. Go to WooCommerce > Status > System Status. Scroll to the end of the page where there is a list of templates overridden by your theme/child theme and a warning message that they need to be updated.
2. Save a backup of the outdated template.
3. Copy the default template from `wp-content/plugins/woocommerce/templates/[path-to-the-template]` and paste it in your theme folder found at `wp-content/themes/[path-to-theme]`.
4. Open the template you pasted into the theme folder with a text editor, such as Sublime, Visual Code, BBEdit, Notepad++, and replicate any changes that you had to the previous template in your new, updated template file.

私たちはそれが時間のかかることだと認識しています。そのため、WooCommerceテンプレートを変更しないようにしていますが、後方互換性を壊すことが賢明な場合もあります。

## FAQ

### Where can I find the latest version of WooCommerce?

更新に使用するデフォルトのテンプレートを探している場合、WooCommerceの最新バージョンを使用したい。テンプレートを入手するにはいくつかの簡単な方法があります：

- Access the files via FTP if your current WooCommerce installation is up to date.
- Find the templates per WooCommerce version in our [Template Structure documentation](https://woocommerce.com/document/template-structure/).
- Download the latest version from [the WordPress.org plugin page](https://wordpress.org/plugins/woocommerce/).
- Download the latest release from [the GitHub repository](https://github.com/woocommerce/woocommerce/releases).

### Why don't you make a button to click and update everything?

ビデオやワンクリックのアップデートは不可能だ。なぜか？何千ものテーマがあり、どのテーマも異なるコードで作られているからです。ひとつのサイズがすべてにフィットするわけではありません。
