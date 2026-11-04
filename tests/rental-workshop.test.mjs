import assert from 'node:assert/strict';
import {buildArtCatalog,RENTAL_PEOPLE,CORE_EMOTIONS} from '../public/workshop-model.js';

// One registered portrait is one emotion, not a complete eight-emotion set.
const files=Object.keys(RENTAL_PEOPLE).map(id=>`workshop/rental-${id}-sport-draft.webp`);
const sprites=Object.fromEntries(Object.keys(RENTAL_PEOPLE).map(id=>[id,{friendly:{file:`workshop/rental-${id}-sport-draft`}}]));
const catalog=buildArtCatalog(files,sprites,{});
assert.equal(catalog.people.length,11,'Existing main cast must remain distinct');
assert.equal(catalog.rentals.length,4);
for(const person of catalog.rentals){
 assert.equal(person.art.length,1);assert.equal(person.art[0].status,'active');
 assert.equal(person.art[0].emotion,'friendly');assert.equal(person.looks[0].activeCount,1);
 assert.deepEqual(person.missing,CORE_EMOTIONS.filter(mood=>mood!=='friendly'));
}
const drafts=buildArtCatalog(files,{},{}).rentals;
assert.ok(drafts.every(person=>person.art[0].status==='draft'));
console.log('Rental workshop: four separate people, active and draft states, seven honest emotion gaps.');
