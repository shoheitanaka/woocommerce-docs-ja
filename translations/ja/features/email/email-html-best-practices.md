---
post_title: HTML best practices
sidebar_label: HTML best practices
---

# Email HTML - Best Practices

<!-- markdownlint-disable MD024 -->

## Overview

メールのデザインや開発には、従来のウェブ開発とは異なるアプローチが必要です。このガイドでは、HTMLメールをすべての主要なメールクライアントで正しく表示するためのベストプラクティスを概説します。

### Key principles

- **幅メールの幅を600～640pxの間に保ちましょう。これにより、小さな画面でも横スクロールすることなく、すべてのデバイスでメールが適切に表示されます。
- **ファイルサイズ大きなメールはGmailや他のプロバイダーでクリップされる可能性があり、モバイルデバイスでの読み込みに時間がかかります。
- **テーブル**：ウェブでは非推奨ですが）レイアウトにはテーブルを使いましょう - メールクライアントはCSSのサポートに一貫性がありませんが、テーブルレンダリングは信頼できます。
- **テスト**：複数のメールクライアントとデバイスでテストする - メールクライアントによってHTMLのレンダリングは異なります。

## HTML

### Use older, simpler HTML standards

- Use HTML 4.01 or XHTML 1.0 - Many email clients use outdated rendering engines and don't support modern HTML5 features.
- Avoid HTML5 elements in the main structure - Elements like `<section>`, `<article>`, and `<aside>` aren't supported in all email clients.
- Always use lowercase for tags and attributes - This ensures maximum compatibility and prevents rendering issues in strict clients.
- Always use quotes for attribute values - Unquoted attributes can cause parsing errors in some email clients.
- Close all tags, even self-closing ones with a trailing slash (`<br />`) - This prevents rendering issues in clients that expect XHTML-style syntax.

### Tables as the foundation

- Use nested tables for layout instead of div-based layouts - Tables provide consistent structure across email clients with poor CSS support.
- Set explicit cell padding, spacing, and dimensions - This prevents inconsistent spacing and layout across different email clients.
- Declare width on table elements and on cells - Double-declaring widths improves rendering consistency, especially in Outlook.
- Use `align` and `valign` attributes instead of CSS equivalents - These HTML attributes have better support than CSS positioning in email clients.

```html
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td align="center" valign="top">
            <!-- Content here -->
        </td>
    </tr>
</table>
```

### Avoid problematic elements

- JavaScriptなし - ほとんどのメールクライアントはセキュリティ上の理由からJavaScriptを無効にしています。
- フォームなし（一部のクライアントはサポートしていますが） - フォームのサポートは非常に一貫性がありません。
- iframeを使用しない - セキュリティ上の理由から、ほとんどのメールクライアントで除去されます。
- 背景画像なし（必要に応じてフォールバックを使用） - 多くのメールクライアントは、デフォルトで背景画像を無効にしています。
- オーディオ/ビデオを埋め込まない（代わりにホストされているコンテンツにリンクする） - 直接埋め込むことはサポートされていません。

## CSS

### CSS Support Limitations

- Use inline CSS for everything critical - Many email clients strip `<style>` tags or ignore them entirely.
- Avoid CSS shorthand properties (use `margin-top` instead of `margin`) - Some email clients only recognize individual properties, not shorthand.
- Avoid CSS positioning properties (`position`, `float`, `clear`) - These are poorly supported and can cause layout issues.
- Avoid advanced selectors (stick to element, class, and ID selectors) - Complex selectors often fail in email clients with limited CSS support.

### Always use inline styles

```html
<p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
    Your content here
</p>
```

### Limited use of style tags

- Use for email client-specific hacks only
- Be careful with media queries (support varies)
- Always include the type attribute: `<style type="text/css">`

### Supported vs unsupported CSS

**よくサポートされている：**。

- `font-family`, `font-size`, `color` - Basic text styling has consistent support across email clients.
- `text-align`, `line-height` - Text alignment and spacing properties work reliably in most clients.
- `width`, `height`, `padding`, `margin` (with caution) - Basic box model properties work when used conservatively. Margin doesn't work properly in Outlook.
- `border`, `background-color` - These visual properties have good support in most email clients.

**サポートが不十分、または一貫性がない。

- Flexbox, Grid - Modern layout systems are not supported in many email clients, particularly Outlook.
- Positioning properties (`position`, `display`) - These can cause emails to render differently or break layouts in some clients.
- CSS transitions, animations - These are stripped or ignored by most email clients.
- Many pseudo-classes and pseudo-elements - Support is inconsistent; Outlook and some webmail clients ignore them completely.

## Layout Techniques

### Single column design

