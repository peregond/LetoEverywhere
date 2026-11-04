import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HOME_BASE_CAST,HOME_PORTRAITS,HOME_BACKGROUNDS,eligibleHomeCast,selectHomeComposition} from '../public/home-hero-model.js';
import {buildArtCatalog} from '../public/workshop-model.js';

// Calendar progress, police encounters and romance slot availability cannot
// substitute for actually learning the masked man's identity.
for(const saved of [null,{}, {journal:['masked_patrol'],flags:{dayDone:30,maskedRevealed:true,romanceMilos:'lover'}}]){
 assert.deepEqual(eligibleHomeCast(saved),HOME_BASE_CAST);
 for(let seed=0;seed<200;seed++)assert.deepEqual([...selectHomeComposition(saved,{seed}).people].sort(),[...HOME_BASE_CAST].sort());
}
assert.ok(eligibleHomeCast({flags:{maskMet:true}}).includes('milos'));
assert.match(HOME_PORTRAITS.milos.file,/masked/);
const save={journal:['asya','luka','masked_patrol'],flags:{maskMet:true}};
const before=structuredClone(save),seen=new Set(),orders=new Set();
for(let seed=0;seed<200;seed++){
 const selection=selectHomeComposition(save,{seed});assert.equal(selection.people.length,5);assert.equal(new Set(selection.people).size,5);
 selection.people.forEach(id=>seen.add(id));orders.add(selection.people.join(','));
 assert.deepEqual(selection,selectHomeComposition(save,{seed}));
}
assert.deepEqual([...seen].sort(),Object.keys(HOME_PORTRAITS).sort());assert.ok(orders.size>20);assert.deepEqual(save,before);
assert.ok(!eligibleHomeCast({journal:['asya'],flags:{}}).includes('milos'),'earlier chapter replay hides the identity again');
for(const [hours,period]of [[[6,10],'morning'],[[11,18],'day'],[[0,5,19,23],'evening']])for(const hour of hours){const selection=selectHomeComposition(null,{hour});assert.equal(selection.period,period);assert.equal(selection.background,HOME_BACKGROUNDS[period]);}
const files=JSON.parse(fs.readFileSync(new URL('../public/art-assets.json',import.meta.url)));
const catalog=buildArtCatalog(files,{},{});
for(const file of [...Object.values(HOME_PORTRAITS).map(p=>p.file),...Object.values(HOME_BACKGROUNDS)]){
 assert.ok(fs.existsSync(new URL('../public/assets/'+file,import.meta.url)),file);
 assert.equal(catalog.entries.find(e=>e.file===file)?.status,'active',file);
}
for(const file of Object.values(HOME_BACKGROUNDS))assert.equal(catalog.entries.find(e=>e.file===file).category,'backgrounds');
console.log('Home hero: four/five separate layers, encounter and identity gates, varied deterministic compositions, clock lighting, gallery assets and save immutability passed.');
