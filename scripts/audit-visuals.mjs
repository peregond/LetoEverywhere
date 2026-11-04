import {BAGGAGE_ITEMS} from '../public/baggage-model.js';
import fs from 'node:fs';
import {NODES,BACKGROUNDS,CHARACTER_SPRITES,presentationFor} from '../public/story.js';
import {buildArtCatalog,CORE_EMOTIONS} from '../public/workshop-model.js';
import {HOME_PORTRAITS,HOME_BACKGROUNDS} from '../public/home-hero-model.js';
const root=new URL('../public/assets/',import.meta.url);
const files=JSON.parse(fs.readFileSync(new URL('../public/art-assets.json',import.meta.url)));
const catalog=buildArtCatalog(files,CHARACTER_SPRITES,BACKGROUNDS);
const missing=new Set();const stagedBackgrounds=new Set();const stagedPortraits=new Set();
for(const name of Object.keys(BACKGROUNDS))if(!fs.existsSync(new URL(name+'.webp',root)))missing.add(name+'.webp');
for(const looks of Object.values(CHARACTER_SPRITES))for(const sprite of Object.values(looks))if(!fs.existsSync(new URL(sprite.file+'.webp',root)))missing.add(sprite.file+'.webp');
for(const companion of ['milica','nikola'])for(const host of ['dragan','jelena'])for(const districtOwner of ['dragan','jelena'])for(const district of ['dorcol','vracar','newbelgrade'])for(const bankSpark of ['lazar','teodora'])for(const mupSpark of ['ivana','strahinya'])for(const maskEnd of ['spark','friend','secret']){
 const flags={companion,host,districtOwner,district,bankSpark,mupSpark,maskEnd};
 for(const[id,node]of Object.entries(NODES))for(const[index,page]of node.pages.entries()){
  const frame=presentationFor(node,page,flags);stagedBackgrounds.add(frame.bg);
  if(!BACKGROUNDS[frame.bg])missing.add('Unknown background '+id+':'+index+' '+frame.bg);
  if(frame.contactPortrait){const contact=frame.contactPortrait;if(!fs.existsSync(new URL(contact.file,root)))missing.add(contact.file);else stagedPortraits.add(contact.file.replace(/\.webp$/,''));}
  if(frame.character){const sprite=CHARACTER_SPRITES[frame.character]?.[frame.emotion];if(!sprite)missing.add('Unknown pose '+id+':'+index+' '+frame.character+'/'+frame.emotion);else stagedPortraits.add(sprite.file);}
 }
}
const interactiveAssets=['baggage/search-carousel.webp',...BAGGAGE_ITEMS.map(item=>'baggage/'+item.id+'.webp')];
for(const file of interactiveAssets)if(!fs.existsSync(new URL(file,root))||!files.includes(file))missing.add(file);
const homeAssets=[...Object.values(HOME_PORTRAITS).map(p=>p.file),...Object.values(HOME_BACKGROUNDS)];
for(const file of homeAssets)if(!fs.existsSync(new URL(file,root))||!files.includes(file))missing.add(file);
const outfits=catalog.people.flatMap(person=>person.looks.map(look=>({person:person.id,look:look.name,available:CORE_EMOTIONS.length-look.missing.length,registered:look.activeCount,missing:look.missing,notRegistered:look.missingInGame})));
const report={interactiveAssets,homeAssets,scenes:Object.keys(NODES).length,backgrounds:Object.keys(BACKGROUNDS).length,stagedBackgrounds:stagedBackgrounds.size,registeredPortraits:new Set(Object.values(CHARACTER_SPRITES).flatMap(looks=>Object.values(looks).map(s=>s.file))).size,stagedPortraits:stagedPortraits.size,regularEmotions:CORE_EMOTIONS,outfits,supporting:catalog.supporting.map(person=>({person:person.id,file:person.art.find(entry=>entry.status==='active')?.file??null,missing:person.missing})),underwear:catalog.people.map(person=>({person:person.id,file:person.underwear?.file??null})),missingAssets:[...missing].sort(),unstagedBackgrounds:Object.keys(BACKGROUNDS).filter(bg=>!stagedBackgrounds.has(bg))};
const json=JSON.stringify(report,null,2)+'\n';
if(process.argv.includes('--write'))fs.writeFileSync(new URL('../artwork/visual-audit.json',import.meta.url),json);else process.stdout.write(json);
if(report.missingAssets.length||report.unstagedBackgrounds.length||outfits.some(look=>look.missing.length||look.notRegistered.length)||catalog.supporting.some(person=>person.missing.length))process.exitCode=1;
