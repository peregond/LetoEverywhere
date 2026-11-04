// Merges the English strings registered by story modules into public/locales/en.json.
// Existing translations are never overwritten: when a module registers a different English text for a Russian key that en.json
// already has, the reviewed en.json text stays and the difference is printed.
import fs from 'node:fs';
const target=new URL('../public/locales/en.json',import.meta.url);
const dictionary=JSON.parse(fs.readFileSync(target,'utf8'));
await import(new URL('../public/story.js',import.meta.url));
await import(new URL('../public/scene-quests.js?v=1',import.meta.url)); // browser-only modules register their own strings on load
// runs every extend*() function so registries are filled
const sources=await Promise.all(process.argv.slice(2).map(async name=>Object.values(await import(new URL('../public/'+name,import.meta.url))).filter(value=>value&&typeof value==='object'&&!Array.isArray(value))));
let added=0;const conflicts=[];
for(const group of sources.flat())for(const [ru,en]of Object.entries(group)){
  if(typeof en!=='string')continue;
  if(Object.hasOwn(dictionary,ru)){if(dictionary[ru]!==en)conflicts.push([ru,dictionary[ru],en]);continue;}
  dictionary[ru]=en;added++;
}
for(const [ru,old,next]of conflicts)console.warn('kept existing translation for',JSON.stringify(ru),'\n  en.json:',old,'\n  module: ',next);
fs.writeFileSync(target,JSON.stringify(dictionary,null,2)+'\n');
console.log('added',added);
