// Saturday. The courtyard is a shared evening, not a reward for a permit.
export const CHAPTER_SIX_TRANSLATIONS={};
const T=(ru,en)=>(CHAPTER_SIX_TRANSLATIONS[ru]=en,ru);
export function extendSixthChapter({NODES:N,JOURNAL:J,BACKGROUNDS:B,n,y,msg,scene}){
 const a=(text,emotion='friendly')=>({speaker:'Ася',character:'asya',emotion,text});
 const l=(text,emotion='friendly')=>({speaker:'Лука',character:'luka',emotion,text});
 const c=(nikola,milica,emotion='friendly')=>({speaker:'contact',text:milica,contactText:{nikola,milica},emotion});
 const out=label=>({kind:'tap',label,object:label});
 const s=(pages,next,extra={})=>scene(pages,next,{bg:'courtyard-cinema',location:T('БЕЛГРАД · ДВОРОВОЙ ПОКАЗ','BELGRADE · COURTYARD SCREENING'),time:'19:20',day:T('СУББОТА','SATURDAY'),exitAction:out(T('Продолжить вечер','Continue the evening')),...extra});
 const help=(projector,screen,snacks)=>({speaker:'narrator',text:projector,cinemaHelpText:{projector,screen,snacks}});
 const film=(warm,strange)=>({speaker:'narrator',text:warm,filmText:{warm,strange}});
 const documents=(submitted,review)=>({speaker:'narrator',text:review,documentText:{submitted,review}});
 for(const [id,label,description]of [
  ['courtyard-cinema',T('ДВОР · ПЕРЕД ПОКАЗОМ','COURTYARD · BEFORE THE SCREENING'),T('Белградский двор с гирляндами, белым экраном и стульями перед вечерним показом','A Belgrade courtyard with string lights, a white screen and chairs before an evening screening')],
  ['courtyard-after-film',T('ДВОР · ПОСЛЕ ФИЛЬМА','COURTYARD · AFTER THE FILM'),T('Тихий двор после фильма, тёплые гирлянды и свободные стулья','A quiet courtyard after the film, with warm string lights and empty chairs')],
  ['belgrade-night-walk',T('БЕЛГРАД · НОЧНАЯ ПРОГУЛКА','BELGRADE · NIGHT WALK'),T('Освещённая белградская улица после летнего вечера, открытые окна и спокойный свет','A lit Belgrade street after a summer evening, with open windows and gentle light')]
 ])B[id]={label,description,position:id==='courtyard-after-film'?'50% 60%':'50% 42%'};
 Object.assign(J,{
  courtyard_screening:{title:T('Кино между домами','Cinema between the houses'),tag:T('ЛЮДИ · СУББОТА','PEOPLE · SATURDAY'),text:T('Соседи устроили показ во дворе. Получилось выбрать свою небольшую работу: настроить проектор, закрепить экран или расставить еду. Теперь этот вечер связан не только с приглашением, но и с моим участием.','The neighbours held a courtyard screening. I chose a small job: setting up the projector, securing the screen or arranging the food. The evening is now connected with my participation as well as an invitation.')},
  cinema_personal:{title:T('Когда включили свет','When the lights came on'),tag:T('ОТНОШЕНИЯ · СВОЙ ТЕМП','RELATIONSHIPS · MY OWN PACE'),text:T('После фильма можно было остаться с человеком из аэропорта, с Асей, с Лукой или со всей компанией. Симпатия не обязывала к поцелую: получилось сказать, какой близости хочется сейчас.','After the film, I could stay with the person from the airport, Asya, Luka or the whole group. Attraction did not require a kiss: I could say how much closeness I wanted now.')},
  plans_without_oath:{title:T('План без клятвы','A plan without a promise'),tag:T('ДАЛЬШЕ · МОЙ ВЫБОР','NEXT · MY CHOICE'),text:T('Планы на ближайшую неделю, на лето или пока открытый горизонт — разные ответы, и каждый можно пересмотреть. Окончательное решение остаться в Сербии или уехать в этой главе не принимается.','Plans for the coming week, for the summer or an open horizon are different answers, and each can be reconsidered. This chapter does not decide whether I will ultimately stay in Serbia or leave.')}
 });
 Object.assign(N,{
  courtyard_invite:s([
   n(T('К субботе у города появляется знакомый маршрут: булочная, поворот у зелёной двери, двор с двумя упрямыми котами. Я уже не проверяю карту на каждом перекрёстке.','By Saturday, the city has a familiar route: the bakery, the turn by the green door, the courtyard with two stubborn cats. I no longer check the map at every junction.')),
   msg(T('Ася','Asya'),T('«Сегодня кино. Вход через арку, потом на звук удлинителя, который опять не дотягивается. Очень ждём».','‘Cinema tonight. Through the arch, then follow the sound of the extension lead failing to reach again. We are looking forward to seeing you.’')),
   documents(T('Подтверждение подачи я сохраняю в папку и закрываю её. Решение ещё впереди. Вечер не обязан ждать вместе со мной.','I save the submission confirmation in its folder and close it. The decision is still ahead. My evening does not have to wait with me.'),T('Открытые вопросы по документам остаются в заметке. Я ставлю напоминание вернуться к ним после выходных и убираю телефон.','The unanswered paperwork questions stay in my notes. I set a reminder to return to them after the weekend and put my phone away.'))
  ],'courtyard_pack',{bg:'room-window',time:'18:10',exitAction:out(T('Ответить, что приду','Say that I will come'))}),
  courtyard_pack:s([
   n(T('Во дворе уже двигают стулья. Ася придерживает дверцу шкафа, из которого торчат провода и пакет с прищепками.','Chairs are already being moved in the courtyard. Asya holds open a cupboard with cables and a bag of clothes pegs sticking out.')),
   a(T('На афише мы написали «вечер короткого метра». Потому что длинный кабель не нашли.','The poster says “an evening of short films”. Because we could not find a long cable.'),'laughing'),
   l(T('Сначала подготовим площадку. Выбирай, к чему хочется приложить руки.','First, let us get the place ready. Choose where you would like to help.'))
  ],null,{choices:[
   {label:T('Помочь с проектором и звуком','Help with the projector and sound'),tone:'practical',next:'cinema_projector',effect:{cinemaHelp:'projector'}},
   {label:T('Закрепить экран с Асей','Secure the screen with Asya'),tone:'friendship',next:'cinema_screen',effect:{cinemaHelp:'screen'}},
   {label:T('Расставить еду и оставить места для новичков','Set out the food and leave seats for newcomers'),tone:'friendship',next:'cinema_snacks',effect:{cinemaHelp:'snacks'}}
  ]}),
  cinema_projector:s([
   n(T('Лука показывает кабели. Один похож на нужный, другой оказывается нужным. Приходится признать, что внешность здесь тоже обманчива.','Luka shows me the cables. One looks right; the other turns out to be right. I have to admit that appearances are misleading here too.')),
   l(T('Не спеши. Я подержу свет, а ты проверь картинку. В худшем случае посмотрим кино про загрузку.','Take your time. I will hold the light while you check the picture. At worst, we will watch a film about loading.'),'laughing'),
   n(T('На белом полотне появляется ровный прямоугольник. Я подкручиваю резкость, пока лица не перестают быть облаками.','An even rectangle appears on the white screen. I adjust the focus until the faces stop looking like clouds.'))
  ],'cinema_ready',{exitAction:{kind:'checklist',label:T('Проверить показ до прихода гостей','Check the setup before the guests arrive'),items:[T('Картинка в фокусе','Picture in focus'),T('Звук слышен с заднего ряда','Sound reaches the back row'),T('Проход свободен от кабелей','Walkway clear of cables')],effect:{cinemaSetupChecked:true}}}),
  cinema_screen:s([
   a(T('У этой простыни было много планов на жизнь. Теперь она — большой экран. Почти как мы, только лучше гладится.','This sheet had many plans for its life. Now it is a big screen. Almost like us, only easier to iron.'),'laughing'),
   n(T('Мы натягиваем полотно и отходим посмотреть. Один угол всё ещё упрямо смотрит вниз.','We stretch the sheet and step back to look. One corner is still stubbornly pointing down.')),
   y(T('Кажется, у него авторская позиция. Давай ещё одну прищепку.','It seems to have an artistic opinion. Let us use one more peg.')),
   a(T('Вот теперь можно показывать серьёзное кино. Экран перестал изображать парус.','Now we can show serious cinema. The screen has stopped pretending to be a sail.'))
  ],'cinema_ready',{character:'asya',exitAction:{kind:'checklist',label:T('Подготовить экран','Prepare the screen'),items:[T('Закрепить верхние углы','Secure the top corners'),T('Натянуть полотно','Stretch the sheet'),T('Убрать прищепки с дорожки','Clear the pegs from the path')],effect:{cinemaSetupChecked:true}}}),
  cinema_snacks:s([
   n(T('На столе уже есть хлеб, фрукты и коробка домашнего печенья. Я раскладываю салфетки и отодвигаю хрупкие стаканы от края.','The table already holds bread, fruit and a box of homemade biscuits. I set out napkins and move the delicate glasses away from the edge.')),
   a(T('Оставим пару мест с краю. Когда приходишь впервые, иногда хочется сначала посидеть рядом с выходом.','Let us leave a couple of seats at the edge. When you come for the first time, sometimes you want to sit near the exit.'),'thoughtful'),
   n(T('Я понимаю её раньше, чем успеваю что-нибудь ответить. И ставлю туда ещё две чашки.','I understand before I have time to say anything. And put two more cups there.'))
  ],'cinema_ready',{character:'asya',exitAction:{kind:'checklist',label:T('Закончить стол для гостей','Finish the guests’ table'),items:[T('Вода и чистые чашки','Water and clean cups'),T('Салфетки рядом с едой','Napkins beside the food'),T('Свободные места у края','Free seats at the edge')],effect:{cinemaSetupChecked:true}}}),
  cinema_ready:s([
   help(T('Первый зритель хвалит чёткую картинку. Я киваю так, будто проекторы всю жизнь слушались меня с первого раза.','The first viewer praises the clear picture. I nod as though projectors have always obeyed me on the first attempt.'),T('Лёгкий ветер касается полотна, но экран остаётся ровным. Ася незаметно показывает мне большой палец.','A light breeze touches the sheet, but the screen stays straight. Asya discreetly gives me a thumbs-up.'),T('Двое людей останавливаются у входа. Я показываю свободные стулья, и они сразу перестают выглядеть случайными прохожими.','Two people pause at the entrance. I point to the free chairs, and they immediately stop looking like accidental passers-by.')),
   n(T('Кто-то здоровается со мной по имени. Мне нужна секунда, чтобы понять: это уже не случайность и не вежливость на один раз.','Someone greets me by name. It takes me a moment to realise: this is no longer an accident or a one-off courtesy.')),
   a(T('Всё, ты теперь соучастник. Если фильм окажется странным, ответственность коллективная.','That is it. You are an accomplice now. If the film turns out to be strange, we share the responsibility.'),'laughing')
  ],'cinema_film_vote',{journal:['courtyard_screening'],exitAction:out(T('Выбрать фильм вместе с остальными','Choose a film with the others'))}),
  cinema_film_vote:s([
   l(T('У нас два коротких фильма. Один про людей, которые опоздали на поезд. Другой — про дом, в котором спорят двери.','We have two short films. One is about people who miss a train. The other is about a house where the doors argue.')),
   a(T('Я за двери. Их конфликт хотя бы можно смазать. Но голосование честное.','I vote for the doors. At least you can oil their conflict. But it is a fair vote.'),'laughing'),
   n(T('Я поднимаю руку, хотя никто не знает, что для меня это тоже маленькое событие: голосовать здесь за что-нибудь, кроме тарифа.','I raise my hand, though nobody knows that this is a small occasion for me too: voting here for something other than an account plan.'))
  ],null,{choices:[
   {label:T('Выбрать тёплую историю про опоздавших людей','Choose the warm story about the people who miss their train'),tone:'personal',next:'cinema_warm',effect:{cinemaFilm:'warm'}},
   {label:T('Поддержать странный фильм про спорящие двери','Support the strange film about the arguing doors'),tone:'explore',next:'cinema_strange',effect:{cinemaFilm:'strange'}}
  ]}),
  cinema_warm:s([
   n(T('На экране двое незнакомцев остаются на пустой станции. Сначала спорят, кто виноват. Потом делят слишком большую булочку.','On screen, two strangers are left at an empty station. First they argue about whose fault it is. Then they share an oversized bun.')),
   a(T('Ладно. Булочка — убедительный драматургический приём. Принимается.','All right. A bun is a persuasive dramatic device. Accepted.'),'laughing'),
   n(T('Я смеюсь вместе с остальными. У истории ещё не случился счастливый конец, но смотреть её уже хорошо.','I laugh with the others. The story has not reached a happy ending yet, but it already feels good to watch.'))
  ],'cinema_dark',{exitAction:out(T('Устроиться перед экраном','Settle in front of the screen'))}),
  cinema_strange:s([
   n(T('Одна дверь на экране скрипит по вторникам, другая принципиально не впускает дождь. Сюжета пока немного, зато характеры убедительные.','One door on screen squeaks on Tuesdays; another refuses to let the rain in on principle. There is not much plot yet, but the characters are convincing.')),
   a(T('Вот. Иногда достаточно найти людей, которые тоже понимают, почему это смешно.','There. Sometimes all you need is to find people who also understand why it is funny.'),'laughing'),
   n(T('Лука тихо смеётся рядом. Странный фильм неожиданно оказывается самым простым разговором за неделю.','Luka laughs quietly nearby. The strange film unexpectedly becomes the simplest conversation of the week.'))
  ],'cinema_dark',{exitAction:out(T('Остаться смотреть вместе','Stay and watch together'))}),
  cinema_dark:s([
   n(T('Гирлянды приглушают. Кто-то передаёт печенье через ряд, во дворе становится тихо. Из открытого окна наверху всё равно слышно, как моют посуду.','The string lights are dimmed. Someone passes biscuits along a row, and the courtyard falls quiet. From an open window above, I can still hear someone washing dishes.')),
   film(T('В фильме поезд наконец приходит. Но герои не сразу встают со скамейки. Я понимаю их без перевода.','In the film, the train finally arrives. But the characters do not get up from their bench straight away. I understand them without a translation.'),T('Двери на экране наконец замолкают. Оказывается, всё это время они спорили, кто первым скажет «добро пожаловать».','The doors on screen finally fall silent. It turns out they had been arguing all along about who would say “welcome” first.')),
   n(T('Я замечаю, что уже несколько минут не проверяю телефон. Папка с документами спокойно переживает это без меня.','I notice that I have not checked my phone for several minutes. The document folder is managing perfectly well without me.'))
  ],'cinema_seat',{time:'20:35',exitAction:out(T('Остаться на разговор после фильма','Stay for the conversation after the film'))}),
  cinema_seat:s([
   n(T('Когда включают свет, никто не спешит расходиться. Стулья разворачиваются друг к другу. Вечер словно получает вторую часть.','When the lights come on, nobody is in a hurry to leave. Chairs turn towards one another. The evening seems to get a second part.')),
   n(T('Можно задержаться рядом с кем-то одним или остаться в общем разговоре. Мне не нужно угадывать правильный ответ.','I can stay beside one person or remain in the group conversation. I do not have to guess the right answer.'))
  ],null,{bg:'courtyard-after-film',time:'21:00',choices:[
   {label:T('Найти человека, с которым познакомились в аэропорту','Find the person I met at the airport'),tone:'explore',next:'cinema_airport',effect:{eveningWith:'companion'}},
   {label:T('Подойти к Асе','Go over to Asya'),tone:'explore',next:'cinema_asya',effect:{eveningWith:'asya'}},
   {label:T('Задержаться рядом с Лукой','Stay beside Luka'),tone:'explore',next:'cinema_luka',effect:{eveningWith:'luka'}},
   {label:T('Остаться со всей компанией','Stay with the whole group'),tone:'friendship',next:'cinema_friends',effect:{eveningWith:'friends',cinemaBond:'friendship'}}
  ]}),
  cinema_airport:s([
   c(T('Помнишь, я обещал что-нибудь вкусное без аэропорта? Получилось даже без очереди.','Remember I promised something delicious away from the airport? This time there is not even a queue.'),T('Я сегодня почти не рисовала. Иногда хочется не запоминать вечер, а просто в нём побыть.','I hardly drew anything today. Sometimes I want to be in an evening rather than record it.')),
   y(T('Я начинаю понимать разницу. И мне нравится, что ты сейчас здесь.','I am beginning to understand the difference. And I like that you are here now.')),
   c(T('Мне тоже. Можно пока никуда не бежать?','So do I. Could we stay put for a little while?'),T('Тогда давай ещё немного не расходиться.','Then let us stay a little longer.'))
  ],null,{bg:'courtyard-after-film',companionPortrait:true,choices:[
   {label:T('«Мне хочется побыть с тобой вдвоём. Как на свидании»','‘I would like some time alone with you. As a date’'),tone:'romance',next:'cinema_airport_close',effect:{cinemaBond:'romance',cinemaAirportBond:'romance'}},
   {label:T('«Пойдём к остальным. Хочу ещё посмеяться вместе»','‘Let us join the others. I would like another laugh together’'),tone:'friendship',next:'cinema_friends',effect:{cinemaBond:'friendship',cinemaAirportBond:'friendship'}}
  ]}),
  cinema_airport_close:s([
   c(T('Мне нравится, как это звучит. Особенно последнее слово.','I like the sound of that. Especially the last word.'),T('Мне хочется того же. И спасибо, что сказал{a} прямо.','I would like that too. And thank you for saying it plainly.'),'flirty'),
   n(T('Мы отходим от общего стола. За спиной всё ещё смеются, но теперь между репликами появляется немного тишины только для нас.','We step away from the group table. People are still laughing behind us, but now there is a little silence between words that belongs only to us.')),
   y(T('Можно я возьму тебя за руку?','May I hold your hand?')),
   c(T('Можно. Я как раз надеялся, что спросишь.','Yes. I was hoping you would ask.'),T('Да. Только давай останемся здесь ещё ненадолго.','Yes. But let us stay here for a little longer.'),'flirty')
  ],null,{bg:'courtyard-after-film',companionPortrait:true,music:'encounter',choices:[
   {label:T('Подать ладонь и остаться рядом','Offer my hand and stay beside them'),tone:'romance',next:'cinema_airport_hand',effect:{cinemaHand:true}},
   {label:T('«Я немного волнуюсь. Давай пока просто поговорим»','‘I am a little nervous. Let us just talk for now’'),tone:'personal',next:'cinema_after',effect:{cinemaHand:false}}
  ]}),
  cinema_airport_hand:s([
   n(T('Пальцы находят удобное положение не сразу. Потом неловкость перестаёт требовать отдельного разговора.','Our fingers take a moment to find a comfortable position. Then the awkwardness no longer needs a conversation of its own.')),
   c(T('Удивительно. Для этого не понадобилось ни одной копии паспорта.','Amazing. This did not require a single passport copy.'),T('Вот так. Теперь можно смотреть на звёзды и не придумывать, куда деть руки.','There. Now we can look at the stars without wondering what to do with our hands.'),'laughing'),
   n(T('Я смеюсь и остаюсь ближе. Сегодня не хочется превращать хорошую минуту в обещание на всю жизнь.','I laugh and stay closer. Tonight I do not want to turn a good minute into a lifelong promise.'))
  ],'cinema_after',{bg:'courtyard-after-film',companionPortrait:true,music:'encounter',journal:['cinema_personal'],exitAction:out(T('Дослушать вечер вместе','Let the evening unfold together'))}),
  cinema_asya:s([
   a(T('Ну что, выдержал{a} культурную программу? У нас можно уйти посреди фильма, но придётся забрать с собой кабачок от соседки.','So, did you survive the cultural programme? You can leave halfway through a film here, but you have to take a neighbour’s courgette with you.'),'laughing'),
   y(T('Серьёзные условия членства в сообществе.','Serious conditions for joining the community.')),
   a(T('Зато без испытательного срока. Я рада, что ты здесь.','But there is no probation period. I am glad you are here.'))
  ],null,{bg:'courtyard-after-film',character:'asya',choices:[
   {label:T('«А мне хочется закончить этот вечер с тобой»','‘I would like to finish this evening with you’'),tone:'romance',next:'cinema_asya_close',effect:{cinemaBond:'romance',asyaBond:'romance'}},
   {label:T('Спросить, чем помочь на следующем показе','Ask how I can help at the next screening'),tone:'friendship',next:'cinema_friends',effect:{cinemaBond:'friendship',asyaBond:'friendship'}}
  ]}),
  cinema_asya_close:s([
   a(T('Тогда я убираю обычную защитную шутку. Ты мне нравишься. Без сноски про полезные знакомства.','Then I am putting away my usual defensive joke. I like you. Without a footnote about useful contacts.'),'flirty'),
   n(T('Она смотрит спокойно, почти удивлённо — будто сама рада, что получилось сказать это без обходного пути.','She looks calm, almost surprised, as though she is glad she managed to say it without taking a detour.')),
   y(T('Ты мне тоже. Хочешь пройтись со мной?','I like you too. Would you like to walk with me?')),
   a(T('Хочу. И можно я возьму тебя за руку, пока мы ещё решаем, куда идти?','Yes. And may I hold your hand while we decide where to go?'),'flirty')
  ],null,{bg:'courtyard-after-film',character:'asya',music:'encounter',choices:[
   {label:T('Улыбнуться и подать ей руку','Smile and offer her my hand'),tone:'romance',next:'cinema_asya_hand',effect:{cinemaHand:true,asyaHand:true}},
   {label:T('«Мне нравится быть рядом. Просто давай чуть медленнее»','‘I like being beside you. Let us just take it a little slower’'),tone:'personal',next:'cinema_after',effect:{cinemaHand:false,asyaHand:false}}
  ]}),
  cinema_asya_hand:s([
   n(T('Её ладонь тёплая. Кольцо слегка касается моего пальца, когда мы делаем первые шаги к арке.','Her hand is warm. A ring lightly touches my finger as we take our first steps towards the arch.')),
   a(T('Если мы свернём не туда, я скажу, что это архитектурная экскурсия.','If we take the wrong turn, I will call it an architectural tour.'),'laughing'),
   y(T('Хорошо. Только не отпускай экскурсанта.','All right. Just do not lose your visitor.')),
   a(T('Не собиралась.','I was not planning to.'),'flirty')
  ],'cinema_after',{bg:'belgrade-night-walk',character:'asya',music:'encounter',journal:['cinema_personal'],exitAction:out(T('Пройти с Асей до освещённой улицы','Walk with Asya to the lit street'))}),
  cinema_luka:s([
   l(T('В детстве я думал, что взрослые знают, что делают. Теперь хотя бы умею собирать складные стулья без инструкции.','As a child, I thought adults knew what they were doing. Now I can at least fold chairs without instructions.'),'laughing'),
   y(T('Неплохая квалификация для вечера после кино.','A useful qualification for an evening after a film.')),
   l(T('Я ещё умею вовремя предложить прогулку. Хотя иногда долго собираюсь.','I can also suggest a walk at the right moment. Though sometimes I take a while to ask.'))
  ],null,{bg:'courtyard-after-film',character:'luka',choices:[
   {label:T('«Кажется, сейчас как раз вовремя. Пойдём вдвоём?»','‘This seems like the right moment. Shall we go together?’'),tone:'romance',next:'cinema_luka_close',effect:{cinemaBond:'romance',lukaBond:'romance'}},
   {label:T('Предложить пройтись всей компанией','Suggest a walk with the whole group'),tone:'friendship',next:'cinema_friends',effect:{cinemaBond:'friendship',lukaBond:'friendship'}}
  ]}),
  cinema_luka_close:s([
   l(T('Да. Мне хотелось побыть с тобой без расписания и чужих вопросов.','Yes. I wanted to spend time with you without a schedule or anybody else’s questions.'),'flirty'),
   n(T('Он улыбается чуть медленнее обычного. И мне вдруг очень нравится, что я умею отличать эту улыбку от приветствия.','He smiles a little more slowly than usual. Suddenly I like knowing the difference between this smile and a greeting.')),
   y(T('Тогда у меня только один вопрос. Можно я пойду ближе?','Then I have just one question. May I walk closer?')),
   l(T('Можно. Руку тоже можно предложить — если тебе хочется.','Yes. I can offer my hand too, if you would like.'),'flirty')
  ],null,{bg:'courtyard-after-film',character:'luka',music:'encounter',choices:[
   {label:T('Взять его за руку','Take his hand'),tone:'romance',next:'cinema_luka_hand',effect:{cinemaHand:true,lukaHand:true}},
   {label:T('«Давай пока просто рядом. Мне хочется тебя послушать»','‘Let us just walk beside each other for now. I want to listen to you’'),tone:'personal',next:'cinema_after',effect:{cinemaHand:false,lukaHand:false}}
  ]}),
  cinema_luka_hand:s([
   n(T('Мы выходим к освещённой улице. Лука не тянет меня за собой, а подстраивает шаг. От этого простого внимания становится неожиданно спокойно.','We reach the lit street. Luka matches my pace instead of pulling me along. That simple attention makes me unexpectedly calm.')),
   l(T('Знаю короткую дорогу. Но сегодня предлагаю длинную.','I know a short way. But tonight I suggest the long one.'),'flirty'),
   y(T('Давай. Только без соревнования по шагам.','Let us. But no step-count competition.')),
   l(T('Сегодня я никуда не хочу прийти первым.','Tonight I do not want to arrive first.'),'laughing')
  ],'cinema_after',{bg:'belgrade-night-walk',character:'luka',music:'encounter',journal:['cinema_personal'],exitAction:out(T('Пойти с Лукой по длинной дороге','Take the long way with Luka'))}),
  cinema_friends:s([
   n(T('Мы придвигаем стулья к столу. Разговор перескакивает с фильма на смешные объявления, с объявлений — на чью-то любимую пекарню.','We move our chairs to the table. The conversation jumps from the film to funny adverts, then to somebody’s favourite bakery.')),
   a(T('Это и есть обсуждение кино. Просто очень широкий авторский метод.','This is a film discussion. Just a very broad artistic approach.'),'laughing'),
   l(T('Зато продолжение каждый раз новое.','At least the sequel is different every time.'),'laughing'),
   n(T('Я смеюсь со всеми. Дружеский вечер оказывается полным сам по себе — ему не нужно притворяться началом свидания.','I laugh with everyone. A friendly evening is complete in itself; it does not need to pretend to be the start of a date.'))
  ],'cinema_after',{bg:'courtyard-after-film',character:'asya',journal:['cinema_personal'],exitAction:out(T('Помочь убрать чашки после разговора','Help clear the cups after the conversation'))}),
  cinema_after:s([
   n(T('В арке пахнет тёплым камнем и ночным воздухом. За спиной гасят гирлянды, кто-то обещает принести в следующий раз ещё один стул.','The arch smells of warm stone and night air. Behind me, the lights are being switched off and someone promises to bring another chair next time.')),
   {speaker:'host',message:true,text:T('«Надеюсь, вечер хороший. Если поздно вернёшься, не хлопай дверью: соседский кот опять спит на коврике».','‘Hope you are having a good evening. If you come back late, please close the door quietly: the neighbour’s cat is asleep on the mat again.’'),hostText:{dragan:T('«Надеюсь, вечер хороший. Если поздно вернёшься, не хлопай дверью: соседский кот опять спит на коврике».','‘Hope you are having a good evening. If you come back late, please close the door quietly: the neighbour’s cat is asleep on the mat again.’'),jelena:T('«Как кино? Я оставила свет у подъезда. И не верь коту на коврике: он уже ужинал».','‘How was the film? I left the light by the entrance on. And do not believe the cat on the mat: he has already had dinner.’')}},
   n(T('Я отвечаю коротко: «Спасибо. Всё хорошо». В этот раз не приходится проверять, правда ли это.','I reply simply: “Thank you. All is well.” This time, I do not have to check whether it is true.'))
  ],'cinema_tomorrow',{bg:'belgrade-night-walk',time:'22:20',exitAction:out(T('Оставить вечер в памяти','Keep the evening in my memory'))}),
  cinema_tomorrow:s([
   n(T('Перед сном я открываю календарь. Между рабочими заметками появились имена людей, с которыми хочется увидеться снова.','Before bed, I open my calendar. Among the work notes are names of people I want to see again.')),
   n(T('Обратный путь никуда не исчез. Но и оставаться на время больше не кажется решением, которое нужно оправдывать перед всем миром.','The way back has not disappeared. But staying for a while no longer feels like a decision I must justify to the whole world.')),
   n(T('Сейчас мне нужен план ровно того размера, который я могу выбрать честно.','Right now, I need a plan only as large as I can honestly choose.'))
  ],null,{bg:'room-window',time:'23:05',lighting:'night',choices:[
   {label:T('Запланировать здесь ближайшую неделю','Plan the coming week here'),tone:'practical',next:'chapter_six_close',effect:{cinemaPlan:'week'}},
   {label:T('Позволить себе подумать о лете в Сербии','Let myself imagine a summer in Serbia'),tone:'personal',next:'chapter_six_close',effect:{cinemaPlan:'season'}},
   {label:T('Оставить большой вопрос открытым','Leave the big question open'),tone:'personal',next:'chapter_six_close',effect:{cinemaPlan:'undecided'}}
  ]}),
  chapter_six_close:s([
   n(T('За окном проезжает последний шумный мотоцикл. Дом снова становится тихим, но уже не пустым.','The last noisy motorbike passes outside. The house grows quiet again, but no longer feels empty.')),
   documents(T('На следующей неделе я проверю сообщения по поданной заявке и выполню назначенные шаги. Ожидание решения остаётся ожиданием, а не обещанием результата.','Next week, I will check messages about my application and follow the requested steps. Waiting for a decision remains waiting, not a promise of an outcome.'),T('На следующей неделе я вернусь к документам, которые ещё требуют решения. Сегодня получилось не торопить ни их, ни себя.','Next week, I will return to the documents that still need decisions. Today, I managed not to rush them or myself.')),
   msg(T('Ася','Asya'),T('«В следующий раз будем смотреть во дворе комедию. Или жизнь сама справится. Спокойной ночи».','‘Next time we will show a comedy in the courtyard. Or life will take care of that itself. Good night.’')),
   {speaker:'narrator',text:T('Я откладываю телефон. Большой ответ ещё не готов, и сегодня мне спокойно с этим. Здесь есть двор, в котором мне оставят место.','I put my phone aside. The big answer is not ready yet, and tonight I am at peace with that. There is a courtyard here where someone will save me a seat.'),planText:{week:T('Я откладываю телефон. На ближайшую неделю у меня есть дела, знакомые маршруты и люди, которым можно написать. Пока этого достаточно.','I put my phone aside. For the coming week, I have things to do, familiar routes and people I can write to. For now, that is enough.'),season:T('Я откладываю телефон и позволяю себе представить здесь всё лето. Без клятвы остаться навсегда — просто ещё несколько тёплых вечеров.','I put my phone aside and let myself imagine a whole summer here. No promise to stay forever, just a few more warm evenings.'),undecided:T('Я откладываю телефон. Большой ответ ещё не готов, и сегодня мне спокойно с этим. Здесь есть двор, в котором мне оставят место.','I put my phone aside. The big answer is not ready yet, and tonight I am at peace with that. There is a courtyard here where someone will save me a seat.')}}
  ],'end',{bg:'room-window',time:'23:20',lighting:'night',journal:['plans_without_oath'],effectOnEnter:{chapterSixComplete:true},exitAction:out(T('Сохранить этот вечер','Save this evening'))})
 });
 N.chapter_five_close.next='courtyard_invite';
 N.chapter_five_close.exitAction=out(T('Продолжить · Свет во дворе','Continue · Light in the Courtyard'));
}
