// Day 4 separates signing/moving from the previous day's search and next day's registration.
import assert from 'node:assert/strict';
import {NODES} from '../public/story.js';
import {choiceVisible} from '../public/romance.js';
assert.equal(NODES.route4_start.next,'flat_terms');
for(const id of ['flat_terms','flat_contract','flat_questions','flat_signed','flat_move_day','flat_arrive','flat_settle'])assert.equal(NODES[id].routeDay,4,id);
assert.equal(NODES.flat_settle.next,'evening4');
for(const id of ['flat_terms','flat_contract','flat_questions'])assert.ok(NODES[id].choices.some(c=>c.next==='route4_defer'),id+' permits postponing');
assert.equal(NODES.route4_defer.next,'evening4');
const temporary={rentalMoved:false};assert.equal(choiceVisible(NODES.route5_start.choices[0],temporary),false);assert.equal(choiceVisible(NODES.route5_start.choices[1],temporary),true);
assert.equal(NODES.flat_signed.effectOnEnter.flatPick,true);assert.ok(Object.values(NODES.flat_signed.actions).some(a=>/залог/.test(a.label)));
