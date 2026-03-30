// ═══════════════════════════════════════════════════════
// DATA LOADING — from external kms-data.js
// ═══════════════════════════════════════════════════════
const SVC = KMS_DATA.config.svc;
const ACOL = KMS_DATA.config.acol;
const ADSH = KMS_DATA.config.adsh;
const AW = KMS_DATA.config.aw;
const AOR_COL = KMS_DATA.config.aor_col;
const NODES = KMS_DATA.nodes;
const AUTH = KMS_DATA.auth;
const VIEWS = KMS_DATA.views;
const BUILTIN = KMS_DATA.documents;
const TL = KMS_DATA.timeline;

// Assign IDs to nodes
Object.keys(NODES).forEach(k => NODES[k].id = k);

// Session state — localStorage may be blocked from file:// in some browsers
var _storedDocs='[]',_storedLogos='{}';
try{_storedDocs=localStorage.getItem('kms7-docs')||'[]';}catch(e){}
try{_storedLogos=localStorage.getItem('kms7-logos')||'{}';}catch(e){}
const S = { activeNode: null, focusNode: null, highlight: new Set(), docs: JSON.parse(_storedDocs), logos: JSON.parse(_storedLogos), editId: null, logoTarget: null };

function load(){try{S.logos=JSON.parse(localStorage.getItem('kms7-logos')||'{}');}catch(e){} try{S.docs=JSON.parse(localStorage.getItem('kms7-docs')||'[]');}catch(e){}}
function saveLogos(){try{localStorage.setItem('kms7-logos',JSON.stringify(S.logos));}catch(e){}}
function saveDocs(){try{localStorage.setItem('kms7-docs',JSON.stringify(S.docs));}catch(e){}}

// Rendering constants
const TCOL={STATUTE:'#ccaa44',DODD:'#6699ff',DODI:'#5588ee',OPNAVINST:'#6699ee',MCO:'#ee8888',SECNAVINST:'#bb99ff','EXEC ORDER':'#ddbb44','JOINT PUB':'#77bb77',FRAGORD:'#ee9944',OPORD:'#ff7733',WARNO:'#ddaa33',CJCSI:'#88aadd',OTHER:'#888899'};
const TLK={'t-navy':'USN','t-usmc':'USMC','t-army':'Army','t-airforce':'USAF','t-joint':'Joint','t-civ':'Civilian','t-law':'Statute','t-doc':'Directive','t-cyber':'Cyber','t-ta':'Tech Auth'};
const DCOL={USN:'#3a88ff',USMC:'#cc3333',Army:'#8a7a20',Joint:'#44aa44',Cyber:'#00cccc',Legislative:'#c9a84c',Administrative:'#6688aa',Directive:'#7755cc','Executive Order':'#ddbb44'};
const SBGCOL={USN:'c-navy',USMC:'c-usmc',Army:'c-army',Joint:'c-joint',Cyber:'c-cyber',Legislative:'c-civ'};


function allDocs(){return[...BUILTIN,...S.docs];}
function allNodeIds(){const s=new Set();Object.values(VIEWS).forEach(v=>v.ids.forEach(id=>s.add(id)));return[...s].sort();}
function nlbl(id){return NODES[id]?NODES[id].lbl:id;}
function tclr(t){return TCOL[t]||'#888899';}
function tlbl(t){return TLK[t]||t;}

// ═══════════════════════════════════════════════════════
// RELEASE NOTES DATA
// ═══════════════════════════════════════════════════════
(function buildReleaseNotes(){
  // ── Milestone timeline ──
  const milestones=[
    {date:'11 MAR 2026',ver:'v7.0',color:'#aaff00',title:'v7.0 Full Build — 5 OPNAVINST Source Documents, +15 Nodes, +30 AUTH Entries, TA/ADCON Corrections',tags:['BUILD','OPNAVINST','AUDIT','TITLE 10'],
     body:'Major data integrity release driven by full audit of reference documents. Five OPNAVINST instructions (5450.350B NAVAIR, 5450.340A NAVSEA, 5440.77C USFFC, 5450.352B OPNAV, 5450.345 FLTCYBERCOM) ingested into Directives library — these are the primary source authorities for NAVAIR TA, NAVSEA TA, USFFC subordination, CNO echelon 2 listing, and FLTCYBERCOM/10th Fleet cyber operations. +15 organizational nodes added: NAWCAD, NAWCWD (warfare centers under NAVAIR), NAVRMC (NAVSEA maintenance bridge), CNIC, NAVRESFOR, NAVSPECWAR, CHNAVPERS, NAVSAFECEN (echelon 2 under CNO), MSC, NECC, NWDC, CNMOC (echelon 3 under USFFC), 10th Fleet (cyber). +30 AUTH matrix entries expanded for all fleet commanders, TYCOMs, new nodes, and PEOs. NAVSEA TA and NAVWAR TA lines drawn per OPNAVINST 5440.77C para 7b. Views updated: DoN, CNO Service Authority, NAVAIR Authority, DACO/Cyber. Version badge corrected. All v5.2 content preserved.'},
    {date:'06 MAR 2026',ver:'v5.2',color:'#aaff00',title:'v5.2 Full Build — COMFRC Enterprise, LCSP Return Line, Maintenance Levels, 6 New Statutes',tags:['BUILD','COMFRC','TITLE 10','NAMP'],
     body:'COMFRC HQ + 9 FRCs + 5 key detachments added as fully geolocated nodes. Maintenance level badges (O/I/D) rendered on all FRC and MALS nodes. LCSP/MDS Data Return line type (#6A9900, dashed 8-4, 0.9px, ↑ upward) implemented in Maintenance Levels view and auth filter. Two new views: COMFRC Enterprise (full administrative hierarchy) and Maintenance Levels (O/I/D capability grouping with TA + LCSP Return lines). Auth matrix expanded with LCSP row. Six new statutory documents: 10 USC §§ 4324, 4614, 4618, 4622, 3771-3774, COMNAVAIRFORINST 4790.2E (NAMP). Legend updated. All v5.1 content preserved. +15 nodes, +2 views, +6 docs, +1 line type rendered.'},
    {date:'06 MAR 2026',ver:'v5.1',color:'#aaff00',title:'Viewport Centering — Auto-Center on POTUS / Selected Node',tags:['UX','CORE'],
     body:'Identified that maximizing screen real estate is a primary function. Implemented: (1) On every view render, tool automatically centers and scales to POTUS if present — otherwise to topmost node. (2) On node selection, view smoothly transitions to center the selected unit in available canvas (accounting for 270px detail panel). Animated transition 420ms. D3 zoom behavior exposed as module-level reference. Node pixel positions stored post-render in <code>ORG.nodePos</code> map. Zero impact on existing zoom/pan — user can still freely scroll after auto-center fires.'},
    {date:'06 MAR 2026',ver:'v5.1',color:'#aaff00',title:'Release Notes Panel — Embedded in Application',tags:['UI','DOCS'],
     body:'Pre-build specification document from v5.1 design session embedded as Tab 6 in the main tab bar. Accessible at runtime without external file. Covers: locked visual spec, Title 10 statutory framework table, LCSP return line full spec, three maintenance level definitions, COMFRC enterprise inventory (all 9 FRCs with geolocations), new views/tabs planned, new library documents. Self-populating from JS data at load time. This milestone history section added in same session.'},
    {date:'06 MAR 2026',ver:'v5.1',color:'#6a9900',title:'LCSP / MDS Data Return Path — 7th Authority Line Type Specified',tags:['SPEC','TITLE 10'],
     body:'New upward authority line specified: FRC/MALS/Squadron → PM. Muted lime #6A9900 (darker than TA lime, same family). 0.9px weight, 8-4 long-dash, open circle ○ terminus at PM. Statutory basis: 10 USC § 4324(b)(1)(G–I) — PM must maintain configuration currency throughout system life cycle. COMNAVAIRFORINST 4790.2E Ch. 5 (MDS) and Ch. 8 (aircraft logbooks) establish the data return obligation. Toggle default: OFF. This closes the lifecycle loop: TA flows down (authority), MDS returns up (configuration currency).'},
    {date:'06 MAR 2026',ver:'v5.1',color:'#7aaaee',title:'Three Maintenance Levels as Navigable Architecture',tags:['SPEC','NAMP'],
     body:'O/I/D levels defined per COMNAVAIRFORINST 4790.2E. Key doctrine: levels are capability designations, not organizational echelons — nodes may be co-located (MALS performs O+I; depot FRCs perform I+D). Node badge spec: lower-right corner "O", "I", "D", "O/I", "I/D". Maintenance Level filter added to filter panel — toggle each level independently. Use case: D-only filter reveals all depot facilities and their PM authority relationships. Three new views planned: Maintenance Levels View, COMFRC Enterprise View.'},
    {date:'06 MAR 2026',ver:'v5.1',color:'#c9a84c',title:'COMFRC Enterprise — 9 FRCs + Detachments Fully Specified',tags:['SPEC','NODES'],
     body:'All 9 Fleet Readiness Centers inventoried with location, maintenance level, primary platforms, and detachment sites. FRCE (Cherry Point), FRCSE (Jacksonville), FRCSW (North Island), FRCMA (Oceana), FRCW (Lemoore), FRCNW (Whidbey Island), FRCWP (Atsugi), FRC ASE (Patuxent River), FRC RMW (Fort Worth). FRCSW sites include Yuma AZ, Kaneohe Bay HI, MCAS Pendleton CA, Pt. Mugu CA. ~40 new nodes specified. Authority source: CNO → NAVAIRSYSCOM → COMFRC per 10 USC §§ 8013, 8033.'},
    {date:'06 MAR 2026',ver:'v5.1',color:'#c9a84c',title:'Title 10 Statutory Framework — All New Elements Grounded',tags:['SPEC','TITLE 10'],
     body:'User directive: all naming/authority decisions derive from Title 10 USC, not convention. Statutory table produced mapping every new visual element to its authorizing section: § 4324 (LCSP/TA), § 3774 (technical data rights), § 2460/4614 (depot definition), § 2464/4618 (core depot capability), § 2466/4622 (50% contract ceiling), §§ 8013/8033 (CNO/NAVAIRSYSCOM). COMNAVAIRFORINST 4790.2E (NAMP) incorporated as regulatory implementation of statute.'},
    {date:'06 MAR 2026',ver:'v5.0',color:'#f4f4f4',title:'v5.0 Delivered — 132KB, 140+ Nodes, 6 Authority Line Types',tags:['BUILD','BASELINE'],
     body:'Delivered single-file HTML at 132KB. 140+ nodes across 11 views: Strategic, OSD, DoN, Navy Admin, USMC Admin, Geographic COCOMs, Functional COCOMs, DACO/Cyber, Acquisition, Technical Authority, MALS Detail. 6 authority line types: COCOM, ADCON, OPCON, TACON, DACO/Cyber, Technical Authority. 5 tabs: Org Chart, Directives (15+ documents), Timeline, Geo Map (Leaflet, ~100 geolocated nodes), Registry. Authority matrix panel per node. COCOM AOR overlays. UIC/PUC attributes. Logo upload capability.'},
    {date:'06 MAR 2026',ver:'v5.0',color:'#888',title:'Visual Specification Locked — Interactive Selection Session',tags:['SPEC','DESIGN'],
     body:'Interactive visual selection tool delivered (50KB). User confirmed: parallel offset curves for multi-relationship rendering; TA line lime #AAFF00; diamond ◇ terminus at receiving unit; Style C nodes (near-black fill, bold 2.5px stroke). Selection tool archived at don-c2-visual-spec.html.'},
    {date:'06 MAR 2026',ver:'Pre-v5',color:'#555',title:'Doctrine Research — COMFRC, NAMP, Title 10 Depot Framework',tags:['RESEARCH'],
     body:'Researched and verified: 10 USC §§ 2460, 2464, 2466, 4324, 3771–3774; COMNAVAIRFORINST 4790.2E (NAMP) Chs. 2, 4, 5, 8, 12; COMFRC HQ location and chain; 9 FRC official designations and platforms. NAVAIR lifecycle obligation: contractually produces aircraft, retains configuration baseline authority and technical data rights for system life. When maintenance data fails to return from FRC to PMA, configuration visibility breaks and airworthiness certifications become unreliable.'},
  ];

  const mb=document.getElementById('rn-milestones');
  if(mb){
    mb.innerHTML=milestones.map((m,i)=>`
      <div style="position:relative;margin-bottom:20px">
        <div style="position:absolute;left:-21px;top:4px;width:12px;height:12px;border-radius:50%;background:${m.color};border:2px solid var(--bg1);box-shadow:0 0 6px ${m.color}66"></div>
        <div style="background:var(--bg2);border:1px solid var(--b2);border-left:3px solid ${m.color};border-radius:3px;padding:10px 14px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap">
            <span style="font-family:'Space Mono',monospace;font-size:7px;color:var(--t3)">${m.date}</span>
            <span style="font-family:'Space Mono',monospace;font-size:7px;background:${m.color}22;color:${m.color};border:1px solid ${m.color}44;padding:1px 5px;border-radius:2px">${m.ver}</span>
            ${m.tags.map(t=>`<span style="font-family:'Space Mono',monospace;font-size:6.5px;color:var(--t3);border:1px solid var(--b2);padding:1px 4px;border-radius:2px">${t}</span>`).join('')}
          </div>
          <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:13px;color:var(--t1);margin-bottom:5px">${m.title}</div>
          <div style="font-size:11px;color:var(--t2);line-height:1.55">${m.body}</div>
        </div>
      </div>`).join('');
  }

  const td=(txt,key)=>`<td style="padding:7px 10px;border:1px solid var(--b1);color:${key?'var(--t1)':'var(--t2)'};${key?'font-family:Rajdhani,sans-serif;font-weight:700;font-size:11px;letter-spacing:1px;white-space:nowrap;color:#7aaaee':'font-size:11px'}">${txt}</td>`;
  const tr=(cells,alt)=>`<tr style="${alt?'background:rgba(255,255,255,.02)':''}">${cells.map((c,i)=>td(c,i===0)).join('')}</tr>`;

  // Stat table
  const statRows=[
    ['TA line (↓)','§ 4324 + TA policy','Life-Cycle Mgmt &amp; Product Support','PM accountable lifecycle inception→disposal. LCSP mandates TA over configuration baseline. Flows: ASN(RD&amp;A)→SYSCOM→PEO→PM→unit.'],
    ['TA data label','§ 3774','Long-Term Technical Data Rights','PM must assess and acquire technical data rights to sustain system over life cycle. NAVAIR holds configuration baseline data record.'],
    ['LCSP Return (↑) <span style="color:#88dd88;font-size:9px">NEW</span>','§ 4324(b)(1)(G–I)','LCSP Data Return Obligation','PM must maintain configuration currency. Maintenance data, deficiency reports, ECPs must flow from operating/maintenance activities back to PM.'],
    ['Depot node type','§ 2460 / § 4614','Depot-Level Maintenance Definition','Overhaul, upgrading, or rebuilding of parts/assemblies; testing/reclamation. Source-of-funds neutral.'],
    ['Core depot badge','§ 2464 / § 4618','Core Logistics Capability','DoD must maintain organic depot capability. Required assessment at MS-A (§ 4251) and MS-B (§ 4252).'],
    ['50% rule note','§ 2466 / § 4622','Contract Depot Maintenance Ceiling','Max 50% of depot workload to contractors. SECDEF sole waiver authority. COMFRC organic capacity is statutory floor.'],
    ['COMFRC chain','§ 8013 + § 8033','SECNAV / CNO Organizational Authority','SECNAV organizes DoN; CNO prescribes maintenance policy. NAVAIRSYSCOM → COMFRC authorized through these sections.'],
    ['O/I/D levels','COMNAVAIRFORINST 4790.2E','Naval Aviation Maintenance Program','Defines three levels. All FRC nodes carry level designation badge in v5.1.'],
  ];
  const sb=document.getElementById('rn-stat-tbody');
  if(sb)sb.innerHTML=statRows.map((r,i)=>tr(r,i%2)).join('');

  // LCSP table
  const lcspRows=[
    ['Line name','LCSP / MDS Data Return'],
    ['Color','Muted lime <span style="color:#6a9900;font-weight:700">#6A9900</span> — related to TA lime but darker/dimmer. Same family = same domain. "Reporting up" vs "authority down."'],
    ['Direction','↑ Upward only — FRC / MALS / Squadron → PM'],
    ['Weight','0.9px — subordinate to 1.8px TA downward line. Present but not dominant.'],
    ['Dash pattern','8, 4 — long-dash, distinct from TA down pattern (7,3,2,3)'],
    ['Terminus at PM','Open circle ○ — "data received and held by PM." Distinct from TA diamond ◇ which signals obligation issued downward.'],
    ['Toggle default','OFF — enable in filter panel alongside other authority line toggles'],
    ['Applies to','All O/I/D maintenance activities upward to their responsible PMA. Key paths: FRCE→PMA-265; FRCSW→PMA-272; MALS-16→PMA-281, PMA-272, PMA-276'],
  ];
  const lb=document.getElementById('rn-lcsp-tbody');
  if(lb)lb.innerHTML=lcspRows.map((r,i)=>tr(r,i%2)).join('');

  // FRC table
  const frcRows=[
    ['FRCE','FRC East','MCAS Cherry Point NC','I/D','F/A-18, F-35C, C-130J, structural repair, T-56 engine. Largest industrial employer east of I-95 in NC.'],
    ['FRCSE','FRC Southeast','NAS Jacksonville FL','I/D','F/A-18, F-35, E-2/C-2, P-8A, T-45, E-6B. Engines: F414, F404, J52, T700, T56, TF34. DETs: Mayport, Key West, Tinker AFB, Cecil Field.'],
    ['FRCSW','FRC Southwest','NAS North Island CA','I/D','F/A-18A-F, EA-18G, E-2C/D, AV-8B, MV-22B, MH-60. Sites: Yuma AZ, Kaneohe Bay HI, Pt. Mugu CA, MCAS Pendleton CA.'],
    ['FRCMA','FRC Mid-Atlantic','NAS Oceana VA','I','Strike fighter, component repair. DET NAS Norfolk.'],
    ['FRCW','FRC West','NAS Lemoore CA','I/D','F/A-18 all series, PMI/MOD line. DETs: Fallon NV, Fort Worth TX, China Lake CA.'],
    ['FRCNW','FRC Northwest','NAS Whidbey Island WA','I','EA-18G, P-8A, E-2/C-2, component repair.'],
    ['FRCWP','FRC WestPac','NAF Atsugi Japan','I/D','INDOPACOM/CENTCOM forward depot. Origin: FAWPRA(1950s)→NAPRA(1980)→FRC WestPac(2008).'],
    ['FRC ASE','FRC Avn Support Equip','Patuxent River MD','I','Aviation support equipment repair, calibration, SE overhaul.'],
    ['FRC RMW','FRC Reserve Mid-West','NAS Fort Worth JRB TX','I','Reserve component intermediate maintenance. USNR and USMCR aviation units.'],
  ];
  const lvlColor={'I/D':'#ff9500','I':'#c9a84c','O':'#88dd88','O/I':'#88dd88'};
  const fb=document.getElementById('rn-frc-tbody');
  if(fb)fb.innerHTML=frcRows.map((r,i)=>{
    const lvl=r[3];const lc=lvlColor[lvl]||'#c9a84c';
    return `<tr style="${i%2?'background:rgba(255,255,255,.02)':''}">
      <td style="padding:7px 10px;border:1px solid var(--b1);font-family:Rajdhani,sans-serif;font-weight:700;font-size:11px;color:#7aaaee">${r[0]}</td>
      <td style="padding:7px 10px;border:1px solid var(--b1);color:var(--t1);font-size:11px">${r[1]}</td>
      <td style="padding:7px 10px;border:1px solid var(--b1);color:var(--t2);font-size:11px">${r[2]}</td>
      <td style="padding:7px 10px;border:1px solid var(--b1);font-family:Rajdhani,sans-serif;font-weight:700;font-size:13px;color:${lc};text-align:center">${lvl}</td>
      <td style="padding:7px 10px;border:1px solid var(--b1);color:var(--t2);font-size:11px">${r[4]}</td>
    </tr>`;
  }).join('');

  // New elements table
  const newRows=[
    ['Tab 6 — Maintenance Levels View','Dedicated view grouping all maintenance activities by O/I/D capability. Demonstrates that maintenance level is a capability designation, not an echelon. Shows which PMAs hold TA over which FRCs.'],
    ['Tab 7 — COMFRC Enterprise View','Full COMFRC → FRC → Detachment/Site hierarchy. All 9 FRCs with dets. UIC, location, maintenance level badge, primary platforms, authority matrix.'],
    ['Maintenance Level Filter','Added to filter panel. Toggle O / I / D independently. Use case: isolate D-level to see all depot facilities and their PM authority relationships.'],
    ['LCSP Return Line Toggle','Added to authority line toggles. Off by default. When enabled: muted-lime dashed lines draw UPWARD from FRC/MALS/squadron nodes to responsible PMAs.'],
    ['Map View — FRC Layer','FRC nodes and dets on existing Leaflet map. Maintenance level badge on marker. FRCSW USMC sites shown with MAG/MALS relationships.'],
    ['Authority Matrix Expansion','For selected FRC node: platforms supported → PMAs holding TA → MDS return path back to each PMA. Full lifecycle loop traceable.'],
    ['10 USC §§ 2460, 2464, 2466 (Library)','Depot maintenance definition, core capability, 50% contract ceiling. Statutory basis for COMFRC existence and workload balance.'],
    ['10 USC § 4324 (Library)','Life-cycle management and product support. Primary statutory basis for LCSP Return line.'],
    ['10 USC §§ 3771–3774 (Library)','Rights in technical data. PM long-term data needs assessment. NAVAIR configuration baseline data rights.'],
    ['COMNAVAIRFORINST 4790.2E (Library)','NAMP — O/I/D level definitions, MDS data return, MALS organization, depot-level industrial program.'],
    ['All v5 nodes, views, tabs, docs','Preserved. v5.1 is additive only. No existing content modified.'],
  ];
  const nb=document.getElementById('rn-new-tbody');
  if(nb)nb.innerHTML=newRows.map((r,i)=>tr(r,i%2)).join('');
})();

