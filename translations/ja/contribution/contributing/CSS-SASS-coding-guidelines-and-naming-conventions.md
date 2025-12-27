---
post_title: CSS SASS coding guidelines and naming conventions
---

# CSS SASS coding guidelines and naming conventions

我々のガイドラインは、それ自体がBEMの方法論に従っている[Calypso](https://github.com/Automattic/wp-calypso)で使用されているものに基づいている。詳細は[このドキュメント](https://wpcalypso.wordpress.com/devdocs/docs/coding-guidelines/css.md?term=css)を参照してください。ただし、WooCommerceにはいくつかの違いがあり、その概要は以下のとおりです；

## 接頭辞

WordPressプラグインであるWooCommerceは、WordPressコアや他のプラグイン/テーマとうまく連携する必要があります。競合の可能性を最小限にするために、すべてのクラスのプレフィックスは`.woocommerce-`でなければなりません。

## クラス名

CalypsoはReactで構築されており、コンポーネント名を使用してCSSクラス名を作成します。WooCommerce Coreにはこれらのコンポーネントがないため、より伝統的な[BEM](http://getbem.com/)アプローチで[クラスの命名](http://cssguidelin.es/#bem-like-naming)を行います。 

クラスを追加するときは、覚えておいてほしい；

* **ブロック** - 単体で意味を持つもの。
* **要素** - ブロックの一部であり、単独では意味を持たない。ブロックと意味的に結びついている。
* **モディファイア** - ブロックやエレメントのフラグ。外観や動作を変更するために使用する。

### 例

* `.woocommerce-loop {}`（ブロック）。
* `.woocommerce-loop-product {}` (ネストされたブロック)。
* `.woocommerce-loop-product--sale {}` (モディファイア)。
* `.woocommerce-loop-product__link {}` (要素)。
* `.woocommerce-loop-product__title {}` (要素)。
* `.woocommerce-loop-product__price {}` (要素)。
* `.woocommerce-loop-product__rating {}` (要素)。
* `.woocommerce-loop-product__button-add-to-cart {}` (要素)。
* `.woocommerce-loop-product__button-add-to-cart--added {}` (修飾子)。

**注:** `.woocommerce-loop-product` は、`.woocommerce-loop` の中にネストされているため、__INLINE_CODE_0__ というクラス名ではありません。なぜなら、ブロックは__INLINE_CODE_1__の中に入れ子になっているからです。ネストされたブロックは親のフルネームを継承する必要はありません。

BEMのキーコンセプトについては、[BEMの方法論のドキュメントで](https://en.bem.info/methodology/key-concepts/)詳しく読むことができます。

* ここと矛盾しない限り、[WP Coding standards for CSS](https://make.wordpress.org/core/handbook/best-practices/coding-standards/css/) に従ってください。
* [Calypsoガイドライン](https://wpcalypso.wordpress.com/devdocs/docs/coding-guidelines/css.md?term=css)に従うこと。
* [クラス名](https://en.bem.info/methodology/naming-convention/)にはBEMを使いましょう。
* すべてのものに接頭辞をつける。
