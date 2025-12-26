---
post_title: Advanced settings and customization for legacy Local Pickup
current wccom url: 'https://woocommerce.com/document/local-pickup/#advanced-settings-customization'
note: >-
  Docs links out to Skyverge's site for howto add a custom email - do we have
  our own alternative?
---
# レガシーローカルピックアップの高度な設定とカスタマイズ

## 地方送迎を利用する場合、地方税を無効にする

Local Pickupは、デフォルトではお客様の住所ではなく、お店の所在地（住所）に基づいて税金を計算します。このスニペットをテーマの`functions.php`の最後に追加することで、代わりに標準の税金設定を使用することができます：

```php
add_filter( 'woocommerce_apply_base_tax_for_local_pickup', '__return_false' );
```

ローカルピックアップを選択した場合、店舗所在地ベースの税金ではなく、通常の税金が使用される。 

## 地方税の納税地を変更する

地域のピックアップ場所の郵便番号と都市に基づいて地方税を請求するには、このコード例を使用して、ショップのベースとなる都市と郵便番号を定義する必要があります：

```php
add_filter( 'woocommerce_countries_base_postcode', create_function( '', 'return "80903";' ) );
add_filter( 'woocommerce_countries_base_city', create_function( '', 'return "COLORADO SPRINGS";' ) );
```

`80903`をご希望の郵便番号/郵便番号に、`COLORADO SPRINGS`をご希望の市町村名に更新してください。

## ローカルピックアップ用カスタムEメール

配送方法としてLocal Pickupを使用した場合、_Shipping Address_が管理者の注文メールに表示されない。

すべてのコア配送オプションは、標準の注文フローを使用しているため、顧客はローカルピックアップまたは他の配送オプションを選択した場合でも、同じ注文確認メールを受信します。 
地域集荷の注文に別のメールを送信したい場合は、このガイドを使用して地域集荷用のカスタムメールを作成してください：[WooCommerceカスタムメールを追加する方法](https://www.skyverge.com/blog/how-to-add-a-custom-woocommerce-email/).
