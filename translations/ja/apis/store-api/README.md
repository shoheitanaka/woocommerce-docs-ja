---
sidebar_label: Store API
category_slug: store-api
post_title: Store API
---

# WooCommerce ストア API

**Store APIは、顧客向けのカート、チェックアウト、商品機能の開発のためのパブリックなRest APIエンドポイントを提供します。これは、[WordPress REST API](https://developer.wordpress.org/rest-api/key-concepts/) で使用されているパターンの多くに従っています。

WooCommerce REST APIとは対照的に、Store APIは認証されておらず、機密性の高い店舗データやその他の顧客情報へのアクセスを提供しません。

cURLを使用した有効なAPIリクエストの例：

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products"
```

Store APIの利用方法としては、以下のようなものが考えられる：

1.検索やフィルタリングが可能な、表示する商品リストの取得
2.カートに商品を追加し、表示用に更新されたカート・オブジェクトを返す。
3.カートの送料を取得する
4.顧客のカートをオーダーに変換し、住所を収集し、支払いを促進します。

## 必要条件と制限

* これは認証されていないAPIである。アクセスにAPIキーや認証トークンを必要としません。
* すべてのAPIレスポンスはJSON形式のデータを返します。
* API から返されるデータは、現在のユーザ (顧客) を反映したものです。WooCommerce の顧客セッションは Cookie ベースです。
* Store APIを使用して、IDで他の顧客や注文を検索することはできません。
* 同様に、Store APIを使用して設定などのストアデータを書き込むことはできません。より広範なアクセスには、認証済みの[WC REST API.](https://woocommerce.github.io/woocommerce-rest-api-docs/#introduction)を使用してください。
* 書き込みを許可するエンドポイント、たとえば現在の顧客アドレスの更新には、[nonce-token](https://developer.wordpress.org/plugins/security/nonces/)が必要です。
* Store APIはレンダーターゲットにとらわれず、コンテンツが表示される場所を仮定すべきではありません。例えば、データ型自体がHTMLでない限り、HTMLを返すことは推奨されない。

## ストア API 名前空間

Store APIのリソースはすべて`wc/store/v1`名前空間内にあり、このAPIはWordPress APIを拡張しているため、アクセスするには`/wp-json/`ベースが必要です。現在のところ、バージョンは `v1` のみです。バージョンが省略された場合は、`v1`が提供されます。

```http
GET /wp-json/wc/store/v1/products
GET /wp-json/wc/store/v1/cart
```

APIはJSONを使用してデータをシリアライズします。API URLの末尾に`.json`を指定する必要はありません。

## リソースとエンドポイント

Store APIで利用可能なリソースを以下に列挙し、より詳細なドキュメントへのリンクを掲載する。

| リソース | メソッド | エンドポイント |
| :----------------------------------------------------------- | :----------------------------- | --------------------------------------------------------------------------------------------- |
| [`Cart`](/docs/apis/store-api/resources-endpoints/cart) | `GET` | [`/wc/store/v1/cart`](/docs/apis/store-api/resources-endpoints/cart#get-cart) | | [`POST`](/docs/apis/store-api/resources-endpoints/cart#get-cart)
| |_INLINE_CODE_3__ | [`/wc/store/v1/cart/add-item`](/docs/apis/store-api/resources-endpoints/cart#add-item) |
| | `POST` | [`/wc/store/v1/cart/remove-item`](/docs/apis/store-api/resources-endpoints/cart#remove-item) |
| | `POST` | [`/wc/store/v1/cart/update-item`](/docs/apis/store-api/resources-endpoints/cart#update-item)
| [`POST`](/docs/apis/store-api/resources-endpoints/cart#apply-coupon) | | [`/wc/store/v1/cart/apply-coupon`](/docs/apis/store-api/resources-endpoints/cart#apply-coupon)
| | `POST` | [`/wc/store/v1/cart/remove-coupon`](/docs/apis/store-api/resources-endpoints/cart#remove-coupon)
| | `POST` | [`/wc/store/v1/cart/update-customer`](/docs/apis/store-api/resources-endpoints/cart#update-customer)
| [`POST`](/docs/apis/store-api/resources-endpoints/cart#select-shipping-rate) |｜ [`/wc/store/v1/cart/select-shipping-rate`](/docs/apis/store-api/resources-endpoints/cart#select-shipping-rate)
| [`Cart Items`](/docs/apis/store-api/resources-endpoints/cart-items) | `GET`, `POST`, `DELETE` | [`/wc/store/v1/cart/items`](/docs/apis/store-api/resources-endpoints/cart-items#list-cart-items) |
| | [`GET`, `POST`, `PUT`, `DELETE`](/docs/apis/store-api/resources-endpoints/cart-items#single-cart-item) | | [`/wc/store/v1/cart/items/:key`](/docs/apis/store-api/resources-endpoints/cart-items#single-cart-item)
| [`Cart Coupons`](/docs/apis/store-api/resources-endpoints/cart-coupons) | `GET`, `POST`, `DELETE` | [`/wc/store/v1/cart/coupons`](/docs/apis/store-api/resources-endpoints/cart-coupons#list-cart-coupons) | | [__INLINE_CODE_31__](/docs/apis/store-api/resources-endpoints/cart-coupons#list-cart-coupons)
| [`GET`, `DELETE`](/docs/apis/store-api/resources-endpoints/cart-coupons#single-cart-coupon) |｜ [`/wc/store/v1/cart/coupon/:code`](/docs/apis/store-api/resources-endpoints/cart-coupons#single-cart-coupon)
| [`Checkout`](/docs/apis/store-api/resources-endpoints/checkout) | `GET`, `POST`, `PUT` | [`/wc/store/v1/checkout`](/docs/apis/store-api/resources-endpoints/checkout) |
| [`Checkout order`](/docs/apis/store-api/resources-endpoints/checkout-order) | `POST` | [`/wc/store/v1/checkout/:id`](/docs/apis/store-api/resources-endpoints/checkout-order) |
| [`Order`](/docs/apis/store-api/resources-endpoints/order) | [`GET`](/docs/apis/store-api/resources-endpoints/order) |
| [`Products`](/docs/apis/store-api/resources-endpoints/products) | [`GET`](/docs/apis/store-api/resources-endpoints/products#list-products) |
| [`GET`](/docs/apis/store-api/resources-endpoints/products#single-product-by-id) |｜ [`/wc/store/v1/products/:id`](/docs/apis/store-api/resources-endpoints/products#single-product-by-id)
| [`Product Collection Data`](/docs/apis/store-api/resources-endpoints/product-collection-data) | `GET`｜ [`/wc/store/v1/products/collection-data`](/docs/apis/store-api/resources-endpoints/product-collection-data) |
| [`Product Attributes`](/docs/apis/store-api/resources-endpoints/product-attributes) | `GET` | [`/wc/store/v1/products/attributes`](/docs/apis/store-api/resources-endpoints/product-attributes#list-product-attributes)      |
| [`GET`](/docs/apis/store-api/resources-endpoints/product-attributes#single-product-attribute) |｜ [`/wc/store/v1/products/attributes/:id`](/docs/apis/store-api/resources-endpoints/product-attributes#single-product-attribute)
| [`Product Attribute Terms`](/docs/apis/store-api/resources-endpoints/product-attribute-terms) | `GET` | [`/wc/store/v1/products/attributes/:id/terms`](/docs/apis/store-api/resources-endpoints/product-attribute-terms) | | [__INLINE_CODE_61__](/docs/apis/store-api/resources-endpoints/product-attribute-terms)
| [`Product Categories`](/docs/apis/store-api/resources-endpoints/product-categories) | [`GET`](/docs/apis/store-api/resources-endpoints/product-categories) |
| [`Product Brands`](/docs/apis/store-api/resources-endpoints/product-brands) | [`GET`](/docs/apis/store-api/resources-endpoints/product-brands) |
| [`Product Reviews`](/docs/apis/store-api/resources-endpoints/product-reviews) | [`GET`](/docs/apis/store-api/resources-endpoints/product-reviews) |
| [`Product Tags`](/docs/apis/store-api/resources-endpoints/product-tags) | [`GET`](/docs/apis/store-api/resources-endpoints/product-tags) |

## ページネーション

コレクションに多くの結果が含まれる場合、ページ分割されることがあります。リソースを一覧表示する際には、以下のパラメータを渡すことができます：

| パラメータ
| :--------- | :------------------------------------------------------------------------------------- |
| `page` | コレクションの現在のページ。デフォルトは`1`です。                                       |
| `per_page` | 結果セットに返されるアイテムの最大数。デフォルトは `10` です。最大`100`。|

下の例では、1ページに20の商品をリストアップし、2ページ目を返します。

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products?page=2&per_page=20"
```

追加のページネーション・ヘッダーも追加情報とともに送り返される。

| ヘッダー
| :---------------- | :------------------------------------------------------------------------ |
| コレクション内のアイテムの総数。                              |
| `X-WP-TotalPages` | コレクションの総ページ数。                              |
| INLINE_CODE_3__, `prev`, `up` 該当する場合、他のページへのリンクが含まれます。|

## ステータスコード

以下の表は、API関数の一般的な動作の概要である。

| リクエストタイプ | 説明
| :----------- | :---------------------------------------------------------------------------------------------------------- |
| 1つ以上のリソースにアクセスし、`200 OK`と結果をJSONとして返します。                                    |
| リソースの作成に成功した場合は`201 Created`を返し、新しく作成されたリソースをJSONとして返します。|
| INLINE_CODE_4__ | リソースの変更に成功したら `200 OK` を返します。変更結果はJSONとして返される。          |
|_INLINE_CODE_6__ | リソースの削除に成功した場合は `204 No Content` を返します。                                          |

次の表は、APIリクエストで返される可能性のあるコードを示しています。

| レスポンスコード
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `200 OK`｜リクエストは成功し、リソース自体がJSONとして返されます。                                                                     |
| サーバはリクエストに成功し、レスポンスペイロードボディに送信する追加コンテンツはありません。             |
| INLINE_CODE_2__ | POSTリクエストは成功し、リソースはJSONとして返されます。                                                                       |
| API リクエストの必須属性が見つかりません。                                                                                         |
| リクエストは許可されていません。                                                                                                                 |
| リソースが存在しないなど、リソースにアクセスできませんでした。                                                                             |
| リクエストはサポートされていません。                                                                                                               |
| `409 Conflict` | 対象リソースの現在の状態と衝突したため、リクエストを完了できませんでした。現在の状態が返されることもある。|
| リクエストの処理中にサーバー側で何か問題が発生しました。                                                                                |

## 貢献

Store APIの各ルートには3つの主要な部分があります：

1.Route - リクエストをエンドポイントにマッピングします。Store API のルートは `AbstractRoute` クラスを継承しています。このクラスにはリクエストを処理し、JSON レスポンスを返すための共有機能が含まれています。ルーティングは、有効なレスポンスが返されることを保証し、コレクション、エラー、ページ分割を処理します。
2.スキーマ - ルートはリソースをフォーマットしません。代わりに、リソースの各タイプ、例えばProduct、Cart、Cart Itemを表す_Schema_クラスを使用します。ストアAPIのスキーマクラスは、`AbstractSchema`クラスを継承する必要があります。
3.Utility - Store APIがWooCommerceコアから複雑なデータにアクセスする必要がある、または複数のルートが同じデータにアクセスする必要がある、より高度なケースでは、ルートはControllerまたはUtilityクラスを使用する必要があります。例えば、Store APIには注文とカートのデータを検索するためのOrder ControllerとCart Controllerがあります。

通常、ルートは以下のタイプのリクエストを処理する：

* `GET`リクエストは、商品、カート、またはチェックアウトのデータを読み込みます。
* INLINE_CODE_1__ および `PUT` による、 カートやチェックアウトのデータを更新するリクエスト。
* カートのデータを削除する `DELETE` リクエスト。
* 現在のルートの JSON スキーマを取得する `OPTIONS` リクエスト。

ストアAPIガイド原則](/docs/apis/store-api/guiding-principles)をご確認ください。これは、開発に対する私たちのアプローチや、バージョニング、どのデータを含めるのが安全か、新しいルートを構築する方法などのトピックをカバーしています。

