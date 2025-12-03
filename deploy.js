#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const matter = require('gray-matter');
const { marked } = require('marked');
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

  async getPages(params = {}) {
    return await this.request('/pages', 'GET', params);
  }

  async getPage(id) {
    return await this.request(`/pages/${id}`);
  }

  async createPage(data) {
    return await this.request('/pages', 'POST', data);
  }

  async updatePage(id, data) {
    return await this.request(`/pages/${id}`, 'POST', data);
  }

  async deletePage(id) {
    return await this.request(`/pages/${id}`, 'DELETE');
  }

  async getCategories() {
    return await this.request('/categories');
  }

  async createCategory(name, parent = 0) {
    return await this.request('/categories', 'POST', { name, parent });
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
    await wp.getPages({ per_page: 1 });
    console.log('   ✓ Connected successfully\n');

    // カテゴリーの準備
    const categoryId = await ensureCategory(wp);

    // デプロイ対象ファイルの取得
    const files = targetFiles || await getTranslatedFiles();
    console.log(`📝 Found ${files.length} translated files\n`);

    // ファイルごとに処理
    for (const filePath of files) {
      await deployFile(wp, filePath, categoryId);
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
async function deployFile(wp, filePath, categoryId) {
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

    // 既存ページをチェック
    const existingPages = await wp.getPages({
      slug,
      per_page: 1
    });

    // ページデータの準備
    const pageData = {
      title: frontmatter.title || path.basename(filePath, '.md'),
      content: htmlContent,
      slug,
      status: config.wordpress.postStatus || 'publish',
      categories: [categoryId],
      meta: {
        source_file: relativePath,
        last_updated: new Date().toISOString(),
        version: process.env.DEPLOY_VERSION || 'latest',
        original_path: relativePath
      }
    };

    // ページの作成または更新
    if (existingPages.length > 0) {
      const pageId = existingPages[0].id;
      await wp.updatePage(pageId, pageData);
      console.log(`   ✓ Updated (ID: ${pageId})`);
      stats.updated++;
    } else {
      const newPage = await wp.createPage(pageData);
      console.log(`   ✓ Created (ID: ${newPage.id})`);
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
 * カテゴリーの確保
 */
async function ensureCategory(wp) {
  const categoryName = config.wordpress.categoryPrefix || 'WooCommerce Docs';

  try {
    // 既存カテゴリーを検索
    const categories = await wp.getCategories();
    const existing = categories.find(cat => cat.name === categoryName);

    if (existing) {
      console.log(`📁 Using existing category: ${categoryName} (ID: ${existing.id})`);
      return existing.id;
    }

    // カテゴリーを作成
    const newCategory = await wp.createCategory(categoryName);
    console.log(`📁 Created category: ${categoryName} (ID: ${newCategory.id})`);
    return newCategory.id;

  } catch (error) {
    console.error('⚠️  Could not create category, using default');
    return 1; // デフォルトカテゴリー
  }
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
  const glob = require('glob');
  const pattern = path.join(
    process.cwd(),
    'translations',
    'ja',
    '**',
    '*.md'
  );

  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
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
