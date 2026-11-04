import assert from 'node:assert/strict';
const listeners={},audio=[],timers=[];
const oldTimeout=globalThis.setTimeout;
globalThis.setTimeout=fn=>{timers.push(fn);return timers.length;};
globalThis.window={dispatchEvent(){}};
globalThis.CustomEvent=class{constructor(type){this.type=type;}};
globalThis.document={hidden:false,addEventListener(type,fn){listeners[type]=fn;}};
globalThis.Audio=class{
 paused=true;volume=1;plays=0;
 constructor(src){this.src=src;audio.push(this);}
 addEventListener(){}
 async play(){this.paused=false;this.plays++;}
 pause(){this.paused=true;}
};
const {setMusic,setMusicScene,setVolume,musicPlaying}=await import('../public/audio.js');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
setMusicScene('encounter');assert.equal(audio.length,0,'Muted scenes must not start or load audio');
await setMusic(true);assert.equal(audio.length,13);assert.ok(audio[1].src.endsWith('encounter-theme.m4a'));assert.equal(audio[1].plays,1);assert.equal(musicPlaying(),true);
setVolume(.27);assert.equal(audio[1].volume,.27);
setMusicScene('encounter');await flush();assert.equal(audio[1].plays,1,'Same cue must not restart each page');
setMusicScene('prologue');await flush();timers.splice(0).forEach(fn=>fn());assert.equal(audio[0].paused,false);assert.equal(audio[1].paused,true);assert.equal(audio[0].volume,.27);
await setMusic(false);setMusicScene('encounter');await flush();assert.ok(audio.every(a=>a.paused));assert.equal(musicPlaying(),false);
await setMusic(true);document.hidden=true;listeners.visibilitychange();assert.ok(audio.every(a=>a.paused));document.hidden=false;listeners.visibilitychange();await flush();assert.equal(audio[1].paused,false);
// Choosing a cue while the first user-gesture play is pending must not mute music.
await setMusic(false);setMusicScene('prologue');const starting=setMusic(true);setMusicScene('encounter');await starting;await flush();assert.equal(musicPlaying(),true);assert.equal(audio[1].paused,false);
await setMusic(false);globalThis.setTimeout=oldTimeout;
console.log('Музыка: согласие, смена темы, громкость, отсутствие перезапуска, фон и быстрые переходы проверены.');
// Exercise the actual gain-ramp path, in addition to the element-volume fallback.
const gains=[];
globalThis.AudioContext=class{
 currentTime=10;destination={};
 createGain(){const gain={value:0,cancelScheduledValues(){},setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v,t){this.value=v;this.end=t;}};gains.push(gain);return {gain,connect(){return this;}};}
 createMediaElementSource(){return {connect(){return this;}};}
 async resume(){}
};
const smooth=await import('../public/audio.js?gain-test');
await smooth.setMusic(true);smooth.setVolume(.31);assert.equal(gains[0].value,.31);
assert.equal(gains[1].end,10.65);smooth.setMusicScene('encounter');await flush();assert.equal(gains[1].value,0);assert.equal(gains[2].value,1);assert.equal(gains[2].end,10.65);await smooth.setMusic(false);
console.log('Web Audio: общий уровень и плавный переход 650 мс проверены.');
