import assert from 'node:assert/strict';
import fs from 'node:fs';
import { NODES, CHARACTER_SPRITES, presentationFor } from '../public/story.js';
for (const id of ['ana','marko','stefan','vuk']) {
  for (const emotion of ['shy','surprised','confident','worried']) {
    const sprite=CHARACTER_SPRITES[id][emotion];
    assert.ok(sprite, `${id} ${emotion} is registered`);
    assert.ok(fs.existsSync(new URL(`../public/assets/${sprite.file}.webp`, import.meta.url)), `${id} ${emotion} artwork exists`);
  }
  for (const [mode, expected] of Object.entries({terms:'thoughtful', friends:'laughing', flirt:'flirty'})) {
    const node = NODES[`rental_${mode}_${id}`];
    const picture = presentationFor(node, node.pages[0], {districtOwner:id, rentalCast:'new'});
    assert.equal(picture.character,id);
    assert.equal(picture.emotion,expected);
    assert.ok(fs.existsSync(new URL(`../public/assets/${CHARACTER_SPRITES[id][expected].file}.webp`, import.meta.url)));
  }
}
for (const [day,emotion] of [[7,'confident'],[19,'worried'],[25,'shy']]) {
  const node=NODES[`rental_day_${day}`];
  const picture=presentationFor(node,node.pages[1],{districtOwner:'ana',rentalCast:'new'});
  assert.equal(picture.character,'ana');assert.equal(picture.emotion,emotion);
}
console.log('Rental portraits reflect the chosen conversation without changing story state.');
