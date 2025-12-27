---
post_title: Version control and deployment
sidebar_label: Version control and deployment
sidebar_position: 8
---

# Version control and deployment

WordPressとWooCommerceは、開発者向けのフレームワークであると同時に*コンテンツ管理システムでもあるため、コードをバージョン管理し、変更をライブ環境にデプロイする方法を事前に計画することが重要です。一般的なルールとして、「コードは上に、コンテンツは下に」というものがあります。つまり、カスタムコードはローカルまたはステージング環境からプッシュしますが、`wp-content/uploads`ディレクトリにあるデータベースの内容やユーザーが作成したコンテンツは決してプッシュしないということです。

## 考察

WordPressの導入に万能なアプローチはありません。特に[WordPress [VIP](https://docs.wpvip.com/development-workflow/)のようなエンタープライズレベルのホストの場合、ホスティング環境には従うべき専用のアプローチがあるかもしれません。 

WordPressインストールの[プロジェクト構造](/docs/getting-started/project-structure)と独自のニーズに基づいて、`wp-content`ディレクトリのさまざまな部分をバージョン管理してデプロイすることができます。一般的なアプローチには次のようなものがあります：

1.バージョン管理はWordPressのルートディレクトリから始まりますが、ホスティング会社がWordPressのアップデートを管理している場合は、WordPressのコアとプラグインのほとんどを無視する`.gitignore`ファイルが含まれます。`.gitignore`ファイルの例は[GitHubから](https://github.com/github/gitignore/blob/main/WordPress.gitignore)入手可能で、カスタムコードのバージョン管理を確実にするために更新することができます。このアプローチは、各サイトを独自のリポジトリで管理しているビルダーに人気があります。   
2.通常、`wp-content/plugins/your-extension` または `wp-content/themes/your-theme` で作業しているディレクトリだけをバージョン管理します。このアプローチは、複数のサイトにコードを広く配布している拡張機能やテーマの開発者により一般的です。

**注意:** `wp-config.php` ファイルを公開リポジトリにコミットしないでください。機密情報が含まれている可能性がありますし、ローカル環境と本番環境の違いがある可能性が高いからです。 

## ビルドと配備

ほとんどのWordPressホスティング環境は、NodeやComposerをサポート*していません。デプロイ先の環境に確認する必要がありますが、ワークフローをセットアップする際には、このことを覚えておいてください。一般的なアプローチには以下のようなものがあります：

1.ビルドしたファイルをリポジトリにコミットする。例えば、WordPress.org ディレクトリにあるプラグインやテーマは、簡単に更新できるようにビルドされたアセットをすべて含んでいます。  
2.GitHub Actionsのようなツールや別のCI/CDパイプラインを使ってビルドステップを追加する。
