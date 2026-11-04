// Presentation only. Scene IDs, dialogue order, choices and save fields stay as they are.
// New pictures cover the prologue, day 0 (chapter 1, "Своя дверь") and day 1 (chapter 2, "Район для жизни").
import {EVENING_NODES} from './host-evening.js?v=0.17.2';

export const EARLY_BACKGROUNDS = {
  'belgrade-taxi-blocks-v2': {label:'БЕЛГРАД · БАЛКОНЫ', description:'Историческая улица Белграда с балконами и бельём, вид из такси', position:'50% 42%'},
  'belgrade-taxi-sava-glare-v1': {label:'БЕЛГРАД · САВА', description:'Бранков мост и слепящая река из окна машины', position:'50% 40%'},
  'belgrade-slavija-drive-v1': {label:'БЕЛГРАД · СЛАВИЯ', description:'Кольцо Славии с фонтаном, вид из машины', position:'50% 42%'},
  'skadarlija-evening-v1': {label:'БЕЛГРАД · СКАДАРЛИЯ', description:'Вечерняя брусчатка Скадарлии, кафе и фонари', position:'50% 46%'},
  'skadarlija-kafana-v1': {label:'БЕЛГРАД · КАФАНА', description:'Терраса кафаны: свечи, лозы, хлеб и айвар', position:'50% 48%'},
  'knez-mihailova-evening-v1': {label:'БЕЛГРАД · КНЕЗ МИХАИЛОВА', description:'Пешеходная Кнез Михаилова вечером, столик у фасада', position:'50% 46%'},
  'dorcol-kalemegdan-v1': {label:'ДОРЋОЛ · КАЛЕМЕГДАН', description:'Старые дома Дорћола и стены крепости Калемегдан', position:'50% 48%'},
  'dorcol-workshop-court-v1': {label:'ДОРЋОЛ · МАСТЕРСКАЯ', description:'Двор с открытой мастерской и опилками', position:'50% 50%'},
  'vracar-saint-sava-v1': {label:'ВРАЧАР · СВЯТОЙ САВВА', description:'Зелёная улица Врачара и купол храма Святого Саввы', position:'50% 42%'},
  'new-belgrade-blocks-v1': {label:'НОВЫЙ БЕЛГРАД · БЛОКИ', description:'Широкая улица между жилыми блоками и автобус', position:'50% 46%'},
  'belgrade-waterfront-taxi-v1': {label:'БЕЛГРАД · НА ВОДЕ', description:'Стеклянные башни у Савы, вид из такси', position:'50% 40%'},
  'sava-branko-promenade-v1': {label:'САВА · БРАНКОВ МОСТ', description:'Вечерняя набережная под аркой Бранкова моста', position:'50% 48%'}
};

const react = (page, extra) => { page.reactions = {...(page.reactions ?? {}), ...extra}; };
const paint = (nodes, id, bg) => { nodes[id].bg = bg; for (const page of nodes[id].pages) page.bg = bg; };

