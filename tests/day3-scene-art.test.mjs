import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,BACKGROUNDS,CHARACTER_SPRITES,presentationFor} from '../public/story.js';
const image=(id,i,flags={})=>presentationFor(NODES[id],NODES[id].pages[i],flags);
for(const [id,i,bg] of [['d3_o1',0,'day3-stop-v1'],['d3_o2',1,'day3-stop-v1'],['d3_o2',3,'day3-coffee-kiosk-v1'],['d3_o3',0,'day3-exchange-v1'],['d3_mid',2,'day3-bus-v1'],['d3_m1',0,'belgrade-neighbourhood-bakery'],['d3_turn',0,'belgrade-tram-stop-evening-v1'],['d3_end',1,'day3-home-v1']]){
 assert.equal(image(id,i).bg,bg,`${id} page ${i}`);assert.ok(BACKGROUNDS[bg]);assert.ok(fs.existsSync(new URL(`../public/assets/${bg}.webp`,import.meta.url)),bg);
}
assert.equal(image('d3_mid',0,{errand:'money'}).bg,'belgrade-kiosk-street');
assert.equal(image('d3_mid',0,{errand:'phone'}).bg,'day3-exchange-v1');
for(const companion of ['milica','nikola']){
 const character=companion==='milica'?'milica':'nikola-evening';
 for(const [id,i,pose] of [['d3_start',1,'phone'],['d3_o2',1,'directions'],['d3_mid',0,'phone'],['d3_end',1,'directions']]){
  const visual=image(id,i,{companion});assert.equal(visual.character,character);assert.equal(visual.emotion,'day3-'+pose);assert.ok(fs.existsSync(new URL(`../public/assets/${CHARACTER_SPRITES[character][visual.emotion].file}.webp`,import.meta.url)));
 }
 assert.equal(image('d3_o2',3,{companion}).emotion,'day3-coffee');
 assert.equal(image('d3_m1',1,{companion}).character,character,'The selected companion returns after buying bread');
}
for(const id of ['a1','yettel','mts']){const visual=image('d3_mobile_'+id,3);assert.equal(visual.emotion,'explaining');assert.ok(fs.existsSync(new URL(`../public/assets/${CHARACTER_SPRITES[visual.character].explaining.file}.webp`,import.meta.url)));}
console.log('Day three locations and character poses follow both companions, all operators and errand choices.');
