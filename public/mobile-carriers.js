import {T} from './days.js?v=0.17.15';

// Three fictional shop visits in day 3. Names, prices and plans are not offers.
export const MOBILE_CARRIERS=[
 {id:'a1',name:'A1',employee:T('Милан','Milan'),portrait:'mobile-a1-staff',background:'mobile-a1-shop-v1',alt:T('Милан: сотрудник A1 в красном поло','Milan, an A1 consultant wearing a red polo'),description:T('Светлый салон A1 с красными деталями','A bright A1 store with red accents')},
 {id:'yettel',name:'Yettel',employee:T('Тара','Tara'),portrait:'mobile-yettel-staff',background:'mobile-yettel-shop-v1',alt:T('Тара: сотрудница Yettel в тёмной форме','Tara, a Yettel consultant wearing a dark uniform'),description:T('Салон Yettel с тёмно-синими и зелёными деталями','A Yettel store with navy and green accents')},
 {id:'mts',name:'mts',employee:T('Мирьяна','Mirjana'),portrait:'mobile-mts-staff',background:'mobile-mts-shop-v1',alt:T('Мирьяна: сотрудница mts в деловой форме','Mirjana, an mts consultant in professional attire'),description:T('Светлый салон mts с красными деталями','A bright mts store with red accents')}
];
const note=(ru,en)=>({speaker:'narrator',text:T(ru,en)});
const speech=(speaker,ru,en)=>({speaker,text:T(ru,en)});
export function extendMobileCarriers({NODES:N,BACKGROUNDS:B,CHARACTER_SPRITES:S,scene}){
 for(const carrier of MOBILE_CARRIERS){
  B[carrier.background]={label:T('БЕЛГРАД · САЛОН СВЯЗИ','BELGRADE · MOBILE SHOP')+' · '+carrier.name,description:carrier.description,position:'50% 45%'};
  S[carrier.portrait]={friendly:{file:carrier.portrait+'-v1',alt:carrier.alt}};
 }
 N.d3_o1.pages[0]=note('По пути замечаю несколько салонов связи. Прежде чем зайти, хочу решить, какой оператор мне подходит.','On my way I notice several mobile shops. Before going in, I want to decide which operator suits me.');
 N.d3_o1.pages[1]=note('Мне важны интернет, понятные условия и возможность начать без долгого договора.','I want data, clear terms and a way to get started without a long contract.');
 const selectAction={kind:'tap',label:T('Посмотреть операторов','See the operators'),object:T('Посмотреть операторов','See the operators')};
 N.d3_o1.exitAction=selectAction;N.d3_o1.actions[1]=selectAction;N.d3_o1.pages[1].action=selectAction;
 for(const id of ['d3_o1','d3_o2','d3_o3'])N[id].next='d3_mobile_choice';
 const place=T('БЕЛГРАД · ВЫБОР ОПЕРАТОРА','BELGRADE · CHOOSING A MOBILE OPERATOR');
 N.d3_mobile_choice=scene([
  note('У каждого оператора свои условия. Выберу салон и уточню доступные варианты на месте.','Each operator has its own terms. I will pick a shop and ask about the options available there.')
 ],null,{bg:'belgrade-morning-cafe',location:place,time:'10:15',choices:MOBILE_CARRIERS.map(carrier=>({label:carrier.name,tone:'practical',next:'d3_mobile_'+carrier.id,effect:{mobileCarrier:carrier.id}}))});
 const lines={
  a1:{intro:['Добро пожаловать в A1. Я Милан. Тебе важнее интернет, звонки или всё понемногу?','Welcome to A1. I’m Milan. Is data, calling, or a bit of both more important to you?'],answer:['Давай посмотрим, какие варианты доступны сегодня. Покажу срок действия и условия пополнения, чтобы можно было спокойно сравнить.','Let’s see what is available today. I’ll show you the validity period and top-up terms so you can compare at your own pace.']},
  yettel:{intro:['Привет! Я Тара, добро пожаловать в Yettel. Расскажи, как часто тебе нужен мобильный интернет.','Hi! I’m Tara, welcome to Yettel. Tell me how often you need mobile data.'],answer:['Посмотрим доступные пакеты и условия пополнения. Если захочешь, покажу всё на экране, чтобы было проще сравнить.','Let’s look at the available bundles and top-up terms. I can show you everything on the screen so it is easier to compare.']},
  mts:{intro:['Добрый день, я Мирьяна. Добро пожаловать в mts. Подбираем номер для жизни в Белграде?','Good afternoon, I’m Mirjana. Welcome to mts. Are we looking for a number for life in Belgrade?'],answer:['Тогда начнём с того, сколько интернета тебе нужно. Я покажу доступные варианты и объясню, как пополняется счёт.','Then let’s start with how much data you need. I’ll show you the available options and explain how to top up your balance.']}
 };
 for(const carrier of MOBILE_CARRIERS){
  const dialog=lines[carrier.id];
  const exit={kind:'tap',label:T('Выйти с новым номером','Walk out with a new number'),object:T('Выйти с новым номером','Walk out with a new number')};
  N['d3_mobile_'+carrier.id]=scene([
   note('В салоне я подхожу к стойке и готовлю вопросы про местный номер.','Inside the shop I approach the counter and get my questions about a local number ready.'),
   speech(carrier.employee,...dialog.intro),
   {speaker:'player',text:T('Мне нужен интернет и понятные условия. Можно посмотреть варианты без долгого контракта?','I need data and clear terms. Could we look at options without a long contract?')},
   speech(carrier.employee,...dialog.answer),
   note('Я уточняю документы и стоимость, прошу показать условия и выбираю подходящий вариант. Теперь у меня есть местный номер.','I ask about the documents and cost, request the terms and choose an option that suits me. Now I have a local number.')
  ],'d3_mid',{bg:carrier.background,location:T('БЕЛГРАД · САЛОН СВЯЗИ','BELGRADE · MOBILE SHOP')+' · '+carrier.name,time:'10:25',character:carrier.portrait,carrierBrand:carrier.name,exitAction:exit,actions:{4:exit}});
 }
 const old=N.d3_mid.pages[0].text;
 N.d3_mid.pages[0].byFlag={flag:'errand',text:{phone:old,card:T('Осталось заглянуть в обменник. Я сравниваю курс и сохраняю чек.','The exchange office is the last stop. I compare the rate and keep the receipt.'),money:T('Осталось найти проездную карту. В киоске помогают разобраться с пополнением.','The transport card is the last stop. Someone at the kiosk helps me understand how to top it up.'),default:old}};
}
