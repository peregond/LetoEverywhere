import assert from 'node:assert/strict';
import {rememberStep,rewindStep,readRewind} from '../public/rewind.js';
import {NODES,JOURNAL} from '../public/story.js';

const node='nikola_questions';
const state={node,index:NODES[node].pages.length-1,flags:{},journal:[],log:[{text:'Перед выбором'}],completed:false};
const before=structuredClone(state);
rememberStep(state);
state.node='nikola_flirt';state.index=0;state.flags.nikolaBond='romance';state.journal.push('nikola_spark');state.log.push({text:'Флирт'});
assert.equal(rewindStep(state),true);
assert.equal(state.node,before.node);assert.equal(state.index,before.index);
assert.deepEqual(state.flags,before.flags);assert.deepEqual(state.journal,before.journal);assert.deepEqual(state.log,before.log);
for(let i=0;i<3;i++){rememberStep(state);state.log.push({text:String(i)});}
assert.equal(state.rewind.length,2);
const restored=JSON.parse(JSON.stringify(state));
restored.rewind=readRewind(restored.rewind,NODES,JOURNAL,restored.log.length);
assert.equal(rewindStep(restored),true);assert.equal(rewindStep(restored),true);assert.equal(rewindStep(restored),false);
assert.deepEqual(readRewind(undefined,NODES,JOURNAL,1),[]);
assert.deepEqual(readRewind([{node:'unknown'}],NODES,JOURNAL,1),[]);
assert.deepEqual(readRewind([{...before,logLength:999}],NODES,JOURNAL,1),[]);
console.log('Возврат: последствия выбора, дневник и реплики восстановлены; предел два шага и сохранения проверены.');
