// A secret thread: a police officer in uniform and a balaclava at the break spot by the fence of the police station in the district
// where the hero rents a flat. The hero goes there for the white card (beli karton, the registration of the place of stay) and
// meets him three times (days 4, 9 and 17). Under the mask is Miloš, the nephew of the flat's owner: the clues are the cardamom coffee,
// the tune of four notes and the signet ring that the owner has at home. The reveal is on day 20 in the owner's kitchen.
// He is an ordinary patrol officer: he does not decide cases and never offers favours. The mask is part of the street uniform;
// he is friendly, the player can leave the mystery alone, and every step toward closeness is the player's choice.
import {T} from './days.js?v=0.17.2';
export function extendMaskedPatrol({NODES:N,JOURNAL:J,n,scene}){
 const out=label=>({kind:'tap',label,object:label});
 const note=(ru,en)=>n(T(ru,en));
 const masked=T('Человек в балаклаве','The masked officer');
 T('Милош','Miloš');
 const say=(ru,en)=>({speaker:masked,text:T(ru,en),emotion:'friendly'});
 const by=(speaker,flag,variants)=>{
  const text=Object.fromEntries(Object.entries(variants).map(([key,[ru,en]])=>[key,T(ru,en)]));
  return {speaker,byFlag:{flag,text},text:text.default};
 };
 const choice=(label,tone,next,effect)=>({label:T(...label),tone,next,effect});
 const place=(ru,en,time,bg)=>({bg,location:T(ru,en),time,exitAction:out('Продолжить')});
 const add=(startId,option)=>N[startId].choices.push(option);
 J.masked_patrol={title:T('Полицейский у забора','The officer by the fence'),tag:T('ЗАГАДКА · РАЙОН','MYSTERY · THE DISTRICT'),text:T('У забора отделения есть место для перерывов, и там сидит полицейский в форме и балаклаве. Лица не видно, но я замечаю мелочи: кофе с кардамоном, четыре ноты мотива, перстень на мизинце. Это не слежка и не угроза, а загадка, которую можно разгадать или оставить.','By the fence of the police station there is a place for breaks, and a police officer in uniform and a balaclava sits there. The face is hidden, but I notice small things: coffee with cardamom, a tune of four notes, a ring on a little finger. It is neither surveillance nor a threat but a riddle that can be solved or left alone.')};

 // Day 4: the family kitchen carries the clues, so they can be recognised later.
 N.d4_turn.pages.push(note('Кофе на этой кухне варят с кардамоном, а владелец по привычке напевает короткий мотив из четырёх нот. На мизинце у владельца старый перстень-печатка с двумя буквами.','Coffee in this kitchen is made with cardamom, and the owner hums a short tune of four notes out of habit. On the owner’s little finger is an old signet ring with two letters.'));

 // Day 4, first meeting: going to the police station for the white card.
 add('d4_start',{...choice(['Сходить в отделение за белым картоном','Go to the police station for the white card'],'practical','d4_station',{}),when:{flag:'whiteCardDone',notEquals:true}});
 add('d4_start',{...choice(['Зайти в отделение уточнить вопрос об адресе','Visit the station to ask about the address'],'practical','d4_station',{}),when:{flag:'whiteCardDone',equals:true}});
 N.d4_station=scene([
  note('Белый картон — подтверждение регистрации места пребывания. Я решаю забрать его в отделении за углом: так будет спокойнее, чем ждать, пока кто-то передаст.','The white card is the confirmation that my place of stay is registered. I decide to collect it at the police station round the corner: that will be calmer than waiting for someone to pass it on.'),
  note('Отделение в двух кварталах. У забора есть место для перерывов: лавка, урна и жестяная банка. На лавке сидит полицейский в форме и чёрной балаклаве, натянутой так, что видны только глаза, и пьёт кофе из бумажного стакана.','The station is two blocks away. By the fence there is a place for breaks: a bench, a bin and a tin can. On the bench sits a police officer in uniform and a black balaclava pulled so that only his eyes show, drinking coffee from a paper cup.'),
  say('Вам к окну номер три. Скажите, что за белым картоном. Проводил бы, но у меня перерыв.','You want window number three. Say you have come for the white card. I would walk you, but I am on a break.'),
  note('Голос приглушён тканью, но звучит мягко. Он не курит: банка рядом пустая, будто место осталось ему от старой привычки.','His voice is muffled by the cloth but sounds soft. He is not smoking: the can beside him is empty, as if the place were left to him from an old habit.')
 ],null,{...place('ОТДЕЛЕНИЕ · МЕСТО ДЛЯ ПЕРЕРЫВОВ','STATION · THE BREAK SPOT','10:30','belgrade-courtyard'),journal:['masked_patrol'],choices:[
  choice(['Спросить, почему он в балаклаве','Ask why he wears a balaclava'],'explore','d4_station_ask',{maskMet:true,maskAsked:true}),
  choice(['Поблагодарить и пойти к окну','Thank him and go to the window'],'practical','d4_mid',{maskMet:true})]});
 N.d4_station.pages[0].byFlag={flag:'whiteCardDone',text:{true:T('Белый картон уже лежит в папке. Я захожу в отделение уточнить вопрос о подтверждении адреса.','My white card is already in my folder. I stop by the station to ask about proof of address.'),default:N.d4_station.pages[0].text}};
 N.d4_station.pages[2].byFlag={flag:'whiteCardDone',text:{true:T('Вам к окну номер три. Там подскажут по подтверждению адреса. Проводил бы, но у меня перерыв.','You want window number three. They can help with proof of address. I would walk you, but I am on a break.'),default:N.d4_station.pages[2].text}};
 N.d4_station_ask=scene([
  say('Положено на уличной смене. Лицо моё вам ни к чему, а вот картон — другое дело: возьмёте его у окна, как все. Тут у всех одни правила.','It is required on street duty. My face is of no use to you, but the card is another matter: you take it at the window, like everyone. Here everyone has the same rules.'),
  note('Он говорит без обиды. От стакана пахнет кофе с кардамоном, и этот запах странно уютный.','He speaks without offence. The cup smells of coffee with cardamom, and the smell is strangely cosy.')
 ],null,{...place('ОТДЕЛЕНИЕ · МЕСТО ДЛЯ ПЕРЕРЫВОВ','STATION · THE BREAK SPOT','10:35','belgrade-courtyard'),journal:['masked_patrol'],choices:[
  choice(['Запомнить запах кардамона','Remember the smell of cardamom'],'explore','d4_mid',{maskClue1:true}),
  choice(['Пойти к окну','Go to the window'],'practical','d4_mid',{})]});
 N.d4_station_ask.pages[0].byFlag={flag:'whiteCardDone',text:{true:T('Положено на уличной смене. А по адресу вам ответят у окна, как всем. Тут у всех одни правила.','It is required on street duty. For the address question, ask at the window, like everyone. Here everyone has the same rules.'),default:N.d4_station_ask.pages[0].text}};

 // Day 9: back at the station to ask about address confirmations.
 add('d9_start',choice(['Зайти в отделение и спросить про подтверждение адреса','Go to the police station and ask about address confirmations'],'practical','d9_station',{}));
 N.d9_station=scene([
  note('Я возвращаюсь в отделение уточнить, какие подтверждения адреса принимают. У забора на той же лавке сидит знакомая фигура в балаклаве.','I go back to the police station to ask which address confirmations are accepted. On the same bench by the fence sits the familiar figure in a balaclava.'),
  say('Снова вы. Окно три, там расскажут про адрес. Я только подсказываю дорогу.','You again. Window three, they will tell you about the address. I only show the way.'),
  note('Он напевает что-то под нос: ровный мотив из четырёх нот. Мне кажется, я его уже слышал{a}, но не могу вспомнить где.','He hums something under his breath: an even tune of four notes. It seems I have heard it before, but I cannot remember where.')
 ],null,{...place('ОТДЕЛЕНИЕ · МЕСТО ДЛЯ ПЕРЕРЫВОВ','STATION · THE BREAK SPOT','11:00','belgrade-courtyard'),journal:['masked_patrol'],choices:[
  choice(['Запомнить мотив','Remember the tune'],'explore','d9_mid',{maskMet:true,maskClue2:true}),
  choice(['Пойти к окну','Go to the window'],'practical','d9_mid',{maskMet:true})]});

 // Day 17: a copy of the receipt, a second cup of coffee.
 add('d17_start',choice(['Отнести в отделение копию квитанции','Take a copy of the receipt to the police station'],'practical','d17_station',{}));
 N.d17_station=scene([
  note('Я несу в отделение копию квитанции, чтобы убедиться, что у них в деле всё сходится. У забора та же лавка и тот же человек в балаклаве, на этот раз с двумя стаканами.','I take a copy of the receipt to the police station to make sure everything matches in their file. By the fence there is the same bench and the same person in a balaclava, this time with two cups.'),
  say('Второй стакан для напарника, а он не пришёл. Берите.','The second cup is for my partner, who has not come. Take it.'),
  note('Я беру стакан. Из рукава выглядывает рука: на мизинце старый перстень-печатка с двумя буквами. Я почти узнаю его и не понимаю откуда.','I take the cup. A hand shows from the sleeve: on the little finger is an old signet ring with two letters. I almost recognise it and cannot think where from.')
 ],null,{...place('ОТДЕЛЕНИЕ · МЕСТО ДЛЯ ПЕРЕРЫВОВ','STATION · THE BREAK SPOT','10:30','belgrade-courtyard'),journal:['masked_patrol'],choices:[
  choice(['Запомнить перстень','Remember the ring'],'explore','d17_mid',{maskMet:true,maskClue3:true}),
  choice(['Поблагодарить и пойти к окну','Thank him and go to the window'],'practical','d17_mid',{maskMet:true})]});

 // Day 20: the reveal in the owner's kitchen. The nephew of the owner, Miloš, an ordinary patrol officer.
 N.d20_turn.next='d20_nephew';
 N.d20_nephew=scene([
  by('narrator','maskMet',{true:['В дверь кухни входит молодой полицейский в форме, но без балаклавы. Я не знаю его в лицо и всё же узнаю глаза.','A young police officer in uniform but without a balaclava comes in at the kitchen door. I do not know his face and yet I recognise the eyes.'],default:['В дверь кухни входит молодой полицейский в форме, без балаклавы. У него открытое лицо и такая улыбка, которую трудно не заметить.','A young police officer in uniform and without a balaclava comes in at the kitchen door. He has an open face and the kind of smile that is hard not to notice.']}),
  by('host','maskMet',{true:['Это мой племянник Милош. Он в полиции, иногда забегает после смены. А это наш жилец. Кажется, вы уже виделись у забора отделения.','This is my nephew Miloš. He is in the police and sometimes drops in after his shift. And this is our tenant. I think you have already met by the fence of the station.'],default:['Это мой племянник Милош. Он в полиции, иногда забегает после смены. А это наш жилец.','This is my nephew Miloš. He is in the police and sometimes drops in after his shift. And this is our tenant.']}),
  by('narrator',['maskClue1','maskClue2','maskClue3'],{'true:true:true':['Кардамон на кухне, четыре ноты мотива и перстень на его мизинце: всё сходится, и я улыбаюсь собственной догадливости.','The cardamom in the kitchen, the four notes of the tune and the ring on his little finger: it all fits, and I smile at my own cleverness.'],default:['Он берёт чашку, и в воздухе плывёт кардамон. Что-то в его движениях кажется знакомым, хотя я не могу сказать что.','He picks up a cup, and cardamom drifts through the air. Something in his movements seems familiar, though I cannot say what.']})
 ],null,{...place('КУХНЯ · ВЕЧЕР','KITCHEN · EVENING','19:30','dorcol-apartment'),journal:['masked_patrol'],districtBg:false,bg:'first-room',choices:[
  choice(['Улыбнуться: «Так вот кто прячется под балаклавой»','Smile: “So that is who hides under the balaclava”'],'romance','d20_nephew_end',{maskEnd:'spark'}),
  choice(['Поздороваться и поблагодарить за помощь у забора','Say hello and thank him for his help by the fence'],'friendship','d20_nephew_end',{maskEnd:'friend'}),
  choice(['Сделать вид, что не узнаю','Pretend not to recognise him'],'personal','d20_nephew_end',{maskEnd:'secret'})]});
 N.d20_nephew_end=scene([
  by('Милош','maskEnd',{spark:['Попался. Но на службе балаклава — положенная форма, а дома я такой же, как все. Если хотите, можно выпить кофе без неё.','Caught. But on duty the balaclava is part of the uniform, and at home I am just like anybody. If you like, we can have a coffee without it.'],friend:['Пожалуйста. У нас на районе все помогают друг другу, а бумаги я не решаю. Захотите чаю — заходите.','You are welcome. In our district everyone helps one another, and I decide no papers. If you want tea, come round.'],default:['Хорошо, не узнали, так не узнали. Но кофе здесь варят с кардамоном, так что приходите на запах.','Fine, if you did not recognise me, you did not. But the coffee here is made with cardamom, so come for the smell.']}),
  note('Хозяин делает вид, что занят чайником. Милош садится на табурет у окна, снимает форменную кепку и вдруг становится не человеком в форме, а просто человеком.','The owner pretends to be busy with the kettle. Miloš sits on the stool by the window, takes off his cap and suddenly becomes not a person in uniform but simply a person.')
 ],'d20_end',{...place('КУХНЯ · ВЕЧЕР','KITCHEN · EVENING','19:50','first-room'),districtBg:false});

 // Day 27: a message or a meeting by the river, depending on what the player chose in the kitchen.
 add('d27_start',choice(['Выйти к набережной','Go out to the embankment'],'personal','d27_milos',{}));
 N.d27_milos=scene([
  by('Милош','maskEnd',{spark:['Моя смена закончилась. Если хотите, набережная в семь: без формы, без балаклавы и без бумаг.','My shift has ended. If you like, the embankment at seven: no uniform, no balaclava and no papers.'],friend:['Моя смена закончилась. Если хотите прогуляться как знакомые, набережная в семь.','My shift has ended. If you want a walk as acquaintances, the embankment at seven.'],default:['Здравствуйте. Если захотите кофе с кардамоном, дверь у моего дяди открыта.','Hello. If you want coffee with cardamom, my uncle’s door is open.']}),
  note('Вечером у воды ветер приносит запахи реки и горячего хлеба. Милош идёт рядом, без формы, и говорит о городе так, будто знает каждый камень.','In the evening the wind by the water brings smells of river and hot bread. Miloš walks beside me, without the uniform, and speaks of the city as though he knew every stone.'),
  note('Если это станет чем-то большим, это будет решение двоих. Дело решается в другом месте, и мы оба знаем, что от прогулки оно не зависит.','If this turns into something more, it will be a decision of two people. The case is decided elsewhere, and we both know it does not depend on a walk.')
 ],'d27_mid',{...place('НАБЕРЕЖНАЯ · ВЕЧЕР','EMBANKMENT · EVENING','19:00','riverside-evening'),journal:['masked_patrol']});
}
