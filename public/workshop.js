import {unlockPreview} from './chapter-access.js?v=0.17.2';
import { t, getLanguage } from './i18n.js?v=0.17.23';
import { acceptsWorkshopCode, buildArtCatalog, EMOTIONS, CORE_EMOTIONS } from './workshop-model.js?v=0.17.2';
import { mountStoryAtlas } from './story-atlas.js?v=0.17.23';

const el = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = t(text);
  if (className) node.className = className;
  return node;
};
import { filterWorkshopEntries, paginateWorkshopEntries } from './workshop-library.js?v=0.17.2';

const statusLabel = { active: 'В игре', archive: 'Прежняя версия', draft: 'Эскиз · не подключено', asset: 'Ресурс' };

export function mountWorkshopEntry(container, open, onUnlock=()=>{}) {
  const form = el('form', '', 'workshop-code');
  const label = el('label', 'Промокод');
  const input = el('input');
  input.id = 'workshop-code'; input.type = 'text'; input.autocomplete = 'off';
  input.autocapitalize = 'none'; input.spellcheck = false;
  label.htmlFor = input.id;
  const button = el('button', 'Открыть', 'secondary'); button.type = 'submit';
  const message = el('p'); message.setAttribute('role', 'status');
  form.append(label, input, button, message);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if(unlockPreview(input.value)){input.value='';message.textContent=t('Все главы открыты на этом устройстве');onUnlock();return;}
    if (!acceptsWorkshopCode(input.value)) { message.textContent = t('Промокод не найден'); return; }
    input.value = ''; open();
  });
  container.append(form);
}

const text = (ru, en) => getLanguage() === 'en' ? en : ru;
const icons = {
  characters:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/>',
  supporting:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
  backgrounds:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',
  audio:'<path d="M9 18V5l12-2v13M9 9l12-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="18" cy="16" rx="3" ry="2"/>',
  assets:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  gaps:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 3v1"/>',
  story:'<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="16" width="7" height="5" rx="1"/><path d="M6 8v10h8M10 5h8v11"/>',
};
function icon(name) {
  const span=el('span','','ws-icon');
  span.innerHTML=`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.assets}</svg>`;
  return span;
}
function selectControl(label, options) {
  const select=el('select'); select.setAttribute('aria-label',label);
  for(const [value,caption] of options){const option=el('option',caption);option.value=value;select.append(option);}
  return select;
}

