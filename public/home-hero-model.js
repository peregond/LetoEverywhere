// The original poster already introduced these four faces; only later additions
// require evidence that the player has met them in the current saved timeline.
export const HOME_BASE_CAST=['milica','nikola','dragan','jelena'];
export const HOME_PORTRAITS=Object.fromEntries([...HOME_BASE_CAST,'asya','luka','milos'].map(id=>[id,{file:id==='milos'?'workshop/milos-masked-friendly-v2-draft.webp':'home/'+id+'-casual.webp'}]));
export const HOME_BACKGROUNDS={morning:'home/belgrade-morning.webp',day:'home/belgrade-day.webp',evening:'home/belgrade-evening.webp'};
export function eligibleHomeCast(saved){
 const journal=Array.isArray(saved?.journal)?saved.journal:[];const flags=saved?.flags??{};
 return [...HOME_BASE_CAST,...(journal.includes('asya')?['asya']:[]),...(journal.includes('luka')?['luka']:[]),...(flags.maskMet?['milos']:[])];
}
export function selectHomeComposition(saved,{seed=0,hour=12}={}){
 const period=hour>=6&&hour<11?'morning':hour>=11&&hour<19?'day':'evening';
 const people=eligibleHomeCast(saved);let value=Number(seed)>>>0;
 const random=()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};
 for(let i=people.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[people[i],people[j]]=[people[j],people[i]];}
 return{period,background:HOME_BACKGROUNDS[period],people:people.slice(0,Math.min(5,people.length))};
}
