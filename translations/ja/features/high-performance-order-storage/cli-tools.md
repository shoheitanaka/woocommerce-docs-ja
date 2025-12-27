---
post_title: HPOS CLI Tools
---

# HPOS CLI Tools

## 概要

HPOS関連の機能を管理するために使用できる[WP-CLIコマンド](https://developer.woocommerce.com/docs/category/wc-cli/)がいくつかありますが、これらはすべて`wp wc hpos`名前空間の下にあります(ただし、現在では廃止された`wp wc cot`名前空間を参照するブログ記事や古いドキュメントを見かけるかもしれません)。

以下の表は、各コマンドが何をするのかの概要であり、詳細と例は以下にある。

WP-CLIのヘルプで`--help`フラグを渡すと、コマンド自体にドキュメントとサンプルがあることを覚えておいてください。

|コマンド|このコマンドを使って...
|----|-----|
|`wc hpos status`|HPOSの概要を表示する。
|`wc hpos enable`|HPOSを有効にする（場合によっては互換モードも）。
|`wc hpos disable`|HPOSを無効にする(場合によっては互換モードも)。
|`wc hpos count_unmigrated`|同期待ちの注文数を取得する。
|`wc hpos sync`|現在アクティブな注文ストレージから他の注文ストレージに注文を同期させる。
|`wc hpos verify_data`|データストア間でデータを検証する。
|`wc hpos diff`|両方のオーダーストレージ間のオーダーの差分をユーザーフレンドリーなバージョンで取得する。
|`wc hpos backfill`|注文全体または注文データの特定のビットを、いずれかの注文ストレージからもう一方のストレージにコピーする。
|`wc hpos cleanup`|レガシーテーブルから注文データを削除する。

## 使い方と例

### `wc hpos status`。

HPOSの設定とステータスの概要を得るために使用します。このコマンドは、HPOSと互換モードが有効になっているかどうか、また、同期を保留しているオーダーやクリーンアップの対象になっているオーダーなどの有用な情報を出力します。

**同様に、[`wc hpos cleanup all`](#wc-hpos-cleanup) を実行することで、クリーンアップの対象となる注文のクリーンアップを実行できます (互換モードが無効になっている場合)。

#### 例 1 - HPOS ステータス出力

```plaintext
$ wp wc hpos status
HPOS enabled?: yes
Compatibility mode enabled?: no
Unsynced orders: 651
Orders subject to cleanup: 348
```

### `wc hpos enable`。

コマンドラインからHPOSと互換モード（必要な場合）を有効にするには、このコマンドを使用する。

#### 例 1 - CLI で HPOS を有効にする

HPOSと互換モードも有効にする（`--with-sync`フラグ）。

```plaintext
$ wp wc hpos enable --with-sync
Running pre-enable checks...
Success: Sync enabled.
Success: HPOS enabled.
```

### `wc hpos disable`。

前のコマンドと同様に、このコマンドはHPOSを無効にするために使われる。

#### 例 1 - HPOS を無効にしようとする（注文が同期待ちの状態）

同期待ちの注文がある場合、それらの注文が同期されるまで HPOS を無効にすることはできません（`wp wc hpos sync` 経由）。

```plaintext
$ wp wc hpos disable
Running pre-disable checks...
Error: [Failed] There are orders pending sync. Please run `wp wc hpos sync` to sync pending orders.
```

#### 例2 - HPOSを無効にする

```plaintext
$ wp wc hpos disable
Running pre-disable checks...
Success: HPOS disabled.
```

### `wc hpos count_unmigrated`。

同期中の注文の数を表示します。

#### 例 1 - 同期中の注文数を取得する

```plaintext
$ wp wc hpos count_unmigrated
There are 651 orders to be synced.
```

### `wc hpos sync`。

このコマンドは、WC > Settings > Advanced > Features の現在の設定に基づき、注文をポスト・オーダー・ストレージからHPOS（またはその逆）に移行するために使用することができます。
つまり、現在選択されているデータストアからもう一方のデータストアに注文を同期します。

設定で互換モードを有効にすれば、最終的にはすべてのオーダーが移行されるが、このコマンドを使えば、より効率的に移行できる。

設定に関係なく、どのデータストアをソース(またはデスティネーション)として使用するかをよりコントロールする必要がある場合、または、少数のオーダーやプロパティだけを移行したい場合は、代わりに[`wp wc hpos backfill`](#wc-hpos-backfill)を使用してください。

#### 例 1 - すべての注文を同期する

```plaintext
$ wp wc hpos sync
There are 999 orders to be synced.
Order Data Sync  100% [============================================================================================] 0:08 / 0:08
Sync completed.
Success: 999 orders were synced in 14 seconds.
```

### `wc hpos verify_data`。

このコマンドを使用して、レガシー（投稿）データストアとHPOSの両方の注文データが同期されていることを確認します。これは "互換モード "を有効にしていて、注文が通常のWooCommerceフロー以外で変更された可能性がある場合にのみ関係します。

このコマンドは全てのオーダーに対して実行されます。個々のオーダーに対して操作する、ユーザーフレンドリーな代替コマンドについては、 [`wp wc hpos diff`](#wc-hpos-diff) を参照してください。

#### 例 1 - 移行したサイトのデータを検証する

すべてのオーダーはデータストア間で同一である。

```plaintext
$ wp wc hpos verify_data
Order Data Verification  100% [====================================================================================] 0:00 / 0:00
Verification completed.
Success: 999 orders were verified in 0 seconds.
```

#### 例2 - 検証の失敗

注文合計、税金、変更日、請求情報が異なるため、注文（ID 100126）の確認に失敗しました。

```plaintext
$ wp wc hpos verify_data
Order Data Verification  100% [====================================================================================] 0:00 / 0:00
Verification completed.
Error: 999 orders were verified in 0 seconds. 1 error found: {
    "100126": [
        {
            "column": "post_modified_gmt",
            "original_value": "2024-04-04 15:32:27",
            "new_value": "2024-04-05 15:19:56"
        },
        {
            "column": "_order_tax",
            "original_value": "74",
            "new_value": "0"
        },
        {
            "column": "_order_total",
            "original_value": "567.25",
            "new_value": "0"
        },
        {
            "order_id": 100126,
            "meta_key": "_billing_address_index",
            "orig_meta_values": [
                "Hans Howell Moore Ltd 325 Ross Drive  Wilfridhaven WA 23322 NF heidi.koch@example.net +17269674166"
            ],
            "new_meta_values": [
                "Hans X Howell Moore Ltd 325 Ross Drive  Wilfridhaven WA 23322 NF heidi.koch@example.net +17269674166"
            ]
        }
    ]
}. Please review the error above.
```

#### 例 3 - 検証中の再移行

検証コマンドは、`--re-migrate`フラグも認めており、相違のある注文の同期を試みます。これは事実上データベース内の注文を上書きする可能性があるため、使用には注意が必要です。

```plaintext
$ wp wc hpos verify_data --re-migrate
Order Data Verification  100% [====================================================================================] 0:00 / 0:00
Verification completed.
Success: 999 orders were verified in 0 seconds.
```

### `wc hpos diff`。

互換モードを有効にしている場合、または `wp wc hpos sync` を使用して注文を移行している場合、すべての注文は両方のデータストア（レガシーと HPOS）で同じ状態になっているはずですが、エラーが発生することがあります。また、データベース内の注文を手動で修正したり、HPOSと互換性のないプラグインを使用したりすると、注文がずれることがあります。

`wp wc hpos diff`ツールを使えば、これらの（可能性のある）相違点を調べることができ、どちらかのデータストアとの間で再マイグレーションを行うべきか、より慎重なアプローチが必要かを判断するのに役立つ。

このツール自体は差分を調整しません。そのためには、[`wp wc hpos backfill`](#wc-hpos-backfill)を使うべきです。

#### 例1 - 注文に違いはない

順序は両方のデータストア（レガシーとHPOS）で同じです。

```plaintext
$ wp wc hpos diff 100087
Success: No differences found.
```

#### 例 2 - データストア間の順序プロパティの不一致

この例では、`100126`という順番が、両データストア間でさまざまなフィールドで異なっていることがわかる。例えば、HPOSバージョンのステータスは`completed`ですが、ポストのステータスはまだ`pending`です。同様に、他のフィールドにも違いがあり、ポスト/レガシー版にしか存在しないメタデータ（`post_only_meta`）もある。

記載されていないその他の注文フィールドやメタデータは、両方の注文バージョンで同じであると理解される。

```plaintext
$ wp wc hpos diff 100126
Warning: Differences found for order 100126:
+--------------------+---------------------------+---------------------------+
| property           | hpos                      | post                      |
+--------------------+---------------------------+---------------------------+
| status             | completed                 | pending                   |
| total              | 567.25                    | 267.25                    |
| date_modified      | 2024-04-04T15:32:27+00:00 | 2024-04-04T19:00:26+00:00 |
| billing_first_name | Hans                      | Jans                      |
| post_only_meta     |                           | why not?                  |
+--------------------+---------------------------+---------------------------+
```

#### 例3 - JSON出力

また、様々なフォーマット（`json`、`csv`、`list` -デフォルト-）で出力を得ることができ、様々なオーダーからの差分をファイルにエクスポートするのに便利です。

```plaintext
$ wp wc hpos diff 100126 --format=json
Warning: Differences found for order 100126:
[{"property":"status","hpos":"completed","post":"pending"},{"property":"total","hpos":"567.25","post":"267.25"},{"property":"date_modified","hpos":"2024-04-04T15:32:27+00:00","post":"2024-04-04T19:00:26+00:00"},{"property":"billing_first_name","hpos":"Hans","post":"Jans"},{"property":"post_only_meta","hpos":"","post":"why not?"}]
```

### `wc hpos backfill`。

backfill コマンドは、レガシー・データストアまたは HPOS データストアのどちらか一方から、注文データ（または注文全体）をもう一方に選択的に移行するために使用できます。同期や移行の失敗を調整するのに非常に便利です。

このコマンドの正確な構文は以下の通り：

```plaintext
wp wc hpos backfill <order_id> --from=<datastore> --to=<datastore> [--meta_keys=<meta_keys>] [--props=<props>]
```

ソースとして使用するデータストア（`posts`または`hpos`）と、デスティネーションとして使用するデータストアを指定する必要があります。`--meta_keys`と`--props`の引数には、メタ・キーとオーダー・プロパティをカンマ区切りで指定します。

`wp wc hpos backfill`と`wp wc hpos sync`はさまざまな点で異なることに注意：

- どのオーダーを操作するかを指定できるので、単発的な操作のコントロールが容易になります。
- WCの設定で現在のオーダー・ストレージが何であるかに関係なく、データストア間でオーダー・データを移動させることができます。これとは対照的に、`wp wc hpos sync`は現在のデータストアから他のデータストアにデータを同期するだけです。
- __INLINE_CODE_0__は、現在のデータストアから他のデータストアにのみデータを同期します。完全なオーダーの移行に加えて、移行するデータ（オーダーフィールドまたはメタデータ）を選択することができます。

#### 例 1 - HPOS からポストへのフルオーダーの移行

```plaintext
$ wp wc hpos backfill 99709
Success: Order 99709 backfilled from hpos to posts.
```

#### 例 2 - メタデータの移行

前のセクションの例2の続きで、メタデータの1つのキーだけを投稿からHPOSに移行する方法を見ることができる。

```plaintext
$ wp wc hpos backfill 100126 --from=posts --to=hpos --meta_keys=post_only_meta
Success: Order 100126 backfilled from posts to hpos.
```

このオーダーで`wp wc hpos diff`を実行すると、メタデータのビットが差分としてリストされなくなったことがわかる。

```plaintext
$ wp wc hpos diff 100126
Warning: Differences found for order 100126:
+--------------------+---------------------------+---------------------------+
| property           | hpos                      | post                      |
+--------------------+---------------------------+---------------------------+
| status             | completed                 | pending                   |
| total              | 567.25                    | 267.25                    |
| date_modified      | 2024-04-04T15:32:27+00:00 | 2024-04-04T19:00:26+00:00 |
| billing_first_name | Hans                      | Jans                      |
+--------------------+---------------------------+---------------------------+
```

#### 例3

また、前の例に従って、すべてのデータを調整することができる。例えば、ステータスをポストからHPOSに移行し、他の情報を他の方向に移行することができる。
最終的には、`wp wc hpos diff`で確認できるように、オーダーは同一になる。

1.注文ステータスを投稿からHPOSに同期する。これは、注文が両方のデータストアで「保留中」になることを意味します。

   ```plaintext
   $ wp wc hpos backfill 100126 --from=posts --to=hpos --props=status
   Success: Order 100126 backfilled from posts to hpos.
   ```

2.HPOSから他のプロパティを投稿に同期させる。

   ```plaintext
   $ wp wc hpos backfill 100126 --from=hpos --to=posts --props=total,date_modified,billing_first_name
   Success: Order 100126 backfilled from hpos to posts.
   ```

3.まだ同期していないのか？

   ```plaintext
   $ wp wc hpos diff 100126
   Success: No differences found.
   ```

### `wc hpos cleanup`。

HPOSが有効で互換モードが無効の場合、cleanupコマンドを使用してレガシー・テーブルからオーダー・データを削除することができる。

これは破壊的な操作であるため、ツールはデフォルトでは何もしない。すべての注文を操作するには、注文ID、注文IDの範囲、または`all`を指定する必要があります。

また、このツールは、削除する前に注文を検証し、投稿のバージョンがHPOSのものよりも新しいようであれば停止します。これにより、削除が実行される前に、(例えば `wp wc hpos diff` を使って) 違いを詳しく調べたり、[`wp wc hpos backfill`](#wc-hpos-backfill) を使ってデータを調整したりすることができます。

**注意:** このコマンドはpostsテーブルからプレースホルダレコード（`shop_order_placehold`型の投稿）を削除しません。近い将来これを可能にする予定ですが、今のところ、必要に応じてデータストアを切り替えられるようにプレースホルダを残しておきます。メタデータは削除され、レガシー・オーダー・ストレージにほとんどのデータが保存されているため、残りのプレースホルダ投稿は非常に軽量になります。

#### 例 1 - クリーンアップ中のエラー

投稿データストア上で、より新しいと思われるオーダーをクリーンアップすることは、デフォルトでは阻止されている。

```plaintext
$ wp wc hpos cleanup 100126
Starting cleanup for 1 order...
Warning: An error occurred while cleaning up order 100126: Data in posts table appears to be more recent than in HPOS tables.
```

`wp wc hpos diff`で違いを調べることができる：

```plaintext
$ wp wc hpos diff 100126
Warning: Differences found for order 100126:
+---------------+---------------------------+---------------------------+
| property      | hpos                      | post                      |
+---------------+---------------------------+---------------------------+
| date_modified | 2024-04-05T15:19:56+00:00 | 2024-04-05T16:39:26+00:00 |
+---------------+---------------------------+---------------------------+
```

リコンサイルが不要な場合は、`--force`フラグを使用して検証チェックをスキップすることができる：

```plaintext
$ wp wc hpos cleanup 100126 --force
Starting cleanup for 1 order...
HPOS cleanup  100% [=====================================================================================================================] 0:00 / 0:00
Success: Cleanup completed for 1 order.
```

#### 例2 - オーダーIDの範囲をクリーンアップする

```plaintext
$ wp wc hpos cleanup 90000-100000
Starting cleanup for 865 orders...
HPOS cleanup  100% [=====================================================================================================================] 0:01 / 0:12
Success: Cleanup completed for 865 orders.
```

#### 例3：すべての注文を片付ける

```plaintext
$ wp wc hpos cleanup all
Starting cleanup for 999 orders...
HPOS cleanup  100% [=====================================================================================================================] 0:01 / 0:05
Success: Cleanup completed for 999 orders.
```

