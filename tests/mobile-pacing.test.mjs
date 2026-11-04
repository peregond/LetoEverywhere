import assert from 'node:assert/strict';
import {START,NODES,beatActionAt,CHARACTER_SPRITES} from '../public/story.js';
let gates=0,max=0;
for(const[id,node]of Object.entries(NODES)){
 let run=0;
 for(let index=0;index<node.pages.length;index++){
  run++;
  const action=beatActionAt(node,index);
  if(action){gates++;assert.ok(action.label&&action.kind);if(action.kind==='checklist')assert.ok(action.items.length>1);for(const option of action.options??[])if(option.next)assert.ok(NODES[option.next]);}
  if(action||(node.choices&&index===node.pages.length-1)){max=Math.max(max,run);assert.ok(run<=5,id+': '+run+' реплик');run=0;}
 }
 assert.equal(run,0,'No action at node exit: '+id);
}
assert.equal(max,5);assert.ok(gates>100);
for(const id of ['nikola_compliment','nikola_flirt','nikola_invite'])assert.ok(NODES[id].choices.some(c=>c.next.startsWith('nikola_daydream')),id+' must offer the fantasy');
for(const id of ['nikola_daydream','nikola_daydream_early'])assert.equal(NODES[id].pages.length,1,'active airport fantasies stay brief');
for(const id of ['milica','dragan','jelena','nikola-evening'])assert.ok(Object.keys(CHARACTER_SPRITES[id]).length>=4);
console.log(`${gates} конкретных действий; максимум ${max} реплик подряд в обеих частях. Ранний и поздний флирт с фантазией, возврат в форму и эмоции проверены.`);

assert.equal(START,'quick_arrival');
assert.equal(NODES[START].pages.length,3);
for(const [id,character]of [['quick_nikola','nikola'],['quick_milica','milica']]){
 assert.ok(NODES.quick_baggage.choices.some(c=>c.next===id));
 assert.ok(NODES[id].pages.some(p=>p.speaker===character));
 assert.ok(NODES[id].choices.some(c=>c.tone==='romance'));
 assert.ok(NODES[id].choices.some(c=>c.tone==='friendship'));
}
assert.equal(NODES[START].next,'quick_baggage');
assert.equal(NODES.quick_baggage.choices.length,2);
assert.ok(!NODES.quick_baggage.choices.some(c=>c.next==='airport_apron'));
console.log('Багаж и таможня предшествуют знакомству; повторного вступления нет.');
for(const id of ['nikola_dream_cream','nikola_dream_coffee'])assert.equal(NODES[id].pages.length,1);
assert.equal(NODES.quick_nikola.choices[2].effect.nikolaBond,'friendship');