// PANEL NAV
// ═══════════════════════════════════════════════════════
function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.getElementById('p-'+id).classList.add('on');
  var map={org:0,orders:1,timeline:2,map:3,registry:4,relnotes:5,accuracy:6};
  document.querySelectorAll('.tab')[map[id]].classList.add('on');
  if(id==='org')setTimeout(renderOrg,50);
  if(id==='orders')renderOrders();
  if(id==='timeline')renderTimeline();
  if(id==='map')initMap();
  if(id==='registry')renderRegistry();
  if(id==='accuracy')runValidation();
}

// ═══════════════════════════════════════════════════════
// ORG CHART — D3 RENDERER
// ═══════════════════════════════════════════════════════
const NW=156,NH=76;
const ORG={nodePos:{},zb:null}; // org chart viewport state
function _svgDims(){const el=document.getElementById('oc-svg');return{W:el.clientWidth||900,H:el.clientHeight||580};}
function fitAllNodes(dur){
  if(!ORG.zb||!Object.keys(ORG.nodePos).length)return;
  const {W,H}=_svgDims();
  const sideW=document.getElementById('oc-side').classList.contains('open')?270:0;
  const availW=W-sideW;
  const pad=60;
  const ids=Object.keys(ORG.nodePos);
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  ids.forEach(id=>{const p=ORG.nodePos[id];minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x+NW);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y+NH);});
  const cw=maxX-minX, ch=maxY-minY;
  if(cw<=0||ch<=0)return;
  const scX=(availW-pad*2)/cw, scY=(H-pad*2)/ch;
  const scale=Math.min(scX,scY,2.0);
  const cx=minX+cw/2, cy=minY+ch/2;
  const tx=availW/2-cx*scale, ty=H/2-cy*scale;
  const t=d3.zoomIdentity.translate(tx,ty).scale(scale);
  if(dur>0)d3.select('#oc-svg').transition().duration(dur).call(ORG.zb.transform,t);
  else d3.select('#oc-svg').call(ORG.zb.transform,t);
}
function centerOnNode(id,k,vAnchor){
  if(!ORG.zb||!ORG.nodePos[id])return;
  const {W,H}=_svgDims();
  const p=ORG.nodePos[id];
  const sideW=document.getElementById('oc-side').classList.contains('open')?270:0;
  const availW=W-sideW;
  const scale=k||1.0;
  // vAnchor: 0=top (node near top edge), 0.5=middle. Default 0 → hierarchy flows down
  const va=(vAnchor===undefined)?0:vAnchor;
  const topPad=28; // px from top edge to node when va=0
  const tx=availW/2-(p.x+NW/2)*scale;
  const ty=topPad+H*va-(p.y+NH/2)*scale;
  d3.select('#oc-svg').transition().duration(420).call(ORG.zb.transform,d3.zoomIdentity.translate(tx,ty).scale(scale));
}
function _topNodeForView(nodes){
  // Prefer POTUS; fall back to node with lowest y
  if(ORG.nodePos['potus'])return'potus';
  let best=null,bestY=Infinity;
  nodes.forEach(n=>{if(ORG.nodePos[n.id]&&ORG.nodePos[n.id].y<bestY){bestY=ORG.nodePos[n.id].y;best=n.id;}});
  return best;
}
// ── FOCUS LAYOUT: BFS downstream from root, compute tree positions ──
// All unique links across every view — for focus-mode BFS
function allViewLinks(){
  const seen=new Set(), out=[];
  Object.values(VIEWS).forEach(v=>(v.links||[]).forEach(lk=>{
    const key=lk.s+'|'+lk.t+'|'+lk.a;
    if(!seen.has(key)){seen.add(key);out.push(lk);}
  }));
  return out;
}

// Subtree-aware layout: each node's children cluster below it.
// Allocates horizontal space proportional to leaf-count so subtrees don't collide.
function buildFocusLayout(rootId, viewLinks, availW, maxDepth){
  maxDepth=maxDepth||1;
  const HPAD=NW+22, VGAP=NH+70;

  // ── BFS to build tree ──────────────────────────────────────
  const adj={};
  viewLinks.forEach(lk=>{if(!adj[lk.s])adj[lk.s]=[];adj[lk.s].push(lk);});
  const parent={}, childList={}, visited=new Set([rootId]);
  childList[rootId]=[];
  const queue=[{id:rootId,depth:0}];
  const focusLinks=[];
  while(queue.length){
    const {id,depth}=queue.shift();
    (adj[id]||[]).forEach(lk=>{
      if(!visited.has(lk.t)&&depth<maxDepth){
        visited.add(lk.t);
        parent[lk.t]=id;
        if(!childList[lk.t])childList[lk.t]=[];
        childList[id].push(lk.t);
        focusLinks.push(lk);
        queue.push({id:lk.t,depth:depth+1});
      }
    });
  }
  // cross-links between visited nodes (sibling authority lines)
  viewLinks.forEach(lk=>{
    if(visited.has(lk.s)&&visited.has(lk.t)&&!focusLinks.find(fl=>fl.s===lk.s&&fl.t===lk.t))
      focusLinks.push(lk);
  });

  // ── Count leaves in each subtree ───────────────────────────
  function leafCount(id){
    const ch=childList[id]||[];
    if(!ch.length)return 1;
    return ch.reduce((s,c)=>s+leafCount(c),0);
  }

  // ── Assign X using DFS left-to-right ───────────────────────
  const pos={};
  // Total leaves determines total width; scale to availW with min HPAD
  const totalLeaves=leafCount(rootId)||1;
  const unitW=Math.max(HPAD, Math.floor((availW-40)/totalLeaves));

  let leafCursor=0;
  function assignPos(id,depth){
    const ch=childList[id]||[];
    if(!ch.length){
      pos[id]={x:20+leafCursor*unitW, y:36+depth*VGAP};
      leafCursor++;
    } else {
      const startLeaf=leafCursor;
      ch.forEach(c=>assignPos(c,depth+1));
      const endLeaf=leafCursor;
      // Center parent over its children's span
      const leftX=20+startLeaf*unitW;
      const rightX=20+(endLeaf-1)*unitW+NW;
      pos[id]={x:Math.round((leftX+rightX-NW)/2), y:36+depth*VGAP};
    }
  }
  assignPos(rootId,0);

  return{nodeIds:[...visited],pos,links:focusLinks};
}

