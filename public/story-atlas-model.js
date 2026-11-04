// Read-only story atlas: scene cards + chapter graph layout for interactive browsing.
const preview=(value,limit=96)=>{
  const text=typeof value==='string'?value:value?.ru??value?.text??'';
  const flat=String(text).replace(/\s+/g,' ').trim();
  if(!flat)return '';
  return flat.length>limit?flat.slice(0,limit-1)+'…':flat;
};

function outsOf(node){
  if(Array.isArray(node.choices)&&node.choices.length){
    return node.choices.map(choice=>({
      kind:'choice',
      label:preview(choice.label,72),
      next:choice.next??null,
      tone:choice.tone??null
    }));
  }
  if(node.next)return[{kind:'next',label:'→',next:node.next,tone:null}];
  return[];
}

function pagesOf(node){
  return(node.pages??[]).map((page,index)=>({
    index,
    speaker:page.speaker??'narrator',
    text:preview(page.text,120),
    message:!!page.message
  }));
}

function walkChapter(nodes,start,boundaries){
  const seen=new Set();
  const order=[];
  const visit=id=>{
    if(!id||id==='end'||seen.has(id)||(boundaries.has(id)&&id!==start))return;
    if(!nodes[id])return;
    seen.add(id);order.push(id);
    for(const out of outsOf(nodes[id]))visit(out.next);
  };
  visit(start);
  return order;
}

export function buildStoryAtlas(nodes,chapters,start='quick_arrival',options={}){
  const boundaries=new Set(chapters.map(chapter=>chapter.start));
  const scenes={};
  for(const [id,node] of Object.entries(nodes)){
    const frame=options.presentationFor
      ?resolveSceneFrame(node,{presentationFor:options.presentationFor,sprites:options.sprites,flags:options.flags,profile:options.profile})
      :null;
    scenes[id]={
      id,
      chapterId:node.chapterId??null,
      chapter:node.chapter??null,
      day:node.day??null,
      location:node.location??null,
      time:node.time??null,
      pageCount:(node.pages??[]).length,
      pages:pagesOf(node),
      outs:outsOf(node),
      legacyOnly:!!node.legacyOnly,
      adult:!!node.adult,
      music:node.music??null,
      frame
    };
  }
  const chapterRows=chapters.map(chapter=>{
    const sceneIds=walkChapter(nodes,chapter.start,boundaries);
    return{
      id:chapter.id,
      number:chapter.number,
      title:chapter.title,
      start:chapter.start,
      day:chapter.day??null,
      description:chapter.description??'',
      sceneIds,
      sceneCount:sceneIds.length
    };
  });
  const assigned=new Set(chapterRows.flatMap(row=>row.sceneIds));
  const orphans=Object.keys(scenes).filter(id=>!assigned.has(id)).sort();
  const incoming={};
  for(const scene of Object.values(scenes)){
    for(const out of scene.outs){
      if(!out.next||out.next==='end')continue;
      (incoming[out.next]??=[]).push({from:scene.id,label:out.label,kind:out.kind,tone:out.tone});
    }
  }
  const totals={scenes:Object.keys(scenes).length,chapters:chapterRows.length,orphans:orphans.length,start};
  return{chapters:chapterRows,scenes,orphans,incoming,totals};
}

export function formatSceneNote(scene){
  if(!scene)return'';
  const lines=[
    `ID: ${scene.id}`,
    scene.chapter?`Глава: ${scene.chapter}`:null,
    scene.day?`День: ${scene.day}`:null,
    scene.location?`Локация: ${scene.location}`:null,
    scene.time?`Время: ${scene.time}`:null,
    `Страниц: ${scene.pageCount}`
  ].filter(Boolean);
  if(scene.pages.length){
    lines.push('Реплики:');
    for(const page of scene.pages)lines.push(`  [${page.index}] ${page.speaker}: ${page.text}`);
  }
  if(scene.outs.length){
    lines.push('Переходы:');
    for(const out of scene.outs){
      const tone=out.tone?` · ${out.tone}`:'';
      lines.push(`  ${out.label||'→'} → ${out.next??'end'}${tone}`);
    }
  }
  return lines.join('\n');
}

