// The bank guide page and the three branches of the first bank visit (day 2).
// Everything here is a simplified, fictional game version inspired by the public srb.guide material about banks.
// Requirements change and depend on the bank, the branch and the applicant: no bank is guaranteed to open an account.
import {T} from './flat-data.js?v=1';
export const BANK_FLAG='bankRead';
export const BANK_KEYS=['api','alta','adriatic','other'];
export const GUIDE={
  helperName:T('Волчонок Вучко','Vučko the wolf'),
  helperHello:T('Привет! Я Вучко. Давай без сложных таблиц: выбери банк, а я расскажу, что взять с собой и о чём спросить.','Hi! I’m Vučko. Let’s skip the complicated tables: choose a bank and I’ll explain what to bring and what to ask.'),
  helperSelected:T('Вот что стоит знать перед визитом. Условия могут измениться, поэтому лучше уточнить их в банке.','Here is what to know before your visit. Conditions can change, so it is best to check with the bank.'),
  more:T('Подробнее о визите и проверках','More about the visit and checks'),
  title:T('Какой банк выбрать для счёта','Which bank to pick for an account'),
  badge:T('Игровая страница · по мотивам материалов SRB.GUIDE','Game page · inspired by the SRB.GUIDE material'),
  intro:T('Счёт нужен для оплаты жилья, связи и работы. В игре страница упрощена: условия меняются, а решение всегда принимает банк.','An account is needed for rent, phone service and work. The page is simplified for the game: conditions change, and the bank always makes the decision.'),
  compareTitle:T('Сравнение за десять секунд','Ten-second comparison'),
  rows:[['visit',T('Визит','Visit'),T('Лично','In person')],['docs',T('Бумаги','Papers'),T('Паспорт и адрес','Passport and address')],['checks',T('Проверки','Checks'),T('Вопросы банка','Bank questions')]],
  note:T('Ни один банк не обязан открыть счёт. Для гражданина любой страны ответ зависит от ситуации, документов и решения банка. По данным официального портала Сербии, банк просит документ с фотографией и подтверждение адреса, а в первый год пребывания иностранец считается нерезидентом. Перед визитом уточни требования у самого банка.','No bank is obliged to open an account. For a citizen of any country the answer depends on the situation, the papers and the bank’s decision. According to the official Serbian portal, a bank asks for a photo ID and proof of address, and in the first year of stay a foreigner counts as a non-resident. Check the requirements with the bank itself before you go.'),
  choose:T('Выбрать, куда пойти','Choose where to go'),
  chooseLocked:T('Открой хотя бы два банка, чтобы сравнить','Open at least two banks to compare'),
  back:T('К гиду','Back to the guide'),
  hint:T('Нажми на банк, чтобы прочитать подробнее.','Tap a bank to read more.'),
  sections:{visit:T('Личный визит','Visit in person'),docs:T('Что обычно спрашивают','What they usually ask for'),checks:T('Дополнительные проверки','Extra checks'),ask:T('Что уточнить заранее','What to ask beforehand')}
};
export const BANKS={
  api:{name:'API Bank',tag:T('Отдельный разбор: кому открывают счёт, документы, тарифы, карты и приложение','A separate walkthrough: who gets an account, papers, tariffs, cards and the app'),
    visit:T('Обычно приходят лично, с документами. Нужна ли запись, зависит от отделения.','Usually you come in person with your papers. Whether you need an appointment depends on the branch.'),
    docs:T('Паспорт, подтверждение адреса проживания (договор аренды или регистрация), контакты. Банк может попросить другие бумаги.','A passport, proof of your address (a lease or a registration) and contact details. The bank may ask for other papers.'),
    checks:T('Могут спросить о цели счёта и источнике средств. Банк сам решает, с кем заключать договор, и может отказать.','They may ask about the purpose of the account and the source of funds. The bank decides for itself whom to sign a contract with, and it may refuse.'),
    ask:T('Нужен ли вид на жительство в твоей ситуации, тарифы, как получить карту и приложение.','Whether a residence permit is needed in your situation, the tariffs, how to get the card and the app.'),
    short:{visit:T('Лично','In person'),docs:T('Паспорт, адрес','Passport, address'),checks:T('Цель и средства','Purpose and funds')}},
  alta:{name:'Alta Bank',tag:T('Личные и бизнес-счета для иностранцев: документы, карты, приложение, переводы','Personal and business accounts for foreigners: papers, cards, app, transfers'),
    visit:T('Уточни, нужна ли запись: без неё можно прождать свободное окно.','Check whether you need an appointment: without one you may wait for a free window.'),
    docs:T('Паспорт, адрес проживания и заявление на открытие счёта; для нерезидента банк просит заполнить дополнительную анкету.','A passport, proof of address and the account-opening request; for a non-resident the bank asks for an extra questionnaire.'),
    checks:T('Анкета и вопросы службы контроля возможны; ответ приходит не всегда в тот же день.','A questionnaire and compliance questions are possible; an answer does not always come the same day.'),
    ask:T('Язык обслуживания, лимиты переводов, как получить карту.','The service language, transfer limits, how to get the card.'),
    short:{visit:T('Уточнить запись','Check booking'),docs:T('Паспорт, адрес, анкета','Passport, address, form'),checks:T('Анкета банка','Bank form')}},
  adriatic:{name:'Adriatic Bank',tag:T('Личные и бизнес-счета для иностранцев; международный отдел, сроки, валюты, карты','Personal and business accounts for foreigners; the international department, timelines, currencies, cards'),
    visit:T('Личный визит, возможна встреча в международном отделе.','An in-person visit; a meeting in the international department is possible.'),
    docs:T('Паспорт, адрес проживания и пояснения о цели счёта. Иногда просят дополнительное подтверждение.','A passport, proof of address and an explanation of the account’s purpose. Sometimes extra confirmation is requested.'),
    checks:T('Вопросов бывает больше, возможен повторный визит. Сроки рассмотрения нужно уточнять.','There can be more questions and a second visit is possible. Review times need to be checked.'),
    ask:T('Сроки, валюты счёта, какие подтверждения подойдут именно тебе.','Review times, account currencies, which confirmations suit you.'),
    short:{visit:T('Лично, межд. отдел','In person, intl. dept'),docs:T('Паспорт, адрес, цель','Passport, address, purpose'),checks:T('Больше вопросов','More questions')}},
  other:{name:T('Другие банки','Other banks'),tag:T('Raiffeisen и Поштанска штедионица: открытие счёта, карты, переводы SWIFT','Raiffeisen and Poštanska štedionica: opening an account, cards, SWIFT transfers'),
    visit:T('Требования у каждого банка свои; в гиде они разобраны отдельно.','Each bank has its own requirements; the guide covers them separately.'),
    docs:T('Список зависит от банка и от твоей ситуации. Сверяй его в самом банке.','The list depends on the bank and on your situation. Check it with the bank itself.'),
    checks:T('Условия для иностранцев нужно уточнять заранее.','Conditions for foreigners need to be checked in advance.'),
    ask:T('Подходит ли банк для твоего случая. В этой истории ты их пока не рассматриваешь.','Whether the bank suits your case. In this story you are not considering them yet.'),
    short:{visit:T('Уточнять','Check first'),docs:T('По банку','Per bank'),checks:T('По банку','Per bank')}}
};
