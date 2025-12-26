#!/usr/bin/env node

require('dotenv').config();
const deepl = require('deepl-node');

const apiKey = process.env.DEEPL_API_KEY;

if (!apiKey) {
  console.log('❌ DEEPL_API_KEY is not set');
  process.exit(1);
}

console.log('🔍 Checking DeepL API Key...\n');
console.log('API Key format:', apiKey.substring(0, 10) + '...');
console.log('API Key length:', apiKey.length);
console.log('API Key type:', apiKey.includes(':fx') ? 'Free' : 'Pro');

const translator = new deepl.Translator(apiKey);

translator.getUsage()
  .then(usage => {
    console.log('\n✅ API Key is valid!\n');
    console.log('📊 Usage Information:');
    console.log('  Used:', usage.character.count.toLocaleString(), 'characters');
    console.log('  Limit:', usage.character.limit.toLocaleString(), 'characters');
    console.log('  Remaining:', (usage.character.limit - usage.character.count).toLocaleString(), 'characters');
    console.log('  Usage:', ((usage.character.count / usage.character.limit) * 100).toFixed(2) + '%');
  })
  .catch(error => {
    console.log('\n❌ API Key is invalid or has an error\n');
    console.log('Error:', error.message);
    console.log('\nPossible causes:');
    console.log('  1. API key is incorrect or expired');
    console.log('  2. API key format is wrong');
    console.log('  3. Network connection issue');
    console.log('  4. DeepL service is down');
    console.log('\nPlease check your API key at: https://www.deepl.com/account/summary');
  });
