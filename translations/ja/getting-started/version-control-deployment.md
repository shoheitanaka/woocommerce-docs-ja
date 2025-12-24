---
post_title: Version control and deployment
sidebar_label: Version control and deployment
sidebar_position: 8
---

# バージョン管理と配備

Because WordPress and WooCommerce are both developer frameworks *and* content management systems, it’s important to plan ahead for how you will version control your code and deploy changes to a live environment. A common rule is that “code goes up, content goes down,” meaning that you’ll push your custom code up from a local or staging environment, but never the contents of your database or user-generated content that lives in the `wp-content/uploads` directory.

#考察

There is no one-size-fits-all approach to deploying WordPress. Your hosting environment may have a dedicated approach that you need to follow, especially at more enterprise-level hosts like [WordPress VIP](https://docs.wpvip.com/development-workflow/). 

Based on the [project structure](/docs/getting-started/project-structure) of a WordPress installation and your unique needs, you may be version controlling and deploying different parts of your `wp-content` directory. Some common approaches include:

1. Version control starts from the root directory of WordPress, but includes a `.gitignore` file that ignores most of WordPress core and plugins, if your hosting company manages WordPress updates for you. An example `.gitignore` file is available [here from GitHub](https://github.com/github/gitignore/blob/main/WordPress.gitignore) and you can update it to ensure that your custom code is version controlled. This approach is more popular with builders who are managing each site in its own repository.   
2. Version control just the directory that you are working in, typically in `wp-content/plugins/your-extension` or `wp-content/themes/your-theme`. This approach is more common for extension and theme developers who are broadly distributing their code across multiple sites.

**Note:** Do not commit your `wp-config.php` file to a public repository. It may include sensitive information and most likely it will have differences from your local and production environments. 

## ビルドと配備

ほとんどのWordPressホスティング環境は、NodeやComposerをサポート*していません。デプロイ先の環境に確認する必要がありますが、ワークフローをセットアップする際にはこのことを覚えておいてください。一般的なアプローチには以下のようなものがあります：

1.ビルドしたファイルをリポジトリにコミットする。例えば、WordPress.org ディレクトリにあるプラグインやテーマは、簡単に更新できるようにビルドされたアセットをすべて含んでいます。  
2.GitHub Actionsのようなツールや別のCI/CDパイプラインを使ってビルドステップを追加する。
