import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,BACKGROUNDS,presentationFor} from '../public/story.js';
for(const person of ['teodora','ivana','vuk'])for(const [suffix,pose] of person==='vuk'?[['_fade','soft']]:[['','arrival'],['_friend','conversation'],['_fade','soft']]){
 const art=`${person}-evening-${pose}-v1`;assert.ok(BACKGROUNDS[art]);assert.ok(fs.existsSync(new URL(`../public/assets/${art}.webp`,import.meta.url)));
 let found=0;for(let day=1;day<=15;day++){
  const node=NODES[`evening${day}_${person}${suffix}`];if(!node)continue;found++;
  for(const page of node.pages)for(const gender of ['male','female']){const p=presentationFor(node,page,{}, {gender});assert.equal(p.bg,art);assert.equal(p.character,null,'Composite art must not have a second portrait');}
 }assert.ok(found,`${person} ${suffix} has active scenes`);
}
console.log('Evening art is staged for both player profiles without an overlapping portrait.');
