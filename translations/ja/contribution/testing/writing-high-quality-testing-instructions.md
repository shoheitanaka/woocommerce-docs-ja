---
post_title: Writing high quality testing instructions
sidebar_label: Writing testing instructions
---

# Writing high quality testing instructions

## はじめに

プルリクエストに明確なテスト指示を出すことは、WooCommerceにおける品質エンジニアリングの最初のレベルであり、早期にテストを行い、WooCommerceの次期バージョンにおける予期せぬ影響の影響を最小限に抑えるための鍵となります。

このページには以下のセクションがあります：

-   [テストとは何か](#what-is-a-test)
-   [テスト指示で何をカバーするか](#what-to-cover-with-the-testing-instructions)
-   [良いテスト指示を書くための流れ](#flow-to-write-good-testing-instructions)
-   [例題](#examples)

## テストとは何か？

テストとは、何かが特定の基準を満たしているかどうかをチェックするための手法である。一般的には、チェック対象のアクションを実行する前に、テスト対象のシステムを特定の状態にするために必要な手順を含む手順として定義される。したがって、テストは以下の段階から構成される：

-   **前提条件:** チェックしたいアクションを実行する前に、システムを望ましい状態にするために実行する必要があるすべてのステップ。テストには多くの前提条件があり得ます。
-   **アクション(Action):** これは、システムでチェックしたい変化を引き起こす正確なステップです。各テストは理想的には一度に1つのことをカバーすべきなので、1つだけであるべきです。
-   **検証(Validation):** システムでアクションを実行した結果を検証するために実行されるステップに関連します。テストは複数のことを検証することができる。

例えば、商品をカートに入れる過程：

-   前提条件**は、以下のすべてのステップである：
    -   商品作成プロセス
    -   買い物客としてログインすること。
    -   商品が掲載されているショップページに向かうこと。
-   アクション**は、希望する商品の "カートに入れる"_ボタンをクリックすることです。
-   検証**段階は、カートのアイコン（もしあれば）にあと1つの商品が表示され、選択した商品がカートに含まれていることを確認することです。

前提条件、アクション、バリデーションを指定することは、テストの範囲を理解する上で非常に有益である：

-   前提条件**には、テストを成功させるために何をしなければならないかを記述します。
-   アクション**では、テストの目的を知ることができます。言い換えれば、何をテストする必要があるのかを理解する鍵となります。
-   検証** 段階では、テストを実行するときに何を期待すべきかを知ることができます。

この文脈では、プルリクエストやリリースで提供された変更が期待通りに動作することを検証するために実行する必要があるテストを、テスト指示と呼ぶことにする。つまり、テスト指示は、ハッピーパスと潜在的なエッジケースを含む、1つ以上のテストを指す可能性があります。

## テストの指示でカバーすべきこと

前のセクションで述べたように、テスト（我々の文脈ではテスト命令）とは、新しい変更や一連の変更が特定の基準を満たしていることをチェックするための方法である。

実際、PR で導入された変更をカバーするために必要な数のシナリオのテスト指示を含めることが推奨されます。言い換えると、**受入基準をカバーするために必要な数のテスト指示を追加してください**。受入基準とは、_ソフトウェア製品がユーザ、顧客、その他の利害関係者に受け入れられるために満たすべき条件_、PRの文脈では、このPRがユーザ、開発者、WooCommerceコミュニティに受け入れられるために満たすべき条件と理解します。

## 良いテスト指示の書き方

[1. **カバーしたいユーザーの流れ**を概説する。
2. **テスト命令を実行する環境**（サーバー、PHPのバージョン、WPのバージョン、必要なプラグインなど）を定義し、新規インストールから始めるかのようにテスト命令を書き始めます。
3.前提条件**、**アクション**、*検証**ステップを特定します。
4.すべてのフローをテストするために必要なアクションを実行できるように、WooCommerceの状態をどのように設定するかを説明するために**必要なだけの**前提条件**を書きます。
    1.ユーザがWooCommerceで実行する必要があるインタラクションを説明するときは、詳しく書くようにしてください。
    2.公開されているガイドで説明されているユーザーフローにいくつかの前提条件がある場合、いくつかのステップを書く代わりに、テストの指示でガイドをリンクしてください。例えば、_"テストアカウントのドキュメント](https://woocommerce.com/document/woopayments/testing-and-troubleshooting/test-accounts/)"_に記載されている手順に従って、WooCommerce Paymentsのdevモードを有効にしてください。
5.このユーザーフローの一部としてテストしたい特定のアクションをカバーする必要があります。
6.実際の結果が期待通りであることを評価するために、**必要なだけ多くの検証ステップ**を記述してください。
    1.この変更が機能することを検証するために必要なステップだけをチェックすることに留意してください。

### 質の高いテスト指示を書くための考慮事項

-   WooCommerceの初心者でも**理解でき、誰でも**従うことができるようにテスト手順を定義してください。
-   読者の範囲は広く、想定されていることの背後にある概念を知らない人もいるかもしれません。例えば、「[x]実験を有効にする」_と言う代わりに、次のように言ってください：

```text
- Install the WooCommerce Beta Tester plugin.
- Go to `Tools > WCA Test Helper > Experiments`.
- Toggle the [x] experiment.
```

-   例えば、"管理者として注文ページに移動する "と言う代わりに、"［url］に移動する"、あるいは "WooCommerce > 注文に移動する "と言ってください。
-   実際のテストデータを使ってみましょう。例えば、"商品名を入力してください"_と言う代わりに、"商品名として "青いTシャツ "と入力してください"_のように言ってください。こうすることで、より分かりやすくなり、知識を想定することに関連する潜在的な疑念を取り除くことができます。
-   新しいコミットでテスト手順が古くなった場合は、**必ずテスト手順を更新してください。
-   もしテスト手順にカスタムコードを追加する必要がある場合は、**コードスニペットを提供してください**。
-   テスト手順でプラグインをインストールする必要がある場合は、**このプラグインへのリンク、またはインストールするためのzipファイル**を提供してください。
-   テストの指示がAPIエンドポイントをヒットすることを必要とする場合、**エンドポイントのドキュメントへのリンクを提供してください**。
-   理想的には、**テスト指示が説明していることをサポートしたスクリーンショットおよび/またはビデオ**を提供してください。共同ツールへのリンクを使用している場合は、アクセスできない人のために同等のスクリーンショット/ビデオも提供してください。

## 例

### 良質なテストの指示

#### 例1

![Sample of good quality instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682695-3dc51613-b836-4e7e-93ef-f75078ab48ac.png)

#### 例2

![Another sample of good quality instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682778-b552ab07-a518-48a7-9358-16adc5762aca.png)

### 実際のテスト指示の改善

このセクションでは、改善の余地があるテスト指示の実際の例（before）と、それをどのように調整するか（after）を紹介する。

![Instructions needing improvement](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682396-8c52d20e-1fca-4ac1-8345-f381c15a102a.png)

![Improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682480-c01e0e84-5969-4456-8f43-70cbb8509e8d.png)

改善された：

![Changes made](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682597-8d06e638-35dd-4ff8-9236-63c6ec5d05b8.jpg)

![example before providing improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/216365611-b540a814-3b8f-40f3-ae64-81018b9f97fb.png)

![example after providing improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/216366043-967e5daa-6a23-4ab8-adda-5f3082d1ebf7.png)

改善された：

![example of improvements](https://developer.woocommerce.com/wp-content/uploads/2023/12/216366152-b331648d-bcef-443b-b126-de2621a20862.png)

![example before providing improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/216388785-8806ea74-62e6-42da-8887-c8e291e7dfe2-1.png)

![example after providing improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/216388842-e5ab433e-d288-4306-862f-72f6f81ab2cd.png)

改善された：

![example of improvements](https://developer.woocommerce.com/wp-content/uploads/2023/12/216388874-c5b21fc3-f693-4a7e-a58a-c5d1b6606682.png)
