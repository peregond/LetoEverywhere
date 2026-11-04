// Preset looks for the player: five illustrated portraits per gender.
// To switch a look to an illustration, put the file in public/assets/heroes/ and set its `image` (see artwork/hero-looks/PROMPTS.json).
export const LOOKS={
 male:[
  {id:'m1',label:'Короткая стрижка',skin:'#f1c9a5',hair:'#2f2a28',top:'#4a6fa5',style:'short',image:'hero-m1.webp'},
  {id:'m2',label:'Волнистые волосы',skin:'#e0ac7e',hair:'#6b4423',top:'#2f7d6d',style:'wavy',image:'hero-m2.webp'},
  {id:'m3',label:'Светлые волосы',skin:'#f6d7bd',hair:'#d6b25e',top:'#c0442d',style:'buzz',image:'hero-m3.webp'},
  {id:'m4',label:'Борода',skin:'#c68d63',hair:'#1f1b1a',top:'#6a5a8c',style:'short',beard:true,image:'hero-m4.webp'},
  {id:'m5',label:'Кудри',skin:'#8a5a3c',hair:'#141010',top:'#d9a441',style:'curly',image:'hero-m5.webp'}
 ],
 female:[
  {id:'f1',label:'Длинные волосы',skin:'#f1c9a5',hair:'#2b2220',top:'#c0442d',style:'long',image:'hero-f1.webp'},
  {id:'f2',label:'Каре',skin:'#e8b992',hair:'#8a3b24',top:'#4a6fa5',style:'bob',image:'hero-f2.webp'},
  {id:'f3',label:'Пучок',skin:'#f6d7bd',hair:'#d8b868',top:'#2f7d6d',style:'bun',image:'hero-f3.webp'},
  {id:'f4',label:'Кудри',skin:'#8a5a3c',hair:'#141010',top:'#8a5ca8',style:'curly',image:'hero-f4.webp'},
  {id:'f5',label:'Хвост',skin:'#d6a37a',hair:'#5a3a22',top:'#e08a3c',style:'ponytail',image:'hero-f5.webp'}
 ]
};
export const lookFor=(gender,id)=>(LOOKS[gender]??[]).find(look=>look.id===id)??null;
export const defaultLook=gender=>LOOKS[gender]?.[0]?.id??null;
// Paths drawn on a 64x64 canvas; `back` sits behind the head, `front` over the forehead.
const HAIR={
 short:{front:'M20 27c0-10 5-15 12-15s12 5 12 15c-3-5-7-7-12-7s-9 2-12 7z'},
 buzz:{front:'M21 25c1-8 5-12 11-12s10 4 11 12c-4-4-7-5-11-5s-7 1-11 5z'},
 wavy:{front:'M19 31c-2-13 4-20 13-20s15 7 13 20c-1-6-4-10-6-11-4 3-12 3-16 0-2 1-4 5-4 11z'},
 curly:{front:'<circle cx="21" cy="24" r="5"/><circle cx="27" cy="16" r="6"/><circle cx="37" cy="16" r="6"/><circle cx="43" cy="24" r="5"/><circle cx="32" cy="14" r="6"/>'},
 long:{back:'M17 34c-2-15 4-23 15-23s17 8 15 23v14H17z',front:'M20 28c1-9 5-14 12-14s11 5 12 14c-4-4-7-6-12-6s-8 2-12 6z'},
 bob:{back:'M17 36c-3-16 3-25 15-25s18 9 15 25c0 3-4 4-5 1H22c-1 3-5 2-5-1z',front:'M20 29c1-9 5-14 12-14s11 5 12 14c-4-4-7-6-12-6s-8 2-12 6z'},
 bun:{front:'<circle cx="32" cy="10" r="6"/><path d="M20 27c0-10 5-15 12-15s12 5 12 15c-3-5-7-7-12-7s-9 2-12 7z"/>'},
 ponytail:{back:'M40 14c9 0 12 8 9 20-1-6-3-10-7-12z',front:'M20 27c0-10 5-15 12-15s12 5 12 15c-3-5-7-7-12-7s-9 2-12 7z'}
};
const paint=(shape,fill)=>shape.startsWith('<')?`<g fill="${fill}">${shape}</g>`:`<path d="${shape}" fill="${fill}"/>`;
export function avatarMarkup(gender,id,{size=64}={}){
 const look=lookFor(gender,id);if(!look)return '';
 if(look.image)return `<img class="hero-avatar" src="./assets/heroes/${look.image}" alt="" width="${size}" height="${size}">`;
 const hair=HAIR[look.style];
 return `<svg class="hero-avatar" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true" focusable="false">`
  +`<circle cx="32" cy="32" r="32" fill="${look.top}" fill-opacity=".2"/>`
  +(hair.back?paint(hair.back,look.hair):'')
  +`<path d="M10 64c0-13 10-19 22-19s22 6 22 19z" fill="${look.top}"/>`
  +`<rect x="28" y="38" width="8" height="9" rx="3" fill="${look.skin}"/>`
  +`<ellipse cx="32" cy="29" rx="11" ry="13" fill="${look.skin}"/>`
  +(look.beard?`<path d="M21 30c0 9 4 15 11 15s11-6 11-15c-3 4-6 5-11 5s-8-1-11-5z" fill="${look.hair}"/>`:'')
  +paint(hair.front,look.hair)
  +`</svg>`;
}
