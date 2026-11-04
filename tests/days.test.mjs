import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,START} from '../public/story.js';
import {DAYS,PRELUDE,dayFor} from '../public/days.js';
import {CHAPTERS,continuationFor,dayProgress} from '../public/chapters.js';
import {forwardTargets} from './graph-helpers.mjs';
assert.equal(DAYS.length,15);assert.deepEqual(PRELUDE,[]);
for(const key of ['id','title','start'])assert.equal(new Set(DAYS.map(d=>d[key])).size,15,key);
assert.deepEqual(CHAPTERS.map(c=>c.id),DAYS.map(d=>d.id));
for(const [i,d]of DAYS.entries()){assert.equal(d.n,i+1);assert.equal(dayFor(i+1),d);assert.equal(NODES[d.start].chapterId,d.id);assert.equal(NODES[d.start].effectOnEnter.dayDone,i);assert.equal(continuationFor({flags:{dayDone:i}}),d.start);}
assert.equal(continuationFor({flags:{dayDone:15}}),null);assert.equal(dayProgress({chapterFiveComplete:true}),0,'archived chapter flags do not unlock the new route');
const memo=new Map();function bound(id){if(id==='end')return 0;if(memo.has(id))return memo.get(id);const n=NODES[id];const text=n.pages.reduce((sum,p)=>sum+Math.max(...[p.text,...Object.values(p.byFlag?.text??{})].filter(x=>typeof x==='string').map(x=>x.length)),0);const result=text+Math.max(0,...forwardTargets(id).map(bound));memo.set(id,result);return result;}
assert.ok(bound(START)*1.5<500000);
const plan=fs.readFileSync(new URL('../DAYS.md',import.meta.url),'utf8');for(const d of DAYS)assert.ok(plan.includes(d.title),d.title);
