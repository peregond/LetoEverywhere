import assert from 'node:assert/strict';
import fs from 'node:fs';
// Match the story's i18n module identity; asset cache versions need not equal the visible release version.
const {configureTranslations,detectLanguage,getLanguage,setLanguage,t,translateHistory}=await import('../public/i18n.js?v=0.16.1');
import {NODES,JOURNAL,BACKGROUNDS,CHARACTER_SPRITES,CHOICE_TONES,pageText,resolveStoryText,interpolate} from '../public/story.js';
import {CHAPTERS} from '../public/chapters.js';
const dictionary=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url)));
const catalog=JSON.parse(fs.readFileSync(new URL('../public/names.json',import.meta.url)));
configureTranslations(dictionary);
assert.equal(detectLanguage(null,['ru-RU','en-US']),'ru');
assert.equal(detectLanguage(null,['en-GB','ru']),'en');
assert.equal(detectLanguage(null,['sr-Latn-RS']),'en');
assert.equal(detectLanguage('ru',['en-US']),'ru');
assert.equal(detectLanguage('en',['ru-RU']),'en');
assert.equal(detectLanguage('bad',['RU-ru']),'ru');
assert.equal(detectLanguage(null,[]),'en');
const original=JSON.stringify(NODES),cyrillic=/[А-Яа-яЁё]/;
const missing=[];
function coverage(v,path=''){
 if(typeof v==='string'&&cyrillic.test(v)&&!Object.hasOwn(dictionary,v))missing.push(path+': '+v);
 else if(v&&typeof v==='object')for(const [key,value]of Object.entries(v))coverage(value,path+'.'+key);
}
coverage({NODES,JOURNAL,BACKGROUNDS,CHARACTER_SPRITES,CHOICE_TONES,CHAPTERS});
assert.deepEqual(missing,[],'Every authored story string needs a reviewed English translation');
setLanguage('en');
for(const gender of ['male','female'])for(const name of catalog.genders[gender].names){
 const profile={gender,nameId:name.id};
 for(const flags of [{companion:'milica',host:'dragan',districtOwner:'jelena'},{companion:'nikola',host:'jelena',districtOwner:'dragan',nikolaBond:'friendship',milicaBond:'friendship'}]){
  for(const [id,node]of Object.entries(NODES)){
   for(const [index,page]of node.pages.entries()){
    const en=interpolate(pageText(page,flags),profile,catalog);
    assert.ok(!cyrillic.test(en.replaceAll('СПБГУ 2008','')),`${id}:${index}: ${en}`);
    assert.ok(!/[{}]/.test(en),`${id}:${index}: unresolved token`);
   }
   for(const choice of node.choices??[])assert.ok(!cyrillic.test(interpolate(resolveStoryText(choice.label,flags),profile,catalog)),id+' choice');
  }
 }
}
assert.equal(JSON.stringify(NODES),original,'Translation must not mutate story IDs, effects or checkpoint data');
const profile={gender:'female',nameId:'alexandra'},flags={host:'jelena'};
const source='На мгновение в комнате становится очень тихо. Я уже готов{a} отшутиться, но {host} улыбается.';
const ru=interpolate(resolveStoryText(source,flags,'ru'),profile,catalog,'ru');
assert.equal(translateHistory(ru,profile,catalog),'The room goes very quiet for a moment. I am ready to turn it into a joke, but Jelena smiles.');
assert.equal(t('Версия 0.11.0'),'Version 0.11.0');
assert.equal(t('Глава 2 · Район для жизни · 32 реплик'),'Chapter 2 · A Neighbourhood to Call Home · 32 lines');
assert.equal(setLanguage('xx'),false);assert.equal(getLanguage(),'en');
setLanguage('ru');assert.equal(pageText(NODES.quick_arrival.pages[0]),NODES.quick_arrival.pages[0].text);
console.log('RU/EN: device defaults, manual overrides, all authored scenes, both genders and all names, save history and immutable story data checked.');

// Reported story continuity: intimacy affects the address, and visible props
// match the farewell replies. Keep the friendly route and save indices intact.
const dmitry={gender:'male',nameId:'dmitry'};
assert.match(interpolate(pageText(NODES.nikola_last.pages[1],{nikolaBond:'romance'}),dmitry,catalog),/«Дима,/);
assert.match(interpolate(pageText(NODES.nikola_last.pages[1],{nikolaBond:'friendship'}),dmitry,catalog),/«Дмитрий,/);
const replies=NODES.nikola_last.actions[5].options.map(o=>o.label);
assert.deepEqual(replies,['«Кифла спасла день. Спасибо!»','«Вернусь не только за кифлой»']);
assert.match(NODES.road_contact.pages[0].text,/селфи из такси/);
for(const p of NODES.road_contact.pages)assert.ok(!/пал(?:ец|ьца)/i.test(JSON.stringify(p)));
assert.equal(NODES.road_contact.pages.length,4);
setLanguage('en');
assert.match(interpolate(pageText(NODES.nikola_last.pages[1],{nikolaBond:'romance'}),dmitry,catalog),/Dima,/);
assert.match(interpolate(pageText(NODES.road_contact.pages[1],{companion:'nikola',nikolaBond:'romance'}),dmitry,catalog),/distracting me from work/);
assert.match(interpolate(pageText(NODES.road_contact.pages[1],{companion:'nikola',nikolaBond:'friendship'}),dmitry,catalog),/long day/);
setLanguage('ru');
