// Records which legacy scenes this branch revised, so tests/living-art.test.mjs can still prove that
// every other scene, ID, page index and effect is byte-for-byte what main shipped.
// Usage: node tools/make-branch-revisions.mjs <path to a checkout of the baseline main>
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const baseDir=process.argv[2];
if(!baseDir)throw Error('Pass the baseline checkout directory');
const strip=nodes=>JSON.parse(JSON.stringify(nodes),(key,value)=>['bg','districtBg','reactions'].includes(key)?undefined:value);
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const base=strip((await import(pathToFileURL(baseDir+'/public/story.js').href)).NODES);
const next=strip((await import(new URL('../public/story.js',import.meta.url))).NODES);
const revised={},added=[];
for(const id of Object.keys(next)){
  if(!Object.hasOwn(base,id)){added.push(id);continue;}
  if(JSON.stringify(base[id])!==JSON.stringify(next[id]))revised[id]={afterHash:digest(next[id]),before:base[id]};
}
for(const id of Object.keys(base))if(!Object.hasOwn(next,id))throw Error('A scene ID was removed: '+id);
fs.writeFileSync(new URL('../tests/fixtures/branch-revisions.json',import.meta.url),JSON.stringify({revised,added},null,1)+'\n');
console.log('revised',Object.keys(revised).length,'added',added.length);
console.log(Object.keys(revised).join(' '));
