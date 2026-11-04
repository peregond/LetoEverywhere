// A very small DOM stand-in for the full-screen templates (no browser needed).
export class FakeElement{
  constructor(tag,doc){this.tag=tag;this.ownerDocument=doc;this.children=[];this.attributes={};this.dataset={};this.handlers={};this.style={setProperty(){}};this.className='';this.textContent='';this.hidden=false;this.disabled=false;this.offsetWidth=120;this.clientWidth=390;this.clientHeight=844;this._classes=new Set();
    this.classList={toggle:(name,force)=>{const on=force??!this._classes.has(name);if(on)this._classes.add(name);else this._classes.delete(name);return on;},contains:name=>this._classes.has(name)};}
  append(...nodes){this.children.push(...nodes);}
  prepend(...nodes){this.children.unshift(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  setAttribute(key,value){this.attributes[key]=String(value);}
  getAttribute(key){return this.attributes[key];}
  addEventListener(name,fn,options){this.handlers[name]=fn;options?.signal?.addEventListener?.('abort',()=>delete this.handlers[name]);}
  focus(){}
  scrollIntoView(){}
  set innerHTML(value){this._html=value;}
  get innerHTML(){return this._html??'';}
  click(){if(!this.disabled)this.handlers.click?.({target:this});}
}
export const makeDocument=()=>{const doc={createElement:tag=>new FakeElement(tag,doc)};return doc;};
export const all=node=>[node,...node.children.flatMap(all)];
export const withClass=(root,cls)=>all(root).filter(n=>(`${n.className}`).split(' ').includes(cls));
export function installBrowserStubs(){
  globalThis.ResizeObserver=class{observe(){} disconnect(){}};
  globalThis.requestAnimationFrame=fn=>{fn();return 1;};
  globalThis.cancelAnimationFrame=()=>{};
}
