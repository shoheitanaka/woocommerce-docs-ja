#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

/**
 * WordPress接続の検証
 */
async function validateWordPressConnection() {
  console.log('🔌 Validating WordPress connection...\n');

  const {
    WORDPRESS_URL,
    WORDPRESS_USERNAME,
    WORDPRESS_APP_PASSWORD
  } = process.env;

  // 環境変数の確認
  if (!WORDPRESS_URL || !WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
    console.error('❌ Missing required environment variables:');
    if (!WORDPRESS_URL) console.error('   - WORDPRESS_URL');
    if (!WORDPRESS_USERNAME) console.error('   - WORDPRESS_USERNAME');
    if (!WORDPRESS_APP_PASSWORD) console.error('   - WORDPRESS_APP_PASSWORD');
    process.exit(1);
  }

  console.log('📋 Configuration:');
  console.log(`   WordPress URL: ${WORDPRESS_URL}`);
  console.log(`   Username: ${WORDPRESS_USERNAME}`);
  console.log(`   Password: ${'*'.repeat(WORDPRESS_APP_PASSWORD.length)}\n`);

  try {
    // 接続テスト
    await testConnection(WORDPRESS_URL, WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD);

    // REST APIの確認
    await testRestAPI(WORDPRESS_URL, WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD);

    // パーミッションの確認
    await testPermissions(WORDPRESS_URL, WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD);

    console.log('\n✅ All validation checks passed!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Validation failed:', error.message);
    process.exit(1);
  }
}

/**
 * 基本的な接続テスト
 */
async function testConnection(url, username, password) {
  console.log('🔍 Testing basic connection...');

  try {
    const response = await axios.get(`${url}/wp-json/`, {
      timeout: 10000
    });

    if (response.status === 200) {
      console.log('   ✓ WordPress site is accessible');
      console.log(`   ✓ WordPress version: ${response.data.name || 'Unknown'}`);
    }
  } catch (error) {
    throw new Error(`Cannot access WordPress site: ${error.message}`);
  }
}

/**
 * REST APIの確認
 */
async function testRestAPI(url, username, password) {
  console.log('\n🔍 Testing REST API authentication...');

  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const response = await axios.get(`${url}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Basic ${auth}`
      },
      timeout: 10000
    });

    if (response.status === 200) {
      console.log('   ✓ Authentication successful');
      console.log(`   ✓ User ID: ${response.data.id}`);
      console.log(`   ✓ User name: ${response.data.name}`);
      console.log(`   ✓ User roles: ${response.data.roles.join(', ')}`);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Authentication failed. Check your username and application password.');
      } else {
        throw new Error(`REST API error: ${error.response.status} - ${error.response.statusText}`);
      }
    } else {
      throw new Error(`REST API request failed: ${error.message}`);
    }
  }
}

/**
 * パーミッションの確認
 */
async function testPermissions(url, username, password) {
  console.log('\n🔍 Testing permissions...');

  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  // ページの作成権限を確認
  try {
    const response = await axios.get(`${url}/wp-json/wp/v2/pages`, {
      headers: {
        'Authorization': `Basic ${auth}`
      },
      params: {
        per_page: 1
      },
      timeout: 10000
    });

    console.log('   ✓ Can read pages');

    // 書き込み権限のテスト（テストページの作成と削除）
    try {
      const testPage = await axios.post(
        `${url}/wp-json/wp/v2/pages`,
        {
          title: 'WC Docs Test Page (Safe to delete)',
          content: 'This is a test page created by the WooCommerce Docs deployment script. It can be safely deleted.',
          status: 'draft'
        },
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('   ✓ Can create pages');

      // テストページを削除
      await axios.delete(
        `${url}/wp-json/wp/v2/pages/${testPage.data.id}?force=true`,
        {
          headers: {
            'Authorization': `Basic ${auth}`
          },
          timeout: 10000
        }
      );

      console.log('   ✓ Can delete pages');

    } catch (error) {
      if (error.response && error.response.status === 403) {
        throw new Error('Insufficient permissions to create/delete pages. User needs Editor or Administrator role.');
      } else {
        throw new Error(`Permission test failed: ${error.message}`);
      }
    }

  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error('Insufficient permissions to read pages.');
    } else if (error.message.includes('Insufficient permissions')) {
      throw error;
    } else {
      throw new Error(`Permission check failed: ${error.message}`);
    }
  }
}

/**
 * 診断情報の表示
 */
function printDiagnostics() {
  console.log('\n📊 Diagnostic Information:');
  console.log('   Node version:', process.version);
  console.log('   Platform:', process.platform);
  console.log('   Architecture:', process.arch);
  console.log('   CWD:', process.cwd());
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  validateWordPressConnection().catch(() => {
    printDiagnostics();
    process.exit(1);
  });
}

module.exports = { validateWordPressConnection };
