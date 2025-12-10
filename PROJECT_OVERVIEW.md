# WooCommerce Docs Japanese - プロジェクト概要

このドキュメントは、GitHub上のWooCommerceドキュメントを日本語に翻訳し、WordPressで表示するための完全な自動化システムです。

## 📦 含まれるもの

このパッケージには以下が含まれています:

### 1. GitHub Actions ワークフロー (`.github/workflows/`)
- **sync-docs.yml**: 毎日上流リポジトリをチェックし、変更があればPRを自動作成
- **translate.yml**: DeepL APIを使用して自動翻訳
- **deploy-wordpress.yml**: WordPress REST APIを使用して自動デプロイ

### 2. 自動化スクリプト (`scripts/`)
- **sync-upstream.js**: 上流リポジトリ同期
- **translate.js**: DeepL API最適化翻訳エンジン
- **deploy.js**: WordPressデプロイ
- **cache-manager.js**: 翻訳キャッシュ管理
- **estimate-usage.js**: DeepL API使用量見積もり
- **generate-report.js**: 翻訳レポート生成
- **generate-deploy-report.js**: デプロイレポート生成
- **validate-wp-connection.js**: WordPress接続検証

### 3. WordPressプラグイン (`wordpress-plugin/`)
- **woocommerce-docs-ja.php**: メインプラグインファイル
- **includes/**: PHPクラスファイル
  - **class-wc-docs-ja-version-manager.php**: バージョン管理
  - **class-wc-docs-ja-api-handler.php**: API処理
  - **class-wc-docs-ja-shortcodes.php**: ショートコード機能
- **assets/**: フロントエンド資産
  - **css/style.css**: カスタムスタイル
  - **js/script.js**: インタラクティブなJavaScript機能

### 4. ルートレベルのファイル
- **woocommerce-docs-ja.php**: プラグインメインファイル（ルート）
- **class-version-manager.php**: バージョン管理クラス（ルート）
- **style.css**: スタイルシート（ルート）
- **script.js**: JavaScript（ルート）

### 5. 設定ファイル
- **config/config.json**: プロジェクト全体の設定
- **config/sync-rules.json**: 同期ルール設定
- **.env.example**: 環境変数のテンプレート
- **package.json**: Node.js依存関係
- **composer.json**: PHP依存関係

### 6. ドキュメント
- **README.md**: プロジェクト概要
- **SETUP.md**: 詳細なセットアップガイド
- **USAGE.md**: 使い方ガイド
- **PROJECT_OVERVIEW.md**: このファイル

## 🎯 主要機能

### 1. 完全自動化
- 毎日自動的に上流リポジトリをチェック
- 変更検出時に自動PR作成
- PRマージ後、自動的にWordPressへデプロイ

### 2. DeepL API最適化
- **差分翻訳**: 変更された部分のみ翻訳
- **キャッシュ機能**: 同じ内容は再翻訳しない
- **バッチ処理**: 効率的なAPI呼び出し
- **無料枠最適化**: 月間50万文字を最大限活用

### 3. PRベースのレビューフロー
- 自動翻訳後、PRで内容を確認
- 必要に応じて翻訳を手動修正
- マージ前に品質チェック

### 4. バージョン管理
- Gitタグベースのバージョン管理
- 複数バージョンの同時管理
- WordPress側でバージョン切り替え

### 5. WordPress統合
- REST API経由での自動デプロイ
- 固定ページとして表示
- 自動目次生成
- レスポンシブデザイン

## 📁 ファイル構造

```
woocommerce-docs-ja/
├── .github/
│   └── workflows/              # GitHub Actions
│       ├── sync-docs.yml
│       ├── translate.yml
│       └── deploy-wordpress.yml
├── scripts/                    # 自動化スクリプト
│   ├── sync-upstream.js
│   ├── translate.js
│   ├── deploy.js
│   ├── cache-manager.js
│   ├── estimate-usage.js
│   ├── generate-report.js
│   ├── generate-deploy-report.js
│   └── validate-wp-connection.js
├── config/                     # 設定ファイル
│   ├── config.json
│   └── sync-rules.json
├── translations/               # 翻訳データ
│   ├── cache/                  # キャッシュ
│   │   └── translation-cache.json
│   └── ja/                     # 日本語訳（自動生成）
├── wordpress-plugin/           # WordPressプラグイン
│   ├── woocommerce-docs-ja.php # メインプラグインファイル
│   ├── includes/               # PHPクラス
│   │   ├── class-wc-docs-ja-version-manager.php
│   │   ├── class-wc-docs-ja-api-handler.php
│   │   └── class-wc-docs-ja-shortcodes.php
│   └── assets/                 # フロントエンド資産
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── script.js
├── package.json                # Node.js依存関係
├── composer.json               # PHP依存関係
├── .env.example                # 環境変数テンプレート
├── .gitignore
├── LICENSE
├── README.md
├── SETUP.md
├── USAGE.md
└── PROJECT_OVERVIEW.md
```

## 🚀 クイックスタート

### 必要なもの
- GitHubアカウント
- DeepL API キー（無料）
- WordPressサイト
- Node.js 18以上

### セットアップ手順（概要）

1. **リポジトリのセットアップ**
   ```bash
   git clone https://github.com/YOUR_USERNAME/woocommerce-docs-ja.git
   cd woocommerce-docs-ja
   npm install
   ```

2. **環境変数の設定**
   ```bash
   cp .env.example .env
   # .envファイルを編集
   ```

3. **GitHub Secretsの設定**
   - DEEPL_API_KEY
   - WORDPRESS_URL
   - WORDPRESS_USERNAME
   - WORDPRESS_APP_PASSWORD
   - PAT_TOKEN

4. **WordPressプラグインのインストール**
   - ルートディレクトリの `woocommerce-docs-ja.zip` をWordPressにアップロード
   - または `wordpress-plugin/` ディレクトリをWordPressの `wp-content/plugins/` にコピー

5. **GitHub Actionsの有効化**
   - Actionsタブで手動実行

詳細は **SETUP.md** を参照してください。

## 🔧 技術スタック

### バックエンド
- **Node.js**: スクリプト実行環境
- **PHP**: WordPressプラグイン
- **GitHub Actions**: CI/CD

### API・サービス
- **DeepL API**: 機械翻訳
- **WordPress REST API**: コンテンツ管理
- **GitHub API**: 自動PR作成

### ライブラリ
- **deepl-node**: DeepL公式Node.jsライブラリ
- **axios**: HTTP クライアント
- **marked**: マークダウンパーサー
- **gray-matter**: Frontmatterパーサー
- **simple-git**: Git操作

## 📊 DeepL無料枠の効率的な使用

### 最適化手法

1. **差分翻訳**
   - ファイルの変更部分のみ翻訳
   - 未変更部分はキャッシュを使用

2. **セグメント単位のキャッシュ**
   - 段落単位でキャッシュ
   - 部分的な変更でも再利用可能

3. **コンテンツ保護**
   - コードブロックは翻訳対象外
   - URLは自動保護
   - 技術用語の保持

4. **バッチ処理**
   - 複数セグメントを一度に処理
   - API呼び出し回数を削減

### 使用量見積もり

WooCommerceの全ドキュメント（約100ファイル）を翻訳する場合:
- 初回翻訳: 約200,000文字（無料枠の40%）
- 更新翻訳: 平均5,000-10,000文字/月（無料枠の1-2%）

## 🔐 セキュリティ

### 機密情報の管理
- GitHub Secretsで環境変数を暗号化
- `.env`ファイルは`.gitignore`に含まれる
- WordPressアプリケーションパスワードを使用

### 権限の最小化
- GitHub: 必要最小限のスコープのみ
- WordPress: Editorまたはよ限定

## 📈 モニタリング

### 自動レポート
- 翻訳完了時にPRにコメント
- デプロイ完了時にSlack通知（オプション）
- GitHub Actions サマリー

### 手動確認
```bash
# DeepL使用量見積もり
npm run cache:stats

# キャッシュ統計
npm run cache:stats

# WordPress接続テスト
node scripts/validate-wp-connection.js
```

## 🤝 コントリビューション

このプロジェクトへの貢献を歓迎します！

1. Issueで問題や提案を報告
2. Forkしてプルリクエスト
3. ドキュメントの改善

## 📝 ライセンス

MIT License

## 🔗 関連リンク

- [WooCommerce公式ドキュメント](https://github.com/woocommerce/woocommerce/tree/trunk/docs)
- [DeepL API](https://www.deepl.com/docs-api)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [GitHub Actions](https://docs.github.com/actions)

## 💬 サポート

- GitHub Issues: バグ報告・機能要望
- Discussions: 質問・ディスカッション

---

**始める準備はできましたか？**

1. まず [SETUP.md](SETUP.md) を読んでセットアップ
2. 次に [USAGE.md](USAGE.md) で使い方を学習
3. 問題があれば Issueを作成

Happy Translating! 🌐✨
