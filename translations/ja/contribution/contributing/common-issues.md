---
post_title: Common issues
sidebar_label: Common issues
---
# 共通の問題

このページは、既知の問題、よく遭遇する問題、そしてその解決策や回避策を包括的に文書化することを目的としています。もし、ここに記載されていない問題や、記載すべき問題に遭遇した場合は、遠慮なくリストに追加してください。

`Automattic\Jetpack\Autoloader\AutoloadGenerator` での ## Composer エラー

```bash
[ErrorException]
  Declaration of Automattic\Jetpack\Autoloader\AutoloadGenerator::dump(Composer\Config $config, Composer\Repository\Inst
  alledRepositoryInterface $localRepo, Composer\Package\PackageInterface $mainPackage, Composer\Installer\InstallationMa
  nager $installationManager, $targetDir, $scanPsrPackages = false, $suffix = NULL) should be compatible with Composer\A
  utoload\AutoloadGenerator::dump(Composer\Config $config, Composer\Repository\InstalledRepositoryInterface $localRepo,
  Composer\Package\RootPackageInterface $rootPackage, Composer\Installer\InstallationManager $installationManager, $targ
  etDir, $scanPsrPackages = false, $suffix = '')
```

composer 2.0.7の[変更](https://github.com/composer/composer/commit/b574f10d9d68acfeb8e36cad0b0b25a090140a3b#diff-67d1dfefa9c7b1c7e0b04b07274628d812f82cd82fae635c0aeba643c02e8cd8)により、オートローダーが新しい`AutoloadGenerator`シグネチャと互換性がなくなりました。`composer self-update 2.0.6`を使用して、composer 2.0.6にダウングレードしてみてください。

## VVV: HostsUpdater の vagrant プラグインのエラー

```bash
...vagrant-hostsupdater/HostsUpdater.rb:126:in ``digest': no implicit conversion of nil into String (TypeError)
```

サポートされていないバージョンのVagrantを使用している可能性があります。この記事を書いている時点では、VVVはVagrant 2.2.7で動作します。VVV の [requirements](https://github.com/Varying-Vagrant-Vagrants/VVV#minimum-system-requirements) をご確認ください。

## VVV: `install-wp-tests.sh` エラー

```bash
mysqladmin: CREATE DATABASE failed; error: 'Access denied for user 'wp'@'localhost' to database 'wordpress-one-tests''
```

To fix:

-   MySQLを`sudo mysql`で開く。
-   `GRANT ALL PRIVILEGES ON * . * TO 'wp'@'localhost';`を実行する。`exit;`を入力して終了する。
-   `install-wp-tests.sh`スクリプトをもう一度実行する。

## e2e テスト実行中のタイムアウト / 404 エラー

```bash
 Store owner can complete onboarding wizard › can complete the product types section

    TimeoutError: waiting for function failed: timeout 30000ms exceeded

      1 | export const waitForElementCount = function ( page, domSelector, count ) {
    > 2 | 	return page.waitForFunction(
        | 	            ^
      3 | 		( domSelector, count ) => {
      4 | 			return document.querySelectorAll( domSelector ).length === count;
      5 | 		},
```

e2e テストでタイムアウトや 404 エラーが発生した場合は、 既存のビルドが壊れている可能性がある。`npm install && npm run clean && npm run build`を実行して、新しいビルドを生成してください。npm スクリプトの中には現在のビルドを削除するものもあるので、e2e テストを実行する前に必ずビルドを実行するのがよい習慣です。

## e2eテストを試みたところ、Dockerコンテナがビルドできませんでした。

```bash
Thu Dec  3 11:55:56 +08 2020 - Docker container is still being built
Thu Dec  3 11:56:06 +08 2020 - Docker container is still being built
Thu Dec  3 11:56:16 +08 2020 - Docker container is still being built
Thu Dec  3 11:56:26 +08 2020 - Docker container couldn't be built
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! @woocommerce/e2e-environment@0.1.6 test:e2e: `bash ./bin/wait-for-build.sh && ./bin/e2e-test-integration.js`
npm ERR! Exit status 1
```

Dockerが起動していることを確認する。スクリプトには`Docker container is still being built`と書かれていますが、実際にはDockerの実行を担当しているわけではありません。もし実行されていなければ、`npm run docker:up`を実行してください。

## WooCommerce Paymentsの開発モードを設定する

これを`wp-config.php`に追加する：

```php
define( 'WCPAY_DEV_MODE', true );
```

[この文書](https://woocommerce.com/document/woopayments/testing-and-troubleshooting/test-accounts/)も参照のこと。

## WooCommerce Admin インストールタイムスタンプ

インストールのタイムスタンプ（例えば`NoteTraits`の`wc_admin_active_for()`で使用される）を取得するには、次のSQLを試してください：

```sql
SELECT * FROM wp_options WHERE option_name = 'woocommerce_admin_install_timestamp'
```

## オンボーディングウィザードをリセットする

`woocommerce_onboarding_profile`オプションを削除する：

```sql
DELETE FROM wp_options WHERE option_name = 'woocommerce_onboarding_profile'
```

## コンソールでのトラックデバッグを有効にする

```javascript
localStorage.setItem( 'debug', 'wc-admin:tracks' );
```

で、Chromeのログレベル「verbose」を「checked」に設定する。

## Vagrant (VVV) を使って PHP のユニットテストを実行する

1.Vagrant に SSH でログインする (`vagrant ssh`)
2.`cd /srv/www/<WP_INSTANCE>/public_html/wp-content/plugins/woocommerce-admin` (`AutoloadGenerator`)
3.設定するセットアップ: `bin/install-wp-tests.sh wc-admin-tests root root`
4.高速テスト：`./vendor/bin/phpunit --group fast`
5.すべてのテスト：すべてのテスト： `./vendor/bin/phpunit`

`phpunit`が存在しない場合は、`composer install`が必要かもしれない。
