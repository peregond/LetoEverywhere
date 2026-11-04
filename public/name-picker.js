// Choosing the hero's name by typing: a suggestion list opens as the player types, and only names from the catalogue can be picked.
const fold=text=>String(text??'').toLowerCase().replaceAll('ё','е').replace(/\s+/g,' ').trim();
// names: catalogue entries {id, featured, full:{nominative}, familiar:{nominative}}; `label` turns a Russian name into the shown one.
export function matchNames(names,query,{limit=6,label=text=>text}={}){
 const q=fold(query);if(!q)return [];
 const forms=name=>[name.full.nominative,name.familiar.nominative,label(name.full.nominative),label(name.familiar.nominative)].map(fold);
 const starts=[],inside=[];
 for(const name of names){
  const list=forms(name);
  if(list.some(form=>form.startsWith(q)))starts.push(name);
  else if(list.some(form=>form.includes(q)))inside.push(name);
 }
 const featuredFirst=(a,b)=>Number(!!b.featured)-Number(!!a.featured);
 return [...starts.sort(featuredFirst),...inside.sort(featuredFirst)].slice(0,limit);
}
// The one name the text spells out exactly (full or familiar form), or null.
export function exactName(names,query,label=text=>text){
 const q=fold(query);if(!q)return null;
 const hits=names.filter(name=>[name.full.nominative,name.familiar.nominative,label(name.full.nominative),label(name.familiar.nominative)].map(fold).includes(q));
 return hits.length===1?hits[0]:null;
}
export function mountNamePicker(container,{names,selectedId=null,label=text=>text,placeholder,listLabel,avatar='',onSelect,onClear}){
 const wrap=document.createElement('div');wrap.className='name-picker';
 const field=document.createElement('div');field.className='name-field';
 if(avatar){const holder=document.createElement('span');holder.className='name-avatar';holder.innerHTML=avatar;field.append(holder);}
 const input=document.createElement('input');
 Object.assign(input,{id:'name-input',type:'text',autocomplete:'off',autocapitalize:'words',spellcheck:false,placeholder,enterKeyHint:'done',maxLength:40});
 input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-expanded','false');input.setAttribute('aria-controls','name-list');input.setAttribute('aria-label',listLabel);
 field.append(input);
 const list=document.createElement('ul');list.id='name-list';list.className='name-suggestions';list.setAttribute('role','listbox');list.hidden=true;
 const chips=document.createElement('div');chips.className='name-chips';
 wrap.append(field,list,chips);container.append(wrap);
 let shown=[],active=-1;
 const byId=id=>names.find(name=>name.id===id);
 const setActive=index=>{
  active=index;[...list.children].forEach((item,i)=>item.setAttribute('aria-selected',String(i===index)));
  if(index>=0)input.setAttribute('aria-activedescendant',list.children[index].id);else input.removeAttribute('aria-activedescendant');
 };
 const close=()=>{list.hidden=true;list.replaceChildren();shown=[];setActive(-1);input.setAttribute('aria-expanded','false');};
 const choose=name=>{input.value=label(name.full.nominative);close();paintChips(name.id);onSelect(name.id);};
 function paintChips(selected){
  chips.replaceChildren();
  for(const name of names.filter(n=>n.featured)){
   const chip=document.createElement('button');chip.type='button';chip.className='name-chip';chip.textContent=label(name.full.nominative);
   chip.setAttribute('aria-pressed',String(name.id===selected));chip.addEventListener('click',()=>choose(name));chips.append(chip);
  }
 }
 function open(query){
  shown=matchNames(names,query,{label});list.replaceChildren();
  shown.forEach((name,i)=>{
   const item=document.createElement('li');item.id='name-option-'+i;item.setAttribute('role','option');item.setAttribute('aria-selected','false');
   item.textContent=label(name.full.nominative);
   if(name.familiar.nominative!==name.full.nominative){const small=document.createElement('small');small.textContent=label(name.familiar.nominative);item.append(small);}
   // pointerdown keeps the focus in the field, so the keyboard stays open on a phone
   item.addEventListener('pointerdown',event=>event.preventDefault());item.addEventListener('click',()=>choose(name));list.append(item);
  });
  list.hidden=!shown.length;input.setAttribute('aria-expanded',String(!list.hidden));setActive(-1);
 }
 input.addEventListener('input',()=>{
  const exact=exactName(names,input.value,label);
  if(exact){paintChips(exact.id);onSelect(exact.id);}else{paintChips(null);onClear();}
  open(input.value);
 });
 input.addEventListener('keydown',event=>{
  if(event.key==='ArrowDown'&&shown.length){event.preventDefault();setActive((active+1)%shown.length);}
  else if(event.key==='ArrowUp'&&shown.length){event.preventDefault();setActive((active<=0?shown.length:active)-1);}
  else if(event.key==='Enter'){event.preventDefault();if(active>=0)choose(shown[active]);else if(shown.length===1)choose(shown[0]);else{close();input.blur();}}
  else if(event.key==='Escape')close();
 });
 input.addEventListener('blur',()=>setTimeout(close,120));
 const current=selectedId&&byId(selectedId);if(current)input.value=label(current.full.nominative);
 paintChips(current?current.id:null);
 return {focus:()=>input.focus()};
}
