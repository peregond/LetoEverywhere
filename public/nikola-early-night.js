// Early optional night with Nikola after the chapter-3 riverside date (kiss or hand).
// Male player tops Nikola. Gated by companion=nikola, profile gender male, and adult settings for the explicit beat.
// Friendly refusal at any step returns to chapter_three_close without penalty.
// Scene IDs keep the nikola_park_* prefix so they never collide with prologue nikola_invite / nikola_phone / …
// Flow: stay by the river → invite home → flat. No park detour. Full-bleed CGs never stack the standing sprite.
import {T} from './days.js?v=0.17.2';

const RIVER_BG='riverside-evening';
const TRAM_BG='belgrade-tram-stop-evening-v1';
const HOME_BG='nikola-apartment-night-v1';
const SCENE={
 seductive:'nikola-bedroom-seductive-v1',
 door:'nikola-door-kiss-v1',
 briefs:'nikola-briefs-bed-smile-v1',
 touch:'nikola-briefs-touch-v2',
 moan:'nikola-bed-moan-v1',
 jock:'nikola-ready-back-v1',
 fuck:'nikola-sex-moan-v1',
 climax:'nikola-climax-face-v1',
 cumInside:'nikola-after-bliss-v1',
 cumJock:'nikola-after-laugh-v1',
 cumChest:'nikola-after-tender-v1',
 afterglow:'nikola-afterglow-smile-v1'
};

export const NIKOLA_EARLY_NIGHT_BACKGROUNDS={
 [TRAM_BG]:{label:T('БЕЛГРАД · ОСТАНОВКА','BELGRADE · TRAM STOP'),description:T('Вечерняя остановка трамвая у реки','An evening tram stop by the river'),position:'50% 48%'},
 [HOME_BG]:{label:T('КВАРТИРА НИКОЛЫ · НОЧЬ','NIKOLA’S FLAT · NIGHT'),description:T('Небольшая спальня: лампа, простыни, подоконник с корицей','A small bedroom: lamp, sheets, cinnamon on the windowsill'),position:'50% 40%'},
 [SCENE.seductive]:{label:T('НИКОЛА · ВЗГЛЯД','NIKOLA · LOOK'),description:T('Никола в белых трусах, соблазнительная улыбка','Nikola in white briefs, a seductive smile'),position:'50% 35%'},
 [SCENE.door]:{label:T('НИКОЛА · У ДВЕРИ','NIKOLA · AT THE DOOR'),description:T('Никола в белых трусах у двери','Nikola in white briefs at the door'),position:'50% 40%'},
 [SCENE.briefs]:{label:T('НИКОЛА · БЕЛЫЕ BRIEF','NIKOLA · WHITE BRIEFS'),description:T('Никола на кровати в белых трусах, смотрит на меня и улыбается','Nikola on the bed in white briefs, looking at me with a smile'),position:'50% 35%'},
 [SCENE.touch]:{label:T('НИКОЛА · КАСАНИЕ','NIKOLA · TOUCH'),description:T('Никола на кровати в белых трусах, глаза закрыты, прикусил губу','Nikola on the bed in white briefs, eyes closed, biting his lip'),position:'50% 40%'},
 [SCENE.moan]:{label:T('НИКОЛА · СТОН','NIKOLA · MOAN'),description:T('Никола в белых трусах на кровати, стонет','Nikola in white briefs on the bed, moaning'),position:'50% 40%'},
 [SCENE.jock]:{label:T('НИКОЛА · НА КОЛЕНЯХ','NIKOLA · KNEELING'),description:T('Никола на коленях на кровати, оглядывается через плечо','Nikola kneeling on the bed, looking back over his shoulder'),position:'50% 40%'},
 [SCENE.fuck]:{label:T('НИКОЛА · СЕКС','NIKOLA · SEX'),description:T('Никола на спине, запрокинул голову и стонет','Nikola on his back, head thrown back, moaning'),position:'50% 40%'},
 [SCENE.climax]:{label:T('НИКОЛА · ОРГАЗМ','NIKOLA · CLIMAX'),description:T('Крупный план лица Николы в оргазме','Close-up of Nikola’s face at climax'),position:'50% 30%'},
 [SCENE.cumInside]:{label:T('НИКОЛА · ФИНИШ ВНУТРЬ','NIKOLA · FINISH INSIDE'),description:T('Никола на спине, мокрый от пота, блаженно улыбается','Nikola on his back, damp with sweat, smiling blissfully'),position:'50% 40%'},
 [SCENE.cumJock]:{label:T('НИКОЛА · ФИНИШ НА ДЖОКИ','NIKOLA · FINISH ON JOCK'),description:T('Никола на спине смеётся с закрытыми глазами','Nikola on his back, laughing with his eyes closed'),position:'50% 40%'},
 [SCENE.cumChest]:{label:T('НИКОЛА · ФИНИШ НА ГРУДЬ','NIKOLA · FINISH ON CHEST'),description:T('Никола на спине, нежно смотрит на меня снизу вверх','Nikola on his back, looking up at me tenderly'),position:'50% 40%'},
 [SCENE.afterglow]:{label:T('НИКОЛА · ПОСЛЕ','NIKOLA · AFTER'),description:T('Никола в белых трусах после, мягкая улыбка','Nikola in white briefs after, a soft smile'),position:'50% 40%'}
};

