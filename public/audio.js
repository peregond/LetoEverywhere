import {syncSfx} from './sfx.js?v=0.17.2';
// Original local cues. Audio is enabled only after the player's explicit gesture.
let context,master,active=false,volume=.55,desired='prologue',current=null,revision=0;
const players=new Map();
const files={prologue:'prologue-theme.m4a',encounter:'encounter-theme.m4a',arrival:'arrival-theme.m4a',district:'district-theme.m4a',bank:'bank-theme.m4a',daily:'daily-theme.m4a',rain:'rain-theme.m4a',evening:'evening-theme.m4a',night:'night-theme.m4a',flat:'flat-theme.m4a',walk:'walk-theme.m4a',docs:'docs-theme.m4a',clock:'clock-theme.m4a'};
function notify(){window.dispatchEvent(new CustomEvent('ss-music-state'));}
function prepare(){
 if(players.size)return;
 const AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext;
 if(AudioContext){try{context=new AudioContext();master=context.createGain();master.gain.value=volume;master.connect(context.destination);}catch{context=null;master=null;}}
 for(const [key,file] of Object.entries(files)){
  const audio=new Audio(new URL('./assets/'+file,import.meta.url).href);audio.loop=true;audio.preload='none';
  let gain=null;
  if(context){try{gain=context.createGain();gain.gain.value=0;context.createMediaElementSource(audio).connect(gain).connect(master);}catch{gain=null;}}
  if(!gain)audio.volume=volume;
  audio.addEventListener('playing',notify);audio.addEventListener('pause',notify);
  players.set(key,{audio,gain});
 }
}
function fade(player,value){
 if(!player.gain){player.audio.volume=value*volume;return;}
 const gain=player.gain.gain,now=context.currentTime;
 gain.cancelScheduledValues(now);gain.setValueAtTime(gain.value,now);gain.linearRampToValueAtTime(value,now+.65);
}
async function playDesired(){
 prepare();if(document.hidden)return true;
 const next=players.get(desired),old=players.get(current),key=desired,token=++revision;
 try{
  // Start in the current gesture, before any fade timer (Safari requires this).
  const requests=[next.audio.play()];if(context)requests.push(context.resume());await Promise.all(requests);
  if(token!==revision||!active)return true;
  current=key;fade(next,1);
  for(const player of players.values())if(player!==next){fade(player,0);if(!player.audio.paused)setTimeout(()=>{if(players.get(current)!==player||!active)player.audio.pause();},700);}
  notify();return true;
 }catch{
  if(token!==revision||!active)return true;
  if(next!==old)next.audio.pause();
  return false;
 }
}
export function musicPlaying(){return active&&[...players.values()].some(p=>!p.audio.paused);}
export function setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));if(master)master.gain.value=volume;else for(const [key,p]of players)p.audio.volume=key===current?volume:0;}
export function setMusicScene(key){
 desired=Object.hasOwn(files,key)?key:'prologue';
 if(active&&(current!==desired||players.get(current)?.audio.paused))void playDesired();
}
export async function setMusic(enabled){
 active=!!enabled;syncSfx({enabled:active});
 if(!active){revision++;for(const p of players.values())p.audio.pause();notify();return true;}
 const ok=await playDesired();if(!ok){active=false;revision++;for(const p of players.values())p.audio.pause();notify();}return ok;
}
document.addEventListener('visibilitychange',()=>{
 syncSfx({hidden:document.hidden});
 if(document.hidden){revision++;for(const p of players.values())p.audio.pause();}
 else if(active)void playDesired();
});
