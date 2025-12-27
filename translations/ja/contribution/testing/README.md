---
sidebar_label: Testing
category_slug: testing
post_title: Testing
---
# Testing

WooCommerceコアにコントリビュートする際に、テスト環境を適切にセットアップし、テストを書くことは、私たちの開発パイプラインの重要な部分です。以下のリンクは GitHub の [Contributing Guidelines](https://github.com/woocommerce/woocommerce/blob/trunk/.github/CONTRIBUTING.md) にも含まれています。

テストについて質問がある場合は、開発者コミュニティーの公開チャンネル（[開発者ブログ](https://developer.woocommerce.com/blog/)、[GitHub ディスカッション](https://github.com/woocommerce/woocommerce/discussions)、[コミュニティーSlack](https://woocommerce.com/community-slack/)）までご連絡ください。

## ユニットテスト

[エンドツーエンドのテスト](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/e2e-pw)は`Playwright`で実行されます。テストサイトは`wp-env`（[推奨](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/)）を使用して起動されます。 

## APIテスト

[APIテスト](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/e2e-pw/tests/api-tests)は`Playwright`と`wp-env`に基づいています。

## テスト募集

開発者向けブログでテストの募集状況を確認し、ベータテストに関する説明を必ずお読みください。
