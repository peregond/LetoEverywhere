import assert from 'node:assert/strict';
import {chapterAvailable,acceptsChapterCode,unlockPreview,hasPreviewAccess,hasChapterDebugAccess} from '../public/chapter-access.js?v=0.16.1';
import {CHAPTERS} from '../public/chapters.js?v=0.16.1';
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};
for(const chapter of CHAPTERS){assert.equal(chapterAvailable(chapter),!chapter.day||chapter.day<=5);assert.equal(chapterAvailable(chapter,true),true);}
assert.equal(hasPreviewAccess(),false);
for(const code of ['Vuchich','грызуны','',null])assert.equal(acceptsChapterCode(code),false);
assert.equal(unlockPreview('  ВУЧИЧ  '),true);assert.equal(hasPreviewAccess(),true);
assert.equal(hasChapterDebugAccess(),false,'The original code does not enable debugging');
assert.equal(memory.size,1);assert.equal(memory.has('serbian-summer-save-v1'),false);
assert.equal(unlockPreview('  ОлЕг  '),true);assert.equal(hasChapterDebugAccess(),true);assert.equal(hasPreviewAccess(),true);
assert.equal(memory.has('serbian-summer-save-v1'),false,'Entering the code does not modify progress');
console.log('Public preview ends after day 5; Cyrillic promo opens later days without changing saves.');
