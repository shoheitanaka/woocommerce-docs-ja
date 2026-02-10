---
post_title: WooCommerce extension development best practices
sidebar_label: Best practices
sidebar_position: 3
---
# WooCommerce拡張機能開発のベストプラクティス

WooCommerceを拡張するプラグインを作りたいですか？あなたは正しい場所にいます。

WooCommerce拡張機能は、通常のWordPressプラグインと同じです。詳しくは[プラグインの書き方](https://developer.wordpress.org/plugins/)をご覧ください。

WooCommerceエクステンションが必要です：

- WordPressプラグインのコーディング標準、および[ベストプラクティスガイドライン](https://developer.wordpress.org/plugins/plugin-basics/best-practices/)を遵守し、WordPress内および他のWordPressプラグインと共存する。
- WooCommerceの機能を可能な限り使用すること。
- 悪意のあること、違法なこと、不正なこと、例えば、サービスの一部でない場合、またはサービスの利用規約で明示的に許可されていない場合、サードパーティのシステムを経由してスパムリンクや実行可能コードを挿入するようなことをしないこと。
- コアのマーケットプレイス接続を破壊または上書きしない - 例えば、エクステンションはブランド化されたトップレベルメニュー項目を作成したり、独自の遠隔測定を導入することはできません。
- WooCommerce [互換性と相互運用性のガイドライン](https://woocommerce.com/document/marketplace-overview/#section-9) を遵守すること。

マーチャントは毎日WooCommerceエクステンションを使用しており、WP管理画面やストアに広告が侵入することなく、統一された快適なエクスペリエンスを提供する必要があります。

## ベストプラクティス

1. **WooCommerceがアクティブかどうか確認してください。ほとんどのWooCommerceプラグインはWooCommerceがアクティブでない限り実行する必要はありません。[WooCommerceがアクティブかどうかをチェックする方法はこちら](/docs/extensions/core-concepts/check-if-woo-is-active)を参照してください。
2. **メインのプラグインファイルはプラグインの名前を採用してください**。例えば例えば、`plugin-name`というディレクトリ名のプラグインのメインファイルは`plugin-name.php`という名前になります。
3. **テキスト・ドメインは、プラグイン・ディレクトリ名と一致する必要があります**。例えば例えば、`plugin-name`というディレクトリ名のプラグインは、`plugin-name`というテキスト・ドメインになります。アンダースコアは使用しないでください。 
4. **国際化**：WordPress [開発者のための国際化](https://codex.wordpress.org/I18n_for_WordPress_Developers) のガイドラインに従ってください。
5. **ローカライゼーション**：*Localization**: プラグインのコード内の文字列はすべて英語にしてください。これはWordPressのデフォルトロケールであり、常に英語が第一言語であるべきです。プラグインが特定の市場（スペインやイタリアなど）を対象としている場合は、プラグインパッケージにそれらの言語に対応した適切な翻訳ファイルを含めてください。詳しくは[Makepotを使ってプラグインを翻訳する](https://codex.wordpress.org/I18n_for_WordPress_Developers#Translating_Plugins_and_Themes)をご覧ください。
6. **WordPressのPHPガイドライン**に従ってください。WordPressには、すべてのWordPressコードの一貫性を保ち、読みやすくするための[ガイドラインのセット](http://make.wordpress.org/core/handbook/coding-standards/php/)があります。これには、引用符、インデント、ブレーススタイル、短縮phpタグ、ヨーダ条件、命名規則などが含まれます。ガイドラインをご確認ください。
7. **カスタムデータベーステーブルの作成は避けてください。可能な限り、WordPressの[投稿タイプ](http://codex.wordpress.org/Post_Types#Custom_Post_Types)、[タクソノミ](http://codex.wordpress.org/Taxonomies)、[オプション](http://codex.wordpress.org/Creating_Options_Pages)を使用してください。詳しくは、[データストレージ入門](/docs/best-practices/data-management/data-storage)をご覧ください。
8. *PHPファイルへの直接アクセスを提供しないようにすることで、 **データ漏洩を防ぐ** 。[その方法を見つける](/docs/best-practices/security/prevent-data-leaks)。 
9. **すべてのプラグインには、[WordPress標準のREADME](http://wordpress.org/plugins/about/readme.txt)**が必要です。[WordPressプラグインREADMEファイル標準](https://wordpress.org/plugins/readme.txt)の例を参照してください。
10. **すべてのプラグインには変更ログファイルが必要です。** [changelog.txt documentation](/docs/extensions/core-concepts/changelog-txt) の変更ログファイルの例と異なる変更ログエントリーの種類を参照してください。
11. **プラグインのヘッダーコメントは私たちの規約に従ってください。[WordPressプラグインのヘッダーコメントの例](/docs/extensions/core-concepts/example-header-plugin-comment)を見て、以下のような規約に従ってください：`Author:`、`Author URI:`、`Developer:`、`Developer URI`、`WC requires at least:`および`WC tested up to:`、`Plugin URI:`などです。
12. **プラグインがフロントエンドの出力を作成する場合、ユーザーがテーマのWooCommerceフォルダにカスタムテンプレートファイルを作成してプラグインのテンプレートファイルを上書きできるように、テンプレートエンジンを設置することをお勧めします。詳細については、Pippinの[Writing Extensible Plugins with Actions and Filters](http://code.tutsplus.com/tutorials/writing-extensible-plugins-with-actions-and-filters--wp-26759)の投稿をご覧ください。
13. **外部ライブラリは使わない**。外部ライブラリ全体の使用は、製品をセキュリティの脆弱性にさらす可能性があるため、通常は推奨されません。外部ライブラリがどうしても必要な場合、開発者は使用するコードについて熟考し、その所有権と責任を負うべきです。ライブラリの厳密に必要な部分のみを含めるようにするか、WordPressに適したバージョンを使用するか、独自のバージョンを構築するようにしてください。例えば、TinyMCE のようなテキストエディタを使用する必要がある場合は、WordPress に適したバージョンである TinyMCE Advanced を使用することをお勧めします。
14. **サードパーティのシステムは避けてください：文書化されたサービスからコードを読み込むことは許可されていますが、通信は安全でなければなりません。プラグイン内で外部のコードを実行することはできません。サービスに関係のないJavaScriptやCSSをサードパーティのCDNを使用することは禁止されています。管理ページへの接続にiframeを使用してはいけません。
