// A short default entrance; original scene IDs remain available to old saves.
export function extendFastPrologue(N){
 const p=(speaker,text,emotion)=>({speaker,text,...(emotion?{emotion}:{})});
 const n=t=>p('narrator',t), y=t=>p('player',t), m=(t,e)=>p('milica',t,e), k=(t,e)=>p('nikola',t,e);
 const scene=(pages,extra={})=>({bg:'arrivals-hall',location:'АЭРОПОРТ · ПРИЛЁТ',time:'17:18',pages,...extra});
 const cafe=(pages,extra={})=>scene(pages,{bg:'airport-cafe',location:'АЭРОПОРТ · КОФЕ И ЗНАКОМСТВО',portrait:true,...extra});
 const bakery=(pages,extra={})=>scene(pages,{bg:'bakery',location:'ХЛЕБ & КИФЛЕ · АЭРОПОРТ',character:'nikola',...extra});
 N.quick_arrival=scene([
  {...n('Колёса касаются земли. Белград, лето и ни одного знакомого лица. Пока.'),bg:'airport-apron',time:'16:48'},
  {...n('Паспортный контроль позади. Пока иду к багажу, ещё раз открываю переписку с Драганом.'),bg:'arrivals-corridor',time:'17:02'},
  {...n('Драган сдаёт комнату, которую я забронировал{a} на первые дни. Прислал адрес и фотографию подъезда, обещал встретить с ключами. Уже есть куда ехать.'),bg:'baggage-claim',time:'17:07'}
 ],{journal:['address'],next:'quick_baggage',exitAction:{kind:'tap',label:'Забрать свой чемодан с ленты',object:'Забрать багаж',interaction:'baggage'}});
 N.quick_baggage=scene([
  {...n('Вот и мой чемодан. Подхватываю его с ленты и выдвигаю ручку. Родное заедающее колёсико — всё на месте.'),bg:'baggage-claim'},
  {...n('Прохожу таможню и выхожу в общий зал. Здесь уже встречают с цветами, спорят у дверей и пьют кофе. Можно наконец выдохнуть.'),bg:'airport-customs'},
  n('После перелёта хочется кофе. Можно купить его у симпатичного парня в пекарне. А можно взять в автомате — рядом с ним как раз стоит милая девушка с блокнотом. Что выбрать?')
 ],{choices:[
  {label:'Взять кофе в автомате и заговорить с девушкой',tone:'explore',next:'quick_milica',effect:{companion:'milica',quickArrival:true}},
  {label:'Купить кофе у парня в «Хлеб & Кифле»',tone:'explore',next:'quick_nikola',effect:{companion:'nikola',quickArrival:true}}
 ]});
 N.quick_milica=cafe([
  m('Если нажать ещё раз, он всё равно не приготовит тебе свидание. Только кофе.','laughing'),
  y('А я-то надеюсь на расширенное меню.'),
  m('Милица. За расширенное меню отвечаю я.','flirty'),
  y('{full}. Уже нравится местный сервис.')
 ],{journal:['milica'],choices:[
  {label:'«Ты всегда так соблазняешь людей у автомата?»',tone:'romance',next:'quick_milica_tease',effect:{milicaBond:'romance'}},
  {label:'«Тогда пойдём к столику — продолжим знакомство»',tone:'friendship',next:'quick_coffee',effect:{milicaBond:'friendship'}},
  {label:'«Поможешь разобраться с адресом?»',tone:'practical',next:'quick_milica_address',effect:{greeting:'honest'}}
 ]});
 N.quick_milica_tease=cafe([
  m('Только тех, кто мне нравится. Остальные читают инструкцию.','flirty'),
  y('То есть кофе здесь — самая безобидная часть знакомства?'),
  m('Пока да. Но не торопись: я ещё даже не знаю, как ты ведёшь себя на свидании.','laughing'),
  n('Она берёт стакан и кивает на свободный столик. Улыбка обещает разговор гораздо интереснее инструкции.')
 ],{journal:['milica_spark'],choices:[
  {label:'«Давай проверим. Считай, это уже свидание»',tone:'romance',next:'milica_chemistry',effect:{milicaBond:'romance',milicaBold:true}},
  {label:'«Начнём с кофе. Дальше посмотрим»',tone:'romance',next:'quick_coffee',effect:{milicaBond:'romance'}},
  {label:'«Ты забавная. Давай пока просто поболтаем»',tone:'friendship',next:'quick_coffee',effect:{milicaBond:'friendship'}}
 ]});
 N.quick_coffee=cafe([
  {...n('Мы садимся у окна. Милица ставит кофе между нами, а блокнот оставляет открытым.'),bg:'cafe-table'},
  m('Ну что, {full}: рассказать про Белград или показать, на что я тут засматриваюсь?','friendly'),
  n('На странице — окна, люди и чей-то недорисованный профиль. Кажется, он немного похож на мой.')
 ],{choices:[
  {label:'«Расскажи, с чего начать новую жизнь»',tone:'practical',next:'city',effect:{topic:'city'}},
  {label:'«Покажешь рисунки?»',tone:'friendship',next:'sketch',effect:{topic:'sketch'}},
  {label:'«Надеюсь, на меня. Я на тебя — точно»',tone:'romance',next:'milica_chemistry',effect:{milicaBond:'romance',milicaBold:true}}
 ]});
 N.milica_chemistry=cafe([
  m('Ты быстро осваиваешься. Некоторые начинают с погоды.','flirty'),
  y('Жарко. Особенно за этим столиком.'),
  m('Слабый заход. Но взгляд хороший, засчитаем.','laughing'),
  n('Она улыбается так, будто город можно на минуту отложить.'),
  m('Хватит аэропорта на сегодня. Если захочешь продолжить в городе — я на связи.','flirty')
 ],{next:'phone',journal:['milica_spark'],exitAction:{kind:'tap',label:'Проверить сообщения перед выходом',object:'Телефон'}});
 N.quick_nikola=bakery([
  k('Добро пожаловать. Кофе, кифла или сначала прийти в себя?','friendly'),
  n('Он подаёт пакет. Полоска света ложится на его предплечье; я чуть не забываю, что нужно было заказать.'),
  k('Я Никола. На витрину можно смотреть. На меня тоже, я не против.','flirty'),
  y('{full}. Спасибо за разрешение. Очень предусмотрительно.')
 ],{journal:['nikola','pastry'],choices:[
  {label:'«У тебя в меню только выпечка или можно заказать свидание?»',tone:'romance',next:'quick_nikola_tease',effect:{nikolaBond:'romance',nikolaMoment:'compliment'}},
  {label:'«Посоветуй что-нибудь вкусное для первого дня»',tone:'friendship',next:'quick_nikola_friend',effect:{nikolaBond:'friendship'}},
  {label:'«Подскажи выход к такси — и что взять с собой в дорогу»',tone:'practical',next:'nikola_directions'}
 ]});
 N.quick_nikola_tease=bakery([
  k('Свидания после смены. И без очереди, если ты оставишь номер.','flirty'),
  y('А дегустация входит?'),
  k('Кифла — сейчас. Всё остальное обсудим за кофе. Вне моей рабочей стойки.','laughing'),
  n('Он выдерживает мой взгляд. Теперь совершенно ясно: шутка ему понравилась.')
 ],{journal:['nikola_spark'],choices:[
  {label:'«Хорошо. Но после смены я продолжу флиртовать»',tone:'romance',next:'nikola_invite',effect:{nikolaBond:'romance',nikolaBold:true}},
  {label:'На секунду представить Николу без поло',tone:'dream',next:'nikola_daydream_early',effect:{nikolaBond:'romance',nikolaDaydream:true}},
  {label:'«Договорились. А пока расскажи о городе»',tone:'friendship',next:'nikola_questions',effect:{nikolaBond:'friendship'}}
 ]});
 N.quick_nikola_friend=bakery([
  k('Тёплую кифлу с сыром. И воду: в Белграде летом всё начинается с воды.','friendly'),
  y('Даже новая жизнь?'),
  k('Особенно она. Держи. А кофе можешь выпить здесь, не обязательно сразу бежать.','friendly')
 ],{next:'nikola_questions'});
 // The slower entrance gets the same opportunity for a bolder tone.
 N.coffee_start.choices.push({label:'«Город подождёт. Мне интереснее познакомиться с тобой»',tone:'romance',next:'milica_chemistry',effect:{milicaBond:'romance'}});
 N.nikola_break.choices.push({label:'«У тебя в меню только выпечка или можно заказать свидание?»',tone:'romance',next:'quick_nikola_tease',effect:{nikolaBond:'romance'}});
 N.milica_flirt.pages[0].text='Кофе — отличный предлог. Но сейчас я смотрю совсем не на кофе.';
 N.milica_flirt.pages[2].text='Я заметила. На следующую встречу можешь прийти без предлога. И без чемодана.';
 N.nikola_flirt.pages[1].text='Я заметил. Ты уже третий раз смотришь мимо витрины.';
}
