// Optional 18+ evening nights for the 15-day intimacy registry.
// Modelled on public/nikola-early-night.js: consent aloud, adult:true beats skip to morning when 18+ is off.
// IDs: evening{day}_{person}_{kiss_ask|kiss|night_ask|home|door|fade|prep|sex|cum_*|afterglow|morning}
// Day 4 group: route4_group_{ask|fade|morning}. Male player POV (same gate as the Nikola park night).
import {T,DAYS} from './days.js?v=0.17.2';
import {ADULT_CAST,ADULT_PEOPLE,ADULT_DAYS_ROUTE,ADULT_GROUP_ID,artKey} from './adult-cast.js?v=0.17.3';
import {maleSexBeats,femaleSexBeats} from './adult-sex-copy.js?v=0.17.3';
const DAY_META=Object.fromEntries(DAYS.map(d=>[d.n,d]));

const maleGate={gender:'male'};
// Romance IDs use strahinya; portrait sprites are registered as strahinja.
const SPRITE_ID={strahinya:'strahinja'};

function heShe(c,m,f){return c.gender==='m'?m:f;}
function himHer(c){return c.gender==='m'?['него','him']:['неё','her'];}
function hisHer(c){return c.gender==='m'?['его','his']:['её','her'];}
function spriteOf(person){return SPRITE_ID[person]??person;}

// Scene flex sits above the dialogue panel; cover crops top tools + bottom ~20–35%.
// Bias to 35% so head/torso/speedo stay in the visible band (same as nikola seductive/briefs).
const ADULT_CG_POSITION='50% 35%';

function buildBg(BACKGROUNDS,person,beat,labelRu,labelEn,descRu,descEn){
 const key=artKey(person,beat);
 if(!BACKGROUNDS[key]){
  BACKGROUNDS[key]={
   label:T(labelRu,labelEn),
   description:T(descRu,descEn),
   position:ADULT_CG_POSITION,
   file:key,
   optional:true
  };
 }else{
  // Keep adult night CGs on the UI-safe bias even if a prior registry set another position.
  BACKGROUNDS[key].position=ADULT_CG_POSITION;
 }
 return key;
}

// Nikola already has a full CG set from the riverside night — reuse those files.
const NIKOLA_ART={
 home:'nikola-apartment-night-v1',
 seductive:'nikola-bedroom-seductive-v1',
 door:'nikola-door-kiss-v1',
 briefs:'nikola-briefs-bed-smile-v1',
 touch:'nikola-briefs-touch-v2',
 ready:'nikola-ready-back-v1',
 sex:'nikola-sex-moan-v1',
 climax:'nikola-climax-face-v1',
 cumInside:'nikola-after-bliss-v1',
 cumCloth:'nikola-after-laugh-v1',
 cumChest:'nikola-after-tender-v1',
 afterglow:'nikola-afterglow-smile-v1'
};

function sceneArt(BACKGROUNDS,c){
 if(c.id==='nikola')return {...NIKOLA_ART};
 const name=c.name[0];
 const home=c.homeBg;
 const seductive=buildBg(BACKGROUNDS,c.id,'seductive',`${name} · ВЗГЛЯД`,`${c.name[1]} · LOOK`,`${name} в белье, соблазнительный взгляд`,`${c.name[1]} in lingerie/underwear, a seductive look`);
 const door=buildBg(BACKGROUNDS,c.id,'door',`${name} · У ДВЕРИ`,`${c.name[1]} · AT THE DOOR`,`${name} у двери`,`${c.name[1]} at the door`);
 const briefs=buildBg(BACKGROUNDS,c.id,'briefs',`${name} · БЕЛЬЁ`,`${c.name[1]} · UNDERWEAR`,`${name} на кровати в белье`,`${c.name[1]} on the bed in underwear`);
 const touch=buildBg(BACKGROUNDS,c.id,'touch',`${name} · КАСАНИЕ`,`${c.name[1]} · TOUCH`,`${name}, касание`,`${c.name[1]}, a touch`);
 const ready=buildBg(BACKGROUNDS,c.id,'ready',`${name} · ГОТОВ`,`${c.name[1]} · READY`,`${name} готов{a} к близости`,`${c.name[1]} ready for intimacy`);
 const sex=buildBg(BACKGROUNDS,c.id,'sex',`${name} · СЕКС`,`${c.name[1]} · SEX`,`${name} во время секса`,`${c.name[1]} during sex`);
 const climax=buildBg(BACKGROUNDS,c.id,'climax',`${name} · ОРГАЗМ`,`${c.name[1]} · CLIMAX`,`Крупный план лица`,`Close-up of the face`);
 const cumInside=buildBg(BACKGROUNDS,c.id,'cum-inside',`${name} · ВНУТРЬ`,`${c.name[1]} · INSIDE`,`После финиша внутрь`,`After finishing inside`);
 const cumCloth=buildBg(BACKGROUNDS,c.id,'cum-cloth',`${name} · НА БЕЛЬЁ`,`${c.name[1]} · ON CLOTH`,`Финиш на бельё`,`Finish on underwear`);
 const cumChest=buildBg(BACKGROUNDS,c.id,'cum-chest',`${name} · НА ГРУДЬ`,`${c.name[1]} · ON CHEST`,`Финиш на грудь`,`Finish on the chest`);
 const afterglow=buildBg(BACKGROUNDS,c.id,'afterglow',`${name} · ПОСЛЕ`,`${c.name[1]} · AFTER`,`После, мягкая улыбка`,`After, a soft smile`);
 return {home,seductive,door,briefs,touch,ready,sex,climax,cumInside,cumCloth,cumChest,afterglow};
}

