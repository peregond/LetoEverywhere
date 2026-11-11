import assert from 'node:assert/strict';
import fs from 'node:fs';
import {test} from 'node:test';
import {NODES,START,STORY_VERSION,JOURNAL,CHARACTER_SPRITES,BACKGROUNDS,presentationFor,pageText} from '../public/story.js';
import {DAYS,PRELUDE} from '../public/days.js';
import {CHAPTERS,rememberChapter,restartChapter,continuationFor} from '../public/chapters.js';
import {choiceVisible,applyRomanceEffect} from '../public/romance.js';
import {applyFlatEffect} from '../public/flat-data.js';
import {normalizeProgress} from '../lib/save-format.js';
import {EVENING_PEOPLE} from '../public/route-evenings.js';
import {tramMove,TRAM_START,TRAM_GOAL} from '../public/pixel-tram.js';
const active=Object.entries(NODES).filter(([,n])=>n.activeRoute);
const targets=n=>[...(n.choices?.map(c=>c.next)??[n.next]),...(n.skipTo?[n.skipTo]:[])];
const apply=(flags,effect={})=>{Object.assign(flags,effect);applyFlatEffect(flags,effect);applyRomanceEffect(flags,effect);};
const choose=(id,flags,target,gender='female')=>{const c=NODES[id].choices.find(c=>c.next===target&&choiceVisible(c,flags,{gender}));assert.ok(c,`${id} -> ${target} is available`);apply(flags,c.effect);return c.next;};

test('fifteen consecutive days, all exits and skips remain in the active route',()=>{
 assert.equal(STORY_VERSION,2);assert.deepEqual(PRELUDE,[]);assert.equal(CHAPTERS.length,15);
 for(const [i,d]of DAYS.entries()){assert.equal(d.n,i+1);assert.equal(NODES[d.start].chapterId,d.id);assert.equal(NODES[d.start].effectOnEnter.dayDone,i);}
 const canEnd=new Set(['end']);
 for(let changed=true;changed;){changed=false;for(const [id,n]of active)if(!canEnd.has(id)&&targets(n).some(t=>canEnd.has(t))){canEnd.add(id);changed=true;}}
 for(const [id,n]of active){
  assert.ok(canEnd.has(id),id+' can finish');assert.ok(n.routeDay>=1&&n.routeDay<=15,id);
  for(const target of targets(n)){if(target==='end'){assert.equal(n.routeDay,15);continue;}assert.ok(NODES[target]?.activeRoute,id+' -> '+target);const step=NODES[target].routeDay-n.routeDay;assert.ok(step===0||step===1,id+' -> '+target+' skips or reverses a day');}
  for(const index of Object.keys(n.actions??{}))assert.ok(Number(index)<n.pages.length,id+' action index');
 }
 assert.equal(continuationFor({flags:{}}),START);assert.equal(continuationFor({flags:{dayDone:15}}),null);
});

