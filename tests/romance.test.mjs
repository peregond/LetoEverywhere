import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,pageText,resolveStoryText} from '../public/story.js';
import {SLOTS,isAvailable,partnersAt,stageOf,loversOf,loveNames,choiceVisible,applyRomanceEffect,nameOf,identityOf} from '../public/romance.js';
const {configureTranslations,setLanguage}=await import('../public/i18n.js?v=0.16.1');
const dictionary=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url),'utf8'));
// Availability follows what the player chose earlier, never a default.
assert.deepEqual(SLOTS.filter(slot=>isAvailable(slot,{})),[]);
const all={companion:'milica',milicaBond:'romance',asyaBond:'romance',lukaBond:'romance',districtBond:'romance',districtOwner:'jelena',bankBond:'romance',bankDate:'asked',bankSpark:'teodora',mupBond:'spark',mupDate:'asked',mupSpark:'strahinya',maskEnd:'spark'};
assert.deepEqual(SLOTS.filter(slot=>isAvailable(slot,all)),SLOTS);
assert.deepEqual(SLOTS.map(slot=>nameOf(slot,all)),['Милица','Ася','Лука','Йелена','Теодора','Страхиня','Милош']);
assert.equal(isAvailable('bank',{bankBond:'romance'}),false,'A spark alone is not a date');
assert.equal(isAvailable('mup',{mupBond:'spark'}),false);
// Closeness only rises, one step at a time, by choices that say so.
const flags={...all,lastPartner:'asya'};
applyRomanceEffect(flags,{loveStep:'kiss'});assert.equal(stageOf('asya',flags),'kiss');
applyRomanceEffect(flags,{loveStep:'date'});assert.equal(stageOf('asya',flags),'kiss','A step never goes back');
assert.ok(!Object.hasOwn(flags,'loveStep'));
applyRomanceEffect(flags,{makeLover:true});assert.equal(stageOf('asya',flags),'lover');assert.deepEqual(loversOf(flags),['asya']);assert.equal(flags.loverCount,1);
flags.lastPartner='luka';applyRomanceEffect(flags,{loveStep:'kiss'});
assert.deepEqual(partnersAt(flags,'kiss'),['asya','luka']);
assert.ok(choiceVisible({when:{minPartners:{stage:'kiss',count:2}}},flags));assert.ok(!choiceVisible({when:{minPartners:{stage:'kiss',count:3}}},flags));
applyRomanceEffect(flags,{groupBond:true});assert.deepEqual(loversOf(flags),['asya','luka']);assert.equal(flags.loverCount,2);assert.deepEqual(loveNames(flags),['Ася','Лука']);
applyRomanceEffect(flags,{makeLover:true});assert.equal(flags.loverCount,2,'Nobody is counted twice');
// Hubs and conditions: every evening is skippable, and each option needs the right earlier step.
for(const stage of [1,2,3])for(const k of [1,2,3]){
 const hub=NODES[`love${stage}_${k}_hub`];assert.ok(hub,'hub '+stage+'/'+k);
 assert.ok(hub.choices.some(c=>!c.when),'An evening can always be skipped');
 for(const slot of SLOTS){
  const option=hub.choices.find(c=>c.effect?.lastPartner===slot);assert.ok(option,slot);
  assert.deepEqual(option.when,{partner:slot,stage:stage===1?null:stage===2?'date':'kiss'});
 }
}
const none={},seeAsya={asyaBond:'romance'};
const visible=(id,f)=>NODES[id].choices.filter(c=>choiceVisible(c,f)).map(c=>c.effect.lastPartner??'skip');
assert.deepEqual(visible('love1_1_hub',none),['skip']);assert.deepEqual(visible('love1_1_hub',seeAsya),['asya','skip']);
assert.deepEqual(visible('love2_1_hub',seeAsya),['skip'],'A kiss needs a date first');assert.deepEqual(visible('love2_1_hub',{...seeAsya,love_asya:'date'}),['asya','skip']);
assert.deepEqual(visible('love3_1_hub',{...seeAsya,love_asya:'date'}),['skip'],'A night needs a kiss first');
assert.ok(!visible('love3_1_hub',{...seeAsya,love_asya:'kiss'}).includes('group'));
// Every step toward closeness comes with a way to stay as you are, and consent is spoken aloud.
const scenes=Object.keys(NODES).filter(id=>/^love[123]_[123]_(airport|asya|luka|owner|bank|mup|milos)$/.test(id));assert.equal(scenes.length,63);
for(const id of scenes){
 const tones=NODES[id].choices.map(c=>c.tone);assert.ok(tones.includes('romance')&&(tones.includes('friendship')||tones.includes('personal')),id);
 const rise=NODES[id].choices.filter(c=>c.effect&&(c.effect.loveStep||c.effect.makeLover));assert.equal(rise.length,1,id);
 assert.match(JSON.stringify(NODES[id].pages),/Можно|можно|«нет»|«стоп»|скажи|Скажи|решай|Решай|хочешь|хочется|Если/,id+' asks');
}
for(const stage of [1,2,3])for(const k of [1,2,3])assert.match(JSON.stringify(NODES[`love${stage}_${k}_${stage===1?'airport':'airport'}`].pages),/можно передумать|«Можно взять тебя за руку\?»|любой ответ здесь будет принят/);
// Legacy intimate passages stay short, non-explicit and optional; the early Nikola park night is an explicit opt-in branch.
const fadeAdult=Object.keys(NODES).filter(id=>NODES[id].adult&&!NODES[id].activeRoute&&!id.startsWith('nikola_park_'));
const earlyAdult=Object.keys(NODES).filter(id=>NODES[id].adult&&id.startsWith('nikola_park_'));
assert.equal(fadeAdult.length,5,'three night scenes, the group scene and the airport scene');
assert.ok(earlyAdult.length>=5,'early Nikola park night adds explicit adult scenes');
for(const id of fadeAdult){assert.ok(NODES[NODES[id].skipTo]&&!NODES[NODES[id].skipTo].adult,id);assert.equal(NODES[id].next,NODES[id].skipTo);assert.ok(NODES[id].pages.length<=2);
 assert.ok(!/обнажённ|раздева|член|грудь|оргазм|секс|нагот|стон|пенис|влагалищ|naked|undress|orgasm|sex|nipple|erect|moan/iu.test(JSON.stringify(NODES[id].pages)),'Fade to black only: '+id);}
