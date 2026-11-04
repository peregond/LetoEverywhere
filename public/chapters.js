import {PRELUDE,DAYS,LEGACY_PRELUDE,LEGACY_DAYS as OLD_DAYS} from './days.js?v=0.17.2';
// Active chapters correspond one-to-one with the fifteen days; legacy metadata only assembles archived scenes.
export const CHAPTERS=[...PRELUDE,...DAYS.map(d=>({id:d.id,number:'День '+d.n,title:d.title,start:d.start,description:d.description,day:d.n,stage:d.stage}))];
export const LEGACY_CHAPTERS=[...LEGACY_PRELUDE,...OLD_DAYS.map(d=>({id:d.id,number:'День '+d.n,title:d.title,start:d.start,day:d.n,stage:d.stage}))];
// Version-1 completion flags cannot unlock days in the rebuilt route.
export function dayProgress(flags={}){return Math.max(0,Math.min(DAYS.length,Number.isInteger(flags.dayDone)?flags.dayDone:0));}
export function assignChapters(nodes,chapters=CHAPTERS){
 const boundaries=new Set(chapters.map(c=>c.start));
 for(const chapter of chapters){
  const seen=new Set();const visit=id=>{
   if(id==='end'||seen.has(id)||(boundaries.has(id)&&id!==chapter.start))return;
   seen.add(id);const node=nodes[id];if(!node)throw Error('Unknown chapter scene '+id);
   node.chapterId=chapter.id;node.chapter=chapter.number+' · '+chapter.title;if(chapter.day){node.day='ДЕНЬ '+chapter.day;if(node.activeRoute)node.routeDay=chapter.day;}
   for(const target of node.choices?.map(c=>c.next)??[node.next])visit(target);
  };visit(chapter.start);
 }
}
export function chapterFor(state,nodes){return CHAPTERS.find(c=>c.id===nodes[state?.node]?.chapterId)??(CHAPTERS.findLast(c=>c.day&&c.day<=dayProgress(state?.flags))??CHAPTERS[0]);}
const validFlags=flags=>flags&&typeof flags==='object'&&!Array.isArray(flags)&&Object.keys(flags).length<=150&&Object.values(flags).every(v=>['boolean','number','string'].includes(typeof v)&&(typeof v!=='string'||v.length<=200));
export function readChapterMarks(input,nodes,journal,logLength){
 const result={};if(!input||typeof input!=='object'||Array.isArray(input))return result;
 for(const c of CHAPTERS){const mark=input[c.id];if(!mark)continue;
  if(!nodes[mark.node]||nodes[mark.node].chapterId!==c.id||!Number.isInteger(mark.index)||mark.index<0||mark.index>=nodes[mark.node].pages.length||!validFlags(mark.flags)||!Array.isArray(mark.journal)||mark.journal.length>300||mark.journal.some(id=>!Object.hasOwn(journal,id))||!Number.isInteger(mark.logLength)||mark.logLength<0||mark.logLength>logLength)continue;
  result[c.id]={node:mark.node,index:mark.index,flags:{...mark.flags},journal:[...new Set(mark.journal)],logLength:mark.logLength};
 }return result;
}
export function rememberChapter(state,nodes,alreadyRecorded=false){
 const id=nodes[state.node]?.chapterId;if(!id)return;
 state.chapterMarks??={};if(state.chapterMarks[id])return;
 state.chapterMarks[id]={node:state.node,index:state.index,flags:{...state.flags},journal:[...state.journal],logLength:Math.max(0,state.log.length-(alreadyRecorded?1:0))};
}
export function restartChapter(state,id,nodes){
 const chapter=CHAPTERS.find(c=>c.id===id);if(!chapter)return false;
 let mark=state.chapterMarks?.[id];
 if(id===CHAPTERS[0].id)mark={node:chapter.start,index:0,flags:{...nodes[chapter.start].effectOnEnter,...(state.flags?.rentalCast==='new'?{rentalCast:'new'}:{})},journal:[...(nodes[chapter.start].journal??[])],logLength:0};
 if(!mark)return false;
 const earlier=new Set(CHAPTERS.slice(0,CHAPTERS.indexOf(chapter)).map(c=>c.id));
 state.chapterMarks=Object.fromEntries(Object.entries(state.chapterMarks??{}).filter(([key])=>earlier.has(key)));
 Object.assign(state,{node:mark.node,index:mark.index,flags:{...mark.flags},journal:[...mark.journal],log:state.log.slice(0,mark.logLength),rewind:[],completed:false});
 rememberChapter(state,nodes);return true;
}
// Developer jump preserves the current choices as a starting approximation. It
// does not invent earlier events or erase the player's existing chapter marks.
export function jumpToChapter(state,id,nodes){
 const chapter=CHAPTERS.find(c=>c.id===id),node=chapter&&nodes[chapter.start];if(!node)return false;
 state.node=chapter.start;state.index=0;state.flags={...state.flags,...(node.effectOnEnter??{})};
 if(chapter.day&&!Object.hasOwn(node.effectOnEnter??{},'dayDone'))state.flags.dayDone=chapter.day-1;
 state.journal=[...new Set([...state.journal,...(node.journal??[])])];state.rewind=[];state.completed=false;
 rememberChapter(state,nodes);return true;
}
export function continuationFor(state){const done=dayProgress(state?.flags);return done>=DAYS.length?null:DAYS[done].start;}
