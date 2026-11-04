// Bank chapter. The hero reads a simplified guide page on the phone, chooses a branch and goes in person on day 2.
// Nothing here guarantees an account: the bank decides, and romance has no part in it.
import {LEGACY_CHAPTERS as CHAPTERS} from './chapters.js?v=0.17.2';
import {T} from './flat-data.js?v=1';
import {BANK_FLAG,BANKS,BANK_KEYS} from './bank-data.js?v=0.17.0';

const N=(ru,en,extra={})=>({speaker:'narrator',text:T(ru,en),...extra});
const P=(ru,en,extra={})=>({speaker:'player',text:T(ru,en),...extra});
const AM=(ru,en,extra={})=>({speaker:'Ася',character:'asya',emotion:'friendly',message:true,text:T(ru,en),...extra});
const S=(name,ru,en,extra={})=>({speaker:name,text:T(ru,en),...({Невена:{character:'guest-bank-nevena',emotion:'friendly'},Богдан:{character:'guest-bank-bogdan',emotion:'friendly'}}[name]??{}),...extra});
const tap=(label,en,extra={})=>({kind:'tap',label:T(label,en),object:T(label,en),...extra});
const choice=(label,en,next,tone,effect)=>({label:T(label,en),next,tone,...(effect?{effect}:{})});

