// Keep at most two previous reading positions, including choice consequences.
export function rememberStep(state) {
  state.rewind??=[];
  state.rewind.push({node:state.node,index:state.index,flags:structuredClone(state.flags),journal:[...state.journal],logLength:state.log.length});
  state.rewind=state.rewind.slice(-2);
}
export function rewindStep(state) {
  const previous=state.rewind?.pop();
  if(!previous)return false;
  Object.assign(state,{node:previous.node,index:previous.index,flags:structuredClone(previous.flags),journal:[...previous.journal],log:state.log.slice(0,previous.logLength),completed:false});
  return true;
}
export function readRewind(input,nodes,journal,logLength) {
  if(!Array.isArray(input)||input.length>2)return [];
  let lastLength=0;
  const result=[];
  for(const frame of input) {
    if(!frame||!Object.hasOwn(nodes,frame.node)||!Number.isInteger(frame.index)||frame.index<0||frame.index>=nodes[frame.node].pages.length
      ||!frame.flags||typeof frame.flags!=='object'||Array.isArray(frame.flags)
      ||!Array.isArray(frame.journal)||frame.journal.some(id=>!Object.hasOwn(journal,id))
      ||!Number.isInteger(frame.logLength)||frame.logLength<lastLength||frame.logLength>logLength)return [];
    result.push({node:frame.node,index:frame.index,flags:structuredClone(frame.flags),journal:[...new Set(frame.journal)],logLength:frame.logLength});
    lastLength=frame.logLength;
  }
  return result;
}
