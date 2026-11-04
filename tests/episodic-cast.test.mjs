import assert from 'node:assert/strict';
import fs from 'node:fs';
import{NODES,CHARACTER_SPRITES,BACKGROUNDS,presentationFor}from'../public/story.js';
import{EPISODIC_CAST,EPISODIC_STAGES,EPISODIC_AVATARS}from'../public/episodic-cast.js';
import{buildArtCatalog}from'../public/workshop-model.js';
import{MESSENGER_CONFIG}from'../public/messenger-config.js?v=2';
import{messageAt}from'../public/messenger-model.js';
const before=JSON.stringify(NODES);
const files=JSON.parse(fs.readFileSync(new URL('../public/art-assets.json',import.meta.url)));
const catalog=buildArtCatalog(files,CHARACTER_SPRITES,BACKGROUNDS);
assert.equal(Object.keys(EPISODIC_CAST).length,18);
assert.equal(catalog.people.length,11,'Supporting cast must not change the romance cast');
assert.equal(catalog.supporting.length,18);
assert.equal(new Set(Object.values(EPISODIC_CAST).map(person=>person.name)).size,18);
for(const[id,person]of Object.entries(EPISODIC_CAST)){
 const entry=catalog.supporting.find(p=>p.id===id);assert.deepEqual(entry.missing,[],id);
 assert.deepEqual(Object.keys(CHARACTER_SPRITES[id]),['friendly'],id);
 assert.equal(entry.art.length,1,id);assert.equal(entry.art[0].status,'active');assert.equal(entry.art[0].look,'Эпизодический образ');assert.equal(entry.art[0].category,'characters');
 assert.ok(files.includes(id+'-friendly.webp'));assert.equal(EPISODIC_AVATARS[person.name],id+'-friendly.webp');
}
for(const [id,character] of [['bank_visit_alta','guest-bank-nevena'],['bank_visit_adriatic','guest-bank-bogdan']]){const node=NODES[id],page=node.pages.find(p=>p.character===character);assert.ok(page,id);assert.equal(presentationFor(node,page,{}).character,character);}
for(const[id,index,character,mode,channel]of EPISODIC_STAGES){
 const node=NODES[id],page=node.pages[index];const frame=presentationFor(node,page,{companion:'milica',host:'dragan'});
 if(id==='road_start'&&index===1){assert.equal(frame.bg,'taxi-navigation-v1');assert.equal(frame.contactPortrait,null);assert.equal(frame.composite,true);
 }else if(mode==='contact'){
  assert.equal(frame.character,null,id+': remote speakers must not stand in the player’s location');
  assert.equal(frame.contactPortrait.character,character);assert.equal(frame.contactPortrait.channel,channel);assert.ok(files.includes(frame.contactPortrait.file));
 }else if(id==='d3_m1'&&index===1){assert.equal(frame.character,'milica','The companion returns after the bakery purchase');
 }else if(id==='nikola_questions'){assert.equal(frame.character,null);assert.equal(frame.bg,'nikola-elder-bread-handover-v1');assert.ok(frame.composite);
 }else{assert.equal(frame.character,character,id+':'+index);assert.equal(frame.emotion,'friendly');assert.equal(frame.contactPortrait,null);}
}
assert.equal(presentationFor(NODES.d3_o2,NODES.d3_o2.pages[1],{companion:'milica'}).character,'milica','The companion explains free city transport');
assert.equal(presentationFor(NODES.d3_o2,NODES.d3_o2.pages[1],{companion:'nikola'}).character,'nikola-evening');
assert.equal(presentationFor(NODES.nikola_questions,NODES.nikola_questions.pages[2]).character,'nikola','Return to Nikola after the customer leaves');
assert.equal(presentationFor(NODES.d10_o3,NODES.d10_o3.pages[0]).contactPortrait,null,'Do not show a translator before a reply arrives');
assert.equal(presentationFor(NODES.d18_start,NODES.d18_start.pages[1]).contactPortrait,null,'Do not invent a call before the agreed meeting');
for(const[id,index]of [['messages',0],['phone',3],['friend',2],['decision_home',0]]){
 const contact=messageAt(id,NODES[id],index).contact;assert.equal(contact,'Мама');assert.equal(MESSENGER_CONFIG.avatars[contact],'guest-mom-friendly.webp');
}
assert.equal(MESSENGER_CONFIG.avatars['Сотрудник банка'],'guest-bank-staff-friendly.webp');
assert.notEqual(MESSENGER_CONFIG.avatars['Сотрудник банка'],MESSENGER_CONFIG.avatars['Лазар']);
assert.notEqual(MESSENGER_CONFIG.avatars['Сотрудник банка'],MESSENGER_CONFIG.avatars['Теодора']);
assert.equal(JSON.stringify(NODES),before,'Portrait lookup and browsing must not change story or save state');
console.log('Episodic cast: seventeen complete base portraits, scene/contact staging, offscreen boundaries, messenger avatars, separate workshop coverage and unchanged story data checked.');
