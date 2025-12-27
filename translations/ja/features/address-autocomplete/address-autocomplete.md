# 住所オートコンプリート・プロバイダの実装

## 概要

WooCommerce住所オートコンプリートシステムは、顧客がチェックアウト中に請求先住所と配送先住所を入力すると、サードパーティのサービスが住所候補を提供することを可能にします。このガイドでは、任意の住所検証サービスと統合するためにカスタム住所プロバイダを作成し、登録する方法を説明します。

この実装では、ショートコードとブロックベースのチェックアウトの両方にプロバイダを登録することに注意してください。

## 建築

アドレスオートコンプリートシステムは、3つの主要コンポーネントで構成されています：

1. **サーバーサイド・プロバイダー（PHP）** - プロバイダーの登録と設定を行います。
2. **クライアント側プロバイダ（JavaScript）** - 検索と選択のロジックを実装します。
3. **UI Components** - サジェストを表示し、ユーザーインタラクションを処理します（これはWooCommerceによって実装されます。）

## サーバー側プロバイダーの登録

### ステップ1：WC_Address_Providerサブクラスの作成

`WC_Address_Provider` を継承した PHP クラスを作成します：

```php
<?php
/**
 * Custom Address Provider Implementation
 *
 * @package YourPlugin
 */

namespace YourPlugin\Providers;

use WC_Address_Provider;

/**
 * Custom Address Provider
 */
class Custom_Address_Provider extends WC_Address_Provider {
    
    /**
     * Provider unique identifier.
     *
     * @var string
     */
    public $id = 'custom-provider';
    
    /**
     * Provider display name.
     *
     * @var string
     */
    public $name = 'Custom Address Provider';
    
    /**
     * Optional branding HTML to display with suggestions.
     *
     * @var string
     */
    public $branding_html = '<div class="custom-branding">Powered by Custom Provider</div>';
    
    /**
     * Constructor
     */
    public function __construct() {
        // Initialize any API clients or configurations.
    }
}
```

### ステップ2：プロバイダーの登録

`woocommerce_address_providers`フィルタを使用してプロバイダをWooCommerceに登録します：

```php
/**
 * Register the custom address provider
 *
 * @param array $providers Existing providers.
 * @return array Modified providers list.
 */
function register_custom_address_provider( $providers ) {
    // Only register if the provider class exists
    if ( class_exists( 'YourPlugin\Providers\Custom_Address_Provider' ) ) {
        $providers[] = new \YourPlugin\Providers\Custom_Address_Provider();
    }
    
    return $providers;
}
add_filter( 'woocommerce_address_providers', 'register_custom_address_provider', 10, 1 );
```

## クライアント側プロバイダの登録

### ステップ3：JavaScript関数の実装

クライアント側のプロバイダ・ロジックを実装するJavaScriptファイルを作成します。

#### プロバイダーオブジェクト API

### パラメーター

- id_ `string` - サーバー側のプロバイダーIDと一致する必要がある一意の識別子。
- canSearch_ `function` - プロバイダが指定した国での検索をサポートしているかどうかを調べる関数です。
    - パラメータを指定します：
        - country_ `string` - 2文字の国コード (例 'US'、'GB')。
    - 返り値：`boolean` - プロバイダがこの国をサポートしているかどうか。
- __search_ `function` - 住所の候補を検索する非同期関数。
    - パラメータ：
        - query_ `string` - ユーザーが入力したテキスト（最小3文字）。
        - country_ `string` - 選択した国の2文字の国コード。
        - type_ `string` - 住所のタイプ。
    - を返します：`Promise<Array>` - 提案オブジェクトの配列を解決する約束。
- __select_ `function` - 住所の詳細情報を取得するための非同期関数です。
    - パラメータを指定します：
        - addressId_ `string` - 選択された提案の ID。
    - 返り値：`Promise<Object|null>` - address オブジェクトに解決するプロミス。

### 提案オブジェクト形式

`search`関数は、以下の構造を持つ提案オブジェクトを返さなければならない：

- _id_ `string` - この提案の一意の識別子です。
- _label_ `string` - ユーザーに表示されるテキスト。
- matchedSubstrings_ `array` (オプション) - ラベル内でハイライト表示するテキスト範囲の配列。
    - offset_ `number` - マッチしたテキストの開始位置。
    - length_ `number` - 一致したテキストの長さ。

### アドレス・オブジェクト・フォーマット

`select`関数はこれらのWooCommerceフィールド名を持つアドレスオブジェクトを返す必要があります：

- _address_1_ `string` - プライマリ・アドレス行。
- _address_2_ `string` - 副住所行 (省略可能、空文字列も可能)。
- city_ `string` - 市町村名。
- state_ `string` - 都道府県コード。
- postcode_ `string` - 郵便番号。
- country_ `string` - 2文字の国コード。

### 実装例

