---
post_title: Image sizing for theme developers
sidebar_label: Image sizing
---
# テーマ開発者のための画像サイズ調整

[**注意:** このドキュメントは（ブロックテーマではなく）クラシックテーマを開発する際に使用するために作成されました。ブロックテーマの開発](../block-theme-development/theming-woo-blocks.md)については別のドキュメントを確認してください。

カタログに画像を表示するために、WooCommerceは使用される実際の画像寸法を定義するいくつかの画像サイズを登録します。これらのサイズには以下が含まれます：

- `woocommerce_thumbnail` - ショップページなどの商品の「グリッド」で使用されます。
- `woocommerce_single` - 単品商品ページで使用されます。
- `woocommerce_gallery_thumbnail` - 単品商品ページのメイン画像の下に使用され、ギャラリーを切り替えます。

`woocommerce_single`は、アップロードされたままの商品画像を表示するため、デフォルトでは常にノートリミングで表示されます。デフォルトの幅は600pxです。`woocommerce_gallery_thumbnail`は常に正方形にトリミングされ、デフォルトは100x100ピクセルです。これはギャラリー内の画像をナビゲートするために使用されます。`woocommerce_thumbnail`のデフォルトは幅300pxで、正方形にトリミングされます。トリミングの縦横比はストアオーナーがカスタマイズできます。実際の画像幅が設定されているにもかかわらず、テーマは最終的にCSSを使用して画像の表示サイズを変更することができ、画像幅は商品グリッド/カラム幅によって制限される可能性があることに注意することが重要です。

## テーマは画像サイズを定義できる

WooCommerce 3.3.0から、テーマはWooCommerceのサポートを宣言する際に、どのサイズを使用するかを宣言できるようになりました。テーマが画像サイズ（幅）を定義した場合、ストアオーナーは変更することはできませんが、定義されたサイズはテーマに最適なものでなければなりません。

```php
add_theme_support( 'woocommerce', array(
    'thumbnail_image_width' => 200,
    'gallery_thumbnail_image_width' => 100,
    'single_image_width' => 500,
) );
```

例えば、[`wp_get_attachment_image_src`](https://developer.wordpress.org/reference/functions/wp_get_attachment_image_src)のように画像サイズを指定するWordPress関数を呼び出す場合は、画像サイズ名を使用する必要があります：

- `woocommerce_thumbnail`
- `woocommerce_single`
- `woocommerce_gallery_thumbnail`

店舗のオーナーは、アスペクト比やトリミングをコントロールできる（下記参照）。

## カスタマイザーで画像サイズをカスタマイズする

[カスタマイザーには、WooCommerceのサムネイルを制御するオプションが格納されています。カスタマイザーでの設定](https://woocommerce.wordpress.com/wp-content/uploads/2017/12/imagefeature.png?w=712) テーマが画像サイズを宣言している場合、上部のセクションは非表示になり、トリミングオプションのみが表示されます。トリミングオプションまたは幅を変更すると、右側のプレビューが更新され、どのように見えるかが表示されます。カスタマイザーが'公開'され、[サムネイルが新しい寸法に再生成](./thumbnail-image-regeneration.md)されるまで、変更はお客様には見えません。カスタマイザーのサムネイル切り抜きセクションでは、ストアオーナーがカタログ内の画像の切り抜き比率を3つの設定から1つ選ぶことができます：

- 1:1（正方形トリミング）
- カスタム（ストアオーナーがカスタムアスペクト比を入力可能）
- 非トリミング（単一の画像の縦横比を保持する）

実際の画像寸法は、選択された切り抜きオプションと画像幅に基づいて計算されます。

## フックによる画像サイズの変更

テーマは特定の幅で画像サイズを固定することができ、ストアオーナーは幅と縦横比をコントロールすることができますが、サムネイルサイズをよりコントロールする必要がある場合は、いくつかのフックを利用することができます。`wc_get_image_size`関数はWooCommerceが画像サイズの寸法を取得するために使用します。この関数の戻り値はフィルターを通して渡されます：`woocommerce_get_image_size_{SIZE_NAME_WITHOUT_WOOCOMMERCE_PREFIX}` このフックを使用すると、以下のようなサイズの配列が渡されます：

```php
array(
    'width' => 200,
    'height' => 200,
    'crop' => 1,
)
```

例えば、ギャラリーのサムネイルを150x150pxの非トリミング画像に変更したい場合、以下のコードを使用できます：

```php
add_filter( 'woocommerce_get_image_size_gallery_thumbnail', function( $size ) {
    return array(
        'width' => 150,
        'height' => 150,
        'crop' => 0,
    );
} );
```

プラグインやテーマがこのような方法をとることは、ストアオーナーからのコントロールを排除し、彼らの設定が尊重されないため、お勧めしませんが、ストアオーナーにはオプションがあります。 **注意:**画像サイズを変更した後は、新しいサイズが既存の画像に使用されるように、[サムネイルを再生成](https://github.com/woocommerce/woocommerce/wiki/Thumbnail-Image-Regeneration-in-3.3)する必要があるかもしれません。

## WooCommerceで使用する画像サイズをフックで変更する

上記のフックと同様に、WooCommerceのいくつかのテンプレート関数は画像サイズをフィルタを通して実行するので、WooCommerceに登録されている画像サイズ以外を使用することができます。以下のフィルタがあります：

| フィルター｜説明｜デフォルト
|---------------------------------------|-------------------------------------------------------------------|------------------------------------|
|`single_product_archive_thumbnail_size` | 商品グリッド/カタログで使用されるサイズを制御します。                | `woocommerce_thumbnail` | 商品グリッド/カタログで使用されるサイズを制御します。
|`subcategory_archive_thumbnail_size` | 商品グリッド/カタログでカテゴリー画像に使用されるサイズをコントロールします。| `woocommerce_thumbnail`｜カテゴリ画像のサイズをコントロールします。
|`woocommerce_gallery_thumbnail_size` | メイン画像の下にある商品ギャラリーで、別の画像に切り替える際に使用するサイズをコントロールします。| `gallery_thumbnail`画像サイズの寸法を表す配列。通常は`array( 100, 100 )`です。|
| `woocommerce_gallery_image_size`｜商品ギャラリーで使用されるサイズをコントロールします。                    | `woocommerce_single`｜商品ギャラリーで使用されるサイズをコントロールします。
| `woocommerce_gallery_full_size`｜商品ギャラリーで使用されるズームまたはフルサイズの画像を表示するサイズをコントロールします。| `full`｜商品ギャラリーで使用されるサイズをコントロールします。

**注:** `full`はWordPressが登録し、`Settings > Media.`に設定されたサイズです。 例として、ギャラリーのサムネイルサイズを`woocommerce_gallery_thumbnail`ではなく、WordPressが登録した`thumbnail`にしたいとします。以下のスニペットで実現できる：

```php
add_filter( 'woocommerce_gallery_thumbnail_size', function( $size ) {
    return 'thumbnail';
} );
```

**注意:** 上記のフックはWooCommerceコアによって使用されます。テーマがカスタムテンプレートファイルを持っていたり、独自の関数を使用して画像を出力している場合、これらのフィルタは使用されない可能性があります。
