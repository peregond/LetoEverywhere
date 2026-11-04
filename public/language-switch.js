// Language switch for the home screen: a sliding two-flag toggle while there are two languages, a dropdown once there are more.
// Buttons keep `data-language` (the app listens to those) and `aria-pressed` (the active one), so both modes work with the same handlers.
export const LANGUAGES=[
 {code:'ru',label:'Русский',flag:'ru'},
 {code:'en',label:'English',flag:'gb'}
];
const FLAGS={
 ru:'<clipPath id="f-ru"><circle cx="12" cy="12" r="11"/></clipPath><g clip-path="url(#f-ru)"><rect width="24" height="8" y="1" fill="#fff"/><rect width="24" height="8" y="8.4" fill="#1c57a5"/><rect width="24" height="8" y="16" fill="#d52b1e"/></g>',
 gb:'<clipPath id="f-gb"><circle cx="12" cy="12" r="11"/></clipPath><g clip-path="url(#f-gb)"><rect width="24" height="24" fill="#1f3f8f"/><path d="M0 0l24 24M24 0L0 24" stroke="#fff" stroke-width="4.6"/><path d="M0 0l24 24M24 0L0 24" stroke="#c8102e" stroke-width="1.8"/><path d="M12 0v24M0 12h24" stroke="#fff" stroke-width="7"/><path d="M12 0v24M0 12h24" stroke="#c8102e" stroke-width="4"/></g>'
};
export const flagMarkup=(flag,size=24)=>`<svg class="flag" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false">${FLAGS[flag]??'<circle cx="12" cy="12" r="11" fill="#9aa8ad"/>'}<circle cx="12" cy="12" r="11" fill="none" stroke="#0003"/></svg>`;
function languageButton(language){
 const button=document.createElement('button');button.type='button';button.dataset.language=language.code;button.lang=language.code;
 button.setAttribute('aria-label',language.label);button.setAttribute('aria-pressed','false');button.title=language.label;
 return button;
}
// Marks the active language everywhere in the switch and tells the CSS which slot the thumb slides to.
export function markActiveLanguage(root,code){
 const switcher=root.querySelector?.('.language-switch');if(!switcher)return;
 const buttons=[...switcher.querySelectorAll('[data-language]')];
 buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===code)));
 const index=buttons.findIndex(button=>button.dataset.language===code);
 switcher.style.setProperty('--active',String(Math.max(0,index)));
 const trigger=switcher.querySelector('.language-trigger');
 const active=LANGUAGES.find(language=>language.code===code);
 if(trigger&&active){trigger.innerHTML=flagMarkup(active.flag,22)+`<span>${active.code.toUpperCase()}</span><svg class="chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;trigger.setAttribute('aria-label',active.label);}
}
export function mountLanguageSwitch(container,languages=LANGUAGES,current='ru'){
 container.replaceChildren();container.classList.add('language-switch');
 container.setAttribute('role','group');container.setAttribute('aria-label','Язык игры');
 container.dataset.count=String(languages.length);container.dataset.mode=languages.length<=2?'slider':'menu';
 if(languages.length<=2){
  container.append(Object.assign(document.createElement('span'),{className:'language-thumb'}));
  for(const language of languages){const button=languageButton(language);button.innerHTML=flagMarkup(language.flag);container.append(button);}
 }else{
  const trigger=document.createElement('button');trigger.type='button';trigger.className='language-trigger';
  trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
  const menu=document.createElement('div');menu.className='language-menu';menu.setAttribute('role','listbox');menu.hidden=true;
  const close=()=>{menu.hidden=true;trigger.setAttribute('aria-expanded','false');};
  trigger.addEventListener('click',()=>{menu.hidden=!menu.hidden;trigger.setAttribute('aria-expanded',String(!menu.hidden));});
  for(const language of languages){
   const button=languageButton(language);button.setAttribute('role','option');
   button.innerHTML=flagMarkup(language.flag,22)+`<span>${language.label}</span>`;
   button.addEventListener('click',close);menu.append(button);
  }
  document.addEventListener('click',event=>{if(!container.contains(event.target))close();});
  container.addEventListener('keydown',event=>{if(event.key==='Escape'){close();trigger.focus();}});
  container.append(trigger,menu);
 }
 markActiveLanguage(container.parentElement??container,current);
 return container;
}
