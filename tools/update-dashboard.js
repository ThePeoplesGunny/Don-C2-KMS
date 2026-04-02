#!/usr/bin/env node
// Update dashboard agent data, priorities, decisions, conflicts, opportunities
// to reflect authority research sprint focus

const fs = require('fs');
const path = require('path');
const appPath = path.resolve(__dirname, '..', 'web', 'app.js');
let src = fs.readFileSync(appPath, 'utf-8');

// Replace agent scores and concerns
const agentBlock = `  var hasOrphans = orphanCount > 0;
  var refCoverage = 0;
  Object.values(AUTH).forEach(function(a){ if(a.ref) refCoverage++; });
  var refPct = Math.round(refCoverage / authCount * 100);

  var DASH_AGENTS = [
    {
      id:'validator', name:'KMS-VALIDATOR', color:'#44cc44', status:'GREEN', statusCls:'dash-s-green',
      concern: 'Zero orphans. '+refCoverage+'/'+authCount+' auth entries have ref chains ('+refPct+'%). '+docCount+' documents. Validator enforces ref\\u2192document integrity. Next: increase ref coverage to 80%+ before resuming visual work.',
      badges: [{t:'DATA CLEAN',c:'db-ready'},{t:'REF: '+refPct+'%',c: refPct>=80?'db-ready':'db-blocker'}],
      scores:{ integrity:94, authority:92, scale:65, compliance:68, features:50, architecture:80, debt:82, doctrinal:refPct>=80?95:78 },
      notes:{ integrity:'Zero orphans. All nodes wired.', authority:refCoverage+'/'+authCount+' ref chains grounded to Constitution', scale:'d3.tree implemented. Dense views zoom out far \\u2014 blocked by incomplete data, not renderer.', compliance:'Sidebar improved. Fonts + version label remain.', features:'OSD + ref system complete. Layout engine ready. Visual work paused for data.', architecture:'ref schema + d3.tree + DOC_MAP all working. Foundation solid.', debt:'109 auth entries without ref chains = research debt. TACON unused. cyber/daco mismatch.', doctrinal:refPct+'% ref coverage. Target: 80% before visual sprint.' }
    },
    {
      id:'authority', name:'AUTH-RESEARCHER', color:'#dd44bb', status:'RED', statusCls:'dash-s-red',
      concern: 'CRITICAL PATH: 109 auth entries lack ref chains. SECNAV two-chain structure (SECNAVINST 5400.15D) codified but PMA/FRC/squadron level incomplete. TACON defined in config but zero usage \\u2014 audit needed. cyber vs daco field mismatch unresolved.',
      badges:[{t:'109 UNGROUNDED',c:'db-blocker'},{t:'TACON UNUSED',c:'db-conflict'},{t:'CYBER/DACO',c:'db-conflict'}],
      scores:{ integrity:88, authority:72, scale:55, compliance:58, features:42, architecture:72, debt:60, doctrinal:72 },
      notes:{ integrity:'OSD + SECNAV chain codified. PMAs/FRCs/squadrons pending.', authority:'58 entries grounded. 109 remain. Two-chain model understood but not fully reflected in data.', scale:'Not this agent\\u2019s concern until data is complete', compliance:'Defers to UI-Compliance', features:'Blocked by incomplete authority research', architecture:'ref schema is ready. Need research to fill it.', debt:'TACON: zero usage despite config entry. 7 PEO TA errors were found and fixed \\u2014 more may exist.', doctrinal:'SECNAVINST 5400.15D two-chain model is the key. Every SYSCOM intersection needs proper AA vs ADCON vs TA separation.' }
    },
    {
      id:'architect', name:'ARCHITECT', color:'#0076a9', status:'GREEN', statusCls:'dash-s-green',
      concern: 'Architecture is sound. d3.tree implemented, ref schema working, validator enforces integrity. Pausing visual work (ghost nodes, link routing) until authority data reaches 80%+ ref coverage. Lesson learned: design follows data.',
      badges:[{t:'d3.tree DONE',c:'db-ready'},{t:'WAITING ON DATA',c:'db-blocker'},{t:'LESSON LEARNED',c:'db-opportunity'}],
      scores:{ integrity:90, authority:90, scale:65, compliance:60, features:45, architecture:85, debt:75, doctrinal:88 },
      notes:{ integrity:'Data model clean. ref validates at build time.', authority:'Grounding system well-designed. Needs data to fill it.', scale:'d3.tree nodeSize eliminates overlap. Dense views need data-informed layout decisions.', compliance:'Font + version label still pending', features:'Layout engine ready. Ghost nodes designed. All waiting on data.', architecture:'d3.tree + ref + DOC_MAP + dashboard = solid foundation. No architectural blockers.', debt:'Visual debt (fonts, version) is low priority. Authority data debt is the bottleneck.', doctrinal:'Data before design \\u2014 core lesson from this sprint.' }
    },
    {
      id:'uicompliance', name:'UI-COMPLIANCE', color:'#e8b00f', status:'AMBER', statusCls:'dash-s-amber',
      concern: 'Sidebar improved (10px/320px). Fonts + version label non-compliant. Visual work (ghost nodes, link routing, card refinement) on hold until authority data is complete. Cannot design for relationships that aren\\u2019t codified.',
      badges:[{t:'SIDEBAR DONE',c:'db-ready'},{t:'FONTS PENDING',c:'db-conflict'},{t:'VISUAL PAUSED',c:'db-blocker'}],
      scores:{ integrity:82, authority:82, scale:62, compliance:58, features:45, architecture:75, debt:65, doctrinal:82 },
      notes:{ integrity:'Version label still v1.0', authority:'ref badges render as clickable gold links', scale:'d3.tree handles overlap. Dense views zoom far \\u2014 card size at zoom is a future issue.', compliance:'Sidebar improved. Fonts + version label = remaining compliance debt.', features:'Visual prototypes built (layout-demo.html, grid-layout-demo.html). Implementation waiting.', architecture:'Dashboard + radar chart integrated and working.', debt:'Typography + version = compliance debt. Low priority vs authority research.', doctrinal:'Classification banner correct. All visual decisions deferred to data completion.' }
    },
    {
      id:'graph', name:'GRAPH-ANALYZER', color:'#00cccc', status:'GREEN', statusCls:'dash-s-green',
      concern: authCount+' auth entries. '+refCoverage+' have ref chains. Zero orphans. 7 PEO TA errors corrected this session. Remaining concern: cyber vs daco field naming inconsistency and TACON as dead config.',
      badges:[{t:'CHAINS CLEAN',c:'db-ready'},{t:'7 ERRORS FIXED',c:'db-ready'},{t:'TACON AUDIT',c:'db-conflict'}],
      scores:{ integrity:95, authority:92, scale:72, compliance:70, features:52, architecture:85, debt:80, doctrinal:90 },
      notes:{ integrity:'Zero orphans. All chains resolve. 7 PEO TA errors corrected (NAVSEA/NAVWAR PEOs pointed to NAVAIR).', authority:authCount+' entries. dac chains walk to POTUS for OSD+SECNAV layer.', scale:'d3.tree handles 500+ nodes. SVG rendering is the future bottleneck.', compliance:'WCAG passing. Color system mapped.', features:'OSD + ref + SECNAV chain complete. PMA/squadron level next.', architecture:'resolveChain() handles all authority types correctly.', debt:'TACON: defined in config (color #ff3355, dash 2,4, weight 1.3) but zero usage in auth or links. Audit needed.', doctrinal:'58 entries grounded to Constitution. 109 remaining = the work ahead.' }
    }
  ];`;