// ── SHARED DEFS SETUP ──
function setupDefs(svg){
  const defs=svg.append('defs');
  Object.keys(ACOL).forEach(type=>{
    defs.append('marker').attr('id','arr-'+type).attr('viewBox','0 -5 10 10').attr('refX',13).attr('refY',0).attr('markerWidth',4).attr('markerHeight',4).attr('orient','auto')
      .append('path').attr('d','M0,-5L10,0L0,5').attr('fill',ACOL[type]).attr('opacity',.9);
  });
  ['glow','cyberGlow','taGlow'].forEach((id,i)=>{
    const f=defs.append('filter').attr('id',id);
    f.append('feGaussianBlur').attr('stdDeviation',i===0?2.5:3.5).attr('result','blur');
    const m=f.append('feMerge');m.append('feMergeNode').attr('in','blur');m.append('feMergeNode').attr('in','SourceGraphic');
  });
}

// ── SHARED DRAW: links ──
function drawLinks(G, links, posMap, af, hiSet, isFocus){
  links.forEach(lk=>{
    if(af!=='all'&&lk.a!==af)return;
    const sp=posMap[lk.s],tp=posMap[lk.t];if(!sp||!tp)return;
    const col=ACOL[lk.a]||'#555';
    const x1=sp.x+NW/2,y1=sp.y+NH,x2=tp.x+NW/2,y2=tp.y;
    const my=(y1+y2)/2;
    const hi=isFocus||(hiSet.has(lk.s)&&hiSet.has(lk.t));
    G.append('path').attr('d',`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`)
      .attr('stroke',col).attr('stroke-width',hi?AW[lk.a]*2.2:AW[lk.a])
      .attr('fill','none').attr('opacity',hi?1:hiSet.size?0.13:(lk.a==='cyber'||lk.a==='ta')?0.85:0.65)
      .attr('stroke-dasharray',ADSH[lk.a]||null).attr('marker-end','url(#arr-'+lk.a+')')
      .attr('filter',(lk.a==='cyber'&&!hiSet.size)?'url(#cyberGlow)':(lk.a==='ta'&&!hiSet.size)?'url(#taGlow)':null);
  });
}

// ── SHARED DRAW: nodes ──
function drawNodes(G, nodes, posMap, activeId, hiSet, isFocus){
  nodes.forEach(n=>{
    const sc2=SVC[n.svc]||SVC.civ;
    const p=posMap[n.id];if(!p)return;
    const isSel=n.id===activeId;
    const isHi=hiSet.has(n.id);
    const isDim=!isFocus&&hiSet.size>0&&!isHi&&!isSel;
    const isCyber=n.svc==='cyber',isAcq=n.svc==='acq';
    const ng=G.append('g').attr('transform',`translate(${p.x},${p.y})`).style('cursor','pointer')
      .attr('opacity',isDim?0.15:1)
      .on('click',e=>{e.stopPropagation();selectNode(n.id);})
      .on('dblclick',e=>{e.stopPropagation();pickLogo(n.id);})
      .on('mouseover',e=>showTT(e,n)).on('mousemove',e=>moveTT(e)).on('mouseout',hideTT);
    ng.append('rect').attr('width',NW).attr('height',NH).attr('rx',3).attr('fill','#000').attr('opacity',.4).attr('transform','translate(2,2)');
    ng.append('rect').attr('width',NW).attr('height',NH).attr('rx',3).attr('fill',sc2.fill)
      .attr('stroke',isSel?'#c9a84c':sc2.stroke).attr('stroke-width',isSel?2.5:1.5)
      .attr('filter',(isHi||(isCyber&&!isDim))?'url(#'+(isCyber?'cyberGlow':'glow')+')':(isAcq&&!isDim)?'url(#taGlow)':null);
    if(isSel)ng.append('rect').attr('width',NW+4).attr('height',NH+4).attr('rx',4).attr('x',-2).attr('y',-2)
      .attr('fill','none').attr('stroke','#c9a84c').attr('stroke-width',1).attr('opacity',.5);
    if(n.dh){
      const dhCol=isCyber?ACOL.cyber:isAcq?ACOL.ta:ACOL.cocom;
      ng.append('rect').attr('x',0).attr('y',NH-14).attr('width',NW).attr('height',14).attr('rx',1)
        .attr('fill',dhCol).attr('opacity',.85);
      ng.append('text').attr('x',NW/2).attr('y',NH-3).attr('text-anchor','middle').attr('font-family','Space Mono,monospace').attr('font-weight','700').attr('font-size',7.5)
        .attr('fill',sc2.fill).text('\u25c6 '+n.dh[0]);
    }
    const logo=n.logo||S.logos[n.id],tx=logo?38:8;
    if(logo){
      ng.append('clipPath').attr('id','lc-'+n.id).append('rect').attr('x',4).attr('y',4).attr('width',30).attr('height',30).attr('rx',2);
      ng.append('image').attr('x',4).attr('y',4).attr('width',30).attr('height',30).attr('preserveAspectRatio','xMidYMid meet').attr('href',logo).attr('clip-path','url(#lc-'+n.id+')');
    }else{
      ng.append('rect').attr('x',0).attr('y',0).attr('width',5).attr('height',NH).attr('rx',1).attr('fill',sc2.stroke).attr('opacity',.9);
    }
    const lbl=n.lbl.length>15?n.lbl.slice(0,14)+'\u2026':n.lbl;
    const sub=n.sub.length>26?n.sub.slice(0,25)+'\u2026':n.sub;
    ng.append('text').attr('x',tx).attr('y',16).attr('font-family','Rajdhani,sans-serif').attr('font-weight','700').attr('font-size',12.5).attr('fill',sc2.text).attr('letter-spacing','0.5').text(lbl);
    if(n.billet){ng.append('text').attr('x',tx).attr('y',28).attr('font-family','Rajdhani,sans-serif').attr('font-size',9.5).attr('font-weight','600').attr('fill',isSel?'#c9a84c':isCyber?'#22cccc':isAcq?'#bb99dd':'#a0b8d0').attr('letter-spacing','0.3').text(n.billet);}
    ng.append('text').attr('x',tx).attr('y',40).attr('font-family','IBM Plex Sans,sans-serif').attr('font-size',8.5).attr('fill',isCyber?'#33bbbb':isAcq?'#9966cc':'#6688aa').text(sub);
    if(n.maint){
      const mlvl=n.maint;
      const mclr=mlvl==='I/D'?'#ff9500':mlvl==='D'?'#ff6600':mlvl==='O/I'?'#88dd88':'#c9a84c';
      const mbg=ng.append('g').attr('transform',`translate(${NW-20},${NH-15})`);
      mbg.append('rect').attr('x',-2).attr('y',-2).attr('width',17).attr('height',14).attr('rx',2).attr('fill','#000').attr('opacity',.7);
      mbg.append('text').attr('x',6.5).attr('y',9).attr('text-anchor','middle').attr('font-family','Rajdhani,sans-serif').attr('font-weight','700').attr('font-size',8.5).attr('fill',mclr).attr('letter-spacing','0.2').text(mlvl);
    }
  });
}

function renderOrg(){
  var vk=document.getElementById('oc-view').value;
  var af=document.getElementById('oc-auth').value;
  var svg=d3.select('#oc-svg');svg.selectAll('*').remove();
  var svgEl=document.getElementById('oc-svg');
  var W=svgEl.clientWidth||900;
  var H=svgEl.clientHeight||580;

  // Toggle custom chart toolbar visibility
  var ccBar=document.getElementById('cc-bar');
  if(ccBar)ccBar.classList.toggle('on',vk==='custom');

  // CUSTOM CHART MODE
  if(vk==='custom'){
    renderCustomChart(svg,W,H);
    document.getElementById('tb-org').textContent=CUSTOM.nodes.size;
    return;
  }

  var view=VIEWS[vk];if(!view)return;
  setupDefs(svg);
  const G=svg.append('g');

  if(S.focusNode && view.ids.includes(S.focusNode)){
    // FOCUS MODE: re-layout rooted at selected node, subordinates cascade down
    const sideOpen=document.getElementById('oc-side').classList.contains('open');
    const availW=W-(sideOpen?274:0);
    const layout=buildFocusLayout(S.focusNode, allViewLinks(), availW);
    const focusNodes=layout.nodeIds.map(id=>NODES[id]).filter(Boolean);
    ORG.nodePos={};
    focusNodes.forEach(n=>{ORG.nodePos[n.id]=layout.pos[n.id];});
    drawLinks(G, layout.links, layout.pos, af, new Set(), true);
    drawNodes(G, focusNodes, layout.pos, S.focusNode, new Set(), true);
    // hint label
    G.append('text').attr('x',layout.pos[S.focusNode].x+NW/2).attr('y',16)
      .attr('text-anchor','middle').attr('font-family','Space Mono,monospace').attr('font-size',7)
      .attr('fill','#c9a84c').attr('opacity',.6).text('click a subordinate to go deeper  │  click background to restore');
    document.getElementById('tb-org').textContent=focusNodes.length+' of '+view.ids.length;
  } else {
    // NORMAL MODE: preset positions
    const nodes=view.ids.map(id=>{const n=NODES[id];if(!n)return null;const p=view.pos[id]||[0,0];return{...n,x:p[0],y:p[1]};}).filter(Boolean);
    if(!nodes.length)return;
    const xs=nodes.map(n=>n.x),ys=nodes.map(n=>n.y);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    const padX=55,padY=40;
    const scX=maxX===minX?1:(W-padX*2-NW)/(maxX-minX);
    const scY=maxY===minY?1:(H-padY*2-NH)/(maxY-minY);
    const sc=Math.min(scX,scY,1.6);
    const offX=(W-(maxX-minX)*sc-NW)/2;
    const px=n=>(n.x-minX)*sc+offX;
    const py=n=>(n.y-minY)*sc+padY;
    ORG.nodePos={};
    const posMap={};
    nodes.forEach(n=>{const pos={x:px(n),y:py(n)};ORG.nodePos[n.id]=pos;posMap[n.id]=pos;});
    drawLinks(G, view.links, posMap, af, S.highlight, false);
    drawNodes(G, nodes, posMap, S.activeNode, S.highlight, false);
    document.getElementById('tb-org').textContent=view.ids.length;
  }

  svg.on('click',()=>{
    S.focusNode=null;S.activeNode=null;S.highlight.clear();
    renderOrg();closeSide();updateBadge();
    document.getElementById('btn-clear').style.display='none';
  });
  ORG.zb=d3.zoom().scaleExtent([.12,4]).on('zoom',e=>G.attr('transform',e.transform));
  svg.call(ORG.zb);
  requestAnimationFrame(()=>{
    const root=S.focusNode||S.activeNode;
    if(root&&ORG.nodePos[root])centerOnNode(root,1.0,S.focusNode?0.15:0.4);
    else fitAllNodes(380);
  });
}

const NODE_HOME_VIEW={
  navair:'navair_auth',
};
function selectNode(id){
  S.activeNode=id;
  S.focusNode=id;
  S.highlight=new Set([id]);
  const related=allDocs().filter(o=>o.affects&&o.affects.includes(id));
  // If this node has a dedicated authority view, switch to it automatically
  if(NODE_HOME_VIEW[id]){
    const sel=document.getElementById('oc-view');
    if(sel){sel.value=NODE_HOME_VIEW[id];S.focusNode=null;}
  }
  renderOrg();
  openSide(id,related);
  updateBadge();
  requestAnimationFrame(()=>{if(ORG.nodePos[id])centerOnNode(id,1.0,0);});
  document.getElementById('btn-clear').style.display='inline-block';
}
function clearFilter(){S.activeNode=null;S.focusNode=null;S.highlight.clear();renderOrg();closeSide();updateBadge();document.getElementById('btn-clear').style.display='none';document.getElementById('active-badge').style.display='none';}
function updateBadge(){
  const b=document.getElementById('active-badge');
  if(S.focusNode){b.textContent='\u2b21 '+nlbl(S.focusNode)+' chain';b.style.display='inline-block';}
  else if(S.activeNode){b.textContent='\u2b21 '+nlbl(S.activeNode);b.style.display='inline-block';}
  else b.style.display='none';
}

