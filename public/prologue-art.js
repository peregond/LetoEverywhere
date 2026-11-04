export const SEATED_MILICA_ART={friendly:'milica-table-friendly',thoughtful:'milica-table-thoughtful',laughing:'milica-table-laughing',flirty:'milica-table-flirty'};
export function registerPrologueArt(nodes,backgrounds){
 for(const [mood,id]of Object.entries(SEATED_MILICA_ART))backgrounds[id]={label:'КАФЕ · МИЛИЦА ЗА СТОЛИКОМ',description:'Милица сидит за столиком у окна с керамической чашкой: '+{friendly:'улыбается',thoughtful:'внимательно слушает',laughing:'смеётся',flirty:'заинтересованный взгляд'}[mood],position:'50% 25%'};
 backgrounds['milica-sketch-bouquet']={label:'РИСУНОК В БЛОКНОТЕ',description:'Открытый блокнот Милицы: карандашный набросок мужчины с букетом за спиной',position:'50% 50%'};
 for(const id of ['quick_coffee','milica_chemistry','coffee_start','city','sketch','pause','weeks','new_life','unsure','phone','host','friend','contact','milica_flirt'])nodes[id].seatedMilica=true;
 nodes.quick_coffee.pages[0].text='Мы садимся у окна с кофе. Милица держит чашку за ручку; рядом лежит открытый блокнот.';
 nodes.city.pages[8].text='Она улыбается и пододвигает салфетку к оставшемуся от чашки мокрому кружку.';
 nodes.pause.pages[1].text='Милица поворачивает чашку на блюдце. На пальце у неё полоска синей краски.';
 nodes.phone.pages[0].text='Телефон вибрирует между нашими чашками. Сообщение от Драгана. Я хватаю его так быстро, что Милица поднимает бровь.';
 for(let i=4;i<nodes.contact.pages.length;i++)nodes.contact.pages[i].seatedMilica=false;
 // Once the notebook is open, show its contents, with no second request to open it.
 for(let i=2;i<=7;i++)Object.assign(nodes.sketch.pages[i],{bg:'milica-sketch-bouquet',portrait:false,seatedMilica:false,insert:true});
 Object.assign(nodes.sketch.actions[2],{label:'Рассмотреть рисунок',object:'Рисунок',bg:'milica-sketch-bouquet'});
 Object.assign(nodes.sketch.actions[7],{label:'Перевернуть страницу',object:'Следующая страница',bg:'milica-sketch-bouquet'});
 for(const id of ['coffee_start','city','sketch','pause','phone','host','friend','contact'])for(const action of Object.values(nodes[id].actions??{})){
  action.label=action.label.replace('пустой стакан','пустую чашку').replace('стакан','чашку');
  action.object=action.object?.replace('Стакан','Чашка');
 }
}
