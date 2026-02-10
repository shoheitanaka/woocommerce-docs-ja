# エクステンションのビルドを始める

このセクションでは、WooCommerceエクステンションを構築、テスト、配布するためのガイドとリソースを提供します。

## 重要：内部コードと公開コード

[すべてのWooCommerceコードがエクステンションでの使用を意図しているわけではありません。`Automattic\WooCommerce\Internal`名前空間のクラスと`@internal`でマークされたコードはWooCommerceコア専用です: WooCommerceリリース間の後方互換性は保証されず、これらを使用すると拡張機能が壊れる可能性があります。拡張機能開発のベストプラクティス](../best-practices-extensions/extension-development-best-practices.md)と[内部名前空間ドキュメント](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/README.md)を参照してください。

## ♪ はじめに

- [シンプルな拡張機能の設計](/extensions/getting-started-extensions/how-to-design-a-simple-extension) - 拡張機能のアーキテクチャとベストプラクティスを学びます。
- [最初の拡張機能を作成する](/extensions/getting-started-extensions/building-your-first-extension) - 最初のWooCommerce拡張機能を作成する。
- [コアコンセプト](/extensions/core-concepts/) - プラグインヘッダー、ライフサイクル管理、セキュリティのような基本的なコンセプトを習得します。

## WooCommerceマーケットプレイスに投稿する

WooCommerceマーケットプレイスに参加して、あなたのエクステンションを世界中の360万以上のアクティブなストアに公開しましょう。

[エクステンション開発者がWooCommerceマーケットプレイスを選ぶ理由](https://woocommerce.com/partners/)と[エクステンションを投稿する](https://woocommerce.com/document/submitting-your-product-to-the-woo-marketplace/)の詳細についてはこちらをご覧ください。

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
