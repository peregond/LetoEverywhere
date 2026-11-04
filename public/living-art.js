// Additive artwork layer: no scene IDs, dialogue order, choices or save fields change.
export const STORY_BACKGROUNDS = {
 'belgrade-green-market':{label:'БЕЛГРАД · ЗЕЛЁНЫЙ РЫНОК',description:'Зелень, овощи и мёд под навесами белградского рынка',position:'50% 48%'},
 'luka-sunlit-office':{label:'ЛУКА · КАБИНЕТ',description:'Кабинет Луки с деревянным столом и открытым окном на старый Белград',position:'50% 45%'},
 'belgrade-river-noon':{label:'НАБЕРЕЖНАЯ · ПОЛДЕНЬ',description:'Яркая река и скамейка в тени деревьев на белградской набережной',position:'50% 48%'},
 'belgrade-home-workspace':{label:'ДОМА · РАБОЧЕЕ МЕСТО',description:'Ноутбук и блокнот у открытого окна с видом на крыши Белграда',position:'50% 48%'},
 'belgrade-chapter-map':{label:'БЕЛГРАД · ТВОЙ МАРШРУТ',description:'Художественная панорама Белграда с реками, крепостью и летними улицами',position:'50% 50%'}
};
export const LIVING_BACKGROUND_SCENES = {
 'belgrade-green-market':['d25_o2'],
 'belgrade-chapter-map':['d25_end'],
 'luka-sunlit-office':['d8_start','d8_o1','d8_o2','d8_o3','d8_mid','d8_m1','d8_m2','d8_turn'],
 'belgrade-river-noon':['d19_start','d19_o1','d19_o2','d19_o3','d19_mid','d19_m1','d19_m2','d19_turn'],
 'belgrade-home-workspace':['d18_start','d18_o1','d18_o2','d18_o3','d18_mid','d18_m1','d18_m2']
};
export const REGULAR_MOODS=['friendly','thoughtful','laughing','flirty','shy','surprised','confident','worried'];
const names={milica:'Милица',nikola:'Никола',dragan:'Драган',jelena:'Йелена',asya:'Ася',luka:'Лука',lazar:'Лазар',teodora:'Теодора',ivana:'Ивана',strahinja:'Страхиня',milos:'Милош'};
const moodLabels={friendly:'Приветливость',thoughtful:'Задумчивость',laughing:'Смех',flirty:'Флирт',shy:'Смущение',surprised:'Удивление',confident:'Уверенность'};
export function applyLivingArt(nodes,backgrounds,sprites){
 Object.assign(backgrounds,STORY_BACKGROUNDS);
 for(const[bg,ids]of Object.entries(LIVING_BACKGROUND_SCENES))for(const id of ids){if(!nodes[id])throw Error('Unknown art scene '+id);nodes[id].bg=bg;nodes[id].districtBg=false;}
 for(const[id,name]of Object.entries(names)){
  sprites[id]??={};
  for(const mood of REGULAR_MOODS.filter(mood=>mood!=='worried')){
   if(sprites[id][mood])continue;
   sprites[id][mood]={file:mood==='confident'?id+'-confident'+(id==='nikola'?'-buzz-v3':''):id+'-'+mood+'-living',alt:name+' · '+moodLabels[mood]};
  }
 }
 for(const mood of ['shy','surprised','confident'])sprites['nikola-evening'][mood]={file:'nikola-evening-'+mood+'-buzz-v3',alt:'Никола · После смены · '+moodLabels[mood]};
 sprites['milos-masked']={friendly:{file:'workshop/milos-masked-friendly-v2-draft',alt:'Милош · В балаклаве и защитной форме'}};
 sprites['milos-uniform']={friendly:{file:'milos-uniform-friendly',alt:'Милош · В форме без балаклавы'}};
 // Deliberately authored reactions, limited to the lines they accompany.
 for(const[id,index,character,mood]of [
  ['luka_hello',3,'luka','confident'],['rain_luka',0,'luka','surprised'],['rain_luka_close',2,'luka','shy'],
  ['rain_asya',0,'asya','confident'],['asya_meeting',2,'asya','surprised'],['rain_asya_close',0,'asya','shy'],
  ['nikola_places',0,'nikola','confident'],['d8_start',1,'luka','confident'],['d8_turn',1,'asya','laughing'],
  ['d17_lazar',1,'lazar','confident'],['d17_teodora',1,'teodora','confident'],
  ['d17_bank_talk',0,'lazar','thoughtful'],['d17_bank_talk',0,'teodora','thoughtful'],
  ['d17_bank_joke',1,'lazar','laughing'],['d17_bank_joke',1,'teodora','laughing'],
  ['d20_mup_talk',0,'ivana','thoughtful'],['d20_mup_talk',0,'strahinja','thoughtful'],
  ['d27_milos',0,'milos','confident']
 ]){const page=nodes[id].pages[index];page.reactions??={};page.reactions[character]=mood;}
}
export function additionalPortrait(page,flags={}){
 if(page.message||page.portrait===false)return null;
 if(page.speaker==='bankStaff')return flags.bankSpark==='teodora'?'teodora':'lazar';
 if(page.speaker==='mupStaff')return flags.mupSpark==='ivana'?'ivana':'strahinja';
 if(page.speaker==='Человек в балаклаве')return 'milos-masked';
 return null;
}
