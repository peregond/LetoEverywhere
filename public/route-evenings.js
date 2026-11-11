import {OFFICE_PEOPLE} from './day-office.js?v=0.17.2';
// Each evening owns its scenes and return address: no shared return flag can send a replay into another day.
const all=(...parts)=>({all:parts});
const eq=(flag,equals)=>({flag,equals});
export const EVENING_PEOPLE=[
 ['nikola','Никола','Nikola','nikola-evening',eq('companion','nikola'),eq('nikolaBond','romance'),'airport'],
 ['milica','Милица','Milica','milica',eq('companion','milica'),eq('milicaBond','romance'),'airport'],
 ['dragan','Драган','Dragan','dragan',eq('host','dragan'),eq('hostBond','romance'),'owner'],
 ['jelena','Йелена','Jelena','jelena',eq('host','jelena'),eq('hostBond','romance'),'owner'],
 ['asya','Ася','Asya','asya',eq('routeAsyaMet',true),eq('asyaBond','romance'),'asya'],
 ['luka','Лука','Luka','luka',eq('routeLukaMet',true),eq('lukaBond','romance'),'luka'],
 ...[['ana','Ана','Ana'],['stefan','Стефан','Stefan'],['marko','Марко','Marko'],['vuk','Вук','Vuk']].map(([id,ru,en])=>[id,ru,en,id,eq('rentalKnown_'+id,true),eq('rentalBond_'+id,'romance'),null]),
 ...OFFICE_PEOPLE.map(p=>[p.id,p.name,p.en,p.sprite,eq('routeOfficeContact_'+p.id,true),eq('routeOfficeBond_'+p.id,'romance'),null]),
 ['milos','Человек в балаклаве','The masked officer','milos-masked',eq('maskMet',true),eq('routeMaskBond','romance'),'milos']
];
export function buildEvenings({NODES:N,add,note,say,choice}){
 for(let day=1;day<=15;day++){
  const hub=`evening${day}`,end=`route${day}_close`;
  const options=[],meetOptions=[],messageOptions=[];
  for(const [id,ru,en,character,known,romantic,slot] of EVENING_PEOPLE){
   const root=`${hub}_${id}`,rel='routeRel_'+id;
   const person=(a,b)=>say(ru,a,b,{character});
   const office=OFFICE_PEOPLE.find(p=>p.id===id);
   meetOptions.push(choice(`Встретиться: ${ru}`,`Meet: ${en}`,root,'friendship',{},known));
   messageOptions.push(choice(`Написать: ${ru}`,`Message: ${en}`,root+'_message','friendship',{},known));
   add(root+'_message',[
    note('Я пишу без повода: как прошёл день?','I write without a reason: how was your day?'),
    {...person('Устал{a}? Можешь не отвечать сразу. Я радуюсь твоему сообщению.','Tired? You do not have to reply straight away. I am glad you wrote.'),message:true},
    note('Я рассказываю об одной маленькой удаче. Разговор не требует обещаний и заканчивается пожеланием спокойной ночи.','I tell them about one small success. The conversation asks for no promises and ends with a goodnight.')
   ],end);
   const actions=[choice('Побыть вместе по-дружески','Spend time as friends',root+'_friend','friendship')];
   if(day>1)actions.push(choice('Предложить свидание','Suggest a date',root+'_date','romance',{},all(romantic,{not:{flag:rel,in:[1,2,3]}})));
   if(day>=4)actions.push(choice('Спросить о поцелуе','Ask about a kiss',root+'_kiss_ask','romance',{},all(romantic,eq(rel,1))));
   if(day>=6)actions.push(choice('Обсудить ночь вдвоём','Talk about a night together',root+'_night_ask','romance',{},all(romantic,{flag:rel,in:[2,3]})));
   if(day===1&&['nikola','milica'].includes(id))actions.push(choice('Предложить близость без обещаний','Suggest intimacy without promises',root+'_night_ask','romance',{},romantic));
   add(root,[...(office?[person(...office.personal)]:[]),person('Спасибо, что позвал{a}. Что тебе сейчас хочется — разговора, тишины или чего-то большего?','Thank you for inviting me. What would you like now: conversation, quiet, or something more?'),note('Встреча сама по себе ничего не обещает. Я могу выбрать дружбу или уйти в любой момент.','Meeting promises nothing by itself. I can choose friendship or leave at any time.')],null,{choices:actions});
   add(root+'_friend',[person('Давай просто посидим рядом. Мне хорошо и без романтики.','Let us just sit together. I am happy without romance too.'),note('Мы делим чай и новости. На прощание я машу рукой; этот вечер не меняет наших границ.','We share tea and news. I wave goodbye; this evening does not change our boundaries.')],end);
   const dateEffect={[rel]:1,...(slot?{lastPartner:slot,loveStep:'date'}:{})};
   add(root+'_date',[person('Да, я тоже хочу свидания. Можно взять тебя за руку?','Yes, I would like a date too. May I hold your hand?')],null,{choices:[choice('Да, взять за руку','Yes, hold hands',root+'_date_yes','romance',dateEffect),choice('Свидание без прикосновений','A date without touching',root+'_date_no_touch','romance',dateEffect),choice('Передумать: только дружба','Change my mind: just friends',root+'_friend','friendship')]});
   add(root+'_date_yes',[note('Мы идём медленно и выбираем улицы по запаху выпечки. Рука в руке — ровно столько, сколько хочется обоим.','We walk slowly and choose streets by the smell of baking. We hold hands for as long as we both want.')],end);
   add(root+'_date_no_touch',[note('Мы гуляем рядом, без прикосновений. Свидание остаётся свиданием, а границы каждого — в силе.','We walk side by side without touching. It is still a date, and we respect each other’s boundaries.')],end);
   add(root+'_kiss_ask',[note('Я спрашиваю: «Можно тебя поцеловать?»','I ask: “May I kiss you?”'),person(id==='milos'?'Да, но маска останется на месте. Можно поцеловать мою ладонь, если хочешь.':'Да. И если передумаешь, просто скажи.',id==='milos'?'Yes, but the mask stays on. You can kiss my hand if you like.':'Yes. And if you change your mind, just say so.')],null,{choices:[choice('Да','Yes',root+'_kiss','romance',{[rel]:2,...(slot?{lastPartner:slot,loveStep:'kiss'}:{})}),choice('Пока подождать','Wait for now',root+'_friend','friendship')]});
   add(root+'_kiss',[note(id==='milos'?'Я целую его ладонь. Балаклава по-прежнему закрывает лицо; мы не пытаемся изменить это.':'Мы целуемся и останавливаемся, чтобы спросить: «Всё хорошо?» Ответ — тихое «да».',id==='milos'?'I kiss his hand. The balaclava still covers his face; we do not try to change that.':'We kiss and pause to ask: “Is everything all right?” The answer is a quiet “yes”.')],end);
   add(root+'_night_ask',[note('Я говорю: «Мне хочется остаться с тобой. А тебе?»','I say: “I want to stay with you. Would you like that too?”'),person(id==='milos'?'Я тоже хочу остаться. Но маску не снимаю. Если тебе так не подходит, просто выпьем чай.':'Да, я тоже хочу. Можно остановиться в любой момент, и это ничего между нами не испортит.',id==='milos'?'I want to stay too. But I keep the mask on. If that does not work for you, we can simply have tea.':'Yes, I want this too. We can stop at any time, and it will not spoil anything between us.')],null,{choices:[choice('Я согласен{a}. Остаться вместе','I agree. Stay together',root+'_fade','romance',{[rel]:3,...(slot?{lastPartner:slot,makeLover:true}:{})}),choice('Сегодня только чай','Just tea tonight',root+'_friend','friendship')]});
   add(root+'_fade',[note('Мы ещё раз спрашиваем друг друга и слышим ясное «да». Свет гаснет; остальное остаётся между нами.','We ask each other once more and hear a clear “yes”. The light goes out; the rest stays between us.')],end,{adult:true,skipTo:end});
  }
  options.push(choice('Выбрать встречу','Choose a meeting',hub+'_meet','friendship'));
  options.push(choice('Выбрать переписку','Choose a conversation',hub+'_messages','friendship'));
  for(const [kind,list] of [['meet',meetOptions],['messages',messageOptions]])add(hub+'_'+kind,[note('С кем я хочу связаться сегодня?','Whom would I like to contact today?')],null,{choices:[...list,choice('Вернуться к выбору вечера','Return to evening options',hub,'personal')]});
  options.push(choice('Собрать знакомых за чаем','Gather my acquaintances for tea',hub+'_company','friendship'));
  options.push(choice('Побыть одному','Spend the evening alone',hub+'_alone','personal'));
  if(day===4)options.push(choice('Обсудить близость втроём','Discuss intimacy as three', 'route4_group_airport','romance',{},all({flag:'host',in:['dragan','jelena']},eq('hostBond','romance'),{any:[all(eq('companion','nikola'),eq('nikolaBond','romance')),all(eq('companion','milica'),eq('milicaBond','romance'))]})));
  add(hub,[note('Дела на сегодня закончены. Кого мне хочется увидеть, кому написать — или оставить вечер себе?','Today’s errands are over. Whom would I like to see or message — or shall I keep the evening for myself?')],null,{time:'20:30',choices:options});
  add(hub+'_company',[say('contact','Я принесу что-нибудь к чаю. Позови тех, с кем уже знаком{a}; большой вечер не обязателен.','I will bring something for tea. Invite the people you already know; it need not be a big gathering.',{cameo:true}),note('За столом только знакомые лица. Мы слушаем друг друга, не требуя веселья или признаний.','Only familiar faces sit at the table. We listen to each other without demanding fun or confessions.')],end);
  add(hub+'_alone',[note('Я убираю телефон и открываю окно. На сегодня мне достаточно города за окном и собственного спокойствия.','I put my phone away and open the window. Tonight the city outside and my own peace are enough.')],end);
 }
 for(const [id,node] of Object.entries(N))if(id.startsWith('evening15_')){
  const person=EVENING_PEOPLE.find(([who])=>id.startsWith('evening15_'+who));
  if(person)node.effectOnEnter={...node.effectOnEnter,routeEndingWith:person[0]};
  else if(id==='evening15_alone'||id==='evening15_company')node.effectOnEnter={routeEndingWith:id.endsWith('alone')?'alone':'company'};
 }
 // Every participant answers separately; declining at any point leaves the evening friendly.
 add('route4_group_airport',[say('contact','Ты предлагаешь вечер втроём? Мне интересно, но сначала спросим каждого отдельно. Я могу передумать, как и вы.','An evening as three? I am interested, but let us ask everyone separately first. I can change my mind, just like you.',{cameo:true})],null,{choices:[choice('Спросить хозяина временной комнаты','Ask the temporary host','route4_group_host','romance',{}, {all:[{flag:'companion',equals:'nikola'},{flag:'nikolaBond',equals:'romance'}]}),choice('Спросить хозяина временной комнаты','Ask the temporary host','route4_group_host','romance',{}, {all:[{flag:'companion',equals:'milica'},{flag:'milicaBond',equals:'romance'}]}),choice('Остановиться на дружеском вечере','Keep the evening friendly','evening4_company','friendship')]});
 add('route4_group_host',[say('host','Я тоже хочу. Условия жилья от этого не меняются. Давайте ещё раз решим все вместе: без давления и с правом остановиться.','I want this too. Housing terms do not change. Let us decide together once more: no pressure, and anyone can stop.',{hostPortrait:true})],null,{hostPortrait:true,choices:[choice('Все трое согласны; остаться вместе','All three agree; stay together','route4_group_fade','romance',{routeGroupConsent:true}),choice('Лучше просто чай','Tea sounds better','evening4_company','friendship')]});
 add('route4_group_fade',[note('Каждый вслух говорит «да». Мы договариваемся остановиться по первому слову любого участника. Лампа гаснет.','Each of us says “yes” aloud. We agree to stop at the first word from any participant. The lamp goes out.')],'route4_close',{adult:true,skipTo:'route4_close'});
}
