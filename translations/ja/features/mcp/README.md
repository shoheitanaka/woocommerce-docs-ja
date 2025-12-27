---
post_title: Model Context Protocol (MCP) Integration
sidebar_label: MCP Integration
category_slug: mcp
---

# Model Context Protocol (MCP) Integration

## はじめに

WooCommerceはモデルコンテキストプロトコル（MCP）のネイティブサポートを含み、AIアシスタントやツールが標準化されたプロトコルを介してWooCommerceストアと直接対話することを可能にします。この統合は、AIクライアントが適切な認証と権限でストア操作を実行するために使用できる検出可能なツールとしてWooCommerceの機能を公開します。

**開発者プレビューのお知らせ
WooCommerceのMCP実装は現在開発者プレビューです。機能の成熟に伴い、実装の詳細、API、統合パターンが今後のリリースで変更される可能性があります。

## 背景

モデルコンテキストプロトコル（MCP）は、AIアプリケーションが外部のデータソースやツールに安全に接続できるようにするオープンスタンダードです。WooCommerceのMCP統合は、2つのコアテクノロジーに基づいています：

- **[WordPress Abilities API](https://github.com/WordPress/abilities-api)** - WordPressに機能を登録するための標準化されたシステム
- **[WordPress MCP Adapter](https://github.com/WordPress/mcp-adapter)** - MCPプロトコルのコア実装

このアーキテクチャにより、WooCommerceは既存のセキュリティと権限モデルを維持しながら、柔軟なWordPress Abilitiesシステムを通じてMCPツールとして操作を公開することができます。

## 利用可能なもの

WooCommerceのMCP統合は、AIアシスタントに店舗のコア業務への構造化されたアクセスを提供します：

### 製品管理

- フィルタリングとページネーションで製品を一覧表示
- 商品の詳細情報を取得
- 新規商品の作成
- 既存商品の更新
- 商品の削除

### オーダー管理

- フィルタリングとページネーションで注文を一覧表示
- 詳細な注文情報の取得
- 新規注文の作成
- 既存の注文の更新

すべての操作はWooCommerceの既存の権限システムを尊重し、WooCommerce REST APIキーを使用して認証されます。

**データプライバシーに関するお知らせ
注文および顧客業務は、氏名、電子メールアドレス、物理的住所、支払詳細など、個人を特定できる情報（PII）を公開する可能性があります。お客様は、適用されるデータ保護規制を遵守する責任を負います。最小特権 API スコープを使用し、REST API キーを定期的にローテーションおよび失効させ、組織のデータ保持および取り扱いポリシーに従ってください。

## 建築

### データフローの概要

MCPインテグレーションは、MCPクライアントとWordPressの橋渡しをするために、多層アーキテクチャを使用しています：

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

**ローカルMCPプロキシ** (`mcp-wordpress-remote`)

- Node.jsプロセスとして開発者のマシン上でローカルに実行される。
- MCPプロトコルのメッセージをHTTPリクエストに変換する
- 認証ヘッダーインジェクションを処理
- MCPクライアントとWordPress RESTエンドポイント間のプロトコルギャップを埋める

**リモートWordPress MCPサーバー** (`mcp-adapter`)

- WordPress内でプラグインとして動作
- `/wp-json/woocommerce/mcp`エンドポイントの公開
- HTTPリクエストを処理し、MCPプロトコルのメッセージに変換する
- ツールの発見と実行を管理する

#### ワードプレス・アビリティ・システム

- 能力を登録し、実行するための標準化された方法を提供します。
- MCPツールと実際の操作の間の抽象化レイヤーとして機能
- 柔軟な実装アプローチが可能（RESTブリッジング、直接DB操作など）

### コア・コンポーネント

**MCPアダプタ・プロバイダ** ([`MCPAdapterProvider.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/MCP/MCPAdapterProvider.php))

- MCPサーバーの初期化と設定の管理
- 機能フラグ・チェックの処理 (`mcp_integration`)
- 能力のフィルタリングとネームスペースの管理

**アビリティ・レジストリ** ([`AbilitiesRegistry.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/Abilities/AbilitiesRegistry.php))

- WooCommerceのアビリティ登録を一元化
- WordPressアビリティAPIとWooCommerce操作の橋渡し
- MCPサーバのアビリティディスカバリーを可能にする

**RESTブリッジの実装** ([`AbilitiesRestBridge.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/Abilities/AbilitiesRestBridge.php))

- RESTオペレーションをWordPressアビリティにマッピングする現在のプレビュー実装
- 商品と注文のスキーマによる明示的なアビリティ定義を提供します。
- 既存の REST コントローラを使用してアビリティを実装する方法を示します。

**WooCommerceトランスポート** ([`WooCommerceRestTransport.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/MCP/Transport/WooCommerceRestTransport.php))

- WooCommerce API キー認証の処理
- HTTPS 要件の強制
- APIキーのスコープに基づく権限の検証

### 実施方法

この開発者プレビューでは、WooCommerce の機能は既存の REST API エンドポイントに橋渡しすることで実装されています。このアプローチにより、実績のある REST コントローラを活用しながら、コア機能を迅速に公開することができます。しかし、WordPress Abilities API は柔軟に設計されています。アビリティは REST エンドポイントのプロキシ以外にも、直接的なデータベース操作、カスタムビジネスロジック、外部サービスとの統合など、さまざまな方法で実装することができます。

## MCPとの統合を可能にする

MCP機能は`mcp_integration`フラグによって制御されます。プログラムで有効にすることができます：

```php
add_filter( 'woocommerce_features', function( $features ) {
    $features['mcp_integration'] = true;
    return $features;
});
```

または、WooCommerce CLIで有効にすることもできます：

```bash
wp option update woocommerce_feature_mcp_integration_enabled yes
```

## 認証とセキュリティ

### APIキーの要件

MCPクライアントは`X-MCP-API-Key`ヘッダのWooCommerce REST APIキーを使用して認証します：

```http
X-MCP-API-Key: ck_your_consumer_key:cs_your_consumer_secret
```

APIキーを作成する：

1.WooCommerce → 設定 → 詳細 → REST API*** に移動します。
2.キーを追加**をクリックします。
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

## MCPサーバーへの接続

### プロキシ・アーキテクチャ

現在のMCPの実装では、MCPクライアントとWordPressサーバーの接続に**ローカルプロキシアプローチ**を使用しています：

- **MCPクライアント**（クロード・コードのような）は、stdio/JSON-RPC上でMCPプロトコルを使用して通信します。
- **ローカルプロキシ**（`@automattic/mcp-wordpress-remote`）はあなたのマシン上で動作し、MCPプロトコルのメッセージをHTTPリクエストに変換します。
- **WordPress MCP Server** はHTTPリクエストを受信し、WordPress Abilitiesシステムを通して処理します。

このプロキシパターンはプロトコルの違いを埋め、認証を処理するために MCP 統合でよく使われます。`mcp-wordpress-remote`パッケージはプロトコルのトランスレータとして機能し、クライアントが期待するstdioベースのMCP通信をWordPressが理解するHTTP REST API呼び出しに変換します。

**将来の進化**：このプロキシアプローチは強固な基盤を提供しますが、MCPエコシステムの進化に伴い、将来の実装ではWordPress内での直接的なMCPプロトコルのサポートや、別の接続方法を模索するかもしれません。

### クロード・コードの統合

クロードコードをWooCommerce MCPサーバーに接続します：

1.WooCommerce → 設定 → 詳細 → REST API*** へ移動します。
2.Read/Write "権限で新しいAPIキーを作成します。
3.クロードコードを使用してAPIキーでMCPを設定します：

```bash
claude mcp add woocommerce_mcp \
  --env WP_API_URL=https://yourstore.com/wp-json/woocommerce/mcp \
  --env CUSTOM_HEADERS='{"X-MCP-API-Key": "YOUR_CONSUMER_KEY:YOUR_CONSUMER_SECRET"}' \
  -- npx -y @automattic/mcp-wordpress-remote@latest
```

### MCP クライアントの手動設定

他のMCPクライアントの場合は、この設定をMCP設定に追加してください。この設定は、`mcp-wordpress-remote`プロキシをローカルで実行し、WordPressサーバーとの通信を処理するようにMCPクライアントに指示します：

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

**重要**：`YOUR_CONSUMER_KEY:YOUR_CONSUMER_SECRET`を実際のWooCommerce API認証情報に置き換えてください。

**トラブルシューティング**：npxのバージョンやローカル環境でのSSLに関する一般的なセットアップの問題については、[mcp-wordpress-remoteトラブルシューティングガイド](https://github.com/Automattic/mcp-wordpress-remote/blob/trunk/Docs/troubleshooting.md)を参照してください。

## MCP機能の拡張

### カスタム能力の追加

サードパーティのプラグインは、WordPress Abilities API を使用して追加のアビリティを登録できます。アビリティは、RESTエンドポイントのブリッジング、直接操作、カスタムロジック、外部統合など、さまざまな方法で実装できます。以下は基本的な例です：

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

### WooCommerce MCPサーバーにカスタム機能を含める

デフォルトでは、`woocommerce/`名前空間を持つアビリティのみがインクルードされます。他の名前空間のアビリティを含めるには

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

- WordPress Abilities APIを使用したカスタムアビリティの登録
- 包括的な入出力スキーマの定義
- 適切なパーミッション処理の実装
- WooCommerce MCPサーバーとの統合

デモプラグインは、店舗情報と統計を取得する`woocommerce-demo/store-info`機能を作成し、RESTエンドポイントブリッジングではなく、直接実装アプローチを使用しながら、WooCommerce MCP機能を拡張するための統合パターンを示します。

## トラブルシューティング

### よくある問題

## MCPサーバーが利用できません

- `mcp_integration`機能フラグが有効になっていることを確認する。
- MCPアダプタが正しくロードされているか確認する
- WooCommerceのログに初期化エラーがないか確認してください。

## 認証の失敗

- APIキーの形式を確認してください：`consumer_key:consumer_secret`
- APIキーのパーミッションが運用要件に合致していることを確認する
- 開発時にHTTPSが使用されているか、または明示的に許可されていることを確認する。

## 能力が見つかりません

- `abilities_api_init`で能力が登録されていることを確認する。
- `woocommerce_mcp_include_ability`フィルタを使用してネームスペースがインクルードされていることを確認する。
- アビリティのコールバックがアクセス可能であることを確認する

ソース `woocommerce-mcp` のエントリがあるか **WooCommerce → Status → Logs** を確認してください。

## 重要な考慮事項

- **開発者プレビュー**：この機能はプレビュー状態であり、変更される可能性があります。
- **実装アプローチ**：現在の能力では、プレビュー実装として REST エンドポイントブリッジングを使用する。
- **Breaking Changes**：将来のアップデートで変更される可能性があります。
- **本番テスト**：本番環境へのデプロイ前に十分なテストを行ってください。
- **APIの安定性**：WordPress Abilities API と MCP アダプターは進化しています。

## 関連リソース

- [WordPress Abilities API リポジトリ](https://github.com/WordPress/abilities-api)
- [WordPress MCP Adapter Repository](https://github.com/WordPress/mcp-adapter)
- [WooCommerce MCPデモプラグイン](https://github.com/woocommerce/wc-mcp-ability)
- [モデルコンテキストプロトコル仕様書](https://modelcontextprotocol.io/)
- [WooCommerce REST API ドキュメント](https://woocommerce.github.io/woocommerce-rest-api-docs/)
