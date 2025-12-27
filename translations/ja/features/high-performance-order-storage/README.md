---
sidebar_label: High Performance Order Storage
category_slug: hpos
post_title: High Performance Order Storage (HPOS)
---
# ハイパフォーマンス・オーダー・ストレージ（HPOS）

WooCommerceは従来、店舗の注文と関連する注文情報（払い戻しなど）をWordPressのカスタム投稿タイプまたは投稿メタレコードとして保存してきました。これにはパフォーマンスの問題があります。

[High-Performance Order Storage (HPOS)](https://developer.woocommerce.com/2022/09/14/high-performance-order-storage-progress-report/)は、以前は "Custom Order Tables "として知られていました。WooCommerceのCRUDデザインを使用し、注文データをカスタムテーブルに保存します。

2022年1月、私たちは[カスタムオーダーテーブル機能の初期計画](https://developer.woocommerce.com/2022/01/17/the-plan-for-the-woocommerce-custom-order-table/)を公開し、それ以来、私たちはWooCommerce Coreにハイパフォーマンスオーダーストレージ(HPOS)を導入するために努力してきました。2022年5月、私たちは[注文の移行プロセスをテスト](https://developer.woocommerce.com/2022/05/16/call-for-early-testing-custom-order-table-migrations/)し、様々な構成の実際の店舗で私たちの初期作業がどのように実行されるかについてフィードバックを提供するよう、皆様を招待しました。

2023年10月にリリースされたWooCommerce 8.2から、[High-Performance Order Storage (HPOS)](https://developer.woocommerce.com/2022/09/14/high-performance-order-storage-progress-report/)が正式に安定版フラグでリリースされ、新規インストール時にデフォルトで有効になります。

## 高性能オーダーストレージの新機能とは？

WooCommerceにHigh-Performance Order Storage (HPOS) を導入することで、eコマースストアに不可欠なこれら3つの特性が改善されます。

### スケーラビリティ

顧客数と顧客注文数の増加により、店舗のデータベースへの負荷が増大し、顧客からの注文リクエストを処理し、シームレスなユーザー体験を提供することが難しくなります。

High-Performance Order Storageを使用すると、注文や注文アドレスなどのデータ用に専用のテーブルが用意され、専用のインデックスが作成されます。この機能により、あらゆる形や規模のeコマースストアが、専門家の介入なしに、潜在的な可能性を最大限に引き出してビジネスを拡大することができます。

### 信頼性

高性能オーダー・ストレージは、ターゲット・データのバックアップの実装と復元を容易にします。カスタム・オーダー・テーブルの信頼性の高いバックアップにより、オーダー、在庫数、顧客情報の紛失を心配する必要がなくなります。また、読み取り/書き込みロックの実装が容易になり、競合状態を防ぐことができます。

### シンプルさ

もう、基礎データやWooCommerceのエントリーを探すために、一つの巨大なデータベースを調べる必要はありません。

High-Performance Order Storageを使用すると、`_posts`テーブルとは独立した個別のテーブルや扱いやすいエントリを簡単にブラウズして、データを探したりテーブル構造を理解したりすることができます。また、新しいプラグインを簡単に開発したり、ショップや商品のデザインを実装したり、WooCommerceをより柔軟に変更することができます。

## 背景

バージョン8.2がリリースされる前、WooCommerceは注文情報を保存するために`_post`と`_postmeta`テーブル構造に依存していました。

しかし、High-Performance Order Storageは、注文や注文アドレスのようなデータ専用のテーブルを導入し、専用のインデックスを作成することで、読み取り/書き込み操作を減らし、ビジーなテーブルを減らします。この機能により、あらゆる形や規模のeコマースストアが、専門家の介入なしに、潜在能力を最大限に引き出してビジネスを拡大することが可能になります。

注文データは`_posts`および`_postmeta`テーブルから4つのカスタム注文テーブルに同期される：

1.`_wc_orders`。
2.`_wc_order_addresses`。
3.__`_wc_order_operational_data`
4.__`_wc_orders_meta`

## 機能を有効にする

2023年10月にリリースされたWooCommerce 8.2から、新規インストール時にHPOSがデフォルトで有効になりました。既存のストアは[HPOSを有効にする方法](https://developer.woocommerce.com/docs/how-to-enable-high-performance-order-storage/)をご確認ください。

## データベーステーブル

[HPOSの注文データを格納するために、多くのデータベーステーブルが使用されます。OrdersTableDataStoreクラス](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/DataStores/Orders/OrdersTableDataStore.php)の`get_all_table_names`メソッドは、すべてのテーブルの名前を返します。

## 権威あるテーブル

HPOS機能が有効になっている間、関係するデータベース・テーブルには2つのロールがあります：authoritative_と_backup_です。オーソリティ・テーブルは作業用テーブルで、ストアの通常稼動時に注文データが保存され、そこから検索されます。backup_テーブルは、[synchronization](#同期)が発生するたびに、権威データのコピーを受け取ります。

`woocommerce_custom_orders_table_enabled`オプションをtrueに設定すると、HPOSがアクティブになり、[新しいテーブル](#database-tables)が権威テーブルとなり、投稿と投稿メタ・テーブルがバックアップ・テーブルとして機能します。オプションがfalseに設定されている場合は、その逆です。このオプションは管理画面（WooCommerce - Settings - Advanced - Custom data stores）から変更できます。

[CustomOrdersTableController クラス](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/DataStores/Orders/CustomOrdersTableController.php) は `woocommerce_order_data_store` フィルタをフックし、`WC_Data_Store::load( 'order' );` が [OrdersTableDataStore](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/DataStores/Orders/OrdersTableDataStore.php) のインスタンスか [WC_Order_Data_Store_CPT](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/data-stores/class-wc-order-data-store-cpt.php) のインスタンスを返すようにします。

データの整合性を保つため、オーダーの同期が保留されている間は、権威テーブルの切り替え（新しいテーブルから投稿テーブルへ、またはその逆）は許可されません。

## 同期

同期化とは、権限テーブルの保留中の変更をすべてバックアップ・テーブルに適用するプロセスです。同期を保留しているオーダーとは、権威テーブルで変更されたが、その変更がまだバックアップ・テーブルに適用されていないオーダーのことです。

これはさまざまな形で起こりうる：

### 即時同期

`woocommerce_custom_orders_table_data_sync_enabled`設定がtrueに設定されている場合、オーダが権威テーブルで変更されるとすぐに自動的に同期が行われます。

### 手動同期

即時同期が無効になっている場合、以下のようにコマンドラインから手動でトリガーすることができる：inline_code_0__。また、次のようにプログラム的にトリガーすることもできる：

```php
$synchronizer = wc_get_container()->get(Automattic\WooCommerce\Internal\DataStores\Orders\DataSynchronizer::class);
$order_ids = $synchronizer->get_next_batch_to_process( $batch_size );
if ( count( $order_ids ) ) {
	$synchronizer->process_batch( $order_ids );
}
```

ここで、`$batch_size`は処理するオーダーの最大数です。

### スケジュールされた同期

同期を保留している注文がある状態で即時同期が有効化された場合 (`woocommerce_custom_orders_table_data_sync_enabled` が true に設定された場合)、 [DataSynchronizer](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/DataStores/Orders/DataSynchronizer.php) のインスタンスが [BatchProcessingController](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/BatchProcessing/BatchProcessingController.php) を使用してキューに入れられ、作成/変更/削除された注文の同期がスケジュールされたアクションによってバッチで行われるようになります。このスケジューリングは、[CustomOrdersTableController](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/DataStores/Orders/CustomOrdersTableController.php) の内部で、`woocommerce_update_options_advanced_custom_data_stores` にフックすることで行われます。

何らかの理由で即時同期がすでに有効になっているにもかかわらず、同期がスケジュールされていない場合、設定ページ（WooCommerce - Settings - Advanced - Custom data stores）を開き、何も変更しなくても「保存」を押すことで同期を再開することができます。投稿テーブルと注文テーブルの同期を維持する」にチェックが入っている限り、以前にチェックが入っていたとしても、同期のスケジューリングは行われます。

`woocommerce_auto_flip_authoritative_table_roles`オプションがtrueに設定されている場合(設定ページにチェックボックスがあります)、すべての注文が同期されると、権威テーブルは自動的に切り替わります。これは[CustomOrdersTableControllerクラス](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/DataStores/Orders/CustomOrdersTableController.php)によって処理されます。

### 削除の同期化

注文削除の同期化はやっかいだ。一方のテーブル（新規テーブルまたはポスト）に注文が存在し、もう一方に注文が存在しない場合、欠落している注文を作成する必要があるのか、既存の注文を削除する必要があるのかがはっきりしない。理論的には、バックアップテーブルから欠落したオーダーは前者を意味し、権威テーブルから欠落したオーダーは後者を意味する。しかし、関係するコードにバグがあると、正当なオーダーが簡単に削除されてしまうので危険だ。

堅牢な注文削除同期メカニズムを実現するために、以下のことが行われる。注文が削除され、即時同期が無効になると、`wp_wc_orders_meta` テーブルに、`deleted_from` をキーとし、注文が削除された権限のあるテーブル名（`wp_wc_orders` または posts テーブル）を持つレコードが作成される。そして、同期時にこれらのレコードが処理され（対応する注文が対応するテーブルから削除され）、その後削除される。

上記の例外は、[プレースホルダ記録](#placeholder-records)です。これらは、`wp_wc_orders`から対応するオーダーが削除されると、即時同期が無効になっていても、直ちに削除されます。

High-Performance Order Storage**」と「**Compatibility mode**」が有効な場合、WooCommerceは投稿とpostmetaテーブルのデータをHPOSテーブルに入力します。テーブル間の同期は[このドキュメントで詳しく説明されています](https://developer.woocommerce.com/2022/09/29/high-performance-order-storage-backward-compatibility-and-synchronization/#synchronization)。

> テーブル間の同期については、[High-performance-order-storage-backward-compatibility-and-synchronizationに関するこの文書](https://developer.woocommerce.com/2022/09/29/high-performance-order-storage-backward-compatibility-and-synchronization/#synchronization) に詳しい説明があります。

## プレースホルダーのレコード

オー ダー ID は、権威テーブルとバックアップテーブルの両方で一致しなければならない。オーダーの識別と同期のために比較されるオーダーIDは、`wp_wc_orders`テーブルとpostsテーブルの`id`フィールドのものです。

`wp_wc_orders`のレコードが同じIDで作成されるからです。postsテーブルは注文だけでなく、複数の種類のデータを格納するために使用されます。同期が必要になる頃には、同期する注文と同じIDを持つ注文以外の投稿がすでに存在している可能性があります。

これを解決するために、_placeholderレコードが使用される。新しいオーダーテーブルがオーソリティであり、即時同期が無効になっているときはいつでも、新しいオーダーを作成すると、ポストタイプ`shop_order_placehold`でオーダーと同じIDのレコードがpostsテーブルに作成される。これは、postsテーブルのオーダーIDを効果的に "予約 "することになる。その後、同期時にレコードは適切に埋められ、そのpostタイプは`shop_order`に変更される。

## オーダーデータ保管

データストアを自由に切り替えて、テーブル間でデータを同期させることができる。

-   WordPress Post Tables "**を選択した場合、システムは`_post`および`_postmeta`テーブルに注文データを保存します。このシナリオでは、注文テーブルは使用されません。

![WordPressの投稿テーブルを選択](https://woocommerce.com/wp-content/uploads/2023/10/image-18.png?w=650)

-   High-Performance Order Storage "**を選択した場合、システムは新しいWooCommerce注文テーブル内に注文データを保存します。

![セレクト・ハイパフォーマンス・オーダー・ストレージ](https://woocommerce.com/wp-content/uploads/2023/10/image-19.png?w=650)

-   WordPress Post Tables "**と "Enable compatibility mode "**を選択した場合、システムは投稿/ポストメタとWooCommerce注文テーブル間で注文データを同期します。

![WordPressの投稿テーブルを選択し、互換モードを有効にする](https://woocommerce.com/wp-content/uploads/2023/10/image-20.png?w=650)

## 互換性のないプラグイン

High-Performance Order Storageと互換性のないプラグインを使用している場合、HPOSオプションは**WooCommerce > Settings > Advanced > Features**で無効になります。

![互換性のないプラグイン](https://woocommerce.com/wp-content/uploads/2023/10/image-21.png?w=650)

-   互換性のないプラグインのリストを確認するには、"**表示と管理**"をクリックしてください。
-   または、`https://example.com/wp-admin/plugins.php?plugin_status=incompatible_with_feature&feature_id=custom_order_tables`にアクセスして、互換性のないプラグインのリストを確認することもできます（`example.com`をあなたのサイトのドメインに置き換えてください）。

![プラグインのページ](https://woocommerce.com/wp-content/uploads/2023/10/image-22.png?w=650)

> もし、High-Performance Order Storageで正しく動作しないサードパーティの拡張機能を使用している場合は、その拡張機能の開発者に通知し、HPOSをサポートするように拡張機能をアップデートするよう依頼してください。HPOSのサポートを追加するかどうかは、拡張機能の開発者次第です。私たちは[開発者向けリソースとドキュメント](https://developer.woocommerce.com/2022/09/14/high-performance-order-storage-progress-report/)を用意していますので、統合作業を手伝ってください。

## HPOSを無効にする

問題が発生した場合、またはHPOSとまだ互換性のないプラグインで作業を続ける必要がある場合は、一時的に**WordPress posts storage**に戻すことをお勧めします。

これを行うには、**WooCommerce ▸ 設定 ▸ 詳細 ▸ 機能**に移動し、**互換モード**が有効になっていることを確認することから始めます。まだ有効になっていない場合、注文データがデータストア間で同期されるまでしばらく待つ必要があるかもしれません。

![WooCommerce ▸ 設定 ▸ 詳細 ▸ 機能画面](https://woocommerce.com/wp-content/uploads/2023/10/hpos-feature-settings.png?w=650)

同期が完了したら、**WordPress posts storage (legacy)** を選択してください。この時点で互換モードを無効にすることもできます。HPOSを再有効化する準備ができたら、[この文書の冒頭](https://github.com/woocommerce/woocommerce/blob/trunk/docs/high-performance-order-storage/#section-3)に掲載されている手順に従ってください。最後に、変更と変更の間にこのページを保存することを忘れないでください！

先に述べたように、互換性のないプラグインについては、サポートチームに連絡し、是正措置を取ってもらうことを強くお勧めする。
