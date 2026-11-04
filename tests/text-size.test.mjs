import assert from 'node:assert/strict';
import {MIN_SIZE,MAX_SIZE,DEFAULT_SIZE,clampSize,textSizeMarkup,bindTextSize} from '../public/text-size.js';
import {THEME_ICONS} from '../public/theme-icons.js';
assert.deepEqual([MIN_SIZE,MAX_SIZE,DEFAULT_SIZE],[16,24,18]);
assert.equal(clampSize(18),18);assert.equal(clampSize(99),24);assert.equal(clampSize(3),16);assert.equal(clampSize('20'),20);assert.equal(clampSize(undefined),18);assert.equal(clampSize(17.6),18);
const html=textSizeMarkup({size:16});
assert.match(html,/id="text-size-down"[^>]*disabled/);assert.doesNotMatch(html,/id="text-size-up"[^>]*disabled/);assert.match(html,/16 px/);
assert.match(html,/id="text-size-preview"[^>]*--text-size:16px/,'The preview starts at the saved size');assert.doesNotMatch(html,/stepper-bars/,'The preview replaces the level bars');
// Taps move the size, update the label and the preview, and report the new size.
const make=()=>({disabled:false,textContent:'',handlers:{},addEventListener(t,fn){this.handlers[t]=fn;}});
const props=new Map();
const els={'#text-size-down':make(),'#text-size-up':make(),'#text-size-level':make(),'#text-size-preview':{style:{setProperty:(k,v)=>props.set(k,v)}}};
const seen=[];bindTextSize({querySelector:s=>els[s]},{size:23,onChange:v=>seen.push(v)});
els['#text-size-up'].handlers.click();assert.deepEqual(seen,[24]);assert.equal(props.get('--text-size'),'24px');assert.equal(els['#text-size-level'].textContent,'24 px');assert.equal(els['#text-size-up'].disabled,true);
els['#text-size-up'].handlers.click();assert.equal(seen.length,1);
els['#text-size-down'].handlers.click();assert.deepEqual(seen,[24,23]);assert.equal(props.get('--text-size'),'23px');
// Theme icons: one per theme preference, drawn in the text colour.
assert.deepEqual(Object.keys(THEME_ICONS),['system','light','dark']);
for(const icon of Object.values(THEME_ICONS))assert.match(icon,/^<svg[^>]*stroke="currentColor"[^>]*aria-hidden="true"/);
console.log('Text size: nine steps, clamped, live preview and theme icons checked.');
