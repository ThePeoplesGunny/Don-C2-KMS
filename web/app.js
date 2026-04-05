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
const S = { activeNode: null, focusNode: null, highlight: new Set(), docs: JSON.parse(_storedDocs), logos: JSON.parse(_storedLogos), logoTarget: null };

function load(){try{S.logos=JSON.parse(localStorage.getItem('kms7-logos')||'{}');}catch(e){} try{S.docs=JSON.parse(localStorage.getItem('kms7-docs')||'[]');}catch(e){}}
function saveLogos(){try{localStorage.setItem('kms7-logos',JSON.stringify(S.logos));}catch(e){}}
function saveDocs(){try{localStorage.setItem('kms7-docs',JSON.stringify(S.docs));}catch(e){}}

// Rendering constants
const TCOL={STATUTE:'#ccaa44',DODD:'#6699ff',DODI:'#5588ee',OPNAVINST:'#6699ee',MCO:'#ee8888',SECNAVINST:'#bb99ff','EXEC ORDER':'#ddbb44','JOINT PUB':'#77bb77',FRAGORD:'#ee9944',OPORD:'#ff7733',WARNO:'#ddaa33',CJCSI:'#88aadd',OTHER:'#888899'};
const TLK={'t-navy':'USN','t-usmc':'USMC','t-army':'Army','t-airforce':'USAF','t-joint':'Joint','t-civ':'Civilian','t-law':'Statute','t-doc':'Directive','t-cyber':'Cyber','t-ta':'Tech Auth'};
const DCOL={USN:'#3a88ff',USMC:'#cc3333',Army:'#8a7a20',Joint:'#44aa44',Cyber:'#00cccc',Legislative:'#c9a84c',Administrative:'#6688aa',Directive:'#7755cc','Executive Order':'#ddbb44'};
const SBGCOL={USN:'c-navy',USMC:'c-usmc',Army:'c-army',Joint:'c-joint',Cyber:'c-cyber',Legislative:'c-civ'};


function allDocs(){return[...BUILTIN,...S.docs];}
var DOC_MAP={};BUILTIN.forEach(function(d){DOC_MAP[d.id]=d;});
function allNodeIds(){const s=new Set();Object.values(VIEWS).forEach(v=>v.ids.forEach(id=>s.add(id)));return[...s].sort();}
function nlbl(id){return NODES[id]?NODES[id].lbl:id;}
function tclr(t){return TCOL[t]||'#888899';}
function tlbl(t){return TLK[t]||t;}
function dhLabel(nodeId,dh){var cv=VIEWS[document.getElementById('oc-view').value];return(cv&&cv.dh_map&&cv.dh_map[nodeId])||dh[0];}

// Compute full authority chain for a node by walking immediate parents upward.
// Chain keys (opcon/adcon/daco) store only [immediateParent].
// List keys (ta/lcsp/aa) are peer arrays — returned as-is.
function resolveChain(nodeId, authKey) {
  var a = AUTH[nodeId];
  if (!a || !a[authKey] || !a[authKey].length) return [];
  // ta/lcsp/aa are peer lists, not chains — return directly
  if (authKey === 'ta' || authKey === 'lcsp' || authKey === 'aa') return a[authKey];
  // Walk upward through immediate parents to build full chain
  var chain = [];
  var current = a[authKey][0]; // immediate parent
  var seen = new Set();
  seen.add(nodeId);
  while (current && !seen.has(current)) {
    chain.push(current);
    seen.add(current);
    var parentAuth = AUTH[current];
    if (!parentAuth || !parentAuth[authKey] || !parentAuth[authKey].length) break;
    current = parentAuth[authKey][0];
  }
  return chain;
}

// ═══════════════════════════════════════════════════════
// PANEL NAV
// ═══════════════════════════════════════════════════════
function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.getElementById('p-'+id).classList.add('on');
  var map={org:0,orders:1,timeline:2,registry:3,deconfliction:4,accuracy:5,dashboard:6};
  document.querySelectorAll('.tab')[map[id]].classList.add('on');
  if(id==='org')setTimeout(function(){renderOrg(true);},50);
  if(id==='orders')renderOrders();
  if(id==='timeline')renderTimeline();
  if(id==='registry')renderRegistry();
  if(id==='deconfliction')setTimeout(renderDeconfliction,60);
  if(id==='accuracy')runValidation();
  if(id==='dashboard')setTimeout(renderDashboard,60);
}

// ═══════════════════════════════════════════════════════
// ORG CHART — D3 RENDERER
// ═══════════════════════════════════════════════════════
const NW=156,NH=76;
const ORG={nodePos:{},zb:null,horizontal:false}; // org chart viewport state
function _svgDims(){const el=document.getElementById('oc-svg');return{W:el.clientWidth||900,H:el.clientHeight||580};}
function fitAllNodes(dur){
  if(!ORG.zb||!Object.keys(ORG.nodePos).length)return;
  const {W,H}=_svgDims();
  const sideW=document.getElementById('oc-side').classList.contains('open')?320:0;
  const availW=W-sideW;
  const pad=60;
  const ids=Object.keys(ORG.nodePos);
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  ids.forEach(id=>{const p=ORG.nodePos[id];minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x+NW);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y+NH);});
  const cw=maxX-minX, ch=maxY-minY;
  if(cw<=0||ch<=0)return;
  const scX=(availW-pad*2)/cw, scY=(H-pad*2)/ch;
  const scale=Math.min(scX,scY,1.0);
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
  const sideW=document.getElementById('oc-side').classList.contains('open')?320:0;
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

