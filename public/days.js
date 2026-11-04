// The story is organised as thirty days: from the search for a home to the application for temporary residence
// and the player's own decision to stay or leave. Each day is one chapter.
// Structure follows https://www.srb.guide/ (stages 2-7); real administrative details are checked against
// official sources before being written into a day, and outcomes in the game are fictional.
export const DAYS_TRANSLATIONS={};
export const T=(ru,en)=>(DAYS_TRANSLATIONS[ru]=en,ru);
export const STAGES={
 arrival:T('Первые дни','First days'),
 clock:T('Счёт времени','Counting the time'),
 basis:T('Выбор основания','Choosing a basis'),
 prepare:T('Подготовка основания','Preparing the basis'),
 filing:T('Подготовка к подаче','Getting ready to file'),
 submit:T('Подача','Filing'),
 waiting:T('Жизнь в ожидании','Life while waiting'),
 decision:T('Решение','The decision')
};
export const LEGACY_PRELUDE=[
 {id:'prologue',number:'Пролог',title:'Жара на посадке',start:'quick_arrival',description:'Аэропорт, кофе и первое знакомство.'},
 {id:'arrival',number:'День 0',title:'Своя дверь',start:'road_start',description:'Ключи, новый двор и первый вечер.'}
];
// status 'written' = a full day exists (it may be shared with an older chapter); 'skeleton' = a short playable day still to be expanded.
export const LEGACY_DAYS=[
 {n:1,id:'districts',title:'Район для жизни',start:'morning_start',stage:'arrival',status:'written',description:'Карта Белграда, квартира, первый план по счёту и работе и вечер после.'},
 {n:2,id:'work',title:'Счёт и своё дело',start:'third_morning',stage:'arrival',status:'written',description:'Визит в банк, знакомство с Асей и Лукой, рабочее направление.'},
 {n:3,id:'day-3',title:'Связь, транспорт, деньги',start:'d3_start',stage:'arrival',status:'written',description:'Местная связь, городской транспорт и обмен денег.'},
 {n:4,id:'day-4',title:'Регистрация места пребывания',start:'d4_start',stage:'arrival',status:'written',description:'Подтверждение регистрации и заявление хозяина о жилье.'},
 {n:5,id:'day-5',title:'Сколько у меня дней',start:'d5_start',stage:'clock',status:'written',description:'Срок пребывания без заявления и тридцатый день как дедлайн.'},
 {n:6,id:'day-6',title:'Выбор основания',start:'d6_start',stage:'basis',status:'written',description:'На каком основании просить временное проживание.'},
 {n:7,id:'day-7',title:'Форма дела или работодатель',start:'d7_start',stage:'prepare',status:'written',description:'Форма предпринимательства, письмо работодателю или сравнение маршрутов.'},
 {n:8,id:'day-8',title:'Бухгалтер и налоги',start:'d8_start',stage:'prepare',status:'written',description:'Разговор с Лукой о налогах и о том, когда нужен бухгалтер.'},
 {n:9,id:'day-9',title:'Адрес для заявления',start:'d9_start',stage:'prepare',status:'written',description:'Домашний адрес или коворкинг как подтверждаемый адрес.'},
 {n:10,id:'day-10',title:'Документы из дома',start:'d10_start',stage:'prepare',status:'written',description:'Справки, апостиль и переводы, которые нужно заказать заранее.'},
 {n:11,id:'day-11',title:'Подготовка основания',start:'d11_start',stage:'prepare',status:'written',description:'Сбор данных под выбранное основание.'},
 {n:12,id:'residence',title:'Папка документов',start:'fourth_morning',stage:'filing',status:'written',description:'Жилье, адрес и заявка в банк.'},
 {n:13,id:'day-13',title:'Медицинская страховка',start:'d13_start',stage:'filing',status:'written',description:'Выбор полиса и сохранение договора.'},
 {n:14,id:'day-14',title:'Госуслуги онлайн',start:'d14_start',stage:'filing',status:'written',description:'Регистрация на портале электронных услуг.'},
 {n:15,id:'filing',title:'Ответ банка и подача',start:'bank_approved',stage:'submit',status:'written',description:'Ответ банка, итог рабочего маршрута и заявление.'},
 {n:16,id:'after-filing',title:'Вечер после подачи',start:'document_evening',stage:'submit',status:'written',description:'Вечер с близкими людьми после подачи документов.'},
 {n:17,id:'day-17',title:'Квитанция и ожидание',start:'d17_start',stage:'waiting',status:'written',description:'Сохранённые подтверждения и честное ожидание ответа.'},
 {n:18,id:'day-18',title:'Первый рабочий шаг',start:'d18_start',stage:'waiting',status:'written',description:'Первые клиенты, первый рабочий день или две встречи.'},
 {n:19,id:'day-19',title:'День без дел',start:'d19_start',stage:'waiting',status:'written',description:'Прогулка с человеком из аэропорта без планов.'},
 {n:20,id:'day-20',title:'Разговор о договоре',start:'d20_start',stage:'waiting',status:'written',description:'Сколько ещё оставаться в квартире и какие условия менять.'},
 {n:21,id:'courtyard',title:'Свет во дворе',start:'courtyard_invite',stage:'waiting',status:'written',description:'Дворовой кинопоказ, близкие люди и планы на будущее.'},
 {n:22,id:'day-22',title:'Утро после кино',start:'d22_start',stage:'waiting',status:'written',description:'Сообщения от Аси и Луки и первая повторяющаяся запись в календаре.'},
 {n:23,id:'day-23',title:'Письмо из дома',start:'d23_start',stage:'waiting',status:'written',description:'Честный ответ домой о том, что получилось и что нет.'},
 {n:24,id:'day-24',title:'Бюджет месяца',start:'d24_start',stage:'waiting',status:'written',description:'Расходы, доходы и запас на быстрый отъезд.'},
 {n:25,id:'day-25',title:'Обычный день',start:'d25_start',stage:'waiting',status:'written',description:'День без дел и бумаг: булочная, рынок и язык.'},
 {n:26,id:'day-26',title:'Если ответа не будет',start:'d26_start',stage:'decision',status:'written',description:'Два плана на случай, если ответ придёт или не придёт вовремя.'},
 {n:27,id:'day-27',title:'Билет',start:'d27_start',stage:'decision',status:'written',description:'Условия обратного билета и последняя дата, когда его можно менять.'},
 {n:28,id:'day-28',title:'Люди, которые рядом',start:'d28_start',stage:'decision',status:'written',description:'Встреча во дворе без разговора о выборе.'},
 {n:29,id:'decision',title:'Что я хочу сохранить',start:'decision_morning',stage:'decision',status:'written',description:'Три бумаги на столе и вопрос, что для меня важнее всего.'},
 {n:30,id:'answer',title:'Ответ на лето',start:'decision_plan',stage:'decision',status:'written',description:'Последний вечер и ваше решение: остаться, уехать или вернуться по плану.'}
];
const EN={
 1:['A District for Living','Belgrade’s map, a flat, a first plan for the account and work, and an evening afterwards.'],
 2:['An Account and My Own Work','A visit to the bank, meeting Asya and Luka, a working direction.'],
 3:['Phone, Transport, Money','Local mobile service, city transport and changing money.'],
 4:['Registering My Address','Confirmation of registration and the owner’s statement about the housing.'],
 5:['How Many Days I Have','The stay allowed without an application, and day thirty as a deadline.'],
 6:['Choosing a Basis','On what basis to ask for temporary residence.'],
 7:['A Business Form or an Employer','A business form, a letter to an employer or a comparison of routes.'],
 8:['The Accountant and Taxes','A talk with Luka about taxes and when an accountant is needed.'],
 9:['An Address for the Application','A home address or a coworking space as an address that can be confirmed.'],
 10:['Documents from Home','Certificates, apostilles and translations to order in advance.'],
 11:['Preparing the Basis','Gathering details for the chosen basis.'],
 12:['The Document Folder','Housing, address and a request to the bank.'],
 13:['Health Insurance','Choosing a policy and saving the contract.'],
 14:['Government Services Online','Registering on the e-government portal.'],
 15:['The Bank’s Answer and Filing','The bank’s answer, the result of the work route and the application.'],
 16:['The Evening After Filing','An evening with people close to me after filing.'],
 17:['The Receipt and the Wait','Saved confirmations and an honest wait for an answer.'],
 18:['A First Working Step','First clients, a first working day or two meetings.'],
 19:['A Day Off','A walk with the person from the airport, with no plans.'],
 20:['A Talk About the Lease','How much longer to stay in the flat and which terms to change.'],
 21:['Light in the Courtyard','A courtyard screening, people close to me and plans for the future.'],
 22:['The Morning After the Film','Messages from Asya and Luka and a first recurring calendar entry.'],
 23:['A Letter from Home','An honest reply home about what worked and what did not.'],
 24:['The Month’s Budget','Spending, income and a reserve for a quick departure.'],
 25:['An Ordinary Day','A day without errands or papers: the bakery, the market and the language.'],
 26:['If No Answer Comes','Two plans: the answer arrives in time, or it does not.'],
 27:['The Ticket','The conditions of the return ticket and the last date it can be changed.'],
 28:['The People Nearby','A meeting in the courtyard without talking about the choice.'],
 29:['What I Want to Keep','Three papers on the table and the question of what matters most.'],
 30:['An Answer for the Summer','A last evening and your decision: stay, leave or return by a plan.']
};
for(const d of LEGACY_DAYS){const [title,description]=EN[d.n];T(d.title,title);T(d.description,description);T('День '+d.n,'Day '+d.n);T('День '+d.n+' · '+d.title,'Day '+d.n+' · '+title);T('ДЕНЬ '+d.n,'DAY '+d.n);T('Продолжить · День '+d.n,'Continue · Day '+d.n);T('БЕЛГРАД · '+d.title.toUpperCase(),'BELGRADE · '+title.toUpperCase());T('ДЕНЬ '+d.n+' · '+STAGES[d.stage].toUpperCase(),'DAY '+d.n+' · '+DAYS_TRANSLATIONS[STAGES[d.stage]].toUpperCase());}
T('День 0','Day 0');T('День 0 · Своя дверь','Day 0 · My Own Door');
export const legacyDayFor=n=>LEGACY_DAYS.find(d=>d.n===n);