function registerPersonNight(N,J,BACKGROUNDS,helpers,person,day,morningNext){
 const {note,me,say,cg,place,out,scene}=helpers;
 const c=ADULT_CAST[person];
 const art=sceneArt(BACKGROUNDS,c);
 const pref=`evening${day}_${person}`;
 const [himRu,himEn]=himHer(c);
 const [hisRu,hisEn]=hisHer(c);
 const journalKey=`adult_night_${person}`;
 if(!J[journalKey]){
  J[journalKey]={
   title:T(`Ночь с ${c.name[0]}`,`A night with ${c.name[1]}`),
   tag:T('ОТНОШЕНИЯ · БЛИЗОСТЬ','RELATIONSHIPS · INTIMACY'),
   text:T(`Мы оба сказали «да». Остальное остаётся между мной и ${c.name[0].replace(/а$/,'ой').replace(/я$/,'ей')}.`,`We both said “yes”. The rest stays between me and ${c.name[1]}.`)
  };
 }

 // Kiss ask / kiss
 N[`${pref}_kiss_ask`]=scene([
  note(`Мы стоим близко. ${c.name[0]} смотрит прямо и не торопит.` ,`We stand close. ${c.name[1]} looks straight and does not hurry.`),
  say(c.id,...c.askKiss,'flirty'),
  note(`Я знаю, что могу сказать «да», «пока нет» или просто улыбнуться: любой ответ здесь будет принят.`,`I know I can say “yes”, “not yet” or simply smile: any answer will be accepted here.`)
 ],null,{...place(...c.place,'21:00',c.homeBg),character:spriteOf(person),emotion:'flirty',portrait:true,choices:[
  {label:T('Поцеловать','Kiss'),tone:'romance',next:`${pref}_kiss`,effect:{loveStep:'kiss'},when:maleGate},
  {label:T('Пока подождать','Wait for now'),tone:'personal',next:morningNext}
 ]});

 N[`${pref}_kiss`]=scene([
  note(...c.kissOk),
  note(`${c.name[0]} отстраняется и спрашивает: «Всё хорошо?» Я киваю.`,` ${c.name[1]} pulls back and asks: “Is it all right?” I nod.`.trim()),
  me('Да. Ещё можно.','Yes. More is welcome.')
 ],morningNext,{...place(...c.place,'21:10',c.homeBg),character:spriteOf(person),emotion:'flirty',portrait:true,journal:['love_kiss']});

 // Night ask
 N[`${pref}_night_ask`]=scene([
  note(`В воздухе пахнет ${c.smell[0]}. ${c.name[0]} — ${c.body[0]}.`,`The air smells of ${c.smell[1]}. ${c.name[1]} is ${c.body[1]}.`),
  say(c.id,...c.askNight,'flirty'),
  note(`${heShe(c,'Он','Она')} ждёт. Без шутки — только вопрос.`,` ${heShe(c,'He','She')} waits. No joke — only the question.`.trim())
 ],null,{...place(...c.place,'21:20',c.homeBg),character:spriteOf(person),emotion:'flirty',portrait:true,choices:[
  {label:T(c.gender==='m'?'«Да. Хочу трахнуть тебя у тебя дома»':'«Да. Хочу остаться с тобой на ночь»',c.gender==='m'?'“Yes. I want to fuck you at your place”':'“Yes. I want to stay the night with you”'),tone:'romance',next:`${pref}_home`,effect:{[`adultNight_${person}`]:'yes'},when:maleGate},
  {label:T('«Не сегодня. Давай просто попрощаемся тепло»','“Not tonight. Let us just say a warm goodbye”'),tone:'friendship',next:morningNext,effect:{[`adultNight_${person}`]:'later'}}
 ]});

 N[`${pref}_home`]=scene([
  note(`В квартире тихо: пахнет ${c.smell[0]}.`,`The flat is quiet: it smells of ${c.smell[1]}.`),
  say(c.id,'Можно оставить лампу? Хочу видеть тебя.','May I leave the lamp on? I want to see you.','shy'),
  me('Оставь. Хочу видеть, как ты стонешь.','Leave it. I want to see you moan.'),
  note(`${heShe(c,'Он кивает','Она кивает')}. Остаётся только янтарный свет.`,` ${heShe(c,'He nods','She nods')}. Only amber light remains.`.trim())
 ],`${pref}_door`,{...place(...[`КОРИДОР · ${c.place[0]}`,`HALL · ${c.place[1]}`],'21:35',art.home),character:spriteOf(person),emotion:'shy',portrait:true,journal:[journalKey]});

 const beats=c.gender==='m'?maleSexBeats(c):femaleSexBeats(c);
 const narr=(pair,bg)=>({speaker:'narrator',text:T(...pair),portrait:false,...(bg?{bg}:{})});
 const himLabel=c.gender==='m'
  ?{inside:T('Кончить в него глубоко','Cum deep inside him'),cloth:T('Вытащить и кончить на бельё','Pull out and cum on the underwear'),chest:T('Перевернуть и кончить на грудь','Flip him and cum on his chest')}
  :{inside:T('Кончить в неё глубоко','Cum deep inside her'),cloth:T('Вытащить и кончить на бельё','Pull out and cum on the lingerie'),chest:T('Кончить ей на грудь','Cum on her chest')};

 N[`${pref}_door`]=scene([
  narr(beats.door[0]),
  {...say(c.id,...beats.door[1],'flirty'),portrait:false},
  narr(beats.door[2]),
  narr(beats.door[3])
 ],`${pref}_fade`,{...place(...[`ДВЕРЬ · ${c.place[0]}`,`DOOR · ${c.place[1]}`],'21:40',art.door)});

 // fade = first adult beat (shirtless + briefs / lingerie), like nikola_park_closer
 N[`${pref}_fade`]=scene([
  narr(beats.fade[0],art.briefs),
  {...say(c.id,...beats.fade[1],'shy'),portrait:false,bg:art.seductive},
  narr(beats.fade[2],art.touch),
  narr(beats.fade[3]),
  narr(beats.fade[4])
 ],`${pref}_prep`,{...place(...[`КРОВАТЬ · ${c.place[0]}`,`BED · ${c.place[1]}`],'21:50',art.briefs),adult:true,skipTo:`${pref}_morning`});

 N[`${pref}_prep`]=scene([
  narr(beats.prep[0],art.ready),
  {...say(c.id,...beats.prep[1],'flirty'),portrait:false},
  narr(beats.prep[2]),
  narr(beats.prep[3]),
  narr(beats.prep[4])
 ],`${pref}_sex`,{...place(...[`ПОДГОТОВКА · ${c.place[0]}`,`PREP · ${c.place[1]}`],'22:05',art.ready),adult:true,skipTo:`${pref}_morning`});

 N[`${pref}_sex`]=scene([
  narr(beats.sex[0],art.sex),
  narr(beats.sex[1]),
  narr(beats.sex[2]),
  {...say(c.id,...beats.sex[3],'flirty'),portrait:false,bg:art.climax},
  narr(beats.sex[4])
 ],`${pref}_sex_deep`,{...place(...[`НОЧЬ · ${c.place[0]}`,`NIGHT · ${c.place[1]}`],'22:20',art.sex),adult:true,skipTo:`${pref}_morning`});

 N[`${pref}_sex_deep`]=scene([
  narr(beats.sexDeep[0],art.sex),
  narr(beats.sexDeep[1]),
  narr(beats.sexDeep[2]),
  narr(beats.sexDeep[3]),
  narr(beats.sexDeep[4])
 ],null,{...place(...[`НОЧЬ · ГЛУБЖЕ`,`NIGHT · DEEPER`],'22:28',art.sex),adult:true,skipTo:`${pref}_morning`,choices:[
  {label:himLabel.inside,tone:'romance',next:`${pref}_cum_inside`,effect:{[c.finishFlag]:'inside'}},
  {label:himLabel.cloth,tone:'romance',next:`${pref}_cum_cloth`,effect:{[c.finishFlag]:'cloth'}},
  {label:himLabel.chest,tone:'romance',next:`${pref}_cum_chest`,effect:{[c.finishFlag]:'chest'}}
 ]});

 N[`${pref}_cum_inside`]=scene([
  narr(beats.cumInside[0],art.cumInside),
  {...say(c.id,...beats.cumInside[1],'shy'),portrait:false},
  narr(beats.cumInside[2]),
  narr(beats.cumInside[3])
 ],`${pref}_afterglow`,{...place(...[`ФИНИШ · ${c.place[0]}`,`FINISH · ${c.place[1]}`],'22:35',art.cumInside),adult:true,skipTo:`${pref}_morning`,journal:[journalKey]});

 N[`${pref}_cum_cloth`]=scene([
  narr(beats.cumCloth[0],art.cumCloth),
  {...say(c.id,...beats.cumCloth[1],'laughing'),portrait:false},
  narr(beats.cumCloth[2]),
  narr(beats.cumCloth[3])
 ],`${pref}_afterglow`,{...place(...[`ФИНИШ · ${c.place[0]}`,`FINISH · ${c.place[1]}`],'22:35',art.cumCloth),adult:true,skipTo:`${pref}_morning`,journal:[journalKey]});

 N[`${pref}_cum_chest`]=scene([
  narr(beats.cumChest[0],art.cumChest),
  {...say(c.id,...beats.cumChest[1],'flirty'),portrait:false},
  narr(beats.cumChest[2]),
  narr(beats.cumChest[3])
 ],`${pref}_afterglow`,{...place(...[`ФИНИШ · ${c.place[0]}`,`FINISH · ${c.place[1]}`],'22:35',art.cumChest),adult:true,skipTo:`${pref}_morning`,journal:[journalKey]});

 N[`${pref}_afterglow`]=scene([
  cg(note(`Мы лежим под одним одеялом. Лампа всё ещё горит.` ,`We lie under one blanket. The lamp is still on.`)),
  cg(say(c.id,...c.after,'friendly')),
  cg(note(`Я засыпаю под запах ${c.smell[0]}, секса и ${hisRu} кожи.` ,`I fall asleep under the smell of ${c.smell[1]}, sex and ${hisEn} skin.`))
 ],`${pref}_morning`,{...place(...[`ПОСЛЕ · ${c.place[0]}`,`AFTER · ${c.place[1]}`],'23:40',art.afterglow),adult:true,skipTo:`${pref}_morning`});

 N[`${pref}_morning`]=scene([
  note(...c.morning),
  note(`Я улыбаюсь и закрываю дверь так же тихо, как мы вчера её открывали.` ,`I smile and close the door as quietly as we opened it yesterday.`)
 ],morningNext,{...place(...[`УТРО · ${c.place[0]}`,`MORNING · ${c.place[1]}`],'07:40',art.home),day:T(`ДЕНЬ ${day}`,`DAY ${day}`),journal:[journalKey]});
}

