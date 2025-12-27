---
post_title: Naming conventions
sidebar_label: Naming conventions
---
# 命名規則

## PHP

WooCommerceコアは一般的に[WordPress PHP命名規則](https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/#naming-conventions)に従います。 

コードの場所によって、適用される追加の規約がいくつかある。

### `/src`。

`/src`内で定義されたクラスは[PSR-4](https://www.php-fig.org/psr/psr-4/)標準に従います。詳細は[`/src`のREADME](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/README.md)を参照してください。

このディレクトリには以下の規則が適用される：

- この場所にあるすべてのクラスは `Automattic\WooCommerce` 名前空間の中にあるので、クラス名のプレフィックスは必要ありません。
- クラス名は `CamelCase` の規則で命名されます。
- 関数は`snake_case`という規則で命名されます。
- クラス・ファイル名はクラス名と一致していなければなりません。`class-`接頭辞は必要ありません。
- 名前空間はディレクトリ構造と一致しなければなりません。
- フックのプレフィックスは `woocommerce_` です。
- フックの名前は `snake_case` の規則で付けます。

例えば、`src/Util/StringUtil.php`で定義されたクラスは`StringUtil`という名前で、`Automattic\WooCommerce\Util`名前空間にあるべきです。  

### `/includes`。

`/includes`ディレクトリには、PSR-4標準に従わないレガシーコードが含まれています。詳細は[`/includes`のREADME](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/README.md)を参照してください。

このディレクトリには以下の規則が適用される：

- クラス名の先頭には `WC_` が付きます。
- クラス名は `Upper_Snake_Case` の規則で命名されます。
- 関数の名前は `wc_` で始まります。
- 関数は `snake_case` で命名します。
- フックのプレフィックスは `woocommerce_` です。
- フックの名前は `snake_case` である。

クラス名の例：

- `WC_Cache_Helper`
- `WC_Cart`。

関数名の例：

- `wc_get_product()`
- `wc_is_active_theme()`。

フック名の例（アクションまたはフィルター）：

- `woocommerce_after_checkout_validation`
- `woocommerce_get_formatted_order_total`。

## JS

WooCommerceコアは[WordPress JS命名規則](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/#naming-conventions)に従っています。

PHPと同じように、関数名、クラス名、フック名には接頭辞を付けるべきだが、JSの規約は少し異なる。

- グローバル・クラス名のプレフィックスは `WC` です。モジュールからエクスポートされたクラス名には接頭辞は付きません。
- クラス名は `UpperCamelCase` の規則で命名されます。
- グローバル関数名のプレフィックスは `wc` です。モジュールからエクスポートされた関数名には接頭辞は付きません。
- 関数の名前は `camelCase` を使用します。
- フック名は `woocommerce` でプレフィックスされます。
- フック名は `camelCase` の規則で命名されます。

グローバルクラス名の例：

- `WCOrdersTable`。

グローバル関数名の例：

- `wcSettings()`。

フック名の例（アクションまたはフィルター）：

- `woocommerceTracksEventProperties`。

## CSS と SASS

[CSS/Sass命名規則](./css-sass-naming-conventions.md)を参照してください。
