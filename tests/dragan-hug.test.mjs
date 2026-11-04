import {strict as assert} from 'node:assert';
import {NODES,presentationFor} from '../public/story.js';

const node=NODES.host_evening_close;
for(const gender of ['male','female']){
  const profile={gender};
  const result=presentationFor(node,node.pages[4],{host:'dragan'},profile);
  assert.equal(result.bg,'belgrade-courtyard-evening-v1');
  assert.equal(result.cg,`dragan-hug-neutral-${gender}-layer-v1`);
  assert.equal(result.character,null);
  assert.equal(result.composite,true);
  for(const page of node.pages.slice(0,4))assert.equal(presentationFor(node,page,{host:'dragan'},profile).cg,null);
  assert.equal(presentationFor(node,node.pages[4],{host:'jelena'},profile).cg,null);
}
assert.equal(presentationFor(node,node.pages[4],{host:'dragan'}).cg,null);
console.log('Hug art follows consent, host and profile without changing save flags.');
