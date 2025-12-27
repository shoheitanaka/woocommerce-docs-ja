---
post_title: How to add custom product types to Add Products onboarding list
sidebar_label: Add custom product types to Add Products onboarding list
---

# How to add custom product types to Add Products onboarding list

## はじめに

WooCommerceでは、開発者が商品タイプオンボーディングリストを拡張することができ、商品追加オンボーディングタスク中に、よりカスタマイズ可能で魅力的なエクスペリエンスを提供します。このチュートリアルでは、`experimental_woocommerce_tasklist_product_types` JavaScriptフィルタを使用してWooCommerceストアにカスタム商品タイプを追加する方法を説明します。

## 前提条件

- JavaScriptとPHPの基本的な理解
- WordPressサイトにWooCommerce 8.8以降がインストールされていること。

## ステップ1：JavaScriptフィルタの追加

新しい商品タイプをオンボーディングリストに追加するには、`@wordpress/hooks`パッケージ、特にaddFilter関数を利用します。ご存じでない方もいらっしゃるかもしれませんが、`@wordpress/hooks`を使用することで、コアコードを変更することなくWordPressとWooCommerceのエコシステム内の機能を変更または拡張することができます。

まず、`@wordpress/hooks`パッケージがインストールされていることを確認してください。インストールされていない場合は、`npm`または`yarn`を使ってプロジェクトに追加してください：

`npm install @wordpress/hooks`。

`yarn add @wordpress/hooks`。

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

## ステップ2：オプション - onClickハンドラのカスタマイズ

デフォルトでは、onClick ハンドラが提供されない場合、オンボーディングタスクはデフォルトの CSV テンプレートハンドラを使用します。この動作をカスタマイズするには、商品タイプオブジェクト内で独自のonClickハンドラを指定します。

## ステップ3: CSVテンプレートパスの変更(オプション)

カスタム商品タイプに別のCSVテンプレートを使用したい場合は、PHPのwoocommerce_product_template_csv_file_pathフィルタを使用してテンプレートパスを変更できます。以下はテンプレートパスの変更方法の例です：

```php
add_filter('woocommerce_product_template_csv_file_path', function($path) {
   // Specify your custom template path here
   return $newPath;
});
```

## 結論

WooCommerceでは、商品タイプのオンボーディングリストを拡張することは簡単で、オンボーディングエクスペリエンスをカスタマイズするための大きな柔軟性を提供します。このチュートリアルで説明するステップに従うことで、WooCommerceストアを強化し、商品の追加タスクをより適切で、特定のニーズに役立つものにすることができます。
