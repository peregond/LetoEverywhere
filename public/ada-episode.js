// Chapter 3 rest episode: Ada Ciganlija. Not a date. The player is tired and may go alone
// or with someone already befriended or romanced. Scene IDs elsewhere stay put.
export const ADA_EN={};
const T=(ru,en)=>(ADA_EN[ru]=en,ru);
const CLOSE=['friendship','romance'];
const bond=flag=>({flag,in:CLOSE});
const all=(...parts)=>({all:parts});

export function adaCompany(flags={}){
  const who=flags.adaWith;
  if(who==='alone')return null;
  if(['nikola','milica','dragan','jelena','ana','stefan','marko','vuk'].includes(who))return who;
  if(!who&&flags.companion==='nikola')return 'nikola';
  if(!who&&flags.companion==='milica')return 'milica';
  return null;
}

export function extendAdaEpisode({NODES,JOURNAL,BACKGROUNDS,CHARACTER_SPRITES}){
  Object.assign(BACKGROUNDS,{
    'ada-lake-v1':{label:T('АДА · ОЗЕРО','ADA · THE LAKE'),description:T('Галька, велосипеды и широкая вода Ады Циганлии','Pebbles, bicycles and the wide water of Ada Ciganlija'),position:'50% 48%'},
    'ada-promenade-v1':{label:T('АДА · ПРОМЕНАД','ADA · PROMENADE'),description:T('Тенистая аллея вдоль Савского озера','A shady walk along the Sava lake'),position:'50% 46%'},
    'ada-lana-tower-v1':{label:T('АДА · ВЫШКА','ADA · THE TOWER'),description:T('Деревянная спасательная вышка и галечный пляж','A wooden lifeguard tower and the pebble beach'),position:'50% 42%'},
    'ada-nenad-bridge-v1':{label:T('АДА · У МОСТА','ADA · BY THE BRIDGE'),description:T('Сторона моста через Савское озеро и спасатель на вышке','The bridge side of the Sava lake and the lifeguard on the tower'),position:'50% 40%'},
    'ada-melon-cafe-v1':{label:T('АДА · АРБУЗ','ADA · WATERMELON'),description:T('Пляжное кафе и холодная лубеница','A beach cafe and a cold watermelon'),position:'50% 48%'}
  });
  const swim={
    nikola:['nikola-swim-short-buzz-v3','Никола в коротких плавательных шортах у озера'],
    milica:['milica-swim-v1','Милица в майке и шортах для пляжа'],
    dragan:['dragan-swim-v1','Драган в плавательных шортах'],
    jelena:['jelena-swim-v1','Йелена в майке и шортах для пляжа'],
    ana:['ana-swim-v1','Ана в майке и шортах для пляжа'],
    stefan:['stefan-swim-v1','Стефан в плавательных шортах'],
    marko:['marko-swim-v1','Марко в плавательных шортах'],
    vuk:['vuk-swim-v1','Вук в плавательных шортах']
  };
  for(const [id,[file,alt]] of Object.entries(swim))CHARACTER_SPRITES[id].swim={file,alt:T(alt,{
    nikola:'Nikola in shorter swim shorts by the lake',milica:'Milica in a tank top and shorts for the beach',dragan:'Dragan in swim shorts',jelena:'Jelena in a tank top and shorts for the beach',ana:'Ana in a tank top and shorts for the beach',stefan:'Stefan in swim shorts',marko:'Marko in swim shorts',vuk:'Vuk in swim shorts'
  }[id])};
  Object.assign(JOURNAL,{
    ada_rest:{title:T('Отдых на Аде','A rest at Ada'),tag:T('ГЛАВА 3 · АДА','CHAPTER 3 · ADA'),text:T('Устал{a} и поехал{a} на Аду Циганлију просто полежать. Без новых планов на вечер. Там были галька, вышка, арбуз и дорога домой.','I was tired and went to Ada Ciganlija just to lie down. No new plans for the evening. There were pebbles, a tower, watermelon and the way home.')}
  });
  const n=(ru,en,extra={})=>({speaker:'narrator',text:T(ru,en),...extra});
  const LANA=T('Лана','Lana'),NENAD=T('Ненад','Nenad'),BOJAN=T('Боян','Bojan'),VESNA=T('Весна','Vesna');
  const say=(speaker,ru,en,extra={})=>({speaker,text:T(ru,en),...extra});
  const varied=(ru,en,lines)=>n(ru,en,{byFlag:{flag:'adaWith',text:{...lines,default:T(ru,en)}}});
  const finish=(id,pages,next,extra={})=>{
    const node={bg:'ada-lake-v1',location:T('АДА ЦИГАНЛИЈА','ADA CIGANLIJA'),time:'21:05',day:'ДЕНЬ 1',chapter:T('Глава 3 · Ада','Chapter 3 · Ada'),chapterId:'districts',music:'district',pages,next,...extra};
    node.actions={};
    if(!node.choices){
      const action=node.exitAction??{kind:'tap',label:T('Дальше','Continue'),object:T('Дальше','Continue')};
      node.actions[pages.length-1]=action;pages[pages.length-1].action=action;
    }
    NODES[id]=node;return node;
  };
  const company=id=>({label:T(...id.label),next:'ada_arrive',tone:id.tone,effect:{adaWith:id.who},when:id.when});
  const samePerson=(who,bondFlag)=>({not:all({flag:'host',equals:who},bond(bondFlag))});
  finish('ada_tired',[
    n('Вечер получился полным. Я не расстроен{a} — просто устал{a} и хочу тишины.','The evening turned out full. I am not upset — I am just tired and want quiet.'),
    n('Не хочу ещё один разговор про депозит. Хочу лечь там, где город звучит как вода.','I do not want another conversation about the deposit. I want to lie down where the city sounds like water.'),
    n('Ада Циганлија — озеро внутри Белграда. Туда едут специально, чтобы ничего не решать.','Ada Ciganlija is a lake inside Belgrade. People go there on purpose in order to decide nothing.'),
    n('Можно поехать одному. Можно позвать того, с кем уже спокойно молчать. Без новых планов на вечер.','I can go alone. I can ask someone with whom silence already feels easy. No new plans for the evening.')
  ],null,{bg:'room-window',location:T('БЕЛГРАД · УСТАЛОСТЬ','BELGRADE · TIRED'),time:'20:40',choices:[
    {label:T('Поехать одному и просто полежать','Go alone and just lie down'),next:'ada_arrive',tone:'personal',effect:{adaWith:'alone'}},
    company({who:'nikola',tone:'friendship',label:['Написать Николе: «Хочу полежать у воды. Без планов»','Text Nikola: “I want to lie by the water. No plans”'],when:all({flag:'companion',equals:'nikola'},bond('nikolaBond'))}),
    company({who:'milica',tone:'friendship',label:['Написать Милице: «Хочу полежать у воды. Без планов»','Text Milica: “I want to lie by the water. No plans”'],when:all({flag:'companion',equals:'milica'},bond('milicaBond'))}),
    company({who:'dragan',tone:'friendship',label:['Позвать Драгана просто полежать, без ключей','Ask Dragan to just lie down, with no keys involved'],when:all({flag:'host',equals:'dragan'},bond('hostBond'))}),
    company({who:'jelena',tone:'friendship',label:['Позвать Йелену просто полежать, без ключей','Ask Jelena to just lie down, with no keys involved'],when:all({flag:'host',equals:'jelena'},bond('hostBond'))}),
    company({who:'dragan',tone:'friendship',label:['Позвать Драгана, который показывал квартиру','Ask Dragan, who showed the flat'],when:all({flag:'rentalCast',notEquals:'new'},{flag:'districtOwner',equals:'dragan'},bond('districtBond'),samePerson('dragan','hostBond'))}),
    company({who:'jelena',tone:'friendship',label:['Позвать Йелену, которая показывала квартиру','Ask Jelena, who showed the flat'],when:all({flag:'rentalCast',notEquals:'new'},{flag:'districtOwner',equals:'jelena'},bond('districtBond'),samePerson('jelena','hostBond'))}),
    company({who:'ana',tone:'friendship',label:['Позвать Ану: без камеры и без договора','Ask Ana: no camera and no contract'],when:all({flag:'rentalCast',equals:'new'},bond('rentalBond_ana'))}),
    company({who:'stefan',tone:'friendship',label:['Позвать Стефана: сегодня ничего не чинить','Ask Stefan: nothing to fix today'],when:all({flag:'rentalCast',equals:'new'},bond('rentalBond_stefan'))}),
    company({who:'marko',tone:'friendship',label:['Позвать Марко просто помолчать у воды','Ask Marko to just be quiet by the water'],when:all({flag:'rentalCast',equals:'new'},bond('rentalBond_marko'))}),
    company({who:'vuk',tone:'friendship',label:['Позвать Вука: можно в наушниках','Ask Vuk: headphones are allowed'],when:all({flag:'rentalCast',equals:'new'},bond('rentalBond_vuk'))})
  ]});
  finish('ada_arrive',[
    n('Автобус останавливается у деревьев. Вода широкая и совсем не море.','The bus stops by the trees. The water is wide and not the sea at all.'),
    n('Под ногами галька, не песок. По аллее едут велосипеды. Дальше стоят деревянные вышки.','Underfoot there are pebbles, not sand. Bicycles go along the path. Wooden towers stand further on.'),
    varied('Я снимаю обувь. День сразу становится короче.','I take off my shoes. The day immediately gets shorter.',{
      nikola:T('Никола садится на гальку первым и говорит: «Можно молчать. Я тоже устал».','Nikola sits on the pebbles first and says, “We can be quiet. I am tired too.”'),
      milica:T('Милица держит блокнот закрытым. «Сегодня рисую только воду, если вообще возьмусь».','Milica keeps the notebook shut. “Today I will only draw the water, if I draw at all.”'),
      dragan:T('Драган оставляет ключи в сумке. «Сегодня я без работы. Просто рядом».','Dragan leaves his keys in the bag. “I am off duty today. Just nearby.”'),
      jelena:T('Йелена смотрит на озеро и не начинает разговор о квартире. Это уже отдых.','Jelena looks at the lake and does not start a conversation about the flat. That is already a rest.'),
      ana:T('Ана не достаёт камеру. «Людей сегодня не снимаю. Только если попросят арбуз».','Ana does not take out the camera. “I am not photographing people today. Only if the watermelon asks.”'),
      stefan:T('Стефан разводит руками: «Чинить здесь нечего. Даже я это признаю».','Stefan spreads his hands. “There is nothing here to fix. Even I admit that.”'),
      marko:T('Марко кивает на тень. «Можно сесть и никому ничего не советовать. Я потренируюсь».','Marko nods at the shade. “We can sit and I will advise nobody. I will practise.”'),
      vuk:T('Вук снимает один наушник. «Шум озера нормальный. Его не надо записывать».','Vuk takes off one ear of the headphones. “The lake noise is fine. It does not need recording.”')
    }),
    n('Дышать уже легче. Этого пока достаточно.','Breathing is already easier. That is enough for now.')
  ],'ada_pick',{time:'21:10',adaPortrait:true,exitAction:{kind:'tap',label:T('Выбрать берег','Choose a shore'),object:T('Берег','The shore')}});
  finish('ada_pick',[
    n('Дальше два берега. Оба годятся, если цель — просто полежать.','There are two shores ahead. Both will do if the aim is just to lie down.'),
    n('У деревянной вышки пляж галечный и открытый. Там следят за водой.','By the wooden tower the beach is pebbles and open. Someone there watches the water.'),
    n('У моста больше тени, променад и кафе. Тоже можно ничего не делать.','By the bridge there is more shade, the promenade and cafes. Nothing has to be done there either.')
  ],null,{time:'21:18',bg:'ada-promenade-v1',adaPortrait:true,choices:[
    {label:T('К гальке и деревянной вышке','To the pebbles and the wooden tower'),next:'ada_pebbles',tone:'explore',effect:{adaSpot:'pebbles'}},
    {label:T('К мосту, променаду и кафе','To the bridge, the promenade and the cafes'),next:'ada_bridge',tone:'explore',effect:{adaSpot:'bridge'}}
  ]});
  finish('ada_pebbles',[
    n('Вышка деревянная и выше, чем нужно для такого спокойного озера. Женщина в красной форме спасателя смотрит на буйки, а не на тех, кто фотографируется.','The tower is wooden and taller than such a calm lake needs. A woman in a red lifeguard uniform is watching the buoys, not the people taking photos.'),
    say(LANA,'Вода сегодня нормальная. Уставшие обычно садятся под вышкой. Тень бесплатная.','The water is fine today. Tired people usually sit under the tower. The shade is free.'),
    n('Я говорю, что далеко не поплыву. Она кивает, будто это и был весь план.','I say I will not swim far. She nods as if that was the whole plan.'),
    say(LANA,'Если приехали отдыхать, начните с арбуза. Лоток у дорожки, он холодный.','If you came to rest, start with watermelon. The stand by the path is cold.')
  ],'ada_melon_pebbles',{time:'21:28',bg:'ada-lana-tower-v1',portrait:false,exitAction:{kind:'tap',label:T('Пойти за арбузом','Go for the watermelon'),object:T('Арбуз','Watermelon')}});
  for(const page of NODES.ada_pebbles.pages)page.portrait=false;
  finish('ada_bridge',[
    n('У моста озеро уже, а променад шумнее от велосипедов. На ступеньках вышки стоит спасатель без футболки, со свистком и спокойным лицом.','By the bridge the lake is narrower and the promenade is noisier with bicycles. A shirtless lifeguard stands on the tower steps, with a whistle and a calm face.'),
    say(NENAD,'Если нужна тишина, галька позади. Если тень и кафе — оставайтесь на этой стороне.','If you want quiet, the pebbles are behind you. If you want shade and a cafe, stay on this side.'),
    n('Я говорю, что хочу ничего не делать. Он один раз усмехается.','I say I want to do nothing. He laughs once.'),
    say(NENAD,'Тогда вы в правильном городе. Лубеница — вон там. Съешьте, пока она не стала планом.','Then you are in the right city. The watermelon is over there. Eat it before it turns into a plan.')
  ],'ada_melon_bridge',{time:'21:28',bg:'ada-nenad-bridge-v1',exitAction:{kind:'tap',label:T('Купить лубеницу','Buy the watermelon'),object:T('Лубеница','Watermelon')}});
  for(const page of NODES.ada_bridge.pages)page.portrait=false;
  const share=varied('Я ем медленно и никуда не спешу.','I eat slowly and I am not hurrying anywhere.',{
    alone:T('Я покупаю дольку и отдаю половину продавцу. Мы едим молча. Просто доедаем — без новых планов.','I buy a slice and give half to the seller. We eat in silence. Just finishing the fruit — no new plans.'),
    nikola:T('Никола берёт свою долю и молчит. Мы просто едим. Просто доедаем и молчим — без новых планов.','Nikola takes his share and stays quiet. We just eat. Just finishing the fruit in silence — no new plans.'),
    milica:T('Милица сначала рисует корку, потом всё-таки ест. Блокнот остаётся закрытым.','Milica draws the rind first, then eats after all. The notebook stays shut.'),
    dragan:T('Драган говорит, что арбуз — единственный десерт, который не нужно планировать.','Dragan says watermelon is the only dessert that does not need planning.'),
    jelena:T('Йелена делит дольку поровну и не превращает это в разговор о квартире.','Jelena splits the slice evenly and does not turn it into a talk about the flat.'),
    ana:T('Ана крутит корку в руках, камера остаётся в сумке, и только потом откусывает.','Ana turns the rind in her hands, the camera stays in her bag, and only then takes a bite.'),
    stefan:T('Стефан вытирает руки и смеётся: сегодня стол чинить не нужно.','Stefan wipes his hands and laughs: the table does not need fixing today.'),
    marko:T('Марко сначала предлагает салфетку, потом вспоминает, что можно просто есть.','Marko offers a napkin first, then remembers that we can just eat.'),
    vuk:T('Вук снимает наушники на время дольки. Это и есть весь жест.','Vuk takes off his headphones for the slice. That is the whole gesture.')
  });
  finish('ada_melon_pebbles',[
    n('Долька огромная, холодная и стоит меньше, чем мои сегодняшние мысли.','The slice is huge and cold, and it costs less than my thoughts today.'),
    say(BOJAN,'Берите спокойно. Арбуз здесь не спрашивает, с кем вы пришли.','Take your time. The watermelon here does not ask who you came with.'),
    share,
    n('Сок остаётся на запястье. Никто не просит документ. Я доедаю до зелёной корки.','Juice stays on my wrist. Nobody asks for a document. I eat down to the green rind.')
  ],'ada_home',{time:'21:40',bg:'ada-melon-cafe-v1',adaPortrait:true,exitAction:{kind:'tap',label:T('Доесть и выдохнуть','Finish eating and breathe out'),object:T('Корка','The rind')}});
  NODES.ada_melon_pebbles.pages[1].portrait=false;
  finish('ada_melon_bridge',[
    n('У кафе под зонтом лежат такие же холодные дольки. Я беру одну, не превращая это в заказ ужина.','Under the cafe umbrella there are the same cold slices. I take one without turning it into an order for dinner.'),
    say(VESNA,'Режьте сразу. На жаре арбуз не ждёт красивых планов.','Cut it now. In this heat the watermelon does not wait for elegant plans.'),
    share,
    n('Я ем до корки. Вода рядом шумит ровно и ни о чём не напоминает.','I eat down to the rind. The water nearby sounds steady and reminds me of nothing.')
  ],'ada_home',{time:'21:40',bg:'ada-melon-cafe-v1',adaPortrait:true,exitAction:{kind:'tap',label:T('Доесть лубеницу','Finish the watermelon'),object:T('Корка','The rind')}});
  NODES.ada_melon_bridge.pages[1].portrait=false;
  finish('ada_home',[
    n('Свет становится плоским и золотым. Я споласкиваю руки у колонки.','The light goes flat and gold. I rinse my hands at a tap.'),
    varied('Я один{a}, и мне этого хватает.','I am on my own, and that is enough.',{
      alone:T('Я один{a}, и мне этого хватает.','I am on my own, and that is enough.'),
      nikola:T('Мы с Николой идём к автобусу молча. После реки этого достаточно.','Nikola and I walk to the bus in silence. After the river, that is enough.'),
      milica:T('Мы с Милицей идём молча. Блокнот так и не открылся. Это тоже был отдых.','Milica and I walk in silence. The notebook never opened. That was a rest too.'),
      dragan:T('Драган провожает до остановки и не достаёт ключи. Сегодня они не нужны.','Dragan walks me to the stop and does not take out his keys. They are not needed today.'),
      jelena:T('Йелена машет уже из тени деревьев. Мы не назначаем следующий вечер.','Jelena waves from the shade of the trees. We do not set another evening.'),
      ana:T('Ана говорит, что сегодня ей важнее тишина, чем любой кадр. Мы расходимся у автобуса.','Ana says silence matters more to her today than any shot. We part at the bus.'),
      stefan:T('Стефан зевает первым и считает это победой.','Stefan yawns first and counts that as a victory.'),
      marko:T('Марко не даёт советов на дорожку. Я благодарю его именно за это.','Marko offers no advice for the road. I thank him for exactly that.'),
      vuk:T('Вук снова надевает наушники и кивает. Этого прощания достаточно.','Vuk puts his headphones back on and nods. That goodbye is enough.')
    }),
    n('Автобус пахнет кремом от солнца и арбузом.','The bus smells of sunscreen and watermelon.'),
    n('Завтра банк. Сегодня — чистая усталость, и она мне подходит.','Tomorrow is the bank. Today is a clean tiredness, and it suits me.')
  ],'chapter_three_close',{time:'21:55',bg:'ada-promenade-v1',adaPortrait:true,journal:['ada_rest'],exitAction:{kind:'tap',label:T('Вернуться домой','Go back home'),object:T('Автобус','The bus')}});
  // Stay-home messaging is already a quiet evening; do not force a trip to Ada after “good night”.
  for(const id of ['date_kiss','date_hand','date_slow','date_friends']){
    const node=NODES[id];if(!node)continue;
    if(node.next==='chapter_three_close')node.next='ada_tired';
    for(const choice of node.choices??[])if(choice.next==='chapter_three_close')choice.next='ada_tired';
  }
  // Soft refuse after the river invite should still reach Ada, same as saying goodbye at the embankment.
  if(NODES.nikola_park_decline?.next==='chapter_three_close')NODES.nikola_park_decline.next='ada_tired';
}
