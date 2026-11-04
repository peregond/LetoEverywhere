// The first evening with the first host: the old town, a candlelit terrace, a first taste of Serbian food and a choice of pace.
// Closeness is always asked for aloud. Nothing here changes the old scene IDs; the walk simply continues past host_evening.
import {T} from './flat-data.js?v=1';

const N=(ru,en,extra={})=>({speaker:'narrator',text:T(ru,en),...extra});
const P=(ru,en,extra={})=>({speaker:'player',text:T(ru,en),...extra});
const H=(ru,en,extra={})=>({speaker:'host',text:T(ru,en),...extra});
const both=(speaker,dragan,jelena,extra={})=>({speaker,text:T(...dragan),hostText:{dragan:T(...dragan),jelena:T(...jelena)},...extra});
const tap=(label,en,extra={})=>({kind:'tap',label:T(label,en),object:T(label,en),...extra});
const choice=(label,en,next,tone,effect)=>({label:T(label,en),next,tone,...(effect?{effect}:{})});
// The standing portraits that hold the keys are not used on the evening walk: the keys were handed over in the flat.
// Until a dedicated evening outfit exists, the key-free poses stand in (see artwork/PENDING_ILLUSTRATIONS.md).
const EVENING_POSE={friendly:'confident',thoughtful:'worried',laughing:'surprised',flirty:'confident',shy:'worried',confident:'confident',worried:'worried',surprised:'surprised'};
export const EVENING_NODES=['host_evening','host_old_town','host_terrace','host_terrace_meal','host_evening_close','host_evening_goodnight'];

