import {t} from './i18n.js?v=0.17.23';
// A presentation step before the narration; the saved story page stays unchanged.
export const ARRIVAL_PHONE_TEXT='Вот наш подъезд. Комната забронирована для вас. Напишите, когда будете рядом — встречу с ключами.';
export const ARRIVAL_PHONE_PHOTO={src:'./assets/courtyard-door.webp',alt:'Фотография подъезда от Драгана'};
export function arrivalPhoneFrame(){return {
 contact:'Драган',hideAvatar:true,time:'',messages:[{direction:'incoming',text:ARRIVAL_PHONE_TEXT,photo:ARRIVAL_PHONE_PHOTO,isNew:true}],
 draft:null,replies:[],physicalAction:false,delayedPhoto:null
};}
// A visual insert only: the original narration, baggage action and save index stay in place.
export function renderArrivalPhone(scene,nodeId,index){
 let card=scene.querySelector('.arrival-phone');
 if(nodeId!=='quick_arrival'||index!==2){card?.remove();return;}
 card?.remove();
 const doc=scene.ownerDocument;
 const el=(tag,className,text)=>{const n=doc.createElement(tag);n.className=className;if(text)n.textContent=t(text);return n;};
 card=el('article','arrival-phone');card.setAttribute('aria-label',t('Сохранённая переписка с Драганом'));
 const header=el('header','arrival-phone-header');
 const avatar=el('span','arrival-phone-avatar',t('Драган')[0]);avatar.setAttribute('aria-hidden','true');
 const identity=el('div','arrival-phone-person');identity.append(el('strong','','Драган'),el('small','','Хозяин жилья'));header.append(avatar,identity);
 const message=el('div','arrival-phone-message');
 const photo=el('img','arrival-phone-photo');photo.src='./assets/courtyard-door.webp';photo.alt=t('Фотография подъезда от Драгана');
 message.append(photo,el('p','','Вот наш подъезд. Комната забронирована для вас. Напишите, когда будете рядом — встречу с ключами.'));
 card.append(header,message);scene.append(card);
}
