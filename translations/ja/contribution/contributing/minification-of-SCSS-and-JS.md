---
post_title: Handling SCSS and JS minification in WooCommerce
sidebar_label: Minification of SCSS and JS
---

# Handling SCSS and JS minification in WooCommerce

## SCSS

WooCommerceプロジェクトでSCSSファイルを更新する場合、**最小化されていないSCSSファイル**にのみ変更をコミットしてください。最小化はリリースプロセスの一部として処理されます。

To get the minified CSS files, run `pnpm --filter='@woocommerce/classic-assets' build` from the repository root directory. To set up the development environment from scratch, see the section on [how to install dependencies and generate assets](https://github.com/woocommerce/woocommerce/wiki/How-to-set-up-WooCommerce-development-environment#install-dependencies-and-generate-assets) in the guide to set up a WooCommerce development environment.

## Javascript

JSファイルを変更する際は、**最小化されていないファイル**（つまり、読み取り可能なJSファイル）のみをコミットしてください。最小化はリリースプロセスの一部として処理されます。

To ensure you can test your changes, run with `SCRIPT_DEBUG` turned on, i.e. add `define( 'SCRIPT_DEBUG', true );` to your wp-config.php file.