function openSide(id,related){
  const n=NODES[id];if(!n)return;
  const sc2=SVC[n.svc]||SVC.civ;
  const logo=n.logo||S.logos[id];
  const auth=AUTH[id];

  // Build authority matrix
  let matrixHTML='';
  if(auth){
    const axes=[
      {key:'opcon',lbl:'OPCON',col:ACOL.opcon},
      {key:'adcon',lbl:'ADCON / MTE',col:ACOL.adcon},
      {key:'ta',lbl:'Tech Authority',col:ACOL.ta},
      {key:'daco',lbl:'DACO / Cyber',col:ACOL.cyber},
      {key:'lcsp',lbl:'LCSP Data Return ↑',col:ACOL.lcsp}
    ];
    matrixHTML='<div class="auth-matrix">';
    axes.forEach(ax=>{
      const chain=auth[ax.key]||[];
      matrixHTML+=`<div class="am-row"><div class="am-lbl" style="color:${ax.col}">${ax.lbl}</div><div class="am-chain">`;
      if(!chain.length){matrixHTML+='<span class="am-na">N/A</span>';}
      else{
        chain.forEach((nid,i)=>{
          if(i>0)matrixHTML+='<span class="am-arr">→</span>';
          const nn=NODES[nid];const sc3=nn?SVC[nn.svc]||SVC.civ:null;
          matrixHTML+=`<span class="am-node" style="border-color:${sc3?sc3.stroke:'#333'};color:${sc3?sc3.text:'#888'}" data-action="jump-to-node" data-arg="${nid}">${nn?nn.lbl:nid}</span>`;
        });
      }
      matrixHTML+='</div></div>';
    });
    if(auth.note)matrixHTML+=`<div style="font-family:'Space Mono',monospace;font-size:7px;color:var(--t2);margin-top:5px;padding-top:5px;border-top:1px solid var(--b1);line-height:1.5">${auth.note}</div>`;
    matrixHTML+='</div>';
  }

  // UIC / PUC
  const uicHTML=`<div class="uic-badge">
    <span class="uic-tag">UIC: <span>${n.uic||'—'}</span></span>
    <span class="uic-tag">PUC: <span>${n.puc||'—'}</span></span>
  </div>`;

  // Location chip
  const loc=n.loc;
  const aorCol=loc?AOR_COL[loc.aor]||'#888':'#888';
  const locHTML=loc?`<div class="loc-chip" data-action="jump-to-map" data-arg="${id}">
    <span class="loc-icon">📍</span>
    <div class="loc-text"><strong>${loc.install}</strong><br>${loc.city}</div>
    <span class="loc-aor" style="background:${aorCol}22;color:${aorCol};border:1px solid ${aorCol}44">${loc.aor}</span>
  </div>`:'';

  const relDocs=related.length?related.map(o=>`<div class="sn-doc" data-action="select-order" data-arg="${o.id}"><div class="sn-doc-type" style="color:${tclr(o.type)}">${o.type}</div><div class="sn-doc-title">${o.title}</div></div>`).join(''):'<div style="font-family:Space Mono,monospace;font-size:7.5px;color:var(--t3);padding:4px">No documents registered</div>';

  document.getElementById('side-title').textContent=n.lbl;
  document.getElementById('side-body').innerHTML=`
    <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:7px">
      <div class="sn-logo" id="sl-${id}" data-action="pick-logo" data-arg="${id}" title="Dbl-click node to load logo">${logo?`<img src="${logo}" alt="logo">`:`<span class="ph">Click<br>logo</span>`}</div>
      <div style="flex:1">
        <div class="sn-name">${n.lbl}</div>
        <div class="sn-full">${n.sub}</div>
        <div class="sn-row"><span class="sn-k">Service</span><span class="sn-v" style="color:${sc2.text}">${n.svc.toUpperCase()}</span></div>
        ${n.billet?`<div class="sn-row"><span class="sn-k">Billet</span><span class="sn-v">${n.billet}</span></div>`:''}
        ${n.dh?`<div class="sn-row"><span class="sn-k">Dual-Hat</span><span class="sn-v" style="color:var(--gold)">${n.dh.join(', ')}</span></div>`:''}
      </div>
    </div>
    ${uicHTML}${locHTML}
    <div class="sn-sect">Authority Matrix</div>
    ${auth?matrixHTML:'<div style="font-family:Space Mono,monospace;font-size:7.5px;color:var(--t3);padding:4px">Authority profile not defined for this node</div>'}
    <div class="sn-sect">Related Documents</div>${relDocs}`;
  document.getElementById('oc-side').classList.add('open');
}
function closeSide(){document.getElementById('oc-side').classList.remove('open');}
function jumpToNode(id){showPanel('org');setTimeout(()=>selectNode(id),80);}
function jumpToMap(id){showPanel('map');setTimeout(()=>{initMap();zoomMapToNode(id);},200);}

// Logo picker
function pickLogo(nodeId){S.logoTarget=nodeId;document.getElementById('logo-picker').click();}
document.getElementById('logo-picker').addEventListener('change',function(){
  const file=this.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{S.logos[S.logoTarget]=e.target.result;saveLogos();renderOrg();
    if(S.activeNode)openSide(S.activeNode,allDocs().filter(o=>o.affects&&o.affects.includes(S.activeNode)));};
  reader.readAsDataURL(file);this.value='';
});

// Tooltip
function showTT(e,n){
  const t=document.getElementById('tooltip');const sc2=SVC[n.svc]||SVC.civ;
  const loc=n.loc;
  const locStr=loc?`${loc.install} · ${loc.city}`:'—';
  t.innerHTML=`<h4>${n.lbl}</h4>
    <div class="tt-r"><span class="tt-k">Full</span><span class="tt-v">${n.sub}</span></div>
    <div class="tt-r"><span class="tt-k">Service</span><span class="tt-v" style="color:${sc2.text}">${n.svc.toUpperCase()}</span></div>
    <div class="tt-r"><span class="tt-k">Billet</span><span class="tt-v">${n.billet||'—'}</span></div>
    <div class="tt-r"><span class="tt-k">UIC</span><span class="tt-v" style="color:var(--gold)">${n.uic||'—'}</span></div>
    <div class="tt-r"><span class="tt-k">PUC</span><span class="tt-v">${n.puc||'—'}</span></div>
    <div class="tt-r"><span class="tt-k">Location</span><span class="tt-v">${locStr}</span></div>
    ${n.dh?`<div class="tt-r"><span class="tt-k">Dual-Hat</span><span class="tt-v" style="color:var(--gold)">${n.dh[0]}</span></div>`:''}
    <div class="tt-hint">Click → authority profile · Dbl-click → load logo</div>`;
  t.style.opacity='1';moveTT(e);
}
function moveTT(e){const t=document.getElementById('tooltip');let x=e.clientX+14,y=e.clientY-10;if(x+320>window.innerWidth)x=e.clientX-330;t.style.left=x+'px';t.style.top=y+'px';}
function hideTT(){document.getElementById('tooltip').style.opacity='0';}

// ═══════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════
function renderOrders(){buildOrdFilters();renderOrdList();}
function buildOrdFilters(){
  const fc=document.getElementById('ord-flt');if(fc.children.length)return;
  ['all','USN','USMC','Joint','OSD','Cyber'].forEach(f=>{
    const d=document.createElement('div');d.className='fchip'+(f==='all'?' on':'');d.textContent=f==='all'?'ALL':f;
    d.onclick=()=>{S.ordFilter=f;fc.querySelectorAll('.fchip').forEach(c=>c.classList.remove('on'));d.classList.add('on');renderOrdList();};
    fc.appendChild(d);
  });
}
function renderOrdList(){
  const list=document.getElementById('ord-list');list.innerHTML='';
  const docs=allDocs().filter(o=>S.ordFilter==='all'||o.service===S.ordFilter);
  document.getElementById('ord-cnt').textContent=docs.length;
  document.getElementById('tb-orders').textContent=allDocs().length;
  docs.forEach(o=>{
    const d=document.createElement('div');d.className='ord-item';d.id='ord-'+o.id;
    const bc=tclr(o.type);
    d.innerHTML=`<div class="oi-type" style="color:${bc}">${o.type}</div><div class="oi-title">${o.title}</div><div class="oi-meta">${o.number||''} · ${o.date||''}</div>`;
    d.style.borderLeft=`3px solid ${bc}33`;
    if(S.activeNode&&o.affects&&!o.affects.includes(S.activeNode))d.classList.add('dimmed');
    d.onclick=()=>{document.querySelectorAll('.ord-item').forEach(i=>i.classList.remove('sel'));d.classList.add('sel');showOrdDetail(o);};
    list.appendChild(d);
  });
}
function selectOrder(id){
  const o=allDocs().find(d=>d.id===id);if(!o)return;
  document.querySelectorAll('.ord-item').forEach(i=>i.classList.remove('sel'));
  const el=document.getElementById('ord-'+id);if(el){el.classList.add('sel');el.scrollIntoView({block:'nearest'});}
  showOrdDetail(o);
}
function showOrdDetail(o){
  const tc=tclr(o.type);
  const tags=(o.tags||[]).map(t=>`<span class="od-badge ${t}">${tlbl(t)}</span>`).join('');
  const chain=(o.chain||[]).map((c,i)=>(i>0?'<span class="od-ca">→</span>':'')+`<span class="od-cn">${c}</span>`).join('');
  const refs=(o.refs||[]).map(r=>`<div class="od-ref">${r}</div>`).join('');
  const aff=(o.affects||[]).filter(id=>NODES[id]).map(id=>{
    const n=NODES[id];const sc=SVC[n.svc]||SVC.civ;
    return `<span class="aff-node" style="border-color:${sc.stroke};color:${sc.text};background:${sc.fill}" data-action="jump-to-node" data-arg="${id}">${n.lbl}</span>`;
  }).join('');
  document.getElementById('ord-det').innerHTML=`
    <div class="od-hdr">
      <div class="od-type-l" style="color:${tc}">${o.type}</div>
      <div class="od-title">${o.title}</div>
      <div class="od-badges">${tags}</div>
      <div class="od-mgrid">
        <div><div class="od-mk">Number</div><div class="od-mv">${o.number||'—'}</div></div>
        <div><div class="od-mk">Date</div><div class="od-mv">${o.date||'—'}</div></div>
        <div><div class="od-mk">Issuer</div><div class="od-mv">${o.issuer||'—'}</div></div>
        <div><div class="od-mk">Classification</div><div class="od-mv" style="color:#44cc44">${o.classification||'UNCLASSIFIED'}</div></div>
      </div>
      ${o.file?`<div style="margin-top:8px"><a href="${o.file}" target="_blank" style="display:inline-block;font-family:Rajdhani,sans-serif;font-weight:700;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;padding:5px 14px;border-radius:3px;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.35);color:#c9a84c;text-decoration:none;cursor:pointer;transition:all .15s" class="od-pdf-link">⊞ View PDF — ${o.number||'Document'}</a></div>`:''}
    </div>
    ${o.chain&&o.chain.length?`<div class="od-sect"><div class="od-sect-t">Authority Chain</div><div class="od-chain">${chain}</div></div>`:''}
    <div class="od-sect"><div class="od-sect-t">Summary</div><div class="od-body"><p>${o.summary||''}</p></div></div>
    ${aff?`<div class="od-sect"><div class="od-sect-t">Affected Commands</div><div class="od-aff">${aff}</div></div>`:''}
    ${o.body?`<div class="od-sect"><div class="od-sect-t">Detail</div><div class="od-body">${o.body}</div></div>`:''}
    ${refs?`<div class="od-sect"><div class="od-sect-t">References</div><div class="od-refs">${refs}</div></div>`:''}`;
}

// ═══════════════════════════════════════════════════════
// TIMELINE
// ═══════════════════════════════════════════════════════
const TL_YEARS=[...new Set(TL.map(e=>e.year))].sort((a,b)=>a-b);
function renderTimeline(){
  const fromSel=document.getElementById('tl-from'),toSel=document.getElementById('tl-to');
  if(!fromSel.options.length){
    TL_YEARS.forEach(y=>{[fromSel,toSel].forEach(s=>{const o=document.createElement('option');o.value=y;o.textContent=y;s.appendChild(o);});});
    fromSel.value=TL_YEARS[0];toSel.value=TL_YEARS[TL_YEARS.length-1];
  }
  const svc=document.getElementById('tl-svc').value;
  const from=parseInt(fromSel.value),to=parseInt(toSel.value);
  const evts=TL.filter(e=>e.year>=from&&e.year<=to&&(svc==='all'||e.service===svc));
  const cnt=document.getElementById('tl-cnt');cnt.innerHTML='';
  cnt.appendChild(Object.assign(document.createElement('div'),{className:'tl-spine'}));
  const byYr={};evts.forEach(e=>{if(!byYr[e.year])byYr[e.year]=[];byYr[e.year].push(e);});
  Object.keys(byYr).sort((a,b)=>a-b).forEach(yr=>{
    const ym=document.createElement('div');ym.className='tl-ym';
    ym.innerHTML=`<div class="tl-ym-l">${yr}</div><div class="tl-ym-d"></div>`;cnt.appendChild(ym);
    byYr[yr].forEach(ev=>{
      const col=DCOL[ev.service]||'#557799';
      const bg=SBGCOL[ev.service]||'c-civ';
      const tags=(ev.tags||[]).map(t=>`<span class="tl-tag ${t}">${tlbl(t)}</span>`).join('');
      const nodes=(ev.nodes||[]).filter(id=>NODES[id]).map(id=>`<span class="tl-nb" data-action="jump-to-node" data-arg="${id}">${nlbl(id)}</span>`).join('');
      const el=document.createElement('div');el.className='tl-ev';
      el.innerHTML=`<div class="tl-ev-dt">${ev.date}</div><div class="tl-ev-dot" style="background:${col};box-shadow:0 0 5px ${col}55"></div><div class="tl-ev-card ${bg}" style="border-left-color:${col}"><div class="tl-ev-type" style="color:${col}">${ev.type} · ${ev.service}</div><div class="tl-ev-title">${ev.title}</div><div class="tl-ev-body">${ev.body}</div>${tags?`<div class="tl-ev-tags">${tags}</div>`:''}${nodes?`<div class="tl-ev-nodes">${nodes}</div>`:''}</div>`;
      cnt.appendChild(el);
    });
  });
  document.getElementById('tb-tl').textContent=evts.length;
}

// ═══════════════════════════════════════════════════════
// MAP — D3 Geo (fully offline, no tile server)
// ═══════════════════════════════════════════════════════
const MAP={svg:null,g:null,proj:null,path:null,zoom:null,ready:false,aorOn:false,topo:null};

