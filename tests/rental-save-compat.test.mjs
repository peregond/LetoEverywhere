import assert from 'node:assert/strict';
import {normalizeProgress} from '../lib/save-format.js';
import {NODES,JOURNAL,START} from '../public/story.js';
import {CHAPTERS,readChapterMarks,rememberChapter,restartChapter} from '../public/chapters.js';
import {readRewind,rememberStep,rewindStep} from '../public/rewind.js';

const initial=flags=>({formatVersion:1,storyVersion:2,profile:{gender:'female',nameId:'anna'},node:START,index:0,flags:{...flags},journal:[],log:[],rewind:[],chapterMarks:{},completed:false});
for(const flags of [{},{rentalCast:'new'}]){
 const state=normalizeProgress(initial(flags));
 assert.equal(state.flags.rentalCast,flags.rentalCast,'save loading retains the story version, without inventing it for legacy saves');
 rememberChapter(state,NODES);const copied=readChapterMarks(state.chapterMarks,NODES,JOURNAL,state.log.length);
 assert.equal(copied.arrival.flags.rentalCast,flags.rentalCast,'chapter marks retain the story version');
 state.flags.host='dragan';state.flags.districtOwner='jelena';rememberStep(state);
 state.flags.districtOwner='marko';state.flags.districtBond='romance';
 const restored=readRewind(state.rewind,NODES,JOURNAL,state.log.length);
 assert.equal(restored[0].flags.rentalCast,flags.rentalCast);
 assert.equal(rewindStep(state),true);assert.equal(state.flags.districtOwner,'jelena');
 assert.equal(state.flags.districtBond,undefined);assert.equal(state.flags.rentalCast,flags.rentalCast);
 assert.equal(restartChapter(state,'arrival',NODES),true);
 assert.equal(state.node,CHAPTERS[0].start);assert.equal(state.flags.rentalCast,'new','restarting the prologue must preserve the selected story version');
 assert.equal(state.flags.districtOwner,undefined,'future choices are cleared on restart');
}
for(const id of ['ana','marko','vuk','stefan']){
 const flags={rentalCast:'new',districtOwner:id};
 assert.deepEqual(normalizeProgress(initial(flags)).flags,flags,'new identity remains in imported/exported save');
}
console.log('Rental save compatibility: new and legacy version markers, chapter marks, prologue restart, rewind, and all four owner IDs.');
