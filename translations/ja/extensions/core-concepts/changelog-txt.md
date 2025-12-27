---
post_title: Formatting for Changelog.txt
sidebar_label: Changelog.txt
---
# Changelog.txtのフォーマット

## changelog.txt ファイル

WooCommerceエクステンションは標準の変更ログフォーマットを使用します。WooCommerceマーケットプレイスのエクステンションにはchangelog.txtファイルが必要です。

あなたの`changelog.txt`ファイルは次のようになるはずだ：

```php
*** WooCommerce Extension Name Changelog ***

YYYY-MM-DD - version 1.1.0
* Added - Useful new feature
    * A second new feature
    * A third new feature
* Fixed - Important bug fix
* Update - Compatibility with latest version

YYYY-MM-DD - version 1.0.1
* Fixed a bug

YYYY-MM-DD - version 1.0.0
* Initial release
```

## Changelog エントリーの種類

製品の更新で行われるさまざまな種類の作業を紹介するには、次のいずれかの単語を使って、それぞれの行がどのような変更であるかを示す：

- 追加
- 追加
- 機能
- 新しい
- 開発者
- 開発
- 微調整
- 変更
- 更新
- 削除
- 削除
- 固定
- 修正

## チャンネルネスト

特定のエントリータイプの下でインデントされたアイテムは、シングルレベルリストの中で同じタイプの追加変更を入れ子にすることができます。 

## changelog.txtの例

これは WooCommerce.com のモーダルで解析された変更ログが表示される方法で、各エントリーのタイプはアイコンに置き換えられています。タイプを持たない変更履歴エントリは [その他] アイコンで表示され、ネストされたエントリはアイコンを持ちません。 

![WooCommerce.comに掲載されている変更履歴の例](https://woocommerce.com/wp-content/uploads/2025/11/changelog-formatting.png)
