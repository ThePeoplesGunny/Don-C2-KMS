#!/usr/bin/env node
// DoN C2 KMS — Normalize authority chains to immediate parent only
// Converts opcon/adcon/daco from full chains [top...immediate] to immediate parent only
// Preserves ta/lcsp/aa as arrays (these are peer relationships, not chains)
//
// Usage: node tools/normalize-auth.js [--dry-run]

const fs = require('fs');
const path = require('path');

const dryRun = process.argv.includes('--dry-run');
const dataPath = path.resolve(__dirname, '..', 'web', 'data', 'kms-data.js');
const src = fs.readFileSync(dataPath, 'utf-8');
const fn = new Function(src + '\nreturn KMS_DATA;');
const KMS_DATA = fn();

const AUTH = KMS_DATA.auth;
// Chain types and their ordering in the current data:
// opcon: TOP-DOWN (potus → secdef → ... → immediate_parent). Immediate parent = LAST.
// adcon: BOTTOM-UP (immediate_parent → ... → secnav). Immediate parent = FIRST.
// daco:  TOP-DOWN (cybercom → dcdc → immediate_parent). Immediate parent = LAST.
const chainKeys = {
  opcon: 'last',   // top-down chain, immediate parent is last element
  adcon: 'first',  // bottom-up chain, immediate parent is first element
  daco:  'last'    // top-down chain, immediate parent is last element
};
const listKeys = ['ta', 'lcsp', 'aa'];  // peer lists — keep as-is

let changes = 0;
let skipped = 0;

console.log('\n=== Normalizing Authority Chains ===\n');

for (const [id, entry] of Object.entries(AUTH)) {
  for (const [key, parentPos] of Object.entries(chainKeys)) {
    if (!entry[key] || !Array.isArray(entry[key])) continue;
    const chain = entry[key];

    if (chain.length <= 1) {
      skipped++;
      continue;
    }

    const immediateParent = parentPos === 'first' ? chain[0] : chain[chain.length - 1];

    if (dryRun) {
      console.log(`  ${id}.${key}: [${chain.join(parentPos === 'first' ? ' ← ' : ' → ')}] → "${immediateParent}"`);
    }

    entry[key] = [immediateParent];
    changes++;
  }
}

console.log(`\n  ${changes} chains normalized to immediate parent`);
console.log(`  ${skipped} already single-element (skipped)`);
console.log(`  ${listKeys.join(', ')} arrays preserved as-is\n`);

if (dryRun) {
  console.log('  DRY RUN — no files modified.\n');
  process.exit(0);
}

// Rebuild the data file
// We need to reconstruct the JS file with the modified auth
const jsonStr = JSON.stringify(KMS_DATA, null, 1);
const output = '// DoN C2 KMS — Organizational Data v8.1\n'
  + '// Authority chains normalized to immediate parent (opcon/adcon/daco)\n'
  + '// ta/lcsp/aa remain as peer relationship arrays\n'
  + '// Generated: ' + new Date().toISOString().split('T')[0] + '\n'
  + 'const KMS_DATA = ' + jsonStr + ';\n';

fs.writeFileSync(dataPath, output, 'utf-8');
console.log('  Written to: ' + dataPath);
console.log('  File size: ' + (output.length / 1024).toFixed(0) + ' KB\n');
