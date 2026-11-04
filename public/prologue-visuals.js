// Page identity preserves every legacy scene and page index.
export const BAKERY_ART={
 'taxi-navigation-v1':{label:'В машине',description:'Вид с заднего сиденья: водитель вводит адрес в навигатор',position:'50% 32%'},
 'nikola-daydream-pastries-v1':{label:'Воображение',description:'Тёмная фантазия с круассанами, булочками и сердечками',position:'50% 50%'},
 'nikola-elder-bread-handover-v1':{label:'Пекарня · у прилавка',description:'Никола передаёт пожилому покупателю бумажный пакет с выпечкой',position:'50% 38%'},
 'nikola-bakery-lookback-v1':{label:'Аэропорт · взгляд на пекарню',description:'Издалека видно, как Никола обслуживает покупателя и ловит взгляд героя',position:'50% 42%'}
};
const moments=new WeakMap();
export function registerPrologueVisuals(nodes,backgrounds){
 Object.assign(backgrounds,BAKERY_ART);
 moments.set(nodes.road_start.pages[1],{bg:'taxi-navigation-v1',composite:true,hideContact:true});
 for(const index of [0,1])moments.set(nodes.nikola_questions.pages[index],{bg:'nikola-elder-bread-handover-v1',composite:true});
 for(const index of [0,1,2,3,4])moments.set(nodes.nikola_last.pages[index],{bg:'nikola-bakery-lookback-v1',composite:true});
}
export function prologueVisualFor(node,page,daydream){
 if(daydream&&node.character==='nikola')return{bg:'nikola-daydream-pastries-v1',composite:false};
 return moments.get(page)??null;
}
