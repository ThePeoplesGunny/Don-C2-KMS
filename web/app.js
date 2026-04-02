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
  var map={org:0,orders:1,timeline:2,registry:3,accuracy:4,dashboard:5};
  document.querySelectorAll('.tab')[map[id]].classList.add('on');
  if(id==='org')setTimeout(function(){renderOrg(true);},50);
  if(id==='orders')renderOrders();
  if(id==='timeline')renderTimeline();
  if(id==='registry')renderRegistry();
  if(id==='accuracy')runValidation();
  if(id==='dashboard')setTimeout(renderDashboard,60);
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
  var hierarchy=d3.hierarchy(buildHier(rootId));
  d3.tree().nodeSize([186,146]).separation(function(a,b){
    return a.parent===b.parent ? 1.0 : 1.5;
  })(hierarchy);

  // Extract positions as {id:{x,y}} objects
  var pos={};
  var minX=Infinity;
  hierarchy.descendants().forEach(function(d){
    pos[d.data.id]={x:d.x, y:d.y};
    if(d.x<minX) minX=d.x;
  });
  // Normalize X to positive origin
  var xShift=40-minX;
  Object.keys(pos).forEach(function(id){ pos[id].x+=xShift; });

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
  var hierarchy=d3.hierarchy(treeRoot);
  d3.tree().nodeSize([186,146]).separation(function(a,b){
    return a.parent===b.parent ? 1.0 : 1.5;
  })(hierarchy);

  // Extract positions — d3.tree uses x=horizontal (centered), y=vertical (depth*nodeSize[1])
  var posMap={};
  var minX=Infinity;
  hierarchy.descendants().forEach(function(d){
    if(d.data.id==='__vroot__')return;
    var py=vrootUsed ? d.y-146 : d.y; // Strip virtual root tier
    posMap[d.data.id]=[d.x, py];
    if(d.x<minX)minX=d.x;
  });

  // Normalize X so minimum is at 40px (d3.tree centers at 0, can go negative)
  var xShift=40-minX;
  ids.forEach(function(id){
    if(posMap[id]){
      posMap[id][0]+=xShift;
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
        .attr('fill',sc2.fill).text('\u25c6 '+dhLabel(n.id,n.dh));
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
// DASHBOARD — Project Management Roundtable
// ═══════════════════════════════════════════════════════
var _dashRadarBuilt = false;

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
    { val:viewCount, lbl:'Views', cls:'dk-good' },
    { val:orphanCount, lbl:'Orphaned Nodes', cls: orphanCount > 0 ? 'dk-warn' : 'dk-good' },
    { val:docCount, lbl:'Documents', cls:'dk-info' },
    { val:0, lbl:'Errors', cls:'dk-good' }
  ];
  var kpiHtml = '';
  kpis.forEach(function(k){
    kpiHtml += '<div class="dash-kpi '+k.cls+'"><div class="dkv">'+k.val+'</div><div class="dkl">'+k.lbl+'</div></div>';
  });
  document.getElementById('dash-kpis').innerHTML = kpiHtml;

  // ── Agent Data ──
  var DASH_AXES = [
    { key:'integrity',    label:'Data Integrity',       short:'INTEGRITY' },
    { key:'authority',    label:'Authority Grounding',   short:'AUTH GROUND' },
    { key:'scale',        label:'Scale Readiness',       short:'SCALE' },
    { key:'compliance',   label:'UI / Compliance',       short:'UI COMPLY' },
    { key:'features',     label:'Feature Completeness',  short:'FEATURES' },
    { key:'architecture', label:'Architecture Health',   short:'ARCH' },
    { key:'debt',         label:'Tech Debt (low=good)',  short:'TECH DEBT' },
    { key:'doctrinal',    label:'Doctrinal Accuracy',    short:'DOCTRINE' }
  ];

  var hasOrphans = orphanCount > 0;
  var refCoverage = 0;
  Object.values(AUTH).forEach(function(a){ if(a.ref) refCoverage++; });
  var refPct = Math.round(refCoverage / authCount * 100);

  var DASH_AGENTS = [
    {
      id:'validator', name:'KMS-VALIDATOR', color:'#44cc44', status:'GREEN', statusCls:'dash-s-green',
      concern: 'Zero orphans. '+refCoverage+'/'+authCount+' auth entries have ref chains ('+refPct+'%). '+docCount+' documents. Validator enforces ref\u2192document integrity. Next: increase ref coverage to 80%+ before resuming visual work.',
      badges: [{t:'DATA CLEAN',c:'db-ready'},{t:'REF: '+refPct+'%',c: refPct>=80?'db-ready':'db-blocker'}],
      scores:{ integrity:94, authority:92, scale:65, compliance:68, features:50, architecture:80, debt:82, doctrinal:refPct>=80?95:78 },
      notes:{ integrity:'Zero orphans. All nodes wired.', authority:refCoverage+'/'+authCount+' ref chains grounded to Constitution', scale:'d3.tree implemented. Dense views zoom out far \u2014 blocked by incomplete data, not renderer.', compliance:'Sidebar improved. Fonts + version label remain.', features:'OSD + ref system complete. Layout engine ready. Visual work paused for data.', architecture:'ref schema + d3.tree + DOC_MAP all working. Foundation solid.', debt:'109 auth entries without ref chains = research debt. TACON unused. cyber/daco mismatch.', doctrinal:refPct+'% ref coverage. Target: 80% before visual sprint.' }
    },
    {
      id:'authority', name:'AUTH-RESEARCHER', color:'#dd44bb', status:'RED', statusCls:'dash-s-red',
      concern: 'CRITICAL PATH: 109 auth entries lack ref chains. SECNAV two-chain structure (SECNAVINST 5400.15D) codified but PMA/FRC/squadron level incomplete. TACON defined in config but zero usage \u2014 audit needed. cyber vs daco field mismatch unresolved.',
      badges:[{t:'109 UNGROUNDED',c:'db-blocker'},{t:'TACON UNUSED',c:'db-conflict'},{t:'CYBER/DACO',c:'db-conflict'}],
      scores:{ integrity:88, authority:72, scale:55, compliance:58, features:42, architecture:72, debt:60, doctrinal:72 },
      notes:{ integrity:'OSD + SECNAV chain codified. PMAs/FRCs/squadrons pending.', authority:'58 entries grounded. 109 remain. Two-chain model understood but not fully reflected in data.', scale:'Not this agent\u2019s concern until data is complete', compliance:'Defers to UI-Compliance', features:'Blocked by incomplete authority research', architecture:'ref schema is ready. Need research to fill it.', debt:'TACON: zero usage despite config entry. 7 PEO TA errors were found and fixed \u2014 more may exist.', doctrinal:'SECNAVINST 5400.15D two-chain model is the key. Every SYSCOM intersection needs proper AA vs ADCON vs TA separation.' }
    },
    {
      id:'architect', name:'ARCHITECT', color:'#0076a9', status:'GREEN', statusCls:'dash-s-green',
      concern: 'Architecture is sound. d3.tree implemented, ref schema working, validator enforces integrity. Pausing visual work (ghost nodes, link routing) until authority data reaches 80%+ ref coverage. Lesson learned: design follows data.',
      badges:[{t:'d3.tree DONE',c:'db-ready'},{t:'WAITING ON DATA',c:'db-blocker'},{t:'LESSON LEARNED',c:'db-opportunity'}],
      scores:{ integrity:90, authority:90, scale:65, compliance:60, features:45, architecture:85, debt:75, doctrinal:88 },
      notes:{ integrity:'Data model clean. ref validates at build time.', authority:'Grounding system well-designed. Needs data to fill it.', scale:'d3.tree nodeSize eliminates overlap. Dense views need data-informed layout decisions.', compliance:'Font + version label still pending', features:'Layout engine ready. Ghost nodes designed. All waiting on data.', architecture:'d3.tree + ref + DOC_MAP + dashboard = solid foundation. No architectural blockers.', debt:'Visual debt (fonts, version) is low priority. Authority data debt is the bottleneck.', doctrinal:'Data before design \u2014 core lesson from this sprint.' }
    },
    {
      id:'uicompliance', name:'UI-COMPLIANCE', color:'#e8b00f', status:'AMBER', statusCls:'dash-s-amber',
      concern: 'Sidebar improved (10px/320px). Fonts + version label non-compliant. Visual work (ghost nodes, link routing, card refinement) on hold until authority data is complete. Cannot design for relationships that aren\u2019t codified.',
      badges:[{t:'SIDEBAR DONE',c:'db-ready'},{t:'FONTS PENDING',c:'db-conflict'},{t:'VISUAL PAUSED',c:'db-blocker'}],
      scores:{ integrity:82, authority:82, scale:62, compliance:58, features:45, architecture:75, debt:65, doctrinal:82 },
      notes:{ integrity:'Version label still v1.0', authority:'ref badges render as clickable gold links', scale:'d3.tree handles overlap. Dense views zoom far \u2014 card size at zoom is a future issue.', compliance:'Sidebar improved. Fonts + version label = remaining compliance debt.', features:'Visual prototypes built (layout-demo.html, grid-layout-demo.html). Implementation waiting.', architecture:'Dashboard + radar chart integrated and working.', debt:'Typography + version = compliance debt. Low priority vs authority research.', doctrinal:'Classification banner correct. All visual decisions deferred to data completion.' }
    },
    {
      id:'graph', name:'GRAPH-ANALYZER', color:'#00cccc', status:'GREEN', statusCls:'dash-s-green',
      concern: authCount+' auth entries. '+refCoverage+' have ref chains. Zero orphans. 7 PEO TA errors corrected this session. Remaining concern: cyber vs daco field naming inconsistency and TACON as dead config.',
      badges:[{t:'CHAINS CLEAN',c:'db-ready'},{t:'7 ERRORS FIXED',c:'db-ready'},{t:'TACON AUDIT',c:'db-conflict'}],
      scores:{ integrity:95, authority:92, scale:72, compliance:70, features:52, architecture:85, debt:80, doctrinal:90 },
      notes:{ integrity:'Zero orphans. All chains resolve. 7 PEO TA errors corrected (NAVSEA/NAVWAR PEOs pointed to NAVAIR).', authority:authCount+' entries. dac chains walk to POTUS for OSD+SECNAV layer.', scale:'d3.tree handles 500+ nodes. SVG rendering is the future bottleneck.', compliance:'WCAG passing. Color system mapped.', features:'OSD + ref + SECNAV chain complete. PMA/squadron level next.', architecture:'resolveChain() handles all authority types correctly.', debt:'TACON: defined in config (color #ff3355, dash 2,4, weight 1.3) but zero usage in auth or links. Audit needed.', doctrinal:'58 entries grounded to Constitution. 109 remaining = the work ahead.' }
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
    { p:'P1',c:'dp1', item:'Authority research: ref chains for remaining 109 auth entries', fid:'HIGH',fb:'df-h', eff:'HIGH', blocks:'All visual work, data fidelity' },
    { p:'P2',c:'dp1', item:'TACON audit: zero usage \u2014 research or remove from config', fid:'HIGH',fb:'df-h', eff:'LOW', blocks:'Dead config cleanup' },
    { p:'P3',c:'dp1', item:'Harmonize cyber vs daco field naming', fid:'MED',fb:'df-m', eff:'LOW', blocks:'Data consistency' },
    { p:'P4',c:'dp2', item:'SECNAVINST 5400.15D two-chain: verify all SYSCOM intersections', fid:'HIGH',fb:'df-h', eff:'MED', blocks:'View accuracy' },
    { p:'P5',c:'dp2', item:'PMA/PMS program offices: ref chains with acquisition instruments', fid:'HIGH',fb:'df-h', eff:'HIGH', blocks:'Acquisition view accuracy' },
    { p:'P6',c:'dp3', item:'Bundle Roboto Slab WOFF2 fonts', fid:'MED',fb:'df-m', eff:'LOW', blocks:'UI compliance' },
    { p:'P7',c:'dp3', item:'Fix version label v1.0 \u2192 current', fid:'LOW',fb:'df-l', eff:'TRIVIAL', blocks:'None' },
    { p:'P8',c:'dp4', item:'Ghost nodes for dual-hat rendering (P2-A)', fid:'HIGH',fb:'df-h', eff:'MED', blocks:'Dual-hat views (blocked by P1)' },
    { p:'P9',c:'dp4', item:'Cross-cutting link routing (TA/LCSP arcs)', fid:'HIGH',fb:'df-h', eff:'MED', blocks:'TA views (blocked by P1)' },
    { p:'P10',c:'dp5', item:'Define tenant relationship type', fid:'HIGH',fb:'df-h', eff:'LOW', blocks:'CNIC/MCICOM (blocked by P1)' }
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
      {tag:'\u2713',text:'P1-B d3.tree + P2-A ghost nodes. Implementation done (d3.tree) / designed (ghosts). Waiting on data.',rec:true}
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
    {cls:'db-blocker',title:'109 auth entries lack ref chains',desc:'35% ref coverage. Visual design for ungrounded authority relationships produces misleading displays. Authority research is the critical path.'},
    {cls:'db-conflict',title:'TACON: dead config',desc:'Color (#ff3355), dash (2,4), weight (1.3), and filter entry defined but zero usage in auth entries or view links. Either research and codify or remove.'},
    {cls:'db-conflict',title:'cyber vs daco field mismatch',desc:'Auth entries use "daco" field, view links use "cyber" authority type. Same DoDI 8530.01 relationship rendered differently depending on context.'},
    {cls:'db-conflict',title:'Font stack non-compliant',desc:'IBM Plex Sans primary; Navy Design Guide says Roboto Slab. Version label still v1.0. Low priority vs authority research.'},
    {cls:'db-conflict',title:'Lesson learned: design preceded data',desc:'Time spent on layout engines, grid prototypes, and radial evaluation before authority data was complete. Visual decisions deferred until ref coverage reaches 80%+.'}
  ];
  var cflHtml = '';
  conflicts.forEach(function(c){
    cflHtml += '<div class="dash-cfl-item"><span class="dash-badge '+c.cls+'" style="flex-shrink:0">'+(c.cls==='db-conflict'?'CONFLICT':'BLOCKER')+'</span><span><b>'+c.title+'</b> \u2014 '+c.desc+'</span></div>';
  });
  document.getElementById('dash-conflicts').innerHTML = cflHtml;

  // ── Opportunities ──
  var opps = [
    {cls:'db-ready',title:'Foundation is solid',desc:'ref schema, validator, 50 documents, d3.tree engine, dashboard \u2014 all working. The infrastructure to codify and visualize authority is built. Now fill it with researched data.'},
    {cls:'db-ready',title:'SECNAV two-chain model understood',desc:'SECNAVINST 5400.15D research complete. AA vs ADCON vs TA separation at SYSCOM intersections is well-defined. Ready to codify remaining nodes.'},
    {cls:'db-opportunity',title:'7 data errors already caught',desc:'PEO TA references corrected (NAVSEA/NAVWAR PEOs pointed to NAVAIR). Systematic ref chain work will find more. Each fix improves every view that touches those nodes.'},
    {cls:'db-opportunity',title:'Visual prototypes ready to implement',desc:'d3.tree (done), ghost nodes (designed), link routing (prototyped). All waiting on authority data completion. No design work needed \u2014 just data.'}
  ];
  var oppHtml = '';
  opps.forEach(function(o){
    oppHtml += '<div class="dash-cfl-item"><span class="dash-badge '+o.cls+'" style="flex-shrink:0">'+(o.cls==='db-ready'?'READY NOW':'OPPORTUNITY')+'</span><span><b>'+o.title+'</b> \u2014 '+o.desc+'</span></div>';
  });
  document.getElementById('dash-opportunities').innerHTML = oppHtml;

  // ── Baseline Snapshot ──
  document.getElementById('dash-baseline').innerHTML =
    '<div><div class="dash-sec-head">Data Model</div><div style="line-height:1.8;margin-top:5px">'+nodeCount+' org nodes \u00b7 12 authority types (incl. dac)<br>'+authCount+' auth entries \u00b7 ref document chains<br>'+docCount+' documents (23 foundation + 20 operational)<br>opcon/adcon/daco/dac \u2192 chain types<br>ta/lcsp/aa \u2192 peer arrays<br>'+viewCount+' preset views + custom builder</div></div>' +
    '<div><div class="dash-sec-head">Architecture</div><div style="line-height:1.8;margin-top:5px">Single HTML entry point \u00b7 file:// native<br>D3.js v7 only vendored lib<br>kms-data.js (source of truth)<br>app.js: ~1,800 lines (all logic + dashboard)<br>No server \u00b7 No build \u00b7 No framework<br><span style="color:#ffaa22">Layout engine: autoLayoutView() needs replacement</span></div></div>' +
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
