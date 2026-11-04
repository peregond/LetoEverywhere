import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CHAPTERS} from '../public/chapters.js';
import {STAGES} from '../public/days.js';
const dictionary=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url),'utf8'));
const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../public/belgrade.html',import.meta.url),'utf8');
// The chapter card exists as a screen and has its own stylesheet.
assert.match(html,/id="chapter-card" class="screen chapter-card"/);assert.match(html,/chapter-card\.css/);
assert.ok(fs.existsSync(new URL('../public/chapter-card.css',import.meta.url)));
// Every forward step that can cross a chapter asks for the card; going back, resuming and restoring do not.
const asks=app.split('wantCard=true').length-1;assert.equal(asks,4,'advance, choice, beat action and "continue" ask for a card');
assert.match(app,/previousChapter!==chapter\.id&&state\.node===chapter\.start&&state\.index===0/);
// The save prompt is only for guests the cloud has finished checking, and it is also shown on the final screen.
assert.match(app,/function isGuest\(\)\{return !!cloud\?\.ready&&!cloud\.user;\}/);
assert.match(app,/if\(isGuest\(\)\)inner\.append\(drawSavePrompt\(\)\)/);assert.match(app,/drawEndingPrompt\(\);\n\}/);
// Every label the card draws has an English translation, for every chapter.
for(const key of ['ДЕНЬ','ИЗ 15','День','из 15','завершён','ПЕРЕД ПЕРВЫМ ДНЁМ','ПРОЛОГ','Начать день','Начать','Сохрани прогресс','Создать аккаунт','Уже есть аккаунт? Войти'])assert.ok(Object.hasOwn(dictionary,key),key);
for(const chapter of CHAPTERS){for(const key of [chapter.number,chapter.title,chapter.description])assert.ok(Object.hasOwn(dictionary,key),key);if(chapter.day)assert.ok(Object.hasOwn(dictionary,STAGES[chapter.stage]),chapter.stage);}
// There are thirty progress marks and the card knows each day's stage.
assert.equal(CHAPTERS.filter(c=>c.day).length,15);assert.ok(CHAPTERS.filter(c=>c.day).every(c=>c.stage));
console.log('Chapter card: a title card on every chapter change, a save prompt for guests only, translations for every chapter.');