- すべてのクライアントで最も信頼性が高い - シンプルなレイアウトは失敗のポイントが少ない。
- 推奨幅：600px - ほとんどのプレビューペインとモバイル画面に収まります。
- レスポンシブでなくてもモバイルで問題なく動作 - シングルカラムは、最小限の問題で狭い画面に自然に適応します。

### Multi-column layouts with tables

```html
<table border="0" cellpadding="0" cellspacing="0" width="600">
    <tr>
        <td width="300" valign="top">
            <!-- Column 1 content -->
        </td>
        <td width="300" valign="top">
            <!-- Column 2 content -->
        </td>
    </tr>
</table>
```

### Column stacking techniques

- サポートされている場合はメディアクエリを使用する - メディアクエリによって、サポートしているクライアントではモバイルデバイス上でカラムがスタックするようになります。
- Outlook用のMSO条件付きコメントを使用する - これは特にOutlookを対象としており、レスポンシブレイアウトのための特別な処理が必要です。
- メディアクエリをサポートしていないクライアントには、ハイブリッド/スポンジーアプローチを考慮する - このテクニックは、メディアクエリをサポートしていなくても、適度に適応するレイアウトを作成します。

```html
<!--[if mso]>
<table border="0" cellpadding="0" cellspacing="0" width="600">
<tr><td width="300" valign="top"><![endif]-->
<div style="display: inline-block; width: 300px; vertical-align: top;">
    <!-- Column 1 content -->
</div>
<!--[if mso]></td><td width="300" valign="top"><![endif]-->
<div style="display: inline-block; width: 300px; vertical-align: top;">
    <!-- Column 2 content -->
</div>
<!--[if mso]></td></tr></table><![endif]-->
```

## Responsiveness

### Mobile-first approach

- モバイルメールの開封数はデスクトップを上回ることが多いため、モバイル最適化は非常に重要です。
- 可能な限りプロポーショナル幅を使用する。
- 適切なフォントサイズ（最低14px）を使用する - 小さいフォントはモバイル端末では読みにくく、ズームが必要になる場合があります。
- タッチターゲットは最低44x44pxにする - アクセシビリティガイドラインに従い、タッチスクリーンでのインタラクションを容易にします。

### Media queries

限定的だが重要なサポート：

```html
<style type="text/css">
    @media screen and (max-width: 480px) {
        .mobile-full-width {
            width: 100% !important;
            height: auto !important;
        }
        
        .mobile-font {
            font-size: 16px !important;
        }
    }
</style>
```

### Fluid hybrid approach

max-widthとMSO条件式を使用して、メディアクエリサポートの有無にかかわらず、クライアント全体で動作します：

```html
<!--[if mso]>
<table width="600" cellpadding="0" cellspacing="0" border="0"><tr><td>
<![endif]-->
<div style="width:100%; max-width:600px; margin:0 auto;">
    <!-- Content -->
</div>
<!--[if mso]>
</td></tr></table>
<![endif]-->
```

## Typography

### Email-safe fonts

常に、広くサポートされているフォントを含むフォントスタックを使用してください：

```css
font-family: Arial, Helvetica, sans-serif;
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
font-family: 'Times New Roman', Times, serif;
font-family: Verdana, Geneva, sans-serif;
font-family: Georgia, Times, 'Times New Roman', serif;
font-family: 'Courier New', Courier, monospace;
```

### Web fonts

- 限定的なサポート - 適切なフォールバックでのみ使用 - 多くのメールクライアントはウェブフォントをサポートしていないため、フォールバックは不可欠です。
- 最も信頼できるサポート：Apple Mail、iOS Mail、AndroidのGoogle Fonts - これらのクライアントは一貫してウェブフォントをレンダリングします。
- Outlook、Gmail、Yahoo！はウェブフォントをサポートしていないことが多い - これらの一般的なクライアントはフォールバックフォントを代わりに表示します。

```html
<style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
</style>

<p style="font-family: 'Open Sans', Arial, sans-serif;">Your text</p>
```

### Text formatting best practices

- フォントサイズは14～16pxを基本に - 小さいフォントは、特にモバイル端末では読みにくくなることがあります。
- 行間はフォントサイズの1.4～1.6倍を目安に - 適切な行間は読みやすさを向上させ、テキストが窮屈に見えるのを防ぎます。
- 大きなテキストブロックは分割しましょう。
- テキストを左寄せにすることで、読みやすさが向上します。
- テキストと背景の間に十分なコントラストをつける。

## Images

### Image guidelines

- Always include the `alt` attribute - This provides text alternatives when images are blocked and improves accessibility.
- Set explicit width and height on all images - This prevents layout shifts when images load and maintains structure when images are blocked.
- Keep image file sizes small (optimize for web) - Large images increase loading time and may exceed file size limits.
- Consider what happens when images are blocked - Many email clients block images by default, so your email should still make sense without them.

