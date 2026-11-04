// Third day. These fictional consultations prepare questions and drafts;
// they never submit a real application or promise a bank/residence decision.
export const CHAPTER_FOUR_TRANSLATIONS={};
const T=(ru,en)=>(CHAPTER_FOUR_TRANSLATIONS[ru]=en,ru);
export function extendFourthChapter({NODES:N,JOURNAL:J,BACKGROUNDS:B,CHARACTER_SPRITES:C,n,y,msg,scene}){
 const moodFor=text=>/свидани|за руку|подам тебе руку|друг на друга|отдельное приглашение/iu.test(text)?'flirty':/договор|документ|регистрац|расход|вопрос|подач|провер|план|сравн|доход|опыт|заявк/iu.test(text)?'thoughtful':'friendly';
 const a=text=>({speaker:'Ася',character:'asya',emotion:moodFor(text),text}),l=text=>({speaker:'Лука',character:'luka',emotion:moodFor(text),text});
 const out=label=>({kind:'tap',label,object:label});
 const s=(pages,next,extra={})=>scene(pages,next,{bg:'workshop-office',location:T('БЕЛГРАД · ДЕНЬ 2','BELGRADE · DAY 2'),time:'11:30',day:T('ДЕНЬ 2','DAY 2'),exitAction:out(T('Продолжить разговор','Continue the conversation')),...extra});
 const route=(speaker,business,employment,explore)=>({speaker,text:business,workText:{business,employment,explore}});
 const contact=(nikola,milica)=>({speaker:'contact',text:milica,contactText:{nikola,milica},message:true});
 for(const [id,label,description]of [
  ['bank-consultation',T('БАНК · КОНСУЛЬТАЦИЯ','BANK · CONSULTATION'),T('Светлая переговорная банка, стол для посетителей и окно на город','A bright bank meeting room, a visitor desk and a window overlooking the city')],
  ['workshop-office',T('БЕЛГРАД · РАБОЧАЯ МАСТЕРСКАЯ','BELGRADE · SHARED WORKSPACE'),T('Небольшая рабочая мастерская с книжными полками, растениями и большим столом','A small shared workspace with bookshelves, plants and a large table')],
  ['belgrade-rain-cafe',T('БЕЛГРАД · КАФЕ ПОСЛЕ ДОЖДЯ','BELGRADE · CAFÉ AFTER THE RAIN'),T('Уютное кафе у мокрой белградской улицы, отражения фонарей и тёплый свет','A cosy café beside a wet Belgrade street, with reflected lamps and warm light')],
  ['zemun-cobbles-v1',T('ЗЕМУН · СТАРЫЕ УЛИЦЫ','ZEMUN · OLD STREETS'),T('Брусчатая улица старого Земуна, низкие дома и красные крыши','A cobbled street in old Zemun, low houses and red roofs')],
  ['zemun-gardos-v2',T('ЗЕМУН · ГАРДОШ','ZEMUN · GARDOŠ'),T('Каменная башня на холме Гардош над крышами и Дунаем','The stone tower on Gardoš hill above the roofs and the Danube')],
  ['zemun-quay-v1',T('ЗЕМУН · КЕЙ','ZEMUN · THE QUAY'),T('Променад на Дунае, ресторанные баржи и террасы у воды','The Danube promenade, restaurant barges and terraces by the water')]
 ])B[id]={label,description,position:'50% 42%'};
 for(const [id,name,look]of [
  ['asya',T('Ася','Asya'),T('Ася, 29 лет, альтушка из Петербурга: чёрная стрижка с зелёной прядью, тёмная подводка и джинсовая куртка','Asya, 29, an alternative girl from Saint Petersburg: a black shag with a green streak, dark eyeliner and a denim jacket')],
  ['luka',T('Лука','Luka'),T('сербский бухгалтер со спортивной фигурой и короткой стрижкой','an athletic Serbian accountant with a short haircut')]
 ]){
  C[id]={};
  for(const [mood,label]of Object.entries({friendly:T('приветливая улыбка','a friendly smile'),thoughtful:T('внимательно слушает','listening closely'),laughing:T('смеётся','laughing'),flirty:T('тёплый заинтересованный взгляд','a warm, interested gaze')}))C[id][mood]={file:`${id}-${mood}`,alt:`${name}: ${look}, ${label}`};
 }
 Object.assign(J,{
  bank_followup:{title:T('Ответ из банка','The bank’s follow-up'),tag:T('БАНК · ПОСЛЕ КОНСУЛЬТАЦИИ','BANK · AFTER THE CONSULTATION'),text:T('После вымышленной консультации получено письмо: дополнительные подтверждения, тарифы и дальнейшие шаги. Счёт ещё не открыт. Документы и решение зависят от банка и ситуации заявителя.','After a fictional consultation, an email lists further evidence, fees and next steps. The account is not open yet. Documents and decisions depend on the bank and the applicant’s circumstances.'),link:'https://welcometoserbia.gov.rs/opening-bank-accounts-for-residents-and-non-residents',linkText:T('Официальная информация о счетах','Official information about accounts')},
  luka:{title:T('Лука','Luka'),tag:T('ЛЮДИ · РАБОЧАЯ МАСТЕРСКАЯ','PEOPLE · SHARED WORKSPACE'),text:T('35 лет. Бухгалтер из Белграда. Короткая стрижка, спортивная осанка и привычка сначала слушать, а потом открывать таблицу. Ведёт консультации в общей мастерской. После работы любит долгие прогулки и короткие фильмы.','35. An accountant from Belgrade. A short haircut, an athletic bearing and a habit of listening before opening a spreadsheet. Holds consultations at a shared workspace. After work, he likes long walks and short films.')},
  asya_personal:{title:T('Ася вне дел','Asya beyond the practical matters'),tag:T('ЛЮДИ · БЛИЖЕ','PEOPLE · GETTING CLOSER'),text:T('Асе 29. Она из Петербурга: чёрная стрижка с зелёной прядью, потёртая джинсовка и суховатые шутки, за которыми быстро обнаруживается тепло. Собирает друзей на дворовые показы и всё ещё иногда чувствует себя в Белграде новенькой.','Asya is 29 and from Saint Petersburg: a black shag with a green streak, faded denim and dry jokes with warmth underneath. She brings friends together for courtyard screenings and still sometimes feels new to Belgrade herself.')},
  business_draft:{title:T('Черновик своего дела','A draft for my own business'),tag:T('РАБОТА · ПОДГОТОВКА','WORK · PREPARATION'),text:T('В игровой папке собраны описание деятельности, вопросы об адресе и форме бизнеса, бюджет обязательных расходов и список документов для проверки. У APR есть бумажный и электронный способы подачи; доступность выбранного способа и требования нужно уточнять по своей ситуации. Черновик не отправлен и не означает регистрацию.','The game folder contains an activity description, questions about the address and business form, a budget for compulsory costs and a document checklist to verify. APR offers paper and electronic filing; the chosen channel and its requirements must be checked for the individual situation. The draft has not been submitted and does not constitute registration.'),link:'https://apr.gov.rs/services/eservices/e-incorporation-of-sole-proprietors.4266.html',linkText:T('APR: регистрация предпринимателя','APR: registering an entrepreneur')},
  employment_questions:{title:T('Разговор с командой','A conversation with a team'),tag:T('РАБОТА · ПО НАЙМУ','WORK · EMPLOYMENT'),text:T('Подготовлен короткий рассказ об опыте и вопросы о задачах, условиях, договоре и законном оформлении работы. Компания и встреча вымышлены; предложение работы ещё не получено.','A short introduction to my experience and questions about responsibilities, terms, the contract and lawful employment arrangements are ready. The company and meeting are fictional; no job offer has been received.')},
  work_research:{title:T('Можно пока выбирать','Room to keep choosing'),tag:T('РАБОТА · ВАРИАНТЫ','WORK · OPTIONS'),text:T('Получилось сравнить своё дело и работу в команде, не обещая немедленно выбрать. Следующий шаг — описать свои навыки, расходы и вопросы, на которые ещё нет ответа.','I compared running a business with joining a team without promising an immediate choice. Next: describe my skills, costs and unanswered questions.')},
  rain_memory:{title:T('Дождь без спешки','Rain without a rush'),tag:T('ЛЮДИ · ДЕНЬ 2','PEOPLE · DAY 2'),text:T('После дел мы задержались в кафе. Получилось выбрать, как провести это время: флиртовать, узнавать друг друга или просто сидеть вместе.','After the practical matters, we stayed at a café. I chose how to spend that time: flirting, getting to know someone or simply sitting together.')},
  residence_questions:{title:T('Следующая папка — проживание','The next folder: residence'),tag:T('ДОКУМЕНТЫ · СЛЕДУЮЩАЯ ГЛАВА','DOCUMENTS · NEXT CHAPTER'),text:T('Бизнес, счёт и разрешение на проживание — разные вопросы. Подходящее основание, документы и необходимость разрешения на работу нужно проверять отдельно. Сегодня в истории ни регистрация бизнеса, ни разрешение на проживание не получены.','Business registration, a bank account and residence permission are separate matters. The appropriate basis, documents and any work-permit requirements must be checked separately. Neither business registration nor residence permission has been obtained in the story today.'),link:'https://welcometoserbia.gov.rs/temporary-residence',linkText:T('Официальный портал о проживании','Official residence portal')},
  zemun_walk:{title:T('Земун после дел','Zemun after the practical matters'),tag:T('ГЛАВА 4 · ЗЕМУН','CHAPTER 4 · ZEMUN'),text:T('После мастерской мы прошли старыми улицами Земуна к башне на Гардоше и к кею на Дунае. Папка осталась в сумке. Дошли до кафе на кее — дальше темп вечера выбирал{a} я.','After the workspace we walked the old streets of Zemun to the tower on Gardoš and the Danube quay. The folder stayed in the bag. We reached the café on the quay — after that I chose the pace of the evening.')}
 });
 Object.assign(N,{
  third_morning:s([
   n(T('Утром я нахожу в сумке вчерашний список. Он немного помялся, но за ночь не стал страшнее.','In the morning, I find yesterday’s list in my bag. It is a little creased, but it has not grown more frightening overnight.')),
   contact(T('Доброе утро. Желаю тебе сегодня побольше понятных ответов. И нормального завтрака.','Good morning. Wishing you plenty of clear answers today. And a proper breakfast.'),T('Доброе утро. Пусть сегодня всё будет хотя бы немного понятнее. Напишешь потом?','Good morning. May things make a little more sense today. Will you write afterwards?')),
   route('narrator',T('После банка Ася обещала познакомить меня с бухгалтером. Хочу понять, как устроить своё дело без догадок.','After the bank, Asya promised to introduce me to an accountant. I want to understand how to set up my own business without guesswork.'),T('После банка встречусь с Асей: она обещала рассказать о знакомой команде. Открывать бизнес только ради галочки я не собираюсь.','After the bank, I will meet Asya: she promised to tell me about a team she knows. I am not opening a business just to tick a box.'),T('После банка встречусь с Асей. Сегодня можно узнавать варианты, не обещая выбрать один навсегда.','After the bank, I will meet Asya. Today I can explore options without promising to choose one forever.'))
  ],'bank_visit',{bg:'room-window',time:'08:45',exitAction:{kind:'checklist',label:T('Собраться на консультацию','Get ready for the consultation'),items:[T('Паспорт и подготовленные документы','Passport and prepared documents'),T('Список вопросов','Question list'),T('Адрес отделения и маршрут','Branch address and route')]}}),
  bank_visit:s([
   n(T('В банке прохладно. Я сажусь за небольшой стол и достаю папку. Паспорт сверху, под ним — список вопросов и подготовленные подтверждения.','The bank is cool inside. I sit at a small desk and take out my folder: passport on top, with my question list and the evidence I prepared beneath it.')),
   msg(T('Сотрудник банка','Bank employee'),T('«Давайте уточним вашу ситуацию. После разговора отправим список дальнейших шагов письменно».','‘Let us clarify your situation. After our conversation, we will send the next steps in writing.’')),
   y(T('Спасибо. Я записал{a} вопросы, чтобы не вспоминать их уже у выхода.','Thank you. I wrote my questions down so I would not remember them only on the way out.'))
  ],null,{bg:'bank-consultation',time:'09:30',choices:[
   {label:T('Уточнить, какие подтверждения нужны именно мне','Ask which evidence is needed in my situation'),tone:'practical',next:'bank_documents',effect:{bankVisitFocus:'documents'}},
   {label:T('Сначала разобраться в тарифах и обслуживании','First understand the fees and account services'),tone:'practical',next:'bank_cost',effect:{bankVisitFocus:'cost'}}
  ]}),
  bank_documents:s([
   n(T('Я раскладываю документы рядом со списком вопросов и нахожу подтверждение адреса. Напротив ещё нет отметки.','I lay the documents beside my question list and find proof of address. There is no tick beside it yet.')),
   msg(T('Сотрудник банка','Bank employee'),T('«Вот этот документ проверим. Если понадобится другой, укажем в письме, какое подтверждение подходит и как его передать».','‘We will check this document. If another is needed, the email will specify what evidence is suitable and how to provide it.’')),
   n(T('Я отмечаю проверенное, а недостающее обвожу. Возвращаю паспорт в обложку и закрываю папку: теперь в ней документы, а не мои догадки.','I tick the checked items and circle what is missing. I put my passport back in its cover and close the folder: now it holds documents rather than my guesses.'))
  ],'bank_followup',{bg:'bank-consultation',exitAction:out(T('Записать недостающие подтверждения','Note the missing evidence'))}),
  bank_cost:s([
   y(T('Покажите, пожалуйста, стоимость обслуживания и условия переводов. Хочу понимать расходы заранее.','Could you show me the account fees and transfer terms? I would like to understand the costs in advance.')),
   msg(T('Сотрудник банка','Bank employee'),T('«Конечно. Пришлём действующие тарифы. Если появятся вопросы по отдельной операции, уточните до её выполнения».','‘Of course. We will send the current fees. If you have questions about a particular transaction, ask before making it.’')),
   n(T('Я прошу повторить один пункт медленнее. Никто не вздыхает. Жаль, что мне не сказали раньше, насколько полезна эта простая просьба.','I ask for one point to be repeated more slowly. Nobody sighs. I wish someone had told me earlier how useful that simple request can be.'))
  ],'bank_followup',{bg:'bank-consultation',exitAction:out(T('Сохранить вопросы к тарифам','Save my questions about fees'))}),
  bank_followup:s([
   n(T('У выхода приходит письмо из банка. В нём — отмеченные пункты, тарифы и контакт для следующего вопроса.','At the exit, the bank’s email arrives. It contains the marked items, fees and a contact for my next question.')),
   n(T('Счёт ещё не открыт. Но я больше не пытаюсь угадать, что делать дальше.','The account is not open yet. But I am no longer trying to guess what to do next.')),
   msg(T('Ася','Asya'),T('«Как прошло? Я рядом с мастерской. Приходи, у нас как раз освободился стол».','‘How did it go? I am by the workspace. Come over, a table has just become free.’'))
  ],'asya_meeting',{bg:'bank-consultation',journal:['bank_followup'],exitAction:{kind:'checklist',label:T('Разобрать письмо после визита','Sort out the follow-up email'),items:[T('Сохранить письмо и тарифы','Save the email and fees'),T('Отметить, что нужно дополнить','Mark what needs to be added'),T('Записать следующий контакт','Note the next contact')],effect:{bankVisitComplete:true}}}),
  asya_meeting:s([
   n(T('Ася машет мне через открытую дверь. Зелёная прядь падает на глаза; она сдувает её и отодвигает ноутбук от тарелки абрикосов.','Asya waves through an open door. A green streak falls into her eyes; she blows it aside and moves her laptop away from a plate of apricots.')),
   a(T('Проходи. Сегодня встречаемся без чужой квартиры. Можно даже не спрашивать про депозит.','Come in. Today we are meeting somewhere other than someone else’s flat. You can even skip the deposit questions.')),
   y(T('Тогда задам сложный вопрос. Абрикосы общие?','Then I will ask a difficult question. Are the apricots for everyone?')),
   a(T('Теперь да. Вот и первая полезная договорённость за день.','They are now. There is our first useful agreement of the day.'))
  ],'luka_hello',{character:'asya',exitAction:out(T('Сесть рядом с Асей','Sit beside Asya'))}),
  luka_hello:s([
   n(T('От соседнего стола поднимается широкоплечий мужчина с короткой стрижкой. Он закрывает ноутбук, прежде чем протянуть руку.','A broad-shouldered man with a short haircut gets up from the next table. He closes his laptop before offering a hand.')),
   l(T('Лука. Я бухгалтер. Но сначала можно просто рассказать, что ты хочешь делать. Таблицу откроем потом.','Luka. I am an accountant. But first you can simply tell me what you want to do. We can open the spreadsheet later.')),
   a(T('Он умеет объяснять без выражения «ну это же очевидно». Поэтому я вас и знакомлю.','He can explain things without saying “well, obviously”. That is why I am introducing you.')),
   l(T('То, что давно понятно мне, не обязано быть очевидным тебе. Начнём с твоего плана?','What has long been familiar to me does not have to be obvious to you. Shall we start with your plan?'))
  ],'work_routes',{character:'luka',journal:['luka'],exitAction:out(T('Открыть заметку о работе','Open my work notes'))}),
  work_routes:s([
   route('narrator',T('Вчера я выбрал{a} своё дело. Сейчас хочется проверить, выдержит ли эта идея разговор о реальных расходах.','Yesterday I chose the business route. Now I want to see whether that idea holds up to a conversation about actual costs.'),T('Вчера меня больше интересовала работа в команде. Лука кивает: для этого не нужно притворяться предпринимателем.','Yesterday I was more interested in joining a team. Luka nods: I do not need to pretend to be an entrepreneur for that.'),T('Вчера я решил{a} пока изучать варианты. Сегодня это всё ещё хороший ответ.','Yesterday I decided to explore my options for now. Today that is still a good answer.')),
   l(T('Можно продолжить выбранный путь. Можно передумать. Моя задача — помочь задать вопросы, а не выбрать жизнь вместо тебя.','You can follow the route you chose. You can change your mind. My job is to help you ask questions, not choose your life for you.')),
   n(T('Я разворачиваю к себе чистую страницу. С чего начнём сегодня?','I turn a blank page toward me. Where shall we start today?'))
  ],null,{character:'luka',choices:[
   {label:T('Хочу подготовиться к своему делу','I want to prepare to run my own business'),tone:'practical',next:'work_own',effect:{workRoute:'business'}},
   {label:T('Хочу разобраться с работой в команде','I want to explore joining a team'),tone:'practical',next:'work_team',effect:{workRoute:'employment'}},
   {label:T('Сначала сравню варианты и расходы','First I will compare the options and costs'),tone:'personal',next:'work_options',effect:{workRoute:'explore'}}
  ]}),
  work_own:s([
   y(T('Я могу рассказать, чем умею зарабатывать. Но пока не понимаю, как превратить это в понятную заявку.','I can explain how I can earn money. But I do not yet know how to turn that into a clear application.')),
   l(T('Тогда начни обычными словами: что ты делаешь и для кого. Затем проверим подходящую форму, деятельность и адрес.','Then start in everyday language: what you do and for whom. Next we can check the appropriate form, activity and address.')),
   n(T('В заметке появляется первое описание, которое не похоже на рекламный слоган. Лука просит оставить рядом место для уточнений.','The first description appears in my notes that does not sound like an advertising slogan. Luka asks me to leave space beside it for questions.'))
  ],'business_budget',{character:'luka',exitAction:out(T('Записать деятельность простыми словами','Describe the activity in plain words'))}),
  work_team:s([
   a(T('У знакомой команды скоро открытая встреча. Я могу представить тебя, а вы уже обсудите опыт и задачи.','A team I know has an open meetup coming up. I can introduce you, and you can discuss your experience and their work.')),
   l(T('А вопросы о договоре, оформлении и праве на работу стоит задать отдельно. Бизнес регистрировать для этого разговора не требуется.','Ask separately about the contract, employment arrangements and the right to work. You do not need to register a business to have that conversation.')),
   y(T('Отлично. Встреча с людьми мне сейчас понятнее, чем фирма с красивым названием.','Good. Meeting people makes more sense to me right now than a company with a nice name.'))
  ],'employment_followup',{character:'asya',exitAction:out(T('Подготовить короткий рассказ об опыте','Prepare a short introduction to my experience'))}),
  work_options:s([
   y(T('Я пока не знаю, какой вариант мне подойдёт. Хочется сравнить их без ощущения, что завтра всё закроется.','I do not yet know which option suits me. I would like to compare them without feeling that everything will close tomorrow.')),
   l(T('Тогда сравним. Какой доход ожидаешь, какие расходы выдержишь и сколько неопределённости тебе сейчас по силам?','Then let us compare. What income do you expect, what costs can you manage, and how much uncertainty can you handle right now?')),
   a(T('И оставим клетку «пока не знаю». Она тоже полезная.','And leave a box for “I do not know yet”. That one is useful too.'))
  ],'explore_followup',{character:'luka',exitAction:out(T('Разделить вопросы на известные и открытые','Separate the known facts from open questions'))}),
  business_budget:s([
   l(T('Посчитай расходы даже для месяца без заказов. Обязательные платежи, помощь бухгалтера, банк и запас на обычную жизнь. Точные суммы проверим под твою ситуацию.','Estimate the costs even for a month without clients: compulsory payments, accounting help, banking and ordinary living expenses. We will check the exact figures for your situation.')),
   y(T('Вот тут моя таблица обычно делает вид, что кофе — производственная необходимость.','This is where my spreadsheet usually pretends coffee is a business necessity.')),
   l(T('Как бухгалтер я попрошу пояснение. Как человек — прекрасно понимаю.','As an accountant, I will ask for an explanation. As a person, I completely understand.')),
   n(T('За шуткой становится видна важная вещь: начать своё дело и быть готов{a} его содержать — не совсем одно и то же.','Behind the joke, something important becomes clear: starting a business and being ready to sustain it are not quite the same thing.'))
  ],null,{character:'luka',choices:[
   {label:T('Собрать черновик для проверки перед подачей в APR','Prepare a draft to review before filing with APR'),tone:'practical',next:'business_ready',effect:{businessDecision:'draft'}},
   {label:T('Взять паузу и сначала пересчитать бюджет','Pause and review my budget first'),tone:'personal',next:'business_pause',effect:{businessDecision:'wait'}}
  ]}),
  business_ready:s([
   l(T('У APR есть бумажная и электронная подача. Проверим, какой способ тебе доступен, как подтвердить личность и что нужно для выбранного варианта.','APR offers paper and electronic filing. We will check which channel you can use, how to establish your identity and what your chosen route requires.')),
   n(T('Я добавляю в папку описание деятельности, вопросы об адресе, паспорт и список оставшихся проверок. Пока это только черновик.','I add the activity description, address questions, my passport and the remaining checks to the folder. For now, it is only a draft.')),
   l(T('И отдельно проверим проживание. Регистрация предпринимателя сама по себе не даёт разрешения остаться в стране.','And we will check residence separately. Registering as an entrepreneur does not by itself give permission to remain in the country.'))
  ],'work_summary',{character:'luka',journal:['business_draft'],exitAction:{kind:'checklist',label:T('Собрать черновик, не отправляя заявку','Assemble the draft without submitting an application'),items:[T('Описание деятельности и адресные вопросы','Activity description and address questions'),T('Бюджет и документы для проверки','Budget and documents to verify'),T('Способ подачи и оставшиеся вопросы','Filing channel and remaining questions')],effect:{businessDraftReady:true}}}),
  business_pause:s([
   y(T('Я хочу вернуться к этому с бюджетом, которому сам{a} верю. Давай пока ничего не подавать.','I want to come back with a budget I believe in myself. Let us not submit anything yet.')),
   l(T('Хорошо. Отправлю список вопросов, а ты спокойно посмотришь цифры. Пауза — тоже решение.','All right. I will send the question list, and you can look through the numbers in peace. Pausing is a decision too.')),
   n(T('Он закрывает таблицу без разочарованного вздоха. Я замечаю, как расслабились плечи.','He closes the spreadsheet without a disappointed sigh. I notice that my shoulders have relaxed.'))
  ],'work_summary',{character:'luka',journal:['work_research'],exitAction:out(T('Сохранить вопросы и отложить подачу','Save the questions and postpone filing'))}),
  employment_followup:s([
   a(T('Расскажи в двух предложениях, что ты умеешь. Только без фразы «решаю комплексные задачи». Ею здесь уже можно стены красить.','Tell me in two sentences what you can do. Just avoid “I solve complex challenges”. We already have enough of that phrase to paint the walls.')),
   n(T('Я убираю лишние слова. Остаются опыт, интерес к работе и вопросы, на которые хочется получить честные ответы.','I remove the extra words. What remains is experience, interest in the work and questions I want honest answers to.')),
   a(T('Вот теперь похоже на приглашение к разговору. Перешлю знакомство, когда скажешь, что готов{a}.','Now that sounds like an invitation to talk. I will make the introduction when you tell me you are ready.'))
  ],'work_summary',{character:'asya',journal:['employment_questions'],exitAction:{kind:'checklist',label:T('Сохранить подготовку к знакомству с командой','Save my preparation for meeting the team'),items:[T('Опыт и интересующие задачи','Experience and work that interests me'),T('Условия и договор','Terms and contract'),T('Вопросы об оформлении работы','Questions about employment arrangements')],effect:{employmentIntroReady:true}}}),
  explore_followup:s([
   n(T('На странице получаются две колонки и несколько честных пробелов. Раньше я бы назвал{a} их провалом планирования.','The page ends up with two columns and a few honest gaps. Before, I would have called them a planning failure.')),
   l(T('Если сейчас не хватает данных, следующий шаг — найти их. Не угадать ответ погромче.','If information is missing, the next step is to find it, not guess the answer more loudly.')),
   a(T('И после этого поесть. Удивительно, сколько плохих решений принимается натощак.','And eat afterwards. It is amazing how many bad decisions are made on an empty stomach.'))
  ],'work_summary',{character:'asya',journal:['work_research'],exitAction:out(T('Сохранить сравнение и открытые вопросы','Save the comparison and open questions'))}),
  work_summary:s([
   n(T('Мы заканчиваем деловую часть. Лука отправляет заметки и убирает ноутбук в чехол.','We finish the practical part. Luka sends the notes and slips his laptop into its sleeve.')),
   route('narrator',T('У меня есть вопросы о своём деле и решение о следующем шаге. Заявку за меня никто не отправлял.','I have questions about my business and a decision about the next step. Nobody submitted an application on my behalf.'),T('У меня готов рассказ о себе и вопросы к команде. Получилось продвинуться без регистрации ненужного мне бизнеса.','My introduction and questions for the team are ready. I have moved forward without registering a business I do not need.'),T('Я ещё выбираю направление, но теперь понимаю, что сравнивать. Неопределённость получила названия.','I am still choosing a direction, but now I know what to compare. The uncertainty has names.')),
   a(T('А теперь местная программа адаптации. Кто успеет до кафе, прежде чем пойдёт дождь?','And now for the local adaptation programme. Who can reach the café before it starts raining?'))
  ],'zemun_cobbles',{character:'asya',exitAction:out(T('Выйти к Земуну','Step out toward Zemun'))}),
  zemun_cobbles:s([
   n(T('Кафе, о котором говорит Ася, не за углом. Оно в Земуне, на Дунае. По дороге как раз старый город.','The café Asya means is not around the corner. It is in Zemun, on the Danube. The old town is on the way.')),
   a(T('Старый Земун ходит медленно. Брусчатка, низкие дома, и никто не просит папку.','Old Zemun walks slowly. Cobbles, low houses, and nobody asks for the folder.')),
   l(T('Я прихожу сюда, когда за столом слишком громко. Башня на холме. До дождя успеем.','I come here when a table gets too loud. The tower is up the hill. We will make it before the rain.')),
   n(T('Я убираю папку в сумку и оставляю её там.','I put the folder in the bag and leave it there.'))
  ],'zemun_gardos',{bg:'zemun-cobbles-v1',location:T('ЗЕМУН · СТАРЫЕ УЛИЦЫ','ZEMUN · OLD STREETS'),time:'13:20',exitAction:out(T('Подняться к башне','Climb toward the tower'))}),
  zemun_gardos:s([
   n(T('Улица поднимается. Над крышами стоит башня Гардоша: каменная и чуть слишком гордая для такого тихого холма.','The street climbs. Above the roofs stands the Gardoš tower: stone, and a little too proud for such a quiet hill.')),
   l(T('Её поставили, чтобы помнить тысячу лет. Отсюда Дунай похож на дорогу, а не на графу в анкете.','It was built to remember a thousand years. From here the Danube looks like a road, not a line on a form.')),
   a(T('Только не делай из этого метафору про разрешение на проживание. Просто смотри.','Just do not turn this into a metaphor about a residence permit. Simply look.')),
   y(T('Смотрю. Впервые за день город больше моего списка.','I am looking. For the first time today the city is bigger than my list.'))
  ],'zemun_quay',{bg:'zemun-gardos-v2',location:T('ЗЕМУН · ГАРДОШ','ZEMUN · GARDOŠ'),time:'13:40',exitAction:out(T('Спуститься к Дунаю','Go down to the Danube'))}),
  zemun_quay:s([
   n(T('Внизу на кее Дунай широкий. Вдоль прогулки стоят рестораны и баржи с уже накрытыми столами.','Down on the quay the Danube is wide. Restaurants and barges with tables already laid line the walk.')),
   a(T('Кафе — одна из этих террас. Если сядем раньше неба, стол будет наш.','The café is one of these terraces. If we sit down before the sky does, the table is ours.')),
   l(T('Первые капли уже на воде. Таблица этого вида не переживает.','The first drops are already on the water. A spreadsheet does not survive this view.')),
   n(T('Мы ещё только подходим к террасе. Небо уже ниже крыш.','We are only just reaching the terrace. The sky is already lower than the roofs.'))
  ],'rain_break',{bg:'zemun-quay-v1',location:T('ЗЕМУН · КЕЙ','ZEMUN · THE QUAY'),time:'13:55',journal:['zemun_walk'],exitAction:out(T('Сесть, пока не полило','Sit down before the rain'))}),
  rain_break:s([
   n(T('До кафе мы успеваем ровно за первыми каплями. Дождь делает улицу блестящей, а людей — неожиданно разговорчивыми.','We reach the café just as the first drops fall. Rain makes the street glossy and people unexpectedly talkative.')),
   a(T('Мы здесь надолго. У меня один зонт на троих и совершенно неподходящая вера в прогноз.','We may be here a while. I have one umbrella for three people and a thoroughly misplaced faith in the forecast.')),
   l(T('Зато теперь никто не обязан смотреть в таблицу. Можно смотреть в окно. Или друг на друга.','At least nobody has to look at a spreadsheet now. We can look out of the window. Or at each other.'))
  ],null,{bg:'belgrade-rain-cafe',time:'14:10',choices:[
   {label:T('Задержаться у окна с Асей','Stay by the window with Asya'),tone:'explore',next:'rain_asya',effect:{rainWith:'asya'}},
   {label:T('Поговорить с Лукой уже не о работе','Talk with Luka about something other than work'),tone:'explore',next:'rain_luka',effect:{rainWith:'luka'}},
   {label:T('Сесть всем вместе и просто поболтать','Sit together and simply chat'),tone:'friendship',next:'rain_friends',effect:{rainWith:'friends'}}
  ]}),
  rain_asya:s([
   a(T('Знаешь, когда я приехала, у меня тоже было лицо человека, который забыл подготовиться к собственной жизни.','You know, when I arrived, I also looked like someone who had forgotten to prepare for their own life.')),
   y(T('А теперь ты выдаёшь абрикосы и знакомишь с людьми. Значительный карьерный рост.','And now you hand out apricots and introduce people. That is considerable career growth.')),
   a(T('Не поверишь, я всё ещё иногда просто хочу, чтобы кто-нибудь позвал меня гулять. Без вопроса про квартиру.','Believe it or not, sometimes I still just want someone to ask me out for a walk. Without a question about a flat.'))
  ],null,{bg:'belgrade-rain-cafe',character:'asya',journal:['asya_personal'],choices:[
   {label:T('«Тогда я зову. И мне хочется, чтобы это было свидание»','‘Then I am asking. And I would like it to be a date’'),tone:'romance',next:'rain_asya_close',effect:{asyaBond:'romance'}},
   {label:T('«Давай в выходные соберёмся погулять с друзьями»','‘Let us get some friends together for a walk this weekend’'),tone:'friendship',next:'rain_friends',effect:{asyaBond:'friendship'}},
   {label:T('Спросить про её дворовые кинопоказы','Ask about her courtyard screenings'),tone:'practical',next:'rain_friends',effect:{asyaBond:'friendship'}}
  ]}),
  rain_asya_close:s([
   n(T('Ася на секунду замолкает. Потом улыбается уже без привычной спешки.','Asya falls quiet for a moment. Then she smiles without her usual hurry.')),
   a(T('Мне нравится, что ты уточнил{a}. Я бы тоже хотела свидание.','I like that you made it clear. I would like a date too.')),
   y(T('Тогда обещаю хотя бы первые десять минут не спрашивать про документы.','Then I promise not to ask about documents for at least the first ten minutes.')),
   a(T('Десять минут? Щедро. Можно я пока возьму тебя за руку?','Ten minutes? Generous. May I hold your hand in the meantime?'))
  ],null,{bg:'belgrade-rain-cafe',character:'asya',music:'encounter',journal:['rain_memory'],choices:[
   {label:T('Подать ей ладонь и улыбнуться','Offer her my hand and smile'),tone:'romance',next:'chapter_four_close',effect:{asyaHand:true}},
   {label:T('«Мне хочется чуть медленнее. Но на свидание я приду»','‘I would like to take it a little slower. But I will come to the date’'),tone:'personal',next:'chapter_four_close',effect:{asyaHand:false}}
  ]}),
  rain_luka:s([
   y(T('Ты правда всегда такой спокойный или это профессиональный приём?','Are you really always this calm, or is it a professional technique?')),
   l(T('Я однажды забыл ключи внутри квартиры и три часа ждал на лестнице. Спокойствие сильно помогает, когда больше ничего не помогает.','Once I left my keys inside my flat and waited on the stairs for three hours. Calm helps a lot when nothing else does.')),
   n(T('Он смеётся, и за деловой сдержанностью вдруг становится видно совсем другого человека. Мне хочется познакомиться и с ним тоже.','He laughs, and suddenly I see a different person behind the professional composure. I would like to get to know that person too.'))
  ],null,{bg:'belgrade-rain-cafe',character:'luka',choices:[
   {label:T('«Пригласишь меня куда-нибудь, где нет таблиц?»','‘Will you invite me somewhere without spreadsheets?’'),tone:'romance',next:'rain_luka_close',effect:{lukaBond:'romance'}},
   {label:T('«Покажешь как-нибудь свой любимый маршрут по городу?»','‘Will you show me your favourite route through the city sometime?’'),tone:'friendship',next:'rain_friends',effect:{lukaBond:'friendship'}},
   {label:T('Поблагодарить за помощь и спокойно допить кофе','Thank him for his help and finish my coffee in peace'),tone:'practical',next:'rain_friends',effect:{lukaBond:'practical'}}
  ]}),
  rain_luka_close:s([
   l(T('Да. Только это будет отдельное приглашение, без консультации и папки. У меня есть маршрут вдоль реки.','Yes. But that will be a separate invitation, without a consultation or a folder. I know a route along the river.')),
   y(T('Хорошо. На прогулке я предпочитаю смотреть на человека, а не на его расчёты.','Good. On a walk, I prefer looking at the person rather than their calculations.')),
   n(T('Лука слегка склоняет голову и смотрит прямо на меня. Теперь его улыбку трудно назвать просто вежливой.','Luka tilts his head a little and looks straight at me. His smile is hard to call merely polite now.')),
   l(T('Тогда можно я сейчас подам тебе руку? А гулять пойдём, когда дождь закончится.','Then may I offer you my hand now? We can walk when the rain stops.'))
  ],null,{bg:'belgrade-rain-cafe',character:'luka',music:'encounter',journal:['rain_memory'],choices:[
   {label:T('Оставить свою ладонь в его руке','Leave my hand in his'),tone:'romance',next:'chapter_four_close',effect:{lukaHand:true}},
   {label:T('«Пока просто посиди рядом. Мне и так хорошо»','‘Just sit beside me for now. This already feels good’'),tone:'personal',next:'chapter_four_close',effect:{lukaHand:false}}
  ]}),
  rain_friends:s([
   n(T('Мы собираем чашки на одном столе. Ася рассказывает про дворовые показы: проектор, простыня и соседи, которые приносят слишком много еды.','We gather our cups at one table. Asya talks about the courtyard screenings: a projector, a sheet and neighbours who bring far too much food.')),
   l(T('В прошлый раз фильм пришлось поставить на паузу. Кот сел прямо перед проектором.','Last time we had to pause the film. A cat sat right in front of the projector.')),
   a(T('У него была важная сцена. В этот раз приходи тоже. Кот, кажется, уже согласился.','It was an important scene for him. Come along this time. I think the cat has already agreed.'))
  ],'chapter_four_close',{bg:'belgrade-rain-cafe',character:'asya',journal:['rain_memory','asya_personal'],exitAction:out(T('Сохранить приглашение на дворовой показ','Save the invitation to the courtyard screening'))}),
  chapter_four_close:s([
   n(T('К вечеру дождь заканчивается. Я возвращаюсь домой с письмом из банка и заметками, которые наконец могу объяснить своими словами.','By evening the rain has stopped. I return home with the bank’s email and notes I can finally explain in my own words.')),
   contact(T('Ну что, день тебя не съел? Расскажешь при встрече. Я заодно оставил тебе кое-что вкусное.','Well, did the day leave you in one piece? Tell me when we meet. I have saved something delicious for you too.'),T('Как прошёл день? У меня появился новый рисунок. В этот раз кое-кто прячет за спиной не букет, а зонт.','How was your day? I have a new drawing. This time someone is hiding an umbrella behind their back instead of flowers.')),
   msg(T('Ася','Asya'),T('«В субботу кинопоказ во дворе. Приходи. А завтра спокойно разберём, какие вопросы по проживанию у тебя ещё остались».','‘There is a courtyard screening on Saturday. Come along. Tomorrow we can calmly go over your remaining residence questions.’')),
   n(T('Я добавляю в календарь два разных дела: документы — и вечер во дворе. Кажется, новая жизнь начинает помещаться не только в папку.','I add two different things to my calendar: documents and an evening in the courtyard. It seems a new life is starting to fit into more than a folder.'))
  ],'end',{bg:'room-window',time:'20:45',lighting:'night',journal:['residence_questions'],effectOnEnter:{chapterFourComplete:true},exitAction:out(T('Сохранить планы и приглашение','Save my plans and invitation'))})
 });
 // Match the speaking face even when both people share a scene. Explicit
 // reactions keep jokes and mutually chosen flirting visually distinct.
 for(const[id,index,mood]of [['asya_meeting',3,'laughing'],['luka_hello',2,'laughing'],['business_budget',2,'laughing'],['rain_luka',1,'laughing'],['rain_asya_close',1,'flirty'],['rain_luka_close',0,'flirty']])N[id].pages[index].emotion=mood;
 N.chapter_three_close.next='third_morning';
 N.chapter_three_close.exitAction=out(T('Продолжить · Своё дело','Continue · My Own Path'));
}
