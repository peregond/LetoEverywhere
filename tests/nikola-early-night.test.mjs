import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,BACKGROUNDS,JOURNAL,presentationFor} from '../public/story.js';
import {choiceVisible} from '../public/romance.js';
import {NIKOLA_EARLY_NIGHT_BACKGROUNDS} from '../public/nikola-early-night.js';

const parkChoice=NODES.date_kiss.choices.find(c=>c.next==='nikola_park');
const homeChoice=NODES.date_kiss.choices.find(c=>c.next==='ada_tired');
assert.ok(parkChoice);assert.ok(homeChoice);
assert.match(parkChoice.label,/поехать к нему|his place/i);
assert.deepEqual(NODES.date_hand.choices.map(c=>c.next).sort(),NODES.date_kiss.choices.map(c=>c.next).sort());

assert.equal(choiceVisible(parkChoice,{companion:'nikola'},{gender:'male'}),true);
assert.equal(choiceVisible(parkChoice,{companion:'nikola'},{gender:'female'}),false);
assert.equal(choiceVisible(parkChoice,{companion:'milica'},{gender:'male'}),false);
assert.equal(choiceVisible(homeChoice,{companion:'milica'},{gender:'female'}),true);
assert.equal(NODES.nikola_park.bg,'riverside-evening');
assert.equal(NODES.nikola_park_invite.bg,'belgrade-tram-stop-evening-v1');
assert.equal(NODES.nikola_park_decline.bg,'belgrade-tram-stop-evening-v1');
assert.match(JOURNAL.nikola_early_night.text,/у реки|riverside/i);

const chain=['nikola_park','nikola_park_invite','nikola_park_home','nikola_park_door','nikola_park_closer','nikola_park_prep','nikola_park_sex','nikola_park_cum_inside','nikola_park_cum_jock','nikola_park_cum_chest','nikola_park_afterglow','nikola_park_morning','nikola_park_decline'];
for(const id of chain)assert.ok(NODES[id],id);

assert.equal(NODES.nikola_park_closer.adult,true);
assert.equal(NODES.nikola_park_closer.skipTo,'nikola_park_morning');
assert.equal(NODES.nikola_park_sex.adult,true);
assert.equal(NODES.nikola_park_morning.next,'third_morning');
assert.equal(NODES.nikola_park_morning.effectOnEnter.chapterThreeComplete,true);
assert.equal(NODES.nikola_park_decline.next,'ada_tired');
assert.ok(JOURNAL.nikola_early_night);

for(const file of Object.keys(NIKOLA_EARLY_NIGHT_BACKGROUNDS))assert.ok(BACKGROUNDS[file],file);
for(const id of chain)for(const page of NODES[id].pages??[{}]){
 const bg=presentationFor(NODES[id],page,{}).bg;
 assert.ok(fs.existsSync(new URL(`../public/assets/${bg}.webp`,import.meta.url)),`${id}: missing ${bg}.webp`);
}
assert.equal(presentationFor(NODES.nikola_park_sex,NODES.nikola_park_sex.pages[0],{}).bg,'nikola-bed-moan-v1');
assert.equal(presentationFor(NODES.nikola_park_sex,NODES.nikola_park_sex.pages[1],{}).bg,'nikola-climax-face-v1');
assert.equal(presentationFor(NODES.nikola_park_cum_inside,NODES.nikola_park_cum_inside.pages[0],{}).bg,'nikola-after-bliss-v1');
assert.equal(presentationFor(NODES.nikola_park_closer,NODES.nikola_park_closer.pages[0],{}).bg,'nikola-briefs-bed-smile-v1');
assert.equal(presentationFor(NODES.nikola_park_door,NODES.nikola_park_door.pages[0],{}).bg,'nikola-door-kiss-v1');
assert.equal(NODES.nikola_park_sex.choices.length,3);
assert.deepEqual(NODES.nikola_park_sex.choices.map(c=>c.effect.nikolaFinish).sort(),['chest','inside','jock']);
// Full-bleed CG pages must not stack the standing Nikola sprite.
for(const id of ['nikola_park_door','nikola_park_closer','nikola_park_prep','nikola_park_sex','nikola_park_cum_inside','nikola_park_cum_jock','nikola_park_cum_chest','nikola_park_afterglow']){
 for(const [index,page] of NODES[id].pages.entries()){
  assert.equal(presentationFor(NODES[id],page,{companion:'nikola'},{gender:'male'}).character,null,`${id}:${index}`);
 }
}

// Prologue nikola_invite must remain the bakery scene, not the park branch.
assert.match(NODES.nikola_invite.bg,/^bakery/);
assert.equal(NODES.nikola_invite.pages.length,5);
assert.notEqual(NODES.nikola_invite.next,'nikola_park_home');

console.log('Nikola early night: entry gates, adult skip, climax branches, art registry and prologue ID safety checked.');