export function filterAtlasScenes(atlas,{chapterId='all',query='',includeLegacy=true,includeOrphans=true}={}){
  const q=query.trim().toLocaleLowerCase('ru');
  const inChapter=id=>{
    if(chapterId==='all')return true;
    if(chapterId==='orphans')return atlas.orphans.includes(id);
    return atlas.scenes[id]?.chapterId===chapterId;
  };
  return Object.values(atlas.scenes).filter(scene=>{
    if(!inChapter(scene.id))return false;
    if(!includeLegacy&&scene.legacyOnly)return false;
    if(!includeOrphans&&atlas.orphans.includes(scene.id)&&chapterId!=='orphans')return false;
    if(!q)return true;
    const hay=[scene.id,scene.chapter,scene.day,scene.location,scene.time,...scene.pages.map(p=>p.text),...scene.outs.map(o=>`${o.label} ${o.next}`)].filter(Boolean).join('\n').toLocaleLowerCase('ru');
    return hay.includes(q);
  }).sort((a,b)=>a.id.localeCompare(b.id,'en'));
}

const NODE_W=220;
const NODE_H=158;
const COL_GAP=56;
const ROW_GAP=24;
const PAD=28;

/** Resolve background/portrait URLs for a story node (first page, neutral flags). */
export function resolveSceneFrame(node,{presentationFor,sprites,flags={},profile={gender:'female'}}={}){
  if(!node?.pages?.length||typeof presentationFor!=='function')return null;
  try{
    const page=node.pages[0];
    const presentation=presentationFor(node,page,flags,profile);
    const emotion=presentation.emotion??'friendly';
    const sprite=presentation.character?sprites?.[presentation.character]?.[emotion]??sprites?.[presentation.character]?.friendly:null;
    const bgKey=presentation.cg||presentation.bg;
    if(!bgKey&&!sprite)return null;
    return{
      bg:bgKey?`./assets/${bgKey}.webp`:null,
      portrait:sprite?`./assets/${sprite.file}.webp`:null,
      alt:sprite?.alt||presentation.description||'',
      composite:!!presentation.composite||!!presentation.seated
    };
  }catch{
    return null;
  }
}

function nodePreview(scene){
  if(!scene)return '';
  const page=scene.pages?.[0];
  if(!page?.text)return scene.location||scene.chapter||'';
  return page.text;
}

/** Scale a layout graph without CSS transform — keeps text crisp while zooming. */
export function scaleStoryGraph(graph,scale=1){
  const s=Math.max(0.35,Math.min(2.4,scale));
  if(!graph)return graph;
  if(Math.abs(s-1)<0.001)return{...graph,scale:1,byId:{...graph.byId}};
  const nodes=graph.nodes.map(node=>({...node,x:node.x*s,y:node.y*s}));
  const byId=Object.fromEntries(nodes.map(node=>[node.id,node]));
  return{
    ...graph,
    scale:s,
    nodes,
    byId,
    edges:graph.edges.map(edge=>({...edge})),
    nodeW:graph.nodeW*s,
    nodeH:graph.nodeH*s,
    width:graph.width*s,
    height:graph.height*s
  };
}

