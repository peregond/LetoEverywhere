import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,JOURNAL,CHARACTER_SPRITES,pageText,presentationFor,beatActionAt} from '../public/story.js';
import {choiceVisible,callsByShortName} from '../public/romance.js';
import {rentalRedirect} from '../public/rental-story.js';
import {BANKS,BANK_KEYS,GUIDE} from '../public/bank-data.js';
import {mountBankGuide,readCount} from '../public/bank-guide.js';
import {messageAt,messengerFrame} from '../public/messenger-model.js';
import {interpolate} from '../public/story.js';
import {makeDocument,withClass,installBrowserStubs} from './fake-dom.mjs';
installBrowserStubs();
const catalog=JSON.parse(fs.readFileSync(new URL('../public/names.json',import.meta.url)));
const dictionary=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url)));
const helpReply=beatActionAt(NODES.flat_arrive,3);
assert.equal(helpReply.kind,'reply');
assert.deepEqual(helpReply.options.map(option=>option.effect.bankHelp),['guide','helper']);
assert.equal(rentalRedirect('flat_registration','bank_path',{rentalCast:'new',bankHelp:'guide'}),'bank_plan');
assert.equal(rentalRedirect('flat_registration','bank_path',{rentalCast:'new',bankHelp:'helper'}),'bank_helper');
assert.equal(presentationFor(NODES.bank_helper,NODES.bank_helper.pages[1],{}).character,'guest-bank-helper');
assert.equal(NODES.bank_helper.choices.filter(choice=>choice.effect?.bankChoice).length,3);
assert.equal(NODES.bank_evening_pause.pages[0].text,NODES.afternoon_invite.pages[1].text,'The existing thought appears before the evening message');

