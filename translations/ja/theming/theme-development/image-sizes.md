---
post_title: Image sizing for theme developers
sidebar_label: Image sizing
---

# Image sizing for theme developers

**注意:** このドキュメントは（ブロックテーマではなく）クラシックテーマを開発する際に使用するために作成されました。ブロックテーマの開発](../block-theme-development/theming-woo-blocks.md)については別のドキュメントを確認してください。

カタログに画像を表示するために、WooCommerceは使用される実際の画像寸法を定義するいくつかの画像サイズを登録します。これらのサイズには以下が含まれます：

- `woocommerce_thumbnail` - used in the product 'grids' in places such as the shop page.
- `woocommerce_single` - used on single product pages.
- `woocommerce_gallery_thumbnail` - used below the main image on the single product page to switch the gallery.

`woocommerce_single` shows the full product image, as uploaded, so is always uncropped by default. It defaults to 600px width. `woocommerce_gallery_thumbnail` is always square cropped and defaults to 100x100 pixels. This is used for navigating images in the gallery. `woocommerce_thumbnail` defaults to 300px width, square cropped so the product grids look neat. The aspect ratio for cropping can be customized by the store owner. It is important to note that despite the actual image widths that are set, themes can ultimately change the size images are displayed using CSS, and image widths may be limited by the product grid/column widths.

## Themes can define image sizes

WooCommerce 3.3.0から、テーマはWooCommerceのサポートを宣言する際に、どのサイズを使用するかを宣言できるようになりました。テーマが画像サイズ（幅）を定義した場合、ストアオーナーは変更することはできませんが、定義されたサイズはテーマに最適なものでなければなりません。

```php
add_theme_support( 'woocommerce', array(
    'thumbnail_image_width' => 200,
    'gallery_thumbnail_image_width' => 100,
    'single_image_width' => 500,
) );
```

When calling WordPress functions which expect an image size e.g. [`wp_get_attachment_image_src`](https://developer.wordpress.org/reference/functions/wp_get_attachment_image_src), you should use the image size names - these are:

- `woocommerce_thumbnail`
- `woocommerce_single`
- `woocommerce_gallery_thumbnail`

店舗のオーナーは、アスペクト比やトリミングをコントロールできる（下記参照）。

## Customize image sizes in the customizer

The customizer houses the options which control thumbnails in WooCommerce. ![Settings in the customizer](https://woocommerce.wordpress.com/wp-content/uploads/2017/12/imagefeature.png?w=712) If the theme is declaring image sizes, the top section will be hidden and only the cropping option will be visible. Changing the cropping option, or widths, will update the preview on the right side to show how things will look. Changes will not be visible to customers until the customizer is  'published' and [the thumbnails have been regenerated to the new dimensions](./thumbnail-image-regeneration.md). The thumbnail cropping section in the customizer allows store owners to select one of three cropping ratio settings for images in the catalog:

- 1:1（正方形トリミング）
- カスタム（ストアオーナーがカスタムアスペクト比を入力可能）
- 非トリミング（単一の画像の縦横比を保持する）

実際の画像寸法は、選択された切り抜きオプションと画像幅に基づいて計算されます。

## Changing image sizes via hooks

Whilst themes can fix image sizes at certain widths, and store owners can control widths and aspect ratios, if you need more control over thumbnail sizes there are some hooks available to you. The `wc_get_image_size` function is used by WooCommerce to get the image size dimensions. The return value of this is passed through a filter: `woocommerce_get_image_size_{SIZE_NAME_WITHOUT_WOOCOMMERCE_PREFIX}` If using this hook you'll be passed an array of sizes, similar to this:

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

We don't recommend plugins and themes go this route because it removes control from the store owner and their settings won't be respected, but the option is there for store owners. **Note:** after making changes to image sizes you may need to [regenerate your thumbnails](https://github.com/woocommerce/woocommerce/wiki/Thumbnail-Image-Regeneration-in-3.3) so the new sizes are used for existing images.

## Changing what image sizes are used in WooCommerce via hooks

上記のフックと同様に、WooCommerceのいくつかのテンプレート関数は画像サイズをフィルタを通して実行するので、WooCommerceに登録されている画像サイズ以外を使用することができます。以下のフィルタがあります：

| Filter                                | Description                                                       | Default                            |
|---------------------------------------|-------------------------------------------------------------------|------------------------------------|
| `single_product_archive_thumbnail_size` | Controls the size used in the product grid/catalog.                | `woocommerce_thumbnail`            |
| `subcategory_archive_thumbnail_size`    | Controls the size used in the product grid/catalog for category images. | `woocommerce_thumbnail`            |
| `woocommerce_gallery_thumbnail_size`    | Controls the size used in the product gallery, below to main image, to switch to a different image. | Array representing the dimensions of the `gallery_thumbnail` image size. Usually `array( 100, 100 )`. |
| `woocommerce_gallery_image_size`        | Controls the size used in the product gallery.                    | `woocommerce_single`               |
| `woocommerce_gallery_full_size`         | Controls the size used in the product gallery to zoom or view the full size image. | `full`                             |

**Note:** `full` is a size registered by WordPress and set in `Settings > Media.` As an example, let's say I wanted to make the gallery thumbnail size used the `thumbnail` size registered by WordPress instead of `woocommerce_gallery_thumbnail`. The following snippet would do the job:

```php
add_filter( 'woocommerce_gallery_thumbnail_size', function( $size ) {
    return 'thumbnail';
} );
```

**注意:** 上記のフックはWooCommerceコアで使用されます。テーマがカスタムテンプレートファイルを持っていたり、独自の関数を使用して画像を出力している場合、これらのフィルタは使用されない可能性があります。
