import assert from 'node:assert/strict';
import {LEVELS,toLevel,fromLevel,stepLevel,snapVolume,stepperMarkup,bindStepper} from '../public/volume-steps.js';
assert.equal(LEVELS,10);
assert.equal(toLevel(.55),6);assert.equal(toLevel(0),0);assert.equal(toLevel(1),10);assert.equal(toLevel(7),10,'Out-of-range values are clamped');assert.equal(toLevel(undefined),null);assert.equal(toLevel('x'),null);
assert.equal(fromLevel(3),.3);assert.equal(fromLevel(-2),0);assert.equal(fromLevel(99),1);
assert.equal(stepLevel(0,-1),0);assert.equal(stepLevel(10,1),10);assert.equal(stepLevel(4,1),5);assert.equal(stepLevel(4,-1),3);
// Old saved sliders (any 0..1 value) land on a step; sounds start at the music level when they were never saved.
assert.equal(snapVolume(.55,.2),.6);assert.equal(snapVolume(.27,.9),.3);assert.equal(snapVolume(undefined,.55),.6);assert.equal(snapVolume(NaN,undefined),.5);
const html=stepperMarkup({id:'m',label:'Громкость музыки',volume:0});
assert.match(html,/id="m-down"[^>]*disabled/);assert.doesNotMatch(html,/id="m-up"[^>]*disabled/);assert.equal((html.match(/<i/g)||[]).length,10);assert.match(html,/0 \/ 10/);
// Wire a stepper to a minimal fake DOM and tap it.
const make=()=>({disabled:false,textContent:'',classList:{on:new Set(),toggle(n,f){f?this.on.add(n):this.on.delete(n);}},handlers:{},addEventListener(t,fn){this.handlers[t]=fn;}});
const els={'#m-down':make(),'#m-up':make(),'#m-level':make(),'#m-bars':{children:Array.from({length:10},make)}};
const root={querySelector:s=>els[s]};
const seen=[];bindStepper(root,{id:'m',volume:.9,onChange:v=>seen.push(v)});
els['#m-up'].handlers.click();assert.deepEqual(seen,[1]);assert.equal(els['#m-up'].disabled,true);assert.equal(els['#m-level'].textContent,'10 / 10');
els['#m-up'].handlers.click();assert.equal(seen.length,1,'No change at the top');
els['#m-down'].handlers.click();els['#m-down'].handlers.click();assert.deepEqual(seen,[1,.9,.8]);assert.equal(els['#m-up'].disabled,false);
assert.equal(els['#m-bars'].children.filter(b=>b.classList.on.has('on')).length,8);
console.log('Volume steps: ten levels, clamped taps, old slider values snapped, markup and wiring checked.');
