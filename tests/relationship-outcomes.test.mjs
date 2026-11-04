import assert from 'node:assert/strict';
import {test} from 'node:test';
import {NODES,pageText,STORY_VERSION} from '../public/story.js';
import {choiceVisible} from '../public/romance.js';
import {normalizeProgress} from '../lib/save-format.js';
for(const [id,kind] of [['lazar','bank'],['teodora','bank'],['ivana','papers'],['strahinya','papers']])test(id+' unlocks a lasting fictional outcome',()=>{
 const c=NODES.route15_start.choices.find(x=>x.next==='route15_help_'+id);assert.equal(choiceVisible(c,{}),false);assert.equal(choiceVisible(c,{['routeOfficeBond_'+id]:'friendship'}),false);
 const flags={['routeOfficeBond_'+id]:'romance'};assert.equal(choiceVisible(c,flags),true);Object.assign(flags,NODES[c.next].effectOnEnter);assert.equal(flags[kind==='bank'?'routeBankOutcome':'routePapersOutcome'],kind==='bank'?'approved':'accepted');assert.equal(choiceVisible(c,flags),false);
 const saved=normalizeProgress({formatVersion:1,storyVersion:STORY_VERSION,profile:{gender:'female',nameId:'anna'},node:'route15_start',index:0,flags,journal:[],log:[]});
 for(const ending of ['stay','leave','return']){const p=NODES['route_epilogue_'+ending].pages[2];assert.notEqual(pageText(p,saved.flags,'ru'),pageText(p,{},'ru'));assert.notEqual(pageText(p,saved.flags,'en'),pageText(p,{},'en'));}
});
test('bank and documents remain separate and both can affect the epilogue',()=>{
 const f={...NODES.route15_help_lazar.effectOnEnter,...NODES.route15_help_ivana.effectOnEnter};assert.equal(f.routeBankOutcome,'approved');assert.equal(f.routePapersOutcome,'accepted');assert.match(pageText(NODES.route_epilogue_stay.pages[2],f,'ru'),/одобрили.*приняли/);
});
