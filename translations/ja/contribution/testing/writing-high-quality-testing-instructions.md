---
post_title: Writing high quality testing instructions
sidebar_label: Writing testing instructions
---

# Writing high quality testing instructions

## Introduction

プルリクエストに明確なテスト指示を出すことは、WooCommerceにおける品質エンジニアリングの最初のレベルであり、早期にテストを行い、WooCommerceの次期バージョンにおける予期せぬ影響の影響を最小限に抑えるための鍵となります。

このページには以下のセクションがあります：

-   [テストとは何か](#what-is-a-test)
-   [テスト指示で何をカバーするか](#what-to-cover-with-the-testing-instructions)
-   [良いテスト指示を書くための流れ](#flow-to-write-good-testing-instructions)
-   [例題](#examples)

## What is a test?

テストとは、何かが特定の基準を満たしているかどうかをチェックするための手法である。一般的には、チェックするアクションを実行する前に、テスト対象のシステムをある状態にするために必要なステップを含む手順として定義される。したがって、テストは以下の段階から構成される：

-   **前提条件:** チェックしたいアクションを実行する前に、システムを望ましい状態にするために実行する必要があるすべてのステップ。テストには多くの前提条件があり得ます。
-   **アクション(Action):** これは、システムでチェックしたい変化を引き起こす正確なステップです。各テストは理想的には一度に1つのことをカバーすべきなので、1つだけであるべきです。
-   **検証(Validation):** システムでアクションを実行した結果を検証するために実行されるステップに関連します。テストは複数のことを検証することができる。

例えば、商品をカートに入れる過程：

-   前提条件**は、以下のすべてのステップである：
    -   商品作成プロセス
    -   買い物客としてログインする。
    -   商品が掲載されているショップページに向かうこと。
-   アクション**は、希望する商品の "カートに入れる"_ボタンをクリックすることです。
-   検証**段階は、カートのアイコン（もしあれば）にあと1つの商品が表示され、選択した商品がカートに含まれていることを確認することです。

前提条件、アクション、バリデーションを指定することは、テストの範囲を理解する上で非常に有益である：

-   前提条件**には、テストを成功させるために何をしなければならないかを記述します。
-   アクション**では、テストの目的を知ることができます。言い換えれば、何をテストする必要があるのかを理解する鍵となります。
-   検証** 段階では、テストを実行するときに何を期待すべきかを知ることができます。

この文脈では、プルリクエストやリリースで提供された変更が期待通りに動作することを検証するために実行する必要があるテストを、テスト指示と呼ぶことにする。つまり、テスト指示は、ハッピーパスと潜在的なエッジケースを含む、1つ以上のテストを指す可能性があります。

## What to cover with the testing instructions

前のセクションで述べたように、テスト（我々の文脈ではテスト命令）とは、新しい変更や一連の変更が特定の基準を満たしていることをチェックするための方法である。

実際、PR で導入された変更をカバーするために必要な数のシナリオのテスト指示を含めることが推奨されます。言い換えると、**受入基準をカバーするために必要な数のテスト指示を追加してください**。受入基準とは、_ソフトウェア製品がユーザ、顧客、その他の利害関係者に受け入れられるために満たすべき条件_、PRの文脈では、このPRがユーザ、開発者、WooCommerceコミュニティに受け入れられるために要件として満たすべき条件と理解してください。

## Flow to write good testing instructions

1. **Outline the user flows** you want to cover.
2. **Define the environment** where the testing instructions should be executed (server, PHP version, WP version, required plugins, etc), and start writing the testing instructions as if you were starting from a fresh install.
3. Identify the **preconditions**, **action** and **validation** steps.
4. Write **as many preconditions as you need** to explain how to set up the state of WooCommerce so that you can execute the desired action to test every flow.
    1. Try to be detailed when explaining the interactions the user needs to perform in WooCommerce.
    2. If there are several preconditions for a user flow that is explained in a public guide, feel free to simply link the guide in the testing instructions instead of writing several steps. For example, _"Enable dev mode in WooCommerce Payments by following the steps mentioned [in the test accounts documentation](https://woocommerce.com/document/woopayments/testing-and-troubleshooting/test-accounts/)"_.
5. Write **the action step**, which should cover the specific action that we want to test as part of this user flow.
6. Write **as many validation steps** as needed in order to assess that the actual result meets expectations.
    1. Bear in mind to check only the steps needed to validate that this change works.

### Considerations for writing high-quality testing instructions

-   WooCommerceの初心者でも**理解でき、誰でも**従うことができるようにテスト手順を定義してください。
-   読者の範囲は広く、想定されていることの背後にある概念を知らない人もいるかもしれません。例えば、「[x]実験を有効にする」_と言う代わりに、次のように言ってください：

```text
- Install the WooCommerce Beta Tester plugin.
- Go to `Tools > WCA Test Helper > Experiments`.
- Toggle the [x] experiment.
```

-   例えば、"管理者として注文ページに移動する "と言う代わりに、"［url］に移動する"、あるいは "WooCommerce &gt; 注文に移動する "と言ってください。
-   実際のテストデータを使ってみましょう。例えば、"商品名を入力してください"_と言う代わりに、"商品名として "青いTシャツ "と入力してください"_のように言ってください。こうすることで、より分かりやすくなり、知識を想定することに関連する潜在的な疑念を取り除くことができます。
-   新しいコミットでテスト手順が古くなった場合は、**必ずテスト手順を更新してください。
-   もしテスト手順にカスタムコードを追加する必要がある場合は、**コードスニペットを提供してください**。
-   テスト手順でプラグインをインストールする必要がある場合は、**このプラグインへのリンク、またはインストールするためのzipファイル**を提供してください。
-   テストの指示がAPIエンドポイントをヒットする必要がある場合、**エンドポイントのドキュメントへのリンクを提供してください**。
-   理想的には、**テスト指示が説明していることをサポートしたスクリーンショットおよび/またはビデオ**を提供してください。共同ツールへのリンクを使用している場合は、アクセスできない人のために同等のスクリーンショット/ビデオも提供してください。

## Examples

### Good quality testing instructions

#### Example 1

![Sample of good quality instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682695-3dc51613-b836-4e7e-93ef-f75078ab48ac.png)

#### Example 2

![Another sample of good quality instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682778-b552ab07-a518-48a7-9358-16adc5762aca.png)

### Improving real testing instructions

このセクションでは、改善の余地があるテスト指示の実際の例（before）と、それをどのように微調整するか（after）を紹介する。

Before:

![Instructions needing improvement](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682396-8c52d20e-1fca-4ac1-8345-f381c15a102a.png)

After:

![Improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682480-c01e0e84-5969-4456-8f43-70cbb8509e8d.png)

改善された：

![Changes made](https://developer.woocommerce.com/wp-content/uploads/2023/12/213682597-8d06e638-35dd-4ff8-9236-63c6ec5d05b8.jpg)

Before:

![example before providing improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/216365611-b540a814-3b8f-40f3-ae64-81018b9f97fb.png)

After:

![example after providing improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/216366043-967e5daa-6a23-4ab8-adda-5f3082d1ebf7.png)

改善された：

![example of improvements](https://developer.woocommerce.com/wp-content/uploads/2023/12/216366152-b331648d-bcef-443b-b126-de2621a20862.png)

Before:

![example before providing improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/216388785-8806ea74-62e6-42da-8887-c8e291e7dfe2-1.png)

After:

![example after providing improved instructions](https://developer.woocommerce.com/wp-content/uploads/2023/12/216388842-e5ab433e-d288-4306-862f-72f6f81ab2cd.png)

改善された：

![example of improvements](https://developer.woocommerce.com/wp-content/uploads/2023/12/216388874-c5b21fc3-f693-4a7e-a58a-c5d1b6606682.png)
