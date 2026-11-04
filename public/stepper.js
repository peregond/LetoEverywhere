// A - / + stepper for a whole number between min and max, with an optional row of level bars. Phones do not need slider precision.
// Used for the volumes (volume-steps.js) and the text size (text-size.js).
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function stepperMarkup({id,label,value,min=0,max,text=v=>String(v),bars=false,down='Тише',up='Громче'}){
 const bar=bars?Array.from({length:max-min},(_,i)=>`<i${i<value-min?' class="on"':''}></i>`).join(''):'';
 return `<div class="setting stepper-setting"><span>${label}<small id="${id}-level" aria-live="polite">${text(value)}</small></span><div class="stepper" role="group" aria-label="${label}"><button type="button" id="${id}-down" aria-label="${down}"${value<=min?' disabled':''}>−</button>${bars?`<span class="stepper-bars" id="${id}-bars" aria-hidden="true">${bar}</span>`:''}<button type="button" id="${id}-up" aria-label="${up}"${value>=max?' disabled':''}>+</button></div></div>`;
}
// Wires the two buttons of one stepper; `onChange` gets the new value after every tap that changes it.
export function bindStepper(root,{id,value,min=0,max,text=v=>String(v),bars=false,onChange}){
 let current=clamp(value,min,max);
 const down=root.querySelector('#'+id+'-down'),up=root.querySelector('#'+id+'-up'),label=root.querySelector('#'+id+'-level'),row=bars?root.querySelector('#'+id+'-bars'):null;
 const paint=()=>{
  label.textContent=text(current);down.disabled=current<=min;up.disabled=current>=max;
  if(row)[...row.children].forEach((bar,i)=>bar.classList.toggle('on',i<current-min));
 };
 const tap=direction=>()=>{const next=clamp(current+direction,min,max);if(next===current)return;current=next;paint();onChange(current);};
 down.addEventListener('click',tap(-1));up.addEventListener('click',tap(1));
}
