import {setQuestIcon} from './quest-controls.js?v=0.17.8';
// Full-screen illustrated interactions: the district map and the three-station flat viewing.
// Story progress stays with the caller; these templates only draw, report taps and clean up after themselves.
import {getLanguage,t} from './i18n.js?v=0.17.23';
import {imageHotspotRect} from './interaction.js?v=0.17.2';
import {FLATS,QUEST_STATIONS,hasSeen,DISTRICT_LABEL,T} from './flat-data.js?v=1';

const pick=pair=>getLanguage()==='en'?pair[1]:pair[0];
// Interface strings are registered once at load so tools/merge-translations.mjs can collect them.
const UI=[
  T('Художественная панорама Белграда с рекой, крепостью и храмом Святого Саввы','Painted panorama of Belgrade with the river, the fortress and the Church of Saint Sava'),
  T('Выбери район','Choose a district'),
  T('Нажми на район. Выбор не окончательный: смотреть можно любые варианты.','Tap a district. The choice is not final: you can look at any option.'),
  T('уже смотрели','already seen'),
  T('Осмотр квартиры','Viewing the flat'),
  T('Участки осмотра','Parts of the viewing'),
  T('Закончить осмотр','Finish the viewing'),
  T('Осталось','Left'),
  T('Всё проверено','Everything checked'),
  T('Нажми на оба предмета в любом порядке','Tap both objects in any order')
];
const MAP_SIZE={width:1080,height:1920};
// Where each district sits on the painted panorama (fractions of the picture).
export const MAP_PINS={dorcol:{x:.77,y:.29},vracar:{x:.74,y:.77},newbelgrade:{x:.19,y:.45}};
const make=(doc,tag,className,text)=>{const node=doc.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
function toolbar(doc,{title,canRewind,onBack,onSettings,listen}){
  const header=make(doc,'header','quest-tools');
  const back=setQuestIcon(make(doc,'button','quest-tool'),'back',t('← Назад'));back.type='button';back.disabled=!canRewind;listen(back,'click',onBack);
  const heading=make(doc,'h2','quest-title',title);
  const settings=setQuestIcon(make(doc,'button','quest-tool'),'settings',t('Настройки'));settings.type='button';listen(settings,'click',onSettings);
  header.append(back,heading,settings);return {header,heading};
}

export function mountDistrictMap(root,{choices,flags,onChoose,onBack,onSettings,canRewind}){
  const doc=root.ownerDocument;
  const events=new AbortController();const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
  root.replaceChildren();
  const art=make(doc,'img','quest-art map-art');art.alt=t(UI[0]);art.src='./assets/belgrade-district-map-v1.webp';
  const {header,heading}=toolbar(doc,{title:t(UI[1]),canRewind,onBack,onSettings,listen});heading.id='scene-quest-title';
  const hint=make(doc,'p','map-hint',t(UI[2]));
  const pins=new Map();
  for(const choice of choices){
    const district=choice.effect?.district;if(!MAP_PINS[district]||pins.has(district))continue;
    const owner=choice.effect.districtOwner;
    const seen=!!(choice.revisit&&hasSeen(flags,owner));
    const button=make(doc,'button','map-pin');button.type='button';button.dataset.district=district;button.dataset.seen=String(seen);
    const name=make(doc,'strong','map-pin-name',pick(DISTRICT_LABEL[district]??[district,district]));
    const ownerLine=OWNER_LINE[owner];
    const meta=make(doc,'small','map-pin-meta',ownerLine?(seen?'✓ ':'')+pick(ownerLine):'');
    button.append(name,meta);
    button.setAttribute('aria-label',pick(DISTRICT_LABEL[district]??[district,district])+(ownerLine?' · '+pick(ownerLine):'')+(seen?' · '+t(UI[3]):''));
    listen(button,'click',()=>onChoose(seen?{...choice,next:choice.revisit}:choice));
    pins.set(district,button);
  }
  const place=()=>{
    const width=root.clientWidth,height=root.clientHeight;
    for(const [district,button]of pins){
      const spot=MAP_PINS[district];const box=imageHotspotRect(width,height,MAP_SIZE.width,MAP_SIZE.height,{x:spot.x,y:spot.y,width:0,height:0});
      const half=button.offsetWidth/2||70;
      button.style.left=Math.max(half+10,Math.min(width-half-10,box.left))+'px';
      button.style.top=Math.max(110,Math.min(height-90,box.top))+'px';
    }
  };
  root.append(art,header,hint,...pins.values());
  const observer=new ResizeObserver(place);observer.observe(root);listen(art,'load',place);requestAnimationFrame(place);
  return ()=>{events.abort();observer.disconnect();};
}
// The people behind the first flat of each district; the original story (Jelena and Dragan) shows its own hosts.
const OWNER_LINE={ana:['Ана · Стефан','Ana · Stefan'],marko:['Марко','Marko'],vuk:['Вук','Vuk'],jelena:['Йелена','Jelena'],dragan:['Драган','Dragan']};

// Hand-drawn vector fallbacks. A painted illustration replaces one through STATION_ART, e.g. {'ana:water':'flat-view-ana-water-v1'}.
export const STATION_ART=Object.fromEntries(['ana','stefan','marko','vuk'].flatMap(owner=>['water','windows','internet'].map(station=>[owner+':'+station,`flat-view-${owner}-${station}-v1`])));
// Positions are relative to each complete illustration, so taps stay on the objects on narrow screens.
const VIEWING_SPOTS={
 'ana:water':[[.25,.52],[.83,.48]], 'stefan:water':[[.23,.52],[.84,.46]],
 'marko:water':[[.22,.52],[.80,.43]], 'vuk:water':[[.10,.43],[.64,.33]],
 'ana:windows':[[.70,.51],[.48,.61]], 'stefan:windows':[[.78,.39],[.66,.64]], 'marko:windows':[[.73,.48],[.51,.62]],
 'vuk:windows':[[.69,.48],[.48,.62]], 'common:windows':[[.36,.42],[.47,.66]],
 'ana:internet':[[.30,.58],[.61,.61]], 'stefan:internet':[[.44,.73],[.69,.76]], 'marko:internet':[[.40,.55],[.64,.56]],
 'vuk:internet':[[.50,.49],[.75,.52]], 'common:internet':[[.43,.54],[.72,.55]], 'common:water':[[.24,.49],[.60,.42]]
};
const art={
 water:`<svg viewBox="0 0 320 270" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true"><rect width="320" height="270" fill="#cfe3e6"/><g transform="translate(0,25)"><g stroke="#b6d0d4" stroke-width="2">${Array.from({length:9},(_,i)=>`<path d="M${i*40} 0V220"/>`).join('')}${Array.from({length:6},(_,i)=>`<path d="M0 ${i*40}H320"/>`).join('')}</g><rect x="20" y="150" width="170" height="70" rx="14" fill="#fbfbf7"/><path d="M60 150h90v14a45 22 0 0 1-90 0Z" fill="#e3ecee"/><g class="faucet"><path d="M105 150v-28q0-22 22-22h26v14h-24q-8 0-8 8v20Z" fill="#aab6bb"/><rect x="146" y="106" width="18" height="12" rx="3" fill="#8da0a8"/></g><g class="drops"><circle cx="155" cy="124" r="4" fill="#4ea9d8"/><circle cx="155" cy="142" r="4" fill="#4ea9d8"/><circle cx="155" cy="160" r="3" fill="#4ea9d8"/></g><g class="shower"><path d="M250 20v72" stroke="#aab6bb" stroke-width="7"/><ellipse cx="250" cy="100" rx="28" ry="9" fill="#8da0a8"/><g class="spray" stroke="#4ea9d8" stroke-width="3" stroke-linecap="round"><path d="M232 114v28M244 116v34M256 116v34M268 114v28"/></g></g></g></svg>`,
 windows:`<svg viewBox="0 0 320 270" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true"><rect width="320" height="270" fill="#f1e4cf"/><g transform="translate(0,25)"><rect x="70" y="14" width="180" height="192" rx="8" fill="#fff6e6"/><defs><linearGradient id="skyq" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f6a26a"/><stop offset=".6" stop-color="#f7d7a0"/><stop offset="1" stop-color="#9fc5d6"/></linearGradient></defs><rect x="82" y="26" width="156" height="168" fill="url(#skyq)"/><path d="M82 168l16-26 14 16 18-34 16 30 20-26 18 22 18-30 16 28v44H82Z" fill="#5d6f7c" opacity=".8"/><g class="sash"><rect x="82" y="26" width="76" height="168" fill="#ffffff22" stroke="#fff6e6" stroke-width="8"/><circle cx="148" cy="112" r="5" fill="#b9a27c"/></g><rect x="158" y="26" width="80" height="168" fill="none" stroke="#fff6e6" stroke-width="8"/><g class="seal" stroke="#e08a3c" stroke-width="4" fill="none" stroke-linecap="round"><path d="M82 26h156M82 194h156M82 26v168M238 26v168"/></g><path d="M20 10q40 40 30 120t10 90H8V10Z" fill="#e7a49c"/><path d="M300 10q-40 40-30 120t-10 90h52V10Z" fill="#e7a49c"/></g></svg>`,
 internet:`<svg viewBox="0 0 320 270" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true"><rect width="320" height="270" fill="#e9dcc4"/><g transform="translate(0,25)"><rect x="0" y="156" width="320" height="64" fill="#b98c62"/><rect x="30" y="150" width="260" height="12" rx="3" fill="#8d6845"/><g class="box"><rect x="86" y="102" width="148" height="48" rx="10" fill="#33414b"/><g class="leds"><circle cx="112" cy="126" r="5" fill="#6ee08f"/><circle cx="132" cy="126" r="5" fill="#6ee08f"/><circle cx="152" cy="126" r="5" fill="#f2c94c"/><circle cx="172" cy="126" r="5" fill="#6ee08f"/></g><path d="M104 102 96 50M216 102l8-52" stroke="#33414b" stroke-width="7" stroke-linecap="round"/></g><g class="waves" fill="none" stroke="#2f8f83" stroke-width="5" stroke-linecap="round"><path d="M138 34q22-18 44 0"/><path d="M122 18q38-30 76 0"/><path d="M154 46q6-5 12 0"/></g><g class="bars" fill="#2f8f83"><rect x="246" y="118" width="12" height="16"/><rect x="264" y="104" width="12" height="30"/><rect x="282" y="88" width="12" height="46"/></g></g></svg>`
};

// Keep the original save bit assignments while presenting the rooms in a fixed order.
export const VIEWING_ORDER=[0,2,1];
export function mountViewingQuest(root,{owner,mask=0,canRewind,onBack,onSettings,onChange,onComplete,isPaused=()=>false,schedule=setTimeout,cancel=clearTimeout}){
  const doc=root.ownerDocument,flat=FLATS[owner];
  const events=new AbortController();const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
  let done=mask&63,finished=false,pending=null,lastTarget=null;
  const bit=(station,target)=>1<<(station*2+target);
  const stationDone=station=>!!((done&bit(station,0))&&(done&bit(station,1)));
  let step=VIEWING_ORDER.findIndex(station=>!stationDone(station));
  if(step<0)step=VIEWING_ORDER.length-1;
  root.replaceChildren();
  const image=make(doc,'img','quest-art viewing-full-art');image.alt='';
  const {header,heading}=toolbar(doc,{title:t(UI[4]),canRewind,onBack,onSettings,listen});heading.id='scene-quest-title';
  const overlay=make(doc,'div','viewing-full-controls');
  const hint=make(doc,'p','viewing-full-hint');hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');
  const progress=make(doc,'p','viewing-full-progress');
  const targets=[0,1].map(()=>{const button=make(doc,'button','viewing-object');button.type='button';overlay.append(button);return button;});
  root.append(image,header,overlay,hint,progress);
  const place=()=>{
    const station=QUEST_STATIONS[VIEWING_ORDER[step]],spots=VIEWING_SPOTS[`${owner}:${station.id}`]??VIEWING_SPOTS[`common:${station.id}`];
    const width=root.clientWidth||390,height=root.clientHeight||844;
    spots.forEach(([x,y],index)=>{
      const point=imageHotspotRect(width,height,image.naturalWidth||941,image.naturalHeight||1672,{x,y,width:0,height:0});
      targets[index].style.left=Math.max(34,Math.min(width-34,point.left))+'px';
      targets[index].style.top=Math.max(110,Math.min(height-150,point.top))+'px';
    });
  };
  const paint=(message='')=>{
    const index=VIEWING_ORDER[step],station=QUEST_STATIONS[index],base=STATION_ART[`${owner}:${station.id}`];
    const suffix=station.id==='water'&&lastTarget!==null?'-'+(lastTarget===0?'tap':'shower')+'-v1':'';
    image.src='./assets/'+(suffix?base.replace(/-v1$/,suffix):base)+'.webp';
    heading.textContent=pick(station.title);
    hint.textContent=message||t(UI[9]);
    progress.textContent=`${step+1} / ${VIEWING_ORDER.length}`;
    station.targets.forEach(([,label],target)=>{
      const button=targets[target],checked=!!(done&bit(index,target));
      button.textContent=checked?'✓':pick(label);button.dataset.done=String(checked);button.disabled=checked||finished;
      button.setAttribute('aria-label',pick(label));button.setAttribute('aria-pressed',String(checked));
    });
    place();
  };
  const next=()=>{pending=null;if(finished)return;if(isPaused()){pending=schedule(next,250);return;}const nextStep=VIEWING_ORDER.findIndex(station=>!stationDone(station));
    if(nextStep<0){finished=true;onComplete();return;}step=nextStep;lastTarget=null;paint();};
  targets.forEach((button,target)=>listen(button,'click',()=>{
    if(finished||pending!==null)return;
    const stationIndex=VIEWING_ORDER[step],station=QUEST_STATIONS[stationIndex],value=bit(stationIndex,target);
    if(done&value)return;done|=value;lastTarget=target;onChange(done);paint(pick(flat.findings[station.targets[target][0]]));
    if(stationDone(stationIndex))pending=schedule(next,1300);
  }));
  listen(image,'load',place);const observer=new ResizeObserver(place);observer.observe(root);paint();
  if(VIEWING_ORDER.every(stationDone))pending=schedule(next,0);
  return()=>{finished=true;if(pending!==null)cancel(pending);events.abort();observer.disconnect();};
}
