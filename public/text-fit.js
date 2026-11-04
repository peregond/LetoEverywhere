// A line of dialogue has a box of fixed height (see unify.css). Text that does not fit is cut into screens, and "next" shows the
// next screen before the story moves on. `fits(candidate)` says whether a piece of text fits the box (the app measures the real element).
const SENTENCE_END=/[.!?…»”"]\s*$/;
export function splitToFit(text,fits){
 const tokens=String(text).match(/\S+\s*/g)||[''];
 const piece=(from,to)=>tokens.slice(from,to).join('').trimEnd();
 const chunks=[];let start=0;
 while(start<tokens.length){
  if(fits(piece(start,tokens.length))){chunks.push(piece(start,tokens.length));break;}
  // the longest run of words that fits (at least one word, so a huge word cannot stall us)
  let low=start+1,high=tokens.length-1;
  while(low<high){const mid=Math.ceil((low+high)/2);if(fits(piece(start,mid)))low=mid;else high=mid-1;}
  let end=low;
  // prefer to stop at the end of a sentence, if that keeps at least half of the screen
  for(let k=end;k>start+Math.ceil((end-start)/2);k--)if(SENTENCE_END.test(tokens[k-1])){end=k;break;}
  // never leave one or two words alone on the last screen
  const rest=tokens.length-end;
  if(rest>0&&rest<3&&end-start>rest+3)end-=3-rest;
  chunks.push(piece(start,end));start=end;
 }
 return chunks;
}
