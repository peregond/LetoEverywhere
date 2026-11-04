// Which music cue plays in a scene. A scene's own cue wins; then the place (days 0-5 have a cue for each mood, see
// tools/music/compose_balkan.py); then the chapter; the older rule for cafés stays the fallback.
export const CHAPTER_CUES={arrival:'arrival',districts:'district',work:'bank','day-3':'daily','day-4':'docs','day-5':'clock'};
const CAFES=['airport-cafe','bakery','cafe-table','bakery-display','bakery-corner'];
const PLACE_CUES={
 'dorcol-apartment':'flat','vracar-apartment':'flat','new-belgrade-apartment':'flat',
 'riverside-evening':'evening','belgrade-courtyard-evening-v1':'evening','skadarlija-evening-v1':'evening','skadarlija-kafana-v1':'evening',
 'knez-mihailova-evening-v1':'evening','sava-branko-promenade-v1':'evening','asya-home-evening':'evening',
 'zemun-cobbles-v1':'walk','zemun-gardos-v2':'walk','zemun-gardos-v1':'walk','zemun-quay-v1':'walk','belgrade-kiosk-street':'walk','belgrade-park-bench':'walk',
 'belgrade-room-night':'night'
};
// Chapters whose scenes follow the place-based cues above; later chapters keep the old rule until they get music of their own.
const PLACE_CHAPTERS=['arrival','districts','work','day-3','day-4','day-5'];
const isLate=node=>{const hour=parseInt(String(node.time||'').slice(0,2),10);return hour>=20&&hour<=23;};
export function cueFor(node){
 if(node.music)return node.music;
 if(node.routeDay){
  if(node.routeDay===1)return CAFES.includes(node.bg)?'encounter':'prologue';
  if(PLACE_CUES[node.bg])return PLACE_CUES[node.bg];
  if(node.bg==='bank-consultation')return 'bank';
  if(isLate(node))return 'night';
  return ({2:'arrival',3:'district',4:'flat',5:'docs',6:'daily',7:'evening',8:'encounter',9:'evening',10:'walk',11:'evening',12:'walk',13:'daily',14:'evening',15:'evening'})[node.routeDay];
 }
 if(node.bg==='belgrade-rain-cafe')return 'rain';
 if(PLACE_CHAPTERS.includes(node.chapterId)){
  if(node.bg&&node.bg.startsWith('ada-'))return 'evening';
  if(node.bg&&node.bg.startsWith('nikola-'))return 'night';
  if(PLACE_CUES[node.bg])return PLACE_CUES[node.bg];
  if(isLate(node)&&node.chapterId!=='day-5')return 'night';
 }
 if(CHAPTER_CUES[node.chapterId])return CHAPTER_CUES[node.chapterId];
 return CAFES.includes(node.bg)?'encounter':'prologue';
}
