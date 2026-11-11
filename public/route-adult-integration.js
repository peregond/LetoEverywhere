import {extendAdultEvenings} from './adult-evenings.js?v=0.17.3';
import {ADULT_PEOPLE,ADULT_DAYS_ROUTE} from './adult-cast.js?v=0.17.3';
import {DAYS,T} from './days.js?v=0.17.2';

// The older registry uses the same IDs as the new route and returns to the
// thirty-day story. Build it separately, then copy only compatible nights.
export function integrateAdultEvenings({NODES,JOURNAL,BACKGROUNDS,n,scene}) {
 const staged={};
 extendAdultEvenings({NODES:staged,JOURNAL,BACKGROUNDS,n,scene});
 const completed=['nikola','milica','dragan','jelena','asya','luka','ana','stefan','marko','lazar','strahinya','milos'];
 const beats=['home','door','fade','prep','sex','sex_deep','cum_inside','cum_cloth','cum_chest','afterglow','morning'];
 for(const day of [1,...ADULT_DAYS_ROUTE]) for(const person of (day===1?['nikola','milica']:ADULT_PEOPLE)) {
  // This version of the scene has an unmasked portrait and identifies him by
  // name, contrary to the masked character's boundary in the active story.
  if(person==='milos')continue;
  const old=`evening${day}_${person}`, prefix=`adult_${old}`, end=`route${day}_close`;
  const ask=NODES[`${old}_night_ask`];
  if(!ask)continue;
  const accepted=ask.choices.find(c=>c.next===`${old}_fade`);
  if(!accepted)continue;
  for(const beat of beats){
   const node=staged[`${old}_${beat}`];
   if(!node)throw new Error(`Missing adult scene: ${old}_${beat}`);
   // Several detailed-night CGs are production storyboards, not finished art.
   // Keep the text and choices playable against a finished nighttime room
   // until those individual illustrations are ready. Nikola's set is complete.
   if(person!=='nikola'&&beat!=='morning'){
    const background=beat==='afterglow'?(completed.includes(person)?`${person}-night-afterglow-v1`:`${person}-evening-soft-v1`):'belgrade-room-night';
    node.bg=background;
    for(const page of node.pages)if(page.bg)page.bg=background;
   }
   const map=target=>target?.startsWith(old+'_')?prefix+target.slice(old.length):end;
   node.next=beat==='morning'?end:node.next?map(node.next):node.next;
   if(node.choices)node.choices=node.choices.map(c=>({...c,next:map(c.next)}));
   node.adult=beat!=='morning';
   if(node.adult)node.skipTo=end;else delete node.skipTo;
   node.activeRoute=true;node.routeDay=day;node.chapterId=DAYS[day-1].id;
   NODES[`${prefix}_${beat}`]=node;
  }
  ask.choices.splice(1,0,{...accepted,label:T('Остаться вместе · подробная сцена','Stay together · detailed scene'),next:`${prefix}_home`,when:{gender:'male'}});
 }
 // Show completed, identity-checked afterglows on the shorter consensual
 // route as well. Do not use unfinished storyboards or Vuk's mismatched face.
 for(const person of completed){
  const art=person==='nikola'?'nikola-afterglow-smile-v1':`${person}-night-afterglow-v1`;
  if(person==='milos')BACKGROUNDS[art]={label:T('ВЕЧЕР · ПОСЛЕ','EVENING · AFTER'),description:T('Человек в балаклаве отдыхает','The masked person rests'),file:art,position:'50% 35%',optional:true};
  for(let day=1;day<=15;day++){
   const node=NODES[`evening${day}_${person}_fade`];
   if(node){node.bg=art;node.portrait=false;}
  }
 }
 // Original, fully clothed evening art is shared by all player profiles.
 // Use composite backgrounds without a second portrait over the character.
 for(const person of ['teodora','ivana','vuk']){
  const poses=person==='vuk'?['soft']:['arrival','conversation','soft'];
  for(const pose of poses){const art=`${person}-evening-${pose}-v1`;BACKGROUNDS[art]={label:T('ВЕЧЕР · ВСТРЕЧА','EVENING · MEETING'),description:T('Вечерняя встреча','An evening together'),file:art,position:'50% 35%',optional:true};}
  for(let day=1;day<=15;day++)for(const [suffix,pose] of (person==='vuk'?[['_fade','soft']]:[['','arrival'],['_friend','conversation'],['_fade','soft']])){
   const node=NODES[`evening${day}_${person}${suffix}`];if(!node)continue;
   node.bg=`${person}-evening-${pose}-v1`;node.portrait=false;
   for(const page of node.pages)page.portrait=false;
  }
 }
}
