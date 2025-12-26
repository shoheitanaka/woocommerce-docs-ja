const fs = require('fs');
const matter = require('gray-matter');

const content = fs.readFileSync('docs/block-development/extensible-blocks/cart-and-checkout-blocks/additional-checkout-fields.md', 'utf-8');
const { content: markdown } = matter(content);

// extractTranslatableSegmentsと同じ処理
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

processedContent = processedContent.replace(/^(#{1,6}\s)/gm, '__HEADING_START__\n$1');
const paragraphs = processedContent.split(/\n\n+|__HEADING_START__\n/).filter(p => p.trim());

console.log(`Total code blocks: ${allCodeBlocks.length}`);
console.log(`Total paragraphs: ${paragraphs.length}\n`);

// 各段落でコードブロックプレースホルダーを検索
let segmentCount = 0;
for (let i = 0; i < paragraphs.length; i++) {
  const paragraph = paragraphs[i];
  const trimmed = paragraph.trim();
  
  // スキップ条件
  if (!trimmed || 
      trimmed.match(/^__CODE_BLOCK_\d+__$/) || 
      trimmed.match(/^!\[.*\]\(__URL_\d+__\)$/)) {
    continue;
  }
  
  if (trimmed.length > 10) {
    segmentCount++;
    const codeBlockMatches = paragraph.match(/__CODE_BLOCK_(\d+)__/g) || [];
    
    if (codeBlockMatches.length > 0) {
      console.log(`Segment ${segmentCount} (paragraph ${i}):`);
      console.log(`  Length: ${trimmed.length}`);
      console.log(`  Code blocks found: ${codeBlockMatches.length}`);
      console.log(`  Code blocks: ${codeBlockMatches.join(', ')}`);
      console.log(`  Preview: ${trimmed.substring(0, 100)}...`);
      console.log('');
    }
  }
}

console.log(`\nTotal segments with code blocks detected in this test: ${segmentCount}`);

// コードブロック単独の段落を確認
let codeBlockOnlyCount = 0;
for (const p of paragraphs) {
  const trimmed = p.trim();
  if (trimmed.match(/^__CODE_BLOCK_\d+__$/)) {
    codeBlockOnlyCount++;
  }
}
console.log(`\nCode block only paragraphs: ${codeBlockOnlyCount}`);
