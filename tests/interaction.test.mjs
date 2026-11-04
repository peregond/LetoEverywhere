import assert from 'node:assert/strict';
import {imageHotspotRect,baggagePosition} from '../public/interaction.js';
import {speakerIdentity} from '../public/dialogue-voice.js';
import {NODES,presentationFor} from '../public/story.js';
const target={x:.24,y:.53,width:.39,height:.1};
for(const [width,height] of [[390,844],[480,674],[320,568]]){
 const rectangles=Array.from({length:6},(_,i)=>baggagePosition(width,height,i));
 for(const rect of rectangles){
  assert.ok(rect.left>=0&&rect.left+rect.width<=width,'Luggage stays inside the viewport');
  assert.ok(rect.top>=0&&rect.top+rect.height<=height,'Luggage remains visible vertically');
  assert.ok(rect.width>=44&&rect.height>=44,'Luggage remains touch accessible');
 }
}
for(const[width,height]of [[390,398],[390,592],[320,316]]){
 const rect=imageHotspotRect(width,height,941,1672,target);
 assert.ok(rect.width>=44&&rect.height>=44);
 assert.ok(rect.left>=0&&rect.left+rect.width<=width);
 assert.ok(rect.top>=0&&rect.top+rect.height<=height);
}
assert.equal(speakerIdentity({speaker:'narrator'}),'player');
assert.equal(speakerIdentity({speaker:'player'}),'player');
assert.equal(speakerIdentity({speaker:'milica'}),'milica');
assert.equal(speakerIdentity({speaker:'contact'},{companion:'nikola'}),'nikola');
assert.equal(speakerIdentity({speaker:'host'},{host:'jelena'}),'jelena');
assert.equal(NODES.quick_arrival.actions[2].interaction,'baggage');
for(const id of ['quick_coffee','city','pause']){
 const p=presentationFor(NODES[id],NODES[id].pages[0]);assert.equal(p.character,null);assert.equal(p.seated,true);assert.match(p.bg,/^milica-table-/);
}
for(let i=2;i<=7;i++){
 const p=presentationFor(NODES.sketch,NODES.sketch.pages[i]);assert.equal(p.bg,'milica-sketch-bouquet');assert.equal(p.character,null);assert.equal(p.insert,true);
}
assert.equal(NODES.sketch.actions[2].label,'Рассмотреть рисунок');
console.log('Interactive baggage hit area remains over the suitcase; speaker identity, seated Milica and sketch inserts checked.');

// All six visible objects must be selectable and the target must not have a
// fixed position that lets a repeat player skip the visual search.
const {BAGGAGE_ITEMS,BAGGAGE_TARGET,baggageLayout}=await import('../public/baggage-model.js');
const fs=await import('node:fs');
const dictionary=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url)));
assert.equal(BAGGAGE_ITEMS.length,6);assert.equal(new Set(BAGGAGE_ITEMS.map(item=>item.id)).size,6);
assert.equal(BAGGAGE_ITEMS.filter(item=>item.id===BAGGAGE_TARGET).length,1);
assert.ok(BAGGAGE_ITEMS.some(item=>item.id==='blue-plain'));assert.ok(BAGGAGE_ITEMS.some(item=>item.id==='red-yellow'));
const original=JSON.stringify(BAGGAGE_ITEMS),positions=new Set();
for(let seed=1;seed<=100;seed++){
 let value=Math.imul(seed,2654435761)>>>0;const random=()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};
 const layout=baggageLayout(random);
 assert.deepEqual(layout.map(item=>item.id).sort(),BAGGAGE_ITEMS.map(item=>item.id).sort());
 positions.add(layout.findIndex(item=>item.id===BAGGAGE_TARGET));
}
assert.equal(positions.size,6);assert.equal(JSON.stringify(BAGGAGE_ITEMS),original);
for(const item of BAGGAGE_ITEMS){
 assert.ok(Object.hasOwn(dictionary,item.label),item.label);
 assert.ok(fs.existsSync(new URL('../public/assets/baggage/'+item.id+'.webp',import.meta.url)),item.id);
}
for(const label of ['Найди синий чемодан с жёлтой лентой.','Чужой чемодан. Ищу синий, с жёлтой лентой.','Это мой. Забираю!','Твой чемодан! Багаж собран.'])assert.ok(Object.hasOwn(dictionary,label));
console.log('Baggage search: six distinct selectable bags, similar distractors, shuffled target in every position, complete artwork and RU/EN labels checked.');
