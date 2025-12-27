---
post_title: WooCommerce coding standards
sidebar_label: Coding standards
---

# WooCommerce coding standards

WooCommerce コーディングスタンダードの遵守は、高いコード品質を維持し、互換性を確保し、メンテナンスとアップデートを容易にするために不可欠です。このドキュメントでは、フックの使用、関数のプレフィックス、翻訳可能なテキスト、コード構造など、WooCommerceエコシステム内で作業する開発者に推奨されるコーディングプラクティスの概要を説明します。

## フックの位置

WordPressとWooCommerceのエコシステムで一般的なパターンに合わせるために、フックを関数呼び出しの下に配置します。

```php
/**
 * Add custom message.
 */
function YOUR_PREFIX_custom_message() {
    echo 'This is a custom message';
}
add_action( 'wp_footer', 'YOUR_PREFIX_custom_message' );
```

## 関数呼び出しの接頭辞

衝突を避けるため、すべての関数呼び出しに一貫した接頭辞を使用してください。このレポのコード・スニペットでは、`YOUR_PREFIX`を使用してください。

```php
/**
 * Add custom discount.
 */
function YOUR_PREFIX_custom_discount( $price, $product ) {
    return $price * 0.9;  // 10% discount
}
add_filter( 'woocommerce_product_get_price', 'YOUR_PREFIX_custom_discount', 10, 2 );
```

## 翻訳可能なテキストとテキストドメイン

すべてのプレーン・テキストが翻訳可能であることを確認し、国際化のベスト・プラクティスに従って一貫したテキスト・ドメインを使用してください。このレポのコード・スニペットでは、テキストドメイン `YOUR-TEXTDOMAIN` を使用してください。

```php
/**
 * Add welcome message.
 */
function YOUR_PREFIX_welcome_message() {
    echo __( 'Welcome to our website', 'YOUR-TEXTDOMAIN' );
}
add_action( 'wp_footer', 'YOUR_PREFIX_welcome_message' );
```

## function_exists()の使用

関数の再宣言によるエラーを防ぐには、すべての関数呼び出しを `function_exists()` で囲みます。

```php
/**
 * Add thumbnail support.
 */
if ( ! function_exists( 'YOUR_PREFIX_theme_setup' ) ) {
    function YOUR_PREFIX_theme_setup() {
        add_theme_support( 'post-thumbnails' );
    }
}
add_action( 'after_setup_theme', 'YOUR_PREFIX_theme_setup' );
```

## コード品質基準

最高水準のコード品質を保証するため、開発者は以下のプラクティスを遵守することが推奨される：

### WooCommerceのスニッフとWordPressのコード標準

- **コードがWooCommerce SniffsとWordPress Code Standards for PHP_CodeSnifferを通過する際に、コードスタイルに問題がないことを確認します。

### 自動テスト

- **ユニットテスト**：コードの機能を分離して検証するための自動ユニットテストを実装する。
- **E2Eテスト**：自動化されたエンドツーエンドテストを活用し、アプリケーション内のコンポーネントの統合動作を検証する。

### バグの追跡と管理

- **未解決のバグを監視し、最小化することを目指す。

### コード編成

- すべてのプラグインコードを含む "神/スーパークラス "を作らないように、**自己完結型のクラス**でコードを整理する。この習慣はモジュール性を促進し、メンテナンスを簡単にします。

これらのコーディング標準とプラクティスに従うことで、開発者は WordPress のエコシステムに積極的に貢献する、高品質で保守可能かつ安全な WooCommerce 拡張機能を作成することができます。
