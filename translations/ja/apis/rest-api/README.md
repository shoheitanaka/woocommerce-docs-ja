---
post_title: Getting started with the WooCommerce REST API
category_slug: rest-api
sidebar_label: REST API
---

# WooCommerce REST API

[REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/#introduction)はWooCommerce の強力な機能で、注文、商品、クーポン、顧客、配送地域など WooCommerce の様々なデータを読み書きすることができます。

## 必要条件

標準のエンドポイントURI構造（例：`wc/v3/products`）を使用して REST API にアクセスするには、WordPress のパーマリンクを「Plain」以外に設定する必要があります。設定 > **パーマリンク**に移動し、オプションを選択します。

![Permalinks options](https://developer.woocommerce.com/wp-content/uploads/2023/12/permalinks.webp)

## API リファレンス

[WooCommerce REST API Docs](https://woocommerce.github.io/woocommerce-rest-api-docs/)では、各 API エンドポイントの技術的な詳細とコードサンプルを提供しています。

## 認証

このガイドでは、APIがサーバー上で動作し、認証が可能かどうかをテストする簡単な方法を説明する。

これらの例では、[Postman](https://www.getpostman.com/)と[Insomnia](https://insomnia.rest/)の両方のクライアントを使用する。どちらも無料で、API が提供するものを視覚化するのに役立つだろう。

先に進む前に、[REST API docs on authentication, which covers the important parts concerning API Keys and Auth](https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication) を読んでください。HTTPS での接続は最もシンプルで安全な方法です。可能であれば HTTP は避けるべきである。

## キーを生成する

REST API を使い始めるには、まず API キーを生成する必要がある。

1.WooCommerce > 設定 > 詳細*に移動します。
2.REST API*タブに移動し、*Add key*をクリックします。
3.注文などにアクセスできるユーザーを選択し、キーに*読み取り/書き込み*権限を与えます。
4.*Generate api key*をクリックします。
5.キーを再度表示しようとすると、秘密は隠されます。

![Generated API Keys](https://developer.woocommerce.com/wp-content/uploads/2023/12/keys.png)

## 基本的な要求をする

テストするリクエストURLは `wp-json/wc/v3/orders` である。localhost では、完全なURLは次のようになります：`https://localhost:8888/wp-json/wc/v3/orders`。これを自分のサイトの URL に変更してください。

Postman では、リクエストタイプ、リクエスト URL、認証タブの設定のフィールドを設定する必要があります。認証では、*basic auth* を選択し、ユーザー名とパスワードのフィールドに WooCommerce の *consumer key* と *consumer secret* キーを入力します。

すべてがうまくいっていれば、API からの JSON レスポンスが表示されます。以下のようなものが表示されるはずだ：

![Generated API Keys](https://developer.woocommerce.com/wp-content/uploads/2023/12/postman.png)

インソムニアはポストマンとほとんど同じで、同じフィールドに記入し、やはりベーシック認証を使う。

![Insomnia](https://developer.woocommerce.com/wp-content/uploads/2023/12/insomnia.png)

以上だ！API は機能している。

接続に問題がある場合は、SSL 認証を無効にする必要があります。

## よくある接続の問題

### ローカルホストと自己署名 SSL 証明書による接続の問題

ローカルホスト上で REST API への接続に問題があり、このようなエラーが表示される場合：

![SSL Error](https://developer.woocommerce.com/wp-content/uploads/2023/12/sslerror.png)

SSL 認証を無効にする必要があります。Postman の設定にあります：

![Postman settings](https://developer.woocommerce.com/wp-content/uploads/2023/12/postman-ssl.png)

インソムニアにもこの設定がある：

![Insomnia settings](https://developer.woocommerce.com/wp-content/uploads/2023/12/insomnia-ssl.png)

### 401 認証されていません

API キーまたは署名が間違っている。確認してください：

- API キーを生成したユーザーは、実際にそれらのリソースにアクセスできる。
- 認証時のユーザー名はコンシューマー・キーです。
- 認証時のパスワードはコンシューマー・シークレットです。
- 念のため、新しいキーのセットを作成してください。

サーバーが FastCGI を使用している場合は、[認証ヘッダーが正しく読み込まれているか](https://web.archive.org/web/20230330133128/https://support.metalocator.com/en/articles/1654091-wp-json-basic-auth-with-fastcgi)を確認してください。

### コンシューマーキーが見つからない

時折、サーバーが Authorization ヘッダーを正しく解析しないことがあります（SSL 認証時に "Consumer key is missing "エラーが表示される場合は、サーバーに問題があります）。

この場合、代わりにコンシューマー・キー/秘密をクエリ文字列パラメータとして指定することができる。例

```text
https://local.wordpress.dev/wp-json/wc/v2/orders?consumer_key=XXXX&consumer_secret=XXXX
```

### サーバーは POST/DELETE/PUT をサポートしていません。

理想的には、サーバーがこれらのタイプのAPIリクエストを受け付けるように設定されている必要がありますが、そうでない場合は、[`method` プロパティ](https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header)を使用することができます。