const AOR_BOUNDS=[
  {name:'NORTHCOM',coords:[[-170,15],[-50,85]],col:'#3366cc'},
  {name:'SOUTHCOM',coords:[[-90,-60],[-30,15]],col:'#228833'},
  {name:'EUCOM',coords:[[-15,30],[50,75]],col:'#8833cc'},
  {name:'CENTCOM',coords:[[25,-5],[75,50]],col:'#cc8833'},
  {name:'AFRICOM',coords:[[-20,-40],[55,40]],col:'#cc6644'},
  {name:'INDOPACOM',coords:[[35,-55],[180,60]],col:'#3388aa'},
];

function initMap(){
  if(MAP.ready){renderMapLayer();return;}
  const wrap=document.getElementById('map-wrap');
  const W=wrap.clientWidth||800,H=wrap.clientHeight||500;

  MAP.proj=d3.geoNaturalEarth1().translate([W/2,H/2]).scale(W/5.5);
  MAP.path=d3.geoPath().projection(MAP.proj);

  MAP.svg=d3.select('#d3-map').attr('width',W).attr('height',H);
  MAP.g=MAP.svg.append('g');

  // Zoom/pan
  MAP.zoom=d3.zoom().scaleExtent([0.5,20]).on('zoom',e=>{
    MAP.g.attr('transform',e.transform);
  });
  MAP.svg.call(MAP.zoom);

  // World TopoJSON (10m) loaded via script tag
  MAP.topo=WORLD_TOPO;
  const countries=topojson.feature(WORLD_TOPO,WORLD_TOPO.objects.countries);

  // Graticule (lat/lon grid)
  const graticule=d3.geoGraticule().step([30,20]);
  MAP.g.append('path').datum(graticule()).attr('class','graticule').attr('d',MAP.path);

  // Country boundaries (10m detail)
  MAP.g.selectAll('.country').data(countries.features).enter()
    .append('path').attr('class','country').attr('d',MAP.path);

  // US state boundaries (10m detail)
  if(typeof US_STATES_TOPO!=='undefined'){
    const states=topojson.feature(US_STATES_TOPO,US_STATES_TOPO.objects.states);
    MAP.g.selectAll('.us-state').data(states.features).enter()
      .append('path').attr('class','us-state').attr('d',MAP.path);
  }

  // Layer groups for overlays, lines, nodes
  MAP.g.append('g').attr('id','g-aor');
  MAP.g.append('g').attr('id','g-auth-lines');
  MAP.g.append('g').attr('id','g-nodes');

  MAP.ready=true;
  renderMapLayer();
  document.getElementById('tb-map').textContent=Object.keys(NODES).filter(id=>NODES[id].loc).length;
}

function renderMapLayer(){
  if(!MAP.ready)return;
  const svcFilter=document.getElementById('map-svc').value;
  const authFilter=document.getElementById('map-auth').value;
  const aorFilter=document.getElementById('map-aor').value;

  // Filter visible nodes
  const visNodes=Object.values(NODES).filter(n=>{
    if(!n.loc)return false;
    if(svcFilter!=='all'&&n.svc!==svcFilter)return false;
    if(aorFilter!=='all'&&n.loc.aor!==aorFilter)return false;
    return true;
  });

  // --- Authority lines ---
  const gLines=MAP.g.select('#g-auth-lines');
  gLines.selectAll('*').remove();
  if(authFilter!=='none'){
    const drawnLinks=new Set();
    Object.values(VIEWS).forEach(view=>{
      (view.links||[]).forEach(lk=>{
        if(lk.a!==authFilter)return;
        const key=[lk.s,lk.t].sort().join('-');
        if(drawnLinks.has(key))return;
        const src=NODES[lk.s],tgt=NODES[lk.t];
        if(!src||!tgt||!src.loc||!tgt.loc)return;
        if(svcFilter!=='all'&&src.svc!==svcFilter&&tgt.svc!==svcFilter)return;
        drawnLinks.add(key);
        const col=ACOL[lk.a]||'#888';
        const p1=MAP.proj([src.loc.lon,src.loc.lat]),p2=MAP.proj([tgt.loc.lon,tgt.loc.lat]);
        if(!p1||!p2)return;
        const w=lk.a==='cyber'?2.5:lk.a==='ta'?2:1.5;
        const op=lk.a==='cyber'?0.9:lk.a==='ta'?0.85:0.6;
        const dash=lk.a==='adcon'?'6,4':lk.a==='opcon'?'3,3':lk.a==='ta'?'8,3,2,3':lk.a==='cyber'?'4,2':null;
        const line=gLines.append('line').attr('class','auth-line')
          .attr('x1',p1[0]).attr('y1',p1[1]).attr('x2',p2[0]).attr('y2',p2[1])
          .attr('stroke',col).attr('stroke-width',w).attr('stroke-opacity',op);
        if(dash)line.attr('stroke-dasharray',dash);
      });
    });
  }

  // --- Node markers ---
  const gNodes=MAP.g.select('#g-nodes');
  gNodes.selectAll('*').remove();
  const tooltip=document.getElementById('map-tooltip');
  let count=0;

  visNodes.forEach(n=>{
    const pt=MAP.proj([n.loc.lon,n.loc.lat]);
    if(!pt)return;
    const sc=SVC[n.svc]||SVC.civ;
    const isSel=n.id===S.activeNode;
    const r=isSel?8:5;
    const g=gNodes.append('g').attr('class','map-node').attr('transform',`translate(${pt[0]},${pt[1]})`);

    if(isSel){
      g.append('circle').attr('r',r+3).attr('fill','none').attr('stroke',sc.stroke).attr('stroke-width',1).attr('opacity',0.5);
    }
    g.append('circle').attr('r',r).attr('fill',sc.fill).attr('stroke',sc.stroke).attr('stroke-width',isSel?2.5:1.5);

    // Click handler — show tooltip
    g.on('click',function(event){
      event.stopPropagation();
      showMapTooltip(n,event);
    });

    // Hover title
    g.append('title').text(n.lbl);
    count++;
  });

  document.getElementById('map-count').textContent=count+' units plotted';

  // Re-render AOR if active
  if(MAP.aorOn)drawAorOverlay();
}

function showMapTooltip(n,event){
  const tooltip=document.getElementById('map-tooltip');
  const sc=SVC[n.svc]||SVC.civ;
  const auth=AUTH[n.id];
  const aorCol=AOR_COL[n.loc.aor]||'#888';
  const authSummary=auth?`<div style="margin-top:5px;font-size:9px;color:#aaa">
    <div>OPCON: ${auth.opcon&&auth.opcon.length?nlbl(auth.opcon[0])+'...':'N/A'}</div>
    <div>ADCON: ${auth.adcon&&auth.adcon.length?nlbl(auth.adcon[0])+'...':'N/A'}</div>
    <div style="color:${ACOL.ta}">TA: ${auth.ta&&auth.ta.length?auth.ta.map(t=>nlbl(t)).join(', '):'N/A'}</div>
    <div style="color:${ACOL.cyber}">DACO: ${auth.daco&&auth.daco.length?nlbl(auth.daco[0])+'...':'N/A'}</div>
  </div>`:'';
  tooltip.innerHTML=`
    <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:13px;color:${sc.text};margin-bottom:3px">${n.lbl}</div>
    <div style="font-size:9.5px;color:#5a7ea0;margin-bottom:4px">${n.sub}</div>
    <div style="font-family:'Space Mono',monospace;font-size:7.5px;color:#c9a84c">UIC: ${n.uic||'\u2014'} \u00b7 PUC: ${n.puc||'\u2014'}</div>
    <div style="font-family:'Space Mono',monospace;font-size:7.5px;color:#aaa;margin-top:2px">\ud83d\udccd ${n.loc.install}</div>
    <div style="font-family:'Space Mono',monospace;font-size:7.5px;color:#aaa">${n.loc.city}</div>
    <span style="font-family:'Space Mono',monospace;font-size:7px;padding:1px 5px;border-radius:2px;background:${aorCol}22;color:${aorCol};border:1px solid ${aorCol}44;margin-top:3px;display:inline-block">${n.loc.aor}</span>
    ${authSummary}
    <button data-action="jump-to-node" data-arg="${n.id}" style="margin-top:5px;background:#1e3458;border:1px solid #2a4870;color:#7aaaee;font-family:'Space Mono',monospace;font-size:7px;padding:2px 7px;border-radius:2px;cursor:pointer;width:100%">View in Org Chart \u2192</button>`;
  tooltip.classList.add('open');

  // Position near the click, clamped to viewport
  const wrap=document.getElementById('map-wrap');
  const wr=wrap.getBoundingClientRect();
  let x=event.clientX-wr.left+12,y=event.clientY-wr.top-10;
  if(x+260>wr.width)x=x-280;
  if(y+200>wr.height)y=wr.height-210;
  if(y<5)y=5;
  tooltip.style.left=x+'px';tooltip.style.top=y+'px';
}

function closeMapTooltip(){document.getElementById('map-tooltip').classList.remove('open');}

// Close tooltip when clicking on map background
document.addEventListener('click',function(e){
  const tt=document.getElementById('map-tooltip');
  if(tt&&!tt.contains(e.target)&&!e.target.closest('.map-node'))closeMapTooltip();
});

function closeMapPanel(){document.getElementById('map-panel').classList.remove('open');}

function resetMapView(){
  if(!MAP.svg)return;
  MAP.svg.transition().duration(500).call(MAP.zoom.transform,d3.zoomIdentity);
}

function zoomMapToNode(id){
  const n=NODES[id];if(!n||!n.loc||!MAP.ready)return;
  const pt=MAP.proj([n.loc.lon,n.loc.lat]);if(!pt)return;
  const wrap=document.getElementById('map-wrap');
  const W=wrap.clientWidth||800,H=wrap.clientHeight||500;
  const scale=6;
  const tx=W/2-pt[0]*scale,ty=H/2-pt[1]*scale;
  MAP.svg.transition().duration(600).call(MAP.zoom.transform,d3.zoomIdentity.translate(tx,ty).scale(scale));
  S.activeNode=id;
  setTimeout(renderMapLayer,50);
}

function drawAorOverlay(){
  const gAor=MAP.g.select('#g-aor');
  gAor.selectAll('*').remove();
  AOR_BOUNDS.forEach(aor=>{
    // Build a GeoJSON polygon for the bounding box
    const [[x0,y0],[x1,y1]]=aor.coords;
    const geo={type:'Feature',geometry:{type:'Polygon',coordinates:[[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]]}};
    gAor.append('path').datum(geo).attr('d',MAP.path)
      .attr('class','aor-region').attr('fill',aor.col).attr('stroke',aor.col);
    // Label at center
    const center=MAP.proj([(x0+x1)/2,(y0+y1)/2]);
    if(center){
      gAor.append('text').attr('class','aor-label')
        .attr('x',center[0]).attr('y',center[1]).attr('fill',aor.col)
        .attr('text-anchor','middle').text(aor.name);
    }
  });
}

function toggleAorOverlay(){
  if(!MAP.ready)return;
  MAP.aorOn=!MAP.aorOn;
  document.getElementById('btn-aor').classList.toggle('on',MAP.aorOn);
  if(MAP.aorOn){drawAorOverlay();}
  else{MAP.g.select('#g-aor').selectAll('*').remove();}
}

// ═══════════════════════════════════════════════════════
// REGISTRY
// ═══════════════════════════════════════════════════════
function renderRegistry(){
  document.getElementById('tb-reg').textContent=S.docs.length;
  const wrap=document.getElementById('reg-wrap');
  if(!S.docs.length){wrap.innerHTML='<div class="reg-empty">No documents registered yet.<br><br>Use "+ Register Document" to add local files.</div>';return;}
  let h='<table class="reg-tbl"><thead><tr><th>Title / Number</th><th>Type</th><th>Service</th><th>Date</th><th>Affects</th><th></th></tr></thead><tbody>';
  S.docs.forEach(o=>{
    const tc=tclr(o.type);
    const aff=(o.affects||[]).slice(0,3).map(id=>`<span style="font-family:Space Mono,monospace;font-size:7px;padding:1px 3px;border-radius:1px;background:var(--bg3);color:var(--t2)">${nlbl(id)}</span>`).join(' ')+(o.affects&&o.affects.length>3?` +${o.affects.length-3}`:'');
    h+=`<tr><td><div class="rt-title">${o.title}</div><div class="rt-num">${o.number||''}</div></td><td><span style="font-family:Space Mono,monospace;font-size:7px;color:${tc}">${o.type}</span></td><td style="font-family:Space Mono,monospace;font-size:8px;color:var(--t2)">${o.service||''}</td><td style="font-family:Space Mono,monospace;font-size:8px;color:var(--t2)">${o.date||''}</td><td>${aff}</td><td><div class="rt-acts"><button class="rt-btn" data-action="edit-doc" data-arg="${o.id}">Edit</button><button class="rt-btn del" data-action="delete-doc" data-arg="${o.id}">Del</button></div></td></tr>`;
  });
  h+='</tbody></table>';wrap.innerHTML=h;
}
function deleteDoc(id){if(!confirm('Delete?'))return;S.docs=S.docs.filter(d=>d.id!==id);saveDocs();renderRegistry();renderOrdList();}
function editDoc(id){const o=S.docs.find(d=>d.id===id);if(!o)return;S.editId=id;populateModal(o);openModal();}
function openModal(){
  const sel=document.getElementById('f-affects');
  sel.innerHTML=allNodeIds().map(id=>`<option value="${id}">${nlbl(id)} (${id})</option>`).join('');
  document.getElementById('overlay').classList.add('on');
}
function closeModal(){document.getElementById('overlay').classList.remove('on');S.editId=null;clearModal();}
function clearModal(){['f-title','f-number','f-date','f-issuer','f-file','f-summary','f-tags','f-chain','f-refs','f-body'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});}
function populateModal(o){
  document.getElementById('f-title').value=o.title||'';document.getElementById('f-number').value=o.number||'';document.getElementById('f-type').value=o.type||'OPNAVINST';document.getElementById('f-date').value=o.date||'';document.getElementById('f-issuer').value=o.issuer||'';document.getElementById('f-svc').value=o.service||'USN';document.getElementById('f-class').value=o.classification||'UNCLASSIFIED';document.getElementById('f-summary').value=o.summary||'';document.getElementById('f-tags').value=(o.tags||[]).join(', ');document.getElementById('f-body').value=o.body||'';
  const sel=document.getElementById('f-affects');setTimeout(()=>{[...sel.options].forEach(op=>{op.selected=(o.affects||[]).includes(op.value);});},50);
}
function saveDoc(){
  const title=document.getElementById('f-title').value.trim();if(!title){alert('Title required.');return;}
  const sel=document.getElementById('f-affects');
  const doc={id:S.editId||(Date.now().toString(36)),title,number:document.getElementById('f-number').value.trim(),type:document.getElementById('f-type').value,date:document.getElementById('f-date').value,issuer:document.getElementById('f-issuer').value.trim(),service:document.getElementById('f-svc').value,classification:document.getElementById('f-class').value,summary:document.getElementById('f-summary').value.trim(),tags:document.getElementById('f-tags').value.split(',').map(t=>t.trim()).filter(Boolean),affects:[...sel.options].filter(o=>o.selected).map(o=>o.value),chain:document.getElementById('f-chain').value.split(',').map(s=>s.trim()).filter(Boolean),refs:document.getElementById('f-refs').value.split(',').map(s=>s.trim()).filter(Boolean),body:document.getElementById('f-body').value.trim()};
  if(S.editId){S.docs=S.docs.map(d=>d.id===S.editId?doc:d);}else{S.docs.push(doc);}
  saveDocs();closeModal();renderRegistry();renderOrdList();
}

