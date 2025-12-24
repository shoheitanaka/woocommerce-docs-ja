#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const deepl = require('deepl-node');
const matter = require('gray-matter');
const { glob } = require('glob');
const config = require('../config/config.json');
require('dotenv').config();

// DeepL クライアント初期化
const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

// 統計情報
const stats = {
  totalFiles: 0,
  translatedFiles: 0,
  skippedFiles: 0,
  cacheHits: 0,
  apiCalls: 0,
  totalChars: 0,
  errors: []
};

/**
 * メイン翻訳処理
 */
async function translateDocuments(targetFiles = null) {
  console.log('🌐 Starting translation process...\n');

  try {
    // キャッシュの読み込み
    const cache = await loadCache();
    
    // 翻訳対象ファイルの取得
    const files = targetFiles || await getMarkdownFiles();
    stats.totalFiles = files.length;

    console.log(`📝 Found ${files.length} markdown files\n`);

    // ファイルごとに処理
    for (const filePath of files) {
      await translateFile(filePath, cache);
    }

    // キャッシュの保存
    await saveCache(cache);

    // 統計情報の表示
    printStats();

    return stats;

  } catch (error) {
    console.error('\n❌ Translation error:', error.message);
    throw error;
  }
}

/**
 * 個別ファイルの翻訳
 */
async function translateFile(filePath, cache) {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`\n📄 Processing: ${relativePath}`);

  try {
    // ファイル内容を読み込み
    const content = await fs.readFile(filePath, 'utf-8');
    const fileHash = calculateHash(content);

    // キャッシュチェック
    if (cache[filePath] && cache[filePath].hash === fileHash) {
      console.log('   ✓ Cache hit - skipping');
      stats.skippedFiles++;
      stats.cacheHits++;
      return;
    }

    // Frontmatter と本文を分離
    const { data: frontmatter, content: markdown } = matter(content);

    // 翻訳対象の抽出と分割
    const segments = extractTranslatableSegments(markdown);

    if (segments.length === 0) {
      console.log('   ⚠ No translatable content');
      stats.skippedFiles++;
      return;
    }

    // セグメント単位で翻訳
    const translatedSegments = await translateSegments(segments, cache);

    // 翻訳結果を結合
    const translatedMarkdown = reconstructMarkdown(markdown, translatedSegments);

    // Frontmatter の翻訳
    const translatedFrontmatter = await translateFrontmatter(frontmatter);

    // 翻訳ファイルの保存
    const outputPath = getOutputPath(filePath);
    await saveTranslatedFile(outputPath, translatedFrontmatter, translatedMarkdown);

    // キャッシュの更新
    cache[filePath] = {
      hash: fileHash,
      translatedAt: new Date().toISOString(),
      segments: translatedSegments.length
    };

    console.log(`   ✓ Translated (${translatedSegments.length} segments)`);
    stats.translatedFiles++;

  } catch (error) {
    console.error(`   ✗ Error: ${error.message}`);
    stats.errors.push({ file: relativePath, error: error.message });
  }
}

/**
 * 翻訳可能なセグメントを抽出（コードブロックとリンクを保護）
 */
