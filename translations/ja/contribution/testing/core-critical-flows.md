---
post_title: WooCommerce core critical flows
sidebar_label: Core critical flows
---

# WooCommerce core critical flows

WooCommerce Coreで最も重要だと思われるユーザーフローを特定しました。これらのフローはテストに集中し、優先順位をつけるのに役立ちます。また、変更の影響や問題の優先順位を検討するのにも役立ちます。

これらのフローは、フローが更新されたり、追加されたり、優先順位が変更されたりして、プラットフォームが進化するにつれて継続的に進化していく。

## Shopper critical flow areas

-   [ショッパー &gt; ショップ](#shopper---shop)
-   [ショッパー &gt; 商品](#shopper---product)
-   [ショッパー &gt; カート](#shopper---cart)
-   [ショッパー &gt; チェックアウト](#shopper---checkout)
-   [ショッパー &gt; Eメール](#shopper---email)
-   [ショッパー &gt; マイアカウント](#shopper---my-account)

## Merchant critical flow areas

-   [マーチャント &gt; オンボーディング](#merchant---onboarding)
-   [マーチャント &gt; ダッシュボード](#merchant---dashboard)
-   [マーチャント &gt; 設定](#マーチャント--設定)
-   [マーチャント &gt; クーポン](#merchant---coupons)
-   [マーチャント &gt; マーケティング](#merchant---marketing)
-   [マーチャント &gt; アナリティクス](#merchant---analytics)
-   [マーチャント &gt; 商品](#マーチャント--商品)
-   [マーチャント &gt; オーダー](#merchant---orders)
-   [マーチャント &gt; 顧客](#マーチャント---顧客)
-   [マーチャント &gt; Eメール](#merchant---email)
-   [マーチャント &gt; プラグイン](#merchant---plugins)
-   [マーチャント &gt; マイ購読](#merchant---my-subscriptions)
-   [マーチャント &gt; ページ](#merchant---pages)
-   [マーチャント &gt; 投稿](#merchant---posts)

### Shopper - Shop

| ユーザータイプ│フローエリア│フロー名│テストファイル
| --------- | --------- | ------------------------------------------- | -------------------------------------------- |
| ショッパー｜ショップ｜店舗検索｜shopper/shop-search-browse-sort.spec.js
| ショッパー｜ショップ｜カテゴリーから探す｜shopper/shop-search-browse-sort.spec.js
| ショッパー｜ショップ｜商品の並べ替え｜shopper/shop-search-browse-sort.spec.js
| ショップ｜シンプルな商品をカートに入れる（ショップページから）｜shopper/cart.spec.js
| ショッパー｜ショップ｜ショップカタログを表示する｜shopper/shop-search-browse-sort.spec.js
| ショッパー｜ショップ｜タグ別商品｜shopper/product-tags-attributes.spec.js
| ショッパー｜ショップ｜属性別商品｜shopper/product-tags-attributes.spec.js
| ショッパー｜ショップ｜商品フィルタを使う｜shopper/shop-products-filer-by-price.spec.js |

### Shopper - Product

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | ---------------------------------------------------- | ---------------------------------------- |
| ショッパー｜商品｜シンプルな商品をカートに入れる｜shopper/product-simple.spec.js
| ショッパー｜商品｜グループ化された商品をカートに入れる｜shopper/product-grouped.spec.js
| ショッパー｜商品｜バリエーションによって商品情報を更新する｜shopper/product-variable.spec.js
| ショッパー｜商品｜バリエーション商品をカートに追加｜shopper/product-variable.spec.js
| ショッパー｜商品｜アップセル商品を表示する｜products/product-linked-products.spec.js
| Shopper   | Product   | Display related products                             | products/product-linked-products.spec.js |
| ショッパー｜商品｜レビューを表示する｜merchant/product-reviews.spec.js
| ショッパー | 商品 | レビューを追加する | merchant/product-reviews.spec.js |
| ショッパー｜商品｜商品画像を見る｜shopper/product-simple.spec.js
| ショッパー｜商品｜商品説明を見る｜shopper/product-simple.spec.js

### Shopper - Cart

| ユーザータイプ│フローエリア│フロー名│テストファイル
| --------- | --------- | ------------------------------------------ | ------------------------------------------- |
| ショッパー｜カート｜カートに入れるを有効にするとカートにリダイレクトする｜shopper/cart-redirection.spec.js
| ショッパー｜カート｜カートを見る｜shopper/cart.spec.js
| ショッパー｜カート｜商品の数量を制限内で更新する｜shopper/cart.spec.js
| ショッパー｜カート｜カートから商品を削除する｜shopper/cart.spec.js
| ショッパー｜カート｜全てのクーポンを適用する｜shopper/cart-coupons.spec.js
| ショッパー｜カート｜住所別の配送オプションを表示する｜shopper/calculate-shipping.spec.js
| ショッパー｜カート｜空のカートを表示｜shopper/cart.spec.js
| ショッパー｜カート｜正しい税金を表示する｜shopper/cart-checkout-calculate-tax.spec.js｜｜ショッパー｜カート｜正しい税金を表示する
| ショッパー | カート | クーポン使用の制約を尊重する | shopper/cart-checkout-coupons.spec.js |
| ショッパー｜カート｜クロスセル商品を表示する｜products/product-linked-products.spec.js｜｜。
| ショッパー | カート | チェックアウトに進む | shopper/checkout.spec.js |

### Shopper - Checkout

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | ---------------------------------------- | ------------------------------------------- |
| ショッパー｜チェックアウト｜オーダーレビューでアイテムを修正する｜shopper/checkout.spec.js
| ショッパー｜チェックアウト｜配送先住所を追加することができます。
| ショッパー｜チェックアウト｜ゲストが注文をすることができます。
| ショッパー｜チェックアウト｜アカウント作成｜shopper/checkout-create-account.spec.js｜｜ショッパー｜チェックアウト｜ログイン
| ショッパー｜レジ｜既存アカウントへのログイン｜shopper/checkout-login.spec.js
| ショッパー｜チェックアウト｜既存の顧客が注文できる｜shopper/checkout.spec.js
| ショッパー｜チェックアウト｜全てのクーポンを使用する｜shopper/checkout-coupons.spec.js
| ショッパー｜チェックアウト｜チェックアウトを見る｜shopper/checkout.spec.js
| ショッパー｜チェックアウト｜フォームが不完全な場合に警告を受け取る｜shopper/checkout.spec.js
| ショッパー｜チェックアウト｜請求先住所を追加する｜shopper/checkout.spec.js
| ショッパー | チェックアウト | クーポン使用の制約を尊重する | shopper/cart-checkout-coupons.spec.js |
| ショッパー｜チェックアウト｜チェックアウト時に正しい税金を表示する｜shopper/cart-checkout-calculate-tax.spec.js｜｜ショッパー｜チェックアウト｜チェックアウト時に正しい税金を表示する。
| ショップ｜チェックアウト｜注文確認ページの表示｜shopper/checkout.spec.js

### Shopper - Email

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | ------------------------------------- | --------------------------------------- |
| ショッパー｜Eメール｜顧客アカウントEメール受信｜shopper/account-email-receiving.spec.js
| ショッパー｜Eメール｜顧客注文詳細メール受信｜shopper/order-email-receiving.spec.js |

### Shopper - My Account

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | ---------- | ------------------------- | ----------------------------------------- |
| ショッパー｜マイアカウント｜アカウント作成｜shopper/my-account-create-account.spec.js
| ショッパー｜マイアカウント｜既存アカウントへのログイン｜shopper/my-account.spec.js
| ショップ｜マイアカウント｜アカウント詳細を見る｜shopper/my-account.spec.js
| ショップ｜マイアカウント｜住所更新｜shopper/my-account-addresses.spec.js
| ショップ｜マイアカウント｜注文を見る｜shopper/my-account-pay-order.spec.js
| ショップ｜マイアカウント｜注文の支払い｜shopper/my-account-pay-order.spec.js
| ショッパー｜マイアカウント｜ダウンロードを見る｜shopper/my-account-downloads.spec.js

### Merchant - Onboarding

| ユーザータイプ│フローエリア│フロー名│テストファイル
| --------- | ------------- | -------------------------------------------------------------- | ---------------------------------------- |
| マーチャント｜コアプロファイラ｜イントロダクション＆オプトイン｜activate-and-setup/core-profiler.spec.js
| マーチャント｜コアプロファイラ｜ユーザプロファイル情報｜activate-and-setup/core-profiler.spec.js｜マーチャント｜コアプロファイラ
| マーチャント｜コアプロファイラ｜ビジネス情報｜activate-and-setup/core-profiler.spec.js｜｜マーチャント｜コアプロファイラ
| マーチャント｜コアプロファイラ｜拡張機能ページ｜activate-and-setup/core-profiler.spec.js｜マーチャント｜コアプロファイラ
| マーチャント｜コアプロファイラ｜WooPaymentsが対象条件のエクステンションに含まれる｜activate-and-setup/core-profiler.spec.js｜WooPaymentsが対象条件のエクステンションに含まれる。
| マーチャント | コアプロファイラ | WooPaymentsが非適格基準のエクステンションに含まれていない｜activate-and-setup/core-profiler.spec.js｜WooPaymentsが非適格基準のエクステンションに含まれていない。
| Merchant | コアプロファイラ | すべてのデフォルトエクステンションをインストールする | activate-and-setup/core-profiler.spec.js |.
| Merchant | コアプロファイラ | サイトのセットアップを完了する | activate-and-setup/core-profiler.spec.js |.
| Merchant | コアプロファイラ | 導入をスキップしてビジネスロケーションを確認する | activate-and-setup/core-profiler.spec.js |｜ 商人｜コアプロファイラ

### Merchant - Dashboard

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | -------------- | ------------------------------------------------------ | --------- |
| Merchant  | WC Home        | Completing profiler redirects to home                  |           |
| Merchant  | WC Home        | Complete all steps on task list                        |           |
| マーチャント｜WCホーム｜タスクリストを隠す
| | Merchant | WC Home | タスクリスト終了後に表示されるストア管理
| マーチャント｜WCホーム｜統計概要から分析レポートへの直接アクセス
| マーチャント｜WCホーム｜アップグレード後もタスクリスト完了ステータスを保持
| マーチャント｜WCホーム｜拡張タスクリストとの連動
| | マーチャント｜アクティビティパネル｜アクティビティボタンと連動
| マーチャント｜受信トレイ｜ノートと連動し、CTAを実行｜マーチャント｜受信トレイ｜ノートと連動し、CTAを実行
| マーチャント｜受信トレイ｜1つのノートとすべてのノートを削除する

### Merchant - Settings

| ユーザータイプ│フローエリア│フロー名│テストファイル
| --------- | --------- |----------------------------------------|------------------------------------------|
| マーチャント｜設定｜一般設定の更新｜merchant/settings-general.spec.js
| マーチャント｜設定｜税率を追加｜merchant/settings-tax.spec.js
| 商店 | 設定 | 配送ゾーンの追加 | merchant/create-shipping-zones.spec.js |
| 商店 | 設定 | 配送クラスの追加 | merchant/create-shipping-classes.spec.js |
| Merchant | 設定 | チェックアウトブロックのローカルピックアップを有効にする | merchant/settings-shipping.spec.js |
| Merchant | 設定 | 支払い設定の更新 | admin-tasks/payment.spec.js |
| マーチャント｜設定｜商品ブランドを扱う｜merchant/create-product-brand.spec.js｜マーチャント｜設定｜商品ブランドを扱う

### Merchant - Coupons

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | --------------------- | ------------------------------------------ |
| マーチャント｜クーポン｜すべてのクーポンを追加｜merchant/create-coupon.spec.js
| マーチャント｜クーポン｜制限付きクーポンの追加｜マーチャント/create-restricted-coupons.spec.js

### Merchant - Marketing

| ユーザータイプ│フローエリア│フロー名│テストファイル
| --------- | --------- | -------------------------- | -------------------------------- |
| マーチャント｜マーケティング｜マーケティング概要の表示｜admin-marketing/overview.spec.js

### Merchant - Analytics

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | -------------------------------------------------- | ------------------------------------------ |
| マーチャント｜アナリティクス｜収益レポートを見る｜admin-analytics/analytics.spec.js
| Merchant | Analytics | 概要レポートを見る | admin-analytics/analytics-overview.spec.js |
| Merchant | Analytics | 概要レポートのサマリー数値が正しいか確認する | admin-analytics/analytics-data.spec.js｜｜ Merchant | Analytics | 概要レポートのサマリー数値が正しいか確認する。
| 商取引｜アナリティクス｜概要ページで日付フィルタを使用する｜admin-analytics/analytics-data.spec.js｜マーチャント｜アナリティクス｜概要ページで日付フィルタを使用する
| 商取引｜アナリティクス｜概要ページでパフォーマンス指標をカスタマイズする｜admin-analytics/analytics-overview.spec.js
| 商取引｜アナリティクス｜収益レポートの日付フィルターを使用する｜admin-analytics/analytics-data.spec.js｜マーチャント｜アナリティクス｜収益レポートの日付フィルターを使用する。
| 商取引｜アナリティクス｜収益レポートをCSVでダウンロードする｜admin-analytics/analytics-data.spec.js
| Merchant | Analytics | 受注レポートに高度なフィルタを使用する | admin-analytics/analytics-data.spec.js |｜ 商取引｜分析｜収益レポートをCSVでダウンロードする。
| 商取引｜アナリティクス｜アナリティクス設定｜admin-analytics/analytics-data.spec.js
| Merchant｜Analytics｜ 収益レポートにカスタム日付範囲を設定する｜admin-analytics/analytics-data.spec.js｜管理画面

### Merchant - Products

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | -------------- | ------------------------------ | ------------------------------------------------------------------------- |
| マーチャント｜商品｜全商品を見る｜merchant/product-search.spec.js
| マーチャント｜商品｜商品検索｜merchant/product-search.spec.js
| マーチャント｜商品｜シンプルな商品を追加する｜merchant/product-create-simple.spec.js｜マーチャント｜商品検索｜商品検索.spec.js
| マーチャント｜商品｜可変商品の追加｜merchant/product/add-variable-product/create-variable-product.spec.js｜｜マーチャント｜商品｜可変商品の追加
| Merchant | 商品 | 商品詳細の編集 | merchant/product-edit.spec.js |｜マーチャント | 商品 | 商品詳細の編集
| マーチャント｜商品｜バーチャル商品を追加する｜merchant/product-create-simple.spec.js
| マーチャント｜商品｜商品のCSVインポート｜merchant/product-import-csv.spec.js
| Merchant | 商品 | ダウンロード可能な商品を追加する | merchant/product-create-simple.spec.js | ダウンロード可能な商品を追加する。
| Merchant | 商品 | 商品レビュー一覧を表示する | merchant/product-reviews.spec.js |
| マーチャント｜商品｜全商品のレビューを見る｜merchant/product-reviews.spec.js
| マーチャント｜商品｜商品レビューを編集する｜merchant/product-reviews.spec.js
| マーチャント｜商品｜商品レビューを削除する｜merchant/product-reviews.spec.js
| マーチャント｜商品｜商品の一括編集｜merchant/product-edit.spec.js｜マーチャント｜商品レビューの削除
| マーチャント｜商品｜商品削除｜merchant/product-delete.spec.js
| マーチャント｜商品｜商品画像管理｜merchant/product-images.spec.js
| マーチャント｜商品｜商品の在庫管理｜merchant/product-create-simple.spec.js
| マーチャント｜商品｜商品属性を管理する｜merchant/product-create-simple.spec.js
| マーチャント｜商品｜グローバル属性の管理
| マーチャント｜商品｜アップセルを追加する｜products/product-linked-products.spec.js
| マーチャント｜商品｜クロスセルの追加｜products/product-linked-products.spec.js｜商品リンクの追加
| マーチャント｜マーチャント｜商品（新規）｜新商品体験を無効にする｜merchant/products/block-editor/disable-block-product-editor.spec.js
| Merchant | 商品 (新規) | シンプルな商品を追加する | merchant/products/block-editor/create-simple-product-block-editor.spec.js | 商店｜商品｜商品 (新規) | シンプルな商品を追加する
| マーチャント｜商品（新規）｜シンプル商品の編集｜merchant/products/block-editor/product-edit-block-editor.spec.js
| マーチャント｜商品一覧（新規）｜商品画像の管理｜merchant/products/block-editor/product-images-block-editor.spec.js｜マーチャント
| マーチャント｜商品一覧（新規）｜商品在庫の管理｜merchant/products/block-editor/product-inventory-block-editor.spec.js
| Merchant | 商品 (新規) | 商品属性の管理 | merchant/products/block-editor/product-attributes-block-editor.spec.js |

### Merchant - Orders

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | ---------------------------------------------------------------- | -------------------------------------- |
| マーチャント｜注文｜すべての注文を表示｜マーチャント｜注文状況フィルタ.spec.js
| Merchant | Orders | 新しい注文を追加することができます。
| マーチャント｜注文｜単一注文の表示｜merchant/order-edit.spec.js｜｜マーチャント｜注文状況フィルター
| マーチャント｜注文｜注文ステータスを完了に更新する｜merchant/order-edit.spec.js｜商人
| マーチャント｜注文｜注文ステータスをキャンセルに更新する｜merchant/order-edit.spec.js｜商人
| マーチャント｜注文｜注文の詳細を更新する｜merchant/order-edit.spec.js
| マーチャント｜注文｜カスタマーペイメントページ｜merchant/customer-payment-page.spec.js
| マーチャント｜注文｜注文を払い戻す｜merchant/order-refund.spec.js｜マーチャント｜注文を払い戻す
| マーチャント｜注文｜クーポンを適用する｜merchant/order-coupon.spec.js｜マーチャント｜注文｜クーポンを適用する
| Merchant | 注文 | 複数の商品タイプや税クラスを追加できる複合注文 | merchant/create-order.spec.js | マーチャント/オーダー作成.spec.js
| Merchant | 注文 | 注文を検索する | merchant/order-search.spec.js | マーチャント/注文検索.spec.js
| Merchant | Orders | 注文ステータスによる注文のフィルタリング | merchant/order-status-filter.spec.js | マーチャント/注文ステータスフィルタ.spec.js
| マーチャント｜注文｜注文ステータスの一括変更｜merchant/order-bulk-edit.spec.js｜マーチャント｜注文ステータスの一括変更
| マーチャント｜オーダー｜オーダーメモの追加｜merchant/order-edit.spec.js

### Merchant - Customers

| ユーザータイプ│フローエリア│フロー名│テストファイル
| --------- | --------- | --------------------- | ------------------------------ |
| マーチャント｜顧客｜顧客リストを表示する｜merchant/customer-list.spec.js

### Merchant - Email

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | -------------------------------------------------- | ----------------------------- |
| マーチャント｜Eメール｜新規注文メールの受信と内容確認｜merchant/order-emails.spec.js
| Merchant | Email | キャンセルされた注文メールの受信と内容の確認 | merchant/order-emails.spec.js |
| Merchant | Email | 失敗した注文メールの受信と内容の確認 | merchant/order-emails.spec.js |.
| Merchant｜Eメール｜新しい注文メールを再送する｜ merchant/order-emails.spec.js |.
| Merchant | Eメール | 顧客に請求書/注文の詳細をEメールで送信する | merchant/order-emails.spec.js |.

### Merchant - Plugins

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | ---------------------- | -------------------------------------- |
| Merchant | プラグイン | WooCommerceを更新できる | smoke-tests/update-woocommerce.spec.js |...

### Merchant - My Subscriptions

| ユーザータイプ│フローエリア│フロー名│テストファイル
| --------- | ---------------- | --------------------------------------- | --------------------------------- |
| Merchant | My Subscriptions | WooCommerce.com接続を開始することができます | merchant/settings-woo-com.spec.js |

### Merchant - Pages

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | --------------------- | ---------------------------- |
| マーチャント｜ページ｜新しいページを作成する｜merchant/create-page.spec.js

### Merchant - Posts

| ユーザータイプ｜フローエリア｜フロー名｜テストファイル
| --------- | --------- | --------------------- | ---------------------------- |
| マーチャント｜投稿｜新しい投稿を作成する｜merchant/create-post.spec.js
