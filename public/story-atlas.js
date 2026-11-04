import {sceneCode,sceneLink,resolveSceneReference} from './scene-reference.js?v=0.17.2';
import {t} from './i18n.js?v=0.17.23';
import {presentationFor,CHARACTER_SPRITES} from './story.js?v=0.17.25';
import {
  buildStoryAtlas,
  buildStoryGraph,
  filterAtlasScenes,
  formatSceneNote,
  graphEdgePath,
  graphEdgeLabelPoint,
  scaleStoryGraph,
  scenePreviewLines
} from './story-atlas-model.js?v=0.17.2';

const PREVIEW_FLAGS={companion:'nikola',host:'dragan',districtOwner:'jelena',district:'dorcol',rentalCast:'new'};
const PREVIEW_PROFILE={gender:'female',nameId:'alexandra'};

const el=(tag,text,className)=>{
  const node=document.createElement(tag);
  if(text!=null&&text!=='')node.textContent=typeof text==='string'?t(text):text;
  if(className)node.className=className;
  return node;
};

function frameThumb(frame,className){
  if(!frame||(!frame.bg&&!frame.portrait))return null;
  const wrap=el('div','',className||'story-atlas-frame');
  if(frame.composite)wrap.classList.add('is-composite');
  if(frame.bg){
    const bg=document.createElement('img');
    bg.className='story-atlas-frame-bg';
    bg.src=frame.bg;
    bg.alt='';
    bg.loading='lazy';
    bg.decoding='async';
    bg.addEventListener('error',()=>{bg.hidden=true;},{once:true});
    wrap.append(bg);
  }
  if(frame.portrait){
    const portrait=document.createElement('img');
    portrait.className='story-atlas-frame-portrait';
    portrait.src=frame.portrait;
    portrait.alt=frame.alt?t(frame.alt):'';
    portrait.loading='lazy';
    portrait.decoding='async';
    portrait.addEventListener('error',()=>{portrait.hidden=true;},{once:true});
    wrap.append(portrait);
  }
  return wrap;
}

async function copyText(value){
  try{
    await navigator.clipboard.writeText(value);
    return true;
  }catch{
    const area=document.createElement('textarea');
    area.value=value;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';
    document.body.append(area);area.select();
    try{return document.execCommand('copy');}finally{area.remove();}
  }
}

