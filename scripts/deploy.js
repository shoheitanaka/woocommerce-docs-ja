#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const matter = require('gray-matter');
const { marked } = require('marked');
const { glob } = require('glob');
const config = require('../config/config.json');
require('dotenv').config();

// WordPress REST API クライアント
class WordPressClient {
  constructor(url, username, appPassword) {
    this.baseUrl = `${url}/wp-json/wp/v2`;
    this.auth = Buffer.from(`${username}:${appPassword}`).toString('base64');
  }

  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Basic ${this.auth}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios({
        method,
        url,
        headers,
        data
      });
      return response.data;
    } catch (error) {
      throw new Error(`WordPress API Error: ${error.message}`);
    }
  }

  // wc_docs カスタム投稿タイプ用メソッド
  async getWcDocs(params = {}) {
    return await this.request('/wc_docs', 'GET', params);
  }

  async getWcDoc(id) {
    return await this.request(`/wc_docs/${id}`);
  }

  async createWcDoc(data) {
    return await this.request('/wc_docs', 'POST', data);
  }

  async updateWcDoc(id, data) {
    return await this.request(`/wc_docs/${id}`, 'POST', data);
  }

  async deleteWcDoc(id) {
    return await this.request(`/wc_docs/${id}`, 'DELETE');
  }

  // wc_docs_category タクソノミー用メソッド
  async getWcDocsCategories(params = {}) {
    return await this.request('/wc_docs_category', 'GET', params);
  }

  async getWcDocsCategory(id) {
    return await this.request(`/wc_docs_category/${id}`);
  }

  async createWcDocsCategory(name, parent = 0, slug = null) {
    const data = { name, parent };
    if (slug) data.slug = slug;
    return await this.request('/wc_docs_category', 'POST', data);
  }

  async updateWcDocsCategory(id, data) {
    return await this.request(`/wc_docs_category/${id}`, 'POST', data);
  }
}

// 統計情報
const stats = {
  created: 0,
  updated: 0,
  skipped: 0,
  errors: []
};

/**
 * メインデプロイ処理
 */
async function deployToWordPress(targetFiles = null) {
  console.log('🚀 Starting WordPress deployment...\n');

  try {
    // WordPress クライアント初期化
    const wp = new WordPressClient(
      process.env.WORDPRESS_URL,
      process.env.WORDPRESS_USERNAME,
      process.env.WORDPRESS_APP_PASSWORD
    );

    // 接続テスト
    console.log('🔌 Testing WordPress connection...');
    await wp.getWcDocs({ per_page: 1 });
    console.log('   ✓ Connected successfully\n');

    // カテゴリー階層の準備
    const categoryMap = await ensureCategoryHierarchy(wp);

    // デプロイ対象ファイルの取得
    const files = targetFiles || await getTranslatedFiles();
    console.log(`📝 Found ${files.length} translated files\n`);

    // ファイルごとに処理
    for (const filePath of files) {
      await deployFile(wp, filePath, categoryMap);
    }

    // 統計情報の表示
    printDeployStats();

    return stats;

  } catch (error) {
    console.error('\n❌ Deployment error:', error.message);
    throw error;
  }
}

/**
 * 個別ファイルのデプロイ
 */
async function deployFile(wp, filePath, categoryMap) {
  const relativePath = path.relative(
    path.join(process.cwd(), 'translations', 'ja'),
    filePath
  );
  console.log(`\n📄 Deploying: ${relativePath}`);

  try {
    // ファイル内容を読み込み
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: markdown } = matter(fileContent);

    // マークダウンをHTMLに変換
    const htmlContent = marked(markdown);

    // スラッグの生成
    const slug = generateSlug(relativePath);

    // カテゴリーIDの取得（階層構造から）
    const categoryIds = getCategoryIdsFromPath(relativePath, categoryMap);

    // 既存ドキュメントをチェック
    const existingDocs = await wp.getWcDocs({
      slug,
      per_page: 1
    });

    // ドキュメントデータの準備
    const docData = {
      title: frontmatter.title || path.basename(filePath, '.md'),
      content: htmlContent,
      slug,
      status: config.wordpress.postStatus || 'publish',
      wc_docs_category: categoryIds,
      meta: {
        source_file: relativePath,
        last_updated: new Date().toISOString(),
        version: process.env.DEPLOY_VERSION || 'latest',
        original_path: relativePath
      }
    };

    // ドキュメントの作成または更新
    if (existingDocs.length > 0) {
      const docId = existingDocs[0].id;
      await wp.updateWcDoc(docId, docData);
      console.log(`   ✓ Updated (ID: ${docId})`);
      stats.updated++;
    } else {
      const newDoc = await wp.createWcDoc(docData);
      console.log(`   ✓ Created (ID: ${newDoc.id})`);
      stats.created++;
    }

    // メタデータの保存
    await saveDeploymentMetadata(relativePath, {
      slug,
      deployedAt: new Date().toISOString(),
      wpUrl: `${process.env.WORDPRESS_URL}/${slug}`
    });

  } catch (error) {
    console.error(`   ✗ Error: ${error.message}`);
    stats.errors.push({
      file: relativePath,
      error: error.message
    });
  }
}

