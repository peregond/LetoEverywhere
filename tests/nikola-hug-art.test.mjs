import test from 'node:test';
import assert from 'node:assert/strict';
import {NODES, presentationFor} from '../public/story.js';

test('Nikola hug artwork only appears on his accepted date with a male protagonist', () => {
 for (const i of [1,2,3]) {
  const node=NODES[`love1_${i}_yes`];
  const flags={lastPartner:'airport',companion:'nikola'};
  const art=presentationFor(node,node.pages[1],flags,{gender:'male'});
  assert.equal(art.bg,'nikola-hug-background-v1');
  assert.equal(art.cg,'nikola-hug-foreground-v1');
  assert.equal(art.composite,true);
  assert.notEqual(presentationFor(node,node.pages[0],flags,{gender:'male'}).cg,art.cg);
  assert.notEqual(presentationFor(node,node.pages[1],flags,{gender:'female'}).cg,art.cg);
  assert.notEqual(presentationFor(node,node.pages[1],{...flags,companion:'milica'},{gender:'male'}).cg,art.cg);
  assert.notEqual(presentationFor(node,node.pages[1],{...flags,lastPartner:'luka'},{gender:'male'}).cg,art.cg);
 }
});
