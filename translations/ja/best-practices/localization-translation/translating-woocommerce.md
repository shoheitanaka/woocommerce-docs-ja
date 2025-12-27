---
post_title: How to translate WooCommerce
sidebar_label: Translating WooCommerce
---
# WooCommerceの翻訳方法

WooCommerceはすでにいくつかの言語に翻訳されており、箱から出してすぐに翻訳可能です。必要なのはあなたの言語の翻訳ファイルだけです。

翻訳を作成するにはいくつかの方法があり、そのほとんどはWordPress Codexに概説されています。ほとんどの場合、[https://translate.wordpress.org/projects/wp-plugins/woocommerce/](https://translate.wordpress.org/projects/wp-plugins/woocommerce/]のプロジェクトに貢献することができます。

カスタム翻訳を作成するには、[Poedit](https://poedit.net/)の使用を検討してください。

## あなたの言語でワードプレスを設定する

WordPressサイトの言語を設定するには：

1.INLINE_CODE_0__に移動し、`Site Language`を調整する。
2.INLINE_CODE_2__に移動し、`Update Translations`ボタンをクリックします。

これが完了すると、言語ファイルが存在する場合、ショップはあなたのロケールで表示されます。そうでない場合は、言語ファイルを作成する必要があります。

## ローカライゼーションをコアに貢献する

私たちは翻訳への貢献を奨励しています。翻訳された文字列を追加したり、新しい翻訳を開始したい場合は、WordPress.org に登録し、[https://translate.wordpress.org/projects/wp-plugins/woocommerce/](https://translate.wordpress.org/projects/wp-plugins/woocommerce/) に翻訳を投稿して承認を受けてください。

## WooCommerceをあなたの言語に翻訳する

WooCommerceの安定版と開発版の両方が翻訳可能です。WooCommerceをインストールまたはアップデートすると、WordPressは自動的にあなたの言語の100%完全な翻訳を取得します。そのような翻訳が利用できない場合は、手動でダウンロードするか、翻訳を完成させるために貢献し、すべてのユーザーに利益をもたらすことができます。

翻訳が初めての方は、まず[翻訳者ハンドブック](https://make.wordpress.org/polyglots/handbook/tools/glotpress-translate-wordpress-org/)をご覧ください。

### translate.wordpress.orgから翻訳を手動でダウンロードする

[1.translate.wordpress.org](https://translate.wordpress.org/projects/wp-plugins/woocommerce)にアクセスし、リストの中からあなたの言語を探します。
2.タイトルをクリックすると、その言語のセクションに移動します。

    ![wordpress.orgのWooCommerce翻訳ページのスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/2016-02-17-at-09.57.png)

3.INLINE_CODE_0__の見出しをクリックすると、安定版が表示され、ダウンロードできます。

[    選択した言語で利用可能なバージョンのリスト](https://developer.woocommerce.com/wp-content/uploads/2023/12/2016-02-17-at-09.59.png)

4.一番下までスクロールすると、エクスポートのオプションが表示されます。あなたのサイトで使用するために`.mo`ファイルをエクスポートします。

5.このファイルの名前を`woocommerce-YOURLANG.mo`に変更します（例：イギリス英語は`en_GB`）。対応する言語コードは、[https://translate.wordpress.org/projects/wp-plugins/woocommerce/](https://translate.wordpress.org/projects/wp-plugins/woocommerce/]にアクセスし、希望の言語を開くことで確認できます。言語コードは右上に表示されます。

[    プラグインカードと関連言語コードのスクリーンショット](https://developer.woocommerce.com/wp-content/uploads/2023/12/Screenshot-2023-10-17-at-09.44.53.png)

6.INLINE_CODE_0__にアップロードしてください。一度アップロードすれば、この翻訳ファイルを使用することができます。

## カスタム翻訳の作成

WooCommerceにはすべての英語テキストを含む言語ファイル（`.pot`ファイル）が含まれています。この言語ファイルはプラグインフォルダ内の`woocommerce/i18n/languages/`にあります。

## PoEditでカスタム翻訳を作成する

WooCommerceには`.pot`ファイルが付属しており、PoEditにインポートして翻訳することができます。

始めるには

1.PoEditを開き、`Create new translation from POT template`を選択する。
2.INLINE_CODE_1__を選択すると、PoEditにカタログ・プロパティ・ウインドウが表示されます。

    ![screenshot](https://developer.woocommerce.com/wp-content/uploads/2023/12/Screen-Shot-2013-05-09-at-10.16.46.png)

3.名前と詳細を入力して、他の翻訳者にあなたが誰であるか分かるようにし、`OK`をクリックします。
4.INLINE_CODE_1__ファイルを保存します。例えば、GBの翻訳は`woocommerce-en_GB.po`として保存します。これで文字列が一覧表示されます。

    ![screenshot](https://developer.woocommerce.com/wp-content/uploads/2023/12/Screen-Shot-2013-05-09-at-10.20.58.png)

5.文字列を翻訳したら保存する。`.mo`ファイルが自動的に生成されます。
6.INLINE_CODE_1__ファイルを開いて更新し、`Catalog > Update from POT file`に進みます。
7.ファイルを選択すると、それに応じて更新されます。

## 翻訳のアップグレードを安全にする

WooCommerceは他のプラグインと同じように`wp-content/languages/plugins`に翻訳を保存します。しかし、カスタム翻訳を含めたい場合、`wp-content/languages/woocommerce`ディレクトリを使うか、スニペットを使って別の場所に保存されたカスタム翻訳を読み込むことができます：

```php
// Code to be placed in functions.php of your theme or a custom plugin file.
add_filter( 'load_textdomain_mofile', 'load_custom_plugin_translation_file', 10, 2 );

/**
 * Replace 'textdomain' with your plugin's textdomain. e.g. 'woocommerce'.
 * File to be named, for example, yourtranslationfile-en_GB.mo
 * File to be placed, for example, wp-content/languages/textdomain/yourtranslationfile-en_GB.mo
 */
function load_custom_plugin_translation_file( $mofile, $domain ) {
  if ( 'textdomain' === $domain ) {
    $mofile = WP_LANG_DIR . '/textdomain/yourtranslationfile-' . get_locale() . '.mo';
  }

  return $mofile;
}
```

## その他のツール

翻訳に役立つサードパーティ製のツールは他にもいくつかあります。以下のリストはそのうちのいくつかを示しています。

### ロコ翻訳

[Loco Translate](https://wordpress.org/plugins/loco-translate/)は、WordPressの翻訳ファイルをブラウザ内で編集し、自動翻訳サービスと統合します。

### 何を言うんだ？

[WordPressテーマの`.po`ファイルにアクセスすることなく、特定の単語を簡単に翻訳または変更することができます。

### 文字列ロケータ

[String Locator](https://wordpress.org/plugins/string-locator/)は、テーマ、プラグイン、WordPressコア内の素早い検索を可能にし、一致するテキストとその行番号を含むファイルのリストを表示します。

## FAQ

### チェックアウトページの一部の文字列が翻訳されないのはなぜですか？

チェックアウトページで、文字列の一部が翻訳されていないことがあります。例えば、下のスクリーンショットでは、`Local pickup`配送方法、`Cash on delivery`支払い方法、プライバシーポリシーに関するメッセージがロシア語に翻訳されていません：

![翻訳されていない文字列があるチェックアウトページ](https://developer.woocommerce.com/wp-content/uploads/2023/12/not_translated.jpg)

これは通常、WooCommerceを最初にインストールし、デフォルトのサイト言語（英語）を選択し、後でサイト言語を別の言語に変更した場合に発生します。WooCommerceでは、スクリーンショットで翻訳されていない文字列は、最初のWooCommerceインストール後にデータベースに保存されます。そのため、サイトの言語が別の言語に変更された場合、WooCommerceが翻訳可能な文字列を検出する方法はありません。

修正するには、変更する文字列に対応するWooCommerceの設定に移動し、そこで直接翻訳を更新します。例えば、上記の場合の文字列を修正するには、以下のようにする必要があります：

**現地ピックアップ**：

1.  `WooCommerce > Settings > Shipping > Shipping Zones`へ。
2.  ローカルピックアップ "が表示されている配送ゾーンを選択します。
3.  ローカルピックアップ」の設定を開きます。
4.  あなたの翻訳を使用してメソッドの名前を変更します。
5.  設定を保存します。

**代金引換：

1.  `WooCommerce > Settings > Payments`へ。
2.  お支払い方法で「代金引換」を選択してください。
3.  設定を開きます。
4.  翻訳を使用して、メソッドのタイトル、説明、説明の名前を変更します。
5.  設定を保存します。

**プライバシーポリシーメッセージ**：

1.  `WooCommerce > Settings > Accounts & Privacy`へ。
2.  プライバシーポリシー」セクションまでスクロールします。
3.  `Registration privacy policy`と`Checkout privacy policy`の両フィールドをあなたの翻訳で編集します。
4.  設定を保存します。

チェックアウトページに戻り、翻訳が反映されていることを確認してください。

### 必要な文字列を翻訳しましたが、フロントエンドで翻訳された文字列が表示されません。なぜですか？

翻訳された文字列の一部がWooCommerceサイトで期待通りに表示されない場合、最初に確認することは、これらの文字列がソーステキストセクションで単一形と複数形の両方を持っているかどうかです。これを行うには、[https://translate.wordpress.org/projects/wp-plugins/woocommerce/](https://translate.wordpress.org/projects/wp-plugins/woocommerce/]で対応する翻訳を開きます。例えば、[ProductとProductsの翻訳](https://translate.wordpress.org/projects/wp-plugins/woocommerce/stable/de/default/?filters%5Bstatus%5D=either&filters%5Boriginal_id%5D=577764&filters%5Btranslation_id%5D=24210880)。

このスクリーンショットは、Singular翻訳が利用可能であることを示しています：

![このスクリーンショットは、シンギュラーの翻訳が利用可能であることを示しています:](https://developer.woocommerce.com/wp-content/uploads/2023/12/Screenshot-2023-10-17-at-10.10.06.png)

このスクリーンショットは、複数形翻訳が利用できないことを示している：

![このスクリーンショットは複数形の翻訳が利用できないことを示している](https://developer.woocommerce.com/wp-content/uploads/2023/12/Screenshot-2023-10-17-at-10.10.21.png)
