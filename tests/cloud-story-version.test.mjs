import assert from 'node:assert/strict';
import {test} from 'node:test';
import {CloudProgress} from '../public/cloud.js';
import {STORY_VERSION} from '../public/story-version.js';
const values=new Map();globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};globalThis.window={addEventListener(){}};
const old={storyVersion:1,node:'d30_start',flags:{dayDone:29}},modern={storyVersion:STORY_VERSION,node:'quick_arrival',profile:{gender:'female',nameId:'anna'},flags:{route15:true}};
const replies=(progress)=>{let n=0;globalThis.fetch=async()=>({ok:true,json:async()=>n++===0?{user:{id:'alice'}}:{progress,revision:8,syncedAt:12}});};
test('GitHub Pages keeps progress on the device without requesting an account',async()=>{
 globalThis.location={hostname:'peregond.github.io'};let requests=0;globalThis.fetch=async()=>{requests++;throw Error('unexpected request');};
 const c=new CloudProgress({getLocal:()=>modern,restore:async()=>assert.fail('local only'),changed(){}});await c.refresh();
 assert.equal(c.localOnly,true);assert.equal(c.ready,true);assert.equal(c.message,'Сохранено на устройстве');assert.equal(requests,0);delete globalThis.location;
});
test('older cloud story is backed up and never restored into the new route',async()=>{
 replies(old);let restored=false;const c=new CloudProgress({getLocal:()=>null,restore:async()=>{restored=true;},changed(){}});await c.refresh();assert.equal(restored,false);assert.equal(c.revision,8);assert.equal(c.conflict,null);assert.match(c.message,/15 дней/);assert.deepEqual(JSON.parse(values.get('ss-previous-story-progress')),old);
});
test('a new local playthrough queues against the previous cloud revision',async()=>{
 values.clear();replies(old);const c=new CloudProgress({getLocal:()=>modern,restore:async()=>assert.fail('must not restore old story'),changed(){}});await c.refresh();clearTimeout(c.timer);assert.deepEqual(c.pending,modern);assert.equal(c.revision,8);assert.deepEqual(JSON.parse(values.get('ss-previous-story-progress')),old);
});
test('matching current cloud story restores normally',async()=>{
 values.clear();replies(modern);let restored;const c=new CloudProgress({getLocal:()=>null,restore:async save=>{restored=save;},changed(){}});await c.refresh();assert.deepEqual(restored,modern);assert.equal(c.message,'Загружено из аккаунта');
});
