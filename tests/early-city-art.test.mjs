import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES, BACKGROUNDS, CHARACTER_SPRITES, presentationFor} from '../public/story.js';
import {EARLY_BACKGROUNDS} from '../public/early-city-art.js';

const frame = (id, index, flags = {}) => presentationFor(NODES[id], NODES[id].pages[index], flags);
for (const id of Object.keys(EARLY_BACKGROUNDS)) {
  assert.equal(BACKGROUNDS[id].label, EARLY_BACKGROUNDS[id].label);
  assert.ok(fs.existsSync(new URL('../public/assets/' + id + '.webp', import.meta.url)), id);
}
assert.equal(frame('road_start', 2).bg, 'belgrade-taxi-blocks-v2');
assert.equal(frame('road_start', 3).bg, 'belgrade-taxi-sava-glare-v1');
assert.equal(frame('road_start', 3).location, 'БЕЛГРАД · САВА');
assert.equal(frame('road_window', 2).bg, 'belgrade-slavija-drive-v1');
assert.equal(frame('host_old_town', 0).bg, 'skadarlija-evening-v1');
assert.equal(frame('host_old_town', NODES.host_old_town.pages.length - 1).bg, 'skadarlija-kafana-v1');
assert.equal(frame('host_terrace', 0).bg, 'skadarlija-kafana-v1');
assert.equal(frame('host_terrace_meal', 1).bg, 'skadarlija-kafana-v1');
assert.equal(frame('host_old_town', 1, {host:'jelena'}).character, 'jelena');
assert.equal(frame('host_old_town', 1, {host:'jelena'}).emotion, 'evening-friendly');
assert.equal(frame('host_old_town', 1, {host:'dragan'}).emotion, 'evening-friendly');
assert.equal(CHARACTER_SPRITES.jelena['evening-laughing'].file, 'jelena-stroll-laughing-v1');
assert.equal(frame('date_friends', 0, {companion:'milica'}).bg, 'knez-mihailova-evening-v1');
assert.equal(frame('date_river', 0, {companion:'nikola'}).bg, 'sava-branko-promenade-v1');
assert.equal(frame('date_hand', 1, {companion:'milica'}).bg, 'sava-branko-promenade-v1');
assert.equal(frame('date_slow', 2).bg, 'riverside-evening');
assert.equal(frame('district_dorcol', 0, {district:'dorcol', districtOwner:'jelena'}).bg, 'dorcol-kalemegdan-v1');
assert.equal(frame('district_vracar', 0, {district:'vracar', districtOwner:'dragan'}).bg, 'vracar-saint-sava-v1');
assert.equal(frame('district_newbelgrade', 0, {district:'newbelgrade', districtOwner:'jelena'}).bg, 'new-belgrade-blocks-v1');
assert.equal(frame('flat_enter_ana', 0, {districtOwner:'ana'}).bg, 'dorcol-kalemegdan-v1');
assert.equal(frame('flat_enter_stefan', 0, {districtOwner:'stefan'}).bg, 'dorcol-workshop-court-v1');
assert.equal(frame('flat_enter_marko', 0, {districtOwner:'marko'}).bg, 'vracar-saint-sava-v1');
assert.equal(frame('flat_enter_vuk', 0, {districtOwner:'vuk'}).bg, 'new-belgrade-blocks-v1');
assert.equal(frame('flat_enter_vuk', 0, {districtOwner:'vuk'}).emotion, 'arrival','Vuk wears headphones when the narration describes them');
assert.equal(CHARACTER_SPRITES.vuk.arrival.file,'vuk-headphones-v2','Both arrival frames use the matching Adidas shirt');
assert.ok(fs.existsSync(new URL('../public/assets/vuk-headphones-v2.webp',import.meta.url)));
assert.equal(frame('flat_enter_ana', 1, {districtOwner:'ana'}).character, 'ana');
assert.equal(frame('flat_enter_ana', 1, {districtOwner:'ana'}).emotion, 'arrival');
assert.equal(frame('flat_enter_stefan', 1, {districtOwner:'stefan'}).emotion, 'arrival');
assert.equal(frame('flat_enter_marko', 1, {districtOwner:'marko'}).emotion, 'arrival');
assert.equal(frame('flat_enter_vuk', 1, {districtOwner:'vuk'}).emotion, 'arrival');
assert.equal(frame('flat_enter_vuk', 4, {districtOwner:'vuk'}).character, 'asya');
assert.equal(frame('flat_enter_vuk', 4, {districtOwner:'vuk'}).emotion, 'pointing');
assert.equal(frame('flat_move_day', NODES.flat_move_day.pages.length - 1).bg, 'belgrade-waterfront-taxi-v1');
assert.equal(frame('nikola_directions', 1).character, 'nikola');
assert.equal(frame('nikola_directions', 1).emotion, 'guide');
assert.equal(frame('nikola_goodbye', 1).emotion, 'napkin');
assert.equal(frame('milica_hello', 2).emotion, 'show');
const farewell = NODES.exit.pages.findIndex(page => page.text.includes('Вечернее солнце'));
assert.ok(farewell >= 0);
assert.equal(frame('exit', farewell).emotion, 'wave');
assert.equal(frame('river_meeting', 1, {companion:'nikola'}).emotion, 'wave');
assert.equal(frame('river_meeting', 1, {companion:'nikola'}).character, 'nikola-evening');
assert.equal(frame('river_meeting', 1, {companion:'milica'}).emotion, 'riverside');
assert.equal(frame('date_river', 1, {companion:'milica'}).emotion, 'riverside');
for (const file of ['nikola-guide-buzz-v3','nikola-napkin-buzz-v3','milica-show-v1','milica-wave-v1','milica-riverside-v1','nikola-evening-wave-buzz-v3','jelena-stroll-friendly-v1','jelena-stroll-thoughtful-v1','jelena-stroll-laughing-v1','jelena-stroll-flirty-v1','asya-pointing-v1','ana-camera-v1','stefan-workshop-v1','marko-door-v1','vuk-headphones-v1']) {
  assert.ok(fs.existsSync(new URL('../public/assets/' + file + '.webp', import.meta.url)), file);
}
console.log('Early city art: 12 Belgrade backgrounds and 15 poses are staged in the prologue, day 0 and day 1.');

for(const owner of ['ana','stefan','marko','vuk']){const node=NODES['flat_enter_'+owner];const intro=presentationFor(node,{speaker:'narrator',text:'Вот и Ася',character:'asya',emotion:'friendly'},{districtOwner:owner});assert.equal(intro.character,'asya','Asya appears during her first introduction');assert.ok(CHARACTER_SPRITES.asya[intro.emotion]);}
