import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mountFlatSettleQuest,SETTLE_AREAS,SETTLE_TASKS} from '../public/flat-settle-quest.js';
import {NODES,beatActionAt} from '../public/story.js';
class Element{constructor(doc){this.ownerDocument=doc;this.children=[];this.style={};this.dataset={};this.attributes={};this.listeners={};this.clientWidth=390;this.clientHeight=780;this.hidden=false;}append(...items){this.children.push(...items);}replaceChildren(...items){this.children=[...items];}setAttribute(k,v){this.attributes[k]=v;}addEventListener(k,fn){this.listeners[k]=fn;}click(){this.listeners.click?.();}}
const doc={createElement:()=>new Element(doc)};
for(const district of Object.keys(SETTLE_AREAS)){
 for(const status of ['start','done'])assert.ok(fs.existsSync(new URL(`../public/assets/flat-settle-${district}-${status}-v1.webp`,import.meta.url)));
 const root=new Element(doc);let saved=1,completed=0;
 const dispose=mountFlatSettleQuest(root,{district,mask:saved,onChange:value=>saved=value,onComplete:()=>completed++,onBack:()=>{},onSettings:()=>{},canRewind:true});
 const stage=root.children[0],buttons=stage.children.filter(child=>child.dataset.task),next=root.children.at(-1);
 assert.equal(buttons.length,3);assert.equal(buttons.find(b=>b.dataset.task==='case').hidden,true,'Partial progress is restored');assert.equal(next.hidden,true);
 for(const id of ['key','router'])buttons.find(b=>b.dataset.task===id).click();
 assert.equal(saved,7);assert.equal(next.hidden,false);assert.equal(completed,0);next.click();assert.equal(completed,1,'Continue is explicit');
 dispose();
}
assert.deepEqual(SETTLE_TASKS.map(t=>t.bit).sort(),[1,2,4]);
assert.equal(beatActionAt(NODES.flat_settle,2).effect.rentalMoved,true,'The original moving-in consequences remain');
console.log('Apartment quest: all three layouts, partial saves, all actions and explicit continuation checked.');
