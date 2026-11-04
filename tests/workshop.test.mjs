import assert from 'node:assert/strict';
import fs from 'node:fs';
import { acceptsWorkshopCode, buildArtCatalog, PEOPLE, EMOTIONS } from '../public/workshop-model.js';
import { CHARACTER_SPRITES, BACKGROUNDS, NODES } from '../public/story.js';

assert.ok(acceptsWorkshopCode('грызуны'));
assert.ok(acceptsWorkshopCode('  ГРЫЗУНЫ  '));
for (const invalid of ['', 'грызун', 'xгрызуны', 'грызуныx', null, 123]) assert.equal(acceptsWorkshopCode(invalid), false);
const files = JSON.parse(fs.readFileSync(new URL('../public/art-assets.json', import.meta.url)));
for (const file of files) assert.ok(fs.existsSync(new URL('../public/assets/' + file, import.meta.url)), file);
const before = JSON.stringify({ CHARACTER_SPRITES, BACKGROUNDS, NODES });
const catalog = buildArtCatalog(files, CHARACTER_SPRITES, BACKGROUNDS);
assert.equal(JSON.stringify({ CHARACTER_SPRITES, BACKGROUNDS, NODES }), before, 'Browsing must never mutate story data');
assert.equal(catalog.people.length, 11);
const entry = file => catalog.entries.find(e => e.file === file);
for(const file of ['nikola-bedroom-seductive-v1.webp','nikola-briefs-touch-v2.webp','nikola-sex-moan-v1.webp','nikola-after-tender-v1.webp']){
  const item=entry(file);assert.equal(item.character,'nikola');assert.equal(item.look,'Интимные сцены · 18+');assert.equal(item.status,'active');assert.equal(item.emotion,null);
}
const intimacyDraft=entry('workshop/nikola-intimacy/nikola-intimacy-v1.png');
assert.equal(intimacyDraft.character,'nikola');assert.equal(intimacyDraft.look,'Интимные сцены · 18+');assert.equal(intimacyDraft.status,'draft');assert.equal(intimacyDraft.emotion,null);
assert.equal(entry('nikola-apartment-night-v1.webp').category,'backgrounds');
for(const [file,person,look] of [['ana-camera-v1.webp','ana','Сюжетная поза'],['ana-swim-v1.webp','ana','У воды'],['marko-door-v1.webp','marko','Сюжетная поза'],['stefan-workshop-v1.webp','stefan','Сюжетная поза'],['vuk-headphones-v2.webp','vuk','Сюжетная поза']]){
  assert.equal(entry(file).character,person);assert.equal(entry(file).status,'active');assert.equal(entry(file).look,look);assert.equal(entry(file).emotion,null);
}
assert.equal(entry('luka-reference-friendly-v3.webp').status, 'active');
assert.equal(entry('luka-friendly.webp').status, 'archive');
assert.equal(entry('nikola-evening-friendly-buzz-v3.webp').look, 'После смены');
assert.equal(entry('milica-table-laughing.webp').status, 'active');
assert.equal(entry('dragan-kitchen-comfort.webp').emotion, null, 'Scene artwork is not a facial expression');
assert.equal(entry('nikola-icon-32-buzz-v3.png').character, undefined, 'Icons are not portraits');
assert.equal(entry('prologue-theme.m4a').category, 'audio');
for (const id of ['lazar', 'teodora', 'ivana', 'strahinja', 'milos']) {
  const person = catalog.people.find(p => p.id === id);
  assert.ok(person.art.some(e => e.status === 'draft'), id);
  assert.deepEqual(person.missing, [], id + ': all four base expressions have artwork');
  for (const mood of ['friendly', 'thoughtful', 'laughing', 'flirty']) {
    assert.ok(person.art.some(e => e.status === 'draft' && e.emotion === mood && e.look !== 'На службе · riot-экипировка'), id + '/' + mood);
  }
}
assert.equal(entry('workshop/milos-two-looks-draft.webp').status, 'archive');
assert.equal(entry('workshop/milos-masked-friendly-v2-draft.webp').look, 'На службе · riot-экипировка');
assert.equal(entry('workshop/milos-casual-friendly-draft.webp').look, 'Без формы');
const summerVariants = catalog.entries.filter(e => e.file.includes('-dream-summer-'));
assert.equal(summerVariants.length, 11);
for (const id of Object.keys(PEOPLE)) {
  const variant = summerVariants.find(e => e.character === id);
  assert.ok(variant, id);
  assert.equal(variant.look, 'Фантазия');
  assert.equal(variant.status, 'draft', 'Wardrobe variants are not automatically used in scenes');
}
const fantasyOnly = buildArtCatalog(['workshop/luka-dream-summer-flirty-draft.webp'], {}, {}).people.find(p => p.id === 'luka');
assert.ok(fantasyOnly.missing.includes('flirty'), 'Fantasy artwork must not hide a missing regular expression');
const archiveOnly = buildArtCatalog(['luka-friendly.webp'], {}, {}).people.find(p => p.id === 'luka');
assert.ok(archiveOnly.missing.includes('friendly'), 'An archived portrait must not hide missing current artwork');
const translations = JSON.parse(fs.readFileSync(new URL('../public/locales/en.json', import.meta.url)));
for (const label of [...Object.values(PEOPLE), ...Object.values(EMOTIONS), 'Промокод', 'Мастерская', 'Чего не хватает', 'Сюжет', 'Персонажи, эмоции, ресурсы и внутренняя карта сюжета. Здесь можно смотреть изображения, пробелы в наборе и ID сцен.']) assert.ok(translations[label], label);
console.log('Workshop: promo entry, complete inventory, active/draft/archive status, expression gaps, translations and story immutability checked.');

const preparedUnderwear=catalog.people.filter(person=>person.underwear);
assert.deepEqual(preparedUnderwear.map(person=>person.id).sort(),['asya','jelena','luka']);
assert.equal(catalog.people.filter(person=>!person.underwear).length,8);
for(const person of preparedUnderwear){
 assert.equal(person.underwear.look,'Бельё');assert.equal(person.underwear.status,'draft');
 assert.equal(person.underwear.emotion,'friendly');assert.ok(files.includes(person.underwear.file));
}
const onlyUnderwear=buildArtCatalog(['workshop/milica-dream-underwear-friendly-draft.webp'],{},{}).people.find(p=>p.id==='milica');
assert.equal(onlyUnderwear.underwear.status,'draft');assert.ok(onlyUnderwear.missing.includes('friendly'),'An underwear variant must not hide missing ordinary artwork');
