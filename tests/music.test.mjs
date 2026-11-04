import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES} from '../public/story.js';
import {cueFor,CHAPTER_CUES} from '../public/music-cues.js';
const audioSource=fs.readFileSync(new URL('../public/audio.js',import.meta.url),'utf8');
const files=Object.fromEntries([...audioSource.match(/const files=\{([^}]*)\}/)[1].matchAll(/(\w+):'([^']+)'/g)].map(m=>[m[1],m[2]]));
assert.deepEqual(Object.keys(files),['prologue','encounter','arrival','district','bank','daily','rain','evening','night','flat','walk','docs','clock']);
for(const [key,file] of Object.entries(files)){
 const size=fs.statSync(new URL('../public/assets/'+file,import.meta.url)).size;
 assert.ok(size>600000&&size<3000000,key+' is a real track ('+size+' bytes)');
}
// Every scene resolves to a cue that exists, and the first five chapters have their own music.
for(const [id,node] of Object.entries(NODES))assert.ok(Object.hasOwn(files,cueFor(node)),id);
assert.equal(cueFor(NODES.quick_arrival),'prologue');assert.equal(cueFor(NODES.road_start),'arrival');assert.equal(cueFor(NODES.morning_start),'district');
assert.equal(cueFor(NODES.third_morning),'bank');assert.equal(cueFor(NODES.d3_start),'walk');assert.ok(Object.values(NODES).some(n=>n.chapterId==='day-3'&&cueFor(n)==='daily'),'Day 3 still has its own daily cue indoors');assert.equal(cueFor(NODES.rain_break),'rain');
assert.equal(cueFor(NODES.d4_start),'docs');assert.equal(cueFor(NODES.d5_start),'clock');
assert.equal(cueFor(NODES.d6_start),'prologue','Later chapters keep the old default until they get music of their own');
assert.equal(cueFor({chapterId:'districts',bg:'dorcol-apartment',time:'11:00'}),'flat');assert.equal(cueFor({chapterId:'districts',bg:'riverside-evening',time:'20:00'}),'evening');
assert.equal(cueFor({chapterId:'districts',bg:'first-room',time:'22:00'}),'night');assert.equal(cueFor({chapterId:'work',bg:'zemun-quay-v1',time:'13:00'}),'walk');
assert.equal(cueFor({chapterId:'day-8',bg:'riverside-evening',time:'20:00'}),'prologue','Place cues apply to days 0-5 only');
assert.equal(cueFor({music:'encounter',chapterId:'districts'}),'encounter','A scene may still choose its own cue');
assert.deepEqual(Object.keys(CHAPTER_CUES),['arrival','districts','work','day-3','day-4','day-5']);
// The cues are reproducible: the composer script defines each of the new ones.
const script=fs.readFileSync(new URL('../tools/music/compose_balkan.py',import.meta.url),'utf8');
for(const name of ['arrival','district','bank','daily','rain','evening','night','flat','walk','docs','clock'])assert.match(script,new RegExp("CUES\\['"+name+"'\\]"));
console.log('Music: thirteen cues, the first five chapters have their own, every scene resolves to an existing track.');
