---
post_title: How to implement merchant onboarding
sidebar_label: Implement merchant onboarding
sidebar_position: 1
---
# 加盟店オンボーディングの実施方法

## はじめに

オンボーディングは、マーチャントのユーザーエクスペリエンスの重要な部分です。加盟店が成功するように設定し、正しくエクステンションを使用するだけでなく、エクステンションを最大限に活用できるようにします。あなたのエクステンションを使用する加盟店をオンボーディングするために、開発者として活用できる特に便利な機能がいくつかあります：

- セットアップタスク
- 店舗管理リンク
- 管理メモ

---

## ♪ はじめに

`@woocommerce/create-woo-extension`を使用して、プラグイン用のモダンなWordPress JavaScript環境を構築します。このツールはWooCommerceと統合するための完全に機能的な開発環境を作成します。

この例では、`add-task`バリアントを使用して、基本的なオンボーディング・エクステンションを作成します。

`wp-content/plugins`ディレクトリで、以下のコマンドを実行して拡張機能を作成します：

```sh
npx @wordpress/create-block -t @woocommerce/create-woo-extension --variant=add-task my-extension-name
```

新しく作成したフォルダに移動し、開発を開始する：

```sh
cd my-extension-name
npm run start
```

WordPressのローカル環境では、`wp-env`を使用することもできます：

```sh
npm -g i @wordpress/env
wp-env start
```

`/wp-admin/plugins.php`にアクセスし、プラグインを有効化することをお忘れなく。

## セットアップタスクの使用

セットアップタスクはWooCommerce Adminホーム画面に表示され、拡張機能をセットアップするために特定のステップを完了するようマーチャントに促します。タスクを追加するには2つのステップが必要です：

- PHP を使ってタスク (とその JavaScript) を登録する
- JavaScriptを使ってタスクをビルドし、コンフィギュレーションを設定し、タスクリストに追加する

### タスクをPHPに登録する

拡張タスクリストのアイテムとしてタスクを登録するには、まず Task クラスを継承した新しい PHP クラスを作成する必要があります。このクラスはカスタムタスクのプロパティとふるまいを定義します。

```php
<?php
/**
 * Custom task example.
 *
 */
use Automattic\WooCommerce\Admin\Features\OnboardingTasks\Task;

/**
 * Custom task class.
 */
class MyTask extends Task {
	/**
	 * Get the task ID.
	 *
	 * @return string
	 */
	public function get_id() {
		return 'my-task';
	}

	/**
	 * Title.
	 *
	 * @return string
	 */
	public function get_title() {
		return __( 'My task', 'woocommerce' );
	}

	/**
	 * Content.
	 *
	 * @return string
	 */
	public function get_content() {
		return __( 'Add your task description here for display in the task list.', 'woocommerce' );
	}

	/**
	 * Time.
	 *
	 * @return string
	 */
	public function get_time() {
		return __( '2 minutes', 'woocommerce' );
	}
}
```

カスタムタスククラスを定義したら、`TaskLists`クラスの`add_task`メソッドを呼び出して、タスクリストに追加します。オンボーディングタスクは `init` フックで登録されるため、add_task メソッドは `init` フックの前かフック内で呼び出す必要があることに注意してください。

```php
# Register the task.
function register_custom_task() {
    // Register the task.
    use Automattic\WooCommerce\Admin\Features\OnboardingTasks\TaskLists;

    TaskLists::add_task(
        'extended', // The task list ID (e.g., 'extended' for "Things to do next").
        new MyCustomTask(
            TaskLists::get_list( 'extended' ) // Retrieve the task list object.
        )
    );
}

// Hook the registration function to the 'init' action.
add_action('init', 'register_custom_task');
```

`TaskList`クラスはタスクリストを表します。このクラスには、タスクリストを管理するためのプロパティとメソッドが含まれています。現在、3つの定義済みタスク・リストがあります。

- `setup`：デフォルトのタスクリスト
- `extended`：次にやること」タスクリスト
- `secret_tasklist`：他の手段でアクセスされるタスクを持つために使われる "シークレット "タスクリスト。

### JavaScriptを使ったタスクの追加

PHP でタスクを登録することに加えて、JavaScript でタスクコンポーネントをビルドし、コンフィギュレーションを設定し、タスクリストに追加する必要があります。たとえば、シンプルなタスクの JavaScript ファイルは次のようになります：

