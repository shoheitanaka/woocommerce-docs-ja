---
post_title: How to build your first extension
sidebar_label: Build your first extension
sidebar_position: 2
---

# How to build your first extension

このガイドでは、[create-woo-extension](https://www.npmjs.com/package/@woocommerce/create-woo-extension)を使用してWooCommerce拡張機能の足場を作る方法を説明します。create-woo-extensionを使用することで、手動で一から作成するよりも以下のような様々な利点があります：

書くべき定型的なコードは少なくなり、手動でセットアップする依存関係も少なくなる。

ブロックのような最新の機能は自動的にサポートされ、ユニットテスト、リンティング、Prettier IDEの設定もすぐに使える。

拡張機能をセットアップしたら、[wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/)を使って開発環境を即座に立ち上げる方法を紹介します。

## 必要条件

作業を始める前に、お使いのデバイスに以下のツールがインストールされている必要があります：

- [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) with NPM
- [Docker](https://docs.docker.com/engine/install/)(wp-envを使うには起動している必要があります)
- [Composer](https://getcomposer.org/doc/00-intro.md)

また、このガイドは、あなたがコマンドラインの操作に慣れていることを前提としている。

## 拡張機能のブートストラップ

ターミナルを開き

```sh
 npx @wordpress/create-block -t @woocommerce/create-woo-extension my-extension-name
```

カスタム拡張名を設定したい場合は、`my-extension-name`を任意のスラッグに置き換えることができます。スラッグにはスペースを入れてはいけません。

`Need to install the following packages`のようなプロンプトが表示されたら、`@wordpress/create-block@4.34.0. Ok to proceed?`を押します：__INLINE_CODE_1__のようなプロンプトが表示されたら、`Y`を押す。

パッケージが拡張機能を生成し終わったら、拡張機能フォルダに移動します。 

```sh
 cd my-extension-name
```

その後、`npm install`を使用して拡張機能の依存関係をインストールし、`npm run build`を使用してビルドする必要があります。

おめでとうございます！WooCommerceエクステンションが完成しました！あなたのエクステンションは以下のファイル構造を持っています：

- `my-extension-name`
    - `block.json` - カスタムブロックをWordPressに登録するためのメタデータが含まれます。詳細はこちら。
    - `build` - npm run buildで生成される拡張機能のビルドバージョン。このフォルダ内のファイルを直接修正してはいけません。
    - `composer.json` - Composer が参照する PHP の依存関係のリストです。
    - `composer.lock` - このファイルで、依存関係を更新するタイミングと方法を制御できます。
    - `includes` - PHP 開発における「includes」フォルダの主な目的は、 再利用可能なコードや、プロジェクトの複数の部分でインクルードまたは必須となる ファイルを保存することです。これはPHP開発者の慣習です。
    - `languages` - プラグインのローカライズに使用する POT ファイルを格納します。
    - `my-extension-name.php` - プラグインのエントリーポイントで、プラグインをWordPressに登録します。
    - `node-modules` - アプリケーションの構成要素を作成し、より構造化されたコードを書くのに役立ちます。
    - `package.json` - Nodeプロジェクトの中核と見なされます。メタデータを記録し、機能依存関係をインストールし、スクリプトを実行し、アプリケーションのエントリー・ポイントを定義します。
    - `README.md` - アプリケーションの紹介と説明の概要です。特別な指示、作者からの更新、アプリケーションの詳細は、ここにテキストで書くことができます。
    - `src` - ルートディレクトリをクリーンに保ち、ソースコードとその他の資産を明確に分離します。
    - `tests` - アプリケーションのユニットテストを保持し、ソースファイルから分離します。
    - `vendor` - プロジェクトの依存関係や、あなたが書いていないサードパーティのコードを保持します。
    - `webpack.config.js` - webpackはモジュールバンドラーです。主な目的は、ブラウザで使用するためにJavaScriptファイルをバンドルすることです。

## 開発環境のセットアップ

[`wp-env`を使用してローカル開発環境を立ち上げることをお勧めします。wp-envについての詳細はこちら](https://make.wordpress.org/core/2020/03/03/wp-env-simple-local-environments-for-wordpress/)を参照してください。wp-envがまだローカルにインストールされていない場合は、次の方法でインストールできます。 
`npm -g i @wordpress/env`を使用してインストールできます。

`wp-env`をインストールしたら、`my-extension-name`フォルダ内で`wp-env` startを実行してください。数秒後、WooCommerceと拡張機能がインストールされたテストWordPressサイトが`localhost:8888`で実行されます。

拡張機能にカスタム名を設定していない場合、`wp-admin/admin.php?page=wc-admin&path=%2Fmy-extension-name`にアクセスすると、/src/index.jsによって生成された設定ページを見ることができます。`wp-env`のデフォルトのユーザー名とパスワードの組み合わせは`admin` / `password`です。

## 次のステップ

拡張機能のブートストラップが完了したら、いよいよ機能を追加していきましょう！ここでは、いくつかの簡単な機能を紹介します：

[シンプル商品と可変商品にカスタムフィールドを追加する方法](https://developer.woocommerce.com/docs/how-to-add-a-custom-field-to-simple-and-variable-products/)

## リファレンス

[パッケージリファレンスはNPMの@woocommerce/create-woo-extensionをご覧ください](https://www.npmjs.com/package/@woocommerce/create-woo-extension)
[高度な機能についてはwp-envのコマンドリファレンスをチェック](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/#command-reference)
