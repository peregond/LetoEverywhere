import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,JOURNAL,START,BACKGROUNDS,CHARACTER_SPRITES,CHOICE_TONES,presentationFor,pageText,resolveStoryText,interpolate} from '../public/story.js';
const catalog=JSON.parse(fs.readFileSync(new URL('../public/names.json',import.meta.url)));
let count=0;
for(const [id,node]of Object.entries(NODES).filter(([,n])=>n.activeRoute)){
 count++;assert.ok(node.pages.length);assert.ok(node.chapterId);for(const j of node.journal??[])assert.ok(JOURNAL[j],id);
 for(const page of node.pages)for(const companion of ['milica','nikola'])for(const host of ['dragan','jelena']){
  const flags={companion,host,districtOwner:'ana',routeTravelWith:companion};const p=presentationFor(node,page,flags);assert.ok(BACKGROUNDS[p.bg],id);assert.ok(fs.existsSync(new URL('../public/assets/'+p.bg+'.webp',import.meta.url)),p.bg);
  if(p.character){const art=CHARACTER_SPRITES[p.character]?.[p.emotion];assert.ok(art,id+'/'+p.character+'/'+p.emotion);assert.ok(fs.existsSync(new URL('../public/assets/'+art.file+'.webp',import.meta.url)),art.file);}
  for(const gender of ['male','female'])for(const name of catalog.genders[gender].names){const rendered=interpolate(pageText(page,flags),{gender,nameId:name.id},catalog);assert.ok(rendered.trim(),id);assert.doesNotMatch(rendered,/[{}]|лсяа|лся а|готова а/,id);}
 }
 for(const c of node.choices??[]){assert.ok(CHOICE_TONES[c.tone],id);assert.doesNotMatch(interpolate(resolveStoryText(c.label,{}),{gender:'female',nameId:'anna'},catalog),/[{}]/);}
}
assert.ok(count>500);assert.equal(START,'quick_arrival');assert.equal(NODES.district_map.choices.length,3);console.log(`${count} active scenes: assets, speaker variants, both genders and all names checked.`);
