import {t,html} from './i18n.js?v=0.17.26';
export function renderDistrictMap(element,node,onChoose,isVisible=()=>true) {
  element.hidden=!node.map;
  if(!node.map){element.replaceChildren();return;}
  element.innerHTML=html(`<svg viewBox="0 0 360 270" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><pattern id="streets" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)"><path d="M0 0H28V28" fill="none" stroke="#d8cdb7" stroke-width="1"/></pattern></defs><rect width="360" height="270" fill="#eee7d6"/><rect width="360" height="270" fill="url(#streets)"/><path d="M2 26C72 20 92 70 160 76S282 35 365 65" fill="none" stroke="#75b9c5" stroke-width="31"/><path d="M45 282C79 224 162 193 153 133S156 98 160 76" fill="none" stroke="#75b9c5" stroke-width="24"/><path d="M168 98L301 94 329 137 286 161 200 140Z" fill="#eac391" opacity=".7"/><path d="M205 168L310 170 337 239 234 245Z" fill="#d6b7a7" opacity=".7"/><path d="M18 109L103 98 121 161 74 213 12 191Z" fill="#a9ccb4" opacity=".75"/><path d="M105 166L173 166M102 177L172 177" stroke="#fff8e5" stroke-width="4"/><text x="262" y="47" fill="#24566a" font-size="13" font-weight="600">Дунав</text><text x="87" y="240" fill="#24566a" font-size="13" font-weight="600">Сава</text><text x="14" y="258" fill="#596d66" font-size="8" letter-spacing="1">СХЕМА РАЙОНОВ · НЕ ДЛЯ НАВИГАЦИИ</text></svg>`);
  const positions={dorcol:{left:'65%',top:'36%',label:'Дорћол'},vracar:{left:'75%',top:'74%',label:'Врачар'},newbelgrade:{left:'24%',top:'56%',label:'Новый Белград'}};
  for(const [district,position] of Object.entries(positions)){
    const choices=node.choices.filter(choice=>choice.effect?.district===district&&isVisible(choice));
    if(!choices.length)continue;
    const pin=document.createElement('button');pin.type='button';pin.className='district-pin';pin.style.left=position.left;pin.style.top=position.top;pin.textContent=t(position.label);pin.setAttribute('aria-label',t('Выбрать район: '+position.label));
    pin.addEventListener('click',()=>{
      if(choices.length===1){onChoose(choices[0]);return;}
      element.querySelector('.district-pin-options')?.remove();
      const menu=document.createElement('div');menu.className='district-pin-options';menu.setAttribute('role','group');menu.setAttribute('aria-label',t(position.label));
      for(const choice of choices){const option=document.createElement('button');option.type='button';option.textContent=t(choice.label);option.addEventListener('click',()=>onChoose(choice));menu.append(option);}
      const close=document.createElement('button');close.type='button';close.textContent=t('Закрыть');close.addEventListener('click',()=>{menu.remove();pin.focus();});menu.append(close);element.append(menu);menu.querySelector('button')?.focus();
    });element.append(pin);
  }
}
