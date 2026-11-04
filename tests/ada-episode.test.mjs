import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES, JOURNAL, BACKGROUNDS, CHARACTER_SPRITES, presentationFor} from '../public/story.js';
import {choiceVisible} from '../public/romance.js';

const ids = ['ada_tired','ada_arrive','ada_pick','ada_pebbles','ada_bridge','ada_melon_pebbles','ada_melon_bridge','ada_home'];
for (const id of ids) {
  assert.equal(NODES[id].chapterId, 'ada', id);
  assert.ok(NODES[id].pages.length <= 5, id);
  assert.ok(fs.existsSync(new URL('../public/assets/' + NODES[id].bg + '.webp', import.meta.url)), NODES[id].bg);
}
for (const id of ['date_slow','date_friends']) assert.equal(NODES[id].next, 'ada_tired');
assert.equal(NODES.date_messages.next, 'chapter_three_close', 'staying home does not force a trip to Ada');
assert.equal(NODES.nikola_park_decline.next, 'ada_tired');
for (const id of ['date_kiss','date_hand']) {
  assert.equal(NODES[id].next, null);
  assert.ok(NODES[id].choices.some(choice => choice.next === 'nikola_park'));
  assert.ok(NODES[id].choices.some(choice => choice.next === 'ada_tired'));
}
assert.equal(NODES.ada_home.next, 'evening7');
assert.equal(NODES.chapter_three_close.next, 'third_morning');
assert.equal(NODES.ada_pebbles.next, 'ada_melon_pebbles');
assert.equal(NODES.ada_bridge.next, 'ada_melon_bridge');
assert.equal(NODES.ada_pebbles.bg, 'ada-lana-tower-v1');
assert.equal(NODES.ada_bridge.bg, 'ada-nenad-bridge-v1');
assert.equal(NODES.ada_melon_pebbles.bg, 'ada-melon-cafe-v1');
assert.equal(NODES.ada_melon_bridge.bg, 'ada-melon-cafe-v1');
assert.match(JSON.stringify(NODES.ada_pebbles.pages), /арбуз/i);
assert.match(JSON.stringify(NODES.ada_bridge.pages), /лубениц/i);
assert.match(JSON.stringify(NODES.ada_melon_pebbles.pages), /делю|Делить|берёт свою долю|делит дольку/i);
assert.match(JSON.stringify(NODES.ada_melon_bridge.pages), /делю|Делить|берёт свою долю|делит дольку/i);
assert.match(JSON.stringify(NODES.ada_melon_pebbles.pages), /дольк/i);
assert.match(JSON.stringify(NODES.ada_melon_bridge.pages), /дольк/i);
assert.match(JSON.stringify(NODES.ada_tired.pages), /без новых планов|просто устал/i);
assert.match(JOURNAL.ada_rest.text, /без новых планов|просто полежать/i);
assert.equal(JOURNAL.ada_rest.tag, 'ГЛАВА 3 · АДА');
assert.equal(presentationFor(NODES.ada_pebbles, NODES.ada_pebbles.pages[1], {adaWith:'alone', companion:'milica'}).character, null);
assert.equal(NODES.ada_pebbles.pages[1].speaker, 'Лана');
assert.equal(NODES.ada_bridge.pages[1].speaker, 'Ненад');
assert.equal(NODES.ada_melon_pebbles.pages[1].speaker, 'Боян');
assert.equal(NODES.ada_melon_bridge.pages[1].speaker, 'Весна');
assert.equal(presentationFor(NODES.ada_arrive, NODES.ada_arrive.pages[2], {adaWith:'nikola', companion:'nikola'}).character, 'nikola');
assert.equal(presentationFor(NODES.ada_arrive, NODES.ada_arrive.pages[2], {adaWith:'nikola', companion:'nikola'}).emotion, 'swim');
assert.equal(presentationFor(NODES.ada_arrive, NODES.ada_arrive.pages[2], {adaWith:'milica', companion:'milica'}).character, 'milica');
assert.equal(presentationFor(NODES.ada_home, NODES.ada_home.pages[1], {adaWith:'alone', companion:'nikola'}).character, null);
assert.equal(CHARACTER_SPRITES.nikola.swim.file, 'nikola-swim-short-buzz-v3');
for (const file of ['nikola-swim-short-buzz-v3','milica-swim-v1','dragan-swim-v1','jelena-swim-v1','ana-swim-v1','stefan-swim-v1','marko-swim-v1','vuk-swim-v1']) {
  assert.ok(fs.existsSync(new URL('../public/assets/' + file + '.webp', import.meta.url)), file);
}
const tired = NODES.ada_tired.choices;
const visible = flags => tired.filter(choice => choiceVisible(choice, flags)).map(choice => choice.effect.adaWith);
assert.deepEqual(visible({}), ['alone']);
assert.deepEqual(visible({companion:'nikola', nikolaBond:'friendship'}), ['alone','nikola']);
assert.deepEqual(visible({companion:'milica', milicaBond:'romance'}), ['alone','milica']);
assert.ok(!visible({companion:'nikola', nikolaBond:'practical'}).includes('nikola'));
assert.deepEqual(visible({host:'jelena', hostBond:'friendship'}), ['alone','jelena']);
assert.deepEqual(visible({host:'dragan', hostBond:'romance', districtOwner:'dragan', districtBond:'friendship'}), ['alone','dragan']);
assert.deepEqual(visible({host:'dragan', hostBond:'practical', districtOwner:'jelena', districtBond:'romance'}), ['alone','jelena']);
assert.deepEqual(visible({host:'dragan', hostBond:'friendship', districtOwner:'jelena', districtBond:'romance'}), ['alone','dragan','jelena']);
assert.deepEqual(visible({rentalCast:'new', rentalBond_ana:'romance', rentalBond_vuk:'friendship'}), ['alone','ana','vuk']);
assert.ok(!visible({rentalCast:'new', rentalBond_stefan:'practical'}).includes('stefan'));
assert.equal(NODES.ada_tired.choices.find(choice => choice.effect.adaWith==='alone').tone, 'personal');
assert.equal(BACKGROUNDS['ada-lake-v1'].label, 'АДА · ОЗЕРО');
console.log('Ada episode: rest, not a date; company follows existing bonds; both shores, both lifeguards and watermelon are on the way home.');
