import assert from 'node:assert/strict';
import {test} from 'node:test';
import {NODES,STORY_VERSION,pageText,presentationFor} from '../public/story.js';
import {OFFICE_PEOPLE} from '../public/day-office.js';
import {choiceVisible,applyRomanceEffect} from '../public/romance.js';
import {messageAt} from '../public/messenger-model.js';
import {normalizeProgress} from '../lib/save-format.js';
import {rememberChapter,restartChapter} from '../public/chapters.js';
const effect=(flags,value={})=>{Object.assign(flags,value);applyRomanceEffect(flags,value);};
const enter=(id,flags)=>effect(flags,NODES[id].effectOnEnter);
const pick=(id,next,flags)=>{const c=NODES[id].choices.find(c=>c.next===next&&choiceVisible(c,flags));assert.ok(c,id+' -> '+next);effect(flags,c.effect);enter(next,flags);};
const rootFor=p=>`route${p.kind==='bank'?5:2}_${p.kind}_people_${p.id}`;
const evening=p=>NODES.evening5_meet.choices.find(c=>c.next==='evening5_'+p.id);

test('all four office people are reachable from registration and both bank routes',()=>{
 assert.deepEqual(OFFICE_PEOPLE.map(p=>p.id),['lazar','teodora','ivana','strahinya']);
 assert.equal(NODES.route2_registered.next,'route2_mup_people');assert.equal(NODES.route5_registration_done.next,'route5_mup_people');assert.equal(NODES.route5_bank_done.next,'route5_bank_people');
 assert.equal(NODES.bank_api_docs.next,'route5_bank_done');assert.equal(NODES.bank_api_cost.next,'route5_bank_done');assert.equal(NODES.route5_postanska.next,'route5_bank_done');
 for(const p of OFFICE_PEOPLE){const root=rootFor(p);assert.ok(NODES[root].activeRoute);assert.equal(NODES[root].routeDay,p.kind==='bank'?5:2);assert.equal(choiceVisible(evening(p),{}),false);}
 // Skipping temporary-address introductions leaves the day-5 opportunity available.
 for(const p of OFFICE_PEOPLE.filter(p=>p.kind==='mup'))assert.ok(NODES.route5_mup_people.choices.some(c=>c.next==='route5_mup_people_'+p.id&&choiceVisible(c,{})));
});

test('professional, friendly and declined personal contact paths preserve boundaries',()=>{
 for(const p of OFFICE_PEOPLE){
  const root=rootFor(p),hub=root.slice(0,-p.id.length-1);
  const professional={};enter(root,professional);pick(root,hub,professional);assert.equal(professional['routeOfficeMet_'+p.id],true);assert.equal(choiceVisible(evening(p),professional),false);
  const friendly={};enter(root,friendly);const friendlyChoice=NODES[root].choices.find(c=>c.tone==='friendship');effect(friendly,friendlyChoice.effect);pick(root+'_contact',root+'_saved',friendly);assert.equal(friendly['routeOfficeBond_'+p.id],'friendship');assert.equal(choiceVisible(evening(p),friendly),true);
  assert.ok(NODES['evening5_'+p.id].choices.filter(c=>choiceVisible(c,friendly)).every(c=>c.tone!=='romance'));
  const declined={};const romance=NODES[root].choices.find(c=>c.tone==='romance');effect(declined,romance.effect);pick(root+'_contact',hub,declined);assert.equal(choiceVisible(evening(p),declined),false);assert.equal(declined['routeOfficeBond_'+p.id],'professional');
 }
});

test('each identity has independent date, kiss and night consent for both protagonist genders',()=>{
 for(const gender of ['female','male']){
  const flags={route15:true,bankChoice:'api',routeNewRegistration:true,lastPartner:'airport',love_airport:'date'};
  for(const p of OFFICE_PEOPLE){
   const root=rootFor(p);enter(root,flags);const invitation=NODES[root].choices.find(c=>c.tone==='romance');effect(flags,invitation.effect);pick(root+'_contact',root+'_saved',flags);
   pick('evening5_'+p.id,'evening5_'+p.id+'_date',flags);pick('evening5_'+p.id+'_date','evening5_'+p.id+'_date_yes',flags);assert.equal(flags['routeRel_'+p.id],1);
   pick('evening6_'+p.id,'evening6_'+p.id+'_kiss_ask',flags);pick('evening6_'+p.id+'_kiss_ask','evening6_'+p.id+'_friend',flags);assert.equal(flags['routeRel_'+p.id],1);
   pick('evening7_'+p.id+'_kiss_ask','evening7_'+p.id+'_kiss',flags);assert.equal(flags['routeRel_'+p.id],2);
   pick('evening8_'+p.id,'evening8_'+p.id+'_night_ask',flags);pick('evening8_'+p.id+'_night_ask','evening8_'+p.id+'_friend',flags);assert.equal(flags['routeRel_'+p.id],2);
   pick('evening9_'+p.id+'_night_ask','evening9_'+p.id+'_fade',flags);assert.equal(flags['routeRel_'+p.id],3);
   const fade=NODES['evening9_'+p.id+'_fade'];assert.equal(fade.adult,true);assert.equal(fade.skipTo,'route9_close');
  }
  for(const p of OFFICE_PEOPLE){assert.equal(flags['routeOfficeContact_'+p.id],true);assert.equal(flags['routeRel_'+p.id],3);}
  assert.equal(flags.bankChoice,'api');assert.equal(flags.routeNewRegistration,true);assert.equal(flags.bankAccountOpen,undefined);assert.equal(flags.residenceApplication,undefined);assert.equal(flags.love_airport,'date');
  const state=normalizeProgress({formatVersion:1,storyVersion:STORY_VERSION,profile:{gender,nameId:gender==='male'?'dmitry':'anna'},node:'evening9',index:0,flags,journal:[],log:[],rewind:[]});assert.deepEqual(state.flags,flags);
 }
});