// ═══════════════════════════════════════════════════════
// SEARCH & FOCUS (Phase 2)
// ═══════════════════════════════════════════════════════

// Build search index — which views contain each node
function buildNodeViewIndex(){
  var idx={};
  Object.keys(VIEWS).forEach(function(vk){
    var v=VIEWS[vk];
    if(!v||!v.ids)return;
    v.ids.forEach(function(id){
      if(!idx[id])idx[id]=[];
      idx[id].push(vk);
    });
  });
  return idx;
}
var NODE_VIEW_INDEX=buildNodeViewIndex();

// Preferred view order — NAVAIR-centric audience
var VIEW_PRIORITY=['navair_auth','navy_syscom','ta_view','mals','acq','don','navy_fleet','usmc','cocoms','cyber','strategic'];

function bestViewForNode(id){
  var views=NODE_VIEW_INDEX[id]||[];
  if(!views.length)return null;
  var cur=document.getElementById('oc-view').value;
  if(views.indexOf(cur)>=0)return cur;
  for(var i=0;i<VIEW_PRIORITY.length;i++){
    if(views.indexOf(VIEW_PRIORITY[i])>=0)return VIEW_PRIORITY[i];
  }
  return views[0];
}

function searchNodes(query){
  if(!query||query.length<1)return[];
  var q=query.toLowerCase();
  var results=[];
  var nodeIds=Object.keys(NODES);
  for(var i=0;i<nodeIds.length;i++){
    var id=nodeIds[i];
    var n=NODES[id];
    if(!n)continue;
    var lbl=(n.lbl||'').toLowerCase();
    var sub=(n.sub||'').toLowerCase();
    var lblMatch=lbl.indexOf(q)>=0;
    var subMatch=sub.indexOf(q)>=0;
    var idMatch=id.toLowerCase().indexOf(q)>=0;
    if(lblMatch||subMatch||idMatch){
      var score=(lblMatch?10:0)+(lbl===q?20:0)+(lbl.indexOf(q)===0?5:0)+(subMatch?3:0)+(idMatch?1:0);
      results.push({id:id,node:n,score:score,views:NODE_VIEW_INDEX[id]||[]});
    }
  }
  results.sort(function(a,b){return b.score-a.score;});
  return results.slice(0,12);
}

function highlightMatch(text,query){
  if(!query||!text)return text||'';
  var idx=text.toLowerCase().indexOf(query.toLowerCase());
  if(idx<0)return text;
  return text.substring(0,idx)+'<span class="sr-highlight">'+text.substring(idx,idx+query.length)+'</span>'+text.substring(idx+query.length);
}

function navigateToNode(id){
  var view=bestViewForNode(id);
  if(!view)return;
  var sel=document.getElementById('oc-view');
  if(sel.value!==view){
    sel.value=view;
  }
  S.focusNode=null;
  S.activeNode=id;
  S.highlight=new Set([id]);
  var auth=AUTH[id];
  if(auth){
    var axes=['opcon','adcon','ta','daco','lcsp'];
    for(var i=0;i<axes.length;i++){
      var chain=auth[axes[i]];
      if(chain){for(var j=0;j<chain.length;j++){S.highlight.add(chain[j]);}}
    }
  }
  renderOrg();
  var related=allDocs().filter(function(o){return o.affects&&o.affects.indexOf(id)>=0;});
  openSide(id,related);
  updateBadge();
  document.getElementById('btn-clear').style.display='inline-block';
  setTimeout(function(){
    if(ORG.nodePos[id])centerOnNode(id,1.0,0.4);
  },450);
}

// Make globally accessible for event delegation
window.navigateToNode=navigateToNode;

// Search UI state
const SEARCH={activeIdx:-1,results:[]};

function renderSearchResults(query){
  var container=document.getElementById('search-results');
  if(!container)return;
  if(!SEARCH.results.length){
    if(query&&query.length>=1){
      container.innerHTML='<div class="sr-empty">No commands match "'+query+'"</div>';
      container.classList.add('open');
    }else{
      container.classList.remove('open');
    }
    return;
  }
  var html='';
  for(var i=0;i<SEARCH.results.length;i++){
    var r=SEARCH.results[i];
    var sc=SVC[r.node.svc]||SVC.civ;
    var bv=bestViewForNode(r.id);
    var viewLbl='';
    if(bv&&VIEWS[bv]&&VIEWS[bv].label){
      var parts=VIEWS[bv].label.split('—');
      viewLbl=parts[0].trim();
    }
    html+='<div class="sr-item'+(i===SEARCH.activeIdx?' active':'')+'" data-id="'+r.id+'">';
    html+='<div class="sr-svc" style="background:'+sc.stroke+'"></div>';
    html+='<div class="sr-text">';
    html+='<div class="sr-lbl">'+highlightMatch(r.node.lbl,query)+'</div>';
    html+='<div class="sr-sub">'+highlightMatch(r.node.sub,query)+'</div>';
    html+='</div>';
    if(viewLbl)html+='<div class="sr-view">'+viewLbl+'</div>';
    html+='</div>';
  }
  container.innerHTML=html;
  container.classList.add('open');
}

function updateSearchActive(){
  var items=document.querySelectorAll('.sr-item');
  for(var i=0;i<items.length;i++){
    if(i===SEARCH.activeIdx)items[i].classList.add('active');
    else items[i].classList.remove('active');
  }
  if(SEARCH.activeIdx>=0&&items[SEARCH.activeIdx]){
    items[SEARCH.activeIdx].scrollIntoView({block:'nearest'});
  }
}

function closeSearch(){
  var input=document.getElementById('search-input');
  var results=document.getElementById('search-results');
  if(input)input.value='';
  if(results)results.classList.remove('open');
  SEARCH.results=[];
  SEARCH.activeIdx=-1;
  var kbd=document.getElementById('search-kbd');
  if(kbd)kbd.style.display='block';
}

