---
post_title: Working with webhooks in WooCommerce
sidebar_label: Using webhooks
---
# WooCommerceでウェブフックを使う

## ウェブフックとは？

[Webhook](http://en.wikipedia.org/wiki/Webhook)は、任意のURLに送信されるイベント通知です。ユーザーは、あるサイト上のイベントをトリガーして、別のサイト上の動作を呼び出すように設定できます。

Webhookは、サードパーティのサービスや、それをサポートする他の外部APIと統合するのに便利です。

## WooCommerceのウェブフック

WebhookはWooCommerce 2.2で導入され、注文、商品、クーポン、顧客を追加、編集、削除するたびにイベントをトリガーすることができます。

例えば、`woocommerce_add_to_cart`アクションを使用して、ショッピングカートに商品が追加されるたびに使用されるウェブフックを作成します。

Webhookはまた、サードパーティアプリとWooCommerceの統合を容易にします。

## ウェブフックの作成

![WebHooksスクリーン](https://woocommerce.com/wp-content/uploads/2013/01/woo-webhooks.png)

新しいウェブフックを作成するには

1/ **に移動します**： **WooCommerce > Settings > Advanced > Webhooks**.
> 注意:** WebhookはWooCommerce 3.4以前はWooCommerce > Settings > APIにありました。

2/ **Create a new webhook** (first incident)または**Add webhook**を選択します。ウェブフックデータ**ボックスが表示されます。

![ウェブフック作成](https://woocommerce.com/wp-content/uploads/2013/01/woo-webhooks.png)

3/ **Enter**。

- **名前**：名前**は、作成を容易にするための標準として、"Webhook created on [date and time of creation]"として自動生成されます。他の名前に変更してください。
- **ステータスActive**（ペイロードを配信する）、**Paused**（配信しない）、**Disabled**（配信失敗で配信しない）のいずれかに設定します。
- **トピック**：Webhook がいつトリガーされるべきかを示します - **Order Created**, **Product Deleted**, または **Customer Updated**。また、**Action**と**Custom**のオプションもあります。
    - **アクション・イベント**：このオプションは、トピックが WooCommerce **Action** (顧客がショッピングカートに商品を追加したときの `woocommerce_add_to_cart` など) の場合に使用できます。
    - **カスタムトピック**：このオプションは**上級ユーザー専用**です。`woocommerce_webhook_topic_hooks`フィルタを使用して、新しいカスタマイズされたトピックを導入することができます。
- **配信URL**：ウェブフックペイロードが配信されるURL。
- **シークレットシークレットキーは、配信されたウェブフックのハッシュを生成し、リクエストヘッダーで提供されます。何も入力されていない場合、デフォルトは現在の API ユーザーのコンシューマーシークレットです。

4/ **ウェブフックを保存**.

> 注意注***：Webhookが初めてActivatedステータスで保存されると、配信URLにpingが送信されます。

配信 URL が `404` または `5xx` のような失敗したステータスを返した場合、Webhook はデフォルトで 5 回再試行すると無効になります。成功したレスポンスは `2xx`, `301` または `302` です。

リトライの回数を増やすには、`woocommerce_max_webhook_delivery_failures`フィルター関数を使うことができる。

## ウェブフックの編集と削除

Webhookは投稿や商品と同じように表示されます。

1.  変更したいWebhookを見つけます。
2.  名前にカーソルを合わせると、**Edit**と**Delete permanently**オプションが表示されます。
3.  **削除**するか、**編集**して**変更を保存**してください。ドロップダウンで一括削除も可能です。

![ウェブフック削除](https://woocommerce.com/wp-content/uploads/2013/01/editdelete-webhook.png)

## ウェブフック・ログ

WooCommerceはWebhookをトリガーしたすべてのイベントのログを保存します。ウェブフックのログは  **WooCommerce > Status > Logs**.

![WebHooksログ](https://woocommerce.com/wp-content/uploads/2022/11/Viewing-WooCommerce-Webhook-Logs.png?w=650)

ログを確認することで、サーバーからの配信と応答を確認することができ、統合とデバッグがより簡単になる。
