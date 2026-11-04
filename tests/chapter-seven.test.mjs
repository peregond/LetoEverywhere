import assert from 'node:assert/strict';
import {NODES,pageText} from '../public/story.js';
import {choiceVisible} from '../public/romance.js';
assert.equal(NODES.route15_start.routeDay,15);
for(const flags of [{},{bankAccountOpen:false},{lovers:'asya,luka',loverCount:2},{routeMaskBond:'romance'}]){
 const endings=NODES.route15_start.choices.filter(c=>choiceVisible(c,flags));assert.deepEqual(endings.map(c=>c.effect.finalChoice),['stay','leave','return']);
}
for(const ending of ['stay','leave','return']){
 assert.equal(NODES['route15_'+ending].next,'evening15');
 const c=NODES.route15_close.choices.filter(c=>choiceVisible(c,{finalChoice:ending}));assert.equal(c.length,1);assert.equal(c[0].next,'route_epilogue_'+ending);
 const n=NODES[c[0].next];assert.equal(n.next,'end');assert.equal(n.effectOnEnter.dayDone,15);
 assert.notEqual(pageText(n.pages[1],{routeEndingWith:'alone'}),pageText(n.pages[1],{routeEndingWith:'asya'}));
 assert.doesNotMatch(pageText(n.pages[1],{routeEndingWith:'milos'}),/Милош|лицо/);
}
