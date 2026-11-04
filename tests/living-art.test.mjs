import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {NODES,BACKGROUNDS,CHARACTER_SPRITES,presentationFor,STORY_VERSION} from '../public/story.js';
import {REGULAR_MOODS,LIVING_BACKGROUND_SCENES,STORY_BACKGROUNDS} from '../public/living-art.js';
import {PEOPLE,buildArtCatalog} from '../public/workshop-model.js';
// Baseline 90fe350: all 445 scene IDs, page order/text, effects, actions and transitions.
// Only background selection, reaction metadata and the explicitly approved
// mother-contact edits in fixtures/mother-edits.json may differ.
const canonical=JSON.parse(JSON.stringify(NODES),(key,value)=>['bg','districtBg','reactions'].includes(key)?undefined:value);
// Scenes this branch revised on purpose (tools/make-branch-revisions.mjs): each must match its recorded new version exactly,
// then the baseline from main is restored so that the older fixtures and the final digest still prove everything else is untouched.
const branch=JSON.parse(fs.readFileSync(new URL('./fixtures/branch-revisions.json',import.meta.url)));
const digestOf=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
for(const [id,{afterHash,before}]of Object.entries(branch.revised)){assert.equal(digestOf(canonical[id]),afterHash,id+': revised scene differs from its recorded version');canonical[id]=before;}
for(const id of branch.added){assert.ok(canonical[id],id+': new scene');delete canonical[id];}
for(const edit of [...JSON.parse(fs.readFileSync(new URL('./fixtures/mother-edits.json',import.meta.url))),...JSON.parse(fs.readFileSync(new URL('./fixtures/prologue-ui-edits.json',import.meta.url)))]){
 assert.deepEqual(canonical[edit.id].pages[edit.index][edit.field],edit.after,edit.id+': approved text edit');
 canonical[edit.id].pages[edit.index][edit.field]=edit.before;
}
// Preserve the complete original snapshot while admitting the reviewed additions
// already published in upstream main (a4133da), with reflections appended after
// legacy cameos for save compatibility; every new scene/field is hashed.
const upstream=JSON.parse(fs.readFileSync(new URL('./fixtures/upstream-romance.json',import.meta.url)));
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
for(const[id,hash]of Object.entries(upstream.addedScenes)){assert.equal(digest(canonical[id]),hash,id+': approved upstream scene');delete canonical[id];}
for(const edit of upstream.changes){
 if(edit.path[1]==='pages'){
  const dialogue=pages=>JSON.parse(JSON.stringify(pages),(key,value)=>key==='action'?undefined:value);
  assert.deepEqual(dialogue(canonical[edit.path[0]].pages.slice(0,edit.before.length)),dialogue(edit.before),edit.path[0]+': all legacy dialogue indices remain intact');
 }
 const parent=edit.path.slice(0,-1).reduce((value,key)=>value[key],canonical);const key=edit.path.at(-1);
 if(edit.afterMissing)assert.equal(Object.hasOwn(parent,key),false,edit.path.join('.')+': approved upstream removal');else assert.equal(digest(parent[key]),edit.afterHash,edit.path.join('.')+': approved upstream edit');
 if(edit.beforeExists)parent[key]=edit.before;else delete parent[key];
}
// Restore the original object order for the legacy byte-for-byte digest.
for(const edit of upstream.changes.filter(edit=>edit.afterMissing)){
 const parent=edit.path.slice(0,-1).reduce((value,key)=>value[key],canonical);const values={...parent};for(const key of Object.keys(parent))delete parent[key];for(const key of edit.beforeKeys)if(Object.hasOwn(values,key))parent[key]=values[key];
}
// New rental introductions are separate scenes; their routes and translations
// are checked in rental-story-integrity.test.mjs. The original three choices
// receive exactly one eligibility condition, and four new ones are added.
// (This branch's later changes to the map are restored above; housing.test.mjs checks the current map.)
const rentalChoices=canonical.district_map.choices;
assert.equal(rentalChoices.length,7);
for(const choice of rentalChoices.slice(0,3))assert.deepEqual(choice.when,{flag:'rentalCast',notEquals:'new'});
for(const choice of rentalChoices.slice(3))assert.deepEqual(choice.when,{flag:'rentalCast',equals:'new'});
assert.deepEqual(rentalChoices.slice(3).map(choice=>choice.effect.districtOwner).sort(),['ana','marko','stefan','vuk']);
canonical.district_map.choices=rentalChoices.slice(0,3).map(choice=>{const copy={...choice};delete copy.when;return copy;});
for(const id of Object.keys(canonical))if(id.startsWith('rental_')||id.startsWith('flat_')||/^(adult_evening\d+_|evening\d+_|route4_group_)/.test(id))delete canonical[id];
assert.equal(canonical.d20_nephew.pages[1].speaker,'host','Miloš remains related to the first host');
canonical.d20_nephew.pages[1].speaker='districtHost';
// The merged baseline includes eight scenes that existed only on the live Site.
assert.equal(createHash('sha256').update(JSON.stringify(canonical)).digest('hex'),'bb1aeb7dc0acbd3836f8bfce46f2e95af5bb383603081edcf245180c9c625013');
assert.equal(STORY_VERSION,2);
const files=JSON.parse(fs.readFileSync(new URL('../public/art-assets.json',import.meta.url)));
const catalog=buildArtCatalog(files,CHARACTER_SPRITES,BACKGROUNDS);
for(const id of Object.keys(PEOPLE)){
 const art=REGULAR_MOODS.map(mood=>CHARACTER_SPRITES[id]?.[mood]?.file);
 assert.equal(new Set(art).size,8,id+' needs a distinct illustration per regular emotion');
 for(const file of art)assert.ok(files.includes(file+'.webp'),id+'/'+file);
 assert.deepEqual(catalog.people.find(p=>p.id===id).missing,[],id);
}
for(const[bg,ids]of Object.entries(LIVING_BACKGROUND_SCENES)){
 assert.ok(files.includes(bg+'.webp'));
 for(const id of ids)for(const district of ['dorcol','vracar','newbelgrade'])assert.equal(presentationFor(NODES[id],NODES[id].pages[0],{district}).bg,bg);
}
for(const bg of Object.keys(STORY_BACKGROUNDS))assert.equal(catalog.entries.find(e=>e.file===bg+'.webp').category,'backgrounds');
const frame=(id,index,flags)=>presentationFor(NODES[id],NODES[id].pages[index],flags);
assert.equal(frame('d17_lazar',1,{bankSpark:'lazar'}).character,'lazar');
assert.equal(frame('d17_teodora',1,{bankSpark:'teodora'}).character,'teodora');
assert.equal(frame('d20_ivana',1,{mupSpark:'ivana'}).character,'ivana');
assert.equal(frame('d20_strahinya',1,{mupSpark:'strahinya'}).character,'strahinja');
const masked=NODES.d4_station.pages.findIndex(p=>p.speaker==='Человек в балаклаве');
assert.ok(masked>=0);assert.equal(frame('d4_station',masked,{}).character,'milos-masked');
assert.equal(frame('d4_station',masked,{maskedRevealed:true}).character,'milos-masked','Replaying a masked scene must not reveal his face');
assert.equal(frame('d20_nephew_end',0,{}).character,'milos-masked','The kitchen text explicitly describes a uniform');
assert.equal(frame('d27_milos',0,{}).character,'milos-masked','The riverside text explicitly describes casual clothing');
console.log('Living art: eight distinct regular moods for eleven heroes, staged backgrounds, dynamic office portraits, masked/uniform/casual continuity and unchanged story/save semantics checked.');