// Find and replace the agent block
const agentStart = src.indexOf('  var hasOrphans = orphanCount > 0;');
const agentEnd = src.indexOf('];', src.indexOf('var DASH_AGENTS = [', agentStart)) + 2;
src = src.substring(0, agentStart) + agentBlock + src.substring(agentEnd);

// Replace priorities
const priStart = src.indexOf('  // \u2500\u2500 Priority Table \u2500\u2500');
const priEnd = src.indexOf('];', src.indexOf('var priorities = [', priStart)) + 2;
const newPri = `  // \u2500\u2500 Priority Table \u2500\u2500
  var priorities = [
    { p:'P1',c:'dp1', item:'Authority research: ref chains for remaining 109 auth entries', fid:'HIGH',fb:'df-h', eff:'HIGH', blocks:'All visual work, data fidelity' },
    { p:'P2',c:'dp1', item:'TACON audit: zero usage \\u2014 research or remove from config', fid:'HIGH',fb:'df-h', eff:'LOW', blocks:'Dead config cleanup' },
    { p:'P3',c:'dp1', item:'Harmonize cyber vs daco field naming', fid:'MED',fb:'df-m', eff:'LOW', blocks:'Data consistency' },
    { p:'P4',c:'dp2', item:'SECNAVINST 5400.15D two-chain: verify all SYSCOM intersections', fid:'HIGH',fb:'df-h', eff:'MED', blocks:'View accuracy' },
    { p:'P5',c:'dp2', item:'PMA/PMS program offices: ref chains with acquisition instruments', fid:'HIGH',fb:'df-h', eff:'HIGH', blocks:'Acquisition view accuracy' },
    { p:'P6',c:'dp3', item:'Bundle Roboto Slab WOFF2 fonts', fid:'MED',fb:'df-m', eff:'LOW', blocks:'UI compliance' },
    { p:'P7',c:'dp3', item:'Fix version label v1.0 \\u2192 current', fid:'LOW',fb:'df-l', eff:'TRIVIAL', blocks:'None' },
    { p:'P8',c:'dp4', item:'Ghost nodes for dual-hat rendering (P2-A)', fid:'HIGH',fb:'df-h', eff:'MED', blocks:'Dual-hat views (blocked by P1)' },
    { p:'P9',c:'dp4', item:'Cross-cutting link routing (TA/LCSP arcs)', fid:'HIGH',fb:'df-h', eff:'MED', blocks:'TA views (blocked by P1)' },
    { p:'P10',c:'dp5', item:'Define tenant relationship type', fid:'HIGH',fb:'df-h', eff:'LOW', blocks:'CNIC/MCICOM (blocked by P1)' }
  ];`;
