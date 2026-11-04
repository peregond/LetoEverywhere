// The last chapter gives the open question back to the player: stay, leave, or leave for now and return.
// No outcome is forced by romance, by a document or by another character.
export const CHAPTER_SEVEN_TRANSLATIONS={};
const T=(ru,en)=>(CHAPTER_SEVEN_TRANSLATIONS[ru]=en,ru);
export function extendSeventhChapter({NODES:N,JOURNAL:J,n,y,msg,scene}){
 const a=(text,emotion='friendly')=>({speaker:'Ася',character:'asya',emotion,text});
 const l=(text,emotion='friendly')=>({speaker:'Лука',character:'luka',emotion,text});
 const c=(nikola,milica,emotion='friendly')=>({speaker:'contact',text:milica,contactText:{nikola,milica},emotion});
 // Variants follow the person the player chose to spend the last evening with.
 const fin=(friends,rest)=>({speaker:'narrator',text:friends,finalText:{friends,...rest}});
 const out=label=>({kind:'tap',label,object:label});
 const s=(pages,next,extra={})=>scene(pages,next,{bg:'room-window',location:T('БЕЛГРАД · РЕШЕНИЕ','BELGRADE · THE DECISION'),time:'08:30',day:T('СЛЕДУЮЩАЯ НЕДЕЛЯ','THE FOLLOWING WEEK'),exitAction:out(T('Продолжить','Continue')),...extra});
 Object.assign(J,{
  last_week:{title:T('Неделя вопросов','A week of questions'),tag:T('ДАЛЬШЕ · РЕШЕНИЕ','NEXT · THE DECISION'),text:T('Обратный билет, договор на квартиру и заявление, на которое ещё нет ответа, оказались на одном столе. Ни одно из них не решает за меня: решение остаётся моим.','A return ticket, a lease and an application that has no answer yet ended up on one table. None of them decides for me: the decision stays mine.')},
  last_evening:{title:T('Последний свободный вечер','The last free evening'),tag:T('ЛЮДИ · ВЕЧЕР','PEOPLE · EVENING'),text:T('Перед выбором я провёл{a} вечер так, как хотелось самому: с человеком из аэропорта, с Асей, с Лукой, с общей компанией или в одиночестве. Близость осталась ровно такой, какую выбрал{a} я.','Before choosing, I spent an evening as I wanted: with the person from the airport, with Asya, with Luka, with the whole group or alone. Closeness stayed exactly as close as I chose.')},
  final_stay:{title:T('Остаюсь','Staying'),tag:T('КОНЦОВКА · СЕРБИЯ','ENDING · SERBIA'),text:T('Я решил{a} остаться и продолжить жизнь в Белграде. В этой вымышленной истории срока законного пребывания хватает до ответа по заявлению; если ответ окажется отрицательным, мне придётся уехать вовремя. Реальные сроки и условия я проверяю только по официальным источникам.','I decided to stay and keep building a life in Belgrade. In this fictional story, my lawful stay is long enough to cover the wait for an answer; if the answer is no, I will have to leave on time. Real deadlines and conditions are checked only against official sources.')},
  final_leave:{title:T('Возвращаюсь домой','Going home'),tag:T('КОНЦОВКА · ДОМ','ENDING · HOME'),text:T('Я решил{a} вернуться домой. Это не поражение и не бегство: лето в Сербии осталось со мной, а у решения есть собственные причины.','I decided to go home. This is neither a defeat nor an escape: the summer in Serbia stays with me, and the decision has its own reasons.')},
  final_return:{title:T('Уехать и вернуться','Leaving, to return'),tag:T('КОНЦОВКА · ПЛАН','ENDING · A PLAN'),text:T('Я решил{a} уехать по билету и вернуться по ясному плану. Это не обещание всем сразу: я запомнил{a}, какие шаги нужно выполнить и какие вопросы проверить заранее.','I decided to fly home on my ticket and return by a clear plan. It is not a promise to everyone at once: I noted which steps to take and which questions to check in advance.')}
 });
 Object.assign(N,{
  decision_morning:s([
   n(T('Три бумаги лежат рядом: обратный билет, договор на квартиру и подтверждение подачи заявления. Ни одна не говорит мне, что делать.','Three papers lie side by side: the return ticket, the lease and the confirmation of my application. None of them tells me what to do.')),
   n(T('Билет остаётся в силе ещё несколько дней. Хозяева ждут ответа по договору. Ответа по заявлению пока нет — и я не придумываю его за чужой стол.','The ticket stays valid for a few more days. The landlord is waiting for an answer about the lease. There is still no answer to my application, and I do not invent one on someone else’s behalf.')),
   n(T('Раньше любой выбор казался репетицией. Сегодня это просто моё утро.','Every choice used to feel like a rehearsal. Today it is simply my morning.'))
  ],'decision_home',{journal:['last_week'],exitAction:out(T('Открыть сообщения','Open my messages'))}),
  decision_home:s([
   msg(T('Мама','Mum'),T('«Мы скучаем и ждём тебя. Но мы поддержим любое решение — только не молчи».','‘We miss you and we are waiting. But we will support whatever you decide; just do not go silent.’')),
   n(T('Я читаю её дважды. В сообщении нет давления — только тепло. От этого честно отвечать труднее и легче одновременно.','I read it twice. There is no pressure in it, only warmth. That makes an honest answer both harder and easier.')),
   n(T('Решение не сводится к спору «Сербия против дома». Мне важно понять, что именно я хочу сохранить.','This is not a contest between Serbia and home. I need to understand what exactly I want to keep.'))
  ],null,{choices:[
   {label:T('Дело, которое здесь начало получаться','The work that has started to take shape here'),tone:'practical',next:'decision_weigh_work',effect:{finalWeight:'work'}},
   {label:T('Люди, у которых теперь есть моё место','The people who now have a place for me'),tone:'friendship',next:'decision_weigh_people',effect:{finalWeight:'people'}},
   {label:T('Дом, привычная жизнь и близкие там','Home, my familiar life and loved ones there'),tone:'personal',next:'decision_weigh_home',effect:{finalWeight:'home'}}
  ]}),
  decision_weigh_work:s([
   n(T('Я открываю заметки о проекте. Там уже не абстрактные планы, а список ближайших шагов и пара имён, которым можно написать.','I open my project notes. They are no longer abstract plans, but a list of nearby steps and a couple of names I can write to.')),
   n(T('Дело не требует, чтобы я остался любой ценой. Оно просто показывает: здесь у меня получается строить.','The work does not ask me to stay at any cost. It simply shows that here I can build something.'))
  ],'decision_plan',{bg:'document-desk',exitAction:out(T('Отложить заметки и подумать о вечере','Set the notes aside and think about the evening'))}),
  decision_weigh_people:s([
   n(T('Я пролистываю контакты. Кофе, двор, чужие шутки и общие стулья складываются в жизнь, куда меня пригласили, а не втащили.','I scroll through my contacts. Coffee, the courtyard, other people’s jokes and shared chairs add up to a life I was invited into, not dragged into.')),
   n(T('Но людям можно быть дорогими и на расстоянии. Это тоже нужно взвесить честно.','But people can be dear to us from far away too. That also has to be weighed honestly.'))
  ],'decision_plan',{exitAction:out(T('Отложить телефон и подумать о вечере','Put the phone down and think about the evening'))}),
  decision_weigh_home:s([
   n(T('Я представляю свою обычную улицу, знакомый подъезд, голоса, которые не нужно переводить. Там меня тоже ждут.','I picture my usual street, the familiar entrance and the voices I never have to translate. I am expected there too.')),
   n(T('Желание вернуться не делает лето ошибкой. Хороший вечер в Сербии не обязывает остаться, а скучать по дому — не значит сдаться.','Wanting to return does not make the summer a mistake. A good evening in Serbia does not oblige me to stay, and missing home is not giving up.'))
  ],'decision_plan',{exitAction:out(T('Отложить мысли и подумать о вечере','Set the thoughts aside and think about the evening'))}),
  decision_plan:s([
   n(T('До решения остаётся один свободный вечер. Я могу провести его с кем-то или одному — и это тоже часть выбора.','One free evening remains before I decide. I can spend it with someone or alone, and that is part of choosing too.'))
  ],null,{time:'17:30',choices:[
   {label:T('Встретиться с человеком из аэропорта','Meet the person from the airport'),tone:'romance',next:'final_airport',effect:{finalWith:'airport'}},
   {label:T('Позвать Асю прогуляться по набережной','Ask Asya for a walk along the riverside'),tone:'friendship',next:'final_asya',effect:{finalWith:'asya'}},
   {label:T('Договориться с Лукой о спокойном ужине','Arrange a quiet dinner with Luka'),tone:'friendship',next:'final_luka',effect:{finalWith:'luka'}},
   {label:T('Собрать небольшую компанию во дворе','Gather a small group in the courtyard'),tone:'friendship',next:'final_friends',effect:{finalWith:'friends'}},
   {label:T('Побыть одному и пройтись без маршрута','Be alone and walk without a route'),tone:'personal',next:'final_alone',effect:{finalWith:'alone'}}
  ]}),
  final_airport:s([
   c(T('Я рядом с пекарней и ещё не закрыл смену. Хочешь дойти до реки, когда освобожусь?','I am near the bakery and have not closed my shift yet. Would you like to walk to the river when I am free?'),T('Я как раз с блокнотом на набережной. Хочешь присоединиться? Без плана, просто посидеть рядом.','I am on the riverside with my notebook. Would you like to join me? No plan, just sitting nearby.'),'friendly'),
   n(T('Вечер на реке тихий. Мы говорим о билетах, о работе и о том, как странно, что ещё недавно мы были незнакомцами у кофейного автомата.','The evening by the river is quiet. We talk about tickets, about work, and how strange it is that we were strangers at a coffee machine not long ago.')),
   c(T('Какое бы решение ты ни принял{a}, я не хочу, чтобы оно звучало как извинение. Просто скажи, как будет честно.','Whatever you decide, I do not want it to sound like an apology. Just tell me what would be honest.'),T('Что бы ты ни решил{a}, мне не нужно объяснение-извинение. Скажи, как тебе честно, и этого хватит.','Whatever you decide, I do not need an apology. Tell me what is honest for you, and that is enough.'),'thoughtful')
  ],null,{bg:'riverside-evening',companionPortrait:true,time:'20:10',journal:['last_evening'],choices:[
   {label:T('Спросить: «Можно взять тебя за руку?»','Ask: ‘May I hold your hand?’'),tone:'romance',next:'decision_night',effect:{finalBond:'romance'}},
   {label:T('Остаться рядом как друзья и поблагодарить за лето','Stay close as friends and thank them for the summer'),tone:'friendship',next:'decision_night',effect:{finalBond:'friendship'}}
  ]}),
  final_asya:s([
   n(T('Мы идём вдоль воды. Ася держит бумажный стаканчик и размахивает им так, будто дирижирует городом.','We walk along the water. Asya holds a paper cup and waves it as though she is conducting the city.')),
   a(T('Я тоже когда-то стояла перед билетом и договором. Хороший совет только один: не решай ради тех, кто смотрит.','I once stood in front of a ticket and a lease too. There is only one good piece of advice: do not decide for those who are watching.'),'thoughtful'),
   y(T('А если мне хочется, чтобы ты тоже смотрела?','And if I want you to watch too?')),
   a(T('Тогда смотрю. Только как друг или чуть ближе — скажи прямо. Я услышу.','Then I am watching. As a friend or a little closer: tell me plainly. I will hear you.'),'flirty')
  ],null,{bg:'riverside-evening',character:'asya',time:'20:10',journal:['last_evening'],choices:[
   {label:T('«Чуть ближе. Можно я возьму тебя под руку?»','‘A little closer. May I take your arm?’'),tone:'romance',next:'decision_night',effect:{finalBond:'romance'}},
   {label:T('«Как друг. Мне это очень важно»','‘As a friend. It matters to me a great deal’'),tone:'friendship',next:'decision_night',effect:{finalBond:'friendship'}}
  ]}),
  final_luka:s([
   n(T('Лука заказывает не то, что в меню выглядит эффектно, а то, что точно получится вкусным. У него это тоже форма заботы.','Luka orders not what looks impressive on the menu, but what is certain to taste good. For him, that is also a form of care.')),
   l(T('Я посчитал все варианты. Цифры не выбирают за тебя, но я не хочу, чтобы ты выбирал{a} без них.','I counted all the options. Numbers do not choose for you, but I do not want you to choose without them.'),'thoughtful'),
   y(T('А ты что выберешь, если мы выйдем из таблицы?','And what would you choose if we stepped out of the spreadsheet?')),
   l(T('Хочу, чтобы тебе было хорошо — там или здесь. Если ближе, чем друг, я скажу. Если нет, это не помешает ужину.','I want you to be well, there or here. If I mean something closer than a friend, I will say it. If not, it will not spoil dinner.'),'flirty')
  ],null,{bg:'belgrade-morning-cafe',character:'luka',time:'20:10',journal:['last_evening'],choices:[
   {label:T('«Мне хочется, чтобы ты был ближе. Если тебе тоже»','‘I would like you to be closer, if you want that too’'),tone:'romance',next:'decision_night',effect:{finalBond:'romance'}},
   {label:T('«Спасибо. Мне с тобой спокойно, как с другом»','‘Thank you. I feel calm with you, as with a friend’'),tone:'friendship',next:'decision_night',effect:{finalBond:'friendship'}}
  ]}),
  final_friends:s([
   n(T('Во дворе стулья снова не хватает на всех, и все делают вид, что так задумано. Кто-то приносит ещё один чайник, кто-то — подушки.','In the courtyard there are again not enough chairs for everyone, and everyone pretends it was planned. Someone brings another kettle, someone brings cushions.')),
   a(T('За тебя не голосуем. Но стул вот этот — твой, что бы ты ни выбрал{a}.','We are not voting for you. But this chair is yours, whatever you choose.'),'laughing'),
   l(T('Я запишу свободное время в календарь. На случай, если придёшь снова.','I will mark free time in the calendar, in case you come again.'),'laughing'),
   n(T('От этой шутки в груди теплеет: у любого ответа здесь есть место, где его примут.','The joke warms my chest: every answer has a place here where it will be received.'))
  ],'decision_night',{bg:'courtyard-after-film',character:'asya',time:'20:10',journal:['last_evening'],effectOnEnter:{finalBond:'friendship'},exitAction:out(T('Остаться до конца разговора','Stay until the conversation ends'))}),
  final_alone:s([
   n(T('Я иду без цели и без карты. Фонари, чужие окна, запах хлеба из закрывающейся пекарни: Белград перестаёт быть списком дел.','I walk with no goal and no map. Streetlights, strangers’ windows, the smell of bread from a closing bakery: Belgrade stops being a to-do list.')),
   n(T('В одиночестве нет ничего грустного, если выбираешь его сам{a}. Мне нужно услышать, чего я хочу, когда никто не слушает.','There is nothing sad about solitude if you choose it yourself. I need to hear what I want when nobody is listening.')),
   n(T('Выходит неожиданно просто: я знаю, какое решение не хочется откладывать.','It turns out surprisingly simple: I know which decision I no longer want to postpone.'))
  ],'decision_night',{bg:'belgrade-night-walk',time:'20:10',journal:['last_evening'],effectOnEnter:{finalBond:'personal'},exitAction:out(T('Вернуться домой с ясной головой','Go home with a clear head'))}),
  decision_night:s([
   n(T('Дома тихо. Билет, договор и подтверждение подачи лежат на столе рядом. Я больше не раскладываю их по важности.','The house is quiet. The ticket, the lease and the submission confirmation lie side by side. I no longer sort them by importance.')),
   n(T('Любой ответ можно прожить. И ни один не отменяет остальные навсегда.','Any answer can be lived. And none of them cancels the others for ever.'))
  ],null,{time:'23:00',lighting:'night',choices:[
   {label:T('Остаться в Белграде и продлить договор','Stay in Belgrade and renew the lease'),tone:'practical',next:'stay_one',effect:{finalChoice:'stay'}},
   {label:T('Вернуться домой по билету','Go home on my ticket'),tone:'personal',next:'leave_one',effect:{finalChoice:'leave'}},
   {label:T('Уехать сейчас и вернуться по плану','Leave now and return by a plan'),tone:'explore',next:'return_one',effect:{finalChoice:'return'}}
  ]}),
  stay_one:s([
   n(T('Утром я пишу хозяевам: «Продлеваю договор». Удивительно, но пальцы не дрожат.','In the morning I write to my hosts: “I am renewing the lease.” Surprisingly, my fingers do not shake.')),
   n(T('Я проверяю срок законного пребывания по официальному источнику. В этой вымышленной истории его хватает до ответа. Если ответ окажется отрицательным, я уеду вовремя.','I check my lawful stay period against the official source. In this fictional story it is enough to cover the wait for an answer. If the answer is no, I will leave on time.')),
   n(T('Я отменяю билет и сразу пишу домой: «Остаюсь. Расскажу всё по звонку». Ответ приходит быстро: «Мы рядом».','I cancel the ticket and immediately write home: “I am staying. I will tell you everything on a call.” The reply comes fast: “We are close.”'))
  ],'stay_two',{time:'09:00',exitAction:out(T('Выйти из дома','Step outside'))}),
  stay_two:s([
   n(T('Во дворе пахнет кофе и мокрыми листьями. На стуле лежит записка: «Следующий показ — в субботу. Комедия. Если жизнь не опередит».','The courtyard smells of coffee and damp leaves. A note lies on a chair: “Next screening on Saturday. A comedy. If life does not get there first.”')),
   n(T('Это не конец поиска, а начало обычных дней: платить, работать, ошибаться и спрашивать дорогу.','This is not the end of the search, but the start of ordinary days: paying, working, making mistakes and asking for directions.'))
  ],'epilogue_stay',{bg:'belgrade-courtyard',time:'10:30',exitAction:out(T('Принять записку','Take the note'))}),
  epilogue_stay:s([
   n(T('Через несколько недель Белград перестаёт быть местом, где я учусь. Он становится местом, где я живу: я знаю, где купить хлеб и какой тон нужен для разговора с банком.','A few weeks later Belgrade stops being a place where I am learning. It becomes a place where I live: I know where to buy bread and what tone suits a conversation with the bank.')),
   fin(T('В субботу двор снова собирается. Мне оставляют стул, и я больше не удивляюсь этому.','On Saturday the courtyard gathers again. They keep a chair for me, and I am no longer surprised.'),{
    nikola:T('Никола присылает: «Я оставил тебе кифлу на завтра». Я улыбаюсь и отвечаю: «Тогда приду пораньше».','Nikola writes: “I saved you a kifla for tomorrow.” I smile and answer: “Then I will come early.”'),
    milica:T('Милица присылает фото страницы блокнота: набросок двора и подпись «твой стул». Я отвечаю: «Тогда приду пораньше».','Milica sends a photo of a notebook page: a sketch of the courtyard captioned “your chair”. I answer: “Then I will come early.”'),
    asya:T('Ася присылает: «Принесла третью лампу. На этот раз точно хватит света». Я смеюсь: «Звучит как план».','Asya writes: “I brought a third lamp. This time there will definitely be enough light.” I laugh: “That sounds like a plan.”'),
    luka:T('Лука присылает табличку расходов на ближайший месяц и подпись «без давления, просто посмотри». Я отвечаю: «Посмотрю — и приду на ужин».','Luka sends a spreadsheet of next month’s costs captioned “no pressure, just take a look”. I answer: “I will look, and come for dinner.”'),
    alone:T('Я иду по своей улице в одиночестве, но не одиноко: в окнах знакомый свет, и теперь он немного мой.','I walk down my street alone, but not lonely: the windows hold a familiar light, and now it is a little mine.')}),
   n(T('Большой вопрос закрыт не навсегда, а честно: я выбрал{a} остаться и каждый день буду выбирать это заново.','The big question is closed not for ever, but honestly: I chose to stay, and I will choose it again every day.'))
  ],'end',{bg:'belgrade-courtyard',time:'19:30',day:T('ПОЗЖЕ ЛЕТОМ','LATER IN THE SUMMER'),journal:['final_stay'],effectOnEnter:{chapterSevenComplete:true},exitAction:out(T('Сохранить этот финал','Save this ending'))}),
  leave_one:s([
   n(T('Утром я пишу хозяевам: «Спасибо за комнату. Договор не продлеваю». Слова простые, но откладывать их больше не хочется.','In the morning I write to my hosts: “Thank you for the room. I am not renewing the lease.” The words are simple, and I no longer want to postpone them.')),
   n(T('Я проверяю, что срок законного пребывания не истекает до вылета, и закрываю папку с документами. Заявление остаётся ожиданием, а не обещанием результата.','I check that my lawful stay does not run out before the flight, and close the document folder. The application remains a wait, not a promise of a result.')),
   n(T('Чемодан закрывается легче, чем в тот день, когда я открыл{a} его в аэропорту. Теперь в нём вещи, которые я выбираю брать с собой.','The suitcase closes more easily than it did the day I opened it at the airport. Now it holds things I choose to take with me.'))
  ],'leave_two',{time:'09:00',exitAction:out(T('Попрощаться с комнатой','Say goodbye to the room'))}),
  leave_two:s([
   n(T('Такси проезжает мимо булочной, зелёной двери и двора с двумя упрямыми котами. Город не пытается меня удержать — и от этого спокойнее.','The taxi passes the bakery, the green door and the courtyard with two stubborn cats. The city does not try to keep me, and that is calming.')),
   n(T('Я знаю: я не сбежал{a}. Я увожу домой кое-что новое: привычку просить помощи, вкус хорошего хлеба и людей, которым можно написать.','I know I am not running away. I take home something new: the habit of asking for help, the taste of good bread and people I can write to.'))
  ],'epilogue_leave',{bg:'belgrade-drive',time:'12:10',exitAction:out(T('Доехать до аэропорта','Ride to the airport'))}),
  epilogue_leave:s([
   n(T('В аэропорту жарко, как и в день прилёта. Но теперь в этом зале у меня нет ощущения чужого места.','The airport is hot, as it was on the day I arrived. But now this hall no longer feels like somewhere I do not belong.')),
   fin(T('Друзья пишут: «Долетай спокойно. Двор подождёт». Мне становится легче и грустнее одновременно, и обе половины честные.','My friends write: “Have a calm flight. The courtyard will wait.” I feel lighter and sadder at once, and both halves are honest.'),{
    nikola:T('Никола присылает: «Долетай спокойно. Кифла останется тёплой в памяти». Я отвечаю: «Спасибо за лето».','Nikola writes: “Have a calm flight. The kifla will stay warm in memory.” I answer: “Thank you for the summer.”'),
    milica:T('Милица присылает: «Долетай спокойно. Рисунок вышлю, когда закончу». Я отвечаю: «Спасибо за лето».','Milica writes: “Have a calm flight. I will send the drawing when I finish it.” I answer: “Thank you for the summer.”'),
    asya:T('Ася пишет: «Будет хотя бы одно место, где тебе всегда оставят стул». Я отвечаю: «Это тоже дом».','Asya writes: “There will always be at least one place that keeps a chair for you.” I answer: “That is also a home.”'),
    luka:T('Лука пишет: «Если захочешь посчитать вернуться ли, я рядом. Если нет, всё равно рядом». Я отвечаю: «Спасибо за ужин».','Luka writes: “If you want to calculate whether to come back, I am here. If not, I am here anyway.” I answer: “Thank you for dinner.”'),
    alone:T('Я иду к стойке регистрации в одиночестве, но с ощущением, что увожу с собой больше, чем было в чемодане.','I walk to check-in alone, but with the feeling that I carry more than I brought.')}),
   n(T('Самолёт набирает высоту. Серия огней внизу складывается в город, который я больше не боюсь. Решение принято, и я его уважаю.','The plane climbs. The string of lights below forms a city I am no longer afraid of. The decision is made, and I respect it.'))
  ],'end',{bg:'airport-apron',time:'14:40',day:T('ДЕНЬ ВЫЛЕТА','DEPARTURE DAY'),journal:['final_leave'],effectOnEnter:{chapterSevenComplete:true},exitAction:out(T('Сохранить этот финал','Save this ending'))}),
  return_one:s([
   n(T('Я пишу хозяевам: «Договор не продлеваю, но хочу вернуться осенью. Можно связаться, когда будет ясность?» Ответ приходит дружелюбный и осторожный.','I write to my hosts: “I am not renewing the lease, but I would like to return in autumn. May I contact you when things are clear?” The answer is friendly and careful.')),
   n(T('Я составляю список без громких обещаний: проверить статус заявления по официальному каналу, сохранить документы, уточнить сроки и условия аренды, поговорить с домом.','I write a list without grand promises: check the application status through the official channel, keep the documents, confirm the dates and conditions for renting, and talk to home.')),
   n(T('Вернуться — не значит гарантировать. Это значит иметь план, который можно проверять и менять.','To return is not to guarantee. It means having a plan that can be checked and changed.'))
  ],'return_two',{time:'09:00',exitAction:out(T('Сложить вещи','Pack my things'))}),
  return_two:s([
   n(T('Мы прощаемся не навсегда, поэтому слова получаются короче и легче: «До осени», «Напиши, как долетел{a}», «Я оставлю стул».','We say goodbye, but not for ever, so the words come out shorter and lighter: “See you in autumn”, “Tell me how the flight went”, “I will keep the chair”.')),
   n(T('Никто не требует клятв. Эта лёгкость и есть главное: я не обязан{a} никому, кроме собственного плана.','Nobody asks for promises. That lightness is the main thing: I owe nothing to anyone except my own plan.'))
  ],'epilogue_return',{bg:'courtyard-after-film',character:'asya',time:'11:00',exitAction:out(T('Поехать в аэропорт','Head for the airport'))}),
  epilogue_return:s([
   n(T('В зале вылета я открываю заметки. Внизу списка пустая строка: «Что будет в сентябре». Её не нужно заполнять сейчас.','In the departure hall I open my notes. At the bottom of the list is an empty line: “What happens in September”. It does not need to be filled in now.')),
   fin(T('Друзья отправляют общий чат с фото двора и надписью «Ждём». Я отвечаю: «Если получится, увидимся».','My friends send a group chat with a photo of the courtyard captioned “We are waiting”. I answer: “If it works out, we will see each other.”'),{
    nikola:T('Никола пишет: «Кифла подождёт. Возвращайся, когда будешь готов». Я отвечаю: «Если получится, увидимся».','Nikola writes: “The kifla will wait. Come back when you are ready.” I answer: “If it works out, we will see each other.”'),
    milica:T('Милица пишет: «Я нарисую тебе обложку на следующий приезд». Я отвечаю: «Если получится, увидимся».','Milica writes: “I will draw you a cover for your next visit.” I answer: “If it works out, we will see each other.”'),
    asya:T('Ася пишет: «Свет оставим включённым. Электричество здесь, к сожалению, платное, но для тебя можно». Я смеюсь: «Если получится, увидимся».','Asya writes: “We will leave the light on. The electricity here is unfortunately paid, but for you it is allowed.” I laugh: “If it works out, we will see each other.”'),
    luka:T('Лука пишет: «Составил черновик бюджета на осень. Он ничего не решает, но поможет». Я отвечаю: «Если получится, увидимся».','Luka writes: “I drafted an autumn budget. It decides nothing, but it will help.” I answer: “If it works out, we will see each other.”'),
    alone:T('Я иду к посадке в одиночестве, но с планом. Он не обещает возвращения, зато честно говорит, как к нему подойти.','I walk to boarding alone, but with a plan. It does not promise a return, yet it says honestly how to approach one.')}),
   n(T('Самолёт взлетает над рекой. Я знаю, что дверь осталась приоткрытой, и теперь мне решать, когда и как в неё войти.','The plane takes off above the river. I know the door has been left ajar, and it is for me to decide when and how to go through it.'))
  ],'end',{bg:'airport-apron',time:'14:40',day:T('ДЕНЬ ВЫЛЕТА','DEPARTURE DAY'),journal:['final_return'],effectOnEnter:{chapterSevenComplete:true},exitAction:out(T('Сохранить этот финал','Save this ending'))})
 });
 N.chapter_six_close.next='decision_morning';
 N.chapter_six_close.exitAction=out(T('Продолжить · Ответ на лето','Continue · An Answer for the Summer'));
}
