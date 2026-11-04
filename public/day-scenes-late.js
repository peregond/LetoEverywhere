// Days 17-20 and 22-28: the days of waiting for an answer and of coming to a decision. Same shape as day-scenes.js.
// Nothing here announces an approval; the answer to the application stays open until the final day.
import {dayKit} from './day-scenes.js?v=0.17.2';
import {T} from './days.js?v=0.17.2';
export function extendSecondHalf({NODES,JOURNAL,n,scene}){
 const {build,opt,note,A,L,contact,counter,owner,neighbour,route}=dayKit({NODES,JOURNAL,n,scene});
 const msg=page=>({...page,message:true});

 // Day 17: the receipt and the wait. Hosts pair.
 build(17,{bg:'dorcol-apartment',time:'09:30',midTime:'12:00',turnTime:'19:00',extra:{districtBg:true},
  start:[
   note('После подачи наступает странная пауза: заявление принято, но ответа ещё нет.','After filing there is a strange pause: the application has been accepted, but there is no answer yet.'),
   note('Я раскладываю по папке квитанцию об оплате пошлины и подтверждение подачи и отмечаю дату. Бумаги лежат ровно, а мысли всё равно скачут.','I put the receipt for the fee and the confirmation of filing into the folder and note the date. The papers lie flat, but my thoughts still jump around.'),
   owner(['Если на адрес придёт письмо, я сразу сфотографирую его и пришлю.','If a letter arrives at the address, I will photograph it at once and send it to you.'],['Если на адрес придёт письмо, я сразу сфотографирую его и пришлю.','If a letter arrives at the address, I will photograph it at once and send it to you.'])],
  options:[
   opt(['Записать, как проверять статус','Write down how to check the status'],'practical',{waitPlan:'status'},[
    note('Я выписываю, где можно проверить статус заявления и какие данные для этого нужны. Ссылку сохраняю в закладки, а номер — отдельно.','I write down where the status of the application can be checked and which details are needed. I bookmark the link and note the number separately.'),
    note('Решаю смотреть статус раз в несколько дней, а не каждые пять минут. Правило звучит просто, выполнять его будет сложнее.','I decide to look at the status every few days, not every five minutes. The rule sounds simple; keeping it will be harder.')],['Закрыть закладки','Close the bookmarks']),
   opt(['Поставить напоминания на ближайшие недели','Set reminders for the coming weeks'],'practical',{waitPlan:'reminders'},[
    note('Я ставлю в календарь три напоминания: проверить статус, сверить сроки пребывания и написать домой. Каждое — с коротким пояснением.','I put three reminders in the calendar: check the status, compare the stay deadlines and write home. Each has a short note.'),
    note('Теперь мне не нужно держать всё в голове. Календарь помнит за меня.','Now I do not have to keep everything in my head. The calendar remembers for me.')],['Закрыть календарь','Close the calendar']),
   opt(['Дать себе выходной от бумаг','Give myself a day off from papers'],'personal',{waitPlan:'rest'},[
    note('Я закрываю папку и убираю её на полку. Сегодня о заявлении я не вспоминаю — если оно понадобится, оно лежит на месте.','I close the folder and put it on the shelf. Today I do not think about the application; if it is needed, it is where it should be.'),
    note('Странно, но отдых от бумаг возвращает аппетит. Я готовлю нормальный завтрак — впервые за неделю.','Strange, but a rest from papers brings my appetite back. I cook a proper breakfast for the first time this week.')],['Сесть за стол','Sit down at the table'])],
  mid:[
   note('Ожидание — не обещание результата. Я напоминаю себе, что подача ничего не гарантирует, и стараюсь планировать честно, без розовых очков.','Waiting is not a promise of a result. I remind myself that filing guarantees nothing, and I try to plan honestly, without rose-coloured glasses.'),
   note('Я проверяю, что адрес, телефон и почта в заявлении — именно те, по которым меня найдут. Любая ошибка здесь стоит дороже, чем кажется.','I check that the address, phone and email in the application are exactly the ones by which I can be reached. Any mistake here costs more than it seems.'),
   note('И всё же внутри что-то тревожно щёлкает каждый раз, когда приходит уведомление.','Still, something clicks anxiously inside every time a notification arrives.')],midExit:['Выйти на кухню','Go to the kitchen'],
  mid2:[
   opt(['Написать Асе о тревоге','Write to Asya about the worry'],'friendship',{waitMood:'asya'},[
    msg(A('Ожидание — тоже работа. Давай завтра на рынок: там слишком шумно, чтобы тревожиться.','Waiting is work too. Let us go to the market tomorrow: it is too noisy there to worry.','laughing')),
    note('Простое приглашение меняет настроение сильнее длинных советов. Я отвечаю: «Давай» и впервые за день выдыхаю.','A simple invitation changes my mood more than long advice. I answer “Yes” and breathe out for the first time today.')],['Положить телефон','Put the phone down']),
   opt(['Занять руки делом','Keep my hands busy'],'practical',{waitMood:'busy'},[
    note('Я мою окна и переставляю книги на полке. Каждая мелочь встаёт на своё место, и от этого почему-то легче.','I wash the windows and rearrange the books on the shelf. Every small thing finds its place, and somehow that makes things easier.'),
    note('Руки заняты, голова свободна. К вечеру тревога становится тише, хотя и не исчезает совсем.','My hands are busy, my head is free. By evening the worry grows quieter, although it does not vanish entirely.')],['Вымыть руки','Wash my hands'])],
  turn:[
   note('Вечером на кухне собираются оба хозяина. Никто не заговаривает о бумагах, но по тому, как они ставят на стол лишнюю тарелку, ясно, что они всё понимают.','In the evening both hosts gather in the kitchen. Nobody mentions papers, but the way they put an extra plate on the table makes it clear they understand.'),
   neighbour(['Не переживай: ожидание — не повод останавливать жизнь. Заходи на ужин.','Do not worry: waiting is no reason to stop living. Come over for dinner.'],['Не переживай: ожидание — не повод останавливать жизнь. Заходи на ужин.','Do not worry: waiting is no reason to stop living. Come over for dinner.']),
   note('Мы ужинаем втроём. Ни одного слова про бумаги — и от этого легче.','The three of us have supper. Not one word about papers, and that makes things easier.')],turnExit:['Помочь убрать со стола','Help clear the table'],
  end:[
   note('Я не отменяю жизнь на время ожидания: слишком много города ещё не посмотрено.','I do not cancel my life while waiting: too much of the city is still unseen.'),
   note('Заявление лежит где-то в системе и ждёт своего времени. Моё время — сейчас.','The application lies somewhere in the system and waits for its time. My time is now.')]});

 // Day 18: a first working step. Asya and Luka; the work route decides what the day looks like.
 build(18,{bg:'workshop-office',time:'10:00',midTime:'13:00',turnTime:'17:30',
  start:[
   note('Заявление подано, а работа не ждёт.','The application is filed, and work does not wait.'),
   route(T('Сегодня у меня первый настоящий клиент. Мы договорились о коротком созвоне: что ему нужно, сколько это займёт и во сколько обойдётся.','Today I have my first real client. We have agreed on a short call: what he needs, how long it will take and what it will cost.'),T('Сегодня мой первый рабочий день. Меня ждут в офисе: знакомство с командой, ключи, доступы и разговор о задачах.','Today is my first working day. They expect me at the office: meeting the team, keys, access and a talk about tasks.'),T('Сегодня у меня две встречи с людьми из моей сферы. Я хочу понять, что действительно открывает двери, а что только выглядит красиво.','Today I have two meetings with people from my field. I want to understand what really opens doors and what only looks nice.')),
   A('Первый клиент всегда спрашивает больше, чем нужно. Это нормально.','The first client always asks for more than they need. That is normal.','laughing')],
  options:[
   opt(['Перечитать условия и подготовиться заранее','Reread the terms and prepare in advance'],'practical',{workStep:'prep'},[
    note('Я перечитываю договорённости слово за словом и выписываю три вопроса, которые не хочу забыть задать.','I reread the agreements word by word and write down three questions I do not want to forget to ask.'),
    note('Подготовка занимает полчаса и снимает дрожь в руках. Я иду на встречу, зная, о чём говорить.','Preparation takes half an hour and steadies my hands. I go to the meeting knowing what to talk about.')],['Взять блокнот','Take my notebook']),
   opt(['Прийти пораньше и осмотреться','Arrive early and look around'],'explore',{workStep:'early'},[
    note('Я прихожу за двадцать минут и просто стою у входа. Смотрю, кто приходит, как здороваются и на каком языке говорят.','I arrive twenty minutes early and simply stand by the entrance. I watch who comes in, how they greet one another and what language they speak.'),
    note('Это ничего не меняет в планах, но убирает страх незнакомого места. Я захожу среди первых, а не последних.','It changes nothing in the plans but removes the fear of an unfamiliar place. I go in among the first, not the last.')],['Войти внутрь','Go inside']),
   opt(['Позвонить Луке перед началом','Phone Luka before the start'],'friendship',{workStep:'luka'},[
    note('Лука отвечает со второго гудка. Я объясняю ситуацию, он слушает и задаёт два вопроса, на которые у меня нет ответов.','Luka answers on the second ring. I explain the situation; he listens and asks two questions to which I have no answers.'),
    note('Это лучшая подготовка: теперь я знаю, чего ещё не знаю. Я записываю вопросы и благодарю его.','That is the best preparation: now I know what I do not yet know. I write down the questions and thank him.')],['Попрощаться','Say goodbye'])],
  mid:[
   route(T('Созвон идёт лучше, чем я ожидал{a}. Клиент задаёт много вопросов и вдруг признаётся, что сам не знает, чего хочет. Мы вместе разбираемся.','The call goes better than I expected. The client asks many questions and suddenly admits he does not know what he wants. We sort it out together.'),T('Меня знакомят с командой. Имён много, лиц ещё больше, но каждый находит, что сказать. К полудню я узнаю свой стол и чайник.','They introduce me to the team. There are many names and even more faces, but everyone finds something to say. By noon I recognise my desk and the kettle.'),T('Первая встреча проходит в кафе, вторая — в коридоре. Оба собеседника говорят о том, что в этой сфере ценится не диплом, а рекомендация.','The first meeting is in a café, the second in a corridor. Both speak about how in this field a recommendation counts for more than a diploma.')),
   note('Я записываю главное: имена, сроки, обещания. Своих обещаний делаю меньше, чем хочется.','I write down the essentials: names, deadlines, promises. I make fewer promises of my own than I would like.'),
   note('К середине дня усталость становится приятной: это усталость человека, который делает что-то настоящее.','By the middle of the day the tiredness is pleasant: the tiredness of someone doing something real.')],midExit:['Выпить воды','Drink some water'],
  mid2:[
   opt(['Согласиться на дополнительную просьбу','Agree to an extra request'],'practical',{workAsk:'yes'},[
    note('Меня просят о маленькой добавке к работе: «Это на пятнадцать минут». Я знаю, что пятнадцать минут обычно оказываются часом.','I am asked for a small addition to the work: “It will take fifteen minutes.” I know that fifteen minutes usually turn out to be an hour.'),
    note('Всё же соглашаюсь, но записываю условия и срок. Добрая воля не отменяет договорённостей.','I agree all the same, but I write down the terms and the deadline. Goodwill does not cancel agreements.')],['Записать условия','Note the terms']),
   opt(['Вежливо сказать, что это за рамками условий','Politely say it is outside the terms'],'personal',{workAsk:'no'},[
    note('Я говорю спокойно: «Это не входит в то, о чём мы договорились. Давайте обсудим отдельно». Голос почти не дрожит.','I say calmly: “That is not part of what we agreed. Let us discuss it separately.” My voice barely trembles.'),
    note('Собеседник кивает и не обижается. Оказывается, граница, обозначенная вежливо, уважается.','The other person nods and takes no offence. It turns out a boundary drawn politely is respected.')],['Выдохнуть','Breathe out'])],
  turn:[
   note('Вечером мы встречаемся с Лукой и Асей за ужином. Я пересказываю день, они слушают и перебивают только затем, чтобы налить чаю.','In the evening Luka, Asya and I meet for supper. I retell the day; they listen and interrupt only to pour more tea.'),
   L('Запиши условия до начала работы. Потом спорить не придётся.','Write the terms down before work begins. You will not have to argue later.','thoughtful'),
   note('Я киваю: сегодня я сделал{a} именно так. Ася поднимает чашку в мою честь.','I nod: today I did exactly that. Asya raises her cup in my honour.')],turnExit:['Поднять чашку','Raise my cup'],
  end:[
   note('К вечеру усталость хорошая, как после первого настоящего дня.','By evening the tiredness is good, like after a first real day.'),
   note('Пока бумаги ждут ответа, жизнь не стоит на месте. Это лучшее, что можно сделать за этот день.','While the papers wait for an answer, life does not stand still. That is the best thing I could have done with this day.')]});

 // Day 19: a day off. Airport pair; closeness stays as close as the player chooses.
 build(19,{bg:'riverside-evening',time:'12:00',midTime:'15:00',turnTime:'19:30',extra:{companionPortrait:true},
  start:[
   contact(['Выходной. Если у тебя есть время, давай дойдём до реки?','A day off. If you have time, shall we walk to the river?'],['У меня выходной и блокнот. Если у тебя есть время, давай просто посидим у воды?','I have a day off and a notebook. If you have time, shall we just sit by the water?'],{message:true}),
   note('Я отвечаю: «Давай». Иногда лучшая договорённость — та, у которой нет плана.','I answer: “Yes.” Sometimes the best arrangement is the one with no plan.'),
   note('Мы встречаемся у воды в полдень. Солнце уже жаркое, но тень от деревьев густая и пахнет свежей травой.','We meet by the water at noon. The sun is already hot, but the shade of the trees is thick and smells of fresh grass.')],
  options:[
   opt(['Просто идти вдоль реки','Simply walk along the river'],'personal',{dayOff:'walk'},[
    note('Мы идём не торопясь и не пытаемся дойти до какого-нибудь места. Берег то узкий, то широкий, то совсем дикий.','We walk without hurrying and do not try to reach any place. The bank is narrow, then wide, then entirely wild.'),
    note('Время течёт так же неспешно, как вода. Я замечаю, что давно не чувствовал{a} себя так легко.','Time flows as slowly as the water. I notice that I have not felt so light for a long time.')],['Остановиться у воды','Stop by the water']),
   opt(['Зайти в кафе у воды','Go into the café by the water'],'friendship',{dayOff:'cafe'},[
    note('Мы выбираем столик под навесом. Официант приносит кофе и лимонад, и ни у кого нет желания смотреть на часы.','We choose a table under the awning. The waiter brings coffee and lemonade, and nobody wants to look at a clock.'),
    note('Разговор плавно перескакивает с погоды на музыку, с музыки на любимые места. Оказывается, у нас больше общего, чем я думал{a}.','The conversation moves smoothly from the weather to music, from music to favourite places. It turns out we have more in common than I thought.')],['Заказать ещё лимонада','Order more lemonade']),
   opt(['Пойти на рынок','Go to the market'],'explore',{dayOff:'market'},[
    note('На рынке шумно и ярко: горы персиков, банки с мёдом, продавцы, которые зазывают на трёх языках сразу.','The market is loud and bright: heaps of peaches, jars of honey, sellers calling out in three languages at once.'),
    note('Мы пробуем всё подряд и спорим, какой мёд лучше. Мне достаётся банка, которую я вовсе не планировал{a} покупать.','We taste everything and argue about which honey is best. I end up with a jar I never meant to buy.')],['Убрать покупки в сумку','Put the purchases in the bag'])],
  mid:[
   note('Мы почти не говорим о делах. Заявление, банк и сроки остаются где-то далеко, как шум за стеной.','We hardly talk about work. The application, the bank and the deadlines remain somewhere far away, like noise behind a wall.'),
   note('Разговор перескакивает с кофе на архитектуру, с архитектуры на детство. Я понимаю, что давно не слышал{a} чужих историй просто так.','The conversation jumps from coffee to architecture, from architecture to childhood. I realise I have not heard other people’s stories for their own sake for a long time.'),
   note('Мне нравится, что рядом человек, который ничего от меня не ждёт.','I like having beside me someone who expects nothing from me.')],midExit:['Остановиться и вдохнуть','Stop and take a breath'],
  mid2:[
   opt(['Спросить, как человек выбрал этот город','Ask how they chose this city'],'personal',{dayOffAsk:'story'},[
    note('Я спрашиваю, как человек, с которым я иду, когда-то выбрал Белград. Ответ неожиданно простой: «Я просто остался на одну неделю дольше, чем планировал».','I ask how the person I am walking with once chose Belgrade. The answer is surprisingly simple: “I just stayed one week longer than planned.”'),
    note('Одна лишняя неделя превращается в годы. Мне не страшно от этой мысли, и это само по себе ответ.','One extra week turns into years. The thought does not frighten me, and that in itself is an answer.')],['Улыбнуться','Smile']),
   opt(['Помолчать рядом','Be quiet together'],'personal',{dayOffAsk:'silence'},[
    note('Мы сидим на старой скамейке и смотрим на воду. Молчание не неловкое, а тёплое, как нагретое дерево скамейки.','We sit on an old bench and look at the water. The silence is not awkward but warm, like the sun-heated wood of the bench.'),
    note('Мне хорошо без объяснений. Мы не обязаны ничего называть, и это нас не отдаляет.','I feel well without explanations. We do not have to name anything, and that does not push us apart.')],['Дослушать тишину','Listen to the quiet to the end'])],
  turn:[
   note('Мы прощаемся у моста: никто никого не торопит, никто ничего не обещает. Телефон коротко вибрирует.','We say goodbye at the bridge: nobody hurries anyone, nobody promises anything. My phone vibrates briefly.'),
   counter(['Слышала, вы были у реки. Завидую: я весь день сижу с блокнотом.','I heard you were by the river. I envy you: I am stuck with my notebook all day.'],['Слышал, вы были у реки. Завидую: я весь день у печи.','I heard you were by the river. I envy you: I am by the oven all day.'],{message:true}),
   note('Я улыбаюсь: даже издалека этот город умеет напомнить о себе.','I smile: even from afar this city knows how to remind me of itself.')],turnExit:['Пойти домой','Go home'],
  end:[
   note('Я возвращаюсь с лёгким чувством, что здесь есть человек, с которым не нужно ничего решать.','I come back with a light feeling that there is someone here with whom nothing has to be decided.'),
   note('Хороший день не требует названия. Я записываю его в журнал одним словом: «река».','A good day does not need a name. I note it in my journal in one word: “river”.')]});

 // Day 20: a talk about the lease. Hosts pair.
 build(20,{bg:'dorcol-apartment',time:'09:30',midTime:'11:00',turnTime:'13:00',extra:{districtBg:true,districtPortrait:true},
  start:[
   owner(['Договор подходит к концу месяца. Давай поговорим заранее: мне важно знать твои планы.','The lease is nearing the end of the month. Let us talk in advance: I would like to know your plans.'],['Договор подходит к концу месяца. Давай поговорим заранее: мне важно знать твои планы.','The lease is nearing the end of the month. Let us talk in advance: I would like to know your plans.']),
   note('Мы пьём кофе на кухне и считаем: сколько мне ещё остаться, что менять в условиях и какой срок уведомления нужен.','We drink coffee in the kitchen and count: how much longer I might stay, what to change in the terms and what notice period is needed.'),
   note('Я понимаю, что готового ответа у меня нет. Это можно сказать честно, не извиняясь.','I understand that I have no ready answer. That can be said honestly, without apologising.')],
  options:[
   opt(['Сказать, что пока не знаю','Say that I do not know yet'],'personal',{leasePlan:'unknown'},[
    note('Я говорю прямо: «Я ещё не решил{a}. Ответа по заявлению пока нет, и мне нужно время».','I say it directly: “I have not decided yet. There is no answer to the application, and I need time.”'),
    note('Хозяин не вздыхает и не торопит. Он кивает: так честнее, чем обещать то, чего не знаешь.','The host does not sigh or hurry me. He nods: it is more honest than promising what you do not know.')],['Налить ещё кофе','Pour more coffee']),
   opt(['Попросить продлить договор на месяц','Ask to extend the lease by a month'],'practical',{leasePlan:'month'},[
    note('Я прошу продлить договор ровно на месяц: достаточно, чтобы дождаться ответа, и не слишком долго, если придётся уезжать.','I ask for the lease to be extended by exactly one month: enough to wait for the answer, and not too long if I have to leave.'),
    note('Хозяин считает, сколько это будет стоить и какие условия остаются прежними. Цифры не пугают, потому что я их ожидал{a}.','The host counts how much it would cost and which terms remain the same. The figures do not frighten me, because I was expecting them.')],['Записать цифры','Write down the figures']),
   opt(['Спросить о коротком сроке уведомления','Ask about a short notice period'],'practical',{leasePlan:'notice'},[
    note('Я спрашиваю, можно ли оставить договор как есть, но сократить срок уведомления об отъезде. Это ничего не меняет сегодня и многое — потом.','I ask whether the lease can stay as it is but with a shorter notice period for leaving. It changes nothing today and a great deal later.'),
    note('Хозяин задумывается и просит день на размышление. Я не настаиваю: договорённость важнее скорости.','The host thinks and asks for a day to consider. I do not insist: the agreement matters more than speed.')],['Согласиться подождать','Agree to wait'])],
  mid:[
   note('Мы записываем всё на листе: срок, сумма, срок уведомления, залог. Простые слова, которые легко забыть и трудно потом вспомнить.','We write everything on a sheet: term, sum, notice period, deposit. Simple words that are easy to forget and hard to recall later.'),
   note('Я перечитываю список вслух. Хозяин поправляет одну цифру и добавляет пункт, который я не учитывал{a}.','I reread the list aloud. The host corrects one figure and adds an item I had not considered.'),
   note('Разговор о договоре оказывается разговором о доверии. Никто никого не проверяет, но каждый хочет ясности.','The talk about the lease turns out to be a talk about trust. Nobody is checking anyone, but everyone wants clarity.')],midExit:['Отложить лист','Set the sheet aside'],
  mid2:[
   opt(['Попросить оформить условия письменно','Ask for the terms in writing'],'practical',{leaseWrite:'writing'},[
    note('Я прошу написать условия на бумаге и поставить даты. Хозяин не обижается: это обычная практика, а не недоверие.','I ask for the terms to be written down and dated. The host takes no offence: it is ordinary practice, not distrust.'),
    note('Листок получается коротким, но с подписями. Я фотографирую его и убираю в папку к остальным документам.','The sheet is short but signed. I photograph it and put it in the folder with the other documents.')],['Убрать в папку','Put it in the folder']),
   opt(['Договориться устно и подтвердить письмом','Agree orally and confirm by message'],'personal',{leaseWrite:'oral'},[
    note('Мы пожимаем руки и договариваемся, что вечером я пришлю короткое письмо с условиями. Если что-то не так, хозяин поправит.','We shake hands and agree that in the evening I will send a short message with the terms. If anything is wrong, the host will correct it.'),
    note('Так проще для обоих, и всё же я записываю разговор в блокнот, пока он свежий. Письменный след защищает всех.','It is easier for both of us, and still I note the conversation in my notebook while it is fresh. A written trace protects everyone.')],['Закрыть блокнот','Close the notebook'])],
  turn:[
   note('Пока мы пьём вторую чашку, заходит второй хозяин дома. Он ищет соль и застревает у двери.','As we drink the second cup, the other host of the house comes in. They are looking for salt and linger by the door.'),
   neighbour(['Я заходила за солью и невольно услышала. Лучше обсудить срок уведомления сегодня, чем потом.','I came in for salt and overheard. It is better to discuss the notice period today than later.'],['Я заходил за солью и невольно услышал. Лучше обсудить срок уведомления сегодня, чем потом.','I came in for salt and overheard. It is better to discuss the notice period today than later.']),
   note('Все смеются: соль так и остаётся нетронутой на полке. Разговор заканчивается мирно и тепло.','Everyone laughs: the salt stays untouched on the shelf. The conversation ends peacefully and warmly.')],turnExit:['Поблагодарить хозяев','Thank the hosts'],
  end:[
   note('Решения нет, но разговор уже снял половину тревоги.','There is no decision, but the conversation has already lifted half of the worry.'),
   note('Завтра суббота и двор. Я вдруг понимаю, что жду его так, как раньше ждал{a} только отпуска.','Tomorrow is Saturday and the courtyard. I suddenly realise that I am looking forward to it the way I used to look forward only to holidays.')]});

 // Day 22: the morning after the film. Asya and Luka by message.
 build(22,{bg:'belgrade-morning-cafe',time:'09:30',midTime:'12:00',turnTime:'17:00',
  start:[
   msg(A('Двор выглядит так, будто там ничего не было. Фото прикладываю как доказательство.','The courtyard looks as if nothing happened there. I attach a photo as proof.','laughing')),
   note('Я читаю сообщение и улыбаюсь. Вчера было много света, много людей и очень мало планов — наверное, поэтому всё получилось.','I read the message and smile. Yesterday there was a lot of light, a lot of people and very few plans, which is probably why it worked.'),
   note('Теперь утро. Кофе остывает, на экране горит фото двора, а мне нужно решить, как ответить.','Now it is morning. The coffee is cooling, a photo of the courtyard glows on the screen, and I have to decide how to reply.')],
  options:[
   opt(['Ответить шуткой','Reply with a joke'],'friendship',{morningAfter:'joke'},[
    note('Я пишу: «Доказательство принято. Но на стуле у арки до сих пор лежит чья-то куртка — это тоже улика».','I write: “Proof accepted. But somebody’s jacket is still lying on the chair by the arch, which is evidence too.”'),
    note('Ответ приходит мгновенно: три смеющихся смайлика и фотография куртки. Она оказывается моей.','The reply comes at once: three laughing faces and a photograph of the jacket. It turns out to be mine.')],['Отправить смайлик','Send an emoji']),
   opt(['Ответить честно, что мне было хорошо','Reply honestly that I felt good'],'personal',{morningAfter:'honest'},[
    note('Я пишу: «Мне было хорошо. Спасибо, что позвали». Слова простые, но не пустые.','I write: “I felt good. Thank you for inviting me.” The words are simple but not empty.'),
    note('Ответ приходит позже и короче: «Мне тоже». Этого достаточно, чтобы утро стало светлее.','The reply comes later and shorter: “Me too.” That is enough to make the morning brighter.')],['Налить ещё кофе','Pour more coffee']),
   opt(['Предложить помочь убрать двор','Offer to help clear the courtyard'],'practical',{morningAfter:'help'},[
    note('Я пишу: «Нужна помощь с уборкой?» Через минуту приходит список из шести пунктов и подпись «шучу, но можно».','I write: “Do you need help clearing up?” A minute later comes a list of six items signed “joking, but you may”.'),
    note('Я надеваю удобную обувь и иду во двор. Пустые стулья выглядят непривычно, как классная комната в выходной.','I put on comfortable shoes and go to the courtyard. The empty chairs look unfamiliar, like a classroom on a weekend.')],['Войти во двор','Enter the courtyard'])],
  mid:[
   note('Мы договариваемся о следующем показе: когда, какой фильм, кто что принесёт. Список растёт быстрее, чем мы успеваем его записывать.','We agree on the next screening: when, which film, who brings what. The list grows faster than we can write it down.'),
   note('Я замечаю, что в календаре уже есть повторяющаяся запись «двор». Её поставил не я, но удалять её я не собираюсь.','I notice that my calendar already has a recurring entry called “courtyard”. I did not put it there, but I have no intention of deleting it.'),
   note('Это мелочь, но с неё начинается ощущение, что у меня есть собственное расписание.','It is a small thing, but it is where the feeling of having my own schedule begins.')],midExit:['Закрыть календарь','Close the calendar'],
  mid2:[
   opt(['Предложить взять на себя проектор','Offer to take charge of the projector'],'practical',{nextScreening:'projector'},[
    note('Я говорю, что в прошлый раз провода меня не победили, а значит, не победит и проектор. Ася делает вид, что сомневается.','I say that last time I worked out the cables, so I can handle the projector too. Asya pretends to doubt it.'),
    note('«Хорошо, — говорит она, — только без творческих решений». Мы смеёмся, и я записываю пункт на себя.','“Fine,” she says, “but no creative solutions.” We laugh, and I take the item on myself.')],['Записать пункт','Note the item']),
   opt(['Предложить принести еду','Offer to bring the food'],'friendship',{nextScreening:'food'},[
    note('Я предлагаю принести что-нибудь к фильму: булочки из той самой пекарни и что-то сладкое.','I offer to bring something for the film: rolls from that very bakery and something sweet.'),
    note('Предложение принимается с таким энтузиазмом, что я понимаю: меня уже считают своей. Это приятнее любого ответа по заявлению.','The offer is accepted with such enthusiasm that I realise I am already counted as one of them. That is more pleasant than any answer to an application.')],['Записать список','Write the list'])],
  turn:[
   note('К вечеру приходит сообщение от Луки. Он, как всегда, пишет коротко и без точек.','Towards evening a message arrives from Luka. As always he writes briefly and without full stops.'),
   msg(L('Спасибо за помощь с экраном. В следующий раз берём больше стульев.','Thank you for helping with the screen. Next time we take more chairs.')),
   note('Я отвечаю, что принесу свой. Его ответ — одно слово: «Договорились».','I reply that I will bring my own. His answer is one word: “Agreed.”')],turnExit:['Положить телефон','Put the phone down'],
  end:[
   note('Это не событие, но день получился тёплым. Люди, которые пишут мне просто так, — вот что меняет город.','It is not an event, but the day turned out warm. People who write to me for no reason are what changes a city.'),
   note('Я засыпаю с мыслью о стульях, проекторе и кофе. Хорошая мысль для конца недели.','I fall asleep thinking of chairs, a projector and coffee. A good thought for the end of the week.')]});

 // Day 23: a letter from home. Airport pair.
 build(23,{bg:'room-window',time:'19:00',midTime:'20:00',turnTime:'21:30',
  start:[
   note('Мама присылает подробное письмо: обычные новости, смешная история про соседа и осторожный вопрос о планах.','Mum sends a long letter: everyday news, a funny story about a neighbour and a gentle question about my plans.'),
   note('Читаю дважды. В конце приписка от самого близкого человека: «Мы ждём, но не торопим. Просто напиши, как ты».','I read it twice. At the end there is a postscript from the person closest to me: “We are waiting but not hurrying you. Just write how you are.”'),
   contact(['Письмо домой лучше отправлять вечером, когда уже не хочется править каждое слово.','Send a letter home in the evening, when you no longer want to edit every word.'],['Письмо домой лучше отправлять вечером, когда уже не хочется править каждое слово.','Send a letter home in the evening, when you no longer want to edit every word.'],{message:true})],
  options:[
   opt(['Написать о том, что получилось','Write about what has worked'],'practical',{letterHome:'good'},[
    note('Я перечисляю: квартира, друзья, первый заказ, портал, булочная, которая меня узнаёт. Список получается длиннее, чем я думал{a}.','I list: the flat, friends, a first order, the portal, a bakery that recognises me. The list turns out to be longer than I thought.'),
    note('Перечитывая, я понимаю, что меня больше волнует не то, что получилось, а то, что остаётся на потом.','Rereading it, I understand that what worries me is not what has worked but what remains for later.')],['Продолжить письмо','Continue the letter']),
   opt(['Написать о том, чего не хватает','Write about what is missing'],'personal',{letterHome:'missing'},[
    note('Я пишу честно: не хватает голосов, которые не нужно переводить, запаха домашней кухни и привычных улиц.','I write honestly: I miss voices that I do not have to translate, the smell of home cooking and familiar streets.'),
    note('Слова даются легко. Оказывается, тоска — не слабость, а способ сказать, что дом был хорошим.','The words come easily. It turns out that longing is not weakness but a way of saying that home was good.')],['Продолжить письмо','Continue the letter']),
   opt(['Написать коротко и обещать позвонить','Write briefly and promise to call'],'friendship',{letterHome:'call'},[
    note('Я пишу три строки: «Я в порядке. Много нового. Позвоню в воскресенье». Остальное лучше сказать голосом.','I write three lines: “I am fine. Much that is new. I will call on Sunday.” The rest is better said in a voice.'),
    note('Короткое письмо кажется честнее длинного. Я ставлю в календарь воскресенье и пометку «позвонить».','A short letter seems more honest than a long one. I put Sunday in the calendar with a note “call”.')],['Поставить напоминание','Set a reminder'])],
  mid:[
   note('Не буду скрывать: решение остаться или уехать ещё не принято. В письме я пишу именно это, без украшений.','I will not hide it: the decision to stay or go is not yet made. That is exactly what I write in the letter, without decoration.'),
   note('Слова «я ещё не знаю» оказываются самыми трудными и самыми точными. Я не извиняюсь за них.','The words “I do not know yet” turn out to be the hardest and the most precise. I do not apologise for them.'),
   note('За окном темнеет. На подоконнике остывает чай, и тишина в комнате не давит, а слушает.','It grows dark outside. Tea cools on the windowsill, and the quiet in the room does not press; it listens.')],midExit:['Подвинуть чашку','Move the cup'],
  mid2:[
   opt(['Отправить письмо сразу','Send the letter at once'],'personal',{letterSend:'now'},[
    note('Я нажимаю «отправить» раньше, чем успеваю передумать. Сердце стучит так, будто я отправил{a} что-то важное, и это правда.','I press “send” before I can change my mind. My heart pounds as if I had sent something important, and I have.'),
    note('Ответ приходит через несколько минут: «Спасибо, что ты написал{a} честно. Мы рядом». Мне становится легче.','The reply comes within minutes: “Thank you for being honest. We are close.” I feel lighter.')],['Закрыть почту','Close the mail']),
   opt(['Перечитать и отправить утром','Reread it and send it in the morning'],'practical',{letterSend:'morning'},[
    note('Я оставляю письмо в черновиках. Ночью оно не испортится, а утром я прочитаю его чужими глазами.','I leave the letter in drafts. It will not spoil overnight, and in the morning I will read it with fresh eyes.'),
    note('Это не трусость, а привычка: важные решения лучше отправлять на свежую голову.','This is not cowardice but a habit: important decisions are better sent with a fresh head.')],['Выключить свет','Switch off the light'])],
  turn:[
   note('Перед сном телефон коротко вибрирует. Это сообщение от человека из аэропорта, который, кажется, всегда знает, когда написать.','Before bed my phone vibrates briefly. It is a message from a person from the airport who always seems to know when to write.'),
   counter(['Добавь в письмо одну фразу о том, что тебе здесь нравится. Так тебя услышат лучше.','Add one sentence to the letter about what you like here. They will hear you better that way.'],['Добавь в письмо одну фразу о том, что тебе здесь нравится. Так тебя услышат лучше.','Add one sentence to the letter about what you like here. They will hear you better that way.'],{message:true}),
   note('Я добавляю: «Здесь у меня есть двор, в котором оставляют стул». Строка выходит самой тёплой.','I add: “Here I have a courtyard where they keep a chair for me.” The line turns out to be the warmest.')],turnExit:['Перечитать письмо','Reread the letter'],
  end:[
   note('Некоторые вопросы нельзя закрыть быстро. Но их можно перестать бояться.','Some questions cannot be closed quickly. But they can stop being frightening.'),
   note('Дом знает, что я думаю. Я знаю, что дом ждёт. Пока этого достаточно.','Home knows what I think. I know that home is waiting. For now that is enough.')]});

 // Day 24: the month's budget. Asya and Luka.
 build(24,{bg:'document-desk',time:'10:00',midTime:'12:30',turnTime:'17:00',
  start:[
   note('Месяц почти закончился. Пора посмотреть на цифры без драмы.','The month is nearly over. Time to look at the numbers without drama.'),
   note('Я открываю таблицу, которую я начал{a} в первую неделю, и вдруг вижу, как много в ней строк: аренда, связь, проезд, страховка, еда, мелкие траты.','I open the table I started in the first week and suddenly see how many lines it has: rent, phone, transport, insurance, food, small expenses.'),
   L('Резерв на быстрый отъезд — не пессимизм, а спокойствие.','A reserve for a quick departure is not pessimism; it is calm.','thoughtful')],
  options:[
   opt(['Посчитать расходы за месяц','Add up the month’s spending'],'practical',{budgetStep:'spent'},[
    note('Я складываю все суммы, разбираю чеки и выписки. Некоторые строки удивляют: на кофе уходит больше, чем на проезд.','I add up all the sums and go through receipts and statements. Some lines surprise me: more goes on coffee than on transport.'),
    note('Итог не страшный и не радостный, просто точный. Я наконец-то знаю, сколько стоит моя жизнь здесь.','The total is neither frightening nor cheerful, simply accurate. At last I know how much my life here costs.')],['Подчеркнуть итог','Underline the total']),
   opt(['Составить прогноз на следующий месяц','Draw up a forecast for next month'],'explore',{budgetStep:'forecast'},[
    note('Я пишу три столбца: «минимум», «ожидаемо», «если что-то пойдёт не так». Каждый заполняю честно, без оптимизма.','I write three columns: “minimum”, “expected”, “if something goes wrong”. I fill in each honestly, without optimism.'),
    note('Разница между столбцами показывает, где моя уязвимость. Теперь я знаю, какие траты нельзя откладывать.','The difference between the columns shows where I am vulnerable. Now I know which expenses cannot be postponed.')],['Подчеркнуть риски','Underline the risks']),
   opt(['Спросить Луку, где я трачу лишнее','Ask Luka where I spend too much'],'friendship',{budgetStep:'luka'},[
    note('Я отправляю Луке таблицу. Он отвечает через час: «Не трать на то, что не помнишь через неделю».','I send Luka the table. He replies in an hour: “Do not spend on what you will not remember in a week.”'),
    note('Простой критерий работает лучше, чем длинный список запретов. Я отмечаю три строки, которые можно сократить.','A simple criterion works better than a long list of prohibitions. I mark three lines that can be reduced.')],['Сохранить совет','Save the advice'])],
  mid:[
   note('Я понимаю, что бюджет — это не про деньги, а про свободу выбора: чем яснее цифры, тем меньше страха.','I understand that a budget is not about money but about freedom of choice: the clearer the figures, the less fear.'),
   note('Я смотрю на строку «резерв» и ловлю себя на том, что она у меня почти пустая. Это неприятно, но честно.','I look at the line “reserve” and notice that it is almost empty. It is unpleasant but honest.'),
   note('Нужно решить, что делать дальше: копить на случай отъезда или вкладывать в то, что строится здесь.','I need to decide what to do next: save in case I leave or invest in what is being built here.')],midExit:['Подумать минуту','Think for a minute'],
  mid2:[
   opt(['Оставить резерв на быстрый отъезд','Keep a reserve for a quick departure'],'practical',{reserve:'yes'},[
    note('Я выделяю отдельную сумму и убираю её с глаз: на отдельный счёт. Она не для трат, а для спокойствия.','I set aside a separate sum and put it out of sight in a separate account. It is not for spending but for peace of mind.'),
    note('Странно, но от этой строки мне легче планировать остальное. Резерв — это не обещание уехать, а свобода остаться без страха.','Strange, but this line makes it easier to plan the rest. A reserve is not a promise to leave but the freedom to stay without fear.')],['Закрыть таблицу','Close the table']),
   opt(['Вложить часть резерва в рабочее дело','Invest part of the reserve in my work'],'explore',{reserve:'invest'},[
    note('Я решаю вложить небольшую часть в то, что приносит результат: курс, программу или рекламу для первых клиентов.','I decide to invest a small part in what brings results: a course, software or advertising for the first clients.'),
    note('Это риск, но небольшой и продуманный. Я записываю сумму и срок, к которому проверю, окупилось ли вложение.','It is a risk, but a small and considered one. I note the sum and the date by which I will check whether it paid off.')],['Закрыть таблицу','Close the table'])],
  turn:[
   note('Вечером мы встречаемся с Асей и Лукой. Я показываю итоговую таблицу, и они делают вид, что смотрят на неё очень серьёзно.','In the evening Asya, Luka and I meet. I show the final table, and they pretend to look at it very seriously.'),
   A('У меня такой резерв уже второй год. Ни разу не пригодился, и я счастлива.','I have had a reserve like that for two years now. It has never been needed, and I am happy about that.','laughing'),
   note('Лука кивает. «Лучшая страховка — та, которая не понадобилась», — говорит он и допивает чай.','Luka nods. “The best insurance is the kind that was never needed,” he says, and finishes his tea.')],turnExit:['Закрыть ноутбук','Close the laptop'],
  end:[
   note('Цифры не ругаются. Они просто показывают, что реально, а что пока желание.','The numbers do not scold. They just show what is real and what is still a wish.'),
   note('Я закрываю таблицу спокойнее, чем открывал{a}: теперь у моего решения будет опора, а не только настроение.','I close the table calmer than I opened it: now my decision will have support, not only a mood.')]});

 // Day 25: an ordinary day. Airport pair.
 build(25,{bg:'belgrade-morning-cafe',time:'10:00',midTime:'13:00',turnTime:'18:00',
  start:[
   note('Сегодня ничего не нужно сдавать. Это тоже день.','Nothing has to be handed in today. That is also a day.'),
   note('Я просыпаюсь без будильника и долго лежу, слушая город: трамвай, голоса, чей-то радиоприёмник. Всё это уже мне знакомо.','I wake without an alarm and lie for a long time listening to the city: a tram, voices, somebody’s radio. All of it is already familiar to me.'),
   contact(['Если хочешь выучить слова, заходи в булочную в одно и то же время. Продавцы быстро запоминают.','If you want to learn the words, go to the bakery at the same time each day. The sellers remember quickly.'],['Если хочешь выучить слова, заходи в булочную в одно и то же время. Продавцы быстро запоминают.','If you want to learn the words, go to the bakery at the same time each day. The sellers remember quickly.'])],
  options:[
   opt(['Пойти в булочную, где меня узнают','Go to the bakery where they recognise me'],'personal',{ordinary:'bakery'},[
    note('Продавщица кивает мне, как старому знакомому, и без вопросов откладывает ту самую булочку. Я не помню, когда стал{a} постоянным клиентом.','The shop assistant nods to me like an old acquaintance and sets aside that very roll without asking. I do not remember when I became a regular.'),
    note('Мы обмениваемся тремя фразами по-сербски. Я понимаю две, отвечаю на одну и счастлив{a} на все три.','We exchange three phrases in Serbian. I understand two, answer one and am happy about all three.')],['Выйти с булочкой','Walk out with the roll']),
   opt(['Заглянуть на рынок','Look into the market'],'explore',{ordinary:'market'},[
    note('На рынке я без карты нахожу ряд с зеленью, потом с сыром и потом — тот самый, где продают мёд. Ноги сами запомнили дорогу.','At the market I find, without a map, the row with herbs, then the one with cheese and then the one where honey is sold. My feet remembered the way themselves.'),
    note('Продавец называет цену и добавляет что-то о погоде. Я киваю, делая вид, что понял{a} каждое слово, и он улыбается.','The seller names a price and adds something about the weather. I nod as if I had understood every word, and he smiles.')],['Убрать покупки в сумку','Put the shopping in the bag']),
   opt(['Прогуляться в парке','Take a walk in the park'],'personal',{ordinary:'park'},[
    note('В парке тихо: старики играют в шахматы, дети гоняют голубей, собака тащит хозяйку к фонтану.','The park is quiet: old men play chess, children chase pigeons, a dog drags its owner towards the fountain.'),
    note('Я сажусь на лавочку и читаю вывески вслух. Каждая понятная вывеска — маленькая победа.','I sit on a bench and read the signs aloud. Every sign I understand is a small victory.')],['Встать и размять ноги','Stand up and stretch'])],
  mid:[
   note('Сербские слова, которые я учил{a}, начинают складываться во фразы. Не идеально, но достаточно, чтобы быть понятым.','The Serbian words I have been learning begin to form sentences. Not perfectly, but well enough to be understood.'),
   note('Я ловлю себя на том, что думаю по-сербски: «хлеб», «молоко», «до свидания». Слова приходят сами, раньше я их искал{a}.','I catch myself thinking in Serbian: “bread”, “milk”, “goodbye”. The words come by themselves; before, I had to look for them.'),
   note('Мне нравится не только то, что я знаю язык лучше. Мне нравится, что в этом нет ничего срочного.','What I like is not only that I know the language better. I like that there is nothing urgent about it.')],midExit:['Остановиться и улыбнуться','Stop and smile'],
  mid2:[
   opt(['Заговорить по-сербски с незнакомым человеком','Speak Serbian to a stranger'],'explore',{talkSerbian:'stranger'},[
    note('Я спрашиваю у прохожего дорогу на сербском. Он отвечает медленно, понимая, что я учусь, и даже показывает рукой.','I ask a passer-by for directions in Serbian. He answers slowly, understanding that I am learning, and even points with his hand.'),
    note('Я благодарю и иду дальше. Только через квартал замечаю, что мне вовсе не нужно было в ту сторону.','I thank him and walk on. Only a block later do I notice that I did not need to go that way at all.')],['Улыбнуться себе','Smile to myself']),
   opt(['Послушать, как говорят другие','Listen to how others speak'],'personal',{talkSerbian:'listen'},[
    note('Я сажусь у фонтана и слушаю: разговоры, смех, споры. Слова текут быстро, но отдельные фразы уже ловятся.','I sit by the fountain and listen: conversations, laughter, arguments. The words flow quickly, but individual phrases are already catchable.'),
    note('Слушать оказывается не менее полезно, чем говорить. Я записываю в блокнот три новых выражения.','Listening turns out to be as useful as speaking. I write three new expressions in my notebook.')],['Закрыть блокнот','Close the notebook'])],
  turn:[
   note('К вечеру я встречаю знакомых в сквере. Мы идём вместе, и разговор складывается из слов сразу двух языков.','Towards evening I meet acquaintances in the square. We walk together, and the conversation is made of words from two languages at once.'),
   counter(['На рынке начинай с приветствия по-сербски. Разговор сразу получается теплее.','At the market, begin with a greeting in Serbian. The conversation gets warmer at once.'],['На рынке начинай с приветствия по-сербски. Разговор сразу получается теплее.','At the market, begin with a greeting in Serbian. The conversation gets warmer at once.']),
   note('Я смеюсь: так я сегодня и сделал{a}. Приятно, когда советы совпадают с тем, что ты уже сам{a} придумал{a}.','I laugh: that is just what I did today. It is pleasant when advice matches what you have already found yourself.')],turnExit:['Пойти дальше вместе','Walk on together'],
  end:[
   note('Если это рутина, то она мне нравится.','If this is routine, I like it.'),
   note('Привычка — тоже форма принадлежности. Я больше не гость, но ещё не хозяин: я просто живу.','A habit is also a form of belonging. I am no longer a guest but not yet a host: I simply live here.')]});

 // Day 26: if no answer comes. Hosts pair.
 build(26,{bg:'dorcol-apartment',time:'09:30',midTime:'12:00',turnTime:'18:00',extra:{districtBg:true},
  start:[
   note('До тридцатого дня остаётся мало времени, а ответа по заявлению нет.','There is little time left before day thirty, and there is no answer to my application.'),
   note('Я больше не смотрю на статус каждый час. Но ответ, которого нет, давит сильнее любого ответа.','I no longer look at the status every hour. But an answer that is missing presses harder than any answer.'),
   owner(['Если придётся уехать раньше срока, скажи заранее. Мы договоримся о залоге.','If you have to leave before the term ends, tell me in advance. We will agree about the deposit.'],['Если придётся уехать раньше срока, скажи заранее. Мы договоримся о залоге.','If you have to leave before the term ends, tell me in advance. We will agree about the deposit.'])],
  options:[
   opt(['Записать план «ответ пришёл вовремя»','Write the plan “the answer came in time”'],'practical',{twoPlans:'answer'},[
    note('Я пишу, что делаю, если ответ положительный: проверяю документы, оплачиваю то, что нужно, продлеваю договор и жильё.','I write what I do if the answer is positive: I check the documents, pay what is required, extend the lease and the housing.'),
    note('Список выходит коротким и светлым. Я напоминаю себе, что даже хороший ответ — это начало новых дел, а не конец забот.','The list comes out short and bright. I remind myself that even a good answer is the start of new tasks, not the end of worries.')],['Перейти к следующему плану','Move on to the next plan']),
   opt(['Записать план «ответа нет»','Write the plan “there is no answer”'],'practical',{twoPlans:'silence'},[
    note('Я пишу, что делаю, если ответа к тридцатому дню нет: проверяю статус по официальному каналу, уточняю, что я могу делать до ответа, а чего нельзя.','I write what I do if there is no answer by day thirty: I check the status through the official channel and confirm what I may do before the answer and what I may not.'),
    note('Я не делаю предположений, а записываю вопросы. План — это не прогноз, а список проверок.','I do not make assumptions; I write questions. A plan is not a forecast but a list of checks.')],['Перейти к следующему плану','Move on to the next plan']),
   opt(['Собрать оба плана в одну таблицу','Put both plans into one table'],'explore',{twoPlans:'table'},[
    note('Я чертю таблицу с двумя столбцами: «ответ есть» и «ответа нет». В строках — жильё, деньги, работа, люди, дата.','I draw a table with two columns: “there is an answer” and “there is no answer”. In the rows: housing, money, work, people, date.'),
    note('Половина клеток совпадает. Эта половина и есть то, что можно делать уже сегодня.','Half the cells coincide. That half is what can be done today.')],['Подчеркнуть общие клетки','Underline the shared cells'])],
  mid:[
   note('Я не принимаю решение за ответ: я готовлюсь к обоим. Тогда любой исход перестаёт быть угрозой и становится одним из вариантов.','I do not let the answer decide for me: I prepare for both. Then any outcome stops being a threat and becomes one of the options.'),
   note('Я записываю дату: в этот день решаю, что делать, даже если письма нет. Решение — моё, а не почтовое.','I write down a date: on that day I decide what to do even if there is no letter. The decision is mine, not the post’s.'),
   note('Это не отказ от надежды, а способ не зависеть только от неё.','This is not giving up hope but a way of not depending on it alone.')],midExit:['Закрыть таблицу','Close the table'],
  mid2:[
   opt(['Выяснить, как оформить отъезд без нарушений','Find out how to leave without breaking the rules'],'practical',{exitPlan:'leave'},[
    note('Я ищу на официальных страницах, как правильно выехать, что сделать с регистрацией и какие бумаги сохранить. Информация сухая, но надёжная.','On the official pages I look up how to leave properly, what to do about the registration and which papers to keep. The information is dry but reliable.'),
    note('Я записываю три шага и срок. Чем яснее правила, тем меньше страх нарушить их случайно.','I write down three steps and a deadline. The clearer the rules, the less I fear breaking them by accident.')],['Сохранить ссылки','Save the links']),
   opt(['Выяснить, как проверить статус заявления','Find out how to check the application status'],'practical',{exitPlan:'status'},[
    note('Я проверяю, куда можно обратиться, если ответа нет: номер обращения, адрес, часы приёма. Всё это записываю на одном листе.','I check where I can turn if there is no answer: the reference number, the address, opening hours. I note it all on one sheet.'),
    note('Лист уезжает в папку на самый верх. Если письма не будет, я буду знать, куда идти и что говорить.','The sheet goes to the top of the folder. If no letter comes, I will know where to go and what to say.')],['Закрыть папку','Close the folder'])],
  turn:[
   note('Вечером на кухне собираются оба хозяина. Я показываю таблицу, и они читают её так внимательно, будто это их собственный план.','In the evening both hosts gather in the kitchen. I show the table, and they read it as attentively as if it were their own plan.'),
   neighbour(['А если ответ придёт хороший, отметим вместе. Это тоже план.','And if the answer is good, we will celebrate together. That is a plan too.'],['А если ответ придёт хороший, отметим вместе. Это тоже план.','And if the answer is good, we will celebrate together. That is a plan too.']),
   note('Я улыбаюсь. В моей таблице не хватало этой строки: «отметить».','I smile. My table lacked that line: “celebrate”.')],turnExit:['Добавить строку','Add the line'],
  end:[
   note('С двумя планами тишина в почте перестаёт быть угрозой.','With two plans, silence in my inbox stops being a threat.'),
   note('Я не знаю, какой ответ придёт. Зато знаю, что мне делать в любом случае.','I do not know which answer will come. But I know what to do in every case.')]});

 // Day 27: the ticket. Asya and Luka.
 build(27,{bg:'room-window',time:'18:00',midTime:'19:00',turnTime:'20:30',
  start:[
   note('Обратный билет можно изменить, но условия зависят от тарифа. Я так давно не открывал{a} письмо с бронью, что почти забыл{a}, как оно выглядит.','The return ticket can be changed, but the conditions depend on the fare. I have not opened the booking email for so long that I have almost forgotten what it looks like.'),
   note('Дата вылета приближается. Не катастрофа, но и не пустяк: билет лежит в почте как напоминание о том, что у выбора есть срок.','The departure date is approaching. Not a catastrophe, but not a trifle: the ticket lies in my inbox as a reminder that a choice has a deadline.'),
   L('Я проверил: у многих тарифов дату можно сменить за небольшую плату. Это не повод торопиться.','I checked: many fares allow a change of date for a small fee. That is no reason to hurry.','thoughtful')],
  options:[
   opt(['Проверить условия обмена и возврата','Check the terms for changes and refunds'],'practical',{ticketStep:'terms'},[
    note('Я читаю правила тарифа: что можно менять, за сколько часов до вылета и какая комиссия. Таблица с условиями оказывается неожиданно понятной.','I read the fare rules: what can be changed, how many hours before departure and what the fee is. The table of terms turns out to be surprisingly clear.'),
    note('Я выписываю последний день, когда можно изменить билет без больших потерь. Он выпадает на самое неудобное число — на двадцать девятый день.','I write down the last day on which the ticket can be changed without a big loss. It falls on the most inconvenient date: day twenty-nine.')],['Отметить дату','Mark the date']),
   opt(['Сравнить даты на ближайшие недели','Compare dates for the coming weeks'],'explore',{ticketStep:'dates'},[
    note('Я смотрю расписание рейсов на соседние даты. Цены скачут, но принципиальной разницы нет: день-два — не вопрос денег, а вопрос решения.','I look at flight schedules for neighbouring dates. Prices jump around, but there is no fundamental difference: a day or two is not a question of money but of decision.'),
    note('Я записываю три варианта и ничего не покупаю. Сначала решение, потом билет, а не наоборот.','I write down three options and buy nothing. First the decision, then the ticket, not the other way round.')],['Закрыть вкладки','Close the tabs']),
   opt(['Узнать цену нового билета','Find out the price of a new ticket'],'practical',{ticketStep:'price'},[
    note('Я проверяю цену билета в обе стороны на случай, если придётся лететь по-другому. Цифра неприятная, но не смертельная.','I check the price of a ticket both ways in case I have to fly differently. The figure is unpleasant but not deadly.'),
    note('Теперь у меня есть число, а не страх. Я записываю его рядом с резервом, чтобы видеть сразу оба значения.','Now I have a number, not a fear. I write it next to the reserve so that I can see both values together.')],['Сохранить цену','Save the price'])],
  mid:[
   note('Билет — просто бумага с датой, а дата — просто число. Выбор по-прежнему мой, и от него ничего не зависит больше, чем от меня.','A ticket is just a paper with a date, and a date is just a number. The choice is still mine, and nothing depends on it more than on me.'),
   note('Я ловлю себя на том, что не хочу, чтобы билет решал за меня. Ни в одну сторону.','I catch myself not wanting the ticket to decide for me. In either direction.'),
   note('Нужно просто выбрать, что делать с датой, пока она не стала решением.','I simply have to choose what to do with the date before it becomes a decision.')],midExit:['Подумать минуту','Think for a minute'],
  mid2:[
   opt(['Пока не менять билет','Leave the ticket as it is for now'],'personal',{ticketPlan:'keep'},[
    note('Я решаю ничего не менять, пока не придёт ответ или не наступит последний день для изменения. До этого билет просто лежит.','I decide to change nothing until the answer arrives or the last day for changes comes. Until then the ticket simply lies there.'),
    note('Странно, но от этого решения становится легче: я не тороплю судьбу и не убегаю от неё.','Strange, but this decision brings relief: I am neither hurrying fate nor running away from it.')],['Закрыть письмо','Close the email']),
   opt(['Перенести дату на более позднюю','Move the date to a later one'],'practical',{ticketPlan:'later'},[
    note('Я переношу дату на неделю: платить приходится немного, зато получается больше времени. Подтверждение приходит на почту.','I move the date by a week: it costs little, and it gives me more time. The confirmation arrives by email.'),
    note('Это ничего не решает, но даёт воздух. Я записываю новую дату красным рядом с тридцатым днём.','This decides nothing but gives me air. I write the new date in red beside day thirty.')],['Сохранить подтверждение','Save the confirmation'])],
  turn:[
   note('Вечером мы встречаемся у Аси, и я показываю цифры и даты. Ася слушает, не перебивая, и только потом задаёт вопрос.','In the evening we meet at Asya’s, and I show her the figures and dates. Asya listens without interrupting and only then asks a question.'),
   A('Билет — это страховка, а не приговор.','A ticket is insurance, not a sentence.','laughing'),
   note('Лука кивает: «Именно». Больше ничего добавлять не нужно.','Luka nods: “Exactly.” Nothing more needs adding.')],turnExit:['Допить чай','Finish the tea'],
  end:[
   note('Билет — просто бумага с датой, а дата — просто число. Выбор по-прежнему мой.','A ticket is just a paper with a date, and a date is just a number. The choice is still mine.'),
   note('Завтра — последний вечер перед решающими днями. Я хочу провести его с людьми, а не с таблицами.','Tomorrow is the last evening before the deciding days. I want to spend it with people, not with tables.')]});

 // Day 28: the people nearby. Asya and Luka; nobody pushes a choice.
 build(28,{bg:'courtyard-after-film',time:'19:00',midTime:'20:30',turnTime:'22:00',
  start:[
   note('Накануне решающих дней я встречаюсь с теми, кто стал мне близок, и не прощаюсь ни с кем.','On the eve of the deciding days I meet those who have become close, and I say goodbye to no one.'),
   note('Двор тот же, но выглядит по-новому: гирлянды висят ниже, чем помнится, а стулья стоят теснее. Кто-то уже поставил чайник.','The courtyard is the same but looks new: the garlands hang lower than I remember and the chairs stand closer. Someone has already put the kettle on.'),
   A('Мы не будем говорить о выборе. Мы будем есть печенье.','We are not going to talk about the choice. We are going to eat biscuits.','laughing')],
  options:[
   opt(['Помочь расставить стулья','Help set out the chairs'],'practical',{lastEvening:'chairs'},[
    note('Я расставляю стулья: ровно, потом неровно, потому что так уютнее. Ася делает вид, что не замечает.','I set out the chairs: straight, then crooked, because it is cosier that way. Asya pretends not to notice.'),
    note('Кто-то из соседей приносит ещё три, и мы с хохотом строим из них полукруг.','One of the neighbours brings three more, and with laughter we build them into a half circle.')],['Сесть на свой стул','Sit on my own chair']),
   opt(['Принести чай и сладкое','Bring tea and something sweet'],'friendship',{lastEvening:'tea'},[
    note('Я приношу чай из дома и коробку сладостей из той самой пекарни. Все хвалят сладости и совершенно не замечают чай.','I bring tea from home and a box of sweets from that very bakery. Everyone praises the sweets and entirely ignores the tea.'),
    note('Лука незаметно наливает мне чашку и кивает: «Твой чай всё-таки лучше». Это самое тёплое признание за вечер.','Luka quietly pours me a cup and nods: “Your tea is better after all.” It is the warmest compliment of the evening.')],['Сесть рядом','Sit nearby']),
   opt(['Сесть и просто слушать','Sit down and simply listen'],'personal',{lastEvening:'listen'},[
    note('Я сажусь с краю и слушаю разговоры: про фильмы, про цены на овощи, про соседского кота, который снова сбежал.','I sit at the edge and listen to the conversations: about films, about vegetable prices, about the neighbours’ cat that has run away again.'),
    note('Нет ничего важного, и от этого всё важно. Мне нравится, что для меня никто ничего не придумывает.','Nothing is important, and so everything is. I like that nobody is inventing anything for me.')],['Придвинуть стул','Draw up my chair'])],
  mid:[
   note('Мы пьём чай, смеёмся и не говорим о выборе. Но каждый по-своему показывает, что мне здесь рады.','We drink tea, laugh and do not speak about the choice. But each shows in their own way that I am welcome here.'),
   note('Ася рассказывает историю о своём первом месяце. Лука поправляет детали и добавляет цифры, которых никто не просил.','Asya tells a story about her first month. Luka corrects the details and adds figures nobody asked for.'),
   note('Я слушаю и вдруг понимаю, что мне не нужно решать сегодня. Сегодня достаточно быть здесь.','I listen and suddenly understand that I do not have to decide today. Today it is enough to be here.')],midExit:['Допить чай','Finish the tea'],
  mid2:[
   opt(['Не говорить о выборе','Not speak about the choice'],'personal',{lastTalk:'silent'},[
    note('Я держу слово: о выборе нет ни слова. Вместо этого мы обсуждаем, какой фильм смотреть в следующую субботу.','I keep my word: not a word about the choice. Instead we discuss which film to watch next Saturday.'),
    note('Следующая суббота звучит как обещание, которое никто не давал вслух. Мне нравится, что оно существует и ничего не требует.','Next Saturday sounds like a promise nobody gave aloud. I like that it exists and demands nothing.')],['Предложить фильм','Suggest a film']),
   opt(['Сказать, что я ещё не решил{a}','Say that I have not decided yet'],'personal',{lastTalk:'open'},[
    note('Я говорю коротко: «Я ещё не решил{a}. Но я рад{a}, что вы рядом». Ася не отвечает, она просто подвигает мне тарелку с печеньем.','I say it briefly: “I have not decided yet. But I am glad you are here.” Asya does not answer; she simply pushes the plate of biscuits towards me.'),
    note('Никто не просит объяснений. Решение остаётся моим, и никто не пытается его забрать.','Nobody asks for explanations. The decision remains mine, and nobody tries to take it.')],['Взять печенье','Take a biscuit'])],
  turn:[
   note('Когда двор пустеет, Лука остаётся помогать со стульями. Он несёт два сразу и не комментирует.','When the courtyard empties, Luka stays to help with the chairs. He carries two at a time and makes no comment.'),
   L('Но если захочешь поговорить, стулья уже стоят.','But if you want to talk, the chairs are already out.','friendly'),
   note('Я киваю. Между нами нет ничего недосказанного, только пауза, которая никого не тяготит.','I nod. Between us there is nothing left unsaid, only a pause that weighs on no one.')],turnExit:['Помочь убрать чашки','Help clear the cups'],
  end:[
   note('Я возвращаюсь с ощущением, что решение не будет одиноким, каким бы оно ни оказалось.','I walk back feeling that the decision will not be a lonely one, whatever it turns out to be.'),
   note('Завтра начнутся решающие дни. Сегодня мне просто тепло.','Tomorrow the deciding days begin. Tonight I am simply warm.')]});
}
