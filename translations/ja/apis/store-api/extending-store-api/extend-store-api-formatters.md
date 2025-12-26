# 利用可能なフォーマッタ 

`Formatters`はユーティリティクラスで、StoreAPIと互換性のあるように値をフォーマットすることができます。デフォルトのフォーマッタは、金額や通貨情報、HTML などの値を扱います。

StoreAPIを拡張する際には、これらのフォーマッタを使用することを推奨する。

## なぜフォーマッタは有用なのか？

特定の種類のデータを返す際にフォーマッタユーティリティを使用すると、カスタムデータの一貫性と他のエンドポイントとの互換性が保証されます。また、通貨の設定など、データのフォーマットに影響を与える可能性のあるストア固有の設定も行います。

ストアAPIには、以下のフォーマッタが含まれる：

-   [マネー](#moneyformatter)
-   [通貨](#currencyformatter)
-   [HTML](#htmlformatter)

## フォーマッタの使い方

フォーマッターを取得するには、`ExtendSchema` クラスの `get_formatter` メソッドを使います。このメソッドには、使用したいフォーマッタの名前を文字列で指定します。

```php
get_formatter('money'); // For the MoneyFormatter
get_formatter('html'); // For the HtmlFormatter
get_formatter('currency'); // CurrencyFormatter
```

これは`format`メソッドを持つ`FormatterInterface`を返す。`format`メソッドのシグネチャは以下の通りである：

```php
format( $value, array $options = [] );
```

`MoneyFormatter`の動作のみ、`$options`パラメータで制御できる。このパラメータはオプションである。

### 実例

例えば、API経由で価格データを返すとしよう。セント単位の価格と、その店の通貨データを返したい。これを行うには、`MoneyFormatter`と`CurrencyFormatter`を使用します。

まず、フォーマッタ・クラスにアクセスできるようにする必要があります。これには `use` キーワードを使用します：

```php
use Automattic\WooCommerce\StoreApi\StoreApi;
use Automattic\WooCommerce\StoreApi\Utilities\ExtendSchema;

$extend = StoreApi::container()->get( ExtendSchema::class );

$my_custom_price = $extend->get_formatter( 'money' )->format( '10.00', [
  'rounding_mode' => PHP_ROUND_HALF_DOWN,
  'decimals'      => 2
] );

$price_response = $extend->get_formatter( 'currency' )->format( [
	'price'         => $my_custom_price,
] );
```

上記のコードでは、`$price_response`が設定される：

```text
[
    'price' => '1000'
    'currency_code' => 'GBP'
    'currency_symbol' => '£'
    'currency_minor_unit' => 2
    'currency_decimal_separator' => '.'
    'currency_thousand_separator' => ','
    'currency_prefix' => '£'
    'currency_suffix' => ''
]
```

## マネーフォーマット

[INLINE_CODE_0__](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/trunk/src/StoreApi/Formatters/MoneyFormatter.php) クラスを使用すると、 店の設定を使用して金額をフォーマットすることができます。店舗設定は、このフォーマッタの `format` メソッドにオプションを渡すことで上書きすることができます。

このフォーマッタを使用する場合は、 [`CurrencyFormatter`](#currencyformatter) も一緒に使用することになるでしょう。こうすることで、API のコンシューマが意図した形式で値を表示できるようになります。

### 引数

| 引数 | タイプ | 説明 |
| --------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$value` | `number` | 金額にフォーマットしたい数値
| `$options` `array` `decimals` `integer`, __INLINE_CODE_5__ の2つのキーを含む。
| `$options['decimals']`      | `number` | Used to control how many decimal places should be displayed in the monetary value.デフォルトはストア設定です。                                                                                                                |
|`$options['rounding_mode']` | `number` | 金額を丸める方法を指定します。これは、[PHP [round() documentation](https://www.php.net/manual/en/function.round.php) で説明されている PHP の丸めモードのいずれかでなければなりません。デフォルトは `PHP_ROUND_HALF_UP` です。|

### 使用例と戻り値

```php
get_formatter( 'money' )->format( 10.443, [
  'rounding_mode' => PHP_ROUND_HALF_DOWN,
  'decimals'      => 2
] );
```

は `1044` を返す。

## CurrencyFormatter

このフォーマッタは価格の配列を受け取り、同じ配列に通貨データを追加して返します。追加される通貨データは

| キー | タイプ | 説明 |
| ----------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
|`currency_code` | `string` | 通貨の文字列表現。
| `currency_symbol` | `string` | 通貨記号。
|`currency_minor_unit` |`number` | 通貨の小数点以下の桁数。
|`currency_decimal_separator` |`string`｜ 通貨の整数値と小数値を区切る文字列。                |
| 例えば、&pound;10,000 や &euro;10.000 のような場合です。
| `currency_prefix` | `string` | 通貨の値の前に表示される文字列。                                            |
| `currency_suffix` | `string` | 通貨値の後に表示される文字列。                                             |

このデータをクライアント/消費者が使用することで、店舗の設定に従って価格を正しくフォーマットすることができます。重要: このフォーマットに渡される価格の配列は、すでに金額形式になっている必要があります。

### 引数

| 引数
| -------- | ---------- | ---------------------------------------------------------------------------- |
| `$value` | `number[]`｜ ストアの通貨設定とマージしたい価格の配列です。

### 使用例と戻り値

```php
get_formatter( 'currency' )->format( [
  'price'         => 1800,
  'regular_price' => 1800,
  'sale_price'    => 1800,
] );
```

returns

```text
'price' => '1800'
'regular_price' => '1800'
'sale_price' => '1800'
'price_range' => null
'currency_code' => 'GBP'
'currency_symbol' => '£'
'currency_minor_unit' => 2
'currency_decimal_separator' => '.'
'currency_thousand_separator' => ','
'currency_prefix' => '£'
'currency_suffix' => ''
```

## HtmlFormatter

このフォーマッタはHTML値を受け取り、次のように実行します: [`wptexturize`](https://developer.wordpress.org/reference/functions/wptexturize/)、
[`convert_chars`](https://developer.wordpress.org/reference/functions/convert_chars/),
[`trim`](https://www.php.net/manual/en/function.trim.php), and [`wp_kses_post`](https://developer.wordpress.org/reference/functions/wp_kses_post/)
を返します。このフォーマッターの目的は、HTMLを（正しくフォーマットされた文字という意味で）「安全」にすることです。
`wp_kses_post`は、`post`のコンテキストで許可されているHTMLタグのみが文字列内に存在することを保証します。

### 引数

| 引数
| -------- | -------- | ----------------------------------------------- |
| `$value` | `string` | "安全な "HTMLにフォーマットしたい文字列。|

### 使用例と戻り値

```php
get_formatter( 'html' )->format(
  "<script>alert('bad script!')</script> This \"coffee\" is <strong>very strong</strong>."
);
```

returns:

```text
alert('bad script!') This &#8220;coffee&#8221; is <strong>very strong</strong>.
```

このフォーマッタは、StoreAPI から HTML を返す際に使用します。そうすることで、コンシューマ/クライアントがエンコーディングの問題なしに安全に HTML を表示できるようになります。

