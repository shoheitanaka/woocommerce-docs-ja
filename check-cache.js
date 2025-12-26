const fs = require('fs');
const cache = JSON.parse(fs.readFileSync('translations/cache/translation-cache.json'));

let found = false;
for (const key in cache.segments) {
  const segment = cache.segments[key];
  if (segment.translated && segment.translated.includes('__CODE_BLOCK_')) {
    console.log('='.repeat(60));
    console.log('Segment with CODE_BLOCK in TRANSLATED:');
    console.log('Original:', segment.original.substring(0, 500));
    console.log('');
    console.log('Translated:', segment.translated.substring(0, 500));
    console.log('='.repeat(60));
    found = true;
    break;
  }
}
if (!found) {
  console.log('No segments with CODE_BLOCK in translated text found.');
}
