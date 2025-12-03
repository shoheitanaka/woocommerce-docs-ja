# セットアップガイド

このガイドでは、WooCommerce Docs Japanese翻訳システムの初期セットアップ手順を説明します。

## 📋 前提条件

### 必要なもの

1. **GitHubアカウント**
   - Personal Access Token（PAT）の作成権限

2. **DeepL APIアカウント**
   - 無料プラン: 月間50万文字まで
   - API キーの取得: https://www.deepl.com/pro-api

3. **WordPressサイト**
   - WordPress 5.0以上
   - REST API有効化
   - 管理者またはエディター権限

4. **ローカル環境**
   - Node.js 18以上
   - Git

## 🚀 セットアップ手順

### ステップ1: リポジトリのセットアップ

1. このリポジトリをフォークまたはテンプレートとして使用

```bash
git clone https://github.com/shoheitanaka/woocommerce-docs-ja.git
cd woocommerce-docs-ja
```

2. 依存関係のインストール

```bash
npm install
composer install
```

### ステップ2: 環境変数の設定

1. `.env.example`を`.env`にコピー

```bash
cp .env.example .env
```

2. `.env`ファイルを編集

```env
# DeepL API設定
DEEPL_API_KEY=your_deepl_api_key_here
DEEPL_API_FREE=true

# WordPress設定
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=admin
WORDPRESS_APP_PASSWORD=your_app_password_here

# GitHub設定
GITHUB_TOKEN=your_github_token
```

### ステップ3: DeepL APIキーの取得

1. [DeepL API](https://www.deepl.com/pro-api)にアクセス
2. アカウント登録（無料プラン）
3. APIキーを取得
4. `.env`ファイルに設定

### ステップ4: WordPressの準備

#### 4.1 アプリケーションパスワードの生成

1. WordPress管理画面にログイン
2. **ユーザー** → **プロフィール**
3. 下にスクロールして「アプリケーションパスワード」セクションを探す
4. 新しいアプリケーションパスワード名を入力（例: "WC Docs Deployment"）
5. **新しいアプリケーションパスワードを追加**をクリック
6. 生成されたパスワードをコピー
7. `.env`ファイルの`WORDPRESS_APP_PASSWORD`に設定

#### 4.2 WordPressプラグインのインストール

```bash
cd wordpress-plugin
zip -r woocommerce-docs-ja.zip .
```

WordPressにアップロード:
1. **プラグイン** → **新規追加** → **プラグインのアップロード**
2. `woocommerce-docs-ja.zip`を選択
3. **今すぐインストール** → **有効化**

### ステップ5: GitHub Secretsの設定

GitHubリポジトリの設定で以下のSecretsを追加:

1. リポジトリページの **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**をクリック

必要なSecrets:

| Secret名 | 説明 | 取得方法 |
|---------|------|---------|
| `DEEPL_API_KEY` | DeepL APIキー | DeepLダッシュボード |
| `WORDPRESS_URL` | WordPressサイトURL | あなたのサイトURL |
| `WORDPRESS_USERNAME` | WordPress管理者名 | WordPress管理画面 |
| `WORDPRESS_APP_PASSWORD` | アプリケーションパスワード | 上記4.1参照 |
| `PAT_TOKEN` | GitHub Personal Access Token | 下記参照 |

#### GitHub Personal Access Tokenの作成

1. GitHub設定 → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token** → **Generate new token (classic)**
3. スコープを選択:
   - `repo` (フルアクセス)
   - `workflow`
4. トークンをコピー
5. GitHub Secretsに`PAT_TOKEN`として追加

### ステップ6: 動作確認

#### 6.1 WordPress接続テスト

```bash
npm run test:connection
```

もし`test:connection`スクリプトがなければ、直接実行:

```bash
node scripts/validate-wp-connection.js
```

期待される出力:
```
✅ All validation checks passed!
```

#### 6.2 上流リポジトリの同期テスト

```bash
npm run sync
```

期待される出力:
```
✅ Synchronization completed successfully!
```

#### 6.3 翻訳テスト（オプション）

⚠️ **注意**: これはDeepL APIを使用します

```bash
# 1つのファイルのみテスト
npm run translate docs/README.md
```

### ステップ7: GitHub Actionsの有効化

1. GitHubリポジトリの **Actions** タブ
2. ワークフローを有効化
3. 初回実行は手動で:
   - **Sync Upstream Documentation** → **Run workflow**

## 🔧 設定のカスタマイズ

### config/config.json

プロジェクト全体の設定:

```json
{
  "translation": {
    "batchSize": 10,           // 一度に処理するファイル数
    "maxCharsPerRequest": 5000 // 1リクエストあたりの最大文字数
  },
  "cache": {
    "enabled": true,
    "expiryDays": 30
  }
}
```

### GitHub Actions実行スケジュール

`.github/workflows/sync-docs.yml`の`cron`設定を変更:

```yaml
schedule:
  - cron: '0 2 * * *'  # 毎日午前2時（UTC）
```

## 📊 使用量の監視

### DeepL API使用量の確認

```bash
# 推定使用量の計算
node scripts/estimate-usage.js
```

### キャッシュ統計の確認

```bash
npm run cache:stats
```

## 🆘 トラブルシューティング

### WordPress接続エラー

**症状**: `Authentication failed`

**解決策**:
1. アプリケーションパスワードが正しいか確認
2. WordPressのREST APIが有効か確認
3. ユーザーに適切な権限があるか確認

### DeepL APIエラー

**症状**: `API quota exceeded`

**解決策**:
1. DeepLダッシュボードで使用量を確認
2. 無料枠を超えている場合は、月初まで待つか有料プランに
3. キャッシュを活用して再翻訳を減らす

### GitHub Actions失敗

**症状**: ワークフローが失敗する

**解決策**:
1. GitHub Secretsが正しく設定されているか確認
2. Actionsログを確認して具体的なエラーを特定
3. `.env.example`と実際の環境変数を比較

## 📚 次のステップ

- [使い方ガイド](USAGE.md)を読む
- カスタマイズ方法を学ぶ
- コントリビューションガイドラインを確認

## 💬 サポート

問題が解決しない場合:
1. [Issues](https://github.com/shoheitanaka/woocommerce-docs-ja/issues)を検索
2. 新しいIssueを作成
3. 詳細なエラーログを添付