function extractTranslatableSegments(markdown) {
  const segments = [];
  
  // 全体的なコードブロック、インラインコード、URLを保存
  const allCodeBlocks = [];
  const allInlineCodes = [];
  const allUrls = [];
  
  // コードブロックを一時的に置換
  let content = markdown.replace(/```[\s\S]*?```/g, (match) => {
    const placeholder = `__CODE_BLOCK_${allCodeBlocks.length}__`;
    allCodeBlocks.push(match);
    return placeholder;
  });

  // インラインコードを保護
  content = content.replace(/`[^`]+`/g, (match) => {
    const placeholder = `__INLINE_CODE_${allInlineCodes.length}__`;
    allInlineCodes.push(match);
    return placeholder;
  });

  // URLを保護
  content = content.replace(/https?:\/\/[^\s)]+/g, (match) => {
    const placeholder = `__URL_${allUrls.length}__`;
    allUrls.push(match);
    return placeholder;
  });

  // 段落単位で分割（空行で区切る）
  const paragraphs = content.split(/\n\n+/);

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (trimmed && trimmed.length > 10) {
      // このセグメント用のプレースホルダーを0からの連番に正規化
      let normalizedParagraph = paragraph;
      const segmentCodeBlocks = [];
      const segmentInlineCodes = [];
      const segmentUrls = [];
      
      // コードブロックの正規化
      const codeBlockMatches = paragraph.match(/__CODE_BLOCK_(\d+)__/g) || [];
      codeBlockMatches.forEach((match, newIndex) => {
        const oldIndex = parseInt(match.match(/\d+/)[0]);
        segmentCodeBlocks.push(allCodeBlocks[oldIndex]);
        normalizedParagraph = normalizedParagraph.replace(match, `__CODE_BLOCK_${newIndex}__`);
      });
      
      // インラインコードの正規化
      const inlineCodeMatches = paragraph.match(/__INLINE_CODE_(\d+)__/g) || [];
      inlineCodeMatches.forEach((match, newIndex) => {
        const oldIndex = parseInt(match.match(/\d+/)[0]);
        segmentInlineCodes.push(allInlineCodes[oldIndex]);
        normalizedParagraph = normalizedParagraph.replace(match, `__INLINE_CODE_${newIndex}__`);
      });
      
      // URLの正規化
      const urlMatches = paragraph.match(/__URL_(\d+)__/g) || [];
      urlMatches.forEach((match, newIndex) => {
        const oldIndex = parseInt(match.match(/\d+/)[0]);
        segmentUrls.push(allUrls[oldIndex]);
        normalizedParagraph = normalizedParagraph.replace(match, `__URL_${newIndex}__`);
      });
      
      segments.push({
        original: normalizedParagraph,
        codeBlocks: segmentCodeBlocks,
        inlineCodes: segmentInlineCodes,
        urls: segmentUrls
      });
    }
  }

  return segments;
}

/**
 * セグメント群を翻訳（バッチ処理とキャッシュ活用）
 */
async function translateSegments(segments, cache) {
  const translated = [];
  const batchSize = config.translation.batchSize || 10;
  const maxChars = config.translation.maxCharsPerRequest || 5000;

  for (let i = 0; i < segments.length; i += batchSize) {
    const batch = segments.slice(i, i + batchSize);
    
    // バッチ内の文字数チェック
    const batchText = batch.map(s => s.original).join('\n\n');
    const charCount = batchText.length;

    if (charCount > maxChars) {
      // 1つずつ処理
      for (const segment of batch) {
        const result = await translateSingleSegment(segment, cache);
        translated.push(result);
      }
    } else {
      // バッチで処理
      const results = await translateBatch(batch, cache);
      translated.push(...results);
    }

    // レート制限対策（無料版は1秒あたり数リクエストまで）
    if (i + batchSize < segments.length) {
      await sleep(1000);
    }
  }

  return translated;
}

/**
 * 単一セグメントを翻訳
 */
async function translateSingleSegment(segment, cache) {
  const segmentHash = calculateHash(segment.original);

  // セグメントレベルのキャッシュチェック
  if (cache.segments && cache.segments[segmentHash]) {
    console.log('   ↻ Segment cache hit');
    stats.cacheHits++;
    return cache.segments[segmentHash];
  }

  try {
    const result = await translator.translateText(
      segment.original,
      config.translation.sourceLang,
      config.translation.targetLang,
      {
        preserveFormatting: true,
        tagHandling: 'xml'
      }
    );

    stats.apiCalls++;
    stats.totalChars += segment.original.length;

    const translated = {
      original: segment.original,
      translated: result.text,
      metadata: segment
    };

    // セグメントキャッシュに保存
    if (!cache.segments) cache.segments = {};
    cache.segments[segmentHash] = translated;

    return translated;

  } catch (error) {
    console.error(`   ✗ Translation API error: ${error.message}`);
    return {
      original: segment.original,
      translated: segment.original, // フォールバック
      metadata: segment,
      error: error.message
    };
  }
}

/**
 * バッチ翻訳
 */
async function translateBatch(segments, cache) {
  const texts = segments.map(s => s.original);
  
  try {
    const results = await translator.translateText(
      texts,
      config.translation.sourceLang,
      config.translation.targetLang,
      {
        preserveFormatting: true,
        tagHandling: 'xml'
      }
    );

    stats.apiCalls++;
    stats.totalChars += texts.join('').length;

    return results.map((result, index) => {
      const segmentHash = calculateHash(segments[index].original);
      const translated = {
        original: segments[index].original,
        translated: result.text,
        metadata: segments[index]
      };

      // キャッシュに保存
      if (!cache.segments) cache.segments = {};
      cache.segments[segmentHash] = translated;

      return translated;
    });

  } catch (error) {
    console.error(`   ✗ Batch translation error: ${error.message}`);
    // エラー時は個別に処理
    const results = [];
    for (const segment of segments) {
      results.push(await translateSingleSegment(segment, cache));
    }
    return results;
  }
}

/**
 * Frontmatterの翻訳
 */
async function translateFrontmatter(frontmatter) {
  const translated = { ...frontmatter };

  // タイトルと説明のみ翻訳
  if (frontmatter.title) {
    try {
      const result = await translator.translateText(
        frontmatter.title,
        config.translation.sourceLang,
        config.translation.targetLang
      );
      translated.title = result.text;
      stats.apiCalls++;
    } catch (error) {
      console.error('   ⚠ Frontmatter title translation failed');
    }
  }

  if (frontmatter.description) {
    try {
      const result = await translator.translateText(
        frontmatter.description,
        config.translation.sourceLang,
        config.translation.targetLang
      );
      translated.description = result.text;
      stats.apiCalls++;
    } catch (error) {
      console.error('   ⚠ Frontmatter description translation failed');
    }
  }

  return translated;
}

/**
 * マークダウンを再構築（プレースホルダーを復元）
 */
function reconstructMarkdown(original, translatedSegments) {
  let result = original;

  for (const segment of translatedSegments) {
    let translated = segment.translated;

    // metadata が存在しない場合はスキップ
    if (!segment.metadata) {
      console.warn('Warning: segment.metadata is undefined, skipping placeholder restoration');
      result = result.replace(segment.original, translated);
      continue;
    }

    // コードブロックを復元
    if (segment.metadata.codeBlocks) {
      segment.metadata.codeBlocks.forEach((code, i) => {
        translated = translated.replace(`__CODE_BLOCK_${i}__`, code);
      });
    }

    // インラインコードを復元
    if (segment.metadata.inlineCodes) {
      segment.metadata.inlineCodes.forEach((code, i) => {
        translated = translated.replace(`__INLINE_CODE_${i}__`, code);
      });
    }

    // URLを復元
    if (segment.metadata.urls) {
      segment.metadata.urls.forEach((url, i) => {
        translated = translated.replace(`__URL_${i}__`, url);
      });
    }

    result = result.replace(segment.original, translated);
  }

  return result;
}

/**
 * キャッシュの読み込み
 */
async function loadCache() {
  const cachePath = path.join(process.cwd(), 'translations', 'cache', 'translation-cache.json');
  
  try {
    const data = await fs.readFile(cachePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { segments: {} };
  }
}

/**
 * キャッシュの保存
 */
async function saveCache(cache) {
  const cachePath = path.join(process.cwd(), 'translations', 'cache', 'translation-cache.json');
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, JSON.stringify(cache, null, 2));
}

/**
 * 翻訳ファイルの保存
 */
async function saveTranslatedFile(outputPath, frontmatter, content) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  const output = matter.stringify(content, frontmatter);
  await fs.writeFile(outputPath, output, 'utf-8');
}

/**
 * 出力パスの取得
 */
function getOutputPath(inputPath) {
  const relativePath = path.relative(path.join(process.cwd(), 'docs'), inputPath);
  return path.join(process.cwd(), 'translations', 'ja', relativePath);
}

/**
 * マークダウンファイルの取得
 */
async function getMarkdownFiles() {
  const pattern = path.join(process.cwd(), 'docs', '**', '*.md');
  return await glob(pattern, { 
    nodir: true,
    absolute: true 
  });
}

/**
 * ハッシュ計算
 */
function calculateHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * スリープ
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 統計情報の表示
 */
function printStats() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Translation Statistics');
  console.log('='.repeat(60));
  console.log(`Total files:       ${stats.totalFiles}`);
  console.log(`Translated:        ${stats.translatedFiles}`);
  console.log(`Skipped (cached):  ${stats.skippedFiles}`);
  console.log(`Cache hits:        ${stats.cacheHits}`);
  console.log(`API calls:         ${stats.apiCalls}`);
  console.log(`Total characters:  ${stats.totalChars.toLocaleString()}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors: ${stats.errors.length}`);
    stats.errors.forEach(err => {
      console.log(`   - ${err.file}: ${err.error}`);
    });
  }
  
  console.log('='.repeat(60));
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  const targetFiles = process.argv.slice(2);
  
  translateDocuments(targetFiles.length > 0 ? targetFiles : null)
    .then(() => {
      console.log('\n✅ Translation completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { translateDocuments, translateFile };
