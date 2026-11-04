import {BAGGAGE_ITEMS} from './baggage-model.js?v=1';
import {HOME_PORTRAITS,HOME_BACKGROUNDS} from './home-hero-model.js?v=0.17.2';
import {EPISODIC_PEOPLE} from './episodic-cast.js?v=2';
import {NIKOLA_EARLY_NIGHT_BACKGROUNDS} from './nikola-early-night.js?v=0.17.2';
export const PEOPLE = {
  milica: 'Милица', nikola: 'Никола', dragan: 'Драган', jelena: 'Йелена',
  asya: 'Ася', luka: 'Лука', lazar: 'Лазар', teodora: 'Теодора',
  ivana: 'Ивана', strahinja: 'Страхиня', milos: 'Милош'
};
export const RENTAL_PEOPLE = {marko:'Марко',vuk:'Вук',stefan:'Стефан',ana:'Ана'};
export const EMOTIONS = { friendly: 'Приветливость', thoughtful: 'Задумчивость', laughing: 'Смех', flirty: 'Флирт', shy: 'Смущение', surprised: 'Удивление', confident: 'Уверенность', worried: 'Беспокойство' };
export const CORE_EMOTIONS = Object.keys(EMOTIONS);
export function acceptsWorkshopCode(value) {
  return typeof value === 'string' && value.normalize('NFKC').trim().toLocaleLowerCase('ru') === 'грызуны';
}
export function buildArtCatalog(files, sprites, backgrounds) {
  const active = new Set(Object.values(sprites).flatMap(moods => Object.values(moods).map(v => v.file + '.webp')));
  for (const name of Object.keys(backgrounds)) active.add(name + '.webp');
  for(const portrait of Object.values(HOME_PORTRAITS))active.add(portrait.file);
  for(const file of Object.values(HOME_BACKGROUNDS))active.add(file);
  const baggageAssets=new Set(['baggage/search-carousel-v2.webp',...BAGGAGE_ITEMS.map(item=>'baggage/'+item.id+'.webp')]);
  for(const file of baggageAssets)active.add(file);
  const entries = files.map(file => {
    const base = file.split('/').at(-1);
    const person = Object.keys(RENTAL_PEOPLE).find(id => base.startsWith('rental-'+id+'-')) ?? Object.keys({...PEOPLE,...RENTAL_PEOPLE,...EPISODIC_PEOPLE}).find(id => base === id + '.webp' || base.startsWith(id + '-'));
    const image = /\.(webp|png|svg|jpe?g)$/i.test(file);
    const icon = /icon|poster|sketch/.test(base);
    const background = Object.hasOwn(backgrounds, base.replace(/\.webp$/, ''));
    // Composite character scenes remain part of their portrait gallery. A location
    // named after someone (for example Luka’s office) is still a background.
    const intimacy = file.startsWith('workshop/nikola-intimacy/') || (base !== 'nikola-apartment-night-v1.webp' && Object.hasOwn(NIKOLA_EARLY_NIGHT_BACKGROUNDS, base.replace(/\.webp$/, '')));
    const composite = intimacy || /^(milica-table-|(?:dragan|jelena)-kitchen-)/.test(base);
    const character = image && !icon && (!background || composite) ? person : undefined;
    const draft = file.startsWith('workshop/');
    const specialPose = /-(?:swim|camera|workshop|door|headphones|guide|napkin|show|wave|riverside|pointing)(?:-|\.)/.test(base);
    const emotion = intimacy ? null : Object.keys(EMOTIONS).find(mood => base.includes('-' + mood)) ?? (character && !specialPose && !/kitchen|dream/.test(base) ? 'friendly' : null);
    const dayLook=base.match(/-day([234])-/);
    const look = intimacy ? 'Интимные сцены · 18+' : dayLook ? `День ${dayLook[1]}` : /-swim-/.test(base) ? 'У воды' : specialPose ? 'Сюжетная поза' : /^dragan-evening-.*-v[12]\.webp$/.test(base) ? 'Вечерняя прогулка' : file.startsWith('home/') ? 'Главный экран' : Object.hasOwn(EPISODIC_PEOPLE,person) ? 'Эпизодический образ' : /dream-underwear/.test(base) ? 'Бельё' : /masked/.test(base) ? 'На службе · riot-экипировка' : /uniform/.test(base) ? 'В форме без балаклавы' : /casual/.test(base) ? 'Без формы' : /two-looks/.test(base) ? 'В форме и без формы' : /kitchen/.test(base) ? 'На кухне' : /table/.test(base) ? 'За столиком' : /evening/.test(base) ? 'После смены' : /dream/.test(base) ? 'Фантазия' : person === 'milos' ? 'Без формы' : 'Основной образ';
    const category = character ? 'characters' : image ? ((Object.hasOwn(backgrounds, base.replace(/\.webp$/, '')) || Object.values(HOME_BACKGROUNDS).includes(file) || file.startsWith('baggage/search-carousel')) ? 'backgrounds' : 'images') : /\.(m4a|mp3|ogg|wav)$/i.test(file) ? 'audio' : /\.(ttf|woff2?)$/i.test(file) ? 'fonts' : 'other';
    const retired = file === 'workshop/milos-two-looks-draft.webp';
    return { file, character, category, image, emotion, look, status: retired ? 'archive' : active.has(file) ? 'active' : draft ? 'draft' : character ? 'archive' : 'asset' };
  });
  const buildPerson = ([id, name]) => {
    const art = entries.filter(e => e.character === id);
    // Archived versions must not hide gaps in the current design. Drafts are visible but not marked as in-game.
    const current = art.filter(e => ['active', 'draft'].includes(e.status) && ['Основной образ', 'Без формы'].includes(e.look));
    const missing = CORE_EMOTIONS.filter(mood => !current.some(e => e.emotion === mood));
    const regularLooks = ['Основной образ', 'Без формы', 'После смены', 'На службе · riot-экипировка', 'В форме без балаклавы'];
    const looks = regularLooks.filter(look => art.some(e => e.look === look && ['active', 'draft'].includes(e.status))).map(look => {
      const available = art.filter(e => e.look === look && ['active', 'draft'].includes(e.status));
      const activeMoods = CORE_EMOTIONS.filter(mood => available.some(e => e.emotion === mood && e.status === 'active'));
      return { name: look, activeCount: activeMoods.length, missing: CORE_EMOTIONS.filter(mood => !available.some(e => e.emotion === mood)), missingInGame: CORE_EMOTIONS.filter(mood => !activeMoods.includes(mood)) };
    });
    const underwear=art.find(entry=>entry.look==='Бельё'&&['active','draft'].includes(entry.status))??null;
    return { id, name, art, missing, looks, underwear };
  };
  const people=Object.entries(PEOPLE).map(buildPerson);
  const rentals=Object.entries(RENTAL_PEOPLE).map(buildPerson);
  const supporting=Object.entries(EPISODIC_PEOPLE).map(([id,name])=>{
    const art=entries.filter(entry=>entry.character===id);
    const missing=art.some(entry=>entry.emotion==='friendly'&&['active','draft'].includes(entry.status))?[]:['friendly'];
    return{id,name,art,missing};
  });
  return { entries, people, rentals, supporting };
}