test('full playthroughs: genders, airport people, temporary hosts, four landlords, banks and three endings',()=>{
 for(const gender of ['male','female'])for(const companion of ['nikola','milica'])for(const host of ['dragan','jelena'])for(const owner of ['ana','stefan','marko','vuk'])for(const bank of ['api','postanska'])for(const ending of ['stay','leave','return']){
  const state={formatVersion:1,storyVersion:STORY_VERSION,profile:{gender,nameId:gender==='male'?'dmitry':'anna'},node:START,index:0,flags:{},journal:[],log:[],rewind:[]},days=new Set();
  for(let step=0;state.node!=='end';step++){
   assert.ok(step<350,'route loop at '+state.node);const id=state.node,n=NODES[id],f=state.flags;assert.ok(n.activeRoute,id);days.add(n.routeDay);
   apply(f,n.effectOnEnter);for(const j of n.journal??[])if(!state.journal.includes(j))state.journal.push(j);rememberChapter(state,NODES);
   for(const p of n.pages){state.log.push({speaker:p.speaker,text:pageText(p,f)});if(p.action)apply(f,p.action.effect);}
   let next=n.next;
   if(n.choices){
    const available=n.choices.filter(c=>choiceVisible(c,f,state.profile));assert.ok(available.length,id+' has a visible choice');let c;
    if(id==='quick_baggage')c=available.find(c=>c.effect.companion===companion);
    else if(available.some(c=>c.effect?.host))c=available.find(c=>c.effect.host===host);
    else if(id==='district_map')c=available.find(c=>c.effect.districtOwner===(owner==='stefan'?'ana':owner));
    else if(id==='flat_decision')c=available.find(c=>c.next===(owner==='stefan'&&f.districtOwner!=='stefan'?'flat_enter_stefan':'route3_selected'));
    else if(/^evening\d+$/.test(id))c=available.find(c=>c.next.endsWith('_alone'));
    else if(id==='route5_alta')c=available.find(c=>c.effect.bankChoice===bank);
    else if(id==='route15_start')c=available.find(c=>c.effect.finalChoice===ending);
    else if(id==='route10_start'||id==='route12_start')c=available.find(c=>c.effect.routeTravelWith===companion);
    else if(id==='route11_start')c=available.find(c=>c.tone==='friendship');
    c??=available[0];apply(f,c.effect);next=c.next;state.log.push({speaker:'player',text:c.label,choice:true});
   }
   assert.ok(next,id+' has an exit');state.node=next;state.index=0;
  }
  state.completed=true;assert.equal(state.flags.dayDone,15);assert.equal(state.flags.companion,companion);assert.equal(state.flags.host,host);assert.equal(state.flags.districtOwner,owner);assert.equal(state.flags.bankChoice,bank);assert.equal(state.flags.finalChoice,ending);assert.equal(state.flags.routeNewRegistration,true);assert.deepEqual([...days],DAYS.map(d=>d.n));
  const saved=normalizeProgress(state);assert.equal(Object.keys(saved.chapterMarks).length,15);assert.equal(saved.log.length,state.log.length);
  assert.ok(JSON.stringify(saved).length<500000);assert.equal(restartChapter(saved,'districts',NODES),true);assert.equal(saved.flags.districtOwner,undefined);assert.equal(saved.flags.host,host);assert.equal(saved.flags.routeLukaMet,undefined);
 }
});

test('evening invitations depend on meeting people; friendship never advances romance',()=>{
 for(let day=1;day<=15;day++){
  for(const [person,,, ,known]of EVENING_PEOPLE){
   const entry=NODES[`evening${day}_meet`].choices.find(c=>c.next===`evening${day}_${person}`);assert.ok(entry);assert.equal(choiceVisible(entry,{}),false,person+' is not known at the start');assert.deepEqual(entry.when,known);
  }
  for(const [,c]of Object.entries(NODES[`evening${day}`].choices))assert.ok(c.next);
  const f={companion:'milica',milicaBond:'friendship'};choose(`evening${day}_milica`,f,`evening${day}_milica_friend`);assert.equal(f.routeRel_milica,undefined);assert.equal(f.love_airport,undefined);
 }
 const f={companion:'nikola',nikolaBond:'romance'};
 choose('evening2_nikola',f,'evening2_nikola_date');assert.equal(f.routeRel_nikola,undefined);
 const declined={...f};choose('evening2_nikola_date',declined,'evening2_nikola_friend');assert.equal(declined.routeRel_nikola,undefined);
 const noTouch={...f};choose('evening2_nikola_date',noTouch,'evening2_nikola_date_no_touch');assert.equal(noTouch.routeRel_nikola,1);
 choose('evening2_nikola_date',f,'evening2_nikola_date_yes');assert.equal(f.routeRel_nikola,1);
 choose('evening4_nikola',f,'evening4_nikola_kiss_ask');assert.equal(f.routeRel_nikola,1);
 choose('evening4_nikola_kiss_ask',f,'evening4_nikola_kiss');assert.equal(f.routeRel_nikola,2);
 choose('evening6_nikola',f,'evening6_nikola_night_ask');choose('evening6_nikola_night_ask',f,'evening6_nikola_fade');assert.equal(f.routeRel_nikola,3);assert.equal(f.love_airport,'lover');
 for(const [id,n]of active.filter(([,n])=>n.adult)){
  assert.ok(NODES[n.skipTo].activeRoute,id);assert.equal(NODES[n.skipTo].adult,undefined,id);
  if(!id.startsWith('adult_evening')){assert.equal(n.next,n.skipTo);assert.ok(n.pages.length<=2);}
 }
});

test('the final evening gives each known person a distinct farewell in every ending',()=>{
 for(const ending of ['stay','leave','return']){
  const page=NODES['route_epilogue_'+ending].pages[1];
  const lines=EVENING_PEOPLE.map(([id])=>pageText(page,{routeEndingWith:id}));
  assert.equal(new Set(lines).size,EVENING_PEOPLE.length);
  assert.match(pageText(page,{routeEndingWith:'milos'}),/балаклаве/);
  assert.match(pageText(page,{routeEndingWith:'alone'}),/наедине/);
 }
});

