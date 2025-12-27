# 商品タグAPI 

## 商品タグ一覧

```http
GET /products/tags
```

| 属性 | タイプ | 必須 | 説明 |
| :----------- | :------ | :------:| :-------------------------------------------------------------------------------------------------------------------- |
| `context` | string | No | リクエストが行われるスコープ。                                         |
| `page` | integer | No | コレクションの現在のページ。デフォルトは `1` です。                                                                      |
| `per_page` | integer | No | 結果セットで返すアイテムの最大数。デフォルトは制限なし。`0` から `100` までの値が使用可能です。|
| `search` | string | No | 結果を文字列にマッチするものに限定する。                                                                             |
| `exclude` | array | No | 結果セットが特定のIDを除外するようにする。                                                                              |
| `include` | array | No | 結果を特定のIDに限定する。                                                                                     |
| `order`｜文字列｜いいえ｜昇順または降順に並べ替えます。許容される値：`asc`, `desc`.デフォルトは `asc` です。                                       |
| 指定可能な値： `orderby` | string | いいえ。許可される値：`name`、`slug`、`count`。デフォルトは`name`です。                                   |
| `hide_empty` | boolean | No | trueの場合、空の用語は返されません。デフォルトは`true`です。                                                        |

```sh
curl "https://example-store.com/wp-json/wc/store/v1/products/tags"
```

回答例

```json
[
	{
		"id": 1,
		"name": "Test Tag",
		"slug": "test-tag",
		"description": "",
		"parent": 0,
		"count": 1
	},
	{
		"id": 2,
		"name": "Another Tag",
		"slug": "another-tag",
		"description": "",
		"parent": 0,
		"count": 1
	}
]
```
