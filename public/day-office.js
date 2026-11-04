// Optional romantic and friendly threads with people the player meets while dealing with offices: a bank consultant or manager
// (days 17 and 24) and an officer at the police administration's document window (days 20 and 26).
// The bank staff and the officers at the window only help with papers; the decisions are made by other people and services.
// Rules of these threads: closeness is the player's choice and always has a friendly or purely professional alternative; nobody
// who handles the player's papers decides anything; the staff say so plainly, and the application is decided elsewhere.
// In-person portraits are selected by bankSpark/mupSpark in living-art.js; messages use the messenger template.
import {T,castHelpers} from './days.js?v=0.17.2';
export function extendOfficeRomance({NODES:N,JOURNAL:J,n,scene}){
 const {note}=castHelpers(n);
 const out=label=>({kind:'tap',label,object:label});
 const y=(ru,en)=>({speaker:'player',text:T(ru,en)});
 // A line by one of the four office people whose wording depends on one or two flags: {key: [ru,en], default: [ru,en]}.
 const by=(speaker,flag,variants)=>{
  const text=Object.fromEntries(Object.entries(variants).map(([key,[ru,en]])=>[key,T(ru,en)]));
  return {speaker,byFlag:{flag,text},text:text.default};
 };
 const choice=(label,tone,next,effect)=>({label:T(...label),tone,next,effect});
 Object.assign(J,{
  bank_acquaintance:{title:T('Окно в банке','A window at the bank'),tag:T('ЛЮДИ · БАНК','PEOPLE · THE BANK'),text:T('В банке мне помог человек, с которым приятно говорить. Что бы ни было дальше, на решения по моему счёту это не влияет: личное и рабочее остаётся раздельным.','At the bank I was helped by someone it is pleasant to talk to. Whatever follows, it does not affect decisions about my account: the personal and the professional stay apart.')},
  mup_acquaintance:{title:T('Окно приёма документов','The document reception window'),tag:T('ЛЮДИ · УПРАВЛЕНИЕ','PEOPLE · THE ADMINISTRATION'),text:T('Офицер у окна только принимает документы, а решения по делам принимают другие службы. С ним можно говорить по-человечески, и знакомство никак не влияет на ответ.','The officer at the window only receives documents, and other services decide the cases. I can talk to them like a person, and the acquaintance has no effect on the answer.')}
 });
 const place=(ru,en,time,bg)=>({bg,location:T(ru,en),time,exitAction:out('Продолжить')});
 const add=(startId,option)=>N[startId].choices.push(option);

 // Day 17, step one: the bank window.
 add('d17_start',choice(['Зайти в банк и уточнить условия счёта','Go to the bank and ask about the account terms'],'practical','d17_bank',{}));
 N.d17_bank=scene([
  note('Банк встречает кондиционером и тихим гулом очередей. Электронное табло показывает два свободных окна: за одним сидит консультант, за другим — менеджер, которая как раз закрывает чью-то папку.','The bank greets me with air conditioning and the quiet hum of queues. The display shows two free windows: a consultant at one, a manager at the other, closing someone’s folder just now.'),
  note('Подойти можно к любому. Оба выглядят занятыми, но не усталыми, и это хороший знак.','I may go to either. Both look busy but not tired, which is a good sign.')
 ],null,{...place('БАНК · ЗАЛ ОБСЛУЖИВАНИЯ','BANK · CUSTOMER HALL','11:00','bank-consultation'),choices:[
  choice(['К консультанту','To the consultant'],'practical','d17_lazar',{bankSpark:'lazar'}),
  choice(['К менеджеру','To the manager'],'practical','d17_teodora',{bankSpark:'teodora'})]});
 const after=[choice(['Поблагодарить и уйти по делам','Thank them and go about my business'],'practical','d17_mid',{bankBond:'none'}),
  choice(['Спросить, давно ли они здесь работают','Ask how long they have worked here'],'friendship','d17_bank_talk',{bankBond:'friendship'}),
  choice(['Улыбнуться и пошутить про очереди','Smile and joke about the queues'],'romance','d17_bank_joke',{bankBond:'romance'})];
 N.d17_lazar=scene([
  note('Консультанта зовут Лазар — так написано на бейдже. У него спокойный голос и привычка проговаривать условия медленно, не заставляя чувствовать себя глупо.','The consultant’s name is Lazar, as the badge says. He has a calm voice and a habit of stating the terms slowly without making me feel foolish.'),
  by('bankStaff','bankSpark',{default:['Условия вашего счёта я могу показать на экране и распечатать. Если что-то непонятно, спрашивайте: это моя работа.','I can show the terms of your account on the screen and print them. If anything is unclear, ask: that is my job.']}),
  note('Я задаю три вопроса, он отвечает на каждый с примером. Когда я благодарю, он улыбается чуть шире, чем требует инструкция.','I ask three questions, and he answers each with an example. When I thank him, he smiles slightly more widely than the instructions require.')
 ],null,{...place('БАНК · ОКНО КОНСУЛЬТАЦИИ','BANK · ADVICE DESK','11:10','bank-consultation'),journal:['bank_acquaintance'],choices:after});
 N.d17_teodora=scene([
  note('Менеджера зовут Теодора. Она говорит быстро и точно, но, увидев, что я записываю, замедляется — без раздражения.','The manager’s name is Teodora. She speaks quickly and precisely, but when she sees me taking notes she slows down, without irritation.'),
  by('bankStaff','bankSpark',{default:['Условия вашего счёта вот здесь, сейчас распечатаю. Самое важное — сроки и комиссии, остальное можно читать потом.','The terms of your account are here, I will print them. The most important are the deadlines and fees; the rest can be read later.']}),
  note('Я задаю три вопроса, она отвечает коротко и по делу. Прощаясь, она смотрит на меня на секунду дольше, чем нужно, и тут же возвращается к бумагам.','I ask three questions, and she answers briefly and to the point. As we part she looks at me a second longer than needed and at once returns to her papers.')
 ],null,{...place('БАНК · КАБИНЕТ МЕНЕДЖЕРА','BANK · MANAGER’S OFFICE','11:10','bank-consultation'),journal:['bank_acquaintance'],choices:after});
 N.d17_bank_talk=scene([
  by('bankStaff','bankSpark',{lazar:['Четвёртый год. Сначала казалось, что работа — только цифры, потом понял: чаще это люди, которые боятся ошибиться.','Four years. At first it seemed the job was only figures, then I understood: more often it is people afraid of making a mistake.'],teodora:['Шестой год. Сначала хотела стать юристом, но в банке оказалось интереснее: каждый день новая история.','Six years. At first I wanted to be a lawyer, but the bank turned out more interesting: a new story every day.'],default:['Давно. Привык.','A long time. I am used to it.']}),
  note('Мы говорим пару минут, пока за мной никто не стоит. Приятно: разговор без цели.','We talk for a couple of minutes while nobody stands behind me. It is pleasant: a conversation with no purpose.'),
  by('bankStaff','bankSpark',{default:['Мне пора, у окна очередь. Но заходите, если будут вопросы по счёту.','I must go, there is a queue at the window. But come in if you have questions about the account.']})
 ],'d17_mid',place('БАНК · ЗАЛ ОБСЛУЖИВАНИЯ','BANK · CUSTOMER HALL','11:25','bank-consultation'));
 N.d17_bank_joke=scene([
  y('Если очередь станет короче, я решу, что банк пытается мне понравиться.','If the queue gets shorter, I will decide the bank is trying to please me.'),
  by('bankStaff','bankSpark',{lazar:['Вы заметили? Мы стараемся. С очередью получается хуже, чем с улыбкой.','You noticed? We are trying. It works worse with the queue than with the smile.'],teodora:['Очередь — не мой отдел, а вот улыбка входит в обслуживание. Бесплатно.','The queue is not my department, but the smile is part of the service. Free of charge.'],default:['Мы стараемся.','We are trying.']}),
  note('Рабочий тон остаётся рабочим, но в голосе слышна улыбка. Я не давлю: шутка остаётся шуткой, а счёт — счётом.','The professional tone stays professional, but I can hear a smile in the voice. I do not press: a joke stays a joke, and the account stays an account.')
 ],'d17_mid',place('БАНК · ЗАЛ ОБСЛУЖИВАНИЯ','BANK · CUSTOMER HALL','11:25','bank-consultation'));

 // Day 24, step two: the statement. The person from day 17 is there only if the player went; the wording follows what was chosen.
 const meet=['bankBond','bankSpark'];
 add('d24_start',choice(['Зайти в банк за выпиской','Go to the bank for a statement'],'practical','d24_bank',{}));
 N.d24_bank=scene([
  note('Для таблицы мне нужна выписка по счёту. Я иду в банк, заранее зная, что окно, возможно, окажется тем же самым.','For my table I need a statement of the account. I go to the bank knowing in advance that the window may turn out to be the same one.'),
  by('bankStaff',meet,{'romance:lazar':['Вы вернулись. Выписку я распечатал заранее. Моя смена закончится через двадцать минут: если захотите выпить кофе, я не против, но только если вам самому хочется, а не из вежливости.','You are back. I printed the statement in advance. My shift ends in twenty minutes: if you would like a coffee I would not mind, but only if you want it yourself and not out of politeness.'],'romance:teodora':['Вы пришли. Выписка готова, я подготовила её с утра. Мой день заканчивается через полчаса: если захотите выпить кофе, я не против, но только если вам самому хочется, а не из вежливости.','You have come. The statement is ready; I prepared it this morning. My day ends in half an hour: if you would like a coffee I would not mind, but only if you want it yourself and not out of politeness.'],'friendship:lazar':['Рад вас видеть. Выписка готова. Как проект, о котором вы говорили?','Good to see you. The statement is ready. How is the project you mentioned?'],'friendship:teodora':['Рада вас видеть. Выписка готова. Как проект, о котором вы говорили?','Good to see you. The statement is ready. How is the project you mentioned?'],default:['Выписка готова. Если появятся вопросы по счёту, звоните на линию или заходите.','The statement is ready. If you have questions about the account, phone the line or come in.']}),
  note('Бумага тёплая от принтера. Решать, чем закончить этот разговор, мне.','The paper is warm from the printer. It is for me to decide how to end this conversation.')
 ],null,{...place('БАНК · ОКНО КОНСУЛЬТАЦИИ','BANK · ADVICE DESK','16:30','bank-consultation'),journal:['bank_acquaintance'],choices:[
  choice(['Предложить выпить кофе после смены','Suggest a coffee after the shift'],'romance','d24_bank_coffee',{bankDate:'asked'}),
  choice(['Спросить, как у человека дела','Ask how they are'],'friendship','d24_bank_chat',{bankDate:'chat'}),
  choice(['Поблагодарить и уйти','Thank them and leave'],'practical','d24_mid',{bankDate:'no'})]});
 N.d24_bank_coffee=scene([
  by('bankStaff',meet,{'romance:lazar':['С удовольствием. Я буду ждать у выхода, как только закрою окно.','With pleasure. I will wait by the exit as soon as I close the window.'],'romance:teodora':['С удовольствием. Я выйду к двери, как только закрою кассу.','With pleasure. I will come out to the door as soon as I close the till.'],'friendship:lazar':['Давайте. Как друзья: мне это нравится. Через двадцать минут у выхода.','Let us. As friends: I like that. In twenty minutes by the exit.'],'friendship:teodora':['Давайте. Как друзья: мне это нравится. Через полчаса у выхода.','Let us. As friends: I like that. In half an hour by the exit.'],default:['Спасибо, но я предпочитаю не смешивать работу и личное. Если будут вопросы по счёту — заходите.','Thank you, but I prefer not to mix work and personal life. If you have questions about the account, come in.']}),
  by('narrator',meet,{...Object.fromEntries(['romance:lazar','romance:teodora','friendship:lazar','friendship:teodora'].map(k=>[k,['В кафе за углом столик у окна. Мы говорим о городе и о том, как странно, что вместе с документами в жизнь входят люди. Никто никого не торопит.','In the café around the corner there is a table by the window. We talk about the city and how strange it is that people come into your life along with documents. Nobody hurries anyone.']])),default:['Я благодарю и выхожу на улицу. Отказ вежливый, и от этого не больно: у каждого есть право на свои границы.','I thank them and go out into the street. The refusal is polite and does not hurt: everyone has a right to their own boundaries.']}),
  by('narrator',meet,{...Object.fromEntries(['romance:lazar','romance:teodora'].map(k=>[k,['Если разговор станет чем-то большим, это будет решение нас обоих, а не результат счёта. Я говорю это вслух, и собеседник кивает: «Конечно».','If the conversation turns into something more, it will be a decision we both make and not a result of the account. I say this aloud, and the other person nods: “Of course.”']])),...Object.fromEntries(['friendship:lazar','friendship:teodora'].map(k=>[k,['Мы сразу договариваемся: это просто кофе между знакомыми. От такой ясности разговор становится только теплее.','We agree at once: it is simply coffee between acquaintances. Such clarity only makes the conversation warmer.']])),default:['Выписка в сумке, а за окном обычный день. Дело с банком остаётся делом, и этого достаточно.','The statement is in my bag, and outside it is an ordinary day. The bank stays a bank, and that is enough.']})
 ],'d24_mid',{...place('КАФЕ · У ОКНА','CAFÉ · BY THE WINDOW','17:30','belgrade-morning-cafe'),journal:['bank_acquaintance']});
 N.d24_bank_chat=scene([
  by('bankStaff',meet,{default:['Хорошо. Сегодня тише, чем обычно, и я успеваю допить чай. Спасибо, что спросили.','Well. It is quieter than usual today, and I have time to finish my tea. Thank you for asking.']}),
  note('Мы говорим минуту-две, и никто не смотрит на часы. Простая вежливость тоже умеет согревать.','We talk for a minute or two and nobody looks at a clock. Plain courtesy can warm things up too.')
 ],'d24_mid',place('БАНК · ОКНО КОНСУЛЬТАЦИИ','BANK · ADVICE DESK','16:40','bank-consultation'));

 // Day 20, step one: the document window at the police administration. The officers at the window only receive papers; other
 // services decide, so friendliness here never affects a case, and the player may be friendly or flirt, or not.
 add('d20_start',choice(['Зайти в управление и спросить, нужны ли ещё бумаги по адресу','Go to the administration and ask whether more papers are needed for the address'],'practical','d20_mup',{}));
 N.d20_mup=scene([
  note('В приёмной тихо и светло. Над окнами висят таблички: «Приём документов», «Справки», «Консультации». У окна приёма сидят двое офицеров, и обе очереди идут ровно.','The reception room is quiet and bright. Signs hang over the windows: “Document reception”, “Certificates”, “Advice”. Two officers sit at the reception window, and both queues move steadily.'),
  note('Я не знаю, к кому подойти. Оба говорят вежливо, и я решаю идти к тому окну, которое освободится первым.','I do not know whom to approach. Both speak courteously, and I decide to go to whichever window frees up first.')
 ],null,{...place('УПРАВЛЕНИЕ · ПРИЁМНАЯ','ADMINISTRATION · RECEPTION','10:30','registry-lobby'),choices:[
  choice(['К окну, где сидит женщина-офицер','To the window where the woman officer sits'],'practical','d20_ivana',{mupSpark:'ivana'}),
  choice(['К окну, где сидит мужчина-офицер','To the window where the man officer sits'],'practical','d20_strahinya',{mupSpark:'strahinya'})]});
 const mupAfter=[choice(['Поблагодарить и уйти','Thank them and leave'],'practical','d20_mid',{mupBond:'none'}),
  choice(['Спросить, как проходит их день','Ask how their day is going'],'friendship','d20_mup_talk',{mupBond:'friendship'}),
  choice(['Улыбнуться: «Приятно, что здесь улыбаются»','Smile: “It is nice that people smile here”'],'romance','d20_mup_reply',{mupBond:'spark'})];
 const receive=['Документы по адресу в порядке. Я только принимаю бумаги, а решения по делам принимают другие службы, так что моё мнение ни на что не влияет. Если что-то нужно добавить, я скажу сразу.','The documents for the address are in order. I only receive papers; other services decide the cases, so my opinion affects nothing. If something has to be added, I will tell you at once.'];
 N.d20_ivana=scene([
  note('Офицера зовут Ивана — так написано на нагрудной табличке. Форма сидит строго, но глаза живые, и она не прячет улыбку, когда видит, что я растерян{a}.','The officer’s name is Ivana, as her name plate says. The uniform sits strictly, but her eyes are lively, and she does not hide a smile when she sees I am flustered.'),
  by('mupStaff','mupSpark',{default:receive}),
  note('Она говорит ровно и без спешки. За неделю она повторила эти слова десятки раз и всё равно произносит их так, будто видит человека, а не очередной номер. Когда она задумывается, то постукивает карандашом по краю стойки: три коротких удара, пауза и ещё один.','She speaks evenly and without hurry. She has repeated these words dozens of times this week and still says them as though she sees a person and not just another number. When she thinks, she taps a pencil on the edge of the counter: three short knocks, a pause and one more.')
 ],null,{...place('УПРАВЛЕНИЕ · ОКНО ПРИЁМА','ADMINISTRATION · RECEPTION WINDOW','10:40','registry-lobby'),journal:['mup_acquaintance'],choices:mupAfter});
 N.d20_strahinya=scene([
  note('Офицера зовут Страхиня — так написано на нагрудной табличке. Форма сидит строго, но глаза живые, и он не прячет улыбку, когда видит, что я растерян{a}.','The officer’s name is Strahinja, as his name plate says. The uniform sits strictly, but his eyes are lively, and he does not hide a smile when he sees I am flustered.'),
  by('mupStaff','mupSpark',{default:receive}),
  note('Он говорит ровно и без спешки. За неделю он повторил эти слова десятки раз и всё равно произносит их так, будто видит человека, а не очередной номер. Когда он задумывается, то постукивает карандашом по краю стойки: три коротких удара, пауза и ещё один.','He speaks evenly and without hurry. He has repeated these words dozens of times this week and still says them as though he sees a person and not just another number. When he thinks, he taps a pencil on the edge of the counter: three short knocks, a pause and one more.')
 ],null,{...place('УПРАВЛЕНИЕ · ОКНО ПРИЁМА','ADMINISTRATION · RECEPTION WINDOW','10:40','registry-lobby'),journal:['mup_acquaintance'],choices:mupAfter});
 N.d20_mup_talk=scene([
  by('mupStaff','mupSpark',{default:['День как день: бумаги, люди, чай. Хорошо, когда кто-то интересуется. Спасибо.','A day like any day: papers, people, tea. It is good when someone takes an interest. Thank you.']}),
  note('Мы обмениваемся ещё парой фраз. Разговор простой, человеческий, и никто ничего не просит друг у друга.','We exchange a couple more sentences. The conversation is simple and human, and neither of us asks anything of the other.')
 ],'d20_mid',place('УПРАВЛЕНИЕ · ОКНО ПРИЁМА','ADMINISTRATION · RECEPTION WINDOW','10:50','registry-lobby'));
 N.d20_mup_reply=scene([
  by('mupStaff','mupSpark',{ivana:['Спасибо. Приятно, когда у этого окна кто-то улыбается в ответ. Рабочие часы — рабочие, а после смены я свободна. Если захотите выпить кофе, скажите: на моё окно и на ваше дело это никак не повлияет.','Thank you. It is pleasant when someone smiles back at this window. Working hours are working hours, and after my shift I am free. If you would like a coffee, say so: it will not affect my window or your case in any way.'],strahinya:['Спасибо. Приятно, когда у этого окна кто-то улыбается в ответ. Рабочие часы — рабочие, а после смены я свободен. Если захотите выпить кофе, скажите: на моё окно и на ваше дело это никак не повлияет.','Thank you. It is pleasant when someone smiles back at this window. Working hours are working hours, and after my shift I am free. If you would like a coffee, say so: it will not affect my window or your case in any way.'],default:['Спасибо.','Thank you.']}),
  note('Это сказано прямо и без намёков на услуги: решения по делам принимают другие, и оба это знаем. От такой ясности разговор становится лёгким.','It is said plainly and with no hint of favours: others decide the cases, and we both know it. Such clarity makes the conversation light.')
 ],null,{...place('УПРАВЛЕНИЕ · ОКНО ПРИЁМА','ADMINISTRATION · RECEPTION WINDOW','10:50','registry-lobby'),choices:[
  choice(['Предложить выпить кофе после смены','Suggest a coffee after the shift'],'romance','d20_mup_coffee',{mupDate:'asked'}),
  choice(['Просто улыбнуться и уйти','Simply smile and leave'],'practical','d20_mid',{mupDate:'no'})]});
 N.d20_mup_coffee=scene([
  by('mupStaff','mupSpark',{default:['Договорились. После шести, у кафе напротив. Только без бумаг: сегодня я не сотрудница и не сотрудник управления, а человек.','Agreed. After six, at the café opposite. Only no papers: today I am not an officer of the administration but a person.']}),
  note('Вечером кафе напротив управления пахнет кофе и лимоном. Мы почти не говорим о службе: о городе, о том, как быстро привыкаешь к чужим улицам, о том, кто где вырос.','In the evening the café opposite the administration smells of coffee and lemon. We hardly speak of the service: about the city, how quickly one gets used to strange streets, where each of us grew up.'),
  note('Если это станет чем-то большим, это будет решение двоих. Дело решается в другом месте, и мы оба знаем, что оно не зависит от кофе.','If this turns into something more, it will be a decision of two people. The case is decided elsewhere, and we both know it does not depend on coffee.')
 ],'d20_mid',{...place('КАФЕ · НАПРОТИВ УПРАВЛЕНИЯ','CAFÉ · OPPOSITE THE ADMINISTRATION','18:15','belgrade-morning-cafe'),journal:['mup_acquaintance']});

 // Day 26, step two: asking about the status. The officer from day 20 is warm again if the player made a connection.
 const mup=['mupDate','mupSpark'];
 add('d26_start',choice(['Зайти в управление и спросить о статусе','Go to the administration and ask about the status'],'practical','d26_mup',{}));
 N.d26_mup=scene([
  note('В приёмной всё как две недели назад. Номерок, очередь, окно. Я подхожу, когда табло называет мой номер.','The reception room is as it was two weeks ago. A ticket, a queue, a window. I step up when the display calls my number.'),
  by('mupStaff',mup,{'asked:ivana':['Вы снова пришли. Дело ведёт другая служба, о решении я ничего не знаю, и это тоже честно. Статус можно проверить на портале по номеру обращения, он у вас в папке. А кофе в силе, если вы ещё хотите.','You have come again. Another service handles the case, and I know nothing of the decision, which is honest too. The status can be checked on the portal by the reference number, which you have in your folder. And the coffee stands, if you still want it.'],'asked:strahinya':['Вы снова пришли. Дело ведёт другая служба, о решении я ничего не знаю, и это тоже честно. Статус можно проверить на портале по номеру обращения, он у вас в папке. А кофе в силе, если вы ещё хотите.','You have come again. Another service handles the case, and I know nothing of the decision, which is honest too. The status can be checked on the portal by the reference number, which you have in your folder. And the coffee stands, if you still want it.'],default:['Дело ведёт другая служба, о решении я ничего не знаю. Статус можно проверить на портале по номеру обращения, он у вас в папке. Если ответа не будет к нужному сроку, обратитесь по порядку, указанному на официальной странице.','Another service handles the case, and I know nothing of the decision. The status can be checked on the portal by the reference number, which you have in your folder. If there is no answer by the deadline, follow the procedure given on the official page.']}),
  note('Ответ ровный и честный. Мне не обещают ничего, кроме понятного порядка действий, и от этого становится спокойнее.','The answer is even and honest. I am promised nothing except a clear order of action, and that makes me calmer.')
 ],null,{...place('УПРАВЛЕНИЕ · ОКНО ПРИЁМА','ADMINISTRATION · RECEPTION WINDOW','10:30','registry-lobby'),journal:['mup_acquaintance'],choices:[
  choice(['Позвать на ужин после смены','Ask them to dinner after the shift'],'romance','d26_mup_end',{mupFuture:'dinner'}),
  choice(['Сказать, что рад{a} видеть, и спросить о делах','Say I am glad to see them and ask how they are'],'friendship','d26_mup_end',{mupFuture:'friend'}),
  choice(['Поблагодарить и остаться на деловом тоне','Thank them and keep to a professional tone'],'practical','d26_mup_end',{mupFuture:'no'})]});
 N.d26_mup_end=scene([
  by('mupStaff','mupFuture',{dinner:['Если вам правда хочется, в пятницу вечером. Но я предупреждаю заранее: что бы ни ответила служба по вашему делу, это не изменит ни нашего ужина, ни дела.','If you really want to, on Friday evening. But I say in advance: whatever the service answers about your case, it will change neither our dinner nor the case.'],friend:['Спасибо, у меня всё хорошо. Приятно, когда по ту сторону окна помнят твоё имя.','Thank you, I am well. It is pleasant when people on the other side of the window remember your name.'],default:['Хорошо. Если нужно, обращайтесь по любому вопросу.','Good. If you need anything, come with any question.']}),
  note('Я выхожу из управления и остаюсь на крыльце, пока не успокоится сердце. Что бы ни ждало дальше, у меня есть порядок действий и человек, который говорит честно.','I leave the administration and stand on the steps until my heart calms down. Whatever lies ahead, I have a course of action and a person who speaks honestly.')
 ],'d26_mid',place('УПРАВЛЕНИЕ · КРЫЛЬЦО','ADMINISTRATION · THE STEPS','11:00','registry-lobby'));
}

