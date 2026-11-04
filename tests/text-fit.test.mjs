import assert from 'node:assert/strict';
import {splitToFit} from '../public/text-fit.js';
import {textLines} from '../public/text-size.js';
const fitsIn=limit=>text=>text.length<=limit;
// Short text stays one screen.
assert.deepEqual(splitToFit('Колёса касаются земли.',fitsIn(100)),['Колёса касаются земли.']);
assert.deepEqual(splitToFit('',fitsIn(10)),['']);
// Long text is cut into screens that all fit, lose no word, and prefer sentence ends.
const text='Паспортный контроль позади. Пока иду к багажу, ещё раз открываю переписку с Драганом. Он обещал встретить с ключами! Уже есть куда ехать.';
const chunks=splitToFit(text,fitsIn(60));
assert.ok(chunks.length>=3,String(chunks.length));
for(const chunk of chunks)assert.ok(chunk.length<=60,chunk);
assert.equal(chunks.join(' ').replace(/\s+/g,' '),text,'No word is lost or repeated');
assert.equal(splitToFit('Первое предложение тут. Второе предложение идёт дальше и дальше.',fitsIn(40))[0],'Первое предложение тут.','A screen stops at a sentence end when most of it is used');
assert.ok(chunks[0].length>=30,'Without a sentence end near the edge a screen is filled to the edge');
// A last screen never holds only one or two words.
for(const limit of [30,35,40,45,50,55,60,70]){const parts=splitToFit(text,fitsIn(limit));if(parts.length>1)assert.ok(parts.at(-1).split(/\s+/).length>=3,limit+': '+parts.at(-1));for(const part of parts)assert.ok(part.length<=limit||!part.includes(' '),limit+': '+part);}
// Line breaks inside the text are kept, and a word longer than the box still makes progress.
assert.equal(splitToFit('Раз.\nДва.',fitsIn(100))[0],'Раз.\nДва.');
assert.deepEqual(splitToFit('Супердлинноеслово ещё',fitsIn(5)).join(' '),'Супердлинноеслово ещё');
// The box grows with the text size.
assert.deepEqual([16,18,19,21,22,24].map(textLines),[5,5,6,6,7,7]);
console.log('Text fit: screens fit the box, keep every word, end on sentences, never leave a two-word tail.');
