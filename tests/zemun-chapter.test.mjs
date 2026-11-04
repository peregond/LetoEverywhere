import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES, JOURNAL, BACKGROUNDS, presentationFor} from '../public/story.js';

const chain = ['zemun_cobbles', 'zemun_gardos', 'zemun_quay'];
assert.equal(NODES.work_summary.next, 'zemun_cobbles');
assert.equal(NODES.zemun_cobbles.next, 'zemun_gardos');
assert.equal(NODES.zemun_gardos.next, 'zemun_quay');
assert.equal(NODES.zemun_quay.next, 'rain_break');
assert.equal(NODES.rain_break.bg, 'belgrade-rain-cafe');
assert.equal(NODES.chapter_four_close.next, 'd3_start');
assert.equal(NODES.chapter_four_close.pages.length, 4);
assert.equal(JOURNAL.zemun_walk.tag, 'ГЛАВА 4 · ЗЕМУН');
assert.match(JOURNAL.zemun_walk.text, /темп вечера|кафе на кее/i);
assert.equal(BACKGROUNDS['zemun-gardos-v2'].label, 'ЗЕМУН · ГАРДОШ');
const joined = chain.map(id => JSON.stringify(NODES[id].pages)).join('\n');
assert.match(joined, /брусчат/i);
assert.match(joined, /Гардош/);
assert.match(joined, /Дуна/);
assert.doesNotMatch(joined, /сплав/i);
for (const id of chain) {
  const node = NODES[id];
  assert.equal(node.chapterId, 'work', id);
  assert.ok(node.pages.length <= 5, id);
  assert.ok(fs.existsSync(new URL('../public/assets/' + node.bg + '.webp', import.meta.url)), node.bg);
  const speakers = node.pages.map(page => page.speaker);
  assert.ok(speakers.includes('Ася') && speakers.includes('Лука'), id);
}
assert.equal(presentationFor(NODES.zemun_cobbles, NODES.zemun_cobbles.pages[1], {}).character, 'asya');
assert.equal(presentationFor(NODES.zemun_gardos, NODES.zemun_gardos.pages[1], {}).character, 'luka');
assert.equal(presentationFor(NODES.zemun_quay, NODES.zemun_quay.pages[1], {}).bg, 'zemun-quay-v1');
console.log('Zemun walk: after the workshop, through the old streets, Gardoš and the Danube quay, then the rainy café.');
