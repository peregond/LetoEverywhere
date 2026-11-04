// Volume as taps on a phone: - and + in ten steps instead of a slider (fingers cannot hit a 1% target anyway).
import {stepperMarkup as markup,bindStepper as bind} from './stepper.js?v=0.17.2';
export const LEVELS=10;
const clamp=value=>Math.max(0,Math.min(1,Number(value)));
export const toLevel=value=>Number.isFinite(Number(value))?Math.round(clamp(value)*LEVELS):null;
export const fromLevel=level=>Math.max(0,Math.min(LEVELS,level))/LEVELS;
export const stepLevel=(level,direction)=>Math.max(0,Math.min(LEVELS,level+(direction<0?-1:1)));
// A saved or missing value becomes the nearest step; `fallback` is a 0..1 volume.
export const snapVolume=(value,fallback)=>fromLevel(toLevel(value)??toLevel(fallback)??LEVELS/2);
const levelText=level=>level+' / '+LEVELS;
export const stepperMarkup=({id,label,volume})=>markup({id,label,value:toLevel(volume),max:LEVELS,text:levelText,bars:true});
// Wires the buttons of one stepper; `onChange` gets the new 0..1 volume after every tap.
export const bindStepper=(root,{id,volume,onChange})=>bind(root,{id,value:toLevel(volume),max:LEVELS,text:levelText,bars:true,onChange:level=>onChange(fromLevel(level))});