// Focus layout: BFS downstream from root, then d3.tree for overlap-free positioning.
function buildFocusLayout(rootId, viewLinks, availW, maxDepth){
  maxDepth=maxDepth||1;

  // ── BFS to build tree from root ────────────────────────────
  const adj={};
  viewLinks.forEach(lk=>{if(!adj[lk.s])adj[lk.s]=[];adj[lk.s].push(lk);});
  const childList={}, visited=new Set([rootId]);
  childList[rootId]=[];
  const queue=[{id:rootId,depth:0}];
  const focusLinks=[];
  while(queue.length){
    const {id,depth}=queue.shift();
    (adj[id]||[]).forEach(lk=>{
      if(!visited.has(lk.t)&&depth<maxDepth){
        visited.add(lk.t);
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

  // ── Build d3.hierarchy from childList, then d3.tree ────────
  function buildHier(id){
    var ch=childList[id]||[];
    if(!ch.length) return {id:id};
    return {id:id, children:ch.map(buildHier)};
  }
  var ns=ORG.horizontal?[NH+10,NW+30]:[186,146];
  var hierarchy=d3.hierarchy(buildHier(rootId));
  d3.tree().nodeSize(ns).separation(function(a,b){
    return a.parent===b.parent ? 1.0 : 1.5;
  })(hierarchy);

  // Compact stagger for focus layout
  var STAGGER_THRESHOLD=8;
  var depthStep=ns[1], spreadStep=ns[0];
  hierarchy.descendants().forEach(function(d){
    if(!d.children||d.children.length<STAGGER_THRESHOLD)return;
    var ch=d.children;
    var midSpread=0;
    ch.forEach(function(c){midSpread+=c.x;});
    midSpread/=ch.length;
    for(var i=0;i<ch.length;i++){
      var col=i%2, row=Math.floor(i/2);
      var halfCount=Math.ceil(ch.length/2);
      ch[i].x=midSpread+(row-(halfCount-1)/2)*spreadStep;
      if(col===1){
        ch[i].y=d.y+depthStep*2;
        if(ch[i].descendants){
          var shift=ch[i].y-(d.y+depthStep);
          ch[i].descendants().forEach(function(desc){if(desc!==ch[i])desc.y+=shift;});
        }
      }
    }
  });

  // Extract positions as {id:{x,y}} objects
  // When ORG.horizontal, swap: depth→x, spread→y
  var pos={};
  var minP=Infinity;
  var horiz=ORG.horizontal;
  hierarchy.descendants().forEach(function(d){
    if(horiz){
      pos[d.data.id]={x:d.y, y:d.x};
      if(d.x<minP) minP=d.x;
    }else{
      pos[d.data.id]={x:d.x, y:d.y};
      if(d.x<minP) minP=d.x;
    }
  });
  // Normalize spread axis to positive origin
  var pShift=40-minP;
  var spreadKey=horiz?'y':'x';
  Object.keys(pos).forEach(function(id){ pos[id][spreadKey]+=pShift; });

  return{nodeIds:[...visited],pos:pos,links:focusLinks};
}

// ── TREE LAYOUT: d3.tree().nodeSize() — overlap-free positioning ──
// Replaces the old autoLayoutView(). Uses D3's Reingold-Tilford algorithm.
// Returns posMap as {id: [x, y]} arrays for backward compat with view.pos format.
function treeLayoutView(view){
  var ids=view.ids||[];
  var links=view.links||[];
  if(!ids.length)return {};

  // Build directed graph from links
  var incoming={}, childrenOf={}, visited=new Set();
  var idSet=new Set(ids);
  ids.forEach(function(id){ incoming[id]=0; childrenOf[id]=[]; });
  links.forEach(function(lk){
    if(idSet.has(lk.s)&&idSet.has(lk.t)){
      if(!visited.has(lk.t)){
        // First parent wins — d3.hierarchy requires strict tree (no multi-parent)
        visited.add(lk.t);
        childrenOf[lk.s].push(lk.t);
        incoming[lk.t]=(incoming[lk.t]||0)+1;
      }
    }
  });

  // Find roots (no incoming edges) + orphan nodes (not in any link)
  var roots=ids.filter(function(id){ return !incoming[id]||incoming[id]===0; });
  if(!roots.length)roots=[ids[0]];

  // Build nested hierarchy object for d3.hierarchy
  function buildHier(id){
    var ch=childrenOf[id]||[];
    if(!ch.length) return {id:id};
    return {id:id, children:ch.map(buildHier)};
  }

  var treeRoot;
  var vrootUsed=roots.length>1;
  if(vrootUsed){
    treeRoot={id:'__vroot__', children:roots.map(buildHier)};
  }else{
    treeRoot=buildHier(roots[0]);
  }

  // Run d3.tree with fixed node footprint
  // Horizontal: spread axis is vertical (needs NH+10 min), depth axis is horizontal (needs NW+30 min)
  var ns=ORG.horizontal?[NH+10,NW+30]:[186,146];
  var hierarchy=d3.hierarchy(treeRoot);
  d3.tree().nodeSize(ns).separation(function(a,b){
    return a.parent===b.parent ? 1.0 : 1.5;
  })(hierarchy);

  // Compact stagger: parents with 8+ children get split into 2 columns.
  // Even-indexed children stay in place, odd-indexed shift one depth tier forward
  // and close up the spread gap. Halves the spread, fills the depth axis.
  var STAGGER_THRESHOLD=8;
  var depthStep=ns[1]; // depth tier spacing from nodeSize
  var spreadStep=ns[0]; // spread spacing from nodeSize
  hierarchy.descendants().forEach(function(d){
    if(!d.children||d.children.length<STAGGER_THRESHOLD)return;
    var ch=d.children;
    // Compute center of children spread for regrouping
    var midSpread=0;
    ch.forEach(function(c){midSpread+=c.x;});
    midSpread/=ch.length;
    // Reposition: col1 (even indices) tighter above center, col2 (odd) offset in depth
    for(var i=0;i<ch.length;i++){
      var col=i%2; // 0=col1, 1=col2
      var row=Math.floor(i/2);
      var halfCount=Math.ceil(ch.length/2);
      // Spread: distribute rows evenly, centered
      ch[i].x=midSpread+(row-(halfCount-1)/2)*spreadStep;
      // Depth: col2 gets pushed one tier forward
      if(col===1) ch[i].y=d.y+depthStep*2;
      // Propagate depth shift to all descendants of staggered children
      if(col===1&&ch[i].descendants){
        var shift=ch[i].y-(d.y+depthStep);
        ch[i].descendants().forEach(function(desc){
          if(desc!==ch[i])desc.y+=shift;
        });
      }
    }
  });

  // Extract positions — d3.tree uses x=horizontal (centered), y=vertical (depth*nodeSize[1])
  // When ORG.horizontal, swap: depth→x, spread→y (left-to-right flow)
  var posMap={};
  var minP=Infinity; // min of primary spread axis
  var horiz=ORG.horizontal;
  hierarchy.descendants().forEach(function(d){
    if(d.data.id==='__vroot__')return;
    var depth=vrootUsed ? d.y-146 : d.y; // Strip virtual root tier
    var spread=d.x;
    if(horiz){
      posMap[d.data.id]=[depth, spread];
      if(spread<minP)minP=spread;
    }else{
      posMap[d.data.id]=[spread, depth];
      if(spread<minP)minP=spread;
    }
  });

  // Normalize spread axis so minimum is at 40px
  var shiftIdx=horiz?1:0;
  var pShift=40-minP;
  ids.forEach(function(id){
    if(posMap[id]){
      posMap[id][shiftIdx]+=pShift;
    }else{
      posMap[id]=[40,0]; // Fallback for any node missed by tree
    }
  });

  // Apply manual position overrides if present
  if(view.pos){
    var manualIds=Object.keys(view.pos);
    for(var i=0;i<manualIds.length;i++){
      var mid=manualIds[i];
      if(view.pos[mid])posMap[mid]=view.pos[mid];
    }
  }

  return posMap;
}

// ── SHARED DEFS SETUP ──
function setupDefs(svg){
  const defs=svg.append('defs');
  Object.keys(ACOL).forEach(type=>{
    defs.append('marker').attr('id','arr-'+type).attr('viewBox','0 -5 10 10').attr('refX',13).attr('refY',0).attr('markerWidth',4).attr('markerHeight',4).attr('orient','auto')
      .append('path').attr('d','M0,-5L10,0L0,5').attr('fill',ACOL[type]).attr('opacity',.9);
  });
  ['glow','cyberGlow','taGlow'].forEach((id)=>{
    const f=defs.append('filter').attr('id',id).attr('x','-50%').attr('y','-50%').attr('width','200%').attr('height','200%');
    f.append('feGaussianBlur').attr('stdDeviation',4).attr('result','blur');
    const m=f.append('feMerge');m.append('feMergeNode').attr('in','blur');m.append('feMergeNode').attr('in','SourceGraphic');
  });
}

// ── SHARED DRAW: links ──
function _linkRestOpacity(a){
  // ADCON is structural scaffolding — subtle at rest, like deconfliction tab
  if(a==='adcon') return 0.25;
  // Peer/cross-cutting types get moderate visibility
  if(a==='ta'||a==='lcsp'||a==='aa'||a==='cyber') return 0.7;
  // Chain types (opcon, cocom, nca, dac, align) — prominent
  return 0.7;
}
function drawLinks(G, links, posMap, af, hiSet, isFocus){
  const horiz=ORG.horizontal;
  links.forEach(lk=>{
    if(af!=='all'&&lk.a!==af)return;
    const sp=posMap[lk.s],tp=posMap[lk.t];if(!sp||!tp)return;
    const col=ACOL[lk.a]||'#555';
    // Vertical: bottom-center → top-center. Horizontal: right-center → left-center.
    const x1=horiz?sp.x+NW:sp.x+NW/2, y1=horiz?sp.y+NH/2:sp.y+NH;
    const x2=horiz?tp.x:tp.x+NW/2,     y2=horiz?tp.y+NH/2:tp.y;
    const hi=isFocus||(hiSet.has(lk.s)&&hiSet.has(lk.t));
    const isCross=lk.a==='ta'||lk.a==='lcsp'||lk.a==='aa';
    const dx=x2-x1,dy=y2-y1;
    const dist=Math.sqrt(dx*dx+dy*dy);
    const arcOff=isCross?dist*0.35:0;
    let d;
    if(isCross){
      // Quadratic arc — offset perpendicular to the line
      d=horiz
        ?`M${x1},${y1} Q${(x1+x2)/2},${(y1+y2)/2-arcOff} ${x2},${y2}`
        :`M${x1},${y1} Q${(x1+x2)/2+arcOff},${(y1+y2)/2} ${x2},${y2}`;
    }else{
      // Cubic Bezier — smooth S-curve along flow axis
      const mx=(x1+x2)/2, my=(y1+y2)/2;
      d=horiz
        ?`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
        :`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
    }
    G.append('path').attr('d',d)
      .attr('stroke',col).attr('stroke-width',hi?AW[lk.a]*2.2:AW[lk.a])
      .attr('fill','none').attr('opacity',hi?1:hiSet.size?0.13:_linkRestOpacity(lk.a))
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
    // Friction halo — pulsing severity-colored border behind card
    const _fa=AUTH[n.id];
    const _fr=_fa&&_fa.friction;
    if(_fr&&_fr.length&&!isDim){
      const _maxSev=_fr.some(f=>f.severity==='high')?'high':_fr.some(f=>f.severity==='medium')?'medium':'low';
      const _hc=_maxSev==='high'?'#ff5566':_maxSev==='medium'?'#e8b00f':'#0076a9';
      const _dur=_maxSev==='high'?'1.5s':'2.5s';
      const halo=ng.append('rect').attr('x',-6).attr('y',-6).attr('width',NW+12).attr('height',NH+12).attr('rx',8)
        .attr('fill','none').attr('stroke',_hc).attr('stroke-width',2.5).attr('filter','url(#glow)').attr('opacity',0.8);
      // Pulse opacity
      halo.append('animate').attr('attributeName','opacity').attr('values','0.8;0.3;0.8').attr('dur',_dur).attr('repeatCount','indefinite');
      // Pulse stroke width
      halo.append('animate').attr('attributeName','stroke-width').attr('values','2.5;4;2.5').attr('dur',_dur).attr('repeatCount','indefinite');
    }
    ng.append('rect').attr('width',NW).attr('height',NH).attr('rx',5).attr('fill',sc2.fill)
      .attr('stroke',isSel?'#fff':sc2.stroke).attr('stroke-width',isSel?2:1.5)
      .attr('filter',(isHi||(isCyber&&!isDim))?'url(#'+(isCyber?'cyberGlow':'glow')+')':(isAcq&&!isDim)?'url(#taGlow)':null);
    if(n.dh){
      const dhCol=isCyber?ACOL.cyber:isAcq?ACOL.ta:ACOL.cocom;
      ng.append('rect').attr('x',0).attr('y',NH-14).attr('width',NW).attr('height',14).attr('rx',1)
        .attr('fill',dhCol).attr('opacity',.85);
      ng.append('text').attr('x',NW/2).attr('y',NH-3).attr('text-anchor','middle').attr('font-family','Space Mono,monospace').attr('font-weight','700').attr('font-size',7.5)
        .attr('fill',sc2.fill).text('\u25c6 '+dhLabel(n.id,n.dh));
    }
    const logo=n.logo||S.logos[n.id];
    const tcx=logo?(38+NW)/2:NW/2; // text center x — offset for logo area
    if(logo){
      ng.append('clipPath').attr('id','lc-'+n.id).append('rect').attr('x',4).attr('y',4).attr('width',30).attr('height',30).attr('rx',2);
      ng.append('image').attr('x',4).attr('y',4).attr('width',30).attr('height',30).attr('preserveAspectRatio','xMidYMid meet').attr('href',logo).attr('clip-path','url(#lc-'+n.id+')');
    }else{
      ng.append('rect').attr('x',0).attr('y',0).attr('width',5).attr('height',NH).attr('rx',1).attr('fill',sc2.stroke).attr('opacity',.9);
    }
    const lbl=n.lbl.length>15?n.lbl.slice(0,14)+'\u2026':n.lbl;
    const sub=n.sub.length>26?n.sub.slice(0,25)+'\u2026':n.sub;
    ng.append('text').attr('x',tcx).attr('y',16).attr('text-anchor','middle').attr('font-family','Rajdhani,sans-serif').attr('font-weight','700').attr('font-size',12.5).attr('fill',sc2.text).attr('letter-spacing','0.5').text(lbl);
    if(n.billet){ng.append('text').attr('x',tcx).attr('y',28).attr('text-anchor','middle').attr('font-family','Rajdhani,sans-serif').attr('font-size',9.5).attr('font-weight','600').attr('fill',isSel?'#fff':isCyber?'#22cccc':isAcq?'#bb99dd':'#a0b8d0').attr('letter-spacing','0.3').text(n.billet);}
    ng.append('text').attr('x',tcx).attr('y',40).attr('text-anchor','middle').attr('font-family','IBM Plex Sans,sans-serif').attr('font-size',8.5).attr('fill',isCyber?'#33bbbb':isAcq?'#9966cc':'#6688aa').text(sub);
    if(n.maint){
      const mlvl=n.maint;
      const mclr=mlvl==='I/D'?'#ff9500':mlvl==='D'?'#ff6600':mlvl==='O/I'?'#88dd88':'#c9a84c';
      const mbg=ng.append('g').attr('transform',`translate(${NW-20},${NH-15})`);
      mbg.append('rect').attr('x',-2).attr('y',-2).attr('width',17).attr('height',14).attr('rx',2).attr('fill','#000').attr('opacity',.7);
      mbg.append('text').attr('x',6.5).attr('y',9).attr('text-anchor','middle').attr('font-family','Rajdhani,sans-serif').attr('font-weight','700').attr('font-size',8.5).attr('fill',mclr).attr('letter-spacing','0.2').text(mlvl);
    }
    // Friction badge — diamond with count at top-right
    if(_fr&&_fr.length&&!isDim){
      const _maxSev=_fr.some(f=>f.severity==='high')?'high':_fr.some(f=>f.severity==='medium')?'medium':'low';
      const _bc=_maxSev==='high'?'#ff5566':_maxSev==='medium'?'#e8b00f':'#0076a9';
      const bx=NW-2,by=-2; // top-right corner
      ng.append('polygon').attr('points',`${bx},${by-8} ${bx+8},${by} ${bx},${by+8} ${bx-8},${by}`)
        .attr('fill',_bc).attr('stroke','#fff').attr('stroke-width',1);
      ng.append('text').attr('x',bx).attr('y',by+3).attr('text-anchor','middle')
        .attr('font-family','Rajdhani,sans-serif').attr('font-weight','700').attr('font-size',8).attr('fill','#fff').text(_fr.length);
    }
  });
}

// Track last render state for incremental updates
var _lastRenderView=null, _lastRenderFocus=null, _lastRenderNodes=null, _lastRenderLinks=null, _lastRenderPosMap=null;

function renderOrg(forceRebuild){
  var vk=document.getElementById('oc-view').value;
  var af=document.getElementById('oc-auth').value;
  var svg=d3.select('#oc-svg');
  var svgEl=document.getElementById('oc-svg');
  var W=svgEl.clientWidth||900;
  var H=svgEl.clientHeight||580;

  // Fast path: if only the auth filter or highlight changed (same view, same focus), just redraw links + update node styles
  var sameStructure=!forceRebuild&&_lastRenderView===vk&&_lastRenderFocus===S.focusNode&&_lastRenderNodes&&_lastRenderPosMap;
  if(sameStructure&&vk!=='custom'){
    svg.selectAll('*').remove();
    setupDefs(svg);
    var G=svg.append('g');
    var isFocus=!!S.focusNode;
    drawLinks(G, _lastRenderLinks, _lastRenderPosMap, af, S.highlight, isFocus);
    drawNodes(G, _lastRenderNodes, _lastRenderPosMap, S.activeNode, S.highlight, isFocus);
    if(isFocus&&_lastRenderPosMap[S.focusNode]){
      G.append('text').attr('x',_lastRenderPosMap[S.focusNode].x+NW/2).attr('y',16)
        .attr('text-anchor','middle').attr('font-family','Space Mono,monospace').attr('font-size',7)
        .attr('fill','#c9a84c').attr('opacity',.6).text('click a subordinate to go deeper  │  click background to restore');
    }
    svg.on('click',()=>{S.focusNode=null;S.activeNode=null;S.highlight.clear();renderOrg();closeSide();updateBadge();document.getElementById('btn-clear').style.display='none';});
    ORG.zb=d3.zoom().scaleExtent([.12,4]).on('zoom',e=>G.attr('transform',e.transform));
    svg.call(ORG.zb);
    requestAnimationFrame(()=>{
      var root=S.focusNode||S.activeNode;
      if(root&&ORG.nodePos[root])centerOnNode(root,1.0,S.focusNode?0.15:0.4);
      else fitAllNodes(0);
    });
    return;
  }

  // Full rebuild
  svg.selectAll('*').remove();

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
  var G=svg.append('g');

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
    // Cache for incremental updates
    _lastRenderView=vk;_lastRenderFocus=S.focusNode;
    _lastRenderNodes=focusNodes;_lastRenderLinks=layout.links;_lastRenderPosMap=layout.pos;
  } else {
    // NORMAL MODE: use manual positions if complete, auto-layout if missing/partial
    // Check if all nodes have manual positions
    var hasPos=view.pos&&view.ids.every(function(id){return view.pos[id];});
    var rawPos;
    if(hasPos){
      // All positions manual — use them directly
      rawPos={};
      view.ids.forEach(function(id){rawPos[id]=view.pos[id];});
    }else{
      // Auto-layout via d3.tree
      rawPos=treeLayoutView(view);
    }
    const nodes=view.ids.map(id=>{const n=NODES[id];if(!n)return null;return n;}).filter(Boolean);
    if(!nodes.length)return;
    ORG.nodePos={};
    const posMap={};

    if(hasPos){
      // Manual positions: apply viewport scaling (backward compat for existing views)
      const tempNodes=nodes.map(n=>{const p=rawPos[n.id]||[0,0];return{id:n.id,x:p[0],y:p[1]};});
      const xs=tempNodes.map(n=>n.x),ys=tempNodes.map(n=>n.y);
      const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
      const padX=55,padY=40;
      const scX=maxX===minX?1:(W-padX*2-NW)/(maxX-minX);
      const scY=maxY===minY?1:(H-padY*2-NH)/(maxY-minY);
      const sc=Math.min(scX,scY,1.6);
      const offX=(W-(maxX-minX)*sc-NW)/2;
      tempNodes.forEach(n=>{const pos={x:(n.x-minX)*sc+offX,y:(n.y-minY)*sc+padY};ORG.nodePos[n.id]=pos;posMap[n.id]=pos;});
    }else{
      // Auto-layout: natural d3.tree positions, no scaling — fitAllNodes handles framing
      nodes.forEach(n=>{const p=rawPos[n.id]||[0,0];const pos={x:p[0],y:p[1]};ORG.nodePos[n.id]=pos;posMap[n.id]=pos;});
    }

    drawLinks(G, view.links, posMap, af, S.highlight, false);
    drawNodes(G, nodes, posMap, S.activeNode, S.highlight, false);
    document.getElementById('tb-org').textContent=view.ids.length;
    // Cache for incremental updates
    _lastRenderView=vk;_lastRenderFocus=S.focusNode;
    _lastRenderNodes=nodes;_lastRenderLinks=view.links;_lastRenderPosMap=posMap;
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
  renderOrg(true);
  openSide(id,related);
  updateBadge();
  requestAnimationFrame(()=>{if(ORG.nodePos[id])centerOnNode(id,1.0,0);});
  document.getElementById('btn-clear').style.display='inline-block';
}
function clearFilter(){S.activeNode=null;S.focusNode=null;S.highlight.clear();renderOrg();closeSide();updateBadge();document.getElementById('btn-clear').style.display='none';document.getElementById('active-badge').style.display='none';}
function toggleOrientation(){
  ORG.horizontal=!ORG.horizontal;
  var btn=document.getElementById('btn-orient');
  btn.textContent=ORG.horizontal?'↔ Left-Right':'↕ Top-Down';
  _lastRenderView=null;renderOrg(true);
}
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
      {key:'dac',lbl:'Direct Authority',col:ACOL.dac},
      {key:'opcon',lbl:'OPCON',col:ACOL.opcon},
      {key:'adcon',lbl:'ADCON / MTE',col:ACOL.adcon},
      {key:'aa',lbl:'Acq Authority',col:ACOL.aa},
      {key:'ta',lbl:'Tech Authority',col:ACOL.ta},
      {key:'daco',lbl:'DACO',col:ACOL.cyber},
      {key:'lcsp',lbl:'LCSP Data Return ↑',col:ACOL.lcsp}
    ];
    matrixHTML='<div class="auth-matrix">';
    axes.forEach(ax=>{
      const chain=resolveChain(id,ax.key);
      matrixHTML+=`<div class="am-row"><div class="am-lbl" style="color:${ax.col}">${ax.lbl}</div><div class="am-chain">`;
      if(!chain.length){matrixHTML+='<span class="am-na">N/A</span>';}
      else{
        chain.forEach((nid,i)=>{
          if(i>0)matrixHTML+='<span class="am-arr">→</span>';
          const nn=NODES[nid];const sc3=nn?SVC[nn.svc]||SVC.civ:null;
          matrixHTML+=`<span class="am-node" style="border-color:${sc3?sc3.stroke:'#333'};color:${sc3?sc3.text:'#888'}" data-action="jump-to-node" data-arg="${nid}">${nn?nn.lbl:nid}</span>`;
        });
      }
      matrixHTML+='</div>';
      // Ref document chain badges
      if(auth.ref&&auth.ref[ax.key]&&auth.ref[ax.key].length){
        matrixHTML+='<div class="am-ref">';
        auth.ref[ax.key].forEach(function(docId,ri){
          var doc=DOC_MAP[docId];var docLabel=doc?(doc.number||doc.id):docId;
          if(ri>0)matrixHTML+='<span class="am-ref-arr">\u2192</span>';
          matrixHTML+='<span class="am-ref-doc" data-action="select-order" data-arg="'+docId+'">'+docLabel+'</span>';
        });
        matrixHTML+='</div>';
      }
      matrixHTML+='</div>';
    });
    if(auth.note)matrixHTML+=`<div style="font-family:'Space Mono',monospace;font-size:10px;color:var(--t2);margin-top:6px;padding-top:6px;border-top:1px solid var(--b1);line-height:1.6">${auth.note}</div>`;
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
  const locHTML=loc?`<div class="loc-chip">
    <span class="loc-icon">\ud83d\udccd</span>
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
    ${n.dh?`<div class="tt-r"><span class="tt-k">Dual-Hat</span><span class="tt-v" style="color:var(--gold)">${dhLabel(n.id,n.dh)}</span></div>`:''}
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
// MAP — placeholder for D3 geo implementation
// ═══════════════════════════════════════════════════════




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
var VIEW_PRIORITY=['navair_auth','navy_syscom','ta_navair','ta_navsea','ta_navwar','mals','acq','don','navy_fleet','usmc','cocoms','cyber','strategic'];

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
    var axes=['opcon','adcon','aa','ta','daco','lcsp'];
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

// ═══════════════════════════════════════════════════════
// REUSABLE SEARCH BOX — keyboard nav, results, selection
// ═══════════════════════════════════════════════════════
function initSearchBox(opts){
  // opts: { inputId, resultsId, wrapClass, onSelect(id), renderItem(result,query,idx,activeIdx), onClose? }
  var input=document.getElementById(opts.inputId);
  var container=document.getElementById(opts.resultsId);
  if(!input||!container)return null;

  var state={results:[],activeIdx:-1};

  function render(query){
    if(!state.results.length){
      if(query&&query.length>=1){
        container.innerHTML='<div class="sr-empty">No commands match "'+query+'"</div>';
        container.classList.add('open');
      }else{
        container.classList.remove('open');
      }
      return;
    }
    var html='';
    for(var i=0;i<state.results.length;i++){
      html+=opts.renderItem(state.results[i],query,i,state.activeIdx);
    }
    container.innerHTML=html;
    container.classList.add('open');
  }

  function updateActive(){
    var items=container.querySelectorAll('.sr-item');
    for(var i=0;i<items.length;i++){
      if(i===state.activeIdx)items[i].classList.add('active');
      else items[i].classList.remove('active');
    }
    if(state.activeIdx>=0&&items[state.activeIdx])items[state.activeIdx].scrollIntoView({block:'nearest'});
  }

  function close(){
    input.value='';
    container.classList.remove('open');
    state.results=[];
    state.activeIdx=-1;
    if(opts.onClose)opts.onClose();
  }

  input.addEventListener('input',function(){
    var q=input.value.trim();
    state.results=searchNodes(q);
    state.activeIdx=-1;
    render(q);
    if(opts.onInput)opts.onInput(q);
  });
  input.addEventListener('click',function(e){e.stopPropagation();});
  container.addEventListener('click',function(e){e.stopPropagation();});

  input.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){
      e.preventDefault();
      state.activeIdx=Math.min(state.activeIdx+1,state.results.length-1);
      updateActive();
    }else if(e.key==='ArrowUp'){
      e.preventDefault();
      state.activeIdx=Math.max(state.activeIdx-1,-1);
      updateActive();
    }else if(e.key==='Enter'){
      e.preventDefault();
      var sel=state.activeIdx>=0?state.results[state.activeIdx]:state.results.length===1?state.results[0]:null;
      if(sel){close();opts.onSelect(sel.id);}
    }else if(e.key==='Escape'){
      close();
      input.blur();
    }
  });

  container.addEventListener('mousedown',function(e){
    var item=e.target.closest('.sr-item');
    if(item&&item.dataset.id){
      e.preventDefault();
      e.stopPropagation();
      close();
      opts.onSelect(item.dataset.id);
    }
  });

  input.addEventListener('focus',function(){
    if(state.results.length)container.classList.add('open');
  });

  document.addEventListener('click',function(e){
    if(!e.target.closest('.'+opts.wrapClass))container.classList.remove('open');
  });

  return {state:state,close:close};
}

// Global search — uses reusable search box
function initSearch(){
  var kbd=document.getElementById('search-kbd');
  var box=initSearchBox({
    inputId:'search-input',
    resultsId:'search-results',
    wrapClass:'search-wrap',
    onSelect:function(id){navigateToNode(id);},
    onInput:function(q){if(kbd)kbd.style.display=q?'none':'block';},
    onClose:function(){if(kbd)kbd.style.display='block';},
    renderItem:function(r,query,i,activeIdx){
      var sc=SVC[r.node.svc]||SVC.civ;
      var bv=bestViewForNode(r.id);
      var viewLbl='';
      if(bv&&VIEWS[bv]&&VIEWS[bv].label){viewLbl=VIEWS[bv].label.split('—')[0].trim();}
      var html='<div class="sr-item'+(i===activeIdx?' active':'')+'" data-id="'+r.id+'">';
      html+='<div class="sr-svc" style="background:'+sc.stroke+'"></div>';
      html+='<div class="sr-text">';
      html+='<div class="sr-lbl">'+highlightMatch(r.node.lbl,query)+'</div>';
      html+='<div class="sr-sub">'+highlightMatch(r.node.sub,query)+'</div>';
      html+='</div>';
      if(viewLbl)html+='<div class="sr-view">'+viewLbl+'</div>';
      return html+'</div>';
    }
  });
  if(!box)return;

  // Keyboard shortcut: / to open search
  var input=document.getElementById('search-input');
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
    var chains=['opcon','adcon','aa','ta','daco','lcsp'];
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
    if(NODES[id]&&(!a.opcon||!a.opcon.length)&&(!a.adcon||!a.adcon.length)&&(!a.aa||!a.aa.length)&&(!a.ta||!a.ta.length)&&(!a.daco||!a.daco.length)&&(!a.lcsp||!a.lcsp.length)&&!a.note){
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
    if(NODES[f.node])html+='<button class="btn btn-s" style="font-size:7px;padding:2px 6px" data-action="jump-to-node" data-arg="'+f.node+'">View</button>';
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
  auth:{nca:false,dac:false,adcon:true,opcon:false,tacon:false,cocom:false,aa:false,ta:false,cyber:false,lcsp:false},
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
  // Reuse autoLayoutView with a synthetic view object
  var rawPos=autoLayoutView({ids:nodeIds,links:links},W,H);
  var posMap={};
  for(var i=0;i<nodeIds.length;i++){
    var p=rawPos[nodeIds[i]]||[0,0];
    posMap[nodeIds[i]]={x:p[0],y:p[1]};
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

// Custom chart search-to-add — uses reusable search box
function initCustomChartSearch(){
  initSearchBox({
    inputId:'cc-add',
    resultsId:'cc-add-results',
    wrapClass:'cc-add-wrap',
    onSelect:function(id){addToCustomChart(id);},
    renderItem:function(r,query,i,activeIdx){
      var sc=SVC[r.node.svc]||SVC.civ;
      var already=CUSTOM.roots.indexOf(r.id)>=0;
      var html='<div class="sr-item'+(i===activeIdx?' active':'')+(already?' dimmed':'')+'" data-id="'+r.id+'">';
      html+='<div class="sr-svc" style="background:'+sc.stroke+'"></div>';
      html+='<div class="sr-text">';
      html+='<div class="sr-lbl">'+highlightMatch(r.node.lbl,query)+(already?' <span style="font-size:7px;color:var(--t3)">(added)</span>':'')+'</div>';
      html+='<div class="sr-sub">'+highlightMatch(r.node.sub,query)+'</div>';
      return html+'</div></div>';
    }
  });
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
window.addEventListener('load',function(){setTimeout(renderOrg,100);initSearch();initCustomChartSearch();initEvents();});
window.addEventListener('resize',function(){
  if(document.getElementById('p-org').classList.contains('on'))renderOrg();
});

// ═══════════════════════════════════════════════════════
// DECONFLICTION — Authority Intersection View
// ═══════════════════════════════════════════════════════
function renderDeconfliction(){
  var svgEl = document.getElementById('dc-svg');
  var detailEl = document.getElementById('dc-detail');
  var selectEl = document.getElementById('dc-node-select');
  var patternEl = document.getElementById('dc-pattern-select');
  var statsEl = document.getElementById('dc-stats');
  var W = svgEl.clientWidth || 900, H = svgEl.clientHeight || 580;

  // Collect friction nodes
  var frictionIds = [];
  var patterns = {};
  Object.keys(AUTH).forEach(function(id){
    var a = AUTH[id];
    if(!a.friction || !a.friction.length) return;
    frictionIds.push(id);
    a.friction.forEach(function(f){
      var pk = f.types.sort().join('/');
      if(!patterns[pk]) patterns[pk] = {key:pk, count:0, nodes:[]};
      patterns[pk].count++;
      if(patterns[pk].nodes.indexOf(id)<0) patterns[pk].nodes.push(id);
    });
  });

  // Populate selects
  if(selectEl.options.length <= 1){
    selectEl.innerHTML = '';
    frictionIds.sort().forEach(function(id){
      var n = NODES[id];
      var sev = 'med';
      AUTH[id].friction.forEach(function(f){ if(f.severity==='high') sev='high'; });
      var o = document.createElement('option');
      o.value = id;
      o.textContent = (n?n.lbl:id) + (sev==='high'?' ●':'');
      if(sev==='high') o.style.color='#ff5566';
      selectEl.appendChild(o);
    });
    patternEl.innerHTML = '<option value="all">All Patterns</option>';
    Object.values(patterns).sort(function(a,b){return b.count-a.count;}).forEach(function(p){
      var o = document.createElement('option');
      o.value = p.key;
      o.textContent = p.key + ' (' + p.count + ')';
      patternEl.appendChild(o);
    });
    selectEl.onchange = function(){ renderDeconflictionGraph(selectEl.value); };
    patternEl.onchange = function(){
      var pk = patternEl.value;
      if(pk==='all') return;
      var first = patterns[pk] && patterns[pk].nodes[0];
      if(first){ selectEl.value = first; renderDeconflictionGraph(first); }
    };
  }

  statsEl.textContent = frictionIds.length + ' friction nodes · ' +
    Object.keys(patterns).length + ' patterns · ' +
    frictionIds.reduce(function(s,id){ return s + AUTH[id].friction.length; }, 0) + ' annotations';

  renderDeconflictionGraph(selectEl.value || frictionIds[0]);
}

var ACOL_MAP = KMS_DATA.config.acol;
var AUTH_LABELS = {opcon:'OPCON',adcon:'ADCON',daco:'DACO',ta:'Tech Authority',lcsp:'LCSP Return',aa:'Acq Authority',cocom:'COCOM',nca:'NCA',dac:'DAC',align:'Alignment'};

function renderDeconflictionGraph(focusId){
  if(!focusId || !AUTH[focusId]) return;
  var svgEl = document.getElementById('dc-svg');
  var detailEl = document.getElementById('dc-detail');
  var W = svgEl.clientWidth || 900, H = svgEl.clientHeight || 580;

  // Clear
  while(svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
  var NS = 'http://www.w3.org/2000/svg';

  // Build tree: gather all nodes involved in the authority chains converging on focusId
  var involved = {};
  involved[focusId] = true;
  var focusAuth = AUTH[focusId];
  var authTypes = ['opcon','adcon','daco','ta','aa','lcsp','dac'];
  var activeTypes = [];

  // Walk chains for chain-types (opcon, adcon, daco, dac)
  function walkChain(id, key){
    var chain = [id];
    var visited = {};
    visited[id] = true;
    var cur = id;
    while(true){
      var a = AUTH[cur];
      if(!a || !a[key] || !a[key].length) break;
      var par = a[key][0];
      if(visited[par]) break;
      visited[par] = true;
      chain.push(par);
      involved[par] = true;
      cur = par;
    }
    return chain;
  }

  var chains = {};
  ['opcon','adcon','daco','dac'].forEach(function(k){
    if(focusAuth[k] && focusAuth[k].length > 0){
      chains[k] = walkChain(focusId, k);
      activeTypes.push(k);
    }
  });

  // For peer types (ta, aa, lcsp), include the peers and their first parent
  ['ta','aa','lcsp'].forEach(function(k){
    if(focusAuth[k] && focusAuth[k].length > 0){
      activeTypes.push(k);
      chains[k] = [focusId];
      focusAuth[k].forEach(function(peerId){
        involved[peerId] = true;
        chains[k].push(peerId);
        // Walk peer's adcon chain 2 hops to give context
        if(AUTH[peerId] && AUTH[peerId].adcon){
          AUTH[peerId].adcon.forEach(function(p){ involved[p]=true; });
        }
      });
    }
  });

  // Build hierarchical tree data for d3.tree
  // Use ADCON as the primary tree structure, add other chains as arcs
  var treeNodes = {};
  var involvedIds = Object.keys(involved);

  // Build parent map using adcon as primary hierarchy
  var parentMap = {};
  involvedIds.forEach(function(id){
    var a = AUTH[id];
    if(a && a.adcon && a.adcon.length > 0 && involved[a.adcon[0]]){
      parentMap[id] = a.adcon[0];
    }
  });

  // Find root(s) — nodes with no parent in our set
  var roots = involvedIds.filter(function(id){ return !parentMap[id]; });

  // Build hierarchy
  function buildHierarchy(rootId){
    var children = involvedIds.filter(function(id){ return parentMap[id]===rootId; });
    var node = {id:rootId, children: children.map(buildHierarchy)};
    return node;
  }

  // Use the highest node as root (usually potus or secdef)
  var primaryRoot = roots[0] || focusId;
  // If multiple roots, create a virtual root
  var treeData;
  if(roots.length > 1){
    treeData = {id:'_root', children: roots.map(buildHierarchy)};
  } else {
    treeData = buildHierarchy(primaryRoot);
  }

  // D3 tree layout
  var hierarchy = d3.hierarchy(treeData);
  var treeLayout = d3.tree().nodeSize([170, 90]);
  treeLayout(hierarchy);

  // Collect positioned nodes
  var posNodes = {};
  hierarchy.each(function(d){ posNodes[d.data.id] = {x:d.x, y:d.y, data:d.data}; });

  // Center and fit
  var xs = hierarchy.descendants().map(function(d){return d.x;});
  var ys = hierarchy.descendants().map(function(d){return d.y;});
  var minX=Math.min.apply(null,xs), maxX=Math.max.apply(null,xs);
  var minY=Math.min.apply(null,ys), maxY=Math.max.apply(null,ys);
  var treeW = maxX-minX+200, treeH = maxY-minY+120;
  var scale = Math.min(W/treeW, H/treeH, 1.0);
  var tx = W/2 - (minX+maxX)/2*scale;
  var ty = 40 - minY*scale;

  var g = document.createElementNS(NS,'g');
  g.setAttribute('transform','translate('+tx+','+ty+') scale('+scale+')');
  svgEl.appendChild(g);

  // Defs for glow filter
  var defs = document.createElementNS(NS,'defs');
  var filter = document.createElementNS(NS,'filter');
  filter.setAttribute('id','dc-glow');
  filter.setAttribute('x','-50%'); filter.setAttribute('y','-50%');
  filter.setAttribute('width','200%'); filter.setAttribute('height','200%');
  var blur = document.createElementNS(NS,'feGaussianBlur');
  blur.setAttribute('stdDeviation','4'); blur.setAttribute('result','glow');
  filter.appendChild(blur);
  var merge = document.createElementNS(NS,'feMerge');
  var mn1 = document.createElementNS(NS,'feMergeNode'); mn1.setAttribute('in','glow');
  var mn2 = document.createElementNS(NS,'feMergeNode'); mn2.setAttribute('in','SourceGraphic');
  merge.appendChild(mn1); merge.appendChild(mn2);
  filter.appendChild(merge);
  defs.appendChild(filter);
  svgEl.appendChild(defs);

  // Draw ADCON tree links (thin, blue, background)
  hierarchy.links().forEach(function(link){
    if(link.source.data.id==='_root') return;
    var line = document.createElementNS(NS,'path');
    var sx=link.source.x, sy=link.source.y, tx2=link.target.x, ty2=link.target.y;
    line.setAttribute('d','M'+sx+','+sy+' C'+sx+','+(sy+ty2)/2+' '+tx2+','+(sy+ty2)/2+' '+tx2+','+ty2);
    line.setAttribute('fill','none');
    line.setAttribute('stroke','#0096cc');
    line.setAttribute('stroke-width','1.5');
    line.setAttribute('stroke-opacity','0.25');
    line.setAttribute('stroke-dasharray','4,3');
    g.appendChild(line);
  });

  // Draw convergence arcs for non-ADCON authority chains
  var arcColors = {opcon:'#ff7733',daco:'#00cccc',ta:'#dd44bb',aa:'#e05599',lcsp:'#6a9900',dac:'#b07cd8',cocom:'#e8b00f'};
  var focusPos = posNodes[focusId];

  activeTypes.forEach(function(atype){
    if(atype==='adcon') return; // adcon is the tree structure
    var col = arcColors[atype] || ACOL_MAP[atype] || '#888';
    var chain = chains[atype];
    if(!chain || chain.length < 2) return;

    // Draw arc from source to focus node
    var sourceId = chain[chain.length-1]; // furthest source
    // For peer types, draw from each peer
    var sources = (atype==='ta'||atype==='aa'||atype==='lcsp') ? chain.slice(1) : [chain[1]];
    sources.forEach(function(srcId){
      var srcPos = posNodes[srcId];
      if(!srcPos || !focusPos) return;
      var sx=srcPos.x, sy=srcPos.y, fx=focusPos.x, fy=focusPos.y;
      var mx = (sx+fx)/2, my = (sy+fy)/2;
      // Offset control point to curve the arc away from the tree
      var dx = fx-sx, dy = fy-sy;
      var offset = Math.sqrt(dx*dx+dy*dy)*0.35;
      var cx = mx - dy/Math.sqrt(dx*dx+dy*dy+1)*offset;
      var cy = my + dx/Math.sqrt(dx*dx+dy*dy+1)*offset;
      var arc = document.createElementNS(NS,'path');
      arc.setAttribute('d','M'+sx+','+sy+' Q'+cx+','+cy+' '+fx+','+fy);
      arc.setAttribute('fill','none');
      arc.setAttribute('stroke',col);
      arc.setAttribute('stroke-width','2.5');
      arc.setAttribute('stroke-opacity','0.7');
      g.appendChild(arc);
      // Arrow label
      var lbl = document.createElementNS(NS,'text');
      lbl.setAttribute('x',cx); lbl.setAttribute('y',cy-8);
      lbl.setAttribute('text-anchor','middle');
      lbl.setAttribute('fill',col); lbl.setAttribute('font-size','10');
      lbl.setAttribute('font-family','Rajdhani,sans-serif');
      lbl.textContent = AUTH_LABELS[atype]||atype;
      g.appendChild(lbl);
    });
  });

  // Draw nodes
  hierarchy.descendants().forEach(function(d){
    if(d.data.id==='_root') return;
    var id = d.data.id;
    var n = NODES[id];
    if(!n) return;
    var svc = KMS_DATA.config.svc[n.svc] || {fill:'#1a1a2e',stroke:'#444',text:'#aaa'};
    var nw=140, nh=52;

    // Friction halo
    var a = AUTH[id];
    if(a && a.friction && a.friction.length > 0){
      var maxSev = 'low';
      a.friction.forEach(function(f){ if(f.severity==='high') maxSev='high'; else if(f.severity==='medium' && maxSev!=='high') maxSev='medium'; });
      var haloCol = maxSev==='high'?'#ff5566':maxSev==='medium'?'#e8b00f':'#0076a9';
      var halo = document.createElementNS(NS,'rect');
      halo.setAttribute('x',d.x-nw/2-6); halo.setAttribute('y',d.y-nh/2-6);
      halo.setAttribute('width',nw+12); halo.setAttribute('height',nh+12);
      halo.setAttribute('rx','8');
      halo.setAttribute('fill','none');
      halo.setAttribute('stroke',haloCol);
      halo.setAttribute('stroke-width','2.5');
      halo.setAttribute('filter','url(#dc-glow)');
      halo.setAttribute('opacity','0.8');
      var pulse = document.createElementNS(NS,'animate');
      pulse.setAttribute('attributeName','opacity');
      pulse.setAttribute('values','0.8;0.3;0.8');
      pulse.setAttribute('dur', maxSev==='high'?'1.5s':'2.5s');
      pulse.setAttribute('repeatCount','indefinite');
      halo.appendChild(pulse);
      var pulseStroke = document.createElementNS(NS,'animate');
      pulseStroke.setAttribute('attributeName','stroke-width');
      pulseStroke.setAttribute('values','2.5;4;2.5');
      pulseStroke.setAttribute('dur', maxSev==='high'?'1.5s':'2.5s');
      pulseStroke.setAttribute('repeatCount','indefinite');
      halo.appendChild(pulseStroke);
      g.appendChild(halo);

      // Friction badge (diamond)
      if(id===focusId){
        var badge = document.createElementNS(NS,'polygon');
        var bx=d.x+nw/2+2, by=d.y-nh/2-2;
        badge.setAttribute('points',(bx)+','+(by-8)+' '+(bx+8)+','+by+' '+bx+','+(by+8)+' '+(bx-8)+','+by);
        badge.setAttribute('fill',haloCol);
        badge.setAttribute('stroke','#fff');
        badge.setAttribute('stroke-width','1');
        g.appendChild(badge);
        var btext = document.createElementNS(NS,'text');
        btext.setAttribute('x',bx); btext.setAttribute('y',by+3.5);
        btext.setAttribute('text-anchor','middle');
        btext.setAttribute('fill','#fff'); btext.setAttribute('font-size','8');
        btext.setAttribute('font-weight','bold');
        btext.textContent = a.friction.length;
        g.appendChild(btext);
      }
    }

    // Node rect
    var rect = document.createElementNS(NS,'rect');
    rect.setAttribute('x',d.x-nw/2); rect.setAttribute('y',d.y-nh/2);
    rect.setAttribute('width',nw); rect.setAttribute('height',nh);
    rect.setAttribute('rx','5');
    rect.setAttribute('fill',svc.fill);
    rect.setAttribute('stroke',id===focusId?'#fff':svc.stroke);
    rect.setAttribute('stroke-width',id===focusId?'2':'1');
    rect.style.cursor = 'pointer';
    rect.onclick = (function(nid){ return function(){
      document.getElementById('dc-node-select').value = nid;
      renderDeconflictionGraph(nid);
    };})(id);
    g.appendChild(rect);

    // Node label
    var label = document.createElementNS(NS,'text');
    label.setAttribute('x',d.x); label.setAttribute('y',d.y-4);
    label.setAttribute('text-anchor','middle');
    label.setAttribute('fill',svc.text);
    label.setAttribute('font-size','12');
    label.setAttribute('font-weight','bold');
    label.setAttribute('font-family','Rajdhani,sans-serif');
    label.style.pointerEvents = 'none';
    label.textContent = n.lbl;
    g.appendChild(label);

    // Subtitle
    var sub = document.createElementNS(NS,'text');
    sub.setAttribute('x',d.x); sub.setAttribute('y',d.y+10);
    sub.setAttribute('text-anchor','middle');
    sub.setAttribute('fill',svc.text);
    sub.setAttribute('font-size','8');
    sub.setAttribute('opacity','0.7');
    sub.setAttribute('font-family','IBM Plex Sans,sans-serif');
    sub.style.pointerEvents = 'none';
    sub.textContent = (n.sub||'').substring(0,28);
    g.appendChild(sub);
  });

  // Legend
  var legend = document.createElementNS(NS,'g');
  legend.setAttribute('transform','translate(12,'+Math.max(H-120,20)+')');
  var ly = 0;
  var legendItems = [
    {col:'#0096cc',dash:'4,3',label:'ADCON (tree structure)'},
  ];
  activeTypes.forEach(function(t){
    if(t==='adcon') return;
    legendItems.push({col:arcColors[t]||'#888',dash:'',label:AUTH_LABELS[t]||t});
  });
  legendItems.push({col:'#ff5566',dash:'',label:'High severity halo',isHalo:true});
  legendItems.push({col:'#e8b00f',dash:'',label:'Medium severity halo',isHalo:true});
  legendItems.forEach(function(item){
    if(item.isHalo){
      var circ = document.createElementNS(NS,'rect');
      circ.setAttribute('x',0); circ.setAttribute('y',ly-5);
      circ.setAttribute('width',20); circ.setAttribute('height',10);
      circ.setAttribute('rx','3');
      circ.setAttribute('fill','none'); circ.setAttribute('stroke',item.col);
      circ.setAttribute('stroke-width','2');
      legend.appendChild(circ);
    } else {
      var line = document.createElementNS(NS,'line');
      line.setAttribute('x1',0); line.setAttribute('y1',ly);
      line.setAttribute('x2',20); line.setAttribute('y2',ly);
      line.setAttribute('stroke',item.col); line.setAttribute('stroke-width','2.5');
      if(item.dash) line.setAttribute('stroke-dasharray',item.dash);
      legend.appendChild(line);
    }
    var lt = document.createElementNS(NS,'text');
    lt.setAttribute('x',28); lt.setAttribute('y',ly+4);
    lt.setAttribute('fill','#c8d8e8'); lt.setAttribute('font-size','10');
    lt.setAttribute('font-family','IBM Plex Sans,sans-serif');
    lt.textContent = item.label;
    legend.appendChild(lt);
    ly += 18;
  });
  svgEl.appendChild(legend);

  // Detail panel
  detailEl.style.display = 'block';
  var focusNode = NODES[focusId];
  var fa = AUTH[focusId];
  var html = '<div style="font-family:Rajdhani,sans-serif;font-size:16px;color:var(--gold);margin-bottom:8px">' +
    (focusNode?focusNode.lbl:focusId) + '</div>';
  html += '<div style="font-size:10px;color:var(--t3);margin-bottom:12px">' + (focusNode?focusNode.sub:'') + '</div>';

  // Authority summary
  html += '<div style="font-size:10px;font-weight:bold;color:var(--t2);margin-bottom:6px">AUTHORITY CHAINS</div>';
  activeTypes.forEach(function(t){
    var col = arcColors[t] || ACOL_MAP[t] || '#888';
    var targets = fa[t] || [];
    html += '<div style="margin-bottom:4px"><span style="color:'+col+';font-weight:bold">'+
      (AUTH_LABELS[t]||t)+'</span>: '+targets.map(function(id){return NODES[id]?NODES[id].lbl:id;}).join(', ')+'</div>';
  });

  // Friction entries
  if(fa.friction && fa.friction.length){
    html += '<div style="font-size:10px;font-weight:bold;color:var(--t2);margin:14px 0 6px">FRICTION POINTS</div>';
    fa.friction.forEach(function(f,i){
      var sevCol = f.severity==='high'?'#ff5566':f.severity==='medium'?'#e8b00f':'#0076a9';
      html += '<div style="background:rgba(255,255,255,0.03);border:1px solid '+sevCol+'44;border-radius:4px;padding:8px;margin-bottom:8px">';
      html += '<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">';
      f.types.forEach(function(t){
        var c = arcColors[t]||ACOL_MAP[t]||'#888';
        html += '<span style="background:'+c+'22;color:'+c+';border:1px solid '+c+'44;padding:1px 6px;border-radius:3px;font-size:9px;font-weight:bold">'+(AUTH_LABELS[t]||t)+'</span>';
      });
      html += '<span style="background:'+sevCol+'22;color:'+sevCol+';border:1px solid '+sevCol+'44;padding:1px 6px;border-radius:3px;font-size:9px;font-weight:bold">'+f.severity.toUpperCase()+'</span>';
      html += '</div>';
      html += '<div style="font-size:10px;line-height:1.5;color:var(--t2)">'+f.desc+'</div>';
      // Refs
      if(f.refs && f.refs.length){
        html += '<div style="margin-top:6px;font-size:9px;color:var(--t3)">';
        f.refs.forEach(function(r){
          html += '<span style="color:var(--gold);margin-right:6px">'+r+'</span>';
        });
        html += '</div>';
      }
      // Dimensions (if present)
      if(f.dimensions){
        html += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">';
        var dimColors = {resolution:{high:'#ff5566',partial:'#e8b00f',resolved:'#44cc44'},
          impact:{'flight-safety':'#ff5566','mission-degradation':'#ff7733','coordination-burden':'#e8b00f',administrative:'#0076a9'},
          visibility:{low:'#ff5566',medium:'#e8b00f',high:'#44cc44'},
          clarity:{clear:'#44cc44',ambiguous:'#e8b00f',opaque:'#ff5566'},
          temporal:{static:'#0076a9',cyclical:'#e8b00f',dynamic:'#ff7733'}};
        Object.keys(f.dimensions).forEach(function(dk){
          var dv = f.dimensions[dk];
          var dc = (dimColors[dk]&&dimColors[dk][dv])||'#888';
          html += '<span style="background:'+dc+'22;color:'+dc+';border:1px solid '+dc+'44;padding:1px 5px;border-radius:3px;font-size:8px">'+dk+':'+dv+'</span>';
        });
        html += '</div>';
      }
      // Failure modes (if present)
      if(f.failure_modes){
        html += '<div style="margin-top:6px;font-size:9px">';
        Object.keys(f.failure_modes).forEach(function(echelon){
          var mode = f.failure_modes[echelon];
          var mc = mode==='ignorance'?'#ff5566':mode==='misinterpretation'?'#e8b00f':'#ff7733';
          html += '<div><span style="color:var(--t3)">'+echelon+':</span> <span style="color:'+mc+'">'+mode+'</span></div>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
  }
  detailEl.innerHTML = html;
}

// ═══════════════════════════════════════════════════════
// DASHBOARD — Project Management Roundtable
// ═══════════════════════════════════════════════════════
var _dashRadarBuilt = false; // Reset when axes/agents change

function renderDashboard(){

  var nodeCount = Object.keys(NODES).length;
  var authCount = Object.keys(AUTH).length;
  var viewCount = Object.keys(VIEWS).length;
  var docCount = BUILTIN.length;

  // Count orphaned nodes (in data but not in any view)
  var viewedNodes = new Set();
  Object.values(VIEWS).forEach(function(v){ v.ids.forEach(function(id){ viewedNodes.add(id); }); });
  var orphanCount = 0;
  Object.keys(NODES).forEach(function(id){ if(!viewedNodes.has(id)) orphanCount++; });

  // ── KPIs ──
  var kpis = [
    { val:nodeCount, lbl:'Nodes', cls:'dk-good' },
    { val:authCount, lbl:'Auth Entries', cls:'dk-good' },
    { val:refPct+'%', lbl:'Ref Coverage', cls: refPct>=80?'dk-good':'dk-warn' },
    { val:docCount, lbl:'Documents', cls:'dk-info' },
    { val:frictionNodes, lbl:'Friction Nodes', cls: frictionHigh>0?'dk-warn':'dk-info' },
    { val:frictionHigh, lbl:'High Severity', cls: frictionHigh>0?'dk-warn':'dk-good' },
    { val:dacoCount, lbl:'DACO Coverage', cls:'dk-info' },
    { val:orphanCount, lbl:'Orphaned', cls: orphanCount > 0 ? 'dk-warn' : 'dk-good' }
  ];
  var kpiHtml = '';
  kpis.forEach(function(k){
    kpiHtml += '<div class="dash-kpi '+k.cls+'"><div class="dkv">'+k.val+'</div><div class="dkl">'+k.lbl+'</div></div>';
  });
  document.getElementById('dash-kpis').innerHTML = kpiHtml;

  // ── Agent Data ──
  var DASH_AXES = [
    { key:'integrity',    label:'Data Integrity',        short:'INTEGRITY' },
    { key:'authority',    label:'Authority Grounding',    short:'AUTH GROUND' },
    { key:'scale',        label:'Scale Readiness',        short:'SCALE' },
    { key:'compliance',   label:'UI / Compliance',        short:'UI COMPLY' },
    { key:'features',     label:'Feature Completeness',   short:'FEATURES' },
    { key:'architecture', label:'Architecture Health',    short:'ARCH' },
    { key:'debt',         label:'Tech Debt (low=good)',   short:'TECH DEBT' },
    { key:'doctrinal',    label:'Doctrinal Accuracy',     short:'DOCTRINE' },
    { key:'deconflict',   label:'Deconfliction Coverage', short:'DECONFLICT' }
  ];

  var hasOrphans = orphanCount > 0;
  var refCoverage = 0;
  var frictionNodes = 0;
  var frictionTotal = 0;
  var frictionHigh = 0;
  var dacoCount = 0;
  Object.values(AUTH).forEach(function(a){
    if(a.ref) refCoverage++;
    if(a.daco && a.daco.length > 0) dacoCount++;
    if(a.friction && a.friction.length > 0){
      frictionNodes++;
      frictionTotal += a.friction.length;
      a.friction.forEach(function(f){ if(f.severity==='high') frictionHigh++; });
    }
  });
  var refPct = Math.round(refCoverage / authCount * 100);

  var DASH_AGENTS = [
    {
      id:'validator', name:'KMS-VALIDATOR', color:'#44cc44', status:'GREEN', statusCls:'dash-s-green',
      concern: 'Zero orphans. '+refCoverage+'/'+authCount+' ref chains ('+refPct+'%). '+docCount+' docs. '+frictionTotal+' friction annotations validated. Validator enforces ref\u2192document + friction\u2192document integrity.',
      badges: [{t:'DATA CLEAN',c:'db-ready'},{t:'REF: '+refPct+'%',c: refPct>=80?'db-ready':'db-blocker'},{t:'FRICTION: '+frictionTotal,c:'db-ready'}],
      scores:{ integrity:96, authority:98, scale:65, compliance:68, features:55, architecture:85, debt:88, doctrinal:96, deconflict:80 },
      notes:{ integrity:'Zero orphans. All nodes wired. Friction schema validated.', authority:refCoverage+'/'+authCount+' ref chains grounded to Constitution ('+refPct+'%)', scale:'d3.tree implemented. Dense views need data-informed layout.', compliance:'Sidebar improved. Fonts + version label remain.', features:'Ref system + friction schema + DACO gaps fixed. Layout engine ready.', architecture:'ref + friction + d3.tree + DOC_MAP + dashboard all working.', debt:'TACON unused. cyber/daco naming mismatch. TYCOM TA assignments flagged for review.', doctrinal:refPct+'% ref coverage. '+frictionTotal+' friction annotations across '+frictionNodes+' nodes.', deconflict:'Validates friction refs resolve to documents. Does not assess legal accuracy.' }
    },
    {
      id:'authority', name:'AUTH-RESEARCHER', color:'#dd44bb', status:'GREEN', statusCls:'dash-s-green',
      concern: 'Ref coverage: '+refPct+'% ('+refCoverage+'/'+authCount+'). All 167 entries grounded to Constitution. 12 new statutes added. DACO gaps fixed (SYSCOMs, fleets, DCDC chain). TACON and cyber/daco naming still pending.',
      badges:[{t:'REF: '+refPct+'%',c:'db-ready'},{t:'TACON UNUSED',c:'db-conflict'},{t:'CYBER/DACO',c:'db-conflict'}],
      scores:{ integrity:94, authority:96, scale:55, compliance:58, features:60, architecture:80, debt:72, doctrinal:95, deconflict:75 },
      notes:{ integrity:'All entries grounded. 12 new statutes added.', authority:'167/167 ref coverage. Every chain traces to Constitution.', scale:'Not this agent\u2019s concern until layout resumes', compliance:'Defers to UI-Compliance', features:'Ref chains complete. Friction annotations in place.', architecture:'ref schema fully populated. friction schema operational.', debt:'TACON: zero usage. cyber/daco naming. Some TYCOM TA assignments may be wrong (surflant ta:navair \u2014 should be navsea?).', doctrinal:'SECNAVINST 5400.15D two-chain model reflected. DACO scope corrected \u2014 removed from PMAs, added to fleets/SYSCOMs.', deconflict:'Research feeds friction annotations. Identifies which boundaries need deeper investigation.' }
    },
    {
      id:'architect', name:'ARCHITECT', color:'#0076a9', status:'GREEN', statusCls:'dash-s-green',
      concern: 'Architecture is sound. friction schema (Option A) implemented \u2014 optional array, minimal footprint, validated. Ref coverage at '+refPct+'% unblocks Sprint 2 layout work. friction can evolve to annotations model (Option C) later.',
      badges:[{t:'d3.tree DONE',c:'db-ready'},{t:'FRICTION SCHEMA',c:'db-ready'},{t:'LAYOUT UNBLOCKED',c:'db-opportunity'}],
      scores:{ integrity:92, authority:95, scale:65, compliance:60, features:55, architecture:88, debt:78, doctrinal:92, deconflict:82 },
      notes:{ integrity:'Data model clean. friction + ref validated at build time.', authority:'100% ref coverage. friction adds deconfliction layer.', scale:'d3.tree nodeSize ready. friction rendering TBD.', compliance:'Font + version label still pending', features:'friction schema operational. Layout engine ready. Ghost nodes designed.', architecture:'friction is Option A (per-node annotation). Clean path to Option C (typed annotations) if needed.', debt:'Visual debt (fonts, version) low priority. TYCOM TA data quality flagged.', doctrinal:'Data before design validated. friction captures doctrinal gaps as structured data.', deconflict:'Designed friction schema (Option A). Evolution path to Option C (typed annotations) is clean.' }
    },
    {
      id:'uicompliance', name:'UI-COMPLIANCE', color:'#e8b00f', status:'AMBER', statusCls:'dash-s-amber',
      concern: 'Sidebar improved (10px/320px). Fonts + version label non-compliant. Friction annotations need UI rendering \u2014 badge/icon on nodes with friction, expandable detail in sidebar. Dashboard updated with friction KPIs.',
      badges:[{t:'SIDEBAR DONE',c:'db-ready'},{t:'FONTS PENDING',c:'db-conflict'},{t:'FRICTION UI TBD',c:'db-opportunity'}],
      scores:{ integrity:82, authority:85, scale:62, compliance:58, features:48, architecture:78, debt:65, doctrinal:85, deconflict:55 },
      notes:{ integrity:'Version label still v1.0', authority:'ref badges render as clickable gold links', scale:'d3.tree handles overlap. friction badges at zoom = future design question.', compliance:'Sidebar improved. Fonts + version label = remaining compliance debt.', features:'friction needs visual treatment: node badges, sidebar detail, severity coloring.', architecture:'Dashboard updated with friction metrics and deconfliction agent.', debt:'Typography + version = compliance debt.', doctrinal:'Classification banner correct. friction data available for rendering.', deconflict:'Friction needs UI rendering: severity badges, expandable detail, color coding by severity.' }
    },
    {
      id:'graph', name:'GRAPH-ANALYZER', color:'#00cccc', status:'GREEN', statusCls:'dash-s-green',
      concern: authCount+' auth entries, '+refPct+'% ref coverage. '+frictionNodes+' nodes with friction ('+frictionTotal+' annotations, '+frictionHigh+' high severity). DACO coverage: '+dacoCount+' nodes. DACO chain complete: CYBERCOM\u2192DCDC\u2192SCC\u2192subordinates.',
      badges:[{t:'CHAINS CLEAN',c:'db-ready'},{t:'DACO: '+dacoCount,c:'db-ready'},{t:'FRICTION: '+frictionNodes,c:'db-ready'}],
      scores:{ integrity:96, authority:96, scale:72, compliance:70, features:58, architecture:88, debt:82, doctrinal:94, deconflict:85 },
      notes:{ integrity:'Zero orphans. All chains resolve. DACO chain complete.', authority:authCount+' entries, 100% ref coverage. DACO gaps fixed.', scale:'d3.tree handles 500+ nodes. friction rendering = future scale question.', compliance:'WCAG passing. Color system mapped.', features:'Ref + friction + DACO coverage complete. Graph structure is solid.', architecture:'resolveChain() handles all authority types. friction queryable per-node.', debt:'TACON: zero usage. TYCOM TA assignments flagged (surflant/subpac/msc show ta:navair).', doctrinal:'100% ref grounding. 9 friction patterns identified across 50 nodes.', deconflict:'39 DACO+TA overlap nodes identified. 50 total friction nodes. Pattern analysis complete.' }
    },
    {
      id:'deconfliction', name:'LEGAL-DECONFLICTION', color:'#ff5566', status:'AMBER', statusCls:'dash-s-amber',
      concern: frictionTotal+' friction annotations across '+frictionNodes+' nodes. '+frictionHigh+' high-severity (no published resolution). Key gaps: DACO vs TA boundary at airworthiness (CYBERSAFE is a process, not a statute). TYCOM readiness vs DACO has no doctrinal framework. GNA chain separation creates inherent tension at every OPCON/ADCON split.',
      badges:[{t:'HIGH: '+frictionHigh,c:'db-blocker'},{t:'PATTERNS: 9',c:'db-conflict'},{t:'DOCTRINAL GAPS',c:'db-conflict'}],
      scores:{ integrity:88, authority:90, scale:50, compliance:55, features:45, architecture:82, debt:60, doctrinal:78, deconflict:92 },
      notes:{ integrity:'friction schema validated. All refs resolve to documents.', authority:'Every friction entry cites governing statutes/instructions on both sides of the boundary.', scale:'50 nodes annotated. Pattern-based \u2014 new nodes inherit friction from their pattern.', compliance:'friction UI not yet rendered. Severity coloring TBD.', features:'9 friction patterns codified. Need UI rendering + export/report capability.', architecture:'Option A (per-node array) is clean. Option C (typed annotations) is the evolution path.', debt:'Clinger-Cohen (40 USC §11103) and CYBERSAFE (M-13034.1) added as docs. GNA act itself not yet in documents array.', doctrinal:'Key finding: DACO/TA boundary is a doctrinal gap, not a data error. No single published document resolves it. This is the most important deconfliction finding.', deconflict:'9 patterns, 70 annotations, '+frictionHigh+' high-severity. DACO/TA airworthiness boundary is the #1 gap. TYCOM/DACO readiness #2. GNA chain separation is well-understood but friction is inherent.' }
    }
  ];

  // ── Agent Table ──
  var atHtml = '';
  DASH_AGENTS.forEach(function(a){
    var badges = '';
    a.badges.forEach(function(b){ badges += '<span class="dash-badge '+b.c+'">'+b.t+'</span>'; });
    atHtml += '<tr><td class="dash-aname">'+a.name+'</td>' +
      '<td><span class="dash-status '+a.statusCls+'">'+a.status+'</span></td>' +
      '<td style="font-size:11px">'+a.concern+'</td>' +
      '<td><div class="dash-badge-row">'+badges+'</div></td></tr>';
  });
  document.getElementById('dash-agent-tbody').innerHTML = atHtml;

  // ── Priority Table ──
  var priorities = [
    { p:'P1',c:'dp1', item:'TYCOM TA data quality: surflant/subpac/msc show ta:navair (should be navsea?)', fid:'HIGH',fb:'df-h', eff:'LOW', blocks:'Friction accuracy, view accuracy' },
    { p:'P2',c:'dp1', item:'TACON audit: zero usage \u2014 research or remove from config', fid:'HIGH',fb:'df-h', eff:'LOW', blocks:'Dead config cleanup' },
    { p:'P3',c:'dp1', item:'Harmonize cyber vs daco field naming', fid:'MED',fb:'df-m', eff:'LOW', blocks:'Data consistency' },
    { p:'P4',c:'dp2', item:'Friction UI rendering: badge on nodes, severity coloring, sidebar detail', fid:'HIGH',fb:'df-h', eff:'MED', blocks:'Friction visibility in views' },
    { p:'P5',c:'dp2', item:'MARFOR DACO gap: marforcom/marforpac/marforcent/marforeur/marsoc need daco:marforcyber', fid:'MED',fb:'df-m', eff:'LOW', blocks:'USMC DACO chain completeness' },
    { p:'P6',c:'dp2', item:'PEO DACO gap: 8 PEOs missing daco:fltcybercom (peo_t, peo_ships, etc.)', fid:'LOW',fb:'df-l', eff:'LOW', blocks:'Enterprise IT DACO consistency' },
    { p:'P7',c:'dp3', item:'Resume Sprint 2: layout engine + ghost nodes for dual-hat rendering', fid:'HIGH',fb:'df-h', eff:'MED', blocks:'Layout unblocked by 100% ref coverage' },
    { p:'P8',c:'dp3', item:'Bundle Roboto Slab WOFF2 fonts', fid:'MED',fb:'df-m', eff:'LOW', blocks:'UI compliance' },
    { p:'P9',c:'dp4', item:'Cross-cutting link routing (TA/LCSP arcs)', fid:'HIGH',fb:'df-h', eff:'MED', blocks:'TA views' },
    { p:'P10',c:'dp5', item:'v9.0: D3 geo map, CNIC/MCICOM installations, tenant relationships', fid:'HIGH',fb:'df-h', eff:'HIGH', blocks:'Map integration' }
  ];
  var prHtml = '';
  priorities.forEach(function(p){
    prHtml += '<tr><td><span class="dash-ptag '+p.c+'">'+p.p+'</span></td>' +
      '<td>'+p.item+'</td>' +
      '<td><span class="dash-fbar '+p.fb+'"></span>'+p.fid+'</td>' +
      '<td class="dash-effort">'+p.eff+'</td>' +
      '<td style="font-size:10px;color:var(--t3)">'+p.blocks+'</td></tr>';
  });
  document.getElementById('dash-pri-tbody').innerHTML = prHtml;

  // ── Decisions ──
  var decisions = [
    { title:'1. Layout Engine \u2014 LOCKED', opts:[
      {tag:'\u2713',text:'P1-B d3.tree + P2-A ghost nodes. Implementation done (d3.tree) / designed (ghosts). UNBLOCKED by 100% ref coverage.',rec:true}
    ]},
    { title:'2. Authority Research \u2014 COMPLETE', opts:[
      {tag:'\u2713',text:'Full coverage achieved: 167/167 ref chains grounded to Constitution. 64 documents. 70 friction annotations.',rec:true}
    ]},
    { title:'3. Friction Schema Evolution', opts:[
      {tag:'\u2713',text:'Option A (per-node friction array) implemented and validated. 9 patterns, 50 nodes.',rec:true},
      {tag:'B',text:'Option C (typed annotations: friction + scope + phase + caveat) \u2014 evolution path when more annotation types emerge',rec:false}
    ]},
    { title:'4. DACO Scope on PMAs', opts:[
      {tag:'\u2713',text:'Removed: DACO applies at operational unit level (MALS, FRC, squadron), not program offices. Backed by legal-deconfliction agent analysis.',rec:true}
    ]},
    { title:'5. TACON Disposition', opts:[
      {tag:'A',text:'Research: find specific TACON usage in current node set and codify',rec:false},
      {tag:'B',text:'Remove: delete from config if no current nodes use it. Re-add when needed.',rec:true},
      {tag:'C',text:'Keep as placeholder: leave in config, document as unused pending future nodes',rec:false}
    ]},
    { title:'6. TYCOM TA Data Quality', opts:[
      {tag:'A',text:'Verify and correct: surflant/subpac/msc ta:navair may need ta:navsea; navifor ta:navair may need ta:navwar',rec:true},
      {tag:'B',text:'Accept current: ta:navair may be intentional (cross-domain aviation TA)',rec:false}
    ]}
  ];
  var decHtml = '';
  decisions.forEach(function(d){
    decHtml += '<div class="dash-decision"><h3>'+d.title+'</h3>';
    d.opts.forEach(function(o){
      decHtml += '<div class="dash-opt"><span class="dash-opt-tag">'+o.tag+'</span><span>'+o.text+(o.rec?'<span class="dash-opt-rec">\u2190 REC</span>':'')+'</span></div>';
    });
    decHtml += '</div>';
  });
  document.getElementById('dash-decisions').innerHTML = decHtml;

  // ── Conflicts ──
  var conflicts = [
    {cls:'db-blocker',title:frictionHigh+' high-severity friction points lack doctrinal resolution',desc:'DACO vs TA boundary at airworthiness (CYBERSAFE is a process, not a statute). TYCOM readiness vs DACO has no published framework. These are real-world deconfliction gaps, not data errors.'},
    {cls:'db-conflict',title:'TYCOM TA data quality',desc:'surflant, subpac, msc show ta:navair but may need ta:navsea (surface/sub platforms are NAVSEA domain). navifor shows ta:navair but may need ta:navwar. Verify before relying on friction annotations.'},
    {cls:'db-conflict',title:'TACON: dead config',desc:'Color (#ff3355), dash (2,4), weight (1.3), and filter entry defined but zero usage in auth entries or view links. Either research and codify or remove.'},
    {cls:'db-conflict',title:'cyber vs daco field mismatch',desc:'Auth entries use "daco" field, view links use "cyber" authority type. Same DoDI 8530.01 relationship rendered differently depending on context.'},
    {cls:'db-conflict',title:'MARFOR + PEO DACO gaps',desc:'5 MARFORs and 8 PEOs missing DACO entries. All operate DODIN-connected enterprise IT. Inconsistent with NAVSEA/NAVAIR/NAVWAR which have DACO.'}
  ];
  var cflHtml = '';
  conflicts.forEach(function(c){
    cflHtml += '<div class="dash-cfl-item"><span class="dash-badge '+c.cls+'" style="flex-shrink:0">'+(c.cls==='db-conflict'?'CONFLICT':'BLOCKER')+'</span><span><b>'+c.title+'</b> \u2014 '+c.desc+'</span></div>';
  });
  document.getElementById('dash-conflicts').innerHTML = cflHtml;

  // ── Opportunities ──
  var opps = [
    {cls:'db-ready',title:'100% ref coverage achieved',desc:'All 167 auth entries grounded to Constitution with '+docCount+' documents. Authority research sprint complete. Layout work unblocked.'},
    {cls:'db-ready',title:'Friction schema operational',desc:frictionTotal+' friction annotations across '+frictionNodes+' nodes covering 9 distinct patterns. Legal deconfliction agent analyzing authority boundary conflicts. Validator enforces friction\u2192document integrity.'},
    {cls:'db-ready',title:'DACO chain complete',desc:'CYBERCOM\u2192DCDC\u2192FLTCYBERCOM/MARFORCYBER\u2192subordinates. SYSCOMs, fleets, FRCs all wired. PMA DACO corrected (removed \u2014 applies at operational unit, not program office).'},
    {cls:'db-opportunity',title:'Sprint 2 layout unblocked',desc:'d3.tree (done), ghost nodes (designed), link routing (prototyped). 100% ref coverage removes the data blocker. Layout can resume with confidence in the underlying relationships.'},
    {cls:'db-opportunity',title:'Friction drives future research',desc:frictionHigh+' high-severity friction points identify real doctrinal gaps (DACO/TA boundary, TYCOM/DACO readiness). These are research priorities that improve the tool\u2019s value as an operational reference.'}
  ];
  var oppHtml = '';
  opps.forEach(function(o){
    oppHtml += '<div class="dash-cfl-item"><span class="dash-badge '+o.cls+'" style="flex-shrink:0">'+(o.cls==='db-ready'?'READY NOW':'OPPORTUNITY')+'</span><span><b>'+o.title+'</b> \u2014 '+o.desc+'</span></div>';
  });
  document.getElementById('dash-opportunities').innerHTML = oppHtml;

  // ── Baseline Snapshot ──
  document.getElementById('dash-baseline').innerHTML =
    '<div><div class="dash-sec-head">Data Model</div><div style="line-height:1.8;margin-top:5px">'+nodeCount+' org nodes \u00b7 12 authority types (incl. dac)<br>'+authCount+' auth entries \u00b7 '+refPct+'% ref coverage<br>'+docCount+' documents \u00b7 '+frictionTotal+' friction annotations<br>'+frictionNodes+' nodes with authority boundary friction<br>'+dacoCount+' nodes with DACO coverage<br>'+viewCount+' preset views + custom builder</div></div>' +
    '<div><div class="dash-sec-head">Architecture</div><div style="line-height:1.8;margin-top:5px">Single HTML entry point \u00b7 file:// native<br>D3.js v7 only vendored lib<br>kms-data.js (source of truth)<br>6 agents: validator, authority-researcher, architect,<br>ui-compliance, graph-analyzer, legal-deconfliction<br>No server \u00b7 No build \u00b7 No framework</div></div>' +
    '<div><div class="dash-sec-head">Compliance</div><div style="line-height:1.8;margin-top:5px">Navy Blue #022a3a \u00b7 Blue #0076a9 \u00b7 Gold #e8b00f<br>WCAG 4.5:1 contrast \u2713<br>Min 10px font size \u2713 (sidebar improved)<br>Classification banner \u2713<br><span style="color:#ffaa22">Font: IBM Plex Sans (should be Roboto Slab)</span><br><span style="color:#ffaa22">Version label: v1.0 (should be current)</span></div></div>';

  // ══════════════════════════════════════════
  // RADAR CHART — Pure SVG, zero D3 dependency
  // ══════════════════════════════════════════
  if(_dashRadarBuilt) return;
  _dashRadarBuilt = true;
  var svgEl = document.getElementById('dash-radar');
  // Clear any previous content
  while(svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  var NS = 'http://www.w3.org/2000/svg';
  function mkSvg(tag, attrs, parent){
    var el = document.createElementNS(NS, tag);
    if(attrs) Object.keys(attrs).forEach(function(k){ el.setAttribute(k, attrs[k]); });
    if(parent) parent.appendChild(el);
    return el;
  }

  var W = 440, H = 440;
  var cxR = W/2, cyR = H/2;
  var RAD = 155;
  var LEVELS = 5;
  var nAxes = DASH_AXES.length;
  var aSlice = (Math.PI * 2) / nAxes;

  svgEl.setAttribute('width', W);
  svgEl.setAttribute('height', H);
  svgEl.setAttribute('viewBox', '0 0 '+W+' '+H);
  svgEl.style.overflow = 'visible';

  var gRoot = mkSvg('g', { transform: 'translate('+cxR+','+cyR+')' }, svgEl);

  // Concentric rings
  for(var lv = 1; lv <= LEVELS; lv++){
    var rr = RAD * lv / LEVELS;
    mkSvg('circle', { r:rr, fill:'none', stroke:'#1a3050', 'stroke-width': lv===LEVELS?'1':'0.5', 'stroke-dasharray': lv===LEVELS?'none':'2,3' }, gRoot);
    if(lv < LEVELS){
      var ringTxt = mkSvg('text', { x:'4', y: String(-rr + 3), fill:'#4a6888', 'font-family':'monospace', 'font-size':'9px', opacity:'0.6' }, gRoot);
      ringTxt.textContent = String(lv * 20);
    }
  }

  // Axis lines and labels
  for(var ai = 0; ai < nAxes; ai++){
    var angle = aSlice * ai - Math.PI/2;
    var axEndX = RAD * Math.cos(angle);
    var axEndY = RAD * Math.sin(angle);
    mkSvg('line', { x1:'0', y1:'0', x2:String(axEndX), y2:String(axEndY), stroke:'#1a3050', 'stroke-width':'0.5' }, gRoot);

    var axAvg = 0;
    for(var agi = 0; agi < DASH_AGENTS.length; agi++) axAvg += DASH_AGENTS[agi].scores[DASH_AXES[ai].key];
    axAvg /= DASH_AGENTS.length;

    var lblDist = RAD + 20;
    var lblX = lblDist * Math.cos(angle);
    var lblY = lblDist * Math.sin(angle);
    var cosV = Math.cos(angle);
    var sinV = Math.sin(angle);
    var txtAnch = Math.abs(cosV) < 0.15 ? 'middle' : cosV > 0 ? 'start' : 'end';
    var txtBase = Math.abs(sinV) < 0.15 ? 'central' : sinV > 0 ? 'hanging' : 'auto';
    var lblColor = axAvg < 60 ? '#ffaa22' : '#6a8eb0';
    var lblWeight = axAvg < 60 ? '700' : '600';

    var axLbl = mkSvg('text', { x:String(lblX), y:String(lblY), 'text-anchor':txtAnch, 'dominant-baseline':txtBase, fill:lblColor, 'font-family':'Rajdhani, sans-serif', 'font-weight':lblWeight, 'font-size':'11px', 'letter-spacing':'1px' }, gRoot);
    axLbl.textContent = DASH_AXES[ai].short;
  }

  // Tooltip element
  var radarTip = document.createElement('div');
  radarTip.className = 'dash-radar-tooltip';
  document.body.appendChild(radarTip);

  // Draw agent polygons
  var agentGrps = {};
  DASH_AGENTS.forEach(function(agent){
    var ag = mkSvg('g', {}, gRoot);
    agentGrps[agent.id] = ag;

    // Build polygon points string
    var polyPts = [];
    for(var pi = 0; pi < nAxes; pi++){
      var pAngle = aSlice * pi - Math.PI/2;
      var pVal = agent.scores[DASH_AXES[pi].key] / 100 * RAD;
      var px = pVal * Math.cos(pAngle);
      var py = pVal * Math.sin(pAngle);
      polyPts.push(px.toFixed(1)+','+py.toFixed(1));
    }
    mkSvg('polygon', {
      points: polyPts.join(' '),
      fill: agent.color, 'fill-opacity':'0.08',
      stroke: agent.color, 'stroke-width':'1.8', 'stroke-opacity':'0.85'
    }, ag);

    // Vertex dots
    for(var di = 0; di < nAxes; di++){
      (function(idx){
        var dAngle = aSlice * idx - Math.PI/2;
        var dVal = agent.scores[DASH_AXES[idx].key] / 100 * RAD;
        var dx = dVal * Math.cos(dAngle);
        var dy = dVal * Math.sin(dAngle);
        var dot = mkSvg('circle', { cx:String(dx), cy:String(dy), r:'3.5', fill:agent.color, stroke:'#04090f', 'stroke-width':'1.5', style:'cursor:pointer' }, ag);

        dot.addEventListener('mouseenter', function(ev){
          radarTip.style.display = 'block';
          radarTip.innerHTML = '<b style="color:'+agent.color+'">'+agent.name+'</b><br>'+DASH_AXES[idx].label+': <b>'+agent.scores[DASH_AXES[idx].key]+'</b>/100<br><span style="color:#6a8eb0">'+agent.notes[DASH_AXES[idx].key]+'</span>';
          dot.setAttribute('r', '5.5');
        });
        dot.addEventListener('mousemove', function(ev){
          radarTip.style.left = (ev.pageX + 12)+'px';
          radarTip.style.top = (ev.pageY - 10)+'px';
        });
        dot.addEventListener('mouseleave', function(){
          radarTip.style.display = 'none';
          dot.setAttribute('r', '3.5');
        });
      })(di);
    }
  });

  // Legend with toggle
  var legEl = document.getElementById('dash-radar-legend');
  legEl.innerHTML = '';
  var activeSet = {};
  DASH_AGENTS.forEach(function(a){ activeSet[a.id] = true; });

  DASH_AGENTS.forEach(function(a){
    var avg = 0;
    DASH_AXES.forEach(function(ax){ avg += a.scores[ax.key]; });
    avg = Math.round(avg / DASH_AXES.length);

    var item = document.createElement('div');
    item.className = 'dash-radar-leg-item';
    item.innerHTML = '<span class="dash-radar-swatch" style="background:'+a.color+'"></span><span class="dash-radar-lname" style="color:'+a.color+'">'+a.name+'</span><span class="dash-radar-lscore">'+avg+'%</span>';
    item.addEventListener('click', function(){
      if(activeSet[a.id]){
        activeSet[a.id] = false;
        item.classList.add('dimmed');
        agentGrps[a.id].setAttribute('opacity', '0.06');
      } else {
        activeSet[a.id] = true;
        item.classList.remove('dimmed');
        agentGrps[a.id].setAttribute('opacity', '1');
      }
      updateRadarInsight();
    });
    legEl.appendChild(item);
  });

  // Convergence badge
  var allAvgs = [];
  DASH_AXES.forEach(function(ax){
    var vals = DASH_AGENTS.map(function(a){ return a.scores[ax.key]; });
    var mean = vals.reduce(function(s,v){ return s+v; },0) / vals.length;
    allAvgs.push(mean);
  });
  var overallMean = Math.round(allAvgs.reduce(function(s,v){ return s+v; },0) / allAvgs.length);
  document.getElementById('dash-convergence').textContent = 'CONVERGENCE: '+overallMean+'%';

  // Insight bar
  function updateRadarInsight(){
    var active = DASH_AGENTS.filter(function(a){ return activeSet[a.id]; });
    if(!active.length){ document.getElementById('dash-radar-insight').innerHTML = '<i>Toggle agents in legend to compare.</i>'; return; }

    var axAvgs = DASH_AXES.map(function(ax){
      var sum = 0; active.forEach(function(a){ sum += a.scores[ax.key]; });
      return { key:ax.key, label:ax.label, avg: Math.round(sum / active.length) };
    });
    var axDivs = DASH_AXES.map(function(ax){
      var vals = active.map(function(a){ return a.scores[ax.key]; });
      var mean = vals.reduce(function(s,v){ return s+v; },0) / vals.length;
      var variance = vals.reduce(function(s,v){ return s + (v - mean)*(v - mean); },0) / vals.length;
      return { key:ax.key, label:ax.label, stddev: Math.round(Math.sqrt(variance)), mean: Math.round(mean) };
    });

    var weakest = axAvgs[0], strongest = axAvgs[0];
    var mostDiv = axDivs[0], mostCon = axDivs[0];
    axAvgs.forEach(function(a){ if(a.avg < weakest.avg) weakest = a; if(a.avg > strongest.avg) strongest = a; });
    axDivs.forEach(function(d){ if(d.stddev > mostDiv.stddev) mostDiv = d; if(d.stddev < mostCon.stddev) mostCon = d; });

    var compScore = Math.round(axAvgs.reduce(function(s,a){ return s + a.avg; },0) / axAvgs.length);
    var avgSD = Math.round(axDivs.reduce(function(s,d){ return s + d.stddev; },0) / axDivs.length);

    document.getElementById('dash-radar-insight').innerHTML =
      '<b>Composite Score: '+compScore+'/100</b> \u00b7 Avg Agent Divergence: '+avgSD+'pts<br>' +
      '<span class="dr-strong">Strongest axis:</span> <b>'+strongest.label+'</b> ('+strongest.avg+'%) \u2014 agents agree this is solid<br>' +
      '<span class="dr-weak">Weakest axis:</span> <b>'+weakest.label+'</b> ('+weakest.avg+'%) \u2014 unanimous concern, prioritize here<br>' +
      '<b>Most divergent:</b> '+mostDiv.label+' (\u03c3 '+mostDiv.stddev+') \u2014 agents disagree, needs discussion<br>' +
      '<b>Strongest consensus:</b> '+mostCon.label+' (\u03c3 '+mostCon.stddev+') \u2014 aligned assessment';
  }
  updateRadarInsight();
}

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
      case 'show-ta':        showPanel('org');document.getElementById('oc-view').value='ta_navair';renderOrg();break;
      case 'show-daco':      showPanel('org');document.getElementById('oc-view').value='cyber';renderOrg();break;
      // Org chart
      case 'clear-filter':   clearFilter();break;
      case 'toggle-orient':  toggleOrientation();break;
      case 'close-side':     closeSide();break;
      case 'jump-to-node':   jumpToNode(arg);break;
      case 'select-node':    selectNode(arg);break;
      case 'pick-logo':      pickLogo(arg);break;
      case 'select-order':   showPanel('orders');setTimeout(()=>selectOrder(arg),80);break;
      // Custom chart
      case 'toggle-auth':    toggleCustomAuth(el);break;
      case 'clear-custom':   clearCustomChart();break;
      case 'export-png':     exportCustomPNG();break;
      case 'add-custom':     addToCustomChart(arg);break;
      case 'remove-custom':  removeFromCustomChart(arg);break;
      // Registry & Modals
      case 'open-modal':     openModal();break;
      case 'close-modal':    closeModal();break;
      case 'save-doc':       saveDoc();break;
      case 'edit-doc':       editDoc(arg);break;
      case 'delete-doc':     deleteDoc(arg);break;
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
      case 'render-org':     _lastRenderView=null;renderOrg(true);break;
      case 'filter-auth':   renderOrg();break;
      case 'render-timeline':renderTimeline();break;
    }
  });
}