function initSearch(){
  var input=document.getElementById('search-input');
  var results=document.getElementById('search-results');
  var kbd=document.getElementById('search-kbd');
  if(!input||!results){return;}

  // Input handler
  input.addEventListener('input',function(e){
    var q=input.value.trim();
    SEARCH.results=searchNodes(q);
    SEARCH.activeIdx=-1;
    renderSearchResults(q);
    if(kbd)kbd.style.display=q?'none':'block';
  });

  // Stop clicks inside search from propagating to document close handler
  input.addEventListener('click',function(e){
    e.stopPropagation();
  });
  results.addEventListener('click',function(e){
    e.stopPropagation();
  });

  // Keyboard navigation
  input.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){
      e.preventDefault();
      SEARCH.activeIdx=Math.min(SEARCH.activeIdx+1,SEARCH.results.length-1);
      updateSearchActive();
    }else if(e.key==='ArrowUp'){
      e.preventDefault();
      SEARCH.activeIdx=Math.max(SEARCH.activeIdx-1,-1);
      updateSearchActive();
    }else if(e.key==='Enter'){
      e.preventDefault();
      if(SEARCH.activeIdx>=0&&SEARCH.results[SEARCH.activeIdx]){
        var id=SEARCH.results[SEARCH.activeIdx].id;
        closeSearch();
        navigateToNode(id);
      }else if(SEARCH.results.length===1){
        var id=SEARCH.results[0].id;
        closeSearch();
        navigateToNode(id);
      }
    }else if(e.key==='Escape'){
      closeSearch();
      input.blur();
    }
  });

  // Event delegation for clicking search results (instead of inline handlers)
  results.addEventListener('mousedown',function(e){
    var item=e.target.closest('.sr-item');
    if(item&&item.dataset.id){
      e.preventDefault();
      e.stopPropagation();
      var id=item.dataset.id;
      closeSearch();
      navigateToNode(id);
    }
  });

  // Reshow results on focus
  input.addEventListener('focus',function(){
    if(SEARCH.results.length)results.classList.add('open');
  });

  // Close on outside click
  document.addEventListener('click',function(e){
    if(!e.target.closest('.search-wrap')){
      results.classList.remove('open');
    }
  });

  // Keyboard shortcut: / to open search
  document.addEventListener('keydown',function(e){
    if(e.key==='/'&&document.activeElement!==input&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'&&document.activeElement.tagName!=='SELECT'){
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
}

// ═══════════════════════════════════════════════════════
// COMMAND EDITOR (Phase 4)
// ═══════════════════════════════════════════════════════
var ceEditId=null; // null = add mode, string = edit mode

function openCommandEditor(editId){
  ceEditId=editId||null;
  document.getElementById('ce-title').textContent=ceEditId?'Edit Command':'Add Command';
  document.getElementById('ce-del-btn').style.display=ceEditId?'inline-block':'none';
  if(ceEditId){
    var n=NODES[ceEditId];
    if(!n)return;
    document.getElementById('ce-id').value=ceEditId;
    document.getElementById('ce-id').disabled=true;
    document.getElementById('ce-lbl').value=n.lbl||'';
    document.getElementById('ce-sub').value=n.sub||'';
    document.getElementById('ce-svc').value=n.svc||'navy';
    document.getElementById('ce-billet').value=n.billet||'';
    document.getElementById('ce-uic').value=n.uic||'';
    document.getElementById('ce-puc').value=n.puc||'';
    document.getElementById('ce-logo').value=n.logo||'';
    document.getElementById('ce-maint').value=n.maint||'';
    document.getElementById('ce-dh').value=(n.dh&&n.dh[0])||'';
    if(n.loc){
      document.getElementById('ce-install').value=n.loc.install||'';
      document.getElementById('ce-city').value=n.loc.city||'';
      document.getElementById('ce-lat').value=n.loc.lat||'';
      document.getElementById('ce-lon').value=n.loc.lon||'';
      document.getElementById('ce-aor').value=n.loc.aor||'GLOBAL';
    }
    var auth=AUTH[ceEditId]||{};
    document.getElementById('ce-opcon').value=(auth.opcon||[]).join(',');
    document.getElementById('ce-adcon').value=(auth.adcon||[]).join(',');
    document.getElementById('ce-ta').value=(auth.ta||[]).join(',');
    document.getElementById('ce-daco').value=(auth.daco||[]).join(',');
    document.getElementById('ce-lcsp').value=(auth.lcsp||[]).join(',');
    document.getElementById('ce-note').value=auth.note||'';
  }else{
    clearCommandEditor();
    document.getElementById('ce-id').disabled=false;
  }
  document.getElementById('ce-overlay').classList.add('on');
}

function clearCommandEditor(){
  var fields=['ce-id','ce-lbl','ce-sub','ce-billet','ce-uic','ce-puc','ce-logo','ce-install','ce-city','ce-lat','ce-lon','ce-dh','ce-opcon','ce-adcon','ce-ta','ce-daco','ce-lcsp','ce-note'];
  fields.forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('ce-svc').value='navy';
  document.getElementById('ce-maint').value='';
  document.getElementById('ce-aor').value='GLOBAL';
}

function closeCommandEditor(){
  document.getElementById('ce-overlay').classList.remove('on');
  ceEditId=null;
  clearCommandEditor();
}

function parseChain(val){
  if(!val)return[];
  return val.split(',').map(function(s){return s.trim();}).filter(function(s){return s.length>0;});
}

function saveCommand(){
  var id=document.getElementById('ce-id').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
  var lbl=document.getElementById('ce-lbl').value.trim();
  var sub=document.getElementById('ce-sub').value.trim();
  var svc=document.getElementById('ce-svc').value;
  if(!id){alert('Command ID is required.');return;}
  if(!lbl){alert('Display Label is required.');return;}
  if(!sub){alert('Full Name is required.');return;}
  if(!ceEditId&&NODES[id]){alert('Command ID "'+id+'" already exists. Choose a unique ID.');return;}
  var nodeId=ceEditId||id;
  var node={
    id:nodeId,
    lbl:lbl,
    sub:sub,
    svc:svc,
    billet:document.getElementById('ce-billet').value.trim()||undefined,
    uic:document.getElementById('ce-uic').value.trim()||undefined,
    puc:document.getElementById('ce-puc').value.trim()||undefined,
    logo:document.getElementById('ce-logo').value.trim()||undefined,
    maint:document.getElementById('ce-maint').value||undefined
  };
  var dh=document.getElementById('ce-dh').value.trim();
  if(dh)node.dh=[dh];
  var install=document.getElementById('ce-install').value.trim();
  var city=document.getElementById('ce-city').value.trim();
  var lat=parseFloat(document.getElementById('ce-lat').value);
  var lon=parseFloat(document.getElementById('ce-lon').value);
  if(install||city||(lat&&lon)){
    node.loc={install:install,city:city,lat:lat||0,lon:lon||0,aor:document.getElementById('ce-aor').value};
  }
  NODES[nodeId]=node;
  var opcon=parseChain(document.getElementById('ce-opcon').value);
  var adcon=parseChain(document.getElementById('ce-adcon').value);
  var ta=parseChain(document.getElementById('ce-ta').value);
  var daco=parseChain(document.getElementById('ce-daco').value);
  var lcsp=parseChain(document.getElementById('ce-lcsp').value);
  var note=document.getElementById('ce-note').value.trim();
  if(opcon.length||adcon.length||ta.length||daco.length||lcsp.length||note){
    AUTH[nodeId]={opcon:opcon,adcon:adcon,ta:ta,daco:daco,lcsp:lcsp,note:note||undefined};
  }
  closeCommandEditor();
  if(document.getElementById('p-org').classList.contains('on'))renderOrg();
  if(document.getElementById('p-accuracy').classList.contains('on'))runValidation();
  NODE_VIEW_INDEX=buildNodeViewIndex();
}

function deleteCommand(){
  if(!ceEditId)return;
  if(!confirm('Delete command "'+(ceEditId)+'"? This cannot be undone.'))return;
  delete NODES[ceEditId];
  delete AUTH[ceEditId];
  Object.keys(VIEWS).forEach(function(vk){
    var v=VIEWS[vk];
    if(v.ids){v.ids=v.ids.filter(function(id){return id!==ceEditId;});}
    if(v.links){v.links=v.links.filter(function(lk){return lk.s!==ceEditId&&lk.t!==ceEditId;});}
    if(v.pos)delete v.pos[ceEditId];
  });
  closeCommandEditor();
  closeSide();
  renderOrg();
  NODE_VIEW_INDEX=buildNodeViewIndex();
}

// Add "Edit Command" to side panel — inject button into openSide
var origOpenSide=openSide;
openSide=function(id,related){
  origOpenSide(id,related);
  var sideBody=document.getElementById('side-body');
  if(sideBody&&NODES[id]){
    var editBtn=document.createElement('button');
    editBtn.className='btn btn-p';
    editBtn.style.cssText='width:100%;margin-top:8px;font-size:9px';
    editBtn.textContent='✎ Edit Command';
    editBtn.dataset.action='open-cmd-editor';editBtn.dataset.arg=id;
    sideBody.appendChild(editBtn);
  }
};

// ═══════════════════════════════════════════════════════
// DATA ACCURACY — Validation Engine (Phase 4)
// ═══════════════════════════════════════════════════════
function runValidation(){
  var findings=[];
  var nodeIds=Object.keys(NODES);
  var viewNodeSet=new Set();
  Object.values(VIEWS).forEach(function(v){
    if(v.ids)v.ids.forEach(function(id){viewNodeSet.add(id);});
  });
  // Rule 1: Nodes with no AUTH entry
  nodeIds.forEach(function(id){
    if(!AUTH[id]){
      findings.push({sev:'warning',node:id,rule:'NO_AUTH',msg:'No authority matrix entry. Click Edit Command to add OPCON/ADCON/TA/DACO chains.'});
    }
  });
  // Rule 2: Nodes in zero views
  nodeIds.forEach(function(id){
    if(!viewNodeSet.has(id)){
      findings.push({sev:'info',node:id,rule:'NO_VIEW',msg:'Not displayed in any org chart view.'});
    }
  });
  // Rule 3: AUTH references nonexistent nodes
  Object.keys(AUTH).forEach(function(id){
    var auth=AUTH[id];
    if(!NODES[id]){
      findings.push({sev:'error',node:id,rule:'ORPHAN_AUTH',msg:'AUTH entry exists but no matching node in NODES.'});
      return;
    }
    var chains=['opcon','adcon','ta','daco','lcsp'];
    chains.forEach(function(ax){
      var chain=auth[ax];
      if(!chain)return;
      chain.forEach(function(nid){
        if(!NODES[nid]){
          findings.push({sev:'error',node:id,rule:'BROKEN_REF',msg:ax.toUpperCase()+' chain references "'+nid+'" which does not exist in NODES.'});
        }
      });
    });
  });
  // Rule 4: View links reference nodes not in view's ids
  Object.keys(VIEWS).forEach(function(vk){
    var v=VIEWS[vk];
    if(!v.links||!v.ids)return;
    var idSet=new Set(v.ids);
    v.links.forEach(function(lk){
      if(!idSet.has(lk.s)){
        findings.push({sev:'error',node:lk.s,rule:'VIEW_LINK',msg:'Link source in view "'+vk+'" but node not in view ids array.'});
      }
      if(!idSet.has(lk.t)){
        findings.push({sev:'error',node:lk.t,rule:'VIEW_LINK',msg:'Link target in view "'+vk+'" but node not in view ids array.'});
      }
    });
  });
  // Rule 5: Documents with affects referencing nonexistent nodes
  BUILTIN.forEach(function(doc){
    if(!doc.affects)return;
    doc.affects.forEach(function(id){
      if(!NODES[id]){
        findings.push({sev:'warning',node:id,rule:'DOC_REF',msg:'Document "'+doc.number+'" affects "'+id+'" which does not exist.'});
      }
    });
  });
  // Rule 6: Nodes missing location data
  nodeIds.forEach(function(id){
    if(!NODES[id].loc&&viewNodeSet.has(id)){
      findings.push({sev:'info',node:id,rule:'NO_LOC',msg:'No geolocation data. Will not appear on Geo Map.'});
    }
  });
  // Rule 7: AUTH entry with all empty chains
  Object.keys(AUTH).forEach(function(id){
    var a=AUTH[id];
    if(NODES[id]&&(!a.opcon||!a.opcon.length)&&(!a.adcon||!a.adcon.length)&&(!a.ta||!a.ta.length)&&(!a.daco||!a.daco.length)&&(!a.lcsp||!a.lcsp.length)&&!a.note){
      findings.push({sev:'info',node:id,rule:'EMPTY_AUTH',msg:'AUTH entry exists but all chains are empty.'});
    }
  });
  // Sort: errors first, then warnings, then info
  var sevOrder={error:0,warning:1,info:2};
  findings.sort(function(a,b){return(sevOrder[a.sev]||3)-(sevOrder[b.sev]||3);});
  renderAccuracy(findings);
}

function renderAccuracy(findings){
  var errCount=0,warnCount=0,infoCount=0;
  findings.forEach(function(f){
    if(f.sev==='error')errCount++;
    else if(f.sev==='warning')warnCount++;
    else infoCount++;
  });
  var stats=document.getElementById('acc-stats');
  stats.innerHTML='';
  if(errCount)stats.innerHTML+='<span class="acc-stat acc-stat-err">'+errCount+' Errors</span>';
  if(warnCount)stats.innerHTML+='<span class="acc-stat acc-stat-warn">'+warnCount+' Warnings</span>';
  if(infoCount)stats.innerHTML+='<span class="acc-stat acc-stat-info">'+infoCount+' Info</span>';
  if(!findings.length)stats.innerHTML='<span class="acc-stat acc-stat-ok">✓ All Checks Passed</span>';
  document.getElementById('tb-acc').textContent=errCount+warnCount;
  var body=document.getElementById('acc-body');
  if(!findings.length){
    body.innerHTML='<div style="text-align:center;padding:40px;color:var(--t3);font-family:Space Mono,monospace;font-size:11px">✓ No data integrity issues found.<br><br>'+Object.keys(NODES).length+' nodes · '+Object.keys(AUTH).length+' AUTH entries · '+Object.keys(VIEWS).length+' views · '+BUILTIN.length+' documents</div>';
    return;
  }
  var html='<table class="acc-tbl"><thead><tr><th>Severity</th><th>Node</th><th>Rule</th><th>Details</th><th></th></tr></thead><tbody>';
  findings.forEach(function(f){
    var sevCls=f.sev==='error'?'sev-error':f.sev==='warning'?'sev-warning':'sev-info';
    var nodeLabel=NODES[f.node]?NODES[f.node].lbl:f.node;
    html+='<tr>';
    html+='<td><span class="acc-sev '+sevCls+'">'+f.sev.toUpperCase()+'</span></td>';
    html+='<td><span class="acc-node" data-action="navigate-node" data-arg="'+f.node+'">'+nodeLabel+'</span></td>';
    html+='<td style="font-family:Space Mono,monospace;font-size:8px;color:var(--t2)">'+f.rule+'</td>';
    html+='<td class="acc-msg">'+f.msg+'</td>';
    html+='<td>';
    if(NODES[f.node])html+='<button class="btn btn-s" style="font-size:7px;padding:2px 6px" data-action="open-cmd-editor" data-arg="'+f.node+'">Edit</button>';
    html+='</td>';
    html+='</tr>';
  });
  html+='</tbody></table>';
  body.innerHTML=html;
}

// ═══════════════════════════════════════════════════════
// BUILD-A-CHART — Custom Chart Mode (Phase 5)
// ═══════════════════════════════════════════════════════
const CUSTOM={
  roots:[],           // Node IDs explicitly added by user
  nodes:new Set(),    // All nodes currently visible (roots + chain expansions)
  links:[],           // Links to draw
  auth:{adcon:true,opcon:false,cocom:false,ta:false,cyber:false,lcsp:false},
  addResults:[],
  addIdx:-1
};

function isCustomMode(){
  return document.getElementById('oc-view').value==='custom';
}

function toggleCustomAuth(el){
  var auth=el.dataset.auth;
  CUSTOM.auth[auth]=!CUSTOM.auth[auth];
  el.classList.toggle('on',CUSTOM.auth[auth]);
  rebuildCustomChart();
}

function addToCustomChart(id){
  if(!NODES[id])return;
  if(CUSTOM.roots.indexOf(id)<0)CUSTOM.roots.push(id);
  rebuildCustomChart();
  // Clear the add input
  var input=document.getElementById('cc-add');
  if(input)input.value='';
  var results=document.getElementById('cc-add-results');
  if(results)results.classList.remove('open');
  CUSTOM.addResults=[];
  CUSTOM.addIdx=-1;
}

function removeFromCustomChart(id){
  CUSTOM.roots=CUSTOM.roots.filter(function(r){return r!==id;});
  rebuildCustomChart();
}

function clearCustomChart(){
  CUSTOM.roots=[];
  CUSTOM.nodes=new Set();
  CUSTOM.links=[];
  rebuildCustomChart();
}

function rebuildCustomChart(){
  CUSTOM.nodes=new Set();
  CUSTOM.links=[];
  // For each root, expand active authority chains from AUTH
  CUSTOM.roots.forEach(function(rootId){
    CUSTOM.nodes.add(rootId);
    var auth=AUTH[rootId];
    if(!auth)return;
    Object.keys(CUSTOM.auth).forEach(function(ax){
      if(!CUSTOM.auth[ax])return;
      var chain=auth[ax];
      if(!chain||!chain.length)return;
      chain.forEach(function(nid){
        if(NODES[nid])CUSTOM.nodes.add(nid);
      });
      // Build links: chain represents the authority path
      // The chain is ordered superior → subordinate, with rootId at the bottom
      // Draw links between consecutive chain members and from last chain member to root
      for(var i=0;i<chain.length-1;i++){
        if(NODES[chain[i]]&&NODES[chain[i+1]]){
          CUSTOM.links.push({s:chain[i],t:chain[i+1],a:ax});
        }
      }
      // Link from last chain node to the root
      if(chain.length>0&&NODES[chain[chain.length-1]]){
        CUSTOM.links.push({s:chain[chain.length-1],t:rootId,a:ax});
      }
    });
  });
  // Deduplicate links
  var seen={};
  CUSTOM.links=CUSTOM.links.filter(function(lk){
    var key=lk.s+'|'+lk.t+'|'+lk.a;
    if(seen[key])return false;
    seen[key]=true;
    return true;
  });
  document.getElementById('cc-count').textContent=CUSTOM.nodes.size+' nodes';
  renderOrg();
}

function layoutCustomChart(nodeIds,links,W,H){
  // Build adjacency: find hierarchy levels via BFS from nodes with no incoming edges
  var incoming={};
  var outgoing={};
  nodeIds.forEach(function(id){incoming[id]=[];outgoing[id]=[];});
  links.forEach(function(lk){
    if(nodeIds.indexOf(lk.s)>=0&&nodeIds.indexOf(lk.t)>=0){
      if(!outgoing[lk.s])outgoing[lk.s]=[];
      outgoing[lk.s].push(lk.t);
      if(!incoming[lk.t])incoming[lk.t]=[];
      incoming[lk.t].push(lk.s);
    }
  });
  // Find roots — nodes with no incoming
  var roots=nodeIds.filter(function(id){return !incoming[id]||incoming[id].length===0;});
  if(!roots.length)roots=[nodeIds[0]]; // fallback
  // BFS to assign depth levels
  var depth={};
  var visited=new Set();
  var queue=[];
  roots.forEach(function(r){depth[r]=0;visited.add(r);queue.push(r);});
  while(queue.length){
    var cur=queue.shift();
    var children=outgoing[cur]||[];
    children.forEach(function(ch){
      if(!visited.has(ch)){
        visited.add(ch);
        depth[ch]=(depth[cur]||0)+1;
        queue.push(ch);
      }
    });
  }
  // Assign unvisited nodes (disconnected) to depth 0
  nodeIds.forEach(function(id){if(depth[id]===undefined)depth[id]=0;});
  // Group by depth
  var levels={};
  var maxDepth=0;
  nodeIds.forEach(function(id){
    var d=depth[id];
    if(!levels[d])levels[d]=[];
    levels[d].push(id);
    if(d>maxDepth)maxDepth=d;
  });
  // Position: spread each level horizontally, levels cascade vertically
  var posMap={};
  var VGAP=NH+60;
  var HGAP=NW+30;
  for(var d=0;d<=maxDepth;d++){
    var row=levels[d]||[];
    var totalW=row.length*HGAP;
    var startX=(W-totalW)/2;
    row.forEach(function(id,i){
      posMap[id]={x:startX+i*HGAP, y:40+d*VGAP};
    });
  }
  return posMap;
}

function renderCustomChart(svg,W,H){
  var G=svg.append('g');
  setupDefs(svg);
  if(!CUSTOM.nodes.size){
    // Empty state
    G.append('foreignObject').attr('x',0).attr('y',0).attr('width',W).attr('height',H)
      .append('xhtml:div').attr('class','cc-empty')
      .html('<div class="cc-empty-title">Build-a-Chart</div><div class="cc-empty-sub">Use the "Add a command" field above to place units on the canvas.<br>Toggle authority types (ADCON, OPCON, TA, DACO) to draw chains.<br>Add multiple commands to see how authorities converge.</div>');
    return;
  }
  var nodeIds=[];
  CUSTOM.nodes.forEach(function(id){nodeIds.push(id);});
  var posMap=layoutCustomChart(nodeIds,CUSTOM.links,W,H);
  ORG.nodePos={};
  nodeIds.forEach(function(id){ORG.nodePos[id]=posMap[id];});
  // Draw links
  drawLinks(G,CUSTOM.links,posMap,'all',new Set(),false);
  // Draw nodes
  var nodes=nodeIds.map(function(id){
    var n=NODES[id];
    if(!n)return null;
    return Object.assign({},n,{x:posMap[id].x,y:posMap[id].y});
  }).filter(Boolean);
  drawNodes(G,nodes,posMap,S.activeNode,new Set(CUSTOM.roots),false);
  // Add remove buttons on root nodes
  CUSTOM.roots.forEach(function(rootId){
    if(!posMap[rootId])return;
    var p=posMap[rootId];
    G.append('circle').attr('cx',p.x+NW-3).attr('cy',p.y+3).attr('r',7)
      .attr('fill','#220000').attr('stroke','#aa3333').attr('stroke-width',1).attr('cursor','pointer')
      .on('click',function(e){e.stopPropagation();removeFromCustomChart(rootId);});
    G.append('text').attr('x',p.x+NW-3).attr('y',p.y+6.5).attr('text-anchor','middle')
      .attr('font-family','sans-serif').attr('font-size',10).attr('fill','#ee5555')
      .attr('cursor','pointer').attr('pointer-events','none').text('×');
  });
  // Setup zoom
  ORG.zb=d3.zoom().scaleExtent([.12,4]).on('zoom',function(e){G.attr('transform',e.transform);});
  svg.call(ORG.zb);
  requestAnimationFrame(function(){fitAllNodes(300);});
}

// PNG Export via SVG serialization
function exportCustomPNG(){
  var svgEl=document.getElementById('oc-svg');
  if(!svgEl)return;
  // Clone SVG and inline styles for standalone rendering
  var clone=svgEl.cloneNode(true);
  clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
  // Get current viewBox from transform
  var gEl=svgEl.querySelector('g');
  var transform=gEl?gEl.getAttribute('transform'):'';
  // Set explicit dimensions
  var w=svgEl.clientWidth||1200;
  var h=svgEl.clientHeight||800;
  clone.setAttribute('width',w*2);
  clone.setAttribute('height',h*2);
  clone.setAttribute('viewBox','0 0 '+w+' '+h);
  // Add dark background rect
  var bg=document.createElementNS('http://www.w3.org/2000/svg','rect');
  bg.setAttribute('width','100%');
  bg.setAttribute('height','100%');
  bg.setAttribute('fill','#05080f');
  clone.insertBefore(bg,clone.firstChild);
  // Add classification banner
  var clf=document.createElementNS('http://www.w3.org/2000/svg','text');
  clf.setAttribute('x',w/2);
  clf.setAttribute('y',16);
  clf.setAttribute('text-anchor','middle');
  clf.setAttribute('font-family','monospace');
  clf.setAttribute('font-size','10');
  clf.setAttribute('fill','#44ee44');
  clf.textContent='UNCLASSIFIED // NOTIONAL — FOR TRAINING AND DEMONSTRATION PURPOSES ONLY';
  clone.appendChild(clf);
  // Serialize
  var serializer=new XMLSerializer();
  var svgString=serializer.serializeToString(clone);
  var svgBlob=new Blob([svgString],{type:'image/svg+xml;charset=utf-8'});
  var url=URL.createObjectURL(svgBlob);
  var img=new Image();
  img.onload=function(){
    var canvas=document.createElement('canvas');
    canvas.width=w*2;
    canvas.height=h*2;
    var ctx=canvas.getContext('2d');
    ctx.fillStyle='#05080f';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0);
    URL.revokeObjectURL(url);
    canvas.toBlob(function(blob){
      var a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      var ts=new Date().toISOString().replace(/[:.]/g,'-').substring(0,19);
      a.download='KMS-Custom-Chart-'+ts+'.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },'image/png');
  };
  img.src=url;
}

// Custom chart search-to-add
function initCustomChartSearch(){
  var input=document.getElementById('cc-add');
  var results=document.getElementById('cc-add-results');
  if(!input||!results)return;
  input.addEventListener('input',function(){
    var q=input.value.trim();
    CUSTOM.addResults=searchNodes(q);
    CUSTOM.addIdx=-1;
    renderCCAddResults(q);
  });
  input.addEventListener('click',function(e){e.stopPropagation();});
  results.addEventListener('click',function(e){e.stopPropagation();});
  input.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){
      e.preventDefault();
      CUSTOM.addIdx=Math.min(CUSTOM.addIdx+1,CUSTOM.addResults.length-1);
      updateCCAddActive();
    }else if(e.key==='ArrowUp'){
      e.preventDefault();
      CUSTOM.addIdx=Math.max(CUSTOM.addIdx-1,-1);
      updateCCAddActive();
    }else if(e.key==='Enter'){
      e.preventDefault();
      if(CUSTOM.addIdx>=0&&CUSTOM.addResults[CUSTOM.addIdx]){
        addToCustomChart(CUSTOM.addResults[CUSTOM.addIdx].id);
      }else if(CUSTOM.addResults.length===1){
        addToCustomChart(CUSTOM.addResults[0].id);
      }
    }else if(e.key==='Escape'){
      input.value='';
      results.classList.remove('open');
      CUSTOM.addResults=[];
      CUSTOM.addIdx=-1;
    }
  });
  results.addEventListener('mousedown',function(e){
    var item=e.target.closest('.sr-item');
    if(item&&item.dataset.id){
      e.preventDefault();
      e.stopPropagation();
      addToCustomChart(item.dataset.id);
    }
  });
  input.addEventListener('focus',function(){
    if(CUSTOM.addResults.length)results.classList.add('open');
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest('.cc-add-wrap'))results.classList.remove('open');
  });
}

