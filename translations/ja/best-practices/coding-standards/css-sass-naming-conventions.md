---
post_title: CSS/Sass naming conventions
---

# CSS/Sass naming conventions

## はじめに

私たちのガイドラインは、[BEM手法](https://getbem.com/)に従っている[カリプソ](https://github.com/Automattic/wp-calypso)で使用されているものに基づいている。

詳細は[Calypso CSS/Sassコーディングガイドライン](https://wpcalypso.wordpress.com/devdocs/docs/coding-guidelines/css.md)を参照してください。

[BEMのキーコンセプト](https://en.bem.info/methodology/key-concepts/)についてもっと読む。

WooCommerceにはいくつかの違いがあります。

## 接頭辞

WordPressのプラグインとして、WooCommerceはWordPressコアや他のプラグイン/テーマとうまく連携しなければなりません。競合の可能性を最小限にするために、すべてのクラスには`.woocommerce-`を先頭に付ける必要があります。

## クラス名

クラス名をつけるときは、覚えておいてほしい：

- **ブロック** - 単独で意味のある独立したエンティティ。コンポーネントの名前など。
- **要素** - ブロックの一部であり、単独では意味を持たない。ブロックと意味的に結びついている。
- **モディファイア** - ブロックやエレメントのフラグ。外観や動作を変更するために使用します。

### 例

```css
/* Block */
.woocommerce-loop {}

/* Nested block */
.woocommerce-loop-product {}

/* Modifier */
.woocommerce-loop-product--sale {}

/* Element */
.woocommerce-loop-product__link {}

/* Element */
.woocommerce-loop-product__button-add-to-cart {}

/* Modifier */
.woocommerce-loop-product__button-add-to-cart--added {}
```

**注：** `.woocommerce-loop-product`は、`.woocommerce-loop`の中に入れ子になっているため、このような名前にはなっていません。これは、単品商品、カート商品などに別々のクラスを持てるようにするためです。 **入れ子になったブロックは、親のフルネームを継承する必要はありません。

[- WordPress Coding standards for CSS](https://make.wordpress.org/core/handbook/best-practices/coding-standards/css/) に従ってください。
- [CSSのCalypsoガイドライン](https://wpcalypso.wordpress.com/devdocs/docs/coding-guidelines/css.md)に従う。
- [クラス名](https://en.bem.info/methodology/naming-convention/)にはBEMを使用する。
- すべてのクラス名にプレフィックスを付ける。
