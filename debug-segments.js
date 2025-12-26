const fs = require('fs');
const content = fs.readFileSync('docs/block-development/extensible-blocks/cart-and-checkout-blocks/additional-checkout-fields.md', 'utf-8');

// extractTranslatableSegmentsと同じ処理
const allCodeBlocks = [];
const allInlineCodes = [];
const allUrls = [];

let processedContent = content.replace(/```[\s\S]*?```/g, (match) => {
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

console.log('Total paragraphs:', paragraphs.length);
console.log('Code blocks:', allCodeBlocks.length);

let segmentCount = 0;
let codeBlockOnlyCount = 0;
let imageCount = 0;
let emptyCount = 0;
for (const paragraph of paragraphs) {
  const trimmed = paragraph.trim();
  if (!trimmed) {
    emptyCount++;
    continue;
  }
  if (trimmed.match(/^__CODE_BLOCK_\d+__$/)) {
    codeBlockOnlyCount++;
    console.log('Code block only:', trimmed);
    continue;
  }
  if (trimmed.match(/^!\[.*\]\(__URL_\d+__\)$/)) {
    imageCount++;
    console.log('Image only:', trimmed);
    continue;
  }
  if (trimmed.length > 10) {
    segmentCount++;
    console.log(`Segment ${segmentCount}: ${trimmed.substring(0, 80)}...`);
  } else {
    console.log(`Short paragraph (${trimmed.length} chars): ${trimmed}`);
  }
}
console.log('Segments:', segmentCount);
console.log('Code block only paragraphs:', codeBlockOnlyCount);
console.log('Image only paragraphs:', imageCount);
console.log('Empty paragraphs:', emptyCount);
console.log('Total processable paragraphs:', segmentCount + codeBlockOnlyCount + imageCount);
