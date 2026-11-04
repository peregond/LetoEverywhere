// Which ambience loop sits under a scene, and which stinger marks a scene. Days 0-5 only for now, like the place-based music.
const AMBIENCE_CHAPTERS=['prologue','arrival','districts','work','day-3','day-4','day-5'];
const BY_BG={
 'belgrade-rain-cafe':'rain',
 'airport-cafe':'cafe','bakery':'cafe','bakery-corner':'cafe','bakery-display':'cafe','cafe-table':'cafe','belgrade-morning-cafe':'cafe','ada-melon-cafe-v1':'cafe','skadarlija-kafana-v1':'cafe',
 'belgrade-kiosk-street':'street','belgrade-park-bench':'street','belgrade-drive':'street','taxi-pickup':'street','belgrade-courtyard':'street','knez-mihailova-evening-v1':'street',
 'zemun-cobbles-v1':'street','zemun-gardos-v2':'street','zemun-gardos-v1':'street','zemun-quay-v1':'street',
 'belgrade-courtyard-evening-v1':'night','belgrade-room-night':'night',
 'riverside-evening':'river','sava-branko-promenade-v1':'river',
 'airport-apron':'airport','arrivals-corridor':'airport','arrivals-hall':'airport','baggage-claim':'airport','escalator':'airport','sunlit-passage':'airport','terminal-counters':'airport',
 'document-desk':'office','bank-consultation':'office','workshop-office':'office','police-station-break':'office'
};
const isLate=node=>{const hour=parseInt(String(node.time||'').slice(0,2),10);return hour>=20&&hour<=23;};
export function ambienceFor(node){
 if((!node.routeDay&&!AMBIENCE_CHAPTERS.includes(node.chapterId))||!node.bg)return null;
 if(BY_BG[node.bg])return BY_BG[node.bg];
 if(node.bg.startsWith('ada-'))return 'river';
 if(node.bg.startsWith('nikola-'))return 'night';
 return isLate(node)?'night':null;
}
// A stinger plays once, when the story enters the scene.
export const STINGS_BY_NODE={
 flat_arrive:'key',flat_signed:'signed',residence_submit:'stamp',quick_baggage:'ding',
 date_hand:'warm',date_kiss:'warm',c5_contact_kiss:'warm',rental_kiss_ana:'warm',rental_kiss_stefan:'warm',rental_kiss_marko:'warm',rental_kiss_vuk:'warm',
 d20_nephew_end:'reveal',decision_night:'decision',final_airport:'decision',final_asya:'decision',final_luka:'decision',final_friends:'decision',final_alone:'decision'
};
export const stingFor=nodeId=>STINGS_BY_NODE[nodeId]??null;
