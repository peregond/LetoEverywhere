import assert from 'node:assert/strict';
import {mountMealMenu} from '../public/meal-menu.js';
import {NODES} from '../public/story.js';
class Element {
 constructor(doc){this.ownerDocument=doc;this.children=[];this.dataset={};this.attributes={};this.listeners={};this.classList={add:()=>{},remove:()=>{}};}
 append(...items){this.children.push(...items);} replaceChildren(...items){this.children=[...items];}
 setAttribute(key,value){this.attributes[key]=value;} addEventListener(key,fn){this.listeners[key]=fn;} click(){this.listeners.click?.();}
}
const doc={createElement:()=>new Element(doc)};const root=new Element(doc);let chosen;
const dispose=mountMealMenu(root,{choices:NODES.host_terrace.choices,onChoose:choice=>chosen=choice,onBack:()=>{},onSettings:()=>{},canRewind:true});
const stage=root.children[1].children[0],order=root.children[2];
const buttons=stage.children.filter(node=>node.dataset.meal);
assert.deepEqual(buttons.map(button=>button.dataset.meal),['cevapi','pljeskavica','ajvar']);
assert.equal(order.disabled,true);order.click();assert.equal(chosen,undefined);
for(const button of buttons){button.click();assert.equal(order.disabled,false);assert.equal(button.attributes['aria-pressed'],'true');assert.equal(buttons.filter(item=>item.attributes['aria-pressed']==='true').length,1);order.click();assert.equal(chosen.effect.hostMeal,button.dataset.meal);}
dispose();console.log('Menu selection preserves the three original story choices and requires confirmation.');
