---
post_title: Data storage primer
sidebar_label: Data storage
---

# Data storage primer

WordPressやWooCommerce向けに開発する場合、データの性質と永続性を考慮することが重要です。そうすることで、最適な保存方法を決めることができます。ここで簡単な入門知識をご紹介します：

## トランジェント

データが常に存在するとは限らない（つまり、有効期限が切れる）場合は、[transient](https://developer.wordpress.org/apis/handbook/transients/)を使用します。トランジェントとは、キャッシュされたデータを一時的にデータベースに保存するためのシンプルで標準的な方法で、カスタム名と期限を指定します。

## WPキャッシュ

データが永続的だが常に存在するわけではない場合は、[WP Cache](https://developer.wordpress.org/reference/classes/wp_object_cache/) の使用を検討してください。WP Cache関数を使用すると、複雑なクエリ結果など、再生成に計算コストがかかるデータをキャッシュできます。

## wp_optionsテーブル

データが永続的で常に存在する場合は、[wp_optionsテーブル](https://developer.wordpress.org/apis/handbook/options/)を検討してください。Options APIは、WordPressデータベースのwp_optionsテーブルにデータを格納するシンプルで標準化された方法です。

## 投稿の種類

データ型がn個のユニットを持つエンティティである場合、[投稿タイプ](https://developer.wordpress.org/post_type/)を考えてください。投稿タイプは、同じように保存されるコンテンツの「タイプ」ですが、コードやUIでは簡単に区別できます。

## タクソノミ

もしデータがエンティティをソート/分類する手段であれば、[タクソノミー](https://developer.wordpress.org/taxonomy/)を検討してください。タクソノミーは物事をグループ化する方法です。

ログは、[WC_Logger](https://woocommerce.com/wc-apidocs/class-WC_Logger.html) クラスを使ってファイルに書き込む必要があります。これはデバッグのためにイベントやエラーを記録するシンプルで標準的な方法です。

データ保存の最適な方法は、データの性質とアプリケーションでの使用方法によって異なることを忘れないでください。
