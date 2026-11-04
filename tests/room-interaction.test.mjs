import assert from 'node:assert/strict';
import{ROOM_TASKS,completeRoomTask}from'../public/room-interaction.js';
const orders=[[1,2,4],[1,4,2],[2,1,4],[2,4,1],[4,1,2],[4,2,1]];
for(const order of orders){let mask=0;for(const bit of order){const before=mask;mask=completeRoomTask(mask,bit);assert.equal(completeRoomTask(mask,bit),mask,'Repeated clicks do not undo a completed task');assert.equal(mask&before,before);}assert.equal(mask,7);}
assert.equal(new Set(ROOM_TASKS.map(task=>task.id)).size,3);
for(const task of ROOM_TASKS){const r=task.rect;assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=1&&r.y+r.height<=1);}
console.log('All six room-task orders, repeated clicks and image-relative target bounds checked.');

// Each visible hotspot controls just its own image layer, including after restoring a partial save.
const {mountArrivalQuest}=await import('../public/room-interaction.js');
class Element {
 constructor(tag,doc){this.tag=tag;this.ownerDocument=doc;this.children=[];this.style={};this.dataset={};this.attributes={};this.listeners={};this.hidden=false;this.clientWidth=390;this.clientHeight=780;}
 append(...items){this.children.push(...items);}
 replaceChildren(...items){this.children=[...items];}
 setAttribute(key,value){this.attributes[key]=value;}
 addEventListener(key,fn){this.listeners[key]=fn;}
 click(){this.listeners.click?.();}
}
const doc={createElement:tag=>new Element(tag,doc)};const root=new Element('section',doc);let savedMask=0;
const dispose=mountArrivalQuest(root,{mask:1,onChange:value=>savedMask=value,onComplete:()=>{},onBack:()=>{},onSettings:()=>{},canRewind:true});
const stage=root.children[0],byClass=part=>stage.children.find(e=>e.className?.includes(part));
const key=stage.children.find(e=>e.dataset.task==='key'),phone=stage.children.find(e=>e.dataset.task==='phone');
assert.equal(key.hidden,true,'A completed key remains visible as artwork after restoring');
assert.equal(byClass('reveal-key').hidden,false);assert.equal(byClass('reveal-phone').hidden,true);
phone.click();assert.equal(savedMask,3);assert.equal(phone.hidden,true);assert.equal(byClass('reveal-phone').hidden,false);
assert.equal(byClass('reveal-case').hidden,true,'Other tasks do not change');dispose();
// A completed or restored quest waits for the player instead of advancing on its own.
for(const mode of ['arrival','bedtime']){
 const questRoot=new Element('section',doc);let advanced=0;
 const cleanup=mountArrivalQuest(questRoot,{mode,mask:7,onChange:()=>{},onComplete:()=>advanced++,onBack:()=>{},onSettings:()=>{},canRewind:true});
 const next=questRoot.children.find(e=>e.className?.includes('room-quest-next'));
 assert.equal(next.hidden,false);assert.equal(advanced,0,'No automatic continuation after restoring 3/3');
 next.click();assert.equal(advanced,1,'The player chooses when to continue');cleanup();
}