## 拡張性

Store APIにおける拡張性のアプローチは、特定のルートとスキーマをExtendSchemaクラスに公開することです。[これに関する貢献者のためのドキュメントはこちら](/docs/apis/store-api/extending-store-api/)を参照してください。

ルートに拡張インターフェイスが含まれている場合、サードパーティの開発者は共有の `ExtendSchema::class` インスタンスを使用して、追加のエンドポイントデータと追加のスキーマを登録できます。

これは従来のフィルター・フック・アプローチとは異なり、より限定的なものだが、サードパーティーの拡張機能がルートやエンドポイントを壊したり、他のアプリが依存する可能性のある返されたデータを上書きしたりする可能性を減らすことができる。

新しいスキーマが必要で、以下の記述のいずれかが当てはまる場合は、既存のStore APIスキーマに新しいスキーマを導入するのではなく、Store APIを_拡張することを選択してください：

* データは拡張機能の一部であり、コアではない
* データはリソースに関連しているが、技術的にはリソースの一部ではない
* データのクエリが（パフォーマンス的に）困難である、あるいは非常に狭い、あるいはニッチなユースケースである。

データが機密である場合（例えば、非公開にすべきコア設定）、または現在のユーザーと関係がない場合（例えば、注文IDで注文を検索する）、[認証されたWC REST APIを使用する](https://woocommerce.github.io/woocommerce-rest-api-docs/#introduction)を選択します。

Store API _schema_を拡張するのではなく、_new routes and endpoints_を追加したい場合は、Store APIを拡張する必要はありません。代わりに WordPress のコア機能を利用して新しいルートを作成し、Store API と同じパターンを使用することもできます。こちらをご覧ください：

* [`register_rest_route()`](https://developer.wordpress.org/reference/functions/register_rest_route/)
* [レストAPIパーミッションコールバック](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/#permissions-callback)
