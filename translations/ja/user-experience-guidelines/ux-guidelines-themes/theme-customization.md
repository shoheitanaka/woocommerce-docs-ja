---
post_title: Customization
sidebar_label: Customization
---

# Customization

> このガイドラインのこのページは、ブロックテーマ以外の開発のみに適用されます。ブロックテーマの開発に関するより具体的なガイダンスについては、[WordPress Developer's Guide to Block Themes](https://learn.wordpress.org/course/a-developers-guide-to-block-themes-part-1/) を参照してください。

テーマは、どのような初期設定もカスタマイザーに頼らなければならない。特定のオンボーディングフローは許可されていません。

レイアウトオプション、追加機能、ブロックオプションなど、テーマがサポートするあらゆるカスタマイズは、カスタマイザーまたはテーマに含まれるブロックのブロック設定で提供されるべきです。

テーマは、追加のオプションや機能を提供する追加のプラグイン/拡張機能（またはフレームワーク）をバンドルしたり、インストールを要求すべきではありません。カスタマイズの詳細については、[WordPress theme customization API](https://codex.wordpress.org/Theme_Customization_API) をご覧ください。

アクティベーションの際、テーマがWordPressテーマのアクティベーションフローを上書きして、ユーザーを他のページに移動させるようなことがあってはなりません。
