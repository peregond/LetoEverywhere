import assert from 'node:assert/strict';
import {NODES,presentationFor,pageText} from '../public/story.js';
import fs from 'node:fs';
import {eligibleHomeCast,HOME_PORTRAITS} from '../public/home-hero-model.js';
for(const [id,day]of [['route2_mask',2],['route5_mask',5],['route5_mask_name',5],['route11_start',11],['route11_walk',11]]){
 const n=NODES[id];assert.equal(n.routeDay,day);assert.ok(n.pages.some(p=>p.character==='milos-masked'));
 for(const p of n.pages)if(p.character==='milos-masked')assert.equal(presentationFor(n,p,{}).character,'milos-masked');
 assert.doesNotMatch(JSON.stringify(n.pages),/Милош|без балаклав|снимает.*маск|открытое лицо/);
}
assert.ok(NODES.route11_start.choices.some(c=>c.tone==='romance'));assert.ok(NODES.route11_start.choices.some(c=>c.tone==='friendship'));assert.ok(NODES.route11_start.choices.some(c=>c.tone==='personal'));
assert.ok(eligibleHomeCast({flags:{maskMet:true}}).includes('milos'));assert.match(HOME_PORTRAITS.milos.file,/masked/);
assert.match(JSON.stringify(NODES.route11_start.pages),/документах я не обещаю ничего/);
const firstMeeting=NODES.route5_mask.pages[0];
assert.doesNotMatch(pageText(firstMeeting,{},'ru'),/снова|узнаёт/);
assert.match(pageText(firstMeeting,{maskMet:true},'ru'),/снова.*узнаёт/);
const english=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url)));
assert.doesNotMatch(english[firstMeeting.byFlag.text.default],/again|recognises/);
assert.match(english[firstMeeting.byFlag.text.true],/again.*recognises/);
for(const c of NODES.route5_mask.choices)assert.equal(c.effect.maskMet,true);
const dayEleven=NODES.route11_start.pages[0];
assert.doesNotMatch(pageText(dayEleven,{},'ru'),/знакомого|узнаёт/);
assert.match(pageText(dayEleven,{maskMet:true},'ru'),/знакомого.*узнаёт/);
for(const c of NODES.route11_start.choices)assert.equal(c.effect.maskMet,true);