function renderCCAddResults(query){
  var container=document.getElementById('cc-add-results');
  if(!CUSTOM.addResults.length){
    if(query&&query.length>=1){
      container.innerHTML='<div class="sr-empty">No commands match "'+query+'"</div>';
      container.classList.add('open');
    }else{
      container.classList.remove('open');
    }
    return;
  }
  var html='';
  for(var i=0;i<CUSTOM.addResults.length;i++){
    var r=CUSTOM.addResults[i];
    var sc=SVC[r.node.svc]||SVC.civ;
    var already=CUSTOM.roots.indexOf(r.id)>=0;
    html+='<div class="sr-item'+(i===CUSTOM.addIdx?' active':'')+(already?' dimmed':'')+'" data-id="'+r.id+'">';
    html+='<div class="sr-svc" style="background:'+sc.stroke+'"></div>';
    html+='<div class="sr-text">';
    html+='<div class="sr-lbl">'+highlightMatch(r.node.lbl,query)+(already?' <span style="font-size:7px;color:var(--t3)">(added)</span>':'')+'</div>';
    html+='<div class="sr-sub">'+highlightMatch(r.node.sub,query)+'</div>';
    html+='</div></div>';
  }
  container.innerHTML=html;
  container.classList.add('open');
}

function updateCCAddActive(){
  var items=document.querySelectorAll('#cc-add-results .sr-item');
  for(var i=0;i<items.length;i++){
    if(i===CUSTOM.addIdx)items[i].classList.add('active');
    else items[i].classList.remove('active');
  }
  if(CUSTOM.addIdx>=0&&items[CUSTOM.addIdx])items[CUSTOM.addIdx].scrollIntoView({block:'nearest'});
}

// ═══════════════════════════════════════════════════════
// DATA EXPORT (Phase 4)
// ═══════════════════════════════════════════════════════
function exportData(){
  var exportObj={
    version:KMS_DATA.version||'7.0',
    lastModified:new Date().toISOString().split('T')[0],
    config:KMS_DATA.config,
    nodes:{},
    auth:{},
    views:VIEWS,
    documents:BUILTIN,
    timeline:TL
  };
  // Clean nodes — remove internal 'id' field added at runtime
  Object.keys(NODES).forEach(function(k){
    var n=Object.assign({},NODES[k]);
    delete n.id;
    exportObj.nodes[k]=n;
  });
  // Copy auth
  Object.keys(AUTH).forEach(function(k){
    exportObj.auth[k]=AUTH[k];
  });
  var jsonStr=JSON.stringify(exportObj,null,1);
  var jsContent='// DoN C2 KMS — Organizational Data v7.0\n// Edit this file to update command structure. Do not modify the first or last line.\nconst KMS_DATA = '+jsonStr+';\n';
  var blob=new Blob([jsContent],{type:'application/javascript'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;
  a.download='kms-data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
load();
document.getElementById('tb-orders').textContent=BUILTIN.length;
document.getElementById('tb-tl').textContent=TL.length;
document.getElementById('tb-reg').textContent=S.docs.length;
document.getElementById('tb-map').textContent=Object.keys(NODES).filter(id=>NODES[id].loc).length;
window.addEventListener('load',function(){setTimeout(renderOrg,100);initSearch();initCustomChartSearch();initEvents();});
window.addEventListener('resize',function(){
  if(document.getElementById('p-org').classList.contains('on'))renderOrg();
  if(document.getElementById('p-map').classList.contains('on')&&MAP.ready){
    const wrap=document.getElementById('map-wrap');
    const W=wrap.clientWidth||800,H=wrap.clientHeight||500;
    MAP.proj.translate([W/2,H/2]).scale(W/5.5);
    MAP.path.projection(MAP.proj);
    d3.select('#d3-map').attr('width',W).attr('height',H);
    MAP.g.selectAll('.country').attr('d',MAP.path);
    MAP.g.selectAll('.us-state').attr('d',MAP.path);
    MAP.g.selectAll('.graticule').attr('d',MAP.path);
    renderMapLayer();
  }
});

// ═══════════════════════════════════════════════════════
// EVENT DELEGATION
// ═══════════════════════════════════════════════════════
function initEvents(){
  // Click delegation — handles data-action attributes
  document.body.addEventListener('click',function(e){
    const el=e.target.closest('[data-action]');
    if(!el)return;
    const action=el.dataset.action;
    const arg=el.dataset.arg||'';

    switch(action){
      // Navigation
      case 'show-panel':     showPanel(arg);break;
      case 'show-ta':        showPanel('org');document.getElementById('oc-view').value='ta_view';renderOrg();break;
      case 'show-daco':      showPanel('org');document.getElementById('oc-view').value='cyber';renderOrg();break;
      // Org chart
      case 'clear-filter':   clearFilter();break;
      case 'close-side':     closeSide();break;
      case 'jump-to-node':   jumpToNode(arg);closeMapTooltip();break;
      case 'jump-to-map':    jumpToMap(arg);break;
      case 'select-node':    selectNode(arg);break;
      case 'pick-logo':      pickLogo(arg);break;
      case 'select-order':   showPanel('orders');setTimeout(()=>selectOrder(arg),80);break;
      // Custom chart
      case 'toggle-auth':    toggleCustomAuth(el);break;
      case 'clear-custom':   clearCustomChart();break;
      case 'export-png':     exportCustomPNG();break;
      case 'add-custom':     addToCustomChart(arg);break;
      case 'remove-custom':  removeFromCustomChart(arg);break;
      // Map
      case 'toggle-aor':     toggleAorOverlay();break;
      case 'reset-map':      resetMapView();break;
      case 'close-map-panel':closeMapPanel();break;
      case 'close-tooltip':  closeMapTooltip();break;
      // Registry & Modals
      case 'open-modal':     openModal();break;
      case 'close-modal':    closeModal();break;
      case 'save-doc':       saveDoc();break;
      case 'edit-doc':       editDoc(arg);break;
      case 'delete-doc':     deleteDoc(arg);break;
      // Command Editor
      case 'open-cmd-editor':openCommandEditor(arg||undefined);break;
      case 'close-cmd-editor':closeCommandEditor();break;
      case 'save-command':   saveCommand();break;
      case 'delete-command': deleteCommand();break;
      // Accuracy & Data
      case 'run-validation': runValidation();break;
      case 'export-data':    exportData();break;
      case 'navigate-node':  navigateToNode(arg);break;
    }
  });

  // Change delegation — handles data-change attributes on selects
  document.body.addEventListener('change',function(e){
    const el=e.target.closest('[data-change]');
    if(!el)return;
    const action=el.dataset.change;

    switch(action){
      case 'render-org':     renderOrg();break;
      case 'render-map':     renderMapLayer();break;
      case 'render-timeline':renderTimeline();break;
    }
  });
}
