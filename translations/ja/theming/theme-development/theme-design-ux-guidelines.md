---
post_title: Theme design and user experience guidelines
sidebar_label: Theme design and user experience guidelines
---

# Theme design and user experience guidelines

このガイドでは、優れたオンラインショッピング体験を提供し、売上を最大化し、使いやすさ、シームレスな統合、強力なUXの採用を保証するために、テーマのエクスペリエンスがeコマース業界の標準とWooCommerceに沿ったものであることを確認するために従うべき一般的なガイドラインとベストプラクティスをカバーしています。

We recommend you review the [UI best practices for WordPress](https://developer.wordpress.org/themes/advanced-topics/ui-best-practices/) to ensure your theme is aligned with the WordPress theme requirements.

Make sure your theme fits one or more industries currently available in the [WooCommerce themes store](https://woocommerce.com/product-category/themes). It's important that the theme offers enough originality and distinctiveness in its design, while keeping it familiar, in order to be distinguished from other themes on the WooCommerce theme store. Your theme should avoid copying existing themes on the WooCommerce theme store or other WordPress theme marketplaces.

## Design


高品質のデザインはオンラインショップの重要な側面であり、それはテーマのデザインとコンテンツによって左右される。テーマのデザインは、シンプルで、一貫性があり、すっきりしていて、記憶に残りやすく、直感的で、効率的で、機能的でなければなりません。WooCommerceの新しいテーマをデザインする際には、以下の点に特別な注意を払う必要があります：

### Layout

テーマは、階層、フロー、コンテンツのバランス、ホワイトスペースの点で業界標準に達していなければならない。

店舗ページ（ショップ、商品ページ、カテゴリー、カート、チェックアウト、プロフィールページなど）はWooCommerceテーマの中心的なポイントであるため、テーマ作成者は店舗ページがテーマとシームレスにフィットするようにしなければなりません。

テーマは、ラップトップ、タブレット、スマートフォンなどの一般的なデバイスでアクセスできるよう、完全に機能し、最適化されることが期待される。

### Typography

テーマは、快適な読書体験を促進するエレガントで読みやすいフォントの組み合わせを提供する必要があります。

フォントサイズ、行幅、行間は、すべてのページとデバイスタイプで一貫性があり、調和がとれていなければなりません。

テーマのタイポグラフィは、互いに補完し合う少数の書体で構成されなければならない。

ボタンやタブなど一部のUI要素を除き）すべて大文字を避け、適切な大文字を使用する。

### Iconography

テーマで使用されているアイコンは、それが表現している行為や状況を直接的に意味するものであり、サイズや位置、色に関して一貫して使用されている。

### Color

テーマは、UI要素やすべてのページで調和のとれた一貫性のある配色に従わなければなりません。配色は、以下のような少数の色で構成する：

- 原色／アクセントの支配色
- 原色を補う1色または2色の副色
- 中間色（白、黒、グレー）

The color palette used in text and graphical UI components must be compliant with the [WCAG AA conformance level](https://www.w3.org/TR/WCAG20/#conformance) or above.

### Patterns

テーマは、次のような、ページ全体で使用される一貫した一連のパターンを採用しなければならない：

- ナビゲーション、サイドバー、フッター
- コンテンツブロック（タイトル、段落、リスト、商品詳細、レビュー、画像ショーケースなど）
- フォームの構造と要素（フィールド、ドロップダウン、ボタンなど）
- テーブル
- リスト
- お知らせ

## Accessibility

The theme must meet the [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG20/) (WCAG). Meeting 100% conformance with WCAG 2.0 is hard work; meet the AA level of conformance at a minimum.

For more information on accessibility, check out the [WordPress accessibility quick start guide](https://make.wordpress.org/accessibility/handbook/best-practices/quick-start-guide/).

## Customization

テーマは、どのような初期設定もカスタマイザーに頼らなければならない。特定のオンボーディングフローは許可されていません。

レイアウトオプション、追加機能、ブロックオプションなど、テーマがサポートするあらゆるカスタマイズは、カスタマイザーまたはテーマに含まれるブロックのブロック設定で提供されるべきです。

Themes should not bundle or require the installation of additional plugins/extensions (or frameworks) that provide additional options or functionality. For more information on customisation, check out the [WordPress theme customization API](https://codex.wordpress.org/Theme_Customization_API)**.**

アクティベーションの際、テーマがWordPressテーマのアクティベーションフローを上書きして、ユーザーを他のページに移動させるようなことがあってはなりません。

## Branding

テーマには、オンラインストアの正常な運営を妨げるような場所に、テーマ作者のブランド名やリファレンスを含めてはなりません。テーマ作者は、テーマフッターに自分のウェブサイトへのリンクを含めることができます。アフィリエイトリンクは許可されません。

管理インターフェイスでは、告知、バナー、大きなロゴ、宣伝用資料の使用は禁止されています。

## Demos and sample content

テーマ作成者は、テーマ提出の際、テーマを展示しテストする方法を提供しなければなりません。サンプルコンテンツ/デモは、商人の混乱や期待の裏切りを避けるため、成果物に存在しないカスタムグラフィック/アセットの使用を控えること（例：ロゴ、イラストの使用）。特定のバーティカルテーマのためにテーマを作成する場合は、そのバーティカルテーマに沿ったサンプルコンテンツを使用することを検討してください。

すべての画像と文章は、すべての年齢層に適したものでなければならない。テーマ作成者は、年齢や国籍などを包括したイメージの使用を検討すべきである。テーマは「ストックフォト」のようなイメージの使用は控えること。

テーマは、画像、フォント、アイコンなどのアセットに必要なライセンスがすべてクリアされた状態で配布されなければなりません。
