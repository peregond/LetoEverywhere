// The approved story reset isolates version-1 positions and preserves old device data.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeProgress} from '../lib/save-format.js';
import {NODES,STORY_VERSION} from '../public/story.js';
import {rememberChapter,restartChapter} from '../public/chapters.js';
import {rememberStep,rewindStep} from '../public/rewind.js';
import {applyFlatEffect,setViewMask} from '../public/flat-data.js';
const save=(node,index,flags={})=>({formatVersion:1,storyVersion:STORY_VERSION,profile:{gender:'female',nameId:'anna'},node,index,flags,journal:[],log:[],rewind:[]});
assert.throws(()=>normalizeProgress({...save('quick_arrival',0),storyVersion:1}),/версия/);
for(const [id,node]of Object.entries(NODES).filter(([,n])=>n.activeRoute)){
 const state=normalizeProgress(save(id,node.pages.length-1,{route15:true,rentalCast:'new'}));assert.equal(state.node,id);assert.equal(state.index,node.pages.length-1);
}
const storage=fs.readFileSync(new URL('../public/storage.js',import.meta.url),'utf8');assert.match(storage,/serbian-summer-save-v2/);assert.match(storage,/auto-v2/);assert.doesNotMatch(storage,/removeItem|deleteDatabase/);
const state=normalizeProgress(save('flat_enter_ana',4,{rentalCast:'new',route15:true,host:'dragan'}));rememberChapter(state,NODES);rememberStep(state);applyFlatEffect(state.flags,{flatEnter:'ana'});setViewMask(state.flags,5);state.flags.flatDiscount=50;
assert.equal(rewindStep(state),true);assert.equal(state.flags.flatQuest,undefined);assert.equal(state.flags.flatDiscount,undefined);
Object.assign(state.flags,{districtOwner:'ana',rentalMoved:true});assert.equal(restartChapter(state,'districts',NODES),true);assert.equal(state.flags.rentalMoved,undefined);assert.equal(state.flags.host,'dragan');