test('portraits, messenger contacts, travel and all endings retain each person’s identity',()=>{
 for(const p of OFFICE_PEOPLE){
  const flags={routeOfficeContact_lazar:true,routeOfficeContact_teodora:true,routeOfficeContact_ivana:true,routeOfficeContact_strahinya:true,routeTravelWith:p.id,routeEndingWith:p.id,bankSpark:'other',mupSpark:'other'};
  const message=NODES['evening5_'+p.id+'_message'];assert.equal(messageAt('evening5_'+p.id+'_message',message,1,flags).contact,p.name);
  const node=NODES['evening5_'+p.id],visual=presentationFor(node,node.pages[0],flags);
  if(['teodora','ivana'].includes(p.id)){assert.equal(visual.character,null);assert.equal(visual.bg,`${p.id}-evening-arrival-v1`);}else assert.equal(visual.character,p.sprite);
  for(const day of [10,12]){
   const c=NODES[`route${day}_start`].choices.find(c=>c.effect.routeTravelWith===p.id);assert.ok(c&&choiceVisible(c,flags));
   const rest=NODES[`route${day}_rest`];assert.equal(pageText(rest.pages[0],flags),p.travel[0]);assert.equal(presentationFor(rest,rest.pages[0],flags).character,p.sprite);
  }
  for(const ending of ['stay','leave','return'])assert.ok(pageText(NODES['route_epilogue_'+ending].pages[1],flags).startsWith(p.name+':'));
 }
});

test('chapter replay restores exactly the contacts earned before the chapter',()=>{
 const flags={route15:true,routeOfficeMet_ivana:true,routeOfficeContact_ivana:true,routeOfficeBond_ivana:'friendship'};
 const state={node:'route5_start',index:0,flags,journal:[],log:[],rewind:[]};rememberChapter(state,NODES);Object.assign(flags,{routeOfficeMet_lazar:true,routeOfficeContact_lazar:true,routeOfficeBond_lazar:'romance',routeRel_lazar:3});state.node='evening9';
 assert.equal(restartChapter(state,'papers',NODES),true);assert.equal(state.flags.routeOfficeContact_ivana,true);assert.equal(state.flags.routeOfficeContact_lazar,undefined);assert.equal(state.flags.routeRel_lazar,undefined);
});

test('all four romances fit into one calendar without replacing one another',()=>{
 const flags={route15:true};
 const connect=p=>{const root=rootFor(p);enter(root,flags);effect(flags,NODES[root].choices.find(c=>c.tone==='romance').effect);pick(root+'_contact',root+'_saved',flags);};
 OFFICE_PEOPLE.filter(p=>p.kind==='mup').forEach(connect);
 const schedule=[[2,'ivana','date'],[3,'strahinya','date'],[4,'ivana','kiss'],[5,'lazar','date'],[6,'teodora','date'],[7,'strahinya','kiss'],[8,'ivana','night'],[9,'lazar','kiss'],[10,'teodora','kiss'],[11,'strahinya','night'],[12,'lazar','night'],[13,'teodora','night']];
 for(const [day,id,stage]of schedule){
  if(day===5)OFFICE_PEOPLE.filter(p=>p.kind==='bank').forEach(connect);
  const root=`evening${day}_${id}`;assert.equal(choiceVisible(NODES[`evening${day}_meet`].choices.find(c=>c.next===root),flags),true);
  pick(root,root+(stage==='date'?'_date':stage==='kiss'?'_kiss_ask':'_night_ask'),flags);
  pick(root+(stage==='date'?'_date':stage==='kiss'?'_kiss_ask':'_night_ask'),root+(stage==='date'?'_date_yes':stage==='kiss'?'_kiss':'_fade'),flags);
 }
 for(const p of OFFICE_PEOPLE)assert.equal(flags['routeRel_'+p.id],3,p.id);
});
