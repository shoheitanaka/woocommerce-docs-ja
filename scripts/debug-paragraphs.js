#!/usr/bin/env node

const fs = require('fs');
const matter = require('gray-matter');
const crypto = require('crypto');

const filePath = process.argv[2] || 'docs/_docu-tools/README.md';

// ファイル読み込み
const content = fs.readFileSync(filePath, 'utf-8');
const { content: markdown } = matter(content);

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

console.log(`Total paragraphs: ${paragraphs.length}\n`);

paragraphs.forEach((paragraph, index) => {
  const trimmed = paragraph.trim();
  console.log(`Paragraph ${index + 1}:`);
  console.log(`  Length: ${trimmed.length}`);
  console.log(`  Will process: ${trimmed.length > 10}`);
  console.log(`  Content: ${trimmed.substring(0, 80)}...`);
  console.log('');
});