for(const id of earlyAdult){assert.ok(NODES[NODES[id].skipTo]&&!NODES[NODES[id].skipTo].adult,id);assert.equal(NODES[id].skipTo,'nikola_park_morning');}
// The evening for several people needs two who are close and asks everyone; "no" is a good answer and leads to tea.
assert.match(JSON.stringify(NODES.love3_group.pages),/«Нет» здесь всегда хороший ответ/);assert.deepEqual(NODES.love3_group.choices.map(c=>c.tone),['romance','friendship']);
assert.equal(NODES.love3_group_tea.next,'d28_end');assert.equal(NODES.love3_group_morning.next,'d28_end');
for(const k of [1,2,3])assert.ok(NODES[`love3_${k}_hub`].choices.some(c=>c.next==='love3_group'&&c.when.minPartners.count===2));
// Names of people close to the player appear in the text, in both languages.
const f2={lovers:'asya,luka',loverCount:2,lastPartner:'luka'};
assert.match(pageText(NODES.love3_group.pages[0],f2),/Ася и Лука/);
configureTranslations(dictionary);setLanguage('en');
assert.match(pageText(NODES.love3_group.pages[0],f2,'en'),/Asya and Luka/);
assert.match(resolveStoryText('Ask {who.airport} on a date',{companion:'nikola'},'en'),/Nikola/);
setLanguage('ru');
assert.equal(resolveStoryText('Позвать {who.airport.acc}, пойти с {who.asya.ins}',{companion:'milica'},'ru'),'Позвать Милицу, пойти с Асей');
assert.equal(resolveStoryText('{who.luka.acc} {who.milos.ins}',{},'ru'),'Луку Милошем');
setLanguage('ru');
// The endings remember who is close: three counts, three endings.
for(const id of ['stay_lovers','leave_lovers','return_lovers']){
 const page=NODES[id].pages[0];assert.notEqual(pageText(page,{}),pageText(page,{lovers:'asya',loverCount:1,lastPartner:'asya'}));
 assert.match(pageText(page,{lovers:'asya,luka,milos',loverCount:3}),/Ася, Лука и Милош/);
}
assert.equal(NODES.stay_two.next,'stay_lovers');assert.equal(NODES.leave_two.next,'leave_lovers');assert.equal(NODES.return_two.next,'return_lovers');
// Nothing here touches the application, the bank, the lease or the permit.
const allowed=/^(lastPartner|loveStep|makeLover|groupBond)$/;
for(const id of Object.keys(NODES).filter(id=>id.startsWith('love')))for(const choice of NODES[id].choices??[])for(const key of Object.keys(choice.effect??{}))assert.match(key,allowed,id+' changes '+key);
assert.equal(identityOf('owner',{districtBond:'romance',districtOwner:'jelena',host:'dragan'}),'jelena');
console.log('Romance: three stages for seven people, consent at every step, optional adult passages without detail, an evening for several by shared consent, endings that remember who is close.');