export function mountStoryAtlas(container,{nodes,chapters,start,status,initialScene,onTestScene}){
  const atlas=buildStoryAtlas(nodes,chapters,start,{
    presentationFor,
    sprites:CHARACTER_SPRITES,
    flags:PREVIEW_FLAGS,
    profile:PREVIEW_PROFILE
  });
  const root=el('div','','story-atlas');
  const intro=el('p','Интерактивная схема сюжета: ходи по узлам, смотри реплики и копируй ID сцен для правок.','workshop-intro');
  const summary=el('p','','story-atlas-summary');
  summary.textContent=`${atlas.totals.scenes} ${t('сцен')} · ${atlas.totals.chapters} ${t('глав')} · ${t('старт')} ${atlas.totals.start}`;

  const controls=el('div','','workshop-controls story-atlas-controls');
  const search=el('input');search.type='search';search.placeholder=t('ID сцены, локация или фраза');search.setAttribute('aria-label',t('Поиск по сценам'));
  const chapter=el('select');chapter.setAttribute('aria-label',t('Глава'));
  for(const row of atlas.chapters){
    const option=el('option',`${t(row.number)} · ${t(row.title)} (${row.sceneCount})`);
    option.value=row.id;chapter.append(option);
  }
  if(atlas.orphans.length){
    const option=el('option',t('Вне глав / legacy')+` (${atlas.orphans.length})`);
    option.value='orphans';chapter.append(option);
  }
  const focusOpt=el('option',t('Окрестность сцены'));focusOpt.value='focus';chapter.append(focusOpt);
  const prologue=atlas.chapters.find(row=>row.id==='prologue')||atlas.chapters[0];
  if(prologue)chapter.value=prologue.id;

  const legacy=el('label','','workshop-archive-toggle');
  const legacyBox=el('input');legacyBox.type='checkbox';legacyBox.checked=true;
  legacy.append(legacyBox,document.createTextNode(t('Показать legacyOnly')));
  controls.append(chapter,search,legacy);

  const preview=el('section','','story-atlas-preview');
  preview.setAttribute('aria-live','polite');

  const layout=el('div','','story-atlas-layout story-atlas-layout-schema');
  const schemaWrap=el('div','','story-atlas-schema');
  schemaWrap.setAttribute('tabindex','0');
  schemaWrap.setAttribute('aria-label',t('Схема сцен'));
  const schemaToolbar=el('div','','story-atlas-schema-toolbar');
  const zoomOut=el('button','−','secondary story-atlas-zoom');zoomOut.type='button';zoomOut.setAttribute('aria-label',t('Уменьшить'));
  const zoomIn=el('button','+','secondary story-atlas-zoom');zoomIn.type='button';zoomIn.setAttribute('aria-label',t('Увеличить'));
  const zoomReset=el('button',t('Сброс'),'secondary story-atlas-zoom');zoomReset.type='button';
  const fitBtn=el('button',t('К выбранной'),'secondary story-atlas-zoom');fitBtn.type='button';
  const zoomLabel=el('span','100%','story-atlas-zoom-label');
  schemaToolbar.append(zoomOut,zoomIn,zoomReset,fitBtn,zoomLabel);
  const schemaViewport=el('div','','story-atlas-schema-viewport');
  const schemaCanvas=el('div','','story-atlas-schema-canvas');
  schemaViewport.append(schemaCanvas);
  schemaWrap.append(schemaToolbar,schemaViewport);

  const detail=el('article','','story-atlas-detail');
  detail.append(el('p',t('Выбери узел на схеме — справа появятся ID, реплики и переходы.'),'story-atlas-empty'));
  layout.append(schemaWrap,detail);
  root.append(intro,summary,controls,preview,layout);
  container.append(root);

  let selected=resolveSceneReference(nodes,initialScene)||prologue?.start||atlas.totals.start;
  if(initialScene&&atlas.scenes[selected]?.chapterId)chapter.value=atlas.scenes[selected].chapterId;
  let crawl=[selected];
  let scale=1;
  let panX=0;
  let panY=0;
  let dragging=false;
  let dragOrigin=null;
  let baseGraph=null;
  let graph=null;

  const setStatus=message=>{if(status)status.textContent=message;};

  function applyPan(){
    schemaCanvas.style.transform=`translate(${panX}px, ${panY}px)`;
  }

  function updateZoomLabel(){
    zoomLabel.textContent=`${Math.round(scale*100)}%`;
  }

  function centerOn(id){
    const node=graph?.byId?.[id];
    if(!node)return;
    const rect=schemaViewport.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    panX=rect.width/2-(node.x+graph.nodeW/2);
    panY=rect.height/2-(node.y+graph.nodeH/2);
    applyPan();
  }

  function fitGraph(){
    if(!baseGraph)return;
    const rect=schemaViewport.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const pad=56;
    const sx=(rect.width-pad)/Math.max(baseGraph.width,1);
    const sy=(rect.height-pad)/Math.max(baseGraph.height,1);
    setZoom(Math.min(1.1,Math.max(0.45,Math.min(sx,sy))),{refit:true});
  }

  function setZoom(next,{keepCenter=true,refit=false}={}){
    const rect=schemaViewport.getBoundingClientRect();
    const clamped=Math.min(2.2,Math.max(0.45,next));
    let worldX=0,worldY=0;
    if(keepCenter&&rect.width&&!refit){
      worldX=(rect.width/2-panX)/scale;
      worldY=(rect.height/2-panY)/scale;
    }
    scale=clamped;
    updateZoomLabel();
    renderGraph();
    if(refit){
      panX=(rect.width-graph.width)/2;
      panY=(rect.height-graph.height)/2;
    }else if(keepCenter&&rect.width){
      panX=rect.width/2-worldX;
      panY=rect.height/2-worldY;
    }
    applyPan();
  }

  function goTo(id,{push=true}={}){
    if(!id||id==='end'||!atlas.scenes[id])return;
    selected=id;
    if(push){
      if(crawl[crawl.length-1]!==id)crawl.push(id);
      if(crawl.length>40)crawl=crawl.slice(-40);
    }
    if(chapter.value==='focus')renderAll({preservePan:false});
    else{
      renderGraph();
      renderPreview(atlas.scenes[id]);
      renderDetail(atlas.scenes[id]);
    }
    requestAnimationFrame(()=>centerOn(id));
  }

  function renderPreview(scene){
    preview.replaceChildren();
    if(!scene){
      preview.append(el('p',t('Превью сцены появится после выбора узла.'),'story-atlas-preview-empty'));
      return;
    }
    const body=el('div','','story-atlas-preview-body');
    const frame=frameThumb(scene.frame,'story-atlas-preview-frame');
    if(frame)body.append(frame);
    const copy=el('div','','story-atlas-preview-copy');
    const head=el('div','','story-atlas-preview-head');
    head.append(el('code',sceneCode(scene.id)+' · '+scene.id,'story-atlas-id'));
    const meta=[];
    if(scene.location)meta.push(scene.location);
    if(scene.time)meta.push(scene.time);
    if(scene.pageCount)meta.push(`${scene.pageCount} ${t('стр.')}`);
    if(meta.length)head.append(el('span',meta.join(' · '),'story-atlas-preview-meta'));
    copy.append(head);
    if(scene.chapter)copy.append(el('p',scene.chapter,'story-atlas-preview-chapter'));
    const lines=el('div','','story-atlas-preview-lines');
    for(const page of scenePreviewLines(scene,2)){
      const row=el('p','','story-atlas-preview-line');
      row.append(el('small',page.speaker+(page.message?' · msg':'')),document.createTextNode(' '+page.text));
      lines.append(row);
    }
    copy.append(lines);
    if(scene.outs.length){
      const choices=el('div','','story-atlas-preview-choices');
      for(const out of scene.outs.slice(0,4)){
        const label=out.label&&out.label!=='→'?`${out.label} → ${out.next??'end'}`:`→ ${out.next??'end'}`;
        const chip=el('button',label,'story-atlas-preview-choice');
        chip.type='button';
        chip.onclick=()=>{if(out.next&&out.next!=='end')goTo(out.next);};
        choices.append(chip);
      }
      copy.append(choices);
    }
    body.append(copy);
    preview.append(body);
  }

  function renderDetail(scene){
    detail.replaceChildren();
    if(!scene){
      detail.append(el('p',t('Выбери узел на схеме — справа появятся ID, реплики и переходы.'),'story-atlas-empty'));
      return;
    }
    const head=el('header','','story-atlas-detail-head');
    const idRow=el('div','','story-atlas-id-row');
    const code=el('code',sceneCode(scene.id)+' · '+scene.id,'story-atlas-id');
    const copyId=el('button',t('Скопировать ID'),'secondary');
    copyId.type='button';
    copyId.onclick=async()=>{if(await copyText(sceneCode(scene.id)))setStatus(t('ID скопирован: ')+sceneCode(scene.id));};
    const copyNote=el('button',t('Скопировать карточку'),'secondary');
    copyNote.type='button';
    copyNote.onclick=async()=>{if(await copyText(sceneCode(scene.id)+"\n"+sceneLink(scene.id,location.href)+"\n"+formatSceneNote(scene)))setStatus(t('Карточка сцены скопирована'));};
    const copyLink=el('button',t('Скопировать ссылку'),'secondary');
    copyLink.type='button';copyLink.onclick=async()=>{if(await copyText(sceneLink(scene.id,location.href)))setStatus(t('Ссылка скопирована'));};
    idRow.append(code,copyId,copyLink,copyNote);
    if(onTestScene){const test=el('button','Запустить сцену','primary');test.type='button';test.classList.add('story-atlas-test');test.onclick=()=>onTestScene(scene.id);idRow.append(test);}
    head.append(idRow);
    if(scene.chapter)head.append(el('p',scene.chapter,'story-atlas-meta'));
    const chips=el('div','','story-atlas-chips');
    for(const [label,value] of [['День',scene.day],['Локация',scene.location],['Время',scene.time],['Страниц',String(scene.pageCount)]]){
      if(!value)continue;
      chips.append(el('span',`${t(label)}: ${value}`,'story-atlas-chip'));
    }
    if(scene.legacyOnly)chips.append(el('span',t('legacyOnly'),'story-atlas-chip warn'));
    if(scene.adult)chips.append(el('span',t('18+'),'story-atlas-chip warn'));
    head.append(chips);
    detail.append(head);

    if(crawl.length>1){
      const trail=el('div','','story-atlas-trail');
      const back=el('button',t('← Назад по схеме'),'text-button');
      back.type='button';
      back.onclick=()=>{
        if(crawl.length<2)return;
        crawl.pop();
        goTo(crawl[crawl.length-1],{push:false});
      };
      trail.append(back,el('small',crawl.slice(-4).join(' → ')));
      detail.append(trail);
    }

    const pagesTitle=el('h3',t('Реплики'));
    const pages=el('ol','','story-atlas-pages');
    for(const page of scene.pages){
      const item=el('li');
      item.append(el('small',`[${page.index}] ${page.speaker}${page.message?' · msg':''}`),el('p',page.text));
      pages.append(item);
    }
    detail.append(pagesTitle,pages);

    const ins=atlas.incoming[scene.id]??[];
    if(ins.length){
      detail.append(el('h3',t('Входы')));
      const list=el('ul','','story-atlas-outs');
      for(const edge of ins){
        const item=el('li');
        const button=el('button',`${edge.from} →`,'text-button story-atlas-link');
        button.type='button';
        if(edge.label&&edge.label!=='→')button.append(document.createTextNode(` ${edge.label}`));
        button.onclick=()=>goTo(edge.from);
        item.append(button);list.append(item);
      }
      detail.append(list);
    }

    detail.append(el('h3',t('Переходы')));
    const outs=el('ul','','story-atlas-outs');
    if(!scene.outs.length)outs.append(el('li',t('Конец ветки / без next')));
    for(const out of scene.outs){
      const item=el('li');
      const button=el('button',`${out.label||'→'} → ${out.next??'end'}`,'text-button story-atlas-link');
      button.type='button';
      if(out.tone)button.append(document.createTextNode(` · ${out.tone}`));
      button.onclick=()=>{
        if(!out.next||out.next==='end')return;
        if(atlas.scenes[out.next]?.chapterId&&chapter.value!=='focus'&&chapter.value!=='orphans'&&atlas.scenes[out.next].chapterId!==chapter.value){
          chapter.value=atlas.scenes[out.next].chapterId;
        }
        goTo(out.next);
      };
      item.append(button);outs.append(item);
    }
    detail.append(outs);
  }

  function renderGraph(){
    const chapterId=chapter.value;
    baseGraph=buildStoryGraph(atlas,{
      chapterId:chapterId==='focus'?'all':chapterId,
      focusId:selected,
      hops:1
    });
    if(!legacyBox.checked){
      baseGraph={
        ...baseGraph,
        nodes:baseGraph.nodes.filter(node=>!atlas.scenes[node.id]?.legacyOnly||node.id===selected)
      };
      const keep=new Set(baseGraph.nodes.map(n=>n.id));
      baseGraph.edges=baseGraph.edges.filter(edge=>keep.has(edge.from)&&(edge.end||keep.has(edge.to)));
      baseGraph.byId=Object.fromEntries(baseGraph.nodes.map(n=>[n.id,n]));
    }
    graph=scaleStoryGraph(baseGraph,scale);

    schemaCanvas.replaceChildren();
    schemaCanvas.style.width=`${graph.width}px`;
    schemaCanvas.style.height=`${graph.height}px`;

    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','story-atlas-edges');
    svg.setAttribute('width',String(graph.width));
    svg.setAttribute('height',String(graph.height));
    svg.setAttribute('viewBox',`0 0 ${graph.width} ${graph.height}`);
    const marker=document.createElementNS('http://www.w3.org/2000/svg','defs');
    marker.innerHTML=`<marker id="story-atlas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor"/></marker>`;
    svg.append(marker);

    const laneOf=new Map();
    const showLabels=scale>=0.85;
    for(const edge of graph.edges){
      const from=graph.byId[edge.from];
      if(!from)continue;
      const to=edge.end?null:graph.byId[edge.to];
      const key=`${edge.from}->${edge.to??'end'}`;
      const lane=laneOf.get(key)||0;
      laneOf.set(key,lane+1);
      // stagger parallel outs from same node
      const sibling=graph.edges.filter(e=>e.from===edge.from).indexOf(edge);
      const pathLane=(sibling-Math.floor((from.outs?.length||1)/2))*1;
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',graphEdgePath(from,to||{x:from.x+graph.nodeW+40,y:from.y},graph.nodeW,graph.nodeH,pathLane));
      const active=edge.from===selected||edge.to===selected;
      path.setAttribute('class',`story-atlas-edge${edge.external?' is-external':''}${edge.end?' is-end':''}${active?' is-active':''}`);
      path.setAttribute('marker-end','url(#story-atlas-arrow)');
      svg.append(path);

      const usefulLabel=edge.label&&edge.label!=='→';
      if(usefulLabel&&to&&showLabels&&active){
        const point=graphEdgeLabelPoint(from,to,graph.nodeW,graph.nodeH,pathLane);
        const labelText=edge.label.length>22?edge.label.slice(0,21)+'…':edge.label;
        const group=document.createElementNS('http://www.w3.org/2000/svg','g');
        group.setAttribute('class','story-atlas-edge-label-group');
        const bg=document.createElementNS('http://www.w3.org/2000/svg','rect');
        const text=document.createElementNS('http://www.w3.org/2000/svg','text');
        text.textContent=labelText;
        text.setAttribute('x',String(point.x));
        text.setAttribute('y',String(point.y));
        text.setAttribute('class','story-atlas-edge-label');
        group.append(bg,text);
        svg.append(group);
        // size background after text exists in DOM
        requestAnimationFrame(()=>{
          try{
            const box=text.getBBox();
            bg.setAttribute('x',String(box.x-6));
            bg.setAttribute('y',String(box.y-3));
            bg.setAttribute('width',String(box.width+12));
            bg.setAttribute('height',String(box.height+6));
            bg.setAttribute('rx','6');
            bg.setAttribute('class','story-atlas-edge-label-bg');
          }catch{/* Safari may throw before layout */}
        });
      }
    }
    schemaCanvas.append(svg);

    const layer=el('div','','story-atlas-nodes');
    const fontSize=Math.max(11,Math.round(12*Math.min(1.15,scale)));
    const metaSize=Math.max(9,Math.round(10*Math.min(1.1,scale)));
    const previewSize=Math.max(10,Math.round(11*Math.min(1.1,scale)));
    for(const node of graph.nodes){
      if(!legacyBox.checked&&atlas.scenes[node.id]?.legacyOnly&&node.id!==selected)continue;
      const button=el('button','','story-atlas-node');
      button.type='button';
      button.style.left=`${node.x}px`;
      button.style.top=`${node.y}px`;
      button.style.width=`${graph.nodeW}px`;
      button.style.height=`${graph.nodeH}px`;
      button.dataset.id=node.id;
      button.classList.toggle('is-selected',node.id===selected);
      button.classList.toggle('is-external',!!node.external);
      button.classList.toggle('is-root',node.id===graph.root);
      const thumb=frameThumb(node.frame,'story-atlas-node-frame');
      if(thumb)button.append(thumb);
      const copy=el('div','','story-atlas-node-copy');
      const title=el('strong',node.label);
      title.style.fontSize=`${fontSize}px`;
      copy.append(title);
      if(node.meta){
        const meta=el('small',node.meta,'story-atlas-node-meta');
        meta.style.fontSize=`${metaSize}px`;
        copy.append(meta);
      }
      if(node.preview){
        const previewLine=el('span',node.preview,'story-atlas-node-preview');
        previewLine.style.fontSize=`${previewSize}px`;
        copy.append(previewLine);
      }
      button.append(copy);
      button.onclick=()=>goTo(node.id);
      layer.append(button);
    }
    schemaCanvas.append(layer);
    applyPan();
  }

  function renderAll(){
    renderGraph();
    renderPreview(atlas.scenes[selected]||null);
    renderDetail(atlas.scenes[selected]||null);
  }

  search.addEventListener('input',()=>{
    const q=resolveSceneReference(nodes,search.value.trim())||search.value.trim();
    if(!q)return;
    const rows=filterAtlasScenes(atlas,{
      chapterId:chapter.value==='focus'?'all':chapter.value,
      query:q,
      includeLegacy:legacyBox.checked
    });
    if(rows[0]){
      if(chapter.value!=='focus'&&rows[0].chapterId)chapter.value=rows[0].chapterId;
      goTo(rows[0].id);
    }
  });
  search.addEventListener('keydown',event=>{
    if(event.key!=='Enter')return;
    const q=resolveSceneReference(nodes,search.value.trim())||search.value.trim();
    if(atlas.scenes[q]){
      if(atlas.scenes[q].chapterId)chapter.value=atlas.scenes[q].chapterId;
      goTo(q);
    }
  });
  chapter.addEventListener('change',()=>{
    if(chapter.value!=='focus'&&chapter.value!=='orphans'){
      const row=atlas.chapters.find(item=>item.id===chapter.value);
      if(row&&!row.sceneIds.includes(selected))selected=row.start;
    }
    crawl=[selected];
    renderAll();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{fitGraph();centerOn(selected);}));
  });
  legacyBox.addEventListener('change',()=>renderAll());

  zoomIn.onclick=()=>setZoom(scale+0.12);
  zoomOut.onclick=()=>setZoom(scale-0.12);
  zoomReset.onclick=()=>fitGraph();
  fitBtn.onclick=()=>centerOn(selected);

  schemaViewport.addEventListener('pointerdown',event=>{
    dragging=true;
    dragOrigin={x:event.clientX-panX,y:event.clientY-panY};
    schemaViewport.classList.add('is-panning');
    schemaViewport.setPointerCapture?.(event.pointerId);
  });
  schemaViewport.addEventListener('pointermove',event=>{
    if(!dragging||!dragOrigin)return;
    panX=event.clientX-dragOrigin.x;
    panY=event.clientY-dragOrigin.y;
    applyPan();
  });
  const endPan=event=>{
    dragging=false;dragOrigin=null;schemaViewport.classList.remove('is-panning');
    try{schemaViewport.releasePointerCapture?.(event.pointerId);}catch{/* ignore */}
  };
  schemaViewport.addEventListener('pointerup',endPan);
  schemaViewport.addEventListener('pointercancel',endPan);
  schemaViewport.addEventListener('wheel',event=>{
    if(event.ctrlKey||event.metaKey){
      event.preventDefault();
      setZoom(scale+(event.deltaY>0?-0.08:0.08));
    }else{
      event.preventDefault();
      panX-=event.deltaX;
      panY-=event.deltaY;
      applyPan();
    }
  },{passive:false});

  updateZoomLabel();
  renderAll();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    fitGraph();
    centerOn(selected);
  }));
}