// ---- Bank chapter ----
const plan=NODES.bank_plan;
assert.equal(plan.pages.length,3,'older save positions stay valid');
const planAction=beatActionAt(plan,2);assert.equal(planAction.quest,'bank-guide');
const visible=plan.choices.filter(choice=>choiceVisible(choice,{}));
assert.deepEqual(visible.map(choice=>choice.effect.bankChoice),['api','alta','adriatic']);
assert.ok(visible.every(choice=>choice.next==='bank_call'));
assert.equal(plan.choices.length,5,'the two earlier choices stay in the data for older saves');
assert.ok(plan.choices.slice(0,2).every(choice=>!choiceVisible(choice,{})));
// The strange phone call is now a visit plan: same three pages and checklist, no caller portrait.
assert.equal(NODES.bank_call.pages.length,3);assert.equal(NODES.bank_call.exitAction.kind,'checklist');
assert.ok(!/Здравствуйте\. Я недавно/.test(JSON.stringify(NODES.bank_call.pages)));
assert.ok(/лично/.test(NODES.bank_call.pages[0].text));
for(const [index]of NODES.bank_call.pages.entries())assert.equal(presentationFor(NODES.bank_call,NODES.bank_call.pages[index],{}).contactPortrait,null);
// Day 2: the chosen branch, with its own staff; older saves without a choice keep the generic visit.
assert.equal(NODES.third_morning.next,'bank_visit');
for(const bank of ['api','alta','adriatic'])assert.equal(rentalRedirect('third_morning','bank_visit',{bankChoice:bank}),'bank_visit_'+bank);
assert.equal(rentalRedirect('third_morning','bank_visit',{}),'bank_visit');
assert.equal(rentalRedirect('bank_plan','bank_visit',{bankChoice:'api'}),'bank_visit');
const staffOf=id=>new Set(NODES[id].pages.map(page=>page.speaker).filter(name=>!['narrator','player','contact'].includes(name)));
const branches={api:['bank_visit_api'],alta:['bank_visit_alta'],adriatic:['bank_visit_adriatic']};
function reachFrom(start){const seen=new Set(),stack=[start];while(stack.length){const id=stack.pop();if(seen.has(id)||id==='bank_followup'||id==='route5_bank_done')continue;seen.add(id);const node=NODES[id];stack.push(...(node.choices?node.choices.map(c=>c.next):[node.next]));}return seen;}
const names=new Set();
for(const [bank,[start]]of Object.entries(branches)){
  const nodes=reachFrom(start);
  assert.ok(nodes.size>=3,bank);
  for(const id of nodes)assert.equal(NODES[id].chapterId,bank==='api'?'papers':'work',id);
  for(const id of nodes){const node=NODES[id];assert.ok(!(node.choices?node.choices.map(c=>c.next):[node.next]).includes('end'));}
  const staff=[...nodes].flatMap(id=>[...staffOf(id)]);assert.equal(new Set(staff).size,1,bank+': one employee per branch');names.add(staff[0]);
  const text=[...nodes].flatMap(id=>NODES[id].pages.map(page=>JSON.stringify(page))).join(' ');
  assert.ok(!/счёт (открыт|одобрен)|карт[ауы] выдан|открыли счёт/i.test(text.replace(/Это ещё не|ещё не «счёт открыт»|«счёт открыт» yet/g,'')),bank+': no automatic account');
  assert.ok(!/(Лазар|Теодора|Ивана|Страхиня|Милош)/.test(text),'romance partners are not the day-2 branch staff');
  assert.ok(reach(start).has(bank==='api'?'route5_bank_done':'bank_followup'),bank+': every branch leads on');
}
function reach(start){const seen=new Set(),stack=[start];while(stack.length){const id=stack.pop();if(seen.has(id)||!NODES[id])continue;seen.add(id);const node=NODES[id];stack.push(...(node.choices?node.choices.map(c=>c.next):[node.next]));}return seen;}
assert.equal(names.size,3,'different staff at different branches');
assert.ok(NODES.bank_visit_alta.choices.length===2&&NODES.bank_visit_adriatic.choices.length===2,'different situations: waiting, booking, a second visit');
// Nobody in these scenes is a romance option, and no choice there carries a romance tone.
for(const bank of Object.keys(branches))for(const id of reachFrom(branches[bank][0]))for(const choice of NODES[id].choices??[])assert.notEqual(choice.tone,'romance');
// The waiting scene is a message in the messenger, with the answer visible at once.
const wait=NODES.bank_alta_wait;
assert.ok(wait.pages[1].message);
const frame=messengerFrame({sceneId:'bank_alta_wait',node:wait,index:1,flags:{companion:'nikola',host:'dragan'},action:beatActionAt(wait,1),text:p=>pageText(p,{companion:'nikola'}),choiceText:value=>value});
assert.equal(frame.contact,'Никола');assert.equal(frame.replies.length,1);assert.equal(frame.replyKind,'inline');
// The guide page: three banks plus others, no promise, personal visit, extra checks, different requirements.
for(const key of BANK_KEYS){const bank=BANKS[key];for(const field of ['visit','docs','checks','ask','tag'])assert.ok(bank[field],key+'/'+field);}
assert.ok(BANK_KEYS.slice(0,3).every(key=>BANKS[key].visit!==BANKS.api.visit||key==='api'),'the requirements differ between banks');
assert.match(GUIDE.note,/Ни один банк не обязан открыть счёт/);
assert.match(BANKS.adriatic.checks,/повторный визит/);assert.match(BANKS.api.checks,/сам решает/i);
assert.ok(JOURNAL.bank_guide.link.includes('srb.guide'));
{
  const doc=makeDocument(),root=doc.createElement('section');const reads=[];let chosen=null;
  mountBankGuide(root,{mask:0,choices:visible,canRewind:true,onBack(){},onSettings(){},onRead:mask=>reads.push(mask),onChoose:choice=>{chosen=choice;}});
  const choose=withClass(root,'guide-choose')[0],tabs=withClass(root,'guide-tab');
  assert.equal(tabs.length,4);assert.equal(choose.disabled,true,'comparing comes first');
  tabs[0].click();assert.equal(choose.disabled,true);tabs[3].click();assert.equal(choose.disabled,true,'"other banks" is information, it does not count as a comparison');
  tabs[1].click();assert.equal(choose.disabled,false);assert.deepEqual(reads,[1,3]);
  choose.click();const options=withClass(root,'guide-option');assert.equal(options.length,3);
  options[2].click();assert.equal(chosen.effect.bankChoice,'adriatic');
  assert.equal(readCount(0b0111),3);
  const reloaded=makeDocument().createElement('section');
  mountBankGuide(reloaded,{mask:3,choices:visible,canRewind:false,onBack(){},onSettings(){},onRead(){},onChoose(){}});
  assert.equal(withClass(reloaded,'guide-choose')[0].disabled,false,'reading progress survives a reload');
}

