import {setQuestIcon} from './quest-controls.js?v=0.17.8';
// The phone page the hero reads before choosing a bank. Reading progress is a small bit mask owned by the caller.
import {t} from './i18n.js?v=0.17.23';
import {GUIDE,BANKS,BANK_KEYS} from './bank-data.js?v=1';

const make=(doc,tag,className,text)=>{const node=doc.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
const label=name=>/[А-Яа-яЁё]/.test(name)?t(name):name;
export const readCount=mask=>[0,1,2].filter(bit=>mask&(1<<bit)).length;

export function mountBankGuide(root,{mask=0,choices,canRewind,onBack,onSettings,onRead,onChoose}){
  const doc=root.ownerDocument;
  const events=new AbortController();const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
  let read=mask&15,active=null,choosing=false;
  root.replaceChildren();
  const bar=make(doc,'header','guide-bar');
  const back=setQuestIcon(make(doc,'button','guide-tool'),'back',t('← Назад'));back.type='button';back.disabled=!canRewind;listen(back,'click',onBack);
  const badge=make(doc,'p','guide-badge',t(GUIDE.badge));
  const settings=setQuestIcon(make(doc,'button','guide-tool'),'settings',t('Настройки'));settings.type='button';listen(settings,'click',onSettings);
  bar.append(back,badge,settings);
  const page=make(doc,'main','guide-page');
  const title=make(doc,'h2','guide-title',t(GUIDE.title));title.id='scene-quest-title';title.tabIndex=-1;
  const intro=make(doc,'p','guide-intro',t(GUIDE.intro));
  const helper=make(doc,'div','guide-helper');
  const mascot=make(doc,'img','guide-mascot');mascot.src='./assets/vucko-bank-guide-v1.webp';mascot.alt='';
  const speech=make(doc,'div','guide-speech');speech.append(make(doc,'strong','',t(GUIDE.helperName)));
  const helperText=make(doc,'p','',t(GUIDE.helperHello));speech.append(helperText);helper.append(mascot,speech);
  const tabs=make(doc,'div','guide-tabs');tabs.setAttribute('role','tablist');
  const detail=make(doc,'section','guide-detail');detail.setAttribute('aria-live','polite');
  const note=make(doc,'p','guide-note',t(GUIDE.note));
  page.append(title,helper,tabs,detail,intro,note);
  const footer=make(doc,'footer','guide-footer');
  const choose=make(doc,'button','primary guide-choose');choose.type='button';
  const options=make(doc,'div','guide-options');options.hidden=true;options.setAttribute('role','group');options.setAttribute('aria-label',t(GUIDE.choose));
  for(const choice of choices){
    const button=make(doc,'button','guide-option',label(choice.label));button.type='button';
    listen(button,'click',()=>onChoose(choice));options.append(button);
  }
  const closeOptions=make(doc,'button','text-button guide-close',t(GUIDE.back));closeOptions.type='button';listen(closeOptions,'click',()=>{choosing=false;paint();});options.append(closeOptions);
  footer.append(options,choose);
  root.append(bar,page,footer);
  const tabButtons=BANK_KEYS.map((key,index)=>{
    const button=make(doc,'button','guide-tab');button.type='button';button.setAttribute('role','tab');
    listen(button,'click',()=>{active=key;if(index<3&&!(read&(1<<index))){read|=1<<index;onRead(read);}paint();detail.scrollIntoView?.({block:'nearest',behavior:'smooth'});});
    tabs.append(button);return button;
  });
  listen(choose,'click',()=>{if(readCount(read)<2)return;choosing=true;paint();});
  const paint=()=>{
    tabButtons.forEach((button,index)=>{
      const key=BANK_KEYS[index];const done=index<3&&(read&(1<<index));
      button.textContent=(done?'✓ ':'')+label(BANKS[key].name);button.setAttribute('aria-selected',String(active===key));
    });
    detail.replaceChildren();
    helperText.textContent=t(active?GUIDE.helperSelected:GUIDE.helperHello);
    if(active){
      const bank=BANKS[active];
      detail.append(make(doc,'h3','',label(bank.name)),make(doc,'p','guide-tag',t(bank.tag)));
      for(const section of ['docs','ask']){
        const block=make(doc,'div','guide-block');block.append(make(doc,'h4','',t(GUIDE.sections[section])),make(doc,'p','',t(bank[section])));detail.append(block);
      }
      const more=make(doc,'details','guide-more');more.append(make(doc,'summary','',t(GUIDE.more)));
      for(const section of ['visit','checks']){const block=make(doc,'div','guide-block');block.append(make(doc,'h4','',t(GUIDE.sections[section])),make(doc,'p','',t(bank[section])));more.append(block);}detail.append(more);
    }else detail.append(make(doc,'p','guide-hint',t(GUIDE.hint)));
    const ready=readCount(read)>=2;
    choose.disabled=!ready;choose.textContent=t(ready?GUIDE.choose:GUIDE.chooseLocked);
    options.hidden=!choosing;choose.hidden=choosing;
  };
  paint();
  return()=>{events.abort();};
}
