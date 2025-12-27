---
post_title: Getting started with the WooCommerce REST API
category_slug: rest-api
sidebar_label: REST API
---
# WooCommerce REST API

[REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/#introduction)はWooCommerceの強力な機能で、注文、商品、クーポン、顧客、配送地域などWooCommerceの様々なデータを読み書きすることができます。

## 必要条件

標準のエンドポイントURI構造（例：`wc/v3/products`）を使用してREST APIにアクセスするには、WordPressのパーマリンクを「Plain」以外に設定する必要があります。設定 > パーマリンク**に移動し、オプションを選択します。

![パーマリンクのオプション](https://developer.woocommerce.com/wp-content/uploads/2023/12/permalinks.webp)

## APIリファレンス

[WooCommerce REST API Docs](https://woocommerce.github.io/woocommerce-rest-api-docs/)では、各APIエンドポイントの技術的な詳細とコードサンプルを提供しています。

## 認証

このガイドでは、APIがサーバー上で動作し、認証が可能かどうかをテストする簡単な方法を説明する。

これらの例では、[Postman](https://www.getpostman.com/)と[Insomnia](https://insomnia.rest/)の両方のクライアントを使用する。どちらも無料で、APIが提供するものを視覚化するのに役立つだろう。

先に進む前に、[REST API docs on authentication, which covers the important parts concerning API Keys and Auth](https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication) を読んでください。HTTPSでの接続は最もシンプルで安全な方法です。可能であればHTTPは避けるべきである。

## キーを生成する

REST APIを使い始めるには、まずAPIキーを生成する必要がある。

1.WooCommerce > 設定 > 詳細*に移動します。
2.REST API*タブに移動し、*Add key*をクリックします。
3.注文などにアクセスできるユーザーを選択し、キーに*読み取り/書き込み*権限を与えます。
4.Generate api key*をクリックします。
5.キーを再度表示しようとすると、秘密は隠されます。

![生成されたAPIキー](https://developer.woocommerce.com/wp-content/uploads/2023/12/keys.png)

## 基本的な要求をする

テストするリクエストURLは`wp-json/wc/v3/orders`である。localhostでは、完全なURLは次のようになります：`https://localhost:8888/wp-json/wc/v3/orders`。これを自分のサイトのURLに変更してください。

Postmanでは、リクエストタイプ、リクエストURL、認証タブの設定のフィールドを設定する必要があります。認証では、*basic auth*を選択し、ユーザー名とパスワードのフィールドにWooCommerceの*consumer key*と*consumer secret*キーを入力します。

すべてがうまくいっていれば、APIからのJSONレスポンスが表示されます。以下のようなものが表示されるはずだ：

![生成されたAPIキー](https://developer.woocommerce.com/wp-content/uploads/2023/12/postman.png)

インソムニアはポストマンとほとんど同じで、同じフィールドに記入し、やはりベーシック認証を使う。

![Insomnia](https://developer.woocommerce.com/wp-content/uploads/2023/12/insomnia.png)

以上だ！APIは機能している。

接続に問題がある場合は、SSL認証を無効にする必要があります。

## よくある接続の問題

### ローカルホストと自己署名SSL証明書による接続の問題

ローカルホスト上でREST APIへの接続に問題があり、このようなエラーが表示される場合：

![SSLエラー](https://developer.woocommerce.com/wp-content/uploads/2023/12/sslerror.png)

SSL認証を無効にする必要があります。Postmanの設定にあります：

![ポストマンの設定](https://developer.woocommerce.com/wp-content/uploads/2023/12/postman-ssl.png)

インソムニアにもこの設定がある：

![不眠症の設定](https://developer.woocommerce.com/wp-content/uploads/2023/12/insomnia-ssl.png)

### 401 認証されていません

APIキーまたは署名が間違っている。確認してください：

- APIキーを生成したユーザーは、実際にそれらのリソースにアクセスできる。
- 認証時のユーザー名はコンシューマー・キーです。
- 認証時のパスワードはコンシューマー・シークレットです。
- 念のため、新しいキーのセットを作成してください。

サーバーがFastCGIを使用している場合は、[認証ヘッダーが正しく読み込まれているか](https://web.archive.org/web/20230330133128/https://support.metalocator.com/en/articles/1654091-wp-json-basic-auth-with-fastcgi)を確認してください。

### コンシューマーキーが見つからない

時折、サーバーがAuthorizationヘッダーを正しく解析しないことがあります（SSL認証時に "Consumer key is missing "エラーが表示される場合は、サーバーに問題があります）。

この場合、代わりにコンシューマー・キー/秘密をクエリ文字列パラメータとして指定することができる。例

```text
https://local.wordpress.dev/wp-json/wc/v2/orders?consumer_key=XXXX&consumer_secret=XXXX
```

### サーバーはPOST/DELETE/PUTをサポートしていません。

理想的には、サーバーがこれらのタイプのAPIリクエストを受け付けるように設定されている必要がありますが、そうでない場合は、[`_method`プロパティ](https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header)を使用することができます。
