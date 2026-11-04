import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MOBILE_CARRIERS} from '../public/mobile-carriers.js';
import {NODES,presentationFor,beatActionAt,pageText} from '../public/story.js';
assert.deepEqual(NODES.d3_mobile_choice.choices.map(choice=>choice.label),['A1','Yettel','mts']);
for(const id of ['d3_o1','d3_o3'])assert.equal(NODES[id].next,'d3_o2','Every errand reaches the transport game');
assert.equal(NODES.d3_o2.next,'d3_mobile_choice','The game leads to the operator choice');
assert.equal(NODES.d3_o1.pages.length,2,'Existing saved page indices remain valid');
for(const carrier of MOBILE_CARRIERS){
 const choice=NODES.d3_mobile_choice.choices.find(c=>c.effect.mobileCarrier===carrier.id),node=NODES[choice.next];
 assert.equal(node.next,'d3_mid');assert.equal(node.chapterId,'day-3');assert.equal(node.carrierBrand,carrier.name);
 assert.ok(node.pages.some(p=>p.speaker===carrier.employee));
 for(const page of node.pages){const image=presentationFor(node,page);assert.equal(image.character,carrier.portrait);assert.equal(image.bg,carrier.background);}
 assert.equal(beatActionAt(node,node.pages.length-1)?.kind,'tap');
 for(const image of [carrier.background,carrier.portrait+'-v1'])assert.ok(fs.existsSync(new URL('../public/assets/'+image+'.webp',import.meta.url)));
}
assert.match(pageText(NODES.d3_mid.pages[0],{errand:'card'}),/обменник/);
assert.match(pageText(NODES.d3_mid.pages[0],{errand:'money'}),/наконец разобраны/);
console.log('All operator choices, staff, interiors, stored selection and return paths checked.');
