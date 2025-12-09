---
post_title: Model Context Protocol (MCP) Integration
sidebar_label: MCP Integration
category_slug: mcp
---

# Model Context Protocol (MCP) Integration

## Introduction

WooCommerceはモデルコンテキストプロトコル（MCP）のネイティブサポートを含み、AIアシスタントやツールが標準化されたプロトコルを介してWooCommerceストアと直接対話することを可能にします。この統合は、AIクライアントが適切な認証と権限でストア操作を実行するために使用できる検出可能なツールとしてWooCommerceの機能を公開します。

:::info

**開発者プレビューのお知らせ
WooCommerceのMCP実装は現在開発者プレビューです。機能の成熟に伴い、実装の詳細、API、統合パターンが今後のリリースで変更される可能性があります。

:::

## Background

モデルコンテキストプロトコル（MCP）は、AIアプリケーションが外部のデータソースやツールに安全に接続できるようにするオープンスタンダードです。WooCommerceのMCP統合は、2つのコアテクノロジーに基づいています：

- **[WordPress Abilities API](https://github.com/WordPress/abilities-api)** - A standardized system for registering capabilities in WordPress
- **[WordPress MCP Adapter](https://github.com/WordPress/mcp-adapter)** - The core MCP protocol implementation

このアーキテクチャにより、WooCommerceは既存のセキュリティと権限モデルを維持しながら、柔軟なWordPress Abilitiesシステムを通じてMCPツールとして操作を公開することができます。

## What's Available

WooCommerceのMCP統合は、AIアシスタントに店舗のコア業務への構造化されたアクセスを提供します：

### Product Management

- フィルタリングとページネーションで製品を一覧表示
- 商品の詳細情報を取得
- 新規商品の作成
- 既存商品の更新
- 商品の削除

### Order Management

- フィルタリングとページネーションで注文を一覧表示
- 詳細な注文情報の取得
- 新規注文の作成
- 既存の注文の更新

すべての操作はWooCommerceの既存の権限システムを尊重し、WooCommerce REST APIキーを使用して認証されます。

:::warning

**データプライバシーに関するお知らせ
注文および顧客業務は、氏名、電子メールアドレス、物理的住所、支払詳細など、個人を特定できる情報（PII）を公開する可能性があります。お客様は、適用されるデータ保護規制を遵守する責任を負います。最小特権 API スコープを使用し、REST API キーを定期的にローテーションおよび失効させ、組織のデータ保持および取り扱いポリシーに従ってください。

:::

## Architecture

### Data Flow Overview

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

### Architecture Components

**Local MCP Proxy** (`mcp-wordpress-remote`)

- Node.jsプロセスとして開発者のマシン上でローカルに実行される。
- MCPプロトコルのメッセージをHTTPリクエストに変換する
- 認証ヘッダーインジェクションを処理
- MCPクライアントとWordPress RESTエンドポイント間のプロトコルギャップを埋める

**Remote WordPress MCP Server** (`mcp-adapter`)

- Runs within WordPress as a plugin
- Exposes the `/wp-json/woocommerce/mcp` endpoint
- Processes incoming HTTP requests and converts them to MCP protocol messages
- Manages tool discovery and execution

#### WordPress Abilities System

- 能力を登録し、実行するための標準化された方法を提供します。
- MCPツールと実際の操作の間の抽象化レイヤーとして機能
- 柔軟な実装アプローチが可能（RESTブリッジング、直接DB操作など）

### Core Components

**MCP Adapter Provider** ([`MCPAdapterProvider.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/MCP/MCPAdapterProvider.php))

- Manages MCP server initialization and configuration
- Handles feature flag checking (`mcp_integration`)
- Provides ability filtering and namespace management

**Abilities Registry** ([`AbilitiesRegistry.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/Abilities/AbilitiesRegistry.php))

- WooCommerceのアビリティ登録を一元化
- WordPressアビリティAPIとWooCommerce操作の橋渡し
- MCPサーバのアビリティディスカバリを可能にする

**REST Bridge Implementation** ([`AbilitiesRestBridge.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/Abilities/AbilitiesRestBridge.php))

- RESTオペレーションをWordPressアビリティにマッピングする現在のプレビュー実装
- 商品と注文のスキーマによる明示的なアビリティ定義を提供します。
- 既存の REST コントローラを使用してアビリティを実装する方法を示します。

**WooCommerce Transport** ([`WooCommerceRestTransport.php`](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Internal/MCP/Transport/WooCommerceRestTransport.php))

- WooCommerce API キー認証の処理
- HTTPS 要件の強制
- APIキーのスコープに基づく権限の検証

### Implementation Approach

この開発者プレビューでは、WooCommerce の機能は既存の REST API エンドポイントに橋渡しすることで実装されています。このアプローチにより、実績のある REST コントローラを活用しながら、コア機能を迅速に公開することができます。しかし、WordPress Abilities API は柔軟に設計されています。アビリティは REST エンドポイントのプロキシ以外にも、直接的なデータベース操作、カスタムビジネスロジック、外部サービスとの統合など、さまざまな方法で実装することができます。

## Enabling MCP Integration

The MCP feature is controlled by the `mcp_integration` feature flag. You can enable it programmatically:

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

## Authentication and Security

### API Key Requirements

MCP clients authenticate using WooCommerce REST API keys in the `X-MCP-API-Key` header:

```http
X-MCP-API-Key: ck_your_consumer_key:cs_your_consumer_secret
```

APIキーを作成する：

1. Navigate to **WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Set appropriate permissions (`read`, `write`, or `read_write`)
4. Generate and securely store the consumer key and secret

### HTTPS Enforcement

MCPリクエストには、デフォルトでHTTPSが必要です。ローカル開発では、この要件を無効にできます：

```php
add_filter( 'woocommerce_mcp_allow_insecure_transport', '__return_true' );
```

### Permission Validation

トランスポート・レイヤーは、APIキーの許可に対して操作を検証する：

- `read` permissions: Allow GET requests
- `write` permissions: Allow POST, PUT, PATCH, DELETE requests
- `read_write` permissions: Allow all operations

## Server Endpoint

WooCommerce MCP サーバーは下記でご利用いただけます：

```text
https://yourstore.com/wp-json/woocommerce/mcp
```

## Connecting to the MCP Server

### Proxy Architecture

現在のMCPの実装では、MCPクライアントとWordPressサーバーの接続に**ローカルプロキシアプローチ**を使用しています：

- **MCP Clients** (like Claude Code) communicate using the MCP protocol over stdio/JSON-RPC
- **Local Proxy** (`@automattic/mcp-wordpress-remote`) runs on your machine and translates MCP protocol messages to HTTP requests
- **WordPress MCP Server** receives HTTP requests and processes them through the WordPress Abilities system

This proxy pattern is commonly used in MCP integrations to bridge protocol differences and handle authentication. The `mcp-wordpress-remote` package acts as a protocol translator, converting the stdio-based MCP communication that clients expect into the HTTP REST API calls that WordPress understands.

**将来の進化**：このプロキシアプローチは強固な基盤を提供しますが、MCPエコシステムの進化に伴い、将来の実装ではWordPress内での直接的なMCPプロトコルのサポートや、別の接続方法を模索するかもしれません。

### Claude Code Integration

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

### Manual MCP Client Configuration

For other MCP clients, add this configuration to your MCP settings. This configuration tells the MCP client to run the `mcp-wordpress-remote` proxy locally, which will handle the communication with your WordPress server:

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

**Important**: Replace `YOUR_CONSUMER_KEY:YOUR_CONSUMER_SECRET` with your actual WooCommerce API credentials.

**Troubleshooting**: For common setup issues with npx versions or SSL in local environments, see the [mcp-wordpress-remote troubleshooting guide](https://github.com/Automattic/mcp-wordpress-remote/blob/trunk/Docs/troubleshooting.md).

## Extending MCP Capabilities

### Adding Custom Abilities

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

### Including Custom Abilities in WooCommerce MCP Server

By default, only abilities with the `woocommerce/` namespace are included. To include abilities from other namespaces:

```php
add_filter( 'woocommerce_mcp_include_ability', function( $include, $ability_id ) {
    if ( str_starts_with( $ability_id, 'your-plugin/' ) ) {
        return true;
    }
    return $include;
}, 10, 2 );
```

## Development Example

For a complete working example, see the [WooCommerce MCP Ability Demo Plugin](https://github.com/woocommerce/wc-mcp-ability). This demonstration plugin shows how third-party developers can:

- WordPress Abilities APIを使用したカスタムアビリティの登録
- 包括的な入出力スキーマの定義
- 適切なパーミッション処理の実装
- WooCommerce MCPサーバーとの統合

The demo plugin creates a `woocommerce-demo/store-info` ability that retrieves store information and statistics, demonstrating the integration patterns for extending WooCommerce MCP capabilities while using a direct implementation approach rather than REST endpoint bridging.

## Troubleshooting

### Common Issues

## MCP Server Not Available

- Verify the `mcp_integration` feature flag is enabled
- Check that the MCP adapter is properly loaded
- Review WooCommerce logs for initialization errors

## Authentication Failures

- Confirm API key format: `consumer_key:consumer_secret`
- Verify API key permissions match operation requirements
- Ensure HTTPS is used or explicitly allowed for development

## Ability Not Found

- Confirm abilities are registered during `abilities_api_init`
- Check namespace inclusion using the `woocommerce_mcp_include_ability` filter
- Verify ability callbacks are accessible

Check **WooCommerce → Status → Logs** for entries with source `woocommerce-mcp`.

## Important Considerations

- **開発者プレビュー**：この機能はプレビュー状態であり、変更される可能性があります。
- **実装アプローチ現在の能力では、プレビュー実装として REST エンドポイントブリッジングを使用する。
- **Breaking Changes**：将来のアップデートで変更される可能性があります。
- **本番テスト**：本番環境へのデプロイ前に十分なテストを行ってください。
- **APIの安定性**：WordPress Abilities API と MCP アダプターは進化しています。

## Related Resources

- [WordPress Abilities API Repository](https://github.com/WordPress/abilities-api)
- [WordPress MCP Adapter Repository](https://github.com/WordPress/mcp-adapter)
- [WooCommerce MCP Demo Plugin](https://github.com/woocommerce/wc-mcp-ability)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [WooCommerce REST API Documentation](https://woocommerce.github.io/woocommerce-rest-api-docs/)
