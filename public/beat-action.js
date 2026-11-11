import {t} from './i18n.js?v=0.17.26';
import {appendChoiceContents} from './choice-ui.js?v=0.17.26';
export function drawBeatAction(container,hotspots,action,{text,perform,tones,node,flags}){
  container.replaceChildren();hotspots.replaceChildren();container.hidden=!action||action.kind==='tap';hotspots.hidden=true;
  if(!action||action.kind==='tap')return;
  if(action.kind==='reply'){
    for(const option of action.options){const button=document.createElement('button');button.type='button';button.className='choice';appendChoiceContents(button,option,{text,tones,node,flags});button.addEventListener('click',()=>perform(option));container.append(button);}return;
  }
  if(action.kind==='checklist'){
    const caption=document.createElement('p');caption.className='beat-caption';caption.textContent=t(text(action.label));container.append(caption);
    const list=document.createElement('div');list.className='beat-checklist';const checked=new Set();
    const done=document.createElement('button');done.type='button';done.className='primary beat-complete';done.textContent=t('Готово');done.disabled=true;
    // each item is a pill with a round check mark (drawn in CSS); the label keeps its translation key, which starts with a glyph
    const paint=(button,item,on)=>{const label=t((on?'✓ ':'○ ')+item).slice(2);button.replaceChildren(Object.assign(document.createElement('span'),{className:'check'}),document.createTextNode(label));button.setAttribute('aria-pressed',String(on));};
    for(const item of action.items){const button=document.createElement('button');button.type='button';paint(button,item,false);button.addEventListener('click',()=>{if(checked.has(item))checked.delete(item);else checked.add(item);paint(button,item,checked.has(item));done.disabled=checked.size!==action.items.length;});list.append(button);}
    done.addEventListener('click',()=>{if(checked.size===action.items.length)perform();});container.append(list,done);return;
  }
}
