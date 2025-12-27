---
post_title: How to add store management links
sidebar_label: Add store management links
---

# How to add store management links

## はじめに

新しく改良されたWooCommerceのホーム画面には、最近注目されているプラグイン開発者向けの拡張性が2点あります。1つ目はセットアップタスクリストで、ユーザーに完了すべきタスクを思い出させたり、進捗状況を管理したりすることができます。

2つ目は、店舗管理リンクセクションです。ユーザーがセットアップ作業を完了すると、このセクションが表示されます。このセクションには、マーチャントがWooCommerceの機能を素早く見つけるために使用できる便利なナビゲーションリンクのリストが集約されています。

発見しやすさ」はユーザーにとって難しいことなので、プラグインの機能に注目させ、ユーザーがプラグインが提供する重要な機能への道を簡単に見つけられるようにする絶好の場所になります。

独自の店舗管理リンクを追加するのは簡単なプロセスです。

## 独自の店舗管理リンクを追加

その前に、この機能に関するいくつかの制限を説明しよう。

現在、これらのリンクはユーザーをWooCommerce内に留めるように設計されているため、外部リンクをサポートしていません。

追加したリンクはすべて、リスト内の「エクステンション」という特別なカテゴリーに分類されます。現在のところ、カスタムカテゴリーはサポートされていません。

それらを念頭に置いて、始めよう。

## ステップ 1 - JavaScript をエンキューする

店舗管理リンクの追加はすべてJavaScriptで行われるので、最初のステップは、店舗管理リンクを追加するスクリプトをエンキューすることです。ここで最も重要なことは、店舗管理リンクセクションがレンダリングされる前にスクリプトが実行されるようにすることです。

あなたのスクリプトが私たちのスクリプトより先に実行されるようにするには、優先度を15より高くしてエンキューする必要があります。また、`addFilter`にアクセスするには、`wp-hooks`に依存する必要がある。

```php
function enqueue_management_link_script() {
    wp_enqueue_script( $script_name, $script_url, array( 'wp-hooks' ), 10 );
}

add_action( 'admin_enqueue_scripts', 'enqueue_management_link_script' );
```

## ステップ 2 - @wordpress/icons をインストールする

店舗管理リンクにお好みのアイコンを提供するには、JavaScriptプロジェクトに`@wordpress/icons`をインストールする必要があります：

```sh
npm install @wordpress/icons --save
```

## ステップ 3 - フィルターを追加する

あなたのスクリプトは、`addFilter`を使用して、店舗管理リンクセクションにカスタムリンクを提供する必要があります。また、`@wordpress/icons`からお好みのアイコンをインポートする必要があります。以下に例を示します：

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
