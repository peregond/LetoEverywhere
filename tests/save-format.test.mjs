import assert from 'node:assert/strict';
import {normalizeProgress} from '../lib/save-format.js';
import {MAX_FLAGS,MAX_LOG_RECORDS} from '../public/save-limits.js';
const base={formatVersion:1,storyVersion:2,profile:{gender:'male',nameId:'dmitry'},node:'quick_arrival',index:0,flags:{},journal:[],log:[]};
assert.equal(normalizeProgress(base).node,'quick_arrival');
const bad=patch=>assert.throws(()=>normalizeProgress({...base,...patch}));
bad({formatVersion:2});bad({storyVersion:1});bad({profile:{gender:'other',nameId:'dmitry'}});bad({profile:{gender:'male',nameId:'nobody'}});
bad({node:'missing'});bad({index:-1});bad({index:999});bad({journal:['missing']});bad({flags:[]});bad({flags:{a:{}}});bad({flags:{a:'x'.repeat(201)}});
bad({flags:Object.fromEntries(Array.from({length:MAX_FLAGS+1},(_,i)=>['f'+i,true]))});
bad({log:Array.from({length:MAX_LOG_RECORDS+1},()=>({speaker:'a',text:'b'}))});bad({log:[{speaker:'a'.repeat(101),text:'b'}]});bad({log:[{speaker:'a',text:'b'.repeat(4001)}]});
assert.equal(normalizeProgress({...base,log:Array.from({length:MAX_LOG_RECORDS},()=>({speaker:'a',text:'b'}))}).log.length,MAX_LOG_RECORDS);
assert.equal(normalizeProgress({...base,node:'end',index:42}).index,0,'A finished save always resumes at index 0');
const message={speaker:'Ася',text:'Привет',voice:'message',chatContact:'Ася',chatDirection:'incoming',chatScene:'hello',chatTime:'09:05'};
assert.deepEqual(normalizeProgress({...base,log:[message]}).log[0],{...message,choice:false},'Cloud save keeps conversation identity and time');
assert.equal(normalizeProgress({...base,log:[{...message,chatContact:'x'.repeat(101)}]}).log[0].chatContact,undefined,'Oversized chat metadata is discarded');
// Saves that were at the old limits stay valid.
assert.equal(normalizeProgress({...base,flags:Object.fromEntries(Array.from({length:150},(_,i)=>['f'+i,true]))}).node,'quick_arrival');
assert.ok(MAX_FLAGS>=150&&MAX_LOG_RECORDS>=1500);
console.log('Save format: version, profile, scene, flag, journal and flag and log-record limits checked.');
