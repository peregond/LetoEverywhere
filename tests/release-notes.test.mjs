import assert from 'node:assert/strict';
import {APP_VERSION} from '../public/release.js';
import {RELEASE_NOTES} from '../public/release-notes.js';
assert.equal(RELEASE_NOTES[0][0],APP_VERSION,'The current release appears first');
assert.equal(new Set(RELEASE_NOTES.map(([version])=>version)).size,RELEASE_NOTES.length,'Each version appears once');
for(const [version,ru,en] of RELEASE_NOTES){assert.match(version,/^\d+\.\d+\.\d+$/);assert.ok(ru&&en,'Each release has Russian and English notes');}
console.log('Release notes contain a current, unique and bilingual version history.');
