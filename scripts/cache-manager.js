#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { glob } = require('glob');

const CACHE_DIR = path.join(process.cwd(), 'translations', 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'translation-cache.json');
const HASH_MAP_FILE = path.join(CACHE_DIR, 'hash-map.json');

/**
 * キャッシュ管理クラス
 */
class CacheManager {
  constructor() {
    this.cache = { segments: {} };
    this.hashMap = {};
  }

  /**
   * キャッシュを読み込み
   */
  async load() {
    try {
      const data = await fs.readFile(CACHE_FILE, 'utf-8');
      this.cache = JSON.parse(data);
      console.log('✓ Cache loaded');
    } catch (error) {
      console.log('ℹ No existing cache found');
      this.cache = { segments: {} };
    }

    try {
      const data = await fs.readFile(HASH_MAP_FILE, 'utf-8');
      this.hashMap = JSON.parse(data);
      console.log('✓ Hash map loaded');
    } catch (error) {
      console.log('ℹ No existing hash map found');
      this.hashMap = {};
    }
  }

  /**
   * キャッシュを保存
   */
  async save() {
    await fs.mkdir(CACHE_DIR, { recursive: true });

    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify(this.cache, null, 2)
    );
    console.log('✓ Cache saved');

    await fs.writeFile(
      HASH_MAP_FILE,
      JSON.stringify(this.hashMap, null, 2)
    );
    console.log('✓ Hash map saved');
  }

  /**
   * ファイルハッシュを計算
   */
  calculateFileHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * キャッシュをクリア
   */
  async clear() {
    console.log('🗑️  Clearing cache...');
    
    try {
      await fs.unlink(CACHE_FILE);
      await fs.unlink(HASH_MAP_FILE);
      console.log('✓ Cache cleared');
    } catch (error) {
      console.log('ℹ No cache to clear');
    }

    this.cache = { segments: {} };
    this.hashMap = {};
  }

  /**
   * キャッシュ統計を表示
   */
  async stats() {
    await this.load();

    const segmentCount = Object.keys(this.cache.segments || {}).length;
    const fileCount = Object.keys(this.hashMap).length;

    // キャッシュサイズを計算
    let totalSize = 0;
    try {
      const cacheStats = await fs.stat(CACHE_FILE);
      totalSize += cacheStats.size;
      const hashStats = await fs.stat(HASH_MAP_FILE);
      totalSize += hashStats.size;
    } catch (error) {
      // ファイルが存在しない
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Cache Statistics');
    console.log('='.repeat(60));
    console.log(`Cached segments:  ${segmentCount.toLocaleString()}`);
    console.log(`Tracked files:    ${fileCount}`);
    console.log(`Cache size:       ${(totalSize / 1024).toFixed(2)} KB`);
    console.log('='.repeat(60));

    // 最近の更新
    const recentFiles = Object.entries(this.hashMap)
      .sort((a, b) => new Date(b[1].updatedAt) - new Date(a[1].updatedAt))
      .slice(0, 5);

    if (recentFiles.length > 0) {
      console.log('\n📝 Recently cached files:');
      recentFiles.forEach(([file, data]) => {
        const relativePath = path.relative(process.cwd(), file);
        console.log(`   - ${relativePath}`);
        console.log(`     Updated: ${new Date(data.updatedAt).toLocaleString()}`);
      });
    }
  }

  /**
   * キャッシュを更新
   */
  async update() {
    console.log('🔄 Updating cache...\n');
    await this.load();

    const docsPattern = path.join(process.cwd(), 'docs', '**', '*.md');
    const files = await glob(docsPattern, {
      nodir: true,
      absolute: true
    });

    console.log(`Found ${files.length} markdown files`);

    let updated = 0;
    let unchanged = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const hash = this.calculateFileHash(content);

      if (this.hashMap[file]?.hash !== hash) {
        this.hashMap[file] = {
          hash,
          updatedAt: new Date().toISOString(),
          size: content.length
        };
        updated++;
      } else {
        unchanged++;
      }
    }

    await this.save();

    console.log(`\n✓ Cache updated`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Unchanged: ${unchanged}`);
  }

  /**
   * 期限切れキャッシュを削除
   */
  async cleanup(expiryDays = 30) {
    console.log(`🧹 Cleaning up cache (older than ${expiryDays} days)...\n`);
    await this.load();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - expiryDays);

    let removed = 0;

    // ファイルハッシュマップのクリーンアップ
    for (const [file, data] of Object.entries(this.hashMap)) {
      const updatedAt = new Date(data.updatedAt);
      if (updatedAt < expiryDate) {
        delete this.hashMap[file];
        removed++;
      }
    }

    await this.save();

    console.log(`✓ Cleanup completed`);
    console.log(`   Removed: ${removed} entries`);
  }

  /**
   * キャッシュの検証
   */
  async validate() {
    console.log('🔍 Validating cache...\n');
    await this.load();

    let valid = 0;
    let invalid = 0;
    let missing = 0;

    for (const [file, data] of Object.entries(this.hashMap)) {
      try {
        const exists = await fs.access(file).then(() => true).catch(() => false);
        
        if (!exists) {
          console.log(`⚠️  Missing file: ${path.relative(process.cwd(), file)}`);
          missing++;
          continue;
        }

        const content = await fs.readFile(file, 'utf-8');
        const hash = this.calculateFileHash(content);

        if (hash === data.hash) {
          valid++;
        } else {
          console.log(`⚠️  Hash mismatch: ${path.relative(process.cwd(), file)}`);
          invalid++;
        }
      } catch (error) {
        console.log(`✗ Error checking ${file}: ${error.message}`);
        invalid++;
      }
    }

    console.log(`\n📊 Validation results:`);
    console.log(`   Valid: ${valid}`);
    console.log(`   Invalid: ${invalid}`);
    console.log(`   Missing: ${missing}`);
    console.log(`   Total: ${valid + invalid + missing}`);

    return { valid, invalid, missing };
  }
}

/**
 * メイン処理
 */
async function main() {
  const command = process.argv[2] || 'stats';
  const manager = new CacheManager();

  switch (command) {
    case 'clear':
      await manager.clear();
      break;

    case 'stats':
      await manager.stats();
      break;

    case 'update':
      await manager.update();
      break;

    case 'cleanup':
      const days = parseInt(process.argv[3]) || 30;
      await manager.cleanup(days);
      break;

    case 'validate':
      await manager.validate();
      break;

    default:
      console.log('Usage: node cache-manager.js [command]');
      console.log('\nCommands:');
      console.log('  clear           - Clear all cache');
      console.log('  stats           - Show cache statistics');
      console.log('  update          - Update cache hash map');
      console.log('  cleanup [days]  - Remove old cache entries');
      console.log('  validate        - Validate cache integrity');
      process.exit(1);
  }
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = CacheManager;
