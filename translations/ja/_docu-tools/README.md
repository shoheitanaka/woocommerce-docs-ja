# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run start
```

このコマンドはローカル開発サーバーを起動し、ブラウザウィンドウを開きます。ほとんどの変更はサーバーを再起動することなくライブで反映されます。

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The contents in the `woocommerce/docs` folder are pulled via a GitHub Actions cron job defined in the [deploy-docs workflow](https://github.com/woocommerce/woo-docs-build/blob/trunk/.github/workflows/deploy-docs.yml). 

They are then built for production and a PR is created against the [woocommerce-woo-docs-multi-com repository](https://github.com/wpcomvip/woocommerce-woo-docs-multi-com) in that same GitHub Action.

