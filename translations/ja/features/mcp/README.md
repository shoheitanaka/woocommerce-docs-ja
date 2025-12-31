---
post_title: Model Context Protocol (MCP) Integration
sidebar_label: MCP Integration
category_slug: mcp
---

# Model Context Protocol (MCP) Integration

## はじめに

WooCommerce はモデルコンテキストプロトコル（MCP）のネイティブサポートを含み、AIアシスタントやツールが標準化されたプロトコルを介して WooCommerce ストアと直接対話することを可能にします。この統合は、AI クライアントが適切な認証と権限でストア操作を実行するために使用できる検出可能なツールとして WooCommerce の機能を公開します。

**開発者プレビューのお知らせ
WooCommerce の MCP 実装は現在開発者プレビューです。機能の成熟に伴い、実装の詳細、API、統合パターンが今後のリリースで変更される可能性があります。

## 背景

モデルコンテキストプロトコル（MCP）は、AI アプリケーションが外部のデータソースやツールに安全に接続できるようにするオープンスタンダードです。WooCommerce の MCP 統合は、2つのコアテクノロジーに基づいています：

- **[WordPress Abilities API](https://github.com/WordPress/abilities-api)** - WordPress に機能を登録するための標準化されたシステム
- **[WordPress MCP Adapter](https://github.com/WordPress/mcp-adapter)** - MCP プロトコルのコア実装

このアーキテクチャにより、WooCommerce は既存のセキュリティと権限モデルを維持しながら、柔軟な WordPress Abilities システムを通じて MCP ツールとして操作を公開することができます。

## 利用可能なもの

WooCommerce の MCP 統合は、AIアシスタントに店舗のコア業務への構造化されたアクセスを提供します：

### 商品管理

- フィルタリングとページネーションで商品を一覧表示
- 商品の詳細情報を取得
- 新規商品の作成
- 既存商品の更新
- 商品の削除

### オーダー管理

- フィルタリングとページネーションで注文を一覧表示
- 詳細な注文情報の取得
- 新規注文の作成
- 既存の注文の更新

すべての操作は WooCommerce の既存の権限システムを尊重し、WooCommerce REST API キーを使用して認証されます。

**データプライバシーに関するお知らせ
注文および顧客業務は、氏名、電子メールアドレス、物理的住所、支払詳細など、個人を特定できる情報（PII）を公開する可能性があります。お客様は、適用されるデータ保護規制を遵守する責任を負います。最小特権 API スコープを使用し、REST API キーを定期的にローテーションおよび失効させ、組織のデータ保持および取り扱いポリシーに従ってください。

## 建築

### データフローの概要

MCP インテグレーションは、MCP クライアントと WordPress の橋渡しをするために、多層アーキテクチャを使用しています：

```text
AI Client (Claude, etc.)
    ↓ (MCP protocol over stdio/JSON-RPC)
Local MCP Proxy (mcp-wordpress-remote)
    ↓ (HTTP/HTTPS requests with authentication)
Remote WordPress MCP Server (mcp-adapter)
    ↓ (WordPress Abilities API)
WooCommerce Abilities
    ↓ (REST API calls or direct operations)
WooCommerce Core
```

### アーキテクチャ・コンポーネント

**ローカル MCP プロキシ** (`mcp-wordpress-remote`)

- Node.js プロセスとして開発者のマシン上でローカルに実行される。
- MCP プロトコルのメッセージを HTTP リクエストに変換する
- 認証ヘッダーインジェクションを処理
- MCP クライアントと WordPress REST エンドポイント間のプロトコルギャップを埋める

**リモート WordPress MCP サーバー** (`mcp-adapter`)

- WordPress 内でプラグインとして動作
- `/wp-json/woocommerce/mcp` エンドポイントの公開
- HTTP リクエストを処理し、MCP プロトコルのメッセージに変換する
- ツールの発見と実行を管理する

#### WordPress・アビリティ・システム

- 能力を登録し、実行するための標準化された方法を提供します。
- MCP ツールと実際の操作の間の抽象化レイヤーとして機能
- 柔軟な実装アプローチが可能（REST ブリッジング、直接 DB 操作など）

### コア・コンポーネント

**MCP アダプタ・プロバイダ** ([`MCPAdapterProvider.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/MCP/MCPAdapterProvider.php))

- MCP サーバーの初期化と設定の管理
- 機能フラグ・チェックの処理 (`mcp_integration`)
- 能力のフィルタリングとネームスペースの管理

**アビリティ・レジストリ** ([`AbilitiesRegistry.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/Abilities/AbilitiesRegistry.php))

- WooCommerce のアビリティ登録を一元化
- WordPress アビリティ API と WooCommerce 操作の橋渡し
- MCP サーバのアビリティディスカバリーを可能にする

**REST ブリッジの実装** ([`AbilitiesRestBridge.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/Abilities/AbilitiesRestBridge.php))

- REST オペレーションを WordPress アビリティにマッピングする現在のプレビュー実装
- 商品と注文のスキーマによる明示的なアビリティ定義を提供します。
- 既存の REST コントローラを使用してアビリティを実装する方法を示します。

**WooCommerce トランスポート** ([`WooCommerceRestTransport.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/MCP/Transport/WooCommerceRestTransport.php))

- WooCommerce API キー認証の処理
- HTTPS 要件の強制
- API キーのスコープに基づく権限の検証

### 実施方法

この開発者プレビューでは、WooCommerce の機能は既存の REST API エンドポイントに橋渡しすることで実装されています。このアプローチにより、実績のある REST コントローラを活用しながら、コア機能を迅速に公開することができます。しかし、WordPress Abilities API は柔軟に設計されています。アビリティは REST エンドポイントのプロキシ以外にも、直接的なデータベース操作、カスタムビジネスロジック、外部サービスとの統合など、さまざまな方法で実装することができます。

## MCP との統合を可能にする

MCP 機能は`mcp_integration`フラグによって制御されます。プログラムで有効にすることができます：

```php
add_filter( 'woocommerce_features', function( $features ) {
    $features['mcp_integration'] = true;
    return $features;
});
```

または、WooCommerce CLI で有効にすることもできます：

```bash
wp option update woocommerce_feature_mcp_integration_enabled yes
```

## 認証とセキュリティ

### API キーの要件

MCP クライアントは `X-MCP-API-Key` ヘッダの WooCommerce REST API キーを使用して認証します：

```http
X-MCP-API-Key: ck_your_consumer_key:cs_your_consumer_secret
```

API キーを作成する：

1.**WooCommerce → 設定 → 詳細 → REST API** に移動します。
2.**キーを追加**をクリックします。
3.適切なパーミッションを設定する (`read`, `write`, または `read_write`)
4.コンシューマー・キーとシークレットを生成し、安全に保存する。

### HTTPS の施行

MCPリクエストには、デフォルトでHTTPSが必要です。ローカル開発では、この要件を無効にできます：

```php
add_filter( 'woocommerce_mcp_allow_insecure_transport', '__return_true' );
```

### 許可の検証

トランスポート・レイヤーは、APIキーの許可に対して操作を検証する：

- `read` 許可：GETリクエストを許可する
- `write`パーミッション：パーミッション: POST, PUT, PATCH, DELETE リクエストを許可する
- `read_write`パーミッション：すべての操作を許可する

## サーバー・エンドポイント

WooCommerce MCP サーバーは下記でご利用いただけます：

```text
https://yourstore.com/wp-json/woocommerce/mcp
```

## MCP サーバーへの接続

### プロキシ・アーキテクチャ

現在の MCP の実装では、MCP クライアントと WordPress サーバーの接続に**ローカルプロキシアプローチ**を使用しています：

- **MCP クライアント**（クロード・コードのような）は、stdio/JSON-RPC 上で MCP プロトコルを使用して通信します。
- **ローカルプロキシ**（`@automattic/mcp-wordpress-remote`）はあなたのマシン上で動作し、MCP プロトコルのメッセージを HTTP リクエストに変換します。
- **WordPress MCP Server** は HTTP リクエストを受信し、WordPress Abilities システムを通して処理します。

このプロキシパターンはプロトコルの違いを埋め、認証を処理するために MCP 統合でよく使われます。`mcp-wordpress-remote` パッケージはプロトコルのトランスレータとして機能し、クライアントが期待する stdio ベースのMCP通信を WordPress が理解する HTTP REST API 呼び出しに変換します。

**将来の進化**：このプロキシアプローチは強固な基盤を提供しますが、MCP エコシステムの進化に伴い、将来の実装では WordPress 内での直接的な MCP プロトコルのサポートや、別の接続方法を模索するかもしれません。

### Claude コードの統合

Claude コードを WooCommerce MCP サーバーに接続します：

1. **WooCommerce → 設定 → 詳細 → REST API** へ移動します。
2. Read/Write "権限で新しいAPIキーを作成します。
3. Claude コードを使用してAPIキーでMCPを設定します：

```bash
claude mcp add woocommerce_mcp \
  --env WP_API_URL=https://yourstore.com/wp-json/woocommerce/mcp \
  --env CUSTOM_HEADERS='{"X-MCP-API-Key": "YOUR_CONSUMER_KEY:YOUR_CONSUMER_SECRET"}' \
  -- npx -y @automattic/mcp-wordpress-remote@latest
```

### MCP クライアントの手動設定

他の MCP クライアントの場合は、この設定をMCP設定に追加してください。この設定は、`mcp-wordpress-remote` プロキシをローカルで実行し、WordPress サーバーとの通信を処理するように MCP クライアントに指示します：

```json
{
  "mcpServers": {
    "woocommerce_mcp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@automattic/mcp-wordpress-remote@latest"
      ],
      "env": {
        "WP_API_URL": "https://yourstore.com/wp-json/woocommerce/mcp",
        "CUSTOM_HEADERS": "{\"X-MCP-API-Key\": \"YOUR_CONSUMER_KEY:YOUR_CONSUMER_SECRET\"}"
      }
    }
  }
}
```

**重要**：`YOUR_CONSUMER_KEY:YOUR_CONSUMER_SECRET` を実際の WooCommerce API 認証情報に置き換えてください。

**トラブルシューティング**：npx のバージョンやローカル環境での SSL に関する一般的なセットアップの問題については、[mcp-wordpress-remote トラブルシューティングガイド](https://github.com/Automattic/mcp-wordpress-remote/blob/trunk/Docs/troubleshooting.md)を参照してください。

## MCP 機能の拡張

### カスタム能力の追加

サードパーティのプラグインは、WordPress Abilities API を使用して追加のアビリティを登録できます。アビリティは、REST エンドポイントのブリッジング、直接操作、カスタムロジック、外部統合など、さまざまな方法で実装できます。以下は基本的な例です：

```php
add_action( 'abilities_api_init', function() {
    wp_register_ability(
        'your-plugin/custom-operation',
        array(
            'label'       => __( 'Custom Store Operation', 'your-plugin' ),
            'description' => __( 'Performs a custom store operation.', 'your-plugin' ),
            'execute_callback' => 'your_custom_ability_handler',
            'permission_callback' => function () {
                return current_user_can( 'manage_woocommerce' );
            },
            'input_schema' => array(
                'type' => 'object',
                'properties' => array(
                    'store_id' => array(
                        'type' => 'integer',
                        'description' => 'Store identifier'
                    )
                ),
                'required' => array( 'store_id' )
            ),
            'output_schema' => array(
                'type' => 'object',
                'properties' => array(
                    'success' => array(
                        'type' => 'boolean',
                        'description' => 'Operation result'
                    )
                )
            )
        )
    );
});
```

### WooCommerce MCP サーバーにカスタム機能を含める

デフォルトでは、`woocommerce/` 名前空間を持つアビリティのみがインクルードされます。他の名前空間のアビリティを含めるには

```php
add_filter( 'woocommerce_mcp_include_ability', function( $include, $ability_id ) {
    if ( str_starts_with( $ability_id, 'your-plugin/' ) ) {
        return true;
    }
    return $include;
}, 10, 2 );
```

## 開発例

完全な動作例については、[WooCommerce MCP Ability Demo Plugin](https://github.com/woocommerce/wc-mcp-ability) をご覧ください。このデモプラグインは、サードパーティの開発者がどのようにできるかを示しています：

- WordPress Abilities API を使用したカスタムアビリティの登録
- 包括的な入出力スキーマの定義
- 適切なパーミッション処理の実装
- WooCommerce MCP サーバーとの統合

デモプラグインは、店舗情報と統計を取得する`woocommerce-demo/store-info` 機能を作成し、REST エンドポイントブリッジングではなく、直接実装アプローチを使用しながら、WooCommerce MCP 機能を拡張するための統合パターンを示します。

## トラブルシューティング

### よくある問題

## MCP サーバーが利用できません

- `mcp_integration` 機能フラグが有効になっていることを確認する。
- MCP アダプタが正しくロードされているか確認する
- WooCommerce のログに初期化エラーがないか確認してください。

## 認証の失敗

- API キーの形式を確認してください：`consumer_key:consumer_secret`
- API キーのパーミッションが運用要件に合致していることを確認する
- 開発時に HTTPS が使用されているか、または明示的に許可されていることを確認する。

## 能力が見つかりません

- `abilities_api_init` で能力が登録されていることを確認する。
- `woocommerce_mcp_include_ability` フィルタを使用してネームスペースがインクルードされていることを確認する。
- アビリティのコールバックがアクセス可能であることを確認する

ソース `woocommerce-mcp` のエントリがあるか **WooCommerce → Status → Logs** を確認してください。

## 重要な考慮事項

- **開発者プレビュー**：この機能はプレビュー状態であり、変更される可能性があります。
- **実装アプローチ**：現在の能力では、プレビュー実装として REST エンドポイントブリッジングを使用する。
- **Breaking Changes**：将来のアップデートで変更される可能性があります。
- **本番テスト**：本番環境へのデプロイ前に十分なテストを行ってください。
- **API の安定性**：WordPress Abilities API と MCP アダプターは進化しています。

## 関連リソース

- [WordPress Abilities API リポジトリ](https://github.com/WordPress/abilities-api)
- [WordPress MCP Adapter Repository](https://github.com/WordPress/mcp-adapter)
- [WooCommerce MCPデモプラグイン](https://github.com/woocommerce/wc-mcp-ability)
- [モデルコンテキストプロトコル仕様書](https://modelcontextprotocol.io/)
- [WooCommerce REST API ドキュメント](https://woocommerce.github.io/woocommerce-rest-api-docs/)
