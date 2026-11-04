import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES} from '../public/story.js';
import {ambienceFor,stingFor,STINGS_BY_NODE} from '../public/sound-cues.js';
const source=fs.readFileSync(new URL('../public/sfx.js',import.meta.url),'utf8');
const table=name=>Object.fromEntries([...source.match(new RegExp('const '+name+'=\\{([^}]*)\\}'))[1].matchAll(/(\w+):'([^']+)'/g)].map(m=>[m[1],m[2]]));
const ambience=table('AMBIENCE'),stings=table('STINGS');
assert.deepEqual(Object.keys(ambience),['rain','cafe','street','night','river','airport','office']);
assert.deepEqual(Object.keys(stings),['key','stamp','signed','warm','decision','reveal','chime','ding']);
for(const file of [...Object.values(ambience),...Object.values(stings)]){
 const size=fs.statSync(new URL('../public/assets/sfx/'+file,import.meta.url)).size;
 assert.ok(size>10000&&size<400000,file+' is a real, small file ('+size+')');
}
// Every stinger the story asks for exists, on a real scene; every scene resolves to a known ambience or none.
for(const [id,key] of Object.entries(STINGS_BY_NODE)){assert.ok(NODES[id],'stinger on a missing scene '+id);assert.ok(Object.hasOwn(stings,key),id);}
for(const [id,node] of Object.entries(NODES)){const key=ambienceFor(node);assert.ok(key===null||Object.hasOwn(ambience,key),id);}
assert.equal(ambienceFor(NODES.rain_break),'rain');assert.equal(ambienceFor(NODES.quick_arrival),'airport');
assert.equal(ambienceFor({chapterId:'day-8',bg:'riverside-evening',time:'20:00'}),null,'Later chapters stay silent for now');
assert.equal(ambienceFor({chapterId:'districts',bg:'ada-lake-v1',time:'21:05'}),'river');assert.equal(ambienceFor({chapterId:'districts',bg:'first-room',time:'22:00'}),'night');
assert.equal(ambienceFor({chapterId:'districts',bg:'ada-melon-cafe-v1',time:'21:40'}),'cafe','The beach cafe has cafe ambience instead of inheriting the water loop');
assert.equal(ambienceFor({...NODES.ada_home,bg:'belgrade-room-night'}),'night','A page that leaves the lake uses its actual background');
assert.equal(stingFor('flat_signed'),'signed');assert.equal(stingFor('morning_start'),null);
// Playback follows the music switch, the volume and page visibility.
const made=[];
globalThis.Audio=class{paused=true;volume=1;currentTime=0;plays=0;constructor(src){this.src=src;made.push(this);}play(){this.paused=false;this.plays++;return Promise.resolve();}pause(){this.paused=true;}};
const intervals=[];globalThis.setInterval=fn=>{intervals.push(fn);return intervals.length;};globalThis.clearInterval=()=>{};
const {syncSfx,setSfxVolume,setAmbience,playSting}=await import('../public/sfx.js');
setAmbience('rain');assert.equal(made.length,0,'Nothing loads before music is switched on');assert.equal(playSting('key'),false);
syncSfx({enabled:true});setSfxVolume(.5);assert.equal(made.length,1);assert.ok(made[0].src.endsWith('rain-amb.m4a'));assert.equal(made[0].plays,1);
for(let i=0;i<20;i++)intervals.forEach(fn=>fn());assert.ok(Math.abs(made[0].volume-.25)<.02,'Ambience settles under the music ('+made[0].volume+')');
setAmbience('rain');assert.equal(made[0].plays,1,'The same ambience does not restart');
assert.equal(playSting('key'),true);assert.ok(made[1].src.endsWith('key-sting.m4a'));assert.equal(made[1].plays,1);
syncSfx({hidden:true});assert.ok(made.every(a=>a.paused));assert.equal(playSting('key'),false);
syncSfx({hidden:false});assert.equal(made[0].paused,false);
setAmbience(null);for(let i=0;i<40;i++)intervals.forEach(fn=>fn());assert.equal(made[0].paused,true,'Ambience fades out and pauses');
setAmbience('river');const river=made.find(a=>a.src.endsWith('river-amb.m4a'));for(let i=0;i<40;i++)intervals.forEach(fn=>fn());assert.equal(river.paused,false);
setAmbience('cafe');for(let i=0;i<40;i++)intervals.forEach(fn=>fn());assert.equal(river.paused,true,'Water fades out after moving to another location');
syncSfx({enabled:false});assert.equal(playSting('ding'),false);
syncSfx({enabled:true});setSfxVolume(.2);assert.equal(playSting('ding'),true);assert.ok(Math.abs(made.find(a=>a.src.endsWith('ding-sting.m4a')).volume-.17)<.001,'Sound volume is independent of the music volume');
console.log('Sound effects: seven ambience loops and eight stingers exist, map to real scenes and follow the music switch.');
