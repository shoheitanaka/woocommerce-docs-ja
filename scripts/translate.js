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

// Glossary
let deeplGlossary = null;

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
    // Glossaryの初期化
    await initializeGlossary();
    
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

    // Frontmatter と本文を分離
    const { data: frontmatter, content: markdown } = matter(content);

    // キャッシュチェック - キャッシュがある場合は復元して保存
    if (cache[filePath] && cache[filePath].hash === fileHash) {
      console.log('   ✓ Cache hit - restoring from cache');
      const translatedMarkdown = await restoreFromCache(markdown, cache);
      const translatedFrontmatter = await translateFrontmatter(frontmatter);
      const outputPath = getOutputPath(filePath);
      await saveTranslatedFile(outputPath, translatedFrontmatter, translatedMarkdown);
      stats.skippedFiles++;
      stats.cacheHits++;
      return;
    }

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
 * キャッシュから翻訳を復元
 */
async function restoreFromCache(markdown, cache) {
  // extractTranslatableSegmentsと同じロジックでプレースホルダー置換
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
  const translatedParagraphs = [];

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    
    // 空行、コードブロック単体、画像単体をそのまま保持
    if (!trimmed || 
        trimmed.match(/^__CODE_BLOCK_\d+__$/) || 
        trimmed.match(/^!\[.*\]\(__URL_\d+__\)$/)) {
      translatedParagraphs.push(paragraph.replace(/__CODE_BLOCK_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allCodeBlocks[index] || match;
      }).replace(/__INLINE_CODE_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allInlineCodes[index] || match;
      }).replace(/__URL_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allUrls[index] || match;
      }));
      continue;
    }
    
    if (trimmed && trimmed.length > 10) {
      // プレースホルダーを正規化
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
        
        translatedParagraphs.push(translated);
      } else {
        // キャッシュにない場合は元のまま
        translatedParagraphs.push(paragraph.replace(/__CODE_BLOCK_(\d+)__/g, (match) => {
          const index = parseInt(match.match(/\d+/)[0]);
          return allCodeBlocks[index] || match;
        }).replace(/__INLINE_CODE_(\d+)__/g, (match) => {
          const index = parseInt(match.match(/\d+/)[0]);
          return allInlineCodes[index] || match;
        }).replace(/__URL_(\d+)__/g, (match) => {
          const index = parseInt(match.match(/\d+/)[0]);
          return allUrls[index] || match;
        }));
      }
    }
  }

  let result = translatedParagraphs.join('\n\n');
  
  // 後処理: リストアイテムの先頭にある余分な__を削除
  // パターン: "-   __`code`" → "-   `code`"
  result = result.replace(/^([-*+]\s+)__(`[^`]+`)/gm, '$1$2');
  
  return result;
}

/**
 * 翻訳可能なセグメントを抽出（コードブロックとリンクを保護）
 */
function extractTranslatableSegments(markdown) {
  const segments = [];
  const apiMaxChars = config?.translation?.maxCharsPerRequest || 5000;
  const segmentSplitThreshold = Math.max(1000, apiMaxChars - 500); // API上限に近い長文を分割
  const chunkSizeLimit = Math.max(500, segmentSplitThreshold - 500); // 分割後チャンクの目安サイズ
  
  // 全体的なコードブロック、インラインコード、URLを保存
  const allCodeBlocks = [];
  const allInlineCodes = [];
  const allUrls = [];
  
  // コードブロックを一時的に置換（元の改行を保持）
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

  // 段落単位で分割
  // 1. 見出しの前に特別なマーカーを挿入して強制分割
  content = content.replace(/^(#{1,6}\s)/gm, '__HEADING_START__\n$1');
  
  // 2. 空行と見出しマーカーで段落を分割
  const paragraphs = content.split(/\n\n+|__HEADING_START__\n/).filter(p => p.trim());
  
  let debugSegmentCount = 0;

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    
    // 空行、コードブロック単体はセグメントとして抽出しない
    // 画像は代替テキストを翻訳するため、スキップしない
    if (!trimmed || trimmed.match(/^__CODE_BLOCK_\d+__$/)) {
      if (process.env.DEBUG_SEGMENTS) {
        console.log(`   [Skipped] Length: ${trimmed.length}, Type: ${trimmed.match(/^__CODE_BLOCK_/) ? 'CODE_BLOCK' : 'EMPTY'}`);
      }
      continue;
    }
    
    if (trimmed && trimmed.length > 10) {
      debugSegmentCount++;
      if (process.env.DEBUG_SEGMENTS) {
        console.log(`   [Segment ${debugSegmentCount}] Length: ${trimmed.length}, Preview: ${trimmed.substring(0, 80)}...`);
      }
      
      // 非常に長いセグメントを分割（APIリクエストの上限に合わせる）
      if (trimmed.length > segmentSplitThreshold) {
        console.log(`   ⚠ Warning: Segment ${debugSegmentCount} exceeds safe length (${trimmed.length} chars > ${segmentSplitThreshold}). Splitting into smaller parts...`);
        
        let chunks = [];
        
        // 戦略1: コードブロックプレースホルダーの前後で分割
        const codeBlockPattern = /__CODE_BLOCK_\d+__/g;
        const hasCodeBlocks = paragraph.match(codeBlockPattern);
        
        if (hasCodeBlocks && hasCodeBlocks.length > 1) {
          // コードブロックの位置で分割
          const parts = paragraph.split(/(__CODE_BLOCK_\d+__)/);
          let currentChunk = '';
          
          for (const part of parts) {
            if (!part) continue;
            
            if (currentChunk.length + part.length > chunkSizeLimit) {
              if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
              }
              currentChunk = part;
            } else {
              currentChunk += part;
            }
          }
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
          }
          
          console.log(`   → Split by code blocks into ${chunks.length} chunks`);
        } 
        // 戦略2: 空行で分割
        else if (paragraph.includes('\n\n')) {
          const parts = paragraph.split(/\n\n+/);
          let currentChunk = '';
          
          for (const part of parts) {
            if (!part.trim()) continue;
            
            if (currentChunk.length + part.length + 2 > chunkSizeLimit) {
              if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
              }
              currentChunk = part;
            } else {
              currentChunk += (currentChunk ? '\n\n' : '') + part;
            }
          }
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
          }
          
          console.log(`   → Split by paragraphs into ${chunks.length} chunks`);
        }
        // 戦略3: 単一改行で分割
        else if (paragraph.includes('\n')) {
          const lines = paragraph.split('\n');
          let currentChunk = '';
          
          for (const line of lines) {
            if (currentChunk.length + line.length + 1 > chunkSizeLimit) {
              if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
              }
              currentChunk = line;
            } else {
              currentChunk += (currentChunk ? '\n' : '') + line;
            }
          }
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
          }
          
          console.log(`   → Split by lines into ${chunks.length} chunks`);
        }
        // 戦略4: 強制的に文字数で分割（最後の手段）
        else {
          const text = paragraph;
          for (let i = 0; i < text.length; i += chunkSizeLimit) {
            chunks.push(text.substring(i, i + chunkSizeLimit).trim());
          }
          
          console.log(`   → Force split by character count into ${chunks.length} chunks`);
        }
        
        // チャンクが依然として長い場合は文字数でさらに分割
        const normalizedChunks = chunks.flatMap(chunk => {
          if (chunk.length <= segmentSplitThreshold) return [chunk];
          const forced = [];
          for (let i = 0; i < chunk.length; i += chunkSizeLimit) {
            forced.push(chunk.substring(i, i + chunkSizeLimit).trim());
          }
          return forced;
        });
        
        console.log(`   Chunk sizes: ${normalizedChunks.map(c => c.length).join(', ')}`);
        
        // 各チャンクを個別のセグメントとして追加
        for (const chunk of normalizedChunks) {
          if (chunk.length > 10) {
            let normalizedChunk = chunk;
            const segmentCodeBlocks = [];
            const segmentInlineCodes = [];
            const segmentUrls = [];
            
            // コードブロックの正規化
            const codeBlockMatches = chunk.match(/__CODE_BLOCK_(\d+)__/g) || [];
            codeBlockMatches.forEach((match, newIndex) => {
              const oldIndex = parseInt(match.match(/\d+/)[0]);
              segmentCodeBlocks.push(allCodeBlocks[oldIndex]);
              normalizedChunk = normalizedChunk.replace(match, `__CODE_BLOCK_${newIndex}__`);
            });
            
            // インラインコードの正規化
            const inlineCodeMatches = chunk.match(/__INLINE_CODE_(\d+)__/g) || [];
            inlineCodeMatches.forEach((match, newIndex) => {
              const oldIndex = parseInt(match.match(/\d+/)[0]);
              segmentInlineCodes.push(allInlineCodes[oldIndex]);
              normalizedChunk = normalizedChunk.replace(match, `__INLINE_CODE_${newIndex}__`);
            });
            
            // URLの正規化
            const urlMatches = chunk.match(/__URL_(\d+)__/g) || [];
            urlMatches.forEach((match, newIndex) => {
              const oldIndex = parseInt(match.match(/\d+/)[0]);
              segmentUrls.push(allUrls[oldIndex]);
              normalizedChunk = normalizedChunk.replace(match, `__URL_${newIndex}__`);
            });
            
            segments.push({
              original: normalizedChunk,
              codeBlocks: segmentCodeBlocks,
              inlineCodes: segmentInlineCodes,
              urls: segmentUrls
            });
          }
        }
        continue; // 次の段落へ
      }
      
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

/** * DeepL APIの翻訳結果を自動修正
 * Markdownリンクや画像の開始括弧が欠けている問題を修正
 */
function fixDeepLMarkdownIssues(original, translated) {
  // ===== 0. HTMLエンティティのデコード =====
  // DeepLが記号をHTMLエンティティに変換してしまうことがあるので、元に戻す
  const entityMap = {
    '&gt;': '>',
    '&lt;': '<',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'"
  };
  
  let hasEntityIssue = false;
  for (const [entity, char] of Object.entries(entityMap)) {
    if (translated.includes(entity)) {
      hasEntityIssue = true;
      translated = translated.replace(new RegExp(entity, 'g'), char);
    }
  }
  
  if (hasEntityIssue) {
    console.log('   ⚠ Auto-fixed: Decoded HTML entities (&gt; → >, etc.)');
  }
  
  // ===== 0.5. 全角括弧・記号を半角に変換 =====
  // DeepLが Markdown の [] を全角の【】に変換することがあるので、元に戻す
  // 特に画像の alt text で発生しやすい: ![alt text] → alt text】
  // また、画像マーカー ![ が全角の！[ になることもある
  let hasBracketIssue = false;
  if (translated.includes('】') || translated.includes('【') || translated.includes('！[')) {
    const beforeBracket = translated;
    translated = translated.replace(/【/g, '[').replace(/】/g, ']');
    // 画像マーカーの全角感嘆符を半角に変換: ！[ → ![
    translated = translated.replace(/！\[/g, '![');
    if (translated !== beforeBracket) {
      hasBracketIssue = true;
      console.log('   ⚠ Auto-fixed: Converted full-width brackets/symbols (【】！ → []!)');
    }
  }
  
  // ===== 1. DeepL APIがプレースホルダーを翻訳してしまう問題を修正 =====
  // "コード_ブロック_0__" → "__CODE_BLOCK_0__"
  if (original.match(/__CODE_BLOCK_\d+__/)) {
    translated = translated.replace(/コード[_\s]*ブロック[_\s]*(\d+)__/g, (match, num) => {
      console.log('   ⚠ Auto-fixed: Reverted Japanese translation of CODE_BLOCK placeholder');
      return `__CODE_BLOCK_${num}__`;
    });
    
    // 小文字に変換されている場合も修正: "__code_block_0__" → "__CODE_BLOCK_0__"
    translated = translated.replace(/__code_block_(\d+)__/g, (match, num) => {
      console.log('   ⚠ Auto-fixed: Corrected lowercase code_block placeholder');
      return `__CODE_BLOCK_${num}__`;
    });
  }
  
  // "インラインコード_0__" → "__INLINE_CODE_0__"
  if (original.match(/__INLINE_CODE_\d+__/)) {
    translated = translated.replace(/インライン[_\s]*コード[_\s]*(\d+)__/g, (match, num) => {
      console.log('   ⚠ Auto-fixed: Reverted Japanese translation of INLINE_CODE placeholder');
      return `__INLINE_CODE_${num}__`;
    });
    
    // 小文字に変換されている場合も修正: "__inline_code_0__" → "__INLINE_CODE_0__"
    translated = translated.replace(/__inline_code_(\d+)__/g, (match, num) => {
      console.log('   ⚠ Auto-fixed: Corrected lowercase inline_code placeholder');
      return `__INLINE_CODE_${num}__`;
    });
  }
  
  // "URL_0__" → "__URL_0__" (URLが翻訳されることは稀だが念のため)
  if (original.match(/__URL_\d+__/)) {
    translated = translated.replace(/([ぁ-んァ-ヶー一-龯])URL[_\s]*(\d+)__/g, (match, before, num) => {
      console.log('   ⚠ Auto-fixed: Fixed URL placeholder');
      return `${before}__URL_${num}__`;
    });
    
    // 小文字に変換されている場合も修正: "__url_0__" → "__URL_0__"
    translated = translated.replace(/__url_(\d+)__/g, (match, num) => {
      console.log('   ⚠ Auto-fixed: Corrected lowercase url placeholder');
      return `__URL_${num}__`;
    });
  }
  
  // ===== 2. 二重括弧を修正 ===== 
  // "[Text [Link]" → "[Text Link]"
  translated = translated.replace(/\[([^\]]*)\[/g, (match, content) => {
    console.log('   ⚠ Auto-fixed: Removed double opening bracket [[');
    return '[' + content;
  });
  
  // ===== 3. Markdownリンクの開始括弧が欠けている問題を修正 =====
  // 元のテキストが[または![で始まる場合、翻訳にも同じように始まるべき
  if (original.startsWith('![') && !translated.startsWith('![')) {
    // 画像リンクの場合（__URL_N__または実URLに対応）
    if (translated.match(/^[^\[]*\].*\)/)) {
      translated = '![' + translated;
      console.log('   ⚠ Auto-fixed: Added missing ![');
    }
  } else if (original.match(/^\[.*\]\([^)]+\)/) && !translated.startsWith('[')) {
    // Markdownリンクの場合（__URL_N__または実URLに対応）
    if (translated.match(/^[^\[]*\]\([^)]+\)/)) {
      translated = '[' + translated;
      console.log('   ⚠ Auto-fixed: Added missing [');
    }
  }
  
  // テーブルセル内の画像パターン: |![alt](url) → |alt](url)
  // 元のテキストに |![ があるのに、翻訳に | があって ![ がない場合
  if (original.match(/\|\!\[/) && translated.match(/\|[^\[]*\]\([^)]+\)/) && !translated.match(/\|\!\[/)) {
    translated = translated.replace(/\|([^\[]+\]\([^)]+\))/g, (match, content) => {
      console.log('   ⚠ Auto-fixed: Added missing ![ in table cell');
      return '|![' + content;
    });
  }
  
  // "The [Link]" パターンの場合
  if (original.match(/^The \[.*\]\([^)]+\)/) && !translated.match(/^\[/)) {
    if (translated.match(/^[^\[]*\]\([^)]+\)/)) {
      translated = '[' + translated;
      console.log('   ⚠ Auto-fixed: Added missing [ (The [Link] pattern)');
    }
  }
  
  // 日本語の後のMarkdownリンクパターンおよび欠けた開始括弧を修正
  // パターン1: 文頭の欠けた括弧（text](URL) → [text](URL)）
  // 両方の形式に対応: __URL_N__ と実URL
  if (original.match(/\[.*?\]\([^)]+\)/)) {
    // 文頭にリンクがあるが[で始まっていない場合
    if (!translated.match(/^\[/) && translated.match(/^[^\[]+?\]\([^)]+\)/)) {
      translated = translated.replace(/^([^\[]+?\]\([^)]+\))/, (match, linkPart) => {
        console.log('   ⚠ Auto-fixed: Added missing [ at start of segment');
        return '[' + linkPart;
      });
    }
    
    // パターン2: 文中の欠けた開始括弧を修正
    // 戦略: 正しいリンクを一時的に保護してから、欠けているリンクを修正
    const correctLinks = [];
    let protectedText = translated.replace(/\[[^\]]+\]\([^)]+\)/g, (match) => {
      const index = correctLinks.length;
      correctLinks.push(match);
      return `__CORRECT_LINK_${index}__`;
    });
    
    // 保護されたテキストで、欠けている[を追加
    // リンクテキストは最低3文字以上
    // 日本語の長音符号（ー）も含める
    protectedText = protectedText.replace(/([\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ーa-zA-Z0-9\-_`]{3,}?\]\([^)]+\))/gu, (match) => {
      console.log('   ⚠ Auto-fixed: Added missing [ before link');
      return '[' + match;
    });
    
    // 正しいリンクを復元
    protectedText = protectedText.replace(/__CORRECT_LINK_(\d+)__/g, (match, index) => {
      return correctLinks[parseInt(index)];
    });
    
    translated = protectedText;
  }
  
  // ===== 4. プレースホルダーの先頭__が欠けている問題を修正 =====
  if (original.match(/__(?:INLINE_CODE|CODE_BLOCK|URL)_\d+__/)) {
    // まず、リストアイテム内のプレースホルダーは除外する
    // リストマーカー(-、*、+の後にスペースとプレースホルダー)のパターンをスキップ
    const listItemPattern = /^([-*+]\s+)((?:INLINE_CODE|CODE_BLOCK|URL)_\d+__)/gm;
    const listItems = [];
    let listMatch;
    while ((listMatch = listItemPattern.exec(translated)) !== null) {
      listItems.push({index: listMatch.index, marker: listMatch[1], placeholder: listMatch[2]});
    }
    
    // パターン1: 完全に__が欠けている場合（INLINE_CODE_0__ や CODE_BLOCK_0__ など）
    // 行頭、スペース、日本語文字、記号、括弧の後に来る場合を検出
    translated = translated.replace(/(^|[\s\n\[\]()（）、。！？：｜ぁ-んァ-ヶー一-龯])((?:INLINE_CODE|CODE_BLOCK|URL)_\d+__)/g, (match, before, placeholder, offset) => {
      // リストアイテム内のプレースホルダーはスキップ
      for (const item of listItems) {
        if (offset === item.index + item.marker.length) {
          return match; // 変更しない
        }
      }
      console.log('   ⚠ Auto-fixed: Added missing __ prefix to', placeholder);
      return before + '__' + placeholder;
    });
    
    // パターン2: _が1つしかない場合（_INLINE_CODE_0__ など）
    translated = translated.replace(/(^|[^_])_(INLINE_CODE|CODE_BLOCK|URL)_(\d+)__/g, (match, before, type, num) => {
      console.log('   ⚠ Auto-fixed: Added missing _ prefix (single underscore case)');
      return before + '__' + type + '_' + num + '__';
    });
  }
  
  // ===== 5. 見出しマーカーの修正 =====
  // DeepL APIが見出しマーカーを変更する問題を修正
  // 元のテキストの見出しレベルを保持する
  const originalHeadingMatch = original.match(/^(#{1,6})\s/);
  const translatedHeadingMatch = translated.match(/^(#{1,6})\s?/);
  
  if (originalHeadingMatch && translatedHeadingMatch) {
    const originalLevel = originalHeadingMatch[1]; // 元の#の数
    const translatedLevel = translatedHeadingMatch[1]; // 翻訳後の#の数
    
    // 見出しレベルが変わっている、またはスペースが欠けている場合に修正
    if (originalLevel.length !== translatedLevel.length || !translated.match(/^#{1,6}\s/)) {
      const headingText = translated.replace(/^#{1,6}\s?/, ''); // 見出しテキスト部分を取得
      translated = originalLevel + ' ' + headingText;
      console.log(`   ⚠ Auto-fixed: Heading marker from ${translatedLevel} to ${originalLevel}`);
    }
  }
  
  return translated;
}

/** * 単一セグメントを翻訳
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
    const translateOptions = {
      preserveFormatting: true,
      tagHandling: 'xml'
    };
    
    // Glossaryを使用する場合
    if (deeplGlossary) {
      translateOptions.glossary = deeplGlossary;
    }
    
    const result = await translator.translateText(
      segment.original,
      config.translation.sourceLang,
      config.translation.targetLang,
      translateOptions
    );

    stats.apiCalls++;
    stats.totalChars += segment.original.length;

    // DeepL APIの応答を自動修正（Markdownリンクの括弧が欠けている場合）
    let translatedText = result.text;
    translatedText = fixDeepLMarkdownIssues(segment.original, translatedText);

    const translated = {
      original: segment.original,
      translated: translatedText,
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
    const translateOptions = {
      preserveFormatting: true,
      tagHandling: 'xml'
    };
    
    // Glossaryを使用する場合
    if (deeplGlossary) {
      translateOptions.glossary = deeplGlossary;
    }
    
    const results = await translator.translateText(
      texts,
      config.translation.sourceLang,
      config.translation.targetLang,
      translateOptions
    );

    stats.apiCalls++;
    stats.totalChars += texts.join('').length;

    return results.map((result, index) => {
      const segmentHash = calculateHash(segments[index].original);
      
      // DeepL APIの応答を自動修正（Markdownリンクの括弧が欠けている場合）
      let translatedText = result.text;
      translatedText = fixDeepLMarkdownIssues(segments[index].original, translatedText);
      
      const translated = {
        original: segments[index].original,
        translated: translatedText,
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
      const translateOptions = {};
      if (deeplGlossary) {
        translateOptions.glossary = deeplGlossary;
      }
      const result = await translator.translateText(
        frontmatter.title,
        config.translation.sourceLang,
        config.translation.targetLang,
        translateOptions
      );
      translated.title = result.text;
      stats.apiCalls++;
    } catch (error) {
      console.error('   ⚠ Frontmatter title translation failed');
    }
  }

  if (frontmatter.description) {
    try {
      const translateOptions = {};
      if (deeplGlossary) {
        translateOptions.glossary = deeplGlossary;
      }
      const result = await translator.translateText(
        frontmatter.description,
        config.translation.sourceLang,
        config.translation.targetLang,
        translateOptions
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
  // extractTranslatableSegmentsと同じロジックでプレースホルダー置換
  const allCodeBlocks = [];
  const allInlineCodes = [];
  const allUrls = [];

  let processedContent = original.replace(/```[\s\S]*?```/g, (match) => {
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

  // 見出しの前に特別なマーカーを挿入（extractTranslatableSegmentsと同じ処理）
  processedContent = processedContent.replace(/^(#{1,6}\s)/gm, '__HEADING_START__\n$1');
  
  // 空行と見出しマーカーで段落を分割（extractTranslatableSegmentsと同じ処理）
  const paragraphs = processedContent.split(/\n\n+|__HEADING_START__\n/).filter(p => p.trim());
  const translatedParagraphs = [];
  let segmentIndex = 0;
  
  if (process.env.DEBUG_RECONSTRUCT) {
    console.log(`\n📝 Reconstruction Debug:`);
    console.log(`   Total paragraphs to process: ${paragraphs.length}`);
    console.log(`   Total translated segments: ${translatedSegments.length}`);
  }

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    
    if (process.env.DEBUG_RECONSTRUCT) {
      const isCodeBlock = trimmed.match(/^__CODE_BLOCK_\d+__$/);
      if (isCodeBlock) {
        console.log(`   [Skipped] CODE_BLOCK: ${trimmed.substring(0, 50)}`);
      }
    }
    
    // 空行、コードブロック単体をそのまま保持
    // 画像は翻訳されるため、スキップしない
    if (!trimmed || trimmed.match(/^__CODE_BLOCK_\d+__$/)) {
      translatedParagraphs.push(paragraph.replace(/__CODE_BLOCK_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allCodeBlocks[index] || match;
      }).replace(/__INLINE_CODE_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allInlineCodes[index] || match;
      }).replace(/__URL_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allUrls[index] || match;
      }));
      continue;
    }
    
    if (trimmed && trimmed.length > 10 && segmentIndex < translatedSegments.length) {
      const translatedSegment = translatedSegments[segmentIndex];
      let translated = translatedSegment.translated;
      
      if (process.env.DEBUG_RECONSTRUCT) {
        const hasCodeBlocks = translatedSegment.metadata && translatedSegment.metadata.codeBlocks && translatedSegment.metadata.codeBlocks.length > 0;
        const hasPlaceholders = translated.match(/__CODE_BLOCK_\d+__/);
        if (hasCodeBlocks || hasPlaceholders) {
          console.log(`   [Segment ${segmentIndex}] CodeBlocks: ${hasCodeBlocks ? translatedSegment.metadata.codeBlocks.length : 0}, Placeholders: ${hasPlaceholders ? 'YES' : 'NO'}`);
        }
      }
      
      // プレースホルダーを復元
      if (translatedSegment.metadata) {
        if (translatedSegment.metadata.codeBlocks) {
          translatedSegment.metadata.codeBlocks.forEach((code, i) => {
            translated = translated.replace(`__CODE_BLOCK_${i}__`, code);
          });
        }
        if (translatedSegment.metadata.inlineCodes) {
          translatedSegment.metadata.inlineCodes.forEach((code, i) => {
            translated = translated.replace(`__INLINE_CODE_${i}__`, code);
          });
        }
        if (translatedSegment.metadata.urls) {
          translatedSegment.metadata.urls.forEach((url, i) => {
            translated = translated.replace(`__URL_${i}__`, url);
          });
        }
      }
      
      // メタデータから復元できなかったプレースホルダーを、グローバル配列から復元
      translated = translated.replace(/__CODE_BLOCK_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allCodeBlocks[index] || match;
      });
      translated = translated.replace(/__INLINE_CODE_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allInlineCodes[index] || match;
      });
      translated = translated.replace(/__URL_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allUrls[index] || match;
      });
      
      translatedParagraphs.push(translated);
      segmentIndex++;
    } else {
      // 翻訳対象外の段落をそのまま保持
      translatedParagraphs.push(paragraph.replace(/__CODE_BLOCK_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allCodeBlocks[index] || match;
      }).replace(/__INLINE_CODE_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allInlineCodes[index] || match;
      }).replace(/__URL_(\d+)__/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return allUrls[index] || match;
      }));
    }
  }

  let result = translatedParagraphs.join('\n\n');
  
  if (process.env.DEBUG_RECONSTRUCT) {
    console.log(`\n📝 Reconstruction Result:`);
    console.log(`   Total paragraphs in result: ${translatedParagraphs.length}`);
    console.log(`   Result length: ${result.length}`);
    const codeBlockCount = (result.match(/__CODE_BLOCK_/g) || []).length;
    console.log(`   Remaining __CODE_BLOCK__ placeholders: ${codeBlockCount}`);
  }
  
  // 後処理: リストアイテムの先頭にある余分な__を削除
  // パターン: "-   __`code`" → "-   `code`"
  result = result.replace(/^([-*+]\s+)__(`[^`]+`)/gm, '$1$2');
  
  return result;
}

/**
 * Glossaryの初期化
 */
async function initializeGlossary() {
  // Glossaryが無効化されている場合はスキップ
  if (!config.translation?.glossary?.enabled) {
    console.log('ℹ️  Glossary is disabled in config\n');
    return;
  }

  try {
    console.log('📚 Initializing glossary...');
    
    // Glossary設定の読み込み
    const glossaryConfigPath = path.join(process.cwd(), config.translation.glossary.configPath);
    const glossaryData = JSON.parse(await fs.readFile(glossaryConfigPath, 'utf-8'));
    
    if (!glossaryData.enabled) {
      console.log('ℹ️  Glossary is disabled in glossary.json\n');
      return;
    }

    const glossaryName = glossaryData.name || 'woocommerce-ja-glossary';
    
    // 既存のGlossaryを検索
    const glossaries = await translator.listGlossaries();
    const existingGlossary = glossaries.find(g => g.name === glossaryName);
    
    if (existingGlossary) {
      console.log(`   ✓ Using existing glossary: ${glossaryName}`);
      deeplGlossary = existingGlossary.glossaryId;
    } else {
      // 新しいGlossaryを作成
      console.log(`   ⚙️  Creating new glossary: ${glossaryName}`);
      
      const entries = glossaryData.entries || {};
      const newGlossary = await translator.createGlossary(
        glossaryName,
        config.translation.sourceLang,
        config.translation.targetLang,
        { entries }
      );
      
      deeplGlossary = newGlossary.glossaryId;
      console.log(`   ✓ Glossary created successfully`);
    }
    
    console.log('');
  } catch (error) {
    console.error(`⚠️  Failed to initialize glossary: ${error.message}`);
    console.error('   Continuing without glossary...\n');
    deeplGlossary = null;
  }
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