// Independent identities in the fifteen-day route: meeting one never replaces another's contact or relationship.
export const OFFICE_PEOPLE=[
 {id:'lazar',name:'Лазар',en:'Lazar',sprite:'lazar',kind:'bank',
  introduction:['Лазар снимает очки и отодвигает распечатку: «С вопросами по условиям закончили? Тогда можно просто познакомиться».','Lazar takes off his glasses and sets the printout aside: “Finished with the questions about terms? Then we can simply introduce ourselves.”'],
  personal:['Без стойки между нами я немного теряюсь. Расскажи, какое место в городе уже стало твоим.','Without a counter between us I feel a little lost. Tell me which place in the city already feels like yours.'],
  travel:['Лазар складывает билет пополам и убирает телефон: «Сегодня никаких процентов. Хочу просто посмотреть в окно».','Lazar folds his ticket and puts his phone away: “No percentages today. I just want to watch the view.”']},
 {id:'teodora',name:'Теодора',en:'Teodora',sprite:'teodora',kind:'bank',
  introduction:['Теодора закрывает рабочую папку. Говорит быстро, но, заметив мою улыбку, останавливается: «Теперь можно без банковских терминов».','Teodora closes her work folder. She speaks quickly, then pauses when she notices my smile: “Now we can leave the banking terms behind.”'],
  personal:['Сегодня без калькулятора. Я хочу узнать, что тебе нравится, когда ничего не нужно решать.','No calculator today. I want to know what you enjoy when nothing needs deciding.'],
  travel:['Теодора выбирает кафе без таблицы рейтингов: «В этот раз доверимся запаху кофе».','Teodora chooses a café without a ratings table: “This time let us trust the smell of coffee.”']},
 {id:'ivana',name:'Ивана',en:'Ivana',sprite:'ivana',kind:'mup',
  introduction:['Ивана кладёт карандаш рядом с готовым подтверждением. Три коротких удара по стойке, пауза: «Вот теперь всё. Есть ещё вопросы?»','Ivana puts her pencil beside the completed confirmation. Three short taps on the counter, a pause: “That is everything. Any more questions?”'],
  personal:['После смены я всё ещё ищу карандаш, даже когда записывать нечего. Давай сегодня запомним прогулку без записей.','After my shift I still look for a pencil even when there is nothing to write down. Let us remember today’s walk without notes.'],
  travel:['Ивана рисует маршрут на салфетке и смеётся: «Не инструкция. Просто чтобы осталось на память».','Ivana sketches the route on a napkin and laughs: “Not an instruction. Just a keepsake.”']},
 {id:'strahinya',name:'Страхиня',en:'Strahinja',sprite:'strahinja',kind:'mup',
  introduction:['Страхиня сверяет последнюю строку и откладывает карандаш: «С документами закончили. Можно выдохнуть».','Strahinja checks the last line and sets down his pencil: “Finished with the papers. You can breathe out.”'],
  personal:['У меня дома карандаши во всех стаканах, а чай пить не из чего. Сегодня хорошо просто сидеть с настоящей чашкой.','At home every glass holds pencils, leaving nothing for tea. Today it feels good simply to sit with a real cup.'],
  travel:['Страхиня собирается сверить время, но убирает часы: «До обратного рейса успеваем. Давай ещё посидим у воды».','Strahinja starts to check the time, then puts his watch away: “There is time before we head back. Let us sit by the water a little longer.”']}
];