function registerGroup(N,J,helpers,morningNext){
 const {note,me,cg,place,scene}=helpers;
 const pref=ADULT_GROUP_ID;
 J.adult_night_group={
  title:T('Ночь втроём','A night for three'),
  tag:T('ОТНОШЕНИЯ · ОТКРЫТОСТЬ','RELATIONSHIPS · OPENNESS'),
  text:T('Мы спросили друг друга вслух. Каждый мог сказать «нет».','We asked each other aloud. Anyone could have said “no”.')
 };
 N[`${pref}_ask`]=scene([
  note('Нас трое. Мы сидим близко, и я говорю вслух: мне дороги оба, и я хочу ночи только если все согласны.','There are three of us. We sit close, and I say aloud: both are dear to me, and I want the night only if everyone agrees.'),
  note('Никто не отшатывается. Кто-то улыбается, кто-то спрашивает: «Ты уверен{a}?»','Nobody recoils. Someone smiles, someone asks: “Are you sure?”'),
  note('«Нет» здесь всегда хороший ответ. Если кому-то неловко — скажите сейчас, и мы просто выпьем чаю.','“No” is always a good answer here. If anyone feels awkward — say so now and we will simply drink tea.')
 ],null,{...place('ВЕЧЕР · ВТРОЁМ','EVENING · THREE','22:00','room-window'),choices:[
  {label:T('Остаться вместе, раз все согласны','Stay together, since everyone agrees'),tone:'romance',next:`${pref}_fade`,effect:{groupBond:true},when:maleGate},
  {label:T('Выпить чаю и просто поговорить','Drink tea and simply talk'),tone:'friendship',next:morningNext}
 ]});

 N[`${pref}_fade`]=scene([
  note('Мы смеёмся, как неловко рассаживаемся на кровати — голые торсы, узкие speedo, чужие руки. Потом смех стихает, и каждый спрашивает глазами: можно?','We laugh at how awkwardly we find places on the bed — bare torsos, tight speedos, unfamiliar hands. Then the laughter fades, and each asks with their eyes: may I?'),
  note('Я целую одного в рот, пока второй гладит мой стояк через ткань. Потом меняемся: губы на шее, ладонь в чужом speedo, влажный холм под пальцами. Кто-то шепчет «ещё», кто-то «подожди» — оба ответа принимаются.','I kiss one on the mouth while the second strokes my hard-on through the cloth. Then we switch: lips on a neck, a palm inside someone else’s speedos, a wet bulge under my fingers. Someone whispers “more”, someone “wait” — both answers are accepted.'),
  note('Я вхожу в одного сзади, держа другого за руку у себя на члене. Смазка хлюпает, кровать стучит. Потом наоборот: тот, кто смотрел, теперь стонет в подушку, а второй целует меня, пока я двигаюсь.','I push into one from behind while the other holds my cock. Lube squelches, the bed knocks. Then the other way round: the one who was watching now moans into the pillow, and the second kisses me while I thrust.'),
  me('Всё хорошо? Скажите, если стоп.','Is everyone all right? Say so if it is stop.'),
  note('Оба кивают. Финиш общий: я кончаю в одного, второй кончает мне на живот и на чужие speedo; кто-то смеётся хрипло: «Да. Ещё можно — потом.» Мы падаем в кучу горячих тел.','Both nod. The finish is shared: I cum inside one, the second cums on my stomach and on someone else’s speedos; someone laughs roughly: “Yes. More is welcome — later.” We fall into a heap of hot bodies.')
 ],`${pref}_morning`,{...place('НОЧЬ · ВТРОЁМ','NIGHT · THREE','23:20','room-window'),adult:true,skipTo:`${pref}_morning`,journal:['adult_night_group']});

 N[`${pref}_morning`]=scene([
  note('Утром на кухне шумно: все пытаются поместиться у чайника, спорят, кто варит кофе, и никто не уходит.','In the morning the kitchen is noisy: everyone tries to fit by the kettle, argues about who makes the coffee, and nobody leaves.'),
  note('Мы не придумываем новых слов. Мы договариваемся говорить честно, не прятаться и не обещать лишнего.','We invent no new words. We agree to speak honestly, not to hide and not to promise too much.')
 ],morningNext,{...place('УТРО · ВТРОЁМ','MORNING · THREE','08:30','room-window'),day:T('ДЕНЬ 4','DAY 4'),journal:['adult_night_group']});
}

