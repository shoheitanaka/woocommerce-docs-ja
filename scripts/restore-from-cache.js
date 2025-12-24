#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');

// ファイルパスをコマンドライン引数から取得
const filePath = process.argv[2] || 'docs/_docu-tools/README.md';

async function restoreFromCache() {
  try {
    // キャッシュ読み込み
    const cachePath = path.join(process.cwd(), 'translations/cache/translation-cache.json');
    const cache = JSON.parse(await fs.readFile(cachePath, 'utf-8'));

    // 元のファイル読み込み
    const content = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: markdown } = matter(content);

    // extractTranslatableSegmentsと同じロジック
    const allCodeBlocks = [];
    const allInlineCodes = [];
    const allUrls = [];

    let processedContent = markdown.replace(/```[\s\S]*?```/g, (match) => {
      const placeholder = `__CODE_BLOCK_${allCodeBlocks.length}__`;
      allCodeBlocks.push(match);
      return placeholder;
    });

    processedContent = processedContent.replace(/`[^`]+`/g, (match) => {
      const placeholder = `__INLINE_CODE_${allInlineCodes.length}__`;
      allInlineCodes.push(match);
      return placeholder;
    });

    processedContent = processedContent.replace(/https?:\/\/[^\s)]+/g, (match) => {
      const placeholder = `__URL_${allUrls.length}__`;
      allUrls.push(match);
      return placeholder;
    });

    const paragraphs = processedContent.split(/\n\n+/);

    // 翻訳を適用
    let translatedMarkdown = processedContent;
    let foundCount = 0;
    let notFoundCount = 0;

    console.log('\nChecking cache for segments...\n');

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (trimmed && trimmed.length > 10) {
        // 正規化
        let normalizedParagraph = paragraph;
        const segmentCodeBlocks = [];
        const segmentInlineCodes = [];
        const segmentUrls = [];
        
        const codeBlockMatches = paragraph.match(/__CODE_BLOCK_(\d+)__/g) || [];
        codeBlockMatches.forEach((match, newIndex) => {
          const oldIndex = parseInt(match.match(/\d+/)[0]);
          segmentCodeBlocks.push(allCodeBlocks[oldIndex]);
          normalizedParagraph = normalizedParagraph.replace(match, `__CODE_BLOCK_${newIndex}__`);
        });
        
        const inlineCodeMatches = paragraph.match(/__INLINE_CODE_(\d+)__/g) || [];
        inlineCodeMatches.forEach((match, newIndex) => {
          const oldIndex = parseInt(match.match(/\d+/)[0]);
          segmentInlineCodes.push(allInlineCodes[oldIndex]);
          normalizedParagraph = normalizedParagraph.replace(match, `__INLINE_CODE_${newIndex}__`);
        });
        
        const urlMatches = paragraph.match(/__URL_(\d+)__/g) || [];
        urlMatches.forEach((match, newIndex) => {
          const oldIndex = parseInt(match.match(/\d+/)[0]);
          segmentUrls.push(allUrls[oldIndex]);
          normalizedParagraph = normalizedParagraph.replace(match, `__URL_${newIndex}__`);
        });
        
        const hash = crypto.createHash('sha256').update(normalizedParagraph).digest('hex');
        
        if (cache.segments && cache.segments[hash]) {
          let translated = cache.segments[hash].translated;
          
          // プレースホルダーを復元
          segmentCodeBlocks.forEach((code, i) => {
            translated = translated.replace(`__CODE_BLOCK_${i}__`, code);
          });
          segmentInlineCodes.forEach((code, i) => {
            translated = translated.replace(`__INLINE_CODE_${i}__`, code);
          });
          segmentUrls.forEach((url, i) => {
            translated = translated.replace(`__URL_${i}__`, url);
          });
          
          translatedMarkdown = translatedMarkdown.replace(paragraph, translated);
          console.log(`✓ Found: ${normalizedParagraph.substring(0, 60)}...`);
          foundCount++;
        } else {
          console.log(`✗ Not found: ${normalizedParagraph.substring(0, 60)}...`);
          notFoundCount++;
        }
      }
    }

    console.log(`\nFound: ${foundCount}, Not found: ${notFoundCount}`);

    // 出力ファイルパス
    const outputPath = path.join('translations/ja', filePath);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // ファイルを保存
    const finalContent = matter.stringify(translatedMarkdown, frontmatter);
    await fs.writeFile(outputPath, finalContent, 'utf-8');
    
    console.log(`\n✓ Saved to: ${outputPath}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

restoreFromCache();
