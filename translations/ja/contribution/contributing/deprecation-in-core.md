---
post_title: Deprecation in core
sidebar_label: Deprecation in core
---

# Deprecation in core

非推奨（Deprecation）とは、後方互換性を破壊したり、その使用を完全に禁止したりすることなく、ある機能や慣習の使用を控え、他のものを優先させる方法である。非推奨に関するウィキペディアの記事を引用する：

&gt; 非推奨のソフトウェア機能がソフトウェアに残っている間、その機能を使用すると、代替方法を推奨する警告メッセージが表示されることがあります。非推奨のステータスは、その機能が将来削除されることを示すこともあります。非推奨ステータスは、その機能が将来削除されることを示す場合もある。機能は、直ちに削除されるのではなく、後方互換性を提供し、プログラマに影響を受けるコードを新しい標準に準拠させる時間を与えるために、非推奨となる。

関数、メソッド、機能が非推奨になる理由はさまざまです。いくつか挙げてみよう：

- もう使わない関数を削除したいかもしれない。
- ある関数の動作を変更または改善することに決めたが、後方互換性を壊すため、代わりに古い関数を非推奨にする必要があるかもしれない。
- 命名規則を標準化したいかもしれない。
- 同じコードを別の場所で再利用するのを避けるために、似たような関数をマージする機会を見つけるかもしれない。

非推奨告知は理想的でも魅力的でもないが、単なる警告であり、エラーではない。 

非推奨の警告は、あなたのストアが壊れているという意味ではありません。

## How do we deprecate functions?

WooCommerceで何かを非推奨にする場合、開発者に明確にし、後方互換性を維持するためにいくつかのアクションを取ります。

1. We add a docblock to the function or method showing what version the function was deprecated in, e.g., `@deprecated 2.x.x`.
2. We add a warning notice using our own `wc_deprecated_function` function that shows what version, what function, and what replacement is available. More on that in a bit.
3. We remove usage of the deprecated function throughout the codebase.

関数やメソッド自体はコードベースから削除されない。これにより、削除されるまで（通常は1年以上先か、数回先のメジャーリリースまで）後方互換性が保たれます。

We mentioned `wc_deprecated_function` above - this is our own wrapper for the `_deprecated_function` WordPress function. It works very similar except for that it forces a log entry instead of displaying it - regardless of the value of `WP_DEBUG` during AJAX events - so that AJAX requests are not broken by the notice.

## What happens when a deprecated function is called?

拡張機能やテーマが非推奨の関数を使用している場合、次の例のような警告が表示されることがあります：

```bash
Notice: woocommerce_show_messages is deprecated since version 2.1! Use wc_print_notices instead. in /srv/www/wordpress-default/wp-includes/functions.php on line 3783
```

これは、いつから、どこで、何が非推奨となり、どのような代替手段があるのかを教えてくれる。

Notices and warnings are usually shown inline, but there are some plugins you can use to collect and show them nicely in the footer of your site. Consider, for example, [Query Monitor](https://wordpress.org/plugins/query-monitor/).

### Warnings in production (store owners - read this!)

PHPの通知や警告(あるいはその他のエラー)を本番のストアに表示することは非常に推奨されません。これらは、悪意のあるユーザがあなたのストアにアクセスするために悪用する可能性のある、あなたのセットアップに関する情報を明らかにする可能性があります。これらは公開されないようにし、オプションでログに記録するようにしてください。

In WordPress you can do this by adding or modifying some constants in `wp-config.php`:

```php
define( 'WP_DEBUG', false );
```

On some hosts, errors may still be visible due to the hosts configuration. To force them to not display you might need to add this to `wp-config.php` as well:

```php
@ini_set( 'display_errors', 0 );
```

通知を表示する代わりにログに記録するには、次のようにする：

```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
```

The default location of the WordPress error log is `wp-content/debug.log`.

Note that this log can be publicly accessible, which could also pose a security risk. To keep it private, you can use a plugin or define a custom path in `wp-config.php`.

```php
<?php
/**
 * Plugin Name: Custom Debug Log Path
 */

ini_set( 'error_log', '/path/to/site/logs/debug.log' );
```
