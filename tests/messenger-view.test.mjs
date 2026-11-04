import assert from 'node:assert/strict';
import {mountMessenger} from '../public/messenger.js';
class Element {
  constructor(tag,doc){this.tag=tag;this.ownerDocument=doc;this.children=[];this.attributes={};this.dataset={};this.handlers={};this.style={setProperty(){}};this.offsetHeight=50;this.namespaceURI='svg';}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  setAttribute(key,value){this.attributes[key]=String(value);}
  getAttribute(key){return this.attributes[key];}
  addEventListener(name,fn){this.handlers[name]=fn;}
  contains(node){return node===this||this.children.some(child=>child.contains(node));}
  focus(){}
  click(){if(!this.disabled)this.handlers.click?.({target:this});}
}
const doc={createElement:tag=>new Element(tag,doc),createElementNS:(ns,tag)=>new Element(tag,doc)};
const root=new Element('section',doc);
globalThis.ResizeObserver=class{observe(){} disconnect(){}};
globalThis.requestAnimationFrame=fn=>{fn();return 1;};
globalThis.cancelAnimationFrame=()=>{};
const all=(node)=>[node,...node.children.flatMap(all)];
const nodes=cls=>all(root).filter(n=>(n.className??'').split(' ').includes(cls));
const replies=[{text:'Кифла спасла день. Спасибо!',tone:'friendship'},{text:'Вернусь не только за кифлой',tone:'romance'}];
let sends=0,nexts=0,accept=false;
const dispose=mountMessenger(root,{contact:'Никола',messages:[{direction:'incoming',text:'Старое сообщение'},{direction:'incoming',text:'Напиши, когда доберёшься',isNew:true}],replies,context:'У выхода солнце бьёт в глаза.',draft:null,time:'17:44'},{onSend:()=>{sends++;return accept;},onContinue:()=>nexts++,onBack(){},onMenu(){},onSettings(){},canRewind:false});
assert.equal(nodes('chat-new-divider').length,1,'Only the new message has a divider');
assert.equal(nodes('chat-reply').length,2,'Both ready replies are immediately rendered');
assert.equal(nodes('chat-replies')[0].hidden,undefined);
assert.equal(nodes('chat-context').length,0,'Narration is not rendered in a conversation');
assert.equal(nodes('chat-suggested').length,0);
assert.equal(all(root).filter(n=>n.tag==='textarea'||n.tag==='input').length,0);
const first=nodes('chat-reply')[0];first.click();assert.equal(sends,1);assert.equal(first.disabled,false,'Failed progression can be retried');
accept=true;first.click();first.handlers.click();assert.equal(sends,2,'Repeated taps cannot apply effects twice');
assert.equal(nodes('chat-reply').length,0);assert.equal(nodes('chat-row').length,3,'Sent reply appears once in the transcript');
nodes('chat-next')[0].click();assert.equal(nexts,1);dispose();
console.log('Visible reply cards, no narrator/input/expander, retry, single send and continuation checked.');