src = src.substring(0, priStart) + newPri + src.substring(priEnd);

// Replace decisions
const decStart = src.indexOf('  // \u2500\u2500 Decisions \u2500\u2500');
const decEnd = src.indexOf('];', src.indexOf('var decisions = [', decStart)) + 2;
const newDec = `  // \u2500\u2500 Decisions \u2500\u2500
  var decisions = [
    { title:'1. Layout Engine \\u2014 LOCKED', opts:[
      {tag:'\\u2713',text:'P1-B d3.tree + P2-A ghost nodes. Implementation done (d3.tree) / designed (ghosts). Waiting on data.',rec:true}
    ]},
    { title:'2. Authority Research Scope', opts:[
      {tag:'A',text:'Full coverage: ref chains for all 167 auth entries before any visual work',rec:true},
      {tag:'B',text:'80% threshold: resume visual work once 134+ entries have ref chains',rec:false},
      {tag:'C',text:'Tier-based: complete one echelon level at a time (Echelon 2, then 3, then 4+)',rec:false}
    ]},
    { title:'3. TACON Disposition', opts:[
      {tag:'A',text:'Research: find specific TACON usage in current node set and codify',rec:false},
      {tag:'B',text:'Remove: delete from config if no current nodes use it. Re-add when needed.',rec:true},
      {tag:'C',text:'Keep as placeholder: leave in config, document as unused pending future nodes',rec:false}
    ]},
    { title:'4. cyber vs daco Field Harmonization', opts:[
      {tag:'A',text:'Keep daco in auth entries, map to cyber rendering at draw time',rec:true},
      {tag:'B',text:'Rename all to cyber',rec:false},
      {tag:'C',text:'Rename all to daco',rec:false}
    ]}
  ];`;
src = src.substring(0, decStart) + newDec + src.substring(decEnd);

// Replace conflicts
const cflStart = src.indexOf('  // \u2500\u2500 Conflicts \u2500\u2500');
const cflEnd = src.indexOf('];', src.indexOf('var conflicts = [', cflStart)) + 2;
const newCfl = `  // \u2500\u2500 Conflicts \u2500\u2500
  var conflicts = [
    {cls:'db-blocker',title:'109 auth entries lack ref chains',desc:'35% ref coverage. Visual design for ungrounded authority relationships produces misleading displays. Authority research is the critical path.'},
    {cls:'db-conflict',title:'TACON: dead config',desc:'Color (#ff3355), dash (2,4), weight (1.3), and filter entry defined but zero usage in auth entries or view links. Either research and codify or remove.'},
    {cls:'db-conflict',title:'cyber vs daco field mismatch',desc:'Auth entries use "daco" field, view links use "cyber" authority type. Same DoDI 8530.01 relationship rendered differently depending on context.'},
    {cls:'db-conflict',title:'Font stack non-compliant',desc:'IBM Plex Sans primary; Navy Design Guide says Roboto Slab. Version label still v1.0. Low priority vs authority research.'},
    {cls:'db-conflict',title:'Lesson learned: design preceded data',desc:'Time spent on layout engines, grid prototypes, and radial evaluation before authority data was complete. Visual decisions deferred until ref coverage reaches 80%+.'}
  ];`;
src = src.substring(0, cflStart) + newCfl + src.substring(cflEnd);

// Replace opportunities
const oppStart = src.indexOf('  // \u2500\u2500 Opportunities \u2500\u2500');
const oppEnd = src.indexOf('];', src.indexOf('var opps = [', oppStart)) + 2;
const newOpp = `  // \u2500\u2500 Opportunities \u2500\u2500
  var opps = [
    {cls:'db-ready',title:'Foundation is solid',desc:'ref schema, validator, 50 documents, d3.tree engine, dashboard \\u2014 all working. The infrastructure to codify and visualize authority is built. Now fill it with researched data.'},
    {cls:'db-ready',title:'SECNAV two-chain model understood',desc:'SECNAVINST 5400.15D research complete. AA vs ADCON vs TA separation at SYSCOM intersections is well-defined. Ready to codify remaining nodes.'},
    {cls:'db-opportunity',title:'7 data errors already caught',desc:'PEO TA references corrected (NAVSEA/NAVWAR PEOs pointed to NAVAIR). Systematic ref chain work will find more. Each fix improves every view that touches those nodes.'},
    {cls:'db-opportunity',title:'Visual prototypes ready to implement',desc:'d3.tree (done), ghost nodes (designed), link routing (prototyped). All waiting on authority data completion. No design work needed \\u2014 just data.'}
  ];`;
src = src.substring(0, oppStart) + newOpp + src.substring(oppEnd);

fs.writeFileSync(appPath, src, 'utf-8');
console.log('Dashboard updated. File size:', src.length);

// Verify syntax
try {
  new Function(src);
  console.log('Syntax: OK');
} catch(e) {
  console.log('SYNTAX ERROR:', e.message);
}
