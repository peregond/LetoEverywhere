// Quiet ambience loops and one-shot stingers (tools/music/compose_sfx.py). They follow the music switch and the volume
// slider: nothing loads or plays until the player has turned music on.
const AMBIENCE={rain:'rain-amb.m4a',cafe:'cafe-amb.m4a',street:'street-amb.m4a',night:'night-amb.m4a',river:'river-amb.m4a',airport:'airport-amb.m4a',office:'office-amb.m4a'};
const STINGS={key:'key-sting.m4a',stamp:'stamp-sting.m4a',signed:'signed-sting.m4a',warm:'warm-sting.m4a',decision:'decision-sting.m4a',reveal:'reveal-sting.m4a',chime:'chime-sting.m4a',ding:'ding-sting.m4a'};
const AMBIENCE_LEVEL=.5,STING_LEVEL=.85,STEP_MS=60,FADE_STEPS=12;
let enabled=false,hidden=false,volume=.55,desired=null,timer=null;
const loops=new Map(),shots=new Map();
const make=(file,loop)=>{const audio=new Audio(new URL('./assets/sfx/'+file,import.meta.url).href);audio.loop=loop;audio.preload='none';audio.volume=0;return audio;};
const live=()=>enabled&&!hidden;
function target(key){return key===desired&&live()?Math.min(1,volume*AMBIENCE_LEVEL):0;}
function step(){
 let moving=false;
 for(const [key,audio] of loops){
  const goal=target(key),diff=goal-audio.volume;
  if(Math.abs(diff)<.005){audio.volume=Math.max(0,goal);if(!goal&&!audio.paused)audio.pause();continue;}
  moving=true;audio.volume=Math.max(0,Math.min(1,audio.volume+Math.sign(diff)*Math.max(.01,Math.abs(volume*AMBIENCE_LEVEL)/FADE_STEPS)));
 }
 if(!moving&&timer){clearInterval(timer);timer=null;}
}
function apply(){
 if(live()&&desired&&Object.hasOwn(AMBIENCE,desired)){
  if(!loops.has(desired))loops.set(desired,make(AMBIENCE[desired],true));
  const audio=loops.get(desired);
  if(audio.paused){const key=desired;Promise.resolve(audio.play()).then(()=>{if(!live()||desired!==key)audio.pause();}).catch(()=>{});}
 }
 if(!live()){for(const audio of loops.values()){audio.pause();audio.volume=0;}for(const audio of shots.values())audio.pause();}
 if(live()&&loops.size&&!timer)timer=setInterval(step,STEP_MS);
}
// Called by audio.js whenever the music switch or the page visibility changes.
export function syncSfx(state){
 if('enabled' in state)enabled=!!state.enabled;
 if('hidden' in state)hidden=!!state.hidden;
 apply();
}
// The sounds have their own volume, separate from the music's.
export function setSfxVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));apply();}
export function setAmbience(key){desired=Object.hasOwn(AMBIENCE,key)?key:null;apply();}
export function playSting(key){
 if(!live()||!Object.hasOwn(STINGS,key))return false;
 if(!shots.has(key))shots.set(key,make(STINGS[key],false));
 const audio=shots.get(key);audio.currentTime=0;audio.volume=Math.min(1,volume*STING_LEVEL);
 Promise.resolve(audio.play()).catch(()=>{});return true;
}
