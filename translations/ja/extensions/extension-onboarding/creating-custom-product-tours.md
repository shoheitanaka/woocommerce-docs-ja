---
post_title: How to create custom product tours
sidebar_label: How to create custom product tours
---

# How to create custom product tours

## Introduction

WooCommerce allows developers to extend or replace the product tour, offering a more customizable and engaging experience during product creation. This tutorial will guide you through adding a custom product tour to your WooCommerce store using the `experimental_woocommerce_admin_product_tour_steps` JavaScript filter.

これは、製品タイプのオンボーディングリストをカスタマイズする機能と連動しています。

## Prerequisites

- JavaScriptとPHPの基本的な理解
- WordPressサイトにWooCommerce 8.8以降がインストールされていること。

## Adding a JavaScript Filter

To alter or create a product tour, we'll utilize the `@wordpress/hooks` package, specifically the `addFilter` function. If you're not already familiar, `@wordpress/hooks` allows you to modify or extend features within the WordPress and WooCommerce ecosystem without altering the core code.

First, ensure you have the `@wordpress/hooks` package installed. If not, you can add it to your project using `npm` or `yarn`:

`npm install @wordpress/hooks`

or:

`yarn add @wordpress/hooks`

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

This filter replaces the entire product tour for a `custom-product` product type. Using built-in JavaScript array manipulation functions, you can also customize the default tour (by altering, adding, or removing steps).

The `tourType` is set by the `tutorial_type` GET parameter.

## Conclusion

WooCommerceでは、商品ツアーの拡張とカスタマイズは簡単で、オンボーディングエクスペリエンスをカスタマイズするための大きな柔軟性を提供します。このチュートリアルで説明するステップに従うことで、WooCommerceストアを拡張し、商品追加ツアーをより適切で、特定のニーズに役立つものにすることができます。
