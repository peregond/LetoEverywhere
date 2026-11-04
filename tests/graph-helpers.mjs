// The flat-hunting map is a deliberate loop (see another district, come back to the map).
// Audits that walk the story as a tree ignore these back edges; the loop is bounded by the number of flats.
import {NODES,START} from '../public/story.js';
const colour=new Map(),back=new Set();
const targetsOf=node=>node.choices?node.choices.map(c=>c.next):[node.next];
function visit(root){
 const stack=[[root,0]];colour.set(root,1);
 while(stack.length){
  const top=stack.at(-1),[id]=top,node=NODES[id];
  const targets=id==='end'||!node?[]:targetsOf(node);
  if(top[1]>=targets.length){colour.set(id,2);stack.pop();continue;}
  const next=targets[top[1]++];
  if(!next||next==='end')continue;
  if(colour.get(next)===1){back.add(id+'>'+next);continue;}
  if(!colour.has(next)){colour.set(next,1);stack.push([next,0]);}
 }
}
visit(START);
for(const id of Object.keys(NODES))if(!colour.has(id))visit(id);
export const isBackEdge=(from,to)=>back.has(from+'>'+to);
export const forwardTargets=id=>targetsOf(NODES[id]).filter(next=>!isBackEdge(id,next));
export const backEdges=()=>[...back];