// ---- Messenger consistency ----
assert.ok(messageAt('date_messages',NODES.date_messages,1,{companion:'nikola'}),'Nikola writing in the evening is shown in the messenger');
assert.equal(messageAt('date_messages',NODES.date_messages,1,{companion:'nikola'}).direction,'incoming');
assert.equal(messageAt('date_messages',NODES.date_messages,0,{companion:'nikola'}).direction,'outgoing');
assert.match(pageText(NODES.afternoon_invite.pages[1],{companion:'nikola'}),/\{who\.airport\}|Никола/);
assert.equal(NODES.afternoon_invite.choices,undefined,'airport evening choices are not under Ana’s bread line');
assert.equal(NODES.afternoon_invite.next,'evening_plan');
assert.equal(NODES.afternoon_invite.pages.at(-1).speaker,'ownerCounterpart');
assert.match(NODES.afternoon_invite.pages.at(-1).text,/даже если тебя не будет|even if you are out/i);
assert.deepEqual(NODES.evening_plan.choices.map(c=>c.next),['date_river','date_friends','date_messages']);
assert.equal(NODES.work_business.time,'17:35');
assert.equal(NODES.evening_plan.location,'БЕЛГРАД · ДЕНЬ 1');
// ---- Names ----
const dmitry={gender:'male',nameId:'dmitry'};
assert.equal(callsByShortName('Никола',{companion:'nikola',nikolaBond:'romance'}),true);
assert.equal(callsByShortName('Никола',{companion:'nikola',nikolaBond:'friendship'}),false,'friends keep the full name at first');
assert.equal(callsByShortName('Никола',{companion:'nikola',nikolaBond:'friendship',dayDone:4}),true,'and switch after a few days');
assert.equal(callsByShortName('Милица',{companion:'milica',milicaBond:'romance'}),true);
assert.equal(callsByShortName('Ася',{asyaBond:'romance'}),true);assert.equal(callsByShortName('Ася',{}),false);
assert.equal(callsByShortName('contact',{companion:'nikola',nikolaBond:'romance'}),true);
const message=NODES.last_message.pages[1];
assert.match(interpolate(pageText(message,{companion:'milica',milicaBond:'romance'}),dmitry,catalog,'ru'),/Дима, не забудь/);
assert.match(interpolate(pageText(message,{companion:'milica',milicaBond:'friendship'}),dmitry,catalog,'ru'),/Дмитрий, не забудь/);
// ---- First evening ----
assert.equal(NODES.host_evening.next,'host_old_town');assert.equal(NODES.host_evening.choices,undefined);
assert.equal(NODES.host_evening.pages.length,6,'older save indices stay valid');
const meal=NODES.host_terrace.choices;assert.deepEqual(meal.map(choice=>choice.effect.hostMeal),['cevapi','pljeskavica','ajvar']);
for(const dish of ['cevapi','pljeskavica','ajvar'])assert.ok(pageText(NODES.host_terrace_meal.pages[0],{hostMeal:dish}).length>40);
assert.notEqual(pageText(NODES.host_terrace_meal.pages[0],{hostMeal:'cevapi'}),pageText(NODES.host_terrace_meal.pages[0],{hostMeal:'ajvar'}));
const dishes=JSON.stringify([NODES.host_terrace.pages,NODES.host_terrace_meal.pages]);for(const word of ['айвар','Чевапчичи','плескавица'])assert.ok(new RegExp(word,'i').test(dishes),word);
const pace=NODES.host_terrace_meal.choices;
assert.deepEqual(pace.map(choice=>choice.tone),['romance','personal','friendship'],'a romantic, a slow and a friendly pace');
assert.deepEqual(pace.map(choice=>choice.next),['host_evening_close','host_evening_goodnight','host_evening_goodnight']);
assert.ok(NODES.host_evening_close.pages.some(page=>/Можно тебя обнять\?/.test(page.text)),'the hug is asked for aloud');
assert.equal(NODES.host_evening_close.bg,'belgrade-courtyard-evening-v1');assert.equal(NODES.host_evening.bg,'belgrade-courtyard-evening-v1','the courtyard looks like evening');
assert.equal(NODES.host_old_town.bg,'skadarlija-evening-v1');assert.equal(NODES.host_terrace.bg,'skadarlija-kafana-v1');
// The joke about the floorboard appears only if the coffee was spilled.
const reply=NODES.host_evening_invite.pages[1];
assert.match(pageText(reply,{host:'dragan',hostCoffeeSpilled:true}),/помню про половицу/);
assert.doesNotMatch(pageText(reply,{host:'dragan'}),/половиц/);assert.doesNotMatch(pageText(reply,{host:'jelena',hostCoffeeSpilled:false}),/половиц/);
// Grey or white close-fitting Under Armour T-shirt, asked as a choice.
const lend=NODES.host_coffee_lend;assert.match(pageText(lend.pages[0],{host:'dragan'}),/футболки Under Armour/);assert.match(pageText(lend.pages[0],{host:'dragan'}),/серую или белую/);
const top=beatActionAt(lend,0);assert.equal(top.kind,'reply');assert.deepEqual(top.options.map(option=>option.effect.hostTop),['grey','white']);
assert.match(pageText(NODES.host_coffee_borrowed.pages[0],{host:'dragan',hostTop:'white'}),/Белая футболка Under Armour облегает/);
assert.match(pageText(NODES.host_coffee_borrowed.pages[0],{host:'dragan',hostTop:'grey'}),/Серая футболка Under Armour/);
assert.ok(!/Чёрная футболка/.test(JSON.stringify(NODES.host_coffee_borrowed.pages)),'the old black top is gone');
for(const top2 of ['grey','white'])assert.ok(fs.existsSync(new URL(`../public/assets/dragan-kitchen-borrowed-layer-${top2}-v1.webp`,import.meta.url)));
assert.equal(presentationFor(NODES.host_coffee_borrowed,NODES.host_coffee_borrowed.pages[0],{host:'dragan',hostTop:'white'}).emotion,'kitchen-borrowed-white');
assert.equal(presentationFor(NODES.host_coffee_borrowed,NODES.host_coffee_borrowed.pages[0],{host:'dragan'}).emotion,'kitchen-borrowed');
// On the evening walk Dragan carries no keys: only the key-free portraits are used.
const KEY_FREE=new Set(['evening-friendly','evening-thoughtful','evening-laughing','evening-flirty']);
for(const id of ['host_evening','host_old_town','host_terrace','host_terrace_meal','host_evening_close','host_evening_goodnight'])for(const page of NODES[id].pages){
  const p=presentationFor(NODES[id],page,{host:'dragan'});if(p.character==='dragan'){assert.ok(KEY_FREE.has(p.emotion),id+': '+p.emotion);assert.ok(CHARACTER_SPRITES.dragan[p.emotion]);}
}
// The tidy-up of the unpacked suitcase.
assert.ok(!/Чемодан так и стоит у двери/.test(JSON.stringify(NODES.room_alone.pages)));
assert.ok(!/чемодан/i.test(NODES.host_coffee_wait.pages[2].text+NODES.host_coffee_lend.pages[2].text));
assert.match(NODES.night_messages.pages[1].text,/Я Ася, мне дали твой контакт/);
assert.match(NODES.night_messages.pages[1].text,/помогу тебе с квартирой/);
assert.ok(/^Во Врачаре/.test(NODES.district_vracar.pages[0].text)&&!/На Врачаре/.test(JSON.stringify(NODES)),'the preposition for Vračar');
assert.ok(!/Обещаю не обижаться за стены/.test(JSON.stringify(NODES)));
for(const id of ['housing_quiet','housing_work','housing_compare'])assert.ok(NODES[id]);
assert.ok(NODES.morning_start.choices.every(choice=>/^Главное — /.test(choice.label)),'the housing priority choice says what is being chosen');
for(const [id,page]of [['night_messages',1],['host_coffee_lend',0],['flat_settle',0]])assert.ok(page>=0&&dictionary[NODES[id].pages[page].text]!==undefined||NODES[id].pages[page].byFlag,id);
console.log('Bank chapter (guide, three branches, no automatic account), messenger, address forms and the extended first evening checked.');
