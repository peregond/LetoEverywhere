import {t} from './i18n.js?v=0.17.27';
import {T} from './flat-data.js?v=1';
import {setQuestIcon} from './quest-controls.js?v=0.17.8';
export const ROOM_TASKS=[
 {id:'key',label:'Положить ключ на стол',short:'Ключ',done:'Ключ на столе',bit:1,rect:{x:.12,y:.43,width:.18,height:.08}},
 {id:'phone',label:'Поставить телефон на зарядку',short:'Телефон на зарядку',done:'Телефон заряжается',bit:2,rect:{x:.78,y:.36,width:.15,height:.12}},
 {id:'case',label:'Открыть чемодан',done:'Чемодан открыт',bit:4,rect:{x:.39,y:.60,width:.52,height:.19}}
];
export const BEDTIME_TASKS=[{id:'phone',label:'Поставить телефон на зарядку',done:'Телефон заряжается',bit:1,rect:{x:.65,y:.40,width:.10,height:.07}},{id:'water',label:'Поставить воду рядом',done:'Вода рядом',bit:2,rect:{x:.15,y:.37,width:.10,height:.07}},{id:'alarm',label:'Поставить будильник на подоконник',done:'Будильник на подоконнике',bit:4,rect:{x:.435,y:.34,width:.10,height:.07}}];
export function completeRoomTask(mask,bit){return(mask|bit)&7;}
const RESULTS={
 key:T('Ключ идёт в замок мягко и до конца. Теперь дверь точно моя.','The key turns smoothly all the way. The door is mine now.'),
 phone:T('Телефон заряжается. На экране появляется значок молнии.','The phone is charging. A little lightning bolt appears on the screen.'),
 case:T('Рубашки на плечики, мелочи в ящик. Чемодан стоит пустой и больше не просит внимания.','Shirts on hangers, small things in the drawer. The suitcase stands empty and no longer asks for attention.'),
 water:T('Стакан воды стоит у кровати, чтобы не вставать ночью.','A glass of water stands by the bed so I do not have to get up in the night.'),
 alarm:T('Будильник поставлен на утро. Я проверяю время дважды.','The alarm is set for the morning. I check the time twice.')
};
const HEADLINES={arrival:T('Устроиться в комнате','Settle into the room'),bedtime:T('Приготовиться ко сну','Get ready for bed')};
export function mountRoomInteraction(root,options){return mountArrivalQuest(root,options);}
// The artwork and its targets share a single scaled coordinate space.
export function mountArrivalQuest(root,{mask=0,onChange,onComplete,onBack,onSettings,canRewind,mode='arrival'}){
 const doc=root.ownerDocument,events=new AbortController();let done=mask&7;const tasks=mode==='bedtime'?BEDTIME_TASKS:ROOM_TASKS;
 const el=(tag,cls)=>{const node=doc.createElement(tag);node.className=cls;return node;};
 const listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:events.signal});
 root.replaceChildren();
 const stage=el('div','room-quest-stage');stage.setAttribute('aria-label',t('Комната: нажми на отмеченные места'));
 const image=el('img','room-quest-base');image.src=mode==='bedtime'?'./assets/bedtime-quest-empty-v1.webp':'./assets/room-settling-quest-v1.webp';image.alt=t(mode==='bedtime'?'Комната перед сном':'Комната с закрытым чемоданом, столом и розеткой');stage.append(image);
 const header=el('header','room-tools');
 const back=el('button','');setQuestIcon(back,'back',t('← Назад'));back.disabled=!canRewind;listen(back,'click',onBack);
 const settings=el('button','');setQuestIcon(settings,'settings',t('Настройки'));listen(settings,'click',onSettings);header.append(back,settings);
 const heading=el('h2','room-title');heading.id='room-interaction-title';heading.textContent=t(HEADLINES[mode]);
 const status=el('p','room-progress');status.setAttribute('aria-live','polite');
 const announcements=el('p','room-quest-sr');announcements.setAttribute('role','status');
 const buttons=tasks.map(task=>{
  const reveal=el('img',mode==='bedtime'?(task.id==='alarm'?'room-quest-alarm':`room-quest-reveal bedtime-reveal-${task.id}`):`room-quest-reveal room-quest-reveal-${task.id}`);reveal.src=mode==='bedtime'?(task.id==='alarm'?'./assets/bedtime-alarm-v1.webp':'./assets/bedtime-quest-done-v1.webp'):'./assets/room-settling-v1.webp';reveal.alt='';reveal.setAttribute('aria-hidden','true');stage.append(reveal);
  const button=el('button','room-hotspot');button.type='button';button.dataset.task=task.id;button.setAttribute('aria-label',t(task.label));stage.append(button);
  listen(button,'click',()=>{
   if(done&task.bit)return;done=completeRoomTask(done,task.bit);
   announcements.textContent=t(task.done);paint();onChange(done);

  });
  return {button,reveal};
 });
 const next=el('button','room-quest-next primary');next.textContent=t('Дальше');listen(next,'click',()=>{if(done===7)onComplete();});
 const paint=()=>{
  for(const [i,task] of tasks.entries()){const checked=!!(done&task.bit);buttons[i].reveal.hidden=!checked;buttons[i].button.hidden=checked;}
  status.textContent=`${tasks.filter(task=>done&task.bit).length} / 3`;next.hidden=done!==7;
 };
 const fit=()=>{
  const width=root.clientWidth,height=root.clientHeight;if(!width||!height)return;
  const [sourceW,sourceH]=mode==='bedtime'?[941,1672]:[1024,1536];
  const scale=Math.max(width/sourceW,height/sourceH),w=sourceW*scale,h=sourceH*scale,x=(width-w)/2,y=(height-h)/2;
  Object.assign(stage.style,{width:w+'px',height:h+'px',left:x+'px',top:y+'px'});
  tasks.forEach((task,i)=>{
   const cx=(task.rect.x+task.rect.width/2)*w,cy=(task.rect.y+task.rect.height/2)*h;
   // Keep the touch target inside the visible viewport when the image is cropped.
   buttons[i].button.style.left=(Math.max(30,Math.min(width-30,x+cx))-x)+'px';
   buttons[i].button.style.top=(Math.max(30,Math.min(height-30,y+cy))-y)+'px';
  });
 };
 root.append(stage,header,heading,status,announcements,next);paint();fit();
 const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(fit);observer?.observe(root);
 return()=>{events.abort();observer?.disconnect();};
}