export function applyEarlyCityArt(nodes, backgrounds, sprites) {
  Object.assign(backgrounds, EARLY_BACKGROUNDS);
  sprites.nikola.guide = {file:'nikola-guide-buzz-v3', alt:'Никола показывает маршрут на телефоне'};
  sprites.nikola.napkin = {file:'nikola-napkin-buzz-v3', alt:'Никола протягивает салфетки'};
  sprites.milica.show = {file:'milica-show-v1', alt:'Милица показывает рисунок в блокноте'};
  sprites.milica.wave = {file:'milica-wave-v1', alt:'Милица машет на прощание'};
  sprites.milica.riverside = {file:'milica-riverside-v1', alt:'Милица на набережной с блокнотом'};
  sprites['nikola-evening'].wave = {file:'nikola-evening-wave-buzz-v3', alt:'Никола после смены машет рукой'};
  sprites.asya.pointing = {file:'asya-pointing-v1', alt:'Ася показывает дорогу'};
  const arrival = {ana:'Ана с камерой на плече', stefan:'Стефан вытирает опилки с рук', marko:'Марко придерживает дверь', vuk:'Вук снимает наушники'};
  const arrivalFile = {ana:'ana-camera-v1', stefan:'stefan-workshop-v1', marko:'marko-door-v1', vuk:'vuk-headphones-v2'};
  for (const id of Object.keys(arrival)) sprites[id].arrival = {file:arrivalFile[id], alt:arrival[id]};
  sprites.vuk.coffee={file:'vuk-coffee-v1',alt:'Вук с чашкой кофе'};
  for (const mood of ['friendly','thoughtful','laughing','flirty']) {
    const look = {friendly:'тёплая улыбка', thoughtful:'слушает', laughing:'смеётся', flirty:'заинтересованный взгляд'}[mood];
    sprites.jelena['evening-'+mood] = {file:'jelena-stroll-'+mood+'-v1', alt:'Йелена вечером: '+look};
  }

  nodes.road_start.pages[2].bg = 'belgrade-taxi-blocks-v2';
  nodes.road_start.pages[3].bg = 'belgrade-taxi-sava-glare-v1';
  nodes.road_window.pages[2].bg = 'belgrade-slavija-drive-v1';
  paint(nodes, 'host_old_town', 'skadarlija-evening-v1');
  nodes.host_old_town.pages.at(-1).bg = 'skadarlija-kafana-v1';
  paint(nodes, 'host_terrace', 'skadarlija-kafana-v1');
  paint(nodes, 'host_terrace_meal', 'skadarlija-kafana-v1');
  for (const id of EVENING_NODES) for (const page of nodes[id].pages) {
    const mood = ['friendly','thoughtful','laughing','flirty'].includes(page.emotion) ? page.emotion : 'friendly';
    react(page, {jelena:'evening-'+mood});
  }
  paint(nodes, 'date_friends', 'knez-mihailova-evening-v1');
  paint(nodes, 'date_river', 'sava-branko-promenade-v1');
  paint(nodes, 'date_hand', 'sava-branko-promenade-v1');
  nodes.district_dorcol.pages[0].bg = 'dorcol-kalemegdan-v1';
  nodes.district_vracar.pages[0].bg = 'vracar-saint-sava-v1';
  nodes.district_newbelgrade.pages[0].bg = 'new-belgrade-blocks-v1';
  nodes.flat_enter_ana.pages[0].bg = 'dorcol-kalemegdan-v1';
  nodes.flat_enter_stefan.pages[0].bg = 'dorcol-workshop-court-v1';
  nodes.flat_enter_marko.pages[0].bg = 'vracar-saint-sava-v1';
  nodes.flat_enter_vuk.pages[0].bg = 'new-belgrade-blocks-v1';
  react(nodes.flat_enter_vuk.pages[0], {vuk:'arrival'});
  nodes.flat_move_day.pages.at(-1).bg = 'belgrade-waterfront-taxi-v1';

  react(nodes.nikola_directions.pages[1], {nikola:'guide'});
  react(nodes.nikola_goodbye.pages[1], {nikola:'napkin'});
  react(nodes.milica_hello.pages[2], {milica:'show'});
  const farewell = nodes.exit.pages.find(page => page.text?.includes('Вечернее солнце'));
  react(farewell, {milica:'wave'});
  for (const id of ['river_meeting','date_river']) react(nodes[id].pages[1], {'nikola-evening':'wave', milica:'riverside'});
  for (const owner of ['ana','stefan','marko','vuk']) {
    react(nodes['flat_enter_'+owner].pages[1], {[owner]:'arrival'});
    react(nodes['flat_enter_'+owner].pages[4], {asya:'pointing'});
  }
  // Day 2 also shows Asya in person; the new pose has to appear there or the outfit check treats it as unused.
  react(nodes.work_summary.pages[2], {asya:'pointing'});
}
