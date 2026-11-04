import {EMOTIONS} from './workshop-model.js?v=0.17.2';

export function filterWorkshopEntries(entries, filters={}, people=[], translate=value=>value) {
  const {view='characters',person='all',status='current',look='all',category='all',query='',characterIds=[]}=filters;
  const portraits=['characters','supporting'].includes(view);
  const names=new Map(people.map(p=>[p.id,p.name]));
  const needle=query.trim().toLocaleLowerCase();
  return entries.filter(entry=>{
    if(portraits&&(!entry.character||!characterIds.includes(entry.character)))return false;
    if(['backgrounds','audio'].includes(view)&&entry.category!==view)return false;
    if(status==='current'&&entry.status==='archive')return false;
    if(!['all','current'].includes(status)&&entry.status!==status)return false;
    if(portraits&&person!=='all'&&entry.character!==person)return false;
    if(portraits&&look!=='all'&&entry.look!==look)return false;
    if(view==='assets'&&category!=='all'&&entry.category!==category)return false;
    const terms=[entry.file,entry.character,names.get(entry.character),entry.emotion,EMOTIONS[entry.emotion],entry.look,entry.status].filter(Boolean);
    return !needle||terms.flatMap(value=>[value,translate(value)]).join(' ').toLocaleLowerCase().includes(needle);
  });
}
export function paginateWorkshopEntries(entries,limit=60){
  const count=Number.isFinite(limit)?Math.max(1,Math.floor(limit)):60;
  return {items:entries.slice(0,count),total:entries.length,hasMore:entries.length>count};
}
