import fs from 'node:fs';
import assert from 'node:assert/strict';
import {newCoinGame,stepCoinGame,COIN_TARGET,COIN_GAME_SECONDS,SKIP_AFTER_LOSSES,HAZARDS,retryCoinGame,mountCoinCatch} from '../public/coin-catch.js';
import {NODES,beatActionAt,pageText,presentationFor} from '../public/story.js';
let game=newCoinGame();game.lane=0;
for(let i=0;i<1000&&!game.done;i++)stepCoinGame(game,.1,()=>0);
assert.equal(game.done,true);assert.ok(game.score>=COIN_TARGET,'Catching enough coins finishes the round');
assert.equal(game.caught.length,1,'The last banknote remains visible as it lands in the basket');
for(let i=0;i<4;i++)stepCoinGame(game,.1,()=>0);
assert.equal(game.caught.length,0,'The landing animation finishes even after winning');
game=newCoinGame();game.lane=3;
for(let i=0;i<1000&&!game.failed;i++)stepCoinGame(game,.1,()=>0);
assert.equal(game.failed,true);assert.equal(game.reason,'timeout');assert.equal(game.score,0);assert.equal(game.failures,1);
for(const hazard of HAZARDS){
 const current=newCoinGame();current.lane=1;current.score=5;current.spawn=1;current.coins=[{lane:1,y:.87,kind:hazard}];stepCoinGame(current,.1,()=>0);
 assert.equal(current.failed,true,hazard+' ends the attempt');assert.equal(current.score,0);assert.equal(current.coins.length,0);assert.equal(current.failures,1);
 retryCoinGame(current);assert.equal(current.failed,false);assert.equal(current.failures,1);assert.equal(current.score,0);
 current.lane=0;current.spawn=1;current.coins=[{lane:1,y:.87,kind:hazard}];stepCoinGame(current,.1,()=>0);assert.equal(current.failures,1,'Hazards in other lanes are safe');
}
assert.equal(SKIP_AFTER_LOSSES,5,'Skipping unlocks after more than four losses');
for(const id of ['d3_o1','d3_o3'])assert.equal(NODES[id].next,'d3_o2');
assert.equal(beatActionAt(NODES.d3_o2,0).quest,'coin-catch');assert.equal(NODES.d3_o2.next,'d3_mobile_choice');
assert.match(pageText(NODES.d3_o2.pages[1],{companion:'nikola'}),/бесплатный/);
assert.match(pageText(NODES.d3_o2.pages[3],{companion:'milica'}),/Милице кофе/);
assert.match(pageText(NODES.d3_o2.pages[3],{companion:'nikola'}),/Николе кофе/);
assert.equal(presentationFor(NODES.d3_o2,NODES.d3_o2.pages[1],{companion:'milica'}).character,'milica');
for(const companion of ['milica','nikola']){
 assert.notEqual(presentationFor(NODES.d3_o2,NODES.d3_o2.pages[1],{companion}).emotion,'day3-coffee','Coffee appears after it is bought');
 for(const index of [3,4])assert.equal(presentationFor(NODES.d3_o2,NODES.d3_o2.pages[index],{companion}).emotion,'day3-coffee',companion+' has coffee after the game');
}
class Element{constructor(doc){this.ownerDocument=doc;this.children=[];this.style={};this.attributes={};this.listeners={};this.classList={add:()=>{},remove:()=>{}};this.isConnected=true;}append(...c){this.children.push(...c);}replaceChildren(...c){this.children=[...c];}setAttribute(k,v){this.attributes[k]=v;}addEventListener(k,v){this.listeners[k]=v;}click(){this.listeners.click?.();}}
const doc={addEventListener(){},createElement:()=>new Element(doc),defaultView:{requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{}}},root=new Element(doc);let completed=0;
const options={onComplete:()=>completed++,onBack:()=>{},onSettings:()=>{},canRewind:true};
let dispose=mountCoinCatch(root,options);
let stage=root.children.find(x=>x.className==='coin-stage');
assert.match(stage.children.find(x=>x.className==='coin-catcher').children[0].src,/coin-catcher-detailed/);
let skip=root.children.find(x=>x.className==='coin-skip'),next=root.children.find(x=>x.className==='coin-next primary');
assert.equal(skip.hidden,true,'Skipping is locked before five losses');skip.click();assert.equal(next.hidden,true,'A hidden skip cannot bypass the limit');dispose();
dispose=mountCoinCatch(root,{...options,losses:5});skip=root.children.find(x=>x.className==='coin-skip');next=root.children.find(x=>x.className==='coin-next primary');
assert.equal(skip.hidden,false,'Skipping is available after five losses, including restored progress');skip.click();assert.equal(next.hidden,false);assert.equal(completed,0);next.click();assert.equal(completed,1);dispose();
dispose=mountCoinCatch(root,{...options,gender:'female'});stage=root.children.find(x=>x.className==='coin-stage');
for(const cls of ['coin-catcher','coin-basket-front'])assert.match(stage.children.find(x=>x.className===cls).children[0].src,/coin-catcher-female/);
dispose();
console.log('Arcade game catches, timeout, skip, continuation, companion coffee and day-three routes checked.');

const entry=fs.readFileSync(new URL('../public/belgrade.html',import.meta.url),'utf8');
assert.match(entry,/<link\s+rel="stylesheet"\s+href="\.\/coin-catch\.css\?v=[^"]+"/,'The actual game page loads the arcade stylesheet');
