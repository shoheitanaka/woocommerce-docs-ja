---
post_title: How to add actions and filters
sidebar_label: Actions and filters
sidebar_position: 2
---

# How to add actions and filters

多くのWordPressプラグインがそうであるように、WooCommerceは、開発者がプラットフォームを拡張し、変更することができるアクションとフィルタの範囲を提供します。

新しいコードを書いたり、既存のコードを修正したりするときに、新しいフックを追加したいと思うことがよくあります。このドキュメントは、この問題に関するハイレベルなガイダンスを提供することを目的としています。

私たちが一般的に許可し、支援し、奨励している練習は以下の通り：

* [新しいフックを追加するよりも、既存のフック(あるいは他の選択肢)を優先して使う](#prefer-existing-hooks-or-other-alternatives)
* [ライフサイクルフックを追加する](#adding-lifecycle-hooks)
* [オプションのエスケープフック](#escape-hooks)
* [グローバルレンダリング関数の入出力を変更する](#modifying-function-input-and-output-global-rendering-functions)
* [IDよりもオブジェクトの受け渡しを優先する](#prefer-passing-objects-over-ids)

反面、私たちが推奨しない行為もいくつかある：

* [ライフサイクルフックを実行メソッドに結びつける](#tying-lifecycle-hooks-to-methods-of-execution)
* [フィルタを機能フラグとして使う](#using-filters-as-feature-flags)
* [フィルターフックをテンプレートやデータストアに配置する](#placement-of-filter-hooks)
* [フック名の中に列挙値を入れる](#enumeration-values-inside-hook-names)

これらの項目以外では、一般的にWordPressのコーディング標準を遵守しています。フックに関しては、具体的には

* [フックの文書化基準](https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/php/#4-hooks-actions-and-filters)
* [動的フック名に関するガイダンス](https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/#interpolation-for-naming-dynamic-hooks)

このガイドでは、原則のいくつかを説明するのに役立つよう、コードの例を示していることに注意してください。しかし、物事を簡潔に保つために、通常、docブロックを含む不必要な詳細は省略しています（しかし、実際には、フックは常にdocブロックを伴うべきです！）。

## 既存のフック（または他の選択肢）を優先する

フックには長期的な義務が伴います。開発者が依存するようになる新しいフックを追加して、それをまた取り除くというのは一番避けたいことです。しかしこれは、フックを含むコード部分をリファクタリングする時が来た時に困難につながる可能性があり、意味のある変更を遅らせたり、後方互換性の約束を損なうことなく変更を簡単に実装する方法を制限したりすることがある。

このような理由から、私たちは常に、合理的である限りにおいて、新しいフックを追加するよりも、既存のフックや代替アプローチを優先する。

## ライフサイクルフックの追加

ライフサイクルフックは、ライフサイクルイベントが開始されようとしていること、または終了したことを伝えるために使用することができる。そのようなイベントの例としては

* 主な製品ループ
* メールの送信
* テンプレートのレンダリング
* 商品または注文ステータスの変更

一般的には、ライフサイクルフック：

* 対になっている（「前」と「後」）。
* 常にアクションであり、決してフィルタではない
* before'フックは通常、引数の配列があればそれをコールバックします。
* after'フックは通常、関数の返り値があればそれをコールバックします。

ライフサイクルフックは、結果を変更するためではなく、他のシステムに観察させるために存在することに注意してほしい。もちろん、関数の作者がこの機能を果たすフィルターフックを追加で提供することを止めるわけではない。

例えば、私たちが "ライフサイクル・イベント "として見ているのは、プロモーションをフェッチするプロセスであって、ファンクションそのものではないことに注目してほしい：

```php
function woocommerce_get_current_promotions( ...$args ) {
    /* Any initial prep, then first lifecycle hook... */
    do_action( 'woocommerce_before_get_current_promotions', $args );
    /* ...Do actual work, then final lifecycle hook... */
    do_action( 'woocommerce_after_get_current_promotions', $result, $args );
    /* ...Return the result, optionally via a filter... */
    return apply_filters( 'woocommerce_get_current_promotions', $result, $args );
}
```

## エスケープフック

場合によっては、関数やメソッドのショートカットをサポートすることが適切なこともある。これはエスケープフックと呼ばれるもので、より良い方法がない場合にコードをオーバーライドする手段として有用である。

* エスケープフックは常にフィルターである
* フィルタリング可能な初期値として常にNULLを与えるべきである。
* 値がnullでない値に変更された場合、関数はその新しい値を返すことで早期に終了する必要があります。

型安全のため、関数が短絡された場合、戻り値の型が関数シグネチャや関数ドキュメントブロックに記述された戻り値の型と一致するように注意する必要がある。

```php
function get_product_metrics( $args ): array {
    $pre = apply_filters( 'pre_woocommerce_get_product_metrics', null, $args );

    if ( $pre !== null ) {
        return (array) $pre;
    }

    /* ...Default logic... */
    return $metrics;
}
```

## 関数の入出力の変更（グローバルレンダリング関数）

グローバルレンダリングやフォーマット関数（いわゆる "テンプレートタグ"）の場合、より良い代替手段を実装することが容易でない場合、関数の引数と戻り値の両方にフィルタを追加することが許されます。

これは控えめに、必要な場合にのみ行うべきである。他のコンポーネントが大規模なカスタマイズを行う機会を提供する一方で、変更されていない出力を期待する他のコンポーネントを頓挫させる可能性があることを覚えておいてほしい。

```php
function woocommerce_format_sale_price( ...$args ): string {
    /* Prep to fill in any missing $args values... */
    $args = (array) apply_filters( 'woocommerce_format_sale_price_args', $args );
    /* ...Actual work to determine the $price string... */
    return (string) apply_filters( 'woocommerce_format_sale_price', $price, $args );
}
```

## IDよりもオブジェクトの受け渡しを優先

アクションやフィルターによっては、オブジェクトID（商品IDなど）を主な値として渡すものもあれば、実際のオブジェクトそのもの（商品オブジェクトなど）を渡すものもあります。一貫性を保つためには、オブジェクトを渡すことが望ましいです。

```php
function get_featured_product_for_current_customer( ) {
    /* ...Logic to find the featured product for this customer... */

    return apply_filters( 
        'woocommerce_featured_product_for_current_customer', 
        $product, /* WC_Product */
        $customer 
    );
}
```

## ライフサイクルフックを実行方法に結びつける

時には、同じアクションにつながる複数のパスが存在することがあります。例えば、注文はREST API、管理環境、またはフロントエンドで更新されます。さらに、ajax経由や通常のリクエストで更新されることもあります。

しかし、高レベルの処理のフックを特定の実行パスに結びつけないことが重要です。たとえば、注文が作成されたときに実行されるアクションは、ajaxリクエストによって管理環境で発生したときだけ実行されるのであってはなりません。

その代わりに、実行メソッドに関するコンテキストをコールバックに渡す、より汎用的なフックを好む。

避けたいことの例：

```php
/**
 * Pretend this function is only called following an ajax request
 * (perhaps it is itself hooked in using a `wp_ajax_*` action).
 */
function on_ajax_order_creation() {
    /* Avoid this! */
    do_action( 'woocommerce_on_order_creation' );
}
```

## フィルタを機能フラグとして使う

フィルタを、機能の一部を有効にしたり無効にしたりする、一種の機能フラグとして使いたくなることがある。これは避けるべきです！オプションを使うことをお勧めします：

* オプションはデータベースに保存されます。
* オプションはすでにフィルタリング可能です（一時的なオーバーライドに最適です）。

避けたいことの例：

```php
/* Avoid this */
$super_products_enabled = (bool) apply_filters( 'woocommerce_super_products_are_enabled', true );

/* Prefer this */
$super_products_enabled = get_option( 'woocommerce_super_products_are_enabled', 'no' ) === 'yes';
```

## フィルターフックの配置

フィルターはテンプレートだけのアクションの中に置くべきではありません。テンプレート内で使用される値がフィルター可能であることが重要である場合、関連するロジックはテンプレートをロードすることを決定する関数またはメソッドに移動されるべきです。

また、フィルター・フックをデータストア・クラスの内部に配置しないことが好ましい。これは、それらのコンポーネントの完全性を低下させる可能性があるからだ。

## フック名の中の列挙値

動的なフック名（フック名の一部が変数を使って作成される）の場合もあるが、経験則では、変数に列挙値と考えられるものが含まれている場合は、これを避けるのがよい。

例えば、エラーコードがフック名の一部になっているような場合である。

例（避けたいこと）：

```php
if ( is_wp_error( $result ) ) {
    /* Avoid this */
    $error_code = $result->get_error_code();
    do_action( "woocommerce_foo_bar_{$error_code}_problem", $intermediate_result );
    
    /* Prefer this */
    do_action( 'woocommerce_foo_bar_problem', $result );
}
```

これを避ける第一の理由は、列挙セットの値が多ければ多いほど、開発者がコードに含めなければならないフィルターが増えるからだ。

この文書は、フックのインクルージョンと配置に関するハイレベルなガイドであり、網羅的なリストではありません。時には例外もあるでしょうし、私たちが見落としている良いルールや方法論があるかもしれません。改善のための提案やアイデアがあれば、ぜひ声をかけてください！