test('group consent is separate for both companions and the player; a refusal stays friendly',()=>{
 const group=NODES.evening4.choices.find(c=>c.next==='route4_group_airport');
 assert.equal(choiceVisible(group,{host:'dragan',hostBond:'romance',companion:'milica',milicaBond:'friendship'}),false);
 const f={host:'dragan',hostBond:'romance',companion:'milica',milicaBond:'romance'};assert.equal(choiceVisible(group,f),true);
 choose('route4_group_airport',f,'route4_group_host');assert.equal(f.routeGroupConsent,undefined);
 choose('route4_group_host',f,'evening4_company');assert.equal(f.routeGroupConsent,undefined);
 choose('route4_group_host',f,'route4_group_fade');assert.equal(f.routeGroupConsent,true);
});

test('mask remains in all active text, portraits, messages, travel and final scenes',()=>{
 const flags={companion:'nikola',host:'dragan',districtOwner:'ana',routeTravelWith:'milos',routeEndingWith:'milos',routeMaskBond:'romance',maskMet:true};
 for(const [id,n]of active)for(const p of n.pages){
  assert.doesNotMatch(JSON.stringify(p),/Милош|без балаклавы|открытое лицо|снимает балаклаву|без маски/iu,id);
  const frame=presentationFor(n,p,flags);if(frame.character?.startsWith('milos')){assert.equal(frame.character,'milos-masked',id);assert.doesNotMatch(CHARACTER_SPRITES[frame.character][frame.emotion].alt,/Милош/);}
  assert.ok(BACKGROUNDS[frame.bg],id);assert.ok(fs.existsSync(new URL('../public/assets/'+frame.bg+'.webp',import.meta.url)),frame.bg);
  if(frame.character){const art=CHARACTER_SPRITES[frame.character]?.[frame.emotion];assert.ok(art,id+' portrait');assert.ok(fs.existsSync(new URL('../public/assets/'+art.file+'.webp',import.meta.url)),art.file);}
 }
});

test('trips support solo travel, known companions, postponement and a changed border plan',()=>{
 for(const day of [10,12]){
  const choices=NODES[`route${day}_start`].choices;assert.deepEqual(choices.filter(c=>choiceVisible(c,{})).map(c=>c.effect.routeTravelWith),['alone']);
  for(const who of ['nikola','milica'])assert.ok(choices.some(c=>c.effect.routeTravelWith===who&&choiceVisible(c,{companion:who})));
  const solo=pageText(NODES[`route${day}_prepare`].pages[0],{routeTravelWith:'alone'});assert.match(solo,/один/);
  assert.notEqual(pageText(NODES[`route${day}_rest`].pages[0],{routeTravelWith:'nikola'}),pageText(NODES[`route${day}_rest`].pages[0],{routeTravelWith:'milica'}));
  assert.equal(NODES[`route${day}_cancel`].next,'evening'+day);
 }
 assert.equal(NODES.route12_turnback.next,'evening12');assert.match(NODES.route12_back.pages[0].text,/Никакого автоматического/);
});

test('declining the lease keeps the temporary address, and the pixel puzzle is solvable',()=>{
 const f={};choose('flat_contract',f,'route4_defer');assert.equal(f.rentalMoved,false);assert.equal(choiceVisible(NODES.route5_start.choices[0],f),false);assert.equal(choiceVisible(NODES.route5_start.choices[1],f),true);
 assert.equal(NODES.route6_pixel.pages[0].action.quest,'pixel-tram');assert.equal(NODES.route6_pixel.actions[0],NODES.route6_pixel.pages[0].action);
 let p=TRAM_START;for(const d of ['right','up','up','left'])p=tramMove(p,d);assert.equal(p,TRAM_GOAL);assert.equal(tramMove(TRAM_START,'up'),TRAM_START);assert.equal(tramMove(0,'left'),0);assert.equal(tramMove(4,'right'),4);
 const saved={formatVersion:1,storyVersion:1,profile:{gender:'female',nameId:'anna'},node:START,index:0,flags:{},journal:[],log:[]};assert.throws(()=>normalizeProgress(saved),/версия/);
});
void JOURNAL;
