---
post_title: How to add custom product types to Add Products onboarding list
sidebar_label: Add custom product types to Add Products onboarding list
---

# How to add custom product types to Add Products onboarding list

## Introduction

WooCommerce allows developers to extend the product type onboarding list, offering a more customizable and engaging experience during the Add Products onboarding task. This tutorial will guide you through adding custom product types to your WooCommerce store using the `experimental_woocommerce_tasklist_product_types` JavaScript filter.

## Prerequisites

- JavaScriptとPHPの基本的な理解
- WordPressサイトにWooCommerce 8.8以降がインストールされていること。

## Step 1: Adding a JavaScript Filter

To add a new product type to the onboarding list, we'll utilize the `@wordpress/hooks` package, specifically the addFilter function. If you're not already familiar, `@wordpress/hooks` allows you to modify or extend features within the WordPress and WooCommerce ecosystem without altering the core code.

First, ensure you have the `@wordpress/hooks` package installed. If not, you can add it to your project using `npm` or `yarn`:

`npm install @wordpress/hooks`

or:

`yarn add @wordpress/hooks`

次に、次のJavaScriptコードをプロジェクトに追加します。このコード・スニペットは、オンボーディング・リストに「カスタム商品」タイプを追加する方法を示しています：

```javascript
/**
* External dependencies
*/
import { addFilter } from '@wordpress/hooks';
import { Icon, chevronRight } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import FolderMultipleIcon from 'gridicons/dist/folder-multiple';

addFilter(
   'experimental_woocommerce_tasklist_product_types',
   'custom-product',
   (productTypes) => [
       ...productTypes,
       {
           key: 'custom-product',
           title: __('Custom product', 'custom-product'),
           content: __('Create an awesome custom product.', 'custom-product'),
           before: <FolderMultipleIcon />,
           after: <Icon icon={chevronRight} />,
           onClick: () => {
           }
       },
   ]
);
```

このフィルターには「カスタム商品」という新しい商品タイプが追加され、簡単な説明とタイトルの前後にアイコンが表示され、視覚的にアピールすることができます。

## Step 2: Optional - Customizing the onClick Handler

デフォルトでは、onClick ハンドラが提供されない場合、オンボーディングタスクはデフォルトの CSV テンプレートハンドラを使用します。この動作をカスタマイズするには、商品タイプオブジェクト内で独自のonClickハンドラを指定します。

## Step 3: Modifying the CSV Template Path (Optional)

カスタム商品タイプに別のCSVテンプレートを使用したい場合は、PHPのwoocommerce_product_template_csv_file_pathフィルタを使用してテンプレートパスを変更できます。以下はテンプレートパスの変更方法の例です：

```php
add_filter('woocommerce_product_template_csv_file_path', function($path) {
   // Specify your custom template path here
   return $newPath;
});
```

## Conclusion

WooCommerceでは、商品タイプのオンボーディングリストを拡張することは簡単で、オンボーディングエクスペリエンスをカスタマイズするための大きな柔軟性を提供します。このチュートリアルで説明するステップに従うことで、WooCommerceストアを強化し、商品の追加タスクをより適切で、特定のニーズに役立つものにすることができます。