// Cast helpers for the day scenes. Every day has two speaking people of different genders: Asya and Luka, the airport
// person and their counterpart (Nikola/Milica), or the flat's owner and their counterpart (Dragan/Jelena).
// The counterparts are always the other gender. Variants reuse workText (route), contactText (keyed by the airport person)
// and districtText (keyed by the owner).
export function castHelpers(n){
 const A=(ru,en,emotion='friendly')=>({speaker:'Ася',character:'asya',emotion,text:T(ru,en)});
 const L=(ru,en,emotion='friendly')=>({speaker:'Лука',character:'luka',emotion,text:T(ru,en)});
 const contact=(nikola,milica,extra={})=>({speaker:'contact',cameo:true,emotion:'friendly',text:T(...milica),contactText:{nikola:T(...nikola),milica:T(...milica)},...extra});
 const counter=(whenNikola,whenMilica,extra={})=>({speaker:'contactCounterpart',cameo:true,emotion:'friendly',text:T(...whenMilica),contactText:{nikola:T(...whenNikola),milica:T(...whenMilica)},...extra});
 const owner=(dragan,jelena,extra={})=>({speaker:'districtHost',cameo:true,emotion:'friendly',text:T(...dragan),districtText:{dragan:T(...dragan),jelena:T(...jelena)},...extra});
 const neighbour=(whenDragan,whenJelena,extra={})=>({speaker:'ownerCounterpart',cameo:true,emotion:'friendly',text:T(...whenDragan),districtText:{dragan:T(...whenDragan),jelena:T(...whenJelena)},...extra});
 const route=(business,employment,explore)=>({speaker:'narrator',text:business,workText:{business,employment,explore}});
 const note=(ru,en)=>n(T(ru,en));
 return {A,L,contact,counter,owner,neighbour,route,note};
}

