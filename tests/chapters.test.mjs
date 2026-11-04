import assert from 'node:assert/strict';
import {NODES,JOURNAL,START,STORY_VERSION} from '../public/story.js';
import {CHAPTERS,rememberChapter,restartChapter,readChapterMarks,chapterFor,continuationFor} from '../public/chapters.js';
import {normalizeProgress} from '../lib/save-format.js';
const state={formatVersion:1,storyVersion:STORY_VERSION,profile:{gender:'female',nameId:'anna'},node:START,index:0,flags:{...NODES[START].effectOnEnter},journal:[...NODES[START].journal],log:[],rewind:[]};
rememberChapter(state,NODES);assert.equal(state.chapterMarks.arrival.logLength,0);assert.equal(restartChapter(state,'districts',NODES),false);
for(const c of CHAPTERS.slice(1)){
 state.log.push({speaker:'player',text:c.title});state.node=c.start;state.index=0;Object.assign(state.flags,NODES[c.start].effectOnEnter);state.flags['visited_'+c.id]=true;rememberChapter(state,NODES);
}
const stored=normalizeProgress(state);assert.equal(Object.keys(stored.chapterMarks).length,15);assert.equal(chapterFor(stored,NODES).id,'answer');
assert.equal(restartChapter(stored,'temporary',NODES),true);assert.equal(stored.node,'road_start');assert.equal(stored.flags.visited_answer,undefined);assert.equal(stored.flags.dayDone,1);assert.deepEqual(Object.keys(stored.chapterMarks),['arrival','temporary']);
assert.equal(restartChapter(stored,'arrival',NODES),true);assert.equal(stored.node,START);assert.equal(stored.flags.route15,true);assert.equal(stored.flags.rentalCast,'new');assert.equal(stored.flags.visited_temporary,undefined);assert.equal(stored.log.length,0);assert.deepEqual(stored.journal,NODES[START].journal);
assert.deepEqual(readChapterMarks({districts:{node:'road_start',index:0,flags:{},journal:[],logLength:0}},NODES,JOURNAL,20),{});
assert.deepEqual(readChapterMarks({arrival:{node:START,index:0,flags:{nested:{}},journal:[],logLength:0}},NODES,JOURNAL,20),{});
assert.equal(continuationFor({flags:{dayDone:14}}),'route15_start');assert.equal(chapterFor({node:'end',flags:{dayDone:15}},NODES).id,'answer');
