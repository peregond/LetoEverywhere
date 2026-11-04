import {t} from './i18n.js?v=0.17.23';
// Presentation only: unlocks and restart points continue to come from saved chapter marks.
export function drawChapterMap(root,{chapters,source,current,onSelect,isAvailable=()=>true,debugAccess=false}){
 const doc=root.ownerDocument;
 const el=(tag,text,cls)=>{const item=doc.createElement(tag);if(text)item.textContent=t(text);if(cls)item.className=cls;return item;};
 root.replaceChildren();
 const hero=el('div','','chapter-map-hero');hero.append(el('p','СЕРБСКОЕ ЛЕТО','eyebrow'),el('h3','Твоё лето в Белграде'),el('p',source?'Каждый день — новая история':'Тридцать дней, которые всё изменят'));
 const intro=el('p',source?(debugAccess?'Режим проверки: можно перейти в любую главу. Сначала скачай сохранение, если хочешь сохранить текущую историю.':'Возвращайся к открытым главам. При переигрывании дальнейшие выборы будут сделаны заново.'):'Главы открываются по мере прохождения. Сначала выбери своего персонажа.','chapter-map-hint');hero.append(intro);root.append(hero);
 const route=el('ol','','chapter-route');route.setAttribute('aria-label',t('Маршрут истории'));
 const xs=[33,50,67,50];const step=176;
 const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',`0 0 100 ${chapters.length*step}`);svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('chapter-route-line');
 let d=`M${xs[0]} 40`;for(let i=1;i<chapters.length;i++){const y=(i-1)*step+40;d+=` C${xs[(i-1)%4]} ${y+step*.55} ${xs[i%4]} ${y+step*.45} ${xs[i%4]} ${y+step}`;}
 const path=doc.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',d);path.setAttribute('vector-effect','non-scaling-stroke');svg.append(path);route.append(svg);
 chapters.forEach((chapter,index)=>{
  const available=isAvailable(chapter);
  const unlocked=available&&!!source&&(debugAccess||chapter.id==='prologue'||!!source.chapterMarks?.[chapter.id]);const isCurrent=chapter.id===current?.id;
  const missing=source&&index<chapters.indexOf(current)&&!unlocked;
  const state=!available?'Пока закрыта':isCurrent?'Сейчас':unlocked?'Доступна':missing?'Нет старой точки':'Пока закрыта';
  const row=el('li','','chapter-stop');row.style.setProperty('--stop-x',xs[index%4]+'%');
  const button=el('button','','chapter-level');button.type='button';button.disabled=!unlocked;button.dataset.current=String(isCurrent);button.dataset.chapter=chapter.id;
  if(isCurrent)button.setAttribute('aria-current','step');
  const badge=el('span',available?(chapter.day?String(chapter.day):chapter.id==='prologue'?'✈':'⌂'):'','chapter-level-number');badge.setAttribute('aria-hidden','true');
  if(!available){
   const lock=doc.createElementNS(svg.namespaceURI,'svg');lock.setAttribute('viewBox','0 0 24 24');lock.setAttribute('fill','none');lock.setAttribute('stroke','currentColor');lock.setAttribute('stroke-width','2');lock.setAttribute('stroke-linecap','round');lock.setAttribute('stroke-linejoin','round');
   const shape=doc.createElementNS(svg.namespaceURI,'path');shape.setAttribute('d','M7 10V7a5 5 0 0 1 10 0v3M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm6 4v3');lock.append(shape);badge.append(lock);
  }
  const label=el('span','','chapter-level-label');label.append(el('small',available?chapter.number+' · '+state:chapter.number),el('strong',chapter.title));
  button.title=t(!available?'Пока закрыта':missing?'В старом сохранении нет точки этой главы. Текущую историю можно продолжить.':chapter.description);
  button.setAttribute('aria-label',t(chapter.number)+' · '+t(chapter.title)+' · '+t(state));
  button.append(badge,label);button.addEventListener('click',()=>onSelect(chapter));row.append(button);route.append(row);
 });
 root.append(route,el('p','Твой город. Твои люди. Твой выбор.','chapter-map-finish'));
}