/**
 * カテゴリー階層の確保
 */
async function ensureCategoryHierarchy(wp) {
  console.log('📁 Setting up category hierarchy...');
  const categoryMap = {};

  try {
    // 既存のカテゴリーを取得
    const existingCategories = await wp.getWcDocsCategories({ per_page: 100 });
    
    // 既存カテゴリーをマップに追加
    for (const cat of existingCategories) {
      categoryMap[cat.slug] = cat.id;
    }

    // 翻訳ファイルからディレクトリ構造を取得
    const files = await getTranslatedFiles();
    const directories = new Set();

    files.forEach(file => {
      const relativePath = path.relative(
        path.join(process.cwd(), 'translations', 'ja'),
        file
      );
      const dir = path.dirname(relativePath);
      if (dir !== '.') {
        const parts = dir.split(path.sep);
        for (let i = 0; i < parts.length; i++) {
          directories.add(parts.slice(0, i + 1).join('/'));
        }
      }
    });

    // ディレクトリを階層順にソート
    const sortedDirs = Array.from(directories).sort((a, b) => {
      return a.split('/').length - b.split('/').length;
    });

    // 各ディレクトリに対してカテゴリーを作成
    for (const dir of sortedDirs) {
      const parts = dir.split('/');
      const name = parts[parts.length - 1];
      const slug = dir.replace(/\//g, '-');

      // 既に存在する場合はスキップ
      if (categoryMap[slug]) {
        console.log(`   ✓ Category exists: ${dir}`);
        continue;
      }

      // 親カテゴリーのIDを取得
      let parentId = 0;
      if (parts.length > 1) {
        const parentSlug = parts.slice(0, -1).join('-');
        parentId = categoryMap[parentSlug] || 0;
      }

      // カテゴリーを作成
      const newCat = await wp.createWcDocsCategory(name, parentId, slug);
      categoryMap[slug] = newCat.id;
      console.log(`   ✓ Created category: ${dir} (ID: ${newCat.id})`);
    }

    console.log(`   Total categories: ${Object.keys(categoryMap).length}\n`);
    return categoryMap;

  } catch (error) {
    console.error('⚠️  Error setting up category hierarchy:', error.message);
    return categoryMap;
  }
}

/**
 * パスからカテゴリーIDを取得
 */
function getCategoryIdsFromPath(relativePath, categoryMap) {
  const dir = path.dirname(relativePath);
  if (dir === '.') return [];

  const parts = dir.split(path.sep);
  const categoryIds = [];

  // すべての階層のカテゴリーIDを取得
  for (let i = 0; i < parts.length; i++) {
    const slug = parts.slice(0, i + 1).join('-');
    if (categoryMap[slug]) {
      categoryIds.push(categoryMap[slug]);
    }
  }

  return categoryIds;
}

/**
 * スラッグの生成
 */
function generateSlug(filePath) {
  const prefix = config.wordpress.slugPrefix || 'wc-docs';
  
  // ファイルパスからスラッグを生成
  const slug = filePath
    .replace(/\.md$/, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  return `${prefix}-${slug}`;
}

/**
 * デプロイメタデータの保存
 */
async function saveDeploymentMetadata(filePath, metadata) {
  const metadataDir = path.join(
    process.cwd(),
    'translations',
    'deploy-metadata'
  );
  await fs.mkdir(metadataDir, { recursive: true });

  const metadataFile = path.join(
    metadataDir,
    `${path.basename(filePath, '.md')}.json`
  );

  await fs.writeFile(
    metadataFile,
    JSON.stringify(metadata, null, 2)
  );
}

/**
 * 翻訳済みファイルの取得
 */
async function getTranslatedFiles() {
  const pattern = path.join(
    process.cwd(),
    'translations',
    'ja',
    '**',
    '*.md'
  );

  return await glob(pattern, {
    nodir: true,
    absolute: true
  });
}

/**
 * 統計情報の表示
 */
function printDeployStats() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Deployment Statistics');
  console.log('='.repeat(60));
  console.log(`Created:  ${stats.created}`);
  console.log(`Updated:  ${stats.updated}`);
  console.log(`Skipped:  ${stats.skipped}`);
  console.log(`Total:    ${stats.created + stats.updated + stats.skipped}`);

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors: ${stats.errors.length}`);
    stats.errors.forEach(err => {
      console.log(`   - ${err.file}: ${err.error}`);
    });
  }

  console.log('='.repeat(60));
  console.log(`\n🌐 WordPress URL: ${process.env.WORDPRESS_URL}`);
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  const targetFiles = process.argv.slice(2);

  deployToWordPress(targetFiles.length > 0 ? targetFiles : null)
    .then(() => {
      console.log('\n✅ Deployment completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { deployToWordPress, WordPressClient };