```js
import { createElement } from '@wordpress/element';
import {
	WooOnboardingTask,
	WooOnboardingTaskListItem,
} from '@woocommerce/onboarding';
import { registerPlugin } from '@wordpress/plugins';

const Task = ( { onComplete, task, query } ) => {
	// Implement your task UI/feature here.
	return <div></div>;
};

registerPlugin( 'add-task-content', {
	render: () => (
		<WooOnboardingTask id="my-task">
			{ ( { onComplete, query, task } ) => (
				<Task onComplete={ onComplete } task={ task } query={ query } />
			) }
		</WooOnboardingTask>
	),
} );

registerPlugin( 'add-task-list-item', {
	scope: 'woocommerce-tasks',
	render: () => (
		<WooOnboardingTaskListItem id="my-task">
			{ ( { defaultTaskItem: DefaultTaskItem } ) => (
				// Add a custom wrapper around the default task item.
				<div
					className="woocommerce-custom-tasklist-item"
					style={ {
						border: '1px solid red',
					} }
				>
					<DefaultTaskItem />
				</div>
			) }
		</WooOnboardingTaskListItem>
	),
} );
```

上の例では、エクステンションはいくつかの異なることをしている。それを分解してみよう：

#### 輸入品の取り扱い

まず、外部の依存関係から関数、コンポーネント、その他のユーティリティをインポートする。

```js
import { createElement } from '@wordpress/element';
import {
	WooOnboardingTask,
	WooOnboardingTaskListItem,
} from '@woocommerce/onboarding';
import { registerPlugin } from '@wordpress/plugins';
```

#### コンポーネントを構築する

