// Only presentation changes: scene IDs, dialogue indices, choices and effects stay intact.
export const EXPANDED_BACKGROUNDS = {
  'police-station-break': {
    label: 'ОТДЕЛЕНИЕ · МЕСТО ДЛЯ ПЕРЕРЫВОВ',
    description: 'Лавка у металлического забора районного отделения полиции в Белграде',
    position: '50% 50%'
  },
  'belgrade-park-bench': {
    label: 'БЕЛГРАД · СКВЕР',
    description: 'Тенистый сквер со скамейкой, фонтаном и шахматными столами',
    position: '50% 45%'
  },
  'belgrade-kiosk-street': {
    label: 'БЕЛГРАД · У ОСТАНОВКИ',
    description: 'Улица с газетным киоском, трамвайной остановкой и небольшими магазинами',
    position: '50% 45%'
  },
  'belgrade-kitchen-evening': {
    label: 'КУХНЯ · ВЕЧЕР',
    description: 'Уютная кухня с чайником, чашками и накрытым столом в вечернем свете',
    position: '50% 45%'
  }
};
export const BACKGROUND_SCENES = {
  'police-station-break': ['d4_station', 'd4_station_ask', 'd9_station', 'd17_station'],
  'belgrade-park-bench': ['d3_m2', 'd25_o3'],
  'belgrade-kiosk-street': ['d3_start', 'd3_turn'],
  'belgrade-kitchen-evening': ['d17_turn', 'd20_nephew', 'd20_nephew_end']
};
export function applyArtExpansion(nodes, backgrounds) {
  Object.assign(backgrounds, EXPANDED_BACKGROUNDS);
  for (const [bg, ids] of Object.entries(BACKGROUND_SCENES)) {
    for (const id of ids) {
      if (!nodes[id]) throw new Error('Unknown artwork scene: ' + id);
      nodes[id].bg = bg;
      // The generic district-room override would otherwise conceal the kitchen.
      if (nodes[id].districtBg) nodes[id].districtBg = false;
    }
  }
}
