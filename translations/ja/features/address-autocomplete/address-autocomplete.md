# Address Autocomplete Provider Implementation

## Overview

WooCommerce住所オートコンプリートシステムは、顧客がチェックアウト中に請求先住所と配送先住所を入力すると、サードパーティのサービスが住所候補を提供することを可能にします。このガイドでは、任意の住所検証サービスと統合するためにカスタム住所プロバイダを作成し、登録する方法を説明します。

この実装では、ショートコードとブロックベースのチェックアウトの両方にプロバイダを登録することに注意してください。

## Architecture

アドレスオートコンプリートシステムは、3つの主要コンポーネントで構成されています：

1. **サーバーサイド・プロバイダー（PHP）** - プロバイダーの登録と設定を行います。
2. **クライアント側プロバイダ（JavaScript）** - 検索と選択のロジックを実装します。
3. **UI Components** - サジェストを表示し、ユーザーインタラクションを処理します（これはWooCommerceによって実装されます。）

## Registering the server-side provider

### Step 1: Create a WC_Address_Provider subclass

Create a PHP class that extends `WC_Address_Provider`:

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

### Step 2: Register the provider

Register your provider with WooCommerce using the `woocommerce_address_providers` filter:

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

## Registering the client-side provider

### Step 3: Implement JavaScript functions

クライアント側のプロバイダ・ロジックを実装するJavaScriptファイルを作成します。

#### Provider Object API

### Parameters

- _id_ `string` - Unique identifier that must match the server-side provider ID.
- _canSearch_ `function` - Function to determine if the provider supports searching in a given country.
    - Parameters:
        - _country_ `string` - Two-letter country code (e.g., 'US', 'GB').
    - Returns: `boolean` - Whether the provider supports this country.
- _search_ `function` - Asynchronous function to search for address suggestions.
    - Parameters:
        - _query_ `string` - The text entered by the user (minimum 3 characters).
        - _country_ `string` - Two-letter country code of the selected country.
        - _type_ `string` - Address type, either 'billing' or 'shipping'.
    - Returns: `Promise<Array>` - Promise resolving to an array of suggestion objects.
- _select_ `function` - Asynchronous function to retrieve complete address details.
    - Parameters:
        - _addressId_ `string` - The ID of the selected suggestion.
    - Returns: `Promise<Object|null>` - Promise resolving to an address object or null on error.

### Suggestion Object Format

The `search` function must return suggestion objects with the following structure:

- _id_ `string` - Unique identifier for this suggestion.
- _label_ `string` - Display text shown to the user.
- _matchedSubstrings_ `array` (optional) - Array of text ranges to highlight in the label.
    - _offset_ `number` - Starting position of matched text.
    - _length_ `number` - Length of matched text.

### Address Object Format

The `select` function must return address objects with these WooCommerce field names:

- _address_1_ `string` - Primary address line.
- _address_2_ `string` - Secondary address line (optional, can be empty string).
- _city_ `string` - City or town name.
- _state_ `string` - State or province code.
- _postcode_ `string` - ZIP or postal code.
- _country_ `string` - Two-letter country code.

### Example Implementation

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

### Step 4: Enqueue the JavaScript

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

## REST API Implementation

JavaScriptプロバイダーは、REST APIエンドポイントを介してサーバーと通信します。2つのエンドポイントを作成する必要があります：

1. **Address Search Endpoint** (`/wp-json/your-plugin/v1/address-search`)
   - Accepts: query string, country code, address type
   - Returns: Array of suggestions with IDs and labels

2. **Address Details Endpoint** (`/wp-json/your-plugin/v1/address-details`)
   - Accepts: Address/place ID
   - Returns: Complete address components

For implementation details, refer to the [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/).


## Troubleshooting

### Common Issues

1. **チェックアウトにプロバイダが表示されない
   - プロバイダがサーバに登録されていることを確認する
   - JavaScriptファイルがロードされていることを確認する
   - PHPとJavaScriptの間でプロバイダIDが一致していることを確認する

2. **提案が表示されません
   - ブラウザのコンソールでJavaScriptエラーを確認する
   - APIエンドポイントがアクセス可能か確認する
   - 国がプロバイダーによってサポートされていることを確認する
   - 検索クエリが3文字以上であることを確認する。

3. **Fields not populating on selection**
   - Verify `select` method returns correct field names
   - Check that address data matches WooCommerce field structure
