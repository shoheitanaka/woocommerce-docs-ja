#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');

const cache = JSON.parse(fs.readFileSync('translations/cache/translation-cache.json', 'utf-8'));

// 該当テキストのハッシュを計算（プレースホルダー付き）
const text = 'This website is built using [Docusaurus](__URL_0__), a modern static website generator.';
const hash = crypto.createHash('sha256').update(text).digest('hex');

console.log('Looking for text:', text);
console.log('Hash:', hash);
console.log('');

if (cache.segments && cache.segments[hash]) {
  console.log('✓ Found in cache:');
  console.log(JSON.stringify(cache.segments[hash], null, 2));
} else {
  console.log('✗ Not found with this exact hash');
  console.log('');
  console.log('Searching for similar entries...');
  
  let found = false;
  for (const [key, value] of Object.entries(cache.segments || {})) {
    if (value.original && value.original.includes('Docusaurus')) {
      console.log('');
      console.log('Found similar entry:');
      console.log('Hash:', key);
      console.log(JSON.stringify(value, null, 2));
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log('No similar entries found');
    console.log('Total segments in cache:', Object.keys(cache.segments || {}).length);
  }
}