```javascript
/**
 * Custom Address Provider Client Implementation
 */
// Define the provider
const customProvider = {
    // Must match the PHP provider's ID.
    id: 'custom-provider',

    /**
     * Check if provider can search in given country
     *
     * @param {string} country - Two-letter country code (e.g., 'US', 'GB')
     * @return {boolean} Whether the provider supports this country
     */
    canSearch: function ( country ) {
      // Define supported countries.
      const supportedCountries = [ 'US', 'CA', 'GB', 'AU' ];
      return supportedCountries.includes( country );
    },

    /**
     * Search for address suggestions
     *
     * @param {string} query - The search query entered by the user
     * @param {string} country - The selected country code
     * @param {string} type - Address type ('billing' or 'shipping')
     * @return {Promise<Array>} Array of suggestion objects
     */
    search: async function ( query, country, type ) {
      // Return search results.  Your function may call an endpoint to get this data.
      const data = [
        {
          id: '1',
          label: '123 Main Street, City, US',
          matchedSubstrings: [ { offset: 0, length: 3 } ],
        },
        {
          id: '2',
          label: '456 Oak Avenue, Town, US',
          matchedSubstrings: [ { offset: 0, length: 3 } ],
        },
        {
          id: '3',
          label: '789 Pine Road, Village, US',
          matchedSubstrings: [ { offset: 0, length: 3 } ],
        },
        {
          id: '4',
          label: '101 Pine Road, Village, US',
          matchedSubstrings: [ { offset: 0, length: 3 } ],
        },
        {
          id: '5',
          label: '101 Pine Road, Village, US',
          matchedSubstrings: [ { offset: 0, length: 3 } ],
        },
      ];
      return data;
    },

    /**
     * Get full address details for a selected suggestion
     *
     * @param {string} addressId - The ID of the selected suggestion
     * @return {Promise<Object>} Address details object
     */
    select: async function ( addressId ) {
      // Return address components in correct format. Your function may call an endpoint to get this data.
      return {
        // Required fields
        address_1: 'Test address 1',
        city: 'Test City',
        state: 'CA',
        postcode: '92010',
        country: 'US',
      };
    },
  };

// Register the provider.
if (
  window.wc &&
  window.wc.addressAutocomplete &&
  window.wc.addressAutocomplete.registerAddressAutocompleteProvider
) {
  window.wc.addressAutocomplete.registerAddressAutocompleteProvider(
    customProvider
  );
}
```

### ステップ4：JavaScriptをエンキューする

チェックアウトページでJavaScriptファイルをエンキューします。

このJavaScriptファイルは、プロバイダが優先プロバイダとして選択されていない場合でも、キューに入れる必要がある。これは、優先プロバイダが結果を検索できない場合に、あなたのプロバイダがフォールバックとして使用される可能性があるためです。

```php
/**
 * Enqueue custom provider scripts
 */
function enqueue_custom_provider_scripts() {
    // Only load on checkout pages
    if ( is_checkout() ) {
        // Check if address autocomplete is enabled
        $is_enabled = get_option( 'woocommerce_address_autocomplete_enabled' ) === 'yes';
        
        if ( $is_enabled ) {
            wp_enqueue_script(
                'custom-address-provider',
                plugin_dir_url( __FILE__ ) . 'assets/js/custom-address-provider.js',
                array( 'wc-address-autocomplete' ),
                '1.0.0',
                true
            );
            
            // Pass data to JavaScript
            wp_localize_script(
                'custom-address-provider',
                'yourPlugin',
                array(
                    'nonce' => wp_create_nonce( 'wp_rest' ),
                    'apiUrl' => rest_url( 'your-plugin/v1/' )
                )
            );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'enqueue_custom_provider_scripts' );
```

## REST API の実装

JavaScriptプロバイダーは、REST APIエンドポイントを介してサーバーと通信します。2つのエンドポイントを作成する必要があります：

1. **住所検索エンドポイント** (`/wp-json/your-plugin/v1/address-search`)
   - 引数: クエリー文字列、国コード、住所タイプ
   - 戻り値IDとラベルを持つ候補の配列

2. **アドレス詳細エンドポイント** (`/wp-json/your-plugin/v1/address-details`)
   - 以下のものを受け取ります：住所/場所ID
   - 戻り値完全な住所構成要素

実装の詳細については、[WordPress REST API ハンドブック](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/) を参照してください。

## トラブルシューティング

### よくある問題

1. **チェックアウトにプロバイダが表示されない
   - プロバイダがサーバに登録されていることを確認する
   - JavaScriptファイルがロードされていることを確認する
   - PHPとJavaScriptでプロバイダIDが一致していることを確認する

2. **提案が表示されません
   - ブラウザのコンソールでJavaScriptエラーを確認する
   - APIエンドポイントがアクセス可能か確認する
   - 国がプロバイダーによってサポートされていることを確認する
   - 検索クエリが3文字以上であることを確認する。

3. **選択時にフィールドが入力されない
   - `select`メソッドが正しいフィールド名を返すか確認する
   - 住所データがWooCommerceのフィールド構造と一致するか確認する
