---
post_title: Customizing WooCommerce endpoint URLs
sidebar_label: Customizing endpoint URLs
---

# Customizing WooCommerce endpoint URLs

始める前に、[WooCommerce Endpoints](./woocommerce-endpoints.md) をチェックしてください。 

## エンドポイントURLのカスタマイズ

各エンドポイントのURLは**WooCommerce > Settings > Advanced** のページ設定セクションでカスタマイズすることができます。

![Endpoints](https://developer.woocommerce.com/wp-content/uploads/2023/12/endpoints.png)

競合を避けるため、一意であることを確認してください。404で問題が発生した場合は、**Settings > Permalinks**に移動し、リライトルールをフラッシュするために保存してください。

## メニューでエンドポイントを使う

メニューにエンドポイントを含めたい場合は、リンクセクションを使用する必要があります：

![The Links section of a menu item in WordPress](https://developer.woocommerce.com/wp-content/uploads/2023/12/2014-02-26-at-14.26.png)

エンドポイントへの完全なURLを入力し、それをメニューに挿入する。

view-orderのようないくつかのエンドポイントは、動作するために注文IDを必要とすることを覚えておいてください。一般的に、これらのエンドポイントをメニューに追加することはお勧めしません。これらのページはmy-accountページからアクセスすることができます。

## 支払ゲートウェイプラグインでエンドポイントを使う

WooCommerceはこれらのURLを取得するためのヘルパー関数を注文クラスに提供しています。それらは

`$order->get_checkout_payment_url( $on_checkout = false );`。

`$order->get_checkout_order_received_url();`。

ゲートウェイは、2.1+との完全な互換性を保つために、これらの方法を使用する必要がある。

## トラブルシューティング

### 404を表示するエンドポイント

-   404エラーが表示された場合は、**WordPress Admin** > **Settings > Permalinks** と進み、保存してください。これにより、エンドポイントのリライトルールが存在し、使用できる状態になります。
-   view-orderのようなエンドポイントを使用する場合は、注文番号が指定されていることを確認してください。/view-order/は無効です。/view-order/10/は有効です。このようなタイプのエンドポイントは、ナビゲーション・メニューには使用しないでください。

### エンドポイントが機能していない

Windowsサーバーでは、エンドポイントが正しく動作するように**web.config**ファイルが正しく設定されていない可能性があります。この場合、エンドポイントのリンク（例：/edit-account/ や /customer-logout/）をクリックしても、ページが更新されるだけで何もしないように見えることがあります。これを解決するには、Windowsサーバーの**web.config**ファイルを簡素化してみてください。以下にファイル設定のサンプルを示します：

```xml
<<>?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <handlers accessPolicy="Read, Execute, Script" />
    <rewrite>
    <rules>
      <rule name="wordpress" patternSyntax="Wildcard">
        <match url="*" />
        <conditions>
          <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
        </conditions>
        <action type="Rewrite" url="index.php" />
      </rule>
    </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### ページが間違った場所に誘導される

エンドポイントURLをクリックしたときに間違ったページにランディングするのは、一般的に設定が正しくないことが原因です。例えば、アカウントページで'Edit address'をクリックすると、住所編集フォームではなくショップページに移動するのは、設定で間違ったページを選択したことを意味します。ページが正しく設定され、セクションごとに異なるページが使用されていることを確認してください。

### マイアカウントから「ダウンロード」を削除する方法

マイアカウント」ページの「ダウンロード」エンドポイントを表示する必要がない場合があります。これは**WooCommerce > Settings > Advanced > Account endpoints**に行き、Downloads endpointフィールドをクリアすることで削除することができます。

![Account endpoints](https://developer.woocommerce.com/wp-content/uploads/2023/12/Screenshot-2023-04-09-at-11.45.58-PM.png)
