import {t} from './i18n.js?v=0.17.27';
import {setQuestIcon} from './quest-controls.js?v=0.17.8';
import {DISTRICT_LABEL,FLATS} from './flat-data.js?v=1';
import {imageHotspotRect} from './interaction.js?v=0.16.1';

// Fictional desk puzzle: inspect documents, check the chosen district, then stamp the form.
export function mountWhiteCard(root,{owner,step=0,onChange=()=>{},onComplete,onBack,onSettings,canRewind}){
 const doc=root.ownerDocument,events=new AbortController();let progress=Math.max(0,Math.min(4,Number(step)||0));
 const district=FLATS[owner]?.district??'dorcol';
 const make=(tag,cls,text)=>{const el=doc.createElement(tag);el.className=cls;if(text!==undefined)el.textContent=t(text);return el;};
 const listen=(el,fn)=>el.addEventListener('click',fn,{signal:events.signal});
 const header=make('header','quest-tools white-card-header');
 const back=setQuestIcon(make('button','quest-tool'),'back',t('← Назад'));back.type='button';back.disabled=!canRewind;listen(back,onBack);
 const title=make('h2','quest-title','Белый картон');title.id='scene-quest-title';title.tabIndex=-1;
 const settings=setQuestIcon(make('button','quest-tool'),'settings',t('Настройки'));settings.type='button';listen(settings,onSettings);header.append(back,title,settings);
 const background=make('img','white-card-art');background.src='./assets/white-card-desk-v1.webp';background.alt='';background.setAttribute('aria-hidden','true');
 const panel=make('section','white-card-panel');panel.setAttribute('aria-live','polite');
 const hotspot=make('button','white-card-hotspot');hotspot.type='button';listen(hotspot,()=>{if([0,1,3].includes(progress))advance();});
 root.replaceChildren(background,header,hotspot,panel);root.classList.toggle('white-card-game',true);
 function place(){const spot=({0:[.17,.47],1:[.20,.77],3:[.85,.45]})[progress];if(!spot){hotspot.hidden=true;return;}hotspot.hidden=false;const point=imageHotspotRect(root.clientWidth,root.clientHeight,941,1672,{x:spot[0],y:spot[1],width:0,height:0});hotspot.style.left=Math.max(27,Math.min(root.clientWidth-27,point.left))+'px';hotspot.style.top=Math.max(100,Math.min(root.clientHeight-180,point.top))+'px';hotspot.setAttribute('aria-label',t(({0:'Паспорт',1:'Договор аренды',3:'ПОСТАВИТЬ ШТАМП'})[progress]));}
 const observer=new ResizeObserver(place);observer.observe(root);background.addEventListener('load',place,{signal:events.signal});
 function button(label,cls,handler){const el=make('button',cls,label);el.type='button';listen(el,handler);return el;}
 function advance(){progress++;onChange(progress);paint();}
 function paint(){
  const eyebrow=make('p','white-card-eyebrow','ОКНО РЕГИСТРАЦИИ · БЕЛГРАД');
  const counter=make('p','white-card-count',`${Math.min(progress,4)} / 4`);
  const text=make('p','white-card-instruction');const controls=make('div','white-card-actions');
  if(progress===0){text.textContent=t('Сотрудник просит паспорт. Найди его среди документов.');controls.append(button('Паспорт','white-card-document passport',advance));}
  else if(progress===1){text.textContent=t('Теперь нужен договор на новую квартиру.');controls.append(button('Договор аренды','white-card-document lease',advance));}
  else if(progress===2){text.textContent=t('Сверь район в договоре и выбери его в бланке.');const reference=make('p','white-card-reference');reference.textContent=t('В договоре указан район')+': '+t(DISTRICT_LABEL[district][0]);controls.append(reference);for(const [key,pair] of Object.entries(DISTRICT_LABEL))controls.append(button(pair[0],'white-card-choice',()=>{if(key===district)advance();else text.textContent=t('Не совпадает с договором. Проверь район ещё раз.');}));}
  else if(progress===3){text.textContent=t('Всё совпало. Нажми на штамп, чтобы завершить оформление.');controls.append(button('ПОСТАВИТЬ ШТАМП','white-card-stamp',advance));}
  else{text.textContent=t('Готово! Подтверждение регистрации можно забрать и положить в папку.');controls.append(button('Забрать белый картон','white-card-finish',onComplete));}
  panel.replaceChildren(eyebrow,counter,text,controls);
  place();
 }
 paint();return()=>{events.abort();observer.disconnect();root.classList.toggle('white-card-game',false);};
}