次に、タスクカードを返す[機能コンポーネント](https://reactjs.org/docs/components-and-props.html)を作成する。ここで使っているJavaScriptとHTMLが混在した構文はJSXと呼ばれています。JSXについてよく知らない場合は、[Reactのドキュメント](https://reactjs.org/docs/introducing-jsx.html)を参照してください。

```js
import { onboardingStore } from '@woocommerce/data';
import { useDispatch } from '@wordpress/data';

const Task = ( { onComplete, task } ) => {
	const { actionTask } = useDispatch( onboardingStore );
	const { isActioned } = task;

	return (
		<Card className="woocommerce-task-card">
			<CardBody>
				{ __(
					"This task's completion status is dependent on being actioned. The action button below will action this task, while the complete button will optimistically complete the task in the task list and redirect back to the task list. Note that in this example, the task must be actioned for completion to persist.",
					'plugin-domain'
				) }{ ' ' }
				<br />
				<br />
				{ __( 'Task actioned status: ', 'plugin-domain' ) }{ ' ' }
				{ isActioned ? 'actioned' : 'not actioned' }
				<br />
				<br />
				<div>
					<button
						onClick={ () => {
							actionTask( 'my-task' );
						} }
					>
						{ __( 'Action task', 'plugin-domain' ) }
					</button>
					<button onClick={ onComplete }>
						{ __( 'Complete', 'plugin-domain' ) }
					</button>
				</div>
			</CardBody>
		</Card>
	);
};
```

上の例では、`Card`と`CardBody`を使ってタスクのコンポーネントを構成しています。`CardBody`内の`div`は、[JavaScript式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) (`{}`)を使用して、コンポーネントの状態を使用してタスクを完了として表示するか未完了として表示するかを決定する三項演算子を埋め込んでいます。

#### タスクコンテンツ用プラグインの登録

次に、[SlotFills](https://developer.wordpress.org/block-editor/reference-guides/slotfills/)を使って "add-task-content "というプラグインとしてTaskコンポーネントを登録します。このプラグインはWooOnboardingTaskコンポーネント内にTaskコンポーネントをネストし、必要なプロパティを渡します。また、プラグインのスコープを "woocommerce-tasks "に指定することで、WooCommerceのタスクリスト内でのみ有効にしています。

```js
registerPlugin( 'add-task-content', {
	render: () => (
		
			{ ( {
				onComplete,
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				query,
				task,
			} ) =>  }
		
	),
	scope: 'woocommerce-tasks',
} );
```

#### タスクリスト項目カスタマイズ用プラグインの登録

最後に、"my-task-list-item-plugin "というプラグインを登録する。このプラグインはタスクリストアイテムの外観をカスタマイズするために使われます。このプラグインはWooCommerceのタスクリストもターゲットにしており、DefaultTaskItemコンポーネントをカスタムラッパーでラップし、スタイリングを追加します。

```js
registerPlugin( 'my-task-list-item-plugin', {
  scope: 'woocommerce-tasks',
  render: () => (
    <WooOnboardingTaskListItem id="my-task">
      { ( { defaultTaskItem: DefaultTaskItem } ) => (
        // Add a custom wrapper around the default task item.
        <div
          className="woocommerce-custom-tasklist-item"
          style={ {
            border: '1px solid red',
          } }
        >
          <DefaultTaskItem />
        </div>
      ) }
    </WooOnboardingTaskListItem>
  ),
} );
```

要約すると、シンプルなタスクのJavaScriptファイルはWooCommerceのタスクリストの機能を拡張し、カスタマイズし、ユーザがタスクをよりよく管理し、タスクリストのアイテムの外観をパーソナライズできるようにします。

### タスクをJavaScriptに登録する

phpでタスクを登録することに加えて、タスクコンポーネントとその設定を含むトランスパイルされたJavaScriptファイルを登録し、エンキューする必要があります。これを行う一般的な方法は、WordPressの`admin_enqueue_scripts`アクションにフックする専用の登録関数を作ることです。以下は、この登録がどのように見えるかの注釈付き例です：

```php
/**
 * Register the scripts to fill the task content on the frontend.
 */
function add_task_register_script() {
	if (
		! class_exists( 'Automattic\WooCommerce\Internal\Admin\Loader' ) ||
		! \Automattic\WooCommerce\Admin\PageController::is_admin_or_embed_page()
	) {
		return;
	}

	$asset_file = require __DIR__ . '/dist/index.asset.php';
	wp_register_script(
		'add-task',
		plugins_url( '/dist/index.js', __FILE__ ), // task registration JS
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_enqueue_script( 'add-task' );
}

add_action( 'admin_enqueue_scripts', 'add_task_register_script' );
```

これらのステップに従うことで、カスタムタスクがWooCommerceのオンボーディングタスクリストに表示されるはずです。

WordPressプラグインとしてカスタムタスクを追加する完全な例については、[add-task examples directory](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/client/admin/docs/examples/extensions/add-task)をチェックできる。

タスクリストの詳細については、[tasklist documentation](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/client/admin/docs/features/onboarding-tasks.md)を参照してください。

---

## 店舗管理リンクの使用

マーチャントがオンボーディングタスクリストのすべての項目を完了すると、WooCommerceは便利なストア管理リンクのリストを含むセクションに置き換えます。このセクションは、エクステンションの主要な機能に注目させ、マーチャントのナビゲーションを助ける素晴らしい方法です。

店舗管理セクションは比較的狭い目的を持っているため、このセクションは現在外部リンクをサポートしていません。代わりに、WooCommerce内で素早くナビゲートするためのものです。

独自の店舗管理リンクを追加するのは簡単な作業だ：

- アイコンサポートのための依存関係のインストール
- PHPで管理スクリプトをエンキューする
- リンク・オブジェクトを提供するためにJavaScriptフィルターでフックする

### アイコンパッケージのインストール

店舗管理リンクは`@wordpress/icons`パッケージを使用します。拡張機能がまだこのパッケージを使っていない場合は、拡張機能の依存リストに追加する必要があります。

`npm` __`install` __` @wordpress``/icons ` __`--save`

### JavaScriptをエンキューする

店舗管理セクションにカスタムリンクを追加するロジックは、JavaScriptファイルに記述します。そのファイルをPHPファイルでWordPressに登録し、エンキューします：

```js
function custom_store_management_link() {
    wp_enqueue_script(
        'add-my-custom-link',
        plugins_url( '/dist/add-my-custom-link.js', __FILE__ ),
        array( 'wp-hooks' ),
        10
    );
}
add_action( 'admin_enqueue_scripts', 'custom_store_management_link' );

```

この呼び出しの最初の引数はハンドルで、WordPressがキューに入れるスクリプトを参照するための名前です。第二引数は、スクリプトが置かれているURLです。

3番目の引数は、スクリプトの依存関係の配列です。この配列に`wp-hooks`ハンドルを指定することで、WooCommerceのリストにリンクを追加するために使用する`addFilter`関数にスクリプトがアクセスできるようにします。

4番目の引数は優先順位で、WordPressでJavaScriptを読み込む順番を決める。この例では優先度を10に設定しています。店舗管理セクションがレンダリングされる前にスクリプトが実行されることが重要です。リンクが正しくレンダリングされるように、優先順位の値が15より低いことを確認してください。

### JavaScriptでリンクを張る

最後に、上記でキューに入れたJavaScriptファイルで、`woocommerce_admin_homescreen_quicklinks`フィルターにフックし、単純なJavaScriptオブジェクトとしてタスクを提供する。

```js
import { megaphone } from '@wordpress/icons';
import { addFilter } from '@wordpress/hooks';
 
addFilter(
    'woocommerce_admin_homescreen_quicklinks',
    'my-extension',
    ( quickLinks ) => {
        return [
            ...quickLinks,
            {
                title: 'My link',
                href: 'link/to/something',
                icon: megaphone,
            },
        ];
    }
);
```

---

## アドミンノートを使う

アドミンノートは、WooCommerceストア、エクステンション、アクティビティ、実績に関する有益な情報を表示するためのものです。また、ストアの管理と最適化の日々のタスクに役立つ情報を表示するのにも便利です。一般的なルールとしては、以下のような情報に管理者ノートを使用します：

1.  タイムリー
2.  関連性
3.  役に立つ

このことを念頭に置いて、管理者ノートは、加盟店が通過した特定のマイルストーンを祝ったり、特定の機能やフローの使用に関する追加ガイダンスを提供したりするために使用することを検討してください。逆に、同じトピックについて繰り返しメッセージを送信したり、一部のマーチャントのみに関連するノートを全ユーザーを対象に送信したりするために管理者ノートを使用すべきではありません。特定のプロモーションのために管理者ノートを使用するのは構いませんが、システムを悪用してはいけません。最善の判断を下し、ホーム画面はストアで最も重要な実行可能なタスクを強調するためのものであることを忘れないでください。

WooCommerceの新しいReact-powered adminエクスペリエンスの一部であるにもかかわらず、Admin Notesは標準のPHPインターフェイスを介して開発者が利用できます。

アドミンノートを使用するための推奨アプローチは、WooCommerce Adminに含まれる[NoteTraits](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Admin/Notes/NoteTraits.php) traitを使用する独自のクラス内にノートをカプセル化することです。下記はその簡単な例です：

```php
<?php
/**
 * Simple note provider
 *
 * Adds a note with a timestamp showing when the note was added.
 */
 
namespace My\Wonderfully\Namespaced\Extension\Area;
 
// Exit if this code is accessed outside of WordPress.
defined ( 'ABSPATH' ) || exit;
 
// Check for Admin Note support
if ( ! class_exists( 'Automattic\WooCommerce\Admin\Notes\Notes' ) ||
     ! class_exists( 'Automattic\WooCommerce\Admin\Notes\NoteTraits' )) {
    return;
}
 
// Make sure the WooCommerce Data Store is available
if ( ! class_exists( 'WC_Data_Store' ) ) {
    return;
}
 
 
/**
 * Example note class.
 */
class ExampleNote {
 
    // Use the Note class to create Admin Note objects
    use Automatic\WooCommerce\Admin\Notes\Note;
 
    // Use the NoteTraits trait, which handles common note operations.
    use Automatic\WooCommerce\Admin\Notes\NoteTraits;
 
    // Provide a note name.
    const NOTE_NAME = 'my-prefix-example-note';
 
    public static function get_note() {
    // Our welcome note will include information about when the extension
    // was activated.  This is just for demonstration. You might include
    // other logic here depending on what data your note should contain.
        $activated_time = current_time( 'timestamp', 0 );
        $activated_time_formatted = date( 'F jS', $activated_time );
 
        // Instantiate a new Note object
        $note = new Automattic\WooCommerce\Admin\Notes\Note();
 
        // Set our note's title.
        $note->set_title( 'Getting Started' );
 
        // Set our note's content.
        $note->set_content(
            sprintf(
                'Extension activated on %s.', $activated_time_formatted
            )
        );
 
        // In addition to content, notes also support structured content.
        // You can use this property to re-localize notes on the fly, but
        // that is just one use. You can store other data here too. This
        // is backed by a longtext column in the database.
        $note->set_content_data( (object) array(
            'getting_started'       => true,
            'activated'             => $activated_time,
            'activated_formatted'   => $activated_time_formatted
        ) );
 
        // Set the type of the note. Note types are defined as enum-style
        // constants in the Note class. Available note types are:
        // error, warning, update, info, marketing.
        $note->set_type( Note::E_WC_ADMIN_NOTE_INFORMATIONAL );
 
        // Set the type of layout the note uses. Supported layout types are:
        // 'plain', 'thumbnail'
        $note->set_layout( 'plain' );
 
        // Set the image for the note. This property renders as the src
        // attribute for an img tag, so use a string here.
        $note->set_image( '' );
 
 
        // Set the note name and source.  You should store your extension's
        //   name (slug) in the source property of the note.  You can use
        //   the name property of the note to support multiple sub-types of
        //   notes.  This also gives you a handy way of namespacing your notes.
        $note->set_source( 'inbox-note-example');
        $note->set_name( self::NOTE_NAME );
 
        // Add action buttons to the note.  A note can support 0, 1, or 2 actions.
        //   The first parameter is the action name, which can be used for event handling.
        //   The second parameter renders as the label for the button.
        //   The third parameter is an optional URL for actions that require navigation.
        $note->add_action(
            'settings', 'Open Settings', '?page=wc-settings&tab=general'
        );
        $note->add_action(
            'learn_more', 'Learn More', 'https://example.com'
        );
 
        return $note;
    }
}
 
function my_great_extension_activate() {
    // This uses the functionality from the NoteTraits trait to conditionally add your note if it passes all of the appropriate checks.
    ExampleNote::possibly_add_note();
}
register_activation_hook( __FILE__, 'my_great_extension_activate' );
 
function my_great_extension_deactivate() {
    // This uses the functionality from the NoteTraits trait to conditionally remove your note if it passes all of the appropriate checks.
    ExampleNote::possibly_delete_note();
}
register_deactivation_hook( __FILE__, 'my_great_extension_deactivate' );
```

### 分解する

上の例を分解して、それぞれのセクションが何をするのかを見てみよう。

#### 名前空間と機能の利用可能性チェック

まず、基本的な名前空間と機能の可用性をチェックし、このファイルがWordPressのアプリケーションスペース内でのみ実行されるようにします。

```php
namespace My\Wonderfully\Namespaced\Extension\Area;
 
defined ( 'ABSPATH' ) || exit;
 
if ( ! class_exists( 'Automattic\WooCommerce\Admin\Notes\Notes') ||
     ! class_exists( 'Automattic\WooCommerce\Admin\Notes\NoteTraits') ) {
    return;
}
 
if ( ! class_exists( 'WC_Data_Store' ) ) {
    return;
}
```

#### Note オブジェクトと NoteTraits オブジェクトの使用

次に、ノートのプロバイダとなるシンプルなクラスを定義します。ノートオブジェクトを作成し管理するために、WooCommerce Adminから`Note`と`NotesTraits`クラスをインポートします。

```php
class ExampleNote {
 
    use Automatic\WooCommerce\Admin\Notes\Note;
    use Automatic\WooCommerce\Admin\Notes\NoteTraits;
 
}
```

#### ユニークなノート名を付ける

先に進む前に、`NOTE_NAME`という定数を作成し、一意のノート名を割り当てます。`NoteTraits`クラスは、クエリーとノート操作にこの定数を使用します。

`const NOTE_NAME = 'my-prefix-example-note';`。

#### ノートの詳細を設定する

ノートの名前を設定したら、ノートの定義と設定を行います。`NoteTraits`クラスは操作の実行時に`self::get_note()`を呼び出すので、`Note`オブジェクトを返す`get_note()`という静的関数でノートのインスタンス化と設定をカプセル化する必要があります。

```php
public static function get_note() {
    // We'll fill this in with logic that instantiates a Note object
    //   and sets its properties.
}
```

`get_note()`関数の中では、ノートが表示する必要のあるデータを収集するためのロジックを処理します。このノートの例では、拡張機能がいつアクティブになったかという情報を表示します。ノートに含めるデータによっては、ここに他のロジックを含めることもできます。

```php
$activated_time = current_time( 'timestamp', 0);
$activated_time_formatted = date( 'F jS', $activated_time );

```

次に、新しい`Note`オブジェクトをインスタンス化する。

`$note = new Note();`。

Noteクラスのインスタンスができたら、APIを使ってプロパティを設定することができる。

`$note->set_title( 'Getting Started' );`。

次に、上記で収集したタイムスタンプデータの一部を使用して、ノートの内容を設定します。

```php
$note->set_content(
    sprintf(
        'Extension activated on %s.', $activated_time_formatted
    )
);
```

通常のコンテンツに加えて、ノートは`content_data`プロパティを使った構造化コンテンツもサポートしています。このプロパティを使えば、その場でノートを再ローカライズすることができるが、これは一つの使用例に過ぎない。他のデータもここに保存できます。これはデータベースの`longtext`カラムによってサポートされます。

```php
$note->set_content_data( (object) array(
    'getting_started'     => true,
    'activated'           => $activated_time,
    'activated_formatted' => $activated_time_formatted
) );
```

次に、ノートの`type`プロパティを設定します。ノート・タイプは、`Note`クラスの列挙型クラス定数として定義されます。利用可能なノート・タイプは、_error_、_warning_、_update_、_info_、_marketing_です。ノートタイプを選択する際、_error_と_update_は受信トレイではなく、ストアアラートとして表示されることに注意してください。どうしても必要な場合を除き、これらのタイプのノートは使用しない方がよいでしょう。

`$note->set_type( Note::E_WC_ADMIN_NOTE_INFORMATIONAL );`。

アドミンノートはいくつかの異なるレイアウトもサポートしています。`banner`、`plain`、`thumbnail`をレイアウトとして指定できます。これらのレイアウトを実際に見てみたい方は、[このシンプルなプラグイン](https://gist.github.com/octaedro/864315edaf9c6a2a6de71d297be1ed88)をインストールして試してみてください。

ここでは、`plain`をレイアウトとして選択するが、これはデフォルトでもあるので、このプロパティだけを残しておいても効果は同じである。

`$note->set_layout( 'plain' );`。

管理ノートに追加したい画像がある場合は、`set_image`関数を使用して指定できます。このプロパティは最終的に`img`タグの`src`属性としてレンダリングされるので、ここでは文字列を使用してください。

`$note->set_image( '' );`。

次に、管理ノートの `name` プロパティと `source` プロパティの値を設定します。ベストプラクティスとして、ノートの `source` プロパティに拡張機能の名前（スラッグ）を格納する必要があります。`name`プロパティを使用すると、複数のサブタイプのノートをサポートできます。これにより、ノートの名前空間と上位および下位レベルでの管理を行う便利な方法が提供されます。

```php
$note->set_source( 'inbox-note-example');
$note->set_name( self::NOTE_NAME );
```

アドミンノートでは、0、1、または2つのアクション（ボタン）をサポートすることができます。これらのアクションを使用して、非同期処理のトリガーとなるイベントをキャプチャしたり、マーチャントがステップを完了するために特定のビューにナビゲートしたり、あるいは単に詳細情報のための外部リンクを提供したりすることができます。`add_action()`関数は最大3つの引数を取ります。1つ目はイベント処理に使用できるアクション名、2つ目はアクションのボタンのラベルとしてレンダリングされるもの、3つ目はナビゲーションを必要とするアクションのためのオプションのURLです。

```php
$note->add_action(
    'settings', 'Open Settings', '?page=wc-settings&tab=general'
);
$note->add_action(
    'learn_more', 'Learn More', 'https://example.com'
);
```

最後に、`get_note()`関数が設定されたNoteオブジェクトを返すことを忘れないでください。

`return $note;`。

#### ノートの追加と削除

ノートの追加と削除には、`NoteTraits`クラスの一部であるヘルパー関数を使用できます：`possibly_add_note()`とそれに対応する`possibly_delete_note()`です。これらの関数は、ノート管理に関連する反復ロジックの一部を処理し、重複したノートを作成しないようにチェックを行います。

私たちのエクステンションの例では、シンプルにするために、これらの呼び出しを有効化フックと無効化フックに結び付けています。マーチャントの受信トレイにノートを追加したいイベントはたくさんありますが、非アクティブ化やアンインストール時にノートを削除することは、エクステンションのライフサイクルを管理する上で重要なことです。

```php
function my_great_extension_activate() {
    ExampleNote::possibly_add_note();
}
register_activation_hook( __FILE__, 'my_great_extension_activate' );
 
function my_great_extension_deactivate() {
    ExampleNote::possibly_delete_note();
}
register_deactivation_hook( __FILE__, 'my_great_extension_deactivate' );

```
