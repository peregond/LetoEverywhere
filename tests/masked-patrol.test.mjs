import assert from 'node:assert/strict';
import {NODES,presentationFor} from '../public/story.js';
import {eligibleHomeCast,HOME_PORTRAITS} from '../public/home-hero-model.js';
for(const [id,day]of [['route2_mask',2],['route5_mask',5],['route5_mask_name',5],['route11_start',11],['route11_walk',11]]){
 const n=NODES[id];assert.equal(n.routeDay,day);assert.ok(n.pages.some(p=>p.character==='milos-masked'));
 for(const p of n.pages)if(p.character==='milos-masked')assert.equal(presentationFor(n,p,{}).character,'milos-masked');
 assert.doesNotMatch(JSON.stringify(n.pages),/Милош|без балаклав|снимает.*маск|открытое лицо/);
}
assert.ok(NODES.route11_start.choices.some(c=>c.tone==='romance'));assert.ok(NODES.route11_start.choices.some(c=>c.tone==='friendship'));assert.ok(NODES.route11_start.choices.some(c=>c.tone==='personal'));
assert.ok(eligibleHomeCast({flags:{maskMet:true}}).includes('milos'));assert.match(HOME_PORTRAITS.milos.file,/masked/);
assert.match(JSON.stringify(NODES.route11_start.pages),/документах я не обещаю ничего/);