export function extendHostEvening({NODES,JOURNAL}){
  const walk=NODES.host_evening;
  const arrival=NODES.road_start.chapterId;
  const base={bg:'belgrade-night-walk',location:T('БЕЛГРАД · СТАРЫЙ ГОРОД','BELGRADE · OLD TOWN'),time:'20:25',music:'encounter',hostPortrait:true,chapterId:walk.chapterId??arrival,chapter:walk.chapter,lighting:'night'};
  const finish=(id,pages,next,extra={})=>{
    const node={...base,pages,next,...extra};
    node.actions={...(node.actions??{})};
    pages.forEach((page,index)=>{if(page.action&&!node.actions[index])node.actions[index]=page.action;});
    if(!node.choices){const index=pages.length-1;if(!node.actions[index])node.actions[index]=structuredClone(node.exitAction??tap('Продолжить','Continue'));}
    for(const [index,action]of Object.entries(node.actions))pages[Number(index)].action=action;
    pages.forEach(page=>{page.emotion??='confident';});
    NODES[id]=node;return node;
  };
  Object.assign(JOURNAL,{
    host_terrace:{title:T('Терраса и первый ужин','The terrace and a first dinner'),tag:T('ЛЮДИ · ВЕЧЕР','PEOPLE · EVENING'),text:T('Старый город, свечи на террасе и первое знакомство с сербской кухней: айвар, чевапчичи, плескавица. Темп вечера выбирал{a} я сам{a}.','The old town, candles on the terrace and a first taste of Serbian food: ajvar, ćevapi, pljeskavica. I chose the pace of the evening myself.')}
  });

  // The evening starts in a courtyard that looks like evening, and the walk no longer ends at the first corner.
  walk.bg='belgrade-courtyard-evening-v1';walk.lighting='night';
  walk.choices=undefined;delete walk.choices;walk.next='host_old_town';
  walk.exitAction=tap('Выйти со двора на старые улицы','Leave the courtyard for the old streets');
  walk.actions[5]=walk.exitAction;walk.pages[5].action=walk.exitAction;
  for(const id of ['host_evening_close','host_evening_goodnight']){
    NODES[id].bg='belgrade-courtyard-evening-v1';NODES[id].lighting='night';NODES[id].time='21:35';
    // The daylight door picture would pull the scene back into the afternoon.
    for(const action of Object.values(NODES[id].actions??{}))delete action.bg;
  }
  for(const id of ['host_evening_close','host_evening_goodnight']){
    const action=NODES[id].actions?.[NODES[id].pages.length-1];
    if(action)action.bg='courtyard-door-evening-v1';
  }
  NODES.host_evening.time='20:10';
  // The reply to the invitation jokes about the spilled coffee only if the coffee scene actually happened.
  const invite=NODES.host_evening_invite.pages[1];
  const plain=invite.hostText;
  const joke={dragan:T('«С удовольствием. Через полчаса буду во дворе. Только давай сегодня без кофе в руках: помню про половицу».','“With pleasure. I will be in the courtyard in half an hour. Just no coffee in our hands tonight; I remember the floorboard.”'),jelena:T('«Давай. Через полчаса буду во дворе. Только сегодня без кофе в руках: помню про половицу».','“Sure. I will be in the courtyard in half an hour. Just no coffee in our hands tonight; I remember the floorboard.”')};
  invite.byFlag={flag:['host','hostCoffeeSpilled'],text:{'dragan:true':joke.dragan,'jelena:true':joke.jelena,'dragan:':plain.dragan,'jelena:':plain.jelena,'dragan:false':plain.dragan,'jelena:false':plain.jelena,default:plain.dragan}};

  finish('host_old_town',[
    N('Мы выходим со двора и идём вниз, к старому городу. Фонари уже горят, из окон пахнет жареным луком и кофе, где-то далеко играет аккордеон.','We leave the courtyard and walk down toward the old town. The lamps are lit, the windows smell of fried onions and coffee, and an accordion plays somewhere far off.',{portrait:false}),
    both('host',['Каждый второй дом здесь старше моих родителей. Я мог бы показывать их до самого утра, но сначала нужно поесть. Ты уже пробовал{a} местную еду?','Every second house here is older than my parents. I could show them to you until morning, but first we need to eat. Have you tried the local food yet?'],['Каждый второй дом здесь старше моих родителей. Я могла бы показывать их до самого утра, но сначала нужно поесть. Ты уже пробовал{a} местную еду?','Every second house here is older than my parents. I could show them to you until morning, but first we need to eat. Have you tried the local food yet?'],{emotion:'friendly'}),
    P('Только аэропортную выпечку. Веди меня к настоящей.','Only airport pastries. Take me to the real thing.',{emotion:'friendly'}),
    H('Тогда терраса за поворотом. Хозяин меня знает и не принесёт туристическое меню.','Then there is a terrace around the corner. The owner knows me and will not bring a tourist menu.',{emotion:'friendly'}),
    N('Мы сворачиваем в узкий проулок, и между лозами и свечами возникает маленькая терраса. Над столами горят лампы, а вдали белеет храм.','We turn into a narrow alley, and between vines and candles a small terrace appears. Lamps glow over the tables and a white church gleams in the distance.',{portrait:false,action:tap('Сесть за столик на террасе','Take a table on the terrace')})
  ],'host_terrace',{time:'20:25'});
  finish('host_terrace',[
    N('На столе горят свечи в стеклянных стаканах. Официант ставит между нами корзинку с хлебом и миску тёмно-красной пасты.','Candles burn in glass jars on the table. The waiter sets a basket of bread and a bowl of dark red paste between us.'),
    H('Это айвар: запечённый перец с баклажаном. Мажь на хлеб. Он бывает мягким, а бывает с огоньком. Сегодня проверим вместе.','This is ajvar: roasted pepper with aubergine. Spread it on bread. Sometimes it is mild and sometimes it bites. Tonight we will find out together.',{emotion:'friendly'}),
    H('Дальше есть чевапчичи: маленькие колбаски на углях. И плескавица: это как большая котлета, только лучше. Что тебе хочется?','Next there are ćevapi, little grilled sausages, and pljeskavica, which is like a big patty, only better. What do you feel like?',{emotion:'thoughtful'}),
    N('В меню одна страница, а мнений о ней сразу три.','The menu is one page long, and there are three opinions about it at once.')
  ],null,{time:'20:50',bg:'belgrade-cafe-twilight',journal:['host_terrace'],choices:[
    choice('Чевапчичи, как у местных','Ćevapi, like the locals','host_terrace_meal','explore',{hostMeal:'cevapi'}),
    choice('Плескавицу: посмотреть, что это','Pljeskavica, to see what it is','host_terrace_meal','explore',{hostMeal:'pljeskavica'}),
    choice('Айвар, хлеб и салат: сначала понемногу','Ajvar, bread and salad: a little first','host_terrace_meal','explore',{hostMeal:'ajvar'})
  ]});
  const meals={
    cevapi:['Чевапчичи приходят на горячей тарелке: колбаски, лепёшка и лук. Пахнет дымом, и я забываю про вилку.','The ćevapi arrive on a hot plate with flatbread and onion. It smells of smoke and I forget about my fork.'],
    pljeskavica:['Плескавица размером с ладонь, с луком и каймаком. Одолеть её прилично не получается, и мы смеёмся.','The pljeskavica is the size of a palm, with onion and kajmak. There is no polite way to finish it, and we laugh.'],
    ajvar:['Я пробую айвар на хлебе, потом ещё раз. Он дымный, сладкий и чуть острый. Салат приходит позже и почти незаметен.','I try the ajvar on bread, then again. It is smoky, sweet and a little spicy. The salad comes later and hardly gets noticed.']
  };
  const mealText=Object.fromEntries(Object.entries(meals).map(([key,pair])=>[key,T(...pair)]));
  finish('host_terrace_meal',[
    N(...meals.cevapi,{byFlag:{flag:'hostMeal',text:{...mealText,default:mealText.cevapi}}}),
    P('Очень вкусно. Ты часто сюда приходишь?','This is delicious. Do you come here often?',{emotion:'friendly'}),
    H('Когда хочется спокойно поужинать. Здесь меня уже знают и никогда не торопят. Polako.','When I want a peaceful dinner. They know me here and never rush me. Polako.',{emotion:'friendly'}),
    both('host',['Давно не было вечера, когда никуда не нужно спешить. Рад, что ты рядом.','It has been a while since an evening when I did not have to hurry anywhere. I am glad you are here.'],['Давно не было вечера, когда никуда не нужно спешить. Рада, что ты рядом.','It has been a while since an evening when I did not have to hurry anywhere. I am glad you are here.'],{emotion:'thoughtful'})
  ],null,{time:'21:10',bg:'belgrade-cafe-twilight',choices:[
    choice('«Я надеюсь, это не последняя такая прогулка»','“I hope this is not the last walk like this”','host_evening_close','romance',{hostEvening:'close'}),
    choice('Сказать, что мне хорошо, но не торопить события','Say that I feel good but do not want to rush things','host_evening_goodnight','personal',{hostEvening:'slow'}),
    choice('Поблагодарить за компанию и вернуться отдыхать','Thank them for the company and go back to rest','host_evening_goodnight','friendship',{hostEvening:'friend'})
  ]});

  // Standing portraits on the evening walk: no keys in hand.
  for(const id of EVENING_NODES){
    for(const page of NODES[id].pages){
      page.reactions??={};
      for(const person of ['dragan','jelena']){
        const mood=page.reactions[person]??page.emotion??'friendly';
        page.reactions[person]=EVENING_POSE[mood]??'confident';
      }
    }
  }
}
