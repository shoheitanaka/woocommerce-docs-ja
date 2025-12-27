---
post_title: Understanding the risks of removing URL bases in WooCommerce
sidebar_label: Risks of removing URL bases
---
# WooCommerceでURLベースを削除するリスクを理解する

## In sum

URLから`/product/`、`/product-category/`、`/shop/`を削除することは、WordPressのURL解決方法上、お勧めできません。WordPressは、`product-category`（またはその他のテキスト）をURLのベースにして、それが商品カテゴリーにつながるURLであることを検出します。このベースを削除できるSEOプラグインもありますが、パフォーマンスや重複URLなど、さまざまな問題を引き起こす可能性があります。

## ♪避けた方がいい

商品カテゴリのURLを入力したときに、どのページに到達しようとしているのかをWordPressが検出しにくくなります。また、WordPressの標準的な「ページ」は、常にURLにベーステキストがないことを理解してください。例えば

- `http://yoursite.com/about-page/`（標準ページのURLです）
- `http://yoursite.com/product-category/category-x/`（商品カテゴリにつながるURLです）

商品カテゴリー」の部分を削除したらどうなるだろうか？

-   `http://yoursite.com/about-page/`
-   `http://yoursite.com/category-x/`。

WordPressは、上記のURLのいずれかを入力したときに、どのページを探しているかを検出するために、より多くの作業を行う必要があります。そのため、SEOプラグインを使用することはお勧めしません。