export async function mountWorkshop(container, { sprites, backgrounds, nodes, chapters, start, back, initialScene, onTestScene }) {
  container.classList.add('workshop');
  const panel=container.closest('dialog')||document.getElementById('panel');
  panel?.classList.add('workshop-wide');
  const leave=()=>{panel?.classList.remove('workshop-wide');back();};
  const loading=el('p',text('Загружаем библиотеку…','Loading the library…'),'ws-empty');
  const retry=el('button',text('← К настройкам','← Back to settings'),'ws-back');retry.onclick=leave;
  container.replaceChildren(retry,loading);
  let catalog;
  try {
    const response=await fetch('./art-assets.json',{cache:'no-store'});
    if(!response.ok)throw Error('Inventory unavailable');
    catalog=buildArtCatalog(await response.json(),sprites,backgrounds);
  } catch {loading.textContent=t('Не удалось загрузить библиотеку. Откройте мастерскую ещё раз.');return;}
  if(!loading.isConnected)return;

  const people=[...catalog.people,...catalog.rentals,...catalog.supporting];
  const mainPeople=[...catalog.people,...catalog.rentals];
  const personById=new Map(people.map(person=>[person.id,person]));
  const shell=el('div','','ws-shell');shell.dataset.density='comfortable';
  const sidebar=el('aside','','ws-sidebar');
  const brand=el('strong',text('Мастерская','Workshop'),'ws-brand');
  sidebar.append(retry,brand,el('small',text('Сербское лето · библиотека','Serbian Summer · library')));
  const nav=el('nav','','ws-nav');nav.setAttribute('aria-label',text('Разделы мастерской','Workshop sections'));sidebar.append(nav);
  const peopleNav=el('div','','ws-people');sidebar.append(peopleNav);
  const main=el('main','','ws-main');
  const header=el('header','','ws-header');
  const heading=el('div');const title=el('h2');title.id='ws-title';
  const subtitle=el('p','','ws-subtitle');heading.append(title,subtitle);
  const stats=el('div','','ws-stats');
  for(const [value,label] of [[catalog.entries.filter(e=>e.image).length,text('изображений','images')],[people.length,text('героев','characters')],[Object.keys(nodes||{}).length,text('сцен','scenes')]]){
    const stat=el('span');stat.append(el('strong',String(value)),document.createTextNode(' '+label));stats.append(stat);
  }
  header.append(heading,stats);
  const toolbar=el('div','','ws-toolbar');
  const searchLabel=el('label','','ws-search');
  const search=el('input');search.type='search';search.placeholder=text('Поиск: персонаж, эмоция, файл…','Search: character, emotion, file…');search.setAttribute('aria-label',text('Поиск по библиотеке','Search the library'));
  searchLabel.append(search);
  const person=selectControl(text('Персонаж','Character'),[['all',text('Все персонажи','All characters')],...people.map(p=>[p.id,t(p.name)])]);person.className='ws-person-select';
  const look=selectControl(t('Образ персонажа'),[['all',t('Все образы')],...[...new Set(catalog.entries.filter(e=>e.character).map(e=>e.look))].map(value=>[value,t(value)])]);
  const statusFilter=selectControl(text('Статус ресурса','Asset status'),[['current',text('Актуальные','Current')],['active',text('Подключены','Connected')],['draft',text('Черновики','Drafts')],['archive',text('Архив','Archive')],['all',text('Все версии','All versions')]]);
  const category=selectControl(t('Тип ресурса'),Object.entries({all:t('Все ресурсы'),characters:t('Персонажи'),backgrounds:t('Фоны'),images:t('Другие изображения'),audio:t('Музыка'),fonts:t('Шрифты'),other:t('Другие файлы')}));
  const density=el('button',text('Компактнее','Compact grid'),'ws-density');density.setAttribute('aria-pressed','false');
  density.onclick=()=>{const compact=shell.dataset.density!=='compact';shell.dataset.density=compact?'compact':'comfortable';density.setAttribute('aria-pressed',String(compact));};
  toolbar.append(searchLabel,person,look,statusFilter,category,density);
  const body=el('div','','ws-body');
  const results=el('div','','ws-results');results.setAttribute('aria-labelledby','ws-title');
  const inspector=el('aside','','ws-inspector');inspector.hidden=true;inspector.setAttribute('aria-label',text('Просмотр ресурса','Asset inspector'));
  body.append(results,inspector);
  const footer=el('footer','','ws-footer');const status=el('p');status.setAttribute('role','status');
  const more=el('button',text('Показать ещё 60','Show 60 more'));more.hidden=true;footer.append(status,more);
  main.append(header,toolbar,body,footer);shell.append(sidebar,main);container.replaceChildren(shell);

  let view=initialScene?'story':'characters',limit=60,filtered=[],selected=null,opener=null;
  const sections={characters:[text('Персонажи','Characters'),mainPeople.reduce((n,p)=>n+p.art.filter(e=>e.status!=='archive').length,0)],supporting:[text('Эпизодические','Supporting cast'),catalog.supporting.length],backgrounds:[text('Фоны','Backgrounds'),catalog.entries.filter(e=>e.category==='backgrounds').length],audio:[text('Музыка и звук','Music & sound'),catalog.entries.filter(e=>e.category==='audio').length],assets:[text('Все ресурсы','All assets'),catalog.entries.length],gaps:[text('Проверка наборов','Coverage'),mainPeople.filter(p=>p.missing.length).length],story:[text('Сцены и сюжет','Scenes & story'),Object.keys(nodes||{}).length]};
  const subtitles={characters:text('Образы и эмоции. Выберите изображение для подробного просмотра.','Looks and expressions. Select an image to inspect it.'),supporting:text('Второстепенные собеседники и их портреты.','Supporting characters and their portraits.'),backgrounds:text('Локации и постановочные фоны игры.','Locations and scene backgrounds.'),audio:text('Слушайте музыку, не выходя из библиотеки.','Preview music without leaving the library.'),assets:text('Полная библиотека, включая архив и вспомогательные файлы.','The complete library, including archives and supporting files.'),gaps:text('Восемь эмоций проверяются для каждого основного образа отдельно.','Each core look is checked for eight expressions separately.'),story:text('Найдите сцену по коду или реплике и скопируйте ссылку для правок.','Find a scene by code or dialogue and copy its link for feedback.')};
  function closeInspector(restore=false){selected=null;inspector.hidden=true;inspector.replaceChildren();body.dataset.inspecting='false';for(const card of results.querySelectorAll('.ws-card'))card.setAttribute('aria-pressed','false');if(restore&&opener?.isConnected)opener.focus();}
  function switchView(value){view=value;limit=60;search.value='';person.value='all';look.value='all';category.value='all';closeInspector();render();}
  for(const [value,[label,count]] of Object.entries(sections)){
    const button=el('button','','ws-nav-button');button.dataset.view=value;button.append(icon(value),el('span',label),el('small',String(count)));button.onclick=()=>switchView(value);nav.append(button);
  }
  async function copy(value,success){try{await navigator.clipboard.writeText(value);status.textContent=success;}catch{status.textContent=text('Не удалось скопировать. Можно выделить путь вручную.','Could not copy. You can select the path manually.');}}
  function inspect(entry,button){
    selected=entry;opener=button||opener;inspector.replaceChildren();inspector.hidden=false;body.dataset.inspecting='true';
    for(const card of results.querySelectorAll('.ws-card'))card.setAttribute('aria-pressed',String(card.dataset.file===entry.file));
    const top=el('div','','ws-inspector-heading');const name=personById.get(entry.character)?.name;
    const close=el('button','×');close.setAttribute('aria-label',text('Закрыть предпросмотр','Close preview'));close.onclick=()=>closeInspector(true);
    top.append(el('h3',name||text('Просмотр ресурса','Asset preview')),close);inspector.append(top);
    const stage=el('div','','ws-preview-stage');stage.dataset.background='checker';
    if(entry.image){
      const img=el('img','','ws-preview');img.src='./assets/'+entry.file;img.alt=[name,EMOTIONS[entry.emotion]||entry.look].filter(Boolean).map(value=>t(value)).join(' · ');
      img.onload=()=>{dimensions.textContent=`${img.naturalWidth} × ${img.naturalHeight} px`;};img.onerror=()=>{stage.replaceChildren(el('p',t('Файл недоступен'),'ws-empty'));};stage.append(img);
    }else if(entry.category==='audio'){
      const audio=el('audio');audio.controls=true;audio.preload='metadata';audio.src='./assets/'+entry.file;stage.append(audio);
    }else{stage.append(icon(entry.category));}
    inspector.append(stage);
    if(entry.image){const tones=el('div','','ws-preview-background');tones.setAttribute('role','group');tones.setAttribute('aria-label',text('Фон предпросмотра','Preview background'));for(const [value,label] of [['checker',text('Прозрачность','Transparency')],['light',text('Светлый','Light')],['dark',text('Тёмный','Dark')]]){const b=el('button',label);b.setAttribute('aria-pressed',String(value==='checker'));b.onclick=()=>{stage.dataset.background=value;for(const other of tones.children)other.setAttribute('aria-pressed',String(other===b));};tones.append(b);}inspector.append(tones);}
    const metadata=el('dl','','ws-meta');const dimensions=el('dd',entry.image?'…':'—');
    for(const [label,value] of [[text('Статус','Status'),t(statusLabel[entry.status])],[text('Образ','Look'),t(entry.look)||'—'],[text('Эмоция','Expression'),t(EMOTIONS[entry.emotion]||'')||'—']])metadata.append(el('dt',label),el('dd',value));
    metadata.append(el('dt',text('Размер','Dimensions')),dimensions,el('dt',text('Файл','File')),el('dd',entry.file,'ws-file'));inspector.append(metadata);
    const actions=el('div','','ws-actions');const copyPath=el('button',text('Копировать путь','Copy path'));copyPath.onclick=()=>copy('public/assets/'+entry.file,text('Путь скопирован','Path copied'));
    const original=el('a',text('Открыть оригинал ↗','Open original ↗'));original.href='./assets/'+entry.file;original.target='_blank';original.rel='noopener';actions.append(copyPath,original);
    const note=el('button',text('Копировать карточку для правок','Copy details for feedback'));note.onclick=()=>copy([name&&t(name),t(entry.look),t(EMOTIONS[entry.emotion]||''),'public/assets/'+entry.file].filter(Boolean).join('\n'),text('Карточка скопирована — можно прислать её для правок','Details copied — you can send them with your feedback'));actions.append(note);inspector.append(actions);
    const paging=el('div','','ws-actions');for(const [delta,label] of [[-1,text('← Предыдущее','← Previous')],[1,text('Следующее →','Next →')]]){const index=filtered.indexOf(entry)+delta;const b=el('button',label);b.disabled=index<0||index>=filtered.length;b.onclick=()=>inspect(filtered[index]);paging.append(b);}inspector.append(paging);
  }
  body.addEventListener('keydown',event=>{if(event.key==='Escape'&&!inspector.hidden){event.preventDefault();event.stopPropagation();closeInspector(true);}});
  function card(entry){
    const button=el('button','','ws-card');button.dataset.file=entry.file;button.setAttribute('aria-pressed',String(selected?.file===entry.file));
    const media=el('div','','ws-card-image');
    if(entry.image){const image=el('img');image.src='./assets/'+entry.file;image.loading='lazy';image.decoding='async';image.alt='';image.onerror=()=>media.replaceChildren(el('span',text('Файл недоступен','File unavailable')));media.append(image);}else media.append(icon(entry.category));
    const info=el('div','','ws-card-info');const name=personById.get(entry.character)?.name;
    info.append(el('strong',name||entry.file.split('/').at(-1)),el('span',EMOTIONS[entry.emotion]||entry.look||text('Ресурс','Asset')),el('small',entry.file,'ws-file'),el('span',statusLabel[entry.status],'ws-badge '+entry.status));
    button.append(media,info);button.setAttribute('aria-label',[name,t(EMOTIONS[entry.emotion]||entry.look),entry.file].filter(Boolean).join(' · '));button.onclick=()=>{inspect(entry,button);inspector.querySelector('button')?.focus({preventScroll:true});};return button;
  }
  function renderPeople(){
    peopleNav.replaceChildren();peopleNav.hidden=!['characters','supporting','gaps'].includes(view);
    if(peopleNav.hidden)return;
    peopleNav.append(el('small',text('ПЕРСОНАЖИ','CHARACTERS')));
    const group=view==='supporting'?catalog.supporting:mainPeople;
    for(const p of [{id:'all',name:text('Все персонажи','All characters'),art:group.flatMap(p=>p.art)},...group]){const b=el('button','','ws-person-button');b.dataset.active=String(person.value===p.id);b.append(el('span',p.name),el('small',String(p.art.filter(e=>e.status!=='archive').length)));b.onclick=()=>{person.value=p.id;limit=60;closeInspector();render();};peopleNav.append(b);}
  }
  function renderCoverage(){
    const grid=el('div','','ws-gap-grid');
    for(const p of mainPeople.filter(p=>person.value==='all'||p.id===person.value)){
      const section=el('section','','ws-gap-card');const show=el('button',text('Открыть образы →','View looks →'));show.onclick=()=>{view='characters';person.value=p.id;look.value='all';search.value='';statusFilter.value='current';limit=60;render();};
      section.append(el('h3',p.name),el('p',p.missing.length?text('Не хватает: ','Missing: ')+p.missing.map(m=>t(EMOTIONS[m])).join(', '):text('Базовые эмоции собраны','Core expressions complete'),p.missing.length?'workshop-missing':'ws-complete'));
      for(const coverage of p.looks){const row=el('div','','ws-gap-row');row.append(el('h4',coverage.name),el('p',text('Подключено: ','Connected: ')+coverage.activeCount+'/'+CORE_EMOTIONS.length));if(coverage.missing.length)row.append(el('p',text('Нет изображения: ','No image: ')+coverage.missing.map(m=>t(EMOTIONS[m])).join(', ')));else if(coverage.missingInGame.length)row.append(el('p',text('Ещё не подключены: ','Not connected yet: ')+coverage.missingInGame.map(m=>t(EMOTIONS[m])).join(', ')));section.append(row);}
      section.append(el('p',p.underwear?t('Бельё: изображение подготовлено'):t('Бельё: изображения пока нет')),show);grid.append(section);
    }
    results.append(grid);
    if(person.value==='all'){const support=el('div','','ws-support-list');support.append(el('h3',text('Эпизодические собеседники','Supporting cast')));for(const p of catalog.supporting)support.append(el('p',`${t(p.name)} · ${p.missing.length?text('портрет отсутствует','portrait missing'):text('портрет готов','portrait ready')}`));results.append(support);}
    status.textContent=text('«Подключено» означает регистрацию в игре. Архив и бельевые образы не закрывают пробелы основных эмоций.','“Connected” means registered in the game. Archive and underwear looks do not fill core expression gaps.');
  }
  function render(){
    shell.dataset.view=view;container.dataset.workshopView=view;title.textContent=sections[view][0];subtitle.textContent=subtitles[view];
    for(const b of nav.children){const active=b.dataset.view===view;b.dataset.active=String(active);b.setAttribute('aria-pressed',String(active));}
    toolbar.hidden=view==='story'||view==='gaps';person.hidden=!['characters','supporting'].includes(view);look.hidden=person.hidden;category.hidden=view!=='assets';
    renderPeople();results.replaceChildren();status.textContent='';more.hidden=true;
    if(view==='story'){if(nodes&&chapters)mountStoryAtlas(results,{nodes,chapters,start,status,initialScene,onTestScene});else results.append(el('p',t('Карта сюжета недоступна в этой сборке.'),'ws-empty'));return;}
    if(view==='gaps'){renderCoverage();return;}
    filtered=filterWorkshopEntries(catalog.entries,{view,person:person.value,status:statusFilter.value,look:look.value,category:category.value,query:search.value,characterIds:(view==='supporting'?catalog.supporting:mainPeople).map(p=>p.id)},people,t);
    const page=paginateWorkshopEntries(filtered,limit);const grid=el('div','','ws-grid');for(const entry of page.items)grid.append(card(entry));results.append(grid);
    if(!filtered.length){const empty=el('div','','ws-empty');empty.append(el('h3',text('Ничего не найдено','No matches')),el('p',text('Попробуйте другой запрос или сбросьте фильтры.','Try another query or reset the filters.')));const reset=el('button',text('Сбросить фильтры','Reset filters'));reset.onclick=()=>{search.value='';person.value='all';look.value='all';category.value='all';statusFilter.value='current';render();};empty.append(reset);results.append(empty);}
    status.textContent=text(`Показано ${page.items.length} из ${page.total}`,`Showing ${page.items.length} of ${page.total}`);more.hidden=!page.hasMore;
  }
  more.onclick=()=>{const scroll=results.scrollTop;limit+=60;render();results.scrollTop=scroll;};
  for(const control of [search,person,look,statusFilter,category])control.addEventListener(control===search?'input':'change',()=>{limit=60;closeInspector();render();});
  render();
}

