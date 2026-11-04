import assert from 'node:assert/strict';
import {choicePresentation,appendChoiceContents} from '../public/choice-ui.js';

const choice=(tone='explore',effect)=>({label:'Поговорить',tone,...(effect?{effect}:{})});
for(const[id,gender]of [['milica','female'],['jelena','female'],['asya','female'],['nikola','male'],['dragan','male']]){
  const result=choicePresentation(choice('explore',{companion:id}));
  assert.equal(result.recipient,id);assert.equal(result.gender,gender);
}
assert.equal(choicePresentation(choice('explore',{host:'jelena'}),{node:{character:'nikola'}}).recipient,'jelena');
assert.equal(choicePresentation(choice('explore',{districtOwner:'dragan'}),{node:{districtPortrait:true},flags:{districtOwner:'jelena'}}).recipient,'dragan');
assert.equal(choicePresentation(choice(),{node:{character:'nikola-evening'}}).recipient,'nikola');
assert.equal(choicePresentation(choice(),{node:{portrait:true}}).recipient,'milica');
assert.equal(choicePresentation(choice(),{node:{hostPortrait:true},flags:{host:'jelena'}}).gender,'female');
assert.equal(choicePresentation(choice(),{node:{districtPortrait:true},flags:{districtOwner:'dragan'}}).gender,'male');
assert.equal(choicePresentation(choice(),{node:{companionPortrait:true},flags:{companion:'nikola'}}).gender,'male');
assert.equal(choicePresentation(choice(),{flags:{companion:'nikola',host:'jelena'}}).gender,'neutral','Background flags do not invent a current recipient');
assert.equal(choicePresentation(choice(),{node:{hostPortrait:true},flags:{}}).gender,'neutral');
assert.equal(choicePresentation(choice('unknown')).tone,'personal');
const text=v=>v.replace('{full}','Анна');
const described=choicePresentation({label:'«Я {full}»',tone:'romance'},{text,node:{character:'nikola'},tones:{romance:{label:'Флирт'}}});
assert.equal(described.label,'«Я Анна»');assert.match(described.accessibleLabel,/Флирт · Никола/);

// A tiny DOM contract checks markup and accessible naming without a browser dependency.
class Element {
  constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.attributes={};this.dataset={};this.children=[];}
  setAttribute(k,v){this.attributes[k]=String(v);}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=children;}
}
const doc={createElement(tag){return new Element(tag,this);},createElementNS(ns,tag){return new Element(tag,this);}};
for(const tone of ['explore','romance','friendship','practical','dream','personal']){
  const button=doc.createElement('button');
  const result=appendChoiceContents(button,{label:'<не разметка>',tone},{node:{character:'nikola'}});
  assert.equal(button.children.length,2);
  assert.equal(button.children[0].tagName,'svg');
  assert.equal(button.children[0].attributes['aria-hidden'],'true');
  assert.equal(button.children[0].attributes.fill,'currentColor','The action icon is filled and picks up its category colour');
  assert.equal(button.children[1].textContent,'<не разметка>');
  assert.equal(button.dataset.recipientGender,'male');
  assert.equal(button.attributes['aria-label'],result.accessibleLabel);
  assert.equal(button.attributes.title,result.accessibleLabel);
  assert.ok(!button.children.some(c=>c.className==='choice-tone'));
  appendChoiceContents(button,choice(tone));assert.equal(button.children.length,2,'Reusing a button does not duplicate its contents');
}
console.log('Compact choices: recipient identity, destination priority, neutral scenes, translated labels, SVG icons and accessible categories checked.');

for(const companion of ['nikola','milica'])for(const bond of ['romance','friendship']){const p=choicePresentation({label:'Написать человеку из аэропорта',tone:'friendship',next:'road_contact'},{flags:{companion,[companion+'Bond']:bond}});assert.equal(p.tone,bond);assert.equal(p.recipient,companion);assert.equal(p.label,companion==='nikola'?'Написать Николе':'Написать Милице');}