// Written days that already existed get small additions so that two people of different genders appear on every path.
// Pages are only added after the existing ones (or inside the unreleased ending), so saved page indices stay valid.
export function extendCast({NODES:N}){
 const A=(ru,en,message=true)=>({speaker:'Ася',character:'asya',emotion:'friendly',text:T(ru,en),message});
 const L=(ru,en,message=true)=>({speaker:'Лука',character:'luka',emotion:'friendly',text:T(ru,en),message});
 const owner=(dragan,jelena)=>({speaker:'districtHost',cameo:true,emotion:'friendly',text:T(...dragan),districtText:{dragan:T(...dragan),jelena:T(...jelena)}});
 const neighbour=(whenDragan,whenJelena)=>({speaker:'ownerCounterpart',cameo:true,emotion:'friendly',text:T(...whenDragan),districtText:{dragan:T(...whenDragan),jelena:T(...whenJelena)}});
 // Day 1: owner/neighbour leave a soft home option (not a locked dinner) after the airport ping; evening choices stay on evening_plan.
 const softDinner=['Если вечером останешься дома — ужин в восемь. Не обижусь, если планы изменятся.','If you stay in tonight, dinner is at eight. I will not mind if your plans change.'];
 const softBread=['Я всё равно захвачу хлеб с угла — пригодится, даже если тебя не будет.','I will grab bread from the corner anyway - it will come in handy even if you are out.'];
 N.afternoon_invite.pages.push(owner(softDinner,softDinner),neighbour(softBread,softBread));
 // Day 12: two friends who have been through the same bank and the same tax questions.
 N.bank_send.pages.push(
  A('Если банк попросит больше бумаг, не пугайся: у меня просили три раза.','If the bank asks for more papers, do not panic: mine asked three times.'),
  L('Когда будет ответ, пришли мне выписку. Сверим условия.','When the answer comes, send me the statement. We will check the terms.'));
 // Day 16 already has Asya; Luka writes in the evening.
 N.chapter_five_close.pages.push(L('Подача — это один шаг, а не вся дорога. Хорошо, что ты не стал{a} ждать до последнего дня.','Filing is one step, not the whole road. It is good that you did not wait for the last day.'));
 // Day 29: both friends write while the choice is being weighed.
 for(const id of ['decision_weigh_work','decision_weigh_people','decision_weigh_home'])N[id].pages.push(
  A('Что бы ты ни выбрал{a}, у двора будет стул для тебя.','Whatever you choose, the courtyard will have a chair for you.'),
  L('Если захочешь пересчитать цифры, я рядом.','If you want to go over the numbers again, I am here.'));
 // Day 30: the endings end with messages from both friends before the closing line.
 const messages=[A('Это не обещание, а стул: он стоит во дворе, пока ты решаешь.','This is not a promise but a chair: it stands in the courtyard while you decide.'),L('Расстояние оказывается меньше, чем кажется. Но это уже не вопрос.','The distance turns out to be shorter than it seems. But that is not a question any more.')];
 for(const id of ['epilogue_stay','epilogue_leave','epilogue_return']){const pages=N[id].pages;pages.splice(pages.length-1,0,...messages);}
}

