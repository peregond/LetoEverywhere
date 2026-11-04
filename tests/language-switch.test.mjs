import assert from 'node:assert/strict';
import {LANGUAGES,flagMarkup} from '../public/language-switch.js';
// The list drives the switch: two languages draw a slider, more draw a dropdown (see mountLanguageSwitch).
assert.deepEqual(LANGUAGES.map(l=>l.code),['ru','en']);
for(const language of LANGUAGES){assert.ok(language.label&&language.flag);assert.match(flagMarkup(language.flag),/^<svg class="flag"[^>]*viewBox="0 0 24 24"/);}
assert.match(flagMarkup('ru'),/#d52b1e/);assert.match(flagMarkup('gb'),/#c8102e/);
assert.match(flagMarkup('xx',20),/width="20"[\s\S]*#9aa8ad/,'An unknown flag draws a neutral circle');
const source=await import('node:fs').then(fs=>fs.readFileSync(new URL('../public/language-switch.js',import.meta.url),'utf8'));
assert.match(source,/languages\.length<=2\?'slider':'menu'/,'The switch turns into a menu above two languages');
console.log('Language switch: two flags, neutral fallback flag, slider-to-menu rule checked.');
