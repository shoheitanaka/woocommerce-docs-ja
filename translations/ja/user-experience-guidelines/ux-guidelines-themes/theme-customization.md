---
post_title: Customization
sidebar_label: Customization
---

# Customization

> This page of the guidelines applies to development of non-block themes only. For more specific guidance on development of block themes, refer to the [WordPress Developer's Guide to Block Themes](https://learn.wordpress.org/course/a-developers-guide-to-block-themes-part-1/).

テーマは、どのような初期設定もカスタマイザーに頼らなければならない。特定のオンボーディングフローは許可されていません。

レイアウトオプション、追加機能、ブロックオプションなど、テーマがサポートするあらゆるカスタマイズは、カスタマイザーまたはテーマに含まれるブロックのブロック設定で提供されるべきです。

Themes should not bundle or require the installation of additional plugins/extensions (or frameworks) that provide additional options or functionality. For more information on customisation, check out the [WordPress theme customization API](https://codex.wordpress.org/Theme_Customization_API).

アクティベーションの際、テーマがWordPressテーマのアクティベーションフローを上書きして、ユーザーを他のページに移動させるようなことがあってはなりません。
