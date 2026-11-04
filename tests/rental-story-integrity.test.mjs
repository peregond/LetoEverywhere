import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,pageText} from '../public/story.js';
import {CHAPTERS} from '../public/chapters.js';
import {choiceVisible} from '../public/romance.js';
import {rentalRedirect} from '../public/rental-story.js';
import {configureTranslations} from '../public/i18n.js?v=0.15.3';

const dictionary=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url)));
configureTranslations(dictionary);
const ids=['ana','stefan','marko','vuk'];
const choices=NODES.district_map.choices;
const current=choices.filter(choice=>choiceVisible(choice,{rentalCast:'new'}));
// Three districts are on the map; Dorćol has a second flat that the decision scene offers.
assert.deepEqual(current.map(choice=>choice.effect.district),['dorcol','vracar','newbelgrade']);
const secondDorcol=NODES.flat_decision.choices.find(choice=>choice.next==='flat_enter_stefan');
assert.ok(secondDorcol,'Stefan is reachable from the first Dorćol flat');
assert.deepEqual(new Set([...current.map(choice=>choice.effect.districtOwner),secondDorcol.effect.districtOwner]),new Set(ids),'all four distinct landlords must be reachable');
for(const id of ids){
 const first=NODES['rental_first_'+id],hub=NODES['rental_hub_'+id];
 assert.ok(first&&hub,id);assert.equal(first.next,'rental_hub_'+id);
 assert.ok(NODES['flat_enter_'+id]&&NODES['flat_after_'+id],id+': viewing scenes');
 assert.equal(NODES['flat_after_'+id].next,'rental_hub_'+id);
 assert.deepEqual(new Set(hub.choices.map(choice=>choice.tone)),new Set(['practical','friendship','romance']));
 for(const mode of ['terms','friends','flirt']){
  const choice=hub.choices.find(c=>c.next==='rental_'+mode+'_'+id);assert.ok(choice,id+'/'+mode);
  assert.equal(choice.effect.rentalBond,mode==='terms'?'practical':mode==='friends'?'friendship':'romance','the viewing bond is generic until the lease is signed');
  assert.equal(NODES[choice.next].next,mode==='flirt'?'flat_coffee':'flat_decision');
 }
}
for(let day=1;day<=15;day++)for(const owner of ids){
 const target='evening'+day+'_'+owner;
 const c=NODES['evening'+day+'_meet'].choices.find(c=>c.next===target);
 assert.equal(choiceVisible(c,{}),false);assert.equal(choiceVisible(c,{['rentalKnown_'+owner]:true}),true);
 assert.equal(rentalRedirect('previous',CHAPTERS[day-1].start,{route15:true,rentalCast:'new',districtOwner:owner}),CHAPTERS[day-1].start);
}
for(const [id,node]of Object.entries(NODES).filter(([id])=>id.startsWith('rental_'))){
 for(const page of node.pages){
  assert.ok(Object.hasOwn(dictionary,page.text),id+': missing exact English page translation');
  assert.ok(!page.text.includes('{r}'),id+': unsupported gender placeholder');
 }
 for(const choice of node.choices??[])assert.ok(Object.hasOwn(dictionary,choice.label),id+': missing exact English choice translation');
}
for(const ending of ['stay','leave','return'])for(const owner of ids){
 const page=NODES['route_epilogue_'+ending].pages[1];assert.ok(pageText(page,{routeEndingWith:owner},'ru'));assert.ok(pageText(page,{routeEndingWith:owner},'en'));
}
