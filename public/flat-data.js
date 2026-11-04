// Data for the flat-hunting episode (day 1). Prices, deposits and discounts are conditions of this fictional story,
// not a rule of the Serbian rental market. Every Russian string is paired with an English one in HOUSING_EN.
export const HOUSING_EN={};
export const T=(ru,en)=>{
  if(Object.hasOwn(HOUSING_EN,ru)&&HOUSING_EN[ru]!==en)throw Error('Conflicting translation for: '+ru);
  HOUSING_EN[ru]=en;return ru;
};
export const OWNERS=['ana','stefan','marko','vuk'];
export const DISCOUNTS=[0,50,100,150];
export const DISTRICT_LABEL={dorcol:['Дорћол','Dorćol'],vracar:['Врачар','Vračar'],newbelgrade:['Новый Белград','New Belgrade']};
// The first flat shown for a district; Dorćol has a second one (Stefan's) that can be asked for.
export const DISTRICT_FIRST={dorcol:'ana',vracar:'marko',newbelgrade:'vuk'};
// One numeric flag keeps the save small: bits 0-3 mark the flats already seen, bits 4-9 the viewing checks of the current flat.
export const QUEST_FLAG='flatQuest';
export const SEEN_BIT={ana:1,stefan:2,marko:4,vuk:8};
export const hasSeen=(flags,owner)=>((flags[QUEST_FLAG]??0)&SEEN_BIT[owner])!==0;
export const viewMaskOf=flags=>((flags[QUEST_FLAG]??0)>>4)&63;
export const setViewMask=(flags,mask)=>{flags[QUEST_FLAG]=((flags[QUEST_FLAG]??0)&15)|((mask&63)<<4);};
// Effect key "flatEnter": the flat is marked as seen and its checks start from zero. The key itself is never stored.
// Effect key "flatPick": the flat is signed for, so the generic bond of the viewing becomes the landlord's own bond.
export function applyFlatEffect(flags,effect={}){
  if(Object.hasOwn(effect,'flatEnter')||Object.hasOwn(flags,'flatEnter')){
    const owner=effect.flatEnter??flags.flatEnter;delete flags.flatEnter;
    if(SEEN_BIT[owner])flags[QUEST_FLAG]=((flags[QUEST_FLAG]??0)|SEEN_BIT[owner])&15;
  }
  if(Object.hasOwn(effect,'flatPick')||Object.hasOwn(flags,'flatPick')){
    delete flags.flatPick;
    if(SEEN_BIT[flags.districtOwner]&&flags.rentalBond)flags['rentalBond_'+flags.districtOwner]=flags.rentalBond;
    delete flags.rentalBond;
  }
  return flags;
}
export const QUEST_STATIONS=[
 {id:'water',title:['Ванная и вода','Bathroom and water'],hint:['Нажми на кран, потом на душ','Tap the tap, then the shower'],targets:[['tap',['Кран','Tap']],['drain',['Душ и слив','Shower and drain']]]},
 {id:'windows',title:['Окна','Windows'],hint:['Открой окно и проверь раму','Open the window and check the frame'],targets:[['open',['Открыть окно','Open the window']],['frame',['Проверить раму','Check the frame']]]},
 {id:'internet',title:['Интернет и роутер','Internet and router'],hint:['Найди роутер и проверь связь','Find the router and test the signal'],targets:[['find',['Найти роутер','Find the router']],['test',['Проверить связь','Test the signal']]]}
];
export const FLATS={
 ana:{
  name:['Ана','Ana'],gender:'female',district:'dorcol',rent:420,bg:'dorcol-apartment',
  arrival:['Дорћол встречает короткими тенями и окнами. Ася ждёт у старой двери, рядом стоит Ана с камерой на плече.','Dorćol greets me with short shadows and windows. Asya waits by an old door, and Ana stands beside her with a camera on her shoulder.'],
  voice:['Привет. Я Ана. Стефан сейчас задерживается, но я покажу тебе квартиру.','Hi. I am Ana. Stefan is running late, but I can show you the flat.'],
  detail:['У окна лежат фотографии двора. Ана замечает мой взгляд: «Соседи попросили пока не выкладывать их лица. Я их понимаю».','Photographs of the courtyard lie by the window. Ana notices my glance. “The neighbours asked me not to post their faces yet. I understand.”'],
  price:['Квартира — {rent} евро в месяц, коммунальные отдельно, по счётчикам. Залог — один месячный платёж.','The flat is {rent} euros a month, utilities extra by meter. The deposit is one month’s payment.'],
  findings:{
   tap:['Горячая вода идёт не сразу, секунд тридцать. Зато напор ровный.','The hot water takes about thirty seconds to arrive, but the pressure is steady.'],
   drain:['Душ работает, слив не булькает. Над ванной висит новая шторка.','The shower works and the drain does not gurgle. A new curtain hangs over the bath.'],
   open:['Окно во двор открывается тяжело, зато шума почти нет: слышны только воробьи и соседи.','The courtyard window opens stiffly, but it is almost silent: only sparrows and neighbours.'],
   frame:['Рама старая, уплотнитель свежий. Для зимы Ана обещает плотную штору.','The frame is old but the seal is fresh. For winter Ana promises a heavy curtain.'],
   find:['Роутер стоит на полке у входа, пароль записан рядом.','The router sits on a shelf by the door with the password written beside it.'],
   test:['Скорость средняя: для звонков хватит, большие файлы лучше качать по кабелю.','The speed is average: fine for calls, but big files are better over a cable.']
  },
  summary:['Плюсы: высокие потолки и тихий двор. Минусы: горячая вода не сразу и интернет средний.','Pros: high ceilings and a quiet courtyard. Cons: the hot water is slow and the internet is average.']
 },
 stefan:{
  name:['Стефан','Stefan'],gender:'male',district:'dorcol',rent:360,bg:'dorcol-apartment',
  arrival:['Мы заходим в соседний дом двора. Стефан открывает дверь, вытирая руки от древесной пыли, Ася идёт следом.','We step into the next house in the courtyard. Stefan opens the door, wiping wood dust from his hands, and Asya follows.'],
  voice:['Привет, я Стефан. Не бойся, стол я уже починил. Дверь пока только обещал.','Hi, I am Stefan. Do not worry, I fixed the table already. The door only has my promise so far.'],
  detail:['Он показывает отреставрированный стул и смеётся: «Ана говорит, я умею отдыхать только с отвёрткой».','He shows me a restored chair and laughs. “Ana says I only know how to rest with a screwdriver.”'],
  price:['Квартира — {rent} евро в месяц, коммунальные отдельно, по счётчикам. Залог — один месячный платёж.','The flat is {rent} euros a month, utilities extra by meter. The deposit is one month’s payment.'],
  findings:{
   tap:['Кран новый, Стефан сам поменял его на днях. Вода тёплая быстро.','The tap is new; Stefan changed it himself the other day. The water warms quickly.'],
   drain:['Слив чуть шумит: трубы старые. «Знаю, — вздыхает Стефан. — Следующий в списке».','The drain hums a little; the pipes are old. “I know,” Stefan sighs. “Next on my list.”'],
   open:['Окно выходит на мастерскую. Днём там стучит молоток, вечером тихо.','The window faces the workshop. A hammer taps by day and it is quiet by evening.'],
   frame:['Рамы свежепокрашены и закрываются плотно, пахнет олифой.','The frames are freshly painted and close tight; there is a smell of varnish.'],
   find:['Роутер спрятан в ящике со шнурами. Стефан смущённо достаёт его.','The router is hidden in a drawer of cables. Stefan fishes it out, a little embarrassed.'],
   test:['Связь есть, но в дальнем углу слабеет. Нужен удлинитель.','There is signal, but it weakens in the far corner. A repeater would help.']
  },
  summary:['Плюсы: самая низкая цена и мастер под рукой. Минусы: шум мастерской днём и слабый сигнал в углу.','Pros: the lowest price and a handyman next door. Cons: workshop noise by day and a weak signal in one corner.']
 },
 marko:{
  name:['Марко','Marko'],gender:'male',district:'vracar',rent:450,bg:'vracar-apartment',
  arrival:['Врачар зелёный и шумный по-доброму. Ася ждёт у подъезда, а Марко уже придерживает дверь на третий этаж.','Vračar is green and cheerfully busy. Asya waits at the entrance while Marko holds the door open to the third floor.'],
  voice:['Привет, я Марко. Балкон смотрит во двор, а рабочий угол я придумал ещё до того, как нашёл жильца.','Hi, I am Marko. The balcony faces the courtyard, and I designed the work corner before I found a tenant.'],
  detail:['Он показывает стол у окна и аккуратно записанный список правил дома. Правила короткие и без восклицательных знаков.','He shows me a desk by the window and a neatly written list of house rules. The rules are short and have no exclamation marks.'],
  price:['Квартира — {rent} евро в месяц, коммунальные отдельно, по счётчикам. Залог — один месячный платёж.','The flat is {rent} euros a month, utilities extra by meter. The deposit is one month’s payment.'],
  findings:{
   tap:['Вода горячая сразу: бойлер новый. Напор отличный.','The water is hot at once: the boiler is new. The pressure is excellent.'],
   drain:['Вместо ванны душевая кабина. Для одного человека удобно, хотя поплескаться не получится.','There is a shower cabin instead of a bath. Comfortable for one person, though no soaking.'],
   open:['Балконная дверь открывается на дерево во дворе. Улица слышна слабо.','The balcony door opens onto a courtyard tree. The street is barely audible.'],
   frame:['Двойное стеклопакетное окно. Марко говорит, что зимой здесь тепло.','Double-glazed windows. Marko says it is warm here in winter.'],
   find:['Роутер стоит прямо у рабочего стола: угол продуман до розетки.','The router stands right by the desk; the corner is thought through down to the socket.'],
   test:['Скорость отличная, видеозвонок идёт без задержек.','Excellent speed; a video call runs without delay.']
  },
  summary:['Плюсы: балкон, быстрый интернет и готовый рабочий угол. Минусы: самая высокая цена.','Pros: a balcony, fast internet and a ready work corner. Cons: the highest price.']
 },
 vuk:{
  name:['Вук','Vuk'],gender:'male',district:'newbelgrade',rent:390,bg:'new-belgrade-apartment',
  arrival:['Новый Белград — широкие улицы и высокое небо. Ася выходит из автобуса, а Вук снимает наушники у подъезда.','New Belgrade means wide streets and a high sky. Asya steps off the bus while Vuk takes off his headphones at the entrance.'],
  voice:['Привет. Я Вук. Прости за наушники: записывал звук для спектакля.','Hi. I am Vuk. Sorry about the headphones; I was recording sound for a play.'],
  detail:['Он показывает окно и улыбается: «Тишина здесь настоящая. На записи мне приходится её придумывать».','He points to the window and smiles. “The quiet here is real. For recordings I have to make it up.”'],
  price:['Квартира — {rent} евро в месяц, коммунальные отдельно, по счётчикам. Залог — один месячный платёж.','The flat is {rent} euros a month, utilities extra by meter. The deposit is one month’s payment.'],
  findings:{
   tap:['Вода горячая, напор мощный, как в новом доме.','The water is hot with strong pressure, like in a new building.'],
   drain:['Ванная просторная, вытяжка работает тихо. Есть место для стиральной машины.','The bathroom is roomy and the fan is quiet. There is room for a washing machine.'],
   open:['Большое окно открывается на широкий вид. Шума почти нет: дом стоит вглубь квартала.','The big window opens onto a wide view. It is nearly silent; the building sits deep in the block.'],
   frame:['Тройное стекло. Вук ставил его ради тишины и гордится этим.','Triple glazing. Vuk installed it for the silence and is proud of it.'],
   find:['Роутер в нише, кабели подписаны. Видно, что здесь живёт звукорежиссёр.','The router sits in a niche with labelled cables. You can tell a sound engineer lives here.'],
   test:['Оптика: скорость высокая, звонки и загрузки идут без проблем.','Fibre: high speed; calls and downloads run without trouble.']
  },
  summary:['Плюсы: простор, тишина и быстрый интернет. Минусы: от центра около получаса на автобусе.','Pros: space, quiet and fast internet. Cons: about half an hour from the centre by bus.']
 }
};
export const finalRent=(owner,discount=0)=>FLATS[owner].rent-discount;
