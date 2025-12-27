# エクステンションのビルドを始める

このセクションでは、WooCommerceエクステンションを構築、テスト、配布するためのガイドとリソースを提供します。

## ♪ はじめに

- [シンプルな拡張機能の設計](/extensions/getting-started-extensions/how-to-design-a-simple-extension) - 拡張機能のアーキテクチャとベストプラクティスを学びます。
- [最初の拡張機能を作成する](/extensions/getting-started-extensions/building-your-first-extension) - 最初のWooCommerce拡張機能を作成する。
- [コアコンセプト](/extensions/core-concepts/) - プラグインヘッダー、ライフサイクル管理、セキュリティのような基本的なコンセプトを習得します。

## WooCommerceマーケットプレイスに投稿する

WooCommerceマーケットプレイスに参加して、あなたのエクステンションを世界中の360万以上のアクティブなストアに紹介しましょう。

[エクステンション開発者がWooCommerceマーケットプレイスを選ぶ理由](https://woocommerce.com/partners/)と[エクステンションを投稿する](https://woocommerce.com/document/submitting-your-product-to-the-woo-marketplace/)について詳しくご覧ください。

### クオリティ・インサイト・ツールキット（QIT）

#### WooCommerce.comのベンダープロフィールを持つすべての開発者が利用可能です。

QIT（Quality Insights Toolkit）は、WooCommerceがプラグインとテーマのために開発したテストプラットフォームです。開発者は、様々なマネージドテストをすぐに実行できるだけでなく、独自のカスタムE2Eテストを統合して、エクステンションの信頼性、安全性、互換性を確保することができます。

#### 主な特徴

- **Managed test suites:** 事前に設定されたエンドツーエンドテスト、アクティベーションテスト、セキュリティスキャン、PHPStan分析、APIテストなどを実行します。
- **カスタムE2Eテスト:** PlaywrightベースのE2EテストをQITで直接作成し、実行できます。
- **継続的な品質チェック：** CLIやGitHub Actionsなどを介して、QITを開発ワークフローにシームレスに統合できます。
- **マーケットプレイスとの統合:** 現在、WooCommerce Marketplaceに掲載されているエクステンション向けにクローズドベータを実施中です。

[QITの詳細](https://qit.woo.com/docs/)

## 開発ツール

- [エクステンションの足場](/getting-started/scaffolding/#extension-scaffolds) - [create-woo-extension](https://www.npmjs.com/package/@woocommerce/create-woo-extension)パッケージを使って新しいエクステンションを足場にする方法を学びましょう。
- [WooCommerce CLI](/wc-cli/cli-overview) - WooCommerce開発のためのコマンドラインツール。
