---
post_title: Naming conventions
sidebar_label: Naming conventions
---

# Naming conventions

WooCommerceコアは一般的に[WordPress PHP命名規則](https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/#naming-conventions)に従います。その上で、関数名、クラス名、フック名には接頭辞を付けます。関数のプレフィックスは`wc_`、クラスのプレフィックスは`WC_`、フックのプレフィックスは`woocommerce_`です。

関数名の例：

- `wc_get_product()`
- `wc_is_active_theme()`。

クラス名の例：

- `WC_Breadcrumb`
- `WC_Cart`。

フック名の例（アクションまたはフィルター）：

- `woocommerce_after_checkout_validation`
- `woocommerce_get_formatted_order_total`。

ただし、`src/`内で定義されたクラスには例外があります。このディレクトリ内では

- クラス名には`WC_`という接頭辞を使用しません（この場所にあるクラスはすべて`Automattic\WooCommerce`名前空間内にあるため、接頭辞は必要ありません）。
- クラス名は`CamelCase`の規則で命名されます（ただし、メソッド名は`underscore_separated`でなければなりません）。
- クラス・ファイルはクラス名と一致させ、`class-`の接頭辞は不要です（例えば、`StringUtil`クラスのファイル名は`StringUtil.php`です）。

WooCommerceコアは[WordPress JS命名規則](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/#naming-conventions)に従います。PHP と同様、関数名、クラス名、フック名にはプレフィックスを付ける必要がありますが、JS の規約は若干異なり、snake_case の代わりに camelCase が使用されます。関数のプレフィックスは`wc`、クラスのプレフィックスは`WC`、フックのプレフィックスは`woocommerce`です。

関数名の例：

- `wcSettings()`。

クラス名の例：

- `WCOrdersTable`。

フック名の例（アクションまたはフィルター）：

- `woocommerceTracksEventProperties`。

## CSS と SASS

[CSS SASSコーディングガイドラインと命名規則](/docs/contribution/contributing/CSS-SASS-coding-guidelines-and-naming-conventions/) を参照してください。
