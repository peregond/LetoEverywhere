import {t} from './i18n.js?v=0.17.23';
const PEOPLE = {
  marko:{id:'marko',name:'Марко',gender:'male'},vuk:{id:'vuk',name:'Вук',gender:'male'},stefan:{id:'stefan',name:'Стефан',gender:'male'},ana:{id:'ana',name:'Ана',gender:'female'},
  luka: { id:'luka', name:'Лука', gender:'male' },
  milica: { id:'milica', name:'Милица', gender:'female' },
  jelena: { id:'jelena', name:'Йелена', gender:'female' },
  asya: { id:'asya', name:'Ася', gender:'female' },
  nikola: { id:'nikola', name:'Никола', gender:'male' },
  dragan: { id:'dragan', name:'Драган', gender:'male' }
};
const LABELS = {
  explore:'Исследовать', romance:'Флирт', friendship:'Дружба',
  dream:'Воображение', practical:'По делу', personal:'О себе'
};
// SVG paths use currentColor so recipients can share the same compact icon system.
const ICONS = {
  explore: [['path',{d:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 5.4-2.3 6.9-6.9 2.3 2.3-6.9 6.9-2.3Zm-5.5 3.7-.6 2 2-.6.6-2-2 .6Z','fill-rule':'evenodd'}]],
  romance: [['path',{d:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z'}]],
  friendship: [['circle',{cx:'8',cy:'7',r:'3.5'}],['circle',{cx:'17.5',cy:'8',r:'3'}],['path',{d:'M1.5 20a6.5 6.5 0 0 1 13 0v1h-13v-1Zm14.1 1v-1a8 8 0 0 0-1.3-4.4A5.5 5.5 0 0 1 23 20v1h-7.4Z'}]],
  practical: [['path',{d:'M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm6 1.8V8h4.2L13 3.8ZM8 11v1.6h8V11H8Zm0 3.5v1.6h8v-1.6H8Zm0 3.5v1.6h5V18H8Z','fill-rule':'evenodd'}]],
  dream: [
    ['path',{d:'m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z'}],
    ['path',{d:'M19 1.5 20 4l2.5 1L20 6l-1 2.5L18 6l-2.5-1L18 4l1-2.5Z'}]
  ],
  personal: [['path',{d:'M12 2a9 9 0 0 0-7.7 13.7L3 21l5.4-1.4A9 9 0 1 0 12 2Zm-4 8h8v1.7H8V10Zm0 3.5h5.5v1.7H8v-1.7Z','fill-rule':'evenodd'}]]
};

function person(value) {
  return PEOPLE[value==='nikola-evening'?'nikola':value]??null;
}

function recipientFor(choice,node,flags) {
  if(choice.next==='road_contact')return person(flags.companion??'milica');
  // A destination selected by this answer takes priority over the current scene.
  for(const key of ['companion','host','districtOwner','rainWith','chapterFiveWith','eveningWith','adaWith']){
    const selected=person(choice.effect?.[key]==='companion'?flags.companion:choice.effect?.[key]==='host'?flags.districtOwner:choice.effect?.[key]);
    if(selected)return selected;
  }
  const character=person(node.character);
  if(character)return character;
  if(node.districtPortrait)return person(flags.districtOwner);
  if(node.hostPortrait)return person(flags.host);
  if(node.companionPortrait)return person(flags.companion);
  if(node.portrait)return person(typeof node.portrait==='string'?node.portrait:'milica');
  return null;
}

export function choicePresentation(choice,{text=value=>value,tones={},node={},flags={}}={}) {
  const recipient=recipientFor(choice,node,flags);
  const tone=choice.next==='road_contact'?(flags[(recipient?.id??'milica')+'Bond']==='romance'?'romance':'friendship'):Object.hasOwn(ICONS,choice.tone)?choice.tone:'personal';
  const category=tones[tone]?.label??LABELS[tone];
  const label=choice.next==='road_contact'?text(recipient?.id==='nikola'?'Написать Николе':'Написать Милице'):text(choice.label);
  return {
    tone, category, label, recipient:recipient?.id??null,
    recipientName:recipient?.name??null, gender:recipient?.gender??'neutral',
    accessibleLabel:category+(recipient?' · '+recipient.name:'')+': '+label
  };
}

export function appendChoiceContents(button,choice,options={}) {
  const presentation=choicePresentation(choice,options);
  const doc=button.ownerDocument;
  const icon=doc.createElementNS('http://www.w3.org/2000/svg','svg');
  icon.setAttribute('class','choice-icon');
  for(const [key,value]of Object.entries({viewBox:'0 0 24 24',fill:'currentColor','aria-hidden':'true',focusable:'false'}))icon.setAttribute(key,value);
  for(const [tag,attributes]of ICONS[presentation.tone]){
    const shape=doc.createElementNS('http://www.w3.org/2000/svg',tag);
    for(const [key,value]of Object.entries(attributes))shape.setAttribute(key,value);
    icon.append(shape);
  }
  const label=doc.createElement('span');label.className='choice-label';label.textContent=t(presentation.label);
  button.dataset.tone=presentation.tone;
  button.dataset.recipientGender=presentation.gender;
  button.setAttribute('aria-label',t(presentation.accessibleLabel));
  button.setAttribute('title',t(presentation.accessibleLabel));
  button.replaceChildren(icon,label);
  return presentation;
}
