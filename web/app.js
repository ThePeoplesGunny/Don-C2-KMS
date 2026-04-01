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
  var map={org:0,orders:1,timeline:2,registry:3,accuracy:4};
  document.querySelectorAll('.tab')[map[id]].classList.add('on');
  if(id==='org')setTimeout(function(){renderOrg(true);},50);
  if(id==='orders')renderOrders();
  if(id==='timeline')renderTimeline();
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

// ── AUTO-LAYOUT: compute positions for views without (or with partial) manual positions ──
// Uses the view's own links to determine hierarchy, then lays out with subtree-aware spacing.
// Manual position overrides (view.pos) are applied after algorithmic placement.
function autoLayoutView(view, W, H){
  var ids=view.ids||[];
  var links=view.links||[];
  if(!ids.length)return {};

  // Build directed graph from links
  var incoming={}, outgoing={}, childOf={};
  ids.forEach(function(id){incoming[id]=0;outgoing[id]=[];});
  links.forEach(function(lk){
    if(ids.indexOf(lk.s)>=0&&ids.indexOf(lk.t)>=0){
      if(!outgoing[lk.s])outgoing[lk.s]=[];
      outgoing[lk.s].push(lk.t);
      incoming[lk.t]=(incoming[lk.t]||0)+1;
      childOf[lk.t]=lk.s; // last parent wins (for tree structure)
    }
  });

  // Find roots (no incoming edges)
  var roots=ids.filter(function(id){return !incoming[id]||incoming[id]===0;});
  if(!roots.length)roots=[ids[0]];

  // BFS to assign depth and build tree
  var depth={}, children={}, visited=new Set();
  roots.forEach(function(r){depth[r]=0;children[r]=[];visited.add(r);});
  var queue=roots.slice();
  while(queue.length){
    var cur=queue.shift();
    (outgoing[cur]||[]).forEach(function(ch){
      if(!visited.has(ch)){
        visited.add(ch);
        depth[ch]=(depth[cur]||0)+1;
        if(!children[cur])children[cur]=[];
        children[cur].push(ch);
        if(!children[ch])children[ch]=[];
        queue.push(ch);
      }
    });
  }
  // Assign unvisited nodes to depth 0
  ids.forEach(function(id){
    if(depth[id]===undefined){depth[id]=0;visited.add(id);if(!children[id])children[id]=[];}
  });

  // Subtree leaf counting for proportional spacing
  function leafCount(id){
    var ch=children[id]||[];
    if(!ch.length)return 1;
    var s=0;for(var i=0;i<ch.length;i++)s+=leafCount(ch[i]);
    return s;
  }

  // Assign positions — subtree-aware horizontal spacing
  var HPAD=NW+22, VGAP=NH+55;
  var totalLeaves=0;
  roots.forEach(function(r){totalLeaves+=leafCount(r);});
  if(!totalLeaves)totalLeaves=1;
  var unitW=Math.max(HPAD, Math.floor((W-80)/totalLeaves));

  var posMap={};
  var leafCursor=0;

  function assignPos(id, d){
    var ch=children[id]||[];
    if(!ch.length){
      posMap[id]=[40+leafCursor*unitW, 36+d*VGAP];
      leafCursor++;
    }else{
      var startLeaf=leafCursor;
      for(var i=0;i<ch.length;i++)assignPos(ch[i],d+1);
      var endLeaf=leafCursor;
      var leftX=40+startLeaf*unitW;
      var rightX=40+(endLeaf-1)*unitW+NW;
      posMap[id]=[Math.round((leftX+rightX-NW)/2), 36+d*VGAP];
    }
  }

  // Layout each root's subtree sequentially
  roots.forEach(function(r){assignPos(r,depth[r]||0);});

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
      // Auto-layout with manual overrides
      rawPos=autoLayoutView(view, W, H);
    }
    const nodes=view.ids.map(id=>{const n=NODES[id];if(!n)return null;const p=rawPos[id]||[0,0];return{...n,x:p[0],y:p[1]};}).filter(Boolean);
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
