#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');

const cache = JSON.parse(fs.readFileSync('translations/cache/translation-cache.json', 'utf-8'));

// 類似の翻訳を検索
console.log('Searching for similar "Explore the" translations...\n');
let found = false;
for (const [hash, entry] of Object.entries(cache.segments || {})) {
  if (entry.original && entry.original.includes('Explore the [')) {
    console.log('Original:', entry.original);
    console.log('Translated:', entry.translated);
    console.log('Hash:', hash);
    console.log('');
    found = true;
  }
}

if (!found) {
  console.log('No similar translations found');
}
