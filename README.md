# WooCommerce Documentation Japanese Translation

WooCommerceの公式ドキュメントを日本語に翻訳し、WordPressサイトで表示するための自動化システムです。

## 🚀 機能

- ✅ GitHub Actionsによる自動同期
- ✅ PRベースの翻訳レビューフロー
- ✅ DeepL API無料枠の最適化（差分翻訳・キャッシュ機能）
- ✅ バージョン管理対応
- ✅ WordPress固定ページへの自動デプロイ

## 📁 ディレクトリ構成

```
.
├── .github/
│   └── workflows/          # GitHub Actions ワークフロー
│       ├── sync-docs.yml           # 上流ドキュメント同期
│       ├── translate.yml           # 翻訳処理
│       └── deploy-wordpress.yml    # WordPress デプロイ
├── scripts/                # 自動化スクリプト
│   ├── sync-upstream.js            # 上流リポジトリ同期
│   ├── translate.js                # 翻訳実行
│   ├── deploy.js                   # WordPressデプロイ
│   └── cache-manager.js            # キャッシュ管理
├── translations/           # 翻訳データ
│   ├── cache/                      # 翻訳キャッシュ（APIコール削減）
│   │   └── hash-map.json          # ファイルハッシュマップ
│   ├── ja/                         # 日本語訳ファイル
│   └── versions/                   # バージョン管理
├── wordpress-plugin/       # WordPress プラグイン
│   ├── woocommerce-docs-ja.php    # メインプラグインファイル
│   ├── includes/                   # PHP クラス
│   └── assets/                     # CSS/JS
├── config/                 # 設定ファイル
│   ├── config.json                 # 全体設定
│   └── sync-rules.json            # 同期ルール
├── package.json            # Node.js 依存関係
├── composer.json           # PHP 依存関係
└── .env.example            # 環境変数サンプル
```

## 🔧 セットアップ

### 1. リポジトリのクローンとインストール

```bash
git clone https://github.com/YOUR_USERNAME/woocommerce-docs-ja.git
cd woocommerce-docs-ja
npm install
composer install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーして、必要な値を設定：

```bash
cp .env.example .env
```

### 3. GitHub Secretsの設定

以下のSecretをGitHubリポジトリに設定：

- `DEEPL_API_KEY`: DeepL API キー
- `WORDPRESS_URL`: WordPressサイトのURL
- `WORDPRESS_USERNAME`: WordPress管理者ユーザー名
- `WORDPRESS_APP_PASSWORD`: WordPressアプリケーションパスワード
- `PAT_TOKEN`: GitHub Personal Access Token (PR作成用)

### 4. WordPressプラグインのインストール

`wordpress-plugin/` ディレクトリをWordPressの `wp-content/plugins/` にアップロードし、有効化します。

## 🔄 ワークフロー

### 自動同期（毎日実行）

1. **sync-docs.yml**: 上流リポジトリをチェック
2. 差分があれば自動的にPR作成
3. PR内で翻訳をレビュー
4. マージ後、自動的にWordPressへデプロイ

### 手動実行

```bash
# 上流リポジトリの同期
npm run sync

# 翻訳実行
npm run translate

# WordPressへデプロイ
npm run deploy
```

## 💡 DeepL API最適化

### 無料枠の制限
- 月間50万文字まで

### 最適化手法
1. **差分翻訳**: 変更された部分のみ翻訳
2. **キャッシュ機能**: 同じ文章は再翻訳しない
3. **バッチ処理**: 複数ファイルをまとめて処理
4. **段落単位の翻訳**: ファイル全体ではなく変更段落のみ

## 📊 バージョン管理

- 上流のGitタグに基づいて自動バージョニング
- `translations/versions/` にバージョンごとの翻訳を保存
- WordPress側で任意のバージョンを表示可能

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

MIT License

## 🔗 リンク

- [WooCommerce 公式ドキュメント](https://github.com/woocommerce/woocommerce/tree/trunk/docs)
- [DeepL API ドキュメント](https://www.deepl.com/docs-api)
