// Fictional outcomes belong to this playthrough, not to the visitor's real records.
export const CHAPTER_FIVE_TRANSLATIONS={};
const T=(ru,en)=>(CHAPTER_FIVE_TRANSLATIONS[ru]=en,ru);
export function extendFifthChapter({NODES:N,JOURNAL:J,BACKGROUNDS:B,n,y,msg,scene}){
 const mood=text=>/свидани|поцел|ладонь|ближе|красив|прикосн|нравишь/iu.test(text)?'flirty':/документ|договор|вопрос|провер|заяв|услов|адрес|план/iu.test(text)?'thoughtful':'friendly';
 const a=text=>({speaker:'Ася',character:'asya',emotion:mood(text),text});
 const l=text=>({speaker:'Лука',character:'luka',emotion:mood(text),text});
 const contact=(nikola,milica,message=false)=>({speaker:'contact',text:milica,contactText:{nikola,milica},message});
 const owner=(dragan,jelena)=>({speaker:'districtHost',text:dragan,districtText:{dragan,jelena}});
 const route=(business,employment,explore)=>({speaker:'narrator',text:business,workText:{business,employment,explore}});
 const out=label=>({kind:'tap',label,object:label});
 const s=(pages,next,extra={})=>scene(pages,next,{bg:'document-desk',location:T('БЕЛГРАД · НОВЫЙ ШАГ','BELGRADE · A NEW STEP'),time:'09:10',day:T('НЕСКОЛЬКО ДНЕЙ В БЕЛГРАДЕ','A FEW DAYS IN BELGRADE'),exitAction:out(T('Продолжить день','Continue the day')),...extra});
 for(const [id,label,description]of [
  ['document-desk',T('КОМНАТА · ПАПКА С ДОКУМЕНТАМИ','ROOM · DOCUMENT FOLDER'),T('Светлый стол у окна, закрытая папка, блокнот и утренний свет','A bright window desk with a closed folder, notebook and morning light')],
  ['registry-lobby',T('БЕЛГРАД · ПРИЁМНАЯ','BELGRADE · RECEPTION'),T('Спокойная светлая приёмная с местами для ожидания и стойкой','A calm, bright reception area with waiting chairs and a counter')],
  ['belgrade-morning-cafe',T('БЕЛГРАД · КАФЕ В ГОРОДЕ','BELGRADE · A CITY CAFÉ'),T('Кафе на тихой белградской улице, столики и мягкий солнечный свет','A café on a quiet Belgrade street, with tables and gentle sunlight')]
 ])B[id]={label,description,position:id==='document-desk'?'50% 78%':'50% 42%'};
 Object.assign(J,{
  housing_packet:{title:T('Адрес без догадок','An address without guesswork'),tag:T('ЖИЛЬЁ · ПОДТВЕРЖДЕНИЯ','HOUSING · EVIDENCE'),text:T('Условия жилья и подтверждения по адресу собраны отдельно. Адрес временного пребывания, условия аренды и документы для будущего основания проживания не подменяют друг друга. В этой истории непонятные пункты уточнили до следующего шага.','Housing terms and address evidence are collected separately. A temporary-stay address, rental terms and documents for a future residence basis do not replace one another. In this story, unclear points were checked before moving on.')},
  bank_account_story:{title:T('Первый местный счёт','My first local account'),tag:T('БАНК · РЕЗУЛЬТАТ ИСТОРИИ','BANK · STORY OUTCOME'),text:T('В этой вымышленной истории выбранный банк одобрил заявление после проверки предоставленных подтверждений. Игрок получил условия обслуживания и инструкции банка. Это сюжетный результат: реальные требования и решения зависят от банка и обстоятельств заявителя.','In this fictional story, the chosen bank approved the application after reviewing the supplied evidence. The player received the service terms and the bank’s instructions. This is a story outcome: actual requirements and decisions depend on the bank and the applicant’s circumstances.'),link:'https://welcometoserbia.gov.rs/opening-bank-accounts-for-residents-and-non-residents',linkText:T('Официальная информация о счетах','Official information about accounts')},
  business_registered_story:{title:T('Имя в реестре','A name in the register'),tag:T('РАБОТА · СВОЁ ДЕЛО','WORK · MY OWN BUSINESS'),text:T('После выбранной подачи и отдельного периода ожидания в истории получено решение о регистрации предпринимателя. Лука помог сверить следующий список обязанностей и действий. Регистрация бизнеса сама по себе не является разрешением на проживание или работу.','After the selected filing and a separate waiting period, the story received a decision registering the entrepreneur. Luka helped review the next list of duties and actions. Business registration is not itself permission to reside or work.'),link:'https://apr.gov.rs/services/eservices/e-incorporation-of-sole-proprietors.4266.html',linkText:T('APR: регистрация предпринимателя','APR: registering an entrepreneur')},
  employment_signed_story:{title:T('Условия, которые мне подходят','Terms I can agree to'),tag:T('РАБОТА · ДОГОВОР','WORK · CONTRACT'),text:T('После знакомства с командой, собеседования и обсуждения условий в вымышленной истории подписан договор. Далее отдельно проверяются основание проживания и оформление права на работу; предложение или договор не заменяют нужного разрешения.','After meeting the team, interviewing and discussing the terms, a contract was signed in the fictional story. The residence basis and the right to work are checked separately next; an offer or contract does not replace the required permission.'),link:'https://welcometoserbia.gov.rs/residence-and-work-permit',linkText:T('Проживание и право на работу','Residence and the right to work')},
  residence_submitted_story:{title:T('Заявление принято к рассмотрению','Application received for review'),tag:T('ПРОЖИВАНИЕ · ОЖИДАНИЕ','RESIDENCE · WAITING'),text:T('В выбранной сюжетной ветке после подготовки подходящего рабочего основания заявление на единое разрешение подано электронно. Сохранено подтверждение приёма и выбран способ следить за запросами. Приём заявления ещё не означает одобрение. Игра не отправляет реальные документы.','In the selected story route, an application for a single permit was filed electronically after preparing the relevant work basis. The receipt was saved and a way to monitor requests was chosen. Receipt does not mean approval. The game submits no real documents.'),link:'https://welcometoserbia.gov.rs/residence-and-work-permit',linkText:T('Официальный портал о едином разрешении','Official single-permit portal')},
  residence_review_story:{title:T('Сначала понять основание','Understand the basis first'),tag:T('ПРОЖИВАНИЕ · ПОДГОТОВКА','RESIDENCE · PREPARATION'),text:T('Игрок выбрал дополнительную проверку до подачи. В папке остались вопросы об основании, документах и дальнейших действиях. Заявление на проживание в этой ветке ещё не подано; своё дело или работа по найму не выбираются автоматически.','The player chose further checks before filing. The folder contains questions about the basis, documents and next steps. No residence application has been filed on this route; running a business or taking employment is not selected automatically.'),link:'https://welcometoserbia.gov.rs/temporary-residence',linkText:T('Официальная информация о проживании','Official residence information')},
  chapter_five_evening:{title:T('Вечер тоже в планах','An evening belongs in the plan too'),tag:T('ЛЮДИ · СВОЙ ТЕМП','PEOPLE · MY OWN PACE'),text:T('После дел получилось выбрать, кому написать и как провести время: приблизиться, договориться о свидании или просто увидеться по-дружески. Никто не должен становиться наградой за правильно собранные документы.','After the practical matters, I chose whom to message and how to spend the time: get closer, arrange a date or simply meet as friends. Nobody has to become a reward for assembling documents correctly.')}
 });
 Object.assign(N,{
  fourth_morning:s([
   n(T('Утром я раскладываю вчерашние заметки на столе. Часть уже можно убрать: за ней появились ответы.','In the morning, I spread yesterday’s notes on the desk. Some can be put away now: they have answers behind them.')),
   msg(T('Ася','Asya'),T('«Сегодня предлагаю взрослый аттракцион: сначала довести одно дело до конца, потом нормально поесть».','‘Today I suggest an adult attraction: finish one thing first, then have a proper meal.’')),
   route(T('В черновике своего дела остаются вопросы об адресе. Начну с них, а не с придумывания ещё одного названия.','The business draft still has address questions. I will start there, rather than invent another name.'),T('Перед знакомством с командой хочу закрыть вопросы с жильём и банком. Пусть хотя бы эти вкладки перестанут мигать.','Before meeting the team, I want to settle the housing and bank questions. Let those tabs stop flashing, at least.'),T('Я ещё выбираю рабочий маршрут. Но адрес и ответ банку можно уточнить уже сейчас.','I am still choosing a working path. But I can clarify the address and answer the bank now.'))
  ],'housing_packet',{time:'08:40',exitAction:{kind:'checklist',label:T('Открыть папку и выбрать порядок дел','Open the folder and put the tasks in order'),items:[T('Условия жилья и адрес','Housing terms and address'),T('Ответ на письмо банка','Reply to the bank’s email'),T('Следующий шаг по работе','The next working step')]}}),
  housing_packet:s([
   n(T('В телефоне два файла от {districtHost}: условия по квартире и ответ на мои вопросы об адресе. Наконец это не фотографии чужих комнат.','There are two files from {districtHost} on my phone: the flat’s terms and answers to my address questions. At last, these are more than pictures of somebody else’s rooms.')),
   n(T('Я открываю оба рядом. У каждого свой смысл, и слово «документы» больше не кажется одной огромной коробкой.','I open them side by side. Each has its own purpose, and “documents” no longer feels like one enormous box.')),
   y(T('Хочу разобраться сам{a}. Но вопросы задам вслух.','I want to understand this myself. But I will ask my questions aloud.'))
  ],null,{choices:[
   {label:T('Сначала пройти по условиям жилья','Go through the housing terms first'),tone:'practical',next:'housing_terms'},
   {label:T('Сначала уточнить подтверждения по адресу','Clarify the address evidence first'),tone:'practical',next:'housing_address'}
  ]}),
  housing_terms:s([
   owner(T('Я выделил общую стоимость и то, что в неё входит. Остальное обсудим отдельно, чтобы ничего не пряталось между строчек.','I highlighted the total cost and what it includes. We can discuss the rest separately, so nothing hides between the lines.'),T('Я выделила общую стоимость и то, что в неё входит. Остальное обсудим отдельно, чтобы ничего не пряталось между строчек.','I highlighted the total cost and what it includes. We can discuss the rest separately, so nothing hides between the lines.')),
   y(T('Спасибо. Вот здесь я хочу уточнить платежи и порядок расторжения. Остальное уже понятнее.','Thank you. Here I want to clarify the payments and termination arrangements. The rest already makes more sense.')),
   n(T('После разговора я записываю, что выяснено, а что ещё нужно проверить. Соглашаться только из неловкости больше не хочется.','After the conversation, I note what is clear and what still needs checking. I no longer want to agree just to avoid awkwardness.'))
  ],'bank_send',{districtPortrait:true,districtBg:true,journal:['housing_packet'],effectOnEnter:{housingDocumentsChecked:true},exitAction:out(T('Сохранить условия и оставшиеся вопросы','Save the terms and remaining questions'))}),
  housing_address:s([
   owner(T('Пришлю подтверждения, которые могу предоставить. Если для выбранной процедуры потребуется что-то ещё, уточним это по списку.','I will send the evidence I can provide. If the chosen process requires anything else, we can check it against the list.'),T('Пришлю подтверждения, которые могу предоставить. Если для выбранной процедуры потребуется что-то ещё, уточним это по списку.','I will send the evidence I can provide. If the chosen process requires anything else, we can check it against the list.')),
   n(T('Я сверяю написание имени, адрес и то, к какой задаче относится каждый файл. Одна исправленная буква приятно уменьшает масштаб тревоги.','I check the spelling of my name, the address and which task each file belongs to. One corrected letter pleasantly reduces the scale of my anxiety.')),
   y(T('Теперь я понимаю, что у меня есть. С остальным приду уже с конкретным вопросом.','Now I understand what I have. I will come back with a specific question about the rest.'))
  ],'bank_send',{districtPortrait:true,districtBg:true,journal:['housing_packet'],effectOnEnter:{housingDocumentsChecked:true},exitAction:out(T('Разложить подтверждения по задачам','Sort the evidence by task'))}),
  bank_send:s([
   n(T('Я возвращаюсь к письму банка. Добавляю запрошенные подтверждения и коротко поясняю каждый файл.','I return to the bank’s email. I attach the requested evidence and briefly explain each file.')),
   y(T('Здравствуйте. Направляю дополнения после консультации. Пожалуйста, сообщите, если нужно что-то уточнить.','Hello. Here are the additions following the consultation. Please let me know if anything needs clarification.')),
   n(T('Проверяю адрес получателя и отправляю. Впервые за утро можно закрыть одну вкладку.','I check the recipient’s address and send it. For the first time this morning, I can close a tab.'))
  ],'bank_approved',{time:'11:20',exitAction:out(T('Отправить подготовленный ответ банку','Send the prepared reply to the bank'))}),
  bank_approved:s([
   n(T('Проходит несколько дней. Между письмами успевают появиться обычные вещи: знакомый магазин, любимый поворот и привычка брать воду с собой.','A few days pass. Between emails, ordinary things appear: a familiar shop, a favourite turn and the habit of carrying water.')),
   msg(T('Банк','Bank'),T('«Ваше заявление одобрено. Приглашаем завершить оформление и ознакомиться с условиями обслуживания».','‘Your application has been approved. Please come in to complete the process and review the service terms.’')),
   n(T('В отделении я ещё раз прохожу по условиям и получаю инструкции. У моего имени теперь есть местный счёт — маленькая, очень конкретная опора.','At the branch, I go through the terms again and receive the instructions. My name now has a local account attached: a small, very concrete foothold.')),
   y(T('Можно ещё раз показать, где искать тарифы и как связаться с поддержкой?','Could you show me again where to find the fees and how to contact support?'))
  ],'work_review',{bg:'bank-consultation',time:'10:30',day:T('НЕСКОЛЬКО ДНЕЙ СПУСТЯ','A FEW DAYS LATER'),effectOnEnter:{bankAccountOpen:true},journal:['bank_account_story'],exitAction:out(T('Сохранить условия обслуживания и контакты банка','Save the service terms and bank contacts'))}),
  work_review:s([
   a(T('Поздравляю. Теперь у тебя есть банковский счёт и право сегодня немного собой гордиться.','Congratulations. You now have a bank account and the right to feel a little proud of yourself today.')),
   route(T('Возвращаюсь к своему делу. После прошлой встречи я пересчитал{a} расходы и дописал{a} вопросы. Теперь решение выглядит предметнее.','I return to my business plan. Since the last meeting, I have reviewed the costs and added my questions. The decision feels more concrete now.'),T('Возвращаюсь к знакомству с командой. Хочется услышать, что мы можем предложить друг другу, а не только удачно рассказать о себе.','I return to meeting the team. I want to hear what we can offer one another, rather than merely introduce myself well.'),T('Я ещё выбираю. Но теперь могу объяснить, что мне важно: задачи, люди и расходы, которые не приходится угадывать.','I am still choosing. But I can now explain what matters to me: the work, the people and costs I do not have to guess.')),
   l(T('Можем продолжить выбранный маршрут или изменить его. Только давай назовём решение своим именем.','We can continue with your chosen path or change it. Let us just be clear about the decision.'))
  ],null,{bg:'workshop-office',character:'luka',time:'12:10',choices:[
   {label:T('Продолжить со своим делом','Continue with my own business'),tone:'practical',next:'business_check',effect:{workRoute:'business'}},
   {label:T('Пройти знакомство с командой и обсудить условия','Meet the team and discuss the terms'),tone:'practical',next:'employment_terms',effect:{workRoute:'employment'}},
   {label:T('Пока собрать вопросы и не выбирать наспех','Collect my questions without rushing a choice'),tone:'personal',next:'explore_plan',effect:{workRoute:'explore'}}
  ]}),
  business_check:s([
   l(T('Описание деятельности и адрес мы уточнили. Бюджет ты пересчитал{a}. Перед подачей ещё раз проверим форму, документы и оставшиеся обязанности.','We clarified the activity description and address. You reviewed the budget. Before filing, let us check the form, documents and remaining duties once more.')),
   n(T('Я прохожу по списку и исправляю то, что обнаружилось при проверке. Этот черновик уже не хочется закрывать, когда кто-нибудь смотрит через плечо.','I go through the list and correct the points found during the review. I no longer want to hide this draft when someone looks over my shoulder.')),
   y(T('Хочу понимать, что будет после регистрации. Не только день, когда появится запись.','I want to understand what follows registration, not only the day the entry appears.'))
  ],null,{bg:'workshop-office',character:'luka',choices:[
   {label:T('Подать проверенную заявку выбранным способом','File the reviewed application through the chosen channel'),tone:'practical',next:'business_registered'},
   {label:T('Оставить подачу на потом и сохранить расчёты','Leave filing for later and save the calculations'),tone:'personal',next:'c5_business_pause'}
  ]}),
  business_registered:s([
   n(T('После подачи проходит отдельное время ожидания. Я отвечаю на уточнения и однажды открываю письмо, которое уже не просит прислать ещё один файл.','A separate waiting period follows the filing. I answer the requests for clarification and eventually open an email that does not ask for another file.')),
   l(T('Решение о регистрации получено. Поздравляю. Давай теперь пройдём по тому, что ты сохранишь и что нужно сделать дальше.','The registration decision has arrived. Congratulations. Now let us go through what you will save and what needs doing next.')),
   n(T('В этой записи моё имя выглядит неожиданно серьёзно. Не громко и не навсегда — просто теперь за ним стоит настоящее решение.','My name looks unexpectedly serious in that entry. Not loud, and not forever: there is simply a real decision behind it now.')),
   l(T('Следующий разговор — про основание проживания и право работать. Регистрация не отвечает на эти вопросы автоматически.','The next conversation concerns the residence basis and the right to work. Registration does not answer those questions automatically.'))
  ],null,{bg:'registry-lobby',character:'luka',effectOnEnter:{businessFiled:true},journal:['business_registered_story'],choices:[
   {label:T('Подготовить с проверкой заявление по рабочему основанию','Prepare and review an application on the work basis'),tone:'practical',next:'residence_submit'},
   {label:T('Сначала отдельно уточнить оставшиеся вопросы','Clarify the remaining questions separately first'),tone:'personal',next:'residence_review'}
  ]}),
  c5_business_pause:s([
   y(T('Заявку пока не отправляю. Мне нравится идея, но я хочу вернуться к ней без ощущения, что меня несёт.','I am not submitting the application yet. I like the idea, but I want to return to it without feeling carried along.')),
   l(T('Договорились. Расчёты и вопросы у тебя остаются. И никто не вычёркивает тебя из города за паузу.','Agreed. The calculations and questions stay with you. Nobody crosses you out of the city for pausing.')),
   n(T('Он закрывает папку, а не разговор. Кажется, мне нравится эта разница.','He closes the folder, not the conversation. I think I like that difference.'))
  ],'residence_review',{bg:'workshop-office',character:'luka',exitAction:out(T('Сохранить расчёты без подачи','Save the calculations without filing'))}),
  employment_terms:s([
   n(T('Знакомство с командой начинается с короткого разговора. Мы обсуждаем реальные задачи, время и то, как будет устроена совместная работа.','Meeting the team starts with a short conversation. We discuss the actual work, hours and how working together would be organised.')),
   n(T('После следующих встреч приходит письменное предложение. Я читаю его спокойно, отмечаю вопросы и прошу прояснить спорные места.','After further meetings, a written offer arrives. I read it calmly, note my questions and ask for unclear points to be explained.')),
   a(T('Вот теперь можно выбирать. Не человека, который красиво говорил, а условия, с которыми тебе жить.','Now you can choose: not a person who spoke beautifully, but terms you will live with.'))
  ],null,{bg:'workshop-office',character:'asya',choices:[
   {label:T('После проверки условий договориться о подписании','After reviewing the terms, arrange to sign'),tone:'practical',next:'employment_contract'},
   {label:T('Взять время и пока оставить предложение открытым','Take time and leave the offer open for now'),tone:'personal',next:'residence_review'}
  ]}),
  employment_contract:s([
   n(T('После согласования условий мы отдельно завершаем оформление договора. Я подписываю то, что прочитал{a} и понял{a}, а не то, что страшно было переспросить.','After agreeing the terms, we complete the contract separately. I sign what I have read and understood, not what I was afraid to ask about.')),
   a(T('Мне нравится твоё лицо. Там наконец не «кажется, я всем мешаю», а «можно ещё один вопрос».','I like your expression. It finally says “one more question, please” rather than “I think I am bothering everyone”.')),
   n(T('Рабочее основание теперь можно проверять вместе с конкретными документами. Но право жить и работать не появилось от одного росчерка.','The work basis can now be reviewed against specific documents. But the right to live and work did not appear with one signature.'))
  ],null,{bg:'document-desk',character:'asya',effectOnEnter:{employmentTermsReady:true},journal:['employment_signed_story'],choices:[
   {label:T('Перейти к подготовке и проверке заявления','Move on to preparing and reviewing the application'),tone:'practical',next:'residence_submit'},
   {label:T('Сначала отдельно обсудить оформление проживания','Discuss the residence arrangements separately first'),tone:'personal',next:'residence_review'}
  ]}),
  explore_plan:s([
   y(T('Я хочу ещё посмотреть на варианты. Теперь хотя бы понимаю, что именно сравниваю.','I want to look at the options a little longer. At least I now understand what I am comparing.')),
   a(T('Тогда запишем, каких ответов не хватает, и кому задать следующий вопрос. Неопределённость лучше работает со списком имён.','Then let us note the missing answers and whom to ask next. Uncertainty works better with a list of names.')),
   l(T('А проживание проверим по твоим обстоятельствам. Не будем регистрировать бизнес просто потому, что для него нашлась кнопка.','And we will check residence against your circumstances. We will not register a business merely because there is a button for it.'))
  ],'residence_review',{bg:'workshop-office',character:'asya',exitAction:out(T('Сохранить вопросы к следующей консультации','Save the questions for the next consultation'))}),
  residence_submit:s([
   n(T('Подготовка занимает ещё несколько встреч и проверок. Когда основание и комплект готовы, я прохожу по заявлению вместе со специалистом и сверяю данные.','Preparation takes further meetings and checks. Once the basis and file are ready, I go through the application with a specialist and verify the details.')),
   n(T('Заявление на единое разрешение отправлено электронно. На экране появляется подтверждение приёма. Я сохраняю его отдельно от остальных файлов.','The single-permit application is filed electronically. A receipt appears on the screen. I save it separately from the other files.')),
   y(T('Значит, теперь следить за запросами и отвечать по существу. Ожидание тоже можно сделать понятным.','So now I monitor requests and answer them clearly. Waiting can be made understandable too.')),
   n(T('Это ещё не разрешение. Но между «не знаю, с чего начать» и этим подтверждением поместилось немало моих действий.','This is not a permit yet. But quite a few of my own actions now stand between “I do not know where to begin” and this receipt.'))
  ],'document_evening',{bg:'registry-lobby',time:'16:20',effectOnEnter:{residenceApplication:'submitted'},journal:['residence_submitted_story'],exitAction:{kind:'checklist',label:T('Сохранить подтверждение и способ проверки статуса','Save the receipt and how to check the status'),items:[T('Подтверждение приёма','Application receipt'),T('Канал уведомлений и запросов','Notification and request channel'),T('План следующей проверки','Plan for the next check')]}}),
  residence_review:s([
   n(T('Я оставляю рядом две заметки: что уже подтверждено и на что ещё нужен ответ. Пустые места не пытаюсь заполнить красивыми догадками.','I keep two notes side by side: what is confirmed and what still needs an answer. I do not try to fill the gaps with attractive guesses.')),
   l(T('Сначала подходящее основание и его документы. Потом подача. Сегодня можно закончить тем, что ты понимаешь следующий шаг.','First the appropriate basis and its documents. Then filing. Today can end with understanding the next step.')),
   n(T('Заявление пока не отправлено. Зато теперь я знаю, с каким вопросом вернусь и у кого его уточню.','The application has not been sent yet. But now I know which question I will return with and whom I will ask.'))
  ],'document_evening',{bg:'document-desk',character:'luka',effectOnEnter:{residenceApplication:'review'},journal:['residence_review_story'],exitAction:out(T('Сохранить следующий шаг без подачи','Save the next step without filing'))}),
  document_evening:s([
   n(T('После дел я захожу в кафе. Сегодня хочется рассказать кому-нибудь не только о том, что ещё осталось.','After the practical matters, I stop at a café. Today I want to tell someone about more than what remains unfinished.')),
   n(T('В телефоне несколько знакомых имён. Можно выбрать компанию, а можно просто позвать всех на короткую встречу.','There are several familiar names on my phone. I can choose some company, or simply invite everyone to a short catch-up.')),
   y(T('Вечер тоже должен помещаться в расписание.','An evening should fit into the schedule too.'))
  ],null,{bg:'belgrade-morning-cafe',time:'17:30',choices:[
   {label:T('Позвать человека из аэропорта','Invite my friend from the airport'),tone:'explore',next:'c5_contact',effect:{chapterFiveWith:'companion'}},
   {label:T('Написать Асе: «Можно теперь просто погулять?»','Message Asya: “Can we just go for a walk now?”'),tone:'explore',next:'c5_asya',effect:{chapterFiveWith:'asya'}},
   {label:T('Позвать Луку после работы','Invite Luka after work'),tone:'explore',next:'c5_luka',effect:{chapterFiveWith:'luka'}},
   {label:T('Написать: «{districtHost}, как насчёт встречи без папки?»','Message: “{districtHost}, how about meeting without a folder?”'),tone:'explore',next:'c5_host',effect:{chapterFiveWith:'host'}},
   {label:T('Позвать всех на дружеский кофе','Invite everyone for a friendly coffee'),tone:'friendship',next:'c5_friends',effect:{chapterFiveWith:'friends',chapterFiveBond:'friendship'}}
  ]}),
  c5_contact:s([
   contact(T('Ты сегодня улыбаешься так, будто наконец можно выдохнуть. Я правильно угадал?','You are smiling as if you can finally breathe out. Did I guess right?'),T('Сегодня у тебя другое выражение лица. Хочется его нарисовать — только сначала всё расскажи.','There is a different expression on your face today. I want to draw it, but tell me everything first.')),
   y(T('Всё верно. И мне хочется провести этот вечер рядом, а не пересказывать его потом в чате.','Exactly. And I want to spend this evening beside you, rather than describe it in a chat afterwards.')),
   contact(T('Тогда телефон пока убираем. У меня для тебя хорошая прогулка.','Then let us put the phones away. I have a good walk in mind.'),T('Тогда сегодня можно оставить блокнот закрытым. Один вечер я точно запомню и так.','Then I can leave the sketchbook closed today. I can remember one evening without it.'))
  ],null,{bg:'belgrade-morning-cafe',companionPortrait:true,journal:['chapter_five_evening'],music:'encounter',choices:[
   {label:T('«Хочу тебя поцеловать. Можно?»','“I want to kiss you. May I?”'),tone:'romance',next:'c5_contact_kiss',effect:{chapterFiveBond:'romance',eveningIntent:'romance'}},
   {label:T('Предложить прогулку по-дружески','Suggest a friendly walk'),tone:'friendship',next:'chapter_five_close',effect:{chapterFiveBond:'friendship',eveningIntent:'friendship'}}
  ]}),
  c5_contact_kiss:s([
   contact(T('Да. Мне очень хочется.','Yes. I would like that very much.'),T('Да. Я как раз пыталась придумать, как сказать это первой.','Yes. I was just trying to work out how to say it first.')),
   n(T('Я подхожу ближе и целую. На этот раз между нами нет ни стойки, ни стола с документами. Только короткая тёплая пауза.','I step closer and kiss them. This time there is neither a counter nor a desk full of documents between us. Only a brief, warm pause.')),
   contact(T('Хорошая новость: за этим не нужно обращаться в отдельное окно.','Good news: you do not need a separate counter for this.'),T('Вот этот момент я точно не хочу рисовать по памяти. Давай ещё немного побудем здесь.','I definitely do not want to draw this moment from memory. Let us stay here a little longer.'))
  ],'chapter_five_close',{bg:'belgrade-morning-cafe',companionPortrait:true,music:'encounter',exitAction:out(T('Остаться рядом без спешки','Stay together without rushing'))}),
  c5_asya:s([
   a(T('Можно я сегодня не буду человеком, который знает, куда тебе идти? Я знаю только, где хороший закат.','May I avoid being the person who knows where you should go today? I only know where to find a good sunset.')),
   y(T('Мне подходит. Особенно если ты пойдёшь рядом.','That works for me. Especially if you walk beside me.')),
   a(T('Пойду. Только предупреждаю: у меня очень странный маршрут и нормальные намерения. По крайней мере сначала.','I will. Fair warning: I have a very strange route and perfectly ordinary intentions. At least to begin with.'))
  ],null,{bg:'belgrade-morning-cafe',character:'asya',journal:['chapter_five_evening'],music:'encounter',choices:[
   {label:T('«Тогда пусть это будет свидание. Мне хочется быть ближе»','“Then let it be a date. I want to be closer”'),tone:'romance',next:'chapter_five_close',effect:{chapterFiveBond:'romance',asyaBond:'romance'}},
   {label:T('«Пойдём как друзья. Странный маршрут всё равно хочу»','“Let us go as friends. I still want the strange route”'),tone:'friendship',next:'chapter_five_close',effect:{chapterFiveBond:'friendship',asyaBond:'friendship'}}
  ]}),
  c5_luka:s([
   l(T('Рабочий день закончен. Я специально проверил, чтобы не начать прогулку со слова «таблица».','The working day is over. I made sure I would not start the walk with the word “spreadsheet”.')),
   n(T('Он стоит совсем близко, спокойный и спортивный, с короткой стрижкой и лёгкой улыбкой. Впервые хочется задержаться не у его стола, а рядом с ним.','He stands quite close: calm and athletic, with a short haircut and an easy smile. For the first time, I want to linger beside him rather than at his desk.')),
   l(T('Хочу узнать тебя за пределами всех этих дел. Но ты можешь выбрать темп.','I want to get to know you beyond all these practical matters. But you can choose the pace.'))
  ],null,{bg:'belgrade-morning-cafe',character:'luka',journal:['chapter_five_evening'],music:'encounter',choices:[
   {label:T('«Тогда приглашаю тебя на свидание. Без делового продолжения»','“Then I am inviting you on a date. Without a business follow-up”'),tone:'romance',next:'chapter_five_close',effect:{chapterFiveBond:'romance',lukaBond:'romance'}},
   {label:T('«Мне нравится общаться. Пока хочу остаться друзьями»','“I like talking with you. For now, I want to stay friends”'),tone:'friendship',next:'chapter_five_close',effect:{chapterFiveBond:'friendship',lukaBond:'friendship'}}
  ]}),
  c5_host:s([
   owner(T('Приятно увидеться там, где мне не нужно показывать, какой ключ от какой двери.','It is good to meet somewhere I do not have to explain which key opens which door.'),T('Мне нравится идея встречи, на которой можно не обсуждать ни одного выключателя.','I like the idea of a meeting without discussing a single light switch.')),
   y(T('Сегодня предлагаю только кофе и прогулку. Остальное обсудим в другой раз.','Today I suggest only coffee and a walk. We can discuss the rest another time.')),
   owner(T('С удовольствием. И мне любопытно увидеть тебя совсем без спешки.','Gladly. And I am curious to see you without any hurry at all.'),T('С удовольствием. И мне любопытно, какая у тебя улыбка, когда не нужно задавать практичный вопрос.','Gladly. And I am curious about your smile when you do not need to ask a practical question.'))
  ],null,{bg:'belgrade-morning-cafe',districtPortrait:true,journal:['chapter_five_evening'],music:'encounter',choices:[
   {label:T('«Для меня это свидание. Если тебе тоже хочется»','“To me, this is a date. If you would like that too”'),tone:'romance',next:'chapter_five_close',effect:{chapterFiveBond:'romance',districtBond:'romance'}},
   {label:T('Предложить познакомиться ближе по-дружески','Suggest getting to know one another as friends'),tone:'friendship',next:'chapter_five_close',effect:{chapterFiveBond:'friendship',districtBond:'friendship'}}
  ]}),
  c5_friends:s([
   a(T('Отлично. Общий кофе — это когда у каждого свои новости, а счёт за пирог почему-то один.','Excellent. A group coffee means everyone brings their own news, yet somehow there is only one bill for the cake.')),
   n(T('Мы сдвигаем столики. Разговор быстро перестаёт быть отчётом о переезде: кто-то спорит о музыке, кто-то показывает смешную фотографию.','We move the tables together. The conversation soon stops being a relocation report: somebody debates music, somebody shows a funny photograph.')),
   a(T('В субботу всех жду во дворе. Ты тоже приходи. Без списка вопросов, если получится.','I expect everyone in the courtyard on Saturday. Come along too. Without a question list, if possible.'))
  ],'chapter_five_close',{bg:'belgrade-morning-cafe',character:'asya',journal:['chapter_five_evening'],exitAction:out(T('Договориться о субботнем кинопоказе','Agree on the Saturday screening'))}),
  chapter_five_close:s([
   n(T('Дома я убираю папку со стола. Не потому, что больше нечего делать, а потому, что сегодняшний шаг закончен.','At home, I put the folder away. Not because there is nothing left to do, but because today’s step is finished.')),
   n(T('В заметках теперь есть ответы, решения и несколько честных ожиданий. Они выглядят спокойнее, когда не занимают весь вечер.','My notes now hold answers, decisions and a few honest things to wait for. They feel calmer when they do not take up the entire evening.')),
   msg(T('Ася','Asya'),T('«Кино в субботу. Если захочешь помочь, приходи пораньше. Проектор уже проявляет характер».','‘The film is on Saturday. Come early if you want to help. The projector is already showing its personality.’')),
   n(T('Я сохраняю приглашение. Есть планы, которые хочется открыть не из-за напоминания.','I save the invitation. Some plans make me want to open the calendar without a reminder.'))
  ],'end',{bg:'room-window',time:'21:10',lighting:'night',effectOnEnter:{chapterFiveComplete:true},exitAction:out(T('Закончить день и сохранить приглашение','Finish the day and save the invitation'))})
 });
 for(const[id,index,emotion]of [['work_review',0,'laughing'],['c5_business_pause',1,'friendly'],['c5_asya',2,'flirty'],['c5_luka',2,'flirty'],['c5_friends',0,'laughing']])N[id].pages[index].emotion=emotion;
 N.chapter_four_close.next='fourth_morning';
 N.chapter_four_close.exitAction=out(T('Продолжить · Право на завтра','Continue · A Right to Tomorrow'));
}
