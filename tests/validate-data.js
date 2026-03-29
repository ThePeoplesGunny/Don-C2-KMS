#!/usr/bin/env node
// DoN C2 KMS — Data Integrity Validator
// Run: node tests/validate-data.js

const fs = require('fs');
const path = require('path');

// Load kms-data.js by evaluating it (it declares a const KMS_DATA)
const dataPath = path.resolve(__dirname, '..', 'data', 'kms-data.js');
const src = fs.readFileSync(dataPath, 'utf-8');
const fn = new Function(src + '\nreturn KMS_DATA;');
const KMS_DATA = fn();

const NODES = KMS_DATA.nodes;
const AUTH  = KMS_DATA.auth;
const VIEWS = KMS_DATA.views;
const DOCS  = KMS_DATA.documents;
const TL    = KMS_DATA.timeline;

const nodeIds = new Set(Object.keys(NODES));

let errors   = 0;
let warnings = 0;

function error(msg) { errors++;   console.error(`  ERROR   ${msg}`); }
function warn(msg)  { warnings++; console.warn( `  WARN    ${msg}`); }
function info(msg)  {             console.log(  `  INFO    ${msg}`); }

// ─── 1. Top-level structure ───────────────────────────────────────
console.log('\n=== Top-Level Structure ===');
for (const key of ['version', 'lastModified', 'config', 'nodes', 'auth', 'views', 'documents', 'timeline']) {
  if (!(key in KMS_DATA)) error(`Missing top-level key: "${key}"`);
}
info(`Version ${KMS_DATA.version}, last modified ${KMS_DATA.lastModified}`);
info(`${nodeIds.size} nodes, ${Object.keys(AUTH).length} auth entries, ${Object.keys(VIEWS).length} views, ${DOCS.length} documents, ${TL.length} timeline events`);

// ─── 2. Node validation ──────────────────────────────────────────
console.log('\n=== Node Validation ===');
const requiredNodeFields = ['lbl', 'svc'];

for (const [id, node] of Object.entries(NODES)) {
  for (const f of requiredNodeFields) {
    if (!node[f]) error(`Node "${id}" missing required field "${f}"`);
  }
  if (node.loc) {
    const { lat, lon } = node.loc;
    if (lat != null && (lat < -90 || lat > 90))  error(`Node "${id}" has invalid lat: ${lat}`);
    if (lon != null && (lon < -180 || lon > 180)) error(`Node "${id}" has invalid lon: ${lon}`);
    if ((lat != null) !== (lon != null))           warn(`Node "${id}" has lat but no lon or vice versa`);
  }
}
info('Node field and coordinate checks complete');

// ─── 3. Authority validation ─────────────────────────────────────
console.log('\n=== Authority Validation ===');
const authArrayKeys = ['opcon', 'adcon', 'ta', 'daco'];

for (const [id, entry] of Object.entries(AUTH)) {
  if (!nodeIds.has(id)) error(`Auth entry "${id}" does not match any node`);

  for (const key of authArrayKeys) {
    if (!entry[key]) continue;
    if (!Array.isArray(entry[key])) {
      error(`Auth "${id}".${key} should be an array`);
      continue;
    }
    for (const ref of entry[key]) {
      if (!nodeIds.has(ref)) error(`Auth "${id}".${key} references unknown node "${ref}"`);
    }
  }

  if (entry.mte && typeof entry.mte === 'string') {
    if (!nodeIds.has(entry.mte)) error(`Auth "${id}".mte references unknown node "${entry.mte}"`);
  }
}
info('Authority reference checks complete');

// ─── 4. View validation ──────────────────────────────────────────
console.log('\n=== View Validation ===');

for (const [viewId, view] of Object.entries(VIEWS)) {
  if (!view.label) warn(`View "${viewId}" has no label`);
  if (!Array.isArray(view.ids)) {
    error(`View "${viewId}" missing ids array`);
    continue;
  }
  for (const nid of view.ids) {
    if (!nodeIds.has(nid)) error(`View "${viewId}" references unknown node "${nid}"`);
  }
  if (view.pos) {
    for (const nid of Object.keys(view.pos)) {
      if (!view.ids.includes(nid)) warn(`View "${viewId}" has position for "${nid}" which is not in its ids list`);
      if (!nodeIds.has(nid))       error(`View "${viewId}" position references unknown node "${nid}"`);
    }
    const missing = view.ids.filter(nid => !view.pos[nid]);
    if (missing.length) warn(`View "${viewId}" is missing positions for: ${missing.join(', ')}`);
  }
}
info('View reference checks complete');

// ─── 5. Document validation ──────────────────────────────────────
console.log('\n=== Document Validation ===');

const docIds = new Set();
for (let i = 0; i < DOCS.length; i++) {
  const doc = DOCS[i];
  const label = doc.id || doc.number || `index ${i}`;

  if (doc.id) {
    if (docIds.has(doc.id)) error(`Duplicate document id: "${doc.id}"`);
    docIds.add(doc.id);
  }

  if (!doc.title) warn(`Document "${label}" has no title`);
  if (!doc.date)  warn(`Document "${label}" has no date`);

  if (Array.isArray(doc.affects)) {
    for (const ref of doc.affects) {
      if (!nodeIds.has(ref)) error(`Document "${label}" affects unknown node "${ref}"`);
    }
  }
}
info('Document reference checks complete');

// ─── 6. Timeline validation ─────────────────────────────────────
console.log('\n=== Timeline Validation ===');

for (let i = 0; i < TL.length; i++) {
  const ev = TL[i];
  const label = ev.title || `index ${i}`;

  if (!ev.year)  warn(`Timeline "${label}" has no year`);
  if (!ev.title) warn(`Timeline entry at index ${i} has no title`);

  if (Array.isArray(ev.nodes)) {
    for (const ref of ev.nodes) {
      if (!nodeIds.has(ref)) error(`Timeline "${label}" references unknown node "${ref}"`);
    }
  }
}
info('Timeline reference checks complete');

// ─── 7. Orphan detection ─────────────────────────────────────────
console.log('\n=== Orphan Detection ===');

const referencedInViews = new Set();
for (const view of Object.values(VIEWS)) {
  if (view.ids) view.ids.forEach(id => referencedInViews.add(id));
}

const referencedInAuth = new Set(Object.keys(AUTH));
for (const entry of Object.values(AUTH)) {
  for (const key of authArrayKeys) {
    if (Array.isArray(entry[key])) entry[key].forEach(id => referencedInAuth.add(id));
  }
  if (entry.mte && typeof entry.mte === 'string') referencedInAuth.add(entry.mte);
}

for (const id of nodeIds) {
  if (!referencedInViews.has(id) && !referencedInAuth.has(id)) {
    warn(`Node "${id}" is not referenced in any view or authority entry`);
  }
}
info('Orphan detection complete');

// ─── Summary ─────────────────────────────────────────────────────
console.log('\n' + '='.repeat(50));
if (errors === 0 && warnings === 0) {
  console.log('  ALL CHECKS PASSED');
} else {
  console.log(`  ${errors} error(s), ${warnings} warning(s)`);
}
console.log('='.repeat(50) + '\n');

process.exit(errors > 0 ? 1 : 0);
