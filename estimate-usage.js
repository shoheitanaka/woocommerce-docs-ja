#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

/**
 * DeepL API使用量の見積もり
 */
async function estimateUsage() {
  console.log('📊 Estimating DeepL API usage...\n');

  try {
    // 対象ファイルを取得
    const files = process.env.FILES 
      ? process.env.FILES.split('\n').filter(f => f)
      : await getMarkdownFiles();

    let totalChars = 0;
    let totalSegments = 0;
    const fileStats = [];

    for (const filePath of files) {
      const stats = await estimateFile(filePath);
      totalChars += stats.chars;
      totalSegments += stats.segments;
      fileStats.push(stats);
    }

    // 結果を表示
    printEstimate(fileStats, totalChars, totalSegments);

    // GitHub Actions用の出力
    if (process.env.GITHUB_OUTPUT) {
      await fs.appendFile(
        process.env.GITHUB_OUTPUT,
        `estimated_chars=${totalChars}\n`
      );
    }

    return {
      totalChars,
      totalSegments,
      files: fileStats
    };

  } catch (error) {
    console.error('❌ Estimation error:', error.message);
    throw error;
  }
}

/**
 * 個別ファイルの見積もり
 */
async function estimateFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { content: markdown } = matter(content);

  // コードブロックを除外
  let textContent = markdown.replace(/```[\s\S]*?```/g, '');
  
  // インラインコードを除外
  textContent = textContent.replace(/`[^`]+`/g, '');
  
  // URLを除外
  textContent = textContent.replace(/https?:\/\/[^\s)]+/g, '');

  // 翻訳対象の段落数を推定
  const paragraphs = textContent
    .split(/\n\n+/)
    .filter(p => p.trim().length > 10);

  const chars = textContent.length;
  const segments = paragraphs.length;

  return {
    file: path.relative(process.cwd(), filePath),
    chars,
    segments
  };
}

/**
 * 見積もり結果の表示
 */
function printEstimate(fileStats, totalChars, totalSegments) {
  console.log('='.repeat(70));
  console.log('📊 DeepL API Usage Estimate');
  console.log('='.repeat(70));

  // ファイルごとの統計
  console.log('\n📄 Per-file statistics:');
  fileStats
    .sort((a, b) => b.chars - a.chars)
    .slice(0, 10)
    .forEach(stat => {
      console.log(`   ${stat.file}`);
      console.log(`   ├─ Characters: ${stat.chars.toLocaleString()}`);
      console.log(`   └─ Segments: ${stat.segments}`);
    });

  if (fileStats.length > 10) {
    console.log(`   ... and ${fileStats.length - 10} more files`);
  }

  // 合計統計
  console.log('\n' + '─'.repeat(70));
  console.log(`Total files:      ${fileStats.length}`);
  console.log(`Total characters: ${totalChars.toLocaleString()}`);
  console.log(`Total segments:   ${totalSegments.toLocaleString()}`);

  // DeepL無料枠との比較
  const FREE_LIMIT = 500000; // 月間50万文字
  const percentage = (totalChars / FREE_LIMIT * 100).toFixed(2);

  console.log('\n📈 DeepL Free Tier Impact:');
  console.log(`   Estimated usage: ${percentage}% of monthly limit`);
  
  if (totalChars > FREE_LIMIT) {
    console.log(`   ⚠️  WARNING: Exceeds free tier limit by ${(totalChars - FREE_LIMIT).toLocaleString()} characters`);
  } else {
    console.log(`   ✅ Within free tier (${(FREE_LIMIT - totalChars).toLocaleString()} characters remaining)`);
  }

  // API呼び出し数の推定
  const CHARS_PER_REQUEST = 5000;
  const estimatedCalls = Math.ceil(totalChars / CHARS_PER_REQUEST);

  console.log('\n🔌 Estimated API calls:');
  console.log(`   Approximately ${estimatedCalls} API requests`);
  console.log(`   (based on ${CHARS_PER_REQUEST} chars per request)`);

  // 実行時間の推定
  const SECONDS_PER_CALL = 1.5; // レート制限を考慮
  const estimatedTime = Math.ceil(estimatedCalls * SECONDS_PER_CALL / 60);

  console.log('\n⏱️  Estimated processing time:');
  console.log(`   Approximately ${estimatedTime} minutes`);

  console.log('='.repeat(70));
}

/**
 * マークダウンファイルの取得
 */
async function getMarkdownFiles() {
  const glob = require('glob');
  const pattern = path.join(process.cwd(), 'docs', '**', '*.md');

  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  estimateUsage()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { estimateUsage, estimateFile };
