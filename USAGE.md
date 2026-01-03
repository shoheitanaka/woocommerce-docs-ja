# 使い方ガイド

このガイドでは、WooCommerce Docs Japanese翻訳システムの日常的な使い方を説明します。

## 🔄 自動翻訳ワークフロー

システムは以下の自動化されたワークフローで動作します:

```
1. 毎日上流をチェック → 2. 変更を検出 → 3. PRを自動作成 
    ↓
4. 翻訳レビュー → 5. PRマージ → 6. WordPressへ自動デプロイ
```

## 📝 基本的な操作

### 上流ドキュメントの同期

#### 自動同期（推奨）

GitHub Actionsが毎日自動的に実行されます。変更が検出されると自動的にPRが作成されます。

#### 手動同期

すぐに同期したい場合:

1. GitHubリポジトリの **Actions** タブ
2. **Sync Upstream Documentation** を選択
3. **Run workflow** → **Run workflow** をクリック

または、ローカルで:

```bash
npm run sync
```

### 翻訳の実行

#### PRでの自動翻訳

1. 同期PRが作成される
2. PRに`translation`ラベルが自動的に付与される
3. GitHub Actionsが自動的に翻訳を実行
4. 翻訳完了後、PRにレポートがコメントされる

#### 手動翻訳

特定のファイルのみ翻訳する場合:

```bash
# 全ファイル
npm run translate

# 特定のファイル
npm run translate docs/specific-file.md

# 複数ファイル
npm run translate docs/file1.md docs/file2.md
```

### WordPressへのデプロイ

#### 自動デプロイ（推奨）

PRをmainブランチにマージすると、自動的にWordPressにデプロイされます。

#### 手動デプロイ

```bash
# 全ファイルをデプロイ
npm run deploy

# 特定のファイルをデプロイ
node scripts/deploy.js translations/ja/specific-file.md
```

### WC4JP Pro サイトへのデプロイ

WC4JP Pro サイト（https://wc4jp-pro.work/）への専用デプロイスクリプトを使用します。

#### 環境設定

まず `.env` ファイルに以下を設定:

```bash
WORDPRESS_PRO_URL=https://wc4jp-pro.work
WORDPRESS_PRO_USERNAME=your_username
WORDPRESS_PRO_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

#### デプロイの実行

```bash
# 全ファイルをProサイトにデプロイ
node scripts/deploy-pro.js

# 特定のファイルをProサイトにデプロイ
node scripts/deploy-pro.js translations/ja/specific-file.md

# 複数ファイルをProサイトにデプロイ
node scripts/deploy-pro.js translations/ja/file1.md translations/ja/file2.md
```

**注意**: WC4JP Pro サイトは以下の設定で動作します:
- 投稿タイプ: `epkb_post_type_2`
- タクソノミー: `epkb_post_type_2_category`
- デプロイメタデータ保存先: `translations/deploy-metadata-pro/`

## 🎯 PRレビューのベストプラクティス

### 翻訳品質のチェックポイント

同期PRが作成されたら、以下を確認:

1. **コードブロックの保護**
   ```
   ✅ コード例が正しく保持されている
   ❌ コードが翻訳されている
   ```

2. **技術用語の一貫性**
   ```
   ✅ "API" → "API" (そのまま)
   ✅ "plugin" → "プラグイン" (統一)
   ❌ "plugin" → "プラグイン"と"プラギン"が混在
   ```

3. **リンクの保護**
   ```
   ✅ URLが正しく保持されている
   ❌ URLが翻訳・破損している
   ```

4. **フォーマットの保持**
   ```
   ✅ 見出し、リスト、表が正しく保持
   ❌ マークダウン構造が崩れている
   ```

### 翻訳の修正方法

翻訳に問題がある場合:

1. `translations/ja/`内の該当ファイルを直接編集
2. 変更をコミット
3. PRを更新

```bash
# 翻訳ファイルを編集
vim translations/ja/path/to/file.md

# 変更をコミット
git add translations/ja/path/to/file.md
git commit -m "fix: improve translation for specific-file"
git push
```

## 🔍 監視と管理

### 翻訳キャッシュの管理

#### キャッシュ統計の確認

```bash
npm run cache:stats
```

出力例:
```
📊 Cache Statistics
════════════════════════════════════════════════════════════
Cached segments:  1,234
Tracked files:    56
Cache size:       245.67 KB
════════════════════════════════════════════════════════════
```

#### キャッシュのクリア

```bash
npm run cache:clear
```

⚠️ **注意**: キャッシュをクリアすると、次回の翻訳で全ファイルが再翻訳され、DeepL APIの使用量が増加します。

#### キャッシュの更新

```bash
# ファイルハッシュを再計算
node scripts/cache-manager.js update
```

### DeepL API使用量の監視

#### 推定使用量の計算

翻訳前に使用量を見積もる:

```bash
node scripts/estimate-usage.js
```

出力例:
```
📊 DeepL API Usage Estimate
══════════════════════════════════════════════════════════════════
Total characters: 125,000
Total segments:   450

