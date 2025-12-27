このウェブサイトは、最新の静的ウェブサイト・ジェネレーターである[Docusaurus](https://docusaurus.io/)を使用して構築されています。

## インスタレーション

```bash
npm install
```

## 地方開発

```bash
npm run start
```

このコマンドはローカル開発サーバーを起動し、ブラウザウィンドウを開きます。ほとんどの変更はサーバーを再起動することなくライブで反映されます。

```bash
npm run build
```

このコマンドは、`build`ディレクトリに静的コンテンツを生成し、任意の静的コンテンツ・ホスティング・サービスを使って提供することができる。

## 配備

`woocommerce/docs`フォルダ内のコンテンツは、[deploy-docsワークフロー](https://github.com/woocommerce/woo-docs-build/blob/trunk/.github/workflows/deploy-docs.yml)で定義されたGitHub Actionsのcronジョブを介してプルされます。 

その後、本番用にビルドされ、同じ GitHub アクションの [woocommerce-woo-docs-multi-com リポジトリ](https://github.com/wpcomvip/woocommerce-woo-docs-multi-com) に対して PR が作成されます。

