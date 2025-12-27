---
post_title: Updating countries and subdivisions
sidebar_label: Countries and subdivisions
---

# Updating countries and subdivisions

WooCommerceには、ユーザーインターフェースの様々な部分で使用される国や小区分（州や州など）の包括的なリストが付属しています。

もちろん、国やその下位区分でさえも定期的に変更されます。このような場合、[バグレポート](https://github.com/woocommerce/woocommerce/issues/new?template=1-bug-report.yml)や[プルリクエストの提出](/docs/contribution/contributing)を提出することができます。しかし、私たちのポリシーは、変更が[CLDRプロジェクト](https://cldr.unicode.org/)の現在のバージョンと一致している場合にのみ変更を受け入れるということを理解しておくことが重要です。そのため、一般的にはWooCommerceに採用を依頼する前に、まずそちらを確認し、必要であればそちらで変更を提案するのがベストです。

CLDRが更新を受け付けるまでに時間がかかることがあるため、この方法はすべての場合に適しているとは限りません。そのような場合でも、以下のようなカスタムスニペットを使用することで、国や小区分のリストを変更することができます：

- [国を追加するスニペット](/docs/code-snippets/add-a-country)
- [州を追加または修正するスニペット](/docs/code-snippets/add-or-modify-states)

