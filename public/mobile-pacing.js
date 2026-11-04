// Original node IDs/page positions stay stable for existing local and cloud saves.
const tap=(label,object='Продолжить',extra={})=>({kind:'tap',label,object,...extra});
const check=(label,items,extra={})=>({kind:'checklist',label,items,...extra});
const reply=(label,extra={})=>({kind:'reply',label,options:[{label:'«Спасибо. Напишу, когда доберусь»',tone:'friendship',effect:{lastMessageTone:'friendship'}},{label:'«Мне хочется увидеться ещё раз»',tone:'romance',effect:{lastMessageTone:'romance'}}],...extra});
const endings={
  arrivals_corridor:tap('Сойти с самолёта','Выход'),
  escalator_walk:tap('Найти указатель к багажу','Указатель'),
  sunlit_walk:tap('Пройти по галерее','Галерея'),
  baggage_wait:tap('Найти пятую ленту','Лента 05'),
  arrival:tap('Выйти в зал прилёта','Двери'),
  arrival_plan:tap('Открыть заметку с планом','План'),
  terminal:tap('Посмотреть, где кофе и выпечка','Зал'),
  introductions:tap('Протянуть руку для знакомства','Познакомиться'),
  coffee_start:tap('Сесть за столик у окна','Столик',{bg:'cafe-table'}),
  pause:tap('Отставить пустой стакан','Стакан'),
  phone:tap('Проверить новое сообщение','Телефон'),
  contact:tap('Открыть контакты на телефоне','Контакты'),
  exit:check('Собраться перед выходом',['Телефон','Чемодан','Адрес'],{effect:{departureChecked:true},feedback:'Всё с собой.'}),
  last_message:tap('Выйти к машине','Выход к машине'),
  nikola_name:tap('Забрать тёплый пакет','Пакет'),
  nikola_pause:tap('Показать фотографию подъезда','Фото адреса'),
  nikola_break:tap('Поставить стакан на стойку','Стакан'),
  nikola_questions:tap('Повернуться к Николе','Никола'),
  nikola_phone:tap('Открыть сообщение хозяина','Телефон'),
  nikola_goodbye:tap('Убрать телефон в карман','Телефон'),
  nikola_last:tap('Отойти от стойки с заказом','Пакет'),
  road_start:tap('Показать адрес водителю','Адрес',{effect:{driverAddressShown:true}}),
  courtyard_arrival:tap('Выйти из машины и найти дверь','Подъезд',{bg:'courtyard-door'}),
  keys_room:tap('Войти и поставить чемодан','Порог'),
  room_alone:tap('Закрыть дверь своей комнаты','Ключ',{effect:{roomKeyChecked:true}}),
  river_meeting:tap('Выйти на короткую прогулку','К реке'),
  night_messages:tap('Вернуться в комнату','Домой'),
  host_evening:tap('Спуститься во двор','Во двор',{bg:'courtyard-door'}),
  morning_start:check('Приготовиться ко сну',['Телефон на зарядке','Вода рядом','Будильник'],{effect:{nightReady:true}}),
  viewing_questions:tap('Открыть условия объявления','Объявление',{bg:'room-window'}),
  district_map:tap('Открыть карту Белграда','Карта'),
  district_host_talk:check('Проверить квартиру своими глазами',['Вода и розетки','Окна и шум','Связь'],{effect:{apartmentInspected:true},feedback:'Теперь можно задать свои вопросы.'}),
  morning_ready:tap('Сохранить ответы и контакт','Сохранить контакт',{effect:{viewingContactSaved:true}}),
  end:tap('Сохранить план следующего шага','Мой план',{effect:{nextDayPlanSaved:true}})
};
const internal={
  airport_apron:{2:tap('Проверить паспорт перед выходом','Паспорт',{effect:{passportChecked:true},feedback:'Паспорт на месте.'})},
  baggage_wait:{1:tap('Подхватить свой чемодан','Мой чемодан',{effect:{luggageCollected:true},feedback:'Чемодан со мной.'})},
  arrival:{3:tap('Проверить сохранённый адрес','Адрес',{effect:{arrivalAddressChecked:true}}),7:tap('Осмотреть зал и встречающих','Осмотреться')},
  terminal:{2:tap('Найти место для короткой остановки','Кофе или выпечка')},
  milica_hello:{3:{kind:'reply',label:'Выбрать напиток',bg:'cafe-table',options:[{label:'Обычный кофе',tone:'practical',effect:{coffeeChoice:'black'}},{label:'Кофе с молоком',tone:'practical',effect:{coffeeChoice:'milk'}}]}},
  serbian:{3:tap('Попробовать произнести «Dobar dan»','Повторить приветствие',{effect:{serbianPracticed:true}})},
  honest:{3:tap('Показать полный адрес','Фото и улица')},
  introductions:{1:tap('Представиться: «{full}»','Назвать своё имя'),6:tap('Спросить, кого ждёт Милица','Спросить'),11:tap('Подойти к свободному столику','Столик',{bg:'cafe-table'})},
  coffee_start:{3:tap('Снять сумку и устроиться удобнее','Свободный стул'),7:tap('Попробовать кофе','Чашка',{bg:'cafe-table',feedback:'Горячий. Можно выдохнуть.'})},
  city:{3:check('Открыть свой список на первый день',['Жильё','Связь и банк','Документы'],{effect:{firstPlanOpened:true}}),7:tap('Подвинуть стакан и салфетку','Салфетка',{bg:'cafe-table'})},
  sketch:{2:tap('Попросить открыть блокнот','Блокнот',{bg:'cafe-table'}),7:tap('Рассмотреть рисунок внимательнее','Рисунок')},
  pause:{3:tap('Спросить, что она заметила сегодня','Задать вопрос'),8:tap('Поставить чашку на стол','Чашка',{bg:'cafe-table'})},
  new_life:{2:tap('Отложить телефон и посмотреть на Милицу','Послушать ответ')},
  contact:{3:tap('Достать телефон для обмена контактами','Телефон'),7:tap('Сохранить Milica в контактах','Добавить контакт',{effect:{milicaContactSaved:true}})},
  exit:{3:tap('Уточнить, что означает «Polako»','Спросить значение'),8:tap('Проверить путь к выходу','К выходу')},
  bakery_arrival:{3:tap('Подойти к стойке и поздороваться','Стойка',{bg:'bakery-display'}),7:tap('Рассмотреть выпечку в витрине','Витрина',{bg:'bakery-display'})},
  nikola_recommend:{3:tap('Показать выбранную кифлу','Кифла',{bg:'bakery-display',effect:{pastryPicked:true}})},
  nikola_sweet:{2:tap('Выбрать сладкую выпечку','Сладкая булочка',{bg:'bakery-display',effect:{pastryPicked:true}})},
  nikola_name:{1:tap('Представиться: «{full}»','Назвать своё имя'),6:tap('Подойти к свободному стулу','Столик'),10:tap('Отломить кусочек выпечки','Тёплая кифла',{bg:'bakery-display'})},
  nikola_pause:{2:tap('Найти фотографию подъезда','Телефон'),6:tap('Открыть сообщение с улицей','Адрес')},
  nikola_new:{2:tap('Поставить стакан и дослушать ответ','Стакан')},
  nikola_unsure:{2:tap('Улыбнуться его шутке','Улыбнуться')},
  nikola_questions:{4:tap('Уточнить, во сколько он начинает смену','Задать вопрос')},
  nikola_flirt:{2:tap('Выдержать его взгляд','Посмотреть в глаза',{effect:{nikolaEyeContact:true}})},
  nikola_daydream:{3:tap('Вернуться к настоящему разговору','Вернуться')},
  nikola_phone:{3:tap('Отправить хозяину время прибытия','Отправить сообщение',{effect:{hostArrivalSent:true}}),7:tap('Открыть новый чат с Николой','Чат Nikola',{effect:{nikolaContactSaved:true}})},
  nikola_goodbye:{3:tap('Улыбнуться в ответ','Улыбнуться'),7:tap('Запомнить слово «Polako»','Запомнить',{effect:{polakoRemembered:true}})},
  nikola_last:{2:tap('Поднять пакет вместо прощального жеста','Помахать пакетом')},
  keys_room:{3:check('Проверить ключ и устроиться',['Ключ открывает дверь','Телефон ловит сеть','Чемодан внутри'],{bg:'courtyard-door',effect:{roomKeyChecked:true}})},
  river_meeting:{2:tap('Показать новый ключ','Ключ')},
  river_close:{3:{kind:'reply',label:'Как ответить на «Можно?»',options:[{label:'Дать свою ладонь',tone:'romance',effect:{eveningIntent:'romance'}},{label:'Улыбнуться и пока оставить руки на парапете',tone:'friendship',effect:{eveningIntent:'friendship'},next:'river_friendly'}]}},
  host_coffee_lend:{0:{kind:'reply',label:'Какую вещь принести',options:[{label:'Серую',tone:'personal',effect:{hostTop:'grey'}},{label:'Белую',tone:'personal',effect:{hostTop:'white'}}]}},
  host_evening:{2:tap('Убрать телефон и идти рядом','Телефон в карман')},
  host_evening_close:{3:tap('Обнять на прощание','Обнять',{effect:{hostHug:true}})}
};
function semanticMood(page,text){
  if(/сме[ёе]т|сме[ёе]м|шут|смайл|смеш|засме|смеясь/iu.test(text))return 'laughing';
  if(/свидан|поцел|обнять|объят|рука.*мо|нравится.*тоб|посмотреть.*глаз|чуть дольше|флирт|румян|кофе.*без.*квартир/iu.test(text))return 'flirty';
  if(/не отвеч|молчи|дума|задум|план|договор|регистрац|вопрос|срок|плат[её]ж|шум|связь/iu.test(text)||page.speaker==='player')return 'thoughtful';
  return 'friendly';
}
export function applyMobilePacing({NODES,BACKGROUNDS,CHARACTER_SPRITES}){
  for(const [id,label] of Object.entries({'cafe-table':'КАФЕ · СТОЛИК У ОКНА','bakery-display':'ПЕКАРНЯ · ВИТРИНА','room-window':'КОМНАТА · СТОЛ У ОКНА','courtyard-door':'ДВОР · ДВЕРЬ И КЛЮЧ'}))BACKGROUNDS[id]={label,description:label.toLowerCase(),position:'50% 55%'};
  for(const character of ['milica','nikola-evening','dragan','jelena'])for(const mood of ['thoughtful','laughing','flirty'])CHARACTER_SPRITES[character][mood]={file:`${character}-${mood}${['dragan','jelena'].includes(character)?'-v2':''}`,alt:`${{milica:'Милица','nikola-evening':'Никола',dragan:'Драган',jelena:'Йелена'}[character]}: ${{thoughtful:'внимательно слушает',laughing:'смеётся',flirty:'тёплый заинтересованный взгляд'}[mood]}`};
  internal.nikola_daydream_early=internal.nikola_daydream;
  for(const [id,node] of Object.entries(NODES)){
    node.actions={...internal[id]};
    if(!node.choices){const rule=node.exitAction??endings[node.next];if(!rule)throw Error('Missing mobile action '+id);node.actions[node.pages.length-1]=structuredClone(rule);}
    if(id==='last_message')node.actions[node.pages.length-1]=reply('Ответить Милице',{options:[{label:'«Спасибо. Напишу, когда доберусь»',tone:'friendship',effect:{lastMessageTone:'friendship'}},{label:'«Мне хочется увидеться ещё раз»',tone:'romance',effect:{lastMessageTone:'romance'}}]});
    if(id==='nikola_last')node.actions[node.pages.length-1]=reply('Ответить Николе',{options:[{label:'«Кифла спасла день. Спасибо!»',tone:'friendship',effect:{lastMessageTone:'friendship'}},{label:'«Вернусь не только за кифлой»',tone:'romance',effect:{lastMessageTone:'romance'}}]});
    if(id==='nikola_daydream')node.actions[node.pages.length-1]=tap('Взять стакан воды','Вода');
    if(id==='room_rest')node.actions[node.pages.length-1]=check('Устроиться на вечер',['Зарядка','Вода','Закрытые объявления'],{effect:{eveningRestReady:true}});
    if(id==='host_evening_close'||id==='host_evening_goodnight')node.actions[node.pages.length-1]=tap('Открыть дверь своей комнаты','Ключ',{bg:'courtyard-door'});
    const boundaries=[...Object.keys(node.actions).map(Number),...(node.choices?[node.pages.length-1]:[])].sort((a,b)=>a-b);
    let previous=-1;for(const boundary of boundaries){if(boundary-previous>5)throw Error('Too long between actions: '+id);previous=boundary;}
    for(const [index,action]of Object.entries(node.actions)){node.pages[Number(index)].action=action;}
    const staged=node.hostPortrait?['dragan','jelena']:node.districtPortrait?['dragan','jelena']:node.companionPortrait?['milica','nikola-evening']:node.character?[node.character]:(node.portrait?['milica']:[]);
    const candidates=[...new Set([...staged,...node.pages.map(page=>page.character).filter(Boolean)])];
    for(const character of candidates){let previousMood=null;node.pages.forEach(page=>{
      if(page.portrait===false)return;
      const text=page.hostText?.[character]??page.districtText?.[character]??page.contactText?.[character==='nikola-evening'?'nikola':character]??page.text;
      let mood=page.emotion??((page.daydream??node.daydream)?node.emotion:semanticMood(page,text));
      if(!(page.daydream??node.daydream)&&mood===previousMood)mood=mood==='friendly'?'thoughtful':mood==='flirty'&&CHARACTER_SPRITES[character].shy?'shy':'friendly';
      if(!CHARACTER_SPRITES[character][mood])mood='friendly';
      page.reactions??={};page.reactions[character]=mood;previousMood=mood;
    });}
  }
  for(const id of ['coffee_start','city','sketch'])for(let i=0;i<NODES[id].pages.length;i++)if(i%4===0)NODES[id].pages[i].bg='cafe-table';
  for(const id of ['room_alone','morning_start','housing_work'])NODES[id].pages[0].bg='room-window';
}
export function beatActionAt(node,index){return node.actions?.[index]??null;}
