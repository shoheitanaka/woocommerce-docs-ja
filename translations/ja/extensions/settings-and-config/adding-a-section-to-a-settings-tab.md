---
post_title: How to add a section to a settings tab
sidebar_label: Add a section to a settings tab
---

# How to add a section to a settings tab

WooCommerceの拡張機能で何らかの設定が必要な場合、自問することが重要です：  **もしあなたのエクステンションがいくつかの簡単な設定を持つだけなら、それ専用の新しいタブを作る必要があるでしょうか？ほとんどの場合、答えはノーです。

## いつセクションを作るか

一つの商品ページにスライダーを追加するエクステンションがあるとします。このエクステンションにはいくつかのオプションしかありません：

-   単一商品ページに自動挿入（チェックボックス）
-   スライダータイトル（テキストフィールド）

特に**商品**に関連する2つのオプションのみです。WooCommerceの商品設定(**WooCommerce > 設定 > 商品**)に追加することは簡単ですが、ユーザーフレンドリーではありません。ユーザーは最初にどこを見ればいいのかわからず、すべての商品オプションをスキャンしなければなりませんし、オプションを直接リンクするのは難しいか不可能でしょう。幸いなことに、WooCommerce 2.2.2の時点で、コア設定のタブの1つの下に新しい**セクション**を追加できる新しいフィルタがあります。

## セクションの作り方

個々の関数を通してこれを行う方法を説明しますが、おそらく、すべての設定メソッドを格納するクラスを作成する必要があります。

`woocommerce_get_sections_products`フィルターにフックすることで、このようにできる：

```php
/**

* Create the section beneath the products tab

**/

add_filter( 'woocommerce_get_sections_products', 'wcslider_add_section' );

function wcslider_add_section( $sections ) {

    $sections['wcslider'] = __( 'WC Slider', 'text-domain' );

    return $sections;

}
```

_[wc-create-section-beneath-products.php](https://gist.github.com/woogists/2964ec01c8bea50fcce62adf2f5c1232/raw/da5348343cf3664c0bc8b6b132d8105bfcf9ca51/wc-create-section-beneath-products.php)_。

wcslider**の部分を拡張機能の名前/テキストドメインに合わせて変更してください。`woocommerce_get_sections_products`フィルターで重要なのは、最後の **products** という部分が、セクションを追加したいタブであるということです。つまり、アカウント・セクションに新しいタブを追加したい場合は、`woocommerce_get_sections_accounts`フィルターにフックします。

## セクションに設定を追加する方法

タブを取得したので、`woocommerce_get_sections_products` (または同様のもの) の出力をフィルタリングする必要があります。通常のように [**WooCommerce Settings API**](./settings-api.md) を使用して設定を追加しますが、タブの設定配列に設定を追加する前に現在のセクションをチェックします。例えば、先ほど作成した新しい **wcslider** セクションに、上で説明したサンプル設定を追加してみましょう：

```php
/**

* Add settings to the specific section we created before

*/

add_filter( 'woocommerce_get_settings_products', 'wcslider_all_settings', 10, 2 );

function wcslider_all_settings( $settings, $current_section ) {

/**

* Check the current section is what we want

**/

  if ( $current_section == 'wcslider' ) {
  
      $settings_slider = array();
    
      // Add Title to the Settings
      
      $settings_slider[] = array( 'name' => __( 'WC Slider Settings', 'text-domain' ), 'type' => 'title', 'desc' => __( 'The following options are used to configure WC Slider', 'text-domain' ), 'id' => 'wcslider' );
      
      // Add first checkbox option
      
      $settings_slider[] = array(
      
          'name' => __( 'Auto-insert into single product page', 'text-domain' ),
          
          'desc_tip' => __( 'This will automatically insert your slider into the single product page', 'text-domain' ),
          
          'id' => 'wcslider_auto_insert',
          
          'type' => 'checkbox',
          
          'css' => 'min-width:300px;',
          
          'desc' => __( 'Enable Auto-Insert', 'text-domain' ),
      
      );
      
      // Add second text field option
      
      $settings_slider[] = array(
      
          'name' => __( 'Slider Title', 'text-domain' ),
          
          'desc_tip' => __( 'This will add a title to your slider', 'text-domain' ),
          
          'id' => 'wcslider_title',
          
          'type' => 'text',
          
          'desc' => __( 'Any title you want can be added to your slider with this option!', 'text-domain' ),
      
      );
      
      $settings_slider[] = array( 'type' => 'sectionend', 'id' => 'wcslider' );
      
      return $settings_slider;
    
    /**
    
    * If not, return the standard settings
    
    **/
    
    } else {
    
        return $settings;
  
    }

}

```

_[wc-add-settings-section.php](https://gist.github.com/woogists/4038b83900508806c57a193a2534b845#file-wc-add-settings-section-php)_

同じ`woocommerce_get_sections_products`フィルターにフックしていますが、今回は新しい設定を追加する前に、`$current_section`が先に定義したカスタム・セクション（wcslider）と一致するかチェックします。

## 新しい設定を使う

他の WordPress / WooCommerce 設定と同じように、[**get_option**](http://codex.wordpress.org/Function_Reference/get_option) 関数と定義された ID を使って、新しく作成した設定を使用します。例えば、以前に作成した**wcslider_auto_insert**オプションを使用するには、以下のコードを使用するだけです：  `get_option( 'wcslider_auto_insert' )`

## 結論

WooCommerceのエクステンションを作成する場合、設定を作成する前に、設定がどこに属するかを考えましょう。便利な製品を作るための鍵は、エンドユーザーにとって使いやすくすることです。そのため、適切な設定の配置は決定的に重要です。WooCommerceに設定を追加する具体的な情報については、[**Settings API documentation**](https://github.com/woocommerce/woocommerce/blob/trunk/docs/extension-development/settings-api.md) をご覧ください。