export function extendFifteenOfficeRomance({NODES:N,add,note,say,choice}){
 const eq=(flag,equals)=>({flag,equals});
 // Temporary registration introduces the reception staff; day 5 offers another opportunity if it was skipped.
 for(const {day,kind,from,back} of [
  {day:2,kind:'mup',from:'route2_registered',back:'keys_room'},
  {day:5,kind:'mup',from:'route5_registration_done',back:'route5_alta'},
  {day:5,kind:'bank',from:'route5_bank_done',back:'evening5'}
 ]){
  const hub=`route${day}_${kind}_people`,people=OFFICE_PEOPLE.filter(p=>p.kind===kind);
  N[from].next=hub;
  const base={bg:kind==='bank'?'bank-consultation':'registry-lobby',time:day===2?'18:32':kind==='bank'?'14:15':'11:15',location:kind==='bank'?T('БАНК · ПОСЛЕ КОНСУЛЬТАЦИИ','BANK · AFTER THE CONSULTATION'):T('ПРИЁМНАЯ · ПОСЛЕ РЕГИСТРАЦИИ','RECEPTION · AFTER REGISTRATION')};
  add(hub,[note(kind==='bank'?'Вопросы по счёту на сегодня закончены. У стойки ещё Лазар и Теодора; можно познакомиться или уйти по своим делам.':'Подтверждение уже в папке. В приёмной Ивана и Страхиня заканчивают работу с бумагами. Можно познакомиться или идти дальше.',kind==='bank'?'Today’s account questions are finished. Lazar and Teodora are still by the counter; I can introduce myself or go about my day.':'The confirmation is already in my folder. Ivana and Strahinja are finishing with the papers at reception. I can introduce myself or move on.')],null,{...base,choices:[
   ...people.map(p=>choice('Познакомиться: '+p.name,'Meet: '+p.en,hub+'_'+p.id,'friendship',{}, {not:eq('routeOfficeMet_'+p.id,true)})),
   choice('Продолжить свои дела','Continue my day',back,'practical')
  ]});
  for(const p of people){
   const root=hub+'_'+p.id,met='routeOfficeMet_'+p.id,contact='routeOfficeContact_'+p.id,bond='routeOfficeBond_'+p.id;
   const person=(ru,en)=>say(p.name,ru,en,{character:p.sprite});
   add(root,[note(...p.introduction),person(kind==='bank'?'Я консультирую по условиям. Если мы сблизимся, я смогу лично помочь с заявкой — но решать, принимать ли помощь, тебе.':'Я принимаю документы. Если мы станем близки, я смогу помочь разобраться с ними лично. Решать тебе.',kind==='bank'?'I explain the terms. If we grow close, I can personally help with the application, but accepting is your choice.':'I receive documents. If we grow close, I can personally help with them. The choice is yours.')],null,{...base,effectOnEnter:{[met]:true},journal:[kind==='bank'?'bank_acquaintance':'mup_acquaintance'],choices:[
    choice('Поблагодарить и остаться на деловом тоне','Thank them and keep things professional',hub,'practical'),
    choice('Предложить общаться как друзья','Suggest keeping in touch as friends',root+'_contact','friendship',{[bond]:'friendship'}),
    choice('Предложить встретиться после смены — как свидание','Suggest meeting after the shift — as a date',root+'_contact','romance',{[bond]:'romance'})
   ]});
   add(root+'_contact',[person('Да, я тоже хочу продолжить разговор после смены. Можно обменяться личными контактами. Если передумаешь, просто скажи.','Yes, I would like to continue talking after my shift too. We can exchange personal contacts. If you change your mind, just say so.'),note('Это отдельный разговор, когда рабочие вопросы уже закончены. Теперь личное знакомство может повлиять на помощь с бумагами.','This is a separate conversation after the work questions are finished. A personal connection may now affect help with the paperwork.')],null,{...base,choices:[
    choice('Обменяться личными контактами','Exchange personal contacts',root+'_saved','friendship',{[contact]:true}),
    choice('Пока не обмениваться контактами','Do not exchange contacts yet',hub,'personal',{[bond]:'professional'})
   ]});
   add(root+'_saved',[person(...p.personal),note('Мы договариваемся писать только по желанию. Рабочие вопросы остаются в официальном канале.','We agree to write only when we want to. Work questions stay in the official channel.')],hub,base);
  }
 }
 for(const day of [10,12])for(const p of OFFICE_PEOPLE)N[`route${day}_rest`].pages[0].byFlag.text[p.id]=T(...p.travel);
}
