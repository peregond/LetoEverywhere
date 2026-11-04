// Text size as -/+ taps with a live preview of how a line of dialogue will look at that size.
import {stepperMarkup,bindStepper} from './stepper.js?v=0.17.2';
export const MIN_SIZE=16,MAX_SIZE=24,DEFAULT_SIZE=18;
// Height of the dialogue box in lines: the bigger the text, the more lines. Measured on all 2125 lines of the story: at 18 px five lines
// leave about 1 % of the lines continuing on a second screen (four lines: 8 %).
export const textLines=size=>size<=18?5:size<=21?6:7;
export const clampSize=value=>Math.max(MIN_SIZE,Math.min(MAX_SIZE,Math.round(Number(value))||DEFAULT_SIZE));
const sizeText=size=>size+' px';
export function textSizeMarkup({size}){
 const value=clampSize(size);
 return stepperMarkup({id:'text-size',label:'Размер текста',value,min:MIN_SIZE,max:MAX_SIZE,text:sizeText,down:'Меньше',up:'Крупнее'})
  +`<div class="text-preview" id="text-size-preview" style="--text-size:${value}px" aria-hidden="true"><div class="speaker-name"><h2>Милица</h2></div><p class="dialogue-text">Сначала возьмём ключи, потом решим.</p></div>`;
}
// `onChange` gets the new size in px after every tap; the preview follows by itself.
export function bindTextSize(root,{size,onChange}){
 const preview=root.querySelector('#text-size-preview');
 bindStepper(root,{id:'text-size',value:clampSize(size),min:MIN_SIZE,max:MAX_SIZE,text:sizeText,onChange:value=>{preview.style.setProperty('--text-size',value+'px');onChange(value);}});
}
