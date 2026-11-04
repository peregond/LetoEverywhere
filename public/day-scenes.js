// Days 3-11, 13 and 14: the preparation days of the thirty-day story. Each day is five scenes on any path:
// a morning, one small choice and its consequence, the middle of the day, a turn with the second person, and an evening.
// Facts stay general (see DAYS.md): outcomes are fictional and the player is told to check official sources.
import {T,STAGES,legacyDayFor as dayFor,castHelpers} from './days.js?v=0.17.2';
// The shared day builder: dayKit() gives build(), opt() and the cast helpers for one set of nodes.
export function dayKit({NODES:N,JOURNAL:J,n,scene}){
 const out=label=>({kind:'tap',label,object:label});
 const {A,L,contact,counter,owner,neighbour,route,note}=castHelpers(n);
 // build(): start (choice) -> option scene -> middle -> turn -> evening; the evening keeps the d<N>_end id.
 const build=(d,cfg)=>{
  const meta=dayFor(d),place='БЕЛГРАД · '+meta.title.toUpperCase(),base=(extra={})=>({bg:cfg.bg,location:place,day:'ДЕНЬ '+d,exitAction:out('Продолжить'),...cfg.extra,...extra});
  const id=name=>'d'+d+'_'+name;
  N[id('start')]=scene(cfg.start,null,base({time:cfg.time,effectOnEnter:{dayDone:d-1},choices:cfg.options.map((o,i)=>({label:T(...o.label),tone:o.tone,next:id('o'+(i+1)),effect:o.effect}))}));
  cfg.options.forEach((o,i)=>{N[id('o'+(i+1))]=scene(o.pages,id('mid'),base({time:cfg.time,exitAction:out(T(...o.exit))}));});
  N[id('mid')]=scene(cfg.mid,id('turn'),base({time:cfg.midTime,...(cfg.midExtra??{}),exitAction:out(T(...cfg.midExit)),...(cfg.mid2?{next:null,choices:cfg.mid2.map((o,i)=>({label:T(...o.label),tone:o.tone,next:id('m'+(i+1)),effect:o.effect}))}:{})}));
  (cfg.mid2??[]).forEach((o,i)=>{N[id('m'+(i+1))]=scene(o.pages,id('turn'),base({time:cfg.midTime,exitAction:out(T(...o.exit))}));});
  N[id('turn')]=scene(cfg.turn,id('end'),base({time:cfg.turnTime,...(cfg.turnExtra??{}),exitAction:out(T(...cfg.turnExit))}));
  N[id('end')]=scene(cfg.end,dayFor(d+1).start,base({time:'21:00',lighting:'night',journal:['day_'+d],exitAction:out('Продолжить · День '+(d+1))}));
  J['day_'+d]={title:meta.title,tag:'ДЕНЬ '+d+' · '+STAGES[meta.stage].toUpperCase(),text:cfg.end[cfg.end.length-1].text};
 };
 const opt=(label,tone,effect,pages,exit)=>({label,tone,effect,pages,exit});

 return {build,opt,note,A,L,contact,counter,owner,neighbour,route};
}
export function extendFirstHalf({NODES:N,JOURNAL:J,n,scene}){
 const {build,opt,note,A,L,contact,counter,owner,neighbour,route}=dayKit({NODES:N,JOURNAL:J,n,scene});
 // Day 3: phone, transport, money. Airport pair.
 build(3,{bg:'belgrade-morning-cafe',time:'09:00',midTime:'12:10',turnTime:'17:30',
  start:[
   note('Город перестаёт быть картой: сегодня мне нужны местная связь, проездная карта и немного динаров.','The city stops being a map: today I need local mobile service, a transport card and a little cash.'),
   note('Список короткий, но у каждого пункта своя очередь. Я решаю начать с того, без чего завтра будет сложнее всего.','The list is short, but every item has its own queue. I decide to begin with whatever would make tomorrow hardest.'),
   contact(['Проездную карту удобнее пополнять в киоске: очередь короче, чем у автомата.','It is easier to top up the transport card at a kiosk: the queue is shorter than at the machine.'],['Проездную карту я пополняю в киоске: очередь там короче, чем у автомата.','I top up my transport card at a kiosk: the queue is shorter than at the machine.'])],
  options:[
   opt(['Зайти в салон связи у остановки','Go into the mobile shop by the stop'],'practical',{errand:'phone'},[
    note('В салоне пахнет кондиционером и пластиком. Сотрудник объясняет тарифы по пальцам: гигабайты, минуты, срок действия.','The shop smells of air conditioning and plastic. The assistant explains the plans on his fingers: gigabytes, minutes, how long they last.'),
    note('Я прошу показать условия письменно и выбираю тариф без длинного контракта. Паспорт нужен — хорошо, что он с собой.','I ask to see the terms in writing and choose a plan without a long contract. A passport is needed, and I am glad I have mine with me.')],['Выйти с новым номером','Walk out with a new number']),
   opt(['Найти киоск с проездными','Find a kiosk that sells transport cards'],'practical',{errand:'card'},[
    note('Очередь у киоска короче, чем у автомата, как и обещали. Продавец называет цену раньше, чем я успеваю спросить.','The queue at the kiosk is shorter than at the machine, as promised. The seller names the price before I can ask.'),
    note('Я пополняю карту на неделю и прикладываю её к считывателю на остановке. Зелёный сигнал — маленький праздник.','I top up the card for a week and touch it to the reader at the stop. The green signal is a small celebration.')],['Сесть в трамвай','Board the tram']),
   opt(['Заглянуть в обменник на углу','Look into the exchange office on the corner'],'practical',{errand:'money'},[
    note('Курс написан на витрине крупно, но я всё равно сравниваю его с тем, что вижу в телефоне.','The rate is written large in the window, but I still compare it with what I see on my phone.'),
    note('Я меняю небольшую сумму, а не всё сразу. Чек оставляю: так спокойнее, чем объяснять потом, откуда у меня динары.','I change a small sum rather than everything at once. I keep the receipt: it is calmer than explaining later where my dinars came from.')],['Пересчитать динары','Count the dinars'])],
  mid:[
   note('Остальные два дела я делаю по пути, в любом порядке: у каждого оказывается своя маленькая очередь и свой ритуал.','The other two errands I do on the way, in any order: each has its own small queue and its own ritual.'),
   note('К полудню в кошельке лежат динары, в телефоне работает местный номер, а карта проезда не теряется между чеками.','By noon there are dinars in my wallet, a local number on my phone and a transport card that no longer gets lost among receipts.'),
   note('Я впервые еду по городу без карты в руках. Остановки сами подсказывают, где выходить.','For the first time I ride across the city without a map in my hand. The stops themselves tell me where to get off.')],midExit:['Выйти на знакомой остановке','Get off at a familiar stop'],
  mid2:[
   opt(['Зайти в булочную и заказать по-сербски','Go into the bakery and order in Serbian'],'explore',{ordered:'serbian'},[note('Я повторяю фразу трижды, пока иду к прилавку. Продавец понимает с первого раза и отвечает так быстро, что я ловлю только слово «пожалуйста».','I repeat the phrase three times on the way to the counter. The seller understands at once and answers so fast that I catch only the word “please”.'),note('Я улыбаюсь и получаю булочку. Маленькая победа, но она греет весь остаток дня.','I smile and get my roll. A small victory, but it warms the rest of the day.')],['Съесть булочку на ходу','Eat the roll on the way']),
   opt(['Посидеть на лавочке и посмотреть на город','Sit on a bench and watch the city'],'personal',{ordered:'bench'},[note('Я сажусь на лавочку у сквера. Мимо идут люди с пакетами, детьми и собаками, и никто не торопится в мою сторону.','I sit on a bench by the square. People pass with bags, children and dogs, and nobody hurries towards me.'),note('Впервые город ничего от меня не требует. Я просто наблюдаю, и это тоже подготовка к жизни здесь.','For the first time the city asks nothing of me. I simply watch, and that too is preparation for living here.')],['Встать и пойти дальше','Get up and walk on'])],
  turn:[
   note('Вечером мы встречаемся у остановки и сверяем заметки: кто где менял деньги, кто чем пользуется.','In the evening we meet at the stop and compare notes: who changed money where, who uses what.'),
   counter(['А обменник выбирай тот, где курс висит на витрине и чек дают сразу.','And pick an exchange office where the rate is on display and you get a receipt at once.'],['Курс на витрине и чек в руки — вот и всё, что нужно знать про обменник.','A rate on display and a receipt in hand: that is all you need to know about an exchange office.']),
   note('Мы смеёмся: у каждого оказывается свой любимый обменник и своя священная очередь.','We laugh: everyone turns out to have a favourite exchange office and a sacred queue.')],turnExit:['Пойти домой по новой привычной дороге','Go home along a newly familiar road'],
  end:[
   note('К вечеру телефон работает, карта пополнена, а дорога до дома занимает на пять минут меньше.','By evening the phone works, the card is topped up, and the way home takes five minutes less.'),
   note('Маленькие дела складываются в привычку: завтра мне не придётся искать, куда идти.','Small errands add up to a habit: tomorrow I will not have to look for where to go.')]});

 // Day 4: registering the place of stay. Hosts pair; the flat's owner is addressed without a name.
 build(4,{bg:'document-desk',time:'09:00',midTime:'11:30',turnTime:'16:00',extra:{districtBg:true},
  start:[
   note('Утром я перечитываю заметки: место пребывания нужно зарегистрировать в первые сутки после въезда, и проверить это лучше сразу.','In the morning I reread my notes: a place of stay has to be registered within the first day after entry, and it is better to check at once.'),
   note('Я спрашиваю владельца жилья, оформлена ли регистрация и где лежит подтверждение. Вопрос простой, но задавать его всё равно неловко.','I ask the owner whether the registration is done and where the confirmation is kept. The question is simple, but it is still awkward to ask.'),
   owner(['Регистрацию оформили в первые сутки, подтверждение лежит в папке на комоде. Заявление о жилье подпишу, когда скажешь.','The registration was done within the first day, and the confirmation is in the folder on the chest of drawers. I will sign the housing statement whenever you say.'],['Регистрацию оформила в первые сутки, подтверждение лежит в папке на комоде. Заявление о жилье подпишу, когда скажешь.','I did the registration within the first day, and the confirmation is in the folder on the chest of drawers. I will sign the housing statement whenever you say.'])],
  options:[
   opt(['Сфотографировать подтверждение и сохранить копию','Photograph the confirmation and keep a copy'],'practical',{regDoc:'photo'},[
    note('Я кладу лист на стол у окна и снимаю его при ровном свете, без бликов и обрезанных краёв.','I lay the sheet on the table by the window and photograph it in even light, with no glare or cropped edges.'),
    note('Копия отправляется в папку на телефоне и в письмо самой себе. Бумага может потеряться, а фотография — не обязательно.','The copy goes into a folder on my phone and into an email to myself. A paper can get lost; a photograph does not have to.')],['Подписать название файла','Name the file']),
   opt(['Попросить оригинал и положить в свою папку','Ask for the original and put it in my own folder'],'practical',{regDoc:'paper'},[
    note('Владелец достаёт лист из папки и без вопросов отдаёт мне. Я обещаю вернуть копию, если она понадобится дому.','The owner takes the sheet out of the folder and hands it over without questions. I promise to give a copy back if the house needs one.'),
    note('Оригинал ложится в прозрачный файл. Я пишу на корешке дату и слово «жильё» — так я найду его без поисков.','The original goes into a clear sleeve. On the spine I write the date and the word “housing”, so that I can find it without searching.')],['Закрыть папку','Close the folder']),
   opt(['Спросить, нужно ли что-то подписать мне','Ask whether there is anything I need to sign'],'personal',{regDoc:'ask'},[
    note('Я спрашиваю прямо: возможно, часть бумаг должен подписывать и я. Лучше уточнить сейчас, чем узнать об этом у окошка.','I ask directly: perhaps I have to sign some of the papers too. It is better to clarify now than to find out at a counter.'),
    note('Ответ не сразу, но честный: подписать нужно только согласие на обработку данных. Остальное — на стороне владельца.','The answer takes a moment but is honest: I only have to sign a consent to data processing. The rest is on the owner’s side.')],['Поблагодарить за прямоту','Thank them for the frankness'])],
  mid:[
   note('Следующая бумага — письменное заявление владельца о жилье. Оно пригодится позже, когда я буду готовить заявление на проживание.','The next paper is the owner’s written statement about the housing. It will matter later, when I prepare my residence application.'),
   note('Я показываю, какие данные нужны: адрес, даты, имена, подписи. Форму и сроки я проверяю по официальным источникам: чужие образцы не заменяют требований.','I show what details are needed: address, dates, names, signatures. I check the form and deadlines against official sources: other people’s templates do not replace the requirements.'),
   note('Мы договариваемся, что владелец подпишет заявление после того, как я проверю форму и принесу её распечатанной.','We agree that the owner will sign the statement once I have checked the form and brought it printed.')],midExit:['Убрать бумаги в папку','Put the papers in the folder'],
  mid2:[
   opt(['Спросить о правилах дома','Ask about the house rules'],'personal',{houseTalk:'rules'},[note('Я спрашиваю о мелочах, которые обычно узнаются поздно: где мусор, кто платит за свет, когда лучше не шуметь.','I ask about the little things that are usually learned late: where the rubbish goes, who pays for electricity, when it is better not to make noise.'),note('Владелец отвечает подробно и с юмором. Оказывается, правила дома — ещё один способ познакомиться.','The owner answers in detail and with humour. It turns out the house rules are one more way of getting acquainted.')],['Записать правила','Write down the rules']),
   opt(['Сразу распечатать форму для проверки','Print the form for checking straight away'],'practical',{houseTalk:'print'},[note('Я нахожу место, где можно распечатать документы, и несу лист домой тёплым от принтера.','I find a place where documents can be printed and carry the sheet home, still warm from the printer.'),note('Читаю форму с карандашом: каждое поле отмечено, каждый вопрос записан. Завтра отнесу её владельцу.','I read the form with a pencil: every field is marked, every question written down. Tomorrow I will take it to the owner.')],['Убрать лист в папку','Put the sheet into the folder'])],
  turn:[
   note('Пока мы возимся с бумагами, на кухню заходит ещё один хозяин дома: чайник уже свистит.','While we fuss with the papers, another host of the house comes into the kitchen; the kettle is already whistling.'),
   neighbour(['Я тоже когда-то проходила это. Если будут вопросы по бумагам, спрашивай.','I went through this too once. If you have questions about the papers, ask.'],['Я тоже когда-то проходил это. Если будут вопросы по бумагам, спрашивай.','I went through this too once. If you have questions about the papers, ask.']),
   note('Мы пьём чай вчетвером с бумагами. Разговор о регистрации перестаёт быть неловким.','We drink tea around the papers. The talk about registration stops being awkward.')],turnExit:['Допить чай','Finish the tea'],
  end:[
   note('Копия подтверждения лежит в папке, а заявление владельца ждёт проверки формы. Дело не закончено, но у него есть понятный следующий шаг.','A copy of the confirmation is in the folder, and the owner’s statement waits for the form to be checked. The job is not done, but it has a clear next step.'),
   note('Скучная бумага оказывается самой спокойной частью дня.','The dull paper turns out to be the calmest part of the day.')]});

 // Day 5: how many days. Asya and Luka.
 build(5,{bg:'document-desk',time:'09:00',midTime:'12:00',turnTime:'18:00',
  start:[
   note('Сегодня я считаю то, что раньше только чувствовал{a}: сколько дней я могу находиться в стране без заявления.','Today I count what I used to only feel: how many days I may stay in the country without an application.'),
   note('Срок зависит от гражданства, поэтому я не хочу считать по чужим рассказам. Нужен способ, которому можно доверять.','The period depends on citizenship, so I do not want to count by other people’s stories. I need a method I can trust.'),
   A('Когда я считала дни, первое число всегда пугало. Потом оно превратилось в обычную строку в календаре.','When I counted my days, the first number always frightened me. Then it became an ordinary line in the calendar.','thoughtful')],
  options:[
   opt(['Открыть официальный калькулятор','Open the official calculator'],'practical',{clockCheck:'calculator'},[
    note('Калькулятор спрашивает гражданство и дату въезда и выдаёт простую цифру. Мелким шрифтом написано, что результат нужно сверять с документами.','The calculator asks for citizenship and the entry date and gives a plain number. In small print it says the result must be checked against documents.'),
    note('Я не верю цифре, пока не вижу, откуда она взялась. Но она совпадает с расчётом на пальцах.','I do not trust a number until I see where it comes from. But it matches my count on my fingers.')],['Записать результат','Write down the result']),
   opt(['Сверить дату со штампом в паспорте','Check the date against the stamp in my passport'],'practical',{clockCheck:'stamp'},[
    note('Я достаю паспорт и нахожу штамп при въезде. Дата едва читается, но цифры можно разобрать.','I take out my passport and find the entry stamp. The date is barely readable, but the digits can be made out.'),
    note('Считаю день за днём и впервые за эту неделю считаю не отпуск, а срок.','I count day by day and, for the first time this week, I am counting not a holiday but a deadline.')],['Положить паспорт обратно','Put the passport back']),
   opt(['Написать Асе и спросить, как считала она','Message Asya and ask how she counted'],'friendship',{clockCheck:'asya'},[
    note('Ася отвечает голосовым сообщением, пока идёт по рынку: шум, смех, потом ясные слова.','Asya answers with a voice message while walking through the market: noise, laughter, then clear words.'),
    note('Она советует считать от даты в штампе, а не от дня, когда я почувствовал{a}, что приехал{a}: сроки не знают про эмоции.','She advises counting from the date in the stamp rather than from the day I felt I had arrived: deadlines know nothing about emotions.')],['Ответить «спасибо»','Reply “thank you”'])],
  mid:[
   note('О поездке через границу, которая обновляет срок, я слышал{a}. Это возможно, но стоит денег и нервов, а условия лучше проверять заранее. Строить на ней жизнь я не хочу.','I have heard of a trip across the border that renews the period. It is possible, but it costs money and nerves, and the conditions should be checked in advance. I do not want to build a life on it.'),
   note('В этой истории мой срок заканчивается на тридцатый день. Реальный срок у каждого свой, и я напоминаю себе проверить его по официальному источнику.','In this story my period ends on day thirty. In real life everyone’s period is different, and I remind myself to check it against an official source.'),
   note('Я отмечаю тридцатый день красным и пишу рядом одно слово: «решить».','I mark day thirty in red and write one word beside it: “decide”.')],midExit:['Закрыть календарь','Close the calendar'],
  mid2:[
   opt(['Составить обратный план от этой даты','Make a plan backwards from that date'],'practical',{clockPlan:'backwards'},[note('Я пишу даты справа налево: тридцатый день, потом то, что нужно сделать за неделю до него, за две, за три.','I write the dates from right to left: day thirty, then what has to be done a week before it, two weeks, three.'),note('План получается плотным, но выполнимым. Страшная цифра превращается в расписание.','The plan is dense but doable. The frightening figure turns into a timetable.')],['Повесить план над столом','Hang the plan above the desk']),
   opt(['Позволить себе не думать об этом сегодня','Let myself not think about it today'],'personal',{clockPlan:'rest'},[note('Я решаю дать себе вечер без календаря. О сроке я позабочусь завтра, а сегодня просто живу.','I decide to give myself an evening without the calendar. I will take care of the deadline tomorrow, and today I just live.'),note('Это не бегство: я знаю дату и знаю, что вернусь к ней. Такое спокойствие бывает честным.','It is not an escape: I know the date and I know I will come back to it. That kind of calm can be honest.')],['Закрыть календарь','Close the calendar'])],
  turn:[
   note('Вечером мы сверяем цифры у Аси за чаем. Ася считает вслух, Лука молчит и пишет что-то в блокноте.','In the evening we compare figures at Asya’s over tea. Asya counts aloud, Luka says nothing and writes in a notebook.'),
   L('Калькулятор — только начало. Я бы сверил срок ещё и со штампом в паспорте, а решение откладывал бы не дольше недели.','The calculator is only the beginning. I would check the period against the stamp in the passport as well, and put the decision off no longer than a week.','thoughtful'),
   note('Мы договариваемся, что на следующей неделе я решу, на каком основании готовить заявление.','We agree that next week I will decide on what basis to prepare the application.')],turnExit:['Допить чай','Finish the tea'],
  end:[
   note('Я возвращаюсь домой пешком и считаю не дни, а фонари. До дома их ровно двадцать три.','I walk home and count not days but streetlights. There are exactly twenty-three of them between here and home.'),
   note('Тридцатый день отмечен в календаре. Это не приговор, а дедлайн, и его можно спланировать.','Day thirty is marked in the calendar. It is not a sentence, but a deadline, and a deadline can be planned for.')]});

 // Day 6: choosing the basis. Asya and Luka; the route flag changes the framing.
 build(6,{bg:'workshop-office',time:'10:00',midTime:'13:00',turnTime:'17:00',
  start:[
   note('Главный вопрос недели: на каком основании я прошу временное проживание. От ответа зависит весь список документов.','The main question of the week: on what basis do I ask for temporary residence? The whole list of documents depends on the answer.'),
   route(T('Мой путь — своё дело. Я записываю, что понадобится для регистрации предпринимателя и как подтвердить, что дело действует.','My route is my own business. I write down what registration needs and how to show that the business really operates.'),T('Мой путь — работа по договору. Мне понадобятся работодатель и подтверждение образования, а значит, и время на признание диплома.','My route is a work contract. I will need an employer and proof of my education, which means time to have the diploma recognised.'),T('Я ещё сравниваю маршруты: работа, своё дело, недвижимость, семья, учёба. Не все мне подходят, и это нормально: я ищу то, что могу честно подтвердить.','I am still comparing routes: employment, my own business, property, family, study. Not all of them suit me, and that is fine: I am looking for what I can honestly prove.')),
   L('Основание выбирают не по красоте, а по тому, что можно подтвердить документами.','A basis is chosen not for how it looks but for what can be proved with documents.','thoughtful')],
  options:[
   opt(['Разобрать, что нужно для своего дела','Go through what my own business would need'],'practical',{basisLook:'business'},[
    note('Я открываю список: регистрация, адрес, подтверждение деятельности, налоги. Пунктов много, но все они выглядят выполнимыми, если делать по одному.','I open a list: registration, an address, proof of activity, taxes. There are many items, but all look doable one at a time.'),
    note('Главный вопрос — как показать, что дело действует, а не существует только на бумаге. Об этом я спрошу тех, кто уже прошёл этот путь.','The main question is how to show that the business really operates and does not exist only on paper. I will ask those who have already been through this.')],['Отметить вопросы','Mark the questions']),
   opt(['Разобрать, что нужно для работы по договору','Go through what a work contract would need'],'practical',{basisLook:'work'},[
    note('Работа по договору начинается с работодателя, но не заканчивается им: нужны подтверждение образования и согласованные условия.','Work under a contract starts with an employer but does not end with one: proof of education and agreed terms are needed.'),
    note('Диплом придётся признавать, а это время. Я записываю его первой строкой и ставлю рядом вопросительный знак.','The diploma will have to be recognised, and that takes time. I write it as the first line and put a question mark beside it.')],['Отметить вопросы','Mark the questions']),
   opt(['Сравнить всё в одной таблице','Compare everything in one table'],'explore',{basisLook:'table'},[
    note('Я чертю таблицу: основания по строкам, документы, сроки и риски по столбцам. Половина клеток остаётся пустой.','I draw a table: bases in rows, documents, timing and risks in columns. Half the cells stay empty.'),
    note('Пустые клетки — это вопросы. Зато теперь видно, какие из них общие для всех путей.','The empty cells are questions. But now I can see which ones are common to every route.')],['Сфотографировать таблицу','Photograph the table'])],
  mid:[
   note('Я показываю то, что получилось, Асе. Она смотрит на список так, будто видит в нём свои прежние тревоги.','I show what I have so far to Asya. She looks at the list as though she can see her own old worries in it.'),
   note('Мы вместе вычёркиваем лишнее: пути, которые подходят только знакомым, а мне — нет. Список становится короче и спокойнее.','Together we cross out what is superfluous: routes that suit only acquaintances and not me. The list becomes shorter and calmer.'),
   note('Выбор основания не связывает меня навсегда, но от него зависит ближайший месяц. Я записываю дату, к которой решу.','Choosing a basis does not bind me for ever, but the next month depends on it. I write down the date by which I will decide.')],midExit:['Назвать срок решения','Name a date for the decision'],
  mid2:[
   opt(['Выбрать основной путь сегодня','Choose a main route today'],'practical',{basisPick:'main'},[note('Я вписываю в блокнот над таблицей два слова: «основной путь». Остальные остаются запасными.','Above the table in my notebook I write two words: “main route”. The others stay as spares.'),note('Решение не окончательное, но у него есть название. С ним проще идти.','The decision is not final, but it has a name. It is easier to walk with one.')],['Подчеркнуть слова','Underline the words']),
   opt(['Оставить выбор до разговора с Лукой','Leave the choice until I talk to Luka'],'explore',{basisPick:'wait'},[note('Я решаю не гнаться за ответом: пусть Лука покажет, как это выглядит в цифрах.','I decide not to chase an answer: let Luka show me what it looks like in figures.'),note('Пауза — не слабость, а способ не ошибиться. Я записываю дату разговора.','A pause is not weakness but a way of not making a mistake. I write down the date of the talk.')],['Поставить дату в календарь','Put the date in the calendar'])],
  turn:[
   note('Перед уходом Ася замечает, что я больше слушаю, чем говорю. Я признаюсь: слишком много людей советуют разное.','Before I leave Asya notices that I listen more than I speak. I admit that too many people advise different things.'),
   A('И не выбирай то, что выбрали все знакомые. У каждого свой набор бумаг.','And do not choose what all your acquaintances chose. Everyone has their own set of papers.','laughing'),
   note('Это снимает напряжение. Я решаю смотреть только на то, что подтверждается документами.','This lifts the tension. I decide to look only at what is supported by documents.')],turnExit:['Попрощаться и выйти','Say goodbye and leave'],
  end:[
   note('Вечером в блокноте — один выбранный путь и два запасных. Они не соревнуются: просто лежат рядом.','In the evening my notebook holds one chosen route and two spare ones. They do not compete; they just lie side by side.'),
   note('Основание — не мечта, а рабочая рамка. С ней список дел наконец перестаёт быть тревожным.','A basis is not a dream but a working frame. With it, the to-do list at last stops being anxious.')]});

 // Day 7: a form for the business, an employer, or a comparison. Airport pair.
 build(7,{bg:'document-desk',time:'09:30',midTime:'12:30',turnTime:'16:30',
  start:[
   note('Сегодня я перехожу от «что я хочу» к «как это оформить».','Today I move from “what I want” to “how it gets arranged”.'),
   route(T('Для малого дела есть несколько форм: паушальный режим, режим с книгой учёта и общество с ограниченной ответственностью. От выбора зависят налоги и объём бумаг.','There are several forms for a small business: the flat-rate regime, the bookkeeping regime and a limited company. The choice affects taxes and the amount of paperwork.'),T('Для работы по договору мне нужен работодатель, который готов подтвердить условия и подготовить документы. Это человек, а не только компания.','For work under a contract I need an employer ready to confirm the terms and prepare documents. That is a person, not only a company.'),T('Пока я не выбрал{a} путь окончательно, мне нужно сравнить затраты, сроки и бумаги. Для этого нужна честная таблица.','While I have not chosen finally, I need to compare costs, timing and papers. That calls for an honest table.')),
   contact(['Я бы начал с одной формы и одного вопроса. Остальное станет понятно, когда пойдёт первый доход.','I would start with one form and one question. The rest will become clear once the first income arrives.'],['Я бы начала с одной формы и одного вопроса. Остальное станет понятно, когда пойдёт первый доход.','I would start with one form and one question. The rest will become clear once the first income arrives.'])],
  options:[
   opt(['Выбрать самый простой вариант и проверить его','Take the simplest option and check it'],'practical',{formStyle:'simple'},[
    note('Я начинаю с простейшего варианта: что требуется, сколько платить и что можно не вести отдельно. Записываю три цифры и два вопроса.','I begin with the simplest option: what is required, what to pay and what need not be kept separately. I write down three figures and two questions.'),
    note('Простота подкупает, но я напоминаю себе: простой не значит единственный. Позже я сверю выбор с теми, кто считает налоги.','Simplicity is appealing, but I remind myself that simple does not mean the only one. Later I will check the choice with someone who does taxes.')],['Отложить блокнот','Put the notebook aside']),
   opt(['Сравнить два варианта по расходам','Compare two options by cost'],'explore',{formStyle:'compare'},[
    note('Я ставлю рядом два варианта и считаю, сколько уйдёт на бумаги, налоги и время в первый месяц.','I set two options side by side and count what the first month would cost in papers, taxes and time.'),
    note('Разница оказывается меньше, чем я думал{a}, зато видны разные риски. Я выписываю их на отдельный лист.','The difference is smaller than I expected, but the risks are different. I list them on a separate sheet.')],['Отложить блокнот','Put the notebook aside']),
   opt(['Начать с вопросов тем, кто уже прошёл','Start by asking people who have been through it'],'friendship',{formStyle:'ask'},[
    note('Я пишу трём знакомым: что они выбирали, о чём жалеют и что хотели бы знать заранее.','I write to three acquaintances: what they chose, what they regret and what they wish they had known in advance.'),
    note('Ответы приходят быстро и противоречат друг другу. Это тоже полезно: я вижу, где спорят все, а где согласны.','The answers come quickly and contradict each other. That is useful too: I see where everyone disagrees and where they all agree.')],['Отложить телефон','Put the phone down'])],
  mid:[
   note('В полдень я перечитываю свои записи и убираю лишнее. Остаётся короткий список: что я выбираю, что проверяю и у кого.','At noon I reread my notes and remove what is superfluous. A short list remains: what I choose, what I check and with whom.'),
   note('Официальные источники скучны, но надёжны. Я читаю условия слово за словом и отмечаю места, где мне нужна консультация.','Official sources are dull but reliable. I read the conditions word by word and mark the places where I need advice.'),
   note('Выбор ещё не окончательный, но у него есть форма. Это уже лучше, чем «как-нибудь».','The choice is not final, but it has a shape. That is already better than “somehow”.')],midExit:['Сохранить выводы','Save my conclusions'],
  mid2:[
   opt(['Выбрать форму сегодня','Choose a form today'],'practical',{formPick:'today'},[note('Я выбираю один вариант и записываю причины: почему он подходит мне и чего я о нём пока не знаю.','I choose one option and write down my reasons: why it suits me and what I do not yet know about it.'),note('Причины выглядят убедительнее, когда записаны. Я оставляю место под возражения и сразу пишу первое.','Reasons look more convincing once written. I leave space for objections and write the first one at once.')],['Закрыть блокнот','Close the notebook']),
   opt(['Записать вопросы и отложить выбор','Write down the questions and postpone the choice'],'explore',{formPick:'later'},[note('Я записываю все вопросы, которые остались, и не заставляю себя отвечать на них сегодня.','I write down all the questions that remain and do not force myself to answer them today.'),note('Вопросов получается шесть. Это не провал, а честная карта того, чего я ещё не знаю.','There turn out to be six questions. That is not a failure but an honest map of what I do not yet know.')],['Убрать блокнот','Put the notebook away'])],
  turn:[
   note('К вечеру я встречаюсь с теми, кто помогал мне эти дни, и показываю выводы.','In the evening I meet those who have helped me these days and show them my conclusions.'),
   counter(['Записывай вопросы в блокнот: потом их проще сверять с официальными источниками.','Write your questions in a notebook: it is easier to check them against official sources later.'],['Записывай вопросы в блокнот: потом их проще сверять с официальными источниками.','Write your questions in a notebook: it is easier to check them against official sources later.']),
   note('Я улыбаюсь: блокнот у меня уже есть, и в нём пять вопросов.','I smile: I already have a notebook, and there are five questions in it.')],turnExit:['Пойти домой','Go home'],
  end:[
   note('К вечеру в блокноте один ясный следующий шаг, а не три размытых.','By evening my notebook holds one clear next step instead of three blurred ones.'),
   note('Я не знаю всего, но знаю, что искать завтра. Для начала это хороший план.','I do not know everything, but I know what to look for tomorrow. That is a good plan to begin with.')]});

 // Day 8: the accountant. Luka leads, Asya joins.
 build(8,{bg:'workshop-office',time:'11:00',midTime:'12:30',turnTime:'14:30',extra:{character:'luka'},
  start:[
   note('С Лукой мы встречаемся в его кабинете. Он не торопит и сразу говорит, что бухгалтер нужен не всем.','I meet Luka in his office. He does not hurry me, and he says at once that not everyone needs an accountant.'),
   L('При паушальном режиме налог считают проще, и бухгалтер нужен не всегда. Но договариваться о правилах лучше до первого дохода, а не после.','Under the flat-rate regime the tax is simpler to calculate, and an accountant is not always needed. But it is better to agree on the rules before the first income, not after.','thoughtful'),
   note('Я достаю блокнот. Лука кивает: он любит людей, которые приходят с вопросами, а не с готовыми ответами.','I take out my notebook. Luka nods: he likes people who come with questions and not with ready answers.')],
  options:[
   opt(['Спросить, как считают налог','Ask how the tax is calculated'],'practical',{taxAsk:'tax'},[
    note('Лука рисует простую схему: доход, ставка, срок оплаты. Вся магия — в том, чтобы не пропустить дату.','Luka draws a simple scheme: income, rate, payment date. All the magic lies in not missing the date.'),
    note('Он не называет суммы: ставки меняются, и он просит меня смотреть актуальные данные на официальном сайте.','He names no sums: rates change, and he asks me to look at current figures on the official site.')],['Записать схему','Copy the scheme']),
   opt(['Спросить, когда нужен бухгалтер','Ask when an accountant is needed'],'practical',{taxAsk:'accountant'},[
    note('«Когда растёт число документов или клиентов, — говорит Лука, — или когда ты не уверен{a}, что делаешь всё правильно».','“When the number of documents or clients grows,” says Luka, “or when you are not sure you are doing everything correctly.”'),
    note('Он не рекламирует себя: даже предлагает попробовать самому, а ко мне прийти за проверкой. Мне нравится такая честность.','He does not advertise himself: he even suggests trying on my own and coming to him for a check. I like this honesty.')],['Записать критерии','Write down the criteria']),
   opt(['Спросить, чего начинающие боятся зря','Ask what beginners fear for no reason'],'personal',{taxAsk:'fears'},[
    note('Лука усмехается: «Что налоги — это тайна. Это просто календарь и несколько цифр».','Luka smiles: “That taxes are a mystery. They are just a calendar and a few numbers.”'),
    note('Он перечисляет настоящие риски: пропущенные сроки, потерянные чеки, смешанные деньги. Всё это лечится привычкой.','He lists the real risks: missed deadlines, lost receipts, mixed money. All of it is cured by habit.')],['Записать привычки','Write down the habits'])],
  mid:[
   note('Лука показывает, как вести учёт простыми таблицами: дата, сумма, пояснение. Никаких сложных программ, пока дело маленькое.','Luka shows how to keep records in simple tables: date, amount, explanation. No complicated software while the business is small.'),
   note('Я записываю три правила: все деньги — через отдельный счёт, все чеки — в одну папку, все сроки — в один календарь.','I write down three rules: all money through one account, all receipts in one folder, all deadlines in one calendar.'),
   note('Правила кажутся скучными, но от них становится спокойнее. Я впервые чувствую, что налоги — это не угроза.','The rules seem dull, but they make me calmer. For the first time I feel that taxes are not a threat.')],midExit:['Поблагодарить Луку','Thank Luka'],
  mid2:[
   opt(['Показать Луке черновой бюджет','Show Luka a draft budget'],'practical',{budgetCheck:'draft'},[note('Я показываю таблицу с предполагаемыми доходами и расходами. Лука находит две строки, которых я не учитывал{a}, и одну, которую можно убрать.','I show a table of expected income and spending. Luka finds two lines I had not counted and one that can be removed.'),note('Он не правит текст, а задаёт вопросы. После них таблица выглядит честнее.','He does not correct the text but asks questions. After them the table looks more honest.')],['Сохранить таблицу','Save the table']),
   opt(['Спросить, как он начинал сам','Ask how he started himself'],'personal',{budgetCheck:'story'},[note('Лука усмехается: первую декларацию он заполнял всю ночь и всё равно ошибся в дате.','Luka smiles: he filled in his first return all night and still got the date wrong.'),note('Мне становится легче: ошибки здесь исправляют, а не наказывают.','I feel better: mistakes here are corrected, not punished.')],['Записать его совет','Note his advice'])],
  turn:[
   note('В дверь заглядывает Ася с пакетом печенья: она заходила мимо и решила, что мы забыли поесть.','Asya looks in at the door with a bag of biscuits: she was passing and decided we had forgotten to eat.'),
   A('Я приношу на такие встречи печенье. Цифры лучше идут с чаем.','I bring biscuits to meetings like this. Numbers go down better with tea.','laughing'),
   note('Лука делает вид, что возмущён, но берёт два. Разговор становится теплее и перестаёт быть лекцией.','Luka pretends to be offended but takes two. The conversation becomes warmer and stops being a lecture.')],turnExit:['Допить чай и попрощаться','Finish the tea and say goodbye'],
  end:[
   note('Я записываю три вопроса к официальным источникам: ставки, сроки и подтверждение деятельности.','I write down three questions for the official sources: rates, deadlines and proof of activity.'),
   note('Простота налога — не повод не читать правила.','A simple tax is no reason not to read the rules.')]});

 // Day 9: an address for the application. Hosts pair.
 build(9,{bg:'document-desk',time:'09:30',midTime:'12:00',turnTime:'15:30',extra:{districtBg:true},
  start:[
   note('Для дела и для заявления нужен адрес, который можно подтвердить. Это не формальность: от него зависят письма, регистрация и многие проверки.','For the business and the application I need an address that can be confirmed. It is not a formality: letters, registration and many checks depend on it.'),
   note('Я проверяю, можно ли использовать адрес нашей квартиры: что говорит договор и согласен ли владелец.','I check whether the address of our flat can be used: what the lease says and whether the owner agrees.'),
   owner(['Адрес квартиры можно использовать, если договор это допускает. Давай перечитаем его вместе.','The flat’s address can be used if the lease allows it. Let us reread it together.'],['Адрес квартиры можно использовать, если договор это допускает. Давай перечитаем его вместе.','The flat’s address can be used if the lease allows it. Let us reread it together.'])],
  options:[
   opt(['Перечитать договор вместе с владельцем','Reread the lease together with the owner'],'practical',{addressPlan:'lease'},[
    note('Мы садимся за стол и читаем договор вслух. Один пункт про использование жилья оказывается расплывчатым.','We sit at the table and read the lease aloud. One clause about the use of the housing turns out to be vague.'),
    note('Владелец предлагает написать короткое дополнение. Я прошу прислать текст заранее — я прочитаю его вечером без спешки.','The owner offers to write a short addendum. I ask for the text in advance so I can read it in the evening without hurry.')],['Записать пункт','Note the clause']),
   opt(['Посмотреть коворкинг с юридическим адресом','Look at a coworking space with a legal address'],'explore',{addressPlan:'cowork'},[
    note('В коворкинге пахнет кофе и принтерами. Администратор объясняет, что юридический адрес — отдельная услуга, и показывает договор.','The coworking space smells of coffee and printers. The administrator explains that a legal address is a separate service and shows the contract.'),
    note('Я читаю условия: срок, цена, что считается подтверждением. Фотографирую всё и благодарю за прямые ответы.','I read the terms: duration, price, what counts as confirmation. I photograph everything and thank them for the direct answers.')],['Выйти на улицу','Step outside']),
   opt(['Сначала проверить, что нужно по правилам','First check what the rules require'],'practical',{addressPlan:'rules'},[
    note('Я открываю официальные страницы и ищу, какие подтверждения адреса принимают. Формулировки сухие, но однозначные.','I open the official pages and look for which address confirmations are accepted. The wording is dry but unambiguous.'),
    note('Записываю два варианта и одно ограничение. Теперь я знаю, о чём спрашивать владельца и коворкинг.','I write down two options and one restriction. Now I know what to ask the owner and the coworking space.')],['Сохранить ссылки','Save the links'])],
  mid:[
   note('К полудню у меня два рабочих варианта и список вопросов, которые нужно задать каждому.','By noon I have two working options and a list of questions to ask each.'),
   note('Я смотрю на цифры: аренда адреса, время на дорогу, удобство получения писем. Идеального варианта нет, есть честный компромисс.','I look at the figures: the cost of an address, travel time, convenience of receiving letters. There is no ideal option, only an honest compromise.'),
   note('Я решаю не торопиться: сначала пусть владелец напишет дополнение, и только потом я сравню его с коворкингом.','I decide not to rush: let the owner write the addendum first, and only then will I compare it with the coworking space.')],midExit:['Убрать бумаги','Put the papers away'],
  mid2:[
   opt(['Выбрать вариант с договором','Choose the lease option'],'practical',{addressPick:'lease'},[note('Я решаю сначала дождаться дополнения к договору: это самый простой вариант, и он ничего не стоит.','I decide first to wait for the addendum to the lease: it is the simplest option and costs nothing.'),note('Напоминание «проверить текст дополнения» встаёт в календарь на завтра. Остальное подождёт.','A reminder to “check the text of the addendum” goes into the calendar for tomorrow. The rest can wait.')],['Закрыть календарь','Close the calendar']),
   opt(['Сравнить с коворкингом ещё раз','Compare with the coworking space once more'],'explore',{addressPick:'cowork'},[note('Я открываю таблицу и добавляю столбец: сколько времени займёт дорога, как забирать письма, что считается подтверждением.','I open the table and add a column: how long the journey takes, how letters are collected, what counts as confirmation.'),note('Результат остаётся неоднозначным, но теперь у меня есть аргументы за и против, а не только ощущения.','The result stays ambiguous, but now I have arguments for and against, not just feelings.')],['Сохранить таблицу','Save the table'])],
  turn:[
   note('После обеда на кухне собираются оба хозяина дома: оказывается, они уже обсуждали мой вопрос.','After lunch both hosts gather in the kitchen: it turns out they have already been discussing my question.'),
   neighbour(['Если нужен запасной вариант, поспрашивай про коворкинги: многие знакомые так и делали.','If you need a fallback, ask about coworking spaces: many people I know did it that way.'],['Если нужен запасной вариант, поспрашивай про коворкинги: многие знакомые так и делали.','If you need a fallback, ask about coworking spaces: many people I know did it that way.']),
   note('Мне становится легче: вариантов уже два, и с этим делом я не остаюсь в одиночку.','I feel better: there are already two options, and I am not left to deal with this alone.')],turnExit:['Поблагодарить хозяев','Thank the hosts'],
  end:[
   note('У меня два варианта и один вопрос владельцу. Остальное подождёт до завтра.','I have two options and one question for the owner. The rest can wait until tomorrow.'),
   note('Адрес — не точка на карте, а подтверждённая договорённость. Эта мысль неожиданно успокаивает.','An address is not a point on a map but a confirmed agreement. This thought is unexpectedly calming.')]});

 // Day 10: documents from home. Airport pair.
 build(10,{bg:'document-desk',time:'10:00',midTime:'12:30',turnTime:'16:00',
  start:[
   note('Часть бумаг можно получить только дома: справки, нотариальные документы, апостиль.','Some papers can only be obtained at home: certificates, notarised documents, an apostille.'),
   note('Я составляю список: какие документы нужны, какие требуют апостиля и какие должен переводить судебный переводчик. Заказывать нужно то, что идёт дольше всего.','I make a list: which documents are needed, which need an apostille and which must be translated by a court translator. I must order whatever takes the longest.'),
   contact(['Справку из дома лучше заказывать заранее: письма идут дольше, чем кажется.','Order the certificate from home in advance: letters take longer than they seem to.'],['Справку из дома лучше заказывать заранее: письма идут дольше, чем кажется.','Order the certificate from home in advance: letters take longer than they seem to.'])],
  options:[
   opt(['Написать домой и попросить заказать справки','Write home and ask for the certificates to be ordered'],'friendship',{homeDocs:'family'},[
    note('Я звоню домой и объясняю, что нужно: названия документов, сроки, куда их отправить. Родные записывают всё на бумажке.','I call home and explain what is needed: the names of documents, deadlines, where to send them. My family writes it all down on a scrap of paper.'),
    note('Просьба оказывается проще, чем я думал{a}. Мне говорят: «Мы давно ждали, когда ты попросишь».','The request turns out to be simpler than I thought. They tell me: “We have been waiting for you to ask.”')],['Положить трубку и перевести дух','Hang up and catch my breath']),
   opt(['Заказать то, что можно оформить удалённо','Order what can be arranged remotely'],'practical',{homeDocs:'remote'},[
    note('Я открываю сайты ведомств и ищу, что можно заказать онлайн. Некоторые процедуры оказываются удивительно удобными.','I open the agencies’ websites and look for what can be ordered online. Some procedures turn out to be surprisingly convenient.'),
    note('Я записываю номера заявок и ожидаемые сроки. Если срок не указан, пишу «спросить» и ставлю дату напоминания.','I write down the application numbers and expected waiting times. If no time is stated, I write “ask” and set a reminder date.')],['Закрыть вкладки','Close the tabs']),
   opt(['Найти судебного переводчика','Find a court translator'],'explore',{homeDocs:'translator'},[
    note('Я ищу в официальном списке судебных переводчиков, а не по объявлениям. Таких людей немного, и все они заняты.','I search the official list of court translators and not adverts. There are not many such people, and all are busy.'),
    note('Одна переводчица отвечает быстро и честно: назвала срок и спросила, нужен ли мне апостиль. Я записываю её имя в блокнот.','One translator replies quickly and honestly: she gives a deadline and asks whether I need an apostille. I note her name in my notebook.')],['Отправить документы на оценку','Send the documents for an estimate'])],
  mid:[
   note('К полудню я знаю, что заказано, что в пути и что ещё нужно придумать. Список перестаёт быть пугающим.','By noon I know what has been ordered, what is on its way and what still has to be arranged. The list stops being frightening.'),
   note('Я понимаю, что не обязан{a} получать всё сразу: достаточно знать порядок и сроки. Бумага может ехать долго, а я могу заниматься другим.','I understand that I do not have to get everything at once: it is enough to know the order and the timing. A paper may travel for a long time while I get on with other things.'),
   note('Я ставлю в календарь напоминания: «спросить про справку» и «проверить перевод». Теперь они напомнят о себе сами.','I put reminders in the calendar: “ask about the certificate” and “check the translation”. Now they will remind me themselves.')],midExit:['Закрыть календарь','Close the calendar'],
  mid2:[
   opt(['Записать подробную инструкцию для семьи','Write detailed instructions for my family'],'friendship',{homeDocs2:'family'},[note('Я пишу инструкцию простыми словами: что получить, куда обратиться, что принести, какой срок. Перечитываю её так, как прочитают они.','I write the instructions in plain words: what to get, where to go, what to bring, how long it takes. I reread them as they would.'),note('Я прикладываю фотографии образцов и отправляю письмо. Мне кажется, что я не просто прошу помощи, а даю людям задание, с которым они справятся.','I attach photographs of samples and send the email. It feels like I am not just asking for help but giving people a task they can manage.')],['Отправить письмо','Send the email']),
   opt(['Проверить сроки по официальным страницам','Check the deadlines on the official pages'],'practical',{homeDocs2:'official'},[note('Я открываю страницы ведомств и сверяю то, что мне рассказали, с тем, что написано. В двух местах цифры расходятся.','I open the agencies’ pages and compare what I was told with what is written. In two places the figures differ.'),note('Я записываю расхождения и ставлю пометку «уточнить». Лучше выяснить сейчас, чем узнать об ошибке у окошка.','I note the discrepancies and mark them “clarify”. It is better to find out now than to learn of a mistake at a counter.')],['Закрыть вкладки','Close the tabs'])],
  turn:[
   note('Вечером мы встречаемся в кафе у остановки. На столе бумаги, чай и общая усталость от бюрократии.','In the evening we meet in a café by the stop. On the table: papers, tea and a shared weariness with bureaucracy.'),
   counter(['Переводчика ищи по списку судебных переводчиков, а не по объявлению.','Look for a translator in the list of court translators, not in an advert.'],['Переводчика ищи по списку судебных переводчиков, а не по объявлению.','Look for a translator in the list of court translators, not in an advert.']),
   note('Я киваю: это уже сделано. Мы улыбаемся друг другу — приятно, когда совет совпадает с тем, что ты успел{a} сам{a}.','I nod: that is already done. We smile at each other: it is pleasant when advice matches what you have already done yourself.')],turnExit:['Заказать ещё чаю','Order more tea'],
  end:[
   note('Список лежит в телефоне, копии — в папке, а напоминания — в календаре. Пока всё идёт по плану.','The list is in my phone, the copies are in the folder and the reminders are in the calendar. So far everything goes according to plan.'),
   note('Бюрократия неожиданно приятна, когда она — таблица со столбцом «срок».','Bureaucracy is oddly pleasant when it is a table with a “deadline” column.')]});

 // Day 11: preparing the basis. Asya and Luka.
 build(11,{bg:'document-desk',time:'09:30',midTime:'12:00',turnTime:'16:30',
  start:[
   note('Подготовка — самый невидимый и самый нужный день.','Preparation is the most invisible and most necessary day.'),
   route(T('Я собираю данные для регистрации предпринимателя: адрес, вид деятельности, паспорт, подтверждения. Сама регистрация — отдельный шаг, сегодня только подготовка.','I gather the details for registering as an entrepreneur: address, line of business, passport, supporting papers. The registration itself is a separate step; today is only preparation.'),T('Я прошу у работодателя проект договора и проверяю, чего не хватает: диплом требует признания, документы — перевода.','I ask the employer for a draft contract and check what is missing: the diploma needs recognition, the papers need translation.'),T('Я выбираю основание для второго шага и записываю условия. Это не отказ от других путей, а способ сравнить цены, сроки и риски.','I pick a basis for the second step and write down its conditions. It is not giving up the other routes but a way to compare costs, timing and risks.')),
   A('Я разложила бумаги по цветам. Это необязательно, но помогает не паниковать.','I sorted my papers by colour. It is not necessary, but it helps me not to panic.','laughing')],
  options:[
   opt(['Разложить документы по папкам','Sort the documents into folders'],'practical',{prepStyle:'folders'},[
    note('Я раскладываю бумаги: паспорт и подтверждения — в одну папку, документы по основанию — в другую, всё с переводами — в третью.','I sort the papers: passport and confirmations in one folder, documents for the basis in another, everything with translations in a third.'),
    note('Папки получаются тонкими, но порядок в них уже есть. Я ставлю цветные метки и снимаю общий вид на телефон.','The folders come out thin, but they already have order. I add coloured labels and photograph the whole set.')],['Закрыть папки','Close the folders']),
   opt(['Составить чек-лист и вычеркнуть сделанное','Make a checklist and cross off what is done'],'practical',{prepStyle:'checklist'},[
    note('Я пишу чек-лист по пунктам и вычёркиваю то, что уже сделано. Список оказывается короче, чем я ожидал{a}.','I write a checklist item by item and cross off what is already done. The list turns out to be shorter than I expected.'),
    note('Оставшиеся пункты я разбиваю по дням. Теперь каждое утро у меня будет одна небольшая задача, а не гора.','I split the remaining items by day. Now every morning I will have one small task, not a mountain.')],['Повесить список на видное место','Hang the list where I can see it']),
   opt(['Попросить Асю и Луку проверить мои бумаги','Ask Asya and Luka to check my papers'],'friendship',{prepStyle:'review'},[
    note('Я отправляю им фотографию папок и список. Через час приходят ответы: сначала ироничные, потом по делу.','I send them a photograph of the folders and the list. An hour later the replies arrive: first ironic, then to the point.'),
    note('Они находят две неточности и одну лишнюю бумагу. Я благодарю их и исправляю ошибки, пока не забыл{a}.','They find two inaccuracies and one superfluous paper. I thank them and fix the mistakes before I forget.')],['Отправить исправленные листы','Send the corrected sheets'])],
  mid:[
   note('К полудню папка становится толще. Я смотрю на неё и понимаю, что последние дни были не про бумаги, а про подготовку к жизни здесь.','By noon the folder has grown thicker. I look at it and realise that these last days were not about papers but about preparing to live here.'),
   note('Теперь всё чаще попадаются слова «после подачи» и «в ожидании». Раньше они казались далёкими, а сейчас — просто следующий этап.','Words like “after filing” and “while waiting” come up more and more. They used to seem far away; now they are just the next stage.'),
   note('Я делаю перерыв и выхожу на улицу. В очереди у киоска кто-то говорит со мной по-сербски — и я его понимаю.','I take a break and go out. In the queue at a kiosk someone speaks to me in Serbian, and I understand.')],midExit:['Вернуться к бумагам','Go back to the papers'],
  mid2:[
   opt(['Сделать копии всего','Make copies of everything'],'practical',{prepCopies:'copies'},[note('Я сканирую каждый документ и проверяю, чтобы текст читался и края не обрезались. Это скучно, но сканер гудит убаюкивающе.','I scan every document and check that the text is legible and the edges are not cropped. It is dull, but the scanner hums soothingly.'),note('Файлы получают понятные названия. Через месяц я не буду гадать, что скрывается под «scan_017».','The files get clear names. In a month I will not be guessing what hides under “scan_017”.')],['Убрать оригиналы','Put the originals away']),
   opt(['Оставить остаток дня для отдыха','Leave the rest of the day for rest'],'personal',{prepCopies:'rest'},[note('Я закрываю папки и иду гулять без цели. Сегодня я сделал{a} достаточно, и это тоже решение.','I close the folders and go for a walk with no aim. Today I have done enough, and that too is a decision.'),note('Улицы вечером пахнут нагретым камнем и липой. Я замечаю, что уже не сверяюсь с картой на перекрёстках.','In the evening the streets smell of warm stone and linden. I notice that I no longer check the map at junctions.')],['Вернуться домой','Go home'])],
  turn:[
   note('Вечером мы втроём разбираем итоги: что готово, что нужно ещё и чего пока не знаем.','In the evening the three of us go over the results: what is ready, what is still needed and what we do not yet know.'),
   L('А я нумерую страницы. Скучно, зато ничего не теряется.','And I number the pages. Dull, but nothing gets lost.','laughing'),
   note('Мы смеёмся и пересчитываем листы. Их ровно столько, сколько нужно, и ни одного лишнего.','We laugh and recount the sheets. There are exactly as many as needed, and not one too many.')],turnExit:['Закрыть папку','Close the folder'],
  end:[
   note('Папка стала толще. Мне спокойнее, когда она растёт по плану.','The folder has grown thicker. I feel calmer when it grows according to plan.'),
   note('Следующие дни — банк, страховка и электронные услуги. Я больше не боюсь списка: у каждого пункта есть свой день.','The next days are the bank, insurance and electronic services. I am no longer afraid of the list: every item has its own day.')]});

 // Day 13: health insurance. Airport pair.
 build(13,{bg:'registry-lobby',time:'10:00',midTime:'12:30',turnTime:'16:30',
  start:[
   note('Для заявления мне пригодится подтверждение, что на лечение хватит средств или что у меня есть полис. Я выбираю полис, потому что хочу спокойствия.','For the application I will need proof that I can pay for treatment or that I hold a policy. I choose a policy because I want peace of mind.'),
   note('Предложений много, и у всех красивые презентации. Мне нужно понять, что скрывается за словами «покрытие» и «лимиты».','There are many offers, and all have handsome presentations. I need to understand what lies behind the words “coverage” and “limits”.'),
   contact(['Полис выбирай не по цене, а по тому, что в нём написано про лечение.','Choose a policy not by its price but by what it says about treatment.'],['Полис выбирай не по цене, а по тому, что в нём написано про лечение.','Choose a policy not by its price but by what it says about treatment.'])],
  options:[
   opt(['Сравнить несколько полисов по условиям','Compare several policies by their terms'],'practical',{insurePick:'compare'},[
    note('Я делаю таблицу: что покрывается, на какой срок, каков лимит и что исключено. Исключения читаю внимательнее всего.','I make a table: what is covered, for how long, what the limit is and what is excluded. I read the exclusions most carefully.'),
    note('Один полис выглядит дешёвым, но не покрывает то, что мне кажется важным. Я вычёркиваю его без сожаления.','One policy looks cheap but does not cover what seems important to me. I strike it out without regret.')],['Отметить два варианта','Mark two options']),
   opt(['Прочитать полис целиком, до мелкого шрифта','Read a policy in full, down to the small print'],'practical',{insurePick:'read'},[
    note('Я читаю полис от первой до последней страницы и подчёркиваю то, что не понимаю. Таких мест немного, но они важные.','I read the policy from the first page to the last and underline what I do not understand. There are few such places, but they matter.'),
    note('Я записываю вопросы и отправляю их в поддержку. Ответ приходит быстро и без шаблонных фраз — это хороший знак.','I write down my questions and send them to support. The answer comes quickly and without stock phrases, which is a good sign.')],['Сохранить письмо поддержки','Save the support email']),
   opt(['Спросить совет у знакомых','Ask acquaintances for advice'],'friendship',{insurePick:'ask'},[
    note('Я пишу знакомым и спрашиваю, чем они пользуются и приходилось ли обращаться за помощью.','I write to acquaintances and ask what they use and whether they have ever needed help.'),
    note('Один человек рассказывает о настоящем случае: звонок, врач и без лишних бумаг. Этот рассказ убеждает сильнее таблицы.','One person tells of a real case: a call, a doctor and no extra paperwork. That story convinces me more than a table.')],['Поблагодарить за рассказ','Thank them for the story'])],
  mid:[
   note('Я выбираю полис, условия которого могу объяснить своими словами. Если не могу объяснить — значит, не понимаю.','I choose a policy whose terms I can explain in my own words. If I cannot explain them, it means I do not understand them.'),
   note('Оформление занимает меньше времени, чем выбор. Я проверяю даты, свои данные и срок действия и только потом оплачиваю.','The arrangement takes less time than the choice. I check the dates, my details and the term, and only then pay.'),
   note('Договор я сохраняю в трёх местах: на телефоне, в письме и в папке. На случай, если понадобится он срочно.','I save the contract in three places: on my phone, in an email and in the folder, in case I need it urgently.')],midExit:['Отправить подтверждение себе','Send the confirmation to myself'],
  mid2:[
   opt(['Позвонить в поддержку и уточнить условия','Phone support and clarify the terms'],'practical',{insureCheck:'call'},[note('Я звоню по номеру в договоре. Оператор отвечает на двух языках и не торопит меня, пока я читаю вопрос по бумажке.','I call the number in the contract. The operator answers in two languages and does not hurry me while I read my question from a scrap of paper.'),note('Ответы совпадают с написанным. Я записываю фамилию оператора и номер обращения: на случай, если понадобится вспомнить.','The answers match what is written. I note the operator’s name and the reference number in case I need to recall them.')],['Положить телефон','Put the phone down']),
   opt(['Прочитать отзывы людей, которые обращались','Read reviews by people who made claims'],'explore',{insureCheck:'reviews'},[note('Я нахожу истории тех, кто обращался за помощью: одни довольны, другие жалуются на очереди и отказы.','I find stories by those who asked for help: some are content, others complain of queues and refusals.'),note('Я отмечаю то, что повторяется в разных рассказах, и игнорирую единичные эмоции. Картина становится спокойнее.','I note what repeats across different accounts and ignore single emotions. The picture becomes calmer.')],['Закрыть страницу','Close the page'])],
  turn:[
   note('Вечером мы встречаемся на набережной. Я рассказываю, как выбирал{a} полис, и показываю подтверждение.','In the evening we meet on the embankment. I tell how I chose the policy and show the confirmation.'),
   counter(['И сохрани телефон поддержки: он нужен как раз тогда, когда не до поисков.','And save the support number: you need it exactly when you have no time to search.'],['И сохрани телефон поддержки: он нужен как раз тогда, когда не до поисков.','And save the support number: you need it exactly when you have no time to search.']),
   note('Я уже сохранил{a} его в избранное и подписал «врач». Мы смеёмся над собственной предусмотрительностью.','I have already saved it in my favourites and labelled it “doctor”. We laugh at our own foresight.')],turnExit:['Пройтись по набережной','Walk along the embankment'],
  end:[
   note('Полис оплачен. Теперь, если станет плохо, у меня есть номер, по которому звонят.','The policy is paid. Now, if I feel ill, I have a number to call.'),
   note('Забота о себе — тоже часть плана. Ей не нужно ждать ответа по заявлению.','Caring for myself is also part of the plan. It does not need to wait for an answer to the application.')]});

 // Day 14: e-government portal. Asya and Luka.
 build(14,{bg:'document-desk',time:'09:30',midTime:'12:00',turnTime:'15:30',
  start:[
   note('Многое можно подать онлайн, но сначала нужен вход в государственный портал. Без него даже самое готовое заявление остаётся на бумаге.','A lot can be filed online, but first I need to get into the government portal. Without it even the most finished application stays on paper.'),
   note('Я открываю страницу регистрации и перечитываю инструкции: какие данные нужны, какие подтверждения и сколько времени займёт активация.','I open the registration page and reread the instructions: which details are needed, which confirmations and how long activation takes.'),
   L('Пароль от портала — в менеджере паролей, не в заметке и не в чате.','Keep the portal password in a password manager, not in a note or a chat.','thoughtful')],
  options:[
   opt(['Зарегистрироваться на портале','Register on the portal'],'practical',{portalStep:'register'},[
    note('Я вбиваю данные точно как в паспорте, проверяю каждую букву и дату. Система требует подтверждение по почте и телефону.','I enter my details exactly as in my passport, checking every letter and date. The system asks for confirmation by email and phone.'),
    note('Активация приходит через несколько минут. Экран выглядит скучно, но надпись «профиль создан» радует.','Activation arrives within a few minutes. The screen looks dull, but the words “profile created” cheer me up.')],['Сохранить данные входа','Save the sign-in details']),
   opt(['Сначала настроить безопасность','Set up security first'],'practical',{portalStep:'security'},[
    note('Я включаю двухэтапный вход и записываю резервные коды. Их нельзя хранить рядом с паролем — я прячу их отдельно.','I switch on two-step sign-in and write down the backup codes. They must not be kept next to the password, so I hide them separately.'),
    note('Это занимает полчаса и выглядит лишним, пока не вспоминаешь истории о потерянных аккаунтах.','It takes half an hour and looks excessive until you remember stories of lost accounts.')],['Проверить вход ещё раз','Test the sign-in again']),
   opt(['Прочитать, какие услуги доступны онлайн','Read which services are available online'],'explore',{portalStep:'read'},[
    note('Я листаю каталог услуг. Часть из них доступна без визита в офис: подача заявлений, проверка статуса, оплата сборов.','I scroll through the catalogue of services. Some are available without visiting an office: filing applications, checking status, paying fees.'),
    note('Я отмечаю услуги, которые пригодятся: список получается неожиданно коротким. Остальное — для будущей жизни здесь.','I mark the services that will be useful: the list is surprisingly short. The rest is for a future life here.')],['Сохранить закладки','Save bookmarks'])],
  mid:[
   note('Я проверяю, что данные профиля совпадают с паспортом: имя, дата рождения, номер документа. Любая опечатка потом вернётся проблемой.','I check that the profile details match my passport: name, date of birth, document number. Any typo would come back later as a problem.'),
   note('Пароли храню не в заметке с названием «пароли». Менеджер паролей требует усилия, но экономит нервы.','I do not keep passwords in a note called “passwords”. A password manager takes effort but saves nerves.'),
   note('Теперь у меня есть вход. Он не решает ничего сам, зато открывает дверь к следующему шагу.','Now I have a way in. It does not solve anything by itself, but it opens the door to the next step.')],midExit:['Выйти из профиля','Sign out of the profile'],
  mid2:[
   opt(['Записать, какие данные нужны для подачи','Write down what details filing will need'],'practical',{portalReady:'list'},[note('Я составляю список: паспорт, адрес, подтверждения, оплата. Рядом пишу, где каждый документ лежит.','I make a list: passport, address, confirmations, payment. Beside it I note where each document is kept.'),note('Список помещается на одной странице. Я кладу его в начало папки — это моя дорожная карта на ближайшие дни.','The list fits on one page. I put it at the front of the folder: it is my road map for the coming days.')],['Закрыть папку','Close the folder']),
   opt(['Посмотреть, как выглядит процесс подачи','See how the filing process looks'],'explore',{portalReady:'tour'},[note('Я открываю страницы услуги и просто листаю шаги, ничего не заполняя. Формулировки сухие, но порядок понятный.','I open the service pages and simply scroll through the steps without filling in anything. The wording is dry, but the order is clear.'),note('Каждый шаг пугает меньше, когда знаешь, что за ним следует. Я записываю названия шагов, чтобы потом узнавать их.','Each step frightens less when you know what follows it. I note the names of the steps so that I recognise them later.')],['Выйти из просмотра','Leave the preview'])],
  turn:[
   note('Вечером мы встречаемся у Аси и вместе проверяем, что вход работает с другого устройства.','In the evening we meet at Asya’s and check together that sign-in works from another device.'),
   A('Второй способ входа настрой сразу. Иначе в самый нужный день он сломается.','Set up a second way to sign in straight away. Otherwise it will break on the day you need it most.','laughing'),
   note('Мы проверяем: всё работает. Лука делает вид, что так и планировал, и просит чаю.','We check: it all works. Luka pretends he had planned it that way and asks for tea.')],turnExit:['Закрыть ноутбук','Close the laptop'],
  end:[
   note('Вход работает. Страница выглядит скучно, но это ворота к заявлению.','Sign-in works. The page looks dull, but it is the gateway to the application.'),
   note('Следующий шаг — ответ банка. Пока я жду, у меня всё готово, и это редкое спокойное чувство.','The next step is the bank’s answer. While I wait, everything is ready, and that is a rare, calm feeling.')]});
}