/** Layered left-to-right graph for one chapter (or orphans / focus neighbourhood). */
export function buildStoryGraph(atlas,{chapterId,focusId=null,hops=1}={}){
  let seedIds=[];
  let root=null;
  if(chapterId&&chapterId!=='all'&&chapterId!=='orphans'){
    const chapter=atlas.chapters.find(row=>row.id===chapterId);
    seedIds=chapter?.sceneIds??[];
    root=chapter?.start??seedIds[0]??null;
  }else if(chapterId==='orphans'){
    seedIds=atlas.orphans;
    root=seedIds[0]??null;
  }else{
    const focus=focusId&&atlas.scenes[focusId]?focusId:atlas.totals.start;
    const seen=new Set([focus]);
    let frontier=[focus];
    for(let hop=0;hop<hops;hop++){
      const next=[];
      for(const id of frontier){
        for(const out of atlas.scenes[id]?.outs??[]){
          if(out.next&&out.next!=='end'&&atlas.scenes[out.next]&&!seen.has(out.next)){
            seen.add(out.next);next.push(out.next);
          }
        }
        for(const edge of atlas.incoming[id]??[]){
          if(edge.from&&atlas.scenes[edge.from]&&!seen.has(edge.from)){
            seen.add(edge.from);next.push(edge.from);
          }
        }
      }
      frontier=next;
    }
    seedIds=[...seen];
    root=focus;
  }
  const local=new Set(seedIds);
  if(!local.size)return{nodes:[],edges:[],width:PAD*2,height:PAD*2,nodeW:NODE_W,nodeH:NODE_H,root:null};

  const depth=new Map();
  const queue=[];
  if(root&&local.has(root)){depth.set(root,0);queue.push(root);}
  for(let i=0;i<queue.length;i++){
    const id=queue[i];
    const d=depth.get(id);
    for(const out of atlas.scenes[id]?.outs??[]){
      const next=out.next;
      if(!next||next==='end'||!local.has(next)||depth.has(next))continue;
      depth.set(next,d+1);
      queue.push(next);
    }
  }
  let maxD=0;
  for(const d of depth.values())maxD=Math.max(maxD,d);
  for(const id of seedIds){
    if(depth.has(id))continue;
    // Unreachable from chapter start: park after the main flow.
    maxD+=1;
    depth.set(id,maxD);
  }

  const columns=new Map();
  for(const id of seedIds){
    const d=depth.get(id)??0;
    if(!columns.has(d))columns.set(d,[]);
    columns.get(d).push(id);
  }
  const ranks=[...columns.keys()].sort((a,b)=>a-b);
  for(const rank of ranks){
    columns.get(rank).sort((a,b)=>a.localeCompare(b,'en'));
  }

  const nodes=[];
  const byId={};
  let maxRow=0;
  for(const rank of ranks){
    const col=columns.get(rank);
    maxRow=Math.max(maxRow,col.length);
    col.forEach((id,row)=>{
      const scene=atlas.scenes[id];
      const node={
        id,
        x:PAD+rank*(NODE_W+COL_GAP),
        y:PAD+row*(NODE_H+ROW_GAP),
        label:id,
        meta:scene?.location||scene?.chapter||'',
        preview:nodePreview(scene),
        frame:scene?.frame??null,
        outs:scene?.outs??[],
        external:false
      };
      nodes.push(node);
      byId[id]=node;
    });
  }

  const edges=[];
  const external={};
  for(const id of seedIds){
    const from=byId[id];
    if(!from)continue;
    for(const out of from.outs){
      const next=out.next;
      if(!next||next==='end'){
        edges.push({from:id,to:null,end:true,label:out.label||'→',kind:out.kind,tone:out.tone});
        continue;
      }
      if(local.has(next)&&byId[next]){
        edges.push({from:id,to:next,end:false,label:out.label||'',kind:out.kind,tone:out.tone,external:false});
      }else if(atlas.scenes[next]||next){
        if(!external[next]){
          const rank=(depth.get(id)??0)+1;
          const row=Object.keys(external).length;
          external[next]={
            id:next,
            x:PAD+rank*(NODE_W+COL_GAP),
            y:PAD+row*(NODE_H+ROW_GAP),
            label:next,
            meta:atlas.scenes[next]?.chapter||tSafeExit(next),
            preview:nodePreview(atlas.scenes[next]),
            frame:atlas.scenes[next]?.frame??null,
            outs:[],
            external:true
          };
          nodes.push(external[next]);
          byId[next]=external[next];
          maxRow=Math.max(maxRow,row+1);
        }
        edges.push({from:id,to:next,end:false,label:out.label||'',kind:out.kind,tone:out.tone,external:true});
      }
    }
  }

  const width=Math.max(...nodes.map(n=>n.x),PAD)+NODE_W+PAD;
  const height=Math.max(...nodes.map(n=>n.y),PAD)+NODE_H+PAD;
  return{nodes,edges,width,height,nodeW:NODE_W,nodeH:NODE_H,root,byId};
}

function tSafeExit(next){
  return next==='end'?'end':'→';
}

export function graphEdgePath(fromNode,toNode,nodeW,nodeH,lane=0){
  const x1=fromNode.x+nodeW;
  const y1=fromNode.y+nodeH/2;
  const bend=lane*14;
  if(!toNode){
    const x2=x1+36;
    return`M${x1} ${y1} L${x2} ${y1+bend}`;
  }
  const x2=toNode.x;
  const y2=toNode.y+nodeH/2;
  const mid=x1+(x2-x1)/2;
  return`M${x1} ${y1} C${mid} ${y1+bend}, ${mid} ${y2+bend}, ${x2} ${y2}`;
}

export function graphEdgeLabelPoint(fromNode,toNode,nodeW,nodeH,lane=0){
  if(!toNode)return{x:fromNode.x+nodeW+18,y:fromNode.y+nodeH/2+lane*14-10};
  return{
    x:(fromNode.x+nodeW+toNode.x)/2,
    y:(fromNode.y+toNode.y)/2+nodeH/2+lane*14-18
  };
}

export function scenePreviewLines(scene,limit=2){
  if(!scene)return[];
  return(scene.pages??[]).slice(0,limit).map(page=>({
    speaker:page.speaker,
    text:page.text,
    message:!!page.message
  }));
}
