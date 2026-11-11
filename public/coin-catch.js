import {t} from './i18n.js?v=0.17.27';
import {setQuestIcon} from './quest-controls.js?v=0.17.8';

export const COIN_TARGET=8;
export const COIN_GAME_SECONDS=24;
export const SKIP_AFTER_LOSSES=5;
export const HAZARDS=['cigarette','ashtray','butt'];
export function newCoinGame(failures=0){return {lane:1,score:0,elapsed:0,spawn:0,coins:[],caught:[],done:false,failed:false,failures:Math.max(0,Number.isFinite(failures)?Math.floor(failures):0),skipped:false,reason:null};}
export function retryCoinGame(state){const failures=state.failures;Object.assign(state,newCoinGame(failures));return state;}
function failCoinGame(state,reason){state.failures++;state.failed=true;state.reason=reason;state.score=0;state.elapsed=0;state.spawn=0;state.coins=[];state.caught=[];}
// Simulation is time based, so screen refresh rates do not change the game speed.
export function stepCoinGame(state,dt,random=Math.random){
 const delta=Math.max(0,Math.min(.1,dt));state.caught=state.caught.map(item=>({...item,age:item.age+delta})).filter(item=>item.age<.3);
 if(state.done||state.failed)return state;
 state.elapsed+=delta;state.spawn-=delta;
 if(state.spawn<=0){const lane=Math.min(3,Math.floor(random()*4)),roll=random();const kind=roll<.72?'coin':HAZARDS[Math.min(2,Math.floor((roll-.72)/.28*3))];state.coins.push({lane,y:0,kind});state.spawn+=.68;}
 for(const item of state.coins)item.y+=delta*.42;
 if(state.coins.some(item=>item.y>=.88&&item.lane===state.lane&&item.kind&&item.kind!=='coin')){failCoinGame(state,'hazard');return state;}
 const remaining=[];
 for(const item of state.coins){if(item.y>=.88){if(item.lane===state.lane&&(item.kind??'coin')==='coin'){state.score++;state.caught.push({lane:item.lane,age:0});}}else remaining.push(item);}
 state.coins=remaining;
 if(state.score>=COIN_TARGET)state.done=true;
 else if(state.elapsed>=COIN_GAME_SECONDS)failCoinGame(state,'timeout');
 return state;
}
// A stylised 100 RSD note, drawn at low resolution to match the arcade artwork.
const BANKNOTE_ART='<svg viewBox="0 0 48 28" shape-rendering="crispEdges"><path fill="#17364f" d="M0 2h48v24H0z"/><path fill="#87bed0" d="M3 5h42v18H3z"/><path fill="#d4e7d8" d="M7 8h34v12H7z"/><path fill="#488498" d="M8 9h5v10H8zm28 0h5v10h-5zM17 9h5v2h-5zm0 8h5v2h-5z"/><text x="24" y="17" text-anchor="middle" fill="#17364f" font-family="monospace" font-size="9" font-weight="bold">100</text></svg>';
const HAZARD_ART={
 cigarette:'<svg viewBox="0 0 32 24" shape-rendering="crispEdges"><path fill="#f8f2da" d="M2 8h20v8H2z"/><path fill="#d98936" d="M22 8h7v8h-7z"/><path fill="#d95230" d="M0 8h3v8H0z"/><path fill="#53504b" d="M3 6h17v2H3zm0 10h25v2H3z"/></svg>',
 butt:'<svg viewBox="0 0 32 24" shape-rendering="crispEdges"><path fill="#ddd5bc" d="M7 8h9v8H7z"/><path fill="#b36c26" d="M16 8h9v8h-9z"/><path fill="#55514c" d="M5 6h3v12H5zm19 1h3v10h-3z"/><path fill="#ed7035" d="M5 9h2v6H5z"/></svg>',
 ashtray:'<svg viewBox="0 0 32 24" shape-rendering="crispEdges"><path fill="#454955" d="M2 8h28v8h-3v4H5v-4H2z"/><path fill="#aab4b9" d="M4 6h24v4H4z"/><path fill="#697980" d="M7 10h18v5H7z"/><path fill="#edc99b" d="M10 8h10v3H10z"/></svg>'
};
export function mountCoinCatch(root,{onComplete,onBack,onSettings,canRewind,gender='male',isPaused=()=>false,losses=0,onLoss=()=>{}}){
 const doc=root.ownerDocument,win=doc.defaultView??window,events=new AbortController(),state=newCoinGame(losses);let frame=0,last=null,lastScore=-1;
 const make=(tag,cls,text)=>{const el=doc.createElement(tag);el.className=cls;if(text)el.textContent=t(text);return el;};
 const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
 root.replaceChildren();root.classList.add('coin-game');
 const background=make('img','coin-background');background.src='./assets/belgrade-pixel-stop-v3.webp';background.alt='';background.setAttribute('aria-hidden','true');
 const header=make('header','quest-tools coin-header');
 const back=setQuestIcon(make('button','quest-tool'),'back',t('← Назад'));back.type='button';back.disabled=!canRewind;listen(back,'click',onBack);
 const heading=make('h2','quest-title','Копим на проездной');heading.id='scene-quest-title';heading.tabIndex=-1;
 const settings=setQuestIcon(make('button','quest-tool'),'settings',t('Настройки'));settings.type='button';listen(settings,'click',onSettings);header.append(back,heading,settings);
 const hud=make('div','coin-hud');const hint=make('p','coin-hint','Лови купюры, избегай мусора: нажимай на дорожки или стрелки.');hint.setAttribute('aria-live','polite');const score=make('p','coin-score');score.setAttribute('aria-live','polite');hud.append(hint,score);
 const stage=make('div','coin-stage');stage.setAttribute('role','group');stage.setAttribute('aria-label',t('Игровое поле: четыре дорожки'));
 const coins=make('div','coin-falling');coins.setAttribute('aria-hidden','true');stage.append(coins);
 const heroSrc=gender==='female'?'./assets/coin-catcher-female-v1.webp':'./assets/coin-catcher-detailed-v1.webp';
 const catcher=make('div','coin-catcher');catcher.setAttribute('aria-hidden','true');const hero=make('img','coin-catcher-sprite');hero.src=heroSrc;hero.alt='';catcher.append(hero);stage.append(catcher);
 const basket=make('div','coin-basket-front');basket.setAttribute('aria-hidden','true');const basketSprite=make('img','coin-catcher-sprite');basketSprite.src=heroSrc;basketSprite.alt='';basket.append(basketSprite);stage.append(basket);
 const lanes=[];for(let i=0;i<4;i++){const lane=make('button','coin-lane');lane.type='button';lane.setAttribute('aria-label',t('Дорожка')+' '+(i+1));lane.style.left=(i*25)+'%';listen(lane,'click',()=>{if(!state.done&&!state.failed&&!isPaused()){state.lane=i;paint();}});stage.append(lane);lanes.push(lane);}
 const controls=make('div','coin-controls');const left=make('button','coin-arrow','←'),right=make('button','coin-arrow','→');left.type=right.type='button';left.setAttribute('aria-label',t('Влево'));right.setAttribute('aria-label',t('Вправо'));
 listen(left,'click',()=>move(-1));listen(right,'click',()=>move(1));
 const finish=make('button','coin-next primary','Дальше');finish.type='button';finish.hidden=true;listen(finish,'click',()=>{if(state.done)onComplete();});
 const retry=make('button','coin-retry primary','Попробовать снова');retry.type='button';retry.hidden=true;listen(retry,'click',()=>{if(state.failed){retryCoinGame(state);last=null;paint();}});
 const skip=make('button','coin-skip','Пропустить игру');skip.type='button';listen(skip,'click',()=>{if(state.failures>=SKIP_AFTER_LOSSES){state.done=true;state.failed=false;state.skipped=true;state.coins=[];paint();}});
 controls.append(left,right);root.append(background,header,hud,stage,controls,retry,skip,finish);
 function move(dir){if(state.done||state.failed||isPaused())return;state.lane=Math.max(0,Math.min(3,state.lane+dir));paint();}
 function paint(){
  catcher.style.left=basket.style.left=(12.5+state.lane*25)+'%';if(state.score!==lastScore){lastScore=state.score;score.textContent=`${t('Купюры')}: ${Math.min(state.score,COIN_TARGET)} / ${COIN_TARGET}`;}
  coins.replaceChildren(...[...state.coins,...state.caught.map(item=>({...item,y:.88+item.age*.08,kind:'coin'}))].map(item=>{const hazard=item.kind&&item.kind!=='coin';const el=make('span',hazard?'pixel-hazard':'pixel-banknote');el.innerHTML=hazard?HAZARD_ART[item.kind]:BANKNOTE_ART;el.style.left=(12.5+item.lane*25)+'%';el.style.top=(item.y*100)+'%';if(item.age!==undefined)el.style.opacity=String(1-item.age/.3);return el;}));
  for(const [i,lane] of lanes.entries())lane.setAttribute('aria-pressed',String(i===state.lane));
  controls.hidden=state.done||state.failed;retry.hidden=!state.failed||state.done;skip.hidden=state.done||state.failures<SKIP_AFTER_LOSSES;finish.hidden=!state.done;
  const message=state.done?(state.skipped?'Не переживай: городской транспорт бесплатный!':'Кажется, на проездной почти хватит…'):state.failed?(state.reason==='timeout'?'Время вышло. Попробуй ещё раз.':'Упс, попался мусор! Начнём сначала.'):'Лови купюры, избегай мусора: нажимай на дорожки или стрелки.';
  if(hint.textContent!==t(message))hint.textContent=t(message);
 }
 const key=event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){if(isPaused())return;event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}};
 listen(doc,'keydown',key);
 function tick(now){if(!root.isConnected)return;if(last!==null&&!isPaused()&&!doc.hidden&&!state.failed&&(!state.done||state.caught.length)){const before=state.failures;stepCoinGame(state,(now-last)/1000);if(state.failures>before)onLoss(state.failures);}last=now;paint();if(!state.done||state.caught.length)frame=win.requestAnimationFrame(tick);}
 paint();frame=win.requestAnimationFrame(tick);
 return()=>{events.abort();win.cancelAnimationFrame(frame);root.classList.remove('coin-game');};
}
