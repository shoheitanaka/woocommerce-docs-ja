---
post_title: How to add store management links
sidebar_label: Add store management links
---

# How to add store management links

## Introduction

新しく改良されたWooCommerceのホーム画面には、最近注目されているプラグイン開発者向けの拡張性が2点あります。1つ目はセットアップタスクリストで、ユーザーに完了すべきタスクを思い出させたり、進捗状況を管理したりすることができます。

2つ目は、店舗管理リンクセクションです。ユーザーがセットアップ作業を完了すると、このセクションが表示されます。このセクションには、マーチャントがWooCommerceの機能を素早く見つけるために使用できる便利なナビゲーションリンクのリストが集約されています。

発見しやすさ」はユーザーにとって難しいことなので、プラグインの機能に注目させ、ユーザーがプラグインが提供する重要な機能への道を簡単に見つけられるようにする絶好の場所になります。

独自の店舗管理リンクを追加するのは簡単なプロセスです。

## Add your own store management link

その前に、この機能に関するいくつかの制限を説明しよう。

現在、これらのリンクはユーザーをWooCommerce内に留めるように設計されているため、外部リンクをサポートしていません。

追加したリンクはすべて、リスト内の「エクステンション」という特別なカテゴリーに分類されます。現在のところ、カスタムカテゴリーはサポートされていません。

それらを念頭に置いて、始めよう。

## Step 1 - Enqueue JavaScript

店舗管理リンクの追加はすべてJavaScriptで行われるので、最初のステップは、店舗管理リンクを追加するスクリプトをエンキューすることです。ここで最も重要なことは、店舗管理リンクセクションがレンダリングされる前にスクリプトが実行されるようにすることです。

To ensure that your script runs before ours you'll need to enqueue it with a priority higher than 15. You'll also need to depend on `wp-hooks` to get access to `addFilter`.

Example:

```php
function enqueue_management_link_script() {
    wp_enqueue_script( $script_name, $script_url, array( 'wp-hooks' ), 10 );
}

add_action( 'admin_enqueue_scripts', 'enqueue_management_link_script' );
```

## Step 2 - Install @wordpress/icons

To provide an icon of your choice for your store management link, you'll need to install `@wordpress/icons` in your JavaScript project:

```sh
npm install @wordpress/icons --save
```

## Step 3 - Add your filter

Your script will need to use `addFilter` to provide your custom link to the store management link section. And you'll need to import your icon of choice from `@wordpress/icons`. Here's an example:

```js
import { megaphone } from "@wordpress/icons";
import { addFilter } from "@wordpress/hooks";

addFilter(
  "woocommerce_admin_homescreen_quicklinks",
  "my-extension",
  (quickLinks) => {
    return [
      ...quickLinks,
      {
        title: "My link",
        href: "link/to/something",
        icon: megaphone,
      },
    ];
  }
);
```

新しいカスタム店舗管理リンクを使用したスクリーンショットです：

![screen shot of custom store management link in wp-admin](https://developer.woocommerce.com/wp-content/uploads/2023/12/yvXeSya.png)
