#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * 翻訳レポートの生成
 */
async function generateReport() {
  try {
    // メタデータの読み込み
    const metadata = await loadMetadata();

    // レポートの生成
    const report = buildReport(metadata);

    // 出力
    console.log(report);

    return metadata;

  } catch (error) {
    console.error('Error generating report:', error.message);
    return null;
  }
}

/**
 * メタデータの読み込み
 */
async function loadMetadata() {
  const metadataPath = path.join(
    process.cwd(),
    'translations',
    'translation-metadata.json'
  );

  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // メタデータファイルが存在しない場合は空のオブジェクトを返す
    return {
      translatedFiles: 0,
      totalChars: 0,
      apiCalls: 0,
      cacheHits: 0,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * レポートの構築
 */
function buildReport(metadata) {
  const {
    translatedFiles = 0,
    skippedFiles = 0,
    totalChars = 0,
    apiCalls = 0,
    cacheHits = 0,
    errors = [],
    timestamp = new Date().toISOString()
  } = metadata;

  let report = '## 🌐 Translation Report\n\n';

  // サマリー
  report += '### Summary\n\n';
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| **Translated Files** | ${translatedFiles} |\n`;
  report += `| **Skipped Files** | ${skippedFiles} |\n`;
  report += `| **Total Characters** | ${totalChars.toLocaleString()} |\n`;
  report += `| **API Calls** | ${apiCalls} |\n`;
  report += `| **Cache Hits** | ${cacheHits} |\n`;
  report += `| **Timestamp** | ${new Date(timestamp).toLocaleString()} |\n\n`;

  // DeepL使用状況
  const FREE_LIMIT = 500000;
  const usagePercent = (totalChars / FREE_LIMIT * 100).toFixed(2);

  report += '### 📊 DeepL API Usage\n\n';
  report += `- **Characters used**: ${totalChars.toLocaleString()} / ${FREE_LIMIT.toLocaleString()} (${usagePercent}%)\n`;
  
  if (totalChars > FREE_LIMIT) {
    report += `- ⚠️ **Warning**: Exceeded free tier limit\n`;
  } else {
    const remaining = FREE_LIMIT - totalChars;
    report += `- ✅ **Remaining**: ${remaining.toLocaleString()} characters\n`;
  }

  // キャッシュ効率
  const totalOperations = apiCalls + cacheHits;
  if (totalOperations > 0) {
    const cacheEfficiency = (cacheHits / totalOperations * 100).toFixed(2);
    report += `\n### 💾 Cache Efficiency\n\n`;
    report += `- **Cache hit rate**: ${cacheEfficiency}%\n`;
    report += `- **API calls saved**: ${cacheHits}\n`;
  }

  // エラーがあれば表示
  if (errors && errors.length > 0) {
    report += `\n### ⚠️ Errors (${errors.length})\n\n`;
    errors.slice(0, 5).forEach(error => {
      report += `- \`${error.file}\`: ${error.error}\n`;
    });
    if (errors.length > 5) {
      report += `- ... and ${errors.length - 5} more errors\n`;
    }
  }

  // 次のステップ
  report += '\n### 🚀 Next Steps\n\n';
  report += '1. Review the translated files in `translations/ja/`\n';
  report += '2. Check for any translation issues or errors\n';
  report += '3. Merge this PR to deploy to WordPress\n';

  return report;
}

/**
 * GitHub Actions用の出力を設定
 */
async function setGitHubOutput(metadata) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  const output = [
    `total_chars=${metadata.totalChars || 0}`,
    `api_calls=${metadata.apiCalls || 0}`,
    `cache_hits=${metadata.cacheHits || 0}`,
    `translated_files=${metadata.translatedFiles || 0}`
  ].join('\n');

  await fs.appendFile(process.env.GITHUB_OUTPUT, output + '\n');
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  generateReport()
    .then(metadata => {
      if (metadata && process.env.GITHUB_OUTPUT) {
        return setGitHubOutput(metadata);
      }
    })
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateReport };
