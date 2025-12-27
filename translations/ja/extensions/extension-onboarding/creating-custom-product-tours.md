---
post_title: How to create custom product tours
sidebar_label: How to create custom product tours
---

# How to create custom product tours

## はじめに

WooCommerceでは、開発者が商品ツアーを拡張または置き換えることができ、商品作成時にカスタマイズ可能で魅力的な体験を提供します。このチュートリアルでは、`experimental_woocommerce_admin_product_tour_steps` JavaScriptフィルタを使用して、WooCommerceストアにカスタム商品ツアーを追加する方法を説明します。

これは、製品タイプのオンボーディングリストをカスタマイズする機能と連動しています。

## 前提条件

- JavaScriptとPHPの基本的な理解
- WordPressサイトにWooCommerce 8.8以降がインストールされていること。

## JavaScriptフィルタの追加

商品ツアーを変更または作成するには、`@wordpress/hooks`パッケージ、特に`addFilter`関数を使用します。ご存じない方もいらっしゃるかもしれませんが、`@wordpress/hooks`を使用すると、コアコードを変更することなく、WordPressとWooCommerceエコシステム内の機能を変更または拡張することができます。

まず、`@wordpress/hooks`パッケージがインストールされていることを確認してください。インストールされていない場合は、`npm`または`yarn`を使ってプロジェクトに追加してください：

`npm install @wordpress/hooks`。

`yarn add @wordpress/hooks`。

次に、次のJavaScriptコードをプロジェクトに追加します。このコードスニペットは、商品ツアーをカスタムツアーに置き換える方法を示しています：

```javascript
/**
* External dependencies
*/
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

addFilter(
   experimental_woocommerce_admin_product_tour_steps,
   'custom-product',
   (tourSteps, tourType) => {
	if ('custom-product' !== tourType) {
   		return tourSteps;
}

	return [
		{
		   referenceElements: {
		      desktop: '#title',// The element to highlight
		   },
		   focusElement: {
		      desktop: '#title',// A form element to be focused
		   },
		   meta: {
		      name: 'product-name', // Step name
		      heading: __( 'Product name', 'custom-product' ),
  		      descriptions: {
		         desktop: __(
		            'Start typing your new product name here. This will be what your customers will see in your store.',
		            'custom-product'
		         ),
		      },
		   },
		},
	];
   }
);
```

このフィルタは、`custom-product`商品タイプの商品ツアー全体を置き換えます。組み込みのJavaScript配列操作関数を使用して、デフォルトのツアーをカスタマイズすることもできます（ステップを変更、追加、削除する）。

`tourType`は、`tutorial_type` GETパラメータによって設定される。

## 結論

WooCommerceでは、商品ツアーの拡張とカスタマイズは簡単で、オンボーディングエクスペリエンスをカスタマイズするための大きな柔軟性を提供します。このチュートリアルで説明するステップに従うことで、WooCommerceストアを拡張し、商品追加ツアーをより適切で、特定のニーズに役立つものにすることができます。
