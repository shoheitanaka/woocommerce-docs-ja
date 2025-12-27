---
post_title: String localization guidelines
sidebar_label: String localization guidelines
---

# String localization guidelines

1.すべての文字列で`woocommerce`テキストドメインを使用する。
2.printf/sprintfで動的文字列を使用する場合、1つ以上の文字列を置き換える場合は、番号付きの引数を使用する。
3.例えば、`Some Thing`は`Some thing`となる。
4.HTMLは避ける。必要であれば、sprintfを使ってHTMLを挿入する。

詳しくは WP core document [i18n for WordPress Developers](https://codex.wordpress.org/I18n_for_WordPress_Developers) をご覧ください。
