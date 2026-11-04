import {rentalCounterpart} from './rental-people.js?v=0.17.2';
export function dialogueVoice(page) {
 return page.speaker==='narrator'?'thought':page.speaker==='player'?'speech':page.message?'message':'other';
}
export function logVoice(entry) {
 const voice=['thought','speech','message','other'].includes(entry.voice)?{voice:entry.voice}:{};
 if(entry.voice==='message'&&typeof entry.chatContact==='string'&&entry.chatContact.length<=100&&['incoming','outgoing'].includes(entry.chatDirection)){
  voice.chatContact=entry.chatContact;voice.chatDirection=entry.chatDirection;
  if(typeof entry.chatScene==='string'&&entry.chatScene.length<=100)voice.chatScene=entry.chatScene;
  if(typeof entry.chatText==='string'&&entry.chatText.length<=4000)voice.chatText=entry.chatText;
  if(typeof entry.chatTime==='string'&&entry.chatTime.length<=40)voice.chatTime=entry.chatTime;
  if(Number.isInteger(entry.chatIndex)&&entry.chatIndex>=0&&entry.chatIndex<10000)voice.chatIndex=entry.chatIndex;
  if(['page','reply'].includes(entry.chatKind))voice.chatKind=entry.chatKind;
  if(entry.chatPhoto==='arrival-door')voice.chatPhoto=entry.chatPhoto;
 }
 return voice;
}
export function speakerIdentity(page,flags={}){
 const id=page.speaker;
 if(['narrator','player'].includes(id)||id.startsWith('Ты →'))return 'player';
 if(id==='contact')return flags.companion??'milica';
 if(id==='host')return flags.host??'dragan';
 if(id==='districtHost')return flags.districtOwner??'jelena';
 if(id==='contactCounterpart')return flags.companion==='nikola'?'milica':'nikola';
 if(id==='ownerCounterpart')return rentalCounterpart(flags)??(flags.districtOwner==='jelena'?'dragan':'jelena');
 for(const [key,name]of Object.entries({marko:'Марко',vuk:'Вук',stefan:'Стефан',ana:'Ана',milica:'Милица',nikola:'Никола',dragan:'Драган',jelena:'Йелена',asya:'Ася',luka:'Лука'}))if(id===key||id.startsWith(name))return key;
 return 'other';
}