export function extendAdultEvenings({NODES:N,JOURNAL:J,BACKGROUNDS,n,scene}){
 const note=(ru,en)=>n(T(ru,en));
 const me=(ru,en)=>({speaker:'player',text:T(ru,en)});
 const say=(id,ru,en,emotion='flirty')=>({speaker:id,text:T(ru,en),emotion});
 const cg=(page)=>({...page,portrait:false});
 const out=()=>({kind:'tap',label:T('Продолжить','Continue'),object:T('Продолжить','Continue')});
 const place=(ru,en,time,bg)=>({bg,location:T(ru,en),time,portrait:false,exitAction:out()});
 const helpers={note,me,say,cg,place,out,scene};

 const morningNextFor=day=>({1:'night_messages',12:'bank_send',15:'document_evening'}[day]??`d${day}_end`);
 // Day 1: Nikola and Milica
 for(const person of ['nikola','milica']){
  registerPersonNight(N,J,BACKGROUNDS,helpers,person,1,morningNextFor(1));
 }
 // Days 6–15: full cast registry
 for(const day of ADULT_DAYS_ROUTE){
  for(const person of ADULT_PEOPLE){
   registerPersonNight(N,J,BACKGROUNDS,helpers,person,day,morningNextFor(day));
  }
 }
 // Day 4 group
 registerGroup(N,J,helpers,morningNextFor(4));

 // Registered after applyMobilePacing / assignChapters walk: attach exit actions and chapter marks by day.
 for(const [id,node] of Object.entries(N)){
  const m=/^evening(\d+)_/.exec(id)||(id.startsWith('route4_group_')?['','4']:null);
  if(!m)continue;
  const day=Number(m[1]);
  const meta=DAY_META[day];
  if(meta){
   node.chapterId=meta.id;
   node.chapter=`День ${meta.n} · ${meta.title}`;
   node.day=`ДЕНЬ ${meta.n}`;
  }
  if(!node.choices){
   const last=node.pages.length-1;
   const action=node.exitAction??out();
   node.actions={...(node.actions??{}),[last]:action};
   node.pages[last].action=action;
  }
 }
}