// Active route: day number and chapter number are identical. Legacy metadata is only used to assemble archived scenes.
export const PRELUDE=[];
export const DAYS=[
 {n:1,id:'arrival',title:T('Прилёт','Arrival'),start:'quick_arrival',stage:'arrival',status:'written',description:T('Багаж, кофе и первое знакомство.','Baggage, coffee and a first acquaintance.')},
 {n:2,id:'temporary',title:T('Временная дверь','A Temporary Door'),start:'road_start',stage:'arrival',status:'written',description:T('Комната, обустройство и регистрация временного адреса.','A room, settling in and registering the temporary address.')},
 {n:3,id:'districts',title:T('Поиск квартиры','Flat Hunting'),start:'morning_start',stage:'arrival',status:'written',description:T('Ася, четыре владельца и карта районов.','Asya, four landlords and the district map.')},
 {n:4,id:'moving',title:T('Свои ключи','My Own Keys'),start:'route4_start',stage:'arrival',status:'written',description:T('Договор, переезд и вечер по общему согласию.','The lease, moving and an evening by mutual consent.')},
 {n:5,id:'papers',title:T('Новый адрес и банк','A New Address and a Bank'),start:'route5_start',stage:'arrival',status:'written',description:T('Повторная регистрация и выбор банка после Alta.','Registering the new address and choosing a bank after Alta.')},
 {n:6,id:'city',title:T('Город на связи','Connected to the City'),start:'route6_start',stage:'waiting',status:'written',description:T('Связь, бесплатный транспорт, кофе и пиксельная игра.','Phone service, free transport, coffee and a pixel game.')},
 {n:7,id:'ada',title:T('Ада и арбуз','Ada and Watermelon'),start:'ada_tired',stage:'waiting',status:'written',description:T('Вода, отдых и холодная лубеница.','Water, rest and cold watermelon.')},
 {n:8,id:'friends',title:T('Компания Аси','Asya’s Friends'),start:'route8_start',stage:'waiting',status:'written',description:T('Лука, новые знакомые и общий стол.','Luka, new acquaintances and a shared table.')},
 {n:9,id:'courtyard',title:T('Свет во дворе','Light in the Courtyard'),start:'courtyard_invite',stage:'waiting',status:'written',description:T('Подготовка и дворовый кинопоказ.','Preparing a courtyard film screening.')},
 {n:10,id:'novisad',title:T('Поезд в Нови-Сад','A Train to Novi Sad'),start:'route10_start',stage:'waiting',status:'written',description:T('Поездка с выбранным спутником.','A trip with a companion of my choice.')},
 {n:11,id:'masked',title:T('Знакомый голос','A Familiar Voice'),start:'route11_start',stage:'waiting',status:'written',description:T('Новая встреча с сотрудником в маске.','Another meeting with the masked officer.')},
 {n:12,id:'border',title:T('Туда и обратно','There and Back'),start:'route12_start',stage:'waiting',status:'written',description:T('Поездка за границу с самостоятельной проверкой условий въезда.','A trip abroad with an independent check of entry conditions.')},
 {n:13,id:'misunderstanding',title:T('Не то сообщение','The Wrong Message'),start:'route13_start',stage:'decision',status:'written',description:T('Недоразумение между друзьями и честный разговор.','A misunderstanding between friends and an honest talk.')},
 {n:14,id:'last-evening',title:T('Последний вечер лета','The Last Summer Evening'),start:'route14_start',stage:'decision',status:'written',description:T('Встречи, переписка и время для себя.','Meetings, messages and time for myself.')},
 {n:15,id:'answer',title:T('Ответ на лето','An Answer for the Summer'),start:'route15_start',stage:'decision',status:'written',description:T('Моё решение о будущем и эпилоги.','My decision about the future and the epilogues.')},
];
export const dayFor=n=>DAYS.find(d=>d.n===n);
for(const d of DAYS){T('День '+d.n,'Day '+d.n);T('День '+d.n+' · '+d.title,'Day '+d.n+' · '+DAYS_TRANSLATIONS[d.title]);T('Продолжить · День '+d.n,'Continue · Day '+d.n);}
