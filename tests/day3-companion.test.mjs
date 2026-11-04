import assert from 'node:assert/strict';
import {NODES,presentationFor,pageText} from '../public/story.js';
for(const [companion,portrait] of [['nikola','nikola-evening'],['milica','milica']])for(const bond of ['friendship','romance']){
 const flags={companion,[companion+'Bond']:bond};
 for(const id of ['d3_start','d3_o1','d3_o2','d3_o3','d3_mid','d3_mobile_choice','d3_m2','d3_turn','d3_end']){
  const node=NODES[id];for(const [index,page] of node.pages.entries()){
   const p=presentationFor(node,page,flags);assert.equal(p.character,portrait,`${id}/${index}: the chosen companion stays present`);
  }
 }
 assert.equal(NODES.d3_turn.pages[1].speaker,'contact');
 assert.match(pageText(NODES.d3_o2.pages[3],flags),companion==='nikola'?/Николе кофе/:/Милице кофе/);
 for(const id of ['a1','yettel','mts'])assert.match(NODES['d3_mobile_'+id].pages[0].text,/Мы заходим/);
}
console.log('The chosen airport companion stays in day three for friendship and romance.');
