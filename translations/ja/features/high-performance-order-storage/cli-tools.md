---
post_title: HPOS CLI Tools
---

# HPOS CLI Tools

## Overview

We have a number of [WP-CLI commands](https://developer.woocommerce.com/docs/category/wc-cli/) that can be used to manage HPOS-related functionality, all of which live under the `wp wc hpos` namespace (though you may come across blog posts and older documentation referencing the now-deprecated `wp wc cot` namespace).

以下の表は、各コマンドが何をするのかの概要であり、詳細と例は以下にある。

Keep in mind that the commands themselves have documentation and examples that can be accessed via WP-CLI's help by passing the `--help` flag.

|Command|Use this command to...|
|----|-----|
|`wc hpos status`|Get an overview of all HPOS matters on your site.|
|`wc hpos enable`|Enable HPOS (and possibly compatibility mode).|
|`wc hpos disable`|Disable HPOS (and possibly compatibility mode).|
|`wc hpos count_unmigrated`|Get a count of all orders pending sync.|
|`wc hpos sync`|Performantly sync orders from the currently active order storage to the other.|
|`wc hpos verify_data`|Verify data between datastores.|
|`wc hpos diff`|Get an user friendly version of the differences for an order between both order storages.|
|`wc hpos backfill`|Copy over whole orders or specific bits of order data from any order storage to the other.|
|`wc hpos cleanup`|Remove order data from legacy tables.|

## Usage and examples

### `wc hpos status`

HPOSの設定とステータスの概要を得るために使用します。このコマンドは、HPOSと互換モードが有効になっているかどうか、また、同期を保留しているオーダーやクリーンアップの対象になっているオーダーなどの有用な情報を出力します。

**Note:** Remember that, if desired, orders pending sync can be synced using [`wc hpos sync`](#wc-hpos-sync) and, similarly, you can perform a cleanup on those subject to cleanup (provided compatibility mode is disabled) by running [`wc hpos cleanup all`](#wc-hpos-cleanup).


#### Example 1 - HPOS status output

```plaintext
$ wp wc hpos status
HPOS enabled?: yes
Compatibility mode enabled?: no
Unsynced orders: 651
Orders subject to cleanup: 348
```

### `wc hpos enable`

コマンドラインからHPOSと互換モード（必要な場合）を有効にするには、このコマンドを使用する。

#### Example 1 - Enable HPOS via CLI

Enables HPOS and compatibility mode too (`--with-sync` flag).

```plaintext
$ wp wc hpos enable --with-sync
Running pre-enable checks...
Success: Sync enabled.
Success: HPOS enabled.
```

### `wc hpos disable`

前のコマンドと同様に、このコマンドはHPOSを無効にするために使われる。

#### Example 1 - Attempt to disable HPOS (with orders pending sync)

If there are any orders pending sync, you won't be allowed to disable HPOS until those orders have been synced (via `wp wc hpos sync`).

```plaintext
$ wp wc hpos disable
Running pre-disable checks...
Error: [Failed] There are orders pending sync. Please run `wp wc hpos sync` to sync pending orders.
```

#### Example 2 - Disable HPOS

```plaintext
$ wp wc hpos disable
Running pre-disable checks...
Success: HPOS disabled.
```

### `wc hpos count_unmigrated`

同期中の注文の数を表示します。

#### Example 1 - Obtain number of orders pending sync

```plaintext
$ wp wc hpos count_unmigrated
There are 651 orders to be synced.
```

### `wc hpos sync`

このコマンドは、WC &gt; Settings &gt; Advanced &gt; Features の現在の設定に基づき、注文をポスト・オーダー・ストレージからHPOS（またはその逆）に移行するために使用することができます。
つまり、現在選択されているデータストアからもう一方のデータストアに注文を同期します。

設定で互換モードを有効にすれば、最終的にはすべてのオーダーが移行されるが、このコマンドを使えば、より効率的に移行できる。

If you need more control over which datastore to use as source (or destination) regardless of settings, or want to migrate just a few orders or properties, use [`wp wc hpos backfill`](#wc-hpos-backfill) instead.

#### Example 1 - Sync all orders

```plaintext
$ wp wc hpos sync
There are 999 orders to be synced.
Order Data Sync  100% [============================================================================================] 0:08 / 0:08
Sync completed.
Success: 999 orders were synced in 14 seconds.
```

### `wc hpos verify_data`

このコマンドを使用して、レガシー（投稿）データストアとHPOSの両方の注文データが同期されていることを確認します。これは "互換モード "を有効にしていて、注文が通常のWooCommerceフロー以外で変更された可能性がある場合にのみ関係します。

This command operates on all orders. For a user friendlier alternative that operates on individual orders, refer to [`wp wc hpos diff`](#wc-hpos-diff).

#### Example 1 - Verify data on a migrated site

すべてのオーダーはデータストア間で同一である。

```plaintext
$ wp wc hpos verify_data
Order Data Verification  100% [====================================================================================] 0:00 / 0:00
Verification completed.
Success: 999 orders were verified in 0 seconds.
```

#### Example 2 - Verification failures

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

#### Example 3 - Re-migrate during verification

The verification command also admits a `--re-migrate` flag that will attempt to sync orders that have differences. This could effectively overwrite an order in the database, so use with care.

```plaintext
$ wp wc hpos verify_data --re-migrate
Order Data Verification  100% [====================================================================================] 0:00 / 0:00
Verification completed.
Success: 999 orders were verified in 0 seconds.
```

### `wc hpos diff`

If you have enabled compatibility mode or migrated orders using `wp wc hpos sync`, all of your orders should be in an identical state in both datastores (the legacy one and HPOS), but errors can happen. Also, manually modifying orders in the database or use of HPOS-incompatible plugins can result in orders deviating.

The `wp wc hpos diff`  tool can be used to look into those (possible) differences, which can be useful to determine whether re-migrating to/from either datastore should be done, or a more careful approach needs to be taken.

The tool itself doesn't reconcile the differences. For that you should use [`wp wc hpos backfill`](#wc-hpos-backfill).

#### Example 1 - No difference between orders

順序は両方のデータストア（レガシーとHPOS）で同じです。

```plaintext
$ wp wc hpos diff 100087
Success: No differences found.
```

#### Example 2 - Mismatch in order properties between datastores

This examples shows that order `100126`  differs in various fields between both datastores. For example, its HPOS version has status `completed` while the post is still in `pending` status. Similarly, there are differences in other fields and there's even some metadata (`post_only_meta`) that only exists in the post/legacy version.

記載されていないその他のオーダーフィールドやメタデータは、両方のオーダーバージョンで同じであると理解される。

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

#### Example 3 - JSON output

You can also get the output in various formats (`json`, `csv` or `list` -the default-), which can be useful for exporting differences from various orders to a file.

```plaintext
$ wp wc hpos diff 100126 --format=json
Warning: Differences found for order 100126:
[{"property":"status","hpos":"completed","post":"pending"},{"property":"total","hpos":"567.25","post":"267.25"},{"property":"date_modified","hpos":"2024-04-04T15:32:27+00:00","post":"2024-04-04T19:00:26+00:00"},{"property":"billing_first_name","hpos":"Hans","post":"Jans"},{"property":"post_only_meta","hpos":"","post":"why not?"}]
```

### `wc hpos backfill`

backfill コマンドは、レガシー・データストアまたは HPOS データストアのどちらか一方から、注文データ（または注文全体）をもう一方のデータストアに選択的に移行するために使用できます。同期や移行の失敗を調整するのに非常に便利です。

このコマンドの正確な構文は以下の通り：

```plaintext
wp wc hpos backfill <order_id> --from=<datastore> --to=<datastore> [--meta_keys=<meta_keys>] [--props=<props>]
```

You have to specify which datastore to use as source (either `posts` or `hpos`) and which one to use as destination. The `--meta_keys` and `--props` arguments receive a comma separated list of meta keys and order properties, which can be used to move only certain data from one datastore to the other, instead of the whole order.

Note that `wp wc hpos backfill` differs from `wp wc hpos sync` in various ways:

- You can specify which order to operate on, which gives you more control for one-off operations.
- It lets you move order data between datastores irrespective of what the current order storage is in WC settings. In contrast, `wp wc hpos sync` will only sync data from the current datastore to the other.
- In addition to letting you migrate full orders, it lets you choose which bits of data (order fields or metadata) to migrate.

#### Example 1 - Migrate a full order from HPOS to posts

```plaintext
$ wp wc hpos backfill 99709
Success: Order 99709 backfilled from hpos to posts.
```

#### Example 2 - Migrate metadata

前のセクションの例2の続きで、メタデータの1つのキーだけを投稿からHPOSに移行する方法を見ることができる。

```plaintext
$ wp wc hpos backfill 100126 --from=posts --to=hpos --meta_keys=post_only_meta
Success: Order 100126 backfilled from posts to hpos.
```

If you now run `wp wc hpos diff` on this order, you can see that the bit of metadata is no longer listed as a difference.

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

#### Example 3

Also following the previous example, we can now reconcile all the data as we see fit. For example, we can migrate the status from posts to HPOS and the other bits of info in the other direction.
In the end, the orders will be identical, as can be confirmed through `wp wc hpos diff`.

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

### `wc hpos cleanup`

HPOSが有効で互換モードが無効の場合、cleanupコマンドを使用してレガシー・テーブルからオーダー・データを削除することができる。

Given this is a destructive operation, the tool won't do anything by default. You'll have to specify an order ID, a range of order IDs or `all` to operate on all orders.

The tool will also verify orders before removal, stopping if the post version seems more recent than the HPOS one. This allows closer inspection of those differences (for example, with `wp wc hpos diff`) and reconciling the data (with [`wp wc hpos backfill`](#wc-hpos-backfill)) before the deletion is executed.

**Note:** This command won't remove placeholder records (posts with type `shop_order_placehold`) from the posts table. We're working on allowing this in the near future, but for now leave placeholders so that datastores can be switched if necessary. Metadata is removed, which is where most data is stored in the legacy order storage, so the remaining placeholder post is very lightweight.

#### Example 1 - Error during cleanup

投稿データストア上で、より新しいと思われるオーダーのクリーンアップは、デフォルトでは阻止される。

```plaintext
$ wp wc hpos cleanup 100126
Starting cleanup for 1 order...
Warning: An error occurred while cleaning up order 100126: Data in posts table appears to be more recent than in HPOS tables.
```

You can investigate the differences with `wp wc hpos diff`:

```plaintext
$ wp wc hpos diff 100126
Warning: Differences found for order 100126:
+---------------+---------------------------+---------------------------+
| property      | hpos                      | post                      |
+---------------+---------------------------+---------------------------+
| date_modified | 2024-04-05T15:19:56+00:00 | 2024-04-05T16:39:26+00:00 |
+---------------+---------------------------+---------------------------+
```

If reconciling is not necessary, the `--force` flag can be used to skip the verification checks:

```plaintext
$ wp wc hpos cleanup 100126 --force
Starting cleanup for 1 order...
HPOS cleanup  100% [=====================================================================================================================] 0:00 / 0:00
Success: Cleanup completed for 1 order.
```

#### Example 2 - Cleaning up a range of order IDs

```plaintext
$ wp wc hpos cleanup 90000-100000
Starting cleanup for 865 orders...
HPOS cleanup  100% [=====================================================================================================================] 0:01 / 0:12
Success: Cleanup completed for 865 orders.
```

#### Example 3 -Cleaning up all orders

```plaintext
$ wp wc hpos cleanup all
Starting cleanup for 999 orders...
HPOS cleanup  100% [=====================================================================================================================] 0:01 / 0:05
Success: Cleanup completed for 999 orders.
```

