import {MOBILE_CARRIERS} from '../public/mobile-carriers.js';
import {RENTAL_NAMES} from '../public/rental-people.js';
import {EPISODIC_CAST} from '../public/episodic-cast.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import{NODES,BACKGROUNDS,CHARACTER_SPRITES,presentationFor}from'../public/story.js';
import{EXTRA_BACKGROUNDS,EXTRA_BACKGROUND_SCENES,PAGE_BACKGROUNDS}from'../public/abundant-art.js';
import{buildArtCatalog,CORE_EMOTIONS}from'../public/workshop-model.js';
const files=JSON.parse(fs.readFileSync(new URL('../public/art-assets.json',import.meta.url)));
const catalog=buildArtCatalog(files,CHARACTER_SPRITES,BACKGROUNDS);
assert.equal(CORE_EMOTIONS.length,8);
const looks=catalog.people.flatMap(person=>person.looks);
assert.equal(looks.length,14,'Eleven people, Nikola after work and two additional police outfits');
for(const look of looks){assert.deepEqual(look.missing,[],look.name);assert.deepEqual(look.missingInGame,[],look.name);assert.equal(look.activeCount,8,look.name);}
for(const person of Object.keys(CHARACTER_SPRITES)){
 if(MOBILE_CARRIERS.some(carrier=>carrier.portrait===person)){for(const mood of ['friendly','explaining'])assert.ok(files.includes(CHARACTER_SPRITES[person][mood].file+'.webp'));continue;}
 if(Object.hasOwn(RENTAL_NAMES,person))continue; // Rental portraits are works in progress, checked by rental-workshop.test.mjs.
 if(Object.hasOwn(EPISODIC_CAST,person)){
  assert.deepEqual(Object.keys(CHARACTER_SPRITES[person]),['friendly'],person+': supporting roles need a base portrait');
  assert.ok(files.includes(CHARACTER_SPRITES[person].friendly.file+'.webp'));continue;
 }
 const regular=CORE_EMOTIONS.map(mood=>CHARACTER_SPRITES[person][mood]?.file);
 assert.equal(new Set(regular).size,8,person+' needs different art per emotion');
 for(const file of regular)assert.ok(files.includes(file+'.webp'),file);
}
assert.equal(catalog.entries.find(e=>e.file==='workshop/milos-masked-friendly-v2-draft.webp').status,'active','A registered draft must not be labelled disconnected');
for(const[bg,ids]of Object.entries(EXTRA_BACKGROUND_SCENES))for(const id of ids){
 const pageIndex=PAGE_BACKGROUNDS.find(p=>p[0]===id&&p[1]===0)?1:0;
 const page=NODES[id].pages[pageIndex],frame=presentationFor(NODES[id],page),expected=page.bg??bg;assert.equal(frame.bg,expected,id);assert.equal(frame.location,BACKGROUNDS[expected].label,id+' location must follow the restaged image');
}
for(const[id,index,bg]of PAGE_BACKGROUNDS)assert.equal(presentationFor(NODES[id],NODES[id].pages[index]).bg,bg,id+':'+index);
for(const bg of Object.keys(EXTRA_BACKGROUNDS))assert.ok(files.includes(bg+'.webp'),bg);
const frame=(id,index,flags={})=>presentationFor(NODES[id],NODES[id].pages[index],flags);
assert.equal(frame('epilogue_leave',4).time,'Позже');
assert.equal(frame('d20_nephew_end',0,{maskEnd:'spark'}).emotion,'shy');
assert.equal(frame('d20_nephew_end',0,{maskEnd:'friend'}).emotion,'friendly','Friendship must not force a flirty portrait');
assert.equal(frame('d20_nephew',0).character,'milos-masked');
assert.equal(frame('d4_station_ask',0,{maskEnd:'spark'}).character,'milos-masked','A later romance must not unmask an earlier scene');
assert.equal(frame('d17_bank_talk',1,{bankSpark:'teodora'}).character,'teodora');
assert.equal(frame('d20_mup_talk',1,{mupSpark:'ivana'}).character,'ivana');
console.log('Abundant art: 14 complete eight-expression outfits, location labels, frame-specific backgrounds, continuity, friendly/romantic reveal and in-person narration checked.');
