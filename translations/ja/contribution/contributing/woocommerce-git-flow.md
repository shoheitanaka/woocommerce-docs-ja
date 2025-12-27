---
post_title: WooCommerce Git Flow
sidebar_label: WooCommerce Git Flow
---
# WooCommerce Gitの流れ

## 慣例

### ブランチ・ネーミング

リリースブランチ (これは常に `release/` で始まります) を除いては、命名規則を強制することはありませんが、接頭辞はブランチの種類や変更を示すのに役立ちます。一般的なプレフィックスには、`fix/`、`feature/`、`add/`、`update/`があります。

特に**修正ブランチ**を作成する場合は、正しい接頭辞と問題番号（例: `fix/12345`）を使用するか、変更内容を要約してください（例: `fix/12345-shipping-tax-rate-saving`）。

## リリース

コア開発では、以下のような構成とフローを採用している。

![リリース・サイクル・フローチャート](/img/doc_images/release-branches.png)

詳細については、[リリーススケジュール](/docs/contribution/releases/schedule)ドキュメントを参照してください。