export function extendNikolaEarlyNight({NODES:N,JOURNAL:J,BACKGROUNDS,n,scene}){
 Object.assign(BACKGROUNDS,NIKOLA_EARLY_NIGHT_BACKGROUNDS);
 const note=(ru,en)=>n(T(ru,en));
 const me=(ru,en)=>({speaker:'player',text:T(ru,en)});
 // No page.character: standing sprite comes only from scene-level character when portrait is on.
 // CG pages keep portrait:false so the full-bleed art is never covered by the model.
 const nik=(ru,en,emotion='flirty')=>({speaker:'nikola',text:T(ru,en),emotion});
 const cg=(page)=>({...page,portrait:false});
 const out=label=>({kind:'tap',label,object:label});
 const place=(ru,en,time,bg,extra={})=>({bg,location:T(ru,en),time,portrait:false,exitAction:out(T('Продолжить','Continue')),...extra});
 const maleNikola={all:[{flag:'companion',equals:'nikola'},{gender:'male'}]};

 Object.assign(J,{
  nikola_early_night:{
   title:T('От реки к Николе','From the river to Nikola’s'),
   tag:T('ОТНОШЕНИЯ · РАННЯЯ НОЧЬ','RELATIONSHIPS · EARLY NIGHT'),
   text:T('После свидания у реки мы поехали к Николе. Всё было по взаимному «да».','After the riverside date we went to Nikola’s. Everything was by mutual “yes”.')
  }
 });

 // Entry: after kiss or holding hands, a male player who chose Nikola may invite him home from the river.
 for(const id of ['date_kiss','date_hand']){
  const node=N[id];
  const home=node.next;
  node.next=null;
  delete node.exitAction;
  node.choices=[
   {label:T('Предложить поехать к нему','Suggest going to his place'),tone:'romance',next:'nikola_park',effect:{nikolaPark:'asked'},when:maleNikola},
   {label:T('Попрощаться и пойти домой','Say goodbye and go home'),tone:'personal',next:home}
  ];
 }

 // 1. Stay by the river — clothed dialogue only
 N.nikola_park=scene([
  note('Мы остаёмся у воды. Набережная пустеет, река шумит ровнее, чем днём, и фонари уже жёлтые.','We stay by the water. The embankment empties, the river sounds steadier than by day, and the lamps are already yellow.'),
  nik('Без стойки и без кифлы ты мне нравишься ещё больше. Можно я скажу это вслух?','Without the counter and without a kifla I like you even more. May I say that out loud?','laughing'),
  note('Его льняная рубашка чуть расстёгнута. Когда он идёт рядом, я чувствую жар его плеча.','His linen shirt is slightly unbuttoned. When he walks beside me I feel the heat of his shoulder.'),
  me('Если скажешь «стоп», мы просто дойдём до трамвая. Но мне хочется тебя ближе.','If you say “stop”, we will just walk to the tram. But I want you closer.'),
  nik('Не говори «стоп». Мне тоже хочется. Пальцы дрожат, будто я снова мешу тесто в четыре утра.','Do not say “stop”. I want it too. My fingers are shaking as if I were kneading dough at four in the morning again.','shy')
 ],'nikola_park_invite',{...place('БЕЛГРАД · НАБЕРЕЖНАЯ','BELGRADE · EMBANKMENT','20:05',RIVER_BG),character:'nikola-evening',emotion:'flirty',portrait:true,music:'encounter'});

 // 2. Invitation at the stop — still clothed; underwear art waits until the flat
 N.nikola_park_invite=scene([
  note('У остановки трамвая Никола останавливается. Ключи в кармане звякают — он сжимает их сильнее, чем нужно.','At the tram stop Nikola stops. Keys jingle in his pocket — he grips them harder than he needs to.'),
  nik('Моя квартира в двух остановках. Можем просто посидеть. Или… если хочешь остаться на ночь — я хочу. Скажи прямо.','My flat is two stops away. We can just sit. Or… if you want to stay the night — I want that. Say it straight.','flirty'),
  note('Он смотрит мне в глаза и ждёт. Без шутки про кифлу — только вопрос.','He looks me in the eye and waits. No kifla joke — only the question.')
 ],null,{...place('БЕЛГРАД · ОСТАНОВКА','BELGRADE · TRAM STOP','20:20',TRAM_BG),character:'nikola-evening',emotion:'flirty',portrait:true,choices:[
  {label:T('«Да. Хочу трахнуть тебя у тебя дома»','“Yes. I want to fuck you at your place”'),tone:'romance',next:'nikola_park_home',effect:{nikolaPark:'yes'}},
  {label:T('«Не сегодня. Проводи меня до трамвая»','“Not tonight. Walk me to the tram”'),tone:'friendship',next:'nikola_park_decline',effect:{nikolaPark:'later'}}
 ]});

 N.nikola_park_decline=scene([
  nik('Хорошо. Спасибо, что сказал честно. Завтра всё равно испеку тебе кифлу.','All right. Thank you for saying it honestly. Tomorrow I will still bake you a kifla.','friendly'),
  note('Он провожает меня до дверей трамвая. Поцелуй на прощание короткий и тёплый — без обиды.','He walks me to the tram doors. The goodbye kiss is short and warm — without hurt.')
 ],'chapter_three_close',{...place('БЕЛГРАД · ОСТАНОВКА','BELGRADE · TRAM STOP','20:35',TRAM_BG),character:'nikola-evening',emotion:'friendly',portrait:true});
 // next rewritten to ada_tired after that scene exists (extendAdaEpisode).

 // 3. Home + consent (split for mobile pacing: ≤5 lines between actions)
 N.nikola_park_home=scene([
  note('В подъезде пахнет старым деревом. В квартире Николы тихо: на подоконнике остывает миска с тестом, в воздухе корица и тёплая мука.','The stairwell smells of old wood. Nikola’s flat is quiet: a bowl of dough cools on the windowsill, cinnamon and warm flour in the air.'),
  nik('Можно выключить свет? Или оставить лампу. Как тебе удобнее.','May I switch the light off? Or leave the lamp. Whichever you prefer.','shy'),
  me('Лампу оставь. Хочу видеть, как ты стонешь.','Leave the lamp. I want to see you moan.'),
  note('Он кивает и оставляет лампу. В коридоре становится только янтарный свет.','He nods and leaves the lamp on. Only amber light remains in the hall.')
 ],'nikola_park_door',{...place('КВАРТИРА НИКОЛЫ · КОРИДОР','NIKOLA’S FLAT · HALL','21:10',HOME_BG),character:'nikola-evening',emotion:'shy',portrait:true,journal:['nikola_early_night']});

 N.nikola_park_door=scene([
  cg(note('Я прижимаю его к двери. Он выше меня на голову, но податливый: раскрывает рот под поцелуем, трётся стояком о бедро через белые трусы, тяжело дышит мне в шею.','I pin him to the door. He is a head taller than me, but pliant: he opens his mouth under the kiss, rubs his hard-on against my thigh through white briefs, breathes hard into my neck.')),
  cg(nik('Бля… да. Хочу, чтобы ты меня трахнул. Только скажи, если что не так — я сразу остановлюсь. И ты тоже.','Fuck… yes. I want you to fuck me. Just say if anything is wrong — I will stop at once. And so will you.','flirty')),
  cg(me('Договорились. В спальню.','Agreed. Bedroom.'))
 ],'nikola_park_closer',{...place('КВАРТИРА НИКОЛЫ · ДВЕРЬ','NIKOLA’S FLAT · DOOR','21:15',SCENE.door)});

 // 4. Briefs — adult; skipped to morning when 18+ is off
 N.nikola_park_closer=scene([
  cg(note('Он скидывает рубашку. Остаётся в белых хлопковых Calvin Klein — узкая резинка, логотип на поясе. Ткань спереди уже тёмная от смазки: толстый член натягивает брифы так, что виден рельеф головки и ствола.','He drops the shirt. He is left in white cotton Calvin Klein briefs — narrow waistband, logo on the band. The fabric in front is already dark with precum: his thick cock stretches the briefs so the outline of the head and shaft shows.')),
  cg({...nik('Смотри, что ты со мной сделал ещё у реки.','Look what you did to me back at the river.','shy'),bg:SCENE.seductive}),
  cg({...note('Я провожу ладонью по натянутому холму. Он дёргается под пальцами, стонет сквозь зубы. Я сжимаю сильнее — чувствую жар, пульс, как яйца поджаты в белом хлопке.','I run my palm over the stretched bulge. It twitches under my fingers; he moans through his teeth. I squeeze harder — heat, pulse, his balls drawn tight in the white cotton.'),bg:SCENE.touch}),
  cg(me('На колени. Сними их зубами — нет, стой. Сначала джоки. Хочу тебя в белых джоках, когда буду входить.','On your knees. Take them off with your teeth — no, wait. Jockstrap first. I want you in a white jock when I push in.')),
  cg(nik('Они в ящике… секунду.','They are in the drawer… one second.','flirty'))
 ],'nikola_park_prep',{...place('КВАРТИРА НИКОЛЫ · КРОВАТЬ','NIKOLA’S FLAT · BED','21:25',SCENE.briefs),adult:true,skipTo:'nikola_park_morning'});

 // 5a. Prep — jock + fingers
 N.nikola_park_prep=scene([
  cg({...note('Он натягивает белые джоки Calvin Klein: узкий пояс, мешочек держит тяжёлые яйца и стоящий член, ягодицы полностью открыты — круглые, плотные, с лёгким загаром. Между щёк уже блестит, когда он встаёт на четвереньки на простыне.','He pulls on white Calvin Klein jockstraps: a narrow waistband, the pouch holding heavy balls and his hard cock, his ass fully bare — round, firm, lightly tanned. Between the cheeks it already gleams as he gets on all fours on the sheet.'),bg:SCENE.jock}),
  cg(nik('Пожёстче. Мне так нравится.','Harder. I like it.','flirty')),
  cg(note('Я обливаю пальцы, кружу по сжатому кольцу, вхожу одним — жарко, узко. Никола роняет голову в подушку, подаётся назад. Второй палец. Он матерится по-сербски и по-русски сразу: «Jebi… да, ещё».','I pour lube on my fingers, circle his tight ring, push one in — hot, narrow. Nikola drops his head into the pillow and pushes back. Second finger. He swears in Serbian and Russian at once: “Jebi… yes, more.”')),
  cg(me('Сейчас войду. Скажи «да».','I am going in now. Say “yes”.')),
  cg(nik('Да. Трахай меня. Хочу чувствовать твой член до упора.','Yes. Fuck me. I want to feel your cock all the way.','flirty'))
 ],'nikola_park_sex',{...place('КВАРТИРА НИКОЛЫ · ПОДГОТОВКА','NIKOLA’S FLAT · PREP','21:40',SCENE.jock),adult:true,skipTo:'nikola_park_morning'});

 // 5b. Sex + climax choice
 N.nikola_park_sex=scene([
  cg({...note('Головка упирается, проходит — он орёт в подушку, потом рвано смеётся. Я держу его за бёдра и медленно вхожу целиком: джоки натянуты на яйцах, спина выгибается, мышцы на пояснице ходят. Когда я начинаю двигаться жёстче, мошонка шлёпает о его, смазка хлюпает, кровать стучит о стену.','The head presses, slips in — he cries into the pillow, then laughs roughly. I hold his hips and slowly bury myself to the hilt: the jockstrap tight on his balls, his back arching, the muscles along his spine working. When I start thrusting harder, my sack slaps his, lube squelches, the bed knocks the wall.'),bg:SCENE.moan}),
  cg({...nik('Блядь… не останавливайся. Я весь твой. Можешь кончить куда хочешь — только предупреди.','Fuck… do not stop. I am all yours. You can cum wherever you want — just warn me.','flirty'),bg:SCENE.climax}),
  cg(note('Я ускоряюсь. Он подаётся навстречу каждому толчку, джоки мокрые спереди от его собственной смазки, голос срывается на стон.','I speed up. He meets every thrust, the jock wet in front from his own precum, his voice breaking into a moan.'))
 ],null,{...place('КВАРТИРА НИКОЛЫ · НОЧЬ','NIKOLA’S FLAT · NIGHT','22:10',SCENE.fuck),adult:true,skipTo:'nikola_park_morning',choices:[
  {label:T('Кончить в него глубоко','Cum deep inside him'),tone:'romance',next:'nikola_park_cum_inside',effect:{nikolaFinish:'inside'}},
  {label:T('Вытащить и кончить на белые джоки','Pull out and cum on the white jock'),tone:'romance',next:'nikola_park_cum_jock',effect:{nikolaFinish:'jock'}},
  {label:T('Перевернуть и кончить ему на грудь','Flip him and cum on his chest'),tone:'romance',next:'nikola_park_cum_chest',effect:{nikolaFinish:'chest'}}
 ]});

 N.nikola_park_cum_inside=scene([
  cg(note('Я вколачиваюсь до упора и кончаю в него — густыми толчками, удерживая бёдра. Никола сжимается вокруг члена так сильно, что я вижу звёзды; его собственный стояк дёргается в белом мешочке джоков, и он кончает следом, заливая ткань изнутри тёплым.','I slam in to the hilt and cum inside him — thick pulses, gripping his hips. Nikola clamps around my cock so hard I see stars; his own erection jerks in the white jock pouch and he cums right after, flooding the fabric from inside with heat.')),
  cg(nik('Чувствую… бля, как ты наполняешь. Не выходи сразу.','I feel it… fuck, you filling me. Do not pull out yet.','shy')),
  cg(note('Когда я медленно выхожу, сперма тянется нитью из его раскрытой дырки и капает на простыню между разведённых колен. Джоки мокрые спереди. Он дрожит и смеётся в голос.','When I slowly pull out, cum stretches in a string from his open hole and drips onto the sheet between his spread knees. The jock is soaked in front. He trembles and laughs out loud.'))
 ],'nikola_park_afterglow',{...place('КВАРТИРА НИКОЛЫ · ФИНИШ','NIKOLA’S FLAT · FINISH','22:25',SCENE.cumInside),adult:true,skipTo:'nikola_park_morning',journal:['nikola_early_night']});

 N.nikola_park_cum_jock=scene([
  cg(note('Я вытаскиваю мокрый член в последний момент и дрочу над ним. Никола на четвереньках подставляет зад и оглядывается — и я крою белые джоки густыми струями: на пояс, на натянутый мешочек, на голую поясницу, пока сперма не стекает по яйцам на простыню.','I pull my wet cock out at the last second and stroke over him. Nikola on all fours offers his ass and looks back — and I paint the white jock with thick ropes: on the waistband, on the stretched pouch, on his bare lower back, until cum runs down his balls onto the sheet.')),
  cg(nik('Грязно… и пиздец как горячо. Оставь так. Хочу заснуть в этих джоках.','Filthy… and fucking hot. Leave it. I want to fall asleep in this jock.','laughing')),
  cg(note('Он проводит пальцем по белой ткани, собирает каплю и облизывает, глядя на меня. Член у него всё ещё стоит, измазанный моим финишем.','He runs a finger over the white fabric, gathers a drop and licks it while looking at me. His cock is still hard, smeared with my finish.'))
 ],'nikola_park_afterglow',{...place('КВАРТИРА НИКОЛЫ · ФИНИШ','NIKOLA’S FLAT · FINISH','22:25',SCENE.cumJock),adult:true,skipTo:'nikola_park_morning',journal:['nikola_early_night']});

 N.nikola_park_cum_chest=scene([
  cg(note('Я вытаскиваю, переворачиваю его на спину. Джоки сбиты набок, член шлёпает о живот. Я сажусь ему на бёдра и кончаю на широкую грудь — белые полосы по загару, на соски, на шею, одна капля на нижнюю губу.','I pull out and flip him onto his back. The jock is shoved aside, his cock slaps his stomach. I straddle his thighs and cum on his broad chest — white stripes across the tan, on his nipples, on his throat, one drop on his lower lip.')),
  cg(nik('Вкус как после смены — солёный. Иди сюда.','Tastes like after a shift — salty. Come here.','flirty')),
  cg(note('Он тянет меня в поцелуй, размазывая сперму между нами. Под джоками его член всё ещё твёрдый; я сжимаю мешочек ладонью, и он кончает себе на живот, добавляя к моим следам.','He pulls me into a kiss, smearing cum between us. Under the jock his cock is still hard; I squeeze the pouch in my palm and he cums onto his own stomach, adding to my marks.'))
 ],'nikola_park_afterglow',{...place('КВАРТИРА НИКОЛЫ · ФИНИШ','NIKOLA’S FLAT · FINISH','22:25',SCENE.cumChest),adult:true,skipTo:'nikola_park_morning',journal:['nikola_early_night']});

 N.nikola_park_afterglow=scene([
  cg(note('Мы лежим под одним одеялом. Лампа всё ещё горит. Никола кладёт тяжёлую руку мне на грудь и тихонько смеётся в волосы.','We lie under one blanket. The lamp is still on. Nikola puts a heavy arm across my chest and laughs softly into my hair.')),
  cg(nik('Если завтра утром будет неловко — скажи. А сейчас мне пиздец как хорошо.','If it feels awkward tomorrow morning — say so. Right now I feel fucking good.','friendly')),
  cg(note('Я засыпаю под запах корицы, секса и его кожи.','I fall asleep under the smell of cinnamon, sex and his skin.'))
 ],'nikola_park_morning',{...place('КВАРТИРА НИКОЛЫ · ПОСЛЕ','NIKOLA’S FLAT · AFTER','23:40',SCENE.afterglow),adult:true,skipTo:'nikola_park_morning'});

 // 6. Morning → back to chapter close
 N.nikola_park_morning=scene([
  note('Утром его уже нет в кровати — смена в пекарне. На столе кифла в бумаге и записка корявым почерком: «Горячее. Приходи, когда захочешь. — Н.»','In the morning he is already gone from the bed — bakery shift. On the table a kifla in paper and a note in uneven handwriting: “Something hot. Come whenever you like. — N.”'),
  note('Джоки сушатся на спинке стула. Я улыбаюсь и закрываю дверь его квартиры так же тихо, как мы вчера её открывали.','The jockstrap is drying on the chair back. I smile and close his flat door as quietly as we opened it yesterday.')
 ],'chapter_three_close',{...place('КВАРТИРА НИКОЛЫ · УТРО','NIKOLA’S FLAT · MORNING','07:40',HOME_BG),day:T('ДЕНЬ 2','DAY 2'),journal:['nikola_early_night']});
 // next rewritten to third_morning after Day 2 exists (wireNikolaEarlyNightExits).
}
