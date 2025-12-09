---
post_title: Thumbnail image regeneration
---

# Thumbnail image regeneration

WooCommerce 3.3からサムネイル再生成機能が導入されました。これまでは画像サイズの設定を変更する場合、外部プラグインをインストールし、WordPressのすべての画像サムネイルを再生成してからでないと変更が表示されませんでした。

新しい画像再生機能とカスタマイザーでのWooCommerce画像設定の導入により、ストアの画像設定を変更する際、カスタマイザー内でリアルタイムに変更をプレビューできるようになりました。

## How it works

カスタマイザーで画像サイズ/アスペクト比を変更したり、テーマで画像サイズを変更したりすると、WCはこれらの変更を検出し、バックグラウンド再生成ジョブをキューに入れます。これをトリガーする2つのイベントは以下の通りです：

- カスタマイザーでの設定の公開
- テーマの切り替え

カスタマイザーでは、オンザフライで画像を更新するため、サイズの変更をプレビューすることができます。これらの変更は、公開をクリックするまで本番サイトには反映されません。

### Background jobs and BasicAuth

あなたのサイトが BasicAuth の背後にある場合、非同期リクエストとバックグラウンド処理の両方が完了しません。これは WP Background Processing が WordPress HTTP API に依存しており、リクエストに BasicAuth 認証情報を添付する必要があるためです。

You can pass these credentials via a snippet, see:[BasicAuth documentation](https://github.com/A5hleyRich/wp-background-processing#basicauth).

### Viewing background regeneration logs

To view the logs for background image regeneration go to `WooCommerce > Status > Logs` and select the `wc-background-regeneration` log from the dropdown.

このログファイルには、処理された画像と、ジョブがいつ完了したか、またはいつキャンセルされたかが一覧表示されます。

### Cancelling a background regeneration job

WooCommerce 3.3.2以降、背景画像の再生成が実行されている場合、管理者に通知が表示されます。この通知の中にジョブをキャンセルするリンクがあります。

Cancelling the job will stop more thumbnails being regenerated. If image sizes do not look correct inside your catalog, you'll need to run thumbnail regeneration manually (either using our tool, or using another plugin such as [Regenerate Thumbnails](https://en-gb.wordpress.org/plugins/regenerate-thumbnails/).

### CDN plugins

ほとんどのCDNプラグインはWordPressコアのフックをリッスンし、一度作成されたサムネイルをそのサービスにアップロードします。これは、私たちのバックグラウンド画像再生成コードで機能し続けます。画像がサードパーティのサービスにアップロードされるため、生成は遅くなるかもしれません。

## How to disable background regeneration

The `woocommerce_background_image_regeneration` filter can be used to disable background regeneration completely. Example code:

```php
add_filter( 'woocommerce_background_image_regeneration', '__return_false' );
```

一度無効にすると、画像サイズの設定を変更して新しいサムネイルが必要になった場合、別のツールを使って手動でサムネイルを再生成する必要があります。

Alternatively, you can use the [Jetpack Photon module](https://jetpack.com/support/photon/) which can do image resizing on the fly and will be used instead of background regeneration as of WooCommerce 3.3.2.

## Using Jetpack Photon instead

[Jetpack](https://jetpack.com/) is a plugin by Automattic, makers of WordPress.com. It gives your self-hosted WordPress site some of the functionality that is available to WordPress.com-hosted sites.

[The Photon module](https://jetpack.com/support/photon/) makes the images on your site be served from WordPress.com's global content delivery network (CDN) which should speed up the loading of images. 

Photonはサムネイルをその場で作成できるので、背景画像の再生機能を使う必要がありません。
