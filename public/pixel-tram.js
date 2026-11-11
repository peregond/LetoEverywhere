// A small keyboard/touch puzzle. No timers; mistakes reset the tram without changing story progress.
import {t} from './i18n.js?v=0.17.26';
import {T} from './days.js?v=0.17.2';
const TITLE=T('Пиксельный трамвай','Pixel Tram');
const HINT=T('Довези трамвай до чашки. Лужи возвращают к старту.','Drive the tram to the cup. Puddles return you to the start.');
const RESET=T('Плюх! Попробуй другой путь.','Splash! Try another route.');
const WIN=T('Кофе доставлен!','Coffee delivered!');
export const TRAM_START=12,TRAM_GOAL=2,TRAM_PUDDLES=[7,11,17,23];
export function tramMove(position,direction){
 const delta={up:-5,down:5,left:-1,right:1}[direction];
 if(delta===undefined)return position;
 const next=position+delta;
 if(next<0||next>=25||(direction==='left'&&position%5===0)||(direction==='right'&&position%5===4))return position;
 return TRAM_PUDDLES.includes(next)?TRAM_START:next;
}
export function mountPixelTram(root,{onComplete,onBack,onSettings,canRewind}){
 const doc=root.ownerDocument,events=new AbortController();let position=TRAM_START,finished=false;
 const make=(tag,cls,text)=>{const el=doc.createElement(tag);el.className=cls;if(text)el.textContent=text;return el;};
 const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
 const button=(label,fn)=>{const el=make('button','secondary',label);el.type='button';listen(el,'click',fn);return el;};
 const heading=make('h2','quest-title',t(TITLE));heading.id='scene-quest-title';heading.tabIndex=-1;
 const back=button(t('Назад'),onBack);back.disabled=!canRewind;
 const settings=button(t('Настройки'),onSettings);
 const header=make('header','quest-tools');header.append(back,heading,settings);
 const hint=make('p','',t(HINT)),status=make('p','');status.setAttribute('role','status');
 const board=make('div','pixel-tram-board');board.setAttribute('role','img');board.setAttribute('aria-label',t(HINT));
 const cells=Array.from({length:25},(_,i)=>{const cell=make('span','pixel-tram-cell');cell.dataset.kind=TRAM_PUDDLES.includes(i)?'water':i===TRAM_GOAL?'coffee':'street';board.append(cell);return cell;});
 const done=button(t('Продолжить'),()=>{if(finished)onComplete();});done.hidden=true;
 const draw=()=>{for(const [i,cell]of cells.entries())cell.textContent=i===position?'▣':i===TRAM_GOAL?'☕':TRAM_PUDDLES.includes(i)?'≈':'·';};
 const move=direction=>{if(finished)return;const next=tramMove(position,direction);status.textContent=next===TRAM_START&&position!==TRAM_START?t(RESET):'';position=next;draw();if(position===TRAM_GOAL){finished=true;status.textContent=t(WIN);done.hidden=false;done.focus();}};
 const controls=make('div','pixel-tram-controls');for(const [key,label]of [['up','↑'],['left','←'],['down','↓'],['right','→']])controls.append(button(label,()=>move(key)));
 listen(root,'keydown',event=>{const direction={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[event.key];if(direction){event.preventDefault();move(direction);}});
 root.classList.toggle('pixel-tram',true);root.replaceChildren(header,hint,board,controls,status,done);draw();return()=>{events.abort();root.classList.toggle('pixel-tram',false);};
}