📈 DeepL Free Tier Impact:
   Estimated usage: 25.0% of monthly limit
   ✅ Within free tier (375,000 characters remaining)
══════════════════════════════════════════════════════════════════
```

### WordPressサイトの確認

デプロイ後、以下を確認:

1. WordPressサイトにアクセス
2. ナビゲーションメニューから「WooCommerce Docs」を確認
3. ドキュメントページが正しく表示されているか確認

## 🔧 高度な使い方

### バージョン管理

#### 特定バージョンのデプロイ

```bash
# バージョンを指定してデプロイ
DEPLOY_VERSION=v8.0.0 npm run deploy
```

GitHub Actionsで:
1. **Deploy to WordPress** ワークフロー
2. **Run workflow**
3. `version`フィールドに`v8.0.0`を入力
4. **Run workflow** をクリック

### カスタム同期ルール

`config/config.json`を編集:

```json
{
  "sync": {
    "ignorePatterns": [
      "*.test.md",
      "*.draft.md",
      "internal/**"
    ]
  }
}
```

### 翻訳の最適化

#### バッチサイズの調整

大量のファイルを処理する場合:

```json
{
  "translation": {
    "batchSize": 20,
    "maxCharsPerRequest": 5000
  }
}
```

#### キャッシュ有効期限の設定

```json
{
  "cache": {
    "enabled": true,
    "expiryDays": 30
  }
}
```

## 🛠️ トラブルシューティング

### 翻訳が失敗する

**症状**: `glob is not a function` エラー

**原因**: `glob` パッケージのバージョン不一致または古い使用方法

**解決策**:
```bash
# 依存関係を再インストール
npm install

# または、globパッケージを最新版に更新
npm install glob@latest
```

このエラーは修正済みです。最新のコードを取得してください。

**症状**: GitHub Actionsで翻訳が失敗

**確認事項**:
1. DeepL APIキーが有効か
2. 月間使用量の上限を超えていないか
3. エラーログを確認

**解決策**:
```bash
# ローカルで翻訳を試行
npm run translate

# DeepL使用量を確認
# DeepLダッシュボードにアクセス
```

### デプロイが失敗する

**症状**: WordPressへのデプロイが失敗

**確認事項**:
1. WordPress接続情報が正しいか
2. アプリケーションパスワードが有効か
3. WordPressサイトが稼働しているか

**解決策**:
```bash
# 接続テスト
node scripts/validate-wp-connection.js

# 手動デプロイを試行
npm run deploy
```

### PRが自動作成されない

**症状**: 上流に変更があるのにPRが作成されない

**確認事項**:
1. GitHub Actionsが有効化されているか
2. `PAT_TOKEN`が正しく設定されているか
3. ワークフローのスケジュール設定を確認

**解決策**:
```bash
# 手動で同期を実行
npm run sync

# PRを手動作成
git checkout -b translation/manual-update
git add docs/
git commit -m "docs: sync upstream changes"
git push origin translation/manual-update
```

## 📊 レポートの確認

### 翻訳レポート

PRのコメントに自動的に投稿されるレポートを確認:

- 翻訳されたファイル数
- DeepL API使用量
- キャッシュヒット率
- エラー情報

### デプロイレポート

GitHub Actions実行後のサマリーを確認:

- デプロイされたページ数
- WordPress URL
- エラー情報

## 🔄 定期メンテナンス

### 月次メンテナンス

```bash
# キャッシュのクリーンアップ（30日以上古いエントリを削除）
node scripts/cache-manager.js cleanup 30

# キャッシュの整合性チェック
node scripts/cache-manager.js validate
```

### 四半期メンテナンス

1. DeepL API使用量の確認
2. 翻訳品質のレビュー
3. 不要な古いバージョンの削除

## 💡 ベストプラクティス

### DO ✅

- PRは必ずレビューしてからマージ
- 重要な変更は手動で翻訳を確認
- キャッシュを定期的にクリーンアップ
- DeepL使用量を監視

### DON'T ❌

- PRを自動マージしない
- キャッシュを頻繁にクリアしない
- 大量のファイルを一度に翻訳しない（DeepL制限に注意）
- 本番環境で直接テストしない

## 📚 参考リンク

- [セットアップガイド](SETUP.md)
- [DeepL API ドキュメント](https://www.deepl.com/docs-api)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [GitHub Actions ドキュメント](https://docs.github.com/actions)
