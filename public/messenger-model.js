import {choiceVisible} from './romance.js?v=0.17.2';
import {RENTAL_NAMES,rentalCounterpart} from './rental-people.js?v=0.17.2';
import {familySpeaker} from './family-contact.js?v=1';
import { CHAT_SCENES, MESSENGER_CONFIG, INLINE_CHAT_REPLIES } from './messenger-config.js?v=0.17.15';

const names = { ...RENTAL_NAMES, milica: 'Милица', nikola: 'Никола', dragan: 'Драган', jelena: 'Йелена', asya: 'Ася', luka: 'Лука', lazar: 'Лазар', teodora: 'Теодора', ivana: 'Ивана', strahinja: 'Страхиня' };
// Preserve the old page index for saved games while opening Dragan's message directly.
export function visibleMessagePage(sceneId,index){return sceneId==='nikola_phone'&&index===0?1:sceneId==='nikola_phone'&&index===2?3:index;}
export function contactName(value, flags = {}) {
  const dynamic = {
    contact: flags.companion ?? 'milica', contactCounterpart: flags.companion === 'nikola' ? 'milica' : 'nikola',
    host: flags.host ?? 'dragan', districtHost: flags.districtOwner ?? 'jelena',
    ownerCounterpart: rentalCounterpart(flags) ?? (flags.districtOwner === 'jelena' ? 'dragan' : 'jelena'),
    bankStaff: flags.bankSpark === 'teodora' ? 'teodora' : 'lazar',
    mupStaff: flags.mupSpark === 'strahinya' ? 'strahinja' : 'ivana'
  };
  const key = dynamic[value] ?? value;
  return names[key] ?? familySpeaker(String(key).replace(/^Ты\s*→\s*/u, '').split(' · ')[0]);
}
export function messageAt(sceneId, node, index, flags = {}) {
  const page = node.pages[index];
  if (!page) return null;
  const scene = CHAT_SCENES[sceneId] ?? {};
  const config = { ...scene.pages?.[index], ...page.chat };
  if (page.chat === false || (!page.message && !page.chat && !scene.pages?.[index])) return null;
  const direction = config.direction ?? (page.speaker === 'player' || /^Ты\s*→/u.test(page.speaker) ? 'outgoing' : 'incoming');
  const previous = node.pages.slice(0, index).findLast(p => p.message && p.speaker !== 'player' && !/^Ты\s*→/u.test(p.speaker));
  const person = config.contact ?? scene.contact ?? node.chat?.contact ?? (direction === 'incoming' ? page.speaker : /^Ты\s*→/u.test(page.speaker) ? page.speaker : previous?.speaker ?? 'Близкий человек');
  return { direction, contact: contactName(person, flags), quotedBody: !!config.quotedBody, time: config.time ?? page.time ?? node.time ?? '', quote: config.quote, attachment: config.attachment };
}
export function stripMessageQuotes(value) {
  const text = value.trim();
  for (const [open, close] of [['«', '»'], ['‘', '’'], ['“', '”'], ['"', '"']]) {
    if (text.startsWith(open)) {
      const end = text.lastIndexOf(close);
      if (end > 0 && /^[.\s]*$/u.test(text.slice(end + 1))) return text.slice(1, end);
    }
  }
  return text;
}
function messageBody(page, meta, text) {
  const full = text(page);
  if (meta.quotedBody) {
    const pairs = { '«': '»', '‘': '’', '“': '”', '"': '"' };
    const start = full.trim(); const end = start.lastIndexOf(pairs[start[0]]);
    if (end > 0) return { text: start.slice(1, end), context: start.slice(end + 1).replace(/^[.\s]+/u, '') };
  }
  return { text: stripMessageQuotes(full), context: '' };
}
export function messengerFrame({ sceneId, node, index, flags = {}, journal = [], log = [], historyText = value=>value, action, text, choiceText, profile = {} }) {
  let current = messageAt(sceneId, node, index, flags);
  // A phone reply may follow a narrated thought on the same legacy page.
  if (!current && action?.kind === 'reply') {
    for (let i = index - 1; i >= 0 && !current; i--) current = messageAt(sceneId, node, i, flags);
  }
  if (!current) return null;
  const actual = messageAt(sceneId, node, index, flags);
  // The current scene is rendered from its authored pages; older scenes come from
  // the saved, rewindable log, which contains only events the player has reached.
  let currentStart=log.length;
  for(let i=log.length-1;i>=0;i--){const entry=log[i];if(entry.chatScene&&entry.chatScene!==sceneId)break;if(entry.chatScene===sceneId)currentStart=i;}
  const messages = log.slice(0,currentStart).flatMap(entry=>{
    if(entry.voice!=='message')return [];
    const contact=entry.chatContact??(entry.speaker===current.contact?current.contact:null);
    if(contact!==current.contact)return [];
    const direction=entry.chatDirection??'incoming';
    return [{direction,time:entry.chatTime??'',text:stripMessageQuotes(historyText(entry.chatText??entry.text)),...(entry.chatPhoto==='arrival-door'?{photo:{src:'./assets/courtyard-door.webp',alt:'Фотография подъезда от Драгана'}}:{})}];
  });
  for (let i = 0; i <= index; i++) {
    const meta = messageAt(sceneId, node, i, flags);
    if(meta && meta.contact === current.contact && !(i === index && meta.direction === 'outgoing'))
      messages.push({ direction: meta.direction, time: meta.time, quote: meta.quote, attachment: meta.attachment, isNew:i===index&&meta.direction==='incoming', ...messageBody(node.pages[i], meta, text) });
    if(i<index){
      const legacy=INLINE_CHAT_REPLIES[sceneId]?.[i]?.label ?? (sceneId==='nikola_phone'&&i===2?'Думаю, буду примерно через час. Напишу по дороге.':null);
      for(const entry of log.slice(currentStart)){
        const saved=entry.chatText??entry.text;
        const isReply=entry.chatKind==='reply'&&entry.chatIndex===i || !entry.chatKind&&legacy&&saved===legacy;
        if(entry.chatScene===sceneId&&entry.chatContact===current.contact&&entry.chatDirection==='outgoing'&&isReply)
          messages.push({direction:'outgoing',time:entry.chatTime??'',text:stripMessageQuotes(historyText(saved))});
      }
    }
  }
  const nikolaPhoto=sceneId==='nikola_last'&&flags.nikolaBond==='romance'?{src:'./assets/nikola-bakery-photo-v1.webp',alt:'Фото витрины с круассанами и отражением Николы'}:null;
  // Later pages retain the already received photo as chat history, without sending it again.
  if(nikolaPhoto&&index>1)messages.push({direction:'incoming',text:'',photo:nikolaPhoto,time:node.time??''});
  const meetingChoice = sceneId==='courtyard_arrival'&&index===2;
  const workChoice = sceneId==='work_crossroads'&&index===1;
  const rawChoices = meetingChoice||workChoice ? node.choices : action?.kind === 'reply' ? action.options : (!action || action.kind === 'tap') && index === node.pages.length - 1 ? node.choices : null;
  const choices=rawChoices?.filter(choice=>choiceVisible(choice,flags,profile));
  const inline = !choices?.length && actual?.direction === 'incoming' ? INLINE_CHAT_REPLIES[sceneId]?.[index] : null;
  const draft = actual?.direction === 'outgoing' ? messageBody(node.pages[index], actual, text) : null;
  return {
    contact: current.contact,
    delayedPhoto:index===1?nikolaPhoto:null,
    typingLabel:text({speaker:'narrator',text:'Печатает…'}),
    hideAvatar: current.contact==='Драган'&&!journal.includes('dragan'),
    time: actual?.time ?? node.time ?? '',
    draftQuote: actual?.quote,
    draftAttachment: actual?.attachment,
    messages,
    draft: draft?.text ?? null,
    context: draft?.context || (!actual ? text(node.pages[index]) : ''),
    replies: (inline?[inline]:choices)?.map(option => ({ option, text: stripMessageQuotes(choiceText(meetingChoice?(option.next==='meet_dragan'?'Подожду вас во дворе. До встречи!':'Тогда попрошу Йелену встретить меня сейчас. Спасибо!'):option.chatText ?? option.label)), tone: option.tone })) ?? [],
    replyKind: inline ? 'inline' : action?.kind === 'reply' ? 'action' : 'choice',
    physicalAction: !!action && action.kind !== 'tap' && action.kind !== 'reply',
    continueLabel: choiceText(action?.label ?? 'К истории')
  };
}
