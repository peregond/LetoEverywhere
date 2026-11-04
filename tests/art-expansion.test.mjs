import assert from 'node:assert/strict';
import fs from 'node:fs';
import { NODES, BACKGROUNDS, CHARACTER_SPRITES, presentationFor, STORY_VERSION } from '../public/story.js';
import { BACKGROUND_SCENES, EXPANDED_BACKGROUNDS } from '../public/art-expansion.js';
import { buildArtCatalog } from '../public/workshop-model.js';

const files = JSON.parse(fs.readFileSync(new URL('../public/art-assets.json', import.meta.url)));
const catalog = buildArtCatalog(files, CHARACTER_SPRITES, BACKGROUNDS);
assert.equal(STORY_VERSION, 2);
assert.equal(Object.keys(EXPANDED_BACKGROUNDS).length, 4);
for (const [bg, ids] of Object.entries(BACKGROUND_SCENES)) {
  assert.ok(files.includes(bg + '.webp'), bg);
  assert.equal(catalog.entries.find(e => e.file === bg + '.webp').category, 'backgrounds');
  for (const id of ids) {
    for (const district of ['dorcol', 'vracar', 'newbelgrade']) {
      for (const page of NODES[id].pages) {
        assert.equal(presentationFor(NODES[id], page, { district, districtOwner: 'jelena', host: 'dragan' }).bg, page.bg ?? bg, id);
      }
    }
  }
}
for (const person of catalog.people.filter(p => p.id !== 'nikola')) {
  for (const emotion of ['shy', 'surprised']) {
    const prefix = person.id === 'milos' ? 'milos-casual' : person.id;
    const art = person.art.find(e => e.file === 'workshop/' + prefix + '-' + emotion + '-draft.webp');
    assert.ok(art, person.id + '/' + emotion);
    assert.equal(art.emotion, emotion);
    assert.equal(art.status, 'draft');
  }
}
console.log('Four backgrounds stage correctly across district variants; ten heroes have separate shy and surprised drafts; story version 2 keeps the existing artwork registry.');
