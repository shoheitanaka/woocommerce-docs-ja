#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const simpleGit = require('simple-git');
const config = require('../config/config.json');

const git = simpleGit();

/**
 * 上流リポジトリから最新のドキュメントを同期
 */
async function syncUpstream() {
  console.log('🔄 Starting upstream synchronization...\n');

  try {
    // 上流リポジトリの設定
    const upstreamUrl = `https://github.com/${config.upstream.owner}/${config.upstream.repo}.git`;
    const upstreamBranch = config.upstream.branch;
    const docsPath = config.upstream.docsPath;

    console.log(`📡 Upstream: ${upstreamUrl}`);
    console.log(`🌿 Branch: ${upstreamBranch}`);
    console.log(`📁 Docs path: ${docsPath}\n`);

    // リモートの確認と追加
    const remotes = await git.getRemotes(true);
    const upstreamExists = remotes.some(remote => remote.name === 'upstream');

    if (!upstreamExists) {
      console.log('➕ Adding upstream remote...');
      await git.addRemote('upstream', upstreamUrl);
    }

    // 上流をフェッチ
    console.log('⬇️  Fetching upstream changes...');
    await git.fetch('upstream', upstreamBranch);

    // docsディレクトリの作成
    const docsDir = path.join(process.cwd(), 'docs');
    await fs.mkdir(docsDir, { recursive: true });

    // 上流のdocsディレクトリをチェックアウト
    console.log('📥 Checking out upstream docs...');
    try {
      execSync(
        `git checkout upstream/${upstreamBranch} -- ${docsPath}`,
        { stdio: 'inherit' }
      );
    } catch (error) {
      console.error('⚠️  Warning: Could not checkout all files');
    }

    // 除外パスの処理
    if (config.upstream.excludePaths && config.upstream.excludePaths.length > 0) {
      console.log('🗑️  Removing excluded paths...');
      for (const excludePath of config.upstream.excludePaths) {
        const fullPath = path.join(docsDir, excludePath);
        try {
          await fs.rm(fullPath, { recursive: true, force: true });
          console.log(`   ✓ Removed: ${excludePath}`);
        } catch (error) {
          // ファイルが存在しない場合は無視
        }
      }
    }

    // 変更されたファイルのリストを取得
    const status = await git.status();
    const changedFiles = [
      ...status.modified,
      ...status.created,
      ...status.deleted
    ].filter(file => file.startsWith(docsPath));

    console.log(`\n📊 Summary:`);
    console.log(`   Modified: ${status.modified.length}`);
    console.log(`   Created: ${status.created.length}`);
    console.log(`   Deleted: ${status.deleted.length}`);

    if (changedFiles.length === 0) {
      console.log('\n✅ No changes detected. Already up to date!');
      return { hasChanges: false, files: [] };
    }

    console.log(`\n📝 Changed files (${changedFiles.length}):`);
    changedFiles.forEach(file => {
      console.log(`   - ${file}`);
    });

    // メタデータファイルを作成
    const metadata = {
      syncDate: new Date().toISOString(),
      upstreamCommit: await getUpstreamLatestCommit(),
      filesChanged: changedFiles.length,
      files: changedFiles
    };

    const metadataPath = path.join(process.cwd(), 'translations', 'sync-metadata.json');
    await fs.mkdir(path.dirname(metadataPath), { recursive: true });
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    console.log('\n✅ Synchronization completed successfully!');
    console.log(`📄 Metadata saved to: ${metadataPath}`);

    return { hasChanges: true, files: changedFiles, metadata };

  } catch (error) {
    console.error('\n❌ Error during synchronization:', error.message);
    throw error;
  }
}

/**
 * 上流の最新コミットハッシュを取得
 */
async function getUpstreamLatestCommit() {
  try {
    const log = await git.log({
      from: `upstream/${config.upstream.branch}`,
      maxCount: 1
    });
    return log.latest.hash;
  } catch (error) {
    console.warn('⚠️  Could not get upstream commit hash');
    return null;
  }
}

/**
 * 差分ファイルの詳細を取得
 */
async function getFileDiff(filePath) {
  try {
    const diff = await git.diff([
      `upstream/${config.upstream.branch}`,
      '--',
      filePath
    ]);
    return diff;
  } catch (error) {
    return null;
  }
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  syncUpstream()
    .then(result => {
      if (result.hasChanges) {
        console.log('\n🎯 Next steps:');
        console.log('   1. Review the changes');
        console.log('   2. Run translation: npm run translate');
        console.log('   3. Deploy to WordPress: npm run deploy');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { syncUpstream, getUpstreamLatestCommit, getFileDiff };
