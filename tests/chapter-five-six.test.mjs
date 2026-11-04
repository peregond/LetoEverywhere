// Persistence bounds cover the active route, including evening and trip branches.
import assert from 'node:assert/strict';
import {NODES,START} from '../public/story.js';
import {MAX_FLAGS,MAX_LOG_RECORDS} from '../public/save-limits.js';
import {forwardTargets} from './graph-helpers.mjs';
const memo=new Map();function bounds(id){if(id==='end')return {flags:new Set(),logs:0};if(memo.has(id))return memo.get(id);const n=NODES[id],flags=new Set(Object.keys(n.effectOnEnter??{}));
 for(const p of n.pages)for(const key of Object.keys(p.action?.effect??{}))flags.add(key);
 for(const c of n.choices??[])for(const key of Object.keys(c.effect??{}))flags.add(key);
 const parts=forwardTargets(id).map(bounds);for(const part of parts)for(const key of part.flags)flags.add(key);
 const result={flags,logs:n.pages.length+Object.keys(n.actions??{}).length+(n.choices?1:0)+Math.max(0,...parts.map(p=>p.logs))};memo.set(id,result);return result;}
const result=bounds(START);assert.ok(result.flags.size+20<=MAX_FLAGS,`${result.flags.size} route flags plus identity/derived state`);assert.ok(result.logs+100<=MAX_LOG_RECORDS,`${result.logs} records plus flat revisits and acknowledgements`);
assert.equal(NODES.chapter_six_close.next,'evening9');assert.equal(NODES.courtyard_invite.routeDay,9);assert.equal(NODES.route5_start.routeDay,5);
console.log(`Persistence bounds: ${result.flags.size+20} flags / ${result.logs+100} records.`);
