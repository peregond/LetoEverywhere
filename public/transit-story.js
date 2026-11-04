import {T} from './days.js?v=0.17.15';
const note=(ru,en)=>({speaker:'narrator',text:T(ru,en)});

// Belgrade's city buses, trams and trolleybuses have been free since 2025.
export function extendTransitStory({NODES:N}){
 const start=N.d3_start;
 start.pages[0].text=T('Город перестаёт быть картой: сегодня мне нужны местная связь, городской транспорт и немного динаров.','The city stops being a map: today I need local mobile service, city transport and a little cash.');
 const morning=T('Сегодня мы гуляем по городу вместе: нужно разобраться со связью, транспортом и обменом денег.','Today we are exploring the city together: we need to sort out mobile service, transport and currency exchange.');
 start.pages[0].text=morning;start.pages[0].contactText={nikola:morning,milica:morning};
 start.pages[1].text=T('Мы сверяем планы и решаем начать с того, без чего завтра будет сложнее всего.','We compare plans and decide to start with whatever would make tomorrow hardest.');
 const rendezvous=T('Пойдём вместе. С транспортом разберёмся по пути.','Let’s go together. We’ll figure out the transport on the way.');
 start.pages[2].text=rendezvous;start.pages[2].contactText={nikola:rendezvous,milica:rendezvous};
 start.choices[1].label=T('Найти, где купить месячный проездной','Find where to buy a monthly transport pass');
 N.d3_o1.pages[0].text=T('Мы собираемся зайти в салон связи, а сначала идём к остановке.','We plan to visit a mobile shop, but first we head to the stop.');
 N.d3_o1.pages[1].text=T('С оператором разберёмся чуть позже. Сначала я проверю, где купить проездной.','We will sort out the operator a little later. First I will check where to buy a transport pass.');
 const toStop={kind:'tap',label:T('Пойти к остановке','Go to the stop'),object:T('Пойти к остановке','Go to the stop')};
 N.d3_o1.actions[1]=toStop;N.d3_o1.pages[1].action=toStop;N.d3_o1.exitAction=toStop;
 for(const id of ['d3_o1','d3_o3'])N[id].next='d3_o2';
 const play={kind:'tap',label:T('Собрать динары на проездной','Collect dinars for a transport pass'),object:T('Собрать динары на проездной','Collect dinars for a transport pass'),quest:'coin-catch'};
 const leave={kind:'tap',label:T('Пойти к остановке с кофе','Head to the stop with coffee'),object:T('Пойти к остановке с кофе','Head to the stop with coffee')};
 const free=T('Погоди, какой проездной? В Белграде городской транспорт бесплатный: автобусы, трамваи и троллейбусы.','Wait, what pass? Belgrade’s city buses, trams and trolleybuses are free.');
 N.d3_o2.pages=[
  {...note('Я достаю динары и пытаюсь собрать на месячный проездной. Кажется, у купюр совсем другие планы.','I take out my dinars and try to gather enough for a monthly pass. The banknotes seem to have other plans.'),action:play},
  {speaker:'contact',cameo:true,emotion:'friendly',text:free,contactText:{nikola:free,milica:free}},
  {speaker:'player',text:T('То есть я только что собирал{a} динары на билет, который стоит ноль?','So I just gathered dinars for a ticket that costs nothing?')},
  {...note('Я смеюсь и покупаю Милице кофе в киоске у остановки. Кажется, деньгам нашлось дело получше.','I laugh and buy Milica a coffee from the kiosk by the stop. It seems the money has found a better use.'),contactText:{nikola:T('Я смеюсь и покупаю Николе кофе в киоске у остановки. Кажется, деньгам нашлось дело получше.','I laugh and buy Nikola a coffee from the kiosk by the stop. It seems the money has found a better use.'),milica:T('Я смеюсь и покупаю Милице кофе в киоске у остановки. Кажется, деньгам нашлось дело получше.','I laugh and buy Milica a coffee from the kiosk by the stop. It seems the money has found a better use.')}},
  {speaker:'contact',cameo:true,emotion:'friendly',text:T('Лучший проездной, который я видел{a}. Особенно если кофе для меня.','The best transport pass I have ever seen. Especially if the coffee is for me.'),contactText:{nikola:T('Лучший проездной, который я видел. Особенно если кофе для меня.','The best transport pass I have ever seen. Especially if the coffee is for me.'),milica:T('Лучший проездной, который я видела. Особенно если кофе для меня.','The best transport pass I have ever seen. Especially if the coffee is for me.')},action:leave}
 ];
 N.d3_o2.actions={0:play,4:leave};N.d3_o2.exitAction=leave;
 const rest=T('Осталось заглянуть в обменник. Я сравниваю курс и сохраняю чек.','The exchange office is the last stop. I compare the rate and keep the receipt.');
 const finished=T('Связь, транспорт и обмен денег наконец разобраны. Можно просто идти дальше по городу.','The phone, transport and currency exchange are finally sorted. Now I can simply enjoy the city.');
 N.d3_mid.pages[0].text=rest;N.d3_mid.pages[0].byFlag={flag:'errand',text:{phone:rest,card:rest,money:finished,default:rest}};
 N.d3_mid.pages[1].text=T('К полудню в кошельке лежат динары, в телефоне работает местный номер, а городской транспорт уже не кажется загадкой.','By noon there are dinars in my wallet, a local number on my phone and city transport no longer feels like a mystery.');
 N.d3_mid.pages[2].text=T('Мы едем по городу без карты в руках. Остановки сами подсказывают, где выходить.','We ride across the city without a map in hand. The stops themselves tell us where to get off.');
 N.d3_m1.pages[0].text=T('Мы заходим в булочную, и по дороге к прилавку я трижды повторяю фразу по-сербски. Продавец понимает с первого раза.','We enter the bakery, and on the way to the counter I repeat the Serbian phrase three times. The seller understands at once.');
 N.d3_m1.pages[1].text=T('Я улыбаюсь, получаю булочку и возвращаюсь к спутнику. Маленькая победа, которой приятно поделиться.','I smile, collect my roll and return to my companion. It is a small victory, and a nice one to share.');
 N.d3_m2.pages[0].text=T('Мы садимся на лавочку у сквера. Мимо идут люди с пакетами, детьми и собаками.','We sit on a bench by the square. People pass with bags, children and dogs.');
 N.d3_m2.pages[1].text=T('Впервые город ничего от меня не требует. Мы просто сидим рядом и наблюдаем.','For the first time the city asks nothing of me. We just sit together and watch.');
 N.d3_turn.pages[0].text=T('К вечеру мы возвращаемся к остановке и сверяем заметки: где что нашли и куда ещё хочется зайти.','By evening we return to the stop and compare notes: what we found and where else we want to go.');
 N.d3_turn.pages[1].speaker='contact';
 N.d3_turn.pages[2].text=T('Мы смеёмся: за один день у нас уже появились любимые места и пара историй о городских очередях.','We laugh: in one day we have already found favourite places and a couple of stories about city queues.');
 N.d3_end.pages[0].text=T('К вечеру телефон работает, городской транспорт оказался бесплатным, а дорога до дома занимает на пять минут меньше.','By evening the phone works, city transport has turned out to be free, and the way home takes five minutes less.');
 N.d3_end.pages[1].text=T('У дома мы прощаемся и договариваемся увидеться снова. Даже обычные дела оказались хорошим поводом провести день вместе.','We say goodbye outside my home and agree to meet again. Even ordinary errands turned out to be a good reason to spend the day together.');
 for(const id of ['d3_start','d3_o1','d3_o2','d3_o3','d3_mid','d3_m2','d3_turn','d3_end'])N[id].companionPortrait=true;
 N.d3_mobile_choice.companionPortrait=true;
 N.d3_mobile_choice.pages[0].text=T('Мы сравниваем операторов. Выберу салон и уточню доступные варианты на месте.','We compare the operators. I will choose a shop and ask about the options available there.');
 for(const id of ['a1','yettel','mts'])N['d3_mobile_'+id].pages[0].text=T('Мы заходим в салон. Я подхожу к стойке и готовлю вопросы про местный номер.','We enter the shop. I approach the counter and get my questions about a local number ready.');
}
