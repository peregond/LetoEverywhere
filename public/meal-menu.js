import {t} from './i18n.js?v=0.17.27';
import {setQuestIcon} from './quest-controls.js?v=0.17.8';

// The picture is a single static illustration; labels and selection are real controls.
export const MEAL_LABELS={cevapi:'Чевапчичи',pljeskavica:'Плескавица',ajvar:'Айвар, хлеб и салат'};
export function mountMealMenu(root,{choices,onChoose,onBack,onSettings,canRewind}){
 const doc=root.ownerDocument,events=new AbortController();let selected=null;
 const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
 const make=(tag,cls)=>{const node=doc.createElement(tag);node.className=cls;return node;};
 root.replaceChildren();root.classList.add('meal-menu');
 const header=make('header','quest-tools meal-menu-header');
 const back=setQuestIcon(make('button','quest-tool'),'back',t('← Назад'));back.type='button';back.disabled=!canRewind;listen(back,'click',onBack);
 const heading=make('h2','quest-title');heading.id='scene-quest-title';heading.tabIndex=-1;heading.textContent=t('Выбери блюдо');
 const settings=setQuestIcon(make('button','quest-tool'),'settings',t('Настройки'));settings.type='button';listen(settings,'click',onSettings);header.append(back,heading,settings);
 const area=make('div','meal-menu-body'),stage=make('div','meal-menu-art');stage.setAttribute('role','group');stage.setAttribute('aria-label',t('Выбери блюдо'));
 const image=make('img','meal-menu-image');image.src='./assets/serbian-dinner-menu-v1.webp';image.alt=t('Три блюда сербской кухни');stage.append(image);
 const order=make('button','primary meal-menu-order');order.type='button';order.textContent=t('Заказать');order.disabled=true;
 const buttons=[];
 for(const [i,key] of ['cevapi','pljeskavica','ajvar'].entries()){
  const choice=choices.find(item=>item.effect?.hostMeal===key);if(!choice)continue;
  const button=make('button','meal-option');button.type='button';button.dataset.meal=key;button.dataset.index=String(i);button.setAttribute('aria-pressed','false');button.textContent=t(MEAL_LABELS[key]);
  listen(button,'click',()=>{selected=choice;for(const item of buttons)item.setAttribute('aria-pressed',String(item===button));order.disabled=false;});
  buttons.push(button);stage.append(button);
 }
 listen(order,'click',()=>{if(selected)onChoose(selected);});area.append(stage);root.append(header,area,order);
 return()=>{events.abort();root.classList.remove('meal-menu');};
}
