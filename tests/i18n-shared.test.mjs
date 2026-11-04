import assert from 'node:assert/strict';
// The browser loads one copy of i18n.js per distinct ?v= address; all copies must share one language and one dictionary.
const a=await import('../public/i18n.js?v=copy-a');
const b=await import('../public/i18n.js?v=copy-b');
assert.notEqual(a.t,b.t,'These really are two module instances');
a.configureTranslations({'Готово':'Done','Войти':'Log in'});
assert.equal(b.t('Готово'),'Готово','Russian stays Russian by default');
a.setLanguage('en');
assert.equal(b.getLanguage(),'en','The language chosen through one copy is seen by the other');
assert.equal(b.t('Готово'),'Done','The dictionary configured through one copy translates in the other');
b.setLanguage('ru');
assert.equal(a.t('Войти'),'Войти','...and the other way round');
// Every module of the app asks for the same address, so a stale cached copy cannot split the state in a browser that lacks globalThis sharing.
const fs=await import('node:fs');
const versions=new Set();
for(const file of fs.readdirSync(new URL('../public/',import.meta.url)).filter(f=>f.endsWith('.js')))for(const m of fs.readFileSync(new URL('../public/'+file,import.meta.url),'utf8').matchAll(/i18n\.js\?v=([^'"]+)/g))versions.add(m[1]);
assert.equal(versions.size,1,'i18n.js is imported under '+[...versions].join(', '));
console.log('i18n: one language and dictionary across module copies; every import uses the same address.');
