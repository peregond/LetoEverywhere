import assert from 'node:assert/strict';
import {NODES} from '../public/story.js';
import {sceneCode,resolveSceneReference,sceneLink} from '../public/scene-reference.js';
import {filterWorkshopEntries,paginateWorkshopEntries} from '../public/workshop-library.js';
const ids=Object.keys(NODES);
assert.equal(new Set(ids.map(sceneCode)).size,ids.length,'Scene codes must be unique');
for(const id of ids){assert.equal(resolveSceneReference(NODES,sceneCode(id).toLowerCase()),id);assert.equal(resolveSceneReference(NODES,id),id);}
assert.equal(resolveSceneReference(NODES,'missing-scene'),null);
assert.equal(sceneCode('example'),sceneCode('example'));
assert.equal(sceneLink(ids[0],'https://example.com/?old=1#hash'),'https://example.com/?scene='+sceneCode(ids[0]));
const entries=[{file:'smile.png',character:'nikola',status:'active',look:'work',category:'characters'},{file:'old.png',character:'nikola',status:'archive',look:'work',category:'characters'},{file:'room.png',status:'asset',category:'backgrounds'}];
const before=JSON.stringify(entries);
assert.deepEqual(filterWorkshopEntries(entries,{characterIds:['nikola']}),[entries[0]]);
assert.deepEqual(filterWorkshopEntries(entries,{view:'assets',status:'archive'}),[entries[1]]);
assert.deepEqual(filterWorkshopEntries(entries,{view:'backgrounds'}),[entries[2]]);
assert.deepEqual(filterWorkshopEntries(entries,{view:'assets',query:'SMILE'}),[entries[0]]);
assert.deepEqual(paginateWorkshopEntries(entries,2),{items:entries.slice(0,2),total:3,hasMore:true});
assert.equal(JSON.stringify(entries),before);
