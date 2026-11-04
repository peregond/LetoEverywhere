// Visual staging only. This layer never edits dialogue, choices, effects or save data.
export const EXTRA_BACKGROUNDS={
 'belgrade-desk-night':{label:'У СТОЛА · НОЧЬ',description:'Тёплая лампа, блокнот и закрытый ноутбук на столе с видом на ночной Белград',position:'50% 45%'},
 'belgrade-room-night':{label:'КОМНАТА · НОЧЬ',description:'Тихая комната с тёплой лампой и ночными крышами за окном',position:'50% 46%'},
 'belgrade-room-morning':{label:'КОМНАТА · ЛЕТНЕЕ УТРО',description:'Утренний свет, открытые ставни и ещё не убранная постель',position:'50% 46%'},
 'belgrade-kitchen-day':{label:'КУХНЯ · ПОСЛЕ ОБЕДА',description:'Чайник, хлеб и три чашки на светлой белградской кухне',position:'50% 45%'},
 'asya-home-evening':{label:'У АСИ · ВЕЧЕР',description:'Уютная комната Аси с книгами, растениями, абрикосами и чашками чая',position:'50% 46%'},
 'belgrade-cafe-twilight':{label:'КАФЕ · СУМЕРКИ',description:'Небольшая терраса белградского кафе с тёплыми огнями в сумерках',position:'50% 46%'},
 'belgrade-courtyard-morning':{label:'ДВОР · УТРО ПОСЛЕ КИНО',description:'Пустые стулья, свёрнутый экран и забытая куртка в солнечном дворе',position:'50% 46%'},
 'airport-departure-lounge':{label:'АЭРОПОРТ · ЗАЛ ВЫЛЕТА',description:'Зал вылета с синими креслами и самолётами за высокими окнами',position:'50% 48%'},
 'rain-cafe-window-detail':{label:'КАФЕ · ДОЖДЬ ЗА ОКНОМ',description:'Капли на стекле, три чашки кофе и мокрая белградская улица',position:'50% 46%'},
 'belgrade-neighbourhood-bakery':{label:'РАЙОН · СВОЯ БУЛОЧНАЯ',description:'Кифле, бурек и хлеб в маленькой районной булочной Белграда',position:'50% 48%'},
 'budget-desk-detail':{label:'ДОМА · БЮДЖЕТ',description:'Тетрадь расходов, калькулятор и динары на столе у окна',position:'50% 46%'},
 'insurance-workspace-detail':{label:'ДОМА · ВЫБОР ПОЛИСА',description:'Ноутбук со сравнением полисов, папка, паспорт и стакан воды',position:'50% 46%'},
 'translation-papers-detail':{label:'ДОМА · ПЕРЕВОДЫ И СПРАВКИ',description:'Паспорт, конверт и бумаги для перевода на домашнем столе',position:'50% 46%'},
 'airplane-river-view':{label:'НАД БЕЛГРАДОМ · РЕКИ',description:'Сава, Дунай и летние крыши Белграда через окно самолёта',position:'50% 47%'},
 'airplane-city-night':{label:'НАД БЕЛГРАДОМ · ОГНИ',description:'Огни Белграда и тёмные реки через окно взлетающего самолёта',position:'50% 47%'}
};
export const EXTRA_BACKGROUND_SCENES={
 'belgrade-desk-night':['d6_end','d7_end','d8_end','d10_end','d11_end','d18_end'],
 'belgrade-kitchen-evening':['d20_end','d26_turn'],
 'belgrade-park-bench':['d25_turn'],
 'belgrade-room-night':['d3_end','d4_end','d17_end','chapter_four_close','chapter_five_close','cinema_tomorrow','chapter_six_close','d9_end','d14_end','d22_end','d23_mid','d23_m1','d23_m2','d23_turn','d23_end','d24_end','d26_end','d27_end'],
 'belgrade-room-morning':['d25_start'],
 'belgrade-kitchen-day':['d9_turn'],
 'asya-home-evening':['d5_turn','d14_turn','d24_turn','d27_turn'],
 'belgrade-cafe-twilight':['final_luka','d20_mup_coffee','d24_bank_coffee'],
 'belgrade-neighbourhood-bakery':['d25_o1'],
 'budget-desk-detail':['d24_start','d24_o1','d24_o2','d24_o3','d24_mid','d24_m1','d24_m2'],
 'insurance-workspace-detail':['d13_start','d13_o1','d13_o2','d13_o3','d13_mid','d13_m1','d13_m2'],
 'translation-papers-detail':['d10_start','d10_o1','d10_o2','d10_o3','d10_mid','d10_m1','d10_m2'],
 'airport-departure-lounge':['epilogue_leave','epilogue_return'],
 // A conversation at the embankment must leave the insurance desk behind.
 'riverside-evening':['d13_turn']
};
export const PAGE_BACKGROUNDS=[
 ['chapter_four_close',0,'belgrade-night-walk'],
 ['d5_end',0,'belgrade-night-walk'],['d5_end',1,'belgrade-room-night'],
 ['d22_o3',1,'belgrade-courtyard-morning'],['rain_break',0,'rain-cafe-window-detail'],
 ['epilogue_leave',4,'airplane-city-night'],['epilogue_return',4,'airplane-river-view']
];
const extras=new WeakMap();
const restagedLocations=new WeakSet();
export function hasRestagedLocation(node){return restagedLocations.has(node);}
export function extraVisualFor(page,flags={}){const get=extras.get(page);return get?get(flags):{};}
export function applyAbundantArt(nodes,backgrounds,sprites){
 Object.assign(backgrounds,EXTRA_BACKGROUNDS);
 for(const[bg,ids]of Object.entries(EXTRA_BACKGROUND_SCENES))for(const id of ids){if(!nodes[id])throw Error('Unknown art scene '+id);nodes[id].bg=bg;nodes[id].districtBg=false;restagedLocations.add(nodes[id]);}
 for(const[id,index,bg]of PAGE_BACKGROUNDS)nodes[id].pages[index].bg=bg;
 const people={milica:'Милица',nikola:'Никола',dragan:'Драган',jelena:'Йелена',asya:'Ася',luka:'Лука',lazar:'Лазар',teodora:'Теодора',ivana:'Ивана',strahinja:'Страхиня',milos:'Милош','nikola-evening':'Никола · После смены'};
 for(const[id,name]of Object.entries(people))sprites[id].worried={file:id+'-worried'+(id.startsWith('nikola')?'-buzz-v3':''),alt:name+' · Беспокойство'};
 for(const look of ['masked','uniform'])for(const mood of ['thoughtful','laughing','flirty','shy','surprised','confident','worried']){
  const names={thoughtful:'Задумчивость',laughing:'Смех',flirty:'Флирт',shy:'Смущение',surprised:'Удивление',confident:'Уверенность',worried:'Беспокойство'};
  sprites['milos-'+look][mood]={file:'milos-'+look+'-'+mood,alt:'Милош · '+(look==='masked'?'В балаклаве':'В форме без балаклавы')+' · '+names[mood]};
 }
 for(const[id,index,characters,mood]of [
  ['honest',4,['milica'],'worried'],['nikola_new',0,['nikola'],'worried'],
  ['host_practical',3,['dragan','jelena'],'worried'],
  ['work_options',0,['luka'],'worried'],['work_options',2,['asya'],'worried'],
  ['d17_bank_talk',0,['lazar','teodora'],'worried'],
  ['d20_mup_talk',0,['ivana','strahinja'],'worried'],
  ['d4_station_ask',0,['milos-masked'],'confident'],['d9_station',1,['milos-masked'],'thoughtful'],
  ['d27_milos',1,['milos'],'thoughtful']
 ])for(const character of characters){nodes[id].pages[index].reactions??={};nodes[id].pages[index].reactions[character]=mood;}
 // Keep the person present during adjacent in-person narration, rather than
 // flashing to an empty location between their spoken lines.
 const officeGroups=[
  {ids:['d17_lazar','d17_teodora','d17_bank_talk','d17_bank_joke','d24_bank','d24_bank_coffee','d24_bank_chat'],person:flags=>flags.bankSpark==='teodora'?'teodora':'lazar'},
  {ids:['d20_ivana','d20_strahinya','d20_mup_talk','d20_mup_reply','d20_mup_coffee','d26_mup','d26_mup_end'],person:flags=>flags.mupSpark==='ivana'?'ivana':'strahinja'}
 ];
 for(const group of officeGroups)for(const id of group.ids)nodes[id].pages.forEach((page,index)=>{
  if(page.speaker==='narrator'&&!page.message)extras.set(page,flags=>({character:group.person(flags),emotion:id==='d17_bank_joke'?'laughing':index===0?'friendly':'thoughtful'}));
 });
 // Keep character identity and clothes consistent throughout the reveal and walk.
 for(const index of [0,2])extras.set(nodes.d20_nephew.pages[index],()=>({character:'milos-uniform',emotion:index===0?'surprised':'thoughtful'}));
 extras.set(nodes.d20_nephew_end.pages[0],flags=>({character:'milos-uniform',emotion:flags.maskEnd==='spark'?'shy':flags.maskEnd==='secret'?'laughing':'friendly'}));
 extras.set(nodes.d20_nephew_end.pages[1],()=>({character:'milos-uniform',emotion:'friendly'}));
 extras.set(nodes.d27_milos.pages[1],()=>({character:'milos',emotion:'thoughtful'}));
 // The last frame takes place later in the flight, after the departure-gate time.
 extras.set(nodes.epilogue_leave.pages[4],()=>({time:'Позже'}));
}
