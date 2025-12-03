#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * デプロイレポートの生成
 */
async function generateDeployReport() {
  try {
    // デプロイメタデータの読み込み
    const metadata = await loadDeployMetadata();

    // レポートの生成
    const report = buildDeployReport(metadata);

    // 出力
    console.log(report);

    return metadata;

  } catch (error) {
    console.error('Error generating deploy report:', error.message);
    return null;
  }
}

/**
 * デプロイメタデータの読み込み
 */
async function loadDeployMetadata() {
  const metadataDir = path.join(
    process.cwd(),
    'translations',
    'deploy-metadata'
  );

  try {
    const files = await fs.readdir(metadataDir);
    const metadata = {
      deployedFiles: [],
      timestamp: new Date().toISOString(),
      totalDeployed: 0,
      errors: []
    };

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(metadataDir, file);
        const data = await fs.readFile(filePath, 'utf-8');
        const fileMetadata = JSON.parse(data);
        metadata.deployedFiles.push(fileMetadata);
        metadata.totalDeployed++;
      }
    }

    // 最新のデプロイ順にソート
    metadata.deployedFiles.sort((a, b) => 
      new Date(b.deployedAt) - new Date(a.deployedAt)
    );

    return metadata;

  } catch (error) {
    return {
      deployedFiles: [],
      timestamp: new Date().toISOString(),
      totalDeployed: 0,
      errors: [error.message]
    };
  }
}

/**
 * デプロイレポートの構築
 */
function buildDeployReport(metadata) {
  const {
    deployedFiles = [],
    timestamp = new Date().toISOString(),
    totalDeployed = 0,
    errors = []
  } = metadata;

  let report = '## 🚀 Deployment Report\n\n';

  // サマリー
  report += '### Summary\n\n';
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| **Total Deployed** | ${totalDeployed} |\n`;
  report += `| **WordPress URL** | ${process.env.WORDPRESS_URL || 'Not set'} |\n`;
  report += `| **Timestamp** | ${new Date(timestamp).toLocaleString()} |\n\n`;

  // デプロイされたファイル
  if (deployedFiles.length > 0) {
    report += '### 📄 Deployed Files\n\n';
    
    const recentFiles = deployedFiles.slice(0, 10);
    recentFiles.forEach(file => {
      const fileName = path.basename(file.slug);
      const url = file.wpUrl || `${process.env.WORDPRESS_URL}/${file.slug}`;
      report += `- [${fileName}](${url})\n`;
      report += `  - Deployed: ${new Date(file.deployedAt).toLocaleString()}\n`;
    });

    if (deployedFiles.length > 10) {
      report += `\n... and ${deployedFiles.length - 10} more files\n`;
    }
  }

  // エラーがあれば表示
  if (errors.length > 0) {
    report += `\n### ⚠️ Errors\n\n`;
    errors.forEach(error => {
      report += `- ${error}\n`;
    });
  }

  // 次のステップ
  report += '\n### ✅ Verification\n\n';
  report += `Visit your WordPress site to verify the deployment:\n`;
  report += `[${process.env.WORDPRESS_URL}](${process.env.WORDPRESS_URL})\n\n`;

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
    `total_deployed=${metadata.totalDeployed || 0}`,
    `has_errors=${metadata.errors && metadata.errors.length > 0 ? 'true' : 'false'}`
  ].join('\n');

  await fs.appendFile(process.env.GITHUB_OUTPUT, output + '\n');
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  generateDeployReport()
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

module.exports = { generateDeployReport };
