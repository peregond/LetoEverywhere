import {t} from './i18n.js?v=0.17.23';
import {setQuestIcon} from './quest-controls.js?v=0.17.8';

// Coordinates correspond to the three distinct apartment illustrations.
export const SETTLE_AREAS={
 newbelgrade:{key:{x:.17,y:.25,rx:.08,ry:.06},router:{x:.77,y:.42,rx:.13,ry:.06},case:{x:.33,y:.69,rx:.32,ry:.13}},
 dorcol:{key:{x:.075,y:.23,rx:.08,ry:.06},router:{x:.47,y:.50,rx:.14,ry:.07},case:{x:.38,y:.79,rx:.32,ry:.13}},
 vracar:{key:{x:.92,y:.235,rx:.08,ry:.06},router:{x:.90,y:.44,rx:.12,ry:.07},case:{x:.40,y:.73,rx:.32,ry:.14}}
};
export const SETTLE_TASKS=[{id:'case',bit:1,label:'Разобрать чемодан',done:'Чемодан разобран'},{id:'router',bit:2,label:'Подключить роутер',done:'Роутер подключён'},{id:'key',bit:4,label:'Повесить ключ у двери',done:'Ключ на крючке'}];
export function mountFlatSettleQuest(root,{district='dorcol',mask=0,onChange,onComplete,onBack,onSettings,canRewind}){
 const doc=root.ownerDocument,events=new AbortController(),area=SETTLE_AREAS[district]??SETTLE_AREAS.dorcol;
 const room=Object.hasOwn(SETTLE_AREAS,district)?district:'dorcol';let done=mask&7;
 const make=(tag,cls)=>{const el=doc.createElement(tag);el.className=cls;return el;};
 const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
 root.replaceChildren();const stage=make('div','room-quest-stage');
 const image=make('img','room-quest-base');image.src=`./assets/flat-settle-${room}-start-v1.webp`;image.alt=t('Новая квартира: нажми на отмеченные места');stage.append(image);
 const header=make('header','room-tools');const back=setQuestIcon(make('button',''),'back',t('← Назад'));back.type='button';back.disabled=!canRewind;listen(back,'click',onBack);
 const settings=setQuestIcon(make('button',''),'settings',t('Настройки'));settings.type='button';listen(settings,'click',onSettings);header.append(back,settings);
 const heading=make('h2','room-title');heading.id='room-interaction-title';heading.textContent=t('Обустроиться в новой квартире');
 const status=make('p','room-progress');status.setAttribute('aria-live','polite');
 const announcements=make('p','room-quest-sr');announcements.setAttribute('role','status');
 const buttons=SETTLE_TASKS.map(task=>{
  const spot=area[task.id],reveal=make('img','room-quest-reveal');reveal.src=`./assets/flat-settle-${room}-done-v1.webp`;reveal.alt='';reveal.setAttribute('aria-hidden','true');
  const gradient=`radial-gradient(ellipse ${spot.rx*100}% ${spot.ry*100}% at ${spot.x*100}% ${spot.y*100}%,#000 70%,transparent 100%)`;
  reveal.style.maskImage=gradient;reveal.style.webkitMaskImage=gradient;stage.append(reveal);
  const button=make('button','room-hotspot');button.type='button';button.dataset.task=task.id;button.setAttribute('aria-label',t(task.label));stage.append(button);
  listen(button,'click',()=>{if(done&task.bit)return;done|=task.bit;announcements.textContent=t(task.done);paint();onChange(done);});return {button,reveal};
 });
 const next=make('button','room-quest-next primary');next.type='button';next.textContent=t('Дальше');listen(next,'click',()=>{if(done===7)onComplete();});
 const paint=()=>{for(const [i,task] of SETTLE_TASKS.entries()){const checked=!!(done&task.bit);buttons[i].reveal.hidden=!checked;buttons[i].button.hidden=checked;}status.textContent=`${SETTLE_TASKS.filter(task=>done&task.bit).length} / 3`;next.hidden=done!==7;};
 const fit=()=>{const width=root.clientWidth,height=root.clientHeight;if(!width||!height)return;const scale=Math.max(width/941,height/1672),w=941*scale,h=1672*scale,x=(width-w)/2,y=(height-h)/2;Object.assign(stage.style,{width:w+'px',height:h+'px',left:x+'px',top:y+'px'});
  SETTLE_TASKS.forEach((task,i)=>{const spot=area[task.id];buttons[i].button.style.left=(Math.max(30,Math.min(width-30,x+spot.x*w))-x)+'px';buttons[i].button.style.top=(Math.max(30,Math.min(height-30,y+spot.y*h))-y)+'px';});};
 root.append(stage,header,heading,status,announcements,next);paint();fit();const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(fit);observer?.observe(root);
 return()=>{events.abort();observer?.disconnect();};
}