export function extendBank({NODES,JOURNAL}){
  const day2=CHAPTERS.find(c=>c.day===2);
  const base={bg:'bank-consultation',location:T('БЕЛГРАД · ОТДЕЛЕНИЕ БАНКА','BELGRADE · BANK BRANCH'),time:'09:30',day:'ДЕНЬ 2',chapterId:day2.id,chapter:day2.number+' · '+day2.title};
  const finish=(id,pages,next,extra={})=>{
    const node={...base,pages,next,...extra};
    node.actions={...(node.actions??{})};
    pages.forEach((page,index)=>{if(page.action&&!node.actions[index])node.actions[index]=page.action;});
    if(!node.choices){const index=pages.length-1;if(!node.actions[index])node.actions[index]=structuredClone(node.exitAction??tap('Продолжить','Continue'));}
    for(const [index,action]of Object.entries(node.actions))pages[Number(index)].action=action;
    NODES[id]=node;return node;
  };
  JOURNAL.bank_guide={title:T('Гид по банкам','The bank guide'),tag:T('БАНК · ГИД','BANK · GUIDE'),text:T('Прочитан{a} игровой гид: API Bank, Alta Bank, Adriatic Bank и другие. Везде нужен личный визит и документы, а решение принимает банк. Условия меняются: перед визитом их стоит уточнить у самого банка.','I read the game guide: API Bank, Alta Bank, Adriatic Bank and others. Everywhere you need an in-person visit and papers, and the bank makes the decision. Conditions change, so check them with the bank itself before going.'),link:'https://www.srb.guide/guides/banks/',linkText:T('Материалы SRB.GUIDE о банках','SRB.GUIDE material about banks')};

  // The hero plans the visit instead of calling the bank.
  const plan=NODES.bank_plan;
  const workChapter=NODES.work_business;
  finish('bank_evening_pause',[structuredClone(NODES.afternoon_invite.pages[1])],
    'afternoon_invite',{bg:'room-window',location:T('БЕЛГРАД · ВЕЧЕР ДОМА','BELGRADE · EVENING AT HOME'),time:'18:40',day:workChapter.day,chapterId:workChapter.chapterId,chapter:workChapter.chapter,effectOnEnter:{eveningIntroShown:true}});
  for(const id of ['work_business','work_employment','work_explore'])NODES[id].next='bank_evening_pause';
  finish('bank_helper',[
    N('Борис появляется в малиновом пиджаке с телефоном в руке. Говорит быстро, будто у каждого вопроса уже есть готовый ответ.','Boris appears in a raspberry blazer, phone in hand. He speaks quickly, as if he already has an answer for every question.',{character:'guest-bank-helper',emotion:'friendly'}),
    S('Борис','Привет! Я помогу подготовить вопросы, документы и запись. Но счёт открывает только банк; никаких гарантий я дать не могу.','Hi! I can help prepare questions, papers and an appointment. But only the bank opens accounts; I cannot guarantee anything.',{character:'guest-bank-helper',emotion:'friendly'}),
    S('Борис','Сначала уточним условия и стоимость моих услуг. Паспорт и подтверждение адреса пригодятся; точный список нужно проверить в выбранном банке.','First let’s clarify the terms and my fee. A passport and proof of address will help; check the exact list with your chosen bank.',{character:'guest-bank-helper',emotion:'friendly'}),
    N('Предложение звучит гладко. Я могу задать вопросы, выбрать отделение или вернуться к гайду Олега.','The pitch sounds smooth. I can ask questions, choose a branch, or return to Oleg’s guide.',{character:'guest-bank-helper',emotion:'friendly'})
  ],null,{bg:'room-window',location:T('БЕЛГРАД · ПОМОЩНИК','BELGRADE · ASSISTANT'),time:'16:20',day:plan.day,chapterId:plan.chapterId,chapter:plan.chapter,choices:[
    choice('С Борисом: API Bank','With Boris: API Bank','bank_call','practical',{bankChoice:'api'}),
    choice('С Борисом: Alta Bank','With Boris: Alta Bank','bank_call','practical',{bankChoice:'alta'}),
    choice('С Борисом: Adriatic Bank','With Boris: Adriatic Bank','bank_call','practical',{bankChoice:'adriatic'}),
    choice('Вместо этого открыть гайд Олега','Open Oleg’s guide instead','bank_plan','personal',{bankHelp:'guide'})
  ]});
  plan.time='16:20';
  plan.pages[0]={...plan.pages[0],text:T('В своей квартире становится тихо, и я открываю в телефоне следующую вкладку: банк. На этот раз это страница, оформленная как гид.','The flat goes quiet and I open the next tab on my phone: the bank. This time it is a page laid out like a guide.'),byFlag:{flag:'rentalMoved',text:{true:T('В своей квартире становится тихо, и я открываю в телефоне следующую вкладку: банк. На этот раз это страница, оформленная как гид.','The flat goes quiet and I open the next tab on my phone: the bank. This time it is a page laid out like a guide.'),default:T('За столом временной комнаты я открываю в телефоне следующую вкладку: банк. На этот раз это страница, оформленная как гид.','At the desk of my temporary room I open the next tab on my phone: the bank. This time it is a page laid out like a guide.')}}};
  plan.pages[1]={...plan.pages[1],text:T('«Не собирай документы по чужой удачной истории. Банки решают сами, а условия меняются. Сравни варианты, потом решим, куда идти лично».','“Do not gather papers based on someone else’s lucky story. Banks decide for themselves, and conditions change. Compare the options, then we will decide where to go in person.”')};
  plan.pages[2]={...plan.pages[2],text:T('Гид открыт. Можно прочитать про каждый банк и выбрать, куда пойти. По телефону такие вопросы не решают: нужен личный визит.','The guide is open. I can read about each bank and choose where to go. Questions like this are not settled by phone: an in-person visit is needed.')};
  const open=tap('Открыть гид на телефоне','Open the guide on the phone',{quest:'bank-guide'});
  plan.actions={2:open};plan.pages[2].action=plan.actions[2];
  const retired=plan.choices.map(old=>({...old,when:{flag:'bankGuide',equals:'retired'}}));
  plan.choices=[
    ...retired,
    choice('API Bank — идти в отделение','API Bank: go to the branch','bank_call','practical',{bankChoice:'api'}),
    choice('Alta Bank — идти в отделение','Alta Bank: go to the branch','bank_call','practical',{bankChoice:'alta'}),
    choice('Adriatic Bank — идти в отделение','Adriatic Bank: go to the branch','bank_call','practical',{bankChoice:'adriatic'})
  ];
  plan.journal=[...(plan.journal??[]),'bank_guide'];
  // bank_call was a phone call to an employee; it is now the preparation for the visit (same three pages, same checklist).
  const call=NODES.bank_call;
  call.time='16:40';
  call.pages[0]={...call.pages[0],speaker:'player',text:T('Звонить не буду: на такие вопросы отвечают «приходите лично». Соберу папку сегодня — в отделение пойду завтра.','I will not call: questions like these get the answer “come in person”. I will pack a folder today — and go to the branch tomorrow.')};
  call.pages[1]=AM('Папка: паспорт, подтверждение адреса, список вопросов. Остальное банк спросит сам. Прийти спокойно уже половина дела.','The folder: passport, proof of address, a list of questions. The bank will ask the rest itself. Arriving calmly is half the job.');
  call.pages[2]={...call.pages[2],text:T('Это ещё не «счёт открыт». Зато у меня есть понятный план: личный визит и папка, в которой всё на месте.','This is not “the account is open” yet. But I have a clear plan: an in-person visit and a folder with everything in place.')};
  for(const id of ['work_crossroads'])NODES[id].time='17:20';

  // Day 2 starts with packing for the branch.
  const morning=NODES.third_morning;
  for(const action of [morning.exitAction,morning.actions[2],morning.pages[2].action])if(action){action.label=T('Собраться в отделение банка','Get ready for the bank branch');action.object=action.label;}

  // Three branches. Staff differ, and so do the situations.
  const staff={api:T('Милан','Milan'),alta:T('Невена','Nevena'),adriatic:T('Богдан','Bogdan')};
  finish('bank_visit_api',[
    N('Отделение API Bank прячется на тихой улице. Электронный талон, зелёный диван и кондиционер, который держится увереннее меня.','The API Bank branch hides on a quiet street. A ticket machine, a green sofa and an air conditioner that holds up better than I do.',{portrait:false}),
    S(staff.api,'Добрый день. Проходите. Паспорт и подтверждение адреса, пожалуйста. Остальное выясним по ходу разговора.','Good afternoon. Come in. Your passport and proof of address, please. We will find out the rest as we go.',{character:'guest-bank-staff',emotion:'friendly'}),
    P('Всё со мной. Хочу узнать, можно ли открыть личный счёт в моей ситуации и что для этого нужно.','I have everything. I want to know whether I can open a personal account in my situation and what it takes.'),
    S(staff.api,'Можно или нет, решает банк после проверки. Я запишу данные и объясню, о чём спросят дальше. Заранее ничего не обещаю.','Whether you can is for the bank to decide after a check. I will note your details and explain what will be asked next. I promise nothing in advance.',{character:'guest-bank-staff',emotion:'friendly'}),
    N('Подтверждение адреса оказывается именно тем, что нужно. Приятно, когда труд окупается.','The proof of address turns out to be exactly what is needed. It is nice when the effort pays off.',{byFlag:{flag:'rentalMoved',text:{true:T('Договор аренды, который я недавно читал{a} по пунктам, оказывается именно тем подтверждением адреса. Приятно, когда труд окупается.','The lease I recently read point by point turns out to be exactly the proof of address. It is nice when the effort pays off.'),default:T('Подтверждение адреса, которое оформили в первый вечер, оказывается именно тем, что нужно. Приятно, когда труд окупается.','The proof of address arranged on the first evening turns out to be exactly what is needed. It is nice when the effort pays off.')}},portrait:false})
  ],null,{legacyOnly:true,time:'09:30',choices:[
    choice('Уточнить, какие подтверждения нужны именно мне','Ask which confirmations I need in particular','bank_api_docs','practical',{bankVisitFocus:'documents'}),
    choice('Сначала разобраться в тарифах и обслуживании','First understand the tariffs and service','bank_api_cost','practical',{bankVisitFocus:'cost'})
  ]});
  finish('bank_api_docs',[
    S(staff.api,'Обычно спрашивают о цели счёта и о том, откуда будут поступать деньги. Это стандартная процедура, не повод тревожиться.','They usually ask about the purpose of the account and where the money will come from. It is a standard procedure, nothing to worry about.',{character:'guest-bank-staff',emotion:'friendly'}),
    P('Я планирую получать доход от работы и оплачивать жильё и связь. Нужные подтверждения принесу, когда скажете.','I plan to earn an income from work and pay for housing and phone service. I will bring whatever confirmations you name.'),
    S(staff.api,'Хорошо. Заявление уйдёт на рассмотрение, ответ пришлём письмом. Иногда просят дополнительные бумаги.','Good. The application goes for review and we will answer by letter. Sometimes extra papers are requested.',{character:'guest-bank-staff',emotion:'friendly'})
  ],'bank_followup',{time:'10:20',exitAction:tap('Записать недостающие подтверждения','Note any missing confirmations',{effect:{bankVisitFocus:'documents'}})});
  finish('bank_api_cost',[
    P('Покажите, пожалуйста, стоимость обслуживания и условия переводов. Хочу понимать расходы заранее.','Could you show me the service fees and the transfer terms, please? I want to know the costs in advance.'),
    S(staff.api,'Конечно. Вот действующий тариф. Если появятся вопросы по отдельной операции, спросите до её выполнения.','Of course. Here is the current tariff. If you have questions about a particular operation, ask before it is carried out.',{character:'guest-bank-staff',emotion:'friendly'}),
    N('Я прошу повторить один пункт медленнее. Никто не вздыхает. Жаль, что не попросил{a} раньше.','I ask them to repeat one point more slowly. Nobody sighs. A pity I did not ask sooner.',{portrait:false})
  ],'bank_followup',{time:'10:20',exitAction:tap('Сохранить вопросы к тарифам','Save my questions about fees',{effect:{bankVisitFocus:'cost'}})});

  finish('bank_visit_alta',[
    N('В Alta Bank очередь живая: у стойки двое посетителей, по залу ходит администратор с планшетом.','At Alta Bank the queue is alive: two visitors at the counter and an administrator with a tablet walking the hall.'),
    S(staff.alta,'Здравствуйте. Вы записаны? Нет? Тогда окно через сорок минут. Можно подождать или записаться на другой день.','Hello. Do you have an appointment? No? Then a window opens in forty minutes. You can wait or book another day.'),
    P('Спасибо. Мне нужно понять, возможно ли вообще открыть личный счёт в моей ситуации.','Thank you. I need to understand whether it is possible at all to open a personal account in my situation.'),
    S(staff.alta,'Это решит специалист после документов и анкеты. Сначала запись, потом разговор. Заранее обещать не могу.','A specialist will decide after the papers and the questionnaire. First an appointment, then the conversation. I cannot promise anything in advance.')
  ],null,{legacyOnly:true,time:'09:30',choices:[
    choice('Подождать и выпить кофе рядом','Wait and have a coffee nearby','bank_alta_wait','explore',{bankVisitFocus:'documents'}),
    choice('Записаться на завтрашнее утро','Book tomorrow morning','bank_alta_book','practical',{bankVisitFocus:'cost'})
  ]});
  finish('bank_alta_wait',[
    N('Кофейня напротив пахнет кардамоном. Я занимаю место у окна, откуда видно дверь банка.','The café opposite smells of cardamom. I take a seat by the window with a view of the bank’s door.',{portrait:false}),
    {speaker:'contact',message:true,text:T('«Как банк? Если очередь длинная, пиши: развлеку шуткой про бюрократию».','“How is the bank? If the queue is long, write to me and I will entertain you with a joke about bureaucracy.”'),contactText:{nikola:T('«Как банк? Если очередь длинная, пиши: развлеку шуткой про бюрократию».','“How is the bank? If the queue is long, write to me and I will entertain you with a joke about bureaucracy.”'),milica:T('«Как банк? Если очередь длинная, нарисую её тебе в блокноте».','“How is the bank? If the queue is long, I will draw it for you in my notebook.”')}},
    N('Я отвечаю, что держусь, и возвращаюсь в отделение. Окно как раз освободилось.','I answer that I am holding up, and go back to the branch. A window has just freed up.',{portrait:false})
  ],'bank_alta_window',{time:'10:10',exitAction:tap('Вернуться в отделение','Go back to the branch')});
  finish('bank_alta_window',[
    S(staff.alta,'Проходите. Паспорт, адрес, анкета. Заполняйте спокойно: ошибки не страшны, зачёркивайте.','Come in. Passport, address, questionnaire. Fill it in calmly: mistakes are fine, just cross them out.'),
    N('Анкета занимает три страницы. На одной спрашивают о цели счёта; я пишу честно и коротко.','The questionnaire takes three pages. One asks about the purpose of the account; I write honestly and briefly.'),
    N('Документы приняты. Решение примет специалист, ответ придёт письмом, иногда просят дополнить. Карту сегодня не выдали, зато следующий шаг понятен.','The papers are accepted. A specialist will decide and the answer comes by letter; sometimes they ask for more. No card today, but the next step is clear.')
  ],'bank_followup',{time:'10:50',exitAction:tap('Сложить документы в папку','Put the papers back in the folder')});
  finish('bank_alta_book',[
    S(staff.alta,'Завтра в десять есть время у специалиста, который говорит по-английски. Запишу вас.','Tomorrow at ten a specialist who speaks English has time. I will book you in.'),
    P('Да, пожалуйста. Мне так спокойнее: приду с заполненной анкетой.','Yes, please. I feel calmer that way: I will come with the questionnaire filled in.'),
    N('Талон с датой лежит в папке. Не самый эффектный результат, зато без суеты.','The slip with the date lies in the folder. Not the most dramatic result, but without the rush.',{portrait:false})
  ],'bank_followup',{time:'09:55',exitAction:tap('Убрать талон в папку','Put the slip in the folder',{effect:{bankBookedOnly:true}})});

  finish('bank_visit_adriatic',[
    N('Международный отдел Adriatic Bank на втором этаже. Лифт ждёт дольше, чем я ожидал{a}, а тишина в коридоре звучит официально.','The international department of Adriatic Bank is on the second floor. The lift takes longer than I expected and the silence in the corridor sounds official.'),
    S(staff.adriatic,'Добрый день. Присаживайтесь. Паспорт, адрес проживания. Расскажите, для чего вам нужен счёт.','Good afternoon. Please sit down. Passport, proof of address. Tell me what you need the account for.'),
    P('Для оплаты жилья и связи, потом для работы. Хочу понять, возможно ли это в моей ситуации.','For rent and phone service, later for work. I want to understand whether that is possible in my situation.'),
    S(staff.adriatic,'Возможно, но с проверкой. Могу попросить дополнительное подтверждение. Заранее гарантировать результат не могу.','Possibly, but with a check. I may ask for additional confirmation. I cannot guarantee a result in advance.')
  ],null,{legacyOnly:true,time:'09:40',choices:[
    choice('Спокойно объяснить и спросить, какое подтверждение подойдёт','Explain calmly and ask which confirmation would do','bank_adriatic_docs','practical',{bankVisitFocus:'documents'}),
    choice('Попросить список письменно и всё обдумать','Ask for the list in writing and think it over','bank_adriatic_list','personal',{bankVisitFocus:'cost'})
  ]});
  finish('bank_adriatic_docs',[
    P('Какое подтверждение вам нужно: договор аренды, справка о доходах или что-то другое?','Which confirmation do you need: a lease, proof of income or something else?'),
    S(staff.adriatic,'Подойдут договор аренды и пояснение о доходах. Если что-то из этого есть, принесите ко второму визиту.','A lease and an explanation of income will do. If you have any of it, bring it to the second visit.'),
    N('Второй визит. Я записываю это без драматизма: иногда банки работают именно так.','A second visit. I note it down without drama: sometimes banks simply work this way.',{portrait:false})
  ],'bank_followup',{time:'10:30',exitAction:tap('Записать недостающие подтверждения','Note any missing confirmations',{effect:{bankVisitFocus:'documents'}})});
  finish('bank_adriatic_list',[
    P('Можно получить список письменно? Хочу принести всё за один раз.','May I have the list in writing? I want to bring everything in one go.'),
    S(staff.adriatic,'Конечно. Отправлю письмом сегодня. Если что-то в списке будет непонятно, спросите до визита.','Of course. I will send it by email today. If anything in the list is unclear, ask before the visit.'),
    N('Бумаг я не подписываю и не оставляю. Список придёт письмом, а решение будет только после проверки.','I sign nothing and leave nothing behind. The list will come by email and the decision comes only after a check.',{portrait:false})
  ],'bank_followup',{time:'10:30',exitAction:tap('Сохранить вопросы к тарифам','Save my questions about fees',{effect:{bankVisitFocus:'cost'}})});

  // Booking-only Alta path has a slip for tomorrow, not today's marked email.
  const follow=NODES.bank_followup;
  if(follow?.pages?.[0]){
    follow.pages[0]={...follow.pages[0],text:T('У выхода приходит письмо из банка. В нём — отмеченные пункты, тарифы и контакт для следующего вопроса.','At the exit, the bank’s email arrives. It contains the marked items, fees and a contact for my next question.'),byFlag:{flag:'bankBookedOnly',text:{true:T('У выхода в папке только талон на завтра. Письмо со списком и тарифами обещали после приёма.','At the exit the folder holds only tomorrow’s slip. They promised the list and fees by email after the appointment.'),default:T('У выхода приходит письмо из банка. В нём — отмеченные пункты, тарифы и контакт для следующего вопроса.','At the exit, the bank’s email arrives. It contains the marked items, fees and a contact for my next question.')}}};
    follow.pages[2]={...follow.pages[2],text:T('«Как прошло? Я рядом с мастерской. Приходи, у нас как раз освободился стол».','‘How did it go? I am by the workspace. Come over, a table has just become free.’'),byFlag:{flag:'bankBookedOnly',text:{true:T('«Записался{a}? Я рядом с мастерской. Приходи — расскажешь про талон, у нас как раз освободился стол».','‘Did you get an appointment? I am by the workspace. Come over — tell me about the slip; a table has just become free.’'),default:T('«Как прошло? Я рядом с мастерской. Приходи, у нас как раз освободился стол».','‘How did it go? I am by the workspace. Come over, a table has just become free.’')}}};
  }
}

// Day 2: the chosen branch replaces the generic visit. Older saves without a choice keep the original scenes.
export function bankRedirect(from,target,flags={}){
  if(from==='flat_settle'&&target==='bank_path')return flags.bankHelp==='helper'?'bank_helper':'bank_plan';
  if(from==='flat_registration'&&target==='bank_path')return flags.bankHelp==='helper'?'bank_helper':'bank_plan';
  if(from==='third_morning'&&target==='bank_visit'&&flags.rentalMoved===true&&flags.rentalCast==='new'&&flags.whiteCardDone!==true)return 'white_card_visit';
  if(['third_morning','white_card_visit'].includes(from)&&target==='bank_visit'&&BANK_KEYS.slice(0,3).includes(flags.bankChoice))return 'bank_visit_'+flags.bankChoice;
  return target;
}
export {BANK_FLAG,BANKS};
