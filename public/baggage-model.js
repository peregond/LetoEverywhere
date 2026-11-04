export const BAGGAGE_ITEMS=[
 {id:'blue-yellow',label:'Синий чемодан с жёлтой лентой'},
 {id:'blue-plain',label:'Синий чемодан без ленты'},
 {id:'red-yellow',label:'Красный чемодан с жёлтой лентой'},
 {id:'blue-white',label:'Синий чемодан с белой лентой'},
 {id:'olive',label:'Оливковый тканевый чемодан'},
 {id:'burgundy',label:'Бордовый чемодан с ремнём'}
];
export const BAGGAGE_TARGET='blue-yellow';
export function baggageLayout(random=Math.random){
 const items=[...BAGGAGE_ITEMS];
 for(let i=items.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[items[i],items[j]]=[items[j],items[i]];}
 return items;
}
