import assert from 'node:assert/strict';
import {NODES,JOURNAL,presentationFor,pageText} from '../public/story.js';
import {ART_FRAMES} from '../public/art-framing.js';
assert.equal(NODES.host_flirt.pages.length,5,'Old saves keep all five entry page indices');
assert.equal(NODES.district_romance.pages.length,4,'Later viewing save indices stay valid');
assert.equal(NODES.keys_room.choices[0].next,'host_flirt');
assert.match(NODES.keys_room.choices[0].label,/здесь, на кухне/);
assert.equal(NODES.host_flirt.next,'host_coffee_pour');
assert.equal(NODES.host_friend.next,'room_alone');
assert.equal(NODES.host_practical.next,'room_alone');
assert.equal(NODES.host_coffee_borrowed.next,'room_alone');
assert.equal(NODES.host_coffee_stay.next,'host_coffee_lend','The romantic conversation leads to the dry clothing choice');
assert.match(NODES.host_coffee_spill.pages[0].text,/спотыкаюсь и падаю/);
assert.equal(NODES.host_coffee_comfort.choices.length,2,'The player can leave or release the hand');
for(const host of ['dragan','jelena'])for(const node of Object.values(NODES))for(const page of node.pages){
 const p=presentationFor(node,page,{host,districtOwner:host});
 if(p.composite){assert.ok(ART_FRAMES[p.bg],p.bg+' needs protected head bounds');assert.equal(p.character,null,'Composite frames must not have a second standing portrait');}
}
assert.match(pageText(NODES.host_coffee_comfort.pages[1],{host:'jelena'}),/не обожглась/);
assert.match(pageText(NODES.host_coffee_change.pages[2],{host:'dragan'}),/татуировка/);
assert.match(pageText(NODES.host_coffee_lend.pages[0],{host:'dragan'}),/Under Armour/);
assert.equal(NODES.host_coffee_lend.pages[0].speaker,'narrator');
assert.match(pageText(NODES.host_coffee_borrowed.pages[0],{host:'jelena'}),/СПБГУ 2008/);
assert.ok(JOURNAL.host_coffee&&JOURNAL.borrowed_top);
console.log('Optional kitchen route: both hosts, hand reassurance, clothing choice, old save indices and protected image bounds checked.');

for(const host of ['dragan','jelena']){for(const id of ['host_coffee_pour','host_coffee_spill','host_coffee_comfort','host_coffee_change','host_coffee_wait','host_coffee_borrowed']){for(const page of NODES[id].pages){const p=presentationFor(NODES[id],page,{host});assert.equal(p.bg,host==='dragan'&&['kitchen-waiting','kitchen-spill','kitchen-comfort'].includes(p.emotion)?'kitchen-seated-layer-v1':'kitchen-common-layer-v1');assert.equal(p.character,host);assert.equal(p.composite,false);assert.ok(p.emotion.startsWith('kitchen-'));}}assert.equal(presentationFor(NODES.host_flirt,NODES.host_flirt.pages[3],{host}).emotion,'kitchen-waiting');assert.equal(presentationFor(NODES.host_coffee_change,NODES.host_coffee_change.pages[0],{host}).emotion,'kitchen-soft');assert.equal(presentationFor(NODES.host_coffee_change,NODES.host_coffee_change.pages[2],{host}).emotion,'kitchen-dry');}
for(const color of ['grey','white']){
 const dressing=presentationFor(NODES.host_coffee_lend,NODES.host_coffee_lend.pages[2],{host:'dragan',hostTop:color});
 assert.equal(dressing.emotion,`kitchen-dressing-${color}`);
 const frame=presentationFor(NODES.host_coffee_borrowed,NODES.host_coffee_borrowed.pages[0],{host:'dragan',hostTop:color});
 assert.equal(frame.bg,'kitchen-seated-layer-v1');
 assert.equal(frame.emotion,`kitchen-borrowed-${color}`);
 assert.equal(frame.occludeTable,false);
}
