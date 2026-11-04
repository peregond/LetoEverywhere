// Supporting roles have a base portrait, not a romance/emotion collection.
export const EPISODIC_CAST={
 'guest-bank-helper':{name:'Борис',alt:'Борис в малиновом пиджаке'},
 'guest-bank-nevena':{name:'Невена',alt:'Невена'},
 'guest-bank-bogdan':{name:'Богдан',alt:'Богдан'},
 'guest-mom':{name:'Мама',alt:'Мама: женщина с седеющими каштановыми волосами в голубом кардигане'},
 'guest-bank-staff':{name:'Сотрудник банка',alt:'Сотрудник банка: зрелый мужчина в очках со светлой рубашкой и папкой'},
 'guest-mobile-staff':{name:'Сотрудник салона связи',alt:'Сотрудник салона связи: молодой мужчина с рыжими кудрями в жёлтом поло'},
 'guest-kiosk-seller':{name:'Продавец в киоске',alt:'Продавец в киоске: пожилой мужчина с седыми усами и транспортной картой'},
 'guest-translator':{name:'Переводчица',alt:'Переводчица: женщина с тёмными волнистыми волосами и папкой документов'},
 'guest-support-operator':{name:'Оператор поддержки',alt:'Оператор поддержки: женщина с гарнитурой в бирюзовой блузке'},
 'guest-client':{name:'Клиент',alt:'Клиент: мужчина с тёмными кудрями и бородой, с ноутбуком под рукой'},
 'guest-market-seller':{name:'Продавец на рынке',alt:'Продавец на рынке: мужчина с седой бородой, в кепке и фартуке, с корзиной фруктов'},
 'guest-bakery-seller':{name:'Продавщица в булочной',alt:'Продавщица в булочной: женщина с короткими медными волосами в белом фартуке'},
 'guest-passerby':{name:'Прохожий',alt:'Прохожий: молодой мужчина в круглых очках с рюкзаком, показывает дорогу'},
 'guest-driver':{name:'Водитель',alt:'Водитель: мужчина с короткой седой щетиной в бордовом поло, с ключами'},
 'guest-waiter':{name:'Официант',alt:'Официант: молодой мужчина с подносом кофе и лимонада'},
 'guest-neighbour':{name:'Сосед',alt:'Сосед: седоволосый мужчина в охристой рубашке несёт складные стулья'},
 'guest-elder-customer':{name:'Пожилой покупатель',alt:'Пожилой покупатель: мужчина с белыми усами в соломенной шляпе, с пакетом из булочной'},
 'guest-documents-adviser':{name:'Специалист по документам',alt:'Специалист по документам: женщина с сединой у висков в очках, с папкой и ручкой'}
};
export const EPISODIC_PEOPLE=Object.fromEntries(Object.entries(EPISODIC_CAST).map(([id,person])=>[id,person.name]));
export const EPISODIC_AVATARS=Object.fromEntries(Object.entries(EPISODIC_CAST).map(([id,person])=>[person.name,id+'-friendly.webp']));
// Scene IDs and page indices are references only; no story pages are inserted or rewritten.
export const EPISODIC_STAGES=[
 ...['bank_visit','bank_documents','bank_cost'].flatMap(id=>[0,1,2].map(index=>[id,index,'guest-bank-staff','scene'])),
 ['bank_approved',2,'guest-bank-staff','scene'],
 ...[0,1].map(index=>['d3_m1',index,'guest-bakery-seller','scene']),
 ['d10_o3',1,'guest-translator','contact','На связи'],
 ...[0,1].map(index=>['d13_m1',index,'guest-support-operator','contact','Звонок']),
 ['d18_mid',0,'guest-client','contact','Звонок'],
 ['d19_o2',0,'guest-waiter','scene'],['d19_o3',0,'guest-market-seller','scene'],
 ...[0,1].map(index=>['d25_o1',index,'guest-bakery-seller','scene']),
 ['d25_o2',1,'guest-market-seller','scene'],['d25_m1',0,'guest-passerby','scene'],
 ['road_start',1,'guest-driver','contact','В машине'],['road_contact',2,'guest-driver','contact','В машине'],
 ['d28_o1',1,'guest-neighbour','scene'],['d28_o3',0,'guest-neighbour','scene'],
 ...[0,1].map(index=>['nikola_questions',index,'guest-elder-customer','scene']),
 ['residence_submit',0,'guest-documents-adviser','scene'],
 ['d23_start',0,'guest-mom','contact','Письмо']
];
const staging=new WeakMap();
export function applyEpisodicCast(nodes,sprites){
 for(const[id,person]of Object.entries(EPISODIC_CAST))sprites[id]={friendly:{file:id+'-friendly',alt:person.alt}};
 for(const[id,index,character,mode,channel]of EPISODIC_STAGES){
  const page=nodes[id]?.pages[index];if(!page)throw Error('Unknown supporting portrait frame '+id+':'+index);
  staging.set(page,{character,mode,name:EPISODIC_CAST[character].name,channel:channel??'',file:character+'-friendly.webp',alt:EPISODIC_CAST[character].alt});
 }
}
export function episodicPresentationFor(page){return staging.get(page)??null;}
