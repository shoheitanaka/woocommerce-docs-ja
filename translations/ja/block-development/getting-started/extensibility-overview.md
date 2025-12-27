---
sidebar_label: Extensibility in blocks
category_slug: extensibility-in-blocks
post_title: Extensibility in blocks
---
# ブロックの拡張性

これらのドキュメントはすべて様々なWooCommerceブロックの拡張性を扱っています。

## インポートと依存関係の抽出

このセクションのドキュメントでは、例えばコード例でウィンドウ・グローバルを使用します：

```js
const { registerCheckoutFilters } = window.wc.blocksCheckout;
```

しかし、依存関係の管理を強化するために`@woocommerce/dependency-extraction-webpack-plugin`を使う場合は、代わりにESモジュール構文を使うことができる：

```js
import { registerCheckoutFilters } from '@woocommerce/blocks-checkout';
```

詳しくは[@woocommerce/dependency-extraction-webpack-plugin](https://www.npmjs.com/package/@woocommerce/dependency-extraction-webpack-plugin)を参照してください。

## フック（アクションとフィルター）

| ドキュメント
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [Actions](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/hooks/actions.md) | サーバー・サイドのアクション・フックをカバーするドキュメント。     |
| [フィルター](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/hooks/filters.md) サーバー側のフィルターフックに関するドキュメントです。     |
| [移行されたフック](/docs/block-development/reference/hooks/migrated-hooks/) | 移行されたWooCommerceコアフックに関するドキュメント。|

## REST API

| ドキュメント | ディスクリプション |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Store APIでデータを公開する](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-add-data.md) | Store APIエンドポイントに追加データを追加する方法を説明します。    |
|[ExtendSchemaで拡張可能なエンドポイント](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/available-endpoints-to-extend.md) 拡張可能なエンドポイントの一覧です。                        |
| [使用可能なフォーマッタ](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-formatters.md) | Store APIで使用するデータをフォーマットするために使用可能な`Formatters`です。     |
| [Store APIでカートを更新する](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/docs/third-party-developers/extensibility/rest-api/extend-rest-api-update-cart.md) | フロントエンドからのアクションに続いてサーバーサイドのカートを更新します。|

## チェックアウト 支払い方法

[| ドキュメント | ディスクリプション |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| チェックアウトフローとイベント](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/checkout-payment-methods/checkout-flow-and-events/)                            | チェックアウト・ブロックにおけるチェックアウトの流れと、購読可能な様々な発行イベントについて。|
| [支払い方法の統合](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/checkout-payment-methods/payment-method-integration/)| 決済方法の実装に関する情報                                                             |
| [支払い方法のフィルタリング](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/checkout-payment-methods/filtering-payment-methods/)    | チェックアウトブロックで利用可能な支払い方法のフィルタリングに関する情報。                            |

## チェックアウト・ブロック

以下の参考資料に加えて、[`block-checkout`パッケージのドキュメント](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/packages/checkout/README.md)(`@woocommerce/dependency-extraction-webpack-plugin`パッケージのドキュメント)(https://www.npmjs.com/package/@woocommerce/dependency-extraction-webpack-plugin)を参照してください。

[| ドキュメント
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| チェックアウト・ブロックが注文を処理する方法](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/how-checkout-processes-an-order/)| チェックアウトフローの詳細な内部構造。                                                                 |
| [IntegrationInterface](/docs/block-development/reference/integration-interface/) | `IntegrationInterface` クラスと、スクリプト、スタイル、データをWooCommerceブロックに登録するための使い方。|
| [利用可能なフィルター](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/filters-in-cart-and-checkout/)                                 | WooCommerceブロックの特定の要素の値を変更するために使用できるフィルタについて。                |
| [スロットとフィル](/docs/block-development/reference/slot-fills/) | カートとチェックアウトで独自のコンポーネントをレンダリングするためのスロットフィルとその使用方法について説明しています。                       |
| [利用可能なスロットフィル](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/available-slot-fills/)                                                | カートとチェックアウトで使用可能なスロットとその位置。                                        |
| [DOMイベント](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/dom-events/)                                                               | ブロック間やWooCommerceの他の部分との通信に使用されるDOMイベントのリストです。         |
| [フィルタレジストリ](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/blocks/packages/checkout/filter-registry/README.md) | フィルタレジストリは特定の値を操作するためにコールバックを登録することができます。                               |
| [追加チェックアウトフィールド](/docs/block-development/extensible-blocks/cart-and-checkout-blocks/additional-checkout-fields/)                               | フィルタ・レジストリでは、特定の値を操作するためにコールバックを登録することができます。                               |