```html
<img src="https://example.com/image.jpg" alt="Description of image" width="600" height="400" style="display: block; width: 100%; max-width: 600px; height: auto;" border="0">
```

### Background images

サポートは限定的で、常に予備の bgcolor を提供する：

```html
<table background="https://example.com/bg.jpg" bgcolor="#f7f7f7" width="600" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td>
            Content
        </td>
    </tr>
</table>
```

## Email Client Specifics

### Outlook (Windows)

- Wordのレンダリングエンジン（MSO）を使用 - これは、Outlookのユニークなレンダリングの癖と制限されたCSSサポートについて説明します。
- 背景画像と角丸にはVMLが必要 - これらの効果のための標準的なCSSメソッドは、Outlookでは動作しません。
- Outlook固有のコードにはMSOの条件付きコメントを使用 - これにより、Outlookのバージョンを特別にターゲットにすることができます。

```html
<!--[if mso]>
    Outlook-specific content here
<![endif]-->
```

### Gmail

- スタイル・タグとヘッド・セクションを除去します - 重要なスタイル付けにはインライン・スタイルを使う必要があります。
- 場合によってはclass属性とID属性を削除します - 重要なスタイリングや機能のためにこれらに依存しないでください。
- すべてにインライン スタイルを使用する - これが Gmail でコンテンツをスタイル設定する唯一の信頼できる方法です。
- メールサイズの制限（大きすぎる場合はクリッピング） - 102KBを超えるメールは「メッセージ全体を表示」リンクでクリッピングされます。

### Apple Mail/iOS

- 最高のレンダリング機能 - これらのクライアントは、最新のCSSとHTML標準をサポートしています。
- 最もモダンなCSSをサポート - 主にAppleユーザーをターゲットにしている場合、フレックスボックスやグリッドのような機能を使用できます。
- メディアクエリの優れたサポート - レスポンシブデザインはこれらのプラットフォームで確実に機能します。

## Accessibility

### Semantic structure

- Use semantic HTML where possible (`p`, `h1`, `h2`, etc.) - This improves screen reader interpretation and overall accessibility.
- Add `role="presentation"` to layout tables - This tells screen readers the table is for layout only, not data presentation.
- Include proper heading structure - This creates a logical document outline that helps screen reader users navigate.
- Use `aria-hidden="true"` for decorative elements - This prevents screen readers from announcing purely visual elements.

```html
<table role="presentation" border="0" cellpadding="0" cellspacing="0">
```

### Text alternatives

- 画像には常に説明的なaltテキストを使用する - これにより、スクリーン・リーダーを使用している人々が画像の内容と目的を理解できるようになります。
- 装飾的な画像には空のaltテキストを設定する - これは、スクリーンリーダーが情報を追加しない画像をアナウンスするのを防ぎます。
- 画像をオフにした場合のメールの見え方を考慮する - 多くのユーザーやメールクライアントが画像をブロックしているため、コンテンツは画像なしでも動作するようにしましょう。

### Color and contrast

- 通常のテキストのコントラスト比を最低4.5:1に保つ - これはWCAGアクセシビリティ基準を満たしており、すべてのユーザーにとって読みやすさが向上します。
- 画像内のテキストではなく、実際のテキストを使用する - 画像内のテキストは、スクリーンリーダーにとってアクセシブルではなく、さまざまなデバイスでうまく拡大縮小されません。
- 情報を伝えるのに色だけに頼らない - これは、色覚障害のあるユーザーに対応します。

### Navigation and links

- リンクを簡単に識別できるようにする - 明確なスタイルを使用することで、ユーザーがクリック可能な要素を認識しやすくなります。
- 説明的なリンクテキストを使用する（「ここをクリック」を避ける） - 説明的なリンクは、コンテキストを提供し、スクリーンリーダーのユーザーにとってよりアクセスしやすくなります。
- タッチターゲット間の適切な間隔を確保する - モバイルデバイスでの誤タップを防ぎ、運動機能に障害のあるユーザーを助けます。

## Testing tools and services

- Use professional email testing services like [Litmus](https://www.litmus.com/) and [Email on Acid](https://www.emailonacid.com/) - These platforms provide comprehensive testing across multiple email clients and devices.
- Test in real email clients when possible - While testing services are valuable, real-world testing can catch issues that automated testing might miss.
- Check rendering in both desktop and mobile clients - Mobile email opens often exceed desktop, making mobile testing essential.
- Test with images disabled - Many email clients block images by default, so ensure your email is readable and functional without them.
- Check spam filter scores - Use tools like [Mail-Tester](https://www.mail-tester.com/) to identify potential spam triggers in your email content.
- Validate HTML - Use email-specific validators to catch potential rendering issues before sending.
