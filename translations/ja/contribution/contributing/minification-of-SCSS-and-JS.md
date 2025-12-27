---
post_title: Handling SCSS and JS minification in WooCommerce
sidebar_label: Minification of SCSS and JS
---
# WooCommerceにおけるSCSSとJSの最小化処理

## SCSS

WooCommerceプロジェクトでSCSSファイルを更新する場合、**最小化されていないSCSSファイル**にのみ変更をコミットしてください。最小化はリリースプロセスの一部として処理されます。

ミニファイされたCSSファイルを取得するには、リポジトリのルートディレクトリから`pnpm --filter='@woocommerce/classic-assets' build`を実行してください。ゼロから開発環境をセットアップするには、WooCommerce開発環境のセットアップガイドの[依存関係のインストールとアセットの生成方法](https://github.com/woocommerce/woocommerce/wiki/How-to-set-up-WooCommerce-development-environment#install-dependencies-and-generate-assets)のセクションを参照してください。

## ジャバスクリプト

JSファイルを変更する際は、**最小化されていないファイル**（つまり、読み取り可能なJSファイル）のみをコミットしてください。最小化はリリースプロセスの一部として処理されます。

変更を確実にテストするために、`SCRIPT_DEBUG`をオンにして実行してください。
